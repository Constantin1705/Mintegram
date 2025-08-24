// src/stores/game.ts
import { defineStore } from 'pinia'
import type { PersistenceOptions } from 'pinia-plugin-persistedstate'

const STEP_MS = 5 * 60 * 1000

type GameState = {
  hearts: number
  maxHearts: number
  cooldownEnd: number
  stepMs: number
  xp: number
  level: number
  diamonds: number
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
    init() {
      this._now = Date.now()
      this.applyOfflineRecovery()
    },
    tick() {
      this._now = Date.now()
      if (!this.onCooldown) this.applyOfflineRecovery()
    },
    canUseHeart() {
      return this.hearts > 0 && !this.onCooldown
    },
    useHeart() {
      if (!this.canUseHeart()) return false
      this.hearts = Math.max(0, this.hearts - 1)
      if (this.cooldownEnd === 0) this.cooldownEnd = Date.now() + this.stepMs
      this.addXp(25)
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
