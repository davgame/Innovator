<template>
  <div class="bg-[#FEFEFE] p-6 border border-[#E3E3E3]/62 rounded-2xl">
    <h2 class="text-lg font-semibold text-gray-800 mb-4">Компетенции</h2>
    <div class="flex flex-wrap gap-2">
      <span
        v-for="skill in skills"
        :key="skill"
        class="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-medium"
      >
        {{ skill }}
      </span>
    </div>
  </div>
</template>

<script setup>
const skills = ['React.JS', 'REST API', 'TailwindCSS', 'HTML', 'CSS', 'Figma']
</script>
