<template>
    <div class="flex fixed top-0 left-0 w-full z-50 items-center justify-between px-6 py-6 sm:px-6 md:px-[100px] lg:px-[80px]">
    <div class="ml-auto flex items-center gap-2">
        <RouterLink
          to="/authorization" @click="isOpen = false"
          class="desktop-button mr-[3px] text-black focus:ring-4 focus:ring-blue-300 font-rubik font-medium rounded-[10px] border-1 text-sm px-[35px] py-2.5 focus:outline-none border-[#9A9A9A]/20 hover:bg-gray-100"
        >
          Войти
        </RouterLink>
        <a
          href="#"
          class="desktop-button mr-[15px] text-white bg-[#4286F7] hover:bg-[#222222] focus:ring-4 focus:ring-blue-300 font-rubik border-[#9A9A9A]/20 font-medium rounded-[10px] text-sm px-5 py-2.5 focus:outline-none"
        >
          Регистрация
        </a>
      </div>
      <button
        @click="isOpen = !isOpen"
        type="button"
        class="cursor-pointer inline-flex items-center justify-center p-2 w-10 h-10 text-sm text-[#111827] border-1 border-[#9A9A9A]/20 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
        aria-controls="navbar-hamburger"
        aria-expanded="false"
      >
        <span class="sr-only">Open main menu</span>
        <svg
          class="w-5 h-5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 17 14"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M1 1h15M1 7h15M1 13h15"
          />
        </svg>
      </button>
  </div>

  <div class="flex h-screen">
    <!-- Левая панель -->
    <Panel @project-selected="currentProject = $event" />

    <!-- Правая часть -->
    <div class="flex-1 flex flex-col mt-33">
      <!-- Заголовок проекта через Name_pg -->
      <Name_pg
        v-if="currentProject"
        :project="currentProject"
        @update-name="updateProjectName"
      />

      <!-- Контент -->
      <div class="flex-1 p-6 bg-white">
          <Kanban/>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Panel from './Panel.vue'
import Name_pg from './Name_pg.vue'
import Kanban from './Kanban.vue'

const currentProject = ref(null)

const updateProjectName = (newName) => {
  if (currentProject.value) {
    currentProject.value.name = newName
  }
}
</script>
