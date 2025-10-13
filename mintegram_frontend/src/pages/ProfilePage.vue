<template>
  <div class="q-pa-md flex flex-center">
    <q-card class="profile-card q-pa-lg" flat bordered>
      <div class="row items-center q-mb-md">
        <q-avatar size="80px" color="primary" text-color="white">
          <q-icon name="person" size="48px" />
        </q-avatar>
        <div class="q-ml-lg">
          <div class="text-h5 text-weight-bold">{{ user?.username }}</div>
          <div class="text-subtitle2 text-grey-7">{{ user?.email }}</div>
        </div>
      </div>
      <q-separator />
      <div v-if="loading" class="q-mt-md text-center">
        <q-spinner color="primary" size="2em" />
        <div class="q-mt-sm">Se încarcă...</div>
      </div>
      <div v-else>
        <div class="row q-mt-md q-gutter-md">
          <q-chip color="indigo-1" text-color="indigo-9" icon="military_tech">
            Level {{ game.level }}
          </q-chip>
          <q-chip color="amber-1" text-color="amber-9" icon="bolt">
            XP {{ game.xp }}
          </q-chip>
          <q-chip color="teal-1" text-color="teal-9" icon="diamond">
            Diamante {{ game.diamonds }}
          </q-chip>
        </div>
        <div class="q-mt-lg">
          <div class="text-subtitle1 text-weight-medium q-mb-sm">Badge-uri:</div>
          <div class="badges-grid">
            <div v-for="badge in allBadges" :key="badge.id" class="badge-cell" :class="{ locked: !userHasBadge(badge.id) }">
              <div class="badge-img-wrap">
                <img v-if="badge.icon" :src="badgeImgUrl(badge.icon) || ''" :alt="badge.name" />
                <q-icon v-else name="lock" size="32px" color="grey-5" />
                <div v-if="!userHasBadge(badge.id)" class="badge-lock-overlay">
                  <q-icon name="lock" size="32px" color="yellow-8" />
                </div>
              </div>
              <div class="badge-name text-center q-mt-xs">
                {{ userHasBadge(badge.id) ? badge.name : '???' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </q-card>
  </div>
</template>

<style scoped>
.profile-card {
  max-width: 420px;
  width: 100%;
}
.badges-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(72px, 1fr));
  gap: 12px;
  margin-top: 8px;
}
.badge-cell {
  background: linear-gradient(135deg, #fceabb 0%, #f8b500 100%);
  border-radius: 16px;
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.10);
  padding: 8px 4px 4px 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  min-height: 90px;
  transition: filter 0.2s;
}
.badge-img-wrap {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.badge-img-wrap img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 8px;
  background: #fff;
}
.badge-cell.locked {
  filter: grayscale(1) brightness(1.5) opacity(0.7);
  position: relative;
}
.badge-lock-overlay {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(255, 215, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}
.badge-name {
  font-size: 0.95em;
  font-weight: 600;
  color: #7c5c00;
  text-shadow: 0 1px 0 #fff8;
}
</style>

<script lang="ts" setup>
import { onMounted, ref } from "vue"
import { api } from "src/boot/axios"
import { useGame } from 'stores/game'
import { fetchAllBadges } from 'src/utils/badges'

interface Badge {
  id: number
  name: string
  description: string
  icon: string | null
}

interface UserProfile {
  id: number
  username: string
  email: string
  badges: Badge[]
}

const user = ref<UserProfile | null>(null)
const loading = ref(true)
const game = useGame()
const allBadges = ref<Badge[]>([])

onMounted(async () => {
  try {
    const [userRes, allBadgesRes] = await Promise.all([
      api.get<UserProfile>("/api/auth/me/"),
      fetchAllBadges()
    ])
    user.value = userRes.data
    allBadges.value = allBadgesRes
  } catch {
    // Poți adăuga aici un mesaj de eroare dacă vrei
  } finally {
    loading.value = false
  }
})

function userHasBadge(badgeId: number): boolean {
  return !!user.value?.badges?.some(b => b.id === badgeId)
}
function badgeImgUrl(icon: string|null): string|undefined {
  if (!icon) return undefined
  if (icon.startsWith('http://') || icon.startsWith('https://')) return icon
  let path = icon
  if (!icon.startsWith('/media/')) {
    path = '/media/' + icon.replace(/^\/*/, '')
  }
  return `http://localhost:8000${path}`
}
</script>
