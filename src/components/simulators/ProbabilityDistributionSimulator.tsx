/**
 * ProbabilityDistributionSimulator.tsx: Class 12 Random Variables & Probability Distributions Lab.
 * Features:
 * - Discrete random variable probability distribution: Σ P(X = xi) = 1
 * - Expected Value (Mean μ = E(X)) center-of-mass fulcrum indicator
 * - Variance σ² and Standard Deviation spread brackets
 * - Binomial Distribution generator: P(X = k) = C(n, k) p^k (1-p)^(n-k)
 * - Live Monte Carlo simulation engine converging to theoretical distribution
 * - 3 Progressive Board Exam challenges
 */
import React, { useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  BarChart, 
  RotateCcw, 
  Sparkles, 
  Layers, 
  Play, 
  CheckCircle2,
  Dice5,
  TrendingUp
} from 'lucide-react';
import { useSimulatorStore } from '../../store/useSimulatorStore';
import { BottomSheet } from '../layout/BottomSheet';
import { TouchSlider } from '../common/TouchSlider';
import { CoachTheoryModule } from '../common/CoachTheoryModule';
import { ChallengeManager, ChallengeLevel } from '../common/ChallengeManager';
import { useHaptics } from '../../hooks/useHaptics';
import { useSound } from '../common/SoundManager';
import { useAnalytics } from '../../hooks/useAnalytics';

// Helper for combinations nCk
function combinations(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  let c = 1;
  for (let i = 1; i <= k; i++) {
    c = (c * (n - (k - i))) / i;
  }
  return c;
}

export const ProbabilityDistributionSimulator: React.FC = () => {
  const {
    probDistParams,
    updateProbDistParams,
    resetParams,
    completeChallenge,
    challengeCompleted,
    isZenMode,
  } = useSimulatorStore();

  const {
    experimentType,
    numberOfTrials,
    sampleSize,
    showTheoreticalDistribution,
    showMeanVariance,
  } = probDistParams;

  const [pSuccess, setPSuccess] = useState<number>(0.5);
  const [empiricalCounts, setEmpiricalCounts] = useState<Record<number, number>>({});
  const [totalSimulated, setTotalSimulated] = useState<number>(0);

  const { lightTap, successBuzz } = useHaptics();
  const { playClick, playChime } = useSound();
  const { trackEvent } = useAnalytics();

  const n = numberOfTrials;
  const p = pSuccess;
  const q = 1 - p;

  // Theoretical Mean & Variance for Binomial
  const meanMu = n * p;
  const varianceSigmaSq = n * p * q;
  const stdDevSigma = Math.sqrt(varianceSigmaSq);

  // Distribution values
  const distribution = useMemo(() => {
    const list: { k: number; prob: number; empiricalProb: number }[] = [];
    for (let k = 0; k <= n; k++) {
      const prob = combinations(n, k) * Math.pow(p, k) * Math.pow(q, n - k);
      const empiricalProb = totalSimulated > 0 ? (empiricalCounts[k] || 0) / totalSimulated : 0;
      list.push({ k, prob, empiricalProb });
    }
    return list;
  }, [n, p, q, empiricalCounts, totalSimulated]);

  const handleReset = () => {
    lightTap();
    playClick();
    setEmpiricalCounts({});
    setTotalSimulated(0);
    resetParams('probability-distribution-lab');
  };

  const handleRunSimulation = (batchSize: number) => {
    lightTap();
    playClick();

    const counts = { ...empiricalCounts };
    for (let i = 0; i < batchSize; i++) {
      let successes = 0;
      for (let trial = 0; trial < n; trial++) {
        if (Math.random() < p) successes++;
      }
      counts[successes] = (counts[successes] || 0) + 1;
    }

    setEmpiricalCounts(counts);
    setTotalSimulated((prev) => prev + batchSize);
    playChime();
  };

  const challengeLevels: ChallengeLevel[] = [
    {
      levelNumber: 1,
      title: 'Symmetric Coin Toss: n = 4, p = 0.5',
      badge: 'Binomial Balancer',
      description: 'Set n = 4 trials with fair probability p = 0.5. Verify mean μ = 2.0 and P(X=2) = 6/16 = 0.375!',
      requirementFormula: 'E(X) = np = 4(0.5) = 2.0, \\quad P(X=2) = \\binom{4}{2}(0.5)^4 = 0.375',
      targetCriteria: 'Set n=4 and p=0.5',
      xpReward: 35,
      tier1Hint: 'Set Number of Trials n = 4.',
      tier2Hint: 'Set Success Probability p = 0.5.',
      tier3Hint: 'Binomial distribution is perfectly symmetric when p = 0.5!',
      autoPreset: () => {
        updateProbDistParams({ numberOfTrials: 4 });
        setPSuccess(0.5);
      },
    },
    {
      levelNumber: 2,
      title: 'Skewed Probability: Dice Roll p = 1/6 (0.17)',
      badge: 'Dice Master',
      description: 'Set p = 0.17 (rolling a 6 on a die) for n = 6 trials. Observe how the mean shifts left to μ = 1.0!',
      requirementFormula: 'E(X) = 6 \\times \\frac{1}{6} = 1.0',
      targetCriteria: 'Set n=6 and p <= 0.2',
      xpReward: 40,
      tier1Hint: 'Set Number of Trials n to 6.',
      tier2Hint: 'Slide Success Probability p down to 0.17.',
      tier3Hint: 'When p < 0.5, the probability distribution is positively skewed toward lower counts!',
      autoPreset: () => {
        updateProbDistParams({ numberOfTrials: 6 });
        setPSuccess(0.17);
      },
    },
    {
      levelNumber: 3,
      title: 'Law of Large Numbers: 500 Monte Carlo Trials',
      badge: 'Empirical Detective',
      description: 'Run 500 simulation trials to watch the empirical green bars converge onto theoretical distribution!',
      requirementFormula: '\\lim_{N \\to \\infty} \\frac{\\text{Frequency}}{N} = P(X)',
      targetCriteria: 'Simulate at least 500 trials',
      xpReward: 50,
      tier1Hint: 'Click "+100 Trials" multiple times.',
      tier2Hint: 'Accumulate at least 500 total simulated experiments.',
      tier3Hint: 'The Law of Large Numbers guarantees empirical frequencies converge to theoretical probabilities!',
      autoPreset: () => {
        handleRunSimulation(500);
      },
    },
  ];

  // Challenge checks
  React.useEffect(() => {
    if (!challengeCompleted["level-1"] && numberOfTrials === 4 && Math.abs(pSuccess - 0.5) < 0.05) {
      completeChallenge("level-1", 35);
      successBuzz();
      playChime();
      confetti({ particleCount: 40, spread: 60 });
    }
    if (!challengeCompleted["level-2"] && numberOfTrials === 6 && pSuccess <= 0.2) {
      completeChallenge("level-2", 40);
      successBuzz();
      playChime();
      confetti({ particleCount: 50, spread: 70 });
    }
    if (!challengeCompleted["level-3"] && totalSimulated >= 500) {
      completeChallenge("level-3", 50);
      successBuzz();
      playChime();
      confetti({ particleCount: 60, spread: 80 });
    }
  }, [numberOfTrials, pSuccess, totalSimulated, challengeCompleted, completeChallenge, successBuzz, playChime]);

  const controlsContent = (
    <div className="space-y-6 text-slate-200">
      <div className="space-y-4">
        <TouchSlider
          label="Number of Trials (n)"
          value={numberOfTrials}
          min={3}
          max={8}
          step={1}
          unit=" trials"
          onChange={(val) => updateProbDistParams({ numberOfTrials: val })}
        />

        <TouchSlider
          label="Success Probability (p)"
          value={pSuccess}
          min={0.1}
          max={0.9}
          step={0.05}
          unit=""
          onChange={(val) => setPSuccess(val)}
        />
      </div>

      <div className="space-y-2 pt-2">
        <label className="text-xs font-bold uppercase text-slate-400 block">
          Monte Carlo Simulator (Law of Large Numbers)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleRunSimulation(100)}
            className="py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-bold text-xs hover:border-cyan-500 hover:text-cyan-300 transition-all"
          >
            +100 Trials
          </button>
          <button
            onClick={() => handleRunSimulation(500)}
            className="py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all"
          >
            +500 Trials
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-full flex flex-col bg-slate-950 text-slate-100 p-3 sm:p-6 pb-32">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-900/40 text-cyan-400 border border-cyan-700/40">
            Class 12 • Probability & Statistics
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-white mt-1 flex items-center gap-2">
            <BarChart className="w-6 h-6 text-cyan-400" />
            Random Variables & Probability Distributions
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
          {/* Key Parameters Indicator */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Expected Value μ = E(X)</span>
              <div className="text-xl font-mono font-bold text-cyan-400">{meanMu.toFixed(2)}</div>
            </div>
            <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Variance σ² = npq</span>
              <div className="text-xl font-mono font-bold text-amber-400">{varianceSigmaSq.toFixed(2)}</div>
            </div>
            <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Total Simulated</span>
              <div className="text-xl font-mono font-bold text-emerald-400">{totalSimulated}</div>
            </div>
          </div>

          {/* Probability Bar Chart */}
          <div className="bg-slate-950/80 rounded-2xl p-6 border border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
              <span>P(X = k) Binomial Distribution</span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-cyan-400"><span className="w-2.5 h-2.5 bg-cyan-500 rounded-sm"></span> Theoretical</span>
                {totalSimulated > 0 && (
                  <span className="flex items-center gap-1 text-emerald-400"><span className="w-2.5 h-2.5 bg-emerald-500 rounded-sm"></span> Empirical</span>
                )}
              </div>
            </div>

            {/* Bars container */}
            <div className="h-52 flex items-end justify-between gap-2 pt-6 border-b border-slate-800 pb-2">
              {distribution.map((item) => {
                const maxProb = Math.max(...distribution.map(d => d.prob), 0.3);
                const heightPct = (item.prob / maxProb) * 100;
                const empHeightPct = (item.empiricalProb / maxProb) * 100;

                return (
                  <div key={item.k} className="flex-1 flex flex-col items-center h-full justify-end group">
                    <span className="text-[10px] font-mono text-slate-400 mb-1">
                      {item.prob.toFixed(3)}
                    </span>
                    <div className="w-full flex items-end justify-center gap-0.5 h-full">
                      {/* Theoretical bar */}
                      <div
                        className="w-1/2 bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-t-sm transition-all duration-300"
                        style={{ height: `${heightPct}%` }}
                      />
                      {/* Empirical bar */}
                      {totalSimulated > 0 && (
                        <div
                          className="w-1/2 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-sm transition-all duration-300"
                          style={{ height: `${empHeightPct}%` }}
                        />
                      )}
                    </div>
                    <span className="text-[11px] font-mono font-bold text-slate-300 mt-2">
                      X={item.k}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Fulcrum indicator */}
            <div className="relative pt-2 text-center text-xs font-mono text-cyan-300">
              ▲ Center of Mass Mean Balance Point μ = {meanMu.toFixed(2)}
            </div>
          </div>
        </div>

      <BottomSheet
        title="Probability Distributions"
        onReset={handleReset}
        theoryContent={<CoachTheoryModule simulatorId="probability-distribution-lab" />}
        challengeContent={
          <ChallengeManager
            simulatorId="probability-distribution-lab"
            simulatorTitle="Probability Distributions"
            levels={challengeLevels}
          />
        }
      >
        {controlsContent}
      </BottomSheet>
    </div>
  );
};
