<template>
    <div class="flex fixed top-0 left-0 w-full z-50 items-center justify-between px-6 py-6 sm:px-6 md:px-[100px] lg:px-[80px]">
    <div class="ml-auto flex items-center gap-2">
      <Header_sup/>
      </div>
  </div>

  <div class="flex h-screen">
    <!-- Левая панель -->
    <Panel @project-selected="handleProjectSelected"/>

    <!-- Правая часть -->
    <div class="flex-1 flex flex-col mt-31">
      <!-- Заголовок проекта через Name_pg -->
      <Name_pg
        v-if="currentProject"
        :project="currentProject"
        @update-name="updateProjectName"
      />
      <!-- 👇 ВАЖНО: здесь отображаются дочерние маршруты -->
      <router-view :projectId="String(currentProject?.id)"/>

      <!-- Контент -->
      <div class="flex-1 p-6 bg-white">
          <Kanban :projectId="currentProject?.id ? String(currentProject.id) : null"  />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProjectStore } from '@/stores/projectStore'
import Panel from './Panel.vue'
import Name_pg from './Name_pg.vue'
import Kanban from './Kanban.vue'
import Header_sup from './Header_sup.vue'

// 👇 ДОБАВЛЯЕМ ОБЪЯВЛЕНИЕ PROPS
const props = defineProps({
  projectId: {
    type: String,
    default: null
  }
})

const route = useRoute()
const router = useRouter()  // 👈 ТЕПЕРЬ router ОПРЕДЕЛЕН!
const projectStore = useProjectStore()
const currentProject = ref(null)

// При монтировании проверяем, есть ли projectId в URL
onMounted(async () => {
  const projectId = route.params.projectId
  console.log('📌 SupPage монтируется, projectId из URL:', projectId)
  console.log('🔍 SupPage route.params:', route.params)  // 👈 смотрим весь объект
  console.log('🔍 SupPage projectId:', projectId)        // 👈 смотрим конкретно projectId

  if (projectId) {
    // Проверяем, что ID - число (как в БД)
    if (projectId > 1000000) {
      console.warn('⚠️ Похоже на timestamp, ищем проект в localStorage')
      const savedName = localStorage.getItem('currentProjectName')
      if (savedName) {
        currentProject.value = { id: projectId, name: savedName }
      }
    } else {
      await loadProject(projectId)
    }
  }
})

// Загрузка проекта по ID
const loadProject = async (projectId) => {
  try {
    // 👇 ПРЕОБРАЗУЕМ ЧИСЛО В СТРОКУ ДЛЯ KANBAN
    const project = await projectStore.loadProject(projectId)
    if (project) {
      currentProject.value = project
    }
  } catch (err) {
    console.error('❌ Ошибка загрузки проекта:', err)
  }
}

// Обработчик выбора проекта из панели
const handleProjectSelected = (project) => {
  console.log('📌 Проект выбран в SupPage:', project)
  currentProject.value = project  // 👈 ЭТО ДОЛЖНО СРАБОТАТЬ СРАЗУ
  router.push(`/sup/project/${project.id}`)
}

const updateProjectName = (newName) => {
  if (currentProject.value) {
    currentProject.value.name = newName
    // Сохраняем в store
    projectStore.updateProjectName(currentProject.value.id, newName)
  }
}
</script>
