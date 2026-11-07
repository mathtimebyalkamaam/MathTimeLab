/**
 * EurekaToast.tsx: Priority 9 Micro-Celebration Eureka Discovery Toast.
 * Slides down smoothly on mathematical discoveries, displaying the achievement,
 * XP bonus, and radiant neon gold aura.
 */
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Trophy, Zap, X } from 'lucide-react';
import { useSimulatorStore } from '../../store/useSimulatorStore';
import { useHaptics } from '../../hooks/useHaptics';
import { useSound } from './SoundManager';

export const EurekaToast: React.FC = () => {
  const { activeEureka, clearEureka } = useSimulatorStore();
  const { successBuzz } = useHaptics();
  const { playHarmonicSnap, playChime } = useSound();

  useEffect(() => {
    if (!activeEureka) return;

    successBuzz();
    playHarmonicSnap();

    const timer = setTimeout(() => {
      clearEureka();
    }, 2800);

    return () => clearTimeout(timer);
  }, [activeEureka, successBuzz, playHarmonicSnap, clearEureka]);

  if (!activeEureka) return null;

  return (
    <AnimatePresence>
      <div className="fixed top-5 inset-x-0 z-50 flex justify-center px-4 pointer-events-none select-none">
        <motion.div
          initial={{ y: -60, opacity: 0, scale: 0.88 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -45, opacity: 0, scale: 0.92 }}
          transition={{ type: 'spring', damping: 18, stiffness: 320 }}
          className="pointer-events-auto flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-slate-900/95 via-amber-950/80 to-slate-900/95 border-2 border-amber-400/80 shadow-[0_0_30px_rgba(245,158,11,0.35)] backdrop-blur-md"
        >
          {/* Pulsing Sparkle Icon Badge */}
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400 flex items-center justify-center shrink-0 shadow-inner">
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
          </div>

          {/* Text Content */}
          <div className="flex flex-col min-w-0 pr-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono font-black tracking-widest text-amber-400 uppercase">
                Eureka Discovery!
              </span>
              <span className="px-1.5 py-0.2 rounded-md bg-amber-400/20 border border-amber-400/40 text-[9px] font-mono font-bold text-amber-300">
                +{activeEureka.xp} XP
              </span>
            </div>
            <span className="text-xs font-bold text-white tracking-wide truncate max-w-[220px] sm:max-w-xs">
              {activeEureka.title}
            </span>
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={clearEureka}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer shrink-0 ml-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

