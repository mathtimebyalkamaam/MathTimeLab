import { SimulatorId, SimulatorMetadata } from '../types/simulators';
import { SIMULATORS } from './simulators';

/**
 * Curated pedagogical prerequisites and forward-continuation visual labs for each simulator.
 * Ensures a high-retention discovery loop and internal link graph for search engine crawlers.
 */
export const CURATED_RELATED_MAP: Record<SimulatorId, SimulatorId[]> = {
  // ================= CLASS 8 =================
  'balance-scale-equations': [
    'linear-systems',
    'algebraic-identities-tiles',
    'polynomial-factorizer',
    'direct-inverse-proportions'
  ],
  'algebraic-identities-tiles': [
    'balance-scale-equations',
    'polynomial-factorizer',
    'quadratic-roots',
    'square-roots-triplets'
  ],
  'euler-polyhedra-3d': [
    'surface-area-volumes',
    'quadrilateral-morpher',
    'conic-sections',
    'three-d-geometry-lab'
  ],
  'compound-interest-engine': [
    'direct-inverse-proportions',
    'arithmetic-progression-lab',
    'dynamic-pie-chart',
    'statistics-visualizer'
  ],
  'square-roots-triplets': [
    'drone-navigator',
    'algebraic-identities-tiles',
    'rational-numbers-density',
    'heron-triangles'
  ],
  'exponents-powers-lab': [
    'rational-numbers-density',
    'algebraic-identities-tiles',
    'square-roots-triplets',
    'compound-interest-engine'
  ],
  'direct-inverse-proportions': [
    'compound-interest-engine',
    'balance-scale-equations',
    'linear-systems',
    'dynamic-pie-chart'
  ],
  'dynamic-pie-chart': [
    'statistics-visualizer',
    'direct-inverse-proportions',
    'monty-hall',
    'compound-interest-engine'
  ],
  'quadrilateral-morpher': [
    'euler-polyhedra-3d',
    'lines-angles',
    'triangle-congruence-forge',
    'circle-chords-cyclic'
  ],
  'rational-numbers-density': [
    'square-roots-triplets',
    'exponents-powers-lab',
    'drone-navigator',
    'limits-derivatives-lab'
  ],

  // ================= CLASS 9 =================
  'drone-navigator': [
    'coordinate-section-formula',
    'trig-heights',
    'vector-flight-lab',
    'square-roots-triplets'
  ],
  'lines-angles': [
    'triangle-congruence-forge',
    'quadrilateral-morpher',
    'circle-theorems',
    'similar-triangles'
  ],
  'heron-triangles': [
    'similar-triangles',
    'surface-area-volumes',
    'drone-navigator',
    'triangle-congruence-forge'
  ],
  'polynomial-factorizer': [
    'algebraic-identities-tiles',
    'quadratic-roots',
    'linear-systems',
    'balance-scale-equations'
  ],
  'surface-area-volumes': [
    'euler-polyhedra-3d',
    'conic-sections',
    'heron-triangles',
    'three-d-geometry-lab'
  ],
  'circle-chords-cyclic': [
    'circle-theorems',
    'circle-tangents-lab',
    'quadrilateral-morpher',
    'lines-angles'
  ],
  'statistics-visualizer': [
    'dynamic-pie-chart',
    'monty-hall',
    'bayes-probability-lab',
    'probability-distribution-lab'
  ],
  'euclidean-geometry-sandbox': [
    'lines-angles',
    'triangle-congruence-forge',
    'similar-triangles',
    'circle-theorems'
  ],
  'triangle-congruence-forge': [
    'similar-triangles',
    'lines-angles',
    'heron-triangles',
    'euclidean-geometry-sandbox'
  ],
  'linear-systems': [
    'balance-scale-equations',
    'polynomial-factorizer',
    'quadratic-roots',
    'linear-programming-lab'
  ],

  // ================= CLASS 10 =================
  'quadratic-roots': [
    'polynomial-factorizer',
    'algebraic-identities-tiles',
    'conic-sections',
    'rollercoaster-architect'
  ],
  'trig-heights': [
    'catapult-siege',
    'unit-circle',
    'drone-navigator',
    'trig-equations-radial'
  ],
  'circle-theorems': [
    'circle-tangents-lab',
    'circle-chords-cyclic',
    'similar-triangles',
    'euclidean-geometry-sandbox'
  ],
  'catapult-siege': [
    'trig-heights',
    'unit-circle',
    'rollercoaster-architect',
    'quadratic-roots'
  ],
  'similar-triangles': [
    'triangle-congruence-forge',
    'circle-theorems',
    'trig-heights',
    'heron-triangles'
  ],
  'arithmetic-geometric-explorer': [
    'arithmetic-progression-lab',
    'binomial-galton',
    'mathematical-induction-dominos',
    'compound-interest-engine'
  ],
  'coordinate-section-formula': [
    'drone-navigator',
    'vector-flight-lab',
    'three-d-geometry-lab',
    'linear-systems'
  ],
  'circle-tangents-lab': [
    'circle-theorems',
    'circle-chords-cyclic',
    'limits-derivatives-lab',
    'similar-triangles'
  ],
  'arithmetic-progression-lab': [
    'arithmetic-geometric-explorer',
    'compound-interest-engine',
    'binomial-galton',
    'mathematical-induction-dominos'
  ],
  'monty-hall': [
    'bayes-probability-lab',
    'binomial-galton',
    'statistics-visualizer',
    'probability-distribution-lab'
  ],

  // ================= CLASS 11 =================
  'conic-sections': [
    'hyperbola-ellipse-orbits',
    'quadratic-roots',
    'surface-area-volumes',
    'three-d-geometry-lab'
  ],
  'unit-circle': [
    'catapult-siege',
    'trig-heights',
    'trig-equations-radial',
    'argand-plane'
  ],
  'hyperbola-ellipse-orbits': [
    'conic-sections',
    'vector-flight-lab',
    'quadratic-roots',
    'three-d-geometry-lab'
  ],
  'limits-derivatives-lab': [
    'calculus-sandbox',
    'rollercoaster-architect',
    'ftc-integral-accumulator',
    'circle-tangents-lab'
  ],
  'linear-inequalities': [
    'linear-systems',
    'linear-programming-lab',
    'quadratic-roots',
    'balance-scale-equations'
  ],
  'permutations-combinations': [
    'binomial-galton',
    'bayes-probability-lab',
    'monty-hall',
    'probability-distribution-lab'
  ],
  'binomial-galton': [
    'permutations-combinations',
    'monty-hall',
    'arithmetic-geometric-explorer',
    'probability-distribution-lab'
  ],
  'mathematical-induction-dominos': [
    'arithmetic-progression-lab',
    'arithmetic-geometric-explorer',
    'binomial-galton',
    'rational-numbers-density'
  ],
  'trig-equations-radial': [
    'unit-circle',
    'trig-heights',
    'argand-plane',
    'catapult-siege'
  ],
  'three-d-geometry-lab': [
    'vector-flight-lab',
    'conic-sections',
    'coordinate-section-formula',
    'euler-polyhedra-3d'
  ],

  // ================= CLASS 12 =================
  'calculus-sandbox': [
    'limits-derivatives-lab',
    'ftc-integral-accumulator',
    'rollercoaster-architect',
    'differential-equations-lab'
  ],
  'rollercoaster-architect': [
    'calculus-sandbox',
    'limits-derivatives-lab',
    'quadratic-roots',
    'catapult-siege'
  ],
  'vector-flight-lab': [
    'three-d-geometry-lab',
    'drone-navigator',
    'argand-plane',
    'matrix-meme'
  ],
  'argand-plane': [
    'unit-circle',
    'vector-flight-lab',
    'quadratic-roots',
    'trig-equations-radial'
  ],
  'matrix-meme': [
    'linear-systems',
    'vector-flight-lab',
    'three-d-geometry-lab',
    'linear-programming-lab'
  ],
  'ftc-integral-accumulator': [
    'calculus-sandbox',
    'limits-derivatives-lab',
    'differential-equations-lab',
    'surface-area-volumes'
  ],
  'bayes-probability-lab': [
    'monty-hall',
    'probability-distribution-lab',
    'permutations-combinations',
    'statistics-visualizer'
  ],
  'differential-equations-lab': [
    'calculus-sandbox',
    'ftc-integral-accumulator',
    'rollercoaster-architect',
    'vector-flight-lab'
  ],
  'linear-programming-lab': [
    'linear-inequalities',
    'linear-systems',
    'matrix-meme',
    'balance-scale-equations'
  ],
  'probability-distribution-lab': [
    'bayes-probability-lab',
    'binomial-galton',
    'monty-hall',
    'statistics-visualizer'
  ]
};

/**
 * Returns 3-4 related simulators for a given simulator ID.
 * Falls back to same category / grade if curated mapping has gaps.
 */
export function getRelatedSimulators(simulatorId: SimulatorId): SimulatorMetadata[] {
  const curatedIds = CURATED_RELATED_MAP[simulatorId] || [];
  const results: SimulatorMetadata[] = [];

  for (const id of curatedIds) {
    const found = SIMULATORS.find((s) => s.id === id);
    if (found && !results.some((r) => r.id === found.id)) {
      results.push(found);
    }
    if (results.length >= 4) break;
  }

  // Fallback to same grade or category if fewer than 3
  if (results.length < 3) {
    const current = SIMULATORS.find((s) => s.id === simulatorId);
    if (current) {
      const candidates = SIMULATORS.filter(
        (s) => s.id !== simulatorId && !results.some((r) => r.id === s.id)
      );

      // Same category first
      for (const cand of candidates) {
        if (cand.category === current.category) {
          results.push(cand);
          if (results.length >= 4) break;
        }
      }

      // Same grade next
      if (results.length < 3) {
        for (const cand of candidates) {
          if (cand.grade === current.grade && !results.some((r) => r.id === cand.id)) {
            results.push(cand);
            if (results.length >= 4) break;
          }
        }
      }
    }
  }

  return results.slice(0, 4);
}

