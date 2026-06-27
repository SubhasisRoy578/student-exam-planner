<template>
  <div class="min-h-screen flex">
    <!-- Left panel -->
    <div class="hidden lg:flex lg:w-[42%] bg-gradient-to-br from-brand-800 via-brand-700 to-brand-600 relative overflow-hidden flex-col justify-between p-12">
      <!-- Background pattern -->
      <div class="absolute inset-0 opacity-10">
        <svg width="100%" height="100%"><defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" stroke-width="1"/></pattern></defs><rect width="100%" height="100%" fill="url(#grid)"/></svg>
      </div>
      <!-- Logo -->
      <div class="relative">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
            <svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          </div>
          <span class="font-display font-700 text-white text-xl">ExamPlanner</span>
        </div>
      </div>
      <!-- Quote -->
      <div class="relative space-y-6">
        <blockquote class="text-2xl font-display font-700 text-white leading-snug">
          "The secret of getting ahead is getting started."
        </blockquote>
        <p class="text-brand-200 text-sm">— Mark Twain</p>
        <!-- Feature pills -->
        <div class="flex flex-wrap gap-2 pt-4">
          <span v-for="f in features" :key="f" class="px-3 py-1.5 rounded-full bg-white/15 text-white text-xs font-medium backdrop-blur">{{ f }}</span>
        </div>
      </div>
    </div>

    <!-- Right panel -->
    <div class="flex-1 flex items-center justify-center p-6 bg-surface-50 dark:bg-surface-950">
      <div class="w-full max-w-md">
        <!-- Mobile logo -->
        <div class="flex items-center gap-2 mb-8 lg:hidden">
          <div class="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center">
            <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          </div>
          <span class="font-display font-700 text-surface-900 dark:text-white text-lg">ExamPlanner</span>
        </div>

        <h2 class="font-display font-700 text-2xl lg:text-3xl text-surface-900 dark:text-white mb-1">Welcome back</h2>
        <p class="text-surface-500 dark:text-surface-400 text-sm mb-8">Sign in to continue your study journey.</p>

        <!-- Error -->
        <div v-if="error" class="mb-5 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 text-sm flex items-center gap-2">
          <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/></svg>
          {{ error }}
        </div>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Email address</label>
            <input v-model="email" type="email" class="input-field" placeholder="you@example.com" required autocomplete="email" />
            <p v-if="emailErr" class="text-xs text-red-500 mt-1">{{ emailErr }}</p>
          </div>
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="block text-sm font-medium text-surface-700 dark:text-surface-300">Password</label>
              <RouterLink to="/forgot-password" class="text-xs text-brand-600 dark:text-brand-400 hover:underline">Forgot password?</RouterLink>
            </div>
            <div class="relative">
              <input v-model="password" :type="showPw ? 'text' : 'password'" class="input-field pr-10" placeholder="••••••••" required autocomplete="current-password" />
              <button type="button" @click="showPw = !showPw" class="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 dark:hover:text-surface-200 transition-colors">
                <svg v-if="!showPw" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                <svg v-else class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22"/></svg>
              </button>
            </div>
          </div>

          <button type="submit" class="btn-primary w-full py-3" :disabled="loading">
            <svg v-if="loading" class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle class="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3"/><path class="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
            {{ loading ? 'Signing in…' : 'Sign In' }}
          </button>
        </form>

        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-surface-200 dark:border-surface-700" /></div>
          <div class="relative flex justify-center text-xs text-surface-400 dark:text-surface-500 bg-surface-50 dark:bg-surface-950 px-2">or</div>
        </div>

        <button @click="guestLogin" class="btn-secondary w-full py-3">
          Continue as Guest
        </button>

        <p class="text-center text-sm text-surface-500 dark:text-surface-400 mt-6">
          Don't have an account?
          <RouterLink to="/register" class="text-brand-600 dark:text-brand-400 font-medium hover:underline ml-1">Create one</RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { validate, isEmail, required } from '@/utils/validators'
import { useToast } from '@/composables/useToast'

const router    = useRouter()
const route     = useRoute()
const authStore = useAuthStore()
const toast     = useToast()

const email    = ref('')
const password = ref('')
const showPw   = ref(false)
const loading  = ref(false)
const error    = ref('')
const emailErr = ref('')

const features = ['Smart Study Planner', 'Subject Tracker', 'Mock Interviews', 'Achievement Streaks']

async function handleLogin() {
  emailErr.value = validate(email.value, [required, isEmail])
  if (emailErr.value) return

  loading.value = true
  error.value   = ''
  try {
    await authStore.login(email.value, password.value)
    toast.success('Welcome back!')
    const redirect = (route.query.redirect as string) || '/dashboard'
    router.push(redirect)
  } catch (e: any) {
    error.value = e?.response?.data?.message || 'Invalid email or password. Please try again.'
  } finally {
    loading.value = false
  }
}

function guestLogin() {
  authStore.loginAsGuest()
  router.push('/dashboard')
}
</script>
