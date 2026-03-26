<template>
  <div class="bg-white border-b border-gray-200 px-4 py-3">
    <div class="flex items-center justify-between">
      <!-- Левая часть: иконка + название -->
      <div class="flex items-center gap-3 flex-1 min-w-0">
        <!-- Цветная иконка проекта -->
        <div
          v-if="project?.color"
          class="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0"
          :style="{ backgroundColor: project.color }"
        >
          {{ project.icon || project.name?.charAt(0).toUpperCase() }}
        </div>
        <div v-else class="w-10 h-10 rounded-lg bg-gray-200 flex-shrink-0"></div>

        <h1 class="font-bold text-gray-900 text-xl truncate">
          {{ project?.name || 'Выберите проект' }}
        </h1>
      </div>

      <!-- Правая часть: кнопки -->
      <div class="flex items-center gap-2">
        <!-- Кнопка создания задачи -->
        <button
          @click="$emit('create-task')"
          class="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 transition-colors"
          title="Создать задачу"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>

        <!-- Кнопка участников -->
        <button
          @click="$emit('open-members')"
          class="w-9 h-9 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition-colors"
          title="Участники"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Вкладки -->
    <div class="flex gap-6 mt-3">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        class="pb-2 text-sm font-medium transition-colors relative"
        :class="activeTab === tab.id ? 'text-blue-600' : 'text-gray-500'"
      >
        {{ tab.title }}
        <span
          v-if="activeTab === tab.id"
          class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
        ></span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  project: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['create-task', 'open-members'])

const tabs = ref([
  { id: 1, title: 'Беклог' },
  { id: 2, title: 'В работе' },
  { id: 3, title: 'Готово' }
])

const activeTab = ref(1)

</script>
