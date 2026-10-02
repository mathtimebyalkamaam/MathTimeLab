import React from 'react';
import { 
  X, 
  Award, 
  GraduationCap, 
  BookOpen, 
  ExternalLink, 
  Sparkles, 
  Youtube, 
  Globe, 
  Heart, 
  CheckCircle2, 
  Compass, 
  ShieldCheck, 
  Target,
  ArrowRight
} from 'lucide-react';
import { useSimulatorStore } from '../../store/useSimulatorStore';
import { useHaptics } from '../../hooks/useHaptics';
import { useSound } from '../common/SoundManager';

export const AuthorProfileModal: React.FC = () => {
  const { isAuthorModalOpen, setIsAuthorModalOpen } = useSimulatorStore();
  const { lightTap, selectionTick } = useHaptics();
  const { playClick, playResonance } = useSound();

  if (!isAuthorModalOpen) return null;

  const handleClose = () => {
    lightTap();
    setIsAuthorModalOpen(false);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-fade-in"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="author-modal-title"
    >
      <div 
        className="relative w-full max-w-2xl max-h-[92vh] flex flex-col bg-slate-900 border border-cyan-500/30 rounded-3xl shadow-2xl overflow-hidden animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow Header Accent Banner */}
        <div className="relative p-5 sm:p-6 bg-gradient-to-br from-cyan-950/70 via-slate-900 to-purple-950/40 border-b border-slate-800 shrink-0">
          {/* Close Button */}
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer shadow-md"
            aria-label="Close author profile"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Educator Header Card */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            {/* Avatar with Glow Rings */}
            <div className="relative shrink-0">
              <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-500 p-0.5 shadow-xl shadow-cyan-950/80 flex items-center justify-center">
                <div className="w-full h-full rounded-[14px] bg-slate-950 flex flex-col items-center justify-center text-center p-1">
                  <GraduationCap className="w-9 h-9 text-cyan-400 mb-0.5" />
                  <span className="text-[10px] font-mono font-bold text-cyan-300">ALKA MA'AM</span>
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 p-1 bg-emerald-500 text-slate-950 rounded-full border-2 border-slate-900 shadow" title="Verified Senior Educator">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Profile Info */}
            <div className="text-center sm:text-left space-y-2 flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-1">
                <img 
                  src="/math-time-logo.png" 
                  alt="Math Time BY ALKA MA'AM" 
                  className="h-7 sm:h-8 w-auto object-contain select-none"
                />
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h3 id="author-modal-title" className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                  Alka Sharma
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  Alka Ma'am
                </span>
              </div>

              <p className="text-xs sm:text-sm text-cyan-200 font-medium">
                Founder, Math Time · Senior Mathematics Educator & Pedagogy Specialist
              </p>

              {/* Verified Credentials Pills */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 pt-1">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-semibold text-slate-300">
                  <Award className="w-3 h-3 text-amber-400" />
                  M.Sc. Mathematics
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-semibold text-slate-300">
                  <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                  B.Ed. & B.Sc.
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-semibold text-emerald-300">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  CTET Qualified
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-purple-950/60 border border-purple-800/60 text-[11px] font-semibold text-purple-300">
                  <Sparkles className="w-3 h-3 text-purple-400" />
                  15+ Years Experience
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs sm:text-sm text-slate-300 no-scrollbar">
          {/* Core Vision Quote */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-cyan-500/20 relative shadow-inner">
            <div className="flex items-start gap-3">
              <span className="text-2xl text-cyan-400 font-serif leading-none select-none">“</span>
              <div className="space-y-1">
                <p className="italic text-slate-200 text-xs sm:text-sm leading-relaxed">
                  Mathematics is not a collection of formulas to be memorized in fear—it is a visual language of patterns waiting to be played with. When students can touch, slide, and see a concept come alive, anxiety vanishes and genuine mastery begins.
                </p>
                <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider text-right">
                  — Alka Sharma, Founder of Math Time
                </div>
              </div>
            </div>
          </div>

          {/* Pedagogy Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-950/50 border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
                <Target className="w-4 h-4 text-cyan-400" />
                <span>15+ Years Classroom Mastery</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Mentored thousands of students across Classes 7 to 12. Attended 15+ prestigious national-level mathematics workshops across India to pioneer experiential teaching techniques.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/50 border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                <Compass className="w-4 h-4 text-amber-400" />
                <span>Concept Over Cramming</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Specialized in deconstructing textbook traps, identifying common student misconceptions, and providing step-by-step derivation ladders that turn C-grade doubts into A-grade clarity.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/50 border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-wider">
                <BookOpen className="w-4 h-4 text-purple-400" />
                <span>Curriculum Alignment</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Deep alignment with CBSE, ICSE, Cambridge & State Board syllabus expectations, past-year board questions (PYQs), and competitive exam foundation building.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/50 border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Interactive Math Simulators</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Designed every lab in Math Time Lab so that students never need to read static pages. Sliders, physics engines, and 3D canvases give instant tactile intuition in seconds.
              </p>
            </div>
          </div>

          {/* Official Channel Links Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-700/80 space-y-3">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
              Connect With Alka Ma'am & Math Time
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Official Website */}
              <a
                href="https://itsmathtime.co.in/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  selectionTick();
                  playClick();
                }}
                className="p-3 rounded-xl bg-slate-800/80 hover:bg-cyan-950/50 border border-slate-700 hover:border-cyan-500/50 flex items-center justify-between group transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-white group-hover:text-cyan-300 transition-colors">
                      Official Website
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      itsmathtime.co.in
                    </div>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-300 transition-colors" />
              </a>

              {/* YouTube Channel */}
              <a
                href="https://www.youtube.com/@its.mathtime"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  selectionTick();
                  playClick();
                }}
                className="p-3 rounded-xl bg-slate-800/80 hover:bg-rose-950/50 border border-slate-700 hover:border-rose-500/50 flex items-center justify-between group transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Youtube className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-white group-hover:text-rose-300 transition-colors">
                      YouTube Video Lessons
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      @its.mathtime
                    </div>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-300 transition-colors" />
              </a>
            </div>
          </div>

          {/* Legal / Nominative Trademark Disclaimer */}
          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 text-[10px] text-slate-500 leading-relaxed text-center">
            * CBSE, ICSE, Cambridge, and other board names are registered trademarks of their respective authorities. Math Time Lab is an independent pedagogical laboratory created by Alka Sharma (Math Time) to support student learning through visual simulations.
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3.5 sm:p-4 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between gap-3 shrink-0">
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400/40" />
            <span>Built with passion for every math learner</span>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="py-1.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 active:scale-95 transition-all cursor-pointer"
          >
            Start Exploring Labs
          </button>
        </div>
      </div>
    </div>
  );
};
