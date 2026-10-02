/**
 * ConicFocalSimulator.tsx: Focal Conics, Gardener's String & Kepler Orbits (Class 11).
 * Features:
 * - Interactive Gardener's String property: verifies d₁ + d₂ = 2a for any point P on an ellipse
 * - Hyperbola difference mode: verifies |d₁ - d₂| = 2a
 * - Directrix lines demonstrating universal conic definition: PF / PD = e
 * - Kepler's 1st Law planetary orbit simulation with Sun at focus F₁
 * - Pure KaTeX coaching theory module and structured board exam challenges
 */
import React, { useEffect, useRef, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  RotateCcw, 
  CheckCircle2, 
  Target, 
  Sliders, 
  Eye, 
  Maximize2,
  Orbit,
  Sun
} from 'lucide-react';
import { useSimulatorStore } from '../../store/useSimulatorStore';
import { BottomSheet } from '../layout/BottomSheet';
import { TouchSlider } from '../common/TouchSlider';
import { CoachTheoryModule } from '../common/CoachTheoryModule';
import { ChallengeManager, ChallengeLevel } from '../common/ChallengeManager';
import { useHaptics } from '../../hooks/useHaptics';
import { useSound } from '../common/SoundManager';
import { useAnalytics } from '../../hooks/useAnalytics';

export const ConicFocalSimulator: React.FC = () => {
  const {
    conicFocalParams,
    updateConicFocalParams,
    resetParams,
    completeChallenge,
    challengeCompleted,
    isZenMode,
  } = useSimulatorStore();

  const {
    conicType,
    semiMajorA,
    eccentricity,
    showString,
    showDirectrix,
    showOrbitingPlanet,
    showFocalRays,
  } = conicFocalParams;

  const { lightTap, successBuzz } = useHaptics();
  const { playClick, playChime } = useSound();
  const { trackEvent } = useAnalytics();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pointAngleRad, setPointAngleRad] = useState(0.8);
  const [isDraggingP, setIsDraggingP] = useState(false);
  const orbitAngleRef = useRef(0);

  // Conic focal calculations
  const a = semiMajorA;
  const e = eccentricity;
  const c = a * e; // focal distance from origin
  const b = conicType === 'ellipse' ? (e < 1 ? a * Math.sqrt(Math.max(0.01, 1 - e * e)) : a) : a * Math.sqrt(Math.max(0.01, e * e - 1));

  // Point P coordinates
  let pX = 0;
  let pY = 0;

  if (conicType === 'ellipse') {
    pX = a * Math.cos(pointAngleRad);
    pY = b * Math.sin(pointAngleRad);
  } else {
    // Hyperbola right branch: x = a·cosh(t), y = b·sinh(t)
    const t = (pointAngleRad - Math.PI / 2) * 1.5;
    pX = a * Math.cosh(Math.max(-2, Math.min(2, t)));
    pY = b * Math.sinh(Math.max(-2, Math.min(2, t)));
  }

  // Foci coordinates F1(-c, 0) and F2(c, 0)
  const f1X = -c;
  const f1Y = 0;
  const f2X = c;
  const f2Y = 0;

  // Focal distances d1 and d2
  const d1 = Math.hypot(pX - f1X, pY - f1Y);
  const d2 = Math.hypot(pX - f2X, pY - f2Y);

  const focalSum = d1 + d2;
  const focalDiff = Math.abs(d1 - d2);

  // Directrix position x = a / e
  const directrixX = e > 0 ? a / e : 1000;

  // Coordinate transforms
  const getTransforms = useCallback((width: number, height: number) => {
    const scale = Math.min(width, height) / 16;
    const originX = width / 2;
    const originY = height / 2;

    const toScreen = (x: number, y: number) => ({
      sx: originX + x * scale,
      sy: originY - y * scale,
    });

    const toMath = (sx: number, sy: number) => ({
      x: (sx - originX) / scale,
      y: (originY - sy) / scale,
    });

    return { scale, originX, originY, toScreen, toMath };
  }, []);

  // Board Exam Challenge Evaluation
  useEffect(() => {
    // Challenge 1: Constant string sum 2a = 10 (a = 5, e = 0.6 in ellipse)
    if (
      conicType === 'ellipse' &&
      Math.abs(a - 5) < 0.2 &&
      Math.abs(focalSum - 10) < 0.2 &&
      !challengeCompleted['conic_string_10']
    ) {
      completeChallenge('conic_string_10', 40);
      successBuzz();
      playChime();
      confetti({ particleCount: 40, spread: 60 });
      trackEvent('challenge_completed', { challengeId: 'conic_string_10' });
    }

    // Challenge 2: Transition to Hyperbola (conicType === 'hyperbola' and e >= 1.4)
    if (
      conicType === 'hyperbola' &&
      e >= 1.3 &&
      !challengeCompleted['conic_hyperbola_transition']
    ) {
      completeChallenge('conic_hyperbola_transition', 45);
      successBuzz();
      playChime();
      confetti({ particleCount: 40, spread: 60 });
      trackEvent('challenge_completed', { challengeId: 'conic_hyperbola_transition' });
    }

    // Challenge 3: Keplerian Orbit Mode active
    if (showOrbitingPlanet && conicType === 'ellipse' && !challengeCompleted['conic_kepler_orbit']) {
      completeChallenge('conic_kepler_orbit', 50);
      successBuzz();
      playChime();
      confetti({ particleCount: 40, spread: 60 });
      trackEvent('challenge_completed', { challengeId: 'conic_kepler_orbit' });
    }
  }, [conicType, a, e, focalSum, showOrbitingPlanet, challengeCompleted, completeChallenge, successBuzz, playChime, trackEvent]);

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

      const { scale, originX, originY, toScreen } = getTransforms(width, height);

      // Coordinate axes
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, originY);
      ctx.lineTo(width, originY);
      ctx.moveTo(originX, 0);
      ctx.lineTo(originX, height);
      ctx.stroke();

      const sO = toScreen(0, 0);
      const sF1 = toScreen(f1X, f1Y);
      const sF2 = toScreen(f2X, f2Y);
      const sP = toScreen(pX, pY);

      // Draw Conic Curve
      if (conicType === 'ellipse') {
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(sO.sx, sO.sy, a * scale, b * scale, 0, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = 'rgba(56, 189, 248, 0.05)';
        ctx.fill();
      } else {
        // Hyperbola branches
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 3;

        // Right branch
        ctx.beginPath();
        for (let t = -2.2; t <= 2.2; t += 0.05) {
          const pt = toScreen(a * Math.cosh(t), b * Math.sinh(t));
          if (t === -2.2) ctx.moveTo(pt.sx, pt.sy);
          else ctx.lineTo(pt.sx, pt.sy);
        }
        ctx.stroke();

        // Left branch
        ctx.beginPath();
        for (let t = -2.2; t <= 2.2; t += 0.05) {
          const pt = toScreen(-a * Math.cosh(t), b * Math.sinh(t));
          if (t === -2.2) ctx.moveTo(pt.sx, pt.sy);
          else ctx.lineTo(pt.sx, pt.sy);
        }
        ctx.stroke();
      }

      // Directrix Lines x = ± a / e
      if (showDirectrix && e > 0) {
        const sDirR = toScreen(directrixX, 0);
        const sDirL = toScreen(-directrixX, 0);

        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(sDirR.sx, 0);
        ctx.lineTo(sDirR.sx, height);
        ctx.moveTo(sDirL.sx, 0);
        ctx.lineTo(sDirL.sx, height);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 10px monospace';
        ctx.fillText(`Directrix: x = a/e`, sDirR.sx + 4, 25);
      }

      // Taut String / Focal Rays PF1 and PF2
      if (showString || showFocalRays) {
        ctx.lineWidth = 2.5;

        // Ray PF1 (Cyan)
        ctx.strokeStyle = '#06b6d4';
        ctx.beginPath();
        ctx.moveTo(sF1.sx, sF1.sy);
        ctx.lineTo(sP.sx, sP.sy);
        ctx.stroke();

        // Ray PF2 (Amber)
        ctx.strokeStyle = '#f59e0b';
        ctx.beginPath();
        ctx.moveTo(sF2.sx, sF2.sy);
        ctx.lineTo(sP.sx, sP.sy);
        ctx.stroke();

        // Labels for d1 and d2
        const midF1P = { sx: (sF1.sx + sP.sx) / 2, sy: (sF1.sy + sP.sy) / 2 };
        const midF2P = { sx: (sF2.sx + sP.sx) / 2, sy: (sF2.sy + sP.sy) / 2 };

        ctx.font = 'bold 11px monospace';
        ctx.fillStyle = '#06b6d4';
        ctx.fillText(`d₁ = ${d1.toFixed(2)}`, midF1P.sx - 20, midF1P.sy - 8);

        ctx.fillStyle = '#fbbf24';
        ctx.fillText(`d₂ = ${d2.toFixed(2)}`, midF2P.sx + 6, midF2P.sy + 12);
      }

      // Foci Markers
      // Focus F1 (Sun position in Kepler orbit)
      if (showOrbitingPlanet) {
        // Glowing Sun at F1
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(sF1.sx, sF1.sy, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText('Sun (F₁)', sF1.sx - 18, sF1.sy + 20);
      } else {
        ctx.fillStyle = '#06b6d4';
        ctx.beginPath();
        ctx.arc(sF1.sx, sF1.sy, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.fillText('F₁(-c,0)', sF1.sx - 18, sF1.sy + 16);
      }

      // Focus F2
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(sF2.sx, sF2.sy, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.fillText('F₂(c,0)', sF2.sx - 12, sF2.sy + 16);

      // Orbiting Planet Animation (Kepler's Law)
      if (showOrbitingPlanet && conicType === 'ellipse') {
        orbitAngleRef.current += 0.025;
        const plX = a * Math.cos(orbitAngleRef.current);
        const plY = b * Math.sin(orbitAngleRef.current);
        const sPlanet = toScreen(plX, plY);

        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(sPlanet.sx, sPlanet.sy, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = '#34d399';
        ctx.font = 'bold 10px monospace';
        ctx.fillText('Planet', sPlanet.sx + 8, sPlanet.sy - 4);
      }

      // Draggable Point P on the curve
      ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.beginPath();
      ctx.arc(sP.sx, sP.sy, 16, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(sP.sx, sP.sy, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.font = 'bold 12px sans-serif';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText(`P (${pX.toFixed(1)}, ${pY.toFixed(1)})`, sP.sx + 10, sP.sy - 10);

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [
    conicType,
    a,
    b,
    c,
    e,
    f1X,
    f1Y,
    f2X,
    f2Y,
    pX,
    pY,
    d1,
    d2,
    directrixX,
    showString,
    showDirectrix,
    showOrbitingPlanet,
    showFocalRays,
    getTransforms,
  ]);

  // Pointer drag to orbit point P around curve
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;

    const { toScreen } = getTransforms(rect.width, rect.height);
    const sP = toScreen(pX, pY);

    if (Math.hypot(sx - sP.sx, sy - sP.sy) < 30) {
      setIsDraggingP(true);
      canvas.setPointerCapture(e.pointerId);
      lightTap();
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDraggingP) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;

    const { toMath } = getTransforms(rect.width, rect.height);
    const mathPt = toMath(sx, sy);
    const newAngle = Math.atan2(mathPt.y, mathPt.x);
    setPointAngleRad(newAngle);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isDraggingP) {
      setIsDraggingP(false);
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
      title: "The Constant Taut String 2a = 10",
      badge: 'd₁ + d₂ = 2a',
      description: 'Set semi-major axis a = 5 and drag point P around the ellipse. Verify that d₁ + d₂ is strictly locked at 10!',
      requirementFormula: 'd_1 + d_2 = 2a = 10 \\quad (\\text{Constant String})',
      targetCriteria: 'Set a = 5 in Ellipse mode',
      xpReward: 40,
      autoPreset: () => updateConicFocalParams({ conicType: 'ellipse', semiMajorA: 5, eccentricity: 0.6 }),
    },
    {
      levelNumber: 2,
      title: 'Hyperbola Distance Deficit',
      badge: '|d₁ - d₂| = 2a',
      description: 'Switch to Hyperbola mode (e > 1). Observe that the difference |d₁ - d₂| equals 2a instead of the sum!',
      requirementFormula: '|d_1 - d_2| = 2a',
      targetCriteria: 'Set mode to hyperbola and e > 1.3',
      xpReward: 45,
      autoPreset: () => updateConicFocalParams({ conicType: 'hyperbola', semiMajorA: 4, eccentricity: 1.5 }),
    },
    {
      levelNumber: 3,
      title: "Kepler's 1st Law Orbital Sun",
      badge: 'Kepler Orbit',
      description: 'Activate Kepler planetary orbit mode with Sun at focus F₁. Watch the planet sweep around the gravitational focus!',
      requirementFormula: 'r(\\theta) = \\frac{a(1 - e^2)}{1 + e\\cos\\theta}',
      targetCriteria: 'Enable Kepler orbit animation in Ellipse mode',
      xpReward: 50,
      autoPreset: () => updateConicFocalParams({ conicType: 'ellipse', semiMajorA: 5, eccentricity: 0.5, showOrbitingPlanet: true }),
    },
  ];

  return (
    <div className="relative w-full h-[calc(100vh-42px)] md:h-[calc(100vh-52px)] overflow-hidden flex flex-col bg-slate-950 text-slate-100 select-none">
      {/* Dynamic HUD Overlay */}
      {!isZenMode && (
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-20 max-w-[210px] sm:max-w-[260px] bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-2 sm:p-2.5 rounded-xl text-xs space-y-1.5 shadow-2xl">
          <div className="flex items-center justify-between font-mono font-bold text-cyan-300">
            <span>
              {conicType === 'ellipse'
                ? `String: d₁ + d₂ = ${focalSum.toFixed(2)}`
                : `Diff: |d₁ - d₂| = ${focalDiff.toFixed(2)}`}
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800">
            <span className="text-slate-400">Major Axis 2a:</span>
            <span className="font-mono text-cyan-400 font-bold">{(2 * a).toFixed(1)} u</span>
          </div>

          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Eccentricity e:</span>
            <span className="font-mono text-amber-300 font-bold">{e.toFixed(2)}</span>
          </div>

          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Foci Dist c = ae:</span>
            <span className="font-mono text-emerald-400 font-bold">{c.toFixed(2)} u</span>
          </div>
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
            onClick={() => updateConicFocalParams({ conicType: 'ellipse', semiMajorA: 5, eccentricity: 0.6 })}
            className={`py-1 px-2.5 rounded-lg border text-[11px] font-mono font-bold cursor-pointer ${
              conicType === 'ellipse' && !showOrbitingPlanet
                ? 'bg-cyan-950 border-cyan-500 text-cyan-200'
                : 'bg-slate-900/90 border-slate-700 text-slate-300'
            }`}
          >
            Ellipse 2a = 10
          </button>
          <button
            type="button"
            onClick={() => updateConicFocalParams({ conicType: 'hyperbola', semiMajorA: 4, eccentricity: 1.5, showOrbitingPlanet: false })}
            className={`py-1 px-2.5 rounded-lg border text-[11px] font-mono font-bold cursor-pointer ${
              conicType === 'hyperbola'
                ? 'bg-rose-950 border-rose-500 text-rose-200'
                : 'bg-slate-900/90 border-slate-700 text-slate-300'
            }`}
          >
            Hyperbola (e=1.5)
          </button>
          <button
            type="button"
            onClick={() => updateConicFocalParams({ conicType: 'ellipse', semiMajorA: 5, eccentricity: 0.5, showOrbitingPlanet: !showOrbitingPlanet })}
            className={`py-1 px-2.5 rounded-lg border text-[11px] font-mono font-bold cursor-pointer ${
              showOrbitingPlanet
                ? 'bg-amber-950 border-amber-500 text-amber-200'
                : 'bg-slate-900/90 border-slate-700 text-slate-300'
            }`}
          >
            Kepler Orbit {showOrbitingPlanet ? '(ON)' : '(OFF)'}
          </button>
        </div>
      </div>

      {/* Collapsible Mobile Bottom Sheet */}
      <BottomSheet
        title="Focal Conics & Orbits Mission Control"
        badgeLabel={`e = ${e.toFixed(2)}`}
        quickEquation={
          conicType === 'ellipse'
            ? 'd_1 + d_2 = 2a \\quad (e < 1)'
            : '|d_1 - d_2| = 2a \\quad (e > 1)'
        }
        onReset={() => resetParams('hyperbola-ellipse-orbits')}
        theoryContent={
          <CoachTheoryModule
            simulatorId="hyperbola-ellipse-orbits"
            extraLiveDetails={
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2 text-xs text-center font-mono">
                  <div className="p-2 rounded-xl bg-cyan-950/30 border border-cyan-800/40">
                    <span className="text-[10px] text-cyan-300 block font-semibold">Focus Distance c = ae:</span>
                    <span className="text-white font-bold">{c.toFixed(2)} u</span>
                  </div>
                  <div className="p-2 rounded-xl bg-amber-950/30 border border-amber-800/40">
                    <span className="text-[10px] text-amber-300 block font-semibold">Directrix Distance a/e:</span>
                    <span className="text-white font-bold">{directrixX.toFixed(2)} u</span>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800 text-center font-mono text-xs">
                  <span className="text-emerald-400 font-bold">
                    {conicType === 'ellipse'
                      ? `Taut String Sum: d₁ + d₂ = ${focalSum.toFixed(2)} = 2a = ${(2 * a).toFixed(1)}`
                      : `Hyperbolic Deficit: |d₁ - d₂| = ${focalDiff.toFixed(2)} = 2a = ${(2 * a).toFixed(1)}`}
                  </span>
                </div>
              </div>
            }
          />
        }
        challengeContent={
          <div className="space-y-4">
            <ChallengeManager
              simulatorId="hyperbola-ellipse-orbits"
              simulatorTitle="The Focal Orbit Lab"
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
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900 border border-slate-800 rounded-xl">
            <button
              type="button"
              onClick={() => updateConicFocalParams({ conicType: 'ellipse', eccentricity: 0.6 })}
              className={`py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                conicType === 'ellipse' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'
              }`}
            >
              Ellipse Mode (e &lt; 1)
            </button>
            <button
              type="button"
              onClick={() => updateConicFocalParams({ conicType: 'hyperbola', eccentricity: 1.4, showOrbitingPlanet: false })}
              className={`py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                conicType === 'hyperbola' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'
              }`}
            >
              Hyperbola Mode (e &gt; 1)
            </button>
          </div>

          <TouchSlider
            label="Semi-Major Axis a"
            value={semiMajorA}
            min={3}
            max={7}
            step={0.5}
            onChange={(val) => updateConicFocalParams({ semiMajorA: val })}
          />

          <TouchSlider
            label="Eccentricity e"
            value={eccentricity}
            min={conicType === 'ellipse' ? 0.1 : 1.1}
            max={conicType === 'ellipse' ? 0.9 : 2.5}
            step={0.05}
            onChange={(val) => updateConicFocalParams({ eccentricity: Number(val.toFixed(2)) })}
          />

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => updateConicFocalParams({ showDirectrix: !showDirectrix })}
              className={`p-2 rounded-lg text-xs font-medium border text-center transition-colors cursor-pointer ${
                showDirectrix
                  ? 'bg-amber-950 border-amber-500 text-amber-200'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              Directrix x = ±a/e
            </button>
            <button
              type="button"
              onClick={() => updateConicFocalParams({ showOrbitingPlanet: !showOrbitingPlanet })}
              className={`p-2 rounded-lg text-xs font-medium border text-center transition-colors cursor-pointer ${
                showOrbitingPlanet
                  ? 'bg-emerald-950 border-emerald-500 text-emerald-200'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              Kepler Orbit
            </button>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
};
