import React from 'react';
import { 
  GraduationCap, 
  Award, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  ExternalLink, 
  Youtube, 
  Globe, 
  Heart, 
  BookOpen, 
  ArrowRight,
  Lightbulb
} from 'lucide-react';
import { useSimulatorStore } from '../../store/useSimulatorStore';
import { useHaptics } from '../../hooks/useHaptics';
import { useSound } from './SoundManager';

export const AuthorSpotlightSection: React.FC = () => {
  const { setIsAuthorModalOpen } = useSimulatorStore();
  const { lightTap, selectionTick } = useHaptics();
  const { playClick } = useSound();

  const handleOpenAuthorModal = () => {
    lightTap();
    playClick();
    setIsAuthorModalOpen(true);
  };

  return (
    <section 
      aria-label="Meet the Educator - Alka Sharma" 
      className="relative my-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-cyan-950/30 border border-slate-800/90 shadow-2xl p-5 sm:p-8 overflow-hidden"
    >
      {/* Decorative Glow Ambient Elements */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center gap-6 sm:gap-8 justify-between">
        {/* Left: Avatar & Badges */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5 text-center sm:text-left">
          <div className="relative shrink-0">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-cyan-400 via-indigo-500 to-purple-500 p-0.5 shadow-xl shadow-cyan-950/50 flex items-center justify-center">
              <div className="w-full h-full rounded-[14px] bg-slate-950 flex flex-col items-center justify-center text-center p-2">
                <GraduationCap className="w-9 h-9 text-cyan-400 mb-0.5" />
                <span className="text-[10px] font-mono font-bold text-cyan-300 tracking-wider">
                  ALKA MA'AM
                </span>
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 p-1 bg-emerald-500 text-slate-950 rounded-full border-2 border-slate-900 shadow">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="space-y-2 max-w-xl">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <img 
                src="/math-time-logo.png" 
                alt="Math Time BY ALKA MA'AM" 
                className="h-7 sm:h-8 w-auto object-contain select-none"
              />
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 bg-emerald-950/70 border border-emerald-800/60 px-2 py-0.5 rounded-full">
                Lead Educator & Curator
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Alka Sharma <span className="text-slate-400 text-base font-normal font-sans">(Alka Ma'am)</span>
            </h3>

            <p className="text-xs sm:text-sm text-cyan-200/90 font-medium">
              M.Sc. Mathematics · B.Ed. · B.Sc. · CTET Qualified · 15+ Years Classroom Experience
            </p>

            <p className="text-xs text-slate-300 leading-relaxed pt-1">
              "Mathematics is a visual art of patterns. Every simulation in Math Time Lab was designed to transform intimidating textbook formulas into tactile, living intuition."
            </p>
          </div>
        </div>

        {/* Right: Quick Action Buttons & Links */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 w-full sm:w-auto shrink-0">
          <button
            type="button"
            onClick={handleOpenAuthorModal}
            className="py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <Lightbulb className="w-4 h-4" />
            <span>Meet Alka Ma'am & Pedagogy</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-2">
            <a
              href="https://itsmathtime.co.in/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => selectionTick()}
              className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
              title="Visit official website: itsmathtime.co.in"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>itsmathtime.co.in</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>

            <a
              href="https://www.youtube.com/@its.mathtime"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => selectionTick()}
              className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-rose-950/40 border border-slate-700 hover:border-rose-500/40 text-slate-300 hover:text-rose-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
              title="Watch video tutorials on YouTube: @its.mathtime"
            >
              <Youtube className="w-3.5 h-3.5 text-rose-400" />
              <span>@its.mathtime</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
