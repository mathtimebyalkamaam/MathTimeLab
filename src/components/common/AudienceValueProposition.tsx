import React, { useState } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  Sparkles, 
  CheckCircle2, 
  Tv, 
  Zap, 
  Target, 
  Clock, 
  TrendingUp, 
  Award, 
  Users,
  Lightbulb,
  ArrowRight,
  ShieldCheck,
  Flame,
  MousePointerClick
} from 'lucide-react';
import { useHaptics } from '../../hooks/useHaptics';

export const AudienceValueProposition: React.FC = () => {
  const [activeAudience, setActiveAudience] = useState<'students' | 'teachers'>('students');
  const { lightTap } = useHaptics();

  return (
    <div className="relative rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-slate-800/90 p-5 sm:p-8 shadow-xl space-y-6 overflow-hidden">
      {/* Ambient background glow elements in soft sky & fuchsia */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-fuchsia-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Audience Toggle Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-sky-300 bg-sky-950/80 border border-sky-500/40 px-3 py-0.5 rounded-full inline-flex items-center gap-1.5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>Proven Pedagogical Advantage</span>
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-2">
            Why Math Time Lab Changes Everything
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
            Discover how tactile visual experiments replace rote memorization with permanent intuition:
          </p>
        </div>

        {/* Toggle Switch */}
        <div className="flex items-center p-1 bg-slate-950/90 rounded-2xl border border-slate-700/80 self-start sm:self-auto shrink-0 shadow-inner">
          <button
            type="button"
            onClick={() => {
              lightTap();
              setActiveAudience('students');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeAudience === 'students'
                ? 'bg-gradient-to-r from-sky-400 via-cyan-400 to-teal-400 text-slate-950 shadow-[0_0_12px_rgba(56,189,248,0.35)] font-black scale-[1.02]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>For Students</span>
          </button>

          <button
            type="button"
            onClick={() => {
              lightTap();
              setActiveAudience('teachers');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeAudience === 'teachers'
                ? 'bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 text-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.35)] font-black scale-[1.02]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>For Educators &amp; Tutors</span>
          </button>
        </div>
      </div>

      {/* Bento Grid: For Students */}
      {activeAudience === 'students' && (
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Soft Light Blue Theme */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-sky-500/30 hover:border-sky-400 transition-all duration-300 space-y-3 shadow-md hover:shadow-[0_0_20px_rgba(56,189,248,0.2)] group">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform">
                <Zap className="w-5 h-5 fill-sky-400/20" />
              </div>
              <span className="text-[10px] font-mono font-bold text-sky-300 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-800">
                Intuition First
              </span>
            </div>
            <h3 className="text-sm font-black text-white group-hover:text-sky-300 transition-colors">
              Zero Formula Memorization
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Never memorize formulas blindly. When you drag coordinates and watch the hypotenuse triangle form live, Pythagorean distance and trigonometric ratios stick for life.
            </p>
          </div>

          {/* Card 2: Soft Vivid Emerald Theme */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-emerald-500/30 hover:border-emerald-400 transition-all duration-300 space-y-3 shadow-md hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] group">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <Target className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                100% CBSE &amp; NCERT
              </span>
            </div>
            <h3 className="text-sm font-black text-white group-hover:text-emerald-300 transition-colors">
              Board &amp; Entrance Exam Precision
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Curriculum aligned with CBSE, ICSE, Cambridge, and competitive exam syllabi (Classes 8–12). Every lab contains step-by-step solved board exam problems and proofs.
            </p>
          </div>

          {/* Card 3: Soft Amber-Gold Theme */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-amber-500/30 hover:border-amber-400 transition-all duration-300 space-y-3 shadow-md hover:shadow-[0_0_20px_rgba(245,158,11,0.2)] group">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                <Clock className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800">
                Instant Clarity
              </span>
            </div>
            <h3 className="text-sm font-black text-white group-hover:text-amber-300 transition-colors">
              60-Second Doubt Clearing
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Stuck on textbook misconceptions? Our Coach Notes highlight common exam traps and reveal the intuitive trick that makes the concept instantly crystal-clear.
            </p>
          </div>

          {/* Card 4: Soft Magenta / Fuchsia Theme */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-fuchsia-500/30 hover:border-fuchsia-400 transition-all duration-300 space-y-3 shadow-md hover:shadow-[0_0_20px_rgba(217,70,239,0.2)] group">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-fuchsia-500/15 border border-fuchsia-500/30 flex items-center justify-center text-fuchsia-400 group-hover:scale-110 transition-transform">
                <Award className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono font-bold text-fuchsia-300 bg-fuchsia-950/80 px-2 py-0.5 rounded border border-fuchsia-800">
                Gamified XP
              </span>
            </div>
            <h3 className="text-sm font-black text-white group-hover:text-fuchsia-300 transition-colors">
              Daily Missions &amp; Mastery Tracking
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Earn XP, maintain daily learning streaks, and test your conceptual muscle with quick 2-minute daily visual challenges designed for long-term retention.
            </p>
          </div>
        </div>
      )}

      {/* Bento Grid: For Teachers & Educators */}
      {activeAudience === 'teachers' && (
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-gradient-to-b from-[#2d1e08] to-[#1a1104] border border-amber-500/40 hover:border-amber-400 transition-all duration-300 space-y-3 shadow-lg hover:shadow-[0_0_25px_rgba(245,158,11,0.25)] group">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <Tv className="w-5 h-5" />
            </div>
            <h3 className="text-base font-black text-white group-hover:text-amber-300 transition-colors">
              The Ultimate Classroom Projector Tool
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              No more struggling to draw 3D cones, parabolas, or vectors on whiteboards. Connect your laptop or tablet to the projector and demonstrate 60 FPS live math instantly.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-b from-[#0e223d] to-[#091526] border border-sky-500/40 hover:border-sky-400 transition-all duration-300 space-y-3 shadow-lg hover:shadow-[0_0_25px_rgba(14,165,233,0.25)] group">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5 text-sky-400" />
            </div>
            <h3 className="text-base font-black text-white group-hover:text-sky-300 transition-colors">
              Instant Student "Aha!" Moments
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              When students see parameters slide and graphs morph in real time, engagement triples. Abstract equations stop being intimidating symbols and become real geometry.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-b from-[#0c2b20] to-[#071a13] border border-emerald-500/40 hover:border-emerald-400 transition-all duration-300 space-y-3 shadow-lg hover:shadow-[0_0_25px_rgba(16,185,129,0.25)] group">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-base font-black text-white group-hover:text-emerald-300 transition-colors">
              Zero Preparation Time
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              50 structured visual laboratories organized by standard curriculum classes (Class 8 to 12). Ready to use immediately during live lectures, tuition batches, or recorded courses.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
