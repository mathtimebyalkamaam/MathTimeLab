import React, { useState, useEffect } from 'react';
import { 
  Target, 
  RotateCcw, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Lightbulb, 
  CheckCircle2, 
  Sliders, 
  BookOpen, 
  Hand,
  X,
  FileCheck2
} from 'lucide-react';
import { SimulatorId } from '../../types/simulators';
import { SIMULATORS } from '../../data/simulators';
import { getNcertMapping } from '../../data/ncertMappings';
import { INSTRUCTIONS } from './SimulatorInstructionBanner';
import { BlockMath } from './MathFormula';
import { useSimulatorStore } from '../../store/useSimulatorStore';
import { useSound } from './SoundManager';
import { useHaptics } from '../../hooks/useHaptics';

interface SimulatorMissionBarProps {
  simulatorId: SimulatorId;
}

export const SimulatorMissionBar: React.FC<SimulatorMissionBarProps> = ({ simulatorId }) => {
  const { isZenMode, resetParams, setActiveSheetTab, setBottomSheetSnap, openExamPYQModal } = useSimulatorStore();
  const { playClick, playChime } = useSound();
  const { lightTap, successNotification } = useHaptics();

  const [isExpanded, setIsExpanded] = useState(false);
  const [showResetFeedback, setShowResetFeedback] = useState(false);
  const [showTouchHint, setShowTouchHint] = useState(true);

  const sim = SIMULATORS.find((s) => s.id === simulatorId);
  const ncert = getNcertMapping(simulatorId);
  const instruction = INSTRUCTIONS[simulatorId];

  // Auto-dismiss the pulsing touch hint when the user interacts or after 8 seconds
  useEffect(() => {
    // Check if user already dismissed hint for this simulator this session
    const dismissedKey = `math_time_hint_dismissed_${simulatorId}`;
    if (sessionStorage.getItem(dismissedKey)) {
      setShowTouchHint(false);
      return;
    }

    const timer = setTimeout(() => {
      setShowTouchHint(false);
    }, 8000);

    const handleFirstInteraction = () => {
      setShowTouchHint(false);
      try {
        sessionStorage.setItem(dismissedKey, 'true');
      } catch {
        // safe ignore
      }
    };

    window.addEventListener('pointerdown', handleFirstInteraction, { once: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('pointerdown', handleFirstInteraction);
    };
  }, [simulatorId]);

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    lightTap();
    playClick();
    resetParams(simulatorId);
    setShowResetFeedback(true);
    setTimeout(() => {
      setShowResetFeedback(false);
    }, 2500);
  };

  const handleToggleExpand = () => {
    lightTap();
    playClick();
    setIsExpanded(!isExpanded);
  };

  const dismissTouchHint = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    lightTap();
    setShowTouchHint(false);
    try {
      sessionStorage.setItem(`math_time_hint_dismissed_${simulatorId}`, 'true');
    } catch {
      // safe ignore
    }
  };

  if (isZenMode) return null;

  return (
    <>
      {/* ----------------------------------------------------------------- */}
      {/* 1. TOP MISSION BAR DOCK (Collapsible Glassmorphic Ribbon)        */}
      {/* ----------------------------------------------------------------- */}
      <aside 
        aria-label="Simulator learning mission guide"
        className="w-full bg-slate-900/95 backdrop-blur-md border-b border-cyan-500/25 px-3 py-2 text-xs select-none shadow-md transition-all duration-300 relative z-30 shrink-0"
      >
        <div className="max-w-[1720px] mx-auto flex items-center justify-between gap-2.5">
          {/* Left: Mission Statement & NCERT Badge */}
          <div 
            onClick={handleToggleExpand}
            className="flex items-center gap-2 min-w-0 flex-1 cursor-pointer group hover:opacity-95"
          >
            {/* Mission Icon Badge */}
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-bold shrink-0">
              <Target className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-12 transition-transform" />
              <span className="hidden sm:inline font-mono uppercase text-[10px] tracking-wider">Mission</span>
            </div>

            {/* Standard Curriculum Syllabus Tag */}
            {ncert && (
              <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-[10px] font-semibold shrink-0">
                <span>📚 Ch {ncert.chapterNumber}</span>
                <span className="text-emerald-400/80 hidden xl:inline">({ncert.chapterName})</span>
              </span>
            )}

            {/* Crisp Goal Text */}
            <span className="text-slate-200 font-medium truncate text-[11px] sm:text-xs">
              {instruction?.goal || sim?.description}
            </span>
          </div>

          {/* Right: Quick Action Buttons (Reset Lab, Guide Toggle) */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Prominent Reset Lab Button */}
            <button
              type="button"
              onClick={handleReset}
              className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 ${
                showResetFeedback
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/60 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                  : 'bg-slate-800/90 hover:bg-slate-750 text-slate-300 hover:text-white border-slate-700/80 hover:border-cyan-500/40'
              }`}
              title="Reset all simulator parameters back to default"
            >
              <RotateCcw className={`w-3 h-3 ${showResetFeedback ? 'text-emerald-400 rotate-180 transition-transform duration-500' : 'text-cyan-400'}`} />
              <span className="hidden sm:inline">
                {showResetFeedback ? 'Reset Done!' : 'Reset Lab'}
              </span>
            </button>

            {/* Expand / Collapse 3-Step Guide Toggle */}
            <button
              type="button"
              onClick={handleToggleExpand}
              className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
              title={isExpanded ? 'Collapse Mission Steps' : 'View 3-Step Action Guide'}
            >
              <span className="hidden sm:inline">{isExpanded ? 'Hide Steps' : '3-Step Guide'}</span>
              {isExpanded ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* EXPANDED 3-STEP MISSION DETAIL DRAWER                          */}
        {/* ------------------------------------------------------------- */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-slate-800 space-y-3 animate-fade-in text-xs max-w-[1720px] mx-auto">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-slate-800/70">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-extrabold text-white text-sm">
                  {sim?.title || instruction?.title}
                </span>
                {ncert && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/90 border border-emerald-700/70 text-emerald-300 font-bold text-[10px]">
                    Class {ncert.gradeNumber} • Ch {ncert.chapterNumber}: {ncert.chapterName} · CBSE • ICSE • State Boards • NCERT Aligned
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    lightTap();
                    setIsExpanded(false);
                    openExamPYQModal(simulatorId);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 font-semibold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                  title="Practice real CBSE board exam questions on this exact concept"
                >
                  <FileCheck2 className="w-3 h-3 text-emerald-400" />
                  <span>Exam PYQ</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    lightTap();
                    setIsExpanded(false);
                    setActiveSheetTab('theory');
                    setBottomSheetSnap('half');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-semibold text-[11px] flex items-center gap-1 cursor-pointer"
                >
                  <BookOpen className="w-3 h-3 text-cyan-400" />
                  <span>Full Theory</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    lightTap();
                    setIsExpanded(false);
                  }}
                  className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 3 Step Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* STEP 1: TOUCH */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-cyan-500/30 space-y-1">
                <div className="flex items-center gap-1.5 text-cyan-400 font-bold text-[11px] uppercase tracking-wider">
                  <Hand className="w-3.5 h-3.5" />
                  <span>Step 1: Touch &amp; Drag</span>
                </div>
                <p className="text-slate-200 leading-relaxed text-[11px]">
                  {instruction?.touchAction || 'Drag sliders or touch points on the screen to vary the math values.'}
                </p>
              </div>

              {/* STEP 2: WATCH */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-purple-500/30 space-y-1">
                <div className="flex items-center gap-1.5 text-purple-400 font-bold text-[11px] uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Step 2: Watch Math Move</span>
                </div>
                <p className="text-slate-200 leading-relaxed text-[11px]">
                  {instruction?.goal || 'Observe how lines, curves, areas, and angles recalculate instantaneously.'}
                </p>
              </div>

              {/* STEP 3: THE DISCOVERY */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-emerald-500/30 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px] uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Step 3: The Discovery</span>
                </div>
                <p className="text-slate-200 leading-relaxed text-[11px]">
                  {instruction?.mathInsight || 'Understand why the theorem or equation remains invariant.'}
                </p>
              </div>
            </div>

            {/* Coach's Secret callout */}
            {sim?.coachSecret && (
              <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-800/40 text-[11px] text-amber-200 flex items-start gap-2">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong className="text-amber-300">Alka Ma'am's Coach Note: </strong>
                  {sim.coachSecret}
                </p>
              </div>
            )}
          </div>
        )}
      </aside>

      {/* ----------------------------------------------------------------- */}
      {/* 2. PULSING "TOUCH & SLIDE TO EXPLORE" AFFORDANCE HINT TOOLTIP      */}
      {/* ----------------------------------------------------------------- */}
      {showTouchHint && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-40 pointer-events-auto animate-bounce select-none">
          <div 
            onClick={dismissTouchHint}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/95 border border-cyan-400/80 text-cyan-200 text-xs shadow-2xl backdrop-blur-md cursor-pointer hover:bg-slate-800 transition-all group"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shrink-0" />
            <Sliders className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="font-semibold text-[11px] sm:text-xs">
              Touch &amp; slide controls to explore live!
            </span>
            <button
              type="button"
              onClick={dismissTouchHint}
              className="ml-1 text-slate-400 hover:text-white p-0.5 cursor-pointer"
              title="Dismiss hint"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
