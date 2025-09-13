<template>
  <q-layout view="lHh Lpr lFf">
    <!-- DRAWER -->
    <q-drawer v-model="drawer" show-if-above bordered>
      <q-list>
        <template v-if="auth.user">
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
          <q-item clickable v-ripple to="/subscriptions">
            <q-item-section avatar><q-icon name="subscriptions" /></q-item-section>
            <q-item-section>Abonamente</q-item-section>
          </q-item>
        </template>
        <template v-else>
          <q-item clickable v-ripple to="/login">
            <q-item-section avatar><q-icon name="login" /></q-item-section>
            <q-item-section>Login</q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/signup">
            <q-item-section avatar><q-icon name="person_add" /></q-item-section>
            <q-item-section>Sign Up</q-item-section>
          </q-item>
        </template>
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
          <div v-if="loadingSubs" class="q-mb-md">
            <q-spinner size="2em" color="primary" />
          </div>
          <div v-else>
            <div class="row q-col-gutter-md">
              <div
                v-for="sub in subscriptions"
                :key="sub.id"
                class="col-12 col-md-6"
              >
                <q-card
                  class="q-mb-md subscription-card"
                  :class="{
                    'bg-pink-1': dialogType === 'hearts',
                    'bg-blue-1': dialogType === 'diamonds'
                  }"
                  flat
                  bordered
                >
                  <q-card-section>
                    <div class="row items-center">
                      <q-icon
                        :name="dialogType === 'hearts' ? 'favorite' : 'diamond'"
                        :color="dialogType === 'hearts' ? 'red' : 'blue-7'"
                        size="32px"
                        class="q-mr-md"
                      />
                      <div>
                        <div class="text-h6 text-weight-bold">{{ sub.name }}</div>
                        <div class="text-caption text-grey-7 q-mb-sm">{{ sub.description }}</div>
                      </div>
                    </div>
                    <div class="text-subtitle2 q-mt-md">
                      <q-badge
                        :color="dialogType === 'hearts' ? 'red' : 'blue-7'"
                        text-color="white"
                        class="q-pa-sm"
                        style="font-size:1.1em"
                      >
                        {{ sub.price }} RON
                      </q-badge>
                    </div>
                  </q-card-section>
                  <q-separator />
                  <q-card-actions align="right">
                    <q-btn
                      color="primary"
                      label="Cumpără"
                        @click="() => $q.notify({ type: 'positive', message: `Ai cumpărat abonamentul ${sub.name}!` })"
                      unelevated
                      class="q-px-lg"
                      :ripple="true"
                    />
                  </q-card-actions>
                </q-card>
              </div>
            </div>
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



// async function buySubscription(sub: Subscription) {
//   try {
//     const { data } = await api.post('/api/subscriptions/create-stripe-session/', {
//       subscription_id: sub.id
//     })
//     // If you have Stripe integration, redirect to checkout here
//     // const stripe = await stripePromise
//     // if (stripe) {
//     //   await stripe.redirectToCheckout({ sessionId: data.sessionId })
//     // }
//     window.location.href = data.checkout_url || '/'; // fallback redirect
//   } catch (e) {
//     // handle error, e.g. show notification
//     console.error('Failed to buy subscription', e)
//   }
// }

function logout() {
  auth.logout()
  void router.push('/login')
}

let timer: number | undefined
onMounted(async () => {
  game.init()
  timer = window.setInterval(() => game.tick(), 250)
  // Verificare automată token la inițializare
  if (auth.access) {
    await auth.fetchMe()
    if (!auth.user) {
      auth.logout()
      // opțional: router.push('/login') dacă vrei redirect instant
    }
  }
})
onBeforeUnmount(() => { if (timer) clearInterval(timer) })
</script>

<style scoped>
.cursor-pointer { cursor: pointer; }
.subscription-card {
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}
.subscription-card:hover {
  transform: translateY(-6px) scale(1.03);
  box-shadow: 0 8px 24px 0 rgba(0,0,0,0.18);
  z-index: 2;
}
</style>
