<template>
  <!-- Боковая панель -->
  <div class="h-screen w-80 bg-white border-r border-gray-200 flex flex-col">

    <!-- Шапка с названием компании и локацией -->
    <div class="p-6 border-b border-gray-200">
        <!--Логотип-->
      <div href="#" class="flex items-start space-x-3 w-1/2">
        <img src="/src/assets/images/SUP_Logo.svg" alt="Innova" class="w-[42px] h-auto"/>
        <div class="text-left">
          <h1 class="text-[17px] font-rubik text-black font-bold">Инноваторы</h1>
          <p class="text-[13px] mt-[-4px] font-rubik text-black font-medium">Краснодар</p>
        </div>
      </div>
    </div>

    <!-- Поиск -->
    <div class="p-4 border-b border-gray-200">
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Поиск"
          class="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-[11px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
        />
      </div>
    </div>

    <!-- Секция проектов -->
    <div class="flex-1 overflow-y-auto p-4">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-gray-800">Проекты</h2>
        <button
          @click="createNewBoard"
          class="flex items-center justify-center w-8 h-8 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          title="Создать новую доску"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      <!-- Список проектов -->
      <div class="space-y-2">
        <div
          v-for="project in filteredProjects"
          :key="project.id"
          @click="selectProject(project)"
          @mouseenter="handleMouseEnter(project.id)"
          @mouseleave="handleMouseLeave"
          class="group relative flex items-start p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
          :class="{
            'bg-blue-50 border border-blue-200': selectedProjectId === project.id,
            'border border-transparent': true
          }"
          :title="project.fullName"
        >
          <!-- Иконка проекта -->
          <div class="mr-3 flex-shrink-0 mt-0.5">
            <div
              class="w-8 h-8 rounded-lg flex items-center justify-center text-white font-medium text-sm"
              :style="{ backgroundColor: project.color }"
            >
              {{ project.icon }}
            </div>
          </div>

          <!-- Информация о проекте -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center mb-1">
              <span class="text-gray-800 font-medium truncate">
                {{ getShortName(project.name) }}
              </span>
              <span v-if="project.version" class="ml-2 flex-shrink-0 text-xs text-gray-500 font-mono bg-gray-100 px-1.5 py-0.5 rounded">
                {{ project.version }}
              </span>
            </div>
            <div class="text-sm text-gray-600 truncate">
              {{ getShortCategory(project.category) }}
            </div>
          </div>

          <!-- Кнопка меню (три точки) - появляется при наведении -->
          <button
            v-if="shouldShowMenuButton(project.id)"
            @click.stop="toggleMenu(project.id)"
            class="ml-2 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded transition-colors"
            title="Действия с проектом"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>

          <!-- Выпадающее меню действий -->
          <div
            v-if="menuOpenId === project.id"
            class="absolute right-0 top-10 z-10 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1"
            v-click-outside="closeMenu"
          >
            <button
              @click.stop="renameProject(project)"
              class="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center"
            >
              <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Переименовать
            </button>
            <button
              @click.stop="deleteProject(project.id)"
              class="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-50 flex items-center"
            >
              <svg class="w-4 h-4 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Удалить
            </button>
          </div>
        </div>
      </div>

      <!-- Если проектов нет -->
      <div v-if="filteredProjects.length === 0" class="text-center py-8">
        <div class="text-gray-400 mb-2">Проекты не найдены</div>
        <button
          @click="createNewBoard"
          class="text-blue-500 hover:text-blue-600 text-sm font-medium"
        >
          + Создать первый проект
        </button>
      </div>
    </div>

    <!-- Версия внизу -->
    <div class="p-4 border-t border-gray-200">
      <div class="text-xs text-gray-400 font-mono text-center">
        V.01
      </div>
    </div>

    <!-- Модальное окно для переименования -->
    <div v-if="isRenaming" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 w-96">
        <h3 class="text-lg font-semibold mb-4">Переименовать проект</h3>
        <input
          type="text"
          v-model="newProjectName"
          @keyup.enter="confirmRename"
          placeholder="Введите новое название"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          ref="renameInput"
        />
        <div class="flex justify-end space-x-3">
          <button
            @click="cancelRename"
            class="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Отмена
          </button>
          <button
            @click="confirmRename"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'

// Данные проектов
const projects = ref([
  {
    id: 1,
    name: 'Android Banking app',
    fullName: 'Android Banking app',
    category: 'Мобильное приложение',
    color: '#3B82F6',
    icon: 'A',
    version: null
  },
  {
    id: 2,
    name: 'Шнекаход',
    fullName: 'Шнекаход',
    category: 'Транспортное средство',
    color: '#10B981',
    icon: 'Ш',
    version: null
  },
  {
    id: 3,
    name: 'Axon',
    fullName: 'Axon',
    category: 'Нейротехнологии',
    color: '#8B5CF6',
    icon: 'A',
    version: null
  },
  {
    id: 4,
    name: 'Транспортная система',
    fullName: 'Транспортная система',
    category: 'Инфраструктура',
    color: '#F59E0B',
    icon: 'Т',
    version: null
  },
  {
    id: 5,
    name: 'Умный стол',
    fullName: 'Умный стол',
    category: 'Интерактивное оборудование',
    color: '#EF4444',
    icon: 'У',
    version: 'V.01'
  },
  {
    id: 6,
    name: 'Web-платформа для брендинга',
    fullName: 'Web-платформа для брендинга',
    category: 'Веб-разработка',
    color: '#EC4899',
    icon: 'W',
    version: null
  },
  {
    id: 7,
    name: 'Космический спутник',
    fullName: 'Космический спутник',
    category: 'Спутниковая система связи',
    color: '#6366F1',
    icon: 'К',
    version: null
  },
  {
    id: 8,
    name: 'Робот-собака',
    fullName: 'Робот-собака',
    category: 'Робототехника',
    color: '#14B8A6',
    icon: 'Р',
    version: null
  },
])

// Состояния
const searchQuery = ref('')
const selectedProjectId = ref(1)
const hoveredProjectId = ref(null)
const menuOpenId = ref(null)
const isRenaming = ref(false)
const renamingProjectId = ref(null)
const newProjectName = ref('')
const renameInput = ref(null)

// Директива для закрытия меню при клике вне его
const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value()
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent)
  }
}

// Функции для сокращения текста
const getShortName = (name) => {
  const maxLength = 20;
  if (name.length > maxLength) {
    return name.substring(0, maxLength - 3) + '...';
  }
  return name;
}

const getShortCategory = (category) => {
  const maxLength = 25;
  if (category.length > maxLength) {
    return category.substring(0, maxLength - 3) + '...';
  }
  return category;
}

// Проверка, должна ли показываться кнопка меню
const shouldShowMenuButton = (projectId) => {
  return hoveredProjectId.value === projectId || menuOpenId.value === projectId
}

// Управление наведением
const handleMouseEnter = (projectId) => {
  hoveredProjectId.value = projectId
}

const handleMouseLeave = () => {
  // Не скрываем кнопку, если меню открыто
  if (!menuOpenId.value) {
    hoveredProjectId.value = null
  }
}

// Управление меню
const toggleMenu = (projectId) => {
  menuOpenId.value = menuOpenId.value === projectId ? null : projectId
  if (menuOpenId.value) {
    hoveredProjectId.value = projectId
  }
}

const closeMenu = () => {
  menuOpenId.value = null
  hoveredProjectId.value = null
}

// Переименование проекта
const renameProject = (project) => {
  renamingProjectId.value = project.id
  newProjectName.value = project.name
  isRenaming.value = true
  closeMenu()

  nextTick(() => {
    renameInput.value?.focus()
    renameInput.value?.select()
  })
}

const confirmRename = () => {
  if (newProjectName.value.trim()) {
    const projectIndex = projects.value.findIndex(p => p.id === renamingProjectId.value)
    if (projectIndex !== -1) {
      projects.value[projectIndex].name = newProjectName.value.trim()
      projects.value[projectIndex].fullName = newProjectName.value.trim()
      emit('project-renamed', projects.value[projectIndex])
    }
  }
  cancelRename()
}

const cancelRename = () => {
  isRenaming.value = false
  renamingProjectId.value = null
  newProjectName.value = ''
}

// Удаление проекта
const deleteProject = (projectId) => {
  if (confirm('Вы уверены, что хотите удалить этот проект?')) {
    const projectIndex = projects.value.findIndex(p => p.id === projectId)
    const projectToDelete = projects.value[projectIndex]

    projects.value.splice(projectIndex, 1)

    // Если удаляем выбранный проект, выбираем первый доступный
    if (selectedProjectId.value === projectId) {
      selectedProjectId.value = projects.value.length > 0 ? projects.value[0].id : null
    }

    closeMenu()
    emit('project-deleted', projectToDelete)
  }
}

// Создание нового проекта
const createNewBoard = () => {
  const newProject = {
    id: Date.now(),
    name: `Новый проект ${projects.value.length + 1}`,
    fullName: `Новый проект ${projects.value.length + 1}`,
    category: 'Категория проекта',
    color: '#9CA3AF',
    icon: 'Н',
    version: null
  }

  projects.value.unshift(newProject)
  selectProject(newProject)
  searchQuery.value = ''

  emit('project-created', newProject)
}

// Выбор проекта
const selectProject = (project) => {
  selectedProjectId.value = project.id
  emit('project-selected', project)
}

// Фильтрация проектов
const filteredProjects = computed(() => {
  if (!searchQuery.value.trim()) {
    return projects.value
  }

  const query = searchQuery.value.toLowerCase()
  return projects.value.filter(project =>
    project.name.toLowerCase().includes(query) ||
    project.category.toLowerCase().includes(query)
  )
})

// Обработчики клавиш
const handleKeydown = (e) => {
  if (e.key === 'Escape' && isRenaming.value) {
    cancelRename()
  }
}

// Навешиваем обработчики
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

// Эмит событий
const emit = defineEmits(['project-selected', 'project-renamed', 'project-deleted', 'project-created'])
</script>

<style scoped>
/* Стиль скроллбара */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

/* Для усечения текста */
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Анимация для выпадающего меню */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.15s, transform 0.15s;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
