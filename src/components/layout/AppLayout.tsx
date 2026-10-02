import React, { useEffect, useState } from 'react';
import { 
  Sparkles, 
  Flame, 
  Compass, 
  Navigation,
  Target,
  Orbit, 
  Activity, 
  TrendingUp, 
  Boxes, 
  RotateCcw,
  ArrowLeft,
  GraduationCap,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Sliders,
  Trophy,
  Lightbulb,
  BookOpen,
  Zap,
  FileCheck2,
  Timer,
  GitFork,
  Search,
  Award,
  LucideIcon
} from 'lucide-react';
import { GlobalSearchModal } from '../common/GlobalSearchModal';
import { AuthorProfileModal } from '../modals/AuthorProfileModal';
import { useSimulatorStore } from '../../store/useSimulatorStore';
import { SimulatorId } from '../../types/simulators';
import { useSound } from '../common/SoundManager';
import { useHaptics } from '../../hooks/useHaptics';
import { usePerformanceMode } from '../../hooks/usePerformanceMode';
import { MathErrorBoundary } from '../common/MathErrorBoundary';
import { XPBar } from '../common/XPBar';
import { BadgeUnlockedToast } from '../common/BadgeUnlockedToast';
import { useProgressStore, getCurrentRank } from '../../store/useProgressStore';
import { ClassCodeInput } from '../common/ClassCodeInput';
import { useClassStore } from '../../store/useClassStore';
import { PredictObserveExplainModal } from '../common/PredictObserveExplainModal';
import { ExamPYQModal } from '../common/ExamPYQModal';
import { BreakTheMathModal } from '../common/BreakTheMathModal';
import { IntuitionSpeedDrillModal } from '../common/IntuitionSpeedDrillModal';
import { DerivationLadderModal } from '../common/DerivationLadderModal';
import { Class8OdysseyModal } from '../modals/Class8OdysseyModal';
import { SecretShortcutsModal } from '../modals/SecretShortcutsModal';
import { Class8BadgesModal } from '../modals/Class8BadgesModal';
import { ConceptLightningQuizModal } from '../modals/ConceptLightningQuizModal';
import { MobileToolsDrawerModal } from '../modals/MobileToolsDrawerModal';
import { MobileBottomNav } from './MobileBottomNav';
import { GlobalHeader } from './GlobalHeader';

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
  'binomial-galton': "Binomial Galton Board",
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

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { 
    currentRoute, 
    navigateTo, 
    completedSimulators,
    isZenMode,
    toggleZenMode,
    bottomSheetSnap,
    setBottomSheetSnap,
    activeSheetTab,
    setActiveSheetTab,
    setActiveGuideModal,
    setActiveMissionsModal,
    openPOEModal,
    openExamPYQModal,
    openStressTestModal,
    openSpeedDrillModal,
    openDerivationLadderModal,
    isLeftSidebarOpen,
    isRightSidebarOpen,
    isLeftSidebarWide,
    toggleLeftSidebar,
    toggleRightSidebar,
    isEli13Mode,
    toggleEli13Mode,
    setClass8OdysseyOpen,
    setSecretShortcutsOpen,
    setClass8BadgesOpen,
    openConceptQuizModal,
    setIsSearchModalOpen,
    setIsAuthorModalOpen,
  } = useSimulatorStore();

  const { totalXp, streakDays, checkDailyStreak } = useProgressStore();
  const { studentClassCode } = useClassStore();
  const currentRank = getCurrentRank(totalXp);

  const [showClassModal, setShowClassModal] = useState(false);
  const [isMobileToolsOpen, setIsMobileToolsOpen] = useState(false);

  const { isMuted, toggleMute, playClick } = useSound();
  const { lightTap } = useHaptics();
  const { isLowEnd, tier } = usePerformanceMode();

  // Check and update streak on load
  useEffect(() => {
    checkDailyStreak();
  }, [checkDailyStreak]);

  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

  // Monitor orientation changes for WebGL canvas recalculation
  useEffect(() => {
    const handleResize = () => {
      const isLandscape = window.innerWidth > window.innerHeight;
      setOrientation(isLandscape ? 'landscape' : 'portrait');
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  const navItems: { id: 'home' | SimulatorId; label: string; icon: LucideIcon }[] = [
    { id: 'home', label: 'Explore', icon: Compass },
    { id: 'drone-navigator', label: 'Class 9', icon: Navigation },
    { id: 'catapult-siege', label: 'Class 10', icon: Target },
    { id: 'conic-sections', label: 'Class 11', icon: Orbit },
    { id: 'vector-flight-lab', label: 'Class 12', icon: Boxes },
  ];

  const isSimulator = currentRoute !== 'home' && currentRoute !== 'landing' && currentRoute !== 'teacher';

  return (
    <div className={`min-h-screen ${isSimulator ? 'h-screen h-[100dvh] overflow-hidden' : ''} bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-cyan-500 selection:text-white`}>
      {/* Floating Zen Mode Exit Pill (When UI chrome is hidden) */}
      {isZenMode && (
        <button
          type="button"
          onClick={toggleZenMode}
          className="fixed top-2.5 right-2.5 z-50 px-3 py-1 rounded-full bg-slate-900/90 backdrop-blur-md border border-slate-700 text-cyan-300 text-[11px] font-semibold flex items-center gap-1.5 shadow-xl active:scale-95 transition-transform cursor-pointer"
          title="Exit Full-Screen Zen Mode"
        >
          <Minimize2 className="w-3.5 h-3.5 text-cyan-400" />
          <span>Exit Zen</span>
        </button>
      )}

      {/* World-Class Unified Header - 100% Identical & Consistent Across All Pages */}
      <GlobalHeader onOpenClassModal={() => setShowClassModal(true)} />

      {/* Gamification Dynamic XP Progression Bar (shown on Home & Overview only) */}
      {(currentRoute === 'home' || currentRoute === 'landing' || currentRoute === 'teacher') && (
        <XPBar />
      )}

      {/* Rare Achievement Unlocked Toast Banner */}
      <BadgeUnlockedToast />

      {/* Main Workspace Stage - On simulator screens: 3-column cockpit padding on desktop, 0 vertical scroll */}
      <main 
        className={`flex-1 flex flex-col relative w-full ${
          isSimulator 
            ? `h-full lg:h-[calc(100vh-3.5rem)] overflow-hidden pb-0 transition-[padding] duration-300 ease-in-out ${
                isLeftSidebarOpen && !isZenMode 
                  ? isLeftSidebarWide ? 'lg:pl-[440px] xl:pl-[500px]' : 'lg:pl-80 xl:pl-92' 
                  : 'lg:pl-0'
              } ${
                isRightSidebarOpen && !isZenMode ? 'lg:pr-84 xl:pr-[410px]' : 'lg:pr-0'
              }`
            : 'pb-24 lg:pb-0 overflow-x-hidden'
        }`}
      >
        <MathErrorBoundary key={currentRoute} simulatorId={currentRoute}>
          {children}
        </MathErrorBoundary>
      </main>

      {/* Mobile Fixed Bottom Navigation Bar - Only visible on Home/Landing/Teacher, NEVER during active simulator */}
      <MobileBottomNav />

      {/* Simulator Mobile Tools Drawer Action Sheet Modal */}
      <MobileToolsDrawerModal 
        isOpen={isMobileToolsOpen} 
        onClose={() => setIsMobileToolsOpen(false)} 
      />

      {/* Class Code Input Modal Dialog */}
      {showClassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md animate-scale-up">
            <ClassCodeInput onClose={() => setShowClassModal(false)} />
          </div>
        </div>
      )}

      {/* Priority 1 Pedagogy: Predict-Observe-Explain Modal */}
      <PredictObserveExplainModal />

      {/* Priority 1 Pedagogy: Real Past-Year Exam Questions Modal */}
      <ExamPYQModal />

      {/* Priority 2 Pedagogy: Break the Math / Extreme Degenerate Modes */}
      <BreakTheMathModal />

      {/* Priority 2 Pedagogy: 60-Second Rapid Intuition Drill */}
      <IntuitionSpeedDrillModal />

      {/* Priority 3 Pedagogy: Interactive Derivation Ladder Modal */}
      <DerivationLadderModal />

      {/* Class 8 Student Odyssey Hub Modal */}
      <Class8OdysseyModal />

      {/* Class 8 Topper's Secret Cheat-Sheet Modal */}
      <SecretShortcutsModal />

      {/* Class 8 Mastery Passport & Badges Modal */}
      <Class8BadgesModal />

      {/* 1-Minute Concept Lightning Quiz Modal */}
      <ConceptLightningQuizModal />

      {/* Educator Profile Modal (Alka Sharma / itsmathtime.co.in) */}
      <AuthorProfileModal />

      {/* Global Command Palette (⌘K) Search Modal */}
      <GlobalSearchModal />
    </div>
  );
};
