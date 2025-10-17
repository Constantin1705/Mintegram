<template>
  <q-page class="q-pa-lg flex flex-center">
    <MascotLottie :src="mascotJson" :loop="true" :autoplay="true" :hoverPlay="true" :speed="1" />
  </q-page>
</template>

<script lang="ts" setup>
import MascotLottie from 'src/components/MascotLottie.vue'
import mascotJson from 'src/assets/mascot.json'
</script>
