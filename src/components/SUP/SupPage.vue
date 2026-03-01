<template>
    <div class="flex fixed top-0 left-0 w-full z-50 items-center justify-between px-6 py-6 sm:px-6 md:px-[100px] lg:px-[80px]">
    <div class="ml-auto flex items-center gap-2">
      <Header_sup/>
      </div>
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
import Header_sup from './Header_sup.vue'

const currentProject = ref(null)

const updateProjectName = (newName) => {
  if (currentProject.value) {
    currentProject.value.name = newName
  }
}
</script>
