<template>
  <!-- Кнопка поиска для мобильной версии -->
  <button
    @click="openSearchModal"
    class="lg:hidden p-2 mr-4 text-gray-400 hover:bg-gray-100 transition-colors border rounded-lg border-[#9A9A9A]/20 w-10 h-10"
  >
    <img src="/src/assets/images/search.svg" class="w-[21px] h-[21px]" alt="Поиск">
  </button>

  <!-- Модальное окно поиска (скопировано из MobileLayout) -->
  <Transition name="modal-slide">
    <div v-if="showSearchModal" class="fixed inset-0 z-50 bg-white flex flex-col">
      <div class="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 class="text-[20px] font-semibold">Поиск пользователей</h2>
        <button
          @click="closeSearchModal"
          class="cursor-pointer w-9 h-9 flex items-center justify-center border border-[#9A9A9A]/20 rounded-[9px] text-[#374151]"
        >
          <span class="text-3xl leading-none py-[2px] mb-[4px]">×</span>
        </button>
      </div>

      <!-- Поле поиска -->
      <div class="p-4 border-b border-gray-200">
        <input
          v-model="searchUsersQuery"
          @input="onSearchInput"
          type="text"
          placeholder="Введите имя пользователя..."
          class="w-full border border-[#CBCBCB] rounded-[14px] px-4 py-3 text-sm focus:outline-none focus:border-[#4286F7]"
        />
      </div>

      <!-- Результаты -->
      <div class="flex-1 overflow-y-auto p-4 space-y-2">
        <!-- Индикатор загрузки -->
        <div v-if="searchUsersLoading" class="text-center py-8 text-gray-500">
          <div class="inline-block w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          <p class="mt-2">Загрузка...</p>
        </div>

        <!-- Список пользователей -->
        <div
          v-for="user in searchUsersResults"
          :key="user.id"
          class="flex items-center gap-3 py-2 rounded-[14px] hover:bg-[#F6F8FA] cursor-pointer transition-colors border-b border-gray-100 last:border-0"
          @click="goToUserProfile(user.id)"
        >
          <div class="w-10 h-10 rounded-full overflow-hidden bg-[#CFD9FF] flex-shrink-0">
            <img
              v-if="user.avatar_url"
              :src="user.avatar_url"
              class="w-full h-full object-cover"
              @error="(e) => { e.target.src = '/src/assets/images/Emodzi.svg'; e.target.classList.add('p-1.5') }"
            />
            <img
              v-else
              src="/src/assets/images/Emodzi.svg"
              class="w-full h-full object-cover p-1.5"
            />
          </div>
          <div class="flex-1">
            <p class="text-[14px] font-medium">{{ user.full_name || 'Пользователь' }}</p>
          </div>
        </div>

        <!-- Пустое состояние -->
        <div v-if="!searchUsersLoading && searchUsersResults.length === 0" class="text-center py-8">
          <div class="text-gray-400">
            {{ searchUsersQuery ? 'Пользователи не найдены' : 'Нет пользователей' }}
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'

const router = useRouter()

// Состояния
const showSearchModal = ref(false)
const searchUsersQuery = ref('')
const searchUsersResults = ref([])
const searchUsersLoading = ref(false)
const allUsers = ref([])  // Кэш всех пользователей
let searchUsersTimer = null

// Загрузить всех пользователей (один раз)
const loadAllUsers = async () => {
  console.log('📡 loadAllUsers вызван')

  if (allUsers.value.length > 0) {
    console.log('⚠️ Пользователи уже загружены, всего:', allUsers.value.length)
    searchUsersResults.value = allUsers.value
    return
  }

  searchUsersLoading.value = true

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url')
      .order('full_name')
      .limit(100)

    if (error) throw error

    console.log('✅ Получено из БД:', data?.length)
    allUsers.value = data || []
    searchUsersResults.value = allUsers.value

  } catch (err) {
    console.error('❌ Ошибка загрузки пользователей:', err)
    allUsers.value = []
    searchUsersResults.value = []
  } finally {
    searchUsersLoading.value = false
  }
}

// Фильтрация пользователей по запросу
const filterUsers = () => {
  const query = searchUsersQuery.value.trim().toLowerCase()
  console.log('🔍 filterUsers, запрос:', query)

  if (!query) {
    searchUsersResults.value = allUsers.value
    return
  }

  const filtered = allUsers.value.filter(user =>
    user.full_name?.toLowerCase().includes(query)
  )
  searchUsersResults.value = filtered
  console.log('📋 Отфильтровано:', filtered.length)
}

// Обработка ввода в поиск (с дебаунсом)
const onSearchInput = () => {
  if (searchUsersTimer) {
    clearTimeout(searchUsersTimer)
  }
  searchUsersTimer = setTimeout(() => {
    filterUsers()
  }, 300)
}

// Открыть модалку поиска
const openSearchModal = async () => {
  showSearchModal.value = true
  searchUsersQuery.value = ''
  await loadAllUsers()
}

// Закрыть модалку поиска
const closeSearchModal = () => {
  showSearchModal.value = false
  searchUsersQuery.value = ''
  searchUsersResults.value = []
}

// Переход на профиль пользователя
const goToUserProfile = (userId) => {
  closeSearchModal()
  router.push(`/profile/${userId}`)
}

// Очистка таймера при размонтировании
onMounted(() => {
  // Очищаем таймер при размонтировании компонента
  return () => {
    if (searchUsersTimer) {
      clearTimeout(searchUsersTimer)
    }
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
