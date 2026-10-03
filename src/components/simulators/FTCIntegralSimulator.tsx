/**
 * FTCIntegralSimulator.tsx: Interactive Fundamental Theorem of Calculus & Area Accumulator (Class 12 Calculus).
 * Features:
 * - Dynamic dual-curve synchronizer:
 *   Top: Integrand f(t) with Riemann sum rectangles (N=4 to 64) and shaded definite integral from a to x
 *   Bottom: Accumulator function A(x) = ∫_a^x f(t) dt with dynamic tangent line whose slope m locks onto f(x)
 * - Proves d/dx[∫_a^x f(t) dt] = f(x) and ∫_a^b f(x) dx = F(b) - F(a)
 * - Net signed area vs absolute area visualizer
 * - 3 Board exam challenges
 */
import React, { useEffect, useRef, useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  TrendingUp, 
  RotateCcw, 
  CheckCircle2, 
  Layers, 
  Target, 
  Sparkles, 
  Zap,
  Activity,
  Maximize2
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

export const FTCIntegralSimulator: React.FC = () => {
  const {
    ftcIntegralParams,
    updateFTCIntegralParams,
    resetParams,
    completeChallenge,
    challengeCompleted,
    isZenMode,
  } = useSimulatorStore();

  const {
    functionType,
    lowerBoundA,
    upperBoundX,
    riemannMethod,
    rectanglesN,
    showAccumulationCurve,
    showTangentSlopeAtX,
    showNetSignedArea,
  } = ftcIntegralParams;

  const { lightTap, successBuzz } = useHaptics();
  const { playClick, playChime } = useSound();
  const { trackEvent } = useAnalytics();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDraggingSweep, setIsDraggingSweep] = useState(false);
  const [isHoveringSweep, setIsHoveringSweep] = useState(false);

  // Mathematical definitions: f(t), exact antiderivative F(t), and interval bounds
  const config = useMemo(() => {
    switch (functionType) {
      case 'sinusoid':
        return {
          name: 'f(t) = 2 sin(t)',
          formulaLatex: 'f(t) = 2 \\sin(t)',
          f: (t: number) => 2 * Math.sin(t),
          F: (t: number) => -2 * Math.cos(t),
          tMin: 0,
          tMax: 6.283, // 2π
          yMin: -2.5,
          yMax: 2.5,
          aDefault: 0,
        };
      case 'cubic':
        return {
          name: 'f(t) = 3t - t²',
          formulaLatex: 'f(t) = 3t - t^2',
          f: (t: number) => 3 * t - t * t,
          F: (t: number) => 1.5 * t * t - (t * t * t) / 3,
          tMin: 0,
          tMax: 3.5,
          yMin: -1.5,
          yMax: 2.8,
          aDefault: 0,
        };
      case 'exponential':
        return {
          name: 'f(t) = e^(0.5t)',
          formulaLatex: 'f(t) = e^{0.5t}',
          f: (t: number) => Math.exp(0.5 * t),
          F: (t: number) => 2 * Math.exp(0.5 * t),
          tMin: 0,
          tMax: 3.0,
          yMin: 0,
          yMax: 5.0,
          aDefault: 0,
        };
      case 'quadratic':
      default:
        return {
          name: 'f(t) = t²',
          formulaLatex: 'f(t) = t^2',
          f: (t: number) => t * t,
          F: (t: number) => (t * t * t) / 3,
          tMin: 0,
          tMax: 3.0,
          yMin: 0,
          yMax: 9.0,
          aDefault: 0,
        };
    }
  }, [functionType]);

  // Current values
  const currentHeight_fx = config.f(upperBoundX);
  const exactIntegral = config.F(upperBoundX) - config.F(lowerBoundA);

  // Compute Riemann sum approximation
  const riemannResult = useMemo(() => {
    const N = Math.max(1, rectanglesN);
    const dt = (upperBoundX - lowerBoundA) / N;
    if (dt === 0) return 0;

    let sum = 0;
    for (let i = 0; i < N; i++) {
      const tLeft = lowerBoundA + i * dt;
      const tRight = tLeft + dt;
      let sampleT = tLeft;

      if (riemannMethod === 'left') sampleT = tLeft;
      else if (riemannMethod === 'right') sampleT = tRight;
      else if (riemannMethod === 'midpoint') sampleT = (tLeft + tRight) / 2;
      else if (riemannMethod === 'trapezoid') {
        sum += 0.5 * (config.f(tLeft) + config.f(tRight)) * dt;
        continue;
      }

      sum += config.f(sampleT) * dt;
    }
    return sum;
  }, [lowerBoundA, upperBoundX, rectanglesN, riemannMethod, config]);

  const riemannError = Math.abs(riemannResult - exactIntegral);

  // Challenges evaluation
  useEffect(() => {
    // Challenge 1: The Zero Net Area Trap (Sinusoid on [0, 2π])
    if (
      functionType === 'sinusoid' &&
      Math.abs(upperBoundX - 6.28) < 0.2 &&
      Math.abs(exactIntegral) < 0.1 &&
      !challengeCompleted['ftc_zero_net_area']
    ) {
      completeChallenge('ftc_zero_net_area', 40);
      successBuzz();
      playChime();
      confetti({ particleCount: 35, spread: 60 });
      trackEvent('challenge_completed', { challengeId: 'ftc_zero_net_area' });
    }

    // Challenge 2: Squeeze Riemann Error with N >= 48
    if (rectanglesN >= 48 && riemannError < 0.03 && !challengeCompleted['ftc_riemann_squeeze']) {
      completeChallenge('ftc_riemann_squeeze', 40);
      successBuzz();
      playChime();
      confetti({ particleCount: 40, spread: 65 });
      trackEvent('challenge_completed', { challengeId: 'ftc_riemann_squeeze' });
    }

    // Challenge 3: Tangent Slope Lock at x = 2.0 on t² (m = 4.00)
    if (
      functionType === 'quadratic' &&
      Math.abs(upperBoundX - 2.0) < 0.05 &&
      !challengeCompleted['ftc_slope_lock']
    ) {
      completeChallenge('ftc_slope_lock', 40);
      successBuzz();
      playChime();
      confetti({ particleCount: 45, spread: 70 });
      trackEvent('challenge_completed', { challengeId: 'ftc_slope_lock' });
    }
  }, [
    functionType,
    upperBoundX,
    exactIntegral,
    rectanglesN,
    riemannError,
    challengeCompleted,
    completeChallenge,
    successBuzz,
    playChime,
    trackEvent,
  ]);

  // Canvas drawing loop
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

    // Clear background
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, width, height);

    // Layout: If showAccumulationCurve, split vertically into 2 panels
    const hasDual = showAccumulationCurve;
    const panelH = hasDual ? height / 2 : height;

    // Panel 1: Integrand f(t)
    const p1 = {
      x: 45,
      y: 15,
      w: width - 60,
      h: panelH - 35,
    };

    const toScreen1 = (t: number, y: number) => {
      const sx = p1.x + ((t - config.tMin) / (config.tMax - config.tMin)) * p1.w;
      const sy = p1.y + p1.h - ((y - config.yMin) / (config.yMax - config.yMin)) * p1.h;
      return { x: sx, y: sy };
    };

    // Draw Grid & Axes for Panel 1
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    const zeroY1 = toScreen1(0, 0).y;

    // Zero axis line
    ctx.beginPath();
    ctx.moveTo(p1.x, zeroY1);
    ctx.lineTo(p1.x + p1.w, zeroY1);
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Riemann rectangles under f(t) from a to x
    const N = Math.max(1, rectanglesN);
    const dt = (upperBoundX - lowerBoundA) / N;

    if (riemannMethod !== 'exact' && dt > 0) {
      for (let i = 0; i < N; i++) {
        const tLeft = lowerBoundA + i * dt;
        const tRight = tLeft + dt;
        let sampleT = (tLeft + tRight) / 2;
        if (riemannMethod === 'left') sampleT = tLeft;
        if (riemannMethod === 'right') sampleT = tRight;

        const val = config.f(sampleT);
        const pTL = toScreen1(tLeft, Math.max(0, val));
        const pBR = toScreen1(tRight, Math.min(0, val));
        const rectW = Math.max(1, pBR.x - pTL.x);
        const rectH = Math.abs(toScreen1(sampleT, val).y - zeroY1);

        const isPositive = val >= 0;
        ctx.fillStyle = isPositive ? 'rgba(56, 189, 248, 0.28)' : 'rgba(239, 68, 68, 0.28)';
        ctx.strokeStyle = isPositive ? '#38bdf8' : '#ef4444';
        ctx.lineWidth = 1;

        if (isPositive) {
          ctx.fillRect(pTL.x, pTL.y, rectW, rectH);
          ctx.strokeRect(pTL.x, pTL.y, rectW, rectH);
        } else {
          ctx.fillRect(pTL.x, zeroY1, rectW, rectH);
          ctx.strokeRect(pTL.x, zeroY1, rectW, rectH);
        }
      }
    } else {
      // Smooth shaded area from a to x
      ctx.beginPath();
      const startPt = toScreen1(lowerBoundA, 0);
      ctx.moveTo(startPt.x, startPt.y);

      const steps = 60;
      for (let s = 0; s <= steps; s++) {
        const t = lowerBoundA + (s / steps) * (upperBoundX - lowerBoundA);
        const pt = toScreen1(t, config.f(t));
        ctx.lineTo(pt.x, pt.y);
      }
      const endPt = toScreen1(upperBoundX, 0);
      ctx.lineTo(endPt.x, endPt.y);
      ctx.closePath();

      const grad = ctx.createLinearGradient(0, p1.y, 0, p1.y + p1.h);
      grad.addColorStop(0, 'rgba(56, 189, 248, 0.4)');
      grad.addColorStop(1, 'rgba(14, 165, 233, 0.05)');
      ctx.fillStyle = grad;
      ctx.fill();
    }

    // Curve f(t)
    ctx.beginPath();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    for (let px = 0; px <= p1.w; px += 2) {
      const t = config.tMin + (px / p1.w) * (config.tMax - config.tMin);
      const pt = toScreen1(t, config.f(t));
      if (px === 0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    }
    ctx.stroke();

    // Upper limit sweep vertical line at x
    const sweepTop = toScreen1(upperBoundX, config.yMax).y;
    const sweepBot = toScreen1(upperBoundX, config.yMin).y;
    const sweepX = toScreen1(upperBoundX, 0).x;

    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(sweepX, sweepTop);
    ctx.lineTo(sweepX, sweepBot);
    ctx.stroke();
    ctx.setLineDash([]);

    // Curve point (x, f(x))
    const currPt1 = toScreen1(upperBoundX, currentHeight_fx);
    const isSweepActive = isDraggingSweep || isHoveringSweep;
    ctx.fillStyle = isSweepActive ? '#38bdf8' : '#f59e0b';
    ctx.beginPath();
    ctx.arc(currPt1.x, currPt1.y, isSweepActive ? 8 : 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.strokeStyle = isSweepActive ? 'rgba(56, 189, 248, 0.5)' : 'rgba(245, 158, 11, 0.4)';
    ctx.lineWidth = isSweepActive ? 6 : 3;
    ctx.beginPath();
    ctx.arc(currPt1.x, currPt1.y, isSweepActive ? 15 : 11, 0, Math.PI * 2);
    ctx.stroke();

    // Top Label
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px monospace';
    ctx.fillText(`Integrand f(t) | Height f(x) = ${currentHeight_fx.toFixed(2)}`, p1.x + 4, p1.y + 12);

    // Panel 2: Accumulator Function A(x) = ∫_a^x f(t) dt
    if (hasDual) {
      const p2 = {
        x: 45,
        y: panelH + 15,
        w: width - 60,
        h: panelH - 35,
      };

      // Find max A(x) across interval to auto-scale
      let maxA = 1;
      let minA = 0;
      for (let s = 0; s <= 40; s++) {
        const t = config.tMin + (s / 40) * (config.tMax - config.tMin);
        const valA = config.F(t) - config.F(lowerBoundA);
        if (valA > maxA) maxA = valA;
        if (valA < minA) minA = valA;
      }
      maxA *= 1.15;
      minA = Math.min(-0.5, minA * 1.15);

      const toScreen2 = (t: number, y: number) => {
        const sx = p2.x + ((t - config.tMin) / (config.tMax - config.tMin)) * p2.w;
        const sy = p2.y + p2.h - ((y - minA) / (maxA - minA)) * p2.h;
        return { x: sx, y: sy };
      };

      // Axis for Panel 2
      const zeroY2 = toScreen2(0, 0).y;
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(p2.x, zeroY2);
      ctx.lineTo(p2.x + p2.w, zeroY2);
      ctx.stroke();

      // Plot A(t) curve
      ctx.beginPath();
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 2.5;
      for (let px = 0; px <= p2.w; px += 2) {
        const t = config.tMin + (px / p2.w) * (config.tMax - config.tMin);
        const valA = config.F(t) - config.F(lowerBoundA);
        const pt = toScreen2(t, valA);
        if (px === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      }
      ctx.stroke();

      // Tangent line on A(x) at point (x, A(x)) with slope m = f(x)
      const currPt2 = toScreen2(upperBoundX, exactIntegral);

      if (showTangentSlopeAtX) {
        const slope = currentHeight_fx;
        // Tangent segment: deltaX = 0.4
        const dx = 0.5;
        const ptLeft = toScreen2(upperBoundX - dx, exactIntegral - slope * dx);
        const ptRight = toScreen2(upperBoundX + dx, exactIntegral + slope * dx);

        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(ptLeft.x, ptLeft.y);
        ctx.lineTo(ptRight.x, ptRight.y);
        ctx.stroke();

        // Tangent slope badge
        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 11px monospace';
        ctx.fillText(`Slope A'(x) = ${slope.toFixed(2)} (locks onto f(x)!)`, currPt2.x + 8, currPt2.y - 8);
      }

      // Point (x, A(x))
      ctx.fillStyle = '#a855f7';
      ctx.beginPath();
      ctx.arc(currPt2.x, currPt2.y, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Panel 2 Label
      ctx.fillStyle = '#c084fc';
      ctx.font = '10px monospace';
      ctx.fillText(`Accumulated Area A(x) = ∫ f dt = ${exactIntegral.toFixed(3)}`, p2.x + 4, p2.y + 12);
    }
  }, [
    functionType,
    lowerBoundA,
    upperBoundX,
    riemannMethod,
    rectanglesN,
    showAccumulationCurve,
    showTangentSlopeAtX,
    config,
    currentHeight_fx,
    exactIntegral,
    isDraggingSweep,
    isHoveringSweep,
  ]);

  // Pointer event handlers to drag upper limit x on the graph
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const p1 = {
      x: 45,
      w: rect.width - 60,
    };
    const sweepX = p1.x + ((upperBoundX - config.tMin) / (config.tMax - config.tMin)) * p1.w;

    if (Math.abs(sx - sweepX) < 28 || (sx >= p1.x && sx <= p1.x + p1.w)) {
      e.currentTarget.setPointerCapture(e.pointerId);
      setIsDraggingSweep(true);
      const mathT = config.tMin + ((sx - p1.x) / p1.w) * (config.tMax - config.tMin);
      const boundedT = Math.max(lowerBoundA, Math.min(config.tMax, Number(mathT.toFixed(2))));
      updateFTCIntegralParams({ upperBoundX: boundedT });
      lightTap();
      playClick(1.2);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const p1 = {
      x: 45,
      w: rect.width - 60,
    };

    if (isDraggingSweep) {
      const mathT = config.tMin + ((sx - p1.x) / p1.w) * (config.tMax - config.tMin);
      const boundedT = Math.max(lowerBoundA, Math.min(config.tMax, Number(mathT.toFixed(2))));
      updateFTCIntegralParams({ upperBoundX: boundedT });
      return;
    }

    const sweepX = p1.x + ((upperBoundX - config.tMin) / (config.tMax - config.tMin)) * p1.w;
    if (Math.abs(sx - sweepX) < 24) {
      setIsHoveringSweep(true);
    } else {
      setIsHoveringSweep(false);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isDraggingSweep) {
      setIsDraggingSweep(false);
      try {
        canvasRef.current?.releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  const challengeLevels: ChallengeLevel[] = [
    {
      levelNumber: 1,
      title: 'The Zero Net Area Trap (∫₀²π sin t dt = 0)',
      badge: 'Net Area Detective',
      description: 'Switch to Sinusoid function. Sweep upper limit x to 2π (≈ 6.28). Observe positive and negative loops cancel to 0!',
      requirementFormula: '\\int_0^{2\\pi} \\sin(t)\\,dt = 0',
      targetCriteria: 'Sweep upper limit x to 2π (≈ 6.28) on sinusoid',
      xpReward: 40,
      tier1Hint: 'Select the Sinusoid function: f(t) = 2 sin(t).',
      tier2Hint: 'Drag the Upper Limit x slider to approximately 6.28.',
      tier3Hint: 'Watch the accumulated area gauge drop from +4.0 back down to 0.000!',
      autoPreset: () => {
        updateFTCIntegralParams({ functionType: 'sinusoid', upperBoundX: 6.28 });
      },
    },
    {
      levelNumber: 2,
      title: 'Riemann Squeeze (N = 48 Rectangles)',
      badge: 'Riemann Master',
      description: 'Increase the number of Riemann rectangles N to at least 48 to squeeze approximation error below 0.03!',
      requirementFormula: '\\lim_{N \\to \\infty} \\sum_{i=1}^N f(x_i^*)\\Delta t = \\int f(t)\\,dt',
      targetCriteria: 'Set rectangles N ≥ 48 with Midpoint method',
      xpReward: 40,
      tier1Hint: 'Set Riemann method to "Midpoint".',
      tier2Hint: 'Drag the Rectangles N slider to 48 or higher.',
      tier3Hint: 'Watch the staircase rectangles hug the smooth curve with error < 0.03.',
      autoPreset: () => {
        updateFTCIntegralParams({ rectanglesN: 48, riemannMethod: 'midpoint' });
      },
    },
    {
      levelNumber: 3,
      title: 'Tangent Slope Lock (m = 4.00 at x = 2)',
      badge: 'FTC Proven',
      description: 'Select Quadratic f(t) = t². Set x = 2.0. Prove that Tangent Slope A′(2) locks exactly onto f(2) = 4.00!',
      requirementFormula: 'A\'(2) = \\left.\\frac{d}{dx}\\left[\\int_0^x t^2 dt\\right]\\right|_{x=2} = 2^2 = 4',
      targetCriteria: 'Set x = 2.0 on quadratic function t²',
      xpReward: 50,
      tier1Hint: 'Switch to Quadratic f(t) = t².',
      tier2Hint: 'Drag Upper Limit x to 2.0.',
      tier3Hint: 'Observe the green tangent slope label showing exactly 4.00!',
      autoPreset: () => {
        updateFTCIntegralParams({ functionType: 'quadratic', upperBoundX: 2.0 });
      },
    },
  ];

  return (
    <div className="w-full h-full flex flex-col relative select-none">
      {/* Center Interactive Canvas */}
      <div className="w-full flex-1 flex flex-col items-center justify-center p-2 sm:p-4 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden relative">
        {/* Real-time Math HUD Banner */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none z-10 px-2">
          <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-700/80 px-2.5 py-1 rounded-xl shadow-lg backdrop-blur-md">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <span className="text-[11px] font-mono font-bold text-cyan-300">
              d/dx[∫ f(t)dt] = f(x)
            </span>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 px-2.5 py-1 rounded-xl shadow-lg backdrop-blur-md">
            <span className="text-[11px] font-mono text-slate-300">
              Area: <strong className="text-purple-400 font-bold">{exactIntegral.toFixed(3)}</strong>
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-[11px] font-mono text-slate-300">
              Slope: <strong className="text-emerald-400 font-bold">{currentHeight_fx.toFixed(2)}</strong>
            </span>
          </div>
        </div>

        {/* Dynamic Dual Graph Canvas */}
        <div className="w-full max-w-xl flex-1 max-h-[62vh] relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
          <canvas
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className={`w-full h-full block touch-none ${
              isDraggingSweep
                ? 'cursor-ew-resize cursor-grabbing'
                : isHoveringSweep
                ? 'cursor-ew-resize cursor-grab'
                : 'cursor-crosshair'
            }`}
          />

          {/* Direct on-canvas grip guide banner */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 pointer-events-none flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700/80 shadow-xl backdrop-blur-md text-[11px]">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
            <span className="text-slate-300 font-sans">
              Catch and drag the golden sweep line <strong className="text-amber-400">x</strong> across the graph!
            </span>
          </div>
        </div>

        {/* Live Calculation Ratio Ribbon */}
        <div className="w-full max-w-xl mt-2 grid grid-cols-3 gap-1.5 text-center">
          <div className="p-2 rounded-xl bg-slate-900/90 border border-cyan-500/30">
            <span className="text-[9px] uppercase tracking-wider text-slate-400 block">Height f(x)</span>
            <span className="text-xs sm:text-sm font-bold font-mono text-cyan-400">
              {currentHeight_fx.toFixed(3)}
            </span>
          </div>

          <div className="p-2 rounded-xl bg-slate-900/90 border border-purple-500/30">
            <span className="text-[9px] uppercase tracking-wider text-slate-400 block">Integral ∫ f dt</span>
            <span className="text-xs sm:text-sm font-bold font-mono text-purple-400">
              {exactIntegral.toFixed(3)}
            </span>
          </div>

          <div className="p-2 rounded-xl bg-slate-900/90 border border-emerald-500/30">
            <span className="text-[9px] uppercase tracking-wider text-slate-400 block">Tangent Slope A′(x)</span>
            <span className="text-xs sm:text-sm font-bold font-mono text-emerald-400">
              {currentHeight_fx.toFixed(3)}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Sheet Controls & Right Sidebar Theory */}
      <BottomSheet
        title="Fundamental Theorem of Calculus"
        quickEquation="\frac{d}{dx}\left[\int_a^x f(t)\,dt\right] = f(x)"
        onReset={() => resetParams('ftc-integral-accumulator')}
        theoryContent={
          <CoachTheoryModule
            simulatorId="ftc-integral-accumulator"
            extraLiveDetails={
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between text-cyan-400">
                  <span>First FTC Verification:</span>
                  <span className="font-bold">A′(x) == f(x)</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-slate-950/70 p-1.5 rounded border border-slate-800">
                    <span className="text-slate-400 block">Riemann Sum:</span>
                    <span className="text-cyan-400 font-bold">{riemannResult.toFixed(3)}</span>
                  </div>
                  <div className="bg-slate-950/70 p-1.5 rounded border border-slate-800">
                    <span className="text-slate-400 block">Exact Error:</span>
                    <span className="text-amber-400 font-bold">{riemannError.toFixed(4)}</span>
                  </div>
                </div>
              </div>
            }
          />
        }
        challengeContent={
          <ChallengeManager
            simulatorId="ftc-integral-accumulator"
            simulatorTitle="Calculus Area Accumulator"
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
        <div className="space-y-3 text-xs">
          {/* Point 1 & 5: Live FTC Substitution Card */}
          <LiveSubstitutionCard
            title="Fundamental Theorem"
            badge="FTC"
            symbolicLaw={`\\frac{d}{dx}\\int_a^x f(t)\\,dt = f(x), \\quad \\int_a^b f(t)\\,dt = F(b) - F(a)`}
            substitutedLatex={`\\int_{${lowerBoundA.toFixed(1)}}^{${upperBoundX.toFixed(2)}} ${config.formulaLatex}\\,dt`}
            evaluatedLatex={`= ${exactIntegral.toFixed(4)}, \\quad f(${upperBoundX.toFixed(2)}) = ${currentHeight_fx.toFixed(4)}`}
            activeTerm={isDraggingSweep ? `x = ${upperBoundX.toFixed(2)}` : undefined}
          />
          {/* Function Selector */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Integrand Function f(t)
            </label>
            <div className="grid grid-cols-4 gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => {
                  updateFTCIntegralParams({ functionType: 'quadratic', lowerBoundA: 0, upperBoundX: 2.0 });
                  playClick();
                  lightTap();
                }}
                className={`py-1.5 text-[11px] font-semibold rounded-lg transition-all cursor-pointer ${
                  functionType === 'quadratic'
                    ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                t²
              </button>
              <button
                type="button"
                onClick={() => {
                  updateFTCIntegralParams({ functionType: 'sinusoid', lowerBoundA: 0, upperBoundX: 3.14 });
                  playClick();
                  lightTap();
                }}
                className={`py-1.5 text-[11px] font-semibold rounded-lg transition-all cursor-pointer ${
                  functionType === 'sinusoid'
                    ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                2 sin(t)
              </button>
              <button
                type="button"
                onClick={() => {
                  updateFTCIntegralParams({ functionType: 'cubic', lowerBoundA: 0, upperBoundX: 2.5 });
                  playClick();
                  lightTap();
                }}
                className={`py-1.5 text-[11px] font-semibold rounded-lg transition-all cursor-pointer ${
                  functionType === 'cubic'
                    ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                3t - t²
              </button>
              <button
                type="button"
                onClick={() => {
                  updateFTCIntegralParams({ functionType: 'exponential', lowerBoundA: 0, upperBoundX: 2.0 });
                  playClick();
                  lightTap();
                }}
                className={`py-1.5 text-[11px] font-semibold rounded-lg transition-all cursor-pointer ${
                  functionType === 'exponential'
                    ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                e^(0.5t)
              </button>
            </div>
          </div>

          {/* Upper Limit x Sweep Slider */}
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-400">Sweep Upper Bound (x)</span>
              <span className="text-xs font-mono font-bold text-amber-300">x = {upperBoundX.toFixed(2)}</span>
            </div>
            <TouchSlider
              label="Upper Limit (x)"
              value={upperBoundX}
              min={lowerBoundA + 0.1}
              max={config.tMax}
              step={0.05}
              unit=""
              onChange={(val) => updateFTCIntegralParams({ upperBoundX: val })}
            />
          </div>

          {/* Riemann Sum vs Exact Controls */}
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Approximation Method
              </span>
              <span className="text-xs font-mono text-cyan-300">N = {rectanglesN}</span>
            </div>

            <div className="grid grid-cols-4 gap-1">
              {(['midpoint', 'left', 'right', 'exact'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => {
                    updateFTCIntegralParams({ riemannMethod: m });
                    playClick();
                    lightTap();
                  }}
                  className={`py-1 text-[10px] font-semibold rounded-lg capitalize transition-all cursor-pointer ${
                    riemannMethod === m
                      ? 'bg-purple-500 text-white shadow-md font-bold'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            {riemannMethod !== 'exact' && (
              <TouchSlider
                label="Number of Rectangles (N)"
                value={rectanglesN}
                min={4}
                max={64}
                step={4}
                unit=" bars"
                onChange={(val) => updateFTCIntegralParams({ rectanglesN: val })}
              />
            )}
          </div>

          {/* Visual Toggles */}
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 text-xs">Show Accumulation Curve A(x)</span>
              <button
                type="button"
                onClick={() => updateFTCIntegralParams({ showAccumulationCurve: !showAccumulationCurve })}
                className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                  showAccumulationCurve ? 'bg-purple-500' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${
                    showAccumulationCurve ? 'left-4.5' : 'left-0.5'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-300 text-xs">Show Tangent Line Slope A′(x)</span>
              <button
                type="button"
                onClick={() => updateFTCIntegralParams({ showTangentSlopeAtX: !showTangentSlopeAtX })}
                className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                  showTangentSlopeAtX ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${
                    showTangentSlopeAtX ? 'left-4.5' : 'left-0.5'
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
