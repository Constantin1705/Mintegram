<template>
  <q-layout view="lHh Lpr lFf">
    <!-- HEADER -->
    <q-header elevated>
      <q-toolbar>

        <q-toolbar-title>App</q-toolbar-title>

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
        </q-btn>

        <!-- Inimă + progres + badge -->
        <div
          class="relative-position q-mr-sm cursor-pointer"
          @click="$router.push('/hearts')"
          aria-label="Hearts"
        >
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

        <!-- Timer mm:ss dacă e pe cooldown -->
        <div v-if="game.onCooldown" class="text-caption text-grey-9">
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
import { onMounted, onBeforeUnmount } from 'vue'
import { useGame } from 'stores/game'
import { mmss } from 'src/utils/time'

const game = useGame()

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
