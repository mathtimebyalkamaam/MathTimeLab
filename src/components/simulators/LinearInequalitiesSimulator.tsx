/**
 * LinearInequalitiesSimulator.tsx: Interactive Half-Plane Shading & Feasible Region Optimizer (Class 11 Algebra).
 * Features:
 * - Dynamic 2D Cartesian grid with dual half-plane constraints: a₁x + b₁y ≤ c₁, a₂x + b₂y ≤ c₂
 * - Non-negative constraints: x ≥ 0, y ≥ 0
 * - Real-time Feasible Region polygon shader (emerald glow)
 * - Draggable Test Point (x, y) with live GREEN / RED constraint check
 * - Origin Test (0, 0) automated proof visualizer
 * - Corner Point Theorem & Objective Function Line Z = px + qy sweep
 * - 3 Progressive board exam challenges
 */
import React, { useEffect, useRef, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { 
  Layers, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Compass, 
  Sliders, 
  Target, 
  Eye, 
  Sparkles
} from 'lucide-react';
import { useSimulatorStore } from '../../store/useSimulatorStore';
import { BottomSheet } from '../layout/BottomSheet';
import { TouchSlider } from '../common/TouchSlider';
import { CoachTheoryModule } from '../common/CoachTheoryModule';
import { ChallengeManager, ChallengeLevel } from '../common/ChallengeManager';
import { useHaptics } from '../../hooks/useHaptics';
import { useSound } from '../common/SoundManager';
import { useAnalytics } from '../../hooks/useAnalytics';
import { LiveSubstitutionCard } from '../common/LiveSubstitutionCard';

export const LinearInequalitiesSimulator: React.FC = () => {
  const {
    linearInequalitiesParams,
    updateLinearInequalitiesParams,
    resetParams,
    completeChallenge,
    challengeCompleted,
    isZenMode,
  } = useSimulatorStore();

  const {
    a1,
    b1,
    c1,
    op1,
    a2,
    b2,
    c2,
    op2,
    nonNegativeConstraints,
    testPointX,
    testPointY,
    showCornerPoints,
    showObjectiveLine,
    objectiveP,
    objectiveQ,
  } = linearInequalitiesParams;

  const { lightTap, successBuzz } = useHaptics();
  const { playClick, playChime } = useSound();
  const { trackEvent } = useAnalytics();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [objectiveZ, setObjectiveZ] = useState(16);
  const isDraggingTestPoint = useRef(false);

  // Constraint check helper for any point (x, y)
  const satisfies1 = op1 === '<=' ? a1 * testPointX + b1 * testPointY <= c1 + 0.001 : a1 * testPointX + b1 * testPointY >= c1 - 0.001;
  const satisfies2 = op2 === '<=' ? a2 * testPointX + b2 * testPointY <= c2 + 0.001 : a2 * testPointX + b2 * testPointY >= c2 - 0.001;
  const satisfiesNonNeg = !nonNegativeConstraints || (testPointX >= -0.001 && testPointY >= -0.001);
  const isFeasible = satisfies1 && satisfies2 && satisfiesNonNeg;

  // Intersection of Line 1 and Line 2: Cramers rule
  const det = a1 * b2 - a2 * b1;
  const interX = det !== 0 ? (c1 * b2 - c2 * b1) / det : null;
  const interY = det !== 0 ? (a1 * c2 - a2 * c1) / det : null;

  // Corner points in 1st quadrant for standard standard problem
  const corners: { x: number; y: number; z: number }[] = [];
  corners.push({ x: 0, y: 0, z: 0 });

  // X-intercepts
  if (a1 > 0 && c1 / a1 > 0) corners.push({ x: c1 / a1, y: 0, z: objectiveP * (c1 / a1) });
  if (a2 > 0 && c2 / a2 > 0) corners.push({ x: c2 / a2, y: 0, z: objectiveP * (c2 / a2) });

  // Y-intercepts
  if (b1 > 0 && c1 / b1 > 0) corners.push({ x: 0, y: c1 / b1, z: objectiveQ * (c1 / b1) });
  if (b2 > 0 && c2 / b2 > 0) corners.push({ x: 0, y: c2 / b2, z: objectiveQ * (c2 / b2) });

  // Intersection corner
  if (interX !== null && interY !== null && interX >= 0 && interY >= 0) {
    corners.push({ x: interX, y: interY, z: objectiveP * interX + objectiveQ * interY });
  }

  // Filter corners that satisfy all constraints
  const validCorners = corners.filter((pt) => {
    const s1 = op1 === '<=' ? a1 * pt.x + b1 * pt.y <= c1 + 0.05 : a1 * pt.x + b1 * pt.y >= c1 - 0.05;
    const s2 = op2 === '<=' ? a2 * pt.x + b2 * pt.y <= c2 + 0.05 : a2 * pt.x + b2 * pt.y >= c2 - 0.05;
    return s1 && s2 && pt.x >= -0.05 && pt.y >= -0.05;
  });

  // Board Exam Challenge Evaluation
  useEffect(() => {
    // Challenge 1: The Origin Test Hack
    if (Math.abs(testPointX) < 0.2 && Math.abs(testPointY) < 0.2 && isFeasible && !challengeCompleted['ineq_origin_test']) {
      completeChallenge('ineq_origin_test', 40);
      successBuzz();
      playChime();
      confetti({ particleCount: 35, spread: 60 });
      trackEvent('challenge_completed', { challengeId: 'ineq_origin_test' });
    }

    // Challenge 2: The Crossroads Intersection Vertex (2, 4)
    if (
      interX !== null &&
      interY !== null &&
      Math.abs(interX - 2) < 0.1 &&
      Math.abs(interY - 4) < 0.1 &&
      !challengeCompleted['ineq_corner_vertex']
    ) {
      completeChallenge('ineq_corner_vertex', 45);
      successBuzz();
      playChime();
      confetti({ particleCount: 45, spread: 65 });
      trackEvent('challenge_completed', { challengeId: 'ineq_corner_vertex' });
    }

    // Challenge 3: Maximum Z Sweep
    if (showObjectiveLine && objectiveZ >= 22 && !challengeCompleted['ineq_max_z_sweep']) {
      completeChallenge('ineq_max_z_sweep', 50);
      successBuzz();
      playChime();
      confetti({ particleCount: 50, spread: 70 });
      trackEvent('challenge_completed', { challengeId: 'ineq_max_z_sweep' });
    }
  }, [
    testPointX,
    testPointY,
    isFeasible,
    interX,
    interY,
    showObjectiveLine,
    objectiveZ,
    challengeCompleted,
    completeChallenge,
    successBuzz,
    playChime,
    trackEvent,
  ]);

  // Canvas Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;

    const render = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      // Deep space grid
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, width, height);

      const originX = 60;
      const originY = height - 50;
      const scale = Math.min((width - 100) / 10, (height - 80) / 10);

      const toScreen = (x: number, y: number) => ({
        sx: originX + x * scale,
        sy: originY - y * scale,
      });

      const toMath = (sx: number, sy: number) => ({
        x: (sx - originX) / scale,
        y: (originY - sy) / scale,
      });

      // Grid
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      for (let x = 0; x <= 10; x++) {
        const { sx } = toScreen(x, 0);
        ctx.beginPath();
        ctx.moveTo(sx, 0);
        ctx.lineTo(sx, height);
        ctx.stroke();
        ctx.fillStyle = '#64748b';
        ctx.font = '10px monospace';
        ctx.fillText(x.toString(), sx - 3, originY + 16);
      }
      for (let y = 0; y <= 10; y++) {
        const { sy } = toScreen(0, y);
        ctx.beginPath();
        ctx.moveTo(0, sy);
        ctx.lineTo(width, sy);
        ctx.stroke();
        if (y > 0) {
          ctx.fillStyle = '#64748b';
          ctx.font = '10px monospace';
          ctx.fillText(y.toString(), originX - 18, sy + 3);
        }
      }

      // Major axes X & Y
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(originX, 0);
      ctx.lineTo(originX, height);
      ctx.moveTo(0, originY);
      ctx.lineTo(width, originY);
      ctx.stroke();

      // Shaded Feasible Region (sample fine pixel mesh for smooth convex polygon fill)
      ctx.fillStyle = 'rgba(16, 185, 129, 0.25)';
      const step = 0.15;
      for (let mx = 0; mx <= 8; mx += step) {
        for (let my = 0; my <= 8; my += step) {
          const s1 = op1 === '<=' ? a1 * mx + b1 * my <= c1 : a1 * mx + b1 * my >= c1;
          const s2 = op2 === '<=' ? a2 * mx + b2 * my <= c2 : a2 * mx + b2 * my >= c2;
          if (s1 && s2 && (!nonNegativeConstraints || (mx >= 0 && my >= 0))) {
            const { sx, sy } = toScreen(mx, my);
            ctx.fillRect(sx, sy - scale * step, scale * step + 0.5, scale * step + 0.5);
          }
        }
      }

      // Draw Boundary Line 1: a1 x + b1 y = c1 (Cyan)
      const drawLine = (a: number, b: number, c: number, color: string, label: string) => {
        const pt1 = b !== 0 ? toScreen(0, c / b) : toScreen(c / a, 0);
        const pt2 = a !== 0 ? toScreen(c / a, 0) : toScreen(0, c / b);
        const slope = -a / b;
        const xExt1 = -2;
        const yExt1 = (c - a * xExt1) / b;
        const xExt2 = 10;
        const yExt2 = (c - a * xExt2) / b;
        const s1 = toScreen(xExt1, yExt1);
        const s2 = toScreen(xExt2, yExt2);

        ctx.strokeStyle = color;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(s1.sx, s1.sy);
        ctx.lineTo(s2.sx, s2.sy);
        ctx.stroke();

        ctx.fillStyle = color;
        ctx.font = 'bold 11px monospace';
        ctx.fillText(label, s2.sx - 80, Math.max(20, s2.sy - 8));
      };

      drawLine(a1, b1, c1, '#38bdf8', `L₁: ${a1}x + ${b1}y = ${c1}`);
      drawLine(a2, b2, c2, '#f59e0b', `L₂: ${a2}x + ${b2}y = ${c2}`);

      // Objective Function Line: Z = px + qy (Magenta)
      if (showObjectiveLine) {
        const objSlope = -objectiveP / objectiveQ;
        const xExt1 = -1;
        const yExt1 = (objectiveZ - objectiveP * xExt1) / objectiveQ;
        const xExt2 = 9;
        const yExt2 = (objectiveZ - objectiveP * xExt2) / objectiveQ;
        const o1 = toScreen(xExt1, yExt1);
        const o2 = toScreen(xExt2, yExt2);

        ctx.strokeStyle = '#ec4899';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 3]);
        ctx.beginPath();
        ctx.moveTo(o1.sx, o1.sy);
        ctx.lineTo(o2.sx, o2.sy);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#ec4899';
        ctx.font = 'bold 11px monospace';
        ctx.fillText(`Objective Z = ${objectiveZ.toFixed(1)}`, o2.sx - 80, o2.sy - 8);
      }

      // Corner Points Markers
      if (showCornerPoints) {
        validCorners.forEach((pt, idx) => {
          const { sx, sy } = toScreen(pt.x, pt.y);
          ctx.fillStyle = '#10b981';
          ctx.beginPath();
          ctx.arc(sx, sy, 5.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          ctx.fillStyle = '#34d399';
          ctx.font = 'bold 11px monospace';
          ctx.fillText(`(${pt.x.toFixed(1)}, ${pt.y.toFixed(1)})`, sx + 8, sy - 8);
        });
      }

      // Draggable Test Point (x, y)
      const tp = toScreen(testPointX, testPointY);
      ctx.fillStyle = isFeasible ? '#10b981' : '#ef4444';
      ctx.beginPath();
      ctx.arc(tp.sx, tp.sy, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Test point label
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 12px monospace';
      ctx.fillText(
        `Test (${testPointX.toFixed(1)}, ${testPointY.toFixed(1)}) ${isFeasible ? '✓ FEASIBLE' : '✗ VIOLATED'}`,
        tp.sx + 12,
        tp.sy - 8
      );

      ctx.restore();
    };

    render();
    window.addEventListener('resize', render);
    return () => {
      window.removeEventListener('resize', render);
      cancelAnimationFrame(animId);
    };
  }, [
    a1,
    b1,
    c1,
    op1,
    a2,
    b2,
    c2,
    op2,
    nonNegativeConstraints,
    testPointX,
    testPointY,
    isFeasible,
    showCornerPoints,
    showObjectiveLine,
    objectiveZ,
    objectiveP,
    objectiveQ,
    validCorners,
  ]);

  // Touch and Drag handlers for Test Point
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDraggingTestPoint.current = true;
    updateTestPointFromEvent(e);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDraggingTestPoint.current) return;
    updateTestPointFromEvent(e);
  };

  const handlePointerUp = () => {
    isDraggingTestPoint.current = false;
  };

  const updateTestPointFromEvent = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;
    const originX = 60;
    const originY = rect.height - 50;
    const scale = Math.min((rect.width - 100) / 10, (rect.height - 80) / 10);
    const mx = Math.max(0, Math.min(8, (sx - originX) / scale));
    const my = Math.max(0, Math.min(8, (originY - sy) / scale));
    updateLinearInequalitiesParams({
      testPointX: Math.round(mx * 10) / 10,
      testPointY: Math.round(my * 10) / 10,
    });
  };

  const challengeLevels: ChallengeLevel[] = [
    {
      levelNumber: 1,
      title: 'The (0,0) Origin Test Hack',
      badge: 'Origin Tester',
      description: 'Drag the Test Point to the origin (0.0, 0.0). Observe why 0 ≤ 6 and 0 ≤ 8 are TRUE, so the region containing (0,0) is shaded!',
      requirementFormula: 'a_1(0) + b_1(0) \\le c_1',
      targetCriteria: 'Position test point at origin (0, 0)',
      xpReward: 35,
      autoPreset: () => {
        updateLinearInequalitiesParams({ testPointX: 0, testPointY: 0 });
      },
    },
    {
      levelNumber: 2,
      title: 'Crossroads Vertex (2, 4)',
      badge: 'Vertex Hunter',
      description: 'Observe where Line 1 (x + y = 6) and Line 2 (2x + y = 8) intersect. Notice how they cross at corner point (2, 4)!',
      requirementFormula: 'x + y = 6 \\cap 2x + y = 8 \\implies (2, 4)',
      targetCriteria: 'Set Line 1 to x+y=6 and Line 2 to 2x+y=8',
      xpReward: 45,
      autoPreset: () => {
        updateLinearInequalitiesParams({ a1: 1, b1: 1, c1: 6, a2: 2, b2: 1, c2: 8 });
      },
    },
    {
      levelNumber: 3,
      title: 'Maximize Objective Z',
      badge: 'LP Optimizer',
      description: 'Turn on Objective Line Z = 3x + 4y. Sweep Z past 22 to watch the line hit the extreme corner (0, 6) with max value 24!',
      requirementFormula: 'Z_{max} = 3(0) + 4(6) = 24',
      targetCriteria: 'Sweep Objective Z ≥ 22 to reach maximum corner',
      xpReward: 50,
      autoPreset: () => {
        updateLinearInequalitiesParams({ showObjectiveLine: true });
        setObjectiveZ(24);
      },
    },
  ];

  return (
    <div className="relative w-full h-full flex flex-col bg-slate-950 text-slate-100 overflow-hidden select-none">
      {/* HUD Header Bar */}
      <div className="flex-none px-4 py-2 bg-slate-900/90 border-b border-slate-800 backdrop-blur-md flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold text-slate-200">
            LINEAR INEQUALITIES & FEASIBLE REGION
          </span>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/40">
            {`(${testPointX.toFixed(1)}, ${testPointY.toFixed(1)}) ➔ ${isFeasible ? 'FEASIBLE' : 'VIOLATION'}`}
          </span>
        </div>

        <button
          onClick={() => {
            resetParams('linear-inequalities');
            playClick();
            lightTap();
          }}
          className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-all cursor-pointer"
          title="Reset Parameters"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Interactive Canvas */}
      <div className="relative flex-1 w-full h-full min-h-[300px] overflow-hidden">
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="w-full h-full block cursor-crosshair"
        />

        {/* Live Constraint Status Box */}
        <div className="absolute top-3 left-3 pointer-events-none bg-slate-900/85 backdrop-blur-md p-2.5 rounded-xl border border-slate-800/80 shadow-xl max-w-xs text-xs space-y-1.5">
          <div className="text-[11px] font-bold text-cyan-300 uppercase tracking-wide">
            Constraint Evaluation at ({testPointX}, {testPointY})
          </div>
          <div className={`font-mono text-[11px] flex items-center gap-1.5 ${satisfies1 ? 'text-emerald-400' : 'text-red-400'}`}>
            {satisfies1 ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
            <span>{`${a1}(${testPointX}) + ${b1}(${testPointY}) = ${(a1 * testPointX + b1 * testPointY).toFixed(1)} ${op1} ${c1}`}</span>
          </div>
          <div className={`font-mono text-[11px] flex items-center gap-1.5 ${satisfies2 ? 'text-emerald-400' : 'text-red-400'}`}>
            {satisfies2 ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
            <span>{`${a2}(${testPointX}) + ${b2}(${testPointY}) = ${(a2 * testPointX + b2 * testPointY).toFixed(1)} ${op2} ${c2}`}</span>
          </div>
          <div className="text-amber-400 text-[10px] flex items-center gap-1 font-semibold">
            <Sparkles className="w-3 h-3" />
            <span>Drag the circle directly to test any coordinate!</span>
          </div>
        </div>
      </div>

      {/* Bottom Sheet Controls & Mission Center */}
      <BottomSheet
        title="Linear Inequalities Mission Control"
        badgeLabel={isFeasible ? 'Feasible Region Valid' : 'Infeasible Point'}
        quickEquation="a_1 x + b_1 y \le c_1"
        onReset={() => resetParams('linear-inequalities')}
        theoryContent={<CoachTheoryModule simulatorId="linear-inequalities" />}
        challengeContent={
          <ChallengeManager
            simulatorId="linear-inequalities"
            simulatorTitle="Linear Inequalities & Optimization"
            levels={challengeLevels}
            onTriggerPreset={(lvl: number) => {
              playClick();
              lightTap();
              const targetLvl = challengeLevels.find((l) => l.levelNumber === lvl);
              targetLvl?.autoPreset?.();
            }}
            isOpenDefault={true}
          />
        }
      >
        <div className="space-y-4 text-xs">
          <LiveSubstitutionCard
            title="Feasible Region Constraint Evaluation"
            badge={isFeasible ? 'Feasible Point' : 'Violates Constraint'}
            symbolicLaw="a x + b y \le c, \quad Z = p x + q y"
            substitutedLatex={`(${a1})(${testPointX}) + (${b1})(${testPointY}) = ${(a1 * testPointX + b1 * testPointY).toFixed(1)} \\le ${c1}, \\; (${a2})(${testPointX}) + (${b2})(${testPointY}) = ${(a2 * testPointX + b2 * testPointY).toFixed(1)} \\le ${c2}`}
            evaluatedLatex={`Z(${testPointX}, ${testPointY}) = ${objectiveP}(${testPointX}) + ${objectiveQ}(${testPointY}) = ${(objectiveP * testPointX + objectiveQ * testPointY).toFixed(2)}`}
          />

          {/* Presets */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Standard Board Exam Problems
            </label>
            <div className="grid grid-cols-2 gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => {
                  updateLinearInequalitiesParams({
                    a1: 1, b1: 1, c1: 6, op1: '<=',
                    a2: 2, b2: 1, c2: 8, op2: '<=',
                    testPointX: 2, testPointY: 2,
                  });
                  playClick();
                  lightTap();
                }}
                className="py-1.5 text-xs font-semibold rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/30 transition-all cursor-pointer"
              >
                Classic (2, 4) Intersection
              </button>
              <button
                onClick={() => {
                  updateLinearInequalitiesParams({
                    a1: 1, b1: 2, c1: 8, op1: '<=',
                    a2: 3, b2: 2, c2: 12, op2: '<=',
                    testPointX: 1, testPointY: 1,
                  });
                  playClick();
                  lightTap();
                }}
                className="py-1.5 text-xs font-semibold rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 transition-all cursor-pointer"
              >
                Dual Sloped Constraints
              </button>
            </div>
          </div>

          {/* Line 1 Sliders */}
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-[11px] font-bold text-cyan-300 block">
              Line 1: {a1}x + {b1}y {op1} {c1}
            </span>
            <TouchSlider
              label="Constant c₁"
              value={c1}
              min={2}
              max={10}
              step={1}
              unit=""
              onChange={(val) => updateLinearInequalitiesParams({ c1: val })}
            />
          </div>

          {/* Line 2 Sliders */}
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-[11px] font-bold text-amber-300 block">
              Line 2: {a2}x + {b2}y {op2} {c2}
            </span>
            <TouchSlider
              label="Constant c₂"
              value={c2}
              min={2}
              max={12}
              step={1}
              unit=""
              onChange={(val) => updateLinearInequalitiesParams({ c2: val })}
            />
          </div>

          {/* Objective Function Slider */}
          <div className="space-y-2 pt-1 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-pink-400 font-semibold">Show Objective Line Z = 3x + 4y</span>
              <button
                onClick={() => updateLinearInequalitiesParams({ showObjectiveLine: !showObjectiveLine })}
                className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                  showObjectiveLine ? 'bg-pink-500' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${
                    showObjectiveLine ? 'left-4.5' : 'left-0.5'
                  }`}
                />
              </button>
            </div>

            {showObjectiveLine && (
              <TouchSlider
                label="Sweep Objective Value (Z)"
                value={objectiveZ}
                min={0}
                max={28}
                step={0.5}
                unit=""
                onChange={(val) => setObjectiveZ(val)}
              />
            )}
          </div>
        </div>
      </BottomSheet>
    </div>
  );
};
