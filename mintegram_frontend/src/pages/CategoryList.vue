<template>
  <q-page padding>
    <div class="text-h5 q-mb-md">Categorii Integrame</div>
    <q-banner v-if="error" class="bg-red-2 text-red-10 q-mb-md" dense>
      {{ error }}
    </q-banner>
    <template v-if="loading">
      <q-skeleton v-for="i in 4" :key="i" type="rect" height="56px" class="q-mb-sm" />
    </template>
    <q-list v-else bordered separator>
      <q-item v-for="cat in categories" :key="cat.id" clickable :to="`/integrame?cat=${cat.code}`">
        <q-item-section>
          <q-item-label>{{ cat.name }}</q-item-label>
          <q-item-label caption>{{ cat.code }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
    <q-banner v-if="!loading && !error && categories.length === 0" class="bg-grey-2 text-grey-8 q-mt-md" dense>
      Nicio categorie disponibilă.
    </q-banner>
  </q-page>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { api } from 'boot/axios'
interface Category {
  id: number
  code: string
  name: string
}
const categories = ref<Category[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
onMounted(async () => {
  try {
    const { data } = await api.get<Category[]>('/api/categories/')
    categories.value = data
  } catch (e) {
    error.value = (e instanceof Error) ? e.message : 'Failed to load categories'
  } finally {
    loading.value = false
  }
})
</script>
