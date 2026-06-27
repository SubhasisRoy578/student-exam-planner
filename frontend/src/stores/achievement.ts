import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { achievementAPI } from '@/api'

export interface Achievement {
  id: string
  entry: string
  date: string
}

const DEMO_ACHIEVEMENTS: Achievement[] = [
  { id: '1', entry: 'Completed full chapter on Calculus — differentiation and integration',    date: '2025-06-24' },
  { id: '2', entry: 'Scored 85% in Physics mock test',                                        date: '2025-06-23' },
  { id: '3', entry: 'Finished 50 LeetCode problems — medium difficulty',                      date: '2025-06-22' },
  { id: '4', entry: 'Mastered OS concepts: scheduling algorithms and memory management',       date: '2025-06-21' },
  { id: '5', entry: 'Revised all chemistry chapters from semester 1',                          date: '2025-06-20' },
]

const MOTIVATIONAL_QUOTES = [
  { text: 'Success is the sum of small efforts, repeated day in and day out.', author: 'Robert Collier' },
  { text: 'The secret of getting ahead is getting started.', author: 'Mark Twain' },
  { text: 'Education is the most powerful weapon you can use to change the world.', author: 'Nelson Mandela' },
  { text: 'The expert in anything was once a beginner.', author: 'Helen Hayes' },
  { text: 'Believe you can and you\'re halfway there.', author: 'Theodore Roosevelt' },
  { text: 'It does not matter how slowly you go as long as you do not stop.', author: 'Confucius' },
  { text: 'Push yourself, because no one else is going to do it for you.', author: 'Anonymous' },
]

export const useAchievementStore = defineStore('achievement', () => {
  const achievements = ref<Achievement[]>([...DEMO_ACHIEVEMENTS])
  const loading      = ref(false)

  const streak = computed(() => {
    if (!achievements.value.length) return 0
    const dates = achievements.value
      .map((a) => new Date(a.date).toDateString())
      .filter((v, i, arr) => arr.indexOf(v) === i)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

    let count = 0
    let current = new Date()
    for (const d of dates) {
      const day = new Date(d)
      const diff = Math.floor((current.getTime() - day.getTime()) / 86400000)
      if (diff <= 1) { count++; current = day } else break
    }
    return count
  })

  const quote = computed(() => MOTIVATIONAL_QUOTES[streak.value % MOTIVATIONAL_QUOTES.length])

  async function fetchAchievements() {
    loading.value = true
    try {
      const { data } = await achievementAPI.list()
      achievements.value = data
    } catch {
      achievements.value = [...DEMO_ACHIEVEMENTS]
    } finally {
      loading.value = false
    }
  }

  async function addAchievement(entry: string) {
    const newA: Achievement = { id: Date.now().toString(), entry, date: new Date().toISOString().split('T')[0] }
    achievements.value.unshift(newA)
    try { await achievementAPI.add(entry) } catch { /* keep local */ }
  }

  async function deleteAchievement(id: string) {
    achievements.value = achievements.value.filter((a) => a.id !== id)
    try { await achievementAPI.remove(id) } catch { /* keep local */ }
  }

  return { achievements, streak, quote, loading, fetchAchievements, addAchievement, deleteAchievement }
})
