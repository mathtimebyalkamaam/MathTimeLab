/**
 * StatisticsVisualizerSimulator.tsx: Interactive Data Fulcrum, Histogram & Outlier Tug-of-War (Class 9 Statistics).
 * Features:
 * - Balancing Seesaw Fulcrum: Data points stacked as weights along a numbered beam; fulcrum balances at exactly the Mean x̄!
 * - Median marker: 50th percentile rank divider unaffected by wild endpoints
 * - Mode indicator: tallest column frequency peak
 * - Outlier Tug-of-War: drag an outlier from 25 to 85, watching the Mean get yanked while the Median stays rock-steady!
 * - Frequency histogram with adjustable bin widths & frequency polygon overlay
 * - Karl Pearson's empirical relation: Mode ≈ 3·Median - 2·Mean
 * - 3 Progressive board exam challenges
 */
import React, { useEffect, useRef, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { 
  BarChart3, 
  RotateCcw, 
  CheckCircle2, 
  Scale, 
  Sliders, 
  Eye, 
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { useSimulatorStore } from '../../store/useSimulatorStore';
import { BottomSheet } from '../layout/BottomSheet';
import { TouchSlider } from '../common/TouchSlider';
import { CoachTheoryModule } from '../common/CoachTheoryModule';
import { ChallengeManager, ChallengeLevel } from '../common/ChallengeManager';
import { useHaptics } from '../../hooks/useHaptics';
import { useSound } from '../common/SoundManager';
import { useAnalytics } from '../../hooks/useAnalytics';

export const StatisticsVisualizerSimulator: React.FC = () => {
  const {
    statisticsParams,
    updateStatisticsParams,
    resetParams,
    completeChallenge,
    challengeCompleted,
    isZenMode,
  } = useSimulatorStore();

  const {
    mode,
    dataPoints,
    outlierValue,
    binWidth,
    showMeanFulcrum,
    showMedianLine,
    showModePeak,
    showFrequencyPolygon,
  } = statisticsParams;

  const { lightTap, successBuzz } = useHaptics();
  const { playClick, playChime } = useSound();
  const { trackEvent } = useAnalytics();

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Full dataset with dynamic outlier
  const activeDataset = [...dataPoints.slice(0, dataPoints.length - 1), outlierValue].sort((a, b) => a - b);
  const n = activeDataset.length;

  // Mean calculation
  const sum = activeDataset.reduce((acc, val) => acc + val, 0);
  const mean = sum / n;

  // Median calculation
  const mid = Math.floor(n / 2);
  const median = n % 2 !== 0 ? activeDataset[mid] : (activeDataset[mid - 1] + activeDataset[mid]) / 2;

  // Mode calculation
  const freqMap: Record<number, number> = {};
  activeDataset.forEach((val) => {
    freqMap[val] = (freqMap[val] || 0) + 1;
  });
  let maxFreq = 0;
  let modeVal = activeDataset[0];
  Object.entries(freqMap).forEach(([k, count]) => {
    if (count > maxFreq) {
      maxFreq = count;
      modeVal = Number(k);
    }
  });

  // Empirical mode estimate
  const empiricalMode = 3 * median - 2 * mean;

  // Board Exam Challenge Evaluation
  useEffect(() => {
    // Challenge 1: Fulcrum Center of Gravity (Mean where torque = 0)
    if (showMeanFulcrum && !challengeCompleted['stat_fulcrum_balance']) {
      completeChallenge('stat_fulcrum_balance', 40);
      successBuzz();
      playChime();
      confetti({ particleCount: 35, spread: 60 });
      trackEvent('challenge_completed', { challengeId: 'stat_fulcrum_balance' });
    }

    // Challenge 2: Outlier Tug-of-War Discovery
    if (outlierValue >= 70 && !challengeCompleted['stat_outlier_tug']) {
      completeChallenge('stat_outlier_tug', 45);
      successBuzz();
      playChime();
      confetti({ particleCount: 45, spread: 65 });
      trackEvent('challenge_completed', { challengeId: 'stat_outlier_tug' });
    }

    // Challenge 3: Histogram Bin Explorer
    if (mode === 'histogram' && binWidth >= 10 && !challengeCompleted['stat_histogram_bins']) {
      completeChallenge('stat_histogram_bins', 50);
      successBuzz();
      playChime();
      confetti({ particleCount: 50, spread: 70 });
      trackEvent('challenge_completed', { challengeId: 'stat_histogram_bins' });
    }
  }, [
    showMeanFulcrum,
    outlierValue,
    mode,
    binWidth,
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

      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      const gridSize = 24;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      const marginX = 40;
      const beamY = height * 0.65;
      const minXVal = 0;
      const maxXVal = 100;

      const toScreenX = (val: number) => {
        return marginX + ((val - minXVal) / (maxXVal - minXVal)) * (width - 2 * marginX);
      };

      if (mode === 'fulcrum' || mode === 'outlier-tug') {
        // Wooden balance beam
        ctx.fillStyle = '#334155';
        ctx.fillRect(marginX - 10, beamY, width - 2 * marginX + 20, 8);
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(marginX - 10, beamY, width - 2 * marginX + 20, 8);

        // Axis ticks every 10 units
        for (let v = 0; v <= 100; v += 10) {
          const sx = toScreenX(v);
          ctx.strokeStyle = '#475569';
          ctx.beginPath();
          ctx.moveTo(sx, beamY);
          ctx.lineTo(sx, beamY + 8);
          ctx.stroke();
          ctx.fillStyle = '#94a3b8';
          ctx.font = '10px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(v.toString(), sx, beamY + 22);
        }

        // Draw stacked weights for data points
        const stackedCounts: Record<number, number> = {};
        activeDataset.forEach((val) => {
          const count = stackedCounts[val] || 0;
          stackedCounts[val] = count + 1;
          const sx = toScreenX(val);
          const sy = beamY - 14 - count * 20;

          // Block weight
          const isOutlier = val === outlierValue && val >= 40;
          ctx.fillStyle = isOutlier ? 'rgba(239, 68, 68, 0.4)' : 'rgba(56, 189, 248, 0.35)';
          ctx.strokeStyle = isOutlier ? '#f87171' : '#38bdf8';
          ctx.lineWidth = 2;
          ctx.fillRect(sx - 10, sy, 20, 18);
          ctx.strokeRect(sx - 10, sy, 20, 18);

          ctx.fillStyle = '#f8fafc';
          ctx.font = 'bold 9px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(val.toString(), sx, sy + 13);
        });

        // Fulcrum Knife-Edge at the Mean (where torque Σ(x - x̄) = 0)
        if (showMeanFulcrum) {
          const fulcrumX = toScreenX(mean);
          // Fulcrum Triangle (amber)
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.moveTo(fulcrumX, beamY + 8);
          ctx.lineTo(fulcrumX - 14, beamY + 36);
          ctx.lineTo(fulcrumX + 14, beamY + 36);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = '#fbbf24';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Fulcrum vertical plumb line
          ctx.strokeStyle = '#f59e0b';
          ctx.setLineDash([4, 3]);
          ctx.beginPath();
          ctx.moveTo(fulcrumX, 30);
          ctx.lineTo(fulcrumX, beamY);
          ctx.stroke();
          ctx.setLineDash([]);

          ctx.fillStyle = '#f59e0b';
          ctx.font = 'bold 12px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(`▲ MEAN x̄ = ${mean.toFixed(1)}`, fulcrumX, beamY + 50);
          ctx.font = '10px sans-serif';
          ctx.fillText('(Center of Gravity)', fulcrumX, beamY + 64);
        }

        // Median Marker (50th percentile divider)
        if (showMedianLine) {
          const medianX = toScreenX(median);
          ctx.strokeStyle = '#34d399';
          ctx.lineWidth = 2.5;
          ctx.setLineDash([5, 4]);
          ctx.beginPath();
          ctx.moveTo(medianX, 40);
          ctx.lineTo(medianX, beamY);
          ctx.stroke();
          ctx.setLineDash([]);

          ctx.fillStyle = '#34d399';
          ctx.font = 'bold 11px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(`MEDIAN = ${median.toFixed(1)}`, medianX, 30);
        }

        // Mode Peak Marker
        if (showModePeak && maxFreq > 1) {
          const modeX = toScreenX(modeVal);
          ctx.fillStyle = '#c084fc';
          ctx.font = 'bold 11px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(`MODE = ${modeVal} (${maxFreq}x)`, modeX, beamY - maxFreq * 20 - 20);
        }
      } else if (mode === 'histogram') {
        // Frequency Histogram View
        const bins: Record<number, number> = {};
        for (let b = 0; b < 100; b += binWidth) {
          bins[b] = 0;
        }
        activeDataset.forEach((val) => {
          const binKey = Math.floor(val / binWidth) * binWidth;
          if (bins[binKey] !== undefined) bins[binKey]++;
        });

        const maxBinCount = Math.max(...Object.values(bins), 1);
        const histoBaseY = height * 0.75;
        const histoMaxHeight = height * 0.45;

        // Draw histogram bars
        Object.entries(bins).forEach(([binStr, count]) => {
          const bVal = Number(binStr);
          const sx1 = toScreenX(bVal);
          const sx2 = toScreenX(bVal + binWidth);
          const barW = sx2 - sx1;
          const barH = (count / maxBinCount) * histoMaxHeight;
          const sy = histoBaseY - barH;

          ctx.fillStyle = 'rgba(56, 189, 248, 0.3)';
          ctx.fillRect(sx1, sy, barW - 2, barH);
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(sx1, sy, barW - 2, barH);

          if (count > 0) {
            ctx.fillStyle = '#f8fafc';
            ctx.font = 'bold 11px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(count.toString(), sx1 + barW / 2, sy - 6);
          }

          // Bin labels
          ctx.fillStyle = '#94a3b8';
          ctx.font = '9px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(`${bVal}-${bVal + binWidth}`, sx1 + barW / 2, histoBaseY + 16);
        });

        // Frequency Polygon line overlay
        if (showFrequencyPolygon) {
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          let first = true;
          Object.entries(bins).forEach(([binStr, count]) => {
            const bVal = Number(binStr);
            const midX = toScreenX(bVal + binWidth / 2);
            const midY = histoBaseY - (count / maxBinCount) * histoMaxHeight;
            if (first) {
              ctx.moveTo(midX, midY);
              first = false;
            } else {
              ctx.lineTo(midX, midY);
            }
          });
          ctx.stroke();
        }
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    window.addEventListener('resize', render);
    return () => {
      window.removeEventListener('resize', render);
      cancelAnimationFrame(animId);
    };
  }, [
    mode,
    activeDataset,
    outlierValue,
    mean,
    median,
    modeVal,
    maxFreq,
    binWidth,
    showMeanFulcrum,
    showMedianLine,
    showModePeak,
    showFrequencyPolygon,
  ]);

  const challengeLevels: ChallengeLevel[] = [
    {
      levelNumber: 1,
      title: 'The Fulcrum Balance Point',
      badge: 'Center of Mass',
      description: 'Observe the amber triangle fulcrum. Notice how it sits at the exact Mean (x̄) where positive and negative torques cancel to zero: Σ(x - x̄) = 0!',
      requirementFormula: '\\sum (x_i - \\bar{x}) = 0',
      targetCriteria: 'Enable Mean Balance Fulcrum',
      xpReward: 40,
      autoPreset: () => updateStatisticsParams({ mode: 'fulcrum', showMeanFulcrum: true }),
    },
    {
      levelNumber: 2,
      title: 'The Outlier Tug-of-War',
      badge: 'Outlier Destroyer',
      description: 'Slide the Outlier Value slider past 70. Watch how the Mean gets yanked all the way to the right, while the Median barely budges!',
      requirementFormula: '\\bar{x} \\text{ is sensitive; Median is invariant}',
      targetCriteria: 'Outlier Value ≥ 70',
      xpReward: 45,
      autoPreset: () => updateStatisticsParams({ mode: 'fulcrum', outlierValue: 80 }),
    },
    {
      levelNumber: 3,
      title: 'Histogram Bin Width Explorer',
      badge: 'Frequency Modeler',
      description: 'Switch to Histogram mode and increase the bin width to 10. Observe how continuous class intervals group raw data into columns.',
      requirementFormula: '\\text{Class Intervals} = [a, b)',
      targetCriteria: 'Bin Width ≥ 10 in Histogram mode',
      xpReward: 50,
      autoPreset: () => updateStatisticsParams({ mode: 'histogram', binWidth: 10, showFrequencyPolygon: true }),
    },
  ];

  return (
    <div className="relative w-full h-full flex flex-col bg-slate-950 text-slate-100 overflow-hidden select-none">
      {/* HUD Header Bar */}
      <div className="flex-none px-4 py-2 bg-slate-900/90 border-b border-slate-800 backdrop-blur-md flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <Scale className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold text-slate-200">
            {mode === 'histogram' ? 'FREQUENCY HISTOGRAM' : 'DATA FULCRUM SEESAW'}
          </span>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/40">
            x̄ = {mean.toFixed(1)} · Median = {median.toFixed(1)} · Mode = {modeVal}
          </span>
        </div>

        <button
          onClick={() => {
            resetParams('statistics-visualizer');
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
        <canvas ref={canvasRef} className="w-full h-full block" />

        {/* Live Empirical Formula Box */}
        <div className="absolute top-3 left-3 pointer-events-none bg-slate-900/85 backdrop-blur-md p-2.5 rounded-xl border border-slate-800/80 shadow-xl max-w-xs text-xs space-y-1">
          <div className="text-[11px] font-bold text-cyan-300 uppercase tracking-wide">
            Empirical Law: Mode ≈ 3·Median - 2·Mean
          </div>
          <div className="text-slate-300 font-mono text-[11px]">
            {`3(${median.toFixed(1)}) - 2(${mean.toFixed(1)}) = ${(3 * median - 2 * mean).toFixed(1)}`}
          </div>
          <div className="text-amber-400 text-[10px] flex items-center gap-1 font-semibold">
            <Sparkles className="w-3 h-3" />
            <span>Mean is sensitive to outliers; Median is rock-solid!</span>
          </div>
        </div>
      </div>

      {/* Collapsible Bottom Sheet */}
      <BottomSheet
        title="The Data Fulcrum & Outliers"
        badgeLabel={`Mode: ${mode === 'fulcrum' ? 'Seesaw Fulcrum' : 'Histogram'}`}
        quickEquation="\\text{Mode} \\approx 3\\text{Median} - 2\\bar{x}"
        onReset={() => resetParams('statistics-visualizer')}
        theoryContent={<CoachTheoryModule simulatorId="statistics-visualizer" />}
        challengeContent={
          <div className="space-y-4">
            <ChallengeManager
              simulatorId="statistics-visualizer"
              simulatorTitle="The Data Fulcrum"
              levels={challengeLevels}
              onTriggerPreset={(lvl: number) => {
                const targetLvl = challengeLevels.find((l) => l.levelNumber === lvl);
                targetLvl?.autoPreset?.();
              }}
              isOpenDefault={true}
            />
          </div>
        }
      >
        <div className="space-y-4 text-xs">
          {/* Mode Switcher */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Visualization Mode
            </label>
            <div className="grid grid-cols-2 gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => {
                  updateStatisticsParams({ mode: 'fulcrum' });
                  playClick();
                  lightTap();
                }}
                className={`py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  mode === 'fulcrum'
                    ? 'bg-cyan-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Balance Fulcrum
              </button>
              <button
                onClick={() => {
                  updateStatisticsParams({ mode: 'histogram' });
                  playClick();
                  lightTap();
                }}
                className={`py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  mode === 'histogram'
                    ? 'bg-cyan-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Histogram Bins
              </button>
            </div>
          </div>

          {/* Outlier Slider */}
          <TouchSlider
            label="Outlier Value (Watch Mean Tug-of-War!)"
            value={outlierValue}
            min={20}
            max={95}
            step={1}
            unit=""
            onChange={(val) => updateStatisticsParams({ outlierValue: val })}
          />

          {/* Bin Width Slider for Histogram */}
          {mode === 'histogram' && (
            <>
              <TouchSlider
                label="Histogram Class Interval Width"
                value={binWidth}
                min={5}
                max={20}
                step={5}
                unit="units"
                onChange={(val) => updateStatisticsParams({ binWidth: val })}
              />

              <div className="flex items-center justify-between pt-1">
                <label className="text-slate-300 font-medium">Show Frequency Polygon</label>
                <button
                  onClick={() => updateStatisticsParams({ showFrequencyPolygon: !showFrequencyPolygon })}
                  className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer ${
                    showFrequencyPolygon ? 'bg-amber-500' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                      showFrequencyPolygon ? 'left-5' : 'left-1'
                    }`}
                  />
                </button>
              </div>
            </>
          )}

          {/* Toggles for Mean / Median / Mode */}
          {mode === 'fulcrum' && (
            <div className="space-y-2 pt-1 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-amber-400 font-semibold">Mean Balance Fulcrum</span>
                <button
                  onClick={() => updateStatisticsParams({ showMeanFulcrum: !showMeanFulcrum })}
                  className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                    showMeanFulcrum ? 'bg-amber-500' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${
                      showMeanFulcrum ? 'left-4.5' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-emerald-400 font-semibold">Median 50th Line</span>
                <button
                  onClick={() => updateStatisticsParams({ showMedianLine: !showMedianLine })}
                  className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                    showMedianLine ? 'bg-emerald-500' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${
                      showMedianLine ? 'left-4.5' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}
        </div>
      </BottomSheet>
    </div>
  );
};
