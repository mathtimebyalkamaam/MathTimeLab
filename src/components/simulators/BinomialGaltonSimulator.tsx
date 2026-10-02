/**
 * BinomialGaltonSimulator.tsx: Binomial Theorem & Pascal's Galton Board (Class 11).
 * Features:
 * - Dynamic physics Galton pegboard dropping balls into binomial bins
 * - Visual Pascal's Triangle with combinatorial coefficients ⁿCᵣ on each peg
 * - Demonstrates why row sums equal 2ⁿ and why the distribution forms a Gaussian bell curve
 * - Expansion inspector for (x + y)ⁿ
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
  Play,
  Pause,
  Layers
} from 'lucide-react';
import { useSimulatorStore } from '../../store/useSimulatorStore';
import { BottomSheet } from '../layout/BottomSheet';
import { TouchSlider } from '../common/TouchSlider';
import { CoachTheoryModule } from '../common/CoachTheoryModule';
import { ChallengeManager, ChallengeLevel } from '../common/ChallengeManager';
import { useHaptics } from '../../hooks/useHaptics';
import { useSound } from '../common/SoundManager';
import { useAnalytics } from '../../hooks/useAnalytics';

interface GaltonBall {
  x: number;
  y: number;
  vx: number;
  vy: number;
  currentRow: number;
  currentCol: number;
  isSettled: boolean;
}

export const BinomialGaltonSimulator: React.FC = () => {
  const {
    binomialGaltonParams,
    updateBinomialGaltonParams,
    resetParams,
    completeChallenge,
    challengeCompleted,
    isZenMode,
  } = useSimulatorStore();

  const {
    nPower,
    ballSpeed,
    isDropping,
    showPascalValues,
    showBellCurve,
    showExpansionTerms,
  } = binomialGaltonParams;

  const { lightTap, successBuzz } = useHaptics();
  const { playClick, playChime } = useSound();
  const { trackEvent } = useAnalytics();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ballsRef = useRef<GaltonBall[]>([]);
  const binCountsRef = useRef<number[]>(new Array(nPower + 1).fill(0));

  // Compute combinations nCr
  const nCr = useCallback((n: number, r: number): number => {
    if (r < 0 || r > n) return 0;
    if (r === 0 || r === n) return 1;
    let res = 1;
    for (let i = 1; i <= r; i++) {
      res = (res * (n - i + 1)) / i;
    }
    return Math.round(res);
  }, []);

  // Reset bin counts when nPower changes
  useEffect(() => {
    binCountsRef.current = new Array(nPower + 1).fill(0);
    ballsRef.current = [];
  }, [nPower]);

  // Board Exam Challenge Evaluation
  useEffect(() => {
    // Challenge 1: Power n = 6
    if (nPower === 6 && !challengeCompleted['binomial_power_6']) {
      completeChallenge('binomial_power_6', 40);
      successBuzz();
      playChime();
      confetti({ particleCount: 40, spread: 60 });
      trackEvent('challenge_completed', { challengeId: 'binomial_power_6' });
    }

    // Challenge 2: Total balls in bins >= 50 (Bell curve emerges)
    const totalSettled = binCountsRef.current.reduce((a, b) => a + b, 0);
    if (totalSettled >= 40 && !challengeCompleted['binomial_galton_bell']) {
      completeChallenge('binomial_galton_bell', 45);
      successBuzz();
      playChime();
      confetti({ particleCount: 40, spread: 60 });
      trackEvent('challenge_completed', { challengeId: 'binomial_galton_bell' });
    }

    // Challenge 3: Max middle term inspected (n = 4 or 6)
    if (showPascalValues && (nPower === 4 || nPower === 6) && !challengeCompleted['binomial_middle_term']) {
      completeChallenge('binomial_middle_term', 50);
      successBuzz();
      playChime();
      confetti({ particleCount: 40, spread: 60 });
      trackEvent('challenge_completed', { challengeId: 'binomial_middle_term' });
    }
  }, [nPower, showPascalValues, challengeCompleted, completeChallenge, successBuzz, playChime, trackEvent]);

  // 60fps Canvas render with physics balls
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let frameCount = 0;

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
      const topY = 40;
      const pegSpacingY = Math.min(38, (height - 180) / (nPower + 1));
      const pegSpacingX = Math.min(42, width / (nPower + 2));

      // Peg coordinate helper
      const getPegCoord = (row: number, col: number) => {
        const rowWidth = row * pegSpacingX;
        const x = centerX - rowWidth / 2 + col * pegSpacingX;
        const y = topY + row * pegSpacingY;
        return { x, y };
      };

      // 1. Draw Pascal's Triangle Pegs
      for (let r = 0; r <= nPower; r++) {
        for (let c = 0; c <= r; c++) {
          const { x, y } = getPegCoord(r, c);
          const coeff = nCr(r, c);

          // Peg body
          ctx.fillStyle = '#0f172a';
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(x, y, 7, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Small shiny center
          ctx.fillStyle = '#38bdf8';
          ctx.beginPath();
          ctx.arc(x, y, 2.5, 0, Math.PI * 2);
          ctx.fill();

          // Peg coefficient value text
          if (showPascalValues && pegSpacingY > 26) {
            ctx.fillStyle = '#94a3b8';
            ctx.font = 'bold 9px monospace';
            ctx.fillText(`${coeff}`, x - 4, y - 9);
          }
        }
      }

      // 2. Collector Bins at Bottom
      const binsY = topY + (nPower + 0.8) * pegSpacingY;
      const binWidth = pegSpacingX - 4;
      const maxBinHeight = 65;

      const maxCount = Math.max(1, ...binCountsRef.current);

      for (let b = 0; b <= nPower; b++) {
        const binX = centerX - (nPower * pegSpacingX) / 2 + b * pegSpacingX;
        const count = binCountsRef.current[b] || 0;
        const barHeight = (count / maxCount) * maxBinHeight;

        // Bin walls
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(binX - binWidth / 2, binsY);
        ctx.lineTo(binX - binWidth / 2, binsY + maxBinHeight + 10);
        ctx.lineTo(binX + binWidth / 2, binsY + maxBinHeight + 10);
        ctx.lineTo(binX + binWidth / 2, binsY);
        ctx.stroke();

        // Accumulated bar fill
        const barGrad = ctx.createLinearGradient(0, binsY + maxBinHeight + 10, 0, binsY + maxBinHeight + 10 - barHeight);
        barGrad.addColorStop(0, 'rgba(6, 182, 212, 0.4)');
        barGrad.addColorStop(1, 'rgba(56, 189, 248, 0.9)');
        ctx.fillStyle = barGrad;
        ctx.fillRect(binX - binWidth / 2 + 2, binsY + maxBinHeight + 10 - barHeight, binWidth - 4, barHeight);

        // Bin label: ⁿCᵣ
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 10px monospace';
        ctx.fillText(`C${b}`, binX - 8, binsY + maxBinHeight + 24);

        if (count > 0) {
          ctx.fillStyle = '#ffffff';
          ctx.font = '9px monospace';
          ctx.fillText(`${count}`, binX - 4, binsY + maxBinHeight + 10 - barHeight - 4);
        }
      }

      // 3. Spawning and Updating Falling Physics Balls
      frameCount++;
      if (isDropping && frameCount % Math.max(4, Math.round(16 / ballSpeed)) === 0) {
        ballsRef.current.push({
          x: centerX + (Math.random() - 0.5) * 4,
          y: topY - 15,
          vx: (Math.random() - 0.5) * 1.0,
          vy: ballSpeed * 2,
          currentRow: 0,
          currentCol: 0,
          isSettled: false,
        });
      }

      // Update and draw active balls
      for (let i = ballsRef.current.length - 1; i >= 0; i--) {
        const ball = ballsRef.current[i];
        if (ball.isSettled) continue;

        ball.y += ball.vy;
        ball.x += ball.vx;

        // Collision with pegs
        const nextRow = Math.floor((ball.y - topY + 10) / pegSpacingY);
        if (nextRow > ball.currentRow && nextRow <= nPower) {
          ball.currentRow = nextRow;
          // Random 50/50 bounce left or right
          const goRight = Math.random() > 0.5;
          ball.currentCol += goRight ? 1 : 0;
          const targetCoord = getPegCoord(ball.currentRow, ball.currentCol);
          ball.vx = (targetCoord.x - ball.x) * 0.25;
        }

        // Settling into bottom bin
        if (ball.y >= binsY + maxBinHeight + 5) {
          ball.isSettled = true;
          const finalCol = Math.max(0, Math.min(nPower, ball.currentCol));
          binCountsRef.current[finalCol] = (binCountsRef.current[finalCol] || 0) + 1;
        }

        // Draw ball
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Prune settled balls from array to keep performance blazing
      if (ballsRef.current.length > 150) {
        ballsRef.current = ballsRef.current.filter((b) => !b.isSettled);
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [nPower, ballSpeed, isDropping, showPascalValues, nCr]);

  // Structured Board Exam Challenges
  const challengeLevels: ChallengeLevel[] = [
    {
      levelNumber: 1,
      title: 'Power n = 6 Expansion',
      badge: '(x+y)⁶',
      description: 'Set binomial power to n = 6. Notice how the row coefficients read: 1, 6, 15, 20, 15, 6, 1!',
      requirementFormula: '\\sum_{r=0}^6 \\binom{6}{r} = 2^6 = 64',
      targetCriteria: 'Set n = 6',
      xpReward: 40,
      autoPreset: () => updateBinomialGaltonParams({ nPower: 6, isDropping: true }),
    },
    {
      levelNumber: 2,
      title: 'The Galton Bell Curve',
      badge: 'Gaussian Bell',
      description: 'Drop 40+ balls through the pegboard. Observe how the binomial distribution naturally converges into a smooth bell curve!',
      requirementFormula: '\\binom{n}{r} \\approx \\frac{2^n}{\\sqrt{2\\pi \\sigma^2}} e^{-\\frac{(r-\\mu)^2}{2\\sigma^2}}',
      targetCriteria: 'Accumulate 40+ settled balls',
      xpReward: 45,
      autoPreset: () => {
        binCountsRef.current = new Array(nPower + 1).fill(0);
        updateBinomialGaltonParams({ isDropping: true, ballSpeed: 2.5 });
      },
    },
    {
      levelNumber: 3,
      title: 'Middle Term Dominance',
      badge: 'Max Coefficient',
      description: 'Verify why the center term ⁿC_{n/2} is always the greatest term in the entire expansion (e.g. ⁶C₃ = 20).',
      requirementFormula: '\\max_{0 \\le r \\le n} \\binom{n}{r} = \\binom{n}{\\lfloor n/2 \\rfloor}',
      targetCriteria: 'Inspect middle term ⁶C₃ = 20',
      xpReward: 50,
      autoPreset: () => updateBinomialGaltonParams({ nPower: 6, showPascalValues: true }),
    },
  ];

  return (
    <div className="relative w-full h-[calc(100vh-42px)] md:h-[calc(100vh-52px)] overflow-hidden flex flex-col bg-slate-950 text-slate-100 select-none">
      {/* Dynamic HUD Overlay */}
      {!isZenMode && (
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-20 max-w-[210px] sm:max-w-[260px] bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-2 sm:p-2.5 rounded-xl text-xs space-y-1.5 shadow-2xl">
          <div className="flex items-center justify-between font-mono font-bold text-cyan-300">
            <span>(x + y)^{nPower} Expansion</span>
          </div>

          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800">
            <span className="text-slate-400">Total Terms:</span>
            <span className="font-mono text-cyan-400 font-bold">{nPower + 1} terms</span>
          </div>

          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Sum of Coeffs (2ⁿ):</span>
            <span className="font-mono text-amber-300 font-bold">{Math.pow(2, nPower)}</span>
          </div>

          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Middle Coeff:</span>
            <span className="font-mono text-emerald-400 font-bold">
              ^{nPower}C_{Math.floor(nPower / 2)} = {nCr(nPower, Math.floor(nPower / 2))}
            </span>
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
            onClick={() => updateBinomialGaltonParams({ isDropping: !isDropping })}
            className={`py-1 px-2.5 rounded-lg border text-[11px] font-mono font-bold flex items-center gap-1.5 cursor-pointer ${
              isDropping
                ? 'bg-amber-950 border-amber-500 text-amber-200'
                : 'bg-cyan-950 border-cyan-500 text-cyan-200'
            }`}
          >
            {isDropping ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            <span>{isDropping ? 'Pause Drop' : 'Start Drop'}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              binCountsRef.current = new Array(nPower + 1).fill(0);
              ballsRef.current = [];
              lightTap();
            }}
            className="py-1 px-2.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-[11px] font-mono font-bold text-slate-300 cursor-pointer"
          >
            Clear Bins
          </button>
          <button
            type="button"
            onClick={() => updateBinomialGaltonParams({ showPascalValues: !showPascalValues })}
            className={`py-1 px-2.5 rounded-lg border text-[11px] font-mono font-bold cursor-pointer ${
              showPascalValues
                ? 'bg-purple-950 border-purple-500 text-purple-200'
                : 'bg-slate-900/90 border-slate-700 text-slate-400'
            }`}
          >
            {showPascalValues ? 'ⁿCᵣ Labels (ON)' : 'Labels (OFF)'}
          </button>
        </div>
      </div>

      {/* Collapsible Mobile Bottom Sheet */}
      <BottomSheet
        title="Binomial Galton Mission Control"
        badgeLabel={`n = ${nPower}`}
        quickEquation="(a+b)^n = \sum \binom{n}{r} a^{n-r} b^r"
        onReset={() => resetParams('binomial-galton')}
        theoryContent={
          <CoachTheoryModule
            simulatorId="binomial-galton"
            extraLiveDetails={
              <div className="space-y-2">
                <div className="p-2 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-xs font-mono">
                  <span className="text-[10px] text-cyan-300 block font-semibold">Row {nPower} Coefficients:</span>
                  <span className="text-white font-bold">
                    {Array.from({ length: nPower + 1 }, (_, i) => nCr(nPower, i)).join(', ')}
                  </span>
                </div>

                <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800 text-center font-mono text-xs">
                  <span className="text-emerald-400 font-bold">
                    Sum of Row = 2^{nPower} = {Math.pow(2, nPower)} · Middle Term = ^{nPower}C_{Math.floor(nPower / 2)} = {nCr(nPower, Math.floor(nPower / 2))}
                  </span>
                </div>
              </div>
            }
          />
        }
        challengeContent={
          <div className="space-y-4">
            <ChallengeManager
              simulatorId="binomial-galton"
              simulatorTitle="The Binomial Galton Board"
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
          <TouchSlider
            label="Binomial Power n (Peg Rows)"
            value={nPower}
            min={3}
            max={8}
            step={1}
            onChange={(val) => updateBinomialGaltonParams({ nPower: val })}
          />

          <TouchSlider
            label="Ball Physics Speed"
            value={ballSpeed}
            min={0.8}
            max={3.0}
            step={0.2}
            onChange={(val) => updateBinomialGaltonParams({ ballSpeed: val })}
          />

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => updateBinomialGaltonParams({ isDropping: !isDropping })}
              className={`p-2 rounded-lg text-xs font-medium border text-center transition-colors cursor-pointer ${
                isDropping
                  ? 'bg-amber-950 border-amber-500 text-amber-200'
                  : 'bg-cyan-950 border-cyan-500 text-cyan-200'
              }`}
            >
              {isDropping ? 'Stop Ball Drop' : 'Drop Balls'}
            </button>
            <button
              type="button"
              onClick={() => updateBinomialGaltonParams({ showPascalValues: !showPascalValues })}
              className={`p-2 rounded-lg text-xs font-medium border text-center transition-colors cursor-pointer ${
                showPascalValues
                  ? 'bg-purple-950 border-purple-500 text-purple-200'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              Toggle ⁿCᵣ Peg Numbers
            </button>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
};
