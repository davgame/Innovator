<template>
  <div class="min-h-screen pb-16">
    <!-- Модальные окна -->
    <Task
      :show="showTaskModal"
      @close="showTaskModal = false"
      @save="handleCreateTask"
    />

    <Edit_task
      :show="showEditModal"
      :taskData="editingTask"
      @close="closeEditModal"
      @save="handleUpdateTask"
    />

    <add-user
      v-if="showMemberModal"
      :selected-users="currentTaskForMembers?.members || []"
      mode="task"
      @close="closeMemberModal"
      @confirm="handleMembersConfirm"
    />

    <!-- Верхняя шапка (Header_sup) -->
    <Header_sup />

    <!-- Контент -->
    <div class="bg-gray-50 min-h-screen mt-14">
      <MobileKanban
        ref="mobileKanbanRef"
        :key="currentProjectId"
        :projectId="currentProjectId"
        :projectName="currentProject?.name"
        @open-create-task="openCreateTask"
        @open-edit-task="openEditTask"
        @open-add-members="openAddMembersModal"
      />
    </div>

    <!-- Нижнее меню -->
    <MobileBottomNav
      :active-menu="activeMenu"
      @open-projects="openProjectsModal"
      @open-search="openSearchModal"
      @open-members="openMembersModal"
    />

    <!-- Модалка проектов -->

    <Transition name="modal-slide">
      <div v-if="showProjectsModal" class="fixed inset-0 z-50 bg-white flex flex-col">
        <div class="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold">Проекты</h2>
          <button @click="closeProjectsModal" class="p-2 text-gray-400 text-2xl">✕</button>
        </div>
        <div class="flex-1 overflow-y-auto">
          <PanelMobile
            ref="panelMobileRef"
            @project-selected="handleProjectSelected"
          />
        </div>
      </div>
    </Transition>

    <!-- Модалка поиска -->
    <Transition name="modal-slide">
      <div v-if="showSearchModal" class="fixed inset-0 z-50 bg-white flex flex-col">
        <div class="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold">Поиск</h2>
          <button @click="closeSearchModal" class="p-2 text-gray-400">✕</button>
        </div>
        <div class="flex-1 overflow-y-auto p-4">
          <input
            type="text"
            placeholder="Поиск проектов..."
            class="w-full p-3 border border-gray-300 rounded-lg"
          />
          <div class="mt-4 text-gray-500 text-center">Результаты поиска</div>
        </div>
      </div>
    </Transition>

    <!-- Модалка участников -->
    <Transition name="modal-slide">
      <div v-if="showMembersModal" class="fixed inset-0 z-50 bg-white flex flex-col">
        <div class="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold">Участники проекта</h2>
          <button @click="closeMembersModal" class="p-2 text-gray-400">✕</button>
        </div>
        <div class="flex-1 overflow-y-auto p-4">
          <div
            v-for="member in projectMembers"
            :key="member.id"
            class="flex items-center gap-3 p-3 border-b border-gray-100"
          >
            <div class="w-10 h-10 rounded-full overflow-hidden bg-blue-500 flex-shrink-0">
              <img v-if="member.avatar" :src="member.avatar" class="w-full h-full object-cover" />
              <div v-else class="w-full h-full flex items-center justify-center text-white">
                {{ member.name?.charAt(0) }}
              </div>
            </div>
            <div class="flex-1">
              <p class="font-medium">{{ member.name }}</p>
              <p class="text-sm text-gray-500">{{ member.role || 'Участник' }}</p>
            </div>
          </div>
          <div v-if="projectMembers.length === 0" class="text-center py-8 text-gray-500">
            Нет участников в проекте
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useProjectStore } from '@/stores/projectStore'
import { supabase } from '@/lib/supabase'
import Header_sup from './Header_sup.vue'
import MobileKanban from './MobileKanban.vue'
import MobileBottomNav from './MobileBottomNav.vue'
import Task from './Task.vue'
import Edit_task from './Edit_task.vue'
import AddUser from '../Pasport/Add-User.vue'
import PanelMobile from './PanelMobile.vue'
import { createTaskDB, updateTaskDB } from '@/services/taskService'

const props = defineProps({
  projectId: {
    type: String,
    default: null
  }
})

const router = useRouter()
const route = useRoute()
const projectStore = useProjectStore()
const currentProject = ref(null)
const mobileKanbanRef = ref(null)
const projectMembers = ref([])

// Состояния модалок
const showTaskModal = ref(false)
const showEditModal = ref(false)
const showMemberModal = ref(false)
const showProjectsModal = ref(false)
const showSearchModal = ref(false)
const showMembersModal = ref(false)
const editingTask = ref(null)
const currentTaskForMembers = ref(null)
const targetColumnId = ref(null)
const activeMenu = ref(null)
const panelRef = ref(null)

// Текущий ID проекта (используем реактивную переменную, которую можно обновлять)
const currentProjectId = ref(null)

// Инициализация currentProjectId
const initProjectId = () => {
  if (props.projectId && props.projectId !== 'undefined') {
    currentProjectId.value = props.projectId
  } else if (route.params.projectId) {
    currentProjectId.value = route.params.projectId
  }
}

// Загрузка проекта
const loadProject = async (id) => {
  if (!id || id === 'undefined') return

  console.log('📌 Загружаем проект с ID:', id)

  try {
    const project = await projectStore.loadProject(Number(id))
    if (project) {
      currentProject.value = project
      console.log('✅ Проект загружен:', project.name, 'ID:', project.id)
      await loadProjectMembers(id)
    }
  } catch (err) {
    console.error('Ошибка загрузки проекта:', err)
  }
}

// Загрузка участников проекта
const loadProjectMembers = async (projectId) => {
  try {
    const { data, error } = await supabase
      .from('project_members')
      .select(`
        user_id,
        role,
        profiles (id, full_name, avatar_url)
      `)
      .eq('project_id', projectId)

    if (error) throw error

    projectMembers.value = data?.map(m => ({
      id: m.user_id,
      name: m.profiles?.full_name || 'Пользователь',
      avatar: m.profiles?.avatar_url,
      role: m.role || 'Участник'
    })) || []

    console.log('👥 Участники загружены:', projectMembers.value.length)
  } catch (err) {
    console.error('Ошибка загрузки участников:', err)
  }
}

// Обработка выбора проекта из панели
const handleProjectSelected = (project) => {
  console.log('📌 ПРОЕКТ ВЫБРАН В МОБИЛЬНОМ ЛЕЙАУТЕ:', project)
  console.log('📌 ID проекта:', project.id)
  console.log('📌 Имя проекта:', project.name)

  // Обновляем текущий проект
  currentProject.value = project

  // Обновляем ID проекта (это ключевой момент!)
  currentProjectId.value = String(project.id)

  // Закрываем модалку проектов
  closeProjectsModal()

  // Обновляем URL
  router.push(`/sup/project/${project.id}`)

  // Загружаем участников для нового проекта
  loadProjectMembers(project.id)

  // Перезагружаем задачи в MobileKanban (через key это произойдёт автоматически)
  console.log('✅ Проект переключен на:', project.name)
}

// Модалка поиска
const openSearchModal = () => {
  activeMenu.value = 'search'
  showSearchModal.value = true
}

const closeSearchModal = () => {
  activeMenu.value = null
  showSearchModal.value = false
}

// Модалка участников
const openMembersModal = () => {
  activeMenu.value = 'members'
  showMembersModal.value = true
}

const closeMembersModal = () => {
  activeMenu.value = null
  showMembersModal.value = false
}

// Создание задачи
const openCreateTask = (columnId) => {
  targetColumnId.value = columnId
  showTaskModal.value = true
}

const handleCreateTask = async (task) => {
  try {
    const newTask = {
      project_id: Number(currentProjectId.value),
      title: task.title,
      status: targetColumnId.value || 1,
      progress: 0,
      tag: task.tag || '',
      checklist: [],
      members: [],
      deadline: null
    }

    const { data, error } = await createTaskDB(newTask)
    if (error) throw error

    if (mobileKanbanRef.value && mobileKanbanRef.value.loadTasks) {
      await mobileKanbanRef.value.loadTasks()
    }

    showTaskModal.value = false
    targetColumnId.value = null
  } catch (err) {
    console.error('Ошибка создания задачи:', err)
  }
}

// Редактирование задачи
const openEditTask = (task) => {
  editingTask.value = { ...task }
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  editingTask.value = null
}

// Модалка проектов
const openProjectsModal = () => {
  console.log('🔵 Открываем модалку проектов')
  activeMenu.value = 'projects'
  showProjectsModal.value = true

  // Принудительно вызываем загрузку проектов в Panel
  setTimeout(() => {
    if (panelRef.value && panelRef.value.loadProjects) {
      console.log('🔄 Принудительно загружаем проекты в Panel')
      panelRef.value.loadProjects()
    } else {
      console.log('⚠️ Panel не имеет метода loadProjects или ещё не загружен')
    }
  }, 100)
}

const closeProjectsModal = () => {
  console.log('🔵 Закрываем модалку проектов')
  activeMenu.value = null
  showProjectsModal.value = false
}

const handleUpdateTask = async (task) => {
  const { error } = await updateTaskDB(task)
  if (error) {
    console.error('Ошибка обновления:', error)
    return
  }

  if (mobileKanbanRef.value && mobileKanbanRef.value.loadTasks) {
    await mobileKanbanRef.value.loadTasks()
  }

  closeEditModal()
}

// Участники задачи
const openAddMembersModal = (task) => {
  currentTaskForMembers.value = task
  showMemberModal.value = true
}

const closeMemberModal = () => {
  showMemberModal.value = false
  currentTaskForMembers.value = null
}

const handleMembersConfirm = async (users) => {
  if (currentTaskForMembers.value) {
    const updatedMembers = users.map(u => ({
      id: u.id,
      name: u.name,
      avatar: u.avatar_url,
      color: getRandomColor()
    }))

    currentTaskForMembers.value.members = updatedMembers

    await updateTaskDB({
      id: currentTaskForMembers.value.id,
      members: updatedMembers
    })

    if (mobileKanbanRef.value && mobileKanbanRef.value.loadTasks) {
      await mobileKanbanRef.value.loadTasks()
    }
  }
  closeMemberModal()
}

const getRandomColor = () => {
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316']
  return colors[Math.floor(Math.random() * colors.length)]
}

// Инициализация
onMounted(() => {
  initProjectId()
})

// Следим за изменением currentProjectId
watch(currentProjectId, async (newId) => {
  if (newId && newId !== 'undefined') {
    console.log('🔄 currentProjectId изменился на:', newId)
    await loadProject(newId)
  }
}, { immediate: true })

// Следим за изменением URL
watch(() => route.params.projectId, async (newId) => {
  if (newId && newId !== 'undefined' && newId !== currentProjectId.value) {
    console.log('🔄 URL изменился, новый projectId:', newId)
    currentProjectId.value = newId
  }
})

// Следим за пропсом projectId
watch(() => props.projectId, (newId) => {
  if (newId && newId !== 'undefined' && newId !== currentProjectId.value) {
    console.log('🔄 props.projectId изменился:', newId)
    currentProjectId.value = newId
  }
})
</script>

<style scoped>
.modal-slide-enter-active,
.modal-slide-leave-active {
  transition: transform 0.3s ease;
}
.modal-slide-enter-from,
.modal-slide-leave-to {
  transform: translateY(100%);
}
</style>
