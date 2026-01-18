<template>
  <Header/>
  <div class="lg:block hidden bg-cover bg-center bg-no-repeat lg:py-12 py-3 bg-[url('/src/assets/images/Contact.png')] lg:w-auto w-30px h-auto"
  >
    <!-- Контент с текстом слева -->
    <div class="relative z-0 h-full flex items-center">
      <div class="container mx-auto px-6 py-35">
        <div class="max-w-xl">
          <h1 class="text-4xl lg:text-7xl font-bold text-white lg:mb-1 mb-2 leading-tight">Контакты</h1>
          <p class="text-[17px] text-white/90 py-1">Проекты на которые откликнулось ваше сердце</p>
        </div>
      </div>
    </div>
  </div>
  <!-- Контент с текстом слева -->
    <div class="lg:hidden block relative z-0 h-full items-center">
      <div class="container mx-auto px-6 pt-22">
        <div class="max-w-xl">
          <h1 class="text-[45px] md:text-7xl font-bold text-[#308AED] mb-12 leading-tight">КОНТАКТЫ</h1>
        </div>
      </div>
    </div>
  <div class="container mx-auto px-6 lg:py-35 py-3">
    <div class="flex flex-col lg:flex-row gap-12">
      <!-- Левая колонка (30%) -->
      <div class="lg:w-1/3 lg:block hidden">
        <div class="w-45 h-45 border-2 rounded-[25px] border-[#4286F7] bg-transparent flex items-center justify-center">
          <img class="w-30 h-30 rounded-[3px] py-1" src="/src/assets/images/QR.png" alt="">
        </div>
        <div class="text-left mt-4">
          <h1 class="text-[38px] font-rubik text-[#4286F7] font-bold">Инноваторы</h1>
          <p class="text-[20px] mt-[-4px] font-rubik text-[#4286F7] font-medium">Краснодар</p>
        </div>
        <div class="flex space-x-7 mt-18">
            <a href="#" target="_blank">
              <img src="/src/assets/images/vk1.png" alt="VK" class="w-10 h-10"/>
            </a>
            <a href="#" target="_blank">
              <img src="/src/assets/images/tg1.png" alt="Telegram" class="w-10 h-10"/>
            </a>
            <a href="#" target="_blank">
              <img src="/src/assets/images/whatsApp1.png" alt="whatsApp" class="w-10 h-10"/>
            </a>
          </div>
      </div>
      <!-- Правая часть -->
      <div class="lg:w-2/3">
        <div class="max-w-5xl">
          <h1 class="lg:text-[62px] text-[22px] text-[#4A8AF7] font-normal my-[-15px] mb-3" style="font-family: 'Roboto', sans-serif;">45.0323232. ///.38.981664</h1>
        </div>
        <p class="lg:text-[20px] text-[12px] text-[#838383] font-medium mb-3" style="font-family: 'Roboto', sans-serif;">
          КУБАНСКИЙ ТЕХНОЛОГИЧЕСКИЙ ПОЛИТЕХ <br>
          MVP 2512355780 <br>
          КРАСНАЯ УЛИЦА, 135 <br> ЦЕНТРАЛЬНЫЙ ВНУТРИГОРОДСКОЙ ОКРУГ, КРАСНОДАР
        </p>
        <h2 class="lg:text-[55px] text-[32px] text-[#4A8AF7] font-normal" style="font-family: 'Roboto', sans-serif;">350015</h2>
        <p class="lg:text-[32px] text-[22px] text-[#393839] font-medium lg:mt-11 mt-6 hover:text-[#4A8AF7] cursor-pointer" style="font-family: 'Roboto', sans-serif;">
          +791847-49-84
        </p>
        <p class="lg:text-[32px] text-[22px] text-[#393839] font-medium lg:mt-2 mt-1 hover:text-[#4A8AF7] cursor-pointer" style="font-family: 'Roboto', sans-serif;">
          tech@Kuban.University
        </p>
      </div>
      <!-- Левая колонка (30%) -->
      <div class="lg:w-1/3 lg:hidden block">
        <div class="w-30 h-30 border-2 rounded-[25px]  border-[#4286F7] bg-transparent flex items-center justify-center">
          <img class="w-20 h-20 rounded-[3px] lg:py-1" src="/src/assets/images/QR.png" alt="">
        </div>
        <div class="text-left lg:mt-4 mt-4">
          <h1 class="lg:text-[38px] text-[28px] font-rubik text-[#4286F7] font-bold">Инноваторы</h1>
          <p class="text-[20px] mt-[-4px] font-rubik text-[#4286F7] font-medium">Краснодар</p>
        </div>
        <div class="flex space-x-7 lg:mt-18 mt-10 mb-18">
            <a href="#" target="_blank">
              <img src="/src/assets/images/vk1.png" alt="VK" class="w-10 h-10"/>
            </a>
            <a href="#" target="_blank">
              <img src="/src/assets/images/tg1.png" alt="Telegram" class="w-10 h-10"/>
            </a>
            <a href="#" target="_blank">
              <img src="/src/assets/images/whatsApp1.png" alt="whatsApp" class="w-10 h-10"/>
            </a>
          </div>
      </div>
    </div>
  </div>
    <Footer/>
</template>

<script>
import Footer from '../Home/Footer.vue';
import Header from '../Home/Header.vue';

export default {
  components: { Footer, Header },  // регистрация
  data() {
    return { /* данные */ }
  },
  data() {
    return {
      openIndex: null,
    }
  },
  methods: {
    toggleAccordion(index) {
      if (this.openIndex === index) {
        this.openIndex = null
      } else {
        this.openIndex = index
      }
    },
  },
}
</script>
