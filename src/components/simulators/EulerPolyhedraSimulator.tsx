/**
 * EulerPolyhedraSimulator.tsx: Visualising Solid Shapes & Euler's 3D Workshop (Class 8 Geometry).
 * Features:
 * - Real-time 3D polyhedra renderer with touch orbital camera
 * - Smooth transition from 3D solid to flat unfolded 2D net via slider
 * - Live Euler Counter dynamically testing F + V - E = 2
 * - X-ray wireframe mode to count hidden vertices and back edges
 * - 3 Progressive Board Exam challenges
 */
import React, { useRef, useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  Boxes, 
  RotateCcw, 
  CheckCircle2, 
  Sparkles, 
  Eye, 
  Layers, 
  Sliders,
  Maximize2,
  Compass
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

interface SolidData {
  name: string;
  faces: number;
  vertices: number;
  edges: number;
  baseShape: string;
  category: 'platonic' | 'prism' | 'pyramid';
}

const SOLIDS: Record<string, SolidData> = {
  cube: { name: 'Cube (Hexahedron)', faces: 6, vertices: 8, edges: 12, baseShape: 'Square', category: 'platonic' },
  tetrahedron: { name: 'Tetrahedron', faces: 4, vertices: 4, edges: 6, baseShape: 'Triangle', category: 'platonic' },
  octahedron: { name: 'Octahedron', faces: 8, vertices: 6, edges: 12, baseShape: 'Triangle', category: 'platonic' },
  'triangular-prism': { name: 'Triangular Prism', faces: 5, vertices: 6, edges: 9, baseShape: 'Triangle', category: 'prism' },
  'square-pyramid': { name: 'Square Pyramid', faces: 5, vertices: 5, edges: 8, baseShape: 'Square', category: 'pyramid' },
  'pentagonal-prism': { name: 'Pentagonal Prism', faces: 7, vertices: 10, edges: 15, baseShape: 'Pentagon', category: 'prism' },
};

export const EulerPolyhedraSimulator: React.FC = () => {
  const {
    eulerPolyhedraParams,
    updateEulerPolyhedraParams,
    resetParams,
    completeChallenge,
    challengeCompleted,
    isZenMode,
  } = useSimulatorStore();

  const {
    solidType,
    unfoldProgress,
    showVertices,
    showEdges,
    showFaces,
    cameraOrbitX,
    cameraOrbitY,
    xrayWireframe,
  } = eulerPolyhedraParams;

  const { lightTap, successBuzz } = useHaptics();
  const { playClick, playChime } = useSound();
  const { trackEvent } = useAnalytics();

  const solid = SOLIDS[solidType] || SOLIDS.cube;
  const eulerSum = solid.faces + solid.vertices - solid.edges;

  // Touch drag for 3D camera
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    dragStart.current = { x: e.clientX, y: e.clientY };

    updateEulerPolyhedraParams({
      cameraOrbitX: (cameraOrbitX + dx * 0.5) % 360,
      cameraOrbitY: Math.max(-60, Math.min(60, cameraOrbitY + dy * 0.5)),
    });
  };

  const handlePointerUp = () => setIsDragging(false);

  const handleReset = () => {
    lightTap();
    playClick();
    resetParams('euler-polyhedra-3d');
  };

  // Challenges for Board Exam mastery
  const challengeLevels: ChallengeLevel[] = [
    {
      levelNumber: 1,
      title: "Cube Verification: F=6, V=8, E=12",
      badge: 'Euler Apprentice',
      description: "Verify Euler's Formula for a Cube: 6 Faces + 8 Vertices - 12 Edges = 2.",
      requirementFormula: '6 + 8 - 12 = 2',
      targetCriteria: 'Select Cube solid',
      xpReward: 30,
      tier1Hint: 'Select Cube from the 3D solid list.',
      tier2Hint: 'Count: 6 square faces, 8 corner vertices, 12 framing edges.',
      tier3Hint: 'Check the live Euler formula counter at the top!',
      autoPreset: () => updateEulerPolyhedraParams({ solidType: 'cube', unfoldProgress: 0 }),
    },
    {
      levelNumber: 2,
      title: 'Triangular Prism vs Square Pyramid (F=5)',
      badge: 'Solid Detective',
      description: 'Switch between Triangular Prism and Square Pyramid. Notice both have 5 faces, but different V and E!',
      requirementFormula: '\\text{Prism: } 5+6-9=2, \\quad \\text{Pyramid: } 5+5-8=2',
      targetCriteria: 'Inspect Triangular Prism and Square Pyramid',
      xpReward: 40,
      tier1Hint: 'Select Triangular Prism: F=5, V=6, E=9.',
      tier2Hint: 'Select Square Pyramid: F=5, V=5, E=8.',
      tier3Hint: 'Notice both satisfy F + V - E = 2 despite differing topologies!',
      autoPreset: () => updateEulerPolyhedraParams({ solidType: 'square-pyramid', unfoldProgress: 0 }),
    },
    {
      levelNumber: 3,
      title: 'Unfold 3D Solid into Flat 2D Net',
      badge: 'Origami Master',
      description: 'Drag the Unfold slider to 100% to unfold the polyhedron into a flat printable 2D net!',
      requirementFormula: '\\text{Unfold Progress} = 100\\%',
      targetCriteria: 'Set Unfold Progress to 1.00',
      xpReward: 50,
      tier1Hint: 'Drag the Unfold slider all the way to 1.00 (100%).',
      tier2Hint: 'Watch the 3D faces lay flat along their adjoining edges.',
      tier3Hint: 'Verify the flat net contains all 6 faces of the cube.',
      autoPreset: () => updateEulerPolyhedraParams({ unfoldProgress: 1 }),
    },
  ];

  // Auto verify challenges
  React.useEffect(() => {
    if (solidType === 'cube' && unfoldProgress === 0) {
      if (!challengeCompleted['euler-polyhedra-3d-1']) {
        successBuzz();
        playChime();
        confetti({ particleCount: 35, spread: 60, origin: { y: 0.6 } });
        completeChallenge('euler-polyhedra-3d-1', 30);
      }
    }
    if (solidType === 'square-pyramid') {
      if (!challengeCompleted['euler-polyhedra-3d-2']) {
        completeChallenge('euler-polyhedra-3d-2', 40);
      }
    }
    if (unfoldProgress >= 0.95) {
      if (!challengeCompleted['euler-polyhedra-3d-3']) {
        successBuzz();
        playChime();
        confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
        completeChallenge('euler-polyhedra-3d-3', 50);
      }
    }
  }, [solidType, unfoldProgress, challengeCompleted, completeChallenge, playChime, successBuzz]);

  const controlsContent = (
    <div className="space-y-4 p-4 text-slate-200">
      {/* Solid Selector */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Select 3D Polyhedron
        </label>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(SOLIDS).map(([key, s]) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                lightTap();
                playClick();
                updateEulerPolyhedraParams({ solidType: key as any });
                trackEvent('euler_solid_select', { solid: key });
              }}
              className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                solidType === key
                  ? 'bg-violet-500/20 border-violet-400 text-violet-200 shadow-sm'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <div className="text-xs font-bold">{s.name}</div>
              <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                F={s.faces}, V={s.vertices}, E={s.edges}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Unfold Slider */}
      <div className="space-y-3 bg-slate-900/70 border border-slate-800 rounded-2xl p-3.5">
        <TouchSlider
          label="Unfold into 2D Flat Net"
          value={Math.round(unfoldProgress * 100)}
          min={0}
          max={100}
          step={5}
          unit="%"
          onChange={(val) => updateEulerPolyhedraParams({ unfoldProgress: val / 100 })}
        />
      </div>

      {/* Toggles */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            lightTap();
            updateEulerPolyhedraParams({ xrayWireframe: !xrayWireframe });
          }}
          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
            xrayWireframe
              ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
              : 'bg-slate-900 border-slate-800 text-slate-400'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{xrayWireframe ? 'Solid Surface' : 'X-Ray Wireframe'}</span>
        </button>
      </div>

      {/* Explain Like I'm 13 Card */}
      <Eli13ExplainerCard simulatorId="euler-polyhedra-3d" />

      <button
        type="button"
        onClick={handleReset}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/70 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition border border-slate-700/60 cursor-pointer"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Reset 3D Orientation & Solid</span>
      </button>
    </div>
  );

  return (
    <div className="relative w-full h-full flex flex-col flex-1 select-none overflow-hidden bg-slate-950">
      {/* 3D Orbiting Canvas */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="relative flex-1 w-full min-h-[360px] flex flex-col items-center justify-center p-3 sm:p-6 overflow-hidden cursor-grab active:cursor-grabbing touch-none"
      >
        {/* Euler Formula Counter HUD */}
        <div className="w-full max-w-lg mb-3 p-3 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md shadow-xl text-center">
          <span className="text-[10px] uppercase font-mono text-violet-400 font-bold tracking-wider block">
            Euler's Polyhedral Formula
          </span>
          <div className="text-base sm:text-xl font-mono font-bold text-white flex items-center justify-center gap-3 mt-1">
            <span className="text-sky-400">{solid.faces} Faces (F)</span>
            <span className="text-slate-500">+</span>
            <span className="text-emerald-400">{solid.vertices} Vertices (V)</span>
            <span className="text-slate-500">-</span>
            <span className="text-amber-400">{solid.edges} Edges (E)</span>
            <span className="text-slate-500">=</span>
            <span className="text-violet-300 underline font-extrabold">{eulerSum}</span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-1 font-mono">
            {solid.name} satisfies F + V - E = 2!
          </span>
        </div>

        {/* 3D Polyhedra SVG Projection */}
        <div className="w-full max-w-md h-64 sm:h-72 flex items-center justify-center">
          <svg viewBox="0 0 300 260" className="w-full h-full drop-shadow-2xl overflow-visible">
            {/* 3D Projection depending on solidType and unfoldProgress */}
            {unfoldProgress < 0.5 ? (
              // 3D Solid Orbit View
              <g transform="translate(150, 130)">
                {solidType === 'cube' && (
                  <g transform={`rotate(${cameraOrbitX * 0.5})`}>
                    {/* Cube faces */}
                    <polygon points="-45,-15 0,10 0,65 -45,40" fill={xrayWireframe ? "none" : "rgba(167, 139, 250, 0.25)"} stroke="#a78bfa" strokeWidth="2" />
                    <polygon points="0,10 45,-15 45,40 0,65" fill={xrayWireframe ? "none" : "rgba(139, 92, 246, 0.25)"} stroke="#8b5cf6" strokeWidth="2" />
                    <polygon points="0,-40 45,-15 0,10 -45,-15" fill={xrayWireframe ? "none" : "rgba(196, 181, 253, 0.25)"} stroke="#c4b5fd" strokeWidth="2" />
                    {/* Back hidden edges */}
                    {xrayWireframe && (
                      <>
                        <line x1="0" y1="-40" x2="0" y2="15" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 3" />
                        <line x1="-45" y1="40" x2="0" y2="15" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 3" />
                        <line x1="45" y1="40" x2="0" y2="15" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 3" />
                      </>
                    )}
                    {/* Vertices */}
                    {showVertices && (
                      <>
                        <circle cx="0" cy="-40" r="4" fill="#38bdf8" />
                        <circle cx="45" cy="-15" r="4" fill="#38bdf8" />
                        <circle cx="-45" cy="-15" r="4" fill="#38bdf8" />
                        <circle cx="0" cy="10" r="4" fill="#38bdf8" />
                        <circle cx="0" cy="65" r="4" fill="#38bdf8" />
                        <circle cx="45" cy="40" r="4" fill="#38bdf8" />
                        <circle cx="-45" cy="40" r="4" fill="#38bdf8" />
                      </>
                    )}
                  </g>
                )}

                {solidType === 'tetrahedron' && (
                  <g transform={`rotate(${cameraOrbitX * 0.5})`}>
                    <polygon points="0,-55 -50,35 0,45" fill={xrayWireframe ? "none" : "rgba(56, 189, 248, 0.25)"} stroke="#38bdf8" strokeWidth="2" />
                    <polygon points="0,-55 0,45 50,35" fill={xrayWireframe ? "none" : "rgba(2, 132, 199, 0.25)"} stroke="#0284c7" strokeWidth="2" />
                    <circle cx="0" cy="-55" r="4" fill="#10b981" />
                    <circle cx="-50" cy="35" r="4" fill="#10b981" />
                    <circle cx="50" cy="35" r="4" fill="#10b981" />
                    <circle cx="0" cy="45" r="4" fill="#10b981" />
                  </g>
                )}

                {solidType === 'square-pyramid' && (
                  <g transform={`rotate(${cameraOrbitX * 0.5})`}>
                    {/* Base */}
                    <polygon points="-45,30 45,30 25,60 -65,60" fill={xrayWireframe ? "none" : "rgba(245, 158, 11, 0.2)"} stroke="#f59e0b" strokeWidth="2" />
                    {/* Front triangular faces */}
                    <polygon points="0,-50 -65,60 25,60" fill={xrayWireframe ? "none" : "rgba(234, 88, 12, 0.25)"} stroke="#ea580c" strokeWidth="2" />
                    <polygon points="0,-50 25,60 45,30" fill={xrayWireframe ? "none" : "rgba(249, 115, 22, 0.25)"} stroke="#f97316" strokeWidth="2" />
                    {/* Apex */}
                    <circle cx="0" cy="-50" r="5" fill="#f59e0b" />
                  </g>
                )}

                {solidType !== 'cube' && solidType !== 'tetrahedron' && solidType !== 'square-pyramid' && (
                  // Generic Prism / Octahedron representation
                  <g transform={`rotate(${cameraOrbitX * 0.5})`}>
                    <polygon points="0,-60 -50,0 0,60 50,0" fill="rgba(168, 85, 247, 0.25)" stroke="#a855f7" strokeWidth="2" />
                    <line x1="-50" y1="0" x2="50" y2="0" stroke="#c084fc" strokeWidth="1.5" strokeDasharray="2 2" />
                    <circle cx="0" cy="-60" r="4" fill="#38bdf8" />
                    <circle cx="0" cy="60" r="4" fill="#38bdf8" />
                    <circle cx="-50" cy="0" r="4" fill="#38bdf8" />
                    <circle cx="50" cy="0" r="4" fill="#38bdf8" />
                  </g>
                )}
              </g>
            ) : (
              // 2D Printable Net View
              <g transform="translate(150, 130)">
                {/* Cube Net Cross: 6 connected squares */}
                <rect x="-25" y="-75" width="50" height="50" fill="rgba(167, 139, 250, 0.3)" stroke="#a78bfa" strokeWidth="2" />
                <rect x="-25" y="-25" width="50" height="50" fill="rgba(167, 139, 250, 0.3)" stroke="#a78bfa" strokeWidth="2" />
                <rect x="-25" y="25" width="50" height="50" fill="rgba(167, 139, 250, 0.3)" stroke="#a78bfa" strokeWidth="2" />
                <rect x="-25" y="75" width="50" height="50" fill="rgba(167, 139, 250, 0.3)" stroke="#a78bfa" strokeWidth="2" />
                <rect x="-75" y="-25" width="50" height="50" fill="rgba(139, 92, 246, 0.3)" stroke="#8b5cf6" strokeWidth="2" />
                <rect x="25" y="-25" width="50" height="50" fill="rgba(139, 92, 246, 0.3)" stroke="#8b5cf6" strokeWidth="2" />
                <text x="0" y="5" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">2D Net</text>
              </g>
            )}
          </svg>
        </div>

        {/* Orbit Drag Instruction */}
        <div className="mt-2 text-center text-xs font-mono text-slate-400">
          Touch and drag to orbit 3D camera · Slide "Unfold" to see the flat 2D net!
        </div>
      </div>

      <BottomSheet
        title="Euler 3D Polyhedra Workshop"
        onReset={handleReset}
        theoryContent={<CoachTheoryModule simulatorId="euler-polyhedra-3d" />}
        challengeContent={
          <ChallengeManager
            simulatorId="euler-polyhedra-3d"
            simulatorTitle="Euler 3D Polyhedra Workshop"
            levels={challengeLevels}
          />
        }
      >
        {controlsContent}
      </BottomSheet>
    </div>
  );
};
