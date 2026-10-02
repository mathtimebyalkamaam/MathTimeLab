/**
 * SquareRootsTripletsSimulator.tsx: Squares, Square Roots & Triplet Forge Lab (Class 8 Algebra).
 * Features:
 * - Dynamic Tile-Packing Arena: Pack N unit squares into an m×m grid, revealing perfect squares vs leftover remainders
 * - Pythagorean Triplet Forge: Slide integer m ≥ 2 to generate (2m, m²-1, m²+1) with right-angle triangle proofs
 * - Odd Number Accumulator: 1 + 3 + 5 + ... = n²
 * - 3 Progressive Board Exam challenges
 */
import React, { useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  Target, 
  RotateCcw, 
  CheckCircle2, 
  Sparkles, 
  Sliders, 
  Layers, 
  Grid, 
  Hammer 
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

export const SquareRootsTripletsSimulator: React.FC = () => {
  const {
    squareRootsParams,
    updateSquareRootsParams,
    resetParams,
    completeChallenge,
    challengeCompleted,
    isZenMode,
  } = useSimulatorStore();

  const {
    mode,
    numberN,
    tripletM,
    showRemainingTiles,
    showRightTriangleProof,
  } = squareRootsParams;

  const { lightTap, successBuzz } = useHaptics();
  const { playClick, playChime } = useSound();
  const { trackEvent } = useAnalytics();

  // Mode 1: Square packing calculations
  const floorRoot = Math.floor(Math.sqrt(numberN));
  const packedCount = floorRoot * floorRoot;
  const remainder = numberN - packedCount;
  const isPerfectSquare = remainder === 0;

  // Mode 2: Pythagorean Triplet calculations (2m, m²-1, m²+1)
  const leg1 = 2 * tripletM;
  const leg2 = tripletM * tripletM - 1;
  const hypotenuse = tripletM * tripletM + 1;
  const sumOfLegSquares = leg1 * leg1 + leg2 * leg2;
  const hypSquare = hypotenuse * hypotenuse;
  const isPythagoreanValid = sumOfLegSquares === hypSquare;

  const handleReset = () => {
    lightTap();
    playClick();
    resetParams('square-roots-triplets');
  };

  // Challenges for Board Exam mastery
  const challengeLevels: ChallengeLevel[] = [
    {
      levelNumber: 1,
      title: 'Perfect 5×5 Square: N = 25',
      badge: 'Tile Packer',
      description: 'Slide N to 25. Pack 25 unit tiles into a solid 5×5 square with 0 leftover remainder tiles!',
      requirementFormula: '5^2 = 25, \\quad \\text{Remainder} = 0',
      targetCriteria: 'Set N = 25 in Tile Packing mode',
      xpReward: 30,
      tier1Hint: 'Select Tile Packing mode.',
      tier2Hint: 'Drag the slider N to 25.',
      tier3Hint: 'Watch all 25 tiles form a seamless 5×5 green grid with zero leftover tiles!',
      autoPreset: () => {
        updateSquareRootsParams({ mode: 'tile-packing', numberN: 25 });
      },
    },
    {
      levelNumber: 2,
      title: 'The 6-8-10 Triplet: m = 3',
      badge: 'Triplet Blacksmith',
      description: 'Switch to Triplet Forge. Set m = 3 to generate the famous 6, 8, 10 Pythagorean triplet!',
      requirementFormula: '2(3) = 6, \\quad 3^2 - 1 = 8, \\quad 3^2 + 1 = 10',
      targetCriteria: 'Set m = 3 in Triplet Forge mode',
      xpReward: 40,
      tier1Hint: 'Select Pythagorean Triplet Forge mode.',
      tier2Hint: 'Adjust integer slider m to 3.',
      tier3Hint: 'Check: 6² + 8² = 36 + 64 = 100 = 10²!',
      autoPreset: () => {
        updateSquareRootsParams({ mode: 'pythagorean-triplet-forge', tripletM: 3 });
      },
    },
    {
      levelNumber: 3,
      title: 'CBSE 3-Mark Classic: Member 14 (m = 7)',
      badge: 'Pythagorean Grandmaster',
      description: 'Find the triplet with member 14 (2m = 14 ⟹ m = 7). Watch (14, 48, 50) forge into existence!',
      requirementFormula: '14^2 + 48^2 = 196 + 2304 = 2500 = 50^2',
      targetCriteria: 'Set m = 7 in Triplet Forge mode',
      xpReward: 50,
      tier1Hint: 'Set integer m to 7 in Triplet Forge.',
      tier2Hint: '2(7) = 14, 7² - 1 = 48, 7² + 1 = 50.',
      tier3Hint: 'Verify 14² + 48² = 2500 = 50²!',
      autoPreset: () => {
        updateSquareRootsParams({ mode: 'pythagorean-triplet-forge', tripletM: 7 });
      },
    },
  ];

  // Auto verify challenges
  React.useEffect(() => {
    if (mode === 'tile-packing' && numberN === 25) {
      if (!challengeCompleted['square-roots-triplets-1']) {
        successBuzz();
        playChime();
        confetti({ particleCount: 35, spread: 60, origin: { y: 0.6 } });
        completeChallenge('square-roots-triplets-1', 30);
      }
    }
    if (mode === 'pythagorean-triplet-forge' && tripletM === 3) {
      if (!challengeCompleted['square-roots-triplets-2']) {
        successBuzz();
        playChime();
        confetti({ particleCount: 40, spread: 65, origin: { y: 0.6 } });
        completeChallenge('square-roots-triplets-2', 40);
      }
    }
    if (mode === 'pythagorean-triplet-forge' && tripletM === 7) {
      if (!challengeCompleted['square-roots-triplets-3']) {
        successBuzz();
        playChime();
        confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
        completeChallenge('square-roots-triplets-3', 50);
      }
    }
  }, [mode, numberN, tripletM, challengeCompleted, completeChallenge, playChime, successBuzz]);

  const controlsContent = (
    <div className="space-y-4 p-4 text-slate-200">
      {/* Mode Selector */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Module Operation Mode
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => {
              lightTap();
              playClick();
              updateSquareRootsParams({ mode: 'tile-packing' });
              trackEvent('square_roots_mode', { mode: 'tile-packing' });
            }}
            className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
              mode === 'tile-packing'
                ? 'bg-teal-500/20 border-teal-400 text-teal-200 shadow-sm'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <div className="text-xs font-bold flex items-center gap-1.5">
              <Grid className="w-3.5 h-3.5 text-teal-400" />
              <span>Tile Packing Arena</span>
            </div>
            <div className="text-[10px] font-mono text-slate-400 mt-0.5">m² Packing & Remainder</div>
          </button>

          <button
            type="button"
            onClick={() => {
              lightTap();
              playClick();
              updateSquareRootsParams({ mode: 'pythagorean-triplet-forge' });
              trackEvent('square_roots_mode', { mode: 'triplet-forge' });
            }}
            className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
              mode === 'pythagorean-triplet-forge'
                ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-sm'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <div className="text-xs font-bold flex items-center gap-1.5">
              <Hammer className="w-3.5 h-3.5 text-amber-400" />
              <span>Pythagorean Triplet Forge</span>
            </div>
            <div className="text-[10px] font-mono text-slate-400 mt-0.5">(2m, m²-1, m²+1)</div>
          </button>
        </div>
      </div>

      {/* Sliders */}
      {mode === 'tile-packing' ? (
        <div className="space-y-3 bg-slate-900/70 border border-slate-800 rounded-2xl p-3.5">
          <TouchSlider
            label="Total Unit Tiles N"
            value={numberN}
            min={1}
            max={64}
            step={1}
            onChange={(val) => updateSquareRootsParams({ numberN: val })}
          />
        </div>
      ) : (
        <div className="space-y-3 bg-slate-900/70 border border-slate-800 rounded-2xl p-3.5">
          <TouchSlider
            label="Integer Generator m (m ≥ 2)"
            value={tripletM}
            min={2}
            max={10}
            step={1}
            onChange={(val) => updateSquareRootsParams({ tripletM: val })}
          />
        </div>
      )}

      {/* Explain Like I'm 13 Card */}
      <Eli13ExplainerCard simulatorId="square-roots-triplets" />

      <button
        type="button"
        onClick={handleReset}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/70 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition border border-slate-700/60 cursor-pointer"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Reset to Default (N=25 / m=3)</span>
      </button>
    </div>
  );

  return (
    <div className="relative w-full h-full flex flex-col flex-1 select-none overflow-hidden bg-slate-950">
      {/* Interactive Visual Arena Canvas */}
      <div className="relative flex-1 w-full min-h-[360px] flex flex-col items-center justify-center p-3 sm:p-6 overflow-hidden">
        {/* Math HUD Banner */}
        <div className="w-full max-w-lg mb-2 p-3 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md shadow-xl text-center">
          {mode === 'tile-packing' ? (
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-teal-400 uppercase tracking-wider block">
                Square Root Decomposition: N = m² + Remainder
              </span>
              <div className="text-base sm:text-xl font-mono font-bold text-white flex items-center justify-center gap-2">
                <span>{numberN} Tiles =</span>
                <span className="text-teal-300">{floorRoot}² ({packedCount})</span>
                {remainder > 0 ? (
                  <>
                    <span className="text-slate-500">+</span>
                    <span className="text-amber-400">{remainder} Remainder</span>
                  </>
                ) : (
                  <span className="text-emerald-400 text-xs font-bold uppercase ml-1 px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40">
                    Perfect Square!
                  </span>
                )}
              </div>
              <span className="text-[10px] text-slate-400 font-mono block">
                √{numberN} ≈ {Math.sqrt(numberN).toFixed(2)} (Largest packed square is {floorRoot}×{floorRoot})
              </span>
            </div>
          ) : (
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block">
                Pythagorean Triplet: (2m, m² - 1, m² + 1)
              </span>
              <div className="text-base sm:text-xl font-mono font-bold text-white flex items-center justify-center gap-3">
                <span className="text-sky-400">2m = {leg1}</span>
                <span className="text-amber-300">m²-1 = {leg2}</span>
                <span className="text-emerald-400">m²+1 = {hypotenuse}</span>
              </div>
              <span className="text-[10px] text-slate-300 font-mono block">
                {leg1}² + {leg2}² = {leg1 * leg1} + {leg2 * leg2} = {hypSquare} = {hypotenuse}² (Valid Right Triangle!)
              </span>
            </div>
          )}
        </div>

        {/* Dynamic SVG Visuals */}
        <div className="w-full max-w-md h-64 sm:h-72 flex items-center justify-center">
          {mode === 'tile-packing' ? (
            <svg viewBox="0 0 280 260" className="w-full h-full drop-shadow-xl overflow-visible">
              {/* Packed Grid */}
              <g transform="translate(40, 20)">
                {Array.from({ length: floorRoot }).map((_, r) =>
                  Array.from({ length: floorRoot }).map((_, c) => (
                    <rect
                      key={`grid-${r}-${c}`}
                      x={c * 22}
                      y={r * 22}
                      width="19"
                      height="19"
                      fill="#0d9488"
                      stroke="#14b8a6"
                      strokeWidth="1.5"
                      rx="3"
                    />
                  ))
                )}

                {/* Leftover Remainder Tiles */}
                {Array.from({ length: remainder }).map((_, i) => (
                  <rect
                    key={`rem-${i}`}
                    x={floorRoot * 22 + 10}
                    y={i * 22}
                    width="19"
                    height="19"
                    fill="#f59e0b"
                    stroke="#fbbf24"
                    strokeWidth="1.5"
                    rx="3"
                    className="animate-pulse"
                  />
                ))}

                {/* Labels */}
                <text x={(floorRoot * 22) / 2} y="-8" fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="middle">
                  {floorRoot} units
                </text>
                <text x="-12" y={(floorRoot * 22) / 2} fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="middle">
                  {floorRoot}
                </text>
                {remainder > 0 && (
                  <text x={floorRoot * 22 + 20} y="-8" fill="#fbbf24" fontSize="9" fontFamily="monospace" textAnchor="middle">
                    +{remainder} Rem
                  </text>
                )}
              </g>
            </svg>
          ) : (
            // Pythagorean Right Triangle
            <svg viewBox="0 0 320 260" className="w-full h-full drop-shadow-2xl overflow-visible">
              <g transform="translate(60, 40)">
                {/* Right Triangle */}
                <polygon
                  points="0,160 180,160 180,30"
                  fill="rgba(245, 158, 11, 0.15)"
                  stroke="#f59e0b"
                  strokeWidth="2.5"
                />

                {/* Right Angle Box */}
                <polyline points="165,160 165,145 180,145" stroke="#94a3b8" strokeWidth="1.5" fill="none" />

                {/* Side Labels */}
                <text x="90" y="180" fill="#38bdf8" fontSize="12" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                  Leg 1: 2m = {leg1}
                </text>
                <text x="210" y="100" fill="#f59e0b" fontSize="12" fontWeight="bold" fontFamily="monospace">
                  Leg 2: m²-1 = {leg2}
                </text>
                <text x="75" y="85" fill="#10b981" fontSize="12" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                  Hyp: m²+1 = {hypotenuse}
                </text>
              </g>
            </svg>
          )}
        </div>

        {/* Intuition Footer Pill */}
        <div className="mt-2 text-center text-xs font-mono text-slate-400">
          {mode === 'tile-packing' 
            ? 'Perfect squares leave 0 remainder tiles when arranged in a grid'
            : 'For any integer m > 1: (2m)² + (m²-1)² = (m²+1)² creates integer right triangles'}
        </div>
      </div>

      <BottomSheet
        title="Square Roots & Triplet Forge"
        onReset={handleReset}
        theoryContent={<CoachTheoryModule simulatorId="square-roots-triplets" />}
        challengeContent={
          <ChallengeManager
            simulatorId="square-roots-triplets"
            simulatorTitle="Square Roots & Triplet Forge"
            levels={challengeLevels}
          />
        }
      >
        {controlsContent}
      </BottomSheet>
    </div>
  );
};
