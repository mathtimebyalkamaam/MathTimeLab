/**
 * BayesProbabilitySimulator.tsx: Interactive Bayes' Theorem & Frequency Detective (Class 12 Probability).
 * Features:
 * - 1,000-cell visual population grid with real-time True Positives, False Positives, True Negatives, False Negatives
 * - Interactive Frequency Tree & Law of Total Probability breakdown
 * - Real-time Bayes equation HUD with natural frequency counting
 * - 3 Real-world scenarios (Medical Screening, Spam Filter, Factory Machine Defects)
 * - 3 Progressive board exam challenges
 */
import React, { useEffect, useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  RotateCcw, 
  HelpCircle, 
  Users, 
  Target, 
  Sparkles, 
  Layers, 
  AlertTriangle,
  GitFork,
  Activity,
  Sliders
} from 'lucide-react';
import { useSimulatorStore } from '../../store/useSimulatorStore';
import { BottomSheet } from '../layout/BottomSheet';
import { TouchSlider } from '../common/TouchSlider';
import { CoachTheoryModule } from '../common/CoachTheoryModule';
import { ChallengeManager, ChallengeLevel } from '../common/ChallengeManager';
import { useHaptics } from '../../hooks/useHaptics';
import { useSound } from '../common/SoundManager';
import { useAnalytics } from '../../hooks/useAnalytics';

export const BayesProbabilitySimulator: React.FC = () => {
  const {
    bayesProbabilityParams,
    updateBayesProbabilityParams,
    resetParams,
    completeChallenge,
    challengeCompleted,
    isZenMode,
  } = useSimulatorStore();

  const {
    scenario,
    prevalenceP_A,
    sensitivityP_B_given_A,
    falsePositiveRateP_B_given_notA,
    populationTotal,
    activeVisualMode,
    testResultPositive,
  } = bayesProbabilityParams;

  const { lightTap, successBuzz } = useHaptics();
  const { playClick, playChime } = useSound();
  const { trackEvent } = useAnalytics();

  // Natural Frequency counts out of populationTotal (default 1000)
  const N = populationTotal;
  const countSick = Math.round(N * prevalenceP_A);
  const countHealthy = N - countSick;

  // Tested Positive
  const truePositives = Math.round(countSick * sensitivityP_B_given_A);
  const falseNegatives = countSick - truePositives;

  const falsePositives = Math.round(countHealthy * falsePositiveRateP_B_given_notA);
  const trueNegatives = countHealthy - falsePositives;

  const totalPositives = truePositives + falsePositives;

  // Bayes Posterior Probability: P(Sick | Positive Test)
  const posteriorProb = totalPositives > 0 ? truePositives / totalPositives : 0;

  // Law of Total Probability: P(+) = P(+|D)P(D) + P(+|D')P(D')
  const totalProbPlus =
    sensitivityP_B_given_A * prevalenceP_A +
    falsePositiveRateP_B_given_notA * (1 - prevalenceP_A);

  // Challenges evaluation
  useEffect(() => {
    // Challenge 1: The 99% Test / 0.1% Rare Disease Shock (Posterior ≈ 9%)
    if (
      Math.abs(prevalenceP_A - 0.001) < 0.002 &&
      Math.abs(sensitivityP_B_given_A - 0.99) < 0.02 &&
      Math.abs(falsePositiveRateP_B_given_notA - 0.01) < 0.02 &&
      !challengeCompleted['bayes_base_rate_shock']
    ) {
      completeChallenge('bayes_base_rate_shock', 40);
      successBuzz();
      playChime();
      confetti({ particleCount: 35, spread: 60 });
      trackEvent('challenge_completed', { challengeId: 'bayes_base_rate_shock' });
    }

    // Challenge 2: 50-50 Balance Point
    if (
      Math.abs(posteriorProb - 0.50) < 0.03 &&
      !challengeCompleted['bayes_fifty_fifty']
    ) {
      completeChallenge('bayes_fifty_fifty', 40);
      successBuzz();
      playChime();
      confetti({ particleCount: 40, spread: 65 });
      trackEvent('challenge_completed', { challengeId: 'bayes_fifty_fifty' });
    }

    // Challenge 3: High Prior Confirmatory Test (>80% posterior)
    if (prevalenceP_A >= 0.25 && posteriorProb >= 0.85 && !challengeCompleted['bayes_high_confidence']) {
      completeChallenge('bayes_high_confidence', 40);
      successBuzz();
      playChime();
      confetti({ particleCount: 45, spread: 70 });
      trackEvent('challenge_completed', { challengeId: 'bayes_high_confidence' });
    }
  }, [
    prevalenceP_A,
    sensitivityP_B_given_A,
    falsePositiveRateP_B_given_notA,
    posteriorProb,
    challengeCompleted,
    completeChallenge,
    successBuzz,
    playChime,
    trackEvent,
  ]);

  const challengeLevels: ChallengeLevel[] = [
    {
      levelNumber: 1,
      title: 'The 99% Accuracy Trap (Base Rate Fallacy)',
      badge: 'Base Rate Buster',
      description: 'Set Prevalence to 0.1% (0.001), Sensitivity to 99%, and False Positive Rate to 1%. Witness why a positive test yields only ~9% probability of disease!',
      requirementFormula: 'P(D|+) = \\frac{0.99 \\times 0.001}{(0.99 \\times 0.001) + (0.01 \\times 0.999)} \\approx 9.0\\%',
      targetCriteria: 'Set Prevalence to 0.001, Sensitivity 0.99, FPR 0.01',
      xpReward: 40,
      tier1Hint: 'Set Prevalence slider to 0.001 (0.1%).',
      tier2Hint: 'Set Sensitivity to 0.99 (99%) and False Positive to 0.01 (1%).',
      tier3Hint: 'Notice that 10 false alarms easily outnumber 1 true sick patient!',
      autoPreset: () => {
        updateBayesProbabilityParams({
          prevalenceP_A: 0.001,
          sensitivityP_B_given_A: 0.99,
          falsePositiveRateP_B_given_notA: 0.01,
        });
      },
    },
    {
      levelNumber: 2,
      title: 'The 50/50 Coin Flip Parity',
      badge: 'Parity Seeker',
      description: 'Adjust the Prevalence until True Positives equal False Positives, making P(Sick | +) exactly 50%!',
      requirementFormula: 'P(D|+) = 0.50 \\iff \\text{True Positives} = \\text{False Positives}',
      targetCriteria: 'Achieve posterior probability of exactly 50%',
      xpReward: 40,
      tier1Hint: 'Equal numbers of True Positives and False Positives mean a positive test is as uncertain as a coin toss!',
      tier2Hint: 'Try setting Prevalence around 5% with 5% False Positive Rate.',
      tier3Hint: 'Watch the posterior probability indicator hit 50.0%.',
      autoPreset: () => {
        updateBayesProbabilityParams({
          prevalenceP_A: 0.05,
          sensitivityP_B_given_A: 0.95,
          falsePositiveRateP_B_given_notA: 0.05,
        });
      },
    },
    {
      levelNumber: 3,
      title: 'Confirmatory Test Surge (Posterior > 85%)',
      badge: 'Bayesian Master',
      description: 'Simulate a second test by setting Prior Prevalence to 28%. Observe the updated posterior surge past 85%!',
      requirementFormula: 'P(D|++) = \\frac{0.95 \\times 0.28}{(0.95 \\times 0.28) + (0.05 \\times 0.72)} \\approx 88.1\\%',
      targetCriteria: 'Set Prevalence to 0.28 to simulate confirmatory test',
      xpReward: 50,
      tier1Hint: 'In Bayesian updating, the posterior of test 1 becomes the prior of test 2!',
      tier2Hint: 'Set Prevalence to 0.28 (28%).',
      tier3Hint: 'Notice how the posterior skyrockets to > 88%!',
      autoPreset: () => {
        updateBayesProbabilityParams({
          prevalenceP_A: 0.28,
          sensitivityP_B_given_A: 0.95,
          falsePositiveRateP_B_given_notA: 0.05,
        });
      },
    },
  ];

  // Visual grid dots (100 sample cells representing the 1,000 population, each dot = 10 people)
  const dots = useMemo(() => {
    const list: { type: 'TP' | 'FP' | 'TN' | 'FN' }[] = [];
    const scale = N / 100;
    const nTP = Math.round(truePositives / scale);
    const nFN = Math.round(falseNegatives / scale);
    const nFP = Math.round(falsePositives / scale);
    const nTN = 100 - (nTP + nFN + nFP);

    for (let i = 0; i < nTP; i++) list.push({ type: 'TP' });
    for (let i = 0; i < nFN; i++) list.push({ type: 'FN' });
    for (let i = 0; i < nFP; i++) list.push({ type: 'FP' });
    for (let i = 0; i < Math.max(0, nTN); i++) list.push({ type: 'TN' });
    return list.slice(0, 100);
  }, [truePositives, falseNegatives, falsePositives, N]);

  return (
    <div className="w-full h-full flex flex-col relative select-none">
      {/* Center Interactive Simulator Stage */}
      <div className="w-full flex-1 flex flex-col items-center justify-center p-2 sm:p-4 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden relative">
        {/* Real-time Math HUD Banner */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none z-10 px-2">
          <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-700/80 px-2.5 py-1 rounded-xl shadow-lg backdrop-blur-md">
            <Users className="w-4 h-4 text-cyan-400" />
            <span className="text-[11px] font-mono font-bold text-cyan-300">
              Bayes: P(A|B) = [P(B|A)P(A)] / P(B)
            </span>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 px-2.5 py-1 rounded-xl shadow-lg backdrop-blur-md">
            <span className="text-[11px] font-mono text-slate-300">
              Posterior: <strong className="text-emerald-400 font-bold">{(posteriorProb * 100).toFixed(1)}%</strong>
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-[11px] font-mono text-slate-300">
              Prior: <strong className="text-slate-400">{(prevalenceP_A * 100).toFixed(1)}%</strong>
            </span>
          </div>
        </div>

        {/* Visual Stage: Frequency Tree vs Population Matrix */}
        <div className="w-full max-w-lg flex-1 max-h-[60vh] flex flex-col items-center justify-center p-3 bg-slate-950/80 rounded-2xl border border-slate-800 shadow-2xl relative">
          {activeVisualMode === 'frequency-tree' ? (
            /* Frequency Tree Diagram */
            <div className="w-full h-full flex flex-col justify-around text-xs font-mono py-2">
              {/* Root: Total Population */}
              <div className="flex justify-center">
                <div className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-center shadow-lg">
                  <span className="text-slate-400 text-[10px] block">Total Population</span>
                  <strong className="text-white text-sm">{N} Individuals</strong>
                </div>
              </div>

              {/* Branch 1: Sick vs Healthy */}
              <div className="grid grid-cols-2 gap-4 relative">
                {/* Sick Branch */}
                <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/40 text-center">
                  <span className="text-[10px] text-purple-300 block">
                    Sick P(D) = {(prevalenceP_A * 100).toFixed(1)}%
                  </span>
                  <strong className="text-purple-200 text-sm">{countSick} Sick</strong>

                  {/* Sub-branches for Sick */}
                  <div className="grid grid-cols-2 gap-1 mt-2 pt-2 border-t border-purple-500/30 text-[10px]">
                    <div className="bg-emerald-950/50 p-1 rounded border border-emerald-500/30 text-emerald-300">
                      <span>Test + (TP)</span>
                      <strong className="block text-xs text-emerald-400">{truePositives}</strong>
                    </div>
                    <div className="bg-slate-900 p-1 rounded border border-slate-800 text-slate-400">
                      <span>Test - (FN)</span>
                      <strong className="block text-xs">{falseNegatives}</strong>
                    </div>
                  </div>
                </div>

                {/* Healthy Branch */}
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/60 text-center">
                  <span className="text-[10px] text-slate-400 block">
                    Healthy P(D′) = {((1 - prevalenceP_A) * 100).toFixed(1)}%
                  </span>
                  <strong className="text-slate-200 text-sm">{countHealthy} Healthy</strong>

                  {/* Sub-branches for Healthy */}
                  <div className="grid grid-cols-2 gap-1 mt-2 pt-2 border-t border-slate-700/40 text-[10px]">
                    <div className="bg-amber-950/50 p-1 rounded border border-amber-500/40 text-amber-300">
                      <span>Test + (FP)</span>
                      <strong className="block text-xs text-amber-400">{falsePositives}</strong>
                    </div>
                    <div className="bg-slate-900 p-1 rounded border border-slate-800 text-slate-400">
                      <span>Test - (TN)</span>
                      <strong className="block text-xs">{trueNegatives}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Convergence Box: Total Positives */}
              <div className="p-2 rounded-xl bg-slate-900 border border-cyan-500/30 flex items-center justify-between text-[11px]">
                <span className="text-slate-300">
                  Total Positive Tests: <strong className="text-white">{truePositives}</strong> TP +{' '}
                  <strong className="text-amber-400">{falsePositives}</strong> FP ={' '}
                  <strong className="text-cyan-400 font-bold">{totalPositives}</strong>
                </span>
                <span className="text-emerald-400 font-bold">
                  {truePositives} / {totalPositives} = {(posteriorProb * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          ) : (
            /* Population 100-cell Icon Grid */
            <div className="w-full h-full flex flex-col items-center justify-center">
              <span className="text-[10px] text-slate-400 mb-2 font-mono">
                100 Sample Units (Each dot = {N / 100} people)
              </span>

              <div className="grid grid-cols-10 gap-1.5 p-2 bg-slate-900/90 rounded-xl border border-slate-800">
                {dots.map((dot, idx) => (
                  <div
                    key={idx}
                    className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full transition-all ${
                      dot.type === 'TP'
                        ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                        : dot.type === 'FP'
                        ? 'bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.6)]'
                        : dot.type === 'FN'
                        ? 'bg-purple-600/70 border border-purple-400'
                        : 'bg-slate-800 border border-slate-700/60'
                    }`}
                    title={dot.type}
                  />
                ))}
              </div>

              <div className="flex items-center gap-3 mt-3 text-[10px] font-mono">
                <span className="flex items-center gap-1 text-emerald-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                  TP ({truePositives})
                </span>
                <span className="flex items-center gap-1 text-amber-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                  FP ({falsePositives})
                </span>
                <span className="flex items-center gap-1 text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-800 inline-block" />
                  TN ({trueNegatives})
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Live Calculation Ratio Ribbon */}
        <div className="w-full max-w-lg mt-2 grid grid-cols-3 gap-1.5 text-center">
          <div className="p-2 rounded-xl bg-slate-900/90 border border-purple-500/30">
            <span className="text-[9px] uppercase tracking-wider text-slate-400 block">Prior P(D)</span>
            <span className="text-xs sm:text-sm font-bold font-mono text-purple-300">
              {(prevalenceP_A * 100).toFixed(1)}%
            </span>
          </div>

          <div className="p-2 rounded-xl bg-slate-900/90 border border-cyan-500/30">
            <span className="text-[9px] uppercase tracking-wider text-slate-400 block">Total Positives P(+)</span>
            <span className="text-xs sm:text-sm font-bold font-mono text-cyan-300">
              {(totalProbPlus * 100).toFixed(1)}%
            </span>
          </div>

          <div className="p-2 rounded-xl bg-slate-900/90 border border-emerald-500/30">
            <span className="text-[9px] uppercase tracking-wider text-slate-400 block">Posterior P(D | +)</span>
            <span className="text-xs sm:text-sm font-bold font-mono text-emerald-400">
              {(posteriorProb * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Sheet Controls & Right Sidebar Theory */}
      <BottomSheet
        title="Bayes' Theorem Detective"
        quickEquation="P(A|B) = \frac{P(B|A)P(A)}{P(B)}"
        onReset={() => resetParams('bayes-probability-lab')}
        theoryContent={
          <CoachTheoryModule
            simulatorId="bayes-probability-lab"
            extraLiveDetails={
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between text-cyan-400">
                  <span>Natural Frequencies Proof:</span>
                  <span className="font-bold">{truePositives} / {totalPositives}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-slate-950/70 p-1.5 rounded border border-slate-800">
                    <span className="text-slate-400 block">True Positives:</span>
                    <span className="text-emerald-400 font-bold">{truePositives}</span>
                  </div>
                  <div className="bg-slate-950/70 p-1.5 rounded border border-slate-800">
                    <span className="text-slate-400 block">False Alarms:</span>
                    <span className="text-amber-400 font-bold">{falsePositives}</span>
                  </div>
                </div>
              </div>
            }
          />
        }
        challengeContent={
          <ChallengeManager
            simulatorId="bayes-probability-lab"
            simulatorTitle="Bayes' Theorem Detective"
            levels={challengeLevels}
            onTriggerPreset={(lvl: number) => {
              playClick();
              lightTap();
              const target = challengeLevels.find((l) => l.levelNumber === lvl);
              target?.autoPreset?.();
            }}
            isOpenDefault={true}
          />
        }
      >
        <div className="space-y-4 text-xs">
          {/* Visual Mode Selector */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Visual Representation
            </label>
            <div className="grid grid-cols-2 gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => {
                  updateBayesProbabilityParams({ activeVisualMode: 'frequency-tree' });
                  playClick();
                  lightTap();
                }}
                className={`py-1.5 text-[11px] font-semibold rounded-lg transition-all cursor-pointer ${
                  activeVisualMode === 'frequency-tree'
                    ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Frequency Tree
              </button>
              <button
                type="button"
                onClick={() => {
                  updateBayesProbabilityParams({ activeVisualMode: 'population-grid' });
                  playClick();
                  lightTap();
                }}
                className={`py-1.5 text-[11px] font-semibold rounded-lg transition-all cursor-pointer ${
                  activeVisualMode === 'population-grid'
                    ? 'bg-purple-500 text-white shadow-md font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                1,000 Patient Grid
              </button>
            </div>
          </div>

          {/* Prevalence Slider */}
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-purple-400">Disease Prevalence / Base Rate P(A)</span>
              <span className="text-xs font-mono font-bold text-purple-300">
                {(prevalenceP_A * 100).toFixed(1)}%
              </span>
            </div>
            <TouchSlider
              label="Prevalence P(A)"
              value={prevalenceP_A}
              min={0.001}
              max={0.30}
              step={0.005}
              unit=""
              onChange={(val) => updateBayesProbabilityParams({ prevalenceP_A: val })}
            />
          </div>

          {/* Sensitivity Slider */}
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-400">Test Sensitivity P(+ | A)</span>
              <span className="text-xs font-mono font-bold text-emerald-300">
                {(sensitivityP_B_given_A * 100).toFixed(0)}%
              </span>
            </div>
            <TouchSlider
              label="Sensitivity"
              value={sensitivityP_B_given_A}
              min={0.80}
              max={0.99}
              step={0.01}
              unit=""
              onChange={(val) => updateBayesProbabilityParams({ sensitivityP_B_given_A: val })}
            />
          </div>

          {/* False Positive Rate Slider */}
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-400">False Positive Rate P(+ | A′)</span>
              <span className="text-xs font-mono font-bold text-amber-300">
                {(falsePositiveRateP_B_given_notA * 100).toFixed(1)}%
              </span>
            </div>
            <TouchSlider
              label="False Positive Rate"
              value={falsePositiveRateP_B_given_notA}
              min={0.01}
              max={0.20}
              step={0.01}
              unit=""
              onChange={(val) => updateBayesProbabilityParams({ falsePositiveRateP_B_given_notA: val })}
            />
          </div>
        </div>
      </BottomSheet>
    </div>
  );
};
