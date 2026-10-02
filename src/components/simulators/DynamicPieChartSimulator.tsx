/**
 * DynamicPieChartSimulator.tsx: Data Handling & Central Angle Pizza Cutter (Class 8 Probability & Statistics).
 * Features:
 * - Dynamic circular pie chart with arc calculation and protractor angle overlay
 * - Live central angle calculator: θ = (frequency / total) × 360°
 * - Multi-dataset switcher: Favorite Sports (72 students), Monthly Family Budget, Daily 24h Routine
 * - Interactive slice frequency adjustments with synchronous 360° sum rebalancing
 * - 3 Progressive Board Exam challenges
 */
import React, { useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  PieChart, 
  RotateCcw, 
  CheckCircle2, 
  Percent, 
  Sliders, 
  Sparkles, 
  Eye, 
  Layers 
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

interface DatasetPreset {
  name: string;
  slices: { label: string; value: number; color: string }[];
}

const PRESETS: Record<string, DatasetPreset> = {
  'favorite-sports': {
    name: 'Favorite Sports (72 Students)',
    slices: [
      { label: 'Cricket', value: 36, color: '#38bdf8' },
      { label: 'Football', value: 18, color: '#10b981' },
      { label: 'Badminton', value: 12, color: '#f59e0b' },
      { label: 'Tennis', value: 6, color: '#ec4899' },
    ],
  },
  'student-budget': {
    name: 'Monthly Family Budget',
    slices: [
      { label: 'Food', value: 12000, color: '#f59e0b' },
      { label: 'House Rent', value: 8000, color: '#38bdf8' },
      { label: 'Education', value: 6000, color: '#a855f7' },
      { label: 'Savings', value: 4000, color: '#10b981' },
    ],
  },
  'daily-activities': {
    name: 'Daily 24-Hour Routine',
    slices: [
      { label: 'Sleep', value: 8, color: '#6366f1' },
      { label: 'School', value: 6, color: '#38bdf8' },
      { label: 'Self Study', value: 4, color: '#10b981' },
      { label: 'Sports & Play', value: 3, color: '#f59e0b' },
      { label: 'Others', value: 3, color: '#ec4899' },
    ],
  },
};

export const DynamicPieChartSimulator: React.FC = () => {
  const {
    dynamicPieChartParams,
    updateDynamicPieChartParams,
    resetParams,
    completeChallenge,
    challengeCompleted,
    isZenMode,
  } = useSimulatorStore();

  const {
    datasetKey,
    slices,
    selectedSliceIndex,
    showProtractorAngle,
    showPercentages,
  } = dynamicPieChartParams;

  const { lightTap, successBuzz } = useHaptics();
  const { playClick, playChime } = useSound();
  const { trackEvent } = useAnalytics();

  // Grand Total of current values
  const totalValue = useMemo(() => {
    return slices.reduce((sum, s) => sum + s.value, 0) || 1;
  }, [slices]);

  // Compute angles and cumulative starting angles for SVG arc paths
  const sliceAngles = useMemo(() => {
    let currentDeg = 0;
    return slices.map((s, index) => {
      const angle = (s.value / totalValue) * 360;
      const startDeg = currentDeg;
      const endDeg = currentDeg + angle;
      currentDeg += angle;
      const pct = (s.value / totalValue) * 100;
      return {
        ...s,
        index,
        angleDeg: angle,
        startDeg,
        endDeg,
        percentage: pct,
      };
    });
  }, [slices, totalValue]);

  const activeSlice = sliceAngles[selectedSliceIndex ?? 0] || sliceAngles[0];

  const handleSliceClick = (index: number) => {
    lightTap();
    playClick();
    updateDynamicPieChartParams({ selectedSliceIndex: index });
    trackEvent('pie_chart_slice_select', { label: slices[index].label });
  };

  const handleSelectPreset = (key: string) => {
    lightTap();
    playClick();
    const preset = PRESETS[key];
    if (preset) {
      updateDynamicPieChartParams({
        datasetKey: key as any,
        slices: preset.slices,
        selectedSliceIndex: 0,
      });
      trackEvent('pie_chart_preset', { preset: key });
    }
  };

  const handleReset = () => {
    lightTap();
    playClick();
    resetParams('dynamic-pie-chart');
  };

  // Challenges for Board Exam mastery
  const challengeLevels: ChallengeLevel[] = [
    {
      levelNumber: 1,
      title: 'The 180° Straight Angle Sector',
      badge: 'Protractor Pro',
      description: 'Select the Cricket slice in Favorite Sports. Verify its central angle is exactly 180.0° (half the circle)!',
      requirementFormula: '\\theta = \\frac{36}{72} \\times 360^\\circ = 180.0^\\circ',
      targetCriteria: 'Select Cricket slice (180°)',
      xpReward: 30,
      tier1Hint: 'Make sure Favorite Sports dataset is active.',
      tier2Hint: 'Tap on the blue Cricket slice.',
      tier3Hint: '36 out of 72 is 1/2 of the students, so angle is 1/2 of 360° = 180°!',
      autoPreset: () => {
        handleSelectPreset('favorite-sports');
        updateDynamicPieChartParams({ selectedSliceIndex: 0 });
      },
    },
    {
      levelNumber: 2,
      title: 'Right Angle Quarter Circle (90°)',
      badge: 'Quarter Cutter',
      description: 'Select Football (18 students). Verify 18/72 = 1/4 of the total, making its central angle exactly 90.0°!',
      requirementFormula: '\\theta = \\frac{18}{72} \\times 360^\\circ = 90.0^\\circ',
      targetCriteria: 'Select Football slice (90°)',
      xpReward: 40,
      tier1Hint: 'Tap on the green Football slice in Favorite Sports.',
      tier2Hint: '18 / 72 = 0.25 (25%).',
      tier3Hint: '25% of 360° is exactly 90° (a right angle sector)!',
      autoPreset: () => {
        handleSelectPreset('favorite-sports');
        updateDynamicPieChartParams({ selectedSliceIndex: 1 });
      },
    },
    {
      levelNumber: 3,
      title: 'Daily Routine: 8 Hours of Sleep (120°)',
      badge: 'Data Analyst',
      description: 'Switch to Daily 24-Hour Routine. Calculate sleep angle: 8 hours out of 24 = 1/3 of the day = 120°!',
      requirementFormula: '\\theta = \\frac{8}{24} \\times 360^\\circ = 120.0^\\circ',
      targetCriteria: 'Select Sleep in Daily 24h Routine',
      xpReward: 50,
      tier1Hint: 'Switch to "Daily 24-Hour Routine" preset.',
      tier2Hint: 'Select the Sleep slice.',
      tier3Hint: '8/24 = 1/3 of the circle = 120°.',
      autoPreset: () => {
        handleSelectPreset('daily-activities');
        updateDynamicPieChartParams({ selectedSliceIndex: 0 });
      },
    },
  ];

  // Auto verify challenges
  React.useEffect(() => {
    if (datasetKey === 'favorite-sports' && selectedSliceIndex === 0 && activeSlice.angleDeg === 180) {
      if (!challengeCompleted['dynamic-pie-chart-1']) {
        successBuzz();
        playChime();
        confetti({ particleCount: 35, spread: 60, origin: { y: 0.6 } });
        completeChallenge('dynamic-pie-chart-1', 30);
      }
    }
    if (datasetKey === 'favorite-sports' && selectedSliceIndex === 1 && activeSlice.angleDeg === 90) {
      if (!challengeCompleted['dynamic-pie-chart-2']) {
        successBuzz();
        playChime();
        confetti({ particleCount: 40, spread: 65, origin: { y: 0.6 } });
        completeChallenge('dynamic-pie-chart-2', 40);
      }
    }
    if (datasetKey === 'daily-activities' && selectedSliceIndex === 0 && Math.abs(activeSlice.angleDeg - 120) < 1) {
      if (!challengeCompleted['dynamic-pie-chart-3']) {
        successBuzz();
        playChime();
        confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
        completeChallenge('dynamic-pie-chart-3', 50);
      }
    }
  }, [datasetKey, selectedSliceIndex, activeSlice, challengeCompleted, completeChallenge, playChime, successBuzz]);

  const controlsContent = (
    <div className="space-y-4 p-4 text-slate-200">
      {/* Dataset Presets */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Curriculum Dataset Presets
        </label>
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(PRESETS).map(([key, p]) => (
            <button
              key={key}
              type="button"
              onClick={() => handleSelectPreset(key)}
              className={`p-2 rounded-xl border text-center transition cursor-pointer ${
                datasetKey === key
                  ? 'bg-pink-500/20 border-pink-400 text-pink-200 shadow-sm'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <div className="text-xs font-bold truncate">{p.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Slices Inspector and Value Adjuster */}
      <div className="space-y-3 bg-slate-900/70 border border-slate-800 rounded-2xl p-3.5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
          <span>Categories ({slices.length} Slices)</span>
          <span className="text-pink-400 font-mono">Total = {totalValue}</span>
        </h4>
        <div className="space-y-2">
          {slices.map((s, idx) => (
            <div
              key={s.label}
              onClick={() => handleSliceClick(idx)}
              className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition ${
                selectedSliceIndex === idx
                  ? 'bg-slate-800 border-pink-500/80 shadow-md'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-xs font-semibold text-white">{s.label}</span>
              </div>
              <div className="text-right font-mono">
                <span className="text-xs font-bold text-white block">{s.value}</span>
                <span className="text-[10px] text-slate-400">
                  {((s.value / totalValue) * 360).toFixed(1)}° ({((s.value / totalValue) * 100).toFixed(0)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Explain Like I'm 13 Card */}
      <Eli13ExplainerCard simulatorId="dynamic-pie-chart" />

      <button
        type="button"
        onClick={handleReset}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/70 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition border border-slate-700/60 cursor-pointer"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Reset to Default Favorite Sports (72 Students)</span>
      </button>
    </div>
  );

  return (
    <div className="relative w-full h-full flex flex-col flex-1 select-none overflow-hidden bg-slate-950">
      {/* Interactive Pie Chart Graphic Canvas */}
      <div className="relative flex-1 w-full min-h-[360px] flex flex-col items-center justify-center p-3 sm:p-6 overflow-hidden">
        {/* Central Angle Calculation Formula Card */}
        <div className="w-full max-w-lg mb-2 p-3 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md shadow-xl text-center">
          <span className="text-[10px] font-mono text-pink-400 uppercase tracking-wider block">
            Central Angle Formula: θ = (Frequency / Total) × 360°
          </span>
          <div className="text-base sm:text-xl font-mono font-bold text-white flex items-center justify-center gap-2 mt-1">
            <span style={{ color: activeSlice.color }}>{activeSlice.label}:</span>
            <span className="text-cyan-300">({activeSlice.value} / {totalValue}) × 360°</span>
            <span className="text-slate-500">=</span>
            <span className="text-pink-300 font-extrabold">{activeSlice.angleDeg.toFixed(1)}°</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
            Represents {activeSlice.percentage.toFixed(1)}% of the full 360° circle
          </span>
        </div>

        {/* SVG Pie Chart */}
        <div className="w-full max-w-md h-64 sm:h-72 flex items-center justify-center">
          <svg viewBox="0 0 280 280" className="w-full h-full drop-shadow-2xl overflow-visible">
            <g transform="translate(140, 140)">
              {/* Outer circular protractor ring */}
              <circle cx="0" cy="0" r="105" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="2 4" />

              {/* Slices */}
              {sliceAngles.map((s) => {
                const r = 95;
                const startRad = ((s.startDeg - 90) * Math.PI) / 180;
                const endRad = ((s.endDeg - 90) * Math.PI) / 180;

                const x1 = r * Math.cos(startRad);
                const y1 = r * Math.sin(startRad);
                const x2 = r * Math.cos(endRad);
                const y2 = r * Math.sin(endRad);

                const largeArc = s.angleDeg > 180 ? 1 : 0;
                const isSelected = selectedSliceIndex === s.index;

                // Center displacement for selected slice
                const midRad = (((s.startDeg + s.endDeg) / 2 - 90) * Math.PI) / 180;
                const dx = isSelected ? 8 * Math.cos(midRad) : 0;
                const dy = isSelected ? 8 * Math.sin(midRad) : 0;

                return (
                  <g
                    key={s.label}
                    transform={`translate(${dx}, ${dy})`}
                    onClick={() => handleSliceClick(s.index)}
                    className="cursor-pointer transition-transform duration-200 hover:opacity-90"
                  >
                    <path
                      d={`M 0,0 L ${x1},${y1} A ${r},${r} 0 ${largeArc},1 ${x2},${y2} Z`}
                      fill={s.color}
                      fillOpacity={isSelected ? 0.85 : 0.45}
                      stroke={s.color}
                      strokeWidth={isSelected ? 2.5 : 1.5}
                    />

                    {/* Sector Label placed inside if angle > 25° */}
                    {s.angleDeg > 25 && (
                      <text
                        x={(r * 0.65) * Math.cos(midRad)}
                        y={(r * 0.65) * Math.sin(midRad)}
                        fill="#ffffff"
                        fontSize="10"
                        fontWeight="bold"
                        textAnchor="middle"
                        fontFamily="sans-serif"
                      >
                        {s.angleDeg.toFixed(0)}°
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Center Pivot Pin */}
              <circle cx="0" cy="0" r="5" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
            </g>
          </svg>
        </div>

        {/* Intuition Footer Pill */}
        <div className="mt-2 text-center text-xs font-mono text-slate-400">
          Tap any slice to inspect its protractor central angle · All angles sum to 360°
        </div>
      </div>

      <BottomSheet
        title="Dynamic Pie Chart & Angles"
        onReset={handleReset}
        theoryContent={<CoachTheoryModule simulatorId="dynamic-pie-chart" />}
        challengeContent={
          <ChallengeManager
            simulatorId="dynamic-pie-chart"
            simulatorTitle="Dynamic Pie Chart & Angles"
            levels={challengeLevels}
          />
        }
      >
        {controlsContent}
      </BottomSheet>
    </div>
  );
};
