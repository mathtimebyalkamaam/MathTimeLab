import React, { useEffect, useRef, useState } from 'react';
import { 
  TrendingUp, 
  Sparkles, 
  RotateCcw, 
  CheckCircle, 
  BarChart, 
  Activity,
  Layers
} from 'lucide-react';
import { useSimulatorStore } from '../../store/useSimulatorStore';
import { BottomSheet } from '../layout/BottomSheet';
import { TouchSlider } from '../common/TouchSlider';
import { MathFormula } from '../common/MathFormula';
import { CoachTheoryModule } from '../common/CoachTheoryModule';
import { useHaptics } from '../../hooks/useHaptics';
import { useSound } from '../common/SoundManager';
import { usePerformanceMode } from '../../hooks/usePerformanceMode';

export const CalculusSandboxSimulator: React.FC = () => {
  const {
    calculusParams,
    updateCalculusParams,
    resetParams,
    completeChallenge,
    challengeCompleted,
    isZenMode,
  } = useSimulatorStore();

  const { lightTap, successBuzz } = useHaptics();
  const { playClick, playChime } = useSound();
  const { dpr: perfDpr } = usePerformanceMode();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const lastScrubTick = useRef(0);

  // Math functions and their analytical derivatives & antiderivatives
  const evalFunc = (x: number) => {
    switch (calculusParams.functionType) {
      case 'quadratic':
        return 0.5 * x * x - 1;
      case 'cubic':
        return 0.25 * Math.pow(x, 3) - x;
      case 'sinusoid':
        return Math.sin(x * 1.5);
      case 'exponential':
        return 0.4 * Math.exp(0.8 * x) - 1.2;
    }
  };

  const evalDerivative = (x: number) => {
    switch (calculusParams.functionType) {
      case 'quadratic':
        return x; // d/dx (0.5 x^2 - 1) = x
      case 'cubic':
        return 0.75 * x * x - 1;
      case 'sinusoid':
        return 1.5 * Math.cos(x * 1.5);
      case 'exponential':
        return 0.32 * Math.exp(0.8 * x);
    }
  };

  const evalAntiderivative = (x: number) => {
    switch (calculusParams.functionType) {
      case 'quadratic':
        return (0.5 / 3) * Math.pow(x, 3) - x;
      case 'cubic':
        return (0.25 / 4) * Math.pow(x, 4) - 0.5 * x * x;
      case 'sinusoid':
        return -(1 / 1.5) * Math.cos(x * 1.5);
      case 'exponential':
        return (0.4 / 0.8) * Math.exp(0.8 * x) - 1.2 * x;
    }
  };

  const currentX = calculusParams.xPoint;
  const currentY = evalFunc(currentX);
  const currentSlope = evalDerivative(currentX);

  // Exact definite integral from a to b
  const exactIntegral = evalAntiderivative(calculusParams.intervalB) - evalAntiderivative(calculusParams.intervalA);

  // Compute Riemann approximation
  const n = calculusParams.riemannPartitions;
  const dx = (calculusParams.intervalB - calculusParams.intervalA) / n;
  let riemannSum = 0;

  for (let i = 0; i < n; i++) {
    const xLeft = calculusParams.intervalA + i * dx;
    const xRight = xLeft + dx;
    let sampleY = 0;

    if (calculusParams.riemannType === 'left') {
      sampleY = evalFunc(xLeft);
      riemannSum += sampleY * dx;
    } else if (calculusParams.riemannType === 'right') {
      sampleY = evalFunc(xRight);
      riemannSum += sampleY * dx;
    } else if (calculusParams.riemannType === 'midpoint') {
      sampleY = evalFunc((xLeft + xRight) / 2);
      riemannSum += sampleY * dx;
    } else if (calculusParams.riemannType === 'trapezoid') {
      sampleY = (evalFunc(xLeft) + evalFunc(xRight)) / 2;
      riemannSum += sampleY * dx;
    }
  }

  // Check mission challenges
  useEffect(() => {
    if (Math.abs(currentSlope) < 0.08 && !challengeCompleted['calc_zero_slope']) {
      completeChallenge('calc_zero_slope', 40);
    }
    if (calculusParams.riemannPartitions >= 30 && !challengeCompleted['calc_riemann_converge']) {
      completeChallenge('calc_riemann_converge', 50);
    }
  }, [currentSlope, calculusParams.riemannPartitions, challengeCompleted, completeChallenge]);

  // Touch and pointer interaction on canvas
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsScrubbing(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    scrubX(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isScrubbing) return;
    scrubX(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsScrubbing(false);
  };

  const scrubX = (clientX: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const cx = rect.width / 2;
    const scaleX = rect.width * 0.12; // units to pixels
    const relX = (clientX - rect.left - cx) / scaleX;
    const clampedX = Math.max(-2.8, Math.min(2.8, Number(relX.toFixed(2))));

    const now = performance.now();
    if (now - lastScrubTick.current > 60) {
      lastScrubTick.current = now;
      lightTap();
      playClick(0.8 + ((clampedX + 2.8) / 5.6) * 0.8);
    }

    updateCalculusParams({ xPoint: clampedX });
  };

  // Canvas render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number = 0;

    const render = () => {
      const dpr = perfDpr || window.devicePixelRatio || 1;
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

      const cx = width / 2;
      const cy = height * 0.44;
      const scaleX = Math.min(width * 0.13, 56);
      const scaleY = Math.min(height * 0.14, 56);

      // Coordinate converter
      const toScreen = (x: number, y: number) => ({
        sx: cx + x * scaleX,
        sy: cy - y * scaleY,
      });

      // 1. Subtle Grid
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      for (let gx = -6; gx <= 6; gx += 1) {
        const { sx } = toScreen(gx, 0);
        ctx.beginPath();
        ctx.moveTo(sx, 0);
        ctx.lineTo(sx, height);
        ctx.stroke();
      }
      for (let gy = -4; gy <= 4; gy += 1) {
        const { sy } = toScreen(0, gy);
        ctx.beginPath();
        ctx.moveTo(0, sy);
        ctx.lineTo(width, sy);
        ctx.stroke();
      }

      // 2. Axes
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.5;
      // X axis
      ctx.beginPath();
      ctx.moveTo(0, cy);
      ctx.lineTo(width, cy);
      ctx.stroke();
      // Y axis
      ctx.beginPath();
      ctx.moveTo(cx, 0);
      ctx.lineTo(cx, height);
      ctx.stroke();

      // Axis tick numbers
      ctx.fillStyle = '#64748b';
      ctx.font = '10px monospace';
      for (let t = -4; t <= 4; t += 2) {
        if (t === 0) continue;
        const p = toScreen(t, 0);
        ctx.fillText(`${t}`, p.sx - 4, cy + 14);
      }

      // 3. Draw Riemann Partitions (if integral mode)
      if (calculusParams.viewMode === 'integral') {
        const a = calculusParams.intervalA;
        const b = calculusParams.intervalB;
        const numPartitions = calculusParams.riemannPartitions;
        const step = (b - a) / numPartitions;

        for (let i = 0; i < numPartitions; i++) {
          const x0 = a + i * step;
          const x1 = x0 + step;
          let evalY = 0;

          if (calculusParams.riemannType === 'left') evalY = evalFunc(x0);
          else if (calculusParams.riemannType === 'right') evalY = evalFunc(x1);
          else if (calculusParams.riemannType === 'midpoint') evalY = evalFunc((x0 + x1) / 2);
          else if (calculusParams.riemannType === 'trapezoid') {
            evalY = (evalFunc(x0) + evalFunc(x1)) / 2;
          }

          const p0 = toScreen(x0, 0);
          const p1 = toScreen(x1, 0);
          const py = toScreen(x0, evalY);

          // Draw Riemann Rectangle
          const rectW = p1.sx - p0.sx;
          const rectH = cy - py.sy;

          ctx.fillStyle = 'rgba(16, 185, 129, 0.22)';
          ctx.strokeStyle = '#10b981';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.rect(p0.sx, py.sy, rectW, rectH);
          ctx.fill();
          ctx.stroke();
        }
      }

      // 4. Draw Function Curve
      ctx.beginPath();
      const resolution = 200;
      for (let i = 0; i <= resolution; i++) {
        const xVal = -4 + (i / resolution) * 8;
        const yVal = evalFunc(xVal);
        const { sx, sy } = toScreen(xVal, yVal);
        if (i === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.stroke();

      // 5. Draw Tangent Line & Slope Triangle (if derivative mode)
      if (calculusParams.viewMode === 'derivative') {
        const pt = toScreen(currentX, currentY);

        // Extended tangent line
        const tangentSpan = 2.4;
        const xT1 = currentX - tangentSpan;
        const yT1 = currentY - currentSlope * tangentSpan;
        const xT2 = currentX + tangentSpan;
        const yT2 = currentY + currentSlope * tangentSpan;

        const pT1 = toScreen(xT1, yT1);
        const pT2 = toScreen(xT2, yT2);

        ctx.beginPath();
        ctx.moveTo(pT1.sx, pT1.sy);
        ctx.lineTo(pT2.sx, pT2.sy);
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Slope right-triangle (run = 1 unit, rise = currentSlope)
        const pRun = toScreen(currentX + 0.8, currentY);
        const pRise = toScreen(currentX + 0.8, currentY + currentSlope * 0.8);

        ctx.beginPath();
        ctx.moveTo(pt.sx, pt.sy);
        ctx.lineTo(pRun.sx, pRun.sy);
        ctx.lineTo(pRise.sx, pRise.sy);
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.8)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 3]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Slope label
        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 10px monospace';
        ctx.fillText(`Δy/Δx = ${currentSlope.toFixed(2)}`, pRun.sx + 4, pRun.sy - 4);

        // Tangent Contact Point
        ctx.beginPath();
        ctx.arc(pt.sx, pt.sy, 7, 0, Math.PI * 2);
        ctx.fillStyle = '#f43f5e';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#f43f5e';
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      ctx.restore();
    };

    render();
    window.addEventListener('resize', render);
    return () => {
      window.removeEventListener('resize', render);
      cancelAnimationFrame(animId);
    };
  }, [calculusParams, currentX, currentY, currentSlope, evalFunc]);

  return (
    <div className="relative w-full flex-1 min-h-0 h-full overflow-hidden flex flex-col bg-slate-950">
      {/* 2D Canvas Stage */}
      <div className="relative w-full h-full flex-1">
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="w-full h-full cursor-ew-resize touch-none"
        />

        {/* Real-Time Calculus HUD */}
        {!isZenMode && (
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3 max-w-[190px] sm:max-w-[210px] bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-2 sm:p-2.5 rounded-xl text-xs space-y-1 shadow-xl pointer-events-none z-10">
            {calculusParams.viewMode === 'derivative' ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">Point (x₀)</span>
                  <span className="font-mono text-cyan-300 font-bold">{currentX.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">f(x₀)</span>
                  <span className="font-mono text-slate-200">{currentY.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-rose-400 font-bold">Slope f'(x₀)</span>
                  <span className="font-mono text-rose-300 font-bold tabular-nums">
                    {currentSlope.toFixed(2)}
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">Partitions (n)</span>
                  <span className="font-mono text-emerald-300 font-bold">{calculusParams.riemannPartitions}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">Riemann Sum</span>
                  <span className="font-mono text-emerald-400 font-bold tabular-nums">
                    {riemannSum.toFixed(3)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Exact Integral</span>
                  <span className="font-mono tabular-nums text-slate-300">
                    {exactIntegral.toFixed(3)}
                  </span>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Mobile Collapsible Bottom Sheet */}
      <BottomSheet
        title="Calculus Sandbox Parameters"
        badgeLabel={
          calculusParams.viewMode === 'derivative'
            ? `f'(${currentX.toFixed(1)}) = ${currentSlope.toFixed(2)}`
            : `Area ≈ ${riemannSum.toFixed(2)}`
        }
        quickEquation={
          calculusParams.viewMode === 'derivative'
            ? `df/dx = lim[Δx→0] Δy/Δx`
            : `∫[a,b] f(x)dx = lim[n→∞] Σ f(xᵢ)Δx`
        }
        onReset={() => resetParams('calculus-sandbox')}
        theoryContent={
          <CoachTheoryModule
            simulatorId="calculus-sandbox"
            extraLiveDetails={
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-xl bg-rose-950/30 border border-rose-800/40">
                    <span className="text-[10px] text-rose-300 block font-semibold">Tangent Slope (dy/dx):</span>
                    <span className="font-mono text-white font-bold">{currentSlope.toFixed(3)} at x = {calculusParams.xPoint.toFixed(2)}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-emerald-950/30 border border-emerald-800/40">
                    <span className="text-[10px] text-emerald-300 block font-semibold">Riemann Area (n={calculusParams.riemannPartitions}):</span>
                    <span className="font-mono text-white font-bold">{riemannSum.toFixed(3)} sq u</span>
                  </div>
                </div>
              </div>
            }
          />
        }
        challengeContent={
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1.5">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Class 12 Calculus Missions
              </span>
              <p className="text-slate-300">
                Solve the critical point and convergence challenges using live parameter adjustments.
              </p>
            </div>

            <div className="space-y-2">
              <div className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
                challengeCompleted['calc_zero_slope']
                  ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300'
              }`}>
                <div className="space-y-0.5">
                  <div className="font-semibold text-white">Mission 1: Zero Tangent Slope (Extremum)</div>
                  <div className="text-[11px] text-slate-400">Find the stationary point where f'(x) = 0.00</div>
                </div>
                {challengeCompleted['calc_zero_slope'] ? (
                  <span className="flex items-center gap-1 font-bold text-emerald-400 text-xs">
                    <CheckCircle className="w-4 h-4" />
                    +40 XP
                  </span>
                ) : (
                  <span className="text-xs font-mono text-amber-400 bg-amber-950/60 px-2 py-1 rounded">
                    40 XP
                  </span>
                )}
              </div>

              <div className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
                challengeCompleted['calc_riemann_converge']
                  ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300'
              }`}>
                <div className="space-y-0.5">
                  <div className="font-semibold text-white">Mission 2: Partition Precision</div>
                  <div className="text-[11px] text-slate-400">Increase Riemann Partitions n ≥ 30 in Integral Mode</div>
                </div>
                {challengeCompleted['calc_riemann_converge'] ? (
                  <span className="flex items-center gap-1 font-bold text-emerald-400 text-xs">
                    <CheckCircle className="w-4 h-4" />
                    +50 XP
                  </span>
                ) : (
                  <span className="text-xs font-mono text-amber-400 bg-amber-950/60 px-2 py-1 rounded">
                    50 XP
                  </span>
                )}
              </div>
            </div>
          </div>
        }
      >
        {/* Controls Tab */}
        <div className="space-y-4">
          {/* Mode Switcher */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => updateCalculusParams({ viewMode: 'derivative' })}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-colors ${
                calculusParams.viewMode === 'derivative'
                  ? 'bg-rose-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Derivative Tangent (df/dx)
            </button>
            <button
              type="button"
              onClick={() => updateCalculusParams({ viewMode: 'integral' })}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-colors ${
                calculusParams.viewMode === 'integral'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Riemann Integral (∫ f dx)
            </button>
          </div>

          {/* Function Selector */}
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Select Math Function
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'quadratic', label: '0.5x² - 1' },
                { id: 'cubic', label: '0.25x³ - x' },
                { id: 'sinusoid', label: 'sin(1.5x)' },
                { id: 'exponential', label: '0.4e^(0.8x) - 1' },
              ].map((fn) => (
                <button
                  key={fn.id}
                  type="button"
                  onClick={() => updateCalculusParams({ functionType: fn.id as any })}
                  className={`py-2 px-2.5 rounded-xl text-xs font-mono font-medium border transition-colors ${
                    calculusParams.functionType === fn.id
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold'
                      : 'bg-slate-800/80 text-slate-300 border-slate-700/60 hover:bg-slate-700'
                  }`}
                >
                  {fn.label}
                </button>
              ))}
            </div>
          </div>

          {calculusParams.viewMode === 'derivative' ? (
            <TouchSlider
              label="Tangent Contact Point (x₀)"
              min={-2.6}
              max={2.6}
              step={0.1}
              value={calculusParams.xPoint}
              onChange={(val) => updateCalculusParams({ xPoint: val })}
              formatValue={(v) => `x = ${v.toFixed(2)}`}
            />
          ) : (
            <div className="space-y-4">
              <TouchSlider
                label="Riemann Partitions (n Rectangles)"
                min={2}
                max={48}
                step={2}
                value={calculusParams.riemannPartitions}
                onChange={(val) => updateCalculusParams({ riemannPartitions: val })}
              />

              {/* Slicing Rule Picker */}
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  Riemann Slicing Method
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['left', 'right', 'midpoint', 'trapezoid'] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => updateCalculusParams({ riemannType: method })}
                      className={`py-2 px-2 rounded-xl text-xs font-semibold capitalize border transition-colors ${
                        calculusParams.riemannType === method
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold'
                          : 'bg-slate-800/80 text-slate-300 border-slate-700/60 hover:bg-slate-700'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </BottomSheet>
    </div>
  );
};
