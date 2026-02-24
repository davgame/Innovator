<template>
  <Teleport to="body">
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <!-- Затемненный фон -->
      <div class="fixed inset-0 bg-black/50" @click="close"></div>

      <!-- Модальное окно -->
      <div class="relative bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
        <!-- Заголовок -->
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-gray-900">Удалить фото</h2>
        </div>

        <!-- Содержимое -->
        <div class="px-6 py-4">
          <p class="text-gray-600">
            Вы действительно хотите удалить изображение профиля?
          </p>
        </div>

        <!-- Кнопки действий -->
        <div class="px-6 py-4 bg-gray-50 flex justify-end gap-3">
          <button
            @click="close"
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Отмена
          </button>
          <button
            @click="confirm"
            class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'confirm'])

const close = () => {
  emit('close')
}

const confirm = () => {
  emit('confirm')
  emit('close')
}
</script>
