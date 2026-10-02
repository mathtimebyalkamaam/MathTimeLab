/**
 * CoordinateSectionSimulator.tsx: Class 10 Coordinate Geometry Section Formula Lab.
 * Features:
 * - Internal division in ratio m1 : m2 with cross-multiplication visualization
 * - Special Midpoint case (1 : 1 ratio)
 * - External division mode
 * - Triangle Centroid 2:1 median ratio visualizer
 * - 3 Progressive Board Exam challenges
 */
import React, { useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  Crosshair, 
  RotateCcw, 
  Sparkles, 
  Layers, 
  Share2, 
  Maximize2,
  CheckCircle2,
  Triangle
} from 'lucide-react';
import { useSimulatorStore } from '../../store/useSimulatorStore';
import { BottomSheet } from '../layout/BottomSheet';
import { TouchSlider } from '../common/TouchSlider';
import { CoachTheoryModule } from '../common/CoachTheoryModule';
import { ChallengeManager, ChallengeLevel } from '../common/ChallengeManager';
import { useHaptics } from '../../hooks/useHaptics';
import { useSound } from '../common/SoundManager';
import { useAnalytics } from '../../hooks/useAnalytics';

export const CoordinateSectionSimulator: React.FC = () => {
  const {
    coordinateSectionParams,
    updateCoordinateSectionParams,
    resetParams,
    completeChallenge,
    challengeCompleted,
    isZenMode,
  } = useSimulatorStore();

  const {
    pointAx,
    pointAy,
    pointBx,
    pointBy,
    ratioM1,
    ratioM2,
    divisionType,
    showMidpointFormula,
    showCentroidTriangle,
  } = coordinateSectionParams;

  const { lightTap, successBuzz } = useHaptics();
  const { playClick, playChime } = useSound();
  const { trackEvent } = useAnalytics();

  // Section formula calculations
  const divisor = divisionType === 'internal' ? ratioM1 + ratioM2 : ratioM1 - ratioM2;
  const isDivisorZero = Math.abs(divisor) < 0.001;

  const pointPx = isDivisorZero ? 0 : (
    divisionType === 'internal'
      ? (ratioM1 * pointBx + ratioM2 * pointAx) / divisor
      : (ratioM1 * pointBx - ratioM2 * pointAx) / divisor
  );

  const pointPy = isDivisorZero ? 0 : (
    divisionType === 'internal'
      ? (ratioM1 * pointBy + ratioM2 * pointAy) / divisor
      : (ratioM1 * pointBy - ratioM2 * pointAy) / divisor
  );

  // Third point for centroid mode: C(1, 7)
  const pointCx = 1;
  const pointCy = 7;
  const centroidX = (pointAx + pointBx + pointCx) / 3;
  const centroidY = (pointAy + pointBy + pointCy) / 3;

  const handleReset = () => {
    lightTap();
    playClick();
    resetParams('coordinate-section-formula');
  };

  const challengeLevels: ChallengeLevel[] = [
    {
      levelNumber: 1,
      title: 'Find the Midpoint: Ratio 1:1',
      badge: 'Midpoint Navigator',
      description: 'Set ratio m₁ = 1 and m₂ = 1 for A(2, 2) and B(8, 6). Verify P is the midpoint (5, 4)!',
      requirementFormula: 'M = \\left(\\frac{x_1 + x_2}{2}, \\frac{y_1 + y_2}{2}\\right) = (5, 4)',
      targetCriteria: 'Set ratio 1:1 with A(2,2) and B(8,6)',
      xpReward: 35,
      tier1Hint: 'Set A = (2, 2) and B = (8, 6).',
      tier2Hint: 'Set ratio m₁ = 1 and m₂ = 1.',
      tier3Hint: 'Check: (2+8)/2 = 5, (2+6)/2 = 4!',
      autoPreset: () => {
        updateCoordinateSectionParams({
          pointAx: 2,
          pointAy: 2,
          pointBx: 8,
          pointBy: 6,
          ratioM1: 1,
          ratioM2: 1,
          divisionType: 'internal',
        });
      },
    },
    {
      levelNumber: 2,
      title: 'Trisection Point: Ratio 2:1',
      badge: 'Trisection Architect',
      description: 'Set m₁ = 2 and m₂ = 1 to find the trisection point dividing segment AB in a 2:1 ratio.',
      requirementFormula: 'P = \\left(\\frac{2x_2 + 1x_1}{3}, \\frac{2y_2 + 1y_1}{3}\\right)',
      targetCriteria: 'Set m1=2 and m2=1',
      xpReward: 40,
      tier1Hint: 'Slide m₁ to 2 and m₂ to 1.',
      tier2Hint: 'Notice m₁ multiplies point B, while m₂ multiplies point A (cross-multiplication!).',
      tier3Hint: 'Point P is positioned twice as far from A as it is from B.',
      autoPreset: () => {
        updateCoordinateSectionParams({ ratioM1: 2, ratioM2: 1, divisionType: 'internal' });
      },
    },
    {
      levelNumber: 3,
      title: 'Centroid of Triangle: 2:1 Median Balance',
      badge: 'Centroid Master',
      description: 'Toggle Triangle Centroid mode to observe the centroid G balancing the 3 medians in a 2:1 ratio.',
      requirementFormula: 'G = \\left(\\frac{x_1 + x_2 + x_3}{3}, \\frac{y_1 + y_2 + y_3}{3}\\right)',
      targetCriteria: 'Enable showCentroidTriangle',
      xpReward: 50,
      tier1Hint: 'Click "Toggle Triangle Centroid Mode".',
      tier2Hint: 'Inspect point G where the 3 median lines intersect.',
      tier3Hint: 'The centroid divides every median in the internal ratio 2:1 from the vertex!',
      autoPreset: () => {
        updateCoordinateSectionParams({ showCentroidTriangle: true });
      },
    },
  ];

  // Challenge completion triggers
  React.useEffect(() => {
    if (!challengeCompleted["level-1"] && ratioM1 === 1 && ratioM2 === 1 && pointAx === 2 && pointAy === 2 && pointBx === 8 && pointBy === 6) {
      completeChallenge("level-1", 35);
      successBuzz();
      playChime();
      confetti({ particleCount: 40, spread: 60 });
    }
    if (!challengeCompleted["level-2"] && ratioM1 === 2 && ratioM2 === 1 && divisionType === 'internal') {
      completeChallenge("level-2", 40);
      successBuzz();
      playChime();
      confetti({ particleCount: 50, spread: 70 });
    }
    if (!challengeCompleted["level-3"] && showCentroidTriangle) {
      completeChallenge("level-3", 50);
      successBuzz();
      playChime();
      confetti({ particleCount: 60, spread: 80 });
    }
  }, [ratioM1, ratioM2, pointAx, pointAy, pointBx, pointBy, divisionType, showCentroidTriangle, challengeCompleted, completeChallenge, successBuzz, playChime]);

  const controlsContent = (
    <div className="space-y-6 text-slate-200">
      <div className="flex bg-slate-900 p-1 rounded-2xl border border-slate-800">
        <button
          onClick={() => {
            lightTap();
            updateCoordinateSectionParams({ divisionType: 'internal' });
          }}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            divisionType === 'internal' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Internal Division
        </button>
        <button
          onClick={() => {
            lightTap();
            updateCoordinateSectionParams({ divisionType: 'external' });
          }}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            divisionType === 'external' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          External Division
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 space-y-2">
          <span className="text-xs font-bold text-cyan-400 uppercase">Point A (x₁, y₁)</span>
          <TouchSlider
            label="x₁"
            value={pointAx}
            min={-4}
            max={8}
            step={1}
            unit=""
            onChange={(val) => updateCoordinateSectionParams({ pointAx: val })}
          />
          <TouchSlider
            label="y₁"
            value={pointAy}
            min={-4}
            max={8}
            step={1}
            unit=""
            onChange={(val) => updateCoordinateSectionParams({ pointAy: val })}
          />
        </div>

        <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 space-y-2">
          <span className="text-xs font-bold text-amber-400 uppercase">Point B (x₂, y₂)</span>
          <TouchSlider
            label="x₂"
            value={pointBx}
            min={-4}
            max={10}
            step={1}
            unit=""
            onChange={(val) => updateCoordinateSectionParams({ pointBx: val })}
          />
          <TouchSlider
            label="y₂"
            value={pointBy}
            min={-4}
            max={10}
            step={1}
            unit=""
            onChange={(val) => updateCoordinateSectionParams({ pointBy: val })}
          />
        </div>
      </div>

      <div className="space-y-4">
        <TouchSlider
          label="Ratio m₁ (from A)"
          value={ratioM1}
          min={1}
          max={5}
          step={1}
          unit=""
          onChange={(val) => updateCoordinateSectionParams({ ratioM1: val })}
        />

        <TouchSlider
          label="Ratio m₂ (from B)"
          value={ratioM2}
          min={1}
          max={5}
          step={1}
          unit=""
          onChange={(val) => updateCoordinateSectionParams({ ratioM2: val })}
        />
      </div>

      <div className="pt-2">
        <button
          onClick={() => {
            lightTap();
            updateCoordinateSectionParams({ showCentroidTriangle: !showCentroidTriangle });
          }}
          className={`w-full py-3 rounded-2xl font-bold flex items-center justify-center gap-2 border transition-all ${
            showCentroidTriangle
              ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/20'
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          <Triangle className="w-5 h-5" />
          {showCentroidTriangle ? 'Hide Triangle Centroid View' : 'Show Triangle Centroid (2:1 Medians)'}
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
            Class 10 • Coordinate Geometry
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-white mt-1 flex items-center gap-2">
            <Share2 className="w-6 h-6 text-cyan-400" />
            Section Formula & Centroid Lab
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
          {/* Coordinates Header */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">A(x₁, y₁)</span>
              <div className="text-lg font-mono font-bold text-cyan-400">
                ({pointAx}, {pointAy})
              </div>
            </div>
            <div className="bg-slate-950/80 p-3 rounded-2xl border border-emerald-900/40 text-center">
              <span className="text-[11px] text-emerald-400 uppercase font-semibold">Dividing Point P</span>
              <div className="text-lg font-mono font-bold text-emerald-300">
                ({pointPx.toFixed(2)}, {pointPy.toFixed(2)})
              </div>
              <div className="text-[10px] text-slate-400 font-mono">Ratio {ratioM1} : {ratioM2}</div>
            </div>
            <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">B(x₂, y₂)</span>
              <div className="text-lg font-mono font-bold text-amber-400">
                ({pointBx}, {pointBy})
              </div>
            </div>
          </div>

          {/* SVG Cartesian Plane */}
          <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800/80 relative flex items-center justify-center min-h-[300px] overflow-hidden">
            <svg viewBox="-6 -6 20 20" className="w-full max-w-md h-auto transform scale-y-[-1]">
              {/* Grid Lines */}
              {Array.from({ length: 25 }).map((_, i) => (
                <React.Fragment key={i}>
                  <line x1={i - 8} y1="-8" x2={i - 8} y2="14" stroke="rgba(255,255,255,0.05)" strokeWidth="0.05" />
                  <line x1="-8" y1={i - 8} x2="14" y2={i - 8} stroke="rgba(255,255,255,0.05)" strokeWidth="0.05" />
                </React.Fragment>
              ))}

              {/* Axes */}
              <line x1="-8" y1="0" x2="14" y2="0" stroke="rgba(255,255,255,0.3)" strokeWidth="0.1" />
              <line x1="0" y1="-8" x2="0" y2="14" stroke="rgba(255,255,255,0.3)" strokeWidth="0.1" />

              {/* Centroid Mode Triangle */}
              {showCentroidTriangle && (
                <polygon
                  points={`${pointAx},${pointAy} ${pointBx},${pointBy} ${pointCx},${pointCy}`}
                  fill="rgba(16, 185, 129, 0.15)"
                  stroke="#10b981"
                  strokeWidth="0.15"
                />
              )}

              {/* Main Line Segment AB */}
              <line
                x1={pointAx}
                y1={pointAy}
                x2={pointBx}
                y2={pointBy}
                stroke="#06b6d4"
                strokeWidth="0.2"
              />

              {/* Point A */}
              <circle cx={pointAx} cy={pointAy} r="0.4" fill="#06b6d4" />

              {/* Point B */}
              <circle cx={pointBx} cy={pointBy} r="0.4" fill="#f59e0b" />

              {/* Dividing Point P */}
              <circle cx={pointPx} cy={pointPy} r="0.5" fill="#10b981" stroke="#ffffff" strokeWidth="0.1" />

              {/* Centroid Point G */}
              {showCentroidTriangle && (
                <circle cx={centroidX} cy={centroidY} r="0.5" fill="#8b5cf6" stroke="#ffffff" strokeWidth="0.1" />
              )}
            </svg>
          </div>

          {/* Formula Cross-Multiplication Explainer */}
          <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Topper Secret: The "Cross-Multiplication" Rule
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-mono">
              m₁ ({ratioM1}) multiplies B's coordinates ({pointBx}, {pointBy}), while m₂ ({ratioM2}) multiplies A's coordinates ({pointAx}, {pointAy}).
              <br />
              x = [{ratioM1}×{pointBx} + {ratioM2}×{pointAx}] / ({ratioM1} + {ratioM2}) = <span className="text-emerald-400 font-bold">{pointPx.toFixed(2)}</span>
            </p>
          </div>
        </div>

      <BottomSheet
        title="Section Formula & Centroid Lab"
        onReset={handleReset}
        theoryContent={<CoachTheoryModule simulatorId="coordinate-section-formula" />}
        challengeContent={
          <ChallengeManager
            simulatorId="coordinate-section-formula"
            simulatorTitle="Section Formula & Centroid Lab"
            levels={challengeLevels}
          />
        }
      >
        {controlsContent}
      </BottomSheet>
    </div>
  );
};
