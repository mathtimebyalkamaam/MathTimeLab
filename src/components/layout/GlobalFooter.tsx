import React from 'react';
import {
  Sparkles,
  GraduationCap,
  Youtube,
  Globe,
  ExternalLink,
  ShieldCheck,
  Award,
  Zap,
  CheckCircle2,
  Lock,
  Cpu,
  ArrowRight,
  BookOpen,
  Compass,
  Grid,
  FileCheck2,
  Flame,
  Timer,
  GitFork,
  Heart
} from 'lucide-react';
import { useSimulatorStore } from '../../store/useSimulatorStore';
import { useHaptics } from '../../hooks/useHaptics';
import { GradeLevel } from '../../types/simulators';

interface GlobalFooterProps {
  onOpenAuthorModal?: () => void;
}

export const GlobalFooter: React.FC<GlobalFooterProps> = ({ onOpenAuthorModal }) => {
  const { navigateTo, setGradeFilter, setSearchQuery } = useSimulatorStore();
  const { lightTap } = useHaptics();

  const handleGradeClick = (grade: GradeLevel) => {
    lightTap();
    setGradeFilter(grade);
    navigateTo('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryClick = (category: string) => {
    lightTap();
    setSearchQuery(category);
    navigateTo('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageClick = (pageId: string) => {
    lightTap();
    navigateTo(pageId as any);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-slate-950 border-t border-slate-800/90 text-slate-400 text-xs relative overflow-hidden select-none">
      {/* Decorative top luminous accent line in soft sky & fuchsia */}
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-sky-400/50 via-fuchsia-400/50 to-transparent pointer-events-none" />

      {/* Subtle background ambient radial glow */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-sky-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Main Footer Content Container */}
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-12 sm:py-16 space-y-12 relative z-10">
        
        {/* TOP ROW: Brand identity, YouTube channel feature banner, and trust stats */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pb-10 border-b border-slate-800/80 items-start">
          
          {/* Brand Presentation & Mission */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-xl bg-slate-900 border border-slate-700/80 shadow-sm flex items-center justify-center">
                <img 
                  src="/math-time-logo.png" 
                  alt="Math Time by Alka Ma'am" 
                  className="h-9 w-auto object-contain brightness-110 contrast-125"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg sm:text-xl tracking-tight text-white leading-none">
                  MATH TIME
                </span>
                <span className="px-2 py-0.5 rounded-lg text-xs font-black tracking-widest uppercase bg-gradient-to-r from-emerald-400 via-cyan-400 to-teal-300 text-slate-950 shadow-[0_0_10px_rgba(52,211,153,0.45)] leading-none">
                  LAB
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed max-w-xl font-normal">
              Transforming abstract mathematics from symbols on a chalkboard into living, tactile visual laboratories. Engineered for CBSE, NCERT, ICSE, and international STEM learners from Class 8 through 12.
            </p>

            {/* Credibility and Feature Badges */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/80 text-[11px] text-emerald-300 font-semibold shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                100% Free Open Educational Resource
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-700/80 text-[11px] text-sky-300 font-semibold shadow-sm">
                <Lock className="w-3.5 h-3.5 text-sky-400" />
                Zero Sign-Up · Strict Privacy
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-700/80 text-[11px] text-fuchsia-300 font-semibold shadow-sm">
                <Cpu className="w-3.5 h-3.5 text-fuchsia-400" />
                60 FPS WebGL Physics Engine
              </span>
            </div>
          </div>

          {/* Official YouTube Channel Spotlight Card */}
          <div className="lg:col-span-6">
            <div className="rounded-2xl bg-slate-900/80 border border-rose-500/30 p-5 sm:p-6 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/10 blur-3xl rounded-full pointer-events-none" />
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 group-hover:scale-105 transition-transform shrink-0 shadow-lg shadow-rose-950/50">
                    <Youtube className="w-6 h-6 fill-rose-500 text-rose-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-white tracking-tight">Official YouTube Channel</h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-950 border border-rose-800 text-rose-300">
                        @its.mathtime
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Watch in-depth video walkthroughs, derivations, and concept shortcuts by Alka Ma&apos;am.
                    </p>
                  </div>
                </div>

                <a
                  href="https://www.youtube.com/@its.mathtime"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={lightTap}
                  className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-600/30 hover:shadow-rose-600/50 transition-all shrink-0 active:scale-95 cursor-pointer"
                >
                  <Youtube className="w-4 h-4 fill-current" />
                  <span>Subscribe &amp; Learn</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* MIDDLE ROW: 4 SEO-Dense Column Navigation Directory */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-10">
          
          {/* Column 1: Curriculum Grades (Classes 8–12) */}
          <div className="space-y-3">
            <h5 className="font-mono uppercase font-bold text-white text-xs tracking-wider flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-emerald-400" />
              <span>Curriculum Labs</span>
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => handleGradeClick('class-8')}
                  className="hover:text-emerald-300 transition-colors text-left text-slate-300 font-medium"
                >
                  Class 8: Rational Numbers &amp; Mensuration
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleGradeClick('class-9')}
                  className="hover:text-cyan-300 transition-colors text-left text-slate-300 font-medium"
                >
                  Class 9: Coordinate Geometry &amp; Circles
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleGradeClick('class-10')}
                  className="hover:text-amber-300 transition-colors text-left text-slate-300 font-medium"
                >
                  Class 10: Quadratics &amp; Trigonometry
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleGradeClick('class-11')}
                  className="hover:text-purple-300 transition-colors text-left text-slate-300 font-medium"
                >
                  Class 11: 3D Conics &amp; Limits
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleGradeClick('class-12')}
                  className="hover:text-blue-300 transition-colors text-left text-slate-300 font-medium"
                >
                  Class 12: Calculus, Integrals &amp; 3D Vectors
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Conceptual Domains & Topics */}
          <div className="space-y-3">
            <h5 className="font-mono uppercase font-bold text-white text-xs tracking-wider flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-cyan-400" />
              <span>Math Domains</span>
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => handleCategoryClick('Algebra')}
                  className="hover:text-cyan-300 transition-colors text-left text-slate-300 font-medium"
                >
                  ⚖️ Algebra &amp; Quadratic Roots
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleCategoryClick('Geometry')}
                  className="hover:text-cyan-300 transition-colors text-left text-slate-300 font-medium"
                >
                  📐 Euclidean &amp; Circle Geometry
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleCategoryClick('Trigonometry')}
                  className="hover:text-cyan-300 transition-colors text-left text-slate-300 font-medium"
                >
                  🏹 Unit Circle &amp; Sine/Cosine Waves
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleCategoryClick('Calculus')}
                  className="hover:text-cyan-300 transition-colors text-left text-slate-300 font-medium"
                >
                  📈 Derivatives, Tangents &amp; Areas
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleCategoryClick('Conics & 3D')}
                  className="hover:text-cyan-300 transition-colors text-left text-slate-300 font-medium"
                >
                  🪐 3D Conic Sections &amp; Vectors
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Pedagogical Tools & Exam Engines */}
          <div className="space-y-3">
            <h5 className="font-mono uppercase font-bold text-white text-xs tracking-wider flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Diagnostic Engines</span>
            </h5>
            <ul className="space-y-2 text-xs">
              <li className="text-slate-300">
                <span className="font-semibold text-amber-300">Predict · Observe · Explain (POE):</span> Interactive inquiry challenges
              </li>
              <li className="text-slate-300">
                <span className="font-semibold text-emerald-300">Real Board Exam PYQs:</span> CBSE &amp; JEE questions with step marking
              </li>
              <li className="text-slate-300">
                <span className="font-semibold text-rose-300">Break the Math:</span> Boundary singular stress-tester
              </li>
              <li className="text-slate-300">
                <span className="font-semibold text-blue-300">60s Intuition Drills:</span> Visual sprint reflex training
              </li>
              <li className="text-slate-300">
                <span className="font-semibold text-purple-300">Proof Ladders:</span> Line-by-line derivation steps
              </li>
            </ul>
          </div>

          {/* Column 4: Educator & Resources */}
          <div className="space-y-3">
            <h5 className="font-mono uppercase font-bold text-white text-xs tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-purple-400" />
              <span>Educator Hub</span>
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => handlePageClick('teacher')}
                  className="hover:text-emerald-300 transition-colors text-left text-slate-300 font-medium flex items-center gap-1.5"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Teacher Analytics &amp; Gradebook</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    lightTap();
                    onOpenAuthorModal?.();
                  }}
                  className="hover:text-amber-300 transition-colors text-left text-slate-300 font-medium flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Meet Alka Ma&apos;am &amp; Pedagogy</span>
                </button>
              </li>
              <li>
                <a
                  href="https://itsmathtime.co.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-300 transition-colors text-left text-slate-300 font-medium flex items-center gap-1.5"
                >
                  <Globe className="w-3.5 h-3.5 text-cyan-400" />
                  <span>itsmathtime.co.in</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handlePageClick('landing')}
                  className="hover:text-cyan-300 transition-colors text-left text-slate-300 font-medium flex items-center gap-1.5"
                >
                  <Compass className="w-3.5 h-3.5 text-purple-400" />
                  <span>Pedagogical Overview</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 5: Key Math Topics & SEO Indexing */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 space-y-3">
            <h5 className="font-mono uppercase font-bold text-white text-xs tracking-wider flex items-center gap-1.5">
              <Grid className="w-4 h-4 text-blue-400" />
              <span>Fast Navigation</span>
            </h5>
            <p className="text-[11px] text-slate-400 leading-snug">
              Access all 50 full-screen laboratories instantly with 0 latency, mobile touch-responsiveness, and KaTeX mathematical rigor.
            </p>
            <button
              type="button"
              onClick={() => handlePageClick('home')}
              className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-white font-bold text-xs flex items-center justify-between transition-colors cursor-pointer"
            >
              <span>Explore All 50 Labs</span>
              <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
            </button>
          </div>
        </div>

        {/* BOTTOM ROW: Copyright, Smart Trust-Building Accuracy & Curriculum Disclaimer */}
        <div className="pt-8 border-t border-slate-800/80 space-y-4">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-300">&copy; {new Date().getFullYear()} Math Time Lab</span>
              <span>·</span>
              <span>Created with pedagogical devotion by <strong className="text-white">Alka Ma&apos;am (Alka Sharma)</strong></span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-slate-400">
              <span className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Double-Precision IEEE 754 Physics &amp; Mathematics</span>
              </span>
              <span>·</span>
              <span className="font-mono text-cyan-400">CBSE / NCERT / ICSE Aligned</span>
            </div>
          </div>

          {/* Smart, Trust-Building Academic Accuracy & Trademark Statement */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-[10px] sm:text-[11px] text-slate-400 leading-relaxed space-y-1.5">
            <p>
              <strong className="text-slate-200">Academic Integrity &amp; Simulation Precision:</strong> All interactive geometric theorems, algebraic derivations, calculus rates, and kinematic physical models in <em>Math Time Lab</em> are engineered in strict conformance with standard analytical physics principles and standard CBSE/NCERT curriculum benchmarks. Numerical calculations utilize high-precision 64-bit floating-point computing to deliver accurate intuition, classroom demonstration fidelity, and self-directed mastery.
            </p>
            <p className="text-slate-500">
              <strong className="text-slate-400">Copyright &amp; Curriculum Alignment Notice:</strong> All proprietary simulation engines, visual layouts, and pedagogy frameworks are &copy; Math Time Lab by Alka Ma&apos;am. CBSE, NCERT, ICSE, Cambridge, and State Board designations are referenced strictly for educational syllabus alignment and context. <em>Math Time Lab</em> operates as an independent open educational laboratory dedicated to empowering students and teachers worldwide.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
