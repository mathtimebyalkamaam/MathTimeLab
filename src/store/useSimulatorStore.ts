import { create } from 'zustand';
import {
  AppRoute,
  BinomialGaltonParameters,
  CalculusParameters,
  CatapultParameters,
  CircleChordsCyclicParameters,
  CircleTheoremsParameters,
  ConicFocalParameters,
  ConicParameters,
  DroneParameters,
  GradeLevel,
  HeronParameters,
  LimitsDerivativesParameters,
  LinearInequalitiesParameters,
  LinesAnglesParameters,
  LinearSystemsParameters,
  PermutationsCombinationsParameters,
  PolynomialFactorizerParameters,
  QuadraticParameters,
  RollercoasterParameters,
  SequenceExplorerParameters,
  SimilarTrianglesParameters,
  SimulatorId,
  StatisticsVisualizerParameters,
  SurfaceAreaVolumesParameters,
  TrigHeightsParameters,
  UnitCircleParameters,
  VectorLabParameters,
  FTCIntegralParameters,
  BayesProbabilityParameters,
  EuclideanGeometryParameters,
  ThreeDGeometryParameters,
  DifferentialEquationsParameters,
  BalanceScaleParameters,
  AlgebraicTilesParameters,
  CompoundInterestParameters,
  QuadrilateralMorpherParameters,
  EulerPolyhedraParameters,
  DirectInverseParameters,
  DynamicPieChartParameters,
  SquareRootsTripletsParameters,
  ExponentsPowersParameters,
  RationalNumbersParameters,
  TriangleCongruenceParameters,
  ArithmeticProgressionParameters,
  CoordinateSectionParameters,
  CircleTangentsParameters,
  MathematicalInductionParameters,
  TrigEquationsRadialParameters,
  LinearProgrammingParameters,
  ProbabilityDistributionParameters,
} from '../types/simulators';

export type BottomSheetSnap = 'peek' | 'half' | 'full' | 'closed';
export type SheetTab = 'controls' | 'theory' | 'mission';

interface SimulatorStoreState {
  // Navigation & View
  currentRoute: AppRoute;
  activeSimulatorId: SimulatorId | null;
  gradeFilter: GradeLevel;
  searchQuery: string;

  // Bottom Sheet Mobile Controls
  isBottomSheetOpen: boolean;
  bottomSheetSnap: BottomSheetSnap;
  activeSheetTab: SheetTab;

  // Desktop 3-Column Cockpit Panels (Left: Inputs, Center: Simulator, Right: Theory & Results)
  isLeftSidebarOpen: boolean;
  isRightSidebarOpen: boolean;
  isLeftSidebarWide: boolean;
  toggleLeftSidebarWide: () => void;
  isCompactControlsMode: boolean;
  toggleCompactControlsMode: () => void;
  isCanvasHudPinned: boolean;
  toggleCanvasHudPinned: () => void;

  // Author & Educator Profile Modal (Alka Ma'am - itsmathtime.co.in)
  isAuthorModalOpen: boolean;
  setIsAuthorModalOpen: (open: boolean) => void;

  // Zen / Pure Canvas Focus Mode (Mobile Space Optimizer)
  isZenMode: boolean;
  activeGuideModal: boolean;
  activeMissionsModal: boolean;

  // Priority 1: Predict-Observe-Explain (POE) & Real Past-Year Exam Questions (PYQ)
  isPOEModalOpen: boolean;
  activePOEInquiryId: string | null;
  poePredictions: Record<string, { selectedOptionId: string; isCorrect: boolean; timestamp: number }>;
  isExamPYQModalOpen: boolean;
  activePYQExamId: string | null;

  // Priority 2: Stress-Testing & Degenerate Modes, Dynamic Hint Ladder, Speed Drills
  isStressTestModalOpen: boolean;
  isSpeedDrillModalOpen: boolean;
  revealedHints: Record<string, number>;

  // Priority 3: Interactive Derivation Ladder & Scrubbable Formula
  isDerivationLadderModalOpen: boolean;

  // Class 8 Student Odyssey & Audit Enhancements
  isEli13Mode: boolean;
  isClass8OdysseyOpen: boolean;
  isSecretShortcutsOpen: boolean;
  isClass8BadgesOpen: boolean;
  isConceptQuizOpen: boolean;
  activeQuizTopicId: SimulatorId | null;
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;

  // Student Progress & Gamification
  xp: number;
  streakDays: number;
  completedSimulators: SimulatorId[];
  bookmarkedSimulators: SimulatorId[];
  unlockedBadges: string[];
  challengeCompleted: Record<string, boolean>;

  // Individual Simulator Configurations
  droneParams: DroneParameters;
  catapultParams: CatapultParameters;
  conicParams: ConicParameters;
  unitCircleParams: UnitCircleParameters;
  calculusParams: CalculusParameters;
  rollercoasterParams: RollercoasterParameters;
  vectorParams: VectorLabParameters;
  quadraticParams: QuadraticParameters;
  circleTheoremsParams: CircleTheoremsParameters;
  linearSystemsParams: LinearSystemsParameters;
  trigHeightsParams: TrigHeightsParameters;
  heronParams: HeronParameters;
  polynomialParams: PolynomialFactorizerParameters;
  linesAnglesParams: LinesAnglesParameters;
  binomialGaltonParams: BinomialGaltonParameters;
  sequenceParams: SequenceExplorerParameters;
  conicFocalParams: ConicFocalParameters;
  surfaceAreaParams: SurfaceAreaVolumesParameters;
  circleChordsParams: CircleChordsCyclicParameters;
  statisticsParams: StatisticsVisualizerParameters;
  limitsDerivativesParams: LimitsDerivativesParameters;
  linearInequalitiesParams: LinearInequalitiesParameters;
  permutationsCombinationsParams: PermutationsCombinationsParameters;
  similarTrianglesParams: SimilarTrianglesParameters;
  ftcIntegralParams: FTCIntegralParameters;
  bayesProbabilityParams: BayesProbabilityParameters;
  euclideanParams: EuclideanGeometryParameters;
  threeDParams: ThreeDGeometryParameters;
  diffEqParams: DifferentialEquationsParameters;
  balanceScaleParams: BalanceScaleParameters;
  algebraicTilesParams: AlgebraicTilesParameters;
  compoundInterestParams: CompoundInterestParameters;
  quadrilateralParams: QuadrilateralMorpherParameters;
  eulerPolyhedraParams: EulerPolyhedraParameters;
  directInverseParams: DirectInverseParameters;
  dynamicPieChartParams: DynamicPieChartParameters;
  squareRootsParams: SquareRootsTripletsParameters;
  exponentsParams: ExponentsPowersParameters;
  rationalNumbersParams: RationalNumbersParameters;
  triangleCongruenceParams: TriangleCongruenceParameters;
  apParams: ArithmeticProgressionParameters;
  coordinateSectionParams: CoordinateSectionParameters;
  circleTangentsParams: CircleTangentsParameters;
  inductionParams: MathematicalInductionParameters;
  trigEquationsParams: TrigEquationsRadialParameters;
  linearProgParams: LinearProgrammingParameters;
  probDistParams: ProbabilityDistributionParameters;

  // Actions
  navigateTo: (route: AppRoute) => void;
  setGradeFilter: (grade: GradeLevel) => void;
  setSearchQuery: (query: string) => void;

  setBottomSheetOpen: (open: boolean) => void;
  setBottomSheetSnap: (snap: BottomSheetSnap) => void;
  setActiveSheetTab: (tab: SheetTab) => void;
  toggleBottomSheet: () => void;

  toggleLeftSidebar: () => void;
  toggleRightSidebar: () => void;
  setLeftSidebarOpen: (open: boolean) => void;
  setRightSidebarOpen: (open: boolean) => void;

  toggleZenMode: () => void;
  setZenMode: (zen: boolean) => void;
  setActiveGuideModal: (open: boolean) => void;
  setActiveMissionsModal: (open: boolean) => void;
  openPOEModal: (inquiryId?: string) => void;
  closePOEModal: () => void;
  recordPOEPrediction: (inquiryId: string, optionId: string, isCorrect: boolean, xpReward: number) => void;
  openExamPYQModal: (pyqId?: string) => void;
  closeExamPYQModal: () => void;
  openStressTestModal: () => void;
  closeStressTestModal: () => void;
  openSpeedDrillModal: () => void;
  closeSpeedDrillModal: () => void;
  openDerivationLadderModal: () => void;
  closeDerivationLadderModal: () => void;
  unlockHint: (challengeKey: string, tier: 1 | 2 | 3, costXp: number) => void;

  toggleEli13Mode: () => void;
  setEli13Mode: (mode: boolean) => void;
  setClass8OdysseyOpen: (open: boolean) => void;
  setSecretShortcutsOpen: (open: boolean) => void;
  setClass8BadgesOpen: (open: boolean) => void;
  openConceptQuizModal: (topicId?: SimulatorId) => void;
  closeConceptQuizModal: () => void;
  unlockBadge: (badgeId: string) => void;

  updateDroneParams: (params: Partial<DroneParameters>) => void;
  updateCatapultParams: (params: Partial<CatapultParameters>) => void;
  updateConicParams: (params: Partial<ConicParameters>) => void;
  updateUnitCircleParams: (params: Partial<UnitCircleParameters>) => void;
  updateCalculusParams: (params: Partial<CalculusParameters>) => void;
  updateRollercoasterParams: (params: Partial<RollercoasterParameters>) => void;
  updateVectorParams: (params: Partial<VectorLabParameters>) => void;
  updateQuadraticParams: (params: Partial<QuadraticParameters>) => void;
  updateCircleTheoremsParams: (params: Partial<CircleTheoremsParameters>) => void;
  updateLinearSystemsParams: (params: Partial<LinearSystemsParameters>) => void;
  updateTrigHeightsParams: (params: Partial<TrigHeightsParameters>) => void;
  updateHeronParams: (params: Partial<HeronParameters>) => void;
  updatePolynomialParams: (params: Partial<PolynomialFactorizerParameters>) => void;
  updateLinesAnglesParams: (params: Partial<LinesAnglesParameters>) => void;
  updateBinomialGaltonParams: (params: Partial<BinomialGaltonParameters>) => void;
  updateSequenceParams: (params: Partial<SequenceExplorerParameters>) => void;
  updateConicFocalParams: (params: Partial<ConicFocalParameters>) => void;
  updateSurfaceAreaParams: (params: Partial<SurfaceAreaVolumesParameters>) => void;
  updateCircleChordsParams: (params: Partial<CircleChordsCyclicParameters>) => void;
  updateStatisticsParams: (params: Partial<StatisticsVisualizerParameters>) => void;
  updateLimitsDerivativesParams: (params: Partial<LimitsDerivativesParameters>) => void;
  updateLinearInequalitiesParams: (params: Partial<LinearInequalitiesParameters>) => void;
  updatePermutationsCombinationsParams: (params: Partial<PermutationsCombinationsParameters>) => void;
  updateSimilarTrianglesParams: (params: Partial<SimilarTrianglesParameters>) => void;
  updateFTCIntegralParams: (params: Partial<FTCIntegralParameters>) => void;
  updateBayesProbabilityParams: (params: Partial<BayesProbabilityParameters>) => void;
  updateEuclideanParams: (params: Partial<EuclideanGeometryParameters>) => void;
  updateThreeDParams: (params: Partial<ThreeDGeometryParameters>) => void;
  updateDiffEqParams: (params: Partial<DifferentialEquationsParameters>) => void;
  updateBalanceScaleParams: (params: Partial<BalanceScaleParameters>) => void;
  updateAlgebraicTilesParams: (params: Partial<AlgebraicTilesParameters>) => void;
  updateCompoundInterestParams: (params: Partial<CompoundInterestParameters>) => void;
  updateQuadrilateralParams: (params: Partial<QuadrilateralMorpherParameters>) => void;
  updateEulerPolyhedraParams: (params: Partial<EulerPolyhedraParameters>) => void;
  updateDirectInverseParams: (params: Partial<DirectInverseParameters>) => void;
  updateDynamicPieChartParams: (params: Partial<DynamicPieChartParameters>) => void;
  updateSquareRootsParams: (params: Partial<SquareRootsTripletsParameters>) => void;
  updateExponentsParams: (params: Partial<ExponentsPowersParameters>) => void;
  updateRationalNumbersParams: (params: Partial<RationalNumbersParameters>) => void;
  updateTriangleCongruenceParams: (params: Partial<TriangleCongruenceParameters>) => void;
  updateApParams: (params: Partial<ArithmeticProgressionParameters>) => void;
  updateCoordinateSectionParams: (params: Partial<CoordinateSectionParameters>) => void;
  updateCircleTangentsParams: (params: Partial<CircleTangentsParameters>) => void;
  updateInductionParams: (params: Partial<MathematicalInductionParameters>) => void;
  updateTrigEquationsParams: (params: Partial<TrigEquationsRadialParameters>) => void;
  updateLinearProgParams: (params: Partial<LinearProgrammingParameters>) => void;
  updateProbDistParams: (params: Partial<ProbabilityDistributionParameters>) => void;
  resetParams: (id: SimulatorId) => void;

  markCompleted: (id: SimulatorId) => void;
  toggleBookmark: (id: SimulatorId) => void;
  completeChallenge: (challengeKey: string, xpReward?: number) => void;
  addXp: (amount: number) => void;
}

const DEFAULT_DRONE: DroneParameters = {
  droneX: 0,
  droneY: 0,
  targetX: 6,
  targetY: 8,
  originX: 0,
  originY: 0,
  noFlyZones: [
    { id: 'nfz-1', x: 3, y: 4, radius: 1.8, label: 'Airport Radar' },
    { id: 'nfz-2', x: -4, y: 3, radius: 2.0, label: 'Hospital Helipad' },
    { id: 'nfz-3', x: 2, y: -4, radius: 1.6, label: 'Radio Tower' },
  ],
  showRightTriangle: true,
  showFormulaBreakdown: true,
  snapToGrid: true,
  batteryPct: 100,
};

const DEFAULT_CATAPULT: CatapultParameters = {
  angleDeg: 45,
  tension: 26,
  wallHeight: 160,
  wallDistance: 380,
  projectileMass: 1.5,
  gravity: 0.9,
  showTrajectory: true,
  showComponents: true,
};

const DEFAULT_CONIC: ConicParameters = {
  planeAngleDeg: 35,
  planeHeight: 0.2,
  planeRollDeg: 0,
  coneApertureDeg: 45,
  showWireframe: false,
  showCuttingPlane: true,
  showTraceLine: true,
  flashlightIntensity: 1.2,
};

const DEFAULT_UNIT_CIRCLE: UnitCircleParameters = {
  angleDeg: 45,
  frequency: 1,
  amplitude: 1,
  showSin: true,
  showCos: true,
  showTan: true,
  showWaveProjection: true,
  isPlayingAnimation: false,
};

const DEFAULT_ROLLERCOASTER: RollercoasterParameters = {
  points: [
    { x: 50, y: 110 },
    { x: 200, y: 320 },
    { x: 380, y: 160 },
    { x: 540, y: 280 },
    { x: 720, y: 210 },
  ],
  cartProgress: 0,
  isPlaying: true,
  cartSpeed: 0,
  friction: 0.001,
  gravity: 9.8,
  showTangents: true,
  showPaintArea: true,
  showCurvatureComb: true,
  challengeActive: false,
};

const DEFAULT_CALCULUS: CalculusParameters = {
  functionType: 'quadratic',
  xPoint: 1.0,
  riemannPartitions: 12,
  riemannType: 'midpoint',
  viewMode: 'derivative',
  intervalA: -1.5,
  intervalB: 2.0,
};

const DEFAULT_VECTOR: VectorLabParameters = {
  vectorU: [2.5, 1.8, 0],
  vectorV: [0.8, 2.6, 1.2],
  showDotProduct: true,
  showCrossProduct: true,
  showParallelogram: true,
  showAngleArc: true,
};

const DEFAULT_QUADRATIC: QuadraticParameters = {
  a: 1,
  b: -2,
  c: -3,
  showVertex: true,
  showAxisOfSymmetry: true,
  showRoots: true,
  showDiscriminantGlow: true,
};

const DEFAULT_CIRCLE_THEOREMS: CircleTheoremsParameters = {
  radius: 3.5,
  pointDistance: 6.5,
  pointAngleDeg: 35,
  showTangents: true,
  showRadii: true,
  showCongruentTriangles: true,
  showInscribedAngle: true,
  inscribedVertexAngleDeg: 120,
};

const DEFAULT_LINEAR_SYSTEMS: LinearSystemsParameters = {
  a1: 2,
  b1: 1,
  c1: 5,
  a2: 1,
  b2: -1,
  c2: 1,
  showIntersection: true,
  showGridLines: true,
  showSlopeIntercept: true,
};

const DEFAULT_TRIG_HEIGHTS: TrigHeightsParameters = {
  towerHeight: 30,
  observerDistance: 30 * Math.sqrt(3), // ~51.96m so tan is 1/√3 (30°)
  secondObserverDistance: 30, // 30m so tan is 1 (45°)
  dualObserverMode: true,
  eyeLevelHeight: 0,
  viewMode: 'elevation',
  showSightLine: true,
  showAngleArc: true,
  showTanRatio: true,
};

const DEFAULT_HERON: HeronParameters = {
  ax: 0,
  ay: 0,
  bx: 6,
  by: 0,
  cx: 3,
  cy: 4,
  showIncircle: true,
  showAltitude: true,
  showStepBreakdown: true,
};

const DEFAULT_POLYNOMIAL_FACTORIZER: PolynomialFactorizerParameters = {
  mode: 'tiles',
  p: 2,
  q: 3,
  xSize: 3,
  showGrid: true,
  showAlgebraExpansion: true,
};

const DEFAULT_LINES_ANGLES: LinesAnglesParameters = {
  mode: 'transversal',
  lineAngleDeg: 0,
  transversalAngleDeg: 65,
  transversalOffset: 0,
  zigzagBendDeg: 80,
  showCorresponding: true,
  showAlternate: true,
  showInterior: true,
  showProofOverlay: false,
};

const DEFAULT_BINOMIAL_GALTON: BinomialGaltonParameters = {
  nPower: 6,
  ballSpeed: 1.5,
  isDropping: false,
  showPascalValues: true,
  showBellCurve: true,
  showExpansionTerms: true,
};

const DEFAULT_SEQUENCE_EXPLORER: SequenceExplorerParameters = {
  mode: 'AP',
  a1: 2,
  diffOrRatio: 3,
  nTerms: 6,
  showVisualBars: true,
  showGaussPairing: true,
  showInfiniteSumBox: true,
};

const DEFAULT_CONIC_FOCAL: ConicFocalParameters = {
  conicType: 'ellipse',
  semiMajorA: 5,
  eccentricity: 0.6,
  showString: true,
  showDirectrix: true,
  showOrbitingPlanet: true,
  showFocalRays: true,
};

const DEFAULT_SURFACE_AREA: SurfaceAreaVolumesParameters = {
  solidType: 'cylinder',
  radius: 3,
  height: 6,
  length: 5,
  width: 4,
  unfoldPercent: 0,
  liquidPourProgress: 0,
  isPouring: false,
  showDimensions: true,
  showFormulaDerivation: true,
};

const DEFAULT_CIRCLE_CHORDS: CircleChordsCyclicParameters = {
  mode: 'perpendicular-chord',
  circleRadius: 6,
  chordDistance: 3.6,
  angleA: 85,
  angleB: 95,
  angleC: 95,
  angleD: 85,
  vertexDOffset: 0,
  showAuxiliaryRadii: true,
  showSupplementarySum: true,
  showRightAngleMark: true,
};

const DEFAULT_STATISTICS: StatisticsVisualizerParameters = {
  mode: 'fulcrum',
  dataPoints: [12, 14, 15, 15, 16, 18, 20, 26],
  outlierValue: 26,
  binWidth: 5,
  showMeanFulcrum: true,
  showMedianLine: true,
  showModePeak: true,
  showFrequencyPolygon: false,
};

const DEFAULT_LIMITS_DERIVATIVES: LimitsDerivativesParameters = {
  functionType: 'x2',
  x0: 1.5,
  hStep: 1.0,
  zoomLevel: 1,
  showSecantLine: true,
  showTangentLine: true,
  showDifferenceQuotient: true,
  showSqueezeTheorem: false,
  isApproachingZero: false,
};

const DEFAULT_LINEAR_INEQUALITIES: LinearInequalitiesParameters = {
  a1: 1,
  b1: 1,
  c1: 6,
  op1: '<=',
  a2: 2,
  b2: 1,
  c2: 8,
  op2: '<=',
  nonNegativeConstraints: true,
  testPointX: 2,
  testPointY: 2,
  showCornerPoints: true,
  showObjectiveLine: false,
  objectiveP: 3,
  objectiveQ: 4,
};

const DEFAULT_PERMUTATIONS_COMBINATIONS: PermutationsCombinationsParameters = {
  mode: 'permutations',
  nTotal: 4,
  rChosen: 2,
  showFactorialTree: true,
  showDuplicateCancel: true,
  tableRotationDeg: 0,
};

const DEFAULT_SIMILAR_TRIANGLES: SimilarTrianglesParameters = {
  mode: 'bpt-slider',
  triangleType: 'acute',
  vertexAx: 200,
  vertexAy: 40,
  vertexBx: 60,
  vertexBy: 280,
  vertexCx: 340,
  vertexCy: 280,
  transversalRatio: 0.45,
  showAltitudes: true,
  showAreaRatios: true,
  showAngleMarkers: true,
  sunElevationAngle: 38,
  poleHeight: 3.5,
};

const DEFAULT_FTC_INTEGRAL: FTCIntegralParameters = {
  functionType: 'quadratic',
  lowerBoundA: 0,
  upperBoundX: 2.5,
  riemannMethod: 'midpoint',
  rectanglesN: 16,
  showAccumulationCurve: true,
  showTangentSlopeAtX: true,
  showNetSignedArea: true,
};

const DEFAULT_BAYES_PROBABILITY: BayesProbabilityParameters = {
  scenario: 'medical-test',
  prevalenceP_A: 0.02,
  sensitivityP_B_given_A: 0.95,
  falsePositiveRateP_B_given_notA: 0.05,
  populationTotal: 1000,
  activeVisualMode: 'frequency-tree',
  testResultPositive: true,
};

const DEFAULT_EUCLIDEAN: EuclideanGeometryParameters = {
  geometryModel: 'flat-euclidean',
  parallelPostulateAngle1: 85,
  parallelPostulateAngle2: 85,
  triangleVertexLat1: 90, // North Pole
  triangleVertexLon1: 0,
  triangleVertexLat2: 0,  // Equator at 0° Lon
  triangleVertexLon2: 0,
  triangleVertexLat3: 0,  // Equator at 90° East
  triangleVertexLon3: 90,
  showParallelLines: true,
  showGeodesics: true,
  showAngleSumMeter: true,
};

const DEFAULT_THREED: ThreeDGeometryParameters = {
  lineMode: 'skew',
  pointA1: [1, 2, 3],
  dirB1: [2, 3, 4],
  pointA2: [2, 4, 5],
  dirB2: [3, 4, 5],
  showShortestSegment: true,
  showCommonPerpendicularVector: true,
  showParallelPlanes: true,
  cameraOrbitX: 25,
  cameraOrbitY: 35,
};

const DEFAULT_DIFFEQ: DifferentialEquationsParameters = {
  modelType: 'linear-first-order',
  pCoeff: 1.0,
  qCoeff: 2.0,
  coolingK: 0.08,
  ambientTemp: 22,
  initialX: 0,
  initialY: 4,
  gridDensity: 14,
  showSlopeField: true,
  showIntegratingFactorCurve: true,
  showAnalyticalSolution: true,
  stepSizeH: 0.1,
};

const DEFAULT_BALANCE_SCALE: BalanceScaleParameters = {
  leftXCount: 3,
  leftWeight: 4,
  rightXCount: 1,
  rightWeight: 12,
  actualXValue: 4,
  showEquationChalkboard: true,
  panTiltAngleDeg: 0,
  highlightDifference: true,
  activeStep: 'setup',
};

const DEFAULT_ALGEBRAIC_TILES: AlgebraicTilesParameters = {
  identityMode: 'a-plus-b-sq',
  aValue: 4,
  bValue: 2,
  middleFactorP: 2,
  middleFactorQ: 3,
  showTileAreas: true,
  showExpansionCutout: true,
  explodedView: false,
};

const DEFAULT_COMPOUND_INTEREST: CompoundInterestParameters = {
  principal: 10000,
  ratePct: 10,
  timeYears: 3,
  frequency: 'annually',
  showComparisonBars: true,
  showGrowthStaircase: true,
  highlightInterestOnInterest: true,
};

const DEFAULT_QUADRILATERAL: QuadrilateralMorpherParameters = {
  quadType: 'parallelogram',
  vertexA: [15, 75],
  vertexB: [55, 75],
  vertexC: [75, 25],
  vertexD: [35, 25],
  showDiagonals: true,
  showDiagonalAngle: true,
  showSideLengths: true,
  showInternalAngles: true,
  showParallelMarkers: true,
};

const DEFAULT_EULER_POLYHEDRA: EulerPolyhedraParameters = {
  solidType: 'cube',
  unfoldProgress: 0,
  showVertices: true,
  showEdges: true,
  showFaces: true,
  cameraOrbitX: 25,
  cameraOrbitY: 35,
  xrayWireframe: false,
};

const DEFAULT_DIRECT_INVERSE: DirectInverseParameters = {
  mode: 'direct-speed',
  directX: 60,
  directConstantK: 3,
  inverseWorkers: 4,
  inverseTotalWorkDays: 24,
  showCoordinateGraph: true,
  showTableValues: true,
};

const DEFAULT_DYNAMIC_PIE_CHART: DynamicPieChartParameters = {
  datasetKey: 'favorite-sports',
  slices: [
    { label: 'Cricket', value: 36, color: '#38bdf8' },
    { label: 'Football', value: 24, color: '#10b981' },
    { label: 'Badminton', value: 18, color: '#f59e0b' },
    { label: 'Basketball', value: 12, color: '#a855f7' },
    { label: 'Swimming', value: 10, color: '#ec4899' },
  ],
  selectedSliceIndex: 0,
  showProtractorAngle: true,
  showPercentages: true,
  showFractionFormula: true,
};

const DEFAULT_SQUARE_ROOTS: SquareRootsTripletsParameters = {
  mode: 'tile-packing',
  numberN: 25,
  tripletM: 3,
  showRemainingTiles: true,
  showLongDivisionSteps: true,
  showRightTriangleProof: true,
};

const DEFAULT_EXPONENTS: ExponentsPowersParameters = {
  baseA: 2,
  exponentM: 3,
  exponentN: 2,
  ruleMode: 'product',
  microscopeZoomPower: 0,
  showDecompositionTiles: true,
};

const DEFAULT_RATIONAL_NUMBERS: RationalNumbersParameters = {
  fractionA_num: 1,
  fractionA_den: 3,
  fractionB_num: 1,
  fractionB_den: 2,
  zoomLevel: 1,
  subdivisions: 10,
  meanStepsCount: 3,
  showDecimalEquivalent: true,
};

const DEFAULT_TRIANGLE_CONGRUENCE: TriangleCongruenceParameters = {
  criterion: 'SAS',
  sideA: 6,
  sideB: 5,
  sideC: 7,
  angleA: 48,
  angleB: 62,
  showOverlayComparison: true,
  isSecondAmbiguousVisible: false,
};

const DEFAULT_AP: ArithmeticProgressionParameters = {
  firstTermA: 2,
  commonDiffD: 3,
  numberOfTermsN: 6,
  showGaussRectangle: true,
  showTermList: true,
  highlightTermIndex: 2,
};

const DEFAULT_COORDINATE_SECTION: CoordinateSectionParameters = {
  pointAx: 2,
  pointAy: 3,
  pointBx: 8,
  pointBy: 9,
  ratioM1: 2,
  ratioM2: 1,
  divisionType: 'internal',
  showMidpointFormula: true,
  showCentroidTriangle: false,
};

const DEFAULT_CIRCLE_TANGENTS: CircleTangentsParameters = {
  circleRadius: 60,
  pointDistanceOP: 130,
  angleOffsetDeg: 25,
  showRadiiPerpendicular: true,
  showCongruentTriangles: true,
  showCyclicAngleProperty: true,
};

const DEFAULT_INDUCTION: MathematicalInductionParameters = {
  propositionType: 'sum-natural',
  targetN: 6,
  dominoFallProgress: 0,
  isBaseCaseVerified: true,
  isInductiveStepUnlocked: true,
};

const DEFAULT_TRIG_EQUATIONS: TrigEquationsRadialParameters = {
  targetFunction: 'sin',
  targetValue: 0.5,
  sweepAngleDeg: 30,
  showAllQuadrants: true,
  showGeneralFormulas: true,
  rangePeriods: 2,
};

const DEFAULT_LINEAR_PROG: LinearProgrammingParameters = {
  objectiveMaximize: true,
  profitX: 40,
  profitY: 50,
  constraint1_limit: 100,
  constraint2_limit: 80,
  showFeasibleRegion: true,
  showIsoProfitSlider: true,
  isoProfitValue: 2400,
};

const DEFAULT_PROB_DIST: ProbabilityDistributionParameters = {
  experimentType: 'coin-toss-n',
  numberOfTrials: 50,
  sampleSize: 3,
  showTheoreticalDistribution: true,
  showMeanVariance: true,
};

// Safe localStorage sync
const STORAGE_KEY = 'livesimulators_progress_v1';
const loadStoredProgress = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const initialSaved = loadStoredProgress();

export const useSimulatorStore = create<SimulatorStoreState>((set) => ({
  currentRoute: 'home',
  activeSimulatorId: null,
  gradeFilter: 'all',
  searchQuery: '',

  isBottomSheetOpen: true,
  bottomSheetSnap: 'peek',
  activeSheetTab: 'controls',

  isLeftSidebarOpen: true,
  isRightSidebarOpen: typeof window !== 'undefined' ? window.innerWidth >= 1440 : false,
  isLeftSidebarWide: true,
  isCompactControlsMode: true,
  isCanvasHudPinned: true,
  isAuthorModalOpen: false,

  isZenMode: false,
  activeGuideModal: false,
  activeMissionsModal: false,

  isPOEModalOpen: false,
  activePOEInquiryId: null,
  poePredictions: {},
  isExamPYQModalOpen: false,
  activePYQExamId: null,

  isStressTestModalOpen: false,
  isSpeedDrillModalOpen: false,
  isDerivationLadderModalOpen: false,
  revealedHints: {},

  // Class 8 Student Odyssey & Features
  isEli13Mode: false,
  isClass8OdysseyOpen: false,
  isSecretShortcutsOpen: false,
  isClass8BadgesOpen: false,
  isConceptQuizOpen: false,
  activeQuizTopicId: null,
  isSearchModalOpen: false,

  xp: initialSaved?.xp ?? 150,
  streakDays: initialSaved?.streakDays ?? 3,
  completedSimulators: initialSaved?.completedSimulators ?? ['unit-circle'],
  bookmarkedSimulators: initialSaved?.bookmarkedSimulators ?? [],
  unlockedBadges: initialSaved?.unlockedBadges ?? ['Trig Master I'],
  challengeCompleted: initialSaved?.challengeCompleted ?? {},

  droneParams: { ...DEFAULT_DRONE },
  catapultParams: { ...DEFAULT_CATAPULT },
  conicParams: { ...DEFAULT_CONIC },
  unitCircleParams: { ...DEFAULT_UNIT_CIRCLE },
  calculusParams: { ...DEFAULT_CALCULUS },
  rollercoasterParams: { ...DEFAULT_ROLLERCOASTER },
  vectorParams: { ...DEFAULT_VECTOR },
  quadraticParams: { ...DEFAULT_QUADRATIC },
  circleTheoremsParams: { ...DEFAULT_CIRCLE_THEOREMS },
  linearSystemsParams: { ...DEFAULT_LINEAR_SYSTEMS },
  trigHeightsParams: { ...DEFAULT_TRIG_HEIGHTS },
  heronParams: { ...DEFAULT_HERON },
  polynomialParams: { ...DEFAULT_POLYNOMIAL_FACTORIZER },
  linesAnglesParams: { ...DEFAULT_LINES_ANGLES },
  binomialGaltonParams: { ...DEFAULT_BINOMIAL_GALTON },
  sequenceParams: { ...DEFAULT_SEQUENCE_EXPLORER },
  conicFocalParams: { ...DEFAULT_CONIC_FOCAL },
  surfaceAreaParams: { ...DEFAULT_SURFACE_AREA },
  circleChordsParams: { ...DEFAULT_CIRCLE_CHORDS },
  statisticsParams: { ...DEFAULT_STATISTICS },
  limitsDerivativesParams: { ...DEFAULT_LIMITS_DERIVATIVES },
  linearInequalitiesParams: { ...DEFAULT_LINEAR_INEQUALITIES },
  permutationsCombinationsParams: { ...DEFAULT_PERMUTATIONS_COMBINATIONS },
  similarTrianglesParams: { ...DEFAULT_SIMILAR_TRIANGLES },
  ftcIntegralParams: { ...DEFAULT_FTC_INTEGRAL },
  bayesProbabilityParams: { ...DEFAULT_BAYES_PROBABILITY },
  euclideanParams: { ...DEFAULT_EUCLIDEAN },
  threeDParams: { ...DEFAULT_THREED },
  diffEqParams: { ...DEFAULT_DIFFEQ },
  balanceScaleParams: { ...DEFAULT_BALANCE_SCALE },
  algebraicTilesParams: { ...DEFAULT_ALGEBRAIC_TILES },
  compoundInterestParams: { ...DEFAULT_COMPOUND_INTEREST },
  quadrilateralParams: { ...DEFAULT_QUADRILATERAL },
  eulerPolyhedraParams: { ...DEFAULT_EULER_POLYHEDRA },
  directInverseParams: { ...DEFAULT_DIRECT_INVERSE },
  dynamicPieChartParams: { ...DEFAULT_DYNAMIC_PIE_CHART },
  squareRootsParams: { ...DEFAULT_SQUARE_ROOTS },
  exponentsParams: { ...DEFAULT_EXPONENTS },
  rationalNumbersParams: { ...DEFAULT_RATIONAL_NUMBERS },
  triangleCongruenceParams: { ...DEFAULT_TRIANGLE_CONGRUENCE },
  apParams: { ...DEFAULT_AP },
  coordinateSectionParams: { ...DEFAULT_COORDINATE_SECTION },
  circleTangentsParams: { ...DEFAULT_CIRCLE_TANGENTS },
  inductionParams: { ...DEFAULT_INDUCTION },
  trigEquationsParams: { ...DEFAULT_TRIG_EQUATIONS },
  linearProgParams: { ...DEFAULT_LINEAR_PROG },
  probDistParams: { ...DEFAULT_PROB_DIST },

  navigateTo: (route) => {
    const isSim = route !== 'home' && route !== 'teacher' && route !== 'landing';
    if (isSim && typeof window !== 'undefined') {
      try {
        (window as any).__mathPrefetchSimulator?.(route);
      } catch {}
    }
    set({
      currentRoute: route,
      activeSimulatorId: isSim ? (route as SimulatorId) : null,
      isBottomSheetOpen: isSim,
      bottomSheetSnap: 'peek', // Keep canvas fully visible when entering simulator
      isZenMode: false,
      activeGuideModal: false,
      activeMissionsModal: false,
    });
    // Scroll to top on route change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  setGradeFilter: (grade) => set({ gradeFilter: grade }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  setBottomSheetOpen: (open) => set({ isBottomSheetOpen: open }),
  setBottomSheetSnap: (snap) => set({ bottomSheetSnap: snap, isBottomSheetOpen: snap !== 'closed' }),
  setActiveSheetTab: (tab) => set({ activeSheetTab: tab }),
  toggleBottomSheet: () =>
    set((state) => ({
      isBottomSheetOpen: !state.isBottomSheetOpen,
      bottomSheetSnap: !state.isBottomSheetOpen ? 'half' : 'closed',
    })),

  toggleLeftSidebar: () => {
    set((state) => ({ isLeftSidebarOpen: !state.isLeftSidebarOpen }));
    if (typeof window !== 'undefined') {
      setTimeout(() => window.dispatchEvent(new Event('resize')), 50);
    }
  },
  toggleRightSidebar: () => {
    set((state) => ({ isRightSidebarOpen: !state.isRightSidebarOpen }));
    if (typeof window !== 'undefined') {
      setTimeout(() => window.dispatchEvent(new Event('resize')), 50);
    }
  },
  toggleLeftSidebarWide: () => {
    set((state) => ({ isLeftSidebarWide: !state.isLeftSidebarWide }));
    if (typeof window !== 'undefined') {
      setTimeout(() => window.dispatchEvent(new Event('resize')), 50);
    }
  },
  toggleCompactControlsMode: () =>
    set((state) => ({ isCompactControlsMode: !state.isCompactControlsMode })),
  toggleCanvasHudPinned: () =>
    set((state) => ({ isCanvasHudPinned: !state.isCanvasHudPinned })),
  setIsAuthorModalOpen: (open) => set({ isAuthorModalOpen: open }),
  setLeftSidebarOpen: (open) => {
    set({ isLeftSidebarOpen: open });
    if (typeof window !== 'undefined') {
      setTimeout(() => window.dispatchEvent(new Event('resize')), 50);
    }
  },
  setRightSidebarOpen: (open) => {
    set({ isRightSidebarOpen: open });
    if (typeof window !== 'undefined') {
      setTimeout(() => window.dispatchEvent(new Event('resize')), 50);
    }
  },

  toggleZenMode: () => set((state) => ({ isZenMode: !state.isZenMode })),
  setZenMode: (zen) => set({ isZenMode: zen }),
  setActiveGuideModal: (open) => set({ activeGuideModal: open }),
  setActiveMissionsModal: (open) => set({ activeMissionsModal: open }),

  openPOEModal: (inquiryId) =>
    set({
      isPOEModalOpen: true,
      activePOEInquiryId: inquiryId ?? null,
    }),
  closePOEModal: () => set({ isPOEModalOpen: false, activePOEInquiryId: null }),

  recordPOEPrediction: (inquiryId, optionId, isCorrect, xpReward) =>
    set((state) => {
      const alreadyPredicted = !!state.poePredictions[inquiryId];
      const newXp = alreadyPredicted ? state.xp : state.xp + (isCorrect ? xpReward : Math.round(xpReward * 0.4));
      return {
        xp: newXp,
        poePredictions: {
          ...state.poePredictions,
          [inquiryId]: {
            selectedOptionId: optionId,
            isCorrect,
            timestamp: Date.now(),
          },
        },
      };
    }),

  openExamPYQModal: (pyqId) =>
    set({
      isExamPYQModalOpen: true,
      activePYQExamId: pyqId ?? null,
    }),
  closeExamPYQModal: () => set({ isExamPYQModalOpen: false, activePYQExamId: null }),

  openStressTestModal: () => set({ isStressTestModalOpen: true }),
  closeStressTestModal: () => set({ isStressTestModalOpen: false }),

  openSpeedDrillModal: () => set({ isSpeedDrillModalOpen: true }),
  closeSpeedDrillModal: () => set({ isSpeedDrillModalOpen: false }),

  openDerivationLadderModal: () => set({ isDerivationLadderModalOpen: true }),
  closeDerivationLadderModal: () => set({ isDerivationLadderModalOpen: false }),

  toggleEli13Mode: () => set((state) => ({ isEli13Mode: !state.isEli13Mode })),
  setEli13Mode: (mode) => set({ isEli13Mode: mode }),
  setClass8OdysseyOpen: (open) => set({ isClass8OdysseyOpen: open }),
  setSecretShortcutsOpen: (open) => set({ isSecretShortcutsOpen: open }),
  setClass8BadgesOpen: (open) => set({ isClass8BadgesOpen: open }),
  openConceptQuizModal: (topicId) => set({ isConceptQuizOpen: true, activeQuizTopicId: topicId ?? null }),
  closeConceptQuizModal: () => set({ isConceptQuizOpen: false, activeQuizTopicId: null }),
  setIsSearchModalOpen: (open) => set({ isSearchModalOpen: open }),
  unlockBadge: (badgeId) =>
    set((state) => {
      if (state.unlockedBadges.includes(badgeId)) return state;
      const updated = [...state.unlockedBadges, badgeId];
      const newXp = state.xp + 50;
      return {
        unlockedBadges: updated,
        xp: newXp,
      };
    }),

  unlockHint: (challengeKey, tier, costXp) =>
    set((state) => {
      const currentTier = state.revealedHints[challengeKey] || 0;
      if (currentTier >= tier) return {};
      const newXp = Math.max(0, state.xp - costXp);
      return {
        xp: newXp,
        revealedHints: {
          ...state.revealedHints,
          [challengeKey]: tier,
        },
      };
    }),

  updateDroneParams: (params) =>
    set((state) => ({ droneParams: { ...state.droneParams, ...params } })),
  updateCatapultParams: (params) =>
    set((state) => ({ catapultParams: { ...state.catapultParams, ...params } })),
  updateConicParams: (params) =>
    set((state) => ({ conicParams: { ...state.conicParams, ...params } })),
  updateUnitCircleParams: (params) =>
    set((state) => ({ unitCircleParams: { ...state.unitCircleParams, ...params } })),
  updateCalculusParams: (params) =>
    set((state) => ({ calculusParams: { ...state.calculusParams, ...params } })),
  updateRollercoasterParams: (params) =>
    set((state) => ({ rollercoasterParams: { ...state.rollercoasterParams, ...params } })),
  updateVectorParams: (params) =>
    set((state) => ({ vectorParams: { ...state.vectorParams, ...params } })),
  updateQuadraticParams: (params) =>
    set((state) => ({ quadraticParams: { ...state.quadraticParams, ...params } })),
  updateCircleTheoremsParams: (params) =>
    set((state) => ({ circleTheoremsParams: { ...state.circleTheoremsParams, ...params } })),
  updateLinearSystemsParams: (params) =>
    set((state) => ({ linearSystemsParams: { ...state.linearSystemsParams, ...params } })),
  updateTrigHeightsParams: (params) =>
    set((state) => ({ trigHeightsParams: { ...state.trigHeightsParams, ...params } })),
  updateHeronParams: (params) =>
    set((state) => ({ heronParams: { ...state.heronParams, ...params } })),
  updatePolynomialParams: (params) =>
    set((state) => ({ polynomialParams: { ...state.polynomialParams, ...params } })),
  updateLinesAnglesParams: (params) =>
    set((state) => ({ linesAnglesParams: { ...state.linesAnglesParams, ...params } })),
  updateBinomialGaltonParams: (params) =>
    set((state) => ({ binomialGaltonParams: { ...state.binomialGaltonParams, ...params } })),
  updateSequenceParams: (params) =>
    set((state) => ({ sequenceParams: { ...state.sequenceParams, ...params } })),
  updateConicFocalParams: (params) =>
    set((state) => ({ conicFocalParams: { ...state.conicFocalParams, ...params } })),
  updateSurfaceAreaParams: (params) =>
    set((state) => ({ surfaceAreaParams: { ...state.surfaceAreaParams, ...params } })),
  updateCircleChordsParams: (params) =>
    set((state) => ({ circleChordsParams: { ...state.circleChordsParams, ...params } })),
  updateStatisticsParams: (params) =>
    set((state) => ({ statisticsParams: { ...state.statisticsParams, ...params } })),
  updateLimitsDerivativesParams: (params) =>
    set((state) => ({ limitsDerivativesParams: { ...state.limitsDerivativesParams, ...params } })),
  updateLinearInequalitiesParams: (params) =>
    set((state) => ({ linearInequalitiesParams: { ...state.linearInequalitiesParams, ...params } })),
  updatePermutationsCombinationsParams: (params) =>
    set((state) => ({ permutationsCombinationsParams: { ...state.permutationsCombinationsParams, ...params } })),
  updateSimilarTrianglesParams: (params) =>
    set((state) => ({ similarTrianglesParams: { ...state.similarTrianglesParams, ...params } })),
  updateFTCIntegralParams: (params) =>
    set((state) => ({ ftcIntegralParams: { ...state.ftcIntegralParams, ...params } })),
  updateBayesProbabilityParams: (params) =>
    set((state) => ({ bayesProbabilityParams: { ...state.bayesProbabilityParams, ...params } })),
  updateEuclideanParams: (params) =>
    set((state) => ({ euclideanParams: { ...state.euclideanParams, ...params } })),
  updateThreeDParams: (params) =>
    set((state) => ({ threeDParams: { ...state.threeDParams, ...params } })),
  updateDiffEqParams: (params) =>
    set((state) => ({ diffEqParams: { ...state.diffEqParams, ...params } })),
  updateBalanceScaleParams: (params) =>
    set((state) => ({ balanceScaleParams: { ...state.balanceScaleParams, ...params } })),
  updateAlgebraicTilesParams: (params) =>
    set((state) => ({ algebraicTilesParams: { ...state.algebraicTilesParams, ...params } })),
  updateCompoundInterestParams: (params) =>
    set((state) => ({ compoundInterestParams: { ...state.compoundInterestParams, ...params } })),
  updateQuadrilateralParams: (params) =>
    set((state) => ({ quadrilateralParams: { ...state.quadrilateralParams, ...params } })),
  updateEulerPolyhedraParams: (params) =>
    set((state) => ({ eulerPolyhedraParams: { ...state.eulerPolyhedraParams, ...params } })),
  updateDirectInverseParams: (params) =>
    set((state) => ({ directInverseParams: { ...state.directInverseParams, ...params } })),
  updateDynamicPieChartParams: (params) =>
    set((state) => ({ dynamicPieChartParams: { ...state.dynamicPieChartParams, ...params } })),
  updateSquareRootsParams: (params) =>
    set((state) => ({ squareRootsParams: { ...state.squareRootsParams, ...params } })),
  updateExponentsParams: (params) =>
    set((state) => ({ exponentsParams: { ...state.exponentsParams, ...params } })),
  updateRationalNumbersParams: (params) =>
    set((state) => ({ rationalNumbersParams: { ...state.rationalNumbersParams, ...params } })),
  updateTriangleCongruenceParams: (params) =>
    set((state) => ({ triangleCongruenceParams: { ...state.triangleCongruenceParams, ...params } })),
  updateApParams: (params) =>
    set((state) => ({ apParams: { ...state.apParams, ...params } })),
  updateCoordinateSectionParams: (params) =>
    set((state) => ({ coordinateSectionParams: { ...state.coordinateSectionParams, ...params } })),
  updateCircleTangentsParams: (params) =>
    set((state) => ({ circleTangentsParams: { ...state.circleTangentsParams, ...params } })),
  updateInductionParams: (params) =>
    set((state) => ({ inductionParams: { ...state.inductionParams, ...params } })),
  updateTrigEquationsParams: (params) =>
    set((state) => ({ trigEquationsParams: { ...state.trigEquationsParams, ...params } })),
  updateLinearProgParams: (params) =>
    set((state) => ({ linearProgParams: { ...state.linearProgParams, ...params } })),
  updateProbDistParams: (params) =>
    set((state) => ({ probDistParams: { ...state.probDistParams, ...params } })),

  resetParams: (id) => {
    switch (id) {
      case 'drone-navigator':
        set({ droneParams: { ...DEFAULT_DRONE } });
        break;
      case 'catapult-siege':
        set({ catapultParams: { ...DEFAULT_CATAPULT } });
        break;
      case 'conic-sections':
        set({ conicParams: { ...DEFAULT_CONIC } });
        break;
      case 'unit-circle':
        set({ unitCircleParams: { ...DEFAULT_UNIT_CIRCLE } });
        break;
      case 'calculus-sandbox':
        set({ calculusParams: { ...DEFAULT_CALCULUS } });
        break;
      case 'rollercoaster-architect':
        set({ rollercoasterParams: { ...DEFAULT_ROLLERCOASTER } });
        break;
      case 'vector-flight-lab':
        set({ vectorParams: { ...DEFAULT_VECTOR } });
        break;
      case 'quadratic-roots':
        set({ quadraticParams: { ...DEFAULT_QUADRATIC } });
        break;
      case 'circle-theorems':
        set({ circleTheoremsParams: { ...DEFAULT_CIRCLE_THEOREMS } });
        break;
      case 'linear-systems':
        set({ linearSystemsParams: { ...DEFAULT_LINEAR_SYSTEMS } });
        break;
      case 'trig-heights':
        set({ trigHeightsParams: { ...DEFAULT_TRIG_HEIGHTS } });
        break;
      case 'heron-triangles':
        set({ heronParams: { ...DEFAULT_HERON } });
        break;
      case 'polynomial-factorizer':
        set({ polynomialParams: { ...DEFAULT_POLYNOMIAL_FACTORIZER } });
        break;
      case 'lines-angles':
        set({ linesAnglesParams: { ...DEFAULT_LINES_ANGLES } });
        break;
      case 'binomial-galton':
        set({ binomialGaltonParams: { ...DEFAULT_BINOMIAL_GALTON } });
        break;
      case 'arithmetic-geometric-explorer':
        set({ sequenceParams: { ...DEFAULT_SEQUENCE_EXPLORER } });
        break;
      case 'hyperbola-ellipse-orbits':
        set({ conicFocalParams: { ...DEFAULT_CONIC_FOCAL } });
        break;
      case 'surface-area-volumes':
        set({ surfaceAreaParams: { ...DEFAULT_SURFACE_AREA } });
        break;
      case 'circle-chords-cyclic':
        set({ circleChordsParams: { ...DEFAULT_CIRCLE_CHORDS } });
        break;
      case 'statistics-visualizer':
        set({ statisticsParams: { ...DEFAULT_STATISTICS } });
        break;
      case 'limits-derivatives-lab':
        set({ limitsDerivativesParams: { ...DEFAULT_LIMITS_DERIVATIVES } });
        break;
      case 'linear-inequalities':
        set({ linearInequalitiesParams: { ...DEFAULT_LINEAR_INEQUALITIES } });
        break;
      case 'permutations-combinations':
        set({ permutationsCombinationsParams: { ...DEFAULT_PERMUTATIONS_COMBINATIONS } });
        break;
      case 'similar-triangles':
        set({ similarTrianglesParams: { ...DEFAULT_SIMILAR_TRIANGLES } });
        break;
      case 'ftc-integral-accumulator':
        set({ ftcIntegralParams: { ...DEFAULT_FTC_INTEGRAL } });
        break;
      case 'bayes-probability-lab':
        set({ bayesProbabilityParams: { ...DEFAULT_BAYES_PROBABILITY } });
        break;
      case 'euclidean-geometry-sandbox':
        set({ euclideanParams: { ...DEFAULT_EUCLIDEAN } });
        break;
      case 'three-d-geometry-lab':
        set({ threeDParams: { ...DEFAULT_THREED } });
        break;
      case 'differential-equations-lab':
        set({ diffEqParams: { ...DEFAULT_DIFFEQ } });
        break;
      case 'balance-scale-equations':
        set({ balanceScaleParams: { ...DEFAULT_BALANCE_SCALE } });
        break;
      case 'algebraic-identities-tiles':
        set({ algebraicTilesParams: { ...DEFAULT_ALGEBRAIC_TILES } });
        break;
      case 'compound-interest-engine':
        set({ compoundInterestParams: { ...DEFAULT_COMPOUND_INTEREST } });
        break;
      case 'quadrilateral-morpher':
        set({ quadrilateralParams: { ...DEFAULT_QUADRILATERAL } });
        break;
      case 'euler-polyhedra-3d':
        set({ eulerPolyhedraParams: { ...DEFAULT_EULER_POLYHEDRA } });
        break;
      case 'direct-inverse-proportions':
        set({ directInverseParams: { ...DEFAULT_DIRECT_INVERSE } });
        break;
      case 'dynamic-pie-chart':
        set({ dynamicPieChartParams: { ...DEFAULT_DYNAMIC_PIE_CHART } });
        break;
      case 'square-roots-triplets':
        set({ squareRootsParams: { ...DEFAULT_SQUARE_ROOTS } });
        break;
      case 'exponents-powers-lab':
        set({ exponentsParams: { ...DEFAULT_EXPONENTS } });
        break;
      case 'rational-numbers-density':
        set({ rationalNumbersParams: { ...DEFAULT_RATIONAL_NUMBERS } });
        break;
      case 'triangle-congruence-forge':
        set({ triangleCongruenceParams: { ...DEFAULT_TRIANGLE_CONGRUENCE } });
        break;
      case 'arithmetic-progression-lab':
        set({ apParams: { ...DEFAULT_AP } });
        break;
      case 'coordinate-section-formula':
        set({ coordinateSectionParams: { ...DEFAULT_COORDINATE_SECTION } });
        break;
      case 'circle-tangents-lab':
        set({ circleTangentsParams: { ...DEFAULT_CIRCLE_TANGENTS } });
        break;
      case 'mathematical-induction-dominos':
        set({ inductionParams: { ...DEFAULT_INDUCTION } });
        break;
      case 'trig-equations-radial':
        set({ trigEquationsParams: { ...DEFAULT_TRIG_EQUATIONS } });
        break;
      case 'linear-programming-lab':
        set({ linearProgParams: { ...DEFAULT_LINEAR_PROG } });
        break;
      case 'probability-distribution-lab':
        set({ probDistParams: { ...DEFAULT_PROB_DIST } });
        break;
      case 'argand-plane':
      case 'matrix-meme':
      case 'monty-hall':
      default:
        break;
    }
  },

  markCompleted: (id) =>
    set((state) => {
      if (state.completedSimulators.includes(id)) return state;
      const updated = [...state.completedSimulators, id];
      const newXp = state.xp + 50;
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            ...state,
            completedSimulators: updated,
            xp: newXp,
          })
        );
      } catch {
        // safe ignore
      }
      return {
        completedSimulators: updated,
        xp: newXp,
      };
    }),

  toggleBookmark: (id) =>
    set((state) => {
      const exists = state.bookmarkedSimulators.includes(id);
      const updated = exists
        ? state.bookmarkedSimulators.filter((x) => x !== id)
        : [...state.bookmarkedSimulators, id];
      return { bookmarkedSimulators: updated };
    }),

  completeChallenge: (challengeKey, xpReward = 30) =>
    set((state) => {
      if (state.challengeCompleted[challengeKey]) return state;
      const updatedMap = { ...state.challengeCompleted, [challengeKey]: true };
      const newXp = state.xp + xpReward;
      return {
        challengeCompleted: updatedMap,
        xp: newXp,
      };
    }),

  addXp: (amount) => set((state) => ({ xp: state.xp + amount })),
}));
