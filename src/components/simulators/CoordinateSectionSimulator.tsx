/**
 * CoordinateSectionSimulator.tsx: Class 10 Coordinate Geometry Section Formula Lab.
 * Features:
 * - Internal division in ratio m1 : m2 with cross-multiplication visualization
 * - Special Midpoint case (1 : 1 ratio)
 * - External division mode
 * - Triangle Centroid 2:1 median ratio visualizer
 * - 3 Progressive Board Exam challenges
 */
import React, { useMemo, useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Crosshair, 
  RotateCcw, 
  Sparkles, 
  Layers, 
  Share2, 
  Maximize2,
  CheckCircle2,
  Triangle,
  Sliders,
  Undo2,
  Redo2,
  FileText,
  Columns
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
import { InvariantLockBadge } from '../common/InvariantLockBadge';
import { InlineMath } from '../common/MathFormula';
import { useSnapshotHistory } from '../../hooks/useSnapshotHistory';
import { ExamCheatSheetModal } from '../common/ExamCheatSheetModal';
import { DualViewInspectorModal } from '../common/DualViewInspectorModal';

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
  const { playClick, playChime, playPitchTone } = useSound();
  const { trackEvent } = useAnalytics();

  // Recommendations 11-15 state
  const [showCheatSheet, setShowCheatSheet] = useState<boolean>(false);
  const [showDualView, setShowDualView] = useState<boolean>(false);

  // Recommendation 14: Time-Travel Parameter History
  const { takeSnapshot, undo, redo, canUndo, canRedo } = useSnapshotHistory(
    { pointAx, pointAy, pointBx, pointBy, ratioM1, ratioM2, divisionType, showCentroidTriangle },
    (restored) => {
      updateCoordinateSectionParams(restored);
      playPitchTone(restored.ratioM1 / (restored.ratioM1 + restored.ratioM2), 220, 700);
    }
  );

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
    <div className="space-y-4 text-slate-200">
      <LiveSubstitutionCard
        title="Section Formula Invariant"
        badge={divisionType === 'internal' ? 'Internal Ratio' : 'External Ratio'}
        symbolicLaw="P(x, y) = \left(\frac{m_1 x_2 \pm m_2 x_1}{m_1 \pm m_2}, \frac{m_1 y_2 \pm m_2 y_1}{m_1 \pm m_2}\right)"
        substitutedLatex={`P = \\left(\\frac{(${ratioM1})(${pointBx}) ${divisionType === 'internal' ? '+' : '-'} (${ratioM2})(${pointAx})}{${ratioM1} ${divisionType === 'internal' ? '+' : '-'} ${ratioM2}}, \\frac{(${ratioM1})(${pointBy}) ${divisionType === 'internal' ? '+' : '-'} (${ratioM2})(${pointAy})}{${ratioM1} ${divisionType === 'internal' ? '+' : '-'} ${ratioM2}}\\right)`}
        evaluatedLatex={`P(x, y) = (${pointPx.toFixed(2)}, ${pointPy.toFixed(2)}) \\quad [m_1:m_2 = ${ratioM1}:${ratioM2}]`}
      />

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

      {/* Point 8: Invariant Locking Badge & Point 10: 1-Tap Canonical Presets Bar */}
      <div className="w-full max-w-4xl mx-auto mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <InvariantLockBadge
          label="Section Formula Invariant"
          invariantLatex="P = \left(\frac{m_1 x_2 \pm m_2 x_1}{m_1 \pm m_2}, \frac{m_1 y_2 \pm m_2 y_1}{m_1 \pm m_2}\right)"
          currentValue={`P(${pointPx.toFixed(2)}, ${pointPy.toFixed(2)})`}
          status="locked"
        />

        <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-700/80 shadow-lg overflow-x-auto no-scrollbar max-w-full">
          {/* Time-Travel Undo / Redo */}
          <div className="flex items-center gap-0.5 border-r border-slate-700/80 pr-1.5 mr-0.5">
            <button
              type="button"
              onClick={undo}
              disabled={!canUndo}
              title="Undo Parameter Change"
              className={`p-1 rounded-lg text-[10px] transition-all cursor-pointer ${
                canUndo ? 'bg-slate-800 text-cyan-300 hover:bg-slate-700' : 'text-slate-600 opacity-40 cursor-not-allowed'
              }`}
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={redo}
              disabled={!canRedo}
              title="Redo Parameter Change"
              className={`p-1 rounded-lg text-[10px] transition-all cursor-pointer ${
                canRedo ? 'bg-slate-800 text-cyan-300 hover:bg-slate-700' : 'text-slate-600 opacity-40 cursor-not-allowed'
              }`}
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 5-Mark Proof Cheatsheet Button */}
          <button
            type="button"
            onClick={() => {
              setShowCheatSheet(true);
              lightTap();
              playClick();
            }}
            className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold border border-amber-500/50 bg-amber-950/40 text-amber-300 hover:bg-amber-900/50 transition-all cursor-pointer shrink-0 flex items-center gap-1"
          >
            <FileText className="w-3 h-3 text-amber-400" />
            5-Mark Proof
          </button>

          {/* Dual View Button */}
          <button
            type="button"
            onClick={() => {
              setShowDualView(true);
              lightTap();
              playClick();
            }}
            className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold border border-emerald-500/50 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/50 transition-all cursor-pointer shrink-0 flex items-center gap-1"
          >
            <Columns className="w-3 h-3 text-emerald-400" />
            Dual View
          </button>

          <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider px-1.5 flex items-center gap-1 border-l border-slate-700/80 pl-1.5">
            <Sliders className="w-3 h-3 text-cyan-400" />
            Presets:
          </span>
          {[
            { label: 'Midpoint (1:1)', m1: 1, m2: 1, ax: 2, ay: 2, bx: 8, by: 6, mode: 'internal' as const, centroid: false },
            { label: 'Trisection (2:1)', m1: 2, m2: 1, ax: 0, ay: 0, bx: 6, by: 6, mode: 'internal' as const, centroid: false },
            { label: 'Ratio 3:2', m1: 3, m2: 2, ax: 1, ay: 1, bx: 6, by: 6, mode: 'internal' as const, centroid: false },
            { label: 'External (3:1)', m1: 3, m2: 1, ax: 2, ay: 2, bx: 6, by: 4, mode: 'external' as const, centroid: false },
            { label: 'Centroid 2:1', m1: 2, m2: 1, ax: 2, ay: 2, bx: 8, by: 6, mode: 'internal' as const, centroid: true },
          ].map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                takeSnapshot({
                  ratioM1: p.m1,
                  ratioM2: p.m2,
                  pointAx: p.ax,
                  pointAy: p.ay,
                  pointBx: p.bx,
                  pointBy: p.by,
                  divisionType: p.mode,
                  showCentroidTriangle: p.centroid,
                }, p.label);
                updateCoordinateSectionParams({
                  ratioM1: p.m1,
                  ratioM2: p.m2,
                  pointAx: p.ax,
                  pointAy: p.ay,
                  pointBx: p.bx,
                  pointBy: p.by,
                  divisionType: p.mode,
                  showCentroidTriangle: p.centroid,
                });
                lightTap();
                playClick();
              }}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold border transition-all cursor-pointer shrink-0 ${
                ratioM1 === p.m1 && ratioM2 === p.m2 && divisionType === p.mode && showCentroidTriangle === p.centroid
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-extrabold shadow-sm'
                  : 'bg-slate-900/90 text-slate-300 border-slate-700/70 hover:bg-slate-800'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
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

              {/* Point 6: SVG Component Shadow Drops from P onto X and Y axes */}
              <line
                x1={pointPx}
                y1={pointPy}
                x2={pointPx}
                y2="0"
                stroke="#38bdf8"
                strokeWidth="0.12"
                strokeDasharray="0.3 0.3"
              />
              <line
                x1={pointPx}
                y1={pointPy}
                x2="0"
                y2={pointPy}
                stroke="#f43f5e"
                strokeWidth="0.12"
                strokeDasharray="0.3 0.3"
              />
              <circle cx={pointPx} cy="0" r="0.2" fill="#38bdf8" />
              <circle cx="0" cy={pointPy} r="0.2" fill="#f43f5e" />

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

      {/* Point 13: CBSE Class 10 5-Mark Proof & Cheatsheet Modal */}
      <ExamCheatSheetModal
        isOpen={showCheatSheet}
        onClose={() => setShowCheatSheet(false)}
        topicTitle="CBSE Class 10: Coordinate Section Formula & Centroid"
        chapterName="Chapter 7 — Coordinate Geometry (5-Mark Master Cheatsheet)"
        fiveMarkQuestion="Derive the Section Formula for internal division of line segment joining A(x₁, y₁) and B(x₂, y₂) in ratio m₁ : m₂ using similar right triangles. Hence, find the coordinates of the centroid of a triangle with vertices (x₁, y₁), (x₂, y₂), (x₃, y₃)."
        proofSteps={[
          {
            stepNumber: 1,
            title: "Geometric Setup & Perpendicular Projections",
            mathContent: "AL, PM, BN \\perp X\\text{-axis}, \\quad AQ \\perp PM, \\; PT \\perp BN",
            explanation: "Drop perpendiculars from A, P, B onto the x-axis. Construct horizontal projections AQ and PT to form right triangles ΔPAQ and ΔBPT.",
            marksAllocation: "1.0 Mark",
          },
          {
            stepNumber: 2,
            title: "AA Similarity of Right Triangles",
            mathContent: "\\angle PQA = \\angle BTP = 90^\\circ, \\quad \\angle PAQ = \\angle BPT \\implies \\Delta PAQ \\sim \\Delta BPT \\; (AA)",
            explanation: "Since corresponding angles of parallel lines are equal, the two right triangles are similar by AA similarity.",
            marksAllocation: "1.0 Mark",
          },
          {
            stepNumber: 3,
            title: "Derivation of X and Y Coordinates",
            mathContent: "\\frac{PA}{PB} = \\frac{AQ}{PT} \\implies \\frac{m_1}{m_2} = \\frac{x - x_1}{x_2 - x} \\implies x = \\frac{m_1 x_2 + m_2 x_1}{m_1 + m_2}",
            explanation: "Cross-multiply and group terms containing x on the LHS: m₁x₂ - m₁x = m₂x - m₂x₁ ⟹ x(m₁ + m₂) = m₁x₂ + m₂x₁.",
            marksAllocation: "2.0 Marks",
          },
          {
            stepNumber: 4,
            title: "Centroid 2:1 Median Ratio Theorem",
            mathContent: "G = \\left(\\frac{x_1 + x_2 + x_3}{3}, \\frac{y_1 + y_2 + y_3}{3}\\right)",
            explanation: "The centroid G divides the median from A to midpoint D in the ratio 2 : 1. Apply section formula with m₁=2, m₂=1 to derive the 3-vertex average.",
            marksAllocation: "1.0 Mark",
          },
        ]}
        topperShortcuts={[
          "Cross-Multiplication Memory Hook: m₁ ALWAYS multiplies point B coordinates, while m₂ ALWAYS multiplies point A coordinates!",
          "Trisection Shortcut: Points of trisection divide segment in 1:2 and 2:1 ratios.",
          "Midpoint Corollary: When m₁ = m₂ = 1, P = ((x₁+x₂)/2, (y₁+y₂)/2).",
        ]}
        examinerTraps={[
          "Multiplying m₁ with x₁ instead of x₂ (disaster cross error!).",
          "For external division, forgetting that the formula has a MINUS sign: (m₁x₂ - m₂x₁)/(m₁ - m₂).",
          "Centroid coordinates are an exact arithmetic mean of 3 vertices, NOT 2.",
        ]}
      />

      {/* Point 15: Split-Screen Dual Perspective Comparison Inspector */}
      <DualViewInspectorModal
        isOpen={showDualView}
        onClose={() => setShowDualView(false)}
        title="Section Formula Dual Inspector"
        badge="Linear Ratio Section vs Centroid 2:1 Median Intersection"
        primaryView={{
          title: "1D/2D Segment Division",
          badge: `Ratio ${ratioM1} : ${ratioM2}`,
          content: (
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-800/60 text-cyan-200">
                <p className="font-bold">Point A: ({pointAx}, {pointAy})</p>
                <p className="font-bold text-amber-300 mt-1">Point B: ({pointBx}, {pointBy})</p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-200 text-center">
                <span className="text-xs uppercase text-slate-400 block font-semibold">Dividing Point P ({divisionType})</span>
                <span className="text-base font-bold text-emerald-300">({pointPx.toFixed(2)}, {pointPy.toFixed(2)})</span>
              </div>
            </div>
          ),
        }}
        secondaryView={{
          title: "Triangle Centroid G (2:1 Invariant)",
          badge: "G = (Σx/3, Σy/3)",
          content: (
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-800/60 text-purple-200">
                <p className="font-semibold text-purple-300 mb-1">Vertex C: ({pointCx}, {pointCy})</p>
                <p className="font-bold text-white">Centroid G: ({centroidX.toFixed(2)}, {centroidY.toFixed(2)})</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 text-center">
                Centroid divides each median in a 2 : 1 ratio from vertex to midpoint base!
              </div>
            </div>
          ),
        }}
        couplingBanner="The Section Formula ratio m₁:m₂ governs both Segment Points and the Centroid G 2:1 Median Invariant!"
      />
    </div>
  );
};
