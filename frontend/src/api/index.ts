import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: { 'Content-Type': 'application/json' }
})

// Request interceptor – attach JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ep_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Response interceptor – handle auth errors
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('ep_token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authAPI = {
  login:         (email: string, password: string) =>
    api.post('/api/auth/login', { email, password }),
  register:      (email: string, password: string) =>
    api.post('/api/auth/register', { email, password }),
  me:            () => api.get('/api/auth/me'),
  forgotPassword: (email: string) =>
    api.post('/api/auth/forgot-password', { email }),
  resetPassword:  (token: string, password: string) =>
    api.post('/api/auth/reset-password', { token, password }),
  changePassword: (current: string, newPass: string) =>
    api.post('/api/auth/change-password', { current, newPass }),
  deleteAccount: () => api.delete('/api/auth/account'),
  exportData:    () => api.get('/api/auth/export'),
}

// ── Plan ──────────────────────────────────────────────────────────────────────
export const planAPI = {
  get:  () => api.get('/api/plan'),
  save: (data: object) => api.post('/api/plan', data),
  update: (data: object) => api.put('/api/plan', data),
}

// ── Progress ─────────────────────────────────────────────────────────────────
export const progressAPI = {
  get:    () => api.get('/api/progress'),
  update: (subject: string, data: object) =>
    api.put(`/api/progress/${subject}`, data),
}

// ── Mocks ────────────────────────────────────────────────────────────────────
export const mockAPI = {
  list:    () => api.get('/api/mocks'),
  create:  (date: string) => api.post('/api/mocks', { date }),
  update:  (id: string, data: object) => api.put(`/api/mocks/${id}`, data),
  remove:  (id: string) => api.delete(`/api/mocks/${id}`),
}

// ── Achievements ─────────────────────────────────────────────────────────────
export const achievementAPI = {
  list:   () => api.get('/api/achievements'),
  add:    (entry: string) => api.post('/api/achievements', { entry }),
  remove: (id: string) => api.delete(`/api/achievements/${id}`),
}
