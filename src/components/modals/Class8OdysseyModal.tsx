/**
 * Class8OdysseyModal.tsx: Class 8 Math Odyssey Hub.
 * A dedicated, gamified journey map for Class 8 students.
 * Mapped directly to CBSE / NCERT / ICSE Class 8 syllabus:
 * 1. Linear Equations (Balance Scale)
 * 2. Algebraic Identities (Algebra Tiles)
 * 3. Comparing Quantities (Compound Interest)
 * 4. Understanding Quadrilaterals (Quadrilateral Morpher)
 * 5. Visualising Solid Shapes (Euler Polyhedra 3D)
 * 6. Direct & Inverse Proportions (Proportion Lab)
 * 7. Data Handling (Dynamic Pie Chart)
 * 8. Squares & Square Roots (Square Roots & Triplets)
 */
import React, { useState } from 'react';
import { 
  X, 
  GraduationCap, 
  Sparkles, 
  Trophy, 
  CheckCircle2, 
  Play, 
  Zap, 
  Award, 
  BookOpen, 
  ArrowRight,
  Flame,
  HelpCircle,
  Clock,
  Compass,
  Scale,
  Layers,
  TrendingUp,
  Boxes,
  Activity,
  PieChart,
  Target,
  LucideIcon
} from 'lucide-react';
import { useSimulatorStore } from '../../store/useSimulatorStore';
import { SimulatorId } from '../../types/simulators';
import { SIMULATORS } from '../../data/simulators';
import { useSound } from '../common/SoundManager';
import { useHaptics } from '../../hooks/useHaptics';
import confetti from 'canvas-confetti';

interface Class8UnitInfo {
  id: SimulatorId;
  unitNumber: number;
  chapterName: string;
  badgeName: string;
  badgeEmoji: string;
  icon: LucideIcon;
  colorScheme: {
    bg: string;
    border: string;
    text: string;
    accent: string;
  };
  whyItMatters: string;
}

const CLASS_8_UNITS: Class8UnitInfo[] = [
  {
    id: 'balance-scale-equations',
    unitNumber: 1,
    chapterName: 'Linear Equations in One Variable',
    badgeName: 'Golden Fulcrum',
    badgeEmoji: '⚖️',
    icon: Scale,
    colorScheme: {
      bg: 'from-amber-950/40 to-slate-900',
      border: 'border-amber-500/40',
      text: 'text-amber-400',
      accent: 'bg-amber-500',
    },
    whyItMatters: 'Used by rocket propulsion engineers to balance spacecraft payload & fuel distribution.',
  },
  {
    id: 'algebraic-identities-tiles',
    unitNumber: 2,
    chapterName: 'Algebraic Expressions & Identities',
    badgeName: 'Silicon Architect',
    badgeEmoji: '🧱',
    icon: Layers,
    colorScheme: {
      bg: 'from-cyan-950/40 to-slate-900',
      border: 'border-cyan-500/40',
      text: 'text-cyan-400',
      accent: 'bg-cyan-500',
    },
    whyItMatters: 'Microchip architects use (a+b)² area partitioning to pack 100 billion transistors on silicon.',
  },
  {
    id: 'compound-interest-engine',
    unitNumber: 3,
    chapterName: 'Comparing Quantities: Compound Interest',
    badgeName: 'Warren Buffett Jr.',
    badgeEmoji: '💰',
    icon: TrendingUp,
    colorScheme: {
      bg: 'from-emerald-950/40 to-slate-900',
      border: 'border-emerald-500/40',
      text: 'text-emerald-400',
      accent: 'bg-emerald-500',
    },
    whyItMatters: 'The 8th Wonder of the World: How smart investing turns ₹10,000 into ₹1,00,000 exponentially.',
  },
  {
    id: 'quadrilateral-morpher',
    unitNumber: 4,
    chapterName: 'Understanding Quadrilaterals',
    badgeName: 'Polygon Shapeshifter',
    badgeEmoji: '🔷',
    icon: Compass,
    colorScheme: {
      bg: 'from-indigo-950/40 to-slate-900',
      border: 'border-indigo-500/40',
      text: 'text-indigo-400',
      accent: 'bg-indigo-500',
    },
    whyItMatters: 'Civil engineers use quadrilateral diagonal bracing so bridges don\'t collapse during earthquakes.',
  },
  {
    id: 'euler-polyhedra-3d',
    unitNumber: 5,
    chapterName: 'Visualising Solid Shapes: Euler\'s Formula',
    badgeName: 'Euler Dimensioner',
    badgeEmoji: '🎲',
    icon: Boxes,
    colorScheme: {
      bg: 'from-purple-950/40 to-slate-900',
      border: 'border-purple-500/40',
      text: 'text-purple-400',
      accent: 'bg-purple-500',
    },
    whyItMatters: 'Powers 3D video game polygonal graphics engines and explains the 12 pentagons on soccer balls.',
  },
  {
    id: 'direct-inverse-proportions',
    unitNumber: 6,
    chapterName: 'Direct & Inverse Proportions',
    badgeName: 'Proportion Pilot',
    badgeEmoji: '⚡',
    icon: Activity,
    colorScheme: {
      bg: 'from-sky-950/40 to-slate-900',
      border: 'border-sky-500/40',
      text: 'text-sky-400',
      accent: 'bg-sky-500',
    },
    whyItMatters: 'Formula 1 pitstop strategy and calculating orbital transit times to the Moon and Mars.',
  },
  {
    id: 'dynamic-pie-chart',
    unitNumber: 7,
    chapterName: 'Data Handling: Dynamic Pie Charts',
    badgeName: 'Data Storyteller',
    badgeEmoji: '🥧',
    icon: PieChart,
    colorScheme: {
      bg: 'from-pink-950/40 to-slate-900',
      border: 'border-pink-500/40',
      text: 'text-pink-400',
      accent: 'bg-pink-500',
    },
    whyItMatters: 'Used in IPL cricket analytics, smartphone battery monitors, and nation budgeting.',
  },
  {
    id: 'square-roots-triplets',
    unitNumber: 8,
    chapterName: 'Squares, Square Roots & Triplets',
    badgeName: 'Pythagorean Blackbelt',
    badgeEmoji: '📐',
    icon: Target,
    colorScheme: {
      bg: 'from-teal-950/40 to-slate-900',
      border: 'border-teal-500/40',
      text: 'text-teal-400',
      accent: 'bg-teal-500',
    },
    whyItMatters: 'Ancient Egyptian pyramid builders used 3-4-5 knotted ropes to set perfect 90° right angles.',
  },
  {
    id: 'exponents-powers-lab',
    unitNumber: 9,
    chapterName: 'Exponents and Powers',
    badgeName: 'Cosmic Index Master',
    badgeEmoji: '⚡',
    icon: Zap,
    colorScheme: {
      bg: 'from-amber-950/40 to-slate-900',
      border: 'border-amber-500/40',
      text: 'text-amber-400',
      accent: 'bg-amber-500',
    },
    whyItMatters: 'Astronomers use scientific notation 10²¹ m to map galaxies and chemists use 10⁻¹⁰ m for atoms.',
  },
  {
    id: 'rational-numbers-density',
    unitNumber: 10,
    chapterName: 'Rational Numbers & Infinite Density',
    badgeName: 'Infinite Density Pioneer',
    badgeEmoji: '🔬',
    icon: Compass,
    colorScheme: {
      bg: 'from-cyan-950/40 to-slate-900',
      border: 'border-cyan-500/40',
      text: 'text-cyan-400',
      accent: 'bg-cyan-500',
    },
    whyItMatters: 'Digital audio sampling splits sound waves into thousands of rational fractions per millisecond.',
  },
];

export const Class8OdysseyModal: React.FC = () => {
  const { 
    isClass8OdysseyOpen, 
    setClass8OdysseyOpen, 
    completedSimulators, 
    navigateTo,
    unlockedBadges,
    unlockBadge,
    addXp,
    setSecretShortcutsOpen,
    openConceptQuizModal
  } = useSimulatorStore();

  const { playClick, playChime } = useSound();
  const { lightTap, successBuzz } = useHaptics();

  const [activeCategory, setActiveCategory] = useState<'all' | 'algebra' | 'geometry' | 'arithmetic'>('all');

  if (!isClass8OdysseyOpen) return null;

  const class8SimIds = CLASS_8_UNITS.map((u) => u.id);
  const completedClass8Count = class8SimIds.filter((id) => completedSimulators.includes(id)).length;
  const progressPct = Math.round((completedClass8Count / CLASS_8_UNITS.length) * 100);
  const isAllMastered = completedClass8Count === CLASS_8_UNITS.length;

  const handleLaunch = (simId: SimulatorId) => {
    lightTap();
    playClick();
    setClass8OdysseyOpen(false);
    navigateTo(simId);
  };

  const handleClaimDiploma = () => {
    successBuzz();
    playChime();
    unlockBadge('Class 8 Math Prodigy Diploma');
    addXp(100);
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 },
    });
  };

  const filteredUnits = CLASS_8_UNITS.filter((u) => {
    if (activeCategory === 'algebra') return u.id === 'balance-scale-equations' || u.id === 'algebraic-identities-tiles';
    if (activeCategory === 'geometry') return u.id === 'quadrilateral-morpher' || u.id === 'euler-polyhedra-3d' || u.id === 'square-roots-triplets';
    if (activeCategory === 'arithmetic') return u.id === 'compound-interest-engine' || u.id === 'direct-inverse-proportions' || u.id === 'dynamic-pie-chart';
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 overflow-y-auto">
      <div 
        className="w-full max-w-4xl bg-slate-900 border border-cyan-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Hero */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-sky-950/70 via-indigo-950/50 to-slate-900 border-b border-cyan-500/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shadow-lg">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/60">
                  Class 8 Math Odyssey
                </span>
                <span className="text-xs text-slate-400">Curriculum Aligned · CBSE · ICSE · Cambridge Standards</span>
              </div>
              <h2 className="text-lg sm:text-2xl font-black text-white mt-0.5">
                From Zero to Class 8 Math Hero
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              lightTap();
              setClass8OdysseyOpen(false);
            }}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Banner */}
        <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Odyssey Mastery: {completedClass8Count} of {CLASS_8_UNITS.length} Modules Mastered ({progressPct}%)</span>
            </div>
            {/* Progress bar */}
            <div className="w-48 sm:w-72 h-2.5 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-500 rounded-full"
                style={{ width: `${Math.max(5, progressPct)}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                lightTap();
                setSecretShortcutsOpen(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-amber-400" />
              <span>Topper Shortcuts</span>
            </button>

            <button
              type="button"
              onClick={() => {
                lightTap();
                openConceptQuizModal();
              }}
              className="px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Flame className="w-3.5 h-3.5 text-purple-400" />
              <span>1-Min Quiz</span>
            </button>

            {isAllMastered && (
              <button
                type="button"
                onClick={handleClaimDiploma}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-transform cursor-pointer"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Claim Diploma!</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
          {[
            { id: 'all', label: 'All 8 Chapters' },
            { id: 'algebra', label: 'Algebra & Equations' },
            { id: 'geometry', label: 'Geometry & 3D Solids' },
            { id: 'arithmetic', label: 'Comparing Quantities & Data' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                lightTap();
                playClick();
                setActiveCategory(cat.id as any);
              }}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors border cursor-pointer whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                  : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Cards Grid */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredUnits.map((unit) => {
            const Icon = unit.icon;
            const simMeta = SIMULATORS.find((s) => s.id === unit.id);
            const isCompleted = completedSimulators.includes(unit.id);

            return (
              <div
                key={unit.id}
                className={`p-4 rounded-2xl bg-gradient-to-br ${unit.colorScheme.bg} border ${unit.colorScheme.border} flex flex-col justify-between space-y-3 transition-all hover:scale-[1.01]`}
              >
                <div className="space-y-2">
                  {/* Top Bar: Chapter # & Badge Name */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                      Chapter {unit.unitNumber}
                    </span>
                    <span className="text-xs font-semibold text-slate-300 flex items-center gap-1 bg-slate-900/60 px-2 py-0.5 rounded-full border border-slate-800">
                      <span>{unit.badgeEmoji}</span>
                      <span>{unit.badgeName}</span>
                    </span>
                  </div>

                  {/* Chapter Name & Title */}
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${unit.colorScheme.text} shrink-0`} />
                      <span>{simMeta?.title || unit.chapterName}</span>
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                      {simMeta?.description}
                    </p>
                  </div>

                  {/* Why It Matters (Real-World Spark) */}
                  <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-300">
                    <span className="font-bold text-amber-300">Why You Care: </span>
                    <span>{unit.whyItMatters}</span>
                  </div>
                </div>

                {/* Footer launch button */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs">
                    {isCompleted ? (
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Mastered
                      </span>
                    ) : (
                      <span className="text-slate-400 flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        Ready to Explore
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleLaunch(unit.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-transform cursor-pointer"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Launch</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Master all 8 chapters to earn the Official Class 8 Math Prodigy Diploma!</span>
          </div>

          <button
            type="button"
            onClick={() => setClass8OdysseyOpen(false)}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
