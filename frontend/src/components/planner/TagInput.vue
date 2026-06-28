<template>
  <div>
    <div class="flex flex-wrap gap-2 p-2.5 border border-surface-200 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-800 min-h-[44px] focus-within:ring-2 focus-within:ring-brand-500/30 focus-within:border-brand-500 transition-all">
      <span
        v-for="tag in modelValue"
        :key="tag"
        class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 text-xs font-medium"
      >
        {{ tag }}
        <button type="button" @click="remove(tag)" class="hover:text-brand-900 dark:hover:text-brand-100 transition-colors">
          <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </span>
      <input
        ref="inputRef"
        v-model="input"
        type="text"
        :placeholder="modelValue.length === 0 ? placeholder : ''"
        class="flex-1 min-w-[120px] bg-transparent outline-none text-sm text-surface-900 dark:text-surface-100 placeholder:text-surface-400"
        @keydown.enter.prevent="add"
        @keydown.backspace="onBackspace"
      />
    </div>
    <p class="text-xs text-surface-400 mt-1">Press Enter to add a subject</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = withDefaults(defineProps<{
  modelValue: string[]
  placeholder?: string
}>(), { placeholder: 'Add a subject...' })

const emit = defineEmits<{ 'update:modelValue': [string[]] }>()
const input = ref('')
const inputRef = ref<HTMLInputElement | null>(null)

function add() {
  const val = input.value.trim()
  if (val && !props.modelValue.includes(val)) {
    emit('update:modelValue', [...props.modelValue, val])
  }
  input.value = ''
}

function remove(tag: string) {
  emit('update:modelValue', props.modelValue.filter((t) => t !== tag))
}

function onBackspace() {
  if (!input.value && props.modelValue.length) {
    emit('update:modelValue', props.modelValue.slice(0, -1))
  }
}
</script>
