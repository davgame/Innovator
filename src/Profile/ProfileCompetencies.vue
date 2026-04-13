<template>
  <div class="bg-[#FEFEFE] p-6 border border-[#E3E3E3]/62 rounded-2xl">
    <h2 class="text-lg font-semibold text-gray-800 mb-4">Компетенции</h2>

    <!-- Режим просмотра (без крестиков) -->
    <div v-if="!editMode" class="flex flex-wrap gap-2">
      <span
        v-for="skill in competencies"
        :key="skill"
        class="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-medium"
      >
        {{ skill }}
      </span>
    </div>

    <!-- Режим редактирования (с крестиками) -->
    <div v-else>
      <div class="flex flex-wrap gap-2">
        <!-- Список навыков с крестиками -->
        <div
          v-for="(skill, index) in editableCompetencies"
          :key="skill"
          class="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-medium"
        >
          <span>{{ skill }}</span>
          <button
            @click="removeSkill(index)"
            class="cursor-pointer text-gray-400 hover:text-red-500 text-lg leading-none transition-colors"
            title="Удалить навык"
          >
            ×
          </button>
        </div>

        <!-- Кнопка добавления навыка -->
        <button
          @click="showAddSkillModal = true"
          class="px-4 py-2 border border-dashed border-gray-300 text-gray-500 rounded-xl text-sm font-medium hover:border-blue-400 hover:text-blue-500 transition-colors cursor-pointer"
        >
          + Добавить навык
        </button>
      </div>

      <!-- Счетчик выбранных тегов -->
      <div class="mt-3 text-sm text-gray-500">
        Выбрано: {{ editableCompetencies.length }}/10 навыков
      </div>
    </div>

    <!-- Модальное окно для добавления навыка -->
    <div
      v-if="showAddSkillModal"
      class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      @click.self="showAddSkillModal = false"
    >
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div class="border-b px-6 py-4 flex justify-between items-center">
          <h3 class="text-lg font-semibold text-gray-800">Добавить навык</h3>
          <button
            @click="showAddSkillModal = false"
            class="cursor-pointer text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div class="p-6">
          <!-- Поле для ввода нового навыка -->
          <input
            v-model="newSkill"
            type="text"
            placeholder="Введите название навыка..."
            @keyup.enter="addSkill"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />

          <!-- Список популярных навыков -->
          <div class="mt-4">
            <h4 class="text-sm font-medium text-gray-500 mb-3">Популярные навыки:</h4>
            <div class="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
              <button
                v-for="availableSkill in availableSkills"
                :key="availableSkill"
                @click="addSpecificSkill(availableSkill)"
                :disabled="editableCompetencies.includes(availableSkill)"
                class="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-blue-100 hover:text-blue-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ availableSkill }}
              </button>
            </div>
          </div>

          <!-- Поиск по навыкам -->
          <div class="mt-4">
            <h4 class="text-sm font-medium text-gray-500 mb-3">Поиск навыков:</h4>
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Найти навык..."
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div v-if="searchQuery && filteredSearchResults.length > 0" class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto z-10">
                <button
                  v-for="result in filteredSearchResults"
                  :key="result"
                  @click="addSpecificSkill(result)"
                  :disabled="editableCompetencies.includes(result)"
                  class="w-full text-left px-4 py-2 hover:bg-blue-50 text-gray-700 disabled:opacity-50 disabled:bg-gray-100"
                >
                  {{ result }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="border-t px-6 py-4 flex justify-end gap-3">
          <button
            @click="showAddSkillModal = false"
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 cursor-pointer"
          >
            Отмена
          </button>
          <button
            @click="addSkill"
            :disabled="!newSkill.trim() || editableCompetencies.includes(newSkill.trim())"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Добавить
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

// Props
const props = defineProps({
  editMode: {
    type: Boolean,
    default: false
  },
  initialCompetencies: {
    type: Array,
    default: () => ['React.JS', 'REST API', 'TailwindCSS', 'HTML', 'CSS', 'Figma']
  }
})

// Emits
const emit = defineEmits(['update:competencies'])

// Состояние
const competencies = ref([...props.initialCompetencies])
const editableCompetencies = ref([...props.initialCompetencies])
const showAddSkillModal = ref(false)
const newSkill = ref('')
const searchQuery = ref('')

// Доступные навыки (можно расширить)
const availableSkills = [
  'Vue.JS', 'Angular', 'Node.JS', 'Python', 'Django', 'Flask',
  'PostgreSQL', 'MongoDB', 'Redis', 'TypeScript', 'JavaScript',
  'Git', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP',
  'Redux', 'Next.JS', 'Nuxt.JS', 'Express.JS', 'Nest.JS',
  'GraphQL', 'REST API', 'TailwindCSS', 'SCSS', 'SASS',
  'Figma', 'Photoshop', 'Illustrator', 'Framer Motion',
  'Jest', 'Cypress', 'Webpack', 'Vite', 'Rollup',
  'React Native', 'Flutter', 'Swift', 'Kotlin', 'Java',
  'C#', 'PHP', 'Laravel', 'Symfony', 'Ruby on Rails',
  'Go', 'Rust', 'SQL', 'NoSQL', 'Firebase', 'Supabase'
]

// Фильтрация результатов поиска
const filteredSearchResults = computed(() => {
  if (!searchQuery.value) return []
  const query = searchQuery.value.toLowerCase()
  return availableSkills.filter(skill =>
    skill.toLowerCase().includes(query) &&
    !editableCompetencies.value.includes(skill)
  ).slice(0, 10)
})

// Удаление навыка
const removeSkill = (index) => {
  editableCompetencies.value.splice(index, 1)
  emitChanges()
}

// Добавление навыка из поля ввода
const addSkill = () => {
  const skillName = newSkill.value.trim()
  if (skillName && !editableCompetencies.value.includes(skillName)) {
    editableCompetencies.value.push(skillName)
    newSkill.value = ''
    searchQuery.value = ''
    emitChanges()
    showAddSkillModal.value = false
  }
}

// Добавление конкретного навыка из списка
const addSpecificSkill = (skill) => {
  if (!editableCompetencies.value.includes(skill)) {
    editableCompetencies.value.push(skill)
    emitChanges()
    showAddSkillModal.value = false
    newSkill.value = ''
    searchQuery.value = ''
  }
}

// Отправка изменений родителю
const emitChanges = () => {
  emit('update:competencies', editableCompetencies.value)
}

// 👇 ОСНОВНОЙ watch - обновляем при любом изменении initialCompetencies
watch(() => props.initialCompetencies, (newVal) => {
  console.log('🔄 initialCompetencies changed:', newVal)
  const newCompetencies = newVal || []

  // Обновляем competencies для режима просмотра
  competencies.value = [...newCompetencies]

  // В режиме редактирования синхронизируем editableCompetencies
  if (props.editMode) {
    // Проверяем, действительно ли изменились данные
    const currentStr = JSON.stringify(editableCompetencies.value)
    const newStr = JSON.stringify(newCompetencies)

    if (currentStr !== newStr) {
      console.log('🔄 Updating editableCompetencies from:', editableCompetencies.value, 'to:', newCompetencies)
      editableCompetencies.value = [...newCompetencies]
    }
  }
}, { deep: true, immediate: true })

// При переключении режима редактирования
watch(() => props.editMode, (isEditing) => {
  if (isEditing) {
    // При входе в режим редактирования берем актуальные компетенции
    editableCompetencies.value = [...competencies.value]
    console.log('✏️ Edit mode enabled, editableCompetencies:', editableCompetencies.value)
  }
})
</script>
