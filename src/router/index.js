import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import ProfileView from '../views/ProfileView.vue'
import MetricsView from '../views/MetricsView.vue'
const routes = [
  {
    path: '/',
    name: 'HomeView',
    component: Home,
    meta: { requiresAuth: true }
  },
  { 
    path: '/metrics', 
    name: 'metrics', 
    component: MetricsView, 
    meta: { requiresAuth: true } 
  },
  {
    path: '/about',
    name: 'AboutView',
    component: () => import('../views/AboutView.vue'),
    meta: { requiresAuth: true }
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
  {
    path: '/profile',
    name: 'ProfileView',
    component: ProfileView
  },
  {
  path: '/metrics/foods',
  name: 'FoodsMetrics',
  component: () => import('@/components/FoodsMetricCard.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, _, next) => {
  const isAuthenticated = !!localStorage.getItem('user')
  console.log(isAuthenticated)

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'LoginView' })
  } else {
    next()
  }
})

export default router
