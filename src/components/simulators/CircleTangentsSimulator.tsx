/**
 * CircleTangentsSimulator.tsx: Class 10 Circle Tangents Lab.
 * Features:
 * - Theorem 10.1: Radius ⟂ Tangent at point of contact (90° right angle marker)
 * - Theorem 10.2: Lengths of two tangents from external point are equal (PA = PB = √(d² - r²))
 * - RHS Congruence proof: ΔOAP ≅ ΔOBP
 * - Supplementary angle property: ∠APB + ∠AOB = 180°
 * - 3 Progressive Board Exam challenges
 */
import React, { useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  Circle, 
  RotateCcw, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  CheckCircle2,
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

export const CircleTangentsSimulator: React.FC = () => {
  const {
    circleTangentsParams,
    updateCircleTangentsParams,
    resetParams,
    completeChallenge,
    challengeCompleted,
    isZenMode,
  } = useSimulatorStore();

  const {
    circleRadius,
    pointDistanceOP,
    angleOffsetDeg,
    showRadiiPerpendicular,
    showCongruentTriangles,
    showCyclicAngleProperty,
  } = circleTangentsParams;

  const { lightTap, successBuzz } = useHaptics();
  const { playClick, playChime } = useSound();
  const { trackEvent } = useAnalytics();

  // Calculations
  const r = circleRadius;
  const d = Math.max(pointDistanceOP, r + 0.5); // External point must be outside circle
  const tangentLength = Math.sqrt(d * d - r * r);

  // Angle theta at center: cos(theta) = r / d
  const thetaRad = Math.acos(r / d);
  const thetaDeg = (thetaRad * 180) / Math.PI;

  const angleAtCenter = 2 * thetaDeg;
  const angleAtExternalPoint = 180 - angleAtCenter;

  const handleReset = () => {
    lightTap();
    playClick();
    resetParams('circle-tangents-lab');
  };

  const challengeLevels: ChallengeLevel[] = [
    {
      levelNumber: 1,
      title: 'CBSE 3-4-5 Classic: r = 3, d = 5',
      badge: 'Tangent Blacksmith',
      description: 'Set radius r = 3 and distance OP = 5. Observe the Pythagorean tangent length PA = PB = 4 cm!',
      requirementFormula: 'L = \\sqrt{5^2 - 3^2} = \\sqrt{25 - 9} = \\sqrt{16} = 4 \\text{ cm}',
      targetCriteria: 'Set circleRadius = 3 and distance OP = 5',
      xpReward: 35,
      tier1Hint: 'Set Circle Radius r to 3.',
      tier2Hint: 'Set Distance OP to 5.',
      tier3Hint: 'In right triangle OAP: OP² = OA² + AP² ⟹ 25 = 9 + AP² ⟹ AP = 4!',
      autoPreset: () => {
        updateCircleTangentsParams({ circleRadius: 3, pointDistanceOP: 5 });
      },
    },
    {
      levelNumber: 2,
      title: 'Supplementary Angles: ∠APB + ∠AOB = 180°',
      badge: 'Angle Detective',
      description: 'Toggle Supplementary Angle Property to verify that the angle between two tangents and radii always sums to 180°!',
      requirementFormula: '\\angle APB + \\angle AOB = 180^\\circ \\quad (\\text{Cyclic Quadrilateral})',
      targetCriteria: 'Enable showCyclicAngleProperty',
      xpReward: 40,
      tier1Hint: 'Toggle "Supplementary Angles Property" on.',
      tier2Hint: 'Notice ∠OAP = 90° and ∠OBP = 90° (sum = 180°).',
      tier3Hint: 'In quadrilateral PAOB, sum of angles is 360°. Since radii add 180°, remaining two angles MUST add to 180°!',
      autoPreset: () => {
        updateCircleTangentsParams({ showCyclicAngleProperty: true });
      },
    },
    {
      levelNumber: 3,
      title: 'Equilateral Tangents: 60° Angle',
      badge: 'Equilateral Master',
      description: 'Adjust distance OP such that the angle between tangents ∠APB = 60° (d = 2r).',
      requirementFormula: '\\sin(\\angle APO) = \\frac{r}{2r} = \\frac{1}{2} \\implies \\angle APO = 30^\\circ \\implies \\angle APB = 60^\\circ',
      targetCriteria: 'Set pointDistanceOP = 2 * circleRadius',
      xpReward: 50,
      tier1Hint: 'Set radius r = 4 and distance OP = 8.',
      tier2Hint: 'When d = 2r, sin(θ/2) = r / 2r = 1/2.',
      tier3Hint: 'This makes ΔPAB an equilateral triangle!',
      autoPreset: () => {
        updateCircleTangentsParams({ circleRadius: 4, pointDistanceOP: 8 });
      },
    },
  ];

  // Challenge checks
  React.useEffect(() => {
    if (!challengeCompleted["level-1"] && circleRadius === 3 && pointDistanceOP === 5) {
      completeChallenge("level-1", 35);
      successBuzz();
      playChime();
      confetti({ particleCount: 40, spread: 60 });
    }
    if (!challengeCompleted["level-2"] && showCyclicAngleProperty) {
      completeChallenge("level-2", 40);
      successBuzz();
      playChime();
      confetti({ particleCount: 50, spread: 70 });
    }
    if (!challengeCompleted["level-3"] && Math.abs(pointDistanceOP - 2 * circleRadius) < 0.1) {
      completeChallenge("level-3", 50);
      successBuzz();
      playChime();
      confetti({ particleCount: 60, spread: 80 });
    }
  }, [circleRadius, pointDistanceOP, showCyclicAngleProperty, challengeCompleted, completeChallenge, successBuzz, playChime]);

  const controlsContent = (
    <div className="space-y-4 text-slate-200">
      <LiveSubstitutionCard
        title="Circle Tangent Length & Normal Invariant"
        badge="Theorem 10.2"
        symbolicLaw="PA = PB = \sqrt{d^2 - r^2}, \quad \angle APB + \angle AOB = 180^\circ"
        substitutedLatex={`PA = \\sqrt{(${d.toFixed(1)})^2 - (${r.toFixed(1)})^2} = \\sqrt{${Math.max(0, d * d - r * r).toFixed(2)}}`}
        evaluatedLatex={`PA = PB = ${tangentLength.toFixed(2)} \\text{ cm}, \\quad \\angle AOB = ${(2 * thetaDeg).toFixed(1)}^\\circ`}
      />

      <div className="space-y-4">
        <TouchSlider
          label="Circle Radius (r)"
          value={circleRadius}
          min={2}
          max={6}
          step={0.5}
          unit=" cm"
          onChange={(val) => updateCircleTangentsParams({ circleRadius: val })}
        />

        <TouchSlider
          label="External Distance (OP = d)"
          value={pointDistanceOP}
          min={circleRadius + 1}
          max={12}
          step={0.5}
          unit=" cm"
          onChange={(val) => updateCircleTangentsParams({ pointDistanceOP: val })}
        />
      </div>

      <div className="space-y-2 pt-2">
        <button
          onClick={() => {
            lightTap();
            updateCircleTangentsParams({ showCongruentTriangles: !showCongruentTriangles });
          }}
          className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all ${
            showCongruentTriangles
              ? 'bg-cyan-500 text-slate-950 border-cyan-400'
              : 'bg-slate-900 border-slate-800 text-slate-300'
          }`}
        >
          <Layers className="w-4 h-4" />
          {showCongruentTriangles ? 'Hide RHS Congruent Triangles' : 'Show RHS Congruence (ΔOAP ≅ ΔOBP)'}
        </button>

        <button
          onClick={() => {
            lightTap();
            updateCircleTangentsParams({ showCyclicAngleProperty: !showCyclicAngleProperty });
          }}
          className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all ${
            showCyclicAngleProperty
              ? 'bg-amber-500 text-slate-950 border-amber-400'
              : 'bg-slate-900 border-slate-800 text-slate-300'
          }`}
        >
          <Circle className="w-4 h-4" />
          {showCyclicAngleProperty ? 'Hide Supplementary Angles' : 'Show Supplementary (∠APB + ∠AOB = 180°)'}
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
            Class 10 • Circles
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-white mt-1 flex items-center gap-2">
            <Compass className="w-6 h-6 text-cyan-400" />
            Circle Tangents & Perpendicular Radii
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
          {/* Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Radius r</span>
              <div className="text-xl font-mono font-bold text-cyan-400">{r} cm</div>
            </div>
            <div className="bg-slate-950/80 p-3 rounded-2xl border border-emerald-900/40 text-center">
              <span className="text-[11px] text-emerald-400 uppercase font-semibold">Tangent PA = PB</span>
              <div className="text-xl font-mono font-bold text-emerald-300">
                {tangentLength.toFixed(2)} cm
              </div>
            </div>
            <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Distance OP (d)</span>
              <div className="text-xl font-mono font-bold text-amber-400">{d} cm</div>
            </div>
          </div>

          {/* SVG Diagram Canvas */}
          <div className="bg-slate-950/80 rounded-2xl p-6 border border-slate-800/80 flex items-center justify-center min-h-[300px]">
            <svg viewBox="-120 -100 280 200" className="w-full max-w-md h-auto">
              {/* Main Circle at (0,0) */}
              <circle cx="0" cy="0" r={r * 15} fill="none" stroke="#06b6d4" strokeWidth="2.5" />
              <circle cx="0" cy="0" r="3" fill="#06b6d4" />
              <text x="-12" y="-6" fill="#06b6d4" fontSize="11" fontWeight="bold">O</text>

              {/* Tangent point A (upper) */}
              {(() => {
                const ax = r * 15 * Math.cos(thetaRad);
                const ay = -r * 15 * Math.sin(thetaRad);
                const bx = r * 15 * Math.cos(thetaRad);
                const by = r * 15 * Math.sin(thetaRad);
                const px = d * 15;
                const py = 0;

                return (
                  <>
                    {/* Congruent Triangles shading */}
                    {showCongruentTriangles && (
                      <>
                        <polygon
                          points={`0,0 ${ax},${ay} ${px},${py}`}
                          fill="rgba(6, 182, 212, 0.15)"
                          stroke="none"
                        />
                        <polygon
                          points={`0,0 ${bx},${by} ${px},${py}`}
                          fill="rgba(245, 158, 11, 0.15)"
                          stroke="none"
                        />
                      </>
                    )}

                    {/* Radii OA and OB */}
                    <line x1="0" y1="0" x2={ax} y2={ay} stroke="#06b6d4" strokeWidth="2" strokeDasharray="3,3" />
                    <line x1="0" y1="0" x2={bx} y2={by} stroke="#06b6d4" strokeWidth="2" strokeDasharray="3,3" />

                    {/* Tangents PA and PB */}
                    <line x1={px} y1={py} x2={ax} y2={ay} stroke="#10b981" strokeWidth="3" />
                    <line x1={px} y1={py} x2={bx} y2={by} stroke="#10b981" strokeWidth="3" />

                    {/* Centerline OP */}
                    <line x1="0" y1="0" x2={px} y2={py} stroke="#64748b" strokeWidth="1.5" strokeDasharray="4,4" />

                    {/* Contact points A and B */}
                    <circle cx={ax} cy={ay} r="4" fill="#10b981" />
                    <circle cx={bx} cy={by} r="4" fill="#10b981" />
                    <text x={ax - 5} y={ay - 8} fill="#10b981" fontSize="11" fontWeight="bold">A</text>
                    <text x={bx - 5} y={by + 16} fill="#10b981" fontSize="11" fontWeight="bold">B</text>

                    {/* Right Angle Marks at A and B */}
                    <text x={ax + 2} y={ay + 12} fill="#ef4444" fontSize="10" fontWeight="bold">90°</text>
                    <text x={bx + 2} y={by - 4} fill="#ef4444" fontSize="10" fontWeight="bold">90°</text>

                    {/* External Point P */}
                    <circle cx={px} cy={py} r="5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
                    <text x={px + 8} y={py + 4} fill="#f59e0b" fontSize="12" fontWeight="bold">P</text>
                  </>
                );
              })()}
            </svg>
          </div>

          {/* Supplementary Angle Bar */}
          {showCyclicAngleProperty && (
            <div className="bg-amber-950/30 border border-amber-800/40 rounded-xl p-3.5 space-y-1 font-mono text-xs text-amber-200">
              <div className="font-bold flex items-center gap-1.5 text-amber-400">
                <Sparkles className="w-4 h-4" />
                Supplementary Angle Proof:
              </div>
              <div>∠APB = <strong className="text-white">{angleAtExternalPoint.toFixed(1)}°</strong>, ∠AOB = <strong className="text-white">{angleAtCenter.toFixed(1)}°</strong></div>
              <div className="text-emerald-400 font-bold">Sum = {angleAtExternalPoint.toFixed(1)}° + {angleAtCenter.toFixed(1)}° = 180.0°!</div>
            </div>
          )}
        </div>

      <BottomSheet
        title="Circle Tangents Lab"
        onReset={handleReset}
        theoryContent={<CoachTheoryModule simulatorId="circle-tangents-lab" />}
        challengeContent={
          <ChallengeManager
            simulatorId="circle-tangents-lab"
            simulatorTitle="Circle Tangents Lab"
            levels={challengeLevels}
          />
        }
      >
        {controlsContent}
      </BottomSheet>
    </div>
  );
};
