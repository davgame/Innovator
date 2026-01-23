<template>
  <div>
    <!-- Шаг 1: Основная регистрация -->
    <div v-if="step === 1">
      <!-- Name -->
      <label class="block text-gray-600 mb-2">Полное имя</label>
      <div class="relative mb-6">
        <span class="absolute inset-y-0 left-4 flex items-center text-gray-400">
          <img src="/src/assets/images/user_1.svg" alt="Innova" class="w-auto h-auto"/>
        </span>
        <input
          v-model="userName"
          type="text"
          placeholder="Федосьев Георгий"
          class="w-full pl-13 pr-4 py-4 rounded-2xl border border-gray-300
                focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          v-if="userName"
          type="button"
          class="absolute inset-y-0 right-4 text-gray-400 cursor-pointer"
          @click="userName = ''"
        >
          <img src="/src/assets/images/cross_1.svg" alt="Очистить поле" class="w-auto h-auto"/>
        </button>
      </div>

      <!-- Email -->
      <label class="block text-gray-600 mb-2">Email</label>
      <div class="relative mb-6">
        <span class="absolute inset-y-0 left-4 flex items-center text-gray-400">
          <img src="/src/assets/images/Messenger.svg" alt="Innova" class="w-auto h-auto"/>
        </span>
        <input
          v-model="email"
          type="email"
          placeholder="Kervis@gmail.com"
          class="w-full pl-13 pr-4 py-4 rounded-2xl border border-gray-300
                focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <!-- Password -->
      <label class="block text-gray-600 mb-2">Пароль</label>
      <div class="relative mb-4">
        <span class="absolute inset-y-0 left-4 flex items-center text-gray-400">
          <img src="/src/assets/images/Password.svg" alt="Innova" class="w-auto h-auto"/>
        </span>
        <input
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="**********"
          class="w-full pl-12 pr-13 py-4 rounded-2xl border border-gray-300
                 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type="button" class="absolute inset-y-0 right-4 text-gray-400 cursor-pointer"
                @click="showPassword = !showPassword">
          <img :src="showPassword ? '/src/assets/images/View.svg' : '/src/assets/images/View-off.svg'"
               alt="Toggle password" class="w-auto h-auto"/>
        </button>
      </div>

      <!-- Далее -->
      <button
        class="w-full py-4 mt-6 rounded-2xl bg-blue-500 text-white text-lg font-semibold
              hover:bg-blue-600 transition cursor-pointer"
        @click="nextStep"
      >
        Далее
      </button>
    </div>

    <!-- Шаг 2: Drop-file -->
<div v-else-if="step === 2">
  <label class="block text-gray-600 mb-2">Загрузите CV</label>

  <!-- Контейнер для загрузки файла -->
  <div
    v-if="!pdfFile"
    class="w-full h-62 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-colors duration-200"
    :class="isDragging ? 'bg-blue-50 border-blue-400' : 'border-gray-300 hover:border-blue-400'"
    @dragover.prevent="isDragging = true"
    @dragleave.prevent="isDragging = false"
    @drop.prevent="handleDrop"
    @click="triggerFileInput"
  >
    <div class="w-full h-full flex flex-col items-center justify-center p-4">

        <svg class="w-12 h-12 text-[#99A1AF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>

      <p class="text-[#999999] mt-2 text-center text-sm">
        Перенесите сюда PDF файл <br />не превышающий 2 МБ
      </p>

      <input
        type="file"
        accept=".pdf"
        class="hidden"
        ref="fileInput"
        @change="handleFileSelect"
      />

      <p
        class="px-4 mt-3 text-[#4286F7] underline rounded-xl cursor-pointer text-sm"
        @click.stop="triggerFileInput"
      >
        Выбрать файл
      </p>
    </div>
  </div>

    <!-- Отображение выбранного файла -->
    <div v-else
      class="w-full border-2 border-gray-200 rounded-2xl p-4 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors">

      <!-- Левая часть: иконка и информация -->
      <div class="flex items-center space-x-4">
        <!-- Иконка PDF -->
        <div class="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
          <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
        </div>

        <!-- Информация о файле -->
        <div class="text-left">
          <p class="text-gray-800 font-medium truncate max-w-xs">
            {{ pdfFile.name }}
          </p>
          <p class="text-gray-500 text-sm mt-1">
            {{ formatFileSize(pdfFile.size) }}
          </p>
        </div>
      </div>
      <img src="/src/assets/images/paperclip.svg" alt="Innova" class="w-auto h-auto" @click="clearFileAndSelectNew"/>
    </div>

    <!-- Сообщение об ошибке -->
    <p v-if="fileError" class="text-red-500 text-sm mt-2">
      {{ fileError }}
    </p>

    <!-- Кнопка отправки -->
    <button
      type="button"
      class="w-full py-4 mt-8 rounded-2xl bg-blue-500 text-white text-lg font-semibold
            hover:bg-blue-600 transition cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
      @click="submitRegistration"
      :disabled="!pdfFile"
    >
      Создать аккаунт
    </button>

    <!-- Кнопка "Назад" -->
    <button
      type="button"
      class="w-full py-4 mt-4 rounded-2xl border border-gray-300 text-gray-700 text-lg font-semibold
            hover:bg-gray-50 transition cursor-pointer"
      @click="step = 1"
    >
      Назад
    </button>
  </div>
  </div>



</template>

<script setup>
import { ref, nextTick } from "vue";

const step = ref(1);
const userName = ref('');
const email = ref('');
const password = ref('');
const showPassword = ref(false);
const isDragging = ref(false);
const pdfFile = ref(null);
const fileError = ref('');
const fileInput = ref(null);

const emit = defineEmits(['complete']);

const nextStep = () => {
  if (!userName.value || !email.value || !password.value) {
    alert("Пожалуйста, заполните все поля");
    return;
  }
  step.value = 2;
};

// Обработчик drag-and-drop
const handleDrop = (event) => {
  event.preventDefault();
  isDragging.value = false;

  if (event.dataTransfer.files.length > 0) {
    const droppedFile = event.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
    event.dataTransfer.clearData();
  }
};

// Обработчик выбора файла через input
const handleFileSelect = (event) => {
  if (event.target.files.length > 0) {
    const selectedFile = event.target.files[0];
    validateAndSetFile(selectedFile);
    isDragging.value = false;
  }
};

// Метод для форматирования размера файла
const formatFileSize = (bytes) => {
  if (!bytes) return '0 Б';
  const k = 1024;
  const sizes = ['Б', 'КБ', 'МБ', 'ГБ'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

// Триггер для открытия диалога выбора файла
const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

// Валидация и установка файла
const validateAndSetFile = (file) => {
  fileError.value = '';

  if (!file) {
    fileError.value = 'Файл не выбран';
    return;
  }

  // Проверка типа файла
  if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
    fileError.value = 'Пожалуйста, выберите PDF файл';
    return;
  }

  // Проверка размера (2 МБ)
  const maxSize = 3 * 1024 * 1024*1024;
  if (file.size > maxSize) {
    fileError.value = `Файл слишком большой (${formatFileSize(file.size)}). Максимальный размер: 3 МБ`;
    return;
  }

  // Сохраняем файл
  pdfFile.value = file;
};

// Очистка файла и выбор нового
const clearFileAndSelectNew = async () => {
  // Сначала очищаем текущий файл
  pdfFile.value = null;
  fileError.value = '';

  // Ждем обновления DOM
  await nextTick();

  // Очищаем значение input и открываем проводник
  if (fileInput.value) {
    fileInput.value.value = ''; // Важно: очищаем предыдущее значение
    fileInput.value.click(); // Открываем проводник
  }
};

// Отправка регистрации
const submitRegistration = () => {
  if (!pdfFile.value) {
    fileError.value = 'Пожалуйста, выберите файл';
    return;
  }

  const registrationData = {
    userName: userName.value,
    email: email.value,
    password: password.value,
    pdfFile: pdfFile.value
  };

  emit('complete', registrationData);
};
</script>
