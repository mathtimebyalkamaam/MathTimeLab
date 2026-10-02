import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Lightbulb, 
  CheckCircle2, 
  Layers, 
  X, 
  ChevronUp, 
  ChevronDown, 
  BookOpen, 
  Target,
  Sliders,
  Award
} from 'lucide-react';
import { SimulatorId } from '../../types/simulators';
import { getSimulatorGuide, SimulatorStep } from '../../data/simulatorStepsData';
import { BlockMath, InlineMath, MathText } from './MathFormula';
import { useHaptics } from '../../hooks/useHaptics';
import { useSound } from './SoundManager';
import { useSimulatorStore } from '../../store/useSimulatorStore';

interface SimulatorStepWalkthroughProps {
  simulatorId: SimulatorId;
  onOpenControls?: () => void;
  onOpenChallenges?: () => void;
}

export const SimulatorStepWalkthrough: React.FC<SimulatorStepWalkthroughProps> = ({
  simulatorId,
  onOpenControls,
  onOpenChallenges,
}) => {
  const { isZenMode, setActiveSheetTab, setBottomSheetSnap, setIsAuthorModalOpen } = useSimulatorStore();
  const { lightTap, selectionTick } = useHaptics();
  const { playClick, playChime } = useSound();

  const guide = getSimulatorGuide(simulatorId);
  const steps = guide.steps;

  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  if (isZenMode || isDismissed || !steps || steps.length === 0) {
    if (isDismissed && !isZenMode) {
      return (
        <div className="absolute bottom-12 sm:bottom-14 left-4 z-30 select-none pointer-events-auto">
          <button
            type="button"
            onClick={() => {
              lightTap();
              playClick();
              setIsDismissed(false);
            }}
            className="px-4 py-2 rounded-full bg-slate-900/95 hover:bg-slate-800 text-cyan-200 border border-cyan-500/50 shadow-2xl text-sm font-bold flex items-center gap-2 backdrop-blur-xl active:scale-95 transition-all cursor-pointer group"
            title="Open Step-by-Step Guided Walkthrough"
          >
            <Layers className="w-4 h-4 text-cyan-400 group-hover:rotate-12 transition-transform" />
            <span>Step-by-Step Walkthrough</span>
          </button>
        </div>
      );
    }
    return null;
  }

  const activeStep: SimulatorStep = steps[currentStepIdx] || steps[0];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectionTick();
    playClick(0.9);
    setCurrentStepIdx((prev) => Math.max(0, prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectionTick();
    if (currentStepIdx < steps.length - 1) {
      playClick(1.1);
      setCurrentStepIdx((prev) => prev + 1);
    } else {
      playChime();
      setIsExpanded(false);
    }
  };

  const handleSelectStep = (idx: number) => {
    selectionTick();
    playClick();
    setCurrentStepIdx(idx);
  };

  return (
    <div className="absolute bottom-12 sm:bottom-14 inset-x-2 sm:inset-x-auto sm:left-4 sm:max-w-xl z-30 select-none pointer-events-auto transition-all duration-300">
      {/* ------------------------------------------------------------- */}
      {/* COMPACT STEPPER BAR (Default Non-Intrusive Dock)               */}
      {/* ------------------------------------------------------------- */}
      {!isExpanded ? (
        <div className="rounded-2xl bg-slate-900/95 backdrop-blur-2xl border border-cyan-400/50 shadow-2xl overflow-hidden p-2.5 text-sm flex items-center justify-between gap-3">
          {/* Step Badge & Expand Click Target */}
          <div
            onClick={() => {
              lightTap();
              setIsExpanded(true);
            }}
            className="flex items-center gap-2.5 flex-1 min-w-0 cursor-pointer group hover:opacity-95"
            title="Click to expand full step details"
          >
            <div className="w-7 h-7 rounded-xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 font-extrabold text-sm shrink-0 group-hover:scale-105 transition-transform shadow-sm">
              {currentStepIdx + 1}
            </div>

            <div className="truncate">
              <div className="flex items-center gap-2 leading-none">
                <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                  Step {currentStepIdx + 1}/{steps.length}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-cyan-950/90 text-cyan-300 border border-cyan-800/80 font-semibold truncate">
                  {activeStep.badge}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-slate-100 truncate mt-1 group-hover:text-cyan-200 transition-colors">
                {activeStep.title}
              </p>
            </div>
          </div>

          {/* Stepper Navigation Pips & Buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Direct Step Pips */}
            <div className="flex items-center gap-1.5 px-1.5">
              {steps.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectStep(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    idx === currentStepIdx
                      ? 'w-4 bg-cyan-400'
                      : idx < currentStepIdx
                      ? 'w-2 bg-cyan-600/70 hover:bg-cyan-500'
                      : 'w-2 bg-slate-700 hover:bg-slate-500'
                  }`}
                  aria-label={`Jump to Step ${idx + 1}`}
                />
              ))}
            </div>

            {/* Prev Step */}
            <button
              type="button"
              disabled={currentStepIdx === 0}
              onClick={handlePrev}
              className={`p-1.5 rounded-xl border transition-colors ${
                currentStepIdx === 0
                  ? 'text-slate-600 border-slate-800 cursor-not-allowed'
                  : 'text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white cursor-pointer active:scale-95'
              }`}
              title="Previous Step"
              aria-label="Previous Step"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Next Step */}
            <button
              type="button"
              onClick={handleNext}
              className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-1 shadow-md shadow-cyan-500/25 active:scale-95 transition-all cursor-pointer"
              title={currentStepIdx === steps.length - 1 ? 'Finish Steps' : 'Next Step'}
            >
              <span>{currentStepIdx === steps.length - 1 ? 'Done' : 'Next'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            {/* Expand / Details Toggle */}
            <button
              type="button"
              onClick={() => {
                lightTap();
                setIsExpanded(true);
              }}
              className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Expand Step Details"
              aria-label="Expand Step Details"
            >
              <ChevronUp className="w-4 h-4" />
            </button>

            {/* Dismiss Pill */}
            <button
              type="button"
              onClick={() => {
                lightTap();
                setIsDismissed(true);
              }}
              className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
              title="Hide Step Guide"
              aria-label="Hide Step Guide"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* ------------------------------------------------------------- */
        /* EXPANDED DETAILED STEP CARD (Modal / Rich Popover)            */
        /* ------------------------------------------------------------- */
        <div className="rounded-3xl bg-slate-900/98 backdrop-blur-2xl border border-cyan-400/60 shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="p-3.5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 via-cyan-950/30 to-slate-900">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 font-extrabold text-base shadow-sm">
                {currentStepIdx + 1}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                    Step {currentStepIdx + 1} of {steps.length}
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-200 border border-cyan-700 font-bold">
                    {activeStep.badge}
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-extrabold text-white leading-tight mt-0.5">
                  {activeStep.title}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  lightTap();
                  setIsExpanded(false);
                }}
                className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Collapse to mini bar"
                aria-label="Collapse step details"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  lightTap();
                  setIsDismissed(true);
                }}
                className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Dismiss guide"
                aria-label="Dismiss guide"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-4 space-y-3.5 overflow-y-auto text-sm leading-relaxed">
            {/* Step Explanation with Pure Math LaTeX */}
            <div className="text-slate-100 text-sm sm:text-base leading-relaxed">
              <MathText text={activeStep.instruction} />
            </div>

            {/* Action Hint Callout with Pure Math LaTeX */}
            <div className="p-3 rounded-2xl bg-cyan-950/40 border border-cyan-700/60 flex items-start gap-2.5">
              <Target className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-cyan-100 leading-relaxed">
                <strong className="text-cyan-300 font-bold block mb-1">Try This Now:</strong>
                <MathText text={activeStep.actionHint} />
              </div>
            </div>

            {/* Formula Block (Pure KaTeX) */}
            {activeStep.formulaLatex && (
              <div className="p-3 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-1.5 shadow-inner">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Active Mathematical Invariant
                </span>
                <div className="overflow-x-auto py-2 text-center">
                  <BlockMath math={activeStep.formulaLatex} />
                </div>
              </div>
            )}

            {/* Alka Ma'am's Coach Tip with Pure Math LaTeX */}
            <div className="p-3 rounded-2xl bg-amber-950/30 border border-amber-700/50 flex items-start gap-2.5">
              <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-amber-100 leading-relaxed">
                <strong className="text-amber-300 font-bold block mb-1">{"Alka Ma'am's Exam Secret:"}</strong>
                <MathText text={activeStep.coachTip} />
              </div>
            </div>
          </div>

          {/* Footer Controls */}
          <div className="p-3 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between gap-3">
            {/* Quick Action to open sliders or missions */}
            <button
              type="button"
              onClick={() => {
                lightTap();
                setActiveSheetTab('controls');
                setBottomSheetSnap('half');
              }}
              className="py-2 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer border border-slate-700"
            >
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>Sliders</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentStepIdx === 0}
                onClick={handlePrev}
                className={`py-2 px-4 rounded-xl border text-xs sm:text-sm font-bold transition-all ${
                  currentStepIdx === 0
                    ? 'text-slate-600 border-slate-800 cursor-not-allowed'
                    : 'text-slate-200 border-slate-700 hover:bg-slate-800 hover:text-white cursor-pointer active:scale-95'
                }`}
              >
                Previous
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="py-2 px-5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs sm:text-sm flex items-center gap-1.5 shadow-lg shadow-cyan-500/25 active:scale-95 transition-all cursor-pointer"
              >
                <span>{currentStepIdx === steps.length - 1 ? 'Finish & Experiment' : 'Next Step'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
