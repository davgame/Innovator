// projectStore.js
import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'

export const useProjectStore = defineStore('project', {
  state: () => ({
    currentProject: null,
    projects: [],
    loading: false,
    error: null
  }),

  getters: {
    hasCurrentProject: (state) => !!state.currentProject,
    projectName: (state) => state.currentProject?.name || 'Без названия'
  },

  actions: {
    setCurrentProject(project) {
    this.currentProject = project
    },
    // Создать новый проект
    async createProject(name) {
      this.loading = true
      this.error = null

      try {
        console.log('📡 Создаю проект:', name)

        const { data: { user } } = await supabase.auth.getUser()

        const { data, error } = await supabase
          .from('projects')
          .insert([
            {
              name: name,
              description: null,
              created_by: user?.id,
              created_at: new Date().toISOString()
            }
          ])
          .select()
          .single()

        if (error) throw error

        console.log('✅ Проект создан:', data)
        this.currentProject = data
        this.projects.unshift(data)

        return data
      } catch (err) {
        this.error = err.message
        console.error('❌ Ошибка создания проекта:', err)
        return null
      } finally {
        this.loading = false
      }
    },

    // projectStore.js - ЗАМЕНИТЕ функцию loadProject
    async loadProject(projectId) {
      this.loading = true
      this.error = null

      try {
        console.log('📡 Загружаю проект ID:', projectId, 'тип:', typeof projectId)

        // 👇 УСИЛЕННАЯ ПРОВЕРКА
        if (!projectId || projectId === 'undefined' || projectId === 'null') {
          console.warn('⚠️ ID проекта невалидный:', projectId)
          this.error = 'ID проекта не указан'
          return null
        }

        // 👇 ПРЕОБРАЗУЕМ ID В ЧИСЛО (ID в БД - числа: 52, 58)
        let id = projectId
        if (typeof projectId === 'string') {
          // Если это строка с числом, преобразуем в Number
          if (!isNaN(projectId) && projectId.trim() !== '') {
            id = Number(projectId)
          } else {
            console.warn('⚠️ Странный ID (не число):', projectId)
            return null
          }
        }

        // Проверяем, что ID - число и не слишком большое
        if (id > 1000000) {
          console.warn('⚠️ ID очень большой, возможно это timestamp:', id)
          // Возможно, ID из localStorage, попробуем найти по имени
          const savedName = localStorage.getItem('currentProjectName')
          if (savedName) {
            this.currentProject = { id: projectId, name: savedName }
            return this.currentProject
          }
        }

        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', id)  // Ищем по числовому ID
          .maybeSingle()

        if (error) {
          console.error('❌ Ошибка запроса:', error)
          throw error
        }

        console.log('✅ Проект загружен:', data)

        if (data) {
          this.currentProject = data
          // Сохраняем правильный ID в localStorage
          localStorage.setItem('currentProjectId', data.id)
        } else {
          console.warn('⚠️ Проект не найден в БД')

          // Пробуем найти по имени
          const savedName = localStorage.getItem('currentProjectName')
          if (savedName) {
            this.currentProject = { id: projectId, name: savedName }
          }
        }

        return data
      } catch (err) {
        this.error = err.message
        console.error('❌ Ошибка загрузки проекта:', err)
        return null
      } finally {
        this.loading = false
      }
    },

    // Загрузить все проекты пользователя
    async loadUserProjects() {
      this.loading = true
      this.error = null

      try {
        // 👇 ИСПРАВЛЕНО: правильный способ получить пользователя
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (userError) throw userError

        if (!user) {
          throw new Error('Пользователь не авторизован')
        }

        console.log('📡 Загружаю проекты пользователя:', user.id)

        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('created_by', user.id)
          .order('created_at', { ascending: false })

        if (error) throw error

        console.log('✅ Загружено проектов:', data?.length || 0)
        this.projects = data || []

        return this.projects
      } catch (err) {
        this.error = err.message
        console.error('❌ Ошибка загрузки проектов:', err)
        return []
      } finally {
        this.loading = false
      }
    },

    // Обновить название проекта
    async updateProjectName(projectId, newName) {
      this.loading = true
      this.error = null

      try {
        console.log('📡 Обновляю название проекта:', projectId, newName)

        const { data, error } = await supabase
          .from('projects')
          .update({ name: newName })
          .eq('id', projectId)
          .select()
          .single()

        if (error) throw error

        console.log('✅ Название обновлено:', data)

        if (this.currentProject?.id === projectId) {
          this.currentProject = data
        }

        const index = this.projects.findIndex(p => p.id === projectId)
        if (index !== -1) {
          this.projects[index] = data
        }

        return data
      } catch (err) {
        this.error = err.message
        console.error('❌ Ошибка обновления названия:', err)
        return null
      } finally {
        this.loading = false
      }
    },

    clearCurrentProject() {
      this.currentProject = null
    },

    reset() {
      this.currentProject = null
      this.projects = []
      this.loading = false
      this.error = null
    }
  }
})
