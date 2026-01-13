import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/components/Home.vue'
import FAQ from '@/components/FAQ/FAQ.vue' // путь зависит от структуры проекта


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/faq',
      name: 'FAQ',
      component: FAQ
    }
  ],
})

export default router
