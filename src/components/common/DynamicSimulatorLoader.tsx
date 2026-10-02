/**
 * DynamicSimulatorLoader: On-demand dynamic code-splitting loader for heavy 3D WebGL / 2D Canvas simulators.
 * Prevents bundling heavy physics and Three.js engines on initial page load.
 * Displays a fluid, math-themed mobile-friendly loading sequence.
 */
import React, { lazy, Suspense, useEffect, useState, useRef } from 'react';
import { Sparkles, Orbit, Compass, Activity, BrainCircuit } from 'lucide-react';
import { SimulatorId } from '../../types/simulators';
import { MathErrorBoundary } from './MathErrorBoundary';
import { useAnalytics } from '../../hooks/useAnalytics';
import { SimulatorInstructionBanner } from './SimulatorInstructionBanner';
import { SimulatorHoverInspector } from './SimulatorHoverInspector';
import { SimulatorStepWalkthrough } from './SimulatorStepWalkthrough';
import { UniversalGripAndMove } from './UniversalGripAndMove';
import { useSimulatorStore } from '../../store/useSimulatorStore';

// Lazy-loaded simulator chunks (code-split on demand with auto-retry)
function lazyWithRetry<T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
  retries = 2,
  interval = 350
): React.LazyExoticComponent<T> {
  return lazy(() =>
    new Promise<{ default: T }>((resolve, reject) => {
      const attempt = (remaining: number) => {
        factory()
          .then(resolve)
          .catch((err) => {
            if (remaining <= 0) {
              console.error('[DynamicSimulatorLoader] Failed to load simulator module after retries:', err);
              reject(err);
              return;
            }
            setTimeout(() => attempt(remaining - 1), interval);
          });
      };
      attempt(retries);
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

  useEffect(() => {
    const timer = setInterval(() => {
      setMsgIdx((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 1200);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full h-full min-h-[420px] flex flex-col items-center justify-center p-6 bg-slate-950 text-slate-100 select-none">
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
      <div className="w-48 h-1 bg-slate-900 rounded-full overflow-hidden mt-4 border border-slate-800">
        <div className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-amber-400 w-full animate-pulse" />
      </div>
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
        <Suspense fallback={<SimulatorLoadingFallback simulatorId={simulatorId} />}>
          {renderSimulator()}
        </Suspense>
      </div>
    </MathErrorBoundary>
  );
};
