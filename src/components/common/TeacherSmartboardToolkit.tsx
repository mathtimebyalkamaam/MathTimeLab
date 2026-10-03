import React, { useState } from 'react';
import { 
  GraduationCap, 
  Tv, 
  Share2, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  Presentation, 
  ShieldCheck, 
  Play, 
  ChevronRight,
  MessageCircle,
  FileCheck2,
  Users,
  MonitorPlay,
  Cast
} from 'lucide-react';
import { useSimulatorStore } from '../../store/useSimulatorStore';
import { SimulatorId } from '../../types/simulators';
import { useHaptics } from '../../hooks/useHaptics';
import { useSound } from './SoundManager';
import { MathText } from './MathFormula';

export const TeacherSmartboardToolkit: React.FC = () => {
  const { navigateTo } = useSimulatorStore();
  const { lightTap } = useHaptics();
  const { playClick, playChime } = useSound();
  const [copiedLink, setCopiedLink] = useState(false);
  const [activePreset, setActivePreset] = useState<number>(0);

  const classroomDemos = [
    {
      id: 'algebraic-identities-tiles' as SimulatorId,
      grade: 'Classes 8 & 9',
      gradeColor: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/40 text-emerald-300',
      accentGlow: 'hover:shadow-[0_0_25px_rgba(16,185,129,0.25)]',
      btnColor: 'bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 hover:brightness-110',
      topic: 'Algebraic Identities',
      hook: 'Why $(a + b)^2 \\neq a^2 + b^2$',
      lessonTip: 'Drag visual tiles on touch displays so students directly see the missing $2ab$ cross-terms fill the geometric square.',
      duration: '4 min demo'
    },
    {
      id: 'circle-tangents-lab' as SimulatorId,
      grade: 'Class 10 Board Core',
      gradeColor: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/40 text-cyan-300',
      accentGlow: 'hover:shadow-[0_0_25px_rgba(6,182,212,0.25)]',
      btnColor: 'bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-950 hover:brightness-110',
      topic: 'Circle Theorems',
      hook: 'Theorem 10.1: Tangent is perpendicular to radius at contact',
      lessonTip: 'Rotate the tangent line dynamically around the circle. Watch the angle badge lock firmly to $90^\\circ$ everywhere.',
      duration: '5 min demo'
    },
    {
      id: 'calculus-sandbox' as SimulatorId,
      grade: 'Classes 11 & 12',
      gradeColor: 'from-purple-500/20 to-indigo-500/20 border-purple-500/40 text-purple-300',
      accentGlow: 'hover:shadow-[0_0_25px_rgba(168,85,247,0.25)]',
      btnColor: 'bg-gradient-to-r from-purple-400 to-indigo-400 text-slate-950 hover:brightness-110',
      topic: 'Calculus & Derivatives',
      hook: 'The Secant Line Collapsing into the Tangent Slope',
      lessonTip: 'Shrink $\\Delta x \\to 0$ live on the projector. Show students how the secant slope smoothly becomes instantaneous $\\frac{dy}{dx}$.',
      duration: '5 min demo'
    }
  ];

  const handleCopyAssignment = () => {
    lightTap();
    playChime();
    const assignmentText = `📐 Math Time Lab Interactive Visual Homework:\n` +
      `Explore today's math lesson interactively in your browser (no login required):\n` +
      `🔗 ${window.location.origin}\n` +
      `✨ Curriculum Aligned: CBSE · ICSE · Cambridge & State Boards`;
    navigator.clipboard.writeText(assignmentText);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleShareWhatsApp = () => {
    lightTap();
    playClick();
    const text = encodeURIComponent(
      `📐 Math Time Lab Classroom Demonstration:\n` +
      `Interactive visual math simulators for Classes 8–12 (Pure KaTeX, 100% free, zero login):\n` +
      `${window.location.origin}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="relative rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-slate-800/90 p-5 sm:p-7 shadow-xl space-y-6 overflow-hidden">
      {/* Decorative ambient lighting backdrops in soft light blue & magenta */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-fuchsia-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Banner */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-300 bg-cyan-950/90 border border-cyan-500/40 px-3 py-0.5 rounded-full flex items-center gap-1.5 shadow-sm">
              <Presentation className="w-3.5 h-3.5 text-cyan-400" />
              <span>Smartboard &amp; Projector Studio</span>
            </span>
            <span className="text-[11px] font-semibold text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zero Sign-Up Required</span>
            </span>
          </div>

          <h2 className="text-lg sm:text-xl font-black text-white tracking-tight mt-2 flex items-center gap-2">
            <span>Teacher Smartboard &amp; Classroom Toolkit</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5 max-w-2xl font-normal">
            Launch 5-minute interactive demonstrations on touch displays, TVs, or share directly to student homework groups:
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-400/40 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md active:scale-95"
            title="Share with student batch on WhatsApp"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Share on WhatsApp</span>
            <span className="sm:hidden">WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={handleCopyAssignment}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md active:scale-95 ${
              copiedLink 
                ? 'bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 font-black' 
                : 'bg-slate-800/90 hover:bg-slate-750 text-slate-200 border border-slate-700/80'
            }`}
            title="Copy formatted lesson link to clipboard"
          >
            {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4 text-cyan-400" />}
            <span>{copiedLink ? 'Copied to Clipboard!' : 'Copy Lesson Link'}</span>
          </button>
        </div>
      </div>

      {/* 3 Interactive Lesson Launchers Grid (Distinct Color Themes & Visual Identity) */}
      <div className="relative z-10 space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-300 px-0.5">
          <span className="font-bold flex items-center gap-2 text-white">
            <Cast className="w-4 h-4 text-cyan-400" />
            <span>Curated 5-Minute Classroom Demonstrations:</span>
          </span>
          <span className="text-[11px] font-mono text-cyan-300 font-semibold flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>1-Tap Projector Launch</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {classroomDemos.map((demo, idx) => (
            <div
              key={demo.id}
              className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between space-y-4 cursor-pointer group ${demo.accentGlow} ${
                activePreset === idx
                  ? 'bg-gradient-to-b from-[#0b213b] to-[#071526] border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)] ring-1 ring-cyan-400/40'
                  : 'bg-slate-900/80 border-slate-800/90 hover:border-cyan-500/50 hover:bg-slate-900'
              }`}
              onClick={() => {
                setActivePreset(idx);
                lightTap();
                navigateTo(demo.id);
              }}
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border bg-gradient-to-r ${demo.gradeColor}`}>
                    {demo.grade}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono font-medium">
                    {demo.duration}
                  </span>
                </div>

                <h3 className="text-sm font-black text-white group-hover:text-cyan-300 transition-colors leading-snug">
                  <MathText text={demo.hook} />
                </h3>

                <div className="text-xs text-slate-300 leading-relaxed font-sans">
                  <MathText text={demo.lessonTip} />
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  lightTap();
                  navigateTo(demo.id);
                }}
                className={`w-full py-2.5 px-3 rounded-xl ${demo.btnColor} text-xs font-black flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer`}
              >
                <MonitorPlay className="w-3.5 h-3.5 fill-current" />
                <span>Launch on Smartboard</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Reassurance Strip */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs border-t border-cyan-500/20">
        <div className="flex items-center gap-2.5 text-slate-300 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <Tv className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="text-xs font-medium">Scales cleanly to 65"–85" 4K interactive touch panels</span>
        </div>

        <div className="flex items-center gap-2.5 text-slate-300 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <Users className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs font-medium">Zero login friction or student signup required</span>
        </div>

        <div className="flex items-center gap-2.5 text-slate-300 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <FileCheck2 className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-xs font-medium">Curriculum aligned: CBSE, ICSE, Cambridge &amp; State Boards</span>
        </div>
      </div>
    </div>
  );
};
