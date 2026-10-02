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
  Users
} from 'lucide-react';
import { useHaptics } from '../../hooks/useHaptics';

export const AudienceValueProposition: React.FC = () => {
  const [activeAudience, setActiveAudience] = useState<'students' | 'teachers'>('students');
  const { lightTap } = useHaptics();

  return (
    <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-4 sm:p-6 shadow-xl space-y-4">
      {/* Audience Toggle Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/80 border border-cyan-800 px-2 py-0.5 rounded">
            Proven Pedagogical Edge
          </span>
          <h2 className="text-base sm:text-lg font-black text-white mt-1">
            Why Math Time Lab Changes Everything
          </h2>
          <p className="text-xs text-slate-400">
            See how visual interactive learning transforms outcomes:
          </p>
        </div>

        {/* Toggle Switch */}
        <div className="flex items-center p-1 bg-slate-950 rounded-2xl border border-slate-800 self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => {
              lightTap();
              setActiveAudience('students');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeAudience === 'students'
                ? 'bg-gradient-to-r from-cyan-500 to-sky-400 text-slate-950 shadow-md font-extrabold'
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
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeAudience === 'teachers'
                ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>For Teachers &amp; Tutors</span>
          </button>
        </div>
      </div>

      {/* Content for Students */}
      {activeAudience === 'students' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-cyan-500/20 space-y-1.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Zap className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">Zero Formula Memorization</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Never memorize formulas blindly. When you drag coordinates and see the hypotenuse triangle form live, Pythagorean distance and trigonometry stick for life.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-emerald-500/20 space-y-1.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Target className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">Board &amp; Entrance Exam Precision</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Curriculum aligned with CBSE, ICSE, Cambridge, and competitive exam syllabi (Classes 8–12). Every lab contains step-by-step solved board exam problems and proofs.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-amber-500/20 space-y-1.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">60-Second Doubt Clearing</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Stuck on textbook misconceptions? Our Coach Notes highlight common exam traps and reveal the intuitive trick that makes the concept instantly clear.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-violet-500/20 space-y-1.5">
            <div className="w-8 h-8 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <Award className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">Daily Missions &amp; Mastery Tracking</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Earn XP, maintain daily learning streaks, and test your conceptual muscle with quick 2-minute daily visual challenges designed for retention.
            </p>
          </div>
        </div>
      )}

      {/* Content for Teachers & Educators */}
      {activeAudience === 'teachers' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-amber-500/20 space-y-1.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Tv className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">The Ultimate Classroom Projector Tool</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              No more struggling to draw 3D cones, parabolas, or vectors on whiteboards. Connect your laptop, tablet, or phone to the projector and demonstrate 60 FPS live math instantly.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-sky-500/20 space-y-1.5">
            <div className="w-8 h-8 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">Instant Student "Aha!" Moments</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              When students see parameters slide and graphs morph in real time, engagement triples. Abstract equations stop being intimidating symbols and become real geometry.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-emerald-500/20 space-y-1.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">Zero Preparation Time</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              50 structured visual laboratories organized by standard curriculum classes (Class 8 to 12, supporting CBSE, ICSE, Cambridge &amp; State Boards). Ready to use during live lectures, tuition batches, or recorded courses.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-rose-500/20 space-y-1.5">
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">Runs on Any Device &amp; Smart TV</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Zero downloads, zero app store hurdles. Works smoothly on Chromebooks, smart boards, iPads, Android tablets, and phones directly inside any modern browser.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
