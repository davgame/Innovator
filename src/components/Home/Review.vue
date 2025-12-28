<template>
  <section class="relative bg-white min-h-screen lg:h-[1060px] z-0 flex flex-col items-center pt-20 lg:pt-[80px] px-4">
    <!-- Заголовок -->
    <div class="text-center w-full max-w-6xl mx-auto mb-8 lg:mb-16 lg:mt-16 mt-2">
      <h2 class="text-gray-900 text-3xl lg:text-5xl xl:text-6xl font-bold mb-4 lg:mb-6 px-2">
        Что говорят наши участники
      </h2>
      <p class="text-[#989898]  text-[14px] lg:text-xl font-normal max-w-3xl mx-auto leading-relaxed px-4">
        Узнайте о вдохновляющем опыте студентов, наставников и партнеров, которые сотрудничают с Центром компетенций
      </p>
    </div>

    <!-- Desktop версия (2 колонки) -->
    <div class="hidden lg:block w-full">
      <div class="flex justify-center w-full">
        <div class="grid grid-cols-2 gap-8 max-w-[960px] w-full">
          <!-- Карточки для десктопа -->
          <div v-for="(review, index) in desktopReviews" :key="index"
               class="border-2 border-[#000000]/15 hover:border-[#338AEF] rounded-[24px] p-6 transition-colors duration-300">
            <p class="text-[#595959] text-lg mb-6 leading-relaxed">
              "{{ review.text }}"
            </p>
            <div class="w-full h-[1px] bg-black/10 mb-6"></div>
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 rounded-full overflow-hidden">
                <img :src="review.avatar" :alt="review.name" class="w-full h-full object-cover">
              </div>
              <div>
                <p class="font-semibold text-gray-800">{{ review.name }}</p>
                <p class="text-sm text-gray-600">{{ review.role }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile версия (карусель) -->
    <div class="lg:hidden w-full max-w-sm mx-auto px-2">
      <transition name="fade" mode="out-in">
        <div
          :key="current"
          class="w-full border-2 border-black/15 rounded-[24px] p-6 transition-all duration-300 mb-8"
        >
          <p class="text-[#595959] text-base mb-6 leading-relaxed px-2">
            "{{ reviews[current].text }}"
          </p>
          <div class="h-px bg-black/10 mb-5"></div>
          <div class="flex items-center gap-4 px-2">
            <img
              :src="reviews[current].avatar"
              class="w-12 h-12 rounded-full object-cover"
              :alt="reviews[current].name"
            />
            <div>
              <p class="font-semibold text-gray-800 text-sm">
                {{ reviews[current].name }}
              </p>
              <p class="text-xs text-gray-600">
                {{ reviews[current].role }}
              </p>
            </div>
          </div>
        </div>
      </transition>

      <!-- Индикаторы -->
      <div class="flex justify-center gap-2 mt-2">
        <button
          v-for="(_, i) in reviews"
          :key="i"
          @click="setCurrent(i)"
          class="w-2 h-2 rounded-full transition-all"
          :class="current === i
            ? 'bg-gray-800 w-4'
            : 'bg-gray-300'"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const current = ref(0)

const reviews = [
  {
    text: 'Центр компетенции открыл для меня новые горизонты в науке. Я получила бесценный опыт и нашла единомышленников',
    name: 'Екатерина Иванова',
    role: 'Студентка СНО КубГТУ',
    avatar: '/src/assets/images/user_avatar.png'
  },
  {
    text: 'Центр компетенции - это место, где рождаются инновации и раскрывается потенциал молодых ученых',
    name: 'Иван Кузнецов',
    role: 'Наставник СНО КубГТУ',
    avatar: '/src/assets/images/user_avatar2.png'
  },
  {
    text: 'Мы рады поддерживать Центр компетенции. Это вклад в будущее Кубани и всей России',
    name: 'Алексей Сидоров',
    role: 'Партнер центра',
    avatar: '/src/assets/images/user_avatar3.png'
  },
  {
    text: 'Я очень благодарна Центру за возможность участвовать в интересных проектах и развивать свои навыки',
    name: 'София Васильева',
    role: 'Студентка СНО КубГТУ',
    avatar: '/src/assets/images/user_avatar4.png'
  }
]

// Для десктоп версии
const desktopReviews = reviews

let timer = null

const setCurrent = (index) => {
  current.value = index
  startAutoplay()
}

const startAutoplay = () => {
  stopAutoplay()
  timer = setInterval(() => {
    current.value = (current.value + 1) % reviews.length
  }, 4000)
}

const stopAutoplay = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

onMounted(() => {
  startAutoplay()
})

onUnmounted(() => {
  stopAutoplay()
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
