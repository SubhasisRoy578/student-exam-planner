<template>
  <div class="flex h-full min-h-screen">
    <Sidebar :open="sidebarOpen" @close="sidebarOpen = false" />

    <!-- Main content area -->
    <div class="flex-1 flex flex-col min-w-0 lg:ml-64">
      <GuestBanner v-if="authStore.isGuest" />
      <Topbar
        :title="pageTitle"
        :is-dark="isDark"
        @menu="sidebarOpen = true"
        @toggle-dark="toggleDark"
      />
      <main class="flex-1 overflow-y-auto p-4 lg:p-6">
        <div class="max-w-5xl mx-auto animate-fade-in">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from './Sidebar.vue'
import Topbar  from './Topbar.vue'
import GuestBanner from './GuestBanner.vue'
import { useAuthStore } from '@/stores/auth'

const authStore   = useAuthStore()
const sidebarOpen = ref(false)
const route       = useRoute()
const isDark      = inject<ReturnType<typeof ref<boolean>>>('darkMode', ref(false))
const toggleDark  = inject<() => void>('toggleDark', () => {})

const titles: Record<string, string> = {
  '/dashboard':    'Dashboard',
  '/planner':      'Study Planner',
  '/subjects':     'Subject Tracker',
  '/mocks':        'Mock Interviews',
  '/achievements': 'Achievements',
  '/profile':      'Profile',
}

const pageTitle = ref('')
import { watch } from 'vue'
watch(() => route.path, (p) => { pageTitle.value = titles[p] || 'Exam Planner' }, { immediate: true })
</script>
