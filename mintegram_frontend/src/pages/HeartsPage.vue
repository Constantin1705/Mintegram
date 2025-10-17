<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-12 col-sm-8 col-md-6">
        <q-card class="q-pa-lg">
          <div class="row items-center q-gutter-md q-mb-md">
            <q-circular-progress
              :value="(1 - game.cooldownProgress) * 100"
              size="120px"
              :thickness="0.22"
              color="red-5"
              track-color="grey-3"
              show-value
            >
              <div class="column items-center">
                <q-icon name="favorite" color="red-6" size="32px" />
                <div class="text-subtitle2 q-mt-xs">
                  {{ game.onCooldown ? mmss(game.remainingSec) : 'Ready' }}
                </div>
              </div>
            </q-circular-progress>

            <div>
              <div class="text-h6">Vieți: {{ game.hearts }} / {{ game.maxHearts }}</div>
              <div class="text-body2 text-grey-7">
                LVL {{ game.level }} · XP {{ game.xp }} / {{ game.level * 100 }}
              </div>
              <q-linear-progress
                :value="game.xpProgress"
                color="amber"
                track-color="grey-3"
                class="q-mt-sm"
              />
            </div>
          </div>

          <div class="row q-gutter-sm">
            <q-btn
              label="Folosește o inimă"
              color="primary"
              :disable="!game.canUseHeart()"
              @click="useOne"
              unelevated
              rounded
            />
            <q-btn label="+25 XP" outline color="amber-8" @click="game.addXpAndSync(25)" />
            <q-btn label="+10 monede" outline color="amber" @click="addCoins" />
          </div>

          <div v-if="!game.canUseHeart()" class="text-negative q-mt-md">
            {{ game.onCooldown ? 'Se recuperează...' : 'Nu mai ai inimi.' }}
          </div>
        </q-card>
      </div>
    </div>

    <!-- Pop-up badge nou -->
    <q-dialog v-model="showBadgeDialog" persistent transition-show="jump-down" transition-hide="jump-up">
      <q-card class="q-pa-lg flex flex-center badge-popup-card" style="min-width:320px;max-width:90vw;">
        <div class="column items-center q-gutter-md">
          <q-avatar size="100px" v-if="game.newBadge?.icon" class="badge-avatar">
            <img :src="badgeImgUrl(game.newBadge.icon) || ''" alt="badge" style="object-fit:contain;" />
          </q-avatar>
          <div class="text-h5 text-weight-bold text-center text-primary">Felicitări!</div>
          <div class="text-h6 text-center text-accent">Ai primit un nou badge:</div>
          <div class="text-h5 text-weight-bold text-center q-mb-xs">{{ game.newBadge?.name }}</div>
          <div class="text-subtitle2 text-center text-grey-8">{{ game.newBadge?.description }}</div>
          <q-btn color="accent" label="OK" @click="closeBadgeDialog" class="q-mt-md" rounded unelevated />
        </div>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { useAuth } from 'stores/auth'
import { api } from 'src/boot/axios'
const auth = useAuth()
async function addCoins() {
  if (auth.user) {
    try {
      const reward = 10 // Poți personaliza valoarea aici sau dintr-o variabilă/config
      const newCoins = (auth.user.coins ?? 0) + reward
      const { data } = await api.post('auth/update-progress/', {
        coins: newCoins
      })
      if (typeof data.coins === 'number') {
        auth.user.coins = data.coins
        $q.notify({
          type: 'positive',
          message: `Ai primit ${reward} monede! 🪙`,
          caption: `Total: ${data.coins} monede`,
          color: 'amber',
          position: 'top',
          timeout: 2500
        })
      } else {
        $q.notify({ type: 'warning', message: 'Eroare la sincronizare monede.' })
      }
    } catch {
      $q.notify({ type: 'negative', message: 'Eroare la conexiunea cu serverul.' })
    }
  }
}
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
// Setează URL absolut pentru imaginea badge-ului dacă e relativă
function badgeImgUrl(icon: string|null): string|undefined {
  if (!icon) return undefined
  if (icon.startsWith('http://') || icon.startsWith('https://')) return icon
  // Dacă nu începe cu /media/, prefixează-l
  let path = icon
  if (!icon.startsWith('/media/')) {
    path = '/media/' + icon.replace(/^\/*/, '')
  }
  return `http://localhost:8001${path}`
}
// Stiluri pentru pop-up colorat
// Poți muta în <style scoped> dacă vrei
const badgePopupStyle = `
.badge-popup-card {
  background: linear-gradient(135deg, #fceabb 0%, #f8b500 100%);
  border-radius: 24px;
  box-shadow: 0 8px 32px 0 rgba(0,0,0,0.25);
  border: 3px solid #f8b500;
  animation: badge-pop 0.5s cubic-bezier(.68,-0.55,.27,1.55);
}
.badge-avatar {
  box-shadow: 0 0 0 6px #fff, 0 4px 24px 0 #f8b50099;
  background: #fff;
  animation: badge-bounce 0.7s;
}
@keyframes badge-pop {
  0% { transform: scale(0.7); opacity: 0; }
  80% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(1); }
}
@keyframes badge-bounce {
  0% { transform: scale(0.5); }
  60% { transform: scale(1.2); }
  100% { transform: scale(1); }
}
`
if (typeof window !== 'undefined' && !document.getElementById('badge-popup-style')) {
  const style = document.createElement('style')
  style.id = 'badge-popup-style'
  style.innerHTML = badgePopupStyle
  document.head.appendChild(style)
}
import { useQuasar } from 'quasar'
import { useGame } from 'stores/game'
import { mmss } from 'src/utils/time'

const $q = useQuasar()
const game = useGame()
const showBadgeDialog = ref(false)

watch(() => game.newBadge, (val) => {
  showBadgeDialog.value = !!val
})

function closeBadgeDialog() {
  game.newBadge = null
  showBadgeDialog.value = false
}

async function useOne() {
  if (await game.useHeart()) {
    $q.notify({ type: 'positive', message: 'Ai folosit o inimă! ⏳ 5:00 recuperare' })
  } else {
    $q.notify({ type: 'warning', message: game.onCooldown ? 'În cooldown...' : 'Nu ai suficiente inimi!' })
  }
}

let t: number | undefined
onMounted(() => { t = window.setInterval(() => game.tick(), 250) })
onBeforeUnmount(() => { if (t) clearInterval(t) })
</script>
