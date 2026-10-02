/**
 * ConceptLightningQuizModal.tsx: 1-Minute Concept Lightning Quiz for Class 8.
 * Tests visual intuition, not tedious pencil calculation!
 * Features instant sound effects, haptics, timer bar, XP rewards, and confetti.
 */
import React, { useState, useEffect } from 'react';
import { 
  X, 
  Flame, 
  CheckCircle2, 
  XCircle, 
  Award, 
  Sparkles, 
  RotateCcw, 
  ArrowRight,
  Clock,
  HelpCircle,
  Brain
} from 'lucide-react';
import { useSimulatorStore } from '../../store/useSimulatorStore';
import { useSound } from '../common/SoundManager';
import { useHaptics } from '../../hooks/useHaptics';
import { BlockMath, InlineMath } from '../common/MathFormula';
import confetti from 'canvas-confetti';
import { SimulatorId } from '../../types/simulators';

interface QuizQuestion {
  id: string;
  topicTitle: string;
  question: string;
  latex?: string;
  options: {
    id: string;
    text: string;
    latex?: string;
    isCorrect: boolean;
  }[];
  explanation: string;
}

const QUIZ_BANK: Record<string, QuizQuestion[]> = {
  default: [
    {
      id: 'q1',
      topicTitle: 'Linear Equations & Balance Scale',
      question: 'On a balanced scale, there are 3 mystery x-boxes and a 4g weight on the left, balancing a 19g weight on the right (3x + 4 = 19). What is your FIRST physical step to isolate x?',
      options: [
        { id: 'a', text: 'Divide the left side by 3 immediately', isCorrect: false },
        { id: 'b', text: 'Remove 4g from BOTH pans simultaneously', isCorrect: true },
        { id: 'c', text: 'Add 4g to the right pan', isCorrect: false },
        { id: 'd', text: 'Guess values of x until it balances', isCorrect: false },
      ],
      explanation: 'Always eliminate constant weights from BOTH pans first! 3x + 4 - 4 = 19 - 4 gives 3x = 15. Then divide by 3 to get x = 5.',
    },
    {
      id: 'q2',
      topicTitle: 'Algebraic Identities',
      question: 'When expanding (a + b)², why is writing a² + b² completely wrong?',
      options: [
        { id: 'a', text: 'Because letters cannot be added', isCorrect: false },
        { id: 'b', text: 'It ignores the two rectangular strips of area 2ab in the corner', isCorrect: true },
        { id: 'c', text: 'Because (a + b)² equals (a - b)²', isCorrect: false },
        { id: 'd', text: 'It only works if a and b are both 0', isCorrect: false },
      ],
      explanation: 'A geometric square of side (a+b) splits into four areas: a² (large square), b² (small corner square), and TWO rectangles of area a×b! So (a+b)² = a² + 2ab + b².',
    },
    {
      id: 'q3',
      topicTitle: 'Compound Interest & Exponential Growth',
      question: 'Why does Compound Interest beat Simple Interest by a huge margin after 5–10 years?',
      options: [
        { id: 'a', text: 'Because the bank raises the interest rate every year', isCorrect: false },
        { id: 'b', text: 'Because you earn interest ON the accumulated interest itself', isCorrect: true },
        { id: 'c', text: 'Because Simple Interest subtracts money every year', isCorrect: false },
        { id: 'd', text: 'Because inflation automatically doubles compound interest', isCorrect: false },
      ],
      explanation: 'In Compound Interest, the principal increases every compounding period because previous interest is added to the principal. Interest generates more interest exponentially!',
    },
    {
      id: 'q4',
      topicTitle: 'Euler\'s Formula for 3D Solids',
      question: 'A polyhedron has 6 faces and 8 vertices (a standard cube). Does it satisfy Euler\'s formula F + V - E = 2?',
      options: [
        { id: 'a', text: 'Yes! 6 + 8 - 12 = 2', isCorrect: true },
        { id: 'b', text: 'No, because cubes have 16 edges', isCorrect: false },
        { id: 'c', text: 'Only if the cube is made of wood', isCorrect: false },
        { id: 'd', text: 'Euler\'s formula only applies to circles', isCorrect: false },
      ],
      explanation: 'A cube has F = 6 faces, V = 8 vertices, and E = 12 edges. F + V - E = 6 + 8 - 12 = 2. Euler\'s formula holds true for all convex polyhedra!',
    },
    {
      id: 'q5',
      topicTitle: 'Direct vs Inverse Proportions',
      question: 'A car travelling at 60 km/h takes 4 hours to reach a city. If the driver speeds up to 120 km/h (doubling speed), how long will the trip take?',
      options: [
        { id: 'a', text: '8 hours (Direct proportion)', isCorrect: false },
        { id: 'b', text: '2 hours (Inverse proportion: speed × time = constant)', isCorrect: true },
        { id: 'c', text: '4 hours (Speed does not change distance)', isCorrect: false },
        { id: 'd', text: '1 hour', isCorrect: false },
      ],
      explanation: 'Speed and Time are INVERSELY proportional: Speed × Time = Distance (constant). Doubling the speed cuts travel time in half: 4 hrs ÷ 2 = 2 hrs!',
    },
  ],
};

export const ConceptLightningQuizModal: React.FC = () => {
  const { 
    isConceptQuizOpen, 
    closeConceptQuizModal, 
    activeQuizTopicId, 
    addXp,
    unlockBadge
  } = useSimulatorStore();

  const { playClick, playChime, playError } = useSound();
  const { lightTap, successBuzz, errorBuzz } = useHaptics();

  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);
  const [isQuizComplete, setIsQuizComplete] = useState<boolean>(false);

  // Get active pool
  const questions = QUIZ_BANK.default;
  const activeQuestion = questions[currentQIndex];

  // Reset quiz when opened
  useEffect(() => {
    if (isConceptQuizOpen) {
      setCurrentQIndex(0);
      setSelectedOptionId(null);
      setScore(0);
      setIsQuizComplete(false);
    }
  }, [isConceptQuizOpen]);

  if (!isConceptQuizOpen || !activeQuestion) return null;

  const handleSelectOption = (optionId: string) => {
    if (selectedOptionId !== null) return; // Already selected
    lightTap();
    setSelectedOptionId(optionId);

    const chosen = activeQuestion.options.find((o) => o.id === optionId);
    if (chosen?.isCorrect) {
      successBuzz();
      playChime();
      setScore((s) => s + 1);
    } else {
      errorBuzz();
      playError();
    }
  };

  const handleNext = () => {
    lightTap();
    playClick();
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex((i) => i + 1);
      setSelectedOptionId(null);
    } else {
      // Quiz Finished
      setIsQuizComplete(true);
      const earnedXp = (score + (activeQuestion.options.find((o) => o.id === selectedOptionId)?.isCorrect ? 1 : 0)) * 10;
      addXp(earnedXp);
      unlockBadge('Quiz Lightning Ace');
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const handleRestart = () => {
    lightTap();
    playClick();
    setCurrentQIndex(0);
    setSelectedOptionId(null);
    setScore(0);
    setIsQuizComplete(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 overflow-y-auto">
      <div 
        className="w-full max-w-xl bg-slate-900 border border-purple-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-purple-950/60 via-slate-900 to-slate-900 border-b border-purple-500/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
              <Flame className="w-5 h-5 fill-purple-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-purple-300 uppercase">
                <span>1-Min Concept Sprint</span>
                <span>·</span>
                <span>Question {currentQIndex + 1} of {questions.length}</span>
              </div>
              <h3 className="text-sm font-bold text-white">Visual Intuition Challenge</h3>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              lightTap();
              closeConceptQuizModal();
            }}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quiz Body */}
        {!isQuizComplete ? (
          <div className="p-5 sm:p-6 space-y-5">
            {/* Topic pill */}
            <div className="flex items-center justify-between text-xs">
              <span className="px-2.5 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800/60 font-semibold text-[11px]">
                {activeQuestion.topicTitle}
              </span>
              <span className="font-mono text-slate-400 text-xs">
                Score: <strong className="text-amber-400">{score}</strong> / {questions.length}
              </span>
            </div>

            {/* Question Text */}
            <div className="space-y-2">
              <h4 className="text-base sm:text-lg font-bold text-white leading-snug">
                {activeQuestion.question}
              </h4>
              {activeQuestion.latex && (
                <div className="p-2 rounded-xl bg-slate-950 text-center">
                  <BlockMath math={activeQuestion.latex} className="text-cyan-300 my-0 text-sm" />
                </div>
              )}
            </div>

            {/* Options List */}
            <div className="space-y-2.5">
              {activeQuestion.options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                const showFeedback = selectedOptionId !== null;
                const isCorrect = opt.isCorrect;

                let btnStyle = 'bg-slate-950/80 hover:bg-slate-800 border-slate-800 text-slate-200';
                if (showFeedback) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-semibold';
                  } else if (isSelected && !isCorrect) {
                    btnStyle = 'bg-rose-950/60 border-rose-500 text-rose-200 font-semibold';
                  } else {
                    btnStyle = 'bg-slate-950/40 border-slate-900 text-slate-500 opacity-60';
                  }
                }

                return (
                  <button
                    key={opt.id}
                    type="button"
                    disabled={showFeedback}
                    onClick={() => handleSelectOption(opt.id)}
                    className={`w-full p-3.5 rounded-2xl border text-left text-xs sm:text-sm flex items-center justify-between transition-all cursor-pointer ${btnStyle}`}
                  >
                    <span>{opt.text}</span>
                    {showFeedback && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 ml-2" />
                    )}
                    {showFeedback && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-400 shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation reveal */}
            {selectedOptionId !== null && (
              <div className="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-800/40 space-y-1 text-xs animate-in fade-in">
                <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                  <Brain className="w-4 h-4 text-cyan-400" />
                  <span>Coach Visual Explanation:</span>
                </span>
                <p className="text-slate-300 leading-relaxed">
                  {activeQuestion.explanation}
                </p>
              </div>
            )}

            {/* Next / Submit Button */}
            {selectedOptionId !== null && (
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-5 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-transform cursor-pointer"
                >
                  <span>{currentQIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Quiz Results Screen */
          <div className="p-6 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 mx-auto shadow-lg">
              <Award className="w-8 h-8 text-amber-400" />
            </div>

            <div className="space-y-1">
              <h4 className="text-xl font-black text-white">Sprint Completed!</h4>
              <p className="text-sm text-slate-300">
                You scored <strong className="text-amber-400">{score}</strong> out of {questions.length} correct!
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 max-w-sm mx-auto space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>XP Earned:</span>
                <span className="font-bold text-amber-400">+{score * 10} XP</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>Badge Unlocked:</span>
                <span className="font-bold text-purple-300">Quiz Lightning Ace ⚡</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleRestart}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry Sprint</span>
              </button>

              <button
                type="button"
                onClick={closeConceptQuizModal}
                className="px-5 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs shadow-md transition-transform cursor-pointer"
              >
                Continue Learning
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
