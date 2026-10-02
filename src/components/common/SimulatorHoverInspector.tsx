import React, { useState, useEffect, useRef } from 'react';
import { Crosshair, Eye, EyeOff, Sparkles, Compass, Lightbulb, X } from 'lucide-react';
import { SimulatorId } from '../../types/simulators';
import { getSimulatorGuide } from '../../data/simulatorStepsData';
import { InlineMath } from './MathFormula';
import { useHaptics } from '../../hooks/useHaptics';
import { useSound } from './SoundManager';
import { useSimulatorStore } from '../../store/useSimulatorStore';

interface SimulatorHoverInspectorProps {
  simulatorId: SimulatorId;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export const SimulatorHoverInspector: React.FC<SimulatorHoverInspectorProps> = ({
  simulatorId,
  containerRef,
}) => {
  const { isZenMode } = useSimulatorStore();
  const { lightTap } = useHaptics();
  const { playClick } = useSound();

  const [isInspectorEnabled, setIsInspectorEnabled] = useState(true);
  const [cursorPos, setCursorPos] = useState<{ clientX: number; clientY: number } | null>(null);
  const [mathPos, setMathPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [relativePos, setRelativePos] = useState<{ px: number; py: number }>({ px: 0, py: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const hideTimerRef = useRef<number | null>(null);

  const guideData = getSimulatorGuide(simulatorId);
  const { inspectorConfig } = guideData;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handlePointerMove = (e: PointerEvent) => {
      if (!isInspectorEnabled || isZenMode) return;

      const rect = container.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;

      if (px < 0 || px > rect.width || py < 0 || py > rect.height) {
        setIsHovering(false);
        return;
      }

      setIsHovering(true);
      setCursorPos({ clientX: e.clientX, clientY: e.clientY });
      setRelativePos({ px, py });

      // Convert pixel position to math coordinates
      const originXRatio = inspectorConfig.originXRatio ?? 0.5;
      const originYRatio = inspectorConfig.originYRatio ?? 0.5;
      const scaleRangeX = inspectorConfig.scaleRangeX ?? 20;
      const scaleRangeY = inspectorConfig.scaleRangeY ?? 20;

      const originX = rect.width * originXRatio;
      const originY = rect.height * originYRatio;
      const scaleX = rect.width / scaleRangeX;
      const scaleY = rect.height / scaleRangeY;

      const mx = (px - originX) / scaleX;
      const my = (originY - py) / scaleY;

      setMathPos({ x: mx, y: my });

      if (hideTimerRef.current) {
        window.clearTimeout(hideTimerRef.current);
      }
      hideTimerRef.current = window.setTimeout(() => {
        setIsHovering(false);
      }, 4000);
    };

    const handlePointerLeave = () => {
      setIsHovering(false);
      if (hideTimerRef.current) {
        window.clearTimeout(hideTimerRef.current);
      }
    };

    container.addEventListener('pointermove', handlePointerMove, { passive: true });
    container.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerleave', handlePointerLeave);
      if (hideTimerRef.current) {
        window.clearTimeout(hideTimerRef.current);
      }
    };
  }, [containerRef, isInspectorEnabled, isZenMode, inspectorConfig]);

  if (isZenMode) return null;

  const insight = inspectorConfig.customInsight
    ? inspectorConfig.customInsight(mathPos.x, mathPos.y)
    : {
        zone: mathPos.x >= 0 && mathPos.y >= 0 ? '\\text{Quadrant I: } x \\ge 0, y \\ge 0' : mathPos.x < 0 && mathPos.y >= 0 ? '\\text{Quadrant II: } x < 0, y \\ge 0' : mathPos.x < 0 && mathPos.y < 0 ? '\\text{Quadrant III: } x < 0, y < 0' : '\\text{Quadrant IV: } x \\ge 0, y < 0',
        valueLatex: `(x, y) = (${mathPos.x.toFixed(2)}, ${mathPos.y.toFixed(2)}), \\quad r = ${Math.hypot(mathPos.x, mathPos.y).toFixed(2)}`,
        formulaLatex: 'P = (x, y), \\quad r = \\sqrt{x^2 + y^2}',
        tipText: 'Hover across the canvas to inspect coordinates, quadrants, and active formulas in pure mathematical language!',
      };

  // Clamped positioning for HUD card so it never overflows container edges
  const containerRect = containerRef.current?.getBoundingClientRect();
  const cardWidth = 340;
  const cardHeight = 165;

  let leftPos = relativePos.px + 24;
  let topPos = relativePos.py + 24;

  if (containerRect) {
    if (leftPos + cardWidth > containerRect.width - 20) {
      leftPos = relativePos.px - cardWidth - 24;
    }
    if (topPos + cardHeight > containerRect.height - 24) {
      topPos = relativePos.py - cardHeight - 24;
    }
    // Prevent clipping off top or left
    leftPos = Math.max(14, leftPos);
    topPos = Math.max(14, topPos);
  }

  return (
    <>
      {/* Sleek Floating Inspector Toggle Button (Pinned to Top-Right of Simulator Stage) */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 flex items-center gap-2 select-none pointer-events-auto">
        <button
          type="button"
          onClick={() => {
            lightTap();
            playClick();
            setIsInspectorEnabled(!isInspectorEnabled);
          }}
          className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 backdrop-blur-xl border shadow-xl transition-all active:scale-95 cursor-pointer ${
            isInspectorEnabled
              ? 'bg-cyan-500/25 border-cyan-400/60 text-cyan-200 hover:bg-cyan-500/35 shadow-cyan-500/20'
              : 'bg-slate-900/90 border-slate-700 text-slate-300 hover:text-white'
          }`}
          title={isInspectorEnabled ? 'Click to disable hover math inspector' : 'Click to enable live hover math inspector'}
          aria-label="Toggle hover inspector"
        >
          <Crosshair className={`w-4 h-4 ${isInspectorEnabled ? 'text-cyan-300 animate-pulse' : 'text-slate-400'}`} />
          <span>{isInspectorEnabled ? 'Math Inspector ON' : 'Math Inspector OFF'}</span>
        </button>
      </div>

      {/* Crosshairs & Floating Math Card (Active on Hover) */}
      {isInspectorEnabled && isHovering && containerRect && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-20">
          {/* Horizontal Laser Line */}
          <div
            className="absolute left-0 right-0 border-t border-cyan-400/40 transition-all duration-75 pointer-events-none"
            style={{ top: `${relativePos.py}px` }}
          />

          {/* Vertical Laser Line */}
          <div
            className="absolute top-0 bottom-0 border-l border-cyan-400/40 transition-all duration-75 pointer-events-none"
            style={{ left: `${relativePos.px}px` }}
          />

          {/* Glowing Reticle Bullseye at Cursor */}
          <div
            className="absolute w-8 h-8 -ml-4 -mt-4 rounded-full border-2 border-cyan-400 flex items-center justify-center animate-ping pointer-events-none opacity-30"
            style={{ left: `${relativePos.px}px`, top: `${relativePos.py}px` }}
          />
          <div
            className="absolute w-2.5 h-2.5 -ml-1.25 -mt-1.25 rounded-full bg-cyan-300 shadow-lg shadow-cyan-400 pointer-events-none"
            style={{ left: `${relativePos.px}px`, top: `${relativePos.py}px` }}
          />

          {/* Horizontal Axis Y-Value Pill Tag (Left Edge) */}
          <div
            className="absolute left-1.5 px-2 py-1 rounded-md bg-slate-900/95 border border-cyan-500/60 text-xs font-mono font-bold text-cyan-200 pointer-events-none shadow-xl"
            style={{ top: `${relativePos.py - 12}px` }}
          >
            <InlineMath math={`y = ${mathPos.y.toFixed(2)}`} />
          </div>

          {/* Vertical Axis X-Value Pill Tag (Top Edge) */}
          <div
            className="absolute top-1.5 px-2 py-1 rounded-md bg-slate-900/95 border border-cyan-500/60 text-xs font-mono font-bold text-cyan-200 pointer-events-none shadow-xl"
            style={{ left: `${relativePos.px - 24}px` }}
          >
            <InlineMath math={`x = ${mathPos.x.toFixed(2)}`} />
          </div>

          {/* Floating High-Tech Glassmorphic Math HUD Card */}
          <div
            className="absolute w-[330px] sm:w-[360px] bg-slate-900/98 backdrop-blur-2xl border border-cyan-400/60 rounded-2xl p-3.5 shadow-2xl space-y-2 text-sm animate-in fade-in zoom-in-95 duration-100 pointer-events-none select-none"
            style={{ left: `${leftPos}px`, top: `${topPos}px` }}
          >
            {/* Header: Zone & Live Coordinate in Pure Math */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-cyan-400" />
                <InlineMath math={insight.zone} />
              </span>
              <span className="font-mono text-xs font-bold text-emerald-300 bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-600/50">
                <InlineMath math={`(${mathPos.x.toFixed(2)}, ${mathPos.y.toFixed(2)})`} />
              </span>
            </div>

            {/* Live Evaluated Metric Text in Pure KaTeX */}
            <div className="px-2.5 py-1.5 rounded-xl bg-slate-950/90 border border-slate-800 text-sm font-semibold text-slate-100 flex items-center justify-between">
              <InlineMath math={insight.valueLatex} />
            </div>

            {/* Formula Preview in Pure KaTeX */}
            {insight.formulaLatex && (
              <div className="px-3 py-1.5 rounded-xl bg-cyan-950/50 border border-cyan-700/60 font-mono text-sm text-cyan-200 flex items-center justify-between">
                <InlineMath math={insight.formulaLatex} />
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 ml-2" />
              </div>
            )}

            {/* Pedagogical Micro-Tip with pure math syntax */}
            <div className="text-xs leading-relaxed text-slate-300 flex items-start gap-1.5 pt-0.5">
              <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-slate-200">
                <InlineMath math={insight.tipText.replace(/\$([^$]+)\$/g, '$1')} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
