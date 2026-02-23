<!-- src/views/UserProfile.vue -->
<template>
  <Header/>
  <div class="px-20 mt-21">
    <UserProfileDisplay :user-id="userId" />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import Header from '@/components/Home/Header.vue'
import UserProfileDisplay from './UserProfileDisplay.vue'

const route = useRoute()
const userId = route.params.id
</script>
