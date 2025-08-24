<template>
  <div class="fullscreen bg-gradient flex flex-center">
    <q-card class="q-pa-lg shadow-10 signup-card">
      <q-card-section>
        <div class="text-h5 text-primary text-center q-mb-md">
          Create Account
        </div>
        <div class="text-subtitle2 text-grey text-center q-mb-lg">
          Join us and start your journey 🚀
        </div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="onSubmit" class="q-gutter-md">
          <q-input
            v-model="form.user"
            label="Username"
            outlined
            dense
            rounded
            :rules="[val => !!val || 'Username is required']"
          >
            <template v-slot:prepend>
              <q-icon name="person" />
            </template>
          </q-input>

          <q-input
            v-model="form.email"
            label="Email"
            type="email"
            outlined
            dense
            rounded
            :rules="[val => !!val || 'Email is required']"
          >
            <template v-slot:prepend>
              <q-icon name="email" />
            </template>
          </q-input>

          <q-input
            v-model="form.password"
            label="Password"
            type="password"
            outlined
            dense
            rounded
            :rules="[val => val?.length >= 6 || 'Min 6 characters']"
          >
            <template v-slot:prepend>
              <q-icon name="lock" />
            </template>
          </q-input>

          <q-btn
            type="submit"
            label="Sign Up"
            color="primary"
            class="full-width q-mt-md"
            size="lg"
            :loading="loading"
            unelevated
            rounded
          />
        </q-form>
      </q-card-section>

      <q-card-actions align="center" class="q-mt-sm">
        <div class="text-caption">
          Already have an account?
          <q-btn flat size="sm" to="/login" color="primary" label="Log In" />
        </div>
      </q-card-actions>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { api } from "boot/axios"
import { useQuasar } from "quasar"
import axios from "axios"
import { useRouter } from 'vue-router'

const $q = useQuasar()
const router = useRouter()
const form = ref({
  user: "",
  email: "",
  password: ""
})

const loading = ref(false)

async function onSubmit() {
  loading.value = true
  try {
    await api.post("/auth/register/", form.value)
    $q.notify({ type: "positive", message: "Account created successfully!" })
    await router.replace("/integrame")
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const detail =
        (err.response?.data as Record<string, string[]> | undefined)?.username?.[0] ||
        err.response?.data?.detail ||
        "Signup failed!"
      $q.notify({ type: "negative", message: detail })
    } else {
      $q.notify({ type: "negative", message: "Unexpected error occurred" })
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.bg-gradient {
  background: linear-gradient(135deg, #42a5f5, #478ed1);
}

.signup-card {
  width: 100%;
  max-width: 420px;
  border-radius: 16px;
}
</style>
