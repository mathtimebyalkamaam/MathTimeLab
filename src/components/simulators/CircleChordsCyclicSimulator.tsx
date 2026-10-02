/**
 * CircleChordsCyclicSimulator.tsx: Interactive Chord Theorems & Cyclic Quadrilaterals (Class 9 Geometry).
 * Features:
 * - Dynamic 2D Canvas with high-DPI rendering
 * - Perpendicular Bisector Theorem: perpendicular from center O to chord AB bisects chord (AM = MB)
 * - The Chord Pythagoras Theorem: R² = d² + (L/2)²
 * - Cyclic Quadrilateral mode: draggable vertices A, B, C, D on circular circumference
 * - Live real-time angle display proving opposite angles sum to 180.0°: ∠A + ∠C = 180°
 * - Off-circle vertex distortion: pull vertex D outside or inside circle to prove the non-cyclic break
 * - 3 Progressive board exam challenges
 */
import React, { useEffect, useRef, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { 
  Circle, 
  RotateCcw, 
  CheckCircle2, 
  Compass, 
  Sliders, 
  Eye, 
  Sparkles,
  Maximize2,
  Square
} from 'lucide-react';
import { useSimulatorStore } from '../../store/useSimulatorStore';
import { BottomSheet } from '../layout/BottomSheet';
import { TouchSlider } from '../common/TouchSlider';
import { CoachTheoryModule } from '../common/CoachTheoryModule';
import { ChallengeManager, ChallengeLevel } from '../common/ChallengeManager';
import { useHaptics } from '../../hooks/useHaptics';
import { useSound } from '../common/SoundManager';
import { useAnalytics } from '../../hooks/useAnalytics';

export const CircleChordsCyclicSimulator: React.FC = () => {
  const {
    circleChordsParams,
    updateCircleChordsParams,
    resetParams,
    completeChallenge,
    challengeCompleted,
    isZenMode,
  } = useSimulatorStore();

  const {
    mode,
    circleRadius,
    chordDistance,
    angleA,
    angleB,
    angleC,
    angleD,
    vertexDOffset,
    showAuxiliaryRadii,
    showSupplementarySum,
    showRightAngleMark,
  } = circleChordsParams;

  const { lightTap, successBuzz } = useHaptics();
  const { playClick, playChime } = useSound();
  const { trackEvent } = useAnalytics();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeVertex, setActiveVertex] = useState<'A' | 'B' | 'C' | 'D' | null>(null);

  // Angular positions of cyclic quadrilateral vertices around center (in radians)
  // Let vertex A be at 0.5 rad (~30°), B at 1.8 rad (~105°), C at 3.3 rad (~190°), D at 5.0 rad (~285°)
  const [thetaA, setThetaA] = useState(0.4);
  const [thetaB, setThetaB] = useState(1.9);
  const [thetaC, setThetaC] = useState(3.4);
  const [thetaD, setThetaD] = useState(5.1);

  // Chord calculations
  // Clamp chordDistance to less than radius
  const clampedD = Math.min(circleRadius - 0.2, Math.max(0.5, chordDistance));
  const halfChord = Math.sqrt(Math.max(0, circleRadius * circleRadius - clampedD * clampedD));
  const chordLength = 2 * halfChord;

  // Board Exam Challenges Evaluation
  useEffect(() => {
    // Challenge 1: Pythagoras Chord Triplet 6-8-10
    if (
      mode === 'perpendicular-chord' &&
      Math.abs(circleRadius - 10) < 0.4 &&
      Math.abs(clampedD - 6) < 0.3 &&
      !challengeCompleted['chord_triplet_6_8_10']
    ) {
      completeChallenge('chord_triplet_6_8_10', 40);
      successBuzz();
      playChime();
      confetti({ particleCount: 40, spread: 60 });
      trackEvent('challenge_completed', { challengeId: 'chord_triplet_6_8_10' });
    }

    // Challenge 2: Cyclic 180 Supplementary Discovery
    if (
      mode === 'cyclic-quadrilateral' &&
      vertexDOffset === 0 &&
      showSupplementarySum &&
      !challengeCompleted['cyclic_180_proof']
    ) {
      completeChallenge('cyclic_180_proof', 45);
      successBuzz();
      playChime();
      confetti({ particleCount: 45, spread: 65 });
      trackEvent('challenge_completed', { challengeId: 'cyclic_180_proof' });
    }

    // Challenge 3: Off-Circle Non-Cyclic Break
    if (
      mode === 'cyclic-quadrilateral' &&
      Math.abs(vertexDOffset) > 1.2 &&
      !challengeCompleted['cyclic_breaker']
    ) {
      completeChallenge('cyclic_breaker', 50);
      successBuzz();
      playChime();
      confetti({ particleCount: 50, spread: 70 });
      trackEvent('challenge_completed', { challengeId: 'cyclic_breaker' });
    }
  }, [
    mode,
    circleRadius,
    clampedD,
    vertexDOffset,
    showSupplementarySum,
    challengeCompleted,
    completeChallenge,
    successBuzz,
    playChime,
    trackEvent,
  ]);

  // Canvas Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;

    const render = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      // Deep space grid
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      const gridSize = 24;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      const centerX = width / 2;
      const centerY = height / 2 - 10;
      const scale = Math.min(width, height) / 24; // 24 units across
      const rPx = circleRadius * scale;

      // Draw Main Circle
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(centerX, centerY, rPx, 0, Math.PI * 2);
      ctx.stroke();

      // Center point O
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('O', centerX - 14, centerY - 8);

      if (mode === 'perpendicular-chord' || mode === 'equal-chords') {
        // Horizontal Chord AB at distance clampedD from center
        const dPx = clampedD * scale;
        const hPx = halfChord * scale;
        const chordY = centerY + dPx;
        const ax = centerX - hPx;
        const bx = centerX + hPx;

        // Perpendicular segment OM from center to chord
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX, chordY);
        ctx.stroke();

        // Right angle marker at M
        if (showRightAngleMark) {
          const squareSize = 10;
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(centerX, chordY - squareSize, squareSize, squareSize);
        }

        // Chord AB
        ctx.strokeStyle = '#34d399';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(ax, chordY);
        ctx.lineTo(bx, chordY);
        ctx.stroke();

        // Radii OA and OB (hypotenuse)
        if (showAuxiliaryRadii) {
          ctx.strokeStyle = 'rgba(168, 85, 247, 0.7)';
          ctx.lineWidth = 2;
          ctx.setLineDash([4, 3]);
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(ax, chordY);
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(bx, chordY);
          ctx.stroke();
          ctx.setLineDash([]);

          ctx.fillStyle = '#c084fc';
          ctx.font = 'bold 11px monospace';
          ctx.fillText(`R = ${circleRadius}`, (centerX + ax) / 2 - 16, (centerY + chordY) / 2);
        }

        // Midpoint marker M
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(centerX, chordY, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('M', centerX + 6, chordY + 16);

        // Endpoints A and B
        ctx.fillStyle = '#34d399';
        ctx.beginPath();
        ctx.arc(ax, chordY, 4.5, 0, Math.PI * 2);
        ctx.arc(bx, chordY, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('A', ax - 16, chordY + 4);
        ctx.fillText('B', bx + 8, chordY + 4);

        // Labels for bisected lengths
        ctx.fillStyle = '#34d399';
        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`AM = ${halfChord.toFixed(1)}`, (ax + centerX) / 2, chordY + 16);
        ctx.fillText(`MB = ${halfChord.toFixed(1)}`, (bx + centerX) / 2, chordY + 16);
        ctx.fillStyle = '#f59e0b';
        ctx.fillText(`d = ${clampedD.toFixed(1)}`, centerX - 18, (centerY + chordY) / 2);
      } else if (mode === 'cyclic-quadrilateral') {
        // Cyclic Quadrilateral ABCD
        const posA = { x: centerX + rPx * Math.cos(thetaA), y: centerY + rPx * Math.sin(thetaA) };
        const posB = { x: centerX + rPx * Math.cos(thetaB), y: centerY + rPx * Math.sin(thetaB) };
        const posC = { x: centerX + rPx * Math.cos(thetaC), y: centerY + rPx * Math.sin(thetaC) };
        // Vertex D with distortion offset
        const rD = (circleRadius + vertexDOffset) * scale;
        const posD = { x: centerX + rD * Math.cos(thetaD), y: centerY + rD * Math.sin(thetaD) };

        // Draw Quadrilateral Polygon
        ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(posA.x, posA.y);
        ctx.lineTo(posB.x, posB.y);
        ctx.lineTo(posC.x, posC.y);
        ctx.lineTo(posD.x, posD.y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Calculate interior angles at B and D
        const calcAngle = (pPrev: { x: number; y: number }, pCurr: { x: number; y: number }, pNext: { x: number; y: number }) => {
          const v1 = { x: pPrev.x - pCurr.x, y: pPrev.y - pCurr.y };
          const v2 = { x: pNext.x - pCurr.x, y: pNext.y - pCurr.y };
          const dot = v1.x * v2.x + v1.y * v2.y;
          const m1 = Math.hypot(v1.x, v1.y);
          const m2 = Math.hypot(v2.x, v2.y);
          const cosVal = Math.max(-1, Math.min(1, dot / (m1 * m2)));
          return (Math.acos(cosVal) * 180) / Math.PI;
        };

        const degA = calcAngle(posD, posA, posB);
        const degB = calcAngle(posA, posB, posC);
        const degC = calcAngle(posB, posC, posD);
        const degD = calcAngle(posC, posD, posA);

        const sumOpposite1 = degA + degC;
        const sumOpposite2 = degB + degD;

        // Draw Angle arcs
        const drawAngleArc = (pCurr: { x: number; y: number }, p1: { x: number; y: number }, p2: { x: number; y: number }, color: string, text: string) => {
          const a1 = Math.atan2(p1.y - pCurr.y, p1.x - pCurr.x);
          const a2 = Math.atan2(p2.y - pCurr.y, p2.x - pCurr.x);
          ctx.strokeStyle = color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(pCurr.x, pCurr.y, 22, Math.min(a1, a2), Math.max(a1, a2));
          ctx.stroke();
          ctx.fillStyle = color;
          ctx.font = 'bold 11px monospace';
          ctx.fillText(text, pCurr.x + 8, pCurr.y - 8);
        };

        drawAngleArc(posA, posD, posB, '#ec4899', `∠A=${degA.toFixed(1)}°`);
        drawAngleArc(posB, posA, posC, '#38bdf8', `∠B=${degB.toFixed(1)}°`);
        drawAngleArc(posC, posB, posD, '#ec4899', `∠C=${degC.toFixed(1)}°`);
        drawAngleArc(posD, posC, posA, '#38bdf8', `∠D=${degD.toFixed(1)}°`);

        // Vertices markers
        const vertices = [
          { p: posA, label: 'A', col: '#ec4899' },
          { p: posB, label: 'B', col: '#38bdf8' },
          { p: posC, label: 'C', col: '#ec4899' },
          { p: posD, label: 'D', col: vertexDOffset === 0 ? '#38bdf8' : '#f59e0b' },
        ];

        vertices.forEach((v) => {
          ctx.fillStyle = v.col;
          ctx.beginPath();
          ctx.arc(v.p.x, v.p.y, 5.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        });

        // Live sum banner
        if (showSupplementarySum) {
          const isExact180 = Math.abs(sumOpposite1 - 180) < 0.5;
          ctx.fillStyle = isExact180 ? '#34d399' : '#f87171';
          ctx.font = 'bold 13px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(
            `Opposite Sum: ∠A + ∠C = ${degA.toFixed(1)}° + ${degC.toFixed(1)}° = ${sumOpposite1.toFixed(1)}° ${isExact180 ? '✓ (180° Exact!)' : '✗ (Non-Cyclic!)'}`,
            centerX,
            centerY + rPx + 36
          );
        }
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    window.addEventListener('resize', render);
    return () => {
      window.removeEventListener('resize', render);
      cancelAnimationFrame(animId);
    };
  }, [
    mode,
    circleRadius,
    clampedD,
    halfChord,
    thetaA,
    thetaB,
    thetaC,
    thetaD,
    vertexDOffset,
    showAuxiliaryRadii,
    showSupplementarySum,
    showRightAngleMark,
  ]);

  // Touch and Drag handlers for cyclic quad vertices
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (mode !== 'cyclic-quadrilateral') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2 - 10;
    const angle = Math.atan2(y - centerY, x - centerX);
    const normalizedAngle = angle < 0 ? angle + Math.PI * 2 : angle;

    // Detect closest vertex
    const diffs = [
      { v: 'A', diff: Math.abs(normalizedAngle - thetaA) },
      { v: 'B', diff: Math.abs(normalizedAngle - thetaB) },
      { v: 'C', diff: Math.abs(normalizedAngle - thetaC) },
      { v: 'D', diff: Math.abs(normalizedAngle - thetaD) },
    ];
    diffs.sort((a, b) => a.diff - b.diff);
    if (diffs[0].diff < 0.6) {
      setActiveVertex(diffs[0].v as any);
      lightTap();
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!activeVertex || mode !== 'cyclic-quadrilateral') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2 - 10;
    let angle = Math.atan2(y - centerY, x - centerX);
    if (angle < 0) angle += Math.PI * 2;

    if (activeVertex === 'A') setThetaA(angle);
    else if (activeVertex === 'B') setThetaB(angle);
    else if (activeVertex === 'C') setThetaC(angle);
    else if (activeVertex === 'D') setThetaD(angle);
  };

  const handlePointerUp = () => {
    setActiveVertex(null);
  };

  const challengeLevels: ChallengeLevel[] = [
    {
      levelNumber: 1,
      title: 'The 6-8-10 Chord Triplet',
      badge: 'Pythagorean Chord',
      description: 'Set circle radius R = 10 and chord distance d = 6. Verify why half-chord AM equals 8, making the full chord length 16 cm!',
      requirementFormula: 'R^2 = d^2 + (L/2)^2 \\implies 10^2 = 6^2 + 8^2',
      targetCriteria: 'R = 10, d = 6',
      xpReward: 40,
      autoPreset: () => updateCircleChordsParams({ mode: 'perpendicular-chord', circleRadius: 10, chordDistance: 6 }),
    },
    {
      levelNumber: 2,
      title: 'The 180° Cyclic Discovery',
      badge: 'Supplementary Proof',
      description: 'Switch to Cyclic Quadrilateral mode. Drag vertices A and C anywhere around the circle. Observe why their opposite angle sum stays exactly 180.0°!',
      requirementFormula: '\\angle A + \\angle C = 180^\\circ',
      targetCriteria: 'Cyclic quad with vertex offset 0',
      xpReward: 45,
      autoPreset: () => updateCircleChordsParams({ mode: 'cyclic-quadrilateral', vertexDOffset: 0, showSupplementarySum: true }),
    },
    {
      levelNumber: 3,
      title: 'The Off-Circle Angle Breaker',
      badge: 'Cyclic Violator',
      description: 'Slide "Pull Vertex D Off Circle" past +1.5. Watch how pulling vertex D outside breaks the cyclic condition (opposite sum drops below 180°)!',
      requirementFormula: '\\angle A + \\angle C \\neq 180^\\circ \\quad \\text{(non-cyclic)}',
      targetCriteria: 'Vertex D Offset > 1.2',
      xpReward: 50,
      autoPreset: () => updateCircleChordsParams({ mode: 'cyclic-quadrilateral', vertexDOffset: 2.0, showSupplementarySum: true }),
    },
  ];

  return (
    <div className="relative w-full h-full flex flex-col bg-slate-950 text-slate-100 overflow-hidden select-none">
      {/* HUD Header Bar */}
      <div className="flex-none px-4 py-2 bg-slate-900/90 border-b border-slate-800 backdrop-blur-md flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <Circle className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold text-slate-200">
            {mode === 'perpendicular-chord' ? 'PERPENDICULAR BISECTOR' : 'CYCLIC QUADRILATERAL'}
          </span>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/40">
            {mode === 'perpendicular-chord' && `Chord L = ${chordLength.toFixed(1)} · d = ${clampedD.toFixed(1)}`}
            {mode === 'cyclic-quadrilateral' && (vertexDOffset === 0 ? 'Cyclic: ∠A + ∠C = 180.0°' : 'Non-Cyclic: Off Circumference')}
          </span>
        </div>

        <button
          onClick={() => {
            resetParams('circle-chords-cyclic');
            playClick();
            lightTap();
          }}
          className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-all cursor-pointer"
          title="Reset Parameters"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Interactive Canvas */}
      <div className="relative flex-1 w-full h-full min-h-[300px] overflow-hidden">
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="w-full h-full block cursor-crosshair"
        />

        {/* Floating Theorem Box */}
        <div className="absolute top-3 left-3 pointer-events-none bg-slate-900/85 backdrop-blur-md p-2.5 rounded-xl border border-slate-800/80 shadow-xl max-w-xs text-xs space-y-1">
          <div className="text-[11px] font-bold text-cyan-300 uppercase tracking-wide">
            {mode === 'perpendicular-chord' ? 'Theorem: OM ⊥ AB ⟹ AM = MB' : 'Theorem: Cyclic Quad ∠A + ∠C = 180°'}
          </div>
          <div className="text-slate-300 font-mono text-[11px]">
            {mode === 'perpendicular-chord'
              ? `R² = d² + (L/2)² ⟹ ${circleRadius}² = ${clampedD.toFixed(1)}² + ${halfChord.toFixed(1)}²`
              : 'Opposite angles intercept arcs covering all 360°!'}
          </div>
          <div className="text-amber-400 text-[10px] flex items-center gap-1 font-semibold">
            <Sparkles className="w-3 h-3" />
            <span>{mode === 'perpendicular-chord' ? 'Radius R is always Hypotenuse' : 'Drag vertices A, B, C, D directly'}</span>
          </div>
        </div>
      </div>

      {/* Collapsible Bottom Sheet */}
      <BottomSheet
        title="Chords & Cyclic Quadrilateral Lab"
        badgeLabel={`Mode: ${mode === 'perpendicular-chord' ? 'Chord Bisector' : 'Cyclic 180°'}`}
        quickEquation={mode === 'perpendicular-chord' ? 'R^2 = d^2 + (L/2)^2' : '\\angle A + \\angle C = 180^\\circ'}
        onReset={() => resetParams('circle-chords-cyclic')}
        theoryContent={<CoachTheoryModule simulatorId="circle-chords-cyclic" />}
        challengeContent={
          <div className="space-y-4">
            <ChallengeManager
              simulatorId="circle-chords-cyclic"
              simulatorTitle="The Circle Chord & Cyclic Quad Lab"
              levels={challengeLevels}
              onTriggerPreset={(lvl: number) => {
                const targetLvl = challengeLevels.find((l) => l.levelNumber === lvl);
                targetLvl?.autoPreset?.();
              }}
              isOpenDefault={true}
            />
          </div>
        }
      >
        <div className="space-y-4 text-xs">
          {/* Mode Switcher */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Theorem Mode
            </label>
            <div className="grid grid-cols-2 gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => {
                  updateCircleChordsParams({ mode: 'perpendicular-chord' });
                  playClick();
                  lightTap();
                }}
                className={`py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  mode === 'perpendicular-chord'
                    ? 'bg-cyan-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Chord Bisector
              </button>
              <button
                onClick={() => {
                  updateCircleChordsParams({ mode: 'cyclic-quadrilateral' });
                  playClick();
                  lightTap();
                }}
                className={`py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  mode === 'cyclic-quadrilateral'
                    ? 'bg-cyan-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Cyclic Quad 180°
              </button>
            </div>
          </div>

          {/* Radius Slider */}
          <TouchSlider
            label="Circle Radius (R)"
            value={circleRadius}
            min={5}
            max={12}
            step={0.5}
            unit="cm"
            onChange={(val) => updateCircleChordsParams({ circleRadius: val })}
          />

          {/* Perpendicular Chord controls */}
          {mode === 'perpendicular-chord' && (
            <>
              <TouchSlider
                label="Distance from Center to Chord (d)"
                value={chordDistance}
                min={1}
                max={circleRadius - 0.5}
                step={0.2}
                unit="cm"
                onChange={(val) => updateCircleChordsParams({ chordDistance: val })}
              />

              <div className="flex items-center justify-between pt-1">
                <label className="text-slate-300 font-medium">Show Auxiliary Radii OA & OB</label>
                <button
                  onClick={() => updateCircleChordsParams({ showAuxiliaryRadii: !showAuxiliaryRadii })}
                  className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer ${
                    showAuxiliaryRadii ? 'bg-cyan-500' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                      showAuxiliaryRadii ? 'left-5' : 'left-1'
                    }`}
                  />
                </button>
              </div>
            </>
          )}

          {/* Cyclic Quad controls */}
          {mode === 'cyclic-quadrilateral' && (
            <>
              <TouchSlider
                label="Pull Vertex D Off Circle (Breaks Cyclic condition!)"
                value={vertexDOffset}
                min={-3}
                max={3}
                step={0.2}
                unit="cm"
                onChange={(val) => updateCircleChordsParams({ vertexDOffset: val })}
              />

              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[11px] font-bold text-amber-400 block">Pro Tip for Board Exams</span>
                <p className="text-[11px] text-slate-300">
                  Touch & drag vertices A, B, C, D directly around the circular circumference. Notice that no matter how you stretch or skew the quadrilateral, opposite angles strictly sum to 180°!
                </p>
              </div>
            </>
          )}
        </div>
      </BottomSheet>
    </div>
  );
};
