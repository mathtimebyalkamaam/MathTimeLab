import React from 'react';
import { 
  Flame, 
  X, 
  Sparkles, 
  ArrowRight, 
  AlertTriangle, 
  Zap, 
  Trophy,
  RotateCcw,
  Sliders
} from 'lucide-react';
import { useSimulatorStore } from '../../store/useSimulatorStore';
import { SIMULATORS } from '../../data/simulators';
import { BlockMath, InlineMath } from './MathFormula';
import { useHaptics } from '../../hooks/useHaptics';
import { useSound } from './SoundManager';
import { StressTestCase } from '../../types/simulators';

export const BreakTheMathModal: React.FC = () => {
  const { 
    isStressTestModalOpen, 
    closeStressTestModal, 
    activeSimulatorId, 
    currentRoute,
    // Simulator parameter updaters
    updateLimitsDerivativesParams,
    updateStatisticsParams,
    updateSurfaceAreaParams,
    updateCircleChordsParams,
    updateLinearInequalitiesParams,
    updatePermutationsCombinationsParams,
    updateHeronParams,
    updateDroneParams,
    updateUnitCircleParams,
    updateConicParams,
  } = useSimulatorStore();

  const { lightTap, successBuzz, errorBuzz } = useHaptics();
  const { playClick, playChime } = useSound();

  const currentSimId = activeSimulatorId || (currentRoute !== 'home' && currentRoute !== 'landing' && currentRoute !== 'teacher' ? currentRoute : null);
  const metadata = SIMULATORS.find((s) => s.id === currentSimId);

  if (!isStressTestModalOpen || !metadata) return null;

  // Curated stress-test degenerate cases per simulator
  const getStressTestsForSimulator = (): StressTestCase[] => {
    if (metadata.stressTests && metadata.stressTests.length > 0) {
      return metadata.stressTests;
    }

    if (metadata.id === 'limits-derivatives-lab') {
      return [
        {
          id: 'stress_limits_zero_h',
          title: 'The 0/0 Black Hole (Exact h = 0)',
          badge: 'Singularity',
          description: 'Try forcing step size h to exactly 0.0000. In pure arithmetic, (f(x+0) - f(x))/0 produces 0/0, an undefined indeterminate form where computers crash.',
          boundaryCondition: 'h = 0 \\implies m = \\frac{0}{0}',
          whyItMatters: 'Calculus was invented by Newton & Leibniz specifically to navigate around this 0/0 black hole without actually dividing by zero.',
          examRelevance: 'Examiners design limits with removable discontinuities to test if students cancel factors before evaluating.',
          presetActionType: 'limits_h_zero',
        },
        {
          id: 'stress_limits_reciprocal_zero',
          title: 'The Infinite Cliff: f(x) = 1/x at x → 0',
          badge: 'Essential Asymptote',
          description: 'Evaluate f(x) = 1/x near x = 0. Coming from the right gives +∞; coming from the left gives -∞. The two sides violently disagree!',
          boundaryCondition: '\\lim_{x \\to 0^+} \\frac{1}{x} = +\\infty \\neq -\\infty = \\lim_{x \\to 0^-} \\frac{1}{x}',
          whyItMatters: 'Proves that if Left-Hand Limit (LHL) ≠ Right-Hand Limit (RHL), the general limit DOES NOT EXIST (DNE).',
          examRelevance: 'Very common in JEE Main to test piecewise continuity and non-differentiable sharp cusps.',
          presetActionType: 'limits_reciprocal_zero',
        },
      ];
    }

    if (metadata.id === 'surface-area-volumes') {
      return [
        {
          id: 'stress_cone_zero_height',
          title: 'The 2D Disc Collapse (Height h = 0)',
          badge: 'Dimension Collapse',
          description: 'Squash the cone until vertical height h = 0. Slant height l collapses to exactly the base radius r (l = r). The curved surface net becomes a flat 2D disc with zero volume.',
          boundaryCondition: 'h = 0 \\implies l = \\sqrt{r^2 + 0^2} = r, \\quad \\text{Vol} = 0',
          whyItMatters: 'Demonstrates dimensional transition: a 3D solid degenerates into a 2D surface of area πr² when its orthogonal height vanishes.',
          examRelevance: 'Helps students understand why cone CSA = πrl converges to the circle area πr² as the apex flattens.',
          presetActionType: 'cone_zero_h',
        },
        {
          id: 'stress_cylinder_infinite_radius',
          title: 'The Infinite Wall (r >> h)',
          badge: 'Scale Inversion',
          description: 'Expand the radius to maximum while height is minimal. Curved surface area dominates volume completely.',
          boundaryCondition: 'r \\gg h \\implies \\frac{\\text{CSA}}{\\text{Base Area}} \\to 0',
          whyItMatters: 'Shows why coin and pancake shapes have negligible side areas compared to their top and bottom circular faces.',
          examRelevance: 'Class 9 NCERT Exemplar problems on surface area ratios of coins and thin cylinders.',
          presetActionType: 'cylinder_disc',
        },
      ];
    }

    if (metadata.id === 'circle-chords-cyclic') {
      return [
        {
          id: 'stress_chord_tangent_collapse',
          title: 'The Zero-Length Tangent Chord (d = R)',
          badge: 'Tangency Limit',
          description: 'Push the chord distance d until it equals circle radius R. The right triangle leg L/2 collapses to 0. The chord becomes a single tangent point!',
          boundaryCondition: 'd = R \\implies L = 2\\sqrt{R^2 - R^2} = 0',
          whyItMatters: 'Proves that a tangent line is simply the limiting case of a chord whose two intersection points have coalesced into one.',
          examRelevance: 'Class 10 Circle Tangent Theorem foundation (radius to tangent is perpendicular).',
          presetActionType: 'chord_tangent',
        },
        {
          id: 'stress_chord_max_diameter',
          title: 'The Longest Chord Invariant (d = 0)',
          badge: 'Maximum Extrema',
          description: 'Move the chord through the center O (distance d = 0). The chord achieves its absolute maximum possible length: 2R (the circle diameter).',
          boundaryCondition: 'd = 0 \\implies L = 2\\sqrt{R^2 - 0} = 2R',
          whyItMatters: 'Confirms that the diameter is the unique chord of maximum length in any circle.',
          examRelevance: 'Multiple-choice and 1-mark assertion-reason questions in CBSE board exams.',
          presetActionType: 'chord_diameter',
        },
      ];
    }

    if (metadata.id === 'linear-inequalities') {
      return [
        {
          id: 'stress_ineq_parallel_no_feasible',
          title: 'The Parallel Contradiction (Empty Feasible Set)',
          badge: 'Inconsistent System',
          description: 'Consider x + y ≤ 2 and x + y ≥ 8. The boundary lines are parallel (slope = -1). Their half-planes face in opposite directions with zero overlap!',
          boundaryCondition: '\\mathcal{F} = \\emptyset \\; (\\text{Empty Feasible Region})',
          whyItMatters: 'In Linear Programming, if constraints contradict each other, NO optimal solution can ever exist.',
          examRelevance: 'A favorite trick question in Class 12 Boards and JEE Main where students waste 15 minutes calculating fictitious corners.',
          presetActionType: 'ineq_empty',
        },
      ];
    }

    if (metadata.id === 'statistics-visualizer') {
      return [
        {
          id: 'stress_stats_outlier_blackhole',
          title: 'The 100x Outlier Tug-of-War',
          badge: 'Sensitivity Collapse',
          description: 'Drag one single data point out to x = 30 while all other points remain clustered at x = 2. The Mean gets pulled across the beam, while the Median refuses to budge!',
          boundaryCondition: '\\bar{x} \\to \\infty \\quad \\text{while} \\quad M = \\text{constant}',
          whyItMatters: 'Demonstrates why the Mean is fragile to extreme outliers while the Median is statistically robust.',
          examRelevance: 'Frequently asked in Class 9 & 11 Statistics tests on choosing appropriate measures of central tendency.',
          presetActionType: 'stats_extreme_outlier',
        },
      ];
    }

    // Default fallback stress test for any module
    return [
      {
        id: 'stress_default_degeneracy',
        title: 'Boundary Invariant Stress Test',
        badge: 'Boundary Case',
        description: 'Drive the parameters to their extreme zero or maximum limits to watch how standard formulas collapse to simpler geometric invariants.',
        boundaryCondition: 'x \\to 0 \\; \\text{or} \\; x \\to \\max',
        whyItMatters: 'Extreme case analysis is the primary method physicists and mathematicians use to sanity-check complex equations.',
        examRelevance: 'Crucial for verifying multiple-choice answers by setting variables to 0 or 1.',
        presetActionType: 'generic_extreme',
      },
    ];
  };

  const stressTests = getStressTestsForSimulator();

  const handleApplyStressTest = (test: StressTestCase) => {
    lightTap();
    playClick();
    successBuzz();

    // Trigger simulator presets for specific boundary cases
    if (metadata.id === 'limits-derivatives-lab') {
      if (test.presetActionType === 'limits_h_zero') {
        updateLimitsDerivativesParams({
          hStep: 0.001,
          isApproachingZero: true,
          showSecantLine: true,
        });
      } else if (test.presetActionType === 'limits_reciprocal_zero') {
        updateLimitsDerivativesParams({
          functionType: 'reciprocal',
          x0: 0.2,
          hStep: 0.1,
        });
      }
    } else if (metadata.id === 'surface-area-volumes') {
      if (test.presetActionType === 'cone_zero_h') {
        updateSurfaceAreaParams({
          solidType: 'cone',
          height: 0.5,
          radius: 5,
          unfoldPercent: 0,
        });
      } else if (test.presetActionType === 'cylinder_disc') {
        updateSurfaceAreaParams({
          solidType: 'cylinder',
          height: 1,
          radius: 6,
        });
      }
    } else if (metadata.id === 'circle-chords-cyclic') {
      if (test.presetActionType === 'chord_tangent') {
        updateCircleChordsParams({
          mode: 'perpendicular-chord',
          chordDistance: 5.8,
          circleRadius: 6,
        });
      } else if (test.presetActionType === 'chord_diameter') {
        updateCircleChordsParams({
          mode: 'perpendicular-chord',
          chordDistance: 0.1,
          circleRadius: 6,
        });
      }
    } else if (metadata.id === 'linear-inequalities') {
      updateLinearInequalitiesParams({
        a1: 1, b1: 1, c1: 3,
        a2: 1, b2: 1, c2: 8,
        testPointX: 1, testPointY: 1,
      });
    } else if (metadata.id === 'statistics-visualizer') {
      updateStatisticsParams({
        outlierValue: 20,
        showMeanFulcrum: true,
        showMedianLine: true,
      });
    }

    closeStressTestModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl max-h-[92vh] flex flex-col bg-slate-900 border border-red-500/40 rounded-2xl shadow-2xl overflow-hidden text-slate-100"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex-none p-4 bg-gradient-to-r from-red-950/70 via-slate-900 to-slate-900 border-b border-red-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
              <Flame className="w-4 h-4 fill-red-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 bg-red-950/70 border border-red-700/50 px-2 py-0.5 rounded-full">
                  Stress-Test & Degeneracy Modes
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {metadata.grade}
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white leading-tight">
                Break the Math: Extreme Boundary Cases
              </h2>
            </div>
          </div>
          <button
            onClick={() => {
              lightTap();
              closeStressTestModal();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs sm:text-sm">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed">
            Coaching institutes only teach equations with neat, well-behaved numbers. But real competitive exams (JEE Advanced, Olympiads) intentionally test <strong>boundary limits and singular points</strong> to catch formula-memorizers. Push this simulator to its breaking points below:
          </div>

          <div className="space-y-3">
            {stressTests.map((test) => (
              <div
                key={test.id}
                className="p-4 rounded-xl bg-slate-950/90 border border-red-900/40 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800/80">
                        {test.badge}
                      </span>
                      <h3 className="font-bold text-white text-sm">
                        {test.title}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {test.description}
                    </p>
                  </div>
                </div>

                {/* Mathematical Boundary Expression */}
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-center font-mono text-cyan-300 text-xs">
                  <BlockMath math={test.boundaryCondition} />
                </div>

                <div className="grid sm:grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                    <strong className="text-amber-400 block mb-0.5">Why It Breaks Formulas:</strong>
                    <span className="text-slate-300">{test.whyItMatters}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                    <strong className="text-emerald-400 block mb-0.5">Exam Trap Relevance:</strong>
                    <span className="text-slate-300">{test.examRelevance}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleApplyStressTest(test)}
                  className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:brightness-110 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-red-950/40 transition-all cursor-pointer"
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>Trigger Boundary Case in Simulator</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex-none p-3 sm:p-4 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            P2 Feature: Extreme Case Invariant Analysis
          </span>
          <button
            onClick={() => {
              lightTap();
              closeStressTestModal();
            }}
            className="px-4 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
