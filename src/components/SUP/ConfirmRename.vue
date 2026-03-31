<template>
  <Teleport to="body">
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="fixed inset-0 bg-[#D3D3D3]/80" @click="close"></div>

      <div class="relative bg-white rounded-xl p-6 w-96">
        <h3 class="text-lg font-semibold mb-4">Переименовать проект</h3>

        <input
          ref="inputRef"
          v-model="localName"
          @keyup.enter="confirm"
          placeholder="Введите новое название"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <div class="flex justify-end gap-4 mt-4">
          <button
            @click="close"
            class="cursor-pointer px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            Отмена
          </button>

          <button
            @click="confirm"
            class="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
  show: Boolean,
  project: Object
})

const emit = defineEmits(['close', 'confirm'])

const localName = ref('')
const inputRef = ref(null)

// при открытии — прокидываем имя
watch(() => props.show, async (val) => {
  if (val && props.project) {
    localName.value = props.project.name

    await nextTick()
    inputRef.value?.focus()
    inputRef.value?.select()
  }
})

const close = () => emit('close')

const confirm = () => {
  if (!localName.value.trim()) return

  emit('confirm', {
    id: props.project.id,
    name: localName.value.trim()
  })
}
</script>
