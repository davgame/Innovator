<template>
  <!-- Кнопка поиска для мобильной версии -->
  <button
    @click="openModal"
    class="lg:hidden p-2 mr-4 text-gray-400 hover:bg-gray-100 transition-colors border rounded-lg border-[#9A9A9A]/20 w-10 h-10"
  >
    <img src="/src/assets/images/search.svg" class="w-[21px] h-[21px]" alt="Поиск">
  </button>

  <!-- Модальное окно -->
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 translate-y-full"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition-all duration-300 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-full"
  >
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 bg-white flex flex-col"
    >
      <!-- Шапка -->
      <div class="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 class="text-[18px] font-semibold">Поиск пользователей</h2>
        <button
          @click="closeModal"
          class="cursor-pointer w-9 h-9 flex items-center justify-center border border-[#9A9A9A]/20 rounded-[9px] text-[#374151]"
        >
          <span class="text-3xl leading-none py-[2px] mb-[4px]">×</span>
        </button>
      </div>

      <!-- Поле поиска -->
      <div class="p-4 border-b border-gray-200">
        <div class="relative">
          <img
            src="/src/assets/images/search.svg"
            class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            alt="Поиск"
          />
          <input
            ref="searchInputRef"
            v-model="searchQuery"
            type="text"
            placeholder="Поиск инноватора"
            class="w-full pl-10 pr-10 px-4 py-3 border border-gray-300 rounded-[14px] focus:outline-none focus:border-blue-500"
            @input="debouncedSearch"
            @keyup.enter="searchUsers"
            autofocus
          />
          <button
            v-if="searchQuery"
            class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500"
            @click="clearSearch"
          >
            ✕
          </button>
        </div>
      </div>

      <!-- Результаты -->
      <div class="flex-1 overflow-y-auto">
        <div v-if="loading" class="flex justify-center items-center h-32">
          <div class="text-gray-500">Поиск...</div>
        </div>

        <div v-else-if="searchResults.length > 0">
          <div
            v-for="user in searchResults"
            :key="user.id"
            class="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
            @click="goToUserProfile(user.id)"
          >
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-full overflow-hidden bg-blue-500 flex-shrink-0">
                <img
                  v-if="user.avatar_url"
                  :src="user.avatar_url"
                  class="w-full h-full object-cover"
                  alt="Avatar"
                />
                <div
                  v-else
                  class="w-full h-full flex items-center justify-center text-white font-medium text-lg"
                >
                  {{ getUserInitials(user.full_name) }}
                </div>
              </div>

              <div class="flex-1">
                <div class="flex items-center gap-1">
                  <h1 class="font-semibold text-base">{{ user.full_name || 'Пользователь' }}</h1>
                  <img src="/src/assets/images/metka.svg" class="w-[16px] h-[16px]" alt="metka">
                </div>
                <p class="text-sm text-gray-500">{{ user.email || '' }}</p>
              </div>

              <div
                class="w-2.5 h-2.5 rounded-full"
                :class="user.status === 'online' ? 'bg-green-500' : 'bg-gray-300'"
                :title="user.status === 'online' ? 'В сети' : 'Не в сети'"
              ></div>
            </div>
          </div>
        </div>

        <div
          v-else-if="searchQuery && !loading && searchResults.length === 0"
          class="flex justify-center items-center h-32 text-gray-500"
        >
          Ничего не найдено
        </div>

        <div
          v-else-if="!searchQuery && !loading"
          class="flex justify-center items-center h-32 text-gray-400"
        >
          Введите имя для поиска
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'

const router = useRouter()
const isOpen = ref(false)
const searchQuery = ref('')
const searchResults = ref([])
const loading = ref(false)
const searchInputRef = ref(null)

const getUserInitials = (name) => {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const openModal = () => {
  isOpen.value = true
  nextTick(() => {
    searchInputRef.value?.focus()
  })
}

const closeModal = () => {
  isOpen.value = false
  clearSearch()
}

const clearSearch = () => {
  searchQuery.value = ''
  searchResults.value = []
  loading.value = false
}

const debounce = (fn, delay) => {
  let timeout = null
  return (...args) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => fn(...args), delay)
  }
}

const searchUsers = async () => {
  const query = searchQuery.value.trim()

  if (!query || query.length < 2) {
    searchResults.value = []
    return
  }

  loading.value = true

  try {
    let { data, error } = await supabase
      .from('profiles')
      .select('*')
      .textSearch('full_name', query, { config: 'russian' })
      .limit(10)

    if (error || !data || data.length === 0) {
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('profiles')
        .select('*')
        .ilike('full_name', `%${query}%`)
        .limit(10)

      if (fallbackError) throw fallbackError
      data = fallbackData
    }

    searchResults.value = data || []
  } catch (error) {
    console.error('Ошибка поиска:', error)
    searchResults.value = []
  } finally {
    loading.value = false
  }
}

const debouncedSearch = debounce(searchUsers, 300)

const goToUserProfile = (userId) => {
  console.log('👤 Переход к пользователю:', userId)

  // Сохраняем ID пользователя
  const targetUserId = userId

  // Закрываем модальное окно (без очистки)
  isOpen.value = false

  // Очищаем поиск после закрытия
  setTimeout(() => {
    clearSearch()
  }, 100)

  // Переходим на страницу пользователя
  setTimeout(() => {
    router.push(`/profile/${targetUserId}`)
  }, 350)
}

const handleKeydown = (e) => {
  if (e.key === 'Escape' && isOpen.value) {
    closeModal()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>
