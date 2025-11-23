<template>

  <q-layout
    view="lHh Lpr lFf"
    :class="$q.dark.isActive ? 'bg-dark text-white' : 'bg-grey-1 text-dark'"
  >
    <!-- Seasonal overlays (global) -->
    <div v-if="seasonalTheme === 'christmas'" class="season-overlay christmas-overlay" aria-hidden="true">
      <div class="particles">
        <span v-for="p in particles" :key="p.id" class="particle" :style="p.style"></span>
      </div>
      <div class="garland" aria-hidden="true">
        <span v-for="n in 20" :key="n" class="garland-light"></span>
      </div>
    </div>
    <div v-else-if="seasonalTheme === 'easter'" class="season-overlay easter-overlay" aria-hidden="true">
      <div class="particles">
        <span v-for="p in particles" :key="p.id" class="particle" :style="p.style"></span>
      </div>
      <div class="floating-eggs" aria-hidden="true">
        <span v-for="e in eggs" :key="e.id" class="egg" :style="e.style"></span>
      </div>
    </div>
    <!-- DRAWER -->
    <q-drawer v-model="drawer" show-if-above bordered>
      <q-list>
        <template v-if="auth.user">
          <q-item clickable v-ripple to="/" exact>
            <q-item-section avatar><q-icon name="home" /></q-item-section>
            <q-item-section>Acasă</q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/stats" exact>
            <q-item-section avatar><q-icon name="insights" /></q-item-section>
            <q-item-section>Stats</q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/shop">
            <q-item-section avatar><q-icon name="shopping_cart" /></q-item-section>
            <q-item-section>Shop</q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/leaderboard">
            <q-item-section avatar><q-icon name="emoji_events" /></q-item-section>
            <q-item-section>Clasament Global</q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/challenges">
            <q-item-section avatar><q-icon name="military_tech" /></q-item-section>
            <q-item-section>Provocări & Clasament Provocări</q-item-section>
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
          <q-item clickable v-ripple to="/categorii">
            <q-item-section avatar><q-icon name="category" /></q-item-section>
            <q-item-section>Categorii Integrame</q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/integrame">
            <q-item-section avatar><q-icon name="grid_on" /></q-item-section>
            <q-item-section>Integrame</q-item-section>
          </q-item>
            <q-item clickable v-ripple to="/stats">
              <q-item-section avatar><q-icon name="insights" /></q-item-section>
              <q-item-section>Statistici</q-item-section>
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
          <q-item clickable v-ripple to="/dog">
            <q-item-section avatar><q-icon name="person_add" /></q-item-section>
            <q-item-section>Dog</q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/dog-showcase">
            <q-item-section avatar><q-icon name="pets" /></q-item-section>
            <q-item-section>Dog Showcase</q-item-section>
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

          <q-btn flat round dense class="q-mr-sm">
            <q-badge color="amber" floating>{{ auth.user?.coins ?? 0 }}</q-badge>
            <div style="font-size:18px;line-height:1">🪙</div>
          </q-btn>
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

        <q-space />
        <!-- Dark mode toggle -->
        <q-btn
          flat
          dense
          round
          :icon="$q.dark.isActive ? 'light_mode' : 'dark_mode'"
          @click="toggleDark"
          :aria-label="$q.dark.isActive ? 'Comută pe mod deschis' : 'Comută pe mod întunecat'"
        >
          <q-tooltip anchor="bottom middle" self="top middle">
            {{ $q.dark.isActive ? 'Luminos' : 'Întunecat' }}
          </q-tooltip>
        </q-btn>

        <!-- Christmas theme quick toggle -->
        <q-btn
          flat
          dense
          round
          :icon="seasonalTheme === 'christmas' ? 'holiday_village' : 'celebration'"
          @click="toggleChristmasTheme"
          aria-label="Comută tema Crăciun"
        >
          <q-tooltip anchor="bottom middle" self="top middle">
            {{ seasonalTheme === 'christmas' ? 'Crăciun activ' : 'Activează Crăciun' }}
          </q-tooltip>
        </q-btn>

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
import { useQuasar } from 'quasar'
import { useGame } from 'stores/game'
import { mmss } from 'src/utils/time'
import { useAuth } from 'stores/auth'
import { useRouter } from 'vue-router'
import { api } from 'src/boot/axios'


const game = useGame()
const $q = useQuasar()
const auth = useAuth()
const router = useRouter()
const drawer = ref(false)

// Seasonal visuals (global overlay)
const seasonalTheme = ref<string>('')
const particles = ref<Array<{ id: string; style: Record<string,string> }>>([])
const eggs = ref<Array<{ id: string; style: Record<string,string> }>>([])

function makeParticles(count = 36, kind: 'christmas'|'easter' = 'christmas') {
  const arr: Array<{ id: string; style: Record<string,string> }> = []
  for (let i = 0; i < count; i++) {
    const left = Math.random() * 100
    const size = kind === 'christmas' ? 6 + Math.random()*16 : 8 + Math.random()*18
    const fall = 6 + Math.random()*8
    const delay = Math.random()*3
    const color = kind === 'christmas' ? (Math.random()>0.6 ? 'rgba(255,255,255,0.95)' : `hsl(${Math.floor(0+Math.random()*60)},70%,60%)`) : `hsl(${Math.floor(260 + Math.random()*100)},70%,85%)`
    arr.push({ id: `p_${Date.now()}_${i}_${Math.random().toString(36).slice(2,5)}`, style: { left: `${left}%`, width: `${size}px`, height: `${size}px`, background: color, animationDuration: `${fall}s`, animationDelay: `${delay}s` } })
  }
  particles.value = arr
}

function makeEggs(count = 8) {
  const arr: Array<{ id: string; style: Record<string,string> }> = []
  for (let i=0;i<count;i++) {
    const left = Math.random()*100
    const top = 20 + Math.random()*60
    const scale = 0.9 + Math.random()*0.8
    const hue = 250 + Math.random()*140
    arr.push({ id: `egg_${Date.now()}_${i}`, style: { left: `${left}%`, top: `${top}%`, transform: `scale(${scale})`, background: `linear-gradient(135deg,hsl(${hue},70%,85%), hsl(${hue+20},70%,75%))` } })
  }
  eggs.value = arr
}

function clearSeasonal() { particles.value = []; eggs.value = [] }

// listen to storage so changes in settings propagate across tabs/components
function normalizeThemeValue(raw: unknown) {
  if (raw == null) return ''
  if (typeof raw === 'string') {
    const s = raw.trim()
    if (!s) return ''
    if (s === '[object Object]') return ''
    if (s.startsWith('{') || s.startsWith('[')) return ''
    return s
  }
  return ''
}

function applyThemeValue(saved: string) {
  seasonalTheme.value = saved
  console.debug('[MainLayout] applyThemeValue ->', saved)
  // update body classes
  if (document && document.body) {
    document.body.classList.remove('theme-christmas', 'theme-easter')
    if (saved === 'christmas') document.body.classList.add('theme-christmas')
    else if (saved === 'easter') document.body.classList.add('theme-easter')
  }
  // update visuals
  if (saved === 'christmas') { makeParticles(48,'christmas'); eggs.value = [] }
  else if (saved === 'easter') { makeParticles(40,'easter'); makeEggs(10) }
  else clearSeasonal()
}

function onStorage(e: StorageEvent) {
  if (e.key === 'mintegram_seasonal_theme') {
    const raw = e.newValue
    console.debug('[MainLayout] storage event ->', { key: e.key, newValue: e.newValue })
    const saved = normalizeThemeValue(raw)
    if (!saved) {
      // cleanup any invalid stored value
      try { localStorage.removeItem('mintegram_seasonal_theme') } catch { console.debug('Could not remove invalid seasonal theme') }
      applyThemeValue('')
      return
    }
    applyThemeValue(saved)
  }
}
window.addEventListener('storage', onStorage)
function onSeasonalChange(e: Event) {
  const raw = (e as CustomEvent).detail
  console.debug('[MainLayout] mintegram-seasonal-change event ->', raw)
  const t = normalizeThemeValue(raw)
  applyThemeValue(t)
}
window.addEventListener('mintegram-seasonal-change', onSeasonalChange as EventListener)


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

function toggleDark() {
  $q.dark.toggle()
  try {
    localStorage.setItem('theme', $q.dark.isActive ? 'dark' : 'light')
  } catch {/* ignore */}
}

function toggleChristmasTheme() {
  // toggle between '' and 'christmas'
  const next = seasonalTheme.value === 'christmas' ? '' : 'christmas'
  seasonalTheme.value = next
  try {
    if (next) localStorage.setItem('mintegram_seasonal_theme', next)
    else localStorage.removeItem('mintegram_seasonal_theme')
  } catch { /* ignore storage errors */ }
  applyThemeValue(next)
  // notify user
  try { $q.notify({ type: 'positive', message: next ? 'Tema de Crăciun activată 🎄' : 'Tema de Crăciun dezactivată' }) } catch { /* ignore */ }
  // dispatch event for other components in same tab
  try { window.dispatchEvent(new CustomEvent('mintegram-seasonal-change', { detail: next })) } catch { /* ignore */ }
}

let timer: number | undefined
onMounted(async () => {
  drawer.value = false
  await game.init()
  timer = window.setInterval(() => game.tick(), 250)
  // Verificare automată token la inițializare
  if (auth.access) {
    await auth.fetchMe()
    if (!auth.user) {
      auth.logout()
      // opțional: router.push('/login') dacă vrei redirect instant
    }
  }
  // init seasonal theme from localStorage
  try {
    const raw = localStorage.getItem('mintegram_seasonal_theme') || ''
    const saved = normalizeThemeValue(raw)
    console.debug('[MainLayout] init seasonal theme from storage ->', { raw, saved })
    if (saved) applyThemeValue(saved)
  } catch { console.debug('Could not initialize seasonal theme') }
})
onBeforeUnmount(() => { if (timer) clearInterval(timer); window.removeEventListener('storage', onStorage); window.removeEventListener('mintegram-seasonal-change', onSeasonalChange as EventListener) })
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
/* Seasonal overlay base */
.season-overlay { position:fixed; inset:0; pointer-events:none; z-index:0; overflow:hidden; }
.season-overlay .particles { position:absolute; inset:0; }
.season-overlay .particle { position:absolute; top:-40px; border-radius:50%; opacity:0.95; }

/* Christmas specific */
.christmas-overlay { background: radial-gradient(circle at top left, rgba(255,255,255,0.6), transparent 60%), radial-gradient(circle at top right, rgba(255,255,255,0.4), transparent 55%); }
.christmas-overlay .garland { position:absolute; top:0; left:0; right:0; height:54px; display:flex; justify-content:center; align-items:flex-end; padding:4px 12px; }
.christmas-overlay .garland-light { width:14px; height:14px; margin:0 6px; border-radius:50%; background: hsl(var(--h,50) 80% 55%); box-shadow:0 0 8px 3px currentColor; animation: garlandPulse 3s ease-in-out infinite; }
.christmas-overlay .garland-light:nth-child(4n) { --h: 5; color:#ff5252; }
.christmas-overlay .garland-light:nth-child(4n+1) { --h: 120; color:#66bb6a; }
.christmas-overlay .garland-light:nth-child(4n+2) { --h: 45; color:#ffeb3b; }
.christmas-overlay .garland-light:nth-child(4n+3) { --h: 200; color:#64b5f6; }
@keyframes garlandPulse { 0%,100% { transform:translateY(0) scale(1); opacity:0.95;} 50% { transform:translateY(4px) scale(0.7); opacity:0.5;} }

/* Easter specific */
.easter-overlay { background: radial-gradient(circle at 30% 10%, rgba(255,230,250,0.7), transparent 60%), radial-gradient(circle at 70% 15%, rgba(230,240,255,0.6), transparent 65%); }
.floating-eggs { position:absolute; inset:0; }
.egg { position:absolute; width:42px; height:54px; border-radius:50% 50% 45% 45%; box-shadow:0 4px 10px -2px rgba(0,0,0,0.18); animation: eggFloat 6s ease-in-out infinite; }
.egg:nth-child(odd) { animation-duration:7.2s; }
@keyframes eggFloat { 0%,100% { transform:translateY(0) scale(1);} 50% { transform:translateY(-24px) scale(1.05);} }

</style>
