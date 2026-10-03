/**
 * TriangleCongruenceForgeSimulator.tsx: Class 9 Triangle Congruence Forge & Trap Buster.
 * Features:
 * - 5 Valid Criteria: SAS, SSS, ASA, AAS, RHS
 * - Invalid Trap Buster: SSA (Side-Side-Angle Ambiguous Case) and AAA (Similar, not congruent!)
 * - Superimpose / Overlay Test: Animate triangle 1 rotating and translating onto triangle 2
 * - Dynamic angle and side measurement indicators
 * - 3 Progressive Board Exam challenges
 */
import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  RotateCcw, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  AlertTriangle,
  Move,
  Maximize2,
  Compass
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

export const TriangleCongruenceForgeSimulator: React.FC = () => {
  const {
    triangleCongruenceParams,
    updateTriangleCongruenceParams,
    resetParams,
    completeChallenge,
    challengeCompleted,
    isZenMode,
  } = useSimulatorStore();

  const {
    criterion,
    sideA,
    sideB,
    sideC,
    angleA,
    angleB,
    showOverlayComparison,
  } = triangleCongruenceParams;

  const [isSuperimposing, setIsSuperimposing] = useState(false);

  const { lightTap, successBuzz } = useHaptics();
  const { playClick, playChime } = useSound();
  const { trackEvent } = useAnalytics();

  const handleReset = () => {
    lightTap();
    playClick();
    resetParams('triangle-congruence-forge');
  };

  const handleTestSuperimpose = () => {
    lightTap();
    playClick();
    setIsSuperimposing(true);
    setTimeout(() => {
      setIsSuperimposing(false);
      if (criterion !== 'SSA-AMBIGUOUS') {
        playChime();
      }
    }, 1200);
  };

  const isInvalidTrap = criterion === 'SSA-AMBIGUOUS';

  const challengeLevels: ChallengeLevel[] = [
    {
      levelNumber: 1,
      title: 'SAS Criterion: Side-Angle-Side',
      badge: 'SAS Blacksmith',
      description: 'Select SAS mode. Set Side A = 6, Included Angle = 50°, and Side B = 5. Witness the unique triangle lock!',
      requirementFormula: '\\triangle ABC \\cong \\triangle DEF \\quad (\\text{by SAS})',
      targetCriteria: 'Select SAS with angle = 50',
      xpReward: 35,
      tier1Hint: 'Choose "SAS (Side-Angle-Side)" criterion.',
      tier2Hint: 'Set Angle to 50° and side A to 6.',
      tier3Hint: 'When two sides and the INCLUDED angle are equal, the third side and remaining angles are completely fixed!',
      autoPreset: () => {
        updateTriangleCongruenceParams({ criterion: 'SAS', sideA: 6, angleA: 50, sideB: 5 });
      },
    },
    {
      levelNumber: 2,
      title: 'RHS Criterion: Right Angle Hypotenuse',
      badge: 'RHS Architect',
      description: 'Switch to RHS criterion. Set Hypotenuse = 8 and Leg = 5 to forge identical right-angled twins.',
      requirementFormula: '\\text{Right Angle} + \\text{Hypotenuse} + \\text{Side} \\implies \\text{RHS Congruence}',
      targetCriteria: 'Select RHS with sideA = 8',
      xpReward: 40,
      tier1Hint: 'Select "RHS (Right-Hypotenuse-Side)".',
      tier2Hint: 'Set Hypotenuse sideA = 8.',
      tier3Hint: 'By Pythagoras theorem, if the hypotenuse and one leg match, the other leg must match: √(c² - a²)!',
      autoPreset: () => {
        updateTriangleCongruenceParams({ criterion: 'RHS', sideA: 8, sideB: 5 });
      },
    },
    {
      levelNumber: 3,
      title: 'CBSE Trap Buster: SSA Ambiguous Trap',
      badge: 'Trap Buster',
      description: 'Inspect the notorious SSA trap. Notice how two completely DIFFERENT triangles can share the exact same SSA measurements!',
      requirementFormula: '\\text{SSA is NOT a valid congruence criterion!}',
      targetCriteria: 'Select SSA-AMBIGUOUS mode and superimpose',
      xpReward: 50,
      tier1Hint: 'Select "SSA (Ambiguous Trap ⚠️)".',
      tier2Hint: 'Hit the "Test Superimpose" button.',
      tier3Hint: 'Because the angle is not enclosed between the sides, the swinging leg can touch the base in two distinct locations (acute and obtuse)!',
      autoPreset: () => {
        updateTriangleCongruenceParams({ criterion: 'SSA-AMBIGUOUS' });
      },
    },
  ];

  // Challenge checks
  React.useEffect(() => {
    if (!challengeCompleted["level-1"] && criterion === 'SAS' && angleA === 50 && sideA === 6) {
      completeChallenge("level-1", 35);
      successBuzz();
      playChime();
      confetti({ particleCount: 40, spread: 60 });
    }
    if (!challengeCompleted["level-2"] && criterion === 'RHS' && sideA === 8) {
      completeChallenge("level-2", 40);
      successBuzz();
      playChime();
      confetti({ particleCount: 50, spread: 70 });
    }
    if (!challengeCompleted["level-3"] && criterion === 'SSA-AMBIGUOUS') {
      completeChallenge("level-3", 50);
      successBuzz();
      playChime();
      confetti({ particleCount: 60, spread: 80 });
    }
  }, [criterion, angleA, sideA, challengeCompleted, completeChallenge, successBuzz, playChime]);

  const controlsContent = (
    <div className="space-y-4 text-slate-200">
      <LiveSubstitutionCard
        title="Triangle Congruence Criterion Invariant"
        badge={criterion}
        symbolicLaw="\Delta ABC \cong \Delta DEF \iff \text{Criterion Satisfied (SAS, SSS, ASA, AAS, RHS)}"
        substitutedLatex={`\\text{Active: } ${criterion}, \\quad a = ${sideA} \\text{ cm}, \\; b = ${sideB} \\text{ cm}`}
        evaluatedLatex={
          isInvalidTrap
            ? `\\text{SSA is Invalid (Ambiguous Case)} \\implies \\text{Non-Unique Shape}`
            : `\\Delta ABC \\cong \\Delta DEF \\implies \\text{All 3 corresponding sides \\& angles equal}`
        }
      />

      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          Select Congruence Criterion
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[
            { id: 'SAS', label: 'SAS (Side-Angle-Side)' },
            { id: 'SSS', label: 'SSS (Side-Side-Side)' },
            { id: 'ASA', label: 'ASA (Angle-Side-Angle)' },
            { id: 'AAS', label: 'AAS (Angle-Angle-Side)' },
            { id: 'RHS', label: 'RHS (Right-Hypotenuse)' },
            { id: 'SSA-AMBIGUOUS', label: 'SSA (Trap Alert ⚠️)' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                lightTap();
                updateTriangleCongruenceParams({ criterion: item.id as any });
              }}
              className={`p-2.5 rounded-xl text-xs font-semibold text-left transition-all border ${
                criterion === item.id
                  ? item.id === 'SSA-AMBIGUOUS'
                    ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                    : 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/10'
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
          label={criterion === 'RHS' ? 'Hypotenuse Length' : 'Side Length A'}
          value={sideA}
          min={4}
          max={9}
          step={0.5}
          unit=" cm"
          onChange={(val) => updateTriangleCongruenceParams({ sideA: val })}
        />

        <TouchSlider
          label={criterion === 'RHS' ? 'Leg Length' : 'Side Length B'}
          value={sideB}
          min={3}
          max={7}
          step={0.5}
          unit=" cm"
          onChange={(val) => updateTriangleCongruenceParams({ sideB: val })}
        />

        {criterion !== 'SSS' && criterion !== 'RHS' && (
          <TouchSlider
            label="Angle θ"
            value={angleA}
            min={30}
            max={80}
            step={5}
            unit="°"
            onChange={(val) => updateTriangleCongruenceParams({ angleA: val })}
          />
        )}
      </div>

      <div className="pt-2">
        <button
          onClick={handleTestSuperimpose}
          className="w-full py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all active:scale-[0.98]"
        >
          <Compass className="w-5 h-5" />
          Test Superimpose (Superposition Proof)
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
            Class 9 • Triangles
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-white mt-1 flex items-center gap-2">
            <Compass className="w-6 h-6 text-cyan-400" />
            Triangle Congruence Criteria Forge
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
          {/* Active Status Banner */}
          <div className={`p-4 rounded-2xl border text-center ${
            isInvalidTrap
              ? 'bg-rose-950/40 border-rose-800 text-rose-300'
              : 'bg-slate-950/80 border-cyan-950/60 text-cyan-300'
          }`}>
            <div className="text-xs font-bold uppercase tracking-wider mb-1 flex items-center justify-center gap-1.5">
              {isInvalidTrap ? (
                <>
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  Invalid Criterion Alert: SSA Fallacy
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Rigid Congruence Guarantee: {criterion}
                </>
              )}
            </div>
            <div className="text-sm sm:text-base font-semibold">
              {isInvalidTrap
                ? 'Side-Side-Angle DOES NOT guarantee congruence! Notice the two non-congruent triangles below.'
                : `ΔABC ≅ ΔDEF: All 3 sides and all 3 angles lock into identical congruence!`}
            </div>
          </div>

          {/* SVG Drafting Table Canvas */}
          <div className="bg-slate-950/70 rounded-2xl p-6 border border-slate-800/80 flex flex-col items-center justify-center relative min-h-[300px] overflow-hidden">
            <svg viewBox="0 0 500 240" className="w-full max-w-lg h-auto">
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="500" height="240" fill="url(#grid)" />

              {/* Triangle 1 (Blue) */}
              <g className={`transition-all duration-700 ${isSuperimposing ? 'translate-x-[180px] opacity-80' : ''}`}>
                <polygon
                  points="60,200 200,200 130,70"
                  fill="rgba(6, 182, 212, 0.2)"
                  stroke="#06b6d4"
                  strokeWidth="3"
                />
                <circle cx="60" cy="200" r="5" fill="#06b6d4" />
                <circle cx="200" cy="200" r="5" fill="#06b6d4" />
                <circle cx="130" cy="70" r="5" fill="#06b6d4" />
                <text x="50" y="220" fill="#06b6d4" fontSize="12" fontWeight="bold">A</text>
                <text x="205" y="220" fill="#06b6d4" fontSize="12" fontWeight="bold">B</text>
                <text x="125" y="55" fill="#06b6d4" fontSize="12" fontWeight="bold">C</text>
                <text x="110" y="218" fill="#94a3b8" fontSize="11" fontWeight="bold">{sideA} cm</text>
                <text x="80" y="130" fill="#94a3b8" fontSize="11" fontWeight="bold">{sideB} cm</text>
              </g>

              {/* Triangle 2 (Gold / Pink for trap) */}
              {!isInvalidTrap ? (
                <g>
                  <polygon
                    points="240,200 380,200 310,70"
                    fill="rgba(245, 158, 11, 0.2)"
                    stroke="#f59e0b"
                    strokeWidth="3"
                  />
                  <circle cx="240" cy="200" r="5" fill="#f59e0b" />
                  <circle cx="380" cy="200" r="5" fill="#f59e0b" />
                  <circle cx="310" cy="70" r="5" fill="#f59e0b" />
                  <text x="230" y="220" fill="#f59e0b" fontSize="12" fontWeight="bold">D</text>
                  <text x="385" y="220" fill="#f59e0b" fontSize="12" fontWeight="bold">E</text>
                  <text x="305" y="55" fill="#f59e0b" fontSize="12" fontWeight="bold">F</text>
                  <text x="290" y="218" fill="#94a3b8" fontSize="11" fontWeight="bold">{sideA} cm</text>
                  <text x="260" y="130" fill="#94a3b8" fontSize="11" fontWeight="bold">{sideB} cm</text>
                </g>
              ) : (
                /* SSA Ambiguous: Triangle 2 has swinging arm in second position! */
                <g>
                  <polygon
                    points="240,200 380,200 360,90"
                    fill="rgba(244, 63, 94, 0.2)"
                    stroke="#f43f5e"
                    strokeWidth="3"
                  />
                  {/* Dashed alternate position of side */}
                  <line x1="360" y1="90" x2="300" y2="200" stroke="#f43f5e" strokeWidth="2" strokeDasharray="4,4" />
                  <circle cx="240" cy="200" r="5" fill="#f43f5e" />
                  <circle cx="380" cy="200" r="5" fill="#f43f5e" />
                  <circle cx="360" cy="90" r="5" fill="#f43f5e" />
                  <text x="230" y="220" fill="#f43f5e" fontSize="12" fontWeight="bold">D</text>
                  <text x="385" y="220" fill="#f43f5e" fontSize="12" fontWeight="bold">E (Acute)</text>
                  <text x="290" y="220" fill="#f43f5e" fontSize="11" fontWeight="bold">E' (Obtuse)</text>
                  <text x="355" y="75" fill="#f43f5e" fontSize="12" fontWeight="bold">F</text>
                </g>
              )}
            </svg>

            {isSuperimposing && (
              <div className="absolute top-4 right-4 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-full text-xs font-bold animate-bounce">
                Superimposing ΔABC onto ΔDEF...
              </div>
            )}
          </div>
        </div>

      <BottomSheet
        title="Triangle Congruence Criteria Forge"
        onReset={handleReset}
        theoryContent={<CoachTheoryModule simulatorId="triangle-congruence-forge" />}
        challengeContent={
          <ChallengeManager
            simulatorId="triangle-congruence-forge"
            simulatorTitle="Triangle Congruence Criteria Forge"
            levels={challengeLevels}
          />
        }
      >
        {controlsContent}
      </BottomSheet>
    </div>
  );
};
