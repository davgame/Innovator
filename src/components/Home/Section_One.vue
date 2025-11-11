<template>
<!-- Центрирование бейджа на странице -->
<div class="flex justify-center items-center min-h-screen">
  <!-- Контейнер с градиентной рамкой -->
  <div class="p-[1.5px] rounded-full bg-gradient-to-r from-sky-400 via-indigo-500 to-fuchsia-500 animate-gradient w-fit
              mx-auto mt-[-600px] lg:mx-[130px] lg:mt-[-530px]">
    <!-- Основное содержимое -->
    <div class="flex items-center bg-white rounded-full px-4 sm:px-4 py-2 sm:py-2.5 space-x-3 max-[340px]:px-3">

      <!-- Аватарки -->
      <div class="flex -space-x-2 sm:-space-x-3 max-[340px]:hidden">
        <img class="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-white object-cover" src="https://randomuser.me/api/portraits/men/1.jpg" alt="">
        <img class="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-white object-cover" src="https://randomuser.me/api/portraits/women/2.jpg" alt="">
        <img class="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-white object-cover" src="https://randomuser.me/api/portraits/men/3.jpg" alt="">
        <img class="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-white object-cover" src="https://randomuser.me/api/portraits/men/4.jpg" alt="">
      </div>

      <!-- Текст -->
      <span class="text-gray-800 ml-[-3px] max-[340px]:ml-[0] max-[340px]:text-[14px] max-[340px]:px-3 sm:ml-[2px] text-[13px] sm:text-base font-medium whitespace-nowrap">
        Больше +100 пользователей
      </span>
    </div>
  </div>
</div>

</template>


