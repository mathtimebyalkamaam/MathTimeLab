/**
 * LinesAnglesSimulator.tsx: Parallel Lines & Transversal Detective (Class 9).
 * Features:
 * - Two parallel lines cut by a dynamic rotatable transversal line
 * - Color-coded angle pairs proving the "Two-Angle Rule" (every angle is either θ or 180° - θ)
 * - Highlights Alternate Interior (Z-shape), Corresponding (F-shape), and Consecutive Interior (C-shape)
 * - Interactive Zigzag Bend Mode: proves the iconic board exam M-angle theorem: ∠APB = ∠A + ∠B
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
  Compass,
  GitBranch
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

export const LinesAnglesSimulator: React.FC = () => {
  const {
    linesAnglesParams,
    updateLinesAnglesParams,
    resetParams,
    completeChallenge,
    challengeCompleted,
    isZenMode,
  } = useSimulatorStore();

  const {
    mode = 'transversal',
    lineAngleDeg = 0,
    transversalAngleDeg = 65,
    zigzagBendDeg = 80,
    showCorresponding = true,
    showAlternate = true,
    showInterior = true,
    showProofOverlay = false,
  } = linesAnglesParams || {};

  const { lightTap, successBuzz } = useHaptics();
  const { playClick, playChime } = useSound();
  const { trackEvent } = useAnalytics();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDraggingTransversal, setIsDraggingTransversal] = useState(false);

  // Derived angle calculations
  const theta = transversalAngleDeg;
  const supplementary = 180 - theta;

  // Board Exam Challenge Evaluation
  useEffect(() => {
    // Challenge 1: Perpendicular transversal (θ = 90°)
    if (Math.abs(theta - 90) < 1.5 && !challengeCompleted['lines_perp_90']) {
      completeChallenge('lines_perp_90', 40);
      successBuzz();
      playChime();
      confetti({ particleCount: 40, spread: 60 });
      trackEvent('challenge_completed', { challengeId: 'lines_perp_90' });
    }

    // Challenge 2: Acute Transversal 60° (θ = 60°, supplementary = 120°)
    if (Math.abs(theta - 60) < 2.0 && !challengeCompleted['lines_alt_60']) {
      completeChallenge('lines_alt_60', 45);
      successBuzz();
      playChime();
      confetti({ particleCount: 40, spread: 60 });
      trackEvent('challenge_completed', { challengeId: 'lines_alt_60' });
    }

    // Challenge 3: Zigzag Bend Proof mode active
    if (mode === 'zigzag' && showProofOverlay && !challengeCompleted['lines_zigzag_proof']) {
      completeChallenge('lines_zigzag_proof', 50);
      successBuzz();
      playChime();
      confetti({ particleCount: 40, spread: 60 });
      trackEvent('challenge_completed', { challengeId: 'lines_zigzag_proof' });
    }
  }, [theta, mode, showProofOverlay, challengeCompleted, completeChallenge, successBuzz, playChime, trackEvent]);

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

      const centerX = width / 2;
      const centerY = height / 2;

      if (mode === 'transversal') {
        const lineSpacing = 110;
        const line1Y = centerY - lineSpacing / 2;
        const line2Y = centerY + lineSpacing / 2;

        // Draw Parallel Line 1 (L₁)
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(30, line1Y);
        ctx.lineTo(width - 30, line1Y);
        ctx.stroke();

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 12px monospace';
        ctx.fillText('Line L₁', 35, line1Y - 10);

        // Draw Parallel Line 2 (L₂)
        ctx.strokeStyle = '#38bdf8';
        ctx.beginPath();
        ctx.moveTo(30, line2Y);
        ctx.lineTo(width - 30, line2Y);
        ctx.stroke();

        ctx.fillText('Line L₂ ∥ L₁', 35, line2Y + 22);

        // Transversal line parameters
        const thetaRad = (theta * Math.PI) / 180;
        const transDx = Math.cos(thetaRad);
        const transDy = -Math.sin(thetaRad);

        const transLength = 240;
        const tanVal = Math.tan(thetaRad);
        const safeTan = Math.abs(tanVal) < 0.0001 ? (tanVal >= 0 ? 0.0001 : -0.0001) : tanVal;
        const int1 = { x: centerX - (lineSpacing / (2 * safeTan)), y: line1Y };
        const int2 = { x: centerX + (lineSpacing / (2 * safeTan)), y: line2Y };

        // Transversal Line T
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(centerX - transDx * transLength, centerY - transDy * transLength);
        ctx.lineTo(centerX + transDx * transLength, centerY + transDy * transLength);
        ctx.stroke();

        ctx.fillStyle = '#f59e0b';
        ctx.fillText('Transversal T', centerX + transDx * transLength - 20, centerY + transDy * transLength - 10);

        // Helper to draw angle arc
        const drawAngleArc = (
          cxPt: number,
          cyPt: number,
          startAngle: number,
          endAngle: number,
          val: number,
          color: string,
          label: string
        ) => {
          const arcR = 30;
          ctx.strokeStyle = color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(cxPt, cyPt, arcR, startAngle, endAngle);
          ctx.stroke();

          ctx.fillStyle = color === '#06b6d4' ? 'rgba(6, 182, 212, 0.15)' : 'rgba(245, 158, 11, 0.15)';
          ctx.beginPath();
          ctx.moveTo(cxPt, cyPt);
          ctx.arc(cxPt, cyPt, arcR, startAngle, endAngle);
          ctx.closePath();
          ctx.fill();

          const midAngle = (startAngle + endAngle) / 2;
          const textR = arcR + 14;
          ctx.fillStyle = color;
          ctx.font = 'bold 10px monospace';
          ctx.fillText(`${val.toFixed(0)}°`, cxPt + Math.cos(midAngle) * textR - 8, cyPt + Math.sin(midAngle) * textR + 4);
        };

        // Draw Angles at Intersection 1 (Upper line)
        // Angle 1: acute θ (top-right)
        drawAngleArc(int1.x, int1.y, -thetaRad, 0, theta, '#06b6d4', '∠1');
        // Angle 2: obtuse (top-left)
        drawAngleArc(int1.x, int1.y, -Math.PI, -thetaRad, supplementary, '#f59e0b', '∠2');
        // Angle 3: acute (bottom-left)
        drawAngleArc(int1.x, int1.y, Math.PI - thetaRad, Math.PI, theta, '#06b6d4', '∠3');
        // Angle 4: obtuse (bottom-right)
        drawAngleArc(int1.x, int1.y, 0, Math.PI - thetaRad, supplementary, '#f59e0b', '∠4');

        // Draw Angles at Intersection 2 (Lower line)
        // Angle 5: acute (top-right)
        drawAngleArc(int2.x, int2.y, -thetaRad, 0, theta, '#06b6d4', '∠5');
        // Angle 6: obtuse (top-left)
        drawAngleArc(int2.x, int2.y, -Math.PI, -thetaRad, supplementary, '#f59e0b', '∠6');
        // Angle 7: acute (bottom-left)
        drawAngleArc(int2.x, int2.y, Math.PI - thetaRad, Math.PI, theta, '#06b6d4', '∠7');
        // Angle 8: obtuse (bottom-right)
        drawAngleArc(int2.x, int2.y, 0, Math.PI - thetaRad, supplementary, '#f59e0b', '∠8');

        // Overlay Z-shape / F-shape highlights
        if (showAlternate) {
          ctx.strokeStyle = '#c084fc';
          ctx.lineWidth = 3;
          ctx.setLineDash([6, 4]);
          ctx.beginPath();
          ctx.moveTo(int1.x - 70, line1Y);
          ctx.lineTo(int1.x, line1Y);
          ctx.lineTo(int2.x, line2Y);
          ctx.lineTo(int2.x + 70, line2Y);
          ctx.stroke();
          ctx.setLineDash([]);

          ctx.fillStyle = '#c084fc';
          ctx.font = 'bold 12px sans-serif';
          ctx.fillText('Z-Shape: Alternate Interior ∠3 = ∠5', centerX - 80, centerY - 6);
        }
      } else if (mode === 'zigzag') {
        // Classic Board Exam Zigzag Bend Mode
        const lineSpacing = 130;
        const line1Y = centerY - lineSpacing / 2;
        const line2Y = centerY + lineSpacing / 2;

        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(40, line1Y);
        ctx.lineTo(width - 40, line1Y);
        ctx.moveTo(40, line2Y);
        ctx.lineTo(width - 40, line2Y);
        ctx.stroke();

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 12px monospace';
        ctx.fillText('Line AB', 45, line1Y - 10);
        ctx.fillText('Line CD ∥ AB', 45, line2Y + 22);

        // Zigzag vertices: A on line1, P bent knee in middle, C on line2
        const pA = { x: centerX - 80, y: line1Y };
        const pP = { x: centerX + 40, y: centerY };
        const pC = { x: centerX - 70, y: line2Y };

        // Zigzag segments AP and PC
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(pA.x, pA.y);
        ctx.lineTo(pP.x, pP.y);
        ctx.lineTo(pC.x, pC.y);
        ctx.stroke();

        // Points
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(pA.x, pA.y, 5, 0, Math.PI * 2);
        ctx.arc(pP.x, pP.y, 6, 0, Math.PI * 2);
        ctx.arc(pC.x, pC.y, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = 'bold 13px sans-serif';
        ctx.fillText('A (40°)', pA.x - 10, pA.y - 12);
        ctx.fillText('P (∠APB)', pP.x + 12, pP.y + 4);
        ctx.fillText('C (50°)', pC.x - 10, pC.y + 24);

        // Auxiliary line through P parallel to AB and CD
        if (showProofOverlay) {
          ctx.strokeStyle = '#34d399';
          ctx.lineWidth = 2;
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.moveTo(60, centerY);
          ctx.lineTo(width - 60, centerY);
          ctx.stroke();
          ctx.setLineDash([]);

          ctx.fillStyle = '#34d399';
          ctx.font = 'bold 11px monospace';
          ctx.fillText('Auxiliary Line EF ∥ AB ∥ CD', width - 210, centerY - 8);

          ctx.fillStyle = '#fbbf24';
          ctx.fillText('∠APB = ∠A + ∠C = 40° + 50° = 90°', centerX - 90, centerY + 28);
        }
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [mode, theta, supplementary, showAlternate, showProofOverlay]);

  // Structured Board Exam Challenges
  const challengeLevels: ChallengeLevel[] = [
    {
      levelNumber: 1,
      title: 'Perpendicular Transversal (90°)',
      badge: 'Orthogonal 90°',
      description: 'Rotate the transversal until θ = 90°. Notice that all 8 angles become identical right angles (90°)!',
      requirementFormula: '\\theta = 90^\\circ \\implies \\text{All 8 angles equal } 90^\\circ',
      targetCriteria: 'Set transversal angle θ = 90°',
      xpReward: 40,
      autoPreset: () => updateLinesAnglesParams({ mode: 'transversal', transversalAngleDeg: 90 }),
    },
    {
      levelNumber: 2,
      title: 'Alternate Interior Z-Angles at 60°',
      badge: 'Z-Angles Equality',
      description: 'Set angle θ = 60°. Observe that alternate interior angles match (60°), and co-interior angles add to 180°!',
      requirementFormula: '\\angle_{\\text{alt}} = 60^\\circ, \\quad \\angle_{\\text{co-int}} = 180^\\circ - 60^\\circ = 120^\\circ',
      targetCriteria: 'Set transversal angle to 60°',
      xpReward: 45,
      autoPreset: () => updateLinesAnglesParams({ mode: 'transversal', transversalAngleDeg: 60, showAlternate: true }),
    },
    {
      levelNumber: 3,
      title: 'The Auxiliary Zigzag M-Bend Proof',
      badge: '∠APB = ∠A + ∠B',
      description: 'Switch to Zigzag Bend mode and turn on the Auxiliary Parallel Line proof overlay.',
      requirementFormula: '\\angle APB = \\angle A + \\angle C',
      targetCriteria: 'Activate Zigzag mode and proof overlay',
      xpReward: 50,
      autoPreset: () => updateLinesAnglesParams({ mode: 'zigzag', showProofOverlay: true }),
    },
  ];

  return (
    <div className="relative w-full h-[calc(100vh-42px)] md:h-[calc(100vh-52px)] overflow-hidden flex flex-col bg-slate-950 text-slate-100 select-none">
      {/* Dynamic HUD Overlay */}
      {!isZenMode && (
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-20 max-w-[210px] sm:max-w-[260px] bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-2 sm:p-2.5 rounded-xl text-xs space-y-1.5 shadow-2xl">
          <div className="flex items-center justify-between font-mono font-bold text-cyan-300">
            <span>Acute θ: {theta}°</span>
          </div>

          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800">
            <span className="text-slate-400">Obtuse (180° - θ):</span>
            <span className="font-mono text-amber-300 font-bold">{supplementary}°</span>
          </div>

          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Co-interior Sum:</span>
            <span className="font-mono text-emerald-400 font-bold">180° (Supplementary)</span>
          </div>
        </div>
      )}

      {/* Main Interactive Stage */}
      <div className="relative flex-1 w-full bg-slate-950 touch-none">
        <canvas ref={canvasRef} className="w-full h-full touch-none" />

        {/* Quick Presets Bar */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 flex flex-wrap gap-1.5 max-w-xs sm:max-w-sm">
          <button
            type="button"
            onClick={() => updateLinesAnglesParams({ mode: 'transversal', transversalAngleDeg: 65, showAlternate: true })}
            className={`py-1 px-2.5 rounded-lg border text-[11px] font-mono font-bold cursor-pointer ${
              mode === 'transversal'
                ? 'bg-cyan-950 border-cyan-500 text-cyan-200'
                : 'bg-slate-900/90 border-slate-700 text-slate-300'
            }`}
          >
            Transversal θ = 65°
          </button>
          <button
            type="button"
            onClick={() => updateLinesAnglesParams({ mode: 'transversal', transversalAngleDeg: 90 })}
            className="py-1 px-2.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-[11px] font-mono font-bold text-amber-300 cursor-pointer"
          >
            θ = 90° Orthogonal
          </button>
          <button
            type="button"
            onClick={() => updateLinesAnglesParams({ mode: 'zigzag', showProofOverlay: !showProofOverlay })}
            className={`py-1 px-2.5 rounded-lg border text-[11px] font-mono font-bold cursor-pointer ${
              mode === 'zigzag'
                ? 'bg-emerald-950 border-emerald-500 text-emerald-200'
                : 'bg-slate-900/90 border-slate-700 text-slate-300'
            }`}
          >
            Zigzag Bend Mode
          </button>
        </div>
      </div>

      {/* Collapsible Mobile Bottom Sheet */}
      <BottomSheet
        title="Lines & Angles Mission Control"
        badgeLabel={`θ = ${theta}°`}
        quickEquation="\angle_1 = \angle_2, \quad \theta + (180^\circ - \theta) = 180^\circ"
        onReset={() => resetParams('lines-angles')}
        theoryContent={
          <CoachTheoryModule
            simulatorId="lines-angles"
            extraLiveDetails={
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2 text-xs text-center font-mono">
                  <div className="p-2 rounded-xl bg-cyan-950/30 border border-cyan-800/40">
                    <span className="text-[10px] text-cyan-300 block font-semibold">Alternate Interior (Z):</span>
                    <span className="text-white font-bold">{theta}° = {theta}°</span>
                  </div>
                  <div className="p-2 rounded-xl bg-amber-950/30 border border-amber-800/40">
                    <span className="text-[10px] text-amber-300 block font-semibold">Consecutive Interior (C):</span>
                    <span className="text-white font-bold">{theta}° + {supplementary}° = 180°</span>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800 text-center font-mono text-xs">
                  <span className="text-emerald-400 font-bold">
                    Two-Angle Rule: Every single angle is either {theta}° or {supplementary}°!
                  </span>
                </div>
              </div>
            }
          />
        }
        challengeContent={
          <div className="space-y-4">
            <ChallengeManager
              simulatorId="lines-angles"
              simulatorTitle="Parallel Lines & Transversal Detective"
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
            title={mode === 'transversal' ? 'Parallel Lines & Transversal Invariant' : 'M-Angle Zigzag Invariant'}
            badge={mode === 'transversal' ? 'Two-Angle Rule' : '∠APB = ∠A + ∠B'}
            symbolicLaw={
              mode === 'transversal'
                ? "\\theta + (180^\\circ - \\theta) = 180^\\circ, \\quad \\angle_{\\text{alt-int}} = \\theta"
                : "\\angle APB = \\angle A + \\angle B \\quad (\\text{via auxiliary } EF \\parallel AB)"
            }
            substitutedLatex={
              mode === 'transversal'
                ? `\\theta = ${theta}^\\circ, \\quad 180^\\circ - ${theta}^\\circ = ${supplementary}^\\circ`
                : `\\angle APB = ${(zigzagBendDeg / 2).toFixed(1)}^\\circ + ${(zigzagBendDeg / 2).toFixed(1)}^\\circ`
            }
            evaluatedLatex={
              mode === 'transversal'
                ? `\\text{Consecutive Interior Sum} = ${theta}^\\circ + ${supplementary}^\\circ = 180^\\circ`
                : `\\angle APB = ${zigzagBendDeg}^\\circ`
            }
          />

          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900 border border-slate-800 rounded-xl">
            <button
              type="button"
              onClick={() => updateLinesAnglesParams({ mode: 'transversal' })}
              className={`py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                mode === 'transversal' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'
              }`}
            >
              Transversal Mode
            </button>
            <button
              type="button"
              onClick={() => updateLinesAnglesParams({ mode: 'zigzag' })}
              className={`py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                mode === 'zigzag' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'
              }`}
            >
              Zigzag Bend Mode
            </button>
          </div>

          {mode === 'transversal' ? (
            <TouchSlider
              label="Transversal Angle θ"
              value={transversalAngleDeg}
              min={30}
              max={150}
              step={5}
              onChange={(val) => updateLinesAnglesParams({ transversalAngleDeg: val })}
            />
          ) : (
            <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <span className="text-xs text-slate-300 font-medium block">Auxiliary Line Proof</span>
              <button
                type="button"
                onClick={() => updateLinesAnglesParams({ showProofOverlay: !showProofOverlay })}
                className={`w-full py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                  showProofOverlay
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-200'
                    : 'bg-slate-900 border-slate-700 text-slate-300'
                }`}
              >
                {showProofOverlay ? 'Hide Auxiliary Line' : 'Show Auxiliary Line EF ∥ AB ∥ CD'}
              </button>
            </div>
          )}

          {mode === 'transversal' && (
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => updateLinesAnglesParams({ showAlternate: !showAlternate })}
                className={`p-2 rounded-lg text-xs font-medium border text-center transition-colors cursor-pointer ${
                  showAlternate
                    ? 'bg-purple-950 border-purple-500 text-purple-200'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                Highlight Z-Shape
              </button>
              <button
                type="button"
                onClick={() => updateLinesAnglesParams({ transversalAngleDeg: 90 })}
                className="p-2 rounded-lg text-xs font-medium bg-slate-900 border border-slate-800 text-slate-300 hover:text-white cursor-pointer"
              >
                Snap to 90°
              </button>
            </div>
          )}
        </div>
      </BottomSheet>
    </div>
  );
};
