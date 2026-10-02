/**
 * MontyHallSimulator.tsx: The Monty Hall Probability Casino for Class 10/11.
 * Features:
 * - 3 Mystery Doors (Car 🏎️ vs Goats 🐐)
 * - Game flow: Initial Pick -> Host Monty reveals a goat -> Choice to "Stay" or "Switch" -> Grand Reveal!
 * - "Run 1,000 Simulations" Monte Carlo batch engine: Instant simulation of 1,000 rounds
 * - Live animated comparative bar charts displaying empirical win rates vs theoretical ~66.7% / 33.3%
 * - Visual demonstration of Bayes' Theorem and conditional probability
 */
import React, { useState, useRef, useEffect } from 'react';
import { 
  Trophy, 
  HelpCircle, 
  RotateCcw, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  Play, 
  BarChart3, 
  Flame, 
  Zap, 
  ArrowRight,
  TrendingUp,
  Percent,
  Sliders
} from 'lucide-react';
import { BottomSheet } from '../layout/BottomSheet';
import { MathFormula } from '../common/MathFormula';
import { CoachTheoryModule } from '../common/CoachTheoryModule';
import { ChallengeManager, ChallengeLevel } from '../common/ChallengeManager';
import { useHaptics } from '../../hooks/useHaptics';
import { useSound } from '../common/SoundManager';
import { useAnalytics } from '../../hooks/useAnalytics';

type GameStage = 'pick' | 'host_reveal' | 'result';

interface DoorState {
  id: number; // 0, 1, 2
  hasCar: boolean;
  isOpen: boolean;
}

export const MontyHallSimulator: React.FC = () => {
  const { lightTap, successBuzz, errorBuzz } = useHaptics();
  const { playClick, playChime, playError, playWhoosh } = useSound();
  const { trackEvent, trackStruggle } = useAnalytics();

  // Single game interactive state
  const [doors, setDoors] = useState<DoorState[]>([
    { id: 0, hasCar: false, isOpen: false },
    { id: 1, hasCar: true, isOpen: false },
    { id: 2, hasCar: false, isOpen: false },
  ]);
  const [playerPick, setPlayerPick] = useState<number | null>(null);
  const [revealedGoatDoor, setRevealedGoatDoor] = useState<number | null>(null);
  const [gameStage, setGameStage] = useState<GameStage>('pick');
  const [playerWon, setPlayerWon] = useState<boolean | null>(null);
  const [chosenStrategy, setChosenStrategy] = useState<'stay' | 'switch' | null>(null);

  // Live session statistics
  const [stats, setStats] = useState({
    stayPlays: 0,
    stayWins: 0,
    switchPlays: 0,
    switchWins: 0,
  });

  // Monte Carlo fast batch simulation state
  const [isSimulatingBatch, setIsSimulatingBatch] = useState<boolean>(false);
  const [batchProgress, setBatchProgress] = useState<number>(0);

  // Reset single game
  const startNewRound = () => {
    lightTap();
    // Randomly assign car to door 0, 1, or 2
    const carIndex = Math.floor(Math.random() * 3);
    setDoors([
      { id: 0, hasCar: carIndex === 0, isOpen: false },
      { id: 1, hasCar: carIndex === 1, isOpen: false },
      { id: 2, hasCar: carIndex === 2, isOpen: false },
    ]);
    setPlayerPick(null);
    setRevealedGoatDoor(null);
    setGameStage('pick');
    setPlayerWon(null);
    setChosenStrategy(null);
  };

  // Step 1: Player picks initial door
  const handleSelectDoor = (doorId: number) => {
    if (gameStage !== 'pick') return;
    lightTap();
    playClick();
    setPlayerPick(doorId);

    // Host Monty reveals one of the OTHER doors that has a GOAT
    setTimeout(() => {
      const remainingDoors = doors.filter((d) => d.id !== doorId && !d.hasCar);
      // If player picked the car, Monty can choose either goat randomly
      const hostChoice = remainingDoors[Math.floor(Math.random() * remainingDoors.length)];

      setDoors((prev) =>
        prev.map((d) => (d.id === hostChoice.id ? { ...d, isOpen: true } : d))
      );
      setRevealedGoatDoor(hostChoice.id);
      setGameStage('host_reveal');
      playWhoosh();
    }, 450);
  };

  // Step 2: Player chooses to Stay or Switch
  const handlePlayerDecision = (decision: 'stay' | 'switch') => {
    if (gameStage !== 'host_reveal' || playerPick === null || revealedGoatDoor === null) return;
    setChosenStrategy(decision);

    let finalDoorId = playerPick;
    if (decision === 'switch') {
      // Find the remaining unopened door
      const otherDoor = doors.find((d) => d.id !== playerPick && d.id !== revealedGoatDoor);
      if (otherDoor) finalDoorId = otherDoor.id;
    }

    const won = doors[finalDoorId].hasCar;
    setPlayerWon(won);
    setGameStage('result');

    // Open all doors for reveal
    setDoors((prev) => prev.map((d) => ({ ...d, isOpen: true })));

    if (won) {
      successBuzz();
      playChime();
    } else {
      errorBuzz();
      playError();
    }

    // Update session statistics
    setStats((prev) => {
      if (decision === 'stay') {
        return {
          ...prev,
          stayPlays: prev.stayPlays + 1,
          stayWins: won ? prev.stayWins + 1 : prev.stayWins,
        };
      } else {
        return {
          ...prev,
          switchPlays: prev.switchPlays + 1,
          switchWins: won ? prev.switchWins + 1 : prev.switchWins,
        };
      }
    });

    trackEvent('monty_hall_round_completed', {
      strategy: decision,
      won,
    });
  };

  // Step 3: Run 1,000 Monte Carlo Simulations
  const run1000Simulations = () => {
    lightTap();
    playWhoosh();
    setIsSimulatingBatch(true);
    setBatchProgress(0);

    const totalRounds = 1000;
    let newStayWins = 0;
    let newSwitchWins = 0;

    // Simulate 1,000 rounds of each strategy
    for (let i = 0; i < totalRounds; i++) {
      const carDoor = Math.floor(Math.random() * 3);
      const firstPick = Math.floor(Math.random() * 3);

      // Strategy 1: Always Stay
      if (firstPick === carDoor) {
        newStayWins++;
      }

      // Strategy 2: Always Switch
      // Monty reveals a goat from remaining doors
      let revealedGoat = -1;
      for (let d = 0; d < 3; d++) {
        if (d !== firstPick && d !== carDoor) {
          revealedGoat = d;
          break;
        }
      }
      // If firstPick was car, Monty chose either other door (which are both goats)
      if (revealedGoat === -1) {
        revealedGoat = firstPick === 0 ? 1 : 0;
      }

      // Switch to the only other door
      const switchedPick = [0, 1, 2].find((d) => d !== firstPick && d !== revealedGoat)!;
      if (switchedPick === carDoor) {
        newSwitchWins++;
      }
    }

    // Animate progress to 100%
    setTimeout(() => {
      setStats((prev) => ({
        stayPlays: prev.stayPlays + totalRounds,
        stayWins: prev.stayWins + newStayWins,
        switchPlays: prev.switchPlays + totalRounds,
        switchWins: prev.switchWins + newSwitchWins,
      }));
      setIsSimulatingBatch(false);
      successBuzz();
      playChime();
      trackEvent('monty_hall_batch_simulated', {
        rounds: totalRounds,
        stayWinRate: (newStayWins / totalRounds) * 100,
        switchWinRate: (newSwitchWins / totalRounds) * 100,
      });
    }, 400);
  };

  // Win percentage computations
  const stayWinPct = stats.stayPlays > 0 ? ((stats.stayWins / stats.stayPlays) * 100).toFixed(1) : '33.3';
  const switchWinPct = stats.switchPlays > 0 ? ((stats.switchWins / stats.switchPlays) * 100).toFixed(1) : '66.7';

  // Challenge Levels
  const challengeLevels: ChallengeLevel[] = [
    {
      levelNumber: 1,
      title: 'The First Paradox: Always Switch',
      badge: 'Game Show Novice',
      description: 'Play a round and choose to "Switch" after Monty reveals a goat to experience the 2/3 advantage.',
      requirementFormula: 'P(Car | Switch) = 2/3 ≈ 66.7%',
      targetCriteria: 'Win with Switch',
      xpReward: 30,
      autoPreset: () => startNewRound(),
    },
    {
      levelNumber: 2,
      title: 'Statistical Significance: 1,000 Runs',
      badge: 'Monte Carlo Maestro',
      description: 'Run the 1,000 simulation engine to empirically prove the Law of Large Numbers converges on ~66.7%.',
      requirementFormula: 'lim[N→∞] f_switch = 2/3',
      targetCriteria: 'Simulate 1,000 games',
      xpReward: 50,
      autoPreset: () => run1000Simulations(),
    },
    {
      levelNumber: 3,
      title: 'Bayes Theorem Master',
      badge: 'Probability Shark',
      description: 'Reach at least 1,500 total simulations with Switch win-rate strictly higher than 64%.',
      requirementFormula: 'P(C₁|M₂) = P(M₂|C₁)P(C₁) / P(M₂) = 1/3',
      targetCriteria: '1,500+ trials verified',
      xpReward: 60,
      autoPreset: () => run1000Simulations(),
    },
  ];

  return (
    <div className="relative w-full flex-1 min-h-0 h-full flex flex-col bg-slate-950 text-slate-100 overflow-hidden select-none">
      {/* Top HUD with Game Show Live Win Odds */}
      <div className="z-10 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-3 sm:px-6 py-2 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {/* Stay Strategy Live Metric */}
          <div className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-1.5 text-xs font-mono">
            <span className="text-slate-400 font-bold">Stay Win:</span>
            <span className="text-amber-400 font-black">{stayWinPct}%</span>
            <span className="text-[10px] text-slate-400">({stats.stayWins}/{stats.stayPlays})</span>
          </div>

          {/* Switch Strategy Live Metric */}
          <div className="px-3 py-1 rounded-xl bg-cyan-950/80 border border-cyan-800/60 flex items-center gap-1.5 text-xs font-mono">
            <span className="text-cyan-400 font-bold">Switch Win:</span>
            <span className="text-emerald-400 font-black">{switchWinPct}%</span>
            <span className="text-[10px] text-slate-400">({stats.switchWins}/{stats.switchPlays})</span>
          </div>
        </div>

        {/* 1,000 Fast Monte Carlo Engine Button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={run1000Simulations}
            disabled={isSimulatingBatch}
            className="py-1 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 hover:brightness-110 active:scale-95 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-slate-950" />
            <span>Run 1,000 Sims</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="relative flex-1 w-full flex flex-col items-center justify-between p-4 sm:p-6 overflow-y-auto no-scrollbar">
        {/* Game Show Host Prompt Banner */}
        <div className="w-full max-w-xl text-center space-y-1.5">
          <span className="px-3 py-0.5 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-300 font-mono text-[10px] font-bold uppercase tracking-wider">
            {gameStage === 'pick' && 'Stage 1: Choose Your Door'}
            {gameStage === 'host_reveal' && 'Stage 2: Monty Revealed a Goat! Stay or Switch?'}
            {gameStage === 'result' && (playerWon ? '🎉 YOU WON THE SPORTS CAR!' : '🐐 BAAAH! YOU GOT A GOAT!')}
          </span>

          <h2 className="text-lg sm:text-xl font-black text-white">
            {gameStage === 'pick' && 'Select one of the 3 mystery doors below:'}
            {gameStage === 'host_reveal' && 'Will you Stay with your original pick or Switch?'}
            {gameStage === 'result' && (playerWon ? 'Congratulations! Switching pays off!' : 'Better luck next round!')}
          </h2>
        </div>

        {/* The 3 Vegas Casino Mystery Doors */}
        <div className="w-full max-w-2xl grid grid-cols-3 gap-3 sm:gap-6 my-auto py-4">
          {doors.map((door) => {
            const isPicked = playerPick === door.id;
            const isHostRevealed = revealedGoatDoor === door.id;

            return (
              <div
                key={door.id}
                onClick={() => handleSelectDoor(door.id)}
                className={`relative flex flex-col items-center justify-between rounded-3xl p-3 sm:p-6 min-h-[220px] sm:min-h-[280px] border-2 transition-all cursor-pointer select-none touch-manipulation group ${
                  door.isOpen
                    ? door.hasCar
                      ? 'bg-emerald-950/70 border-emerald-500 shadow-2xl shadow-emerald-500/30'
                      : 'bg-slate-900/90 border-slate-700'
                    : isPicked
                    ? 'bg-cyan-950/70 border-cyan-400 shadow-xl shadow-cyan-500/25 scale-[1.02]'
                    : 'bg-gradient-to-b from-slate-900 to-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Door Header Number */}
                <div className="flex items-center justify-between w-full">
                  <span className="font-mono text-sm sm:text-lg font-black text-slate-400">
                    Door #{door.id + 1}
                  </span>
                  {isPicked && (
                    <span className="px-2 py-0.5 rounded-full bg-cyan-500 text-slate-950 font-bold text-[10px]">
                      Your Pick
                    </span>
                  )}
                </div>

                {/* Content Inside Door (Car vs Goat vs Closed) */}
                <div className="my-auto flex flex-col items-center justify-center">
                  {door.isOpen ? (
                    door.hasCar ? (
                      <div className="flex flex-col items-center gap-2 animate-bounce">
                        <span className="text-4xl sm:text-6xl">🏎️</span>
                        <span className="font-bold text-xs text-emerald-400 uppercase tracking-wider">
                          Sports Car!
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-4xl sm:text-6xl animate-pulse">🐐</span>
                        <span className="font-bold text-xs text-amber-400 uppercase tracking-wider">
                          Goat
                        </span>
                      </div>
                    )
                  ) : (
                    <div className="w-16 h-28 sm:w-24 sm:h-36 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700 flex flex-col items-center justify-center shadow-inner group-hover:border-cyan-500/50 transition-colors">
                      <div className="w-3 h-3 rounded-full bg-amber-400 shadow-md mb-2" />
                      <span className="font-mono text-xs text-slate-400 font-bold">???</span>
                    </div>
                  )}
                </div>

                {/* Door Status Footnote */}
                <div className="text-center w-full">
                  {isHostRevealed && (
                    <span className="text-[10px] font-mono text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/40">
                      Monty Opened!
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Controls for Stage 2 & Stage 3 */}
        {gameStage === 'host_reveal' && (
          <div className="w-full max-w-md flex items-center justify-center gap-4 py-2 animate-fade-in">
            <button
              type="button"
              onClick={() => handlePlayerDecision('stay')}
              className="flex-1 py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <span>Stay with #{playerPick! + 1}</span>
            </button>

            <button
              type="button"
              onClick={() => handlePlayerDecision('switch')}
              className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-emerald-400 hover:brightness-110 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/25 transition-all active:scale-95 cursor-pointer"
            >
              <span>Switch Doors! (2/3 Odds)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {gameStage === 'result' && (
          <div className="w-full max-w-md flex items-center justify-center gap-3 py-2">
            <button
              type="button"
              onClick={startNewRound}
              className="py-3 px-8 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/30 transition-all active:scale-95 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Play Next Round</span>
            </button>
          </div>
        )}

        {/* Live Empirical Bar Chart (Stay vs Switch Win Percentage) */}
        <div className="w-full max-w-xl bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 p-4 space-y-3 mt-auto">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-white flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              <span>Empirical Win Rate Comparison ({stats.stayPlays + stats.switchPlays} Total Trials)</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400">Theoretical: 33.3% vs 66.7%</span>
          </div>

          {/* Stay Strategy Bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400">Always Stay</span>
              <span className="text-amber-400 font-bold">{stayWinPct}%</span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
              <div
                style={{ width: `${stayWinPct}%` }}
                className="h-full bg-amber-500 rounded-full transition-all duration-500"
              />
            </div>
          </div>

          {/* Switch Strategy Bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-cyan-400 font-bold">Always Switch (Optimal)</span>
              <span className="text-emerald-400 font-bold">{switchWinPct}%</span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
              <div
                style={{ width: `${switchWinPct}%` }}
                className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full transition-all duration-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sheet Controls & Formulas */}
      <BottomSheet
        title="Monty Hall & Conditional Probability"
        badgeLabel="Class 10/11 · Bayes Theorem"
        quickEquation="P(Car | Switch) = 2/3 ≈ 66.7% · P(Car | Stay) = 1/3 ≈ 33.3%"
        onReset={() => {
          setStats({ stayPlays: 0, stayWins: 0, switchPlays: 0, switchWins: 0 });
          startNewRound();
        }}
        theoryContent={
          <CoachTheoryModule
            simulatorId="monty-hall"
            extraLiveDetails={
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-xl bg-amber-950/30 border border-amber-800/40">
                    <span className="text-[10px] text-amber-300 block font-semibold">Stay Win Rate ({stats.stayPlays} trials):</span>
                    <span className="font-mono text-white font-bold">{stayWinPct}%</span>
                  </div>
                  <div className="p-2 rounded-xl bg-emerald-950/30 border border-emerald-800/40">
                    <span className="text-[10px] text-emerald-300 block font-semibold">Switch Win Rate ({stats.switchPlays} trials):</span>
                    <span className="font-mono text-white font-bold">{switchWinPct}%</span>
                  </div>
                </div>
              </div>
            }
          />
        }
        challengeContent={
          <div className="space-y-4">
            <ChallengeManager
              simulatorId="monty-hall"
              simulatorTitle="The Monty Hall Probability Casino"
              levels={challengeLevels}
              onTriggerPreset={(lvl) => {
                const targetLvl = challengeLevels.find((l) => l.levelNumber === lvl);
                targetLvl?.autoPreset?.();
              }}
              isOpenDefault={true}
            />
          </div>
        }
      >
        <div className="space-y-4 text-xs">
          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <h4 className="font-bold text-cyan-400 text-xs">How the Simulator Proves the Paradox:</h4>
            <p className="text-slate-400 leading-relaxed">
              When you first select a door, you only have a 1 in 3 (33.3%) chance of having picked the sports car. 
              The two unselected doors combined hold a 2 in 3 (66.7%) chance. Because Monty knows where the car is, 
              he always reveals a goat, concentrating all 66.7% of that probability into the single remaining door!
            </p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={run1000Simulations}
              className="py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>Simulate 1,000 Extra Rounds</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setStats({ stayPlays: 0, stayWins: 0, switchPlays: 0, switchWins: 0 });
                lightTap();
              }}
              className="py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-semibold"
            >
              Clear Statistics
            </button>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
};
