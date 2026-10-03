/**
 * TrigHeightsSimulator.tsx: Interactive Clinometer & Heights and Distances (Class 10).
 * Features:
 * - Real-time 2D Canvas with architectural tower/lighthouse and surveyor positions
 * - Dynamic angle of elevation & depression arcs with sightline rays
 * - Solves the #1 textbook misconception: Depression Angle = Elevation Angle via Alternate Interior Angles!
 * - Dual-Observer Mode for the ubiquitous CBSE/ICSE board exam problem (walking x meters changes angle from 30° to 60°)
 * - Pure KaTeX coaching theory module and structured board exam challenges
 */
import React, { useEffect, useRef, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  RotateCcw, 
  CheckCircle2, 
  Compass, 
  Sliders, 
  Eye, 
  Maximize2,
  Navigation,
  Ship,
  Building,
  Target
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

export const TrigHeightsSimulator: React.FC = () => {
  const {
    trigHeightsParams,
    updateTrigHeightsParams,
    resetParams,
    completeChallenge,
    challengeCompleted,
    isZenMode,
  } = useSimulatorStore();

  const {
    towerHeight,
    observerDistance,
    secondObserverDistance,
    dualObserverMode,
    eyeLevelHeight,
    viewMode,
    showSightLine,
    showAngleArc,
    showTanRatio,
  } = trigHeightsParams;

  const { lightTap, successBuzz } = useHaptics();
  const { playClick, playChime } = useSound();
  const { trackEvent } = useAnalytics();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dragTarget, setDragTarget] = useState<'obs1' | 'obs2' | 'tower' | null>(null);

  // Effective height above eye level
  const effectiveH = Math.max(5, towerHeight - eyeLevelHeight);
  const d1 = Math.max(10, observerDistance);
  const d2 = Math.max(5, Math.min(d1 - 2, secondObserverDistance));

  // Angles in degrees
  const angle1Rad = Math.atan2(effectiveH, d1);
  const angle1Deg = (angle1Rad * 180) / Math.PI;

  const angle2Rad = Math.atan2(effectiveH, d2);
  const angle2Deg = (angle2Rad * 180) / Math.PI;

  const walkedDistanceX = d1 - d2;

  // Tangent and cotangent ratios
  const tan1 = Math.tan(angle1Rad);
  const tan2 = Math.tan(angle2Rad);

  // Coordinate transforms
  const getTransforms = useCallback((width: number, height: number) => {
    const scale = Math.min(width / 110, height / 85); // 110m horizontal view
    const groundY = height - 60; // 60px from bottom for ground
    const towerX = width - 70; // 70px from right margin for tower center

    const toScreen = (distFromTower: number, altitude: number) => ({
      sx: towerX - distFromTower * scale,
      sy: groundY - altitude * scale,
    });

    const toMath = (sx: number, sy: number) => ({
      distFromTower: (towerX - sx) / scale,
      altitude: (groundY - sy) / scale,
    });

    return { scale, groundY, towerX, toScreen, toMath };
  }, []);

  // Board Exam Challenge Evaluation
  useEffect(() => {
    // Challenge 1: 45° Angle of Elevation (Height = Distance)
    if (
      Math.abs(angle1Deg - 45) < 1.0 &&
      !challengeCompleted['trig_45_equality']
    ) {
      completeChallenge('trig_45_equality', 40);
      successBuzz();
      playChime();
      confetti({ particleCount: 40, spread: 60 });
      trackEvent('challenge_completed', { challengeId: 'trig_45_equality' });
    }

    // Challenge 2: 30° to 60° Classic Board Exam Pair
    if (
      dualObserverMode &&
      Math.abs(angle1Deg - 30) < 1.5 &&
      Math.abs(angle2Deg - 60) < 2.0 &&
      !challengeCompleted['trig_30_60_classic']
    ) {
      completeChallenge('trig_30_60_classic', 45);
      successBuzz();
      playChime();
      confetti({ particleCount: 40, spread: 60 });
      trackEvent('challenge_completed', { challengeId: 'trig_30_60_classic' });
    }

    // Challenge 3: Alternate Interior Angles in Depression Mode
    if (
      viewMode === 'depression' &&
      !challengeCompleted['trig_depression_master']
    ) {
      completeChallenge('trig_depression_master', 50);
      successBuzz();
      playChime();
      confetti({ particleCount: 40, spread: 60 });
      trackEvent('challenge_completed', { challengeId: 'trig_depression_master' });
    }
  }, [
    angle1Deg,
    angle2Deg,
    dualObserverMode,
    viewMode,
    challengeCompleted,
    completeChallenge,
    successBuzz,
    playChime,
    trackEvent,
  ]);

  // 60fps Canvas render
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const dpr = window.devicePixelRatio || 1;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      const { scale, groundY, towerX, toScreen } = getTransforms(width, height);

      // Sky background gradient with stars/clouds
      const skyGrad = ctx.createLinearGradient(0, 0, 0, groundY);
      skyGrad.addColorStop(0, '#090d16');
      skyGrad.addColorStop(1, '#0f172a');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, groundY);

      // Ground plane
      const groundGrad = ctx.createLinearGradient(0, groundY, 0, height);
      groundGrad.addColorStop(0, '#1e293b');
      groundGrad.addColorStop(1, '#0f172a');
      ctx.fillStyle = groundGrad;
      ctx.fillRect(0, groundY, width, height - groundY);

      // Ground Line
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(width, groundY);
      ctx.stroke();

      // Distance distance markers along ground (every 10m)
      ctx.fillStyle = '#64748b';
      ctx.font = '9px monospace';
      for (let m = 0; m <= 100; m += 10) {
        const s = toScreen(m, 0);
        ctx.beginPath();
        ctx.moveTo(s.sx, groundY);
        ctx.lineTo(s.sx, groundY + 6);
        ctx.stroke();
        ctx.fillText(`${m}m`, s.sx - 8, groundY + 18);
      }

      // Tower / Lighthouse Coordinates
      const sTowerBase = toScreen(0, 0);
      const sTowerTop = toScreen(0, towerHeight);
      const towerWidthPx = Math.max(16, 6 * scale);

      // Right-angled triangle fill (Observer 1)
      const sObs1Eye = toScreen(d1, eyeLevelHeight);
      const sTowerEyeLevel = toScreen(0, eyeLevelHeight);

      ctx.fillStyle = 'rgba(56, 189, 248, 0.08)';
      ctx.beginPath();
      ctx.moveTo(sObs1Eye.sx, sObs1Eye.sy);
      ctx.lineTo(sTowerEyeLevel.sx, sTowerEyeLevel.sy);
      ctx.lineTo(sTowerTop.sx, sTowerTop.sy);
      ctx.closePath();
      ctx.fill();

      // Right-angled triangle fill (Observer 2 if active)
      if (dualObserverMode) {
        const sObs2Eye = toScreen(d2, eyeLevelHeight);
        ctx.fillStyle = 'rgba(245, 158, 11, 0.12)';
        ctx.beginPath();
        ctx.moveTo(sObs2Eye.sx, sObs2Eye.sy);
        ctx.lineTo(sTowerEyeLevel.sx, sTowerEyeLevel.sy);
        ctx.lineTo(sTowerTop.sx, sTowerTop.sy);
        ctx.closePath();
        ctx.fill();
      }

      // Tower Architectural Pillar
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(sTowerBase.sx - towerWidthPx / 2, sTowerBase.sy);
      ctx.lineTo(sTowerTop.sx - towerWidthPx / 3, sTowerTop.sy + 10);
      ctx.lineTo(sTowerTop.sx + towerWidthPx / 3, sTowerTop.sy + 10);
      ctx.lineTo(sTowerBase.sx + towerWidthPx / 2, sTowerBase.sy);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Tower observation deck / lantern room
      ctx.fillStyle = '#334155';
      ctx.fillRect(sTowerTop.sx - towerWidthPx / 2, sTowerTop.sy, towerWidthPx, 10);
      ctx.strokeRect(sTowerTop.sx - towerWidthPx / 2, sTowerTop.sy, towerWidthPx, 10);

      // Beacon light glowing pulse on top
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(sTowerTop.sx, sTowerTop.sy, 6, 0, Math.PI * 2);
      ctx.fill();

      // Height dimension label
      ctx.strokeStyle = '#94a3b8';
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(sTowerTop.sx + 24, sTowerTop.sy);
      ctx.lineTo(sTowerTop.sx + 24, sTowerBase.sy);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 12px monospace';
      ctx.fillText(`h = ${towerHeight}m`, sTowerTop.sx + 30, (sTowerTop.sy + sTowerBase.sy) / 2);

      // Top handle for dragging tower height
      ctx.fillStyle = 'rgba(56, 189, 248, 0.3)';
      ctx.beginPath();
      ctx.arc(sTowerTop.sx, sTowerTop.sy, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Right-angle 90° glyph at tower base eye level
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(sTowerEyeLevel.sx - 12, sTowerEyeLevel.sy);
      ctx.lineTo(sTowerEyeLevel.sx - 12, sTowerEyeLevel.sy - 12);
      ctx.lineTo(sTowerEyeLevel.sx, sTowerEyeLevel.sy - 12);
      ctx.stroke();

      // Sightlines and Angle Arcs
      if (showSightLine) {
        // Sightline Observer 1 to Tower Top
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(sObs1Eye.sx, sObs1Eye.sy);
        ctx.lineTo(sTowerTop.sx, sTowerTop.sy);
        ctx.stroke();

        // Sightline Observer 2 to Tower Top (if enabled)
        if (dualObserverMode) {
          const sObs2Eye = toScreen(d2, eyeLevelHeight);
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(sObs2Eye.sx, sObs2Eye.sy);
          ctx.lineTo(sTowerTop.sx, sTowerTop.sy);
          ctx.stroke();
        }

        // Horizontal Sightline from tower top for Angle of Depression
        if (viewMode === 'depression') {
          ctx.strokeStyle = '#f43f5e';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([5, 4]);
          ctx.beginPath();
          ctx.moveTo(sTowerTop.sx, sTowerTop.sy);
          ctx.lineTo(0, sTowerTop.sy);
          ctx.stroke();
          ctx.setLineDash([]);

          // Depression angle arc at top
          ctx.strokeStyle = '#f43f5e';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(sTowerTop.sx, sTowerTop.sy, 35, Math.PI, Math.PI + angle1Rad, false);
          ctx.stroke();

          ctx.fillStyle = '#fb7185';
          ctx.font = 'bold 11px monospace';
          ctx.fillText(`θ_dep = ${angle1Deg.toFixed(1)}°`, sTowerTop.sx - 85, sTowerTop.sy + 18);
        }
      }

      // Angle Arcs at Observer 1
      if (showAngleArc) {
        const arcRadius = 32;
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(sObs1Eye.sx, sObs1Eye.sy, arcRadius, 0, -angle1Rad, true);
        ctx.stroke();

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 11px monospace';
        ctx.fillText(`θ₁ = ${angle1Deg.toFixed(1)}°`, sObs1Eye.sx + arcRadius + 4, sObs1Eye.sy - 8);

        // Angle Arc at Observer 2
        if (dualObserverMode) {
          const sObs2Eye = toScreen(d2, eyeLevelHeight);
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(sObs2Eye.sx, sObs2Eye.sy, arcRadius, 0, -angle2Rad, true);
          ctx.stroke();

          ctx.fillStyle = '#f59e0b';
          ctx.font = 'bold 11px monospace';
          ctx.fillText(`θ₂ = ${angle2Deg.toFixed(1)}°`, sObs2Eye.sx + arcRadius + 4, sObs2Eye.sy - 8);
        }
      }

      // Observer 1 Representation (Surveyor / Clinometer)
      const sObs1 = toScreen(d1, 0);
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(sObs1Eye.sx, sObs1Eye.sy, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Tripod legs
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(sObs1Eye.sx, sObs1Eye.sy);
      ctx.lineTo(sObs1.sx - 8, sObs1.sy);
      ctx.moveTo(sObs1Eye.sx, sObs1Eye.sy);
      ctx.lineTo(sObs1.sx + 8, sObs1.sy);
      ctx.stroke();

      // Draggable pulsing halo for Observer 1
      ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.beginPath();
      ctx.arc(sObs1Eye.sx, sObs1Eye.sy, 16, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText(`Obs 1 (${d1.toFixed(1)}m)`, sObs1.sx - 24, groundY + 32);

      // Observer 2 Representation (if enabled)
      if (dualObserverMode) {
        const sObs2 = toScreen(d2, 0);
        const sObs2Eye = toScreen(d2, eyeLevelHeight);

        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(sObs2Eye.sx, sObs2Eye.sy, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(sObs2Eye.sx, sObs2Eye.sy);
        ctx.lineTo(sObs2.sx - 8, sObs2.sy);
        ctx.moveTo(sObs2Eye.sx, sObs2Eye.sy);
        ctx.lineTo(sObs2.sx + 8, sObs2.sy);
        ctx.stroke();

        ctx.fillStyle = 'rgba(245, 158, 11, 0.25)';
        ctx.beginPath();
        ctx.arc(sObs2Eye.sx, sObs2Eye.sy, 16, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText(`Obs 2 (${d2.toFixed(1)}m)`, sObs2.sx - 24, groundY + 32);

        // Distance walked line x = d1 - d2
        ctx.strokeStyle = '#ec4899';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(sObs1.sx, groundY + 44);
        ctx.lineTo(sObs2.sx, groundY + 44);
        ctx.stroke();

        ctx.fillStyle = '#f472b6';
        ctx.font = 'bold 10px monospace';
        ctx.fillText(`Walked x = ${walkedDistanceX.toFixed(1)}m`, (sObs1.sx + sObs2.sx) / 2 - 28, groundY + 56);
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [
    towerHeight,
    d1,
    d2,
    effectiveH,
    angle1Deg,
    angle2Deg,
    angle1Rad,
    angle2Rad,
    walkedDistanceX,
    dualObserverMode,
    eyeLevelHeight,
    viewMode,
    showSightLine,
    showAngleArc,
    getTransforms,
  ]);

  // Touch and pointer interactions
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;

    const { toScreen } = getTransforms(rect.width, rect.height);
    const sObs1 = toScreen(d1, eyeLevelHeight);
    const sObs2 = toScreen(d2, eyeLevelHeight);
    const sTower = toScreen(0, towerHeight);

    const distObs1 = Math.hypot(sx - sObs1.sx, sy - sObs1.sy);
    const distObs2 = Math.hypot(sx - sObs2.sx, sy - sObs2.sy);
    const distTower = Math.hypot(sx - sTower.sx, sy - sTower.sy);

    if (distTower < 28) {
      setDragTarget('tower');
      canvas.setPointerCapture(e.pointerId);
      lightTap();
    } else if (distObs2 < 28 && dualObserverMode) {
      setDragTarget('obs2');
      canvas.setPointerCapture(e.pointerId);
      lightTap();
    } else if (distObs1 < 28) {
      setDragTarget('obs1');
      canvas.setPointerCapture(e.pointerId);
      lightTap();
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!dragTarget) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;

    const { toMath } = getTransforms(rect.width, rect.height);
    const mathPt = toMath(sx, sy);

    if (dragTarget === 'tower') {
      const newH = Math.max(10, Math.min(80, Math.round(mathPt.altitude)));
      updateTrigHeightsParams({ towerHeight: newH });
    } else if (dragTarget === 'obs1') {
      const newD1 = Math.max(dualObserverMode ? d2 + 5 : 10, Math.min(100, Math.round(mathPt.distFromTower)));
      updateTrigHeightsParams({ observerDistance: newD1 });
    } else if (dragTarget === 'obs2') {
      const newD2 = Math.max(5, Math.min(d1 - 5, Math.round(mathPt.distFromTower)));
      updateTrigHeightsParams({ secondObserverDistance: newD2 });
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (dragTarget) {
      setDragTarget(null);
      try {
        canvasRef.current?.releasePointerCapture(e.pointerId);
      } catch {
        // safe ignore
      }
    }
  };

  // Structured Board Exam Challenges
  const challengeLevels: ChallengeLevel[] = [
    {
      levelNumber: 1,
      title: '45° Height-Distance Equality',
      badge: 'tan(45°) = 1',
      description: 'Adjust distance d so the angle of elevation is exactly 45.0°. Verify why height equals distance (tan 45° = 1)!',
      requirementFormula: '\\tan(45^\\circ) = 1 \\implies h = d',
      targetCriteria: 'Set observer distance so θ = 45°',
      xpReward: 40,
      autoPreset: () => updateTrigHeightsParams({ towerHeight: 40, observerDistance: 40 }),
    },
    {
      levelNumber: 2,
      title: 'The 30° to 60° Board Exam Standard',
      badge: 'Double Angle Walk',
      description: 'Align Observer 1 at 30° and Observer 2 at 60°. Observe the famous relation: the distance walked x = 2 · d₂!',
      requirementFormula: '\\cot(30^\\circ) - \\cot(60^\\circ) = \\frac{2}{\\sqrt{3}} \\implies x = 2d_2',
      targetCriteria: 'Position observers at 30° and 60°',
      xpReward: 45,
      autoPreset: () => updateTrigHeightsParams({
        towerHeight: 35,
        observerDistance: Math.round(35 * Math.sqrt(3)), // ~60m
        secondObserverDistance: Math.round(35 / Math.sqrt(3)), // ~20m
        dualObserverMode: true,
      }),
    },
    {
      levelNumber: 3,
      title: 'Lighthouse Angle of Depression',
      badge: 'Alternate Interior Angles',
      description: 'Switch to Depression mode. Verify that looking down from the top equals looking up from the ground by alternate interior angles!',
      requirementFormula: '\\theta_{\\text{depression}} = \\theta_{\\text{elevation}}',
      targetCriteria: 'Turn on Depression view mode',
      xpReward: 50,
      autoPreset: () => updateTrigHeightsParams({ viewMode: 'depression', towerHeight: 45, observerDistance: 50 }),
    },
  ];

  return (
    <div className="relative w-full h-[calc(100vh-42px)] md:h-[calc(100vh-52px)] overflow-hidden flex flex-col bg-slate-950 text-slate-100 select-none">
      {/* Dynamic HUD Overlay */}
      {!isZenMode && (
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-20 max-w-[210px] sm:max-w-[260px] bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-2 sm:p-2.5 rounded-xl text-xs space-y-1.5 shadow-2xl">
          <div className="flex items-center justify-between font-mono font-bold text-cyan-300">
            <span>Tower Height: h = {towerHeight}m</span>
          </div>

          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800">
            <span className="text-slate-400">Obs 1 Angle θ₁:</span>
            <span className="font-mono text-cyan-400 font-bold">{angle1Deg.toFixed(1)}°</span>
          </div>

          {dualObserverMode && (
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Obs 2 Angle θ₂:</span>
              <span className="font-mono text-amber-300 font-bold">{angle2Deg.toFixed(1)}°</span>
            </div>
          )}

          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">tan(θ₁):</span>
            <span className="font-mono text-emerald-400 font-bold">{tan1.toFixed(3)}</span>
          </div>

          {dualObserverMode && (
            <div className="flex items-center justify-between text-[11px] pt-0.5 border-t border-slate-800">
              <span className="text-pink-400">Walked Dist x:</span>
              <span className="font-mono text-pink-300 font-bold">{walkedDistanceX.toFixed(1)}m</span>
            </div>
          )}
        </div>
      )}

      {/* Main Interactive Stage */}
      <div className="relative flex-1 w-full bg-slate-950 touch-none">
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
        />

        {/* Quick Presets Bar */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 flex flex-wrap gap-1.5 max-w-xs sm:max-w-sm">
          <button
            type="button"
            onClick={() => updateTrigHeightsParams({ towerHeight: 40, observerDistance: 40, dualObserverMode: false })}
            className="py-1 px-2.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-[11px] font-mono font-bold text-cyan-300 cursor-pointer"
          >
            θ = 45° (h = d)
          </button>
          <button
            type="button"
            onClick={() => updateTrigHeightsParams({
              towerHeight: 35,
              observerDistance: 60,
              secondObserverDistance: 20,
              dualObserverMode: true,
            })}
            className="py-1 px-2.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-[11px] font-mono font-bold text-amber-300 cursor-pointer"
          >
            30° - 60° Classic
          </button>
          <button
            type="button"
            onClick={() => updateTrigHeightsParams({ viewMode: viewMode === 'elevation' ? 'depression' : 'elevation' })}
            className={`py-1 px-2.5 rounded-lg border text-[11px] font-mono font-bold cursor-pointer ${
              viewMode === 'depression'
                ? 'bg-rose-950/90 border-rose-600 text-rose-200'
                : 'bg-slate-900/90 border-slate-700 text-slate-300'
            }`}
          >
            {viewMode === 'depression' ? 'Depression Mode' : 'Elevation Mode'}
          </button>
        </div>
      </div>

      {/* Collapsible Mobile Bottom Sheet */}
      <BottomSheet
        title="Heights & Distances Mission Control"
        badgeLabel={`θ₁ = ${angle1Deg.toFixed(1)}°`}
        quickEquation="\tan\theta = \frac{h}{d} \implies h = d \cdot \tan\theta"
        onReset={() => resetParams('trig-heights')}
        theoryContent={
          <CoachTheoryModule
            simulatorId="trig-heights"
            extraLiveDetails={
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-xl bg-cyan-950/30 border border-cyan-800/40">
                    <span className="text-[10px] text-cyan-300 block font-semibold">Tangent Ratio:</span>
                    <span className="font-mono text-white font-bold">tan({angle1Deg.toFixed(1)}°) = {tan1.toFixed(3)}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-amber-950/30 border border-amber-800/40">
                    <span className="text-[10px] text-amber-300 block font-semibold">Calculated Height:</span>
                    <span className="font-mono text-white font-bold">h = {(d1 * tan1).toFixed(1)} m</span>
                  </div>
                </div>

                {dualObserverMode && (
                  <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800 text-center font-mono text-xs">
                    <span className="text-pink-400 font-bold">
                      Walked {walkedDistanceX.toFixed(1)}m from 30° to 60°: x = h(cot 30° - cot 60°)
                    </span>
                  </div>
                )}
              </div>
            }
          />
        }
        challengeContent={
          <div className="space-y-4">
            <ChallengeManager
              simulatorId="trig-heights"
              simulatorTitle="The Lighthouse Clinometer"
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
        <div className="space-y-3">
          <LiveSubstitutionCard
            title={viewMode === 'elevation' ? 'Trigonometric Elevation Invariant' : 'Depression Angle Invariant'}
            badge={viewMode === 'elevation' ? 'Elevation' : 'Depression'}
            symbolicLaw="\tan\theta = \frac{\text{Opposite}}{\text{Adjacent}} = \frac{h}{d} \implies h = d \cdot \tan\theta"
            substitutedLatex={`\\tan(${angle1Deg.toFixed(1)}^\\circ) = \\frac{${towerHeight}\\text{ m}}{${d1}\\text{ m}} = ${tan1.toFixed(3)}`}
            evaluatedLatex={`h = ${towerHeight}\\text{ m}, \\quad d = ${d1}\\text{ m}, \\quad \\theta = ${angle1Deg.toFixed(1)}^\\circ`}
          />

          <TouchSlider
            label="Tower / Lighthouse Height h (meters)"
            value={towerHeight}
            min={10}
            max={75}
            step={1}
            onChange={(val) => updateTrigHeightsParams({ towerHeight: val })}
          />

          <TouchSlider
            label="Observer 1 Distance d₁ (meters)"
            value={d1}
            min={dualObserverMode ? d2 + 5 : 10}
            max={100}
            step={1}
            onChange={(val) => updateTrigHeightsParams({ observerDistance: val })}
          />

          {dualObserverMode && (
            <TouchSlider
              label="Observer 2 Distance d₂ (meters)"
              value={d2}
              min={5}
              max={d1 - 5}
              step={1}
              onChange={(val) => updateTrigHeightsParams({ secondObserverDistance: val })}
            />
          )}

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => updateTrigHeightsParams({ dualObserverMode: !dualObserverMode })}
              className={`p-2 rounded-lg text-xs font-medium border text-center transition-colors cursor-pointer ${
                dualObserverMode
                  ? 'bg-amber-950/80 border-amber-600 text-amber-200'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              {dualObserverMode ? 'Dual Observers (ON)' : 'Single Observer (OFF)'}
            </button>
            <button
              type="button"
              onClick={() => updateTrigHeightsParams({ viewMode: viewMode === 'elevation' ? 'depression' : 'elevation' })}
              className={`p-2 rounded-lg text-xs font-medium border text-center transition-colors cursor-pointer ${
                viewMode === 'depression'
                  ? 'bg-rose-950/80 border-rose-600 text-rose-200'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              {viewMode === 'depression' ? 'Angle: Depression' : 'Angle: Elevation'}
            </button>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
};
