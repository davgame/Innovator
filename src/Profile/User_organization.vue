<template>
  <div class="rounded-2xl bg-[#FEFEFE] lg:p-6 p-4 border border-[#E3E3E3]/62">
    <h2 class="text-xl font-semibold text-gray-800 lg:mb-4 mb-4 mt-2">Объединение</h2>

    <!-- Режим просмотра (по умолчанию) -->
 <!-- Режим просмотра (по умолчанию) -->
    <div v-if="!editMode" class="space-y-4">
      <div v-if="selectedOrganization" class="border border-[#E3E3E3]/62 rounded-2xl flex items-center p-3">
        <img
          :src="selectedOrganization.logo_url"
          class="lg:w-[50px] lg:h-[50px] w-[40px] h-[40px] ml-2 rounded-full object-cover"
          alt=""
        >
        <div class="translate-x-4">
          <h3 class="lg:text-xl text-md font-semibold text-gray-900">
            {{ selectedOrganization.name }}
          </h3>
          <p class="text-gray-500 lg:text-[15px] text-[10px]">
            {{ selectedOrganization.type }}
          </p>
        </div>
      </div>
      <div v-else class="text-gray-500 text-center py-4">
        Загрузка...
      </div>
    </div>

    <!-- Режим редактирования (выпадающий список) -->
    <div v-else class="space-y-4">
      <div v-if="selectedOrganization" class="relative" ref="dropdownRef">
        <!-- Выбранный элемент -->
        <div
          class="lg:px-3 border border-[#E3E3E3]/62 rounded-2xl lg:p-2 p-2 flex items-center space-x-1 lg:space-x-2 cursor-pointer hover:border-blue-400 transition-colors"
          @click="toggleDropdown"
        >
          <img
            :src="selectedOrganization.logo_url"
            :alt="selectedOrganization.name"
            class="lg:w-[50px] w-[53px] lg:h-[50px] h-[53px] rounded-full"
          />
          <div class="flex-1">
            <h3 class="text-[#32383E] lg:text-[20px] text-[16px] pl-3 font-medium">
              {{ selectedOrganization.name }}
            </h3>
            <p class="text-[14px] text-[#4286F7] pl-3">{{ selectedOrganization.type }}</p>
          </div>
          <div class="pr-2">
            <svg
              class="w-5 h-5 text-gray-500 transition-transform duration-200"
              :class="{'rotate-180': isOpen }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </div>
        </div>

        <!-- Выпадающий список -->
<!-- Выпадающий список -->
<div
  v-if="isOpen"
  class="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden"
>
  <div class="py-2 max-h-60 overflow-y-auto">
    <div
      v-for="item in organizations"
      :key="item.id"
      @click="selectItem(item)"
      class="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors flex items-center gap-3"
      :class="{ 'bg-blue-50': selectedOrganization?.id === item.id }"
    >
      <!-- Контейнер для картинки с фиксированным размером -->
      <div class="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-gray-100">
        <img
          :src="item.logo_url"
          :alt="item.name"
          class="w-full h-full object-cover"
          @error="handleImageError"
        />
      </div>

      <div class="flex-1 min-w-0">
        <h4 class="text-[#32383E] text-[16px] font-medium truncate">{{ item.name }}</h4>
        <p class="text-[14px] text-[#4286F7] truncate">{{ item.type }}</p>
      </div>

      <svg
        v-if="selectedOrganization?.id === item.id"
        class="w-5 h-5 text-blue-500 flex-shrink-0"
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
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { supabase } from '@/lib/supabase'

const props = defineProps({
  editMode: {
    type: Boolean,
    default: false
  },
  initialOrganizationId: {
    type: Number,
    default: 1
  }
})

const isOpen = ref(false)
const dropdownRef = ref(null)
const organizations = ref([])
const selectedOrganization = ref(null)
const emit = defineEmits(['update:organization', 'loaded'])  // 👈 добавь 'loaded'

// Загружаем организации из БД
// ... внутри loadOrganizations
const loadOrganizations = async () => {
  const { data, error } = await supabase
    .from('organizations')
    .select('*')

  if (!error && data) {
    organizations.value = data
    console.log('initialOrganizationId:', props.initialOrganizationId)  // 👈 отладка
    console.log('Available orgs:', data.map(o => ({ id: o.id, name: o.name })))

    // Устанавливаем выбранную организацию
    selectedOrganization.value = data.find(org => org.id === props.initialOrganizationId) || data[0]
    console.log('Selected:', selectedOrganization.value)  // 👈 отладка

    if (selectedOrganization.value) {
      emit('update:organization', selectedOrganization.value)
      emit('loaded', selectedOrganization.value)
    }
  }
}

// Следим за изменением initialOrganizationId
watch(() => props.initialOrganizationId, (newId) => {
  if (organizations.value.length > 0) {
    const found = organizations.value.find(org => org.id === newId)
    if (found) {
      selectedOrganization.value = found
      emit('update:organization', found)
    }
  }
})

const toggleDropdown = () => {
  if (props.editMode) {
    isOpen.value = !isOpen.value
  }
}

const selectItem = (item) => {
  selectedOrganization.value = item
  emit('update:organization', item)
  isOpen.value = false
}

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  loadOrganizations()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
