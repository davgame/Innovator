<template>
  <router-view/>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'

let activityTimer = null
let authStore = null

// Функция обновления активности
const updateActivity = () => {
  if (authStore?.user) {
    authStore.updateLastSeen()
  }
}

onMounted(async () => {
  // Импортируем store
  const { useAuthStore } = await import('@/stores/auth')
  authStore = useAuthStore()
  await authStore.init()

  // 👇 Добавляем отслеживание активности
  window.addEventListener('mousemove', updateActivity)
  window.addEventListener('keydown', updateActivity)
  window.addEventListener('click', updateActivity)
  window.addEventListener('scroll', updateActivity)

  // Обновляем каждые 5 минут
  activityTimer = setInterval(updateActivity, 5 * 60 * 1000)

  // 👇 Добавляем обработчик закрытия вкладки (ПРАВИЛЬНО)
  window.addEventListener('beforeunload', () => {
    if (authStore?.user?.id) {
      navigator.sendBeacon(
        `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/profiles?id=eq.${authStore.user.id}`,
        JSON.stringify({
          status: 'offline',
          last_seen: new Date().toISOString()
        })
      )
    }
  })
})

onUnmounted(() => {
  window.removeEventListener('mousemove', updateActivity)
  window.removeEventListener('keydown', updateActivity)
  window.removeEventListener('click', updateActivity)
  window.removeEventListener('scroll', updateActivity)
  if (activityTimer) clearInterval(activityTimer)
})
</script>
