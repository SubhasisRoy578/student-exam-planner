<template>
  <div :class="['flex items-center justify-center', fullscreen ? 'h-full min-h-[200px]' : '']">
    <svg
      :class="['animate-spin text-brand-600 dark:text-brand-400', size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-10 h-10' : 'w-7 h-7']"
      viewBox="0 0 24 24" fill="none"
    >
      <circle class="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3"/>
      <path class="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
    </svg>
    <span v-if="label" class="ml-3 text-sm text-surface-500 dark:text-surface-400">{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ size?: 'sm' | 'md' | 'lg'; label?: string; fullscreen?: boolean }>(), { size: 'md' })
</script>
