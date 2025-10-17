<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6">Statistici personale</div>
            <q-table
              :rows="stats"
              :columns="columns"
              row-key="id"
              flat
              dense
              :loading="loading"
            />
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6">Analiză progres</div>
              <q-list>
                <q-item v-for="item in analysis" :key="item.label">
                  <q-item-section>{{ item.label }}</q-item-section>
                  <q-item-section side>{{ item.value }}</q-item-section>
                </q-item>
              </q-list>
              <div class="q-mt-md">
                <div class="text-subtitle2 q-mb-sm">Greșeli per integrame</div>
                <div style="width:100%;height:120px;overflow:auto">
                  <svg :width="chartWidth" height="120">
                    <g v-for="(row, i) in mistakesData" :key="row.puzzle">
                      <rect :x="i * barW + 4" :y="120 - row.h" :width="barW - 6" :height="row.h" fill="#ef5350" />
                      <text :x="i * barW + barW/2" y="115" font-size="10" text-anchor="middle">{{ row.label }}</text>
                    </g>
                  </svg>
                </div>

                <div class="text-subtitle2 q-mt-md q-mb-sm">Timp petrecut (sparkline)</div>
                <svg width="100%" height="60" viewBox="0 0 300 60" preserveAspectRatio="none">
                  <polyline :points="timeSparkPoints" fill="none" stroke="#42a5f5" stroke-width="2" />
                </svg>
              </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useQuasar } from 'quasar';
import axios from 'axios';

const $q = useQuasar();
interface StatRow {
  id: number;
  puzzle: string | number;
  time_spent: number;
  mistakes: number;
  wrong_letters: number;
  completed: boolean;
  completed_at: string;
}
const stats = ref<StatRow[]>([]);
const loading = ref(false);

const columns = [
  { name: 'puzzle', label: 'Integrame', field: 'puzzle', align: 'left' as const },
  { name: 'time_spent', label: 'Timp (sec)', field: 'time_spent', align: 'right' as const },
  { name: 'mistakes', label: 'Greșeli', field: 'mistakes', align: 'right' as const },
  { name: 'wrong_letters', label: 'Litere greșite', field: 'wrong_letters', align: 'right' as const },
  { name: 'completed', label: 'Finalizat', field: 'completed', align: 'center' as const },
  { name: 'completed_at', label: 'Data finalizării', field: 'completed_at', align: 'left' as const },
];

const analysis = computed(() => {
  if (!stats.value.length) return [];
  const total = stats.value.length;
  const completed = stats.value.filter(s => s.completed).length;
  const avgTime = Math.round(stats.value.reduce((a, s) => a + (s.time_spent || 0), 0) / total);
  const avgMistakes = Math.round(stats.value.reduce((a, s) => a + (s.mistakes || 0), 0) / total);
  const avgWrong = Math.round(stats.value.reduce((a, s) => a + (s.wrong_letters || 0), 0) / total);
  const hardest = [...stats.value].sort((a, b) => b.mistakes - a.mistakes)[0]?.puzzle || '-';
  return [
    { label: 'Integrame finalizate', value: completed },
    { label: 'Timp mediu (sec)', value: avgTime },
    { label: 'Greșeli medii', value: avgMistakes },
    { label: 'Litere greșite medii', value: avgWrong },
    { label: 'Cea mai dificilă integrame', value: hardest },
  ];
});

const mistakesData = computed(() => {
  const rows = stats.value.map(s => ({ puzzle: s.puzzle, label: String(s.puzzle).slice(0,6), val: s.mistakes || 0 }));
  const max = Math.max(1, ...rows.map(r => r.val));
  const barMax = 100;
  return rows.map(r => ({ ...r, h: Math.round((r.val / max) * barMax) }));
});

const barW = 40;
const chartWidth = computed(() => Math.max(300, mistakesData.value.length * barW));

const timeSparkPoints = computed(() => {
  if (!stats.value.length) return '';
  const w = 300;
  const h = 60;
  const times = stats.value.map(s => s.time_spent || 0);
  const max = Math.max(...times, 1);
  return times.map((t, i) => {
    const x = Math.round((i / (times.length - 1 || 1)) * w);
    const y = Math.round(h - (t / max) * h);
    return `${x},${y}`;
  }).join(' ');
});

onMounted(async () => {
  loading.value = true;
  try {
    const res = await axios.get('/api/puzzlestats/');
    stats.value = res.data;
  } catch {
    $q.notify({ type: 'negative', message: 'Eroare la încărcarea statisticilor.' });
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.q-table {
  min-height: 300px;
}
</style>
