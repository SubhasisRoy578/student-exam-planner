<template>
  <div class="card overflow-x-auto">
    <div class="min-w-[640px]">
      <!-- Day headers -->
      <div class="grid grid-cols-7 gap-2 mb-3">
        <div
          v-for="(day, i) in weekDays"
          :key="day"
          class="text-center"
        >
          <p class="text-xs font-semibold uppercase tracking-wide text-surface-400 dark:text-surface-500 mb-1">{{ day }}</p>
          <p :class="['w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mx-auto', isToday(i) ? 'bg-brand-600 text-white' : 'text-surface-700 dark:text-surface-300']">
            {{ weekDates[i] }}
          </p>
        </div>
      </div>

      <!-- Task cells -->
      <div class="grid grid-cols-7 gap-2">
        <div v-for="(day, i) in weekDays" :key="day" class="space-y-1.5">
          <div
            v-for="task in getTasksForDay(i)"
            :key="task.id"
            class="rounded-lg px-2 py-1.5 text-xs font-medium leading-tight"
            :style="{ background: task.color + '22', color: task.color, borderLeft: `3px solid ${task.color}` }"
          >
            {{ task.label }}
          </div>
          <div v-if="getTasksForDay(i).length === 0" class="h-8 rounded-lg border-2 border-dashed border-surface-200 dark:border-surface-700" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useProgressStore } from '@/stores/progress'

const progressStore = useProgressStore()
const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const today = new Date()
const startOfWeek = computed(() => {
  const d = new Date(today)
  const day = d.getDay() || 7
  d.setDate(d.getDate() - day + 1)
  return d
})

const weekDates = computed(() =>
  Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek.value)
    d.setDate(d.getDate() + i)
    return d.getDate()
  })
)

function isToday(i: number): boolean {
  const d = new Date(startOfWeek.value)
  d.setDate(d.getDate() + i)
  return d.toDateString() === today.toDateString()
}

// Distribute subjects evenly across week days
function getTasksForDay(dayIndex: number) {
  const subjects = progressStore.subjects || []
  return subjects.filter((_: any, idx: number) => idx % 7 === dayIndex).map((s: any) => ({
    id:    s.name,
    label: s.name,
    color: s.color || '#3B82F6'
  }))
}
</script>
