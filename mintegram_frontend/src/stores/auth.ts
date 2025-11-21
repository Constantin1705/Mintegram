// stores/auth.ts

import { defineStore } from 'pinia'
import { LocalStorage } from 'quasar'
import { api } from 'boot/axios'

export type User = {
  id: number
  username: string
  email: string
  xp: number
  level: number
  diamonds: number
  coins: number
  profile_picture: string | null
  // adaugă aici alte câmpuri relevante
}

export const useAuth = defineStore('auth', {
  state: () => ({
    access: LocalStorage.getItem<string>('access'),
    refresh: LocalStorage.getItem<string>('refresh'),
  user: null as User | null
  }),
  actions: {
    async login(user: string, password: string) {
      const { data } = await api.post('/api/auth/login/', { user, password })
      this.access = data.access
      this.refresh = data.refresh
      LocalStorage.set('access', data.access)
      LocalStorage.set('refresh', data.refresh)
      api.defaults.headers.common['Authorization'] = `Bearer ${data.access}`
      await this.fetchMe()
    },
    logout() {
      this.access = null
      this.refresh = null
      this.user = null
      LocalStorage.remove('access')
      LocalStorage.remove('refresh')
      delete api.defaults.headers.common['Authorization']
      console.log('[AuthStore] logout called, tokens removed:', {
        access: LocalStorage.getItem('access'),
        refresh: LocalStorage.getItem('refresh')
      })
    },

    async fetchMe() {
      try {
        const { data } = await api.get('/api/auth/me/')
        console.log('[AuthStore] fetchMe response:', data)
  this.user = data as User
        // Sincronizează store-ul game cu userul actualizat
        const { useGame } = await import('./game')
        useGame().syncWithUser(data)
      } catch (error) {
        console.error('[AuthStore] fetchMe error:', error)
        this.user = null
      }
    },
  }
})
