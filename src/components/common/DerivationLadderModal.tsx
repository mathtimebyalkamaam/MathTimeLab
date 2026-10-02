import React from 'react';
import { 
  GitFork, 
  X, 
  Sparkles, 
  GraduationCap, 
  Lightbulb, 
  CheckCircle2, 
  Trophy 
} from 'lucide-react';
import { useSimulatorStore } from '../../store/useSimulatorStore';
import { SIMULATORS } from '../../data/simulators';
import { InteractiveDerivationLadder } from './InteractiveDerivationLadder';
import { useHaptics } from '../../hooks/useHaptics';
import { useSound } from './SoundManager';

export const DerivationLadderModal: React.FC = () => {
  const { 
    isDerivationLadderModalOpen, 
    closeDerivationLadderModal, 
    activeSimulatorId,
    updateDroneParams,
    updateCatapultParams,
    updateUnitCircleParams,
    updateCalculusParams,
  } = useSimulatorStore();

  const { lightTap } = useHaptics();
  const { playClick, playChime } = useSound();

  if (!isDerivationLadderModalOpen) return null;

  const currentSim = SIMULATORS.find((s) => s.id === activeSimulatorId) || SIMULATORS[0];
  const ladder = currentSim?.derivationLadder;

  const handleApplyVisualPreset = (stepIndex: number) => {
    lightTap();
    playClick();

    if (activeSimulatorId === 'drone-navigator') {
      if (stepIndex === 0) updateDroneParams({ droneX: 6, droneY: 8 });
      else if (stepIndex === 1) updateDroneParams({ droneX: 3, droneY: 4 });
      else if (stepIndex === 2) updateDroneParams({ droneX: 5, droneY: 12 });
      else updateDroneParams({ droneX: 8, droneY: 6 });
    } else if (activeSimulatorId === 'catapult-siege') {
      if (stepIndex === 3) updateCatapultParams({ angleDeg: 45, tension: 75 });
      else updateCatapultParams({ angleDeg: 30 + stepIndex * 15 });
    } else if (activeSimulatorId === 'unit-circle') {
      const angles = [30, 45, 60, 90];
      updateUnitCircleParams({ angleDeg: angles[stepIndex % 4] });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto no-scrollbar rounded-2xl bg-slate-900 border border-purple-500/40 shadow-2xl p-4 sm:p-6 text-slate-100 animate-scale-up">
        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            lightTap();
            closeDerivationLadderModal();
          }}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          title="Close Derivation Ladder"
        >
          <X className="w-5 h-5" />
        </button>

        {ladder ? (
          <InteractiveDerivationLadder
            ladder={ladder}
            onApplyVisualPreset={handleApplyVisualPreset}
          />
        ) : (
          <div className="text-center py-8 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 mx-auto">
              <GitFork className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-100">
                Derivation Ladder in Progress
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                The interactive proof ladder for {currentSim.title} is being calibrated with first-principles steps. Switch to <strong className="text-cyan-300">Drone Navigator</strong>, <strong className="text-cyan-300">Catapult Siege</strong>, or <strong className="text-cyan-300">Unit Circle</strong> to experience completed derivation ladders!
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                lightTap();
                closeDerivationLadderModal();
              }}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-900/40 transition-all cursor-pointer"
            >
              Back to Simulator
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
