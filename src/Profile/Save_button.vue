<template>
  <div class="flex items-center justify-center">
    <div class="flex gap-5">
      <button
        @click="$emit('cancel')"
        class="cursor-pointer lg:px-9 lg:py-3 px-7 py-[10px] border lg:text-[17px] text-sm  border-gray-300 font-medium text-gray-700 lg:rounded-[12px] rounded-[10px] hover:bg-gray-100 transition-colors"
      >
        Отмена
      </button>
      <button
        @click="$emit('save')"
        class="cursor-pointer lg:px-9 lg:py-3 px-7 py-[10px] bg-blue-500 lg:text-[17px] text-sm font-medium text-white lg:rounded-[12px] rounded-[10px] hover:bg-blue-600 transition-colors"
        :disabled="saving"
      >
        {{ saving ? 'Сохранить' : 'Сохранить' }}
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  saving: {
    type: Boolean,
    default: false
  }
})

defineEmits(['cancel', 'save'])
</script>
