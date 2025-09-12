<template>
  <nav class="border-gray-200 bg-[#FFFFFF]">
    <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
      <a href="#" class="flex items-center space-x-3 rtl:space-x-reverse">
        <img src="/src/assets/images/Logo.png" alt="Innova" class="w-32 h-auto"/>
      </a>
      <div class="ml-auto flex items-center gap-2">
        <a
          href="#"
          class="desktop-button mr-[3px] text-black focus:ring-4 focus:ring-blue-300 font-medium rounded-[10px] border-1 text-sm px-[35px] py-2.5 focus:outline-none border-[#9A9A9A]/20 hover:bg-gray-100"
        >
          Войти
        </a>
        <a
          href="#"
          class="desktop-button mr-[15px] text-white bg-[#4286F7] hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-[10px] text-sm px-5 py-2.5 focus:outline-none"
        >
          Регистрация
        </a>
      </div>
      <button
        @click="isOpen = !isOpen"
        type="button"
        class="cursor-pointer inline-flex items-center justify-center p-2 w-10 h-10 text-sm text-[#111827] border-1 border-[#9A9A9A]/20 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
        aria-controls="navbar-hamburger"
        aria-expanded="false"
      >
        <span class="sr-only">Open main menu</span>
        <svg
          class="w-5 h-5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 17 14"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M1 1h15M1 7h15M1 13h15"
          />
        </svg>
      </button>
    </div>

    <!-- FULLSCREEN МЕНЮ -->
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-[#4286F7] text-white flex flex-col + flex-1">
      <div class="flex items-center justify-between px-[95px] py-4">
        <a href="#" class="flex items-center space-x-3">
          <img src="/src/assets/images/Logo_menu.png" alt="Innova" class="w-32 h-auto" />
        </a>
        <div class="ml-auto flex gap-2">
          <a
            href="#"
            class="block md:hidden mr-[3px] text-white focus:ring-4 focus:ring-blue-300 font-medium rounded-[10px] border-1 text-sm px-[35px] py-2.5 focus:outline-none border-white hover:bg-gray-100">
            Войти
          </a>
          <a
            href="#"
            class="block md:hidden mr-[15px] text-[#4286F7] bg-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-[10px] text-sm px-5 py-2.5 focus:outline-none"
          >
            Регистрация
          </a>
        </div>
        <button
          @click="isOpen = false"
          class="w-10 h-10 grid place-items-center border border-white rounded-lg text-white">
          <span class="text-3xl leading-none py-[2px] mb-[4px]">×</span>
        </button>
      </div>

      <div class="w-[1240px] ml-[95px] h-[1px] bg-gray-300 my-2"></div>
      <!--Колонки-->
      <div class="flex items-start justify-between m-2 flex-1">
        <div class="text-[#9CB8FF] text-left ml-[95px] flex w-1/2 h-full flex-col justify-center sm:text-[40px]">
          <h1 class="text-[100px] font-bold mb-[-8px]">Инноваторы</h1>
          <p class="text-[32px] font-regular mt-0">Продукт СНО КУбГТУ</p>
        </div>
        <!-- Навигация по центру -->
        <nav
          class="flex flex-col ml-auto justify-evenly text-[85px] pr-[95px] w-1/2">
          <a
            href="#"
            @click="isOpen = false"
            class="hover:text-blue-400 ml-auto mb-2 text-[#FFBA26]"
            >главная
          </a>
          <a href="#" @click="isOpen = false" class="hover:text-[#FFBA26] ml-auto mb-2">поиск</a>
          <a href="#" @click="isOpen = false" class="hover:text-[#FFBA26] ml-auto mb-2">отклики</a>
          <a href="#" @click="isOpen = false" class="hover:text-[#FFBA26] ml-auto mb-2">faq</a>
          <a href="#" @click="isOpen = false" class="hover:text-[#FFBA26] ml-auto">контакты</a>
        </nav>
      </div>
    </div>
  </nav>
</template>

<style scoped>
@media (max-width: 1023px) {
  .desktop-button {
    display: none;
  }
}
</style>

<script setup>
import { ref } from 'vue'

// реактивная переменная для управления меню
const isOpen = ref(false)
</script>
