import React, { useState } from 'react';
import { 
  Sparkles, 
  Lightbulb, 
  Award, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { useSimulatorStore } from '../../store/useSimulatorStore';
import { useHaptics } from '../../hooks/useHaptics';
import { MathText } from './MathFormula';

export interface ConceptInsightBannerProps {
  /** Short concept title, e.g. "Trajectory & Angle Optimization" */
  conceptTitle: string;
  /** Primary mathematical cause-and-effect rule */
  mathInsight: string;
  /** Explain Like I'm 10 (ELI-10) friendly real world analogy */
  eli10Analogy: string;
  /** Live parameter feedback based on current values */
  liveFeedback?: string;
  /** Optional comparison vs previous attempt */
  comparisonDiff?: {
    improved: boolean;
    text: string;
  };
  /** Optional preset button text & callback */
  quickAction?: {
    label: string;
    onApply: () => void;
  };
}

export const ConceptInsightBanner: React.FC<ConceptInsightBannerProps> = ({
  conceptTitle,
  mathInsight,
  eli10Analogy,
  liveFeedback,
  comparisonDiff,
  quickAction,
}) => {
  const { isZenMode, setIsAuthorModalOpen } = useSimulatorStore();
  const { lightTap } = useHaptics();
  const [isExpanded, setIsExpanded] = useState(false);
  const [mode, setMode] = useState<'math' | 'eli10'>('math');

  if (isZenMode) return null;

  return (
    <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-20 max-w-[290px] sm:max-w-[360px] pointer-events-auto select-none transition-all duration-300">
      <div className="rounded-xl bg-slate-950/90 backdrop-blur-md border border-slate-800 shadow-xl overflow-hidden text-xs">
        {/* Banner Header: Tap to expand */}
        <div 
          onClick={() => {
            lightTap();
            setIsExpanded(!isExpanded);
          }}
          className="p-2.5 sm:p-3 flex items-center justify-between cursor-pointer hover:bg-slate-900/50 transition-colors"
        >
          <div className="flex items-center gap-2 truncate">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                lightTap();
                setIsAuthorModalOpen(true);
              }}
              className="p-1.5 rounded-lg bg-amber-950/60 border border-amber-500/40 text-amber-300 hover:bg-amber-900/60 transition-colors shrink-0"
              title="Curated by Alka Sharma (Alka Ma'am) · 15+ Yrs Experience"
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
            </button>
            <div className="truncate">
              <span className="text-[10px] sm:text-[11px] text-amber-400 font-bold uppercase tracking-wider block">
                Aha! Concept Insight
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-100 truncate block">
                {conceptTitle}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 ml-1.5">
            {comparisonDiff && (
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                comparisonDiff.improved 
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-600/40' 
                  : 'bg-slate-800 text-slate-300 border border-slate-700'
              }`}>
                {comparisonDiff.text}
              </span>
            )}
            <button
              type="button"
              className="p-1 text-slate-400 hover:text-white"
              aria-label={isExpanded ? 'Collapse insight' : 'Expand insight'}
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Live Feedback Line (Always visible if present) */}
        {liveFeedback && (
          <div className="px-3 py-1.5 bg-cyan-950/40 border-t border-cyan-800/30 text-xs text-cyan-200 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shrink-0" />
            <div className="truncate">
              <MathText text={liveFeedback} />
            </div>
          </div>
        )}

        {/* Expanded Educational Deep-Dive */}
        {isExpanded && (
          <div className="p-3 border-t border-slate-800/80 space-y-2.5 bg-slate-950/70 animate-fade-in">
            {/* Mode Toggle: Math Formal vs ELI-10 Analogy */}
            <div className="grid grid-cols-2 p-0.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => {
                  lightTap();
                  setMode('math');
                }}
                className={`py-1.5 rounded-md font-semibold transition-all ${
                  mode === 'math' ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                📐 Formula Logic
              </button>
              <button
                type="button"
                onClick={() => {
                  lightTap();
                  setMode('eli10');
                }}
                className={`py-1.5 rounded-md font-semibold transition-all ${
                  mode === 'eli10' ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                🧒 Simple Analogy (ELI-10)
              </button>
            </div>

            {/* Explanation Content with Pure KaTeX formatting */}
            <div className="text-xs sm:text-sm leading-relaxed text-slate-200">
              {mode === 'math' ? (
                <div className="text-xs sm:text-sm text-cyan-200 bg-slate-900/80 p-2.5 rounded-lg border border-cyan-900/40">
                  <MathText text={mathInsight} />
                </div>
              ) : (
                <div className="text-amber-100/95 bg-amber-950/40 p-2.5 rounded-lg border border-amber-900/40 text-xs sm:text-sm">
                  <MathText text={eli10Analogy} />
                </div>
              )}
            </div>

            {/* Quick Action Preset */}
            {quickAction && (
              <button
                type="button"
                onClick={() => {
                  lightTap();
                  quickAction.onApply();
                }}
                className="w-full py-2 px-2.5 rounded-lg bg-gradient-to-r from-amber-500/20 to-cyan-500/20 hover:from-amber-500/30 hover:to-cyan-500/30 border border-amber-500/40 text-amber-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{quickAction.label}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
