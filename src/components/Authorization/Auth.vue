<template>
      <!-- Email -->
      <label class="block text-gray-600 mb-2">Email</label>
      <div class="relative " :class="{ 'mb-12': emailError, 'mb-6': !emailError }">
        <span class="absolute inset-y-0 left-4 flex items-center text-gray-400">
          <img src="/src/assets/images/Messenger.svg" alt="Innova" class="w-auto h-auto"/>
        </span>
        <input
          v-model="email"
          type="email"
          placeholder="Kervis@gmail.com"
          class="w-full pl-13 pr-4 py-4 rounded-2xl border border-gray-300
                 focus:outline-none focus:ring-2 focus:ring-blue-500"
          :class="[
            emailError
              ? 'border-red-500 focus:ring-red-200'
              : 'border-gray-300 focus:ring-blue-500'
          ]"
          @input="validateEmail"
        />
        <div v-if="emailError" class="absolute left-0" :style="{ top: 'calc(100% + 4px)' }">
          <p class="text-red-500 text-sm">{{ emailError }}</p>
        </div>
      </div>

      <!-- Password -->
      <label class="block text-gray-600 mb-2">Пароль</label>
      <div class="relative" style="min-height: 3px;" :class="{ 'mb-12': passwordError || serverError, 'mb-6': !(passwordError || serverError) }">
        <span class="absolute inset-y-0 left-4 flex items-center text-gray-400">
          <img src="/src/assets/images/Password.svg" alt="Innova" class="w-auto h-auto"/>
        </span>
        <input
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="**********"
          class="w-full pl-12 pr-13 py-4 rounded-2xl border border-gray-300
                 focus:outline-none focus:ring-2 focus:ring-blue-500"
          :class="[
            passwordError
              ? 'border-red-500 focus:ring-red-200'
              : 'border-gray-300 focus:ring-blue-500'
          ]"
          @input="validatePassword"
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
        <div v-if="passwordError" class="absolute left-0" :style="{ top: 'calc(100% + 4px)' }">
          <p class="text-red-500 text-sm">{{ passwordError }}</p>
        </div>
        <!-- Сообщение от сервера (неверный пароль) -->
      <div v-else-if="serverError" class="absolute left-0" :style="{ top: 'calc(100% + 4px)' }">
        <p class="text-red-500 text-sm">{{ serverError }}</p>
      </div>
      </div>

      <!-- Forgot -->
      <div class="mt-2 mb-4">
        <a class="text-blue-500 font-medium hover:underline cursor-pointer">
          Забыли пароль ?
        </a>
      </div>

      <!-- Кнопка входа -->
      <button
        @click="handleLogin"
        :disabled="isLoading"
        class="w-full py-4 mt-6 rounded-2xl bg-blue-500 text-white text-lg font-semibold
         hover:bg-blue-600 transition cursor-pointer"
      >
        {{ isLoading  ? 'Вход...' : 'Войти' }}
      </button>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// 1. Сначала объявляем ВСЕ переменные
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')
const router = useRouter()
// 👇 Объявляем переменные для ошибок
const emailError = ref('')
const passwordError = ref('')  // 👈 добавить эту строку
const serverError = ref('')  // 👈 ошибка от сервера
// 2. ПОТОМ получаем store
const authStore = useAuthStore()

// 3. Теперь можно использовать authStore в функциях
const handleLogin = async () => {
  if (!authStore) {
    errorMessage.value = 'Ошибка инициализации'
    return
  }

  errorMessage.value = ''
  isLoading.value = true

  try {
    const { error } = await authStore.signIn(
      email.value,
      password.value
    )
    if (error) {
      // 👇 Обработка ошибки от сервера
      if (error.message === 'Invalid login credentials') {
        serverError.value = 'Неверный email или пароль'
      } else {
        serverError.value = error.message
      }
    } else {
      router.push('/')
    }
  } catch (err) {
    errorMessage.value = 'Произошла ошибка'
  } finally {
    isLoading.value = false
  }
}

// Валидация email
const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email.value) {
    emailError.value = ''
  } else if (!emailRegex.test(email.value)) {
    emailError.value = 'Введите корректный email'
  } else {
    emailError.value = ''
  }
}

// Валидация пароля
const validatePassword = () => {
  if (!password.value) {
    passwordError.value = ''
  } else if (password.value.length < 6) {
    passwordError.value = 'Пароль должен содержать минимум 6 символов'
  } else {
    passwordError.value = ''
  }
}


</script>

<style scoped>
/* Гарантируем, что html и body занимают всю высоту */
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
}
</style>
