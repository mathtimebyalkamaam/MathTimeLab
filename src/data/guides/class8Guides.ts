import { SimulatorGuide } from '../../types/simulatorGuides';

export const CLASS_8_GUIDES: Record<string, SimulatorGuide> = {
  'balance-scale-equations': {
    simulatorId: 'balance-scale-equations',
    h1Heading: 'Linear Equations Two-Pan Balance Scale Simulator',
    introduction: 'Explore the golden rule of algebra: an equation is a physical balance scale in equilibrium. Manipulate unknown weight bags (x) and unit brass masses across both pans to understand why whatever operation is performed on the left-hand side must be mirrored on the right-hand side.',
    learningObjectives: [
      'Visualize algebraic variables as physical mystery weights sitting on balance pans.',
      'Master the equality preservation principle: adding, subtracting, multiplying, or dividing identical quantities maintains equilibrium.',
      'Isolate unknown x in linear equations of the form ax + b = cx + d in 3 or fewer operations.',
      'Eliminate the textbook misconception that numbers "transpose across the equals sign and change sign" without reason.'
    ],
    mathematicalPrinciples: [
      {
        title: 'Equality Preservation Property',
        description: 'For any algebraic quantities A, B, and C, if A = B, then A ± C = B ± C and A · C = B · C (for C ≠ 0).',
        formulaLatex: 'A = B \\iff A - C = B - C, \\quad A \\cdot C = B \\cdot C'
      },
      {
        title: 'Linear Variable Isolation',
        description: 'To solve ax + b = d, subtract constant b from both sides, then divide both sides by coefficient a.',
        formulaLatex: 'ax + b = d \\implies ax = d - b \\implies x = \\frac{d - b}{a}'
      }
    ],
    controlsGuide: [
      {
        name: 'Left Pan Variable (x) Stepper',
        type: 'stepper',
        description: 'Increases or decreases the number of unknown x weight bags on the left pan.',
        effect: 'Adds positive weight of x kg per bag to the left side of the scale.'
      },
      {
        name: 'Left Pan Constant (+) Stepper',
        type: 'stepper',
        description: 'Adds or removes 1-kg brass weights on the left pan.',
        effect: 'Increases or decreases constant value b on the left-hand side.'
      },
      {
        name: 'Right Pan Variable (x) Stepper',
        type: 'stepper',
        description: 'Controls the number of x bags on the right pan for equations with variables on both sides.',
        effect: 'Updates coefficient c in ax + b = cx + d.'
      },
      {
        name: 'Right Pan Constant (+) Stepper',
        type: 'stepper',
        description: 'Adds or removes 1-kg weights on the right pan.',
        effect: 'Sets constant d on the right-hand side.'
      },
      {
        name: 'Subtract x / Subtract 1 Action Buttons',
        type: 'button',
        description: 'Applies inverse arithmetic operations simultaneously to both pans.',
        effect: 'Removes equal weight from both pans, keeping the beam perfectly level.'
      }
    ],
    stepByStepInstructions: [
      'Configure an equation like 2x + 3 = 7 using the pan steppers.',
      'Observe the balance scale tilt if the pans are unequal, or remain horizontal when balanced.',
      'Click "Subtract 3 from Both Pans" to eliminate the constant on the left side, leaving 2x = 4.',
      'Click "Divide Both Pans by 2" to split remaining items into two identical piles, isolating 1 bag: x = 2.',
      'Inspect the verified root badge to confirm that substituting x = 2 satisfies 2(2) + 3 = 7.'
    ],
    expectedOutput: 'The physical beam animates and tilts dynamically with spring damping. Once balanced, the beam settles horizontally at 0° tilt, glowing emerald green with a live readout showing the isolated value of x.',
    realWorldApplication: {
      domain: 'Industrial Quality Control & Weigh-in-Motion Systems',
      title: 'Automated Tare Weight Calibration in Food Packaging',
      scenario: 'High-speed packaging plants measure total box weight containing an unknown volume of cereal (x) plus cardboard packaging tare weight (b).',
      mathematicalConnection: 'Digital sensors solve Tare Equation ax + b = W_total in real-time microsecond loops by subtracting known box tare b and dividing by packing density a to verify net food weight.'
    }
  },

  'algebraic-identities-tiles': {
    simulatorId: 'algebraic-identities-tiles',
    h1Heading: 'Algebraic Identities Visual Geometric Area Tiles Lab',
    introduction: 'Discover the visual geometric proofs of foundational Class 8 algebraic identities: (a + b)², (a - b)², and a² - b². Drag dimensional sliders to resize squares and rectangles, proving that algebraic expansion is nothing more than summing modular geometric areas.',
    learningObjectives: [
      'Prove geometrically that (a + b)² = a² + 2ab + b² by partitioning a large square into 4 distinct regions.',
      'Understand why (a + b)² does NOT equal a² + b² by visually identifying the two missing ab rectangular corner pieces.',
      'Visualize the difference of squares identity a² - b² = (a - b)(a + b) by cutting and rearranging area slabs.',
      'Develop spatial intuition connecting binomial polynomials with 2D architectural surface areas.'
    ],
    mathematicalPrinciples: [
      {
        title: 'Square of a Binomial Sum',
        description: 'A square of side length (a + b) has total area composed of one a² square, one b² square, and two ab rectangles.',
        formulaLatex: '(a + b)^2 = a^2 + 2ab + b^2'
      },
      {
        title: 'Square of a Binomial Difference',
        description: 'Starting with square a², subtracting two overlapping rectangles of area ab removes b² twice, requiring adding back one b² square.',
        formulaLatex: '(a - b)^2 = a^2 - 2ab + b^2'
      },
      {
        title: 'Difference of Two Squares',
        description: 'Removing a b² square from an a² square leaves an L-shaped region that can be cut and reassembled into a single rectangle of dimensions (a - b) by (a + b).',
        formulaLatex: 'a^2 - b^2 = (a - b)(a + b)'
      }
    ],
    controlsGuide: [
      {
        name: 'Identity Selector Tabs',
        type: 'button',
        description: 'Switches between Identity I (a + b)², Identity II (a - b)², and Identity III (a² - b²).',
        effect: 'Reconfigures the visual canvas to display the corresponding geometric proof.'
      },
      {
        name: 'Dimension a Slider',
        type: 'slider',
        description: 'Adjusts base length a between 2 and 10 units.',
        effect: 'Resizes the primary cyan a × a square and adjacent rectangular tiles.'
      },
      {
        name: 'Dimension b Slider',
        type: 'slider',
        description: 'Adjusts extension length b between 1 and 6 units.',
        effect: 'Expands the amber b × b corner square and cross-product ab strips.'
      },
      {
        name: 'Explode / Slice Toggle',
        type: 'toggle',
        description: 'Animates the separation of composite area tiles into floating modular components.',
        effect: 'Visually highlights how individual tile areas sum to the total expanded algebraic expression.'
      }
    ],
    stepByStepInstructions: [
      'Select Identity I: (a + b)² from the top mode switcher.',
      'Set a = 4 cm and b = 2 cm using the interactive sliders.',
      'Observe the total square of side (4 + 2) = 6 cm, with total area 36 cm².',
      'Inspect the 4 color-coded sub-tiles: large square a² = 16, two rectangles ab = 8 each, and small square b² = 4.',
      'Verify that 16 + 8 + 8 + 4 = 36 cm², confirming (a + b)² = a² + 2ab + b².',
      'Toggle the "Explode Tiles" button to watch the geometric pieces detach with calculated area tags.'
    ],
    expectedOutput: 'A multi-colored 2D grid displays proportional sub-regions: a² (cyan), ab (emerald), ab (indigo), and b² (amber). Dynamic KaTeX expressions update live as dimensions scrub.',
    realWorldApplication: {
      domain: 'Civil Architecture & Urban Land Partitioning',
      title: 'Zoning Plot Expansions & Paving Material Estimation',
      scenario: 'A city planner enlarges a square municipal park of width a by adding pedestrian sidewalks of width b on all sides.',
      mathematicalConnection: 'Total paved area calculation requires the exact expansion (a + 2b)² - a² = 4ab + 4b², ensuring accurate concrete tonnage orders without costly material overages.'
    }
  },

  'compound-interest-engine': {
    simulatorId: 'compound-interest-engine',
    h1Heading: 'Compound Interest vs Simple Interest Growth Engine',
    introduction: 'Demystify financial mathematics by comparing the linear growth of Simple Interest against the exponential snowball of Compound Interest. Scrub principal, interest rate, time period, and compounding frequencies to understand how interest earned on interest generates astronomical long-term wealth.',
    learningObjectives: [
      'Distinguish linear Simple Interest growth: I = (P · R · T) / 100 from exponential Compounding.',
      'Master the universal compound interest formula: A = P(1 + r/n)^(nt).',
      'Observe the dramatic impact of compounding frequency (annually, half-yearly, quarterly) on final yield.',
      'Calculate the exact difference between Compound Interest (CI) and Simple Interest (SI) over multi-year horizons.'
    ],
    mathematicalPrinciples: [
      {
        title: 'Simple Interest Formula',
        description: 'Interest accrues strictly on the original principal P every period without compounding.',
        formulaLatex: 'SI = \\frac{P \\cdot R \\cdot T}{100}, \\quad A_{SI} = P + SI'
      },
      {
        title: 'Compound Interest Formula',
        description: 'Interest is added back to the principal at each compounding interval, earning interest in all subsequent cycles.',
        formulaLatex: 'A = P\\left(1 + \\frac{R}{100n}\\right)^{n \\cdot T}, \\quad CI = A - P'
      }
    ],
    controlsGuide: [
      {
        name: 'Principal Amount (P) Slider',
        type: 'slider',
        description: 'Sets the initial deposited capital from ₹1,000 to ₹1,00,000.',
        effect: 'Scales the starting baseline of both investment curves.'
      },
      {
        name: 'Annual Interest Rate (R) Slider',
        type: 'slider',
        description: 'Sets the nominal annual rate from 1% to 20%.',
        effect: 'Controls the slope of the linear SI line and the curvature exponent of the CI curve.'
      },
      {
        name: 'Time Duration (T) Slider',
        type: 'slider',
        description: 'Adjusts the investment horizon between 1 year and 25 years.',
        effect: 'Extends the horizontal timeline to reveal the exponential divergence gap.'
      },
      {
        name: 'Compounding Frequency Selector',
        type: 'button',
        description: 'Toggles between Annually (n=1), Half-Yearly (n=2), Quarterly (n=4), and Monthly (n=12).',
        effect: 'Modifies compounding periods n, demonstrating how frequent compounding increases final amount.'
      }
    ],
    stepByStepInstructions: [
      'Set Principal P = ₹10,000, Rate R = 10%, and Time T = 10 years.',
      'Compare the final balances: SI yields ₹20,000 while annual CI produces ₹25,937.',
      'Inspect the "Compounding Bonus" delta badge showing the extra ₹5,937 generated purely from interest-on-interest.',
      'Switch compounding frequency to Quarterly (n=4) and observe the total increase to ₹26,850.',
      'Drag Time T to 20 years to see the exponential snowball accelerate, where CI yields more than double SI.'
    ],
    expectedOutput: 'An interactive dual-line coordinate chart plots Linear SI (amber dashed line) alongside Exponential CI (emerald solid curve). The divergence area between curves is filled with a luminous gradient representing accumulated compounding surplus.',
    realWorldApplication: {
      domain: 'Retirement Wealth Planning & Sovereign Debt',
      title: 'Long-term Mutual Fund SIP & Provident Fund Compounding',
      scenario: 'A 25-year-old investor deposits ₹10,000 annually into a retirement index fund compounding at 12% until age 60.',
      mathematicalConnection: 'Over 35 years, contributions of ₹3.5 Lakhs compound exponentially into over ₹43 Lakhs, proving Albert Einstein’s maxim that compound interest is the eighth wonder of the world.'
    }
  },

  'quadrilateral-morpher': {
    simulatorId: 'quadrilateral-morpher',
    h1Heading: 'Understanding Quadrilaterals Dynamic Shape Morpher',
    introduction: 'Morph a generic 4-sided polygon through the entire hierarchical family of quadrilaterals: Trapezium, Parallelogram, Rhombus, Rectangle, Square, and Kite. Drag vertices in real time while tracking interior angles, diagonal bisections, side parallelism, and the universal angle sum property (360°).',
    learningObjectives: [
      'Verify that the sum of interior angles of ANY convex quadrilateral is strictly 360° (Angle Sum Property).',
      'Understand the inheritance hierarchy: a Square is simultaneously a Rectangle, a Rhombus, and a Parallelogram.',
      'Explore diagonal properties: perpendicular bisectors in Rhombus/Square vs equal diagonals in Rectangle/Square.',
      'Recognize angle pairs: consecutive interior angles sum to 180° between parallel lines in parallelograms.'
    ],
    mathematicalPrinciples: [
      {
        title: 'Quadrilateral Angle Sum Property',
        description: 'Connecting one diagonal splits the quadrilateral into 2 triangles. Since each triangle sums to 180°, total interior sum is 2 × 180° = 360°.',
        formulaLatex: '\\sum \\angle_{int} = \\angle A + \\angle B + \\angle C + \\angle D = (4 - 2) \\times 180^\\circ = 360^\\circ'
      },
      {
        title: 'Parallelogram Invariants',
        description: 'Opposite sides are parallel and congruent; opposite angles are equal; diagonals bisect each other.',
        formulaLatex: 'AB \\parallel CD, \\quad AD \\parallel BC, \\quad \\angle A = \\angle C, \\quad AO = OC'
      }
    ],
    controlsGuide: [
      {
        name: 'Interactive Vertex Handles (A, B, C, D)',
        type: 'drag',
        description: 'Touch and drag any corner vertex anywhere on the coordinate plane.',
        effect: 'Updates side lengths, interior angles, and diagonal lengths dynamically.'
      },
      {
        name: 'Shape Preset Pills',
        type: 'button',
        description: 'Snaps vertices into mathematically ideal forms: Parallelogram, Rhombus, Rectangle, Square, Trapezium, or Kite.',
        effect: 'Applies rigid geometric constraints for targeted theorem inspection.'
      },
      {
        name: 'Show Diagonals Toggle',
        type: 'toggle',
        description: 'Overlays diagonals AC and BD with intersection point O.',
        effect: 'Displays diagonal lengths, intersection angles, and bisection equality ticks.'
      },
      {
        name: 'Angle Measurement Arcs',
        type: 'toggle',
        description: 'Shows live degree readouts for all 4 vertices with real-time sum calculator.',
        effect: 'Confirms that the sum remains exactly 360.0° regardless of vertex dragging.'
      }
    ],
    stepByStepInstructions: [
      'Drag any vertex wildly across the canvas and watch the live angle sum display stay locked at 360°.',
      'Click the "Parallelogram" preset pill. Observe opposite sides become parallel and equal.',
      'Inspect the diagonals: note that AO = OC and BO = OD (diagonals bisect each other).',
      'Click the "Rhombus" preset: observe all 4 sides become equal, and the diagonal intersection angle snaps to 90°.',
      'Click "Rectangle" to watch all 4 angles snap to 90° while diagonals AC and BD become equal in length.'
    ],
    expectedOutput: 'A clean vector polygon with dynamic angle arcs, tick marks on equal sides, and dotted diagonals. A live property matrix verifies whether the active shape meets Parallelogram, Rectangle, Rhombus, or Square criteria.',
    realWorldApplication: {
      domain: 'Robotics & Mechanical Pantographs',
      title: 'Four-Bar Linkage Mechanisms in Automotive Suspensions',
      scenario: 'Automobile double-wishbone suspensions and heavy excavators use hinged 4-bar quadrilateral linkages to absorb vertical terrain shocks.',
      mathematicalConnection: 'Parallel-motion linkage geometry preserves wheel camber angles by maintaining a parallelogram invariant as the chassis oscillates over bumps.'
    }
  },

  'euler-polyhedra-3d': {
    simulatorId: 'euler-polyhedra-3d',
    h1Heading: "Euler's Polyhedra 3D Formula Workshop (F + V - E = 2)",
    introduction: "Step inside a 3D geometric laboratory to build, rotate, slice, and verify Euler's famous characteristic formula for convex polyhedra: Faces + Vertices - Edges = 2. Examine Platonic solids, prisms, pyramids, and truncated shapes in full 360° WebGL rendering.",
    learningObjectives: [
      "Master Euler's Polyhedral Formula: F + V - E = 2 for any simple convex polyhedron.",
      'Inspect the 5 Platonic Solids: Tetrahedron, Cube, Octahedron, Dodecahedron, and Icosahedron.',
      'Calculate the number of faces, vertices, and edges of n-gonal prisms and pyramids systematically.',
      'Understand why non-convex and toroidal polyhedra break the basic Euler characteristic.'
    ],
    mathematicalPrinciples: [
      {
        title: "Euler's Polyhedral Formula",
        description: 'For any convex polyhedron with F faces, V vertices, and E edges, the alternating topological sum is strictly 2.',
        formulaLatex: 'F + V - E = 2'
      },
      {
        title: 'Prism & Pyramid Invariants',
        description: 'An n-gonal prism has F = n + 2, V = 2n, E = 3n. An n-gonal pyramid has F = n + 1, V = n + 1, E = 2n.',
        formulaLatex: '\\text{Prism: } (n+2) + 2n - 3n = 2, \\quad \\text{Pyramid: } (n+1) + (n+1) - 2n = 2'
      }
    ],
    controlsGuide: [
      {
        name: '3D Polyhedron Selector',
        type: 'button',
        description: 'Switches 3D models between Cube, Tetrahedron, Octahedron, Triangular Prism, and Hexagonal Pyramid.',
        effect: 'Loads the chosen solid into the 3D WebGL viewport with real-time face, vertex, and edge meshes.'
      },
      {
        name: '360° Orbit & Tilt Drag',
        type: 'drag',
        description: 'Touch and rotate the 3D model in any direction around its center of mass.',
        effect: 'Enables complete visual inspection of hidden back faces, vertices, and edges.'
      },
      {
        name: 'Explode Faces Slider',
        type: 'slider',
        description: 'Detaches all polygonal faces radially outward along their surface normal vectors.',
        effect: 'Allows students to count individual faces clearly without optical occlusion.'
      },
      {
        name: 'Euler Verification Counter',
        type: 'stepper',
        description: 'Live interactive counters for F, V, and E with auto-evaluation badge.',
        effect: 'Demonstrates F + V - E = 2 step-by-step.'
      }
    ],
    stepByStepInstructions: [
      'Select the Cube (Hexahedron) in the 3D selector.',
      'Rotate the model to count: 6 Faces, 8 Vertices, and 12 Edges.',
      'Verify the arithmetic in the cockpit: 6 + 8 - 12 = 14 - 12 = 2.',
      'Switch to the Octahedron (8 faces, 6 vertices, 12 edges) and confirm 8 + 6 - 12 = 2.',
      'Use the "Explode Faces" slider to expand the triangular faces into 3D space for effortless counting.'
    ],
    expectedOutput: 'A glowing, wireframe-accented 3D WebGL solid rotates smoothly with specular lighting. Real-time counter pills tally F, V, and E, verifying the formula with an animated green checkmark.',
    realWorldApplication: {
      domain: 'Nanotechnology & Organic Chemistry',
      title: 'Fullerene (Buckyball C60) Molecular Stability Analysis',
      scenario: 'Chemists synthesizing Carbon-60 fullerenes construct spherical carbon cages made of 12 pentagons and 20 hexagons.',
      mathematicalConnection: "Euler's formula F + V - E = 2 mathematically mandates that ANY closed fullerene composed exclusively of pentagons and hexagons MUST contain exactly 12 pentagonal rings to close into a sphere."
    }
  },

  'direct-inverse-proportions': {
    simulatorId: 'direct-inverse-proportions',
    h1Heading: 'Direct vs Inverse Proportions Interactive Machine',
    introduction: 'Experience the fundamental duality of proportional variation. Contrast Direct Proportion (y/x = k, straight line through origin) against Inverse Proportion (x · y = k, hyperbolic curve) through interactive gears, fuel consumption rates, and speed-versus-time scenarios.',
    learningObjectives: [
      'Master Direct Proportion: when x doubles, y doubles such that ratio y/x = k remains constant.',
      'Master Inverse Proportion: when x doubles, y halves such that product x · y = k remains constant.',
      'Distinguish linear graphs through origin from reciprocal rectangular hyperbolas.',
      'Solve CBSE Class 8 unitary method problems using structured proportional cross-multiplication.'
    ],
    mathematicalPrinciples: [
      {
        title: 'Direct Proportion Invariant',
        description: 'Variables x and y vary directly if their quotient is a constant k.',
        formulaLatex: '\\frac{y_1}{x_1} = \\frac{y_2}{x_2} = k \\implies y = kx'
      },
      {
        title: 'Inverse Proportion Invariant',
        description: 'Variables x and y vary inversely if their product is a constant k.',
        formulaLatex: 'x_1 \\cdot y_1 = x_2 \\cdot y_2 = k \\implies y = \\frac{k}{x}'
      }
    ],
    controlsGuide: [
      {
        name: 'Proportion Mode Switcher',
        type: 'button',
        description: 'Toggles between Direct Mode (Speed & Distance) and Inverse Mode (Speed & Time for fixed distance).',
        effect: 'Switches mathematical engine and dynamic coordinate graph.'
      },
      {
        name: 'Input Variable (x) Slider',
        type: 'slider',
        description: 'Modifies primary variable x (e.g., speed, workers, or fuel volume).',
        effect: 'Instantly computes dependent variable y using the invariant constant k.'
      },
      {
        name: 'Constant of Proportionality (k) Slider',
        type: 'slider',
        description: 'Alters constant k (e.g., journey distance or unit item cost).',
        effect: 'Steepens the direct line slope or shifts the inverse hyperbola outward.'
      }
    ],
    stepByStepInstructions: [
      'Select Direct Proportion mode: set constant rate k = 15 km/L (fuel efficiency).',
      'Scrub fuel volume x from 2 L to 10 L: watch distance y climb proportionally from 30 km to 150 km.',
      'Observe the graph: a straight line rising from (0, 0) with constant slope k.',
      'Switch to Inverse Proportion mode: set journey distance k = 120 km.',
      'Scrub driving speed x from 20 km/h to 120 km/h: watch travel time y drop from 6.0 hours to 1.0 hour.',
      'Confirm the product invariant: 20 × 6 = 60 × 2 = 120 × 1 = 120.'
    ],
    expectedOutput: 'Side-by-side animated meters display input and output values while an adjacent coordinate plane plots the trajectory: a straight ray for direct variation, or an asymptotic curve for inverse variation.',
    realWorldApplication: {
      domain: 'Construction Management & Project Scheduling',
      title: 'Labor Force Allocation vs Construction Deadlines',
      scenario: 'A general contractor must finish pouring concrete for an overpass requiring 120 person-days of labor.',
      mathematicalConnection: 'Workers (W) and Days (D) are inversely proportional (W · D = 120). Employing 10 workers requires 12 days; tripling the team to 30 workers shrinks the schedule to 4 days.'
    }
  },

  'dynamic-pie-chart': {
    simulatorId: 'dynamic-pie-chart',
    h1Heading: 'Data Handling Dynamic Pie Chart & Central Angle Cutter',
    introduction: 'Transform raw numerical survey data into colorful circular sector representations. Drag categorical category values to watch proportional slices expand and contract while verifying that the sum of central angles at the center of the circle is strictly 360°.',
    learningObjectives: [
      'Convert raw frequency counts into percentage fractions of a total dataset.',
      'Calculate central angles of sectors using the formula: θ = (Value / Total) × 360°.',
      'Understand visual distortion traps in 3D pie charts and recognize when bar graphs are superior.',
      'Accurately construct and interpret pie charts for CBSE Class 8 Data Handling examinations.'
    ],
    mathematicalPrinciples: [
      {
        title: 'Central Angle Sector Formula',
        description: 'The angle subtended by a categorical sector at the center of the pie chart is proportional to its fraction of total frequency.',
        formulaLatex: '\\theta_i = \\left( \\frac{f_i}{\\sum f} \\right) \\times 360^\\circ, \\quad \\sum_{i=1}^n \\theta_i = 360^\\circ'
      },
      {
        title: 'Sector Percentage Conversion',
        description: 'The percentage share of total data represented by each category is (Value / Total) × 100%.',
        formulaLatex: 'P_i = \\left( \\frac{f_i}{\\sum f} \\right) \\times 100\\%'
      }
    ],
    controlsGuide: [
      {
        name: 'Category Frequency Sliders',
        type: 'slider',
        description: 'Adjusts frequencies for 4 distinct categories (e.g., Sports, Coding, Music, Art).',
        effect: 'Recomputes total sum and resizes individual circular sectors proportionally in real time.'
      },
      {
        name: 'Radial Protractor Overlay Toggle',
        type: 'toggle',
        description: 'Displays a 360° circular degree protractor over the pie chart.',
        effect: 'Enables students to measure central angles directly on screen.'
      },
      {
        name: 'Explode Slices Button',
        type: 'button',
        description: 'Pulls wedges outward from the circle center.',
        effect: 'Isolates individual sectors for distinct angle and percentage inspection.'
      }
    ],
    stepByStepInstructions: [
      'Enter category values: Category A = 25, B = 25, C = 25, D = 25 (total = 100).',
      'Observe 4 equal 90° quadrants: (25/100) × 360° = 90°.',
      'Increase Category A to 50: total becomes 125, so Category A now claims (50/125) × 360° = 144°.',
      'Turn on the "Radial Protractor" to measure sector angles directly.',
      'Verify that the sum of all sector angles in the live data table totals exactly 360.0°.'
    ],
    expectedOutput: 'A clean 2D vector circle divided into crisp, distinct colored sectors. An accompanying data ledger updates central angles, fractional parts, and percentages dynamically as values change.',
    realWorldApplication: {
      domain: 'National Budgeting & Economic Transparency',
      title: 'Union Budget Expenditure Breakdown',
      scenario: 'The Ministry of Finance visualizes revenue allocation across Defense, Education, Healthcare, Infrastructure, and Interest Payments.',
      mathematicalConnection: 'Converting trillions of rupees into central angles ensures citizens immediately perceive budgetary priorities without drowning in statistical tables.'
    }
  },

  'square-roots-triplets': {
    simulatorId: 'square-roots-triplets',
    h1Heading: 'Squares, Square Roots & Pythagorean Triplet Forge Lab',
    introduction: 'Build geometric square arrays and forge integer Pythagorean Triplets using the algebraic generator 2m, m² - 1, m² + 1. Experience square numbers as literal physical square tile arrangements, and watch the visual prime factorization and long division square root algorithms in action.',
    learningObjectives: [
      'Understand perfect squares geometrically as n × n grid arrangements of unit tiles.',
      'Generate infinite integer Pythagorean Triplets using the formula (2m, m² - 1, m² + 1).',
      'Verify that for any integer m > 1: (2m)² + (m² - 1)² = (m² + 1)².',
      'Determine the square root of non-square integers by finding nearest bounding square integers.'
    ],
    mathematicalPrinciples: [
      {
        title: 'Pythagorean Triplet Generator Identity',
        description: 'For any integer m > 1, the three numbers 2m, m² - 1, and m² + 1 always satisfy Pythagoras’ theorem.',
        formulaLatex: '(2m)^2 + (m^2 - 1)^2 = 4m^2 + m^4 - 2m^2 + 1 = m^4 + 2m^2 + 1 = (m^2 + 1)^2'
      },
      {
        title: 'Square Number Sum of Odd Numbers',
        description: 'Every perfect square n² is the sum of the first n consecutive odd natural numbers.',
        formulaLatex: 'n^2 = 1 + 3 + 5 + 7 + \\dots + (2n - 1)'
      }
    ],
    controlsGuide: [
      {
        name: 'Generator Integer (m) Stepper',
        type: 'stepper',
        description: 'Selects integer m from 2 to 12.',
        effect: 'Computes the triplet: leg a = 2m, leg b = m² - 1, hypotenuse c = m² + 1.'
      },
      {
        name: 'Square Tile Grid Slider',
        type: 'slider',
        description: 'Expands an n × n square tile grid from 1 × 1 up to 15 × 15.',
        effect: 'Renders the square array visually and shows the consecutive odd number L-shaped layer breakdown.'
      },
      {
        name: 'Verify Triplet Right Triangle Button',
        type: 'button',
        description: 'Draws a scale right-angled triangle with side lengths equal to the generated triplet.',
        effect: 'Visually confirms that a² + b² = c².'
      }
    ],
    stepByStepInstructions: [
      'Set generator integer m = 2 in the Triplet Forge.',
      'Observe the generated triplet: 2(2) = 4, 2² - 1 = 3, 2² + 1 = 5 (the classic 3-4-5 triplet).',
      'Step m up to 3: observe the new triplet 6, 8, 10 (a scaled 3-4-5).',
      'Step m up to 4: generate primitive triplet 8, 15, 17. Verify: 8² + 15² = 64 + 225 = 289 = 17².',
      'Switch to the Tile Grid tab and scrub n to 5: count 25 tiles made of layers 1 + 3 + 5 + 7 + 9.'
    ],
    expectedOutput: 'An interactive right triangle displays dynamic leg and hypotenuse lengths with squares attached to each side. An adjacent tile grid highlights odd-number L-shaped shells in distinct colors.',
    realWorldApplication: {
      domain: 'Carpentry & Construction Masonry',
      title: 'The 3-4-5 Framing Square Technique for Perfect 90° Corners',
      scenario: 'Builders laying foundation trenches for buildings use ropes measured in lengths of 3m, 4m, and 5m to establish exact right-angle wall corners.',
      mathematicalConnection: 'By the converse of Pythagoras’ theorem, any triangle with sides in ratio 3:4:5 MUST have a strictly 90.0° angle opposite the 5-unit hypotenuse.'
    }
  },

  'exponents-powers-lab': {
    simulatorId: 'exponents-powers-lab',
    h1Heading: 'Exponents and Powers: Laws of Indices & Cosmic Scales',
    introduction: 'Explore the 7 foundational laws of exponents through interactive multiplication towers, negative power reflections, and scientific notation comparisons from atomic sub-nanometers (10⁻¹⁵ m) to cosmic galaxy clusters (10²⁶ m).',
    learningObjectives: [
      'Master the product and quotient laws of indices: aᵐ · aⁿ = aᵐ⁺ⁿ and aᵐ / aⁿ = aᵐ⁻ⁿ.',
      'Understand why any non-zero number to power zero equals 1: a⁰ = 1.',
      'Demystify negative exponents: a⁻ⁿ is the multiplicative reciprocal 1 / aⁿ, NOT a negative number.',
      'Convert very large and very small quantities into standard scientific notation (k × 10ⁿ).'
    ],
    mathematicalPrinciples: [
      {
        title: 'Core Laws of Indices',
        description: 'Exponents represent repeated multiplication; operations on powers with identical bases combine by arithmetic on exponents.',
        formulaLatex: 'a^m \\cdot a^n = a^{m+n}, \\quad \\frac{a^m}{a^n} = a^{m-n}, \\quad (a^m)^n = a^{m \\cdot n}'
      },
      {
        title: 'Negative & Zero Exponents',
        description: 'A negative exponent represents division by the base, while power zero represents a quotient of equal quantities.',
        formulaLatex: 'a^{-n} = \\frac{1}{a^n}, \\quad a^0 = \\frac{a^n}{a^n} = 1 \\quad (a \\neq 0)'
      }
    ],
    controlsGuide: [
      {
        name: 'Base (a) Stepper',
        type: 'stepper',
        description: 'Sets the base number from 2 to 10.',
        effect: 'Updates the repeating factor in all exponent visualization trees.'
      },
      {
        name: 'Exponent m & n Sliders',
        type: 'slider',
        description: 'Adjusts power values m and n from -5 to +8.',
        effect: 'Expands the power tower and dynamically demonstrates multiplication or reciprocal division.'
      },
      {
        name: 'Cosmic Scale Zoom Slider',
        type: 'slider',
        description: 'Scrolls from 10⁻¹⁵ m (Proton diameter) to 10²⁶ m (Observable Universe).',
        effect: 'Shows real physical entities corresponding to every power of 10.'
      }
    ],
    stepByStepInstructions: [
      'Set base a = 2, exponent m = 3, and n = 4.',
      'Observe the product tree: 2³ × 2⁴ = (2 × 2 × 2) × (2 × 2 × 2 × 2) = 2⁷ = 128.',
      'Slide n to -2: observe 2³ × 2⁻² = 8 × (1/4) = 2¹ = 2.',
      'Set m = 4 and n = 4: watch 2⁴ / 2⁴ = 16 / 16 = 1 = 2⁰, proving why a⁰ = 1.',
      'Switch to Cosmic Scale mode and drag to 10⁻¹⁰ m to view an atom, then to 10⁸ m to view Earth-Moon distance.'
    ],
    expectedOutput: 'Interactive factor chains expand and contract dynamically. A reciprocal balance mirror clearly reflects positive powers into fractional denominators for negative exponents.',
    realWorldApplication: {
      domain: 'Computer Science & Memory Addressing',
      title: '64-Bit Architecture & RAM Capacity Limits',
      scenario: 'Modern computer processors utilize 64-bit binary addressing to reference bytes of system memory.',
      mathematicalConnection: 'Total addressable memory space is exactly 2⁶⁴ bytes = 18.4 Quintillion bytes (16 Exabytes), demonstrating the immense exponential power of doubling 64 times.'
    }
  },

  'rational-numbers-density': {
    simulatorId: 'rational-numbers-density',
    h1Heading: 'Rational Numbers: Number Line & Infinite Density Sandbox',
    introduction: 'Zoom infinitely into the number line between any two rational numbers to witness the property of dense continuity. Learn to find 5, 10, or 100 rational numbers between fractions like 1/3 and 1/2 using common denominators and mean averages.',
    learningObjectives: [
      'Define rational numbers formally as numbers of the form p/q where p, q are integers and q ≠ 0.',
      'Verify the Density Property: between ANY two distinct rational numbers, there exist infinitely many rational numbers.',
      'Master the common denominator scaling technique: multiply numerator and denominator by (n + 1) to find n numbers.',
      'Calculate the arithmetic midpoint (a + b) / 2 to generate rational numbers recursively.'
    ],
    mathematicalPrinciples: [
      {
        title: 'Rational Number Definition',
        description: 'A number that can be expressed as a quotient of integers with non-zero denominator.',
        formulaLatex: '\\mathbb{Q} = \\left\\{ \\frac{p}{q} \\;\\middle|\\; p, q \\in \\mathbb{Z}, \\, q \\neq 0 \\right\\}'
      },
      {
        title: 'Infinite Density via Arithmetic Mean',
        description: 'For any two rational numbers a < b, their average m = (a + b) / 2 is strictly between them: a < m < b.',
        formulaLatex: 'a < \\frac{a + b}{2} < b'
      }
    ],
    controlsGuide: [
      {
        name: 'Left Fraction (p₁/q₁) Steppers',
        type: 'stepper',
        description: 'Sets numerator and denominator of the lower boundary fraction.',
        effect: 'Positions the left anchor marker on the interactive number line.'
      },
      {
        name: 'Right Fraction (p₂/q₂) Steppers',
        type: 'stepper',
        description: 'Sets numerator and denominator of the upper boundary fraction.',
        effect: 'Positions the right anchor marker on the interactive number line.'
      },
      {
        name: 'Infinite Zoom Slider',
        type: 'slider',
        description: 'Magnifies the interval between the two fractions from 1x to 10,000x.',
        effect: 'Reveals nested sub-intervals and inner rational numbers with fractional tags.'
      },
      {
        name: 'Insert n Fractions Slider',
        type: 'slider',
        description: 'Chooses how many rational numbers (1 to 20) to insert between boundaries.',
        effect: 'Demonstrates common denominator scaling by (n + 1) in real time.'
      }
    ],
    stepByStepInstructions: [
      'Set left fraction to 1/3 and right fraction to 1/2.',
      'Select "Insert 5 Rational Numbers" using the slider.',
      'Watch the simulator convert boundaries to equivalent fractions with common denominator 30: 10/30 and 15/30.',
      'Read the 4 intermediate fractions directly: 11/30, 12/30, 13/30, and 14/30.',
      'Use the Infinite Zoom slider to zoom into the gap between 11/30 and 12/30, inserting yet another set of fractions.'
    ],
    expectedOutput: 'An ultra-smooth vector number line with zoomable tick marks, fractional badges, decimal equivalents, and animated bracket expansions illustrating infinite subdivisions.',
    realWorldApplication: {
      domain: 'Digital Audio & Digital Signal Processing (DSP)',
      title: 'Floating-Point Quantization & Audio Upsampling',
      scenario: 'High-resolution audio DACs interpolate intermediate sample points between digital audio waveform measurements.',
      mathematicalConnection: 'Digital interpolation utilizes polynomial rational approximations between discrete audio samples to eliminate audible stair-step distortion and reproduce silky smooth sound.'
    }
  }
};

