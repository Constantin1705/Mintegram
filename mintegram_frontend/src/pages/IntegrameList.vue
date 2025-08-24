<template>
  <q-page padding>
    <div class="text-h5 q-mb-md">Integrame</div>

    <q-banner v-if="error" class="bg-red-2 text-red-10 q-mb-md" dense>
      {{ error }}
    </q-banner>

    <template v-if="loading">
      <q-skeleton v-for="i in 4" :key="i" type="rect" height="56px" class="q-mb-sm" />
    </template>

    <q-list v-else bordered separator>
      <q-item v-for="p in puzzles" :key="p.id" clickable :to="`/integrame/${p.id}`">
        <q-item-section>
          <q-item-label>{{ p.title }}</q-item-label>
          <q-item-label caption>
            {{ langLabel(p.language) }} · Lvl {{ p.level ?? '—' }} · {{ diffLabel(p.difficulty) }} · {{ p.rows }}x{{ p.cols }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>

    <q-banner v-if="!loading && !error && puzzles.length === 0" class="bg-grey-2 text-grey-8 q-mt-md" dense>
      No puzzles yet.
    </q-banner>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { isAxiosError } from 'axios'
import { api } from 'boot/axios'

// Backend may return language/difficulty as object, string code, number id, or null.
type WithCodeName = { id?: number; code?: string | null; name?: string | null }
type LangField = WithCodeName | string | number | null
type DiffField = WithCodeName | string | number | null

interface PuzzleListItem {
  id: number
  title: string
  language?: LangField
  level?: number | null
  difficulty?: DiffField   // already optional
  rows: number
  cols: number
  created_at?: string
}

const puzzles = ref<PuzzleListItem[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

// Type guards (no "any")
function isObj (x: unknown): x is Record<string, unknown> {
  return typeof x === 'object' && x !== null
}

function hasCodeName (x: unknown): x is WithCodeName {
  return isObj(x) && ('code' in x || 'name' in x || 'id' in x)
}

function langLabel (lang?: LangField): string {
  if (lang == null) return '—'
  if (typeof lang === 'string') return lang.toUpperCase()
  if (typeof lang === 'number') return String(lang)
  if (hasCodeName(lang)) {
    if (lang.code) return String(lang.code).toUpperCase()
    if (lang.name) return String(lang.name).toUpperCase()
    if (typeof lang.id === 'number') return String(lang.id)
  }
  return '—'
}

function diffLabel (diff?: DiffField): string {
  if (diff == null) return '—'
  if (typeof diff === 'string') return diff
  if (typeof diff === 'number') return String(diff)
  if (hasCodeName(diff)) {
    return diff.name ?? diff.code ?? String(diff.id ?? '—')
  }
  return '—'
}


// Safe error extraction (no "any")
function extractDetail (e: unknown): string {
  if (isAxiosError(e)) {
    const data = e.response?.data
    if (isObj(data) && typeof (data as { detail?: unknown }).detail === 'string') {
      return (data as { detail: string }).detail
    }
    return e.message
  }
  return (e instanceof Error) ? e.message : 'Failed to load puzzles'
}

onMounted(async () => {
  try {
    const { data } = await api.get<PuzzleListItem[]>('/puzzles/')
    puzzles.value = data
  } catch (e) {
    error.value = extractDetail(e)
  } finally {
    loading.value = false
  }
})
</script>
