<template>
  <Header/>
  <div class="w-full flex flex-col items-center lg:mt-35 mt-18">  <!--lg:mt-16-->
    <!-- Заголовок -->

    <div class="w-full lg:flex lg:space-x-8 px-2 max-w-7xl mx-auto">
      <!--Первая колонка-->
      <div class="lg:w-[380px]">
        <p class="font-semibold text-[22px] text-[#32383E]">Руководитель проекта</p>
        <div class="border border-[#CBCBCB] rounded-[61px] p-3 flex items-center space-x-2 mt-5 max-w-[370px]">
          <img src="/src/assets/images/David.png" alt="" class="w-[72px] h-[72px] rounded-full">
          <div>
            <h3 class="text-[#32383E] text-[20px] pl-4 font-medium">Шорвоглян Давид</h3>
            <p class="text-[14px] text-[#4286F7] pl-4">Инженер</p>
          </div>
        </div>
        <!--Объединение-->
        <div class="border border-[#CBCBCB] rounded-[61px] p-3 flex items-center space-x-2 mt-12 max-w-[370px]">
          <img src="/src/assets/images/СNO_KubGTU.png" alt="" class="w-[72px] h-[72px] rounded-full">
          <div>
            <h3 class="text-[#32383E] text-[20px] pl-4 font-medium">СНО КубГТУ</h3>
            <p class="text-[14px] text-[#4286F7] pl-4">Наука</p>
          </div>
        </div>
      </div>

      <div class="border border-[#A8A8A8]/28 max-w-xs"></div> <!-- РАЗДЕЛИТЕЛЬ -->

      <!--Вторая колонка-->
      <div class="lg:w-1/3 px-3">
    <div class="mb-6">
      <label class="block font-semibold text-[22px] text-gray-700 mb-4">
        Описание проекта
      </label>

      <textarea
        v-model="text"
        rows="6"
        maxlength="1000"
        @input="checkText"
        :class="[
          'w-92 h-68 px-4 py-3 border rounded-[30px] focus:ring-2 focus:border-blue-500 resize-none',
          hasError ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
        ]"
        placeholder="Введите ваш текст здесь..."
      ></textarea>

      <!-- Индикатор символов -->
      <div class="flex justify-between items-center mt-2">
        <div class="text-sm" :class="charCount > 1000 ? 'text-red-600' : 'text-gray-500'">
          Введено символов: <span class="font-medium">{{ charCount }}</span>/1000
        </div>
      </div>
    </div>

    <!-- Сообщения об ошибках -->
    <div v-if="errorMessage" class="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800">
      {{ errorMessage }}
    </div>
  </div>
      </div>
  </div>

    <!-- Кнопка "Подробнее" -->
    <router-link to="/Pasport" @click="isOpen = false">
  <button @click="modalOpen = true" class="btn-more bg-[#222222] hover:bg-[#4286F7] text-white font-medium lg:mb-25 mb-24 py-4 lg:px-28 px-30 text-[20px] rounded-[18px] fixed bottom-10 left-1/2 transform -translate-x-1/2 z-40 transition-colors duration-300 cursor-pointer">
    Далее
  </button>
  </router-link>
  <!-- Кнопка "Подробнее" -->
  <button @click="$router.back()" class="btn-more border-1 border-[#222222] hover:bg-gray-100 text-[#222222] font-medium lg:mb-3 mb-2 py-4 lg:px-28 px-30 text-[20px] rounded-[18px] fixed bottom-10 left-1/2 transform -translate-x-1/2 z-40 transition-colors duration-300 cursor-pointer">
    Назад
  </button>
</template>

<script setup>
import { ref, computed } from 'vue'
import Header from '../Home/Header.vue';

const text = ref('')
const errorMessage = ref('')

const charCount = computed(() => text.value.length)

const hasError = computed(() => errorMessage.value !== '')

function checkText() {
  errorMessage.value = ''

  // Проверка на недопустимые символы
  if (text.value.includes('*')) {
    errorMessage.value = 'Недопустимый символ: *'
    return
  }

  // Проверка на превышение лимита
  if (charCount.value > 1000) {
    errorMessage.value = `Превышен лимит в 1000 символов`
  }
}
</script>
