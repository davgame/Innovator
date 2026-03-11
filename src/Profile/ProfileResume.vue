<template>
  <div class="rounded-2xl bg-[#FEFEFE] p-6 border border-[#E3E3E3]/62">
    <h2 class="text-lg font-semibold text-gray-800 mb-4">Резюме</h2>

    <!-- Состояние загрузки -->
    <div v-if="isUploading" class="flex items-center justify-center p-8">
      <div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <span class="ml-3 text-gray-600">Загрузка...</span>
    </div>

    <!-- Нет резюме -->
    <div v-else-if="!resumeInfo?.resume_url" class="flex flex-col md:flex-row items-center justify-between p-4 text-gray-500 text-center py-4 border border-dashed rounded-2xl">
      <p class="text-gray-500 text-center mb-3 md:mb-0">Резюме не загружено</p>
      <button
        v-if="editMode"
        @click="triggerFileInput"
        class="cursor-pointer px-4 py-3 bg-blue-500 text-white rounded-[12px] text-[14px] hover:bg-blue-600 font-medium whitespace-nowrap"
      >
        Загрузить резюме
      </button>
    </div>

    <!-- Есть резюме -->
    <div v-else-if="resumeInfo?.resume_url" class="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
      <div class="flex items-center gap-3 flex-1">
        <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
          <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div class="flex-1">
          <p class="font-medium text-gray-900">{{ resumeInfo.resume_name }}</p>
          <p class="text-sm text-gray-500">{{ formatFileSize(resumeInfo.resume_size) }}</p>
        </div>
      </div>

      <div class="flex gap-2">
        <!-- Скачать -->
        <a
          :href="resumeInfo?.resume_url"
          target="_blank"
          class="text-blue-500 hover:text-blue-600 p-2"
          title="Скачать"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </a>

        <!-- Заменить (только в режиме редактирования) -->
        <button
          v-if="editMode"
          @click="triggerFileInput"
          class="text-gray-500 hover:text-blue-500 p-2"
          title="Заменить"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>

        <!-- Удалить (только в режиме редактирования) -->
        <button
          v-if="editMode"
          @click="confirmDelete"
          class="text-gray-500 hover:text-red-500 p-2"
          title="Удалить"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Скрытый input для выбора файла -->
    <input
      v-if="editMode"
      type="file"
      accept=".pdf"
      class="hidden"
      ref="fileInput"
      @change="handleFileSelect"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch  } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { supabase } from '@/lib/supabase' 

const props = defineProps({
  editMode: {
    type: Boolean,
    default: false
  },
  initialResume: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:resume'])

const authStore = useAuthStore()
const fileInput = ref(null)
const resumeFile = ref(null)
const resumeInfo = ref(null)
const isUploading = ref(false)

// Загружаем информацию о резюме при монтировании
onMounted(async () => {
  console.log('📌 ProfileResume монтируется');

  if (authStore.user?.id) {
    console.log('📡 Загружаю резюме для:', authStore.user.id);

    try {
      const data = await authStore.getResumeInfo(authStore.user.id);
      console.log('✅ Данные из БД:', data);

      if (data?.resume_url) {
        resumeInfo.value = data;
      } else {
        resumeInfo.value = null;
      }
    } catch (error) {
      console.error('❌ Ошибка загрузки:', error);
      resumeInfo.value = null;
    }
  } else {
    console.log('⚠️ Нет пользователя');
  }
});

watch(() => authStore.user, async (newUser) => {
  if (newUser?.id) {
    console.log('👤 Пользователь изменился, загружаю резюме');
    const data = await authStore.getResumeInfo(newUser.id);
    resumeInfo.value = data?.resume_url ? data : null;
  } else {
    resumeInfo.value = null;
  }
}, { immediate: true });

const handleFileSelect = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  // Проверка типа
  if (file.type !== 'application/pdf') {
    alert('Пожалуйста, выберите PDF файл')
    return
  }

  // Проверка размера (2 МБ)
  if (file.size > 2 * 1024 * 1024) {
    alert('Файл не должен превышать 2 МБ')
    return
  }

  isUploading.value = true

  try {
    // 👇 Сначала удаляем старый файл, если он есть
    if (resumeInfo.value?.resume_url) {
      console.log('🗑️ Удаляю старый файл:', resumeInfo.value.resume_name)

      // Извлекаем путь из URL
      const oldFilePath = resumeInfo.value.resume_url.split('/storage/v1/object/public/resumes/')[1]

      if (oldFilePath) {
        const { error: deleteError } = await supabase.storage
          .from('resumes')
          .remove([oldFilePath])

        if (deleteError) {
          console.error('❌ Ошибка удаления старого файла:', deleteError)
        } else {
          console.log('✅ Старый файл удален')
        }
      }
    }

    // Загружаем новый файл
    const result = await authStore.uploadResume(file, authStore.user.id)

    if (result.success) {
      console.log('✅ Новый файл загружен')

      resumeInfo.value = {
        resume_url: result.url,
        resume_name: file.name,
        resume_size: file.size
      }

        emit('update:resume', {  // 👈 ВЫЗОВ СОБЫТИЯdefineProps
        name: file.name,
        size: file.size,
        url: result.url
      })
    }
  } catch (error) {
    console.error('❌ Ошибка загрузки:', error)
  } finally {
    isUploading.value = false
  }
}

const confirmDelete = async () => {
  if (!confirm('Удалить резюме?')) return

  isUploading.value = true
  try {
    const result = await authStore.deleteResume(authStore.user.id)

    if (result.success) {
      resumeFile.value = null
      resumeInfo.value = null
      emit('update:resume', null)
    }
  } catch (error) {
    console.error('Ошибка удаления:', error)
  } finally {
    isUploading.value = false
  }
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const formatFileSize = (bytes) => {
  if (!bytes) return '0 МБ'
  if (bytes < 1024) return bytes + ' Б'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' КБ'
  return (bytes / (1024 * 1024)).toFixed(1) + ' МБ'
}
</script>
