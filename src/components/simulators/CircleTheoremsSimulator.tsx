/**
 * CircleTheoremsSimulator.tsx: Interactive Tangent Theorems & Inscribed Angles (Class 9 & 10).
 * Features:
 * - Touch & drag external point P with dynamic tangent lines PA and PB
 * - Demonstrates why tangents from external point are equal: PA = PB = √(d² - R²)
 * - Demonstrates radius-tangent perpendicularity (OA ⊥ PA, OB ⊥ PB at 90°)
 * - Visual RHS Congruence breakdown (ΔOPA ≅ ΔOPB)
 * - Inscribed angle theorem: ∠AOB = 2 · ∠ACB anywhere on the major arc
 * - Pure KaTeX coaching theory module and structured board exam challenges
 */
import React, { useEffect, useRef, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  RotateCcw, 
  CheckCircle2, 
  Compass, 
  Sliders, 
  Eye, 
  Maximize2,
  Target,
  CircleDot,
  Search,
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
import { drawGripAffordance, drawShadowDrops, CriticalEventFlareManager, drawMagnifierLoupe } from '../../utils/canvasFx';
import { useSnapshotHistory } from '../../hooks/useSnapshotHistory';
import { ExamCheatSheetModal } from '../common/ExamCheatSheetModal';
import { DualViewInspectorModal } from '../common/DualViewInspectorModal';

export const CircleTheoremsSimulator: React.FC = () => {
  const {
    circleTheoremsParams,
    updateCircleTheoremsParams,
    resetParams,
    completeChallenge,
    challengeCompleted,
    isZenMode,
  } = useSimulatorStore();

  const {
    radius,
    pointDistance,
    pointAngleDeg,
    showTangents,
    showRadii,
    showCongruentTriangles,
    showInscribedAngle,
    inscribedVertexAngleDeg,
  } = circleTheoremsParams;

  const { lightTap, successBuzz } = useHaptics();
  const { playClick, playChime, playPitchTone } = useSound();
  const { trackEvent } = useAnalytics();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const flareManagerRef = useRef(new CriticalEventFlareManager());
  const [dragTarget, setDragTarget] = useState<'P' | 'C' | null>(null);

  // Recommendations 11-15 state
  const [showLoupe, setShowLoupe] = useState(false);
  const [showCheatSheet, setShowCheatSheet] = useState(false);
  const [showDualView, setShowDualView] = useState(false);

  // Recommendation 14: Time-Travel Parameter History
  const { takeSnapshot, undo, redo, canUndo, canRedo } = useSnapshotHistory(
    { radius, pointDistance, pointAngleDeg, showInscribedAngle, inscribedVertexAngleDeg },
    (restored) => {
      updateCircleTheoremsParams(restored);
      playPitchTone(Math.min(1, restored.pointDistance / 16), 220, 750);
    }
  );

  // Mathematical Calculations
  const d = Math.max(radius + 0.2, pointDistance);
  const phiRad = (pointAngleDeg * Math.PI) / 180;
  const pX = d * Math.cos(phiRad);
  const pY = d * Math.sin(phiRad);

  // Tangent contact points
  const alphaRad = Math.acos(radius / d); // angle between OP and OA
  const angleA = phiRad - alphaRad;
  const angleB = phiRad + alphaRad;

  const aX = radius * Math.cos(angleA);
  const aY = radius * Math.sin(angleA);
  const bX = radius * Math.cos(angleB);
  const bY = radius * Math.sin(angleB);

  const tangentLength = Math.sqrt(Math.max(0, d * d - radius * radius));
  const centerAngleDeg = ((2 * alphaRad) * 180) / Math.PI;
  const tangentAngleDeg = 180 - centerAngleDeg;

  // Inscribed vertex point C on opposite side of circle
  const cAngleRad = (inscribedVertexAngleDeg * Math.PI) / 180;
  const cX = radius * Math.cos(cAngleRad);
  const cY = radius * Math.sin(cAngleRad);

  // Inscribed angle computation
  const vCA = { x: aX - cX, y: aY - cY };
  const vCB = { x: bX - cX, y: bY - cY };
  const dotCA_CB = vCA.x * vCB.x + vCA.y * vCB.y;
  const magCA = Math.hypot(vCA.x, vCA.y);
  const magCB = Math.hypot(vCB.x, vCB.y);
  const inscribedAngleDeg = (Math.acos(Math.max(-1, Math.min(1, dotCA_CB / (magCA * magCB)))) * 180) / Math.PI;

  // Coordinate transforms
  const getTransforms = useCallback((width: number, height: number) => {
    const scale = Math.min(width, height) / 18; // 18 units viewbox
    const originX = width / 2;
    const originY = height / 2;

    const toScreen = (x: number, y: number) => ({
      sx: originX + x * scale,
      sy: originY - y * scale,
    });

    const toMath = (sx: number, sy: number) => ({
      x: (sx - originX) / scale,
      y: (originY - sy) / scale,
    });

    return { scale, originX, originY, toScreen, toMath };
  }, []);

  // Board Exam Challenge Evaluation
  useEffect(() => {
    // Challenge 1: 5-12-13 Pythagorean Triplet
    if (
      Math.abs(radius - 5) < 0.25 &&
      Math.abs(d - 13) < 0.4 &&
      !challengeCompleted['circle_pythagorean_triplet']
    ) {
      completeChallenge('circle_pythagorean_triplet', 40);
      successBuzz();
      playChime();
      confetti({ particleCount: 40, spread: 60 });
      trackEvent('challenge_completed', { challengeId: 'circle_pythagorean_triplet' });
    }

    // Challenge 2: Tangent Angle = 60° (Equilateral Tangent Wing)
    if (
      Math.abs(tangentAngleDeg - 60) < 3.0 &&
      !challengeCompleted['circle_equilateral_tangent']
    ) {
      completeChallenge('circle_equilateral_tangent', 45);
      successBuzz();
      playChime();
      confetti({ particleCount: 40, spread: 60 });
      trackEvent('challenge_completed', { challengeId: 'circle_equilateral_tangent' });
    }

    // Challenge 3: Inscribed Angle Doubling verified
    if (
      showInscribedAngle &&
      Math.abs(inscribedAngleDeg - centerAngleDeg / 2) < 2.0 &&
      !challengeCompleted['circle_inscribed_doubling']
    ) {
      completeChallenge('circle_inscribed_doubling', 50);
      successBuzz();
      playChime();
      confetti({ particleCount: 40, spread: 60 });
      trackEvent('challenge_completed', { challengeId: 'circle_inscribed_doubling' });
    }
  }, [
    radius,
    d,
    tangentAngleDeg,
    inscribedAngleDeg,
    centerAngleDeg,
    showInscribedAngle,
    challengeCompleted,
    completeChallenge,
    successBuzz,
    playChime,
    trackEvent,
  ]);

  // Canvas 60fps render
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const dpr = window.devicePixelRatio || 1;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      const { scale, originX, originY, toScreen } = getTransforms(width, height);

      // Grid background
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      const step = scale * 2;
      for (let x = originX % step; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = originY % step; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Main Axes
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, originY);
      ctx.lineTo(width, originY);
      ctx.moveTo(originX, 0);
      ctx.lineTo(originX, height);
      ctx.stroke();

      const sO = toScreen(0, 0);
      const sP = toScreen(pX, pY);
      const sA = toScreen(aX, aY);
      const sB = toScreen(bX, bY);
      const sC = toScreen(cX, cY);

      // Congruent Triangle Fills (ΔOPA and ΔOPB)
      if (showCongruentTriangles) {
        // Upper triangle ΔOPA (Cyan tint)
        ctx.fillStyle = 'rgba(6, 182, 212, 0.12)';
        ctx.beginPath();
        ctx.moveTo(sO.sx, sO.sy);
        ctx.lineTo(sP.sx, sP.sy);
        ctx.lineTo(sA.sx, sA.sy);
        ctx.closePath();
        ctx.fill();

        // Lower triangle ΔOPB (Amber tint)
        ctx.fillStyle = 'rgba(245, 158, 11, 0.12)';
        ctx.beginPath();
        ctx.moveTo(sO.sx, sO.sy);
        ctx.lineTo(sP.sx, sP.sy);
        ctx.lineTo(sB.sx, sB.sy);
        ctx.closePath();
        ctx.fill();
      }

      // Central Circle
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(sO.sx, sO.sy, radius * scale, 0, Math.PI * 2);
      ctx.stroke();

      // Circle Fill Glow
      ctx.fillStyle = 'rgba(14, 165, 233, 0.04)';
      ctx.fill();

      // Radii OA and OB
      if (showRadii) {
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 3]);

        // Radius OA
        ctx.strokeStyle = '#06b6d4';
        ctx.beginPath();
        ctx.moveTo(sO.sx, sO.sy);
        ctx.lineTo(sA.sx, sA.sy);
        ctx.stroke();

        // Radius OB
        ctx.strokeStyle = '#f59e0b';
        ctx.beginPath();
        ctx.moveTo(sO.sx, sO.sy);
        ctx.lineTo(sB.sx, sB.sy);
        ctx.stroke();

        ctx.setLineDash([]);

        // Right-Angle 90° glyph at contact A
        const normAP = { x: (pX - aX) / tangentLength, y: (pY - aY) / tangentLength };
        const normAO = { x: -aX / radius, y: -aY / radius };
        const sqSize = 10;
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(sA.sx + normAP.x * sqSize, sA.sy - normAP.y * sqSize);
        ctx.lineTo(
          sA.sx + (normAP.x + normAO.x) * sqSize,
          sA.sy - (normAP.y + normAO.y) * sqSize
        );
        ctx.lineTo(sA.sx + normAO.x * sqSize, sA.sy - normAO.y * sqSize);
        ctx.stroke();

        // Right-Angle 90° glyph at contact B
        const normBP = { x: (pX - bX) / tangentLength, y: (pY - bY) / tangentLength };
        const normBO = { x: -bX / radius, y: -bY / radius };
        ctx.beginPath();
        ctx.moveTo(sB.sx + normBP.x * sqSize, sB.sy - normBP.y * sqSize);
        ctx.lineTo(
          sB.sx + (normBP.x + normBO.x) * sqSize,
          sB.sy - (normBP.y + normBO.y) * sqSize
        );
        ctx.lineTo(sB.sx + normBO.x * sqSize, sB.sy - normBO.y * sqSize);
        ctx.stroke();
      }

      // Line OP (Hypotenuse of both right triangles)
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(sO.sx, sO.sy);
      ctx.lineTo(sP.sx, sP.sy);
      ctx.stroke();
      ctx.setLineDash([]);

      // Tangents PA and PB
      if (showTangents) {
        ctx.lineWidth = 3;

        // Tangent PA
        ctx.strokeStyle = '#22d3ee';
        ctx.beginPath();
        ctx.moveTo(sP.sx, sP.sy);
        ctx.lineTo(sA.sx, sA.sy);
        ctx.stroke();

        // Tangent PB
        ctx.strokeStyle = '#fbbf24';
        ctx.beginPath();
        ctx.moveTo(sP.sx, sP.sy);
        ctx.lineTo(sB.sx, sB.sy);
        ctx.stroke();

        // Midpoint labels for PA and PB
        const midA = { sx: (sP.sx + sA.sx) / 2, sy: (sP.sy + sA.sy) / 2 };
        const midB = { sx: (sP.sx + sB.sx) / 2, sy: (sP.sy + sB.sy) / 2 };

        ctx.font = 'bold 11px monospace';
        ctx.fillStyle = '#22d3ee';
        ctx.fillText(`PA = ${tangentLength.toFixed(1)}`, midA.sx - 15, midA.sy - 8);

        ctx.fillStyle = '#fbbf24';
        ctx.fillText(`PB = ${tangentLength.toFixed(1)}`, midB.sx - 15, midB.sy + 16);
      }

      // Inscribed Angle Chords (CA and CB)
      if (showInscribedAngle) {
        ctx.strokeStyle = '#e879f9';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(sC.sx, sC.sy);
        ctx.lineTo(sA.sx, sA.sy);
        ctx.moveTo(sC.sx, sC.sy);
        ctx.lineTo(sB.sx, sB.sy);
        ctx.stroke();

        // Point C marker (Draggable vertex)
        ctx.fillStyle = '#c026d3';
        ctx.beginPath();
        ctx.arc(sC.sx, sC.sy, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.font = 'bold 12px sans-serif';
        ctx.fillStyle = '#e879f9';
        ctx.fillText(`C (${inscribedAngleDeg.toFixed(1)}°)`, sC.sx + 10, sC.sy - 5);
      }

      // Point Markers: Center O, Contact A, Contact B, External P
      // Center O
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(sO.sx, sO.sy, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = 'bold 12px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('O (0,0)', sO.sx + 8, sO.sy - 8);

      // Contact Point A
      ctx.fillStyle = '#06b6d4';
      ctx.beginPath();
      ctx.arc(sA.sx, sA.sy, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = '#22d3ee';
      ctx.fillText(`A (90°)`, sA.sx - 15, sA.sy - 10);

      // Contact Point B
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(sB.sx, sB.sy, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = '#fbbf24';
      ctx.fillText(`B (90°)`, sB.sx - 15, sB.sy + 18);

      // Point 6: Component Shadow Drops from External Point P onto Cartesian axes
      drawShadowDrops(ctx, sP.sx, sP.sy, originX, originY, {
        colorX: '#38bdf8',
        colorY: '#a855f7',
        valX: `x=${pX.toFixed(2)}`,
        valY: `y=${pY.toFixed(2)}`,
        dash: [4, 4],
      });

      // External Point P (Glowing Pulsing Draggable Handle)
      drawGripAffordance(ctx, sP.sx, sP.sy, {
        color: '#38bdf8',
        label: `P (d = ${d.toFixed(1)})`,
        sublabel: dragTarget === 'P' ? 'Dragging' : 'Drag Point P',
        isHovered: dragTarget === 'P',
        isDragging: dragTarget === 'P',
        radius: 10,
      });

      // Point 11: Microscope Loupe / Precision Magnifier Lens on Tangent Point A
      if (showLoupe) {
        const lensX = Math.max(70, Math.min(width - 70, sA.sx + (sA.sx < originX ? 85 : -85)));
        const lensY = Math.max(70, Math.min(height - 70, sA.sy + (sA.sy < originY ? 85 : -85)));
        drawMagnifierLoupe(ctx, canvas, sA.sx, sA.sy, lensX, lensY, {
          zoomFactor: 3.0,
          radius: 54,
          borderColor: '#06b6d4',
          label: `3.0x Tangent Point A (90°)`,
        });
      }

      // Point 7: Critical Event Flares
      flareManagerRef.current.draw(ctx);

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [
    radius,
    d,
    pX,
    pY,
    aX,
    aY,
    bX,
    bY,
    cX,
    cY,
    tangentLength,
    showTangents,
    showRadii,
    showCongruentTriangles,
    showInscribedAngle,
    inscribedAngleDeg,
    showLoupe,
    getTransforms,
  ]);

  // Touch and pointer interaction
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;

    const { toScreen } = getTransforms(rect.width, rect.height);
    const sP = toScreen(pX, pY);
    const sC = toScreen(cX, cY);

    const distP = Math.hypot(sx - sP.sx, sy - sP.sy);
    const distC = Math.hypot(sx - sC.sx, sy - sC.sy);

    if (distP < 30) {
      setDragTarget('P');
      canvas.setPointerCapture(e.pointerId);
      lightTap();
    } else if (distC < 30 && showInscribedAngle) {
      setDragTarget('C');
      canvas.setPointerCapture(e.pointerId);
      lightTap();
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!dragTarget) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;

    const { toMath } = getTransforms(rect.width, rect.height);
    const mathPt = toMath(sx, sy);

    if (dragTarget === 'P') {
      const newD = Math.max(radius + 0.5, Math.hypot(mathPt.x, mathPt.y));
      const newAngle = ((Math.atan2(mathPt.y, mathPt.x) * 180) / Math.PI + 360) % 360;
      updateCircleTheoremsParams({
        pointDistance: Math.min(12, Math.max(radius + 0.5, Number(newD.toFixed(2)))),
        pointAngleDeg: Math.round(newAngle),
      });
    } else if (dragTarget === 'C') {
      const newAngle = ((Math.atan2(mathPt.y, mathPt.x) * 180) / Math.PI + 360) % 360;
      updateCircleTheoremsParams({
        inscribedVertexAngleDeg: Math.round(newAngle),
      });
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (dragTarget) {
      setDragTarget(null);
      try {
        canvasRef.current?.releasePointerCapture(e.pointerId);
      } catch {
        // safe ignore
      }
    }
  };

  // Structured Board Exam Challenges
  const challengeLevels: ChallengeLevel[] = [
    {
      levelNumber: 1,
      title: 'The 5-12-13 Tangent Triplet',
      badge: 'Pythagorean Tangent',
      description: 'Adjust the circle radius to R = 5 and distance to d = 13. Observe why tangent length PA is guaranteed to equal 12 cm!',
      requirementFormula: 'PA = \\sqrt{13^2 - 5^2} = \\sqrt{144} = 12',
      targetCriteria: 'Set R = 5 and d = 13',
      xpReward: 40,
      autoPreset: () => updateCircleTheoremsParams({ radius: 5, pointDistance: 13, pointAngleDeg: 30 }),
    },
    {
      levelNumber: 2,
      title: 'The 60° Equilateral Tangent Wing',
      badge: 'Equilateral Wings',
      description: 'Move point P so the angle between the two tangents ∠APB is exactly 60°. Notice that distance d becomes exactly double the radius: d = 2R!',
      requirementFormula: '\\sin(30^\\circ) = \\frac{R}{d} = \\frac{1}{2} \\implies d = 2R',
      targetCriteria: 'Adjust P so ∠APB = 60°',
      xpReward: 45,
      autoPreset: () => updateCircleTheoremsParams({ radius: 4, pointDistance: 8, pointAngleDeg: 0 }),
    },
    {
      levelNumber: 3,
      title: 'Inscribed Angle Doubling Theorem',
      badge: 'Inscribed Angle',
      description: 'Toggle the inscribed angle and drag point C along the circle. Verify that the center angle ∠AOB is exactly DOUBLE the inscribed angle ∠ACB!',
      requirementFormula: '\\angle AOB = 2\\angle ACB',
      targetCriteria: 'Turn on inscribed angle and inspect ∠AOB = 2∠ACB',
      xpReward: 50,
      autoPreset: () => updateCircleTheoremsParams({ showInscribedAngle: true, inscribedVertexAngleDeg: 160 }),
    },
  ];

  const applyCanonicalPreset = (
    pR: number,
    pD: number,
    pAngle: number,
    label: string,
    inscribed: boolean = false
  ) => {
    updateCircleTheoremsParams({
      radius: pR,
      pointDistance: pD,
      pointAngleDeg: pAngle,
      showInscribedAngle: inscribed,
    });
    lightTap();
    playClick();

    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const { toScreen } = getTransforms(rect.width, rect.height);
      const s = toScreen(pD * Math.cos((pAngle * Math.PI) / 180), pD * Math.sin((pAngle * Math.PI) / 180));
      flareManagerRef.current.trigger(s.sx, s.sy, {
        color: '#38bdf8',
        label,
        maxRadius: 40,
      });
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-42px)] md:h-[calc(100vh-52px)] overflow-hidden flex flex-col bg-slate-950 text-slate-100 select-none">
      {/* Point 8: Invariant Locking Badge */}
      <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-30 flex flex-col gap-2 pointer-events-none">
        <div className="pointer-events-auto">
          <InvariantLockBadge
            label="Circle Tangent Invariant"
            invariantLatex="PA = PB = \sqrt{d^2 - R^2}"
            currentValue={`PA=PB=${tangentLength.toFixed(1)}`}
            status="locked"
          />
        </div>

        {/* Point 10 & 14: 1-Tap Canonical Presets & Time-Travel Bar */}
        {!isZenMode && (
          <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-700/80 shadow-lg pointer-events-auto overflow-x-auto no-scrollbar max-w-[calc(100vw-24px)]">
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

            {/* Microscope Loupe Button */}
            <button
              type="button"
              onClick={() => {
                setShowLoupe((prev) => !prev);
                lightTap();
                playClick();
              }}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold border transition-all cursor-pointer shrink-0 flex items-center gap-1 ${
                showLoupe
                  ? 'bg-cyan-600 text-white border-cyan-400 font-extrabold shadow-sm'
                  : 'bg-slate-900/90 text-slate-300 border-slate-700/70 hover:bg-slate-800'
              }`}
            >
              <Search className="w-3 h-3 text-cyan-400" />
              Loupe 3.0x
            </button>

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
              { label: '5-12-13 Triplet', r: 5, d: 13, a: 30, insc: false },
              { label: '3-4-5 Triplet', r: 3, d: 5, a: 0, insc: false },
              { label: '60° Wings (d=2R)', r: 4, d: 8, a: 0, insc: false },
              { label: '90° Orthogonal', r: 4, d: 5.65, a: 45, insc: false },
              { label: 'Inscribed 2:1 Arc', r: 4.5, d: 9, a: 0, insc: true },
            ].map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  takeSnapshot({ radius: p.r, pointDistance: p.d, pointAngleDeg: p.a, showInscribedAngle: p.insc, inscribedVertexAngleDeg }, p.label);
                  applyCanonicalPreset(p.r, p.d, p.a, p.label, p.insc);
                }}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold border transition-all cursor-pointer shrink-0 ${
                  radius === p.r && Math.abs(pointDistance - p.d) < 0.2
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-extrabold shadow-sm'
                    : 'bg-slate-900/90 text-slate-300 border-slate-700/70 hover:bg-slate-800'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Dynamic HUD Overlay */}
      {!isZenMode && (
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-20 max-w-[210px] sm:max-w-[260px] bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-2 sm:p-2.5 rounded-xl text-xs space-y-1 shadow-2xl">
          <div className="flex items-center justify-between font-mono font-bold text-cyan-300">
            <span>PA = PB = {tangentLength.toFixed(2)} u</span>
          </div>

          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800">
            <span className="text-slate-400">Radius R:</span>
            <span className="font-mono text-cyan-400 font-bold">{radius.toFixed(1)} u</span>
          </div>

          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Distance OP:</span>
            <span className="font-mono text-amber-300 font-bold">{d.toFixed(1)} u</span>
          </div>

          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Tangent ∠APB:</span>
            <span className="font-mono text-purple-300 font-bold">{tangentAngleDeg.toFixed(1)}°</span>
          </div>

          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Center ∠AOB:</span>
            <span className="font-mono text-emerald-400 font-bold">{centerAngleDeg.toFixed(1)}°</span>
          </div>
        </div>
      )}

      {/* Main Interactive Canvas */}
      <div className="relative flex-1 w-full bg-slate-950 touch-none">
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
        />

        {/* Quick Presets Bar */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 flex flex-wrap gap-1.5 max-w-xs sm:max-w-sm">
          <button
            type="button"
            onClick={() => updateCircleTheoremsParams({ radius: 5, pointDistance: 13, pointAngleDeg: 35 })}
            className="py-1 px-2.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-[11px] font-mono font-bold text-cyan-300 cursor-pointer"
          >
            5-12-13 Triplet
          </button>
          <button
            type="button"
            onClick={() => updateCircleTheoremsParams({ radius: 4, pointDistance: 8, pointAngleDeg: 0 })}
            className="py-1 px-2.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-[11px] font-mono font-bold text-amber-300 cursor-pointer"
          >
            ∠APB = 60° (d = 2R)
          </button>
          <button
            type="button"
            onClick={() => updateCircleTheoremsParams({ showInscribedAngle: !showInscribedAngle })}
            className={`py-1 px-2.5 rounded-lg border text-[11px] font-mono font-bold cursor-pointer ${
              showInscribedAngle
                ? 'bg-purple-950/90 border-purple-600 text-purple-200'
                : 'bg-slate-900/90 border-slate-700 text-slate-300'
            }`}
          >
            {showInscribedAngle ? 'Hide Inscribed ∠' : 'Show Inscribed ∠'}
          </button>
        </div>
      </div>

      {/* Collapsible Mobile Bottom Sheet */}
      <BottomSheet
        title="Circle Theorems Mission Control"
        badgeLabel={`PA = PB = ${tangentLength.toFixed(1)}`}
        quickEquation="PA = PB = \sqrt{d^2 - R^2}"
        onReset={() => resetParams('circle-theorems')}
        theoryContent={
          <CoachTheoryModule
            simulatorId="circle-theorems"
            extraLiveDetails={
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-xl bg-cyan-950/30 border border-cyan-800/40">
                    <span className="text-[10px] text-cyan-300 block font-semibold">Equal Tangents:</span>
                    <span className="font-mono text-white font-bold">PA = PB = {tangentLength.toFixed(2)} cm</span>
                  </div>
                  <div className="p-2 rounded-xl bg-amber-950/30 border border-amber-800/40">
                    <span className="text-[10px] text-amber-300 block font-semibold">Center Angle:</span>
                    <span className="font-mono text-white font-bold">∠AOB = {centerAngleDeg.toFixed(1)}°</span>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800 text-center font-mono text-xs">
                  <span className="text-emerald-400 font-bold">
                    Perpendicularity: ∠OAP = ∠OBP = 90° · RHS ΔOPA ≅ ΔOPB
                  </span>
                </div>
              </div>
            }
          />
        }
        challengeContent={
          <div className="space-y-4">
            <ChallengeManager
              simulatorId="circle-theorems"
              simulatorTitle="The Tangent Guardian"
              levels={challengeLevels}
              onTriggerPreset={(lvl) => {
                const targetLvl = challengeLevels.find((l) => l.levelNumber === lvl);
                targetLvl?.autoPreset?.();
              }}
              isOpenDefault={true}
            />
          </div>
        }
      >
        {/* Controls Tab */}
        <div className="space-y-3">
          <LiveSubstitutionCard
            title="Tangent Length & Congruence Invariant"
            badge="RHS Congruence"
            symbolicLaw="PA = PB = \sqrt{d^2 - R^2}, \quad \angle OAP = \angle OBP = 90^\circ"
            substitutedLatex={`PA = \\sqrt{(${d.toFixed(2)})^2 - (${radius.toFixed(2)})^2} = \\sqrt{${Math.max(0, d * d - radius * radius).toFixed(2)}}`}
            evaluatedLatex={`PA = PB = ${tangentLength.toFixed(2)} \\text{ cm}, \\quad \\angle AOB = ${centerAngleDeg.toFixed(1)}^\\circ`}
          />

          <TouchSlider
            label="Circle Radius R"
            value={radius}
            min={2.0}
            max={6.0}
            step={0.5}
            onChange={(val) => updateCircleTheoremsParams({ radius: val })}
          />

          <TouchSlider
            label="External Point Distance d (OP)"
            value={d}
            min={radius + 0.5}
            max={12.0}
            step={0.25}
            onChange={(val) => updateCircleTheoremsParams({ pointDistance: val })}
          />

          <TouchSlider
            label="Point Rotation Angle θ"
            value={pointAngleDeg}
            min={0}
            max={360}
            step={5}
            onChange={(val) => updateCircleTheoremsParams({ pointAngleDeg: val })}
          />

          {showInscribedAngle && (
            <TouchSlider
              label="Inscribed Vertex C Position Angle"
              value={inscribedVertexAngleDeg}
              min={0}
              max={360}
              step={5}
              onChange={(val) => updateCircleTheoremsParams({ inscribedVertexAngleDeg: val })}
            />
          )}

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => updateCircleTheoremsParams({ showCongruentTriangles: !showCongruentTriangles })}
              className={`p-2 rounded-lg text-xs font-medium border text-center transition-colors cursor-pointer ${
                showCongruentTriangles
                  ? 'bg-cyan-950/80 border-cyan-600 text-cyan-200'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              RHS Congruence Shading
            </button>
            <button
              type="button"
              onClick={() => updateCircleTheoremsParams({ showRadii: !showRadii })}
              className={`p-2 rounded-lg text-xs font-medium border text-center transition-colors cursor-pointer ${
                showRadii
                  ? 'bg-amber-950/80 border-amber-600 text-amber-200'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              90° Radii Markers
            </button>
          </div>
        </div>
      </BottomSheet>

      {/* Point 13: CBSE Class 10 5-Mark Proof & Cheatsheet Modal */}
      <ExamCheatSheetModal
        isOpen={showCheatSheet}
        onClose={() => setShowCheatSheet(false)}
        topicTitle="CBSE Class 10: Circle Tangents & RHS Congruence"
        chapterName="Chapter 10 — Circles (5-Mark Master Cheatsheet)"
        fiveMarkQuestion="Prove that the lengths of tangents drawn from an external point to a circle are equal (Theorem 10.2). If PA and PB are tangents from P to a circle with centre O, prove that ∠APB = 180° - ∠AOB and OP is the angle bisector of ∠APB."
        proofSteps={[
          {
            stepNumber: 1,
            title: "Given, To Prove & Construction",
            mathContent: "\\text{Given: } P \\text{ is external to } C(O, R). \\; PA, PB \\text{ are tangents.} \\quad \\text{To Prove: } PA = PB",
            explanation: "Draw radius OA ⊥ PA and radius OB ⊥ PB. Join OP to form two right triangles ΔOPA and ΔOPB.",
            marksAllocation: "1.0 Mark",
          },
          {
            stepNumber: 2,
            title: "Radius-Tangent Perpendicularity (Theorem 10.1)",
            mathContent: "OA \\perp PA \\implies \\angle OAP = 90^\\circ, \\quad OB \\perp PB \\implies \\angle OBP = 90^\\circ",
            explanation: "The tangent at any point of a circle is perpendicular to the radius through the point of contact.",
            marksAllocation: "1.0 Mark",
          },
          {
            stepNumber: 3,
            title: "RHS Triangle Congruence Proof",
            mathContent: "\\begin{aligned} \\angle OAP &= \\angle OBP = 90^\\circ \\quad &(\\text{Right angle}) \\\\ OP &= OP \\quad &(\\text{Common Hypotenuse}) \\\\ OA &= OB = R \\quad &(\\text{Radii of same circle}) \\end{aligned} \\implies \\Delta OPA \\cong \\Delta OPB \\; (\\text{RHS})",
            explanation: "By Right angle-Hypotenuse-Side (RHS) congruence criterion, the two triangles are strictly congruent.",
            marksAllocation: "2.0 Marks",
          },
          {
            stepNumber: 4,
            title: "CPCT & Supplementary Angle Deduction",
            mathContent: "PA = PB \\quad (\\text{CPCT}), \\quad \\angle APB + \\angle AOB = 180^\\circ",
            explanation: "Corresponding Parts of Congruent Triangles are equal. Since sum of angles in quadrilateral OAPB is 360°, ∠APB and ∠AOB are supplementary.",
            marksAllocation: "1.0 Mark",
          },
        ]}
        topperShortcuts={[
          "Pythagorean Metric: PA = PB = √(d² - R²). If (R, PA, d) form a Pythagorean triplet like (3,4,5) or (5,12,13), answer instantly!",
          "60° Equilateral Tangent: When ∠APB = 60°, ΔPAB is equilateral and d = 2R.",
          "Inscribed Angle Double Invariant: ∠AOB = 2 · ∠ACB anywhere along the major arc!",
        ]}
        examinerTraps={[
          "Forgetting to quote Theorem 10.1 (OA ⊥ PA at 90°) before using RHS congruence.",
          "Confusing external distance d (length OP) with chord length AB.",
          "Not writing (CPCT) reason after concluding PA = PB and ∠OPA = ∠OPB.",
        ]}
      />

      {/* Point 15: Split-Screen Dual Perspective Comparison Inspector */}
      <DualViewInspectorModal
        isOpen={showDualView}
        onClose={() => setShowDualView(false)}
        title="Circle Theorems Dual Inspector"
        badge="Tangent Metric Invariant vs Inscribed Angle Theorem"
        primaryView={{
          title: "Tangent Lengths & RHS Congruence",
          badge: `PA = PB = ${tangentLength.toFixed(2)}`,
          content: (
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-800/60 text-cyan-200">
                <p className="font-bold">Radius R = {radius.toFixed(1)}, Distance d = {d.toFixed(1)}</p>
                <p className="text-slate-300 text-[11px] mt-1">Tangent PA = √(d² - R²) = √({d.toFixed(1)}² - {radius.toFixed(1)}²) = <span className="font-bold text-cyan-300">{tangentLength.toFixed(2)}</span></p>
              </div>
              <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-200">
                <p className="font-bold">Angle ∠APB: {tangentAngleDeg.toFixed(1)}°</p>
                <p className="text-slate-300 text-[11px] mt-1">Center Angle ∠AOB: {centerAngleDeg.toFixed(1)}° (Sum = 180.0°)</p>
              </div>
            </div>
          ),
        }}
        secondaryView={{
          title: "Inscribed Angle Doubling Invariant",
          badge: `∠AOB = 2·∠ACB`,
          content: (
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 text-xs leading-relaxed">
                <p className="font-semibold text-cyan-300 mb-1">Arc Angle Comparison:</p>
                <p>Central Angle ∠AOB = <span className="font-bold text-amber-300">{centerAngleDeg.toFixed(1)}°</span></p>
                <p className="mt-1">Inscribed Angle ∠ACB = <span className="font-bold text-emerald-300">{inscribedAngleDeg.toFixed(1)}°</span></p>
                <p className="mt-2 pt-2 border-t border-slate-800 text-pink-300 font-bold">
                  Ratio: ∠AOB / ∠ACB = {centerAngleDeg.toFixed(1)}° / {inscribedAngleDeg.toFixed(1)}° = {(centerAngleDeg / (inscribedAngleDeg || 1)).toFixed(2)} ≈ 2.00
                </p>
              </div>
            </div>
          ),
        }}
        couplingBanner="RHS Triangle Congruence guarantees Equal Tangent Lengths PA=PB while preserving the 2:1 Inscribed Arc Invariant!"
      />
    </div>
  );
};
