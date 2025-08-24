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
          :class="{ block: c.is_block, active: isHighlighted(c) }"
          :style="{ gridRow: c.row, gridColumn: c.col }"
        >
          <small v-if="c.number" class="num">{{ c.number }}</small>
          <div v-if="startClues(c).length" class="arrows">
            <span v-for="cl in startClues(c)"
                  :key="cl.number + cl.direction"
                  class="arrow">
              {{ arrowSymbol(cl.direction) }}
            </span>
          </div>
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
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { api } from 'boot/axios'
import type { Puzzle, Cell, Clue } from 'src/types/crossword'
import { watch } from 'vue'

const route = useRoute()
const id = route.params.id as string

const puzzle = ref<Puzzle | null>(null)
const letters = ref<Record<string, string>>({})
const selectedClue = ref<Clue | null>(null)
const currentDirection = ref<'across' | 'down'>('across')
watch(letters, (val) => {
  console.log("Letters changed:", val)
}, { deep: true })
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
  if (selectedClue.value) {
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
  const { data } = await api.get<Puzzle>(`/puzzles/${id}/`)
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
.cell input {
  width: 100%; height: 100%; border: none; outline: none;
  text-transform: uppercase; text-align: center; font-weight: 700; font-size: 18px;
  background: transparent;
  color: black !important;
  background: white !important;
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
</style>
