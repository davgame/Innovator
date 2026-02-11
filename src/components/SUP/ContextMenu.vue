<!-- components/ContextMenu.vue -->
<template>
  <div
    class="absolute right-4 top-12 z-50 bg-white rounded-xl shadow-lg border border-gray-100 py-2 w-52"
    @click.stop
  >
    <button
      @click="$emit('edit')"
      class="w-full px-4 py-2.5 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
      <span>Редактировать</span>
    </button>

    <div class="border-t border-gray-100 my-1"></div>

    <button
      @click="$emit('delete')"
      class="w-full px-4 py-2.5 text-left text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
      <span>Удалить</span>
    </button>
  </div>
  <!-- В конец шаблона, перед закрывающим тегом </template> -->
<div
  v-if="activeContextMenu"
  class="fixed inset-0 z-40"
  @click="closeContextMenu"
></div>
</template>

<script setup>
// Компонент принимает события edit и delete
defineEmits(['edit', 'delete'])
</script>
