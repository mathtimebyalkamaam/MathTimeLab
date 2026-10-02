import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  X, 
  Sparkles, 
  ArrowRight, 
  Zap, 
  Trophy, 
  CheckCircle2, 
  RotateCcw,
  Target
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useSimulatorStore } from '../../store/useSimulatorStore';
import { SIMULATORS } from '../../data/simulators';
import { useHaptics } from '../../hooks/useHaptics';
import { useSound } from './SoundManager';
import { TouchSlider } from './TouchSlider';

interface DrillQuestion {
  id: string;
  prompt: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  actualAnswer: number;
  tolerance: number; // allowable +/- difference for 100% score
  coachNote: string;
}

export const IntuitionSpeedDrillModal: React.FC = () => {
  const { 
    isSpeedDrillModalOpen, 
    closeSpeedDrillModal, 
    activeSimulatorId, 
    currentRoute,
    addXp
  } = useSimulatorStore();

  const { lightTap, successBuzz, errorBuzz } = useHaptics();
  const { playClick, playChime, playError } = useSound();

  const currentSimId = activeSimulatorId || (currentRoute !== 'home' && currentRoute !== 'landing' && currentRoute !== 'teacher' ? currentRoute : 'drone-navigator');
  const metadata = SIMULATORS.find((s) => s.id === currentSimId);

  // 60-second timer state
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [isDrillActive, setIsDrillActive] = useState<boolean>(false);
  const [roundIndex, setRoundIndex] = useState<number>(0);
  const [currentGuess, setCurrentGuess] = useState<number>(5);
  const [hasGuessed, setHasGuessed] = useState<boolean>(false);
  const [totalScore, setTotalScore] = useState<number>(0);
  const [accuracyHistory, setAccuracyHistory] = useState<number[]>([]);

  // Generator for rapid questions
  const getQuestions = (): DrillQuestion[] => {
    if (metadata?.id === 'limits-derivatives-lab') {
      return [
        {
          id: 'q1',
          prompt: 'Estimate the tangent slope of f(x) = x² at x = 2.5',
          unit: '',
          min: 1,
          max: 10,
          step: 0.5,
          actualAnswer: 5.0,
          tolerance: 0.5,
          coachNote: 'f’(x) = 2x, so f’(2.5) = 2(2.5) = 5.0!',
        },
        {
          id: 'q2',
          prompt: 'Estimate the secant slope on f(x) = x² between x = 1 and x = 3',
          unit: '',
          min: 1,
          max: 8,
          step: 0.5,
          actualAnswer: 4.0,
          tolerance: 0.5,
          coachNote: 'Average rate of change is (9 - 1)/(3 - 1) = 8/2 = 4.0!',
        },
        {
          id: 'q3',
          prompt: 'Estimate the slope of f(x) = x³ at x = 1.0',
          unit: '',
          min: 0,
          max: 6,
          step: 0.5,
          actualAnswer: 3.0,
          tolerance: 0.5,
          coachNote: 'Power rule: d/dx(x³) = 3x² = 3(1)² = 3.0!',
        },
      ];
    }

    if (metadata?.id === 'surface-area-volumes') {
      return [
        {
          id: 'q1',
          prompt: 'If a cylinder holds 600 ml, what volume does a cone of identical base and height hold?',
          unit: ' ml',
          min: 50,
          max: 400,
          step: 25,
          actualAnswer: 200,
          tolerance: 20,
          coachNote: 'Archimedes ratio is exactly 1/3! 600 / 3 = 200 ml.',
        },
        {
          id: 'q2',
          prompt: 'Estimate the slant height l of a cone with radius r = 6 m and vertical height h = 8 m',
          unit: ' m',
          min: 5,
          max: 15,
          step: 0.5,
          actualAnswer: 10.0,
          tolerance: 0.5,
          coachNote: '6-8-10 right triangle! l = √(36 + 64) = 10 m.',
        },
      ];
    }

    // Default coordinate geometry drill
    return [
      {
        id: 'q1',
        prompt: 'Estimate the direct distance between (0, 0) and (3, 4)',
        unit: ' u',
        min: 2,
        max: 8,
        step: 0.5,
        actualAnswer: 5.0,
        tolerance: 0.5,
        coachNote: 'Classic 3-4-5 right triangle: √(9 + 16) = 5 u!',
      },
      {
        id: 'q2',
        prompt: 'Estimate the direct distance between (1, 1) and (6, 13)',
        unit: ' u',
        min: 8,
        max: 16,
        step: 0.5,
        actualAnswer: 13.0,
        tolerance: 0.8,
        coachNote: 'Δx = 5, Δy = 12, so hypotenuse is 13 u (5-12-13 triplet)!',
      },
      {
        id: 'q3',
        prompt: 'Estimate the distance between (0, 0) and (8, 15)',
        unit: ' u',
        min: 12,
        max: 20,
        step: 0.5,
        actualAnswer: 17.0,
        tolerance: 0.8,
        coachNote: '8-15-17 Pythagorean triplet: √(64 + 225) = 17 u!',
      },
    ];
  };

  const questions = getQuestions();
  const currentQ = questions[roundIndex % questions.length];

  // Start drill timer on mount
  useEffect(() => {
    if (!isSpeedDrillModalOpen) return;
    setIsDrillActive(true);
    setTimeLeft(60);
    setRoundIndex(0);
    setTotalScore(0);
    setAccuracyHistory([]);
    setHasGuessed(false);
    setCurrentGuess((currentQ.min + currentQ.max) / 2);
  }, [isSpeedDrillModalOpen]);

  // Countdown effect
  useEffect(() => {
    if (!isSpeedDrillModalOpen || !isDrillActive || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsDrillActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isSpeedDrillModalOpen, isDrillActive, timeLeft]);

  if (!isSpeedDrillModalOpen || !metadata) return null;

  const handleCommitGuess = () => {
    if (hasGuessed) return;
    setHasGuessed(true);
    lightTap();

    const diff = Math.abs(currentGuess - currentQ.actualAnswer);
    const accuracy = Math.max(0, Math.round(100 - (diff / currentQ.actualAnswer) * 100));
    setAccuracyHistory((prev) => [...prev, accuracy]);

    if (accuracy >= 85) {
      successBuzz();
      playChime();
      const points = 20 + Math.round((accuracy - 85) * 2);
      setTotalScore((prev) => prev + points);
      addXp(points);
      confetti({ particleCount: 30, spread: 50 });
    } else {
      errorBuzz();
      playError();
      setTotalScore((prev) => prev + 5);
      addXp(5);
    }
  };

  const handleNextQuestion = () => {
    lightTap();
    playClick();
    setHasGuessed(false);
    const nextIdx = roundIndex + 1;
    setRoundIndex(nextIdx);
    const nextQ = questions[nextIdx % questions.length];
    setCurrentGuess((nextQ.min + nextQ.max) / 2);
  };

  const averageAccuracy = accuracyHistory.length > 0 
    ? Math.round(accuracyHistory.reduce((a, b) => a + b, 0) / accuracyHistory.length) 
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-slate-900 border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-100"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex-none p-4 bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-900 border-b border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
              <Zap className="w-4 h-4 fill-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950/70 border border-amber-700/50 px-2 py-0.5 rounded-full">
                  60-Second Intuition Speed Drill
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Round {roundIndex + 1}
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white leading-tight">
                Rapid Spatial Estimation
              </h2>
            </div>
          </div>
          <button
            onClick={() => {
              lightTap();
              closeSpeedDrillModal();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress & Timer Bar */}
        <div className="px-4 py-2.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Clock className={`w-4 h-4 ${timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-amber-400'}`} />
            <span className={`font-mono font-bold ${timeLeft <= 10 ? 'text-red-400' : 'text-white'}`}>
              {timeLeft}s Remaining
            </span>
          </div>
          <div className="flex items-center gap-2 font-mono">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-amber-300 font-bold">{totalScore} XP</span>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {timeLeft > 0 ? (
            <>
              {/* Question Statement */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block">
                  Quick Intuition Prompt
                </span>
                <p className="text-sm font-semibold text-slate-100">
                  {currentQ.prompt}
                </p>
              </div>

              {/* Intuition Slider */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Your Rapid Estimate:</span>
                  <span className="font-mono text-base font-extrabold text-cyan-300 px-2 py-0.5 rounded bg-slate-950 border border-cyan-800/50">
                    {currentGuess.toFixed(1)}{currentQ.unit}
                  </span>
                </div>

                <TouchSlider
                  label=""
                  value={currentGuess}
                  min={currentQ.min}
                  max={currentQ.max}
                  step={currentQ.step}
                  unit={currentQ.unit}
                  onChange={(val) => {
                    if (!hasGuessed) setCurrentGuess(val);
                  }}
                />
              </div>

              {/* Reveal Feedback */}
              {hasGuessed && (
                <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-300">
                      Actual Mathematical Invariant:
                    </span>
                    <span className="font-mono text-sm font-bold text-emerald-400">
                      {currentQ.actualAnswer.toFixed(1)}{currentQ.unit}
                    </span>
                  </div>
                  <p className="text-xs text-amber-300">
                    {currentQ.coachNote}
                  </p>
                </div>
              )}
            </>
          ) : (
            /* Time Up Summary */
            <div className="p-6 text-center space-y-4">
              <Trophy className="w-12 h-12 text-amber-400 mx-auto" />
              <div>
                <h3 className="text-lg font-extrabold text-white">Drill Complete!</h3>
                <p className="text-xs text-slate-400 mt-1">
                  You earned <strong className="text-amber-300">+{totalScore} XP</strong> with an average spatial accuracy of <strong className="text-emerald-400">{averageAccuracy}%</strong>!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex-none p-4 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={() => closeSpeedDrillModal()}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Exit Drill
          </button>

          {timeLeft > 0 ? (
            !hasGuessed ? (
              <button
                onClick={handleCommitGuess}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center gap-1.5 active:scale-95 transition-all shadow-md cursor-pointer"
              >
                <span>Lock Estimate</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center gap-1.5 active:scale-95 transition-all shadow-md cursor-pointer"
              >
                <span>Next Prompt</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )
          ) : (
            <button
              onClick={() => {
                setTimeLeft(60);
                setIsDrillActive(true);
                setRoundIndex(0);
                setTotalScore(0);
                setHasGuessed(false);
              }}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center gap-1.5 active:scale-95 transition-all shadow-md cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Drill</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
