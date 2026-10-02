/**
 * ThreeDGeometrySimulator.tsx: Interactive 3D Geometry, Skew Lines & Shortest Distance Lab (Class 12 Vectors).
 * Features:
 * - 3D orbital canvas rendering two spatial lines: r = a + λb
 * - Real-time shortest distance segment calculation connecting points P ∈ L₁ and Q ∈ L₂
 * - Common perpendicular normal vector b₁ × b₂ visualization
 * - Modes: Skew Lines, Intersecting Lines (d=0), and Parallel Lines
 * - Full 3D camera rotation with touch/mouse drag
 * - 3 Progressive Board Exam challenges
 */
import React, { useEffect, useRef, useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  Boxes, 
  RotateCcw, 
  CheckCircle2, 
  Orbit, 
  Target, 
  Sparkles, 
  Layers, 
  Sliders,
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

export const ThreeDGeometrySimulator: React.FC = () => {
  const {
    threeDParams,
    updateThreeDParams,
    resetParams,
    completeChallenge,
    challengeCompleted,
    isZenMode,
  } = useSimulatorStore();

  const {
    lineMode,
    pointA1,
    dirB1,
    pointA2,
    dirB2,
    showShortestSegment,
    showCommonPerpendicularVector,
    showParallelPlanes,
    cameraOrbitX,
    cameraOrbitY,
  } = threeDParams;

  const { lightTap, successBuzz } = useHaptics();
  const { playClick, playChime } = useSound();
  const { trackEvent } = useAnalytics();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDragging = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  // 3D Vector Math
  const [a1x, a1y, a1z] = pointA1;
  const [b1x, b1y, b1z] = dirB1;
  const [a2x, a2y, a2z] = pointA2;
  const [b2x, b2y, b2z] = dirB2;

  // Displacement vector a2 - a1
  const diffA = [a2x - a1x, a2y - a1y, a2z - a1z];

  // Cross product b1 × b2
  const crossB = useMemo(() => [
    b1y * b2z - b1z * b2y,
    b1z * b2x - b1x * b2z,
    b1x * b2y - b1y * b2x,
  ], [b1x, b1y, b1z, b2x, b2y, b2z]);

  const crossMag = Math.hypot(crossB[0], crossB[1], crossB[2]);

  // Dot product (a2 - a1) · (b1 × b2)
  const dotScalar = diffA[0] * crossB[0] + diffA[1] * crossB[1] + diffA[2] * crossB[2];

  // Shortest distance
  const shortestDistance = crossMag > 0.001 ? Math.abs(dotScalar) / crossMag : 0;

  // Nearest points P on L1 and Q on L2
  // Solve linear system:
  // P = a1 + λ b1, Q = a2 + μ b2
  // (P - Q) · b1 = 0 and (P - Q) · b2 = 0
  const { pointP, pointQ } = useMemo(() => {
    const dotB1B1 = b1x * b1x + b1y * b1y + b1z * b1z;
    const dotB1B2 = b1x * b2x + b1y * b2y + b1z * b2z;
    const dotB2B2 = b2x * b2x + b2y * b2y + b2z * b2z;
    const dotDiffB1 = diffA[0] * b1x + diffA[1] * b1y + diffA[2] * b1z;
    const dotDiffB2 = diffA[0] * b2x + diffA[1] * b2y + diffA[2] * b2z;

    const denom = dotB1B1 * dotB2B2 - dotB1B2 * dotB1B2;
    if (Math.abs(denom) < 0.001) {
      return {
        pointP: [a1x, a1y, a1z] as [number, number, number],
        pointQ: [a2x, a2y, a2z] as [number, number, number],
      };
    }

    const lambda = (dotDiffB1 * dotB2B2 - dotDiffB2 * dotB1B2) / denom;
    const mu = (dotDiffB1 * dotB1B2 - dotDiffB2 * dotB1B1) / denom;

    return {
      pointP: [a1x + lambda * b1x, a1y + lambda * b1y, a1z + lambda * b1z] as [number, number, number],
      pointQ: [a2x + mu * b2x, a2y + mu * b2y, a2z + mu * b2z] as [number, number, number],
    };
  }, [a1x, a1y, a1z, b1x, b1y, b1z, a2x, a2y, a2z, b2x, b2y, b2z, diffA]);

  // Challenges evaluation
  useEffect(() => {
    // Challenge 1: The Classic 1/√6 Skew Distance (d ≈ 0.408)
    if (Math.abs(shortestDistance - 0.408) < 0.03 && !challengeCompleted['threed_skew_classic']) {
      completeChallenge('threed_skew_classic', 40);
      successBuzz();
      playChime();
      confetti({ particleCount: 35, spread: 60 });
      trackEvent('challenge_completed', { challengeId: 'threed_skew_classic' });
    }

    // Challenge 2: Intersecting Lines (d = 0, Coplanar)
    if (shortestDistance < 0.05 && lineMode === 'intersecting' && !challengeCompleted['threed_coplanar']) {
      completeChallenge('threed_coplanar', 40);
      successBuzz();
      playChime();
      confetti({ particleCount: 40, spread: 65 });
      trackEvent('challenge_completed', { challengeId: 'threed_coplanar' });
    }

    // Challenge 3: 3D Camera Orbit Exploration
    if ((cameraOrbitX > 45 || cameraOrbitX < -45) && !challengeCompleted['threed_orbit_cam']) {
      completeChallenge('threed_orbit_cam', 35);
      successBuzz();
      playChime();
      trackEvent('challenge_completed', { challengeId: 'threed_orbit_cam' });
    }
  }, [
    shortestDistance,
    lineMode,
    cameraOrbitX,
    challengeCompleted,
    completeChallenge,
    successBuzz,
    playChime,
    trackEvent,
  ]);

  const challengeLevels: ChallengeLevel[] = [
    {
      levelNumber: 1,
      title: 'The Classic 1/√6 Skew Distance (0.41 u)',
      badge: '3D Spatialist',
      description: 'Set lines to standard CBSE exam configuration. Verify that the shortest distance equals exactly 1/√6 ≈ 0.408 units!',
      requirementFormula: 'd = \\frac{|1|}{\\sqrt{6}} = \\frac{1}{\\sqrt{6}} \\approx 0.408',
      targetCriteria: 'Configure standard skew lines with d ≈ 0.408',
      xpReward: 40,
      tier1Hint: 'Line 1: a₁ = (1, 2, 3), b₁ = (2, 3, 4). Line 2: a₂ = (2, 4, 5), b₂ = (3, 4, 5).',
      tier2Hint: 'Notice the cross product b₁ × b₂ is (-1, 2, -1) with magnitude √6.',
      tier3Hint: 'Check the Shortest Distance gauge showing 0.408 units.',
      autoPreset: () => {
        updateThreeDParams({
          lineMode: 'skew',
          pointA1: [1, 2, 3],
          dirB1: [2, 3, 4],
          pointA2: [2, 4, 5],
          dirB2: [3, 4, 5],
        });
      },
    },
    {
      levelNumber: 2,
      title: 'Coplanar Intersecting Lines (d = 0.00)',
      badge: 'Coplanar Prover',
      description: 'Switch to Intersecting mode where (a₂ - a₁)·(b₁ × b₂) = 0, proving the lines lie in the exact same plane and collide!',
      requirementFormula: '(\\vec{a}_2 - \\vec{a}_1) \\cdot (\\vec{b}_1 \\times \\vec{b}_2) = 0 \\implies d = 0',
      targetCriteria: 'Select Intersecting mode with d = 0',
      xpReward: 40,
      tier1Hint: 'Tap "Intersecting" in the Line Mode switcher.',
      tier2Hint: 'Observe both lines meeting at an exact intersection point.',
      tier3Hint: 'Notice the scalar triple product becomes 0.',
      autoPreset: () => {
        updateThreeDParams({
          lineMode: 'intersecting',
          pointA1: [1, 1, 1],
          dirB1: [1, 2, 3],
          pointA2: [3, 5, 7],
          dirB2: [1, 1, 1],
        });
      },
    },
    {
      levelNumber: 3,
      title: '3D Orbit Camera Inspection',
      badge: 'Perspective Navigator',
      description: 'Drag anywhere on the 3D canvas to orbit past 45° elevation to inspect the common perpendicular from all angles!',
      requirementFormula: '|\\text{Orbit Angle}| \\ge 45^\\circ',
      targetCriteria: 'Orbit camera elevation past 45°',
      xpReward: 40,
      tier1Hint: 'Click and drag on the 3D space grid.',
      tier2Hint: 'Rotate vertically to view the lines from an elevated perspective.',
      tier3Hint: 'Notice how the common perpendicular segment connects both lines orthogonally.',
      autoPreset: () => {
        updateThreeDParams({ cameraOrbitX: 50, cameraOrbitY: 45 });
      },
    },
  ];

  // 3D Canvas Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Clear
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2 + 10;
    const scale = Math.min(width, height) / 14;

    // 3D rotation angles in radians
    const rotX = (cameraOrbitX * Math.PI) / 180;
    const rotY = (cameraOrbitY * Math.PI) / 180;

    // 3D Projection Helper
    const project = (x: number, y: number, z: number) => {
      // Rotate around Y axis
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const x1 = x * cosY + z * sinY;
      const y1 = y;
      const z1 = -x * sinY + z * cosY;

      // Rotate around X axis
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const x2 = x1;
      const y2 = y1 * cosX - z1 * sinX;
      const z2 = y1 * sinX + z1 * cosX;

      // Perspective projection
      const distCam = 18;
      const fov = distCam / (distCam + z2);
      return {
        px: cx + x2 * scale * fov,
        py: cy - y2 * scale * fov,
        depth: z2,
      };
    };

    // Draw 3D Ground Grid (XZ plane)
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let g = -5; g <= 5; g++) {
      const pA = project(g, 0, -5);
      const pB = project(g, 0, 5);
      ctx.beginPath();
      ctx.moveTo(pA.px, pA.py);
      ctx.lineTo(pB.px, pB.py);
      ctx.stroke();

      const pC = project(-5, 0, g);
      const pD = project(5, 0, g);
      ctx.beginPath();
      ctx.moveTo(pC.px, pC.py);
      ctx.lineTo(pD.px, pD.py);
      ctx.stroke();
    }

    // Draw 3D Axes
    const o = project(0, 0, 0);
    const axX = project(5, 0, 0);
    const axY = project(0, 5, 0);
    const axZ = project(0, 0, 5);

    // X-axis (Red)
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(o.px, o.py);
    ctx.lineTo(axX.px, axX.py);
    ctx.stroke();

    // Y-axis (Green)
    ctx.strokeStyle = '#10b981';
    ctx.beginPath();
    ctx.moveTo(o.px, o.py);
    ctx.lineTo(axY.px, axY.py);
    ctx.stroke();

    // Z-axis (Blue)
    ctx.strokeStyle = '#3b82f6';
    ctx.beginPath();
    ctx.moveTo(o.px, o.py);
    ctx.lineTo(axZ.px, axZ.py);
    ctx.stroke();

    // Draw Line 1: r1 = a1 + λ b1 (Cyan)
    const l1Start = project(a1x - 3 * b1x, a1y - 3 * b1y, a1z - 3 * b1z);
    const l1End = project(a1x + 3 * b1x, a1y + 3 * b1y, a1z + 3 * b1z);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(l1Start.px, l1Start.py);
    ctx.lineTo(l1End.px, l1End.py);
    ctx.stroke();

    // Line 1 point a1
    const ptA1 = project(a1x, a1y, a1z);
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(ptA1.px, ptA1.py, 5, 0, Math.PI * 2);
    ctx.fill();

    // Draw Line 2: r2 = a2 + μ b2 (Amber)
    const l2Start = project(a2x - 3 * b2x, a2y - 3 * b2y, a2z - 3 * b2z);
    const l2End = project(a2x + 3 * b2x, a2y + 3 * b2y, a2z + 3 * b2z);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(l2Start.px, l2Start.py);
    ctx.lineTo(l2End.px, l2End.py);
    ctx.stroke();

    // Line 2 point a2
    const ptA2 = project(a2x, a2y, a2z);
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(ptA2.px, ptA2.py, 5, 0, Math.PI * 2);
    ctx.fill();

    // Shortest Distance Common Perpendicular Segment PQ
    if (showShortestSegment) {
      const projP = project(pointP[0], pointP[1], pointP[2]);
      const projQ = project(pointQ[0], pointQ[1], pointQ[2]);

      ctx.strokeStyle = '#ec4899';
      ctx.lineWidth = 3.5;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.moveTo(projP.px, projP.py);
      ctx.lineTo(projQ.px, projQ.py);
      ctx.stroke();
      ctx.setLineDash([]);

      // Point P on L1
      ctx.fillStyle = '#ec4899';
      ctx.beginPath();
      ctx.arc(projP.px, projP.py, 5, 0, Math.PI * 2);
      ctx.fill();

      // Point Q on L2
      ctx.beginPath();
      ctx.arc(projQ.px, projQ.py, 5, 0, Math.PI * 2);
      ctx.fill();

      // Shortest Distance Label in 3D
      ctx.fillStyle = '#f43f5e';
      ctx.font = 'bold 11px monospace';
      ctx.fillText(`d = ${shortestDistance.toFixed(3)} u`, (projP.px + projQ.px) / 2 + 8, (projP.py + projQ.py) / 2);
    }
  }, [
    pointA1,
    dirB1,
    pointA2,
    dirB2,
    showShortestSegment,
    cameraOrbitX,
    cameraOrbitY,
    pointP,
    pointQ,
    shortestDistance,
  ]);

  // Touch & Pointer Drag for Orbiting 3D Camera
  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;
    lastMousePos.current = { x: e.clientX, y: e.clientY };

    updateThreeDParams({
      cameraOrbitY: cameraOrbitY + dx * 0.6,
      cameraOrbitX: Math.max(-80, Math.min(80, cameraOrbitX + dy * 0.6)),
    });
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  return (
    <div className="w-full h-full flex flex-col relative select-none">
      {/* Center Interactive 3D Canvas */}
      <div 
        className="w-full flex-1 flex flex-col items-center justify-center p-2 sm:p-4 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden relative cursor-grab active:cursor-grabbing"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* Real-time Math HUD Banner */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none z-10 px-2">
          <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-700/80 px-2.5 py-1 rounded-xl shadow-lg backdrop-blur-md">
            <Boxes className="w-4 h-4 text-cyan-400" />
            <span className="text-[11px] font-mono font-bold text-cyan-300">
              d = |(a₂-a₁)·(b₁×b₂)| / |b₁×b₂|
            </span>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 px-2.5 py-1 rounded-xl shadow-lg backdrop-blur-md">
            <span className="text-[11px] font-mono text-slate-300">
              Distance:{' '}
              <strong className="text-pink-400 font-bold">{shortestDistance.toFixed(3)} u</strong>
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-[11px] font-mono text-slate-300">
              |b₁×b₂|: <strong className="text-cyan-400">{crossMag.toFixed(2)}</strong>
            </span>
          </div>
        </div>

        {/* 3D Canvas Viewport */}
        <div className="w-full max-w-xl flex-1 max-h-[62vh] relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
          <canvas ref={canvasRef} className="w-full h-full block" />
        </div>

        {/* Live Calculation Ratio Ribbon */}
        <div className="w-full max-w-xl mt-2 grid grid-cols-3 gap-1.5 text-center">
          <div className="p-2 rounded-xl bg-slate-900/90 border border-cyan-500/30">
            <span className="text-[9px] uppercase tracking-wider text-slate-400 block">Line 1 (L₁)</span>
            <span className="text-xs sm:text-sm font-bold font-mono text-cyan-400">
              ({b1x}, {b1y}, {b1z})
            </span>
          </div>

          <div className="p-2 rounded-xl bg-slate-900/90 border border-amber-500/30">
            <span className="text-[9px] uppercase tracking-wider text-slate-400 block">Line 2 (L₂)</span>
            <span className="text-xs sm:text-sm font-bold font-mono text-amber-400">
              ({b2x}, {b2y}, {b2z})
            </span>
          </div>

          <div className="p-2 rounded-xl bg-slate-900/90 border border-pink-500/30">
            <span className="text-[9px] uppercase tracking-wider text-slate-400 block">Shortest Distance d</span>
            <span className="text-xs sm:text-sm font-bold font-mono text-pink-400">
              {shortestDistance.toFixed(3)} units
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Sheet Controls & Right Sidebar Theory */}
      <BottomSheet
        title="3D Skew Lines & Shortest Distance"
        quickEquation="d = \frac{|(\vec{a}_2 - \vec{a}_1) \cdot (\vec{b}_1 \times \vec{b}_2)|}{|\vec{b}_1 \times \vec{b}_2|}"
        onReset={() => resetParams('three-d-geometry-lab')}
        theoryContent={
          <CoachTheoryModule
            simulatorId="three-d-geometry-lab"
            extraLiveDetails={
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between text-cyan-400">
                  <span>Cross Product Normal b₁ × b₂:</span>
                  <span className="font-bold">({crossB[0]}, {crossB[1]}, {crossB[2]})</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-slate-950/70 p-1.5 rounded border border-slate-800">
                    <span className="text-slate-400 block">Scalar Product:</span>
                    <span className="text-pink-400 font-bold">{dotScalar.toFixed(2)}</span>
                  </div>
                  <div className="bg-slate-950/70 p-1.5 rounded border border-slate-800">
                    <span className="text-slate-400 block">Normal Mag |n|:</span>
                    <span className="text-emerald-400 font-bold">{crossMag.toFixed(3)}</span>
                  </div>
                </div>
              </div>
            }
          />
        }
        challengeContent={
          <ChallengeManager
            simulatorId="three-d-geometry-lab"
            simulatorTitle="3D Skew Lines & Planes"
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
          {/* Line Mode Switcher */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Spatial Line Configuration
            </label>
            <div className="grid grid-cols-3 gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => {
                  updateThreeDParams({
                    lineMode: 'skew',
                    pointA1: [1, 2, 3],
                    dirB1: [2, 3, 4],
                    pointA2: [2, 4, 5],
                    dirB2: [3, 4, 5],
                  });
                  playClick();
                  lightTap();
                }}
                className={`py-1.5 text-[11px] font-semibold rounded-lg transition-all cursor-pointer ${
                  lineMode === 'skew'
                    ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Classic Skew
              </button>
              <button
                type="button"
                onClick={() => {
                  updateThreeDParams({
                    lineMode: 'intersecting',
                    pointA1: [1, 1, 1],
                    dirB1: [1, 2, 3],
                    pointA2: [3, 5, 7],
                    dirB2: [1, 1, 1],
                  });
                  playClick();
                  lightTap();
                }}
                className={`py-1.5 text-[11px] font-semibold rounded-lg transition-all cursor-pointer ${
                  lineMode === 'intersecting'
                    ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Intersecting (d=0)
              </button>
              <button
                type="button"
                onClick={() => {
                  updateThreeDParams({
                    lineMode: 'parallel',
                    pointA1: [1, 1, 1],
                    dirB1: [2, 3, 4],
                    pointA2: [2, 4, 1],
                    dirB2: [2, 3, 4],
                  });
                  playClick();
                  lightTap();
                }}
                className={`py-1.5 text-[11px] font-semibold rounded-lg transition-all cursor-pointer ${
                  lineMode === 'parallel'
                    ? 'bg-purple-500 text-white shadow-md font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Parallel Lines
              </button>
            </div>
          </div>

          {/* Line 1 Direction Slider */}
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-cyan-400">Line 1 Vector b₁ (X component)</span>
              <span className="text-xs font-mono font-bold text-cyan-300">{b1x}</span>
            </div>
            <TouchSlider
              label="b₁x"
              value={b1x}
              min={-4}
              max={4}
              step={1}
              unit=""
              onChange={(val) => updateThreeDParams({ dirB1: [val, b1y, b1z] })}
            />
          </div>

          {/* Line 2 Position Slider */}
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-400">Line 2 Point a₂ (Z component)</span>
              <span className="text-xs font-mono font-bold text-amber-300">{a2z}</span>
            </div>
            <TouchSlider
              label="a₂z"
              value={a2z}
              min={0}
              max={8}
              step={0.5}
              unit=""
              onChange={(val) => updateThreeDParams({ pointA2: [a2x, a2y, val] })}
            />
          </div>

          {/* Visual Toggles */}
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 text-xs">Show Shortest Distance Segment (PQ)</span>
              <button
                type="button"
                onClick={() => updateThreeDParams({ showShortestSegment: !showShortestSegment })}
                className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                  showShortestSegment ? 'bg-pink-500' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${
                    showShortestSegment ? 'left-4.5' : 'left-0.5'
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
