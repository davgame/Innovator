<template>
    <!-- Если мобильная версия – показываем MobileKanban -->
  <MobileKanban v-if="isMobile" :projectId="projectId" />

    <!-- Иначе показываем ПК версию -->
  <div v-else>
  <!--Создать задачу-->
  <Task
    :show="showTaskModal"
    @close="showTaskModal = false"
    @save="createTask"
  />
  <!--Редактировать задачу-->
  <Edit_task
    :show="showEditModal"
    :taskData="editingTask"
    @close="closeEditModal"
    @save="updateTask"
  />

  <!-- Модальное окно для добавления участников -->
  <add-user
    v-if="showMemberModal"
    :selected-users="currentTaskForMembers?.members || []"
    mode="task"
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
  </div>

  <div class="flex gap-6 px-3 pb-4 h-[calc(70vh-55px)] overflow-x-auto overflow-y-hidden">
    <!-- Колонка -->
    <div
      v-for="column in columns"
      :key="column.id"
      :data-column-id="column.id"
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

      <button class="text-[#C0C0C0] text-[25px] border border-[#D7D7D7] bg-[#D9D9D9]/11 w-74 h-12 rounded-[12px] mb-7 cursor-pointer"
          @click="openCreateTask(column.id)"
          >
        <p>+</p>
      </button>

      <!-- ВАЖНО: draggable должен быть единственным дочерним элементом с flex-1 -->
      <draggable
        v-model="column.tasks"
        group="tasks"
        :data-column-id="column.id"
        item-key="id"
        @end="onTaskMoved"
        class="flex-1 min-h-0 space-y-6 overflow-y-auto pr-2 transition-all"
        :class="column.tasks.length === 0 ? 'overflow-y-hidden' : 'overflow-y-auto'"
      >
        <template #item="{ element }">
          <div class="hover:border-[#4286F7] rounded-xl px-4 h-42 py-6 border-2 border-[#D7D7D7]/32 cursor-move transition relative">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2">

                 <!-- Просмотр -->
            <p
              v-if="editingTaskId !== element.id"
              class="text-xl font-medium cursor-text hover:bg-gray-100 rounded px-1"
              @click="startEditTitle(element)"
            >
              {{ element.title }}
            </p>

            <!-- Редактирование -->
            <input
              v-else
              v-model="tempTitle"
              class="w-full text-xl font-medium border-b border-blue-400 outline-none bg-transparent"
              @blur="saveTitle(element)"
              @keyup.enter="saveTitle(element)"
              @keyup.esc="cancelEdit"
              autofocus
            />
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

            <!-- Контекстное меню -->
            <ContextMenu
              v-if="activeContextMenu === element.id"
              @edit="editTask(element)"
              @delete="deleteTask(element, column.id)"
            />

            <div class="flex justify-between items-center mt-2 mb-2">
              <span class="text-xs text-gray-500">Прогресс</span>
              <span class="text-xs font-medium text-gray-700">{{ calcProgress(element) }}%</span>
            </div>

            <!-- Прогресс бар -->
            <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-2">
              <div
                class="h-full rounded-full transition-all duration-300"
                :class="getProgressColor(calcProgress(element))"
                :style="{ width: calcProgress(element) + '%' }"
              ></div>
            </div>

            <!-- Нижняя часть: участники и дата -->
            <div class="flex items-center justify-between mt-4">
              <!-- Участники задачи -->
              <div class="flex items-center gap-1 -space-x-4">
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

                <!-- Кнопка добавления участника -->
                <button
                  class="border border-[#F2F2F2] w-8 h-8 text-[#838886] text-[24px] rounded-full flex items-center justify-center ml-4"
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
import { ref, watch } from 'vue'
import { useProjectStore } from '@/stores/projectStore'
import draggable from 'vuedraggable'
import AddUser from '../Pasport/Add-User.vue'
import ContextMenu from './ContextMenu.vue'
import Task from './Task.vue'
import { useBreakpoint } from './useBreakpoint'
import MobileKanban from './MobileKanban.vue'
import Edit_task from './Edit_task.vue'
import { supabase } from '@/lib/supabase'  // 👈 ДОБАВЬТЕ ЭТУ СТРОЧКУ
import {
  fetchTasks,
  createTaskDB,      // ← добавляем
  updateTaskDB,
  deleteTaskDB,
  updateTaskStatus,
  updateTaskDeadline
}
from '@/services/taskService'

const props = defineProps({
  projectId: {
    type: String,
    default: null
  }
})

const projectStore = useProjectStore()
const { isMobile } = useBreakpoint(768)

// 1️⃣ Добавляем ref для всех задач в колонках
const columns = ref([
  { id: 1, title: 'Беклог', tasks: [] },
  { id: 2, title: 'В работе', tasks: [] },
  { id: 3, title: 'Готово', tasks: [] }
])

// 2️⃣ Определяем loadTasks
const loadTasks = async () => {
  if (!props.projectId) return

  try {
    const { data: tasks, error } = await fetchTasks(Number(props.projectId))
    if (error) {
      console.error('❌ Ошибка при загрузке задач:', error)
      return
    }

    // Очистим все колонки
    columns.value.forEach(col => (col.tasks = []))

    // Распределяем задачи по колонкам по полю status
    tasks.forEach(task => {
      const column = columns.value.find(c => c.id === task.status)
      if (column) column.tasks.push(task)
    })
  } catch (err) {
    console.error('❌ Ошибка loadTasks:', err)
  }
}

watch(
  () => props.projectId,
  async (id) => {
    if (!id || isNaN(id)) return

    console.log('📡 init project:', id)

    await projectStore.loadProject(Number(id))
    await loadTasks()
  },
  { immediate: true }
)

const deleteTask = async (task, columnId) => {
  if (!confirm(`Удалить задачу "${task.title}"?`)) return

  try {
    const { error } = await deleteTaskDB(task.id)
    if (error) {
      console.error('❌ Ошибка при удалении задачи:', error)
      return
    }

    // Обновляем локальный state
    const column = columns.value.find(c => c.id === columnId)
    if (!column) return
    column.tasks = column.tasks.filter(t => t.id !== task.id)

    closeContextMenu()
    console.log(`✅ Задача "${task.title}" удалена`)
  } catch (err) {
    console.error('❌ Ошибка deleteTask:', err)
  }
}

// Функция открытия модалки для редактирования
const editTask = (task) => {
  console.log('✏️ Редактируем задачу:', task)

  // НАХОДИМ ЗАДАЧУ В КОЛОНКАХ И ОПРЕДЕЛЯЕМ ЕЁ АКТУАЛЬНЫЙ СТАТУС
  let foundTask = null
  let columnId = null

  for (const column of columns.value) {
    const found = column.tasks.find(t => t.id === task.id)
    if (found) {
      foundTask = found
      columnId = column.id
      break
    }
  }

  if (foundTask) {
    console.log(`✅ Задача найдена в колонке ${columnId} (${getColumnTitle(columnId)})`)

    // СОЗДАЕМ КОПИЮ ЗАДАЧИ С ПРАВИЛЬНЫМ СТАТУСОМ
    const taskCopy = {
      id: foundTask.id,
      title: foundTask.title,
      status: columnId, // <-- ВАЖНО: используем ID колонки как статус!
      tag: foundTask.tag || '',
      progress: foundTask.progress || 0,
      checklist: foundTask.checklist ? JSON.parse(JSON.stringify(foundTask.checklist)) : [],
      members: foundTask.members ? JSON.parse(JSON.stringify(foundTask.members)) : [],
      deadline: foundTask.deadline
    }

    console.log('🎯 Задача для редактирования со статусом:', taskCopy.status, '(', getColumnTitle(taskCopy.status), ')')
    editingTask.value = taskCopy
  } else {
    // Если не нашли, используем переданную задачу
    editingTask.value = JSON.parse(JSON.stringify(task))
  }

  showEditModal.value = true
  closeContextMenu()
}

// Вспомогательная функция для получения названия колонки
const getColumnTitle = (columnId) => {
  const column = columns.value.find(c => c.id === columnId)
  return column ? column.title : 'Неизвестно'
}

const createTask = async (task) => {
  try {
    const columnId = targetColumnId.value || task.status

    const newTask = {
      project_id: Number(props.projectId),
      title: task.title,
      status: columnId,
      progress: task.progress || 0,
      tag: task.tag || '',
      checklist: task.checklist || [],
      members: task.members || [],
      deadline: task.deadline || null
    }

    const { data, error } = await createTaskDB(newTask)

    if (error) {
      console.error('❌ Ошибка создания задачи:', error)
      return
    }

    // Добавляем в локальный state
    const column = columns.value.find(col => col.id === columnId)
    if (column && data.length) {
      column.tasks.push(data[0]) // supabase возвращает массив вставленных записей
    }

    showTaskModal.value = false
    targetColumnId.value = null
  } catch (err) {
    console.error('❌ Ошибка createTask:', err)
  }
}

const updateTask = async (updatedTask) => {
  const { error } = await updateTaskDB(updatedTask)
  if (error) {
    console.error('❌ Ошибка обновления задачи:', error)
    return
  }

  // Обновляем локальный массив колонок
  const column = columns.value.find(col => col.id === updatedTask.status)
  if (!column) return

  const index = column.tasks.findIndex(t => t.id === updatedTask.id)
  if (index !== -1) {
    column.tasks[index] = { ...updatedTask }
  }

  closeEditModal()
}

// Состояние для календаря
const showDatePicker = ref(false)
const currentTaskForDate = ref(null)
const tempSelectedDate = ref('')
const targetColumnId = ref(null) // ЭТО БЫЛО ПРОПУЩЕНО!
// Состояние модального окна
const showMemberModal = ref(false)

// Состояние для контекстного меню
const activeContextMenu = ref(null)

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
const saveDate = async () => {
  if (currentTaskForDate.value && tempSelectedDate.value) {
    currentTaskForDate.value.deadline = tempSelectedDate.value

    try{
      await updateTaskDeadline(currentTaskForDate.value.id, tempSelectedDate.value)
      console.log('✅ Дата сохранена')
    }catch(err){
      console.error('❌ Ошибка сохранения даты:', err)
    }
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



// Данные о задаче, к которой добавляем участников
const currentTaskForMembers = ref(null)

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

const addMembersToTask = async (selectedUsers, task) => {
  try {
    // ✅ 1. Обновляем локально
    task.members = selectedUsers.map(user => ({
      id: user.id,
      name: user.name,
      avatar: user.avatar_url || user.avatar,
      color: getRandomColor()
    }))

    console.log('👥 Обновлённые участники задачи:', task.members)

    // ✅ 2. Сохраняем в БД
    const { error } = await updateTaskDB({
      id: task.id,
      members: task.members
    })

    if (error) {
      console.error('❌ Ошибка сохранения участников:', error)
    } else {
      console.log('✅ Участники сохранены в БД')
    }

  } catch (err) {
    console.error('❌ Ошибка addMembersToTask:', err)
  }
}


// Вспомогательная функция для генерации случайного цвета
const getRandomColor = () => {
  const colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
    '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'
  ]
  return colors[Math.floor(Math.random() * colors.length)]
  }

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

const onTaskMoved = async (evt) => {
  try {
    const task = evt.item.__draggable_context.element

    const fromColumnId = Number(
      evt.from.closest('[data-column-id]')?.dataset.columnId
    )

    const toColumnId = Number(
      evt.to.closest('[data-column-id]')?.dataset.columnId
    )

    if (!task || !toColumnId) return

    if (fromColumnId !== toColumnId) {
      // Обновляем статус локально
      task.status = toColumnId
      console.log(`Задача ${task.title} перемещена → статус ${toColumnId}`)

      // 👇 Сохраняем через сервис
      try {
        await updateTaskStatus(task.id, toColumnId)
      } catch (err) {
        console.error('❌ Ошибка сохранения статуса:', err)
        task.status = fromColumnId
      }
    }

  } catch (error) {
    console.error('Ошибка drag-drop:', error)
  }
}

// Inline-редактирование названия задачи
const editingTaskId = ref(null)
const tempTitle = ref('')

// Начать редактирование
const startEditTitle = (task) => {
  editingTaskId.value = task.id
  tempTitle.value = task.title
}

// Сохранить
const saveTitle = async (task) => {
  if (!tempTitle.value.trim()) return

  task.title = tempTitle.value.trim()

  await updateTaskDB({
    id: task.id,
    title: task.title
  })

  editingTaskId.value = null
}

// Отмена
const cancelEdit = () => {
  editingTaskId.value = null
  tempTitle.value = ''
}

// Состояние для редактирования задачи
const showTaskModal = ref(false)

// Состояние для модалки редактирования задачи - ЭТО НУЖНО ДОБАВИТЬ!
const showEditModal = ref(false)
const editingTask = ref(null)

// Функция открытия модалки для создания
const openCreateTask = (columnId) => {
  console.log('Открытие создания задачи для колонки:', columnId)
  targetColumnId.value = columnId
  showTaskModal.value = true
}

// Закрыть модалку
const closeEditModal = () => {
  showEditModal.value = false
  editingTask.value = null
}

const debugTasks = async () => {
  console.log('=== 🐛 ОТЛАДКА ЗАДАЧ ===')
  console.log('1. projectId из props:', props.projectId)
  console.log('2. URL:', window.location.pathname)

  // Получаем ID из URL
  const urlMatch = window.location.pathname.match(/\/sup\/project\/(\d+)/)
  const urlProjectId = urlMatch ? Number(urlMatch[1]) : null
  console.log('3. ProjectId из URL:', urlProjectId)

  const currentProjectId = urlProjectId || Number(props.projectId)
  console.log('4. Текущий проект ID:', currentProjectId)

  // 👇 ВСЕ ЗАДАЧИ В БД
  console.log('\n📋 ВСЕ ЗАДАЧИ В БД:')
  const { data: allTasks, error: allError } = await supabase
    .from('tasks')
    .select('id, title, project_id, status')

  if (allError) {
    console.error('❌ Ошибка при загрузке всех задач:', allError)
  } else {
    console.table(allTasks)
    console.log(`📊 Всего задач в БД: ${allTasks?.length || 0}`)

    // Группируем по project_id
    const grouped = {}
    allTasks?.forEach(task => {
      if (!grouped[task.project_id]) grouped[task.project_id] = []
      grouped[task.project_id].push(task)
    })
    console.log('📁 Задачи по проектам:', grouped)
  }

  // 👇 ЗАДАЧИ ДЛЯ ТЕКУЩЕГО ПРОЕКТА
  console.log(`\n📋 ЗАДАЧИ ДЛЯ ПРОЕКТА ${currentProjectId}:`)
  const { data: currentTasks, error: currentError } = await supabase
    .from('tasks')
    .select('*')
    .eq('project_id', currentProjectId)

  if (currentError) {
    console.error('❌ Ошибка:', currentError)
  } else {
    console.log(`📊 Найдено задач: ${currentTasks?.length || 0}`)
    if (currentTasks?.length > 0) {
      console.table(currentTasks)
    } else {
      console.log('⚠️ Нет задач для этого проекта')
    }
  }

  // 👇 ТЕКУЩЕЕ СОСТОЯНИЕ КОЛОНОК
  console.log('\n📊 ТЕКУЩЕЕ СОСТОЯНИЕ КОЛОНОК:')
  columns.value.forEach(col => {
    console.log(`   ${col.title} (id:${col.id}): ${col.tasks.length} задач`)
  })
}


// ========== РАБОТА С ПРОГРЕССОМ ==========

// Функция для вычисления прогресса задачи на основе чеклиста
const calcProgress = (task) => {
  if (!task.checklist?.length) return 0
  const done = task.checklist.filter(item => item.done).length
  const progress = Math.round((done / task.checklist.length) * 100)

  // Обновляем прогресс задачи
  if (task.progress !== progress) {
    task.progress = progress
    // Сохранится автоматически через watch
  }

  return progress
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
