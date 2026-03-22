<template>
  <Teleport to="body">
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="fixed inset-0 bg-black/50" @click="close"></div>
      <div class="relative bg-white rounded-2xl w-full max-w-md shadow-xl">
        <div class="px-6 py-5 border-b border-gray-200">
          <div class="flex items-center gap-3">

            <h2 class="text-xl font-semibold text-gray-900">Удаление проекта</h2>
          </div>
        </div>
        <div class="px-6 py-5">
          <p class="text-gray-600">
            Вы уверены, что хотите удалить проект <strong>"{{ project?.name || '' }}"</strong>?
          </p>
        </div>
        <div class="px-6 py-5 bg-gray-50 flex justify-end gap-3 rounded-2xl">
          <button
            @click="close"
            class="cursor-pointer px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors"
          >
            Отмена
          </button>
          <button
            @click="handleDelete"
            :disabled="isDeleting"
            class="cursor-pointer px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 min-w-[90px]"
          >
            {{ isDeleting ? 'Удаление...' : 'Удалить' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  project: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'deleted'])

const authStore = useAuthStore()
const isDeleting = ref(false)

const close = () => {
  emit('close')
}

const handleDelete = async () => {
  if (!props.project) return

  console.time('🕐 Удаление проекта')
  isDeleting.value = true

  try {
    const projectId = props.project.id

    console.time('🕐 Удаление из БД')
    const results = await Promise.all([
      supabase.from('project_members').delete().eq('project_id', projectId),
      supabase.from('tasks').delete().eq('project_id', projectId),
      supabase.from('projects').delete().eq('id', projectId).eq('created_by', authStore.user?.id)
    ])
    console.timeEnd('🕐 Удаление из БД')

    const projectResult = results[2]
    if (projectResult.error) throw projectResult.error

    console.log('✅ Проект удален')
    emit('deleted', projectId)
    close()

  } catch (error) {
    console.error('❌ Ошибка:', error)
    alert('Не удалось удалить проект')
  } finally {
    isDeleting.value = false
    console.timeEnd('🕐 Удаление проекта')
  }
}
</script>
