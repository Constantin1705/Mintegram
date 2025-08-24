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
            Level {{ user?.level }}
          </q-chip>
          <q-chip color="amber-1" text-color="amber-9" icon="bolt">
            XP {{ user?.xp }}
          </q-chip>
          <q-chip color="teal-1" text-color="teal-9" icon="diamond">
            Diamante {{ user?.diamonds }}
          </q-chip>
        </div>
        <div v-if="user?.badges?.length" class="q-mt-lg">
          <div class="text-subtitle1 text-weight-medium q-mb-sm">Badge-uri:</div>
          <div class="row q-gutter-sm">
            <q-chip v-for="badge in user.badges" :key="badge.id" color="grey-2" text-color="primary" class="q-pa-sm">
              <q-avatar v-if="badge.icon" size="24px">
                <img :src="badge.icon" alt="badge" />
              </q-avatar>
              {{ badge.name }}
            </q-chip>
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
</style>

<script lang="ts" setup>
import { onMounted, ref } from "vue"
import { useGame } from "../stores/game"
import { api } from "src/boot/axios"
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
  xp: number
  level: number
  diamonds: number
  badges: Badge[]
}

const game = useGame()
const user = ref<UserProfile | null>(null)
const loading = ref(true)

onMounted(async () => {
  try {
  const res = await api.get<UserProfile>("/api/auth/me/")
  user.value = res.data
  // Sincronizează valorile din backend în store-ul local
  game.xp = res.data.xp
  game.level = res.data.level
  game.diamonds = res.data.diamonds
  await game.fetchFromBackend()
  } catch {
    // Poți adăuga aici un mesaj de eroare dacă vrei
  } finally {
    loading.value = false
  }
})
</script>
