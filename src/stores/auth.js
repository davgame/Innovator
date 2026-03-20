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
      console.log('📡 Fetching profile for:', userId)

      const { data, error } = await supabase
        .from('profiles')
        .select('*, organizations(*)')
        .eq('id', userId)
        .maybeSingle()

      if (!error) {
        this.profile = data
        console.log('✅ Profile loaded:', data)
      } else {
        console.error('❌ Error fetching profile:', error)
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

    // auth.js - убедитесь, что функция работает
    async updateUserStatus(status) {
      if (!this.user?.id) {
        console.log('⚠️ Нет пользователя для обновления статуса')
        return
      }

      console.log('🔄 Обновление статуса на:', status, 'для пользователя:', this.user.id)

      const { error } = await supabase
        .from('profiles')
        .update({
          status,
          last_seen: new Date().toISOString()
        })
        .eq('id', this.user.id)

      if (error) {
        console.error('❌ Ошибка обновления статуса:', error)
      } else {
        console.log('✅ Статус обновлен на:', status)
        if (this.profile) {
          this.profile.status = status
          this.profile.last_seen = new Date().toISOString()
        }
      }
    },

  // В actions
  async refreshUser() {
    const { data: { session } } = await supabase.auth.getSession()
    console.log('🔄 refreshUser session:', session)

    if (session?.user) {
      this.user = session.user
      await this.fetchProfile(session.user.id)
    } else {
      console.warn('⚠️ Нет активной сессии')
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

        // 👇 ВАЖНО: обновляем статус в БД
        await this.updateUserStatus('online')

        // 👇 ДОПОЛНИТЕЛЬНО: принудительно обновляем профиль
        await this.fetchProfile(data.user.id)

        console.log('✅ Статус установлен: online для пользователя:', data.user.id)
      }

      this.loading = false
      return { data, error }
    },

    
    // auth.js
    async updateLastSeen() {
      if (!this.user?.id) return

      const { error } = await supabase
        .from('profiles')
        .update({
          last_seen: new Date().toISOString(),
          status: 'online'
        })
        .eq('id', this.user.id)

      if (error) {
        console.error('Ошибка обновления last_seen:', error)
      }
    },

    async signOut() {
  try {
    console.log('1️⃣ Выход, пользователь:', this.user?.id)

    // 👇 СНАЧАЛА обновляем статус
    if (this.user?.id) {
      await supabase
        .from('profiles')
        .update({
          status: 'offline',
          last_seen: new Date().toISOString()
        })
        .eq('id', this.user.id)
    }

    // 👇 ПОТОМ выходим
    await supabase.auth.signOut()

    // 👇 Очищаем локальное состояние
    this.user = null
    this.profile = null

    console.log('✅ Выход выполнен')

  } catch (error) {
    console.error('❌ Ошибка:', error)
  }
},

    // В auth.js - замените функцию uploadResume
    async uploadResume(file, userId) {
      try {
        this.loading = true

        console.log('📡 Загружаю резюме:', file.name, 'для пользователя:', userId)

        if (!file) throw new Error('Файл не передан')
        if (!userId) throw new Error('ID пользователя не передан')

        const fileExt = file.name.split('.').pop()
        const fileName = `resume_${Date.now()}.${fileExt}`
        const filePath = `${userId}/${fileName}`

        console.log('📁 Путь для сохранения:', filePath)

        // Загружаем файл
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('resumes')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true
          })

        if (uploadError) {
          console.error('❌ Ошибка загрузки в storage:', uploadError)
          throw uploadError
        }

        console.log('✅ Файл загружен в storage:', uploadData)

        // Получаем публичный URL
        const { data: { publicUrl } } = supabase.storage
          .from('resumes')
          .getPublicUrl(filePath)

        console.log('🔗 Публичный URL:', publicUrl)

         // 👇 ВОТ СЮДА ВСТАВЬТЕ ПРОВЕРКУ СЕССИИ
        const { data: { session } } = await supabase.auth.getSession();
        console.log('🔍 Сессия:', session);

        if (!session) {
          console.error('❌ Нет активной сессии');
          throw new Error('Пользователь не авторизован');
        }

        // 👇 ПРОВЕРЯЕМ, ЧТО ПОЛЯ СУЩЕСТВУЮТ
        console.log('📝 Обновляю профиль userId:', userId)
        console.log('📝 Данные для обновления:', {
          resume_url: publicUrl,
          resume_name: file.name,
          resume_size: file.size
        })

        // Обновляем профиль
        const { data: updateData, error: updateError } = await supabase
          .from('profiles')
          .update({
            resume_url: publicUrl,
            resume_name: file.name,
            resume_size: file.size,
            updated_at: new Date().toISOString()
          })
          .eq('id', userId)
          .select()  // 👈 добавляем .select() чтобы увидеть результат

        if (updateError) {
          console.error('❌ Ошибка обновления профиля:', updateError)
          console.error('❌ Детали ошибки:', JSON.stringify(updateError, null, 2))
          throw updateError
        }

        console.log('✅ Профиль обновлен, результат:', updateData)

        return { success: true, url: publicUrl }
      } catch (error) {
        console.error('❌ Ошибка загрузки резюме:', error)
        return {
          success: false,
          error: error.message || 'Неизвестная ошибка'
        }
      } finally {
        this.loading = false
      }
    },

    // 👇 ПОЛУЧИТЬ ИНФОРМАЦИЮ О РЕЗЮМЕ
    async getResumeInfo(userId) {
      try {
        console.log('📡 getResumeInfo запрос для:', userId);

        const { data, error } = await supabase
          .from('profiles')
          .select('resume_url, resume_name, resume_size')
          .eq('id', userId)
          .maybeSingle();

        if (error) {
          console.error('❌ Ошибка:', error);
          return null;
        }

        console.log('✅ getResumeInfo ответ:', data);
        return data;
      } catch (error) {
        console.error('❌ Ошибка:', error);
        return null;
      }
    },

    // 👇 УДАЛИТЬ РЕЗЮМЕ
    async deleteResume(userId) {
      try {
        // Удаляем файл из storage
        await supabase.storage
          .from('resumes')
          .remove([`${userId}/resume.pdf`])

        // Очищаем поля в профиле
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            resume_url: null,
            resume_name: null,
            resume_size: null,
            updated_at: new Date().toISOString()
          })
          .eq('id', userId)

        if (updateError) throw updateError

        // Обновляем локальный профиль
        if (this.profile) {
          this.profile.resume_url = null
          this.profile.resume_name = null
          this.profile.resume_size = null
        }

        return { success: true }
      } catch (error) {
        console.error('❌ Ошибка удаления резюме:', error)
        return { success: false, error }
      }
    }
  }
})
