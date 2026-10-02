import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  CheckCircle2, 
  ChevronRight, 
  Sparkles, 
  Lock, 
  ArrowRight, 
  Flame, 
  RotateCcw,
  X,
  Target
} from 'lucide-react';
import { SimulatorId } from '../../types/simulators';
import { useProgress } from '../../hooks/useProgress';
import { useProgressStore } from '../../store/useProgressStore';
import { useClassStore } from '../../store/useClassStore';
import { useAnalytics } from '../../hooks/useAnalytics';
import { useHaptics } from '../../hooks/useHaptics';
import { useSound } from './SoundManager';
import { SuccessOverlay } from './SuccessOverlay';
import { useSimulatorStore } from '../../store/useSimulatorStore';
import { InlineMath, BlockMath, MathText } from './MathFormula';

export interface ChallengeLevel {
  levelNumber: number; // 1, 2, 3
  title: string;
  badge: string;
  description: string;
  requirementFormula: string;
  targetCriteria: string;
  xpReward: number;
  autoPreset?: () => void;
  checkCompletion?: () => boolean;
  tier1Hint?: string; // Conceptual Nudge (0 XP)
  tier2Hint?: string; // Visual Blueprint (5 XP)
  tier3Hint?: string; // Full Working & Preset (15 XP)
}

interface ChallengeManagerProps {
  simulatorId: SimulatorId;
  simulatorTitle: string;
  levels: ChallengeLevel[];
  onTriggerPreset?: (levelNumber: number) => void;
  isOpenDefault?: boolean;
}

export const ChallengeManager: React.FC<ChallengeManagerProps> = ({
  simulatorId,
  simulatorTitle,
  levels,
  onTriggerPreset,
  isOpenDefault = false,
}) => {
  const { progress, markLevelComplete, isLevelCompleted } = useProgress();
  const { markSimulatorLevelComplete } = useProgressStore();
  const { recordStudentSubmission, studentName, studentClassCode } = useClassStore();
  const { trackSimulatorComplete, trackEvent, trackStruggle } = useAnalytics();
  const { lightTap, successBuzz, errorBuzz } = useHaptics();
  const { playClick, playChime, playError } = useSound();
  const { 
    isZenMode, 
    activeMissionsModal, 
    setActiveMissionsModal,
    revealedHints,
    unlockHint 
  } = useSimulatorStore();

  const [isOpen, setIsOpen] = useState(isOpenDefault);
  const [activeTab, setActiveTab] = useState<number>(1);
  const [celebrationLevel, setCelebrationLevel] = useState<ChallengeLevel | null>(null);

  useEffect(() => {
    if (activeMissionsModal) {
      setIsOpen(true);
    }
  }, [activeMissionsModal]);

  const handleClose = () => {
    setIsOpen(false);
    setActiveMissionsModal(false);
  };

  const completedLevels = progress.simulators[simulatorId]?.levelsCompleted || [];
  const allCompleted = levels.every((lvl) => completedLevels.includes(lvl.levelNumber));

  const handleCompleteCurrent = (level: ChallengeLevel) => {
    if (completedLevels.includes(level.levelNumber)) return;

    markLevelComplete(simulatorId, level.levelNumber, level.xpReward);
    markSimulatorLevelComplete(simulatorId, level.levelNumber, level.xpReward);

    // Track behavioral telemetry
    trackSimulatorComplete(simulatorId, level.xpReward, {
      challengeLevel: level.levelNumber,
      challengeTitle: level.title,
      studentClassCode: studentClassCode || 'unassigned',
    });

    // Save to class gradebook store
    recordStudentSubmission({
      studentName: studentName || 'Alex Mercer',
      studentId: 'std-current',
      classCode: studentClassCode || 'MATH-42',
      simulatorId,
      simulatorTitle,
      levelNumber: level.levelNumber,
      score: level.xpReward,
      timeSpentSeconds: 45,
      passed: true,
      struggledAttempts: 1,
    });

    setIsOpen(false);
    setCelebrationLevel(level);
  };

  const handleNextChallenge = () => {
    if (!celebrationLevel) return;
    const nextNum = celebrationLevel.levelNumber + 1;
    setCelebrationLevel(null);
    if (nextNum <= levels.length) {
      setActiveTab(nextNum);
      if (onTriggerPreset) {
        onTriggerPreset(nextNum);
      }
      setIsOpen(true);
    }
  };

  return (
    <>
      {/* Floating Toggle Pill (Discreet on desktop, hidden on mobile or in Zen mode) */}
      {!isZenMode && (
        <div className="hidden sm:block absolute top-3 left-3 z-20 pointer-events-auto">
          <button
            type="button"
            onClick={() => {
              lightTap();
              playClick();
              setIsOpen(!isOpen);
            }}
            className={`h-7 px-2.5 rounded-full backdrop-blur-md border text-xs font-semibold flex items-center gap-1.5 shadow-md active:scale-95 transition-all touch-manipulation cursor-pointer ${
              allCompleted
                ? 'bg-emerald-950/85 border-emerald-500/80 text-emerald-300 ring-1 ring-emerald-500/30'
                : 'bg-slate-900/85 border-amber-500/50 text-amber-300'
            }`}
            aria-label="Toggle progressive challenges"
          >
            <Trophy className="w-3 h-3 text-amber-400" />
            <span className="tabular-nums">
              Missions ({completedLevels.length}/{levels.length})
            </span>
          </button>
        </div>
      )}

      {/* Challenge Overlay Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 via-slate-900/80 to-amber-950/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-100 flex items-center gap-2">
                    <span>Progressive Challenges</span>
                    {allCompleted && (
                      <span className="text-xs bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-full font-mono">
                        MASTERED
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-slate-400 truncate max-w-[260px] sm:max-w-xs mt-0.5">
                    {simulatorTitle}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Level Selector Tabs */}
            <div className="grid grid-cols-3 gap-2 p-3 sm:p-3.5 bg-slate-950/50 border-b border-slate-800/80">
              {levels.map((lvl) => {
                const isDone = completedLevels.includes(lvl.levelNumber);
                const isActive = activeTab === lvl.levelNumber;
                const isLocked = lvl.levelNumber > 1 && !completedLevels.includes(lvl.levelNumber - 1) && !isDone;

                return (
                  <button
                    key={lvl.levelNumber}
                    type="button"
                    onClick={() => setActiveTab(lvl.levelNumber)}
                    className={`py-2 px-2.5 rounded-2xl text-xs sm:text-sm font-semibold flex flex-col items-center gap-1 transition-all touch-manipulation border ${
                      isActive
                        ? 'bg-amber-500/15 border-amber-500/80 text-amber-300 shadow-sm'
                        : isDone
                        ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-400'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : isLocked ? (
                        <Lock className="w-4 h-4 text-slate-500" />
                      ) : (
                        <Target className="w-4 h-4 text-amber-400" />
                      )}
                      <span className="font-mono text-xs sm:text-sm font-bold">Level {lvl.levelNumber}</span>
                    </div>
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-mono">
                      +{lvl.xpReward} XP
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Active Level Detail Body */}
            {(() => {
              const currentLvl = levels.find((l) => l.levelNumber === activeTab) || levels[0];
              const isDone = completedLevels.includes(currentLvl.levelNumber);
              const isLocked =
                currentLvl.levelNumber > 1 &&
                !completedLevels.includes(currentLvl.levelNumber - 1) &&
                !isDone;

              return (
                <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-800 text-amber-300 border border-slate-700">
                      {currentLvl.badge}
                    </span>
                    <span className="font-mono text-xs sm:text-sm text-slate-400">
                      Reward: <strong className="text-amber-400">+{currentLvl.xpReward} XP</strong>
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base sm:text-lg font-extrabold text-white">
                      {currentLvl.title}
                    </h4>
                    <div className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-1">
                      <MathText text={currentLvl.description} />
                    </div>
                  </div>

                  {/* Mathematical Target Requirement Box */}
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                      Evaluation Criteria & Math Formula
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 overflow-x-auto no-scrollbar text-center">
                      <BlockMath math={currentLvl.requirementFormula} className="my-0.5 text-cyan-200 font-semibold text-sm" />
                    </div>
                    <div className="text-xs sm:text-sm text-slate-300 flex items-start gap-2 pt-0.5">
                      <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <MathText text={currentLvl.targetCriteria} />
                      </div>
                    </div>
                  </div>

                  {/* Priority 2: 3-Tier Progressive Hint Ladder */}
                  {(() => {
                    const hintKey = `${simulatorId}_lvl_${currentLvl.levelNumber}`;
                    const unlockedTier = revealedHints[hintKey] || 0;

                    const defaultTier1 = currentLvl.tier1Hint || 'Start by dragging the primary coordinates or sliders to see where the value peaks.';
                    const defaultTier2 = currentLvl.tier2Hint || `Look closely at the formula $${currentLvl.requirementFormula}$ and observe which variable controls the denominator or height.`;
                    const defaultTier3 = currentLvl.tier3Hint || 'Hit "Load Recommended Parameters" below to immediately set up the required mathematical state!';

                    return (
                      <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-amber-500/30 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs uppercase font-bold text-amber-400 tracking-wider flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                            <span>Progressive Hint Ladder (3 Tiers)</span>
                          </span>
                          <span className="text-xs text-slate-400 font-mono">
                            Tier {unlockedTier}/3 Unlocked
                          </span>
                        </div>

                        {/* Tier 1 */}
                        {unlockedTier >= 1 ? (
                          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm space-y-1">
                            <strong className="text-xs text-amber-300 block uppercase">
                              Tier 1 · Conceptual Thought Starter (Free)
                            </strong>
                            <div className="text-slate-200 leading-relaxed">
                              <MathText text={defaultTier1} />
                            </div>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              lightTap();
                              playClick();
                              unlockHint(hintKey, 1, 0);
                            }}
                            className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-amber-300 text-xs sm:text-sm font-semibold flex items-center justify-between cursor-pointer transition-colors"
                          >
                            <span>💡 Unlock Tier 1: Conceptual Nudge</span>
                            <span className="text-xs font-mono text-emerald-400">FREE (0 XP)</span>
                          </button>
                        )}

                        {/* Tier 2 */}
                        {unlockedTier >= 2 ? (
                          <div className="p-3 rounded-xl bg-slate-900 border border-cyan-800/50 text-xs sm:text-sm space-y-1">
                            <strong className="text-xs text-cyan-300 block uppercase">
                              Tier 2 · Visual Blueprint & Formula Clue
                            </strong>
                            <div className="text-slate-200 leading-relaxed">
                              <MathText text={defaultTier2} />
                            </div>
                          </div>
                        ) : unlockedTier >= 1 ? (
                          <button
                            type="button"
                            onClick={() => {
                              lightTap();
                              playClick();
                              unlockHint(hintKey, 2, 5);
                            }}
                            className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-cyan-300 text-xs sm:text-sm font-semibold flex items-center justify-between cursor-pointer transition-colors"
                          >
                            <span>📐 Unlock Tier 2: Visual Blueprint</span>
                            <span className="text-xs font-mono text-amber-400">-5 XP</span>
                          </button>
                        ) : null}

                        {/* Tier 3 */}
                        {unlockedTier >= 3 ? (
                          <div className="p-3 rounded-xl bg-slate-900 border border-emerald-800/50 text-xs sm:text-sm space-y-1">
                            <strong className="text-xs text-emerald-300 block uppercase">
                              Tier 3 · Step-by-Step Numeric Working
                            </strong>
                            <div className="text-slate-200 leading-relaxed">
                              <MathText text={defaultTier3} />
                            </div>
                          </div>
                        ) : unlockedTier >= 2 ? (
                          <button
                            type="button"
                            onClick={() => {
                              lightTap();
                              playClick();
                              unlockHint(hintKey, 3, 15);
                              if (onTriggerPreset) {
                                onTriggerPreset(currentLvl.levelNumber);
                              }
                            }}
                            className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-emerald-300 text-xs sm:text-sm font-semibold flex items-center justify-between cursor-pointer transition-colors"
                          >
                            <span>🎯 Unlock Tier 3: Auto-Preset & Working</span>
                            <span className="text-xs font-mono text-amber-400">-15 XP</span>
                          </button>
                        ) : null}
                      </div>
                    );
                  })()}

                  {/* Action Buttons */}
                  <div className="space-y-2 pt-2">
                    {onTriggerPreset && (
                      <button
                        type="button"
                        onClick={() => {
                          onTriggerPreset(currentLvl.levelNumber);
                          setIsOpen(false);
                        }}
                        className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-98 text-xs font-semibold text-cyan-300 border border-slate-700 flex items-center justify-center gap-1.5 transition-colors touch-manipulation"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Load Recommended Parameters</span>
                      </button>
                    )}

                    <button
                      type="button"
                      disabled={isDone || isLocked}
                      onClick={() => handleCompleteCurrent(currentLvl)}
                      className={`w-full py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all touch-manipulation ${
                        isDone
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/80 cursor-default'
                          : isLocked
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                          : 'bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 shadow-amber-500/20 hover:brightness-110 active:scale-98'
                      }`}
                    >
                      {isDone ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Level {currentLvl.levelNumber} Completed!</span>
                        </>
                      ) : isLocked ? (
                        <>
                          <Lock className="w-4 h-4" />
                          <span>Complete Level {currentLvl.levelNumber - 1} First</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>Verify &amp; Claim Level {currentLvl.levelNumber} (+{currentLvl.xpReward} XP)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })()}

            {/* Footer Summary */}
            <div className="p-3 bg-slate-950/70 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono">
                Total XP Earned: <strong className="text-white">{progress.totalXp} XP</strong>
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-cyan-400 hover:underline font-semibold"
              >
                Back to Simulator
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Level Success Celebration Overlay */}
      {celebrationLevel && (
        <SuccessOverlay
          isOpen={!!celebrationLevel}
          onClose={() => setCelebrationLevel(null)}
          onNextChallenge={handleNextChallenge}
          title={celebrationLevel.title}
          subtitle={`Phenomenal job! You solved: ${celebrationLevel.targetCriteria}`}
          xpEarned={celebrationLevel.xpReward}
          levelNumber={celebrationLevel.levelNumber}
          conceptLearned={celebrationLevel.badge}
          hasNextLevel={celebrationLevel.levelNumber < levels.length}
        />
      )}
    </>
  );
};
