<template>
  <q-page class="homepage q-pa-lg">
    <div class="hero-container q-pa-xl rounded-borders">
      <div class="bg-pattern"></div>
      <div class="hero-inner">
        <div class="eyebrow row items-center q-gutter-sm">
          <q-badge color="primary" text-color="white" class="text-bold">Nou</q-badge>
          <span class="text-grey-6">Integrame & rebusuri românești</span>
        </div>
        <h1 class="text-weight-bolder text-h3 text-center text-md-left q-mt-md">
          Antrenează-ți mintea cu
          <span class="gradient-text">{{ currentWord }}</span>
        </h1>
        <p class="hero-sub text-subtitle1 q-mt-sm">
          Peste 100 de puzzle-uri selectate, niveluri variate și o experiență fluidă.
        </p>
        <div class="q-gutter-sm q-mt-md">
          <q-btn color="primary" size="lg" unelevated rounded :to="{path:'/integrame'}" icon="grid_on" label="Începe o integrame"/>
          <q-btn color="secondary" size="lg" outline rounded :to="{path:'/rebusuri'}" icon="lightbulb" label="Rezolvă un rebus"/>
        </div>
        <div class="mini-crossword q-mt-xl">
          <div class="grid">
            <div v-for="(row, r) in miniGrid" :key="'r'+r" class="row-wrap">
              <div v-for="(cell, c) in row" :key="'c'+c" class="cell"
                :class="{
                  black: cell.black,
                  highlight: highlightPos.row===r && highlightPos.col===c,
                  lettered: !!cell.letter && !cell.black
                }">
                <span v-if="!cell.black && cell.letter" class="letter">{{ cell.letter }}</span>
                <span v-else-if="cell.black" class="block"></span>
              </div>
            </div>
          </div>
        </div>
        <div class="floating-chips">
          <q-chip class="floaty" color="secondary" text-color="white" icon="bolt">Rapid</q-chip>
          <q-chip class="floaty delay-1" color="primary" text-color="white" icon="favorite">Preferate</q-chip>
          <q-chip class="floaty delay-2" color="accent" text-color="white" icon="flare">Dificile</q-chip>
          <q-chip class="floaty delay-3" color="teal" text-color="white" icon="spa">Relax</q-chip>
        </div>
      </div>
    </div>

    <section class="q-mt-xl">
      <div class="section-head row items-center justify-between q-mb-md">
        <div>
          <div class="text-overline text-primary">Integrame</div>
          <h2 class="text-h5 text-weight-bold q-mt-xs">Teme populare</h2>
        </div>
        <q-btn flat color="primary" icon-right="arrow_forward" label="Vezi toate" :to="{path:'/integrame'}"/>
      </div>
      <div class="row q-col-gutter-xl">
        <div v-for="(p, i) in integrame" :key="'integ'+i" class="col-12 col-sm-6 col-md-4">
          <q-intersection once transition="scale" class="full-width">
            <q-card class="puzzle-card" flat bordered>
              <q-img :src="p.cover" ratio="16/9" class="card-img">
                <div class="absolute-top-left q-pa-sm">
                  <q-badge :color="p.color" text-color="white" :label="p.difficulty" class="text-bold" />
                </div>
                <div class="absolute-bottom q-pa-md text-white">
                  <div class="text-subtitle1 text-weight-bold">{{ p.title }}</div>
                  <div class="row items-center q-gutter-x-sm opacity-80">
                    <q-icon name="grid_on" size="18px"/>
                    <span>{{ p.size }}</span>
                    <q-icon name="timer" size="18px" class="q-ml-sm"/>
                    <span>{{ p.estimate }} min</span>
                  </div>
                </div>
              </q-img>
              <q-card-section>
                <div class="text-body2 text-grey-7 ellipsis-2-lines">{{ p.desc }}</div>
              </q-card-section>
              <q-separator/>
              <q-card-actions align="between">
                <div class="row items-center q-gutter-x-xs">
                  <q-badge outline color="grey-7" :label="p.tags.join(' · ')" />
                </div>
                <q-btn flat color="primary" :to="{ path: '/integrame/' + p.slug }" label="Deschide" icon-right="arrow_forward"/>
              </q-card-actions>
            </q-card>
          </q-intersection>
        </div>
      </div>
    </section>

    <section class="q-mt-xl">
      <div class="section-head row items-center justify-between q-mb-md">
        <div>
          <div class="text-overline text-primary">Rebusuri</div>
          <h2 class="text-h5 text-weight-bold q-mt-xs">Provocări pentru tine</h2>
        </div>
        <q-btn flat color="primary" icon-right="arrow_forward" label="Vezi toate" :to="{path:'/rebusuri'}"/>
      </div>
      <div class="row q-col-gutter-xl">
        <div v-for="(p, i) in rebusuri" :key="'rebus'+i" class="col-12 col-sm-6 col-md-4">
          <q-intersection once transition="slide-up" class="full-width">
            <q-card class="puzzle-card" flat bordered>
              <q-img :src="p.cover" ratio="16/9" class="card-img">
                <div class="absolute-top-left q-pa-sm">
                  <q-badge :color="p.color" text-color="white" :label="p.difficulty" class="text-bold" />
                </div>
                <div class="absolute-bottom q-pa-md text-white">
                  <div class="text-subtitle1 text-weight-bold">{{ p.title }}</div>
                  <div class="row items-center q-gutter-x-sm opacity-80">
                    <q-icon name="psychology" size="18px"/>
                    <span>{{ p.category }}</span>
                    <q-icon name="timer" size="18px" class="q-ml-sm"/>
                    <span>{{ p.estimate }} min</span>
                  </div>
                </div>
              </q-img>
              <q-card-section>
                <div class="text-body2 text-grey-7 ellipsis-2-lines">{{ p.desc }}</div>
              </q-card-section>
              <q-separator/>
              <q-card-actions align="between">
                <div class="row items-center q-gutter-x-xs">
                  <q-badge outline color="grey-7" :label="p.tags.join(' · ')" />
                </div>
                <q-btn flat color="primary" :to="{ path: '/rebusuri/' + p.slug }" label="Deschide" icon-right="arrow_forward"/>
              </q-card-actions>
            </q-card>
          </q-intersection>
        </div>
      </div>
    </section>

    <section class="q-mt-xl tips">
      <q-separator spaced />
      <div class="row q-col-gutter-lg">
        <div class="col-12 col-md-4">
          <div class="tip-card">
            <q-icon name="rocket_launch" size="40px" />
            <h3 class="text-h6 q-mt-sm">Start instant</h3>
            <p class="text-body2 text-grey-7">Alege un nivel și intră direct în joc. Păstrăm progresul local, automat.</p>
          </div>
        </div>
        <div class="col-12 col-md-4">
          <div class="tip-card">
            <q-icon name="auto_awesome" size="40px" />
            <h3 class="text-h6 q-mt-sm">Design plăcut</h3>
            <p class="text-body2 text-grey-7">Efecte subtile, animații fluide și focus pe lizibilitate.</p>
          </div>
        </div>
        <div class="col-12 col-md-4">
          <div class="tip-card">
            <q-icon name="track_changes" size="40px" />
            <h3 class="text-h6 q-mt-sm">Antrenament zilnic</h3>
            <p class="text-body2 text-grey-7">Recomandăm provocări noi în fiecare zi pentru progres constant.</p>
          </div>
        </div>
      </div>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

interface Puzzle {
  title: string
  slug: string
  cover: string
  size?: string
  difficulty: 'Ușor' | 'Mediu' | 'Dificil'
  color: string
  estimate: number
  desc: string
  tags: string[]
  category?: string
}

const integrame: Puzzle[] = [
  { title:'Animale & Natură', slug:'animale-natura', cover:'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop', size:'9×9', difficulty:'Ușor', color:'teal-6', estimate:8, desc:'Integramă prietenoasă, perfectă pentru încălzire.', tags:['română','tematic','începători'] },
  { title:'Istorie Românească', slug:'istorie-romaneasca', cover:'https://images.unsplash.com/photo-1529074963764-98f45c47344b?q=80&w=1600&auto=format&fit=crop', size:'11×11', difficulty:'Mediu', color:'amber-7', estimate:12, desc:'Termeni și personalități din istoria României.', tags:['cultură','mediu','tematic'] },
  { title:'Știință & Tech', slug:'stiinta-tech', cover:'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1600&auto=format&fit=crop', size:'13×13', difficulty:'Dificil', color:'deep-purple-6', estimate:18, desc:'Pentru curioși: noțiuni de știință și tehnologie.', tags:['tehnic','hard','geek'] }
]

const rebusuri: Puzzle[] = [
  { title:'Rebus Clasic #1', slug:'rebus-clasic-1', cover:'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1600&auto=format&fit=crop', difficulty:'Ușor', color:'indigo-6', estimate:6, desc:'Descoperă cuvântul-cheie folosind indiciile.', tags:['clasic','rapid'], category:'Clasic' },
  { title:'Rebus Logic', slug:'rebus-logic-1', cover:'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=1600&auto=format&fit=crop', difficulty:'Mediu', color:'orange-7', estimate:10, desc:'Necesită atenție la detalii și deducție.', tags:['logică','mediu'], category:'Logică' },
  { title:'Rebus Metaforic', slug:'rebus-metaforic-1', cover:'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1600&auto=format&fit=crop', difficulty:'Dificil', color:'pink-6', estimate:14, desc:'Joacă-te cu sensurile cuvintelor.', tags:['creativ','hard'], category:'Metafore' }
]

// rotating word in hero
const words = ['integrame', 'rebusuri', 'enigme']
const currentWord = ref(words[0])
let wordTimer: number | undefined

onMounted(() => {
  let idx = 0
  wordTimer = window.setInterval(() => {
    idx = (idx + 1) % words.length
    currentWord.value = words[idx]
  }, 2200)
})

onBeforeUnmount(() => {
  if (wordTimer) window.clearInterval(wordTimer)
  if (cursorTimer) window.clearInterval(cursorTimer)
})

// mini crossword preview
type Cell = { black: boolean; letter?: string }
const miniGrid = ref<Cell[][]>([
  [ { black:false, letter:'Q' }, { black:false, letter:'U' }, { black:true }, { black:false, letter:'A' }, { black:false, letter:'R' } ],
  [ { black:false, letter:'U' }, { black:false, letter:'I' }, { black:true }, { black:false, letter:'S' }, { black:false, letter:'E' } ],
  [ { black:true }, { black:true }, { black:true }, { black:true }, { black:true } ],
  [ { black:false, letter:'V' }, { black:false, letter:'U' }, { black:true }, { black:false, letter:'E' }, { black:false, letter:'3' } ],
  [ { black:false, letter:'T' }, { black:false, letter:'S' }, { black:true }, { black:false, letter:'Q' }, { black:false, letter:'S' } ],
])

const highlightPos = ref({ row: 0, col: 0 })
let cursorTimer: number | undefined

onMounted(() => {
  let idx = 0
  wordTimer = window.setInterval(() => {
    idx = (idx + 1) % words.length
    currentWord.value = words[idx]
  }, 2200)

  cursorTimer = window.setInterval(() => {
    const next = { ...highlightPos.value }
    next.col++
    if (miniGrid.value[0] && next.col >= miniGrid.value[0].length) {
      next.col = 0
      next.row++
      if (next.row >= miniGrid.value.length) next.row = 0
    }
    highlightPos.value = next
  }, 180)
})

onBeforeUnmount(() => {
  if (wordTimer) window.clearInterval(wordTimer)
  if (cursorTimer) window.clearInterval(cursorTimer)
})

</script>

<style scoped>
.homepage {
  position: relative;
  overflow: hidden;
}

/* HERO */
.hero-container {
  position: relative;
  border-radius: 24px;
  background: radial-gradient(1200px 400px at 10% 10%, rgba(25,118,210,0.12), transparent),
              radial-gradient(900px 300px at 90% 50%, rgba(156,39,176,0.12), transparent),
              linear-gradient(135deg, rgba(0,0,0,0.02), rgba(0,0,0,0.04));
  backdrop-filter: blur(2px);
  box-shadow: 0 30px 80px rgba(0,0,0,0.12);
}

.hero-inner {
  position: relative;
  text-align: center;
}

.eyebrow {
  justify-content: center;
}

.hero-sub {
  max-width: 680px;
  margin: 0 auto;
  opacity: 0.85;
}

.gradient-text {
  background: linear-gradient(90deg, #7c4dff, #00bcd4, #ff4081);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: hue 8s linear infinite;
}

@keyframes hue {
  0% { filter: hue-rotate(0deg); }
  100% { filter: hue-rotate(360deg); }
}

.bg-pattern::before, .bg-pattern::after {
  content: "";
  position: absolute;
  inset: -2px;
  background-image:
    radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
    radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px);
  background-size: 24px 24px, 32px 32px;
  background-position: 0 0, 12px 12px;
  border-radius: inherit;
  pointer-events: none;
  mask-image: radial-gradient(circle at 50% 0%, black 45%, transparent 70%);
}

/* Floating chips */
.floating-chips {
  position: absolute;
  top: 18px;
  right: 18px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  max-width: 260px;
}

.floaty {
  animation: float 6s ease-in-out infinite;
  box-shadow: 0 6px 18px rgba(0,0,0,0.15);
}
.floaty.delay-1 { animation-delay: .8s; }
.floaty.delay-2 { animation-delay: 1.6s; }
.floaty.delay-3 { animation-delay: 2.2s; }

@keyframes float {
  0% { transform: translateY(0px) }
  50% { transform: translateY(-8px) }
  100% { transform: translateY(0px) }
}

/* Mini Crossword */
.mini-crossword .grid {
  display: inline-block;
  padding: 8px;
  border-radius: 12px;
  background: rgba(0,0,0,0.04);
  box-shadow: inset 0 0 0 1px rgba(0,0,0,0.04), 0 10px 30px rgba(0,0,0,0.08);
}
.mini-crossword .row-wrap {
  display: flex;
}
.cell {
  width: 36px;
  height: 36px;
  margin: 2px;
  border-radius: 6px;
  background: white;
  position: relative;
  display: grid;
  place-items: center;
  overflow: hidden;
  box-shadow: 0 1px 0 rgba(0,0,0,0.04);
}
.dark .cell {
  background: #1d1d1f;
  box-shadow: 0 1px 0 rgba(255,255,255,0.04);
}
.cell.black {
  background: #111827;
}
.cell .letter {
  font-weight: 800;
  letter-spacing: 0.5px;
  opacity: 0.9;
}
.cell.highlight::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(124,77,255,0.35), rgba(0,188,212,0.35));
  animation: pulse 450ms ease;
}
@keyframes pulse {
  from { transform: scale(0.92); opacity: 0.6; }
  to { transform: scale(1); opacity: 1; }
}

/* Cards */
.puzzle-card {
  border-radius: 18px;
  transition: transform .25s ease, box-shadow .25s ease;
  overflow: hidden;
}
.puzzle-card:hover {
  transform: translateY(-6px) scale(1.01);
  box-shadow: 0 22px 50px rgba(0,0,0,0.18);
}
.card-img::after {
  content: "";
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0.05));
}

/* Tips */
.tips .tip-card {
  background: rgba(0,0,0,0.03);
  padding: 20px;
  border-radius: 16px;
  text-align: center;
  box-shadow: inset 0 0 0 1px rgba(0,0,0,0.05);
  transition: transform .25s ease;
}
.dark .tips .tip-card {
  background: rgba(255,255,255,0.04);
  box-shadow: inset 0 0 0 1px rgba(255,255,255,0.06);
}
.tips .tip-card:hover {
  transform: translateY(-4px);
}

/* Utils */
.opacity-80 { opacity: .8; }
.ellipsis-2-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
