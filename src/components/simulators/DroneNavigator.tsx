import React, { useEffect, useRef, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import * as math from 'mathjs';
import { 
  Navigation, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  ShieldAlert, 
  RotateCcw, 
  Eye, 
  Target, 
  Crosshair,
  PackageCheck,
  Zap,
  Radio,
  Sliders
} from 'lucide-react';
import { useSimulatorStore } from '../../store/useSimulatorStore';
import { BottomSheet } from '../layout/BottomSheet';
import { TouchSlider } from '../common/TouchSlider';
import { MathFormula } from '../common/MathFormula';
import { CoachTheoryModule } from '../common/CoachTheoryModule';
import { ChallengeManager, ChallengeLevel } from '../common/ChallengeManager';
import { ScrubbableFormula } from '../common/ScrubbableFormula';
import { useHaptics } from '../../hooks/useHaptics';
import { useSound } from '../common/SoundManager';
import { useAnalytics } from '../../hooks/useAnalytics';
import { ConceptInsightBanner } from '../common/ConceptInsightBanner';
import { MistakeDoctor } from '../common/MistakeDoctor';

export const DroneNavigator: React.FC = () => {
  const {
    droneParams,
    updateDroneParams,
    resetParams,
    completeChallenge,
    challengeCompleted,
    addXp,
    isZenMode,
  } = useSimulatorStore();

  const { successBuzz, errorBuzz, lightTap } = useHaptics();
  const { playChime, playError, playClick } = useSound();
  const { trackStruggle, trackEvent } = useAnalytics();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDraggingDrone, setIsDraggingDrone] = useState(false);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDelivered, setIsDelivered] = useState(false);
  const [dropAnimationProgress, setDropAnimationProgress] = useState(1);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const breachCounterRef = useRef(0);

  // Drone and coordinate state
  const { droneX, droneY, targetX, targetY, originX, originY, noFlyZones, showRightTriangle, snapToGrid } = droneParams;

  // Math calculations using Math.js
  const deltaX = targetX - droneX;
  const deltaY = targetY - droneY;
  const deltaXFromOrigin = droneX - originX;
  const deltaYFromOrigin = droneY - originY;

  // Distance from drone to target
  const distanceToTarget = Number(math.sqrt(Number(deltaX * deltaX + deltaY * deltaY)));

  // Distance from origin to drone
  const distanceFromOrigin = Number(math.sqrt(Number(deltaXFromOrigin * deltaXFromOrigin + deltaYFromOrigin * deltaYFromOrigin)));

  // Check if drone is inside any No-Fly Zone
  const breachedZone = noFlyZones.find((zone) => {
    const distToZoneCenter = Math.hypot(droneX - zone.x, droneY - zone.y);
    return distToZoneCenter <= zone.radius;
  });

  // Delivery check when near target
  useEffect(() => {
    if (distanceToTarget <= 0.45 && !breachedZone) {
      if (!isDelivered) {
        setIsDelivered(true);
        successBuzz();
        playChime();
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#38bdf8', '#34d399', '#fbbf24'],
        });

        // Check missions
        if (targetX === 6 && targetY === 8 && !challengeCompleted['drone_345_triple']) {
          completeChallenge('drone_345_triple', 50);
          trackEvent('drone_mission_completed', { mission: 'drone_345_triple', score: 50 });
        } else if (targetX === -4 && targetY === 3 && !challengeCompleted['drone_quad2']) {
          completeChallenge('drone_quad2', 40);
          trackEvent('drone_mission_completed', { mission: 'drone_quad2', score: 40 });
        } else if (!challengeCompleted['drone_first_delivery']) {
          completeChallenge('drone_first_delivery', 30);
          trackEvent('drone_mission_completed', { mission: 'drone_first_delivery', score: 30 });
        }
      }
    } else {
      if (isDelivered) {
        setIsDelivered(false);
      }
    }
  }, [distanceToTarget, breachedZone, isDelivered, targetX, targetY, challengeCompleted, completeChallenge, successBuzz, playChime, trackEvent]);

  // Warning feedback for no fly zones
  useEffect(() => {
    if (breachedZone) {
      errorBuzz();
      playError();
      breachCounterRef.current += 1;
      setWarningMessage(`WARNING: Restricted Airspace Breached (${breachedZone.label})!`);

      if (breachCounterRef.current >= 2) {
        trackStruggle('drone-navigator', 'restricted_airspace', breachCounterRef.current, `Violated ${breachedZone.label}`);
      }
    } else {
      setWarningMessage(null);
    }
  }, [breachedZone, errorBuzz, playError, trackStruggle]);

  // Coordinate conversion helpers between Math Coordinates (-10 to +10) and Screen Pixels
  const getTransforms = useCallback((width: number, height: number) => {
    const isMobile = width < 640;
    const viewSpan = isMobile ? 18 : 22; // units visible across
    const scale = Math.min(width, height) / viewSpan;
    const cx = width / 2;
    const cy = height * 0.44;

    const mathToScreen = (mx: number, my: number) => ({
      sx: cx + mx * scale,
      sy: cy - my * scale, // invert y for Cartesian standard
    });

    const screenToMath = (sx: number, sy: number) => ({
      mx: (sx - cx) / scale,
      my: (cy - sy) / scale,
    });

    return { mathToScreen, screenToMath, scale, cx, cy };
  }, []);

  // Pointer / Touch interactions
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;

    const { mathToScreen, screenToMath, scale } = getTransforms(rect.width, rect.height);
    const droneScreen = mathToScreen(droneX, droneY);

    // Hit test radius for drone touch (minimum 44px mobile friendly hitbox)
    const touchRadius = Math.max(44, scale * 1.5);
    const distToDrone = Math.hypot(sx - droneScreen.sx, sy - droneScreen.sy);

    if (distToDrone <= touchRadius) {
      setIsDraggingDrone(true);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      const mathTouch = screenToMath(sx, sy);
      setDragOffset({
        x: droneX - mathTouch.mx,
        y: droneY - mathTouch.my,
      });
      setDropAnimationProgress(0);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDraggingDrone) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;

    const { screenToMath } = getTransforms(rect.width, rect.height);
    const mathTouch = screenToMath(sx, sy);

    let rawX = mathTouch.mx + dragOffset.x;
    let rawY = mathTouch.my + dragOffset.y;

    // Bounds clamp between -9 and +9
    rawX = Math.max(-9, Math.min(9, rawX));
    rawY = Math.max(-8, Math.min(8, rawY));

    if (snapToGrid) {
      rawX = Math.round(rawX);
      rawY = Math.round(rawY);
    } else {
      rawX = Number(rawX.toFixed(1));
      rawY = Number(rawY.toFixed(1));
    }

    updateDroneParams({ droneX: rawX, droneY: rawY });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isDraggingDrone) {
      setIsDraggingDrone(false);
      // Trigger drop-down line draw animation
      setDropAnimationProgress(0);
      let p = 0;
      const stepAnim = () => {
        p += 0.08;
        if (p < 1) {
          setDropAnimationProgress(p);
          requestAnimationFrame(stepAnim);
        } else {
          setDropAnimationProgress(1);
        }
      };
      requestAnimationFrame(stepAnim);
    }
  };

  // High performance Canvas 2D render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number = 0;
    let rotorAngle = 0;

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

      const { mathToScreen, scale } = getTransforms(width, height);
      rotorAngle += 0.35; // continuous spin for drone rotors

      // 1. Draw Grid Lines (Subtle Cartesian Matrix)
      const gridExtent = 10;
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#1e293b';

      for (let x = -gridExtent; x <= gridExtent; x++) {
        const top = mathToScreen(x, gridExtent);
        const bottom = mathToScreen(x, -gridExtent);
        ctx.beginPath();
        ctx.moveTo(top.sx, 0);
        ctx.lineTo(bottom.sx, height);
        ctx.stroke();
      }

      for (let y = -gridExtent; y <= gridExtent; y++) {
        const left = mathToScreen(-gridExtent, y);
        const right = mathToScreen(gridExtent, y);
        ctx.beginPath();
        ctx.moveTo(0, left.sy);
        ctx.lineTo(width, right.sy);
        ctx.stroke();
      }

      // 2. Quadrant Labels (Class 9 Core Curriculum)
      const qColor = 'rgba(71, 85, 105, 0.4)';
      ctx.font = 'bold 11px monospace';
      ctx.fillStyle = qColor;
      const q1 = mathToScreen(5.5, 5.5);
      const q2 = mathToScreen(-5.5, 5.5);
      const q3 = mathToScreen(-5.5, -5.5);
      const q4 = mathToScreen(5.5, -5.5);
      ctx.fillText('Q-I (+, +)', q1.sx, q1.sy);
      ctx.fillText('Q-II (-, +)', q2.sx, q2.sy);
      ctx.fillText('Q-III (-, -)', q3.sx, q3.sy);
      ctx.fillText('Q-IV (+, -)', q4.sx, q4.sy);

      // 3. Draw Main Axes (X & Y)
      const originScreen = mathToScreen(0, 0);
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2;

      // X-Axis
      ctx.beginPath();
      ctx.moveTo(0, originScreen.sy);
      ctx.lineTo(width, originScreen.sy);
      ctx.stroke();

      // Y-Axis
      ctx.beginPath();
      ctx.moveTo(originScreen.sx, 0);
      ctx.lineTo(originScreen.sx, height);
      ctx.stroke();

      // Tick Labels on Axes
      ctx.fillStyle = '#64748b';
      ctx.font = '10px monospace';
      for (let i = -8; i <= 8; i += 2) {
        if (i === 0) continue;
        const ptX = mathToScreen(i, 0);
        ctx.fillText(`${i}`, ptX.sx - 6, originScreen.sy + 14);

        const ptY = mathToScreen(0, i);
        ctx.fillText(`${i}`, originScreen.sx + 6, ptY.sy + 4);
      }

      // Origin Marker (0,0) Base Station
      ctx.beginPath();
      ctx.arc(originScreen.sx, originScreen.sy, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#38bdf8';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 10px monospace';
      ctx.fillText('Origin (0,0) Base', originScreen.sx - 48, originScreen.sy - 12);

      // 4. Draw Circular No-Fly Zones
      noFlyZones.forEach((zone) => {
        const center = mathToScreen(zone.x, zone.y);
        const radiusPx = zone.radius * scale;

        // Danger Radial gradient
        const grad = ctx.createRadialGradient(
          center.sx, center.sy, radiusPx * 0.2,
          center.sx, center.sy, radiusPx
        );
        grad.addColorStop(0, 'rgba(239, 68, 68, 0.35)');
        grad.addColorStop(1, 'rgba(239, 68, 68, 0.08)');

        ctx.beginPath();
        ctx.arc(center.sx, center.sy, radiusPx, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Warning Icon & Label
        ctx.fillStyle = '#fca5a5';
        ctx.font = 'bold 10px sans-serif';
        ctx.fillText(`⊘ ${zone.label}`, center.sx - radiusPx + 8, center.sy - radiusPx + 14);
        ctx.font = '9px monospace';
        ctx.fillStyle = '#f87171';
        ctx.fillText(`r = ${zone.radius}`, center.sx - 12, center.sy + 4);
      });

      // 5. Draw Target Coordinates (Drop-off Pad)
      const targetScreen = mathToScreen(targetX, targetY);
      const isTargetBreached = Math.hypot(droneX - targetX, droneY - targetY) <= 0.45;

      // Outer animated pulse ring
      ctx.beginPath();
      ctx.arc(targetScreen.sx, targetScreen.sy, 18, 0, Math.PI * 2);
      ctx.strokeStyle = isTargetBreached ? '#34d399' : '#fbbf24';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Target Crosshair
      ctx.beginPath();
      ctx.moveTo(targetScreen.sx - 24, targetScreen.sy);
      ctx.lineTo(targetScreen.sx + 24, targetScreen.sy);
      ctx.moveTo(targetScreen.sx, targetScreen.sy - 24);
      ctx.lineTo(targetScreen.sx, targetScreen.sy + 24);
      ctx.strokeStyle = isTargetBreached ? '#34d399' : '#f59e0b';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Pad Center
      ctx.beginPath();
      ctx.arc(targetScreen.sx, targetScreen.sy, 7, 0, Math.PI * 2);
      ctx.fillStyle = isTargetBreached ? '#10b981' : '#f59e0b';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = isTargetBreached ? '#34d399' : '#fbbf24';
      ctx.font = 'bold 11px monospace';
      ctx.fillText(`Target (${targetX}, ${targetY})`, targetScreen.sx + 14, targetScreen.sy - 8);

      // 6. Right-Angled Triangle & Distance Hypotenuse Decomposition
      const droneScreen = mathToScreen(droneX, droneY);
      const progress = isDraggingDrone ? 1 : dropAnimationProgress;

      if (showRightTriangle && (droneX !== originX || droneY !== originY)) {
        // Corner right-angle point (droneX, originY)
        const cornerScreen = mathToScreen(droneX, originY);

        // Interpolated current drone tip for drop animation
        const currentTip = {
          sx: originScreen.sx + (droneScreen.sx - originScreen.sx) * progress,
          sy: originScreen.sy + (droneScreen.sy - originScreen.sy) * progress,
        };

        // Horizontal Leg Δx = |x₂ - x₁|
        ctx.beginPath();
        ctx.moveTo(originScreen.sx, originScreen.sy);
        ctx.lineTo(cornerScreen.sx, cornerScreen.sy);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Horizontal Leg Label
        if (Math.abs(droneX - originX) > 0.8) {
          ctx.fillStyle = '#38bdf8';
          ctx.font = 'bold 10px monospace';
          const midX = (originScreen.sx + cornerScreen.sx) / 2;
          ctx.fillText(`Δx = ${Math.abs(droneX - originX)}`, midX - 18, originScreen.sy + (droneY >= 0 ? 16 : -8));
        }

        // Vertical Leg Δy = |y₂ - y₁|
        ctx.beginPath();
        ctx.moveTo(cornerScreen.sx, cornerScreen.sy);
        ctx.lineTo(cornerScreen.sx, currentTip.sy);
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Vertical Leg Label
        if (Math.abs(droneY - originY) > 0.8) {
          ctx.fillStyle = '#10b981';
          ctx.font = 'bold 10px monospace';
          const midY = (cornerScreen.sy + currentTip.sy) / 2;
          ctx.fillText(`Δy = ${Math.abs(droneY - originY)}`, cornerScreen.sx + (droneX >= 0 ? 8 : -44), midY);
        }

        // Right-Angle Square Indicator
        if (Math.abs(droneX - originX) > 0.8 && Math.abs(droneY - originY) > 0.8) {
          const size = 10;
          const sX = droneX >= originX ? 1 : -1;
          const sY = droneY >= originY ? -1 : 1;
          ctx.beginPath();
          ctx.moveTo(cornerScreen.sx - sX * size, cornerScreen.sy);
          ctx.lineTo(cornerScreen.sx - sX * size, cornerScreen.sy + sY * size);
          ctx.lineTo(cornerScreen.sx, cornerScreen.sy + sY * size);
          ctx.strokeStyle = '#94a3b8';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // Hypotenuse Vector (Origin to Drone)
        ctx.beginPath();
        ctx.moveTo(originScreen.sx, originScreen.sy);
        ctx.lineTo(currentTip.sx, currentTip.sy);
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#f43f5e';
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Hypotenuse Distance Label
        if (distanceFromOrigin > 0.8) {
          const midHypX = (originScreen.sx + currentTip.sx) / 2;
          const midHypY = (originScreen.sy + currentTip.sy) / 2;
          ctx.fillStyle = '#f43f5e';
          ctx.font = 'bold 11px monospace';
          ctx.fillText(`d = ${distanceFromOrigin.toFixed(2)}`, midHypX - 10, midHypY - 10);
        }
      }

      // 7. Draw the Quadcopter Drone Sprite
      const droneRadius = Math.max(16, scale * 0.8);
      const isBreached = !!breachedZone;

      // Drone Shadow on ground
      ctx.beginPath();
      ctx.ellipse(droneScreen.sx, droneScreen.sy + 8, droneRadius, droneRadius * 0.45, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.fill();

      // Drone X-Frame Arms
      ctx.strokeStyle = isBreached ? '#ef4444' : '#64748b';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(droneScreen.sx - droneRadius, droneScreen.sy - droneRadius);
      ctx.lineTo(droneScreen.sx + droneRadius, droneScreen.sy + droneRadius);
      ctx.moveTo(droneScreen.sx - droneRadius, droneScreen.sy + droneRadius);
      ctx.lineTo(droneScreen.sx + droneRadius, droneScreen.sy - droneRadius);
      ctx.stroke();

      // 4 Spinning Rotors
      const rotorPositions = [
        { x: droneScreen.sx - droneRadius, y: droneScreen.sy - droneRadius, color: '#38bdf8' },
        { x: droneScreen.sx + droneRadius, y: droneScreen.sy - droneRadius, color: '#38bdf8' },
        { x: droneScreen.sx - droneRadius, y: droneScreen.sy + droneRadius, color: '#34d399' },
        { x: droneScreen.sx + droneRadius, y: droneScreen.sy + droneRadius, color: '#34d399' },
      ];

      rotorPositions.forEach((rotor, idx) => {
        // Rotor blade disc
        ctx.beginPath();
        ctx.arc(rotor.x, rotor.y, 8, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
        ctx.fill();
        ctx.strokeStyle = rotor.color;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Spinning blade line
        const rAng = rotorAngle * (idx % 2 === 0 ? 1 : -1);
        ctx.beginPath();
        ctx.moveTo(rotor.x - Math.cos(rAng) * 9, rotor.y - Math.sin(rAng) * 9);
        ctx.lineTo(rotor.x + Math.cos(rAng) * 9, rotor.y + Math.sin(rAng) * 9);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      // Drone Central Fuselage Pod
      ctx.beginPath();
      ctx.arc(droneScreen.sx, droneScreen.sy, 9, 0, Math.PI * 2);
      ctx.fillStyle = isBreached ? '#ef4444' : isDelivered ? '#10b981' : '#0284c7';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Package Payload Box Hanging Beneath
      ctx.fillStyle = isDelivered ? '#10b981' : '#f59e0b';
      ctx.fillRect(droneScreen.sx - 5, droneScreen.sy - 5, 10, 10);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.strokeRect(droneScreen.sx - 5, droneScreen.sy - 5, 10, 10);

      // Real-Time Floating Coordinate Badge directly above drone
      const tagText = `Drone (${droneX}, ${droneY})`;
      ctx.font = 'bold 10px monospace';
      const textWidth = ctx.measureText(tagText).width;

      ctx.fillStyle = isBreached ? 'rgba(239, 68, 68, 0.9)' : 'rgba(15, 23, 42, 0.9)';
      ctx.strokeStyle = isBreached ? '#f87171' : '#38bdf8';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(droneScreen.sx - textWidth / 2 - 6, droneScreen.sy - droneRadius - 26, textWidth + 12, 18, 5);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = isBreached ? '#ffffff' : '#38bdf8';
      ctx.fillText(tagText, droneScreen.sx - textWidth / 2, droneScreen.sy - droneRadius - 13);

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
    droneX,
    droneY,
    targetX,
    targetY,
    originX,
    originY,
    noFlyZones,
    showRightTriangle,
    isDraggingDrone,
    dropAnimationProgress,
    breachedZone,
    isDelivered,
    distanceFromOrigin,
    getTransforms,
  ]);

  return (
    <div className="relative w-full h-[calc(100vh-52px-56px)] md:h-[calc(100vh-52px)] overflow-hidden flex flex-col bg-slate-950">
      {/* 2D Interactive Grid Map Stage */}
      <div className="relative w-full h-full flex-1">
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
        />

        {/* Real-time Pedagogical Concept Insight Banner */}
        <ConceptInsightBanner
          conceptTitle="Distance Formula: The Hidden Right Triangle"
          mathInsight={`d = √((Δx)² + (Δy)²) = √(${Math.abs(droneX - originX)}² + ${Math.abs(droneY - originY)}²) = √(${Math.pow(droneX - originX, 2) + Math.pow(droneY - originY, 2)}) = ${distanceFromOrigin.toFixed(2)} u.`}
          eli10Analogy={`Walking along city streets would take ${Math.abs(droneX - originX)} blocks East/West + ${Math.abs(droneY - originY)} blocks North/South = ${Math.abs(droneX - originX) + Math.abs(droneY - originY)} blocks. Flying the straight diagonal takes only ${distanceFromOrigin.toFixed(2)} blocks (saving ${(Math.abs(droneX - originX) + Math.abs(droneY - originY) - distanceFromOrigin).toFixed(1)} blocks)!`}
          liveFeedback={
            breachedZone
              ? `⚠️ Airspace breach: ${breachedZone.label}! Maintain safe distance > ${breachedZone.radius}u.`
              : isDelivered
              ? '🎉 Package Delivered cleanly to landing pad!'
              : `Current position (${droneX}, ${droneY}). Distance to Target = ${distanceToTarget.toFixed(2)}u.`
          }
          quickAction={{
            label: "Alka Ma'am's 6-8-10 Pythagorean Landmark",
            onApply: () => updateDroneParams({ targetX: 6, targetY: 8, droneX: 6, droneY: 8 }),
          }}
        />

        {/* Real-time Mistake Doctor: Restricted Airspace Diagnosis */}
        <MistakeDoctor
          isActive={!!breachedZone}
          blunderTitle={`Airspace Violation: ${breachedZone?.label || 'Radar Station'}`}
          whatHappened={`Drone entered restricted circular zone centered at (${breachedZone?.x}, ${breachedZone?.y}) with radius ${breachedZone?.radius}u.`}
          examTrap="Students often calculate distance to the axes instead of distance to the circle's center! The equation of a circle is (x - h)² + (y - k)² = R². If the point has distance d < R, it has violated the airspace!"
          prescription="Fly around the circular perimeter! Maintain direct distance d = √((x - h)² + (y - k)²) ≥ R from the radar antenna."
          remedyLabel="Apply Alka Ma'am's Safe Waypoint (3, 8)"
          onApplyRemedy={() => updateDroneParams({ droneX: 3, droneY: 8 })}
        />

        {/* Dynamic Real-Time HUD Overlay (Top-Right) */}
        {!isZenMode && (
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3 max-w-[190px] sm:max-w-[230px] bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-2 sm:p-2.5 rounded-xl text-xs space-y-1 sm:space-y-1.5 shadow-xl pointer-events-none z-10">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-medium text-[11px]">Position</span>
              <span className="font-bold text-cyan-400 font-mono text-[11px] sm:text-xs">
                ({droneX}, {droneY})
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Dist Base</span>
              <span className="font-mono tabular-nums text-rose-300 font-bold">
                {distanceFromOrigin.toFixed(1)} u
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Dist Target</span>
              <span className="font-mono tabular-nums text-amber-300 font-bold">
                {distanceToTarget.toFixed(1)} u
              </span>
            </div>

            {/* Delivery Status Indicator */}
            {isDelivered && (
              <div className="pt-1 border-t border-slate-800 flex items-center gap-1.5 text-emerald-400 font-bold text-[11px]">
                <PackageCheck className="w-3.5 h-3.5" />
                <span>Target Delivered (+50 XP)!</span>
              </div>
            )}
          </div>
        )}

        {/* Progressive Challenge Manager Modal & Pill */}
        <ChallengeManager
          simulatorId="drone-navigator"
          simulatorTitle="Drone Navigator: Coordinate Distance"
          levels={[
            {
              levelNumber: 1,
              title: 'First Flight: Deliver to Target Zone',
              badge: 'Target Drop',
              description: 'Navigate the delivery drone from origin (0,0) to target coordinates (6,8) without entering restricted airspace.',
              requirementFormula: 'd = √((6 - 0)² + (8 - 0)²) = √(36 + 64) = 10.0 u',
              targetCriteria: 'Arrive within 0.7 units of target (6, 8)',
              xpReward: 40,
              autoPreset: () => updateDroneParams({ droneX: 6, droneY: 8 }),
            },
            {
              levelNumber: 2,
              title: 'Pythagorean Triple Maneuver',
              badge: '3-4-5 Geometry',
              description: 'Position drone at (3, 4) to verify the classic 3-4-5 right triangle hypotenuse ratio.',
              requirementFormula: 'c = √(3² + 4²) = 5.0 u',
              targetCriteria: 'Set position exactly at (3, 4) where distance from origin = 5.0 units',
              xpReward: 50,
              autoPreset: () => updateDroneParams({ droneX: 3, droneY: 4 }),
            },
            {
              levelNumber: 3,
              title: 'No-Fly Zone Perimeter Bypass',
              badge: 'Obstacle Evasion',
              description: 'Reach deep quadrant (9, 10) while maintaining distance > 2.5u from Radar Station at (3, 4).',
              requirementFormula: 'dist(Drone, NFZ) > radius = 2.5 u',
              targetCriteria: 'Fly to (9, 10) with 0 airspace breaches',
              xpReward: 60,
              autoPreset: () => updateDroneParams({ droneX: 9, droneY: 10 }),
            },
          ]}
          onTriggerPreset={(lvl) => {
            if (lvl === 1) updateDroneParams({ droneX: 6, droneY: 8 });
            else if (lvl === 2) updateDroneParams({ droneX: 3, droneY: 4 });
            else if (lvl === 3) updateDroneParams({ droneX: 9, droneY: 10 });
          }}
        />

        {/* Airspace Breach Alert Banner */}
        {warningMessage && (
          <div className="absolute top-3 left-3 right-auto max-w-[320px] bg-rose-950/90 border border-rose-500/80 text-rose-200 px-3 py-2 rounded-xl text-xs flex items-center gap-2 shadow-2xl backdrop-blur-md animate-pulse">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="font-semibold">{warningMessage}</span>
          </div>
        )}

        {/* Mobile Drag Instruction Affordance */}
        <div className="absolute bottom-28 left-4 z-30 pointer-events-none hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 backdrop-blur-sm">
          <Navigation className="w-3.5 h-3.5 text-cyan-400" />
          <span>Touch & drag drone sprite to deliver package</span>
        </div>
      </div>

      {/* Mobile Collapsible Bottom Sheet - Mission Control */}
      <BottomSheet
        title="Drone Mission Control: Distance Formula"
        badgeLabel={`d = ${distanceFromOrigin.toFixed(2)} u`}
        quickEquation={`d = \\sqrt{${Math.abs(droneX)}^2 + ${Math.abs(droneY)}^2} = ${distanceFromOrigin.toFixed(2)}`}
        onReset={() => resetParams('drone-navigator')}
        theoryContent={
          <CoachTheoryModule
            simulatorId="drone-navigator"
            extraLiveDetails={
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-400">Live Drone Coordinate:</span>
                  <span className="font-mono text-cyan-300 font-bold">({droneX}, {droneY})</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 rounded-xl bg-sky-950/30 border border-sky-800/40">
                    <span className="text-sky-300 font-semibold block">Horizontal Run (Δx):</span>
                    <span className="font-mono text-white text-xs">{Math.abs(droneX - originX)} units</span>
                  </div>
                  <div className="p-2 rounded-xl bg-emerald-950/30 border border-emerald-800/40">
                    <span className="text-emerald-300 font-semibold block">Vertical Rise (Δy):</span>
                    <span className="font-mono text-white text-xs">{Math.abs(droneY - originY)} units</span>
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 text-center font-mono text-xs text-amber-300">
                  d² = {Math.abs(droneX - originX)}² + {Math.abs(droneY - originY)}² = {Math.pow(Math.abs(droneX - originX), 2) + Math.pow(Math.abs(droneY - originY), 2)} ⟹ d = {distanceFromOrigin.toFixed(2)} u
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
                Class 9 Flight Missions
              </span>
              <p className="text-slate-300">
                Fly your drone to specific landing targets, avoiding radar no-fly zones along the way.
              </p>
            </div>

            <div className="space-y-2">
              <div
                className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
                  challengeCompleted['drone_345_triple']
                    ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="font-semibold text-white">Mission 1: The 6-8-10 Delivery</div>
                  <div className="text-[11px] text-slate-400">
                    Fly to Target (6, 8). Verify distance from base is exactly 10.0 units!
                  </div>
                </div>
                {challengeCompleted['drone_345_triple'] ? (
                  <span className="flex items-center gap-1 font-bold text-emerald-400 text-xs">
                    <CheckCircle2 className="w-4 h-4" />
                    +50 XP
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => updateDroneParams({ targetX: 6, targetY: 8 })}
                    className="text-xs font-mono text-amber-400 bg-amber-950/60 px-2 py-1 rounded border border-amber-800/40"
                  >
                    Set Target (6,8)
                  </button>
                )}
              </div>

              <div
                className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
                  challengeCompleted['drone_quad2']
                    ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="font-semibold text-white">Mission 2: Quadrant II Clinic Delivery</div>
                  <div className="text-[11px] text-slate-400">
                    Set target to (-4, 3) and bypass Hospital Helipad radar (d = 5.0 units).
                  </div>
                </div>
                {challengeCompleted['drone_quad2'] ? (
                  <span className="flex items-center gap-1 font-bold text-emerald-400 text-xs">
                    <CheckCircle2 className="w-4 h-4" />
                    +40 XP
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => updateDroneParams({ targetX: -4, targetY: 3 })}
                    className="text-xs font-mono text-amber-400 bg-amber-950/60 px-2 py-1 rounded border border-amber-800/40"
                  >
                    Set Target (-4,3)
                  </button>
                )}
              </div>
            </div>
          </div>
        }
      >
        {/* Controls Tab */}
        <div className="space-y-3">
          {/* Priority 3 Pedagogy: Scrubbable Math Formula Two-Way Binding */}
          <ScrubbableFormula
            title="Two-Way Distance Formula (Scrub directly in math)"
            equationLatexTemplate={(p) => {
              const x = p.targetX ?? targetX;
              const y = p.targetY ?? targetY;
              const d = Math.sqrt(x * x + y * y);
              return `d = \\sqrt{(${x})^2 + (${y})^2} = \\sqrt{${x * x} + ${y * y}} = ${d.toFixed(2)} \\text{ u}`;
            }}
            parameters={[
              {
                id: 'targetX',
                symbol: 'x_2',
                name: 'Target X (Δx)',
                value: targetX,
                min: -8,
                max: 8,
                step: 1,
                color: 'text-sky-400',
                landmarks: [
                  { value: 0, label: 'Origin' },
                  { value: 3, label: '3-4-5 Triplet' },
                  { value: 6, label: '6-8-10 Triplet' },
                  { value: -4, label: 'Q2 Clinic' },
                ],
              },
              {
                id: 'targetY',
                symbol: 'y_2',
                name: 'Target Y (Δy)',
                value: targetY,
                min: -8,
                max: 8,
                step: 1,
                color: 'text-emerald-400',
                landmarks: [
                  { value: 0, label: 'Origin' },
                  { value: 4, label: '3-4-5 Triplet' },
                  { value: 8, label: '6-8-10 Triplet' },
                  { value: 3, label: 'Q2 Clinic' },
                ],
              },
            ]}
            onParameterChange={(id, val) => {
              if (id === 'targetX') updateDroneParams({ targetX: val });
              if (id === 'targetY') updateDroneParams({ targetY: val });
            }}
            onReset={() => updateDroneParams({ targetX: 6, targetY: 8 })}
          />

          <div className="space-y-1.5">
            <TouchSlider
              label="Target X (Δx)"
              min={-8}
              max={8}
              step={1}
              value={targetX}
              formulaTerm="x₂"
              causeEffectHint={(val) =>
                `Horizontal base Δx = ${Math.abs(val - originX)} u. Adds (${Math.abs(val - originX)})² = ${Math.pow(val - originX, 2)} to distance squared.`
              }
              onChange={(val) => updateDroneParams({ targetX: val })}
              formatValue={(v) => `x = ${v}`}
            />

            <TouchSlider
              label="Target Y (Δy)"
              min={-8}
              max={8}
              step={1}
              value={targetY}
              formulaTerm="y₂"
              causeEffectHint={(val) =>
                `Vertical height Δy = ${Math.abs(val - originY)} u. Adds (${Math.abs(val - originY)})² = ${Math.pow(val - originY, 2)} to distance squared.`
              }
              onChange={(val) => updateDroneParams({ targetY: val })}
              formatValue={(v) => `y = ${v}`}
            />
          </div>

          {/* Quick Target Presets (Pythagorean Triples) */}
          <div className="pt-1.5 border-t border-slate-800/80">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Pythagorean Triples
            </span>
            <div className="grid grid-cols-4 gap-1">
              <button
                type="button"
                onClick={() => updateDroneParams({ targetX: 6, targetY: 8 })}
                className="py-1 px-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-[10px] font-mono text-cyan-300 border border-slate-700/60 transition-colors text-center cursor-pointer"
              >
                (6,8) d=10
              </button>
              <button
                type="button"
                onClick={() => updateDroneParams({ targetX: -4, targetY: 3 })}
                className="py-1 px-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-[10px] font-mono text-emerald-300 border border-slate-700/60 transition-colors text-center cursor-pointer"
              >
                (-4,3) d=5
              </button>
              <button
                type="button"
                onClick={() => updateDroneParams({ targetX: 5, targetY: -6 })}
                className="py-1 px-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-[10px] font-mono text-amber-300 border border-slate-700/60 transition-colors text-center cursor-pointer"
              >
                (5,-6)
              </button>
              <button
                type="button"
                onClick={() => updateDroneParams({ targetX: -6, targetY: -8 })}
                className="py-1 px-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-[10px] font-mono text-rose-300 border border-slate-700/60 transition-colors text-center cursor-pointer"
              >
                (-6,-8)
              </button>
            </div>
          </div>

          {/* Helper Toggles */}
          <div className="pt-1.5 border-t border-slate-800/80 grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => updateDroneParams({ showRightTriangle: !showRightTriangle })}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-colors ${
                showRightTriangle
                  ? 'bg-cyan-950/50 border-cyan-700 text-cyan-300'
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
            >
              <span>Right Δ Legs</span>
              <Eye className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => updateDroneParams({ snapToGrid: !snapToGrid })}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-colors ${
                snapToGrid
                  ? 'bg-amber-950/50 border-amber-700 text-amber-300'
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
            >
              <span>Snap to Grid</span>
              <Crosshair className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
};
