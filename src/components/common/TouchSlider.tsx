import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { useHaptics } from '../../hooks/useHaptics';
import { useSound } from './SoundManager';
import { InlineMath, MathText } from './MathFormula';

interface TouchSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (val: number) => void;
  accentColor?: string;
  formatValue?: (val: number) => string;
  compact?: boolean;
  /** Pedagogical dynamic micro-annotation explaining cause-and-effect */
  causeEffectHint?: string | ((val: number) => string);
  /** Algebraic variable or formula term associated with this slider (e.g., 'r²', 'sin(2θ)', 'Δx') */
  formulaTerm?: string;
}

export const TouchSlider: React.FC<TouchSliderProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange,
  formatValue,
  causeEffectHint,
  formulaTerm,
}) => {
  const { lightTap } = useHaptics();
  const { playClick } = useSound();
  const lastTickTime = useRef(0);
  const [isInteracting, setIsInteracting] = useState(false);

  // References for press-and-hold auto repeat
  const repeatTimerRef = useRef<number | null>(null);
  const repeatIntervalRef = useRef<number | null>(null);
  const valueRef = useRef(value);
  valueRef.current = value;
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  // Compute exact decimal precision to prevent IEEE-754 float drift (e.g. 0.2500000000000001)
  const precision = useMemo(() => {
    const s = step.toString();
    if (s.includes('.')) {
      return s.split('.')[1].length;
    }
    return 0;
  }, [step]);

  const triggerFeedback = (val: number) => {
    const now = performance.now();
    // Throttle sound/haptic to prevent audio clutter during rapid drag
    if (now - lastTickTime.current > 35) {
      lastTickTime.current = now;
      lightTap();
      // Scale click pitch based on normalized value
      const normalized = max !== min ? (val - min) / (max - min) : 0.5;
      playClick(0.7 + normalized * 0.8);
    }
  };

  const stepValue = (direction: 'dec' | 'inc') => {
    const current = valueRef.current;
    let next: number;
    if (direction === 'dec') {
      next = Math.max(min, Number((current - step).toFixed(precision)));
    } else {
      next = Math.min(max, Number((current + step).toFixed(precision)));
    }
    if (next !== current) {
      triggerFeedback(next);
      onChangeRef.current(next);
    }
  };

  const stopRepeating = () => {
    if (repeatTimerRef.current !== null) {
      clearTimeout(repeatTimerRef.current);
      repeatTimerRef.current = null;
    }
    if (repeatIntervalRef.current !== null) {
      clearInterval(repeatIntervalRef.current);
      repeatIntervalRef.current = null;
    }
    setIsInteracting(false);
  };

  const startRepeating = (direction: 'dec' | 'inc', e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsInteracting(true);
    // 1. Immediate step on press
    stepValue(direction);

    // Clear previous timers if any
    if (repeatTimerRef.current !== null) clearTimeout(repeatTimerRef.current);
    if (repeatIntervalRef.current !== null) clearInterval(repeatIntervalRef.current);

    // 2. Auto-repeat after 250ms initial hold delay, then rapid 40ms step
    repeatTimerRef.current = window.setTimeout(() => {
      repeatIntervalRef.current = window.setInterval(() => {
        stepValue(direction);
      }, 40);
    }, 250);
  };

  useEffect(() => {
    return () => {
      stopRepeating();
    };
  }, []);

  const displayVal = formatValue ? formatValue(value) : `${value}${unit ? ` ${unit}` : ''}`;
  
  // Calculate percentage for filled progress track
  const percent = max > min ? Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100)) : 50;

  const hintText = typeof causeEffectHint === 'function' ? causeEffectHint(value) : causeEffectHint;

  return (
    <div className="flex flex-col py-1.5 select-none w-full group">
      {/* Row 1: Header with Label, Formula badge, and Bold Value Readout */}
      <div className="flex items-center justify-between gap-2 w-full mb-1">
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          <span 
            className="text-xs sm:text-sm font-semibold text-slate-200 truncate tracking-tight"
            title={label}
          >
            {label}
          </span>
          {formulaTerm && (
            <span 
              className={`text-[11px] px-1.5 py-0.2 rounded border transition-colors shrink-0 ${
                isInteracting 
                  ? 'bg-amber-500/25 border-amber-500/60 text-amber-300 font-bold' 
                  : 'bg-slate-800 border-slate-700 text-cyan-300'
              }`}
              title={`Mathematical term: ${formulaTerm}`}
            >
              <InlineMath math={formulaTerm} />
            </span>
          )}
        </div>

        {/* Monospace Precise Value Display (Top Right) */}
        <span className={`font-mono text-xs sm:text-sm tabular-nums font-bold text-right shrink-0 transition-colors ${
          isInteracting ? 'text-amber-300 font-extrabold' : 'text-cyan-300'
        }`}>
          {displayVal}
        </span>
      </div>

      {/* Row 2: Full-Width Scroller & Steppers: [-] Button, Range Slider, [+] Button */}
      <div className="flex items-center gap-1.5 sm:gap-2 w-full">
        {/* Large Ergonomic Stepper Minus */}
        <button
          type="button"
          onPointerDown={(e) => startRepeating('dec', e)}
          onPointerUp={stopRepeating}
          onPointerLeave={stopRepeating}
          onPointerCancel={stopRepeating}
          onContextMenu={(e) => e.preventDefault()}
          aria-label={`Decrease ${label}`}
          title={`Decrease ${label} (Hold for fast scroll)`}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-cyan-500/30 active:border-cyan-400 active:scale-95 text-slate-200 hover:text-white flex items-center justify-center shrink-0 touch-manipulation cursor-pointer border border-slate-700 hover:border-slate-500 transition-all shadow-md select-none"
        >
          <Minus className="w-4 h-4 stroke-[2.5]" />
        </button>

        {/* Sleek Touch Range Scrub Slider Track (Fills all available width) */}
        <div 
          className="relative flex-1 flex items-center h-8 sm:h-9 py-1 min-w-[50px]"
          onPointerDown={() => setIsInteracting(true)}
          onPointerUp={() => setIsInteracting(false)}
          onPointerCancel={() => setIsInteracting(false)}
        >
          {/* Custom Track Background with Instant Filled Gradient Accent */}
          <div className="absolute inset-x-0 h-2 sm:h-2.5 bg-slate-800/90 rounded-full overflow-hidden pointer-events-none border border-slate-700/60">
            <div 
              className={`h-full bg-gradient-to-r from-cyan-500 to-teal-400 rounded-full ${isInteracting ? 'transition-none' : 'transition-all duration-75'}`}
              style={{ width: `${percent}%` }}
            />
          </div>
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onFocus={() => setIsInteracting(true)}
            onBlur={() => setIsInteracting(false)}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              const roundedVal = Number(val.toFixed(precision));
              triggerFeedback(roundedVal);
              onChange(roundedVal);
            }}
            className="w-full cursor-pointer accent-cyan-400 opacity-0 relative z-10 h-8 sm:h-9 touch-manipulation"
          />
          {/* Visible glowing thumb handle with zero-lag positioning */}
          <div 
            className={`absolute w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full shadow-lg border-2 pointer-events-none -ml-2 sm:-ml-2.5 ${
              isInteracting 
                ? 'transition-none border-amber-400 ring-4 ring-amber-400/50 scale-125' 
                : 'transition-all duration-75 border-cyan-400 group-hover:scale-110'
            }`}
            style={{ left: `${percent}%` }}
          />
        </div>

        {/* Large Ergonomic Stepper Plus */}
        <button
          type="button"
          onPointerDown={(e) => startRepeating('inc', e)}
          onPointerUp={stopRepeating}
          onPointerLeave={stopRepeating}
          onPointerCancel={stopRepeating}
          onContextMenu={(e) => e.preventDefault()}
          aria-label={`Increase ${label}`}
          title={`Increase ${label} (Hold for fast scroll)`}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-cyan-500/30 active:border-cyan-400 active:scale-95 text-slate-200 hover:text-white flex items-center justify-center shrink-0 touch-manipulation cursor-pointer border border-slate-700 hover:border-slate-500 transition-all shadow-md select-none"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>

      {/* Row 3: Dynamic Cause-and-Effect Pedagogical Micro-Annotation */}
      {hintText && (
        <div className={`mt-1 flex items-start gap-1.5 text-xs leading-relaxed transition-all duration-200 rounded-lg px-2 py-1 ${
          isInteracting 
            ? 'text-amber-100 bg-amber-950/60 border border-amber-500/50 shadow-sm' 
            : 'text-slate-300 group-hover:text-cyan-100 group-hover:bg-slate-900/90 group-hover:border group-hover:border-cyan-500/40'
        }`}>
          <span className={`shrink-0 font-bold text-[10px] sm:text-xs uppercase tracking-wider ${
            isInteracting ? 'text-amber-400' : 'text-slate-400 group-hover:text-cyan-300'
          }`}>
            {isInteracting ? '⚡ Effect:' : '💡 Concept:'}
          </span>
          <span className="truncate group-hover:whitespace-normal font-sans">
            <MathText text={hintText} />
          </span>
        </div>
      )}
    </div>
  );
};
