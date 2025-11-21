<template>
  <q-page padding>
    <div class="row q-col-gutter-lg">
      <div class="col-12 col-md-7">
        <div v-if="puzzle" class="grid"
             :style="{'--rows': puzzle.rows, '--cols': puzzle.cols}">
          <div
          v-for="c in puzzle.cells"
          :key="`cell-${c.row}-${c.col}`"
          class="cell"
          :class="{
            block: c.is_block,
            active: isHighlighted(c),
            selected: isHighlighted(c),
            incorrect: !c.is_block && letters[keyOf(c)] && !isLetterCorrect(c)
          }"
          :style="{ gridRow: c.row, gridColumn: c.col }"
        >
          <span v-if="c.number && startClues(c).length" class="num-arrow" @click.stop="onNumberArrowClick(c)">
            <span class="num">{{ c.number }}</span>
            <span class="arrow">{{ arrowSymbol(clueDirectionForCellNumber(c) || '') }}</span>
          </span>

          <small v-else-if="c.number" class="num">{{ c.number }}</small>
          <input v-if="!c.is_block"
                :data-key="keyOf(c)"
                maxlength="1"
                v-model="letters[keyOf(c)]"
                @focus="onCellFocus(c)"
                @input="onCellInput(c, $event)"
                @keydown="onKeydown"
          />
        </div>
        </div>
      </div>

      <div class="col-12 col-md-5">
        <div v-if="selectedClue" class="q-mb-md text-primary">
          <strong>{{ selectedClue.number }}.</strong> {{ selectedClue.text }}
        </div>

        <!-- Help Sections -->
        <div class="q-mb-lg">
          <q-card flat bordered class="help-card q-mb-md">
            <q-card-section class="bg-blue-1">
              <div class="text-subtitle2 text-weight-bold text-blue-9">
                <q-icon name="help_outline" class="q-mr-sm" />
                Ajutor Navigație
              </div>
            </q-card-section>
            <q-card-section>
              <ul class="help-list">
                <li><strong>Click</strong> pe o celulă pentru a o selecta</li>
                <li><strong>Spațiu</strong> pentru a schimba direcția (orizontal/vertical)</li>
                <li><strong>Săgeți</strong> pentru a naviga între celule</li>
                <li><strong>Click număr</strong> pentru a selecta indiciul</li>
              </ul>
            </q-card-section>
          </q-card>

          <q-card flat bordered class="help-card">
            <q-card-section class="bg-amber-1">
              <div class="text-subtitle2 text-weight-bold text-amber-9">
                <q-icon name="info" class="q-mr-sm" />
                Progres
              </div>
            </q-card-section>
            <q-card-section>
              <div class="text-body2">
                Literele <span class="text-red-6 text-weight-bold">roșii</span> sunt incorecte.
              </div>
              <div class="text-body2 q-mt-sm">
                Completează toate celulele corect pentru a finaliza!
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="text-subtitle1 q-mb-sm">Orizontal</div>
        <q-list dense bordered class="q-mb-lg">
          <q-item v-for="cl in cluesAcross" :key="'a'+cl.number" clickable
                  @click="selectClue(cl, 'across')">
            <q-item-section>
              <q-item-label><strong>{{ cl.number }}.</strong> {{ cl.text }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>

        <div class="text-subtitle1 q-mb-sm">Vertical</div>
        <q-list dense bordered>
          <q-item v-for="cl in cluesDown" :key="'d'+cl.number" clickable
                  @click="selectClue(cl, 'down')">
            <q-item-section>
              <q-item-label><strong>{{ cl.number }}.</strong> {{ cl.text }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>

    <!-- Dialog pentru finalizare -->
    <q-dialog v-model="showCompletionDialog" persistent>
      <q-card class="completion-card">
        <q-card-section class="text-center">
          <div class="text-h3 text-positive q-mb-md">🎉 Finished! 🎉</div>
          <div class="text-h6 q-mb-lg">Felicitări! Ai completat integrama!</div>
          <q-btn label="OK" color="primary" @click="closeCompletionDialog" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { api } from 'boot/axios'
import type { Puzzle, Cell, Clue } from 'src/types/crossword'
import confetti from 'canvas-confetti'

const route = useRoute()
const id = route.params.id as string

const puzzle = ref<Puzzle | null>(null)
const letters = ref<Record<string, string>>({})
const selectedClue = ref<Clue | null>(null)
const currentDirection = ref<'across' | 'down'>('across')
const showCompletionDialog = ref(false)
let confettiInterval: number | null = null

watch(letters, (val) => {
  console.log("Letters changed:", val)
  checkCompletion()
}, { deep: true })

// Verifică dacă integrama este completată corect
function checkCompletion() {
  if (!puzzle.value) return

  let isComplete = true
  for (const cell of puzzle.value.cells) {
    if (!cell.is_block) {
      const userLetter = letters.value[keyOf(cell)]?.toUpperCase()
      const correctLetter = cell.solution?.toUpperCase()

      // Verifică dacă litera este completată și corectă
      if (!userLetter || userLetter !== correctLetter) {
        isComplete = false
        break
      }
    }
  }

  if (isComplete && !showCompletionDialog.value) {
    showCompletionDialog.value = true
    void nextTick(() => {
      void playConfetti()
    })
  }
}

// Verifică dacă o literă este corectă
function isLetterCorrect(cell: Cell): boolean {
  const userLetter = letters.value[keyOf(cell)]?.toUpperCase()
  const correctLetter = cell.solution?.toUpperCase()
  return userLetter === correctLetter
}

// Pornește animația confetti
function playConfetti() {
  const duration = 15 * 1000
  const animationEnd = Date.now() + duration
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 }

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min
  }

  confettiInterval = window.setInterval(() => {
    const timeLeft = animationEnd - Date.now()

    if (timeLeft <= 0) {
      if (confettiInterval) {
        clearInterval(confettiInterval)
        confettiInterval = null
      }
      return
    }

    const particleCount = 50 * (timeLeft / duration)

    // since particles fall down, start a bit higher than random
    void confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      })
    )
    void confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      })
    )
  }, 250)
}

// Închide dialogul și oprește animația
function closeCompletionDialog() {
  if (confettiInterval) {
    clearInterval(confettiInterval)
    confettiInterval = null
  }
  showCompletionDialog.value = false
}

// Cleanup la unmount
onUnmounted(() => {
  if (confettiInterval) {
    clearInterval(confettiInterval)
  }
})

const keyOf = (c: Cell) => `${c.row}-${c.col}`

const cluesAcross = computed<Clue[]>(() =>
  puzzle.value?.clues.filter((c) => c.direction === 'across') ?? []
)
const cluesDown = computed<Clue[]>(() =>
  puzzle.value?.clues.filter((c) => c.direction === 'down') ?? []
)

function startClues(c: Cell): Clue[] {
  if (!puzzle.value) return []
  return puzzle.value.clues.filter(cl => cl.start_row === c.row && cl.start_col === c.col)
}

function arrowSymbol(direction: string): string {
  if (direction === 'across') return '→'
  if (direction === 'down') return '↓'
  return ''
}

function cellAt(row: number, col: number): Cell | undefined {
  return puzzle.value?.cells.find(c => c.row === row && c.col === col)
}

function startOfWord(c: Cell, dir: 'across'|'down') {
  let r = c.row, cl = c.col
  if (dir === 'across') {
    while (cl > 1) {
      const left = cellAt(r, cl - 1)
      if (!left || left.is_block) break
      cl--
    }
  } else {
    while (r > 1) {
      const up = cellAt(r - 1, cl)
      if (!up || up.is_block) break
      r--
    }
  }
  return { row: r, col: cl }
}
// Returnează direcția clue-ului care începe la această celulă și are același number
function clueDirectionForCellNumber(c: Cell): string | undefined {
  if (!puzzle.value || !c.number) return undefined
  const clue = puzzle.value.clues.find(cl => cl.start_row === c.row && cl.start_col === c.col && cl.number === c.number)
  return clue?.direction
}

// Selectează clue-ul asociat cu celula cu număr și săgeată
function onNumberArrowClick(c: Cell) {
  if (!puzzle.value || !c.number) return
  const clue = puzzle.value.clues.find(cl => cl.start_row === c.row && cl.start_col === c.col && cl.number === c.number)
  if (clue) {
    selectedClue.value = clue
    currentDirection.value = clue.direction
    // Focus pe prima celulă a indiciului
    const first = cellsForClue(clue)[0]
    if (first) {
      const el = document.querySelector<HTMLInputElement>(`[data-key='${first.row}-${first.col}']`)
      el?.focus()
    }
  }
}

function clueForCellAndDir(c: Cell, dir: 'across'|'down'): Clue | null {
  if (!puzzle.value) return null
  const start = startOfWord(c, dir)
  return puzzle.value.clues.find(
    cl => cl.direction === dir && cl.start_row === start.row && cl.start_col === start.col
  ) || null
}

function onCellFocus(c: Cell) {
  const first = clueForCellAndDir(c, currentDirection.value)
  selectedClue.value = first || clueForCellAndDir(c, currentDirection.value === 'across' ? 'down' : 'across')
}

function onCellInput(c: Cell, e: Event) {
  const input = e.target as HTMLInputElement
  // dacă inputul e gol, nu rescrie valoarea venită din backend
  if (!input.value) {
    input.value = letters.value[keyOf(c)] || ""
    return
  }
  input.value = input.value.toUpperCase()
  letters.value[keyOf(c)] = input.value
  // Mută doar dacă celula face parte din selectedClue
  if (selectedClue.value && cellsForClue(selectedClue.value).some(x => x.row === c.row && x.col === c.col)) {
    moveToNextCell(c, selectedClue.value)
  }
}



function cellsForClue(clue: Clue): Cell[] {
  if (!puzzle.value) return []
  const { start_row, start_col } = clue
  const cells: Cell[] = []
  let row = start_row
  let col = start_col

  while (true) {
    const cell = cellAt(row, col)
    if (!cell || cell.is_block) break
    cells.push(cell)
    if (clue.direction === 'across') col++
    else row++
  }
  return cells
}

function moveToNextCell(c: Cell, clue: Clue) {
  const cells = cellsForClue(clue)
  const idx = cells.findIndex(x => x.row === c.row && x.col === c.col)
  if (idx >= 0 && idx < cells.length - 1) {
    const next = cells[idx + 1]
    if (!next) return               // ✅ guard pentru TS
    const el = document.querySelector<HTMLInputElement>(
      `[data-key="${keyOf(next)}"]`
    )
    el?.focus()
  }
}

function isHighlighted(c: Cell): boolean {
  if (!selectedClue.value) return false
  return cellsForClue(selectedClue.value).some(x => x.row === c.row && x.col === c.col)
}

function parseKeyToRC(key: string): { r: number, c: number } | null {
  const parts = key.split('-')
  if (parts.length !== 2) return null
  const r = Number(parts[0])
  const c = Number(parts[1])
  if (!Number.isFinite(r) || !Number.isFinite(c)) return null
  return { r, c }
}

function onKeydown(e: KeyboardEvent) {
  if (e.code === 'Space') {
    e.preventDefault()
    currentDirection.value = currentDirection.value === 'across' ? 'down' : 'across'
    const el = document.activeElement as HTMLInputElement | null
    if (!el) return
    const key = el.getAttribute('data-key')
    if (!key) return
    const rc = parseKeyToRC(key)     // ✅ r/c garantate ca number
    if (!rc) return
    const cell = cellAt(rc.r, rc.c)
    if (cell) selectedClue.value = clueForCellAndDir(cell, currentDirection.value)
  }
}


function selectClue(cl: Clue, dir: 'across' | 'down') {
  selectedClue.value = cl
  currentDirection.value = dir
  const first = cellsForClue(cl)[0]
  if (first) {
    const el = document.querySelector<HTMLInputElement>(`[data-key='${first.row}-${first.col}']`)
    el?.focus()
  }
}

onMounted(async () => {
  const { data } = await api.get<Puzzle>(`/api/puzzles/${id}/`)
  puzzle.value = data
  for (const c of data.cells) {
    if (!c.is_block) {
      letters.value[keyOf(c)] = (c.solution || '').toUpperCase()
    }
  }
  console.log("Letters după preload:", letters.value)
})
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-rows: repeat(var(--rows), 36px);
  grid-template-columns: repeat(var(--cols), 36px);
  gap: 2px;
  background: #333;
  padding: 2px;
  border-radius: 8px;
}
.cell {
  position: relative;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
}
.cell.block { background: #111; }
.cell.active { outline: 2px solid #027be3; }
.cell.selected {
  background: #ffe066 !important;
  box-shadow: 0 0 0 2px #ffd700;
}
.cell input {
  width: 100%; height: 100%; border: none; outline: none;
  text-transform: uppercase; text-align: center; font-weight: 700; font-size: 18px;
  background: transparent;
  color: black !important;
  background: white !important;
}
.cell.incorrect input {
  color: #c10015 !important;
  font-weight: 900;
}
.num {
  position: absolute; top: 2px; left: 4px; font-size: 10px; color: #666;
}
.arrows {
  position: absolute;
  bottom: 2px;
  right: 2px;
  display: flex;
  gap: 2px;
  font-size: 14px;
  color: #027be3;
}

.completion-card {
  min-width: 400px;
}

.help-card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.help-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.help-list {
  margin: 0;
  padding-left: 20px;
  list-style-type: disc;
}

.help-list li {
  margin-bottom: 8px;
  font-size: 0.9em;
  line-height: 1.4;
}
</style>
