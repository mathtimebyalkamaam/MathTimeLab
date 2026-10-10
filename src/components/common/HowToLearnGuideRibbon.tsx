import React from 'react';
import { 
  Sliders, 
  Eye, 
  Lightbulb, 
  Sparkles, 
  ArrowRight,
  GraduationCap,
  CheckCircle2
} from 'lucide-react';

interface HowToLearnGuideRibbonProps {
  onChooseClassClick?: () => void;
}

export const HowToLearnGuideRibbon: React.FC<HowToLearnGuideRibbonProps> = ({ onChooseClassClick }) => {
  return (
    <section 
      aria-label="How to learn with Math Time Lab"
      className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-cyan-500/30 p-5 sm:p-7 shadow-2xl overflow-hidden"
    >
      {/* Background radial glows */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-6">
        {/* Header Ribbon */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950">
                Self-Study Guide
              </span>
              <span className="text-xs font-semibold text-slate-400">
                Learn Any Concept in 3 Minutes
              </span>
            </div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>How This Website Teaches You Without a Teacher</span>
              <Sparkles className="w-5 h-5 text-amber-400 hidden sm:inline" />
            </h2>
          </div>

          {onChooseClassClick && (
            <button
              type="button"
              onClick={onChooseClassClick}
              className="self-start sm:self-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-cyan-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Choose Your Class Below</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* 3 Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* STEP 1 */}
          <div className="relative p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-cyan-500/25 space-y-3 shadow-md hover:border-cyan-400/50 transition-colors group">
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-mono font-black text-sm flex items-center justify-center shadow-inner">
                1
              </span>
              <span className="text-[10px] font-mono uppercase font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/60">
                Step 1 · Touch
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-cyan-300 transition-colors flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <span>Slide &amp; Touch Controls</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                Don&apos;t just read! Move the sliders, drag coordinate points with your finger, or add weights to balance scales.
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center gap-1.5 text-[11px] text-cyan-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>Touch anything that glows or has sliders</span>
            </div>
          </div>

          {/* STEP 2 */}
          <div className="relative p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-purple-500/25 space-y-3 shadow-md hover:border-purple-400/50 transition-colors group">
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 font-mono font-black text-sm flex items-center justify-center shadow-inner">
                2
              </span>
              <span className="text-[10px] font-mono uppercase font-bold text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/60">
                Step 2 · Observe
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-purple-300 transition-colors flex items-center gap-2">
                <Eye className="w-4 h-4 text-purple-400" />
                <span>Watch Math Move Live</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                As you slide, watch 3D cones slice, parabolas bend, and KaTeX mathematical formulas recalculate live in 60 FPS.
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center gap-1.5 text-[11px] text-purple-300 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
              <span>See the formula change as you slide</span>
            </div>
          </div>

          {/* STEP 3 */}
          <div className="relative p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-emerald-500/25 space-y-3 shadow-md hover:border-emerald-400/50 transition-colors group">
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono font-black text-sm flex items-center justify-center shadow-inner">
                3
              </span>
              <span className="text-[10px] font-mono uppercase font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                Step 3 · Master
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-emerald-300 transition-colors flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-emerald-400" />
                <span>Memorize Zero Formulas</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                You discover the mathematical law with your own eyes. Now you will never forget it or get confused in your school exams!
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center gap-1.5 text-[11px] text-emerald-300 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Full concept confidence for board exams</span>
            </div>
          </div>
        </div>

        {/* Reassuring Educator Quote Footnote */}
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong className="text-white">Alka Ma&apos;am&apos;s Advice:</strong> &ldquo;Don&apos;t just memorize formulas from a book. Open a simulator, play with the sliders for 2 minutes, and the logic will lock into your memory permanently.&rdquo;
            </span>
          </div>
          <span className="text-[11px] font-mono text-cyan-300 shrink-0">100% Free · No Sign-Up</span>
        </div>
      </div>
    </section>
  );
};
