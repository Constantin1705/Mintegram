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
  baseURL: 'http://localhost:8001/api', // <— DRF
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

export default defineBoot(({ app }) => {
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
});

export { api };
