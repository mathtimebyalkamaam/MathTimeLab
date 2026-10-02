/**
 * MobileBottomNav.tsx: Thumb-friendly mobile navigation dock for small screens.
 * Docked at the bottom of the viewport exclusively on mobile screens (< 1024px).
 * Desktop / laptop layout remains 100% untouched.
 */
import React, { useState } from 'react';
import { 
  Compass, 
  Sparkles, 
  Trophy, 
  Zap, 
  Home, 
  Flame,
  GraduationCap,
  Layers,
  X,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { useSimulatorStore } from '../../store/useSimulatorStore';
import { GradeLevel } from '../../types/simulators';
import { useHaptics } from '../../hooks/useHaptics';
import { useSound } from '../common/SoundManager';

export const MobileBottomNav: React.FC = () => {
  const {
    currentRoute,
    navigateTo,
    gradeFilter,
    setGradeFilter,
    setClass8OdysseyOpen,
    setSecretShortcutsOpen,
    setClass8BadgesOpen,
    openConceptQuizModal,
  } = useSimulatorStore();

  const { lightTap, selectionTick } = useHaptics();
  const { playClick, playChime } = useSound();
  const [showClassPicker, setShowClassPicker] = useState(false);

  const isSimulator = currentRoute !== 'home' && currentRoute !== 'landing' && currentRoute !== 'teacher';

  // Do not render bottom nav inside active simulator to avoid overlapping with simulator's BottomSheet
  if (isSimulator) return null;

  const handleSelectGrade = (grade: GradeLevel) => {
    lightTap();
    playClick();
    setGradeFilter(grade);
    setShowClassPicker(false);
    if (currentRoute !== 'home') {
      navigateTo('home');
    }
  };

  const classesList: { id: GradeLevel; title: string; count: number; desc: string; emoji: string; color: string }[] = [
    { id: 'all', title: 'All Classes', count: 50, desc: 'Complete curriculum from Class 8 to 12', emoji: '🏫', color: 'border-cyan-500/40 bg-cyan-950/30 text-cyan-300' },
    { id: 'class-8', title: 'Class 8 Foundations', count: 10, desc: 'Algebra tiles, scales, interest, 3D Euler solids & triplets', emoji: '📐', color: 'border-teal-500/40 bg-teal-950/30 text-teal-300' },
    { id: 'class-9', title: 'Class 9 Mechanics', count: 10, desc: 'Cartesian drone, lines, congruence, polynomials, Galton', emoji: '🎯', color: 'border-sky-500/40 bg-sky-950/30 text-sky-300' },
    { id: 'class-10', title: 'Class 10 Board Core', count: 10, desc: 'Catapult parabola, trig heights, AP ladder, tangents, section', emoji: '🏹', color: 'border-amber-500/40 bg-amber-950/30 text-amber-300' },
    { id: 'class-11', title: 'Class 11 JEE Engine', count: 10, desc: '3D conics slicer, Argand plane, PMI dominos, Kepler orbits', emoji: '🪐', color: 'border-purple-500/40 bg-purple-950/30 text-purple-300' },
    { id: 'class-12', title: 'Class 12 Advanced Calc', count: 10, desc: '3D vector lab, FTC integrals, LPP feasible, Bayes, probability', emoji: '📦', color: 'border-emerald-500/40 bg-emerald-950/30 text-emerald-300' },
  ];

  return (
    <>
      {/* Mobile Class Quick Navigator Sheet Modal */}
      {showClassPicker && (
        <div 
          className="lg:hidden fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-end justify-center p-0 animate-fadeIn"
          onClick={() => setShowClassPicker(false)}
        >
          <div 
            className="w-full max-w-md bg-slate-900 border-t border-slate-800 rounded-t-3xl p-4 pb-8 space-y-3 shadow-2xl animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-cyan-400" />
                <div>
                  <h3 className="text-sm font-bold text-white">Choose Your Class</h3>
                  <p className="text-[11px] text-slate-400">10 essential interactive labs per class (50 total)</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowClassPicker(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5 max-h-[60vh] overflow-y-auto no-scrollbar pt-1">
              {classesList.map((c) => {
                const isSelected = gradeFilter === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleSelectGrade(c.id)}
                    className={`w-full p-2.5 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all active:scale-[0.98] ${
                      isSelected 
                        ? 'border-cyan-400 bg-cyan-950/60 shadow-md ring-1 ring-cyan-500/30' 
                        : 'border-slate-800/80 bg-slate-950/60 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{c.emoji}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold ${isSelected ? 'text-cyan-300' : 'text-white'}`}>
                            {c.title}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded-full font-mono bg-slate-800 text-cyan-400 border border-slate-700">
                            {c.count} Labs
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                          {c.desc}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 shrink-0 ${isSelected ? 'text-cyan-400' : 'text-slate-600'}`} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Docked Mobile Bottom Navigation Bar */}
      <nav 
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 border-t border-slate-800/90 backdrop-blur-xl px-2 py-1 pb-safe flex items-center justify-around shadow-2xl select-none"
        aria-label="Mobile Navigation"
      >
        {/* 1. Explore / Home */}
        <button
          type="button"
          onClick={() => {
            lightTap();
            playClick();
            if (currentRoute !== 'home') navigateTo('home');
          }}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
            currentRoute === 'home' && !showClassPicker
              ? 'text-cyan-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home className={`w-5 h-5 ${currentRoute === 'home' ? 'text-cyan-400 scale-105' : ''}`} />
          <span className="text-[10px] mt-0.5">Explore</span>
        </button>

        {/* 2. Classes Quick Picker */}
        <button
          type="button"
          onClick={() => {
            selectionTick();
            setShowClassPicker(!showClassPicker);
          }}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all relative ${
            showClassPicker || gradeFilter !== 'all'
              ? 'text-cyan-300 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <Layers className="w-5 h-5 text-cyan-400" />
            {gradeFilter !== 'all' && (
              <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            )}
          </div>
          <span className="text-[10px] mt-0.5 truncate max-w-[58px]">
            {gradeFilter === 'all' ? 'Classes' : gradeFilter.replace('class-', 'Class ')}
          </span>
        </button>

        {/* 3. Teacher Dashboard */}
        <button
          type="button"
          onClick={() => {
            lightTap();
            playClick();
            if (currentRoute !== 'teacher') navigateTo('teacher');
          }}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
            currentRoute === 'teacher'
              ? 'text-cyan-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <GraduationCap className={`w-5 h-5 ${currentRoute === 'teacher' ? 'text-cyan-400 scale-105' : 'text-slate-400'}`} />
          <span className="text-[10px] mt-0.5">Teacher</span>
        </button>

        {/* 4. Topper Hacks */}
        <button
          type="button"
          onClick={() => {
            lightTap();
            playClick();
            setSecretShortcutsOpen(true);
          }}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-slate-400 hover:text-amber-300 transition-all active:scale-95"
        >
          <Zap className="w-5 h-5 text-amber-400 fill-amber-400/30" />
          <span className="text-[10px] mt-0.5 text-amber-300 font-medium">Hacks</span>
        </button>

        {/* 5. 1-Min Quiz */}
        <button
          type="button"
          onClick={() => {
            lightTap();
            playClick();
            openConceptQuizModal();
          }}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-slate-400 hover:text-indigo-300 transition-all active:scale-95"
        >
          <Flame className="w-5 h-5 text-indigo-400 fill-indigo-400/30" />
          <span className="text-[10px] mt-0.5 text-indigo-300 font-medium">Quiz</span>
        </button>
      </nav>
    </>
  );
};
