export const required = (v: string) => (v.trim() ? '' : 'This field is required.')
export const isEmail  = (v: string) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Enter a valid email address.')
export const minLen   = (n: number) => (v: string) => (v.length >= n ? '' : `Must be at least ${n} characters.`)
export const maxLen   = (n: number) => (v: string) => (v.length <= n ? '' : `Must be at most ${n} characters.`)
export const matchVal = (compare: string, label = 'Passwords') => (v: string) =>
  v === compare ? '' : `${label} do not match.`

export function validate(value: string, rules: ((v: string) => string)[]): string {
  for (const rule of rules) {
    const msg = rule(value)
    if (msg) return msg
  }
  return ''
}
