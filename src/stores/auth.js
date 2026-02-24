import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    profile: null,
    loading: false
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    userName: (state) => state.profile?.full_name || state.user?.email || 'Пользователь',
    userInitials: (state) => {
      const name = state.profile?.full_name || state.user?.email || '?'
      if (name.includes(' ')) {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
      }
      return name[0].toUpperCase()
    }
  },


  actions: {
    async init() {
      const { data: { session } } = await supabase.auth.getSession()

      if (session?.user) {
        this.user = session.user
        await this.fetchProfile(session.user.id)
      }

      supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          this.user = session.user
          await this.fetchProfile(session.user.id)
        } else if (event === 'SIGNED_OUT') {
          this.user = null
          this.profile = null
        }
      })
    },

    async fetchProfile(userId) {
      const { data, error } = await supabase // 👈 Стало
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle() // 👈 Стало (замени .single() на .maybeSingle())

      if (!error) {
        this.profile = data
      } else {
        console.error('Error fetching profile:', error)
      }
    },

    async signUp(email, password, fullName) {
      this.loading = true
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } }
      })

      if (!error && data.user) {
        await supabase.from('profiles').insert({
          id: data.user.id,
          full_name: fullName
        })
      }
      this.loading = false
      return { data, error }
    },

    async updateUserStatus(status) {
      if (!this.user?.id) return

      const { error } = await supabase
        .from('profiles')
        .update({
          status,
          last_seen: new Date().toISOString()
        })
        .eq('id', this.user.id)

      if (error) console.error('Error updating status:', error)
    },

    // В actions
    async refreshUser() {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        this.user = session.user
        await this.fetchProfile(session.user.id)
      }
    },

    // При входе
    async signIn(email, password) {
      this.loading = true
      const { data, error } = await supabase.auth.signInWithPassword({
        email, password
      })

      if (!error && data.user) {
        this.user = data.user
        await this.fetchProfile(data.user.id)
        await this.updateUserStatus('online') // 👈 устанавливаем статус "online"
      }

      this.loading = false
      return { data, error }
    },

    // При выходе
    async signOut() {
      await this.updateUserStatus('offline') // 👈 устанавливаем "offline"
      await supabase.auth.signOut()
      this.user = null
      this.profile = null
    }
  }
})
