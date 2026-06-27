<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-surface-900/60 backdrop-blur-sm" @click="$emit('update:modelValue', false)" />
        <div class="relative bg-white dark:bg-surface-800 rounded-2xl shadow-card-xl p-6 w-full max-w-sm animate-slide-up">
          <!-- Icon -->
          <div class="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 mx-auto mb-4">
            <svg class="w-6 h-6 text-red-600 dark:text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            </svg>
          </div>
          <h3 class="text-center font-display font-700 text-lg text-surface-900 dark:text-white mb-2">{{ title }}</h3>
          <p class="text-center text-sm text-surface-500 dark:text-surface-400 mb-6">{{ message }}</p>
          <div class="flex gap-3">
            <button class="btn-secondary flex-1" @click="$emit('update:modelValue', false)">Cancel</button>
            <button class="flex-1 inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-red-600 text-white font-medium text-sm hover:bg-red-700 transition-all duration-150" @click="confirm">
              {{ confirmLabel }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  modelValue: boolean
  title?: string
  message?: string
  confirmLabel?: string
}>(), {
  title:        'Confirm Action',
  message:      'Are you sure? This action cannot be undone.',
  confirmLabel: 'Delete'
})
const emit = defineEmits<{ 'update:modelValue': [boolean]; confirm: [] }>()
function confirm() { emit('confirm'); emit('update:modelValue', false) }
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity .2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
