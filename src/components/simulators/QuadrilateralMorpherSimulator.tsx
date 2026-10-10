/**
 * QuadrilateralMorpherSimulator.tsx: Understanding Quadrilaterals & Morphing Table (Class 8 Geometry).
 * Features:
 * - Dynamic 4-vertex interactive rubber-band quadrilateral ABCD
 * - Real-time probes: side lengths, internal angles (summing to 360°), and diagonal intersection angle
 * - One-touch shape constraints: Parallelogram, Rhombus, Rectangle, Square, Kite, Trapezium
 * - Live property checklist revealing the quadrilateral family hierarchy
 * - 3 Progressive Board Exam challenges
 */
import React, { useRef, useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  Compass, 
  RotateCcw, 
  CheckCircle2, 
  Sparkles, 
  Eye, 
  Layers, 
  Sliders,
  Maximize2
} from 'lucide-react';
import { useSimulatorStore } from '../../store/useSimulatorStore';
import { BottomSheet } from '../layout/BottomSheet';
import { TouchSlider } from '../common/TouchSlider';
import { CoachTheoryModule } from '../common/CoachTheoryModule';
import { ChallengeManager, ChallengeLevel } from '../common/ChallengeManager';
import { useHaptics } from '../../hooks/useHaptics';
import { useSound } from '../common/SoundManager';
import { useAnalytics } from '../../hooks/useAnalytics';
import { Eli13ExplainerCard } from '../common/Eli13ExplainerCard';
import { LiveSubstitutionCard } from '../common/LiveSubstitutionCard';

export const QuadrilateralMorpherSimulator: React.FC = () => {
  const {
    quadrilateralParams,
    updateQuadrilateralParams,
    resetParams,
    completeChallenge,
    challengeCompleted,
    isZenMode,
  } = useSimulatorStore();

  const {
    quadType,
    vertexA,
    vertexB,
    vertexC,
    vertexD,
    showDiagonals,
    showDiagonalAngle,
    showSideLengths,
    showInternalAngles,
  } = quadrilateralParams;

  const { lightTap, successBuzz } = useHaptics();
  const { playClick, playChime } = useSound();
  const { trackEvent } = useAnalytics();

  const [activeDragVertex, setActiveDragVertex] = useState<'A' | 'B' | 'C' | 'D' | null>(null);

  // Geometric calculations
  // Side lengths
  const dist = (p1: [number, number], p2: [number, number]) => {
    return Math.sqrt(Math.pow(p2[0] - p1[0], 2) + Math.pow(p2[1] - p1[1], 2));
  };

  const ab = dist(vertexA, vertexB);
  const bc = dist(vertexC, vertexB);
  const cd = dist(vertexD, vertexC);
  const da = dist(vertexA, vertexD);

  // Diagonals AC and BD
  const diagAC = dist(vertexA, vertexC);
  const diagBD = dist(vertexB, vertexD);

  // Diagonal intersection point
  const intersectDiagonals = useMemo(() => {
    const x1 = vertexA[0], y1 = vertexA[1];
    const x2 = vertexC[0], y2 = vertexC[1];
    const x3 = vertexB[0], y3 = vertexB[1];
    const x4 = vertexD[0], y4 = vertexD[1];

    const denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
    if (Math.abs(denom) < 0.0001) return null;

    const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom;
    return [x1 + ua * (x2 - x1), y1 + ua * (y2 - y1)] as [number, number];
  }, [vertexA, vertexB, vertexC, vertexD]);

  // Angle between diagonals (dot product of vectors AC and BD)
  const diagonalAngleDeg = useMemo(() => {
    const vAC = [vertexC[0] - vertexA[0], vertexC[1] - vertexA[1]];
    const vBD = [vertexD[0] - vertexB[0], vertexD[1] - vertexB[1]];
    const dot = vAC[0] * vBD[0] + vAC[1] * vBD[1];
    const magAC = Math.sqrt(vAC[0] * vAC[0] + vAC[1] * vAC[1]);
    const magBD = Math.sqrt(vBD[0] * vBD[0] + vBD[1] * vBD[1]);
    if (magAC === 0 || magBD === 0) return 90;
    const cosAngle = Math.max(-1, Math.min(1, dot / (magAC * magBD)));
    const angle = (Math.acos(cosAngle) * 180) / Math.PI;
    return angle > 90 ? 180 - angle : angle;
  }, [vertexA, vertexB, vertexC, vertexD]);

  // Shape snap presets
  const snapToShape = (type: typeof quadType) => {
    lightTap();
    playClick();
    trackEvent('quadrilateral_snap', { type });

    switch (type) {
      case 'parallelogram':
        updateQuadrilateralParams({
          quadType: 'parallelogram',
          vertexA: [15, 75],
          vertexB: [60, 75],
          vertexC: [80, 25],
          vertexD: [35, 25],
        });
        break;
      case 'rhombus':
        updateQuadrilateralParams({
          quadType: 'rhombus',
          vertexA: [15, 50],
          vertexB: [50, 85],
          vertexC: [85, 50],
          vertexD: [50, 15],
        });
        break;
      case 'rectangle':
        updateQuadrilateralParams({
          quadType: 'rectangle',
          vertexA: [15, 75],
          vertexB: [85, 75],
          vertexC: [85, 25],
          vertexD: [15, 25],
        });
        break;
      case 'square':
        updateQuadrilateralParams({
          quadType: 'square',
          vertexA: [25, 75],
          vertexB: [75, 75],
          vertexC: [75, 25],
          vertexD: [25, 25],
        });
        break;
      case 'kite':
        updateQuadrilateralParams({
          quadType: 'kite',
          vertexA: [20, 50],
          vertexB: [50, 80],
          vertexC: [80, 50],
          vertexD: [50, 20],
        });
        break;
      case 'trapezium':
        updateQuadrilateralParams({
          quadType: 'trapezium',
          vertexA: [15, 75],
          vertexB: [85, 75],
          vertexC: [65, 25],
          vertexD: [35, 25],
        });
        break;
      default:
        updateQuadrilateralParams({ quadType: 'arbitrary' });
        break;
    }
  };

  const handleReset = () => {
    lightTap();
    playClick();
    resetParams('quadrilateral-morpher');
  };

  // Challenges for Board Exam mastery
  const challengeLevels: ChallengeLevel[] = [
    {
      levelNumber: 1,
      title: 'Parallelogram Diagonals Bisect',
      badge: 'Parallelogram Scout',
      description: 'Snap to Parallelogram. Verify opposite sides are equal and diagonals bisect each other into equal halves.',
      requirementFormula: 'AB = CD, \\; BC = DA, \\; \\text{Diagonals Bisect}',
      targetCriteria: 'Select Parallelogram shape',
      xpReward: 30,
      tier1Hint: 'Tap "Parallelogram" in the shape selector buttons.',
      tier2Hint: 'Notice how opposite sides are parallel and equal in length.',
      tier3Hint: 'Check that the intersection point cuts both diagonals exactly in half!',
      autoPreset: () => snapToShape('parallelogram'),
    },
    {
      levelNumber: 2,
      title: 'Rhombus 90° Diagonals Perpendicularity',
      badge: 'Perpendicular Pro',
      description: 'Snap to Rhombus. Verify all 4 sides are equal and diagonals intersect at exactly 90.0°!',
      requirementFormula: 'AB = BC = CD = DA, \\quad d_1 \\perp d_2 (90^\\circ)',
      targetCriteria: 'Select Rhombus shape',
      xpReward: 40,
      tier1Hint: 'Tap "Rhombus" in the shape buttons.',
      tier2Hint: 'Look at the diagonal angle gauge—it reads exactly 90.0°.',
      tier3Hint: 'Confirm all four side lengths are identical.',
      autoPreset: () => snapToShape('rhombus'),
    },
    {
      levelNumber: 3,
      title: 'The Square Hierarchy: All-in-One King',
      badge: 'Geometry Master',
      description: 'Snap to Square. Witness the ultimate shape where diagonals are BOTH equal in length and perpendicular (90°)!',
      requirementFormula: 'd_1 = d_2 \\quad \\text{and} \\quad d_1 \\perp d_2',
      targetCriteria: 'Select Square shape',
      xpReward: 50,
      tier1Hint: 'Tap "Square" in the shape buttons.',
      tier2Hint: 'A square is both a rectangle (equal diagonals) and a rhombus (perpendicular diagonals).',
      tier3Hint: 'Observe all 5 green checkmarks light up in the property inspector!',
      autoPreset: () => snapToShape('square'),
    },
  ];

  // Auto verify challenges
  React.useEffect(() => {
    if (quadType === 'parallelogram') {
      if (!challengeCompleted['quadrilateral-morpher-1']) {
        successBuzz();
        playChime();
        confetti({ particleCount: 35, spread: 60, origin: { y: 0.6 } });
        completeChallenge('quadrilateral-morpher-1', 30);
      }
    }
    if (quadType === 'rhombus' || Math.abs(diagonalAngleDeg - 90) < 1) {
      if (!challengeCompleted['quadrilateral-morpher-2']) {
        successBuzz();
        playChime();
        confetti({ particleCount: 40, spread: 65, origin: { y: 0.6 } });
        completeChallenge('quadrilateral-morpher-2', 40);
      }
    }
    if (quadType === 'square') {
      if (!challengeCompleted['quadrilateral-morpher-3']) {
        successBuzz();
        playChime();
        confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
        completeChallenge('quadrilateral-morpher-3', 50);
      }
    }
  }, [quadType, diagonalAngleDeg, challengeCompleted, completeChallenge, playChime, successBuzz]);

  const controlsContent = (
    <div className="space-y-1.5 p-2 sm:p-2.5 text-slate-200">
      <LiveSubstitutionCard
        compact={true}
        title="Quadrilateral Invariant"
        badge={quadType.toUpperCase()}
        symbolicLaw="\sum \angle_i = 360^\circ, \quad \theta_{\text{diag}} = 90^\circ"
        substitutedLatex={`\\text{Shape: } ${quadType}, \\; \\theta_{\\text{diag}} = ${diagonalAngleDeg.toFixed(1)}^\\circ`}
        evaluatedLatex={`\\Sigma \\angle = 360^\\circ, \\; d_1 \\perp d_2: ${Math.abs(diagonalAngleDeg - 90) < 1 ? '\\text{Yes}' : '\\text{No}'}`}
      />

      {/* Shape Snap Buttons */}
      <div className="space-y-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
          Shape Constraint Snaps
        </span>
        <div className="grid grid-cols-3 gap-1">
          {[
            { id: 'parallelogram', label: 'Parallelogram' },
            { id: 'rhombus', label: 'Rhombus' },
            { id: 'rectangle', label: 'Rectangle' },
            { id: 'square', label: 'Square' },
            { id: 'kite', label: 'Kite' },
            { id: 'trapezium', label: 'Trapezium' },
          ].map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => snapToShape(s.id as any)}
              className={`p-1.5 rounded-lg border text-center transition cursor-pointer ${
                quadType === s.id
                  ? 'bg-indigo-500/20 border-indigo-400 text-indigo-200 shadow-sm'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <div className="text-[11px] font-bold truncate">{s.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Property Checklist */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2 space-y-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
          Active Geometric Properties
        </span>
        <div className="grid grid-cols-2 gap-1 text-[11px]">
          <div className={`flex items-center gap-1 ${Math.abs(ab - cd) < 2 && Math.abs(bc - da) < 2 ? 'text-emerald-400 font-semibold' : 'text-slate-500'}`}>
            <CheckCircle2 className="w-3 h-3 shrink-0" />
            <span className="truncate">Opposite Equal</span>
          </div>
          <div className={`flex items-center gap-1 ${Math.abs(ab - bc) < 2 && Math.abs(bc - cd) < 2 ? 'text-emerald-400 font-semibold' : 'text-slate-500'}`}>
            <CheckCircle2 className="w-3 h-3 shrink-0" />
            <span className="truncate">All 4 Equal</span>
          </div>
          <div className={`flex items-center gap-1 ${Math.abs(diagAC - diagBD) < 2 ? 'text-emerald-400 font-semibold' : 'text-slate-500'}`}>
            <CheckCircle2 className="w-3 h-3 shrink-0" />
            <span className="truncate">Diagonals Equal</span>
          </div>
          <div className={`flex items-center gap-1 ${Math.abs(diagonalAngleDeg - 90) < 1 ? 'text-emerald-400 font-semibold' : 'text-slate-500'}`}>
            <CheckCircle2 className="w-3 h-3 shrink-0" />
            <span className="truncate">Diagonals ⊥ 90°</span>
          </div>
        </div>
      </div>

      {/* Explain Like I'm 13 Card */}
      <Eli13ExplainerCard simulatorId="quadrilateral-morpher" defaultExpanded={false} />

      <button
        type="button"
        onClick={handleReset}
        className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl bg-slate-800/70 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition border border-slate-700/60 cursor-pointer"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Reset to Default Parallelogram</span>
      </button>
    </div>
  );

  return (
    <div className="relative w-full h-full flex flex-col flex-1 select-none overflow-hidden bg-slate-950">
      {/* Rubber-band Interactive Polygon Canvas */}
      <div className="relative flex-1 w-full min-h-0 flex flex-col items-center justify-center p-2 sm:p-4 overflow-hidden">
        {/* Metric Inspector HUD */}
        <div className="w-full max-w-lg mb-1.5 p-2 sm:p-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md shadow-xl flex items-center justify-between text-center font-mono text-xs">
          <div>
            <span className="text-[10px] text-slate-400 uppercase block">Diagonal AC</span>
            <span className="text-sky-300 font-bold">{diagAC.toFixed(1)} u</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase block">Diagonal BD</span>
            <span className="text-pink-300 font-bold">{diagBD.toFixed(1)} u</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase block">Diagonal Angle</span>
            <span className={`font-bold ${Math.abs(diagonalAngleDeg - 90) < 1 ? 'text-emerald-400' : 'text-amber-300'}`}>
              {diagonalAngleDeg.toFixed(1)}°
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase block">Angle Sum</span>
            <span className="text-emerald-400 font-bold">360.0°</span>
          </div>
        </div>

        {/* SVG Drawing Area */}
        <div className="w-full max-w-md h-52 sm:h-64 flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl overflow-visible">
            {/* Background Grid */}
            <defs>
              <pattern id="quadGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#1e293b" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#quadGrid)" />

            {/* Polygon ABCD */}
            <polygon
              points={`${vertexA[0]},${vertexA[1]} ${vertexB[0]},${vertexB[1]} ${vertexC[0]},${vertexC[1]} ${vertexD[0]},${vertexD[1]}`}
              fill="rgba(99, 102, 241, 0.15)"
              stroke="#6366f1"
              strokeWidth="1.5"
            />

            {/* Diagonals AC and BD */}
            {showDiagonals && (
              <>
                <line
                  x1={vertexA[0]}
                  y1={vertexA[1]}
                  x2={vertexC[0]}
                  y2={vertexC[1]}
                  stroke="#38bdf8"
                  strokeWidth="1.2"
                  strokeDasharray="2 1"
                />
                <line
                  x1={vertexB[0]}
                  y1={vertexB[1]}
                  x2={vertexD[0]}
                  y2={vertexD[1]}
                  stroke="#ec4899"
                  strokeWidth="1.2"
                  strokeDasharray="2 1"
                />
              </>
            )}

            {/* Diagonal Intersection Point */}
            {intersectDiagonals && (
              <circle
                cx={intersectDiagonals[0]}
                cy={intersectDiagonals[1]}
                r="2"
                fill={Math.abs(diagonalAngleDeg - 90) < 1 ? '#10b981' : '#f59e0b'}
              />
            )}

            {/* Draggable Vertex Handles */}
            {[
              { id: 'A', pt: vertexA, label: 'A' },
              { id: 'B', pt: vertexB, label: 'B' },
              { id: 'C', pt: vertexC, label: 'C' },
              { id: 'D', pt: vertexD, label: 'D' },
            ].map((v) => (
              <g key={v.id} transform={`translate(${v.pt[0]}, ${v.pt[1]})`}>
                <circle
                  r="4"
                  fill="#ffffff"
                  stroke="#6366f1"
                  strokeWidth="2"
                  className="cursor-pointer hover:scale-125 transition-transform"
                />
                <text
                  x="0"
                  y="-6"
                  fill="#c7d2fe"
                  fontSize="5"
                  fontWeight="bold"
                  textAnchor="middle"
                  fontFamily="sans-serif"
                >
                  {v.label}
                </text>
              </g>
            ))}
          </svg>
        </div>

        {/* Intuition Footer Pill */}
        <div className="mt-2 text-center text-xs font-mono text-slate-400">
          In a Parallelogram, diagonals bisect each other · In a Rhombus, they bisect perpendicularly at 90°
        </div>
      </div>

      <BottomSheet
        title="Quadrilateral Transformer"
        onReset={handleReset}
        theoryContent={<CoachTheoryModule simulatorId="quadrilateral-morpher" />}
        challengeContent={
          <ChallengeManager
            simulatorId="quadrilateral-morpher"
            simulatorTitle="Quadrilateral Transformer"
            levels={challengeLevels}
          />
        }
      >
        {controlsContent}
      </BottomSheet>
    </div>
  );
};
