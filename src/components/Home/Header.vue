<template v-if="authStore.profile">
  <nav class="border-gray-200 bg-[#FFFFFF]">
    <div class="flex fixed top-0 left-0 w-full bg-white shadow-2xs z-50 items-center justify-between px-6 py-4 sm:px-6 md:px-[100px] lg:px-[80px]">
      <!--Логотип-->
      <div href="#" class="flex items-start space-x-3 w-1/2">
        <img src="/src/assets/images/Logo_menu1.png" alt="Innova" class="w-[42px] h-auto"/>
        <div class="text-left">
          <h1 class="text-[17px] font-rubik text-black font-bold">Инноваторы</h1>
          <p class="text-[13px] mt-[-4px] font-rubik text-black font-medium">Краснодар</p>
        </div>
      </div>
        <!-- 🔍 ПОИСК (всегда виден, по центру) -->
      <div class="flex items-center lg:gap-4">
        <SearchUsers />

        <RouterLink
          v-if="authStore.profile"
          to="/profile"
          class="flex items-center gap-2"
          @click="isOpen = false"
        >
          <!-- Если есть avatar_url - показываем изображение -->
          <img
            v-if="authStore.profile?.avatar_url"
            :src="authStore.profile.avatar_url + '?v=' + avatarVersion"
            class="lg:block hidden w-[42px] h-[42px] rounded-full object-cover"
            alt="Avatar"
          />
          <!-- Если нет аватара - показываем картинку-эмодзи в синем круге -->
          <div
            v-else
            class="lg:flex hidden w-[42px] h-[42px] rounded-full bg-[#CFD9FF] items-center justify-center"
          >
            <img
              src="/src/assets/images/Emodzi.svg"
              class="w-[30px] h-[30px] object-contain"
              alt="Default avatar"
            />
          </div>

        </RouterLink>
          <!-- Если нет профиля - показываем кнопки -->
        <template v-else>
          <RouterLink
            to="/authorization?tab=auth"
            @click="isOpen = false"
            class="desktop-button mr-[3px] text-black focus:ring-4 focus:ring-blue-300 font-rubik font-medium rounded-[10px] border-1 text-sm px-[35px] py-2.5 focus:outline-none border-[#9A9A9A]/20 hover:bg-gray-100"
          >
            Войти
          </RouterLink>
          <RouterLink
            to="/register?tab=register"
            class="desktop-button mr-[15px] text-white bg-[#4286F7] hover:bg-[#222222] focus:ring-4 focus:ring-blue-300 font-rubik border-[#9A9A9A]/20 font-medium rounded-[10px] text-sm px-5 py-2.5 focus:outline-none"
          >
            Регистрация
          </RouterLink>
        </template>
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
    </div>
    <!-- Добавляем отступ, чтобы контент не перекрывался меню -->
    <div class="pt-[45px]">
      <!-- Здесь основной контент страницы -->
    </div>



    <!-- FULLSCREEN МЕНЮ -->
    <Transition name="slide-menu">

    <div v-show="isOpen" class="fixed inset-0 bg-[#4286F7] text-white flex flex-col transition-all duration-300 z-50">
      <div class="flex items-center justify-between px-6 py-4 sm:px-6 md:px-[100px] lg:px-[80px] no-scrollbar">

        <!--Логотип-->
        <div href="#" class="flex items-sart space-x-3 w-1/2">
          <img src="/src/assets/images/Logo_menu2.png" alt="Innova" class="w-[42px] h-auto" />
          <div class="text-left">
            <h1 class="text-[17px] font-rubik text-white font-bold">Инноваторы</h1>
            <p class="text-[13px] mt-[-4px] font-rubik text-white font-medium">Краснодар</p>
          </div>
        </div>
        <!-- Правая часть: поиск + аватар + кнопка закрытия -->
      <div class="flex items-center gap-4 ml-auto px-4">

         <!-- Аватар -->
        <RouterLink
          v-if="authStore.profile"
          :to="{ name: 'MyProfile' }"
          @click="isOpen = false">

          <img
            v-if="authStore.profile?.avatar_url"
            :src="authStore.profile.avatar_url + '?v=' + avatarVersion"
            class="w-[42px] h-[42px] rounded-full object-cover border-2 border-white"
            alt="Avatar"
          />
          <!-- Если нет аватара - показываем картинку-эмодзи в синем круге -->
          <div
            v-else
            class="lg:flex w-[42px] h-[42px] rounded-full bg-[#CFD9FF] flex items-center justify-center"
          >
            <img
              src="/src/assets/images/Emodzi.svg"
              class="lg:w-[30px] lg:h-[30px] w-[26px] h-[26px] object-contain"
              alt="Default avatar"
            />
          </div>
          </RouterLink>

          <template v-else>
            <RouterLink
              to="/authorization?tab=auth"
              @click="isOpen = false"
              class="desktop-button mr-[3px] text-white focus:ring-4 focus:ring-blue-300 font-rubik font-medium rounded-[10px] border-1 text-sm px-[35px] py-2.5 focus:outline-none border-white"
            >
              Войти
            </RouterLink>
            <RouterLink
              to="/authorization?tab=register"
              @click="isOpen = false"
              class="desktop-button mr-[15px] text-[#4286F7] bg-white focus:ring-4 focus:ring-blue-300 font-rubik font-medium rounded-[10px] text-sm px-5 py-2.5 focus:outline-none"
            >
              Регистрация
            </RouterLink>
          </template>
        </div>

        <button
          @click="isOpen = false"
          class="cursor-pointer w-10 h-10 grid place-items-center border border-white rounded-lg text-white"
        >
          <span class="text-3xl leading-none py-[2px] mb-[4px]">×</span>
        </button>
      </div>

      <div class="container mx-auto">
        <div class="w-full h-[1px]  bg-gray-100 my-1 max-w-[calc(100%-3rem)] lg:max-w-[calc(100%-1rem)] mx-auto"></div>
      </div>
      <!--Инноваторы продукт СНО-->
      <div class="flex items-start justify-start m-2 flex-1 sm:flex-none sm:justify-start sm:pl-4">
        <div
          class="hidden lg:inline-block h-full flex-col justify-between w-full md:ml-[87px] sm:ml-4 sm:mt-4 md:mt-[250px]"
        >
          <h1
            class="md:transform md:rotate-90 md:text-[80px] lg:text-[100px] text-left lg:transform lg:rotate-0 font-bold text-[#9CB8FF]"
          >
            Инноваторы
          </h1>
          <p
            class="md:rotate-90 md:text-[18px] md:mr-[72px] lg:text-[32px] text-left lg:transform lg:rotate-0 font-regular mt-[-8px] text-[#9CB8FF] whitespace-nowrap"
          >
            Продукт СНО КУбГТУ
          </p>
          <div class="flex space-x-8 mt-36">
            <a href="#" target="_blank">
              <img src="/src/assets/images/vk.png" alt="VK" class="w-12 h-12" />
            </a>
            <a href="#" target="_blank">
              <img src="/src/assets/images/tg.png" alt="Telegram" class="w-12 h-12" />
            </a>
            <a href="#" target="_blank">
              <img src="/src/assets/images/whatsapp.png" alt="whatsapp" class="w-12 h-12" />
            </a>
          </div>
        </div>

        <!-- Навигация по центру -->
        <nav class="flex flex-col justify-start items-start w-full pl-12 pr-4 text-[55px] md:text-[55px] md:pr-[35px] lg:text-[85px] lg:mr-[30px] lg:max-w-none"
        >
          <router-link
            to="/"
            click.prevent="goToPage('/')"
            class="hover:text-[#FFBA26] ml-auto mb-2"
          >
            главная
          </router-link>
          <a href="#" @click="isOpen = false" class="hover:text-[#FFBA26] ml-auto mb-2">канбан</a>
          <a href="#" @click="isOpen = false" class="hover:text-[#FFBA26] ml-auto mb-2">отклики</a>
          <router-link to="/faq" @click="isOpen = false" class="hover:text-[#FFBA26] ml-auto mb-2">faq</router-link>
          <router-link to="/contact" @click="isOpen = false" class="hover:text-[#FFBA26] ml-auto">контакты</router-link>

          <div class="flex justify-end w-full lg:hidden mt-5">
            <a
              href="#"
              class="w-[240px] h-[64px] text-[#4286F7] bg-white focus:ring-4 focus:ring-blue-300 font-medium rounded-[20px] text-center text-[27px] px-5 py-2.5 focus:outline-none"
            >
              Регистрация
            </a>
          </div>
          <div class="flex justify-end w-full space-x-8 mt-10 lg:hidde">
            <a href="#" target="_blank">
              <img src="/src/assets/images/vk.png" alt="VK" class="w-10 h-10 block lg:hidden" />
            </a>
            <a href="#" target="_blank">
              <img
                src="/src/assets/images/tg.png"
                alt="Telegram"
                class="w-10 h-10 block lg:hidden"
              />
            </a>
            <a href="#" target="_blank">
              <img
                src="/src/assets/images/whatsApp.png"
                alt="whatsApp"
                class="w-10 h-10 block lg:hidden"
              />
            </a>
          </div>
        </nav>
      </div>
    </div>
    </Transition>
  </nav>
</template>

<style scoped>
  /* ВЫЕЗД МЕНЮ СПРАВА */
.slide-menu-enter-from {
  transform: translateX(100%);
}

.slide-menu-enter-to {
  transform: translateX(0);
}

.slide-menu-leave-from {
  transform: translateX(0);
}

.slide-menu-leave-to {
  transform: translateX(100%);
}

.slide-menu-enter-active,
.slide-menu-leave-active {
  transition: transform 0.35s ease-in-out;
}

@media (max-width: 1023px) {
  .desktop-button {
    display: none;
  }
}

/* Скрываем скроллбар */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;  /* IE и Edge */
  scrollbar-width: none;      /* Firefox */
}
</style>

<script setup>
import { ref, watch } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import SearchUsers from './SearchUsers.vue'

const authStore = useAuthStore()
const avatarVersion = ref(Date.now()) // 👈 для сброса кэша
const router = useRouter()
const isOpen = ref(false)

// Флаг для предотвращения повторных навигаций
let isNavigating = false

const goToPage = (path) => {
  // Если уже идет навигация - игнорируем
  if (isNavigating) return

  const currentPath = router.currentRoute.value.path

  // Если мы УЖЕ на этой странице - просто закрываем меню
  if (currentPath === path) {
    isOpen.value = false
    return
  }

  // Устанавливаем флаг навигации
  isNavigating = true

  // Сначала закрываем меню (запускаем анимацию)
  isOpen.value = false

  // Ждем завершения анимации закрытия меню
  setTimeout(() => {
    // Переходим на страницу
    router.push(path)

    // Сбрасываем флаг навигации
    isNavigating = false
  }, 350) // 350ms совпадает с длительностью анимации slide-menu
}

// 👇 Следим за изменениями в sessionStorage
watch(() => sessionStorage.getItem('avatarUpdated'), (newVal) => {
  if (newVal) {
    avatarVersion.value = Date.now()
  }
})

// 👇 Следим за изменениями аватара
watch(() => authStore.profile?.avatar_url, (newUrl) => {
  console.log('Avatar URL changed in header:', newUrl)
  if (newUrl) {
    avatarVersion.value = Date.now()
  }
}, { immediate: true })

// 👇 Добавим интервал для проверки (запасной вариант)
setInterval(() => {
  if (authStore.profile?.avatar_url) {
    avatarVersion.value = Date.now()
  }
}, 5000) // Проверка каждые 5 секунд

// Блокировка скролла при открытом меню
watch(isOpen, (value) => {
  document.body.style.overflow = value ? 'hidden' : ''
})

// Закрытие меню при переходе по маршруту
watch(() => router.currentRoute.value, () => {
  if (isOpen.value) {
    isOpen.value = false
  }
})

// 👇 Следим за изменениями аватара
watch(() => authStore.profile?.avatar_url, (newUrl) => {
  console.log('Avatar URL changed in header:', newUrl)
    if (newUrl) {
    avatarVersion.value = Date.now() // 👈 обновляем версию при изменении
  }
}, { immediate: true })

const handleImageError = (e) => {
  console.log('Image failed to load, using fallback')
  e.target.style.display = 'none'
  // Показываем инициалы
}

// 👇 Следим за изменениями профиля
watch(() => authStore.profile, (newProfile) => {
  console.log('Profile changed:', newProfile)
}, { immediate: true })
</script>
