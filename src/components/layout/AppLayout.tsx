import React, { useEffect, useState, lazy, Suspense } from 'react';
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
import { useSimulatorStore } from '../../store/useSimulatorStore';
import { SimulatorId } from '../../types/simulators';
import { useSound } from '../common/SoundManager';
import { useHaptics } from '../../hooks/useHaptics';
import { usePerformanceMode } from '../../hooks/usePerformanceMode';
import { MathErrorBoundary } from '../common/MathErrorBoundary';
import { XPBar } from '../common/XPBar';
import { BadgeUnlockedToast } from '../common/BadgeUnlockedToast';
import { EurekaToast } from '../common/EurekaToast';
import { useProgressStore, getCurrentRank } from '../../store/useProgressStore';
import { ClassCodeInput } from '../common/ClassCodeInput';
import { useClassStore } from '../../store/useClassStore';
import { MobileBottomNav } from './MobileBottomNav';
import { GlobalHeader } from './GlobalHeader';
import { GlobalFooter } from './GlobalFooter';
import { trackPageView } from '../../utils/analytics';

// Lazy-load all on-demand modals to keep critical initial JavaScript bundle lightweight on mobile
const PredictObserveExplainModal = lazy(() => import('../common/PredictObserveExplainModal').then((m) => ({ default: m.PredictObserveExplainModal })));
const ExamPYQModal = lazy(() => import('../common/ExamPYQModal').then((m) => ({ default: m.ExamPYQModal })));
const BreakTheMathModal = lazy(() => import('../common/BreakTheMathModal').then((m) => ({ default: m.BreakTheMathModal })));
const IntuitionSpeedDrillModal = lazy(() => import('../common/IntuitionSpeedDrillModal').then((m) => ({ default: m.IntuitionSpeedDrillModal })));
const DerivationLadderModal = lazy(() => import('../common/DerivationLadderModal').then((m) => ({ default: m.DerivationLadderModal })));
const Class8OdysseyModal = lazy(() => import('../modals/Class8OdysseyModal').then((m) => ({ default: m.Class8OdysseyModal })));
const SecretShortcutsModal = lazy(() => import('../modals/SecretShortcutsModal').then((m) => ({ default: m.SecretShortcutsModal })));
const Class8BadgesModal = lazy(() => import('../modals/Class8BadgesModal').then((m) => ({ default: m.Class8BadgesModal })));
const ConceptLightningQuizModal = lazy(() => import('../modals/ConceptLightningQuizModal').then((m) => ({ default: m.ConceptLightningQuizModal })));
const MobileToolsDrawerModal = lazy(() => import('../modals/MobileToolsDrawerModal').then((m) => ({ default: m.MobileToolsDrawerModal })));
const AuthorProfileModal = lazy(() => import('../modals/AuthorProfileModal').then((m) => ({ default: m.AuthorProfileModal })));
const GlobalSearchModal = lazy(() => import('../common/GlobalSearchModal').then((m) => ({ default: m.GlobalSearchModal })));

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
    resetParams,
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
    isPOEModalOpen,
    isExamPYQModalOpen,
    isStressTestModalOpen,
    isSpeedDrillModalOpen,
    isDerivationLadderModalOpen,
    isClass8OdysseyOpen,
    isSecretShortcutsOpen,
    isClass8BadgesOpen,
    isConceptQuizOpen,
    isSearchModalOpen,
    isAuthorModalOpen,
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

  // Track Google Analytics page_view on every single page and simulator visit
  useEffect(() => {
    const pageTitle =
      SIMULATOR_TITLES[currentRoute]
        ? `${SIMULATOR_TITLES[currentRoute]} – Math Time Lab`
        : currentRoute === 'home'
        ? 'Math Time Lab – Home'
        : currentRoute === 'landing'
        ? 'Math Time Lab – Visual Overview'
        : currentRoute === 'teacher'
        ? 'Teacher Dashboard – Math Time Lab'
        : `Math Time Lab – ${currentRoute}`;
    const pagePath = `/${currentRoute === 'home' ? '' : currentRoute}`;
    trackPageView(pageTitle, pagePath);
  }, [currentRoute]);

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

  // Priority 10: Cinema Fullscreen keyboard [Esc] and API synchronization
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && isZenMode) {
        toggleZenMode();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isZenMode) {
        toggleZenMode();
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isZenMode, toggleZenMode]);

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
      {/* Priority 10: Cinema / Theater Mode Glassmorphic Cockpit Island */}
      {isZenMode && (
        <>
          {/* Ambient Dark Theater Edge Vignette */}
          <div className="pointer-events-none fixed inset-0 z-40 shadow-[inset_0_0_120px_rgba(0,0,0,0.85)]" />

          {/* Floating Glassmorphic Cinema Island */}
          <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-cyan-500/40 shadow-[0_10px_35px_rgba(0,0,0,0.6)] select-none">
            {/* Cinema Title & Status */}
            <div className="flex items-center gap-1.5 pr-2 border-r border-slate-700/60">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#38bdf8]" />
              <span className="text-[11px] font-mono font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                Cinema Mode
              </span>
            </div>

            {/* Simulator Title */}
            <span className="text-xs font-semibold text-slate-200 hidden sm:inline max-w-[200px] truncate">
              {SIMULATOR_TITLES[currentRoute] || 'Math Simulator'}
            </span>

            {/* Audio Toggle */}
            <button
              type="button"
              onClick={() => {
                lightTap();
                toggleMute();
              }}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
            </button>

            {/* Reset Simulator State */}
            {isSimulator && (
              <button
                type="button"
                onClick={() => {
                  lightTap();
                  playClick();
                  resetParams(currentRoute as SimulatorId);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                title="Reset Simulator Parameters"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              </button>
            )}

            {/* Exit Cinema Mode Button */}
            <button
              type="button"
              onClick={() => {
                lightTap();
                toggleZenMode();
              }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 text-cyan-200 text-xs font-bold transition shadow-sm cursor-pointer ml-1 active:scale-95"
              title="Exit Cinema Mode [Esc]"
            >
              <Minimize2 className="w-3.5 h-3.5" />
              <span>Exit</span>
              <kbd className="hidden md:inline px-1 py-0.2 rounded bg-slate-800 text-[9px] text-slate-400 border border-slate-700 ml-0.5">Esc</kbd>
            </button>
          </div>
        </>
      )}

      {/* World-Class Unified Header - 100% Identical & Consistent Across All Pages */}
      <GlobalHeader onOpenClassModal={() => setShowClassModal(true)} />

      {/* Gamification Dynamic XP Progression Bar (shown on Home & Overview only) */}
      {(currentRoute === 'home' || currentRoute === 'landing' || currentRoute === 'teacher') && (
        <XPBar />
      )}

      {/* Rare Achievement Unlocked Toast Banner */}
      <BadgeUnlockedToast />

      {/* Priority 9: Micro-Celebration Eureka Discovery Toast */}
      <EurekaToast />

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

      {/* World-Class Comprehensive Footer (Home, Overview, Teacher Pages) */}
      {!isSimulator && (
        <GlobalFooter onOpenAuthorModal={() => setIsAuthorModalOpen(true)} />
      )}

      {/* Mobile Fixed Bottom Navigation Bar - Only visible on Home/Landing/Teacher, NEVER during active simulator */}
      <MobileBottomNav />

      {/* Mobile & Desktop Modals: Lazy-loaded & strictly mounted on-demand to save mobile RAM */}
      <Suspense fallback={null}>
        {/* Simulator Mobile Tools Drawer Action Sheet Modal */}
        {isMobileToolsOpen && (
          <MobileToolsDrawerModal 
            isOpen={isMobileToolsOpen} 
            onClose={() => setIsMobileToolsOpen(false)} 
          />
        )}

        {/* Class Code Input Modal Dialog */}
        {showClassModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-md animate-scale-up">
              <ClassCodeInput onClose={() => setShowClassModal(false)} />
            </div>
          </div>
        )}

        {/* Priority 1 Pedagogy: Predict-Observe-Explain Modal */}
        {isPOEModalOpen && <PredictObserveExplainModal />}

        {/* Priority 1 Pedagogy: Real Past-Year Exam Questions Modal */}
        {isExamPYQModalOpen && <ExamPYQModal />}

        {/* Priority 2 Pedagogy: Break the Math / Extreme Degenerate Modes */}
        {isStressTestModalOpen && <BreakTheMathModal />}

        {/* Priority 2 Pedagogy: 60-Second Rapid Intuition Drill */}
        {isSpeedDrillModalOpen && <IntuitionSpeedDrillModal />}

        {/* Priority 3 Pedagogy: Interactive Derivation Ladder Modal */}
        {isDerivationLadderModalOpen && <DerivationLadderModal />}

        {/* Class 8 Student Odyssey Hub Modal */}
        {isClass8OdysseyOpen && <Class8OdysseyModal />}

        {/* Class 8 Topper's Secret Cheat-Sheet Modal */}
        {isSecretShortcutsOpen && <SecretShortcutsModal />}

        {/* Class 8 Mastery Passport & Badges Modal */}
        {isClass8BadgesOpen && <Class8BadgesModal />}

        {/* 1-Minute Concept Lightning Quiz Modal */}
        {isConceptQuizOpen && <ConceptLightningQuizModal />}

        {/* Educator Profile Modal (Alka Sharma / itsmathtime.co.in) */}
        {isAuthorModalOpen && <AuthorProfileModal />}

        {/* Global Command Palette (⌘K) Search Modal */}
        {isSearchModalOpen && <GlobalSearchModal />}
      </Suspense>
    </div>
  );
};
