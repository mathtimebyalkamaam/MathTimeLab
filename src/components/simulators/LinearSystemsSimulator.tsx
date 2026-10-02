/**
 * LinearSystemsSimulator.tsx: Interactive Pair of Linear Equations in Two Variables (Class 10).
 * Features:
 * - Interactive 2D Cartesian grid with two dynamic lines L₁ and L₂
 * - Real-time calculation of intersection point (x*, y*) via Cramer's cross-multiplication
 * - Dynamic consistency classification: Unique Solution vs Parallel (No Solution) vs Coincident (Infinite)
 * - Live coefficient ratio testing: a₁/a₂ vs b₁/b₂ vs c₁/c₂
 * - Pure KaTeX coaching theory module and structured board exam challenges
 */
import React, { useEffect, useRef, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  RotateCcw, 
  CheckCircle2, 
  Target, 
  Sliders, 
  Eye, 
  Maximize2,
  GitCommit,
  Network
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

export const LinearSystemsSimulator: React.FC = () => {
  const {
    linearSystemsParams,
    updateLinearSystemsParams,
    resetParams,
    completeChallenge,
    challengeCompleted,
    isZenMode,
  } = useSimulatorStore();

  const {
    a1,
    b1,
    c1,
    a2,
    b2,
    c2,
    showIntersection,
    showGridLines,
    showSlopeIntercept,
  } = linearSystemsParams;

  const { lightTap, successBuzz } = useHaptics();
  const { playClick, playChime } = useSound();
  const { trackEvent } = useAnalytics();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeDragLine, setActiveDragLine] = useState<1 | 2 | null>(null);

  // Cross determinant & intersection calculations
  const delta = a1 * b2 - a2 * b1;
  const isParallel = Math.abs(delta) < 0.001;
  const isCoincident = isParallel && Math.abs(a1 * c2 - a2 * c1) < 0.001;

  let intersectionX: number | null = null;
  let intersectionY: number | null = null;

  if (!isParallel) {
    intersectionX = (c1 * b2 - c2 * b1) / delta;
    intersectionY = (a1 * c2 - a2 * c1) / delta;
  }

  // Slopes and Y-intercepts
  const m1 = Math.abs(b1) > 0.001 ? -a1 / b1 : null;
  const k1 = Math.abs(b1) > 0.001 ? c1 / b1 : null;
  const m2 = Math.abs(b2) > 0.001 ? -a2 / b2 : null;
  const k2 = Math.abs(b2) > 0.001 ? c2 / b2 : null;

  // Coefficient ratios
  const ratioA = a2 !== 0 ? (a1 / a2).toFixed(2) : '∞';
  const ratioB = b2 !== 0 ? (b1 / b2).toFixed(2) : '∞';
  const ratioC = c2 !== 0 ? (c1 / c2).toFixed(2) : '∞';

  // Coordinate transforms
  const getTransforms = useCallback((width: number, height: number) => {
    const scale = Math.min(width, height) / 16; // 1 unit = scale pixels
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
    // Challenge 1: Find unique intersection at (2, 1)
    if (
      intersectionX !== null &&
      intersectionY !== null &&
      Math.abs(intersectionX - 2) < 0.15 &&
      Math.abs(intersectionY - 1) < 0.15 &&
      !challengeCompleted['linear_intersection_2_1']
    ) {
      completeChallenge('linear_intersection_2_1', 40);
      successBuzz();
      playChime();
      confetti({ particleCount: 40, spread: 60 });
      trackEvent('challenge_completed', { challengeId: 'linear_intersection_2_1' });
    }

    // Challenge 2: Create strictly parallel lines (inconsistent, no solution)
    if (
      isParallel &&
      !isCoincident &&
      !challengeCompleted['linear_parallel_nosol']
    ) {
      completeChallenge('linear_parallel_nosol', 45);
      successBuzz();
      playChime();
      confetti({ particleCount: 40, spread: 60 });
      trackEvent('challenge_completed', { challengeId: 'linear_parallel_nosol' });
    }

    // Challenge 3: Orthogonal perpendicular crossroads (a₁a₂ + b₁b₂ = 0)
    if (
      Math.abs(a1 * a2 + b1 * b2) < 0.05 &&
      !challengeCompleted['linear_perpendicular']
    ) {
      completeChallenge('linear_perpendicular', 50);
      successBuzz();
      playChime();
      confetti({ particleCount: 40, spread: 60 });
      trackEvent('challenge_completed', { challengeId: 'linear_perpendicular' });
    }
  }, [
    intersectionX,
    intersectionY,
    isParallel,
    isCoincident,
    a1,
    a2,
    b1,
    b2,
    challengeCompleted,
    completeChallenge,
    successBuzz,
    playChime,
    trackEvent,
  ]);

  // 60fps Canvas render
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
      if (showGridLines) {
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1;
        const step = scale * 1;
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
      }

      // Main Axes X and Y
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, originY);
      ctx.lineTo(width, originY);
      ctx.moveTo(originX, 0);
      ctx.lineTo(originX, height);
      ctx.stroke();

      // Axis ticks and labels
      ctx.fillStyle = '#64748b';
      ctx.font = '9px monospace';
      for (let i = -8; i <= 8; i += 2) {
        if (i === 0) continue;
        const s = toScreen(i, 0);
        ctx.fillText(`${i}`, s.sx - 4, originY + 12);
        const sy = toScreen(0, i);
        ctx.fillText(`${i}`, originX + 5, sy.sy + 3);
      }

      // Helper function to draw infinite line ax + by = c across viewport bounds
      const drawLinearEquation = (
        a: number,
        b: number,
        c: number,
        color: string,
        lineWidth: number,
        dash: number[] = []
      ) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.setLineDash(dash);

        const xMin = -width / (2 * scale);
        const xMax = width / (2 * scale);
        const yMin = -height / (2 * scale);
        const yMax = height / (2 * scale);

        ctx.beginPath();

        if (Math.abs(b) > 0.001) {
          // Non-vertical line: y = (c - ax) / b
          const y1 = (c - a * xMin) / b;
          const y2 = (c - a * xMax) / b;
          const p1 = toScreen(xMin, y1);
          const p2 = toScreen(xMax, y2);
          ctx.moveTo(p1.sx, p1.sy);
          ctx.lineTo(p2.sx, p2.sy);
        } else if (Math.abs(a) > 0.001) {
          // Strictly vertical line: x = c / a
          const xFixed = c / a;
          const p1 = toScreen(xFixed, yMin);
          const p2 = toScreen(xFixed, yMax);
          ctx.moveTo(p1.sx, p1.sy);
          ctx.lineTo(p2.sx, p2.sy);
        }

        ctx.stroke();
        ctx.setLineDash([]);
      };

      // Draw Line 1 (L₁: a₁x + b₁y = c₁)
      drawLinearEquation(a1, b1, c1, '#38bdf8', 3);

      // Draw Line 2 (L₂: a₂x + b₂y = c₂)
      drawLinearEquation(
        a2,
        b2,
        c2,
        '#f59e0b',
        3,
        isCoincident ? [8, 6] : []
      );

      // Draw Intersection Point (x*, y*)
      if (showIntersection && intersectionX !== null && intersectionY !== null) {
        const sInt = toScreen(intersectionX, intersectionY);

        // Outer pulsing target ring
        ctx.strokeStyle = '#ec4899';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(sInt.sx, sInt.sy, 16, 0, Math.PI * 2);
        ctx.stroke();

        // Inner glowing core
        ctx.fillStyle = '#ec4899';
        ctx.beginPath();
        ctx.arc(sInt.sx, sInt.sy, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Crosshairs
        ctx.strokeStyle = '#ec4899';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 2]);
        ctx.beginPath();
        ctx.moveTo(sInt.sx, 0);
        ctx.lineTo(sInt.sx, height);
        ctx.moveTo(0, sInt.sy);
        ctx.lineTo(width, sInt.sy);
        ctx.stroke();
        ctx.setLineDash([]);

        // Intersection Coordinate Callout Badge
        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.strokeStyle = '#ec4899';
        ctx.lineWidth = 1;
        const labelText = `Intersection: (${intersectionX.toFixed(2)}, ${intersectionY.toFixed(2)})`;
        ctx.font = 'bold 12px monospace';
        const tw = ctx.measureText(labelText).width;
        ctx.beginPath();
        ctx.roundRect(sInt.sx + 10, sInt.sy - 28, tw + 16, 24, 6);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#f472b6';
        ctx.fillText(labelText, sInt.sx + 18, sInt.sy - 12);
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [
    a1,
    b1,
    c1,
    a2,
    b2,
    c2,
    isCoincident,
    intersectionX,
    intersectionY,
    showGridLines,
    showIntersection,
    getTransforms,
  ]);

  // Touch and pointer interaction to nudge lines
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;
    const { toMath } = getTransforms(rect.width, rect.height);
    const mathPt = toMath(sx, sy);

    // Distance to line 1: |a1*x + b1*y - c1| / sqrt(a1² + b1²)
    const dist1 = Math.abs(a1 * mathPt.x + b1 * mathPt.y - c1) / Math.hypot(a1, b1);
    const dist2 = Math.abs(a2 * mathPt.x + b2 * mathPt.y - c2) / Math.hypot(a2, b2);

    if (dist1 < dist2 && dist1 < 1.0) {
      setActiveDragLine(1);
      canvas.setPointerCapture(e.pointerId);
      lightTap();
    } else if (dist2 < 1.0) {
      setActiveDragLine(2);
      canvas.setPointerCapture(e.pointerId);
      lightTap();
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!activeDragLine) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;
    const { toMath } = getTransforms(rect.width, rect.height);
    const mathPt = toMath(sx, sy);

    if (activeDragLine === 1) {
      const newC1 = Math.round(a1 * mathPt.x + b1 * mathPt.y);
      updateLinearSystemsParams({ c1: Math.max(-10, Math.min(10, newC1)) });
    } else if (activeDragLine === 2) {
      const newC2 = Math.round(a2 * mathPt.x + b2 * mathPt.y);
      updateLinearSystemsParams({ c2: Math.max(-10, Math.min(10, newC2)) });
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (activeDragLine) {
      setActiveDragLine(null);
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
      title: 'Target Crossroads (2, 1)',
      badge: 'Unique Intersection',
      description: 'Set line 1 to 2x + y = 5 and line 2 to x - y = 1. Observe how they cross at the unique point (2, 1)!',
      requirementFormula: '\\Delta = a_1 b_2 - a_2 b_1 \\neq 0 \\implies (x^*, y^*) = (2, 1)',
      targetCriteria: 'Set L₁: 2x + y = 5 and L₂: x - y = 1',
      xpReward: 40,
      autoPreset: () => updateLinearSystemsParams({ a1: 2, b1: 1, c1: 5, a2: 1, b2: -1, c2: 1 }),
    },
    {
      levelNumber: 2,
      title: 'The Parallel Train Tracks',
      badge: 'Inconsistent System',
      description: 'Align the slope of Line 2 to match Line 1 (a₁/a₂ = b₁/b₂), but ensure c₁/c₂ is different. Observe that lines never meet (No Solution)!',
      requirementFormula: '\\frac{a_1}{a_2} = \\frac{b_1}{b_2} \\neq \\frac{c_1}{c_2} \\implies \\text{No Solution}',
      targetCriteria: 'Create parallel non-intersecting lines',
      xpReward: 45,
      autoPreset: () => updateLinearSystemsParams({ a1: 2, b1: 4, c1: 8, a2: 1, b2: 2, c2: -2 }),
    },
    {
      levelNumber: 3,
      title: 'Orthogonal Perpendicular Crossroads',
      badge: 'Perpendicular Lines',
      description: 'Create two perpendicular lines where slopes multiply to -1 (or a₁a₂ + b₁b₂ = 0).',
      requirementFormula: 'm_1 \\cdot m_2 = -1 \\iff a_1 a_2 + b_1 b_2 = 0',
      targetCriteria: 'Achieve a₁a₂ + b₁b₂ = 0',
      xpReward: 50,
      autoPreset: () => updateLinearSystemsParams({ a1: 1, b1: 2, c1: 4, a2: 2, b2: -1, c2: 3 }),
    },
  ];

  return (
    <div className="relative w-full h-[calc(100vh-42px)] md:h-[calc(100vh-52px)] overflow-hidden flex flex-col bg-slate-950 text-slate-100 select-none">
      {/* Dynamic HUD Overlay */}
      {!isZenMode && (
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-20 max-w-[210px] sm:max-w-[260px] bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-2 sm:p-2.5 rounded-xl text-xs space-y-1.5 shadow-2xl">
          {/* Line 1 equation */}
          <div className="flex items-center justify-between font-mono font-bold text-cyan-300">
            <span>
              L₁: {a1 !== 1 ? (a1 === -1 ? '-' : a1) : ''}x {b1 >= 0 ? `+ ${b1}` : `- ${Math.abs(b1)}`}y = {c1}
            </span>
          </div>

          {/* Line 2 equation */}
          <div className="flex items-center justify-between font-mono font-bold text-amber-300">
            <span>
              L₂: {a2 !== 1 ? (a2 === -1 ? '-' : a2) : ''}x {b2 >= 0 ? `+ ${b2}` : `- ${Math.abs(b2)}`}y = {c2}
            </span>
          </div>

          {/* System Status */}
          <div className="pt-1 border-t border-slate-800 text-[11px] font-mono">
            {isCoincident ? (
              <span className="text-purple-400 font-bold">Coincident (Infinite Sol)</span>
            ) : isParallel ? (
              <span className="text-rose-400 font-bold">Parallel (No Solution)</span>
            ) : (
              <span className="text-emerald-400 font-bold">
                Unique Sol: ({intersectionX?.toFixed(1)}, {intersectionY?.toFixed(1)})
              </span>
            )}
          </div>

          {/* Ratios summary */}
          <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between pt-0.5">
            <span>a₁/a₂ = {ratioA}</span>
            <span>b₁/b₂ = {ratioB}</span>
            <span>c₁/c₂ = {ratioC}</span>
          </div>
        </div>
      )}

      {/* Main Interactive Stage */}
      <div className="relative flex-1 w-full bg-slate-950 touch-none">
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="w-full h-full cursor-crosshair touch-none"
        />

        {/* Real-time Pedagogical Concept Insight Banner */}
        <ConceptInsightBanner
          conceptTitle="Pair of Linear Equations: Solutions & Ratios"
          mathInsight={`Determinant Δ = a₁b₂ - a₂b₁ = ${delta.toFixed(2)}. a₁/a₂ = ${ratioA}, b₁/b₂ = ${ratioB}, c₁/c₂ = ${ratioC}. Classification: ${isCoincident ? 'a₁/a₂ = b₁/b₂ = c₁/c₂ (Coincident, Infinite Solutions)' : isParallel ? 'a₁/a₂ = b₁/b₂ ≠ c₁/c₂ (Parallel, No Solution)' : 'a₁/a₂ ≠ b₁/b₂ (Unique Solution)'}.`}
          eli10Analogy="Imagine two laser pointers in a dark room: if they aim in different directions, their beams must cross at EXACTLY one point (unique solution). If they aim in the exact same direction but are apart, they are parallel train tracks that never touch (no solution). If one beam lies right on top of the other, they touch everywhere (infinite solutions)!"
          liveFeedback={
            isCoincident
              ? '💜 Coincident Lines: Both lines are identical! Infinite solutions.'
              : isParallel
              ? '🔴 Inconsistent System: Slopes match but intercepts differ. 0 intersections (Parallel).'
              : `🟢 Consistent System: Unique intersection point at (${intersectionX?.toFixed(2)}, ${intersectionY?.toFixed(2)}).`
          }
          quickAction={{
            label: "Alka Ma'am's Parallel Rail Preset",
            onApply: () => updateLinearSystemsParams({ a1: 2, b1: 4, c1: 8, a2: 1, b2: 2, c2: -2 }),
          }}
        />
      </div>

      {/* Collapsible Mobile Bottom Sheet */}
      <BottomSheet
        title="Linear Systems Mission Control"
        badgeLabel={
          isCoincident
            ? 'Coincident'
            : isParallel
            ? 'No Solution'
            : `(${intersectionX?.toFixed(1)}, ${intersectionY?.toFixed(1)})`
        }
        quickEquation="a_1 x + b_1 y = c_1, \quad a_2 x + b_2 y = c_2"
        onReset={() => resetParams('linear-systems')}
        theoryContent={
          <CoachTheoryModule
            simulatorId="linear-systems"
            extraLiveDetails={
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-2 text-xs text-center font-mono">
                  <div className="p-2 rounded-xl bg-cyan-950/30 border border-cyan-800/40">
                    <span className="text-[10px] text-cyan-300 block font-semibold">a₁/a₂</span>
                    <span className="text-white font-bold">{ratioA}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-amber-950/30 border border-amber-800/40">
                    <span className="text-[10px] text-amber-300 block font-semibold">b₁/b₂</span>
                    <span className="text-white font-bold">{ratioB}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-purple-950/30 border border-purple-800/40">
                    <span className="text-[10px] text-purple-300 block font-semibold">c₁/c₂</span>
                    <span className="text-white font-bold">{ratioC}</span>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800 text-center font-mono text-xs">
                  {isCoincident ? (
                    <span className="text-purple-400 font-bold">
                      a₁/a₂ = b₁/b₂ = c₁/c₂ (Coincident Lines · Infinitely Many Solutions)
                    </span>
                  ) : isParallel ? (
                    <span className="text-rose-400 font-bold">
                      a₁/a₂ = b₁/b₂ ≠ c₁/c₂ (Parallel Lines · Inconsistent System · No Solution)
                    </span>
                  ) : (
                    <span className="text-emerald-400 font-bold">
                      a₁/a₂ ≠ b₁/b₂ (Intersecting Lines · Unique Solution at ({intersectionX?.toFixed(2)}, {intersectionY?.toFixed(2)}))
                    </span>
                  )}
                </div>
              </div>
            }
          />
        }
        challengeContent={
          <div className="space-y-4">
            <ChallengeManager
              simulatorId="linear-systems"
              simulatorTitle="The Linear Crossroads"
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
        <div className="space-y-4">
          <div className="space-y-2 p-2.5 rounded-xl bg-cyan-950/20 border border-cyan-900/40">
            <h4 className="text-xs font-bold text-cyan-300">Line 1 Coefficients (L₁: a₁x + b₁y = c₁)</h4>
            <TouchSlider
              label="Slope term a₁"
              value={a1}
              min={-5}
              max={5}
              step={1}
              formulaTerm="a₁"
              causeEffectHint={(val) => `X-slope component: contributes to slope m₁ = -${val}/${b1}`}
              onChange={(val) => updateLinearSystemsParams({ a1: val })}
            />
            <TouchSlider
              label="Slope term b₁"
              value={b1}
              min={-5}
              max={5}
              step={1}
              formulaTerm="b₁"
              causeEffectHint={(val) => `Y-slope component: y-intercept = ${c1}/${val}`}
              onChange={(val) => updateLinearSystemsParams({ b1: val })}
            />
            <TouchSlider
              label="Constant c₁"
              value={c1}
              min={-10}
              max={10}
              step={1}
              formulaTerm="c₁"
              causeEffectHint={(val) => `Parallel shift: translates Line 1 across plane`}
              onChange={(val) => updateLinearSystemsParams({ c1: val })}
            />
          </div>

          <div className="space-y-2 p-2.5 rounded-xl bg-amber-950/20 border border-amber-900/40">
            <h4 className="text-xs font-bold text-amber-300">Line 2 Coefficients (L₂: a₂x + b₂y = c₂)</h4>
            <TouchSlider
              label="Slope term a₂"
              value={a2}
              min={-5}
              max={5}
              step={1}
              formulaTerm="a₂"
              causeEffectHint={(val) => `X-slope component: contributes to slope m₂ = -${val}/${b2}`}
              onChange={(val) => updateLinearSystemsParams({ a2: val })}
            />
            <TouchSlider
              label="Slope term b₂"
              value={b2}
              min={-5}
              max={5}
              step={1}
              formulaTerm="b₂"
              causeEffectHint={(val) => `Y-slope component: y-intercept = ${c2}/${val}`}
              onChange={(val) => updateLinearSystemsParams({ b2: val })}
            />
            <TouchSlider
              label="Constant c₂"
              value={c2}
              min={-10}
              max={10}
              step={1}
              formulaTerm="c₂"
              causeEffectHint={(val) => `Parallel shift: translates Line 2 across plane`}
              onChange={(val) => updateLinearSystemsParams({ c2: val })}
            />
          </div>
        </div>
      </BottomSheet>
    </div>
  );
};
