/**
 * PermutationsCombinationsSimulator.tsx: Interactive Arrangement Lock & Circular Seating Matrix (Class 11 Algebra).
 * Features:
 * - Mechanical Combination Lock / Token Chooser: n items (A, B, C, D, E) picking r items
 * - Permutation Mode (ⁿPᵣ): Order Matters! [A, B] ≠ [B, A]
 * - Combination Mode (ⁿCᵣ): Order Does NOT Matter! Redundant arrangements collapse into buckets by dividing by r!
 * - Circular Seating Mode: n items around a round table with interactive rotation slider showing why circular permutations equal (n-1)!
 * - Pure live factorials & Pascal/combination math readouts
 * - 3 Progressive board exam challenges
 */
import React, { useEffect, useRef, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { 
  Lock, 
  RotateCcw, 
  CheckCircle2, 
  Users, 
  Sliders, 
  Sparkles,
  KeyRound,
  RotateCw
} from 'lucide-react';
import { useSimulatorStore } from '../../store/useSimulatorStore';
import { BottomSheet } from '../layout/BottomSheet';
import { TouchSlider } from '../common/TouchSlider';
import { CoachTheoryModule } from '../common/CoachTheoryModule';
import { ChallengeManager, ChallengeLevel } from '../common/ChallengeManager';
import { useHaptics } from '../../hooks/useHaptics';
import { useSound } from '../common/SoundManager';
import { useAnalytics } from '../../hooks/useAnalytics';

const ITEM_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
const ITEM_COLORS = [
  '#ef4444', // Red
  '#3b82f6', // Blue
  '#10b981', // Green
  '#f59e0b', // Amber
  '#a855f7', // Purple
  '#ec4899', // Pink
  '#06b6d4', // Cyan
];

export const PermutationsCombinationsSimulator: React.FC = () => {
  const {
    permutationsCombinationsParams,
    updatePermutationsCombinationsParams,
    resetParams,
    completeChallenge,
    challengeCompleted,
    isZenMode,
  } = useSimulatorStore();

  const {
    mode,
    nTotal,
    rChosen,
    showFactorialTree,
    showDuplicateCancel,
    tableRotationDeg,
  } = permutationsCombinationsParams;

  const { lightTap, successBuzz } = useHaptics();
  const { playClick, playChime } = useSound();
  const { trackEvent } = useAnalytics();

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Factorial helper
  const fact = (num: number): number => {
    let res = 1;
    for (let i = 2; i <= num; i++) res *= i;
    return res;
  };

  const nFact = fact(nTotal);
  const rFact = fact(rChosen);
  const nMinusRFact = fact(nTotal - rChosen);
  const nPr = nFact / nMinusRFact;
  const nCr = nPr / rFact;
  const circularArrangements = fact(nTotal - 1);

  // Generate permutations of first rChosen items from nTotal items
  const generatePermutations = useCallback(() => {
    const items = ITEM_LABELS.slice(0, nTotal);
    const results: string[][] = [];

    const permute = (current: string[], remaining: string[]) => {
      if (current.length === rChosen) {
        results.push(current);
        return;
      }
      for (let i = 0; i < remaining.length; i++) {
        permute(
          [...current, remaining[i]],
          [...remaining.slice(0, i), ...remaining.slice(i + 1)]
        );
      }
    };

    permute([], items);
    return results;
  }, [nTotal, rChosen]);

  const allPerms = generatePermutations();

  // Group into combinations (sorted tuple keys)
  const combBuckets: Record<string, string[][]> = {};
  allPerms.forEach((p) => {
    const key = [...p].sort().join('');
    if (!combBuckets[key]) combBuckets[key] = [];
    combBuckets[key].push(p);
  });

  // Board Exam Challenge Evaluation
  useEffect(() => {
    // Challenge 1: The r! Factor Collapse
    if (mode === 'combinations' && rChosen >= 2 && !challengeCompleted['perm_r_fact_collapse']) {
      completeChallenge('perm_r_fact_collapse', 40);
      successBuzz();
      playChime();
      confetti({ particleCount: 35, spread: 60 });
      trackEvent('challenge_completed', { challengeId: 'perm_r_fact_collapse' });
    }

    // Challenge 2: Circular Table (n - 1)! Discovery
    if (mode === 'circular-table' && tableRotationDeg >= 90 && !challengeCompleted['perm_circular_spin']) {
      completeChallenge('perm_circular_spin', 45);
      successBuzz();
      playChime();
      confetti({ particleCount: 45, spread: 65 });
      trackEvent('challenge_completed', { challengeId: 'perm_circular_spin' });
    }

    // Challenge 3: 5P3 vs 5C3 Board Exam Comparison
    if (nTotal === 5 && rChosen === 3 && !challengeCompleted['perm_5p3_5c3']) {
      completeChallenge('perm_5p3_5c3', 50);
      successBuzz();
      playChime();
      confetti({ particleCount: 50, spread: 70 });
      trackEvent('challenge_completed', { challengeId: 'perm_5p3_5c3' });
    }
  }, [
    mode,
    rChosen,
    tableRotationDeg,
    nTotal,
    challengeCompleted,
    completeChallenge,
    successBuzz,
    playChime,
    trackEvent,
  ]);

  // Canvas Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;

    const render = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      // Deep space grid
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      const gridSize = 24;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      const centerX = width / 2;
      const centerY = height / 2 - 10;

      if (mode === 'circular-table') {
        // Circular Seating Table
        const tableR = Math.min(width, height) / 3.8;
        const rotRad = (tableRotationDeg * Math.PI) / 180;

        // Wood dining table
        const tableGrad = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, tableR);
        tableGrad.addColorStop(0, '#78350f');
        tableGrad.addColorStop(0.8, '#451a03');
        tableGrad.addColorStop(1, '#291102');

        ctx.fillStyle = tableGrad;
        ctx.beginPath();
        ctx.arc(centerX, centerY, tableR, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Rotation arrow guide
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 4]);
        ctx.beginPath();
        ctx.arc(centerX, centerY, tableR * 0.65, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Table center label
        ctx.fillStyle = '#fef3c7';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`Round Table: ${nTotal} Guests`, centerX, centerY - 6);
        ctx.font = '10px monospace';
        ctx.fillStyle = '#fbbf24';
        ctx.fillText(`(${nTotal}-1)! = ${circularArrangements} ways`, centerX, centerY + 12);

        // Position nTotal chairs around table
        for (let i = 0; i < nTotal; i++) {
          const angle = rotRad + (i * 2 * Math.PI) / nTotal - Math.PI / 2;
          const chairR = tableR + 24;
          const cx = centerX + chairR * Math.cos(angle);
          const cy = centerY + chairR * Math.sin(angle);

          // Guest token
          ctx.fillStyle = ITEM_COLORS[i % ITEM_COLORS.length];
          ctx.beginPath();
          ctx.arc(cx, cy, 14, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 11px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(ITEM_LABELS[i], cx, cy + 4);
        }
      } else {
        // Permutation vs Combination Grid/Buckets
        const entries = Object.entries(combBuckets);
        const cols = Math.min(entries.length, Math.max(2, Math.floor(width / 130)));
        const colWidth = (width - 40) / cols;
        const startY = 40;

        entries.forEach(([combKey, perms], cIdx) => {
          const colX = 20 + (cIdx % cols) * colWidth;
          const rowY = startY + Math.floor(cIdx / cols) * 85;

          if (rowY < height - 20) {
            // Bucket Container for combination
            const isCombinationMode = mode === 'combinations';
            ctx.fillStyle = isCombinationMode ? 'rgba(16, 185, 129, 0.15)' : 'rgba(56, 189, 248, 0.1)';
            ctx.strokeStyle = isCombinationMode ? '#10b981' : '#38bdf8';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.roundRect(colX + 4, rowY, colWidth - 8, 70, 8);
            ctx.fill();
            ctx.stroke();

            // Bucket Title
            ctx.fillStyle = isCombinationMode ? '#34d399' : '#38bdf8';
            ctx.font = 'bold 11px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(
              isCombinationMode ? `{${combKey.split('').join(', ')}} (1 Pick)` : `Permutations (${perms.length}x)`,
              colX + colWidth / 2,
              rowY + 16
            );

            // Permutation badges inside
            perms.slice(0, 4).forEach((p, pIdx) => {
              const badgeX = colX + 10 + (pIdx % 2) * (colWidth / 2 - 10);
              const badgeY = rowY + 28 + Math.floor(pIdx / 2) * 20;

              ctx.fillStyle = '#1e293b';
              ctx.strokeStyle = '#475569';
              ctx.strokeRect(badgeX, badgeY, colWidth / 2 - 14, 16);

              ctx.font = '9px monospace';
              ctx.fillStyle = '#f8fafc';
              ctx.textAlign = 'center';
              ctx.fillText(`[${p.join('')}]`, badgeX + (colWidth / 2 - 14) / 2, badgeY + 12);
            });
          }
        });
      }

      ctx.restore();
    };

    render();
    window.addEventListener('resize', render);
    return () => {
      window.removeEventListener('resize', render);
      cancelAnimationFrame(animId);
    };
  }, [
    mode,
    nTotal,
    rChosen,
    tableRotationDeg,
    combBuckets,
    circularArrangements,
  ]);

  const challengeLevels: ChallengeLevel[] = [
    {
      levelNumber: 1,
      title: 'The r! Redundancy Collapse',
      badge: 'Divide by r!',
      description: 'Switch to Combination mode. Notice how permutations in each bucket collapse into one unordered selection by dividing by r! = 2! = 2.',
      requirementFormula: '^{n}C_r = \\frac{^{n}P_r}{r!} = \\frac{12}{2!} = 6',
      targetCriteria: 'Select Combination mode with r = 2',
      xpReward: 35,
      autoPreset: () => {
        updatePermutationsCombinationsParams({ mode: 'combinations', nTotal: 4, rChosen: 2 });
      },
    },
    {
      levelNumber: 2,
      title: 'The Circular Table (n-1)! Spin',
      badge: 'Circular Seater',
      description: 'Switch to Circular Seating mode. Spin the table past 90°. Notice everyone’s left and right neighbors stay identical, dividing out the n rotations!',
      requirementFormula: '(n - 1)! = (5 - 1)! = 24',
      targetCriteria: 'Spin Circular Table past 90°',
      xpReward: 45,
      autoPreset: () => {
        updatePermutationsCombinationsParams({ mode: 'circular-table', nTotal: 5, tableRotationDeg: 120 });
      },
    },
    {
      levelNumber: 3,
      title: 'The 5P3 vs 5C3 Board Exam Standard',
      badge: 'Counting Master',
      description: 'Set n = 5 and r = 3. Observe why ⁵P₃ = 60 arrangements, while ⁵C₃ = 60 / 3! = 10 selections!',
      requirementFormula: '^{5}P_3 = 60, \\quad ^{5}C_3 = 10',
      targetCriteria: 'Set n = 5 and r = 3 in Permutations',
      xpReward: 50,
      autoPreset: () => {
        updatePermutationsCombinationsParams({ mode: 'permutations', nTotal: 5, rChosen: 3 });
      },
    },
  ];

  return (
    <div className="relative w-full h-full flex flex-col bg-slate-950 text-slate-100 overflow-hidden select-none">
      {/* HUD Header Bar */}
      <div className="flex-none px-4 py-2 bg-slate-900/90 border-b border-slate-800 backdrop-blur-md flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold text-slate-200">
            {mode === 'permutations' && `PERMUTATIONS ⁿPᵣ = ${nPr}`}
            {mode === 'combinations' && `COMBINATIONS ⁿCᵣ = ${nCr}`}
            {mode === 'circular-table' && `CIRCULAR TABLE (n-1)! = ${circularArrangements}`}
          </span>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/40">
            n = {nTotal}, r = {rChosen} · {mode === 'permutations' ? 'Order Matters' : 'Order Does Not Matter'}
          </span>
        </div>

        <button
          onClick={() => {
            resetParams('permutations-combinations');
            playClick();
            lightTap();
          }}
          className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-all cursor-pointer"
          title="Reset Parameters"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Interactive Canvas */}
      <div className="relative flex-1 w-full h-full min-h-[300px] overflow-hidden">
        <canvas ref={canvasRef} className="w-full h-full block" />

        {/* Live Factorial Math Box */}
        <div className="absolute top-3 left-3 pointer-events-none bg-slate-900/85 backdrop-blur-md p-2.5 rounded-xl border border-slate-800/80 shadow-xl max-w-xs text-xs space-y-1">
          <div className="text-[11px] font-bold text-cyan-300 uppercase tracking-wide">
            {mode === 'permutations' && `ⁿPᵣ = n! / (n-r)! = ${nTotal}! / ${nTotal - rChosen}! = ${nPr}`}
            {mode === 'combinations' && `ⁿCᵣ = ⁿPᵣ / r! = ${nPr} / ${rFact} = ${nCr}`}
            {mode === 'circular-table' && `Circular Permutations = n! / n = (${nTotal}-1)! = ${circularArrangements}`}
          </div>
          <div className="text-amber-400 text-[10px] flex items-center gap-1 font-semibold">
            <Sparkles className="w-3 h-3" />
            <span>{mode === 'permutations' ? '[A, B] ≠ [B, A]' : '{A, B} = {B, A} (Collapses by r!)'}</span>
          </div>
        </div>
      </div>

      {/* Bottom Sheet Controls & Mission Center */}
      <BottomSheet
        title="Permutations & Combinations Mission Control"
        badgeLabel={mode === 'permutations' ? `ⁿPᵣ = ${nPr}` : mode === 'combinations' ? `ⁿCᵣ = ${nCr}` : `(n-1)! = ${circularArrangements}`}
        quickEquation={mode === 'permutations' ? '^{n}P_r = \\frac{n!}{(n-r)!}' : mode === 'combinations' ? '^{n}C_r = \\frac{n!}{r!(n-r)!}' : '(n-1)!'}
        onReset={() => resetParams('permutations-combinations')}
        theoryContent={<CoachTheoryModule simulatorId="permutations-combinations" />}
        challengeContent={
          <ChallengeManager
            simulatorId="permutations-combinations"
            simulatorTitle="Permutations & Combinations"
            levels={challengeLevels}
            onTriggerPreset={(lvl: number) => {
              playClick();
              lightTap();
              const targetLvl = challengeLevels.find((l) => l.levelNumber === lvl);
              targetLvl?.autoPreset?.();
            }}
            isOpenDefault={true}
          />
        }
      >
        <div className="space-y-4 text-xs">
          {/* Mode Switcher */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Counting Logic Mode
            </label>
            <div className="grid grid-cols-3 gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => {
                  updatePermutationsCombinationsParams({ mode: 'permutations' });
                  playClick();
                  lightTap();
                }}
                className={`py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  mode === 'permutations'
                    ? 'bg-cyan-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Permutations (ⁿPᵣ)
              </button>
              <button
                onClick={() => {
                  updatePermutationsCombinationsParams({ mode: 'combinations' });
                  playClick();
                  lightTap();
                }}
                className={`py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  mode === 'combinations'
                    ? 'bg-emerald-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Combinations (ⁿCᵣ)
              </button>
              <button
                onClick={() => {
                  updatePermutationsCombinationsParams({ mode: 'circular-table' });
                  playClick();
                  lightTap();
                }}
                className={`py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  mode === 'circular-table'
                    ? 'bg-amber-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Circle (n-1)!
              </button>
            </div>
          </div>

          {/* Total items n Slider */}
          <TouchSlider
            label="Total Available Items (n)"
            value={nTotal}
            min={3}
            max={6}
            step={1}
            unit=""
            onChange={(val) => {
              const newN = val;
              const newR = Math.min(rChosen, newN);
              updatePermutationsCombinationsParams({ nTotal: newN, rChosen: newR });
            }}
          />

          {/* Pick r Slider */}
          {mode !== 'circular-table' && (
            <TouchSlider
              label="Number of Items Chosen (r)"
              value={rChosen}
              min={1}
              max={nTotal}
              step={1}
              unit=""
              onChange={(val) => updatePermutationsCombinationsParams({ rChosen: val })}
            />
          )}

          {/* Circular Table Rotation Slider */}
          {mode === 'circular-table' && (
            <TouchSlider
              label="Spin Circular Table (Rotational Symmetries)"
              value={tableRotationDeg}
              min={0}
              max={360}
              step={10}
              unit="°"
              onChange={(val) => updatePermutationsCombinationsParams({ tableRotationDeg: val })}
            />
          )}
        </div>
      </BottomSheet>
    </div>
  );
};
