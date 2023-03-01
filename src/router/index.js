import { createRouter, createWebHistory } from 'vue-router'
import PresentationController from '@/components/PresentationController.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'controller',
      component: PresentationController
    }
  ]
})

export default router
