<template>
  <Teleport to="body">
    <div class="fixed top-5 right-5 z-[9999] flex flex-col gap-2 w-80 pointer-events-none">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl shadow-card-xl text-sm font-medium"
          :class="typeClass(toast.type)"
        >
          <span class="mt-0.5 shrink-0 text-base">{{ typeIcon(toast.type) }}</span>
          <span class="flex-1 leading-relaxed">{{ toast.message }}</span>
          <button @click="remove(toast.id)" class="shrink-0 opacity-60 hover:opacity-100 transition-opacity ml-1">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useToast } from '@/composables/useToast'

const { toasts, remove } = useToast()

function typeClass(type: string) {
  return {
    success: 'bg-emerald-50 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-700',
    error:   'bg-red-50 dark:bg-red-900/40 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-700',
    info:    'bg-brand-50 dark:bg-brand-900/40 text-brand-800 dark:text-brand-200 border border-brand-200 dark:border-brand-700',
    warning: 'bg-amber-50 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-700',
  }[type] || ''
}

function typeIcon(type: string) {
  return { success: '✓', error: '✕', info: 'i', warning: '!' }[type] || 'i'
}
</script>

<style scoped>
.toast-enter-active { animation: slideRight .25s ease both; }
.toast-leave-active { animation: slideRight .2s ease both reverse; }
@keyframes slideRight {
  from { opacity: 0; transform: translateX(20px); }
  to   { opacity: 1; transform: translateX(0); }
}
</style>
