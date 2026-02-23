<template>
  <Header/>

  <div class="lg:px-20 px-4 lg:mt-21 mt-21 relative">
    <img src="/src/assets/images/bg_user.svg" class="lg:rounded-[20px] rounded-[10px] lg:w-full lg:h-full
         w-full h-26 object-cover" alt="Banner">

    <!-- Аватар + информация -->
      <div class="absolute
         lg:left-[180px] left-1/2
         bottom-0 translate-y-[110px] lg:translate-y-[120px]
         -translate-x-1/2 lg:translate-x-0
         flex lg:flex-row flex-col
         lg:items-center items-center
         lg:gap-7 gap-2
         lg:p-0 p-4
         w-full lg:w-auto">
        <!-- Контейнер для аватара и индикатора -->
        <div class="relative lg:w-55 lg:h-55 w-22 h-22 flex items-center justify-between">
  <!-- Контейнер аватара -->
  <div class="w-full h-full rounded-full overflow-hidden bg-blue-500 border-3 border-white lg:mt-4">
    <img
      v-if="authStore.profile?.avatar_url"
      :src="authStore.profile.avatar_url"
      class="w-full h-full object-cover"
      alt="Avatar"
    />
    <div
      v-else
      class="w-full h-full flex items-center justify-center text-white lg:text-2xl text-sm font-bold"
    >
      {{ authStore.userInitials }}
    </div>
  </div>

  <!-- Индикатор онлайн/офлайн -->
  <div
    class="absolute bottom-2 right-0 lg:bottom-3 lg:right-5 lg:w-6 lg:h-6 w-4 h-4 rounded-full border-2 border-white"
    :class="isOnline ? 'bg-green-500' : 'bg-gray-400'"
    :title="isOnline ? 'В сети' : 'Не в сети'"
  ></div>
</div>

    <div>
    <!-- Информация о пользователе -->
    <div class="flex flex-col justify-center lg:items-start items-center lg:mt-30">
      <div class="flex justify-center items-center lg:gap-3 gap-2">
        <h1 class="lg:text-4xl text-1xl lg:py-2 font-bold">
          {{ authStore.profile?.full_name || 'Пользователь' }}
        </h1>
        <img
          src="/src/assets/images/metka.svg"
          class="lg:w-[35px] lg:h-[35px] w-[18px] h-[18px] lg:translate-y-[6px] translate-y-[3px]"
          alt="metka"
        >
      </div>
      <p class="text-gray-500 lg:text-left text-center text-[15px] lg:text-[18px]">{{ authStore.user?.email }}</p>
    </div>
  </div>
  </div>
  </div>
</template>

<script setup>
import Header from '@/components/Home/Header.vue';
import { ref, watch, onMounted } from 'vue'  // 👈 добавь ref, onMounted, onUnmounted
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// Следим за изменениями профиля
watch(() => authStore.profile, (newProfile) => {
  console.log('Profile changed in user.vue:', newProfile)
}, { immediate: true })

const isOnline = ref(false)

// Функция обновления статуса
const updateOnlineStatus = () => {
  isOnline.value = authStore.profile?.status === 'online'
  console.log('Status updated:', isOnline.value, 'from profile:', authStore.profile?.status)
}

// Следим за изменениями профиля
watch(() => authStore.profile, (newProfile) => {
  console.log('Profile changed:', newProfile)
  updateOnlineStatus()
}, { deep: true, immediate: true })

// Следим за изменениями статуса
watch(() => authStore.profile?.status, (newStatus) => {
  console.log('Status changed to:', newStatus)
  isOnline.value = newStatus === 'online'
})

onMounted(() => {
  updateOnlineStatus()
})
</script>
