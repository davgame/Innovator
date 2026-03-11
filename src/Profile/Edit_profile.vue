<template>
  <Header/>

  <div class="lg:px-20 px-4 lg:mt-21 mt-21 relative">
    <img src="/src/assets/images/bg_user.svg" class="lg:rounded-[20px] rounded-[10px] lg:w-full lg:h-full
         w-full h-26 object-cover" alt="Banner">

    <!-- Аватар + информация -->
      <div class="absolute
         lg:left-[180px] left-1/2
         bottom-0 translate-y-[150px] lg:translate-y-[120px]
         -translate-x-1/2 lg:translate-x-0
         flex lg:flex-row flex-col
         lg:items-center items-center
         lg:gap-7 gap-2
         lg:p-0 p-4
         w-full lg:w-auto">
        <!-- Контейнер для аватара и индикатора -->
        <div class="relative lg:w-55 lg:h-55 w-22 h-22 flex items-center justify-between"
          @mouseenter="showContextMenu = true"
          @mouseleave="showContextMenu = false">
  <!-- Контейнер аватара -->
  <div class="flex items-center justify-center w-full h-full rounded-full overflow-hidden bg-[#CFD9FF] border-3 border-white lg:mt-4">
    <img
      v-if="authStore.profile?.avatar_url"
      :src="authStore.profile?.avatar_url + '?v=' + new Date().getTime()"
      class="w-full h-full object-cover"
      alt="Avatar"
    />
      <!-- Если нет аватара - показываем стандартную заглушку (ВЫБЕРИ ОДИН ВАРИАНТ) -->
    <img
      v-else
      src="/src/assets/images/Emodzi.svg"
      class="lg:w-[120px] lg:h-[120px] w-[45px] h-[45px] object-cover"
      alt="Default avatar"
    />
  </div>

  <!-- Оверлей при наведении -->
  <div
    class="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
    @click="triggerImageInput"
  >
    <img src="/src/assets/images/camera_2.svg" class="text-white w-10 h-10">
  </div>
    <!-- Индикатор онлайн/офлайн -->
    <div
      class="absolute bottom-2 right-0 lg:bottom-3 lg:right-5 lg:w-6 lg:h-6 w-4 h-4 rounded-full border-2 border-white"
      :class="isOnline ? 'bg-green-500' : 'bg-gray-400'"
      :title="isOnline ? 'В сети' : 'Не в сети'"
    ></div>

      <!-- Контекстное меню -->
    <Edit_img
    v-if="showContextMenu"
      class="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50"
      @edit="handleEditPhoto"
      @delete="handleDeletePhoto"
      @close="showContextMenu = false"
    />
  </div>

  <!-- Скрытый input для выбора файла -->
  <input
    type="file"
    accept="image/jpeg,image/png,image/gif,image/jpg"
    class="hidden"
    ref="imageInput"
    @change="handleImageSelect"
  />
    <div>
    <!-- Информация о пользователе -->
    <div class="flex flex-col lg:items-start items-center lg:mt-30 w-full">
      <div class="flex flex-col lg:flex-row lg:justify-between lg:w-full items-center lg:items-start lg:gap-57">
        <div class="flex items-center lg:gap-3 gap-[6px] lg:justify-start justify-center">
        <h1 class="lg:text-4xl text-[19px] lg:py-2 font-bold ">
           {{ editedProfile.full_name || authStore.profile?.full_name || 'Пользователь' }}
        </h1>
        <img
          src="/src/assets/images/metka.svg"
          class="lg:w-[35px] lg:h-[35px] w-[18px] h-[18px] lg:translate-y-[6px] translate-y-[3px]"
          alt="metka"
        >
      </div>
        <Save_button
          :saving="isSaving"
          :has-changes="hasChanges"
          @cancel="handleCancel"
          @save="saveProfile"
          class="hidden lg:flex items-center translate-y-[17px]"/>
      </div>
          <!-- 👇 СТАТУС ПОЛЬЗОВАТЕЛЯ -->
    <div class="flex items-center gap-2 lg:mt-1">
      <p
        class="lg:text-left text-center text-[15px] lg:text-[18px]"
        :class="isOnline ? 'text-green-600' : 'text-gray-500'"
      >
        {{ userStatusText }}
      </p>
    </div>
      <Save_button
        :saving="isSaving"
        :has-changes="hasChanges"
        @cancel="handleCancel"
        @save="saveProfile"
        class="lg:hidden block items-center translate-y-[17px] justify-center"/>
    </div>
  </div>
  </div>

  </div>
    <!-- Сетка с компонентами -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-55 lg:px-20 px-4">
      <User_organization
        :edit-mode="true"
        :initial-organization-id="editedProfile.organization_id || authStore.profile?.organization_id"
        @update:organization="handleOrganizationUpdate"
      />
      <ProfileCompetencies
        :edit-mode="true"
        :initial-competencies="editedProfile.competencies"
        @update:competencies="updateCompetencies"
      />
      <ProfileRole
        :key="profileRoleKey"
        :edit-mode="true"
        :organization-id="editedProfile.organization_id"
        :initial-role-id="editedProfile.role_id"
        @update:role="updateRole"
        class="lg:mb-40"
      />
      <ProfileResume
        :edit-mode="true"
        :initial-resume="editedProfile.resume"
        @update:resume="updateResume"
        class="lg:mb-40 mb-25"
      />

    </div>
    <Footer/>
      <!-- Модалка редактирования -->
    <ModalOmg
      :show="showEditModal"
      :image-file="selectedImage"
      @close="closeEditModal"
      @save="saveAvatar"
    />
    <!-- Модалка подтверждения удаления -->
    <Delete_Modal
      :show="showDeleteModal"
      @close="showDeleteModal = false"
      @confirm="confirmDeletePhoto"
    />

    <!-- Модалка выхода -->
    <Exit_modal
      :show="showExitModal"
      @close="showExitModal = false"
      @confirm="handleLogout"
    />
</template>

<script setup>
import Header from '@/components/Home/Header.vue';
import { ref, watch, onMounted, computed, reactive, watchEffect  } from 'vue'  // 👈 добавь ref, onMounted, onUnmounted
import { useRouter } from 'vue-router'  // 👈 добавь этот импорт
import { useAuthStore } from '@/stores/auth'
import User_organization from './User_organization.vue';
import ProfileCompetencies from './ProfileCompetencies.vue';
import ProfileResume from './ProfileResume.vue';
import ProfileRole from './ProfileRole.vue';
import Footer from '@/components/Home/Footer.vue';
import ModalOmg from '@/components/Authorization/ModalOmg.vue';
import Edit_img from './Edit_img.vue';
import { supabase } from '@/lib/supabase' // 👈 убедись что импортирован
import Delete_Modal from './Delete_Modal.vue';
import Exit_modal from './Exit_modal.vue';
import Save_button from './Save_button.vue';

const imageInput = ref(null)
const authStore = useAuthStore()
// 👇 Объявляем ВСЕ ref переменные
const isOnline = ref(false)
const selectedImage = ref(null)      // для файла изображения
const showEditModal = ref(false)     // для модального окна
const avatarPreview = ref('')
const router = useRouter()  // 👈 добавь эту строку
const showExitModal = ref(false)
const isSaving = ref(false)
const profileRoleKey = ref(0)

// Состояние
const saving = ref(false)

// После объявления editedProfile

console.log('authStore.profile?.full_name:', authStore.profile?.full_name)

// Добавьте в начало <script setup>
const props = defineProps({
  // Определите нужные props
  userId: {
    type: String,
    default: null
  },
  // ... другие props
})

// Редактируемые данные
const editedProfile = ref({
  full_name: authStore.profile?.full_name || '',  // ← сюда должно прийти имя
  avatar_url: authStore.profile?.avatar_url || null,
  organization_id: authStore.profile?.organization_id,
  organization: null,
  competencies: ['React.JS', 'REST API', 'TailwindCSS', 'HTML', 'CSS', 'Figma'],
  role: 'Активист',
  resume: {
    name: 'Anisimov_CV.PDF',
    size: '1.5 МБ',
    url: null
  }
})

// Добавь логирование
console.log('authStore.profile:', authStore.profile)
console.log('editedProfile.full_name:', editedProfile.full_name)

// Копия исходных данных для отмены
const originalProfile = ref(JSON.parse(JSON.stringify(editedProfile)))

const updateCompetencies = (comps) => {
  editedProfile.competencies = comps
}


const handleCancel = () => {
  console.log('Отмена редактирования')
  router.back()
}

const handleSave = async () => {
  console.log('💾 Сохраняем профиль...')
  isSaving.value = true

  try {
    // Ваша логика сохранения в БД
    // ...

    console.log('✅ Профиль сохранен')
    router.back()
  } catch (error) {
    console.error('❌ Ошибка сохранения:', error)
  } finally {
    isSaving.value = false
  }
}

// computed свойство для отслеживания изменений
const hasChanges = computed(() => {
  if (!editedProfile.value || !originalProfile.value) {
    console.log('⚠️ Нет данных для сравнения')
    return false
  }

  const changed =
    editedProfile.value.full_name !== originalProfile.value.full_name ||
    editedProfile.value.organization_id !== originalProfile.value.organization_id ||
    editedProfile.value.role_id !== originalProfile.value.role_id

  console.log('📊 Сравнение:', {
    changed,
    newName: editedProfile.value.full_name,
    oldName: originalProfile.value.full_name,
    newOrg: editedProfile.value.organization_id,
    oldOrg: originalProfile.value.organization_id
  })

  return changed
})

watchEffect(() => {
  console.log('📊 isSaving:', isSaving.value)
  console.log('📊 hasChanges:', hasChanges.value)
})

const saveProfile = async () => {
  console.log('💾 saveProfile вызван');
  console.log('👤 authStore.user:', authStore.user)

  if (!authStore.user?.id) {
    console.error('❌ Нет ID пользователя в saveProfile')
    alert('Ошибка: пользователь не авторизован')
    await authStore.refreshUser()
    if (!authStore.user?.id) {
      router.push('/authorization')
      return
    }
  }

  isSaving.value = true  // 👈 используйте isSaving (не saving)
  try {
    console.log('✅ Сохраняем с ID:', authStore.user.id)

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: editedProfile.value.full_name,
        organization_id: editedProfile.value.organization_id,
        role_id: editedProfile.value.role_id
      })
      .eq('id', authStore.user.id)

    if (error) throw error

    console.log('✅ Профиль сохранен')
    await authStore.refreshUser()
    router.back()
  } catch (error) {
    console.error('❌ Ошибка сохранения:', error)
    alert('Не удалось сохранить изменения')
  } finally {
    isSaving.value = false
  }
}

const handleOrganizationUpdate = (org) => {
  console.log('🏢 Обновление организации:', org)

  editedProfile.value.organization_id = org.id
  editedProfile.value.organization = org

  // сброс роли
  editedProfile.value.role_id = null
  editedProfile.value.role = null

  profileRoleKey.value++
}

// При загрузке профиля
onMounted(async () => {
  await authStore.refreshUser()

  if (authStore.profile) {
    // Для ref
    editedProfile.value = {
      full_name: authStore.profile.full_name || '',
      organization_id: authStore.profile.organization_id || null,
      role_id: authStore.profile.role_id || null
    }

    originalProfile.value = JSON.parse(JSON.stringify(editedProfile.value))
  }
})

const handleLogout = async () => {
  console.log('🚪 Выход из аккаунта')
  try {
    await authStore.signOut()
    console.log('✅ Успешно вышел')

    // 👇 Принудительно прокручиваем страницу вверх
    window.scrollTo({
      top: 0,
      behavior: 'instant' // или 'smooth' если хочешь плавно
    })

    router.push('/')
  } catch (error) {
    console.error('❌ Ошибка при выходе:', error)
  }
}

// Следим за изменениями профиля
watch(() => authStore.profile, (newProfile) => {
  console.log('Profile changed:', newProfile?.full_name)

  if (newProfile?.full_name) {
    if (!editedProfile.full_name) {
      editedProfile.full_name = newProfile.full_name
    }
  }
}, { immediate: true })

// После создания editedProfile
watch(() => authStore.profile, (newProfile) => {
  if (newProfile?.full_name) {
    editedProfile.full_name = newProfile.full_name
    editedProfile.avatar_url = newProfile.avatar_url
    editedProfile.organization_id = newProfile.organization_id
  }
}, { immediate: true })

// 1. Получаем доступ к store

// 2. Смотрим профиль
console.log(authStore.profile)

// 3. Смотрим конкретно имя
console.log('Full name:', authStore.profile?.full_name)

// Открыть модальное окно
const openExitModal = () => {
  showExitModal.value = true
}

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

// Метод для закрытия модалки
const closeEditModal = () => {
  showEditModal.value = false
  selectedImage.value = null
}

// Состояние для контекстного меню
const showContextMenu = ref(false)

// Методы для контекстного меню
const handleEditPhoto = () => {
  showContextMenu.value = false
  triggerImageInput()
}

const closeContextMenu = () => {
  showContextMenu.value = false
}

// Метод для открытия проводника
const triggerImageInput = () => {
  if (imageInput.value) {
    imageInput.value.click()
  }
}

// Обработчик выбора файла
const handleImageSelect = (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    alert('Пожалуйста, выберите изображение')
    return
  }

  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    alert('Файл слишком большой. Максимальный размер: 5 МБ')
    return
  }

  selectedImage.value = file
  showEditModal.value = true
  event.target.value = ''
}


// Функция для конвертации DataURL в File
const dataURLtoFile = (dataurl, filename) => {
  const arr = dataurl.split(',')
  const mime = arr[0].match(/:(.*?);/)[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, { type: mime })
}

// Следим за изменениями аватара
watch(() => authStore.profile?.avatar_url, (newUrl, oldUrl) => {
  console.log('Avatar URL changed from', oldUrl, 'to', newUrl)
}, { immediate: true })

// Также следим за всем профилем
watch(() => authStore.profile, (newProfile) => {
  console.log('Profile updated:', newProfile)
}, { deep: true })


const saveAvatar = async (imageDataUrl) => {
  console.log('saveAvatar called')

  if (authStore.user?.id) {
    const newAvatarUrl = await uploadAvatarToStorage(imageDataUrl, authStore.user.id)

    if (newAvatarUrl) {
      // 👇 1. Сначала обновляем store напрямую (мгновенно)
      if (authStore.profile) {
        authStore.profile.avatar_url = newAvatarUrl
      }

      // 👇 2. Потом делаем refresh для синхронизации с сервером
      await authStore.refreshUser()

      // 👇 3. Принудительно обновляем версию в Header (если нужно)
      // Можно использовать sessionStorage или event bus
      sessionStorage.setItem('avatarUpdated', Date.now().toString())
    }
  }

  showEditModal.value = false
}

onMounted(async () => {
  console.log('🔍 EditProfile mounted')
  console.log('👤 authStore.user:', authStore.user)
  console.log('📊 authStore.profile:', authStore.profile)

  if (!authStore.user?.id) {
    console.log('⏳ Пользователь не авторизован, пробуем загрузить...')
    await authStore.refreshUser()
  }

  if (authStore.user?.id) {
    console.log('✅ Пользователь загружен, ID:', authStore.user.id)
    editedProfile.full_name = authStore.profile?.full_name || ''
    editedProfile.avatar_url = authStore.profile?.avatar_url || null
    editedProfile.organization_id = authStore.profile?.organization_id
  } else {
    console.error('❌ Не удалось получить ID пользователя')
    router.push('/authorization')
  }
})

// Обновленная функция загрузки (возвращает URL)
const uploadAvatarToStorage = async (imageDataUrl, userId) => {
  try {
    // Конвертируем DataURL в File
    const file = dataURLtoFile(imageDataUrl, 'avatar.jpg')

    // Загружаем в Storage Supabase
    const fileName = `${userId}/avatar.jpg`
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, { upsert: true })

    if (uploadError) {
      console.error('Ошибка загрузки аватара:', uploadError)
      return null
    }

    // Получаем публичную ссылку
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName)

    // Обновляем профиль с ссылкой на аватар
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        avatar_url: publicUrl,
        avatar_name: file.name,
        avatar_size: file.size
      })
      .eq('id', userId)

    if (updateError) {
      console.error('Ошибка обновления профиля:', updateError)
      return null
    }

    console.log('Аватар успешно загружен:', publicUrl)
    return publicUrl

  } catch (err) {
    console.error('Ошибка:', err)
    return null
  }
}

// Также добавь watch для отслеживания изменений в store
watch(() => authStore.profile?.avatar_url, (newUrl) => {
  if (newUrl) {
    avatarPreview.value = newUrl
    console.log('Avatar URL updated in store:', newUrl)
  }
})

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
  if (isOnline.value) return 'В сети'
  return `был(а) ${formatLastSeen(authStore.profile?.last_seen)}`
})

// Состояние для модалки удаления
const showDeleteModal = ref(false)

// Метод для открытия модалки удаления
const handleDeletePhoto = () => {
  showContextMenu.value = false
  showDeleteModal.value = true
}

const updateOrganization = (org) => {
  console.log('🏢 Обновление организации:', org)
  editedProfile.organization_id = org.id
  editedProfile.organization = org
  // Сбрасываем роль при смене организации
  editedProfile.role_id = null
  editedProfile.role = null
}



const updateRole = (role) => {
  editedProfile.value.role_id = role.id
  editedProfile.value.role = role
}

// 👇 ДОБАВЬТЕ ЭТУ ФУНКЦИЮ
const updateResume = (resumeData) => {
  console.log('📄 Обновление резюме:', resumeData)
  editedProfile.resume = resumeData
}

// Метод для подтверждения удаления
const confirmDeletePhoto = async () => {
  try {
    console.log('1️⃣ Начинаем удаление')
    console.log('2️⃣ ID пользователя:', authStore.user?.id)

    if (!authStore.user?.id) {
      console.error('❌ Нет ID пользователя')
      return
    }

    console.log('3️⃣ Отправляем запрос к Supabase...')

    const { data, error } = await supabase
      .from('profiles')
      .update({
        avatar_url: null,
        avatar_name: null,
        avatar_size: null
      })
      .eq('id', authStore.user?.id)
      .select()

    console.log('4️⃣ Ответ получен')
    console.log('5️⃣ data:', data)
    console.log('6️⃣ error:', error)

    if (error) {
      console.error('7️⃣ Ошибка Supabase:', error)
      console.error('8️⃣ Код ошибки:', error.code)
      console.error('9️⃣ Сообщение:', error.message)
      throw error
    }

    console.log('🔟 Данные после обновления:', data)

    // Обновляем локальный store
    if (authStore.profile) {
      authStore.profile.avatar_url = null
      authStore.profile.avatar_name = null
      authStore.profile.avatar_size = null
    }

    console.log('1️⃣1️⃣ Вызываем refreshUser')
    await authStore.refreshUser()

    console.log('1️⃣2️⃣ Готово!')

  } catch (error) {
    console.error('❌ Ошибка в catch:', error)
    console.error('❌ Полный объект ошибки:', JSON.stringify(error, null, 2))
  }
}
// Следим за изменениями
watch(() => authStore.profile, (newProfile) => {
  console.log('Profile changed:', newProfile)

  if (newProfile && !editedProfile.full_name) {
    console.log('Setting full_name to:', newProfile.full_name)
    editedProfile.full_name = newProfile.full_name
  }
}, { immediate: true })  // 👈 опции должны быть здесь

// После создания editedProfile
console.log('🔥 editedProfile.full_name:', editedProfile.full_name)
console.log('🔥 authStore.profile?.full_name:', authStore.profile?.full_name)

// При монтировании
onMounted(async () => {
  console.log('🔍 EditProfile mounted')

  // Принудительно загружаем пользователя
  await authStore.refreshUser()

  console.log('✅ После refreshUser:', authStore.user)

  if (authStore.user?.id) {
    editedProfile.full_name = authStore.profile?.full_name || ''
    editedProfile.organization_id = authStore.profile?.organization_id
  } else {
    console.error('❌ Не удалось загрузить пользователя')
  }
})

</script>
