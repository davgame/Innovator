import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/components/Home.vue'
import FAQ from '@/components/FAQ/FAQ.vue' // путь зависит от структуры проекта
import Contact from '@/components/Contact/Contact.vue'
import SliderR from '@/components/Authorization/SliderR.vue'
import Start from '@/components/Pasport/Start.vue'
import CreateTeam from '@/components/Pasport/Create-Team.vue'
import Pasport from '@/components/Pasport/Pasport.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/authorization',
      name:'Start',
      component:SliderR
    },
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/project',
      name: 'Project',
      component: Start
    },
    {
      path: '/Next_team',
      name:'Next_time',
      component:CreateTeam
    },
    {
      path: '/Pasport',
      name:'Pasport',
      component:Pasport
    },
    {
      path: '/faq',
      name: 'FAQ',
      component: FAQ
    },
    {
      path: '/contact',
      name: 'Contact',
      component: Contact
    }
  ],
})

export default router
