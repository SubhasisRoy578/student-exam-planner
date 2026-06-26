<template>
  <div :class="[darkMode ? 'dark' : '']" class="h-full">
    <div class="h-full bg-surface-50 dark:bg-surface-950 text-surface-900 dark:text-surface-100 transition-colors duration-300">
      <RouterView />
      <ToastContainer />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, provide } from 'vue'
import { RouterView } from 'vue-router'
import ToastContainer from '@/components/common/ToastContainer.vue'

const darkMode = ref(false)
provide('darkMode', darkMode)

function toggleDark() { darkMode.value = !darkMode.value }
provide('toggleDark', toggleDark)
</script>
