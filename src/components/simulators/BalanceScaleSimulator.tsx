/**
 * BalanceScaleSimulator.tsx: Interactive Two-Pan Balance Scale & Linear Equation Solver (Class 8 Algebra).
 * Features:
 * - Physical brass balance scale with dynamic torque physics and beam tilt angle
 * - Mystery x-boxes and brass gram weights on left and right pans
 * - Live algebraic chalkboard mapping physical pan items to formal equation
 * - Dual solving modes: Step-by-Step Operations (Subtract from Both Sides) and Manual Weight Probe
 * - 3 Progressive Board Exam challenges
 */
import React, { useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  Scale, 
  RotateCcw, 
  CheckCircle2, 
  Minus, 
  Divide, 
  Sparkles, 
  Layers, 
  Sliders,
  HelpCircle,
  Equal,
  AlertTriangle,
  Flame,
  ShieldAlert,
  BookOpen
} from 'lucide-react';
import { useSimulatorStore } from '../../store/useSimulatorStore';
import { BottomSheet } from '../layout/BottomSheet';
import { TouchSlider } from '../common/TouchSlider';
import { CoachTheoryModule } from '../common/CoachTheoryModule';
import { ChallengeManager, ChallengeLevel } from '../common/ChallengeManager';
import { useHaptics } from '../../hooks/useHaptics';
import { useSound } from '../common/SoundManager';
import { useAnalytics } from '../../hooks/useAnalytics';
import { Eli13ExplainerCard } from '../common/Eli13ExplainerCard';

export const BalanceScaleSimulator: React.FC = () => {
  const {
    balanceScaleParams,
    updateBalanceScaleParams,
    resetParams,
    completeChallenge,
    challengeCompleted,
    isZenMode,
  } = useSimulatorStore();

  const {
    leftXCount,
    leftWeight,
    rightXCount,
    rightWeight,
    actualXValue,
    showEquationChalkboard,
    panTiltAngleDeg,
  } = balanceScaleParams;

  const { lightTap, successBuzz } = useHaptics();
  const { playClick, playChime, playError } = useSound();
  const { trackEvent } = useAnalytics();

  const [isTrapActive, setIsTrapActive] = React.useState<boolean>(false);

  // Physics calculation of scale torque and tilt angle
  const leftTotal = leftXCount * actualXValue + leftWeight;
  const rightTotal = rightXCount * actualXValue + rightWeight;
  const diff = leftTotal - rightTotal;
  const isBalanced = Math.abs(diff) < 0.001;

  // Max tilt angle is 18 degrees
  const tilt = useMemo(() => {
    if (isBalanced) return 0;
    const clampedDiff = Math.max(-25, Math.min(25, diff));
    return (clampedDiff / 25) * -16; // positive diff tilts left down (counter-clockwise)
  }, [diff, isBalanced]);

  // Operations that preserve equality on both sides
  const handleSubtractX = () => {
    if (leftXCount > 0 && rightXCount > 0) {
      lightTap();
      playClick();
      updateBalanceScaleParams({
        leftXCount: leftXCount - 1,
        rightXCount: rightXCount - 1,
      });
      trackEvent('balance_scale_subtract_x', { remainingLeftX: leftXCount - 1 });
    }
  };

  const handleSubtractWeight = (amount = 1) => {
    if (leftWeight >= amount && rightWeight >= amount) {
      lightTap();
      playClick();
      updateBalanceScaleParams({
        leftWeight: leftWeight - amount,
        rightWeight: rightWeight - amount,
      });
      trackEvent('balance_scale_subtract_weight', { amount });
    }
  };

  // Misconception Buster Trap: Subtract from LHS only!
  const handleTriggerTrap = () => {
    lightTap();
    playError();
    const amount = 4;
    updateBalanceScaleParams({
      leftWeight: Math.max(0, leftWeight - amount),
    });
    setIsTrapActive(true);
    trackEvent('balance_scale_trap_triggered');
  };

  const handleFixTrap = () => {
    successBuzz();
    playChime();
    const amount = 4;
    updateBalanceScaleParams({
      rightWeight: Math.max(0, rightWeight - amount),
    });
    setIsTrapActive(false);
    trackEvent('balance_scale_trap_fixed');
  };

  const handleDivideSides = () => {
    if (leftXCount > 1 && rightXCount === 0 && rightWeight % leftXCount === 0) {
      lightTap();
      playChime();
      updateBalanceScaleParams({
        rightWeight: rightWeight / leftXCount,
        leftXCount: 1,
      });
      trackEvent('balance_scale_divide', { factor: leftXCount });
    }
  };

  const handleReset = () => {
    lightTap();
    playClick();
    resetParams('balance-scale-equations');
  };

  // Challenges for Board Exam mastery
  const challengeLevels: ChallengeLevel[] = [
    {
      levelNumber: 1,
      title: 'Isolate x: 2x + 3 = x + 7',
      badge: 'Balance Rookie',
      description: 'Subtract x from both pans, then subtract 3g from both pans to isolate a single x box!',
      requirementFormula: '2x + 3 = x + 7 \\implies x = 4',
      targetCriteria: '1 x on left pan and 4g on right pan',
      xpReward: 30,
      tier1Hint: 'Tap "Subtract 1x Both Pans" first to eliminate x from the right pan.',
      tier2Hint: 'Then subtract 3g from both pans to isolate x completely.',
      tier3Hint: 'When left has 1x and right has 4g, x = 4 is isolated!',
      autoPreset: () => {
        updateBalanceScaleParams({
          leftXCount: 2,
          leftWeight: 3,
          rightXCount: 1,
          rightWeight: 7,
          actualXValue: 4,
        });
      },
    },
    {
      levelNumber: 2,
      title: 'Scale Division: 3x = 12',
      badge: 'Equation Stripper',
      description: 'You have 3x on the left pan and 12g on the right. Divide both sides by 3 to find the weight of 1 box!',
      requirementFormula: '3x = 12 \\implies x = 4',
      targetCriteria: 'Divide both sides by 3 to get 1x = 4g',
      xpReward: 40,
      tier1Hint: 'Tap "Divide Both Sides by 3".',
      tier2Hint: '12 divided by 3 is 4g for each x box.',
      tier3Hint: 'Verify the scale stays perfectly balanced at 4g.',
      autoPreset: () => {
        updateBalanceScaleParams({
          leftXCount: 3,
          leftWeight: 0,
          rightXCount: 0,
          rightWeight: 12,
          actualXValue: 4,
        });
      },
    },
    {
      levelNumber: 3,
      title: 'The Board 4-Step: 4x + 6 = 2x + 16',
      badge: 'Balance Grandmaster',
      description: 'Solve 4x + 6 = 2x + 16 completely to isolate x = 5g in physical equilibrium.',
      requirementFormula: '4x + 6 = 2x + 16 \\implies 2x = 10 \\implies x = 5',
      targetCriteria: 'Reduce to 1x on left and 5g on right',
      xpReward: 50,
      tier1Hint: 'Subtract 2x from both pans (tap "Subtract 1x" twice).',
      tier2Hint: 'Subtract 6g from both pans to get 2x = 10.',
      tier3Hint: 'Divide both sides by 2 to isolate 1x = 5g!',
      autoPreset: () => {
        updateBalanceScaleParams({
          leftXCount: 4,
          leftWeight: 6,
          rightXCount: 2,
          rightWeight: 16,
          actualXValue: 5,
        });
      },
    },
  ];

  // Auto verify challenges
  React.useEffect(() => {
    if (leftXCount === 1 && rightXCount === 0 && leftWeight === 0 && rightWeight === 4 && actualXValue === 4) {
      if (!challengeCompleted['balance-scale-equations-1']) {
        successBuzz();
        playChime();
        confetti({ particleCount: 35, spread: 60, origin: { y: 0.6 } });
        completeChallenge('balance-scale-equations-1', 30);
      }
    }
    if (leftXCount === 1 && rightXCount === 0 && leftWeight === 0 && rightWeight === 4 && !challengeCompleted['balance-scale-equations-2']) {
      completeChallenge('balance-scale-equations-2', 40);
    }
    if (leftXCount === 1 && rightXCount === 0 && leftWeight === 0 && rightWeight === 5 && actualXValue === 5) {
      if (!challengeCompleted['balance-scale-equations-3']) {
        successBuzz();
        playChime();
        confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
        completeChallenge('balance-scale-equations-3', 50);
      }
    }
  }, [leftXCount, rightXCount, leftWeight, rightWeight, actualXValue, challengeCompleted, completeChallenge, playChime, successBuzz]);

  // Controls UI for Bottom Sheet and Desktop Left Sidebar
  const controlsContent = (
    <div className="space-y-4 p-4 text-slate-200">
      {/* Both-Sides Action Buttons */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
          <Scale className="w-4 h-4" />
          <span>Equilibrium Actions (Both Sides)</span>
        </h4>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={leftXCount === 0 || rightXCount === 0}
            onClick={handleSubtractX}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-sky-950/60 border border-sky-800/60 text-sky-300 text-xs font-semibold hover:bg-sky-900/60 disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
          >
            <Minus className="w-3.5 h-3.5" />
            <span>-1x from Both</span>
          </button>
          <button
            type="button"
            disabled={leftWeight < 1 || rightWeight < 1}
            onClick={() => handleSubtractWeight(1)}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-amber-950/60 border border-amber-800/60 text-amber-300 text-xs font-semibold hover:bg-amber-900/60 disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
          >
            <Minus className="w-3.5 h-3.5" />
            <span>-1g from Both</span>
          </button>
          <button
            type="button"
            disabled={leftWeight < 2 || rightWeight < 2}
            onClick={() => handleSubtractWeight(2)}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-amber-950/40 border border-amber-800/40 text-amber-300 text-xs font-semibold hover:bg-amber-900/40 disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
          >
            <Minus className="w-3.5 h-3.5" />
            <span>-2g from Both</span>
          </button>
          <button
            type="button"
            disabled={!(leftXCount > 1 && rightXCount === 0 && rightWeight % leftXCount === 0)}
            onClick={handleDivideSides}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-xs font-semibold hover:bg-emerald-900/60 disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
          >
            <Divide className="w-3.5 h-3.5" />
            <span>Divide by {leftXCount}</span>
          </button>
        </div>
      </div>

      {/* Trap Alert: One-Sided Operation */}
      <div className="bg-rose-950/30 border border-rose-800/50 rounded-2xl p-3.5 space-y-2.5">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>Mythbuster: The One-Sided Trap</span>
          </h4>
          <span className="text-[10px] text-rose-400 font-mono font-bold bg-rose-950 px-2 py-0.5 rounded border border-rose-800/60">
            CBSE #1 Lost Mark
          </span>
        </div>
        <p className="text-[11px] text-slate-300 leading-relaxed">
          What happens when a student moves +4 across "=" without subtracting it from both sides?
        </p>
        <div className="flex items-center gap-2">
          {!isTrapActive ? (
            <button
              type="button"
              onClick={handleTriggerTrap}
              className="flex-1 px-3 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>Test One-Sided Trap (-4g on Left only)</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFixTrap}
              className="flex-1 px-3 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5 animate-pulse transition cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Restore Equilibrium (-4g from Right too)</span>
            </button>
          )}
        </div>
      </div>

      {/* Textbook Equation Scratchpad Presets */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 space-y-2.5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
          <BookOpen className="w-4 h-4" />
          <span>Class 8 Textbook Problem Scratchpad</span>
        </h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {[
            { label: '2x + 3 = 11 (x = 4)', lX: 2, lW: 3, rX: 0, rW: 11, xVal: 4 },
            { label: '3x + 2 = x + 10 (x = 4)', lX: 3, lW: 2, rX: 1, rW: 10, xVal: 4 },
            { label: '4x + 6 = 2x + 16 (x = 5)', lX: 4, lW: 6, rX: 2, rW: 16, xVal: 5 },
            { label: '5x + 3 = 2x + 18 (x = 5)', lX: 5, lW: 3, rX: 2, rW: 18, xVal: 5 },
          ].map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                lightTap();
                playClick();
                setIsTrapActive(false);
                updateBalanceScaleParams({
                  leftXCount: preset.lX,
                  leftWeight: preset.lW,
                  rightXCount: preset.rX,
                  rightWeight: preset.rW,
                  actualXValue: preset.xVal,
                });
              }}
              className="p-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-950 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-white font-mono text-[11px] text-left transition cursor-pointer"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Explain Like I'm 13 Wonder Card */}
      <Eli13ExplainerCard simulatorId="balance-scale-equations" />

      {/* Direct Parameter Sliders */}
      <div className="space-y-3 bg-slate-900/70 border border-slate-800 rounded-2xl p-3.5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <span>Pan Contents Setup</span>
        </h4>
        <TouchSlider
          label="Left Pan: Mystery x Boxes"
          value={leftXCount}
          min={0}
          max={5}
          step={1}
          onChange={(val) => updateBalanceScaleParams({ leftXCount: val })}
        />
        <TouchSlider
          label="Left Pan: Weights (grams)"
          value={leftWeight}
          min={0}
          max={30}
          step={1}
          onChange={(val) => updateBalanceScaleParams({ leftWeight: val })}
        />
        <TouchSlider
          label="Right Pan: Mystery x Boxes"
          value={rightXCount}
          min={0}
          max={5}
          step={1}
          onChange={(val) => updateBalanceScaleParams({ rightXCount: val })}
        />
        <TouchSlider
          label="Right Pan: Weights (grams)"
          value={rightWeight}
          min={0}
          max={30}
          step={1}
          onChange={(val) => updateBalanceScaleParams({ rightWeight: val })}
        />
        <TouchSlider
          label="True Value of x (Secret Weight)"
          value={actualXValue}
          min={1}
          max={15}
          step={1}
          onChange={(val) => updateBalanceScaleParams({ actualXValue: val })}
        />
      </div>

      <button
        type="button"
        onClick={handleReset}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/70 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition border border-slate-700/60 cursor-pointer"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Reset to Default Problem (3x + 4 = x + 12)</span>
      </button>
    </div>
  );

  return (
    <div className="relative w-full h-full flex flex-col flex-1 select-none overflow-hidden bg-slate-950">
      {/* Interactive Visual Canvas Area */}
      <div className="relative flex-1 w-full min-h-[360px] flex flex-col items-center justify-center p-3 sm:p-6 overflow-hidden">
        {/* Dynamic Chalkboard Equation Display */}
        {showEquationChalkboard && (
          <div className="w-full max-w-md mb-2 p-3 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md shadow-xl flex items-center justify-between text-center animate-in fade-in duration-200">
            <div className="flex-1">
              <span className="text-[10px] uppercase font-mono text-sky-400 font-bold tracking-wider block">
                Left Pan (LHS)
              </span>
              <span className="text-base sm:text-lg font-mono font-bold text-white">
                {leftXCount > 0 ? `${leftXCount > 1 ? leftXCount : ''}x` : ''}
                {leftXCount > 0 && leftWeight > 0 ? ' + ' : ''}
                {leftWeight > 0 || leftXCount === 0 ? `${leftWeight}` : ''}
              </span>
              <span className="text-[10px] text-slate-400 block font-mono">
                = {leftTotal}g total
              </span>
            </div>

            <div className="px-3 flex flex-col items-center justify-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
                isBalanced 
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-400 animate-pulse'
                  : 'bg-amber-500/20 border-amber-500/50 text-amber-400'
              }`}>
                <Equal className="w-4 h-4 font-extrabold" />
              </div>
              <span className={`text-[9px] font-bold mt-0.5 tracking-wider uppercase ${
                isBalanced ? 'text-emerald-400' : 'text-amber-400'
              }`}>
                {isBalanced ? 'Balanced!' : diff > 0 ? 'Left Heavy' : 'Right Heavy'}
              </span>
            </div>

            <div className="flex-1">
              <span className="text-[10px] uppercase font-mono text-emerald-400 font-bold tracking-wider block">
                Right Pan (RHS)
              </span>
              <span className="text-base sm:text-lg font-mono font-bold text-white">
                {rightXCount > 0 ? `${rightXCount > 1 ? rightXCount : ''}x` : ''}
                {rightXCount > 0 && rightWeight > 0 ? ' + ' : ''}
                {rightWeight > 0 || rightXCount === 0 ? `${rightWeight}` : ''}
              </span>
              <span className="text-[10px] text-slate-400 block font-mono">
                = {rightTotal}g total
              </span>
            </div>
          </div>
        )}

        {/* Misconception Trap Alert Banner */}
        {isTrapActive && (
          <div className="w-full max-w-md mb-2 p-3 rounded-2xl bg-rose-950/90 border border-rose-500 text-rose-200 text-xs flex items-center justify-between shadow-xl animate-bounce">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
              <div>
                <span className="font-bold block">⚠️ EQUATION BROKEN (Unbalanced)!</span>
                <span>You removed 4g from only Left side! LHS = {leftTotal}g vs RHS = {rightTotal}g</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleFixTrap}
              className="px-2.5 py-1 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[11px] shrink-0 ml-2 cursor-pointer"
            >
              Fix Balance
            </button>
          </div>
        )}

        {/* Physical Balance Scale SVG */}
        <div className="w-full max-w-xl h-64 sm:h-72 relative flex items-center justify-center">
          <svg viewBox="0 0 500 320" className="w-full h-full drop-shadow-2xl">
            {/* Base and Central Pillar */}
            <polygon points="250,60 235,270 265,270" fill="url(#brassGrad)" stroke="#78350f" strokeWidth="1.5" />
            <rect x="180" y="270" width="140" height="20" rx="4" fill="#334155" stroke="#475569" strokeWidth="2" />
            <ellipse cx="250" cy="270" rx="60" ry="8" fill="#1e293b" />

            {/* Central Pivot Jewel */}
            <circle cx="250" cy="60" r="10" fill="#f59e0b" stroke="#78350f" strokeWidth="2" />
            <circle cx="250" cy="60" r="4" fill="#fef3c7" />

            {/* Rotating Beam Group */}
            <g transform={`rotate(${tilt} 250 60)`} className="transition-transform duration-500 ease-out">
              {/* Main Brass Beam */}
              <line x1="80" y1="60" x2="420" y2="60" stroke="url(#brassGrad)" strokeWidth="6" strokeLinecap="round" />
              <line x1="80" y1="58" x2="420" y2="58" stroke="#fef3c7" strokeWidth="1" strokeLinecap="round" opacity="0.6" />

              {/* Left Pan Hook */}
              <circle cx="90" cy="60" r="5" fill="#f59e0b" stroke="#78350f" strokeWidth="1.5" />
              {/* Right Pan Hook */}
              <circle cx="410" cy="60" r="5" fill="#f59e0b" stroke="#78350f" strokeWidth="1.5" />

              {/* Vertical Indicator Needle */}
              <line x1="250" y1="60" x2="250" y2="120" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
            </g>

            {/* Scale Gauge Plate (Fixed) */}
            <path d="M 230,135 Q 250,145 270,135" fill="none" stroke="#64748b" strokeWidth="1.5" />
            <line x1="250" y1="130" x2="250" y2="142" stroke="#10b981" strokeWidth="2" />

            {/* Left Pan Chains & Plate (Positions counter-rotated to remain horizontal) */}
            {(() => {
              const rad = (tilt * Math.PI) / 180;
              const hookX = 250 + (90 - 250) * Math.cos(rad) - (60 - 60) * Math.sin(rad);
              const hookY = 60 + (90 - 250) * Math.sin(rad) + (60 - 60) * Math.cos(rad);
              const panX = hookX;
              const panY = hookY + 130;
              return (
                <g>
                  {/* Chains */}
                  <line x1={hookX} y1={hookY} x2={panX - 45} y2={panY} stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 2" />
                  <line x1={hookX} y1={hookY} x2={panX + 45} y2={panY} stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 2" />
                  {/* Pan Dish */}
                  <ellipse cx={panX} cy={panY} rx="55" ry="12" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
                  <ellipse cx={panX} cy={panY} rx="50" ry="9" fill="rgba(56, 189, 248, 0.15)" />

                  {/* Left Pan Items Stack */}
                  <g transform={`translate(${panX - 40}, ${panY - 26})`}>
                    {/* Mystery x Boxes */}
                    {Array.from({ length: leftXCount }).map((_, i) => (
                      <g key={`lx-${i}`} transform={`translate(${(i % 3) * 26}, ${Math.floor(i / 3) * -22})`}>
                        <rect x="0" y="0" width="22" height="20" rx="3" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
                        <text x="11" y="14" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">x</text>
                      </g>
                    ))}
                  </g>
                  {/* Gram Weights */}
                  <g transform={`translate(${panX + 15}, ${panY - 14})`}>
                    {Array.from({ length: Math.min(10, leftWeight) }).map((_, i) => (
                      <circle
                        key={`lw-${i}`}
                        cx={(i % 4) * 8}
                        cy={Math.floor(i / 4) * -8}
                        r="4"
                        fill="#f59e0b"
                        stroke="#78350f"
                        strokeWidth="1"
                      />
                    ))}
                    {leftWeight > 10 && (
                      <text x="5" y="-12" fill="#fbbf24" fontSize="9" fontWeight="bold">+{leftWeight - 10}g</text>
                    )}
                  </g>
                </g>
              );
            })()}

            {/* Right Pan Chains & Plate */}
            {(() => {
              const rad = (tilt * Math.PI) / 180;
              const hookX = 250 + (410 - 250) * Math.cos(rad) - (60 - 60) * Math.sin(rad);
              const hookY = 60 + (410 - 250) * Math.sin(rad) + (60 - 60) * Math.cos(rad);
              const panX = hookX;
              const panY = hookY + 130;
              return (
                <g>
                  {/* Chains */}
                  <line x1={hookX} y1={hookY} x2={panX - 45} y2={panY} stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 2" />
                  <line x1={hookX} y1={hookY} x2={panX + 45} y2={panY} stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 2" />
                  {/* Pan Dish */}
                  <ellipse cx={panX} cy={panY} rx="55" ry="12" fill="#1e293b" stroke="#10b981" strokeWidth="2" />
                  <ellipse cx={panX} cy={panY} rx="50" ry="9" fill="rgba(16, 185, 129, 0.15)" />

                  {/* Right Pan Items Stack */}
                  <g transform={`translate(${panX - 40}, ${panY - 26})`}>
                    {/* Mystery x Boxes */}
                    {Array.from({ length: rightXCount }).map((_, i) => (
                      <g key={`rx-${i}`} transform={`translate(${(i % 3) * 26}, ${Math.floor(i / 3) * -22})`}>
                        <rect x="0" y="0" width="22" height="20" rx="3" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
                        <text x="11" y="14" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">x</text>
                      </g>
                    ))}
                  </g>
                  {/* Gram Weights */}
                  <g transform={`translate(${panX + 10}, ${panY - 14})`}>
                    {Array.from({ length: Math.min(12, rightWeight) }).map((_, i) => (
                      <circle
                        key={`rw-${i}`}
                        cx={(i % 4) * 8}
                        cy={Math.floor(i / 4) * -8}
                        r="4"
                        fill="#f59e0b"
                        stroke="#78350f"
                        strokeWidth="1"
                      />
                    ))}
                    {rightWeight > 12 && (
                      <text x="5" y="-14" fill="#fbbf24" fontSize="9" fontWeight="bold">+{rightWeight - 12}g</text>
                    )}
                  </g>
                </g>
              );
            })()}

            {/* Gradients */}
            <defs>
              <linearGradient id="brassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Live Status Pill */}
        <div className="mt-2 flex items-center gap-2">
          {leftXCount === 1 && rightXCount === 0 && leftWeight === 0 ? (
            <div className="px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5 animate-bounce">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Isolated Solution: x = {rightWeight}g!</span>
            </div>
          ) : (
            <div className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400 text-xs font-mono">
              Remove identical weights from both pans to isolate x
            </div>
          )}
        </div>
      </div>

      {/* Bottom Sheet for Mobile & Cockpit Panels for Desktop */}
      <BottomSheet
        title="Balance Scale Linear Equations"
        onReset={handleReset}
        theoryContent={<CoachTheoryModule simulatorId="balance-scale-equations" />}
        challengeContent={
          <ChallengeManager
            simulatorId="balance-scale-equations"
            simulatorTitle="Balance Scale Linear Equations"
            levels={challengeLevels}
          />
        }
      >
        {controlsContent}
      </BottomSheet>
    </div>
  );
};
