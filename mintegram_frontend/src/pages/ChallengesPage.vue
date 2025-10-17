<template>
  <q-page class="q-pa-md">
    <div class="text-h4 text-center q-mb-lg">Provocări Active</div>
    <div class="q-mb-lg">
      <div class="text-h5">Leaderboard Provocări</div>
      <q-table
        :rows="challengeLeaderboard"
        :columns="leaderboardColumns"
        row-key="user__username"
        flat bordered dense
        class="bg-white q-mb-md"
      />
    </div>
    <div class="q-mb-lg">
      <div class="text-h5">Istoric Provocări</div>
      <q-list bordered separator>
        <q-item v-for="entry in challengeHistory" :key="entry.id">
          <q-item-section>
            <div class="text-bold">{{ entry.challenge }}</div>
            <div v-if="entry.completed" class="text-green">Finalizată la {{ entry.completed_at }}</div>
            <div v-else-if="entry.accepted" class="text-blue">Acceptată</div>
            <div v-else class="text-grey">Neacceptată</div>
            <div>Puncte: {{ entry.points_awarded }}</div>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
    <q-list bordered separator>
      <q-item v-for="challenge in challenges" :key="challenge.id">
        <q-item-section>
          <div class="text-h6">{{ challenge.title }}</div>
          <div class="text-caption text-grey-7">{{ challenge.description }}</div>
          <div class="q-mt-xs">
            <q-badge color="primary" class="q-mr-sm">{{ recurrenceLabel(challenge.recurrence) }}</q-badge>
            <q-badge color="amber-8">{{ challenge.points }} puncte</q-badge>
            <q-badge color="purple" v-if="challenge.difficulty">{{ challenge.difficulty }}</q-badge>
            <q-badge color="teal" v-if="challenge.reward_coins">+{{ challenge.reward_coins }} monede</q-badge>
            <q-badge color="blue-grey" v-if="challenge.reward_xp">+{{ challenge.reward_xp }} XP</q-badge>
            <q-badge color="deep-orange" v-if="challenge.reward_badge">Badge: {{ challenge.reward_badge }}</q-badge>
            <q-badge color="brown" v-if="challenge.reward_item">Item: {{ challenge.reward_item }}</q-badge>
          </div>
          <div class="text-caption q-mt-xs">
            <span v-if="challenge.start_date">Începe: {{ challenge.start_date }}</span>
            <span v-if="challenge.end_date"> | Se termină: {{ challenge.end_date }}</span>
            <span v-if="challenge.deadline"> | Deadline: {{ challenge.deadline }}</span>
          </div>
          <div class="q-mt-xs">
            <span v-if="challenge.collaborators && challenge.collaborators.length">Colaboratori: {{ challenge.collaborators.join(', ') }}</span>
          </div>
          <div class="q-mt-md">
            <q-linear-progress :value="progressFor(challenge.id) / 100" color="accent" size="20px" rounded>
              <div class="absolute-full flex flex-center text-white">{{ progressFor(challenge.id) }}%</div>
            </q-linear-progress>
          </div>
          <div class="q-mt-md row q-gutter-sm">
            <q-btn
              color="primary"
              label="Acceptă"
              :disable="challengeUserFor(challenge.id)?.accepted"
              @click="acceptChallenge(challenge.id)"
            />
            <q-btn
              color="positive"
              label="Marchează finalizată"
              :disable="!challengeUserFor(challenge.id)?.accepted || challengeUserFor(challenge.id)?.completed"
              @click="completeChallenge(challenge.id)"
            />
            <q-btn
              color="info"
              label="Refresh progres"
              @click="refreshProgress(challenge.id)"
            />
          </div>
          <div v-if="challengeUserFor(challenge.id)" class="q-mt-xs">
            <q-badge v-if="challengeUserFor(challenge.id)?.completed" color="green">Finalizată</q-badge>
            <q-badge v-else-if="challengeUserFor(challenge.id)?.accepted" color="blue">Acceptată</q-badge>
          </div>
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script setup lang="ts">

type ChallengeLeaderboardEntry = {
  user__username: string;
  total_points: number;
}
const challengeLeaderboard = ref<ChallengeLeaderboardEntry[]>([])
const leaderboardColumns = [
  { name: 'user__username', label: 'Utilizator', field: 'user__username', align: 'left' as const },
  { name: 'total_points', label: 'Puncte provocări', field: 'total_points', align: 'right' as const }
]
type ChallengeHistoryEntry = {
  id: number;
  challenge: string;
  accepted: boolean;
  completed: boolean;
  completed_at?: string;
  points_awarded: number;
}
const challengeHistory = ref<ChallengeHistoryEntry[]>([])

async function fetchChallengeLeaderboard() {
  const { data } = await api.get('/api/challenge/leaderboard/')
  challengeLeaderboard.value = data
}
async function fetchChallengeHistory() {
  const { data } = await api.get('/api/challenge/history/')
  challengeHistory.value = data
}
type ChallengeUser = {
  id: number;
  challenge: number;
  accepted: boolean;
  completed: boolean;
  completed_at?: string;
  points_awarded: number;
}
const challengeUsers = ref<ChallengeUser[]>([])

function challengeUserFor(challengeId: number) {
  return challengeUsers.value.find(cu => cu.challenge === challengeId)
}

async function fetchChallengeUsers() {
  try {
    const { data } = await api.get('/api/challenge-user/')
    challengeUsers.value = data
  } catch (err) {
    // Poți loga sau notifica eroarea dacă vrei
    console.error('Eroare la fetchChallengeUsers', err)
  }
}
import { useQuasar } from 'quasar'
const $q = useQuasar()
async function acceptChallenge(challengeId: number) {
  try {
    await api.post(`/api/challenge/${challengeId}/accept/`)
    $q.notify({ type: 'positive', message: 'Provocare acceptată!' })
    await fetchChallengeUsers()
    await refreshProgress(challengeId)
    await fetchChallengeHistory()
  } catch {
    $q.notify({ type: 'negative', message: 'Eroare la acceptare provocare.' })
  }
}

async function completeChallenge(challengeId: number) {
  try {
    const { data } = await api.post(`/api/challenge/${challengeId}/finalize/`)
    if (data.completed) {
      let msg = 'Provocare marcată ca finalizată! '
      if (data.coins) msg += `+${data.coins} monede. `
      if (data.xp) msg += `+${data.xp} XP. `
      if (data.badge) msg += `Badge: ${data.badge}. `
      if (data.item) msg += `Item: ${data.item}. `
      $q.notify({ type: 'positive', message: msg })
      await fetchChallengeUsers()
      await refreshProgress(challengeId)
      await fetchChallengeHistory()
      await fetchChallengeLeaderboard()
    } else {
      $q.notify({ type: 'warning', message: data.error || 'Trebuie să accepți provocarea înainte de a o finaliza.' })
    }
  } catch {
    $q.notify({ type: 'negative', message: 'Eroare la finalizare provocare.' })
  }
}
import { ref, onMounted } from 'vue'
import { api } from 'src/boot/axios'

type Challenge = {
  id: number;
  title: string;
  description: string;
  points: number;
  recurrence: string;
  active: boolean;
  start_date?: string;
  end_date?: string;
  difficulty?: string;
  reward_coins?: number;
  reward_xp?: number;
  reward_badge?: string;
  reward_item?: string;
  deadline?: string;
  collaborators?: string[];
}
const challenges = ref<Challenge[]>([])

function recurrenceLabel(val: string) {
  switch (val) {
    case 'once': return 'O dată';
    case 'daily': return 'Zilnic';
    case 'weekly': return 'Săptămânal';
    case 'monthly': return 'Lunar';
    default: return val;
  }
}

async function fetchChallenges() {
  const { data } = await api.get('/api/challenge/')
  challenges.value = data
}

const progressMap = ref<Record<number, number>>({})
async function refreshProgress(challengeId: number) {
  const { data } = await api.get(`/api/challenge/${challengeId}/refresh_progress/`)
  progressMap.value[challengeId] = data.progress
}
function progressFor(challengeId: number) {
  return progressMap.value[challengeId] ?? 0
}
onMounted(async () => {
  await fetchChallenges()
  await fetchChallengeUsers()
  await fetchChallengeLeaderboard()
  await fetchChallengeHistory()
  for (const c of challenges.value) {
    await refreshProgress(c.id)
  }
})

onMounted(async () => {
  await fetchChallenges()
  await fetchChallengeUsers()
})
</script>
