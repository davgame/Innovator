<template>
  <!-- Боковая панель -->
  <div class="h-screen w-80 bg-white border-r border-gray-200 flex flex-col">

    <!-- Шапка с названием компании и локацией -->
    <div class="p-6">
       <!--Логотип-->
        <Header_sup/>

    </div>

    <!-- Поиск -->
    <div class="p-4 border-b border-gray-200">
      <div class="relative mb-3">
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
    <div class="flex-1 overflow-y-auto p-4 mt-2">
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
      <div class="text-xs text-gray-400 font-mono text-left px-4">
        V.02
      </div>
    </div>

    <!-- Модальное окно для переименования -->
    <div v-if="isRenaming" class="fixed inset-0 bg-[#D3D3D3]/80 bg-opacity-50 flex items-center justify-center z-50">
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
        <div class="flex justify-end space-x-4 mt-4">
          <button
            @click="cancelRename"
            class="cursor-pointer px-4 py-2 border border-[#9A9A9A]/20 hover:bg-gray-100 rounded-[10px] text-gray-600 hover:text-gray-800"
          >
            Отмена
          </button>
          <button
            @click="confirmRename"
            class="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded-[10px] hover:bg-blue-600"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted } from 'vue'
import { useRouter } from 'vue-router' // ← Добавить этот импорт!
import Header_sup from './Header_sup.vue'
import { supabase } from '@/lib/supabase'  // 👈 ДОБАВЬТЕ ИМПОРТ
import { useAuthStore } from '@/stores/auth'  // 👈 ДЛЯ ПОЛУЧЕНИЯ ПОЛЬЗОВАТЕЛЯ
import { watch } from 'vue'  // если нет импорта

// Эмит событий
const emit = defineEmits(['project-selected', 'project-renamed', 'project-deleted', 'project-created'])
const router = useRouter() // ← Добавить эту строку!
const authStore = useAuthStore()
const projects = ref([])  // 👈 БУДЕМ ХРАНИТЬ ПРОЕКТЫ ИЗ БД
const loading = ref(false)


// Состояния
const searchQuery = ref('')
const hoveredProjectId = ref(null)
const selectedProjectId = ref(null) // Или оставить как ref(1)
const menuOpenId = ref(null)
const isRenaming = ref(false)
const renamingProjectId = ref(null)
const newProjectName = ref('')
const renameInput = ref(null)

// Panel.vue - следим за проектами
watch(projects, (newProjects) => {
  console.log('📦 Проекты загружены:', newProjects)

  // Когда проекты появились и ничего не выбрано
  if (newProjects.length > 0 && !selectedProjectId.value) {
    console.log('🎯 Выбираем первый проект:', newProjects[0].name)
    selectProject(newProjects[0])
  }
})

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

const checkDirectQuery = async () => {
  if (!authStore.user) return

  console.log('🔍 Прямой запрос к project_members для:', authStore.user.id)

  const { data: members, error: membersError } = await supabase
    .from('project_members')
    .select('*')
    .eq('user_id', authStore.user.id)

  console.log('📊 Данные project_members:', members)
  console.log('❌ Ошибка:', membersError)

  if (members && members.length > 0) {
    const projectIds = members.map(m => m.project_id)
    console.log('📋 project_ids:', projectIds)

    // 👇 ПРОВЕРЯЕМ СУЩЕСТВОВАНИЕ ПРОЕКТОВ
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('id, name')
      .in('id', projectIds)

    console.log('📁 Найдено проектов:', projects?.length || 0)
    console.log('📁 Проекты:', projects)
    console.log('❌ Ошибка projects:', projectsError)

    if (projects?.length === 0) {
      console.log('⚠️ Проекты не найдены! Возможные причины:')
      console.log('1. Нет RLS политики для чтения projects')
      console.log('2. Проекты с такими ID не существуют')
      console.log('3. Неправильные ID в project_members')
    }
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

const loadProjects = async () => {
  loading.value = true
  try {
    if (!authStore.user) return

    const userId = authStore.user.id
    console.log('👤 ID пользователя:', userId)

    // 1. Получаем все проекты, где пользователь участник
    const { data: memberProjects, error: memberError } = await supabase
      .from('project_members')
      .select('project_id')
      .eq('user_id', userId)

    if (memberError) throw memberError

    const memberProjectIds = memberProjects?.map(m => m.project_id) || []
    console.log('📋 project_ids из project_members:', memberProjectIds)

    // 2. Получаем проекты, где пользователь владелец
    const { data: ownedProjects, error: ownedError } = await supabase
      .from('projects')
      .select('*')
      .eq('created_by', userId)

    if (ownedError) throw ownedError

    // 3. Получаем проекты, где пользователь участник
    let memberProjectsData = []
    if (memberProjectIds.length > 0) {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .in('id', memberProjectIds)

      if (error) throw error
      memberProjectsData = data || []
      console.log('📁 Проекты участника:', memberProjectsData)
    }

    // 4. Объединяем и убираем дубликаты
    const allProjects = [...(ownedProjects || []), ...memberProjectsData]
    const uniqueProjects = allProjects.filter((p, i, arr) =>
      i === arr.findIndex(p2 => p2.id === p.id)
    )

    console.log('✅ Всего проектов:', uniqueProjects.length)

    // 5. Преобразуем для отображения
    projects.value = uniqueProjects.map(p => ({
      id: p.id,
      name: p.name,
      fullName: p.name,
      category: p.description || 'Проект',
      color: getColorForProject(p.id),
      icon: p.name.charAt(0).toUpperCase(),
      version: null,
      isOwner: p.created_by === userId
    }))

    // 6. Если есть проекты и ничего не выбрано, выбираем первый
    if (projects.value.length > 0 && !selectedProjectId.value) {
      selectProject(projects.value[0])
    }

  } catch (error) {
    console.error('❌ Ошибка:', error)
    projects.value = []
  } finally {
    loading.value = false
  }
}

const deleteProject = async (projectId) => {
  // Находим проект
  const project = projects.value.find(p => p.id === projectId)

  // Проверяем, может ли пользователь удалить проект
  if (!project?.isOwner) {
    alert('Только владелец проекта может его удалить')
    return
  }

  if (!confirm('Вы уверены, что хотите удалить этот проект? Это действие нельзя отменить.')) return

  try {
    // Сначала удаляем участников проекта
    await supabase
      .from('project_members')
      .delete()
      .eq('project_id', projectId)

    // Удаляем задачи проекта
    await supabase
      .from('tasks')
      .delete()
      .eq('project_id', projectId)

    // Удаляем сам проект
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId)
      .eq('created_by', authStore.user.id)  // 👈 Только владелец может удалить

    if (error) throw error

    // Обновляем локальный список
    projects.value = projects.value.filter(p => p.id !== projectId)

    if (selectedProjectId.value === projectId) {
      selectedProjectId.value = projects.value.length > 0 ? projects.value[0]?.id : null
      if (selectedProjectId.value) {
        const firstProject = projects.value.find(p => p.id === selectedProjectId.value)
        selectProject(firstProject)
      }
    }

    closeMenu()
    console.log('✅ Проект удален из БД')
  } catch (error) {
    console.error('❌ Ошибка удаления проекта:', error)
    alert('Не удалось удалить проект')
  }
}

// Добавьте после объявления переменных
watch(() => authStore.user, (newUser) => {
  console.log('👤 Пользователь изменился:', newUser)
  if (newUser) {
    loadProjects() // загружаем проекты когда пользователь готов
  }
}, { immediate: true })

// Функция для цвета (можно оставить как есть)
const getColorForProject = (id) => {
  const colors = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899', '#6366F1', '#14B8A6']
  return colors[(id % colors.length)]
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



// Подтверждение переименования
const confirmRename = async () => {
  if (!newProjectName.value.trim()) return

  try {
    const { error } = await supabase
      .from('projects')
      .update({ name: newProjectName.value.trim() })
      .eq('id', renamingProjectId.value)

    if (error) throw error

    // Обновляем локальный список
    const projectIndex = projects.value.findIndex(p => p.id === renamingProjectId.value)
    if (projectIndex !== -1) {
      projects.value[projectIndex].name = newProjectName.value.trim()
      projects.value[projectIndex].fullName = newProjectName.value.trim()

      // Если это текущий проект, обновляем и его
      if (selectedProjectId.value === renamingProjectId.value) {
        selectProject(projects.value[projectIndex])
      }

      emit('project-renamed', projects.value[projectIndex])
    }

    console.log('✅ Проект переименован в БД')
  } catch (error) {
    console.error('❌ Ошибка переименования:', error)
    alert('Не удалось переименовать проект')
  } finally {
    cancelRename()
  }
}

const cancelRename = () => {
  isRenaming.value = false
  renamingProjectId.value = null
  newProjectName.value = ''
}

// // Удаление проекта
// const deleteProject = async (projectId) => {
//   if (!confirm('Вы уверены, что хотите удалить этот проект?')) return

//   try {
//     const { error } = await supabase
//       .from('projects')
//       .delete()
//       .eq('id', projectId)

//     if (error) throw error

//     // Удаляем из локального списка
//     projects.value = projects.value.filter(p => p.id !== projectId)

//     if (selectedProjectId.value === projectId) {
//       selectedProjectId.value = projects.value.length > 0 ? projects.value[0].id : null
//       if (selectedProjectId.value) {
//         const firstProject = projects.value.find(p => p.id === selectedProjectId.value)
//         selectProject(firstProject)
//       }
//     }

//     closeMenu()
//     console.log('✅ Проект удален из БД')
//   } catch (error) {
//     console.error('❌ Ошибка удаления проекта:', error)
//     alert('Не удалось удалить проект')
//   }
// }

// Создание нового проекта
const createNewBoard = async () => {
  if (!authStore.user?.id) {
    alert('Необходимо авторизоваться')
    return
  }

  try {
    const { data, error } = await supabase
      .from('projects')
      .insert([
        {
          name: `Новый проект ${projects.value.length + 1}`,
          created_by: authStore.user.id,
          created_at: new Date().toISOString(),
          description: 'Новый проект'
        }
      ])
      .select()
      .single()

    if (error) throw error

    if (data) {
      const newProject = {
        id: data.id,
        name: data.name,
        fullName: data.name,
        category: 'Новый проект',
        color: getColorForProject(data.id),
        icon: data.name.charAt(0).toUpperCase(),
        version: null,
        isOwner: true  // 👈 Создатель всегда владелец
      }

      projects.value.unshift(newProject)
      selectProject(newProject)
      searchQuery.value = ''

      emit('project-created', newProject)
      console.log('✅ Новый проект создан в БД')
    }
  } catch (error) {
    console.error('❌ Ошибка создания проекта:', error)
    alert('Не удалось создать проект')
  }
}


// Обработчики клавиш
const handleKeydown = (e) => {
  if (e.key === 'Escape' && isRenaming.value) {
    cancelRename()
  }
}

// Загружаем при монтировании
onMounted(() => {
  loadProjects()

// 👇 Автоматически выбираем первый проект, если ничего не выбрано
  if (projects.value.length > 0 && !selectedProjectId.value) {
    console.log('🎯 Автоматически выбираем первый проект:', projects.value[0].name)
    selectProject(projects.value[0])
  }
})

// Выбор проекта
const selectProject = (project) => {
  console.log('👉 Выбран проект:', project)
  selectedProjectId.value = project.id
  emit('project-selected', project)
  router.push(`/sup/project/${project.id}`)
}

// Фильтрация проектов
const filteredProjects = computed(() => {
  if (!searchQuery.value) return projects.value
  return projects.value.filter(p =>
    p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})
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
