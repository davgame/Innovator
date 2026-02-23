<!-- src/components/UserProfileDisplay.vue -->
<template>
  <div class="px-20 mt-21">
    <div v-if="loading">Загрузка...</div>
    <div v-else-if="userProfile">
      <!-- Аватар + информация -->
      <div class="flex items-center gap-11">
        <div class="relative w-51 h-51">
          <div class="w-55 h-55 rounded-full overflow-hidden bg-blue-500 border-3 border-white">
            <img
              v-if="userProfile.avatar_url"
              :src="userProfile.avatar_url"
              class="w-full h-full object-cover"
              alt="Avatar"
            />
            <div
              v-else
              class="w-full h-full flex items-center justify-center text-white text-2xl font-bold"
            >
              {{ getUserInitials(userProfile.full_name) }}
            </div>
          </div>

          <!-- Индикатор онлайн/офлайн -->
          <div
            class="absolute bottom-1 right-1 w-6 h-6 rounded-full border-2 border-white"
            :class="userProfile.status === 'online' ? 'bg-green-500' : 'bg-gray-400'"
            :title="userProfile.status === 'online' ? 'В сети' : 'Не в сети'"
          ></div>
        </div>

        <div>
          <h1 class="text-4xl py-2 font-bold">{{ userProfile.full_name || 'Пользователь' }}</h1>
          <p class="text-gray-500">{{ userProfile.email }}</p>
        </div>
      </div>
    </div>
    <div v-else>Пользователь не найден</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'

const props = defineProps({
  userId: {
    type: String,
    required: true
  }
})

const loading = ref(true)
const userProfile = ref(null)

const getUserInitials = (name) => {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

onMounted(async () => {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', props.userId)
      .single()

    if (error) throw error
    userProfile.value = data
  } catch (error) {
    console.error('Ошибка загрузки профиля:', error)
  } finally {
    loading.value = false
  }
})
</script>
