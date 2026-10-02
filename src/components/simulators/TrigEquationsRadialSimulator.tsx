/**
 * TrigEquationsRadialSimulator.tsx: Class 11 Trigonometric Equations General Solutions Lab.
 * Features:
 * - General solution radial visualizer for sin θ = k, cos θ = k, tan θ = k
 * - Visual radar beam sweeping through quadrants on the unit circle
 * - Principal value α vs general infinite family of solutions
 * - Slider for integer revolution index n (..., -1, 0, 1, 2, 3, ...)
 * - 3 Progressive Board Exam challenges
 */
import React, { useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  Compass, 
  RotateCcw, 
  Sparkles, 
  Layers, 
  Target, 
  CheckCircle2,
  Radio
} from 'lucide-react';
import { useSimulatorStore } from '../../store/useSimulatorStore';
import { BottomSheet } from '../layout/BottomSheet';
import { TouchSlider } from '../common/TouchSlider';
import { CoachTheoryModule } from '../common/CoachTheoryModule';
import { ChallengeManager, ChallengeLevel } from '../common/ChallengeManager';
import { useHaptics } from '../../hooks/useHaptics';
import { useSound } from '../common/SoundManager';
import { useAnalytics } from '../../hooks/useAnalytics';

export const TrigEquationsRadialSimulator: React.FC = () => {
  const {
    trigEquationsParams,
    updateTrigEquationsParams,
    resetParams,
    completeChallenge,
    challengeCompleted,
    isZenMode,
  } = useSimulatorStore();

  const {
    targetFunction,
    targetValue,
    sweepAngleDeg,
    showAllQuadrants,
    showGeneralFormulas,
    rangePeriods,
  } = trigEquationsParams;

  const { lightTap, successBuzz } = useHaptics();
  const { playClick, playChime } = useSound();
  const { trackEvent } = useAnalytics();

  // Compute principal value alpha in degrees
  const alphaDeg = useMemo(() => {
    if (targetFunction === 'sin') {
      return (Math.asin(Math.max(-1, Math.min(1, targetValue))) * 180) / Math.PI;
    }
    if (targetFunction === 'cos') {
      return (Math.acos(Math.max(-1, Math.min(1, targetValue))) * 180) / Math.PI;
    }
    return (Math.atan(targetValue) * 180) / Math.PI;
  }, [targetFunction, targetValue]);

  // Compute first few solutions in [-360°, 720°]
  const solutions = useMemo(() => {
    const list: { n: number; angleDeg: number; formula: string }[] = [];
    for (let n = -1; n <= rangePeriods; n++) {
      if (targetFunction === 'sin') {
        const val = n * 180 + Math.pow(-1, n) * alphaDeg;
        list.push({ n, angleDeg: val, formula: `${n}π + (-1)ⁿ(${alphaDeg.toFixed(1)}°)` });
      } else if (targetFunction === 'cos') {
        const valPlus = 2 * n * 180 + alphaDeg;
        const valMinus = 2 * n * 180 - alphaDeg;
        list.push({ n, angleDeg: valPlus, formula: `2(${n})π + ${alphaDeg.toFixed(1)}°` });
        if (alphaDeg !== 0) {
          list.push({ n, angleDeg: valMinus, formula: `2(${n})π - ${alphaDeg.toFixed(1)}°` });
        }
      } else {
        const val = n * 180 + alphaDeg;
        list.push({ n, angleDeg: val, formula: `${n}π + ${alphaDeg.toFixed(1)}°` });
      }
    }
    return list.sort((a, b) => a.angleDeg - b.angleDeg);
  }, [targetFunction, targetValue, alphaDeg, rangePeriods]);

  const handleReset = () => {
    lightTap();
    playClick();
    resetParams('trig-equations-radial');
  };

  const challengeLevels: ChallengeLevel[] = [
    {
      levelNumber: 1,
      title: 'Principal Sine Solution: sin θ = 1/2',
      badge: 'Principal Hunter',
      description: 'Set target function to sin and value k = 0.5. Verify principal value α = 30° (π/6)!',
      requirementFormula: '\\sin \\theta = \\frac{1}{2} \\implies \\alpha = 30^\\circ \\; (\\pi/6)',
      targetCriteria: 'Set sin with k = 0.5',
      xpReward: 35,
      tier1Hint: 'Select "sin" function.',
      tier2Hint: 'Slide Target Value k to 0.5.',
      tier3Hint: 'arcsin(0.5) is 30° in Quadrant 1, and 180° - 30° = 150° in Quadrant 2!',
      autoPreset: () => {
        updateTrigEquationsParams({ targetFunction: 'sin', targetValue: 0.5 });
      },
    },
    {
      levelNumber: 2,
      title: 'General Cosine Family: cos θ = 0',
      badge: 'Orthogonal Ray',
      description: 'Set target function to cos and value k = 0. Observe solutions at odd multiples of π/2: θ = (2n + 1)π/2.',
      requirementFormula: '\\cos \\theta = 0 \\implies \\theta = (2n + 1)\\frac{\\pi}{2}',
      targetCriteria: 'Set cos with k = 0',
      xpReward: 40,
      tier1Hint: 'Select "cos" function.',
      tier2Hint: 'Set Target Value k to 0.',
      tier3Hint: 'Cosine is the x-coordinate on the unit circle. It vanishes at 90° (top) and 270° (bottom)!',
      autoPreset: () => {
        updateTrigEquationsParams({ targetFunction: 'cos', targetValue: 0 });
      },
    },
    {
      levelNumber: 3,
      title: 'Tangent Periodicity: tan θ = 1',
      badge: 'Diagonal Periodicity',
      description: 'Set target function to tan and value k = 1.0. Witness the π (180°) period straight-line recurrence!',
      requirementFormula: '\\tan \\theta = 1 \\implies \\theta = n\\pi + \\frac{\\pi}{4}',
      targetCriteria: 'Set tan with k = 1',
      xpReward: 50,
      tier1Hint: 'Select "tan" function.',
      tier2Hint: 'Set Target Value k to 1.0.',
      tier3Hint: 'Tangent repeats every 180° (opposing quadrants 1 and 3)!',
      autoPreset: () => {
        updateTrigEquationsParams({ targetFunction: 'tan', targetValue: 1.0 });
      },
    },
  ];

  // Challenge checks
  React.useEffect(() => {
    if (!challengeCompleted["level-1"] && targetFunction === 'sin' && Math.abs(targetValue - 0.5) < 0.05) {
      completeChallenge("level-1", 35);
      successBuzz();
      playChime();
      confetti({ particleCount: 40, spread: 60 });
    }
    if (!challengeCompleted["level-2"] && targetFunction === 'cos' && Math.abs(targetValue) < 0.05) {
      completeChallenge("level-2", 40);
      successBuzz();
      playChime();
      confetti({ particleCount: 50, spread: 70 });
    }
    if (!challengeCompleted["level-3"] && targetFunction === 'tan' && Math.abs(targetValue - 1.0) < 0.05) {
      completeChallenge("level-3", 50);
      successBuzz();
      playChime();
      confetti({ particleCount: 60, spread: 80 });
    }
  }, [targetFunction, targetValue, challengeCompleted, completeChallenge, successBuzz, playChime]);

  const controlsContent = (
    <div className="space-y-6 text-slate-200">
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          Select Trigonometric Function
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(['sin', 'cos', 'tan'] as const).map((fn) => (
            <button
              key={fn}
              onClick={() => {
                lightTap();
                updateTrigEquationsParams({ targetFunction: fn });
              }}
              className={`p-2.5 rounded-xl font-bold font-mono text-sm border transition-all ${
                targetFunction === fn
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/10'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {fn} θ = k
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <TouchSlider
          label={`Target Value k for ${targetFunction}(θ)`}
          value={targetValue}
          min={targetFunction === 'tan' ? -2 : -1}
          max={targetFunction === 'tan' ? 2 : 1}
          step={0.1}
          unit=""
          onChange={(val) => updateTrigEquationsParams({ targetValue: val })}
        />

        <TouchSlider
          label="Integer Periods Shown (n)"
          value={rangePeriods}
          min={1}
          max={3}
          step={1}
          unit=" revolutions"
          onChange={(val) => updateTrigEquationsParams({ rangePeriods: val })}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-full flex flex-col bg-slate-950 text-slate-100 p-3 sm:p-6 pb-32">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-900/40 text-cyan-400 border border-cyan-700/40">
            Class 11 • Trigonometric Functions
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-white mt-1 flex items-center gap-2">
            <Radio className="w-6 h-6 text-cyan-400" />
            Trigonometric Equations Radial Radar
          </h1>
        </div>
        <button
          onClick={handleReset}
          className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800"
          title="Reset Parameters"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      <div className="w-full max-w-4xl mx-auto bg-slate-900/70 border border-slate-800/80 rounded-3xl p-5 sm:p-6 backdrop-blur-sm shadow-xl space-y-6">
          {/* Target Equation Display */}
          <div className="bg-slate-950/80 rounded-2xl p-4 border border-cyan-950/60 text-center">
            <span className="text-xs text-slate-400 uppercase font-semibold">Active Equation</span>
            <div className="text-2xl font-mono font-bold text-cyan-300 mt-0.5">
              {targetFunction}(θ) = {targetValue.toFixed(2)}
            </div>
            <div className="text-xs font-mono text-emerald-400 mt-1">
              Principal Value α = {alphaDeg.toFixed(1)}° ({(alphaDeg * Math.PI / 180).toFixed(2)} rad)
            </div>
          </div>

          {/* Unit Circle Radar SVG */}
          <div className="bg-slate-950/80 rounded-2xl p-6 border border-slate-800/80 flex items-center justify-center min-h-[300px]">
            <svg viewBox="-120 -120 240 240" className="w-full max-w-xs h-auto">
              {/* Radar Circles */}
              <circle cx="0" cy="0" r="90" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="4,4" />
              <circle cx="0" cy="0" r="90" fill="rgba(6, 182, 212, 0.03)" stroke="#06b6d4" strokeWidth="2" />

              {/* Axes */}
              <line x1="-110" y1="0" x2="110" y2="0" stroke="#475569" strokeWidth="1.5" />
              <line x1="0" y1="-110" x2="0" y2="110" stroke="#475569" strokeWidth="1.5" />

              {/* Sine horizontal target line OR Cosine vertical target line */}
              {targetFunction === 'sin' && (
                <line
                  x1="-105"
                  y1={-targetValue * 90}
                  x2="105"
                  y2={-targetValue * 90}
                  stroke="#f43f5e"
                  strokeWidth="2"
                  strokeDasharray="3,3"
                />
              )}
              {targetFunction === 'cos' && (
                <line
                  x1={targetValue * 90}
                  y1="-105"
                  x2={targetValue * 90}
                  y2="105"
                  stroke="#f43f5e"
                  strokeWidth="2"
                  strokeDasharray="3,3"
                />
              )}

              {/* Solution Rays */}
              {solutions.map((sol, idx) => {
                const rad = (sol.angleDeg * Math.PI) / 180;
                const px = 90 * Math.cos(rad);
                const py = -90 * Math.sin(rad);

                return (
                  <g key={idx}>
                    <line x1="0" y1="0" x2={px} y2={py} stroke="#10b981" strokeWidth="2.5" />
                    <circle cx={px} cy={py} r="4" fill="#10b981" stroke="#ffffff" strokeWidth="1" />
                  </g>
                );
              })}

              <circle cx="0" cy="0" r="3" fill="#ffffff" />
            </svg>
          </div>

          {/* Solutions Feed */}
          <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Infinite General Family of Solutions:
            </div>
            <div className="flex flex-wrap gap-2">
              {solutions.map((sol, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs text-slate-300">
                  θ = <strong className="text-emerald-400">{sol.angleDeg.toFixed(1)}°</strong>
                </span>
              ))}
            </div>
          </div>
        </div>

      <BottomSheet
        title="Trigonometric Equations Radial Radar"
        onReset={handleReset}
        theoryContent={<CoachTheoryModule simulatorId="trig-equations-radial" />}
        challengeContent={
          <ChallengeManager
            simulatorId="trig-equations-radial"
            simulatorTitle="Trigonometric Equations Radial Radar"
            levels={challengeLevels}
          />
        }
      >
        {controlsContent}
      </BottomSheet>
    </div>
  );
};
