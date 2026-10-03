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
  Clock,
  Trophy
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
        className={`cursor-pointer group relative p-3 rounded-2xl border transition-all touch-manipulation shadow-md ${
          dailyChallenge.completed
            ? 'bg-gradient-to-r from-emerald-950/60 to-slate-900 border-emerald-500/40 text-emerald-200'
            : 'bg-gradient-to-r from-amber-500/15 via-[#1a1205] to-cyan-500/15 border-amber-500/50 hover:border-amber-400'
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-inner ${
              dailyChallenge.completed ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
            }`}>
              {dailyChallenge.completed ? <CheckCircle2 className="w-5 h-5" /> : <Flame className="w-5 h-5 fill-amber-400/50" />}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                <span className="text-amber-300 font-bold">Daily Mission</span>
                <span>•</span>
                <span className="text-emerald-400 font-black">+{dailyChallenge.xpReward} XP</span>
              </div>
              <h5 className="text-xs font-bold text-white truncate group-hover:text-cyan-300 transition-colors">
                {dailyChallenge.title}
              </h5>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-1.5 text-cyan-300 text-xs font-bold bg-cyan-950/80 px-2.5 py-1 rounded-lg border border-cyan-800">
            <span>Play</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={handleLaunchChallenge}
      className="w-full relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1c1204] via-[#140e02] to-[#0c0801] border border-amber-500/40 hover:border-amber-400 p-5 sm:p-7 shadow-[0_8px_32px_rgba(245,158,11,0.15)] cursor-pointer group transition-all"
    >
      {/* Background radiant ambient glow */}
      <div className="absolute -top-16 -right-16 w-60 h-60 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Tag & Streak Pill */}
      <div className="flex items-center justify-between mb-3.5 relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-300 font-mono text-[11px] uppercase font-bold tracking-wider shadow-sm">
          <Calendar className="w-3.5 h-3.5" />
          <span>Daily Master Mission</span>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/90 border border-amber-500/40 text-xs font-mono font-bold text-amber-300 shadow-inner">
          <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span>{streakDays} Day Streak</span>
        </div>
      </div>

      {/* Title & Prompt */}
      <div className="space-y-1.5 mb-4 relative z-10">
        <h4 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
          <span>{dailyChallenge.title}</span>
          {dailyChallenge.completed && (
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/60 font-black tracking-wider">
              COMPLETED
            </span>
          )}
        </h4>
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
          {dailyChallenge.taskPrompt}
        </p>
      </div>

      {/* Criteria Banner */}
      <div className="p-3 rounded-2xl bg-slate-950/80 border border-amber-500/30 flex items-center justify-between text-xs mb-4 relative z-10 shadow-inner">
        <div className="flex items-center gap-2.5 text-slate-300 min-w-0">
          <div className="p-1 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 shrink-0">
            <Target className="w-4 h-4" />
          </div>
          <span className="font-mono text-xs text-cyan-200 truncate font-medium">
            {dailyChallenge.targetCriteria}
          </span>
        </div>

        <div className="font-mono text-xs font-black text-amber-300 shrink-0 ml-3 bg-amber-950/90 border border-amber-800/80 px-2.5 py-1 rounded-lg">
          +{dailyChallenge.xpReward} XP
        </div>
      </div>

      {/* CTAs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative z-10">
        <button
          type="button"
          onClick={handleLaunchChallenge}
          className="py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 hover:brightness-110 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 active:scale-98 transition-all touch-manipulation cursor-pointer"
        >
          <span>Launch {dailyChallenge.simulatorTitle}</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>

        {!dailyChallenge.completed ? (
          <button
            type="button"
            onClick={handleClaim}
            className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/40 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all touch-manipulation cursor-pointer shadow-md"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Mark Complete (+{dailyChallenge.xpReward} XP)</span>
          </button>
        ) : (
          <div className="py-3 px-4 rounded-xl bg-emerald-950/80 border border-emerald-600/80 text-emerald-300 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Bonus Claimed! Returns Tomorrow</span>
          </div>
        )}
      </div>
    </div>
  );
};
