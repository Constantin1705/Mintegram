import { create } from 'zustand';

interface EconomyState {
  hearts: number; // lives
  diamonds: number; // premium currency
  isSubscriber: boolean;

  // Actions
  consumeHeart: () => boolean;
  addHearts: (n: number) => void;
  addDiamonds: (n: number) => void;
  purchaseHeartsWithDiamonds: (hearts: number, costPerHeart: number) => boolean;
  setSubscriber: (v: boolean) => void;
}

export const useEconomyStore = create<EconomyState>((set, get) => ({
  hearts: 5,
  diamonds: 50,
  isSubscriber: false,

  consumeHeart: () => {
    const { hearts, isSubscriber } = get();
    if (isSubscriber) return true; // subscribers don't consume hearts
    if (hearts <= 0) return false;
    set({ hearts: hearts - 1 });
    return true;
  },

  addHearts: (n: number) => {
    set((state) => ({ hearts: Math.max(0, state.hearts + n) }));
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
      hearts: state.hearts + hearts,
    }));
    return true;
  },

  setSubscriber: (v: boolean) => set({ isSubscriber: v }),
}));
