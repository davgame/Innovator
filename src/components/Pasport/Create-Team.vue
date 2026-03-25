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
          <button class="cursor-pointer hover:text-[#4286F7]" @click="removeUser(user.id)">✕</button>
        </div>
      </div>
    </div>
    <button @click="showModal = true" class="btn-more border-1 border-[#222222] hover:border-[#4286F7] text-[#222222] hover:text-[#4286F7] font-medium lg:mb-58 mb-48 py-1 lg:px-51 px-35 text-[20px] rounded-[18px] fixed bottom-10 left-1/2 transform -translate-x-1/2 z-40 transition-colors duration-300 cursor-pointer">
      +
    </button>
    <!-- Модальное окно (компонент Add-User.vue) -->
    <AddUser
      v-if="showModal"
      :project-id="computedProjectId"
      :selected-users="selectedUsers"
      mode="edit"
      @close="showModal = false"
      @confirm="setUsers"
    />
  </div>
  <div class="px-3 lg:mt-0 mt-105">
    <div class="flex flex-col items-center gap-4 lg:fixed lg:bottom-10 lg:left-1/2 lg:transform lg:-translate-x-1/2 lg:z-40 lg:w-auto mt-auto lg:mt-0">
      <!-- Кнопка "Далее" -->

        <button @click="goToPasport" class="btn-more bg-[#222222] hover:bg-[#4286F7] text-white font-medium py-4 lg:px-28 text-[20px] rounded-[18px] transition-colors duration-300 cursor-pointer w-full text-center">
          Далее
        </button>

      <!-- Кнопка "Назад" -->
      <button @click="$router.back()" class="btn-more border-1 border-[#222222] hover:bg-gray-100 text-[#222222] font-medium py-4 lg:px-28 text-[20px] rounded-[18px] transition-colors duration-300 cursor-pointer w-75 lg:w-auto text-center">
        Назад
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth'
import Header from '../Home/Header.vue'
import AddUser from './Add-User.vue'

const route = useRoute()
const router = useRouter()

const computedProjectId = computed(() => {
  // Сначала проверяем props.projectId
  if (props.projectId) {
    return Number(props.projectId)
  }

  // Потом проверяем route.query.id
  if (route.query.id) {
    const id = Number(route.query.id)
    if (!isNaN(id) && id > 0) {
      return id
    }
  }

  return null
})
const authStore = useAuthStore()

computedProjectId
const showModal = ref(false)
const selectedUsers = ref([])

const createNewProject = async () => {
  console.log('Создаем новый проект...')

  if (!authStore.user?.id) {
    console.error('❌ Пользователь не авторизован')
    return null
  }

  const { data, error } = await supabase
    .from('projects')
    .insert({
      name: props.projectName || 'Новый проект',
      created_by: authStore.user.id,
      created_at: new Date().toISOString()
    })
    .select()
    .single()

  if (error) {
    console.error('❌ Ошибка создания проекта:', error)
    return null
  }

  if (data) {
    console.log('✅ Проект создан, ID:', data.id)
    return data.id
  }

  return null
}

const props = defineProps({
  projectName: {
    type: String,
    default: ''
  },
  projectId: {
    type: Number,
    default: null
  }
})


// При переходе на Pasport передаем название дальше
const goToPasport = () => {
  console.log('👉 Переход на Pasport с ID:', computedProjectId.value)
  router.push({
    path: '/Pasport',
    query: {
      id: computedProjectId.value,
      name: props.projectName || route.query.name
    }
  })
}

const loadProjectMembers = async () => {
  if (!computedProjectId.value) return

  const { data, error } = await supabase
    .from('project_members')
    .select(`
      user_id,
      role,
      joined_at,
      profiles:user_id (
        full_name,
        avatar_url
      )
    `)
    .eq('project_id', computedProjectId.value)

  if (error) {
    console.error('Ошибка загрузки участников:', error)
    return
  }

  if (data && data.length > 0) {
    selectedUsers.value = data.map(m => ({
      id: m.user_id,
      name: m.profiles?.full_name || 'Пользователь',
      avatar: m.profiles?.avatar_url || null,
      role: m.role || 'Участник',
      joined_at: m.joined_at
    }))
    console.log('👥 Загружено участников:', selectedUsers.value.length)
  } else {
    selectedUsers.value = []
  }
}

const setUsers = async (users) => {
  console.log('🔥 Сохраняем участников:', users)

  const projectId = computedProjectId.value

  if (!projectId) {
    console.error('❌ Нет ID проекта')
    alert('Ошибка: не удалось определить проект')
    return
  }

  if (!users || users.length === 0) {
    showModal.value = false
    return
  }

  try {
    // Получаем существующих участников
    const { data: existingMembers, error: fetchError } = await supabase
      .from('project_members')
      .select('user_id')
      .eq('project_id', projectId)

    if (fetchError) throw fetchError

    const existingUserIds = existingMembers?.map(m => m.user_id) || []

    // Только новые пользователи
    const newUsers = users.filter(user => !existingUserIds.includes(user.id))

    if (newUsers.length === 0) {
      console.log('⚠️ Все пользователи уже в проекте')
      showModal.value = false
      return
    }

    // ✅ ПРАВИЛЬНО: используем joined_at
    const membersToInsert = newUsers.map(user => ({
      project_id: projectId,
      user_id: user.id,
      role: user.role || 'member',
      joined_at: new Date().toISOString()
    }))

    console.log('📝 Добавляем участников:', membersToInsert)

    const { error: insertError } = await supabase
      .from('project_members')
      .insert(membersToInsert)

    if (insertError) throw insertError

    console.log('✅ Участники добавлены в БД')

    // Обновляем список
    await loadProjectMembers()
    showModal.value = false

  } catch (error) {
    console.error('❌ Ошибка сохранения участников:', error)
    alert(`Ошибка: ${error.message}`)
  }
}

const removeUser = async (userId) => {
  console.log('🗑️ Удаляем пользователя:', userId)

  if (!computedProjectId.value) {
    // Если нет проекта, просто удаляем из локального списка
    selectedUsers.value = selectedUsers.value.filter(u => u.id !== userId)
    return
  }

  try {
    const { error } = await supabase
      .from('project_members')
      .delete()
      .eq('project_id', computedProjectId.value)
      .eq('user_id', userId)

    if (error) throw error

    // Обновляем локальный список
    selectedUsers.value = selectedUsers.value.filter(u => u.id !== userId)

    console.log('✅ Участник удалён из БД')
  } catch (error) {
    console.error('❌ Ошибка удаления:', error)
    alert('Не удалось удалить участника')
  }
}

// Объедините два onMounted в один
onMounted(async () => {
  console.log('📦 Create-Team mounted')

  // 1. Создаем проект если нет ID
  let id = props.projectId || route.query.id

  if (!id) {
    const newId = await createNewProject()
    if (!newId) return

    id = newId

    // обновляем URL без перезагрузки
    router.replace({
      query: { ...route.query, id: newId }
    })
  }

  // 2. Загружаем участников
  if (id) {
    const { data, error } = await supabase
      .from('project_members')
      .select(`
        *,
        profiles (
          id,
          full_name,
          avatar_url
        )
      `)
      .eq('project_id', id)

    if (!error && data) {
      selectedUsers.value = data.map(m => ({
        id: m.profiles.id,
        name: m.profiles.full_name,
        avatar: m.profiles.avatar_url,
        role: m.role || 'Участник'
      }))
      console.log('👥 Загружено участников:', selectedUsers.value.length)
    }
  }
})

</script>
