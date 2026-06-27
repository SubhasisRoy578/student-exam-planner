<template>
  <header class="sticky top-0 z-20 bg-white/80 dark:bg-surface-900/80 backdrop-blur-md border-b border-surface-100 dark:border-surface-800 px-4 lg:px-6 h-14 flex items-center justify-between gap-4">
    <!-- Mobile menu toggle -->
    <button
      class="lg:hidden p-2 rounded-lg text-surface-500 hover:text-surface-900 dark:hover:text-white hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
      @click="$emit('menu')"
    >
      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M3 12h18M3 6h18M3 18h18"/>
      </svg>
    </button>

    <!-- Page title -->
    <h1 class="font-display font-700 text-surface-900 dark:text-white text-base lg:text-lg hidden sm:block">{{ title }}</h1>

    <div class="flex items-center gap-2 ml-auto">
      <!-- Dark mode toggle -->
      <button
        @click="$emit('toggleDark')"
        class="p-2 rounded-xl text-surface-500 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
        :title="isDark ? 'Light mode' : 'Dark mode'"
      >
        <svg v-if="!isDark" class="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
        </svg>
        <svg v-else class="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
        </svg>
      </button>

      <!-- Exam countdown chip -->
      <div v-if="planStore.plan.examDate" class="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 text-xs font-semibold">
        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
        </svg>
        {{ daysLeft }}d to exam
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePlanStore } from '@/stores/plan'
import { daysUntil } from '@/utils/helpers'

defineProps<{ title: string; isDark?: boolean }>()
defineEmits<{ menu: []; toggleDark: [] }>()

const planStore = usePlanStore()
const daysLeft  = computed(() => daysUntil(planStore.plan.examDate))
</script>
