<template>
  <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
    <div class="flex items-center justify-around py-2 px-4">
      <!-- Кнопка поиска -->
      <button
        @click="$emit('open-search')"
        class="flex flex-col items-center gap-1 p-2 rounded-lg transition-colors text-gray-500"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span class="text-xs">Поиск</span>
      </button>

            <!-- Кнопка проектов (синий обвод) -->
      <button
        @click="$emit('open-projects')"
        class="flex flex-col items-center gap-1 p-2 rounded-lg transition-colors"
        :class="activeMenu === 'projects' ? 'text-blue-600' : 'text-gray-500'"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        <span class="text-xs">Проекты</span>
      </button>

      <!-- Кнопка участников -->
      <button
        @click="$emit('open-members')"
        class="flex flex-col items-center gap-1 p-2 rounded-lg transition-colors text-gray-500"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <span class="text-xs">Участники</span>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  activeMenu: {
    type: String,
    default: null
  }
})

defineEmits(['open-projects', 'open-search', 'open-members'])
</script>
