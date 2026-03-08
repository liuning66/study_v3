import { createRouter, createWebHistory } from 'vue-router'
import Xtermal from '../components/Xtermal.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/xtermal',
    },
    {
      path: '/xtermal',
      name: 'xtermal',
      component: Xtermal,
    },
  ],
})

export default router
