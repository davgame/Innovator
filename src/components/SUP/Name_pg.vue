<template>
  <div class="bg-white border-b border-gray-200 px-15 mb-4">
    <!-- Заголовок проекта -->
    <div class="mb-4">
      <h1 class="text-5xl font-bold text-gray-900">
        {{ project.name }}
      </h1>
    </div>

    <!-- Вкладки -->
    <div class="flex space-x-8">
      <button class="px-1 py-2 text-lg font-semibold text-blue-600 border-b-2 border-blue-600">
        Доска
      </button>
      <button class="px-1 py-2 text-lg font-semibold text-gray-500 hover:text-gray-700">
        Календарь
      </button>
      <button class="px-1 py-2 text-lg font-semibold text-gray-500 hover:text-gray-700">
        Команда
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  project: {
    type: Object,
    required: true
  }
})
</script>
