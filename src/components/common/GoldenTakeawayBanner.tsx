import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  ChevronUp, 
  ChevronDown, 
  Award, 
  Lightbulb, 
  FileCheck2,
  Bookmark
} from 'lucide-react';
import { SimulatorId } from '../../types/simulators';
import { SIMULATORS } from '../../data/simulators';
import { GOLDEN_TAKEAWAYS } from '../../data/goldenTakeaways';
import { BlockMath } from './MathFormula';
import { useSimulatorStore } from '../../store/useSimulatorStore';
import { useHaptics } from '../../hooks/useHaptics';
import { useSound } from './SoundManager';

interface GoldenTakeawayBannerProps {
  simulatorId: SimulatorId;
}

export const GoldenTakeawayBanner: React.FC<GoldenTakeawayBannerProps> = ({ simulatorId }) => {
  const { isZenMode, openExamPYQModal } = useSimulatorStore();
  const { lightTap, successNotification } = useHaptics();
  const { playClick, playChime } = useSound();

  const [isExpanded, setIsExpanded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const sim = SIMULATORS.find((s) => s.id === simulatorId);
  const takeaway = GOLDEN_TAKEAWAYS[simulatorId];

  // Stop speech when simulator unmounts or changes
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [simulatorId]);

  if (isZenMode || !takeaway) return null;

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    lightTap();
    playChime();
    const noteText = `[Math Time Lab - ${sim?.title}]\nGolden Rule: ${takeaway.ruleText}\nFormula: ${sim?.latexFormula || takeaway.formulaLatex}\nCoach Secret: ${sim?.coachSecret || ''}`;
    navigator.clipboard?.writeText(noteText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleToggleSpeech = (e: React.MouseEvent) => {
    e.stopPropagation();
    lightTap();
    playClick();

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel(); // Clear any queued utterances
      const utteranceText = takeaway.audioSpeech || `${sim?.title}. ${takeaway.ruleText}. ${sim?.coachSecret}`;
      const utterance = new SpeechSynthesisUtterance(utteranceText);
      utterance.rate = 0.95;
      utterance.pitch = 1.05;

      // Try selecting an English / Indian English voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(
        (v) => (v.lang.includes('en-IN') || v.lang.includes('en-GB') || v.lang.includes('en-US')) && !v.name.includes('Google')
      ) || voices.find((v) => v.lang.startsWith('en'));
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const handleOpenPYQ = (e: React.MouseEvent) => {
    e.stopPropagation();
    lightTap();
    playClick();
    openExamPYQModal(simulatorId);
  };

  return (
    <aside 
      aria-label="Golden concept takeaway and exam summary"
      className="w-full bg-slate-900/95 backdrop-blur-xl border-t border-amber-500/30 px-3 py-1.5 text-xs select-none shadow-2xl relative z-30 shrink-0 transition-all duration-300"
    >
      <div className="max-w-[1720px] mx-auto flex items-center justify-between gap-2.5">
        {/* Left: Golden Rule Headline */}
        <div 
          onClick={() => {
            lightTap();
            setIsExpanded(!isExpanded);
          }}
          className="flex items-center gap-2 min-w-0 flex-1 cursor-pointer group"
        >
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-950/80 border border-amber-500/50 text-amber-300 font-bold shrink-0 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
            <span className="font-mono uppercase text-[10px] tracking-wider">Golden Rule</span>
          </div>

          <p className="text-slate-200 font-medium truncate text-[11px] sm:text-xs">
            {takeaway.ruleText}
          </p>
        </div>

        {/* Right Actions: Listen to Teacher, PYQ Exam Question, Copy Note, Expand */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Listen to Teacher Audio Button */}
          <button
            type="button"
            onClick={handleToggleSpeech}
            className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 ${
              isSpeaking
                ? 'bg-amber-500/20 text-amber-300 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.3)] animate-pulse'
                : 'bg-slate-800/90 hover:bg-slate-750 text-slate-300 hover:text-white border-slate-700/80 hover:border-amber-400/40'
            }`}
            title={isSpeaking ? 'Stop Alka Ma\'am voice note' : 'Listen to Alka Ma\'am 45s concept briefing'}
          >
            {isSpeaking ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Pause Voice</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Listen to Ma'am</span>
              </>
            )}
          </button>

          {/* Test on Real CBSE PYQ Button */}
          <button
            type="button"
            onClick={handleOpenPYQ}
            className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer active:scale-95 shadow-xs"
            title="Practice 1 real CBSE past-year exam question on this exact concept"
          >
            <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Board PYQ</span>
          </button>

          {/* Copy Takeaway to Notes */}
          <button
            type="button"
            onClick={handleCopy}
            className="p-1 sm:px-2 sm:py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer"
            title="Copy Golden Takeaway & Formula for revision notes"
          >
            {isCopied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="hidden sm:inline text-emerald-400 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-slate-400" />
                <span className="hidden sm:inline">Copy Note</span>
              </>
            )}
          </button>

          {/* Expand / Collapse Drawer */}
          <button
            type="button"
            onClick={() => {
              lightTap();
              setIsExpanded(!isExpanded);
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
            title={isExpanded ? 'Collapse Golden Rule' : 'Expand Exam Takeaway'}
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* EXPANDED EXAM TAKAWAY & TEXTBOOK TRAP DRAWER                   */}
      {/* ------------------------------------------------------------- */}
      {isExpanded && (
        <div className="mt-2.5 pt-2.5 border-t border-slate-800 space-y-3 animate-fade-in text-xs max-w-[1720px] mx-auto">
          {/* KaTeX Formula Box */}
          {(sim?.latexFormula || takeaway.formulaLatex) && (
            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 overflow-x-auto no-scrollbar">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-mono font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800 shrink-0">
                  Core Theorem Formula
                </span>
                <BlockMath 
                  math={sim?.latexFormula || takeaway.formulaLatex} 
                  className="!my-0 text-cyan-300 text-xs sm:text-[13px]" 
                />
              </div>

              <div className="text-[11px] font-semibold text-amber-300 flex items-center gap-1 shrink-0">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>{takeaway.examTip}</span>
              </div>
            </div>
          )}

          {/* Textbook Trap vs Coach Mental Model */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {sim?.textbookTrap && (
              <div className="p-2.5 rounded-xl bg-rose-950/20 border border-rose-800/30 text-[11px]">
                <strong className="text-rose-400 block mb-0.5 font-mono uppercase tracking-wider">
                  ❌ What Textbooks Say (The Confusion):
                </strong>
                <p className="text-slate-300 leading-relaxed font-sans">{sim.textbookTrap}</p>
              </div>
            )}

            {sim?.coachSecret && (
              <div className="p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-800/30 text-[11px]">
                <strong className="text-emerald-400 block mb-0.5 font-mono uppercase tracking-wider">
                  💡 In Plain English (What Textbooks Never Told You):
                </strong>
                <p className="text-slate-300 leading-relaxed font-sans">{sim.coachSecret}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  );
};
