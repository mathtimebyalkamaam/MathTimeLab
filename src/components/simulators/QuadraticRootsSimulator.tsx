/**
 * QuadraticRootsSimulator.tsx: Interactive Parabola & Quadratic Roots Simulator (Class 10).
 * Features:
 * - Touch-drag canvas to reposition vertex or adjust coefficients a, b, c
 * - Real-time Parabola rendering with high-DPI scaling
 * - Dynamic Root markers: Two distinct real roots (D > 0), Tangent double root (D = 0), Complex floating (D < 0)
 * - Axis of symmetry x = -b/(2a) and Vertex coordinates (-b/2a, -D/4a)
 * - Pure KaTeX coaching theory module and structured board exam missions
 */
import React, { useEffect, useRef, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { 
  Play, 
  RotateCcw, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Crosshair, 
  Sliders, 
  Eye, 
  Maximize2,
  TrendingUp,
  Target
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
import { MistakeDoctor } from '../common/MistakeDoctor';
import { InlineMath } from '../common/MathFormula';

export const QuadraticRootsSimulator: React.FC = () => {
  const {
    quadraticParams,
    updateQuadraticParams,
    resetParams,
    completeChallenge,
    challengeCompleted,
    isZenMode,
  } = useSimulatorStore();

  const { a, b, c, showVertex, showAxisOfSymmetry, showRoots } = quadraticParams;

  const { lightTap, successBuzz } = useHaptics();
  const { playClick, playChime } = useSound();
  const { trackEvent } = useAnalytics();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDraggingVertex, setIsDraggingVertex] = useState<boolean>(false);

  // Discriminant and mathematical derivations
  const discriminant = b * b - 4 * a * c;
  const vertexX = -b / (2 * a);
  const vertexY = -discriminant / (4 * a);

  let root1: number | null = null;
  let root2: number | null = null;

  if (discriminant >= 0) {
    const sqrtD = Math.sqrt(discriminant);
    root1 = (-b + sqrtD) / (2 * a);
    root2 = (-b - sqrtD) / (2 * a);
  }

  // Coordinate coordinate system transforms
  const getTransforms = useCallback((width: number, height: number) => {
    const scale = Math.min(width, height) / 16; // 1 unit in math = scale pixels
    const originX = width / 2;
    const originY = height / 2 + 30; // slightly offset downwards for visual balance

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

  // Challenge evaluation
  useEffect(() => {
    // Challenge 1: Find roots 3 and -1 (e.g. x² - 2x - 3 = 0)
    if (
      root1 !== null &&
      root2 !== null &&
      Math.abs(Math.max(root1, root2) - 3) < 0.15 &&
      Math.abs(Math.min(root1, root2) - (-1)) < 0.15 &&
      !challengeCompleted['quad_roots_3_minus1']
    ) {
      completeChallenge('quad_roots_3_minus1', 40);
      successBuzz();
      playChime();
      confetti({ particleCount: 40, spread: 60 });
      trackEvent('challenge_completed', { challengeId: 'quad_roots_3_minus1' });
    }

    // Challenge 2: The Tangent Kiss (D = 0)
    if (Math.abs(discriminant) < 0.25 && !challengeCompleted['quad_tangent_d0']) {
      completeChallenge('quad_tangent_d0', 50);
      successBuzz();
      playChime();
      trackEvent('challenge_completed', { challengeId: 'quad_tangent_d0' });
    }

    // Challenge 3: Inverted floating (a < 0 and D < 0)
    if (a < 0 && discriminant < -3 && !challengeCompleted['quad_inverted_float']) {
      completeChallenge('quad_inverted_float', 50);
      successBuzz();
      playChime();
      trackEvent('challenge_completed', { challengeId: 'quad_inverted_float' });
    }
  }, [root1, root2, discriminant, a, challengeCompleted, completeChallenge, successBuzz, playChime, trackEvent]);

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      const { originX, originY, scale, toScreen } = getTransforms(width, height);

      // 1. Coordinate Grid lines
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;

      const step = 1;
      const minX = -10;
      const maxX = 10;
      const minY = -10;
      const maxY = 14;

      for (let x = minX; x <= maxX; x += step) {
        const { sx } = toScreen(x, 0);
        ctx.beginPath();
        ctx.moveTo(sx, 0);
        ctx.lineTo(sx, height);
        ctx.stroke();
      }

      for (let y = minY; y <= maxY; y += step) {
        const { sy } = toScreen(0, y);
        ctx.beginPath();
        ctx.moveTo(0, sy);
        ctx.lineTo(width, sy);
        ctx.stroke();
      }

      // 2. Main Axes (X and Y)
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2;

      // X-Axis
      ctx.beginPath();
      ctx.moveTo(0, originY);
      ctx.lineTo(width, originY);
      ctx.stroke();

      // Y-Axis
      ctx.beginPath();
      ctx.moveTo(originX, 0);
      ctx.lineTo(originX, height);
      ctx.stroke();

      // Axis labels & arrows
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px monospace';
      ctx.fillText('x', width - 15, originY - 8);
      ctx.fillText('y', originX + 8, 15);

      // Tick numbers
      for (let x = -8; x <= 8; x += 2) {
        if (x === 0) continue;
        const p = toScreen(x, 0);
        ctx.fillText(`${x}`, p.sx - 6, originY + 14);
      }
      for (let y = -6; y <= 10; y += 2) {
        if (y === 0) continue;
        const p = toScreen(0, y);
        ctx.fillText(`${y}`, originX + 6, p.sy + 3);
      }

      // 3. Axis of Symmetry (Dashed Line)
      if (showAxisOfSymmetry) {
        const pSymTop = toScreen(vertexX, maxY);
        const pSymBottom = toScreen(vertexX, minY);
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(pSymTop.sx, pSymTop.sy);
        ctx.lineTo(pSymBottom.sx, pSymBottom.sy);
        ctx.stroke();
        ctx.setLineDash([]);

        // Axis label
        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 10px monospace';
        ctx.fillText(`x = ${vertexX.toFixed(2)}`, pSymTop.sx + 4, 30);
      }

      // 4. Parabola Curve
      ctx.beginPath();
      const points: { sx: number; sy: number }[] = [];
      const numSamples = 240;
      const xRange = 8;

      for (let i = 0; i <= numSamples; i++) {
        const mx = vertexX - xRange + (i / numSamples) * (2 * xRange);
        const my = a * mx * mx + b * mx + c;
        points.push(toScreen(mx, my));
      }

      ctx.moveTo(points[0].sx, points[0].sy);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].sx, points[i].sy);
      }

      ctx.strokeStyle = discriminant > 0 ? '#38bdf8' : discriminant === 0 ? '#f59e0b' : '#f43f5e';
      ctx.lineWidth = 3;
      ctx.shadowColor = ctx.strokeStyle;
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // 5. Roots (X-Intercepts)
      if (showRoots && discriminant >= 0) {
        if (root1 !== null) {
          const pr1 = toScreen(root1, 0);
          ctx.beginPath();
          ctx.arc(pr1.sx, pr1.sy, 6, 0, Math.PI * 2);
          ctx.fillStyle = '#10b981';
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Tooltip
          ctx.fillStyle = '#10b981';
          ctx.font = 'bold 10px monospace';
          ctx.fillText(`α = ${root1.toFixed(2)}`, pr1.sx - 15, pr1.sy + 18);
        }

        if (root2 !== null && Math.abs(root1! - root2) > 0.05) {
          const pr2 = toScreen(root2, 0);
          ctx.beginPath();
          ctx.arc(pr2.sx, pr2.sy, 6, 0, Math.PI * 2);
          ctx.fillStyle = '#10b981';
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Tooltip
          ctx.fillStyle = '#10b981';
          ctx.font = 'bold 10px monospace';
          ctx.fillText(`β = ${root2.toFixed(2)}`, pr2.sx - 15, pr2.sy + 18);
        }
      }

      // 6. Vertex Marker
      if (showVertex) {
        const pv = toScreen(vertexX, vertexY);
        ctx.beginPath();
        ctx.arc(pv.sx, pv.sy, 7, 0, Math.PI * 2);
        ctx.fillStyle = '#a855f7';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Vertex tag badge
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.strokeStyle = '#a855f7';
        ctx.lineWidth = 1;
        ctx.beginPath();
        const vText = `V(${vertexX.toFixed(1)}, ${vertexY.toFixed(1)})`;
        ctx.roundRect(pv.sx + 10, pv.sy - 20, 75, 18, 4);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#c084fc';
        ctx.font = 'bold 9px monospace';
        ctx.fillText(vText, pv.sx + 14, pv.sy - 8);
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
  }, [a, b, c, showVertex, showAxisOfSymmetry, showRoots, vertexX, vertexY, discriminant, root1, root2, getTransforms]);

  // Pointer drag on canvas to adjust vertex position
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;

    const { toScreen } = getTransforms(rect.width, rect.height);
    const pv = toScreen(vertexX, vertexY);
    const dist = Math.hypot(sx - pv.sx, sy - pv.sy);

    if (dist < 30) {
      setIsDraggingVertex(true);
      lightTap();
      canvas.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDraggingVertex) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;

    const { toMath } = getTransforms(rect.width, rect.height);
    const mathPos = toMath(sx, sy);

    // vertexX = -b / (2a) => b = -2a * vertexX
    // vertexY = a*(vertexX)² + b*(vertexX) + c => c = vertexY - a*(vertexX)² - b*(vertexX)
    const newVx = Math.max(-5, Math.min(5, Number(mathPos.x.toFixed(1))));
    const newVy = Math.max(-7, Math.min(7, Number(mathPos.y.toFixed(1))));

    const newB = -2 * a * newVx;
    const newC = newVy - a * newVx * newVx - newB * newVx;

    updateQuadraticParams({
      b: Number(newB.toFixed(1)),
      c: Number(newC.toFixed(1)),
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isDraggingVertex) {
      setIsDraggingVertex(false);
      try {
        canvasRef.current?.releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  const challengeLevels: ChallengeLevel[] = [
    {
      levelNumber: 1,
      title: 'Mission 1: Standard Factored Roots (3 & -1)',
      badge: 'Two Reals',
      description: 'Adjust coefficients so the parabola intersects the x-axis at x = 3 and x = -1.',
      requirementFormula: '(x - 3)(x + 1) = x^2 - 2x - 3 = 0',
      targetCriteria: 'Roots α = 3.0 and β = -1.0',
      xpReward: 40,
      autoPreset: () => updateQuadraticParams({ a: 1, b: -2, c: -3 }),
    },
    {
      levelNumber: 2,
      title: 'Mission 2: The Tangent Kiss (D = 0)',
      badge: 'Repeated Root',
      description: 'Create a perfect square trinomial where discriminant D = b² - 4ac = 0. The vertex will kiss the x-axis.',
      requirementFormula: '(x - 2)^2 = x^2 - 4x + 4 = 0',
      targetCriteria: 'Set discriminant D = 0',
      xpReward: 50,
      autoPreset: () => updateQuadraticParams({ a: 1, b: -4, c: 4 }),
    },
    {
      levelNumber: 3,
      title: 'Mission 3: Inverted & Floating (D < 0, a < 0)',
      badge: 'Complex Roots',
      description: 'Make the parabola frown downwards (a < 0) and float completely below the x-axis with 0 real roots.',
      requirementFormula: 'a < 0, \\quad D = b^2 - 4ac < 0',
      targetCriteria: 'Set a < 0 and D < 0',
      xpReward: 50,
      autoPreset: () => updateQuadraticParams({ a: -1, b: 2, c: -3 }),
    },
  ];

  return (
    <div className="relative w-full h-[calc(100vh-42px)] md:h-[calc(100vh-52px)] overflow-hidden flex flex-col bg-slate-950 text-slate-100 select-none">
      {/* Dynamic HUD Overlay */}
      {!isZenMode && (
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-20 min-w-[240px] sm:min-w-[280px] bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-2.5 sm:p-3 rounded-xl text-xs sm:text-sm space-y-1.5 shadow-2xl">
          <div className="flex items-center justify-between font-bold text-cyan-300 pb-1 border-b border-slate-800">
            <InlineMath math={`y = ${a !== 1 ? (a === -1 ? '-' : a) : ''}x^2 ${b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`}x ${c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`}`} />
          </div>

          <div className="flex items-center justify-between text-xs sm:text-sm pt-0.5">
            <span className="text-slate-400 font-medium">Discriminant <InlineMath math="\Delta" />:</span>
            <span
              className={`font-semibold flex items-center gap-1 ${
                discriminant > 0 ? 'text-emerald-400' : discriminant === 0 ? 'text-amber-400' : 'text-rose-400'
              }`}
            >
              <InlineMath math={`\\Delta = ${discriminant.toFixed(1)}`} />
              <span className="text-[11px] font-sans text-slate-300">
                {discriminant > 0 ? '(2 Roots)' : discriminant === 0 ? '(1 Root)' : '(0 Roots)'}
              </span>
            </span>
          </div>

          <div className="flex items-center justify-between text-xs sm:text-sm pt-0.5">
            <span className="text-slate-400 font-medium">Vertex <InlineMath math="V" />:</span>
            <span className="text-purple-300 font-medium">
              <InlineMath math={`V(${vertexX.toFixed(2)},\\, ${vertexY.toFixed(2)})`} />
            </span>
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
          conceptTitle="Discriminant Δ & Parabola Geometry"
          mathInsight={`$\\Delta = b^2 - 4ac = (${b})^2 - 4(${a})(${c}) = ${discriminant.toFixed(1)}$. Vertex: $V(${vertexX.toFixed(2)}, ${vertexY.toFixed(2)})$, Axis of symmetry: $x = ${vertexX.toFixed(2)}$.`}
          eli10Analogy="The discriminant $\Delta$ tells you how many times the curve touches the ground ($x$-axis). If $\Delta > 0$, it dips below ground and slices it TWICE. If $\Delta = 0$, it gives the ground a gentle KISS at one exact point. If $\Delta < 0$, it floats in the air and never touches the ground!"
          liveFeedback={
            discriminant > 0
              ? `2 Real Roots: $\\alpha = ${root1?.toFixed(2)}$, $\\beta = ${root2?.toFixed(2)}$. Parabola intersects the $x$-axis twice.`
              : discriminant === 0
              ? 'Kissing Tangent Root: $\\Delta = 0$. Vertex touches the $x$-axis at single repeated root.'
              : `Floating Parabola: $\\Delta = ${discriminant.toFixed(1)} < 0$. No real roots; curve never intersects the $x$-axis.`
          }
          quickAction={{
            label: "Alka Ma'am's Tangent Kiss (Δ = 0)",
            onApply: () => updateQuadraticParams({ a: 1, b: -4, c: 4 }),
          }}
        />

        {/* Real-time Mistake Doctor: Floating Parabola Diagnosis */}
        <MistakeDoctor
          isActive={discriminant < -0.5}
          blunderTitle="Floating Parabola: No Real Roots (D < 0)"
          whatHappened={`Discriminant D = b² - 4ac = (${discriminant.toFixed(1)}) is strictly negative! Taking the square root of a negative number under the radical √D does not yield any real solutions.`}
          examTrap="Students often assume that every quadratic equation must cross the x-axis. But if the entire curve floats above (or below) the ground, it never touches the x-axis, so real roots cannot exist!"
          prescription="Lower the parabola by decreasing constant c, or widen it by adjusting b so that b² ≥ 4ac."
          remedyLabel="Apply Alka Ma'am's Real Roots Fix (c = -3)"
          onApplyRemedy={() => updateQuadraticParams({ a: 1, b: -2, c: -3 })}
        />
      </div>

      {/* Collapsible Mobile Bottom Sheet */}
      <BottomSheet
        title="Quadratic Roots Mission Control"
        badgeLabel={`D = ${discriminant.toFixed(1)}`}
        quickEquation={`x = (-b ± √D)/(2a)`}
        onReset={() => resetParams('quadratic-roots')}
        theoryContent={
          <CoachTheoryModule
            simulatorId="quadratic-roots"
            extraLiveDetails={
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-xl bg-cyan-950/30 border border-cyan-800/40">
                    <span className="text-[10px] text-cyan-300 block font-semibold">Axis of Symmetry:</span>
                    <span className="font-mono text-white font-bold">x = -b/(2a) = {vertexX.toFixed(2)}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-purple-950/30 border border-purple-800/40">
                    <span className="text-[10px] text-purple-300 block font-semibold">Vertex Point:</span>
                    <span className="font-mono text-white font-bold">({vertexX.toFixed(2)}, {vertexY.toFixed(2)})</span>
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800 text-center font-mono text-xs">
                  {discriminant > 0 ? (
                    <span className="text-emerald-400 font-bold">
                      Roots: α = {root1?.toFixed(2)}, β = {root2?.toFixed(2)}
                    </span>
                  ) : discriminant === 0 ? (
                    <span className="text-amber-400 font-bold">Repeated Root: α = β = {root1?.toFixed(2)}</span>
                  ) : (
                    <span className="text-rose-400 font-bold">No Real Roots (D = {discriminant.toFixed(1)} &lt; 0)</span>
                  )}
                </div>
              </div>
            }
          />
        }
        challengeContent={
          <div className="space-y-4">
            <ChallengeManager
              simulatorId="quadratic-roots"
              simulatorTitle="The Parabola Root Hunter"
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
          <TouchSlider
            label="Curvature a"
            value={a}
            min={-2.5}
            max={2.5}
            step={0.25}
            formulaTerm="a"
            causeEffectHint={(val) =>
              val > 0
                ? `Opens UP (Smiley). Larger |a| = narrower parabola.`
                : `Opens DOWN (Frowny). Has maximum vertex at top.`
            }
            onChange={(val) => {
              let adjustedVal = val;
              if (Math.abs(adjustedVal) < 0.1) {
                // If moving towards 0, jump past 0 to avoid zero divide
                adjustedVal = a > 0 ? -0.25 : 0.25;
              }
              updateQuadraticParams({ a: adjustedVal });
            }}
          />

          <TouchSlider
            label="Linear b"
            value={b}
            min={-6}
            max={6}
            step={0.5}
            formulaTerm="b"
            causeEffectHint={(val) =>
              `Axis of symmetry x = -b/(2a) = ${(-val / (2 * a)).toFixed(2)}. Tilts slope at y-axis.`
            }
            onChange={(val) => updateQuadraticParams({ b: val })}
          />

          <TouchSlider
            label="Intercept c"
            value={c}
            min={-8}
            max={8}
            step={0.5}
            formulaTerm="c"
            causeEffectHint={(val) =>
              `Pure vertical shift: y-intercept = (0, ${val}). Lifts or lowers parabola across ground.`
            }
            onChange={(val) => updateQuadraticParams({ c: val })}
          />
        </div>
      </BottomSheet>
    </div>
  );
};
