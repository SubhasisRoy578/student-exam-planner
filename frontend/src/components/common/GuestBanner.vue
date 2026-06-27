<template>
  <div class="bg-gradient-to-r from-accent-500 to-accent-600 text-white px-4 py-2.5 flex items-center justify-between gap-4 text-sm">
    <div class="flex items-center gap-2">
      <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
      <span class="font-medium">Guest Mode — your data is not saved.</span>
      <span class="hidden sm:inline text-accent-100">Sign in to save your progress.</span>
    </div>
    <RouterLink to="/login" class="shrink-0 px-3 py-1 rounded-lg bg-white/20 hover:bg-white/30 font-semibold transition-colors text-xs">
      Sign In
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>
