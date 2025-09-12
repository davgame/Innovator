<template>
  <div class="grid grid-cols-2 min-h-screen">
    <!-- Левая колонка: слайдер -->
    <div>
      <Slider/>
    </div>
    <!-- Правая колонка: логотип -->
    <div class="flex flex-col items-center justify-center bg-white mb-[405px] mr-[12px]">
      <img
        src="/images/logo.svg"
        alt="Логотип"
        class=""
      />

      <form class="w-full max-w-sm ml-[130px] mt-[100px]">
        <label
          for="email"
          class="block mb-2 text-[#434D55] font-medium text-sm dark:text-white"
        >
          Полное имя
        </label>
        <input
          type="email"
          id="email"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="name@flowbite.com"
          required
        />
      </form>
    </div>
  </div>
</template>

<script>
import Slider from './SliderR.vue';

export default {
  components: {
    Slider
  }
}
</script>
