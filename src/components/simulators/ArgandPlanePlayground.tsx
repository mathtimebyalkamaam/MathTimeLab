/**
 * ArgandPlanePlayground.tsx: Interactive 2D complex plane simulator for Class 11/12.
 * Features:
 * - Touch-drag complex numbers z = a + bi (real & imaginary axes)
 * - Vector tip-to-tail addition (z1 + z2 = (a1+a2) + (b1+b2)i)
 * - Multiplication by i: Smooth 90° counter-clockwise animation (z * i = -b + ai)
 * - Interactive Challenge Mode: Rotate & scale to match mystery target z_target
 * - Haptic ticks, sound effects, and formula breakdown
 */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  RotateCw, 
  RotateCcw, 
  Plus, 
  Sparkles, 
  Crosshair, 
  Target, 
  Sliders, 
  CheckCircle2, 
  Zap, 
  Compass, 
  Activity,
  Layers,
  HelpCircle,
  TrendingUp,
  RefreshCw
} from 'lucide-react';
import { BottomSheet } from '../layout/BottomSheet';
import { TouchSlider } from '../common/TouchSlider';
import { MathFormula } from '../common/MathFormula';
import { CoachTheoryModule } from '../common/CoachTheoryModule';
import { ChallengeManager, ChallengeLevel } from '../common/ChallengeManager';
import { useHaptics } from '../../hooks/useHaptics';
import { useSound } from '../common/SoundManager';
import { useAnalytics } from '../../hooks/useAnalytics';

interface ComplexPoint {
  r: number; // Real component
  i: number; // Imaginary component
}

export const ArgandPlanePlayground: React.FC = () => {
  const { lightTap, successBuzz, errorBuzz } = useHaptics();
  const { playClick, playChime, playWhoosh, playError } = useSound();
  const { trackEvent, trackStruggle } = useAnalytics();

  // Primary complex number z1 = a + bi
  const [z1, setZ1] = useState<ComplexPoint>({ r: 3, i: 2 });
  // Secondary complex number z2 = c + di (for vector addition)
  const [z2, setZ2] = useState<ComplexPoint>({ r: -2, i: 3 });

  const [showZ2, setShowZ2] = useState<boolean>(true);
  const [showAddition, setShowAddition] = useState<boolean>(true);
  const [showPolar, setShowPolar] = useState<boolean>(false);
  const [showGridNumbers, setShowGridNumbers] = useState<boolean>(true);

  // Challenge Target state
  const [challengeActive, setChallengeActive] = useState<boolean>(false);
  const [targetPoint, setTargetPoint] = useState<ComplexPoint>({ r: -2, i: 4 });
  const [challengeSuccess, setChallengeSuccess] = useState<boolean>(false);

  // Rotation Animation State (for multiplying by i)
  const [isRotating, setIsRotating] = useState<boolean>(false);
  const rotationAnimRef = useRef<number | null>(null);
  const rotationAngleRef = useRef<number>(0);

  // Canvas & Interaction
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeDragPoint, setActiveDragPoint] = useState<'z1' | 'z2' | null>(null);

  // Math calculations
  const zSum: ComplexPoint = { r: z1.r + z2.r, i: z1.i + z2.i };
  const z1Modulus = Math.sqrt(z1.r * z1.r + z1.i * z1.i);
  const z1ArgumentDeg = Math.round((Math.atan2(z1.i, z1.r) * 180) / Math.PI);
  const positiveArgDeg = z1ArgumentDeg < 0 ? z1ArgumentDeg + 360 : z1ArgumentDeg;

  // Challenge verification
  useEffect(() => {
    if (!challengeActive) return;
    const dist = Math.hypot(z1.r - targetPoint.r, z1.i - targetPoint.i);
    if (dist < 0.35 && !challengeSuccess) {
      setChallengeSuccess(true);
      successBuzz();
      playChime();
      trackEvent('argand_challenge_completed', {
        target: `${targetPoint.r}+${targetPoint.i}i`,
        userZ: `${z1.r.toFixed(1)}+${z1.i.toFixed(1)}i`,
      });
    }
  }, [z1, challengeActive, targetPoint, challengeSuccess, successBuzz, playChime, trackEvent]);

  // Multiply by i with smooth 90° rotation animation
  const handleMultiplyByI = (direction: 'ccw' | 'cw' = 'ccw') => {
    if (isRotating) return;
    setIsRotating(true);
    playWhoosh();
    lightTap();

    const startZ = { ...z1 };
    // Multiplied by i: (a + bi)*i = -b + ai
    const endZ: ComplexPoint = direction === 'ccw'
      ? { r: -startZ.i, i: startZ.r }
      : { r: startZ.i, i: -startZ.r };

    const startTime = performance.now();
    const duration = 600; // ms
    const initialAngle = Math.atan2(startZ.i, startZ.r);
    const radius = Math.hypot(startZ.r, startZ.i);
    const deltaAngle = direction === 'ccw' ? Math.PI / 2 : -Math.PI / 2;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentAngle = initialAngle + deltaAngle * eased;

      setZ1({
        r: Number((radius * Math.cos(currentAngle)).toFixed(2)),
        i: Number((radius * Math.sin(currentAngle)).toFixed(2)),
      });

      if (progress < 1) {
        rotationAnimRef.current = requestAnimationFrame(animate);
      } else {
        setZ1(endZ);
        setIsRotating(false);
        successBuzz();
        trackEvent('argand_multiply_i', { result: `${endZ.r}+${endZ.i}i` });
      }
    };

    rotationAnimRef.current = requestAnimationFrame(animate);
  };

  // Convert plane coords (-7 to +7) to Canvas Pixels
  const toScreen = useCallback((r: number, i: number, width: number, height: number, scale: number) => {
    const cx = width / 2;
    const cy = height / 2;
    return {
      x: cx + r * scale,
      y: cy - i * scale,
    };
  }, []);

  const toComplex = useCallback((sx: number, sy: number, width: number, height: number, scale: number): ComplexPoint => {
    const cx = width / 2;
    const cy = height / 2;
    const rawR = (sx - cx) / scale;
    const rawI = (cy - sy) / scale;
    return {
      r: Number(Math.max(-7, Math.min(7, rawR)).toFixed(1)),
      i: Number(Math.max(-7, Math.min(7, rawI)).toFixed(1)),
    };
  }, []);

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    // Deep Dark Argand Grid Background
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, w, h);

    const scale = Math.min(w, h) / 16; // Grid scale (~16 units visible)
    const cx = w / 2;
    const cy = h / 2;

    // Grid lines
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.3)';
    for (let u = -8; u <= 8; u++) {
      if (u === 0) continue;
      // Vertical grid
      const px = cx + u * scale;
      ctx.beginPath();
      ctx.moveTo(px, 0);
      ctx.lineTo(px, h);
      ctx.stroke();

      // Horizontal grid
      const py = cy + u * scale;
      ctx.beginPath();
      ctx.moveTo(0, py);
      ctx.lineTo(w, py);
      ctx.stroke();

      // Axis labels
      if (showGridNumbers) {
        ctx.fillStyle = 'rgba(100, 116, 139, 0.7)';
        ctx.font = '10px monospace';
        if (Math.abs(u) <= 7) {
          ctx.fillText(`${u}`, px - 3, cy + 14);
          ctx.fillText(`${-u}i`, cx + 6, py + 3);
        }
      }
    }

    // Main Axes (Real Axis & Imaginary Axis)
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.7)';
    // Real (horizontal)
    ctx.beginPath();
    ctx.moveTo(0, cy);
    ctx.lineTo(w, cy);
    ctx.stroke();
    // Imaginary (vertical)
    ctx.beginPath();
    ctx.moveTo(cx, 0);
    ctx.lineTo(cx, h);
    ctx.stroke();

    // Axis Labels
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 11px monospace';
    ctx.fillText('Re (Real)', w - 68, cy - 8);
    ctx.fillStyle = '#a855f7';
    ctx.fillText('Im (Imaginary)', cx + 10, 18);

    // Origin (0,0)
    ctx.fillStyle = '#64748b';
    ctx.font = '10px monospace';
    ctx.fillText('0', cx - 12, cy + 14);

    // Draw Polar concentric modulus circles
    if (showPolar) {
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)';
      ctx.setLineDash([3, 3]);
      [1, 2, 3, 4, 5, 6].forEach((radiusUnits) => {
        ctx.beginPath();
        ctx.arc(cx, cy, radiusUnits * scale, 0, Math.PI * 2);
        ctx.stroke();
      });
      ctx.setLineDash([]);
    }

    // Challenge Target Zone
    if (challengeActive) {
      const targetScreen = toScreen(targetPoint.r, targetPoint.i, w, h, scale);
      ctx.fillStyle = challengeSuccess ? 'rgba(16, 185, 129, 0.25)' : 'rgba(245, 158, 11, 0.2)';
      ctx.strokeStyle = challengeSuccess ? '#10b981' : '#f59e0b';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.arc(targetScreen.x, targetScreen.y, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = challengeSuccess ? '#34d399' : '#fbbf24';
      ctx.font = 'bold 10px monospace';
      ctx.fillText(
        `Target: ${targetPoint.r >= 0 ? targetPoint.r : targetPoint.r} ${targetPoint.i >= 0 ? '+' : ''}${targetPoint.i}i`,
        targetScreen.x + 14,
        targetScreen.y - 12
      );
    }

    const p1 = toScreen(z1.r, z1.i, w, h, scale);

    // Vector z2 (Tip-to-tail vector addition preview)
    if (showZ2) {
      const p2 = toScreen(z2.r, z2.i, w, h, scale);

      // Vector arrow z2 from origin
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();

      // Vector arrow head for z2
      const angle2 = Math.atan2(p2.y - cy, p2.x - cx);
      drawArrowHead(ctx, p2.x, p2.y, angle2, '#a855f7');

      // Draggable point z2
      ctx.fillStyle = '#c084fc';
      ctx.shadowColor = '#a855f7';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(p2.x, p2.y, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px monospace';
      ctx.fillText(`z₂ = ${z2.r} ${z2.i >= 0 ? '+' : ''}${z2.i}i`, p2.x + 10, p2.y + 4);

      // If Tip-to-Tail addition is enabled
      if (showAddition) {
        const pSum = toScreen(zSum.r, zSum.i, w, h, scale);

        // Dashed parallelogram lines
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)';
        ctx.setLineDash([4, 4]);
        ctx.lineWidth = 1.5;
        // From z1 to sum (z2 vector attached to z1 tip)
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(pSum.x, pSum.y);
        ctx.stroke();

        // From z2 to sum (z1 vector attached to z2 tip)
        ctx.beginPath();
        ctx.moveTo(p2.x, p2.y);
        ctx.lineTo(pSum.x, pSum.y);
        ctx.stroke();
        ctx.setLineDash([]);

        // Resultant Vector (z1 + z2) in Emerald Green
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(pSum.x, pSum.y);
        ctx.stroke();

        const angleSum = Math.atan2(pSum.y - cy, pSum.x - cx);
        drawArrowHead(ctx, pSum.x, pSum.y, angleSum, '#10b981');

        // Sum node
        ctx.fillStyle = '#34d399';
        ctx.shadowColor = '#10b981';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(pSum.x, pSum.y, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.fillStyle = '#34d399';
        ctx.font = 'bold 11px monospace';
        ctx.fillText(`z₁ + z₂ = ${zSum.r} ${zSum.i >= 0 ? '+' : ''}${zSum.i}i`, pSum.x + 10, pSum.y - 8);
      }
    }

    // Vector z1 (Primary Point)
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(p1.x, p1.y);
    ctx.stroke();

    const angle1 = Math.atan2(p1.y - cy, p1.x - cx);
    drawArrowHead(ctx, p1.x, p1.y, angle1, '#38bdf8');

    // Orthogonal coordinate projections to axes
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.setLineDash([3, 3]);
    ctx.lineWidth = 1;
    // To Real axis
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p1.x, cy);
    ctx.stroke();
    // To Imaginary axis
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(cx, p1.y);
    ctx.stroke();
    ctx.setLineDash([]);

    // Point z1 Draggable Handle
    ctx.fillStyle = '#0284c7';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(p1.x, p1.y, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px monospace';
    ctx.fillText(`z₁ = ${z1.r} ${z1.i >= 0 ? '+' : ''}${z1.i}i`, p1.x + 12, p1.y - 10);

    ctx.restore();
  }, [z1, z2, showZ2, showAddition, showPolar, showGridNumbers, challengeActive, targetPoint, challengeSuccess, toScreen]);

  // Helper to draw clean vector arrow tips
  const drawArrowHead = (ctx: CanvasRenderingContext2D, x: number, y: number, angle: number, color: string) => {
    const headLen = 12;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(
      x - headLen * Math.cos(angle - Math.PI / 6),
      y - headLen * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
      x - headLen * Math.cos(angle + Math.PI / 6),
      y - headLen * Math.sin(angle + Math.PI / 6)
    );
    ctx.closePath();
    ctx.fill();
  };

  // Touch & Pointer Drag Handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;

    const scale = Math.min(rect.width, rect.height) / 16;
    const p1 = toScreen(z1.r, z1.i, rect.width, rect.height, scale);
    const d1 = Math.hypot(sx - p1.x, sy - p1.y);

    if (d1 < 30) {
      setActiveDragPoint('z1');
      lightTap();
      canvas.setPointerCapture(e.pointerId);
      return;
    }

    if (showZ2) {
      const p2 = toScreen(z2.r, z2.i, rect.width, rect.height, scale);
      const d2 = Math.hypot(sx - p2.x, sy - p2.y);
      if (d2 < 30) {
        setActiveDragPoint('z2');
        lightTap();
        canvas.setPointerCapture(e.pointerId);
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!activeDragPoint) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;
    const scale = Math.min(rect.width, rect.height) / 16;

    const newComplex = toComplex(sx, sy, rect.width, rect.height, scale);

    if (activeDragPoint === 'z1') {
      setZ1(newComplex);
    } else if (activeDragPoint === 'z2') {
      setZ2(newComplex);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (activeDragPoint) {
      setActiveDragPoint(null);
      try {
        canvasRef.current?.releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  // Preset Challenge Levels
  const challengeLevels: ChallengeLevel[] = [
    {
      levelNumber: 1,
      title: 'Phase Rotation by i (90°)',
      badge: 'Imaginary Spin',
      description: 'Multiply z₁ by i to rotate it exactly 90° into Quadrant II and reach z = -2 + 3i.',
      requirementFormula: 'i · (3 + 2i) = -2 + 3i',
      targetCriteria: 'Hit (-2, 3)',
      xpReward: 40,
      autoPreset: () => {
        setZ1({ r: 3, i: 2 });
        setTargetPoint({ r: -2, i: 3 });
        setChallengeActive(true);
        setChallengeSuccess(false);
      },
    },
    {
      levelNumber: 2,
      title: 'Opposite Inversion by i² (-180°)',
      badge: 'Inversion Master',
      description: 'Apply two successive multiplications by i (i² = -1) to reach the point directly opposite the origin at (-3, -2).',
      requirementFormula: 'i² · z = -z',
      targetCriteria: 'Hit (-3, -2)',
      xpReward: 50,
      autoPreset: () => {
        setZ1({ r: 3, i: 2 });
        setTargetPoint({ r: -3, i: -2 });
        setChallengeActive(true);
        setChallengeSuccess(false);
      },
    },
    {
      levelNumber: 3,
      title: 'Target Synthesis with Addition',
      badge: 'Argand Architect',
      description: 'Position z₁ and z₂ so that their vector sum z₁ + z₂ reaches the target coordinate (1 + 5i).',
      requirementFormula: '(a₁ + a₂) + (b₁ + b₂)i = 1 + 5i',
      targetCriteria: 'z₁ + z₂ = 1 + 5i',
      xpReward: 60,
      autoPreset: () => {
        setZ1({ r: 2, i: 1 });
        setZ2({ r: -1, i: 4 });
        setShowZ2(true);
        setShowAddition(true);
        setTargetPoint({ r: 1, i: 5 });
        setChallengeActive(true);
        setChallengeSuccess(false);
      },
    },
  ];

  return (
    <div className="relative w-full flex-1 min-h-0 h-full flex flex-col bg-slate-950 text-slate-100 overflow-hidden select-none">
      {/* Top Telemetry & Math HUD Bar */}
      <div className="z-10 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-3 sm:px-6 py-2 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <div className="px-2.5 py-1 rounded-xl bg-cyan-950/60 border border-cyan-800/50 flex items-center gap-1.5 shrink-0">
            <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">z₁:</span>
            <span className="font-mono text-xs font-black text-white">
              {z1.r} {z1.i >= 0 ? '+' : ''}{z1.i}i
            </span>
          </div>

          <div className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-1.5 shrink-0">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Modulus |z₁|:</span>
            <span className="font-mono text-xs text-amber-300 font-bold">
              {z1Modulus.toFixed(2)}
            </span>
          </div>

          <div className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-1.5 shrink-0">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Arg(z₁):</span>
            <span className="font-mono text-xs text-purple-300 font-bold">
              {positiveArgDeg}°
            </span>
          </div>
        </div>

        {/* Quick Rotation Action: Multiply by i */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => handleMultiplyByI('ccw')}
            disabled={isRotating}
            className="py-1 px-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 active:scale-95 text-white font-mono text-xs font-bold flex items-center gap-1.5 shadow-md shadow-purple-900/30 touch-manipulation transition-all cursor-pointer"
            title="Multiply by i (Rotate 90° CCW)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>× i (+90°)</span>
          </button>
        </div>
      </div>

      {/* Interactive Canvas Stage */}
      <div className="relative flex-1 w-full bg-slate-950 touch-none">
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="w-full h-full cursor-crosshair touch-none"
        />

        {/* Challenge Victory Alert Toast */}
        {challengeSuccess && (
          <div className="absolute top-14 right-4 z-20 p-2.5 rounded-2xl bg-emerald-950/90 border border-emerald-500 text-emerald-300 shadow-2xl flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="font-mono text-xs font-bold">Target Hit! +XP Unlocked</span>
          </div>
        )}
      </div>

      {/* Bottom Sheet Controls & Formulas */}
      <BottomSheet
        title="Complex Plane Controls"
        badgeLabel="Class 11/12 · Complex Numbers"
        quickEquation={`z₁ = ${z1.r} + ${z1.i}i · |z₁| = ${z1Modulus.toFixed(2)}`}
        onReset={() => {
          setZ1({ r: 3, i: 2 });
          setZ2({ r: -2, i: 3 });
          setChallengeActive(false);
          setChallengeSuccess(false);
        }}
        theoryContent={
          <CoachTheoryModule
            simulatorId="argand-plane"
            extraLiveDetails={
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-xl bg-cyan-950/30 border border-cyan-800/40">
                    <span className="text-[10px] text-cyan-300 block font-semibold">Active Vector z₁:</span>
                    <span className="font-mono text-white font-bold">{z1.r} + {z1.i}i</span>
                  </div>
                  <div className="p-2 rounded-xl bg-purple-950/30 border border-purple-800/40">
                    <span className="text-[10px] text-purple-300 block font-semibold">Modulus |z₁| = √(a² + b²):</span>
                    <span className="font-mono text-white font-bold">{z1Modulus.toFixed(3)}</span>
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800 text-center font-mono text-xs text-amber-300">
                  Argument θ = {(Math.atan2(z1.i, z1.r) * (180 / Math.PI)).toFixed(1)}° · z₁ = {z1Modulus.toFixed(2)} e^(i·{(Math.atan2(z1.i, z1.r) * (180 / Math.PI)).toFixed(0)}°)
                </div>
              </div>
            }
          />
        }
        challengeContent={
          <div className="space-y-4">
            <ChallengeManager
              simulatorId="argand-plane"
              simulatorTitle="The Argand Plane Playground"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2 p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs font-bold text-cyan-400 block">z₁ Real &amp; Imaginary Controls</span>
              <TouchSlider
                label="Re(z₁)"
                value={z1.r}
                min={-6}
                max={6}
                step={0.5}
                onChange={(val) => setZ1((prev) => ({ ...prev, r: val }))}
              />
              <TouchSlider
                label="Im(z₁)"
                value={z1.i}
                min={-6}
                max={6}
                step={0.5}
                onChange={(val) => setZ1((prev) => ({ ...prev, i: val }))}
              />
            </div>

            <div className="space-y-2 p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs font-bold text-purple-400 block">z₂ Controls (Vector Addition)</span>
              <TouchSlider
                label="Re(z₂)"
                value={z2.r}
                min={-6}
                max={6}
                step={0.5}
                onChange={(val) => setZ2((prev) => ({ ...prev, r: val }))}
              />
              <TouchSlider
                label="Im(z₂)"
                value={z2.i}
                min={-6}
                max={6}
                step={0.5}
                onChange={(val) => setZ2((prev) => ({ ...prev, i: val }))}
              />
            </div>
          </div>

          {/* Quick Toggles */}
          <div className="flex flex-wrap gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowZ2(!showZ2)}
              className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors ${
                showZ2
                  ? 'bg-purple-950/60 border-purple-500 text-purple-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              <span>{showZ2 ? 'Hide z₂ Vector' : 'Show z₂ Vector'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowAddition(!showAddition)}
              className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors ${
                showAddition
                  ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              <span>{showAddition ? 'Parallelogram Sum ON' : 'Parallelogram Sum OFF'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowPolar(!showPolar)}
              className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors ${
                showPolar
                  ? 'bg-cyan-950/60 border-cyan-500 text-cyan-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              <span>{showPolar ? 'Polar Circles ON' : 'Polar Circles OFF'}</span>
            </button>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
};
