import { createRouter, createWebHistory } from 'vue-router'
import { useGameStore } from '../stores/gameStore'

const routes = [
  {
    path: '/',
    name: 'treasure-hunt',
    component: () => import('../views/TreasureHunt.vue')
  },
  {
    path: '/wrapped',
    name: 'wrapped',
    component: () => import('../views/Wrapped.vue'),
    beforeEnter: (to, from, next) => {
      const store = useGameStore()
      if (store.allPuzzlesCompleted) {
        next()
      } else {
        next({ name: 'treasure-hunt' })
      }
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
