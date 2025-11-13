<template>
  <!-- Центрирование бейджа на странице -->
  <div class="flex flex-col justify-center items-center my-170 sm:my-180 lg:my-165">
    <!-- Контейнер с градиентной рамкой -->
    <div
      class="p-[1.5px] rounded-full bg-gradient-to-r from-sky-400 via-indigo-500 to-fuchsia-500 animate-gradient w-fit mx-auto mt-[-600px] lg:mx-[130px] lg:mt-[-530px]"
    >
      <!-- Основное содержимое -->
      <div
        class="flex items-center bg-white rounded-full px-4 sm:px-4 py-2 sm:py-2.5 space-x-3 max-[340px]:px-3"
      >
        <!-- Аватарки -->
        <div class="flex -space-x-2 sm:-space-x-3 max-[340px]:hidden">
          <img
            class="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-white object-cover"
            src="https://randomuser.me/api/portraits/men/1.jpg"
            alt=""
          />
          <img
            class="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-white object-cover"
            src="https://randomuser.me/api/portraits/women/2.jpg"
            alt=""
          />
          <img
            class="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-white object-cover"
            src="https://randomuser.me/api/portraits/men/3.jpg"
            alt=""
          />
          <img
            class="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-white object-cover"
            src="https://randomuser.me/api/portraits/men/4.jpg"
            alt=""
          />
        </div>

        <!-- Текст -->
        <span
          class="text-gray-800 ml-[-3px] max-[340px]:ml-[0] max-[340px]:text-[14px] max-[340px]:px-3 sm:ml-[2px] text-[13px] sm:text-base font-medium whitespace-nowrap"
        >
          Больше +100 пользователей
        </span>
      </div>
    </div>

    <div class="text-center leading-tight antialiased flex justify-center items-center">
      <div class="flex items-center">
        <h1
          class="text-[25px] max-[340px]:text-[20px] xs:text-[30px] sm:text-[40px] lg:text-[73px] mt-[22px] font-roboto text-[#2B2B2B] font-[650] tracking-[0.1px] my-4"
        >
          Развиваем студенческую <br />
          науку Кубани
        </h1>
      </div>
      <div>
        <img
          src="/src/assets/images/zvezda.png"
          alt="Innova"
          class="max-[380px]:hidden w-[20px] lg:w-[42px] h-auto mb-14 lg:mb-45"
        />
      </div>
    </div>
    <div class="mt-3 lg:mt-6">
      <!-- Отступ от текста -->
      <button
        class="flex items-center px-5 py-1 lg:px-12 lg:py-2 border-2 border-blue-500 rounded-full text-blue-500 hover:bg-blue-50 transition"
      >
        <div
          class="w-11 h-11 lg:w-15 lg:h-15 bg-blue-500 text-white rounded-full flex items-center justify-center ml-[-15px] lg:ml-[-40px]"
        >
            <div class="w-12 h-12 rounded-5xl flex items-center justify-center">
              <img src="/src/assets/images/plus.png" class="w-[22px] h-auto">
            </div>
        </div>
        <span class="font-rubik font-[590] text-[20px] lg:text-[25px] ml-4 lg:ml-6">Новый проект</span>
      </button>
    </div>
    <div class="flex justify-center items-center relative">
      <!-- Синий фон -->
      <!-- Основной контейнер с фоном -->
      <div class="relative w-full">
        <!-- Изображение -->
        <img src="/src/assets/images/SUP.png" class="sm:w-[700px] lg:w-[1150px] h-auto sm:mt-26 lg:mt-35 hidden sm:block relative z-10">
        <img src="/src/assets/images/SUP_mobile.svg" alt="" class="w-[250px] h-auto mt-20 block sm:hidden md:hidden lg:hidden relative z-10">

      </div>
    </div>
  </div>
</template>
