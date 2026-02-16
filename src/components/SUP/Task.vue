<template>
  <div v-if="show" class="overlay">
    <div class="modal">
      <!-- Header -->
      <div class="header">
        <button class="primary rounded-[12px] w-30 h-11 font-medium" @click="save">Сохранить</button>
        <button class=" border border-[#000000]/15 rounded-[12px] w-30 font-medium text-[#454545]" @click="close">Отмена</button>

      </div>
      <div class="w-full h-px bg-[#D3D3D3]/80 mb-4"></div>

      <!-- Body -->
      <h1 class="text-[25px] font-bold pb-4">Новая задача</h1>

      <input
        v-model="title"
        placeholder="Название задачи"
        class="border border-[#CBCBCB] focus:border-[#4286F7] focus:border-2 focus:outline-none pl-3 rounded-[13px] w-92 h-13"
      />

      <div class="flex mt-5">
        <div class="w-28">
          <label>Статус</label>
          <select v-model="status" class=" w-42 h-12 border border-[#CBCBCB] rounded-[11px] pl-3 focus:border-[#4286F7] focus:border-2 focus:outline-none mt-2 appearance-none" style="background-image: url('/src/assets/images/caret-down.svg'); background-repeat: no-repeat;
          background-position: right 0.5rem center; background-size: 1.5rem;">
            <option :value="1">Беклог</option>
            <option :value="2">В работе</option>
            <option :value="3">Готово</option>
          </select>
        </div>

        <div class="ml-21 w-28">
          <label>Тег</label>
          <select v-model="tag" class="w-42 h-12 border border-[#CBCBCB] rounded-[11px] pl-3 focus:border-[#4286F7] focus:border-2 focus:outline-none mt-2 appearance-none" style="background-image: url('/src/assets/images/caret-down.svg'); background-repeat: no-repeat;
          background-position: right 0.5rem center; background-size: 1.5rem;">
            <option>Frontend</option>
            <option>Backend</option>
            <option>Design</option>
          </select>
        </div>
      </div>

      <!-- Подзадачи -->
      <div class="mt-5">
        <p class="text-[20px] font-medium text-[#000000] mb-4">
          Подзадачи ({{ completedCount }}/{{ checklist.length }})
        </p>

        <div
          v-for="(item, i) in checklist"
          :key="item.id"
          class="flex items-center gap-2 mb-4"
        >
          <input
            type="checkbox"
            v-model="item.done"
          />

          <input
            v-model="item.text"
            placeholder="Новая подзадача"
            class="flex-1 border-b outline-none"
          />

          <button
            @click="removeItem(i)"
            class="text-[#211f1f] hover:text-red-400"
          >
            ✕
          </button>
        </div>

        <button
          @click="addItem"
          class="text-blue-500 text-sm"
        >
          + Добавить подзадачу
        </button>
      </div>

      <!-- ПРОГРЕСС БАР -->
      <div class="progress-section" v-if="checklist.length > 0">
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm text-gray-500">Прогресс выполнения</span>
          <span class="text-sm font-medium text-gray-700">{{ progressPercentage }}%</span>
        </div>
        <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            class="h-full rounded-full transition-all duration-300"
            :class="getProgressColor(progressPercentage)"
            :style="{ width: progressPercentage + '%' }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

/* Получаем пропс */
const props = defineProps({
  show: Boolean
})

/* Эвенты */
const emit = defineEmits(['close', 'save'])

/* Локальные данные */
const title = ref('')
const status = ref(1)
const tag = ref('Frontend')
const description = ref('')
const checklist = ref([])

/* ВЫЧИСЛЯЕМЫЕ СВОЙСТВА ДЛЯ ПРОГРЕССА */
const completedCount = computed(() => {
  return checklist.value.filter(item => item.done).length
})

const progressPercentage = computed(() => {
  if (checklist.value.length === 0) return 0
  return Math.round((completedCount.value / checklist.value.length) * 100)
})

/* Функция для определения цвета прогресс-бара */
const getProgressColor = (progress) => {
  if (progress < 30) return 'bg-red-500'
  if (progress < 70) return 'bg-yellow-500'
  if (progress < 100) return 'bg-blue-500'
  return 'bg-green-500'
}

/* Сброс формы */
const reset = () => {
  title.value = ''
  status.value = 1
  tag.value = 'Frontend'
  description.value = ''
  checklist.value = []
}

/* Закрыть */
function close() {
  reset() // Сбрасываем при закрытии
  emit('close')
}

/* Сохранить */
function save() {
  emit('save', {  // Было 'create', теперь 'save'
    id: Date.now(),
    title: title.value,
    status: status.value,
    tag: tag.value,
    progress: progressPercentage.value,
    checklist: [...checklist.value],
    members: []
  })
  close()
  reset()
}

const addItem = () => {
  checklist.value.push({
    id: Date.now(),
    text: '',
    done: false
  })
}

const removeItem = (i) => {
  checklist.value.splice(i, 1)
}

/* Следим за пропсом show и сбрасываем форму при открытии */
watch(() => props.show, (newVal) => {
  if (newVal) {
    // Сбрасываем форму при открытии
    reset()
  }
}, { immediate: false })
</script>

<style scoped>
/* Фон */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  justify-content: flex-end;
  z-index: 1000;
}

/* Окно */
.modal {
  width: 420px;
  height: 100%;
  background: #fff;
  padding: 24px;
  border-radius: 16px 0 0 16px;
  overflow-y: auto;
}

/* Header */
.header {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

/* Controls */
.input,
.textarea {
  width: 150%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 10px;
}

.textarea {
  min-height: 120px;
  resize: none;
}

.row {
  display: flex;
  gap: 15px;
  margin: 16px 0;
  border-radius: 15px;
}


.primary {
  background: #3b82f6;
  color: white;
  border: none;
}

/* Прогресс секция */
.progress-section {
  margin: 16px 0;
  padding: 12px;
  background: #f9f9f9;
  border-radius: 8px;
}

.flex {
  display: flex;
}

.justify-between {
  justify-content: space-between;
}

.items-center {
  align-items: center;
}

.mb-2 {
  margin-bottom: 8px;
}

.text-sm {
  font-size: 14px;
}

.text-gray-500 {
  color: #6b7280;
}

.text-gray-700 {
  color: #374151;
}

.font-medium {
  font-weight: 500;
}

.w-full {
  width: 100%;
}

.h-2 {
  height: 8px;
}

.bg-gray-200 {
  background-color: #e5e7eb;
}

.rounded-full {
  border-radius: 9999px;
}

.overflow-hidden {
  overflow: hidden;
}

.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Цвета прогресс-бара */
.bg-red-500 {
  background-color: #ef4444;
}

.bg-yellow-500 {
  background-color: #f59e0b;
}

.bg-blue-500 {
  background-color: #3b82f6;
}

.bg-green-500 {
  background-color: #10b981;
}
</style>
