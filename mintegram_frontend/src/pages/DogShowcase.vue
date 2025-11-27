<template>
  <q-page class="q-pa-md q-px-xl dog-showcase-page">
    <div class="grid-container">
      <!-- LEFT: DOG + BALON -->
      <div class="dog-wrapper" aria-label="Animație câine ce prezintă aplicația">
        <svg
          class="dog-svg"
          viewBox="0 0 260 200"
          role="img"
          aria-labelledby="dogTitle dogDesc"
        >
          <title id="dogTitle">Câine mascotă</title>
          <desc id="dogDesc">
            Câine animat care dă din coadă și indică spre un balon cu text.
          </desc>

          <!-- Shadow -->
          <ellipse cx="130" cy="180" rx="70" ry="18" fill="rgba(0,0,0,0.15)" />

          <!-- Tail -->
          <g class="tail">
            <path
              d="M180 130 C210 110 220 100 225 90 C220 120 210 140 200 150 Z"
              fill="#8d5a2b"
            />
          </g>

          <!-- Body -->
          <path
            d="M85 90 C80 60 110 40 140 42 C175 40 205 55 200 95 C198 120 185 150 160 155 L110 155 C95 145 88 120 85 90 Z"
            fill="#b88346"
          />

          <!-- Belly patch -->
          <path
            d="M120 88 C115 70 140 65 160 68 C178 72 188 90 184 110 C182 125 175 140 162 142 L130 142 C123 135 118 120 120 88 Z"
            fill="#d9b587"
          />

          <!-- Legs -->
          <rect x="110" y="150" width="18" height="26" rx="6" fill="#8d5a2b" />
          <rect x="150" y="150" width="18" height="26" rx="6" fill="#8d5a2b" />

          <!-- Head group -->
          <g class="head-group">
            <path
              d="M100 65 C95 40 125 25 150 28 C178 30 200 45 195 75 C193 90 185 108 170 112 L135 112 C118 105 105 90 100 65 Z"
              fill="#b88346"
            />
            <!-- Ear left -->
            <path
              d="M125 40 C120 25 135 18 145 24 C148 28 150 35 149 42 Z"
              fill="#8d5a2b"
            />
            <!-- Ear right -->
            <path
              d="M170 42 C172 30 185 28 190 40 C188 45 185 52 180 56 Z"
              fill="#8d5a2b"
            />
            <!-- Snout -->
            <path
              d="M138 88 C140 78 150 72 162 74 C170 76 176 80 178 86 C176 92 170 98 162 100 L148 98 C143 96 140 92 138 88 Z"
              fill="#d9b587"
            />
            <!-- Nose -->
            <circle cx="170" cy="85" r="6" fill="#222" />
            <!-- Eyes -->
            <circle cx="150" cy="70" r="6" fill="#222" />
            <circle cx="168" cy="72" r="6" fill="#222" />
            <!-- Wink overlay -->
            <rect class="wink" x="147" y="68" width="8" height="4" rx="2" fill="#222" />
            <!-- Smile -->
            <path
              d="M152 95 C158 102 168 100 172 94"
              stroke="#222"
              stroke-width="3"
              fill="none"
              stroke-linecap="round"
            />
          </g>

          <!-- Pointer paw -->
          <g class="paw-pointer">
            <circle cx="90" cy="120" r="18" fill="#b88346" />
            <circle cx="83" cy="113" r="4" fill="#8d5a2b" />
            <circle cx="90" cy="110" r="4" fill="#8d5a2b" />
            <circle cx="97" cy="113" r="4" fill="#8d5a2b" />
          </g>
        </svg>

        <!-- SPEECH BUBBLE -->
        <div
          class="speech"
          role="status"
          aria-live="polite"
          @mouseenter="pauseRotation"
          @mouseleave="resumeRotation"
        >
          <transition name="fade">
            <div v-if="currentFeature" :key="currentFeature" class="speech-content">
              <h2 class="text-subtitle2 q-mb-xs">🐶 Salut, eu sunt ghidul tău!</h2>
              <p class="q-mb-none">
                {{ currentFeature }}
              </p>
            </div>
          </transition>

          <div class="progress-bar" aria-hidden="true">
            <div class="progress-inner" :style="{ width: progressPct + '%' }"></div>
          </div>

          <!-- Navigation dots -->
          <div class="speech-dots" aria-hidden="true">
            <button
              v-for="(f, i) in features"
              :key="i"
              class="dot"
              :class="{ 'dot--active': i === index }"
              type="button"
              @click="goToFeature(i)"
            />
          </div>
        </div>
      </div>

      <!-- RIGHT: INFO PANEL -->
      <div class="info-panel q-mt-xl">
        <q-card flat bordered class="q-pa-md dog-info-card">
          <q-card-section>
            <div class="row items-center justify-between q-mb-sm">
              <div class="text-h6">Prezentare rapidă</div>
              <q-chip
                dense
                outline
                icon="emoji_events"
                class="text-primary"
              >
                Gamified experience
              </q-chip>
            </div>

            <p class="text-body2 q-mb-md">
              Această pagină folosește un <strong>SVG animat</strong> +
              <strong>Vue transitions</strong> și un sistem de mesaje rotative pe care
              le poți personaliza. Mai târziu, poți înlocui cu un fișier
              <strong>Lottie</strong> (JSON) pentru animații și mai fluide.
            </p>

            <div class="row q-col-gutter-md q-mb-md">
              <div class="col-12 col-md-7">
                <q-list dense bordered class="rounded-borders">
                  <q-item v-for="(f, i) in features" :key="i">
                    <q-item-section avatar>
                      <q-icon name="pets" size="18px" />
                    </q-item-section>
                    <q-item-section>{{ f }}</q-item-section>
                  </q-item>
                </q-list>
              </div>

              <div class="col-12 col-md-5 column justify-between">
                <q-banner rounded class="bg-indigo-1 text-indigo-9 q-mb-sm">
                  <div class="text-subtitle2 q-mb-xs">Înlocuire cu Lottie</div>
                  <div class="text-body2">
                    Creează <code>src/assets/dog.json</code> și folosește componenta
                    <code>&lt;MascotLottie /&gt;</code> în locul SVG-ului.
                  </div>
                </q-banner>

                <div class="stats-row">
                  <div class="stat-pill">
                    <span class="stat-label">Niveluri</span>
                    <span class="stat-value">120+</span>
                  </div>
                  <div class="stat-pill">
                    <span class="stat-label">Badge-uri</span>
                    <span class="stat-value">30+</span>
                  </div>
                  <div class="stat-pill">
                    <span class="stat-label">Moduri</span>
                    <span class="stat-value">Dark / Xmas</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="row items-center justify-between">
              <div class="text-caption text-grey-7">
                Sfaturi UX: păstrează mesajele scurte, clare și cu un singur obiectiv.
              </div>
              <q-btn
                color="primary"
                unelevated
                rounded
                icon="play_arrow"
                label="Începe acum"
              />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'

const features = [
  'Rezolvă integrame și crește nivelul tău de logică.',
  'Participă la provocări zilnice și urcă în clasament.',
  'Colectează inimioare și diamante pentru bonusuri speciale.',
  'Personalizează tema: dark mode sau sezonieră (Crăciun, Paște).',
  'Explorează harta nivelurilor și deblochează badge-uri rare.',
  'Activează abonamentele pentru XP boost și recompense extra.'
]

const index = ref(0)
const intervalMs = 4800
const progress = ref(0)
const isPaused = ref(false)

let timer: number | undefined
let progressTimer: number | undefined

const currentFeature = computed(() => features[index.value] || '')
const progressPct = computed(() => Math.min(100, progress.value))

function advance() {
  if (isPaused.value) return
  index.value = (index.value + 1) % features.length
  progress.value = 0
}

function goToFeature(i: number) {
  index.value = i
  progress.value = 0
}

function pauseRotation() {
  isPaused.value = true
}

function resumeRotation() {
  isPaused.value = false
}

onMounted(() => {
  timer = window.setInterval(advance, intervalMs)
  progressTimer = window.setInterval(() => {
    if (isPaused.value) return
    progress.value += 100 / (intervalMs / 150)
    if (progress.value >= 100) {
      progress.value = 100
    }
  }, 150)
})

onBeforeUnmount(() => {
  if (timer !== undefined) clearInterval(timer)
  if (progressTimer !== undefined) clearInterval(progressTimer)
})
</script>

<style scoped>
.dog-showcase-page {
  position: relative;
  min-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at top, #f3f4ff 0, #f5f5f9 40%, #eef2ff 100%);
}

/* Layout */
.grid-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
}

.dog-wrapper {
  position: relative;
  max-width: 520px;
  width: 100%;
}

.dog-svg {
  width: 100%;
  height: auto;
  display: block;
}

/* Animations */
.tail {
  transform-origin: 180px 130px;
  animation: tailWag 0.8s ease-in-out infinite;
}
@keyframes tailWag {
  0%,
  100% {
    transform: rotate(8deg);
  }
  50% {
    transform: rotate(-18deg);
  }
}

.head-group {
  animation: headBob 3.2s ease-in-out infinite;
  transform-origin: 150px 70px;
}
@keyframes headBob {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(3px);
  }
}

.wink {
  animation: winkAnim 6s linear infinite;
  opacity: 0;
}
@keyframes winkAnim {
  0%,
  92%,
  100% {
    opacity: 0;
  }
  94%,
  98% {
    opacity: 1;
  }
}

.paw-pointer {
  transform-origin: 90px 120px;
  animation: pawPulse 2.8s ease-in-out infinite;
}
@keyframes pawPulse {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px);
  }
}

/* Speech bubble */
.speech {
  position: absolute;
  left: 0;
  right: 0;
  top: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 4px;
}

.speech-content {
  position: relative; /* pentru “codița” balonului */
  background: linear-gradient(135deg, #ffffff, #f7f9ff);
  border: 2px solid #c5d3ff;
  padding: 12px 18px;
  border-radius: 14px;
  max-width: 380px;
  box-shadow: 0 6px 18px -6px rgba(0, 0, 0, 0.18);
}
.speech-content::after {
  content: '';
  position: absolute;
  bottom: -14px;
  left: 54px;
  width: 0;
  height: 0;
  border-left: 14px solid transparent;
  border-right: 14px solid transparent;
  border-top: 14px solid #fff;
  filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.12));
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.35s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Progress bar */
.progress-bar {
  position: absolute;
  bottom: -6px;
  left: 12px;
  right: 12px;
  height: 4px;
  background: rgba(0, 0, 0, 0.12);
  border-radius: 2px;
  overflow: hidden;
}
.progress-inner {
  height: 100%;
  background: #42a5f5;
  transition: width 0.15s linear;
}

/* Dots navigation */
.speech-dots {
  margin-top: 18px;
  display: flex;
  gap: 6px;
}
.dot {
  width: 9px;
  height: 9px;
  border-radius: 999px;
  border: none;
  background: rgba(25, 118, 210, 0.3);
  padding: 0;
  cursor: pointer;
  transition: transform 0.18s ease, background 0.18s ease, width 0.18s ease;
}
.dot--active {
  width: 18px;
  background: rgba(25, 118, 210, 1);
  transform: translateY(-1px);
}

/* Card */
.dog-info-card {
  backdrop-filter: blur(4px);
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 18px 40px -20px rgba(15, 23, 42, 0.45);
  border-radius: 18px;
}

/* Stats pills */
.stats-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.stat-pill {
  flex: 1 1 auto;
  min-width: 80px;
  padding: 6px 10px;
  border-radius: 999px;
  background: #e9ecff;
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}
.stat-label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  opacity: 0.7;
}
.stat-value {
  font-weight: 600;
  font-size: 13px;
}

/* Christmas / Easter themes */
body.theme-christmas .speech-content {
  border-color: #d32f2f;
  background: linear-gradient(135deg, #fff, #ffe9e9);
}
body.theme-christmas .progress-inner {
  background: #d32f2f;
}
body.theme-easter .speech-content {
  border-color: #9575cd;
  background: linear-gradient(135deg, #fff, #f5e9ff);
}
body.theme-easter .progress-inner {
  background: #9575cd;
}

/* Responsive */
@media (min-width: 900px) {
  .grid-container {
    flex-direction: row;
    align-items: flex-start;
    gap: 48px;
  }
  .info-panel {
    flex: 1;
  }
  .dog-wrapper {
    flex: 1;
  }
  .speech {
    top: -6px;
  }
}
</style>
