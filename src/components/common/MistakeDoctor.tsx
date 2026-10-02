import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  Sparkles, 
  RotateCcw, 
  ChevronDown, 
  ChevronUp, 
  X,
  Stethoscope,
  Award
} from 'lucide-react';
import { useSimulatorStore } from '../../store/useSimulatorStore';
import { useHaptics } from '../../hooks/useHaptics';
import { useSound } from './SoundManager';
import { MathText } from './MathFormula';

export interface MistakeDoctorProps {
  /** Condition that triggers the doctor diagnosis (e.g. hasHitWall, breachedAirspace, D < 0) */
  isActive: boolean;
  /** Short diagnostic title, e.g. "Catapult Wall Strike" or "Airspace Violation" */
  blunderTitle: string;
  /** Why this happened in plain English */
  whatHappened: string;
  /** The typical board exam trap / misconception students fall into */
  examTrap: string;
  /** Alka Ma'am's conceptual prescription / rule */
  prescription: string;
  /** 1-click button to apply the correct fix to simulator parameters */
  onApplyRemedy?: () => void;
  /** Text for the remedy button */
  remedyLabel?: string;
  /** Callback on dismiss */
  onDismiss?: () => void;
}

export const MistakeDoctor: React.FC<MistakeDoctorProps> = ({
  isActive,
  blunderTitle,
  whatHappened,
  examTrap,
  prescription,
  onApplyRemedy,
  remedyLabel = "Apply Alka Ma'am's Fix",
  onDismiss,
}) => {
  const { isZenMode, setIsAuthorModalOpen } = useSimulatorStore();
  const { lightTap, selectionTick } = useHaptics();
  const { playClick, playChime } = useSound();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);

  // Reset dismissal when isActive turns false and comes back
  React.useEffect(() => {
    if (!isActive) {
      setIsDismissed(false);
    }
  }, [isActive]);

  if (!isActive || isDismissed || isZenMode) return null;

  return (
    <div className="absolute bottom-16 sm:bottom-20 right-3 sm:right-4 z-30 max-w-[300px] sm:max-w-[380px] select-none pointer-events-auto animate-fade-in shadow-2xl">
      <div className="rounded-2xl bg-slate-950/95 backdrop-blur-xl border border-rose-500/40 text-xs sm:text-sm overflow-hidden shadow-rose-950/30 shadow-lg">
        {/* Header Bar */}
        <div 
          onClick={() => {
            lightTap();
            setIsExpanded(!isExpanded);
          }}
          className="p-2.5 sm:p-3 bg-gradient-to-r from-rose-950/70 via-slate-900 to-slate-900 border-b border-rose-500/30 flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-2 truncate">
            <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/40 shrink-0">
              <Stethoscope className="w-4 h-4 text-rose-400" />
            </div>
            <div className="truncate">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] sm:text-[11px] font-bold text-rose-400 uppercase tracking-wider">
                  Mistake Doctor
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    lightTap();
                    setIsAuthorModalOpen(true);
                  }}
                  className="text-[10px] sm:text-[11px] text-amber-300 hover:text-amber-200 flex items-center gap-0.5"
                >
                  <Award className="w-3 h-3 text-amber-400" />
                  <span>Alka Ma'am</span>
                </button>
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                {blunderTitle}
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0 ml-1">
            <button
              type="button"
              className="p-1 text-slate-400 hover:text-white"
              aria-label={isExpanded ? 'Collapse Doctor' : 'Expand Doctor'}
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                lightTap();
                setIsDismissed(true);
                onDismiss?.();
              }}
              className="p-1 text-slate-500 hover:text-slate-300"
              title="Dismiss diagnosis"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Diagnosis Body */}
        {isExpanded && (
          <div className="p-3 space-y-2.5 bg-slate-950/85">
            {/* What Happened */}
            <div className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-rose-950/20 p-2.5 rounded-xl border border-rose-900/30">
              <span className="text-rose-400 font-bold block text-[11px] uppercase tracking-wider mb-1">
                What Happened:
              </span>
              <div>
                <MathText text={whatHappened} />
              </div>
            </div>

            {/* Exam Trap */}
            <div className="text-xs sm:text-sm text-amber-100 leading-relaxed bg-amber-950/20 p-2.5 rounded-xl border border-amber-900/30">
              <span className="text-amber-400 font-bold block text-[11px] uppercase tracking-wider mb-1">
                ⚠️ Common Exam Trap:
              </span>
              <div>
                <MathText text={examTrap} />
              </div>
            </div>

            {/* Doctor's Prescription */}
            <div className="text-xs sm:text-sm text-cyan-200 leading-relaxed bg-cyan-950/20 p-2.5 rounded-xl border border-cyan-900/30">
              <span className="text-cyan-400 font-bold block text-[11px] uppercase tracking-wider mb-1">
                💊 Conceptual Prescription:
              </span>
              <div>
                <MathText text={prescription} />
              </div>
            </div>

            {/* 1-Tap Remedy Action */}
            {onApplyRemedy && (
              <button
                type="button"
                onClick={() => {
                  selectionTick();
                  playChime();
                  onApplyRemedy();
                  setIsDismissed(true);
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-emerald-950 flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{remedyLabel}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
