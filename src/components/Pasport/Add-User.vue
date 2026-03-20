<template>
  <!-- Overlay -->
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-2 sm:p-0"> <!--p-2 sm:p-0 добавляет отсуп по ширине-->

    <!-- Modal -->
    <div
      class="bg-white w-full max-w-[420px] sm:w-[420px] max-h-[80vh] rounded-[22px] p-4 flex flex-col relative"
    >

      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-[18px] font-semibold">Добавить участника</h2>
        <button
          @click="$emit('close')"
          class="w-8 h-8 flex items-center justify-center
                 rounded-full hover:bg-gray-100 text-gray-400"
        >
          ✕
        </button>
      </div>

      <!-- Search -->
      <div class="relative mb-3">
        <input
          v-model="searchQuery"
          @input="searchUsers"
          type="text"
          placeholder="Начните ввод..."
          class="w-full border border-[#CBCBCB]
                 rounded-[12px] px-4 py-2 text-sm
                 focus:outline-none focus:border-[#4286F7]"
        />
      </div>

      <!-- Users list (scroll) -->
      <div
        class="flex-1 overflow-y-auto space-y-2 pr-1"
        :style="{ maxHeight: searchResults.length > 4 ? '260px' : 'auto' }"
      >
        <div
          v-for="user in searchResults"
          :key="user.id"
          class="flex items-center gap-3 p-2 rounded-[14px]
                 hover:bg-[#F6F8FA] cursor-pointer"
          :class="{ 'bg-blue-50': isSelected(user) }"
          @click="toggleUser(user)"
        >
          <img
            :src="user.avatar_url"
            class="w-9 h-9 rounded-full"
          />

          <div class="flex-1">
            <p class="text-[14px] font-medium">{{ user.full_name }}</p>
            <p class="text-[12px] text-[#6C727C]">{{ user.role || 'Участник' }}</p>
          </div>

          <!-- Checkbox -->
          <div
            class="w-5 h-5 rounded-[6px] border flex items-center justify-center transition-colors shrink-0"
            :class="isSelected(user)
              ? 'bg-[#4286F7] border-[#4286F7]'
              : 'border-[#CBCBCB]'"
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

      <!-- Selected preview -->
      <div
        v-if="selectedUsers.length"
        class="flex gap-2 flex-wrap mt-3"
      >
        <div
          v-for="user in selectedUsers"
          :key="user.id"
          class="flex items-center gap-2
                 bg-[#F6F8FA] px-2 py-1 rounded-full"
          @click="toggleUser(user)"
        >
          <img :src="user.avatar_url" class="w-5 h-5 rounded-full" />
          <span class="text-[12px]">{{ user.name }}</span>
          <!-- Checkbox -->
          <div
            class="w-5 h-5 rounded-[6px] border flex items-center justify-center transition-colors shrink-0"
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
        @click="handleConfirm"
        class="mt-4 bg-[#222222] hover:bg-[#4286F7]
               text-white py-2 rounded-[14px]
               text-[15px] font-medium transition-colors"
      >
        Готово
      </button>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted, watch} from 'vue'
import { supabase } from '@/lib/supabase'


const emit = defineEmits(['close', 'confirm'])
// 👇 Объявляем все переменные
const searchQuery = ref('')
const selectedUsers = ref([])
const allUsers = ref([])  // 👈 Все пользователи для режима edit
const projectMembers = ref([])  // 👈 Участники проекта для режима task
const searchResults = ref([])
const isLoading = ref(false)

// Поиск пользователей в БД
let searchTimer = null

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
  mode: {  // 👈 ДОБАВЬТЕ ЭТО
    type: String,
    default: 'edit'
  }
})


// Загружаем участников проекта
const loadProjectMembers = async () => {
  if (!props.projectId) return

  const { data, error } = await supabase
    .from('project_members')
    .select(`
      user_id,
      profiles (
        id,
        full_name,
        avatar_url
      )
    `)
    .eq('project_id', props.projectId)

  if (!error && data) {
    projectMembers.value = data.map(m => ({
      id: m.profiles.id,
      full_name: m.profiles.full_name,
      avatar_url: m.profiles.avatar_url
    }))
  }
}


const handleConfirm = () => {
  emit('confirm', selectedUsers.value)
  emit('close')
}

const isSelected = (user) => {
  return selectedUsers.value.some(u => u.id === user.id)
}

// Инициализация
onMounted(async () => {
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
