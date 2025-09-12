<template>
 <div class="relative w-full max-w-4xl mx-auto overflow-hidden rounded-2xl mt-[10px] ml-[12px]"
    style="width: 854px; height: 815px; overflow: hidden; border-radius: 23px;">
    <!-- Слайды -->
    <div
      class="flex transition-transform duration-700"
      :style="{ transform: `translateX(-${currentSlide * 854}px)` }"
    >
      <div
        v-for="(slide, index) in slides"
        :key="index"
        class="w-full flex-shrink-0"
        style="width: 854px; height: 815px; overflow: hidden; border-radius: 23px;"
      >
        <img
          :src="slide"
          alt="Slide"
          class="w-full h-full object-cover"
        />
      </div>
    </div>

    <!-- Кружочки -->
    <div class="absolute bottom-6 left-[134px] transform -translate-x-1/2 flex space-x-2">
      <button
        v-for="(s, i) in slides"
        :key="i"
        @click="goToSlide(index)"
        class="w-[58px] h-[8px] ml-[3px] rounded-full transition-all"
        :class="currentSlide === i ? 'bg-[#D9D9D9]/70 scale-110' : 'bg-[#D9D9D9]/30'"
      ></button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

const slides = [
  "/images/slide.jpg",
  "/images/slide.jpg",
  "/images/slide.jpg"
];

const currentSlide = ref(0);
let intervalId = null;

const goToSlide = (index) => {
  currentSlide.value = index;
};

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.length;
};

onMounted(() => {
  intervalId = setInterval(nextSlide, 4000); // каждые 4 сек
});

onBeforeUnmount(() => {
  clearInterval(intervalId);
});
</script>

<style scoped></style>

