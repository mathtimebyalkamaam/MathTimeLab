/**
 * AlgebraicTilesSimulator.tsx: Geometric Algebra Tiles & Visual Identities Sandbox (Class 8 Algebra).
 * Features:
 * - Dynamic geometric square of side (a + b) sliced into a², b², and two ab rectangles
 * - Interactive mode switcher: (a+b)², (a-b)², a²-b², and (x+p)(x+q) middle term factorisation
 * - Exploded tile view separating pieces with dimension rulers
 * - Real-time algebraic term summation matching KaTeX formula
 * - 3 Progressive Board Exam challenges
 */
import React, { useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  Layers, 
  RotateCcw, 
  CheckCircle2, 
  Grid, 
  Sparkles, 
  Maximize2, 
  Sliders,
  Scissors,
  Eye,
  AlertTriangle,
  ShieldAlert,
  BookOpen
} from 'lucide-react';
import { useSimulatorStore } from '../../store/useSimulatorStore';
import { BottomSheet } from '../layout/BottomSheet';
import { TouchSlider } from '../common/TouchSlider';
import { CoachTheoryModule } from '../common/CoachTheoryModule';
import { ChallengeManager, ChallengeLevel } from '../common/ChallengeManager';
import { useHaptics } from '../../hooks/useHaptics';
import { useSound } from '../common/SoundManager';
import { useAnalytics } from '../../hooks/useAnalytics';
import { Eli13ExplainerCard } from '../common/Eli13ExplainerCard';

export const AlgebraicTilesSimulator: React.FC = () => {
  const {
    algebraicTilesParams,
    updateAlgebraicTilesParams,
    resetParams,
    completeChallenge,
    challengeCompleted,
    isZenMode,
  } = useSimulatorStore();

  const {
    identityMode,
    aValue,
    bValue,
    middleFactorP,
    middleFactorQ,
    showTileAreas,
    showExpansionCutout,
    explodedView,
  } = algebraicTilesParams;

  const { lightTap, successBuzz } = useHaptics();
  const { playClick, playChime, playError } = useSound();
  const { trackEvent } = useAnalytics();

  const [isMisconceptionTrapActive, setIsMisconceptionTrapActive] = React.useState<boolean>(false);
  const [controlsSubTab, setControlsSubTab] = React.useState<'setup' | 'presets'>('setup');

  // Scale pixels per unit
  const scale = 26;
  const aPx = aValue * scale;
  const bPx = bValue * scale;
  const explodeGap = explodedView ? 16 : 0;

  // Numerical Area Calculations
  const aSquared = aValue * aValue;
  const bSquared = bValue * bValue;
  const ab = aValue * bValue;
  const totalPlusSq = (aValue + bValue) * (aValue + bValue);
  const totalMinusSq = (aValue - bValue) * (aValue - bValue);
  const diffSquares = aSquared - bSquared;

  const handleReset = () => {
    lightTap();
    playClick();
    resetParams('algebraic-identities-tiles');
  };

  // Challenges for Board Exam mastery
  const challengeLevels: ChallengeLevel[] = [
    {
      levelNumber: 1,
      title: 'The 7×7 Square: (4 + 3)²',
      badge: 'Identity Architect',
      description: 'Set side a = 4 and side b = 3. Verify total area 49 decomposes into 16 + 12 + 12 + 9.',
      requirementFormula: '(4 + 3)^2 = 16 + 2(12) + 9 = 49',
      targetCriteria: 'Set a = 4, b = 3 in (a+b)² mode',
      xpReward: 30,
      tier1Hint: 'Select (a + b)² mode and slide a to 4 and b to 3.',
      tier2Hint: 'Notice the two matching ab rectangles each equal 4 × 3 = 12.',
      tier3Hint: 'Check that 16 + 24 + 9 = 49!',
      autoPreset: () => {
        updateAlgebraicTilesParams({
          identityMode: 'a-plus-b-sq',
          aValue: 4,
          bValue: 3,
        });
      },
    },
    {
      levelNumber: 2,
      title: 'Difference of Squares: 5² - 2²',
      badge: 'L-Tromino Master',
      description: 'Switch to a² - b² mode with a = 5 and b = 2. See 25 - 4 = 21 rearrange into a (5-2)×(5+2) rectangle of 3×7 = 21!',
      requirementFormula: '5^2 - 2^2 = (5 - 2)(5 + 2) = 3 \\times 7 = 21',
      targetCriteria: 'Set mode to a² - b², a = 5, b = 2',
      xpReward: 40,
      tier1Hint: 'Select Difference of Squares mode.',
      tier2Hint: 'Adjust a to 5 and b to 2.',
      tier3Hint: 'Observe the remaining area rearranges into 3 rows of 7!',
      autoPreset: () => {
        updateAlgebraicTilesParams({
          identityMode: 'a-sq-minus-b-sq',
          aValue: 5,
          bValue: 2,
        });
      },
    },
    {
      levelNumber: 3,
      title: 'Factoring Quadratic: x² + 5x + 6',
      badge: 'Factorisation Pro',
      description: 'Switch to Middle Term mode with p = 2 and q = 3. Pack tiles into a complete rectangle of (x + 2)(x + 3).',
      requirementFormula: 'x^2 + 5x + 6 = (x + 2)(x + 3)',
      targetCriteria: 'Set p = 2, q = 3 in Middle Term mode',
      xpReward: 50,
      tier1Hint: 'Select Middle Term Factoring mode.',
      tier2Hint: 'Set factor p = 2 and factor q = 3.',
      tier3Hint: 'See how the 5x term splits into 2x and 3x, and 2 × 3 = 6 unit squares fill the corner!',
      autoPreset: () => {
        updateAlgebraicTilesParams({
          identityMode: 'middle-term-factor',
          middleFactorP: 2,
          middleFactorQ: 3,
        });
      },
    },
  ];

  // Auto verify challenges
  React.useEffect(() => {
    if (identityMode === 'a-plus-b-sq' && aValue === 4 && bValue === 3) {
      if (!challengeCompleted['algebraic-identities-tiles-1']) {
        successBuzz();
        playChime();
        confetti({ particleCount: 35, spread: 60, origin: { y: 0.6 } });
        completeChallenge('algebraic-identities-tiles-1', 30);
      }
    }
    if (identityMode === 'a-sq-minus-b-sq' && aValue === 5 && bValue === 2) {
      if (!challengeCompleted['algebraic-identities-tiles-2']) {
        successBuzz();
        playChime();
        confetti({ particleCount: 40, spread: 65, origin: { y: 0.6 } });
        completeChallenge('algebraic-identities-tiles-2', 40);
      }
    }
    if (identityMode === 'middle-term-factor' && middleFactorP === 2 && middleFactorQ === 3) {
      if (!challengeCompleted['algebraic-identities-tiles-3']) {
        successBuzz();
        playChime();
        confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
        completeChallenge('algebraic-identities-tiles-3', 50);
      }
    }
  }, [identityMode, aValue, bValue, middleFactorP, middleFactorQ, challengeCompleted, completeChallenge, playChime, successBuzz]);

  const controlsContent = (
    <div className="space-y-2 p-2 sm:p-2.5 text-slate-200">
      {/* 2-Segment Sub-Tab Switcher for Guaranteed Zero-Scroll */}
      <div className="grid grid-cols-2 p-0.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
        <button
          type="button"
          onClick={() => {
            lightTap();
            setControlsSubTab('setup');
          }}
          className={`py-1 px-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            controlsSubTab === 'setup'
              ? 'bg-sky-500 text-slate-950 font-bold shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Identities & Tiles</span>
        </button>

        <button
          type="button"
          onClick={() => {
            lightTap();
            setControlsSubTab('presets');
          }}
          className={`py-1 px-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            controlsSubTab === 'presets'
              ? 'bg-amber-500 text-slate-950 font-bold shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>NCERT Presets & Trap</span>
        </button>
      </div>

      {controlsSubTab === 'setup' && (
        <div className="space-y-2 animate-fade-in">
          {/* Identity Mode Selector (Compact 2x2 Grid) */}
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { id: 'a-plus-b-sq', label: '(a + b)²', formula: 'a² + 2ab + b²' },
              { id: 'a-minus-b-sq', label: '(a - b)²', formula: 'a² - 2ab + b²' },
              { id: 'a-sq-minus-b-sq', label: 'a² - b²', formula: '(a-b)(a+b)' },
              { id: 'middle-term-factor', label: '(x+p)(x+q)', formula: 'x²+(p+q)x+pq' },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  lightTap();
                  playClick();
                  updateAlgebraicTilesParams({ identityMode: m.id as any });
                  trackEvent('algebraic_tiles_mode', { mode: m.id });
                }}
                className={`p-1.5 rounded-xl border text-left transition cursor-pointer ${
                  identityMode === m.id
                    ? 'bg-sky-500/20 border-sky-400 text-sky-200 shadow-sm'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="text-xs font-bold">{m.label}</div>
                <div className="text-[9px] font-mono text-slate-400">{m.formula}</div>
              </button>
            ))}
          </div>

          {/* Sliders in Smart 2-Column Cockpit Grid */}
          {identityMode !== 'middle-term-factor' ? (
            <div className="cockpit-slider-grid grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-0.5 bg-slate-900/70 border border-slate-800 rounded-xl p-2">
              <TouchSlider
                compact={true}
                label="Dimension a"
                value={aValue}
                min={2}
                max={8}
                step={1}
                onChange={(val) => updateAlgebraicTilesParams({ aValue: val })}
              />
              <TouchSlider
                compact={true}
                label="Dimension b"
                value={bValue}
                min={1}
                max={Math.min(6, aValue - 1)}
                step={1}
                onChange={(val) => updateAlgebraicTilesParams({ bValue: val })}
              />
            </div>
          ) : (
            <div className="cockpit-slider-grid grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-0.5 bg-slate-900/70 border border-slate-800 rounded-xl p-2">
              <TouchSlider
                compact={true}
                label="Factor p (strips)"
                value={middleFactorP}
                min={1}
                max={5}
                step={1}
                onChange={(val) => updateAlgebraicTilesParams({ middleFactorP: val })}
              />
              <TouchSlider
                compact={true}
                label="Factor q (strips)"
                value={middleFactorQ}
                min={1}
                max={5}
                step={1}
                onChange={(val) => updateAlgebraicTilesParams({ middleFactorQ: val })}
              />
            </div>
          )}

          {/* Quick View Toggles */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                lightTap();
                updateAlgebraicTilesParams({ explodedView: !explodedView });
              }}
              className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                explodedView
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              <Scissors className="w-3 h-3" />
              <span>{explodedView ? 'Joined Tiles' : 'Explode Tiles'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                lightTap();
                updateAlgebraicTilesParams({ showTileAreas: !showTileAreas });
              }}
              className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                showTileAreas
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              <Eye className="w-3 h-3" />
              <span>{showTileAreas ? 'Hide Labels' : 'Area Labels'}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl bg-slate-800/70 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition border border-slate-700/60 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Dimensions (a=4, b=2)</span>
          </button>
        </div>
      )}

      {controlsSubTab === 'presets' && (
        <div className="space-y-2 animate-fade-in">
          {/* Identity Presets Scratchpad */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              <span>Class 8 Textbook Presets</span>
            </span>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              {[
                { label: '(3 + 2)² = 25', mode: 'a-plus-b-sq' as const, a: 3, b: 2 },
                { label: '(4 + 3)² = 49', mode: 'a-plus-b-sq' as const, a: 4, b: 3 },
                { label: '(5 - 2)² = 9', mode: 'a-minus-b-sq' as const, a: 5, b: 2 },
                { label: '(x+2)(x+3)', mode: 'middle-term-factor' as const, p: 2, q: 3 },
              ].map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    lightTap();
                    playClick();
                    setIsMisconceptionTrapActive(false);
                    if (preset.mode === 'middle-term-factor') {
                      updateAlgebraicTilesParams({
                        identityMode: preset.mode,
                        middleFactorP: preset.p,
                        middleFactorQ: preset.q,
                      });
                    } else {
                      updateAlgebraicTilesParams({
                        identityMode: preset.mode,
                        aValue: preset.a,
                        bValue: preset.b,
                      });
                    }
                  }}
                  className="p-2 rounded-lg bg-slate-950/70 hover:bg-slate-950 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-white font-mono text-[11px] text-left transition cursor-pointer"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Misconception Buster Trap: (a+b)^2 = a^2 + b^2 */}
          {identityMode === 'a-plus-b-sq' && (
            <div className="bg-rose-950/30 border border-rose-800/50 rounded-xl p-2.5 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                  <span>Mythbuster: Missing 2ab Void</span>
                </span>
                <span className="text-[9px] text-rose-400 font-mono font-bold bg-rose-950 px-1.5 py-0.2 rounded border border-rose-800/60">
                  #1 Fallacy
                </span>
              </div>
              <p className="text-[10px] text-slate-300 leading-tight">
                Writing (a+b)² = a² + b² forgets the two rectangular cross-terms of area 2ab!
              </p>
              <button
                type="button"
                onClick={() => {
                  lightTap();
                  if (!isMisconceptionTrapActive) {
                    playError();
                    setIsMisconceptionTrapActive(true);
                  } else {
                    playChime();
                    setIsMisconceptionTrapActive(false);
                  }
                }}
                className={`w-full py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border transition cursor-pointer ${
                  isMisconceptionTrapActive
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 animate-pulse'
                    : 'bg-rose-500/20 hover:bg-rose-500/30 border-rose-500/40 text-rose-300'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{isMisconceptionTrapActive ? 'Restore 2ab Rectangles' : 'Test Fallacy: Erase 2ab'}</span>
              </button>
            </div>
          )}

          {/* Explain Like I'm 13 Wonder Card */}
          <Eli13ExplainerCard simulatorId="algebraic-identities-tiles" defaultExpanded={false} />
        </div>
      )}
    </div>
  );

  return (
    <div className="relative w-full h-full flex flex-col flex-1 select-none overflow-hidden bg-slate-950">
      {/* Visual Tile Canvas */}
      <div className="relative flex-1 w-full min-h-0 flex flex-col items-center justify-center p-2 sm:p-4 overflow-hidden">
        {/* Real-time Math Identity Banner */}
        <div className="w-full max-w-md mb-2 p-2 sm:p-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md shadow-xl text-center">
          {identityMode === 'a-plus-b-sq' && (
            <div className="space-y-1">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                Total Square Area = Sum of 4 Sub-Regions
              </span>
              <div className="text-sm sm:text-base font-mono font-bold text-white flex items-center justify-center gap-2 flex-wrap">
                <span className="text-cyan-300">({aValue} + {bValue})² = {totalPlusSq}</span>
                <span className="text-slate-500">≡</span>
                <span className="text-sky-400">{aSquared} (a²)</span>
                <span className="text-slate-500">+</span>
                <span className="text-amber-400">2×{ab} (2ab)</span>
                <span className="text-slate-500">+</span>
                <span className="text-emerald-400">{bSquared} (b²)</span>
              </div>
            </div>
          )}

          {identityMode === 'a-minus-b-sq' && (
            <div className="space-y-1">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                Square of Difference = a² - 2ab + b²
              </span>
              <div className="text-sm sm:text-base font-mono font-bold text-white flex items-center justify-center gap-2 flex-wrap">
                <span className="text-cyan-300">({aValue} - {bValue})² = {totalMinusSq}</span>
                <span className="text-slate-500">≡</span>
                <span className="text-sky-400">{aSquared}</span>
                <span className="text-slate-500">-</span>
                <span className="text-amber-400">{2 * ab}</span>
                <span className="text-slate-500">+</span>
                <span className="text-emerald-400">{bSquared}</span>
              </div>
            </div>
          )}

          {identityMode === 'a-sq-minus-b-sq' && (
            <div className="space-y-1">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                Difference of Two Squares = (a - b)(a + b)
              </span>
              <div className="text-sm sm:text-base font-mono font-bold text-white flex items-center justify-center gap-2 flex-wrap">
                <span className="text-sky-400">{aSquared} (a²)</span>
                <span className="text-slate-500">-</span>
                <span className="text-rose-400">{bSquared} (b²)</span>
                <span className="text-slate-500">=</span>
                <span className="text-emerald-300">{diffSquares}</span>
                <span className="text-slate-500">≡</span>
                <span className="text-amber-300">({aValue} - {bValue}) × ({aValue} + {bValue}) = {aValue - bValue} × {aValue + bValue} = {diffSquares}</span>
              </div>
            </div>
          )}

          {identityMode === 'middle-term-factor' && (
            <div className="space-y-1">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                Splitting Middle Term: (x + p)(x + q)
              </span>
              <div className="text-sm sm:text-base font-mono font-bold text-white flex items-center justify-center gap-2 flex-wrap">
                <span className="text-cyan-300">(x + {middleFactorP})(x + {middleFactorQ})</span>
                <span className="text-slate-500">=</span>
                <span className="text-sky-400">x²</span>
                <span className="text-slate-500">+</span>
                <span className="text-amber-400">{middleFactorP + middleFactorQ}x</span>
                <span className="text-slate-500">+</span>
                <span className="text-emerald-400">{middleFactorP * middleFactorQ}</span>
              </div>
            </div>
          )}
        </div>

        {/* Misconception Trap Alert Banner */}
        {isMisconceptionTrapActive && (
          <div className="w-full max-w-md mb-2 p-3 rounded-2xl bg-rose-950/90 border border-rose-500 text-rose-200 text-xs flex items-center justify-between shadow-xl animate-bounce">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
              <div>
                <span className="font-bold block">⚠️ (a + b)² ≠ a² + b² FALLACY!</span>
                <span>Writing a² + b² loses both 2ab rectangles (-{2 * ab} units² missing void)!</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                successBuzz();
                playChime();
                setIsMisconceptionTrapActive(false);
              }}
              className="px-2.5 py-1 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[11px] shrink-0 ml-2 cursor-pointer"
            >
              Restore 2ab
            </button>
          </div>
        )}

        {/* Dynamic Interactive Tiles SVG */}
        <div className="w-full max-w-md h-64 sm:h-72 flex items-center justify-center">
          <svg viewBox="0 0 320 280" className="w-full h-full drop-shadow-xl overflow-visible">
            {/* Mode 1: (a + b)² */}
            {identityMode === 'a-plus-b-sq' && (
              <g transform="translate(60, 30)">
                {/* a² Square (Top-Left) */}
                <rect
                  x="0"
                  y="0"
                  width={aPx}
                  height={aPx}
                  fill="rgba(56, 189, 248, 0.25)"
                  stroke="#38bdf8"
                  strokeWidth="2"
                  rx="3"
                  className="transition-all duration-300"
                />
                {showTileAreas && (
                  <text x={aPx / 2} y={aPx / 2 + 5} fill="#38bdf8" fontSize="13" fontWeight="bold" textAnchor="middle">
                    a² = {aSquared}
                  </text>
                )}

                {/* ab Rectangle (Top-Right) */}
                <rect
                  x={aPx + explodeGap}
                  y="0"
                  width={bPx}
                  height={aPx}
                  fill={isMisconceptionTrapActive ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.25)'}
                  stroke={isMisconceptionTrapActive ? '#ef4444' : '#f59e0b'}
                  strokeWidth="2"
                  strokeDasharray={isMisconceptionTrapActive ? '4 3' : undefined}
                  rx="3"
                  className="transition-all duration-300"
                />
                {showTileAreas && (
                  <text 
                    x={aPx + explodeGap + bPx / 2} 
                    y={aPx / 2 + 5} 
                    fill={isMisconceptionTrapActive ? '#ef4444' : '#f59e0b'} 
                    fontSize={isMisconceptionTrapActive ? '9' : '11'} 
                    fontWeight="bold" 
                    textAnchor="middle"
                  >
                    {isMisconceptionTrapActive ? 'MISSING ab!' : `ab = ${ab}`}
                  </text>
                )}

                {/* ab Rectangle (Bottom-Left) */}
                <rect
                  x="0"
                  y={aPx + explodeGap}
                  width={aPx}
                  height={bPx}
                  fill={isMisconceptionTrapActive ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.25)'}
                  stroke={isMisconceptionTrapActive ? '#ef4444' : '#f59e0b'}
                  strokeWidth="2"
                  strokeDasharray={isMisconceptionTrapActive ? '4 3' : undefined}
                  rx="3"
                  className="transition-all duration-300"
                />
                {showTileAreas && (
                  <text 
                    x={aPx / 2} 
                    y={aPx + explodeGap + bPx / 2 + 4} 
                    fill={isMisconceptionTrapActive ? '#ef4444' : '#f59e0b'} 
                    fontSize={isMisconceptionTrapActive ? '9' : '11'} 
                    fontWeight="bold" 
                    textAnchor="middle"
                  >
                    {isMisconceptionTrapActive ? 'MISSING ab!' : `ab = ${ab}`}
                  </text>
                )}

                {/* b² Square (Bottom-Right) */}
                <rect
                  x={aPx + explodeGap}
                  y={aPx + explodeGap}
                  width={bPx}
                  height={bPx}
                  fill="rgba(16, 185, 129, 0.25)"
                  stroke="#10b981"
                  strokeWidth="2"
                  rx="3"
                  className="transition-all duration-300"
                />
                {showTileAreas && (
                  <text x={aPx + explodeGap + bPx / 2} y={aPx + explodeGap + bPx / 2 + 4} fill="#10b981" fontSize="11" fontWeight="bold" textAnchor="middle">
                    b² = {bSquared}
                  </text>
                )}

                {/* Dimension Rulers */}
                <text x={aPx / 2} y="-8" fill="#94a3b8" fontSize="10" textAnchor="middle" fontFamily="monospace">a = {aValue}</text>
                <text x={aPx + explodeGap + bPx / 2} y="-8" fill="#94a3b8" fontSize="10" textAnchor="middle" fontFamily="monospace">b = {bValue}</text>
                <text x="-12" y={aPx / 2} fill="#94a3b8" fontSize="10" textAnchor="middle" fontFamily="monospace">a</text>
                <text x="-12" y={aPx + explodeGap + bPx / 2} fill="#94a3b8" fontSize="10" textAnchor="middle" fontFamily="monospace">b</text>
              </g>
            )}

            {/* Mode 2: (a - b)² */}
            {identityMode === 'a-minus-b-sq' && (
              <g transform="translate(60, 30)">
                {/* Full Outer Square a² */}
                <rect x="0" y="0" width={aPx} height={aPx} fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="3 3" />

                {/* Inner (a - b)² square */}
                <rect
                  x="0"
                  y="0"
                  width={aPx - bPx}
                  height={aPx - bPx}
                  fill="rgba(56, 189, 248, 0.3)"
                  stroke="#38bdf8"
                  strokeWidth="2"
                  rx="3"
                />
                <text x={(aPx - bPx) / 2} y={(aPx - bPx) / 2 + 5} fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">
                  (a - b)² = {totalMinusSq}
                </text>

                {/* Cutout Strip Top Right: (a - b) × b */}
                <rect
                  x={aPx - bPx}
                  y="0"
                  width={bPx}
                  height={aPx - bPx}
                  fill="rgba(239, 68, 68, 0.15)"
                  stroke="#ef4444"
                  strokeWidth="1.5"
                  strokeDasharray="2 2"
                />
                <text x={aPx - bPx / 2} y={(aPx - bPx) / 2 + 4} fill="#f87171" fontSize="9" textAnchor="middle">Cut</text>

                {/* Cutout Strip Bottom Left: a × b */}
                <rect
                  x="0"
                  y={aPx - bPx}
                  width={aPx}
                  height={bPx}
                  fill="rgba(239, 68, 68, 0.15)"
                  stroke="#ef4444"
                  strokeWidth="1.5"
                  strokeDasharray="2 2"
                />
                <text x={aPx / 2} y={aPx - bPx / 2 + 4} fill="#f87171" fontSize="9" textAnchor="middle">Cut</text>

                {/* Overlapped Double-Subtracted Corner b² that is added back */}
                <rect
                  x={aPx - bPx}
                  y={aPx - bPx}
                  width={bPx}
                  height={bPx}
                  fill="rgba(16, 185, 129, 0.4)"
                  stroke="#10b981"
                  strokeWidth="2"
                  rx="2"
                />
                <text x={aPx - bPx / 2} y={aPx - bPx / 2 + 4} fill="#10b981" fontSize="9" fontWeight="bold" textAnchor="middle">
                  +b²
                </text>
              </g>
            )}

            {/* Mode 3: a² - b² */}
            {identityMode === 'a-sq-minus-b-sq' && (
              <g transform="translate(60, 30)">
                {/* L-Tromino: (a - b) × a rectangle and b × (a - b) rectangle */}
                {/* Top Rectangle: (a - b) × a */}
                <rect
                  x="0"
                  y="0"
                  width={aPx}
                  height={aPx - bPx}
                  fill="rgba(56, 189, 248, 0.25)"
                  stroke="#38bdf8"
                  strokeWidth="2"
                  rx="2"
                />
                <text x={aPx / 2} y={(aPx - bPx) / 2 + 4} fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">
                  a(a - b) = {aValue * (aValue - bValue)}
                </text>

                {/* Bottom-Left Rectangle: (a - b) × b */}
                <rect
                  x="0"
                  y={aPx - bPx}
                  width={aPx - bPx}
                  height={bPx}
                  fill="rgba(245, 158, 11, 0.25)"
                  stroke="#f59e0b"
                  strokeWidth="2"
                  rx="2"
                />
                <text x={(aPx - bPx) / 2} y={aPx - bPx / 2 + 4} fill="#f59e0b" fontSize="10" fontWeight="bold" textAnchor="middle">
                  b(a - b) = {bValue * (aValue - bValue)}
                </text>

                {/* Cutout Corner: b² */}
                <rect
                  x={aPx - bPx}
                  y={aPx - bPx}
                  width={bPx}
                  height={bPx}
                  fill="rgba(239, 68, 68, 0.15)"
                  stroke="#ef4444"
                  strokeWidth="2"
                  strokeDasharray="3 3"
                />
                <text x={aPx - bPx / 2} y={aPx - bPx / 2 + 4} fill="#f87171" fontSize="10" fontWeight="bold" textAnchor="middle">
                  -b²
                </text>
              </g>
            )}

            {/* Mode 4: Middle Term Factoring (x+p)(x+q) */}
            {identityMode === 'middle-term-factor' && (
              <g transform="translate(60, 30)">
                {/* x² tile */}
                <rect x="0" y="0" width={110} height={110} fill="rgba(56, 189, 248, 0.25)" stroke="#38bdf8" strokeWidth="2" rx="3" />
                <text x="55" y="60" fill="#38bdf8" fontSize="13" fontWeight="bold" textAnchor="middle">x²</text>

                {/* q strips on top right */}
                <rect x={110 + explodeGap} y="0" width={middleFactorQ * 18} height={110} fill="rgba(245, 158, 11, 0.25)" stroke="#f59e0b" strokeWidth="2" rx="3" />
                <text x={110 + explodeGap + (middleFactorQ * 18) / 2} y="60" fill="#f59e0b" fontSize="11" fontWeight="bold" textAnchor="middle">
                  {middleFactorQ}x
                </text>

                {/* p strips on bottom left */}
                <rect x="0" y={110 + explodeGap} width={110} height={middleFactorP * 18} fill="rgba(245, 158, 11, 0.25)" stroke="#f59e0b" strokeWidth="2" rx="3" />
                <text x="55" y={110 + explodeGap + (middleFactorP * 18) / 2 + 4} fill="#f59e0b" fontSize="11" fontWeight="bold" textAnchor="middle">
                  {middleFactorP}x
                </text>

                {/* pq unit squares corner */}
                <rect
                  x={110 + explodeGap}
                  y={110 + explodeGap}
                  width={middleFactorQ * 18}
                  height={middleFactorP * 18}
                  fill="rgba(16, 185, 129, 0.25)"
                  stroke="#10b981"
                  strokeWidth="2"
                  rx="3"
                />
                <text
                  x={110 + explodeGap + (middleFactorQ * 18) / 2}
                  y={110 + explodeGap + (middleFactorP * 18) / 2 + 4}
                  fill="#10b981"
                  fontSize="11"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {middleFactorP * middleFactorQ}
                </text>
              </g>
            )}
          </svg>
        </div>

        {/* Intuition Footer Pill */}
        <div className="mt-2 text-center text-xs font-mono text-slate-400">
          The 2ab middle term comes from the two matching golden rectangles!
        </div>
      </div>

      <BottomSheet
        title="Algebraic Identities Tiles"
        onReset={handleReset}
        theoryContent={<CoachTheoryModule simulatorId="algebraic-identities-tiles" />}
        challengeContent={
          <ChallengeManager
            simulatorId="algebraic-identities-tiles"
            simulatorTitle="Algebraic Identities Tiles"
            levels={challengeLevels}
          />
        }
      >
        {controlsContent}
      </BottomSheet>
    </div>
  );
};
