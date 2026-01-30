<template>
  <Header/>
  <div class="w-full flex flex-col items-center lg:mt-35 mt-18">  <!--lg:mt-16-->
    <!-- Заголовок -->

    <div class="w-full lg:flex lg:space-x-8 px-2 max-w-7xl mx-auto">
      <!--Первая колонка-->
      <div class="lg:w-[380px]">
        <p class="font-semibold text-[22px] text-[#32383E]">Руководитель проекта</p>
        <div class="border border-[#CBCBCB] rounded-[61px] p-3 flex items-center space-x-2 mt-5 max-w-[370px]">
          <img src="/src/assets/images/David.png" alt="" class="w-[72px] h-[72px] rounded-full">
          <div>
            <h3 class="text-[#32383E] text-[20px] pl-4 font-medium">Шорвоглян Давид</h3>
            <p class="text-[14px] text-[#4286F7] pl-4">Инженер</p>
          </div>
        </div>

        <!--Объединение-->
        <p class="font-semibold text-[22px] text-[#32383E] mt-10">Объединение</p>
        <div class="relative" ref="dropdownRef">

          <div class="border border-[#CBCBCB] rounded-[61px] p-3 flex items-center space-x-2 mt-5 max-w-[370px] cursor-pointer hover:border-blue-400 transition-colors"
          @click="toggleDropdown"
          >
            <!-- ИЗОБРАЖЕНИЕ КОТОРОЕ МЕНЯЕТСЯ ПРИ ВЫБОРЕ -->
            <img
              :src="selectedOrganization.image"
              :alt="selectedOrganization.name"
              class="w-[72px] h-[72px] rounded-full">

            <div class="flex-1">
               <!-- ТЕКСТ КОТОРЫЙ МЕНЯЕТСЯ ПРИ ВЫБОРЕ -->
              <h3 class="text-[#32383E] text-[20px] pl-4 font-medium">{{ selectedOrganization.name }}</h3>
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
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
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

      <div class="border border-[#A8A8A8]/28 max-w-xs"></div> <!-- РАЗДЕЛИТЕЛЬ -->

      <!--Вторая колонка-->
      <div class="lg:w-1/3 px-3">
    <div class="mb-6">
      <label class="block font-semibold text-[22px] text-gray-700 mb-4">
        Описание проекта
      </label>

      <textarea
        v-model="text"
        rows="6"
        maxlength="1000"
        @input="checkText"
        :class="[
          'w-92 h-68 px-4 py-3 border rounded-[30px] focus:ring-2 focus:border-blue-500 resize-none',
          hasError ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
        ]"
        placeholder="Введите ваш текст здесь..."
      ></textarea>

      <!-- Индикатор символов -->
      <div class="flex justify-between items-center mt-2">
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
      </div>
  </div>

    <!-- Кнопка "Подробнее" -->
  <router-link to="/Pasport" @click="isOpen = false">
  <button @click="modalOpen = true" class="btn-more bg-[#222222] hover:bg-[#4286F7] text-white font-medium lg:mb-25 mb-24 py-4 lg:px-28 px-30 text-[20px] rounded-[18px] fixed bottom-10 left-1/2 transform -translate-x-1/2 z-40 transition-colors duration-300 cursor-pointer">
    Далее
  </button>
  </router-link>
  <!-- Кнопка "Подробнее" -->
  <button @click="$router.back()" class="btn-more border-1 border-[#222222] hover:bg-gray-100 text-[#222222] font-medium lg:mb-3 mb-2 py-4 lg:px-28 px-30 text-[20px] rounded-[18px] fixed bottom-10 left-1/2 transform -translate-x-1/2 z-40 transition-colors duration-300 cursor-pointer">
    Назад
  </button>
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
</style>
