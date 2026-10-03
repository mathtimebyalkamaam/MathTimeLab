/**
 * MathFormula.tsx: Pure Mathematical LaTeX Rendering Component using KaTeX.
 * Supports inline math, display equations, coach tips, and textbook contrast insights.
 */
import React, { useMemo } from 'react';
import katex from 'katex';
import { Lightbulb, BookOpen, GraduationCap } from 'lucide-react';

interface MathFormulaProps {
  formula?: string;
  math?: string;
  children?: string;
  displayMode?: boolean;
  label?: string;
  highlight?: string;
  coachTip?: string;
  textbookMyth?: string; // What textbooks confuse students with
  className?: string;
}

export const MathFormula: React.FC<MathFormulaProps> = ({
  formula,
  math,
  children,
  displayMode = true,
  label,
  highlight,
  coachTip,
  textbookMyth,
  className = '',
}) => {
  const rawLatex = formula || math || children || '';

  const html = useMemo(() => {
    if (!rawLatex.trim()) return '';
    try {
      return katex.renderToString(rawLatex, {
        displayMode,
        throwOnError: false,
        trust: true,
      });
    } catch {
      return rawLatex;
    }
  }, [rawLatex, displayMode]);

  return (
    <div
      className={`p-3 rounded-2xl bg-slate-900/95 border border-slate-800 text-xs shadow-sm flex flex-col gap-2 ${className}`}
    >
      {/* Label & Highlight Pill */}
      {(label || highlight) && (
        <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-1.5">
          {label && (
            <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
              <span>{label}</span>
            </span>
          )}
          {highlight && (
            <span className="font-mono text-[10px] text-amber-300 bg-amber-950/50 border border-amber-800/50 px-2 py-0.5 rounded-full">
              {highlight}
            </span>
          )}
        </div>
      )}

      {/* Pure KaTeX Rendered Formula */}
      <div 
        className={`overflow-x-auto no-scrollbar py-1 text-slate-100 ${displayMode ? 'text-center my-0.5' : ''}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {/* Textbook Myth vs Tutor Reality (Coaching Feature) */}
      {textbookMyth && (
        <div className="pt-1.5 border-t border-slate-800/80 text-[11px] text-slate-400">
          <span className="text-rose-400 font-semibold">Textbook Confusion: </span>
          <span>{textbookMyth}</span>
        </div>
      )}

      {/* Tutor Coaching Insight */}
      {coachTip && (
        <div className="p-2 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-[11px] text-cyan-200 flex items-start gap-1.5">
          <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-amber-300">Coach Intuition: </strong>
            <span>{coachTip}</span>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * InlineMath: For rendering quick LaTeX expressions in sentences like $e^{i\pi} + 1 = 0$
 */
export const InlineMath: React.FC<{ math?: string; className?: string }> = ({ math, className = '' }) => {
  const html = useMemo(() => {
    if (!math || typeof math !== 'string' || !math.trim()) return '';
    try {
      return katex.renderToString(math, {
        displayMode: false,
        throwOnError: false,
      });
    } catch {
      return math || '';
    }
  }, [math]);

  if (!html) return null;

  return (
    <span
      className={`inline-block text-cyan-300 font-normal px-0.5 ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

/**
 * BlockMath: For centered prominent display equations
 */
export const BlockMath: React.FC<{ math?: string; className?: string }> = ({ math, className = '' }) => {
  const html = useMemo(() => {
    if (!math || typeof math !== 'string' || !math.trim()) return '';
    try {
      return katex.renderToString(math, {
        displayMode: true,
        throwOnError: false,
      });
    } catch {
      return math || '';
    }
  }, [math]);

  if (!html) return null;

  return (
    <div
      className={`my-1 overflow-x-auto no-scrollbar text-center text-slate-100 select-all ${className}`}
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

/**
 * MathText: Intelligently parses mixed text containing $inline math$ or $$display math$$
 * and renders pure KaTeX for all math portions with boosted readability.
 */
export const MathText: React.FC<{ text?: string; className?: string }> = ({ text = '', className = '' }) => {
  if (!text) return null;

  // Split on $$...$$ or $...$
  const parts = text.split(/(\$\$[\s\S]+?\$\$|\$[^\$]+?\$)/g);

  return (
    <span className={`inline leading-relaxed ${className}`}>
      {parts.map((part, index) => {
        if (part.startsWith('$$') && part.endsWith('$$')) {
          const math = part.slice(2, -2).trim();
          return <BlockMath key={index} math={math} />;
        }
        if (part.startsWith('$') && part.endsWith('$')) {
          const math = part.slice(1, -1).trim();
          return <InlineMath key={index} math={math} />;
        }
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
};

