/** Format a date string to a human-readable format */
export function formatDate(date: string | Date, opts?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', opts || { year: 'numeric', month: 'long', day: 'numeric' })
}

/** Days remaining until a target date */
export function daysUntil(target: string): number {
  const now  = new Date()
  const dest = new Date(target)
  return Math.max(0, Math.ceil((dest.getTime() - now.getTime()) / 86400000))
}

/** Format countdown { days, hours, minutes, seconds } */
export function formatCountdown(target: string): { days: number; hours: number; minutes: number; seconds: number } {
  const diff = Math.max(0, new Date(target).getTime() - Date.now())
  const days    = Math.floor(diff / 86400000)
  const hours   = Math.floor((diff % 86400000) / 3600000)
  const minutes = Math.floor((diff % 3600000)  / 60000)
  const seconds = Math.floor((diff % 60000)    / 1000)
  return { days, hours, minutes, seconds }
}

/** Clamp a number between min and max */
export function clamp(val: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, val))
}

/** Generate a random color hex from a set palette */
const PALETTE = ['#3b82f6','#f97316','#8b5cf6','#10b981','#ef4444','#f59e0b','#06b6d4','#ec4899']
let _colorIdx = 0
export function nextColor(): string {
  return PALETTE[_colorIdx++ % PALETTE.length]
}

/** Truncate text */
export function truncate(str: string, len = 60): string {
  return str.length > len ? str.slice(0, len) + '…' : str
}
