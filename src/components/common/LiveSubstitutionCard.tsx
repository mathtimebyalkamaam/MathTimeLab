import React from 'react';
import { Sparkles, Calculator, ArrowRight } from 'lucide-react';
import { BlockMath } from './MathFormula';
import { useSimulatorStore } from '../../store/useSimulatorStore';

export interface ColorBreathingLegend {
  label: string;
  color: string;
  symbol: string;
}

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
  compact?: boolean;
  className?: string;
  /** 3Blue1Brown Color-Breathing Legends */
  legendItems?: ColorBreathingLegend[];
}

export const LiveSubstitutionCard: React.FC<LiveSubstitutionCardProps> = ({
  title,
  badge = 'Live Math Progression',
  symbolicLaw,
  substitutedLatex,
  evaluatedLatex,
  activeTerm,
  accentColor = 'cyan',
  compact: compactProp,
  className = '',
  legendItems,
}) => {
  const { isCompactControlsMode } = useSimulatorStore();
  const compact = compactProp !== undefined ? compactProp : isCompactControlsMode;
  const isBreathing = Boolean(activeTerm);

  return (
    <div
      className={`rounded-2xl bg-slate-900/90 border transition-all duration-300 shadow-sm select-all ${
        isBreathing
          ? 'border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/20'
          : 'border-slate-800'
      } ${compact ? 'p-2 space-y-1' : 'p-3 space-y-2'} ${className}`}
    >
      {/* Header */}
      <div className={`flex items-center justify-between border-b border-slate-800/80 ${compact ? 'pb-1' : 'pb-1.5'}`}>
        <div className="flex items-center gap-1.5">
          <Calculator className={`${compact ? 'w-3 h-3' : 'w-3.5 h-3.5'} text-cyan-400`} />
          <span className={`${compact ? 'text-[10px]' : 'text-[11px]'} font-bold text-cyan-300 uppercase tracking-wider`}>
            {title}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {activeTerm && (
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-amber-950/70 border border-amber-600/50 text-amber-300 animate-pulse flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              <span>Active: {activeTerm}</span>
            </span>
          )}
          <span className="text-[9px] font-mono text-cyan-400 bg-cyan-950/80 border border-cyan-800/60 px-1.5 py-0.2 rounded">
            {badge}
          </span>
        </div>
      </div>

      {/* 3-Tier Live Progression: Symbolic Law -> Active Substitution -> Evaluated Result */}
      <div className="flex flex-col gap-1.5 w-full">
        {/* Tier 1: General Symbolic Invariant */}
        <div className="rounded-xl bg-slate-950/85 border border-slate-700/80 p-2.5 flex flex-col justify-center">
          <span className="uppercase font-bold text-slate-300 tracking-wider text-[11px] mb-1 text-center">
            1. Symbolic Law
          </span>
          <div className="overflow-x-auto no-scrollbar py-0.5 text-center text-sm sm:text-base font-semibold">
            <BlockMath math={symbolicLaw} className="!my-0 text-slate-100 font-semibold" />
          </div>
        </div>

        {/* Tier 2: Live Substitution */}
        <div className="rounded-xl bg-slate-950/95 border border-cyan-600/70 p-2.5 flex flex-col justify-center relative group shadow-sm">
          <span className="uppercase font-bold text-cyan-300 tracking-wider flex items-center justify-center gap-1.5 text-[11px] mb-1 text-center">
            <span>2. Live Substitution</span>
            <ArrowRight className="w-3 h-3 text-cyan-400" />
          </span>
          <div className="overflow-x-auto no-scrollbar py-0.5 text-center text-sm sm:text-base font-bold">
            <BlockMath math={substitutedLatex} className="!my-0 text-cyan-200 font-bold" />
          </div>
        </div>

        {/* Tier 3: Evaluated Result */}
        {evaluatedLatex && (
          <div className="rounded-xl bg-emerald-950/50 border border-emerald-500/70 p-2.5 flex flex-col justify-center shadow-sm">
            <span className="uppercase font-bold text-emerald-300 tracking-wider text-[11px] mb-1 text-center">
              3. Evaluated Result
            </span>
            <div className="overflow-x-auto no-scrollbar py-0.5 text-center text-sm sm:text-base md:text-lg font-black">
              <BlockMath math={evaluatedLatex} className="!my-0 text-emerald-200 font-extrabold" />
            </div>
          </div>
        )}
      </div>

      {/* 3Blue1Brown Color Breathing Legend Ribbon */}
      {legendItems && legendItems.length > 0 && (
        <div className="pt-1.5 border-t border-slate-800/60 flex flex-wrap items-center justify-center gap-1.5">
          <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider mr-1">
            Visual Guide:
          </span>
          {legendItems.map((item, idx) => (
            <div
              key={idx}
              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-300 shadow-sm"
              style={{
                borderColor: `${item.color}40`,
              }}
            >
              <span
                className="w-2 h-2 rounded-full inline-block animate-pulse"
                style={{
                  backgroundColor: item.color,
                  boxShadow: `0 0 8px ${item.color}`,
                }}
              />
              <span className="font-semibold text-white">{item.symbol}</span>
              <span className="text-slate-400 text-[9px]">({item.label})</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
