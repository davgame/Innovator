        <div class="px-3 lg:mt-0 mt-12 ">
          <!-- Кнопка "Подробнее" -->
        <router-link to="/Pasport" @click="isOpen = false">
        <button @click="modalOpen = true" class="btn-more bg-[#222222] hover:bg-[#4286F7] text-white font-medium lg:mb-25 mb-24 py-4 lg:px-28 px-30 text-[20px] rounded-[18px] lg:fixed bottom-10 left-1/2 transform -translate-x-1/2 z-40 transition-colors duration-300 cursor-pointer">
          Далее
        </button>
        </router-link>
        <!-- Кнопка "Подробнее" -->
        <button @click="$router.back()" class="btn-more border-1 border-[#222222] hover:bg-gray-100 text-[#222222] font-medium lg:mb-3 mb-2 py-4 lg:px-28 px-30 text-[20px] rounded-[18px] lg:fixed bottom-10 left-1/2 transform -translate-x-1/2 z-40 transition-colors duration-300 cursor-pointer">
          Назад
        </button>
        </div>
