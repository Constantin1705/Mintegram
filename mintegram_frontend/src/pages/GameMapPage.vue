<template>
  <q-page class="game-map-page">
    <!-- Background cu efect parallax -->
    <div class="parallax-background">
      <div class="parallax-layer layer-1"></div>
      <div class="parallax-layer layer-2"></div>
      <div class="parallax-layer layer-3"></div>
    </div>

    <!-- Conținutul principal -->
    <div class="map-content">
      <!-- Header cu informații jucător -->
      <div class="map-header">
        <q-card flat class="header-card glass-effect">
          <q-card-section horizontal class="items-center">
            <q-avatar size="60px" class="q-mr-md">
              <img src="https://cdn.quasar.dev/img/avatar.png" />
            </q-avatar>
            <div class="col">
              <div class="text-h6 text-weight-bold">{{ playerName }}</div>
              <div class="text-caption text-grey-7">Nivel {{ currentLevel }} • {{ completedLevels }}/{{ totalLevels }} Complete</div>
            </div>
            <q-linear-progress
              :value="progress"
              color="primary"
              size="8px"
              rounded
              class="q-mt-sm"
              style="width: 200px;"
            />
          </q-card-section>
        </q-card>
      </div>

      <!-- Harta cu nivele -->
      <div class="levels-container" ref="levelsContainer">
        <!-- Path SVG pentru linie între nivele -->
        <svg class="path-svg" :viewBox="`0 0 ${mapWidth} ${mapHeight}`">
          <defs>
            <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:#1976d2;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#66bb6a;stop-opacity:1" />
            </linearGradient>
          </defs>
          <path
            v-for="(path, idx) in paths"
            :key="idx"
            :d="path.d"
            :class="['level-path', { completed: path.completed, active: path.active }]"
            fill="none"
            stroke="url(#pathGradient)"
            stroke-width="6"
            stroke-linecap="round"
            :stroke-dasharray="path.dasharray"
            :stroke-dashoffset="path.dashoffset"
          />
        </svg>

        <!-- Nivele -->
        <transition-group name="level" tag="div">
          <div
            v-for="level in levels"
            :key="level.id"
            :class="['level-node', getLevelClass(level)]"
            :style="{
              left: level.x + 'px',
              top: level.y + 'px'
            }"
            @click="selectLevel(level)"
            @mouseenter="hoverLevel = level.id"
            @mouseleave="hoverLevel = null"
          >
            <!-- Glow effect -->
            <div class="level-glow" v-if="level.unlocked"></div>

            <!-- Icon principal -->
            <div class="level-icon-wrapper">
              <q-avatar :size="levelSize(level) + 'px'" :class="getAvatarClass(level)">
                <q-icon :name="getLevelIcon(level)" size="32px" />

                <!-- Badge pentru stele -->
                <q-badge
                  v-if="level.stars > 0"
                  floating
                  color="amber"
                  text-color="white"
                  class="stars-badge"
                >
                  <q-icon name="star" size="12px" />
                  {{ level.stars }}
                </q-badge>
              </q-avatar>

              <!-- Particule animate pentru nivel activ -->
              <div v-if="level.id === selectedLevel" class="particles">
                <span v-for="p in 8" :key="p" class="particle" :style="particleStyle(p)"></span>
              </div>
            </div>

            <!-- Label nivel -->
            <div class="level-label">
              <div class="level-number">Nivel {{ level.id }}</div>
              <div class="level-name">{{ level.name }}</div>

              <!-- Progres bar pentru nivel curent -->
              <q-linear-progress
                v-if="level.id === currentLevel && level.progress < 100"
                :value="level.progress / 100"
                color="secondary"
                size="4px"
                rounded
                class="q-mt-xs"
              />
            </div>

            <!-- Ribbon pentru nivel nou deblocat -->
            <div v-if="level.isNew" class="new-ribbon">
              <span>NOU!</span>
            </div>
          </div>
        </transition-group>

        <!-- Bonus items pe hartă -->
        <transition-group name="bonus" tag="div">
          <div
            v-for="bonus in bonusItems"
            :key="bonus.id"
            class="bonus-item"
            :style="{
              left: bonus.x + 'px',
              top: bonus.y + 'px'
            }"
            @click="collectBonus(bonus)"
          >
            <q-avatar size="40px" color="amber-5" class="bonus-avatar">
              <q-icon :name="bonus.icon" size="24px" color="white" />
            </q-avatar>
            <div class="bonus-glow"></div>
          </div>
        </transition-group>
      </div>

      <!-- Panel informații nivel selectat -->
      <transition name="slide-up">
        <q-card v-if="selectedLevelData" class="level-info-panel glass-effect">
          <q-card-section class="row items-center">
            <div class="col">
              <div class="text-h5 text-weight-bold">{{ selectedLevelData.name }}</div>
              <div class="text-body2 text-grey-7 q-mt-xs">{{ selectedLevelData.description }}</div>

              <!-- Statistici -->
              <div class="row q-mt-md q-gutter-md">
                <div class="stat-item">
                  <q-icon name="stars" color="amber" size="20px" />
                  <span class="q-ml-xs">{{ selectedLevelData.stars }}/3 Stele</span>
                </div>
                <div class="stat-item">
                  <q-icon name="emoji_events" color="orange" size="20px" />
                  <span class="q-ml-xs">{{ selectedLevelData.highScore }} Puncte</span>
                </div>
                <div class="stat-item">
                  <q-icon name="timer" color="blue" size="20px" />
                  <span class="q-ml-xs">{{ selectedLevelData.bestTime }}</span>
                </div>
              </div>
            </div>

            <!-- Butoane acțiuni -->
            <div class="col-auto">
              <q-btn
                v-if="selectedLevelData.unlocked"
                :label="selectedLevelData.completed ? 'Joacă din nou' : 'Start'"
                color="primary"
                size="lg"
                unelevated
                rounded
                icon-right="play_arrow"
                @click="startLevel(selectedLevelData)"
                class="action-button"
              />
              <q-btn
                v-else
                label="Blocat"
                color="grey"
                size="lg"
                unelevated
                rounded
                icon-right="lock"
                disable
              />
            </div>
          </q-card-section>
        </q-card>
      </transition>
    </div>

    <!-- Floating action button pentru setări -->
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn
        fab
        icon="settings"
        color="primary"
        @click="showSettings = true"
        class="floating-btn"
      >
        <q-tooltip>Setări</q-tooltip>
      </q-btn>
    </q-page-sticky>

    <!-- Dialog setări -->
    <q-dialog v-model="showSettings">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Setări Hartă</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-toggle v-model="showPaths" label="Arată căile" />
          <q-toggle v-model="showBonus" label="Arată bonus-uri" />
          <q-toggle v-model="animations" label="Animații" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Type definitions
type Level = {
  id: number
  x: number
  y: number
  name: string
  description: string
  unlocked: boolean
  completed: boolean
  stars: number
  highScore: number
  bestTime: string
  progress: number
  isNew: boolean
}

type BonusItem = {
  id: number
  x: number
  y: number
  icon: string
  type: string
}

// Date jucător
const playerName = ref('Jucător')
const currentLevel = ref(5)
const completedLevels = ref(4)
const totalLevels = ref(20)

// State
const selectedLevel = ref<number | null>(null)
const hoverLevel = ref<number | null>(null)
const showSettings = ref(false)
const showPaths = ref(true)
const showBonus = ref(true)
const animations = ref(true)

// Dimensiuni hartă
const mapWidth = ref(1200)
const mapHeight = ref(800)
const levelsContainer = ref<HTMLElement | null>(null)

// Nivele - poziționare în formă de cale sinuoasă
const levels = ref([
  { id: 1, x: 100, y: 600, name: 'Începutul', description: 'Primul tău nivel!', unlocked: true, completed: true, stars: 3, highScore: 1500, bestTime: '2:30', progress: 100, isNew: false },
  { id: 2, x: 250, y: 520, name: 'Provocare Ușoară', description: 'Învață bazele jocului', unlocked: true, completed: true, stars: 3, highScore: 1800, bestTime: '2:15', progress: 100, isNew: false },
  { id: 3, x: 400, y: 460, name: 'Primul Obstacol', description: 'Lucrurile devin interesante', unlocked: true, completed: true, stars: 2, highScore: 1200, bestTime: '3:00', progress: 100, isNew: false },
  { id: 4, x: 550, y: 520, name: 'Curbă Periculoasă', description: 'Atenție la capcane!', unlocked: true, completed: true, stars: 2, highScore: 1400, bestTime: '2:45', progress: 100, isNew: false },
  { id: 5, x: 700, y: 460, name: 'Nivel Curent', description: 'Poți termina acest nivel?', unlocked: true, completed: false, stars: 1, highScore: 800, bestTime: '-', progress: 45, isNew: false },
  { id: 6, x: 850, y: 400, name: 'Următoarea Aventură', description: 'Ceva nou te așteaptă', unlocked: true, completed: false, stars: 0, highScore: 0, bestTime: '-', progress: 0, isNew: true },
  { id: 7, x: 950, y: 320, name: 'Vârful Muntelui', description: 'Greutatea crește', unlocked: false, completed: false, stars: 0, highScore: 0, bestTime: '-', progress: 0, isNew: false },
  { id: 8, x: 1050, y: 240, name: 'Boss Battle', description: 'Confruntare epică!', unlocked: false, completed: false, stars: 0, highScore: 0, bestTime: '-', progress: 0, isNew: false },
])

// Bonus items
const bonusItems = ref([
  { id: 1, x: 320, y: 490, icon: 'diamond', type: 'diamond' },
  { id: 2, x: 620, y: 490, icon: 'local_fire_department', type: 'fire' },
  { id: 3, x: 780, y: 430, icon: 'workspace_premium', type: 'trophy' },
])

// Calculează căile între nivele
const paths = computed(() => {
  const result = []
  for (let i = 0; i < levels.value.length - 1; i++) {
    const current = levels.value[i]
    const next = levels.value[i + 1]

    if (!current || !next) continue

    // Crează o curbă Bezier între nivele
    const midX = (current.x + next.x) / 2
    const midY = (current.y + next.y) / 2 - 50

    const path = {
      d: `M ${current.x + 30} ${current.y + 30} Q ${midX} ${midY} ${next.x + 30} ${next.y + 30}`,
      completed: !!current.completed && !!next.completed,
      active: !!(current.id === currentLevel.value || next.id === currentLevel.value),
      dasharray: 1000,
      dashoffset: next.unlocked ? 0 : 1000
    }
    result.push(path)
  }
  return result
})

const progress = computed(() => completedLevels.value / totalLevels.value)

const selectedLevelData = computed(() => {
  if (!selectedLevel.value) return null
  return levels.value.find(l => l.id === selectedLevel.value)
})

function getLevelClass(level: Level) {
  const classes = []
  if (level.unlocked) classes.push('unlocked')
  if (level.completed) classes.push('completed')
  if (level.id === currentLevel.value) classes.push('current')
  if (level.id === selectedLevel.value) classes.push('selected')
  if (level.id === hoverLevel.value) classes.push('hovered')
  if (level.isNew) classes.push('new')
  return classes.join(' ')
}

function getAvatarClass(level: Level) {
  if (!level.unlocked) return 'locked-avatar'
  if (level.completed) return 'completed-avatar'
  if (level.id === currentLevel.value) return 'current-avatar'
  return 'unlocked-avatar'
}

function getLevelIcon(level: Level) {
  if (!level.unlocked) return 'lock'
  if (level.completed) return 'check_circle'
  if (level.id === currentLevel.value) return 'play_circle'
  return 'radio_button_unchecked'
}

function levelSize(level: Level) {
  if (level.id === selectedLevel.value) return 80
  if (level.id === currentLevel.value) return 70
  if (level.id === hoverLevel.value) return 65
  return 60
}

function particleStyle(index: number) {
  const angle = (index * 45) * Math.PI / 180
  return {
    '--angle': angle + 'rad'
  }
}

function selectLevel(level: Level) {
  if (!level.unlocked) return
  selectedLevel.value = level.id
}

function startLevel(level: Level) {
  // Navigate to level
  void router.push(`/integrame/${level.id}`)
}

function collectBonus(bonus: BonusItem) {
  // Remove bonus and add rewards
  const index = bonusItems.value.findIndex(b => b.id === bonus.id)
  if (index > -1) {
    bonusItems.value.splice(index, 1)
    // Show notification
  }
}

onMounted(() => {
  // Auto-select current level
  selectedLevel.value = currentLevel.value
})
</script>

<style scoped>
.game-map-page {
  min-height: 100vh;
  overflow: hidden;
  position: relative;
}

/* Parallax Background */
.parallax-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.parallax-layer {
  position: absolute;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
}

.layer-1 {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  animation: parallax1 20s ease-in-out infinite;
}

.layer-2 {
  background: radial-gradient(circle at 20% 50%, rgba(147, 51, 234, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.3) 0%, transparent 50%);
  animation: parallax2 15s ease-in-out infinite;
}

.layer-3 {
  background:
    radial-gradient(circle at 10% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 30%),
    radial-gradient(circle at 90% 80%, rgba(255, 255, 255, 0.05) 0%, transparent 40%);
  animation: parallax3 25s ease-in-out infinite;
}

@keyframes parallax1 {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

@keyframes parallax2 {
  0%, 100% { transform: translateY(0) translateX(0); }
  50% { transform: translateY(-30px) translateX(20px); }
}

@keyframes parallax3 {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

/* Content */
.map-content {
  position: relative;
  z-index: 1;
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.glass-effect {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

/* Header */
.map-header {
  margin-bottom: 30px;
}

.header-card {
  border-radius: 16px;
}

/* Levels Container */
.levels-container {
  position: relative;
  min-height: 800px;
  margin: 40px 0;
}

.path-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.level-path {
  transition: all 0.5s ease;
  opacity: 0.6;
}

.level-path.completed {
  opacity: 1;
  filter: drop-shadow(0 0 8px rgba(102, 187, 106, 0.6));
}

.level-path.active {
  opacity: 1;
  stroke-width: 8;
  filter: drop-shadow(0 0 12px rgba(33, 150, 243, 0.8));
  animation: pathPulse 2s ease-in-out infinite;
}

@keyframes pathPulse {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
}

/* Level Node */
.level-node {
  position: absolute;
  z-index: 2;
  cursor: pointer;
  transform: translate(-30px, -30px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.level-node.locked {
  cursor: not-allowed;
  filter: grayscale(100%);
  opacity: 0.5;
}

.level-node.unlocked:hover {
  transform: translate(-30px, -30px) scale(1.1) translateY(-5px);
  z-index: 10;
}

.level-node.selected {
  transform: translate(-30px, -30px) scale(1.15);
  z-index: 11;
}

.level-node.current {
  animation: currentLevelPulse 2s ease-in-out infinite;
}

@keyframes currentLevelPulse {
  0%, 100% { transform: translate(-30px, -30px) scale(1); }
  50% { transform: translate(-30px, -30px) scale(1.05); }
}

/* Level Glow */
.level-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(33, 150, 243, 0.4) 0%, transparent 70%);
  animation: glowPulse 3s ease-in-out infinite;
  pointer-events: none;
}

@keyframes glowPulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
  50% { transform: translate(-50%, -50%) scale(1.3); opacity: 0.8; }
}

/* Level Icon */
.level-icon-wrapper {
  position: relative;
  display: inline-block;
}

.locked-avatar {
  background: linear-gradient(135deg, #78909c 0%, #546e7a 100%);
}

.unlocked-avatar {
  background: linear-gradient(135deg, #42a5f5 0%, #1976d2 100%);
}

.current-avatar {
  background: linear-gradient(135deg, #66bb6a 0%, #388e3c 100%);
  animation: avatarGlow 2s ease-in-out infinite;
}

.completed-avatar {
  background: linear-gradient(135deg, #ffa726 0%, #f57c00 100%);
}

@keyframes avatarGlow {
  0%, 100% { box-shadow: 0 0 20px rgba(102, 187, 106, 0.5); }
  50% { box-shadow: 0 0 40px rgba(102, 187, 106, 0.8); }
}

.stars-badge {
  top: -5px;
  right: -5px;
}

/* Particles */
.particles {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.particle {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 8px;
  height: 8px;
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  border-radius: 50%;
  animation: particleFloat 3s ease-in-out infinite;
  transform-origin: center;
}

.particle:nth-child(1) { animation-delay: 0s; }
.particle:nth-child(2) { animation-delay: 0.375s; }
.particle:nth-child(3) { animation-delay: 0.75s; }
.particle:nth-child(4) { animation-delay: 1.125s; }
.particle:nth-child(5) { animation-delay: 1.5s; }
.particle:nth-child(6) { animation-delay: 1.875s; }
.particle:nth-child(7) { animation-delay: 2.25s; }
.particle:nth-child(8) { animation-delay: 2.625s; }

@keyframes particleFloat {
  0% {
    transform: translate(-50%, -50%) rotate(var(--angle)) translateX(0);
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) rotate(var(--angle)) translateX(60px);
    opacity: 0;
  }
}

/* Level Label */
.level-label {
  text-align: center;
  margin-top: 8px;
  min-width: 120px;
}

.level-number {
  font-weight: 700;
  font-size: 14px;
  color: #1976d2;
}

.level-name {
  font-size: 12px;
  color: #666;
  margin-top: 2px;
}

/* New Ribbon */
.new-ribbon {
  position: absolute;
  top: -10px;
  right: -10px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(238, 90, 111, 0.4);
  animation: ribbonBounce 1s ease-in-out infinite;
}

@keyframes ribbonBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

/* Bonus Items */
.bonus-item {
  position: absolute;
  z-index: 3;
  cursor: pointer;
  transform: translate(-20px, -20px);
  transition: all 0.3s ease;
  animation: bonusBounce 2s ease-in-out infinite;
}

.bonus-item:hover {
  transform: translate(-20px, -20px) scale(1.2);
}

@keyframes bonusBounce {
  0%, 100% { transform: translate(-20px, -20px) translateY(0); }
  50% { transform: translate(-20px, -20px) translateY(-10px); }
}

.bonus-avatar {
  box-shadow: 0 4px 12px rgba(255, 193, 7, 0.4);
}

.bonus-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 193, 7, 0.4) 0%, transparent 70%);
  animation: bonusGlow 2s ease-in-out infinite;
}

@keyframes bonusGlow {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
  50% { transform: translate(-50%, -50%) scale(1.4); opacity: 0.9; }
}

/* Level Info Panel */
.level-info-panel {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  max-width: 800px;
  width: 90%;
  border-radius: 16px;
  z-index: 100;
}

.stat-item {
  display: inline-flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.05);
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 14px;
}

.action-button {
  box-shadow: 0 4px 16px rgba(33, 150, 243, 0.4);
  transition: all 0.3s ease;
}

.action-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(33, 150, 243, 0.6);
}

/* Floating Button */
.floating-btn {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

/* Transitions */
.level-enter-active {
  animation: levelEnter 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes levelEnter {
  0% {
    transform: translate(-30px, -30px) scale(0);
    opacity: 0;
  }
  60% {
    transform: translate(-30px, -30px) scale(1.1);
  }
  100% {
    transform: translate(-30px, -30px) scale(1);
    opacity: 1;
  }
}

.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-up-enter-from {
  transform: translateX(-50%) translateY(100%);
  opacity: 0;
}

.slide-up-leave-to {
  transform: translateX(-50%) translateY(100%);
  opacity: 0;
}

.bonus-enter-active {
  animation: bonusEnter 0.5s ease-out;
}

@keyframes bonusEnter {
  0% {
    transform: translate(-20px, -20px) scale(0) rotate(0deg);
    opacity: 0;
  }
  60% {
    transform: translate(-20px, -20px) scale(1.2) rotate(180deg);
  }
  100% {
    transform: translate(-20px, -20px) scale(1) rotate(360deg);
    opacity: 1;
  }
}

.bonus-leave-active {
  animation: bonusLeave 0.4s ease-in;
}

@keyframes bonusLeave {
  0% {
    transform: translate(-20px, -20px) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(-20px, -20px) scale(2) translateY(-60px);
    opacity: 0;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .map-content {
    padding: 10px;
  }

  .level-info-panel {
    width: 95%;
  }

  .levels-container {
    min-height: 600px;
  }
}
</style>
