import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/components/Home.vue'
import FAQ from '@/components/FAQ/FAQ.vue' // путь зависит от структуры проекта
import Contact from '@/components/Contact/Contact.vue'
import SliderR from '@/components/Authorization/SliderR.vue'
import Start from '@/components/Pasport/Start.vue'
import CreateTeam from '@/components/Pasport/Create-Team.vue'
import Pasport from '@/components/Pasport/Pasport.vue'
import SupPage from '@/components/SUP/SupPage.vue'
import Error_404 from '@/components/Error/Error_404.vue'
import Error_502 from '@/components/Error/Error_502.vue'
import User from '@/Profile/User.vue'
import UserProfile from '@/Profile/UserProfile.vue'
import Edit_profile from '@/Profile/Edit_profile.vue'
import SupWrapper from '@/components/SUP/SupWrapper.vue'
import KanbanWrapper from '@/components/SUP/KanbanWrapper.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/authorization',
      name:'Sign',
      component:SliderR
    },
    {
      path: '/register',
      name:'Start',
      component:SliderR
    },
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/project/:projectId',
      name: 'Project',
      component: Start
    },
    {
      path: '/sup',
      component: SupWrapper, // 👈 используем обёртку
      children: [
        {
          path: '', // /sup
          name: 'sup-default',
          component: KanbanWrapper // 👈 обёртка для канбана
        },
        {
          path: 'project/:projectId', // /sup/project/48
          name: 'sup-project',
          component: KanbanWrapper, // 👈 обёртка для канбана
          props: true
        }
      ]
    },
    {
      path: '/Next_team',
      name:'Next_time',
      component:CreateTeam,
      props: (route) => ({
        projectName: route.query.name,
        projectId: route.query.id ? parseInt(route.query.id) : null
      })
    },
    {
      path: '/Pasport',
      name:'Pasport',
      component:Pasport,
      props: (route) => ({
        projectName: route.query.name,
        projectId: route.query.id ? parseInt(route.query.id) : null
      })
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
    },
    {
      path: '/sup',
      component: SupPage,
      children: [
        {
          path: '', // /sup - главная страница SUP
          name: 'sup-default',
          component: () => import('@/components/SUP/Kanban.vue') // или другой компонент
        },
        {
          path: 'project/:projectId', // /sup/project/48
          name: 'sup-project',
          component: () => import('@/components/SUP/Kanban.vue'), // 👈 Kanban, не SupPage!
          props: true
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: Error_404
    },
    {
      path: '/502',
      name: '502',
      component: Error_502
    },
    {
      path: '/profile',
      name: 'MyProfile',
      component: User
    },
    {
      path: '/profile/:id',
      name: 'UserProfile',
      component: UserProfile
    },
    {
      path: '/profile/edit',
      name: 'EditProfile',
      component: Edit_profile
    },
  ],
})

export default router
