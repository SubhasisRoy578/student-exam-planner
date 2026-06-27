import { defineStore } from 'pinia'
import { ref } from 'vue'
import { planAPI } from '@/api'

export interface Plan {
  examDate: string
  goal: string
  weakSubjects: string[]
  dailyHours: number
}

export const usePlanStore = defineStore('plan', () => {
  const plan = ref<Plan>({
    examDate: '',
    goal: '',
    weakSubjects: [],
    dailyHours: 4
  })
  const loading = ref(false)

  async function fetchPlan() {
    loading.value = true
    try {
      const { data } = await planAPI.get()
      plan.value = data
    } catch {
      // use defaults / guest data
    } finally {
      loading.value = false
    }
  }

  async function savePlan(data: Plan) {
    loading.value = true
    try {
      await planAPI.save(data)
      plan.value = data
    } finally {
      loading.value = false
    }
  }

  async function updatePlan(data: Plan) {
    loading.value = true
    try {
      await planAPI.update(data)
      plan.value = data
    } finally {
      loading.value = false
    }
  }

  return { plan, loading, fetchPlan, savePlan, updatePlan }
})
