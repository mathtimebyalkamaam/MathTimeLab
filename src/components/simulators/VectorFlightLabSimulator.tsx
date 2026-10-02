import React, { useEffect, useRef, useState } from 'react';
import { 
  Boxes, 
  Sparkles, 
  RotateCcw, 
  CheckCircle, 
  Eye, 
  Layers,
  ArrowRight
} from 'lucide-react';
import { useSimulatorStore } from '../../store/useSimulatorStore';
import { BottomSheet } from '../layout/BottomSheet';
import { TouchSlider } from '../common/TouchSlider';
import { MathFormula } from '../common/MathFormula';
import { CoachTheoryModule } from '../common/CoachTheoryModule';

export const VectorFlightLabSimulator: React.FC = () => {
  const {
    vectorParams,
    updateVectorParams,
    resetParams,
    completeChallenge,
    challengeCompleted,
    isZenMode,
  } = useSimulatorStore();

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 3D Orbit Camera angles
  const [rotX, setRotX] = useState<number>(0.4);
  const [rotY, setRotY] = useState<number>(0.7);
  const [isOrbiting, setIsOrbiting] = useState<boolean>(false);
  const [lastPointer, setLastPointer] = useState<{ x: number; y: number } | null>(null);

  const [showHudDetails, setShowHudDetails] = useState<boolean>(false);

  const u = vectorParams.vectorU;
  const v = vectorParams.vectorV;

  // Vector Math
  const magU = Math.hypot(u[0], u[1], u[2]);
  const magV = Math.hypot(v[0], v[1], v[2]);
  const dotProduct = u[0] * v[0] + u[1] * v[1] + u[2] * v[2];

  // Angle theta
  const cosTheta = (magU * magV > 0) ? Math.max(-1, Math.min(1, dotProduct / (magU * magV))) : 1;
  const angleRad = Math.acos(cosTheta);
  const angleDeg = (angleRad * 180) / Math.PI;

  // Cross Product u x v = (uy*vz - uz*vy, uz*vx - ux*vz, ux*vy - uy*vx)
  const crossProduct: [number, number, number] = [
    u[1] * v[2] - u[2] * v[1],
    u[2] * v[0] - u[0] * v[2],
    u[0] * v[1] - u[1] * v[0],
  ];
  const magCross = Math.hypot(crossProduct[0], crossProduct[1], crossProduct[2]);

  // Projection of u onto v
  const projScalar = magV > 0 ? dotProduct / (magV * magV) : 0;
  const projVector: [number, number, number] = [
    v[0] * projScalar,
    v[1] * projScalar,
    v[2] * projScalar,
  ];

  // Mission check
  useEffect(() => {
    if (Math.abs(dotProduct) < 0.15 && !challengeCompleted['vector_orthogonal']) {
      completeChallenge('vector_orthogonal', 45);
    }
    if (magCross > 6.0 && !challengeCompleted['vector_cross_max']) {
      completeChallenge('vector_cross_max', 40);
    }
  }, [dotProduct, magCross, challengeCompleted, completeChallenge]);

  // Touch & Pointer controls for rotating 3D vector space
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsOrbiting(true);
    setLastPointer({ x: e.clientX, y: e.clientY });
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isOrbiting || !lastPointer) return;
    const dx = e.clientX - lastPointer.x;
    const dy = e.clientY - lastPointer.y;
    setRotY((prev) => prev + dx * 0.012);
    setRotX((prev) => Math.max(-1.3, Math.min(1.3, prev + dy * 0.012)));
    setLastPointer({ x: e.clientX, y: e.clientY });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsOrbiting(false);
    setLastPointer(null);
  };

  // 3D Canvas Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number = 0;

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

      const isMobile = width < 640;
      const cx = width / 2;
      // Center higher on mobile to stay clear of peeked bottom sheet
      const cy = height * (isMobile ? 0.38 : 0.44);
      const scale = Math.min(width, height) * (isMobile ? 0.22 : 0.17);

      // 3D rotation projection
      const project = (x: number, y: number, z: number) => {
        // Rotate Y
        const cosY = Math.cos(rotY);
        const sinY = Math.sin(rotY);
        const x1 = x * cosY - z * sinY;
        const z1 = x * sinY + z * cosY;

        // Rotate X
        const cosX = Math.cos(rotX);
        const sinX = Math.sin(rotX);
        const y2 = y * cosX - z1 * sinX;
        const z2 = y * sinX + z1 * cosX;

        const dist = 5.0;
        const fov = dist / (dist + z2 * 0.25);
        return {
          px: cx + x1 * scale * fov,
          py: cy - y2 * scale * fov,
          z: z2,
        };
      };

      // 1. Draw 3D Grid Floor at y = 0
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      for (let i = -3; i <= 3; i++) {
        const p1 = project(-3, 0, i);
        const p2 = project(3, 0, i);
        ctx.beginPath();
        ctx.moveTo(p1.px, p1.py);
        ctx.lineTo(p2.px, p2.py);
        ctx.stroke();

        const p3 = project(i, 0, -3);
        const p4 = project(i, 0, 3);
        ctx.beginPath();
        ctx.moveTo(p3.px, p3.py);
        ctx.lineTo(p4.px, p4.py);
        ctx.stroke();
      }

      // 2. Draw 3D Axes (X in red, Y in green, Z in blue)
      const origin = project(0, 0, 0);

      const drawAxis = (x: number, y: number, z: number, color: string, label: string) => {
        const tip = project(x, y, z);
        ctx.beginPath();
        ctx.moveTo(origin.px, origin.py);
        ctx.lineTo(tip.px, tip.py);
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = color;
        ctx.font = 'bold 10px monospace';
        ctx.fillText(label, tip.px + 4, tip.py - 4);
      };

      drawAxis(3.2, 0, 0, '#64748b', '+X');
      drawAxis(0, 3.2, 0, '#64748b', '+Y');
      drawAxis(0, 0, 3.2, '#64748b', '+Z');

      // 3. Draw Parallelogram Area (Area = |u x v|)
      if (vectorParams.showParallelogram) {
        const pOrigin = project(0, 0, 0);
        const pU = project(u[0], u[1], u[2]);
        const pSum = project(u[0] + v[0], u[1] + v[1], u[2] + v[2]);
        const pV = project(v[0], v[1], v[2]);

        ctx.beginPath();
        ctx.moveTo(pOrigin.px, pOrigin.py);
        ctx.lineTo(pU.px, pU.py);
        ctx.lineTo(pSum.px, pSum.py);
        ctx.lineTo(pV.px, pV.py);
        ctx.closePath();
        ctx.fillStyle = 'rgba(236, 72, 153, 0.15)';
        ctx.fill();
        ctx.strokeStyle = '#ec4899';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // 4. Draw Vector Helper Function
      const drawVector = (
        vx: number,
        vy: number,
        vz: number,
        color: string,
        lineWidth: number,
        label: string
      ) => {
        const pTip = project(vx, vy, vz);

        // Vector Stem
        ctx.beginPath();
        ctx.moveTo(origin.px, origin.py);
        ctx.lineTo(pTip.px, pTip.py);
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.stroke();

        // Vector Arrow Tip Dot
        ctx.beginPath();
        ctx.arc(pTip.px, pTip.py, 5, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Label
        ctx.fillStyle = color;
        ctx.font = 'bold 12px monospace';
        ctx.fillText(label, pTip.px + 6, pTip.py - 6);
      };

      // Draw Vector U (Cyan)
      drawVector(u[0], u[1], u[2], '#38bdf8', 3, 'u');

      // Draw Vector V (Amber)
      drawVector(v[0], v[1], v[2], '#f59e0b', 3, 'v');

      // Draw Projection Shadow of U onto V
      if (vectorParams.showDotProduct && magV > 0) {
        const pProj = project(projVector[0], projVector[1], projVector[2]);
        const pU = project(u[0], u[1], u[2]);

        // Perpendicular drop line from U to projection point
        ctx.beginPath();
        ctx.moveTo(pU.px, pU.py);
        ctx.lineTo(pProj.px, pProj.py);
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.6)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 3]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Projection vector line
        ctx.beginPath();
        ctx.moveTo(origin.px, origin.py);
        ctx.lineTo(pProj.px, pProj.py);
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 3.5;
        ctx.stroke();

        ctx.fillStyle = '#10b981';
        ctx.font = '10px monospace';
        ctx.fillText('proj_v(u)', pProj.px + 4, pProj.py + 12);
      }

      // Draw Cross Product Vector Normal (Magenta)
      if (vectorParams.showCrossProduct && magCross > 0) {
        // Scaled slightly for pleasant viewport display
        const displayScale = 0.65;
        drawVector(
          crossProduct[0] * displayScale,
          crossProduct[1] * displayScale,
          crossProduct[2] * displayScale,
          '#ec4899',
          3,
          'u × v'
        );
      }

      // Only draw angle watermark in top corner when plenty of space
      if (!isMobile) {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
        ctx.strokeStyle = '#334155';
        ctx.beginPath();
        ctx.roundRect(16, 16, 165, 42, 8);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#94a3b8';
        ctx.font = '11px sans-serif';
        ctx.fillText('Touch & Orbit in 3D', 26, 32);
        ctx.fillStyle = '#ec4899';
        ctx.font = 'bold 11px monospace';
        ctx.fillText(`θ = ${angleDeg.toFixed(1)}°`, 26, 48);
      }

      ctx.restore();
    };

    render();
    window.addEventListener('resize', render);
    return () => {
      window.removeEventListener('resize', render);
      cancelAnimationFrame(animId);
    };
  }, [vectorParams, rotX, rotY, u, v, crossProduct, projVector, magV, magCross, angleDeg]);

  return (
    <div className="relative w-full flex-1 min-h-0 h-full overflow-hidden flex flex-col bg-slate-950">
      {/* 3D Canvas Stage */}
      <div className="relative w-full h-full flex-1">
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
        />

        {/* Real-time 3D Vector HUD (compact on mobile, expands on tap) */}
        {!isZenMode && (
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 pointer-events-auto">
          <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-2xl shadow-xl p-2 sm:p-2.5 text-xs transition-all max-w-[190px] sm:max-w-[220px]">
            {/* Quick compact row */}
            <div 
              onClick={() => setShowHudDetails(!showHudDetails)}
              className="flex items-center justify-between gap-2 cursor-pointer select-none"
            >
              <div className="flex items-center gap-1.5 font-mono text-[11px]">
                <span className="font-bold text-emerald-400">u·v: {dotProduct.toFixed(1)}</span>
                <span className="text-slate-500">|</span>
                <span className="text-pink-400">θ: {angleDeg.toFixed(0)}°</span>
              </div>
              <span className="text-[10px] text-slate-400 underline">
                {showHudDetails ? 'Hide' : 'Values'}
              </span>
            </div>

            {/* Detailed metric drawer */}
            {showHudDetails && (
              <div className="mt-2 pt-2 border-t border-slate-800 space-y-1.5 animate-in fade-in duration-150">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-cyan-400 font-semibold">|u|</span>
                  <span className="font-mono tabular-nums text-slate-200">{magU.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-amber-400 font-semibold">|v|</span>
                  <span className="font-mono tabular-nums text-slate-200">{magV.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-emerald-400 font-bold">Dot u · v</span>
                  <span className="font-mono tabular-nums text-emerald-300 font-bold">
                    {dotProduct.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-pink-400 font-bold">Cross |u × v|</span>
                  <span className="font-mono tabular-nums text-pink-300 font-bold">
                    {magCross.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>Exact Angle θ</span>
                  <span className="font-mono tabular-nums">{angleDeg.toFixed(1)}°</span>
                </div>
              </div>
            )}
          </div>
        </div>
        )}
      </div>

      {/* Mobile Collapsible Bottom Sheet */}
      <BottomSheet
        title="3D Vector Parameters"
        badgeLabel={`u · v = ${dotProduct.toFixed(2)}`}
        quickEquation={`u · v = |u||v|cos(${angleDeg.toFixed(0)}°) · |u × v| = ${magCross.toFixed(2)}`}
        onReset={() => resetParams('vector-flight-lab')}
        theoryContent={
          <CoachTheoryModule
            simulatorId="vector-flight-lab"
            extraLiveDetails={
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-xl bg-emerald-950/30 border border-emerald-800/40">
                    <span className="text-[10px] text-emerald-300 block font-semibold">Dot Product u · v:</span>
                    <span className="font-mono text-white font-bold">{dotProduct.toFixed(3)} ({angleDeg.toFixed(1)}°)</span>
                  </div>
                  <div className="p-2 rounded-xl bg-pink-950/30 border border-pink-800/40">
                    <span className="text-[10px] text-pink-300 block font-semibold">Cross Product ||u × v||:</span>
                    <span className="font-mono text-white font-bold">{magCross.toFixed(3)} sq u</span>
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
                Class 12 Linear Algebra Missions
              </span>
              <p className="text-slate-300">
                Adjust vector coordinates to hit exact geometric conditions in 3D space.
              </p>
            </div>

            <div className="space-y-2">
              <div className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
                challengeCompleted['vector_orthogonal']
                  ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300'
              }`}>
                <div className="space-y-0.5">
                  <div className="font-semibold text-white">Mission 1: Pure Orthogonality</div>
                  <div className="text-[11px] text-slate-400">Align vectors so Dot Product u · v = 0.00 (θ = 90°)</div>
                </div>
                {challengeCompleted['vector_orthogonal'] ? (
                  <span className="flex items-center gap-1 font-bold text-emerald-400 text-xs">
                    <CheckCircle className="w-4 h-4" />
                    +45 XP
                  </span>
                ) : (
                  <span className="text-xs font-mono text-amber-400 bg-amber-950/60 px-2 py-1 rounded">
                    45 XP
                  </span>
                )}
              </div>

              <div className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
                challengeCompleted['vector_cross_max']
                  ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300'
              }`}>
                <div className="space-y-0.5">
                  <div className="font-semibold text-white">Mission 2: Parallelogram Expansion</div>
                  <div className="text-[11px] text-slate-400">Scale coordinates until Cross Area |u × v| ≥ 6.00</div>
                </div>
                {challengeCompleted['vector_cross_max'] ? (
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
            </div>
          </div>
        }
      >
        {/* Controls Tab */}
        <div className="space-y-4">
          <div className="space-y-3">
            <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
              <span>Vector u Coordinates (Cyan)</span>
            </span>
            <TouchSlider
              label="u_x (Horizontal)"
              min={-3}
              max={3}
              step={0.2}
              value={u[0]}
              onChange={(val) => updateVectorParams({ vectorU: [val, u[1], u[2]] })}
            />
            <TouchSlider
              label="u_y (Vertical)"
              min={-3}
              max={3}
              step={0.2}
              value={u[1]}
              onChange={(val) => updateVectorParams({ vectorU: [u[0], val, u[2]] })}
            />
            <TouchSlider
              label="u_z (Depth)"
              min={-3}
              max={3}
              step={0.2}
              value={u[2]}
              onChange={(val) => updateVectorParams({ vectorU: [u[0], u[1], val] })}
            />
          </div>

          <div className="pt-2 border-t border-slate-800/80 space-y-3">
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <span>Vector v Coordinates (Amber)</span>
            </span>
            <TouchSlider
              label="v_x (Horizontal)"
              min={-3}
              max={3}
              step={0.2}
              value={v[0]}
              onChange={(val) => updateVectorParams({ vectorV: [val, v[1], v[2]] })}
            />
            <TouchSlider
              label="v_y (Vertical)"
              min={-3}
              max={3}
              step={0.2}
              value={v[1]}
              onChange={(val) => updateVectorParams({ vectorV: [v[0], val, v[2]] })}
            />
            <TouchSlider
              label="v_z (Depth)"
              min={-3}
              max={3}
              step={0.2}
              value={v[2]}
              onChange={(val) => updateVectorParams({ vectorV: [v[0], v[1], val] })}
            />
          </div>

          {/* Quick Geometric Presets */}
          <div className="pt-2 border-t border-slate-800/80">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              High School Geometry Presets
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() =>
                  updateVectorParams({
                    vectorU: [2.5, 0, 0],
                    vectorV: [0, 2.5, 0],
                  })
                }
                className="py-2 px-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-medium text-emerald-300 border border-emerald-900/40 transition-colors"
              >
                Orthogonal (90°)
              </button>
              <button
                type="button"
                onClick={() =>
                  updateVectorParams({
                    vectorU: [2, 1, 0],
                    vectorV: [2, 1, 0],
                  })
                }
                className="py-2 px-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-medium text-amber-300 border border-amber-900/40 transition-colors"
              >
                Collinear (0°)
              </button>
              <button
                type="button"
                onClick={() =>
                  updateVectorParams({
                    vectorU: [1, 2, 2],
                    vectorV: [2, 1, -2],
                  })
                }
                className="py-2 px-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-medium text-cyan-300 border border-cyan-900/40 transition-colors"
              >
                3D Diagonal
              </button>
            </div>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
};
