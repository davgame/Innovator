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
            <p class="text-[12px] text-[#6C727C]">{{ user.role }}</p>
          </div>

          <!-- Checkbox -->
          <div
            class="w-5 h-5 rounded-[6px] border flex items-center justify-center"
            :class="isSelected(user)
              ? 'bg-[#4286F7] border-[#4286F7]'
              : 'border-[#CBCBCB]'"
          >
            <div
              v-if="isSelected(user)"
              class="w-2.5 h-2.5 bg-white rounded-[3px]"
            />
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
        >
          <img :src="user.avatar" class="w-5 h-5 rounded-full" />
          <span class="text-[12px]">{{ user.name }}</span>
        </div>
      </div>

      <!-- Footer button -->
      <button
        @click="addMembers"
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
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'

const props = defineProps({
  projectId: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['close', 'confirm'])

// 👇 Объявляем все переменные
const searchQuery = ref('')
const searchResults = ref([])
const selectedUsers = ref([])

// Поиск пользователей в БД

// Удалить из выбранных (альтернативный метод)
const removeUser = (userId) => {
  selectedUsers.value = selectedUsers.value.filter(u => u.id !== userId)
}

// Сохранить всех выбранных в БД
const addMembers = async () => {
  if (selectedUsers.value.length === 0) {
    alert('Выберите хотя бы одного пользователя')
    return
  }

  const members = selectedUsers.value.map(user => ({
    project_id: props.projectId,
    user_id: user.id,
    role: user.role
  }))

  console.log('Сохраняем участников:', members)

  const { error } = await supabase
    .from('project_members')
    .insert(members)

  if (error) {
    console.error('Ошибка сохранения:', error)
    alert('Ошибка при добавлении участников')
  } else {
    console.log('✅ Участники сохранены')
    emit('confirm', selectedUsers.value)
    emit('close')
  }
}

// Простое подтверждение (без сохранения в БД, если нужно)
const confirm = () => {
  console.log('Confirm в Add-User, отправляем:', selectedUsers.value)
  emit('confirm', selectedUsers.value)
  emit('close')
}

const isSelected = (user) => {
  return selectedUsers.value.some(u => u.id === user.id)
}

const toggleUser = (user) => {
  console.log('🖱️ Клик по пользователю:', user.full_name)

  if (isSelected(user)) {
    selectedUsers.value = selectedUsers.value.filter(u => u.id !== user.id)
  } else {
    selectedUsers.value.push({
      id: user.id,
      name: user.full_name,
      avatar: user.avatar_url,
      full_name: user.full_name,
      avatar_url: user.avatar_url
    })
  }
  console.log('📋 Текущие выбранные:', selectedUsers.value.map(u => u.name))
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
