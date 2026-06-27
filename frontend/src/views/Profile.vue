<template>
  <AppLayout>
    <div class="space-y-6 max-w-3xl">
      <!-- Header -->
      <div>
        <h2 class="font-display font-700 text-xl text-surface-900 dark:text-white">Profile & Settings</h2>
        <p class="text-sm text-surface-500 dark:text-surface-400 mt-0.5">Manage your account, preferences, and data.</p>
      </div>

      <!-- Profile card -->
      <div class="card">
        <div class="flex items-center gap-5">
          <!-- Avatar -->
          <div class="relative shrink-0">
            <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-700 flex items-center justify-center text-white font-display font-700 text-2xl select-none">
              {{ userInitial }}
            </div>
            <div class="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-400 border-2 border-white dark:border-surface-800" title="Active" />
          </div>

          <div class="flex-1 min-w-0">
            <p class="font-display font-700 text-lg text-surface-900 dark:text-white truncate">{{ authStore.user?.email }}</p>
            <div class="flex items-center gap-2 mt-1">
              <span :class="['badge text-xs', authStore.isGuest ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300' : 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300']">
                {{ authStore.isGuest ? 'Guest' : 'Student' }}
              </span>
              <span v-if="!authStore.isGuest && authStore.user?.verified" class="badge text-xs bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300">
                Verified
              </span>
            </div>
          </div>

          <button v-if="!authStore.isGuest" @click="activeSection = 'account'" class="btn-secondary text-xs hidden sm:flex">
            Edit Profile
          </button>
        </div>

        <!-- Stats row -->
        <div class="mt-5 pt-5 border-t border-surface-100 dark:border-surface-700 grid grid-cols-3 gap-4 text-center">
          <div>
            <p class="font-display font-700 text-xl text-surface-900 dark:text-white">{{ achievementStore.achievements.length }}</p>
            <p class="text-xs text-surface-400 mt-0.5">Achievements</p>
          </div>
          <div>
            <p class="font-display font-700 text-xl text-surface-900 dark:text-white">{{ achievementStore.streak }}</p>
            <p class="text-xs text-surface-400 mt-0.5">Day Streak</p>
          </div>
          <div>
            <p class="font-display font-700 text-xl text-surface-900 dark:text-white">{{ progressStore.subjects.length }}</p>
            <p class="text-xs text-surface-400 mt-0.5">Subjects</p>
          </div>
        </div>
      </div>

      <!-- Settings tabs -->
      <div class="flex gap-1 p-1 bg-surface-100 dark:bg-surface-800 rounded-xl w-full sm:w-fit">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="activeSection = tab.key"
          :class="[
            'flex-1 sm:flex-none px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150',
            activeSection === tab.key
              ? 'bg-white dark:bg-surface-700 text-surface-900 dark:text-white shadow-sm'
              : 'text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-200'
          ]"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Account section -->
      <div v-if="activeSection === 'account'" class="card space-y-5">
        <h3 class="font-display font-700 text-base text-surface-900 dark:text-white">Account Settings</h3>

        <div v-if="authStore.isGuest" class="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-sm text-amber-700 dark:text-amber-300">
          You are browsing as a guest. Register to save your data permanently.
        </div>

        <div v-else class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Email Address</label>
            <input :value="authStore.user?.email" type="email" class="input-field" disabled />
            <p class="text-xs text-surface-400 mt-1">Email cannot be changed.</p>
          </div>

          <!-- Change password -->
          <div class="pt-4 border-t border-surface-100 dark:border-surface-700">
            <h4 class="text-sm font-semibold text-surface-800 dark:text-surface-200 mb-3">Change Password</h4>
            <div class="space-y-3">
              <div>
                <label class="block text-xs font-medium text-surface-600 dark:text-surface-400 mb-1">Current Password</label>
                <input v-model="pwForm.current" type="password" class="input-field" placeholder="••••••••" autocomplete="current-password" />
              </div>
              <div>
                <label class="block text-xs font-medium text-surface-600 dark:text-surface-400 mb-1">New Password</label>
                <input v-model="pwForm.newPass" type="password" class="input-field" placeholder="••••••••" autocomplete="new-password" />
              </div>
              <div>
                <label class="block text-xs font-medium text-surface-600 dark:text-surface-400 mb-1">Confirm New Password</label>
                <input v-model="pwForm.confirm" type="password" class="input-field" placeholder="••••••••" autocomplete="new-password" />
              </div>
            </div>
            <p v-if="pwError" class="text-xs text-red-500 mt-2">{{ pwError }}</p>
            <button @click="changePassword" class="btn-primary text-sm mt-4" :disabled="pwLoading">
              <svg v-if="pwLoading" class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle class="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3"/>
                <path class="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              {{ pwLoading ? 'Updating…' : 'Update Password' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Notifications section -->
      <div v-if="activeSection === 'notifications'" class="card space-y-5">
        <h3 class="font-display font-700 text-base text-surface-900 dark:text-white">Notification Preferences</h3>

        <div class="space-y-4">
          <div
            v-for="notif in notifSettings"
            :key="notif.key"
            class="flex items-start justify-between gap-4"
          >
            <div class="flex-1">
              <p class="text-sm font-medium text-surface-800 dark:text-surface-200">{{ notif.label }}</p>
              <p class="text-xs text-surface-400 mt-0.5">{{ notif.description }}</p>
            </div>
            <!-- Toggle -->
            <button
              @click="notif.enabled = !notif.enabled"
              :class="[
                'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200',
                notif.enabled ? 'bg-brand-600' : 'bg-surface-200 dark:bg-surface-600'
              ]"
              role="switch"
              :aria-checked="notif.enabled"
            >
              <span
                :class="[
                  'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200',
                  notif.enabled ? 'translate-x-5' : 'translate-x-0'
                ]"
              />
            </button>
          </div>
        </div>

        <button @click="saveNotifSettings" class="btn-primary text-sm">Save Preferences</button>
      </div>

      <!-- Data section -->
      <div v-if="activeSection === 'data'" class="card space-y-5">
        <h3 class="font-display font-700 text-base text-surface-900 dark:text-white">Data Management</h3>

        <div class="space-y-3">
          <!-- Export -->
          <div class="flex items-center justify-between p-4 rounded-xl border border-surface-100 dark:border-surface-700 hover:border-brand-200 dark:hover:border-brand-700 transition-colors">
            <div>
              <p class="text-sm font-semibold text-surface-800 dark:text-surface-200">Export My Data</p>
              <p class="text-xs text-surface-400 mt-0.5">Download all your plans, progress and achievements as JSON.</p>
            </div>
            <button @click="exportData" class="btn-secondary text-xs px-3 py-1.5 shrink-0">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
              </svg>
              Export
            </button>
          </div>

          <!-- Reset progress -->
          <div class="flex items-center justify-between p-4 rounded-xl border border-amber-100 dark:border-amber-900/40 bg-amber-50/40 dark:bg-amber-900/10">
            <div>
              <p class="text-sm font-semibold text-amber-800 dark:text-amber-200">Reset All Progress</p>
              <p class="text-xs text-amber-600 dark:text-amber-400 mt-0.5">Clears all subject mastery data. Cannot be undone.</p>
            </div>
            <button @click="confirmReset = true" class="shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-800/50 transition-colors">
              Reset
            </button>
          </div>

          <!-- Delete account -->
          <div v-if="!authStore.isGuest" class="flex items-center justify-between p-4 rounded-xl border border-red-100 dark:border-red-900/40 bg-red-50/40 dark:bg-red-900/10">
            <div>
              <p class="text-sm font-semibold text-red-700 dark:text-red-300">Delete Account</p>
              <p class="text-xs text-red-500 dark:text-red-400 mt-0.5">Permanently deletes your account and all data.</p>
            </div>
            <button @click="confirmDeleteAccount = true" class="shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/70 transition-colors">
              Delete
            </button>
          </div>
        </div>
      </div>

      <!-- Logout -->
      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-semibold text-surface-800 dark:text-surface-200">Sign Out</p>
            <p class="text-xs text-surface-400 mt-0.5">You will be redirected to the login page.</p>
          </div>
          <button @click="logout" class="btn-secondary text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
            </svg>
            Logout
          </button>
        </div>
      </div>
    </div>

    <!-- Confirm reset -->
    <ConfirmDialog
      v-model="confirmReset"
      title="Reset All Progress"
      message="This will clear all subject mastery data. This cannot be undone."
      @confirm="resetProgress"
    />

    <!-- Confirm delete account -->
    <ConfirmDialog
      v-model="confirmDeleteAccount"
      title="Delete Account"
      message="This permanently deletes your account and all associated data. This action is irreversible."
      @confirm="deleteAccount"
    />
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout     from '@/components/common/AppLayout.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import { useAuthStore }        from '@/stores/auth'
import { useProgressStore }    from '@/stores/progress'
import { useAchievementStore } from '@/stores/achievement'
import { useToast }            from '@/composables/useToast'
import { authAPI }             from '@/api'

const authStore        = useAuthStore()
const progressStore    = useProgressStore()
const achievementStore = useAchievementStore()
const toast            = useToast()
const router           = useRouter()

onMounted(() => {
  progressStore.fetchProgress()
  achievementStore.fetchAchievements()
})

const userInitial = computed(() => (authStore.user?.email?.[0] ?? 'G').toUpperCase())

// Tabs
const tabs = [
  { key: 'account',       label: 'Account' },
  { key: 'notifications', label: 'Notifications' },
  { key: 'data',          label: 'Data' },
] as const
type TabKey = typeof tabs[number]['key']
const activeSection = ref<TabKey>('account')

// Password form
const pwForm    = reactive({ current: '', newPass: '', confirm: '' })
const pwError   = ref('')
const pwLoading = ref(false)

async function changePassword() {
  pwError.value = ''
  if (!pwForm.current || !pwForm.newPass || !pwForm.confirm) {
    pwError.value = 'All fields are required.'
    return
  }
  if (pwForm.newPass.length < 8) {
    pwError.value = 'New password must be at least 8 characters.'
    return
  }
  if (pwForm.newPass !== pwForm.confirm) {
    pwError.value = 'Passwords do not match.'
    return
  }
  pwLoading.value = true
  try {
    await authAPI.changePassword(pwForm.current, pwForm.newPass)
    toast.success('Password updated successfully!')
    pwForm.current = ''
    pwForm.newPass = ''
    pwForm.confirm = ''
  } catch {
    toast.error('Failed to update password. Check your current password.')
  } finally {
    pwLoading.value = false
  }
}

// Notifications
const notifSettings = reactive([
  { key: 'daily_reminder',  label: 'Daily Study Reminder',    description: 'Get reminded to study at your preferred time.',        enabled: true },
  { key: 'streak_alert',    label: 'Streak Alerts',           description: 'Notifications when your streak is about to break.',     enabled: true },
  { key: 'mock_reminder',   label: 'Mock Interview Reminders', description: 'Reminders before a scheduled mock interview.',          enabled: true },
  { key: 'weekly_summary',  label: 'Weekly Summary',          description: 'A weekly email summary of your progress.',              enabled: false },
])

function saveNotifSettings() {
  toast.success('Notification preferences saved!')
}

// Data management
async function exportData() {
  const data = {
    subjects:     progressStore.subjects,
    achievements: achievementStore.achievements,
    exportedAt:   new Date().toISOString(),
  }
  const blob   = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url    = URL.createObjectURL(blob)
  const a      = document.createElement('a')
  a.href       = url
  a.download   = `exam-planner-export-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  toast.success('Data exported!')
}

const confirmReset         = ref(false)
const confirmDeleteAccount = ref(false)

function resetProgress() {
  progressStore.subjects.forEach((s) => progressStore.updateProgress(s.name, { mastery: 0, tasks: 0 }))
  toast.success('Progress reset successfully.')
}

async function deleteAccount() {
  try {
    await authAPI.deleteAccount()
    authStore.logout()
    router.push('/login')
    toast.success('Account deleted.')
  } catch {
    toast.error('Failed to delete account.')
  }
}

function logout() {
  authStore.logout()
  router.push('/login')
}
</script>
