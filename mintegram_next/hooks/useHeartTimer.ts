import { useEffect } from 'react';
import { useEconomyStore } from '@/stores/economyStore';

export function useHeartTimer() {
  useEffect(() => {
    // Update timer every second
    const interval = setInterval(() => {
      useEconomyStore.getState().tick();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const remainingSeconds = useEconomyStore((state) => state.getRemainingSeconds());
  const hearts = useEconomyStore((state) => state.hearts);
  const maxHearts = useEconomyStore((state) => state.maxHearts);
  const progress = useEconomyStore((state) => state.getHeartRecoveryProgress());

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    remainingSeconds,
    hearts,
    maxHearts,
    progress,
    formattedTime: formatTime(remainingSeconds),
    isRecovering: remainingSeconds > 0,
  };
}
