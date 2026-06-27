<template>
  <AppLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="font-display font-700 text-xl text-surface-900 dark:text-white">Subject Tracker</h2>
          <p class="text-sm text-surface-500 dark:text-surface-400 mt-0.5">Monitor your mastery level across all subjects.</p>
        </div>
        <button @click="showAdd = true" class="btn-primary text-sm gap-2">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
          Add Subject
        </button>
      </div>

      <!-- Overall progress card -->
      <div class="card bg-gradient-to-r from-brand-600 to-brand-700 text-white border-0">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p class="text-brand-200 text-sm font-medium mb-1">Overall Mastery</p>
            <p class="font-display font-700 text-4xl">{{ avgMastery }}%</p>
          </div>
          <div class="w-full sm:w-48">
            <div class="h-3 bg-white/20 rounded-full overflow-hidden">
              <div class="h-full bg-white rounded-full transition-all duration-700" :style="{ width: avgMastery + '%' }" />
            </div>
            <p class="text-brand-200 text-xs mt-1.5">{{ progressStore.subjects.length }} subjects tracked</p>
          </div>
        </div>
      </div>

      <!-- Subject cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="subject in progressStore.subjects"
          :key="subject.name"
          class="card hover:shadow-card-lg transition-shadow duration-200"
        >
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center gap-3">
              <div class="w-3 h-3 rounded-full shrink-0" :style="{ background: subject.color }" />
              <h3 class="font-semibold text-surface-900 dark:text-white text-sm">{{ subject.name }}</h3>
            </div>
            <span :class="['badge text-xs', masteryBadge(subject.mastery)]">
              {{ masteryLabel(subject.mastery) }}
            </span>
          </div>

          <!-- Progress bar -->
          <div class="flex items-center gap-3 mb-4">
            <div class="flex-1 h-2.5 bg-surface-100 dark:bg-surface-700 rounded-full overflow-hidden">
              <div class="h-full rounded-full transition-all duration-700" :style="{ width: subject.mastery + '%', background: subject.color }" />
            </div>
            <span class="text-sm font-semibold text-surface-700 dark:text-surface-300 w-9 text-right">{{ subject.mastery }}%</span>
          </div>

          <!-- Stats row -->
          <div class="flex items-center justify-between text-xs text-surface-500 dark:text-surface-400 mb-4">
            <span>{{ subject.tasks }} tasks completed</span>
            <span>Goal: 90%</span>
          </div>

          <!-- Controls -->
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <span class="text-xs text-surface-500 dark:text-surface-400 w-24 shrink-0">Update mastery:</span>
              <input
                :value="subject.mastery"
                type="range" min="0" max="100"
                class="flex-1 h-1.5 accent-blue-600 cursor-pointer"
                @input="updateMastery(subject.name, +($event.target as HTMLInputElement).value)"
              />
              <span class="text-xs font-semibold text-surface-700 dark:text-surface-300 w-8 text-right">{{ subject.mastery }}%</span>
            </div>
            <button
              @click="incrementTask(subject.name)"
              class="btn-secondary text-xs py-1.5 w-full gap-2"
            >
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
              Mark Task Complete (+1)
            </button>
          </div>

          <!-- Resources -->
          <div class="mt-3 pt-3 border-t border-surface-100 dark:border-surface-700">
            <p class="text-xs text-surface-400 mb-1.5 font-medium">Resources</p>
            <div class="flex flex-wrap gap-2">
              <a
                v-for="res in getResources(subject.name)"
                :key="res.label"
                :href="res.url"
                target="_blank"
                class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-400 hover:text-brand-600 dark:hover:text-brand-400 text-xs transition-colors"
              >
                <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
                {{ res.label }}
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Add Subject modal -->
      <Teleport to="body">
        <Transition name="modal">
          <div v-if="showAdd" class="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div class="absolute inset-0 bg-surface-900/60 backdrop-blur-sm" @click="showAdd = false" />
            <div class="relative bg-white dark:bg-surface-800 rounded-2xl shadow-card-xl p-6 w-full max-w-sm animate-slide-up">
              <h3 class="font-display font-700 text-base text-surface-900 dark:text-white mb-4">Add New Subject</h3>
              <div class="space-y-3">
                <div>
                  <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Subject Name</label>
                  <input v-model="newSubject.name" class="input-field" placeholder="e.g. Discrete Mathematics" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Initial Mastery %</label>
                  <input v-model.number="newSubject.mastery" type="number" min="0" max="100" class="input-field" />
                </div>
              </div>
              <div class="flex gap-3 mt-5">
                <button class="btn-secondary flex-1" @click="showAdd = false">Cancel</button>
                <button class="btn-primary flex-1" @click="addSubject">Add Subject</button>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AppLayout       from '@/components/common/AppLayout.vue'
import { useProgressStore } from '@/stores/progress'
import { nextColor }        from '@/utils/helpers'
import { useToast }         from '@/composables/useToast'

const progressStore = useProgressStore()
const toast         = useToast()
const showAdd       = ref(false)
const newSubject    = ref({ name: '', mastery: 0 })

onMounted(() => progressStore.fetchProgress())

const avgMastery = computed(() => {
  const s = progressStore.subjects
  if (!s.length) return 0
  return Math.round(s.reduce((a, b) => a + b.mastery, 0) / s.length)
})

function masteryLabel(m: number) {
  if (m >= 80) return 'Strong'
  if (m >= 50) return 'Moderate'
  return 'Weak'
}

function masteryBadge(m: number) {
  if (m >= 80) return 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300'
  if (m >= 50) return 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300'
  return 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300'
}

async function updateMastery(name: string, mastery: number) {
  await progressStore.updateProgress(name, { mastery })
}

async function incrementTask(name: string) {
  const s = progressStore.subjects.find((s) => s.name === name)
  if (s) {
    await progressStore.updateProgress(name, { tasks: s.tasks + 1 })
    toast.success(`Task added for ${name}!`)
  }
}

function addSubject() {
  if (!newSubject.value.name.trim()) return
  progressStore.addSubject({ ...newSubject.value, color: nextColor(), tasks: 0 })
  toast.success(`${newSubject.value.name} added!`)
  newSubject.value = { name: '', mastery: 0 }
  showAdd.value    = false
}

const RESOURCES: Record<string, { label: string; url: string }[]> = {
  'Mathematics':         [{ label: 'MIT OCW', url: 'https://ocw.mit.edu/courses/mathematics/' }, { label: 'Khan Academy', url: 'https://khanacademy.org/math' }],
  'Computer Science':    [{ label: 'CS50 Harvard', url: 'https://cs50.harvard.edu' }, { label: 'NPTEL CS', url: 'https://nptel.ac.in/courses/106/' }],
  'Physics':             [{ label: 'Feynman Lectures', url: 'https://feynmanlectures.caltech.edu' }, { label: 'Khan Physics', url: 'https://khanacademy.org/science/physics' }],
  'Chemistry':           [{ label: 'NCERT Chem', url: 'https://ncert.nic.in' }, { label: 'Khan Chemistry', url: 'https://khanacademy.org/science/chemistry' }],
  'English Literature':  [{ label: 'Lit Charts', url: 'https://litcharts.com' }, { label: 'Sparknotes', url: 'https://sparknotes.com' }],
}

function getResources(name: string) {
  return RESOURCES[name] || [{ label: 'Google', url: `https://google.com/search?q=${encodeURIComponent(name + ' study resources')}` }]
}
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity .2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
