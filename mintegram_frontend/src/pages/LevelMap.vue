<template>
  <q-page class="skillmap-page q-pa-md q-pb-xl">
    <div class="header row items-center justify-between q-mb-md">
      <div class="row items-center q-gutter-sm">
        <q-badge color="purple" text-color="white">Unități</q-badge>
        <div class="text-weight-bold">Drumul tău prin integrame & rebusuri</div>
      </div>
      <div class="row items-center q-gutter-sm text-grey-7">
        <q-icon name="local_fire_department"/>
        <span>{{ streak }} zile la rând</span>
      </div>
    </div>

    <!-- MAP CONTAINER -->
    <div ref="mapEl" class="map-container">
      <!-- connectors -->
      <svg class="map-svg" :viewBox="`0 0 100 ${svgHeight}`" preserveAspectRatio="none">
        <defs>
          <linearGradient id="grad-done" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#4CAF50"/>
            <stop offset="100%" stop-color="#8BC34A"/>
          </linearGradient>
          <linearGradient id="grad-current" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#7C4DFF"/>
            <stop offset="100%" stop-color="#00BCD4"/>
          </linearGradient>
          <linearGradient id="grad-locked" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#BDBDBD"/>
            <stop offset="100%" stop-color="#9E9E9E"/>
          </linearGradient>
        </defs>
        <g v-for="( _ , i) in positionedSteps" :key="'conn-'+i">
          <path v-if="i < positionedSteps.length - 1 && positionedSteps[i] && positionedSteps[i+1]"
            :d="curvePath(positionedSteps[i]!, positionedSteps[i+1]!)"
            class="connector"
            :class="positionedSteps[i+1]?.state || ''"></path>
        </g>
      </svg>

      <!-- unit ribbons -->
      <transition-group name="fade" tag="div">
        <div v-for="u in unitRibbons" :key="u.id" class="unit-ribbon" :style="{ top: u.y - 30 + 'px', backgroundColor: u.color }">
          <div class="row items-center justify-between">
            <div class="text-weight-bold">{{ u.title }}</div>
            <q-btn size="sm" round dense flat icon="play_arrow" @click="scrollToY(u.y)"/>
          </div>
        </div>
      </transition-group>

      <!-- nodes -->
      <div v-for="s in positionedSteps" :key="s.id" class="node" :class="[s.state, s.side]"
           :style="{ left: s.x + '%', top: s.y + 'px' }" @click="onNodeClick(s)">
        <div class="node-ring"></div>
        <div class="node-inner">
          <q-icon v-if="s.state==='done'" name="check_circle" size="26px"/>
          <q-icon v-else-if="s.state==='current'" name="grade" size="26px"/>
          <q-icon v-else name="lock" size="22px"/>
        </div>
        <div class="lesson-title ellipsis">{{ s.title }}</div>
      </div>
    </div>

    <!-- STICKY CTA -->
    <div class="sticky-cta">
      <q-card flat bordered class="cta-card">
        <div class="row items-center justify-between q-pa-md">
          <div>
            <div class="text-caption text-grey-6">{{ currentStep?.unit }}</div>
            <div class="text-weight-bold">{{ currentStep?.title || 'Alege o lecție' }}</div>
          </div>
          <div class="row items-center q-gutter-sm">
            <q-btn v-if="currentStep" color="primary" rounded unelevated icon="play_arrow" label="Start"/>
            <q-btn outline rounded color="grey-8" icon="map" label="Sus" @click="scrollToY(0)"/>
          </div>
        </div>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

/** TYPES **/
interface Step {
  id: string
  title: string
  unit: string
  state: 'done' | 'current' | 'locked'
}

interface PositionedStep extends Step {
  x: number // 0..100
  y: number // px in viewBox
  side: 'left' | 'right'
}

/** DEMO DATA **/
const steps = ref<Step[]>([
  { id: 'u3-1', title: 'Încălzire', unit: 'Unit 3', state: 'done' },
  { id: 'u3-2', title: 'Sinonime', unit: 'Unit 3', state: 'done' },
  { id: 'u3-3', title: 'Antag. & sensuri', unit: 'Unit 3', state: 'done' },
  { id: 'u3-4', title: 'Integr. tematică', unit: 'Unit 3', state: 'current' },
  { id: 'u3-5', title: 'Rebus logic', unit: 'Unit 3', state: 'locked' },
  { id: 'u3-6', title: 'Metafore', unit: 'Unit 3', state: 'locked' },
  { id: 'u4-1', title: 'Proverbe', unit: 'Unit 4', state: 'locked' },
  { id: 'u4-2', title: 'Istorie ușoară', unit: 'Unit 4', state: 'locked' },
  { id: 'u4-3', title: 'Cultură generală', unit: 'Unit 4', state: 'locked' },
  { id: 'u4-4', title: 'Challenge', unit: 'Unit 4', state: 'locked' },
  { id: 'u5-1', title: 'Tech & Știință', unit: 'Unit 5', state: 'locked' },
  { id: 'u5-2', title: 'Final de unitate', unit: 'Unit 5', state: 'locked' }
])

/** STATE **/
const streak = ref(7)
const mapEl = ref<HTMLElement | null>(null)

/** LAYOUT CALC **/
const stepGap = 140 // px between rows
const sideOffset = { left: 22, right: 78 } // x in %
const topPadding = 80

const positionedSteps = computed<PositionedStep[]>(() => {
  return steps.value.map((s, i) => {
    const side: 'left' | 'right' = i % 2 === 0 ? 'left' : 'right'
    const x = sideOffset[side]
    const y = topPadding + i * stepGap
    return { ...s, x, y, side }
  })
})

const svgHeight = computed(() => (topPadding + (steps.value.length - 1) * stepGap + 120))

const currentStep = computed(() => positionedSteps.value.find(s => s.state === 'current'))

/** UNIT RIBBONS POSITION **/
const unitRibbons = computed(() => {
  const groups: Record<string, { id: string; title: string; y: number; color: string }> = {}
  const palette = ['#7C4DFF', '#00C853', '#00BCD4', '#FF9800']
  let pi = 0
  for (const s of positionedSteps.value) {
    const unitStr: string = s.unit || 'Unknown Unit';
    if (!groups[unitStr]) {
      groups[unitStr] = { id: unitStr, title: unitStr, y: s.y, color: palette[pi % palette.length] || '#7C4DFF' }
      pi++
    }
  }
  return Object.values(groups)
})

/** SVG CURVE BETWEEN TWO STEPS **/
function curvePath(a: PositionedStep, b: PositionedStep) {
  const dx1 = a.side === 'left' ? 12 : -12
  const dx2 = b.side === 'left' ? -12 : 12
  const c1x = a.x + dx1
  const c1y = a.y + stepGap * 0.35
  const c2x = b.x + dx2
  const c2y = b.y - stepGap * 0.35
  return `M ${a.x} ${a.y} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${b.x} ${b.y}`
}

/** INTERACTIONS **/
function scrollToY(y: number) {
  const top = (mapEl.value?.offsetTop || 0) + y - window.innerHeight * 0.25
  window.scrollTo({ top, behavior: 'smooth' })
}

function onNodeClick(s: PositionedStep) {
  if (s.state === 'locked') return
  // demo: mark current as done and unlock next
  const idx = steps.value.findIndex(x => x.id === s.id)
  if (idx >= 0 && steps.value[idx]) {
    steps.value[idx].state = 'done'
    const next = steps.value[idx + 1]
    if (next) next.state = 'current'
  }
}

onMounted(() => {
  if (currentStep.value) scrollToY(currentStep.value.y)
})
</script>

<style scoped>
.skillmap-page {
  position: relative;
  overflow-x: hidden;
}

.header {
  background: linear-gradient(135deg, rgba(124,77,255,.08), rgba(0,188,212,.08));
  border-radius: 16px;
  padding: 12px 14px;
}

.map-container {
  position: relative;
  margin: 12px auto 80px;
  width: min(520px, 96%);
  /* height controlled by SVG viewBox; we let it size by absolute children */
  padding-bottom: 32px;
}

.map-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: calc(v-bind(svgHeight) * 1px);
  pointer-events: none;
}

/* Connectors */
.connector {
  fill: none;
  stroke-width: 6;
  opacity: .5;
}
.connector.done { stroke: url(#grad-done); opacity: .55; }
.connector.current { stroke: url(#grad-current); opacity: .85; filter: drop-shadow(0 2px 6px rgba(124,77,255,.35)); }
.connector.locked { stroke: url(#grad-locked); opacity: .35; stroke-dasharray: 8 10; }

/* Unit ribbon */
.unit-ribbon {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  width: 86%;
  padding: 8px 12px;
  border-radius: 10px;
  box-shadow: 0 10px 24px rgba(0,0,0,.15);
}

/* Nodes */
.node {
  position: absolute;
  transform: translate(-50%, -50%);
  width: 74px; height: 74px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  text-align: center;
}
.node .lesson-title {
  position: absolute;
  top: 86px;
  width: 120px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  color: var(--q-secondary);
}

.node .node-ring {
  position: absolute; inset: -3px;
  border-radius: 999px;
  box-shadow: 0 10px 24px rgba(0,0,0,.18);
}
.node .node-inner {
  width: 64px; height: 64px; border-radius: 50%;
  display: grid; place-items: center;
}

/* States */
.node.done .node-ring { background: radial-gradient(circle at 30% 30%, rgba(76,175,80,.25), transparent 60%); }
.node.done .node-inner { background: #E8F5E9; border: 2px solid #66BB6A; color: #43A047; }

.node.current .node-ring { background: radial-gradient(circle at 30% 30%, rgba(124,77,255,.3), transparent 60%); animation: pulse 1.6s ease-in-out infinite; }
.node.current .node-inner { background: #F3E5F5; border: 2px solid #7C4DFF; color: #7C4DFF; }

.node.locked { opacity: .75; }
.node.locked .node-inner { background: #F5F5F5; border: 2px solid #BDBDBD; color: #9E9E9E; }

@keyframes pulse { 0% { transform: scale(1) } 50% { transform: scale(1.06) } 100% { transform: scale(1) } }

/* Sides (for subtle offset/entrance if you want) */

/* Sticky CTA */
.sticky-cta {
  position: sticky;
  bottom: 10px;
}
.cta-card {
  border-radius: 14px;
  background: rgba(255,255,255,.75);
  backdrop-filter: blur(6px);
}
.dark .cta-card { background: rgba(30,30,30,.55); }

/* Transitions */
.fade-enter-active, .fade-leave-active { transition: opacity .3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
