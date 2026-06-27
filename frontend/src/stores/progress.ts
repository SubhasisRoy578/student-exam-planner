import { defineStore } from 'pinia'
import { ref } from 'vue'
import { progressAPI } from '@/api'

export interface Subject {
  name: string
  mastery: number
  tasks: number
  color: string
}

const DEMO_SUBJECTS: Subject[] = [
  { name: 'Mathematics',         mastery: 72, tasks: 18, color: '#3b82f6' },
  { name: 'Computer Science',    mastery: 55, tasks: 12, color: '#f97316' },
  { name: 'Physics',             mastery: 40, tasks: 8,  color: '#8b5cf6' },
  { name: 'English Literature',  mastery: 88, tasks: 22, color: '#10b981' },
  { name: 'Chemistry',           mastery: 30, tasks: 5,  color: '#ef4444' },
]

export const useProgressStore = defineStore('progress', () => {
  const subjects = ref<Subject[]>([...DEMO_SUBJECTS])
  const loading  = ref(false)

  async function fetchProgress() {
    loading.value = true
    try {
      const { data } = await progressAPI.get()
      subjects.value = data
    } catch {
      subjects.value = [...DEMO_SUBJECTS]
    } finally {
      loading.value = false
    }
  }

  async function updateProgress(name: string, updates: Partial<Subject>) {
    const idx = subjects.value.findIndex((s) => s.name === name)
    if (idx !== -1) Object.assign(subjects.value[idx], updates)
    try {
      await progressAPI.update(name, updates)
    } catch { /* local update kept */ }
  }

  function addSubject(subject: Subject) {
    subjects.value.push(subject)
  }

  return { subjects, loading, fetchProgress, updateProgress, addSubject }
})
