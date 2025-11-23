<template>
  <q-page class="q-pa-md q-px-xl dog-showcase-page">
    <div class="grid-container">
      <div class="dog-wrapper" aria-label="Animație câine ce prezintă aplicația">
        <svg class="dog-svg" viewBox="0 0 260 200" role="img" aria-labelledby="dogTitle dogDesc">
          <title id="dogTitle">Câine mascotă</title>
          <desc id="dogDesc">Câine animat care dă din coadă și indică spre un balon cu text.</desc>
          <!-- Shadow -->
          <ellipse cx="130" cy="180" rx="70" ry="18" fill="rgba(0,0,0,0.15)" />
          <!-- Tail -->
          <g class="tail">
            <path d="M180 130 C210 110 220 100 225 90 C220 120 210 140 200 150 Z" fill="#8d5a2b" />
          </g>
          <!-- Body -->
          <path d="M85 90 C80 60 110 40 140 42 C175 40 205 55 200 95 C198 120 185 150 160 155 L110 155 C95 145 88 120 85 90 Z" fill="#b88346" />
          <!-- Belly patch -->
          <path d="M120 88 C115 70 140 65 160 68 C178 72 188 90 184 110 C182 125 175 140 162 142 L130 142 C123 135 118 120 120 88 Z" fill="#d9b587" />
          <!-- Legs -->
          <rect x="110" y="150" width="18" height="26" rx="6" fill="#8d5a2b" />
          <rect x="150" y="150" width="18" height="26" rx="6" fill="#8d5a2b" />
          <!-- Head group -->
          <g class="head-group">
            <path d="M100 65 C95 40 125 25 150 28 C178 30 200 45 195 75 C193 90 185 108 170 112 L135 112 C118 105 105 90 100 65 Z" fill="#b88346" />
            <!-- Ear left -->
            <path d="M125 40 C120 25 135 18 145 24 C148 28 150 35 149 42 Z" fill="#8d5a2b" />
            <!-- Ear right -->
            <path d="M170 42 C172 30 185 28 190 40 C188 45 185 52 180 56 Z" fill="#8d5a2b" />
            <!-- Snout -->
            <path d="M138 88 C140 78 150 72 162 74 C170 76 176 80 178 86 C176 92 170 98 162 100 L148 98 C143 96 140 92 138 88 Z" fill="#d9b587" />
            <!-- Nose -->
            <circle cx="170" cy="85" r="6" fill="#222" />
            <!-- Eyes -->
            <circle cx="150" cy="70" r="6" fill="#222" />
            <circle cx="168" cy="72" r="6" fill="#222" />
            <!-- Wink overlay -->
            <rect class="wink" x="147" y="68" width="8" height="4" rx="2" fill="#222" />
            <!-- Smile -->
            <path d="M152 95 C158 102 168 100 172 94" stroke="#222" stroke-width="3" fill="none" stroke-linecap="round" />
          </g>
          <!-- Pointer paw -->
          <g class="paw-pointer">
            <circle cx="90" cy="120" r="18" fill="#b88346" />
            <circle cx="83" cy="113" r="4" fill="#8d5a2b" />
            <circle cx="90" cy="110" r="4" fill="#8d5a2b" />
            <circle cx="97" cy="113" r="4" fill="#8d5a2b" />
          </g>
        </svg>
        <div class="speech" role="status" aria-live="polite">
          <transition name="fade">
            <div v-if="currentFeature" :key="currentFeature" class="speech-content">
              <h2 class="text-h6">🐶 Salut!</h2>
              <p>{{ currentFeature }}</p>
            </div>
          </transition>
          <div class="progress-bar" aria-hidden="true">
            <div class="progress-inner" :style="{ width: progressPct + '%' }"></div>
          </div>
        </div>
      </div>

      <div class="info-panel q-mt-xl">
        <q-card flat bordered class="q-pa-md dog-info-card">
          <q-card-section>
            <div class="text-h6 q-mb-sm">Prezentare rapidă</div>
            <p class="text-body2 q-mb-md">
              Această pagină folosește <strong>SVG animat</strong> + <strong>Vue transitions</strong>. Poți înlocui ușor cu un fișier Lottie (JSON) când ai animația câinelui pregătită.
            </p>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-list dense bordered class="rounded-borders">
                  <q-item v-for="(f,i) in features" :key="i"><q-item-section>{{ f }}</q-item-section></q-item>
                </q-list>
              </div>
              <div class="col-12 col-md-6">
                <q-banner rounded class="bg-indigo-1 text-indigo-9">
                  Înlocuire Lottie: creează <code>src/assets/dog.json</code> și folosește componenta <code>MascotLottie</code>.
                </q-banner>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'

// Mesaje rotative care descriu aplicația
const features = [
  'Rezolvă integrame și crește nivelul tău de logică.',
  'Participă la provocări și urcă în clasament.',
  'Colectează inimioare și diamante pentru bonusuri.',
  'Personalizează tema: dark mode sau sezonieră (Crăciun, Paște).',
  'Explorează harta nivelurilor și deblochează badge-uri.',
  'Abonamente pentru recompense suplimentare și XP boost.'
]

const index = ref(0)
const currentFeature = computed(() => features[index.value] || '')
const intervalMs = 4800
const progress = ref(0)
let timer: number | undefined
let progressTimer: number | undefined

function advance() {
  index.value = (index.value + 1) % features.length
  progress.value = 0
}

onMounted(() => {
  timer = window.setInterval(advance, intervalMs)
  progressTimer = window.setInterval(() => {
    progress.value += 100 / (intervalMs / 150)
    if (progress.value >= 100) progress.value = 100
  }, 150)
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
  if (progressTimer) clearInterval(progressTimer)
})

const progressPct = computed(() => Math.min(100, progress.value))
</script>

<style scoped>
.dog-showcase-page { position: relative; }
.grid-container { display:flex; flex-direction:column; align-items:center; }
.dog-wrapper { position:relative; max-width:520px; width:100%; }
.dog-svg { width:100%; height:auto; display:block; }

/* Tail wag */
.tail { transform-origin:180px 130px; animation: tailWag 0.8s ease-in-out infinite; }
@keyframes tailWag { 0%,100% { transform:rotate(8deg);} 50% { transform:rotate(-18deg);} }

/* Head subtle bob */
.head-group { animation: headBob 3.2s ease-in-out infinite; transform-origin:150px 70px; }
@keyframes headBob { 0%,100% { transform:translateY(0);} 50% { transform:translateY(3px);} }

/* Wink occasionally */
.wink { animation: winkAnim 6s linear infinite; opacity:0; }
@keyframes winkAnim { 0%,92%,100% { opacity:0; } 94%,98% { opacity:1; } }

/* Paw pointer pulse */
.paw-pointer { transform-origin:90px 120px; animation: pawPulse 2.8s ease-in-out infinite; }
@keyframes pawPulse { 0%,100% { transform:translateY(0);} 50% { transform:translateY(-6px);} }

/* Speech bubble */
.speech { position:absolute; left:0; right:0; top:6px; display:flex; justify-content:center; padding-top:4px; }
.speech-content { background:linear-gradient(135deg,#ffffff,#f7f9ff); border:2px solid #c5d3ff; padding:12px 18px; border-radius:14px; max-width:360px; box-shadow:0 6px 18px -6px rgba(0,0,0,0.18); }
.speech-content:after { content:''; position:absolute; bottom:-14px; left:54px; width:0; height:0; border-left:14px solid transparent; border-right:14px solid transparent; border-top:14px solid #fff; filter:drop-shadow(0 2px 3px rgba(0,0,0,0.12)); }
.fade-enter-active, .fade-leave-active { transition: opacity .35s; }
.fade-enter-from, .fade-leave-to { opacity:0; }

.progress-bar { position:absolute; bottom:-4px; left:12px; right:12px; height:4px; background:rgba(0,0,0,0.12); border-radius:2px; overflow:hidden; }
.progress-inner { height:100%; background:#42a5f5; transition:width 0.15s linear; }

.dog-info-card { backdrop-filter: blur(2px); }

/* Christmas theme accent */
body.theme-christmas .speech-content { border-color:#d32f2f; background:linear-gradient(135deg,#fff,#ffe9e9); }
body.theme-christmas .progress-inner { background:#d32f2f; }
body.theme-easter .speech-content { border-color:#9575cd; background:linear-gradient(135deg,#fff,#f5e9ff); }
body.theme-easter .progress-inner { background:#9575cd; }

@media (min-width: 900px) {
  .grid-container { flex-direction:row; align-items:flex-start; gap:48px; }
  .info-panel { flex:1; }
  .dog-wrapper { flex:1; }
  .speech { top:-6px; }
}
</style>
