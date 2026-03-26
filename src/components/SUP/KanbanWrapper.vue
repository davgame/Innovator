<template>
  <component :is="currentComponent" :projectId="projectId" />
</template>

<script setup>
import { shallowRef , onMounted, onUnmounted } from 'vue'
import Kanban from './Kanban.vue'
import MobileKanban from './MobileKanban.vue'

const props = defineProps({
  projectId: {
    type: String,
    default: null
  }
})

// Определяем правильный компонент
let initialComponent = KanbanDesktop
if (typeof window !== 'undefined' && window.innerWidth < 768) {
  initialComponent = MobileKanban
}

const currentComponent = shallowRef(Kanban)


const checkScreenSize = () => {
  const isMobile = window.innerWidth < 768
  console.log('📱 KanbanWrapper - ширина:', window.innerWidth, 'isMobile:', isMobile)
  currentComponent.value = isMobile ? MobileKanban : Kanban
}

onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
})
</script>
