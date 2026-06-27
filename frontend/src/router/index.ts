import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  { path: '/',               redirect: '/dashboard' },
  { path: '/login',          component: () => import('@/views/Login.vue'),          meta: { public: true  } },
  { path: '/register',       component: () => import('@/views/Register.vue'),       meta: { public: true  } },
  { path: '/forgot-password',component: () => import('@/views/ForgotPassword.vue'), meta: { public: true  } },
  { path: '/dashboard',      component: () => import('@/views/Dashboard.vue'),      meta: { public: false } },
  { path: '/planner',        component: () => import('@/views/StudyPlanner.vue'),   meta: { public: false } },
  { path: '/subjects',       component: () => import('@/views/SubjectTracker.vue'), meta: { public: false } },
  { path: '/mocks',          component: () => import('@/views/MockInterview.vue'),  meta: { public: false } },
  { path: '/achievements',   component: () => import('@/views/Achievements.vue'),   meta: { public: false } },
  { path: '/profile',        component: () => import('@/views/Profile.vue'),        meta: { public: false } },
  { path: '/:pathMatch(.*)*', redirect: '/dashboard' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()
  await auth.checkAuth()
  if (!to.meta.public && !auth.isAuthenticated && !auth.isGuest) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }
  if (to.meta.public && auth.isAuthenticated) {
    return { path: '/dashboard' }
  }
})

export default router
