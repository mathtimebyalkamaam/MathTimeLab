import { SimulatorGuide } from '../../types/simulatorGuides';

export const CLASS_10_GUIDES: Record<string, SimulatorGuide> = {
  'catapult-siege': {
    simulatorId: 'catapult-siege',
    h1Heading: 'Catapult Siege: Projectile Motion & Trigonometric Trajectory Simulator',
    introduction: 'Calibrate medieval catapult launch parameters to master the trigonometric decomposition of projectile velocity. Adjust the launch angle θ and initial velocity v0 to hit distant castle fortifications while calculating maximum apex height, flight duration, and horizontal range through quadratic equations and trigonometric ratios.',
    learningObjectives: [
      'Decompose initial velocity vector v0 into orthogonal components v0·cos(θ) and v0·sin(θ).',
      'Discover why an inclination angle of exactly 45° maximizes horizontal ground range in zero air resistance.',
      'Derive the parabolic trajectory equation y = x·tan(θ) - [g/(2v0²·cos²(θ))]·x² by eliminating flight time parameter t.',
      'Relate trigonometric ratios sin(θ), cos(θ), and tan(θ) directly to real-world projectile mechanics.'
    ],
    mathematicalPrinciples: [
      {
        title: 'Parametric Equations of Projectile Motion',
        description: 'Horizontal motion proceeds at constant velocity while vertical motion experiences constant gravitational deceleration g = 9.8 m/s².',
        formulaLatex: 'x(t) = v_0 \\cos(\\theta) \\cdot t, \\quad y(t) = v_0 \\sin(\\theta) \\cdot t - \\frac{1}{2}g t^2'
      },
      {
        title: 'Trajectory Parabola & Range Formula',
        description: 'By substituting t = x / (v0·cos θ) into y(t), the trajectory is proven to be a downward parabola with maximum range at θ = 45°.',
        formulaLatex: 'R = \\frac{v_0^2 \\sin(2\\theta)}{g}, \\quad H = \\frac{v_0^2 \\sin^2(\\theta)}{2g}, \\quad T = \\frac{2v_0 \\sin(\\theta)}{g}'
      }
    ],
    controlsGuide: [
      {
        name: 'Launch Angle (θ) Slider',
        type: 'slider',
        range: '10° to 85°',
        description: 'Sets the inclination angle of the catapult arm relative to the horizontal ground.',
        effect: 'Modulates the ratio of vertical lift to forward horizontal momentum.'
      },
      {
        name: 'Initial Velocity (v0) Slider',
        type: 'slider',
        range: '10 m/s to 45 m/s',
        description: 'Adjusts the tension and energy imparted to the launched stone projectile.',
        effect: 'Scales the overall parabolic scale, flight time, apex height, and distance.'
      },
      {
        name: 'Gravity (g) Toggle',
        type: 'selector',
        description: 'Switches between Earth (9.8 m/s²), Moon (1.62 m/s²), and Mars (3.71 m/s²).',
        effect: 'Visualizes gravitational acceleration in the denominator of the range formula.'
      },
      {
        name: 'Fire / Launch Button',
        type: 'button',
        description: 'Releases the catapult arm and initiates dynamic physics simulation with live trajectory tracing.',
        effect: 'Spawns projectile with particle effects, telemetry HUD, and impact marker.'
      }
    ],
    stepByStepInstructions: [
      'Set initial launch velocity v0 to 25 m/s and adjust the angle slider to 30°.',
      'Note the predicted range R and maximum apex height H displayed in the telemetry cockpit.',
      'Click "Fire" to launch the projectile and watch the live KaTeX HUD track instant coordinates (x, y).',
      'Increase the launch angle to 60° keeping velocity constant, and observe that while apex height doubles, horizontal range remains identical because sin(2·30°) = sin(2·60°) = sin(60°)!',
      'Finally, select 45° to observe maximum ground range R_max = v0² / g.'
    ],
    expectedOutput: 'A smooth parabolic trajectory curve rendered in real-time, displaying apex point (R/2, H), total time of flight, impact velocity, and target collision feedback.',
    realWorldApplication: {
      field: 'Ballistics & Sports Engineering',
      description: 'Used by sports scientists to optimize soccer free kicks, basketball three-pointer release angles, artillery fire-control systems, and mortar trajectory calculations.',
      example: 'A basketball shooter aims for a release angle of 48°-52° to maximize the entry angle into the 18-inch hoop rim, significantly increasing scoring probability.'
    }
  },

  'unit-circle': {
    simulatorId: 'unit-circle',
    h1Heading: 'Interactive Unit Circle Trigonometry & Sine Wave Synthesizer',
    introduction: 'Demystify trigonometry beyond right-angled triangles. Rotate a radius vector of length r = 1 around the Cartesian origin to observe how coordinates (cos θ, sin θ) trace circular paths and simultaneously unroll into continuous Sine and Cosine waves across all four quadrants.',
    learningObjectives: [
      'Define sin(θ) and cos(θ) as the y and x Cartesian coordinates of a terminal point on the unit circle.',
      'Internalize sign conventions across the 4 quadrants using the ASTC rule (All, Silver, Tea, Cups).',
      'Visualize the fundamental Pythagorean identity cos²(θ) + sin²(θ) = 1 as the unit circle equation.',
      'Understand the phase relationship between sine and cosine waves: cos(θ) leads sin(θ) by π/2 radians (90°).'
    ],
    mathematicalPrinciples: [
      {
        title: 'Unit Circle Definition of Trigonometric Functions',
        description: 'For any real angle θ, a ray from the origin at angle θ intersects the circle x² + y² = 1 at coordinates (x, y).',
        formulaLatex: 'x = \\cos(\\theta), \\quad y = \\sin(\\theta), \\quad \\tan(\\theta) = \\frac{y}{x} = \\frac{\\sin(\\theta)}{\\cos(\\theta)}'
      },
      {
        title: 'Pythagorean Trigonometric Invariant',
        description: 'Because every point on the circle satisfies the distance equation from the origin, the sum of squares is invariant.',
        formulaLatex: '\\sin^2(\\theta) + \\cos^2(\\theta) = 1, \\quad 1 + \\tan^2(\\theta) = \\sec^2(\\theta)'
      }
    ],
    controlsGuide: [
      {
        name: 'Angle Scrubbing Dial / Slider (θ)',
        type: 'rotary dial & slider',
        range: '0° to 360° (0 to 2π rad)',
        description: 'Rotates the radius vector continuously around the unit circle.',
        effect: 'Dynamically updates terminal point (cos θ, sin θ), tangent line, and the rolling wave timeline.'
      },
      {
        name: 'Special Angle Snapping Buttons',
        type: 'button group',
        description: 'Snaps instantly to key standard angles: 0°, 30°, 45°, 60°, 90°, 120°, 180°, 270°, 360°.',
        effect: 'Displays exact radical values (e.g., √3/2, 1/2, 1/√2) in pure KaTeX.'
      },
      {
        name: 'Wave Synthesizer View Toggle',
        type: 'toggle',
        description: 'Splits the view between the circular phase plane and the unrolled time-domain sinusoidal wave.',
        effect: 'Draws dynamic projection laser lines from the circle to the wave crests and troughs.'
      }
    ],
    stepByStepInstructions: [
      'Select the 30° (π/6) preset button to inspect exact coordinates (√3/2 ≈ 0.866, 1/2 = 0.500).',
      'Drag the rotary angle arm into Quadrant II (e.g., 150°) and observe that while y = sin(150°) remains +0.500, x = cos(150°) flips to -0.866.',
      'Observe the live ASTC quadrant indicator showing why Sine alone is positive in Quadrant II.',
      'Advance to 270° (3π/2) to witness sin(270°) = -1.0, cos(270°) = 0, and tan(270°) approaching undefined vertical asymptote.',
      'Turn on Wave Synthesizer mode to trace how circular rotation generates sinusoidal alternating current waveforms.'
    ],
    expectedOutput: 'Interactive dual-pane visualizer showing rotating vector on Cartesian circle, orthogonal coordinate triangles with color-coded sine (vertical) and cosine (horizontal), and animated scrolling waveform.',
    realWorldApplication: {
      field: 'Electrical Engineering & Signal Processing',
      description: 'Used to model alternating electric currents (AC), radio frequency carriers, audio acoustic harmonics, and Fourier transform frequency analysis.',
      example: 'Household AC mains power delivers voltage V(t) = V_peak·sin(2π·50·t), rotating 50 full cycles around the unit circle every single second.'
    }
  },

  'monty-hall': {
    simulatorId: 'monty-hall',
    h1Heading: 'Monty Hall Probability Paradox & Monte Carlo Casino Lab',
    introduction: 'Test your probabilistic intuition against mathematical reality in the famous three-door Monty Hall puzzle. Play manual rounds or run 10,000 automated Monte Carlo simulations to prove why switching doors doubles your win probability from 1/3 (33.3%) to 2/3 (66.7%).',
    learningObjectives: [
      'Resolve the cognitive illusion that the remaining two unopened doors share an equal 50/50 probability.',
      'Understand conditional probability and how host Monty\'s non-random action injects information into the game.',
      'Demonstrate the Law of Large Numbers by running thousands of high-speed trials.',
      'Apply Bayes\' Theorem to calculate posterior probabilities following goat door disclosure.'
    ],
    mathematicalPrinciples: [
      {
        title: 'Initial Door Probabilities',
        description: 'When the player makes an initial choice among 3 closed doors, the probability of choosing the car is 1/3, and the probability the car is behind one of the other two doors is 2/3.',
        formulaLatex: 'P(\\text{Car in Chosen Door}) = \\frac{1}{3}, \\quad P(\\text{Car in Remaining Doors}) = \\frac{2}{3}'
      },
      {
        title: 'Host Knowledge & Conditional Switching Advantage',
        description: 'Because host Monty knows where the car is and MUST always open a door containing a goat, the entire 2/3 probability mass collapses onto the single unopened alternative door.',
        formulaLatex: 'P(\\text{Win by Switching}) = 1 - P(\\text{Initial Choice Correct}) = 1 - \\frac{1}{3} = \\frac{2}{3} \\approx 66.67\\%'
      }
    ],
    controlsGuide: [
      {
        name: 'Door 1, Door 2, Door 3 Selectors',
        type: 'interactive cards',
        description: 'Allows the user to select their initial door pick in manual interactive gameplay mode.',
        effect: 'Locks initial choice and triggers Monty to open an unchosen door revealing a goat.'
      },
      {
        name: 'Switch vs Stay Action Buttons',
        type: 'button pair',
        description: 'Offers the crucial final decision: maintain your initial door or switch to the remaining closed door.',
        effect: 'Opens selected door to reveal the hidden prize (Luxury Car or Goat).'
      },
      {
        name: 'Monte Carlo Automated Batch Runner',
        type: 'slider & trigger',
        range: '10 to 10,000 trials',
        description: 'Simulates thousands of games in seconds under both "Always Switch" and "Always Stay" strategies.',
        effect: 'Plots real-time convergence graph demonstrating experimental percentages stabilizing at 66.7% and 33.3%.'
      }
    ],
    stepByStepInstructions: [
      'Pick Door 1 in manual round mode; notice that your choice has an initial win probability of 1/3.',
      'Watch Monty open Door 3 to reveal a bleating goat, leaving Door 2 closed.',
      'Click "Switch to Door 2" to claim the prize, noting win or loss.',
      'Switch to the "Batch Monte Carlo" tab, set trials to 1,000, and click "Run Simulation".',
      'Watch the live convergence curve: as N increases, the win rate for the Switch strategy converges to exactly 66.7%, proving the mathematical advantage beyond doubt.'
    ],
    expectedOutput: 'Interactive 3-door game stage with sound effects, dynamic probability distribution gauge, and live Monte Carlo convergence line chart showing empirical win rates approaching theoretical limits.',
    realWorldApplication: {
      field: 'Decision Theory & Medical Diagnostics',
      description: 'Used in cognitive bias mitigation, Bayesian diagnostic testing, asset portfolio rebalancing, and game-theoretic risk analysis.',
      example: 'In medical screening tests, updating disease probability given a positive test result requires factoring prior base rates, exactly like Monty Hall requires tracking initial 1/3 and 2/3 priors.'
    }
  },

  'quadratic-roots': {
    simulatorId: 'quadratic-roots',
    h1Heading: 'Parabola Root Hunter & Quadratic Discriminant Visualizer',
    introduction: 'Manipulate polynomial coefficients a, b, and c in real-time to explore the geometry of parabolas y = ax² + bx + c. Watch how the discriminant D = b² - 4ac dictates the nature of roots, shifting the curve from two distinct x-intercepts, to one tangent vertex point, to a floating non-intersecting parabola with complex conjugate roots.',
    learningObjectives: [
      'Connect algebraic quadratic solutions directly to geometric x-intercepts of the parabola.',
      'Master the discriminant trichotomy: D > 0 (two distinct real roots), D = 0 (two equal real roots), and D < 0 (no real roots).',
      'Identify the vertex coordinates (-b/(2a), -D/(4a)) and the axis of symmetry x = -b/(2a).',
      'Understand Vieta\'s relations: sum of roots α + β = -b/a and product of roots α·β = c/a.'
    ],
    mathematicalPrinciples: [
      {
        title: 'The Quadratic Formula & Discriminant',
        description: 'Derived by completing the square on ax² + bx + c = 0.',
        formulaLatex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}, \\quad D = b^2 - 4ac'
      },
      {
        title: 'Vertex & Symmetry Axis',
        description: 'The turning point of the parabola occurs where the derivative 2ax + b = 0.',
        formulaLatex: 'x_v = -\\frac{b}{2a}, \\quad y_v = -\\frac{D}{4a} = c - \\frac{b^2}{4a}'
      }
    ],
    controlsGuide: [
      {
        name: 'Leading Coefficient (a) Slider',
        type: 'slider',
        range: '-5.0 to +5.0 (step 0.1, a ≠ 0)',
        description: 'Controls parabola concavity and aperture width.',
        effect: 'a > 0 curves upwards (minimum vertex); a < 0 curves downwards (maximum vertex).'
      },
      {
        name: 'Linear Coefficient (b) Slider',
        type: 'slider',
        range: '-10.0 to +10.0',
        description: 'Shifts the axis of symmetry horizontally and tilts the tangent at the y-intercept.',
        effect: 'Moves vertex across the coordinate plane along another parabolic locus.'
      },
      {
        name: 'Constant Term (c) Slider',
        type: 'slider',
        range: '-10.0 to +10.0',
        description: 'Controls the vertical translation of the parabola.',
        effect: 'Directly adjusts the y-intercept (0, c) and raises or lowers the parabola relative to the X-axis.'
      }
    ],
    stepByStepInstructions: [
      'Set a = 1, b = -4, and c = 3 to produce equation x² - 4x + 3 = 0.',
      'Observe the discriminant D = (-4)² - 4(1)(3) = 16 - 12 = 4 > 0.',
      'Check the two glowing green intersection points on the X-axis at x = 1.0 and x = 3.0.',
      'Increase c to 4 to produce x² - 4x + 4 = 0: watch the parabola lift until its vertex rests tangentially on the X-axis at x = 2 (D = 0).',
      'Increase c to 6: D becomes negative (-8), the parabola lifts completely off the X-axis, and roots become complex numbers 2 ± i√2.'
    ],
    expectedOutput: 'Interactive Cartesian coordinate graph with dynamically updating parabolic curve, labeled roots (α, β), vertex coordinate badge, axis of symmetry dashed line, and live discriminant status indicator.',
    realWorldApplication: {
      field: 'Structural Engineering & Architecture',
      description: 'Used in the design of suspension bridge cables, parabolic solar concentrators, acoustic dish antennas, and headlight reflectors.',
      example: 'The Golden Gate suspension bridge cables hang in a parabolic curve that distributes vehicle loads evenly to the vertical support towers.'
    }
  },

  'linear-systems': {
    simulatorId: 'linear-systems',
    h1Heading: 'Linear Crossroads: Pair of Linear Equations in Two Variables Lab',
    introduction: 'Solve systems of two simultaneous linear equations a1·x + b1·y + c1 = 0 and a2·x + b2·y + c2 = 0 graphically. Inspect how coefficient ratios govern system consistency: intersecting lines (unique solution), parallel lines (inconsistent / no solution), and coincident overlapping lines (infinitely many solutions).',
    learningObjectives: [
      'Visualize algebraic solutions of simultaneous equations as coordinate intersection points (x, y).',
      'Master the three coefficient ratio criteria: a1/a2 ≠ b1/b2, a1/a2 = b1/b2 ≠ c1/c2, and a1/a2 = b1/b2 = c1/c2.',
      'Distinguish between consistent systems with unique or infinite solutions and inconsistent systems with no solution.',
      'Perform live geometric verification of substitution and elimination algebraic methods.'
    ],
    mathematicalPrinciples: [
      {
        title: 'System Consistency Criteria',
        description: 'Comparison of coefficient ratios determines whether lines intersect, stay parallel, or merge.',
        formulaLatex: '\\frac{a_1}{a_2} \\neq \\frac{b_1}{b_2} \\implies \\text{Unique Solution}, \\quad \\frac{a_1}{a_2} = \\frac{b_1}{b_2} \\neq \\frac{c_1}{c_2} \\implies \\text{No Solution (Parallel)}'
      },
      {
        title: 'Cramer\'s Rule & Determinants',
        description: 'Algebraic intersection formula derived through cross-multiplication method.',
        formulaLatex: 'x = \\frac{b_1 c_2 - b_2 c_1}{a_1 b_2 - a_2 b_1}, \\quad y = \\frac{c_1 a_2 - c_2 a_1}{a_1 b_2 - a_2 b_1}'
      }
    ],
    controlsGuide: [
      {
        name: 'Line 1 Sliders (a1, b1, c1)',
        type: 'slider set',
        range: '-10 to +10',
        description: 'Adjusts slope and intercept of the cyan line a1·x + b1·y + c1 = 0.',
        effect: 'Updates position and orientation of Line 1 on the canvas.'
      },
      {
        name: 'Line 2 Sliders (a2, b2, c2)',
        type: 'slider set',
        range: '-10 to +10',
        description: 'Adjusts slope and intercept of the amber line a2·x + b2·y + c2 = 0.',
        effect: 'Updates position and orientation of Line 2 on the canvas.'
      },
      {
        name: 'Preset Scenarios (Unique, Parallel, Coincident)',
        type: 'button group',
        description: 'Loads classic textbook exam cases with one click.',
        effect: 'Instantly configures coefficients to demonstrate each of the 3 consistency states.'
      }
    ],
    stepByStepInstructions: [
      'Click the "Unique Solution" preset (e.g., 2x + 3y - 12 = 0 and x - y - 1 = 0).',
      'Observe the intersection crosshair glowing at coordinate point (3, 2).',
      'Click the "Parallel Lines" preset (2x + 4y - 8 = 0 and 2x + 4y - 16 = 0).',
      'Notice that a1/a2 = b1/b2 = 1, but c1/c2 = 1/2: the lines never meet, and the solution box displays "Inconsistent / No Solution".',
      'Click "Coincident Lines" (2x + 3y - 6 = 0 and 4x + 6y - 12 = 0) to watch the two lines merge into one, creating infinitely many solutions.'
    ],
    expectedOutput: 'Interactive 2D Cartesian plane displaying two distinct colored lines, an animated intersection locator, dynamic coefficient ratio readout cards, and formal consistency verdict badge.',
    realWorldApplication: {
      field: 'Economics & Break-Even Analysis',
      description: 'Used in business to find the break-even point where the revenue line intersects the total production cost line.',
      example: 'If fixed costs are $5,000 with $20 marginal cost per unit, and sale price is $45 per unit, solving the system 45x - y = 0 and 20x - y = -5000 gives exact break-even sales of 200 units ($9,000).'
    }
  },

  'trig-heights': {
    simulatorId: 'trig-heights',
    h1Heading: 'Lighthouse Clinometer: Heights & Distances Trigonometric Surveyor',
    introduction: 'Step into the boots of a maritime surveyor. Aim an interactive clinometer telescope from the deck of a survey ship toward a towering sea lighthouse or coastal cliff to solve practical heights and distances problems using angles of elevation and depression.',
    learningObjectives: [
      'Distinguish clearly between the angle of elevation (looking upward) and angle of depression (looking downward).',
      'Select the correct trigonometric ratio (primarily tangent = opposite / adjacent) to determine inaccessible distances.',
      'Solve two-observation problems where an observer advances closer to the base of an object.',
      'Eliminate the common student mistake of ignoring observer eye height.'
    ],
    mathematicalPrinciples: [
      {
        title: 'Single Observation Height Formula',
        description: 'From an observation point distance d away with angle of elevation θ and observer eye height h_eye.',
        formulaLatex: '\\tan(\\theta) = \\frac{H - h_{\\text{eye}}}{d} \\implies H = h_{\\text{eye}} + d \\cdot \\tan(\\theta)'
      },
      {
        title: 'Dual Observation Distance Formula',
        description: 'When moving distance x closer from angle θ1 to steeper angle θ2.',
        formulaLatex: 'd = \\frac{x \\cdot \\tan(\\theta_1)}{\\tan(\\theta_2) - \\tan(\\theta_1)}, \\quad H = x \\cdot \\frac{\\tan(\\theta_1) \\tan(\\theta_2)}{\\tan(\\theta_2) - \\tan(\\theta_1)}'
      }
    ],
    controlsGuide: [
      {
        name: 'Ship Distance Slider (d)',
        type: 'slider',
        range: '10 m to 150 m',
        description: 'Moves the ship closer to or further from the base of the lighthouse.',
        effect: 'Dynamically varies distance d and steepens or flattens the angle of elevation.'
      },
      {
        name: 'Lighthouse Height Slider (H)',
        type: 'slider',
        range: '20 m to 100 m',
        description: 'Adjusts the physical vertical height of the lighthouse tower.',
        effect: 'Changes the opposite side of the right-angled triangle.'
      },
      {
        name: 'Clinometer Telescope Aim Tool',
        type: 'interactive drag handle',
        description: 'Allows dragging the telescope crosshair directly onto the lighthouse beacon lamp.',
        effect: 'Locks the sightline and measures the angle of elevation with sub-degree precision.'
      },
      {
        name: 'Observer Eye Height Toggle',
        type: 'toggle',
        range: '0 m (Ground level) vs 1.7 m (Human surveyor)',
        description: 'Toggles inclusion of observer height in the calculation.',
        effect: 'Demonstrates why adding eye height is mandatory for real-world exam questions.'
      }
    ],
    stepByStepInstructions: [
      'Set lighthouse height to 50 m and move the survey vessel to a distance of 50 m from the base.',
      'Aim the clinometer at the top lamp; note that the angle of elevation reads exactly 45.0° because tan(45°) = 1 (opposite = adjacent).',
      'Move the ship back to d = 86.6 m; observe the angle of elevation drops to 30.0° because 50 / 86.6 ≈ 1/√3 = tan(30°).',
      'Toggle "Observer Eye Height" to 1.7 m and observe how the calculated formula updates: H = 1.7 + d·tan(θ).',
      'Switch to the "Dual Angle Challenge" to solve textbook NCERT problems by advancing the ship 30 m and calculating lighthouse height without measuring initial distance.'
    ],
    expectedOutput: 'Rich nautical 2D scene with animated waves, survey ship, vertical cliff with lighthouse, dotted sightline with clinometer protractor overlay, and live trigonometric triangle breakdown.',
    realWorldApplication: {
      field: 'Civil Surveying & Aerospace Navigation',
      description: 'Used by civil engineers using total stations and theodolites to survey skyscrapers, mountain peaks, and bridge pylons without physical climbing.',
      example: 'Surveyors measured the height of Mount Everest (8,848.86 m) from the plains of India using high-precision trigonometric clinometer theodolites.'
    }
  },

  'similar-triangles': {
    simulatorId: 'similar-triangles',
    h1Heading: 'Similar Triangles & Basic Proportionality Theorem (Thales) Forge',
    introduction: 'Explore the geometry of scale without distortion. Draw parallel transversals across triangle sides to prove Thales\' Basic Proportionality Theorem (BPT) dynamically, test AA, SAS, and SSS similarity criteria, and watch corresponding side ratios remain stubbornly identical while areas scale with the square of the ratio.',
    learningObjectives: [
      'State and prove Thales\' Basic Proportionality Theorem: a line drawn parallel to one side divides the other two sides in equal ratio.',
      'Apply the AA (Angle-Angle), SAS, and SSS criteria to establish triangle similarity.',
      'Internalize the area ratio theorem: Area(Δ1) / Area(Δ2) = (side1 / side2)².',
      'Distinguish fundamentally between triangle congruence (scale factor k = 1) and similarity (arbitrary scale factor k).'
    ],
    mathematicalPrinciples: [
      {
        title: 'Basic Proportionality Theorem (Thales Theorem)',
        description: 'If DE is parallel to BC in ΔABC intersecting AB at D and AC at E, then AD/DB = AE/EC.',
        formulaLatex: 'DE \\parallel BC \\implies \\frac{AD}{DB} = \\frac{AE}{EC} \\iff \\frac{AD}{AB} = \\frac{AE}{AC} = \\frac{DE}{BC}'
      },
      {
        title: 'Similarity Area Ratio Invariant',
        description: 'The ratio of areas of two similar triangles is equal to the square of the ratio of their corresponding sides.',
        formulaLatex: '\\Delta ABC \\sim \\Delta DEF \\implies \\frac{\\text{Area}(\\Delta ABC)}{\\text{Area}(\\Delta DEF)} = \\left(\\frac{AB}{DE}\\right)^2 = k^2'
      }
    ],
    controlsGuide: [
      {
        name: 'Triangle Vertex Drag Handles (A, B, C)',
        type: 'interactive canvas handles',
        description: 'Allows dragging any corner of the master triangle to change side lengths and angles freely.',
        effect: 'Updates triangle geometry while preserving live geometric invariants.'
      },
      {
        name: 'Parallel Transversal Slider (DE position)',
        type: 'slider',
        range: '0.1 to 0.9 along sides AB and AC',
        description: 'Slides parallel line DE up and down the triangle.',
        effect: 'Shows live segment lengths AD, DB, AE, EC and proves the ratio equality AD/DB = AE/EC continuously.'
      },
      {
        name: 'Scale Factor Multiplier (k)',
        type: 'slider',
        range: '0.5x to 3.0x',
        description: 'Scales the similar clone triangle uniformly.',
        effect: 'Updates side lengths linearly and displays quadratic area scaling.'
      }
    ],
    stepByStepInstructions: [
      'In ΔABC, drag the transversal slider to position line DE halfway up sides AB and AC.',
      'Check the live ratio cards: AD = 4.0 cm, DB = 4.0 cm (ratio 1.000); AE = 3.5 cm, EC = 3.5 cm (ratio 1.000).',
      'Drag vertex A to distort the triangle into an obtuse scalene shape; observe that while all lengths change wildly, AD/DB still strictly equals AE/EC!',
      'Inspect the scale factor k = 2.0 between ΔADE and ΔABC; note that corresponding sides are in ratio 1:2, while the shaded area of ΔABC is exactly 4 times (2²) the area of ΔADE.',
      'Toggle the BPT Converse test to verify that if AD/DB = AE/EC, line DE is guaranteed to be parallel to BC.'
    ],
    expectedOutput: 'Interactive geometric canvas with dual triangles, color-coded matching angles, side ratio comparison counters, and dynamic area ratio computation tiles.',
    realWorldApplication: {
      field: 'Cartography, CGI & Optical Scaling',
      description: 'Used in satellite map scales, camera lens zoom optics, blueprint drafting, and computer graphics 3D projection pipelines.',
      example: 'A 1:50,000 architectural map uses similarity so that a 2 cm line on the map represents exactly 1 km on the actual terrain, preserving all geographic angles perfectly.'
    }
  },

  'arithmetic-progression-lab': {
    simulatorId: 'arithmetic-progression-lab',
    h1Heading: 'Arithmetic Progression: nth Term & Gauss Ladder Sum Visualizer',
    introduction: 'Build sequences of numbers with a constant common difference d. Visualize arithmetic progressions as geometric staircases, calculate any arbitrary nth term an = a + (n-1)d, and invert the staircase to discover young Carl Friedrich Gauss\'s famous dot-pairing proof for the sum of n terms Sn.',
    learningObjectives: [
      'Define an arithmetic progression by first term a and common difference d.',
      'Calculate any arbitrary term using the formula an = a + (n - 1)·d.',
      'Visualize the sum of n terms as the area of a trapezoidal staircase.',
      'Master the Gauss summation pairing method: Sn = (n/2)·[2a + (n-1)d] = (n/2)·[first + last].'
    ],
    mathematicalPrinciples: [
      {
        title: 'General nth Term Formula',
        description: 'Each subsequent term is produced by adding common difference d to the preceding term.',
        formulaLatex: 'a_n = a + (n - 1)d, \\quad d = a_k - a_{k-1}'
      },
      {
        title: 'Sum of First n Terms (Gauss Inversion)',
        description: 'Writing the series forward and backward pairs terms together, each with constant sum a + l.',
        formulaLatex: 'S_n = \\frac{n}{2}\\left[2a + (n - 1)d\\right] = \\frac{n}{2}\\left(a + a_n\\right)'
      }
    ],
    controlsGuide: [
      {
        name: 'First Term Slider (a)',
        type: 'slider',
        range: '-20 to +20',
        description: 'Sets the starting value of the progression (the base height of the first staircase step).',
        effect: 'Shifts the entire sequence vertically.'
      },
      {
        name: 'Common Difference Slider (d)',
        type: 'slider',
        range: '-10 to +10 (step 0.5)',
        description: 'Sets the step height added between consecutive terms.',
        effect: 'd > 0 yields an increasing AP; d < 0 yields a decreasing AP; d = 0 yields a constant sequence.'
      },
      {
        name: 'Number of Terms Slider (n)',
        type: 'slider',
        range: '1 to 50 terms',
        description: 'Determines how many terms are generated and summed.',
        effect: 'Extends the staircase and updates the cumulative sum.'
      },
      {
        name: 'Gauss Pairing Inversion Toggle',
        type: 'button',
        description: 'Duplicates the staircase, rotates it 180°, and locks it against the original to form a solid rectangle.',
        effect: 'Provides visual proof of the factor (n/2)·(a + l).'
      }
    ],
    stepByStepInstructions: [
      'Set first term a = 1, common difference d = 1, and terms n = 10 to represent the classic sum 1 + 2 + ... + 10.',
      'Inspect the generated sequence: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10; note that a10 = 10.',
      'Click the "Gauss Inversion" button: watch an inverted copy of the staircase dock with the original.',
      'Observe that each vertical column now contains 1 + 10 = 11 blocks, forming a rectangle of width 10 and height 11 (area = 110 blocks).',
      'Because two identical staircases were used, Sn = 110 / 2 = 55, confirming Sn = (10/2)·(1 + 10) = 55.'
    ],
    expectedOutput: 'Interactive 3D/2D vertical bar staircase chart, animated Gauss pairing transformation, live sequence sequence ribbon, and step-by-step formula evaluation breakdown.',
    realWorldApplication: {
      field: 'Financial Planning & Amortization',
      description: 'Used to model recurring monthly loan repayments, depreciation of machinery, stadium seating capacity layouts, and pension fund schedules.',
      example: 'A concert amphitheater with 20 seats in row 1, 24 in row 2, and 28 in row 3 is an AP with a = 20, d = 4. Total capacity for 30 rows is S_30 = (30/2)·[40 + 29·4] = 2,340 seats.'
    }
  },

  'coordinate-section-formula': {
    simulatorId: 'coordinate-section-formula',
    h1Heading: 'Section Formula & Centroid Coordinate Geometry Workshop',
    introduction: 'Divide line segments in internal and external ratios m:n on the Cartesian coordinate grid. Drag endpoints A(x1, y1) and B(x2, y2) to watch division point P(x, y) track the weighted average, explore the midpoint special case, and construct triangle centroids as centers of mass.',
    learningObjectives: [
      'Master the internal section formula P = ((m·x2 + n·x1)/(m+n), (m·y2 + n·y1)/(m+n)).',
      'Understand the midpoint formula as the symmetric 1:1 ratio special case.',
      'Visualize external section division and harmonic conjugates.',
      'Calculate the centroid of a triangle as the intersection of medians dividing each in a 2:1 ratio.'
    ],
    mathematicalPrinciples: [
      {
        title: 'Internal Section Formula',
        description: 'Point P divides line segment AB internally in ratio m:n by similar right triangles projection.',
        formulaLatex: 'P(x, y) = \\left( \\frac{m x_2 + n x_1}{m + n}, \\; \\frac{m y_2 + n y_1}{m + n} \\right)'
      },
      {
        title: 'Triangle Centroid Invariant',
        description: 'The centroid G is the average of all three vertex coordinates and divides each median in ratio 2:1.',
        formulaLatex: 'G(x, y) = \\left( \\frac{x_1 + x_2 + x_3}{3}, \\; \\frac{y_1 + y_2 + y_3}{3} \\right)'
      }
    ],
    controlsGuide: [
      {
        name: 'Endpoint A & B Drag Handles',
        type: 'interactive pins',
        description: 'Allows dragging coordinates of points A(x1, y1) and B(x2, y2) anywhere on the grid.',
        effect: 'Updates segment length and slope while recalculating division point P.'
      },
      {
        name: 'Ratio Sliders (m and n)',
        type: 'dual sliders',
        range: '1 to 10 integer ratio (e.g., 2:1, 3:2, 1:1)',
        description: 'Controls the proportional division ratio AP : PB.',
        effect: 'Slides point P along segment AB with live coordinate readout.'
      },
      {
        name: 'Centroid Mode Switch',
        type: 'toggle',
        description: 'Adds a third vertex C to form a triangle and renders all three medians intersecting at centroid G.',
        effect: 'Displays center-of-mass balance crosshair and verifies 2:1 median ratio.'
      }
    ],
    stepByStepInstructions: [
      'Place point A at (-4, 2) and point B at (6, -3).',
      'Set ratio m = 1 and n = 1 to find the midpoint M: observe coordinates M = ((-4+6)/2, (2-3)/2) = (1.0, -0.5).',
      'Change ratio to m = 2, n = 3; observe point P moves closer to A such that length AP is 2/5 of total length AB.',
      'Check the live substitution card showing x = (2·6 + 3·(-4)) / (2+3) = 0/5 = 0, and y = (2·(-3) + 3·2) / 5 = 0: P lands right at the origin (0, 0)!',
      'Enable "Centroid Mode" and drag vertex C to see medians always meet at one concurrent point G.'
    ],
    expectedOutput: 'Crisp coordinate grid with color-coded segment AB, highlighted division point P, orthogonal projection triangles showing similar ratio preservation along X and Y axes, and KaTeX proof ladder.',
    realWorldApplication: {
      field: 'Robotics & Computer Graphics Physics Engines',
      description: 'Used in robotic arm inverse kinematics, linear interpolation (LERP) in video game animation, and calculating the center of gravity of aerospace vehicles.',
      example: 'In 3D video game animation, LERP between two keyframe positions is computed directly using the section formula P = (1 - t)·A + t·B where parameter t = m / (m + n).'
    }
  },

  'circle-tangents-lab': {
    simulatorId: 'circle-tangents-lab',
    h1Heading: 'Circle Tangents & External Point Radii Perpendicularity Lab',
    introduction: 'Investigate the fundamental properties of tangents to circles. Drag an external point P relative to a circle of radius R to construct the two tangents PA and PB, verifying dynamically that tangent lengths are equal (PA = PB) and that the radius to the point of contact is strictly perpendicular (OA ⊥ PA).',
    learningObjectives: [
      'Prove that the tangent at any point of a circle is perpendicular to the radius through the point of contact (OA ⊥ PA).',
      'Prove that the lengths of tangents drawn from an external point to a circle are equal (PA = PB).',
      'Understand the cyclic nature of quadrilateral OAPB where opposite angles sum to 180° (∠APB + ∠AOB = 180°).',
      'Calculate tangent length using Pythagoras theorem: PA = √(OP² - R²).'
    ],
    mathematicalPrinciples: [
      {
        title: 'Tangent-Radius Perpendicularity',
        description: 'The shortest distance from circle center O to tangent line PA is the perpendicular radius OA.',
        formulaLatex: 'OA \\perp PA \\implies \\angle OAP = 90^\\circ, \\quad \\angle OBP = 90^\\circ'
      },
      {
        title: 'Equal Tangent Lengths from External Point',
        description: 'By RHS congruence between right-angled triangles ΔOAP and ΔOBP (hypotenuse OP common, radii OA = OB).',
        formulaLatex: '\\Delta OAP \\cong \\Delta OBP \\implies PA = PB = \\sqrt{OP^2 - R^2}'
      }
    ],
    controlsGuide: [
      {
        name: 'External Point Drag Handle (P)',
        type: 'interactive pin',
        description: 'Drag point P anywhere around the circle.',
        effect: 'Dynamically updates tangent contact points A and B, distance OP, and subtended angles.'
      },
      {
        name: 'Circle Radius Slider (R)',
        type: 'slider',
        range: '2.0 cm to 8.0 cm',
        description: 'Adjusts the size of the target circle.',
        effect: 'Expands or contracts the circle while maintaining geometric tangency.'
      },
      {
        name: 'RHS Congruence Overlay Button',
        type: 'toggle',
        description: 'Highlights triangles ΔOAP and ΔOBP with color-coded hypotenuse, radii, and tangent legs.',
        effect: 'Renders step-by-step NCERT textbook proof of PA = PB.'
      }
    ],
    stepByStepInstructions: [
      'Set circle radius R = 5.0 cm and drag external point P to a distance of 13.0 cm from center O.',
      'Inspect the right-angled triangle ΔOAP: angle ∠OAP is locked at exactly 90.0° with a right-angle square symbol.',
      'Check the computed tangent length: PA = √(13² - 5²) = √(169 - 25) = √144 = 12.0 cm.',
      'Compare with bottom tangent PB: PB is also exactly 12.0 cm, verifying the equal length theorem.',
      'Drag point P towards the circle boundary: observe that as OP approaches R, the two tangents merge into one single tangent, and when P enters the interior (OP < R), zero real tangents can be drawn!'
    ],
    expectedOutput: 'Interactive geometric construction displaying circle, external point P, both tangent lines PA and PB, perpendicular radii OA and OB, cyclic quadrilateral highlight, and live Pythagorean computation.',
    realWorldApplication: {
      field: 'Mechanical Gear Design & Satellite Communications',
      description: 'Used in calculating belt lengths around pulleys, gear pitch circle contact mechanics, and finding line-of-sight horizon distance for communication satellites.',
      example: 'A weather satellite at altitude h above Earth (radius R) has line-of-sight horizon distance d = √( (R+h)² - R² ), calculated directly using circle tangent geometry.'
    }
  }
};

