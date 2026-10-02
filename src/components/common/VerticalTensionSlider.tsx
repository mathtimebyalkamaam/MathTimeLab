import React, { useRef, useState, useCallback } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { useHaptics } from '../../hooks/useHaptics';
import { useSound } from './SoundManager';

interface VerticalTensionSliderProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (val: number) => void;
  label?: string;
  height?: number;
}

export const VerticalTensionSlider: React.FC<VerticalTensionSliderProps> = ({
  value,
  min,
  max,
  step = 1,
  onChange,
  label = 'Tension (v)',
  height = 160,
}) => {
  const barRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { lightTap } = useHaptics();
  const { playClick } = useSound();
  const lastValRef = useRef(value);

  const pct = Math.max(0, Math.min(1, (value - min) / (max - min)));

  const handlePointerCalc = useCallback(
    (clientY: number) => {
      const bar = barRef.current;
      if (!bar) return;
      const rect = bar.getBoundingClientRect();
      // Invert: top = 1 (max tension), bottom = 0 (min tension)
      const relY = Math.max(0, Math.min(1, 1 - (clientY - rect.top) / rect.height));
      const rawVal = min + relY * (max - min);
      const stepped = Math.round(rawVal / step) * step;
      const clamped = Math.max(min, Math.min(max, stepped));
      if (clamped !== lastValRef.current) {
        lastValRef.current = clamped;
        lightTap();
        playClick(0.6 + (clamped / max) * 0.9);
      }
      onChange(clamped);
    },
    [min, max, step, onChange, lightTap, playClick]
  );

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    (e.target as Element).setPointerCapture(e.pointerId);
    handlePointerCalc(e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    handlePointerCalc(e.clientY);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
  };

  return (
    <div className="flex flex-col items-center select-none">
      <div className="flex items-center justify-between w-full max-w-[120px] mb-1">
        <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wide">
          {label}
        </span>
        <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/40 tabular-nums">
          {value}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <div
          ref={barRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          style={{ height: `${height}px` }}
          className="relative w-8 rounded-full bg-slate-900 border border-slate-700/80 cursor-pointer flex flex-col justify-end p-1 touch-none"
        >
          {/* Tension Fill Column */}
          <div
            style={{ height: `${pct * 100}%` }}
            className="w-full rounded-full bg-gradient-to-t from-cyan-600 via-sky-400 to-emerald-400 shadow-md shadow-cyan-500/30 transition-all duration-75"
          />

          {/* Draggable Knob Handle */}
          <div
            style={{ bottom: `calc(${pct * 100}% - 14px)` }}
            className="absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-cyan-400 border-2 border-slate-950 shadow-lg shadow-cyan-400/50 flex items-center justify-center transition-transform active:scale-110 pointer-events-none"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-slate-950" />
          </div>
        </div>

        {/* Increment / Decrement Buttons for Precision Mobile Touch */}
        <div className="flex flex-col gap-1.5 justify-between" style={{ height: `${height}px` }}>
          <button
            type="button"
            onClick={() => onChange(Math.min(max, value + step))}
            className="w-10 h-10 rounded-xl bg-slate-800/90 text-slate-300 active:bg-cyan-600 flex items-center justify-center border border-slate-700 touch-manipulation"
            aria-label="Increase tension"
          >
            <ArrowUp className="w-4 h-4" />
          </button>

          <span className="text-[10px] text-center font-mono text-slate-400">
            Hypotenuse
          </span>

          <button
            type="button"
            onClick={() => onChange(Math.max(min, value - step))}
            className="w-10 h-10 rounded-xl bg-slate-800/90 text-slate-300 active:bg-cyan-600 flex items-center justify-center border border-slate-700 touch-manipulation"
            aria-label="Decrease tension"
          >
            <ArrowDown className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
