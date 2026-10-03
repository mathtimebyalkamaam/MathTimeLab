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
  Lightbulb,
  Quote
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
      className="relative my-6 sm:my-8 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-slate-800/90 shadow-xl p-6 sm:p-8 overflow-hidden"
    >
      {/* Ambient background glow elements in soft sky & fuchsia */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-fuchsia-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-10 right-1/3 text-slate-700/10 pointer-events-none select-none">
        <Quote className="w-48 h-48" />
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row items-center gap-6 sm:gap-8 justify-between">
        {/* Left: Avatar Crest & Bio */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6 text-center sm:text-left">
          
          {/* Avatar Crest */}
          <div className="relative shrink-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-cyan-400 via-indigo-500 to-amber-400 p-[2px] shadow-2xl shadow-cyan-950/60 flex items-center justify-center">
              <div className="w-full h-full rounded-[22px] bg-slate-950 flex flex-col items-center justify-center text-center p-2.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-400/40 flex items-center justify-center mb-1 shadow-inner">
                  <GraduationCap className="w-6 h-6 text-cyan-300" />
                </div>
                <span className="text-[10px] font-mono font-black text-amber-300 tracking-wider">
                  ALKA MA'AM
                </span>
              </div>
            </div>
            <div 
              className="absolute -bottom-1 -right-1 p-1.5 bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 rounded-full border-2 border-slate-900 shadow-md"
              title="Verified Master Educator"
            >
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>

          <div className="space-y-2.5 max-w-xl">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <div className="p-1 rounded-lg bg-slate-900 border border-blue-400/30 flex items-center justify-center shadow-xs">
                <img 
                  src="/math-time-logo.png" 
                  alt="Math Time by Alka Ma'am" 
                  className="h-6 w-auto object-contain brightness-110 contrast-125 select-none"
                />
              </div>
              <span className="text-[10px] uppercase font-black tracking-widest text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-2.5 py-0.5 rounded-full shadow-xs">
                Master Pedagogy Specialist
              </span>
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Alka Sharma <span className="text-amber-300/90 text-base font-semibold font-sans">(Alka Ma&apos;am)</span>
              </h3>
              <p className="text-xs sm:text-sm text-cyan-200/90 font-mono font-medium mt-0.5">
                M.Sc. Mathematics · B.Ed. · B.Sc. · CTET Qualified · 15+ Years Classroom Pedagogy
              </p>
            </div>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans pt-0.5">
              &ldquo;Mathematics is not a dry sequence of formulas—it is a living visual art of patterns. Every simulator in Math Time Lab was designed to turn textbook anxiety into physical intuition.&rdquo;
            </p>
          </div>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full sm:w-auto shrink-0">
          <button
            type="button"
            onClick={handleOpenAuthorModal}
            className="py-3 px-5 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 hover:brightness-110 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/25 active:scale-95 transition-all cursor-pointer"
          >
            <Lightbulb className="w-4 h-4" />
            <span>Meet Alka Ma&apos;am &amp; Pedagogy</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>

          <div className="flex items-center gap-2">
            <a
              href="https://itsmathtime.co.in/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => selectionTick()}
              className="flex-1 py-2.5 px-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-500/50 text-slate-200 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
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
              className="flex-1 py-2.5 px-3.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/40 hover:border-rose-400 text-rose-200 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
              title="Watch video tutorials on YouTube: @its.mathtime"
            >
              <Youtube className="w-3.5 h-3.5 text-rose-400 fill-current" />
              <span>YouTube Channel</span>
              <ExternalLink className="w-3 h-3 text-rose-400" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
