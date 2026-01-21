  <template>
      <!-- Name -->
      <label class="block text-gray-600 mb-2">Полное имя</label>
      <div class="relative mb-6">
        <span class="absolute inset-y-0 left-4 flex items-center text-gray-400">
          <img src="/src/assets/images/user_1.svg" alt="Innova" class="w-auto h-auto"/>
        </span>
        <input
          v-model="userName"
          type="text"
          @input="saveName"
          @blur="handleBlur"
          @focus="isFieldFocused = true"
          placeholder="Федосьев Георгий"
          class="w-full pl-13 pr-4 py-4 rounded-2xl border border-gray-300
                focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <!-- Кнопка «Очистить» показывается только если userName не пустой -->
        <button
          v-if="userName"
          type="button"
          class="absolute inset-y-0 right-4 text-gray-400 cursor-pointer"
          @click="clearUserName"
          @mousedown.prevent
        >
          <img
            src="/src/assets/images/cross_1.svg"
            alt="Очистить поле"
            class="w-auto h-auto"
          />
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
        <button
          type="button"
          class="absolute inset-y-0 right-4 text-gray-400 cursor-pointer"
          @click="showPassword = !showPassword"
        >
          <!-- Пароль скрыт -->
          <img
            v-if="!showPassword"
            src="/src/assets/images/View-off.svg"
            alt="Скрыть пароль"
            class="w-auto h-auto"
          />
          <!-- Пароль показан -->
          <img
            v-else
            src="/src/assets/images/View.svg"
            alt="Показать пароль"
            class="w-auto h-auto"
          />
        </button>
      </div>

      <!-- Button -->
      <button
        class="w-full py-4 mt-6 rounded-2xl bg-blue-500 text-white text-lg font-semibold
              hover:bg-blue-600 transition cursor-pointer"
      >
        {{ activeTab === 'register' ? 'Далее' : 'Войти' }}
      </button>

  </template>

  <script setup>
  import { ref } from "vue";
  const activeTab = ref('register')
  const userName = ref(''); // инициализируем реактивную переменную
  const email = ref('')
  const password = ref('')
  const showPassword = ref(false)
  const isFieldFocused = ref(false); // отслеживает, сфокусировано ли поле
  const clearUserName = () => {
    userName.value = '';
    // Убираем фокус с кнопки после очистки
    isFieldFocused.value = false;
  };

    const handleBlur = () => {
    // Добавляем небольшую задержку перед скрытием фокуса,
    // чтобы кнопка очистки успела сработать
    setTimeout(() => {
      isFieldFocused.value = false;
    }, 100);
  };

// Пример метода saveName (если нужен)
const saveName = () => {
  // Логика сохранения имени
};
  </script>

  <style scoped>
  /* Гарантируем, что html и body занимают всю высоту */
  html, body {
    margin: 0;
    padding: 0;
    height: 100%;
  }
  </style>
