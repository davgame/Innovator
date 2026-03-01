<template>
  <Header/>
  <div class="w-full flex flex-col items-center lg:mt-16 mt-18">
    <!-- Заголовок -->
    <h1 class="lg:text-5xl text-[33px] font-bold lg:mb-12 mb-8">Команда проекта <span class="text-[#222222]"></span></h1>
    <!-- Контейнер команды -->
    <div
      class="mx-12 lg:w-[430px] lg:h-[270px] w-[300px] h-[220px] mt-22 lg:mt-27
             bg-[#F6F8FA] border border-[#CBCBCB] rounded-[20px] fixed overflow-y-auto"
    >
      <!-- ПУСТОЕ СОСТОЯНИЕ -->
      <div
        v-if="!selectedUsers || selectedUsers.length === 0"
        class="w-full h-full flex flex-col items-center justify-center"
      >
        <img src="/src/assets/images/users_o.png" class="w-[72px]" />
        <p class="text-[15px] mt-[7px] text-[#6C727C]/61 font-medium">
          Создать команду
        </p>
      </div>

      <!-- СПИСОК ПОЛЬЗОВАТЕЛЕЙ -->
            <div v-else class="flex flex-col gap-2 p-3">
        <div
          v-for="user in selectedUsers"
          :key="user.id"
          class="flex items-center gap-3 bg-white rounded-xl px-3 py-2"
        >
          <img :src="user.avatar" class="w-8 h-8 rounded-full" />
          <div class="flex-1">
            <p class="text-sm font-medium">{{ user.name }}</p>
            <p class="text-xs text-gray-400">{{ user.role }}</p>
          </div>
          <button @click="removeUser(user.id)">✕</button>
        </div>
      </div>
    </div>
    <button @click="showModal = true" class="btn-more border-1 border-[#222222] hover:border-[#4286F7] text-[#222222] hover:text-[#4286F7] font-medium lg:mb-58 mb-48 py-1 lg:px-51 px-35 text-[20px] rounded-[18px] fixed bottom-10 left-1/2 transform -translate-x-1/2 z-40 transition-colors duration-300 cursor-pointer">
      +
    </button>
    <!-- Модальное окно (компонент Add-User.vue) -->
    <AddUser
      v-if="showModal"
      :project-id="projectId"
      @close="showModal = false"
      @confirm="setUsers"
    />
  </div>
  <div class="px-3 lg:mt-0 mt-105">
    <div class="flex flex-col items-center gap-4 lg:fixed lg:bottom-10 lg:left-1/2 lg:transform lg:-translate-x-1/2 lg:z-40 lg:w-auto mt-auto lg:mt-0">
      <!-- Кнопка "Далее" -->
      <router-link :to="`/sup?projectId=${projectId}`"  class="w-75 lg:w-auto">
        <button class="btn-more bg-[#222222] hover:bg-[#4286F7] text-white font-medium py-4 lg:px-28 text-[20px] rounded-[18px] transition-colors duration-300 cursor-pointer w-full text-center">
          Далее
        </button>
      </router-link>

      <!-- Кнопка "Назад" -->
      <button @click="$router.back()" class="btn-more border-1 border-[#222222] hover:bg-gray-100 text-[#222222] font-medium py-4 lg:px-28 text-[20px] rounded-[18px] transition-colors duration-300 cursor-pointer w-75 lg:w-auto text-center">
        Назад
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth'
import Header from '../Home/Header.vue'
import AddUser from './Add-User.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const projectId = ref(null)
const showModal = ref(false)
const selectedUsers = ref([])

// Создаем новый проект
const createNewProject = async () => {
  console.log('Создаем новый проект...')

  const { data, error } = await supabase
    .from('projects')
    .insert({
      name: 'Новый проект',
      created_by: authStore.user?.id
    })
    .select()
    .single()

  if (error) {
    console.error('Ошибка создания проекта:', error)
    return null
  }

  if (data) {
    console.log('✅ Проект создан, ID:', data.id)
    return data.id
  }
}

// Загружаем участников проекта из БД
const loadProjectMembers = async () => {
  if (!projectId.value) return

  const { data, error } = await supabase
    .from('project_members')
    .select(`
      *,
      profiles!inner (
        full_name,
        avatar_url
      )
    `)
    .eq('project_id', projectId.value)

  if (error) {
    console.error('Ошибка загрузки участников:', error)
    return
  }

  if (data && data.length > 0) {
    selectedUsers.value = data.map(m => ({
      id: m.user_id,
      name: m.profiles?.full_name || 'Пользователь',
      avatar: m.profiles?.avatar_url || null,
      role: m.role || 'Участник'
    }))
  } else {
    selectedUsers.value = []
  }
}



// Сохраняем выбранных пользователей в БД
const setUsers = async (users) => {
  console.log('🔥 setUsers получил:', users)

  if (!projectId.value) {
    console.error('❌ Нет projectId')
    return
  }

  // 👇 1. Удаляем всех старых участников этого проекта
  const { error: deleteError } = await supabase
    .from('project_members')
    .delete()
    .eq('project_id', projectId.value)

  if (deleteError) {
    console.error('❌ Ошибка удаления старых участников:', deleteError)
    return
  }

  // 👇 2. Добавляем новых участников
  if (users && users.length > 0) {
    const membersToInsert = users.map(user => ({
      project_id: projectId.value,
      user_id: user.id
    }))

    console.log('📦 Добавляем новых участников:', membersToInsert)

    const { error: insertError } = await supabase
      .from('project_members')
      .insert(membersToInsert)

    if (insertError) {
      console.error('❌ Ошибка добавления участников:', insertError)
    } else {
      console.log('✅ Участники сохранены в БД')
    }
  } else {
    console.log('ℹ️ Участников нет, проект очищен')
  }

  // 👇 3. Обновляем локальный список
  selectedUsers.value = users.map(user => ({
    id: user.id,
    name: user.full_name || user.name,
    avatar: user.avatar_url || user.avatar
  }))
}

// Удалить участника
const removeUser = async (userId) => {
  console.log('🗑️ Удаляем пользователя с ID:', userId)

  if (!projectId.value) {
    console.error('❌ Нет projectId')
    return
  }

  try {
    // Удаляем из базы данных
    const { error } = await supabase
      .from('project_members')
      .delete()
      .eq('project_id', projectId.value)
      .eq('user_id', userId)

    if (error) {
      console.error('❌ Ошибка удаления из БД:', error)
      return
    }

    // Обновляем локальный список
    selectedUsers.value = selectedUsers.value.filter(u => u.id !== userId)
    console.log('✅ Пользователь удален, остались:', selectedUsers.value)

  } catch (error) {
    console.error('❌ Ошибка:', error)
  }
}

// Инициализация
onMounted(async () => {
  // Получаем или создаем проект
  if (route.params.projectId) {
    projectId.value = route.params.projectId
  } else {
    projectId.value = await createNewProject()
  }

  // Загружаем участников
  if (projectId.value) {
    await loadProjectMembers()
  }
})
</script>
