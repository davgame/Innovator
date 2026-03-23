<template>
  <div class="flex flex-col h-full bg-gray-50">
    <!-- Название канбан-доски (как на рисунке 2) -->
    <div class="bg-white px-6 pt-4">
      <h2 class="text-[42px] font-bold text-gray-900">
        {{ boardName || 'Канбан-доска' }}
      </h2>
    </div>

    <!-- Вкладки -->
    <div class="flex bg-white border-b border-gray-200 sticky top-0 z-10 px-2">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        class="flex-1 py-4 text-center font-medium transition-colors relative text-sm"
        :class="activeTab === tab.id ? 'text-blue-600' : 'text-gray-500'"
      >
        {{ tab.title }}
        <span class="ml-1 text-sm">{{ getTasksByStatus(tab.id).length }}</span>
        <div
          v-if="activeTab === tab.id"
          class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
        ></div>
      </button>
    </div>

    <!-- Список задач -->
    <div class="flex-1 overflow-y-auto p-4 space-y-3 pb-24">
      <div
        v-for="task in getTasksByStatus(activeTab)"
        :key="task.id"
        class="bg-white rounded-2xl p-4 shadow-sm"
      >
        <div>
          <h4 class="font-semibold text-gray-800 text-base">{{ task.title }}</h4>
          <p v-if="task.tag" class="text-xs text-gray-400 mt-0.5">{{ task.tag }}</p>
        </div>

        <div class="mt-3">
          <div class="flex justify-between text-xs text-gray-500 mb-1">
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

        <div class="flex justify-between items-center mt-3 pt-1">
          <span class="text-xs text-gray-500">
            {{ task.deadline ? formatDateForDisplay(task.deadline) : 'Нет даты' }}
          </span>
          <button
            @click.stop="openAddMemberToTask(task)"
            class="w-6 h-6 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center text-lg"
          >
            +
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
        <button
          @click="openCreateTask(activeTab)"
          class="mt-3 text-blue-500 text-sm font-medium"
        >
          + Создать задачу
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed  } from 'vue'
import { fetchTasks, deleteTaskDB } from '@/services/taskService'

const props = defineProps({
  projectId: { type: String, default: null },
  projectName: { type: String, default: null }  // 👈 добавляем projectName
})

const emit = defineEmits(['open-create-task', 'open-edit-task', 'open-add-members'])

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
  if (!props.projectId || props.projectId === 'undefined') return

  try {
    const { data: tasks, error } = await fetchTasks(Number(props.projectId))
    if (error) throw error

    columns.value.forEach(col => (col.tasks = []))
    tasks?.forEach(task => {
      const column = columns.value.find(c => c.id === task.status)
      if (column) column.tasks.push(task)
    })
  } catch (err) {
    console.error('Ошибка loadTasks:', err)
  }
}

const openCreateTask = (columnId) => emit('open-create-task', columnId)
const editTask = (task) => emit('open-edit-task', task)
const openAddMemberToTask = (task) => emit('open-add-members', task)

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
