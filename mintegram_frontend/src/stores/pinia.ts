// src/stores/pinia.ts
import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    accessToken: null as string | null,
    refreshToken: null as string | null,
  user: null as { id: number; username: string; email: string } | null,
  }),
  actions: {
    setTokens(access: string, refresh: string) {
      this.accessToken = access;
      this.refreshToken = refresh;
    },
    logout() {
      this.accessToken = null;
      this.refreshToken = null;
      this.user = null;

      // Curățăm localStorage
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
    },
  },
});
