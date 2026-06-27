<template>
  <div class="card bg-gradient-to-br from-brand-600 to-brand-800 text-white border-0">
    <p class="text-xs font-semibold uppercase tracking-widest text-brand-200 mb-3">Time to Exam</p>
    <div v-if="hasDate" class="flex items-end gap-4">
      <div v-for="unit in units" :key="unit.label" class="text-center">
        <div class="text-3xl lg:text-4xl font-display font-700 tabular-nums leading-none">
          {{ String(unit.value).padStart(2, '0') }}
        </div>
        <div class="text-xs text-brand-200 mt-1 font-medium">{{ unit.label }}</div>
      </div>
    </div>
    <div v-else class="text-brand-200 text-sm">
      No exam date set. <RouterLink to="/planner" class="underline text-white font-medium">Set it now</RouterLink>
    </div>
    <div v-if="examDate" class="mt-3 text-brand-200 text-xs">
      {{ formattedDate }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import { formatCountdown, formatDate } from '@/utils/helpers'

const props = defineProps<{ examDate: string }>()
const hasDate = computed(() => !!props.examDate)

const tick = ref(formatCountdown(props.examDate))
let interval: ReturnType<typeof setInterval>
onMounted(() => { interval = setInterval(() => { tick.value = formatCountdown(props.examDate) }, 1000) })
onUnmounted(() => clearInterval(interval))

const units = computed(() => [
  { label: 'Days',    value: tick.value.days },
  { label: 'Hours',   value: tick.value.hours },
  { label: 'Minutes', value: tick.value.minutes },
  { label: 'Seconds', value: tick.value.seconds },
])
const formattedDate = computed(() => props.examDate ? `Exam date: ${formatDate(props.examDate)}` : '')
</script>
