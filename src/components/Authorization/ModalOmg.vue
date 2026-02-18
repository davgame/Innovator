<template>
  <Teleport to="body">
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <!-- Затемненный фон -->
      <div class="fixed inset-0 bg-black/50" @click="closeModal"></div>

      <!-- Контент модалки - фиксированная ширина для стабильности -->
      <div class="relative bg-white rounded-2xl w-full max-w-3xl shadow-xl overflow-hidden">
        <!-- Заголовок -->
        <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 class="text-xl font-semibold">Обновить фото профиля</h2>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Описание -->
        <p class="px-6 py-3 text-gray-600 border-b border-gray-200 bg-gray-50/50">
          Выберите изображение, которое будет отображаться в вашем профиле.
        </p>

        <!-- Основной контент с flex row -->
        <div class="flex flex-col md:flex-row">
          <!-- Левая часть - редактор (60% ширины) -->
          <div class="md:w-[60%] p-6">
            <h3 class="text-lg font-medium mb-4">Выбор миниатюры</h3>

            <!-- Контейнер для кроппера с фиксированной высотой -->
            <div class="bg-gray-50 rounded-lg overflow-hidden" :class="{ 'border-2 border-dashed border-gray-300': !imageSrc }">
              <div v-if="imageSrc" class="relative">
                <!-- Кроппер с правильной высотой -->
                <cropper
                  class="cropper"
                  :src="imageSrc"
                  :stencil-props="{
                    aspectRatio: 1,
                    minWidth: 100,
                    minHeight: 100
                  }"
                  :resize-image="{
                    wheel: true,
                    touch: true,
                    drag: true
                  }"
                  @change="onCropperChange"
                />
              </div>

              <!-- Заглушка когда нет изображения -->
              <div v-else class="h-[350px] flex flex-col items-center justify-center p-8">
                <svg class="w-20 h-20 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p class="text-gray-500 text-center mb-2">Выберите изображение для редактирования</p>
                <p class="text-sm text-gray-400">Нажмите на камеру в профиле</p>
              </div>
            </div>

            <!-- Информация о размере -->
            <p class="text-sm text-gray-500 mt-3">
              Допустимый размер: не более 5 МБ, форматы JPG, PNG, GIF
            </p>
          </div>

          <!-- Правая часть - превью (40% ширины) -->
          <div class="md:w-[40%] p-6 bg-gray-50/80 border-t md:border-t-0 md:border-l border-gray-200">
            <h3 class="text-lg font-medium mb-6 text-center">Превью</h3>

            <div class="flex flex-col items-center">
              <!-- Круглый аватар с фиксированным размером -->
              <div class="w-44 h-44 rounded-full overflow-hidden border-4 border-white shadow-lg mb-4">
                <img
                  v-if="croppedImage"
                  :src="croppedImage"
                  alt="Avatar preview"
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center">
                  <svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>

              <!-- Подпись под превью -->
              <p class="text-sm text-gray-500 text-center">
                Ваше фото будет отображаться<br>в круглом формате
              </p>
            </div>
          </div>
        </div>

        <!-- Кнопки действий -->
        <div class="px-6 py-4 border-t border-gray-200 bg-gray-50/50 flex justify-end gap-3">
          <button
            @click="closeModal"
            class="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            Отмена
          </button>
          <button
            @click="saveImage"
            :disabled="!croppedImage"
            class="px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch, onUnmounted } from 'vue';
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';

const props = defineProps({
  show: { type: Boolean, default: false },
  imageFile: { type: File, default: null }
});

const emit = defineEmits(['close', 'save']);

const imageSrc = ref('');
const croppedImage = ref('');

// Следим за изменением файла
watch(() => props.imageFile, (newFile) => {
  if (newFile) {
    // Очищаем предыдущий URL
    if (imageSrc.value) {
      URL.revokeObjectURL(imageSrc.value);
    }
    // Создаем новый URL для превью
    imageSrc.value = URL.createObjectURL(newFile);
    // Сбрасываем обрезанное изображение
    croppedImage.value = '';
  } else {
    imageSrc.value = '';
    croppedImage.value = '';
  }
}, { immediate: true });

// Обработчик изменений в кроппере
const onCropperChange = ({ canvas }) => {
  if (canvas) {
    croppedImage.value = canvas.toDataURL('image/jpeg', 0.95);
  }
};

// Закрыть модалку
const closeModal = () => {
  emit('close');
};

// Сохранить изображение
const saveImage = () => {
  if (croppedImage.value) {
    emit('save', croppedImage.value);
    closeModal();
  }
};

// Очистка URL при размонтировании
onUnmounted(() => {
  if (imageSrc.value) {
    URL.revokeObjectURL(imageSrc.value);
  }
});
</script>

<style scoped>
.cropper {
  height: 350px;
  width: 100%;
  background: #f8f9fa;
}

/* Стили для кроппера */
:deep(.cropper-view-box) {
  border-radius: 50%;
  box-shadow: 0 0 0 1px #3b82f6, 0 0 0 3px #fff;
  outline: none;
}

:deep(.cropper-face) {
  background-color: transparent;
}

:deep(.cropper-line) {
  background-color: #3b82f6;
}

:deep(.cropper-point) {
  background-color: #3b82f6;
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

:deep(.cropper-dashed) {
  border-color: #3b82f6;
  opacity: 0.3;
}
</style>
