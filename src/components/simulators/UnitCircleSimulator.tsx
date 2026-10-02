import React, { useEffect, useRef, useState } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles, 
  CheckCircle,
  Eye,
  Sliders,
  Compass
} from 'lucide-react';
import { useSimulatorStore } from '../../store/useSimulatorStore';
import { BottomSheet } from '../layout/BottomSheet';
import { TouchSlider } from '../common/TouchSlider';
import { MathFormula } from '../common/MathFormula';
import { CoachTheoryModule } from '../common/CoachTheoryModule';
import { ChallengeManager } from '../common/ChallengeManager';
import { useHaptics } from '../../hooks/useHaptics';
import { useSound } from '../common/SoundManager';
import { ConceptInsightBanner } from '../common/ConceptInsightBanner';

export const UnitCircleSimulator: React.FC = () => {
  const {
    unitCircleParams,
    updateUnitCircleParams,
    resetParams,
    completeChallenge,
    challengeCompleted,
    isZenMode,
  } = useSimulatorStore();

  const { lightTap } = useHaptics();
  const { playClick } = useSound();
  const lastAngleRef = useRef(unitCircleParams.angleDeg);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDraggingCircle, setIsDraggingCircle] = useState(false);

  const angleRad = (unitCircleParams.angleDeg * Math.PI) / 180;
  const sinVal = Math.sin(angleRad);
  const cosVal = Math.cos(angleRad);
  const tanVal = Math.abs(cosVal) > 0.001 ? Math.tan(angleRad) : Infinity;

  // Animation loop when playing
  useEffect(() => {
    if (!unitCircleParams.isPlayingAnimation) return;

    let animId: number;
    const speed = 1.2 * unitCircleParams.frequency;

    const tick = () => {
      updateUnitCircleParams({
        angleDeg: (unitCircleParams.angleDeg + speed) % 360,
      });
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [unitCircleParams.isPlayingAnimation, unitCircleParams.angleDeg, unitCircleParams.frequency, updateUnitCircleParams]);

  // Check mission accomplishments
  useEffect(() => {
    if (Math.abs(unitCircleParams.angleDeg - 90) < 2 && !challengeCompleted['unit_sin_max']) {
      completeChallenge('unit_sin_max', 35);
    }
    if (Math.abs(unitCircleParams.angleDeg - 45) < 2 && !challengeCompleted['unit_equal_trig']) {
      completeChallenge('unit_equal_trig', 45);
    }
  }, [unitCircleParams.angleDeg, challengeCompleted, completeChallenge]);

  // Touch & Pointer interaction on the unit circle
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if touch is in the left circle area
    const isMobile = rect.width < 640;
    const circleCenterX = isMobile ? rect.width / 2 : rect.width * 0.32;
    const circleCenterY = isMobile ? rect.height * 0.28 : rect.height * 0.44;

    const dist = Math.hypot(x - circleCenterX, y - circleCenterY);
    if (dist < 180) {
      setIsDraggingCircle(true);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      updateAngleFromPoint(x, y, circleCenterX, circleCenterY);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDraggingCircle) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const isMobile = rect.width < 640;
    const circleCenterX = isMobile ? rect.width / 2 : rect.width * 0.32;
    const circleCenterY = isMobile ? rect.height * 0.28 : rect.height * 0.44;

    updateAngleFromPoint(x, y, circleCenterX, circleCenterY);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsDraggingCircle(false);
  };

  const updateAngleFromPoint = (px: number, py: number, cx: number, cy: number) => {
    const dx = px - cx;
    const dy = cy - py; // Inverted for math coordinate standard
    let rad = Math.atan2(dy, dx);
    if (rad < 0) rad += Math.PI * 2;
    const deg = Math.round((rad * 180) / Math.PI);
    if (Math.abs(deg - lastAngleRef.current) >= 3) {
      lastAngleRef.current = deg;
      lightTap();
      playClick(0.7 + (deg / 360) * 0.9);
    }
    updateUnitCircleParams({ angleDeg: deg });
  };

  // High performance Canvas 2D render loop
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
      // Layout layout: Mobile stacks circle on top & wave below; desktop places side by side
      const circleCenterX = isMobile ? width / 2 : width * 0.30;
      const circleCenterY = isMobile ? height * 0.26 : height * 0.44;
      const circleRadius = isMobile ? Math.min(width * 0.34, 110) : Math.min(width * 0.22, 140);

      // 1. Draw Grid Lines on background
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. Draw Unit Circle Axes
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.5;

      // X axis
      ctx.beginPath();
      ctx.moveTo(circleCenterX - circleRadius - 30, circleCenterY);
      ctx.lineTo(circleCenterX + circleRadius + 30, circleCenterY);
      ctx.stroke();

      // Y axis
      ctx.beginPath();
      ctx.moveTo(circleCenterX, circleCenterY - circleRadius - 30);
      ctx.lineTo(circleCenterX, circleCenterY + circleRadius + 30);
      ctx.stroke();

      // Axis labels
      ctx.fillStyle = '#64748b';
      ctx.font = '10px monospace';
      ctx.fillText('+1', circleCenterX + circleRadius + 4, circleCenterY - 4);
      ctx.fillText('-1', circleCenterX - circleRadius - 16, circleCenterY - 4);
      ctx.fillText('+1', circleCenterX + 4, circleCenterY - circleRadius - 6);
      ctx.fillText('-1', circleCenterX + 4, circleCenterY + circleRadius + 14);

      // 3. Draw Unit Circle Outline
      ctx.beginPath();
      ctx.arc(circleCenterX, circleCenterY, circleRadius, 0, Math.PI * 2);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Special angle tick marks (30, 45, 60, 90, etc.)
      const specialAngles = [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330];
      specialAngles.forEach((ang) => {
        const rad = (ang * Math.PI) / 180;
        const tx = circleCenterX + Math.cos(rad) * circleRadius;
        const ty = circleCenterY - Math.sin(rad) * circleRadius;
        ctx.beginPath();
        ctx.arc(tx, ty, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#64748b';
        ctx.fill();
      });

      // 4. Current Point Coordinates on Unit Circle
      const pointX = circleCenterX + Math.cos(angleRad) * circleRadius;
      const pointY = circleCenterY - Math.sin(angleRad) * circleRadius;

      // Angle Arc
      ctx.beginPath();
      ctx.arc(circleCenterX, circleCenterY, 28, 0, -angleRad, true);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Angle theta text
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 11px monospace';
      ctx.fillText(`θ = ${unitCircleParams.angleDeg}°`, circleCenterX + 34, circleCenterY - 8);

      // Reference Triangle & Projections
      // Cosine projection (Emerald base)
      if (unitCircleParams.showCos) {
        ctx.beginPath();
        ctx.moveTo(circleCenterX, circleCenterY);
        ctx.lineTo(pointX, circleCenterY);
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 10px monospace';
        ctx.fillText(`cos: ${cosVal.toFixed(2)}`, circleCenterX + (pointX - circleCenterX) / 2 - 16, circleCenterY + 16);
      }

      // Sine projection (Cyan vertical)
      if (unitCircleParams.showSin) {
        ctx.beginPath();
        ctx.moveTo(pointX, circleCenterY);
        ctx.lineTo(pointX, pointY);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 10px monospace';
        ctx.fillText(`sin: ${sinVal.toFixed(2)}`, pointX + 6, circleCenterY + (pointY - circleCenterY) / 2);
      }

      // Tangent Line (Amber vertical from x=1)
      if (unitCircleParams.showTan && Math.abs(cosVal) > 0.05) {
        const tanY = circleCenterY - tanVal * circleRadius;
        if (Math.abs(tanY - circleCenterY) < height * 0.8) {
          ctx.beginPath();
          ctx.moveTo(circleCenterX + circleRadius, circleCenterY);
          ctx.lineTo(circleCenterX + circleRadius, tanY);
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 2.5;
          ctx.stroke();

          // Extended ray to tangent
          ctx.beginPath();
          ctx.moveTo(circleCenterX, circleCenterY);
          ctx.lineTo(circleCenterX + circleRadius, tanY);
          ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
          ctx.setLineDash([3, 3]);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }

      // Radius Vector (Hypotenuse)
      ctx.beginPath();
      ctx.moveTo(circleCenterX, circleCenterY);
      ctx.lineTo(pointX, pointY);
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Touch Point Dot
      ctx.beginPath();
      ctx.arc(pointX, pointY, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#f59e0b';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // 5. Draw Right-side or Lower Harmonic Wave Unroller
      if (unitCircleParams.showWaveProjection) {
        const waveStartX = isMobile ? 24 : width * 0.58;
        const waveEndX = isMobile ? width - 24 : width - 24;
        const waveCenterY = isMobile ? height * 0.58 : height * 0.44;
        const waveWidth = waveEndX - waveStartX;
        const waveAmp = (circleRadius * 0.75) * unitCircleParams.amplitude;

        // Wave baseline
        ctx.beginPath();
        ctx.moveTo(waveStartX, waveCenterY);
        ctx.lineTo(waveEndX, waveCenterY);
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Wave curve y = A * sin(kx - phase)
        ctx.beginPath();
        const waveSteps = 120;
        for (let i = 0; i <= waveSteps; i++) {
          const t = i / waveSteps;
          const wx = waveStartX + t * waveWidth;
          // Unrolling phase offset matches current unit circle angle
          const currentPhase = angleRad;
          const theta = currentPhase - t * Math.PI * 4 * unitCircleParams.frequency;
          const wy = waveCenterY - Math.sin(theta) * waveAmp;

          if (i === 0) ctx.moveTo(wx, wy);
          else ctx.lineTo(wx, wy);
        }
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Wave leading point at waveStartX
        const waveHeadY = waveCenterY - Math.sin(angleRad) * waveAmp;
        ctx.beginPath();
        ctx.arc(waveStartX, waveHeadY, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#38bdf8';
        ctx.fill();

        // Connecting dashed tracking line from unit circle to wave
        ctx.beginPath();
        ctx.moveTo(pointX, pointY);
        ctx.lineTo(waveStartX, waveHeadY);
        ctx.strokeStyle = 'rgba(244, 63, 94, 0.6)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Wave Label
        ctx.fillStyle = '#64748b';
        ctx.font = '10px monospace';
        ctx.fillText(`Wave: y = ${unitCircleParams.amplitude}·sin(${unitCircleParams.frequency}t)`, waveStartX, waveCenterY - waveAmp - 8);
      }

      ctx.restore();
    };

    render();
    window.addEventListener('resize', render);
    return () => {
      window.removeEventListener('resize', render);
      cancelAnimationFrame(animId);
    };
  }, [unitCircleParams, angleRad, sinVal, cosVal, tanVal]);

  return (
    <div className="relative w-full flex-1 min-h-0 h-full overflow-hidden flex flex-col bg-slate-950">
      {/* 2D Interactive Unit Circle Canvas */}
      <div className="relative w-full h-full flex-1">
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="w-full h-full cursor-crosshair touch-none"
        />

        {/* Real-time Pedagogical Concept Insight Banner */}
        <ConceptInsightBanner
          conceptTitle="The Unit Circle: Coordinates Are (cos θ, sin θ)"
          mathInsight={`Point P(x, y) = (cos ${unitCircleParams.angleDeg}°, sin ${unitCircleParams.angleDeg}°) = (${cosVal.toFixed(3)}, ${sinVal.toFixed(3)}). Pythagorean Identity: cos²(θ) + sin²(θ) = (${(cosVal * cosVal).toFixed(3)} + ${(sinVal * sinVal).toFixed(3)}) = ${(cosVal * cosVal + sinVal * sinVal).toFixed(3)} ≡ 1.`}
          eli10Analogy="Think of a lighthouse beam spinning in a dark sea: Cosine measures how far EAST or WEST the light shines, and Sine measures how far NORTH or SOUTH it reaches! Because the beam is 1 unit long, Pythagoras guarantees cos²θ + sin²θ is always 1!"
          liveFeedback={
            unitCircleParams.angleDeg === 90
              ? 'Peak Sine: sin(90°) = 1.000, cos(90°) = 0.000 (Pure Vertical)'
              : unitCircleParams.angleDeg === 45
              ? 'Equinox: sin(45°) = cos(45°) = 1/√2 ≈ 0.707 (Perfect Symmetry)'
              : unitCircleParams.angleDeg === 0
              ? 'Pure Cosine: cos(0°) = 1.000, sin(0°) = 0.000 (Pure Horizontal)'
              : unitCircleParams.angleDeg === 180
              ? 'Negative Cosine: cos(180°) = -1.000, sin(180°) = 0.000'
              : `Quadrant ${unitCircleParams.angleDeg < 90 ? 'I (Both Positive)' : unitCircleParams.angleDeg < 180 ? 'II (sin+, cos-)' : unitCircleParams.angleDeg < 270 ? 'III (Both Negative)' : 'IV (sin-, cos+)'}: (${cosVal.toFixed(2)}, ${sinVal.toFixed(2)})`
          }
          quickAction={{
            label: "Alka Ma'am's 45° Equinox (sin = cos)",
            onApply: () => updateUnitCircleParams({ angleDeg: 45 }),
          }}
        />

        {/* Progressive Challenge Manager */}
        <ChallengeManager
          simulatorId="unit-circle"
          simulatorTitle="Unit Circle & Harmonic Waves"
          levels={[
            {
              levelNumber: 1,
              title: 'Level 1: The 90° Sine Peak',
              badge: 'sin(90°) = 1.0',
              description: 'Rotate the radius arm to 90° where vertical projection sin(θ) reaches its maximum amplitude of 1.0.',
              requirementFormula: 'θ = 90° · sin(90°) = 1.000 · cos(90°) = 0.000',
              targetCriteria: 'Set angle to exactly 90°',
              xpReward: 40,
              autoPreset: () => updateUnitCircleParams({ angleDeg: 90 }),
            },
            {
              levelNumber: 2,
              title: 'Level 2: The 45° Symmetry Point',
              badge: 'sin(θ) = cos(θ)',
              description: 'Dial θ = 45° where both sine and cosine components are identical (√2/2 ≈ 0.707).',
              requirementFormula: 'sin(45°) = cos(45°) = 1/√2 ≈ 0.7071',
              targetCriteria: 'Set angle to 45° in Quadrant I',
              xpReward: 50,
              autoPreset: () => updateUnitCircleParams({ angleDeg: 45 }),
            },
            {
              levelNumber: 3,
              title: 'Level 3: Tangent Singularity (Asymptote)',
              badge: 'tan(θ) Limit',
              description: 'Approach the 270° angle in Quadrant III/IV where cosine passes through zero and tan(θ) diverges.',
              requirementFormula: 'tan(θ) = sin(θ)/cos(θ) → ∞ as cos(θ) → 0',
              targetCriteria: 'Set angle to 270° where sin(θ) = -1 and tan is undefined',
              xpReward: 60,
              autoPreset: () => updateUnitCircleParams({ angleDeg: 270 }),
            },
          ]}
          onTriggerPreset={(lvl) => {
            if (lvl === 1) updateUnitCircleParams({ angleDeg: 90 });
            else if (lvl === 2) updateUnitCircleParams({ angleDeg: 45 });
            else if (lvl === 3) updateUnitCircleParams({ angleDeg: 270 });
          }}
        />

        {/* Real-time Floating Values HUD */}
        {!isZenMode && (
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3 max-w-[190px] sm:max-w-[210px] bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-2 sm:p-2.5 rounded-xl text-xs space-y-1 shadow-xl pointer-events-none z-10">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-medium text-[11px]">Angle θ</span>
              <span className="font-bold text-amber-400 font-mono text-[11px] sm:text-xs">
                {unitCircleParams.angleDeg}°
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-cyan-400 font-medium">sin(θ)</span>
              <span className="font-mono tabular-nums text-cyan-300 font-bold">
                {sinVal.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-emerald-400 font-medium">cos(θ)</span>
              <span className="font-mono tabular-nums text-emerald-300 font-bold">
                {cosVal.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between text-[10px] sm:text-[11px]">
              <span className="text-amber-400 font-medium">tan(θ)</span>
              <span className="font-mono tabular-nums text-amber-300">
                {Math.abs(cosVal) > 0.001 ? tanVal.toFixed(2) : '∞'}
              </span>
            </div>
          </div>
        )}

        {/* Quick Animation Play FAB */}
        <button
          onClick={() =>
            updateUnitCircleParams({
              isPlayingAnimation: !unitCircleParams.isPlayingAnimation,
            })
          }
          className={`absolute bottom-28 left-4 z-40 p-3 rounded-full shadow-lg transition-transform active:scale-95 flex items-center gap-2 text-xs font-bold ${
            unitCircleParams.isPlayingAnimation
              ? 'bg-amber-500 text-slate-950'
              : 'bg-cyan-500 text-slate-950'
          }`}
          aria-label={unitCircleParams.isPlayingAnimation ? 'Pause Animation' : 'Play Wave Unroll'}
        >
          {unitCircleParams.isPlayingAnimation ? (
            <>
              <Pause className="w-4 h-4 fill-current" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Unroll Wave</span>
            </>
          )}
        </button>
      </div>

      {/* Mobile Collapsible Bottom Sheet */}
      <BottomSheet
        title="Unit Circle & Wave Parameters"
        badgeLabel={`sin(${unitCircleParams.angleDeg}°) = ${sinVal.toFixed(2)}`}
        quickEquation={`sin²θ + cos²θ = 1.000`}
        onReset={() => resetParams('unit-circle')}
        theoryContent={
          <CoachTheoryModule
            simulatorId="unit-circle"
            extraLiveDetails={
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-xl bg-cyan-950/30 border border-cyan-800/40">
                    <span className="text-[10px] text-cyan-300 block font-semibold">sin(θ)</span>
                    <span className="font-mono text-white font-bold">{sinVal.toFixed(3)}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-emerald-950/30 border border-emerald-800/40">
                    <span className="text-[10px] text-emerald-300 block font-semibold">cos(θ)</span>
                    <span className="font-mono text-white font-bold">{cosVal.toFixed(3)}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-amber-950/30 border border-amber-800/40">
                    <span className="text-[10px] text-amber-300 block font-semibold">tan(θ)</span>
                    <span className="font-mono text-white font-bold">
                      {Math.abs(cosVal) < 0.001 ? '±∞' : (sinVal / cosVal).toFixed(3)}
                    </span>
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800 text-center font-mono text-xs text-cyan-300">
                  sin²({unitCircleParams.angleDeg}°) + cos²({unitCircleParams.angleDeg}°) = {(sinVal * sinVal + cosVal * cosVal).toFixed(4)}
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
                Class 10 Trigonometry Missions
              </span>
              <p className="text-slate-300">
                Drag the point or adjust the angle slider to complete these exact geometric targets.
              </p>
            </div>

            <div className="space-y-2">
              <div className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
                challengeCompleted['unit_sin_max']
                  ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300'
              }`}>
                <div className="space-y-0.5">
                  <div className="font-semibold text-white">Mission 1: Peak Amplitude</div>
                  <div className="text-[11px] text-slate-400">Reach θ = 90° where sin(90°) = 1.000</div>
                </div>
                {challengeCompleted['unit_sin_max'] ? (
                  <span className="flex items-center gap-1 font-bold text-emerald-400 text-xs">
                    <CheckCircle className="w-4 h-4" />
                    +35 XP
                  </span>
                ) : (
                  <span className="text-xs font-mono text-amber-400 bg-amber-950/60 px-2 py-1 rounded">
                    35 XP
                  </span>
                )}
              </div>

              <div className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
                challengeCompleted['unit_equal_trig']
                  ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300'
              }`}>
                <div className="space-y-0.5">
                  <div className="font-semibold text-white">Mission 2: The 45° Equinox</div>
                  <div className="text-[11px] text-slate-400">Position θ = 45° where sin(θ) = cos(θ) = 1/√2 ≈ 0.707</div>
                </div>
                {challengeCompleted['unit_equal_trig'] ? (
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
            </div>
          </div>
        }
      >
        {/* Controls Tab */}
        <div className="space-y-2">
          <TouchSlider
            label="Angle (θ)"
            min={0}
            max={360}
            step={1}
            unit="°"
            value={unitCircleParams.angleDeg}
            formulaTerm="θ"
            causeEffectHint={(val) =>
              `P = (cos ${val}°, sin ${val}°) = (${Math.cos(val * Math.PI / 180).toFixed(2)}, ${Math.sin(val * Math.PI / 180).toFixed(2)}). cos²θ + sin²θ = 1.000`
            }
            onChange={(val) => updateUnitCircleParams({ angleDeg: val })}
          />

          <div className="grid grid-cols-2 gap-2">
            <TouchSlider
              label="Frequency (ω)"
              min={0.5}
              max={3}
              step={0.25}
              unit="x"
              value={unitCircleParams.frequency}
              formulaTerm="ω"
              causeEffectHint={(val) => `Rotation speed: wave period T = 2π/${val}`}
              onChange={(val) => updateUnitCircleParams({ frequency: val })}
            />

            <TouchSlider
              label="Amplitude (A)"
              min={0.4}
              max={1.6}
              step={0.1}
              value={unitCircleParams.amplitude}
              formulaTerm="A"
              causeEffectHint={(val) => `Radius scaling: oscillates between ±${val}u`}
              onChange={(val) => updateUnitCircleParams({ amplitude: val })}
            />
          </div>

          {/* Special Angle Snaps */}
          <div className="pt-1.5 border-t border-slate-800/80">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Exact Angles
            </span>
            <div className="grid grid-cols-6 gap-1">
              {[0, 30, 45, 60, 90, 180].map((deg) => (
                <button
                  key={deg}
                  type="button"
                  onClick={() => updateUnitCircleParams({ angleDeg: deg })}
                  className={`py-1 rounded-lg text-[10px] font-mono font-semibold transition-colors border cursor-pointer ${
                    unitCircleParams.angleDeg === deg
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                      : 'bg-slate-800/80 text-slate-300 border-slate-700/60 hover:bg-slate-700'
                  }`}
                >
                  {deg}°
                </button>
              ))}
            </div>
          </div>

          {/* Visibility Toggles */}
          <div className="pt-1.5 border-t border-slate-800/80 grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => updateUnitCircleParams({ showSin: !unitCircleParams.showSin })}
              className={`p-1.5 rounded-lg border text-[11px] font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                unitCircleParams.showSin
                  ? 'bg-cyan-950/50 border-cyan-700 text-cyan-300'
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
            >
              <span>Sine Bar</span>
              <Eye className="w-3 h-3" />
            </button>

            <button
              type="button"
              onClick={() => updateUnitCircleParams({ showCos: !unitCircleParams.showCos })}
              className={`p-1.5 rounded-lg border text-[11px] font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                unitCircleParams.showCos
                  ? 'bg-emerald-950/50 border-emerald-700 text-emerald-300'
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
            >
              <span>Cosine Bar</span>
              <Eye className="w-3 h-3" />
            </button>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
};
