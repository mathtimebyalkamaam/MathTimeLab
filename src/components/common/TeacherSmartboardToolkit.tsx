/**
 * TeacherSmartboardToolkit.tsx: Classroom & Smartboard Toolkit for Educators.
 * Provides 1-click WhatsApp/Google Classroom sharing, smartboard projection presets,
 * and curriculum alignment guides with zero login friction.
 */

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
  Users
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
      topic: 'Algebraic Identities',
      hook: 'Why $(a + b)^2 \\neq a^2 + b^2$',
      lessonTip: 'Drag the tiles on your interactive touch display so students visually see the missing $2ab$ rectangular cross-terms!',
      duration: '4 min demo'
    },
    {
      id: 'circle-tangents-lab' as SimulatorId,
      grade: 'Class 10 Board Core',
      topic: 'Circle Theorems',
      hook: 'Theorem 10.1: Tangent is perpendicular to radius at point of contact',
      lessonTip: 'Rotate the tangent line dynamically. Watch the angle badge lock firmly to $90^\\circ$ for all positions around the perimeter.',
      duration: '5 min demo'
    },
    {
      id: 'calculus-sandbox' as SimulatorId,
      grade: 'Classes 11 & 12',
      topic: 'Calculus & Derivatives',
      hook: 'The Secant Line Collapsing into the Tangent Slope',
      lessonTip: 'Shrink $\\Delta x \\to 0$ on the curve. Show students how the slope of the secant chord smoothly becomes the instantaneous derivative $\\frac{dy}{dx}$.',
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
    <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-4 sm:p-6 shadow-xl space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3.5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/80 border border-cyan-800 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>For Educators &amp; Classrooms</span>
            </span>
            <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Zero Sign-up Required</span>
            </span>
          </div>

          <h2 className="text-base sm:text-lg font-black text-white mt-1.5">
            Smartboard-Ready Teaching Toolkit
          </h2>
          <p className="text-xs text-slate-300">
            Launch 5-minute interactive demonstrations on touch displays, TVs, or share directly to student homework groups:
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
            title="Share with student batch on WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Share on WhatsApp</span>
            <span className="sm:hidden">WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={handleCopyAssignment}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95 ${
              copiedLink 
                ? 'bg-cyan-500 text-slate-950' 
                : 'bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700'
            }`}
            title="Copy formatted lesson link to clipboard"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
            <span>{copiedLink ? 'Copied!' : 'Copy Lesson Link'}</span>
          </button>
        </div>
      </div>

      {/* 3 Interactive Lesson Launchers Grid */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400 px-0.5">
          <span className="font-bold text-slate-300 flex items-center gap-1.5">
            <Presentation className="w-4 h-4 text-cyan-400" />
            <span>Curated 5-Minute Classroom Demonstrations:</span>
          </span>
          <span className="text-[11px] font-mono text-cyan-400">1-Tap Smartboard Launch</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {classroomDemos.map((demo, idx) => (
            <div
              key={demo.id}
              className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between space-y-3 cursor-pointer group hover:shadow-cyan-950/30 ${
                activePreset === idx
                  ? 'bg-gradient-to-br from-slate-950 to-cyan-950/40 border-cyan-500/60 shadow-lg ring-1 ring-cyan-500/30'
                  : 'bg-slate-950/60 border-slate-800 hover:border-cyan-500/50'
              }`}
              onClick={() => {
                setActivePreset(idx);
                lightTap();
                navigateTo(demo.id);
              }}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60">
                    {demo.grade}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {demo.duration}
                  </span>
                </div>

                <h3 className="text-xs sm:text-sm font-black text-white group-hover:text-cyan-300 transition-colors">
                  <MathText text={demo.hook} />
                </h3>

                <div className="text-xs text-slate-300 leading-relaxed">
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
                className="w-full py-2 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Launch on Smartboard</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Reassurance Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs border-t border-slate-800/80">
        <div className="flex items-center gap-2.5 text-slate-300 p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/60">
          <Tv className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="text-xs font-medium">Scales cleanly to 65"–85" 4K interactive touch panels</span>
        </div>

        <div className="flex items-center gap-2.5 text-slate-300 p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/60">
          <Users className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="text-xs font-medium">No student login or registration required</span>
        </div>

        <div className="flex items-center gap-2.5 text-slate-300 p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/60">
          <FileCheck2 className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="text-xs font-medium">Curriculum aligned: CBSE, ICSE, Cambridge &amp; State Boards</span>
        </div>
      </div>
    </div>
  );
};
