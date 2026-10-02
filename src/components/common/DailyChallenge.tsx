/**
 * DailyChallenge: Generates a persistent, deterministic daily simulation trial.
 * Drives user retention through streak bonuses, target parameter auto-fill,
 * and high-yield XP rewards (+60-80 XP).
 */
import React from 'react';
import { 
  Calendar, 
  Flame, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  RotateCcw,
  Target,
  Zap,
  Clock
} from 'lucide-react';
import { useProgressStore } from '../../store/useProgressStore';
import { useSimulatorStore } from '../../store/useSimulatorStore';
import { useHaptics } from '../../hooks/useHaptics';
import { useSound } from './SoundManager';

interface DailyChallengeProps {
  compact?: boolean;
}

export const DailyChallenge: React.FC<DailyChallengeProps> = ({ compact = false }) => {
  const { dailyChallenge, streakDays, completeDailyChallenge } = useProgressStore();
  const { navigateTo, updateCatapultParams, updateDroneParams, updateConicParams, updateUnitCircleParams } = useSimulatorStore();
  const { lightTap, successBuzz } = useHaptics();
  const { playClick, playChime } = useSound();

  const handleLaunchChallenge = () => {
    lightTap();
    playClick();

    // Auto-configure simulator parameters to jump right into the daily test
    if (dailyChallenge.simulatorId === 'catapult-siege' && dailyChallenge.targetAngle) {
      updateCatapultParams({ angleDeg: dailyChallenge.targetAngle, tension: 70 });
    } else if (dailyChallenge.simulatorId === 'drone-navigator' && dailyChallenge.targetCoords) {
      updateDroneParams({ droneX: 0, droneY: 0, targetX: dailyChallenge.targetCoords.x, targetY: dailyChallenge.targetCoords.y });
    } else if (dailyChallenge.simulatorId === 'conic-sections' && dailyChallenge.targetAngle) {
      updateConicParams({ planeAngleDeg: dailyChallenge.targetAngle, planeHeight: 0 });
    } else if (dailyChallenge.simulatorId === 'unit-circle' && dailyChallenge.targetAngle) {
      updateUnitCircleParams({ angleDeg: dailyChallenge.targetAngle });
    }

    navigateTo(dailyChallenge.simulatorId);
  };

  const handleClaim = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (dailyChallenge.completed) return;
    successBuzz();
    playChime();
    completeDailyChallenge();
  };

  if (compact) {
    return (
      <div 
        onClick={handleLaunchChallenge}
        className={`cursor-pointer group relative p-3 rounded-2xl border transition-all touch-manipulation ${
          dailyChallenge.completed
            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
            : 'bg-gradient-to-r from-amber-500/10 via-slate-900 to-sky-500/10 border-amber-500/40 hover:border-amber-400'
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
              dailyChallenge.completed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
            }`}>
              {dailyChallenge.completed ? <CheckCircle2 className="w-4 h-4" /> : <Flame className="w-4 h-4 fill-amber-400/40" />}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                <span>Daily Trial</span>
                <span>•</span>
                <span className="text-amber-400 font-bold">+{dailyChallenge.xpReward} XP</span>
              </div>
              <h5 className="text-xs font-bold text-white truncate group-hover:text-cyan-300 transition-colors">
                {dailyChallenge.title}
              </h5>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-1 text-cyan-400 text-xs font-bold">
            <span className="hidden sm:inline">Play</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={handleLaunchChallenge}
      className="w-full relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border border-amber-500/40 hover:border-amber-400 p-4 sm:p-5 shadow-xl cursor-pointer group transition-all"
    >
      {/* Background radiant ambient glow */}
      <div className="absolute -top-16 -right-16 w-44 h-44 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header Tag & Streak Pill */}
      <div className="flex items-center justify-between mb-3">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 font-mono text-[10px] uppercase font-bold tracking-wider">
          <Calendar className="w-3 h-3" />
          <span>Daily Mission</span>
        </div>

        <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono font-bold text-amber-300">
          <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span>{streakDays} Day Streak</span>
        </div>
      </div>

      {/* Title & Prompt */}
      <div className="space-y-1 mb-3">
        <h4 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
          <span>{dailyChallenge.title}</span>
          {dailyChallenge.completed && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
              COMPLETED
            </span>
          )}
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed">
          {dailyChallenge.taskPrompt}
        </p>
      </div>

      {/* Criteria Banner */}
      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs mb-4">
        <div className="flex items-center gap-2 text-slate-400">
          <Target className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span className="font-mono text-[11px] text-cyan-200 truncate">
            {dailyChallenge.targetCriteria}
          </span>
        </div>

        <div className="font-mono text-xs font-bold text-amber-300 shrink-0 ml-2">
          +{dailyChallenge.xpReward} XP
        </div>
      </div>

      {/* CTAs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <button
          type="button"
          onClick={handleLaunchChallenge}
          className="py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-cyan-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-md hover:brightness-110 active:scale-98 transition-all touch-manipulation"
        >
          <span>Launch {dailyChallenge.simulatorTitle}</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>

        {!dailyChallenge.completed ? (
          <button
            type="button"
            onClick={handleClaim}
            className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors touch-manipulation"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Mark Complete (+{dailyChallenge.xpReward} XP)</span>
          </button>
        ) : (
          <div className="py-3 px-4 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Bonus Claimed! Returns Tomorrow</span>
          </div>
        )}
      </div>
    </div>
  );
};
