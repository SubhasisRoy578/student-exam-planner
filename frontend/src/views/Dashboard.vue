<template>
  <AppLayout>
    <div class="space-y-6">
      <!-- Welcome banner -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="font-display font-700 text-2xl text-surface-900 dark:text-white">
            Good {{ greeting }}, {{ firstName }}
          </h2>
          <p class="text-surface-500 dark:text-surface-400 text-sm mt-1">
            {{ today }} — Keep pushing forward.
          </p>
        </div>
        <div class="flex items-center gap-2">
          <RouterLink to="/planner" class="btn-primary text-sm">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
            Update Plan
          </RouterLink>
          <RouterLink to="/mocks" class="btn-secondary text-sm">Schedule Mock</RouterLink>
        </div>
      </div>

      <!-- Countdown + Stats -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div class="lg:col-span-1">
          <CountdownTimer :exam-date="planStore.plan.examDate || '2025-12-15'" />
        </div>
        <div class="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard :value="daysLeft" label="Days Remaining" icon-bg="bg-brand-100 dark:bg-brand-900/40">
            <template #icon>
              <svg class="w-5 h-5 text-brand-600 dark:text-brand-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            </template>
          </StatCard>
          <StatCard :value="progressStore.subjects.length" label="Subjects" icon-bg="bg-accent-100 dark:bg-accent-900/30">
            <template #icon>
              <svg class="w-5 h-5 text-accent-600 dark:text-accent-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            </template>
          </StatCard>
          <StatCard :value="avgProgress + '%'" label="Avg. Progress" icon-bg="bg-emerald-100 dark:bg-emerald-900/30">
            <template #icon>
              <svg class="w-5 h-5 text-emerald-600 dark:text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3"/></svg>
            </template>
          </StatCard>
          <StatCard :value="achievementStore.streak" label="Day Streak" icon-bg="bg-amber-100 dark:bg-amber-900/30">
            <template #icon>
              <svg class="w-5 h-5 text-amber-600 dark:text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            </template>
          </StatCard>
        </div>
      </div>

      <!-- Main content grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <!-- Today's tasks -->
        <div class="lg:col-span-2">
          <DailyTaskList />
        </div>

        <!-- Right sidebar -->
        <div class="space-y-4">
          <!-- Streak card -->
          <div class="card">
            <div class="flex items-center justify-between mb-3">
              <h3 class="font-display font-700 text-sm text-surface-900 dark:text-white">Achievement Streak</h3>
              <div class="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-xs font-semibold">
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                {{ achievementStore.streak }}
              </div>
            </div>
            <div class="flex gap-1">
              <div
                v-for="i in 7"
                :key="i"
                :class="['flex-1 h-1.5 rounded-full', i <= achievementStore.streak ? 'bg-amber-500' : 'bg-surface-100 dark:bg-surface-700']"
              />
            </div>
            <p class="text-xs text-surface-500 dark:text-surface-400 mt-3 italic leading-relaxed">
              "{{ achievementStore.quote.text }}"
            </p>
          </div>

          <!-- Subject progress -->
          <div class="card">
            <h3 class="font-display font-700 text-sm text-surface-900 dark:text-white mb-3">Subject Mastery</h3>
            <div class="space-y-3">
              <div v-for="subject in progressStore.subjects.slice(0,4)" :key="subject.name">
                <ProgressBar
                  :value="subject.mastery"
                  :label="subject.name"
                  :color="subject.color"
                  :show-label="true"
                  :height="6"
                />
              </div>
            </div>
            <RouterLink to="/subjects" class="mt-4 text-xs text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1">
              View all subjects
              <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </RouterLink>
          </div>

          <!-- Quick actions -->
          <div class="card">
            <h3 class="font-display font-700 text-sm text-surface-900 dark:text-white mb-3">Quick Actions</h3>
            <div class="space-y-2">
              <RouterLink v-for="action in quickActions" :key="action.label" :to="action.path"
                class="flex items-center gap-3 p-2.5 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors group">
                <div :class="['w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0', action.bg]">
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path :d="action.icon"/></svg>
                </div>
                <span class="text-sm text-surface-700 dark:text-surface-300 group-hover:text-surface-900 dark:group-hover:text-white font-medium">{{ action.label }}</span>
                <svg class="w-3.5 h-3.5 text-surface-300 dark:text-surface-600 ml-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import AppLayout from '@/components/common/AppLayout.vue'
import CountdownTimer from '@/components/dashboard/CountdownTimer.vue'
import StatCard       from '@/components/dashboard/StatCard.vue'
import DailyTaskList  from '@/components/dashboard/DailyTaskList.vue'
import ProgressBar    from '@/components/dashboard/ProgressBar.vue'
import { useAuthStore }        from '@/stores/auth'
import { usePlanStore }        from '@/stores/plan'
import { useProgressStore }    from '@/stores/progress'
import { useAchievementStore } from '@/stores/achievement'
import { daysUntil, formatDate } from '@/utils/helpers'

const authStore        = useAuthStore()
const planStore        = usePlanStore()
const progressStore    = useProgressStore()
const achievementStore = useAchievementStore()

onMounted(() => {
  planStore.fetchPlan()
  progressStore.fetchProgress()
  achievementStore.fetchAchievements()
})

const now   = new Date()
const hour  = now.getHours()
const greeting = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening'
const today    = formatDate(now, { weekday: 'long', month: 'long', day: 'numeric' })
const firstName = computed(() => authStore.user?.email?.split('@')[0] || 'Student')
const daysLeft  = computed(() => daysUntil(planStore.plan.examDate || '2025-12-15'))
const avgProgress = computed(() => {
  const subs = progressStore.subjects
  if (!subs.length) return 0
  return Math.round(subs.reduce((acc, s) => acc + s.mastery, 0) / subs.length)
})

const quickActions = [
  { label: 'Update Study Plan',   path: '/planner',      bg: 'bg-brand-600',  icon: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01' },
  { label: 'Schedule Mock Test',  path: '/mocks',        bg: 'bg-accent-500', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { label: 'Add Achievement',     path: '/achievements', bg: 'bg-amber-500',  icon: 'M8.21 13.89L7 23l5-3 5 3-1.21-9.12M12 2l2.09 6.26H21l-5.47 3.97 2.09 6.26L12 14.52l-5.62 3.97 2.09-6.26L3 8.26h6.91z' },
  { label: 'Track Subjects',      path: '/subjects',     bg: 'bg-emerald-600',icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' },
]
</script>
