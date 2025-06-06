import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Admin from '../views/Admin.vue'
import User from '../views/User.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    meta: { requiresAuth: true, role: 'ADMIN' }
  },
  {
    path: '/user',
    name: 'User',
    component: User,
    meta: { requiresAuth: true, role: 'USER' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  if (!to.meta.requiresAuth) {
    return next()
  }

  const token = localStorage.getItem('akbank_token')
  if (!token) {
    return next({ name: 'Login' })
  }

  try {
    const res = await fetch('https://anhkhoa.tryasp.net/api/Admin/profile', {
      method: 'GET',
      headers: {
        Accept: '*/*',
        Authorization: 'Bearer ' + token
      }
    })
    if (!res.ok) throw new Error('Unauthorized')
    const data = await res.json().catch(() => null)
    const roles = data.roles || data.data?.roles || []
    const requiredRole = to.meta.role
    if (requiredRole && !roles.includes(requiredRole)) {
      throw new Error('Forbidden')
    }
    return next()
  } catch (err) {
    // localStorage.removeItem('akbank_token')
    return next({ name: 'Login' })
  }
})

export default router
