/**
 * DirectInverseSimulator.tsx: Direct vs Inverse Variations Machine (Class 8 Algebra).
 * Features:
 * - Direct Variation Mode: Speedometer & Distance Gauge (Linear ray y = kx, ratio y/x = constant)
 * - Inverse Variation Mode: Worker Crew & Project Timeline (Rectangular hyperbola xy = k, product = constant)
 * - Real-time state comparison table (x₁, y₁) vs (x₂, y₂)
 * - Intuitive common-sense sanity test: "More gives More" vs "More gives Less"
 * - 3 Progressive Board Exam challenges
 */
import React, { useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  Activity, 
  RotateCcw, 
  CheckCircle2, 
  TrendingUp, 
  Sliders, 
  Users, 
  Gauge, 
  ArrowRight,
  Layers
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

export const DirectInverseSimulator: React.FC = () => {
  const {
    directInverseParams,
    updateDirectInverseParams,
    resetParams,
    completeChallenge,
    challengeCompleted,
    isZenMode,
  } = useSimulatorStore();

  const {
    mode,
    directX,
    directConstantK,
    inverseWorkers,
    inverseTotalWorkDays,
    showCoordinateGraph,
    showTableValues,
  } = directInverseParams;

  const { lightTap, successBuzz } = useHaptics();
  const { playClick, playChime } = useSound();
  const { trackEvent } = useAnalytics();

  // Calculations
  // Direct: y = k * x (Distance = Time * Speed)
  const directDistance = directX * directConstantK;
  const directRatio = directDistance / (directX || 1);

  // Inverse: y = k / x (Days = Total Man-Days / Workers)
  const inverseDays = inverseTotalWorkDays / (inverseWorkers || 1);
  const inverseProduct = inverseWorkers * inverseDays;

  const handleReset = () => {
    lightTap();
    playClick();
    resetParams('direct-inverse-proportions');
  };

  // Challenges for Board Exam mastery
  const challengeLevels: ChallengeLevel[] = [
    {
      levelNumber: 1,
      title: 'Direct Variation: 60 km/h for 3 Hours',
      badge: 'Speed Cruiser',
      description: 'Set Speed = 60 km/h and Time Constant k = 3 hrs. Confirm distance is 180 km and ratio y/x = 3.00.',
      requirementFormula: '\\frac{y}{x} = \\frac{180}{60} = 3.00',
      targetCriteria: 'Set Speed = 60, k = 3 in Direct mode',
      xpReward: 30,
      tier1Hint: 'Select Direct Proportion mode.',
      tier2Hint: 'Set Speed x = 60 and Time k = 3.',
      tier3Hint: 'Verify Distance y = 180 km and the straight line passes through (60, 180).',
      autoPreset: () => {
        updateDirectInverseParams({
          mode: 'direct-speed',
          directX: 60,
          directConstantK: 3,
        });
      },
    },
    {
      levelNumber: 2,
      title: 'Inverse Variation: 8 Workers on 24 Man-Days',
      badge: 'Crew Scaler',
      description: 'Switch to Inverse mode. With 24 total man-days, increase workers to 8. Watch the deadline shrink to 3 days!',
      requirementFormula: 'x \\cdot y = 8 \\times 3 = 24',
      targetCriteria: 'Set Workers = 8, Total Work = 24 in Inverse mode',
      xpReward: 40,
      tier1Hint: 'Select Inverse Proportion mode.',
      tier2Hint: 'Set Workers = 8 and Total Work = 24.',
      tier3Hint: 'Check that 24 / 8 = 3 days!',
      autoPreset: () => {
        updateDirectInverseParams({
          mode: 'inverse-workers',
          inverseWorkers: 8,
          inverseTotalWorkDays: 24,
        });
      },
    },
    {
      levelNumber: 3,
      title: 'Rush Project: Halving the Time to 2 Days',
      badge: 'Proportion Master',
      description: 'How many workers complete the 24 man-day project in just 2 days? Scale workers to 12!',
      requirementFormula: '12 \\text{ workers} \\times 2 \\text{ days} = 24',
      targetCriteria: 'Set Workers = 12 in Inverse mode',
      xpReward: 50,
      tier1Hint: 'Total work is 24 man-days.',
      tier2Hint: 'To finish in 2 days: Workers = 24 / 2 = 12.',
      tier3Hint: 'Slide Workers to 12 and watch project days hit 2.0!',
      autoPreset: () => {
        updateDirectInverseParams({
          mode: 'inverse-workers',
          inverseWorkers: 12,
          inverseTotalWorkDays: 24,
        });
      },
    },
  ];

  // Auto verify challenges
  React.useEffect(() => {
    if (mode === 'direct-speed' && directX === 60 && directConstantK === 3) {
      if (!challengeCompleted['direct-inverse-proportions-1']) {
        successBuzz();
        playChime();
        confetti({ particleCount: 35, spread: 60, origin: { y: 0.6 } });
        completeChallenge('direct-inverse-proportions-1', 30);
      }
    }
    if (mode === 'inverse-workers' && inverseWorkers === 8 && inverseTotalWorkDays === 24) {
      if (!challengeCompleted['direct-inverse-proportions-2']) {
        successBuzz();
        playChime();
        confetti({ particleCount: 40, spread: 65, origin: { y: 0.6 } });
        completeChallenge('direct-inverse-proportions-2', 40);
      }
    }
    if (mode === 'inverse-workers' && inverseWorkers === 12 && inverseTotalWorkDays === 24) {
      if (!challengeCompleted['direct-inverse-proportions-3']) {
        successBuzz();
        playChime();
        confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
        completeChallenge('direct-inverse-proportions-3', 50);
      }
    }
  }, [mode, directX, directConstantK, inverseWorkers, inverseTotalWorkDays, challengeCompleted, completeChallenge, playChime, successBuzz]);

  const controlsContent = (
    <div className="space-y-4 p-4 text-slate-200">
      {/* Mode Switcher */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Proportion Variation Type
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => {
              lightTap();
              playClick();
              updateDirectInverseParams({ mode: 'direct-speed' });
              trackEvent('direct_inverse_mode', { mode: 'direct' });
            }}
            className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
              mode === 'direct-speed'
                ? 'bg-sky-500/20 border-sky-400 text-sky-200 shadow-sm'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <div className="text-xs font-bold flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-sky-400" />
              <span>Direct Variation</span>
            </div>
            <div className="text-[10px] font-mono text-slate-400 mt-0.5">Ratio y / x = k (Speed vs Dist)</div>
          </button>

          <button
            type="button"
            onClick={() => {
              lightTap();
              playClick();
              updateDirectInverseParams({ mode: 'inverse-workers' });
              trackEvent('direct_inverse_mode', { mode: 'inverse' });
            }}
            className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
              mode === 'inverse-workers'
                ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-sm'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <div className="text-xs font-bold flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span>Inverse Variation</span>
            </div>
            <div className="text-[10px] font-mono text-slate-400 mt-0.5">Product x · y = k (Workers vs Days)</div>
          </button>
        </div>
      </div>

      {/* Sliders */}
      {mode === 'direct-speed' ? (
        <div className="space-y-3 bg-slate-900/70 border border-slate-800 rounded-2xl p-3.5">
          <TouchSlider
            label="Car Speed x (km/h)"
            value={directX}
            min={10}
            max={120}
            step={5}
            unit=" km/h"
            onChange={(val) => updateDirectInverseParams({ directX: val })}
          />
          <TouchSlider
            label="Fixed Travel Time Constant k (Hours)"
            value={directConstantK}
            min={1}
            max={8}
            step={1}
            unit=" hrs"
            onChange={(val) => updateDirectInverseParams({ directConstantK: val })}
          />
        </div>
      ) : (
        <div className="space-y-3 bg-slate-900/70 border border-slate-800 rounded-2xl p-3.5">
          <TouchSlider
            label="Worker Crew Count x"
            value={inverseWorkers}
            min={1}
            max={24}
            step={1}
            unit=" workers"
            onChange={(val) => updateDirectInverseParams({ inverseWorkers: val })}
          />
          <TouchSlider
            label="Total Job Effort Constant k (Man-Days)"
            value={inverseTotalWorkDays}
            min={12}
            max={48}
            step={6}
            unit=" man-days"
            onChange={(val) => updateDirectInverseParams({ inverseTotalWorkDays: val })}
          />
        </div>
      )}

      {/* Explain Like I'm 13 Card */}
      <Eli13ExplainerCard simulatorId="direct-inverse-proportions" />

      <button
        type="button"
        onClick={handleReset}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/70 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition border border-slate-700/60 cursor-pointer"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Reset to Default Parameters</span>
      </button>
    </div>
  );

  return (
    <div className="relative w-full h-full flex flex-col flex-1 select-none overflow-hidden bg-slate-950">
      {/* Interactive Visual Graph Canvas */}
      <div className="relative flex-1 w-full min-h-[360px] flex flex-col items-center justify-center p-3 sm:p-6 overflow-hidden">
        {/* Real-time Math HUD Card */}
        <div className="w-full max-w-lg mb-2 p-3 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md shadow-xl text-center">
          {mode === 'direct-speed' ? (
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-sky-400 uppercase tracking-wider block">
                Direct Proportion: Ratio y / x is Constant!
              </span>
              <div className="text-base sm:text-xl font-mono font-bold text-white flex items-center justify-center gap-2">
                <span>Distance = {directDistance} km</span>
                <span className="text-slate-500">|</span>
                <span className="text-sky-300">y / x = {directDistance} / {directX} = {directRatio.toFixed(2)}</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono block">
                Double Speed (60 → 120 km/h) ⟹ Double Distance ({directConstantK * 60} → {directConstantK * 120} km)
              </span>
            </div>
          ) : (
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block">
                Inverse Proportion: Product x · y is Constant!
              </span>
              <div className="text-base sm:text-xl font-mono font-bold text-white flex items-center justify-center gap-2">
                <span>{inverseWorkers} Workers</span>
                <span className="text-slate-500">×</span>
                <span className="text-amber-300">{inverseDays.toFixed(1)} Days</span>
                <span className="text-slate-500">=</span>
                <span className="text-emerald-400">{inverseTotalWorkDays} Man-Days</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono block">
                Double Workers (4 → 8) ⟹ Halves Completion Time ({inverseTotalWorkDays / 4} → {inverseTotalWorkDays / 8} Days)
              </span>
            </div>
          )}
        </div>

        {/* Dynamic Coordinate Graph SVG */}
        <div className="w-full max-w-md h-64 sm:h-72 flex items-center justify-center bg-slate-900/30 rounded-2xl border border-slate-800/60 p-2">
          <svg viewBox="0 0 340 240" className="w-full h-full drop-shadow-xl overflow-visible">
            {/* Axes */}
            <line x1="45" y1="200" x2="320" y2="200" stroke="#475569" strokeWidth="1.5" />
            <line x1="45" y1="20" x2="45" y2="200" stroke="#475569" strokeWidth="1.5" />

            {/* Axis Labels */}
            <text x="315" y="215" fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="end">
              {mode === 'direct-speed' ? 'Speed x (km/h)' : 'Workers x'}
            </text>
            <text x="35" y="20" fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="end">
              {mode === 'direct-speed' ? 'Distance y (km)' : 'Days y'}
            </text>

            {/* Direct Mode: Straight line ray y = kx */}
            {mode === 'direct-speed' && (
              <g>
                {/* Ray through origin */}
                <line x1="45" y1="200" x2="310" y2="30" stroke="#38bdf8" strokeWidth="2.5" />

                {/* Active marker point */}
                {(() => {
                  const ptX = 45 + (directX / 120) * 250;
                  const ptY = 200 - (directDistance / (120 * directConstantK)) * 160;
                  return (
                    <g>
                      <line x1={ptX} y1="200" x2={ptX} y2={ptY} stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 3" />
                      <line x1="45" y1={ptY} x2={ptX} y2={ptY} stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 3" />
                      <circle cx={ptX} cy={ptY} r="5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
                      <text x={ptX + 8} y={ptY - 8} fill="#38bdf8" fontSize="10" fontFamily="monospace" fontWeight="bold">
                        ({directX}, {directDistance})
                      </text>
                    </g>
                  );
                })()}
              </g>
            )}

            {/* Inverse Mode: Rectangular Hyperbola xy = k */}
            {mode === 'inverse-workers' && (
              <g>
                {/* Hyperbola curve path */}
                <path
                  d="M 60,35 Q 90,130 300,185"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2.5"
                />

                {/* Active marker point */}
                {(() => {
                  const ptX = 45 + (inverseWorkers / 24) * 250;
                  const ptY = 200 - (inverseDays / 24) * 160;
                  const clampedY = Math.max(30, Math.min(195, ptY));
                  return (
                    <g>
                      <line x1={ptX} y1="200" x2={ptX} y2={clampedY} stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" />
                      <line x1="45" y1={clampedY} x2={ptX} y2={clampedY} stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" />
                      <circle cx={ptX} cy={clampedY} r="5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
                      <text x={ptX + 8} y={clampedY - 8} fill="#f59e0b" fontSize="10" fontFamily="monospace" fontWeight="bold">
                        ({inverseWorkers} workers, {inverseDays.toFixed(1)} days)
                      </text>
                    </g>
                  );
                })()}
              </g>
            )}
          </svg>
        </div>

        {/* Intuition Footer Pill */}
        <div className="mt-2 text-center text-xs font-mono text-slate-400">
          Direct: Straight line y = kx · Inverse: Curved hyperbola x · y = k
        </div>
      </div>

      <BottomSheet
        title="Direct vs Inverse Proportions"
        onReset={handleReset}
        theoryContent={<CoachTheoryModule simulatorId="direct-inverse-proportions" />}
        challengeContent={
          <ChallengeManager
            simulatorId="direct-inverse-proportions"
            simulatorTitle="Direct vs Inverse Proportions"
            levels={challengeLevels}
          />
        }
      >
        {controlsContent}
      </BottomSheet>
    </div>
  );
};
