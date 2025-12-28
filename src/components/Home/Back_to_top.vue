<template>
  <teleport to="body">
    <button
      v-show="isVisible"
      @click="scrollToTop"
      class="fixed z-[9999] flex items-center justify-center text-white rounded-full shadow-2xl transition-all duration-300 bg-[#338AEF] hover:bg-blue-600 active:bg-blue-700"
      :class="{
        // Мобильные с учетом safe-area для iPhone
        'bottom-[max(1rem,env(safe-area-inset-bottom))] ml-12 w-12 h-12': true,
        // Планшеты
        'sm:bottom-6 sm:right-6 sm:w-14 sm:h-14': true,
        // Десктоп
        'md:bottom-8 md:right-8 md:w-16 md:h-16': true
      }"
      :style="{
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.3s ease, transform 0.3s ease',
        transform: isVisible ? 'scale(1) translateY(0)' : 'scale(0.8) translateY(10px)'
      }"
      aria-label="Вернуться наверх"
    >
      <svg
        class="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </button>
  </teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted, onBeforeUnmount } from 'vue'
import { throttle } from 'lodash-es' // Или используйте свой throttle

const isVisible = ref(false)

const handleScroll = () => {
  // Меньше значение = стрелка появится раньше
  // Больше значение = стрелка появится позже
  isVisible.value = window.scrollY > 600 // Медленно (через 500px)
}

// Оптимизация с throttle для производительности на мобильных
const throttledScroll = throttle(handleScroll, 100)

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', throttledScroll, { passive: true })
    window.addEventListener('resize', throttledScroll, { passive: true })
    handleScroll()
  }
})

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('scroll', throttledScroll)
    window.removeEventListener('resize', throttledScroll)
    throttledScroll.cancel?.()
  }
})
</script>
