import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface User { id: string; name: string; email: string; verified: boolean }

// ---------------------------------------------------------------------------
// Tiny local "database" helpers stored in localStorage
// ---------------------------------------------------------------------------
const USERS_KEY    = 'ep_users'
const SESSION_KEY  = 'ep_session'
const GUEST_KEY    = 'ep_guest'

function getUsers(): Record<string, { id: string; name: string; email: string; password: string }> {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || '{}') } catch { return {} }
}

function saveUsers(users: ReturnType<typeof getUsers>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function generateId() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
}

// ---------------------------------------------------------------------------

export const useAuthStore = defineStore('auth', () => {
  // Restore session from localStorage on load
  const _session = (() => {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null') } catch { return null }
  })()

  const user     = ref<User | null>(_session ?? null)
  const isGuest  = ref(localStorage.getItem(GUEST_KEY) === 'true')

  const isAuthenticated = computed(() => (!!user.value && !isGuest.value) || isGuest.value)

  // ── Login ──────────────────────────────────────────────────────────────────
  function login(email: string, password: string) {
    const users = getUsers()
    const found = Object.values(users).find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    )
    if (!found) throw new Error('Invalid email or password.')

    const loggedIn: User = { id: found.id, name: found.name, email: found.email, verified: true }
    user.value   = loggedIn
    isGuest.value = false
    localStorage.setItem(SESSION_KEY, JSON.stringify(loggedIn))
    localStorage.removeItem(GUEST_KEY)
  }

  // ── Register ───────────────────────────────────────────────────────────────
  function register(name: string, email: string, password: string) {
    const users = getUsers()
    const exists = Object.values(users).some(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    )
    if (exists) throw new Error('An account with this email already exists.')

    const id = generateId()
    users[id] = { id, name, email, password }
    saveUsers(users)
  }

  // ── Forgot / Reset (no-op stubs — no email server) ────────────────────────
  function forgotPassword(_email: string) {
    // No email server available; UI shows a friendly message
  }

  function resetPassword(_tok: string, _password: string) {
    // No email server available
  }

  // ── Change password (for Profile page) ─────────────────────────────────────
  function changePassword(currentPass: string, newPass: string) {
    if (!user.value || isGuest.value) throw new Error('Not authenticated.')
    const users = getUsers()
    const record = users[user.value.id]
    if (!record) throw new Error('User not found.')
    if (record.password !== currentPass) throw new Error('Current password is incorrect.')
    record.password = newPass
    saveUsers(users)
  }

  // ── Update profile name ────────────────────────────────────────────────────
  function updateProfile(name: string) {
    if (!user.value || isGuest.value) throw new Error('Not authenticated.')
    const users = getUsers()
    const record = users[user.value.id]
    if (record) { record.name = name; saveUsers(users) }
    user.value = { ...user.value, name }
    localStorage.setItem(SESSION_KEY, JSON.stringify(user.value))
  }

  // ── Delete account ─────────────────────────────────────────────────────────
  function deleteAccount() {
    if (!user.value || isGuest.value) return
    const users = getUsers()
    delete users[user.value.id]
    saveUsers(users)
    logout()
  }

  // ── Guest ──────────────────────────────────────────────────────────────────
  function loginAsGuest() {
    isGuest.value = true
    user.value    = { id: 'guest', name: 'Guest', email: 'guest@demo.com', verified: false }
    localStorage.setItem(GUEST_KEY, 'true')
    localStorage.removeItem(SESSION_KEY)
  }

  // ── CheckAuth (used by router guard on page reload) ────────────────────────
  function checkAuth() {
    if (isGuest.value) {
      user.value = user.value ?? { id: 'guest', name: 'Guest', email: 'guest@demo.com', verified: false }
    }
    // user is already rehydrated from localStorage in the initialiser above
  }

  // ── Logout ─────────────────────────────────────────────────────────────────
  function logout() {
    user.value    = null
    isGuest.value = false
    localStorage.removeItem(SESSION_KEY)
    localStorage.removeItem(GUEST_KEY)
  }

  return {
    user, isGuest, isAuthenticated,
    login, register, forgotPassword, resetPassword,
    changePassword, updateProfile, deleteAccount,
    checkAuth, loginAsGuest, logout,
  }
})
