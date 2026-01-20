<template>
  <Header/>
  <div class="w-full flex flex-col items-center lg:mt-16 mt-18">
    <!-- Заголовок -->
    <h1 class="lg:text-5xl text-[33px] font-bold lg:mb-12 mb-8">Команда проекта <span class="text-[#222222]"></span></h1>
  <!-- Контейнер команды -->
    <div
      class="mx-12 lg:w-[430px] lg:h-[270px]
             w-[300px] h-[220px]
             mt-22 lg:mt-27
             bg-[#F6F8FA] border border-[#CBCBCB]
             rounded-[20px] fixed overflow-y-auto"
    >

      <!-- ПУСТОЕ СОСТОЯНИЕ -->
      <div
        v-if="selectedUsers.length === 0"
        class="w-full h-full flex flex-col items-center justify-center"
      >
        <img src="/src/assets/images/users_o.png" class="w-[72px]" />
        <p class="text-[15px] mt-[7px] text-[#6C727C]/61 font-medium">
          Создать команду
        </p>
      </div>

      <!-- СПИСОК ПОЛЬЗОВАТЕЛЕЙ -->
      <div v-else class="flex flex-col gap-2 p-3">
        <div
          v-for="user in selectedUsers"
          :key="user.id"
          class="flex items-center gap-3 bg-white rounded-xl px-3 py-2"
        >
          <img :src="user.avatar" class="w-8 h-8 rounded-full" />
          <div class="flex-1">
            <p class="text-sm font-medium">{{ user.name }}</p>
            <p class="text-xs text-gray-400">{{ user.role }}</p>
          </div>
          <button @click="removeUser(user.id)">✕</button>
        </div>
      </div>
    </div>
  <button @click="showModal = true" class="btn-more border-1 border-[#222222] hover:border-[#4286F7] text-[#222222] hover:text-[#4286F7] font-medium lg:mb-58 mb-52 py-1 lg:px-51 px-35 text-[20px] rounded-[18px] fixed bottom-10 left-1/2 transform -translate-x-1/2 z-40 transition-colors duration-300 cursor-pointer">
      +
  </button>
  <!-- Модальное окно (компонент Add-User.vue) -->
    <AddUser
      v-if="showModal"
      @close="showModal = false"
      @confirm="setUsers"
    />
  </div>
  <!-- Кнопка "Подробнее" -->
    <router-link to="/Next_team" @click="isOpen = false">
  <button @click="modalOpen = true" class="btn-more bg-[#222222] hover:bg-[#4286F7] text-white font-medium lg:mb-25 mb-24 py-4 lg:px-28 px-30 text-[20px] rounded-[18px] fixed bottom-10 left-1/2 transform -translate-x-1/2 z-40 transition-colors duration-300 cursor-pointer">
    Далее
  </button>
  </router-link>
  <!-- Кнопка "Подробнее" -->
    <router-link to="/Next_team" @click="isOpen = false">
  <button @click="showModal = true" class="btn-more border-1 border-[#222222] hover:bg-gray-100 text-[#222222] font-medium lg:mb-3 mb-2 py-4 lg:px-28 px-30 text-[20px] rounded-[18px] fixed bottom-10 left-1/2 transform -translate-x-1/2 z-40 transition-colors duration-300 cursor-pointer">
    Назад
  </button>
  </router-link>
</template>

<script>
import Header from '../Home/Header.vue'
import AddUser from './Add-User.vue'

export default {
  components: { Header, AddUser },

  data() {
    return {
      showModal: false,
      selectedUsers: []
    }
  },

  methods: {
    setUsers(users) {
      this.selectedUsers = users
    },
    removeUser(id) {
      this.selectedUsers = this.selectedUsers.filter(u => u.id !== id)
    }
  }
}
</script>
