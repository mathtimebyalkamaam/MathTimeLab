import React from 'react';
import { Lock, Sparkles, ShieldCheck } from 'lucide-react';
import { InlineMath } from './MathFormula';

export interface InvariantLockBadgeProps {
  /** Theorem title or invariant label, e.g. "Pythagorean Invariant", "BPT Constant Ratio" */
  label: string;
  /** Mathematical expression in pure KaTeX LaTeX, e.g. "\sin^2\theta + \cos^2\theta = 1" */
  invariantLatex: string;
  /** Current evaluated invariant value, e.g. "1.000", "180.0°", "k = 0.50" */
  currentValue?: string;
  /** State indicator: 'locked' (emerald) | 'evaluating' (cyan) | 'broken' (rose) */
  status?: 'locked' | 'evaluating' | 'broken';
  /** Optional custom CSS classes */
  className?: string;
}

export const InvariantLockBadge: React.FC<InvariantLockBadgeProps> = ({
  label,
  invariantLatex,
  currentValue,
  status = 'locked',
  className = '',
}) => {
  const statusStyles = {
    locked: 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300 shadow-emerald-950/40',
    evaluating: 'bg-cyan-950/80 border-cyan-500/60 text-cyan-300 shadow-cyan-950/40',
    broken: 'bg-rose-950/80 border-rose-500/60 text-rose-300 shadow-rose-950/40',
  };

  const iconColors = {
    locked: 'text-emerald-400',
    evaluating: 'text-cyan-400',
    broken: 'text-rose-400',
  };

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border backdrop-blur-md shadow-lg select-none transition-all ${statusStyles[status]} ${className}`}
      title={`${label}: Invariant conserved across all geometric transformations`}
    >
      <div className="flex items-center gap-1.5 shrink-0">
        {status === 'locked' ? (
          <ShieldCheck className={`w-3.5 h-3.5 ${iconColors[status]} animate-pulse`} />
        ) : (
          <Lock className={`w-3.5 h-3.5 ${iconColors[status]}`} />
        )}
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
          {label}
        </span>
      </div>

      <div className="h-3 w-[1px] bg-slate-700/80 shrink-0" />

      <div className="font-mono font-bold text-xs flex items-center gap-1.5">
        <InlineMath math={invariantLatex} />
        {currentValue && (
          <span className="text-white font-extrabold px-1.5 py-0.2 rounded bg-slate-900/90 border border-slate-700/60 text-[11px]">
            {currentValue}
          </span>
        )}
      </div>

      {status === 'locked' && (
        <span className="hidden sm:flex items-center gap-0.5 text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-emerald-900/60 text-emerald-200 border border-emerald-600/50">
          <Sparkles className="w-2.5 h-2.5" />
          <span>Locked</span>
        </span>
      )}
    </div>
  );
};
