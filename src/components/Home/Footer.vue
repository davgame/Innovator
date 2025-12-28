<template>
  <footer
    class="bg-gradient-to-r from-[#4286F7] via-[#4286F7] to-[#2F8AEC] text-white"
  >
    <div class="max-w-7xl mx-auto px-6 lg:px-16 py-20">

      <!-- GRID: логотип + 3 колонки -->
      <div class="grid grid-cols-1 lg:grid-cols-[320px_1fr_1fr_1fr] gap-16 items-start">

        <!-- ЛОГО + КОПИРАЙТ -->
        <div>
          <div class="flex items-start gap-3 mb-8">
            <!--Логотип-->
        <div href="#" class="flex items-sart space-x-3 w-1/2">
          <img src="/src/assets/images/Logo_menu2.png" alt="Innova" class="w-[42px] h-auto" />
          <div class="text-left">
            <h1 class="text-[17px] font-rubik text-white font-bold">Инноваторы</h1>
            <p class="text-[13px] mt-[-4px] font-rubik text-white font-medium">Краснодар</p>
          </div>
        </div>
          </div>

          <p class="text-sm opacity-80 mb-2">
            Политика конфиденциальности
          </p>
          <p class="text-sm opacity-80">
            © 2023–2026 СНО КУбГТУ
          </p>
        </div>

        <!-- СТРАНИЦЫ -->
        <div>
          <h3 class="uppercase font-bold tracking-wider mb-6 lg:text-[20px] text-[20px]">
            Страницы
          </h3>
          <nav class="flex flex-col gap-3 text-[20px]">
            <a href="#" class="hover:text-[#FFBA26] transition">Главная</a>
            <a href="#" class="hover:text-[#FFBA26] transition">Поиск</a>
            <a href="#" class="hover:text-[#FFBA26] transition">Отклики</a>
            <a href="#" class="hover:text-[#FFBA26] transition">FAQ</a>
            <a href="#" class="hover:text-[#FFBA26] transition">Контакты</a>
          </nav>
        </div>

        <!-- КОНТАКТЫ -->
        <div>
          <h3 class="uppercase font-bold tracking-wider mb-6 lg:text-[20px] text-[20px]">
            Контакты
          </h3>

          <div class="flex gap-6 mb-6">
            <a href="#" target="_blank">
              <img src="/src/assets/images/vk.png" alt="VK" class="w-10 h-10"/>
            </a>
            <a href="#" target="_blank">
              <img src="/src/assets/images/tg.png" alt="Telegram" class="w-10 h-10"/>
            </a>
            <a href="#" target="_blank">
              <img src="/src/assets/images/whatsApp.png" alt="whatsApp" class="w-10 h-10" />
            </a>
          </div>

          <p class="text-[16px] opacity-90 leading-snug">
            Адрес: Ул. Красная 135,<br />
            Краснодар
          </p>
        </div>

        <!-- ПАРТНЕРЫ -->
        <div>
          <h3 class="uppercase font-bold tracking-wider mb-6 lg:text-[20px] text-[20px]">
            Партнеры
          </h3>

          <div class="flex gap-4 items-start">
            <div>
              <img src="/src/assets/images/ФОНД.png" alt="Innova" class="w-[150px] h-auto" />
            </div>
          </div>
        </div>

      </div>

      <!-- ЛИНИЯ -->
      <div class="mt-18 h-px bg-white/40"></div>
    </div>
  </footer>
</template>
