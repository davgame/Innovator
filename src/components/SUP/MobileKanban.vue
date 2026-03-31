<template>
  <div class="h-full flex flex-col bg-gray-50 overflow-hidden">
    <!-- Название канбан-доски (как на рисунке 2) -->
    <div class="bg-white px-6 pt-20 pb-2">
      <h2 class="text-4xl font-bold text-gray-900">
        {{ boardName || 'Канбан-доска' }}
      </h2>
    </div>

    <!-- Вкладки -->
    <div class="flex bg-white border-b border-gray-200">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        class="flex-1 py-4 text-center font-medium transition-colors relative text-[15px]"
        :class="activeTab === tab.id ? 'text-blue-600' : 'text-gray-500'"
      >
        {{ tab.title }}
        <span class="ml-0.5 text-sm">{{ getTasksByStatus(tab.id).length }}</span>
        <div
          v-if="activeTab === tab.id"
          class="absolute bottom-0 left-5 right-4 h-0.5 bg-blue-600"
        ></div>
      </button>
    </div>

    <div class="flex justify-center my-7">
    <button class="text-[#C0C0C0] text-[25px] border border-[#D7D7D7] bg-[#D9D9D9]/11 w-81 h-12 rounded-[15px] cursor-pointer"
        @click="openCreateTask(activeTab)">
      <p class="text-15">+</p>
    </button>
    </div>

    <!-- Список задач -->
    <div class="flex-1 overflow-y-auto px-4 space-y-7">
      <div
        v-for="task in getTasksByStatus(activeTab)"
        :key="task.id"
        class="bg-white rounded-2xl p-4 shadow-sm"
      >
      <div class="flex justify-between items-start gap-2">
        <div>
          <h4 class="font-semibold text-gray-800 text-base">{{ task.title }}</h4>
          <p v-if="task.tag" class="text-xs text-gray-400 mt-0.5">{{ task.tag }}</p>
        </div>

        <!-- Кнопка с тремя точками (контекстное меню) -->
        <div class="relative flex-shrink-0">
        <button
          @click.stop="toggleContextMenu(task)"
          class="cursor-pointer p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>

        <!-- Контекстное меню -->
        <div
          v-if="activeContextMenu === task.id"
          class="absolute right-0 top-8 z-20 bg-white rounded-lg shadow-lg border border-gray-200 py-1 w-32"
        >
          <button
            @click="editTask(task)"
            class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
          >
            Редактировать
          </button>
          <button
            @click="deleteTask(task, activeTab)"
            class="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50"
          >
            Удалить
          </button>
        </div>
        </div>
      </div>

        <div class="mt-3">
          <div class="flex justify-between text-xs text-gray-500 mb-2">
            <span>Прогресс</span>
            <span class="font-medium text-gray-700">{{ calcProgress(task) }}%</span>
          </div>
          <div class="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-300"
              :class="getProgressColor(calcProgress(task))"
              :style="{ width: calcProgress(task) + '%' }"
            ></div>
          </div>
        </div>

        <div class="flex justify-between items-center mt-4 pt-1">
            <!-- Группа: кнопка "+" + аватары (слева) -->
          <div class="flex items-center gap-1">
            <button
              @click.stop="openAddMemberToTask(task)"
              class="w-8 h-8 rounded-full border border-[#F2F2F2] text-gray-500 hover:bg-gray-200 flex items-center justify-center text-lg"
            >
              <p class="text-[20px] pb-1">+</p>
            </button>

          <!-- Участники задачи -->
            <div class="flex items-center -space-x-4">
              <!-- Аватары участников -->
              <div
                v-for="member in task.members || []"
                :key="member.id"
                class="w-8 h-8 rounded-full overflow-hidden border-2 border-white"
                :style="{ backgroundColor: member.color || '#e5e7eb' }"
                :title="member.name"
              >
                <img
                  v-if="member.avatar"
                  :src="member.avatar"
                  class="w-full h-full object-cover hover:scale-105"
                  :alt="member.name"
                />
                <div
                  v-else
                  class="w-full h-full flex items-center justify-center text-xs text-white"
                >
                  {{ member.name.charAt(0) }}
                </div>
              </div>
            </div>
          </div>

           <!-- Кнопка календаря с датой -->
          <button
            @click.stop="openDatePicker(task)"
            class="cursor-pointer flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
            :class="task.deadline ? 'text-gray-700' : 'text-gray-400'"
          >
            <img src="/src/assets/images/calendar.svg" alt="" class="w-4 h-4 mr-1">
            <span v-if="task.deadline" class="font-medium">
              {{ formatDateForDisplay(task.deadline) }}
            </span>
            <span v-else>Дедлайн</span>
          </button>
        </div>
      </div>

      <div v-if="getTasksByStatus(activeTab).length === 0" class="text-center py-12">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <p class="text-gray-400 text-sm">Нет задач в этой категории</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed  } from 'vue'
import { fetchTasks, deleteTaskDB } from '@/services/taskService'
import Task from './Task.vue'

const props = defineProps({
  projectId: { type: String, default: null },
  projectName: { type: String, default: null }
})

const emit = defineEmits(['open-create-task', 'open-edit-task', 'open-add-members', 'open-date-picker'])



// Название доски (берём из props или дефолтное)
const boardName = computed(() => {
  return props.projectName || 'Канбан-доска'
})

const columns = ref([
  { id: 1, title: 'Беклог', tasks: [] },
  { id: 2, title: 'В работе', tasks: [] },
  { id: 3, title: 'Готово', tasks: [] }
])

const activeTab = ref(1)
// Состояние для контекстного меню
const activeContextMenu = ref(null)

const tabs = ref([
  { id: 1, title: 'Беклог' },
  { id: 2, title: 'Прогресс' },
  { id: 3, title: 'Завершено' }
])

const getTasksByStatus = (statusId) => {
  const column = columns.value.find(c => c.id === statusId)
  return column ? column.tasks : []
}

const loadTasks = async () => {
  if (!props.projectId || props.projectId === 'undefined') {
    console.log('⚠️ loadTasks: нет projectId')
    return
  }

  console.log('📡 loadTasks: загружаем задачи для проекта', props.projectId)

  try {
    const { data: tasks, error } = await fetchTasks(Number(props.projectId))
    if (error) throw error

    console.log('📋 Загружено задач:', tasks?.length)

    // 👉 Выводим участников для проверки
    tasks?.forEach(task => {
      console.log(`   Задача "${task.title}": участники =`, task.members?.map(m => m.name) || [])
    })

    columns.value.forEach(col => (col.tasks = []))
    tasks?.forEach(task => {
      const column = columns.value.find(c => c.id === task.status)
      if (column) {
        column.tasks.push(task)
      }
    })

    console.log('✅ loadTasks завершён')
  } catch (err) {
    console.error('❌ Ошибка loadTasks:', err)
  }
}

const openCreateTask = (columnId) => emit('open-create-task', columnId)
// Редактирование задачи
const editTask = (task) => {
  emit('open-edit-task', task)
  closeContextMenu()
}
const openAddMemberToTask = (task) => emit('open-add-members', task)

// Удаление задачи
const deleteTask = async (task, columnId) => {
  if (!confirm(`Удалить задачу "${task.title}"?`)) return

  try {
    const { error } = await deleteTaskDB(task.id)
    if (error) throw error

    const column = columns.value.find(c => c.id === columnId)
    if (column) {
      column.tasks = column.tasks.filter(t => t.id !== task.id)
    }
    closeContextMenu()
  } catch (err) {
    console.error('Ошибка удаления:', err)
  }
}

const closeContextMenu = () => {
  activeContextMenu.value = null
}

// Контекстное меню
const toggleContextMenu = (task) => {
  if (activeContextMenu.value === task.id) {
    activeContextMenu.value = null
  } else {
    activeContextMenu.value = task.id
  }
}

const calcProgress = (task) => {
  if (!task.checklist?.length) return 0
  const done = task.checklist.filter(item => item.done).length
  return Math.round((done / task.checklist.length) * 100)
}

const getProgressColor = (progress) => {
  if (progress < 30) return 'bg-red-500'
  if (progress < 70) return 'bg-yellow-500'
  return 'bg-green-500'
}

// Открытие календаря для задачи
const openDatePicker = (task) => {
  console.log('📅 Открываем календарь для задачи:', task.title)
  emit('open-date-picker', task)  // 👈 просто передаём задачу родителю
}

const formatDateForDisplay = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const months = { 1: 'янв', 2: 'фев', 3: 'мар', 4: 'апр', 5: 'май', 6: 'июн', 7: 'июл', 8: 'авг', 9: 'сен', 10: 'окт', 11: 'ноя', 12: 'дек' }
  return `${date.getDate()} ${months[date.getMonth() + 1]}`
}

defineExpose({ loadTasks })

watch(() => props.projectId, async (id) => {
  if (id && id !== 'undefined') await loadTasks()
}, { immediate: true })
</script>
