<template>
  <div class="rounded-2xl bg-[#FEFEFE] p-6 border border-[#E3E3E3]/62">
    <h2 class="text-lg font-semibold text-gray-800 mb-4">Роль в объединении</h2>
    <!-- Состояние загрузки -->
    <div v-if="loading" class="text-gray-500 text-center py-4">
      Загрузка...
    </div>
    <div v-if="!editMode" class="space-y-4">
      <div v-if="selectedRole" class="border border-[#E3E3E3]/62 rounded-1xl translate-y-3 flex items-center p-3 mb-7 rounded-2xl lg:px-5">



        <div class="ml-1">
          <p class="lg:text-lg text-md font-medium text-gray-900">{{ selectedRole.name }}</p>
          <p v-if="selectedRole.description" class="text-sm text-gray-500">{{ selectedRole.description }}</p>
        </div>
      </div>
      <div v-else class="text-gray-500 text-center py-4 border border-dashed rounded-2xl">
        Роль не выбрана
      </div>
    </div>

    <!-- Режим редактирования (выпадающий список) -->
    <div v-else class="space-y-4">
      <div v-if="roles.length > 0" class="relative" ref="dropdownRef">
        <!-- Выбранный элемент -->
        <div
          class="border border-[#E3E3E3]/62 rounded-2xl p-3 flex items-center cursor-pointer hover:border-blue-400 transition-colors"
          @click="toggleDropdown"
        >
          <div class="flex-1">
            <p v-if="selectedRole" class="text-[#32383E] font-medium">
              {{ selectedRole.name }}
            </p>
            <p v-else class="text-gray-400">Выберите роль</p>
          </div>
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

        <!-- Выпадающий список -->
        <div
          v-if="isOpen"
          class="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden"
        >
          <div class="py-2 max-h-60 overflow-y-auto">
            <div
              v-for="role in roles"
              :key="role.id"
              @click="selectRole(role)"
              class="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors"
              :class="{ 'bg-blue-50': selectedRole?.id === role.id }"
            >
              <p class="text-[#32383E] font-medium">{{ role.name }}</p>
              <p v-if="role.description" class="text-sm text-gray-500">{{ role.description }}</p>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="text-gray-500 text-center py-4 border border-dashed rounded-2xl">
        Нет доступных ролей для этого объединения
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
  organizationId: {
    type: Number,
    default: null
  },
  initialRoleId: {
    type: Number,
    default: null
  }
})

const emit = defineEmits(['update:role', 'loaded'])

const loading = ref(true)
const isOpen = ref(false)
const dropdownRef = ref(null)
const roles = ref([])
const selectedRole = ref(null)

// Загружаем роли для выбранной организации
const loadRoles = async () => {
  if (!props.organizationId) {
    roles.value = []
    loading.value = false
    return
  }

  loading.value = true
  const { data, error } = await supabase
    .from('roles')
    .select('*')
    .eq('organization_id', props.organizationId)

  if (!error && data) {
    roles.value = data
    // Устанавливаем выбранную роль
    selectedRole.value = data.find(role => role.id === props.initialRoleId) || null

    if (selectedRole.value) {
      emit('update:role', selectedRole.value)
    }
  }
  loading.value = false
}

// Следим за изменением организации
watch(() => props.organizationId, () => {
  loadRoles()
}, { immediate: true })

// Следим за изменением initialRoleId
watch(() => props.initialRoleId, (newId) => {
  if (roles.value.length > 0) {
    const found = roles.value.find(role => role.id === newId)
    if (found) {
      selectedRole.value = found
      emit('update:role', found)
    }
  }
})

const toggleDropdown = () => {
  if (props.editMode) {
    isOpen.value = !isOpen.value
  }
}

const selectRole = (role) => {
  selectedRole.value = role
  emit('update:role', role)
  isOpen.value = false
}

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>


<!-- <h3 class="lg:text-xl text-sm font-medium text-[#4B4B4B]">Активист</h3> -->
