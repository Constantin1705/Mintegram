<template>
  <div class="q-pa-lg">
    <div v-if="!auth.user">Se încarcă...</div>
    <div v-else>
      <div class="text-h5 q-mb-md">Bun venit în aplicație!</div>
      <div class="text-body1">
        Ești autentificat ca: <strong>{{ auth.user.username }}</strong>
      </div>
    </div>
    <q-btn label="Logout" color="negative" class="q-mt-md" @click="logout" />
  </div>
</template>

<script setup lang="ts">
import { useAuth } from 'stores/auth';
import { useRouter } from 'vue-router';

const auth = useAuth();
const router = useRouter();

const logout = async () => {
  auth.logout();
  await router.push('/login'); // ✅ așteptăm promise-ul
};
</script>
