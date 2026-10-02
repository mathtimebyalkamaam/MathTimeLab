import React, { useState } from 'react';
import { 
  GitFork, 
  CheckCircle2, 
  Sparkles, 
  ChevronRight, 
  ChevronDown, 
  Lightbulb, 
  AlertTriangle, 
  Eye, 
  Trophy,
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { DerivationLadder, DerivationStep } from '../../types/simulators';
import { InlineMath, BlockMath, MathText } from './MathFormula';
import { useSound } from './SoundManager';
import { useHaptics } from '../../hooks/useHaptics';
import { useSimulatorStore } from '../../store/useSimulatorStore';

interface InteractiveDerivationLadderProps {
  ladder: DerivationLadder;
  onApplyVisualPreset?: (stepIndex: number) => void;
  className?: string;
}

export const InteractiveDerivationLadder: React.FC<InteractiveDerivationLadderProps> = ({
  ladder,
  onApplyVisualPreset,
  className = '',
}) => {
  const { playClick, playChime, playHarmonicSnap, playResonance } = useSound();
  const { lightTap, mediumImpact, successBuzz } = useHaptics();
  const { addXp } = useSimulatorStore();

  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [hasCompletedLadder, setHasCompletedLadder] = useState<boolean>(false);

  const activeStep: DerivationStep = ladder.steps[activeStepIndex] || ladder.steps[0];

  const handleSelectStep = (index: number) => {
    lightTap();
    playClick(1.0 + index * 0.1);
    setActiveStepIndex(index);
  };

  const handleCompleteActiveStep = () => {
    mediumImpact();
    playChime();
    setCompletedSteps((prev) => {
      const next = { ...prev, [activeStepIndex]: true };
      const allDone = ladder.steps.every((_, i) => next[i] || i === activeStepIndex);
      if (allDone && !hasCompletedLadder) {
        setHasCompletedLadder(true);
        successBuzz();
        playHarmonicSnap();
        playResonance();
        addXp(25);
      }
      return next;
    });

    if (activeStepIndex < ladder.steps.length - 1) {
      setActiveStepIndex(activeStepIndex + 1);
    }
  };

  const handleResetLadder = () => {
    lightTap();
    setActiveStepIndex(0);
    setCompletedSteps({});
    setHasCompletedLadder(false);
  };

  return (
    <div className={`p-3 rounded-2xl bg-slate-900/95 border border-purple-500/30 text-xs sm:text-sm shadow-xl backdrop-blur-md space-y-2.5 ${className}`}>
      {/* Ladder Header */}
      <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-2">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="p-1 rounded-md bg-purple-500/20 text-purple-400">
              <GitFork className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">
              Derivation Ladder
            </span>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-950/80 border border-purple-800/60 text-purple-300">
              First-Principles
            </span>
          </div>
          <h4 className="font-bold text-sm text-slate-100">{ladder.theoremTitle}</h4>
        </div>

        <button
          type="button"
          onClick={handleResetLadder}
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-purple-300 transition-colors cursor-pointer"
          title="Restart Derivation Ladder"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Target Formula Goal Banner */}
      <div className="p-2.5 px-3 rounded-xl bg-purple-950/30 border border-purple-800/40 flex items-center justify-between">
        <div>
          <span className="text-xs text-purple-300 uppercase tracking-wider font-semibold block mb-0.5">
            Target Destination:
          </span>
          <span className="text-xs sm:text-sm text-slate-300 line-clamp-1">{ladder.examSignificance}</span>
        </div>
        <div className="px-2.5 py-1 rounded-lg bg-slate-950 border border-purple-700/50 shadow-inner shrink-0 ml-2">
          <InlineMath math={ladder.targetFormulaLatex} className="text-purple-300 font-bold text-xs sm:text-sm" />
        </div>
      </div>

      {/* Step Navigator Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {ladder.steps.map((step, idx) => {
          const isCurrent = idx === activeStepIndex;
          const isDone = completedSteps[idx];

          return (
            <button
              key={step.stepNumber}
              type="button"
              onClick={() => handleSelectStep(idx)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isCurrent
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-900/50 scale-[1.02]'
                  : isDone
                  ? 'bg-purple-950/60 border border-purple-500/40 text-purple-300 hover:bg-purple-900/50'
                  : 'bg-slate-950/60 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <span className="w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-mono">
                  {step.stepNumber}
                </span>
              )}
              <span>Step {step.stepNumber}</span>
              {step.isPivotStep && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" title="Pivotal Step" />
              )}
            </button>
          );
        })}
      </div>

      {/* Active Step Workspace Card */}
      <div className="p-3 rounded-xl bg-slate-950/80 border border-purple-900/40 shadow-inner space-y-2">
        <div className="flex items-center justify-between gap-1 border-b border-slate-800/80 pb-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              {activeStep.operationBadge}
            </span>
            <span className="font-bold text-xs sm:text-sm text-slate-200">{activeStep.title}</span>
          </div>

          {activeStep.isPivotStep && (
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-950/60 border border-amber-800/60 text-amber-300 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Pivot</span>
            </span>
          )}
        </div>

        {/* KaTeX Step Equation */}
        <div className="py-2 px-3 rounded-lg bg-slate-900/90 border border-slate-800 text-center shadow-inner overflow-x-auto no-scrollbar">
          <BlockMath math={activeStep.latex} className="my-0 text-sm font-semibold text-purple-200" />
        </div>

        {/* Algebraic Explanation */}
        <div className="text-xs sm:text-sm text-slate-200 leading-relaxed">
          <MathText text={activeStep.explanation} />
        </div>

        {/* Coach Insight: Why this move? */}
        <div className="p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-800/40 flex items-start gap-2">
          <Lightbulb className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div className="text-xs text-cyan-200">
            <strong className="text-cyan-300">Why This Move: </strong>
            <MathText text={activeStep.coachInsight} />
          </div>
        </div>

        {/* Step Action Buttons */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
          {onApplyVisualPreset && (
            <button
              type="button"
              onClick={() => {
                lightTap();
                playResonance();
                onApplyVisualPreset(activeStepIndex);
              }}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
              <span>Show on Canvas</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleCompleteActiveStep}
            className="ml-auto px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-purple-900/40 flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
          >
            <span>{activeStepIndex === ladder.steps.length - 1 ? 'Finish Proof' : 'Understand & Next'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Completion Celebration Banner */}
      {hasCompletedLadder && (
        <div className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/50 flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
              <Trophy className="w-3 h-3" />
            </div>
            <div>
              <span className="font-bold text-[11px] text-emerald-300 block">Derivation Mastered (+25 XP)</span>
              <span className="text-[9px] text-slate-400">First-principles proof verified!</span>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500 text-slate-950">
            PROVEN
          </span>
        </div>
      )}
    </div>
  );
};
