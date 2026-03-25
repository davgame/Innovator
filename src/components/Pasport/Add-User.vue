<template>
  <!-- Overlay -->
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-2 sm:p-0"> <!--p-2 sm:p-0 добавляет отсуп по ширине-->

    <!-- Modal -->
    <div
      class="bg-white w-full max-w-[420px] sm:w-[420px] max-h-[80vh] rounded-[22px] p-4 flex flex-col relative"
    >

      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-[18px] font-semibold">
          {{ isOwner ? 'Добавить участника' : 'Участники проекта' }}
        </h2>
        <button
          @click="$emit('close')"
          class="cursor-pointer w-8 h-8 flex items-center justify-center
                 rounded-full hover:bg-gray-100 text-gray-400"
        >
          ✕
        </button>
      </div>

      <!-- Search -->
      <div class="relative mb-2">
        <input
          v-model="searchQuery"
          @input="searchUsers"
          type="text"
          :disabled="!isOwner"
          placeholder="Начните ввод..."
          class="w-full border border-[#CBCBCB]
                 rounded-[12px] px-4 py-2 text-sm
                 focus:outline-none focus:border-[#4286F7]"
        />
      </div>

      <!-- Users list (scroll) -->
      <div
        class="flex-1 overflow-y-auto space-y-2 pr-1"
        :style="{ maxHeight: '400px' }"
      >
        <!-- Результаты поиска -->
        <div
          v-for="user in searchResults"
          v-if="searchResults.length > 0"
          :key="user.id"
          class="flex items-center gap-3 p-2 rounded-[14px] hover:bg-[#F6F8FA]"
        >
          <img :src="user.avatar_url" class="w-9 h-9 rounded-full object-cover" />
          <div class="flex-1">
            <p class="text-[14px] font-medium">{{ user.full_name }}</p>
            <p class="text-[12px] text-[#6C727C]">Участник</p>
          </div>
          <div
            v-if="isOwner"
            class="w-5 h-5 rounded-[6px] border flex items-center justify-center cursor-pointer"
            :class="isSelected(user) ? 'bg-[#4286F7] border-[#4286F7]' : 'border-[#CBCBCB]'"
            @click.stop="toggleUser(user)"
          >
            <svg v-if="isSelected(user)" class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div v-else class="w-5 h-5"></div>
        </div>

        <!-- Список участников проекта (когда нет поиска) -->
        <div
          v-for="member in projectMembers"
          v-if="searchResults.length === 0"
          :key="member.id"
          class="flex items-center gap-3 p-2 rounded-[14px]"
          :class="{ 'bg-yellow-50': member.isOwner }"
        >
          <img :src="member.avatar_url" class="w-9 h-9 rounded-full object-cover" />
          <div class="flex-1">
            <p class="text-[14px] font-medium">{{ member.full_name }}</p>
            <p class="text-[12px] text-[#6C727C]">
              {{ member.role || 'Участник' }}
            </p>
          </div>

          <!-- Чекбокс для владельца (только для не-владельцев и не себя) -->
          <div
            v-if="isOwner && member.id !== currentUserId && !member.isOwner"
            class="w-5 h-5 rounded-[6px] border flex items-center justify-center cursor-pointer"
            :class="isSelected(member) ? 'bg-[#4286F7] border-[#4286F7]' : 'border-[#CBCBCB]'"
            @click.stop="toggleUser(member)"
          >
            <svg v-if="isSelected(member)" class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <!-- Звездочка для владельца -->
          <div v-else-if="member.isOwner" class="w-5 h-5 text-yellow-500">
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
        v-if="selectedUsers.length && searchResults.length > 0"
        class="flex gap-2 flex-wrap mt-3"
      >
        <div
          v-for="user in selectedUsers"
          :key="user.id"
          class="flex items-center gap-2
                 bg-[#F6F8FA] px-1 py-1 rounded-full"
          @click="toggleUser(user)"
        >
          <img :src="user.avatar_url" class="w-7 h-7 rounded-full" />
          <span class="text-[13px]">{{ user.name }}</span>

          <!-- Checkbox -->
          <div
            v-if="isOwner"
            class="cursor-pointer w-5 h-5 rounded-[6px] border flex items-center justify-center transition-colors shrink-0 lg:mr-[3px]"
            :class="isSelected(user)
              ? 'bg-[#4286F7] border-[#4286F7]'
              : 'border-[#CBCBCB]'"
              @click.stop="toggleUser(user)"
          >
            <svg
                v-if="isSelected(user)"
                class="w-3 h-3 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Footer button -->
      <button
        v-if="isOwner"
        @click="handleConfirm"
        class="cursor-pointer mt-4 bg-[#222222] hover:bg-[#4286F7]
               text-white py-2 rounded-[14px]
               text-[15px] font-medium transition-colors"
      >
        Готово
      </button>

      <!-- Кнопка для обычного участника (только закрыть) -->
      <button
        v-else
        @click="$emit('close')"
        class="cursor-pointer mt-5 bg-gray-200 hover:bg-gray-300
              text-gray-700 py-2 rounded-[14px]
              text-[15px] font-medium transition-colors"
      >
        Закрыть
      </button>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth'  // 👈 ДОБАВЬТЕ ЭТУ СТРОЧКУ


const emit = defineEmits(['close', 'confirm'])
const authStore = useAuthStore()  // 👈 ДОБАВЬТЕ ЭТУ СТРОЧКУ
const searchQuery = ref('')
const selectedUsers = ref([])
const avatarVersion = ref(Date.now())  // 👈 ДОБАВЬТЕ
const projectMembers = ref([])  // 👈 Участники проекта для режима task
const searchResults = ref([])
const isLoading = ref(false)
const currentUserId = computed(() => authStore.user?.id)  // 👈 ДОБАВЬТЕ
const isOwner = ref(false)  // 👈 ДОБАВЬТЕ

// Поиск пользователей в БД
let searchTimer = null


// Следим за изменением аватара пользователя
watch(
  () => authStore.profile?.avatar_url,
  (newAvatar, oldAvatar) => {
    console.log('🔄 Аватар изменился:', oldAvatar, '->', newAvatar)
    if (newAvatar !== oldAvatar) {
      avatarVersion.value = Date.now()
      loadProjectMembers()
    }
  },
  { deep: true }  // 👈 ДОБАВЬТЕ deep: true
)

const searchUsers = async () => {
  const query = searchQuery.value.trim()

  if (!query) {
    searchResults.value = []
    return
  }

  isLoading.value = true

  try {
    let dbQuery = supabase
      .from('profiles')
      .select('id, full_name, avatar_url')
      .ilike('full_name', `%${query}%`)
      .limit(10)

    if (props.mode === 'task' && props.projectMembers?.length > 0) {
      const memberIds = props.projectMembers.map(m => m.id)
      dbQuery = dbQuery.not('id', 'in', `(${memberIds.join(',')})`)
    }

    const { data, error } = await dbQuery

    if (error) {
      console.error('Ошибка поиска:', error)
      searchResults.value = []
    } else {
      searchResults.value = data || []
    }
  } catch (err) {
    console.error('Ошибка:', err)
    searchResults.value = []
  } finally {
    isLoading.value = false
  }
}

// Следим за изменением поискового запроса
watch(searchQuery, (newValue) => {
  if (searchTimer) {
    clearTimeout(searchTimer)
  }

  if (!newValue.trim()) {
    searchResults.value = []
    return
  }

  searchTimer = setTimeout(() => {
    searchUsers()
  }, 500)
})

const props = defineProps({
  projectId: {
    type: [Number, String],
    default: null
  },
  selectedUsers: {
    type: Array,
    default: () => []
  },
  mode: {  //ДОБАВЬТЕ ЭТО
    type: String,
    default: 'edit'
  }
})

// 👇 ДОБАВЬТЕ ЭТУ ФУНКЦИЮ
const checkOwnership = async () => {
  if (!props.projectId || !currentUserId.value) return false

  try {
    const { data, error } = await supabase
      .from('projects')
      .select('created_by')
      .eq('id', props.projectId)
      .single()

    if (error) throw error

    isOwner.value = data?.created_by === currentUserId.value
    console.log('👑 Владелец проекта:', isOwner.value)
  } catch (err) {
    console.error('Ошибка проверки владельца:', err)
    isOwner.value = false
  }
}

// Загружаем участников проекта
const loadProjectMembers = async () => {
  if (!props.projectId) return

  try {
    // 1. Загружаем участников из project_members
    const { data, error } = await supabase
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
      .eq('project_id', props.projectId)

    if (error) throw error

    // Формируем список участников
    let members = data?.map(m => ({
      id: m.profiles.id,
      full_name: m.profiles.full_name,
      name: m.profiles.full_name,
      avatar_url:m.profiles.avatar_url ? `${m.profiles.avatar_url}?v=${avatarVersion.value}` : null,
      role: m.role || 'Участник',
      isOwner: false
    })) || []

    // 2. Добавляем владельца проекта
    const { data: projectData } = await supabase
      .from('projects')
      .select('created_by')
      .eq('id', props.projectId)
      .single()

    if (projectData?.created_by) {
      const { data: ownerData } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .eq('id', projectData.created_by)
        .single()

      if (ownerData) {
        // Проверяем, есть ли уже владелец в списке
        const ownerExists = members.some(m => m.id === ownerData.id)

        if (!ownerExists) {
          // Добавляем владельца в начало списка
          members.unshift({
            id: ownerData.id,
            full_name: ownerData.full_name,
            name: ownerData.full_name,
            avatar_url: ownerData.avatar_url ? `${ownerData.avatar_url}?v=${avatarVersion.value}` : null,
            role: 'Владелец',
            isOwner: true
          })
        } else {
          // Если уже есть, просто помечаем как владельца
          const owner = members.find(m => m.id === ownerData.id)
          if (owner) {
            owner.role = 'Владелец'
            owner.isOwner = true
            owner.avatar_url = ownerData.avatar_url ? `${ownerData.avatar_url}?v=${avatarVersion.value}` : null
          }
        }
      }
    }

    projectMembers.value = members
    console.log('👥 Участники проекта (с владельцем):', projectMembers.value)

  } catch (err) {
    console.error('Ошибка загрузки участников:', err)
    projectMembers.value = []
  }
}

const handleConfirm = () => {
  console.log('📝 Подтверждение выбора пользователей:', selectedUsers.value)
  // Просто передаем список наверх
  emit('confirm', selectedUsers.value)
  emit('close')
}

const isSelected = (user) => {
  return selectedUsers.value.some(u => u.id === user.id)
}

// Инициализация
onMounted(async () => {
  await checkOwnership()  //ДОБАВЬТЕ ЭТУ СТРОЧКУ
  await loadProjectMembers()

  // 1. Если переданные пользователи (для задачи)
  if (props.selectedUsers && props.selectedUsers.length) {
    selectedUsers.value = props.selectedUsers.map(u => ({
      id: u.id,
      name: u.name || u.full_name,
      full_name: u.name || u.full_name,
      avatar_url: u.avatar || u.avatar_url,
      role: u.role || 'Участник'
    }))
  }

  // 2. Если режим edit и есть projectId - загружаем участников проекта
  if (props.mode === 'edit' && props.projectId) {
    await loadProjectMembers()
  }
})

const toggleUser = async(user) => {
  try{
  if (isSelected(user)) {
    selectedUsers.value = selectedUsers.value.filter(u => u.id !== user.id)
    console.log('🗑️ Удаляем:', user.name)
  } else {
    selectedUsers.value.push({
      id: user.id,
      name: user.full_name,
      full_name: user.full_name,
      avatar_url: user.avatar_url,
      role: user.role || 'Участник'
    })
    console.log('📋 Текущие выбранные:',  user.name)
  }
    console.log('📋 Текущие выбранные:', selectedUsers.value.map(u => u.name))

  } catch (error) {
    console.error('❌ Ошибка в toggleUser:', error)
  }
}
</script>
