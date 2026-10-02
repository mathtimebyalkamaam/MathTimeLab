import React, { useEffect, useRef, useState } from 'react';
import { 
  Orbit, 
  Sparkles, 
  Info, 
  RotateCcw, 
  CheckCircle,
  Eye,
  SlidersHorizontal
} from 'lucide-react';
import { useSimulatorStore } from '../../store/useSimulatorStore';
import { BottomSheet } from '../layout/BottomSheet';
import { TouchSlider } from '../common/TouchSlider';
import { MathFormula } from '../common/MathFormula';

export const ConicSectionsSimulator: React.FC = () => {
  const { 
    conicParams, 
    updateConicParams, 
    resetParams,
    completeChallenge,
    challengeCompleted
  } = useSimulatorStore();

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Rotation angles for 3D camera
  const [rotX, setRotX] = useState<number>(0.5);
  const [rotY, setRotY] = useState<number>(0.8);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [lastPointer, setLastPointer] = useState<{ x: number; y: number } | null>(null);

  // Cone geometry parameters
  const alphaRad = (conicParams.coneApertureDeg * Math.PI) / 180; // semi-vertical angle ~45 deg
  const thetaRad = (conicParams.planeAngleDeg * Math.PI) / 180;
  const h = conicParams.planeHeight;

  // Determine conic type and eccentricity
  // In standard cone z^2 = (x^2 + y^2) * tan^2(90 - alpha) = (x^2 + y^2) / tan^2(alpha)
  // Eccentricity e = sin(theta) / cos(alpha)
  const eccentricity = Math.sin(thetaRad) / Math.cos(alphaRad);
  
  let conicType: 'Circle' | 'Ellipse' | 'Parabola' | 'Hyperbola' | 'Point / Degenerate' = 'Ellipse';
  if (Math.abs(h) < 0.05 && conicParams.planeAngleDeg <= conicParams.coneApertureDeg) {
    conicType = 'Point / Degenerate';
  } else if (conicParams.planeAngleDeg < 2) {
    conicType = 'Circle';
  } else if (Math.abs(conicParams.planeAngleDeg - conicParams.coneApertureDeg) < 2) {
    conicType = 'Parabola';
  } else if (conicParams.planeAngleDeg < conicParams.coneApertureDeg) {
    conicType = 'Ellipse';
  } else {
    conicType = 'Hyperbola';
  }

  // Check mission progress
  useEffect(() => {
    if (conicType === 'Parabola' && !challengeCompleted['conic_parabola']) {
      completeChallenge('conic_parabola', 50);
    }
    if (conicType === 'Hyperbola' && !challengeCompleted['conic_hyperbola']) {
      completeChallenge('conic_hyperbola', 40);
    }
  }, [conicType, challengeCompleted, completeChallenge]);

  // Touch and Pointer controls for rotating the 3D double cone
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setLastPointer({ x: e.clientX, y: e.clientY });
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDragging || !lastPointer) return;
    const dx = e.clientX - lastPointer.x;
    const dy = e.clientY - lastPointer.y;
    setRotY((prev) => prev + dx * 0.012);
    setRotX((prev) => Math.max(-1.2, Math.min(1.2, prev + dy * 0.012)));
    setLastPointer({ x: e.clientX, y: e.clientY });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsDragging(false);
    setLastPointer(null);
  };

  // High performance Canvas rendering loop (handles devicePixelRatio and orientation)
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

      const cx = width / 2;
      const cy = height * 0.44;
      const scale = Math.min(width, height) * 0.22;

      // 3D rotation projection helper
      const project = (x: number, y: number, z: number) => {
        // Rotate around Y
        const cosY = Math.cos(rotY);
        const sinY = Math.sin(rotY);
        const x1 = x * cosY - z * sinY;
        const z1 = x * sinY + z * cosY;

        // Rotate around X
        const cosX = Math.cos(rotX);
        const sinX = Math.sin(rotX);
        const y2 = y * cosX - z1 * sinX;
        const z2 = y * sinX + z1 * cosX;

        // Perspective
        const distance = 4.5;
        const fov = distance / (distance + z2 * 0.3);
        return {
          px: cx + x1 * scale * fov,
          py: cy - y2 * scale * fov,
          z: z2,
        };
      };

      // Draw Grid Base (subtle orientation floor)
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      for (let g = -2; g <= 2; g += 1) {
        const p1 = project(-2, -2, g);
        const p2 = project(2, -2, g);
        ctx.beginPath();
        ctx.moveTo(p1.px, p1.py);
        ctx.lineTo(p2.px, p2.py);
        ctx.stroke();

        const p3 = project(g, -2, -2);
        const p4 = project(g, -2, 2);
        ctx.beginPath();
        ctx.moveTo(p3.px, p3.py);
        ctx.lineTo(p4.px, p4.py);
        ctx.stroke();
      }

      // 3D Double Cone Rendering
      const coneR = Math.tan(alphaRad) * 2; // radius at z=2 and z=-2
      const segments = 32;

      // Draw Upper Nappe & Lower Nappe Rings
      const drawNappe = (zTop: number, isUpper: boolean) => {
        ctx.beginPath();
        for (let i = 0; i <= segments; i++) {
          const phi = (i / segments) * Math.PI * 2;
          const rx = Math.cos(phi) * coneR;
          const ry = Math.sin(phi) * coneR;
          const p = project(rx, zTop, ry);
          if (i === 0) ctx.moveTo(p.px, p.py);
          else ctx.lineTo(p.px, p.py);
        }
        ctx.strokeStyle = isUpper ? '#38bdf8' : '#64748b';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Longitudinal ribs
        for (let j = 0; j < 8; j++) {
          const phi = (j / 8) * Math.PI * 2;
          const rx = Math.cos(phi) * coneR;
          const ry = Math.sin(phi) * coneR;
          const apex = project(0, 0, 0);
          const rim = project(rx, zTop, ry);

          ctx.beginPath();
          ctx.moveTo(apex.px, apex.py);
          ctx.lineTo(rim.px, rim.py);
          ctx.strokeStyle = '#334155';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      };

      drawNappe(2, true);
      drawNappe(-2, false);

      // Draw Center Axis
      const zAxisBottom = project(0, -2.5, 0);
      const zAxisTop = project(0, 2.5, 0);
      ctx.beginPath();
      ctx.moveTo(zAxisBottom.px, zAxisBottom.py);
      ctx.lineTo(zAxisTop.px, zAxisTop.py);
      ctx.strokeStyle = '#475569';
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Cutting Plane
      if (conicParams.showCuttingPlane) {
        // Plane equation in 3D: z * cos(theta) + y * sin(theta) = h
        // or rotated plane quad corners
        const planeSize = 2.4;
        const cosT = Math.cos(thetaRad);
        const sinT = Math.sin(thetaRad);

        const corners = [
          { x: -planeSize, y: h * cosT - planeSize * sinT, z: h * sinT + planeSize * cosT },
          { x: planeSize, y: h * cosT - planeSize * sinT, z: h * sinT + planeSize * cosT },
          { x: planeSize, y: h * cosT + planeSize * sinT, z: h * sinT - planeSize * cosT },
          { x: -planeSize, y: h * cosT + planeSize * sinT, z: h * sinT - planeSize * cosT },
        ];

        ctx.beginPath();
        const p0 = project(corners[0].x, corners[0].y, corners[0].z);
        ctx.moveTo(p0.px, p0.py);
        for (let c = 1; c < corners.length; c++) {
          const pc = project(corners[c].x, corners[c].y, corners[c].z);
          ctx.lineTo(pc.px, pc.py);
        }
        ctx.closePath();
        ctx.fillStyle = 'rgba(244, 63, 94, 0.12)';
        ctx.fill();
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Draw Intersection Conic Curve
      if (conicParams.showTraceLine) {
        ctx.beginPath();
        const conicPoints = 64;
        let started = false;

        // Parametric trace on cutting plane
        for (let k = 0; k <= conicPoints; k++) {
          const u = ((k / conicPoints) - 0.5) * 3.6; // x on plane
          // Calculate intersection with cone x^2 + z^2 = y^2 * tan^2(alpha)
          // Cutting plane: y = (h - z*sin(theta)) / cos(theta)
          // We solve quadratic in z or evaluate parametric
          const angle = (k / conicPoints) * Math.PI * 2;
          let r = 1;
          // Standard polar conic equation: r = l / (1 + e*cos(angle))
          const e = eccentricity;
          const denom = 1 + e * Math.cos(angle);
          if (Math.abs(denom) > 0.05 && denom > 0) {
            r = Math.min(2.5, 0.8 / denom);
            const cx_conic = r * Math.cos(angle);
            const cy_conic = r * Math.sin(angle);

            // Transform plane coordinates into 3D world space
            const worldX = cx_conic;
            const worldY = h * Math.cos(thetaRad) + cy_conic * Math.sin(thetaRad);
            const worldZ = h * Math.sin(thetaRad) - cy_conic * Math.cos(thetaRad);

            const proj = project(worldX, worldY, worldZ);
            if (!started) {
              ctx.moveTo(proj.px, proj.py);
              started = true;
            } else {
              ctx.lineTo(proj.px, proj.py);
            }
          }
        }
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Draw Touch Control Affordance Helper on top-right
      ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
      ctx.strokeStyle = '#334155';
      ctx.beginPath();
      ctx.roundRect(16, 16, 175, 48, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px sans-serif';
      ctx.fillText('Touch & drag canvas to rotate', 26, 34);
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 11px monospace';
      ctx.fillText(`Conic: ${conicType}`, 26, 50);

      ctx.restore();
    };

    render();
    window.addEventListener('resize', render);
    return () => {
      window.removeEventListener('resize', render);
      cancelAnimationFrame(animId);
    };
  }, [conicParams, rotX, rotY, alphaRad, thetaRad, h, conicType, eccentricity]);

  return (
    <div className="relative w-full flex-1 min-h-0 h-full overflow-hidden flex flex-col bg-slate-950">
      {/* 3D WebGL / Canvas Stage */}
      <div className="relative w-full h-full flex-1">
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
        />

        {/* Floating Real-Time Conic HUD */}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 max-w-[210px] bg-slate-900/90 backdrop-blur-md border border-slate-800 p-2 sm:p-2.5 rounded-xl text-xs space-y-1 shadow-xl pointer-events-none">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-medium">Conic Section</span>
            <span className="font-bold text-cyan-400 font-mono">{conicType}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Eccentricity (e)</span>
            <span className="font-mono tabular-nums text-amber-300 font-semibold">
              {eccentricity.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>Plane Angle θ</span>
            <span className="font-mono">{conicParams.planeAngleDeg}°</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>Cone Angle α</span>
            <span className="font-mono">{conicParams.coneApertureDeg}°</span>
          </div>
        </div>
      </div>

      {/* Mobile Collapsible Bottom Sheet */}
      <BottomSheet
        title="Conic Sections 3D Controls"
        badgeLabel={`e = ${eccentricity.toFixed(2)}`}
        quickEquation={`θ = ${conicParams.planeAngleDeg}° · ${conicType}`}
        onReset={() => resetParams('conic-sections')}
        theoryContent={
          <div className="space-y-4 text-xs text-slate-300">
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
              <h4 className="font-bold text-cyan-400 text-sm">
                How Conic Sections Emerge
              </h4>
              <p className="leading-relaxed">
                A conic section is the curve obtained as the intersection of the surface of a cone with a flat cutting plane. The shape depends entirely on the angle of the plane <span className="font-mono text-cyan-300">θ</span> relative to the cone’s semi-vertical angle <span className="font-mono text-cyan-300">α</span>:
              </p>
            </div>

            <div className="space-y-2">
              <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                <div>
                  <strong className="text-white">Circle (θ = 0°, e = 0):</strong> The cutting plane is parallel to the circular base of the cone.
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <div>
                  <strong className="text-white">Ellipse (0 &lt; θ &lt; α, 0 &lt; e &lt; 1):</strong> The cutting plane cuts through a single nappe at an angle shallower than the cone edge.
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                <div>
                  <strong className="text-white">Parabola (θ = α, e = 1):</strong> The plane is parallel to the generating slope (generator line) of the cone.
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                <div>
                  <strong className="text-white">Hyperbola (θ &gt; α, e &gt; 1):</strong> The plane cuts both the upper and lower nappes of the double cone.
                </div>
              </div>
            </div>

            <MathFormula
              label="Standard Second-Degree Equation"
              formula="Ax² + Bxy + Cy² + Dx + Ey + F = 0"
              highlight="B² - 4AC"
            />
          </div>
        }
        challengeContent={
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1.5">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Class 11 Mastery Challenge
              </span>
              <p className="text-slate-300">
                Adjust the cutting plane angle until you produce an exact <strong className="text-white">Parabola (e = 1.00)</strong>. Notice how the plane aligns parallel with the cone side.
              </p>
            </div>

            <div className="space-y-2">
              <div className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
                challengeCompleted['conic_parabola']
                  ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300'
              }`}>
                <div className="space-y-0.5">
                  <div className="font-semibold text-white">Mission 1: Strike a Parabola</div>
                  <div className="text-[11px] text-slate-400">Set Plane Angle θ = {conicParams.coneApertureDeg}° (matches cone α)</div>
                </div>
                {challengeCompleted['conic_parabola'] ? (
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

              <div className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
                challengeCompleted['conic_hyperbola']
                  ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300'
              }`}>
                <div className="space-y-0.5">
                  <div className="font-semibold text-white">Mission 2: Dual Nappe Hyperbola</div>
                  <div className="text-[11px] text-slate-400">Increase θ &gt; {conicParams.coneApertureDeg}° to cut both top and bottom nappes</div>
                </div>
                {challengeCompleted['conic_hyperbola'] ? (
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
          <TouchSlider
            label="Plane Tilt Angle (θ)"
            min={0}
            max={85}
            step={1}
            unit="°"
            value={conicParams.planeAngleDeg}
            onChange={(val) => updateConicParams({ planeAngleDeg: val })}
          />

          <TouchSlider
            label="Plane Height Offset (h)"
            min={-1.8}
            max={1.8}
            step={0.1}
            value={conicParams.planeHeight}
            onChange={(val) => updateConicParams({ planeHeight: val })}
            formatValue={(v) => `${v > 0 ? '+' : ''}${v.toFixed(1)}`}
          />

          <TouchSlider
            label="Cone Semi-Aperture (α)"
            min={30}
            max={60}
            step={1}
            unit="°"
            value={conicParams.coneApertureDeg}
            onChange={(val) => updateConicParams({ coneApertureDeg: val })}
          />

          {/* Quick Preset Buttons for High School Students */}
          <div className="pt-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Instant Conic Presets
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => updateConicParams({ planeAngleDeg: 0, planeHeight: 0.8 })}
                className="py-2 px-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700/60 transition-colors"
              >
                Circle (θ=0°)
              </button>
              <button
                type="button"
                onClick={() => updateConicParams({ planeAngleDeg: 25, planeHeight: 0.5 })}
                className="py-2 px-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700/60 transition-colors"
              >
                Ellipse (θ=25°)
              </button>
              <button
                type="button"
                onClick={() => updateConicParams({ planeAngleDeg: conicParams.coneApertureDeg, planeHeight: 0.6 })}
                className="py-2 px-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-medium text-amber-300 border border-amber-900/40 transition-colors"
              >
                Parabola (θ=α)
              </button>
              <button
                type="button"
                onClick={() => updateConicParams({ planeAngleDeg: 65, planeHeight: 0.3 })}
                className="py-2 px-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-medium text-rose-300 border border-rose-900/40 transition-colors"
              >
                Hyperbola (θ&gt;α)
              </button>
            </div>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
};
