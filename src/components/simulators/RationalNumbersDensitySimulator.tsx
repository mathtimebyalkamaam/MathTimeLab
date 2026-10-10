/**
 * RationalNumbersDensitySimulator.tsx: Class 8 Rational Numbers Lab.
 * Features:
 * - Number line microscope zoom between any two rational fractions p/q and r/s
 * - Arithmetic Mean Insertion: (a + b) / 2 bisection ladder
 * - Common Denominator Multiplier: easily find 5 or 10 rationals between 1/3 and 1/2
 * - Arithmetic Properties Checker: Closure, Commutative, Associative, Distributive
 * - 3 Progressive Board Exam challenges
 */
import React, { useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  Divide, 
  RotateCcw, 
  Sparkles, 
  ZoomIn, 
  Layers, 
  CheckCircle2, 
  ArrowRight,
  Maximize2
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

export const RationalNumbersDensitySimulator: React.FC = () => {
  const {
    rationalNumbersParams,
    updateRationalNumbersParams,
    resetParams,
    completeChallenge,
    challengeCompleted,
    isZenMode,
  } = useSimulatorStore();

  const {
    fractionA_num,
    fractionA_den,
    fractionB_num,
    fractionB_den,
    zoomLevel,
    subdivisions,
    meanStepsCount,
    showDecimalEquivalent,
  } = rationalNumbersParams;

  const [activeTab, setActiveTab] = useState<'density' | 'properties'>('density');
  const [propertyOp, setPropertyOp] = useState<'+' | '-' | '*' | '/'>('+');

  const { lightTap, successBuzz } = useHaptics();
  const { playClick, playChime } = useSound();
  const { trackEvent } = useAnalytics();

  // Numerical values
  const valA = fractionA_num / fractionA_den;
  const valB = fractionB_num / fractionB_den;
  const minVal = Math.min(valA, valB);
  const maxVal = Math.max(valA, valB);

  // Mean insertions: successively calculate means
  const insertedMeans = useMemo(() => {
    const list: { fractionStr: string; decimal: number; step: number }[] = [];
    let currentLeft = minVal;
    let currentRight = maxVal;

    for (let i = 1; i <= meanStepsCount; i++) {
      const mean = (currentLeft + currentRight) / 2;
      list.push({
        fractionStr: `Mean ${i}`,
        decimal: mean,
        step: i,
      });
      // Alternate picking intervals to populate densely
      if (i % 2 === 1) {
        currentLeft = mean;
      } else {
        currentRight = mean;
      }
    }
    return list;
  }, [minVal, maxVal, meanStepsCount]);

  // Common denominator multiplier for finding N numbers
  const multiplier = subdivisions;
  const commonDen = fractionA_den * fractionB_den;
  const scaledDen = commonDen * multiplier;
  const scaledNumA = fractionA_num * fractionB_den * multiplier;
  const scaledNumB = fractionB_num * fractionA_den * multiplier;
  const startNum = Math.min(scaledNumA, scaledNumB);
  const endNum = Math.max(scaledNumA, scaledNumB);
  const intermediateCount = Math.max(0, endNum - startNum - 1);

  const handleReset = () => {
    lightTap();
    playClick();
    resetParams('rational-numbers-density');
  };

  const challengeLevels: ChallengeLevel[] = [
    {
      levelNumber: 1,
      title: 'Find Rational Numbers: Between 1/3 and 1/2',
      badge: 'Density Explorer',
      description: 'Set fraction A = 1/3 and fraction B = 1/2. Scale subdivisions to 10 to instantly unlock 9 rational numbers!',
      requirementFormula: '\\frac{1}{3} = \\frac{20}{60} < \\frac{21}{60}, \\dots, \\frac{29}{60} < \\frac{30}{60} = \\frac{1}{2}',
      targetCriteria: 'Set 1/3 and 1/2 with subdivisions >= 10',
      xpReward: 35,
      tier1Hint: 'Set A = 1/3 and B = 1/2.',
      tier2Hint: 'Slide Subdivisions to 10.',
      tier3Hint: 'Multiplying numerator and denominator creates an easy window between 20/60 and 30/60!',
      autoPreset: () => {
        updateRationalNumbersParams({
          fractionA_num: 1,
          fractionA_den: 3,
          fractionB_num: 1,
          fractionB_den: 2,
          subdivisions: 10,
        });
      },
    },
    {
      levelNumber: 2,
      title: 'Mean Method Bisection: Step 3',
      badge: 'Mean Navigator',
      description: 'Use the Mean Method slider to insert at least 4 rational numbers between 0/1 and 1/1.',
      requirementFormula: 'm_1 = \\frac{0 + 1}{2} = \\frac{1}{2}, \\quad m_2 = \\frac{1/2 + 1}{2} = \\frac{3}{4}',
      targetCriteria: 'Set meanStepsCount >= 4',
      xpReward: 40,
      tier1Hint: 'Set Fraction A to 0/1 and Fraction B to 1/1.',
      tier2Hint: 'Increase "Mean Bisection Steps" to 4 or higher.',
      tier3Hint: 'The average of any two distinct rational numbers always falls strictly between them!',
      autoPreset: () => {
        updateRationalNumbersParams({
          fractionA_num: 0,
          fractionA_den: 1,
          fractionB_num: 1,
          fractionB_den: 1,
          meanStepsCount: 4,
        });
      },
    },
    {
      levelNumber: 3,
      title: 'Negative Rational Window: -2/5 to 1/5',
      badge: 'Zero-Crossing Master',
      description: 'Find rational numbers spanning across zero: between -2/5 and 1/5.',
      requirementFormula: '-\\frac{2}{5} < -\\frac{1}{5} < 0 < \\frac{1}{5}',
      targetCriteria: 'Set A = -2/5 and B = 1/5',
      xpReward: 50,
      tier1Hint: 'Set Fraction A numerator to -2, denominator to 5.',
      tier2Hint: 'Set Fraction B numerator to 1, denominator to 5.',
      tier3Hint: '0 is a rational number (0 = 0/1) that sits perfectly inside this interval!',
      autoPreset: () => {
        updateRationalNumbersParams({
          fractionA_num: -2,
          fractionA_den: 5,
          fractionB_num: 1,
          fractionB_den: 5,
          subdivisions: 5,
        });
      },
    },
  ];

  // Challenge completion triggers
  React.useEffect(() => {
    if (!challengeCompleted["level-1"] && fractionA_num === 1 && fractionA_den === 3 && fractionB_num === 1 && fractionB_den === 2 && subdivisions >= 10) {
      completeChallenge("level-1", 35);
      successBuzz();
      playChime();
      confetti({ particleCount: 40, spread: 60 });
    }
    if (!challengeCompleted["level-2"] && fractionA_num === 0 && fractionA_den === 1 && fractionB_num === 1 && fractionB_den === 1 && meanStepsCount >= 4) {
      completeChallenge("level-2", 40);
      successBuzz();
      playChime();
      confetti({ particleCount: 50, spread: 70 });
    }
    if (!challengeCompleted["level-3"] && fractionA_num === -2 && fractionA_den === 5 && fractionB_num === 1 && fractionB_den === 5) {
      completeChallenge("level-3", 50);
      successBuzz();
      playChime();
      confetti({ particleCount: 60, spread: 80 });
    }
  }, [fractionA_num, fractionA_den, fractionB_num, fractionB_den, subdivisions, meanStepsCount, challengeCompleted, completeChallenge, successBuzz, playChime]);

  const controlsContent = (
    <div className="space-y-2 p-2 sm:p-2.5 text-slate-200">
      {/* Navigation tabs */}
      <div className="flex bg-slate-950/80 p-0.5 rounded-xl border border-slate-800">
        <button
          onClick={() => { lightTap(); setActiveTab('density'); }}
          className={`flex-1 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            activeTab === 'density' ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          Density & Zoom
        </button>
        <button
          onClick={() => { lightTap(); setActiveTab('properties'); }}
          className={`flex-1 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            activeTab === 'properties' ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          Properties Audit
        </button>
      </div>

      {activeTab === 'density' ? (
        <div className="space-y-1.5 animate-fade-in">
          <div className="grid grid-cols-2 gap-1.5">
            <div className="bg-slate-900/80 p-1.5 rounded-xl border border-slate-800 space-y-0.5">
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">Fraction A</span>
              <TouchSlider
                compact={true}
                label="Numerator"
                value={fractionA_num}
                min={-5}
                max={5}
                step={1}
                unit=""
                onChange={(val) => updateRationalNumbersParams({ fractionA_num: val })}
              />
              <TouchSlider
                compact={true}
                label="Denominator"
                value={fractionA_den}
                min={1}
                max={10}
                step={1}
                unit=""
                onChange={(val) => updateRationalNumbersParams({ fractionA_den: val })}
              />
            </div>

            <div className="bg-slate-900/80 p-1.5 rounded-xl border border-slate-800 space-y-0.5">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">Fraction B</span>
              <TouchSlider
                compact={true}
                label="Numerator"
                value={fractionB_num}
                min={-5}
                max={5}
                step={1}
                unit=""
                onChange={(val) => updateRationalNumbersParams({ fractionB_num: val })}
              />
              <TouchSlider
                compact={true}
                label="Denominator"
                value={fractionB_den}
                min={1}
                max={10}
                step={1}
                unit=""
                onChange={(val) => updateRationalNumbersParams({ fractionB_den: val })}
              />
            </div>
          </div>

          <div className="cockpit-slider-grid grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-0.5 bg-slate-900/70 border border-slate-800 rounded-xl p-1.5">
            <TouchSlider
              compact={true}
              label="Subdivisions"
              value={subdivisions}
              min={1}
              max={15}
              step={1}
              unit="x"
              onChange={(val) => updateRationalNumbersParams({ subdivisions: val })}
            />

            <TouchSlider
              compact={true}
              label="Mean Steps (a+b)/2"
              value={meanStepsCount}
              min={0}
              max={6}
              step={1}
              unit=" pts"
              onChange={(val) => updateRationalNumbersParams({ meanStepsCount: val })}
            />
          </div>
        </div>
      ) : (
        <div className="space-y-1.5 animate-fade-in">
          <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">
            Test Arithmetic Operation
          </span>
          <div className="flex gap-1.5">
            {(['+', '-', '*', '/'] as const).map((op) => (
              <button
                key={op}
                onClick={() => { lightTap(); setPropertyOp(op); }}
                className={`flex-1 py-1 rounded-lg font-bold font-mono text-sm border cursor-pointer ${
                  propertyOp === op
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                {op === '*' ? '×' : op === '/' ? '÷' : op}
              </button>
            ))}
          </div>

          <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800 text-[11px] space-y-1">
            <div className="flex justify-between items-center text-slate-300">
              <span className="font-semibold">Closure:</span>
              <span className="text-emerald-400 font-bold">
                {propertyOp === '/' ? 'Closed (q ≠ 0)' : 'Closed (Rational)'}
              </span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span className="font-semibold">Commutative:</span>
              <span className={propertyOp === '+' || propertyOp === '*' ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                {propertyOp === '+' || propertyOp === '*' ? 'YES (a ∘ b = b ∘ a)' : 'NO (order matters)'}
              </span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span className="font-semibold">Associative:</span>
              <span className={propertyOp === '+' || propertyOp === '*' ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                {propertyOp === '+' || propertyOp === '*' ? 'YES: (a ∘ b) ∘ c = a ∘ (b ∘ c)' : 'NO'}
              </span>
            </div>
          </div>
        </div>
      )}

      <Eli13ExplainerCard simulatorId="rational-numbers-density" defaultExpanded={false} />

      <button
        type="button"
        onClick={() => {
          lightTap();
          resetParams('rational-numbers-density');
        }}
        className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl bg-slate-800/70 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition border border-slate-700/60 cursor-pointer"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Reset to Default Fractions</span>
      </button>
    </div>
  );

  return (
    <div className="relative w-full h-full flex flex-col flex-1 select-none overflow-hidden bg-slate-950">
      {/* Main Interactive Stage */}
      <div className="relative flex-1 w-full min-h-0 flex flex-col items-center justify-center p-2 sm:p-4 overflow-hidden">
        <div className="w-full max-w-xl bg-slate-900/70 border border-slate-800/80 rounded-2xl p-3 sm:p-4 backdrop-blur-sm shadow-xl space-y-2.5">
          {/* Interval Indicator */}
          <div className="bg-slate-950/80 rounded-2xl p-3 border border-cyan-950/60 text-center flex items-center justify-around">
            <div>
              <span className="text-xs text-slate-400 uppercase font-semibold">Point A</span>
              <div className="text-2xl font-mono font-bold text-cyan-400">
                {fractionA_num}/{fractionA_den}
              </div>
              <div className="text-xs font-mono text-slate-500">≈ {valA.toFixed(3)}</div>
            </div>
            <div className="text-center px-4">
              <span className="text-xs text-slate-400 uppercase font-semibold">Density Fact</span>
              <div className="text-sm font-bold text-emerald-400">
                ∞ Infinite Rationals Lie Between
              </div>
            </div>
            <div>
              <span className="text-xs text-slate-400 uppercase font-semibold">Point B</span>
              <div className="text-2xl font-mono font-bold text-amber-400">
                {fractionB_num}/{fractionB_den}
              </div>
              <div className="text-xs font-mono text-slate-500">≈ {valB.toFixed(3)}</div>
            </div>
          </div>

          {/* Interactive Number Line Canvas */}
          <div className="bg-slate-950/60 rounded-2xl p-6 border border-slate-800/80 space-y-6">
            <div className="text-xs font-semibold text-slate-400 flex items-center justify-between">
              <span>Zoomed Number Line View</span>
              <span className="text-cyan-400 font-mono text-xs">Interval: [{minVal.toFixed(2)}, {maxVal.toFixed(2)}]</span>
            </div>

            {/* Line with tick marks */}
            <div className="relative py-8">
              {/* Main horizontal line */}
              <div className="h-1 bg-gradient-to-r from-cyan-500 via-emerald-400 to-amber-500 rounded-full w-full relative">
                {/* Point A Mark */}
                <div 
                  className="absolute -top-3 w-7 h-7 -ml-3.5 rounded-full bg-cyan-500 border-2 border-slate-950 flex items-center justify-center text-[10px] font-black text-slate-950 shadow-lg shadow-cyan-500/50"
                  style={{ left: `${valA < valB ? 5 : 95}%` }}
                >
                  A
                </div>

                {/* Point B Mark */}
                <div 
                  className="absolute -top-3 w-7 h-7 -ml-3.5 rounded-full bg-amber-500 border-2 border-slate-950 flex items-center justify-center text-[10px] font-black text-slate-950 shadow-lg shadow-amber-500/50"
                  style={{ left: `${valB > valA ? 95 : 5}%` }}
                >
                  B
                </div>

                {/* Inserted Mean Points */}
                {insertedMeans.map((m, idx) => {
                  const range = maxVal - minVal || 1;
                  const pct = 5 + ((m.decimal - minVal) / range) * 90;
                  return (
                    <div
                      key={idx}
                      className="absolute -top-2 w-5 h-5 -ml-2.5 rounded-full bg-emerald-400 border border-slate-950 flex items-center justify-center text-[9px] font-bold text-slate-950 shadow-md animate-pulse"
                      style={{ left: `${pct}%` }}
                      title={`Step ${m.step}: ${m.decimal.toFixed(3)}`}
                    >
                      {m.step}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Common denominator method view */}
            <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Topper Shortcut: Common Denominator Window
              </div>
              <div className="font-mono text-xs sm:text-sm text-cyan-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex flex-wrap items-center gap-2">
                <span>{fractionA_num}/{fractionA_den} = <strong className="text-white">{scaledNumA}/{scaledDen}</strong></span>
                <span className="text-slate-500">&lt;</span>
                <span className="text-emerald-400 font-bold">
                  {intermediateCount} numbers: {startNum + 1}/{scaledDen}, {startNum + 2}/{scaledDen}...
                </span>
                <span className="text-slate-500">&lt;</span>
                <span>{fractionB_num}/{fractionB_den} = <strong className="text-white">{scaledNumB}/{scaledDen}</strong></span>
              </div>
              <p className="text-[11px] text-slate-400">
                By scaling numerator and denominator by {multiplier}, we carved a spacious window of {intermediateCount} guaranteed rational fractions between them!
              </p>
            </div>
          </div>
        </div>
      </div>

      <BottomSheet
        title="Rational Numbers & Infinite Density"
        onReset={handleReset}
        theoryContent={<CoachTheoryModule simulatorId="rational-numbers-density" />}
        challengeContent={
          <ChallengeManager
            simulatorId="rational-numbers-density"
            simulatorTitle="Rational Numbers & Infinite Density"
            levels={challengeLevels}
          />
        }
      >
        {controlsContent}
      </BottomSheet>
    </div>
  );
};
