/**
 * simulatorStepsData.ts
 * Comprehensive 4-Step Guided Walkthrough & Inspector Metadata for Simulators.
 * Each simulator features:
 * 1. Setup & Ground Truth (What are we looking at?)
 * 2. Hands-on Operation (How to operate the simulator?)
 * 3. What Math is Happening (Visual Cause & Effect)
 * 4. Solved Exam Problem & Mental Shortcut (Board Exam Mastery)
 */
import { SimulatorId } from '../types/simulators';

export interface SimulatorStep {
  stepNumber: number;
  title: string;
  badge: string;
  instruction: string;
  actionHint: string;
  formulaLatex?: string;
  coachTip: string;
  presetActionLabel?: string;
}

export interface SimulatorGuideData {
  simulatorId: SimulatorId;
  title: string;
  category: string;
  grade: string;
  steps: SimulatorStep[];
  inspectorConfig: {
    originXRatio?: number; // 0.5 = center
    originYRatio?: number; // 0.5 = center
    scaleRangeX?: number;  // total math units across canvas
    scaleRangeY?: number;
    unitName?: string;
    customInsight?: (x: number, y: number) => {
      zone: string;
      valueLatex: string;
      formulaLatex: string;
      tipText: string;
    };
  };
}

export const SIMULATOR_STEPS_DATA: Partial<Record<SimulatorId, SimulatorGuideData>> = {
  'drone-navigator': {
    simulatorId: 'drone-navigator',
    title: 'The Drone Navigator: Coordinate Geometry & Distance',
    category: 'Coordinate Geometry',
    grade: 'Class 9',
    inspectorConfig: {
      originXRatio: 0.5,
      originYRatio: 0.5,
      scaleRangeX: 20,
      scaleRangeY: 20,
      unitName: 'units',
      customInsight: (x, y) => {
        const d = Math.hypot(x, y);
        const theta = ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
        return {
          zone: x >= 0 && y >= 0 ? '\\text{Quadrant I: } x \\ge 0, y \\ge 0' : x < 0 && y >= 0 ? '\\text{Quadrant II: } x < 0, y \\ge 0' : x < 0 && y < 0 ? '\\text{Quadrant III: } x < 0, y < 0' : '\\text{Quadrant IV: } x \\ge 0, y < 0',
          valueLatex: `d = \\sqrt{(\\Delta x)^2 + (\\Delta y)^2} = ${d.toFixed(2)}\\text{ u}, \\quad \\theta = ${theta.toFixed(1)}^\\circ`,
          formulaLatex: 'd = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}',
          tipText: `Orthogonal legs $\\Delta x = ${Math.abs(x).toFixed(1)}$, $\\Delta y = ${Math.abs(y).toFixed(1)}$. Direct Euclidean distance $d = ${d.toFixed(2)}$ is strictly less than Manhattan grid distance $|\\Delta x| + |\\Delta y| = ${(Math.abs(x) + Math.abs(y)).toFixed(1)}$!`,
        };
      },
    },
    steps: [
      {
        stepNumber: 1,
        title: 'Inspect Cartesian Ground Truth',
        badge: 'Base Station (0, 0)',
        instruction: 'Observe the 2D Cartesian plane $\\mathbb{R}^2$. The drone launch station is pinned at origin $(0, 0)$, with horizontal $X$-axis and vertical $Y$-axis. Radial No-Fly Zones are circular disks defined by $(x - h)^2 + (y - k)^2 < R^2$.',
        actionHint: 'Notice how every point $P$ is uniquely determined by coordinates $(x, y)$.',
        formulaLatex: 'P = (x, y) \\in \\mathbb{R}^2, \\quad \\text{Origin } O = (0, 0)',
        coachTip: 'Coordinates represent perpendicular displacements: $x$ represents horizontal signed width, and $y$ represents vertical signed altitude.',
      },
      {
        stepNumber: 2,
        title: 'Operate the Drone Flight Path',
        badge: 'Vector Displacement',
        instruction: 'Touch and drag the drone or click anywhere on the Cartesian grid to set target coordinates $(x_2, y_2)$. Watch the right-angled triangle $\\Delta ACB$ form dynamically with orthogonal legs $\\Delta x$ and $\\Delta y$.',
        actionHint: 'Drag the drone to point $(6, 8)$ to test the scaled $(3, 4, 5)$ Pythagorean triplet.',
        formulaLatex: '\\Delta x = x_2 - x_1, \\quad \\Delta y = y_2 - y_1',
        coachTip: 'The horizontal line is $\\Delta x$ and vertical line is $\\Delta y$. You are physically constructing a Euclidean right triangle!',
      },
      {
        stepNumber: 3,
        title: 'Observe the Hypotenuse Invariant',
        badge: 'Pythagoras in Action',
        instruction: 'By the Pythagorean theorem, the direct distance is the hypotenuse: $d^2 = (\\Delta x)^2 + (\\Delta y)^2$. By the triangle inequality, the direct hypotenuse is strictly shorter than traveling along grid axes: $d < |\\Delta x| + |\\Delta y|$.',
        actionHint: 'Observe how diagonal flight saves up to $29.3\\%$ flight distance compared to rectilinear motion.',
        formulaLatex: 'd = +\\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2} = \\| \\mathbf{r}_2 - \\mathbf{r}_1 \\|',
        coachTip: 'Never memorize the distance formula! It is simply the Pythagorean theorem $c = \\sqrt{a^2 + b^2}$ applied to coordinate differences.',
      },
      {
        stepNumber: 4,
        title: 'Board Exam Shortcut: Pythagorean Triplets',
        badge: 'Exam Mastery',
        instruction: 'In CBSE/ICSE exams, look for primitive Pythagorean triplets: $(3, 4, 5)$, $(5, 12, 13)$, $(7, 24, 25)$, and $(8, 15, 17)$. When differences $(\\Delta x, \\Delta y)$ match a triplet, write $d$ in 2 seconds without square roots!',
        actionHint: 'Collinear points condition: If $AB + BC = AC$, then points $A, B, C$ are collinear.',
        formulaLatex: 'AB + BC = AC \\iff A, B, C \\text{ are Collinear}',
        coachTip: 'When proving points are equidistant ($PA = PB$), square both sides first: $PA^2 = PB^2$. This eliminates radical square roots from step one!',
      },
    ],
  },

  'quadratic-roots': {
    simulatorId: 'quadratic-roots',
    title: 'The Parabola Root Hunter: Discriminant D & Roots',
    category: 'Algebra & Quadratics',
    grade: 'Class 10',
    inspectorConfig: {
      originXRatio: 0.5,
      originYRatio: 0.5,
      scaleRangeX: 20,
      scaleRangeY: 24,
      unitName: 'units',
      customInsight: (x, y) => {
        return {
          zone: y > 0 ? '\\text{Upper Half-Plane: } y > 0' : y === 0 ? '\\text{Root Ground Line: } y = 0' : '\\text{Lower Half-Plane: } y < 0',
          valueLatex: `(x, y) = (${x.toFixed(2)}, ${y.toFixed(2)}), \\quad y - f(x)`,
          formulaLatex: 'y = ax^2 + bx + c, \\quad D = b^2 - 4ac',
          tipText: 'Real roots $\\alpha, \\beta$ exist exclusively where the parabola intersects the horizontal line $y = 0$ (the $X$-axis)!',
        };
      },
    },
    steps: [
      {
        stepNumber: 1,
        title: 'Understand Parabola Geometry & Symmetry',
        badge: 'Vertex & Axis',
        instruction: 'Observe the quadratic locus $y = ax^2 + bx + c$. The vertical line $x = -\\frac{b}{2a}$ is the Axis of Symmetry, dividing the parabola into two congruent reflection halves. The extremum turning point is the Vertex $V\\left(-\\frac{b}{2a}, -\\frac{D}{4a}\\right)$.',
        actionHint: 'Notice how the parabola is completely symmetric about $x = -\\frac{b}{2a}$.',
        formulaLatex: 'y = ax^2 + bx + c, \\quad \\text{Vertex } V = \\left(-\\frac{b}{2a}, -\\frac{b^2 - 4ac}{4a}\\right)',
        coachTip: 'If $a > 0$, the parabola is concave upward with a global minimum. If $a < 0$, it is concave downward with a global maximum.',
      },
      {
        stepNumber: 2,
        title: 'Operate Sliders a, b, and c',
        badge: 'Scrub Coefficients',
        instruction: 'Vary curvature coefficient $a$ to alter dilation width. Adjust linear coefficient $b$ to translate the axis of symmetry. Adjust constant $c$ for pure vertical translation along the $Y$-axis.',
        actionHint: 'Vary $c$ to translate the parabola vertically across the root line $y = 0$.',
        formulaLatex: 'y(0) = c \\implies (0, c) \\text{ is the } y\\text{-intercept}',
        coachTip: 'Coefficient $c$ is a pure vertical translation elevator: shifting $c$ raises or lowers the curve without changing its curvature shape.',
      },
      {
        stepNumber: 3,
        title: 'Track the Discriminant Invariant D',
        badge: 'Root Classification',
        instruction: 'Observe the discriminant $D = b^2 - 4ac$. When $D > 0$, the curve intersects the $X$-axis at two distinct real roots $\\alpha, \\beta = \\frac{-b \\pm \\sqrt{D}}{2a}$. When $D = 0$, it touches at one repeated root $\\alpha = -\\frac{b}{2a}$. When $D < 0$, the curve floats with zero real roots.',
        actionHint: 'Set $D = 0$ by choosing coefficients such that $b^2 = 4ac$.',
        formulaLatex: 'D = b^2 - 4ac \\implies x = \\frac{-b \\pm \\sqrt{D}}{2a}',
        coachTip: '$D$ counts real root intersections: $D > 0$ (two cuts), $D = 0$ (one tangent kiss), $D < 0$ (floating above/below ground).',
      },
      {
        stepNumber: 4,
        title: 'Master Board Exam Traps: Vieta\'s Formulas',
        badge: "Vieta's Formulas",
        instruction: 'In Class 10 Board exams, questions test relations between roots and coefficients: Sum of roots $\\alpha + \\beta = -\\frac{b}{a}$, and Product of roots $\\alpha \\beta = \\frac{c}{a}$. Use these relations to evaluate symmetric expressions like $\\alpha^2 + \\beta^2$.',
        actionHint: 'Identity: $\\alpha^2 + \\beta^2 = (\\alpha + \\beta)^2 - 2\\alpha\\beta = \\left(-\\frac{b}{a}\\right)^2 - 2\\left(\\frac{c}{a}\\right)$.',
        formulaLatex: '\\alpha + \\beta = -\\frac{b}{a}, \\quad \\alpha \\beta = \\frac{c}{a}, \\quad \\alpha^2 + \\beta^2 = \\frac{b^2 - 2ac}{a^2}',
        coachTip: 'Exam goldmine: When an exam question states "roots are reciprocal of each other" ($\\alpha = 1/\\beta$), immediately set $c = a$ since $\\alpha \\beta = c/a = 1$!',
      },
    ],
  },

  'catapult-siege': {
    simulatorId: 'catapult-siege',
    title: 'The Catapult Siege: Trigonometry, Heights & Trajectory',
    category: 'Trigonometry',
    grade: 'Class 10',
    inspectorConfig: {
      originXRatio: 0.15,
      originYRatio: 0.85,
      scaleRangeX: 80,
      scaleRangeY: 50,
      unitName: 'meters',
      customInsight: (x, y) => {
        const angle = ((Math.atan2(y, x) * 180) / Math.PI).toFixed(1);
        return {
          zone: x < 25 ? '\\text{Launch Ascent Zone: } v_y > 0' : x < 55 ? '\\text{Ballistic Apex: } v_y \\approx 0' : '\\text{Target Castle Zone}',
          valueLatex: `(x, y) = (${x.toFixed(1)}, ${y.toFixed(1)})\\text{ m}, \\quad \\theta = ${angle}^\\circ`,
          formulaLatex: '\\tan\\theta = \\frac{y}{x}, \\quad v_x = v\\cos\\theta, \\quad v_y = v\\sin\\theta',
          tipText: `At $\\theta = 45^\\circ$, horizontal drive $(\\cos 45^\\circ)$ and vertical lift $(\\sin 45^\\circ)$ are equal $\\left(\\frac{1}{\\sqrt{2}} \\approx 0.707\\right)$, maximizing ground range $R = \\frac{v^2 \\sin(2\\theta)}{g}$!`,
        };
      },
    },
    steps: [
      {
        stepNumber: 1,
        title: 'Inspect the Castle Siege Geometry',
        badge: 'Observer & Target',
        instruction: 'The catapult is stationed at ground origin $(0, 0)$. Across the battlefield stands the fortress with a defensive parapet of height $H$ at distance $D$. The angle from the catapult to the wall top is the Angle of Elevation $\\theta$.',
        actionHint: 'Notice the right-angled triangle formed between ground distance $D$, wall height $H$, and line of sight.',
        formulaLatex: '\\tan\\theta = \\frac{\\text{Opposite}}{\\text{Adjacent}} = \\frac{H}{D}',
        coachTip: 'Angle of elevation $\\theta$ is always measured upward from the horizontal ground line of sight. Never measure from the vertical!',
      },
      {
        stepNumber: 2,
        title: 'Set Launch Angle & Release Velocity',
        badge: 'Operate Arm',
        instruction: 'Touch and pull back the catapult launch arm to dial launch angle $\\theta$ and tension velocity $v$. Tap "Fire" to release the projectile and trace its parabolic flight curve.',
        actionHint: 'Set angle $\\theta = 45^\\circ$ to observe maximum ground flight range.',
        formulaLatex: 'v_x = v\\cos\\theta, \\quad v_y = v\\sin\\theta',
        coachTip: 'Think of initial speed $v$ as $100\\%$ of kinetic energy: $\\cos\\theta$ drives the projectile downfield, while $\\sin\\theta$ launches it upward.',
      },
      {
        stepNumber: 3,
        title: 'Observe Ballistic Parabolic Curvature',
        badge: 'Gravity Deceleration',
        instruction: 'Notice that horizontal velocity $v_x$ remains constant throughout flight (in a vacuum), while vertical velocity $v_y$ decelerates due to gravitational acceleration $g$ until reaching the apex ($v_y = 0$).',
        actionHint: 'Watch how height follows quadratic time dependence: $y(t) = v\\sin(\\theta)t - \\frac{1}{2}gt^2$.',
        formulaLatex: 'H_{\\max} = \\frac{v^2 \\sin^2\\theta}{2g}, \\quad \\text{Range } R = \\frac{v^2 \\sin(2\\theta)}{g}',
        coachTip: 'Why does $45^\\circ$ maximize range? Because $\\sin(2\\theta)$ attains its absolute maximum of $1$ when $2\\theta = 90^\\circ \\implies \\theta = 45^\\circ$!',
      },
      {
        stepNumber: 4,
        title: 'Board Exam Shortcut: Dual Angle Lighthouse Problem',
        badge: 'Exam Mastery',
        instruction: 'In CBSE Class 10 board exams, the classic 5-mark question involves two angles of elevation (e.g. $30^\\circ$ and $60^\\circ$) from two observation points separated by distance $d$. Use Alka Ma’am’s direct formula!',
        actionHint: 'Height $h = \\frac{d}{\\cot\\theta_1 - \\cot\\theta_2}$. For $30^\\circ$ and $60^\\circ$: $\\cot 30^\\circ = \\sqrt{3}$, $\\cot 60^\\circ = 1/\\sqrt{3}$.',
        formulaLatex: 'h = \\frac{d}{\\cot\\theta_1 - \\cot\\theta_2} = \\frac{d}{\\sqrt{3} - 1/\\sqrt{3}} = \\frac{\\sqrt{3}}{2}d',
        coachTip: 'Save 10 minutes in your board exam: Use $h = \\frac{d}{\\cot\\theta_1 - \\cot\\theta_2}$ to verify your answer in 15 seconds!',
      },
    ],
  },

  'unit-circle': {
    simulatorId: 'unit-circle',
    title: 'The Unit Circle & Trigonometric Wave Generator',
    category: 'Trigonometry',
    grade: 'Class 11',
    inspectorConfig: {
      originXRatio: 0.5,
      originYRatio: 0.5,
      scaleRangeX: 4,
      scaleRangeY: 4,
      unitName: 'rad',
      customInsight: (x, y) => {
        const rad = Math.atan2(y, x);
        const deg = ((rad * 180) / Math.PI + 360) % 360;
        const quad = deg < 90 ? '\\text{Quadrant I: All } > 0' : deg < 180 ? '\\text{Quadrant II: } \\sin > 0' : deg < 270 ? '\\text{Quadrant III: } \\tan > 0' : '\\text{Quadrant IV: } \\cos > 0';
        return {
          zone: quad,
          valueLatex: `\\theta = ${deg.toFixed(1)}^\\circ \\;\\left(${(rad > 0 ? rad : rad + 2 * Math.PI).toFixed(2)}\\text{ rad}\\right), \\quad (\\cos\\theta, \\sin\\theta) = (${Math.cos(rad).toFixed(2)}, ${Math.sin(rad).toFixed(2)})`,
          formulaLatex: '\\cos^2\\theta + \\sin^2\\theta = 1',
          tipText: 'ASTC Rule: After School To College! In Quadrant II only Sine is positive; in Quadrant III only Tan is positive; in Quadrant IV only Cos is positive.',
        };
      },
    },
    steps: [
      {
        stepNumber: 1,
        title: 'Understand the Unit Circle Geometry',
        badge: 'Radius R = 1',
        instruction: 'The unit circle is centered at origin $(0, 0)$ with radius $R = 1$. Every point $P$ on the circumference has coordinates $(\\cos\\theta, \\sin\\theta)$. The horizontal projection is $\\cos\\theta$ and the vertical projection is $\\sin\\theta$.',
        actionHint: 'Because radius $R = 1$, the Pythagorean theorem yields $\\cos^2\\theta + \\sin^2\\theta = 1$ identically everywhere!',
        formulaLatex: 'P(\\theta) = (\\cos\\theta, \\sin\\theta), \\quad \\cos^2\\theta + \\sin^2\\theta = 1',
        coachTip: 'Cosine is horizontal ($X$), Sine is vertical ($Y$). Remember: C precedes S in the alphabet, $X$ precedes $Y$ in coordinates!',
      },
      {
        stepNumber: 2,
        title: 'Drag the Angle Marker',
        badge: 'Sweep Angle θ',
        instruction: 'Touch and drag the cyan point around the circle. Watch how the right triangle transforms as you cross each quadrant, and observe the simultaneous generation of sine and cosine wave graphs on the right side.',
        actionHint: 'Drag through $0^\\circ, 90^\\circ, 180^\\circ$, and $270^\\circ$ to observe values at coordinate axes.',
        formulaLatex: '\\theta \\in [0, 2\\pi], \\quad 1\\text{ rad} = \\frac{180^\\circ}{\\pi} \\approx 57.3^\\circ',
        coachTip: 'Notice how continuous circular rotation generates smooth sinusoidal waves: circular motion IS periodic wave motion!',
      },
      {
        stepNumber: 3,
        title: 'Master the ASTC Quadrant Invariant',
        badge: 'All Sin Tan Cos',
        instruction: 'In Quadrant I ($0^\\circ\\text{--}90^\\circ$), all trigonometric functions are positive. In Quadrant II ($90^\\circ\\text{--}180^\\circ$), only $\\sin$ is positive ($X < 0$). In Quadrant III ($180^\\circ\\text{--}270^\\circ$), only $\\tan$ is positive ($(-Y)/(-X) > 0$). In Quadrant IV ($270^\\circ\\text{--}360^\\circ$), only $\\cos$ is positive.',
        actionHint: 'Inspect Quadrant II: $\\cos(120^\\circ) = -\\frac{1}{2}$, $\\sin(120^\\circ) = +\\frac{\\sqrt{3}}{2}$.',
        formulaLatex: '\\sin(180^\\circ - \\theta) = +\\sin\\theta, \\quad \\cos(180^\\circ - \\theta) = -\\cos\\theta',
        coachTip: 'Mnemonic: "All Silver Tea Cups" or "After School To College". Memorize this and you will never make a sign error again!',
      },
      {
        stepNumber: 4,
        title: 'Board Exam Shortcut: Special Angles Sequence',
        badge: '30°-45°-60° Matrix',
        instruction: 'CBSE/JEE questions rely on exact values: $30^\\circ\\;(\\pi/6)$, $45^\\circ\\;(\\pi/4)$, and $60^\\circ\\;(\\pi/3)$. Use Alka Ma’am’s hand rule: $\\frac{\\sqrt{n}}{2}$ to generate all values effortlessly!',
        actionHint: 'For $\\sin$: count fingers $n \\in \\{0, 1, 2, 3, 4\\}$ under $\\sqrt{n}/2$: $\\sqrt{0}/2=0, \\sqrt{1}/2=1/2, \\sqrt{2}/2=1/\\sqrt{2}, \\sqrt{3}/2, \\sqrt{4}/2=1$.',
        formulaLatex: '\\sin 30^\\circ = \\frac{1}{2}, \\quad \\sin 45^\\circ = \\frac{1}{\\sqrt{2}}, \\quad \\sin 60^\\circ = \\frac{\\sqrt{3}}{2}',
        coachTip: 'Never look at a printed trigonometric table during exams. Write the $\\frac{\\sqrt{0..4}}{2}$ sequence at the top of your rough sheet in 10 seconds!',
      },
    ],
  },

  'conic-sections': {
    simulatorId: 'conic-sections',
    title: '3D Double Cone Slicer: Conic Sections Workshop',
    category: 'Coordinate Geometry & 3D',
    grade: 'Class 11',
    inspectorConfig: {
      originXRatio: 0.5,
      originYRatio: 0.5,
      scaleRangeX: 10,
      scaleRangeY: 10,
      unitName: 'units',
      customInsight: (x, y) => {
        return {
          zone: '\\text{3D Conic Section Locus}',
          valueLatex: `(x, y) = (${x.toFixed(2)}, ${y.toFixed(2)}), \\quad e = \\frac{SP}{PM}`,
          formulaLatex: 'Ax^2 + Bxy + Cy^2 + Dx + Ey + F = 0',
          tipText: 'Comparing plane inclination $\\beta$ with cone semi-vertical angle $\\alpha$: Circle ($\\beta=0$), Ellipse ($\\beta < \\alpha$), Parabola ($\\beta = \\alpha$), Hyperbola ($\\beta > \\alpha$)!',
        };
      },
    },
    steps: [
      {
        stepNumber: 1,
        title: 'Inspect the 3D Double Nappe Cone',
        badge: 'Double Cone Geometry',
        instruction: 'Observe the 3D double cone with upper and lower nappes meeting at the apex vertex. The generator makes a fixed semi-vertical angle α with the vertical axis.',
        actionHint: 'Drag anywhere on the 3D canvas with one finger to orbit and inspect the cone from any viewing angle.',
        formulaLatex: '\\alpha = \\text{Cone semi-vertical angle}, \\quad \\beta = \\text{Plane inclination angle}',
        coachTip: 'All conics (circle, ellipse, parabola, hyperbola) are produced by slicing this exact same geometric cone with a flat plane!',
      },
      {
        stepNumber: 2,
        title: 'Tilt the Cutting Plane Angle β',
        badge: 'Operate Angle Slider',
        instruction: 'Use the slider below to change cutting plane inclination angle β. Watch the intersection curve morph in real time as β sweeps from 0° (horizontal) to 90° (vertical).',
        actionHint: 'Set β = 0° for a Circle, β < α for an Ellipse, β = α for a Parabola, and β > α for a Hyperbola.',
        formulaLatex: '\\beta = 0^\\circ \\implies \\text{Circle}, \\quad \\beta = \\alpha \\implies \\text{Parabola}',
        coachTip: 'When β = α, the plane is parallel to the cone generator, which cuts only ONE nappe to create an open parabola!',
      },
      {
        stepNumber: 3,
        title: 'Understand Focal Eccentricity e',
        badge: 'Eccentricity Metric',
        instruction: 'Every conic section is defined by a Focus S, Directrix line L, and Eccentricity e = SP / PM. Circle has e = 0, Ellipse has e < 1, Parabola has e = 1, and Hyperbola has e > 1.',
        actionHint: 'In an ellipse, the sum of distances to two foci is constant: SP + S’P = 2a.',
        formulaLatex: 'e = \\frac{\\text{Distance to Focus}}{\\text{Distance to Directrix}} = \\frac{SP}{PM}',
        coachTip: 'Parabola has e = 1 exactly: every point on a parabola is at the EXACT same distance from the focus as from the directrix line!',
      },
      {
        stepNumber: 4,
        title: 'Board Exam Shortcut: Identify Conic from 2nd Degree Equation',
        badge: 'Discriminant Test',
        instruction: 'In Class 11 exams, you must classify Ax² + 2Hxy + By² + 2Gx + 2Fy + C = 0: Check H² - AB! If H² - AB < 0, it is an Ellipse; if H² - AB = 0, it is a Parabola; if H² - AB > 0, it is a Hyperbola.',
        actionHint: 'For a circle: A = B and coefficient of xy term is zero (H = 0).',
        formulaLatex: 'H^2 - AB < 0 \\;(\\text{Ellipse}), \\quad H^2 - AB = 0 \\;(\\text{Parabola}), \\quad H^2 - AB > 0 \\;(\\text{Hyperbola})',
        coachTip: 'Remember the discriminant sign matches standard roots: negative gives bounded ellipse, zero gives parabolic transition, positive gives dual-branch hyperbola!',
      },
    ],
  },

  'calculus-sandbox': {
    simulatorId: 'calculus-sandbox',
    title: 'The Calculus Sandbox: Tangent Secants & Riemann Sums',
    category: 'Calculus',
    grade: 'Class 12',
    inspectorConfig: {
      originXRatio: 0.5,
      originYRatio: 0.7,
      scaleRangeX: 16,
      scaleRangeY: 20,
      unitName: 'units',
      customInsight: (x, y) => {
        return {
          zone: 'Calculus Function Domain',
          valueLatex: `P = (${x.toFixed(2)},\\, ${y.toFixed(2)})`,
          formulaLatex: `f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}`,
          tipText: 'The derivative at point x is the exact slope of the tangent line; the integral from a to b is the signed area under the curve!',
        };
      },
    },
    steps: [
      {
        stepNumber: 1,
        title: 'Inspect Function Curve f(x)',
        badge: 'Continuous Curve',
        instruction: 'Observe the mathematical curve f(x) graphed on Cartesian axes. The green point marks tangent evaluation point x₀. Calculus studies two fundamental operations: rate of change (derivative) and total accumulation (integral).',
        actionHint: 'Notice how the slope of the curve changes from point to point.',
        formulaLatex: 'y = f(x), \\quad \\text{Tangent Point } P = (x_0, f(x_0))',
        coachTip: 'Algebra gives you average speed over an entire trip; Calculus gives you the exact speedometer reading at any microsecond!',
      },
      {
        stepNumber: 2,
        title: 'Slide Tangent Point x₀ & Step h',
        badge: 'Operate Secant Line',
        instruction: 'Drag point x₀ horizontally along the curve to see the tangent slope dy/dx recalculate dynamically. Slide step h toward 0 to watch the secant line rotate and snap into the true tangent line.',
        actionHint: 'When h shrinks to 0, secant slope [f(x+h) - f(x)]/h approaches the instantaneous derivative f’(x).',
        formulaLatex: 'f\'(x_0) = \\lim_{h \\to 0} \\frac{f(x_0 + h) - f(x_0)}{h}',
        coachTip: 'A secant line cuts the curve at two points; as those two points merge together (h → 0), it becomes a tangent line that grazes the curve at one point!',
      },
      {
        stepNumber: 3,
        title: 'Accumulate Area with Riemann Sums',
        badge: 'Definite Integral',
        instruction: 'Toggle Integral Mode to slice the area beneath the curve into vertical rectangular Riemann strips. As strip count n increases toward infinity, the sum of rectangles converges to the exact definite integral ∫f(x)dx.',
        actionHint: 'Watch the area readout match the Fundamental Theorem of Calculus: ∫f(x)dx = F(b) - F(a).',
        formulaLatex: '\\int_a^b f(x)dx = \\lim_{n \\to \\infty} \\sum_{i=1}^n f(x_i) \\Delta x = F(b) - F(a)',
        coachTip: 'Differentiation breaks a curve into tiny slopes; Integration glues those tiny slices back together into total area. They are inverse operations!',
      },
      {
        stepNumber: 4,
        title: 'Board Exam Shortcut: Local Maxima & Minima Test',
        badge: 'First & Second Derivative',
        instruction: 'In Class 12 exams, finding max/min values: 1) Set f’(x) = 0 to find critical turning points. 2) Check f’’(x): if f’’(x) < 0, it is a local MAXIMUM (concave down); if f’’(x) > 0, it is a local MINIMUM (concave up).',
        actionHint: 'At an inflection point, f’’(x) = 0 and concavity changes direction.',
        formulaLatex: 'f\'(x) = 0, \\quad f\'\'(x) < 0 \\;(\\text{Max}), \\quad f\'\'(x) > 0 \\;(\\text{Min})',
        coachTip: 'Memory trick: Second derivative is like smiling/frowning. f’’ > 0 is positive (smiling parabola = minimum at bottom). f’’ < 0 is negative (frowning parabola = maximum at top)!',
      },
    ],
  },

  'linear-systems': {
    simulatorId: 'linear-systems',
    title: 'The Linear Crossroads: Systems of 2-Variable Equations',
    category: 'Algebra',
    grade: 'Class 10',
    inspectorConfig: {
      originXRatio: 0.5,
      originYRatio: 0.5,
      scaleRangeX: 20,
      scaleRangeY: 20,
      unitName: 'units',
      customInsight: (x, y) => {
        return {
          zone: 'Cartesian System Plane',
          valueLatex: `P = (${x.toFixed(2)},\\, ${y.toFixed(2)})`,
          formulaLatex: `a_1 x + b_1 y = c_1, \\quad a_2 x + b_2 y = c_2`,
          tipText: 'Unique intersection if slopes differ (a₁/a₂ ≠ b₁/b₂); Parallel if slopes match but intercepts differ (no solution)!',
        };
      },
    },
    steps: [
      {
        stepNumber: 1,
        title: 'Inspect the Pair of Linear Lines',
        badge: 'Two Straight Lines',
        instruction: 'Observe Line 1 (cyan) and Line 2 (purple) plotted on the Cartesian grid. Each line represents the infinite set of (x, y) pairs satisfying an equation ax + by = c.',
        actionHint: 'Notice whether the two lines intersect at a single point, stay parallel, or overlap completely.',
        formulaLatex: 'a_1 x + b_1 y = c_1, \\quad a_2 x + b_2 y = c_2',
        coachTip: 'Every linear equation is a straight line. Solving a system means finding where the two lines cross paths!',
      },
      {
        stepNumber: 2,
        title: 'Operate Slope & Intercept Sliders',
        badge: 'Adjust Slopes',
        instruction: 'Move the slope and intercept sliders for Line 1 and Line 2, or drag the control points directly on the canvas to change their trajectories in real time.',
        actionHint: 'Try setting both slopes identical to make the lines parallel.',
        formulaLatex: 'y = m_1 x + c_1, \\quad y = m_2 x + c_2',
        coachTip: 'If slopes m₁ and m₂ are different, the lines MUST intersect somewhere in the infinite plane!',
      },
      {
        stepNumber: 3,
        title: 'Track System Consistency Ratios',
        badge: 'Ratio Test',
        instruction: 'Compare the coefficient ratios: a₁/a₂, b₁/b₂, and c₁/c₂. Unique Solution occurs when a₁/a₂ ≠ b₁/b₂. No Solution (Parallel) occurs when a₁/a₂ = b₁/b₂ ≠ c₁/c₂. Infinitely Many Solutions (Coincident) occurs when all ratios are equal!',
        actionHint: 'Watch the status badge change from Unique to Parallel to Coincident.',
        formulaLatex: '\\frac{a_1}{a_2} \\neq \\frac{b_1}{b_2} \\implies \\text{Unique Solution}',
        coachTip: 'Parallel railway tracks never meet: they have the exact same steepness (equal slopes) but different starting heights!',
      },
      {
        stepNumber: 4,
        title: 'Board Exam Shortcut: Cross-Multiplication Method',
        badge: 'Exam Shortcuts',
        instruction: 'In Class 10 exams, use the cyclic cross-multiplication formula: x / (b₁c₂ - b₂c₁) = y / (c₁a₂ - c₂a₁) = 1 / (a₁b₂ - a₂b₁). Write the 2312 pattern (b, c, a, b) to solve without algebraic mistakes!',
        actionHint: 'Pattern: columns are b₁ b₂, c₁ c₂, a₁ a₂, b₁ b₂.',
        formulaLatex: 'x = \\frac{b_1 c_2 - b_2 c_1}{a_1 b_2 - a_2 b_1}, \\quad y = \\frac{c_1 a_2 - c_2 a_1}{a_1 b_2 - a_2 b_1}',
        coachTip: 'Mnemonic: "2312" - Start with 2nd coefficient (b), then 3rd (c), then 1st (a), and back to 2nd (b). Works 100% of the time!',
      },
    ],
  },

  'circle-theorems': {
    simulatorId: 'circle-theorems',
    title: 'The Tangent Guardian: Circle Theorems & Radii',
    category: 'Geometry',
    grade: 'Class 10',
    inspectorConfig: {
      originXRatio: 0.5,
      originYRatio: 0.5,
      scaleRangeX: 16,
      scaleRangeY: 16,
      unitName: 'units',
      customInsight: (x, y) => {
        const d = Math.hypot(x, y);
        const radius = 5; // standard circle radius
        return {
          zone: d < radius - 0.2 ? 'Interior Circle Region' : Math.abs(d - radius) <= 0.2 ? 'Circumference (Contact Point)' : 'Exterior Plane Region',
          valueLatex: `d = ${d.toFixed(2)}, \\quad R = ${radius.toFixed(1)}`,
          formulaLatex: `PA = PB = \\sqrt{d^2 - R^2}`,
          tipText: d > radius ? `Tangents can be drawn! Length PA = √(d² - R²) = ${Math.sqrt(Math.max(0, d * d - radius * radius)).toFixed(2)} u.` : 'Point is inside circle: zero real tangents can be drawn from interior points!',
        };
      },
    },
    steps: [
      {
        stepNumber: 1,
        title: 'Inspect Circle & External Tangents',
        badge: 'Tangent Geometry',
        instruction: 'Observe the circle with center O and external point P. Two tangent rays PA and PB graze the circle at points of contact A and B. Radii OA and OB meet the tangents at contact points.',
        actionHint: 'Notice the two right triangles ΔOPA and ΔOPB formed inside.',
        formulaLatex: 'OA \\perp PA, \\quad OB \\perp PB, \\quad \\angle OAP = \\angle OBP = 90^\\circ',
        coachTip: 'Theorem 10.1: The tangent at any point of a circle is strictly perpendicular to the radius through the point of contact!',
      },
      {
        stepNumber: 2,
        title: 'Drag External Point P',
        badge: 'Sweep Distance OP',
        instruction: 'Touch and drag point P closer to or farther from the circle. Watch the tangent lines adjust dynamically while maintaining exact 90° right angles with radii OA and OB.',
        actionHint: 'Notice that tangent lengths PA and PB remain perfectly equal no matter where P moves.',
        formulaLatex: 'PA = PB = \\sqrt{OP^2 - R^2}',
        coachTip: 'Theorem 10.2: Tangents drawn from an external point to a circle are equal in length (PA = PB). Always prove this using RHS congruence in exams!',
      },
      {
        stepNumber: 3,
        title: 'Observe Cyclic Quadrilateral PAOB',
        badge: 'Supplementary Angles',
        instruction: 'Look at quadrilateral PAOB. Because ∠OAP = 90° and ∠OBP = 90°, their sum is 180°. Therefore, the opposite angles ∠APB (between tangents) and ∠AOB (subtended at center) must also sum to 180°!',
        actionHint: 'Watch how increasing angle ∠APB forces angle ∠AOB to decrease: ∠APB + ∠AOB = 180°.',
        formulaLatex: '\\angle APB + \\angle AOB = 180^\\circ \\implies \\text{Supplementary}',
        coachTip: 'Exam gold: Whenever an exam gives you the angle between tangents (e.g. 70°), the central angle is simply 180° - 70° = 110°! No calculations required.',
      },
      {
        stepNumber: 4,
        title: 'Board Exam Shortcut: Inscribed Angle Doubling',
        badge: 'Central Angle Theorem',
        instruction: 'The angle subtended by an arc at the center of a circle is twice the angle subtended by it at any point on the remaining part of the circle: ∠AOB = 2 · ∠ACB.',
        actionHint: 'Angle in a semicircle is always a right angle (90°)!',
        formulaLatex: '\\angle AOB = 2 \\angle ACB, \\quad \\angle \\text{ in semicircle} = 90^\\circ',
        coachTip: 'If an exam diagram shows a diameter, immediately look for a triangle inscribed in that semicircle—it has a 90° angle at the perimeter!',
      },
    ],
  },

  'balance-scale-equations': {
    simulatorId: 'balance-scale-equations',
    title: 'The Balance Scale Equation Solver: Golden Rules of Algebra',
    category: 'Algebra',
    grade: 'Class 8',
    inspectorConfig: {
      originXRatio: 0.5,
      originYRatio: 0.5,
      scaleRangeX: 20,
      scaleRangeY: 16,
      unitName: 'kg',
      customInsight: (x, y) => {
        return {
          zone: x < 0 ? 'Left Pan Territory' : 'Right Pan Territory',
          valueLatex: `P = (${x.toFixed(1)},\\, ${y.toFixed(1)})`,
          formulaLatex: `\\text{Left Pan} = \\text{Right Pan}`,
          tipText: 'Whatever you add, subtract, multiply, or divide on one pan, you MUST do to the other pan to keep the beam level!',
        };
      },
    },
    steps: [
      {
        stepNumber: 1,
        title: 'Inspect the Balanced Scale Pan',
        badge: 'Equilibrium (L = R)',
        instruction: 'Observe the physical balance beam with a Left Pan and a Right Pan. The left pan holds mysterious x-boxes and number weights, while the right pan holds matching counter-weights. When weights are equal, the beam stays level.',
        actionHint: 'An algebraic equation is just a physical balance scale: the "=" sign represents the level fulcrum.',
        formulaLatex: 'ax + b = c, \\quad \\text{Left Pan} = \\text{Right Pan}',
        coachTip: 'Golden Rule of Algebra: You can do anything you want to an equation, as long as you do the EXACT SAME thing to both sides!',
      },
      {
        stepNumber: 2,
        title: 'Operate Both Sides: Remove Constant Weights',
        badge: 'Subtract Constants',
        instruction: 'Tap the subtract button to remove constant weights from both pans simultaneously. Watch both pans lighten by the exact same amount while the beam remains perfectly balanced.',
        actionHint: 'Notice how removing weights from both sides isolates the x-boxes on one pan.',
        formulaLatex: 'ax + b - b = c - b \\implies ax = c - b',
        coachTip: 'Transposing a term to the other side is just subtracting it from both pans. That is why positive terms turn negative when moving across "="!',
      },
      {
        stepNumber: 3,
        title: 'Divide by Coefficient to Isolate x',
        badge: 'Divide Equally',
        instruction: 'Once only x-boxes remain on one pan and weights on the other, divide both pans by the number of x-boxes (coefficient a). The scale reveals the exact value inside one single x-box!',
        actionHint: 'Watch 3x = 12 divide into x = 4.',
        formulaLatex: '\\frac{ax}{a} = \\frac{c - b}{a} \\implies x = \\frac{c - b}{a}',
        coachTip: 'Always eliminate additions and subtractions first, and save division of the coefficient for the very last step!',
      },
      {
        stepNumber: 4,
        title: 'Board Exam Shortcut: Cross-Check by Back-Substitution',
        badge: 'Verification Proof',
        instruction: 'Always check your answer in exams by plugging your solution x back into the original left-hand side (LHS) and confirming it equals the right-hand side (RHS).',
        actionHint: 'If LHS = RHS, your solution is 100% correct and guaranteed full marks!',
        formulaLatex: '\\text{LHS}(x) = a(x) + b = c = \\text{RHS} \\implies \\text{Verified}',
        coachTip: 'Never leave an algebra exam early without substituting your answer back. It takes 10 seconds and prevents silly calculation blunders!',
      },
    ],
  },
};

// Universal fallback generator for any simulator not explicitly overridden above
export function getSimulatorGuide(simulatorId: SimulatorId): SimulatorGuideData {
  if (SIMULATOR_STEPS_DATA[simulatorId]) {
    return SIMULATOR_STEPS_DATA[simulatorId]!;
  }

  // Derive high-quality fallback from standard simulator ID
  const humanTitle = simulatorId
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return {
    simulatorId,
    title: humanTitle,
    category: 'Interactive Mathematics',
    grade: 'Class 8-12',
    inspectorConfig: {
      originXRatio: 0.5,
      originYRatio: 0.5,
      scaleRangeX: 20,
      scaleRangeY: 20,
      unitName: 'units',
      customInsight: (x, y) => {
        const d = Math.hypot(x, y);
        const theta = ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
        return {
          zone: x >= 0 && y >= 0 ? '\\text{Quadrant I: } x \\ge 0, y \\ge 0' : x < 0 && y >= 0 ? '\\text{Quadrant II: } x < 0, y \\ge 0' : x < 0 && y < 0 ? '\\text{Quadrant III: } x < 0, y < 0' : '\\text{Quadrant IV: } x \\ge 0, y < 0',
          valueLatex: `(x, y) = (${x.toFixed(2)}, ${y.toFixed(2)}), \\quad r = ${d.toFixed(2)}, \\quad \\theta = ${theta.toFixed(1)}^\\circ`,
          formulaLatex: 'r = \\sqrt{x^2 + y^2}, \\quad \\theta = \\operatorname{atan2}(y, x)',
          tipText: 'Touch or drag interactive elements on canvas or adjust cockpit sliders to observe dynamic mathematical recalculation in pure LaTeX!',
        };
      },
    },
    steps: [
      {
        stepNumber: 1,
        title: 'Inspect Initial Setup & Variables',
        badge: 'Ground Truth',
        instruction: `Observe the mathematical workspace for ${humanTitle}. The axes, curves, geometric shapes, and initial parameters represent the fundamental mathematical ground truth of the concept.`,
        actionHint: 'Notice how the mathematical coordinates and parameters are visually mapped.',
        formulaLatex: '\\text{Parameters: } \\alpha, \\beta, x, y, \\quad f(x)',
        coachTip: 'Always identify what the axes, colors, and symbols represent before beginning your experiment!',
      },
      {
        stepNumber: 2,
        title: 'Operate Interactive Canvas & Sliders',
        badge: 'Hands-On Controls',
        instruction: 'Touch and drag interactive nodes, vertices, or vectors directly on the canvas, or adjust the sliders in the left cockpit to vary key parameters in real time.',
        actionHint: 'Watch how numerical readouts update instantaneously as you interact.',
        formulaLatex: '\\Delta x, \\quad \\Delta y, \\quad \\theta \\in [0, 2\\pi]',
        coachTip: 'Do not be afraid to test extreme values (zeros, negatives, large numbers) to see how the mathematics responds!',
      },
      {
        stepNumber: 3,
        title: 'Observe Dynamic Mathematical Reactions',
        badge: 'Cause & Effect',
        instruction: 'Witness how changing one parameter triggers exact geometric and algebraic reactions across the simulation. Observe invariant properties (e.g. constant sums, angle relations, conservation of energy or area).',
        actionHint: 'Look at the live mathematical badges and formulas updating in real time.',
        formulaLatex: 'E = \\text{constant}, \\quad \\sum \\theta_i = 180^\\circ',
        coachTip: 'Mathematics is about finding what stays INVARIANT when everything else changes!',
      },
      {
        stepNumber: 4,
        title: 'Board Exam Mastery & Intuition Shortcut',
        badge: 'Exam Shortcuts',
        instruction: 'Translate visual intuition into high-scoring exam solutions. Connect what you observed on canvas directly to standard formulas, step-by-step proofs, and time-saving shortcuts.',
        actionHint: 'Open the Theory tab or Missions in the cockpit to practice real past-year exam questions.',
        formulaLatex: '\\text{Solution Steps: 1) State Given } \\implies 2) \\text{Apply Theorem } \\implies 3) \\text{Conclude}',
        coachTip: "Alka Ma'am's Advice: When solving on paper, draw a quick sketch like this simulation. Examiners award partial marks immediately for accurate geometric sketches!",
      },
    ],
  };
}
