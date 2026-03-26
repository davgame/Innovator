<template>
  <div class="p-4">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-semibold">Мои проекты</h2>
        <button
          @click="createProject"
          class="flex items-center justify-center w-8 h-8 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          title="Создать новую доску"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
    </div>

    <div v-if="loading" class="text-center py-8">
      <div class="text-gray-500">Загрузка...</div>
    </div>

    <div v-else-if="projects.length === 0" class="text-center py-8">
      <div class="text-gray-400 mb-2">У вас нет проектов</div>
      <button
        @click="createProject"
        class="text-blue-500 text-sm font-medium"
      >
        + Создать проект
      </button>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="project in projects"
        :key="project.id"
        @click="selectProject(project)"
        class="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors border border-gray-100"
      >
        <div
          class="w-10 h-10 rounded-lg flex items-center justify-center text-white font-medium text-lg"
          :style="{ backgroundColor: project.color }"
        >
          {{ project.icon }}
        </div>
        <div class="flex-1">
          <p class="font-medium text-gray-800">{{ project.name }}</p>
          <p class="text-xs text-gray-400">{{ project.category }}</p>
        </div>
        <div class="text-gray-400">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth'

const emit = defineEmits(['project-selected'])
const authStore = useAuthStore()

const projects = ref([])
const loading = ref(false)

const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316']

const getColor = (id) => colors[(id || 0) % colors.length]

const loadProjects = async () => {
  if (!authStore.user?.id) {
    console.log('❌ PanelMobile: Нет пользователя')
    return
  }

  loading.value = true
  console.log('📡 PanelMobile: загружаем проекты для пользователя:', authStore.user.id)

  try {
    // Получаем проекты, где пользователь владелец
    console.log('📡 Запрашиваем проекты владельца...')
    const { data: owned, error: ownedError } = await supabase
      .from('projects')
      .select('*')
      .eq('created_by', authStore.user.id)

    if (ownedError) {
      console.error('❌ Ошибка загрузки owned проектов:', ownedError)
      throw ownedError
    }
    console.log('✅ Проекты владельца:', owned?.length || 0, owned)

    // Получаем проекты, где пользователь участник
    console.log('📡 Запрашиваем project_members...')
    const { data: memberLinks, error: memberError } = await supabase
      .from('project_members')
      .select('project_id')
      .eq('user_id', authStore.user.id)

    if (memberError) {
      console.error('❌ Ошибка загрузки project_members:', memberError)
      throw memberError
    }
    console.log('✅ project_members:', memberLinks?.length || 0, memberLinks)

    const memberIds = memberLinks?.map(m => m.project_id) || []
    console.log('📋 ID проектов участника:', memberIds)

    let memberProjects = []
    if (memberIds.length > 0) {
      console.log('📡 Запрашиваем проекты участника...')
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .in('id', memberIds)

      if (error) {
        console.error('❌ Ошибка загрузки member проектов:', error)
        throw error
      }
      memberProjects = data || []
      console.log('✅ Проекты участника:', memberProjects.length, memberProjects)
    }

    // Объединяем и убираем дубликаты
    const all = [...(owned || []), ...memberProjects]
    console.log('📋 Все проекты до уникализации:', all.length)

    const unique = all.filter((p, i, arr) => i === arr.findIndex(p2 => p2.id === p.id))
    console.log('📋 Уникальных проектов:', unique.length)

    projects.value = unique.map(p => ({
      id: p.id,
      name: p.name,
      category: p.description || 'Проект',
      color: getColor(p.id),
      icon: p.name.charAt(0).toUpperCase()
    }))

    console.log('✅ PanelMobile: итого проектов:', projects.value.length)
    console.log('📋 Список проектов:', projects.value.map(p => ({ id: p.id, name: p.name })))
  } catch (err) {
    console.error('❌ Ошибка загрузки проектов:', err)
    projects.value = []
  } finally {
    loading.value = false
  }
}

const selectProject = (project) => {
  console.log('📌 PanelMobile: выбран проект:', project.name, 'ID:', project.id)
  emit('project-selected', project)
}

const createProject = async () => {
  if (!authStore.user?.id) return

  try {
    const newName = `Проект ${projects.value.length + 1}`
    console.log('📡 Создаём новый проект:', newName)

    const { data, error } = await supabase
      .from('projects')
      .insert([{
        name: newName,
        created_by: authStore.user.id,
        description: 'Новый проект'
      }])
      .select()
      .single()

    if (error) throw error

    console.log('✅ Проект создан:', data)

    const newProject = {
      id: data.id,
      name: data.name,
      category: 'Новый проект',
      color: getColor(data.id),
      icon: data.name.charAt(0).toUpperCase()
    }

    projects.value.unshift(newProject)
    selectProject(newProject)
  } catch (err) {
    console.error('❌ Ошибка создания проекта:', err)
  }
}

onMounted(() => {
  console.log('📌 PanelMobile mounted, authStore.user:', authStore.user)
  console.log('📌 authStore.user.id:', authStore.user?.id)
  loadProjects()
})

defineExpose({ loadProjects })
</script>
