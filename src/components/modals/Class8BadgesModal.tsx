/**
 * Class8BadgesModal.tsx: Class 8 Mastery Passport & Badge Showcase.
 * 8 Collectible badges corresponding to Class 8 math breakthroughs:
 * 1. Golden Fulcrum (Linear Equations)
 * 2. Silicon Architect (Algebraic Identities)
 * 3. Warren Buffett Jr. (Compound Interest)
 * 4. Polygon Shapeshifter (Quadrilaterals)
 * 5. Euler Dimensioner (3D Solids)
 * 6. Proportion Pilot (Direct & Inverse)
 * 7. Data Storyteller (Pie Charts)
 * 8. Pythagorean Blackbelt (Triplets & Squares)
 */
import React from 'react';
import { 
  X, 
  Award, 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  Zap, 
  Trophy, 
  ArrowRight
} from 'lucide-react';
import { useSimulatorStore } from '../../store/useSimulatorStore';
import { useSound } from '../common/SoundManager';
import { useHaptics } from '../../hooks/useHaptics';
import confetti from 'canvas-confetti';

interface BadgeDefinition {
  id: string;
  name: string;
  emoji: string;
  topic: string;
  criteria: string;
  rewardXp: number;
  simId: string;
}

const BADGES: BadgeDefinition[] = [
  {
    id: 'badge_scale_master',
    name: 'Golden Fulcrum',
    emoji: '⚖️',
    topic: 'Linear Equations',
    criteria: 'Balance a two-pan scale and isolate mystery box x using equal operations on both sides.',
    rewardXp: 50,
    simId: 'balance-scale-equations',
  },
  {
    id: 'badge_tiles_architect',
    name: 'Silicon Architect',
    emoji: '🧱',
    topic: 'Algebraic Identities',
    criteria: 'Build geometric square tiles and verify (a+b)² = a² + 2ab + b².',
    rewardXp: 50,
    simId: 'algebraic-identities-tiles',
  },
  {
    id: 'badge_ci_tycoon',
    name: 'Warren Buffett Jr.',
    emoji: '💰',
    topic: 'Compound Interest',
    criteria: 'Test quarterly vs annual compounding and witness exponential growth defeat simple interest.',
    rewardXp: 50,
    simId: 'compound-interest-engine',
  },
  {
    id: 'badge_quad_morph',
    name: 'Polygon Shapeshifter',
    emoji: '🔷',
    topic: 'Quadrilaterals',
    criteria: 'Morph vertices into a rhombus, rectangle, and parallelogram, proving diagonal bisect rules.',
    rewardXp: 50,
    simId: 'quadrilateral-morpher',
  },
  {
    id: 'badge_euler_3d',
    name: 'Euler Dimensioner',
    emoji: '🎲',
    topic: 'Visualising 3D Solids',
    criteria: 'Inspect 3D solids and verify Euler\'s formula F + V - E = 2.',
    rewardXp: 50,
    simId: 'euler-polyhedra-3d',
  },
  {
    id: 'badge_proportion_pilot',
    name: 'Proportion Pilot',
    emoji: '⚡',
    topic: 'Direct & Inverse Proportions',
    criteria: 'Toggle between constant quotient (y/x=k) and constant product (xy=k).',
    rewardXp: 50,
    simId: 'direct-inverse-proportions',
  },
  {
    id: 'badge_pie_storyteller',
    name: 'Data Storyteller',
    emoji: '🥧',
    topic: 'Data Handling',
    criteria: 'Convert category percentage values into central circular angles summing to 360°.',
    rewardXp: 50,
    simId: 'dynamic-pie-chart',
  },
  {
    id: 'badge_pythagoras_blackbelt',
    name: 'Pythagorean Blackbelt',
    emoji: '📐',
    topic: 'Square Roots & Triplets',
    criteria: 'Forge right triangles using the triplet generator (2m, m²-1, m²+1).',
    rewardXp: 50,
    simId: 'square-roots-triplets',
  },
  {
    id: 'badge_cosmic_index_master',
    name: 'Cosmic Index Master',
    emoji: '⚡',
    topic: 'Exponents and Powers',
    criteria: 'Master the laws of indices and explore cosmic scales from 10⁻¹⁵ to 10²¹.',
    rewardXp: 50,
    simId: 'exponents-powers-lab',
  },
  {
    id: 'badge_infinite_density_pioneer',
    name: 'Infinite Density Pioneer',
    emoji: '🔬',
    topic: 'Rational Numbers',
    criteria: 'Zoom into the continuous number line and unlock intermediate rational fractions.',
    rewardXp: 50,
    simId: 'rational-numbers-density',
  },
];

export const Class8BadgesModal: React.FC = () => {
  const { 
    isClass8BadgesOpen, 
    setClass8BadgesOpen, 
    unlockedBadges, 
    unlockBadge, 
    navigateTo,
    completedSimulators
  } = useSimulatorStore();

  const { playClick, playChime } = useSound();
  const { lightTap, successBuzz } = useHaptics();

  if (!isClass8BadgesOpen) return null;

  const handleClaimBadge = (badge: BadgeDefinition) => {
    successBuzz();
    playChime();
    unlockBadge(badge.name);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  const handleGoToSimulator = (simId: string) => {
    lightTap();
    playClick();
    setClass8BadgesOpen(false);
    navigateTo(simId as any);
  };

  const totalUnlocked = BADGES.filter(
    (b) => unlockedBadges.includes(b.name) || completedSimulators.includes(b.simId as any)
  ).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 overflow-y-auto">
      <div 
        className="w-full max-w-3xl bg-slate-900 border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-900 border-b border-amber-500/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
              <Trophy className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/60">
                  Mastery Passport
                </span>
                <span className="text-xs text-slate-400">Class 8 Badge Collection</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white mt-0.5">
                Earned Badges: {totalUnlocked} of {BADGES.length}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              lightTap();
              setClass8BadgesOpen(false);
            }}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Badges Grid */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {BADGES.map((badge) => {
            const isUnlocked = unlockedBadges.includes(badge.name) || completedSimulators.includes(badge.simId as any);

            return (
              <div
                key={badge.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                  isUnlocked
                    ? 'bg-gradient-to-br from-amber-950/30 via-slate-900 to-slate-900 border-amber-500/50 shadow-md'
                    : 'bg-slate-950/60 border-slate-800 opacity-80'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{badge.emoji}</span>
                    <span className="text-[11px] font-semibold text-amber-400 font-mono">
                      +{badge.rewardXp} XP
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                      <span>{badge.name}</span>
                      {isUnlocked && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    </h3>
                    <span className="text-[10px] text-cyan-400 font-semibold block mt-0.5">
                      {badge.topic}
                    </span>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {badge.criteria}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  {isUnlocked ? (
                    <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      Badge Unlocked!
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleClaimBadge(badge)}
                      className="px-3 py-1 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Claim Badge</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleGoToSimulator(badge.simId)}
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <span>Open Module</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-400">
            Complete simulator missions to unlock all 8 Class 8 badges!
          </div>

          <button
            type="button"
            onClick={() => setClass8BadgesOpen(false)}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
