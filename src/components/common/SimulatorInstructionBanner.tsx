/**
 * SimulatorInstructionBanner.tsx: Contextual mission guide for simulators.
 * Renders as a clean, high-contrast modal dialog when invoked from the top bar
 * or bottom sheet, keeping the simulation canvas 100% clear of permanent blocking pills!
 */
import React from 'react';
import { 
  Sparkles, 
  Hand, 
  Target, 
  Lightbulb,
  X,
  Compass,
  Sliders,
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import { SimulatorId } from '../../types/simulators';
import { SIMULATORS } from '../../data/simulators';
import { BlockMath } from './MathFormula';
import { useHaptics } from '../../hooks/useHaptics';
import { useSound } from './SoundManager';
import { useSimulatorStore } from '../../store/useSimulatorStore';

export interface SimulatorInstruction {
  title: string;
  goal: string;
  touchAction: string;
  mathInsight: string;
}

export const INSTRUCTIONS: Record<SimulatorId, SimulatorInstruction> = {
  'vector-flight-lab': {
    title: '3D Vector Flight Lab',
    goal: 'Observe 3D vectors interact via Dot Product (alignment) and Cross Product (perpendicular normal).',
    touchAction: 'Drag anywhere on the 3D grid with one finger to rotate & inspect from any perspective.',
    mathInsight: 'u · v = 0 when orthogonal (90°). |u × v| = area of spanned parallelogram.',
  },
  'drone-navigator': {
    title: 'Drone Navigator',
    goal: 'Navigate the delivery drone safely to the target coordinates using Cartesian vectors.',
    touchAction: 'Touch & drag the blue drone or tap the target pad to set destination (x, y).',
    mathInsight: 'Distance d = √[(Δx)² + (Δy)²] via Pythagorean theorem.',
  },
  'catapult-siege': {
    title: 'Catapult Siege',
    goal: 'Launch projectiles over castle walls by calculating launch angle and tension velocity.',
    touchAction: 'Drag the launch arm backward to set angle & power, then release or tap "Fire".',
    mathInsight: 'Opp = v·sin(θ), Adj = v·cos(θ). 45° maximizes horizontal flight range in a vacuum.',
  },
  'conic-sections': {
    title: '3D Conics Slicer',
    goal: 'Slice a 3D double cone with a geometric plane to create circles, ellipses, parabolas, and hyperbolas.',
    touchAction: 'Drag anywhere to orbit the 3D cone. Use sliders below to tilt cutting plane β.',
    mathInsight: 'Circle (β=0°), Ellipse (β<α), Parabola (β=α), Hyperbola (β>α).',
  },
  'rollercoaster-architect': {
    title: 'Rollercoaster Architect',
    goal: 'Design a smooth high-speed track with cubic splines while preventing dangerous G-forces.',
    touchAction: 'Touch and drag the track control nodes up or down to bend the coaster hills.',
    mathInsight: "1st derivative f'(x) gives slope; 2nd derivative gives G-force curvature.",
  },
  'unit-circle': {
    title: 'Unit Circle & Waves',
    goal: 'Understand how circular rotation around the unit circle generates sine and cosine waves.',
    touchAction: 'Drag the glowing point around the circle to change angle θ.',
    mathInsight: 'cos(θ) is horizontal x-projection, sin(θ) is vertical y-projection.',
  },
  'calculus-sandbox': {
    title: 'Calculus Sandbox',
    goal: 'Explore derivatives as tangent slopes and definite integrals as area Riemann sums.',
    touchAction: 'Drag tangent point x₀ horizontally along the curve to see dy/dx change in real time.',
    mathInsight: "Derivative f'(x) is the limit of secant slopes. Integral ∫f(x)dx is the area under curve.",
  },
  'argand-plane': {
    title: 'The Argand Plane',
    goal: 'Visualize complex numbers z = a + bi as vectors and understand multiplication by i.',
    touchAction: 'Touch and drag point z₁ (cyan) or z₂ (purple) anywhere across the complex plane.',
    mathInsight: 'Multiplying by i rotates the vector by exactly 90° CCW: i·(a+bi) = -b+ai.',
  },
  'matrix-meme': {
    title: 'The Matrix Machine',
    goal: 'See how a 2x2 matrix transforms 2D space, images, and coordinate grids.',
    touchAction: 'Adjust sliders [a, b; c, d] to rotate, shear, and scale. Tap presets for quick shapes.',
    mathInsight: 'When det(A) = ad - bc = 0, 2D space collapses into a 1D line with no inverse.',
  },
  'monty-hall': {
    title: 'Monty Hall Casino',
    goal: 'Experience the famous game show paradox and learn conditional probability.',
    touchAction: 'Tap Door 1, 2, or 3. When Monty reveals a goat, choose Stay or Switch.',
    mathInsight: "Your initial pick has 1/3 odds. Monty's goat reveal concentrates 2/3 odds on the remaining door!",
  },
  'quadratic-roots': {
    title: 'The Parabola Root Hunter',
    goal: 'Hunt real and imaginary roots by scrubbing coefficients a, b, c and watching the discriminant D.',
    touchAction: 'Drag vertex on canvas or scrub coefficients a, b, c using the sliders below.',
    mathInsight: 'D = b² - 4ac controls roots: D > 0 gives two real roots, D = 0 kisses axis, D < 0 floats.',
  },
  'circle-theorems': {
    title: 'The Tangent Guardian',
    goal: 'Verify tangent length equality (PA = PB), 90° radius perpendicularity, and inscribed angle doubling.',
    touchAction: 'Drag external point P around the circle or drag inscribed vertex C along the circular arc.',
    mathInsight: 'Tangents PA = PB = √(d² - R²) because right triangles ΔOPA ≅ ΔOPB by RHS congruence.',
  },
  'linear-systems': {
    title: 'The Linear Crossroads',
    goal: 'Solve pairs of 2-variable linear equations and visualize unique, parallel, and coincident systems.',
    touchAction: 'Drag lines directly on the grid or adjust slope/intercept sliders to observe intersection (x*, y*).',
    mathInsight: 'Unique solution if a₁/a₂ ≠ b₁/b₂; Parallel (no solution) if a₁/a₂ = b₁/b₂ ≠ c₁/c₂.',
  },
  'trig-heights': {
    title: 'The Lighthouse Clinometer',
    goal: 'Master angles of elevation and depression, line of sight, and the classic dual-angle tower problem.',
    touchAction: 'Drag surveyor along the ground or ocean to observe real-time angle θ and tan(θ) triangle.',
    mathInsight: 'h = d · tan(θ). Depression angle from top equals elevation angle from bottom by alternate interior angles!',
  },
  'heron-triangles': {
    title: "Heron's Formula & Triangle Surveyor",
    goal: 'Calculate triangle area from 3 side lengths alone without needing perpendicular altitude.',
    touchAction: 'Drag triangle vertices A, B, C on the grid to change side lengths a, b, c in real time.',
    mathInsight: 'Area Δ = √[s(s-a)(s-b)(s-c)] where s = (a+b+c)/2. Area is zero if a + b = c (collapsed).',
  },
  'polynomial-factorizer': {
    title: 'Geometric Polynomial Factorizer',
    goal: 'Visualize polynomial factorization as decomposing a 2D composite rectangle into length × width.',
    touchAction: 'Adjust dimensions p and q using sliders or tap presets to factorize quadratic expressions.',
    mathInsight: 'Area (x + p)(x + q) = x² + (p+q)x + pq. Middle coefficient is the sum, constant is the product!',
  },
  'lines-angles': {
    title: 'Parallel Lines & Transversal Detective',
    goal: 'Master alternate interior, corresponding, and consecutive interior angles along parallel lines.',
    touchAction: 'Drag the transversal rotation handle or test the classic board exam Zigzag bend.',
    mathInsight: 'Alternate interior angles are equal (Z-shape). Consecutive interior angles sum to 180° (C-shape).',
  },
  'binomial-galton': {
    title: "Binomial Galton Board & Pascal's Triangle",
    goal: 'Watch dropped balls bounce through pegs to form binomial coefficients and normal distributions.',
    touchAction: 'Toggle ball drop generator, scrub binomial power n, or tap Pascal pegs to inspect paths.',
    mathInsight: 'Number of paths to bin r at row n equals ⁿCᵣ = n! / [r!(n-r)!]. Sum of row equals 2ⁿ.',
  },
  'arithmetic-geometric-explorer': {
    title: 'Sequences & Series: AP, GP & Infinite Sums',
    goal: 'Explore arithmetic staircases and watch infinite geometric fractions sum to a finite area.',
    touchAction: 'Toggle between AP and GP modes, adjust common difference/ratio, and test infinite convergence.',
    mathInsight: 'AP: Sₙ = n/2 · (first + last). Infinite GP converges to a/(1-r) if and only if |r| < 1.',
  },
  'hyperbola-ellipse-orbits': {
    title: "Kepler's Orbits & Focal Conic Properties",
    goal: 'Explore the constant string property of ellipses and watch Keplerian orbital motion around a focal Sun.',
    touchAction: 'Drag point P along the curve or scrub eccentricity e to transition between circle, ellipse, and hyperbola.',
    mathInsight: 'Ellipse: d₁ + d₂ = 2a (constant string). Hyperbola: |d₁ - d₂| = 2a. Kepler 1st Law: orbits are ellipses with Sun at focus.',
  },
  'surface-area-volumes': {
    title: '3D Solid Unfolder & Liquid Pourer',
    goal: 'Unfold cylinders, cones, and cuboids into flat 2D nets, and pour liquid to prove cone volume is 1/3 of a cylinder.',
    touchAction: 'Slide the 2D Net Unfolder, scrub radius/height dimensions, and tap Pour Water.',
    mathInsight: 'Curved surface area of a cylinder is a rectangle of dimensions (2πr) × h. Cone volume is exactly 1/3 of πr²h.',
  },
  'circle-chords-cyclic': {
    title: 'Chords & Cyclic Quadrilateral Lab',
    goal: 'Verify perpendicular bisector chord theorems and observe why cyclic quadrilateral opposite angles sum to 180°.',
    touchAction: 'Drag chord distance slider or touch & drag vertices A, B, C, D directly around the circular circumference.',
    mathInsight: 'OM ⊥ AB bisects chord into AM = MB = √(R² - d²). Opposite angles of cyclic quadrilateral sum to 180°!',
  },
  'statistics-visualizer': {
    title: 'The Data Fulcrum & Outlier Tug-of-War',
    goal: 'Balance data on a seesaw to feel Mean as center of gravity, and watch outliers yank Mean while Median holds steady.',
    touchAction: 'Drag the Outlier slider to witness the tug-of-war, or switch to Histogram to adjust class interval bin widths.',
    mathInsight: 'Mean is the torque balance point: Σ(x - x̄) = 0. Median is 50th percentile rank. Mode ≈ 3·Median - 2·Mean.',
  },
  'limits-derivatives-lab': {
    title: 'The Tangent Secant Zoom Lab',
    goal: 'Watch secant lines rotate and snap into the tangent line as h → 0, and zoom in 100x to discover local linearity.',
    touchAction: 'Slide step h toward 0, tap Auto Limit, or increase Microscope Zoom to see curves turn into straight lines.',
    mathInsight: 'Derivative is the slope of secant line as h → 0: f’(x) = lim [f(x+h) - f(x)] / h. All differentiable curves are locally linear!',
  },
  'linear-inequalities': {
    title: 'Linear Inequalities & Feasible Region',
    goal: 'Slice the plane into shaded half-planes, test points for constraint satisfaction, and find optimal LP corner vertices.',
    touchAction: 'Touch & drag the test point anywhere on the grid, and sweep the objective line Z = px + qy across the feasible polygon.',
    mathInsight: 'Always test (0,0) to determine which side to shade! Maximum and minimum of Z always occur at extreme corner points.',
  },
  'permutations-combinations': {
    title: 'Permutations vs Combinations Lock',
    goal: 'Discover why Permutations (order matters) produces huge numbers while Combinations collapses redundancy by dividing by r!.',
    touchAction: 'Adjust items n and r, toggle between Permutations and Combinations, or spin the circular seating table.',
    mathInsight: 'Permutations: ⁿPᵣ = n! / (n-r)!. Combinations: ⁿCᵣ = ⁿPᵣ / r!. Circular table: n! / n = (n - 1)!.',
  },
  'similar-triangles': {
    title: 'Similar Triangles & Thales BPT',
    goal: 'Prove that drawing line DE parallel to BC divides side legs in identical proportion (AD/DB = AE/EC) and squares area ratios.',
    touchAction: 'Drag triangle apex A, move transversal slider DE, or switch to Shadow Clinometer to scale sun shadows.',
    mathInsight: 'BPT: AD/DB = AE/EC. Similar triangle side ratio DE/BC = AD/AB. Area ratio = (scale factor k)².',
  },
  'ftc-integral-accumulator': {
    title: 'Fundamental Theorem of Calculus',
    goal: 'Observe the miracle that unites differentiation and integration: the instantaneous slope of area accumulation A′(x) equals the curve height f(x).',
    touchAction: 'Drag the upper bound x slider to accumulate Riemann slices, and watch the green tangent slope lock onto f(x).',
    mathInsight: 'First FTC: d/dx[∫ₐˣ f(t) dt] = f(x). Second FTC: ∫ₐᵇ f(x) dx = F(b) - F(a). Definite integrals measure net signed area.',
  },
  'bayes-probability-lab': {
    title: "Bayes' Theorem & Rare Event Detective",
    goal: 'Defeat the Base Rate Fallacy by visualizing how test accuracy and disease prevalence interact across 1,000 patients.',
    touchAction: 'Adjust Prevalence and Test Sensitivity sliders, and switch between the Frequency Tree and 1,000 Patient Grid.',
    mathInsight: 'Bayes: P(A|B) = [P(B|A)P(A)] / P(B). When a condition is rare, false alarms from the healthy majority outnumber true positives!',
  },
  'euclidean-geometry-sandbox': {
    title: "Euclid's Axioms & Non-Euclidean Sandbox",
    goal: 'Discover why Euclid required Postulate 5 and explore how triangle angle sums bend above 180° on spheres and below 180° on saddles.',
    touchAction: 'Adjust interior transversal angles α and β, or switch to Spherical and Hyperbolic models to inspect geodesic triangles.',
    mathInsight: 'Postulate 5: Lines meet on the side where α + β < 180°. On a sphere (elliptic), angle sum > 180° by area excess (Girard’s Theorem).',
  },
  'three-d-geometry-lab': {
    title: '3D Geometry: Skew Lines & Shortest Distance',
    goal: 'Master true 3D spatial geometry: discover skew lines that never meet and never stay parallel, and calculate their shortest distance.',
    touchAction: 'Orbit the 3D camera with drag, manipulate line direction vectors, and project onto the common perpendicular normal.',
    mathInsight: 'Shortest distance d = |(a₂ - a₁)·(b₁ × b₂)| / |b₁ × b₂|. If d = 0, the lines are coplanar and intersect!',
  },
  'differential-equations-lab': {
    title: 'Differential Equations & Slope Fields',
    goal: 'Visualize direction slope fields m = f(x, y), trace exact solution curves, and master the Integrating Factor method.',
    touchAction: 'Drag initial condition point (x₀, y₀), vary parameters P and Q, or switch to Newton’s Cooling to observe thermal equilibrium.',
    mathInsight: 'Integrating Factor I.F. = e^(∫ P dx). Slope field segments represent instantaneous tangent directions dy/dx at every point.',
  },
  'balance-scale-equations': {
    title: 'Balance Scale Linear Equations',
    goal: 'Understand why operations happen to both sides of an equation: eliminate x-boxes or weights from both pans to isolate x.',
    touchAction: 'Tap operation buttons to subtract terms or divide coefficients, and watch the physical scale balance or tilt.',
    mathInsight: 'Golden rule of algebra: An equation remains balanced only when identical operations are applied to both sides simultaneously.',
  },
  'algebraic-identities-tiles': {
    title: 'Algebraic Identities Tiles',
    goal: 'Witness geometric proofs of (a+b)², (a-b)², and a²-b² through dynamic area decomposition.',
    touchAction: 'Drag dimensions a and b, or switch identity modes to see how colored squares and rectangles assemble.',
    mathInsight: '(a + b)² = a² + 2ab + b². The middle term 2ab comes from the two matching a×b rectangles in the expansion corners!',
  },
  'compound-interest-engine': {
    title: 'Compound Interest Growth Engine',
    goal: 'Compare linear Simple Interest growth with exponential Compound Interest growth across different compounding frequencies.',
    touchAction: 'Slide Principal, Rate, Time, and toggle between Annual, Half-Yearly, and Quarterly compounding to see interest snowball.',
    mathInsight: 'A = P(1 + r/100)ⁿ. Compound interest pays interest on previously earned interest, creating exponential wealth acceleration.',
  },
  'quadrilateral-morpher': {
    title: 'Quadrilateral Transformer & Diagonals',
    goal: 'Explore how arbitrary quadrilaterals morph into parallelograms, rhombuses, rectangles, and squares as geometric constraints are locked.',
    touchAction: 'Drag any of the 4 corner vertices, snap to standard shapes, and observe diagonal lengths and intersection angles.',
    mathInsight: 'In a parallelogram, diagonals bisect each other; in a rhombus, they bisect perpendicularly at 90°; in a rectangle, they are equal.',
  },
  'euler-polyhedra-3d': {
    title: 'Euler 3D Polyhedra Workshop',
    goal: "Verify Euler's Formula F + V - E = 2 across 3D polyhedra, and slide to unfold solids into flat 2D nets.",
    touchAction: 'Rotate polyhedra in 3D orbit, toggle wireframe X-ray, and drag the Unfold slider to lay out the printable net.',
    mathInsight: "Euler's characteristic χ = F + V - E = 2 holds for every convex 3D polyhedron without holes.",
  },
  'direct-inverse-proportions': {
    title: 'Direct vs. Inverse Proportions',
    goal: 'Master the contrast between direct variations (ratio constant y/x = k) and inverse variations (product constant x·y = k).',
    touchAction: 'Adjust Speed and Time in Direct mode, or change Worker count in Inverse mode to see project durations shrink.',
    mathInsight: 'Direct variation produces a straight line through the origin (y = kx); inverse variation produces a rectangular hyperbola (xy = k).',
  },
  'dynamic-pie-chart': {
    title: 'Dynamic Pie Chart & Central Angles',
    goal: 'Learn how raw survey frequencies translate into central angles: θ = (frequency / total) × 360°.',
    touchAction: 'Select dataset slices or drag sector values to watch degree protractor arcs and percentages recalculate live.',
    mathInsight: 'The entire circle encompasses 360°. Each slice sector angle is directly proportional to its fraction of the grand total.',
  },
  'square-roots-triplets': {
    title: 'Square Roots & Pythagorean Triplet Forge',
    goal: 'Pack unit tiles into complete squares to test perfect squares, and forge Pythagorean triplets (2m, m²-1, m²+1).',
    touchAction: 'Slide integer N to observe square formation and leftover remainders, or slide m to forge integer right triangles.',
    mathInsight: 'For any integer m > 1: (2m)² + (m² - 1)² = (m² + 1)². This generates infinite primitive and non-primitive Pythagorean triplets.',
  },
  'exponents-powers-lab': {
    title: 'Exponents & Powers Lab',
    goal: 'Master the laws of indices, reciprocal elevators for negative exponents, and cosmic scale scientific notation.',
    touchAction: 'Toggle laws of exponents, slide base a and powers m & n, and explore the cosmic universe scale slider.',
    mathInsight: 'aᵐ × aⁿ = aᵐ⁺ⁿ; a⁻ⁿ = 1/aⁿ. Negative exponents never make a number negative—they invert it!',
  },
  'rational-numbers-density': {
    title: 'Rational Numbers & Infinite Density',
    goal: 'Explore the infinite density property of rational numbers on the number line using bisection and common denominator windows.',
    touchAction: 'Adjust fractions p/q and r/s, zoom into the number line, and insert successive arithmetic means.',
    mathInsight: 'Between any two distinct rational numbers, there are infinitely many rational numbers: (a+b)/2 always lies strictly between them.',
  },
  'triangle-congruence-forge': {
    title: 'Triangle Congruence Criteria Forge',
    goal: 'Test and prove the 5 rigid congruence criteria (SAS, SSS, ASA, AAS, RHS) and bust the invalid SSA & AAA traps.',
    touchAction: 'Select criteria, adjust triangle dimensions, and tap "Test Superimpose" to animate Euclid’s superposition proof.',
    mathInsight: 'SSA is ambiguous because the swinging leg can intersect the baseline in two different places, creating two non-congruent triangles!',
  },
  'arithmetic-progression-lab': {
    title: 'Arithmetic Progression (AP) Ladder',
    goal: 'Visualize the arithmetic progression ladder and discover young Gauss’s interlocking staircase proof for Sₙ = (n/2)(a + l).',
    touchAction: 'Adjust First Term a, Common Difference d, and Number of Terms n, and toggle the Gauss rectangle.',
    mathInsight: 'aₙ = a + (n-1)d. Two identical AP staircases interlock to form an n × (a + l) rectangle, proving Sₙ = n(a + l)/2.',
  },
  'coordinate-section-formula': {
    title: 'Section Formula & Triangle Centroid',
    goal: 'Divide line segments internally and externally in ratio m₁ : m₂, and discover the 2:1 median centroid balance point.',
    touchAction: 'Adjust Point A and B coordinates, slide the ratio m₁:m₂, and toggle the 3D triangle median centroid view.',
    mathInsight: 'P = ((m₁x₂ + m₂x₁)/(m₁+m₂), (m₁y₂ + m₂y₁)/(m₁+m₂)). Cross-multiplication ensures m₁ pairs with B and m₂ pairs with A!',
  },
  'circle-tangents-lab': {
    title: 'Circle Tangents & Perpendicular Radii',
    goal: 'Prove that tangents from an external point are equal in length (PA = PB) and perpendicular to radii at the point of contact.',
    touchAction: 'Slide circle radius r and external distance OP, and toggle RHS congruence and supplementary angle proofs.',
    mathInsight: 'PA = PB = √(OP² - r²). Right angles ∠OAP = ∠OBP = 90° make quadrilateral PAOB cyclic, so ∠APB + ∠AOB = 180°!',
  },
  'mathematical-induction-dominos': {
    title: 'Principle of Mathematical Induction (PMI)',
    goal: 'Witness the domino effect of mathematical induction: Base Case P(1) initiates the fall, and Inductive Step P(k) ⟹ P(k+1) propagates it infinitely.',
    touchAction: 'Verify the Base Case, bridge the Inductive Step, and tap "Topple Dominoes" to initiate the cascade.',
    mathInsight: 'P(1) ∧ [P(k) ⟹ P(k+1)] guarantees truth for every natural number n ∈ ℕ by the Well-Ordering Principle.',
  },
  'trig-equations-radial': {
    title: 'Trigonometric Equations Radial Radar',
    goal: 'Master general infinite families of trigonometric equations across all four quadrants on the unit circle.',
    touchAction: 'Choose sin, cos, or tan, slide target value k, and sweep the radial radar ray through integer periods n.',
    mathInsight: 'sin θ = sin α ⟹ θ = nπ + (-1)ⁿα; cos θ = cos α ⟹ θ = 2nπ ± α; tan θ = tan α ⟹ θ = nπ + α.',
  },
  'linear-programming-lab': {
    title: 'Linear Programming (LPP) & Corner Point Method',
    goal: 'Optimize resource allocation by sweeping iso-profit lines across convex feasible polygonal regions.',
    touchAction: 'Adjust profit weights c₁ & c₂, change inequality constraint limits, and sweep the iso-profit line.',
    mathInsight: 'Fundamental Theorem of LPP: The maximum or minimum value of an objective function Z ALWAYS occurs at an extreme corner vertex of the feasible region.',
  },
  'probability-distribution-lab': {
    title: 'Random Variables & Probability Distributions',
    goal: 'Explore discrete probability distributions, expected value center-of-mass fulcrums, and Law of Large Numbers Monte Carlo trials.',
    touchAction: 'Adjust trial count n and success probability p, and tap "+100 Trials" to watch empirical frequencies converge onto theoretical probabilities.',
    mathInsight: 'Expected value E(X) = np is the physical center of mass of the distribution; Variance Var(X) = np(1-p).',
  },
};

interface Props {
  simulatorId: SimulatorId;
  onOpenControls?: () => void;
  onOpenChallenges?: () => void;
}

export const SimulatorInstructionBanner: React.FC<Props> = ({
  simulatorId,
  onOpenControls,
  onOpenChallenges,
}) => {
  const { activeGuideModal, setActiveGuideModal, setBottomSheetSnap, setActiveSheetTab } = useSimulatorStore();
  const { lightTap } = useHaptics();
  const { playClick } = useSound();

  if (!activeGuideModal) return null;

  const sim = SIMULATORS.find((s) => s.id === simulatorId);

  const instruction = INSTRUCTIONS[simulatorId] || {
    title: 'Interactive Math Time Lab',
    goal: 'Touch and manipulate the visual mathematics simulation.',
    touchAction: 'Touch and drag on the canvas to interact.',
    mathInsight: 'Formulas and parameters update dynamically.',
  };

  const handleClose = () => {
    lightTap();
    playClick();
    setActiveGuideModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between bg-gradient-to-r from-slate-900 to-cyan-950/30">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                {instruction.title}
              </h3>
              <p className="text-[11px] text-slate-400">{"Coach's Quick Concept Briefing"}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close Guide"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3 overflow-y-auto text-xs">
          {/* Objective */}
          <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <Target className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-300 block text-[11px] uppercase tracking-wider mb-0.5">
                Learning Goal
              </span>
              <p className="text-slate-200 text-xs leading-relaxed">{instruction.goal}</p>
            </div>
          </div>

          {/* How to Touch & Drag */}
          <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <Hand className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-cyan-300 block text-[11px] uppercase tracking-wider mb-0.5">
                Interactive Touch Controls
              </span>
              <p className="text-slate-200 text-xs leading-relaxed">{instruction.touchAction}</p>
            </div>
          </div>

          {/* Key Formula in Pure KaTeX */}
          <div className="p-3 rounded-2xl bg-cyan-950/30 border border-cyan-800/40 space-y-1.5">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-bold text-emerald-300 text-[11px] uppercase tracking-wider">
                Pure Mathematical Formula
              </span>
            </div>
            {sim?.latexFormula ? (
              <BlockMath
                math={sim.latexFormula}
                className="bg-slate-900/90 p-2 rounded-xl border border-slate-800"
              />
            ) : (
              <p className="text-slate-300 font-mono text-[11px] leading-relaxed">{instruction.mathInsight}</p>
            )}
            {sim?.coachSecret && (
              <p className="text-[11px] text-cyan-200/90 pt-1 leading-relaxed">
                <strong className="text-amber-300">{"Coach's Intuition: "}</strong>
                {sim.coachSecret}
              </p>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/60 flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              handleClose();
              setActiveSheetTab('theory');
              setBottomSheetSnap('half');
            }}
            className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>Full Theory &amp; Doubts</span>
          </button>

          <button
            type="button"
            onClick={() => {
              handleClose();
              setActiveSheetTab('controls');
              setBottomSheetSnap('half');
            }}
            className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
          >
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span>Open Sliders</span>
          </button>

          <button
            type="button"
            onClick={handleClose}
            className="py-2 px-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-cyan-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Play</span>
          </button>
        </div>
      </div>
    </div>
  );
};
