<template>
  <div class="card">
    <div class="flex items-center justify-between mb-4">
      <h3 class="font-display font-700 text-base text-surface-900 dark:text-white">Today's Tasks</h3>
      <span class="badge bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300">{{ done }}/{{ tasks.length }}</span>
    </div>
    <ul class="space-y-2">
      <li
        v-for="(task, i) in tasks"
        :key="i"
        class="flex items-center gap-3 p-2.5 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors cursor-pointer group"
        @click="toggleTask(i)"
      >
        <div :class="['w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all', task.done ? 'bg-brand-600 border-brand-600' : 'border-surface-300 dark:border-surface-600 group-hover:border-brand-400']">
          <svg v-if="task.done" class="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
        </div>
        <span :class="['text-sm flex-1', task.done ? 'line-through text-surface-400 dark:text-surface-500' : 'text-surface-700 dark:text-surface-200']">
          {{ task.text }}
        </span>
        <span class="text-xs text-surface-400 shrink-0">{{ task.subject }}</span>
      </li>
    </ul>
    <div v-if="tasks.length === 0" class="text-sm text-surface-400 text-center py-4">
      No tasks scheduled for today.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Task { text: string; subject: string; done: boolean }

const tasks = ref<Task[]>([
  { text: 'Complete Calculus Chapter 5 exercises',      subject: 'Math',    done: false },
  { text: 'Read OS scheduling algorithms — 30 min',    subject: 'CS',      done: true  },
  { text: 'Solve 10 LeetCode medium problems',          subject: 'CS',      done: false },
  { text: 'Review Chemistry periodic table notes',      subject: 'Chem',    done: false },
  { text: 'Practice English essay writing — 45 min',    subject: 'English', done: false },
])

const done = computed(() => tasks.value.filter((t) => t.done).length)
function toggleTask(i: number) { tasks.value[i].done = !tasks.value[i].done }
</script>
