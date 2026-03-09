<template>
  <div class="bg-white border-b border-gray-200 px-15">
    <!-- Заголовок проекта с выбранными пользователями -->
    <div class="mb-5 gap-2 flex justify-between items-center">
        <h1 class="text-5xl font-bold text-gray-900">
            {{ displayName }}
        </h1>

        <!-- Отображение выбранных пользователей -->
        <div class="flex items-center -space-x-4">
          <!-- Аватарки пользователей -->
          <div
            v-for="user in selectedUsers"
            :key="user.id"
            class="w-10 h-10 rounded-full border-2 border-white overflow-hidden shadow-sm cursor-pointer transition-transform hover:scale-105"
            :style="{ backgroundColor: getUserColor(user.id) }"
            :title="`${user.name} (${user.role})`"
          >
            <img
              v-if="user.avatar"
              :src="user.avatar"
              :alt="user.name"
              class="w-full h-full object-cover"
              @error="handleImageError"
            />
            <div v-else class="w-full h-full flex items-center justify-center text-white text-sm font-medium">
              {{ user.name?.charAt(0) || '?' }}
            </div>
          </div>

          <!-- Кнопка добавления участника -->
          <button
            class="w-10 h-10 rounded-full border-2 border-white bg-[#F2F2F2] text-[#838886] text-[24px] flex items-center justify-center hover:bg-[#4286F7] hover:text-white transition-all duration-200 ml-1"
            @click.stop="openAddMemberModal"
            title="Добавить участника"
          >
            <p class="text-[22px] pb-1">+</p>
          </button>
        </div>
      </div>

    <!-- Вкладки -->
    <div class="flex space-x-8">
      <button
        class="px-1 py-2 text-lg font-semibold text-[#318AEE] border-b-2 border-[#318AEE] cursor-pointer"
      >
        Доска
      </button>
    </div>
  </div>
  <add-user
    v-if="showMemberModal"
    :project-id="projectId"
    @close="closeModal"
    @confirm="handleMembersConfirm"
  />
</template>

<script setup>
import { ref, onMounted, watch, computed  } from 'vue'
import { useRoute } from 'vue-router'
import AddUser from '../Pasport/Add-User.vue'
import { supabase } from '@/lib/supabase'

const props = defineProps({
  project: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['updateName'])
const route = useRoute()

const selectedUsers = ref([])
const showMemberModal = ref(false)
const projectId = ref(props.project?.id || null)

// ✅ 1. Сначала объявляем ВСЕ функции
const loadUsers = () => {
  if (!projectId.value) return

  // Сначала пробуем загрузить из localStorage (быстро)
  const savedUsers = localStorage.getItem(`project_members_${projectId.value}`)

  if (savedUsers) {
    try {
      const parsed = JSON.parse(savedUsers)
      if (Array.isArray(parsed)) {
        selectedUsers.value = parsed
        console.log('✅ Загружены участники из localStorage:', parsed)
        return
      }
    } catch (e) {
      console.error('Ошибка парсинга localStorage:', e)
    }
  }

  // Если в localStorage нет, грузим из БД
  loadProjectMembers(projectId.value)
}

const loadProjectMembers = async (id) => {
  if (!id) {
    console.log('⚠️ Нет ID проекта для загрузки участников')
    return
  }

  try {
    console.log('📡 Загружаю участников для проекта:', id)

    // 👇 УБИРАЕМ !inner - делаем LEFT JOIN
    const { data, error } = await supabase
      .from('project_members')
      .select(`
        *,
        profiles (
          id,
          full_name,
          avatar_url
        )
      `)  // 👈 было profiles!inner, стало просто profiles
      .eq('project_id', id)

    if (error) {
      console.error('❌ Ошибка загрузки участников:', error)
      return
    }

    console.log('✅ Загружены участники из БД:', data)

    if (data && data.length > 0) {
      const members = data.map(m => {
        // Проверяем, есть ли профиль
        const profile = m.profiles || {}

        return {
          id: m.user_id,  // 👈 ИСПРАВЛЕНО: используем user_id из project_members
          name: profile.full_name || 'Пользователь',
          avatar: profile.avatar_url || null,
          role: m.role || 'Участник'
        }
      })

      selectedUsers.value = members
      localStorage.setItem(`project_members_${id}`, JSON.stringify(members))
      console.log('✅ Участники загружены:', members)

    } else {
      console.log('ℹ️ Нет участников для проекта', id)
      selectedUsers.value = []
      localStorage.removeItem(`project_members_${id}`)
    }
  } catch (err) {
    console.error('❌ Ошибка:', err)
  }
}

// Следим за проектом
watch(() => props.project, (newProject) => {
  console.log('📌 Name_pg получил новый проект:', newProject)
  if (newProject?.id) {
    projectId.value = newProject.id
    // Сначала пробуем из localStorage
    loadUsers()
    // Потом обновляем из БД (перезапишет если есть изменения)
    loadProjectMembers(newProject.id)
  }
}, { immediate: true, deep: true })


const getUserColor = (userId) => {
  const colors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B',
    '#8B5CF6', '#EC4899', '#06B6D4', '#14B8A6'
  ]
  return colors[userId % colors.length]
}

const handleImageError = (e) => {
  e.target.style.display = 'none'
}

const openAddMemberModal = () => {
  showMemberModal.value = true
}

const closeModal = () => {
  showMemberModal.value = false
  loadUsers()
}

const handleMembersConfirm = (users) => {
  if (users && users.length > 0) {
    // Сохраняем в localStorage с привязкой к проекту
    if (projectId.value) {
      localStorage.setItem(`project_members_${projectId.value}`, JSON.stringify(users))
    }
    selectedUsers.value = users
  }
  closeModal()
}


watch(() => props.project, (newProject) => {
  console.log('📌 Name_pg получил новый проект:', newProject)
  if (newProject?.id) {
    projectId.value = newProject.id
    loadProjectMembers(newProject.id)
  }
}, { immediate: true, deep: true })  // deep: true чтобы следить за изменениями внутри объекта

// Добавьте после других computed или ref
const displayName = computed(() => {
  return props.project?.name || 'Выберите проект'
})

// ✅ 3. onMounted после всего
onMounted(() => {
  loadUsers()
})
</script>
