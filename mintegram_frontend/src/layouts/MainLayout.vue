
<template>
  <q-layout view="lHh Lpr lFf">
    <!-- DRAWER -->
    <q-drawer v-model="drawer" show-if-above bordered>
      <q-list>
        <q-item clickable v-ripple to="/" exact>
          <q-item-section avatar><q-icon name="home" /></q-item-section>
          <q-item-section>Acasă</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/profile">
          <q-item-section avatar><q-icon name="person" /></q-item-section>
          <q-item-section>Profil</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/hearts">
          <q-item-section avatar><q-icon name="favorite" /></q-item-section>
          <q-item-section>Inimioare</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/map">
          <q-item-section avatar><q-icon name="map" /></q-item-section>
          <q-item-section>Hartă niveluri</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/settings">
          <q-item-section avatar><q-icon name="settings" /></q-item-section>
          <q-item-section>Setări</q-item-section>
        </q-item>
        <q-separator />
        <q-item clickable v-ripple @click="logout">
          <q-item-section avatar><q-icon name="logout" /></q-item-section>
          <q-item-section>Logout</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <!-- HEADER -->
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" @click="drawer = !drawer" aria-label="Menu" class="q-mr-sm" />
        <q-toolbar-title>App</q-toolbar-title>

        <template v-if="auth.user">
          <!-- LVL -->
          <q-chip square color="indigo-1" text-color="indigo-9" class="q-mr-sm">
            <q-icon name="military_tech" class="q-mr-xs" />
            LVL {{ game.level }}
          </q-chip>

          <!-- XP -->
          <q-chip square color="amber-1" text-color="amber-9" class="q-mr-md">
            <q-icon name="bolt" class="q-mr-xs" />
            XP {{ game.xp }} / {{ game.level * 100 }}
          </q-chip>

          <q-btn flat round dense>
            <q-badge color="teal" floating>{{ game.diamonds }}</q-badge>
            <div style="font-size:18px;line-height:1">💎</div>
            <q-btn flat dense round icon="add" size="sm" @click.stop="openDialog('diamonds')" class="q-ml-xs" />
          </q-btn>

          <!-- Inimă + progres + badge -->
          <q-btn flat round dense class="q-mr-sm">
            <div class="relative-position" style="display:inline-block;">
              <q-circular-progress
                :value="(1 - game.cooldownProgress) * 100"
                size="36px"
                :thickness="0.22"
                color="red-5"
                track-color="grey-4"
                show-value
              >
                <q-icon name="favorite" color="red-6" />
              </q-circular-progress>
              <q-badge color="red" floating rounded>{{ game.hearts }}</q-badge>
            </div>
            <q-btn flat dense round icon="add" size="sm" @click.stop="openDialog('hearts')" class="q-ml-xs" />
          </q-btn>
        </template>
    <!-- DIALOG ABONAMENTE -->
    <q-dialog v-model="showDialog">
      <q-card style="min-width:340px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Cumpără {{ dialogType === 'hearts' ? 'inimi' : 'diamante' }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <div v-if="loadingSubs" class="q-mb-md"><q-spinner size="2em" color="primary" /></div>
          <div v-else>
            <q-list>
              <q-item v-for="sub in subscriptions" :key="sub.id" clickable>
                <q-item-section>
                  <div class="text-subtitle1">{{ sub.name }}</div>
                  <div class="text-caption text-grey-7">{{ sub.description }}</div>
                </q-item-section>
                <q-item-section side>
                  <q-btn color="primary" label="Cumpără {{ sub.price }} RON" @click="buySubscription(sub)" />
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

        <!-- Timer mm:ss dacă e pe cooldown -->
        <div v-if="auth.user && game.onCooldown" class="text-caption text-grey-9">
          {{ mmss(game.remainingSec) }}
        </div>

      </q-toolbar>
    </q-header>

    <!-- PAGINI -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useGame } from 'stores/game'
import { mmss } from 'src/utils/time'
import { useAuth } from 'stores/auth'
import { useRouter } from 'vue-router'
import { api } from 'src/boot/axios'

const game = useGame()
const auth = useAuth()
const router = useRouter()
const drawer = ref(false)

// Dialog logic
const showDialog = ref(false)
const dialogType = ref<'hearts'|'diamonds'>('hearts')
type Subscription = {
  id: number;
  name: string;
  description: string;
  price: number;
};
const subscriptions = ref<Subscription[]>([])
const loadingSubs = ref(false)

function openDialog(type: 'hearts'|'diamonds') {
  dialogType.value = type
  showDialog.value = true
  void fetchSubscriptions(type)
}

async function fetchSubscriptions(type: 'hearts'|'diamonds') {
  loadingSubs.value = true
  try {
    // Exemplu: /api/subscriptions/?type=hearts sau diamonds
    const { data } = await api.get(`/api/subscriptions/?type=${type}`)
    subscriptions.value = data
  } catch {
    subscriptions.value = []
  } finally {
    loadingSubs.value = false
  }
}

function buySubscription(sub: Subscription) {
  // Aici va fi logica Stripe (urmează să fie adăugată)
  alert(`Stripe payment pentru ${sub.name}`)
}

function logout() {
  auth.logout()
  void router.push('/login')
}

let timer: number | undefined
onMounted(() => {
  game.init()
  timer = window.setInterval(() => game.tick(), 250)
})
onBeforeUnmount(() => { if (timer) clearInterval(timer) })
</script>

<style scoped>
.cursor-pointer { cursor: pointer; }
</style>
