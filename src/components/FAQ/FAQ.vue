<template>
  <Header/>
  <div
    class="lg:block hidden bg-cover bg-center bg-no-repeat lg:py-12 py-3 bg-[url('/src/assets/images/FAQ_header.png')] lg:w-auto w-30px h-auto"
  >
    <!-- Контент с текстом слева -->
    <div class="relative z-0 h-full flex items-center">
      <div class="container mx-auto px-6 py-35">
        <div class="max-w-xl">
          <h1 class="text-4xl md:text-7xl font-bold text-white lg:mb-3 mb-2 leading-tight">Центр помощи</h1>
          <p class="text-[17px] text-white/90 py-1">Есть вопросы? Мы здесь чтобы помочь</p>
        </div>
      </div>
    </div>
  </div>
  <!-- Контент с текстом слева -->
    <div class="lg:hidden block relative z-0 h-full items-center">
      <div class="container mx-auto px-6 pt-22">
        <div class="max-w-xl">
          <h1 class="text-[42px] md:text-7xl font-bold text-[#308AED] lg:mb-3 leading-tight">Центр помощи</h1>
        </div>
      </div>
    </div>
  <div class="container mx-auto px-6 lg:py-35 py-3">
    <div class="flex flex-col lg:flex-row gap-12">
      <!-- Левая колонка (30%) -->
      <div class="lg:w-1/3">
        <p class="lg:block hidden text-[25px] text-[#308AED] py-1 font-rubik font-semibold tracking-wider">
          Поддержка
        </p>
        <h1 class="lg:block hidden text-5xl md:text-8xl font-rubik font-bold text-[#272727] mb-3 leading-tight">
          FAQ
        </h1>
        <button
          class="lg:block hidden px-10 py-4 border border-[#308AED] text-[#308AED] hover:bg-blue-50 active:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-[18px] transition font-rubik font-semibold text-[18px]"
        >
          Обратная связь
        </button>
      </div>
      <!-- Аккордеон FAQ -->
      <div class="lg:w-2/3">
        <div class="max-w-4xl">
          <!-- Вопрос 1 -->
          <div class="border-b border-gray-300 lg:pb-6 lg:mb-6 pb-4 mb-4">
            <button
              class="faq-question w-full flex justify-between items-center text-left py-4 group"
              @click="toggleAccordion(0)"
            >
              <span
                class="text-[22px] font-rubik font-semibold text-[#272727] group-hover:text-[#308AED] transition-colors"
              >
                Доступен ли бесплатный пробный период?
              </span>
              <span
                class="text-2xl text-[#308AED] ml-4 flex-shrink-0 transition-transform duration-300"
                :class="{ 'rotate-45': openIndex === 0 }"
              >
                {{ openIndex === 0 ? '−' : '+' }}
              </span>
            </button>
            <div
              class="faq-answer overflow-hidden transition-all duration-300"
              :class="{ 'max-h-0': openIndex !== 0, 'max-h-96': openIndex === 0 }"
            >
              <div class="pt-2">
                <p class="text-[18px] text-[#666666] leading-relaxed font-rubik">
                  Да, вы можете попробовать наш сервис поиска работы бесплатно в течение 30 дней.
                  При желании мы также предоставим вам бесплатную персональную 30-минутную
                  консультацию, чтобы помочь вам начать поиск работы как можно быстрее.
                </p>
              </div>
            </div>
          </div>

          <!-- Вопрос 2 -->
          <div class="border-b border-gray-300 lg:pb-6 lg:mb-6 pb-4 mb-4">
            <button
              class="faq-question w-full flex justify-between items-center text-left py-4 group"
              @click="toggleAccordion(1)"
            >
              <span
                class="text-[22px] font-rubik font-semibold text-[#272727] group-hover:text-[#308AED] transition-colors"
              >
                Могу ли я изменить свой план позже?
              </span>
              <span
                class="text-2xl text-[#308AED] ml-4 flex-shrink-0 transition-transform duration-300"
                :class="{ 'rotate-45': openIndex === 1 }"
              >
                {{ openIndex === 1 ? '−' : '+' }}
              </span>
            </button>
            <div
              class="faq-answer overflow-hidden transition-all duration-300"
              :class="{ 'max-h-0': openIndex !== 1, 'max-h-96': openIndex === 1 }"
            >
              <div class="pt-2">
                <p class="text-[18px] text-[#666666] leading-relaxed font-rubik">
                  Да, вы можете изменить свой тарифный план в любой момент через личный кабинет.
                  Изменения вступят в силу с начала следующего платежного периода.
                </p>
              </div>
            </div>
          </div>
          <!-- Вопрос 3 -->
          <div class="border-b border-gray-300 lg:pb-6 lg:mb-6 pb-4 mb-4">
            <button
              class="faq-question w-full flex justify-between items-center text-left py-4 group"
              @click="toggleAccordion(2)"
            >
              <span
                class="text-[22px] font-rubik font-semibold text-[#272727] group-hover:text-[#308AED] transition-colors"
              >
                Какова ваша политика отмены?
              </span>
              <span
                class="text-2xl text-[#308AED] ml-4 flex-shrink-0 transition-transform duration-300"
                :class="{ 'rotate-45': openIndex === 2 }"
              >
                {{ openIndex === 2 ? '−' : '+' }}
              </span>
            </button>
            <div
              class="faq-answer overflow-hidden transition-all duration-300"
              :class="{ 'max-h-0': openIndex !== 2, 'max-h-96': openIndex === 2 }"
            >
              <div class="pt-4">
                <p class="text-[18px] text-[#666666] leading-relaxed font-rubik">
                  Вы можете отменить подписку в любой момент. Доступ будет активен до конца
                  оплаченного периода. Возврат средств производится в соответствии с условиями
                  пользовательского соглашения.
                </p>
              </div>
            </div>
          </div>

          <!-- Вопрос 4 -->
          <div class="border-b border-gray-300 lg:pb-6 lg:mb-6 pb-4 mb-4">
            <button
              class="faq-question w-full flex justify-between items-center text-left py-4 group"
              @click="toggleAccordion(3)"
            >
              <span
                class="text-[22px] font-rubik font-semibold text-[#272727] group-hover:text-[#308AED] transition-colors"
              >
                Как работает выставление счетов?
              </span>
              <span
                class="text-2xl text-[#308AED] ml-4 flex-shrink-0 transition-transform duration-300"
                :class="{ 'rotate-45': openIndex === 3 }"
              >
                {{ openIndex === 3 ? '−' : '+' }}
              </span>
            </button>
            <div
              class="faq-answer overflow-hidden transition-all duration-300"
              :class="{ 'max-h-0': openIndex !== 3, 'max-h-96': openIndex === 3 }"
            >
              <div class="pt-4">
                <p class="text-[18px] text-[#666666] leading-relaxed font-rubik">
                  Счета выставляются ежемесячно или ежегодно в зависимости от выбранного тарифа. Вы
                  получите уведомление по email за 3 дня до следующего платежа.
                </p>
              </div>
            </div>
          </div>

          <!-- Вопрос 5 -->
          <div class="border-b border-gray-300 lg:pb-6 lg:mb-6 pb-4 mb-4">
            <button
              class="faq-question w-full flex justify-between items-center text-left py-4 group"
              @click="toggleAccordion(4)"
            >
              <span
                class="text-[22px] font-rubik font-semibold text-[#272727] group-hover:text-[#308AED] transition-colors"
              >
                Как изменить email моего аккаунта?
              </span>
              <span
                class="text-2xl text-[#308AED] ml-4 flex-shrink-0 transition-transform duration-300"
                :class="{ 'rotate-45': openIndex === 4 }"
              >
                {{ openIndex === 4 ? '−' : '+' }}
              </span>
            </button>
            <div
              class="faq-answer overflow-hidden transition-all duration-300"
              :class="{ 'max-h-0': openIndex !== 4, 'max-h-96':  openIndex === 4 }"
            >
              <div class="pt-4">
                <p class="text-[18px] text-[#666666] leading-relaxed font-rubik">
                  Email можно изменить в настройках профиля в личном кабинете. После изменения мы
                  отправим подтверждение на новый email адрес.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
       <button
          class="lg:hidden block px-10 py-4 mb-18 border border-[#308AED] text-[#308AED] hover:bg-blue-50 active:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-[20px] transition font-rubik font-semibold text-[18px]"
        >
          Обратная связь
        </button>
    </div>
  </div>
    <!-- Я хочу есть -->
  <Footer/>
</template>

<script>
import Footer from '@/components/Home/Footer.vue';
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

<style>
/* Плавная анимация */
.accordion-content {
  transition: max-height 0.3s ease-out;
  overflow: hidden;
}

.accordion-content:not(.hidden) {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
