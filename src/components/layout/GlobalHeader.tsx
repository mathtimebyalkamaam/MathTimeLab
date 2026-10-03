import React, { useState, useRef, useEffect } from 'react';
import {
  GraduationCap,
  Search,
  Volume2,
  VolumeX,
  Maximize2,
  Sliders,
  BookOpen,
  Sparkles,
  Flame,
  Zap,
  Award,
  ChevronDown,
  Layers,
  Compass,
  FileCheck2,
  Timer,
  GitFork,
  ExternalLink,
  Menu,
  X,
  ArrowRight,
  Brain,
  Shapes,
  Sigma,
  Activity,
  Calculator,
  Grid,
  CheckCircle2,
  LucideIcon
} from 'lucide-react';
import { useSimulatorStore } from '../../store/useSimulatorStore';
import { useProgressStore } from '../../store/useProgressStore';
import { useClassStore } from '../../store/useClassStore';
import { useSound } from '../common/SoundManager';
import { useHaptics } from '../../hooks/useHaptics';
import { SimulatorId, GradeLevel, AppRoute } from '../../types/simulators';

const SIMULATOR_TITLES: Record<string, string> = {
  'drone-navigator': 'Drone Navigator',
  'catapult-siege': 'Catapult Siege',
  'conic-sections': '3D Conics Slicer',
  'rollercoaster-architect': 'Rollercoaster',
  'unit-circle': 'Unit Circle & Waves',
  'calculus-sandbox': 'Calculus Sandbox',
  'vector-flight-lab': '3D Vector Lab',
  'argand-plane': 'Argand Plane',
  'matrix-meme': 'Matrix Machine',
  'monty-hall': 'Monty Hall Casino',
  'quadratic-roots': 'Parabola Root Hunter',
  'circle-theorems': 'Circle Theorems',
  'linear-systems': 'Linear Systems',
  'trig-heights': 'Heights & Distances',
  'heron-triangles': "Heron's Formula Lab",
  'polynomial-factorizer': 'Algebra Tile Factorizer',
  'lines-angles': 'Parallel Lines & Transversals',
  'binomial-galton': 'Binomial Galton Board',
  'arithmetic-geometric-explorer': 'Sequences & Series (AP/GP)',
  'hyperbola-ellipse-orbits': "Kepler's Focal Conics",
  'surface-area-volumes': '3D Solid Unfolder',
  'circle-chords-cyclic': 'Chords & Cyclic Quads',
  'statistics-visualizer': 'Data Fulcrum & Outliers',
  'limits-derivatives-lab': 'Tangent Secant Zoom Lab',
  'linear-inequalities': 'Feasible Region Optimizer',
  'permutations-combinations': 'Permutations vs Combinations',
  'similar-triangles': 'Similar Triangles & Thales BPT',
  'ftc-integral-accumulator': 'FTC Area Accumulator',
  'bayes-probability-lab': "Bayes' Theorem Detective",
  'euclidean-geometry-sandbox': 'Non-Euclidean Sandbox',
  'three-d-geometry-lab': '3D Skew Lines & Planes',
  'differential-equations-lab': 'Differential Equations & Slope Fields',
  'balance-scale-equations': 'Balance Scale Equation Solver',
  'algebraic-identities-tiles': 'Algebraic Identities Tiles',
  'compound-interest-engine': 'Compound Interest Engine',
  'quadrilateral-morpher': 'Quadrilateral Transformer',
  'euler-polyhedra-3d': 'Euler Polyhedra 3D Workshop',
  'direct-inverse-proportions': 'Direct vs Inverse Proportions',
  'dynamic-pie-chart': 'Dynamic Pie Chart & Angles',
  'square-roots-triplets': 'Square Roots & Triplet Forge',
  'exponents-powers-lab': 'Exponents & Powers Lab',
  'rational-numbers-density': 'Rational Numbers Density',
  'triangle-congruence-forge': 'Triangle Congruence Forge',
  'arithmetic-progression-lab': 'Arithmetic Progression Lab',
  'coordinate-section-formula': 'Section Formula & Centroid',
  'circle-tangents-lab': 'Circle Tangents Lab',
  'mathematical-induction-dominos': 'Mathematical Induction',
  'trig-equations-radial': 'Trig Equations Radial Radar',
  'linear-programming-lab': 'Linear Programming Lab',
  'probability-distribution-lab': 'Probability Distributions',
};

// Curriculum by Grade
interface GradeGroup {
  id: GradeLevel;
  gradeLabel: string;
  badgeColor: string;
  badgeBg: string;
  borderColor: string;
  description: string;
  labs: { id: SimulatorId; name: string; tag: string }[];
}

const CURRICULUM_GRADES: GradeGroup[] = [
  {
    id: 'class-8',
    gradeLabel: 'Class 8',
    badgeColor: 'text-teal-300',
    badgeBg: 'bg-teal-950/60',
    borderColor: 'border-teal-500/30',
    description: 'Foundations of Algebra, 3D Solids & Financial Math',
    labs: [
      { id: 'balance-scale-equations', name: 'Balance Scale Linear Equations', tag: 'Algebra' },
      { id: 'algebraic-identities-tiles', name: 'Algebraic Identities Tiles', tag: 'Visual' },
      { id: 'euler-polyhedra-3d', name: "Euler's Polyhedra 3D Workshop", tag: '3D Solid' },
      { id: 'compound-interest-engine', name: 'Compound Interest Engine', tag: 'Finance' },
      { id: 'square-roots-triplets', name: 'Square Roots & Triplet Forge', tag: 'Arithmetic' },
      { id: 'exponents-powers-lab', name: 'Exponents & Powers Lab', tag: 'Powers' },
      { id: 'direct-inverse-proportions', name: 'Direct & Inverse Proportions', tag: 'Ratios' },
      { id: 'rational-numbers-density', name: 'Rational Numbers Density', tag: 'Number Line' },
    ],
  },
  {
    id: 'class-9',
    gradeLabel: 'Class 9',
    badgeColor: 'text-sky-300',
    badgeBg: 'bg-sky-950/60',
    borderColor: 'border-sky-500/30',
    description: 'Cartesian Coordinate Flight, Geometry & Polynomials',
    labs: [
      { id: 'drone-navigator', name: 'The Drone Navigator (Distance)', tag: 'Cartesian' },
      { id: 'heron-triangles', name: "Heron's Formula Triangle Lab", tag: 'Area' },
      { id: 'polynomial-factorizer', name: 'Algebra Tile Factorizer', tag: 'Polynomials' },
      { id: 'lines-angles', name: 'Parallel Lines & Transversals', tag: 'Angles' },
      { id: 'triangle-congruence-forge', name: 'Triangle Congruence Forge', tag: 'Congruence' },
      { id: 'surface-area-volumes', name: '3D Solid Unfolder', tag: 'Mensuration' },
      { id: 'circle-theorems', name: 'Inscribed Angle Theorems', tag: 'Circles' },
      { id: 'circle-chords-cyclic', name: 'Chords & Cyclic Quads', tag: 'Theorems' },
    ],
  },
  {
    id: 'class-10',
    gradeLabel: 'Class 10',
    badgeColor: 'text-amber-300',
    badgeBg: 'bg-amber-950/60',
    borderColor: 'border-amber-500/30',
    description: 'Board Exam Mastery: Quadratics, Trigonometry & Similarity',
    labs: [
      { id: 'catapult-siege', name: 'Catapult Siege (Quadratic Flight)', tag: 'Parabola' },
      { id: 'quadratic-roots', name: 'Parabola Root Hunter & Vertex', tag: 'Roots' },
      { id: 'unit-circle', name: 'Unit Circle & Sine/Cosine Waves', tag: 'Trig' },
      { id: 'similar-triangles', name: 'Similar Triangles & Thales BPT', tag: 'Similarity' },
      { id: 'linear-systems', name: 'Linear Systems 2-Var Solver', tag: 'Lines' },
      { id: 'arithmetic-progression-lab', name: 'Arithmetic Progression Lab', tag: 'AP Series' },
      { id: 'coordinate-section-formula', name: 'Section Formula & Centroid', tag: 'Coordinates' },
      { id: 'circle-tangents-lab', name: 'Circle Tangents & Orthogonality', tag: 'Tangents' },
      { id: 'statistics-visualizer', name: 'Data Fulcrum, Means & Outliers', tag: 'Stats' },
    ],
  },
  {
    id: 'class-11',
    gradeLabel: 'Class 11',
    badgeColor: 'text-purple-300',
    badgeBg: 'bg-purple-950/60',
    borderColor: 'border-purple-500/30',
    description: 'JEE Foundations: 3D Conics, Limits & Complex Numbers',
    labs: [
      { id: 'conic-sections', name: '3D Conics Double-Cone Slicer', tag: '3D Conics' },
      { id: 'limits-derivatives-lab', name: 'Tangent & Secant Zoom Lab', tag: 'Limits' },
      { id: 'hyperbola-ellipse-orbits', name: "Kepler's Focal Conics & Orbits", tag: 'Astronomy' },
      { id: 'mathematical-induction-dominos', name: 'Mathematical Induction Domino', tag: 'Proofs' },
      { id: 'trig-equations-radial', name: 'Trig Equations Radial Radar', tag: 'Trigonometry' },
      { id: 'argand-plane', name: 'Argand Plane & Complex Roots', tag: 'Complex' },
      { id: 'permutations-combinations', name: 'Permutations vs Combinations', tag: 'Combinatorics' },
      { id: 'binomial-galton', name: 'Binomial Galton Board Simulator', tag: 'Binomial' },
    ],
  },
  {
    id: 'class-12',
    gradeLabel: 'Class 12',
    badgeColor: 'text-emerald-300',
    badgeBg: 'bg-emerald-950/60',
    borderColor: 'border-emerald-500/30',
    description: 'Advanced Calculus, 3D Vectors & Probability Distributions',
    labs: [
      { id: 'vector-flight-lab', name: '3D Vector Flight Lab & Cross Product', tag: 'Vectors' },
      { id: 'ftc-integral-accumulator', name: 'FTC Integral Area Accumulator', tag: 'Calculus' },
      { id: 'differential-equations-lab', name: 'Differential Equations & Slope Fields', tag: 'Diff Eq' },
      { id: 'three-d-geometry-lab', name: '3D Skew Lines & Plane Intersections', tag: '3D Geometry' },
      { id: 'matrix-meme', name: 'Matrix Machine & Transformations', tag: 'Linear Alg' },
      { id: 'linear-programming-lab', name: 'Linear Programming Feasible Region', tag: 'Optimization' },
      { id: 'bayes-probability-lab', name: "Bayes' Theorem Detective", tag: 'Bayes' },
      { id: 'probability-distribution-lab', name: 'Probability Density Functions', tag: 'Distributions' },
    ],
  },
];

// Domains Breakdown
interface DomainGroup {
  name: string;
  icon: LucideIcon;
  color: string;
  bgGradient: string;
  borderColor: string;
  summary: string;
  labs: { id: SimulatorId; name: string }[];
}

const MATH_DOMAINS: DomainGroup[] = [
  {
    name: 'Geometry & 3D Vectors',
    icon: Shapes,
    color: 'text-cyan-400',
    bgGradient: 'from-cyan-950/40 to-blue-950/30',
    borderColor: 'border-cyan-500/30',
    summary: 'Coordinate distances, 3D vectors, circle theorems, and spatial transformations.',
    labs: [
      { id: 'drone-navigator', name: 'The Drone Navigator (Distance)' },
      { id: 'vector-flight-lab', name: '3D Vector Flight Lab' },
      { id: 'conic-sections', name: '3D Conics Double-Cone Slicer' },
      { id: 'three-d-geometry-lab', name: '3D Skew Lines & Planes' },
      { id: 'similar-triangles', name: 'Similar Triangles & Thales BPT' },
      { id: 'circle-theorems', name: 'Circle Theorems & Angles' },
      { id: 'circle-tangents-lab', name: 'Circle Tangents Lab' },
      { id: 'euler-polyhedra-3d', name: "Euler's Polyhedra 3D Workshop" },
    ],
  },
  {
    name: 'Algebra & Polynomials',
    icon: Sigma,
    color: 'text-amber-400',
    bgGradient: 'from-amber-950/40 to-orange-950/30',
    borderColor: 'border-amber-500/30',
    summary: 'Quadratics, systems of equations, factorization, and mathematical induction.',
    labs: [
      { id: 'quadratic-roots', name: 'Parabola Root Hunter & Vertex' },
      { id: 'linear-systems', name: 'Linear Systems 2-Variable Intersections' },
      { id: 'polynomial-factorizer', name: 'Algebra Tile Factorizer' },
      { id: 'balance-scale-equations', name: 'Balance Scale Equation Solver' },
      { id: 'algebraic-identities-tiles', name: 'Algebraic Identities Tiles' },
      { id: 'arithmetic-progression-lab', name: 'Arithmetic Progression Lab' },
      { id: 'mathematical-induction-dominos', name: 'Mathematical Induction Dominoes' },
      { id: 'matrix-meme', name: 'Matrix Machine & Transformations' },
    ],
  },
  {
    name: 'Calculus & Analysis',
    icon: Activity,
    color: 'text-purple-400',
    bgGradient: 'from-purple-950/40 to-indigo-950/30',
    borderColor: 'border-purple-500/30',
    summary: 'Limits, secants, fundamental integrals, differential equations, and curvature.',
    labs: [
      { id: 'limits-derivatives-lab', name: 'Tangent Secant Zoom Lab' },
      { id: 'ftc-integral-accumulator', name: 'FTC Integral Area Accumulator' },
      { id: 'differential-equations-lab', name: 'Differential Equations & Slope Fields' },
      { id: 'rollercoaster-architect', name: 'Rollercoaster Curvature & Continuity' },
      { id: 'calculus-sandbox', name: 'Calculus Sandbox (Tangent Slopes)' },
      { id: 'hyperbola-ellipse-orbits', name: "Kepler's Planetary Focal Orbits" },
    ],
  },
  {
    name: 'Trigonometry & Waves',
    icon: Brain,
    color: 'text-sky-400',
    bgGradient: 'from-sky-950/40 to-cyan-950/30',
    borderColor: 'border-sky-500/30',
    summary: 'Unit circle unwrapping, real-time sine/cosine waves, radar equations, and heights.',
    labs: [
      { id: 'unit-circle', name: 'Unit Circle & Sine/Cosine Waves' },
      { id: 'trig-heights', name: 'Heights & Distances (Clinometer)' },
      { id: 'trig-equations-radial', name: 'Trig Equations Radial Radar' },
    ],
  },
  {
    name: 'Probability & Statistics',
    icon: Zap,
    color: 'text-emerald-400',
    bgGradient: 'from-emerald-950/40 to-teal-950/30',
    borderColor: 'border-emerald-500/30',
    summary: 'Bayesian inference, Galton normal distribution, Monty Hall paradox, and outliers.',
    labs: [
      { id: 'bayes-probability-lab', name: "Bayes' Theorem Detective" },
      { id: 'binomial-galton', name: 'Binomial Galton Board Simulator' },
      { id: 'monty-hall', name: 'Monty Hall Probability Casino' },
      { id: 'statistics-visualizer', name: 'Data Fulcrum, Means & Outliers' },
      { id: 'probability-distribution-lab', name: 'Probability Density Functions' },
      { id: 'permutations-combinations', name: 'Permutations vs Combinations' },
    ],
  },
  {
    name: 'Mensuration & Arithmetic',
    icon: Calculator,
    color: 'text-rose-400',
    bgGradient: 'from-rose-950/40 to-pink-950/30',
    borderColor: 'border-rose-500/30',
    summary: 'Solid 3D unfoldings, compound interest compounding, proportional scaling.',
    labs: [
      { id: 'surface-area-volumes', name: '3D Solid Unfolder (Cylinder/Cone)' },
      { id: 'compound-interest-engine', name: 'Compound Interest Growth Engine' },
      { id: 'direct-inverse-proportions', name: 'Direct vs Inverse Proportions' },
      { id: 'square-roots-triplets', name: 'Square Roots & Triplet Forge' },
      { id: 'rational-numbers-density', name: 'Rational Numbers Density on Line' },
    ],
  },
];

interface GlobalHeaderProps {
  onOpenClassModal?: () => void;
}

export const GlobalHeader: React.FC<GlobalHeaderProps> = ({ onOpenClassModal }) => {
  const {
    currentRoute,
    navigateTo,
    setGradeFilter,
    isZenMode,
    toggleZenMode,
    isLeftSidebarOpen,
    isRightSidebarOpen,
    toggleLeftSidebar,
    toggleRightSidebar,
    isEli13Mode,
    toggleEli13Mode,
    setIsSearchModalOpen,
    setIsAuthorModalOpen,
    openPOEModal,
    openExamPYQModal,
    openStressTestModal,
    openSpeedDrillModal,
    openDerivationLadderModal,
    setSecretShortcutsOpen,
    openConceptQuizModal,
  } = useSimulatorStore();

  const { totalXp, streakDays } = useProgressStore();
  const { studentClassCode } = useClassStore();
  const { isMuted, toggleMute, playClick } = useSound();
  const { lightTap, selectionTick } = useHaptics();

  // Active hover dropdown state
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);

  // Mobile drawer state
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [mobileExpandedSection, setMobileExpandedSection] = useState<string | null>('classes');

  const isSimulator = currentRoute !== 'home' && currentRoute !== 'landing' && currentRoute !== 'teacher';
  const currentSimTitle = SIMULATOR_TITLES[currentRoute] || 'Visual Lab';

  // Handle smooth mouse enter/leave with anti-flicker delay
  const handleDropdownEnter = (menuKey: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setActiveDropdown(menuKey);
  };

  const handleDropdownLeave = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 180);
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectSim = (simId: SimulatorId) => {
    lightTap();
    playClick();
    setActiveDropdown(null);
    setIsMobileDrawerOpen(false);
    navigateTo(simId);
  };

  const handleSelectGradeFilter = (grade: GradeLevel) => {
    lightTap();
    playClick();
    setGradeFilter(grade);
    setActiveDropdown(null);
    setIsMobileDrawerOpen(false);
    navigateTo('home');
  };

  const handleOpenPage = (route: AppRoute) => {
    lightTap();
    playClick();
    setActiveDropdown(null);
    setIsMobileDrawerOpen(false);
    navigateTo(route);
  };

  // Close menus on route change or escape key
  useEffect(() => {
    setActiveDropdown(null);
    setIsMobileDrawerOpen(false);
  }, [currentRoute]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveDropdown(null);
        setIsMobileDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (isZenMode) return null;

  return (
    <>
      <header 
        ref={headerRef}
        className="sticky top-0 z-50 w-full select-none transition-all shadow-2xl"
      >
        {/* ========================================================================= */}
        {/* TIER 1: SLIM TOP UTILITY & STATUS BAR (RELIANCE SCHEME)                    */}
        {/* ========================================================================= */}
        {!isSimulator && (
          <div className="w-full bg-slate-900/95 border-b border-slate-800/90 text-[11px] text-slate-300 py-1 px-3 sm:px-6">
            <div className="w-full max-w-[1720px] mx-auto px-1 sm:px-3 flex items-center justify-between gap-3">
              {/* Left: Curriculum & Live Status Ticker */}
              <div className="flex items-center gap-2.5 truncate font-medium">
                <span className="flex items-center gap-1.5 text-emerald-400 font-semibold shrink-0">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  CBSE & NCERT Aligned
                </span>
                <span className="text-slate-600 hidden sm:inline">|</span>
                <span className="hidden sm:inline text-slate-300 truncate">50 Interactive Visual Laboratories</span>
                <span className="text-slate-600 hidden md:inline">|</span>
                <span className="hidden md:inline text-slate-400 truncate">Zero Sign-Up · 100% Free Open Access</span>
              </div>

              {/* Right: Quick Utilities */}
              <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
                {onOpenClassModal && (
                  <button
                    type="button"
                    onClick={() => {
                      lightTap();
                      onOpenClassModal();
                    }}
                    className="hover:text-emerald-300 transition-colors flex items-center gap-1 cursor-pointer font-mono"
                  >
                    <GraduationCap className="w-3 h-3 text-emerald-400" />
                    <span>{studentClassCode ? `#${studentClassCode}` : 'Join Class'}</span>
                  </button>
                )}
                <span className="text-slate-700 hidden sm:inline">|</span>
                <div className="hidden sm:flex items-center gap-1 text-amber-300 font-semibold font-mono">
                  <Flame className="w-3 h-3 text-amber-400 fill-amber-400/40" />
                  <span>{streakDays}d</span>
                </div>
                <span className="text-slate-700 hidden sm:inline">|</span>
                <div className="hidden sm:flex items-center gap-1 text-sky-300 font-bold font-mono">
                  <Sparkles className="w-3 h-3 text-sky-400" />
                  <span>{totalXp} XP</span>
                </div>
                <span className="text-slate-700 hidden md:inline">|</span>
                <button
                  type="button"
                  onClick={() => handleOpenPage('teacher')}
                  className="hidden md:flex items-center gap-1 hover:text-emerald-300 transition-colors cursor-pointer"
                >
                  <span>Teacher Portal</span>
                  <ArrowRight className="w-2.5 h-2.5 text-emerald-400" />
                </button>
                <span className="text-slate-700">|</span>
                <button
                  type="button"
                  onClick={() => {
                    lightTap();
                    toggleMute();
                    if (isMuted) playClick();
                  }}
                  className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
                  title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
                >
                  {isMuted ? <VolumeX className="w-3 h-3 text-slate-500" /> : <Volume2 className="w-3 h-3 text-emerald-400" />}
                  <span className="text-[10px] uppercase font-mono hidden xs:inline">{isMuted ? 'Muted' : 'Audio'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TIER 2: MAIN NAVIGATION BAR                                               */}
        {/* ========================================================================= */}
        <div className="w-full h-14 sm:h-16 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800 relative shadow-lg">
          {/* Subtle luminous bottom accent line in soft light blue & magenta */}
          <div className="absolute bottom-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-sky-400/50 via-fuchsia-400/50 to-transparent pointer-events-none" />

          <div className="w-full max-w-[1720px] mx-auto h-full px-2.5 sm:px-4 lg:px-6 flex items-center justify-between gap-3">
            {/* ZONE 1: OFFICIAL MATH TIME LOGO + LAB PILL + BREADCRUMB */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <button
                type="button"
                onClick={() => handleOpenPage('home')}
                className="flex items-center gap-2 group cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-xl p-0.5 transition-all"
                title="Math Time Lab - Explore All 50 Interactive Simulators"
                aria-label="Math Time Lab Homepage"
              >
                {/* High-visibility Brand Crest Badge */}
                <div className="relative p-1 sm:p-1.5 rounded-xl bg-slate-900 border border-slate-700/90 shadow-sm group-hover:border-emerald-400/60 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.25)] transition-all flex items-center justify-center shrink-0">
                  <img 
                    src="/math-time-logo.png" 
                    alt="Math Time by Alka Ma'am" 
                    className="h-7 sm:h-8 md:h-9 w-auto object-contain brightness-110 contrast-125 filter drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)] select-none transition-transform group-hover:scale-105"
                  />
                </div>

                {/* LAB Pill directly beside the logo */}
                <span className="inline-flex items-center px-2 py-0.5 sm:py-1 rounded-lg text-[11px] sm:text-xs font-black tracking-widest uppercase bg-gradient-to-r from-emerald-400 via-cyan-400 to-teal-300 text-slate-950 shadow-[0_0_10px_rgba(52,211,153,0.4)] border border-emerald-300/40 leading-none group-hover:scale-105 transition-transform">
                  LAB
                </span>
              </button>

              {/* Active Simulator Breadcrumb Chip */}
              {isSimulator && (
                <div className="flex items-center gap-1.5 pl-1.5 sm:pl-2.5 border-l border-slate-800">
                  <span className="text-slate-600 text-xs hidden xs:inline">/</span>
                  <div 
                    className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-900 border border-emerald-500/30 text-emerald-300 text-xs font-semibold shadow-inner"
                    title={`Active Simulator: ${currentSimTitle}`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="truncate max-w-[110px] xs:max-w-[140px] sm:max-w-[180px] font-medium text-slate-200">
                      {currentSimTitle}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* ZONE 2: HORIZONTAL NAVIGATION LINKS (RELIANCE SCHEME) */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2 h-full">
              {/* 1. Classes (8–12) */}
              <div 
                className="relative h-full flex items-center"
                onMouseEnter={() => handleDropdownEnter('classes')}
                onMouseLeave={handleDropdownLeave}
              >
                <button
                  type="button"
                  onClick={() => setActiveDropdown(activeDropdown === 'classes' ? null : 'classes')}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-[13px] font-semibold tracking-wide transition-all cursor-pointer ${
                    activeDropdown === 'classes'
                      ? 'text-white bg-slate-800/80 border-b-2 border-emerald-400 shadow-sm'
                      : 'text-slate-200 hover:text-white hover:bg-slate-900/60'
                  }`}
                >
                  <GraduationCap className="w-4 h-4 text-emerald-400" />
                  <span>Classes (8–12)</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${activeDropdown === 'classes' ? 'rotate-180 text-emerald-400' : ''}`} />
                </button>
              </div>

              {/* 2. Math Domains */}
              <div 
                className="relative h-full flex items-center"
                onMouseEnter={() => handleDropdownEnter('domains')}
                onMouseLeave={handleDropdownLeave}
              >
                <button
                  type="button"
                  onClick={() => setActiveDropdown(activeDropdown === 'domains' ? null : 'domains')}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-[13px] font-semibold tracking-wide transition-all cursor-pointer ${
                    activeDropdown === 'domains'
                      ? 'text-white bg-slate-800/80 border-b-2 border-emerald-400 shadow-sm'
                      : 'text-slate-200 hover:text-white hover:bg-slate-900/60'
                  }`}
                >
                  <Shapes className="w-4 h-4 text-purple-400" />
                  <span>Math Domains</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${activeDropdown === 'domains' ? 'rotate-180 text-emerald-400' : ''}`} />
                </button>
              </div>

              {/* 3. All 50 Labs */}
              <div 
                className="relative h-full flex items-center"
                onMouseEnter={() => handleDropdownEnter('labs')}
                onMouseLeave={handleDropdownLeave}
              >
                <button
                  type="button"
                  onClick={() => handleOpenPage('home')}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-[13px] font-semibold tracking-wide transition-all cursor-pointer ${
                    currentRoute === 'home' || activeDropdown === 'labs'
                      ? 'text-white bg-slate-800/80 border-b-2 border-emerald-400 shadow-sm'
                      : 'text-slate-200 hover:text-white hover:bg-slate-900/60'
                  }`}
                >
                  <Grid className="w-4 h-4 text-cyan-400" />
                  <span>All 50 Labs</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${activeDropdown === 'labs' ? 'rotate-180 text-emerald-400' : ''}`} />
                </button>
              </div>

              {/* 4. Diagnostic Tools */}
              <div 
                className="relative h-full flex items-center"
                onMouseEnter={() => handleDropdownEnter('tools')}
                onMouseLeave={handleDropdownLeave}
              >
                <button
                  type="button"
                  onClick={() => setActiveDropdown(activeDropdown === 'tools' ? null : 'tools')}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-[13px] font-semibold tracking-wide transition-all cursor-pointer ${
                    activeDropdown === 'tools'
                      ? 'text-white bg-slate-800/80 border-b-2 border-emerald-400 shadow-sm'
                      : 'text-slate-200 hover:text-white hover:bg-slate-900/60'
                  }`}
                >
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Exam & Tools</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${activeDropdown === 'tools' ? 'rotate-180 text-emerald-400' : ''}`} />
                </button>
              </div>

              {/* 5. Educator Alka Ma'am */}
              <div 
                className="relative h-full flex items-center"
                onMouseEnter={() => handleDropdownEnter('author')}
                onMouseLeave={handleDropdownLeave}
              >
                <button
                  type="button"
                  onClick={() => setActiveDropdown(activeDropdown === 'author' ? null : 'author')}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-[13px] font-semibold tracking-wide transition-all cursor-pointer ${
                    activeDropdown === 'author'
                      ? 'text-white bg-slate-800/80 border-b-2 border-emerald-400 shadow-sm'
                      : 'text-slate-200 hover:text-white hover:bg-slate-900/60'
                  }`}
                >
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span>Alka Ma'am</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${activeDropdown === 'author' ? 'rotate-180 text-emerald-400' : ''}`} />
                </button>
              </div>
            </nav>

            {/* ZONE 3: SEARCH, COCKPIT CONTROLS & MOBILE BUTTON */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Global Search Command Bar Trigger (⌘K / Ctrl+K) */}
              <button
                type="button"
                onClick={() => {
                  lightTap();
                  setIsSearchModalOpen(true);
                }}
                className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-700/80 hover:border-emerald-400 text-slate-200 hover:text-white transition-all text-xs cursor-pointer group shadow-sm hover:shadow-emerald-500/15 active:scale-95"
                title="Search all 50 laboratories (Press ⌘K or /)"
                aria-label="Search all 50 laboratories"
              >
                <Search className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-115 group-hover:rotate-6 transition-transform" />
                <span className="hidden md:inline font-semibold text-slate-200 group-hover:text-white">Search 50 Labs...</span>
                <kbd className="hidden sm:inline px-1.5 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-600/50 text-[10px] font-mono font-bold text-emerald-300 shadow-2xs">
                  ⌘K
                </kbd>
              </button>

              {/* SIMULATOR-SPECIFIC CONTROLS (Only visible inside active simulator) */}
              {isSimulator && (
                <div className="hidden lg:flex items-center gap-1 pl-1 border-l border-slate-800">
                  {/* Inputs Panel Toggle */}
                  <button
                    type="button"
                    onClick={() => {
                      lightTap();
                      toggleLeftSidebar();
                    }}
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                      isLeftSidebarOpen
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                    title={isLeftSidebarOpen ? 'Collapse Left Inputs' : 'Expand Left Inputs'}
                  >
                    <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="hidden xl:inline">Inputs</span>
                  </button>

                  {/* Theory Panel Toggle */}
                  <button
                    type="button"
                    onClick={() => {
                      lightTap();
                      toggleRightSidebar();
                    }}
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                      isRightSidebarOpen
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-sm'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                    title={isRightSidebarOpen ? 'Collapse Right Theory' : 'Expand Right Theory'}
                  >
                    <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                    <span className="hidden xl:inline">Theory</span>
                  </button>

                  {/* Zen Mode Toggle */}
                  <button
                    type="button"
                    onClick={() => {
                      lightTap();
                      toggleZenMode();
                    }}
                    className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-emerald-300 active:scale-95 transition-colors cursor-pointer"
                    title="Zen Mode: Full-Screen Pure Canvas"
                    aria-label="Zen Mode"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* MOBILE HAMBURGER BUTTON (< 1024px) */}
              <button
                type="button"
                onClick={() => {
                  selectionTick();
                  setIsMobileDrawerOpen(!isMobileDrawerOpen);
                }}
                className="lg:hidden p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
                aria-label="Open Mobile Navigation Menu"
                title="Open Menu"
              >
                {isMobileDrawerOpen ? <X className="w-4 h-4 text-emerald-400" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* FULL-WIDTH EXPANSIVE WHITE MEGA-DROPDOWNS (RELIANCE CORPORATE SCHEME)      */}
          {/* ========================================================================= */}

          {/* DROPDOWN 1: Classes & Grades (5 Columns) */}
          {activeDropdown === 'classes' && (
            <div 
              className="absolute top-full left-0 right-0 w-full bg-white text-slate-900 border-b-2 border-slate-200 shadow-2xl animate-in fade-in slide-in-from-top-1 duration-150 z-50"
              onMouseEnter={() => handleDropdownEnter('classes')}
              onMouseLeave={handleDropdownLeave}
            >
              <div className="h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
              <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex items-center justify-between pb-3 mb-5 border-b border-slate-200">
                  <div className="flex items-center gap-2.5">
                    <span className="font-extrabold text-xs uppercase tracking-wider text-slate-900">
                      CBSE & State Board Curriculum Navigation
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Classes 8 to 12 Aligned
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="hidden sm:inline">Click any lab to launch instantly</span>
                    <span className="font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded border border-slate-200">ESC to close</span>
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-6">
                  {CURRICULUM_GRADES.map((group) => (
                    <div key={group.id} className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                            group.id === 'class-8' ? 'bg-emerald-100 text-emerald-800' :
                            group.id === 'class-9' ? 'bg-cyan-100 text-cyan-800' :
                            group.id === 'class-10' ? 'bg-amber-100 text-amber-800' :
                            group.id === 'class-11' ? 'bg-purple-100 text-purple-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {group.gradeLabel}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 font-semibold">{group.labs.length} Labs</span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-2 leading-snug">{group.description}</p>
                      </div>

                      <div className="space-y-0.5">
                        {group.labs.map((sim) => (
                          <button
                            key={sim.id}
                            type="button"
                            onClick={() => handleSelectSim(sim.id)}
                            className="w-full text-left py-1.5 px-2 rounded hover:bg-slate-100 text-slate-700 hover:text-emerald-700 transition-colors flex items-center justify-between group cursor-pointer"
                            title={sim.name}
                          >
                            <span className="text-xs font-medium truncate group-hover:font-semibold">{sim.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono ml-1 shrink-0">{sim.tag}</span>
                          </button>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSelectGradeFilter(group.id)}
                        className="w-full pt-2 border-t border-slate-100 text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center justify-between cursor-pointer"
                      >
                        <span>Explore All {group.gradeLabel}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* DROPDOWN 2: Math Domains (6 Columns) */}
          {activeDropdown === 'domains' && (
            <div 
              className="absolute top-full left-0 right-0 w-full bg-white text-slate-900 border-b-2 border-slate-200 shadow-2xl animate-in fade-in slide-in-from-top-1 duration-150 z-50"
              onMouseEnter={() => handleDropdownEnter('domains')}
              onMouseLeave={handleDropdownLeave}
            >
              <div className="h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-500" />
              <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex items-center justify-between pb-3 mb-5 border-b border-slate-200">
                  <div className="flex items-center gap-2.5">
                    <span className="font-extrabold text-xs uppercase tracking-wider text-slate-900">
                      Subject Domains & Conceptual Branches
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">
                      6 Branches of Mathematics
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="hidden sm:inline">Tactile mathematical simulations across all branches</span>
                    <span className="font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded border border-slate-200">ESC to close</span>
                  </div>
                </div>

                <div className="grid grid-cols-6 gap-5">
                  {MATH_DOMAINS.map((domain) => {
                    const Icon = domain.icon;
                    return (
                      <div key={domain.name} className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="p-1 rounded bg-slate-100 text-slate-800">
                            <Icon className="w-4 h-4 text-purple-700" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-900 leading-tight">{domain.name}</h4>
                            <span className="text-[10px] text-slate-400 font-mono">{domain.labs.length} Models</span>
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-2 leading-snug">{domain.summary}</p>

                        <div className="space-y-0.5">
                          {domain.labs.slice(0, 5).map((lab) => (
                            <button
                              key={lab.id}
                              type="button"
                              onClick={() => handleSelectSim(lab.id)}
                              className="w-full text-left py-1 px-1.5 rounded hover:bg-slate-100 text-xs text-slate-700 hover:text-purple-700 hover:font-medium transition-colors truncate block cursor-pointer"
                              title={lab.name}
                            >
                              • {lab.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* DROPDOWN 3: All 50 Labs (Catalog Directory) */}
          {activeDropdown === 'labs' && (
            <div 
              className="absolute top-full left-0 right-0 w-full bg-white text-slate-900 border-b-2 border-slate-200 shadow-2xl animate-in fade-in slide-in-from-top-1 duration-150 z-50"
              onMouseEnter={() => handleDropdownEnter('labs')}
              onMouseLeave={handleDropdownLeave}
            >
              <div className="h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
              <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex items-center justify-between pb-3 mb-5 border-b border-slate-200">
                  <div className="flex items-center gap-2.5">
                    <span className="font-extrabold text-xs uppercase tracking-wider text-slate-900">
                      50 Interactive Visual Laboratories
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Complete Workspace
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="hidden sm:inline">Search, test live, and explore grade-by-grade</span>
                    <span className="font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded border border-slate-200">ESC to close</span>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-6">
                  {/* Quick destination cards - 100% clickable */}
                  <button
                    type="button"
                    onClick={() => handleOpenPage('home')}
                    className="w-full text-left p-4 rounded-xl bg-slate-50 hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-400 transition-all duration-200 group cursor-pointer space-y-2 flex flex-col justify-between shadow-xs hover:shadow-md"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-900 uppercase tracking-wide">All Labs Grid</h4>
                        <Grid className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
                      </div>
                      <p className="text-xs text-slate-600 group-hover:text-slate-700 leading-snug">
                        Explore all 50 simulators in a unified high-speed interactive grid with search and filters.
                      </p>
                    </div>
                    <div className="mt-3 text-xs font-bold text-emerald-700 group-hover:text-emerald-800 flex items-center gap-1.5">
                      <span>Open 50-Lab Grid</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenPage('landing')}
                    className="w-full text-left p-4 rounded-xl bg-slate-50 hover:bg-purple-50/60 border border-slate-200 hover:border-purple-400 transition-all duration-200 group cursor-pointer space-y-2 flex flex-col justify-between shadow-xs hover:shadow-md"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-purple-900 uppercase tracking-wide">Visual Overview</h4>
                        <Compass className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform" />
                      </div>
                      <p className="text-xs text-slate-600 group-hover:text-slate-700 leading-snug">
                        Discover Alka Ma'am's visual pedagogical philosophy, live previews, and touch testing.
                      </p>
                    </div>
                    <div className="mt-3 text-xs font-bold text-purple-700 group-hover:text-purple-800 flex items-center gap-1.5">
                      <span>Read Pedagogical Story</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>

                  {/* Featured Flagship Labs */}
                  <div className="col-span-2 space-y-2">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-2">Popular High-Impact Simulations</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'catapult-siege' as SimulatorId, name: 'Catapult Siege (Quadratics)', grade: 'Class 10' },
                        { id: 'drone-navigator' as SimulatorId, name: 'Drone Navigator (Distance)', grade: 'Class 9' },
                        { id: 'conic-sections' as SimulatorId, name: '3D Conics Double-Cone Slicer', grade: 'Class 11' },
                        { id: 'vector-flight-lab' as SimulatorId, name: '3D Vector Flight Lab', grade: 'Class 12' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleSelectSim(item.id)}
                          className="p-2.5 rounded-lg border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all text-left flex items-center justify-between group cursor-pointer"
                        >
                          <span className="text-xs font-medium text-slate-800 group-hover:text-emerald-800 group-hover:font-semibold truncate">
                            {item.name}
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 ml-1 shrink-0">
                            {item.grade}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DROPDOWN 4: Diagnostic Tools (Grid of 6) */}
          {activeDropdown === 'tools' && (
            <div 
              className="absolute top-full left-0 right-0 w-full bg-white text-slate-900 border-b-2 border-slate-200 shadow-2xl animate-in fade-in slide-in-from-top-1 duration-150 z-50"
              onMouseEnter={() => handleDropdownEnter('tools')}
              onMouseLeave={handleDropdownLeave}
            >
              <div className="h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-500" />
              <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex items-center justify-between pb-3 mb-5 border-b border-slate-200">
                  <div className="flex items-center gap-2.5">
                    <span className="font-extrabold text-xs uppercase tracking-wider text-slate-900">
                      Pedagogical Diagnostic Toolkit
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                      Interactive Exam & Intuition Engines
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="hidden sm:inline">Launch inquiry challenges & derivations with 1 click</span>
                    <span className="font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded border border-slate-200">ESC to close</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {[
                    { title: 'Predict · Observe · Explain (POE)', desc: 'Inquiry challenges: predict outcomes before touching sliders', icon: Zap, color: 'text-amber-600', action: openPOEModal },
                    { title: 'Real Board Exam PYQs', desc: 'Authentic CBSE & JEE questions with official step-by-step marking', icon: FileCheck2, color: 'text-emerald-600', action: openExamPYQModal },
                    { title: 'Break the Math', desc: 'Stress-test extreme boundary conditions, singular degeneracies & zero denominators', icon: Flame, color: 'text-red-600', action: openStressTestModal },
                    { title: '60s Intuition Speed Drill', desc: 'Fast visual sprints to lock in reflex geometry & algebraic instincts', icon: Timer, color: 'text-blue-600', action: openSpeedDrillModal },
                    { title: 'Theorem Proof Ladders', desc: 'Line-by-line algebraic justifications and geometric derivations', icon: GitFork, color: 'text-purple-600', action: openDerivationLadderModal },
                    { title: "Topper's Secret Hacks", desc: "Alka Ma'am's mnemonic cheat-sheets, mental math shortcuts & trap-busters", icon: Sparkles, color: 'text-cyan-600', action: () => setSecretShortcutsOpen(true) },
                  ].map((t) => {
                    const Icon = t.icon;
                    return (
                      <button
                        key={t.title}
                        type="button"
                        onClick={() => {
                          lightTap();
                          setActiveDropdown(null);
                          t.action();
                        }}
                        className="p-3.5 rounded-xl border border-slate-200 hover:border-amber-500 hover:bg-amber-50/40 text-left transition-all group cursor-pointer flex gap-3 shadow-xs"
                      >
                        <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-white shrink-0">
                          <Icon className={`w-5 h-5 ${t.color}`} />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 group-hover:text-amber-800">{t.title}</h4>
                          <p className="text-[11px] text-slate-500 leading-snug mt-0.5">{t.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* DROPDOWN 5: Educator Alka Ma'am & Portal */}
          {activeDropdown === 'author' && (
            <div 
              className="absolute top-full left-0 right-0 w-full bg-white text-slate-900 border-b-2 border-slate-200 shadow-2xl animate-in fade-in slide-in-from-top-1 duration-150 z-50"
              onMouseEnter={() => handleDropdownEnter('author')}
              onMouseLeave={handleDropdownLeave}
            >
              <div className="h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500" />
              <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex items-center justify-between pb-3 mb-5 border-b border-slate-200">
                  <div className="flex items-center gap-2.5">
                    <span className="font-extrabold text-xs uppercase tracking-wider text-slate-900">
                      About Educator Alka Sharma & Pedagogy
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Founder & Master Pedagogy Specialist
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="hidden sm:inline">Transforming Mathematics from abstract symbols into physical intuition</span>
                    <span className="font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded border border-slate-200">ESC to close</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  {/* Card 1: Alka Sharma Bio - Whole Card Clickable */}
                  <button
                    type="button"
                    onClick={() => {
                      lightTap();
                      setActiveDropdown(null);
                      setIsAuthorModalOpen(true);
                    }}
                    className="w-full text-left p-4 rounded-xl bg-slate-50 hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-400 transition-all duration-200 group cursor-pointer space-y-3 shadow-xs hover:shadow-md flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-emerald-700 group-hover:bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0 transition-colors">
                          AS
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-900 transition-colors">Alka Sharma</h4>
                          <p className="text-xs text-emerald-700 font-semibold">M.Sc, B.Ed · 10+ Years Experience</p>
                          <p className="text-[11px] text-slate-500">Senior Mathematics Educator</p>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 group-hover:text-slate-700 leading-relaxed">
                        Founder of Its Math Time, dedicated to demystifying mathematics for CBSE, ICSE, and JEE aspirants through tactile visual simulation.
                      </p>
                    </div>
                    <div className="text-xs font-bold text-emerald-700 group-hover:text-emerald-800 flex items-center gap-1.5 pt-2">
                      <span>View Full Profile & Credentials</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>

                  {/* Card 2: Teacher & Classroom Portal - Whole Card Clickable */}
                  <button
                    type="button"
                    onClick={() => handleOpenPage('teacher')}
                    className="w-full text-left p-4 rounded-xl bg-slate-50 hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-400 transition-all duration-200 group cursor-pointer space-y-3 shadow-xs hover:shadow-md flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-900 uppercase tracking-wide transition-colors">Teacher & Classroom Portal</h4>
                        <div className="p-2 rounded-lg bg-emerald-100/60 group-hover:bg-emerald-200/80 transition-colors">
                          <GraduationCap className="w-5 h-5 text-emerald-700" />
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 group-hover:text-slate-700 leading-relaxed">
                        Smartboard-ready interactive tools, lesson assignment generator, and classroom live sync codes for school teachers.
                      </p>
                    </div>
                    <div className="text-xs font-bold text-emerald-700 group-hover:text-emerald-800 flex items-center gap-1.5 pt-2">
                      <span>Open Teacher & Smartboard Portal</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>

                  {/* Card 3: Official Channels - Whole Card Clickable Link */}
                  <a
                    href="https://itsmathtime.co.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      lightTap();
                      setActiveDropdown(null);
                    }}
                    className="w-full text-left p-4 rounded-xl bg-slate-50 hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-400 transition-all duration-200 group cursor-pointer space-y-3 shadow-xs hover:shadow-md flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-900 uppercase tracking-wide transition-colors">Official Channels</h4>
                        <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-emerald-100/60 transition-colors">
                          <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-emerald-700" />
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 group-hover:text-slate-700 leading-relaxed">
                        Visit the official website for video explanations, student coaching modules, and diagnostic worksheets.
                      </p>
                    </div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 group-hover:text-emerald-800 pt-2">
                      <span>itsmathtime.co.in</span>
                      <span className="text-[11px] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

      {/* ========================================================================= */}
      {/* MOBILE FULL-FEATURED SLIDE-DOWN DRAWER (< 1024px)                          */}
      {/* ========================================================================= */}
      {isMobileDrawerOpen && (
        <div 
          className="lg:hidden fixed inset-x-0 top-14 bottom-0 z-50 bg-slate-950/95 backdrop-blur-2xl border-t border-slate-800/90 overflow-y-auto p-4 space-y-4 animate-in fade-in slide-in-from-top-4 duration-200"
        >
          {/* Mobile Drawer Brand Crest Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-lg bg-slate-900 border border-blue-400/40 shadow-[0_0_12px_rgba(59,130,246,0.25)] flex items-center justify-center">
                <img 
                  src="/math-time-logo.png" 
                  alt="Math Time by Alka Ma'am" 
                  className="h-7 w-auto object-contain brightness-110 contrast-125 select-none"
                />
              </div>
              <span className="px-2 py-0.5 rounded-lg text-xs font-black tracking-widest uppercase bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 leading-none border border-emerald-300/40 shadow-sm">
                LAB
              </span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/70 border border-emerald-800/60 px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              50 Labs
            </span>
          </div>

          {/* Quick Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleOpenPage('home')}
              className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2.5 text-left text-xs font-bold text-white hover:border-cyan-500/40"
            >
              <Grid className="w-4 h-4 text-cyan-400" />
              <span>All 50 Labs</span>
            </button>
            <button
              type="button"
              onClick={() => handleOpenPage('landing')}
              className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2.5 text-left text-xs font-bold text-white hover:border-purple-500/40"
            >
              <Compass className="w-4 h-4 text-purple-400" />
              <span>Visual Overview</span>
            </button>
          </div>

          {/* Section: Classes 8 to 12 Accordion */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-3 space-y-2">
            <div className="flex items-center justify-between pb-1 border-b border-slate-800/80">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-cyan-400" />
                Select by Class
              </span>
              <span className="text-[10px] text-slate-400">Class 8 to 12</span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              {CURRICULUM_GRADES.map((group) => (
                <button
                  key={group.id}
                  type="button"
                  onClick={() => handleSelectGradeFilter(group.id)}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-left hover:border-cyan-500/40 flex flex-col justify-between"
                >
                  <span className={`text-xs font-bold ${group.badgeColor}`}>
                    {group.gradeLabel}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {group.labs.length} visual models →
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Section: Pedagogical Exam Tools */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-3 space-y-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-slate-800/80">
              <Zap className="w-4 h-4 text-amber-400" />
              Interactive Exam & Proof Tools
            </span>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setIsMobileDrawerOpen(false);
                  openPOEModal();
                }}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-left text-[11px] font-semibold text-amber-300"
              >
                ⚡ Predict · Observe · Explain
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsMobileDrawerOpen(false);
                  openExamPYQModal();
                }}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-left text-[11px] font-semibold text-emerald-300"
              >
                📝 Real Board PYQs
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsMobileDrawerOpen(false);
                  openStressTestModal();
                }}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-left text-[11px] font-semibold text-red-300"
              >
                💥 Break The Math
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsMobileDrawerOpen(false);
                  openSpeedDrillModal();
                }}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-left text-[11px] font-semibold text-amber-300"
              >
                ⏱️ 60s Speed Drill
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsMobileDrawerOpen(false);
                  openDerivationLadderModal();
                }}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-left text-[11px] font-semibold text-purple-300"
              >
                🪜 Proof Ladders
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsMobileDrawerOpen(false);
                  setSecretShortcutsOpen(true);
                }}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-left text-[11px] font-semibold text-cyan-300"
              >
                💡 Topper's Secret Hacks
              </button>
            </div>
          </div>

          {/* Section: Educator Profile & Teacher Portal */}
          <div className="rounded-2xl bg-amber-950/20 border border-amber-800/40 p-3 space-y-2">
            <div className="flex items-center justify-between pb-1 border-b border-amber-800/40">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                Educator Alka Sharma (M.Sc, B.Ed)
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              Founder of Its Math Time with 10+ years of teaching excellence.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsMobileDrawerOpen(false);
                  setIsAuthorModalOpen(true);
                }}
                className="p-2 rounded-xl bg-amber-950/40 border border-amber-800/60 text-center text-xs font-bold text-amber-300"
              >
                View Full Bio
              </button>
              <button
                type="button"
                onClick={() => handleOpenPage('teacher')}
                className="p-2 rounded-xl bg-cyan-950/40 border border-cyan-800/60 text-center text-xs font-bold text-cyan-300"
              >
                Teacher Portal
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
    </>
  );
};
