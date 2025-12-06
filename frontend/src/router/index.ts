import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Workshop from '../views/Workshop.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/workshop',
      name: 'workshop',
      component: Workshop
    }
  ]
})

export default router

