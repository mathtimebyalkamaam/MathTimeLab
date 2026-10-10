/**
 * ExponentsPowersSimulator.tsx: Class 8 Exponents & Powers Lab.
 * Features:
 * - Interactive visual factor expansion: a^m × a^n, (a^m)^n, a^m ÷ a^n
 * - Negative exponent flipper: a^(-n) = 1 / a^n visual reciprocal elevator
 * - Zero exponent trap buster: why a^0 = 1 (not 0!)
 * - Cosmic Scale scientific notation slider: from atomic 10^-10 m to galaxy 10^21 m
 * - 3 Progressive Board Exam challenges
 */
import React, { useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  Zap, 
  RotateCcw, 
  Sparkles, 
  Layers, 
  Divide, 
  HelpCircle,
  Telescope,
  Atom,
  Flame,
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
import { Eli13ExplainerCard } from '../common/Eli13ExplainerCard';

export const ExponentsPowersSimulator: React.FC = () => {
  const {
    exponentsParams,
    updateExponentsParams,
    resetParams,
    completeChallenge,
    challengeCompleted,
    isZenMode,
  } = useSimulatorStore();

  const {
    baseA,
    exponentM,
    exponentN,
    ruleMode,
    microscopeZoomPower,
  } = exponentsParams;

  const { lightTap, successBuzz } = useHaptics();
  const { playClick, playChime } = useSound();
  const { trackEvent } = useAnalytics();

  // Calculations for various laws
  const productResult = Math.pow(baseA, exponentM + exponentN);
  const quotientResult = Math.pow(baseA, exponentM - exponentN);
  const powerOfPowerResult = Math.pow(baseA, exponentM * exponentN);
  const negativeResult = Math.pow(baseA, -Math.abs(exponentN));

  const handleReset = () => {
    lightTap();
    playClick();
    resetParams('exponents-powers-lab');
  };

  // Cosmic scale examples
  const cosmicObjects = useMemo(() => [
    { power: -15, label: 'Proton Radius', size: '10⁻¹⁵ m', icon: Atom, desc: 'Subatomic quark world' },
    { power: -10, label: 'Hydrogen Atom', size: '10⁻¹⁰ m', icon: Atom, desc: 'Angstrom chemistry scale' },
    { power: -6, label: 'Red Blood Cell', size: '10⁻⁶ m', icon: Atom, desc: 'Microscopic biology scale' },
    { power: 0, label: 'Human Height', size: '10⁰ m (1 m)', icon: Sparkles, desc: 'Everyday human macroscopic scale' },
    { power: 3, label: 'Mount Everest', size: '10³ m (km)', icon: Sparkles, desc: 'Geographic altitude' },
    { power: 7, label: 'Earth Diameter', size: '10⁷ m', icon: Telescope, desc: 'Planetary scale' },
    { power: 11, label: 'Sun-Earth Distance', size: '10¹¹ m (1 AU)', icon: Telescope, desc: 'Astronomical unit' },
    { power: 16, label: '1 Light Year', size: '10¹⁶ m', icon: Telescope, desc: 'Interstellar expanse' },
    { power: 21, label: 'Milky Way Galaxy', size: '10²¹ m', icon: Telescope, desc: 'Galactic diameter' },
  ], []);

  const closestCosmic = useMemo(() => {
    return cosmicObjects.reduce((prev, curr) => 
      Math.abs(curr.power - microscopeZoomPower) < Math.abs(prev.power - microscopeZoomPower) ? curr : prev
    );
  }, [cosmicObjects, microscopeZoomPower]);

  const challengeLevels: ChallengeLevel[] = [
    {
      levelNumber: 1,
      title: 'Product of Powers: 2³ × 2⁴',
      badge: 'Index Adder',
      description: 'Set base = 2, m = 3, n = 4 in Product mode. Witness repeated factors combine into 2⁷ = 128!',
      requirementFormula: 'a^m \\times a^n = a^{m+n} \\implies 2^3 \\times 2^4 = 2^7 = 128',
      targetCriteria: 'Set baseA=2, m=3, n=4 in product mode',
      xpReward: 35,
      tier1Hint: 'Select "Product Rule (aᵐ × aⁿ)".',
      tier2Hint: 'Set Base = 2, Exponent m = 3, and Exponent n = 4.',
      tier3Hint: '3 twos multiplied by 4 twos equals (3 + 4) = 7 twos multiplied together!',
      autoPreset: () => {
        updateExponentsParams({ ruleMode: 'product', baseA: 2, exponentM: 3, exponentN: 4 });
      },
    },
    {
      levelNumber: 2,
      title: 'The Negative Exponent Elevator: 3⁻²',
      badge: 'Reciprocal Master',
      description: 'Switch to Negative Exponent mode. Set base = 3 and power = -2. See 3⁻² flip into 1 / 3² = 1/9!',
      requirementFormula: 'a^{-n} = \\frac{1}{a^n} \\implies 3^{-2} = \\frac{1}{3^2} = \\frac{1}{9}',
      targetCriteria: 'Set baseA=3, n=2 in negative-exponent mode',
      xpReward: 45,
      tier1Hint: 'Choose "Negative Exponent (a⁻ⁿ)" mode.',
      tier2Hint: 'Set Base = 3 and exponent n = 2.',
      tier3Hint: 'Negative exponent does NOT make the number negative; it sends the base to the denominator!',
      autoPreset: () => {
        updateExponentsParams({ ruleMode: 'negative-exponent', baseA: 3, exponentN: 2 });
      },
    },
    {
      levelNumber: 3,
      title: 'Cosmic Scientific Notation: Milky Way',
      badge: 'Cosmic Astronomer',
      description: 'Slide the Scientific Notation zoom power to 10²¹ to measure the diameter of our Milky Way Galaxy!',
      requirementFormula: '1.0 \\times 10^{21} \\text{ meters}',
      targetCriteria: 'Set zoom power = 21 in scientific-notation mode',
      xpReward: 50,
      tier1Hint: 'Switch mode to "Scientific Notation (Cosmic Scale)".',
      tier2Hint: 'Drag the Cosmic Scale slider up to +21.',
      tier3Hint: 'Scientific notation compresses 21 zeros into a neat, readable compact exponent!',
      autoPreset: () => {
        updateExponentsParams({ ruleMode: 'scientific-notation', microscopeZoomPower: 21 });
      },
    },
  ];

  // Evaluate challenges
  React.useEffect(() => {
    if (!challengeCompleted["level-1"] && ruleMode === 'product' && baseA === 2 && exponentM === 3 && exponentN === 4) {
      completeChallenge("level-1", 35);
      successBuzz();
      playChime();
      confetti({ particleCount: 40, spread: 60 });
    }
    if (!challengeCompleted["level-2"] && ruleMode === 'negative-exponent' && baseA === 3 && exponentN === 2) {
      completeChallenge("level-2", 45);
      successBuzz();
      playChime();
      confetti({ particleCount: 50, spread: 70 });
    }
    if (!challengeCompleted["level-3"] && ruleMode === 'scientific-notation' && microscopeZoomPower === 21) {
      completeChallenge("level-3", 50);
      successBuzz();
      playChime();
      confetti({ particleCount: 60, spread: 80 });
    }
  }, [ruleMode, baseA, exponentM, exponentN, microscopeZoomPower, challengeCompleted, completeChallenge, successBuzz, playChime]);

  const controlsContent = (
    <div className="space-y-2 p-2 sm:p-2.5 text-slate-200">
      {/* Rule Mode Selector */}
      <div className="space-y-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block flex items-center gap-1">
          <Layers className="w-3 h-3 text-cyan-400" />
          <span>Laws of Exponents</span>
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
          {[
            { id: 'product', label: 'aᵐ × aⁿ = aᵐ⁺ⁿ' },
            { id: 'quotient', label: 'aᵐ ÷ aⁿ = aᵐ⁻ⁿ' },
            { id: 'power-of-power', label: '(aᵐ)ⁿ = aᵐⁿ' },
            { id: 'negative-exponent', label: 'a⁻ⁿ = 1 / aⁿ' },
            { id: 'zero-exponent', label: 'a⁰ = 1 (Trap)' },
            { id: 'scientific-notation', label: '10ⁿ (Cosmic)' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                lightTap();
                updateExponentsParams({ ruleMode: item.id as any });
              }}
              className={`p-1.5 rounded-lg text-xs font-semibold text-left transition-all border cursor-pointer ${
                ruleMode === item.id
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-sm'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <div className="font-bold text-[11px] truncate">{item.label}</div>
            </button>
          ))}
        </div>
      </div>

      {ruleMode !== 'scientific-notation' && (
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-2">
          <div className="cockpit-slider-grid grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-0.5">
            <TouchSlider
              compact={true}
              label="Base a"
              value={baseA}
              min={2}
              max={6}
              step={1}
              unit=""
              onChange={(val) => updateExponentsParams({ baseA: val })}
            />

            {ruleMode !== 'negative-exponent' && ruleMode !== 'zero-exponent' && (
              <TouchSlider
                compact={true}
                label="Exponent m"
                value={exponentM}
                min={1}
                max={5}
                step={1}
                unit=""
                onChange={(val) => updateExponentsParams({ exponentM: val })}
              />
            )}

            {ruleMode !== 'zero-exponent' && (
              <TouchSlider
                compact={true}
                label={ruleMode === 'negative-exponent' ? 'Power |-n|' : 'Exponent n'}
                value={exponentN}
                min={1}
                max={5}
                step={1}
                unit=""
                onChange={(val) => updateExponentsParams({ exponentN: val })}
              />
            )}
          </div>
        </div>
      )}

      {ruleMode === 'scientific-notation' && (
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-2">
          <TouchSlider
            compact={true}
            label="Scale Power (10ⁿ)"
            value={microscopeZoomPower}
            min={-15}
            max={21}
            step={1}
            unit=" powers"
            onChange={(val) => updateExponentsParams({ microscopeZoomPower: val })}
          />
        </div>
      )}

      <Eli13ExplainerCard simulatorId="exponents-powers-lab" defaultExpanded={false} />

      <button
        type="button"
        onClick={() => {
          lightTap();
          resetParams('exponents-powers-lab');
        }}
        className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl bg-slate-800/70 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition border border-slate-700/60 cursor-pointer"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Reset Laws & Parameters</span>
      </button>
    </div>
  );

  return (
    <div className="relative w-full h-full flex flex-col flex-1 select-none overflow-hidden bg-slate-950">
      {/* Main Interactive Stage */}
      <div className="relative flex-1 w-full min-h-0 flex flex-col items-center justify-center p-2 sm:p-4 overflow-hidden">
        <div className="w-full max-w-xl bg-slate-900/70 border border-slate-800/80 rounded-2xl p-3 sm:p-4 backdrop-blur-sm shadow-xl space-y-2.5">
          {/* Main Visual Formula Bar */}
          <div className="bg-slate-950/80 rounded-2xl p-4 border border-cyan-950/60 text-center">
            <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">
              Active Law Formula
            </div>
            {ruleMode === 'product' && (
              <div className="text-xl sm:text-2xl font-mono text-cyan-300 font-bold">
                {baseA}<sup>{exponentM}</sup> × {baseA}<sup>{exponentN}</sup> = {baseA}<sup>{exponentM} + {exponentN}</sup> = {baseA}<sup>{exponentM + exponentN}</sup> = <span className="text-emerald-400 font-black">{productResult.toLocaleString()}</span>
              </div>
            )}
            {ruleMode === 'quotient' && (
              <div className="text-xl sm:text-2xl font-mono text-cyan-300 font-bold">
                {baseA}<sup>{exponentM}</sup> ÷ {baseA}<sup>{exponentN}</sup> = {baseA}<sup>{exponentM} - {exponentN}</sup> = {baseA}<sup>{exponentM - exponentN}</sup> = <span className="text-emerald-400 font-black">{quotientResult}</span>
              </div>
            )}
            {ruleMode === 'power-of-power' && (
              <div className="text-xl sm:text-2xl font-mono text-cyan-300 font-bold">
                ({baseA}<sup>{exponentM}</sup>)<sup>{exponentN}</sup> = {baseA}<sup>{exponentM} × {exponentN}</sup> = {baseA}<sup>{exponentM * exponentN}</sup> = <span className="text-emerald-400 font-black">{powerOfPowerResult.toLocaleString()}</span>
              </div>
            )}
            {ruleMode === 'negative-exponent' && (
              <div className="text-xl sm:text-2xl font-mono text-amber-300 font-bold">
                {baseA}<sup>-{exponentN}</sup> = <span className="text-white">1 / {baseA}<sup>{exponentN}</sup></span> = <span className="text-emerald-400 font-black">1 / {Math.pow(baseA, exponentN)}</span> ({negativeResult.toFixed(4)})
              </div>
            )}
            {ruleMode === 'zero-exponent' && (
              <div className="text-xl sm:text-2xl font-mono text-emerald-300 font-bold">
                {baseA}<sup>0</sup> = <span className="text-cyan-300">{baseA}¹ ÷ {baseA}¹</span> = {baseA} / {baseA} = <span className="text-amber-400 font-black">1</span>
              </div>
            )}
            {ruleMode === 'scientific-notation' && (
              <div className="text-xl sm:text-2xl font-mono text-cyan-300 font-bold">
                1.0 × 10<sup>{microscopeZoomPower}</sup> meters
              </div>
            )}
          </div>

          {/* Visual Factor Tiles Container */}
          {ruleMode === 'product' && (
            <div className="bg-slate-950/50 rounded-2xl p-5 border border-slate-800/80 space-y-4">
              <div className="text-xs font-semibold text-slate-400 flex items-center justify-between">
                <span>Repeated Multiplication Blocks:</span>
                <span className="text-cyan-400 font-mono font-bold">{exponentM + exponentN} total factors</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {/* m factors */}
                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-cyan-950/40 border border-cyan-800/40">
                  {Array.from({ length: exponentM }).map((_, i) => (
                    <span key={`m-${i}`} className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/60 flex items-center justify-center font-mono font-bold text-cyan-300 text-sm">
                      {baseA}
                    </span>
                  ))}
                  <span className="text-xs text-cyan-400 ml-1 font-semibold font-mono">({exponentM})</span>
                </div>
                <span className="text-xl font-bold text-slate-400">×</span>
                {/* n factors */}
                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-indigo-950/40 border border-indigo-800/40">
                  {Array.from({ length: exponentN }).map((_, i) => (
                    <span key={`n-${i}`} className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-400/60 flex items-center justify-center font-mono font-bold text-indigo-300 text-sm">
                      {baseA}
                    </span>
                  ))}
                  <span className="text-xs text-indigo-400 ml-1 font-semibold font-mono">({exponentN})</span>
                </div>
                <span className="text-xl font-bold text-slate-400">=</span>
                {/* Combined */}
                <div className="flex items-center gap-1 p-2 rounded-xl bg-emerald-950/30 border border-emerald-700/40">
                  <span className="text-sm font-mono font-black text-emerald-400">{baseA}<sup>{exponentM + exponentN}</sup></span>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Notice: We did not multiply the base with the base (it is NOT {baseA * baseA}!). The base stays the same, while the count of factors adds together: {exponentM} + {exponentN} = {exponentM + exponentN}.
              </p>
            </div>
          )}

          {ruleMode === 'negative-exponent' && (
            <div className="bg-slate-950/50 rounded-2xl p-5 border border-slate-800/80 space-y-4">
              <div className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>The Reciprocal Elevator Metaphor:</span>
              </div>
              <div className="flex items-center justify-center py-4">
                <div className="text-center space-y-2 bg-slate-900 border border-amber-600/30 rounded-2xl p-4 w-64 shadow-lg">
                  <div className="text-xs text-slate-400 uppercase font-semibold">Numerator</div>
                  <div className="text-xl font-mono font-bold text-slate-100">1</div>
                  <div className="w-full h-0.5 bg-amber-500/60 my-2"></div>
                  <div className="text-xs text-slate-400 uppercase font-semibold">Denominator</div>
                  <div className="text-xl font-mono font-bold text-amber-300">
                    {baseA}<sup>{exponentN}</sup> = {Math.pow(baseA, exponentN)}
                  </div>
                </div>
              </div>
              <div className="bg-amber-950/30 border border-amber-800/40 rounded-xl p-3 text-xs text-amber-300/90 leading-relaxed">
                💡 <strong>Exam Trap Buster:</strong> Students mistakenly write {baseA}<sup>-{exponentN}</sup> = -{Math.pow(baseA, exponentN)}. A negative power NEVER makes a positive base negative! It is a ticket that sends the power from the penthouse (numerator) down to the basement (denominator).
              </div>
            </div>
          )}

          {ruleMode === 'zero-exponent' && (
            <div className="bg-slate-950/50 rounded-2xl p-5 border border-slate-800/80 space-y-4">
              <div className="text-xs font-semibold text-slate-400">
                Why is any non-zero number to the power of 0 equal to 1?
              </div>
              <div className="space-y-2 text-sm font-mono text-slate-300">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between">
                  <span>{baseA}³</span>
                  <span>= {Math.pow(baseA, 3)}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between">
                  <span>{baseA}² (divide by {baseA})</span>
                  <span>= {Math.pow(baseA, 2)}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between">
                  <span>{baseA}¹ (divide by {baseA})</span>
                  <span>= {baseA}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-600/50 text-emerald-300 font-bold flex justify-between">
                  <span>{baseA}⁰ (divide by {baseA})</span>
                  <span>= {baseA} ÷ {baseA} = 1!</span>
                </div>
              </div>
            </div>
          )}

          {ruleMode === 'scientific-notation' && (
            <div className="bg-slate-950/50 rounded-2xl p-5 border border-slate-800/80 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-cyan-950/60 border border-cyan-800/60 text-cyan-400">
                  <closestCosmic.icon className="w-8 h-8" />
                </div>
                <div>
                  <div className="text-xs text-cyan-400 font-semibold uppercase tracking-wider">
                    Cosmic Landmark Object
                  </div>
                  <div className="text-lg font-bold text-white">
                    {closestCosmic.label}
                  </div>
                  <div className="text-xs text-slate-400 font-mono">
                    Order of magnitude: ~{closestCosmic.size} ({closestCosmic.desc})
                  </div>
                </div>
              </div>
              <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-slate-800 relative">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 via-cyan-500 to-amber-500 transition-all duration-300"
                  style={{ width: `${((microscopeZoomPower + 15) / 36) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] font-mono text-slate-500">
                <span>10⁻¹⁵ (Proton)</span>
                <span>10⁰ (1 meter)</span>
                <span>10²¹ (Galaxy)</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <BottomSheet
        title="Exponents & Powers Lab"
        onReset={handleReset}
        theoryContent={<CoachTheoryModule simulatorId="exponents-powers-lab" />}
        challengeContent={
          <ChallengeManager
            simulatorId="exponents-powers-lab"
            simulatorTitle="Exponents & Powers Lab"
            levels={challengeLevels}
          />
        }
      >
        {controlsContent}
      </BottomSheet>
    </div>
  );
};
