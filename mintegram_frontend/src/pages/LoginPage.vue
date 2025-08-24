<template>
  <div class="bg-page flex flex-center" style="min-height:100vh">
    <q-card class="login-card shadow-8">
      <q-card-section class="text-center">
        <div class="text-h5 text-primary q-mb-xs">Autentificare</div>
        <div class="text-caption text-grey-7">Introdu username sau email pentru a te loga</div>
      </q-card-section>

      <q-separator spaced />

      <q-card-section>
        <q-form @submit.prevent="onSubmit" class="q-gutter-md">
          <q-input
            v-model="user"
            label="User"
            outlined dense clearable
            autocomplete="username"
          >
            <template #prepend><q-icon name="person" /></template>
          </q-input>

          <q-input
            v-model="password"
            :type="show ? 'text' : 'password'"
            label="Parolă"
            outlined dense clearable
            autocomplete="current-password"
          >
            <template #prepend><q-icon name="lock" /></template>
            <template #append>
              <q-icon
                :name="show ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="show = !show"
              />
            </template>
          </q-input>

          <q-btn
            type="submit"
            color="primary"
            label="Login"
            class="full-width q-mt-sm"
            unelevated rounded
            :loading="loading"
          />
        </q-form>
      </q-card-section>

      <q-separator spaced />

      <q-card-actions align="center">
        <div class="text-caption">
          Nu ai cont?
          <router-link to="/signup" class="text-primary">Înregistrează-te</router-link>
        </div>
      </q-card-actions>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuth } from 'stores/auth'
import axios from 'axios'

const $q = useQuasar()
const router = useRouter()
const route = useRoute()
const auth = useAuth()

const user = ref('')
const password = ref('')
const show = ref(false)
const loading = ref(false)

type LoginErrorResponse = {
  detail?: string
  non_field_errors?: string[]
  user?: string[]
  email?: string[]
  [key: string]: unknown
}

async function onSubmit() {
  loading.value = true
  try {
    // dacă backend-ul acceptă și email, poți trimite mereu "username" cu valoarea introdusă
    await auth.login(user.value.trim(), password.value)

    $q.notify({ type: 'positive', message: 'Bun venit!' })

    const target = (route.query.redirect as string) || '/integrame'
    await router.replace(target)
  } catch (err: unknown) {
    // arată detaliul exact trimis de DRF (de ex: "No active account found..." sau erori de câmp)
    let msg = 'Eroare la login'
    if (axios.isAxiosError(err)) {
      const data: LoginErrorResponse | undefined = err.response?.data
      msg =
        data?.detail ||
        data?.non_field_errors?.[0] ||
        data?.user?.[0] ||
        data?.email?.[0] ||
        'Eroare la login'
    }
    $q.notify({ type: 'negative', message: msg })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.bg-page {
  background: linear-gradient(135deg, #e3f2fd, #e8eaf6);
}
.login-card {
  width: 92%;
  max-width: 420px;
  border-radius: 16px;
}
</style>
