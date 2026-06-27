<template>
  <div>
    <div v-if="showLabel" class="flex justify-between text-xs text-surface-500 dark:text-surface-400 mb-1.5">
      <span>{{ label }}</span>
      <span class="font-semibold text-surface-700 dark:text-surface-300">{{ value }}%</span>
    </div>
    <div class="w-full bg-surface-100 dark:bg-surface-700 rounded-full overflow-hidden" :style="{ height: height + 'px' }">
      <div
        class="h-full rounded-full transition-all duration-700 ease-out"
        :style="{ width: clamp(value) + '%', background: color }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { clamp } from '@/utils/helpers'

withDefaults(defineProps<{
  value: number
  label?: string
  color?: string
  height?: number
  showLabel?: boolean
}>(), {
  color:     '#2563eb',
  height:    8,
  showLabel: false
})
</script>
