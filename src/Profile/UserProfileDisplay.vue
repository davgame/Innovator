<template>
  <div class="lg:px-20 px-4 lg:mt-21 mt-21 relative">


    <div v-if="userProfile">
      <!-- Баннер -->
      <img
        src="/src/assets/images/bg_user.svg"
        class="lg:rounded-[20px] rounded-[10px] lg:w-full lg:h-full
         w-full h-26 object-cover"
        alt="Banner"
      >

      <!-- Аватар + информация (как в User.vue) -->
      <div class="relative -mt-14 lg:-mt-25 flex flex-col lg:flex-row items-center lg:items-end gap-4 lg:gap-7 px-4 lg:px-0"
           :class="{'lg:ml-[100px]': true}">

        <!-- Контейнер для аватара и индикатора -->
        <div class="relative lg:w-55 lg:h-55 w-24 h-24 flex-shrink-0">
          <!-- Аватар -->
          <div class="w-full h-full rounded-full overflow-hidden bg-[#CFD9FF] border-3 border-white">
            <img
              v-if="userProfile.avatar_url"
              :src="userProfile.avatar_url + '?v=' + new Date().getTime()"
              class="w-full h-full object-cover"
              alt="Avatar"
            />
            <div
              v-else
              class="w-full h-full flex items-center justify-center text-white text-xl lg:text-2xl font-bold"
            >
              {{ getUserInitials(userProfile.full_name) }}
            </div>
          </div>

          <!-- Индикатор онлайн/офлайн -->
          <div
            class="absolute bottom-2 right-2 lg:bottom-3 lg:right-8 w-4 h-4 lg:w-6 lg:h-6 rounded-full border-2 border-white"
            :class="userProfile.status === 'online' ? 'bg-green-500' : 'bg-gray-400'"
            :title="userProfile.status === 'online' ? 'В сети' : 'Не в сети'"
          ></div>
        </div>

        <!-- Информация о пользователе -->
            <div>
    <div class="flex flex-col lg:items-start items-center lg:mt-30 w-full">
      <div class="grid grid-cols-1 lg:grid-cols-[minmax(0,600px)_auto] items-center w-full gap-2 lg:gap-8">
        <div class="flex items-center justify-center lg:justify-start gap-1 lg:gap-2">
        <h1 class="text-[19px] lg:text-4xl font-bold text-center lg:text-left">
          {{ userProfile.full_name || 'Пользователь' }}
        </h1>
        <img
          src="/src/assets/images/metka.svg"
          class="lg:w-[35px] lg:h-[35px] w-[18px] h-[18px] flex-shrink-0 lg:translate-y-[6px] translate-y-[2px]"
          alt="metka"
        >
      </div>
          <Edit_button v-if="isOwnProfile" class="hidden lg:flex translate-y-[17px] justify-self-end"
        />
      </div>
          <!-- 👇 СТАТУС ПОЛЬЗОВАТЕЛЯ -->
    <div class="flex items-center justify-center gap-2 lg:mt-[10px]">
      <p
        class="lg:text-left text-center text-[15px] lg:text-[18px]"
        :class="isOnline ? 'text-green-600' : 'text-gray-500'"
      >
        {{ userStatusText }}
      </p>
    </div>
      </div>
            </div>
      </div>

      <!-- Сетка с компонентами -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:mt-25 mt-10">
        <User_organization
          :edit-mode="isOwnProfile"
          :initial-organization-id="userProfile.organization_id"
        />
        <ProfileCompetencies />
        <ProfileRole class="lg:mb-40 mb-25"
          :edit-mode="false"
          :organization-id="userProfile.organization_id"
          :initial-role-id="userProfile.role_id"
        />
        <ProfileResume class="lg:mb-40 mb-25" />
      </div>
    </div>

    <div v-else class="flex justify-center items-center h-64">
      <p class="text-gray-500">Пользователь не найден</p>
    </div>
  </div>
  <Footer/>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { supabase } from '@/lib/supabase'
import User_organization from './User_organization.vue'
import ProfileCompetencies from './ProfileCompetencies.vue'
import { useAuthStore } from '@/stores/auth'  // 👈 ДОБАВЬТЕ
import ProfileRole from './ProfileRole.vue'
import ProfileResume from './ProfileResume.vue'
import Footer from '@/components/Home/Footer.vue'
import Edit_button from './Edit_button.vue'


const props = defineProps({
  userId: {
    type: String,
    required: true
  }
})

const authStore = useAuthStore()  // 👈 ДОБАВИЛИ
const loading = ref(true)
const userProfile = ref(null)
let channel = null

// 👈 ДОБАВЬТЕ ЭТО
const isOwnProfile = computed(() => {
  return authStore.user?.id === props.userId
})

onMounted(async () => {
  loading.value = true
  try {
    // 1. Загружаем профиль
    const { data, error } = await supabase
      .from('profiles')
      .select('*, organizations(*)')
      .eq('id', props.userId)
      .single()

    if (error) throw error
    userProfile.value = data

    // 2. Настраиваем Realtime подписку
    channel = supabase
      .channel(`profile-${props.userId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${props.userId}`
        },
        (payload) => {
          console.log('🔄 Realtime обновление:', payload.new.status)
          userProfile.value = payload.new
        }
      )
      .subscribe()

  } catch (error) {
    console.error('Ошибка загрузки профиля:', error)
  } finally {
    loading.value = false
  }
})

const getUserInitials = (name) => {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

// Форматирование времени последнего визита
const formatLastSeen = (timestamp) => {
  if (!timestamp) return 'Никогда'

  const lastSeen = new Date(timestamp)
  const now = new Date()
  const diffMs = now - lastSeen
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Только что'
  if (diffMins < 60) return `${diffMins} ${getMinutesWord(diffMins)} назад`
  if (diffHours < 24) return `${diffHours} ${getHoursWord(diffHours)} назад`
  if (diffDays === 1) return 'Вчера'
  if (diffDays < 7) return `${diffDays} ${getDaysWord(diffDays)} назад`

  return lastSeen.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Склонение слов
const getMinutesWord = (minutes) => {
  if (minutes % 10 === 1 && minutes % 100 !== 11) return 'минуту'
  if ([2, 3, 4].includes(minutes % 10) && ![12, 13, 14].includes(minutes % 100)) return 'минуты'
  return 'минут'
}

const getHoursWord = (hours) => {
  if (hours % 10 === 1 && hours % 100 !== 11) return 'час'
  if ([2, 3, 4].includes(hours % 10) && ![12, 13, 14].includes(hours % 100)) return 'часа'
  return 'часов'
}

const getDaysWord = (days) => {
  if (days % 10 === 1 && days % 100 !== 11) return 'день'
  if ([2, 3, 4].includes(days % 10) && ![12, 13, 14].includes(days % 100)) return 'дня'
  return 'дней'
}

// Текст статуса
const userStatusText = computed(() => {
  if (userProfile.value?.status === 'online') return 'В сети'
  return `был(а) ${formatLastSeen(userProfile.value?.last_seen)}`
})

const isOnline = computed(() => {
  return userProfile.value?.status === 'online'
})
</script>
