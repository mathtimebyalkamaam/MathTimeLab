import React, { useState } from 'react';
import { 
  FileCheck2, 
  X, 
  Sparkles, 
  ArrowRight, 
  GraduationCap, 
  Lightbulb, 
  CheckCircle2, 
  Clock, 
  Trophy,
  Target
} from 'lucide-react';
import { useSimulatorStore } from '../../store/useSimulatorStore';
import { SIMULATORS } from '../../data/simulators';
import { MathFormula, BlockMath, InlineMath } from './MathFormula';
import { useHaptics } from '../../hooks/useHaptics';
import { useSound } from './SoundManager';
import { PastYearExamQuestion } from '../../types/simulators';

export const ExamPYQModal: React.FC = () => {
  const { 
    isExamPYQModalOpen, 
    closeExamPYQModal, 
    activeSimulatorId, 
    currentRoute,
    // Simulator parameter updaters for loading PYQ into canvas
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

  const { lightTap, successBuzz } = useHaptics();
  const { playClick, playChime } = useSound();

  const currentSimId = activeSimulatorId || (currentRoute !== 'home' && currentRoute !== 'landing' && currentRoute !== 'teacher' ? currentRoute : null);
  const metadata = SIMULATORS.find((s) => s.id === currentSimId);
  const pyqs = metadata?.pastYearQuestions || [];

  const [selectedPYQIndex, setSelectedPYQIndex] = useState<number>(0);

  if (!isExamPYQModalOpen || !metadata) return null;

  const currentPYQ: PastYearExamQuestion | undefined = pyqs[selectedPYQIndex] || pyqs[0];

  const handleLoadPYQIntoSimulator = (pyq: PastYearExamQuestion) => {
    lightTap();
    playClick();
    successBuzz();

    // Specific parameter settings matching exam problems
    if (metadata.id === 'surface-area-volumes') {
      updateSurfaceAreaParams({
        solidType: 'cone',
        radius: 3,
        height: 4,
        unfoldPercent: 0,
      });
    } else if (metadata.id === 'limits-derivatives-lab') {
      updateLimitsDerivativesParams({
        functionType: 'x2',
        x0: 2,
        hStep: 0.1,
        showSecantLine: true,
        showTangentLine: true,
      });
    } else if (metadata.id === 'linear-inequalities') {
      updateLinearInequalitiesParams({
        a1: 1, b1: 1, c1: 6,
        a2: 2, b2: 1, c2: 8,
        showObjectiveLine: true,
      });
    } else if (metadata.id === 'circle-chords-cyclic') {
      updateCircleChordsParams({
        mode: 'perpendicular-chord',
        chordDistance: 3,
      });
    } else if (metadata.id === 'statistics-visualizer') {
      updateStatisticsParams({
        outlierValue: 18,
        showMeanFulcrum: true,
        showMedianLine: true,
      });
    } else if (metadata.id === 'permutations-combinations') {
      updatePermutationsCombinationsParams({
        mode: 'permutations',
        nTotal: 5,
        rChosen: 3,
      });
    } else if (metadata.id === 'heron-triangles') {
      updateHeronParams({
        ax: 0, ay: 0,
        bx: 6, by: 0,
        cx: 3, cy: 4,
      });
    } else if (metadata.id === 'drone-navigator') {
      updateDroneParams({
        droneX: 0, droneY: 0,
        targetX: 6, targetY: 8,
      });
    }

    closeExamPYQModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl max-h-[92vh] flex flex-col bg-slate-900 border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden text-slate-100"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex-none p-4 bg-gradient-to-r from-cyan-950/60 via-slate-900 to-slate-900 border-b border-cyan-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
              <FileCheck2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/70 border border-cyan-700/50 px-2 py-0.5 rounded-full">
                  Real Past-Year Exam Questions (PYQ)
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {metadata.grade} · {metadata.category}
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white leading-tight">
                {metadata.title}
              </h2>
            </div>
          </div>
          <button
            onClick={() => {
              lightTap();
              closeExamPYQModal();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Question Selector Tabs */}
        {pyqs.length > 1 && (
          <div className="flex-none px-4 pt-3 pb-1 border-b border-slate-800 bg-slate-950/50 flex gap-1.5 overflow-x-auto">
            {pyqs.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => {
                  lightTap();
                  setSelectedPYQIndex(idx);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedPYQIndex === idx
                    ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {q.exam}
              </button>
            ))}
          </div>
        )}

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs sm:text-sm">
          {currentPYQ ? (
            <>
              {/* Exam Tag & Marks */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold text-xs">
                    {currentPYQ.exam}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    Weightage: {currentPYQ.marks}
                  </span>
                </div>
                <button
                  onClick={() => handleLoadPYQIntoSimulator(currentPYQ)}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 text-xs font-semibold flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                  title="Load the exact coordinates into the simulator"
                >
                  <Target className="w-3.5 h-3.5" />
                  <span>Load Into Simulator</span>
                </button>
              </div>

              {/* Question Box */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Official Exam Question
                </label>
                <p className="text-slate-200 text-sm leading-relaxed font-sans">
                  {currentPYQ.question}
                </p>
                {currentPYQ.latex && (
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-center font-mono text-cyan-300">
                    <BlockMath math={currentPYQ.latex} />
                  </div>
                )}
              </div>

              {/* Step-by-Step Marking Scheme Solution */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4" />
                  <span>Step-by-Step Official Board Marking Scheme</span>
                </label>
                <div className="space-y-2">
                  {currentPYQ.solutionSteps.map((step, idx) => (
                    <div 
                      key={idx}
                      className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start gap-2.5"
                    >
                      <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-300 text-[11px] font-bold flex items-center justify-center flex-none mt-0.5">
                        {idx + 1}
                      </span>
                      <div className="flex-1 text-xs text-slate-300 leading-relaxed font-mono">
                        {step}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Final Answer Banner */}
              <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                    Final Target Answer:
                  </span>
                </div>
                <span className="font-mono text-sm font-bold text-emerald-200">
                  {currentPYQ.finalAnswer}
                </span>
              </div>

              {/* Coach's 10-Second Shortcut */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-950/30 to-slate-950 border border-amber-500/30 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 uppercase tracking-wide">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  <span>{"Top Ranker's 10-Second Mental Shortcut:"}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {currentPYQ.coachShortcut}
                </p>
              </div>
            </>
          ) : (
            <div className="p-6 text-center text-slate-400">
              Exam questions are currently being loaded for this module.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex-none p-3 sm:p-4 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Aligned with CBSE 2024-25 Curriculum & JEE Main Blueprints
          </span>
          <button
            onClick={() => currentPYQ && handleLoadPYQIntoSimulator(currentPYQ)}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 active:scale-95 transition-all shadow-md cursor-pointer"
          >
            <span>Solve & Verify in Simulator</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
