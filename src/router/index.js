import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
const routes = [
  {
    path: '/',
    name: 'HomeView',
    component: Home
  },
  {
    path: '/about',
    name: 'AboutView',
    component: () => import('../views/AboutView.vue') // lazy loading
  },
  {
    path: '/login',
    name: 'LoginView',
    component: LoginView
  },
  {
    path: '/register',
    name: 'RegisterView',
    component: RegisterView,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
