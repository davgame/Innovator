<!-- src/views/UserProfile.vue -->
<template>
  <Header/>
<UserProfileDisplay :user-id="userId"/>
</template>

<script setup>
import { useRoute } from 'vue-router'
import Header from '@/components/Home/Header.vue'
import UserProfileDisplay from './UserProfileDisplay.vue'

const route = useRoute()
const userId = route.params.id
</script>
<UserProfileDisplay :user-id="userId"/>
