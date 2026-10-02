export type GradeLevel = 'all' | 'class-8' | 'class-9' | 'class-10' | 'class-11' | 'class-12';

export type SimulatorId = 
  | 'drone-navigator'
  | 'catapult-siege'
  | 'conic-sections' 
  | 'unit-circle' 
  | 'calculus-sandbox' 
  | 'rollercoaster-architect'
  | 'vector-flight-lab'
  | 'argand-plane'
  | 'matrix-meme'
  | 'monty-hall'
  | 'quadratic-roots'
  | 'circle-theorems'
  | 'linear-systems'
  | 'trig-heights'
  | 'heron-triangles'
  | 'polynomial-factorizer'
  | 'lines-angles'
  | 'binomial-galton'
  | 'arithmetic-geometric-explorer'
  | 'hyperbola-ellipse-orbits'
  | 'surface-area-volumes'
  | 'circle-chords-cyclic'
  | 'statistics-visualizer'
  | 'limits-derivatives-lab'
  | 'linear-inequalities'
  | 'permutations-combinations'
  | 'similar-triangles'
  | 'ftc-integral-accumulator'
  | 'bayes-probability-lab'
  | 'euclidean-geometry-sandbox'
  | 'three-d-geometry-lab'
  | 'differential-equations-lab'
  | 'balance-scale-equations'
  | 'algebraic-identities-tiles'
  | 'compound-interest-engine'
  | 'quadrilateral-morpher'
  | 'euler-polyhedra-3d'
  | 'direct-inverse-proportions'
  | 'dynamic-pie-chart'
  | 'square-roots-triplets'
  | 'exponents-powers-lab'
  | 'rational-numbers-density'
  | 'triangle-congruence-forge'
  | 'arithmetic-progression-lab'
  | 'coordinate-section-formula'
  | 'circle-tangents-lab'
  | 'mathematical-induction-dominos'
  | 'trig-equations-radial'
  | 'linear-programming-lab'
  | 'probability-distribution-lab';

export type AppRoute = 'home' | 'landing' | 'teacher' | SimulatorId;

export interface StudentDoubt {
  question: string;
  answer: string;
  latex?: string;
}

export interface ProblemStep {
  stepNumber: number;
  title: string;
  explanation: string;
  latex?: string;
}

export interface SolvedProblem {
  title: string;
  examType: string;
  question: string;
  steps: ProblemStep[];
  finalAnswer: string;
  coachInsight: string;
}

export interface POEOption {
  id: string;
  label: string;
  latex?: string;
  isCorrect: boolean;
  explanation: string;
}

export interface POEInquiry {
  id: string;
  title: string;
  scenario: string;
  question: string;
  latex?: string;
  options: POEOption[];
  observationInstruction: string;
  coachTakeaway: string;
  xpReward: number;
  presetActionType?: string; // e.g. 'h_zero', 'extreme_outlier', 'origin_test', etc.
}

export interface PastYearExamQuestion {
  id: string;
  exam: string; // e.g. 'CBSE Board 2023 (4 Marks)', 'JEE Main 2022'
  year: number;
  marks: string;
  question: string;
  latex?: string;
  solutionSteps: string[];
  finalAnswer: string;
  coachShortcut: string;
  presetActionType?: string;
}

export interface ExamTrap {
  id: string;
  name: string;
  fallacy: string;
  whyWrong: string;
  correctWay: string;
  examFrequency: 'Very High' | 'High' | 'Medium';
  trapPresetType?: string;
}

export interface StressTestCase {
  id: string;
  title: string;
  badge: string;
  description: string;
  boundaryCondition: string;
  latex?: string;
  whyItMatters: string;
  examRelevance: string;
  presetActionType: string;
}

export interface DerivationStep {
  stepNumber: number;
  title: string;
  latex: string;
  operationBadge: string;
  explanation: string;
  coachInsight: string;
  isPivotStep?: boolean;
  highlightTerm?: string;
}

export interface DerivationLadder {
  theoremTitle: string;
  targetFormulaLatex: string;
  startingHypothesis: string;
  steps: DerivationStep[];
  examSignificance: string;
  presetActionType?: string;
}

export interface ScrubbableVariable {
  id: string;
  symbol: string;
  label: string;
  min: number;
  max: number;
  step: number;
  unit?: string;
  landmarks?: { value: number; label: string }[];
}

export interface SimulatorMetadata {
  id: SimulatorId;
  title: string;
  shortTitle: string;
  grade: 'Class 8' | 'Class 9' | 'Class 10' | 'Class 11' | 'Class 12';
  gradeNumber: number;
  category: 'Coordinate Geometry' | 'Conics & 3D' | 'Trigonometry' | 'Calculus' | 'Linear Algebra' | 'Probability' | 'Algebra' | 'Geometry';
  description: string;
  keyConcepts: string[];
  formulaPreview: string;
  latexFormula: string;
  textbookTrap: string;
  coachSecret: string;
  theoryBreakdown?: string;
  doubts?: StudentDoubt[];
  solvedProblem?: SolvedProblem;
  poeInquiry?: POEInquiry;
  pastYearQuestions?: PastYearExamQuestion[];
  examTraps?: ExamTrap[];
  stressTests?: StressTestCase[];
  derivationLadder?: DerivationLadder;
  scrubbableVariables?: ScrubbableVariable[];
  estimatedMinutes: number;
  difficulty: 'Foundation' | 'Intermediate' | 'Advanced';
  tags: string[];
}

export interface NoFlyZone {
  id: string;
  x: number;
  y: number;
  radius: number;
  label: string;
}

export interface DroneParameters {
  droneX: number;
  droneY: number;
  targetX: number;
  targetY: number;
  originX: number;
  originY: number;
  noFlyZones: NoFlyZone[];
  showRightTriangle: boolean;
  showFormulaBreakdown: boolean;
  snapToGrid: boolean;
  batteryPct: number;
}

export interface CatapultParameters {
  angleDeg: number;       // Angle of elevation θ (0 to 90°)
  tension: number;        // Hypotenuse / Initial Velocity magnitude (10 to 45)
  wallHeight: number;     // Height H of castle wall (80 to 240 px)
  wallDistance: number;   // Distance D from catapult to wall (250 to 500 px)
  projectileMass: number; // Boulder mass
  gravity: number;        // World gravity
  showTrajectory: boolean;
  showComponents: boolean;
}

export interface ConicParameters {
  planeAngleDeg: number; // 0 to 90 degrees
  planeHeight: number;   // -3 to +3
  planeRollDeg: number;  // -45 to +45 degrees roll/tilt
  coneApertureDeg: number; // 30 to 60 degrees
  showWireframe: boolean;
  showCuttingPlane: boolean;
  showTraceLine: boolean;
  flashlightIntensity: number; // 0.5 to 2
}

export interface UnitCircleParameters {
  angleDeg: number; // 0 to 360
  frequency: number; // 0.5 to 4
  amplitude: number; // 0.5 to 2
  showSin: boolean;
  showCos: boolean;
  showTan: boolean;
  showWaveProjection: boolean;
  isPlayingAnimation: boolean;
}

export interface CalculusParameters {
  functionType: 'quadratic' | 'cubic' | 'sinusoid' | 'exponential';
  xPoint: number; // tangent point x (-3 to 3)
  riemannPartitions: number; // 2 to 50
  riemannType: 'left' | 'right' | 'midpoint' | 'trapezoid';
  viewMode: 'derivative' | 'integral';
  intervalA: number;
  intervalB: number;
}

export interface RollercoasterPoint {
  x: number;
  y: number;
}

export interface RollercoasterParameters {
  points: RollercoasterPoint[];
  cartProgress: number; // 0 to 1 along track
  isPlaying: boolean;
  cartSpeed: number; // m/s
  friction: number;
  gravity: number;
  showTangents: boolean;
  showPaintArea: boolean;
  showCurvatureComb: boolean;
  challengeActive: boolean;
}

export interface VectorLabParameters {
  vectorU: [number, number, number]; // [x, y, z]
  vectorV: [number, number, number]; // [x, y, z]
  showDotProduct: boolean;
  showCrossProduct: boolean;
  showParallelogram: boolean;
  showAngleArc: boolean;
}

export interface QuadraticParameters {
  a: number; // coefficient of x² (-3 to 3, non-zero)
  b: number; // coefficient of x (-8 to 8)
  c: number; // constant term (-10 to 10)
  showVertex: boolean;
  showAxisOfSymmetry: boolean;
  showRoots: boolean;
  showDiscriminantGlow: boolean;
}

export interface CircleTheoremsParameters {
  radius: number; // 2 to 6
  pointDistance: number; // distance from origin to external point P (3 to 10)
  pointAngleDeg: number; // 0 to 360
  showTangents: boolean;
  showRadii: boolean;
  showCongruentTriangles: boolean;
  showInscribedAngle: boolean;
  inscribedVertexAngleDeg: number;
}

export interface LinearSystemsParameters {
  a1: number;
  b1: number;
  c1: number;
  a2: number;
  b2: number;
  c2: number;
  showIntersection: boolean;
  showGridLines: boolean;
  showSlopeIntercept: boolean;
}

export interface TrigHeightsParameters {
  towerHeight: number; // in meters (10 to 80m)
  observerDistance: number; // in meters (10 to 100m)
  secondObserverDistance: number; // in meters (10 to 100m)
  dualObserverMode: boolean; // compare two observation points
  eyeLevelHeight: number; // 0m (ground) or 1.5m (surveyor)
  viewMode: 'elevation' | 'depression';
  showSightLine: boolean;
  showAngleArc: boolean;
  showTanRatio: boolean;
}

export interface HeronParameters {
  ax: number;
  ay: number;
  bx: number;
  by: number;
  cx: number;
  cy: number;
  showIncircle: boolean;
  showAltitude: boolean;
  showStepBreakdown: boolean;
}

export interface PolynomialFactorizerParameters {
  mode: 'tiles' | 'difference-squares' | 'perfect-square';
  p: number; // e.g. 2 in (x + p)
  q: number; // e.g. 3 in (x + q)
  xSize: number; // visual scale of x
  showGrid: boolean;
  showAlgebraExpansion: boolean;
}

export interface LinesAnglesParameters {
  mode: 'transversal' | 'zigzag';
  lineAngleDeg: number;
  transversalAngleDeg: number;
  transversalOffset: number;
  zigzagBendDeg: number;
  showCorresponding: boolean;
  showAlternate: boolean;
  showInterior: boolean;
  showProofOverlay: boolean;
}

export interface BinomialGaltonParameters {
  nPower: number; // 1 to 10
  ballSpeed: number; // 1 to 3
  isDropping: boolean;
  showPascalValues: boolean;
  showBellCurve: boolean;
  showExpansionTerms: boolean;
}

export interface SequenceExplorerParameters {
  mode: 'AP' | 'GP' | 'InfiniteGP';
  a1: number;
  diffOrRatio: number; // d for AP, r for GP
  nTerms: number;
  showVisualBars: boolean;
  showGaussPairing: boolean;
  showInfiniteSumBox: boolean;
}

export interface ConicFocalParameters {
  conicType: 'ellipse' | 'hyperbola';
  semiMajorA: number;
  eccentricity: number; // e < 1 for ellipse, e > 1 for hyperbola
  showString: boolean;
  showDirectrix: boolean;
  showOrbitingPlanet: boolean;
  showFocalRays: boolean;
}

export interface SurfaceAreaVolumesParameters {
  solidType: 'cylinder' | 'cone' | 'sphere' | 'cuboid';
  radius: number;
  height: number;
  length: number;
  width: number;
  unfoldPercent: number; // 0 to 100
  liquidPourProgress: number; // 0 to 100
  isPouring: boolean;
  showDimensions: boolean;
  showFormulaDerivation: boolean;
}

export interface CircleChordsCyclicParameters {
  mode: 'perpendicular-chord' | 'cyclic-quadrilateral' | 'equal-chords';
  circleRadius: number;
  chordDistance: number;
  angleA: number; // in degrees
  angleB: number;
  angleC: number;
  angleD: number;
  vertexDOffset: number; // 0 = exactly on circle, > 0 outside, < 0 inside
  showAuxiliaryRadii: boolean;
  showSupplementarySum: boolean;
  showRightAngleMark: boolean;
}

export interface StatisticsVisualizerParameters {
  mode: 'fulcrum' | 'histogram' | 'outlier-tug';
  dataPoints: number[];
  outlierValue: number;
  binWidth: number;
  showMeanFulcrum: boolean;
  showMedianLine: boolean;
  showModePeak: boolean;
  showFrequencyPolygon: boolean;
}

export interface LimitsDerivativesParameters {
  functionType: 'x2' | 'x3' | 'sin_x' | 'sqrt_x' | 'reciprocal';
  x0: number;
  hStep: number;
  zoomLevel: number;
  showSecantLine: boolean;
  showTangentLine: boolean;
  showDifferenceQuotient: boolean;
  showSqueezeTheorem: boolean;
  isApproachingZero: boolean;
}

export interface LinearInequalitiesParameters {
  a1: number;
  b1: number;
  c1: number;
  op1: '<=' | '>=';
  a2: number;
  b2: number;
  c2: number;
  op2: '<=' | '>=';
  nonNegativeConstraints: boolean;
  testPointX: number;
  testPointY: number;
  showCornerPoints: boolean;
  showObjectiveLine: boolean;
  objectiveP: number;
  objectiveQ: number;
}

export interface PermutationsCombinationsParameters {
  mode: 'permutations' | 'combinations' | 'circular-table';
  nTotal: number;
  rChosen: number;
  showFactorialTree: boolean;
  showDuplicateCancel: boolean;
  tableRotationDeg: number;
}

export interface SimilarTrianglesParameters {
  mode: 'bpt-slider' | 'shadow-scaling' | 'similarity-criteria';
  triangleType: 'acute' | 'right' | 'obtuse';
  vertexAx: number;
  vertexAy: number;
  vertexBx: number;
  vertexBy: number;
  vertexCx: number;
  vertexCy: number;
  transversalRatio: number; // 0.1 to 0.9 (position of D along AB and E along AC)
  showAltitudes: boolean; // For BPT area-ratio proof
  showAreaRatios: boolean;
  showAngleMarkers: boolean;
  sunElevationAngle: number; // degrees for shadow mode
  poleHeight: number; // m
}

export interface FTCIntegralParameters {
  functionType: 'quadratic' | 'sinusoid' | 'cubic' | 'exponential';
  lowerBoundA: number; // lower limit of integration
  upperBoundX: number; // variable upper bound x for A(x) = ∫_a^x f(t) dt
  riemannMethod: 'left' | 'right' | 'midpoint' | 'trapezoid' | 'exact';
  rectanglesN: number; // 4 to 100
  showAccumulationCurve: boolean; // Graph of A(x)
  showTangentSlopeAtX: boolean; // Tangent slope = f(x)
  showNetSignedArea: boolean; // Color green for positive area, red for negative
}

export interface BayesProbabilityParameters {
  scenario: 'medical-test' | 'spam-filter' | 'rare-defect';
  prevalenceP_A: number; // Prior probability P(A) (e.g. 0.02 = 2%)
  sensitivityP_B_given_A: number; // True Positive rate P(B|A) (e.g. 0.95 = 95%)
  falsePositiveRateP_B_given_notA: number; // False Positive rate P(B|A') (e.g. 0.05 = 5%)
  populationTotal: number; // Visual icon population (e.g. 1000)
  activeVisualMode: 'frequency-tree' | 'population-grid' | 'venn-matrix';
  testResultPositive: boolean; // Observed evidence
}

export interface EuclideanGeometryParameters {
  geometryModel: 'flat-euclidean' | 'spherical-elliptic' | 'hyperbolic-saddle';
  parallelPostulateAngle1: number; // degrees on transversal interior
  parallelPostulateAngle2: number; // degrees on transversal interior
  triangleVertexLat1: number;
  triangleVertexLon1: number;
  triangleVertexLat2: number;
  triangleVertexLon2: number;
  triangleVertexLat3: number;
  triangleVertexLon3: number;
  showParallelLines: boolean;
  showGeodesics: boolean;
  showAngleSumMeter: boolean;
}

export interface ThreeDGeometryParameters {
  lineMode: 'skew' | 'intersecting' | 'parallel';
  pointA1: [number, number, number];
  dirB1: [number, number, number];
  pointA2: [number, number, number];
  dirB2: [number, number, number];
  showShortestSegment: boolean;
  showCommonPerpendicularVector: boolean;
  showParallelPlanes: boolean;
  cameraOrbitX: number;
  cameraOrbitY: number;
}

export interface DifferentialEquationsParameters {
  modelType: 'linear-first-order' | 'newton-cooling' | 'logistic-growth';
  pCoeff: number;
  qCoeff: number;
  coolingK: number;
  ambientTemp: number;
  initialX: number;
  initialY: number;
  gridDensity: number;
  showSlopeField: boolean;
  showIntegratingFactorCurve: boolean;
  showAnalyticalSolution: boolean;
  stepSizeH: number;
}

export interface BalanceScaleParameters {
  leftXCount: number;
  leftWeight: number;
  rightXCount: number;
  rightWeight: number;
  actualXValue: number;
  showEquationChalkboard: boolean;
  panTiltAngleDeg: number;
  highlightDifference: boolean;
  activeStep: 'setup' | 'subtract-x' | 'subtract-const' | 'divide-coeff';
}

export interface AlgebraicTilesParameters {
  identityMode: 'a-plus-b-sq' | 'a-minus-b-sq' | 'a-sq-minus-b-sq' | 'middle-term-factor';
  aValue: number;
  bValue: number;
  middleFactorP: number;
  middleFactorQ: number;
  showTileAreas: boolean;
  showExpansionCutout: boolean;
  explodedView: boolean;
}

export interface CompoundInterestParameters {
  principal: number;
  ratePct: number;
  timeYears: number;
  frequency: 'annually' | 'half-yearly' | 'quarterly';
  showComparisonBars: boolean;
  showGrowthStaircase: boolean;
  highlightInterestOnInterest: boolean;
}

export interface QuadrilateralMorpherParameters {
  quadType: 'arbitrary' | 'parallelogram' | 'rhombus' | 'rectangle' | 'square' | 'kite' | 'trapezium';
  vertexA: [number, number];
  vertexB: [number, number];
  vertexC: [number, number];
  vertexD: [number, number];
  showDiagonals: boolean;
  showDiagonalAngle: boolean;
  showSideLengths: boolean;
  showInternalAngles: boolean;
  showParallelMarkers: boolean;
}

export interface EulerPolyhedraParameters {
  solidType: 'cube' | 'tetrahedron' | 'octahedron' | 'triangular-prism' | 'square-pyramid' | 'pentagonal-prism';
  unfoldProgress: number;
  showVertices: boolean;
  showEdges: boolean;
  showFaces: boolean;
  cameraOrbitX: number;
  cameraOrbitY: number;
  xrayWireframe: boolean;
}

export interface DirectInverseParameters {
  mode: 'direct-speed' | 'inverse-workers';
  directX: number;
  directConstantK: number;
  inverseWorkers: number;
  inverseTotalWorkDays: number;
  showCoordinateGraph: boolean;
  showTableValues: boolean;
}

export interface DynamicPieChartParameters {
  datasetKey: 'favorite-sports' | 'student-budget' | 'daily-activities';
  slices: { label: string; value: number; color: string }[];
  selectedSliceIndex: number | null;
  showProtractorAngle: boolean;
  showPercentages: boolean;
  showFractionFormula: boolean;
}

export interface SquareRootsTripletsParameters {
  mode: 'tile-packing' | 'pythagorean-triplet-forge';
  numberN: number;
  tripletM: number;
  showRemainingTiles: boolean;
  showLongDivisionSteps: boolean;
  showRightTriangleProof: boolean;
}

export interface ExponentsPowersParameters {
  baseA: number;
  exponentM: number;
  exponentN: number;
  ruleMode: 'product' | 'quotient' | 'power-of-power' | 'negative-exponent' | 'zero-exponent' | 'scientific-notation';
  microscopeZoomPower: number; // -15 to 15
  showDecompositionTiles: boolean;
}

export interface RationalNumbersParameters {
  fractionA_num: number;
  fractionA_den: number;
  fractionB_num: number;
  fractionB_den: number;
  zoomLevel: number;
  subdivisions: number;
  meanStepsCount: number;
  showDecimalEquivalent: boolean;
}

export interface TriangleCongruenceParameters {
  criterion: 'SAS' | 'SSS' | 'ASA' | 'AAS' | 'RHS' | 'SSA-AMBIGUOUS';
  sideA: number;
  sideB: number;
  sideC: number;
  angleA: number;
  angleB: number;
  showOverlayComparison: boolean;
  isSecondAmbiguousVisible: boolean;
}

export interface ArithmeticProgressionParameters {
  firstTermA: number;
  commonDiffD: number;
  numberOfTermsN: number;
  showGaussRectangle: boolean;
  showTermList: boolean;
  highlightTermIndex: number;
}

export interface CoordinateSectionParameters {
  pointAx: number;
  pointAy: number;
  pointBx: number;
  pointBy: number;
  ratioM1: number;
  ratioM2: number;
  divisionType: 'internal' | 'external';
  showMidpointFormula: boolean;
  showCentroidTriangle: boolean;
}

export interface CircleTangentsParameters {
  circleRadius: number;
  pointDistanceOP: number;
  angleOffsetDeg: number;
  showRadiiPerpendicular: boolean;
  showCongruentTriangles: boolean;
  showCyclicAngleProperty: boolean;
}

export interface MathematicalInductionParameters {
  propositionType: 'sum-natural' | 'sum-squares' | 'powers-inequality' | 'divisibility-rule';
  targetN: number;
  dominoFallProgress: number; // 0 to 1
  isBaseCaseVerified: boolean;
  isInductiveStepUnlocked: boolean;
}

export interface TrigEquationsRadialParameters {
  targetFunction: 'sin' | 'cos' | 'tan';
  targetValue: number;
  sweepAngleDeg: number;
  showAllQuadrants: boolean;
  showGeneralFormulas: boolean;
  rangePeriods: number;
}

export interface LinearProgrammingParameters {
  objectiveMaximize: boolean;
  profitX: number;
  profitY: number;
  constraint1_limit: number;
  constraint2_limit: number;
  showFeasibleRegion: boolean;
  showIsoProfitSlider: boolean;
  isoProfitValue: number;
}

export interface ProbabilityDistributionParameters {
  experimentType: 'coin-toss-n' | 'dice-sum' | 'cards-draw';
  numberOfTrials: number;
  sampleSize: number;
  showTheoreticalDistribution: boolean;
  showMeanVariance: boolean;
}

export interface UserProgress {
  completedSimulatorIds: SimulatorId[];
  simulatorPlayCounts: Record<SimulatorId, number>;
  bookmarkedIds: SimulatorId[];
  lastVisitedSimulatorId: SimulatorId | null;
  xpPoints: number;
  streakDays: number;
}
