<template>
  <q-page class="q-pa-md">
    <div class="text-h5 q-mb-lg">Abonamente disponibile</div>
    <div v-if="loadingSubs" class="q-mb-md flex flex-center">
      <q-spinner size="2em" color="primary" />
    </div>
    <div v-else>
      <div class="row q-col-gutter-md">
        <div
          v-for="sub in subscriptions"
          :key="sub.id"
          class="col-12 col-md-6 col-lg-4"
        >
          <q-card
            class="q-mb-md subscription-card"
            :class="{
              'bg-pink-1': sub.type === 'hearts',
              'bg-blue-1': sub.type === 'diamonds'
            }"
            flat
            bordered
          >
            <q-card-section>
              <div class="row items-center">
                <q-icon
                  :name="sub.type === 'hearts' ? 'favorite' : 'diamond'"
                  :color="sub.type === 'hearts' ? 'red' : 'blue-7'"
                  size="32px"
                  class="q-mr-md"
                />
                <div>
                  <div class="text-h6 text-weight-bold">{{ sub.name }}</div>
                  <div class="text-caption text-grey-7 q-mb-sm">{{ sub.description }}</div>
                </div>
              </div>
              <div class="text-subtitle2 q-mt-md">
                <q-badge
                  :color="sub.type === 'hearts' ? 'red' : 'blue-7'"
                  text-color="white"
                  class="q-pa-sm"
                  style="font-size:1.1em"
                >
                  {{ sub.price }} RON
                </q-badge>
              </div>
            </q-card-section>
            <q-separator />
            <q-card-actions align="right">
              <q-btn
                color="primary"
                label="Cumpără"
                @click="buySubscription(sub)"
                unelevated
                class="q-px-lg"
                :ripple="true"
              />
            </q-card-actions>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { api } from 'src/boot/axios'

type Subscription = {
  id: number;
  name: string;
  description: string;
  price: number;
  type: string;
};
const subscriptions = ref<Subscription[]>([])
const loadingSubs = ref(false)

async function fetchSubscriptions() {
  loadingSubs.value = true
  try {
    const { data } = await api.get(`/api/subscriptions/`)
    subscriptions.value = data
  } catch {
    subscriptions.value = []
  } finally {
    loadingSubs.value = false
  }
}

function buySubscription(sub: Subscription) {
  alert(`Stripe payment pentru ${sub.name}`)
}

onMounted(() => {
  void fetchSubscriptions()
})
</script>

<style scoped>
.subscription-card {
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}
.subscription-card:hover {
  transform: translateY(-6px) scale(1.03);
  box-shadow: 0 8px 24px 0 rgba(0,0,0,0.18);
  z-index: 2;
}
</style>
