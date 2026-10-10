import React, { useEffect, useRef, useState, useCallback } from 'react';
import Matter from 'matter-js';
import confetti from 'canvas-confetti';
import { 
  Play, 
  RotateCcw, 
  Sparkles, 
  CheckCircle2, 
  Flame, 
  ShieldAlert, 
  Crosshair, 
  Sliders, 
  Info,
  Maximize2
} from 'lucide-react';
import { useSimulatorStore } from '../../store/useSimulatorStore';
import { BottomSheet } from '../layout/BottomSheet';
import { CircularAngleDial } from '../common/CircularAngleDial';
import { VerticalTensionSlider } from '../common/VerticalTensionSlider';
import { TouchSlider } from '../common/TouchSlider';
import { MathFormula } from '../common/MathFormula';
import { CoachTheoryModule } from '../common/CoachTheoryModule';
import { ChallengeManager } from '../common/ChallengeManager';
import { useHaptics } from '../../hooks/useHaptics';
import { useSound } from '../common/SoundManager';
import { usePerformanceMode } from '../../hooks/usePerformanceMode';
import { useAnalytics } from '../../hooks/useAnalytics';
import { ConceptInsightBanner } from '../common/ConceptInsightBanner';
import { MistakeDoctor } from '../common/MistakeDoctor';
import { LiveSubstitutionCard } from '../common/LiveSubstitutionCard';

export const CatapultSiege: React.FC = () => {
  const {
    catapultParams,
    updateCatapultParams,
    resetParams,
    completeChallenge,
    challengeCompleted,
    addXp,
    isZenMode,
  } = useSimulatorStore();

  const { successBuzz, errorBuzz, heavyImpact } = useHaptics();
  const { playWhoosh, playChime, playError, playThud } = useSound();
  const { trackEvent, trackStruggle } = useAnalytics();
  const { dpr: perfDpr } = usePerformanceMode();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const wallCollisionCountRef = useRef(0);

  // Matter.js engine references
  const engineRef = useRef<Matter.Engine | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const boulderBodyRef = useRef<Matter.Body | null>(null);
  const wallBodyRef = useRef<Matter.Body | null>(null);
  const groundBodyRef = useRef<Matter.Body | null>(null);
  const castleKeepBodyRef = useRef<Matter.Body | null>(null);

  // State
  const [hasLaunched, setHasLaunched] = useState(false);
  const [hasClearedWall, setHasClearedWall] = useState(false);
  const [hasHitWall, setHasHitWall] = useState(false);
  const [trajectoryTrail, setTrajectoryTrail] = useState<{ x: number; y: number }[]>([]);
  const [previousTrajectoryTrail, setPreviousTrajectoryTrail] = useState<{ x: number; y: number }[]>([]);
  const [previousCleared, setPreviousCleared] = useState<boolean | null>(null);
  const [boulderPos, setBoulderPos] = useState<{ x: number; y: number }>({ x: 120, y: 350 });

  const { angleDeg, tension, wallHeight, wallDistance, gravity } = catapultParams;

  // Catapult fixed launch pivot position (grounded on left)
  const catapultX = 130;
  const groundLevelY = 380; // Baseline floor height in world
  const launchOriginY = groundLevelY - 45; // Height of catapult sling arm

  // Trigonometric Vector Breakdown
  const angleRad = (angleDeg * Math.PI) / 180;
  // Hypotenuse is the tension force magnitude
  const hypotenuse = tension;
  // Opposite leg (Vertical launch velocity component) = v * sin(θ)
  const opposite = hypotenuse * Math.sin(angleRad);
  // Adjacent leg (Horizontal launch velocity component) = v * cos(θ)
  const adjacent = hypotenuse * Math.cos(angleRad);

  // Physical Wall dimensions & position
  const wallX = catapultX + wallDistance;
  const wallTopY = groundLevelY - wallHeight;

  // Theoretical clear altitude at wall X based on ballistic parabola
  // x(t) = x0 + vx * t
  // y(t) = y0 + vy * t + 0.5 * g * t^2 (canvas Y down, vy upwards is negative)
  const vScale = 0.88;
  const vxTheoretical = adjacent * vScale;
  const vyTheoretical = -opposite * vScale;
  const dxToWall = wallX - (catapultX + 15);
  const timeToWall = vxTheoretical > 0 ? dxToWall / vxTheoretical : 0;
  const effectiveG = gravity * 0.98;
  const theoreticalWallAltitude = (launchOriginY - 5) + vyTheoretical * timeToWall + 0.5 * effectiveG * timeToWall * timeToWall;
  const theoreticalClearance = wallTopY - theoreticalWallAltitude; // positive means above wall

  // Reset projectile back to sling arm
  const resetProjectile = useCallback(() => {
    const engine = engineRef.current;
    if (!engine) return;

    if (boulderBodyRef.current) {
      Matter.Composite.remove(engine.world, boulderBodyRef.current);
    }

    // Spawn new boulder resting at catapult sling
    const newBoulder = Matter.Bodies.circle(catapultX + 15, launchOriginY - 5, 12, {
      density: 0.005,
      frictionAir: 0.002,
      restitution: 0.35,
      isStatic: true,
      label: 'boulder',
    });

    Matter.Composite.add(engine.world, newBoulder);
    boulderBodyRef.current = newBoulder;
    setBoulderPos({ x: catapultX + 15, y: launchOriginY - 5 });
    setHasLaunched(false);
    setHasClearedWall(false);
    setHasHitWall(false);
    setTrajectoryTrail([]);
  }, [catapultX, launchOriginY]);

  // Launch projectile
  const handleLaunch = () => {
    if (!boulderBodyRef.current || !engineRef.current) return;

    // Trigger juicy tactile feedback & audio whoosh
    heavyImpact();
    playWhoosh();

    // Convert from static to dynamic
    Matter.Body.setStatic(boulderBodyRef.current, false);

    // Initial velocity impulse: vx = v * cos(θ), vy = -v * sin(θ)
    // Scale factor to map Tension to Matter.js velocity
    const velocityScale = 0.88;
    const initialVx = adjacent * velocityScale;
    const initialVy = -opposite * velocityScale; // negative y is upwards

    Matter.Body.setVelocity(boulderBodyRef.current, {
      x: initialVx,
      y: initialVy,
    });

    trackEvent('catapult_launch', {
      angleDeg,
      tension,
      wallDistance,
      wallHeight,
      initialVx,
      initialVy,
    });

    setHasLaunched(true);
    if (trajectoryTrail.length > 1) {
      setPreviousTrajectoryTrail(trajectoryTrail);
      setPreviousCleared(hasClearedWall);
    }
    setHasClearedWall(false);
    setHasHitWall(false);
    setTrajectoryTrail([]);
  };

  // Initialize Matter.js engine and world
  useEffect(() => {
    const { Engine, Runner, Bodies, Composite, Events } = Matter;

    const engine = Engine.create({
      gravity: { x: 0, y: gravity, scale: 0.001 },
    });
    engineRef.current = engine;

    const runner = Runner.create();
    runnerRef.current = runner;
    Runner.run(runner, engine);

    // Static Ground
    const ground = Bodies.rectangle(600, groundLevelY + 40, 1500, 80, {
      isStatic: true,
      label: 'ground',
      friction: 0.8,
    });
    groundBodyRef.current = ground;

    // Static Castle Wall
    const wall = Bodies.rectangle(wallX, groundLevelY - wallHeight / 2, 28, wallHeight, {
      isStatic: true,
      label: 'wall',
      friction: 0.5,
    });
    wallBodyRef.current = wall;

    // Static Castle Keep Target behind the wall
    const castleKeep = Bodies.rectangle(wallX + 120, groundLevelY - 50, 80, 100, {
      isStatic: true,
      label: 'castle-keep',
    });
    castleKeepBodyRef.current = castleKeep;

    Composite.add(engine.world, [ground, wall, castleKeep]);

    // Initial boulder
    const initialBoulder = Bodies.circle(catapultX + 15, launchOriginY - 5, 12, {
      density: 0.005,
      frictionAir: 0.002,
      restitution: 0.35,
      isStatic: true,
      label: 'boulder',
    });
    boulderBodyRef.current = initialBoulder;
    Composite.add(engine.world, initialBoulder);

    // Collision Event Listeners
    Events.on(engine, 'collisionStart', (event) => {
      event.pairs.forEach((pair) => {
        const labels = [pair.bodyA.label, pair.bodyB.label];
        if (labels.includes('boulder') && labels.includes('wall')) {
          setHasHitWall(true);
          errorBuzz();
          playThud();
          wallCollisionCountRef.current += 1;
          if (wallCollisionCountRef.current >= 2) {
            trackStruggle(
              'catapult-siege',
              'wall_breach',
              wallCollisionCountRef.current,
              `Hit wall at angle ${angleDeg}° and tension ${tension}`
            );
          }
        }
      });
    });

    return () => {
      Runner.stop(runner);
      Engine.clear(engine);
    };
  }, [gravity, catapultX, groundLevelY, launchOriginY, wallDistance, wallHeight, wallX]);

  // Update wall geometry when parameters change
  useEffect(() => {
    if (!wallBodyRef.current || !engineRef.current) return;
    const { Body } = Matter;
    Body.setPosition(wallBodyRef.current, {
      x: catapultX + wallDistance,
      y: groundLevelY - wallHeight / 2,
    });
    if (castleKeepBodyRef.current) {
      Body.setPosition(castleKeepBodyRef.current, {
        x: catapultX + wallDistance + 120,
        y: groundLevelY - 50,
      });
    }
  }, [wallDistance, wallHeight, catapultX, groundLevelY]);

  // Track boulder in physics loop & check wall clearance
  useEffect(() => {
    if (!hasLaunched) return;
    let animId: number;

    const checkBoulder = () => {
      if (boulderBodyRef.current) {
        const pos = boulderBodyRef.current.position;
        setBoulderPos({ x: pos.x, y: pos.y });

        // Add to trajectory trail
        setTrajectoryTrail((prev) => {
          if (prev.length > 80) return [...prev.slice(1), { x: pos.x, y: pos.y }];
          return [...prev, { x: pos.x, y: pos.y }];
        });

        // Check if boulder passed beyond wall X
        if (pos.x > wallX && !hasClearedWall && !hasHitWall) {
          // If altitude was higher than wall top
          if (pos.y < wallTopY) {
            setHasClearedWall(true);
            successBuzz();
            playChime();
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.65 },
              colors: ['#34d399', '#38bdf8', '#fbbf24'],
            });

            // Missions
            if (angleDeg === 45 && !challengeCompleted['catapult_45deg']) {
              completeChallenge('catapult_45deg', 50);
              trackEvent('catapult_mission_completed', { mission: 'catapult_45deg', score: 50 });
            } else if (wallHeight >= 200 && !challengeCompleted['catapult_tall_wall']) {
              completeChallenge('catapult_tall_wall', 40);
              trackEvent('catapult_mission_completed', { mission: 'catapult_tall_wall', score: 40 });
            } else if (!challengeCompleted['catapult_first_siege']) {
              completeChallenge('catapult_first_siege', 30);
              trackEvent('catapult_mission_completed', { mission: 'catapult_first_siege', score: 30 });
            }
          }
        }
      }
      animId = requestAnimationFrame(checkBoulder);
    };

    animId = requestAnimationFrame(checkBoulder);
    return () => cancelAnimationFrame(animId);
  }, [hasLaunched, hasClearedWall, hasHitWall, wallX, wallTopY, angleDeg, wallHeight, challengeCompleted, completeChallenge]);

  // High performance Canvas 2D render loop
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

      // Camera pan follow on boulder if mobile
      const isMobile = width < 640;
      let camOffsetX = 0;
      if (isMobile && hasLaunched && boulderPos.x > width * 0.5) {
        camOffsetX = Math.min(wallX - width * 0.4, boulderPos.x - width * 0.5);
      }
      ctx.translate(-camOffsetX, 0);

      // 1. Sky & Atmospheric Stars
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(camOffsetX, 0, width, height);

      // 2. Mountain silhouette in background
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.moveTo(0, groundLevelY);
      ctx.lineTo(120, groundLevelY - 140);
      ctx.lineTo(260, groundLevelY - 80);
      ctx.lineTo(440, groundLevelY - 180);
      ctx.lineTo(650, groundLevelY - 90);
      ctx.lineTo(850, groundLevelY - 160);
      ctx.lineTo(1000, groundLevelY);
      ctx.closePath();
      ctx.fill();

      // 3. Ground Line & Texture
      ctx.fillStyle = '#334155';
      ctx.fillRect(-200, groundLevelY, 1500, height - groundLevelY);
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-200, groundLevelY);
      ctx.lineTo(1300, groundLevelY);
      ctx.stroke();

      // Grass fringe
      ctx.fillStyle = '#10b981';
      ctx.fillRect(-200, groundLevelY, 1500, 4);

      // 4. Catapult Wooden Rig & Sling Arm
      // Wheel base
      ctx.fillStyle = '#78350f';
      ctx.fillRect(catapultX - 35, groundLevelY - 20, 70, 16);
      ctx.beginPath();
      ctx.arc(catapultX - 25, groundLevelY - 6, 12, 0, Math.PI * 2);
      ctx.arc(catapultX + 25, groundLevelY - 6, 12, 0, Math.PI * 2);
      ctx.fillStyle = '#451a03';
      ctx.fill();
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Upright A-Frame
      ctx.beginPath();
      ctx.moveTo(catapultX - 20, groundLevelY - 16);
      ctx.lineTo(catapultX, launchOriginY);
      ctx.lineTo(catapultX + 20, groundLevelY - 16);
      ctx.strokeStyle = '#92400e';
      ctx.lineWidth = 6;
      ctx.stroke();

      // Pivot Bolt
      ctx.beginPath();
      ctx.arc(catapultX, launchOriginY, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#f59e0b';
      ctx.fill();

      // Rotating Launch Arm (aligned with elevation angle θ)
      const armLength = 48;
      const armTipX = catapultX + Math.cos(angleRad) * armLength;
      const armTipY = launchOriginY - Math.sin(angleRad) * armLength;

      ctx.beginPath();
      ctx.moveTo(catapultX, launchOriginY);
      ctx.lineTo(armTipX, armTipY);
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Cup / Sling Basket at tip
      ctx.beginPath();
      ctx.arc(armTipX, armTipY, 8, 0, Math.PI);
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 3;
      ctx.stroke();

      // 5. Predictive Trajectory Dashed Laser Line
      if (catapultParams.showTrajectory && !hasLaunched) {
        ctx.beginPath();
        const predSteps = 45;
        const dt = 0.55;
        const vScale = 0.88;
        const vX = adjacent * vScale;
        const vY = -opposite * vScale;

        for (let i = 0; i <= predSteps; i++) {
          const t = i * dt;
          const px = catapultX + 15 + vX * t;
          const py = launchOriginY - 5 + vY * t + 0.5 * gravity * 0.98 * t * t;

          if (py > groundLevelY + 10) break;

          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }

        ctx.strokeStyle = theoreticalClearance > 15 ? '#34d399' : '#f43f5e';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // 6. Trigonometric Velocity Component Decomposition Triangle (Hypotenuse, Opp, Adj)
      if (catapultParams.showComponents && !hasLaunched) {
        const triScale = 3.2;
        const hypLen = hypotenuse * triScale;
        const oppLen = opposite * triScale;
        const adjLen = adjacent * triScale;

        const pOrigin = { x: catapultX, y: launchOriginY };
        const pAdj = { x: catapultX + adjLen, y: launchOriginY };
        const pHyp = { x: catapultX + adjLen, y: launchOriginY - oppLen };

        // Adjacent Leg (v * cos θ)
        ctx.beginPath();
        ctx.moveTo(pOrigin.x, pOrigin.y);
        ctx.lineTo(pAdj.x, pAdj.y);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 10px monospace';
        ctx.fillText(`Adj = ${adjacent.toFixed(1)}`, pOrigin.x + adjLen / 2 - 20, pOrigin.y + 14);

        // Opposite Leg (v * sin θ)
        ctx.beginPath();
        ctx.moveTo(pAdj.x, pAdj.y);
        ctx.lineTo(pHyp.x, pHyp.y);
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 10px monospace';
        ctx.fillText(`Opp = ${opposite.toFixed(1)}`, pAdj.x + 8, pAdj.y - oppLen / 2);

        // Hypotenuse Leg (Tension vector v)
        ctx.beginPath();
        ctx.moveTo(pOrigin.x, pOrigin.y);
        ctx.lineTo(pHyp.x, pHyp.y);
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Right angle indicator
        ctx.strokeRect(pAdj.x - 8, pAdj.y - 8, 8, 8);

        // Angle Arc at Catapult
        ctx.beginPath();
        ctx.arc(pOrigin.x, pOrigin.y, 24, 0, -angleRad, true);
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 10px monospace';
        ctx.fillText(`θ = ${angleDeg}°`, pOrigin.x + 28, pOrigin.y - 8);
      }

      // 6.5 Previous Attempt Ghost Silhouette (Pedagogical comparison)
      if (previousTrajectoryTrail.length > 1) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(previousTrajectoryTrail[0].x, previousTrajectoryTrail[0].y);
        for (let i = 1; i < previousTrajectoryTrail.length; i++) {
          ctx.lineTo(previousTrajectoryTrail[i].x, previousTrajectoryTrail[i].y);
        }
        ctx.setLineDash([5, 4]);
        ctx.strokeStyle = previousCleared ? 'rgba(52, 211, 153, 0.35)' : 'rgba(244, 63, 94, 0.35)';
        ctx.lineWidth = 1.8;
        ctx.stroke();
        ctx.setLineDash([]);

        // Small ghost badge at trail apex
        const midIdx = Math.floor(previousTrajectoryTrail.length / 2);
        if (previousTrajectoryTrail[midIdx]) {
          ctx.fillStyle = 'rgba(148, 163, 184, 0.7)';
          ctx.font = '9px monospace';
          ctx.fillText('Prev Attempt', previousTrajectoryTrail[midIdx].x - 28, previousTrajectoryTrail[midIdx].y - 8);
        }
        ctx.restore();
      }

      // 7. Actual Trajectory Trail (Drawn after launch)
      if (trajectoryTrail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(trajectoryTrail[0].x, trajectoryTrail[0].y);
        for (let i = 1; i < trajectoryTrail.length; i++) {
          ctx.lineTo(trajectoryTrail[i].x, trajectoryTrail[i].y);
        }
        ctx.strokeStyle = hasClearedWall ? '#34d399' : '#f59e0b';
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }

      // 8. Stone Castle Wall & Battlements
      const wallW = 28;
      ctx.fillStyle = hasHitWall ? '#7f1d1d' : '#475569';
      ctx.fillRect(wallX - wallW / 2, wallTopY, wallW, wallHeight);

      // Castle Stone Bricks Pattern
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      for (let by = wallTopY; by < groundLevelY; by += 16) {
        ctx.beginPath();
        ctx.moveTo(wallX - wallW / 2, by);
        ctx.lineTo(wallX + wallW / 2, by);
        ctx.stroke();
      }

      // Battlements / Crenels on top of wall
      ctx.fillStyle = '#334155';
      ctx.fillRect(wallX - wallW / 2, wallTopY - 12, 10, 12);
      ctx.fillRect(wallX + wallW / 2 - 10, wallTopY - 12, 10, 12);

      // Height dimension line on wall
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(wallX + wallW / 2 + 10, wallTopY);
      ctx.lineTo(wallX + wallW / 2 + 10, groundLevelY);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 10px monospace';
      ctx.fillText(`H = ${wallHeight}px`, wallX + wallW / 2 + 16, wallTopY + wallHeight / 2);

      // Distance line from Catapult to Wall
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(catapultX, groundLevelY + 16);
      ctx.lineTo(wallX, groundLevelY + 16);
      ctx.stroke();

      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px monospace';
      ctx.fillText(`Distance D = ${wallDistance}px`, catapultX + wallDistance / 2 - 40, groundLevelY + 30);

      // 9. Castle Keep / Target Fortress behind the wall
      const keepX = wallX + 80;
      ctx.fillStyle = hasClearedWall ? '#064e3b' : '#1e293b';
      ctx.fillRect(keepX, groundLevelY - 110, 80, 110);
      ctx.strokeStyle = hasClearedWall ? '#10b981' : '#334155';
      ctx.lineWidth = 2;
      ctx.strokeRect(keepX, groundLevelY - 110, 80, 110);

      // Flag on keep
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.moveTo(keepX + 40, groundLevelY - 135);
      ctx.lineTo(keepX + 64, groundLevelY - 125);
      ctx.lineTo(keepX + 40, groundLevelY - 115);
      ctx.closePath();
      ctx.fill();

      // Flagpole
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(keepX + 40, groundLevelY - 110);
      ctx.lineTo(keepX + 40, groundLevelY - 138);
      ctx.stroke();

      // 10. The Boulder Projectile
      const bX = hasLaunched ? boulderPos.x : armTipX;
      const bY = hasLaunched ? boulderPos.y : armTipY - 6;

      ctx.beginPath();
      ctx.arc(bX, bY, 12, 0, Math.PI * 2);
      ctx.fillStyle = hasClearedWall ? '#34d399' : hasHitWall ? '#ef4444' : '#64748b';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.shadowColor = hasClearedWall ? '#34d399' : '#000000';
      ctx.shadowBlur = hasClearedWall ? 12 : 4;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Boulder texture crater
      ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.beginPath();
      ctx.arc(bX - 3, bY - 3, 3, 0, Math.PI * 2);
      ctx.arc(bX + 4, bY + 2, 2.5, 0, Math.PI * 2);
      ctx.fill();

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
    catapultParams,
    angleDeg,
    angleRad,
    tension,
    opposite,
    adjacent,
    hypotenuse,
    wallHeight,
    wallDistance,
    wallX,
    wallTopY,
    catapultX,
    groundLevelY,
    launchOriginY,
    boulderPos,
    hasLaunched,
    hasClearedWall,
    hasHitWall,
    theoreticalClearance,
    trajectoryTrail,
    previousTrajectoryTrail,
    previousCleared,
    gravity,
  ]);

  return (
    <div
      ref={containerRef}
      className="relative w-full flex-1 min-h-0 h-full overflow-hidden flex flex-col bg-slate-950"
    >
      {/* 2D Physics Canvas Stage */}
      <div className="relative w-full h-full flex-1">
        <canvas ref={canvasRef} className="w-full h-full touch-none select-none" />

        {/* Real-time Pedagogical Concept Insight Banner */}
        <ConceptInsightBanner
          conceptTitle="Resolution of Vectors & Elevation Arc"
          mathInsight={`vx = ${adjacent.toFixed(1)} px/s (v·cos θ), vy = ${opposite.toFixed(1)} px/s (v·sin θ). Maximum horizontal carry R ∝ v²·sin(2θ)/g. At θ = ${angleDeg}°, sin(2θ) = ${(Math.sin(2 * angleRad)).toFixed(2)}.`}
          eli10Analogy="Throwing a ball flat (low angle) hits the ground too early. Throwing straight up (steep angle) stays in the air forever but goes nowhere forward. 45° is the universal sweet spot where forward drive and hang time multiply to the biggest possible range!"
          liveFeedback={
            hasClearedWall
              ? `🎉 Wall Cleared by +${theoreticalClearance.toFixed(0)}px! Clean ballistic arc.`
              : hasHitWall
              ? `💥 Struck Wall! At distance ${wallDistance}px, boulder was at height ${(groundLevelY - boulderPos.y).toFixed(0)}px (Wall is ${wallHeight}px). Increase θ or tension!`
              : angleDeg === 45
              ? '🎯 Benchmark 45°: maximum theoretical projectile distance.'
              : angleDeg < 45
              ? `Flat arc: high forward speed (${adjacent.toFixed(1)} px/s), but boulder drops early.`
              : `High lob: great vertical clearance (${opposite.toFixed(1)} px/s), but shorter carry.`
          }
          comparisonDiff={
            previousTrajectoryTrail.length > 0
              ? {
                  improved: hasClearedWall && !previousCleared,
                  text: hasClearedWall 
                    ? (previousCleared ? 'Cleared again' : 'Wall Cleared (Improved!)')
                    : 'Ghost trail shown in dashed',
                }
              : undefined
          }
          quickAction={{
            label: "Alka Ma'am's 45° Elevation Benchmark",
            onApply: () => {
              updateCatapultParams({ angleDeg: 45, tension: 28 });
              resetProjectile();
            },
          }}
        />

        {/* Real-time Mistake Doctor: Wall Collision Diagnosis */}
        <MistakeDoctor
          isActive={hasHitWall}
          blunderTitle="Wall Collision: Low Elevation"
          whatHappened={`The boulder struck the wall at height ${(groundLevelY - boulderPos.y).toFixed(0)}px (Wall is ${wallHeight}px). Launch velocity was directed too flat horizontally.`}
          examTrap="Students often assume increasing launch force alone will clear any barrier. But if angle θ is too low (< 40°), the boulder travels fast horizontally and crashes into the bricks before rising!"
          prescription="Increase launch angle θ to 45° - 55°. This redirects force into vertical velocity vy = v·sin(θ), giving the projectile sufficient flight loft to clear height H."
          remedyLabel="Apply Alka Ma'am's Fix (θ = 50°, v = 32)"
          onApplyRemedy={() => {
            updateCatapultParams({ angleDeg: 50, tension: 32 });
            resetProjectile();
          }}
        />

        {/* Progressive Challenge Manager */}
        <ChallengeManager
          simulatorId="catapult-siege"
          simulatorTitle="The Catapult Siege: Heights & Trigonometry"
          levels={[
            {
              levelNumber: 1,
              title: 'Level 1: Clear the Castle Wall',
              badge: 'First Siege',
              description: 'Calibrate your launch angle and tension to launch the boulder cleanly over the fortification.',
              requirementFormula: 'y(wallDistance) > wallHeight · Opp = v·sin(θ)',
              targetCriteria: 'Fly above wall without collision and strike keep',
              xpReward: 40,
              autoPreset: () => {
                updateCatapultParams({ angleDeg: 50, tension: 28 });
                if (hasLaunched) resetProjectile();
              },
            },
            {
              levelNumber: 2,
              title: 'Level 2: The Canonical 45° Elevation',
              badge: 'Optimal Angle',
              description: 'Clear the wall using exactly 45 degrees elevation where sin(45°) = cos(45°) = √2/2.',
              requirementFormula: 'θ = 45° · v_x = v_y = v · 0.7071',
              targetCriteria: 'Launch with θ = 45° and clear wall height H = 160px',
              xpReward: 50,
              autoPreset: () => {
                updateCatapultParams({ angleDeg: 45, tension: 28 });
                if (hasLaunched) resetProjectile();
              },
            },
            {
              levelNumber: 3,
              title: 'Level 3: Citadel Breach (Minimal Tension)',
              badge: 'Max Elevation Arc',
              description: 'Breach a 200px tall castle wall with minimum velocity by using a steep elevation arc θ ≥ 65°.',
              requirementFormula: 'H = 200px · tan(θ) = H/D · θ ≥ 65°',
              targetCriteria: 'Set H = 200px, launch with high loft and clear the wall',
              xpReward: 60,
              autoPreset: () => {
                updateCatapultParams({ wallHeight: 200, angleDeg: 65, tension: 35 });
                if (hasLaunched) resetProjectile();
              },
            },
          ]}
          onTriggerPreset={(lvl) => {
            if (lvl === 1) updateCatapultParams({ angleDeg: 50, tension: 28 });
            else if (lvl === 2) updateCatapultParams({ angleDeg: 45, tension: 28 });
            else if (lvl === 3) updateCatapultParams({ wallHeight: 200, angleDeg: 65, tension: 35 });
            resetProjectile();
          }}
        />

        {/* Real-Time Trigonometric Math Panel (Glows green when wall is cleared!) */}
        {!isZenMode && (
          <div
            className={`absolute top-2 right-2 sm:top-3 sm:right-3 max-w-[190px] sm:max-w-[240px] p-2 sm:p-2.5 rounded-xl text-xs space-y-1 shadow-xl backdrop-blur-md transition-all duration-300 pointer-events-none border z-10 ${
              hasClearedWall
                ? 'bg-emerald-950/90 border-emerald-400 text-emerald-100 ring-2 ring-emerald-400/40 shadow-emerald-500/20'
                : hasHitWall
                ? 'bg-rose-950/90 border-rose-500 text-rose-100 ring-2 ring-rose-500/30'
                : 'bg-slate-900/90 border-slate-800 text-slate-200'
            }`}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-1">
              <span className="font-bold text-[10px] sm:text-[11px] uppercase tracking-wider text-slate-400">
                Trig HUD
              </span>
              <span className="font-mono font-bold text-amber-400 text-[11px] sm:text-xs">θ = {angleDeg}°</span>
            </div>

            <div className="flex items-center justify-between text-[11px]">
              <span className="text-amber-300">Hyp (v)</span>
              <span className="font-mono font-bold text-amber-300 tabular-nums">
                {hypotenuse} u
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px]">
              <span className="text-emerald-400">v·sin(θ)</span>
              <span className="font-mono font-bold text-emerald-300 tabular-nums">
                {opposite.toFixed(1)}
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px]">
              <span className="text-cyan-400">v·cos(θ)</span>
              <span className="font-mono font-bold text-cyan-300 tabular-nums">
                {adjacent.toFixed(1)}
              </span>
            </div>

            <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-slate-400 pt-0.5 border-t border-white/10">
              <span>Clearance</span>
              <span
                className={`font-mono font-bold ${
                  theoreticalClearance > 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {theoreticalClearance > 0
                  ? `+${theoreticalClearance.toFixed(0)}px`
                  : `${theoreticalClearance.toFixed(0)}px`}
              </span>
            </div>

            {hasClearedWall && (
              <div className="pt-1 flex items-center gap-1.5 text-emerald-300 font-bold text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Wall Cleared!</span>
              </div>
            )}

            {hasHitWall && (
              <div className="pt-1 flex items-center gap-1.5 text-rose-300 font-bold text-[11px]">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Hit Wall!</span>
              </div>
            )}
          </div>
        )}

        {/* Floating Launch & Reload Action Buttons */}
        <div className="absolute bottom-14 sm:bottom-16 left-3 sm:left-4 z-20 flex items-center gap-2">
          <button
            type="button"
            onClick={hasLaunched ? resetProjectile : handleLaunch}
            className={`min-h-[46px] px-5 py-2.5 rounded-full font-extrabold text-xs shadow-xl active:scale-95 transition-all flex items-center gap-2 touch-manipulation ${
              hasLaunched
                ? 'bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700'
                : 'bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 shadow-amber-500/25 hover:brightness-110'
            }`}
          >
            {hasLaunched ? (
              <>
                <RotateCcw className="w-4 h-4" />
                <span>Reload Catapult</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Launch Boulder</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Collapsible Bottom Sheet - Catapult Siege Parameters */}
      <BottomSheet
        title="The Catapult Siege: Heights & Trigonometry"
        badgeLabel={`θ = ${angleDeg}° · v = ${tension}`}
        quickEquation={`Opp = ${opposite.toFixed(1)} · Adj = ${adjacent.toFixed(1)}`}
        onReset={() => {
          resetParams('catapult-siege');
          resetProjectile();
        }}
        theoryContent={
          <CoachTheoryModule
            simulatorId="catapult-siege"
            extraLiveDetails={
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 rounded-xl bg-cyan-950/30 border border-cyan-800/40">
                    <span className="text-cyan-300 font-semibold block">Forward Velocity v_x:</span>
                    <span className="font-mono text-white text-xs">{adjacent.toFixed(1)} px/s (v·cos {angleDeg}°)</span>
                  </div>
                  <div className="p-2 rounded-xl bg-emerald-950/30 border border-emerald-800/40">
                    <span className="text-emerald-300 font-semibold block">Vertical Velocity v_y:</span>
                    <span className="font-mono text-white text-xs">{opposite.toFixed(1)} px/s (v·sin {angleDeg}°)</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
                  <span className="text-slate-400">Wall Clearance Margin:</span>
                  <span className={`font-mono font-bold ${theoreticalClearance > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {theoreticalClearance > 0 ? `+${theoreticalClearance.toFixed(1)} px` : `${theoreticalClearance.toFixed(1)} px`}
                  </span>
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
                Class 10 Siege Missions
              </span>
              <p className="text-slate-300">
                Calibrate your elevation dial and tension slider to clear different castle fortification heights.
              </p>
            </div>

            <div className="space-y-2">
              <div
                className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
                  challengeCompleted['catapult_45deg']
                    ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="font-semibold text-white">Mission 1: The Optimal 45° Trajectory</div>
                  <div className="text-[11px] text-slate-400">
                    Dial θ = 45° where sin(45°) = cos(45°) = 0.707 and clear the wall!
                  </div>
                </div>
                {challengeCompleted['catapult_45deg'] ? (
                  <span className="flex items-center gap-1 font-bold text-emerald-400 text-xs">
                    <CheckCircle2 className="w-4 h-4" />
                    +50 XP
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => updateCatapultParams({ angleDeg: 45, tension: 28 })}
                    className="text-xs font-mono text-amber-400 bg-amber-950/60 px-2 py-1 rounded border border-amber-800/40"
                  >
                    Set θ = 45°
                  </button>
                )}
              </div>

              <div
                className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
                  challengeCompleted['catapult_tall_wall']
                    ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="font-semibold text-white">Mission 2: Tower Citadel Breach</div>
                  <div className="text-[11px] text-slate-400">
                    Set Wall Height H ≥ 200px and launch with high vertical loft (θ ≥ 60°).
                  </div>
                </div>
                {challengeCompleted['catapult_tall_wall'] ? (
                  <span className="flex items-center gap-1 font-bold text-emerald-400 text-xs">
                    <CheckCircle2 className="w-4 h-4" />
                    +40 XP
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => updateCatapultParams({ wallHeight: 200, angleDeg: 62, tension: 35 })}
                    className="text-xs font-mono text-amber-400 bg-amber-950/60 px-2 py-1 rounded border border-amber-800/40"
                  >
                    Set H = 200px
                  </button>
                )}
              </div>
            </div>
          </div>
        }
      >
        {/* Controls Tab - Mobile friendly compact layout */}
        <div className="space-y-2">
          {/* Point 1 & 5: Live Substitution Card for Projectile Motion */}
          <LiveSubstitutionCard
            compact={true}
            title="Projectile Motion"
            badge="Trigonometry"
            symbolicLaw="v_x = v \cos\theta, \quad v_y = v \sin\theta"
            substitutedLatex={`v_x = ${tension} \\cos ${angleDeg}^\\circ, \\quad v_y = ${tension} \\sin ${angleDeg}^\\circ`}
            evaluatedLatex={`v_x = ${adjacent.toFixed(1)}, \\; v_y = ${opposite.toFixed(1)}, \\; \\Delta = ${theoreticalClearance > 0 ? `+${theoreticalClearance.toFixed(1)}` : theoreticalClearance.toFixed(1)}`}
            activeTerm={hasLaunched ? (hasClearedWall ? 'Cleared!' : hasHitWall ? 'Hit Wall!' : 'In Flight...') : undefined}
          />
          <div className="grid grid-cols-2 gap-1.5 items-center bg-slate-950/60 p-1.5 rounded-xl border border-slate-800/80">
            {/* Circular Dial for Elevation Angle θ */}
            <div className="flex justify-center scale-85 sm:scale-95">
              <CircularAngleDial
                angleDeg={angleDeg}
                onChange={(val) => {
                  updateCatapultParams({ angleDeg: val });
                  if (hasLaunched) resetProjectile();
                }}
              />
            </div>

            {/* Vertical Slider for Tension (Hypotenuse) */}
            <div className="flex justify-center scale-85 sm:scale-95">
              <VerticalTensionSlider
                value={tension}
                min={12}
                max={42}
                step={1}
                onChange={(val) => {
                  updateCatapultParams({ tension: val });
                  if (hasLaunched) resetProjectile();
                }}
              />
            </div>
          </div>

          {/* Environmental Castle Parameters in 2-Column Grid */}
          <div className="cockpit-slider-grid grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-900/70 border border-slate-800 rounded-xl p-1.5">
            <TouchSlider
              compact={true}
              label="Wall Height"
              min={80}
              max={230}
              step={10}
              unit="px"
              value={wallHeight}
              formulaTerm="H"
              causeEffectHint={(val) =>
                `Clearance: ${theoreticalClearance > 0 ? `+${theoreticalClearance.toFixed(0)}px (Clears)` : `${theoreticalClearance.toFixed(0)}px (Collides)`}`
              }
              onChange={(val) => updateCatapultParams({ wallHeight: val })}
            />

            <TouchSlider
              compact={true}
              label="Wall Distance"
              min={260}
              max={460}
              step={20}
              unit="px"
              value={wallDistance}
              formulaTerm="D"
              causeEffectHint={(val) =>
                `Flight time t = D/vx = ${(val / (Math.max(1, adjacent * 0.88))).toFixed(2)}s.`
              }
              onChange={(val) => updateCatapultParams({ wallDistance: val })}
            />
          </div>
        </div>
      </BottomSheet>
    </div>
  );
};
