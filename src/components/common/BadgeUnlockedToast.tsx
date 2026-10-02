/**
 * BadgeUnlockedToast: AAA-style game achievement notification popup.
 * Slides down smoothly from the top center with glowing particle rays,
 * haptic vibration buzz, crystalline chime, and a glowing rarity border.
 */
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Sparkles, 
  X, 
  Award, 
  Zap, 
  Rocket, 
  Target, 
  Flame, 
  TrendingUp, 
  Orbit, 
  Activity 
} from 'lucide-react';
import { useProgressStore, UnlockedBadge } from '../../store/useProgressStore';
import { useHaptics } from '../../hooks/useHaptics';
import { useSound } from './SoundManager';

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Rocket,
  Target,
  Flame,
  TrendingUp,
  Orbit,
  Activity,
  Award,
  Zap,
};

const RARITY_THEMES = {
  common: {
    border: 'border-slate-500/60',
    glow: 'from-slate-500/20',
    badge: 'bg-slate-800 text-slate-300',
    title: 'text-white',
    label: 'Standard Achievement',
  },
  rare: {
    border: 'border-sky-500/70',
    glow: 'from-sky-500/25',
    badge: 'bg-sky-950 text-sky-300 border-sky-800',
    title: 'text-sky-200',
    label: 'Rare Achievement',
  },
  epic: {
    border: 'border-purple-500/80',
    glow: 'from-purple-500/30',
    badge: 'bg-purple-950 text-purple-300 border-purple-800',
    title: 'text-purple-200',
    label: 'Epic Achievement',
  },
  legendary: {
    border: 'border-amber-400',
    glow: 'from-amber-500/35',
    badge: 'bg-amber-950 text-amber-300 border-amber-500/60 ring-1 ring-amber-400/40',
    title: 'text-amber-300',
    label: 'Legendary Discovery',
  },
};

export const BadgeUnlockedToast: React.FC = () => {
  const { recentToastBadge, clearToastBadge } = useProgressStore();
  const { successBuzz } = useHaptics();
  const { playChime } = useSound();

  useEffect(() => {
    if (!recentToastBadge) return;

    successBuzz();
    playChime();

    const timer = setTimeout(() => {
      clearToastBadge();
    }, 6000);

    return () => clearTimeout(timer);
  }, [recentToastBadge, successBuzz, playChime, clearToastBadge]);

  if (!recentToastBadge) return null;

  const theme = RARITY_THEMES[recentToastBadge.rarity] || RARITY_THEMES.common;
  const IconComponent = ICON_MAP[recentToastBadge.icon] || Trophy;

  return (
    <AnimatePresence>
      <div className="fixed top-4 inset-x-0 z-50 flex justify-center px-3 pointer-events-none">
        <motion.div
          initial={{ y: -80, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -60, opacity: 0, scale: 0.92 }}
          transition={{ type: 'spring', damping: 20, stiffness: 280 }}
          className={`pointer-events-auto w-full max-w-sm sm:max-w-md bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border ${theme.border} rounded-2xl p-3.5 sm:p-4 shadow-2xl relative overflow-hidden flex items-center gap-3.5`}
        >
          {/* Ambient Radiant Glow */}
          <div className={`absolute -top-12 -left-12 w-32 h-32 bg-gradient-to-br ${theme.glow} to-transparent rounded-full blur-2xl pointer-events-none`} />

          {/* Badge Icon Medallion */}
          <div className="relative shrink-0">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center p-0.5 border ${theme.border} bg-slate-900 shadow-lg`}>
              <div className="w-full h-full rounded-[10px] bg-slate-950/80 flex items-center justify-center text-amber-400">
                <IconComponent className="w-6 h-6 stroke-[2.2]" />
              </div>
            </div>
            <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className={`text-[9px] uppercase font-mono font-black tracking-widest px-2 py-0.5 rounded-full border ${theme.badge}`}>
                {theme.label}
              </span>
              <span className="font-mono text-[10px] font-bold text-amber-400 ml-auto">
                +{recentToastBadge.xpReward} XP
              </span>
            </div>

            <h4 className={`text-sm font-black truncate tracking-tight ${theme.title}`}>
              {recentToastBadge.title}
            </h4>

            <p className="text-[11px] text-slate-300 leading-snug truncate">
              {recentToastBadge.description}
            </p>
          </div>

          {/* Dismiss button */}
          <button
            type="button"
            onClick={clearToastBadge}
            className="p-1 rounded-lg text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-700 transition-colors shrink-0"
            aria-label="Dismiss badge"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
