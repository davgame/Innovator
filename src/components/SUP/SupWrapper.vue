<template>
  <component :is="currentComponent" :projectId="$route.params.projectId" />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import SupPage from './SupPage.vue'
import MobileLayout from './MobileLayout.vue'

const currentComponent = ref(SupPage)

const checkScreenSize = () => {
  const isMobile = window.innerWidth < 768
  console.log('📱 SupWrapper - ширина:', window.innerWidth, 'isMobile:', isMobile)
  currentComponent.value = isMobile ? MobileLayout : SupPage
}

onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
})
</script>
