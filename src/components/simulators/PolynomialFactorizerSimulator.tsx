/**
 * PolynomialFactorizerSimulator.tsx: Geometric Algebra Tiles & Factorization (Class 9).
 * Features:
 * - Interactive 2D Algebra Tiles: visualizes x², x-strips, and 1-units
 * - Shows how splitting the middle term corresponds to length × width of a 2D rectangle
 * - Difference of Squares mode: cutting corner b² from a² forms (a+b)(a-b)
 * - Perfect Square Trinomial mode: (x+p)² = x² + 2px + p²
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
  Boxes,
  Grid
} from 'lucide-react';
import { useSimulatorStore } from '../../store/useSimulatorStore';
import { BottomSheet } from '../layout/BottomSheet';
import { TouchSlider } from '../common/TouchSlider';
import { CoachTheoryModule } from '../common/CoachTheoryModule';
import { ChallengeManager, ChallengeLevel } from '../common/ChallengeManager';
import { useHaptics } from '../../hooks/useHaptics';
import { useSound } from '../common/SoundManager';
import { useAnalytics } from '../../hooks/useAnalytics';

export const PolynomialFactorizerSimulator: React.FC = () => {
  const {
    polynomialParams,
    updatePolynomialParams,
    resetParams,
    completeChallenge,
    challengeCompleted,
    isZenMode,
  } = useSimulatorStore();

  const {
    mode,
    p,
    q,
    xSize,
    showGrid,
    showAlgebraExpansion,
  } = polynomialParams;

  const { lightTap, successBuzz } = useHaptics();
  const { playClick, playChime } = useSound();
  const { trackEvent } = useAnalytics();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dragDim, setDragDim] = useState<'p' | 'q' | null>(null);
  const [hoverDim, setHoverDim] = useState<'p' | 'q' | null>(null);

  // Algebra parameters
  const middleTermB = p + q;
  const constantC = p * q;

  // Board Exam Challenge Evaluation
  useEffect(() => {
    // Challenge 1: Factorize x² + 5x + 6 (p=2, q=3 or p=3, q=2)
    if (
      mode === 'tiles' &&
      ((p === 2 && q === 3) || (p === 3 && q === 2)) &&
      !challengeCompleted['poly_factor_5_6']
    ) {
      completeChallenge('poly_factor_5_6', 40);
      successBuzz();
      playChime();
      confetti({ particleCount: 40, spread: 60 });
      trackEvent('challenge_completed', { challengeId: 'poly_factor_5_6' });
    }

    // Challenge 2: Difference of Squares x² - 9 (mode difference-squares, p=3)
    if (
      mode === 'difference-squares' &&
      p === 3 &&
      !challengeCompleted['poly_diff_squares_9']
    ) {
      completeChallenge('poly_diff_squares_9', 45);
      successBuzz();
      playChime();
      confetti({ particleCount: 40, spread: 60 });
      trackEvent('challenge_completed', { challengeId: 'poly_diff_squares_9' });
    }

    // Challenge 3: Perfect Square Trinomial (x+4)² = x² + 8x + 16 (mode perfect-square, p=4)
    if (
      mode === 'perfect-square' &&
      p === 4 &&
      !challengeCompleted['poly_perfect_square_4']
    ) {
      completeChallenge('poly_perfect_square_4', 50);
      successBuzz();
      playChime();
      confetti({ particleCount: 40, spread: 60 });
      trackEvent('challenge_completed', { challengeId: 'poly_perfect_square_4' });
    }
  }, [mode, p, q, challengeCompleted, completeChallenge, successBuzz, playChime, trackEvent]);

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

      // Tile pixel dimensions based on xSize and unit size
      const unitPx = 28;
      const xPx = xSize * unitPx;
      const pPx = p * unitPx;
      const qPx = (mode === 'perfect-square' ? p : q) * unitPx;

      const totalWidthPx = xPx + pPx;
      const totalHeightPx = xPx + qPx;

      const startX = centerX - totalWidthPx / 2;
      const startY = centerY - totalHeightPx / 2 + 10;

      if (mode === 'tiles' || mode === 'perfect-square') {
        const actualQ = mode === 'perfect-square' ? p : q;
        const actualQPx = qPx;

        // 1. Region 1: Large square x² (Cyan)
        ctx.fillStyle = 'rgba(6, 182, 212, 0.25)';
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 2;
        ctx.fillRect(startX, startY, xPx, xPx);
        ctx.strokeRect(startX, startY, xPx, xPx);

        // x² label
        ctx.fillStyle = '#22d3ee';
        ctx.font = 'bold 16px monospace';
        ctx.fillText('x²', startX + xPx / 2 - 10, startY + xPx / 2 + 6);

        // 2. Region 2: Horizontal strips p · x (Sky blue)
        if (p > 0) {
          ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
          ctx.strokeStyle = '#38bdf8';
          ctx.fillRect(startX + xPx, startY, pPx, xPx);
          ctx.strokeRect(startX + xPx, startY, pPx, xPx);

          // Grid lines inside p · x
          if (showGrid) {
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
            ctx.lineWidth = 1;
            for (let i = 1; i < p; i++) {
              ctx.beginPath();
              ctx.moveTo(startX + xPx + i * unitPx, startY);
              ctx.lineTo(startX + xPx + i * unitPx, startY + xPx);
              ctx.stroke();
            }
          }

          ctx.fillStyle = '#38bdf8';
          ctx.font = 'bold 14px monospace';
          ctx.fillText(`${p}x`, startX + xPx + pPx / 2 - 10, startY + xPx / 2 + 5);
        }

        // 3. Region 3: Vertical strips q · x (Amber)
        if (actualQ > 0) {
          ctx.fillStyle = 'rgba(245, 158, 11, 0.2)';
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 2;
          ctx.fillRect(startX, startY + xPx, xPx, actualQPx);
          ctx.strokeRect(startX, startY + xPx, xPx, actualQPx);

          if (showGrid) {
            ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
            ctx.lineWidth = 1;
            for (let j = 1; j < actualQ; j++) {
              ctx.beginPath();
              ctx.moveTo(startX, startY + xPx + j * unitPx);
              ctx.lineTo(startX + xPx, startY + xPx + j * unitPx);
              ctx.stroke();
            }
          }

          ctx.fillStyle = '#fbbf24';
          ctx.font = 'bold 14px monospace';
          ctx.fillText(`${actualQ}x`, startX + xPx / 2 - 10, startY + xPx + actualQPx / 2 + 5);
        }

        // 4. Region 4: Unit squares p · q (Emerald)
        if (p > 0 && actualQ > 0) {
          ctx.fillStyle = 'rgba(16, 185, 129, 0.25)';
          ctx.strokeStyle = '#10b981';
          ctx.lineWidth = 2;
          ctx.fillRect(startX + xPx, startY + xPx, pPx, actualQPx);
          ctx.strokeRect(startX + xPx, startY + xPx, pPx, actualQPx);

          if (showGrid) {
            ctx.strokeStyle = 'rgba(16, 185, 129, 0.35)';
            ctx.lineWidth = 1;
            for (let i = 1; i < p; i++) {
              ctx.beginPath();
              ctx.moveTo(startX + xPx + i * unitPx, startY + xPx);
              ctx.lineTo(startX + xPx + i * unitPx, startY + xPx + actualQPx);
              ctx.stroke();
            }
            for (let j = 1; j < actualQ; j++) {
              ctx.beginPath();
              ctx.moveTo(startX + xPx, startY + xPx + j * unitPx);
              ctx.lineTo(startX + xPx + pPx, startY + xPx + j * unitPx);
              ctx.stroke();
            }
          }

          ctx.fillStyle = '#34d399';
          ctx.font = 'bold 14px monospace';
          ctx.fillText(`${p * actualQ}`, startX + xPx + pPx / 2 - 8, startY + xPx + actualQPx / 2 + 5);
        }

        // Dimension dimension brackets along top and left
        // Top: (x + p)
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 13px monospace';
        ctx.fillText(`Length: x + ${p}`, startX + totalWidthPx / 2 - 40, startY - 14);

        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(startX, startY - 6);
        ctx.lineTo(startX + totalWidthPx, startY - 6);
        ctx.stroke();

        // Left: (x + q)
        ctx.fillStyle = '#f59e0b';
        ctx.fillText(`Width: x + ${actualQ}`, startX - 110, startY + totalHeightPx / 2 + 4);

        ctx.strokeStyle = '#f59e0b';
        ctx.beginPath();
        ctx.moveTo(startX - 6, startY);
        ctx.lineTo(startX - 6, startY + totalHeightPx);
        ctx.stroke();
      } else if (mode === 'difference-squares') {
        // Difference of Squares visualization: a² with corner b² removed
        const aPx = 5 * unitPx;
        const bPx = p * unitPx;
        const sX = centerX - aPx / 2;
        const sY = centerY - aPx / 2;

        // Big square a² (Cyan fill)
        ctx.fillStyle = 'rgba(6, 182, 212, 0.2)';
        ctx.fillRect(sX, sY, aPx, aPx);

        // Cutout square b² (Striped or transparent with red border)
        ctx.fillStyle = 'rgba(244, 63, 94, 0.25)';
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 2;
        ctx.fillRect(sX + aPx - bPx, sY, bPx, bPx);
        ctx.strokeRect(sX + aPx - bPx, sY, bPx, bPx);

        // Remaining area polygon outline
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(sX, sY);
        ctx.lineTo(sX + aPx - bPx, sY);
        ctx.lineTo(sX + aPx - bPx, sY + bPx);
        ctx.lineTo(sX + aPx, sY + bPx);
        ctx.lineTo(sX + aPx, sY + aPx);
        ctx.lineTo(sX, sY + aPx);
        ctx.closePath();
        ctx.stroke();

        ctx.fillStyle = '#f43f5e';
        ctx.font = 'bold 12px monospace';
        ctx.fillText(`Cutout b² = ${p * p}`, sX + aPx - bPx + 8, sY + bPx / 2 + 4);

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 13px monospace';
        ctx.fillText(`Remaining Area = a² - b² = (a+b)(a-b)`, sX - 20, sY + aPx + 30);
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [mode, p, q, xSize, showGrid, dragDim, hoverDim]);

  // Pointer event handlers to drag right edge (p) or bottom edge (q) directly on the tiles
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;

    const unitPx = Math.min(rect.width, rect.height) / 14;
    const xPx = 4 * unitPx;
    const pPx = p * unitPx;
    const actualQ = mode === 'perfect-square' ? p : q;
    const actualQPx = actualQ * unitPx;
    const totalWidthPx = xPx + pPx;
    const totalHeightPx = xPx + actualQPx;
    const startX = (rect.width - totalWidthPx) / 2;
    const startY = (rect.height - totalHeightPx) / 2;

    const rightEdgeX = startX + totalWidthPx;
    const bottomEdgeY = startY + totalHeightPx;

    const distP = Math.hypot(sx - rightEdgeX, sy - (startY + totalHeightPx / 2));
    const distQ = Math.hypot(sx - (startX + totalWidthPx / 2), sy - bottomEdgeY);

    if (distP < 32 || Math.abs(sx - rightEdgeX) < 22) {
      e.currentTarget.setPointerCapture(e.pointerId);
      setDragDim('p');
      lightTap();
      playClick(1.2);
    } else if (distQ < 32 || Math.abs(sy - bottomEdgeY) < 22) {
      e.currentTarget.setPointerCapture(e.pointerId);
      setDragDim('q');
      lightTap();
      playClick(1.2);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;

    const unitPx = Math.min(rect.width, rect.height) / 14;
    const xPx = 4 * unitPx;
    const actualQ = mode === 'perfect-square' ? p : q;
    const totalWidthPx = xPx + p * unitPx;
    const totalHeightPx = xPx + actualQ * unitPx;
    const startX = (rect.width - totalWidthPx) / 2;
    const startY = (rect.height - totalHeightPx) / 2;

    if (dragDim === 'p') {
      const newP = Math.max(1, Math.min(6, Math.round((sx - startX - xPx) / unitPx)));
      updatePolynomialParams({ p: newP });
      return;
    }

    if (dragDim === 'q') {
      const newQ = Math.max(1, Math.min(6, Math.round((sy - startY - xPx) / unitPx)));
      if (mode === 'perfect-square') {
        updatePolynomialParams({ p: newQ });
      } else {
        updatePolynomialParams({ q: newQ });
      }
      return;
    }

    const rightEdgeX = startX + totalWidthPx;
    const bottomEdgeY = startY + totalHeightPx;

    if (Math.abs(sx - rightEdgeX) < 22) {
      setHoverDim('p');
    } else if (Math.abs(sy - bottomEdgeY) < 22) {
      setHoverDim('q');
    } else {
      setHoverDim(null);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (dragDim) {
      setDragDim(null);
      try {
        canvasRef.current?.releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  // Structured Board Exam Challenges
  const challengeLevels: ChallengeLevel[] = [
    {
      levelNumber: 1,
      title: 'Factoring x² + 5x + 6',
      badge: '(x+2)(x+3)',
      description: 'Set dimensions p = 2 and q = 3. Observe how the 2D tiles form a perfect rectangle of area x² + 5x + 6!',
      requirementFormula: '(x+2)(x+3) = x^2 + 5x + 6',
      targetCriteria: 'Set p = 2 and q = 3',
      xpReward: 40,
      autoPreset: () => updatePolynomialParams({ mode: 'tiles', p: 2, q: 3 }),
    },
    {
      levelNumber: 2,
      title: 'Difference of Squares x² - 9',
      badge: 'a² - b² = (a+b)(a-b)',
      description: 'Switch to Difference of Squares mode and set b = 3. See how a² - 9 rearranges into (x+3)(x-3)!',
      requirementFormula: 'x^2 - 3^2 = (x+3)(x-3)',
      targetCriteria: 'Set mode to difference-squares and b = 3',
      xpReward: 45,
      autoPreset: () => updatePolynomialParams({ mode: 'difference-squares', p: 3 }),
    },
    {
      levelNumber: 3,
      title: 'Perfect Square Trinomial (x+4)²',
      badge: '(x+p)² = x² + 2px + p²',
      description: 'Switch to Perfect Square mode with p = 4. Observe the symmetric twin rectangles 4x + 4x = 8x!',
      requirementFormula: '(x+4)^2 = x^2 + 8x + 16',
      targetCriteria: 'Set mode to perfect-square and p = 4',
      xpReward: 50,
      autoPreset: () => updatePolynomialParams({ mode: 'perfect-square', p: 4 }),
    },
  ];

  return (
    <div className="relative w-full h-[calc(100vh-42px)] md:h-[calc(100vh-52px)] overflow-hidden flex flex-col bg-slate-950 text-slate-100 select-none">
      {/* Dynamic HUD Overlay */}
      {!isZenMode && (
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-20 max-w-[210px] sm:max-w-[260px] bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-2 sm:p-2.5 rounded-xl text-xs space-y-1.5 shadow-2xl">
          <div className="flex items-center justify-between font-mono font-bold text-cyan-300">
            {mode === 'difference-squares' ? (
              <span>x² - {p * p} = (x + {p})(x - {p})</span>
            ) : mode === 'perfect-square' ? (
              <span>(x + {p})² = x² + {2 * p}x + {p * p}</span>
            ) : (
              <span>
                (x + {p})(x + {q}) = x² {middleTermB >= 0 ? `+ ${middleTermB}` : `- ${Math.abs(middleTermB)}`}x {constantC >= 0 ? `+ ${constantC}` : `- ${Math.abs(constantC)}`}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800">
            <span className="text-slate-400">Length:</span>
            <span className="font-mono text-cyan-400 font-bold">x + {p}</span>
          </div>

          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Width:</span>
            <span className="font-mono text-amber-300 font-bold">
              x + {mode === 'perfect-square' ? p : q}
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Middle Term:</span>
            <span className="font-mono text-emerald-400 font-bold">
              {mode === 'difference-squares' ? '0x (Cancelled)' : `${mode === 'perfect-square' ? 2 * p : middleTermB}x`}
            </span>
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
          onPointerCancel={handlePointerUp}
          className={`w-full h-full touch-none ${
            dragDim === 'p' || hoverDim === 'p'
              ? 'cursor-ew-resize cursor-grabbing'
              : dragDim === 'q' || hoverDim === 'q'
              ? 'cursor-ns-resize cursor-grabbing'
              : 'cursor-crosshair'
          }`}
        />

        {/* Direct on-canvas grip guide banner */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 pointer-events-none flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 shadow-xl backdrop-blur-md text-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shrink-0" />
          <span className="text-slate-300 font-sans">
            Catch and drag the right edge <strong className="text-cyan-300">(x+p)</strong> or bottom edge <strong className="text-amber-300">(x+q)</strong> directly on the tiles!
          </span>
        </div>

        {/* Quick Presets Bar */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 flex flex-wrap gap-1.5 max-w-xs sm:max-w-sm">
          <button
            type="button"
            onClick={() => updatePolynomialParams({ mode: 'tiles', p: 2, q: 3 })}
            className={`py-1 px-2.5 rounded-lg border text-[11px] font-mono font-bold cursor-pointer ${
              mode === 'tiles' && p === 2 && q === 3
                ? 'bg-cyan-950 border-cyan-500 text-cyan-200'
                : 'bg-slate-900/90 border-slate-700 text-slate-300'
            }`}
          >
            x² + 5x + 6
          </button>
          <button
            type="button"
            onClick={() => updatePolynomialParams({ mode: 'tiles', p: 3, q: 4 })}
            className="py-1 px-2.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-[11px] font-mono font-bold text-amber-300 cursor-pointer"
          >
            x² + 7x + 12
          </button>
          <button
            type="button"
            onClick={() => updatePolynomialParams({ mode: 'difference-squares', p: 3 })}
            className={`py-1 px-2.5 rounded-lg border text-[11px] font-mono font-bold cursor-pointer ${
              mode === 'difference-squares'
                ? 'bg-rose-950 border-rose-500 text-rose-200'
                : 'bg-slate-900/90 border-slate-700 text-slate-300'
            }`}
          >
            x² - 9 (Diff Sq)
          </button>
          <button
            type="button"
            onClick={() => updatePolynomialParams({ mode: 'perfect-square', p: 4 })}
            className={`py-1 px-2.5 rounded-lg border text-[11px] font-mono font-bold cursor-pointer ${
              mode === 'perfect-square'
                ? 'bg-purple-950 border-purple-500 text-purple-200'
                : 'bg-slate-900/90 border-slate-700 text-slate-300'
            }`}
          >
            (x+4)²
          </button>
        </div>
      </div>

      {/* Collapsible Mobile Bottom Sheet */}
      <BottomSheet
        title="Polynomial Factorizer Mission Control"
        badgeLabel={`p=${p}, q=${q}`}
        quickEquation="(x+p)(x+q) = x^2 + (p+q)x + pq"
        onReset={() => resetParams('polynomial-factorizer')}
        theoryContent={
          <CoachTheoryModule
            simulatorId="polynomial-factorizer"
            extraLiveDetails={
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2 text-xs text-center font-mono">
                  <div className="p-2 rounded-xl bg-cyan-950/30 border border-cyan-800/40">
                    <span className="text-[10px] text-cyan-300 block font-semibold">Sum of Roots (p + q):</span>
                    <span className="text-white font-bold">{p + q}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-amber-950/30 border border-amber-800/40">
                    <span className="text-[10px] text-amber-300 block font-semibold">Product of Roots (p · q):</span>
                    <span className="text-white font-bold">{p * q}</span>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800 text-center font-mono text-xs">
                  <span className="text-emerald-400 font-bold">
                    Factorization: (x + {p})(x + {mode === 'perfect-square' ? p : q})
                  </span>
                </div>
              </div>
            }
          />
        }
        challengeContent={
          <div className="space-y-4">
            <ChallengeManager
              simulatorId="polynomial-factorizer"
              simulatorTitle="Geometric Polynomial Factorizer"
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
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl">
            <button
              type="button"
              onClick={() => updatePolynomialParams({ mode: 'tiles' })}
              className={`py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                mode === 'tiles' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'
              }`}
            >
              Rect Tiles
            </button>
            <button
              type="button"
              onClick={() => updatePolynomialParams({ mode: 'difference-squares' })}
              className={`py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                mode === 'difference-squares' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'
              }`}
            >
              Diff Squares
            </button>
            <button
              type="button"
              onClick={() => updatePolynomialParams({ mode: 'perfect-square' })}
              className={`py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                mode === 'perfect-square' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'
              }`}
            >
              Perfect Sq
            </button>
          </div>

          <TouchSlider
            label="Factor Parameter p"
            value={p}
            min={1}
            max={6}
            step={1}
            onChange={(val) => updatePolynomialParams({ p: val })}
          />

          {mode === 'tiles' && (
            <TouchSlider
              label="Factor Parameter q"
              value={q}
              min={1}
              max={6}
              step={1}
              onChange={(val) => updatePolynomialParams({ q: val })}
            />
          )}

          <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs text-slate-300">
            <span>Show Grid Partition Lines</span>
            <button
              type="button"
              onClick={() => updatePolynomialParams({ showGrid: !showGrid })}
              className={`px-3 py-1 rounded-lg border font-mono font-bold cursor-pointer ${
                showGrid ? 'bg-cyan-950 border-cyan-600 text-cyan-200' : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
            >
              {showGrid ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
};
