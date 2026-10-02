import React, { Suspense, useEffect, useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import confetti from 'canvas-confetti';
import { 
  Orbit, 
  Sparkles, 
  RotateCcw, 
  CheckCircle2, 
  Sliders, 
  Layers, 
  Eye, 
  Maximize2,
  Zap,
  Info
} from 'lucide-react';
import { useSimulatorStore } from '../../store/useSimulatorStore';
import { BottomSheet } from '../layout/BottomSheet';
import { TouchSlider } from '../common/TouchSlider';
import { MathFormula } from '../common/MathFormula';
import { CoachTheoryModule } from '../common/CoachTheoryModule';
import { FloatingJoystick } from '../common/FloatingJoystick';
import { ChallengeManager } from '../common/ChallengeManager';
import { DoubleCone } from './conic3d/DoubleCone';
import { LaserCuttingPlane } from './conic3d/LaserCuttingPlane';
import { ConicIntersectionCurve } from './conic3d/ConicIntersectionCurve';
import { usePerformanceMode } from '../../hooks/usePerformanceMode';

export const ConeSlicer: React.FC = () => {
  const {
    conicParams,
    updateConicParams,
    resetParams,
    completeChallenge,
    challengeCompleted,
    addXp,
    isZenMode,
  } = useSimulatorStore();

  const { dpr, enableAntialias, isLowEnd } = usePerformanceMode();

  const [showJoystick, setShowJoystick] = useState(true);

  const { planeAngleDeg, planeHeight, planeRollDeg, coneApertureDeg, showWireframe, showCuttingPlane, showTraceLine, flashlightIntensity } = conicParams;

  const alphaRad = (coneApertureDeg * Math.PI) / 180;
  const thetaRad = (planeAngleDeg * Math.PI) / 180;

  // Eccentricity e = sin(theta) / cos(alpha)
  const eccentricity = Math.sin(thetaRad) / Math.cos(alphaRad);

  // Exact Conic Section Classification and Mathematical Equation
  const conicInfo = useMemo(() => {
    const isDegenerate = Math.abs(planeHeight) < 0.05 && planeAngleDeg <= coneApertureDeg;

    if (isDegenerate) {
      return {
        type: 'Point / Degenerate Conic',
        tag: 'Origin Vertex',
        color: '#94a3b8',
        equation: 'x² + y² = 0 (Single Point at Apex)',
        cartesianStandard: '(x - 0)² + (y - 0)² = 0',
        explanation: 'The cutting plane passes directly through the double cone vertex (apex).',
        eLabel: `e = ${eccentricity.toFixed(2)}`,
      };
    }

    if (planeAngleDeg < 2) {
      const radius = Math.abs(planeHeight) * Math.tan(alphaRad);
      return {
        type: 'Circle',
        tag: 'θ = 0° (Perpendicular to Axis)',
        color: '#38bdf8',
        equation: `x² + y² = r²  (r = ${radius.toFixed(2)})`,
        cartesianStandard: `x² + y² = ${(radius * radius).toFixed(2)}`,
        explanation: 'Plane cuts perpendicular to the axis of symmetry (e = 0).',
        eLabel: 'e = 0.00',
      };
    }

    if (Math.abs(planeAngleDeg - coneApertureDeg) <= 2) {
      return {
        type: 'Parabola',
        tag: 'θ = α (Parallel to Generator)',
        color: '#f59e0b',
        equation: 'y² = 4ax  (Single Open Branch)',
        cartesianStandard: `y² = 4 · ${(0.5 * Math.tan(alphaRad)).toFixed(2)} · x`,
        explanation: 'Cutting plane is strictly parallel to the cone generator slope (e = 1.00).',
        eLabel: 'e = 1.00',
      };
    }

    if (planeAngleDeg < coneApertureDeg) {
      const a = (Math.abs(planeHeight) * 0.8) / Math.max(0.1, 1 - eccentricity * eccentricity);
      const b = a * Math.sqrt(Math.max(0.01, 1 - eccentricity * eccentricity));
      return {
        type: 'Ellipse',
        tag: '0° < θ < α (Cuts One Nappe)',
        color: '#34d399',
        equation: 'x²/a² + y²/b² = 1  (Closed Loop)',
        cartesianStandard: `x²/${(a * a).toFixed(1)} + y²/${(b * b).toFixed(1)} = 1`,
        explanation: 'Cutting plane forms a closed bound curve intersecting all generators of one nappe.',
        eLabel: `e = ${eccentricity.toFixed(2)} (< 1)`,
      };
    }

    // Hyperbola (planeAngleDeg > coneApertureDeg)
    return {
      type: 'Hyperbola',
      tag: 'θ > α (Cuts Both Nappes)',
      color: '#f43f5e',
      equation: 'x²/a² - y²/b² = 1  (Dual Branches)',
      cartesianStandard: `x²/1.2 - y²/1.8 = 1`,
      explanation: 'Plane cuts both the upper and lower nappes, producing two symmetric unbounded branches.',
      eLabel: `e = ${eccentricity.toFixed(2)} (> 1)`,
    };
  }, [planeAngleDeg, coneApertureDeg, planeHeight, alphaRad, eccentricity]);

  // Check educational missions
  useEffect(() => {
    if (conicInfo.type === 'Parabola' && !challengeCompleted['cone_parabola_mission']) {
      completeChallenge('cone_parabola_mission', 50);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#38bdf8', '#34d399'],
      });
    } else if (conicInfo.type === 'Hyperbola' && !challengeCompleted['cone_hyperbola_mission']) {
      completeChallenge('cone_hyperbola_mission', 40);
    } else if (conicInfo.type === 'Circle' && !challengeCompleted['cone_circle_mission']) {
      completeChallenge('cone_circle_mission', 30);
    }
  }, [conicInfo.type, challengeCompleted, completeChallenge]);

  return (
    <div className="relative w-full flex-1 min-h-0 h-full overflow-hidden flex flex-col bg-slate-950">
      {/* 3D WebGL Scene Stage with R3F Canvas */}
      <div className="relative w-full h-full flex-1">
        <Canvas
          dpr={[1, dpr]}
          gl={{ antialias: enableAntialias, alpha: true, powerPreference: 'high-performance' }}
          className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
        >
          <PerspectiveCamera makeDefault position={[3.6, 2.5, 4.2]} fov={45} />
          <OrbitControls
            enableDamping
            dampingFactor={0.05}
            minDistance={2.5}
            maxDistance={10}
            maxPolarAngle={Math.PI / 2 + 0.3}
          />

          {/* Ambient & Directional Lighting */}
          <ambientLight intensity={0.6 * flashlightIntensity} />
          <directionalLight position={[5, 8, 5]} intensity={1.2 * flashlightIntensity} />
          <pointLight position={[-4, 3, -3]} intensity={0.8} color="#38bdf8" />
          <pointLight position={[3, -2, 3]} intensity={0.6} color="#f43f5e" />

          {/* Double Cone 3D Geometry */}
          <Suspense fallback={null}>
            <DoubleCone
              apertureRad={alphaRad}
              height={2.2}
              wireframe={showWireframe}
            />

            {/* Glowing Laser Cutting Plane */}
            {showCuttingPlane && (
              <LaserCuttingPlane
                tiltDeg={planeAngleDeg}
                rollDeg={planeRollDeg}
                heightOffset={planeHeight}
                size={4.0}
              />
            )}

            {/* High-Precision Conic Intersection Curve */}
            {showTraceLine && (
              <ConicIntersectionCurve
                tiltDeg={planeAngleDeg}
                heightOffset={planeHeight}
                apertureDeg={coneApertureDeg}
              />
            )}
          </Suspense>

          {/* Subtle Ground Stage Floor */}
          <gridHelper args={[8, 16, '#1e293b', '#0f172a']} position={[0, -2.4, 0]} />
        </Canvas>

        {/* Dynamic Mathematical HUD Overlay (Top-Right) */}
        {!isZenMode && (
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-slate-900/85 backdrop-blur-md border border-slate-700/80 px-2.5 py-1.5 rounded-xl text-[10px] sm:text-xs shadow-lg pointer-events-none transition-all z-10 space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] uppercase font-bold text-slate-400">Type:</span>
              <span
                style={{ color: conicInfo.color }}
                className="font-bold font-mono text-[10px] sm:text-xs"
              >
                {conicInfo.type.split('/')[0]}
              </span>
            </div>

            <div className="flex items-center gap-1 font-mono text-[10px]">
              <span className="text-slate-400">e:</span>
              <span className="font-bold text-amber-300">{eccentricity.toFixed(2)}</span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-400">θ:</span>
              <span className="font-bold text-cyan-300">{planeAngleDeg}°</span>
            </div>
          </div>
        )}

        {/* Progressive Challenge Manager */}
        <ChallengeManager
          simulatorId="conic-sections"
          simulatorTitle="Flashlight & Cone Slicer: 3D Conic Sections"
          levels={[
            {
              levelNumber: 1,
              title: 'Level 1: Cut a Perfect Circle',
              badge: 'Perpendicular Slice',
              description: 'Position laser cutting plane perpendicular to cone symmetry axis (θ = 0°) at non-zero height offset.',
              requirementFormula: 'θ = 0° · e = 0 · x² + y² = r²',
              targetCriteria: 'Set tilt θ = 0° and observe closed circular cross-section',
              xpReward: 40,
              autoPreset: () => updateConicParams({ planeAngleDeg: 0, planeHeight: 0.8 }),
            },
            {
              levelNumber: 2,
              title: 'Level 2: Slice a Parabola (e = 1)',
              badge: 'Parallel to Generator',
              description: 'Match the cutting plane angle θ strictly to the cone semi-aperture α (45°), yielding an open single branch.',
              requirementFormula: 'θ = α = 45° · e = 1.00 · y² = 4ax',
              targetCriteria: 'Set plane angle θ = 45° to produce exact parabolic curve',
              xpReward: 50,
              autoPreset: () => updateConicParams({ planeAngleDeg: 45, planeHeight: 0.5 }),
            },
            {
              levelNumber: 3,
              title: 'Level 3: Dual-Nappe Hyperbola (e > 1)',
              badge: 'Two Open Branches',
              description: 'Tilt the laser cutting plane steeper than the cone aperture (θ > α) to slice both upper and lower nappes simultaneously.',
              requirementFormula: 'θ = 65° > α · e = 1.28 > 1 · x²/a² - y²/b² = 1',
              targetCriteria: 'Set plane angle θ = 65° to slice both cone halves',
              xpReward: 60,
              autoPreset: () => updateConicParams({ planeAngleDeg: 65, planeHeight: 0.3 }),
            },
          ]}
          onTriggerPreset={(lvl) => {
            if (lvl === 1) updateConicParams({ planeAngleDeg: 0, planeHeight: 0.8 });
            else if (lvl === 2) updateConicParams({ planeAngleDeg: 45, planeHeight: 0.5 });
            else if (lvl === 3) updateConicParams({ planeAngleDeg: 65, planeHeight: 0.3 });
          }}
        />

        {/* Floating Laser Plane Joystick (Bottom-Left on desktop only to keep mobile 100% clean) */}
        {showJoystick && (
          <div className="hidden sm:block absolute bottom-28 left-3 z-30 pointer-events-auto">
            <FloatingJoystick
              angleDeg={planeAngleDeg}
              heightOffset={planeHeight}
              onAngleChange={(angle) => updateConicParams({ planeAngleDeg: angle })}
              onHeightChange={(height) => updateConicParams({ planeHeight: height })}
            />
          </div>
        )}

        {/* Touch Orbit Guide (Top-Left) */}
        <div className="absolute top-3 left-3 pointer-events-none hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 backdrop-blur-sm">
          <Orbit className="w-3.5 h-3.5 text-cyan-400" />
          <span>Touch & rotate 3D camera / use joystick to tilt plane</span>
        </div>
      </div>

      {/* Mobile Collapsible Bottom Sheet - Conic Slicer Parameters */}
      <BottomSheet
        title="The Flashlight & Cone Slicer: 3D Conics"
        badgeLabel={`${conicInfo.type} (e = ${eccentricity.toFixed(2)})`}
        quickEquation={conicInfo.equation}
        onReset={() => resetParams('conic-sections')}
        theoryContent={
          <CoachTheoryModule
            simulatorId="conic-sections"
            extraLiveDetails={
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-xl bg-cyan-950/30 border border-cyan-800/40">
                    <span className="text-[10px] text-cyan-300 block font-semibold">Active Conic Section:</span>
                    <span className="font-bold text-white text-xs">{conicInfo.type}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-amber-950/30 border border-amber-800/40">
                    <span className="text-[10px] text-amber-300 block font-semibold">Eccentricity e = sin(θ)/cos(α):</span>
                    <span className="font-mono text-white font-bold">{eccentricity.toFixed(3)}</span>
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800 text-center font-mono text-xs text-cyan-300">
                  {conicInfo.equation}
                </div>
              </div>
            }
          />
        }
        challengeContent={
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1.5">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Class 11 Conic Section Missions
              </span>
              <p className="text-slate-300">
                Adjust plane tilt θ to strike exact conic sections and earn curriculum mastery XP.
              </p>
            </div>

            <div className="space-y-2">
              <div
                className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
                  challengeCompleted['cone_parabola_mission']
                    ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="font-semibold text-white">Mission 1: Strike a Parabola</div>
                  <div className="text-[11px] text-slate-400">
                    Match cutting plane angle θ = {coneApertureDeg}° (cone semi-angle α)
                  </div>
                </div>
                {challengeCompleted['cone_parabola_mission'] ? (
                  <span className="flex items-center gap-1 font-bold text-emerald-400 text-xs">
                    <CheckCircle2 className="w-4 h-4" />
                    +50 XP
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => updateConicParams({ planeAngleDeg: coneApertureDeg, planeHeight: 0.5 })}
                    className="text-xs font-mono text-amber-400 bg-amber-950/60 px-2 py-1 rounded border border-amber-800/40"
                  >
                    Set θ = {coneApertureDeg}°
                  </button>
                )}
              </div>

              <div
                className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
                  challengeCompleted['cone_hyperbola_mission']
                    ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="font-semibold text-white">Mission 2: Dual Nappe Hyperbola</div>
                  <div className="text-[11px] text-slate-400">
                    Steepen plane angle θ &gt; {coneApertureDeg}° to slice both upper and lower nappes
                  </div>
                </div>
                {challengeCompleted['cone_hyperbola_mission'] ? (
                  <span className="flex items-center gap-1 font-bold text-emerald-400 text-xs">
                    <CheckCircle2 className="w-4 h-4" />
                    +40 XP
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => updateConicParams({ planeAngleDeg: 65, planeHeight: 0.3 })}
                    className="text-xs font-mono text-amber-400 bg-amber-950/60 px-2 py-1 rounded border border-amber-800/40"
                  >
                    Set θ = 65°
                  </button>
                )}
              </div>
            </div>
          </div>
        }
      >
        {/* Controls Tab */}
        <div className="space-y-2">
          <TouchSlider
            label="Plane Tilt Angle (θ)"
            min={0}
            max={85}
            step={1}
            unit="°"
            value={planeAngleDeg}
            onChange={(val) => updateConicParams({ planeAngleDeg: val })}
          />

          <TouchSlider
            label="Plane Height Offset (h)"
            min={-1.8}
            max={1.8}
            step={0.1}
            value={planeHeight}
            onChange={(val) => updateConicParams({ planeHeight: val })}
            formatValue={(v) => `${v > 0 ? '+' : ''}${v.toFixed(1)} u`}
          />

          <TouchSlider
            label="Cone Semi-Aperture (α)"
            min={30}
            max={60}
            step={1}
            unit="°"
            value={coneApertureDeg}
            onChange={(val) => updateConicParams({ coneApertureDeg: val })}
          />

          {/* Quick Preset Buttons for High School Students */}
          <div className="pt-1.5 border-t border-slate-800/80">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
              Conic Presets
            </span>
            <div className="grid grid-cols-4 gap-1.5">
              <button
                type="button"
                onClick={() => updateConicParams({ planeAngleDeg: 0, planeHeight: 0.8 })}
                className="py-1 px-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-[10px] font-medium text-cyan-300 border border-slate-700/60 transition-colors text-center truncate cursor-pointer"
              >
                Circle (0°)
              </button>
              <button
                type="button"
                onClick={() => updateConicParams({ planeAngleDeg: 25, planeHeight: 0.5 })}
                className="py-1 px-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-[10px] font-medium text-emerald-300 border border-slate-700/60 transition-colors text-center truncate cursor-pointer"
              >
                Ellipse (25°)
              </button>
              <button
                type="button"
                onClick={() => updateConicParams({ planeAngleDeg: coneApertureDeg, planeHeight: 0.6 })}
                className="py-1 px-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-[10px] font-medium text-amber-300 border border-amber-900/40 transition-colors text-center truncate cursor-pointer"
              >
                Parabola (α)
              </button>
              <button
                type="button"
                onClick={() => updateConicParams({ planeAngleDeg: 68, planeHeight: 0.3 })}
                className="py-1 px-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-[10px] font-medium text-rose-300 border border-rose-900/40 transition-colors text-center truncate cursor-pointer"
              >
                Hyperbola
              </button>
            </div>
          </div>

          {/* Display & Slicing Toggles */}
          <div className="pt-1.5 border-t border-slate-800/80 grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => updateConicParams({ showWireframe: !showWireframe })}
              className={`p-1.5 rounded-lg border text-[11px] font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                showWireframe
                  ? 'bg-cyan-950/50 border-cyan-700 text-cyan-300'
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
            >
              <span>Wireframe</span>
              <Layers className="w-3 h-3" />
            </button>

            <button
              type="button"
              onClick={() => updateConicParams({ showCuttingPlane: !showCuttingPlane })}
              className={`p-1.5 rounded-lg border text-[11px] font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                showCuttingPlane
                  ? 'bg-rose-950/50 border-rose-700 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
            >
              <span>Laser Plane</span>
              <Eye className="w-3 h-3" />
            </button>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
};
