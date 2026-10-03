/**
 * CoachTheoryModule.tsx: Comprehensive mathematical theory & coaching breakdown.
 * Designed like an elite math tutor coaching session:
 * - Smart screen segmented tabs (Results & Math, Proof Ladder, Solved Exam, Traps & Doubts)
 * - Zero long vertical page scrolling on desktop & laptops
 * - Pure KaTeX LaTeX equations & First-Principles Derivation Ladders
 * - Live Calculation Results & Dynamic Coordinate Inspector
 */
import React, { useState } from 'react';
import { 
  GraduationCap, 
  Lightbulb, 
  CheckCircle2, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  BookOpen, 
  FileCheck2,
  Sparkles,
  Zap,
  AlertTriangle,
  ArrowRight,
  Target,
  GitFork,
  ChevronLeft,
  ChevronRight,
  Calculator
} from 'lucide-react';
import { SimulatorId, SimulatorMetadata } from '../../types/simulators';
import { SIMULATORS } from '../../data/simulators';
import { MathFormula, InlineMath, BlockMath, MathText } from './MathFormula';
import { useHaptics } from '../../hooks/useHaptics';
import { useSound } from './SoundManager';
import { useSimulatorStore } from '../../store/useSimulatorStore';
import { InteractiveDerivationLadder } from './InteractiveDerivationLadder';

interface CoachTheoryModuleProps {
  simulatorId: SimulatorId;
  extraLiveDetails?: React.ReactNode;
}

type TheorySectionTab = 'results_formula' | 'proof_ladder' | 'solved_problem' | 'traps_doubts';

export const CoachTheoryModule: React.FC<CoachTheoryModuleProps> = ({
  simulatorId,
  extraLiveDetails,
}) => {
  const { lightTap, selectionTick } = useHaptics();
  const { playClick } = useSound();
  const { 
    openPOEModal, 
    openExamPYQModal, 
    poePredictions,
    updateDroneParams,
    updateCatapultParams,
    updateUnitCircleParams
  } = useSimulatorStore();

  const sim = SIMULATORS.find((s) => s.id === simulatorId);
  const [activeTab, setActiveTab] = useState<TheorySectionTab>('results_formula');

  // Smart compact insight pill switcher for 0-scroll desktop cockpit
  const [insightPill, setInsightPill] = useState<'coach' | 'trap' | 'core'>('coach');

  // Solved Problem step pager state
  const [activeProblemStep, setActiveProblemStep] = useState<number>(0);

  // Traps & Doubts sub-tab state
  const [trapsSubTab, setTrapsSubTab] = useState<'traps' | 'doubts'>('traps');
  const [activeTrapIndex, setActiveTrapIndex] = useState<number>(0);
  const [activeDoubtIndex, setActiveDoubtIndex] = useState<number>(0);

  if (!sim) return null;

  const handleApplyVisualPreset = (stepIndex: number) => {
    lightTap();
    if (simulatorId === 'drone-navigator') {
      if (stepIndex === 0) updateDroneParams({ droneX: 6, droneY: 8 });
      else if (stepIndex === 1) updateDroneParams({ droneX: 3, droneY: 4 });
      else if (stepIndex === 2) updateDroneParams({ droneX: 5, droneY: 12 });
      else updateDroneParams({ droneX: 8, droneY: 6 });
    } else if (simulatorId === 'catapult-siege') {
      if (stepIndex === 3) updateCatapultParams({ angleDeg: 45, tension: 75 });
      else updateCatapultParams({ angleDeg: 30 + stepIndex * 15 });
    } else if (simulatorId === 'unit-circle') {
      const angles = [30, 45, 60, 90];
      updateUnitCircleParams({ angleDeg: angles[stepIndex % 4] });
    }
  };

  const poe = sim.poeInquiry;
  const isPoeCompleted = poe ? !!poePredictions[poe.id] : false;

  return (
    <div className="space-y-3 text-xs sm:text-sm text-slate-300">
      {/* Top Segmented Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 rounded-xl bg-slate-950/90 border border-slate-800/80 shrink-0">
        <button
          type="button"
          onClick={() => {
            selectionTick();
            playClick(1.0);
            setActiveTab('results_formula');
          }}
          className={`py-2 px-2.5 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer truncate ${
            activeTab === 'results_formula'
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Live Results & Governing Equation"
        >
          <Calculator className="w-4 h-4 shrink-0" />
          <span className="truncate">Results & Math</span>
        </button>

        {sim.derivationLadder && (
          <button
            type="button"
            onClick={() => {
              selectionTick();
              playClick(1.05);
              setActiveTab('proof_ladder');
            }}
            className={`py-2 px-2.5 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer truncate ${
              activeTab === 'proof_ladder'
                ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-950'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="First-Principles Proof Ladder"
          >
            <GitFork className="w-4 h-4 shrink-0 text-purple-300" />
            <span className="truncate">Proof Ladder</span>
          </button>
        )}

        {sim.solvedProblem && (
          <button
            type="button"
            onClick={() => {
              selectionTick();
              playClick(1.1);
              setActiveTab('solved_problem');
            }}
            className={`py-2 px-2.5 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer truncate ${
              activeTab === 'solved_problem'
                ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-950'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Step-by-Step Solved Exam Question"
          >
            <FileCheck2 className="w-4 h-4 shrink-0 text-emerald-300" />
            <span className="truncate">Solved Exam</span>
          </button>
        )}

        {(sim.examTraps || sim.doubts) && (
          <button
            type="button"
            onClick={() => {
              selectionTick();
              playClick(1.15);
              setActiveTab('traps_doubts');
            }}
            className={`py-2 px-2.5 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer truncate ${
              activeTab === 'traps_doubts'
                ? 'bg-amber-600 text-white font-bold shadow-md shadow-amber-950'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Exam Traps & Doubts Cleared"
          >
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-300" />
            <span className="truncate">Traps & Doubts</span>
          </button>
        )}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: LIVE RESULTS & GOVERNING FORMULA                                    */}
      {/* ========================================================================= */}
      {activeTab === 'results_formula' && (
        <div className="space-y-2 animate-fade-in">
          {/* Real-Time Live Inspector & Dynamic Calculations */}
          {extraLiveDetails && (
            <div className="p-2 rounded-xl bg-slate-950/80 border border-cyan-800/40 shadow-inner space-y-1">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-0.5">
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>Live Readout</span>
                </span>
                <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-1.5 py-0.2 rounded">
                  Live Sync
                </span>
              </div>
              {extraLiveDetails}
            </div>
          )}

          {/* Governing KaTeX LaTeX Formula - Pure Mathematical Presentation */}
          <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm flex flex-col gap-1.5">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-1">
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1">
                <GraduationCap className="w-3 h-3 text-cyan-400" />
                <span>Governing Mathematical Law</span>
              </span>
              <span className="text-[9px] font-mono text-cyan-300 bg-cyan-950/70 border border-cyan-800/60 px-2 py-0.5 rounded">
                Pure LaTeX
              </span>
            </div>
            <div className="overflow-hidden py-1 px-1 text-center font-semibold text-slate-100 flex items-center justify-center min-h-[44px]">
              <div className="w-full overflow-x-auto no-scrollbar text-center">
                <BlockMath math={sim.latexFormula} className="!my-0 text-cyan-100 font-semibold text-xs sm:text-sm" />
              </div>
            </div>
          </div>

          {/* Smart Segmented Insight Switcher: Coach Secret vs Trap vs Concept */}
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/90 space-y-2">
            <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-950 border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => {
                  selectionTick();
                  setInsightPill('coach');
                }}
                className={`flex-1 py-1 px-2 rounded-md font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  insightPill === 'coach'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                <span>Coach Secret</span>
              </button>

              {sim.textbookTrap && (
                <button
                  type="button"
                  onClick={() => {
                    selectionTick();
                    setInsightPill('trap');
                  }}
                  className={`flex-1 py-1 px-2 rounded-md font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    insightPill === 'trap'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                  <span>Textbook Trap</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  selectionTick();
                  setInsightPill('core');
                }}
                className={`flex-1 py-1 px-2 rounded-md font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  insightPill === 'core'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
                <span>Key Concept</span>
              </button>
            </div>

            {/* Selected Insight Display Card with Pure KaTeX formatting */}
            <div className="text-xs sm:text-sm leading-relaxed min-h-[46px] flex items-center px-1">
              {insightPill === 'coach' && (
                <div className="text-amber-200/95">
                  <strong className="text-amber-300">Exam Shortcut: </strong>
                  <MathText text={sim.coachSecret || 'Master the invariant relation to solve problems in under 30 seconds.'} />
                </div>
              )}
              {insightPill === 'trap' && sim.textbookTrap && (
                <div className="text-rose-200/95">
                  <strong className="text-rose-400">Common Misconception: </strong>
                  <MathText text={sim.textbookTrap} />
                </div>
              )}
              {insightPill === 'core' && (
                <div className="text-cyan-200/95">
                  <strong className="text-cyan-300">First Principle: </strong>
                  <MathText text={sim.theoryBreakdown || sim.description} />
                </div>
              )}
            </div>
          </div>

          {/* Interactive Fast Banners: POE & PYQ (Compact 2-col Grid) */}
          <div className="grid grid-cols-2 gap-1.5 pt-0.5">
            {poe && (
              <button
                type="button"
                onClick={() => {
                  lightTap();
                  openPOEModal(poe.id);
                }}
                className="p-1.5 px-2 rounded-xl bg-gradient-to-r from-amber-950/40 to-slate-900 border border-amber-500/40 text-left hover:border-amber-400 transition-all cursor-pointer group flex items-center justify-between"
              >
                <div className="truncate">
                  <span className="text-[9px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                    <Zap className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                    <span>Predict & Prove</span>
                  </span>
                  <p className="text-[10px] text-slate-300 truncate mt-0.5 group-hover:text-white">
                    {poe.title}
                  </p>
                </div>
                <span className="text-[9px] font-bold text-amber-300 bg-amber-950 px-1 py-0.5 rounded border border-amber-800 shrink-0 ml-1">
                  +{poe.xpReward} XP
                </span>
              </button>
            )}

            {sim.pastYearQuestions && sim.pastYearQuestions.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  lightTap();
                  openExamPYQModal();
                }}
                className="p-1.5 px-2 rounded-xl bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/40 text-left hover:border-emerald-400 transition-all cursor-pointer group flex items-center justify-between"
              >
                <div className="truncate">
                  <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                    <FileCheck2 className="w-2.5 h-2.5 text-emerald-400" />
                    <span>Board PYQs</span>
                  </span>
                  <p className="text-[10px] text-slate-300 truncate mt-0.5 group-hover:text-white">
                    {sim.pastYearQuestions[0].exam}
                  </p>
                </div>
                <span className="text-[9px] font-bold text-emerald-300 bg-emerald-950 px-1 py-0.5 rounded border border-emerald-800 shrink-0 ml-1">
                  {sim.pastYearQuestions.length} Qs
                </span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: INTERACTIVE DERIVATION LADDER (First-Principles Proof)              */}
      {/* ========================================================================= */}
      {activeTab === 'proof_ladder' && sim.derivationLadder && (
        <div className="animate-fade-in">
          <InteractiveDerivationLadder
            ladder={sim.derivationLadder}
            onApplyVisualPreset={handleApplyVisualPreset}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: STEP-BY-STEP SOLVED BOARD EXAM PROBLEM                              */}
      {/* ========================================================================= */}
      {activeTab === 'solved_problem' && sim.solvedProblem && (
        <div className="space-y-3 animate-fade-in">
          {/* Question Card */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-emerald-500/30">
            <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-1.5 mb-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <FileCheck2 className="w-4 h-4 text-emerald-400" />
                <span>{sim.solvedProblem.examType}</span>
              </span>
              <span className="text-xs font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
                Scoring Model
              </span>
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-white mb-1.5">{sim.solvedProblem.title}</h4>
            <div className="text-slate-200 text-xs sm:text-sm leading-relaxed">
              <MathText text={sim.solvedProblem.question} />
            </div>
          </div>

          {/* Interactive Step Carousel Switcher */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {sim.solvedProblem.steps.map((step, idx) => (
              <button
                key={step.stepNumber}
                type="button"
                onClick={() => {
                  selectionTick();
                  setActiveProblemStep(idx);
                }}
                className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeProblemStep === idx
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Step {step.stepNumber}
              </button>
            ))}
          </div>

          {/* Current Step Content */}
          {sim.solvedProblem.steps[activeProblemStep] && (
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="font-bold text-white">
                  Step {sim.solvedProblem.steps[activeProblemStep].stepNumber}: {sim.solvedProblem.steps[activeProblemStep].title}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {activeProblemStep + 1} of {sim.solvedProblem.steps.length}
                </span>
              </div>

              <div className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                <MathText text={sim.solvedProblem.steps[activeProblemStep].explanation} />
              </div>

              {sim.solvedProblem.steps[activeProblemStep].latex && (
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 text-center shadow-inner overflow-x-auto no-scrollbar">
                  <BlockMath
                    math={sim.solvedProblem.steps[activeProblemStep].latex!}
                    className="text-sm font-semibold text-emerald-300"
                  />
                </div>
              )}
            </div>
          )}

          {/* Final Answer & Coach Shortcut */}
          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/50 flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm">
              <strong className="text-emerald-300 block mb-0.5">Final Answer:</strong>
              <div className="text-slate-100">
                <MathText text={sim.solvedProblem.finalAnswer} />
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-800/40 flex items-start gap-2 text-xs sm:text-sm text-cyan-200">
            <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-300">Exam Shortcut: </strong>
              <MathText text={sim.solvedProblem.coachInsight} />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: EXAM TRAPS & STUDENT DOUBTS CLEARED                                 */}
      {/* ========================================================================= */}
      {activeTab === 'traps_doubts' && (
        <div className="space-y-2.5 animate-fade-in">
          {/* Sub-tab: Traps vs Doubts */}
          <div className="grid grid-cols-2 p-0.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => {
                selectionTick();
                setTrapsSubTab('traps');
              }}
              className={`py-1 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 cursor-pointer transition-all ${
                trapsSubTab === 'traps'
                  ? 'bg-red-500 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <AlertTriangle className="w-3 h-3" />
              <span>Exam Traps ({sim.examTraps?.length || 0})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                selectionTick();
                setTrapsSubTab('doubts');
              }}
              className={`py-1 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 cursor-pointer transition-all ${
                trapsSubTab === 'doubts'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <HelpCircle className="w-3 h-3" />
              <span>Doubts Cleared ({sim.doubts?.length || 0})</span>
            </button>
          </div>

          {/* Sub-tab A: Exam Traps */}
          {trapsSubTab === 'traps' && sim.examTraps && sim.examTraps.length > 0 && (
            <div className="space-y-2">
              {/* Trap Navigator Pills */}
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
                {sim.examTraps.map((trap, idx) => (
                  <button
                    key={trap.id}
                    type="button"
                    onClick={() => {
                      selectionTick();
                      setActiveTrapIndex(idx);
                    }}
                    className={`flex-1 py-1 px-2 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                      activeTrapIndex === idx
                        ? 'bg-red-950 text-red-200 border border-red-500/60 shadow-sm'
                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Trap #{idx + 1}
                  </button>
                ))}
              </div>

              {/* Active Trap Detail Card */}
              {sim.examTraps[activeTrapIndex] && (
                <div className="p-3.5 rounded-xl bg-slate-950/90 border border-red-900/50 space-y-2.5 text-xs sm:text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-red-300 text-xs sm:text-sm">
                      {sim.examTraps[activeTrapIndex].name}
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800">
                      {sim.examTraps[activeTrapIndex].examFrequency} Frequency
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-red-950/30 border border-red-900/40 text-red-200">
                    <strong className="text-xs text-red-400 uppercase tracking-wide block mb-1">
                      The Common Student Fallacy:
                    </strong>
                    <div className="leading-relaxed">
                      <MathText text={sim.examTraps[activeTrapIndex].fallacy} />
                    </div>
                  </div>

                  <div className="text-slate-200 leading-relaxed text-xs sm:text-sm">
                    <strong className="text-xs text-amber-400 uppercase tracking-wide block mb-1">
                      Why It Loses Marks:
                    </strong>
                    <div>
                      <MathText text={sim.examTraps[activeTrapIndex].whyWrong} />
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-800/40 text-emerald-200 text-xs sm:text-sm">
                    <strong className="text-xs text-emerald-400 uppercase tracking-wide block mb-1">
                      The Correct Mathematical Method:
                    </strong>
                    <div className="leading-relaxed">
                      <MathText text={sim.examTraps[activeTrapIndex].correctWay} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Sub-tab B: Student Doubts Cleared */}
          {trapsSubTab === 'doubts' && sim.doubts && sim.doubts.length > 0 && (
            <div className="space-y-2.5">
              {/* Doubt Navigator Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                {sim.doubts.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      selectionTick();
                      setActiveDoubtIndex(idx);
                    }}
                    className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      activeDoubtIndex === idx
                        ? 'bg-amber-950 text-amber-200 border border-amber-500/60 shadow-sm'
                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Doubt #{idx + 1}
                  </button>
                ))}
              </div>

              {/* Active Doubt Detail Card */}
              {sim.doubts[activeDoubtIndex] && (
                <div className="p-3.5 rounded-xl bg-slate-950/90 border border-amber-800/40 space-y-2.5 text-xs sm:text-sm">
                  <div className="flex items-start gap-2 text-amber-300 font-bold text-xs sm:text-sm">
                    <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <MathText text={sim.doubts[activeDoubtIndex].question} />
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs sm:text-sm leading-relaxed">
                    <MathText text={sim.doubts[activeDoubtIndex].answer} />
                  </div>

                  {sim.doubts[activeDoubtIndex].latex && (
                    <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-center overflow-x-auto no-scrollbar">
                      <BlockMath
                        math={sim.doubts[activeDoubtIndex].latex!}
                        className="text-sm text-amber-300 font-semibold"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
