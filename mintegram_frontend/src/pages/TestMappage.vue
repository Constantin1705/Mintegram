<template>
  <q-page class="flex flex-center">
    <div class="game-map-container">
      <img src="@/assets/map.svg" class="full-width absolute-top bg-map" alt="Map"/>
      <!-- Nivele desenate pe hartă -->
      <transition-group
        name="fade"
        tag="div"
        enter-active-class="animated bounceIn"
        leave-active-class="animated fadeOut"
      >
        <div
          v-for="level in levels"
          :key="level.id"
          :class="['level-pin', { unlocked: level.unlocked, active: activeLevel === level.id }]"
          :style="{
            left: level.x + 'px',
            top: level.y + 'px'
          }"
          @click="activateLevel(level.id)"
        >
          <q-avatar
            :icon="level.unlocked ? 'play_arrow' : 'lock'"
            color="primary"
            text-color="white"
            size="60px"
          />
          <div class="level-label">
            Nivel {{ level.id }}
          </div>
        </div>
      </transition-group>
    </div>
    <q-btn label="Deblochează următorul" color="primary" @click="unlockNextLevel" class="q-mt-md"/>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const levels = ref([
  { id: 1, x: 80, y: 300, unlocked: true },
  { id: 2, x: 220, y: 220, unlocked: false },
  { id: 3, x: 400, y: 180, unlocked: false }
])

const activeLevel = ref(1)

function activateLevel(id: number) {
  activeLevel.value = id
}

function unlockNextLevel() {
  const next = levels.value.find(l => !l.unlocked)
  if (next) next.unlocked = true
}
</script>

<style>
.game-map-container {
  position: relative;
  width: 600px;
  height: 400px;
}
.bg-map {
  z-index: 0;
  opacity: 0.8;
}
.level-pin {
  position: absolute;
  z-index: 2;
  cursor: pointer;
  transition: transform 0.3s;
}
.level-pin.unlocked {
  filter: drop-shadow(0 0 10px #66bb6a);
}
.level-pin.active {
  transform: scale(1.2);
  filter: drop-shadow(0 0 16px #2196f3);
}
.level-label {
  text-align: center;
  font-weight: 500;
  margin-top: 4px;
}
</style>

<!-- Opțional: @import "animate.css"; dacă nu-l ai deja -->
