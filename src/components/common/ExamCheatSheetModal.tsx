/**
 * ExamCheatSheetModal.tsx: CBSE Board Exam High-Yield Flashcard & Step-by-Step Proof Drilldown.
 * Recommendation 13: Instant 5-mark CBSE proof breakdowns, marking schemes, and topper shortcuts.
 */
import React from 'react';
import { 
  GraduationCap, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  BookOpen, 
  X, 
  Award,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { InlineMath, BlockMath } from './MathFormula';

export interface ProofStep {
  stepNumber: number;
  title: string;
  mathLatex?: string;
  mathContent?: string;
  explanation: string;
  marksAllotted?: number;
  marksAllocation?: string | number;
}

export interface ExamCheatSheetProps {
  isOpen: boolean;
  onClose: () => void;
  topicTitle?: string;
  chapterName?: string;
  gradeLevel?: string;
  theoremName?: string;
  centralFormulaLatex?: string;
  fiveMarkQuestion?: string;
  steps?: ProofStep[];
  proofSteps?: ProofStep[];
  topperTips?: string[];
  topperShortcuts?: string[];
  commonTraps?: string[];
  examinerTraps?: string[];
  markingSchemeTotal?: number;
}

export const ExamCheatSheetModal: React.FC<ExamCheatSheetProps> = ({
  isOpen,
  onClose,
  topicTitle = 'CBSE Board Examination Blueprint',
  chapterName,
  gradeLevel = 'Class 10 CBSE Board',
  theoremName,
  centralFormulaLatex,
  fiveMarkQuestion,
  steps,
  proofSteps,
  topperTips,
  topperShortcuts,
  commonTraps,
  examinerTraps,
  markingSchemeTotal = 5,
}) => {
  if (!isOpen) return null;

  const displayTitle = chapterName || theoremName || topicTitle;
  const activeSteps = proofSteps || steps || [];
  const activeTopperTips = topperShortcuts || topperTips || [];
  const activeTraps = examinerTraps || commonTraps || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-950/60 text-amber-300 border border-amber-800/60">
                  {gradeLevel}
                </span>
                <span className="text-[10px] font-mono text-cyan-400 font-bold">
                  {markingSchemeTotal}-Mark Blueprint
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white mt-0.5">
                {displayTitle}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-all cursor-pointer"
            title="Close Cheatsheet"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 custom-scrollbar">
          {/* 5-Mark Question Statement */}
          {fiveMarkQuestion && (
            <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-950/20 border border-amber-600/30">
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider flex items-center gap-1 mb-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                Target 5-Mark Board Exam Question:
              </span>
              <p className="text-xs text-amber-200 font-medium leading-relaxed">
                {fiveMarkQuestion}
              </p>
            </div>
          )}

          {/* Key Formula Display Card */}
          {centralFormulaLatex && (
            <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-cyan-950/40 via-slate-900 to-slate-950 border border-cyan-500/40 shadow-inner">
              <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider flex items-center gap-1 mb-1">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                Central Invariant Formula:
              </span>
              <BlockMath math={centralFormulaLatex} className="text-cyan-200 text-sm sm:text-base font-bold" />
            </div>
          )}

          {/* 5-Mark Step-by-Step Proof Breakdown */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                Step-by-Step Board Exam Proof Template
              </span>
              <span className="text-[11px] font-mono text-emerald-400 font-bold">
                Max Marks: {markingSchemeTotal}M
              </span>
            </div>

            <div className="space-y-2.5">
              {activeSteps.map((step) => (
                <div 
                  key={step.stepNumber}
                  className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5 hover:border-slate-700 transition-all"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-700 text-cyan-300 text-[11px] flex items-center justify-center font-mono">
                        {step.stepNumber}
                      </span>
                      {step.title}
                    </span>
                    {(step.marksAllocation || step.marksAllotted) && (
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-950/70 text-emerald-300 border border-emerald-800/60">
                        [{typeof step.marksAllocation === 'string' ? step.marksAllocation : `${step.marksAllocation || step.marksAllotted} Mark`}]
                      </span>
                    )}
                  </div>

                  {(step.mathLatex || step.mathContent) && (
                    <div className="py-1 px-2 rounded-xl bg-slate-900/90 border border-slate-800/80">
                      <InlineMath math={step.mathLatex || step.mathContent || ''} />
                    </div>
                  )}

                  <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                    {step.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Topper Secret Shortcuts */}
          {activeTopperTips.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-800/40 space-y-2">
              <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                Alka Ma'am's Topper Secrets & Time-Savers:
              </div>
              <ul className="space-y-1.5 text-xs text-amber-200/90">
                {activeTopperTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <ChevronRight className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Common Board Exam Blunders */}
          {activeTraps.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-800/40 space-y-2">
              <div className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                Examiner's Favorite Trap (Avoid Losing 1-2 Marks):
              </div>
              <ul className="space-y-1.5 text-xs text-rose-200/90">
                {activeTraps.map((trap, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                    <span>{trap}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 sm:p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-400 font-mono">
            MathTimeLab by Alka Ma'am • 100/100 CBSE Prep
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition-all cursor-pointer"
          >
            Got It!
          </button>
        </div>
      </div>
    </div>
  );
};
