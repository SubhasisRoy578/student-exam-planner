<template>
  <div class="min-h-screen flex items-center justify-center p-6 bg-surface-50 dark:bg-surface-950">
    <div class="w-full max-w-md">
      <RouterLink to="/login" class="inline-flex items-center gap-2 text-sm text-surface-500 hover:text-surface-900 dark:hover:text-white mb-8 transition-colors">
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        Back to sign in
      </RouterLink>

      <div class="flex items-center gap-2 mb-6">
        <div class="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center">
          <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
        </div>
        <span class="font-display font-700 text-surface-900 dark:text-white text-lg">ExamPlanner</span>
      </div>

      <h2 class="font-display font-700 text-2xl text-surface-900 dark:text-white mb-1">Forgot your password?</h2>
      <p class="text-surface-500 dark:text-surface-400 text-sm mb-8">Enter your email and we'll send you a reset link.</p>

      <div v-if="sent" class="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 text-sm flex items-start gap-3">
        <svg class="w-5 h-5 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="M22 6l-10 7L2 6"/></svg>
        <div>
          <p class="font-semibold">Check your inbox</p>
          <p class="mt-1 text-xs">If an account exists for <strong>{{ email }}</strong>, you'll receive a reset link shortly.</p>
        </div>
      </div>

      <form v-else @submit.prevent="handleSubmit" class="space-y-4">
        <div v-if="error" class="px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 text-sm">{{ error }}</div>
        <div>
          <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Email address</label>
          <input v-model="email" type="email" class="input-field" placeholder="you@example.com" required />
          <p v-if="emailErr" class="text-xs text-red-500 mt-1">{{ emailErr }}</p>
        </div>
        <button type="submit" class="btn-primary w-full py-3" :disabled="loading">
          <svg v-if="loading" class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle class="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3"/><path class="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
          {{ loading ? 'Sending…' : 'Send Reset Link' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { validate, required, isEmail } from '@/utils/validators'

const authStore = useAuthStore()
const email     = ref('')
const loading   = ref(false)
const sent      = ref(false)
const error     = ref('')
const emailErr  = ref('')

async function handleSubmit() {
  emailErr.value = validate(email.value, [required, isEmail])
  if (emailErr.value) return
  loading.value = true
  error.value   = ''
  try {
    await authStore.forgotPassword(email.value)
    sent.value = true
  } catch (e: any) {
    error.value = e?.response?.data?.message || 'Something went wrong. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
