// src/stores/game.ts

import { defineStore } from 'pinia'
import type { PersistenceOptions } from 'pinia-plugin-persistedstate'
import { api } from 'src/boot/axios'

const STEP_MS = 5 * 60 * 1000

type Badge = {
  id: number
  name: string
  description: string
  icon: string | null
}

type GameState = {
  hearts: number
  maxHearts: number
  cooldownEnd: number
  stepMs: number
  xp: number
  level: number
  diamonds: number
  badges: Badge[]
  newBadge: Badge | null
  _now: number // volatil; NU-l persistăm
}

export const useGame = defineStore('game', {
  state: (): GameState => ({
    hearts: 5,
    maxHearts: 5,
    cooldownEnd: 0,
    stepMs: STEP_MS,
    xp: 0,
    level: 1,
    diamonds: 0,
    badges: [],
    newBadge: null,
    _now: Date.now(),
  }),

  getters: {
    onCooldown: (s) => s.cooldownEnd > s._now,
    remainingMs: (s) => Math.max(0, s.cooldownEnd - s._now),
    remainingSec: (s) => Math.ceil(Math.max(0, s.cooldownEnd - s._now) / 1000),
    cooldownProgress: (s) => {
      if (s.cooldownEnd <= s._now) return 0
      const rem = Math.ceil((s.cooldownEnd - s._now) / 1000)
      return rem / (s.stepMs / 1000)
    },
    xpToNext: (s) => s.level * 100,
    xpProgress: (s) => {
      const need = s.level * 100
      return need ? (s.xp % need) / need : 0
    },
  },

  actions: {
    async addXpAndSync(n: number) {
      this.addXp(n)
      try {
        const { data } = await api.post('auth/update-progress/', {
          xp: this.xp,
          level: this.level,
          diamonds: this.diamonds,
        })
        console.log('update-progress response:', data)
        if (data) {
          if (typeof data.xp === 'number') this.xp = data.xp
          if (typeof data.level === 'number') this.level = data.level
          if (typeof data.diamonds === 'number') this.diamonds = data.diamonds
          if (Array.isArray(data.badges)) {
            // Detectează badge nou
            const oldIds = new Set(this.badges.map((b: Badge) => b.id))
            const newBadges = data.badges.filter((b: Badge) => !oldIds.has(b.id))
            if (newBadges.length > 0) {
              this.newBadge = newBadges[0]
            } else {
              this.newBadge = null
            }
            this.badges = data.badges
          }
        }
      } catch {
        // Ignoră erorile de rețea
      }
    },
    syncWithUser(user: { xp: number; level: number; diamonds: number }) {
      this.xp = user.xp
      this.level = user.level
      this.diamonds = user.diamonds
    },
    async init() {
      this._now = Date.now()
      try {
        const { data } = await api.get('/api/auth/me/')
        if (data && typeof data.xp === 'number' && typeof data.level === 'number' && typeof data.diamonds === 'number') {
          this.xp = data.xp
          this.level = data.level
          this.diamonds = data.diamonds
        }
      } catch {
        // Ignoră erorile de rețea, folosește valorile locale
      }
      this.applyOfflineRecovery()
    },
    tick() {
      this._now = Date.now()
      if (!this.onCooldown) this.applyOfflineRecovery()
    },
    canUseHeart() {
      return this.hearts > 0 && !this.onCooldown
    },
    async useHeart() {
      if (!this.canUseHeart()) return false
      this.hearts = Math.max(0, this.hearts - 1)
      if (this.cooldownEnd === 0) this.cooldownEnd = Date.now() + this.stepMs
      this.addXp(25)
      // Sincronizează progresul cu backend-ul după folosirea unei inimi
      try {
        const { data } = await api.post('auth/update-progress/', {
          xp: this.xp,
          level: this.level,
          diamonds: this.diamonds,
        })
        // Debug: vezi ce răspuns primești de la backend
        console.log('update-progress response:', data)
        // Actualizează store-ul cu valorile returnate de backend
        if (data && typeof data.xp === 'number' && typeof data.level === 'number' && typeof data.diamonds === 'number') {
          this.xp = data.xp
          this.level = data.level
          this.diamonds = data.diamonds
        }
        // Sincronizează userul global după update
        const { useAuth } = await import('./auth')
        await useAuth().fetchMe()
      } catch {
        // Ignoră erorile de rețea pentru a nu bloca jocul
      }
      return true
    },
    applyOfflineRecovery() {
      if (this.hearts >= this.maxHearts) {
        this.cooldownEnd = 0
        return
      }
      if (this.cooldownEnd === 0) return
      const now = this._now
      if (now < this.cooldownEnd) return

      let gained = 1 + Math.floor((now - this.cooldownEnd) / this.stepMs)
      const missing = this.maxHearts - this.hearts
      if (gained > missing) gained = missing

      this.hearts += gained

      if (this.hearts < this.maxHearts) {
        this.cooldownEnd = this.cooldownEnd + gained * this.stepMs
        while (this.cooldownEnd <= now && this.hearts < this.maxHearts) {
          this.hearts += 1
          this.cooldownEnd += this.stepMs
        }
        if (this.hearts >= this.maxHearts) this.cooldownEnd = 0
      } else {
        this.cooldownEnd = 0
      }
    },
     addDiamonds(amount: number) {        // ⬅️ NEW helper
      this.diamonds += amount
    },

    addXp(n: number) {
      this.xp += n
      let leveledUp = 0
      while (this.xp >= this.level * 100) {
        this.xp -= this.level * 100
        this.level += 1
        leveledUp += 1
      }
      if (leveledUp > 0) {
        this.addDiamonds(5 * leveledUp)  // ⬅️ 5 diamonds per level
      }
      return leveledUp
    },
  },

  persist: {
    key: 'game',
    storage: localStorage,
    paths: ['hearts', 'maxHearts', 'cooldownEnd', 'stepMs', 'xp', 'level','diamonds'],
    // important: după ce se rehidratează din storage, rulează init()
    afterRestore: (ctx: { store: ReturnType<typeof useGame> }) => {
    ctx.store._now = Date.now()          // do NOT persist _now
    ctx.store.applyOfflineRecovery()     // recompute from cooldownEnd
  }

  } as PersistenceOptions,
})
