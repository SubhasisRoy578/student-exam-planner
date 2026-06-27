<template>
  <div class="card flex items-center gap-4">
    <div :class="['w-11 h-11 rounded-xl flex items-center justify-center shrink-0', iconBg]">
      <slot name="icon" />
    </div>
    <div class="min-w-0">
      <p class="text-2xl font-display font-700 text-surface-900 dark:text-white leading-none">{{ value }}</p>
      <p class="text-xs text-surface-500 dark:text-surface-400 mt-1">{{ label }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ value: string | number; label: string; iconBg: string }>()
</script>
