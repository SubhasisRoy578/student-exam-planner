import { reactive } from 'vue'

export interface Toast { id: string; type: 'success' | 'error' | 'info' | 'warning'; message: string }

const toasts = reactive<Toast[]>([])

export function useToast() {
  function show(type: Toast['type'], message: string, duration = 4000) {
    const id = Math.random().toString(36).slice(2)
    toasts.push({ id, type, message })
    setTimeout(() => remove(id), duration)
  }

  function remove(id: string) {
    const idx = toasts.findIndex((t) => t.id === id)
    if (idx !== -1) toasts.splice(idx, 1)
  }

  return {
    toasts,
    success: (msg: string) => show('success', msg),
    error:   (msg: string) => show('error',   msg),
    info:    (msg: string) => show('info',     msg),
    warning: (msg: string) => show('warning',  msg),
    remove,
  }
}
