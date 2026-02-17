<template>
  <!-- Модальное окно для добавления участников -->
  <add-user
    v-if="showMemberModal"
    @close="closeModal"
    @confirm="handleMembersConfirm"
  />

  <div class="bg-white border-b border-gray-200 px-15">
    <!-- Заголовок проекта с выбранными пользователями -->
    <div class="mb-6 gap-2 flex justify-between items-center">
        <h1 class="text-5xl font-bold text-gray-900">
          {{ project.name }}
        </h1>

        <!-- Отображение выбранных пользователей (круглишки-эллипсы) -->
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
              {{ user.name.charAt(0) }}
            </div>
          </div>

          <!-- Кнопка добавления участника (всегда отображается) -->
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
      <button class="px-1 py-2 text-lg font-semibold text-[#318AEE] border-b-2 border-[#318AEE] cursor-pointer">
        Доска
      </button>
      <button class="px-1 py-2 text-lg font-semibold text-[#C0C0C0]">
        Календарь
      </button>
      <button class="px-1 py-2 text-lg font-semibold text-[#C0C0C0]">
        Команда
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AddUser from '../Pasport/Add-User.vue'

// Props
const props = defineProps({
  project: {
    type: Object,
    required: true
  }
})

// Объявляем события
const emit = defineEmits(['updateName']) // ← Добавить эту строку!

// Выбранные пользователи
const selectedUsers = ref([])

// Состояние модального окна
const showMemberModal = ref(false)

// Загружаем пользователей при монтировании
onMounted(() => {
  loadUsers()
})

// Функция загрузки пользователей из localStorage
const loadUsers = () => {
  const savedUsers = localStorage.getItem('projectMembers')
  console.log('Загружаем из localStorage:', savedUsers)

  if (savedUsers && savedUsers !== 'undefined' && savedUsers !== 'null') {
    try {
      const parsed = JSON.parse(savedUsers)
      if (Array.isArray(parsed)) {
        selectedUsers.value = parsed
        console.log('Загружены участники в Name_pg:', selectedUsers.value)
      } else {
        console.error('Сохраненные данные не являются массивом:', parsed)
        selectedUsers.value = []
      }
    } catch (e) {
      console.error('Ошибка загрузки участников:', e)
      selectedUsers.value = []
    }
  } else {
    console.log('Нет сохраненных участников')
    selectedUsers.value = []
  }
}

// Функция для получения цвета пользователя
const getUserColor = (userId) => {
  const colors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B',
    '#8B5CF6', '#EC4899', '#06B6D4', '#14B8A6'
  ]
  return colors[userId % colors.length]
}

// Обработчик ошибки загрузки изображения
const handleImageError = (e) => {
  e.target.style.display = 'none'
}

// Открытие модалки
const openAddMemberModal = () => {
  showMemberModal.value = true
}

// Закрытие модалки
const closeModal = () => {
  showMemberModal.value = false
  loadUsers() // Перезагружаем после закрытия
}

// Обработчик подтверждения
const handleMembersConfirm = (users) => {
  console.log('Выбраны участники из модалки в Name_pg:', users)

  if (users && users.length > 0) {
    // Сохраняем в localStorage
    localStorage.setItem('projectMembers', JSON.stringify(users))
    // Обновляем локальное состояние
    selectedUsers.value = users
  }

  closeModal()
}
</script>

<style scoped>
/* Стили для перекрытия аватарок (эллипсов) */
.-space-x-2 > * {
  margin-right: -0.5rem;
}

.-space-x-2 > *:last-child {
  margin-right: 0;
}

/* Анимация при наведении на аватарку */
.-space-x-2 > *:hover {
  transform: scale(1.05);
  z-index: 10;
  transition: transform 0.2s ease;
}

/* Кнопка добавления */
button {
  transition: all 0.2s ease;
}
</style>
