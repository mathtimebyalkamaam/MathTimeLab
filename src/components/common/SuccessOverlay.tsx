/**
 * SuccessOverlay: Framer Motion celebration screen when a student solves a level.
 * Features:
 * - Floating math symbols burst (∑, π, ∫, √, θ, λ, Δ)
 * - Canvas confetti burst
 * - Animated XP counter ring
 * - "Next Challenge" or "Claim & Continue" CTA
 * - Haptic success buzz + crystalline chime audio triggers
 */
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Award, 
  Share2, 
  RotateCcw,
  Zap,
  X
} from 'lucide-react';
import { useHaptics } from '../../hooks/useHaptics';
import { useSound } from './SoundManager';
import { useClassStore } from '../../store/useClassStore';

interface SuccessOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onNextChallenge?: () => void;
  title?: string;
  subtitle?: string;
  xpEarned?: number;
  levelNumber?: number;
  conceptLearned?: string;
  hasNextLevel?: boolean;
}

const MATH_PARTICLES = ['∫', '∑', 'π', '√', 'θ', 'Δ', 'λ', '∞', 'f\'(x)'];

export const SuccessOverlay: React.FC<SuccessOverlayProps> = ({
  isOpen,
  onClose,
  onNextChallenge,
  title = 'Level Completed!',
  subtitle = 'Phenomenal precision! The laws of mathematics hold true.',
  xpEarned = 50,
  levelNumber = 1,
  conceptLearned,
  hasNextLevel = true,
}) => {
  const { successBuzz, lightTap } = useHaptics();
  const { playChime, playClick } = useSound();
  const { generateShareSummary, studentClassCode } = useClassStore();
  const [displayedXp, setDisplayedXp] = useState(0);
  const [copiedShare, setCopiedShare] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setDisplayedXp(0);
      return;
    }

    // Trigger haptics + sound
    successBuzz();
    playChime();

    // Multidirectional confetti cannons
    confetti({
      particleCount: 80,
      spread: 90,
      origin: { y: 0.55 },
      colors: ['#38bdf8', '#34d399', '#f59e0b', '#ec4899', '#a855f7'],
    });

    // Secondary delayed burst
    const timer = setTimeout(() => {
      confetti({
        particleCount: 45,
        angle: 60,
        spread: 55,
        origin: { x: 0.1, y: 0.7 },
        colors: ['#38bdf8', '#fbbf24', '#34d399'],
      });
      confetti({
        particleCount: 45,
        angle: 120,
        spread: 55,
        origin: { x: 0.9, y: 0.7 },
        colors: ['#38bdf8', '#fbbf24', '#34d399'],
      });
    }, 280);

    // Smooth XP count-up animation
    let current = 0;
    const step = Math.max(1, Math.floor(xpEarned / 20));
    const interval = setInterval(() => {
      current += step;
      if (current >= xpEarned) {
        setDisplayedXp(xpEarned);
        clearInterval(interval);
      } else {
        setDisplayedXp(current);
      }
    }, 30);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [isOpen, xpEarned, successBuzz, playChime]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md">
          {/* Floating Math Symbols Particle Canvas */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {MATH_PARTICLES.map((symbol, idx) => {
              const startX = 10 + (idx * 11) % 80;
              const delay = idx * 0.12;
              return (
                <motion.div
                  key={idx}
                  initial={{ y: '100vh', opacity: 0, scale: 0.4, rotate: 0 }}
                  animate={{
                    y: '-20vh',
                    opacity: [0, 0.7, 0.7, 0],
                    scale: [0.6, 1.2, 1.4, 0.9],
                    rotate: [0, 45, 90, 180],
                  }}
                  transition={{
                    duration: 3.2,
                    delay,
                    ease: 'easeOut',
                    repeat: Infinity,
                    repeatDelay: 1.5,
                  }}
                  style={{ left: `${startX}%` }}
                  className="absolute text-cyan-400/40 font-mono font-bold select-none text-2xl sm:text-3xl"
                >
                  {symbol}
                </motion.div>
              );
            })}
          </div>

          {/* Central Modal Card */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 25 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 15 }}
            transition={{ type: 'spring', damping: 22, stiffness: 320 }}
            className="w-full max-w-sm sm:max-w-md bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-700/80 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden flex flex-col items-center text-center z-10"
          >
            {/* Radiant Ambient Glow Header */}
            <div className="absolute -top-24 w-60 h-60 bg-gradient-to-tr from-cyan-500/20 via-amber-500/25 to-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

            {/* Close Cross */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Level Trophy / Badge Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.15, type: 'spring', stiffness: 280 }}
              className="w-16 h-16 sm:w-18 sm:h-18 rounded-3xl bg-gradient-to-tr from-amber-500 to-emerald-400 p-[2px] shadow-lg shadow-amber-500/25 mb-3"
            >
              <div className="w-full h-full bg-slate-900 rounded-[22px] flex items-center justify-center text-amber-400">
                <Trophy className="w-9 h-9" />
              </div>
            </motion.div>

            {/* Level Number Pill */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold uppercase tracking-wider mb-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Level {levelNumber} Mastered</span>
            </motion.div>

            {/* Title & Description */}
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="text-xl sm:text-2xl font-black text-white tracking-tight"
            >
              {title}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xs leading-relaxed"
            >
              {subtitle}
            </motion.p>

            {/* Concept Highlight */}
            {conceptLearned && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.35 }}
                className="w-full mt-3 p-2.5 rounded-2xl bg-slate-950/70 border border-slate-800 text-[11px] text-cyan-300 font-mono flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">Core Concept: {conceptLearned}</span>
              </motion.div>
            )}

            {/* XP Gained Animated Card */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="w-full my-4 py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-800/80 to-emerald-500/10 border border-amber-500/30 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
                  <Zap className="w-4 h-4 fill-amber-400" />
                </div>
                <div className="text-left">
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Experience Rewarded
                  </div>
                  <div className="text-xs text-slate-300 font-medium">Added to classroom record</div>
                </div>
              </div>

              <div className="text-right">
                <span className="font-mono text-2xl font-black text-amber-300 tabular-nums">
                  +{displayedXp}
                </span>
                <span className="font-mono text-xs text-amber-400 font-bold ml-1">XP</span>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <div className="w-full space-y-2 mt-1">
              {hasNextLevel && onNextChallenge ? (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNextChallenge();
                  }}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 hover:brightness-110 active:scale-98 transition-all touch-manipulation"
                >
                  <span>Next Challenge Level</span>
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </button>
              ) : null}

              {/* Share with Teacher Viral Loop Button */}
              <button
                type="button"
                onClick={async () => {
                  lightTap();
                  playClick();
                  const shareText = generateShareSummary(title, levelNumber, xpEarned);
                  try {
                    if (navigator.clipboard) {
                      await navigator.clipboard.writeText(shareText);
                    }
                    setCopiedShare(true);
                    setTimeout(() => setCopiedShare(false), 3000);
                  } catch {
                    // Fallback
                    setCopiedShare(true);
                  }
                }}
                className={`w-full py-2.5 px-4 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all touch-manipulation ${
                  copiedShare
                    ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                    : 'bg-slate-900 hover:bg-slate-800 text-cyan-300 border-cyan-800/60 hover:border-cyan-500'
                }`}
              >
                {copiedShare ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Copied Summary for WhatsApp/Email!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 text-cyan-400" />
                    <span>Share Achievement with Teacher {studentClassCode ? `(${studentClassCode})` : ''}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 px-4 rounded-2xl bg-slate-800/60 hover:bg-slate-700 text-slate-300 font-medium text-xs flex items-center justify-center gap-1.5 border border-slate-700/60 transition-colors touch-manipulation"
              >
                <span>Continue Exploring Simulator</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
