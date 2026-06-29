<template>
  <AppLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="font-display font-700 text-xl text-surface-900 dark:text-white">Study Planner</h2>
          <p class="text-sm text-surface-500 dark:text-surface-400 mt-0.5">Configure your exam goals and auto-generate your schedule.</p>
        </div>
        <button @click="printSchedule" class="btn-secondary text-sm gap-2">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
          Print Schedule
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <!-- Plan form -->
        <div class="lg:col-span-2 space-y-4">
          <div class="card">
            <h3 class="font-display font-700 text-base text-surface-900 dark:text-white mb-5">Exam Configuration</h3>
            <form @submit.prevent="savePlan" class="space-y-4">
              <!-- Exam date -->
              <div>
                <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Exam Date</label>
                <input v-model="form.examDate" type="date" class="input-field" :min="today" required />
              </div>
              <!-- Goal -->
              <div>
                <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Your Goal</label>
                <input v-model="form.goal" type="text" class="input-field" placeholder="e.g. Score 90%+ in GATE CS 2026" />
              </div>
              <!-- Daily hours -->
              <div>
                <div class="flex items-center justify-between mb-1.5">
                  <label class="block text-sm font-medium text-surface-700 dark:text-surface-300">Daily Study Hours</label>
                  <span class="text-brand-600 dark:text-brand-400 font-semibold text-sm">{{ form.dailyHours }}h</span>
                </div>
                <input v-model.number="form.dailyHours" type="range" min="1" max="12" step="0.5"
                  class="w-full h-2 rounded-full bg-surface-200 dark:bg-surface-700 accent-brand-600 cursor-pointer" />
                <div class="flex justify-between text-xs text-surface-400 mt-1"><span>1h</span><span>12h</span></div>
              </div>
              <!-- Weak subjects -->
              <div>
                <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Weak Subjects</label>
                <TagInput v-model="form.weakSubjects" placeholder="Type a subject and press Enter…" />
              </div>

              <button type="submit" class="btn-primary w-full" :disabled="planStore.loading">
                <svg v-if="planStore.loading" class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle class="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3"/><path class="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                {{ planStore.loading ? 'Saving…' : 'Save & Generate Schedule' }}
              </button>
            </form>
          </div>

          <!-- Time allocation -->
          <div class="card" v-if="form.weakSubjects.length">
            <h3 class="font-display font-700 text-sm text-surface-900 dark:text-white mb-4">Daily Time Allocation</h3>
            <div class="space-y-3">
              <div v-for="(sub, i) in form.weakSubjects" :key="sub">
                <div class="flex justify-between text-xs text-surface-600 dark:text-surface-400 mb-1">
                  <span>{{ sub }}</span>
                  <span class="font-semibold">{{ allocation(i) }}h</span>
                </div>
                <div class="h-2 bg-surface-100 dark:bg-surface-700 rounded-full overflow-hidden">
                  <div class="h-full rounded-full transition-all duration-500" :style="{ width: (allocation(i) / form.dailyHours * 100) + '%', background: subjectColors[i % subjectColors.length] }" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Weekly calendar -->
        <div class="lg:col-span-3 space-y-4">
          <div class="card">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-display font-700 text-base text-surface-900 dark:text-white">Weekly Schedule</h3>
              <span v-if="form.examDate" class="badge bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300">
                {{ daysLeft }} days left
              </span>
            </div>
            <WeeklyCalendar />
          </div>

          <!-- Tips -->
          <div class="card border-l-4 border-brand-500">
            <h4 class="font-semibold text-sm text-surface-900 dark:text-white mb-2">Study Tip</h4>
            <p class="text-sm text-surface-600 dark:text-surface-400 leading-relaxed">
              Allocate more time to weaker subjects early in the week when your focus is highest. Use Sunday for review and light revision only.
            </p>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AppLayout    from '@/components/common/AppLayout.vue'
import TagInput     from '@/components/planner/TagInput.vue'
import WeeklyCalendar from '@components/planner/WeeklyCalendar.vue'
import { usePlanStore } from '@/stores/plan'
import { daysUntil }    from '@/utils/helpers'
import { useToast }     from '@/composables/useToast'

const planStore = usePlanStore()
const toast     = useToast()
const today     = new Date().toISOString().split('T')[0]

const form = ref({
  examDate:     '',
  goal:         '',
  dailyHours:   4,
  weakSubjects: [] as string[]
})

const daysLeft = computed(() => daysUntil(form.value.examDate))
const subjectColors = ['#3b82f6','#f97316','#8b5cf6','#10b981','#ef4444','#f59e0b']

onMounted(async () => {
  await planStore.fetchPlan()
  const p = planStore.plan
  form.value = {
    examDate:     p.examDate     || '',
    goal:         p.goal         || '',
    dailyHours:   p.dailyHours   || 4,
    weakSubjects: p.weakSubjects || [],
  }
})

function allocation(idx: number): number {
  const total = form.value.weakSubjects.length
  if (!total) return 0
  const base = Math.floor(form.value.dailyHours / total * 10) / 10
  return base
}

async function savePlan() {
  try {
    await planStore.savePlan({ ...form.value })
    toast.success('Study plan saved successfully!')
  } catch {
    toast.error('Failed to save plan. Changes kept locally.')
  }
}

function printSchedule() { window.print() }
</script>
