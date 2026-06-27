<template>
  <!-- Mobile overlay -->
  <Transition name="overlay">
    <div v-if="open" class="fixed inset-0 bg-surface-900/60 backdrop-blur-sm z-30 lg:hidden" @click="$emit('close')" />
  </Transition>

  <!-- Sidebar panel -->
  <aside
    :class="[
      'fixed top-0 left-0 h-full w-64 z-40 flex flex-col bg-white dark:bg-surface-900 border-r border-surface-100 dark:border-surface-800 transition-transform duration-300',
      open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    ]"
  >
    <!-- Logo -->
    <div class="flex items-center gap-3 px-5 py-5 border-b border-surface-100 dark:border-surface-800">
      <div class="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center shrink-0">
        <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
      </div>
      <div>
        <p class="font-display font-700 text-surface-900 dark:text-white text-base leading-none">ExamPlanner</p>
        <p class="text-xs text-surface-400 mt-0.5">Study Smart</p>
      </div>
    </div>

    <!-- Nav -->
    <nav class="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
      <p class="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-surface-400 dark:text-surface-500">Main</p>
      <RouterLink
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="nav-link"
        active-class="active"
        exact-active-class="active"
        @click="$emit('close')"
      >
        <component :is="item.icon" class="w-4.5 h-4.5 shrink-0" />
        {{ item.label }}
      </RouterLink>
    </nav>

    <!-- User footer -->
    <div class="px-4 py-4 border-t border-surface-100 dark:border-surface-800">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900 flex items-center justify-center text-brand-700 dark:text-brand-300 font-semibold text-sm shrink-0">
          {{ userInitial }}
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-surface-900 dark:text-white truncate">{{ authStore.user?.email }}</p>
          <p class="text-xs text-surface-400">{{ authStore.isGuest ? 'Guest' : 'Student' }}</p>
        </div>
        <button @click="logout" class="p-1.5 rounded-lg text-surface-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors" title="Logout">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
          </svg>
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed, defineComponent, h } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

defineProps<{ open: boolean }>()
defineEmits<{ close: [] }>()

const authStore = useAuthStore()
const router    = useRouter()

const userInitial = computed(() => (authStore.user?.email?.[0] ?? 'G').toUpperCase())

function logout() {
  authStore.logout()
  router.push('/login')
}

// Inline SVG icon factory
function icon(d: string) {
  return defineComponent({ render: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', class: 'w-[18px] h-[18px]' }, [h('path', { d })]) })
}

const navItems = [
  {
    label: 'Dashboard',
    path:  '/dashboard',
    icon:  defineComponent({ render: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', class: 'w-[18px] h-[18px]' }, [
      h('rect', { x: '3', y: '3', width: '7', height: '7' }),
      h('rect', { x: '14', y: '3', width: '7', height: '7' }),
      h('rect', { x: '3', y: '14', width: '7', height: '7' }),
      h('rect', { x: '14', y: '14', width: '7', height: '7' }),
    ]) })
  },
  {
    label: 'Study Planner',
    path:  '/planner',
    icon:  icon('M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01')
  },
  {
    label: 'Subjects',
    path:  '/subjects',
    icon:  icon('M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z')
  },
  {
    label: 'Mock Interviews',
    path:  '/mocks',
    icon:  icon('M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75M9 7a4 4 0 100 8 4 4 0 000-8z')
  },
  {
    label: 'Achievements',
    path:  '/achievements',
    icon:  icon('M8.21 13.89L7 23l5-3 5 3-1.21-9.12M12 2l2.09 6.26H21l-5.47 3.97 2.09 6.26L12 14.52l-5.62 3.97 2.09-6.26L3 8.26h6.91z')
  },
  {
    label: 'Profile',
    path:  '/profile',
    icon:  icon('M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z')
  },
]
</script>

<style scoped>
.overlay-enter-active, .overlay-leave-active { transition: opacity .25s ease; }
.overlay-enter-from, .overlay-leave-to { opacity: 0; }
</style>
