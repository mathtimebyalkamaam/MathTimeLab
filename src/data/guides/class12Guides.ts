import { SimulatorGuide } from '../../types/simulatorGuides';

export const CLASS_12_GUIDES: Record<string, SimulatorGuide> = {
  'matrix-meme': {
    simulatorId: 'matrix-meme',
    h1Heading: 'Matrix Machine: 2D Linear Transformations & Determinant Area Squeezer',
    introduction: 'Transform 2D geometric space using 2x2 linear transformation matrices. Drag basis vectors i-hat (1, 0) and j-hat (0, 1) across the Cartesian plane to witness real-time rotations, shears, reflections, and scaling, while the matrix determinant det(M) = ad - bc tracks the exact signed area scaling factor of space.',
    learningObjectives: [
      'Understand a 2x2 matrix as a transformation where column 1 is the landing site of i-hat and column 2 is the landing site of j-hat.',
      'Visualize the determinant det(M) as the signed area scaling factor of the unit square.',
      'Recognize what det(M) = 0 means geometrically: space collapses from 2D into a 1D line or 0D point (non-invertible singular matrix).',
      'Discover that a negative determinant indicates orientation reversal (a spatial reflection / flip).'
    ],
    mathematicalPrinciples: [
      {
        title: 'Matrix Vector Transformation',
        description: 'Every point (x, y) is mapped linearly to a new position by matrix multiplication.',
        formulaLatex: '\\begin{pmatrix} x\' \\\\ y\' \\end{pmatrix} = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} \\begin{pmatrix} x \\\\ y \\end{pmatrix} = x \\begin{pmatrix} a \\\\ c \\end{pmatrix} + y \\begin{pmatrix} b \\\\ d \\end{pmatrix}'
      },
      {
        title: 'Determinant as Signed Area Scaling Factor',
        description: 'The area of the transformed unit parallelogram equals the determinant of the transformation matrix.',
        formulaLatex: '\\det(M) = \\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix} = ad - bc = \\frac{\\text{Transformed Area}}{\\text{Original Area}}'
      }
    ],
    controlsGuide: [
      {
        name: 'Basis Vector Handles (i-hat & j-hat)',
        type: 'interactive vector arrows',
        description: 'Drag landing positions of basis vectors i-hat (column 1) and j-hat (column 2) directly on canvas.',
        effect: 'Distorts the entire background grid and all embedded shapes in real-time.'
      },
      {
        name: 'Matrix Element Sliders (a, b, c, d)',
        type: 'numeric sliders',
        range: '-3.0 to +3.0',
        description: 'Fine-tunes individual coefficients of matrix M = [[a, b], [c, d]].',
        effect: 'Updates transformation matrix parameters numerically.'
      },
      {
        name: 'Preset Matrix Library',
        type: 'button presets',
        options: 'Rotation (θ), Horizontal Shear, Vertical Shear, Reflection across Y=X, Area Squeeze (det=1), Singular Collapse (det=0)',
        description: 'Applies canonical linear transformation matrices with one click.',
        effect: 'Demonstrates textbook matrix behaviors with exact KaTeX proofs.'
      }
    ],
    stepByStepInstructions: [
      'Start with Identity Matrix [[1, 0], [0, 1]]: note that det(M) = 1(1) - 0(0) = 1.00, and the unit square has area 1.',
      'Select the "Horizontal Shear" preset [[1, 1], [0, 1]]: observe that j-hat tilts to (1, 1) while i-hat stays at (1, 0).',
      'Check the determinant: det(M) = 1(1) - 1(0) = 1.00! Even though the square skewed into a parallelogram, base is 1 and height is 1, so area is strictly preserved.',
      'Select the "Singular Collapse" preset [[1, 2], [2, 4]]: observe that both basis vectors land on the same line y = 2x.',
      'Note that det(M) = 1(4) - 2(2) = 0: the 2D plane has collapsed into a 1D line with 0 area, proving why this matrix has no inverse!'
    ],
    expectedOutput: 'Interactive 2D Cartesian grid with animated coordinate warp, transforming Mona Lisa / geometric test shape, color-coded basis vectors, live determinant gauge, and matrix equation display.',
    realWorldApplication: {
      field: 'Computer Graphics, Video Game Engines & Robotics',
      description: 'Used in 3D GPU vertex shaders, camera projection matrices in Unity/Unreal Engine, robotics forward kinematics, and facial recognition eigenfaces.',
      example: 'In every 3D video game, rotating an in-game character by angle θ around the vertical axis multiplies vertex coordinates by the rotation matrix [[cos θ, -sin θ], [sin θ, cos θ]].'
    }
  },

  'calculus-sandbox': {
    simulatorId: 'calculus-sandbox',
    h1Heading: 'Calculus Sandbox: Derivative Tangent & Riemann Sum Integrator',
    introduction: 'Unify differential and integral calculus in a single interactive sandbox. Slide across polynomial, trigonometric, and exponential curves to trace the derivative function f\'(x) as the slope of the tangent line, and partition the domain into N sub-rectangles to watch Riemann sums converge to the exact definite integral.',
    learningObjectives: [
      'Visualize the derivative function f\'(x) as the moving slope of the tangent line.',
      'Identify local extrema (maxima/minima) where tangent slope is zero (f\'(x) = 0) and inflection points where curvature flips (f\'\'(x) = 0).',
      'Compute Left, Right, Midpoint, and Trapezoidal Riemann sums for N partitions.',
      'Witness the Fundamental Theorem of Calculus: integration accumulates area while differentiation measures instantaneous rate of change.'
    ],
    mathematicalPrinciples: [
      {
        title: 'Derivative as Tangent Slope',
        description: 'The derivative at point x0 is the slope of the linear tangent line.',
        formulaLatex: 'y - f(x_0) = f\'(x_0)(x - x_0), \\quad f\'(x_0) = \\left. \\frac{dy}{dx} \\right|_{x = x_0}'
      },
      {
        title: 'Definite Integral as Limit of Riemann Sums',
        description: 'The exact area under curve f(x) from x = a to x = b.',
        formulaLatex: '\\int_a^b f(x)\\,dx = \\lim_{N \\to \\infty} \\sum_{i=1}^N f(x_i^*) \\Delta x, \\quad \\Delta x = \\frac{b - a}{N}'
      }
    ],
    controlsGuide: [
      {
        name: 'Curve Tangent Slider (x0)',
        type: 'slider',
        range: '-4.0 to +4.0',
        description: 'Moves the tangent contact point across the function domain.',
        effect: 'Updates tangent line, slope readout, and traces the derivative curve f\'(x).'
      },
      {
        name: 'Riemann Partition Slider (N)',
        type: 'slider',
        range: '2 to 100 rectangles',
        description: 'Sets the number of subdivisions used to approximate the definite integral.',
        effect: 'Shows rectangle convergence toward the smooth integral area.'
      },
      {
        name: 'Riemann Rule Selector (Left / Right / Mid / Trap)',
        type: 'selector',
        description: 'Chooses how rectangle heights are sampled across each subinterval.',
        effect: 'Compares under-estimation vs over-estimation errors.'
      },
      {
        name: 'Integration Bounds Handles (a and b)',
        type: 'dual draggable handles',
        description: 'Sets lower limit a and upper limit b on the X-axis.',
        effect: 'Updates definite integral domain and shaded area calculation.'
      }
    ],
    stepByStepInstructions: [
      'Select function f(x) = x³ - 3x on domain [-2.5, 2.5].',
      'Slide x0 to x = -1.0: observe that the tangent line becomes completely horizontal (slope m = 0), marking the local maximum at (-1, 2).',
      'Slide x0 to x = +1.0: observe another horizontal tangent (m = 0), marking the local minimum at (1, -2).',
      'Switch to "Integral Mode" with bounds a = 0 to b = 2 and start with N = 4 rectangles: note the Riemann sum error.',
      'Increase N to 50: observe how the jagged rectangular steps melt into the exact signed area ∫(x³ - 3x) dx = -2.00.'
    ],
    expectedOutput: 'Interactive dual-pane calculus display featuring smooth function curve, animated tangent line with slope angle protractor, derivative trace ribbon, and color-coded Riemann integral rectangles.',
    realWorldApplication: {
      field: 'Thermodynamics, Economics & Civil Architecture',
      description: 'Used to calculate total thermodynamic work done W = ∫P dV in internal combustion engines, consumer surplus in economics, and fluid volumes in irregularly curved civil reservoirs.',
      example: 'In mechanical engineering, the total energy consumed by an electric vehicle over a journey is the definite integral of power with respect to time: E = ∫ P(t) dt.'
    }
  },

  'rollercoaster-architect': {
    simulatorId: 'rollercoaster-architect',
    h1Heading: 'Rollercoaster Architect: Derivatives, Curvature & Optimization Lab',
    introduction: 'Design thrilling yet physiologically safe rollercoasters by applying higher-order derivatives. Position cubic spline track anchor nodes to manipulate track slope f\'(x), vertical acceleration f\'\'(x), and track curvature κ(x), preventing excessive G-force blackouts while finding critical loops and local velocity extrema.',
    learningObjectives: [
      'Apply First Derivative f\'(x) to identify hill peaks and valley troughs (critical points where f\'(x) = 0).',
      'Apply Second Derivative f\'\'(x) to assess track concavity and centripetal normal acceleration.',
      'Calculate track curvature κ = |f\'\'(x)| / [1 + (f\'(x))²]^(3/2) to determine turning radius.',
      'Optimize coaster transitions to ensure vertical G-forces remain within safe human physiological tolerances (-1G to +4G).'
    ],
    mathematicalPrinciples: [
      {
        title: 'Critical Point First Derivative Test',
        description: 'Stationary points occur where the tangent slope is zero.',
        formulaLatex: 'f\'(x) = 0 \\implies \\text{Hill Crest (Maximum if } f\'\'(x) < 0\\text{) or Valley Dip (Minimum if } f\'\'(x) > 0\\text{)}'
      },
      {
        title: 'Formula for Track Curvature & Normal G-Force',
        description: 'The curvature of a plane curve determines the instantaneous radius of curvature R = 1/κ.',
        formulaLatex: '\\kappa(x) = \\frac{|f\'\'(x)|}{\\left(1 + [f\'(x)]^2\\right)^{3/2}}, \\quad G_{\\text{force}} = 1 + \\frac{v^2}{g R} = 1 + \\frac{v^2 \\kappa(x)}{g}'
      }
    ],
    controlsGuide: [
      {
        name: 'Track Anchor Control Points (P1, P2, P3, P4)',
        type: 'draggable spline handles',
        description: 'Adjust the height and position of coaster track peaks, dips, and loop entrances.',
        effect: 'Smoothly recalculates cubic spline curve and all higher-order derivatives.'
      },
      {
        name: 'Launch Train Cart Button',
        type: 'simulation trigger',
        description: 'Releases a coaster car from the initial peak to run dynamic physics under gravity.',
        effect: 'Car rolls along track with live speed, kinetic/potential energy, and G-force telemetry.'
      },
      {
        name: 'Safety Envelope Threshold Overlay',
        type: 'toggle',
        description: 'Highlights track segments where vertical G-forces exceed safe thresholds (> 4.5G red blackout hazard, < -1.5G purple airtime hazard).',
        effect: 'Flags dangerous curvature spikes for re-engineering.'
      }
    ],
    stepByStepInstructions: [
      'Position anchor P1 at height 50 m to serve as the initial lift hill drop.',
      'Create a sharp valley dip at x = 40 m with anchor P2 at height 5 m.',
      'Click "Launch Train" and watch the cart accelerate down the drop, converting potential energy mgh into kinetic energy 1/2 mv².',
      'Inspect the G-force meter at the bottom of the dip: notice how high speed combined with sharp curvature κ creates high positive Gs (> 3.5G).',
      'Smoothen the dip by raising anchor P2 slightly: observe how reducing second derivative f\'\'(x) lowers curvature κ and safely reduces peak G-forces into the comfortable 2.5G zone.'
    ],
    expectedOutput: 'Interactive 2D physics amusement park track with smooth cubic spline rails, animated rollercoaster cart, live energy bar graphs (KE vs PE), slope meter, and dynamic G-force dial.',
    realWorldApplication: {
      field: 'Amusement Park Engineering & Highway Curve Design',
      description: 'Used by coaster designers (like Intamin and B&M) and civil transport engineers to design banked highway highway transitions (clothoid spirals) with continuous curvature to avoid sudden steering jerks.',
      example: 'Rollercoaster loops use teardrop clothoid loops rather than circular loops because curvature increases gradually with 1/R, preventing sudden catastrophic neck-snapping G-spikes on train entry.'
    }
  },

  'vector-flight-lab': {
    simulatorId: 'vector-flight-lab',
    h1Heading: '3D Vector Flight Lab: Dot & Cross Product Aerospace Mechanics',
    introduction: 'Pilot an interactive supersonic aircraft in 3D vector space. Manipulate flight thrust, wind velocity, and lift vectors to master dot products (scalar projections, work done, and directional alignment) and cross products (orthogonal torque vectors, angular momentum, and the right-hand rule).',
    learningObjectives: [
      'Distinguish between scalar dot product (A · B = |A||B| cos θ) and vector cross product (A × B = |A||B| sin θ n_hat).',
      'Apply the dot product perpendicularity condition: A · B = 0 if and only if vectors are orthogonal.',
      'Apply the cross product collinearity condition: A × B = 0 if and only if vectors are parallel.',
      'Internalize the Right-Hand Rule for cross products in 3D Cartesian coordinates.'
    ],
    mathematicalPrinciples: [
      {
        title: 'Dot Product (Scalar Projection)',
        description: 'Measures the degree to which two vectors point in the same direction.',
        formulaLatex: '\\vec{A} \\cdot \\vec{B} = A_x B_x + A_y B_y + A_z B_z = |\\vec{A}| |\\vec{B}| \\cos(\\theta), \\quad \\cos(\\theta) = \\frac{\\vec{A} \\cdot \\vec{B}}{|\\vec{A}| |\\vec{B}|}'
      },
      {
        title: 'Cross Product (Orthogonal Vector & Area)',
        description: 'Produces a vector strictly perpendicular to both input vectors with magnitude equal to the parallelogram area.',
        formulaLatex: '\\vec{A} \\times \\vec{B} = \\begin{vmatrix} \\hat{i} & \\hat{j} & \\hat{k} \\\\ A_x & A_y & A_z \\\\ B_x & B_y & B_z \\end{vmatrix} = |\\vec{A}| |\\vec{B}| \\sin(\\theta) \\,\\hat{n}'
      }
    ],
    controlsGuide: [
      {
        name: 'Aircraft Thrust Vector (A) Sliders',
        type: '3D component sliders (Ax, Ay, Az)',
        range: '-10 to +10 units',
        description: 'Adjusts magnitude and 3D orientation of the aircraft forward thrust vector.',
        effect: 'Rotates aircraft heading and updates vector A.'
      },
      {
        name: 'Wind / Force Vector (B) Sliders',
        type: '3D component sliders (Bx, By, Bz)',
        range: '-10 to +10 units',
        description: 'Adjusts magnitude and 3D orientation of the crosswind force vector.',
        effect: 'Updates vector B on the 3D grid.'
      },
      {
        name: 'Interactive 3D Orbit Camera',
        type: 'orbit controls',
        description: 'Rotates 3D viewpoint around vectors A, B, and the resultant cross product vector.',
        effect: 'Allows viewing orthogonal relations from any spatial angle.'
      },
      {
        name: 'Right-Hand Rule 3D Glove Overlay',
        type: 'toggle',
        description: 'Displays a virtual 3D hand with index finger along A, middle finger along B, and thumb along A × B.',
        effect: 'Provides instant physical intuition for the vector cross product direction.'
      }
    ],
    stepByStepInstructions: [
      'Set Vector A = (3, 0, 0) along the X-axis and Vector B = (0, 4, 0) along the Y-axis.',
      'Check the dot product: A · B = 3(0) + 0(4) + 0(0) = 0. Notice the 90.0° angle indicator confirming orthogonality.',
      'Check the cross product: A × B = (0, 0, 12). Observe the vertical magenta vector pointing straight up along the Z-axis with length 12.',
      'Reverse the order to B × A: observe the cross product vector flip downwards to (0, 0, -12), proving anti-commutativity: A × B = -(B × A).',
      'Toggle the "3D Right-Hand Rule" to visualize index finger curling from A to B while thumb points along the cross product.'
    ],
    expectedOutput: 'Rich 3D WebGL aerospace environment with coordinate axes, color-coded vector arrows, shaded parallelogram spanning A and B, live dot/cross algebraic computation tiles, and angle gauge.',
    realWorldApplication: {
      field: 'Aerospace Engineering & Computer Graphics Shading',
      description: 'Used in aircraft flight dynamics (computing aerodynamic lift and torque τ = r × F), 3D surface normal lighting calculations (Lambertian diffuse shading), and satellite gyroscopic orientation.',
      example: 'In 3D game engines, calculating whether a polygon face faces toward or away from the camera relies on the dot product of the camera view vector and the polygon\'s cross-product normal vector.'
    }
  },

  'ftc-integral-accumulator': {
    simulatorId: 'ftc-integral-accumulator',
    h1Heading: 'Fundamental Theorem of Calculus: Dynamic Area Accumulator',
    introduction: 'Experience the crowning jewel of mathematics: the Fundamental Theorem of Calculus (FTC). Watch how an accumulation function F(x) = ∫[a to x] f(t) dt dynamically collects signed area under integrand curve f(t), proving visually that the instantaneous rate of area accumulation F\'(x) is exactly equal to the height of the curve f(x).',
    learningObjectives: [
      'Formulate FTC Part 1: If f is continuous, then F(x) = ∫[a to x] f(t) dt is differentiable and F\'(x) = f(x).',
      'Formulate FTC Part 2: definite integrals evaluate via antiderivatives: ∫[a to b] f(t) dt = F(b) - F(a).',
      'Understand how signed area works: regions above the X-axis accumulate positive value, while regions below accumulate negative value.',
      'Connect the slope of the accumulation curve F(x) at any point directly to the height of the integrand f(x).'
    ],
    mathematicalPrinciples: [
      {
        title: 'Fundamental Theorem of Calculus (Part 1)',
        description: 'Differentiation and integration are inverse mathematical operations.',
        formulaLatex: '\\frac{d}{dx} \\left[ \\int_a^x f(t)\\,dt \\right] = f(x)'
      },
      {
        title: 'Fundamental Theorem of Calculus (Part 2 - Evaluation Theorem)',
        description: 'Evaluating definite integrals through any arbitrary antiderivative F where F\' = f.',
        formulaLatex: '\\int_a^b f(t)\\,dt = F(b) - F(a) = \\left[ F(x) \\right]_a^b'
      }
    ],
    controlsGuide: [
      {
        name: 'Accumulation Scanner Slider (x)',
        type: 'horizontal scrub slider',
        range: 'Domain from -3 to +5',
        description: 'Sweeps the upper integration limit x forward across the domain.',
        effect: 'Dynamically shades accumulated area and traces accumulation function F(x).'
      },
      {
        name: 'Base Anchor Slider (a)',
        type: 'slider',
        range: '-3 to +3',
        description: 'Sets the starting point of integration where F(a) = 0.',
        effect: 'Shifts the accumulation function F(x) vertically without altering its shape or derivative.'
      },
      {
        name: 'Integrand Curve Presets',
        type: 'button group',
        options: 'f(t) = 2t, f(t) = cos(t), f(t) = t² - 4, f(t) = e^t',
        description: 'Selects the rate function being accumulated.',
        effect: 'Updates both integrand panel and antiderivative accumulation panel simultaneously.'
      }
    ],
    stepByStepInstructions: [
      'Select integrand f(t) = 2t with base anchor a = 0.',
      'Drag scanner x forward from 0 to 3: notice that the accumulated area forms a right-angled triangle of base x and height 2x.',
      'Check the area formula: Area = 1/2 · base · height = 1/2 · x · (2x) = x², so F(x) = x².',
      'Inspect the lower accumulation graph: point (x, F(x)) traces a perfect parabola F(x) = x².',
      'Observe the tangent line to F(x) at x = 3: its slope is exactly 6.00, which matches the height of integrand f(3) = 2(3) = 6, confirming F\'(x) = f(x) visually!'
    ],
    expectedOutput: 'Synchronized dual-graph display showing upper integrand curve f(t) with dynamic area fill, vertical scanner laser, and lower accumulation curve F(x) with live tangent slope readout.',
    realWorldApplication: {
      field: 'Physics, Kinematics & Civil Hydrology',
      description: 'Used to reconstruct position s(t) = ∫ v(t) dt from velocity, velocity v(t) = ∫ a(t) dt from accelerometer data, and dam reservoir water levels from river inflow rate sensors.',
      example: 'A missile guidance computer integrates accelerometer acceleration data a(t) to track velocity, and integrates velocity to track spatial displacement, applying FTC continuously.'
    }
  },

  'bayes-probability-lab': {
    simulatorId: 'bayes-probability-lab',
    h1Heading: 'Bayes\' Theorem: Rare Event Detective & Medical Screening Lab',
    introduction: 'Overcome the prosecutor\'s fallacy and base rate neglect. Explore Bayes\' Theorem by simulating medical diagnostic testing for a rare disease in a population of 100,000 individuals. Adjust disease prevalence, test sensitivity, and test specificity to discover why a positive test result often means less than a 50% chance of actually having the disease.',
    learningObjectives: [
      'Master Bayes\' Theorem formula for updating prior probabilities into posterior probabilities given evidence.',
      'Overcome Base Rate Neglect: understand why rare diseases (low prevalence) generate overwhelming false positive numbers.',
      'Distinguish between Sensitivity (True Positive Rate P(+|D)) and Specificity (True Negative Rate P(-|~D)).',
      'Calculate Positive Predictive Value (PPV): P(D|+) = [P(+|D)·P(D)] / P(+).'
    ],
    mathematicalPrinciples: [
      {
        title: 'Bayes\' Theorem Statement',
        description: 'Calculates conditional probability of hypothesis H given observed evidence E.',
        formulaLatex: 'P(H|E) = \\frac{P(E|H) \\cdot P(H)}{P(E)} = \\frac{P(E|H) \\cdot P(H)}{P(E|H)P(H) + P(E|\\neg H)P(\\neg H)}'
      },
      {
        title: 'Positive Predictive Value (PPV) in Screening',
        description: 'The probability that a patient with a positive test result actually has the disease.',
        formulaLatex: 'P(\\text{Disease}|+) = \\frac{\\text{Sensitivity} \\times \\text{Prevalence}}{(\\text{Sensitivity} \\times \\text{Prevalence}) + (1 - \\text{Specificity}) \\times (1 - \\text{Prevalence})}'
      }
    ],
    controlsGuide: [
      {
        name: 'Disease Prevalence Slider [P(D)]',
        type: 'slider',
        range: '0.1% to 10.0% (logarithmic option)',
        description: 'Sets how common the disease is in the general population.',
        effect: 'Modulates the prior probability base rate.'
      },
      {
        name: 'Test Sensitivity Slider [P(+|D)]',
        type: 'slider',
        range: '80.0% to 99.9%',
        description: 'The probability that the test correctly identifies an infected patient.',
        effect: 'Sets true positive rate.'
      },
      {
        name: 'Test Specificity Slider [P(-|~D)]',
        type: 'slider',
        range: '80.0% to 99.9%',
        description: 'The probability that the test correctly clears a healthy patient.',
        effect: 'Sets false positive rate (1 - Specificity).'
      },
      {
        name: 'Population Grid View Toggle (10,000 Icons)',
        type: 'toggle',
        description: 'Renders a grid of 10,000 individual human icons colored green (healthy) and red (infected).',
        effect: 'Provides natural frequency visual proof of Bayes\' theorem.'
      }
    ],
    stepByStepInstructions: [
      'Set Prevalence = 1.0% (1 in 100 people), Sensitivity = 95%, and Specificity = 95% in a sample of 10,000 people.',
      'Examine the population breakdown: 100 people have the disease, and 9,900 people are healthy.',
      'Of the 100 sick people, 95 test positive (True Positives).',
      'Of the 9,900 healthy people, 5% falsely test positive: 0.05 × 9,900 = 495 people (False Positives)!',
      'Notice that the total positive tests are 95 + 495 = 590. The probability of actually having the disease given a positive test is 95 / 590 ≈ 16.1%, surprising most students who expected 95%!'
    ],
    expectedOutput: 'Interactive 2x2 confusion matrix contingency table, 10,000-person icon dot array, Sankey flow diagram showing probability mass branching, and dynamic posterior probability gauge.',
    realWorldApplication: {
      field: 'Epidemiology, Machine Learning & Spam Detection',
      description: 'Used in medical diagnostic screening protocols (mammography, COVID-19 rapid tests), Naive Bayes email spam filters, and fraud detection algorithms in banking.',
      example: 'Email spam filters evaluate Bayes\' rule P(Spam|words) by updating the prior probability of an email being spam based on the frequency of trigger words like "winner" or "urgent".'
    }
  },

  'three-d-geometry-lab': {
    simulatorId: 'three-d-geometry-lab',
    h1Heading: '3D Geometry Workshop: Skew Lines & Shortest Distance Explorer',
    introduction: 'Navigate the geometry of three-dimensional space. Construct lines and planes defined by vector equations r = a + λb, explore non-parallel non-intersecting skew lines in space, and calculate the exact shortest distance vector perpendicular to both lines using scalar triple products and cross products.',
    learningObjectives: [
      'Represent lines in 3D vector form r = a + λb and Cartesian form (x-x1)/a = (y-y1)/b = (z-z1)/c.',
      'Define skew lines as lines in space that are neither parallel nor intersecting.',
      'Calculate the shortest distance between two skew lines using the formula d = |(a2 - a1) · (b1 × b2)| / |b1 × b2|.',
      'Find the angle between two lines cos θ = (b1 · b2) / (|b1||b2|) and between two planes.'
    ],
    mathematicalPrinciples: [
      {
        title: 'Vector Equation of a Line in Space',
        description: 'A line passing through point a with direction vector b.',
        formulaLatex: '\\vec{r} = \\vec{a} + \\lambda \\vec{b} = (a_1 \\hat{i} + a_2 \\hat{j} + a_3 \\hat{k}) + \\lambda(b_1 \\hat{i} + b_2 \\hat{j} + b_3 \\hat{k})'
      },
      {
        title: 'Shortest Distance Between Two Skew Lines',
        description: 'The length of the line segment perpendicular to both lines L1 and L2.',
        formulaLatex: 'd = \\frac{\\left| (\\vec{a}_2 - \\vec{a}_1) \\cdot (\\vec{b}_1 \\times \\vec{b}_2) \\right|}{|\\vec{b}_1 \\times \\vec{b}_2|}'
      }
    ],
    controlsGuide: [
      {
        name: 'Line 1 Parameters (Point a1 & Direction b1)',
        type: '3D coordinate inputs & sliders',
        range: '-10 to +10',
        description: 'Positions point a1 and orients direction vector b1 of the cyan line in 3D space.',
        effect: 'Updates Line 1 spatial trajectory.'
      },
      {
        name: 'Line 2 Parameters (Point a2 & Direction b2)',
        type: '3D coordinate inputs & sliders',
        range: '-10 to +10',
        description: 'Positions point a2 and orients direction vector b2 of the amber line in 3D space.',
        effect: 'Updates Line 2 spatial trajectory.'
      },
      {
        name: '3D Camera Orbit & Pan',
        type: 'orbit controls',
        description: 'Rotates 360° around the 3D bounding box to verify non-intersection.',
        effect: 'Eliminates optical illusions of 2D line intersection.'
      },
      {
        name: 'Shortest Distance Perpendicular Segment Toggle',
        type: 'toggle',
        description: 'Draws the unique mutual perpendicular segment connecting the closest points on both lines.',
        effect: 'Renders glowing perpendicular bridge with right-angle indicators at both line contacts.'
      }
    ],
    stepByStepInstructions: [
      'Enter Line 1: r1 = (1, 1, 0) + λ(2, -1, 1) and Line 2: r2 = (2, 1, -1) + μ(3, -5, 2).',
      'Compute direction cross product: b1 × b2 = (3, -1, -7), with magnitude |b1 × b2| = √(9 + 1 + 49) = √59 ≈ 7.68.',
      'Compute displacement vector: a2 - a1 = (1, 0, -1).',
      'Calculate scalar triple product: (a2 - a1) · (b1 × b2) = 1(3) + 0(-1) + (-1)(-7) = 3 + 7 = 10.',
      'Divide to find shortest distance: d = 10 / √59 ≈ 1.30 units; rotate 3D view to observe the mutual perpendicular segment bridge.'
    ],
    expectedOutput: 'Interactive 3D WebGL coordinate cage with two colored infinite skew lines, shortest distance perpendicular bridge segment, plane projection shadows, and full vector arithmetic ladder.',
    realWorldApplication: {
      field: 'Air Traffic Control & Subterranean Tunneling',
      description: 'Used in automated air traffic collision avoidance systems (TCAS) to calculate closest point of approach between commercial aircraft flight corridors and underground pipeline clearance routing.',
      example: 'Air traffic controllers ensure that intersecting flight paths of two planes have a minimum vertical/shortest distance safety separation d of at least 1,000 feet.'
    }
  },

  'differential-equations-lab': {
    simulatorId: 'differential-equations-lab',
    h1Heading: 'Differential Equations: Slope Fields & Euler\'s Method Lab',
    introduction: 'Visualize differential equations dy/dx = f(x, y) without solving them analytically. Explore direction slope fields by rendering tiny tangent line segments across the grid, release flow particles to trace family solution trajectories, and step forward using numerical Euler\'s method to solve initial value problems.',
    learningObjectives: [
      'Interpret a first-order differential equation dy/dx = f(x, y) geometrically as a slope field map.',
      'Understand how an initial condition y(x0) = y0 picks out a unique particular solution from the general family.',
      'Implement Euler\'s numerical method: y_{n+1} = y_n + h · f(x_n, y_n).',
      'Classify differential equations: separable variables, homogeneous, and linear differential equations with integrating factor e^(∫P dx).'
    ],
    mathematicalPrinciples: [
      {
        title: 'Slope Field Definition',
        description: 'At every point (x, y), a small line segment is drawn with slope equal to f(x, y).',
        formulaLatex: '\\frac{dy}{dx} = f(x, y) \\implies \\text{Slope of tangent segment at } (x, y) \\text{ is } m = f(x, y)'
      },
      {
        title: 'Euler\'s Numerical Integration Step',
        description: 'Approximates the next point along the solution curve by following the tangent segment of step size h.',
        formulaLatex: 'x_{n+1} = x_n + h, \\quad y_{n+1} = y_n + h \\cdot f(x_n, y_n)'
      }
    ],
    controlsGuide: [
      {
        name: 'Differential Equation Selector',
        type: 'dropdown',
        options: 'dy/dx = x - y, dy/dx = y (Exponential), dy/dx = -x/y (Circles), dy/dx = y - x²',
        description: 'Selects the governing first-order differential equation.',
        effect: 'Regenerates the entire slope field vector array.'
      },
      {
        name: 'Initial Condition Draggable Point (x0, y0)',
        type: 'draggable pin',
        description: 'Click anywhere on the field to place the initial value condition.',
        effect: 'Solves the initial value problem and draws the unique particular solution curve.'
      },
      {
        name: 'Euler Step Size Slider (h)',
        type: 'slider',
        range: '0.01 to 0.5',
        description: 'Controls the step length in Euler\'s numerical approximation.',
        effect: 'Demonstrates numerical error and drift when step size h is too large.'
      },
      {
        name: 'Flow Particle Spawner',
        type: 'button',
        description: 'Releases hundreds of animated particles that flow along the slope field vectors like water currents.',
        effect: 'Visualizes the phase flow of the differential equation family.'
      }
    ],
    stepByStepInstructions: [
      'Select differential equation dy/dx = -x/y.',
      'Observe the slope field: along the line y = x, slopes are -1; along the X-axis (y = 0), slopes are vertical.',
      'Notice that the slope segments form concentric circular patterns centered at the origin.',
      'Click on point (0, 3) to set initial condition: observe the particular solution curve trace a perfect circle x² + y² = 9.',
      'Switch to dy/dx = x - y and release flow particles to observe how solutions converge toward the diagonal asymptote line y = x - 1.'
    ],
    expectedOutput: 'Interactive 2D Cartesian grid populated with an array of directional tangent slope hash marks, draggable initial value pin, smooth analytical solution curve, Euler polygonal step trail, and animated flow stream.',
    realWorldApplication: {
      field: 'Pharmacokinetics & Climate Modeling',
      description: 'Used to model drug clearance rates in bloodstream pharmacology, population dynamics in ecology (predator-prey Lotka-Volterra equations), and climate temperature prediction.',
      example: 'In pharmacology, the concentration of an antibiotic in a patient\'s bloodstream decays according to dy/dt = -k·y, solved using differential equations to schedule proper booster dosages.'
    }
  },

  'linear-programming-lab': {
    simulatorId: 'linear-programming-lab',
    h1Heading: 'Linear Programming: Feasible Polygon & Iso-Profit Optimizer',
    introduction: 'Solve real-world industrial optimization problems visually. Construct the convex polygonal feasible region bounded by multiple linear production constraints, and slide the objective function iso-profit line Z = ax + by across the plane to discover why the optimal solution always occurs at one of the corner vertices (Corner Point Method).',
    learningObjectives: [
      'Formulate linear programming problems (LPP): objective function Z = ax + by and linear constraints.',
      'Identify the feasible region as the convex polygonal intersection of half-planes.',
      'Master the Corner Point Method: the maximum or minimum value of Z occurs at a corner point (vertex) of the feasible region.',
      'Understand unbounded feasible regions and multiple optimal solutions along an entire edge.'
    ],
    mathematicalPrinciples: [
      {
        title: 'Fundamental Theorem of Linear Programming',
        description: 'If an LPP has an optimal solution, it must occur at one of the extreme points (vertices) of the convex feasible polygon.',
        formulaLatex: 'Z_{\\max} = \\max_{(x,y) \\in \\mathcal{R}} \\{ a x + b y \\} = \\max_{i=1}^k \\{ a x_i + b y_i \\}'
      },
      {
        title: 'Iso-Profit Line Equation',
        description: 'Parallel lines representing constant values of objective function Z.',
        formulaLatex: 'a x + b y = Z \\implies y = -\\frac{a}{b} x + \\frac{Z}{b}'
      }
    ],
    controlsGuide: [
      {
        name: 'Objective Function Sliders (Profit a and b)',
        type: 'slider set',
        range: '1 to 50 (for Z = ax + by)',
        description: 'Sets profit margins for product X and product Y.',
        effect: 'Tilts the slope of the parallel iso-profit lines.'
      },
      {
        name: 'Constraint Builders (L1, L2, L3)',
        type: 'parameter cards',
        description: 'Adjust resource coefficients and capacities (e.g., machine hours, labor hours, raw material limits).',
        effect: 'Expands, contracts, or reshapes the feasible polygon.'
      },
      {
        name: 'Iso-Profit Scanner Slider (Z value)',
        type: 'slider',
        description: 'Sweeps the objective function line across the feasible region from Z = 0 upward.',
        effect: 'Identifies the very last corner vertex the line touches before exiting the feasible polygon.'
      }
    ],
    stepByStepInstructions: [
      'Configure LPP: Maximize Z = 50x + 70y subject to constraints x + 2y ≤ 120, x + y ≥ 60, and x - 2y ≥ 0 with x, y ≥ 0.',
      'Examine the highlighted green feasible polygon on the coordinate grid.',
      'Inspect the automatically calculated corner points: A(60, 0), B(120, 0), C(60, 30), and D(40, 20).',
      'Examine the Corner Point Table: Z(A) = 3000, Z(B) = 6000, Z(C) = 50(60) + 70(30) = 5100, Z(D) = 3400.',
      'Slide the iso-profit line to Z = 6000: observe that it exits the polygon exactly at vertex B(120, 0), proving B is the optimal production schedule.'
    ],
    expectedOutput: 'Interactive 2D coordinate grid with shaded convex feasible polygon, highlighted corner points labeled with coordinates, sliding dashed iso-profit line, and live optimization scoreboard table.',
    realWorldApplication: {
      field: 'Supply Chain Logistics & Airline Fleet Assignment',
      description: 'Used by airlines to assign aircraft to flight routes, oil refineries to blend crude oil stocks at minimum cost, and e-commerce distribution warehouses for shipping route optimization.',
      example: 'An oil refinery uses linear programming with hundreds of constraints to determine the exact blend of gasoline, jet fuel, and diesel that maximizes revenue from daily crude oil barrels.'
    }
  },

  'probability-distribution-lab': {
    simulatorId: 'probability-distribution-lab',
    h1Heading: 'Random Variables & Probability Distributions Interactive Lab',
    introduction: 'Bridge theoretical probability and statistical reality. Define discrete random variables X for coin tosses, dice rolls, or card draws, construct the probability distribution table P(X), calculate Expected Value (Mean μ = E[X]), Variance Var(X), and Standard Deviation σ, and watch empirical sample means converge to μ via the Law of Large Numbers.',
    learningObjectives: [
      'Define a discrete random variable X as a real-valued function defined on the sample space.',
      'Verify the valid probability distribution criteria: P(xi) ≥ 0 for all i, and total sum Σ P(xi) = 1.',
      'Calculate the Expected Value (mean) μ = E[X] = Σ xi · P(xi).',
      'Calculate Variance Var(X) = E[X²] - (E[X])² and Standard Deviation σ = √Var(X).'
    ],
    mathematicalPrinciples: [
      {
        title: 'Expected Value of a Discrete Random Variable',
        description: 'The probability-weighted average of all possible values that random variable X can take.',
        formulaLatex: '\\mu = E[X] = \\sum_{i=1}^n x_i P(X = x_i)'
      },
      {
        title: 'Variance & Standard Deviation',
        description: 'Measures the spread or dispersion of values around the mean.',
        formulaLatex: '\\sigma^2 = \\operatorname{Var}(X) = \\sum_{i=1}^n (x_i - \\mu)^2 P(X = x_i) = E[X^2] - (E[X])^2, \\quad \\sigma = \\sqrt{\\operatorname{Var}(X)}'
      }
    ],
    controlsGuide: [
      {
        name: 'Random Variable Scenario Selector',
        type: 'dropdown',
        options: 'Number of Heads in 3 Coin Tosses, Sum of 2 Dice (2 to 12), Defective Items in Batch of 4, Custom Discrete Variable',
        description: 'Selects the probability experiment.',
        effect: 'Generates the corresponding sample space and theoretical probability distribution.'
      },
      {
        name: 'Empirical Trial Runner (1, 10, 100, 1000 Trials)',
        type: 'action button group',
        description: 'Runs real-time random experiments using computer pseudorandom generators.',
        effect: 'Plots empirical frequencies alongside theoretical probability bars.'
      },
      {
        name: 'Custom Probability Mass Weight Sliders',
        type: 'slider set',
        description: 'Manually adjust individual probabilities P(xi) in Custom mode.',
        effect: 'Displays live normalization warning if Σ P(xi) ≠ 1.'
      }
    ],
    stepByStepInstructions: [
      'Select scenario: "Number of Heads in 3 Fair Coin Tosses" (X ∈ {0, 1, 2, 3}).',
      'Inspect the theoretical probability distribution table: P(0) = 1/8 (0.125), P(1) = 3/8 (0.375), P(2) = 3/8 (0.375), P(3) = 1/8 (0.125).',
      'Check the expected value: E[X] = 0(1/8) + 1(3/8) + 2(3/8) + 3(1/8) = (3 + 6 + 3)/8 = 12/8 = 1.5 heads.',
      'Check the variance: Var(X) = np(1-p) = 3(0.5)(0.5) = 0.75, with standard deviation σ = √0.75 ≈ 0.866.',
      'Click "Run 1000 Trials": watch the empirical bar chart match the theoretical distribution with the running average stabilizing at exactly 1.50.'
    ],
    expectedOutput: 'Interactive dual-bar histogram comparing theoretical probability distribution vs empirical trial results, complete probability distribution table with Σ P(xi) = 1 verification pill, and step-by-step E[X] & Var(X) calculation ladder.',
    realWorldApplication: {
      field: 'Actuarial Science, Insurance & Financial Risk Management',
      description: 'Used by insurance actuaries to calculate fair premium pricing based on expected payout risk, portfolio risk modeling (Value at Risk), and casino payout structures.',
      example: 'An insurance company prices term life insurance by setting premium P > E[Claim Payout] = (Mortality Probability) × (Policy Value) to ensure long-term solvency.'
    }
  }
};

