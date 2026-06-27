<template>
  <AppLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="font-display font-700 text-xl text-surface-900 dark:text-white">Achievements</h2>
          <p class="text-sm text-surface-500 dark:text-surface-400 mt-0.5">
            Log your wins, track your streak, and stay motivated.
          </p>
        </div>
        <button @click="showAdd = true" class="btn-primary text-sm">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          Log Achievement
        </button>
      </div>

      <!-- Stats banner -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <!-- Streak card -->
        <div class="card flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center shrink-0">
            <svg class="w-6 h-6 text-amber-600 dark:text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
          </div>
          <div>
            <p class="font-display font-700 text-2xl text-surface-900 dark:text-white">{{ achievementStore.streak }}</p>
            <p class="text-xs text-surface-500 dark:text-surface-400">Day Streak</p>
          </div>
        </div>

        <!-- Total entries card -->
        <div class="card flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center shrink-0">
            <svg class="w-6 h-6 text-brand-600 dark:text-brand-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12M12 2l2.09 6.26H21l-5.47 3.97 2.09 6.26L12 14.52l-5.62 3.97 2.09-6.26L3 8.26h6.91z"/>
            </svg>
          </div>
          <div>
            <p class="font-display font-700 text-2xl text-surface-900 dark:text-white">{{ achievementStore.achievements.length }}</p>
            <p class="text-xs text-surface-500 dark:text-surface-400">Total Entries</p>
          </div>
        </div>

        <!-- Today's count -->
        <div class="card flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center shrink-0">
            <svg class="w-6 h-6 text-emerald-600 dark:text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3"/>
            </svg>
          </div>
          <div>
            <p class="font-display font-700 text-2xl text-surface-900 dark:text-white">{{ todayCount }}</p>
            <p class="text-xs text-surface-500 dark:text-surface-400">Logged Today</p>
          </div>
        </div>
      </div>

      <!-- Motivational quote -->
      <div class="card border-l-4 border-amber-400 bg-amber-50/50 dark:bg-amber-900/10">
        <div class="flex items-start gap-3">
          <svg class="w-5 h-5 text-amber-500 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
          </svg>
          <div>
            <p class="text-sm text-surface-700 dark:text-surface-300 italic leading-relaxed">
              "{{ achievementStore.quote.text }}"
            </p>
            <p class="text-xs text-surface-400 mt-1.5 font-medium">— {{ achievementStore.quote.author }}</p>
          </div>
        </div>
      </div>

      <!-- Streak dots (7-day view) -->
      <div class="card">
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-display font-700 text-sm text-surface-900 dark:text-white">Last 7 Days</h3>
          <span class="text-xs text-surface-400">{{ achievementStore.streak }} day streak</span>
        </div>
        <div class="flex gap-2">
          <div
            v-for="(day, i) in weekDays"
            :key="i"
            class="flex-1 flex flex-col items-center gap-1.5"
          >
            <div
              :class="[
                'w-full h-8 rounded-xl flex items-center justify-center transition-all duration-300',
                day.hasEntry
                  ? 'bg-amber-400 dark:bg-amber-500 shadow-sm'
                  : 'bg-surface-100 dark:bg-surface-700'
              ]"
            >
              <svg v-if="day.hasEntry" class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
            </div>
            <span class="text-[10px] text-surface-400 dark:text-surface-500">{{ day.label }}</span>
          </div>
        </div>
      </div>

      <!-- Achievement list -->
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-display font-700 text-base text-surface-900 dark:text-white">Achievement Log</h3>
          <div class="flex items-center gap-2">
            <input
              v-model="search"
              type="text"
              class="input-field py-1.5 text-xs w-40"
              placeholder="Search…"
            />
          </div>
        </div>

        <!-- Empty state -->
        <div v-if="!filtered.length" class="text-center py-12">
          <div class="w-16 h-16 rounded-2xl bg-surface-100 dark:bg-surface-700 flex items-center justify-center mx-auto mb-3">
            <svg class="w-8 h-8 text-surface-300 dark:text-surface-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12M12 2l2.09 6.26H21l-5.47 3.97 2.09 6.26L12 14.52l-5.62 3.97 2.09-6.26L3 8.26h6.91z"/>
            </svg>
          </div>
          <p class="text-sm text-surface-500 dark:text-surface-400">No achievements yet. Log your first win!</p>
        </div>

        <!-- Timeline -->
        <div v-else class="relative">
          <!-- Vertical line -->
          <div class="absolute left-[19px] top-0 bottom-0 w-px bg-surface-100 dark:bg-surface-700" />

          <div class="space-y-3">
            <div
              v-for="achievement in filtered"
              :key="achievement.id"
              class="relative flex items-start gap-4 pl-10 group"
            >
              <!-- Timeline dot -->
              <div class="absolute left-0 w-10 flex items-start justify-center pt-1">
                <div class="w-5 h-5 rounded-full bg-white dark:bg-surface-800 border-2 border-brand-400 dark:border-brand-500 flex items-center justify-center shrink-0 group-hover:border-brand-600 transition-colors">
                  <div class="w-2 h-2 rounded-full bg-brand-400 dark:bg-brand-500 group-hover:bg-brand-600 transition-colors" />
                </div>
              </div>

              <!-- Card -->
              <div class="flex-1 min-w-0 p-3.5 rounded-xl bg-surface-50 dark:bg-surface-700/40 border border-surface-100 dark:border-surface-700 hover:border-brand-200 dark:hover:border-brand-700 transition-colors">
                <div class="flex items-start justify-between gap-2">
                  <p class="text-sm text-surface-800 dark:text-surface-200 leading-relaxed flex-1">{{ achievement.entry }}</p>
                  <button
                    @click="confirmDelete(achievement.id)"
                    class="p-1.5 rounded-lg text-surface-300 dark:text-surface-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors shrink-0 opacity-0 group-hover:opacity-100"
                  >
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6m5 0V4a1 1 0 011-1h2a1 1 0 011 1v2"/>
                    </svg>
                  </button>
                </div>
                <p class="text-xs text-surface-400 dark:text-surface-500 mt-1.5">{{ formatDate(achievement.date) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Achievement modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showAdd" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-surface-900/60 backdrop-blur-sm" @click="showAdd = false" />
          <div class="relative bg-white dark:bg-surface-800 rounded-2xl shadow-card-xl p-6 w-full max-w-md animate-slide-up">
            <h3 class="font-display font-700 text-base text-surface-900 dark:text-white mb-1">Log Achievement</h3>
            <p class="text-xs text-surface-500 dark:text-surface-400 mb-4">Describe what you accomplished today.</p>

            <textarea
              v-model="newEntry"
              class="input-field resize-none"
              rows="4"
              placeholder="e.g. Completed full chapter on Calculus, scored 90% in mock test…"
              @keydown.enter.ctrl="addAchievement"
            />
            <p class="text-xs text-surface-400 mt-1.5">Ctrl+Enter to save</p>

            <!-- Quick templates -->
            <div class="mt-3">
              <p class="text-xs font-medium text-surface-500 dark:text-surface-400 mb-2">Quick templates:</p>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="tpl in templates"
                  :key="tpl"
                  @click="newEntry = tpl"
                  class="text-xs px-2.5 py-1 rounded-lg bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-400 hover:bg-brand-50 dark:hover:bg-brand-900/30 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                >
                  {{ tpl }}
                </button>
              </div>
            </div>

            <div class="flex gap-3 mt-5">
              <button class="btn-secondary flex-1" @click="showAdd = false">Cancel</button>
              <button class="btn-primary flex-1" :disabled="!newEntry.trim()" @click="addAchievement">
                Save Achievement
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <ConfirmDialog
      v-model="showConfirm"
      title="Delete Achievement"
      message="Are you sure you want to remove this entry from your log?"
      @confirm="deleteAchievement"
    />
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AppLayout     from '@/components/common/AppLayout.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import { useAchievementStore } from '@/stores/achievement'
import { useToast }            from '@/composables/useToast'
import { formatDate }          from '@/utils/helpers'

const achievementStore = useAchievementStore()
const toast            = useToast()

onMounted(() => achievementStore.fetchAchievements())

const search     = ref('')
const showAdd    = ref(false)
const newEntry   = ref('')
const showConfirm = ref(false)
const deleteId   = ref('')

const todayStr = new Date().toISOString().split('T')[0]

const todayCount = computed(() =>
  achievementStore.achievements.filter((a) => a.date === todayStr).length
)

const filtered = computed(() => {
  const q = search.value.toLowerCase()
  if (!q) return achievementStore.achievements
  return achievementStore.achievements.filter((a) => a.entry.toLowerCase().includes(q))
})

// Last 7 days bar
const weekDays = computed(() => {
  const days = []
  const entryDates = new Set(achievementStore.achievements.map((a) => a.date))
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const iso = d.toISOString().split('T')[0]
    days.push({
      label: d.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 1),
      hasEntry: entryDates.has(iso),
    })
  }
  return days
})

const templates = [
  'Completed a full chapter',
  'Scored 80%+ in mock test',
  'Finished 20 practice problems',
  'Revised weak topics',
  'Watched lecture series',
]

async function addAchievement() {
  if (!newEntry.value.trim()) return
  await achievementStore.addAchievement(newEntry.value.trim())
  toast.success('Achievement logged!')
  newEntry.value = ''
  showAdd.value  = false
}

function confirmDelete(id: string) {
  deleteId.value   = id
  showConfirm.value = true
}

async function deleteAchievement() {
  await achievementStore.deleteAchievement(deleteId.value)
  toast.success('Entry removed.')
}
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity .2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
