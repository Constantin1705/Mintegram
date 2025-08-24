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


// Redirect to login on 401 Unauthorized (session expired)
import router from 'src/router';
import { useAuth } from 'src/stores/auth';
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Folosește store-ul pentru logout reactiv
      const auth = useAuth();
      if (auth.logout) auth.logout();
      // Redirect la login
      const routerInstance = typeof router === 'function' ? router() : router;
      const current = routerInstance.currentRoute?.value?.fullPath || '/';
      routerInstance.push({ path: '/login', query: { redirect: current } }).catch(() => {});
    }
    // Ensure rejection reason is always an Error instance
    if (error instanceof Error) {
      return Promise.reject(error);
    } else {
      return Promise.reject(new Error(typeof error === 'string' ? error : JSON.stringify(error)));
    }
  }
);

export default defineBoot(({ app }) => {
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
});

export { api };
