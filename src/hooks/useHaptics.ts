/**
 * useHaptics: Lightweight mobile haptic vibration feedback with feature detection.
 * Non-blocking, fails gracefully when navigator.vibrate is unavailable.
 */
import { useCallback } from 'react';

export interface HapticsAPI {
  isSupported: boolean;
  lightTap: () => void;
  mediumImpact: () => void;
  heavyImpact: () => void;
  successBuzz: () => void;
  errorBuzz: () => void;
  selectionTick: () => void;
  snapTick: () => void;
  resonancePulse: (intensity?: number) => void;
}

export const useHaptics = (): HapticsAPI => {
  const isSupported = typeof window !== 'undefined' && 'vibrate' in navigator;

  const vibrate = useCallback((pattern: number | number[]) => {
    if (typeof window === 'undefined' || !('vibrate' in navigator)) return;
    try {
      navigator.vibrate(pattern);
    } catch {
      // Ignore user gesture or browser restriction errors silently
    }
  }, []);

  // Subtle tap on slider drag or button press (~8ms)
  const lightTap = useCallback(() => {
    vibrate(8);
  }, [vibrate]);

  // Medium impact for slider notch or toggle (~15ms)
  const mediumImpact = useCallback(() => {
    vibrate(16);
  }, [vibrate]);

  // Heavy collision or catapult launch (~30ms)
  const heavyImpact = useCallback(() => {
    vibrate(32);
  }, [vibrate]);

  // Rewarding double buzz on level solve: buzz (40ms), gap (50ms), buzz (70ms)
  const successBuzz = useCallback(() => {
    vibrate([40, 50, 70]);
  }, [vibrate]);

  // Staccato triple pulse when an invalid calculation, obstacle crash, or extreme G-force occurs
  const errorBuzz = useCallback(() => {
    vibrate([35, 40, 35, 40, 60]);
  }, [vibrate]);

  // Micro-tick for fine rotation dials
  const selectionTick = useCallback(() => {
    vibrate(5);
  }, [vibrate]);

  // Crisp invariant lock tick when two values snap into exact mathematical equality
  const snapTick = useCallback(() => {
    vibrate([12, 20, 15]);
  }, [vibrate]);

  // Variable intensity pulse for proximity to limits or extreme boundary cases
  const resonancePulse = useCallback((intensity = 1) => {
    const dur = Math.max(5, Math.min(30, Math.round(15 * intensity)));
    vibrate(dur);
  }, [vibrate]);

  return {
    isSupported,
    lightTap,
    mediumImpact,
    heavyImpact,
    successBuzz,
    errorBuzz,
    selectionTick,
    snapTick,
    resonancePulse,
  };
};

// Global singleton helper for non-React contexts or rapid events
export const triggerHaptic = {
  light: () => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try { navigator.vibrate(8); } catch {}
    }
  },
  selection: () => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try { navigator.vibrate(6); } catch {}
    }
  },
  impact: () => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try { navigator.vibrate(18); } catch {}
    }
  },
  success: () => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try { navigator.vibrate([40, 50, 70]); } catch {}
    }
  },
  error: () => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try { navigator.vibrate([35, 40, 35, 40, 60]); } catch {}
    }
  },
  launch: () => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try { navigator.vibrate([20, 30, 45]); } catch {}
    }
  },
};
