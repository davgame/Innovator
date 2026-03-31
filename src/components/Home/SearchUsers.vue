<template>
  <div class="relative flex items-center justify-end">
    <!-- Иконка поиска (всегда видна) -->
    <button
      @click="toggleSearch"
      class="flex items-center justify-center lg:mr-0 mr-4 text-gray-400 hover:bg-gray-100 transition-colors border rounded-[9px] border-[#9A9A9A]/20 w-11 h-[42px] lg:cursor-pointer"
    >
      <img src="/src/assets/images/search.svg" class="w-[21px] h-[21px]" alt="Поиск">
    </button>

    <!-- Строка поиска с анимацией -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 -translate-x-4"
      enter-to-class="opacity-100 translate-x-0"
      leave-active-class="transition-all duration-300 ease-in"
      leave-from-class="opacity-100 translate-x-0"
      leave-to-class="opacity-0 translate-x-4"
    >
      <div
        v-if="showSearchInput"
        class="absolute right-14 flex items-center border-b border-gray-300 focus-within:border-blue-500 transition-colors bg-white w-72"
      >
        <input
          ref="searchInputRef"
          v-model="searchQuery"
          type="text"
          placeholder="Поиск инноватора"
          class="w-64 py-2 px-1 outline-none bg-transparent text-gray-700 placeholder-gray-400"
          @input="debouncedSearch"
          @focus="showResults = true"
          @keyup.enter="searchUsers"
          @keyup.esc="closeSearch"
        />
        <button
          v-if="searchQuery"
          class="p-2 text-gray-400 hover:text-red-500 transition-colors"
          @click="clearSearch"
        >
          ✕
        </button>
      </div>
    </Transition>

    <!-- Результаты поиска -->
    <div
      v-if="showResults && searchResults.length > 0"
      class="absolute top-full lg:right-[53px] mt-4 w-73 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto justify-center items-center"
    >
      <div
        v-for="user in searchResults"
        :key="user.id"
        class="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
        @click="goToUserProfile(user.id)"
      >
        <div class="flex items-center justify-center gap-3 ">
          <!-- Аватар пользователя -->
          <div class="flex items-center justify-center w-10 h-10 rounded-full overflow-hidden bg-[#CFD9FF] flex-shrink-0">
            <img
              v-if="user.avatar_url"
              :src="user.avatar_url"
              class="w-full h-full object-cover"
              alt="Avatar"
            />
            <img
              v-else
              src="/src/assets/images/Emodzi.svg"
              class="lg:w-[24px] lg:h-[24px] w-[45px] h-[45px] object-cover"
            >
            </img>
          </div>

          <div>
            <div class="flex items-center gap-1">
              <h1 class="font-semibold">{{ user.full_name || 'Пользователь'  }}</h1>
              <img src="/src/assets/images/metka.svg" class="w-[18px] h-[18px] translate-y-[2px]" alt="metka">
            </div>
            <p class="text-sm text-gray-500">{{ user.email }}</p>
          </div>

          <!-- Индикатор онлайн -->
          <div
            class="w-2 h-2 rounded-full ml-auto flex items-center"
            :class="user.status === 'online' ? 'bg-green-500' : 'bg-gray-300'"
            :title="user.status === 'online' ? 'В сети' : 'Не в сети'"
          ></div>
        </div>
      </div>
    </div>

    <!-- Сообщение если ничего не найдено -->
    <div
      v-else-if="showResults && searchQuery && !loading && searchResults.length === 0"
      class="absolute top-full lg:right-[53px] mt-4 w-73 bg-white rounded-lg shadow-xl border border-gray-200 z-50 p-4 text-center text-gray-500"
    >
      Ничего не найдено
    </div>

    <!-- Индикатор загрузки -->
    <div
      v-if="loading"
      class="absolute top-full lg:right-[53px] mt-4 w-73 bg-white rounded-lg shadow-xl border border-gray-200 z-50 p-4 text-center"
    >
      Поиск...
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'

const router = useRouter()
const searchQuery = ref('')
const searchResults = ref([])
const showResults = ref(false)
const loading = ref(false)
const showSearchInput = ref(false)
const searchInputRef = ref(null)

// Функция для получения инициалов
const getUserInitials = (name) => {
  if (!name) return '?'
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// Открыть/закрыть поиск
const toggleSearch = () => {
  showSearchInput.value = !showSearchInput.value
  if (showSearchInput.value) {
    // Фокус на инпут после появления
    nextTick(() => {
      searchInputRef.value?.focus()
    })
  } else {
    clearSearch()
  }
}

// Закрыть поиск
const closeSearch = () => {
  showSearchInput.value = false
  loading.value = false
  clearSearch()
}

// Очистить поиск
const clearSearch = () => {
  searchQuery.value = ''
  searchResults.value = []
  showResults.value = false
  loading.value = false
}

// Дебаунс функция
const debounce = (fn, delay) => {
  let timeout = null
  return (...args) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => fn(...args), delay)
  }
}

// Поиск пользователей
const searchUsers = async () => {
  const query = searchQuery.value.trim()

  showResults.value = true

  if (!query || query.length < 2) {
    searchResults.value = []
    return
  }

  loading.value = true
  console.log('🔍 Поиск:', query)

  try {
    // Пробуем полнотекстовый поиск
    let { data, error } = await supabase
      .from('profiles')
      .select('*')
      .textSearch('full_name', query, {
        config: 'russian'
      })
      .limit(5)

    // Если полнотекстовый поиск не сработал или вернул 0 результатов
    if (error || !data || data.length === 0) {
      console.log('🔄 Пробуем обычный поиск...')

      const { data: fallbackData, error: fallbackError } = await supabase
        .from('profiles')
        .select('*')
        .ilike('full_name', `%${query}%`)
        .limit(5)

      if (fallbackError) throw fallbackError
      data = fallbackData
    }

    console.log('📦 Найдено:', data?.length || 0)
    searchResults.value = data || []

  } catch (error) {
    console.error('❌ Ошибка:', error)
    searchResults.value = []
  } finally {
    loading.value = false
  }
}

// Дебаунс для поиска
const debouncedSearch = debounce(searchUsers, 300)

// Переход в профиль
const goToUserProfile = (userId) => {
  showResults.value = false
  closeSearch()
  router.push(`/profile/${userId}`)
}

// Закрыть результаты при клике вне
const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    showResults.value = false
    loading.value = false  // 👈 добавить
    if (showSearchInput.value && !searchQuery.value) {
      showSearchInput.value = false
    }
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
