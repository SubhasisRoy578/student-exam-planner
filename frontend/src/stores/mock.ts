import { defineStore } from 'pinia'
import { ref } from 'vue'
import { mockAPI } from '@/api'

export interface MockInterview {
  id: string
  date: string
  status: 'upcoming' | 'completed'
  score: number | null
  feedback: string
}

const DEMO_MOCKS: MockInterview[] = [
  { id: '1', date: '2025-07-15', status: 'upcoming',  score: null, feedback: '' },
  { id: '2', date: '2025-06-20', status: 'completed', score: 78,   feedback: 'Good understanding of algorithms but need to improve on system design.' },
  { id: '3', date: '2025-06-05', status: 'completed', score: 65,   feedback: 'Strong verbal but technical questions need more depth.' },
]

export const useMockStore = defineStore('mock', () => {
  const interviews = ref<MockInterview[]>([...DEMO_MOCKS])
  const loading    = ref(false)

  async function fetchMocks() {
    loading.value = true
    try {
      const { data } = await mockAPI.list()
      interviews.value = data
    } catch {
      interviews.value = [...DEMO_MOCKS]
    } finally {
      loading.value = false
    }
  }

  async function scheduleMock(date: string) {
    const newMock: MockInterview = { id: Date.now().toString(), date, status: 'upcoming', score: null, feedback: '' }
    interviews.value.unshift(newMock)
    try { await mockAPI.create(date) } catch { /* keep local */ }
  }

  async function updateMock(id: string, updates: Partial<MockInterview>) {
    const idx = interviews.value.findIndex((m) => m.id === id)
    if (idx !== -1) Object.assign(interviews.value[idx], updates)
    try { await mockAPI.update(id, updates) } catch { /* keep local */ }
  }

  async function deleteMock(id: string) {
    interviews.value = interviews.value.filter((m) => m.id !== id)
    try { await mockAPI.remove(id) } catch { /* keep local */ }
  }

  return { interviews, loading, fetchMocks, scheduleMock, updateMock, deleteMock }
})
