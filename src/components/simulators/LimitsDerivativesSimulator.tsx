/**
 * LimitsDerivativesSimulator.tsx: Interactive Tangent Secant Zoom Lab & First Principles (Class 11 Calculus).
 * Features:
 * - Dynamic Function Curves: f(x) = x², x³, sin(x), √x, 1/x
 * - Draggable Point x₀ and Step Size h: watch secant line rotate and snap into the true tangent line as h → 0
 * - Difference Quotient Readout: m_sec = [f(x₀+h) - f(x₀)] / h converging to f’(x₀)
 * - Local Linearity Microscope Zoom (1x to 20x): see smooth curves flatten into straight lines!
 * - Unit Circle Squeeze Theorem visualization: cos(x) ≤ sin(x)/x ≤ 1
 * - "Auto Limit h → 0" animation
 * - 3 Progressive board exam challenges
 */
import React, { useEffect, useRef, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { 
  TrendingUp, 
  RotateCcw, 
  CheckCircle2, 
  ZoomIn, 
  Play, 
  Sliders, 
  Eye, 
  Sparkles,
  Activity
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

export const LimitsDerivativesSimulator: React.FC = () => {
  const {
    limitsDerivativesParams,
    updateLimitsDerivativesParams,
    resetParams,
    completeChallenge,
    challengeCompleted,
    isZenMode,
  } = useSimulatorStore();

  const {
    functionType,
    x0,
    hStep,
    zoomLevel,
    showSecantLine,
    showTangentLine,
    showDifferenceQuotient,
    showSqueezeTheorem,
    isApproachingZero,
  } = limitsDerivativesParams;

  const { lightTap, successBuzz } = useHaptics();
  const { playClick, playChime } = useSound();
  const { trackEvent } = useAnalytics();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dragPoint, setDragPoint] = useState<'P' | 'Q' | null>(null);
  const [hoverPoint, setHoverPoint] = useState<'P' | 'Q' | null>(null);

  // Mathematical functions and derivatives
  const evaluateF = useCallback((x: number) => {
    switch (functionType) {
      case 'x2': return x * x;
      case 'x3': return (x * x * x) / 3;
      case 'sin_x': return 2 * Math.sin(x);
      case 'sqrt_x': return x >= 0 ? 2 * Math.sqrt(x) : 0;
      case 'reciprocal': return x !== 0 ? 3 / x : 0;
      default: return x * x;
    }
  }, [functionType]);

  const evaluateDerivative = useCallback((x: number) => {
    switch (functionType) {
      case 'x2': return 2 * x;
      case 'x3': return x * x;
      case 'sin_x': return 2 * Math.cos(x);
      case 'sqrt_x': return x > 0 ? 1 / Math.sqrt(x) : 0;
      case 'reciprocal': return x !== 0 ? -3 / (x * x) : 0;
      default: return 2 * x;
    }
  }, [functionType]);

  const fx0 = evaluateF(x0);
  const fx0_plus_h = evaluateF(x0 + hStep);
  const secantSlope = (fx0_plus_h - fx0) / hStep;
  const tangentSlope = evaluateDerivative(x0);

  // Auto Limit h → 0 Animation
  useEffect(() => {
    let animId: number;
    if (isApproachingZero) {
      animId = requestAnimationFrame(() => {
        if (hStep > 0.01) {
          updateLimitsDerivativesParams({ hStep: Math.max(0.005, hStep * 0.92) });
        } else {
          updateLimitsDerivativesParams({ isApproachingZero: false, hStep: 0.005 });
          playChime();
          lightTap();
        }
      });
    }
    return () => cancelAnimationFrame(animId);
  }, [isApproachingZero, hStep, updateLimitsDerivativesParams, playChime, lightTap]);

  // Board Exam Challenge Evaluation
  useEffect(() => {
    // Challenge 1: The h → 0 Tangent Snap
    if (hStep <= 0.05 && !challengeCompleted['limit_h_zero_snap']) {
      completeChallenge('limit_h_zero_snap', 40);
      successBuzz();
      playChime();
      confetti({ particleCount: 35, spread: 60 });
      trackEvent('challenge_completed', { challengeId: 'limit_h_zero_snap' });
    }

    // Challenge 2: Local Linearity 10x Zoom Discovery
    if (zoomLevel >= 10 && !challengeCompleted['limit_local_linearity']) {
      completeChallenge('limit_local_linearity', 45);
      successBuzz();
      playChime();
      confetti({ particleCount: 45, spread: 65 });
      trackEvent('challenge_completed', { challengeId: 'limit_local_linearity' });
    }

    // Challenge 3: First Principles Derivative Check
    if (
      functionType === 'x2' &&
      Math.abs(x0 - 2.0) < 0.1 &&
      hStep < 0.1 &&
      !challengeCompleted['limit_x2_derivative']
    ) {
      completeChallenge('limit_x2_derivative', 50);
      successBuzz();
      playChime();
      confetti({ particleCount: 50, spread: 70 });
      trackEvent('challenge_completed', { challengeId: 'limit_x2_derivative' });
    }
  }, [
    hStep,
    zoomLevel,
    functionType,
    x0,
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

      // Deep space background
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, width, height);

      const originX = width / 2 - 30;
      const originY = height / 2 + 40;
      const baseScale = Math.min(width, height) / 12;
      const scale = baseScale * zoomLevel;

      const toScreen = (x: number, y: number) => ({
        sx: originX + (x - (zoomLevel > 1 ? x0 * (1 - 1 / zoomLevel) : 0)) * scale,
        sy: originY - (y - (zoomLevel > 1 ? fx0 * (1 - 1 / zoomLevel) : 0)) * scale,
      });

      // Grid lines
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      const stepGrid = zoomLevel >= 5 ? 0.2 : 1;
      for (let x = -10; x <= 10; x += stepGrid) {
        const { sx } = toScreen(x, 0);
        ctx.beginPath();
        ctx.moveTo(sx, 0);
        ctx.lineTo(sx, height);
        ctx.stroke();
      }
      for (let y = -10; y <= 15; y += stepGrid) {
        const { sy } = toScreen(0, y);
        ctx.beginPath();
        ctx.moveTo(0, sy);
        ctx.lineTo(width, sy);
        ctx.stroke();
      }

      // Cartesian Axes
      const { sx: axX, sy: axY } = toScreen(0, 0);
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, axY);
      ctx.lineTo(width, axY); // X axis
      ctx.moveTo(axX, 0);
      ctx.lineTo(axX, height); // Y axis
      ctx.stroke();

      // Draw Function Curve f(x)
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      let first = true;
      const xMin = -6;
      const xMax = 6;
      for (let x = xMin; x <= xMax; x += 0.04) {
        const y = evaluateF(x);
        const pt = toScreen(x, y);
        if (first) {
          ctx.moveTo(pt.sx, pt.sy);
          first = false;
        } else {
          ctx.lineTo(pt.sx, pt.sy);
        }
      }
      ctx.stroke();

      // Points P(x0, f(x0)) and Q(x0+h, f(x0+h))
      const pScreen = toScreen(x0, fx0);
      const qScreen = toScreen(x0 + hStep, fx0_plus_h);

      // Secant Line PQ (amber)
      if (showSecantLine) {
        const secantX1 = x0 - 4;
        const secantY1 = fx0 + secantSlope * (secantX1 - x0);
        const secantX2 = x0 + 4;
        const secantY2 = fx0 + secantSlope * (secantX2 - x0);
        const s1 = toScreen(secantX1, secantY1);
        const s2 = toScreen(secantX2, secantY2);

        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(s1.sx, s1.sy);
        ctx.lineTo(s2.sx, s2.sy);
        ctx.stroke();

        // Secant Slope Triangle (Δx and Δy)
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 3]);
        ctx.beginPath();
        ctx.moveTo(pScreen.sx, pScreen.sy);
        ctx.lineTo(qScreen.sx, pScreen.sy); // horizontal Δx
        ctx.lineTo(qScreen.sx, qScreen.sy); // vertical Δy
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // True Tangent Line (emerald)
      if (showTangentLine) {
        const tanX1 = x0 - 4;
        const tanY1 = fx0 + tangentSlope * (tanX1 - x0);
        const tanX2 = x0 + 4;
        const tanY2 = fx0 + tangentSlope * (tanX2 - x0);
        const t1 = toScreen(tanX1, tanY1);
        const t2 = toScreen(tanX2, tanY2);

        ctx.strokeStyle = '#34d399';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 3]);
        ctx.beginPath();
        ctx.moveTo(t1.sx, t1.sy);
        ctx.lineTo(t2.sx, t2.sy);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Draggable Point P marker
      const isPHovered = hoverPoint === 'P' || dragPoint === 'P';
      ctx.fillStyle = isPHovered ? '#7dd3fc' : '#38bdf8';
      ctx.beginPath();
      ctx.arc(pScreen.sx, pScreen.sy, isPHovered ? 9 : 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
      ctx.lineWidth = isPHovered ? 6 : 3;
      ctx.beginPath();
      ctx.arc(pScreen.sx, pScreen.sy, isPHovered ? 16 : 12, 0, Math.PI * 2);
      ctx.stroke();

      // Draggable Point Q marker
      const isQHovered = hoverPoint === 'Q' || dragPoint === 'Q';
      ctx.fillStyle = isQHovered ? '#fcd34d' : '#f59e0b';
      ctx.beginPath();
      ctx.arc(qScreen.sx, qScreen.sy, isQHovered ? 8 : 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.strokeStyle = 'rgba(245, 158, 11, 0.45)';
      ctx.lineWidth = isQHovered ? 5 : 2.5;
      ctx.beginPath();
      ctx.arc(qScreen.sx, qScreen.sy, isQHovered ? 14 : 10, 0, Math.PI * 2);
      ctx.stroke();

      // Point labels
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 12px monospace';
      ctx.fillText(`P(${x0.toFixed(2)}, ${fx0.toFixed(2)})`, pScreen.sx + 12, pScreen.sy - 8);
      ctx.fillStyle = '#f59e0b';
      ctx.fillText(`Q(x₀+h, h=${hStep.toFixed(2)})`, qScreen.sx + 12, qScreen.sy + 16);

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
    functionType,
    x0,
    hStep,
    zoomLevel,
    fx0,
    fx0_plus_h,
    secantSlope,
    tangentSlope,
    showSecantLine,
    showTangentLine,
    showDifferenceQuotient,
    showSqueezeTheorem,
    evaluateF,
    hoverPoint,
    dragPoint,
  ]);

  // Direct on-canvas pointer handlers to grip & drag points P and Q
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;
    const originX = rect.width / 2 - 30;
    const originY = rect.height / 2 + 40;
    const baseScale = Math.min(rect.width, rect.height) / 12;
    const scale = baseScale * zoomLevel;

    const toScreen = (x: number, y: number) => ({
      sx: originX + (x - (zoomLevel > 1 ? x0 * (1 - 1 / zoomLevel) : 0)) * scale,
      sy: originY - (y - (zoomLevel > 1 ? fx0 * (1 - 1 / zoomLevel) : 0)) * scale,
    });

    const pScreen = toScreen(x0, fx0);
    const qScreen = toScreen(x0 + hStep, fx0_plus_h);

    const distP = Math.hypot(sx - pScreen.sx, sy - pScreen.sy);
    const distQ = Math.hypot(sx - qScreen.sx, sy - qScreen.sy);

    if (distP < 28) {
      e.currentTarget.setPointerCapture(e.pointerId);
      setDragPoint('P');
      lightTap();
      playClick(1.2);
    } else if (distQ < 28) {
      e.currentTarget.setPointerCapture(e.pointerId);
      setDragPoint('Q');
      lightTap();
      playClick(1.2);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;
    const originX = rect.width / 2 - 30;
    const originY = rect.height / 2 + 40;
    const baseScale = Math.min(rect.width, rect.height) / 12;
    const scale = baseScale * zoomLevel;

    const offsetX = zoomLevel > 1 ? x0 * (1 - 1 / zoomLevel) : 0;
    const mathX = (sx - originX) / scale + offsetX;

    if (dragPoint === 'P') {
      const newX0 = Math.max(-4, Math.min(4, Number(mathX.toFixed(2))));
      updateLimitsDerivativesParams({ x0: newX0 });
      return;
    }

    if (dragPoint === 'Q') {
      const newH = Math.max(0.02, Math.min(3.5, Number((mathX - x0).toFixed(2))));
      updateLimitsDerivativesParams({ hStep: newH });
      return;
    }

    const toScreen = (x: number, y: number) => ({
      sx: originX + (x - offsetX) * scale,
      sy: originY - (y - (zoomLevel > 1 ? fx0 * (1 - 1 / zoomLevel) : 0)) * scale,
    });

    const pScreen = toScreen(x0, fx0);
    const qScreen = toScreen(x0 + hStep, fx0_plus_h);

    const distP = Math.hypot(sx - pScreen.sx, sy - pScreen.sy);
    const distQ = Math.hypot(sx - qScreen.sx, sy - qScreen.sy);

    if (distP < 28) {
      setHoverPoint('P');
    } else if (distQ < 28) {
      setHoverPoint('Q');
    } else {
      setHoverPoint(null);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (dragPoint) {
      setDragPoint(null);
      try {
        canvasRef.current?.releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  const challengeLevels: ChallengeLevel[] = [
    {
      levelNumber: 1,
      title: 'The h → 0 Tangent Snap',
      badge: 'Secant Snapper',
      description: 'Slide step h below 0.05 (or tap Auto Limit). Watch how the amber secant line snaps seamlessly onto the green tangent line!',
      requirementFormula: 'f\'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}',
      targetCriteria: 'Step size h ≤ 0.05',
      xpReward: 40,
      autoPreset: () => updateLimitsDerivativesParams({ hStep: 1.2, isApproachingZero: true }),
    },
    {
      levelNumber: 2,
      title: 'Local Linearity 10x Zoom',
      badge: 'Microscope Master',
      description: 'Crank the Microscope Zoom slider past 10x! Observe how ANY smooth curved function appears completely straight and linear up close!',
      requirementFormula: 'f(x) \\approx f(x_0) + f\'(x_0)(x - x_0)',
      targetCriteria: 'Zoom level ≥ 10x',
      xpReward: 45,
      autoPreset: () => updateLimitsDerivativesParams({ zoomLevel: 12 }),
    },
    {
      levelNumber: 3,
      title: 'First Principles of x² at x = 2',
      badge: 'First Principles',
      description: 'Select function f(x) = x². Set point x₀ = 2.0. Observe why the instantaneous derivative slope equals exactly 4 (since d/dx [x²] = 2x = 4)!',
      requirementFormula: '\\frac{d}{dx}[x^2]_{x=2} = 2(2) = 4',
      targetCriteria: 'f(x) = x² at x₀ = 2.0 with h < 0.1',
      xpReward: 50,
      autoPreset: () => updateLimitsDerivativesParams({ functionType: 'x2', x0: 2.0, hStep: 0.01 }),
    },
  ];

  return (
    <div className="relative w-full h-full flex flex-col bg-slate-950 text-slate-100 overflow-hidden select-none">
      {/* HUD Header Bar */}
      <div className="flex-none px-4 py-2 bg-slate-900/90 border-b border-slate-800 backdrop-blur-md flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold text-slate-200">
            LIMITS & DERIVATIVES LAB
          </span>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/40">
            m_sec = {secantSlope.toFixed(3)} ➔ f’(x₀) = {tangentSlope.toFixed(3)}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              playClick();
              lightTap();
              updateLimitsDerivativesParams({ isApproachingZero: true, hStep: 1.5 });
            }}
            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-600/40 active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
            title="Animate limit h approaching zero"
          >
            <Play className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Auto Limit</span>
          </button>

          <button
            onClick={() => {
              resetParams('limits-derivatives-lab');
              playClick();
              lightTap();
            }}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-all cursor-pointer"
            title="Reset Parameters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Interactive Canvas */}
      <div className="relative flex-1 w-full h-full min-h-[300px] overflow-hidden">
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className={`w-full h-full block touch-none ${
            dragPoint
              ? 'cursor-grabbing'
              : hoverPoint
              ? 'cursor-grab'
              : 'cursor-crosshair'
          }`}
        />

        {/* Direct on-canvas grip guide banner */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 pointer-events-none flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 shadow-xl backdrop-blur-md text-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shrink-0" />
          <span className="text-slate-300 font-sans">
            Catch and drag point <strong className="text-cyan-300">P(x₀)</strong> or <strong className="text-amber-400">Q(x₀+h)</strong> directly along the curve!
          </span>
        </div>

        {/* Real-time Pedagogical Concept Insight Banner */}
        <ConceptInsightBanner
          conceptTitle="Limits & Derivatives: Secant Snaps to Tangent"
          mathInsight={`Secant slope m_sec = [f(x₀+h) - f(x₀)] / h = [${fx0_plus_h.toFixed(3)} - ${fx0.toFixed(3)}] / ${hStep.toFixed(3)} = ${secantSlope.toFixed(3)}. Exact Derivative f'(x₀) = ${tangentSlope.toFixed(3)}.`}
          eli10Analogy="A car speedometer cannot calculate speed at 0 seconds (division by 0 is undefined)! Instead, it measures distance over a tiny fraction of a second h = 0.001s. Calculus limits do the exact same thing: shrinking h toward 0 to reveal instantaneous rate of change!"
          liveFeedback={
            hStep <= 0.05
              ? `⚡ Limit Converged! Secant slope (${secantSlope.toFixed(2)}) is within ${Math.abs(secantSlope - tangentSlope).toFixed(3)} of true tangent slope (${tangentSlope.toFixed(2)}).`
              : `Secant chord over span h = ${hStep.toFixed(2)}. Shrink h toward 0 to rotate secant into tangent!`
          }
          quickAction={{
            label: "Auto-Animate Limit (h ➔ 0)",
            onApply: () => updateLimitsDerivativesParams({ isApproachingZero: true }),
          }}
        />
      </div>

      {/* Collapsible Bottom Sheet */}
      <BottomSheet
        title="Tangent Secant Zoom Lab"
        badgeLabel={`f(x) = ${functionType}`}
        quickEquation="f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}"
        onReset={() => resetParams('limits-derivatives-lab')}
        theoryContent={<CoachTheoryModule simulatorId="limits-derivatives-lab" />}
        challengeContent={
          <div className="space-y-4">
            <ChallengeManager
              simulatorId="limits-derivatives-lab"
              simulatorTitle="Tangent Secant Zoom Lab"
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
          {/* Function Curve Selector */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Target Function f(x)
            </label>
            <div className="grid grid-cols-5 gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
              {(['x2', 'x3', 'sin_x', 'sqrt_x', 'reciprocal'] as const).map((fn) => (
                <button
                  key={fn}
                  onClick={() => {
                    updateLimitsDerivativesParams({ functionType: fn });
                    playClick();
                    lightTap();
                  }}
                  className={`py-1.5 text-[11px] font-semibold rounded-lg transition-all cursor-pointer ${
                    functionType === fn
                      ? 'bg-cyan-500 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {fn === 'x2' && 'x²'}
                  {fn === 'x3' && 'x³/3'}
                  {fn === 'sin_x' && 'sin(x)'}
                  {fn === 'sqrt_x' && '√x'}
                  {fn === 'reciprocal' && '1/x'}
                </button>
              ))}
            </div>
          </div>

          {/* Point x0 Slider */}
          <TouchSlider
            label="Tangent Point (x₀)"
            value={x0}
            min={functionType === 'sqrt_x' ? 0.2 : -3}
            max={3}
            step={0.1}
            unit=""
            formulaTerm="x₀"
            causeEffectHint={(val) =>
              `True tangent slope f'(${val.toFixed(1)}) = ${evaluateDerivative(val).toFixed(2)}`
            }
            onChange={(val) => updateLimitsDerivativesParams({ x0: val })}
          />

          {/* Step Size h Slider */}
          <TouchSlider
            label="Step Size (h ➔ 0)"
            value={hStep}
            min={0.005}
            max={2.0}
            step={0.02}
            unit=""
            formulaTerm="h → 0"
            causeEffectHint={(val) =>
              val <= 0.05
                ? `Limit converged! Secant slope (${secantSlope.toFixed(2)}) ≈ Tangent (${tangentSlope.toFixed(2)})`
                : `Chord span: shrink h toward 0 to watch secant rotate into tangent`
            }
            onChange={(val) => updateLimitsDerivativesParams({ hStep: val })}
          />

          {/* Microscope Zoom Slider */}
          <TouchSlider
            label="Microscope Zoom"
            value={zoomLevel}
            min={1}
            max={20}
            step={1}
            unit="x"
            formulaTerm="Zoom"
            causeEffectHint={(val) =>
              val > 8
                ? `Local Linearity: at ${val}× zoom, curved parabola flattens into a straight line!`
                : `Magnification: zoom into x₀ to inspect local flatness`
            }
            onChange={(val) => updateLimitsDerivativesParams({ zoomLevel: val })}
          />

          {/* Toggles */}
          <div className="space-y-2 pt-1 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-amber-400 font-semibold">Show Amber Secant Line</span>
              <button
                onClick={() => updateLimitsDerivativesParams({ showSecantLine: !showSecantLine })}
                className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                  showSecantLine ? 'bg-amber-500' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${
                    showSecantLine ? 'left-4.5' : 'left-0.5'
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-emerald-400 font-semibold">Show Green Tangent Line</span>
              <button
                onClick={() => updateLimitsDerivativesParams({ showTangentLine: !showTangentLine })}
                className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                  showTangentLine ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${
                    showTangentLine ? 'left-4.5' : 'left-0.5'
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
