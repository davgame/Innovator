<template>
<router-view/>
</template>

<style scoped>
</style>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  // ✅ Импортируй и используй store ТОЛЬКО внутри onMounted
  import('@/stores/auth').then(({ useAuthStore }) => {
    const authStore = useAuthStore()
    authStore.init()
  })
})
</script>
