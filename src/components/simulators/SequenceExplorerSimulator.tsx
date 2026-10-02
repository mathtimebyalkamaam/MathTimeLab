/**
 * SequenceExplorerSimulator.tsx: AP, GP & Infinite Series Convergence (Class 11).
 * Features:
 * - Interactive visual staircase for Arithmetic Progressions (AP)
 * - Gauss's inverted staircase pairing: demonstrates why Sₙ = n(a + l)/2
 * - Finite Geometric Progression (GP) multiplier bars
 * - Infinite GP fractal unit square filling: visualizes 1/2 + 1/4 + 1/8 + ... = 1
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
  TrendingUp,
  BarChart3,
  Infinity as InfinityIcon
} from 'lucide-react';
import { useSimulatorStore } from '../../store/useSimulatorStore';
import { BottomSheet } from '../layout/BottomSheet';
import { TouchSlider } from '../common/TouchSlider';
import { CoachTheoryModule } from '../common/CoachTheoryModule';
import { ChallengeManager, ChallengeLevel } from '../common/ChallengeManager';
import { useHaptics } from '../../hooks/useHaptics';
import { useSound } from '../common/SoundManager';
import { useAnalytics } from '../../hooks/useAnalytics';

export const SequenceExplorerSimulator: React.FC = () => {
  const {
    sequenceParams,
    updateSequenceParams,
    resetParams,
    completeChallenge,
    challengeCompleted,
    isZenMode,
  } = useSimulatorStore();

  const {
    mode,
    a1,
    diffOrRatio,
    nTerms,
    showVisualBars,
    showGaussPairing,
    showInfiniteSumBox,
  } = sequenceParams;

  const { lightTap, successBuzz } = useHaptics();
  const { playClick, playChime } = useSound();
  const { trackEvent } = useAnalytics();

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Term calculations
  const terms: number[] = [];
  if (mode === 'AP') {
    for (let i = 0; i < nTerms; i++) {
      terms.push(a1 + i * diffOrRatio);
    }
  } else {
    for (let i = 0; i < nTerms; i++) {
      terms.push(a1 * Math.pow(diffOrRatio, i));
    }
  }

  // Sum calculations
  const lastTerm = terms[terms.length - 1] || a1;
  const apSum = (nTerms * (a1 + lastTerm)) / 2;
  const gpSum =
    Math.abs(diffOrRatio - 1) < 0.001
      ? a1 * nTerms
      : (a1 * (1 - Math.pow(diffOrRatio, nTerms))) / (1 - diffOrRatio);

  const isConvergent = Math.abs(diffOrRatio) < 1;
  const infiniteSum = isConvergent ? a1 / (1 - diffOrRatio) : null;

  // Board Exam Challenge Evaluation
  useEffect(() => {
    // Challenge 1: Gauss's sum 1 to 10 (a1 = 1, d = 1, n = 10 -> Sum = 55)
    if (
      mode === 'AP' &&
      a1 === 1 &&
      diffOrRatio === 1 &&
      nTerms === 10 &&
      !challengeCompleted['seq_gauss_10']
    ) {
      completeChallenge('seq_gauss_10', 40);
      successBuzz();
      playChime();
      confetti({ particleCount: 40, spread: 60 });
      trackEvent('challenge_completed', { challengeId: 'seq_gauss_10' });
    }

    // Challenge 2: Infinite GP Convergence (a1 = 4, r = 0.5 -> S_inf = 8)
    if (
      mode === 'InfiniteGP' &&
      a1 === 4 &&
      Math.abs(diffOrRatio - 0.5) < 0.05 &&
      !challengeCompleted['seq_infinite_half']
    ) {
      completeChallenge('seq_infinite_half', 45);
      successBuzz();
      playChime();
      confetti({ particleCount: 40, spread: 60 });
      trackEvent('challenge_completed', { challengeId: 'seq_infinite_half' });
    }

    // Challenge 3: Inverted Gauss Pairing Visualizer active in AP
    if (mode === 'AP' && showGaussPairing && !challengeCompleted['seq_gauss_pairing']) {
      completeChallenge('seq_gauss_pairing', 50);
      successBuzz();
      playChime();
      confetti({ particleCount: 40, spread: 60 });
      trackEvent('challenge_completed', { challengeId: 'seq_gauss_pairing' });
    }
  }, [mode, a1, diffOrRatio, nTerms, showGaussPairing, challengeCompleted, completeChallenge, successBuzz, playChime, trackEvent]);

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
      const baselineY = height - 50;

      if (mode === 'AP') {
        // Render Arithmetic Staircase
        const maxVal = Math.max(10, ...terms.map((t) => Math.abs(t)));
        const barWidth = Math.min(36, (width - 100) / nTerms);
        const startX = centerX - (nTerms * (barWidth + 6)) / 2;

        for (let i = 0; i < nTerms; i++) {
          const val = terms[i];
          const barH = (val / maxVal) * (height - 140);
          const x = startX + i * (barWidth + 6);
          const y = baselineY - barH;

          // Main AP Bar (Cyan gradient)
          const grad = ctx.createLinearGradient(0, baselineY, 0, y);
          grad.addColorStop(0, 'rgba(6, 182, 212, 0.4)');
          grad.addColorStop(1, 'rgba(56, 189, 248, 0.9)');
          ctx.fillStyle = grad;
          ctx.fillRect(x, y, barWidth, barH);
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(x, y, barWidth, barH);

          // Value on top
          ctx.fillStyle = '#38bdf8';
          ctx.font = 'bold 11px monospace';
          ctx.fillText(`${val}`, x + barWidth / 2 - 6, y - 6);

          // Inverted Gauss Pairing Bar (Amber inverted staircase)
          if (showGaussPairing) {
            const pairedVal = terms[nTerms - 1 - i];
            const pairedH = (pairedVal / maxVal) * (height - 140);
            const py = y - pairedH;

            const pGrad = ctx.createLinearGradient(0, y, 0, py);
            pGrad.addColorStop(0, 'rgba(245, 158, 11, 0.3)');
            pGrad.addColorStop(1, 'rgba(251, 191, 36, 0.8)');
            ctx.fillStyle = pGrad;
            ctx.fillRect(x, py, barWidth, pairedH);
            ctx.strokeStyle = '#f59e0b';
            ctx.strokeRect(x, py, barWidth, pairedH);
          }
        }

        // Baseline
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(30, baselineY);
        ctx.lineTo(width - 30, baselineY);
        ctx.stroke();

        if (showGaussPairing) {
          ctx.fillStyle = '#f59e0b';
          ctx.font = 'bold 12px sans-serif';
          ctx.fillText(`Gauss Pairing: Each column sums to a₁ + aₙ = ${a1 + lastTerm}!`, startX, 40);
        }
      } else if (mode === 'GP') {
        // Render Finite GP Bars
        const maxVal = Math.max(10, ...terms.map((t) => Math.abs(t)));
        const barWidth = Math.min(36, (width - 100) / nTerms);
        const startX = centerX - (nTerms * (barWidth + 8)) / 2;

        for (let i = 0; i < nTerms; i++) {
          const val = terms[i];
          const barH = Math.min(height - 120, (val / maxVal) * (height - 140));
          const x = startX + i * (barWidth + 8);
          const y = baselineY - barH;

          ctx.fillStyle = 'rgba(168, 85, 247, 0.5)';
          ctx.strokeStyle = '#c084fc';
          ctx.lineWidth = 1.5;
          ctx.fillRect(x, y, barWidth, barH);
          ctx.strokeRect(x, y, barWidth, barH);

          ctx.fillStyle = '#e879f9';
          ctx.font = 'bold 10px monospace';
          ctx.fillText(`${val.toFixed(1)}`, x + barWidth / 2 - 8, y - 6);
        }

        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(30, baselineY);
        ctx.lineTo(width - 30, baselineY);
        ctx.stroke();
      } else if (mode === 'InfiniteGP') {
        // Fractal Unit Square Filling Visualization
        const squareSize = Math.min(220, height - 120);
        const sX = centerX - squareSize / 2;
        const sY = centerY - squareSize / 2;

        // Big container bounding box of Area S_∞
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.strokeRect(sX, sY, squareSize, squareSize);

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 12px monospace';
        ctx.fillText(`Total Area = S_∞ = ${infiniteSum !== null ? infiniteSum.toFixed(2) : '∞ (Divergent)'}`, sX, sY - 12);

        if (isConvergent) {
          // Progressively partition the square into pieces representing terms
          let curX = sX;
          let curY = sY;
          let curW = squareSize;
          let curH = squareSize;

          const colors = ['#06b6d4', '#f59e0b', '#10b981', '#a855f7', '#ec4899', '#3b82f6'];

          for (let i = 0; i < Math.min(7, nTerms); i++) {
            ctx.fillStyle = colors[i % colors.length];
            ctx.globalAlpha = 0.5;

            if (i % 2 === 0) {
              // Split horizontally
              const splitW = curW * (1 - diffOrRatio);
              ctx.fillRect(curX, curY, splitW, curH);
              ctx.strokeRect(curX, curY, splitW, curH);
              curX += splitW;
              curW -= splitW;
            } else {
              // Split vertically
              const splitH = curH * (1 - diffOrRatio);
              ctx.fillRect(curX, curY, curW, splitH);
              ctx.strokeRect(curX, curY, curW, splitH);
              curY += splitH;
              curH -= splitH;
            }
            ctx.globalAlpha = 1.0;
          }
        } else {
          ctx.fillStyle = '#f43f5e';
          ctx.font = 'bold 14px sans-serif';
          ctx.fillText('DIVERGENT! |r| ≥ 1 (Terms grow to infinity)', sX + 15, centerY);
        }
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [mode, a1, diffOrRatio, nTerms, terms, lastTerm, showGaussPairing, isConvergent, infiniteSum]);

  // Structured Board Exam Challenges
  const challengeLevels: ChallengeLevel[] = [
    {
      levelNumber: 1,
      title: "Gauss's Sum: 1 to 10",
      badge: 'S₁₀ = 55',
      description: 'Set a₁ = 1, d = 1, and n = 10. Verify how Gauss paired 1 + 10 = 11 to calculate S₁₀ = 55 in seconds!',
      requirementFormula: 'S_{10} = \\frac{10}{2}(1 + 10) = 5 \\times 11 = 55',
      targetCriteria: 'Set a₁=1, d=1, n=10 in AP mode',
      xpReward: 40,
      autoPreset: () => updateSequenceParams({ mode: 'AP', a1: 1, diffOrRatio: 1, nTerms: 10, showGaussPairing: true }),
    },
    {
      levelNumber: 2,
      title: 'Infinite GP: Halving Sequence',
      badge: 'S_∞ = a / (1-r)',
      description: 'Switch to Infinite GP mode with a₁ = 4 and r = 0.5. Watch how 4 + 2 + 1 + 0.5 + ... converges precisely to 8!',
      requirementFormula: 'S_\\infty = \\frac{4}{1 - 0.5} = 8',
      targetCriteria: 'Set a₁ = 4, r = 0.5 in Infinite GP mode',
      xpReward: 45,
      autoPreset: () => updateSequenceParams({ mode: 'InfiniteGP', a1: 4, diffOrRatio: 0.5, nTerms: 8 }),
    },
    {
      levelNumber: 3,
      title: 'The Inverted Staircase Pairing',
      badge: 'Gauss Pairing',
      description: 'Turn on the Inverted Gauss Pairing overlay in AP mode to see identical columns of height (first + last).',
      requirementFormula: 'S_n = \\frac{n(a + l)}{2}',
      targetCriteria: 'Activate Gauss Pairing overlay',
      xpReward: 50,
      autoPreset: () => updateSequenceParams({ mode: 'AP', showGaussPairing: true }),
    },
  ];

  return (
    <div className="relative w-full h-[calc(100vh-42px)] md:h-[calc(100vh-52px)] overflow-hidden flex flex-col bg-slate-950 text-slate-100 select-none">
      {/* Dynamic HUD Overlay */}
      {!isZenMode && (
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-20 max-w-[210px] sm:max-w-[260px] bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-2 sm:p-2.5 rounded-xl text-xs space-y-1.5 shadow-2xl">
          <div className="flex items-center justify-between font-mono font-bold text-cyan-300">
            <span>
              {mode === 'AP'
                ? `AP Sum Sₙ = ${apSum}`
                : mode === 'GP'
                ? `GP Sum Sₙ = ${gpSum.toFixed(2)}`
                : `S_∞ = ${infiniteSum !== null ? infiniteSum.toFixed(2) : 'Divergent'}`}
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800">
            <span className="text-slate-400">First Term a₁:</span>
            <span className="font-mono text-cyan-400 font-bold">{a1}</span>
          </div>

          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">{mode === 'AP' ? 'Common Diff d:' : 'Common Ratio r:'}</span>
            <span className="font-mono text-amber-300 font-bold">{diffOrRatio}</span>
          </div>

          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Last Term aₙ:</span>
            <span className="font-mono text-purple-300 font-bold">{lastTerm.toFixed(1)}</span>
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
            onClick={() => updateSequenceParams({ mode: 'AP', a1: 1, diffOrRatio: 1, nTerms: 10, showGaussPairing: true })}
            className={`py-1 px-2.5 rounded-lg border text-[11px] font-mono font-bold cursor-pointer ${
              mode === 'AP' ? 'bg-cyan-950 border-cyan-500 text-cyan-200' : 'bg-slate-900/90 border-slate-700 text-slate-300'
            }`}
          >
            Gauss 1 to 10
          </button>
          <button
            type="button"
            onClick={() => updateSequenceParams({ mode: 'InfiniteGP', a1: 4, diffOrRatio: 0.5, nTerms: 8 })}
            className={`py-1 px-2.5 rounded-lg border text-[11px] font-mono font-bold cursor-pointer ${
              mode === 'InfiniteGP' ? 'bg-purple-950 border-purple-500 text-purple-200' : 'bg-slate-900/90 border-slate-700 text-slate-300'
            }`}
          >
            S_∞ Halving (r=0.5)
          </button>
          <button
            type="button"
            onClick={() => updateSequenceParams({ showGaussPairing: !showGaussPairing })}
            className={`py-1 px-2.5 rounded-lg border text-[11px] font-mono font-bold cursor-pointer ${
              showGaussPairing ? 'bg-amber-950 border-amber-500 text-amber-200' : 'bg-slate-900/90 border-slate-700 text-slate-400'
            }`}
          >
            Gauss Pairing {showGaussPairing ? '(ON)' : '(OFF)'}
          </button>
        </div>
      </div>

      {/* Collapsible Mobile Bottom Sheet */}
      <BottomSheet
        title="Sequence Explorer Mission Control"
        badgeLabel={mode === 'AP' ? `AP (d=${diffOrRatio})` : `GP (r=${diffOrRatio})`}
        quickEquation={
          mode === 'AP'
            ? 'S_n = \\frac{n}{2}(a + l)'
            : 'S_\\infty = \\frac{a}{1-r} \\quad (|r| < 1)'
        }
        onReset={() => resetParams('arithmetic-geometric-explorer')}
        theoryContent={
          <CoachTheoryModule
            simulatorId="arithmetic-geometric-explorer"
            extraLiveDetails={
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2 text-xs text-center font-mono">
                  <div className="p-2 rounded-xl bg-cyan-950/30 border border-cyan-800/40">
                    <span className="text-[10px] text-cyan-300 block font-semibold">Terms (n = {nTerms}):</span>
                    <span className="text-white font-bold">{terms.slice(0, 4).join(', ')}...</span>
                  </div>
                  <div className="p-2 rounded-xl bg-amber-950/30 border border-amber-800/40">
                    <span className="text-[10px] text-amber-300 block font-semibold">Calculated Sum:</span>
                    <span className="text-white font-bold">{mode === 'AP' ? apSum : gpSum.toFixed(2)}</span>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800 text-center font-mono text-xs">
                  <span className="text-emerald-400 font-bold">
                    {mode === 'AP'
                      ? `Gauss: ${nTerms}/2 × (${a1} + ${lastTerm}) = ${apSum}`
                      : isConvergent
                      ? `Infinite Convergence: S_∞ = ${a1} / (1 - ${diffOrRatio}) = ${infiniteSum?.toFixed(2)}`
                      : 'Divergent: |r| ≥ 1 (Terms do not diminish)'}
                  </span>
                </div>
              </div>
            }
          />
        }
        challengeContent={
          <div className="space-y-4">
            <ChallengeManager
              simulatorId="arithmetic-geometric-explorer"
              simulatorTitle="The Sequence Explorer"
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
              onClick={() => updateSequenceParams({ mode: 'AP' })}
              className={`py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                mode === 'AP' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'
              }`}
            >
              AP Mode
            </button>
            <button
              type="button"
              onClick={() => updateSequenceParams({ mode: 'GP' })}
              className={`py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                mode === 'GP' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'
              }`}
            >
              GP Mode
            </button>
            <button
              type="button"
              onClick={() => updateSequenceParams({ mode: 'InfiniteGP' })}
              className={`py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                mode === 'InfiniteGP' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'
              }`}
            >
              Infinite GP
            </button>
          </div>

          <TouchSlider
            label="First Term a₁"
            value={a1}
            min={1}
            max={10}
            step={1}
            onChange={(val) => updateSequenceParams({ a1: val })}
          />

          <TouchSlider
            label={mode === 'AP' ? 'Common Difference d' : 'Common Ratio r'}
            value={diffOrRatio}
            min={mode === 'AP' ? 1 : 0.2}
            max={mode === 'AP' ? 6 : mode === 'InfiniteGP' ? 0.9 : 2.5}
            step={mode === 'AP' ? 1 : 0.1}
            onChange={(val) => updateSequenceParams({ diffOrRatio: Number(val.toFixed(2)) })}
          />

          <TouchSlider
            label="Number of Terms n"
            value={nTerms}
            min={4}
            max={12}
            step={1}
            onChange={(val) => updateSequenceParams({ nTerms: val })}
          />

          {mode === 'AP' && (
            <div className="pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => updateSequenceParams({ showGaussPairing: !showGaussPairing })}
                className={`w-full py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                  showGaussPairing
                    ? 'bg-amber-950 border-amber-500 text-amber-200'
                    : 'bg-slate-900 border-slate-700 text-slate-300'
                }`}
              >
                {showGaussPairing ? 'Hide Inverted Gauss Staircase' : 'Show Inverted Gauss Staircase Pairing'}
              </button>
            </div>
          )}
        </div>
      </BottomSheet>
    </div>
  );
};
