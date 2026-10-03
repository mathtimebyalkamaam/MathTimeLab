/**
 * CompoundInterestSimulator.tsx: Comparing Quantities & Compound Interest Vault (Class 8 Arithmetic).
 * Features:
 * - Dynamic comparative visualizer: Linear Simple Interest vs Exponential Compound Interest
 * - Stacked bar growth staircase revealing the glowing "Interest on Interest" sliver
 * - Multi-frequency compounding switcher: Annually, Half-Yearly, Quarterly
 * - Real-time step-by-step formula breakdown matching CBSE/ICSE exam marking schemes
 * - 3 Progressive Board Exam challenges
 */
import React, { useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  TrendingUp, 
  RotateCcw, 
  CheckCircle2, 
  Calendar, 
  Sparkles, 
  Percent, 
  Sliders,
  DollarSign,
  ArrowUpRight,
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
import { LiveSubstitutionCard } from '../common/LiveSubstitutionCard';

export const CompoundInterestSimulator: React.FC = () => {
  const {
    compoundInterestParams,
    updateCompoundInterestParams,
    resetParams,
    completeChallenge,
    challengeCompleted,
    isZenMode,
  } = useSimulatorStore();

  const {
    principal,
    ratePct,
    timeYears,
    frequency,
    showComparisonBars,
    showGrowthStaircase,
    highlightInterestOnInterest,
  } = compoundInterestParams;

  const { lightTap, successBuzz } = useHaptics();
  const { playClick, playChime } = useSound();
  const { trackEvent } = useAnalytics();

  // Mathematical Calculations
  const freqMultiplier = frequency === 'quarterly' ? 4 : frequency === 'half-yearly' ? 2 : 1;
  const periodicRate = ratePct / freqMultiplier;
  const totalPeriods = timeYears * freqMultiplier;

  // Simple Interest
  const simpleInterest = (principal * ratePct * timeYears) / 100;
  const simpleTotalAmount = principal + simpleInterest;

  // Compound Interest
  const compoundTotalAmount = principal * Math.pow(1 + periodicRate / 100, totalPeriods);
  const compoundInterest = compoundTotalAmount - principal;
  const interestDifference = compoundInterest - simpleInterest;

  // Year-by-year trajectory for the growth chart
  const yearlyData = useMemo(() => {
    const data = [];
    for (let yr = 1; yr <= Math.min(10, timeYears); yr++) {
      const periods = yr * freqMultiplier;
      const si = (principal * ratePct * yr) / 100;
      const ciAmount = principal * Math.pow(1 + periodicRate / 100, periods);
      const ci = ciAmount - principal;
      const interestOnInterest = Math.max(0, ci - si);
      data.push({
        year: yr,
        si,
        ci,
        totalAmount: ciAmount,
        interestOnInterest,
      });
    }
    return data;
  }, [principal, ratePct, timeYears, freqMultiplier, periodicRate]);

  const handleReset = () => {
    lightTap();
    playClick();
    resetParams('compound-interest-engine');
  };

  // Challenges for Board Exam mastery
  const challengeLevels: ChallengeLevel[] = [
    {
      levelNumber: 1,
      title: 'CBSE Classic: ₹10,000 at 10% for 2 Years',
      badge: 'Interest Calculator',
      description: 'Find CI on ₹10,000 at 10% annually for 2 years. See why CI is ₹2,100 (exactly ₹100 more than SI)!',
      requirementFormula: 'A = 10000\\left(1 + \\frac{10}{100}\\right)^2 = 12100, \\quad \\text{CI} = 2100',
      targetCriteria: 'Set P = 10000, R = 10%, T = 2, Annually',
      xpReward: 30,
      tier1Hint: 'Set Principal = ₹10,000, Rate = 10%, Time = 2 years, Frequency = Annually.',
      tier2Hint: 'A = 10000 × (11/10)² = 10000 × 1.21 = ₹12,100.',
      tier3Hint: 'CI = 12,100 - 10,000 = ₹2,100. SI is ₹2,000.',
      autoPreset: () => {
        updateCompoundInterestParams({
          principal: 10000,
          ratePct: 10,
          timeYears: 2,
          frequency: 'annually',
        });
      },
    },
    {
      levelNumber: 2,
      title: 'Semi-Annual Compounding: ₹8,000 at 10% for 1.5 Years',
      badge: 'Half-Year Master',
      description: 'Switch to Half-Yearly. At 10% p.a., periodic rate is 5% for 3 periods. Observe Amount locks to ₹9,261!',
      requirementFormula: 'A = 8000\\left(1 + \\frac{5}{100}\\right)^3 = 8000 \\times \\frac{9261}{8000} = ₹9,261',
      targetCriteria: 'Set P = 8000, R = 10%, T = 1.5 (or 2), Half-Yearly',
      xpReward: 40,
      tier1Hint: 'Select "Half-Yearly" compounding frequency.',
      tier2Hint: 'Notice how rate halves (10% → 5%) and periods double (n → 2n).',
      tier3Hint: 'Check that CI = ₹1,261!',
      autoPreset: () => {
        updateCompoundInterestParams({
          principal: 8000,
          ratePct: 10,
          timeYears: 2,
          frequency: 'half-yearly',
        });
      },
    },
    {
      levelNumber: 3,
      title: 'Snowball Effect: 5-Year High Rate (15%)',
      badge: 'Wealth Compounder',
      description: 'Set P = ₹20,000 at 15% for 5 years. Observe how the purple "Interest on Interest" sliver exceeds ₹5,000 alone!',
      requirementFormula: '\\text{Interest on Interest} = \\text{CI} - \\text{SI} > ₹5,000',
      targetCriteria: 'Set P = 20000, R = 15%, T = 5 years',
      xpReward: 50,
      tier1Hint: 'Set P = 20,000, Rate = 15%, Time = 5 years.',
      tier2Hint: 'Simple Interest would only earn ₹15,000.',
      tier3Hint: 'Watch Compound Interest reach over ₹20,227, producing over ₹5,200 of free bonus growth!',
      autoPreset: () => {
        updateCompoundInterestParams({
          principal: 20000,
          ratePct: 15,
          timeYears: 5,
          frequency: 'annually',
        });
      },
    },
  ];

  // Auto verify challenges
  React.useEffect(() => {
    if (principal === 10000 && ratePct === 10 && timeYears === 2 && frequency === 'annually') {
      if (!challengeCompleted['compound-interest-engine-1']) {
        successBuzz();
        playChime();
        confetti({ particleCount: 35, spread: 60, origin: { y: 0.6 } });
        completeChallenge('compound-interest-engine-1', 30);
      }
    }
    if (principal === 8000 && ratePct === 10 && frequency === 'half-yearly') {
      if (!challengeCompleted['compound-interest-engine-2']) {
        successBuzz();
        playChime();
        confetti({ particleCount: 40, spread: 65, origin: { y: 0.6 } });
        completeChallenge('compound-interest-engine-2', 40);
      }
    }
    if (principal === 20000 && ratePct === 15 && timeYears === 5) {
      if (!challengeCompleted['compound-interest-engine-3']) {
        successBuzz();
        playChime();
        confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
        completeChallenge('compound-interest-engine-3', 50);
      }
    }
  }, [principal, ratePct, timeYears, frequency, challengeCompleted, completeChallenge, playChime, successBuzz]);

  const controlsContent = (
    <div className="space-y-4 p-4 text-slate-200">
      <LiveSubstitutionCard
        title="Exponential Compounding Law"
        badge={frequency.toUpperCase()}
        symbolicLaw="A = P\left(1 + \frac{r/k}{100}\right)^{k \cdot t}, \quad CI = A - P"
        substitutedLatex={`A = ${principal}\\left(1 + \\frac{${periodicRate.toFixed(1)}}{100}\\right)^{${totalPeriods}}`}
        evaluatedLatex={`A = ₹${compoundTotalAmount.toFixed(2)}, \\quad CI = ₹${compoundInterest.toFixed(2)} \\; (SI = ₹${simpleInterest.toFixed(2)})`}
      />

      {/* Frequency Toggle */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Compounding Frequency (Conversion Period)
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'annually', label: 'Annually', sub: 'Once a year (R, n)' },
            { id: 'half-yearly', label: 'Half-Yearly', sub: 'Every 6 mos (R/2, 2n)' },
            { id: 'quarterly', label: 'Quarterly', sub: 'Every 3 mos (R/4, 4n)' },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => {
                lightTap();
                playClick();
                updateCompoundInterestParams({ frequency: f.id as any });
                trackEvent('compound_interest_freq', { freq: f.id });
              }}
              className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                frequency === f.id
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200 shadow-sm'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <div className="text-xs font-bold">{f.label}</div>
              <div className="text-[9px] font-mono text-slate-500 mt-0.5">{f.sub}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Sliders */}
      <div className="space-y-3 bg-slate-900/70 border border-slate-800 rounded-2xl p-3.5">
        <TouchSlider
          label="Principal Investment P (₹)"
          value={principal}
          min={1000}
          max={50000}
          step={1000}
          onChange={(val) => updateCompoundInterestParams({ principal: val })}
        />
        <TouchSlider
          label="Annual Interest Rate R (% p.a.)"
          value={ratePct}
          min={1}
          max={25}
          step={1}
          onChange={(val) => updateCompoundInterestParams({ ratePct: val })}
        />
        <TouchSlider
          label="Time Horizon T (Years)"
          value={timeYears}
          min={1}
          max={10}
          step={1}
          onChange={(val) => updateCompoundInterestParams({ timeYears: val })}
        />
      </div>

      {/* Textbook Presets Scratchpad */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 space-y-2.5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
          <BookOpen className="w-4 h-4" />
          <span>Class 8 Textbook Problems Scratchpad</span>
        </h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {[
            { label: '₹10,000 @ 10% (3 yrs)', p: 10000, r: 10, t: 3, freq: 'annually' as const },
            { label: '₹5,000 @ 12% (2 yrs)', p: 5000, r: 12, t: 2, freq: 'annually' as const },
            { label: '₹8,000 @ 10% Half-Yearly (1 yr)', p: 8000, r: 10, t: 1, freq: 'half-yearly' as const },
            { label: '₹20,000 @ 8% Quarterly (2 yrs)', p: 20000, r: 8, t: 2, freq: 'quarterly' as const },
          ].map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                lightTap();
                playClick();
                updateCompoundInterestParams({
                  principal: preset.p,
                  ratePct: preset.r,
                  timeYears: preset.t,
                  frequency: preset.freq,
                });
              }}
              className="p-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-950 border border-slate-800 hover:border-emerald-500/40 text-slate-300 hover:text-white font-mono text-[11px] text-left transition cursor-pointer"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Explain Like I'm 13 Card */}
      <Eli13ExplainerCard simulatorId="compound-interest-engine" />

      <button
        type="button"
        onClick={handleReset}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/70 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition border border-slate-700/60 cursor-pointer"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Reset to Default (₹10,000 @ 10% for 3 yrs)</span>
      </button>
    </div>
  );

  return (
    <div className="relative w-full h-full flex flex-col flex-1 select-none overflow-hidden bg-slate-950">
      {/* Visual Growth Canvas */}
      <div className="relative flex-1 w-full min-h-[360px] flex flex-col items-center justify-center p-3 sm:p-6 overflow-hidden">
        {/* KPI Vault Metrics Cards */}
        <div className="w-full max-w-xl grid grid-cols-3 gap-2 mb-3">
          <div className="p-2.5 sm:p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block">
              Simple Interest (SI)
            </span>
            <span className="text-sm sm:text-lg font-mono font-bold text-sky-400">
              ₹{Math.round(simpleInterest).toLocaleString()}
            </span>
            <span className="text-[9px] text-slate-500 font-mono block">
              Linear (No Compounding)
            </span>
          </div>

          <div className="p-2.5 sm:p-3 rounded-2xl bg-emerald-950/30 border border-emerald-800/60 text-center">
            <span className="text-[10px] text-emerald-400 uppercase font-mono tracking-wider block">
              Compound Interest (CI)
            </span>
            <span className="text-sm sm:text-lg font-mono font-bold text-emerald-300">
              ₹{Math.round(compoundInterest).toLocaleString()}
            </span>
            <span className="text-[9px] text-emerald-500/80 font-mono block">
              Total Amount: ₹{Math.round(compoundTotalAmount).toLocaleString()}
            </span>
          </div>

          <div className="p-2.5 sm:p-3 rounded-2xl bg-purple-950/30 border border-purple-800/60 text-center">
            <span className="text-[10px] text-purple-400 uppercase font-mono tracking-wider block">
              Interest on Interest (CI - SI)
            </span>
            <span className="text-sm sm:text-lg font-mono font-bold text-purple-300">
              +₹{Math.round(interestDifference).toLocaleString()}
            </span>
            <span className="text-[9px] text-purple-400/80 font-mono block">
              Compound Bonus!
            </span>
          </div>
        </div>

        {/* Growth Staircase SVG Chart */}
        <div className="w-full max-w-xl h-60 sm:h-64 flex items-center justify-center bg-slate-900/40 rounded-2xl border border-slate-800/60 p-2">
          <svg viewBox="0 0 460 210" className="w-full h-full drop-shadow-xl overflow-visible">
            {/* Axis grid lines */}
            <line x1="45" y1="180" x2="440" y2="180" stroke="#334155" strokeWidth="1.5" />
            <line x1="45" y1="20" x2="45" y2="180" stroke="#334155" strokeWidth="1.5" />

            {/* Max height scaling */}
            {(() => {
              const maxAmt = Math.max(compoundTotalAmount, principal * 1.5);
              const barWidth = Math.min(28, 360 / (yearlyData.length * 1.5));
              const spacing = (440 - 65) / yearlyData.length;

              return (
                <g>
                  {yearlyData.map((d, i) => {
                    const x = 65 + i * spacing;
                    // Heights relative to chart height (150px)
                    const baseH = (principal / maxAmt) * 140;
                    const siH = (d.si / maxAmt) * 140;
                    const bonusH = (d.interestOnInterest / maxAmt) * 140;

                    const pY = 180 - baseH;
                    const siY = pY - siH;
                    const ciY = siY - bonusH;

                    return (
                      <g key={`yr-${d.year}`}>
                        {/* Principal Base Block */}
                        <rect
                          x={x - barWidth / 2}
                          y={pY}
                          width={barWidth}
                          height={baseH}
                          fill="#334155"
                          rx="2"
                        />
                        {/* Simple Interest Block */}
                        <rect
                          x={x - barWidth / 2}
                          y={siY}
                          width={barWidth}
                          height={siH}
                          fill="#0284c7"
                          rx="2"
                        />
                        {/* Interest on Interest (Glowing Purple Block) */}
                        <rect
                          x={x - barWidth / 2}
                          y={ciY}
                          width={barWidth}
                          height={bonusH}
                          fill="#a855f7"
                          rx="2"
                          className="animate-pulse"
                        />

                        {/* Year Label */}
                        <text
                          x={x}
                          y="196"
                          fill="#94a3b8"
                          fontSize="9"
                          fontFamily="monospace"
                          textAnchor="middle"
                        >
                          Yr {d.year}
                        </text>
                      </g>
                    );
                  })}

                  {/* Exponential Curve overlay connecting tops */}
                  <path
                    d={`M ${yearlyData.map((d, i) => {
                      const x = 65 + i * spacing;
                      const ciY = 180 - (d.totalAmount / maxAmt) * 140;
                      return `${i === 0 ? 'M' : 'L'} ${x} ${ciY}`;
                    }).join(' ')}`}
                    fill="none"
                    stroke="#c084fc"
                    strokeWidth="2.5"
                    strokeDasharray="4 2"
                  />
                </g>
              );
            })()}

            {/* Legend */}
            <g transform="translate(65, 12)">
              <rect x="0" y="0" width="10" height="10" fill="#334155" rx="1" />
              <text x="14" y="9" fill="#94a3b8" fontSize="9" fontFamily="monospace">Principal</text>

              <rect x="90" y="0" width="10" height="10" fill="#0284c7" rx="1" />
              <text x="104" y="9" fill="#38bdf8" fontSize="9" fontFamily="monospace">Simple Interest</text>

              <rect x="210" y="0" width="10" height="10" fill="#a855f7" rx="1" />
              <text x="224" y="9" fill="#c084fc" fontSize="9" fontFamily="monospace">Interest on Interest</text>
            </g>
          </svg>
        </div>

        {/* Intuition Footer Pill */}
        <div className="mt-2 text-center text-xs font-mono text-slate-400">
          Formula: A = P(1 + r/100)ⁿ · CI = A - P · Half-Yearly: r/2% for 2n periods
        </div>
      </div>

      <BottomSheet
        title="Compound Interest Engine"
        onReset={handleReset}
        theoryContent={<CoachTheoryModule simulatorId="compound-interest-engine" />}
        challengeContent={
          <ChallengeManager
            simulatorId="compound-interest-engine"
            simulatorTitle="Compound Interest Engine"
            levels={challengeLevels}
          />
        }
      >
        {controlsContent}
      </BottomSheet>
    </div>
  );
};
