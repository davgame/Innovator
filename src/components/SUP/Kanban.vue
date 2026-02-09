<template>
  <div class="flex gap-6 px-3 pb-4 h-[calc(70vh-55px)] overflow-x-auto overflow-y-hidden">

    <!-- Колонка -->
    <div
      v-for="column in columns"
      :key="column.id"
      class="w-82 rounded-2xl p-4 flex flex-col flex-shrink-0 bg-white min-h-0"
    >

      <!-- Заголовок -->
      <h3 class="font-semibold mb-4 text-[28px] text-gray-700">
        {{ column.title }}
      </h3>

      <button class="text-[#C0C0C0] text-[25px] border border-[#D7D7D7] bg-[#D9D9D9]/11 w-74 h-12 rounded-[12px] mb-7 cursor-pointer">
        <p>+</p>
      </button>

      <div class="flex-1 overflow-y-auto min-h-0 pr-2">

        <draggable
          v-model="column.tasks"
          group="tasks"
          item-key="id"
          class="space-y-6 min-h-0"
        >

        <template #item="{ element }">
          <div
            class="rounded-xl px-4 h-50 py-6 border-2 border-[#D7D7D7]/32 cursor-move transition"
          >
          <button class="bg-[#FFDFDD] w-22 h-7 text-[#C76269] text-[13px] rounded-[5px] mb-3">
            <p>UI Дизайн</p>
          </button>

          <button class="bg-[#F8FAF9] w-12 h-7 text-[#838886] text-[20px] rounded-[5px] mb-4 ml-2 ">
            <p>+</p>
          </button>
            <p class="text-xl font-medium">
              {{ element.title }}
            </p>
            <div class="text-xs text-gray-400 mt-1">
              {{ element.progress }}%
            </div>
          </div>
        </template>
      </draggable>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import draggable from 'vuedraggable'

const columns = ref([
  {
    id: 1,
    title: 'Беклог',
    tasks: [
      { id: 1, title: 'UX/UI дизайн', progress: 12 },
      { id: 2, title: 'API интеграция', progress: 5 }
    ]
  },
  {
    id: 2,
    title: 'В работе',
    tasks: [
      { id: 3, title: 'BPMN схема', progress: 77 }
    ]
  },
  {
    id: 3,
    title: 'Готово',
    tasks: []
  }
])
</script>

<style scoped>
/* Стили для скроллбара внутри колонок */
.flex-1.overflow-y-auto::-webkit-scrollbar {
  width: 4px; /* ← Здесь меняем толщину скроллбара */
}

.flex-1.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.flex-1.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.flex-1.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

/* Для Firefox */
.flex-1.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: #c1c1c1 #f1f1f1;
}
</style>
