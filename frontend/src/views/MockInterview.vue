<template>
  <AppLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="font-display font-700 text-xl text-surface-900 dark:text-white">Mock Interviews</h2>
          <p class="text-sm text-surface-500 dark:text-surface-400 mt-0.5">Schedule practice sessions and track your performance.</p>
        </div>
        <button @click="showSchedule = true" class="btn-primary text-sm gap-2">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
          Schedule Mock
        </button>
      </div>

      <!-- Stats row -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div class="card text-center">
          <p class="text-2xl font-display font-700 text-surface-900 dark:text-white">{{ totalMocks }}</p>
          <p class="text-xs text-surface-500 dark:text-surface-400 mt-1">Total Mocks</p>
        </div>
        <div class="card text-center">
          <p class="text-2xl font-display font-700 text-accent-600 dark:text-accent-400">{{ upcoming }}</p>
          <p class="text-xs text-surface-500 dark:text-surface-400 mt-1">Upcoming</p>
        </div>
        <div class="card text-center">
          <p class="text-2xl font-display font-700 text-emerald-600 dark:text-emerald-400">{{ completed }}</p>
          <p class="text-xs text-surface-500 dark:text-surface-400 mt-1">Completed</p>
        </div>
        <div class="card text-center">
          <p class="text-2xl font-display font-700 text-brand-600 dark:text-brand-400">{{ avgScore }}<span class="text-sm font-normal">%</span></p>
          <p class="text-xs text-surface-500 dark:text-surface-400 mt-1">Avg. Score</p>
        </div>
      </div>

      <!-- Interview list -->
      <div class="card">
        <h3 class="font-display font-700 text-base text-surface-900 dark:text-white mb-4">All Sessions</h3>
        <div class="space-y-3">
          <div
            v-for="mock in mockStore.interviews"
            :key="mock.id"
            class="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl bg-surface-50 dark:bg-surface-700/40 border border-surface-100 dark:border-surface-700 hover:border-brand-200 dark:hover:border-brand-700 transition-colors"
          >
            <!-- Date -->
            <div class="flex items-center gap-3 sm:w-40 shrink-0">
              <div :class="['w-10 h-10 rounded-xl flex items-center justify-center shrink-0', mock.status === 'upcoming' ? 'bg-accent-100 dark:bg-accent-900/30' : 'bg-emerald-100 dark:bg-emerald-900/30']">
                <svg class="w-5 h-5" :class="mock.status === 'upcoming' ? 'text-accent-600 dark:text-accent-400' : 'text-emerald-600 dark:text-emerald-400'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path v-if="mock.status === 'upcoming'" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  <path v-else d="M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3"/>
                </svg>
              </div>
              <div>
                <p class="text-sm font-semibold text-surface-900 dark:text-white">{{ formatDate(mock.date) }}</p>
                <span :class="['badge text-xs', mock.status === 'upcoming' ? 'bg-accent-100 dark:bg-accent-900/40 text-accent-700 dark:text-accent-300' : 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300']">
                  {{ mock.status === 'upcoming' ? 'Upcoming' : 'Completed' }}
                </span>
              </div>
            </div>

            <!-- Score & feedback -->
            <div class="flex-1 min-w-0">
              <div v-if="mock.status === 'completed'" class="flex items-center gap-3">
                <div class="flex items-center gap-1.5">
                  <div class="h-2 w-20 bg-surface-200 dark:bg-surface-600 rounded-full overflow-hidden">
                    <div class="h-full rounded-full transition-all" :style="{ width: (mock.score || 0) + '%', background: scoreColor(mock.score || 0) }" />
                  </div>
                  <span class="text-sm font-semibold" :style="{ color: scoreColor(mock.score || 0) }">{{ mock.score }}%</span>
                </div>
              </div>
              <p v-if="mock.feedback" class="text-xs text-surface-500 dark:text-surface-400 mt-1 truncate">{{ mock.feedback }}</p>
              <p v-else-if="mock.status === 'upcoming'" class="text-xs text-surface-400 italic">No feedback yet</p>
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-2 shrink-0">
              <button
                v-if="mock.status === 'upcoming'"
                @click="openFeedback(mock)"
                class="btn-secondary text-xs py-1.5 px-3"
              >
                Add Result
              </button>
              <button
                v-else
                @click="openFeedback(mock)"
                class="btn-secondary text-xs py-1.5 px-3"
              >
                Edit
              </button>
              <button @click="confirmDelete(mock.id)" class="p-2 rounded-lg text-surface-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6m5 0V4a1 1 0 011-1h2a1 1 0 011 1v2"/></svg>
              </button>
            </div>
          </div>

          <div v-if="!mockStore.interviews.length" class="text-center py-10 text-surface-400 dark:text-surface-500 text-sm">
            No mock interviews yet. Schedule your first one!
          </div>
        </div>
      </div>
    </div>

    <!-- Schedule modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showSchedule" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-surface-900/60 backdrop-blur-sm" @click="showSchedule = false" />
          <div class="relative bg-white dark:bg-surface-800 rounded-2xl shadow-card-xl p-6 w-full max-w-sm animate-slide-up">
            <h3 class="font-display font-700 text-base text-surface-900 dark:text-white mb-4">Schedule Mock Interview</h3>
            <div>
              <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Interview Date</label>
              <input v-model="newDate" type="date" class="input-field" :min="todayStr" required />
            </div>
            <div class="flex gap-3 mt-5">
              <button class="btn-secondary flex-1" @click="showSchedule = false">Cancel</button>
              <button class="btn-primary flex-1" @click="schedule">Schedule</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Feedback modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showFeedback" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-surface-900/60 backdrop-blur-sm" @click="showFeedback = false" />
          <div class="relative bg-white dark:bg-surface-800 rounded-2xl shadow-card-xl p-6 w-full max-w-sm animate-slide-up">
            <h3 class="font-display font-700 text-base text-surface-900 dark:text-white mb-4">Add Result</h3>
            <div class="space-y-4">
              <div>
                <div class="flex justify-between mb-1.5">
                  <label class="text-sm font-medium text-surface-700 dark:text-surface-300">Score</label>
                  <span class="text-brand-600 dark:text-brand-400 font-semibold text-sm">{{ editScore }}%</span>
                </div>
                <input v-model.number="editScore" type="range" min="0" max="100" class="w-full h-2 accent-brand-600" />
              </div>
              <div>
                <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Feedback</label>
                <textarea v-model="editFeedback" class="input-field resize-none" rows="3" placeholder="What went well? What to improve?" />
              </div>
            </div>
            <div class="flex gap-3 mt-5">
              <button class="btn-secondary flex-1" @click="showFeedback = false">Cancel</button>
              <button class="btn-primary flex-1" @click="saveFeedback">Save Result</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <ConfirmDialog v-model="showConfirm" title="Delete Mock Interview" message="This will permanently remove this interview session." @confirm="deleteMock" />
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AppLayout     from '@/components/common/AppLayout.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import { useMockStore, type MockInterview } from '@/stores/mock'
import { useToast }  from '@/composables/useToast'
import { formatDate } from '@/utils/helpers'

const mockStore = useMockStore()
const toast     = useToast()
onMounted(() => mockStore.fetchMocks())

const todayStr     = new Date().toISOString().split('T')[0]
const showSchedule = ref(false)
const newDate      = ref('')
const showFeedback = ref(false)
const editId       = ref('')
const editScore    = ref(75)
const editFeedback = ref('')
const showConfirm  = ref(false)
const deleteId     = ref('')

const totalMocks = computed(() => mockStore.interviews.length)
const upcoming   = computed(() => mockStore.interviews.filter((m) => m.status === 'upcoming').length)
const completed  = computed(() => mockStore.interviews.filter((m) => m.status === 'completed').length)
const avgScore   = computed(() => {
  const done = mockStore.interviews.filter((m) => m.score !== null)
  if (!done.length) return 0
  return Math.round(done.reduce((a, m) => a + (m.score || 0), 0) / done.length)
})

function scoreColor(s: number) {
  if (s >= 75) return '#10b981'
  if (s >= 50) return '#f59e0b'
  return '#ef4444'
}

async function schedule() {
  if (!newDate.value) return
  await mockStore.scheduleMock(newDate.value)
  toast.success('Mock interview scheduled!')
  showSchedule.value = false
  newDate.value = ''
}

function openFeedback(mock: MockInterview) {
  editId.value       = mock.id
  editScore.value    = mock.score || 75
  editFeedback.value = mock.feedback || ''
  showFeedback.value = true
}

async function saveFeedback() {
  await mockStore.updateMock(editId.value, { status: 'completed', score: editScore.value, feedback: editFeedback.value })
  toast.success('Result saved!')
  showFeedback.value = false
}

function confirmDelete(id: string) {
  deleteId.value  = id
  showConfirm.value = true
}

async function deleteMock() {
  await mockStore.deleteMock(deleteId.value)
  toast.success('Interview removed.')
}
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity .2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
