// stores/auth.ts
import { defineStore } from 'pinia'
import { LocalStorage } from 'quasar'
import { api } from 'boot/axios'

export const useAuth = defineStore('auth', {
  state: () => ({
    access: LocalStorage.getItem<string>('access'),
    refresh: LocalStorage.getItem<string>('refresh'),
    user: null as { id:number; username:string; email:string } | null,
  }),
  actions: {
    async login(user: string, password: string) {
      const { data } = await api.post('/auth/login/', { user, password })
      this.access = data.access
      this.refresh = data.refresh
      LocalStorage.set('access', data.access)
      LocalStorage.set('refresh', data.refresh)
      api.defaults.headers.common['Authorization'] = `Bearer ${data.access}`
      // opțional: this.user = await this.fetchMe()
    },
    logout() {
      this.access = null
      this.refresh = null
      this.user = null
      LocalStorage.remove('access')
      LocalStorage.remove('refresh')
      delete api.defaults.headers.common['Authorization']
    },
    // async fetchMe() { ... }
  }
})
