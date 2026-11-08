import { SimulatorGuide } from '../../types/simulatorGuides';

export const CLASS_11_GUIDES: Record<string, SimulatorGuide> = {
  'conic-sections': {
    simulatorId: 'conic-sections',
    h1Heading: '3D Conic Sections Double Cone Slicer & Eccentricity Workshop',
    introduction: 'Slice a three-dimensional double right circular cone with an interactive intersecting plane. Rotate the cutting plane inclination angle β relative to the cone generator angle α to discover how a single geometric setup unifies the four classic conics: Circle (β = 0), Ellipse (0 < β < α), Parabola (β = α), and Hyperbola (β > α).',
    learningObjectives: [
      'Understand conics as sections of a double right circular cone cut by a plane.',
      'Derive the classification criterion comparing cutting plane inclination angle β with semi-vertical angle α.',
      'Relate the 3D cone slice directly to the 2D focus-directrix definition with eccentricity e = c/a.',
      'Visualize degenerate conics formed when the plane passes through the vertex point (point, single line, intersecting pair of lines).'
    ],
    mathematicalPrinciples: [
      {
        title: 'Cone-Plane Inclination Theorem',
        description: 'For a double cone with semi-vertical angle α cut by a plane tilted at angle β.',
        formulaLatex: '\\beta = 0 \\implies \\text{Circle}, \\quad \\beta < \\alpha \\implies \\text{Ellipse}, \\quad \\beta = \\alpha \\implies \\text{Parabola}, \\quad \\beta > \\alpha \\implies \\text{Hyperbola}'
      },
      {
        title: 'Focus-Directrix-Eccentricity Unification',
        description: 'The locus of a point whose distance from a focus bears a constant ratio e to its perpendicular distance from a directrix.',
        formulaLatex: '\\frac{PF}{PM} = e: \\quad e = 0 \\text{ (Circle)}, \\quad 0 < e < 1 \\text{ (Ellipse)}, \\quad e = 1 \\text{ (Parabola)}, \\quad e > 1 \\text{ (Hyperbola)}'
      }
    ],
    controlsGuide: [
      {
        name: 'Plane Inclination (β) Slider',
        type: 'slider',
        range: '0° to 90°',
        description: 'Tilts the cutting plane relative to the base of the double cone.',
        effect: 'Morphs the intersection curve through all conic types.'
      },
      {
        name: 'Plane Height (z) Slider',
        type: 'slider',
        range: '-10 to +10 cm',
        description: 'Translates the cutting plane vertically along the central axis.',
        effect: 'Allows passing the plane through the central vertex (z = 0) to demonstrate degenerate conics.'
      },
      {
        name: 'Cone Semi-Vertical Angle (α) Slider',
        type: 'slider',
        range: '20° to 60°',
        description: 'Adjusts the steepness and flare of the double cone.',
        effect: 'Modulates the critical threshold for the parabolic boundary.'
      },
      {
        name: '3D Camera Orbit Controls',
        type: 'mouse / touch drag',
        description: 'Rotates, pans, and zooms around the 3D WebGL double cone in space.',
        effect: 'Inspects the sliced cross-section curve from top-down, side, or perspective angles.'
      }
    ],
    stepByStepInstructions: [
      'Set cone semi-vertical angle α to 45° and tilt angle β to 0°: observe the perfect circular cross-section.',
      'Gradually increase β to 30° (β < α): the curve elongates into an ellipse with eccentricity e < 1.',
      'Adjust β to exactly 45° (β = α): the cutting plane becomes parallel to the cone\'s generator line, opening the closed ellipse into an infinite parabola (e = 1).',
      'Increase β to 65° (β > α): the plane cuts both nappes (top and bottom) of the double cone, producing the two symmetrical branches of a hyperbola (e > 1).',
      'Set height z to 0 to cut through the cone vertex and observe the degenerate conic: a pair of intersecting straight lines.'
    ],
    expectedOutput: 'Interactive 3D WebGL rendering of a translucent double cone, glowing intersecting plane, projected 2D curve profile, dynamic eccentricity gauge, and formal classification badge.',
    realWorldApplication: {
      field: 'Orbital Mechanics & Telescopic Optics',
      description: 'Used by NASA to calculate planetary orbits (ellipses), spacecraft escape trajectories (hyperbolas), and parabolic primary mirror telescope reflectors.',
      example: 'Halley\'s Comet follows an elliptical orbit around the Sun with e ≈ 0.967, while an interstellar object like \'Oumuamua travels on a hyperbolic escape trajectory with e ≈ 1.20.'
    }
  },

  'argand-plane': {
    simulatorId: 'argand-plane',
    h1Heading: 'The Argand Plane: Complex Numbers & Polar Form Visualizer',
    introduction: 'Demystify imaginary numbers on the 2D Argand plane. Plot complex numbers z = a + bi as 2D position vectors, convert dynamically to polar trigonometric form r(cos θ + i sin θ) and Euler exponential form r·e^(iθ), and discover why multiplying by imaginary unit i represents a pure 90° counter-clockwise rotation.',
    learningObjectives: [
      'Plot complex numbers z = a + bi with Real on the horizontal axis and Imaginary on the vertical axis.',
      'Calculate modulus |z| = √(a² + b²) and argument θ = Arg(z) in radians and degrees.',
      'Visualize complex addition and subtraction as vector parallelogram operations.',
      'Master the geometric meaning of multiplication by i: an exact 90° quarter-turn counter-clockwise rotation.'
    ],
    mathematicalPrinciples: [
      {
        title: 'Rectangular to Polar & Euler Form',
        description: 'Every complex number can be expressed by its distance from the origin r and angle θ with the positive real axis.',
        formulaLatex: 'z = a + bi = r(\\cos\\theta + i\\sin\\theta) = r e^{i\\theta}, \\quad r = \\sqrt{a^2 + b^2}, \\quad \\theta = \\operatorname{atan2}(b, a)'
      },
      {
        title: 'Complex Multiplication as Rotation & Dilation',
        description: 'Multiplying two complex numbers multiplies their moduli and adds their arguments.',
        formulaLatex: 'z_1 \\cdot z_2 = (r_1 e^{i\\theta_1}) \\cdot (r_2 e^{i\\theta_2}) = (r_1 r_2) e^{i(\\theta_1 + \\theta_2)}'
      }
    ],
    controlsGuide: [
      {
        name: 'Real Part Slider [Re(z)]',
        type: 'slider',
        range: '-10.0 to +10.0',
        description: 'Adjusts horizontal coordinate a of the complex vector.',
        effect: 'Moves point left or right along the Real axis.'
      },
      {
        name: 'Imaginary Part Slider [Im(z)]',
        type: 'slider',
        range: '-10.0 to +10.0',
        description: 'Adjusts vertical coordinate b of the complex vector.',
        effect: 'Moves point up or down along the Imaginary axis.'
      },
      {
        name: 'Multiply by i (× i) Button',
        type: 'action button',
        description: 'Multiplies active complex number by unit i: i·(a + bi) = -b + ai.',
        effect: 'Animates a smooth 90° counter-clockwise rotation of the vector on the plane.'
      },
      {
        name: 'Second Vector (z2) Addition Toggle',
        type: 'toggle & sliders',
        description: 'Adds a secondary vector z2 to demonstrate vector addition z1 + z2.',
        effect: 'Draws parallelogram sum vector with live resultant coordinates.'
      }
    ],
    stepByStepInstructions: [
      'Set Re(z) = 3 and Im(z) = 4: inspect the Argand vector extending to (3, 4i).',
      'Check the live modulus: |z| = √(3² + 4²) = √25 = 5.00, and argument θ = atan2(4, 3) ≈ 53.13°.',
      'Click the "× i (+90°)" button: observe coordinates transform instantly to (-4, +3i). Modulus remains 5.00 while argument increases by 90° to 143.13°.',
      'Click "× i" again to land at (-3, -4i): notice that multiplying by i twice is equivalent to multiplying by -1 (a 180° rotation), proving geometrically why i² = -1!',
      'Enable the z2 vector to observe head-to-tail vector addition on the complex plane.'
    ],
    expectedOutput: 'Interactive 2D Argand coordinate grid with vector arrows, modulus circle indicator, polar arc angle display, live KaTeX rectangular/polar/Euler conversions, and vector parallelogram mesh.',
    realWorldApplication: {
      field: 'Quantum Mechanics & AC Electrical Engineering',
      description: 'Used to model alternating current impedance Z = R + jX, electromagnetic wave phase shifts, quantum wavefunctions ψ = e^(i(kx - ωt)), and digital audio filters.',
      example: 'Electrical engineers calculate AC circuit impedance where resistors produce real resistance R, while inductors and capacitors produce imaginary reactance +jωL and -j/(ωC).'
    }
  },

  'binomial-galton': {
    simulatorId: 'binomial-galton',
    h1Heading: 'Binomial Theorem & Pascal\'s Galton Board Normal Distribution Lab',
    introduction: 'Drop thousands of bouncing steel ball bearings through a pyramid of pegs in an interactive Galton board (quincunx). Observe how repeated binary left-or-right deflections (p = 0.5) physically construct Pascal\'s Triangle row by row, demonstrating the Binomial expansion theorem and the Central Limit Theorem.',
    learningObjectives: [
      'Connect combinations nCr directly to the entries of Pascal\'s triangle in row n.',
      'Derive the general term Tr+1 = nCr·a^(n-r)·b^r of the Binomial expansion (a + b)^n.',
      'Visualize the physical transition from discrete Binomial probabilities to a smooth continuous Gaussian Normal bell curve.',
      'Verify the total sum of binomial coefficients: Σ nCr = 2^n.'
    ],
    mathematicalPrinciples: [
      {
        title: 'Binomial Expansion Theorem',
        description: 'The algebraic expansion of powers of a binomial sum using combinations.',
        formulaLatex: '(a + b)^n = \\sum_{r=0}^{n} \\binom{n}{r} a^{n-r} b^r, \\quad \\binom{n}{r} = \\frac{n!}{r!(n - r)!}'
      },
      {
        title: 'De Moivre-Laplace Limit Theorem',
        description: 'As rows n become large, the binomial distribution B(n, p) converges to the normal distribution N(np, np(1-p)).',
        formulaLatex: 'P(X = k) = \\binom{n}{k} p^k (1 - p)^{n-k} \\approx \\frac{1}{\\sqrt{2\\pi np(1-p)}} e^{-\\frac{(k - np)^2}{2np(1-p)}}'
      }
    ],
    controlsGuide: [
      {
        name: 'Peg Rows Slider (n)',
        type: 'slider',
        range: '4 to 16 rows',
        description: 'Sets the depth of the triangular peg array (corresponding to power n in (x+y)^n).',
        effect: 'Expands Pascal\'s triangle and increases the number of collection bins at the bottom.'
      },
      {
        name: 'Left/Right Bias Probability Slider (p)',
        type: 'slider',
        range: '0.1 to 0.9 (default 0.5 for fair board)',
        description: 'Controls the probability of each ball bouncing to the right at each peg collision.',
        effect: 'Shifts and skews the resulting bell curve to the left or right.'
      },
      {
        name: 'Ball Drop Spawner (Single / 100 / 1000 Balls)',
        type: 'action button group',
        description: 'Releases streams of steel balls through the peg array with physics collisions.',
        effect: 'Fills bottom collection bins creating a live empirical histogram.'
      }
    ],
    stepByStepInstructions: [
      'Select 8 rows of pegs (n = 8) and observe Pascal\'s triangle numbers labeled on the pegs: 1, 8, 28, 56, 70, 56, 28, 8, 1.',
      'Click "Drop 1 Ball" to follow its trajectory: at each peg, it makes an independent binary choice (left or right).',
      'Click "Drop 500 Balls" and watch the bottom collection tubes fill up.',
      'Notice that the central bin (r = 4) fills the highest because there are 8C4 = 70 distinct paths leading to it, whereas edge bins (r = 0 or 8) have only 1 unique path.',
      'Overlay the theoretical Normal curve: observe how the empirical pile of balls matches the Gaussian bell curve with astonishing precision.'
    ],
    expectedOutput: 'High-speed 2D physics simulation of balls bouncing through a triangular peg matrix, stacking into vertical histogram tubes overlaid with theoretical binomial probability bars and a continuous Gaussian curve.',
    realWorldApplication: {
      field: 'Biostatistics, Genetics & Quality Control',
      description: 'Used to model polygenic traits (such as human height distribution), quality control defect rates in semiconductor fabrication, and financial option price volatility.',
      example: 'Human height variation across a large population results from the additive effects of dozens of genes, stacking into a bell curve exactly like balls on a Galton board.'
    }
  },

  'arithmetic-geometric-explorer': {
    simulatorId: 'arithmetic-geometric-explorer',
    h1Heading: 'AP & GP Sequences & Series Interactive Explorer',
    introduction: 'Contrast linear additive growth with exponential multiplicative explosion. Compare Arithmetic Progressions (AP: an = a + (n-1)d) directly against Geometric Progressions (GP: an = a·r^(n-1)), compute finite sums, and discover why infinite geometric series with |r| < 1 converge to a finite sum S_inf = a / (1 - r).',
    learningObjectives: [
      'Distinguish fundamentally between additive constant difference d and multiplicative common ratio r.',
      'Calculate the nth term and sum of n terms for both AP and GP series.',
      'Understand the condition for convergence of infinite geometric series (|r| < 1).',
      'Visualize the visual paradox of infinite geometric addition: adding infinitely many positive numbers to yield a finite sum.'
    ],
    mathematicalPrinciples: [
      {
        title: 'Geometric Progression Formulas',
        description: 'Each term is obtained by multiplying the previous term by constant common ratio r.',
        formulaLatex: 'a_n = a \\cdot r^{n-1}, \\quad S_n = \\frac{a(1 - r^n)}{1 - r} \\quad (r \\neq 1)'
      },
      {
        title: 'Infinite Geometric Series Convergence',
        description: 'When |r| < 1, r^n approaches 0 as n approaches infinity, yielding a finite sum.',
        formulaLatex: '|r| < 1 \\implies S_\\infty = \\lim_{n \\to \\infty} S_n = \\frac{a}{1 - r}'
      }
    ],
    controlsGuide: [
      {
        name: 'First Term Slider (a)',
        type: 'slider',
        range: '1 to 20',
        description: 'Sets the starting value of both sequences.',
        effect: 'Scales both AP and GP curves proportionally.'
      },
      {
        name: 'Common Ratio Slider (r for GP)',
        type: 'slider',
        range: '-2.0 to +2.0 (step 0.05)',
        description: 'Controls the multiplicative factor between consecutive GP terms.',
        effect: '|r| > 1 diverges; |r| < 1 converges; r < 0 alternates signs.'
      },
      {
        name: 'Common Difference Slider (d for AP)',
        type: 'slider',
        range: '1 to 10',
        description: 'Controls the linear additive increment for the AP comparison series.',
        effect: 'Shows steady linear growth on the comparison chart.'
      },
      {
        name: 'Infinite Convergence Geometric Square Tile View',
        type: 'toggle',
        description: 'Visualizes 1/2 + 1/4 + 1/8 + ... as recursive sub-partitions of a 1x1 unit square.',
        effect: 'Provides instant visual proof that the infinite sum equals exactly 1.'
      }
    ],
    stepByStepInstructions: [
      'Set first term a = 1 and common ratio r = 0.5 (1/2) for GP.',
      'Inspect the generated sequence: 1, 1/2, 1/4, 1/8, 1/16, 1/32...',
      'Observe the sum of terms S1 = 1, S2 = 1.5, S3 = 1.75, S4 = 1.875, asymptotically approaching exactly S_inf = 1 / (1 - 0.5) = 2.00.',
      'Toggle the "Unit Square Partition" view: observe how each term fills exactly half the remaining empty space in the 1x1 box, never exceeding the total area.',
      'Change r to 1.5 (|r| > 1) to watch the sequence explode exponentially, demonstrating why divergence occurs.'
    ],
    expectedOutput: 'Interactive dual-axis comparison plot showing linear AP growth vs exponential GP explosion, sequence list cards, and animated geometric square sub-tiling for infinite convergence.',
    realWorldApplication: {
      field: 'Finance, Epidemiology & Computer Science',
      description: 'Used in compounding investment yields, viral epidemic R0 reproduction modeling, fractal geometry generation, and algorithm time complexity analysis.',
      example: 'In viral transmission with R0 = 2, an initial infected patient generates a GP: 1, 2, 4, 8, 16, 32... infecting over 1,000 people in just 10 transmission cycles.'
    }
  },

  'hyperbola-ellipse-orbits': {
    simulatorId: 'hyperbola-ellipse-orbits',
    h1Heading: 'Kepler\'s Orbits & Conic Eccentricity Planetary Simulator',
    introduction: 'Simulate planetary and interstellar orbital mechanics under Newtonian gravity. Vary orbit eccentricity e = c/a from 0 to 2 to transition from circular planetary orbits, to elongated Keplerian ellipses, to parabolic escape paths, and hyperbolic flyby trajectories around a massive central gravitational body.',
    learningObjectives: [
      'Formulate Kepler\'s First Law: planets orbit in ellipses with the central star located at one focus.',
      'Define ellipse and hyperbola focal distance invariants (|PF1 ± PF2| = constant).',
      'Master the role of eccentricity e: e = 0 (circle), 0 < e < 1 (bound ellipse), e = 1 (parabolic escape), e > 1 (unbound hyperbola).',
      'Calculate perihelion and aphelion distances: r_min = a(1 - e) and r_max = a(1 + e).'
    ],
    mathematicalPrinciples: [
      {
        title: 'Focal Distance Definitions',
        description: 'For an ellipse, the sum of focal distances is constant (2a); for a hyperbola, the absolute difference is constant (2a).',
        formulaLatex: '\\text{Ellipse: } |PF_1| + |PF_2| = 2a, \\quad \\text{Hyperbola: } ||PF_1| - |PF_2|| = 2a'
      },
      {
        title: 'Polar Equation of Conic Orbits',
        description: 'Gravitational two-body orbital motion with semi-latus rectum l and true anomaly θ.',
        formulaLatex: 'r(\\theta) = \\frac{l}{1 + e \\cos(\\theta)}, \\quad l = a(1 - e^2)'
      }
    ],
    controlsGuide: [
      {
        name: 'Eccentricity (e) Slider',
        type: 'slider',
        range: '0.0 to 2.0 (step 0.02)',
        description: 'Sets orbital eccentricity, defining the shape and bound/unbound state.',
        effect: 'Morphs orbit from circle to ellipse, parabola, and hyperbola.'
      },
      {
        name: 'Semi-Major Axis (a) Slider',
        type: 'slider',
        range: '2 AU to 15 AU',
        description: 'Scales the overall size and energy of the orbit.',
        effect: 'Modulates orbital period T according to Kepler\'s Third Law: T² ∝ a³.'
      },
      {
        name: 'Simulation Speed (dt) Slider',
        type: 'slider',
        range: '0.1x to 5.0x',
        description: 'Speeds up or pauses the live orbital animation.',
        effect: 'Controls planet time-step progression around the central star.'
      },
      {
        name: 'Focal Strings Visualization Toggle',
        type: 'toggle',
        description: 'Draws dynamic elastic string lines connecting the orbiting body to both foci F1 and F2.',
        effect: 'Demonstrates visually that the sum of distances |PF1| + |PF2| remains rigidly constant at 2a.'
      }
    ],
    stepByStepInstructions: [
      'Set e = 0.0 to observe a circular planetary orbit with both foci merged at the central star.',
      'Increase e to 0.6: observe the orbit stretch into an elongated ellipse with two distinct separated foci.',
      'Turn on "Focal Strings": watch the planet orbit the star while the sum of the two focal cords |PF1| + |PF2| remains constant.',
      'Increase e to exactly 1.0 (parabolic escape trajectory): observe that the aphelion distance stretches to infinity as the planet escapes the solar system.',
      'Increase e to 1.5: observe an unbound hyperbolic flyby path where the planet swings past the star and never returns.'
    ],
    expectedOutput: 'Interactive 2D space canvas featuring glowing central star at focus F1, empty focus F2, orbiting celestial body, dynamic vector velocity arrows, live Kepler telemetry, and focal distance counters.',
    realWorldApplication: {
      field: 'Astrophysics & Deep Space Mission Planning',
      description: 'Used by NASA and ISRO to design interplanetary gravitational slingshot maneuvers (hyperbolic trajectories) and satellite communication orbits (Molniya and geostationary).',
      example: 'The Voyager 1 spacecraft utilized gravity assists at Jupiter and Saturn to enter a hyperbolic escape trajectory (e ≈ 1.3), permanently leaving the solar system.'
    }
  },

  'limits-derivatives-lab': {
    simulatorId: 'limits-derivatives-lab',
    h1Heading: 'Limits & First Principles Derivative: Secant Zoom Lab',
    introduction: 'Bridge algebra and calculus at the infinitesimal limit. Drag a secondary point Q along a curve toward a fixed point P to observe secant lines transform into the instantaneous tangent line as step size h = Δx approaches zero, proving the First Principles definition of the derivative dy/dx.',
    learningObjectives: [
      'Define the derivative as the limit of the difference quotient [f(x+h) - f(x)] / h as h → 0.',
      'Distinguish between average rate of change (secant line slope) and instantaneous rate of change (tangent line slope).',
      'Resolve the 0/0 indeterminate form through algebraic cancellation before evaluating the limit.',
      'Visualize local linearity: zooming deeply into any differentiable smooth curve reveals a straight line.'
    ],
    mathematicalPrinciples: [
      {
        title: 'Definition of Derivative from First Principles',
        description: 'The instantaneous slope of curve y = f(x) at point x.',
        formulaLatex: 'f\'(x) = \\lim_{h \\to 0} \\frac{f(x + h) - f(x)}{h} = \\frac{dy}{dx}'
      },
      {
        title: 'Secant to Tangent Slope Convergence',
        description: 'For f(x) = x², the difference quotient simplifies algebraically to 2x + h.',
        formulaLatex: 'm_{\\text{sec}} = \\frac{(x + h)^2 - x^2}{h} = \\frac{2xh + h^2}{h} = 2x + h \\xrightarrow{h \\to 0} 2x'
      }
    ],
    controlsGuide: [
      {
        name: 'Base Point Position Slider (x)',
        type: 'slider',
        range: '-3.0 to +3.0',
        description: 'Positions target point P(x, f(x)) on the function curve.',
        effect: 'Updates the point where derivative is evaluated.'
      },
      {
        name: 'Step Size Slider (h = Δx)',
        type: 'slider',
        range: '0.001 to 2.0 (step down to 0)',
        description: 'Controls the horizontal separation between base point P and secondary point Q.',
        effect: 'Slides secant line toward the instantaneous tangent line.'
      },
      {
        name: 'Function Selector Dropdown',
        type: 'dropdown',
        options: 'f(x) = x², f(x) = x³, f(x) = sin(x), f(x) = 1/x',
        description: 'Selects the mathematical curve to analyze.',
        effect: 'Updates curve geometry and analytical derivative formula.'
      },
      {
        name: 'Infinitesimal Zoom Magnifier (1x to 1000x)',
        type: 'slider / button',
        description: 'Zooms in deeply onto point P on the curve.',
        effect: 'Demonstrates local linearity: the curve becomes indistinguishable from its tangent line.'
      }
    ],
    stepByStepInstructions: [
      'Select function f(x) = x² and set base point x = 1.0; note that analytical derivative f\'(1) = 2·(1) = 2.00.',
      'Start with step size h = 1.0 (Point Q at x = 2.0); observe secant slope m = (4 - 1)/1 = 3.00.',
      'Gradually decrease h to 0.5: secant slope becomes 2.50.',
      'Decrease h to 0.1: secant slope becomes 2.10; decrease to h = 0.01: secant slope becomes 2.01.',
      'Observe how the secant line visually snaps onto the glowing red tangent line as h → 0, proving lim (2x + h) = 2x.'
    ],
    expectedOutput: 'Interactive 2D function graph with base point P, movable point Q, color-coded slope triangle (Δy and Δx), dynamic secant/tangent lines, and live algebraic limit cancellation card.',
    realWorldApplication: {
      field: 'Automotive Telemetry & Financial High-Frequency Trading',
      description: 'Used to compute instantaneous vehicle acceleration from speedometer data, marginal cost in microeconomics, and real-time algorithmic rate of change in financial markets.',
      example: 'A car speedometer measures instantaneous velocity v(t) = ds/dt by measuring wheel rotations over millisecond intervals h, computing the limit quotient in real time.'
    }
  },

  'linear-inequalities': {
    simulatorId: 'linear-inequalities',
    h1Heading: 'Feasible Half-Plane Linear Inequalities Optimizer',
    introduction: 'Shade and solve systems of linear inequalities in two variables ax + by ≤ c. Plot boundary lines, determine whether half-planes contain or exclude the origin using test points, and find the overlapping convex feasible region that forms the foundation of Linear Programming.',
    learningObjectives: [
      'Distinguish between strict inequalities (<, > drawn with dashed lines) and non-strict inequalities (≤, ≥ drawn with solid lines).',
      'Apply the origin test point (0, 0) to determine which half-plane to shade.',
      'Find the common feasible region (intersection of multiple half-planes).',
      'Identify corner points (vertices) of the bounded or unbounded feasible polygon.'
    ],
    mathematicalPrinciples: [
      {
        title: 'Half-Plane Division Theorem',
        description: 'Every straight line ax + by = c divides the Cartesian plane into two open half-planes: ax + by < c and ax + by > c.',
        formulaLatex: 'ax + by \\le c \\implies \\text{Closed half-plane containing boundary line } ax + by = c'
      },
      {
        title: 'Feasible Region Convexity',
        description: 'The intersection of any collection of linear half-planes is always a convex polygonal region.',
        formulaLatex: '\\mathcal{R} = \\bigcap_{i=1}^m \\{ (x, y) \\in \\mathbb{R}^2 : a_i x + b_i y \\le c_i \\}'
      }
    ],
    controlsGuide: [
      {
        name: 'Inequality Builder (a, b, c, operator)',
        type: 'parameter cockpit',
        description: 'Configure coefficients and comparison operator (≤, ≥, <, >) for up to 4 simultaneous inequalities.',
        effect: 'Updates boundary line orientation and shaded half-plane.'
      },
      {
        name: 'Origin Test (0, 0) Verifier Button',
        type: 'button',
        description: 'Substitutes x = 0, y = 0 into the active inequality.',
        effect: 'Displays green "True (Shade Origin Side)" or red "False (Shade Opposite Side)" feedback.'
      },
      {
        name: 'Non-Negativity Constraints Toggle (x ≥ 0, y ≥ 0)',
        type: 'toggle',
        description: 'Restricts the feasible region to the first quadrant (Quadrant I).',
        effect: 'Applies standard practical real-world production constraints.'
      }
    ],
    stepByStepInstructions: [
      'Enter inequality 2x + 3y ≤ 12: observe the boundary line drawn with x-intercept (6, 0) and y-intercept (0, 4).',
      'Click "Origin Test": 2(0) + 3(0) = 0 ≤ 12 is TRUE, so the half-plane containing (0, 0) is shaded in cyan.',
      'Add a second inequality x + 2y ≥ 4: test (0, 0) yields 0 ≥ 4 which is FALSE, so shading faces away from the origin in amber.',
      'Toggle non-negativity constraints x ≥ 0, y ≥ 0 to restrict focus to Quadrant I.',
      'Inspect the highlighted overlapping feasible polygon: the vertices are automatically calculated and marked at (4, 0), (6, 0), (0, 4), and (0, 2).'
    ],
    expectedOutput: 'Interactive 2D Cartesian coordinate plane with multi-colored semi-transparent shaded half-planes, solid/dashed boundary lines, vertex corner-point markers, and test point verification cards.',
    realWorldApplication: {
      field: 'Operations Research & Dietary Nutrition Planning',
      description: 'Used in industrial supply chain optimization, factory production scheduling under raw material constraints, and the classic Stigler diet nutrition problem.',
      example: 'A bakery making cakes (x) and cookies (y) subject to sugar and flour limits solves 3x + 2y ≤ 100 and 4x + y ≤ 80 to determine all feasible daily production combinations.'
    }
  },

  'permutations-combinations': {
    simulatorId: 'permutations-combinations',
    h1Heading: 'Permutations & Combinations: Arrangement Matrix & Lock Lab',
    introduction: 'Crack the fundamental counting principle. Explore whether order matters by toggling between Permutations (arrangements where order is paramount: nPr) and Combinations (selections where order is irrelevant: nCr) through interactive luggage lock tumblers, colored marble urns, and team roster selectors.',
    learningObjectives: [
      'Master the Fundamental Principle of Counting (multiplication rule: m × n choices).',
      'Distinguish between Permutations (order matters: AB ≠ BA) and Combinations (order does not matter: {A, B} = {B, A}).',
      'Derive and calculate formulas: nPr = n! / (n - r)! and nCr = n! / [r!(n - r)!].',
      'Verify the fundamental identity connecting arrangements and selections: nPr = r! · nCr.'
    ],
    mathematicalPrinciples: [
      {
        title: 'Permutations Formula (Ordered Arrangements)',
        description: 'The number of ways to arrange r distinct objects selected from n available objects.',
        formulaLatex: '^n P_r = \\frac{n!}{(n - r)!} = n(n - 1)(n - 2)\\cdots(n - r + 1)'
      },
      {
        title: 'Combinations Formula (Unordered Subsets)',
        description: 'Dividing out the r! internal permutations of chosen objects yields the number of unique groups.',
        formulaLatex: '^n C_r = \\frac{^n P_r}{r!} = \\frac{n!}{r!(n - r)!}, \\quad ^n C_r = ^n C_{n-r}'
      }
    ],
    controlsGuide: [
      {
        name: 'Total Items Slider (n)',
        type: 'slider',
        range: '1 to 10 distinct items',
        description: 'Sets the total number of distinct symbols, letters, or colored marbles available.',
        effect: 'Expands the pool of selectable elements.'
      },
      {
        name: 'Selection Size Slider (r)',
        type: 'slider',
        range: '1 to n items',
        description: 'Sets how many items are selected or arranged at a time.',
        effect: 'Updates number of lock wheels or team slots.'
      },
      {
        name: 'Mode Toggle: Permutation (nPr) vs Combination (nCr)',
        type: 'toggle switch',
        description: 'Switches between ordered arrangement mode and unordered selection mode.',
        effect: 'Groups equivalent anagram permutations together into single combination buckets.'
      },
      {
        name: 'Live Permutation Tree Unfolder',
        type: 'button',
        description: 'Draws a complete tree diagram showing branch choices at each successive stage.',
        effect: 'Visualizes multiplication principle step by step.'
      }
    ],
    stepByStepInstructions: [
      'Set total items n = 4 (letters A, B, C, D) and selection size r = 2.',
      'Select "Permutations Mode (nPr)": observe 4P2 = 4! / 2! = 12 distinct ordered pairs listed: AB, BA, AC, CA, AD, DA, BC, CB, BD, DB, CD, DC.',
      'Notice that AB and BA are counted as two separate distinct arrangements.',
      'Switch to "Combinations Mode (nCr)": watch AB and BA merge into a single group {A, B}.',
      'The total count halves to 4C2 = 12 / 2! = 6 unique combinations, proving nPr = r! · nCr directly.'
    ],
    expectedOutput: 'Interactive arrangement grid, 3D combination lock tumblers, tree branch diagram generator, live factorial evaluation ladder, and duplicate elimination animation.',
    realWorldApplication: {
      field: 'Cryptography, Cyber Security & Lottery Probability',
      description: 'Used in password entropy calculations, brute-force attack prevention, poker hand probability calculations, and telecommunications network routing.',
      example: 'A 4-digit PIN code using digits 0-9 with no repeats has 10P4 = 5,040 possible codes; if repetition is permitted, the multiplication rule yields 10⁴ = 10,000 combinations.'
    }
  },

  'mathematical-induction-dominos': {
    simulatorId: 'mathematical-induction-dominos',
    h1Heading: 'Principle of Mathematical Induction: Domino Chain Proof Engine',
    introduction: 'Witness the infinite power of mathematical induction through physical domino chain dynamics. Establish the Base Case P(1) by knocking down the first domino, prove the Inductive Step P(k) ⇒ P(k+1) by ensuring each domino is positioned to strike the next, and watch truth propagate infallibly across all infinite natural numbers N.',
    learningObjectives: [
      'Master the two fundamental pillars of PMI: Base Step P(1) and Inductive Step P(k) ⇒ P(k+1).',
      'Understand why both steps are strictly necessary: a falling first domino does nothing if spacing is broken, and perfect spacing does nothing if the first domino is never pushed.',
      'Apply PMI to prove summation formulas: Σ i = n(n+1)/2, Σ i² = n(n+1)(2n+1)/6, and inequality proofs.',
      'Eliminate the common student fallacy of assuming P(k) proves the theorem without proving P(k+1).'
    ],
    mathematicalPrinciples: [
      {
        title: 'The Axiom of Mathematical Induction',
        description: 'If a statement P(n) is true for n = 1, and the truth of P(k) implies the truth of P(k+1) for all k ≥ 1, then P(n) is true for all natural numbers n ∈ N.',
        formulaLatex: 'P(1) \\land \\left[ \\forall k \\ge 1, \\; P(k) \\implies P(k+1) \\right] \\implies \\forall n \\in \\mathbb{N}, \\; P(n)'
      },
      {
        title: 'Inductive Step Algebraic Invariant',
        description: 'Adding the (k+1)-th term to the inductive hypothesis sum S_k.',
        formulaLatex: 'S_{k+1} = S_k + a_{k+1} = \\frac{k(k+1)}{2} + (k + 1) = \\frac{(k+1)(k+2)}{2}'
      }
    ],
    controlsGuide: [
      {
        name: 'Domino Spacing Slider (Inductive Step Integrity)',
        type: 'slider',
        range: 'Valid Spacing (P(k)⇒P(k+1) Holds) vs Broken Gap',
        description: 'Adjusts the physical gap between consecutive dominos.',
        effect: 'A broken gap simulates an inductive proof flaw where the chain halts.'
      },
      {
        name: 'Base Case Push Trigger [P(1)]',
        type: 'action button',
        description: 'Knocks over the very first domino P(1) in the sequence.',
        effect: 'Initiates cascade if base step is valid.'
      },
      {
        name: 'Chain Length Slider (n)',
        type: 'slider',
        range: '5 to 100 dominos',
        description: 'Sets the number of visible dominos in the demonstration chain.',
        effect: 'Visualizes induction reaching arbitrarily large n.'
      },
      {
        name: 'Theorem Selector Dropdown',
        type: 'dropdown',
        options: 'Sum of First n Integers, Sum of Squares, Powers of 2 Inequality (2^n > n)',
        description: 'Selects the mathematical statement being proved.',
        effect: 'Loads corresponding algebraic proof steps and KaTeX substitution cards.'
      }
    ],
    stepByStepInstructions: [
      'Select theorem P(n): 1 + 2 + ... + n = n(n+1)/2.',
      'Verify the Base Step: check that P(1) evaluates to 1 = 1(2)/2 = 1 (TRUE).',
      'Examine the inductive gap setting: verify that domino k is within striking distance of domino k+1.',
      'Click "Push First Domino [P(1)]": watch the smooth physics cascade as truth propagates across all dominos without stopping.',
      'Now introduce a "Broken Spacing" flaw at k = 12 and re-run: observe that while P(1) through P(11) fall, the chain halts at k = 12, demonstrating why the Inductive Step must hold universally.'
    ],
    expectedOutput: 'Interactive 3D/2D domino physics simulation with falling block animations, step-by-step NCERT proof panel, live mathematical substitution breakdown, and inductive chain integrity indicator.',
    realWorldApplication: {
      field: 'Software Verification & Computer Science Recursion',
      description: 'Used in formal verification of safety-critical software (aerospace flight controls, nuclear reactor safeguards), recursive algorithm correctness proofs, and mathematical cryptography.',
      example: 'Proving that a recursive quicksort or binary search algorithm terminates and produces sorted output for an array of any arbitrary length n is done strictly using mathematical induction.'
    }
  },

  'trig-equations-radial': {
    simulatorId: 'trig-equations-radial',
    h1Heading: 'Trigonometric Equations Radial Radar & General Solutions Lab',
    introduction: 'Solve trigonometric equations sin(x) = k, cos(x) = k, and tan(x) = k visually on a 360° circular radar sweep. Discover principal solutions in the interval [0, 2π) and unroll general solutions x = nπ + (-1)^n·α and x = 2nπ ± α across the infinite number line using interactive radial beams.',
    learningObjectives: [
      'Distinguish clearly between principal solutions (restricted to [0, 2π)) and general solutions (covering all n ∈ Z).',
      'Derive the general solution formula for sin(x) = sin(α): x = nπ + (-1)^n·α.',
      'Derive the general solution formula for cos(x) = cos(α): x = 2nπ ± α.',
      'Derive the general solution formula for tan(x) = tan(α): x = nπ + α.'
    ],
    mathematicalPrinciples: [
      {
        title: 'General Solution for Sine',
        description: 'Because sine is periodic with period 2π and positive in Quadrants I and II.',
        formulaLatex: '\\sin(x) = \\sin(\\alpha) \\implies x = n\\pi + (-1)^n \\alpha, \\quad n \\in \\mathbb{Z}'
      },
      {
        title: 'General Solution for Cosine & Tangent',
        description: 'Cosine is symmetric across the X-axis (even function); tangent repeats every π radians.',
        formulaLatex: '\\cos(x) = \\cos(\\alpha) \\implies x = 2n\\pi \\pm \\alpha, \\quad \\tan(x) = \\tan(\\alpha) \\implies x = n\\pi + \\alpha'
      }
    ],
    controlsGuide: [
      {
        name: 'Trig Function Selector (sin / cos / tan)',
        type: 'button toggle group',
        description: 'Switches between sine, cosine, and tangent equation modes.',
        effect: 'Updates radial projection geometry and algebraic formulas.'
      },
      {
        name: 'Constant Value Slider (k)',
        type: 'slider',
        range: '-1.0 to +1.0 (step 0.05)',
        description: 'Sets the right-hand constant value k in f(x) = k.',
        effect: 'Moves the horizontal/vertical intersection threshold line.'
      },
      {
        name: 'Integer Multiplier (n) Stepper',
        type: 'stepper',
        range: 'n = -5 to +5',
        description: 'Steps through integer parameter n to generate consecutive solutions.',
        effect: 'Rotates radial beam through multiple revolutions on the radar display.'
      },
      {
        name: 'Degree vs Radian Mode Toggle',
        type: 'toggle',
        description: 'Switches display between degrees (0° to 360°) and exact radian fractions (e.g., π/6, 5π/6).',
        effect: 'Updates all on-screen KaTeX angle notations.'
      }
    ],
    stepByStepInstructions: [
      'Select function sin(x) and set value slider k to 0.5 (equation sin(x) = 0.5).',
      'Observe the horizontal cutting line at y = 0.5 intersecting the unit circle at two principal points: α = π/6 (30°) and π - α = 5π/6 (150°).',
      'Check the live general solution formula: x = nπ + (-1)^n·(π/6).',
      'Step n = 0 to obtain x = π/6; step n = 1 to obtain x = π - π/6 = 5π/6; step n = 2 to obtain x = 2π + π/6 = 13π/6 (390°).',
      'Switch to cos(x) = 0.5 and observe the symmetry: solutions are x = 2nπ ± π/3 (±60°).'
    ],
    expectedOutput: 'Interactive 360° circular radar display with rotating laser sweep, horizontal/vertical intersection chords, principal angle arcs, dynamic n-slider, and comprehensive solution list banner.',
    realWorldApplication: {
      field: 'Acoustics, Radar Tracking & Mechanical Linkages',
      description: 'Used in radar target tracking, finding resonant frequencies in mechanical crankshaft engines, and phase-locking in optical telecommunications.',
      example: 'In mechanical engine design, finding when a piston head reaches a specific cylinder position requires solving a general trigonometric equation for all engine revolutions n.'
    }
  }
};

