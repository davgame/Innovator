<template>
  <!-- Overlay -->
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-2 sm:p-0"> <!--p-2 sm:p-0 добавляет отсуп по ширине-->

    <!-- Modal -->
    <div
      class="bg-white w-full max-w-[420px] sm:w-[420px] max-h-[80vh] rounded-[22px] p-4 flex flex-col relative"
    >

      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-[18px] font-semibold">Добавить участника</h2>
        <button
          @click="$emit('close')"
          class="w-8 h-8 flex items-center justify-center
                 rounded-full hover:bg-gray-100 text-gray-400"
        >
          ✕
        </button>
      </div>

      <!-- Search -->
      <div class="relative mb-3">
        <input
          v-model="search"
          type="text"
          placeholder="Начните ввод..."
          class="w-full border border-[#CBCBCB]
                 rounded-[12px] px-4 py-2 text-sm
                 focus:outline-none focus:border-[#4286F7]"
        />
      </div>

      <!-- Users list (scroll) -->
      <div
        class="flex-1 overflow-y-auto space-y-2 pr-1"
        :style="{ maxHeight: filteredUsers.length > 4 ? '260px' : 'auto' }"
      >
        <div
          v-for="user in filteredUsers"
          :key="user.id"
          class="flex items-center gap-3 p-2 rounded-[14px]
                 hover:bg-[#F6F8FA] cursor-pointer"
          @click="toggleUser(user)"
        >
          <img
            :src="user.avatar"
            class="w-9 h-9 rounded-full"
          />

          <div class="flex-1">
            <p class="text-[14px] font-medium">{{ user.name }}</p>
            <p class="text-[12px] text-[#6C727C]">{{ user.role }}</p>
          </div>

          <!-- Checkbox -->
          <div
            class="w-5 h-5 rounded-[6px] border flex items-center justify-center"
            :class="isSelected(user)
              ? 'bg-[#4286F7] border-[#4286F7]'
              : 'border-[#CBCBCB]'"
          >
            <div
              v-if="isSelected(user)"
              class="w-2.5 h-2.5 bg-white rounded-[3px]"
            />
          </div>
        </div>
      </div>

      <!-- Selected preview -->
      <div
        v-if="selectedUsers.length"
        class="flex gap-2 flex-wrap mt-3"
      >
        <div
          v-for="user in selectedUsers"
          :key="user.id"
          class="flex items-center gap-2
                 bg-[#F6F8FA] px-2 py-1 rounded-full"
        >
          <img :src="user.avatar" class="w-5 h-5 rounded-full" />
          <span class="text-[12px]">{{ user.name }}</span>
        </div>
      </div>

      <!-- Footer button -->
      <button
        @click="confirm"
        class="mt-4 bg-[#222222] hover:bg-[#4286F7]
               text-white py-2 rounded-[14px]
               text-[15px] font-medium transition-colors"
      >
        Готово
      </button>

    </div>
  </div>
</template>

<script>
import { users } from './user';

export default {
  emits: ['close', 'confirm'],

  data() {
    return {
      search: '',
      selectedUsers: []
    }
  },

  computed: {
    filteredUsers() {
      return users.filter(user =>
        user.name.toLowerCase().includes(this.search.toLowerCase())
      )
    }
  },

  methods: {
    isSelected(user) {
      return this.selectedUsers.some(u => u.id === user.id)
    },

    toggleUser(user) {
      if (this.isSelected(user)) {
        this.selectedUsers = this.selectedUsers.filter(
          u => u.id !== user.id
        )
      } else {
        this.selectedUsers.push(user)
      }
    },

    confirm() {
      this.$emit('confirm', this.selectedUsers)
      this.$emit('close')
    }
  }
}
</script>
