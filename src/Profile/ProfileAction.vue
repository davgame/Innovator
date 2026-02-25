<template>
  <button
    @click="$emit('open-exit-modal')"
    class="cursor-pointer w-full py-4 px-6 border border-[#E3E3E3]/62 bg-[#FEFEFE] hover:bg-red-100 text-red-600 rounded-2xl font-semibold transition-colors flex items-center gap-2"
  >
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
    Выйти
  </button>
</template>

<script setup>
defineEmits(['open-exit-modal'])
</script>
