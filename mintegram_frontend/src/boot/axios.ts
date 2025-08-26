import { defineBoot } from '#q-app/wrappers';
import axios, { type AxiosInstance } from 'axios';
import { LocalStorage } from 'quasar';

declare module 'vue' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
  }
}

const api = axios.create({
  baseURL: 'http://localhost:8001/', // <— DRF
  // withCredentials: false,  // rămâne false pentru JWT în header
});

// atașează automat JWT (dacă există)
api.interceptors.request.use((config) => {
  const access = LocalStorage.getItem<string>('access');

  if (access) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${access}`;
  }
  return config;
});


import { useAuth } from 'src/stores/auth'
import { useRouter } from 'vue-router'

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Always get fresh store and router instances
      const auth = useAuth()
      auth.logout()
      const router = useRouter()
      // Save current path for redirect after login
      const current = router.currentRoute.value.fullPath
      if (current !== '/login') {
        router.push({ path: '/login', query: { redirect: current } }).catch(() => {})
      }
    }
    return Promise.reject(error instanceof Error ? error : new Error(error?.message || String(error)))
  }
);

export default defineBoot(({ app }) => {
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
});

export { api };
