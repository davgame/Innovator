<template>
  <!-- Модальное окно для добавления участников -->
  <add-user
    v-if="showMemberModal"
    @close="closeModal"
    @confirm="handleMembersConfirm"
  />

  <!-- Модальное окно для выбора даты -->
  <div
    v-if="showDatePicker && currentTaskForDate"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
    @click.self="closeDatePicker"
  >
    <div class="bg-white rounded-2xl p-6 w-full max-w-sm">
      <div class="flex justify-between items-center mb-4">
        <h3 class="font-semibold text-lg">Выберите дату</h3>
        <button @click="closeDatePicker" class="text-gray-400 hover:text-gray-600">
          ✕
        </button>
      </div>

      <input
        v-model="tempSelectedDate"
        type="date"
        class="w-full p-3 border border-gray-300 rounded-lg"
      />

      <div class="mt-4 flex gap-2">
        <button
          @click="setToday"
          class="flex-1 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
        >
          Сегодня
        </button>
        <button
          @click="clearDate"
          class="flex-1 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
        >
          Очистить
        </button>
        <button
          @click="saveDate"
          class="flex-1 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
        >
          Сохранить
        </button>
      </div>
    </div>
  </div>

  <div class="flex gap-6 px-3 pb-4 h-[calc(70vh-55px)] overflow-x-auto overflow-y-hidden">
    <!-- Колонка -->
    <div
      v-for="column in columns"
      :key="column.id"
      class="w-82 rounded-2xl p-4 flex flex-col flex-shrink-0 bg-white min-h-0"
    >
      <!-- Заголовок -->
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-3">
          <h3 class="font-semibold text-[28px] text-gray-700">
            {{ column.title }}
          </h3>
          <span class="text-[#318AEE] text-[28px] font-semibold rounded-full">
            {{ column.tasks.length }}
          </span>
        </div>
      </div>

      <button class="text-[#C0C0C0] text-[25px] border border-[#D7D7D7] bg-[#D9D9D9]/11 w-74 h-12 rounded-[12px] mb-7 cursor-pointer">
        <p>+</p>
      </button>

      <!-- ВАЖНО: draggable должен быть единственным дочерним элементом с flex-1 -->
      <draggable
        v-model="column.tasks"
        group="tasks"
        item-key="id"
        class="flex-1 min-h-0 space-y-6 overflow-y-auto pr-2 transition-all"
        :class="column.tasks.length === 0 ? 'overflow-y-hidden' : 'overflow-y-auto'"
      >
        <template #item="{ element }">
          <div class="rounded-xl px-4 h-50 py-6 border-2 border-[#D7D7D7]/32 cursor-move transition relative">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2">
                <button class="bg-[#FFDFDD] w-22 h-7 text-[#C76269] text-[13px] rounded-[5px]">
                  <p>UI Дизайн</p>
                </button>
                <button class="bg-[#F8FAF9] w-12 h-7 text-[#838886] text-[20px] rounded-[5px]">
                  <p>+</p>
                </button>
              </div>

              <!-- Кнопка с тремя точками -->
              <button
                @click.stop="toggleContextMenu(element)"
                class="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
            </div>

            <p class="text-xl font-medium">
              {{ element.title }}
            </p>

            <!-- Контекстное меню -->
            <ContextMenu
              v-if="activeContextMenu === element.id"
              @edit="editTask(element)"
              @delete="deleteTask(element, column.id)"
            />

            <div class="flex justify-between items-center mt-2 mb-2">
              <span class="text-xs text-gray-500">Прогресс</span>
              <span class="text-xs font-medium text-gray-700">{{ element.progress }}%</span>
            </div>

            <!-- Прогресс бар -->
            <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-2">
              <div
                class="h-full rounded-full transition-all duration-300"
                :class="getProgressColor(element.progress)"
                :style="{ width: element.progress + '%' }"
              ></div>
            </div>

            <!-- Нижняя часть: участники и дата -->
            <div class="flex items-center justify-between mt-4">
              <!-- Участники задачи -->
              <div class="flex items-center gap-1">
                <!-- Аватары участников -->
                <div
                  v-for="member in element.members || []"
                  :key="member.id"
                  class="w-8 h-8 rounded-full overflow-hidden border-2 border-white"
                  :style="{ backgroundColor: member.color || '#e5e7eb' }"
                  :title="member.name"
                >
                  <img
                    v-if="member.avatar"
                    :src="member.avatar"
                    class="w-full h-full object-cover"
                    :alt="member.name"
                  />
                  <div
                    v-else
                    class="w-full h-full flex items-center justify-center text-xs text-white"
                  >
                    {{ member.name.charAt(0) }}
                  </div>
                </div>

                <!-- Кнопка добавления участника -->
                <button
                  class="border border-[#F2F2F2] w-8 h-8 text-[#838886] text-[24px] rounded-full flex items-center justify-center ml-1"
                  @click.stop="openAddMemberToTask(element)"
                  title="Добавить участника"
                >
                  <p class="text-[18px] pb-1">+</p>
                </button>
              </div>

              <!-- Кнопка календаря с датой -->
              <button
                @click.stop="openDatePicker(element)"
                class="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
                :class="element.deadline ? 'text-gray-700' : 'text-gray-400'"
              >
                <img src="/src/assets/images/calendar.svg" alt="" class="w-4 h-4 mr-1">
                <span v-if="element.deadline" class="font-medium">
                  {{ formatDateForDisplay(element.deadline) }}
                </span>
                <span v-else>Дедлайн</span>
              </button>
            </div>
          </div>
        </template>
          <!-- ИСПОЛЬЗУЕМ FOOTER СЛОТ ДЛЯ ПУСТОГО СОСТОЯНИЯ -->
        <template #footer>
          <!-- ПУСТОЕ СОСТОЯНИЕ ДЛЯ КОЛОНКИ "В РАБОТЕ" (id = 2) -->
        <div
        v-if="column.id === 1 && column.tasks.length === 0"
        class="flex flex-col items-center justify-center"
      >
        <div class="border border-[#D7D7D7]/32 rounded-2xl w-72 h-86 flex flex-col items-center">
          <div class="border border-[#D7D7D7]/32 w-65 h-46 flex items-center justify-center flex-col mt-3 rounded-2xl">
            <div class="w-16 h-16 rounded-full bg-[#F8FAF9] flex items-center justify-center mb-3">
              <img src="/src/assets/images/task.svg" alt="" class="w-8 h-8">
            </div>
            <div class="text-center">
              <p class="text-xl font-medium text-gray-400 mb-1">Беклог пуст</p>
              <p class="text-sm text-gray-400">Пока нет задач в работе</p>
            </div>
          </div>
        </div>
      </div>

            <!-- ПУСТОЕ СОСТОЯНИЕ ДЛЯ КОЛОНКИ "В РАБОТЕ" (id = 2) -->
       <div
        v-if="column.id === 2 && column.tasks.length === 0"
        class="flex flex-col items-center justify-center"
      >
        <div class="border border-[#D7D7D7]/32 rounded-2xl w-72 h-86 flex flex-col items-center">
          <div class="border border-[#D7D7D7]/32 w-65 h-46 flex items-center justify-center flex-col mt-3 rounded-2xl">
            <div class="w-16 h-16 rounded-full bg-[#F8FAF9] flex items-center justify-center mb-3">
              <img src="/src/assets/images/task.svg" alt="" class="w-8 h-8">
            </div>
            <div class="text-center">
              <p class="text-xl font-medium text-gray-400 mb-1">В работе 0</p>
              <p class="text-sm text-gray-400">Пока нет задач в работе</p>
            </div>
          </div>
        </div>
      </div>
          <!-- Пустое состояние для колонки "Готово" (id = 3) - ПОЛНОСТЬЮ ВНЕ draggable -->
      <div
        v-if="column.id === 3 && column.tasks.length === 0"
        class="flex flex-col items-center justify-center"
      >
        <div class="border border-[#D7D7D7]/32 rounded-2xl w-72 h-86 flex flex-col items-center">
          <div class="border border-[#D7D7D7]/32 w-65 h-46 flex items-center justify-center flex-col mt-3 rounded-2xl">
            <div class="w-16 h-16 rounded-full bg-[#F8FAF9] flex items-center justify-center mb-3">
              <img src="/src/assets/images/task.svg" alt="" class="w-8 h-8">
            </div>
            <div class="text-center">
              <p class="text-xl font-medium text-gray-400 mb-1">Завершено 0</p>
              <p class="text-sm text-gray-400">Пока нет выполненных задач</p>
            </div>
          </div>
        </div>
      </div>
      </template>
      </draggable>
    </div>
  </div>

  <!-- Оверлей для закрытия контекстного меню -->
  <div
    v-if="activeContextMenu"
    class="fixed inset-0 z-40"
    @click="closeContextMenu"
  ></div>
</template>

<script setup>
import { ref } from 'vue'
import draggable from 'vuedraggable'
import AddUser from '../Pasport/Add-User.vue'
import ContextMenu from './ContextMenu.vue'


const columns = ref([
  {
    id: 1,
    title: 'Беклог',
    tasks: [
      { id: 1, title: 'UX/UI дизайн', progress: 12 },
      { id: 2, title: 'API интеграция', progress: 5 }
    ]
  },
  {
    id: 2,
    title: 'В работе',
    tasks: [
      { id: 3, title: 'BPMN схема', progress: 77 }
    ]
  },
  {
    id: 3,
    title: 'Готово',
    tasks: []
  }
])

// Состояние для календаря
const showDatePicker = ref(false)
const currentTaskForDate = ref(null)
const tempSelectedDate = ref('')

// Открытие календаря для задачи
const openDatePicker = (task) => {
  currentTaskForDate.value = task
  tempSelectedDate.value = task.deadline || ''
  showDatePicker.value = true
}

// Закрытие календаря
const closeDatePicker = () => {
  showDatePicker.value = false
  currentTaskForDate.value = null
  tempSelectedDate.value = ''
}

// Установить сегодняшнюю дату
const setToday = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  tempSelectedDate.value = `${year}-${month}-${day}`
}

// Очистить дату
const clearDate = () => {
  if (currentTaskForDate.value) {
    delete currentTaskForDate.value.deadline
  }
  closeDatePicker()
}

// Сохранить дату
const saveDate = () => {
  if (currentTaskForDate.value && tempSelectedDate.value) {
    currentTaskForDate.value.deadline = tempSelectedDate.value
  }
  closeDatePicker()
}

// Форматирование даты для отображения
const formatDateForDisplay = (dateString) => {
  if (!dateString) return ''

  try {
    const date = new Date(dateString)
    const day = date.getDate()

    // Сокращенные названия месяцев на русском
    const months = {
      1: 'янв', 2: 'фев', 3: 'мар', 4: 'апр',
      5: 'май', 6: 'июн', 7: 'июл', 8: 'авг',
      9: 'сен', 10: 'окт', 11: 'ноя', 12: 'дек'
    }

    const month = months[date.getMonth() + 1] || ''

    return `${day} ${month}`
  } catch (e) {
    return dateString
  }
}


// Функция для определения цвета прогресс-бара в зависимости от процента
const getProgressColor = (progress) => {
  if (progress < 30) return 'bg-red-500'
  if (progress < 70) return 'bg-yellow-500'
  if (progress < 100) return 'bg-blue-500'
  return 'bg-green-500'
}


// Состояние модального окна
const showMemberModal = ref(false)
// Данные о задаче, к которой добавляем участников
const currentTaskForMembers = ref(null)

// Обработчик добавления участников ко всей колонке
const handleMembersAdded = (selectedUsers) => {
  console.log('Добавлены участники проекта:', selectedUsers)
  // Здесь можно добавить логику сохранения участников проекта
  showMemberModal.value = false
}

// Открытие модального окна для добавления участников к задаче
const openAddMemberToTask = (task) => {
  currentTaskForMembers.value = task
  showMemberModal.value = true
}

// Функция для закрытия модального окна
const closeModal = () => {
  showMemberModal.value = false
  currentTaskForMembers.value = null
}

// Обработчик подтверждения выбора участников
const handleMembersConfirm = (selectedUsers) => {
  console.log('Выбраны участники:', selectedUsers)

  if (currentTaskForMembers.value) {
    addMembersToTask(selectedUsers, currentTaskForMembers.value)
  }

  closeModal() // Закрываем модалку после подтверждения
}

// Функция для добавления участников к задаче
const addMembersToTask = (selectedUsers, task) => {
  if (!task.members) {
    task.members = []
  }

  // Добавляем только тех участников, которых еще нет в задаче
  selectedUsers.forEach(user => {
    if (!task.members.some(member => member.id === user.id)) {
      task.members.push({
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        color: getRandomColor()
      })
    }
  })
}

// Вспомогательная функция для генерации случайного цвета
const getRandomColor = () => {
  const colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
    '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'
  ]
  return colors[Math.floor(Math.random() * colors.length)]
  }


// Состояние для контекстного меню
const activeContextMenu = ref(null)

// Открытие/закрытие контекстного меню
const toggleContextMenu = (task) => {
  if (activeContextMenu.value === task.id) {
    activeContextMenu.value = null
  } else {
    activeContextMenu.value = task.id
  }
}

// Закрытие контекстного меню
const closeContextMenu = () => {
  activeContextMenu.value = null
}

// Удаление задачи
const deleteTask = (task, columnId) => {
  const column = columns.value.find(col => col.id === columnId)
  if (column) {
    const taskIndex = column.tasks.findIndex(t => t.id === task.id)
    if (taskIndex !== -1) {
      column.tasks.splice(taskIndex, 1)
    }
  }
  closeContextMenu()
}

// Редактирование задачи
const editTask = (task) => {
  console.log('Редактировать задачу:', task)
  // Здесь будет логика редактирования
  closeContextMenu()
}

</script>

<style scoped>
/* Стили для скроллбара внутри колонок */
.flex-1.overflow-y-auto::-webkit-scrollbar {
  width: 4px; /* ← Здесь меняем толщину скроллбара */
}

.flex-1.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.flex-1.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.flex-1.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

/* Для Firefox */
.flex-1.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: #c1c1c1 #f1f1f1;
}

/* Плавная анимация для прогресс-бара */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}
</style>
