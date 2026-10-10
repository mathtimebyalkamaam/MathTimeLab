import React from 'react';
import { 
  GraduationCap, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import { GradeLevel } from '../../types/simulators';
import { useSimulatorStore } from '../../store/useSimulatorStore';
import { useHaptics } from '../../hooks/useHaptics';
import { useSound } from './SoundManager';

interface ClassGatewayInfo {
  id: GradeLevel;
  gradeNumber: number;
  label: string;
  badge: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
  glowColor: string;
  emoji: string;
  focusTitle: string;
  curriculumHighlight: string;
  labCount: number;
  sampleTopics: string[];
}

const CLASS_GATEWAYS: ClassGatewayInfo[] = [
  {
    id: 'class-8',
    gradeNumber: 8,
    label: 'Class 8',
    badge: 'Foundations',
    badgeBg: 'bg-teal-950/80',
    badgeText: 'text-teal-300 border-teal-500/40',
    borderColor: 'hover:border-teal-400/80 border-slate-800',
    glowColor: 'group-hover:shadow-teal-500/10',
    emoji: '📐',
    focusTitle: 'Equations, 3D Solids & Powers',
    curriculumHighlight: 'Linear balance scales, algebra tiles, Euler 3D solids, compound growth & triplets.',
    labCount: 10,
    sampleTopics: ['Balance Scale Solver', 'Algebra Tiles', 'Euler 3D Solids', 'Compound Interest'],
  },
  {
    id: 'class-9',
    gradeNumber: 9,
    label: 'Class 9',
    badge: 'Coordinate Geometry',
    badgeBg: 'bg-sky-950/80',
    badgeText: 'text-sky-300 border-sky-500/40',
    borderColor: 'hover:border-sky-400/80 border-slate-800',
    glowColor: 'group-hover:shadow-sky-500/10',
    emoji: '🎯',
    focusTitle: 'Cartesian Planes, Triangles & Circles',
    curriculumHighlight: 'Drone coordinate flight, triangle congruence forge, parallel lines & Heron’s formula.',
    labCount: 10,
    sampleTopics: ['Drone Navigator', 'Triangle Congruence', 'Heron’s Formula', 'Circle Chords'],
  },
  {
    id: 'class-10',
    gradeNumber: 10,
    label: 'Class 10',
    badge: 'CBSE Board Exam',
    badgeBg: 'bg-amber-950/80',
    badgeText: 'text-amber-300 border-amber-500/40',
    borderColor: 'hover:border-amber-400/80 border-slate-800',
    glowColor: 'group-hover:shadow-amber-500/10',
    emoji: '🏹',
    focusTitle: 'Quadratics, Trigonometry & Circles',
    curriculumHighlight: 'Board exam core: parabola roots, unit circle waves, clinometer trig & circle tangents.',
    labCount: 10,
    sampleTopics: ['Parabola Roots', 'Unit Circle Waves', 'Trig Heights', 'Circle Tangents'],
  },
  {
    id: 'class-11',
    gradeNumber: 11,
    label: 'Class 11',
    badge: 'JEE Foundation',
    badgeBg: 'bg-purple-950/80',
    badgeText: 'text-purple-300 border-purple-500/40',
    borderColor: 'hover:border-purple-400/80 border-slate-800',
    glowColor: 'group-hover:shadow-purple-500/10',
    emoji: '🪐',
    focusTitle: '3D Conics, Limits & Complex Numbers',
    curriculumHighlight: 'Double-cone slicer, secant tangent limits, Argand complex plane & Kepler orbits.',
    labCount: 10,
    sampleTopics: ['3D Conic Slicer', 'Limits Zoom Lab', 'Argand Plane', 'Binomial Galton'],
  },
  {
    id: 'class-12',
    gradeNumber: 12,
    label: 'Class 12',
    badge: 'Advanced Board & JEE',
    badgeBg: 'bg-emerald-950/80',
    badgeText: 'text-emerald-300 border-emerald-500/40',
    borderColor: 'hover:border-emerald-400/80 border-slate-800',
    glowColor: 'group-hover:shadow-emerald-500/10',
    emoji: '📦',
    focusTitle: 'Calculus, 3D Geometry & Vectors',
    curriculumHighlight: '3D vector flight cross-products, FTC integral accumulator, slope fields & Bayes theorem.',
    labCount: 10,
    sampleTopics: ['3D Vector Flight', 'FTC Integrals', 'Differential Equations', 'Bayes Theorem'],
  },
];

export const ClassGatewaysSection: React.FC = () => {
  const { gradeFilter, setGradeFilter, setSearchQuery } = useSimulatorStore();
  const { lightTap } = useHaptics();
  const { playClick } = useSound();

  const handleSelectClass = (gradeId: GradeLevel) => {
    lightTap();
    playClick();
    setGradeFilter(gradeId);
    setSearchQuery('');
    const el = document.getElementById('curriculum-directory-section') || document.getElementById('mobile-curriculum-section');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      id="choose-your-class-section"
      aria-label="Choose your class to begin learning"
      className="space-y-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Choose Your Class to Start
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 font-normal">
            Select your syllabus below. Aligned across CBSE, ICSE, State Boards &amp; NCERT curricula:
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            lightTap();
            setGradeFilter('all');
            setSearchQuery('');
            const el = document.getElementById('curriculum-directory-section') || document.getElementById('mobile-curriculum-section');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          className={`self-start sm:self-auto px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
            gradeFilter === 'all'
              ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md'
              : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
          }`}
        >
          <span>View All 50 Labs (Classes 8–12)</span>
        </button>
      </div>

      {/* 5 Prominent Class Gateway Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {CLASS_GATEWAYS.map((gate) => {
          const isSelected = gradeFilter === gate.id;

          return (
            <div
              key={gate.id}
              onClick={() => handleSelectClass(gate.id)}
              className={`p-4 sm:p-5 rounded-2xl bg-slate-900/90 border flex flex-col justify-between transition-all cursor-pointer group shadow-lg active:scale-[0.98] ${
                isSelected
                  ? 'border-cyan-400 bg-slate-900 ring-2 ring-cyan-400/40 shadow-cyan-500/20'
                  : gate.borderColor
              } ${gate.glowColor}`}
            >
              <div className="space-y-3">
                {/* Card Top: Emoji + Class Name + Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl leading-none">{gate.emoji}</span>
                    <div>
                      <h3 className="text-lg font-black text-white leading-tight">
                        {gate.label}
                      </h3>
                      <span className="text-[10px] font-mono text-cyan-400 font-bold">
                        {gate.labCount} Labs
                      </span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${gate.badgeBg} ${gate.badgeText}`}>
                    {gate.badge}
                  </span>
                </div>

                {/* Subtitle & Description */}
                <div>
                  <h4 className="font-bold text-xs text-slate-200 group-hover:text-cyan-300 transition-colors">
                    {gate.focusTitle}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {gate.curriculumHighlight}
                  </p>
                </div>

                {/* Sample Topics Mini Pills */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {gate.sampleTopics.map((topic) => (
                    <span 
                      key={topic}
                      className="text-[9px] px-1.5 py-0.5 rounded bg-slate-950/80 border border-slate-800 text-slate-300"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button at bottom */}
              <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-cyan-400 group-hover:text-cyan-300">
                <span>{isSelected ? '✓ Viewing This Class' : `Explore ${gate.label} Labs`}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
