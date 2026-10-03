import React from 'react';
import { Sparkles, Calculator, ArrowRight } from 'lucide-react';
import { BlockMath } from './MathFormula';

export interface LiveSubstitutionCardProps {
  title: string;
  badge?: string;
  /** General symbolic law, e.g. "d = \\sqrt{(\\Delta x)^2 + (\\Delta y)^2}" */
  symbolicLaw: string;
  /** Active numeric substitution, e.g. "d = \\sqrt{(3)^2 + (4)^2}" */
  substitutedLatex: string;
  /** Evaluated final result, e.g. "d = \\sqrt{25} = 5.00 \\text{ u}" */
  evaluatedLatex?: string;
  /** Currently active parameter or term (e.g. "x", "h", "a", "θ") */
  activeTerm?: string;
  accentColor?: string;
  className?: string;
}

export const LiveSubstitutionCard: React.FC<LiveSubstitutionCardProps> = ({
  title,
  badge = 'Live Math Progression',
  symbolicLaw,
  substitutedLatex,
  evaluatedLatex,
  activeTerm,
  accentColor = 'cyan',
  className = '',
}) => {
  return (
    <div
      className={`p-3 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm space-y-2 select-all ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
        <div className="flex items-center gap-1.5">
          <Calculator className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider">
            {title}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {activeTerm && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-950/70 border border-amber-600/50 text-amber-300 animate-pulse flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              <span>Active: {activeTerm}</span>
            </span>
          )}
          <span className="text-[9px] font-mono text-cyan-400 bg-cyan-950/80 border border-cyan-800/60 px-1.5 py-0.5 rounded">
            {badge}
          </span>
        </div>
      </div>

      {/* 3-Tier Live Progression: Symbolic Law -> Active Substitution -> Evaluated Result */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-1.5 items-center">
        {/* Tier 1: General Symbolic Invariant */}
        <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800/80 text-center flex flex-col justify-center min-h-[48px]">
          <span className="text-[9px] uppercase font-bold text-slate-400 mb-0.5 tracking-wider">
            1. Symbolic Law
          </span>
          <div className="overflow-hidden">
            <BlockMath math={symbolicLaw} className="!my-0 text-xs sm:text-sm text-slate-200" />
          </div>
        </div>

        {/* Tier 2: Live Substitution */}
        <div className="p-2 rounded-xl bg-slate-950/90 border border-cyan-900/40 text-center flex flex-col justify-center min-h-[48px] relative group">
          <span className="text-[9px] uppercase font-bold text-cyan-400 mb-0.5 tracking-wider flex items-center justify-center gap-1">
            <span>2. Live Substitution</span>
            <ArrowRight className="w-2.5 h-2.5 text-cyan-500" />
          </span>
          <div className="overflow-hidden">
            <BlockMath math={substitutedLatex} className="!my-0 text-xs sm:text-sm text-cyan-300 font-semibold" />
          </div>
        </div>

        {/* Tier 3: Evaluated Result */}
        {evaluatedLatex && (
          <div className="p-2 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-center flex flex-col justify-center min-h-[48px]">
            <span className="text-[9px] uppercase font-bold text-emerald-400 mb-0.5 tracking-wider">
              3. Evaluated Result
            </span>
            <div className="overflow-hidden">
              <BlockMath math={evaluatedLatex} className="!my-0 text-xs sm:text-sm text-emerald-300 font-bold" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
