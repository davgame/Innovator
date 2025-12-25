<template>
  <!-- Второй блок с синим фоном -->
  <section class="relative bg-[#3B82F6] lg:h-[1400px] h-[1950px] -mt-[800px] z-0 flex flex-col items-start justify-start pt-[180px] px-6 lg:px-[137px]">
    <h2 class="text-white lg:text-[60px] text-[30px] font-bold lg:mt-5 mt-1">Активные кейсы</h2>

   <!--Первая карточка-->
  <div class="flex flex-wrap justify-center items-center mt-14 gap-1 w-full">
    <div class="card lg:w-96 w-78 bg-white rounded-[25px] shadow-xl p-4 mx-auto max-w-sm">

    <!-- Изображение VR-гарнитуры -->
    <div class="bg-[#E9F2FF] rounded-[20px] text-[#4286F7] lg:px-16 px-18 lg:py-6 py-4 mb-6 relative">
          <!-- Метка "СНО КУБГТУ" -->
      <div class="tag bg-[#D4E6FF] text-[#3A3A3A] text-[12px] ml-2 px-7 py-1 rounded-full mt-[-4px] lg:mt-[-9px] absolute lg:right-4 right-3">СНО КУБГТУ</div>
      <img src="/src/assets/images/VR.png" alt="VR-гарнитура" class="py-2 lg:w-[230px] lg:h-[150px] w-[170px] h-[110px] rounded-t-lg mt-12 mb-4 mx-auto block">
    </div>
    <!-- Заголовок "Проект" -->
    <h1 class="title text-3xl font-bold mb-5 ml-2">Проект</h1>

    <!-- Теги категорий -->
    <div class="tags flex space-x-2 mb-4 ml-2">
      <span class="tag-item border border-blue-500 text-[#4286F7] lg:px-4 px-2 lg:py-1 py-[3px] rounded-full lg:text-[17px] sm:text-[11px]">бизнес</span>
      <span class="tag-item border border-blue-500 text-[#4286F7] lg:px-4 px-2 lg:py-1 py-[3px] rounded-full lg:text-[17px] sm:text-[11px]">web-сервис</span>
      <span class="tag-item border border-blue-500 text-[#4286F7] lg:px-4 px-2 lg:py-1 py-[3px] rounded-full lg:text-[17px] sm:text-[9px]">develop</span>
    </div>

    <!-- Описание проекта -->
    <p class="description text-gray-700 mb-2 lg:text-[14px] text-[12px] ml-2">
      The website showcases both bright and muted <br> colors. A square pattern that reminds of the excel <br> cells, and data is associated with rounded shapes for the product.
    </p>

    <!-- Кнопка "Подробнее" -->
    <button class="btn-more bg-blue-500 hover:bg-blue-700 text-white font-medium py-4 lg:px-31 px-22 rounded-[18px] mt-4 m-2">
      Подробнее
    </button>

    <!-- Линия -->
    <div class="container mx-auto">
      <div class="w-full h-[1px] bg-[#000000]/10 my-1 max-w-[calc(100%-20px)] lg:max-w-[calc(100%-1rem)] mx-auto mt-[22px]"></div>
    </div>
    <!-- Блок с лайками и просмотрами -->
    <div class="relative stats flex justify-between mt-4 mb-[5x] ml-2">
      <span class="like flex items-center space-x-2 text-gray-700">
        <i class="fi-rr-heart text-[28px] text-[#3A3A3A]"></i>
        <span class="font-medium text-[22px] ml-[2px] mb-[5px]">23</span>
      </span>
      <span class="views flex items-center space-x-2 text-gray-700 absolute left-[92px]">
        <i class="fi fi-rs-eye text-[28px] text-[#3A3A3A]"></i>
        <span class="font-medium text-[22px] ml-[2px] mb-[5px]">456</span>
      </span>
    </div>
  </div>

  <!--Вторая карточка-->
  <div class="card lg:w-96 w-78 bg-white rounded-[25px] shadow-xl p-4 mx-auto max-w-sm mt-27 sm:mt-0">

    <!-- Изображение VR-гарнитуры -->
    <div class="bg-[#E9F2FF] rounded-[20px] text-[#4286F7] lg:px-20 px-15 lg:py-4 py-3 mb-6 relative items-center justify-center">
          <!-- Метка "СНО КУБГТУ" -->
      <div class="tag bg-[#D4E6FF] text-[#3A3A3A] text-[12px] ml-2 px-7 py-1 rounded-full mt-[-4px] lg:mt-[-9px] absolute lg:right-4 right-3">СНО КУБГТУ</div>
      <img src="/src/assets/images/Game.png" alt="VR-гарнитура" class="py-2 w-[220px] rounded-t-lg mt-12 mb-4 h-[170px] mx-auto block">
    </div>
    <!-- Заголовок "Проект" -->
    <h1 class="title text-3xl font-bold mb-5 ml-2">Проект</h1>

    <!-- Теги категорий -->
    <div class="tags flex space-x-2 mb-4 ml-2">
      <span class="tag-item border border-blue-500 text-[#4286F7] lg:px-4 px-2 lg:py-1 py-[3px] rounded-full lg:text-[17px] sm:text-[11px]">бизнес</span>
      <span class="tag-item border border-blue-500 text-[#4286F7] lg:px-4 px-2 lg:py-1 py-[3px] rounded-full lg:text-[17px] sm:text-[11px]">web-сервис</span>
      <span class="tag-item border border-blue-500 text-[#4286F7] lg:px-4 px-2 lg:py-1 py-[3px] rounded-full lg:text-[17px] sm:text-[9px]">develop</span>
    </div>

    <!-- Описание проекта -->
    <p class="description text-gray-700 mb-2 lg:text-[14px] text-[12px] ml-2">
      The website showcases both bright and muted <br> colors. A square pattern that reminds of the excel <br> cells, and data is associated with rounded shapes for the product.
    </p>

    <!-- Кнопка "Подробнее" -->
    <button class="btn-more bg-blue-500 hover:bg-blue-700 text-white font-medium py-4 lg:px-31 px-22 rounded-[18px] mt-4 m-2">
      Подробнее
    </button>

    <!-- Линия -->
    <div class="container mx-auto">
      <div class="w-full h-[1px] bg-[#000000]/10 my-1 max-w-[calc(100%-20px)] lg:max-w-[calc(100%-1rem)] mx-auto mt-[22px]"></div>
    </div>
    <!-- Блок с лайками и просмотрами -->
    <div class="relative stats flex justify-between mt-4 mb-[5x] ml-2">
      <span class="like flex items-center space-x-2 text-gray-700">
        <i class="fi-rr-heart text-[28px] text-[#3A3A3A]"></i>
        <span class="font-medium text-[22px] ml-[2px] mb-[5px]">23</span>
      </span>
      <span class="views flex items-center space-x-2 text-gray-700 absolute left-[92px]">
        <i class="fi fi-rs-eye text-[28px] text-[#3A3A3A]"></i>
        <span class="font-medium text-[22px] ml-[2px] mb-[5px]">456</span>
      </span>
    </div>
  </div>
</div>
<div class="flex justify-center items-center transition h-screen w-full lg:mt-7">
  <button class="desktop-button bg-white px-15 py-[22px] rounded-full font-rubik font-medium text-[20px] text-[#338AEF]">Смотреть еще</button>
</div>
  </section>
</template>
