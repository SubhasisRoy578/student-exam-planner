<template>
  <div class="min-h-screen flex items-center justify-center p-6 bg-surface-50 dark:bg-surface-950">
    <div class="w-full max-w-md">
      <!-- Back to login -->
      <RouterLink to="/login" class="inline-flex items-center gap-2 text-sm text-surface-500 hover:text-surface-900 dark:hover:text-white mb-8 transition-colors">
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        Back to sign in
      </RouterLink>

      <!-- Logo -->
      <div class="flex items-center gap-2 mb-6">
        <div class="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center">
          <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
        </div>
        <span class="font-display font-700 text-surface-900 dark:text-white text-lg">ExamPlanner</span>
      </div>

      <h2 class="font-display font-700 text-2xl text-surface-900 dark:text-white mb-1">Create your account</h2>
      <p class="text-surface-500 dark:text-surface-400 text-sm mb-8">Start planning your exam success today.</p>

      <!-- Success -->
      <div v-if="success" class="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 text-sm flex items-start gap-3">
        <svg class="w-5 h-5 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3"/></svg>
        <div>
          <p class="font-semibold">Registration successful!</p>
          <p class="mt-1 text-xs">Please check your email to verify your account before signing in.</p>
        </div>
      </div>

      <form v-else @submit.prevent="handleRegister" class="space-y-4">
        <!-- Error -->
        <div v-if="error" class="px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 text-sm">
          {{ error }}
        </div>

        <div>
          <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Email address</label>
          <input v-model="email" type="email" class="input-field" placeholder="you@example.com" required />
          <p v-if="errs.email" class="text-xs text-red-500 mt-1">{{ errs.email }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Password</label>
          <input v-model="password" type="password" class="input-field" placeholder="Min. 8 characters" required />
          <p v-if="errs.password" class="text-xs text-red-500 mt-1">{{ errs.password }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Confirm Password</label>
          <input v-model="confirm" type="password" class="input-field" placeholder="Repeat your password" required />
          <p v-if="errs.confirm" class="text-xs text-red-500 mt-1">{{ errs.confirm }}</p>
        </div>

        <button type="submit" class="btn-primary w-full py-3 mt-2" :disabled="loading">
          <svg v-if="loading" class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle class="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3"/><path class="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
          {{ loading ? 'Creating account…' : 'Create Account' }}
        </button>
      </form>

      <p class="text-center text-sm text-surface-500 dark:text-surface-400 mt-6">
        Already have an account?
        <RouterLink to="/login" class="text-brand-600 dark:text-brand-400 font-medium hover:underline ml-1">Sign in</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { validate, required, isEmail, minLen, matchVal } from '@/utils/validators'

const authStore = useAuthStore()
const email     = ref('')
const password  = ref('')
const confirm   = ref('')
const loading   = ref(false)
const success   = ref(false)
const error     = ref('')
const errs      = reactive({ email: '', password: '', confirm: '' })

async function handleRegister() {
  errs.email    = validate(email.value,    [required, isEmail])
  errs.password = validate(password.value, [required, minLen(8)])
  errs.confirm  = validate(confirm.value,  [required, matchVal(password.value)])
  if (errs.email || errs.password || errs.confirm) return

  loading.value = true
  error.value   = ''
  try {
    await authStore.register(email.value, password.value)
    success.value = true
  } catch (e: any) {
    error.value = e?.response?.data?.message || 'Registration failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
