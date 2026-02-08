<template>
  <div class="flex">
    <!-- Левая панель -->
    <Panel @project-selected="currentProject = $event" />

    <!-- Правая часть -->
    <div class="flex-1 flex flex-col">
      <!-- Заголовок проекта ЧЕРЕЗ КОМПОНЕНТ Name_pg -->
      <Name_pg v-if="currentProject" :project="currentProject" />

      <!-- Простой заголовок для отладки (можно удалить потом) -->
      <div v-else class="bg-white border-b border-gray-200 px-6 py-4">
        <h1 class="text-3xl font-bold text-gray-900">
          Проект не выбран
        </h1>
      </div>

      <!-- Контент -->
      <div class="flex-1 p-6 bg-gray-50">
        <div v-if="currentProject">
          <div class="max-w-7xl mx-auto">
            <div class="bg-white p-6 rounded-lg shadow mb-6">
              <h2 class="text-xl font-semibold mb-4">Проект: {{ currentProject.name }}</h2>
              <p class="text-gray-600">Категория: {{ currentProject.category }}</p>
              <div class="mt-4 p-3 bg-blue-50 rounded">
                <p class="text-sm text-blue-700">ID проекта: {{ currentProject.id }}</p>
              </div>
            </div>

            <!-- Статистика проекта -->
            <div class="grid grid-cols-3 gap-4 mb-6">
              <div class="bg-white p-4 rounded-lg shadow">
                <div class="text-sm text-gray-500">Беклог</div>
                <div class="text-2xl font-bold">2</div>
              </div>
              <div class="bg-white p-4 rounded-lg shadow">
                <div class="text-sm text-gray-500">Прогресс</div>
                <div class="text-2xl font-bold text-blue-600">1</div>
              </div>
              <div class="bg-white p-4 rounded-lg shadow">
                <div class="text-sm text-gray-500">Завершено</div>
                <div class="text-2xl font-bold text-green-600">0</div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="flex items-center justify-center h-full">
          <div class="text-center">
            <p class="text-gray-500 text-lg">Выберите проект из списка слева</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Panel from './Panel.vue'
import Name_pg from './Name_pg.vue' // ДОБАВЬТЕ ЭТОТ ИМПОРТ!

const currentProject = ref(null)
</script>
