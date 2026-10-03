import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import confetti from 'canvas-confetti';
import * as math from 'mathjs';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Gauge, 
  Paintbrush, 
  Layers, 
  Sliders, 
  Plus, 
  Trash2, 
  PenTool, 
  Crosshair,
  Award
} from 'lucide-react';
import { useSimulatorStore } from '../../store/useSimulatorStore';
import { BottomSheet } from '../layout/BottomSheet';
import { TouchSlider } from '../common/TouchSlider';
import { MathFormula } from '../common/MathFormula';
import { CoachTheoryModule } from '../common/CoachTheoryModule';
import { ChallengeManager } from '../common/ChallengeManager';
import { RollercoasterPoint } from '../../types/simulators';
import { useHaptics } from '../../hooks/useHaptics';
import { useSound } from '../common/SoundManager';
import { useAnalytics } from '../../hooks/useAnalytics';
import { LiveSubstitutionCard } from '../common/LiveSubstitutionCard';

export const RollercoasterArchitect: React.FC = () => {
  const {
    rollercoasterParams,
    updateRollercoasterParams,
    resetParams,
    completeChallenge,
    challengeCompleted,
    addXp,
    isZenMode,
  } = useSimulatorStore();

  const { successBuzz, errorBuzz, lightTap, heavyImpact } = useHaptics();
  const { playWhoosh, playChime, playError, playClick } = useSound();
  const { trackEvent, trackStruggle } = useAnalytics();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const extremeGForceAlertedRef = useRef(false);

  // Interaction State
  const [selectedPointIdx, setSelectedPointIdx] = useState<number | null>(null);
  const [isDraggingPoint, setIsDraggingPoint] = useState(false);
  const [isFreehandDrawing, setIsFreehandDrawing] = useState(false);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [cartDistanceTravelled, setCartDistanceTravelled] = useState(0);

  // Runtime live readings
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [currentSlope, setCurrentSlope] = useState(0);
  const [currentGForce, setCurrentGForce] = useState(1);
  const [paintAreaUsed, setPaintAreaUsed] = useState(0);
  const [maxTrackSpeed, setMaxTrackSpeed] = useState(0);
  const [challengeSuccess, setChallengeSuccess] = useState(false);

  const {
    points,
    isPlaying,
    gravity,
    friction,
    showTangents,
    showPaintArea,
    showCurvatureComb,
    challengeActive,
  } = rollercoasterParams;

  // Catmull-Rom Spline Evaluation: generates smooth parametric curve through control points
  const splineSamples = useMemo(() => {
    if (points.length < 2) return [];

    const samples: { x: number; y: number; slope: number; curvature: number; arcLength: number }[] = [];
    const numSubdivisions = 60; // per segment
    let totalLength = 0;

    // Catmull-Rom point interpolation helper
    const getCatmullRomPoint = (
      p0: RollercoasterPoint,
      p1: RollercoasterPoint,
      p2: RollercoasterPoint,
      p3: RollercoasterPoint,
      t: number
    ) => {
      const t2 = t * t;
      const t3 = t2 * t;

      // Catmull-Rom basis matrix
      const x = 0.5 * (
        (2 * p1.x) +
        (-p0.x + p2.x) * t +
        (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
        (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3
      );

      const y = 0.5 * (
        (2 * p1.y) +
        (-p0.y + p2.y) * t +
        (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
        (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3
      );

      // 1st Derivative with respect to parameter t (dx/dt, dy/dt)
      const dx_dt = 0.5 * (
        (-p0.x + p2.x) +
        2 * (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t +
        3 * (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t2
      );

      const dy_dt = 0.5 * (
        (-p0.y + p2.y) +
        2 * (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t +
        3 * (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t2
      );

      // 2nd Derivative with respect to t (d2x/dt2, d2y/dt2)
      const d2x_dt2 = 0.5 * (
        2 * (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) +
        6 * (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t
      );

      const d2y_dt2 = 0.5 * (
        2 * (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) +
        6 * (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t
      );

      // 1st Derivative dy/dx = (dy/dt) / (dx/dt)
      // Note: in Screen coords, downward is +y. We invert for math calculus standard
      const slope = Math.abs(dx_dt) > 0.0001 ? -(dy_dt / dx_dt) : 0;

      // Signed Curvature formula: κ = (dx/dt * d2y/dt2 - dy/dt * d2x/dt2) / (dx/dt^2 + dy/dt^2)^(3/2)
      const speedParam = Math.hypot(dx_dt, dy_dt);
      const curvature = speedParam > 0.0001
        ? (dx_dt * d2y_dt2 - dy_dt * d2x_dt2) / Math.pow(speedParam, 3)
        : 0;

      return { x, y, slope, curvature };
    };

    // Pad end points for natural spline clamping
    const padded = [
      { x: points[0].x - 60, y: points[0].y },
      ...points,
      { x: points[points.length - 1].x + 60, y: points[points.length - 1].y },
    ];

    let prevX = points[0].x;
    let prevY = points[0].y;

    for (let i = 0; i < points.length - 1; i++) {
      const p0 = padded[i];
      const p1 = padded[i + 1];
      const p2 = padded[i + 2];
      const p3 = padded[i + 3];

      for (let s = 0; s < numSubdivisions; s++) {
        const t = s / numSubdivisions;
        const pt = getCatmullRomPoint(p0, p1, p2, p3, t);

        const dDist = Math.hypot(pt.x - prevX, pt.y - prevY);
        totalLength += dDist;
        prevX = pt.x;
        prevY = pt.y;

        samples.push({
          x: pt.x,
          y: pt.y,
          slope: pt.slope,
          curvature: pt.curvature,
          arcLength: totalLength,
        });
      }
    }

    // Add final endpoint
    const lastP = points[points.length - 1];
    samples.push({
      x: lastP.x,
      y: lastP.y,
      slope: 0,
      curvature: 0,
      arcLength: totalLength,
    });

    return samples;
  }, [points]);

  const totalTrackLength = useMemo(() => {
    if (splineSamples.length === 0) return 1;
    return splineSamples[splineSamples.length - 1].arcLength;
  }, [splineSamples]);

  // Definite Integral (Paint Area under curve) using Numerical Trapezoidal Rule
  // Floor baseline is groundLevel (y = 420 in canvas space)
  const groundLevelY = 420;
  const totalIntegralPaintArea = useMemo(() => {
    if (splineSamples.length < 2) return 0;
    let area = 0;
    for (let i = 1; i < splineSamples.length; i++) {
      const pPrev = splineSamples[i - 1];
      const pCurr = splineSamples[i];
      const dx = Math.abs(pCurr.x - pPrev.x);
      // Height from ground to curve: (groundLevelY - y)
      const h1 = Math.max(0, groundLevelY - pPrev.y);
      const h2 = Math.max(0, groundLevelY - pCurr.y);
      // Trapezoid area: 0.5 * (h1 + h2) * dx
      area += 0.5 * (h1 + h2) * dx;
    }
    // Scale pixel area to educational metric units (1 sq unit = 100 px^2)
    return Math.round(area / 100);
  }, [splineSamples, groundLevelY]);

  // Current Cart Position and Kinematics along Spline
  const currentCartState = useMemo(() => {
    if (splineSamples.length === 0) {
      return { x: 50, y: 110, slope: 0, curvature: 0, speed: 0, gForce: 1, paintUpToCart: 0 };
    }

    const targetDist = cartDistanceTravelled % Math.max(1, totalTrackLength);

    // Find sample closest to targetDist
    let sampleIdx = 0;
    for (let i = 0; i < splineSamples.length - 1; i++) {
      if (splineSamples[i].arcLength <= targetDist && splineSamples[i + 1].arcLength >= targetDist) {
        sampleIdx = i;
        break;
      }
    }

    const cur = splineSamples[sampleIdx];
    const initialHeight = groundLevelY - points[0].y;
    const currentHeight = Math.max(0, groundLevelY - cur.y);
    const deltaH = Math.max(0, (points[0].y - cur.y) * -1); // in canvas, lower y = higher in air

    // Potential to Kinetic Energy: v = sqrt(2 * g * deltaH) + initial boost
    // Using math.js for clean symbolic computation
    const rawSpeed = math.sqrt(Math.max(1, 2 * (gravity * 0.18) * Math.max(2, cur.y - points[0].y + 12))) as number;
    const speedMps = Math.min(35, Number((rawSpeed * 2.8).toFixed(1)));

    // G-Force = 1 + (v^2 * curvature) / g
    // Curvature in 1/meters scaled
    const centripetalAcc = (speedMps * speedMps) * (Math.abs(cur.curvature) * 20);
    const gForce = Number((1 + centripetalAcc / gravity).toFixed(2));

    // Calculate paint area up to this x
    let paintUpTo = 0;
    for (let i = 1; i <= sampleIdx; i++) {
      const p0 = splineSamples[i - 1];
      const p1 = splineSamples[i];
      const dx = Math.abs(p1.x - p0.x);
      const h1 = Math.max(0, groundLevelY - p0.y);
      const h2 = Math.max(0, groundLevelY - p1.y);
      paintUpTo += 0.5 * (h1 + h2) * dx;
    }

    return {
      x: cur.x,
      y: cur.y,
      slope: cur.slope,
      curvature: cur.curvature,
      speed: speedMps,
      gForce,
      paintUpToCart: Math.round(paintUpTo / 100),
    };
  }, [splineSamples, cartDistanceTravelled, totalTrackLength, groundLevelY, points, gravity]);

  // Sync state to UI HUD
  useEffect(() => {
    setCurrentSpeed(currentCartState.speed);
    setCurrentSlope(currentCartState.slope);
    setCurrentGForce(currentCartState.gForce);
    setPaintAreaUsed(currentCartState.paintUpToCart);
    setMaxTrackSpeed((prev) => Math.max(prev, currentCartState.speed));

    // Detect dangerous curvature G-Force (> 4.5G)
    if (currentCartState.gForce > 4.5 && !extremeGForceAlertedRef.current) {
      extremeGForceAlertedRef.current = true;
      trackStruggle(
        'rollercoaster-architect',
        'dangerous_curvature_gforce',
        1,
        `Exceeded human safety limit at ${currentCartState.gForce}G (curvature κ = ${currentCartState.curvature.toFixed(4)})`
      );
    } else if (currentCartState.gForce <= 3.0) {
      extremeGForceAlertedRef.current = false;
    }
  }, [currentCartState, trackStruggle]);

  // Challenge Mode Validation: "Max Speed == 20 m/s (±1.5) AND total paint used < 500 sq units"
  useEffect(() => {
    if (challengeActive) {
      if (Math.abs(maxTrackSpeed - 20) <= 1.8 && totalIntegralPaintArea < 500 && totalIntegralPaintArea > 150) {
        if (!challengeSuccess) {
          setChallengeSuccess(true);
          successBuzz();
          playChime();
          trackEvent('rollercoaster_challenge_completed', {
            maxTrackSpeed,
            totalIntegralPaintArea,
          });
          confetti({
            particleCount: 70,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#38bdf8', '#34d399', '#f59e0b'],
          });
          completeChallenge('rollercoaster_challenge_20mps', 60);
        }
      }
    }
  }, [challengeActive, maxTrackSpeed, totalIntegralPaintArea, challengeSuccess, completeChallenge, successBuzz, playChime, trackEvent]);

  // Continuous Rollercoaster Cart Kinematic Animation Loop
  useEffect(() => {
    if (!isPlaying) return;
    let animId: number;
    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = Math.min(0.04, (time - lastTime) / 1000);
      lastTime = time;

      // Speed drives arc length travel rate
      const v = Math.max(8, currentCartState.speed * 8.5);
      setCartDistanceTravelled((prev) => prev + v * dt);

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, currentCartState.speed]);

  // Pointer / Touch Handlers for Dragging Control Points
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;

    // Check hit test against control points (minimum 44px touch target)
    const hitRadius = 26;
    let hitIdx = -1;

    for (let i = 0; i < points.length; i++) {
      const dist = Math.hypot(sx - points[i].x, sy - points[i].y);
      if (dist <= hitRadius) {
        hitIdx = i;
        break;
      }
    }

    if (hitIdx !== -1) {
      setSelectedPointIdx(hitIdx);
      setIsDraggingPoint(true);
      lightTap();
      playClick(1.2);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      setDragOffset({
        x: points[hitIdx].x - sx,
        y: points[hitIdx].y - sy,
      });
    } else if (isFreehandDrawing) {
      // Add new point at touch location
      const newPoints = [...points, { x: sx, y: sy }].sort((a, b) => a.x - b.x);
      updateRollercoasterParams({ points: newPoints });
      lightTap();
      playClick(1.5);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDraggingPoint || selectedPointIdx === null) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;

    let targetX = sx + dragOffset.x;
    let targetY = sy + dragOffset.y;

    // Canvas boundary clamping
    targetX = Math.max(30, Math.min(rect.width - 30, targetX));
    targetY = Math.max(60, Math.min(groundLevelY - 20, targetY));

    // Keep points horizontally ordered
    const updated = points.map((p, idx) => {
      if (idx === selectedPointIdx) {
        return { x: targetX, y: targetY };
      }
      return p;
    });

    // Enforce horizontal ordering
    updated.sort((a, b) => a.x - b.x);
    updateRollercoasterParams({ points: updated });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsDraggingPoint(false);
  };

  // High performance Canvas 2D render loop
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

      // 1. Sky & Atmospheric Backdrop
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, width, height);

      // Horizon grid
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      for (let y = 80; y < groundLevelY; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. Definite Integral Area Fill (Representing "Paint Used")
      if (showPaintArea && splineSamples.length > 1) {
        // Gradient fill for paint under the curve from x=0 to current cart position
        const paintGrad = ctx.createLinearGradient(0, 100, 0, groundLevelY);
        paintGrad.addColorStop(0, 'rgba(56, 189, 248, 0.45)');
        paintGrad.addColorStop(0.7, 'rgba(56, 189, 248, 0.15)');
        paintGrad.addColorStop(1, 'rgba(56, 189, 248, 0.02)');

        ctx.beginPath();
        ctx.moveTo(splineSamples[0].x, groundLevelY);
        ctx.lineTo(splineSamples[0].x, splineSamples[0].y);

        // Fill up to cart
        for (let i = 0; i < splineSamples.length; i++) {
          if (splineSamples[i].x <= currentCartState.x) {
            ctx.lineTo(splineSamples[i].x, splineSamples[i].y);
          } else {
            break;
          }
        }

        ctx.lineTo(currentCartState.x, groundLevelY);
        ctx.closePath();
        ctx.fillStyle = paintGrad;
        ctx.fill();

        // Integral Riemann vertical paint striping
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
        ctx.lineWidth = 1.5;
        for (let x = splineSamples[0].x; x <= currentCartState.x; x += 16) {
          // Find sample at x
          const s = splineSamples.find((pt) => Math.abs(pt.x - x) < 10);
          if (s) {
            ctx.beginPath();
            ctx.moveTo(x, s.y);
            ctx.lineTo(x, groundLevelY);
            ctx.stroke();
          }
        }
      }

      // 3. Structural Support Pillars (Trestle Lattice)
      points.forEach((p, idx) => {
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x, groundLevelY);
        ctx.stroke();

        // Cross bracing
        for (let py = p.y + 20; py < groundLevelY - 10; py += 30) {
          ctx.beginPath();
          ctx.moveTo(p.x - 8, py);
          ctx.lineTo(p.x + 8, py + 15);
          ctx.moveTo(p.x + 8, py);
          ctx.lineTo(p.x - 8, py + 15);
          ctx.strokeStyle = '#1e293b';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // Concrete footings
        ctx.fillStyle = '#475569';
        ctx.fillRect(p.x - 10, groundLevelY - 8, 20, 8);
      });

      // 4. Ground Foundation
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, groundLevelY, width, height - groundLevelY);
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, groundLevelY);
      ctx.lineTo(width, groundLevelY);
      ctx.stroke();

      // Floor turf grass line
      ctx.fillStyle = '#059669';
      ctx.fillRect(0, groundLevelY, width, 4);

      // 5. Curvature Comb Visualizer (2nd Derivative κ)
      if (showCurvatureComb && splineSamples.length > 2) {
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(244, 63, 94, 0.4)';
        for (let i = 0; i < splineSamples.length; i += 4) {
          const pt = splineSamples[i];
          const normalScale = pt.curvature * 800; // scaled for visibility
          const normAngle = Math.atan(-pt.slope) + Math.PI / 2;
          const nx = pt.x + Math.cos(normAngle) * normalScale;
          const ny = pt.y + Math.sin(normAngle) * normalScale;

          ctx.beginPath();
          ctx.moveTo(pt.x, pt.y);
          ctx.lineTo(nx, ny);
          ctx.stroke();
        }
      }

      // 6. The Spline Rollercoaster Track Steel Rails
      if (splineSamples.length > 1) {
        // Lower structural steel tube
        ctx.beginPath();
        ctx.moveTo(splineSamples[0].x, splineSamples[0].y + 5);
        for (let i = 1; i < splineSamples.length; i++) {
          ctx.lineTo(splineSamples[i].x, splineSamples[i].y + 5);
        }
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 6;
        ctx.stroke();

        // Upper glowing rail
        ctx.beginPath();
        ctx.moveTo(splineSamples[0].x, splineSamples[0].y);
        for (let i = 1; i < splineSamples.length; i++) {
          ctx.lineTo(splineSamples[i].x, splineSamples[i].y);
        }
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3.5;
        ctx.shadowColor = '#0284c7';
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Track crossties
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 2;
        for (let i = 0; i < splineSamples.length; i += 3) {
          const pt = splineSamples[i];
          ctx.beginPath();
          ctx.moveTo(pt.x, pt.y - 2);
          ctx.lineTo(pt.x, pt.y + 6);
          ctx.stroke();
        }
      }

      // 7. Instantaneous 1st Derivative Tangent Line at Cart Position
      if (showTangents) {
        const tLen = 42;
        const angle = Math.atan(-currentCartState.slope); // screen coords
        const tx1 = currentCartState.x - Math.cos(angle) * tLen;
        const ty1 = currentCartState.y - Math.sin(angle) * tLen;
        const tx2 = currentCartState.x + Math.cos(angle) * tLen;
        const ty2 = currentCartState.y + Math.sin(angle) * tLen;

        ctx.beginPath();
        ctx.moveTo(tx1, ty1);
        ctx.lineTo(tx2, ty2);
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2.5;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Tangent slope badge
        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 10px monospace';
        ctx.fillText(`f'(x) = ${currentCartState.slope.toFixed(2)}`, currentCartState.x - 25, currentCartState.y - 32);
      }

      // 8. The Rollercoaster Cart Body & Passengers
      const cartX = currentCartState.x;
      const cartY = currentCartState.y;
      const trackAngle = Math.atan(-currentCartState.slope);

      ctx.save();
      ctx.translate(cartX, cartY);
      ctx.rotate(trackAngle);

      // Cart wheels
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(-11, 2, 4, 0, Math.PI * 2);
      ctx.arc(11, 2, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Cart chassis
      ctx.fillStyle = currentCartState.gForce > 2.8 ? '#ef4444' : '#10b981';
      ctx.beginPath();
      ctx.roundRect(-15, -12, 30, 12, [3, 3, 1, 1]);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Passenger helmet heads
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(-5, -15, 3.5, 0, Math.PI * 2);
      ctx.arc(5, -15, 3.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // 9. Interactive Control Points (Bézier Handles)
      points.forEach((p, idx) => {
        const isSelected = selectedPointIdx === idx;
        ctx.beginPath();
        ctx.arc(p.x, p.y, isSelected ? 9 : 7, 0, Math.PI * 2);
        ctx.fillStyle = isSelected ? '#38bdf8' : '#0284c7';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Control point index label
        ctx.fillStyle = '#94a3b8';
        ctx.font = 'bold 9px monospace';
        ctx.fillText(`P${idx + 1}`, p.x - 7, p.y - 12);
      });

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [
    points,
    splineSamples,
    currentCartState,
    selectedPointIdx,
    showTangents,
    showPaintArea,
    showCurvatureComb,
    groundLevelY,
  ]);

  return (
    <div
      ref={containerRef}
      className="relative w-full flex-1 min-h-0 h-full overflow-hidden flex flex-col bg-slate-950"
    >
      {/* 2D Interactive Track Canvas */}
      <div className="relative w-full h-full flex-1">
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="w-full h-full touch-none cursor-pointer select-none"
        />

        {/* Progressive Challenge Manager */}
        <ChallengeManager
          simulatorId="rollercoaster-architect"
          simulatorTitle="Rollercoaster Architect: Derivatives & Integrals"
          levels={[
            {
              levelNumber: 1,
              title: 'Level 1: Gentle Coaster (Safe G-Forces)',
              badge: 'Safe Curvature',
              description: 'Design a smooth descent where maximum G-force never exceeds 2.5G throughout the entire run.',
              requirementFormula: 'κ(x) = |f\'\'|/(1+f\'²)³/² · G < 2.5',
              targetCriteria: 'Smooth the curvature handles until warning disappears and cart clears run',
              xpReward: 40,
              autoPreset: () => {
                updateRollercoasterParams({
                  points: [
                    { x: 50, y: 130 },
                    { x: 220, y: 260 },
                    { x: 420, y: 220 },
                    { x: 580, y: 270 },
                    { x: 720, y: 210 },
                  ],
                });
                setCartDistanceTravelled(0);
                setMaxTrackSpeed(0);
              },
            },
            {
              levelNumber: 2,
              title: 'Level 2: The 20 m/s Speed Threshold',
              badge: '1st Derivative v',
              description: 'Sculpt the initial hill drop to achieve maximum speed of exactly 20 m/s (±1.5 m/s).',
              requirementFormula: 'v = √(2gΔh) = 20 m/s · f\'(x) steep drop',
              targetCriteria: 'Reach apex drop height where top speed clocks 20 m/s',
              xpReward: 50,
              autoPreset: () => {
                updateRollercoasterParams({
                  points: [
                    { x: 50, y: 90 },
                    { x: 200, y: 330 },
                    { x: 380, y: 170 },
                    { x: 540, y: 290 },
                    { x: 720, y: 220 },
                  ],
                });
                setCartDistanceTravelled(0);
                setMaxTrackSpeed(0);
              },
            },
            {
              levelNumber: 3,
              title: 'Level 3: Paint Budget Optimization (Definite Integral)',
              badge: 'Minimal Paint ∫',
              description: 'Achieve max speed 20 m/s while restricting total support paint area ∫f(x)dx below 500 sq units.',
              requirementFormula: 'Area = ∫[0,L] f(x)dx < 500 u² · v_max ≈ 20 m/s',
              targetCriteria: 'Speed ≈ 20 m/s AND Paint Area < 500 u²',
              xpReward: 60,
              autoPreset: () => {
                updateRollercoasterParams({
                  challengeActive: true,
                  points: [
                    { x: 50, y: 140 },
                    { x: 220, y: 310 },
                    { x: 420, y: 220 },
                    { x: 590, y: 300 },
                    { x: 720, y: 250 },
                  ],
                });
                setCartDistanceTravelled(0);
                setMaxTrackSpeed(0);
              },
            },
          ]}
          onTriggerPreset={(lvl) => {
            if (lvl === 1) {
              updateRollercoasterParams({
                points: [
                  { x: 50, y: 130 },
                  { x: 220, y: 260 },
                  { x: 420, y: 220 },
                  { x: 580, y: 270 },
                  { x: 720, y: 210 },
                ],
              });
            } else if (lvl === 2) {
              updateRollercoasterParams({
                points: [
                  { x: 50, y: 90 },
                  { x: 200, y: 330 },
                  { x: 380, y: 170 },
                  { x: 540, y: 290 },
                  { x: 720, y: 220 },
                ],
              });
            } else if (lvl === 3) {
              updateRollercoasterParams({
                challengeActive: true,
                points: [
                  { x: 50, y: 140 },
                  { x: 220, y: 310 },
                  { x: 420, y: 220 },
                  { x: 590, y: 300 },
                  { x: 720, y: 250 },
                ],
              });
            }
            setCartDistanceTravelled(0);
            setMaxTrackSpeed(0);
          }}
        />

        {/* Real-Time Calculus Telemetry Panel (Top-Right HUD) */}
        {!isZenMode && (
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3 max-w-[200px] sm:max-w-[260px] bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-2 sm:p-2.5 rounded-xl text-xs space-y-1 shadow-xl pointer-events-none transition-all z-10">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">
                Calculus Telemetry
              </span>
              <div className="flex items-center gap-1">
                <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-mono font-bold text-cyan-400 tabular-nums">
                  {currentSpeed} m/s
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">1st Deriv f'(x)</span>
              <span
                className={`font-mono font-bold tabular-nums ${
                  Math.abs(currentSlope) > 1.2 ? 'text-amber-400' : 'text-slate-300'
                }`}
              >
                {currentSlope > 0 ? `+${currentSlope.toFixed(2)}` : currentSlope.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">2nd Deriv (G)</span>
              <span
                className={`font-mono font-bold tabular-nums ${
                  currentGForce > 3.0 ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                {currentGForce.toFixed(2)} G
              </span>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-800">
              <span className="text-slate-400 flex items-center gap-1">
                <Paintbrush className="w-3 h-3 text-cyan-400" />
                <span>Integral Area</span>
              </span>
              <span className="font-mono font-bold text-cyan-300 tabular-nums">
                {paintAreaUsed} / {totalIntegralPaintArea} u²
              </span>
            </div>

            {/* High G-Force Warning */}
            {currentGForce > 3.0 && (
              <div className="pt-1 flex items-center gap-1.5 text-rose-400 font-bold text-[11px] animate-pulse">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>Extreme G-Force!</span>
              </div>
            )}

            {/* Challenge Success Banner */}
            {challengeSuccess && (
              <div className="pt-1 flex items-center gap-1.5 text-emerald-400 font-bold text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Challenge Cleared! (+60 XP)</span>
              </div>
            )}
          </div>
        )}

        {/* Floating Play / Reset / Draw Mode Action Deck (Bottom-Left) */}
        <div className="absolute bottom-14 sm:bottom-16 left-3 sm:left-4 z-20 flex flex-wrap items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => updateRollercoasterParams({ isPlaying: !isPlaying })}
            className={`min-h-[44px] px-4 py-2 rounded-full font-bold text-xs shadow-xl active:scale-95 transition-all flex items-center gap-1.5 touch-manipulation ${
              isPlaying
                ? 'bg-slate-800 text-slate-200 border border-slate-700'
                : 'bg-cyan-500 text-slate-950 shadow-cyan-500/25'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isPlaying ? 'Pause Cart' : 'Launch Cart'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setCartDistanceTravelled(0);
              setMaxTrackSpeed(0);
            }}
            className="min-h-[44px] px-3.5 py-2 rounded-full bg-slate-900/90 text-slate-300 border border-slate-800 hover:bg-slate-800 text-xs font-semibold flex items-center gap-1 touch-manipulation shadow-md"
            aria-label="Restart cart from apex"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restart Run</span>
          </button>

          <button
            type="button"
            onClick={() => {
              // Add a new point between midpoints
              if (points.length < 8) {
                const midX = (points[points.length - 2].x + points[points.length - 1].x) / 2;
                const midY = (points[points.length - 2].y + points[points.length - 1].y) / 2;
                const newPts = [...points, { x: midX, y: midY }].sort((a, b) => a.x - b.x);
                updateRollercoasterParams({ points: newPts });
              }
            }}
            disabled={points.length >= 8}
            className="min-h-[44px] px-3 py-2 rounded-full bg-slate-900/90 text-cyan-300 border border-slate-800 hover:bg-slate-800 text-xs font-semibold flex items-center gap-1 touch-manipulation disabled:opacity-40"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Point</span>
          </button>
        </div>

        {/* Mobile Touch Affordance Hint */}
        <div className="absolute top-3 left-3 pointer-events-none hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 backdrop-blur-sm">
          <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
          <span>Touch & drag any circle handle (P1..P5) to reshape the track</span>
        </div>
      </div>

      {/* Mobile Collapsible Bottom Sheet - Rollercoaster Calculus */}
      <BottomSheet
        title="The Rollercoaster Architect: Calculus in Motion"
        badgeLabel={`v = ${currentSpeed} m/s · Area = ${totalIntegralPaintArea} u²`}
        quickEquation={`f'(x) = ${currentSlope.toFixed(2)} · ∫f(x)dx = ${totalIntegralPaintArea} u²`}
        onReset={() => resetParams('rollercoaster-architect')}
        theoryContent={
          <CoachTheoryModule
            simulatorId="rollercoaster-architect"
            extraLiveDetails={
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-xl bg-cyan-950/30 border border-cyan-800/40">
                    <span className="text-[10px] text-cyan-300 block font-semibold">Speed v:</span>
                    <span className="font-mono text-white font-bold">{currentSpeed} m/s</span>
                  </div>
                  <div className="p-2 rounded-xl bg-amber-950/30 border border-amber-800/40">
                    <span className="text-[10px] text-amber-300 block font-semibold">1st Deriv f'(x):</span>
                    <span className="font-mono text-white font-bold">{currentSlope.toFixed(2)}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-rose-950/30 border border-rose-800/40">
                    <span className="text-[10px] text-rose-300 block font-semibold">G-Force (f''):</span>
                    <span className="font-mono text-white font-bold">{currentCartState.gForce.toFixed(2)} G</span>
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800 text-center font-mono text-xs text-emerald-300">
                  Definite Integral Area ∫ f(x)dx = {totalIntegralPaintArea} u²
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
                Class 12 Architectural Challenges
              </span>
              <p className="text-slate-300">
                Meet exact calculus constraints on maximum track speed and total structural paint area.
              </p>
            </div>

            <div className="space-y-2">
              <div
                className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
                  challengeCompleted['rollercoaster_challenge_20mps']
                    ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="font-semibold text-white">The Precision Architect Mission</div>
                  <div className="text-[11px] text-slate-400">
                    Target: Max Speed = 20 m/s (±1.5) AND Total Paint Area &lt; 500 u².
                  </div>
                  <div className="text-[10px] font-mono text-cyan-300 mt-0.5">
                    Current: Max Speed = {maxTrackSpeed.toFixed(1)} m/s · Paint = {totalIntegralPaintArea} u²
                  </div>
                </div>
                {challengeCompleted['rollercoaster_challenge_20mps'] ? (
                  <span className="flex items-center gap-1 font-bold text-emerald-400 text-xs">
                    <CheckCircle2 className="w-4 h-4" />
                    +60 XP
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      updateRollercoasterParams({
                        challengeActive: true,
                        points: [
                          { x: 50, y: 140 },
                          { x: 220, y: 310 },
                          { x: 420, y: 220 },
                          { x: 590, y: 300 },
                          { x: 720, y: 250 },
                        ],
                      });
                      setCartDistanceTravelled(0);
                      setMaxTrackSpeed(0);
                    }}
                    className="text-xs font-mono text-amber-400 bg-amber-950/60 px-2 py-1 rounded border border-amber-800/40"
                  >
                    Load Challenge
                  </button>
                )}
              </div>
            </div>
          </div>
        }
      >
        {/* Controls Tab */}
        <div className="space-y-3">
          {/* Point 1 & 5: Live Substitution Card for Energy/Slope */}
          <LiveSubstitutionCard
            title="Spline Dynamics"
            badge="Calculus"
            symbolicLaw="v(s) = \sqrt{2g \cdot \Delta h - \mu \cdot s}, \quad \text{slope} = f'(x)"
            substitutedLatex={`v = \\sqrt{2 \\cdot ${gravity} \\cdot \\Delta h - ${friction} \\cdot ${cartDistanceTravelled.toFixed(0)}}`}
            evaluatedLatex={`v = ${currentSpeed.toFixed(1)}\\text{ px/s}, \\quad f'(x) = ${currentSlope.toFixed(3)}, \\quad G = ${currentGForce.toFixed(1)}`}
            activeTerm={isPlaying ? `G-Force: ${currentGForce.toFixed(1)}` : undefined}
          />
          <TouchSlider
            label="World Gravity (g)"
            min={4.0}
            max={18.0}
            step={0.5}
            unit="m/s²"
            value={gravity}
            onChange={(val) => updateRollercoasterParams({ gravity: val })}
          />

          {/* Display & Analysis Toggles */}
          <div className="pt-2 border-t border-slate-800/80 grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => updateRollercoasterParams({ showTangents: !showTangents })}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-colors ${
                showTangents
                  ? 'bg-amber-950/50 border-amber-700 text-amber-300'
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
            >
              <span>Tangents f'(x)</span>
            </button>

            <button
              type="button"
              onClick={() => updateRollercoasterParams({ showCurvatureComb: !showCurvatureComb })}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-colors ${
                showCurvatureComb
                  ? 'bg-rose-950/50 border-rose-700 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
            >
              <span>Curvature κ</span>
            </button>

            <button
              type="button"
              onClick={() => updateRollercoasterParams({ showPaintArea: !showPaintArea })}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-colors ${
                showPaintArea
                  ? 'bg-cyan-950/50 border-cyan-700 text-cyan-300'
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
            >
              <span>Paint ∫f(x)dx</span>
            </button>
          </div>

          {/* Point Coordinate Tuning */}
          <div className="pt-2 border-t border-slate-800/80">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Preset Track Topologies
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  updateRollercoasterParams({
                    points: [
                      { x: 50, y: 100 },
                      { x: 200, y: 340 },
                      { x: 380, y: 140 },
                      { x: 540, y: 310 },
                      { x: 720, y: 220 },
                    ],
                  });
                  setCartDistanceTravelled(0);
                  setMaxTrackSpeed(0);
                }}
                className="py-2 px-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-medium text-cyan-300 border border-slate-700/60"
              >
                Double Dip
              </button>

              <button
                type="button"
                onClick={() => {
                  updateRollercoasterParams({
                    points: [
                      { x: 50, y: 80 },
                      { x: 240, y: 350 },
                      { x: 440, y: 310 },
                      { x: 580, y: 280 },
                      { x: 720, y: 240 },
                    ],
                  });
                  setCartDistanceTravelled(0);
                  setMaxTrackSpeed(0);
                }}
                className="py-2 px-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-medium text-emerald-300 border border-slate-700/60"
              >
                Mega Drop
              </button>

              <button
                type="button"
                onClick={() => {
                  updateRollercoasterParams({
                    points: [
                      { x: 50, y: 130 },
                      { x: 190, y: 280 },
                      { x: 350, y: 170 },
                      { x: 520, y: 270 },
                      { x: 720, y: 190 },
                    ],
                  });
                  setCartDistanceTravelled(0);
                  setMaxTrackSpeed(0);
                }}
                className="py-2 px-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-medium text-amber-300 border border-slate-700/60"
              >
                Camelback Hill
              </button>
            </div>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
};
