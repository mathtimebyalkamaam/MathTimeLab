import { SimulatorGuide } from '../../types/simulatorGuides';

export const CLASS_9_GUIDES: Record<string, SimulatorGuide> = {
  'drone-navigator': {
    simulatorId: 'drone-navigator',
    h1Heading: 'Drone Navigator: Coordinate Geometry & Distance Formula Simulator',
    introduction: 'Pilot a delivery drone across a Cartesian coordinate airspace. Drag coordinates (x₁, y₁) and (x₂, y₂) to watch the right-angled displacement triangle form, bypass radial circular No-Fly Zones, and derive the universal distance formula directly from the Pythagorean theorem.',
    learningObjectives: [
      'Understand Cartesian coordinates (x, y) as directed horizontal and vertical displacements from origin.',
      'Derive the distance formula d = √((x₂ - x₁)² + (y₂ - y₁)²) from the Pythagorean hypotenuse theorem.',
      'Prove collinearity of 3 spatial points using the segment sum condition AB + BC = AC.',
      'Model circular No-Fly Zone obstacle boundaries using the radial inequality √(x² + y²) < R.'
    ],
    mathematicalPrinciples: [
      {
        title: 'Euclidean Distance Formula',
        description: 'The distance between points P(x₁, y₁) and Q(x₂, y₂) is the hypotenuse of a right triangle with legs |Δx| and |Δy|.',
        formulaLatex: 'd(P, Q) = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2} = \\sqrt{(\\Delta x)^2 + (\\Delta y)^2}'
      },
      {
        title: 'Collinearity Condition',
        description: 'Three points A, B, and C lie on a single straight line if and only if the sum of lengths of the two smaller segments equals the longest segment.',
        formulaLatex: 'A, B, C \\text{ collinear} \\iff AB + BC = AC'
      }
    ],
    controlsGuide: [
      {
        name: 'Drone Position Coordinate Sliders (droneX, droneY)',
        type: 'slider',
        description: 'Adjusts current drone flight position between -10 and +10 on both axes.',
        effect: 'Renders the live drone avatar and updates distance readouts from base and target.'
      },
      {
        name: 'Target Delivery Destination (targetX, targetY)',
        type: 'slider',
        description: 'Sets the drop-off coordinate location on the grid.',
        effect: 'Re-anchors the direct flight line of sight and recomputes total path length.'
      },
      {
        name: 'Show Right Triangle Helper Toggle',
        type: 'toggle',
        description: 'Draws horizontal leg Δx (blue) and vertical leg Δy (emerald) with right-angle marker.',
        effect: 'Visually exposes the Pythagorean right triangle underpinning the distance calculation.'
      },
      {
        name: 'No-Fly Zone Obstacle Avoidance Toggle',
        type: 'toggle',
        description: 'Renders circular red radar zones centered at designated coordinates.',
        effect: 'Triggers visual proximity warning alarms if the flight path intersects the circle boundary.'
      }
    ],
    stepByStepInstructions: [
      'Set Base at (0, 0) and drag Drone to (3, 4).',
      'Toggle "Show Right Triangle": observe horizontal width Δx = 3 and vertical height Δy = 4.',
      'Inspect the calculation badge: d = √(3² + 4²) = √(9 + 16) = √25 = 5.0 units.',
      'Drag target to (6, 8) and observe how the 3-4-5 right triangle scales uniformly to 6-8-10.',
      'Fly the drone near a red No-Fly Zone to observe the radial distance calculation triggering an airspace breach warning.'
    ],
    expectedOutput: 'An interactive 2D coordinate grid displays the drone icon, base landing pad, dashed hypotenuse flight trajectory, and color-coded displacement legs with dynamic live LaTeX readouts.',
    realWorldApplication: {
      domain: 'Autonomous Aerial Robotics & Air Traffic Control',
      title: 'Waypoint Navigation & Geofence Collision Avoidance',
      scenario: 'Autonomous delivery drones compute Euclidean distance vectors between GPS waypoint coordinates in 50-millisecond flight control loops.',
      mathematicalConnection: 'Geofencing systems continuously evaluate √( (x_drone - x_tower)² + (y_drone - y_tower)² ) ≥ R_safe to guarantee safe standoff distances from power lines and airport corridors.'
    }
  },

  'circle-theorems': {
    simulatorId: 'circle-theorems',
    h1Heading: 'Circle Theorems & Tangent Guardian Interactive Lab',
    introduction: 'Investigate fundamental circle theorems in an interactive Euclidean sandbox. Drag points along the circumference to prove that the angle subtended by an arc at the center is double the angle at the circumference, angles in the same segment are equal, and tangent lines are perpendicular to the radius.',
    learningObjectives: [
      'Prove that the angle subtended at the center is double the angle at the circumference: ∠AOB = 2∠APB.',
      'Verify that angles in the same segment subtended by the same chord are congruent.',
      'Confirm that the angle inscribed in a semicircle is strictly 90° (Thales’ Theorem).',
      'Prove that a tangent line is perpendicular to the radius at the point of contact (∠OPT = 90°).'
    ],
    mathematicalPrinciples: [
      {
        title: 'Central Angle Theorem',
        description: 'An arc subtends an angle at the center of a circle that is exactly twice the angle it subtends at any point on the remaining part of the circumference.',
        formulaLatex: '\\angle AOB = 2 \\times \\angle APB'
      },
      {
        title: 'Angle in a Semicircle',
        description: 'If segment AB is a diameter passing through center O, then for any point P on the circle, triangle APB is a right-angled triangle.',
        formulaLatex: 'AB = 2r \\implies \\angle APB = 90^\\circ'
      },
      {
        title: 'Radius-Tangent Orthogonality',
        description: 'The tangent at any point P of a circle is perpendicular to the radius OP through the point of contact.',
        formulaLatex: 'OP \\perp PT \\implies \\angle OPT = 90^\\circ'
      }
    ],
    controlsGuide: [
      {
        name: 'Circumference Anchor Point P Drag Handle',
        type: 'drag',
        description: 'Slides point P smoothly along the circular boundary arc.',
        effect: 'Updates angle ∠APB in real time while maintaining constant chord endpoints A and B.'
      },
      {
        name: 'Chord Endpoints A & B Drag Handles',
        type: 'drag',
        description: 'Adjusts the subtending circular arc length and central angle.',
        effect: 'Scales the central angle ∠AOB and updates all inscribed angle ratios.'
      },
      {
        name: 'Theorem Mode Switcher',
        type: 'button',
        description: 'Switches between Central Angle, Same Segment, Semicircle 90°, and Tangent Perpendicularity.',
        effect: 'Configures visual ray lines and angle arc overlays for the targeted theorem.'
      }
    ],
    stepByStepInstructions: [
      'Select "Central Angle Theorem" mode with chord AB spanning a 120° arc at center O.',
      'Observe central angle ∠AOB = 120° and circumference angle ∠APB = 60°.',
      'Drag point P anywhere along the major arc: observe that ∠APB stays locked at 60.0° regardless of where P moves!',
      'Switch to "Semicircle Mode": drag AB so it passes through center O as a diameter.',
      'Watch ∠APB snap to exactly 90.0°, confirming Thales’ Semicircle Theorem.'
    ],
    expectedOutput: 'A high-precision vector circle with dynamic colored ray lines, central and inscribed angle measurement arcs, and an invariant theorem verification panel displaying the 2:1 angle ratio live.',
    realWorldApplication: {
      domain: 'Marine Navigation & Celestial Piloting',
      title: 'Danger Angles and Navigational Horizontal Sextant Angles',
      scenario: 'Ships navigating shallow shoals use horizontal sextant angles between two coastal lighthouses A and B to maintain safe clearance.',
      mathematicalConnection: 'By the Same Segment Theorem, a ship keeping a constant sextant angle ∠APB traverses a circular arc, guaranteeing it never drifts into shallow water inside the circle.'
    }
  },

  'heron-triangles': {
    simulatorId: 'heron-triangles',
    h1Heading: "The Heron Surveyor: Triangle Area & Heron's Formula Lab",
    introduction: "Calculate and visualize the area of any scalene triangle using only its 3 side lengths (a, b, c) without requiring perpendicular heights. Drag triangle vertices to explore semi-perimeter s, inspect the four radical factors s(s - a)(s - b)(s - c), and test the limits of the Triangle Inequality.",
    learningObjectives: [
      "Master Heron's Formula for triangle area: Area = √(s(s - a)(s - b)(s - c)).",
      'Calculate the semi-perimeter: s = (a + b + c) / 2.',
      'Understand why the Triangle Inequality (a + b > c) is necessary for a real triangle to exist.',
      'Observe degenerate triangles with zero area when a + b = c (flat line).'
    ],
    mathematicalPrinciples: [
      {
        title: "Heron's Area Formula",
        description: 'Gives the exact area of a triangle given side lengths a, b, and c with semi-perimeter s.',
        formulaLatex: 'A = \\sqrt{s(s - a)(s - b)(s - c)}, \\quad s = \\frac{a + b + c}{2}'
      },
      {
        title: 'Triangle Inequality Condition',
        description: 'The sum of the lengths of any two sides of a triangle must be strictly greater than the length of the third side.',
        formulaLatex: 'a + b > c, \\quad b + c > a, \\quad c + a > b'
      }
    ],
    controlsGuide: [
      {
        name: 'Side Length Sliders (a, b, c)',
        type: 'slider',
        description: 'Independently controls the lengths of the three triangle sides.',
        effect: 'Updates triangle geometry, semi-perimeter s, and area in real time.'
      },
      {
        name: 'Vertex Drag Handles',
        type: 'drag',
        description: 'Directly reposition triangle vertices on the 2D coordinate plane.',
        effect: 'Recomputes side lengths via distance formula and recalculates area.'
      },
      {
        name: 'Radical Factors Inspector Card',
        type: 'toggle',
        description: 'Displays the 4 intermediate terms: s, (s - a), (s - b), and (s - c).',
        effect: 'Allows students to verify the multiplication step before the square root.'
      }
    ],
    stepByStepInstructions: [
      'Set side lengths to a = 13 cm, b = 14 cm, and c = 15 cm.',
      'Observe the semi-perimeter calculation: s = (13 + 14 + 15) / 2 = 42 / 2 = 21 cm.',
      'Inspect the four radical factors: s = 21, (s - a) = 8, (s - b) = 7, (s - c) = 6.',
      'Observe the radicand: 21 × 8 × 7 × 6 = 7056.',
      'Verify the square root: Area = √7056 = 84.0 cm².',
      'Drag side c to 27 cm (where a + b = 13 + 14 = 27): observe the triangle flatten to a line with Area = 0 cm².'
    ],
    expectedOutput: 'A clean scalene triangle rendered with side dimension labels, color-coded interior area fill, and a live step-by-step arithmetic box breaking down the four radical factors.',
    realWorldApplication: {
      domain: 'Civil Surveying & GIS Land Cadastre',
      title: 'Irregular Land Parcel Area Measurement',
      scenario: 'Land surveyors surveying irregular agricultural fields divide multi-sided plots into contiguous triangles and measure boundary fence lengths with laser rangefinders.',
      mathematicalConnection: "Heron's formula allows computing exact land acreage from perimeter measurements alone without erecting expensive perpendicular altitude poles in the field."
    }
  },

  'polynomial-factorizer': {
    simulatorId: 'polynomial-factorizer',
    h1Heading: 'Geometric Polynomial Factorizer & Middle-Term Splitting Lab',
    introduction: 'Factor quadratic polynomials ax² + bx + c by arranging them into seamless geometric rectangles. Witness how the algebraic method of middle-term splitting corresponds directly to decomposing the cross-term rectangle into two modular areas that complete a grand rectangle of dimensions (px + q)(rx + s).',
    learningObjectives: [
      'Factor quadratic trinomials of the form ax² + bx + c into linear binomial factors.',
      'Master the ac-product splitting technique: find two numbers that multiply to a · c and sum to b.',
      'Connect algebraic factoring with 2D geometric rectangle dimensions: Area = Length × Width.',
      'Identify irreducible (prime) quadratics that cannot form complete rectangular tile arrangements.'
    ],
    mathematicalPrinciples: [
      {
        title: 'Middle-Term Splitting Method',
        description: 'To factor ax² + bx + c, find factors p and q such that p · q = ac and p + q = b, then group terms.',
        formulaLatex: 'ax^2 + bx + c = ax^2 + px + qx + c = (mx + n)(kx + l)'
      },
      {
        title: 'Factor Theorem',
        description: 'A linear polynomial (x - α) is a factor of polynomial P(x) if and only if P(α) = 0.',
        formulaLatex: 'P(\\alpha) = 0 \\iff (x - \\alpha) \\mid P(x)'
      }
    ],
    controlsGuide: [
      {
        name: 'Coefficient a, b, c Sliders',
        type: 'slider',
        description: 'Adjusts coefficients in ax² + bx + c.',
        effect: 'Reconfigures the quadratic expression and updates the tile quantity on canvas.'
      },
      {
        name: 'Tile Assembly Animation Button',
        type: 'button',
        description: 'Animates individual x² tiles, x bars, and unit tiles snapping into a single rectangle.',
        effect: 'Visually reveals the binomial side lengths (Length and Width).'
      },
      {
        name: 'ac Factor Table Inspector',
        type: 'toggle',
        description: 'Displays all integer factor pairs of ac and their algebraic sum.',
        effect: 'Highlights the winning pair that matches coefficient b.'
      }
    ],
    stepByStepInstructions: [
      'Set quadratic coefficients to a = 1, b = 5, c = 6 for polynomial x² + 5x + 6.',
      'Inspect the ac factor table: product ac = 1 × 6 = 6. Factor pairs: (1, 6) and (2, 3).',
      'Select winning pair (2, 3) because 2 + 3 = 5 (the middle term).',
      'Split the middle term: x² + 2x + 3x + 6 = x(x + 2) + 3(x + 2) = (x + 2)(x + 3).',
      'Click "Assemble Tiles": watch one large x² square, 5 x-bars, and 6 unit tiles form a rectangle of length (x + 3) and height (x + 2).'
    ],
    expectedOutput: 'Color-coded tiles—x² squares (blue), x strips (green), and 1-units (yellow)—assemble into a continuous rectangular mosaic with perimeter dimensions labeled clearly.',
    realWorldApplication: {
      domain: 'Computer Vision & 3D Spatial Partitioning',
      title: 'Bounding Volume Hierarchies (BVH) in Video Game Engines',
      scenario: 'Game engines like Unreal Engine and Unity compute collision detection between 3D player meshes and game environments.',
      mathematicalConnection: 'Factoring polynomial bounding volumes simplifies complex polygonal collision tests into fast 1D interval overlap checks along coordinate axes.'
    }
  },

  'lines-angles': {
    simulatorId: 'lines-angles',
    h1Heading: 'Parallel Lines, Transversals & The Angle Detective Lab',
    introduction: 'Crack geometric angle puzzles formed when a transversal intersects two parallel lines. Scrub transversal inclination and intercept positions to observe corresponding angles, alternate interior angles, and consecutive interior angle pairs updating in synchronized harmony.',
    learningObjectives: [
      'Identify the 8 distinct angles formed by a transversal intersecting two parallel lines.',
      'Verify that Corresponding Angles are equal (F-angle property).',
      'Verify that Alternate Interior Angles are equal (Z-angle property).',
      'Confirm that Consecutive Interior Angles are supplementary (sum to 180°, C-angle property).',
      'Understand the Converse Theorems: proving lines are parallel from angle equality.'
    ],
    mathematicalPrinciples: [
      {
        title: 'Alternate Interior Angles Theorem',
        description: 'If two parallel lines are cut by a transversal, the alternate interior angles are congruent.',
        formulaLatex: 'l_1 \\parallel l_2 \\implies \\angle 3 = \\angle 5, \\quad \\angle 4 = \\angle 6'
      },
      {
        title: 'Consecutive Interior Angles Theorem',
        description: 'If two parallel lines are cut by a transversal, consecutive interior angles on the same side are supplementary.',
        formulaLatex: 'l_1 \\parallel l_2 \\implies \\angle 4 + \\angle 5 = 180^\\circ, \\quad \\angle 3 + \\angle 6 = 180^\\circ'
      }
    ],
    controlsGuide: [
      {
        name: 'Transversal Angle (θ) Slider',
        type: 'slider',
        description: 'Rotates the intersecting transversal line from 20° to 160°.',
        effect: 'Updates all 8 angle arc measurements and degree readouts simultaneously.'
      },
      {
        name: 'Parallel Line Spacing Slider',
        type: 'slider',
        description: 'Adjusts the vertical separation distance between lines l₁ and l₂.',
        effect: 'Translates line l₂ vertically while preserving rigid parallelism.'
      },
      {
        name: 'Angle Relationship Filter Buttons',
        type: 'button',
        description: 'Highlights specific angle families: Alternate Interior (Z), Corresponding (F), or Co-Interior (C).',
        effect: 'Dims unrelated angles and colors the active relationship pair in high-contrast neon.'
      }
    ],
    stepByStepInstructions: [
      'Set transversal angle θ = 65°.',
      'Inspect acute angle ∠1 = 65° and adjacent obtuse angle ∠2 = 180° - 65° = 115° (Linear Pair).',
      'Click the "Alternate Interior" filter: observe the Z-pattern highlight ∠4 = 65° and ∠6 = 65°.',
      'Click the "Co-Interior" filter: inspect the C-pattern showing ∠4 (65°) + ∠5 (115°) = 180°.',
      'Rotate the transversal to 90°: observe all 8 angles become equal to 90° (perpendicular transversal).'
    ],
    expectedOutput: 'Two bold parallel lines cut by a glowing transversal line. Synchronized angle arcs glow in matching colors (cyan for acute, magenta for obtuse) with live degree labels and equality badges.',
    realWorldApplication: {
      domain: 'Civil Infrastructure & Railway Engineering',
      title: 'Railroad Switch & Crossover Alignment',
      scenario: 'Civil engineers designing high-speed railway switch tracks ensure crossover rails intersect parallel mainline tracks at precise angles.',
      mathematicalConnection: 'Parallel track geometry mandates alternate interior angle alignment to eliminate centrifugal derailment forces as trains cross between parallel rails.'
    }
  },

  'surface-area-volumes': {
    simulatorId: 'surface-area-volumes',
    h1Heading: 'The 3D Solid Unfolder: Surface Area, Volumes & Net Geometry',
    introduction: 'Unfold 3D geometric solids—Cylinder, Cone, Sphere, Cuboid, and Hemisphere—into flat 2D net patterns. Scrub dimensions to visualize lateral vs total surface area formulas and watch water filling animations demonstrate 3D volume capacities.',
    learningObjectives: [
      'Visualize 3D surface area as the sum of 2D polygonal and curved nets.',
      'Derive the curved surface area of a cylinder (2πrh) from an unfolded rectangle of length 2πr and height h.',
      'Understand the relationship between slant height l and vertical height h in a cone: l = √(r² + h²).',
      'Compare volumetric capacities: a cone holds exactly 1/3 the volume of an identical-dimension cylinder.'
    ],
    mathematicalPrinciples: [
      {
        title: 'Cylinder Formulas',
        description: 'Curved Surface Area is 2πrh; Total Surface Area includes two circular bases; Volume is base area times height.',
        formulaLatex: 'CSA = 2\\pi rh, \\quad TSA = 2\\pi r(r + h), \\quad V = \\pi r^2 h'
      },
      {
        title: 'Cone Formulas',
        description: 'Slant height l = √(r² + h²); Curved Surface Area is πrl; Volume is one-third of the enclosing cylinder.',
        formulaLatex: 'l = \\sqrt{r^2 + h^2}, \\quad CSA = \\pi rl, \\quad V = \\frac{1}{3}\\pi r^2 h'
      },
      {
        title: 'Sphere Formulas',
        description: 'Surface area equals exactly 4 circular great circle areas; Volume is (4/3)πr³.',
        formulaLatex: 'SA = 4\\pi r^2, \\quad V = \\frac{4}{3}\\pi r^3'
      }
    ],
    controlsGuide: [
      {
        name: '3D Solid Selector Tabs',
        type: 'button',
        description: 'Switches between Cylinder, Cone, Sphere, Cuboid, and Hemisphere.',
        effect: 'Loads the chosen solid with corresponding dimensional controls and formulas.'
      },
      {
        name: 'Unfold Net Slider (0% to 100%)',
        type: 'slider',
        description: 'Peels open the 3D solid into its 2D flat planar net.',
        effect: 'Shows how 3D curved surfaces unfold into 2D rectangles and circular sectors.'
      },
      {
        name: 'Radius (r) & Height (h) Sliders',
        type: 'slider',
        description: 'Adjusts dimensions from 1 cm to 15 cm.',
        effect: 'Resizes the 3D mesh and updates CSA, TSA, and Volume calculations live.'
      },
      {
        name: 'Liquid Volume Fill Toggle',
        type: 'toggle',
        description: 'Animates fluid filling the solid from bottom to top.',
        effect: 'Visually reinforces the concept of internal capacity in cubic units.'
      }
    ],
    stepByStepInstructions: [
      'Select the Cylinder solid with radius r = 3 cm and height h = 7 cm.',
      'Drag the "Unfold Net" slider to 100%: observe the curved face unfold into a rectangle of width 2πr = 18.85 cm and height 7 cm.',
      'Verify Curved Surface Area: CSA = 18.85 × 7 = 131.95 cm².',
      'Switch to the Cone solid with r = 3 cm and h = 4 cm: observe slant height l = √(3² + 4²) = 5 cm.',
      'Compare volumes: observe cylinder volume V = π(3²)(7) = 197.9 cm³, while an equal-base cone holds exactly 1/3.'
    ],
    expectedOutput: 'A high-end 3D WebGL mesh that rotates smoothly and unfolds gracefully into flat 2D net patterns. Dynamic text callouts label radii, heights, and surface area components in KaTeX.',
    realWorldApplication: {
      domain: 'Industrial Packaging & Beverage Can Manufacturing',
      title: 'Sheet Metal Minimization in Beverage Can Design',
      scenario: 'Beverage corporations manufacture billions of aluminum soda cans holding a standardized 330 mL volume.',
      mathematicalConnection: 'Engineers use surface area calculus to design the optimal ratio h = 2r that minimizes aluminum sheet usage per can, saving millions of kilograms of metal annually.'
    }
  },

  'circle-chords-cyclic': {
    simulatorId: 'circle-chords-cyclic',
    h1Heading: 'Circle Chords, Perpendicular Bisectors & Cyclic Quadrilaterals Lab',
    introduction: 'Explore the internal architecture of circle chords and inscribed cyclic quadrilaterals. Drag chord endpoints to verify that the perpendicular from the center bisects the chord, equal chords are equidistant from the center, and opposite angles of a cyclic quadrilateral always sum to 180°.',
    learningObjectives: [
      'Prove that the perpendicular from the center of a circle to a chord bisects the chord.',
      'Verify that equal chords are equidistant from the center (and vice versa).',
      'Discover that opposite angles of an inscribed cyclic quadrilateral are supplementary: ∠A + ∠C = 180°.',
      'Explore Ptolemy’s Theorem relating cyclic quadrilateral diagonals and opposite side products.'
    ],
    mathematicalPrinciples: [
      {
        title: 'Chord Perpendicular Bisector Theorem',
        description: 'The line drawn through the center of a circle to bisect a chord is perpendicular to the chord.',
        formulaLatex: 'M \\text{ midpoint of } AB \\implies OM \\perp AB, \\quad AM = MB = \\sqrt{r^2 - OM^2}'
      },
      {
        title: 'Cyclic Quadrilateral Theorem',
        description: 'The sum of either pair of opposite angles of a cyclic quadrilateral inscribed in a circle is 180°.',
        formulaLatex: '\\angle A + \\angle C = 180^\\circ, \\quad \\angle B + \\angle D = 180^\\circ'
      }
    ],
    controlsGuide: [
      {
        name: 'Chord Length / Position Drag Handles',
        type: 'drag',
        description: 'Adjusts chord endpoints A and B on the circumference.',
        effect: 'Updates chord length and distance OM from the circle center.'
      },
      {
        name: 'Cyclic Quadrilateral Mode Toggle',
        type: 'button',
        description: 'Adds vertices C and D on the circumference to form an inscribed 4-sided polygon.',
        effect: 'Activates live opposite angle sum trackers: (∠A + ∠C) and (∠B + ∠D).'
      },
      {
        name: 'Show Right Triangle OMA Toggle',
        type: 'toggle',
        description: 'Draws radius OA, distance OM, and half-chord AM.',
        effect: 'Demonstrates the Pythagorean relation r² = OM² + (AB/2)².'
      }
    ],
    stepByStepInstructions: [
      'Set circle radius r = 5 cm and drag chord AB so its length is 8 cm.',
      'Observe midpoint M: half-chord AM = 4 cm.',
      'Inspect perpendicular distance OM: using Pythagoras, OM = √(5² - 4²) = √(25 - 16) = √9 = 3 cm.',
      'Switch to "Cyclic Quadrilateral" mode: drag vertices A, B, C, D to any positions on the circle.',
      'Observe the live angle readouts: regardless of vertex dragging, ∠A + ∠C stays locked at exactly 180.0°!'
    ],
    expectedOutput: 'An interactive vector circle displaying the chord, center O, perpendicular segment OM, and optional 4-sided cyclic polygon with opposite angle highlight halos confirming the 180° invariant.',
    realWorldApplication: {
      domain: 'Aerospace Radar & Radio Triangulation',
      title: 'Circular Omnidirectional Antenna Array Positioning',
      scenario: 'Radio navigation stations use circular phased-antenna arrays to locate distressed aircraft signals.',
      mathematicalConnection: 'Perpendicular chord bisectors intersecting at the unique circle center allow radio towers to pinpoint transmitter origins from multiple direction-of-arrival chords.'
    }
  },

  'statistics-visualizer': {
    simulatorId: 'statistics-visualizer',
    h1Heading: 'The Data Fulcrum: Mean, Median, Mode & Outlier Seesaw Lab',
    introduction: 'Master central tendency and data dispersion on a physical seesaw balance beam. Place data weights along a number line to feel the Mean as the physical center of gravity, the Median as the middle count divider, and the Mode as the tallest weight stack while testing how extreme outliers pull the mean.',
    learningObjectives: [
      'Define Mean as the balance point (center of gravity) where total left torque equals total right torque.',
      'Define Median as the physical 50th percentile divider splitting sorted data points into equal counts.',
      'Define Mode as the most frequently occurring value (highest frequency tower).',
      'Understand the outlier trap: why extreme data points distort the Mean while the Median remains robust.'
    ],
    mathematicalPrinciples: [
      {
        title: 'Arithmetic Mean Balance Property',
        description: 'The sum of algebraic deviations of all data values from their arithmetic mean is strictly zero.',
        formulaLatex: '\\bar{x} = \\frac{\\sum x_i}{N}, \\quad \\sum_{i=1}^N (x_i - \\bar{x}) = 0'
      },
      {
        title: 'Median Formulation',
        description: 'For sorted values, the median is the value at index (N + 1)/2 for odd N, or the mean of N/2 and (N/2 + 1) for even N.',
        formulaLatex: '\\text{Median} = \\begin{cases} x_{(N+1)/2} & N \\text{ odd} \\\\ \\frac{x_{N/2} + x_{N/2+1}}{2} & N \\text{ even} \\end{cases}'
      }
    ],
    controlsGuide: [
      {
        name: 'Click-to-Place Data Weights',
        type: 'drag',
        description: 'Click anywhere along the number line beam to drop a 1-unit brass weight.',
        effect: 'Updates the dataset, recalculates Mean, Median, Mode, and shifts the physical seesaw balance.'
      },
      {
        name: 'Outlier Drag Handle',
        type: 'drag',
        description: 'Pulls a designated outlier weight far out to the extreme right edge (e.g. from 10 to 100).',
        effect: 'Dramatically shifts the Mean while leaving the Median virtually unchanged.'
      },
      {
        name: 'Preset Distribution Buttons',
        type: 'button',
        description: 'Loads classic datasets: Symmetric Bell Curve, Right-Skewed (Income), Bimodal, and Uniform.',
        effect: 'Illustrates how distribution shape governs the relationship between Mean, Median, and Mode.'
      }
    ],
    stepByStepInstructions: [
      'Place data points at 2, 4, 6, 8, and 10.',
      'Observe the symmetric distribution: Mean = 6, Median = 6, with fulcrum centered at 6.',
      'Add an extreme outlier weight at 30.',
      'Watch the Mean jump from 6 to 10 to balance the torque, while the Median moves only slightly to 7.',
      'Inspect the torque gauge: verify that the sum of negative deviations equals the sum of positive deviations: Σ(x - Mean) = 0.'
    ],
    expectedOutput: 'An animated seesaw beam resting on a movable triangular fulcrum representing the Mean. Vertical dashed lines mark the Median (amber) and Mode (indigo), tilting dynamically when unbalanced.',
    realWorldApplication: {
      domain: 'Socioeconomic Economics & Salary Analytics',
      title: 'National Household Income & Wage Reporting',
      scenario: 'Economists reporting national living standards evaluate average wages across millions of citizens including billionaires.',
      mathematicalConnection: 'A handful of multi-billionaires skew the Mean wage artificially high; national statistical bureaus therefore mandate reporting the Median income as the true benchmark of typical citizen prosperity.'
    }
  },

  'euclidean-geometry-sandbox': {
    simulatorId: 'euclidean-geometry-sandbox',
    h1Heading: "Euclid's Axioms & Non-Euclidean Geometry Sandbox",
    introduction: "Investigate Euclid's 5 Postulates and explore what happens to geometry when the famous 5th Parallel Postulate is bent. Contrast flat Euclidean space (triangle sum = 180°) against Spherical space (triangle sum > 180°, zero parallel lines) and Hyperbolic saddle space (triangle sum < 180°, infinite parallel lines).",
    learningObjectives: [
      "Master Euclid's 5 Postulates of flat plane geometry, focusing on the 5th (Parallel) Postulate.",
      'Prove why Playfair’s Axiom implies through a point not on a line, exactly one parallel line exists.',
      'Experience Elliptic (Spherical) geometry: great circle lines always intersect (triangle angle sum > 180°).',
      'Experience Hyperbolic geometry: saddle curvature allows infinite parallel lines (triangle angle sum < 180°).'
    ],
    mathematicalPrinciples: [
      {
        title: "Euclid's Fifth (Parallel) Postulate",
        description: 'If a straight line falling on two straight lines makes the interior angles on the same side less than two right angles, the two lines intersect on that side.',
        formulaLatex: '\\alpha + \\beta < 180^\\circ \\implies \\text{Lines intersect on that side}'
      },
      {
        title: 'Curvature & Triangle Angle Sum',
        description: 'The sum of interior angles of a triangle depends directly on Gaussian curvature K: Flat (K=0) gives 180°, Spherical (K>0) gives >180°, Hyperbolic (K<0) gives <180°.',
        formulaLatex: '\\sum \\angle = 180^\\circ + \\iint K \\, dA'
      }
    ],
    controlsGuide: [
      {
        name: 'Universe Curvature Selector',
        type: 'button',
        description: 'Switches geometric manifold between Flat Euclidean, Spherical (Globe), and Hyperbolic (Poincaré Disk).',
        effect: 'Reconfigures the visual metric space and changes geodesic line trajectories.'
      },
      {
        name: 'Triangle Vertex Drag Handles',
        type: 'drag',
        description: 'Reposition the 3 vertices of a geometric triangle across the curved manifold.',
        effect: 'Recomputes geodesic curve sides and dynamically sums interior angles.'
      },
      {
        name: 'Parallel Line Emitter Tool',
        type: 'slider',
        description: 'Draws lines through a point external to a reference line.',
        effect: 'Visually tests how many non-intersecting parallel lines can be constructed.'
      }
    ],
    stepByStepInstructions: [
      'Start in Flat Euclidean mode: drag triangle vertices and observe the interior sum stays strictly at 180°.',
      'Switch to Spherical Geometry (Earth globe surface).',
      'Construct a triangle with one vertex at the North Pole and two on the Equator separated by 90° longitude.',
      'Observe 3 right angles: 90° + 90° + 90° = 270° > 180°! The spherical excess proves curvature.',
      'Switch to Hyperbolic mode: observe the triangle’s sides curve inward, yielding an angle sum of only 135° < 180°.'
    ],
    expectedOutput: 'An interactive 3D globe and Poincaré hyperbolic disk display geodesic light-ray paths. Dynamic angle sum meters indicate whether the space is flat (0° excess), positively curved, or negatively curved.',
    realWorldApplication: {
      domain: 'Astrophysics & Einstein’s General Relativity',
      title: 'Gravitational Lensing & Spacetime Curvature',
      scenario: 'Astronomers observing light passing massive galaxies notice straight light beams bending around massive stars.',
      mathematicalConnection: 'Einstein’s General Relativity models gravity not as a force, but as non-Euclidean Riemannian spacetime curvature where massive objects bend the geodesics that light travels along.'
    }
  },

  'triangle-congruence-forge': {
    simulatorId: 'triangle-congruence-forge',
    h1Heading: 'Triangle Congruence Criteria Forge (SAS, SSS, ASA, AAS, RHS)',
    introduction: 'Test and prove the 5 rigid criteria that guarantee two triangles are identical in shape and size: SAS, SSS, ASA, AAS, and RHS. Experience the famous SSA Ambiguous Case trap, demonstrating why two sides and a non-included angle can create two completely different triangles.',
    learningObjectives: [
      'Master the 5 rigid triangle congruence criteria: SSS, SAS, ASA, AAS, and RHS.',
      'Understand why AAA (Angle-Angle-Angle) proves similarity but NOT congruence.',
      'Explore the SSA (Side-Side-Angle) trap and witness how a swinging leg creates two distinct non-congruent triangles.',
      'Perform virtual superposition proofs: translate, rotate, and reflect triangle ΔABC onto ΔDEF.'
    ],
    mathematicalPrinciples: [
      {
        title: 'Rigid Congruence Guarantee',
        description: 'Two triangles are congruent if all corresponding sides and corresponding angles are equal: ΔABC ≅ ΔDEF.',
        formulaLatex: '\\Delta ABC \\cong \\Delta DEF \\iff AB = DE, \\, BC = EF, \\, CA = FD, \\, \\angle A = \\angle D, \\, \\angle B = \\angle E, \\, \\angle C = \\angle F'
      },
      {
        title: 'The Ambiguous SSA Case',
        description: 'Given side a, side b, and non-included angle A: if a < b sin(A), no triangle exists; if a = b sin(A), one right triangle exists; if b sin(A) < a < b, two distinct triangles exist.',
        formulaLatex: 'b \\sin A < a < b \\implies 2 \\text{ distinct non-congruent triangles (Ambiguous Case)}'
      }
    ],
    controlsGuide: [
      {
        name: 'Congruence Criterion Tabs',
        type: 'button',
        description: 'Switches active proof criteria between SSS, SAS, ASA, AAS, RHS, and SSA (Trap Alert).',
        effect: 'Locks the corresponding constraint parameters on both triangles.'
      },
      {
        name: 'Side Length & Angle Sliders',
        type: 'slider',
        description: 'Adjusts constrained side lengths and angles within the chosen criterion.',
        effect: 'Updates both triangles simultaneously to demonstrate rigid congruence.'
      },
      {
        name: 'Superimpose Animation Button',
        type: 'button',
        description: 'Animates Triangle 1 flying over, rotating, and docking onto Triangle 2.',
        effect: 'Demonstrates physical superposition congruence proof on screen.'
      }
    ],
    stepByStepInstructions: [
      'Select SAS criterion: set Side 1 = 6 cm, Included Angle = 50°, Side 2 = 7 cm.',
      'Click "Superimpose": watch Triangle 1 glide over Triangle 2, locking into 100% perfect alignment.',
      'Switch to the "SSA (Trap Alert)" mode: set Angle A = 30°, Side b = 10 cm, and Side a = 6 cm.',
      'Observe the swinging side a: it intersects the base line at TWO distinct points, creating an acute triangle AND an obtuse triangle.',
      'Confirm why SSA is rejected as a valid congruence criterion in CBSE and international geometry.'
    ],
    expectedOutput: 'Two distinct vector triangles rendered with color-coded matching side tick marks and angle arcs. Clicking Superimpose triggers a smooth rigid body motion showing perfect coincidence.',
    realWorldApplication: {
      domain: 'Structural Engineering & Truss Bridge Construction',
      title: 'Triangulated Bridge Trusses & Rigid Stability',
      scenario: 'Structural civil engineers construct bridge trusses and building frames exclusively out of interconnected triangles.',
      mathematicalConnection: 'By the SSS congruence criterion, fixing three side lengths locks all three angles rigidly without hinges, preventing structural collapse under heavy locomotive loads.'
    }
  }
};

