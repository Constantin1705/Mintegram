<template>
  <q-page class="q-pa-md">
    <div class="text-h4 text-center q-mb-lg">Clasament Global</div>
    <q-table
      :rows="scores"
      :columns="columns"
      row-key="id"
      flat
      bordered
      class="bg-white"
    />
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { api } from 'src/boot/axios'

const scores = ref([])
const columns = [
  { name: 'user', label: 'Utilizator', field: 'user', align: 'left' as const },
  { name: 'points', label: 'Puncte', field: 'points', align: 'right' as const, sortable: true },
  { name: 'date', label: 'Data', field: 'date', align: 'right' as const }
]

async function fetchLeaderboard() {
  const { data } = await api.get('/api/leaderboard/')
  scores.value = data
}

onMounted(fetchLeaderboard)
</script>
