/**
 * EuclideanGeometrySimulator.tsx: Interactive Euclid's Axioms & Non-Euclidean Geometry Sandbox (Class 9 Geometry).
 * Features:
 * - Flat Euclidean: Postulate 5 Transversal Sandbox with interactive interior angles α and β proving lines intersect when α + β < 180°
 * - Spherical Globe (Elliptic): Interactive great-circle triangle with three 90° right angles summing to 270° (positive curvature K > 0)
 * - Hyperbolic Saddle: Negative curvature space with triangle angle sum < 180° and infinite parallel lines
 * - Live Angle Sum Meter & Curvature Gauge
 * - 3 Progressive Board Exam challenges
 */
import React, { useEffect, useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  Globe, 
  RotateCcw, 
  CheckCircle2, 
  Compass, 
  Target, 
  Sparkles, 
  Layers, 
  Sliders,
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

export const EuclideanGeometrySimulator: React.FC = () => {
  const {
    euclideanParams,
    updateEuclideanParams,
    resetParams,
    completeChallenge,
    challengeCompleted,
    isZenMode,
  } = useSimulatorStore();

  const {
    geometryModel,
    parallelPostulateAngle1,
    parallelPostulateAngle2,
    triangleVertexLat1,
    triangleVertexLon1,
    triangleVertexLat2,
    triangleVertexLon2,
    triangleVertexLat3,
    triangleVertexLon3,
    showParallelLines,
    showGeodesics,
    showAngleSumMeter,
  } = euclideanParams;

  const { lightTap, successBuzz } = useHaptics();
  const { playClick, playChime } = useSound();
  const { trackEvent } = useAnalytics();

  // Calculations for Flat Euclidean Postulate 5
  const sumInteriorAngles = parallelPostulateAngle1 + parallelPostulateAngle2;
  const isParallel = Math.abs(sumInteriorAngles - 180) < 0.1;
  const willIntersectRight = sumInteriorAngles < 180;

  // Calculate intersection distance x along the horizontal axis
  // If angle1 = 90 - theta1, angle2 = 90 - theta2
  const dBetweenLines = 120; // pixels
  const theta1 = ((90 - parallelPostulateAngle1) * Math.PI) / 180;
  const theta2 = ((parallelPostulateAngle2 - 90) * Math.PI) / 180;
  const denom = Math.tan(theta1) + Math.tan(theta2);
  const intersectDistX = denom !== 0 ? Math.abs(dBetweenLines / denom) : Infinity;

  // Spherical Triangle Calculations
  // Standard globe triangle: North Pole (90°N) to Equator (0°N, 0°E) to (0°N, 90°E)
  const sphereAngleSum = useMemo(() => {
    if (geometryModel === 'spherical-elliptic') {
      return 270; // 3 right angles
    }
    if (geometryModel === 'hyperbolic-saddle') {
      return 145; // angle deficit
    }
    return 180; // flat
  }, [geometryModel]);

  // Challenges evaluation
  useEffect(() => {
    // Challenge 1: The 270° Spherical Triangle
    if (geometryModel === 'spherical-elliptic' && !challengeCompleted['euclid_sphere_270']) {
      completeChallenge('euclid_sphere_270', 40);
      successBuzz();
      playChime();
      confetti({ particleCount: 35, spread: 60 });
      trackEvent('challenge_completed', { challengeId: 'euclid_sphere_270' });
    }

    // Challenge 2: Postulate 5 Exact Parallel (α + β = 180°)
    if (
      geometryModel === 'flat-euclidean' &&
      Math.abs(parallelPostulateAngle1 - 90) < 1 &&
      Math.abs(parallelPostulateAngle2 - 90) < 1 &&
      !challengeCompleted['euclid_exact_parallel']
    ) {
      completeChallenge('euclid_exact_parallel', 40);
      successBuzz();
      playChime();
      confetti({ particleCount: 40, spread: 65 });
      trackEvent('challenge_completed', { challengeId: 'euclid_exact_parallel' });
    }

    // Challenge 3: Hyperbolic Angle Deficit (< 150°)
    if (geometryModel === 'hyperbolic-saddle' && !challengeCompleted['euclid_hyperbolic_deficit']) {
      completeChallenge('euclid_hyperbolic_deficit', 40);
      successBuzz();
      playChime();
      confetti({ particleCount: 45, spread: 70 });
      trackEvent('challenge_completed', { challengeId: 'euclid_hyperbolic_deficit' });
    }
  }, [
    geometryModel,
    parallelPostulateAngle1,
    parallelPostulateAngle2,
    challengeCompleted,
    completeChallenge,
    successBuzz,
    playChime,
    trackEvent,
  ]);

  const challengeLevels: ChallengeLevel[] = [
    {
      levelNumber: 1,
      title: 'The 270° Spherical Triangle',
      badge: 'Curvature Explorer',
      description: 'Switch to Spherical (Globe) model. Observe the triangle formed by the North Pole and two equatorial points with three 90° angles summing to 270°!',
      requirementFormula: '\\sum \\angle = 90^\\circ + 90^\\circ + 90^\\circ = 270^\\circ > 180^\\circ',
      targetCriteria: 'Select Spherical (Globe) model',
      xpReward: 40,
      tier1Hint: 'Tap "Spherical (Globe)" in the Model selector.',
      tier2Hint: 'Notice how each longitude line meets the equator at an exact 90° right angle.',
      tier3Hint: 'Check the Angle Sum Meter displaying 270.0°.',
      autoPreset: () => {
        updateEuclideanParams({ geometryModel: 'spherical-elliptic' });
      },
    },
    {
      levelNumber: 2,
      title: 'Postulate 5 Parallelism (α + β = 180°)',
      badge: 'Euclid Master',
      description: 'Switch to Flat Euclidean model. Set both interior angles α and β to exactly 90° (sum = 180°) so lines remain strictly parallel and never meet!',
      requirementFormula: '\\alpha + \\beta = 90^\\circ + 90^\\circ = 180^\\circ \\implies L_1 \\parallel L_2',
      targetCriteria: 'Set Angle 1 = 90° and Angle 2 = 90°',
      xpReward: 40,
      tier1Hint: 'Select "Flat Euclidean" mode.',
      tier2Hint: 'Move Angle 1 slider to 90° and Angle 2 slider to 90°.',
      tier3Hint: 'Verify the status indicator displays "PARALLEL (Never Intersect)".',
      autoPreset: () => {
        updateEuclideanParams({
          geometryModel: 'flat-euclidean',
          parallelPostulateAngle1: 90,
          parallelPostulateAngle2: 90,
        });
      },
    },
    {
      levelNumber: 3,
      title: 'Hyperbolic Space & Angle Deficit',
      badge: 'Lobachevsky Pioneer',
      description: 'Switch to Hyperbolic (Saddle) model to discover non-Euclidean space where triangles sum to less than 180°!',
      requirementFormula: '\\sum \\angle_{\\text{hyperbolic}} < 180^\\circ',
      targetCriteria: 'Select Hyperbolic (Saddle) model',
      xpReward: 50,
      tier1Hint: 'Select "Hyperbolic (Saddle)" mode.',
      tier2Hint: 'Notice how lines bow inward toward the center.',
      tier3Hint: 'Check that angle sum reads strictly less than 180°.',
      autoPreset: () => {
        updateEuclideanParams({ geometryModel: 'hyperbolic-saddle' });
      },
    },
  ];

  return (
    <div className="w-full h-full flex flex-col relative select-none">
      {/* Center Interactive Canvas */}
      <div className="w-full flex-1 flex flex-col items-center justify-center p-2 sm:p-4 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden relative">
        {/* Real-time Math HUD Banner */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none z-10 px-2">
          <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-700/80 px-2.5 py-1 rounded-xl shadow-lg backdrop-blur-md">
            <Globe className="w-4 h-4 text-cyan-400" />
            <span className="text-[11px] font-mono font-bold text-cyan-300">
              {geometryModel === 'flat-euclidean' && `Flat Space: α + β = ${sumInteriorAngles}°`}
              {geometryModel === 'spherical-elliptic' && 'Spherical Space (K > 0): 3 × 90° = 270°'}
              {geometryModel === 'hyperbolic-saddle' && 'Hyperbolic Space (K < 0): Sum < 180°'}
            </span>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 px-2.5 py-1 rounded-xl shadow-lg backdrop-blur-md">
            <span className="text-[11px] font-mono text-slate-300">
              Angle Sum:{' '}
              <strong
                className={`font-bold ${
                  sphereAngleSum === 180
                    ? 'text-cyan-400'
                    : sphereAngleSum > 180
                    ? 'text-amber-400'
                    : 'text-purple-400'
                }`}
              >
                {sphereAngleSum}°
              </strong>
            </span>
          </div>
        </div>

        {/* Dynamic Canvas / SVG Stage */}
        <div className="w-full max-w-lg aspect-[4/3] max-h-[62vh] relative flex items-center justify-center">
          {geometryModel === 'flat-euclidean' ? (
            /* Flat Euclidean Postulate 5 Transversal SVG */
            <svg viewBox="0 0 400 300" className="w-full h-full drop-shadow-2xl overflow-visible">
              {/* Transversal Line t */}
              <line x1="120" y1="20" x2="120" y2="280" stroke="#f59e0b" strokeWidth="2.5" />
              <text x="105" y="30" fill="#f59e0b" fontSize="12" fontWeight="bold" fontFamily="monospace">
                t
              </text>

              {/* Line 1 (Upper) */}
              <line
                x1="20"
                y1={90 + 100 * Math.tan(((90 - parallelPostulateAngle1) * Math.PI) / 180)}
                x2="380"
                y2={90 - 260 * Math.tan(((90 - parallelPostulateAngle1) * Math.PI) / 180)}
                stroke="#38bdf8"
                strokeWidth="2.5"
              />
              <text x="30" y="80" fill="#38bdf8" fontSize="11" fontWeight="bold" fontFamily="monospace">
                L₁
              </text>

              {/* Line 2 (Lower) */}
              <line
                x1="20"
                y1={210 - 100 * Math.tan(((parallelPostulateAngle2 - 90) * Math.PI) / 180)}
                x2="380"
                y2={210 + 260 * Math.tan(((parallelPostulateAngle2 - 90) * Math.PI) / 180)}
                stroke="#38bdf8"
                strokeWidth="2.5"
              />
              <text x="30" y="225" fill="#38bdf8" fontSize="11" fontWeight="bold" fontFamily="monospace">
                L₂
              </text>

              {/* Interior Angle Arc 1 (Upper Right) */}
              <path
                d="M 120 115 A 25 25 0 0 0 145 90"
                fill="rgba(56, 189, 248, 0.2)"
                stroke="#38bdf8"
                strokeWidth="1.5"
              />
              <text x="130" y="115" fill="#38bdf8" fontSize="11" fontWeight="bold" fontFamily="monospace">
                α = {parallelPostulateAngle1}°
              </text>

              {/* Interior Angle Arc 2 (Lower Right) */}
              <path
                d="M 145 210 A 25 25 0 0 0 120 185"
                fill="rgba(56, 189, 248, 0.2)"
                stroke="#38bdf8"
                strokeWidth="1.5"
              />
              <text x="130" y="200" fill="#38bdf8" fontSize="11" fontWeight="bold" fontFamily="monospace">
                β = {parallelPostulateAngle2}°
              </text>

              {/* Intersection Forecast Indicator */}
              {willIntersectRight ? (
                <g>
                  <circle cx="360" cy="150" r="14" fill="rgba(239, 68, 68, 0.2)" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3 3" />
                  <text x="330" y="180" fill="#f87171" fontSize="9" fontFamily="monospace">
                    Intersect (α+β &lt; 180°)
                  </text>
                </g>
              ) : isParallel ? (
                <text x="240" y="150" fill="#34d399" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  PARALLEL (α+β = 180°)
                </text>
              ) : (
                <text x="240" y="150" fill="#a855f7" fontSize="10" fontFamily="monospace">
                  Diverging (Intersects Left)
                </text>
              )}
            </svg>
          ) : geometryModel === 'spherical-elliptic' ? (
            /* Spherical Globe 3D SVG */
            <svg viewBox="0 0 400 300" className="w-full h-full drop-shadow-2xl overflow-visible">
              <defs>
                <radialGradient id="globeGrad" cx="40%" cy="40%" r="60%">
                  <stop offset="0%" stopColor="#0369a1" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#0f172a" stopOpacity="0.9" />
                </radialGradient>
              </defs>

              {/* Globe Outline */}
              <circle cx="200" cy="150" r="105" fill="url(#globeGrad)" stroke="#38bdf8" strokeWidth="2.5" />

              {/* Equator Ellipse */}
              <ellipse cx="200" cy="150" rx="105" ry="32" fill="none" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4 3" />

              {/* Prime Meridian & 90°E Meridian Arcs */}
              <path d="M 200 45 C 130 90 130 210 200 255" fill="none" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4 3" />
              <path d="M 200 45 C 270 90 270 210 200 255" fill="none" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4 3" />

              {/* Spherical Triangle Fill: North Pole (200, 45) to (140, 160) to (260, 160) */}
              <path
                d="M 200 45 Q 155 105 140 160 Q 200 172 260 160 Q 245 105 200 45 Z"
                fill="rgba(245, 158, 11, 0.3)"
                stroke="#f59e0b"
                strokeWidth="2.5"
              />

              {/* Three 90° Right Angle Marks */}
              {/* Vertex 1: North Pole */}
              <circle cx="200" cy="45" r="5" fill="#f59e0b" />
              <text x="200" y="35" textAnchor="middle" fill="#f59e0b" fontSize="11" fontWeight="bold">
                North Pole (90°)
              </text>

              {/* Vertex 2: Equator at 0° Lon */}
              <circle cx="140" cy="160" r="5" fill="#f59e0b" />
              <text x="100" y="175" fill="#f59e0b" fontSize="10" fontWeight="bold">
                Equator A (90°)
              </text>

              {/* Vertex 3: Equator at 90° E Lon */}
              <circle cx="260" cy="160" r="5" fill="#f59e0b" />
              <text x="268" y="175" fill="#f59e0b" fontSize="10" fontWeight="bold">
                Equator B (90°)
              </text>

              {/* Sum Formula Badge */}
              <rect x="75" y="260" width="250" height="26" rx="8" fill="rgba(15, 23, 42, 0.9)" stroke="#475569" />
              <text x="200" y="277" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="bold" fontFamily="monospace">
                90° + 90° + 90° = 270.0° (K &gt; 0)
              </text>
            </svg>
          ) : (
            /* Hyperbolic Saddle Poincaré Disk */
            <svg viewBox="0 0 400 300" className="w-full h-full drop-shadow-2xl overflow-visible">
              <circle cx="200" cy="150" r="110" fill="rgba(88, 28, 135, 0.15)" stroke="#a855f7" strokeWidth="2.5" />

              {/* Inward Curved Hyperbolic Triangle */}
              <path
                d="M 200 65 Q 215 150 280 205 Q 190 190 120 205 Q 185 150 200 65 Z"
                fill="rgba(168, 85, 247, 0.35)"
                stroke="#c084fc"
                strokeWidth="2.5"
              />

              <circle cx="200" cy="65" r="4.5" fill="#c084fc" />
              <text x="200" y="55" textAnchor="middle" fill="#c084fc" fontSize="10" fontWeight="bold">
                Angle A ≈ 48°
              </text>

              <circle cx="280" cy="205" r="4.5" fill="#c084fc" />
              <text x="290" y="220" fill="#c084fc" fontSize="10" fontWeight="bold">
                B ≈ 48°
              </text>

              <circle cx="120" cy="205" r="4.5" fill="#c084fc" />
              <text x="80" y="220" fill="#c084fc" fontSize="10" fontWeight="bold">
                C ≈ 49°
              </text>

              {/* Hyperbolic Sum Banner */}
              <rect x="75" y="260" width="250" height="26" rx="8" fill="rgba(15, 23, 42, 0.9)" stroke="#475569" />
              <text x="200" y="277" textAnchor="middle" fill="#c084fc" fontSize="11" fontWeight="bold" fontFamily="monospace">
                Sum = 48° + 48° + 49° = 145.0° &lt; 180°
              </text>
            </svg>
          )}
        </div>

        {/* Live Calculation Ratio Ribbon */}
        <div className="w-full max-w-lg mt-2 grid grid-cols-3 gap-1.5 text-center">
          <div className="p-2 rounded-xl bg-slate-900/90 border border-cyan-500/30">
            <span className="text-[9px] uppercase tracking-wider text-slate-400 block">Space Curvature (K)</span>
            <span className="text-xs sm:text-sm font-bold font-mono text-cyan-400">
              {geometryModel === 'flat-euclidean' && 'K = 0 (Flat)'}
              {geometryModel === 'spherical-elliptic' && 'K > 0 (Positive)'}
              {geometryModel === 'hyperbolic-saddle' && 'K < 0 (Negative)'}
            </span>
          </div>

          <div className="p-2 rounded-xl bg-slate-900/90 border border-purple-500/30">
            <span className="text-[9px] uppercase tracking-wider text-slate-400 block">Triangle Angle Sum</span>
            <span className="text-xs sm:text-sm font-bold font-mono text-purple-400">
              {sphereAngleSum}°
            </span>
          </div>

          <div className="p-2 rounded-xl bg-slate-900/90 border border-emerald-500/30">
            <span className="text-[9px] uppercase tracking-wider text-slate-400 block">Parallel Lines Count</span>
            <span className="text-xs sm:text-sm font-bold font-mono text-emerald-400">
              {geometryModel === 'flat-euclidean' && 'Exactly 1 Line'}
              {geometryModel === 'spherical-elliptic' && '0 Lines (None!)'}
              {geometryModel === 'hyperbolic-saddle' && 'Infinite Lines'}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Sheet Controls & Right Sidebar Theory */}
      <BottomSheet
        title="Euclid's Axioms & Non-Euclidean Sandbox"
        quickEquation="\alpha + \beta < 180^\circ \implies L_1 \cap L_2 \neq \emptyset"
        onReset={() => resetParams('euclidean-geometry-sandbox')}
        theoryContent={
          <CoachTheoryModule
            simulatorId="euclidean-geometry-sandbox"
            extraLiveDetails={
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between text-cyan-400">
                  <span>Euclidean Postulate 5:</span>
                  <span className="font-bold">{isParallel ? 'Parallel' : willIntersectRight ? 'Intersect Right' : 'Intersect Left'}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-slate-950/70 p-1.5 rounded border border-slate-800">
                    <span className="text-slate-400 block">Angle Sum:</span>
                    <span className="text-emerald-400 font-bold">{sumInteriorAngles}°</span>
                  </div>
                  <div className="bg-slate-950/70 p-1.5 rounded border border-slate-800">
                    <span className="text-slate-400 block">Intersection Dist:</span>
                    <span className="text-cyan-400 font-bold">
                      {isParallel ? '∞' : `${intersectDistX.toFixed(0)} px`}
                    </span>
                  </div>
                </div>
              </div>
            }
          />
        }
        challengeContent={
          <ChallengeManager
            simulatorId="euclidean-geometry-sandbox"
            simulatorTitle="Non-Euclidean Sandbox"
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
          {/* Geometry Model Switcher */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Universe Geometry Model
            </label>
            <div className="grid grid-cols-3 gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => {
                  updateEuclideanParams({ geometryModel: 'flat-euclidean' });
                  playClick();
                  lightTap();
                }}
                className={`py-1.5 text-[11px] font-semibold rounded-lg transition-all cursor-pointer ${
                  geometryModel === 'flat-euclidean'
                    ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Flat (Euclid)
              </button>
              <button
                type="button"
                onClick={() => {
                  updateEuclideanParams({ geometryModel: 'spherical-elliptic' });
                  playClick();
                  lightTap();
                }}
                className={`py-1.5 text-[11px] font-semibold rounded-lg transition-all cursor-pointer ${
                  geometryModel === 'spherical-elliptic'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Spherical (Globe)
              </button>
              <button
                type="button"
                onClick={() => {
                  updateEuclideanParams({ geometryModel: 'hyperbolic-saddle' });
                  playClick();
                  lightTap();
                }}
                className={`py-1.5 text-[11px] font-semibold rounded-lg transition-all cursor-pointer ${
                  geometryModel === 'hyperbolic-saddle'
                    ? 'bg-purple-500 text-white shadow-md font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Hyperbolic (Saddle)
              </button>
            </div>
          </div>

          {/* Postulate 5 Angle Sliders (Flat mode) */}
          {geometryModel === 'flat-euclidean' && (
            <div className="space-y-3">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-cyan-400">Interior Angle α (Upper)</span>
                  <span className="text-xs font-mono font-bold text-cyan-300">{parallelPostulateAngle1}°</span>
                </div>
                <TouchSlider
                  label="Angle α"
                  value={parallelPostulateAngle1}
                  min={60}
                  max={120}
                  step={1}
                  unit="°"
                  onChange={(val) => updateEuclideanParams({ parallelPostulateAngle1: val })}
                />
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-400">Interior Angle β (Lower)</span>
                  <span className="text-xs font-mono font-bold text-amber-300">{parallelPostulateAngle2}°</span>
                </div>
                <TouchSlider
                  label="Angle β"
                  value={parallelPostulateAngle2}
                  min={60}
                  max={120}
                  step={1}
                  unit="°"
                  onChange={(val) => updateEuclideanParams({ parallelPostulateAngle2: val })}
                />
              </div>
            </div>
          )}

          {/* Model info card */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
            <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Einstein General Relativity Link:</span>
            </span>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Gravity is NOT a force pulling objects down in flat space; mass curves the 4D spacetime fabric into non-Euclidean geometry, causing straightest inertial paths (geodesics) to bend toward planets and stars!
            </p>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
};
