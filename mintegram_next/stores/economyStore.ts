import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';

const HEART_RECOVERY_TIME = 5 * 60 * 1000; // 5 minutes per heart

interface EconomyState {
  hearts: number; // lives
  diamonds: number; // premium currency
  isSubscriber: boolean;
  cooldownEnd: number; // timestamp when next heart recovers
  maxHearts: number;
  now: number; // current time for real-time updates

  // Actions
  consumeHeart: () => boolean;
  addHearts: (n: number) => void;
  addDiamonds: (n: number) => void;
  purchaseHeartsWithDiamonds: (hearts: number, costPerHeart: number) => boolean;
  setSubscriber: (v: boolean) => void;
  syncWithUser: (user: User) => void;
  tick: () => void; // Update current time
  getRemainingSeconds: () => number;
  getHeartRecoveryProgress: () => number;
}

export const useEconomyStore = create<EconomyState>()(
  persist(
    (set, get) => ({
      hearts: 5,
      diamonds: 0,
      isSubscriber: false,
      cooldownEnd: 0,
      maxHearts: 5,
      now: Date.now(),

      consumeHeart: () => {
        const { hearts, isSubscriber } = get();
        if (isSubscriber) return true; // subscribers don't consume hearts
        if (hearts <= 0) return false;
        set({ hearts: hearts - 1, cooldownEnd: Date.now() + HEART_RECOVERY_TIME });
        return true;
      },

      addHearts: (n: number) => {
        set((state) => ({ hearts: Math.min(state.maxHearts, state.hearts + n) }));
      },

      addDiamonds: (n: number) => {
        set((state) => ({ diamonds: Math.max(0, state.diamonds + n) }));
      },

      purchaseHeartsWithDiamonds: (hearts: number, costPerHeart: number) => {
        const totalCost = hearts * costPerHeart;
        const { diamonds } = get();
        if (diamonds < totalCost) return false;
        set((state) => ({
          diamonds: state.diamonds - totalCost,
          hearts: Math.min(state.maxHearts, state.hearts + hearts),
        }));
        return true;
      },

      setSubscriber: (v: boolean) => set({ isSubscriber: v }),

      syncWithUser: (user: User) => {
        set({
          diamonds: user.diamonds || 0,
          hearts: 5, // default hearts value
        });
      },

      tick: () => {
        const { hearts, cooldownEnd, maxHearts } = get();
        const now = Date.now();
        set({ now });

        // If on cooldown and cooldown ended, recover a heart
        if (cooldownEnd > 0 && now >= cooldownEnd && hearts < maxHearts) {
          set({ hearts: hearts + 1, cooldownEnd: 0 });
        }
      },

      getRemainingSeconds: () => {
        const { cooldownEnd, now, hearts, maxHearts } = get();
        if (hearts >= maxHearts || cooldownEnd === 0) return 0;
        return Math.ceil(Math.max(0, cooldownEnd - now) / 1000);
      },

      getHeartRecoveryProgress: () => {
        const { cooldownEnd, now } = get();
        if (cooldownEnd === 0) return 0;
        const elapsed = now - (cooldownEnd - HEART_RECOVERY_TIME);
        return Math.min(1, elapsed / HEART_RECOVERY_TIME);
      },
    }),
    {
      name: 'economy-storage',
      partialize: (state) => ({
        hearts: state.hearts,
        diamonds: state.diamonds,
        cooldownEnd: state.cooldownEnd,
        isSubscriber: state.isSubscriber,
        maxHearts: state.maxHearts,
      }),
    }
  )
);
