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
            <q-btn label="+25 XP" outline color="amber-8" @click="game.addXp(25)" />
          </div>

          <div v-if="!game.canUseHeart()" class="text-negative q-mt-md">
            {{ game.onCooldown ? 'Se recuperează...' : 'Nu mai ai inimi.' }}
          </div>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'
import { useQuasar } from 'quasar'
import { useGame } from 'stores/game'
import { mmss } from 'src/utils/time'

const $q = useQuasar()
const game = useGame()

function useOne() {
  if (game.useHeart()) {
    $q.notify({ type: 'positive', message: 'Ai folosit o inimă! ⏳ 5:00 recuperare' })
  } else {
    $q.notify({ type: 'warning', message: game.onCooldown ? 'În cooldown...' : 'Nu mai ai inimi' })
  }
}

let t: number | undefined
onMounted(() => { t = window.setInterval(() => game.tick(), 250) })
onBeforeUnmount(() => { if (t) clearInterval(t) })
</script>
