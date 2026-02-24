<template>
  <div class="rounded-2xl bg-[#FEFEFE] p-6 border border-[#E3E3E3]/62">
    <h2 class="text-lg font-semibold text-gray-800 mb-4">Роль в объединении</h2>
    <div class="space-y-4">
      <div class="border border-[#E3E3E3]/62 rounded-1xl translate-y-3 flex items-center p-3 mb-7 rounded-2xl lg:px-5">


        <h3 class="lg:text-xl text-sm font-medium text-[#4B4B4B]">Активист</h3>

        </div>
      </div>
    </div>

</template>

<script setup>
defineProps({
  role: {
    type: String,
    default: 'Активист'
  }
})
</script>
