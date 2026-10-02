/**
 * MathematicalInductionSimulator.tsx: Class 11 Principle of Mathematical Induction (PMI) Domino Lab.
 * Features:
 * - Two-step proof architecture: Base Case P(1) and Inductive Step P(k) ⟹ P(k+1)
 * - Physics Domino Cascade: Domino 1 falls, knocking down Domino k, which knocks down Domino k+1
 * - Broken Link Trap Buster: Demonstrating why BOTH steps are mandatory for truth across all n ∈ ℕ
 * - 3 Progressive Board Exam challenges
 */
import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Play, 
  RotateCcw, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  AlertTriangle,
  Flame,
  Award
} from 'lucide-react';
import { useSimulatorStore } from '../../store/useSimulatorStore';
import { BottomSheet } from '../layout/BottomSheet';
import { TouchSlider } from '../common/TouchSlider';
import { CoachTheoryModule } from '../common/CoachTheoryModule';
import { ChallengeManager, ChallengeLevel } from '../common/ChallengeManager';
import { useHaptics } from '../../hooks/useHaptics';
import { useSound } from '../common/SoundManager';
import { useAnalytics } from '../../hooks/useAnalytics';

export const MathematicalInductionSimulator: React.FC = () => {
  const {
    inductionParams,
    updateInductionParams,
    resetParams,
    completeChallenge,
    challengeCompleted,
    isZenMode,
  } = useSimulatorStore();

  const {
    propositionType,
    targetN,
    dominoFallProgress,
    isBaseCaseVerified,
    isInductiveStepUnlocked,
  } = inductionParams;

  const [isFalling, setIsFalling] = useState(false);
  const [fallenCount, setFallenCount] = useState(0);

  const { lightTap, successBuzz } = useHaptics();
  const { playClick, playChime } = useSound();
  const { trackEvent } = useAnalytics();

  const handleReset = () => {
    lightTap();
    playClick();
    setIsFalling(false);
    setFallenCount(0);
    resetParams('mathematical-induction-dominos');
  };

  const handleToppleDominos = () => {
    lightTap();
    playClick();
    if (!isBaseCaseVerified) {
      alert('Cannot start domino cascade! Base Case P(1) must be verified first!');
      return;
    }
    if (!isInductiveStepUnlocked) {
      alert('Dominoes cannot transmit energy! Inductive step P(k) ⟹ P(k+1) must be bridged!');
      return;
    }

    setIsFalling(true);
    let count = 0;
    const interval = setInterval(() => {
      count++;
      setFallenCount(count);
      if (count >= targetN) {
        clearInterval(interval);
        setIsFalling(false);
        playChime();
        successBuzz();
        confetti({ particleCount: 50, spread: 70 });
      }
    }, 150);
  };

  const challengeLevels: ChallengeLevel[] = [
    {
      levelNumber: 1,
      title: 'Verify Base Case P(1): Sum of First n',
      badge: 'Base Case Verifier',
      description: 'Select Sum of Natural Numbers. Click "Verify Base Case P(1)" to prove LHS = RHS = 1.',
      requirementFormula: 'P(1): \\quad 1 = \\frac{1(1+1)}{2} = 1 \\quad (\\text{True!})',
      targetCriteria: 'Set isBaseCaseVerified = true',
      xpReward: 35,
      tier1Hint: 'Choose "Sum of First n Natural Numbers".',
      tier2Hint: 'Click the "Verify Base Case P(1)" button.',
      tier3Hint: 'Without the first domino falling, no subsequent dominoes will ever topple!',
      autoPreset: () => {
        updateInductionParams({ propositionType: 'sum-natural', isBaseCaseVerified: true });
      },
    },
    {
      levelNumber: 2,
      title: 'Bridge Inductive Step: P(k) ⟹ P(k+1)',
      badge: 'Inductive Bridger',
      description: 'Unlock the Inductive Step by adding the (k+1)-th term to the inductive hypothesis.',
      requirementFormula: 'S_k + (k+1) = \\frac{k(k+1)}{2} + (k+1) = \\frac{(k+1)(k+2)}{2}',
      targetCriteria: 'Set isInductiveStepUnlocked = true',
      xpReward: 40,
      tier1Hint: 'Verify the algebraic simplification for k+1.',
      tier2Hint: 'Factor out (k+1) to reach the target formula.',
      tier3Hint: 'This proves that if any domino k falls, domino k+1 is guaranteed to fall!',
      autoPreset: () => {
        updateInductionParams({ isBaseCaseVerified: true, isInductiveStepUnlocked: true });
      },
    },
    {
      levelNumber: 3,
      title: 'Infinite Domino Cascade: n = 10',
      badge: 'Induction Grandmaster',
      description: 'Topple all 10 dominos in a continuous cascade, confirming truth for all n ∈ ℕ!',
      requirementFormula: '\\forall n \\in \\mathbb{N}, \\quad P(n) \\text{ is True}',
      targetCriteria: 'Set targetN = 10 and trigger domino topple',
      xpReward: 50,
      tier1Hint: 'Ensure both Base Case and Inductive Step are verified.',
      tier2Hint: 'Set Target N to 10.',
      tier3Hint: 'Hit "Topple Dominos!" to watch the cascade.',
      autoPreset: () => {
        updateInductionParams({ targetN: 10, isBaseCaseVerified: true, isInductiveStepUnlocked: true });
      },
    },
  ];

  // Challenge checks
  React.useEffect(() => {
    if (!challengeCompleted["level-1"] && isBaseCaseVerified) {
      completeChallenge("level-1", 35);
      successBuzz();
      playChime();
      confetti({ particleCount: 40, spread: 60 });
    }
    if (!challengeCompleted["level-2"] && isInductiveStepUnlocked) {
      completeChallenge("level-2", 40);
      successBuzz();
      playChime();
      confetti({ particleCount: 50, spread: 70 });
    }
    if (!challengeCompleted["level-3"] && fallenCount >= 10) {
      completeChallenge("level-3", 50);
      successBuzz();
      playChime();
      confetti({ particleCount: 60, spread: 80 });
    }
  }, [isBaseCaseVerified, isInductiveStepUnlocked, fallenCount, challengeCompleted, completeChallenge, successBuzz, playChime]);

  const controlsContent = (
    <div className="space-y-6 text-slate-200">
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          Select Mathematical Proposition
        </label>
        <div className="grid grid-cols-1 gap-2">
          {[
            { id: 'sum-natural', label: '1 + 2 + ... + n = n(n+1)/2' },
            { id: 'sum-squares', label: '1² + 2² + ... + n² = n(n+1)(2n+1)/6' },
            { id: 'powers-inequality', label: '2ⁿ > n (for all n ≥ 1)' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                lightTap();
                updateInductionParams({ propositionType: item.id as any });
              }}
              className={`p-3 rounded-xl text-xs font-semibold text-left transition-all border font-mono ${
                propositionType === item.id
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/10'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <TouchSlider
          label="Target Dominoes (n)"
          value={targetN}
          min={5}
          max={12}
          step={1}
          unit=" dominoes"
          onChange={(val) => updateInductionParams({ targetN: val })}
        />
      </div>

      <div className="space-y-2 pt-2">
        <button
          onClick={() => {
            lightTap();
            updateInductionParams({ isBaseCaseVerified: !isBaseCaseVerified });
          }}
          className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all ${
            isBaseCaseVerified
              ? 'bg-emerald-500 text-slate-950 border-emerald-400'
              : 'bg-slate-900 border-slate-800 text-slate-300'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          {isBaseCaseVerified ? 'Base Case P(1) Verified ✓' : 'Verify Base Case P(1)'}
        </button>

        <button
          onClick={() => {
            lightTap();
            updateInductionParams({ isInductiveStepUnlocked: !isInductiveStepUnlocked });
          }}
          className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all ${
            isInductiveStepUnlocked
              ? 'bg-amber-500 text-slate-950 border-amber-400'
              : 'bg-slate-900 border-slate-800 text-slate-300'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          {isInductiveStepUnlocked ? 'Inductive Step P(k) ⟹ P(k+1) Unlocked ✓' : 'Unlock Inductive Step P(k) ⟹ P(k+1)'}
        </button>

        <button
          onClick={handleToppleDominos}
          disabled={isFalling}
          className="w-full py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all active:scale-[0.98] disabled:opacity-50"
        >
          <Play className="w-5 h-5 fill-current" />
          Topple Dominoes (Test Induction!)
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-full flex flex-col bg-slate-950 text-slate-100 p-3 sm:p-6 pb-32">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-900/40 text-cyan-400 border border-cyan-700/40">
            Class 11 • Mathematical Induction
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-white mt-1 flex items-center gap-2">
            <Layers className="w-6 h-6 text-amber-400" />
            Principle of Mathematical Induction (PMI)
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
          {/* Status Indicators */}
          <div className="grid grid-cols-2 gap-3">
            <div className={`p-3.5 rounded-2xl border text-center transition-all ${
              isBaseCaseVerified ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300' : 'bg-slate-950/80 border-slate-800 text-slate-400'
            }`}>
              <span className="text-[11px] uppercase font-semibold block mb-0.5">Step 1: Base Case</span>
              <div className="text-sm font-bold flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                {isBaseCaseVerified ? 'P(1) is TRUE' : 'Not Yet Verified'}
              </div>
            </div>

            <div className={`p-3.5 rounded-2xl border text-center transition-all ${
              isInductiveStepUnlocked ? 'bg-amber-950/40 border-amber-800 text-amber-300' : 'bg-slate-950/80 border-slate-800 text-slate-400'
            }`}>
              <span className="text-[11px] uppercase font-semibold block mb-0.5">Step 2: Inductive Step</span>
              <div className="text-sm font-bold flex items-center justify-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                {isInductiveStepUnlocked ? 'P(k) ⟹ P(k+1) BRIDGED' : 'Bridge Required'}
              </div>
            </div>
          </div>

          {/* Domino Chain Canvas */}
          <div className="bg-slate-950/80 rounded-2xl p-6 border border-slate-800/80 flex flex-col justify-end min-h-[260px] relative overflow-hidden">
            <div className="flex items-end justify-between gap-2 h-44 pb-4 border-b border-slate-800">
              {Array.from({ length: targetN }).map((_, idx) => {
                const dominoNum = idx + 1;
                const hasFallen = dominoNum <= fallenCount;
                const isFirst = dominoNum === 1;

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center justify-end">
                    <div
                      className={`w-4 sm:w-6 h-28 rounded-md transition-all duration-300 origin-bottom-left shadow-lg ${
                        hasFallen
                          ? 'rotate-[65deg] translate-y-3 bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-emerald-500/20'
                          : isFirst
                          ? 'bg-gradient-to-t from-cyan-600 to-cyan-400 shadow-cyan-500/20'
                          : 'bg-gradient-to-t from-slate-700 to-slate-500'
                      }`}
                    />
                    <span className="text-[10px] font-mono text-slate-400 mt-3">
                      n={dominoNum}
                    </span>
                  </div>
                );
              })}
            </div>

            {fallenCount >= targetN && (
              <div className="mt-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-700/50 text-emerald-300 font-mono text-xs text-center font-bold animate-fadeIn">
                🎉 Complete Induction Cascade! True for all natural numbers n ∈ ℕ!
              </div>
            )}
          </div>

          {/* Educational Note */}
          <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-400" />
              The Two Pillars of Mathematical Induction
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              1. <strong>Base Case P(1):</strong> Gives the first push to the first domino.
              <br />
              2. <strong>Inductive Step P(k) ⟹ P(k+1):</strong> Guarantees the distance between dominos is close enough so each falling domino topples the next one!
            </p>
          </div>
        </div>

      <BottomSheet
        title="Principle of Mathematical Induction"
        onReset={handleReset}
        theoryContent={<CoachTheoryModule simulatorId="mathematical-induction-dominos" />}
        challengeContent={
          <ChallengeManager
            simulatorId="mathematical-induction-dominos"
            simulatorTitle="Principle of Mathematical Induction"
            levels={challengeLevels}
          />
        }
      >
        {controlsContent}
      </BottomSheet>
    </div>
  );
};
