<template>
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

      <!-- Forgot -->
      <div class="lg:mb-6 mb-4">
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

       <p v-if="errorMessage" class="text-red-500 text-sm mt-4">{{ errorMessage  }}</p>
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
      errorMessage.value = error.message
    } else {
      router.push('/')
    }
  } catch (err) {
    errorMessage.value = 'Произошла ошибка'
  } finally {
    isLoading.value = false
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
