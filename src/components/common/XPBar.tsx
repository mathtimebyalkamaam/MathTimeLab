/**
 * XPBar: Ultra-sleek, mobile-first progress bar component.
 * Displays:
 * - Current Rank / Title (e.g. "Coordinate Cadet", "Equation Wizard")
 * - Dynamic animated gradient fill bar with shine highlight
 * - Next rank goal preview & remaining XP
 * - Interactive tap opens a quick overview modal or tooltip
 */
import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Trophy, 
  Award, 
  ChevronRight, 
  Zap, 
  TrendingUp,
  Target,
  Orbit,
  Compass
} from 'lucide-react';
import { useProgressStore, getCurrentRank, getNextRank } from '../../store/useProgressStore';
import { useHaptics } from '../../hooks/useHaptics';
import { useSound } from './SoundManager';

export const XPBar: React.FC = () => {
  const { totalXp } = useProgressStore();
  const { lightTap } = useHaptics();
  const { playClick } = useSound();

  const currentRank = useMemo(() => getCurrentRank(totalXp), [totalXp]);
  const nextRank = useMemo(() => getNextRank(totalXp), [totalXp]);

  const progressPct = useMemo(() => {
    if (!nextRank) return 100;
    const range = nextRank.minXp - currentRank.minXp;
    const currentInRange = totalXp - currentRank.minXp;
    return Math.min(100, Math.max(0, (currentInRange / range) * 100));
  }, [totalXp, currentRank, nextRank]);

  const remainingXp = nextRank ? Math.max(0, nextRank.minXp - totalXp) : 0;

  return (
    <div className="w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-3 sm:px-4 py-1.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 sm:gap-4">
        {/* Left: Rank Badge & Title */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-1.5">
            <div
              style={{ backgroundColor: `${currentRank.color}25`, borderColor: `${currentRank.color}60` }}
              className="w-5 h-5 rounded-md border flex items-center justify-center text-xs shadow-inner"
            >
              <Zap className="w-3 h-3" style={{ color: currentRank.color }} />
            </div>

            <div className="flex items-baseline gap-1.5">
              <span className="text-[11px] font-black uppercase tracking-wider text-white">
                Lvl {currentRank.level}
              </span>
              <span className="text-xs font-bold text-slate-300 truncate max-w-[140px] sm:max-w-[180px]">
                {currentRank.title}
              </span>
            </div>
          </div>

          <div className="flex sm:hidden items-center gap-1 font-mono text-[11px] font-bold text-amber-300 bg-amber-950/50 px-2 py-0.5 rounded-full border border-amber-800/40">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>{totalXp} XP</span>
          </div>
        </div>

        {/* Center / Right: Progress Bar & Next Level */}
        <div className="flex-1 w-full max-w-xl flex items-center gap-2.5">
          <div className="relative flex-1 h-2 sm:h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800/80 shadow-inner">
            {/* Background Track Markers */}
            <div className="absolute inset-0 flex justify-between px-1 pointer-events-none opacity-20">
              <span className="w-px h-full bg-slate-400" />
              <span className="w-px h-full bg-slate-400" />
              <span className="w-px h-full bg-slate-400" />
            </div>

            {/* Glowing animated fill bar */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ type: 'spring', damping: 25, stiffness: 140 }}
              className="h-full relative rounded-full"
              style={{
                background: 'linear-gradient(90deg, #38bdf8 0%, #34d399 50%, #f59e0b 100%)',
              }}
            >
              {/* Shimmer light reflection effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </motion.div>
          </div>

          {/* XP Numerical Counter on desktop */}
          <div className="hidden sm:flex items-center gap-1 font-mono text-xs font-bold text-amber-300 shrink-0">
            <span>{totalXp}</span>
            {nextRank && (
              <span className="text-[10px] text-slate-500 font-medium">
                / {nextRank.minXp} XP
              </span>
            )}
          </div>

          {/* Next rank pill */}
          {nextRank && (
            <div className="hidden md:flex items-center gap-1 text-[10px] font-semibold text-slate-400 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800 shrink-0">
              <span>Next: {nextRank.title}</span>
              <span className="text-amber-400 font-mono font-bold">(+{remainingXp})</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
