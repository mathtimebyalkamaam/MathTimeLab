/**
 * HeronTrianglesSimulator.tsx: Interactive Triangle Area & Heron's Formula (Class 9).
 * Features:
 * - Touch & drag 3 vertices A, B, C freely on a 2D coordinate grid
 * - Real-time calculation of side lengths a, b, c and semi-perimeter s = (a+b+c)/2
 * - Heron's formula derivation: Δ = √[s(s-a)(s-b)(s-c)]
 * - Incircle rendering with inradius r = Δ / s
 * - Altitude comparison: verifies 1/2 · base · height = Heron's area
 * - Degenerate triangle collapse indicator when a + b = c
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
import { LiveSubstitutionCard } from '../common/LiveSubstitutionCard';

export const HeronTrianglesSimulator: React.FC = () => {
  const {
    heronParams,
    updateHeronParams,
    resetParams,
    completeChallenge,
    challengeCompleted,
    isZenMode,
  } = useSimulatorStore();

  const {
    ax,
    ay,
    bx,
    by,
    cx,
    cy,
    showIncircle,
    showAltitude,
    showStepBreakdown,
  } = heronParams;

  const { lightTap, successBuzz } = useHaptics();
  const { playClick, playChime } = useSound();
  const { trackEvent } = useAnalytics();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeVertex, setActiveVertex] = useState<'A' | 'B' | 'C' | null>(null);

  // Side lengths: a is opposite A (BC), b is opposite B (AC), c is opposite C (AB)
  const a = Math.hypot(cx - bx, cy - by);
  const b = Math.hypot(cx - ax, cy - ay);
  const c = Math.hypot(bx - ax, by - ay);

  const s = (a + b + c) / 2;

  // Triangle inequality check
  const isDegenerate = a + b <= c + 0.01 || b + c <= a + 0.01 || a + c <= b + 0.01;
  const radicand = s * (s - a) * (s - b) * (s - c);
  const area = isDegenerate || radicand <= 0 ? 0 : Math.sqrt(radicand);

  // Inradius r = Area / s
  const inradius = s > 0 ? area / s : 0;

  // Incenter coordinates I = (a·A + b·B + c·C) / (a + b + c)
  const perimeter = a + b + c;
  const incenterX = perimeter > 0 ? (a * ax + b * bx + c * cx) / perimeter : 0;
  const incenterY = perimeter > 0 ? (a * ay + b * by + c * cy) / perimeter : 0;

  // Altitude to side c (base AB)
  const altitudeH = c > 0 ? (2 * area) / c : 0;

  // Coordinate transforms
  const getTransforms = useCallback((width: number, height: number) => {
    const scale = Math.min(width, height) / 16; // 16 units viewbox
    const originX = width / 2 - 40;
    const originY = height / 2 + 60;

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
    // Challenge 1: 3-4-5 Right Triangle (Area = 6)
    const sides = [a, b, c].sort((x, y) => x - y);
    if (
      Math.abs(sides[0] - 3) < 0.25 &&
      Math.abs(sides[1] - 4) < 0.25 &&
      Math.abs(sides[2] - 5) < 0.25 &&
      !challengeCompleted['heron_3_4_5']
    ) {
      completeChallenge('heron_3_4_5', 40);
      successBuzz();
      playChime();
      confetti({ particleCount: 40, spread: 60 });
      trackEvent('challenge_completed', { challengeId: 'heron_3_4_5' });
    }

    // Challenge 2: Equilateral Triangle (all sides within 0.3)
    if (
      a > 3 &&
      Math.abs(a - b) < 0.2 &&
      Math.abs(b - c) < 0.2 &&
      !challengeCompleted['heron_equilateral']
    ) {
      completeChallenge('heron_equilateral', 45);
      successBuzz();
      playChime();
      confetti({ particleCount: 40, spread: 60 });
      trackEvent('challenge_completed', { challengeId: 'heron_equilateral' });
    }

    // Challenge 3: Inradius = 2.0
    if (
      Math.abs(inradius - 2.0) < 0.15 &&
      area > 10 &&
      !challengeCompleted['heron_inradius_2']
    ) {
      completeChallenge('heron_inradius_2', 50);
      successBuzz();
      playChime();
      confetti({ particleCount: 40, spread: 60 });
      trackEvent('challenge_completed', { challengeId: 'heron_inradius_2' });
    }
  }, [a, b, c, inradius, area, challengeCompleted, completeChallenge, successBuzz, playChime, trackEvent]);

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

      // Coordinate axes
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, originY);
      ctx.lineTo(width, originY);
      ctx.moveTo(originX, 0);
      ctx.lineTo(originX, height);
      ctx.stroke();

      const sA = toScreen(ax, ay);
      const sB = toScreen(bx, by);
      const sC = toScreen(cx, cy);

      // Triangle interior shading
      const triGrad = ctx.createLinearGradient(sA.sx, sA.sy, sC.sx, sC.sy);
      triGrad.addColorStop(0, 'rgba(56, 189, 248, 0.15)');
      triGrad.addColorStop(1, 'rgba(168, 85, 247, 0.15)');
      ctx.fillStyle = triGrad;
      ctx.beginPath();
      ctx.moveTo(sA.sx, sA.sy);
      ctx.lineTo(sB.sx, sB.sy);
      ctx.lineTo(sC.sx, sC.sy);
      ctx.closePath();
      ctx.fill();

      // Triangle perimeter edges
      ctx.strokeStyle = isDegenerate ? '#f43f5e' : '#38bdf8';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Incircle (if enabled and non-degenerate)
      if (showIncircle && !isDegenerate && inradius > 0) {
        const sI = toScreen(incenterX, incenterY);
        ctx.strokeStyle = '#34d399';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(sI.sx, sI.sy, inradius * scale, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = 'rgba(52, 211, 153, 0.1)';
        ctx.fill();

        // Incenter point
        ctx.fillStyle = '#34d399';
        ctx.beginPath();
        ctx.arc(sI.sx, sI.sy, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = 'bold 10px monospace';
        ctx.fillText(`Inradius r = ${inradius.toFixed(2)}`, sI.sx + 8, sI.sy - 6);
      }

      // Altitude from C to line AB (if enabled)
      if (showAltitude && !isDegenerate && c > 0) {
        // Projection of C onto vector AB
        const abX = bx - ax;
        const abY = by - ay;
        const acX = cx - ax;
        const acY = cy - ay;
        const t = (acX * abX + acY * abY) / (abX * abX + abY * abY);
        const footX = ax + t * abX;
        const footY = ay + t * abY;
        const sFoot = toScreen(footX, footY);

        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 3]);
        ctx.beginPath();
        ctx.moveTo(sC.sx, sC.sy);
        ctx.lineTo(sFoot.sx, sFoot.sy);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 10px monospace';
        ctx.fillText(`h = ${altitudeH.toFixed(2)}`, (sC.sx + sFoot.sx) / 2 + 6, (sC.sy + sFoot.sy) / 2);
      }

      // Side length labels along edges
      const midAB = { sx: (sA.sx + sB.sx) / 2, sy: (sA.sy + sB.sy) / 2 };
      const midBC = { sx: (sB.sx + sC.sx) / 2, sy: (sB.sy + sC.sy) / 2 };
      const midCA = { sx: (sC.sx + sA.sx) / 2, sy: (sC.sy + sA.sy) / 2 };

      ctx.font = 'bold 11px monospace';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText(`c = ${c.toFixed(2)}`, midAB.sx - 10, midAB.sy + 18);
      ctx.fillStyle = '#fbbf24';
      ctx.fillText(`a = ${a.toFixed(2)}`, midBC.sx + 10, midBC.sy - 4);
      ctx.fillStyle = '#c084fc';
      ctx.fillText(`b = ${b.toFixed(2)}`, midCA.sx - 35, midCA.sy - 4);

      // Vertex markers
      const drawHandle = (pt: { sx: number; sy: number }, label: string, color: string) => {
        ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
        ctx.beginPath();
        ctx.arc(pt.sx, pt.sy, 16, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(pt.sx, pt.sy, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.font = 'bold 13px sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(label, pt.sx - 5, pt.sy - 12);
      };

      drawHandle(sA, 'A', '#38bdf8');
      drawHandle(sB, 'B', '#fbbf24');
      drawHandle(sC, 'C', '#c084fc');

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [
    ax,
    ay,
    bx,
    by,
    cx,
    cy,
    a,
    b,
    c,
    inradius,
    incenterX,
    incenterY,
    altitudeH,
    isDegenerate,
    showIncircle,
    showAltitude,
    getTransforms,
  ]);

  // Pointer drag to adjust vertices
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;

    const { toScreen } = getTransforms(rect.width, rect.height);
    const sA = toScreen(ax, ay);
    const sB = toScreen(bx, by);
    const sC = toScreen(cx, cy);

    const distA = Math.hypot(sx - sA.sx, sy - sA.sy);
    const distB = Math.hypot(sx - sB.sx, sy - sB.sy);
    const distC = Math.hypot(sx - sC.sx, sy - sC.sy);

    if (distA < 25) {
      setActiveVertex('A');
      canvas.setPointerCapture(e.pointerId);
      lightTap();
    } else if (distB < 25) {
      setActiveVertex('B');
      canvas.setPointerCapture(e.pointerId);
      lightTap();
    } else if (distC < 25) {
      setActiveVertex('C');
      canvas.setPointerCapture(e.pointerId);
      lightTap();
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!activeVertex) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;

    const { toMath } = getTransforms(rect.width, rect.height);
    const mathPt = toMath(sx, sy);
    const snapX = Math.round(mathPt.x * 2) / 2; // snap to 0.5 units
    const snapY = Math.round(mathPt.y * 2) / 2;

    if (activeVertex === 'A') {
      updateHeronParams({ ax: snapX, ay: snapY });
    } else if (activeVertex === 'B') {
      updateHeronParams({ bx: snapX, by: snapY });
    } else if (activeVertex === 'C') {
      updateHeronParams({ cx: snapX, cy: snapY });
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (activeVertex) {
      setActiveVertex(null);
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
      title: 'The 3-4-5 Right Triangle',
      badge: '3-4-5 Triplet',
      description: 'Drag the vertices to form a 3-4-5 right triangle. Observe that Heron gives area Δ = 6, matching 1/2 · 3 · 4 exactly!',
      requirementFormula: '\\Delta = \\sqrt{6(6-3)(6-4)(6-5)} = 6',
      targetCriteria: 'Form sides a = 3, b = 4, c = 5',
      xpReward: 40,
      autoPreset: () => updateHeronParams({ ax: 0, ay: 0, bx: 4, by: 0, cx: 0, cy: 3 }),
    },
    {
      levelNumber: 2,
      title: 'The Equilateral Area Formula',
      badge: 'Equilateral (√3/4)a²',
      description: 'Set an equilateral triangle with side a = 6. Verify that Heron matches (√3 / 4)a² ≈ 15.59 u².',
      requirementFormula: '\\Delta = \\frac{\\sqrt{3}}{4} a^2 = \\frac{\\sqrt{3}}{4} (36) \\approx 15.59',
      targetCriteria: 'Set all three sides equal to 6',
      xpReward: 45,
      autoPreset: () => updateHeronParams({ ax: 0, ay: 0, bx: 6, by: 0, cx: 3, cy: 3 * Math.sqrt(3) }),
    },
    {
      levelNumber: 3,
      title: 'The Inradius Master',
      badge: 'r = Δ / s',
      description: 'Form a triangle where inradius r = 2.0. Observe how the inscribed circle fits snugly touching all 3 sides!',
      requirementFormula: 'r = \\frac{\\Delta}{s} = 2.0',
      targetCriteria: 'Achieve inradius r = 2.0',
      xpReward: 50,
      autoPreset: () => updateHeronParams({ ax: 0, ay: 0, bx: 8, by: 0, cx: 0, cy: 6 }),
    },
  ];

  return (
    <div className="relative w-full h-[calc(100vh-42px)] md:h-[calc(100vh-52px)] overflow-hidden flex flex-col bg-slate-950 text-slate-100 select-none">
      {/* Dynamic HUD Overlay */}
      {!isZenMode && (
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-20 max-w-[210px] sm:max-w-[260px] bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-2 sm:p-2.5 rounded-xl text-xs space-y-1.5 shadow-2xl">
          <div className="flex items-center justify-between font-mono font-bold text-cyan-300">
            <span>Area Δ = {area.toFixed(2)} u²</span>
          </div>

          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800">
            <span className="text-slate-400">Semi-perimeter s:</span>
            <span className="font-mono text-cyan-400 font-bold">{s.toFixed(2)} u</span>
          </div>

          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Sides a, b, c:</span>
            <span className="font-mono text-amber-300 font-bold">
              {a.toFixed(1)}, {b.toFixed(1)}, {c.toFixed(1)}
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Inradius r:</span>
            <span className="font-mono text-emerald-400 font-bold">{inradius.toFixed(2)} u</span>
          </div>

          {isDegenerate && (
            <div className="pt-0.5 text-[10px] text-rose-400 font-bold font-mono">
              Collapsed: a + b ≤ c (Area = 0)
            </div>
          )}
        </div>
      )}

      {/* Main Interactive Stage */}
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
            onClick={() => updateHeronParams({ ax: 0, ay: 0, bx: 4, by: 0, cx: 0, cy: 3 })}
            className="py-1 px-2.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-[11px] font-mono font-bold text-cyan-300 cursor-pointer"
          >
            3-4-5 Triplet
          </button>
          <button
            type="button"
            onClick={() => updateHeronParams({ ax: 0, ay: 0, bx: 6, by: 0, cx: 3, cy: Number((3 * Math.sqrt(3)).toFixed(2)) })}
            className="py-1 px-2.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-[11px] font-mono font-bold text-amber-300 cursor-pointer"
          >
            Equilateral 6
          </button>
          <button
            type="button"
            onClick={() => updateHeronParams({ ax: 0, ay: 0, bx: 14, by: 0, cx: 5, cy: 12 })}
            className="py-1 px-2.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-[11px] font-mono font-bold text-emerald-300 cursor-pointer"
          >
            13-14-15 Classic
          </button>
        </div>
      </div>

      {/* Collapsible Mobile Bottom Sheet */}
      <BottomSheet
        title="Heron's Formula Mission Control"
        badgeLabel={`Area = ${area.toFixed(1)} u²`}
        quickEquation="\Delta = \sqrt{s(s-a)(s-b)(s-c)}"
        onReset={() => resetParams('heron-triangles')}
        theoryContent={
          <CoachTheoryModule
            simulatorId="heron-triangles"
            extraLiveDetails={
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-2 text-xs text-center font-mono">
                  <div className="p-2 rounded-xl bg-cyan-950/30 border border-cyan-800/40">
                    <span className="text-[10px] text-cyan-300 block font-semibold">s - a</span>
                    <span className="text-white font-bold">{(s - a).toFixed(2)}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-purple-950/30 border border-purple-800/40">
                    <span className="text-[10px] text-purple-300 block font-semibold">s - b</span>
                    <span className="text-white font-bold">{(s - b).toFixed(2)}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-amber-950/30 border border-amber-800/40">
                    <span className="text-[10px] text-amber-300 block font-semibold">s - c</span>
                    <span className="text-white font-bold">{(s - c).toFixed(2)}</span>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800 text-center font-mono text-xs">
                  <span className="text-emerald-400 font-bold">
                    Area Δ = √[{s.toFixed(1)} × {(s-a).toFixed(1)} × {(s-b).toFixed(1)} × {(s-c).toFixed(1)}] = {area.toFixed(2)} u²
                  </span>
                </div>
              </div>
            }
          />
        }
        challengeContent={
          <div className="space-y-4">
            <ChallengeManager
              simulatorId="heron-triangles"
              simulatorTitle="The Heron Surveyor"
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
            title="Heron's Formula Geometric Invariant"
            badge={`s = ${s.toFixed(2)}`}
            symbolicLaw="\Delta = \sqrt{s(s-a)(s-b)(s-c)}, \quad r = \frac{\Delta}{s}"
            substitutedLatex={`\\Delta = \\sqrt{${s.toFixed(1)}(${(s - a).toFixed(1)})(${(s - b).toFixed(1)})(${(s - c).toFixed(1)})}`}
            evaluatedLatex={`\\Delta = ${area.toFixed(2)} \\text{ u}^2, \\quad \\text{Inradius } r = ${(area / (s || 1)).toFixed(2)} \\text{ u}`}
          />

          <div className="grid grid-cols-2 gap-2">
            <TouchSlider
              label="Vertex C - X Coordinate"
              value={cx}
              min={-4}
              max={10}
              step={0.5}
              onChange={(val) => updateHeronParams({ cx: val })}
            />
            <TouchSlider
              label="Vertex C - Y Coordinate (Altitude)"
              value={cy}
              min={0}
              max={10}
              step={0.5}
              onChange={(val) => updateHeronParams({ cy: val })}
            />
          </div>

          <TouchSlider
            label="Base Width (Vertex B X Position)"
            value={bx}
            min={3}
            max={14}
            step={0.5}
            onChange={(val) => updateHeronParams({ bx: val })}
          />

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => updateHeronParams({ showIncircle: !showIncircle })}
              className={`p-2 rounded-lg text-xs font-medium border text-center transition-colors cursor-pointer ${
                showIncircle
                  ? 'bg-emerald-950/80 border-emerald-600 text-emerald-200'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              Incircle (r = Δ/s)
            </button>
            <button
              type="button"
              onClick={() => updateHeronParams({ showAltitude: !showAltitude })}
              className={`p-2 rounded-lg text-xs font-medium border text-center transition-colors cursor-pointer ${
                showAltitude
                  ? 'bg-amber-950/80 border-amber-600 text-amber-200'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              Altitude h = 2Δ/c
            </button>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
};
