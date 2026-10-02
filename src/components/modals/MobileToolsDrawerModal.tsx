/**
 * MobileToolsDrawerModal.tsx: Ergonomic mobile action sheet for simulators.
 * Replaces the cramped, squished 10-button header on mobile screens (< 1024px)
 * with a high-contrast, thumb-friendly modal grid.
 * Desktop layout remains 100% untouched.
 */
import React from 'react';
import { 
  X, 
  Lightbulb, 
  Zap, 
  FileCheck2, 
  Flame, 
  Timer, 
  GitFork, 
  Trophy, 
  RotateCcw, 
  BookOpen, 
  Sliders,
  Sparkles,
  Award
} from 'lucide-react';
import { useSimulatorStore } from '../../store/useSimulatorStore';
import { useHaptics } from '../../hooks/useHaptics';
import { useSound } from '../common/SoundManager';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onReset?: () => void;
}

export const MobileToolsDrawerModal: React.FC<Props> = ({ isOpen, onClose, onReset }) => {
  const {
    activeSimulatorId,
    setActiveGuideModal,
    openPOEModal,
    openExamPYQModal,
    openStressTestModal,
    openSpeedDrillModal,
    openDerivationLadderModal,
    setSecretShortcutsOpen,
    openConceptQuizModal,
    isEli13Mode,
    toggleEli13Mode,
    setActiveSheetTab,
    setBottomSheetSnap,
  } = useSimulatorStore();

  const { lightTap, selectionTick } = useHaptics();
  const { playClick, playChime } = useSound();

  if (!isOpen) return null;

  const handleAction = (callback: () => void) => {
    lightTap();
    playClick();
    callback();
    onClose();
  };

  const tools = [
    {
      id: 'guide',
      title: 'How to Play Guide',
      desc: 'Simulator mission goals & touch gesture guide',
      icon: Lightbulb,
      color: 'text-cyan-400 bg-cyan-950/60 border-cyan-800/60',
      action: () => setActiveGuideModal(true),
    },
    {
      id: 'poe',
      title: 'Predict · Observe · Explain',
      desc: 'Interactive thought experiment before testing',
      icon: Zap,
      color: 'text-amber-400 bg-amber-950/60 border-amber-800/60',
      action: () => openPOEModal(),
    },
    {
      id: 'pyq',
      title: 'Real Exam PYQs',
      desc: 'Standard board exam questions with full steps',
      icon: FileCheck2,
      color: 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60',
      action: () => openExamPYQModal(),
    },
    {
      id: 'proof',
      title: 'Derivation Ladder Proof',
      desc: 'Step-by-step first principles algebraic proof',
      icon: GitFork,
      color: 'text-purple-400 bg-purple-950/60 border-purple-800/60',
      action: () => openDerivationLadderModal(),
    },
    {
      id: 'speed_drill',
      title: '60s Intuition Drill',
      desc: 'Rapid visual concept quiz against the clock',
      icon: Timer,
      color: 'text-amber-400 bg-amber-950/60 border-amber-800/60',
      action: () => openSpeedDrillModal(),
    },
    {
      id: 'stress_test',
      title: 'Break the Math (Stress)',
      desc: 'Test extreme boundary values & degeneracies',
      icon: Flame,
      color: 'text-rose-400 bg-rose-950/60 border-rose-800/60',
      action: () => openStressTestModal(),
    },
    {
      id: 'hacks',
      title: 'Topper Shortcuts & Hacks',
      desc: 'Mental math speed tricks & visual mnemonics',
      icon: Sparkles,
      color: 'text-sky-400 bg-sky-950/60 border-sky-800/60',
      action: () => setSecretShortcutsOpen(true),
    },
    {
      id: 'quiz',
      title: '1-Min Concept Quiz',
      desc: 'Earn XP with instant sound feedback & confetti',
      icon: Trophy,
      color: 'text-indigo-400 bg-indigo-950/60 border-indigo-800/60',
      action: () => openConceptQuizModal(),
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto no-scrollbar animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Simulator Toolbox</h3>
              <p className="text-[11px] text-slate-400">Essential tools, proofs, drills & past-year questions</p>
            </div>
          </div>
          <button
            onClick={() => {
              lightTap();
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
            aria-label="Close Toolbox"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Toggles Row */}
        <div className="grid grid-cols-2 gap-2">
          {/* ELI-13 Toggle */}
          <button
            onClick={() => {
              lightTap();
              playChime();
              toggleEli13Mode();
            }}
            className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
              isEli13Mode
                ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="text-xl">🕶️</span>
            <div>
              <div className="text-xs font-bold text-white">ELI-13 Mode</div>
              <div className="text-[10px] text-slate-400">
                {isEli13Mode ? 'Active (Teen Metaphors)' : 'Off (Standard Math)'}
              </div>
            </div>
          </button>

          {/* Reset Parameters */}
          {onReset && (
            <button
              onClick={() => handleAction(onReset)}
              className="p-3 rounded-2xl border border-slate-800 bg-slate-950/60 text-slate-400 hover:text-rose-300 hover:border-rose-800/60 text-left flex items-center gap-3 transition-all"
            >
              <div className="w-7 h-7 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                <RotateCcw className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Reset Values</div>
                <div className="text-[10px] text-slate-400">Default parameters</div>
              </div>
            </button>
          )}
        </div>

        {/* Action Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {tools.map((t) => (
            <button
              key={t.id}
              onClick={() => handleAction(t.action)}
              className="p-3 rounded-2xl bg-slate-950/60 hover:bg-slate-800/60 border border-slate-800/80 hover:border-slate-700 text-left flex items-start gap-3 transition-all group active:scale-[0.98]"
            >
              <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 ${t.color}`}>
                <t.icon className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {t.title}
                </div>
                <div className="text-[10px] text-slate-400 line-clamp-1 leading-relaxed">
                  {t.desc}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Bottom Cockpit Quick Tabs */}
        <div className="pt-2 border-t border-slate-800/80">
          <div className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider mb-2 text-center">
            Open Bottom Sheet Cockpit Directly:
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => {
                handleAction(() => {
                  setActiveSheetTab('controls');
                  setBottomSheetSnap('half');
                });
              }}
              className="py-2.5 rounded-xl bg-cyan-950/30 border border-cyan-800/50 text-cyan-300 font-bold text-xs flex items-center justify-center gap-1.5"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Sliders</span>
            </button>
            <button
              onClick={() => {
                handleAction(() => {
                  setActiveSheetTab('theory');
                  setBottomSheetSnap('half');
                });
              }}
              className="py-2.5 rounded-xl bg-purple-950/30 border border-purple-800/50 text-purple-300 font-bold text-xs flex items-center justify-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Theory</span>
            </button>
            <button
              onClick={() => {
                handleAction(() => {
                  setActiveSheetTab('mission');
                  setBottomSheetSnap('half');
                });
              }}
              className="py-2.5 rounded-xl bg-amber-950/30 border border-amber-800/50 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Missions</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
