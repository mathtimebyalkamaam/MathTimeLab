import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Sliders, 
  Sparkles, 
  RotateCcw, 
  HelpCircle, 
  Zap,
  Target,
  ArrowLeftRight
} from 'lucide-react';
import { useSound } from './SoundManager';
import { useHaptics } from '../../hooks/useHaptics';
import { InlineMath, BlockMath } from './MathFormula';

export interface ScrubbableParam {
  id: string;
  symbol: string;
  name: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  color?: string; // e.g. text-cyan-400, text-emerald-400, text-amber-400
  landmarks?: { value: number; label: string }[];
  precision?: number;
}

interface ScrubbableFormulaProps {
  formulaPrefix?: string;
  formulaSuffix?: string;
  equationLatexTemplate: (params: Record<string, number>) => string;
  parameters: ScrubbableParam[];
  onParameterChange: (id: string, value: number) => void;
  onReset?: () => void;
  className?: string;
  title?: string;
  compact?: boolean;
}

export const ScrubbableFormula: React.FC<ScrubbableFormulaProps> = ({
  equationLatexTemplate,
  parameters,
  onParameterChange,
  onReset,
  className = '',
  title = 'Active Two-Way Formula (Scrub directly in math)',
  compact = false,
}) => {
  const { playClick, playHarmonicSnap, playResonance } = useSound();
  const { lightTap, selectionTick, snapTick } = useHaptics();

  const [activeParamId, setActiveParamId] = useState<string | null>(null);
  const [editingParamId, setEditingParamId] = useState<string | null>(null);
  const [tempEditValue, setTempEditValue] = useState<string>('');

  const dragStartXRef = useRef<number>(0);
  const dragStartValueRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const lastSnapRef = useRef<number | null>(null);

  // Map param id to value
  const paramMap = parameters.reduce<Record<string, number>>((acc, p) => {
    acc[p.id] = p.value;
    return acc;
  }, {});

  const handlePointerDown = (param: ScrubbableParam, e: React.PointerEvent) => {
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    dragStartValueRef.current = param.value;
    setActiveParamId(param.id);
    lastSnapRef.current = null;
    lightTap();
  };

  const handlePointerMove = useCallback((param: ScrubbableParam, e: React.PointerEvent) => {
    if (!isDraggingRef.current || activeParamId !== param.id) return;

    const deltaX = e.clientX - dragStartXRef.current;
    // Scale delta according to step and sensitivity (e.g. 5px per step)
    const stepsDelta = Math.round(deltaX / 6);
    let nextValue = dragStartValueRef.current + stepsDelta * param.step;

    // Clamp
    nextValue = Math.max(param.min, Math.min(param.max, nextValue));
    const precision = param.precision ?? (param.step < 0.1 ? 2 : param.step < 1 ? 1 : 0);
    nextValue = Number(nextValue.toFixed(precision));

    // Check for landmark snapping
    if (param.landmarks && param.landmarks.length > 0) {
      const snapThreshold = param.step * 1.5;
      for (const lm of param.landmarks) {
        if (Math.abs(nextValue - lm.value) <= snapThreshold) {
          nextValue = lm.value;
          if (lastSnapRef.current !== lm.value) {
            lastSnapRef.current = lm.value;
            playHarmonicSnap();
            snapTick();
          }
          break;
        }
      }
    }

    if (nextValue !== param.value) {
      onParameterChange(param.id, nextValue);
      selectionTick();
      // Modulate pitch based on parameter percentage (0.6x to 1.8x)
      const pct = (nextValue - param.min) / Math.max(0.001, param.max - param.min);
      playClick(0.7 + pct * 0.9);
    }
  }, [activeParamId, onParameterChange, playClick, playHarmonicSnap, selectionTick, snapTick]);

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDraggingRef.current) {
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
      isDraggingRef.current = false;
      setActiveParamId(null);
    }
  };

  const startDirectEdit = (param: ScrubbableParam) => {
    setEditingParamId(param.id);
    setTempEditValue(String(param.value));
  };

  const commitDirectEdit = (param: ScrubbableParam) => {
    const parsed = parseFloat(tempEditValue);
    if (!isNaN(parsed)) {
      const clamped = Math.max(param.min, Math.min(param.max, parsed));
      const precision = param.precision ?? (param.step < 0.1 ? 2 : param.step < 1 ? 1 : 0);
      const rounded = Number(clamped.toFixed(precision));
      onParameterChange(param.id, rounded);
      playResonance();
    }
    setEditingParamId(null);
  };

  const generatedLatex = equationLatexTemplate(paramMap);

  return (
    <div className={`p-3.5 rounded-2xl bg-slate-900/95 border border-cyan-500/30 text-xs sm:text-sm shadow-lg backdrop-blur-md ${className}`}>
      {/* Header with Title and Reset */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
            <ArrowLeftRight className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <span className="font-bold text-xs sm:text-sm text-cyan-300 uppercase tracking-wider block">
              {title}
            </span>
            <span className="text-xs text-slate-400">
              Drag symbols horizontal or click to scrub values with zero split-attention
            </span>
          </div>
        </div>

        {onReset && (
          <button
            type="button"
            onClick={() => {
              lightTap();
              playResonance();
              onReset();
            }}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
            title="Reset formula parameters"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* KaTeX Central Formula Display */}
      <div className="my-2.5 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-center flex flex-col items-center justify-center overflow-x-auto no-scrollbar shadow-inner">
        <BlockMath math={generatedLatex} className="my-0 text-base sm:text-lg text-cyan-300 font-semibold" />
      </div>

      {/* Scrubbable Variables Array */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
        {parameters.map((param) => {
          const isActive = activeParamId === param.id;
          const isEditing = editingParamId === param.id;
          const pct = Math.round(((param.value - param.min) / (param.max - param.min)) * 100);

          // Find active landmark if any
          const activeLandmark = param.landmarks?.find(
            (lm) => Math.abs(lm.value - param.value) < param.step * 0.5
          );

          return (
            <div
              key={param.id}
              className={`p-2 rounded-xl border transition-all select-none touch-none ${
                isActive
                  ? 'bg-cyan-950/60 border-cyan-400 shadow-md ring-1 ring-cyan-400/50 scale-[1.02]'
                  : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-xs sm:text-sm mb-1">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <span className={`px-2 py-0.5 rounded bg-slate-800 border border-slate-700 ${param.color || 'text-cyan-400'}`}>
                    <InlineMath math={param.symbol} />
                  </span>
                  <span className="text-slate-300 truncate max-w-[120px] text-xs sm:text-sm">{param.name}</span>
                </span>

                {isEditing ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={tempEditValue}
                      onChange={(e) => setTempEditValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') commitDirectEdit(param);
                        if (e.key === 'Escape') setEditingParamId(null);
                      }}
                      onBlur={() => commitDirectEdit(param)}
                      className="w-14 px-1 py-0.5 rounded bg-slate-900 border border-cyan-400 text-cyan-300 font-mono text-[11px] text-right focus:outline-none"
                      autoFocus
                    />
                    <span className="text-[10px] text-slate-500">{param.unit}</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => startDirectEdit(param)}
                    className="font-mono font-bold text-xs text-white hover:text-cyan-300 px-1.5 py-0.5 rounded hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-0.5"
                    title="Click to type exact value"
                  >
                    <span>{param.value}</span>
                    {param.unit && <span className="text-[10px] font-normal text-slate-400">{param.unit}</span>}
                  </button>
                )}
              </div>

              {/* Scrubbing Touch Surface Slider Bar */}
              <div
                className="relative h-6 rounded-lg bg-slate-900 border border-slate-800 flex items-center px-2 cursor-ew-resize overflow-hidden group"
                onPointerDown={(e) => handlePointerDown(param, e)}
                onPointerMove={(e) => handlePointerMove(param, e)}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                title="Drag horizontally to scrub value"
              >
                {/* Visual fill track */}
                <div
                  className="absolute inset-y-0 left-0 bg-cyan-500/20 group-hover:bg-cyan-500/30 transition-colors pointer-events-none"
                  style={{ width: `${pct}%` }}
                />

                {/* Subtle horizontal scrub guidelines */}
                <div className="absolute inset-x-0 flex items-center justify-between px-3 opacity-20 pointer-events-none text-[8px] font-mono text-cyan-300">
                  <span>◀ DRAG</span>
                  <span>SCRUB ▶</span>
                </div>

                {/* Scrubber thumb needle */}
                <div
                  className={`absolute top-0 bottom-0 w-1.5 rounded-full transition-transform pointer-events-none ${
                    isActive ? 'bg-cyan-400 shadow-glow' : 'bg-cyan-500/70'
                  }`}
                  style={{ left: `calc(${pct}% - 3px)` }}
                />

                {/* Landmark indicator dots */}
                {param.landmarks?.map((lm) => {
                  const lmPct = ((lm.value - param.min) / (param.max - param.min)) * 100;
                  return (
                    <div
                      key={lm.value}
                      className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-amber-400/80 pointer-events-none"
                      style={{ left: `calc(${lmPct}% - 3px)` }}
                      title={`Snap: ${lm.label} (${lm.value})`}
                    />
                  );
                })}
              </div>

              {/* Landmark / State Badge */}
              <div className="flex items-center justify-between text-[10px] mt-1 text-slate-500">
                <span>{param.min}</span>
                {activeLandmark ? (
                  <span className="text-amber-400 font-semibold animate-pulse flex items-center gap-0.5">
                    <Target className="w-2.5 h-2.5" />
                    <span>{activeLandmark.label}</span>
                  </span>
                ) : (
                  <span>{param.max}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
