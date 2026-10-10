import { SimulatorId } from '../types/simulators';

export interface CurriculumMapping {
  gradeNumber: number;
  chapterNumber: number;
  chapterName: string;
  exerciseRef: string;
  curriculumTopic: string;
  boardsLabel?: string;
}

export type NcertMapping = CurriculumMapping;

export const NCERT_CHAPTER_MAP: Record<SimulatorId, NcertMapping> = {
  // ================= CLASS 8 =================
  'balance-scale-equations': {
    gradeNumber: 8,
    chapterNumber: 2,
    chapterName: 'Linear Equations in One Variable',
    exerciseRef: 'Ex 2.1 – 2.3 (Solving Equations)',
    curriculumTopic: 'Balancing Equations & Inverse Operations',
  },
  'algebraic-identities-tiles': {
    gradeNumber: 8,
    chapterNumber: 9,
    chapterName: 'Algebraic Expressions & Identities',
    exerciseRef: 'Ex 9.5 (Standard Identities)',
    curriculumTopic: 'Geometric Proof of (a+b)², (a-b)², a²-b²',
  },
  'euler-polyhedra-3d': {
    gradeNumber: 8,
    chapterNumber: 10,
    chapterName: 'Visualising Solid Shapes',
    exerciseRef: 'Ex 10.3 (Euler’s Formula)',
    curriculumTopic: 'Faces, Vertices & Edges (F + V - E = 2)',
  },
  'compound-interest-engine': {
    gradeNumber: 8,
    chapterNumber: 8,
    chapterName: 'Comparing Quantities',
    exerciseRef: 'Ex 8.3 (Compound Interest Formula)',
    curriculumTopic: 'Annual Compounding vs Simple Interest',
  },
  'square-roots-triplets': {
    gradeNumber: 8,
    chapterNumber: 6,
    chapterName: 'Squares and Square Roots',
    exerciseRef: 'Ex 6.2 (Pythagorean Triplets)',
    curriculumTopic: 'Form 2m, m²-1, m²+1 & Square Grids',
  },
  'exponents-powers-lab': {
    gradeNumber: 8,
    chapterNumber: 12,
    chapterName: 'Exponents and Powers',
    exerciseRef: 'Ex 12.1 (Negative Exponents & Laws)',
    curriculumTopic: 'Laws of Indices: aᵐ × aⁿ = aᵐ⁺ⁿ, a⁻ⁿ = 1/aⁿ',
  },
  'direct-inverse-proportions': {
    gradeNumber: 8,
    chapterNumber: 13,
    chapterName: 'Direct and Inverse Proportions',
    exerciseRef: 'Ex 13.1 & 13.2 (Proportionality Constants)',
    curriculumTopic: 'Direct (y/x = k) vs Inverse (x·y = k)',
  },
  'dynamic-pie-chart': {
    gradeNumber: 8,
    chapterNumber: 5,
    chapterName: 'Data Handling',
    exerciseRef: 'Ex 5.2 (Constructing Pie Charts)',
    curriculumTopic: 'Sector Angles: θ = (value/total) × 360°',
  },
  'rational-numbers-density': {
    gradeNumber: 8,
    chapterNumber: 1,
    chapterName: 'Rational Numbers',
    exerciseRef: 'Ex 1.2 (Numbers between Two Rationals)',
    curriculumTopic: 'Density Property & Arithmetic Mean Method',
  },
  'quadrilateral-morpher': {
    gradeNumber: 8,
    chapterNumber: 3,
    chapterName: 'Understanding Quadrilaterals',
    exerciseRef: 'Ex 3.3 & 3.4 (Parallelogram & Special Quads)',
    curriculumTopic: 'Diagonal Bisectors, Opposite Angles & Sides',
  },

  // ================= CLASS 9 =================
  'drone-navigator': {
    gradeNumber: 9,
    chapterNumber: 3,
    chapterName: 'Coordinate Geometry',
    exerciseRef: 'Ex 3.2 & 3.3 (Cartesian Coordinates)',
    curriculumTopic: 'Cartesian Distances via Pythagoras Theorem',
  },
  'heron-triangles': {
    gradeNumber: 9,
    chapterNumber: 12,
    chapterName: "Heron's Formula",
    exerciseRef: 'Ex 12.1 (Triangle Area via Semi-perimeter)',
    curriculumTopic: 'Area Δ = √[s(s-a)(s-b)(s-c)] & Incircle',
  },
  'polynomial-factorizer': {
    gradeNumber: 9,
    chapterNumber: 2,
    chapterName: 'Polynomials',
    exerciseRef: 'Ex 2.4 & 2.5 (Splitting Middle Term)',
    curriculumTopic: 'Visual Algebra Tile Factorization: (x+p)(x+q)',
  },
  'lines-angles': {
    gradeNumber: 9,
    chapterNumber: 6,
    chapterName: 'Lines and Angles',
    exerciseRef: 'Ex 6.2 (Parallel Lines & Transversal)',
    curriculumTopic: 'Alternate Interior Angles (Z) & Corresponding (F)',
  },
  'triangle-congruence-forge': {
    gradeNumber: 9,
    chapterNumber: 7,
    chapterName: 'Triangles',
    exerciseRef: 'Ex 7.1 – 7.3 (Congruence Criteria)',
    curriculumTopic: 'SAS, SSS, ASA, AAS & RHS Geometric Tests',
  },
  'surface-area-volumes': {
    gradeNumber: 9,
    chapterNumber: 13,
    chapterName: 'Surface Areas and Volumes',
    exerciseRef: 'Ex 13.1 – 13.4 (Cylinder & Cone 2D Nets)',
    curriculumTopic: 'Unfolding 3D Curved Surfaces into 2D Planes',
  },
  'circle-theorems': {
    gradeNumber: 9,
    chapterNumber: 10,
    chapterName: 'Circles',
    exerciseRef: 'Ex 10.4 & 10.5 (Inscribed Angle Theorems)',
    curriculumTopic: 'Angle at Centre is Double Angle at Circumference',
  },
  'circle-chords-cyclic': {
    gradeNumber: 9,
    chapterNumber: 10,
    chapterName: 'Circles',
    exerciseRef: 'Ex 10.3 & 10.5 (Chords & Cyclic Quads)',
    curriculumTopic: 'Perpendicular from Centre Bisects Chord; Cyclic Sum 180°',
  },
  'euclidean-geometry-sandbox': {
    gradeNumber: 9,
    chapterNumber: 5,
    chapterName: "Introduction to Euclid's Geometry",
    exerciseRef: 'Ex 5.1 & 5.2 (Postulates & Axioms)',
    curriculumTopic: 'Euclid’s 5th Postulate & Non-Euclidean Spheres',
  },

  // ================= CLASS 10 =================
  'catapult-siege': {
    gradeNumber: 10,
    chapterNumber: 4,
    chapterName: 'Quadratic Equations',
    exerciseRef: 'Ex 4.3 (Parabolic Trajectories & Heights)',
    curriculumTopic: 'Projectile Parabolas: y = ax² + bx + c',
  },
  'quadratic-roots': {
    gradeNumber: 10,
    chapterNumber: 4,
    chapterName: 'Quadratic Equations',
    exerciseRef: 'Ex 4.4 (Nature of Roots & Discriminant)',
    curriculumTopic: 'Discriminant D = b² - 4ac & Vertex Location',
  },
  'unit-circle': {
    gradeNumber: 10,
    chapterNumber: 8,
    chapterName: 'Introduction to Trigonometry',
    exerciseRef: 'Ex 8.1 & 8.2 (Trigonometric Ratios & Angles)',
    curriculumTopic: 'Unit Circle Unwrapping to Sine & Cosine Waves',
  },
  'trig-heights': {
    gradeNumber: 10,
    chapterNumber: 9,
    chapterName: 'Some Applications of Trigonometry',
    exerciseRef: 'Ex 9.1 (Heights & Distances)',
    curriculumTopic: 'Clinometer Angles of Elevation & Depression',
  },
  'similar-triangles': {
    gradeNumber: 10,
    chapterNumber: 6,
    chapterName: 'Triangles',
    exerciseRef: 'Ex 6.2 (Basic Proportionality Theorem / BPT)',
    curriculumTopic: 'Thales Theorem: AD/DB = AE/EC & AA Similarity',
  },
  'linear-systems': {
    gradeNumber: 10,
    chapterNumber: 3,
    chapterName: 'Pair of Linear Equations in Two Variables',
    exerciseRef: 'Ex 3.1 & 3.2 (Graphical Intersections)',
    curriculumTopic: 'Consistent, Dependent & Inconsistent Line Pairs',
  },
  'arithmetic-progression-lab': {
    gradeNumber: 10,
    chapterNumber: 5,
    chapterName: 'Arithmetic Progressions',
    exerciseRef: 'Ex 5.2 & 5.3 (n-th Term & Sum of AP)',
    curriculumTopic: 'AP Series: aₙ = a + (n-1)d & Gauss Pairing Sₙ',
  },
  'coordinate-section-formula': {
    gradeNumber: 10,
    chapterNumber: 7,
    chapterName: 'Coordinate Geometry',
    exerciseRef: 'Ex 7.2 (Section Formula & Midpoints)',
    curriculumTopic: 'Internal Division m₁:m₂ & Centroid of Triangle',
  },
  'circle-tangents-lab': {
    gradeNumber: 10,
    chapterNumber: 10,
    chapterName: 'Circles',
    exerciseRef: 'Ex 10.2 (Lengths of Tangents from External Point)',
    curriculumTopic: 'Tangents PA = PB & Radius Orthogonality OP ⊥ Tangent',
  },
  'statistics-visualizer': {
    gradeNumber: 10,
    chapterNumber: 14,
    chapterName: 'Statistics',
    exerciseRef: 'Ex 14.1 & 14.2 (Mean, Median, Mode)',
    curriculumTopic: 'Fulcrum Center of Gravity, Outliers & Skewness',
  },

  // ================= CLASS 11 =================
  'conic-sections': {
    gradeNumber: 11,
    chapterNumber: 11,
    chapterName: 'Conic Sections',
    exerciseRef: 'Ex 11.1 – 11.4 (Double-Cone Cutting Plane)',
    curriculumTopic: '3D Double-Cone Slicer: Ellipse, Parabola, Hyperbola',
  },
  'limits-derivatives-lab': {
    gradeNumber: 11,
    chapterNumber: 13,
    chapterName: 'Limits and Derivatives',
    exerciseRef: 'Ex 13.1 & 13.2 (First Principles & Tangents)',
    curriculumTopic: 'Secant Snapping to Tangent as Δx → 0',
  },
  'hyperbola-ellipse-orbits': {
    gradeNumber: 11,
    chapterNumber: 11,
    chapterName: 'Conic Sections',
    exerciseRef: 'Ex 11.1 & 11.4 (Focal Distances & Orbits)',
    curriculumTopic: 'String Property: d₁ + d₂ = 2a & Planetary Paths',
  },
  'mathematical-induction-dominos': {
    gradeNumber: 11,
    chapterNumber: 4,
    chapterName: 'Principle of Mathematical Induction',
    exerciseRef: 'Ex 4.1 (Inductive Step P(k) ⇒ P(k+1))',
    curriculumTopic: 'Domino Chain Reaction: Base Case P(1) & Induction',
  },
  'trig-equations-radial': {
    gradeNumber: 11,
    chapterNumber: 3,
    chapterName: 'Trigonometric Functions',
    exerciseRef: 'Ex 3.4 (General Solutions of Trig Equations)',
    curriculumTopic: 'Radial Radar: All-Silver-Tea-Cups Quadrants',
  },
  'argand-plane': {
    gradeNumber: 11,
    chapterNumber: 5,
    chapterName: 'Complex Numbers & Quadratic Equations',
    exerciseRef: 'Ex 5.2 (Argand Plane & Polar Form)',
    curriculumTopic: 'Multiplying by i is a 90° Rotation in the Plane',
  },
  'permutations-combinations': {
    gradeNumber: 11,
    chapterNumber: 7,
    chapterName: 'Permutations and Combinations',
    exerciseRef: 'Ex 7.2 – 7.4 (Arrangements vs Selections)',
    curriculumTopic: 'Order Matters (nP r) vs Order Does Not Matter (nCr)',
  },
  'binomial-galton': {
    gradeNumber: 11,
    chapterNumber: 8,
    chapterName: 'Binomial Theorem',
    exerciseRef: 'Ex 8.1 & 8.2 (Pascal Triangle & Coefficients)',
    curriculumTopic: 'Galton Peg Board: Combinatorics creates Normal Curve',
  },
  'linear-inequalities': {
    gradeNumber: 11,
    chapterNumber: 6,
    chapterName: 'Linear Inequalities',
    exerciseRef: 'Ex 6.2 & 6.3 (Graphical Solution in Two Variables)',
    curriculumTopic: 'Half-Planes & Feasible Bounded Polygons',
  },
  'arithmetic-geometric-explorer': {
    gradeNumber: 11,
    chapterNumber: 9,
    chapterName: 'Sequences and Series',
    exerciseRef: 'Ex 9.3 (Geometric Progression & Infinite Sum)',
    curriculumTopic: 'GP Growth vs AP Staircase; S_∞ = a / (1 - r)',
  },

  // ================= CLASS 12 =================
  'vector-flight-lab': {
    gradeNumber: 12,
    chapterNumber: 10,
    chapterName: 'Vector Algebra',
    exerciseRef: 'Ex 10.3 & 10.4 (Dot Product & Cross Product)',
    curriculumTopic: '3D Dot Product (Projection) & Cross Product (Area)',
  },
  'ftc-integral-accumulator': {
    gradeNumber: 12,
    chapterNumber: 7,
    chapterName: 'Integrals',
    exerciseRef: 'Ex 7.8 & 7.9 (Fundamental Theorem of Calculus)',
    curriculumTopic: 'Riemann Sums Accumulate Area: d/dx[∫ f(t)dt] = f(x)',
  },
  'differential-equations-lab': {
    gradeNumber: 12,
    chapterNumber: 9,
    chapterName: 'Differential Equations',
    exerciseRef: 'Ex 9.2 – 9.4 (Slope Fields & Solutions)',
    curriculumTopic: 'Direction Slope Fields: dy/dx = f(x,y) Curves',
  },
  'three-d-geometry-lab': {
    gradeNumber: 12,
    chapterNumber: 11,
    chapterName: 'Three Dimensional Geometry',
    exerciseRef: 'Ex 11.2 & 11.3 (Shortest Distance between Skew Lines)',
    curriculumTopic: '3D Skew Lines, Direction Ratios & Plane Intersections',
  },
  'matrix-meme': {
    gradeNumber: 12,
    chapterNumber: 4,
    chapterName: 'Determinants',
    exerciseRef: 'Ex 4.3 (Area of Triangle via Determinants)',
    curriculumTopic: 'Matrix Machine: Determinant is 2D Area Scale Factor',
  },
  'linear-programming-lab': {
    gradeNumber: 12,
    chapterNumber: 12,
    chapterName: 'Linear Programming',
    exerciseRef: 'Ex 12.1 (Corner Point Method)',
    curriculumTopic: 'Feasible Region Convex Polygon & Iso-Profit Sliding',
  },
  'bayes-probability-lab': {
    gradeNumber: 12,
    chapterNumber: 13,
    chapterName: 'Probability',
    exerciseRef: 'Ex 13.3 (Bayes’ Theorem & Total Probability)',
    curriculumTopic: 'Prior vs Posterior Probabilities & Tree Diagrams',
  },
  'probability-distribution-lab': {
    gradeNumber: 12,
    chapterNumber: 13,
    chapterName: 'Probability',
    exerciseRef: 'Ex 13.4 (Probability Distribution & Mean)',
    curriculumTopic: 'Discrete Random Variable X, E(X) = Σ xᵢP(xᵢ)',
  },
  'calculus-sandbox': {
    gradeNumber: 12,
    chapterNumber: 6,
    chapterName: 'Application of Derivatives',
    exerciseRef: 'Ex 6.3 (Tangents and Normals)',
    curriculumTopic: 'Tangent Slopes f’(x) as Instantaneous Velocity',
  },
  'rollercoaster-architect': {
    gradeNumber: 12,
    chapterNumber: 5,
    chapterName: 'Continuity and Differentiability',
    exerciseRef: 'Ex 5.1 (Differentiability & Smooth Curvature)',
    curriculumTopic: 'Track Continuity & Zero G Acceleration Calculus',
  },
  'monty-hall': {
    gradeNumber: 12,
    chapterNumber: 13,
    chapterName: 'Probability',
    exerciseRef: 'Ex 13.1 (Conditional Probability & Sample Space)',
    curriculumTopic: 'Conditional Odds: P(Win|Switch) = 2/3 vs P(Stay) = 1/3',
  },
};

export const getNcertMapping = (simId: SimulatorId): NcertMapping | undefined => {
  return NCERT_CHAPTER_MAP[simId];
};

export const getCurriculumMapping = getNcertMapping;
