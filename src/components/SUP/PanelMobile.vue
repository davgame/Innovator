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
          @click="selectProject(project)"
        >
          {{ project.icon }}
        </div>
        <div class="flex-1" @click="selectProject(project)">
          <p class="font-medium text-gray-800">{{ project.name }}</p>
          <p class="text-xs text-gray-400">{{ project.category }}</p>
        </div>

        <!-- Кнопка с тремя точками (только для владельца) -->
        <div class="relative" v-if="project.isOwner" @click.stop>
          <button
            @click.stop="toggleContextMenu(project)"
            class="p-1 hover:bg-gray-100 rounded-full transition-colors"
            :class="{ 'bg-gray-100': activeContextMenu === project.id }">

            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
          </button>

          <!-- Контекстное меню -->
          <div
            v-if="activeContextMenu === project.id"
            class="absolute right-0 top-8 z-20 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[140px]"
          >
            <button
              @click="openRenameModal(project)"
              class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Переименовать
            </button>
            <button
              @click="openDeleteModal(project)"
              class="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50 flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Удалить
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Модалка подтверждения удаления -->
    <ConfirmDelete
      :show="showDeleteModal"
      :project="deletingProject"
      @close="closeDeleteModal"
      @deleted="handleProjectDeleted"
    />

    <!-- Модалка переименования -->
    <ConfirmRename
      :show="showRenameModal"
      :project="renamingProject"
      @close="closeRenameModal"
      @confirm="handleRenameConfirm"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted  } from 'vue'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth'
import ConfirmDelete from './ConfirmDelete.vue'
import ConfirmRename from './ConfirmRename.vue'

const emit = defineEmits(['project-selected', 'project-deleted', 'project-renamed'])
const authStore = useAuthStore()

const projects = ref([])
const loading = ref(false)
const activeContextMenu = ref(null)
const deletingProject = ref(null)
const showDeleteModal = ref(false)
const showRenameModal = ref(false)
const renamingProject = ref(null)

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
      icon: p.name.charAt(0).toUpperCase(),
      isOwner: p.created_by === authStore.user.id
    }))

    console.log('✅ PanelMobile: итого проектов:', projects.value.length)
  } catch (err) {
    console.error('❌ Ошибка загрузки проектов:', err)
    projects.value = []
  } finally {
    loading.value = false
  }
}

// Контекстное меню
const toggleContextMenu = (project) => {
  if (activeContextMenu.value === project.id) {
    activeContextMenu.value = null
  } else {
    activeContextMenu.value = project.id
  }
}

const closeContextMenu = () => {
  activeContextMenu.value = null
}

// Открыть модалку удаления
const openDeleteModal = (project) => {
  console.log('🔴 openDeleteModal вызван')
  console.log('🔴 project:', project)
  console.log('🔴 project.isOwner:', project?.isOwner)

  if (!project.isOwner) {
    console.log('❌ Не владелец, удаление невозможно')
    alert('Только владелец проекта может его удалить')
    return
  }

  console.log('✅ Владелец, открываем модалку')
  deletingProject.value = project
  showDeleteModal.value = true
  console.log('showDeleteModal.value:', showDeleteModal.value)
  console.log('deletingProject.value:', deletingProject.value)
  closeContextMenu()
}

// Закрыть модалку удаления
const closeDeleteModal = () => {
  showDeleteModal.value = false
  deletingProject.value = null
}

// Обработчик успешного удаления
const handleProjectDeleted = (deletedProjectId) => {
  // Удаляем из локального списка
  projects.value = projects.value.filter(p => p.id !== deletedProjectId)

  // Если удалили выбранный проект, уведомляем родителя
  emit('project-deleted', deletedProjectId)
  console.log('✅ Проект удалён из списка')
}

// Переименовать проект
const renameProject = async (project) => {
  const newName = prompt('Введите новое название проекта:', project.name)
  if (newName && newName.trim()) {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ name: newName.trim() })
        .eq('id', project.id)

      if (error) throw error

      // Обновляем локально
      const index = projects.value.findIndex(p => p.id === project.id)
      if (index !== -1) {
        projects.value[index].name = newName.trim()
      }

      emit('project-renamed', { id: project.id, name: newName.trim() })
      console.log('✅ Проект переименован')
    } catch (err) {
      console.error('Ошибка переименования:', err)
      alert('Не удалось переименовать проект')
    }
  }
  closeContextMenu()
}

const selectProject = (project) => {
  console.log('📌 PanelMobile: выбран проект:', project.name, 'ID:', project.id)
  closeContextMenu()
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

    const newProject = {
      id: data.id,
      name: data.name,
      category: 'Новый проект',
      color: getColor(data.id),
      icon: data.name.charAt(0).toUpperCase(),
      isOwner: true
    }

    projects.value.unshift(newProject)
    selectProject(newProject)
  } catch (err) {
    console.error('❌ Ошибка создания проекта:', err)
  }
}

// ========== ПЕРЕИМЕНОВАНИЕ ==========
const openRenameModal = (project) => {
  console.log('✏️ openRenameModal вызван для проекта:', project.name)

  if (!project.isOwner) {
    alert('Только владелец проекта может его переименовать')
    return
  }

  renamingProject.value = project
  showRenameModal.value = true
  closeContextMenu()
}

const closeRenameModal = () => {
  showRenameModal.value = false
  renamingProject.value = null
}

const handleRenameConfirm = async ({ id, name }) => {
  console.log('✏️ Переименовываем проект:', id, 'в', name)

  try {
    const { error } = await supabase
      .from('projects')
      .update({ name })
      .eq('id', id)

    if (error) throw error

    // Обновляем локально
    const projectIndex = projects.value.findIndex(p => p.id === id)
    if (projectIndex !== -1) {
      projects.value[projectIndex].name = name
    }

    emit('project-renamed', { id, name })
    console.log('✅ Проект переименован')
  } catch (err) {
    console.error('❌ Ошибка переименования:', err)
    alert('Не удалось переименовать проект')
  }

  closeRenameModal()
}

// Закрытие меню при клике вне
const handleClickOutside = (event) => {
  if (activeContextMenu.value) {
    const target = event.target
    if (!target.closest('.relative')) {
      closeContextMenu()
    }
  }
}

onMounted(() => {
  console.log('📌 PanelMobile mounted')
  loadProjects()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

defineExpose({ loadProjects })
</script>
