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
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'

// 👇 Объявляем все переменные
const searchQuery = ref('')
const searchResults = ref([])
const selectedUsers = ref([])

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
    default: 'create'
  }
})

const emit = defineEmits(['close', 'confirm'])

const handleConfirm = () => {
  emit('confirm', selectedUsers.value)
  emit('close')
}
// При открытии модалки в режиме edit - предвыбираем пользователей
const selectedIds = ref([])


const loadMembers = async () => {

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

  if (error) {
    console.error('Ошибка загрузки участников:', error)
    return
  }

  selectedUsers.value = data.map(item => ({
    id: item.profiles.id,
    name: item.profiles.full_name,
    avatar: item.profiles.avatar_url,
    full_name: item.profiles.full_name,
    avatar_url: item.profiles.avatar_url
  }))

  console.log('👥 Текущие участники:', selectedUsers.value)
}

const isSelected = (user) => {
  return selectedUsers.value.some(u => u.id === user.id)
}

onMounted(async () => {
  if (props.mode === 'edit' && props.projectId) {
    await loadMembers()
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

const searchUsers = async () => {
  console.log('🔍 Ищем:', searchQuery.value)

  if (!searchQuery.value.trim()) {
    searchResults.value = []
    return
  }

  // Тест с конкретным именем
  const testQuery = 'Бурлов'
  const { data: testData, error: testError } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url')
    .ilike('full_name', `%${testQuery}%`)

  console.log('🧪 Тестовый поиск "Бурлов":', testData)
  console.log('🧪 Ошибка теста:', testError)

  // Основной поиск
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url')
    .ilike('full_name', `%${searchQuery.value}%`)
    .limit(5)

  if (error) {
    console.error('❌ Ошибка поиска:', error)
  }

  console.log('📦 Результаты поиска:', data)
  searchResults.value = data || []
}
</script>
