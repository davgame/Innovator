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
      :project-id="currentProject?.id || currentProjectId"
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
        <div class="flex items-center justify-between p-4 py-5 border-b border-gray-200">
          <h2 class="text-[24px] font-semibold">Проекты</h2>
        <button
          @click="closeProjectsModal"
          class="cursor-pointer w-9 h-9 flex items-center justify-center border border-[#9A9A9A]/20 rounded-[9px] text-[#374151]"
        >
          <span class="text-3xl leading-none py-[2px] mb-[4px]">×</span>
        </button>
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
        <div class="flex items-center justify-between p-4 py-5 border-b border-gray-200">
          <h2 class="text-[24px] font-semibold">Поиск</h2>
            <button
              @click="closeSearchModal"
              class="cursor-pointer w-9 h-9 flex items-center justify-center border border-[#9A9A9A]/20 rounded-[9px] text-[#374151]"
            >
              <span class="text-3xl leading-none py-[2px] mb-[4px]">×</span>
            </button>
        </div>
        <div class="flex-1 overflow-y-auto p-4">
          <input
            type="text"
            placeholder="Поиск проектов..."
            class="w-full p-3 border border-gray-300 rounded-[12px]"
          />
          <div class="mt-4 text-gray-500 text-center">Результаты поиска</div>
        </div>
      </div>
    </Transition>

        <!-- Модалка участников -->
      <div v-if="showMembersModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-2 sm:p-0">
        <!-- Modal -->
        <div
          class="bg-white w-full max-w-[420px] sm:w-[420px] max-h-[80vh] rounded-[22px] p-4 flex flex-col relative"
        >
          <!-- Header -->
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-[18px] font-semibold">
              {{ isProjectOwner ? 'Добавить участника' : 'Участники проекта' }}
            </h2>
            <button
              @click="closeMembersModal"
              class="cursor-pointer w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400"
            >
              ✕
            </button>
          </div>

          <!-- Search -->
          <div class="relative mb-2">
            <input
              v-model="memberSearchQuery"
              @input="searchUsersToAdd"
              type="text"
              :disabled="!isProjectOwner"
              placeholder="Начните ввод..."
              class="w-full border border-[#CBCBCB] rounded-[12px] px-4 py-2 text-sm focus:outline-none focus:border-[#4286F7]"
              :class="{ 'bg-gray-100 cursor-not-allowed': !isProjectOwner }"
            />
          </div>

          <!-- Users list (scroll) -->
          <div
            class="flex-1 overflow-y-auto space-y-2 pr-1"
            :style="{ maxHeight: '400px' }"
          >
            <!-- Результаты поиска -->
            <div
              v-for="user in memberSearchResults"
              v-if="memberSearchResults.length > 0"
              :key="user.id"
              class="flex items-center gap-3 p-2 rounded-[14px] hover:bg-[#F6F8FA]"
            >
              <div class="w-9 h-9 rounded-full overflow-hidden bg-[#CFD9FF] flex-shrink-0">
                <img
                  v-if="user.avatar_url"
                  :src="user.avatar_url"
                  class="w-full h-full object-cover"
                />
                <img
                  v-else
                  src="/src/assets/images/Emodzi.svg"
                  class="w-full h-full object-cover p-1.5"
                />
              </div>
              <div class="flex-1">
                <p class="text-[14px] font-medium">{{ user.full_name }}</p>
                <p class="text-[12px] text-[#6C727C]">Участник</p>
              </div>
              <div
                v-if="isProjectOwner"
                class="w-5 h-5 rounded-[6px] border flex items-center justify-center cursor-pointer"
                :class="isUserSelectedToAdd(user) ? 'bg-[#4286F7] border-[#4286F7]' : 'border-[#CBCBCB]'"
                @click.stop="toggleUserToAdd(user)"
              >
                <svg v-if="isUserSelectedToAdd(user)" class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div v-else class="w-5 h-5"></div>
            </div>

            <!-- Список участников проекта (когда нет поиска) -->
            <div
              v-for="member in projectMembers"
              v-if="memberSearchResults.length === 0 && member"
              :key="member.id"
              class="flex items-center gap-3 p-2 rounded-[14px]"
              :class="{ 'bg-yellow-50': member.isOwner === true }"
            >
              <!-- Аватар с заглушкой -->
              <div class="w-9 h-9 rounded-full overflow-hidden bg-[#CFD9FF] flex-shrink-0">
                <img
                  v-if="member.avatar_url"
                  :src="member.avatar_url"
                  class="w-full h-full object-cover"
                  @error="handleAvatarError"
                />
                <img
                  v-else
                  src="/src/assets/images/Emodzi.svg"
                  class="w-full h-full object-cover p-1.5"
                  alt="Default avatar"
                />
              </div>
              <div class="flex-1">
                <p class="text-[14px] font-medium">{{ member.full_name || member.name || 'Пользователь' }}</p>
                <p class="text-[12px] text-[#6C727C]">
                  {{ member.role || 'Участник' }}
                </p>
              </div>

              <!-- Чекбокс для владельца (только для не-владельцев и не себя) -->
              <div
                v-if="isProjectOwner && member.id !== currentUserId && member.isOwner !== true"
                class="w-5 h-5 rounded-[6px] border flex items-center justify-center cursor-pointer"
                :class="isMemberSelectedToRemove(member) ? 'bg-[#4286F7] border-[#4286F7]' : 'border-[#CBCBCB]'"
                @click.stop="toggleMemberToRemove(member)"
              >
                <svg v-if="isMemberSelectedToRemove(member)" class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <!-- Звездочка для владельца -->
              <div v-else-if="member.isOwner === true" class="w-5 h-5 text-yellow-500">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>

              <!-- Пустое место -->
              <div v-else class="w-5 h-5"></div>
            </div>
          </div>

          <!-- Selected preview -->
          <div
            v-if="usersToAdd.length > 0 && memberSearchResults.length > 0"
            class="flex gap-2 flex-wrap mt-3"
          >
            <div
              v-for="user in usersToAdd"
              :key="user.id"
              class="flex items-center gap-2 bg-[#F6F8FA] px-1 py-1 rounded-full"
              @click="toggleUserToAdd(user)"
            >
              <img :src="user.avatar_url" class="w-7 h-7 rounded-full" />
              <span class="text-[13px]">{{ user.full_name }}</span>
              <div
                class="cursor-pointer w-5 h-5 rounded-[6px] border flex items-center justify-center transition-colors shrink-0"
                :class="isUserSelectedToAdd(user) ? 'bg-[#4286F7] border-[#4286F7]' : 'border-[#CBCBCB]'"
                @click.stop="toggleUserToAdd(user)"
              >
                <svg v-if="isUserSelectedToAdd(user)" class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Footer button -->
          <button
            v-if="isProjectOwner"
            @click="handleMemberConfirm"
            class="cursor-pointer mt-4 bg-[#222222] hover:bg-[#4286F7] text-white py-2 rounded-[14px] text-[15px] font-medium transition-colors"
          >
            Готово
          </button>

          <!-- Кнопка для обычного участника (только закрыть) -->
          <button
            v-else
            @click="closeMembersModal"
            class="cursor-pointer mt-5 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-[14px] text-[15px] font-medium transition-colors"
          >
            Закрыть
          </button>
        </div>
      </div>
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
import { useAuthStore } from '@/stores/auth'  // 👈 ДОБАВЬТЕ ЭТУ СТРОЧКУ

import { createTaskDB, updateTaskDB } from '@/services/taskService'

const props = defineProps({
  projectId: {
    type: String,
    default: null
  }
})

const authStore = useAuthStore()  // 👈 ДОБАВЬТЕ ЭТУ СТРОЧКУ
const router = useRouter()
const route = useRoute()
const projectStore = useProjectStore()
const currentProject = ref(null)
const mobileKanbanRef = ref(null)
const projectMembers = ref([])
const membersToRemove = ref([])  // 👈 Убедитесь, что это есть
const memberSearchQuery = ref('')
const memberSearchResults = ref([])
const usersToAdd = ref([])
const memberSearchTimer = ref(null)
const isProjectOwner = ref(false)


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


// Текущий пользователь
const currentUserId = computed(() => authStore.user?.id)

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


// Проверка, выбран ли участник для удаления
const isMemberSelectedToRemove = (member) => {
  if (!membersToRemove.value || !member) return false
  return membersToRemove.value.some(m => m.id === member.id)
}

// Добавить/убрать участника для удаления
const toggleMemberToRemove = (member) => {
  if (!member) return

  if (isMemberSelectedToRemove(member)) {
    membersToRemove.value = membersToRemove.value.filter(m => m.id !== member.id)
  } else {
    membersToRemove.value.push(member)
  }
}

const handleAvatarError = (e) => {
  e.target.src = '/src/assets/images/Emodzi.svg'
  e.target.classList.add('p-1.5')
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
const loadProjectMembers = async () => {
  const projectId = currentProject.value?.id

  if (!projectId) {
    console.log('⚠️ Нет ID проекта')
    return
  }

  try {
    console.log('📡 Загружаем участников для проекта:', projectId)

    const { data: membersData, error: membersError } = await supabase
      .from('project_members')
      .select(`
        user_id,
        role,
        profiles (
          id,
          full_name,
          avatar_url
        )
      `)
      .eq('project_id', projectId)

    if (membersError) throw membersError

    let members = membersData?.map(m => ({
      id: m.user_id,
      full_name: m.profiles?.full_name || 'Пользователь',
      name: m.profiles?.full_name,
      avatar_url: m.profiles?.avatar_url,
      role: m.role || 'Участник',
      isOwner: false
    })) || []

    // Добавляем владельца
    const { data: projectData } = await supabase
      .from('projects')
      .select('created_by')
      .eq('id', projectId)
      .single()

    if (projectData?.created_by) {
      const { data: ownerData } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .eq('id', projectData.created_by)
        .single()

      if (ownerData) {
        const ownerExists = members.some(m => m.id === ownerData.id)
        if (!ownerExists) {
          members.unshift({
            id: ownerData.id,
            full_name: ownerData.full_name,
            name: ownerData.full_name,
            avatar_url: ownerData.avatar_url,
            role: 'Владелец',
            isOwner: true
          })
        } else {
          const owner = members.find(m => m.id === ownerData.id)
          if (owner) {
            owner.role = 'Владелец'
            owner.isOwner = true
          }
        }
      }
    }

    projectMembers.value = members
    console.log('👥 Участники загружены:', projectMembers.value.length)

  } catch (err) {
    console.error('Ошибка загрузки участников:', err)
    projectMembers.value = []
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

// Поиск пользователей для добавления
const searchUsersToAdd = async () => {
  const query = memberSearchQuery.value.trim()

  if (!query || query.length < 2) {
    memberSearchResults.value = []
    return
  }

  try {
    // Получаем ID уже существующих участников
    const existingIds = projectMembers.value.map(m => m.id)

    let dbQuery = supabase
      .from('profiles')
      .select('id, full_name, avatar_url')
      .ilike('full_name', `%${query}%`)
      .limit(10)

    // Исключаем уже добавленных
    if (existingIds.length > 0) {
      dbQuery = dbQuery.not('id', 'in', `(${existingIds.join(',')})`)
    }

    const { data, error } = await dbQuery

    if (error) throw error
    memberSearchResults.value = data || []
  } catch (err) {
    console.error('Ошибка поиска:', err)
    memberSearchResults.value = []
  }
}

// Проверка, выбран ли пользователь для добавления
const isUserSelectedToAdd = (user) => {
  if (!usersToAdd.value || !user) return false
  return usersToAdd.value.some(u => u.id === user.id)
}

// Добавить/убрать пользователя для добавления
const toggleUserToAdd = (user) => {
  if (!user) return

  if (isUserSelectedToAdd(user)) {
    usersToAdd.value = usersToAdd.value.filter(u => u.id !== user.id)
  } else {
    usersToAdd.value.push(user)
  }
}

// Сохранить изменения (добавить и удалить)
const handleMemberConfirm = async () => {
  console.log('📝 Сохраняем изменения участников')

  try {
    // 1. Добавляем новых участников
    if (usersToAdd.value.length > 0) {
      const newMembers = usersToAdd.value.map(user => ({
        project_id: currentProject.value.id,
        user_id: user.id,
        role: 'Участник',
        joined_at: new Date().toISOString()
      }))

      const { error } = await supabase
        .from('project_members')
        .insert(newMembers)

      if (error) throw error
      console.log(`✅ Добавлено ${usersToAdd.value.length} участников`)
    }

    // 2. Удаляем выбранных участников
    if (membersToRemove.value.length > 0) {
      const userIds = membersToRemove.value.map(m => m.id)

      const { error } = await supabase
        .from('project_members')
        .delete()
        .eq('project_id', currentProject.value.id)
        .in('user_id', userIds)

      if (error) throw error
      console.log(`✅ Удалено ${membersToRemove.value.length} участников`)
    }

    // Обновляем список участников
    await loadProjectMembers()

    // Очищаем временные данные
    usersToAdd.value = []
    membersToRemove.value = []
    memberSearchQuery.value = ''
    memberSearchResults.value = []

    closeMembersModal()
  } catch (err) {
    console.error('Ошибка сохранения:', err)
    alert('Не удалось сохранить изменения')
  }
}



const openMembersModal = async () => {
  if (!currentProject.value?.id) {
    console.log('⚠️ Нет выбранного проекта')
    return
  }

  activeMenu.value = 'members'

  usersToAdd.value = []
  membersToRemove.value = []
  memberSearchQuery.value = ''
  memberSearchResults.value = []

  await checkProjectOwner()
  await loadProjectMembers()

  // 👇 Отладка
  console.log('📊 После загрузки:')
  console.log('   projectMembers:', projectMembers.value)
  console.log('   isProjectOwner:', isProjectOwner.value)
  console.log('   currentUserId:', currentUserId.value)

  showMembersModal.value = true
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

const checkProjectOwner = async () => {
  const projectId = currentProject.value?.id

  if (!projectId || !authStore.user?.id) {
    isProjectOwner.value = false
    return
  }

  try {
    const { data, error } = await supabase
      .from('projects')
      .select('created_by')
      .eq('id', projectId)
      .single()

    if (error) throw error
    isProjectOwner.value = data.created_by === authStore.user.id
  } catch (err) {
    console.error('Ошибка проверки владельца:', err)
    isProjectOwner.value = false
  }
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

// Дебаунс для поиска
watch(memberSearchQuery, (newValue) => {
  if (memberSearchTimer.value) {  // 👈 используем .value
    clearTimeout(memberSearchTimer.value)
  }
  if (!newValue.trim()) {
    memberSearchResults.value = []
    return
  }
  memberSearchTimer.value = setTimeout(() => {
    searchUsersToAdd()
  }, 500)
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
