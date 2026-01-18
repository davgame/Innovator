<template>
  <div class="min-h-screen flex flex-col lg:flex-row">
  <div class="lg:w-2/3 lg:block hidden p-4">
    <div
      class="relative overflow-hidden ml-0"
      :style="{
        width: '854px',
        height: 'calc(100vh - 32px)', // 100vh минус отступы (p-4 = 16px сверху и снизу)
        maxHeight: '100vh', // Ограничиваем максимальную высоту
        minHeight: '600px', // Минимальная высота
        borderRadius: '23px'
      }"
    >
      <!-- Слайды -->
      <div
        class="flex transition-transform duration-700 h-full"
        :style="{ transform: `translateX(-${currentSlide * 854}px)` }"
      >
        <div
          v-for="(slide, index) in slides"
          :key="index"
          class="flex-shrink-0"
          :style="{
            width: '854px',
            height: '100%' // Занимает всю высоту родителя
          }"
        >
          <img
            :src="slide"
            alt="Slide"
            class="w-full h-full object-cover"
          />
        </div>
      </div>

      <!-- Кружочки -->
      <div class="absolute bottom-7 left-2/13 transform -translate-x-1/2 flex space-x-3">
        <button
          v-for="(_, i) in slides"
          :key="i"
          @click="goToSlide(i)"
          class="w-[58px] h-[8px] ml-[3px] rounded-full transition-all"
          :class="currentSlide === i ? 'bg-[#D9D9D9]/70 scale-110' : 'bg-[#D9D9D9]/30'"
        ></button>
      </div>
    </div>
  </div>
  <!-- Правая часть (1/3) -->   <!-- Форма авторизации -->
  <div class="lg:w-1/3 lg:py-20 py-12 px-4 lg:mr-10">
    <div href="#" class="flex space-x-3 justify-center mx-auto lg:mx-0 lg:justify-start">
        <img src="/src/assets/images/Logo_menu2.svg" alt="Innova" class="w-[55px] h-auto rounded-[12px]"/>
        <div class="text-left">
          <h1 class="text-[25px] font-rubik text-[#4286F7] font-bold">Инноваторы</h1>
          <p class="text-[13px] mt-[-4px] font-rubik text-black font-medium">Краснодар</p>
        </div>
      </div>
      <div class="flex items-start bg-white px-1 lg:py-20 py-15">
    <div class="w-full max-w-md">
      <!-- Tabs -->
      <div class="relative bg-gray-100 rounded-2xl p-1 mb-8 overflow-hidden">
        <!-- Animated background -->
        <div
          class="absolute top-1 left-1 w-[calc(50%-4px)] h-[calc(100%-8px)]
                 bg-white rounded-xl shadow transition-transform duration-300 ease-out"
          :class="{
            'translate-x-0': activeTab === 'login',
            'translate-x-full': activeTab === 'register'
          }"
        ></div>

        <div class="relative flex">
          <button
            class="flex-1 py-3 font-medium z-10 transition-colors cursor-pointer"
            :class="activeTab === 'login'
              ? 'text-gray-900'
              : 'text-gray-500'"
            @click="activeTab = 'login'"
          >
            Авторизация
          </button>

          <button
            class="flex-1 py-3 font-medium z-10 transition-colors cursor-pointer"
            :class="activeTab === 'register'
              ? 'text-gray-900'
              : 'text-gray-500'"
            @click="activeTab = 'register'"
          >
            Регистрация
          </button>
        </div>
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

      <!-- Forgot -->
      <div class="lg:mb-6 mb-4" v-if="activeTab === 'login'">
        <a class="text-blue-500 font-medium hover:underline cursor-pointer">
          Забыли пароль ?
        </a>
      </div>

      <!-- Button -->
      <button
        class="w-full py-4 mt-6 rounded-2xl bg-blue-500 text-white text-lg font-semibold
               hover:bg-blue-600 transition cursor-pointer"
      >
        {{ activeTab === 'login' ? 'Войти' : 'Далее' }}
      </button>
    </div>
  </div>
  </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
const activeTab = ref('login')
const email = ref('')
const password = ref('')
const showPassword = ref(false)

const slides = [
  "/images/slide.jpg",
  "/images/slide.jpg",
  "/images/slide.jpg"
];

const currentSlide = ref(0);
let intervalId = null;

const goToSlide = (index) => {
  currentSlide.value = index;
};

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.length;
};

onMounted(() => {
  intervalId = setInterval(nextSlide, 4000);
});

onBeforeUnmount(() => {
  clearInterval(intervalId);
});
</script>

<style scoped>
/* Гарантируем, что html и body занимают всю высоту */
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
}
</style>
