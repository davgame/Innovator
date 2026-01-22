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
      <label class="block text-gray-600 mb-2">Загрузите PDF</label>
      <div
        class="w-full h-62 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-colors duration-200"
        :class="isDragging ? 'bg-blue-100 border-blue-500' : 'border-gray-300 bg-white'"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="handleDrop"
      >
        <div class="w-full h-full flex flex-col items-center justify-center">
          <img src="/src/assets/images/document_pdf.svg" class="w-auto" />
          <p class="text-[#999999] mt-3 text-center">
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
            class="px-4 mt-2 text-[#4286F7] underline rounded-xl cursor-pointer"
            @click="$refs.fileInput.click()"
          >
            Выбрать файл
          </p>
        </div>
      </div>

      <div v-if="pdfFile" class="mt-4 text-gray-700">
        Выбран файл: {{ pdfFile.name }}
      </div>



      <button
          type="button"
          class="w-full py-4 mt-8 rounded-2xl bg-blue-500 text-white text-lg font-semibold
              hover:bg-blue-600 transition cursor-pointer"
          @click="submitRegistration"
        >
          Создать аккаунт
        </button>

      <button
        type="button"
        class="w-full py-4 mt-6 rounded-2xl border-1 border-[#010101]/23 text-[#010101] text-lg font-semibold
              transition cursor-pointer"
        @click="step = 1"
      >
        Назад
      </button>


      </div>
    </div>

</template>

<script setup>
import { ref } from "vue";

const step = ref(1); // текущий шаг регистрации
const userName = ref('');
const email = ref('');
const password = ref('');
const showPassword = ref(false);
const isDragging = ref(false);
const pdfFile = ref(null);

const nextStep = () => {
  if (!userName.value || !email.value || !password.value) {
    alert("Пожалуйста, заполните все поля");
    return;
  }
  step.value = 2;
};

const handleDrop = (event) => {
  isDragging.value = false;
  const file = event.dataTransfer.files[0];
  if (file && file.type === "application/pdf") {
    pdfFile.value = file;
  } else {
    alert("Можно загружать только PDF файлы");
  }
};

const handleFileSelect = (event) => {
  const file = event.target.files[0];
  if (file && file.type === "application/pdf") {
    pdfFile.value = file;
  } else {
    alert("Можно загружать только PDF файлы");
  }
};

const submitRegistration = () => {
  if (!pdfFile.value) {
    alert("Выберите PDF файл");
    return;
  }
  // Здесь можно отправить данные на сервер
  console.log({
    userName: userName.value,
    email: email.value,
    password: password.value,
    pdfFile: pdfFile.value
  });
  alert("Регистрация завершена!");
};
</script>
