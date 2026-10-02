import React, { useState } from 'react';
import { 
  Zap, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  Sparkles, 
  ArrowRight, 
  RotateCcw, 
  Lightbulb, 
  X,
  Target,
  Trophy,
  AlertTriangle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useSimulatorStore } from '../../store/useSimulatorStore';
import { SIMULATORS } from '../../data/simulators';
import { MathFormula, BlockMath, InlineMath } from './MathFormula';
import { useHaptics } from '../../hooks/useHaptics';
import { useSound } from './SoundManager';
import { POEOption } from '../../types/simulators';

export const PredictObserveExplainModal: React.FC = () => {
  const { 
    isPOEModalOpen, 
    closePOEModal, 
    activeSimulatorId, 
    currentRoute,
    poePredictions,
    recordPOEPrediction,
    // Simulator parameter updaters for live POE preset execution
    updateLimitsDerivativesParams,
    updateStatisticsParams,
    updateSurfaceAreaParams,
    updateCircleChordsParams,
    updateLinearInequalitiesParams,
    updatePermutationsCombinationsParams,
    updateHeronParams,
    updateDroneParams,
    updateUnitCircleParams,
    updateConicParams,
    updateVectorParams,
  } = useSimulatorStore();

  const { lightTap, successBuzz, errorBuzz } = useHaptics();
  const { playClick, playChime, playError } = useSound();

  const currentSimId = activeSimulatorId || (currentRoute !== 'home' && currentRoute !== 'landing' && currentRoute !== 'teacher' ? currentRoute : null);
  const metadata = SIMULATORS.find((s) => s.id === currentSimId);
  const poe = metadata?.poeInquiry;

  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasCommitted, setHasCommitted] = useState<boolean>(false);
  const [hasObservedLive, setHasObservedLive] = useState<boolean>(false);

  // If already predicted in history, prefill state
  React.useEffect(() => {
    if (poe && poePredictions[poe.id]) {
      setSelectedOptionId(poePredictions[poe.id].selectedOptionId);
      setHasCommitted(true);
    } else {
      setSelectedOptionId(null);
      setHasCommitted(false);
      setHasObservedLive(false);
    }
  }, [poe, isPOEModalOpen]);

  if (!isPOEModalOpen || !poe || !metadata) return null;

  const selectedOption = poe.options.find((o) => o.id === selectedOptionId);
  const isCorrect = selectedOption?.isCorrect ?? false;

  const handleSelectOption = (optId: string) => {
    if (hasCommitted) return;
    lightTap();
    playClick();
    setSelectedOptionId(optId);
  };

  const handleCommitPrediction = () => {
    if (!selectedOptionId || !selectedOption) return;
    setHasCommitted(true);

    if (isCorrect) {
      successBuzz();
      playChime();
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } else {
      errorBuzz();
      playError();
    }

    recordPOEPrediction(poe.id, selectedOptionId, isCorrect, poe.xpReward);
  };

  const handleApplySimulatorPreset = () => {
    lightTap();
    playClick();
    setHasObservedLive(true);

    // Apply specific scenario presets based on simulator
    if (metadata.id === 'limits-derivatives-lab') {
      updateLimitsDerivativesParams({
        functionType: 'x2',
        x0: 1.5,
        hStep: 0.05,
        isApproachingZero: true,
        showSecantLine: true,
        showTangentLine: true,
      });
    } else if (metadata.id === 'statistics-visualizer') {
      updateStatisticsParams({
        outlierValue: 18,
        showMeanFulcrum: true,
        showMedianLine: true,
      });
    } else if (metadata.id === 'surface-area-volumes') {
      updateSurfaceAreaParams({
        solidType: 'cylinder',
        liquidPourProgress: 0,
        isPouring: true,
        unfoldPercent: 0,
      });
    } else if (metadata.id === 'circle-chords-cyclic') {
      updateCircleChordsParams({
        mode: 'cyclic-quadrilateral',
        showSupplementarySum: true,
      });
    } else if (metadata.id === 'linear-inequalities') {
      updateLinearInequalitiesParams({
        a1: 1, b1: 1, c1: 6,
        a2: 2, b2: 1, c2: 8,
        testPointX: 0, testPointY: 0,
      });
    } else if (metadata.id === 'permutations-combinations') {
      updatePermutationsCombinationsParams({
        mode: 'combinations',
        nTotal: 4,
        rChosen: 2,
      });
    } else if (metadata.id === 'heron-triangles') {
      updateHeronParams({
        ax: 2, ay: 2,
        bx: 10, by: 2,
        cx: 6, cy: 5,
        showIncircle: true,
      });
    } else if (metadata.id === 'unit-circle') {
      updateUnitCircleParams({
        angleDeg: 150,
        isPlayingAnimation: false,
      });
    }

    // Close modal to let student observe the live canvas
    setTimeout(() => {
      closePOEModal();
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl max-h-[92vh] flex flex-col bg-slate-900 border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden text-slate-100"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex-none p-4 bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-900 border-b border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
              <Zap className="w-4 h-4 fill-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950/70 border border-amber-700/50 px-2 py-0.5 rounded-full">
                  Predict · Observe · Explain
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  +{poe.xpReward} XP
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white leading-tight">
                {poe.title}
              </h2>
            </div>
          </div>
          <button
            onClick={() => {
              lightTap();
              closePOEModal();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs sm:text-sm">
          {/* Scenario Card */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400">
              <Eye className="w-4 h-4" />
              <span>Experiment Scenario</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              {poe.scenario}
            </p>
            {poe.latex && (
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-center font-mono text-cyan-300">
                <BlockMath math={poe.latex} />
              </div>
            )}
          </div>

          {/* Inquiry Question */}
          <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-800/40">
            <div className="flex items-start gap-2">
              <HelpCircle className="w-4 h-4 text-amber-400 flex-none mt-0.5" />
              <div>
                <span className="font-bold text-amber-300 block mb-0.5">
                  Your Prediction Question:
                </span>
                <span className="text-slate-200 font-medium">
                  {poe.question}
                </span>
              </div>
            </div>
          </div>

          {/* Multiple Choice Options */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              {!hasCommitted ? 'Step 1: Commit Your Prediction' : 'Your Selected Prediction'}
            </label>
            <div className="grid gap-2">
              {poe.options.map((option, idx) => {
                const isSelected = selectedOptionId === option.id;
                let cardStyle = 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300';

                if (hasCommitted) {
                  if (option.isCorrect) {
                    cardStyle = 'bg-emerald-950/40 border-emerald-500/80 text-emerald-200';
                  } else if (isSelected && !option.isCorrect) {
                    cardStyle = 'bg-red-950/40 border-red-500/80 text-red-200';
                  } else {
                    cardStyle = 'bg-slate-950/30 border-slate-900 text-slate-500 opacity-60';
                  }
                } else if (isSelected) {
                  cardStyle = 'bg-amber-500/15 border-amber-500 text-amber-200 shadow-md shadow-amber-950/30';
                }

                return (
                  <button
                    key={option.id}
                    disabled={hasCommitted}
                    onClick={() => handleSelectOption(option.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${cardStyle}`}
                  >
                    <span className={`w-5 h-5 rounded-full flex-none flex items-center justify-center text-xs font-bold border mt-0.5 ${
                      isSelected ? 'border-amber-400 bg-amber-400 text-slate-950' : 'border-slate-700 text-slate-400'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <div className="flex-1">
                      <div className="font-medium text-xs sm:text-sm">
                        {option.label}
                      </div>
                      {option.latex && (
                        <div className="mt-1 text-xs">
                          <InlineMath math={option.latex} />
                        </div>
                      )}
                      {hasCommitted && isSelected && (
                        <div className="mt-1.5 text-xs text-slate-300 font-sans border-t border-slate-800/80 pt-1.5">
                          {option.explanation}
                        </div>
                      )}
                    </div>
                    {hasCommitted && option.isCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-none mt-0.5" />
                    )}
                    {hasCommitted && isSelected && !option.isCorrect && (
                      <XCircle className="w-4 h-4 text-red-400 flex-none mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reveal & Coaching Explanation (Phase 2 & 3) */}
          {hasCommitted && (
            <div className="space-y-3 pt-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {/* Feedback Banner */}
              <div className={`p-3.5 rounded-xl border flex items-start gap-2.5 ${
                isCorrect 
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300' 
                  : 'bg-amber-950/30 border-amber-500/40 text-amber-300'
              }`}>
                {isCorrect ? (
                  <Trophy className="w-5 h-5 text-emerald-400 flex-none mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-400 flex-none mt-0.5" />
                )}
                <div>
                  <span className="font-bold block text-sm">
                    {isCorrect ? 'Outstanding Intuition!' : 'Concept Misconception Alert!'}
                  </span>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {isCorrect 
                      ? 'You correctly predicted the invariant mathematical behavior before looking at the formulas!'
                      : 'This is the exact trap that 78% of students in coaching classes fall into because of rote memorization.'}
                  </p>
                </div>
              </div>

              {/* Coach Mental Model Anchor */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-cyan-800/40 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300 uppercase tracking-wide">
                  <Lightbulb className="w-4 h-4 text-cyan-400" />
                  <span>{"Why Coaching Institutes Don't Teach This Intuition:"}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {poe.coachTakeaway}
                </p>
              </div>

              {/* Step 2: Live In-Simulator Verification */}
              <div className="p-3 rounded-xl bg-gradient-to-r from-cyan-950/40 to-slate-900 border border-cyan-500/30 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] font-bold text-cyan-300 block">
                    Step 2: Observe Live on Canvas
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {poe.observationInstruction}
                  </span>
                </div>
                <button
                  onClick={handleApplySimulatorPreset}
                  className="flex-none px-3 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 active:scale-95 transition-all shadow-lg shadow-cyan-950/50 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Observe Live</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex-none p-3 sm:p-4 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={() => {
              lightTap();
              closePOEModal();
            }}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Close
          </button>

          {!hasCommitted ? (
            <button
              disabled={!selectedOptionId}
              onClick={handleCommitPrediction}
              className={`px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                selectedOptionId
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-950/40 hover:brightness-110 active:scale-95'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <span>Lock in My Prediction</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleApplySimulatorPreset}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center gap-1.5 active:scale-95 transition-all shadow-md cursor-pointer"
            >
              <span>Verify in Simulator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
