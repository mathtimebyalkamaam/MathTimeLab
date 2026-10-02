/**
 * ClassCodeInput: Mobile-optimized modal and inline component for students
 * to enter their teacher's class code (e.g., "MATH-42"), connecting them to the educator roster.
 */
import React, { useState } from 'react';
import { 
  Users, 
  GraduationCap, 
  CheckCircle2, 
  ArrowRight, 
  X, 
  ShieldCheck, 
  Sparkles,
  Link,
  LogOut
} from 'lucide-react';
import { useClassStore } from '../../store/useClassStore';
import { useHaptics } from '../../hooks/useHaptics';
import { useSound } from '../common/SoundManager';

interface ClassCodeInputProps {
  onClose?: () => void;
  compact?: boolean;
}

export const ClassCodeInput: React.FC<ClassCodeInputProps> = ({ onClose, compact = false }) => {
  const { studentClassCode, studentName, joinClassWithCode, leaveClass } = useClassStore();
  const { lightTap, successBuzz } = useHaptics();
  const { playClick, playChime } = useSound();

  const [code, setCode] = useState('');
  const [name, setName] = useState(studentName || '');
  const [feedback, setFeedback] = useState<{ text: string; error: boolean } | null>(null);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setFeedback({ text: 'Please enter a class code', error: true });
      return;
    }

    const res = joinClassWithCode(code, name);
    if (res.success) {
      successBuzz();
      playChime();
      setFeedback({ text: res.message, error: false });
      setTimeout(() => {
        if (onClose) onClose();
      }, 1500);
    } else {
      setFeedback({ text: res.message, error: true });
    }
  };

  const handleLeave = () => {
    lightTap();
    leaveClass();
    setFeedback({ text: 'Disconnected from classroom.', error: false });
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {studentClassCode ? (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-950/70 border border-cyan-700/60 text-xs">
            <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-mono font-bold text-cyan-300 uppercase">{studentClassCode}</span>
            <span className="text-[10px] text-cyan-500">• Connected</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white hover:border-cyan-500/50 transition-colors"
          >
            <Link className="w-3 h-3 text-cyan-400" />
            <span>Join Class</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-950 border border-cyan-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
      {/* Radiant glow */}
      <div className="absolute -top-16 -right-16 w-36 h-36 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-inner">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white tracking-tight">
              Connect to Classroom
            </h3>
            <p className="text-[11px] text-slate-400">
              Submit your lab scores directly to your teacher
            </p>
          </div>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {studentClassCode ? (
        <div className="space-y-4">
          <div className="p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-mono tracking-wider text-cyan-400 block font-bold">
                Currently Connected
              </span>
              <div className="text-lg font-black font-mono text-white tracking-wide">
                {studentClassCode}
              </div>
              <span className="text-xs text-slate-300">
                Student: <strong>{studentName}</strong>
              </span>
            </div>

            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Completed physics and calculus labs will automatically sync to your teacher's gradebook.</span>
          </div>

          <button
            type="button"
            onClick={handleLeave}
            className="w-full py-2.5 rounded-xl bg-slate-800/80 hover:bg-rose-950/40 border border-slate-700 hover:border-rose-800 text-xs font-semibold text-slate-300 hover:text-rose-300 flex items-center justify-center gap-1.5 transition-colors touch-manipulation"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Leave Class / Enter Different Code</span>
          </button>
        </div>
      ) : (
        <form onSubmit={handleJoin} className="space-y-3.5">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              Your Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex Mercer"
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              Teacher's Class Code
            </label>
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="e.g. MATH-42"
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-xl px-3 py-2.5 text-sm font-mono font-bold tracking-wider text-cyan-300 placeholder-slate-600 focus:outline-none transition-colors uppercase"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">
              Ask your teacher or check your math syllabus for the code (Default demo: <strong className="text-cyan-400 font-mono">MATH-42</strong>)
            </span>
          </div>

          {feedback && (
            <div className={`p-2.5 rounded-xl text-xs flex items-center gap-2 ${
              feedback.error
                ? 'bg-rose-950/50 border border-rose-800 text-rose-300'
                : 'bg-emerald-950/50 border border-emerald-800 text-emerald-300'
            }`}>
              <span>{feedback.text}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg hover:brightness-110 active:scale-98 transition-all touch-manipulation"
          >
            <span>Connect to Class</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </form>
      )}
    </div>
  );
};
