/**
 * DifferentialEquationsSimulator.tsx: Interactive Differential Equations & Slope Fields (Class 12 Calculus).
 * Features:
 * - Real-time 2D Slope Field (direction field) with dynamic tangent needles m = f(x, y)
 * - Draggable initial condition point (x₀, y₀) generating continuous solution trajectories
 * - First-Order Linear ODE solver with Integrating Factor I.F. = e^(∫ P dx)
 * - Newton's Law of Cooling simulation: dT/dt = -k(T - T_env) with ambient asymptote
 * - 3 Progressive Board Exam challenges
 */
import React, { useEffect, useRef, useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  Activity, 
  RotateCcw, 
  CheckCircle2, 
  TrendingUp, 
  Target, 
  Sparkles, 
  Layers, 
  Sliders,
  Thermometer
} from 'lucide-react';
import { useSimulatorStore } from '../../store/useSimulatorStore';
import { BottomSheet } from '../layout/BottomSheet';
import { TouchSlider } from '../common/TouchSlider';
import { CoachTheoryModule } from '../common/CoachTheoryModule';
import { ChallengeManager, ChallengeLevel } from '../common/ChallengeManager';
import { useHaptics } from '../../hooks/useHaptics';
import { useSound } from '../common/SoundManager';
import { useAnalytics } from '../../hooks/useAnalytics';

export const DifferentialEquationsSimulator: React.FC = () => {
  const {
    diffEqParams,
    updateDiffEqParams,
    resetParams,
    completeChallenge,
    challengeCompleted,
    isZenMode,
  } = useSimulatorStore();

  const {
    modelType,
    pCoeff,
    qCoeff,
    coolingK,
    ambientTemp,
    initialX,
    initialY,
    gridDensity,
    showSlopeField,
    showIntegratingFactorCurve,
    showAnalyticalSolution,
    stepSizeH,
  } = diffEqParams;

  const { lightTap, successBuzz } = useHaptics();
  const { playClick, playChime } = useSound();
  const { trackEvent } = useAnalytics();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDraggingPoint = useRef(false);

  // Slope calculation dy/dx = f(x, y)
  const slopeFn = useMemo(() => {
    return (x: number, y: number) => {
      if (modelType === 'newton-cooling') {
        // dT/dt = -k (T - T_env)
        return -coolingK * (y - ambientTemp);
      }
      if (modelType === 'logistic-growth') {
        // dy/dx = 0.8 * y * (1 - y / 8)
        return 0.8 * y * (1 - y / 8);
      }
      // Linear first order: dy/dx = Q(x) - P(x)y
      return qCoeff - pCoeff * y;
    };
  }, [modelType, coolingK, ambientTemp, pCoeff, qCoeff]);

  // Integrating factor for dy/dx + P y = Q: I.F. = e^(P * x)
  const integratingFactor = Math.exp(pCoeff * initialX);

  // Challenges evaluation
  useEffect(() => {
    // Challenge 1: Newton's Cooling Equilibrium Asymptote
    if (
      modelType === 'newton-cooling' &&
      Math.abs(ambientTemp - 20) < 1 &&
      !challengeCompleted['diffeq_cooling_asymptote']
    ) {
      completeChallenge('diffeq_cooling_asymptote', 40);
      successBuzz();
      playChime();
      confetti({ particleCount: 35, spread: 60 });
      trackEvent('challenge_completed', { challengeId: 'diffeq_cooling_asymptote' });
    }

    // Challenge 2: Steady-State Linear ODE (dy/dx = 0 when y = Q/P)
    const steadyY = pCoeff !== 0 ? qCoeff / pCoeff : 0;
    if (
      modelType === 'linear-first-order' &&
      Math.abs(initialY - steadyY) < 0.2 &&
      !challengeCompleted['diffeq_steady_state']
    ) {
      completeChallenge('diffeq_steady_state', 40);
      successBuzz();
      playChime();
      confetti({ particleCount: 40, spread: 65 });
      trackEvent('challenge_completed', { challengeId: 'diffeq_steady_state' });
    }

    // Challenge 3: Logistic Carrying Capacity (y approaches 8)
    if (modelType === 'logistic-growth' && initialY > 1 && !challengeCompleted['diffeq_logistic_capacity']) {
      completeChallenge('diffeq_logistic_capacity', 45);
      successBuzz();
      playChime();
      trackEvent('challenge_completed', { challengeId: 'diffeq_logistic_capacity' });
    }
  }, [
    modelType,
    ambientTemp,
    pCoeff,
    qCoeff,
    initialY,
    challengeCompleted,
    completeChallenge,
    successBuzz,
    playChime,
    trackEvent,
  ]);

  const challengeLevels: ChallengeLevel[] = [
    {
      levelNumber: 1,
      title: 'Newton’s Cooling Equilibrium (20°C)',
      badge: 'Thermal Analyst',
      description: 'Switch to Newton’s Law of Cooling. Set ambient room temperature to 20°C. Observe the solution curve flattening asymptotically to 20°C!',
      requirementFormula: '\\lim_{t \\to \\infty} T(t) = T_{\\text{env}} = 20^\\circ\\text{C}',
      targetCriteria: 'Set ambient temperature to 20°C in cooling mode',
      xpReward: 40,
      tier1Hint: 'Tap "Newton Cooling" in the model selector.',
      tier2Hint: 'Set ambient temperature slider to 20°C.',
      tier3Hint: 'Watch the temperature curve level out at horizontal asymptote y = 20.',
      autoPreset: () => {
        updateDiffEqParams({
          modelType: 'newton-cooling',
          ambientTemp: 20,
          initialY: 80,
          initialX: 0,
        });
      },
    },
    {
      levelNumber: 2,
      title: 'Steady-State Constant Solution (y = Q/P)',
      badge: 'ODE Balancer',
      description: 'In Linear ODE mode (dy/dx + Py = Q), set initial condition y₀ to exactly Q/P = 2/1 = 2.0 so dy/dx = 0 everywhere!',
      requirementFormula: '\\frac{dy}{dx} = Q - Py = 0 \\implies y(x) = \\frac{Q}{P}',
      targetCriteria: 'Set initial y₀ = 2.0 with P = 1.0, Q = 2.0',
      xpReward: 40,
      tier1Hint: 'Select "Linear 1st-Order" mode.',
      tier2Hint: 'Drag Initial Condition y₀ to 2.0.',
      tier3Hint: 'Observe the trajectory becoming a perfectly flat horizontal line with slope m = 0.',
      autoPreset: () => {
        updateDiffEqParams({
          modelType: 'linear-first-order',
          pCoeff: 1.0,
          qCoeff: 2.0,
          initialY: 2.0,
          initialX: 0,
        });
      },
    },
    {
      levelNumber: 3,
      title: 'Logistic S-Curve Carrying Capacity',
      badge: 'Population Dynamicist',
      description: 'Switch to Logistic Growth model. Watch any initial population y₀ smoothly follow the sigmoidal S-curve toward carrying capacity K = 8!',
      requirementFormula: '\\frac{dy}{dx} = r y \\left(1 - \\frac{y}{K}\\right), \\quad K = 8',
      targetCriteria: 'Select Logistic Growth model with y₀ > 1',
      xpReward: 50,
      tier1Hint: 'Tap "Logistic Growth" in the model selector.',
      tier2Hint: 'Drag initial y₀ to 2.0.',
      tier3Hint: 'Watch the curve surge upward and then gently flatten out as it reaches capacity y = 8.',
      autoPreset: () => {
        updateDiffEqParams({
          modelType: 'logistic-growth',
          initialY: 1.5,
          initialX: 0,
        });
      },
    },
  ];

  // Canvas Drawing
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

    // Background
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, width, height);

    // Domain bounds
    const xMin = modelType === 'newton-cooling' ? 0 : -1;
    const xMax = modelType === 'newton-cooling' ? 60 : 7;
    const yMin = modelType === 'newton-cooling' ? 0 : -1;
    const yMax = modelType === 'newton-cooling' ? 100 : 9;

    const padLeft = 45;
    const padBot = 35;
    const plotW = width - padLeft - 20;
    const plotH = height - padBot - 20;

    const toScreen = (x: number, y: number) => ({
      sx: padLeft + ((x - xMin) / (xMax - xMin)) * plotW,
      sy: padBot + plotH - ((y - yMin) / (yMax - yMin)) * plotH,
    });

    const toMath = (sx: number, sy: number) => ({
      x: xMin + ((sx - padLeft) / plotW) * (xMax - xMin),
      y: yMin + ((padBot + plotH - sy) / plotH) * (yMax - yMin),
    });

    // Draw Grid & Axes
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;

    // Horizontal Zero Axis
    if (yMin <= 0 && yMax >= 0) {
      const zeroY = toScreen(0, 0).sy;
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(padLeft, zeroY);
      ctx.lineTo(padLeft + plotW, zeroY);
      ctx.stroke();
    }

    // Ambient Temp Asymptote Line for Cooling
    if (modelType === 'newton-cooling') {
      const ambY = toScreen(0, ambientTemp).sy;
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(padLeft, ambY);
      ctx.lineTo(padLeft + plotW, ambY);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '10px monospace';
      ctx.fillText(`Ambient T_env = ${ambientTemp}°C`, padLeft + plotW - 140, ambY - 6);
    }

    // Draw Slope Field Needles
    if (showSlopeField) {
      const numCols = gridDensity;
      const numRows = gridDensity;
      const needleLen = 14;

      for (let c = 0; c <= numCols; c++) {
        for (let r = 0; r <= numRows; r++) {
          const gx = xMin + (c / numCols) * (xMax - xMin);
          const gy = yMin + (r / numRows) * (yMax - yMin);
          const slope = slopeFn(gx, gy);

          const pt = toScreen(gx, gy);
          const theta = Math.atan(slope);
          const dx = (needleLen / 2) * Math.cos(theta);
          const dy = (needleLen / 2) * Math.sin(theta);

          ctx.strokeStyle = '#334155';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(pt.sx - dx, pt.sy + dy);
          ctx.lineTo(pt.sx + dx, pt.sy - dy);
          ctx.stroke();

          // Mini directional arrowhead on needle
          ctx.fillStyle = '#475569';
          ctx.beginPath();
          ctx.arc(pt.sx + dx, pt.sy - dy, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Draw Solution Trajectory using Runge-Kutta 4 (RK4)
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.beginPath();

    const startPt = toScreen(initialX, initialY);
    ctx.moveTo(startPt.sx, startPt.sy);

    let curX = initialX;
    let curY = initialY;
    const h = (xMax - xMin) / 120;

    for (let step = 0; step < 120; step++) {
      if (curX > xMax || curY > yMax * 1.5 || curY < yMin * 1.5) break;

      // RK4 method
      const k1 = slopeFn(curX, curY);
      const k2 = slopeFn(curX + 0.5 * h, curY + 0.5 * h * k1);
      const k3 = slopeFn(curX + 0.5 * h, curY + 0.5 * h * k2);
      const k4 = slopeFn(curX + h, curY + h * k3);

      curY += (h / 6) * (k1 + 2 * k2 + 2 * k3 + k4);
      curX += h;

      const pt = toScreen(curX, curY);
      ctx.lineTo(pt.sx, pt.sy);
    }
    ctx.stroke();

    // Draw Initial Condition Point (x₀, y₀) (Draggable)
    const initPt = toScreen(initialX, initialY);
    ctx.fillStyle = 'rgba(245, 158, 11, 0.25)';
    ctx.beginPath();
    ctx.arc(initPt.sx, initPt.sy, 14, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(initPt.sx, initPt.sy, 6.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 11px monospace';
    ctx.fillText(
      `(${initialX.toFixed(1)}, ${initialY.toFixed(1)})`,
      initPt.sx + 10,
      initPt.sy - 8
    );
  }, [
    modelType,
    pCoeff,
    qCoeff,
    coolingK,
    ambientTemp,
    initialX,
    initialY,
    gridDensity,
    showSlopeField,
    slopeFn,
  ]);

  // Pointer drag handler for Initial Point (x₀, y₀)
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingPoint.current = true;
    lightTap();
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingPoint.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;

    const xMin = modelType === 'newton-cooling' ? 0 : -1;
    const xMax = modelType === 'newton-cooling' ? 60 : 7;
    const yMin = modelType === 'newton-cooling' ? 0 : -1;
    const yMax = modelType === 'newton-cooling' ? 100 : 9;

    const padLeft = 45;
    const padBot = 35;
    const plotW = canvas.clientWidth - padLeft - 20;
    const plotH = canvas.clientHeight - padBot - 20;

    const newX = Math.max(xMin, Math.min(xMax, xMin + ((sx - padLeft) / plotW) * (xMax - xMin)));
    const newY = Math.max(yMin, Math.min(yMax, yMin + ((padBot + plotH - sy) / plotH) * (yMax - yMin)));

    updateDiffEqParams({ initialX: newX, initialY: newY });
  };

  const handlePointerUp = () => {
    isDraggingPoint.current = false;
  };

  return (
    <div className="w-full h-full flex flex-col relative select-none">
      {/* Center Interactive Slope Field Canvas */}
      <div 
        className="w-full flex-1 flex flex-col items-center justify-center p-2 sm:p-4 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden relative cursor-crosshair"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* Real-time Math HUD Banner */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none z-10 px-2">
          <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-700/80 px-2.5 py-1 rounded-xl shadow-lg backdrop-blur-md">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span className="text-[11px] font-mono font-bold text-cyan-300">
              {modelType === 'linear-first-order' && 'dy/dx + Py = Q | I.F. = e^(∫ P dx)'}
              {modelType === 'newton-cooling' && 'dT/dt = -k(T - T_env)'}
              {modelType === 'logistic-growth' && 'dy/dx = ry(1 - y/K)'}
            </span>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 px-2.5 py-1 rounded-xl shadow-lg backdrop-blur-md">
            <span className="text-[11px] font-mono text-slate-300">
              y₀: <strong className="text-amber-400 font-bold">{initialY.toFixed(1)}</strong>
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-[11px] font-mono text-slate-300">
              Slope: <strong className="text-emerald-400">{slopeFn(initialX, initialY).toFixed(2)}</strong>
            </span>
          </div>
        </div>

        {/* Dynamic Canvas Viewport */}
        <div className="w-full max-w-xl flex-1 max-h-[62vh] relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
          <canvas ref={canvasRef} className="w-full h-full block" />
        </div>

        {/* Live Calculation Ratio Ribbon */}
        <div className="w-full max-w-xl mt-2 grid grid-cols-3 gap-1.5 text-center">
          <div className="p-2 rounded-xl bg-slate-900/90 border border-cyan-500/30">
            <span className="text-[9px] uppercase tracking-wider text-slate-400 block">Integrating Factor</span>
            <span className="text-xs sm:text-sm font-bold font-mono text-cyan-400">
              {modelType === 'linear-first-order' ? `e^(${pCoeff}x)` : 'e^(-kt)'}
            </span>
          </div>

          <div className="p-2 rounded-xl bg-slate-900/90 border border-amber-500/30">
            <span className="text-[9px] uppercase tracking-wider text-slate-400 block">Initial (x₀, y₀)</span>
            <span className="text-xs sm:text-sm font-bold font-mono text-amber-400">
              ({initialX.toFixed(1)}, {initialY.toFixed(1)})
            </span>
          </div>

          <div className="p-2 rounded-xl bg-slate-900/90 border border-emerald-500/30">
            <span className="text-[9px] uppercase tracking-wider text-slate-400 block">Rate dy/dx</span>
            <span className="text-xs sm:text-sm font-bold font-mono text-emerald-400">
              {slopeFn(initialX, initialY).toFixed(3)}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Sheet Controls & Right Sidebar Theory */}
      <BottomSheet
        title="Differential Equations & Slope Fields"
        quickEquation="\frac{dy}{dx} + P(x)y = Q(x) \iff y \cdot \text{I.F.} = \int Q \cdot \text{I.F.}\,dx + C"
        onReset={() => resetParams('differential-equations-lab')}
        theoryContent={
          <CoachTheoryModule
            simulatorId="differential-equations-lab"
            extraLiveDetails={
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between text-cyan-400">
                  <span>Current Slope Field Value:</span>
                  <span className="font-bold">{slopeFn(initialX, initialY).toFixed(3)}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-slate-950/70 p-1.5 rounded border border-slate-800">
                    <span className="text-slate-400 block">Integrating Factor:</span>
                    <span className="text-cyan-400 font-bold">{integratingFactor.toFixed(3)}</span>
                  </div>
                  <div className="bg-slate-950/70 p-1.5 rounded border border-slate-800">
                    <span className="text-slate-400 block">Equilibrium y:</span>
                    <span className="text-emerald-400 font-bold">
                      {modelType === 'newton-cooling'
                        ? `${ambientTemp}°C`
                        : (qCoeff / (pCoeff || 1)).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            }
          />
        }
        challengeContent={
          <ChallengeManager
            simulatorId="differential-equations-lab"
            simulatorTitle="Differential Equations & Slope Fields"
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
          {/* Model Type Switcher */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Differential Equation Model
            </label>
            <div className="grid grid-cols-3 gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => {
                  updateDiffEqParams({ modelType: 'linear-first-order' });
                  playClick();
                  lightTap();
                }}
                className={`py-1.5 text-[11px] font-semibold rounded-lg transition-all cursor-pointer ${
                  modelType === 'linear-first-order'
                    ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Linear 1st-Order
              </button>
              <button
                type="button"
                onClick={() => {
                  updateDiffEqParams({ modelType: 'newton-cooling' });
                  playClick();
                  lightTap();
                }}
                className={`py-1.5 text-[11px] font-semibold rounded-lg transition-all cursor-pointer ${
                  modelType === 'newton-cooling'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Newton Cooling
              </button>
              <button
                type="button"
                onClick={() => {
                  updateDiffEqParams({ modelType: 'logistic-growth' });
                  playClick();
                  lightTap();
                }}
                className={`py-1.5 text-[11px] font-semibold rounded-lg transition-all cursor-pointer ${
                  modelType === 'logistic-growth'
                    ? 'bg-purple-500 text-white shadow-md font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Logistic Growth
              </button>
            </div>
          </div>

          {/* Model Parameters */}
          {modelType === 'newton-cooling' ? (
            <div className="space-y-3">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-cyan-400">Ambient Temperature (T_env)</span>
                  <span className="text-xs font-mono font-bold text-cyan-300">{ambientTemp}°C</span>
                </div>
                <TouchSlider
                  label="Ambient Temp"
                  value={ambientTemp}
                  min={10}
                  max={40}
                  step={1}
                  unit="°C"
                  onChange={(val) => updateDiffEqParams({ ambientTemp: val })}
                />
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-400">Cooling Constant (k)</span>
                  <span className="text-xs font-mono font-bold text-amber-300">{coolingK.toFixed(3)}</span>
                </div>
                <TouchSlider
                  label="Cooling Rate"
                  value={coolingK}
                  min={0.02}
                  max={0.20}
                  step={0.01}
                  unit=""
                  onChange={(val) => updateDiffEqParams({ coolingK: val })}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-cyan-400">P(x) Coefficient in dy/dx + Py = Q</span>
                  <span className="text-xs font-mono font-bold text-cyan-300">{pCoeff.toFixed(1)}</span>
                </div>
                <TouchSlider
                  label="P"
                  value={pCoeff}
                  min={0.2}
                  max={3.0}
                  step={0.2}
                  unit=""
                  onChange={(val) => updateDiffEqParams({ pCoeff: val })}
                />
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-400">Q(x) Constant</span>
                  <span className="text-xs font-mono font-bold text-amber-300">{qCoeff.toFixed(1)}</span>
                </div>
                <TouchSlider
                  label="Q"
                  value={qCoeff}
                  min={0.5}
                  max={5.0}
                  step={0.5}
                  unit=""
                  onChange={(val) => updateDiffEqParams({ qCoeff: val })}
                />
              </div>
            </div>
          )}

          {/* Initial Value Slider */}
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-400">Initial Condition (y₀)</span>
              <span className="text-xs font-mono font-bold text-emerald-300">{initialY.toFixed(1)}</span>
            </div>
            <TouchSlider
              label="y(x₀)"
              value={initialY}
              min={modelType === 'newton-cooling' ? 20 : 0}
              max={modelType === 'newton-cooling' ? 95 : 8}
              step={0.5}
              unit=""
              onChange={(val) => updateDiffEqParams({ initialY: val })}
            />
          </div>
        </div>
      </BottomSheet>
    </div>
  );
};
