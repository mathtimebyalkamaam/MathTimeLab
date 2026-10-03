/**
 * ArithmeticProgressionSimulator.tsx: Class 10 Arithmetic Progression (AP) Lab.
 * Features:
 * - Visual bar ladder: a, a+d, a+2d, ..., a+(n-1)d
 * - Gauss Interlocking Staircase: Visual proof of Sn = (n/2)(a + l)
 * - Draggable/Slidable First Term (a), Common Difference (d), and Number of Terms (n)
 * - Negative and Zero common difference demonstrators
 * - 3 Progressive Board Exam challenges
 */
import React, { useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  BarChart2, 
  RotateCcw, 
  Sparkles, 
  Layers, 
  TrendingUp, 
  Calculator,
  CheckCircle2
} from 'lucide-react';
import { useSimulatorStore } from '../../store/useSimulatorStore';
import { BottomSheet } from '../layout/BottomSheet';
import { TouchSlider } from '../common/TouchSlider';
import { CoachTheoryModule } from '../common/CoachTheoryModule';
import { ChallengeManager, ChallengeLevel } from '../common/ChallengeManager';
import { useHaptics } from '../../hooks/useHaptics';
import { useSound } from '../common/SoundManager';
import { useAnalytics } from '../../hooks/useAnalytics';
import { LiveSubstitutionCard } from '../common/LiveSubstitutionCard';

export const ArithmeticProgressionSimulator: React.FC = () => {
  const {
    apParams,
    updateApParams,
    resetParams,
    completeChallenge,
    challengeCompleted,
    isZenMode,
  } = useSimulatorStore();

  const {
    firstTermA,
    commonDiffD,
    numberOfTermsN,
    showGaussRectangle,
    highlightTermIndex,
  } = apParams;

  const { lightTap, successBuzz } = useHaptics();
  const { playClick, playChime } = useSound();
  const { trackEvent } = useAnalytics();

  // Compute terms
  const terms = useMemo(() => {
    const list: number[] = [];
    for (let i = 0; i < numberOfTermsN; i++) {
      list.push(firstTermA + i * commonDiffD);
    }
    return list;
  }, [firstTermA, commonDiffD, numberOfTermsN]);

  const lastTermL = terms[terms.length - 1] ?? firstTermA;
  const sumSn = (numberOfTermsN / 2) * (firstTermA + lastTermL);

  const handleReset = () => {
    lightTap();
    playClick();
    resetParams('arithmetic-progression-lab');
  };

  const challengeLevels: ChallengeLevel[] = [
    {
      levelNumber: 1,
      title: 'Find the 10th Term: a = 2, d = 3',
      badge: 'AP Stepper',
      description: 'Set first term a = 2, common difference d = 3, and n = 10. Verify that a₁₀ = 29!',
      requirementFormula: 'a_n = a + (n-1)d \\implies a_{10} = 2 + (9 \\times 3) = 29',
      targetCriteria: 'Set a=2, d=3, n=10',
      xpReward: 35,
      tier1Hint: 'Set First Term a = 2.',
      tier2Hint: 'Set Common Difference d = 3 and n = 10.',
      tier3Hint: 'Each step adds exactly 3. At step 10, 9 jumps have been made: 2 + 27 = 29!',
      autoPreset: () => {
        updateApParams({ firstTermA: 2, commonDiffD: 3, numberOfTermsN: 10 });
      },
    },
    {
      levelNumber: 2,
      title: 'Gauss Sum of First 10 Natural Numbers',
      badge: 'Young Gauss',
      description: 'Set a = 1, d = 1, and n = 10. Toggle the Gauss Interlocking Staircase to see S₁₀ = 55 formed as a 10×11 rectangle / 2!',
      requirementFormula: 'S_n = \\frac{n(n+1)}{2} \\implies S_{10} = \\frac{10 \\times 11}{2} = 55',
      targetCriteria: 'Set a=1, d=1, n=10 with showGaussRectangle',
      xpReward: 40,
      tier1Hint: 'Set a = 1, d = 1, and n = 10.',
      tier2Hint: 'Toggle the Gauss Staircase view button on.',
      tier3Hint: 'Two staircases of 1..10 fit into a 10 × 11 rectangle of 110 squares. Half of 110 is 55!',
      autoPreset: () => {
        updateApParams({ firstTermA: 1, commonDiffD: 1, numberOfTermsN: 10, showGaussRectangle: true });
      },
    },
    {
      levelNumber: 3,
      title: 'Decreasing AP with Zero Sum: a = 12, d = -3',
      badge: 'Equilibrium Master',
      description: 'Set first term a = 12, common difference d = -3, and n = 9. Witness the sum reach zero!',
      requirementFormula: 'S_9 = \\frac{9}{2}[2(12) + 8(-3)] = \\frac{9}{2}[24 - 24] = 0',
      targetCriteria: 'Set a=12, d=-3, n=9',
      xpReward: 50,
      tier1Hint: 'Set First Term a = 12.',
      tier2Hint: 'Slide Common Difference d to -3 (negative slope!).',
      tier3Hint: 'Set n = 9. Notice positive terms (+12, +9, +6, +3) perfectly cancel negative terms (-3, -6, -9, -12)!',
      autoPreset: () => {
        updateApParams({ firstTermA: 12, commonDiffD: -3, numberOfTermsN: 9 });
      },
    },
  ];

  // Challenge checks
  React.useEffect(() => {
    if (!challengeCompleted["level-1"] && firstTermA === 2 && commonDiffD === 3 && numberOfTermsN === 10) {
      completeChallenge("level-1", 35);
      successBuzz();
      playChime();
      confetti({ particleCount: 40, spread: 60 });
    }
    if (!challengeCompleted["level-2"] && firstTermA === 1 && commonDiffD === 1 && numberOfTermsN === 10 && showGaussRectangle) {
      completeChallenge("level-2", 40);
      successBuzz();
      playChime();
      confetti({ particleCount: 50, spread: 70 });
    }
    if (!challengeCompleted["level-3"] && firstTermA === 12 && commonDiffD === -3 && numberOfTermsN === 9) {
      completeChallenge("level-3", 50);
      successBuzz();
      playChime();
      confetti({ particleCount: 60, spread: 80 });
    }
  }, [firstTermA, commonDiffD, numberOfTermsN, showGaussRectangle, challengeCompleted, completeChallenge, successBuzz, playChime]);

  const controlsContent = (
    <div className="space-y-4 text-slate-200">
      <LiveSubstitutionCard
        title="Arithmetic Progression (AP) Invariant"
        badge={`n = ${numberOfTermsN}`}
        symbolicLaw="a_n = a + (n-1)d, \quad S_n = \frac{n}{2}(a + l) = \frac{n}{2}[2a + (n-1)d]"
        substitutedLatex={`a_{${numberOfTermsN}} = ${firstTermA} + (${numberOfTermsN}-1)(${commonDiffD}) = ${lastTermL}`}
        evaluatedLatex={`S_{${numberOfTermsN}} = \\frac{${numberOfTermsN}}{2}[${firstTermA} + ${lastTermL}] = ${sumSn.toFixed(1)}`}
      />

      <div className="space-y-4">
        <TouchSlider
          label="First Term (a)"
          value={firstTermA}
          min={-10}
          max={20}
          step={1}
          unit=""
          onChange={(val) => updateApParams({ firstTermA: val })}
        />

        <TouchSlider
          label="Common Difference (d)"
          value={commonDiffD}
          min={-5}
          max={8}
          step={1}
          unit=""
          onChange={(val) => updateApParams({ commonDiffD: val })}
        />

        <TouchSlider
          label="Number of Terms (n)"
          value={numberOfTermsN}
          min={3}
          max={15}
          step={1}
          unit=" terms"
          onChange={(val) => updateApParams({ numberOfTermsN: val })}
        />
      </div>

      <div className="pt-2">
        <button
          onClick={() => {
            lightTap();
            updateApParams({ showGaussRectangle: !showGaussRectangle });
          }}
          className={`w-full py-3 rounded-2xl font-bold flex items-center justify-center gap-2 border transition-all ${
            showGaussRectangle
              ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20'
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          <Layers className="w-5 h-5" />
          {showGaussRectangle ? 'Hide Gauss Interlocking Staircase' : 'Show Gauss Interlocking Staircase'}
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
            Class 10 • Arithmetic Progressions
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-white mt-1 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-amber-400" />
            Arithmetic Progression & Gauss Ladder
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
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">First Term (a)</span>
              <div className="text-xl font-mono font-bold text-cyan-400">{firstTermA}</div>
            </div>
            <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Common Diff (d)</span>
              <div className="text-xl font-mono font-bold text-amber-400">
                {commonDiffD > 0 ? `+${commonDiffD}` : commonDiffD}
              </div>
            </div>
            <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Sum S_{numberOfTermsN}</span>
              <div className="text-xl font-mono font-bold text-emerald-400">{sumSn}</div>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="bg-slate-950/60 rounded-2xl p-6 border border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
              <span>Term Heights Ladder (a_n = a + (n-1)d)</span>
              <span className="font-mono text-cyan-400">Last Term l = a_{numberOfTermsN} = {lastTermL}</span>
            </div>

            {/* Bars container */}
            <div className="h-52 flex items-end justify-between gap-1.5 pt-8 border-b border-slate-800 pb-2">
              {terms.map((term, idx) => {
                const maxAbs = Math.max(...terms.map(t => Math.abs(t)), 10);
                const heightPct = Math.max(8, (Math.abs(term) / maxAbs) * 100);
                const isPositive = term >= 0;

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                    <span className="text-[10px] font-mono text-slate-400 mb-1 group-hover:text-white">
                      {term}
                    </span>
                    <div
                      className={`w-full rounded-t-lg transition-all duration-300 ${
                        isPositive 
                          ? 'bg-gradient-to-t from-cyan-600 to-cyan-400 shadow-md shadow-cyan-500/20' 
                          : 'bg-gradient-to-t from-rose-600 to-rose-400'
                      }`}
                      style={{ height: `${heightPct}%` }}
                    />
                    <span className="text-[10px] font-mono text-slate-500 mt-1">
                      T{idx + 1}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Gauss Rectangle Proof Explanation */}
            {showGaussRectangle && (
              <div className="bg-amber-950/30 border border-amber-800/40 rounded-2xl p-4 space-y-2 animate-fadeIn">
                <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Gauss Pairing Miracle: S_n = (n / 2) × (First + Last)
                </div>
                <div className="font-mono text-xs sm:text-sm text-amber-200">
                  Two copies of this AP form a rectangle of width <span className="font-bold text-white">{numberOfTermsN}</span> and height <span className="font-bold text-white">({firstTermA} + {lastTermL} = {firstTermA + lastTermL})</span>.
                </div>
                <div className="font-mono text-xs text-emerald-400 font-bold">
                  Total Area = {numberOfTermsN} × {firstTermA + lastTermL} = {numberOfTermsN * (firstTermA + lastTermL)}. Half = {sumSn}!
                </div>
              </div>
            )}
          </div>
        </div>

      <BottomSheet
        title="Arithmetic Progression Lab"
        onReset={handleReset}
        theoryContent={<CoachTheoryModule simulatorId="arithmetic-progression-lab" />}
        challengeContent={
          <ChallengeManager
            simulatorId="arithmetic-progression-lab"
            simulatorTitle="Arithmetic Progression Lab"
            levels={challengeLevels}
          />
        }
      >
        {controlsContent}
      </BottomSheet>
    </div>
  );
};
