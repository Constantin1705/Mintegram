<template>
  <q-page class="q-pa-md shop-business-bg">
    <div class="text-h4 text-weight-bold text-center q-mb-lg shop-title">
      <q-icon name="shopping_cart" color="primary" size="md" class="q-mr-sm" />
      Magazin Premium
    </div>
    <div class="row q-col-gutter-lg justify-center">
      <q-card v-for="product in products" :key="product.id" class="shop-card col-12 col-md-6 col-lg-4">
        <q-card-section class="row items-center">
          <q-avatar v-if="product.image" size="72px" class="q-mr-lg shop-avatar">
            <img :src="product.image" alt="product" />
          </q-avatar>
          <div class="col">
            <div class="row items-center">
              <div class="text-h6 text-weight-bold">{{ product.name }}</div>
              <q-badge class="q-ml-sm" color="indigo-4" outline>{{ product.type }}</q-badge>
            </div>
            <div class="text-body2 text-grey-7 q-mt-xs">{{ product.description }}</div>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section class="row items-center justify-between">
          <div class="text-h5 text-weight-bold text-amber-8 shop-price">
            {{ product.price }} <span class="shop-coin">🪙</span>
          </div>
          <q-btn color="primary" glossy size="lg" icon="shopping_bag" label="Cumpără" @click="buyProduct(product.id)" class="shop-buy-btn" />
        </q-card-section>
      </q-card>
    </div>
    <q-banner v-if="message" class="q-mt-lg shop-banner" rounded dense>
      <q-icon name="info" color="primary" class="q-mr-sm" />
      <span class="text-weight-bold">{{ message }}</span>
    </q-banner>
  </q-page>
</template>

<script setup lang="ts">

import { ref, onMounted } from 'vue';
import { api } from 'src/boot/axios';

type Product = {
  id: number;
  type: string;
  name: string;
  price: number;
  description: string;
  image?: string;
};


const products = ref<Product[]>([]);
const message = ref('');

async function fetchProducts() {
  try {
  const res = await api.get('/api/shop/');
    products.value = res.data;
  } catch {
    message.value = 'Eroare la încărcarea shop-ului.';
  }
}

async function buyProduct(productId: number) {
  try {
  const res = await api.post('/api/shop/buy/', { product_id: productId });
    message.value = res.data.detail;
    // Poți actualiza monedele utilizatorului aici
  } catch (e: unknown) {
    if (
      typeof e === 'object' &&
      e !== null &&
      'response' in e &&
      typeof (e as { response?: { data?: { detail?: string } } }).response?.data?.detail === 'string'
    ) {
      message.value = (e as { response: { data: { detail: string } } }).response.data.detail;
    } else {
      message.value = 'Eroare la cumpărare.';
    }
  }
}

onMounted(fetchProducts);
</script>

<style scoped>
.shop-business-bg {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}
.shop-title {
  letter-spacing: 1px;
  text-shadow: 0 2px 8px #c3cfe2;
}
.shop-card {
  box-shadow: 0 4px 24px rgba(44,62,80,0.08);
  border-radius: 18px;
  transition: transform 0.18s, box-shadow 0.18s;
  background: #fff;
  margin-bottom: 32px;
}
.shop-card:hover {
  transform: translateY(-4px) scale(1.03);
  box-shadow: 0 8px 32px rgba(44,62,80,0.16);
}
.shop-avatar {
  border: 2px solid #e0e7ef;
  background: #f5f7fa;
}
.shop-price {
  font-size: 1.5em;
  letter-spacing: 1px;
}
.shop-coin {
  font-size: 1.2em;
}
.shop-buy-btn {
  font-size: 1.1em;
  font-weight: 600;
  border-radius: 12px;
  box-shadow: 0 2px 8px #e0e7ef;
}
.shop-banner {
  background: #e0e7ef;
  color: #2d3a4a;
  font-size: 1.1em;
  box-shadow: 0 2px 8px #c3cfe2;
}
</style>

