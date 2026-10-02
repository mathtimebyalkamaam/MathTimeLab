/**
 * SimilarTrianglesSimulator.tsx: Interactive Basic Proportionality Theorem (BPT / Thales) & Similarity Lab (Class 10 Geometry).
 * Features:
 * - Dynamic interactive triangle ABC with draggable apex A and vertices
 * - Moveable parallel transversal DE with real-time segment ratio verification (AD/DB = AE/EC)
 * - Auxiliary altitude lines (DM ⊥ AC, EN ⊥ AB) for the textbook 5-mark CBSE area proof
 * - Quadratic area ratio demonstration: Area(ΔADE) / Area(ΔABC) = (AD/AB)²
 * - Thales Great Pyramid Shadow Clinometer mode
 * - Similarity criteria (AA, SAS, SSS) tester
 */
import React, { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Compass, 
  RotateCcw, 
  CheckCircle2, 
  Target, 
  Sun, 
  Sparkles, 
  Layers, 
  Eye,
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
import { ConceptInsightBanner } from '../common/ConceptInsightBanner';

export const SimilarTrianglesSimulator: React.FC = () => {
  const {
    similarTrianglesParams,
    updateSimilarTrianglesParams,
    resetParams,
    completeChallenge,
    challengeCompleted,
    isZenMode,
  } = useSimulatorStore();

  const {
    mode,
    transversalRatio,
    showAltitudes,
    showAreaRatios,
    showAngleMarkers,
    sunElevationAngle,
    poleHeight,
  } = similarTrianglesParams;

  const { lightTap, successBuzz } = useHaptics();
  const { playClick, playChime } = useSound();
  const { trackEvent } = useAnalytics();

  // Triangle vertices on canvas (400x320 coord system)
  const [vertexA, setVertexA] = useState({ x: 200, y: 35 });
  const [vertexB, setVertexB] = useState({ x: 60, y: 260 });
  const [vertexC, setVertexC] = useState({ x: 340, y: 260 });
  const [draggedVertex, setDraggedVertex] = useState<'A' | 'B' | 'C' | null>(null);

  const svgRef = useRef<SVGSVGElement>(null);

  // Position of D on AB and E on AC:
  // D = A + k*(B - A), E = A + k*(C - A)
  const k = transversalRatio;
  const pointD = {
    x: vertexA.x + k * (vertexB.x - vertexA.x),
    y: vertexA.y + k * (vertexB.y - vertexA.y),
  };
  const pointE = {
    x: vertexA.x + k * (vertexC.x - vertexA.x),
    y: vertexA.y + k * (vertexC.y - vertexA.y),
  };

  // Euclidean segment lengths
  const dist = (p1: { x: number; y: number }, p2: { x: number; y: number }) =>
    Math.hypot(p2.x - p1.x, p2.y - p1.y);

  const lenAD = dist(vertexA, pointD);
  const lenDB = dist(pointD, vertexB);
  const lenAB = dist(vertexA, vertexB);

  const lenAE = dist(vertexA, pointE);
  const lenEC = dist(pointE, vertexC);
  const lenAC = dist(vertexA, vertexC);

  const lenDE = dist(pointD, pointE);
  const lenBC = dist(vertexB, vertexC);

  // Segment ratios
  const ratioLeft = lenDB > 0.001 ? lenAD / lenDB : 0;
  const ratioRight = lenEC > 0.001 ? lenAE / lenEC : 0;

  // Scale factor (part to whole)
  const scaleFactor = lenAB > 0 ? lenAD / lenAB : k;
  const sideRatioDE_BC = lenBC > 0 ? lenDE / lenBC : k;

  // Areas using cross product: Area = 0.5 * |x1(y2 - y3) + x2(y3 - y1) + x3(y1 - y2)|
  const triangleArea = (
    p1: { x: number; y: number },
    p2: { x: number; y: number },
    p3: { x: number; y: number }
  ) =>
    0.5 *
    Math.abs(
      p1.x * (p2.y - p3.y) +
      p2.x * (p3.y - p1.y) +
      p3.x * (p1.y - p2.y)
    );

  const areaTotal = triangleArea(vertexA, vertexB, vertexC);
  const areaSmall = triangleArea(vertexA, pointD, pointE);
  const areaTrapezoid = Math.max(0, areaTotal - areaSmall);
  const areaRatio = areaTotal > 0 ? areaSmall / areaTotal : 0;

  // Altitudes for BPT proof:
  // Drop EN perpendicular to AB, DM perpendicular to AC
  const projectPointToLine = (
    p: { x: number; y: number },
    a: { x: number; y: number },
    b: { x: number; y: number }
  ) => {
    const abx = b.x - a.x;
    const aby = b.y - a.y;
    const mag2 = abx * abx + aby * aby;
    if (mag2 === 0) return a;
    const u = ((p.x - a.x) * abx + (p.y - a.y) * aby) / mag2;
    return { x: a.x + u * abx, y: a.y + u * aby };
  };

  const pointN = projectPointToLine(pointE, vertexA, vertexB); // EN ⊥ AB
  const pointM = projectPointToLine(pointD, vertexA, vertexC); // DM ⊥ AC

  // Pointer dragging handler for triangle apex
  const handlePointerDown = (v: 'A' | 'B' | 'C') => {
    lightTap();
    setDraggedVertex(v);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggedVertex || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = Math.max(20, Math.min(380, ((e.clientX - rect.left) / rect.width) * 400));
    const y = Math.max(20, Math.min(290, ((e.clientY - rect.top) / rect.height) * 320));

    if (draggedVertex === 'A') {
      setVertexA({ x, y: Math.min(y, 140) });
    } else if (draggedVertex === 'B') {
      setVertexB({ x: Math.min(x, 180), y: Math.max(180, y) });
    } else if (draggedVertex === 'C') {
      setVertexC({ x: Math.max(x, 220), y: Math.max(180, y) });
    }
  };

  const handlePointerUp = () => {
    setDraggedVertex(null);
  };

  // Challenges evaluation
  useEffect(() => {
    // Challenge 1: The Midpoint Quadrisection (k ≈ 0.50)
    if (Math.abs(k - 0.50) < 0.02 && !challengeCompleted['bpt_midpoint']) {
      completeChallenge('bpt_midpoint', 40);
      successBuzz();
      playChime();
      confetti({ particleCount: 35, spread: 60 });
      trackEvent('challenge_completed', { challengeId: 'bpt_midpoint' });
    }

    // Challenge 2: Thales Pyramid Shadow scaling
    if (mode === 'shadow-scaling' && Math.abs(sunElevationAngle - 45) < 2 && !challengeCompleted['bpt_shadow_45']) {
      completeChallenge('bpt_shadow_45', 40);
      successBuzz();
      playChime();
      confetti({ particleCount: 40, spread: 65 });
      trackEvent('challenge_completed', { challengeId: 'bpt_shadow_45' });
    }

    // Challenge 3: 2-to-3 Board Exam Ratio (k = 0.40 -> AD/DB = 0.4 / 0.6 = 0.667)
    if (Math.abs(k - 0.40) < 0.02 && !challengeCompleted['bpt_board_ratio']) {
      completeChallenge('bpt_board_ratio', 40);
      successBuzz();
      playChime();
      confetti({ particleCount: 45, spread: 70 });
      trackEvent('challenge_completed', { challengeId: 'bpt_board_ratio' });
    }
  }, [k, mode, sunElevationAngle, challengeCompleted, completeChallenge, successBuzz, playChime, trackEvent]);

  const challengeLevels: ChallengeLevel[] = [
    {
      levelNumber: 1,
      title: 'The Midpoint Quadrisection (k = 0.50)',
      badge: 'BPT Novice',
      description: 'Set transversal DE to the exact midpoint (k = 0.50). Verify that the area of ΔADE is exactly 25.0% (1/4) of ΔABC!',
      requirementFormula: '\\frac{\\text{ar}(\\Delta ADE)}{\\text{ar}(\\Delta ABC)} = (0.50)^2 = 0.25',
      targetCriteria: 'Set transversal ratio k to 0.50',
      xpReward: 40,
      tier1Hint: 'Recall that area ratio equals the SQUARE of the side scale factor: (1/2)² = 1/4.',
      tier2Hint: 'Drag the Transversal Ratio slider to 0.50.',
      tier3Hint: 'Check that Area(ΔADE) reads exactly 25.0%.',
      autoPreset: () => {
        updateSimilarTrianglesParams({ transversalRatio: 0.50 });
      },
    },
    {
      levelNumber: 2,
      title: 'Thales Great Pyramid Sun Shadow (45°)',
      badge: 'Sun Clinometer',
      description: 'Switch to Shadow Scaling mode. Adjust the Sun Elevation Angle to 45° so shadow length equals object height!',
      requirementFormula: '\\frac{H}{s} = \\tan(45^\\circ) = 1.00',
      targetCriteria: 'Set Sun Angle to 45° in Shadow Scaling mode',
      xpReward: 40,
      tier1Hint: 'At 45° sun elevation, tan(45°) = 1, meaning shadow = height.',
      tier2Hint: 'Set mode to "Shadow Clinometer" and adjust Sun Elevation to 45°.',
      tier3Hint: 'Watch the pole shadow length match the pole height exactly.',
      autoPreset: () => {
        updateSimilarTrianglesParams({ mode: 'shadow-scaling', sunElevationAngle: 45 });
      },
    },
    {
      levelNumber: 3,
      title: 'The 2 : 3 Board Ratio (AD/DB = 0.667)',
      badge: 'Thales Master',
      description: 'Adjust the transversal so AD/DB = 2/3 ≈ 0.67 (ratio k = 0.40). Observe that AE/EC also locks identically onto 0.67!',
      requirementFormula: '\\frac{AD}{DB} = \\frac{2}{3} \\approx 0.667',
      targetCriteria: 'Set transversal ratio k to 0.40',
      xpReward: 50,
      tier1Hint: 'If AD = 2 parts and DB = 3 parts, the total side AB is 5 parts. k = 2/5 = 0.40.',
      tier2Hint: 'Drag the transversal slider to 0.40.',
      tier3Hint: 'Verify both side ratios light up green as 0.67!',
      autoPreset: () => {
        updateSimilarTrianglesParams({ transversalRatio: 0.40 });
      },
    },
  ];

  // Shadow calculations for mode === 'shadow-scaling'
  const rad = (sunElevationAngle * Math.PI) / 180;
  const poleShadowLen = poleHeight / Math.tan(rad);
  const pyramidHeight = 146.6; // Great Pyramid original height in meters
  const pyramidShadowLen = pyramidHeight / Math.tan(rad);

  return (
    <div className="w-full h-full flex flex-col relative select-none">
      {/* Center Interactive Simulator Canvas Area */}
      <div 
        className="w-full flex-1 flex flex-col items-center justify-center p-2 sm:p-4 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden relative"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* Real-time Math HUD Banner */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none z-10 px-2">
          <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-700/80 px-2.5 py-1 rounded-xl shadow-lg backdrop-blur-md">
            <Compass className="w-4 h-4 text-cyan-400" />
            <span className="text-[11px] font-mono font-bold text-cyan-300">
              {mode === 'bpt-slider' && 'BPT: AD/DB = AE/EC'}
              {mode === 'shadow-scaling' && `Sun Angle θ = ${sunElevationAngle}°`}
              {mode === 'similarity-criteria' && 'AA Similarity: ΔADE ~ ΔABC'}
            </span>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 px-2.5 py-1 rounded-xl shadow-lg backdrop-blur-md">
            <span className="text-[11px] font-mono text-slate-300">
              Ratio: <strong className="text-emerald-400 font-bold">{ratioLeft.toFixed(3)}</strong>
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-[11px] font-mono text-slate-300">
              Area: <strong className="text-purple-400 font-bold">{(areaRatio * 100).toFixed(1)}%</strong>
            </span>
          </div>
        </div>

        {/* Dynamic SVG Triangle Stage */}
        <div className="w-full max-w-lg aspect-[4/3] max-h-[62vh] relative flex items-center justify-center">
          {mode === 'shadow-scaling' ? (
            /* Shadow Scaling Graphic: Thales & Pyramid */
            <svg
              viewBox="0 0 400 280"
              className="w-full h-full drop-shadow-2xl overflow-visible"
            >
              {/* Sun & Ray Lines */}
              <circle cx="80" cy="50" r="22" fill="#f59e0b" filter="drop-shadow(0 0 16px rgba(245, 158, 11, 0.6))" />
              <line x1="80" y1="50" x2="380" y2={50 + 300 * Math.tan(rad)} stroke="#fef08a" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />

              {/* Ground Plane */}
              <line x1="20" y1="230" x2="380" y2="230" stroke="#475569" strokeWidth="2.5" />

              {/* Vertical Measuring Pole */}
              <line x1="120" y1="230" x2="120" y2={230 - 60} stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
              <text x="125" y="195" fill="#38bdf8" fontSize="10" fontWeight="bold" fontFamily="monospace">
                h₁ = {poleHeight}m
              </text>

              {/* Pole Shadow */}
              <line x1="120" y1="230" x2={120 + 60 / Math.tan(rad)} y2="230" stroke="#0284c7" strokeWidth="4" strokeLinecap="round" />
              <text x={120 + 10} y="244" fill="#38bdf8" fontSize="9" fontFamily="monospace">
                s₁ = {poleShadowLen.toFixed(1)}m
              </text>

              {/* Sun Angle Marker */}
              <path
                d={`M ${120 + 60 / Math.tan(rad) - 15} 230 A 15 15 0 0 0 ${120 + 60 / Math.tan(rad) - 15 * Math.cos(rad)} ${230 - 15 * Math.sin(rad)}`}
                fill="none"
                stroke="#f59e0b"
                strokeWidth="1.5"
              />
              <text x={120 + 60 / Math.tan(rad) - 28} y="224" fill="#f59e0b" fontSize="8" fontFamily="monospace">
                {sunElevationAngle}°
              </text>

              {/* Great Pyramid Silhouette */}
              <polygon
                points={`260,230 330,${230 - 110} 380,230`}
                fill="rgba(245, 158, 11, 0.2)"
                stroke="#d97706"
                strokeWidth="2"
              />
              {/* Pyramid Height line */}
              <line x1="330" y1="230" x2="330" y2={230 - 110} stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 3" />
              <text x="335" y={230 - 55} fill="#f59e0b" fontSize="11" fontWeight="bold" fontFamily="monospace">
                H = 146.6m
              </text>

              {/* Thales Scaling Formula Banner */}
              <rect x="60" y="10" width="280" height="28" rx="8" fill="rgba(15, 23, 42, 0.85)" stroke="#334155" />
              <text x="200" y="28" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="bold" fontFamily="monospace">
                H / s₂ = h₁ / s₁ = tan({sunElevationAngle}°) = {Math.tan(rad).toFixed(2)}
              </text>
            </svg>
          ) : (
            /* Standard BPT Interactive Triangle */
            <svg
              ref={svgRef}
              viewBox="0 0 400 320"
              className="w-full h-full drop-shadow-2xl overflow-visible"
            >
              <defs>
                <linearGradient id="triGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0284c7" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#0369a1" stopOpacity="0.1" />
                </linearGradient>
                <linearGradient id="smallTriGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#059669" stopOpacity="0.2" />
                </linearGradient>
                <linearGradient id="trapezoidGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#7e22ce" stopOpacity="0.12" />
                </linearGradient>
              </defs>

              {/* Shaded Areas */}
              {showAreaRatios ? (
                <>
                  {/* Top similar triangle ADE */}
                  <polygon
                    points={`${vertexA.x},${vertexA.y} ${pointD.x},${pointD.y} ${pointE.x},${pointE.y}`}
                    fill="url(#smallTriGradient)"
                    stroke="#10b981"
                    strokeWidth="1.5"
                  />
                  {/* Bottom Trapezoid BCED */}
                  <polygon
                    points={`${pointD.x},${pointD.y} ${vertexB.x},${vertexB.y} ${vertexC.x},${vertexC.y} ${pointE.x},${pointE.y}`}
                    fill="url(#trapezoidGradient)"
                    stroke="#a855f7"
                    strokeWidth="1.5"
                  />
                </>
              ) : (
                <polygon
                  points={`${vertexA.x},${vertexA.y} ${vertexB.x},${vertexB.y} ${vertexC.x},${vertexC.y}`}
                  fill="url(#triGradient)"
                />
              )}

              {/* Outer Triangle Edges */}
              <line x1={vertexA.x} y1={vertexA.y} x2={vertexB.x} y2={vertexB.y} stroke="#38bdf8" strokeWidth="2.5" />
              <line x1={vertexA.x} y1={vertexA.y} x2={vertexC.x} y2={vertexC.y} stroke="#38bdf8" strokeWidth="2.5" />
              <line x1={vertexB.x} y1={vertexB.y} x2={vertexC.x} y2={vertexC.y} stroke="#38bdf8" strokeWidth="2.5" />

              {/* Auxiliary Altitudes for 5-Mark BPT Proof */}
              {showAltitudes && (
                <>
                  {/* Segment BE & CD */}
                  <line x1={vertexB.x} y1={vertexB.y} x2={pointE.x} y2={pointE.y} stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.75" />
                  <line x1={vertexC.x} y1={vertexC.y} x2={pointD.x} y2={pointD.y} stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.75" />

                  {/* Altitude EN ⊥ AB */}
                  <line x1={pointE.x} y1={pointE.y} x2={pointN.x} y2={pointN.y} stroke="#ef4444" strokeWidth="1.5" strokeDasharray="2 2" />
                  <circle cx={pointN.x} cy={pointN.y} r="2.5" fill="#ef4444" />
                  <text x={pointN.x - 12} y={pointN.y + 4} fill="#ef4444" fontSize="8" fontFamily="monospace">N</text>

                  {/* Altitude DM ⊥ AC */}
                  <line x1={pointD.x} y1={pointD.y} x2={pointM.x} y2={pointM.y} stroke="#ec4899" strokeWidth="1.5" strokeDasharray="2 2" />
                  <circle cx={pointM.x} cy={pointM.y} r="2.5" fill="#ec4899" />
                  <text x={pointM.x + 8} y={pointM.y + 4} fill="#ec4899" fontSize="8" fontFamily="monospace">M</text>
                </>
              )}

              {/* Moveable Parallel Transversal DE */}
              <line
                x1={pointD.x}
                y1={pointD.y}
                x2={pointE.x}
                y2={pointE.y}
                stroke="#10b981"
                strokeWidth="3.5"
                strokeLinecap="round"
                className="filter drop-shadow-[0_0_8px_rgba(16,185,129,0.7)]"
              />

              {/* Parallel Arrow Markers on DE and BC */}
              <polygon
                points={`${(pointD.x + pointE.x) / 2},${(pointD.y + pointE.y) / 2 - 4} ${(pointD.x + pointE.x) / 2 + 6},${(pointD.y + pointE.y) / 2} ${(pointD.x + pointE.x) / 2},${(pointD.y + pointE.y) / 2 + 4}`}
                fill="#10b981"
              />
              <polygon
                points={`${(vertexB.x + vertexC.x) / 2},${(vertexB.y + vertexC.y) / 2 - 4} ${(vertexB.x + vertexC.x) / 2 + 6},${(vertexB.y + vertexC.y) / 2} ${(vertexB.x + vertexC.x) / 2},${(vertexB.y + vertexC.y) / 2 + 4}`}
                fill="#38bdf8"
              />

              {/* Segment Labels */}
              <text x={pointD.x - 22} y={pointD.y + 2} fill="#10b981" fontSize="11" fontWeight="bold" fontFamily="monospace">
                D
              </text>
              <text x={pointE.x + 12} y={pointE.y + 2} fill="#10b981" fontSize="11" fontWeight="bold" fontFamily="monospace">
                E
              </text>

              {/* Vertex A (Draggable) */}
              <g
                className="cursor-grab active:cursor-grabbing"
                onPointerDown={() => handlePointerDown('A')}
              >
                <circle cx={vertexA.x} cy={vertexA.y} r="14" fill="rgba(56, 189, 248, 0.2)" />
                <circle cx={vertexA.x} cy={vertexA.y} r="7" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" />
                <text x={vertexA.x} y={vertexA.y - 12} textAnchor="middle" fill="#38bdf8" fontSize="13" fontWeight="bold">
                  A
                </text>
              </g>

              {/* Vertex B (Draggable) */}
              <g
                className="cursor-grab active:cursor-grabbing"
                onPointerDown={() => handlePointerDown('B')}
              >
                <circle cx={vertexB.x} cy={vertexB.y} r="12" fill="rgba(56, 189, 248, 0.2)" />
                <circle cx={vertexB.x} cy={vertexB.y} r="6" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" />
                <text x={vertexB.x - 14} y={vertexB.y + 8} fill="#38bdf8" fontSize="13" fontWeight="bold">
                  B
                </text>
              </g>

              {/* Vertex C (Draggable) */}
              <g
                className="cursor-grab active:cursor-grabbing"
                onPointerDown={() => handlePointerDown('C')}
              >
                <circle cx={vertexC.x} cy={vertexC.y} r="12" fill="rgba(56, 189, 248, 0.2)" />
                <circle cx={vertexC.x} cy={vertexC.y} r="6" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" />
                <text x={vertexC.x + 14} y={vertexC.y + 8} fill="#38bdf8" fontSize="13" fontWeight="bold">
                  C
                </text>
              </g>

              {/* Segment Length Tags */}
              <g className="text-[10px] font-mono fill-slate-300">
                <text x={(vertexA.x + pointD.x) / 2 - 24} y={(vertexA.y + pointD.y) / 2} fill="#38bdf8">
                  AD = {lenAD.toFixed(1)}
                </text>
                <text x={(pointD.x + vertexB.x) / 2 - 24} y={(pointD.y + vertexB.y) / 2} fill="#94a3b8">
                  DB = {lenDB.toFixed(1)}
                </text>
                <text x={(vertexA.x + pointE.x) / 2 + 10} y={(vertexA.y + pointE.y) / 2} fill="#38bdf8">
                  AE = {lenAE.toFixed(1)}
                </text>
                <text x={(pointE.x + vertexC.x) / 2 + 10} y={(pointE.y + vertexC.y) / 2} fill="#94a3b8">
                  EC = {lenEC.toFixed(1)}
                </text>
              </g>
            </svg>
          )}

          {/* Real-time Pedagogical Concept Insight Banner */}
          <ConceptInsightBanner
            conceptTitle="Thales Theorem (BPT) & Similarity Ratios"
            mathInsight={`Line DE ∥ BC divides sides proportionally: AD/DB = ${(ratioLeft).toFixed(3)}, AE/EC = ${(ratioRight).toFixed(3)}. Side Scale k = ${scaleFactor.toFixed(2)} ⟹ Area Ratio Area(ΔADE)/Area(ΔABC) = k² = ${(scaleFactor * scaleFactor).toFixed(3)}.`}
            eli10Analogy="If you take a photo of a triangle and zoom in or out, all 3 angles stay identical, and all side lengths shrink or stretch by the exact same multiplier k! But because area has TWO dimensions (base × height), the area scales by k²!"
            liveFeedback={
              Math.abs(ratioLeft - ratioRight) < 0.01
                ? `✅ BPT holds! Both sides cut in exact ratio ${ratioLeft.toFixed(2)}. Triangles ADE & ABC are similar (AA criteria).`
                : `Ratios: Left = ${ratioLeft.toFixed(2)}, Right = ${ratioRight.toFixed(2)}.`
            }
            quickAction={{
              label: "Alka Ma'am's Midpoint Transversal (k = 0.5)",
              onApply: () => updateSimilarTrianglesParams({ transversalRatio: 0.5 }),
            }}
          />
        </div>

        {/* Live Calculation Ratio Ribbon */}
        <div className="w-full max-w-lg mt-2 grid grid-cols-3 gap-1.5 text-center">
          <div className="p-2 rounded-xl bg-slate-900/90 border border-emerald-500/30">
            <span className="text-[9px] uppercase tracking-wider text-slate-400 block">Left Side AD/DB</span>
            <span className="text-xs sm:text-sm font-bold font-mono text-emerald-400">
              {lenAD.toFixed(1)} / {lenDB.toFixed(1)} = {ratioLeft.toFixed(3)}
            </span>
          </div>

          <div className="p-2 rounded-xl bg-slate-900/90 border border-emerald-500/30">
            <span className="text-[9px] uppercase tracking-wider text-slate-400 block">Right Side AE/EC</span>
            <span className="text-xs sm:text-sm font-bold font-mono text-emerald-400">
              {lenAE.toFixed(1)} / {lenEC.toFixed(1)} = {ratioRight.toFixed(3)}
            </span>
          </div>

          <div className="p-2 rounded-xl bg-slate-900/90 border border-purple-500/30">
            <span className="text-[9px] uppercase tracking-wider text-slate-400 block">Area Scale k²</span>
            <span className="text-xs sm:text-sm font-bold font-mono text-purple-400">
              ({scaleFactor.toFixed(2)})² = {(scaleFactor * scaleFactor).toFixed(3)}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Sheet Controls & Right Sidebar Theory */}
      <BottomSheet
        title="Similar Triangles & BPT Lab"
        quickEquation="\frac{AD}{DB} = \frac{AE}{EC} \iff DE \parallel BC"
        onReset={() => resetParams('similar-triangles')}
        theoryContent={
          <CoachTheoryModule
            simulatorId="similar-triangles"
            extraLiveDetails={
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between text-cyan-400">
                  <span>Theorem 6.1 (BPT):</span>
                  <span className="font-bold">AD/DB == AE/EC</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-slate-950/70 p-1.5 rounded border border-slate-800">
                    <span className="text-slate-400 block">Side Scale k:</span>
                    <span className="text-emerald-400 font-bold">{scaleFactor.toFixed(3)}</span>
                  </div>
                  <div className="bg-slate-950/70 p-1.5 rounded border border-slate-800">
                    <span className="text-slate-400 block">Area Ratio k²:</span>
                    <span className="text-purple-400 font-bold">{(scaleFactor * scaleFactor).toFixed(3)}</span>
                  </div>
                </div>
              </div>
            }
          />
        }
        challengeContent={
          <ChallengeManager
            simulatorId="similar-triangles"
            simulatorTitle="Similar Triangles & Thales BPT"
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
          {/* Mode Switcher */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Experiment Mode
            </label>
            <div className="grid grid-cols-3 gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => {
                  updateSimilarTrianglesParams({ mode: 'bpt-slider' });
                  playClick();
                  lightTap();
                }}
                className={`py-1.5 text-[11px] font-semibold rounded-lg transition-all cursor-pointer ${
                  mode === 'bpt-slider'
                    ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                BPT Proof
              </button>
              <button
                type="button"
                onClick={() => {
                  updateSimilarTrianglesParams({ mode: 'shadow-scaling' });
                  playClick();
                  lightTap();
                }}
                className={`py-1.5 text-[11px] font-semibold rounded-lg transition-all cursor-pointer ${
                  mode === 'shadow-scaling'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Shadow Scale
              </button>
              <button
                type="button"
                onClick={() => {
                  updateSimilarTrianglesParams({ mode: 'similarity-criteria' });
                  playClick();
                  lightTap();
                }}
                className={`py-1.5 text-[11px] font-semibold rounded-lg transition-all cursor-pointer ${
                  mode === 'similarity-criteria'
                    ? 'bg-purple-500 text-white shadow-md font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                AA Criteria
              </button>
            </div>
          </div>

          {/* Transversal Slider */}
          {mode !== 'shadow-scaling' ? (
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-emerald-400">Transversal Position (k = AD/AB)</span>
                <span className="text-xs font-mono font-bold text-emerald-300">{(transversalRatio * 100).toFixed(0)}%</span>
              </div>
              <TouchSlider
                label="Scale (k)"
                value={transversalRatio}
                min={0.10}
                max={0.90}
                step={0.01}
                unit=""
                formulaTerm="k"
                causeEffectHint={(val) =>
                  `Side scale k = ${val.toFixed(2)}. Area ratio = k² = ${(val * val).toFixed(2)} (Area(ΔADE) is ${(val * val * 100).toFixed(0)}% of ΔABC)`
                }
                onChange={(val) => updateSimilarTrianglesParams({ transversalRatio: val })}
              />
            </div>
          ) : (
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-amber-400">Sun Elevation Angle (θ)</span>
                <span className="text-xs font-mono font-bold text-amber-300">{sunElevationAngle}°</span>
              </div>
              <TouchSlider
                label="Sun Angle"
                value={sunElevationAngle}
                min={15}
                max={75}
                step={1}
                unit="°"
                formulaTerm="θ"
                causeEffectHint={(val) =>
                  `tan(${val}°) = ${Math.tan((val * Math.PI) / 180).toFixed(2)}. Shadow length s = H / tan(${val}°)`
                }
                onChange={(val) => updateSimilarTrianglesParams({ sunElevationAngle: val })}
              />
            </div>
          )}

          {/* Proof Construction Toggles */}
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Proof Visualizations
            </span>

            <div className="flex items-center justify-between">
              <span className="text-slate-300 text-xs">Show Aux Altitudes (DM ⊥ AC, EN ⊥ AB)</span>
              <button
                type="button"
                onClick={() => updateSimilarTrianglesParams({ showAltitudes: !showAltitudes })}
                className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                  showAltitudes ? 'bg-cyan-500' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${
                    showAltitudes ? 'left-4.5' : 'left-0.5'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-300 text-xs">Show Area Ratios (ΔADE vs Trapezoid)</span>
              <button
                type="button"
                onClick={() => updateSimilarTrianglesParams({ showAreaRatios: !showAreaRatios })}
                className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                  showAreaRatios ? 'bg-purple-500' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${
                    showAreaRatios ? 'left-4.5' : 'left-0.5'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
};
