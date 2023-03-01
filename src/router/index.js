import { createRouter, createWebHistory } from 'vue-router'
import PresentationController from '@/components/PresentationController.vue'
import PresentationReceiver from '@/components/PresentationReceiver.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'controller',
      component: PresentationController
    },
    {
      path: '/receiver',
      name: 'receiver',
      component: PresentationReceiver
    }
  ]
})

export default router
