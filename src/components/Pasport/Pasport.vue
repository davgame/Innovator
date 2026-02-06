<template>
  <Header/>
  <div class="w-full flex flex-col items-center lg:mt-35 mt-18">  <!--lg:mt-16-->
    <!-- Заголовок -->

    <div class="w-full lg:flex lg:space-x-8 px-2 max-w-7xl mx-auto">
      <!--Первая колонка-->
      <div class="lg:w-[380px] px-3">
        <p class="font-semibold lg:text-[22px] text-[19px] text-[#32383E]">Руководитель проекта</p>
        <div class="border border-[#CBCBCB] rounded-[61px] lg:p-3 p-2 flex items-center space-x-2 mt-5 lg:max-w-[370px] w-full px-2">
          <img src="/src/assets/images/David.png" alt="" class="lg:w-[72px] w-[62px] lg:h-[72px] h-[62px] rounded-full">
          <div>
            <h3 class="text-[#32383E] lg:text-[20px] tex-[15px] lg:pl-4 pl-2 font-medium">Шорвоглян Давид</h3>
            <p class="lg:text-[14px] text-[13px] text-[#4286F7] lg:pl-4 pl-2">Инженер</p>
          </div>
        </div>

        <!--Объединение-->
        <p class="font-semibold lg:text-[22px] text-[19px] text-[#32383E] lg:mt-10 mt-7">Объединение</p>
        <div class="relative" ref="dropdownRef">

          <div class="border border-[#CBCBCB] rounded-[61px] lg:p-3 p-2 flex items-center space-x-2 mt-5 lg:max-w-[370px] w-full px-2 cursor-pointer hover:border-blue-400 transition-colors"
          @click="toggleDropdown"
          >
            <!-- ИЗОБРАЖЕНИЕ КОТОРОЕ МЕНЯЕТСЯ ПРИ ВЫБОРЕ -->
            <img
              :src="selectedOrganization.image"
              :alt="selectedOrganization.name"
              class="lg:w-[72px] w-[62px] lg:h-[72px] h-[62px] rounded-full">

            <div class="flex-1">
               <!-- ТЕКСТ КОТОРЫЙ МЕНЯЕТСЯ ПРИ ВЫБОРЕ -->
              <h3 class="text-[#32383E] lg:text-[20px] tex-[15px] pl-4 font-medium">{{ selectedOrganization.name }}</h3>
              <p class="text-[14px] text-[#4286F7] pl-4">{{ selectedOrganization.type }}</p>
            </div>

            <!-- Стрелка -->
            <div class="pr-2">
              <svg
                class="w-5 h-5 text-gray-500 transition-transform duration-200"
                :class="{ 'rotate-180': isOpen }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </div>
          </div>

    <!-- Выпадающий список -->
    <div
      v-if="isOpen"
      class="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden w-full"
    >
      <div class="py-2 max-h-60 overflow-y-auto">
        <!-- УНИКАЛЬНЫЕ элементы списка -->
        <div
          v-for="item in uniqueOrganizations"
          :key="item.id"
          @click="selectItem(item)"
          class="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors flex items-center"
          :class="{ 'bg-blue-50': selectedOrganization.id === item.id }"
        >
          <!-- Маленькая картинка в списке -->
          <div class="w-10 h-10 rounded-full overflow-hidden mr-3 flex-shrink-0">
            <img
              :src="item.image"
              :alt="item.name"
              class="w-full h-full object-cover"
            />
          </div>

          <div class="flex-1">
            <h4 class="text-[#32383E] text-[16px] font-medium">{{ item.name }}</h4>
            <p class="text-[14px] text-[#4286F7]">{{ item.type }}</p>
          </div>

          <!-- Галочка ДЛЯ ВЫБРАННОГО элемента -->
          <svg
            v-if="selectedOrganization.id === item.id"
            class="w-5 h-5 text-blue-500 ml-2"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
        </div>
      </div>
    </div>
  </div>
</div>

    <div class="hidden lg:block border border-[#A8A8A8]/28 max-w-xs"></div> <!-- РАЗДЕЛИТЕЛЬ -->

      <!--Вторая колонка-->
      <div class="lg:w-[380px] lg:px-3 lg:mt-0 mt-12">
    <div class="mb-3">
      <p class="block font-semibold lg:text-[22px] text-[19px] text-gray-700 mb-4 lg:pl-0 pl-3">
        Описание проекта
      </p>

      <textarea
        v-model="text"
        rows="6"
        maxlength="1000"
        @input="checkText"
        :class="[
          'lg:w-92 w-69 lg:h-68 h-58 px-4 py-3 border rounded-[30px] hover:border-blue-500 resize-none block mx-auto',
          hasError ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
        ]"
        placeholder="Введите ваш текст здесь..."
      ></textarea>

      <!-- Индикатор символов -->
      <div class="flex justify-between items-center mt-2 lg:pl-0 pl-3 ">
        <div class="text-sm" :class="charCount > 1000 ? 'text-red-600' : 'text-gray-500'">
          Введено символов: <span class="font-medium">{{ charCount }}</span>/1000
        </div>
      </div>
    </div>

    <!-- Сообщения об ошибках -->
    <div v-if="errorMessage" class="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800">
      {{ errorMessage }}
    </div>
  </div>
    <div class="hidden lg:block border border-[#A8A8A8]/28 max-w-md ml-1.5"></div> <!-- РАЗДЕЛИТЕЛЬ -->

    <!--Третья колонка-->
    <div class="lg:w-[380px] px-3 lg:mt-0 mt-12">
      <p class="font-semibold lg:text-[22px] text-[19px] text-[#32383E] mb-4 ">Теги проекта</p>
      <div class="border border-gray-300 rounded-[30px] p-6">

          <!-- Выбранные теги -->
        <div class="mb-2">
        <div class="flex flex-wrap gap-3" ref="tagsContainer">
          <!-- Отображение выбранных тегов -->
          <div
            v-for="(tag, index) in selectedTags"
            :key="tag"
            class="border border-[#4286F7] rounded-full px-4 py-1.5 flex items-center gap-2 bg-white"
          >
            <span class="text-[#4286F7] text-[16px]">{{ tag }}</span>
            <button
              @click="removeTag(index)"
              class="text-gray-400 hover:text-red-500 text-[20px]"
            >
              ×
            </button>
          </div>

          <!-- Кнопка добавления (показывается если меньше 5 тегов) -->
          <button
            v-if="selectedTags.length < 5"
            @click="openModal"
            class="border border-[#CBCBCB] rounded-full px-4 py-2 flex items-center gap-1 text-gray-400 hover:text-blue-500 hover:border-blue-400 transition-colors"
          >
            <span>+</span>
            <span>Добавить тег</span>
          </button>
        </div>

        <!-- Счетчик тегов -->
        <div class="mt-2 text-sm text-gray-500">
          Выбрано: {{ selectedTags.length }}/5 тегов
        </div>
      </div>

      <!-- Модальное окно -->
      <div
        v-if="isModalOpen"
        class="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50 p-4"
        @click.self="closeModal"
      >
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-md">
          <!-- Заголовок модального окна -->
          <div class="border-b px-6 py-4 flex justify-between items-center">
            <h3 class="text-lg font-semibold text-gray-800">Выберите теги</h3>
            <button
              @click="closeModal"
              class="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <!-- Поиск тегов -->
          <div class="p-6">
            <div class="mb-4">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Поиск тегов..."
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <!-- Список доступных тегов -->
            <div class="mb-6">
              <h4 class="text-sm font-medium text-gray-500 mb-3">Доступные теги:</h4>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="tag in filteredTags"
                  :key="tag"
                  @click="toggleTag(tag)"
                  :class="[
                    'border rounded-full px-3 py-1.5 text-sm transition-colors',
                    isTagSelected(tag)
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 text-gray-700 hover:border-blue-400 hover:bg-blue-50'
                  ]"
                  :disabled="!isTagSelected(tag) && selectedTags.length >= 5"
                >
                  {{ tag }}
                  <span v-if="isTagSelected(tag)" class="ml-1">✓</span>
                </button>
              </div>
            </div>

            <!-- Список всех тегов -->
            <div>
              <h4 class="text-sm font-medium text-gray-500 mb-3">Все теги:</h4>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="tag in allTags"
                  :key="tag"
                  @click="toggleTag(tag)"
                  :class="[
                    'border rounded-full px-3 py-1.5 text-sm transition-colors',
                    isTagSelected(tag)
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 text-gray-700 hover:border-blue-400 hover:bg-blue-50'
                  ]"
                  :disabled="!isTagSelected(tag) && selectedTags.length >= 5"
                >
                  {{ tag }}
                </button>
              </div>
            </div>
          </div>

          <!-- Кнопки модального окна -->
          <div class="border-t px-6 py-4 flex justify-end gap-3">
            <button
              @click="closeModal"
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Отмена
            </button>
            <button
              @click="applyTags"
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Применить ({{ tempSelectedTags.length }})
            </button>
          </div>
        </div>
      </div>
    </div>
        <div class="px-3 lg:mt-0 mt-12 mb-15">
          <div class="flex flex-col items-center gap-4 lg:fixed lg:bottom-10 lg:left-1/2 lg:transform lg:-translate-x-1/2 lg:z-40 lg:w-auto mt-auto lg:mt-0">
            <!-- Кнопка "Далее" -->
            <router-link to="/sup" @click="isOpen = false" class="w-full lg:w-auto">
              <button @click="modalOpen = true" class="btn-more bg-[#222222] hover:bg-[#4286F7] text-white font-medium py-4 lg:px-28 text-[20px] rounded-[18px] transition-colors duration-300 cursor-pointer w-full text-center">
                Далее
              </button>
            </router-link>

            <!-- Кнопка "Назад" -->
            <button @click="$router.back()" class="btn-more border-1 border-[#222222] hover:bg-gray-100 text-[#222222] font-medium py-4 lg:px-28 text-[20px] rounded-[18px] transition-colors duration-300 cursor-pointer w-full lg:w-auto text-center">
              Назад
            </button>
          </div>
        </div>
      </div>
    </div>
</div>

</template>

<script setup>
import { ref, computed, onUnmounted,onMounted } from 'vue'
import Header from '../Home/Header.vue';

const text = ref('')
const errorMessage = ref('')
const isOpen = ref(false)
const dropdownRef = ref(null)

// Данные организаций
const organizations = ref([

  {
    id: 1,
    name: 'CHO КубГТУ',
    type: 'Наука',
    image: '/src/assets/images/СNO_KubGTU.png', // ← ДРУГАЯ КАРТИНКА
  },
  {
    id: 2,
    name: 'СНО КубГМУ',
    type: 'Наука',
    image: '/src/assets/images/CNO_KubGMU.png'
  },

  {
    id: 3,
    name: 'СНО КубГУ',
    type: 'Наука',
    image: '/src/assets/images/CNO_KubGU.png'
  },
  {
    id: 4,
    name: 'СНО КубГАУ',
    type: 'Наука',
    image: '/src/assets/images/CNO_KubGAU.png'
  }

])

// Выбранная организация - по умолчанию первая
const selectedOrganization = ref(
  organizations.value.find(item => item.isDefault) || organizations.value[0]
)

// УНИКАЛЬНЫЕ организации (без дубликатов)
const uniqueOrganizations = computed(() => {
  // Фильтруем уникальные по имени
  const unique = []
  const seenNames = new Set()

  for (const org of organizations.value) {
    if (!seenNames.has(org.name)) {
      seenNames.add(org.name)
      unique.push(org)
    }
  }

  return unique
})

// Функция переключения выпадающего списка
function toggleDropdown() {
  isOpen.value = !isOpen.value
}

// Функция выбора элемента
function selectItem(item) {
  selectedOrganization.value = item
  isOpen.value = false

  console.log('Выбрано:', item.name, 'ID:', item.id)
  console.log('Теперь selectedOrganization.id =', selectedOrganization.value.id)
}

// Функция закрытия при клике вне элемента
function handleClickOutside(event) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isOpen.value = false
  }
}

// Навешиваем обработчики
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const charCount = computed(() => text.value.length)

const hasError = computed(() => errorMessage.value !== '')

function checkText() {
  errorMessage.value = ''

  // Проверка на недопустимые символы
  if (text.value.includes('*')) {
    errorMessage.value = 'Недопустимый символ: *'
    return
  }

  // Проверка на превышение лимита
  if (charCount.value > 1000) {
    errorMessage.value = `Превышен лимит в 1000 символов`
  }
}


// Состояние
const isModalOpen = ref(false)
const selectedTags = ref(['бизнес', 'web-сервис']) // Начальные теги
const tempSelectedTags = ref([])
const searchQuery = ref('')

// Все доступные теги
const allTags = ref([
  'бизнес',
  'web-сервис',
  'develop',
  'e-commerce',
  'ux/ui',
  'маркетинг',
  'аналитика',
  'дизайн',
  'программирование',
  'мобильная разработка',
  'базы данных',
  'безопасность',
  'облачные технологии',
  'искусственный интеллект',
  'машинное обучение'
])

// Отфильтрованные теги по поиску
const filteredTags = computed(() => {
  if (!searchQuery.value) return allTags.value.slice(0, 8) // Первые 8 без поиска
  return allTags.value.filter(tag =>
    tag.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// Проверка, выбран ли тег
const isTagSelected = (tag) => {
  return tempSelectedTags.value.includes(tag)
}

// Открытие модального окна
const openModal = () => {
  tempSelectedTags.value = [...selectedTags.value]
  isModalOpen.value = true
  searchQuery.value = ''
}

// Закрытие модального окна
const closeModal = () => {
  isModalOpen.value = false
}

// Применение выбранных тегов
const applyTags = () => {
  selectedTags.value = [...tempSelectedTags.value]
  closeModal()
}

// Добавление/удаление тега в модальном окне
const toggleTag = (tag) => {
  if (tempSelectedTags.value.includes(tag)) {
    // Удаляем тег
    tempSelectedTags.value = tempSelectedTags.value.filter(t => t !== tag)
  } else {
    // Добавляем тег, если не превышен лимит
    if (tempSelectedTags.value.length < 5) {
      tempSelectedTags.value.push(tag)
    }
  }
}

// Удаление тега из выбранных
const removeTag = (index) => {
  selectedTags.value.splice(index, 1)
}

</script>

<style scoped>
.rotate-180 {
  transform: rotate(180deg);
}

/* Анимация выпадающего списка */
.absolute {
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Стилизация скроллбара */
.max-h-60::-webkit-scrollbar {
  width: 6px;
}

.max-h-60::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.max-h-60::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 10px;
}

.max-h-60::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

/* Выделение выбранного элемента */
.bg-blue-50 {
  background-color: rgba(59, 130, 246, 0.1);
}


/* Анимация для модального окна */
.fixed {
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Стили для disabled кнопок */
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

button:disabled:hover {
  border-color: #d1d5db;
  background-color: transparent;
}
</style>
