import React, { useState, useEffect } from 'react';
import { 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  Sparkles, 
  Navigation, 
  Orbit, 
  Activity, 
  ArrowRight,
  Sliders,
  Maximize2
} from 'lucide-react';
import { InlineMath, BlockMath } from './MathFormula';
import { useHaptics } from '../../hooks/useHaptics';
import { useSimulatorStore } from '../../store/useSimulatorStore';

type SampleSimType = 'drone' | 'tangent' | 'unit-circle';

export const LiveHomeSimulatorSampler: React.FC = () => {
  const { navigateTo } = useSimulatorStore();
  const { lightTap } = useHaptics();
  const [activeSample, setActiveSample] = useState<SampleSimType>('drone');

  // --- Sample 1: Drone Coordinate Geometry State ---
  const [droneX, setDroneX] = useState<number>(6);
  const [droneY, setDroneY] = useState<number>(8);
  const startX = 0;
  const startY = 0;
  const deltaX = droneX - startX;
  const deltaY = droneY - startY;
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

  // --- Sample 2: Circle Tangent State ---
  // Circle center (0, 0), radius R = 4, angle theta in degrees
  const [tangentAngle, setTangentAngle] = useState<number>(45);
  const radius = 4;
  const rad = (tangentAngle * Math.PI) / 180;
  const contactX = radius * Math.cos(rad);
  const contactY = radius * Math.sin(rad);
  // External point P along tangent line at distance 7 from origin
  const externalDist = 7;
  const tangentLength = Math.sqrt(Math.max(0, externalDist * externalDist - radius * radius));

  // --- Sample 3: Unit Circle Trigonometry State ---
  const [theta, setTheta] = useState<number>(60);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    if (!isPlaying) return;
    let animId: number;
    let lastTime = performance.now();
    const tick = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      // 55 degrees per second smooth rotation, frame-rate independent
      setTheta((prev) => (prev + dt * 55) % 360);
      animId = requestAnimationFrame(tick);
    };
    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  const thetaRad = (theta * Math.PI) / 180;
  const sinVal = Math.sin(thetaRad);
  const cosVal = Math.cos(thetaRad);

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-cyan-500/30 p-3 sm:p-4 shadow-xl space-y-3">
      {/* Sampler Header */}
      <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
              Interactive Live Demo
            </span>
          </div>
          <h3 className="text-xs sm:text-sm font-bold text-white mt-0.5">
            Math You Can Touch &amp; Test Live
          </h3>
        </div>

        {/* Simulator Selector Tabs */}
        <div className="flex items-center p-0.5 bg-slate-950 rounded-lg border border-slate-800 shrink-0">
          <button
            type="button"
            onClick={() => {
              lightTap();
              setActiveSample('drone');
            }}
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
              activeSample === 'drone'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Navigation className="w-3 h-3" />
            <span>1. Distance</span>
          </button>

          <button
            type="button"
            onClick={() => {
              lightTap();
              setActiveSample('tangent');
            }}
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
              activeSample === 'tangent'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Orbit className="w-3 h-3" />
            <span>2. Tangent</span>
          </button>

          <button
            type="button"
            onClick={() => {
              lightTap();
              setActiveSample('unit-circle');
            }}
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
              activeSample === 'unit-circle'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-3 h-3" />
            <span>3. Trig Wave</span>
          </button>
        </div>
      </div>

      {/* SAMPLE 1: Drone Coordinate Geometry & Distance */}
      {activeSample === 'drone' && (
        <div className="space-y-3.5">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="font-bold text-cyan-300">Class 9 & 10 · Coordinate Geometry</span>
            <span className="text-[11px] font-mono text-slate-400">Pythagorean Derivation</span>
          </div>

          {/* Interactive Canvas Grid (Pure responsive SVG, zero overflow) */}
          <div className="relative w-full h-32 sm:h-38 bg-slate-950 rounded-xl border border-slate-800 p-2 overflow-hidden flex items-center justify-center">
            <svg viewBox="-1 -1 12 11" className="w-full h-full">
              {/* Grid Lines */}
              {[...Array(11)].map((_, i) => (
                <line
                  key={`gx-${i}`}
                  x1={i}
                  y1={0}
                  x2={i}
                  y2={10}
                  stroke="#1e293b"
                  strokeWidth="0.05"
                />
              ))}
              {[...Array(11)].map((_, i) => (
                <line
                  key={`gy-${i}`}
                  x1={0}
                  y1={i}
                  x2={10}
                  y2={i}
                  stroke="#1e293b"
                  strokeWidth="0.05"
                />
              ))}

              {/* Axes */}
              <line x1="0" y1="0" x2="10.5" y2="0" stroke="#475569" strokeWidth="0.1" />
              <line x1="0" y1="0" x2="0" y2="10.5" stroke="#475569" strokeWidth="0.1" />

              {/* Horizontal Leg (Delta X) */}
              <line
                x1={startX}
                y1={startY}
                x2={droneX}
                y2={startY}
                stroke="#38bdf8"
                strokeWidth="0.18"
              />
              {/* Vertical Leg (Delta Y) */}
              <line
                x1={droneX}
                y1={startY}
                x2={droneX}
                y2={droneY}
                stroke="#34d399"
                strokeWidth="0.18"
              />
              {/* Right Angle Indicator */}
              {droneX > 1 && droneY > 1 && (
                <polyline
                  points={`${droneX - 0.7},${startY} ${droneX - 0.7},${startY + 0.7} ${droneX},${startY + 0.7}`}
                  stroke="#64748b"
                  strokeWidth="0.08"
                  fill="none"
                />
              )}

              {/* Direct Hypotenuse Distance */}
              <line
                x1={startX}
                y1={startY}
                x2={droneX}
                y2={droneY}
                stroke="#f43f5e"
                strokeWidth="0.22"
                strokeDasharray="0.3 0.2"
              />

              {/* Base Point A (0,0) */}
              <circle cx={startX} cy={startY} r="0.45" fill="#38bdf8" />
              <text x={startX + 0.5} y={startY + 0.9} fill="#94a3b8" fontSize="0.7" fontFamily="monospace">
                Base (0,0)
              </text>

              {/* Target Point B (droneX, droneY) */}
              <circle cx={droneX} cy={droneY} r="0.5" fill="#f43f5e" />
              <text x={Math.min(droneX - 2.8, 7.2)} y={Math.max(droneY - 0.5, 1)} fill="#f43f5e" fontSize="0.75" fontWeight="bold" fontFamily="monospace">
                Drone ({droneX}, {droneY})
              </text>
            </svg>

            {/* Live Distance Pill floating in corner */}
            <div className="absolute top-2.5 right-2.5 bg-slate-900/90 border border-slate-700 px-2.5 py-1 rounded-xl text-right">
              <span className="text-[10px] text-slate-400 block font-sans">Distance d</span>
              <span className="text-xs font-mono font-black text-rose-400">
                {distance.toFixed(2)} units
              </span>
            </div>
          </div>

          {/* Interactive Sliders */}
          <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">X-Coordinate (Δx):</span>
                <span className="font-mono font-bold text-sky-400">{droneX}</span>
              </div>
              <input
                type="range"
                min="1"
                max="9"
                step="1"
                value={droneX}
                onChange={(e) => {
                  lightTap();
                  setDroneX(Number(e.target.value));
                }}
                className="w-full accent-sky-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Y-Coordinate (Δy):</span>
                <span className="font-mono font-bold text-emerald-400">{droneY}</span>
              </div>
              <input
                type="range"
                min="1"
                max="9"
                step="1"
                value={droneY}
                onChange={(e) => {
                  lightTap();
                  setDroneY(Number(e.target.value));
                }}
                className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>
          </div>

          {/* Live KaTeX Formula Calculation */}
          <div className="p-2 rounded-xl bg-slate-950 border border-cyan-500/30 text-center">
            <span className="text-[10px] text-cyan-400 font-mono font-bold uppercase tracking-wider block mb-1">
              Exact Pythagorean Calculation
            </span>
            <div className="text-xs font-mono text-slate-200">
              <span className="text-rose-400 font-bold">d</span> = √(<span className="text-sky-400">{droneX}²</span> + <span className="text-emerald-400">{droneY}²</span>) = √(<span>{droneX * droneX}</span> + <span>{droneY * droneY}</span>) = <span className="text-rose-400 font-bold">{distance.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  lightTap();
                  setDroneX(3);
                  setDroneY(4);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-800 text-[11px] font-mono text-cyan-300 border border-slate-700 active:scale-95"
              >
                (3, 4) ➔ d=5
              </button>
              <button
                type="button"
                onClick={() => {
                  lightTap();
                  setDroneX(6);
                  setDroneY(8);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-800 text-[11px] font-mono text-cyan-300 border border-slate-700 active:scale-95"
              >
                (6, 8) ➔ d=10
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                lightTap();
                navigateTo('drone-navigator');
              }}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-md shadow-cyan-500/20 active:scale-95 cursor-pointer"
            >
              <span>Launch Full Lab</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* SAMPLE 2: Circle Tangent & Perpendicular Radius (Class 10 Core) */}
      {activeSample === 'tangent' && (
        <div className="space-y-3.5">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="font-bold text-amber-300">Class 10 Board Theorem · Circle Tangents</span>
            <span className="text-[11px] font-mono text-emerald-400">Radius ⊥ Tangent (90°)</span>
          </div>

          {/* Circle Canvas */}
          <div className="relative w-full h-32 sm:h-38 bg-slate-950 rounded-xl border border-slate-800 p-2 overflow-hidden flex items-center justify-center">
            <svg viewBox="-8 -8 16 16" className="w-full h-full">
              {/* Axes */}
              <line x1="-7" y1="0" x2="7" y2="0" stroke="#1e293b" strokeWidth="0.1" />
              <line x1="0" y1="-7" x2="0" y2="7" stroke="#1e293b" strokeWidth="0.1" />

              {/* The Circle */}
              <circle cx="0" cy="0" r={radius} stroke="#38bdf8" strokeWidth="0.2" fill="rgba(56, 189, 248, 0.05)" />

              {/* Radius line from (0,0) to Point of Contact T */}
              <line x1="0" y1="0" x2={contactX} y2={contactY} stroke="#38bdf8" strokeWidth="0.25" />

              {/* Perpendicular Tangent Line */}
              {/* Tangent slope is -cos(theta)/sin(theta) */}
              <line
                x1={contactX - Math.sin(rad) * 4}
                y1={contactY + Math.cos(rad) * 4}
                x2={contactX + Math.sin(rad) * 4}
                y2={contactY - Math.cos(rad) * 4}
                stroke="#10b981"
                strokeWidth="0.3"
              />

              {/* 90-degree angle indicator at contact point */}
              <circle cx={contactX} cy={contactY} r="0.4" fill="#f59e0b" />

              {/* Center point O */}
              <circle cx="0" cy="0" r="0.35" fill="#94a3b8" />
              <text x="0.4" y="0.9" fill="#94a3b8" fontSize="0.9" fontFamily="monospace">
                O (0,0)
              </text>

              {/* Contact Point label */}
              <text
                x={contactX > 0 ? contactX + 0.6 : contactX - 2.8}
                y={contactY > 0 ? contactY + 0.8 : contactY - 0.5}
                fill="#f59e0b"
                fontSize="0.9"
                fontWeight="bold"
                fontFamily="monospace"
              >
                T (90°)
              </text>
            </svg>

            <div className="absolute top-2.5 right-2.5 bg-slate-900/90 border border-slate-700 px-2.5 py-1 rounded-xl text-right">
              <span className="text-[10px] text-slate-400 block font-sans">Contact Point</span>
              <span className="text-xs font-mono font-black text-amber-300">
                θ = {tangentAngle}°
              </span>
            </div>
          </div>

          {/* Angle Slider */}
          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Rotate Point of Contact (θ):</span>
              <span className="font-mono font-bold text-amber-400">{tangentAngle}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="360"
              step="5"
              value={tangentAngle}
              onChange={(e) => {
                lightTap();
                setTangentAngle(Number(e.target.value));
              }}
              className="w-full accent-amber-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
          </div>

          {/* Theorem statement box */}
          <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/30 text-center space-y-0.5">
            <span className="text-[10px] text-emerald-400 font-mono font-bold uppercase tracking-wider block">
              Core Board Theorem: ∠OTP = 90°
            </span>
            <p className="text-xs text-slate-300">
              The tangent at any point of a circle is <strong className="text-emerald-400">perpendicular</strong> to the radius through the point of contact.
            </p>
          </div>

          <div className="flex items-center justify-end pt-1">
            <button
              type="button"
              onClick={() => {
                lightTap();
                navigateTo('circle-tangents-lab');
              }}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-md shadow-cyan-500/20 active:scale-95 cursor-pointer"
            >
              <span>Launch Full Tangents Lab</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* SAMPLE 3: Unit Circle & Trigonometric Sine Wave */}
      {activeSample === 'unit-circle' && (
        <div className="space-y-3.5">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="font-bold text-violet-300">Class 10 & 11 · Unit Circle Trigonometry</span>
            <span className="text-[11px] font-mono text-cyan-400">sin²θ + cos²θ = 1</span>
          </div>

          {/* Unit Circle + Wave Canvas */}
          <div className="relative w-full h-32 sm:h-38 bg-slate-950 rounded-xl border border-slate-800 p-2 overflow-hidden flex items-center justify-center">
            <svg viewBox="-3 -2.2 7.5 4.4" className="w-full h-full">
              {/* Unit Circle (left) */}
              <circle cx="-1" cy="0" r="1.4" stroke="#334155" strokeWidth="0.04" fill="none" />
              <line x1="-2.7" y1="0" x2="0.7" y2="0" stroke="#1e293b" strokeWidth="0.04" />
              <line x1="-1" y1="-1.8" x2="-1" y2="1.8" stroke="#1e293b" strokeWidth="0.04" />

              {/* Radius Vector */}
              <line
                x1="-1"
                y1="0"
                x2={-1 + 1.4 * cosVal}
                y2={-1.4 * sinVal}
                stroke="#38bdf8"
                strokeWidth="0.08"
              />

              {/* Horizontal Cosine Leg */}
              <line
                x1="-1"
                y1="0"
                x2={-1 + 1.4 * cosVal}
                y2="0"
                stroke="#a78bfa"
                strokeWidth="0.1"
              />

              {/* Vertical Sine Leg */}
              <line
                x1={-1 + 1.4 * cosVal}
                y1="0"
                x2={-1 + 1.4 * cosVal}
                y2={-1.4 * sinVal}
                stroke="#f43f5e"
                strokeWidth="0.12"
              />

              {/* Angle circle tip */}
              <circle cx={-1 + 1.4 * cosVal} cy={-1.4 * sinVal} r="0.1" fill="#38bdf8" />

              {/* Dashed connector line from circle to wave */}
              <line
                x1={-1 + 1.4 * cosVal}
                y1={-1.4 * sinVal}
                x2="1.2"
                y2={-1.4 * sinVal}
                stroke="#f43f5e"
                strokeWidth="0.04"
                strokeDasharray="0.08 0.08"
              />

              {/* Sine Wave Plot (right) */}
              <line x1="1.2" y1="0" x2="4.2" y2="0" stroke="#334155" strokeWidth="0.04" />
              {/* Plot path of sin(t) */}
              <path
                d={`M 1.2 0 ${[...Array(60)]
                  .map((_, i) => {
                    const t = (i / 60) * 2 * Math.PI;
                    const x = 1.2 + (i / 60) * 3;
                    const y = -1.4 * Math.sin(t);
                    return `L ${x.toFixed(3)} ${y.toFixed(3)}`;
                  })
                  .join(' ')}`}
                fill="none"
                stroke="#64748b"
                strokeWidth="0.05"
              />

              {/* Active Point on Wave */}
              <circle
                cx={1.2 + (theta / 360) * 3}
                cy={-1.4 * sinVal}
                r="0.12"
                fill="#f43f5e"
              />
            </svg>

            <div className="absolute top-2.5 right-2.5 bg-slate-900/90 border border-slate-700 px-2.5 py-1 rounded-xl text-right">
              <span className="text-[10px] text-slate-400 block font-sans">sin({theta}°)</span>
              <span className="text-xs font-mono font-black text-rose-400">
                {sinVal.toFixed(3)}
              </span>
            </div>
          </div>

          {/* Angle Slider + Play/Pause */}
          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Angle θ:</span>
              <div className="flex items-center gap-3">
                <span className="font-mono text-purple-400">cos = {cosVal.toFixed(3)}</span>
                <span className="font-mono text-rose-400">sin = {sinVal.toFixed(3)}</span>
                <span className="font-mono font-bold text-white bg-slate-800 px-1.5 py-0.5 rounded">{theta}°</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  lightTap();
                  setIsPlaying(!isPlaying);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 flex items-center gap-1 cursor-pointer transition-colors ${
                  isPlaying ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-200 hover:text-white'
                }`}
              >
                <Play className="w-3 h-3 fill-current" />
                <span>{isPlaying ? 'Pause' : 'Auto Play'}</span>
              </button>

              <input
                type="range"
                min="0"
                max="360"
                step="1"
                value={theta}
                onChange={(e) => {
                  lightTap();
                  setTheta(Number(e.target.value));
                  if (isPlaying) setIsPlaying(false);
                }}
                className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>
          </div>

          <div className="flex items-center justify-end pt-1">
            <button
              type="button"
              onClick={() => {
                lightTap();
                navigateTo('unit-circle');
              }}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-md shadow-cyan-500/20 active:scale-95 cursor-pointer"
            >
              <span>Launch Unit Circle Lab</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
