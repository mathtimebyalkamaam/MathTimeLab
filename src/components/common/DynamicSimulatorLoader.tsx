/**
 * DynamicSimulatorLoader: On-demand dynamic code-splitting loader for heavy 3D WebGL / 2D Canvas simulators.
 * Prevents bundling heavy physics and Three.js engines on initial page load.
 * Displays a fluid, math-themed mobile-friendly loading sequence.
 */
import React, { lazy, Suspense, useEffect, useState, useRef } from 'react';
import { Sparkles, Orbit, Compass, Activity, BrainCircuit, RotateCcw } from 'lucide-react';
import { SimulatorId } from '../../types/simulators';
import { MathErrorBoundary } from './MathErrorBoundary';
import { useAnalytics } from '../../hooks/useAnalytics';
import { SimulatorInstructionBanner } from './SimulatorInstructionBanner';
import { SimulatorHoverInspector } from './SimulatorHoverInspector';
import { SimulatorStepWalkthrough } from './SimulatorStepWalkthrough';
import { UniversalGripAndMove } from './UniversalGripAndMove';
import { SimulatorMissionBar } from './SimulatorMissionBar';
import { GoldenTakeawayBanner } from './GoldenTakeawayBanner';
import { useSimulatorStore } from '../../store/useSimulatorStore';

// Pre-loadable simulator chunk factories for instant warm-caching & 0-latency loading
export const SIMULATOR_FACTORIES: Record<SimulatorId, () => Promise<any>> = {
  'drone-navigator': () => import('../simulators/DroneNavigator'),
  'catapult-siege': () => import('../simulators/CatapultSiege'),
  'conic-sections': () => import('../simulators/ConeSlicer'),
  'rollercoaster-architect': () => import('../simulators/RollercoasterArchitect'),
  'unit-circle': () => import('../simulators/UnitCircleSimulator'),
  'calculus-sandbox': () => import('../simulators/CalculusSandboxSimulator'),
  'vector-flight-lab': () => import('../simulators/VectorFlightLabSimulator'),
  'argand-plane': () => import('../simulators/ArgandPlanePlayground'),
  'matrix-meme': () => import('../simulators/MatrixMemeMachine'),
  'monty-hall': () => import('../simulators/MontyHallSimulator'),
  'quadratic-roots': () => import('../simulators/QuadraticRootsSimulator'),
  'circle-theorems': () => import('../simulators/CircleTheoremsSimulator'),
  'linear-systems': () => import('../simulators/LinearSystemsSimulator'),
  'trig-heights': () => import('../simulators/TrigHeightsSimulator'),
  'heron-triangles': () => import('../simulators/HeronTrianglesSimulator'),
  'polynomial-factorizer': () => import('../simulators/PolynomialFactorizerSimulator'),
  'lines-angles': () => import('../simulators/LinesAnglesSimulator'),
  'binomial-galton': () => import('../simulators/BinomialGaltonSimulator'),
  'arithmetic-geometric-explorer': () => import('../simulators/SequenceExplorerSimulator'),
  'hyperbola-ellipse-orbits': () => import('../simulators/ConicFocalSimulator'),
  'surface-area-volumes': () => import('../simulators/SurfaceAreaVolumesSimulator'),
  'circle-chords-cyclic': () => import('../simulators/CircleChordsCyclicSimulator'),
  'statistics-visualizer': () => import('../simulators/StatisticsVisualizerSimulator'),
  'limits-derivatives-lab': () => import('../simulators/LimitsDerivativesSimulator'),
  'linear-inequalities': () => import('../simulators/LinearInequalitiesSimulator'),
  'permutations-combinations': () => import('../simulators/PermutationsCombinationsSimulator'),
  'similar-triangles': () => import('../simulators/SimilarTrianglesSimulator'),
  'ftc-integral-accumulator': () => import('../simulators/FTCIntegralSimulator'),
  'bayes-probability-lab': () => import('../simulators/BayesProbabilitySimulator'),
  'euclidean-geometry-sandbox': () => import('../simulators/EuclideanGeometrySimulator'),
  'three-d-geometry-lab': () => import('../simulators/ThreeDGeometrySimulator'),
  'differential-equations-lab': () => import('../simulators/DifferentialEquationsSimulator'),
  'balance-scale-equations': () => import('../simulators/BalanceScaleSimulator'),
  'algebraic-identities-tiles': () => import('../simulators/AlgebraicTilesSimulator'),
  'compound-interest-engine': () => import('../simulators/CompoundInterestSimulator'),
  'quadrilateral-morpher': () => import('../simulators/QuadrilateralMorpherSimulator'),
  'euler-polyhedra-3d': () => import('../simulators/EulerPolyhedraSimulator'),
  'direct-inverse-proportions': () => import('../simulators/DirectInverseSimulator'),
  'dynamic-pie-chart': () => import('../simulators/DynamicPieChartSimulator'),
  'square-roots-triplets': () => import('../simulators/SquareRootsTripletsSimulator'),
  'exponents-powers-lab': () => import('../simulators/ExponentsPowersSimulator'),
  'rational-numbers-density': () => import('../simulators/RationalNumbersDensitySimulator'),
  'triangle-congruence-forge': () => import('../simulators/TriangleCongruenceForgeSimulator'),
  'arithmetic-progression-lab': () => import('../simulators/ArithmeticProgressionSimulator'),
  'coordinate-section-formula': () => import('../simulators/CoordinateSectionSimulator'),
  'circle-tangents-lab': () => import('../simulators/CircleTangentsSimulator'),
  'mathematical-induction-dominos': () => import('../simulators/MathematicalInductionSimulator'),
  'trig-equations-radial': () => import('../simulators/TrigEquationsRadialSimulator'),
  'linear-programming-lab': () => import('../simulators/LinearProgrammingSimulator'),
  'probability-distribution-lab': () => import('../simulators/ProbabilityDistributionSimulator'),
};

const prefetchedSims = new Set<string>();

/**
 * Prefetch a simulator chunk in the background so it opens instantly (0ms latency) when clicked.
 */
export const prefetchSimulator = (simulatorId: SimulatorId) => {
  if (prefetchedSims.has(simulatorId)) return;
  const factory = SIMULATOR_FACTORIES[simulatorId];
  if (factory) {
    prefetchedSims.add(simulatorId);
    factory().catch(() => {
      prefetchedSims.delete(simulatorId);
    });
  }
};

if (typeof window !== 'undefined') {
  (window as any).__mathPrefetchSimulator = prefetchSimulator;
}

/**
 * Prefetch flagship popular simulators during browser idle time on the home page.
 */
export const prefetchPopularSimulators = () => {
  const flagship: SimulatorId[] = [
    'catapult-siege',
    'conic-sections',
    'drone-navigator',
    'unit-circle',
    'quadratic-roots',
    'calculus-sandbox',
    'vector-flight-lab',
  ];
  flagship.forEach((id, index) => {
    setTimeout(() => {
      prefetchSimulator(id);
    }, 500 + index * 300);
  });
};

// Lazy-loaded simulator chunks with exponential backoff & post-deployment recovery
function lazyWithRetry<T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
  simulatorId?: SimulatorId
): React.LazyExoticComponent<T> {
  return lazy(() =>
    new Promise<{ default: T }>((resolve, reject) => {
      const delays = [800, 2000, 4000];
      const attempt = (retryIndex: number) => {
        factory()
          .then((comp) => {
            if (typeof window !== 'undefined' && simulatorId) {
              try {
                sessionStorage.removeItem(`math_chunk_retry_${simulatorId}`);
              } catch {}
            }
            resolve(comp);
          })
          .catch((err) => {
            const msg = (err?.message || '').toLowerCase();
            const isChunkOrNetworkError =
              msg.includes('dynamically imported module') ||
              msg.includes('failed to fetch') ||
              msg.includes('loading chunk') ||
              msg.includes('chunkloaderror') ||
              msg.includes('importing a module script failed') ||
              msg.includes('networkerror');

            if (retryIndex >= delays.length) {
              console.error(`[DynamicSimulatorLoader] Failed to load simulator ${simulatorId || ''} after all retries:`, err);
              // Transparent auto-refresh once if a new build deployment changed chunk file hashes
              if (isChunkOrNetworkError && typeof window !== 'undefined' && simulatorId) {
                const reloadKey = `math_chunk_retry_${simulatorId}`;
                const hasReloaded = sessionStorage.getItem(reloadKey);
                if (!hasReloaded) {
                  console.info(`[DynamicSimulatorLoader] Auto-reloading to synchronize latest chunks for ${simulatorId}...`);
                  sessionStorage.setItem(reloadKey, 'true');
                  window.location.reload();
                  return;
                }
              }
              reject(err);
              return;
            }

            const delay = delays[retryIndex];
            console.warn(`[DynamicSimulatorLoader] Retrying ${simulatorId || 'module'} (attempt ${retryIndex + 1}/${delays.length}) in ${delay}ms...`);
            setTimeout(() => attempt(retryIndex + 1), delay);
          });
      };
      attempt(0);
    })
  );
}

const DroneNavigator = lazyWithRetry(() =>
  import('../simulators/DroneNavigator').then((m) => ({ default: m.DroneNavigator }))
);
const CatapultSiege = lazyWithRetry(() =>
  import('../simulators/CatapultSiege').then((m) => ({ default: m.CatapultSiege }))
);
const ConeSlicer = lazyWithRetry(() =>
  import('../simulators/ConeSlicer').then((m) => ({ default: m.ConeSlicer }))
);
const RollercoasterArchitect = lazyWithRetry(() =>
  import('../simulators/RollercoasterArchitect').then((m) => ({ default: m.RollercoasterArchitect }))
);
const UnitCircleSimulator = lazyWithRetry(() =>
  import('../simulators/UnitCircleSimulator').then((m) => ({ default: m.UnitCircleSimulator }))
);
const CalculusSandboxSimulator = lazyWithRetry(() =>
  import('../simulators/CalculusSandboxSimulator').then((m) => ({ default: m.CalculusSandboxSimulator }))
);
const VectorFlightLabSimulator = lazyWithRetry(() =>
  import('../simulators/VectorFlightLabSimulator').then((m) => ({ default: m.VectorFlightLabSimulator }))
);
const ArgandPlanePlayground = lazyWithRetry(() =>
  import('../simulators/ArgandPlanePlayground').then((m) => ({ default: m.ArgandPlanePlayground }))
);
const MatrixMemeMachine = lazyWithRetry(() =>
  import('../simulators/MatrixMemeMachine').then((m) => ({ default: m.MatrixMemeMachine }))
);
const MontyHallSimulator = lazyWithRetry(() =>
  import('../simulators/MontyHallSimulator').then((m) => ({ default: m.MontyHallSimulator }))
);
const QuadraticRootsSimulator = lazyWithRetry(() =>
  import('../simulators/QuadraticRootsSimulator').then((m) => ({ default: m.QuadraticRootsSimulator }))
);
const CircleTheoremsSimulator = lazyWithRetry(() =>
  import('../simulators/CircleTheoremsSimulator').then((m) => ({ default: m.CircleTheoremsSimulator }))
);
const LinearSystemsSimulator = lazyWithRetry(() =>
  import('../simulators/LinearSystemsSimulator').then((m) => ({ default: m.LinearSystemsSimulator }))
);
const TrigHeightsSimulator = lazyWithRetry(() =>
  import('../simulators/TrigHeightsSimulator').then((m) => ({ default: m.TrigHeightsSimulator }))
);
const HeronTrianglesSimulator = lazyWithRetry(() =>
  import('../simulators/HeronTrianglesSimulator').then((m) => ({ default: m.HeronTrianglesSimulator }))
);
const PolynomialFactorizerSimulator = lazyWithRetry(() =>
  import('../simulators/PolynomialFactorizerSimulator').then((m) => ({ default: m.PolynomialFactorizerSimulator }))
);
const LinesAnglesSimulator = lazyWithRetry(() =>
  import('../simulators/LinesAnglesSimulator').then((m) => ({ default: m.LinesAnglesSimulator }))
);
const BinomialGaltonSimulator = lazyWithRetry(() =>
  import('../simulators/BinomialGaltonSimulator').then((m) => ({ default: m.BinomialGaltonSimulator }))
);
const SequenceExplorerSimulator = lazyWithRetry(() =>
  import('../simulators/SequenceExplorerSimulator').then((m) => ({ default: m.SequenceExplorerSimulator }))
);
const ConicFocalSimulator = lazyWithRetry(() =>
  import('../simulators/ConicFocalSimulator').then((m) => ({ default: m.ConicFocalSimulator }))
);
const SurfaceAreaVolumesSimulator = lazyWithRetry(() =>
  import('../simulators/SurfaceAreaVolumesSimulator').then((m) => ({ default: m.SurfaceAreaVolumesSimulator }))
);
const CircleChordsCyclicSimulator = lazyWithRetry(() =>
  import('../simulators/CircleChordsCyclicSimulator').then((m) => ({ default: m.CircleChordsCyclicSimulator }))
);
const StatisticsVisualizerSimulator = lazyWithRetry(() =>
  import('../simulators/StatisticsVisualizerSimulator').then((m) => ({ default: m.StatisticsVisualizerSimulator }))
);
const LimitsDerivativesSimulator = lazyWithRetry(() =>
  import('../simulators/LimitsDerivativesSimulator').then((m) => ({ default: m.LimitsDerivativesSimulator }))
);
const LinearInequalitiesSimulator = lazyWithRetry(() =>
  import('../simulators/LinearInequalitiesSimulator').then((m) => ({ default: m.LinearInequalitiesSimulator }))
);
const PermutationsCombinationsSimulator = lazyWithRetry(() =>
  import('../simulators/PermutationsCombinationsSimulator').then((m) => ({ default: m.PermutationsCombinationsSimulator }))
);
const SimilarTrianglesSimulator = lazyWithRetry(() =>
  import('../simulators/SimilarTrianglesSimulator').then((m) => ({ default: m.SimilarTrianglesSimulator }))
);
const FTCIntegralSimulator = lazyWithRetry(() =>
  import('../simulators/FTCIntegralSimulator').then((m) => ({ default: m.FTCIntegralSimulator }))
);
const BayesProbabilitySimulator = lazyWithRetry(() =>
  import('../simulators/BayesProbabilitySimulator').then((m) => ({ default: m.BayesProbabilitySimulator }))
);
const EuclideanGeometrySimulator = lazyWithRetry(() =>
  import('../simulators/EuclideanGeometrySimulator').then((m) => ({ default: m.EuclideanGeometrySimulator }))
);
const ThreeDGeometrySimulator = lazyWithRetry(() =>
  import('../simulators/ThreeDGeometrySimulator').then((m) => ({ default: m.ThreeDGeometrySimulator }))
);
const DifferentialEquationsSimulator = lazyWithRetry(() =>
  import('../simulators/DifferentialEquationsSimulator').then((m) => ({ default: m.DifferentialEquationsSimulator }))
);
const BalanceScaleSimulator = lazyWithRetry(() =>
  import('../simulators/BalanceScaleSimulator').then((m) => ({ default: m.BalanceScaleSimulator }))
);
const AlgebraicTilesSimulator = lazyWithRetry(() =>
  import('../simulators/AlgebraicTilesSimulator').then((m) => ({ default: m.AlgebraicTilesSimulator }))
);
const CompoundInterestSimulator = lazyWithRetry(() =>
  import('../simulators/CompoundInterestSimulator').then((m) => ({ default: m.CompoundInterestSimulator }))
);
const QuadrilateralMorpherSimulator = lazyWithRetry(() =>
  import('../simulators/QuadrilateralMorpherSimulator').then((m) => ({ default: m.QuadrilateralMorpherSimulator }))
);
const EulerPolyhedraSimulator = lazyWithRetry(() =>
  import('../simulators/EulerPolyhedraSimulator').then((m) => ({ default: m.EulerPolyhedraSimulator }))
);
const DirectInverseSimulator = lazyWithRetry(() =>
  import('../simulators/DirectInverseSimulator').then((m) => ({ default: m.DirectInverseSimulator }))
);
const DynamicPieChartSimulator = lazyWithRetry(() =>
  import('../simulators/DynamicPieChartSimulator').then((m) => ({ default: m.DynamicPieChartSimulator }))
);
const SquareRootsTripletsSimulator = lazyWithRetry(() =>
  import('../simulators/SquareRootsTripletsSimulator').then((m) => ({ default: m.SquareRootsTripletsSimulator }))
);
const ExponentsPowersSimulator = lazyWithRetry(() =>
  import('../simulators/ExponentsPowersSimulator').then((m) => ({ default: m.ExponentsPowersSimulator }))
);
const RationalNumbersDensitySimulator = lazyWithRetry(() =>
  import('../simulators/RationalNumbersDensitySimulator').then((m) => ({ default: m.RationalNumbersDensitySimulator }))
);
const TriangleCongruenceForgeSimulator = lazyWithRetry(() =>
  import('../simulators/TriangleCongruenceForgeSimulator').then((m) => ({ default: m.TriangleCongruenceForgeSimulator }))
);
const ArithmeticProgressionSimulator = lazyWithRetry(() =>
  import('../simulators/ArithmeticProgressionSimulator').then((m) => ({ default: m.ArithmeticProgressionSimulator }))
);
const CoordinateSectionSimulator = lazyWithRetry(() =>
  import('../simulators/CoordinateSectionSimulator').then((m) => ({ default: m.CoordinateSectionSimulator }))
);
const CircleTangentsSimulator = lazyWithRetry(() =>
  import('../simulators/CircleTangentsSimulator').then((m) => ({ default: m.CircleTangentsSimulator }))
);
const MathematicalInductionSimulator = lazyWithRetry(() =>
  import('../simulators/MathematicalInductionSimulator').then((m) => ({ default: m.MathematicalInductionSimulator }))
);
const TrigEquationsRadialSimulator = lazyWithRetry(() =>
  import('../simulators/TrigEquationsRadialSimulator').then((m) => ({ default: m.TrigEquationsRadialSimulator }))
);
const LinearProgrammingSimulator = lazyWithRetry(() =>
  import('../simulators/LinearProgrammingSimulator').then((m) => ({ default: m.LinearProgrammingSimulator }))
);
const ProbabilityDistributionSimulator = lazyWithRetry(() =>
  import('../simulators/ProbabilityDistributionSimulator').then((m) => ({ default: m.ProbabilityDistributionSimulator }))
);

const LOADING_MESSAGES = [
  'Calculating trajectories & vectors...',
  'Compiling WebGL shaders & light buffers...',
  'Solving differential curvature equations...',
  'Calibrating Cartesian coordinate matrix...',
  'Sampling Riemann sum trapezoids...',
  'Verifying trigonometric identities (sin²θ + cos²θ = 1)...',
];

interface DynamicSimulatorLoaderProps {
  simulatorId: SimulatorId;
}

export const SimulatorLoadingFallback: React.FC<{ simulatorId?: SimulatorId }> = () => {
  const [msgIdx, setMsgIdx] = useState(0);
  const [showSlowNotice, setShowSlowNotice] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setMsgIdx((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 1200);

    const slowTimer = setTimeout(() => {
      setShowSlowNotice(true);
    }, 3800);

    return () => {
      clearInterval(timer);
      clearTimeout(slowTimer);
    };
  }, []);

  const handleForceReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  return (
    <div className="w-full h-full min-h-[360px] flex-1 flex flex-col items-center justify-center p-6 bg-slate-950 text-slate-100 select-none">
      <div className="relative flex items-center justify-center mb-6">
        {/* Outer glowing pulsing ring */}
        <div className="w-20 h-20 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin" />
        
        {/* Inner reverse spin ring */}
        <div className="absolute w-14 h-14 rounded-full border-2 border-amber-500/20 border-b-amber-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.4s' }} />

        {/* Central Core Icon */}
        <div className="absolute w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-cyan-400">
          <Orbit className="w-4 h-4 animate-pulse text-cyan-300" />
        </div>
      </div>

      {/* Math-themed rotating message */}
      <div className="text-center space-y-1.5 max-w-xs">
        <h4 className="text-sm font-bold text-white tracking-wide flex items-center justify-center gap-1.5">
          <BrainCircuit className="w-4 h-4 text-cyan-400" />
          <span>Initializing Physics Lab</span>
        </h4>
        <p className="text-xs text-slate-400 font-mono min-h-[36px] transition-all duration-300">
          {LOADING_MESSAGES[msgIdx]}
        </p>
      </div>

      {/* Progress tick bar */}
      <div className="w-52 h-1 bg-slate-900 rounded-full overflow-hidden mt-4 border border-slate-800">
        <div className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-amber-400 w-full animate-pulse" />
      </div>

      {/* Slow network recovery helper */}
      {showSlowNotice && (
        <div className="mt-4 flex flex-col items-center gap-2">
          <span className="text-[11px] text-slate-500 font-mono">
            Optimizing 3D physics shaders & WebGL buffers...
          </span>
          <button
            type="button"
            onClick={handleForceReload}
            className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-700 hover:border-cyan-500/40 text-[11px] text-cyan-300 font-medium flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3 h-3 text-cyan-400" />
            <span>Taking longer than usual? Tap to reconnect</span>
          </button>
        </div>
      )}
    </div>
  );
};

export const DynamicSimulatorLoader: React.FC<DynamicSimulatorLoaderProps> = ({ simulatorId }) => {
  const { trackSimulatorStart } = useAnalytics();
  const { setBottomSheetSnap, setActiveSheetTab } = useSimulatorStore();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    trackSimulatorStart(simulatorId, {
      screenResolution: `${window.innerWidth}x${window.innerHeight}`,
      userAgent: navigator.userAgent,
    });
  }, [simulatorId, trackSimulatorStart]);

  const handleOpenControls = () => {
    setActiveSheetTab('controls');
    setBottomSheetSnap('half');
  };

  const handleOpenChallenges = () => {
    setActiveSheetTab('mission');
    setBottomSheetSnap('half');
  };

  const renderSimulator = () => {
    switch (simulatorId) {
      case 'drone-navigator':
        return <DroneNavigator />;
      case 'catapult-siege':
        return <CatapultSiege />;
      case 'conic-sections':
        return <ConeSlicer />;
      case 'rollercoaster-architect':
        return <RollercoasterArchitect />;
      case 'unit-circle':
        return <UnitCircleSimulator />;
      case 'calculus-sandbox':
        return <CalculusSandboxSimulator />;
      case 'vector-flight-lab':
        return <VectorFlightLabSimulator />;
      case 'argand-plane':
        return <ArgandPlanePlayground />;
      case 'matrix-meme':
        return <MatrixMemeMachine />;
      case 'monty-hall':
        return <MontyHallSimulator />;
      case 'quadratic-roots':
        return <QuadraticRootsSimulator />;
      case 'circle-theorems':
        return <CircleTheoremsSimulator />;
      case 'linear-systems':
        return <LinearSystemsSimulator />;
      case 'trig-heights':
        return <TrigHeightsSimulator />;
      case 'heron-triangles':
        return <HeronTrianglesSimulator />;
      case 'polynomial-factorizer':
        return <PolynomialFactorizerSimulator />;
      case 'lines-angles':
        return <LinesAnglesSimulator />;
      case 'binomial-galton':
        return <BinomialGaltonSimulator />;
      case 'arithmetic-geometric-explorer':
        return <SequenceExplorerSimulator />;
      case 'hyperbola-ellipse-orbits':
        return <ConicFocalSimulator />;
      case 'surface-area-volumes':
        return <SurfaceAreaVolumesSimulator />;
      case 'circle-chords-cyclic':
        return <CircleChordsCyclicSimulator />;
      case 'statistics-visualizer':
        return <StatisticsVisualizerSimulator />;
      case 'limits-derivatives-lab':
        return <LimitsDerivativesSimulator />;
      case 'linear-inequalities':
        return <LinearInequalitiesSimulator />;
      case 'permutations-combinations':
        return <PermutationsCombinationsSimulator />;
      case 'similar-triangles':
        return <SimilarTrianglesSimulator />;
      case 'ftc-integral-accumulator':
        return <FTCIntegralSimulator />;
      case 'bayes-probability-lab':
        return <BayesProbabilitySimulator />;
      case 'euclidean-geometry-sandbox':
        return <EuclideanGeometrySimulator />;
      case 'three-d-geometry-lab':
        return <ThreeDGeometrySimulator />;
      case 'differential-equations-lab':
        return <DifferentialEquationsSimulator />;
      case 'balance-scale-equations':
        return <BalanceScaleSimulator />;
      case 'algebraic-identities-tiles':
        return <AlgebraicTilesSimulator />;
      case 'compound-interest-engine':
        return <CompoundInterestSimulator />;
      case 'quadrilateral-morpher':
        return <QuadrilateralMorpherSimulator />;
      case 'euler-polyhedra-3d':
        return <EulerPolyhedraSimulator />;
      case 'direct-inverse-proportions':
        return <DirectInverseSimulator />;
      case 'dynamic-pie-chart':
        return <DynamicPieChartSimulator />;
      case 'square-roots-triplets':
        return <SquareRootsTripletsSimulator />;
      case 'exponents-powers-lab':
        return <ExponentsPowersSimulator />;
      case 'rational-numbers-density':
        return <RationalNumbersDensitySimulator />;
      case 'triangle-congruence-forge':
        return <TriangleCongruenceForgeSimulator />;
      case 'arithmetic-progression-lab':
        return <ArithmeticProgressionSimulator />;
      case 'coordinate-section-formula':
        return <CoordinateSectionSimulator />;
      case 'circle-tangents-lab':
        return <CircleTangentsSimulator />;
      case 'mathematical-induction-dominos':
        return <MathematicalInductionSimulator />;
      case 'trig-equations-radial':
        return <TrigEquationsRadialSimulator />;
      case 'linear-programming-lab':
        return <LinearProgrammingSimulator />;
      case 'probability-distribution-lab':
        return <ProbabilityDistributionSimulator />;
      default:
        return <div>Simulator not found.</div>;
    }
  };

  return (
    <MathErrorBoundary key={simulatorId} simulatorId={simulatorId}>
      <div ref={containerRef} className="relative w-full h-full flex-1 flex flex-col overflow-hidden">
        {/* Phase 2: Top Guided Mission Ribbon, NCERT Tag, Reset Button & Pulsing Touch Hint */}
        <SimulatorMissionBar simulatorId={simulatorId} />

        <SimulatorInstructionBanner
          simulatorId={simulatorId}
          onOpenControls={handleOpenControls}
          onOpenChallenges={handleOpenChallenges}
        />
        {/* Universal Grip & Move Image Controller for all 50 simulators */}
        <UniversalGripAndMove
          containerRef={containerRef}
          simulatorId={simulatorId}
        />
        {/* Live Cursor Hover Math Inspector Overlay */}
        <SimulatorHoverInspector
          simulatorId={simulatorId}
          containerRef={containerRef}
        />
        {/* On-Canvas Interactive 4-Step Guided Walkthrough */}
        <SimulatorStepWalkthrough
          simulatorId={simulatorId}
          onOpenControls={handleOpenControls}
          onOpenChallenges={handleOpenChallenges}
        />
        {/* Dedicated Isolated Flex-1 Stage for Canvas / Three.js WebGL viewport */}
        <main className="relative flex-1 w-full min-h-0 overflow-hidden flex flex-col">
          <Suspense fallback={<SimulatorLoadingFallback simulatorId={simulatorId} />}>
            {renderSimulator()}
          </Suspense>
        </main>

        {/* Phase 3: Persistent 1-Sentence Golden Takeaway, Teacher Audio & PYQ Check */}
        <GoldenTakeawayBanner simulatorId={simulatorId} />
      </div>
    </MathErrorBoundary>
  );
};
