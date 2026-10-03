/**
 * DualViewInspectorModal.tsx: Split-Screen Dual Perspective Comparison.
 * Recommendation 15: Allows students to inspect simultaneous dual perspectives
 * (e.g. Geometric Shape vs Algebraic Matrix / Derivative Spectrum / Polar-Cartesian dual view).
 */
import React from 'react';
import { 
  Columns, 
  X, 
  Sparkles, 
  Layers, 
  Maximize2,
  TrendingUp,
  Sliders
} from 'lucide-react';
import { InlineMath, BlockMath } from './MathFormula';

export interface DualViewSection {
  title: string;
  badge?: string;
  subtitle?: string;
  content: React.ReactNode;
}

export interface DualViewInspectorProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  badge?: string;
  leftTitle?: string;
  leftSubtitle?: string;
  leftContent?: React.ReactNode;
  rightTitle?: string;
  rightSubtitle?: string;
  rightContent?: React.ReactNode;
  primaryView?: DualViewSection;
  secondaryView?: DualViewSection;
  correlationFormula?: string;
  correlationInsight?: string;
  couplingBanner?: string;
}

export const DualViewInspectorModal: React.FC<DualViewInspectorProps> = ({
  isOpen,
  onClose,
  title,
  badge,
  leftTitle,
  leftSubtitle,
  leftContent,
  rightTitle,
  rightSubtitle,
  rightContent,
  primaryView,
  secondaryView,
  correlationFormula,
  correlationInsight,
  couplingBanner,
}) => {
  if (!isOpen) return null;

  const resolvedLeftTitle = primaryView?.title || leftTitle || 'Primary Perspective';
  const resolvedLeftBadge = primaryView?.badge || 'View 1';
  const resolvedLeftSubtitle = primaryView?.subtitle || leftSubtitle;
  const resolvedLeftContent = primaryView?.content || leftContent;

  const resolvedRightTitle = secondaryView?.title || rightTitle || 'Secondary Perspective';
  const resolvedRightBadge = secondaryView?.badge || 'View 2';
  const resolvedRightSubtitle = secondaryView?.subtitle || rightSubtitle;
  const resolvedRightContent = secondaryView?.content || rightContent;

  const bannerText = couplingBanner || correlationInsight;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/40">
              <Columns className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-950/60 text-purple-300 border border-purple-800/60">
                  {badge || 'Dual Perspective Inspector'}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white mt-0.5">
                {title}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-all cursor-pointer"
            title="Close Dual Inspector"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Correlation Insight Header Banner */}
        {(bannerText || correlationFormula) && (
          <div className="px-4 py-2.5 bg-gradient-to-r from-purple-950/50 via-cyan-950/50 to-slate-950 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="text-xs text-cyan-200 font-medium font-sans">
                {bannerText || 'Synchronized Dual Analytical Coupling:'}
              </span>
            </div>
            {correlationFormula && (
              <div className="font-mono text-xs text-amber-300">
                <InlineMath math={correlationFormula} />
              </div>
            )}
          </div>
        )}

        {/* Side-by-Side Dual View Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 custom-scrollbar">
          {/* Left Perspective Card */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-cyan-800/40 flex flex-col gap-3 shadow-inner">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-cyan-400">{resolvedLeftTitle}</h3>
                {resolvedLeftSubtitle && <p className="text-[11px] text-slate-400 font-mono">{resolvedLeftSubtitle}</p>}
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/50">
                {resolvedLeftBadge}
              </span>
            </div>
            <div className="flex-1 overflow-hidden flex items-center justify-center min-h-[220px]">
              {resolvedLeftContent}
            </div>
          </div>

          {/* Right Perspective Card */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-purple-800/40 flex flex-col gap-3 shadow-inner">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-purple-400">{resolvedRightTitle}</h3>
                {resolvedRightSubtitle && <p className="text-[11px] text-slate-400 font-mono">{resolvedRightSubtitle}</p>}
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800/50">
                {resolvedRightBadge}
              </span>
            </div>
            <div className="flex-1 overflow-hidden flex items-center justify-center min-h-[220px]">
              {resolvedRightContent}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 sm:p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-400 font-mono">
            MathTimeLab Comparative Dual Perspective Engine
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all cursor-pointer"
          >
            Close View
          </button>
        </div>
      </div>
    </div>
  );
};
