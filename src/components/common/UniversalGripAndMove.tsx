import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Hand, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Move, 
  Maximize2,
  Minimize2,
  HelpCircle,
  X
} from 'lucide-react';
import { useHaptics } from '../../hooks/useHaptics';
import { useSound } from './SoundManager';

interface UniversalGripAndMoveProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  simulatorId: string;
}

export const UniversalGripAndMove: React.FC<UniversalGripAndMoveProps> = ({
  containerRef,
  simulatorId,
}) => {
  const { lightTap } = useHaptics();
  const { playClick } = useSound();

  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1.0);
  const [isGripMode, setIsGripMode] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isSpacePressed, setIsSpacePressed] = useState<boolean>(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [showHelpHint, setShowHelpHint] = useState<boolean>(false);

  const dragStartRef = useRef<{ x: number; y: number; startPanX: number; startPanY: number } | null>(null);
  const pinchStartDistRef = useRef<number | null>(null);
  const pinchStartZoomRef = useRef<number>(1.0);

  // Reset pan and zoom when switching simulators
  useEffect(() => {
    setPan({ x: 0, y: 0 });
    setZoom(1.0);
    setIsGripMode(false);
    setIsDragging(false);
  }, [simulatorId]);

  // Apply transform to the mathematical visual elements (canvas and diagram SVGs)
  const applyTransform = useCallback((x: number, y: number, z: number, dragging: boolean) => {
    if (!containerRef.current) return;
    
    // Find all canvas elements and non-Lucide SVG elements inside the simulator
    const targets = containerRef.current.querySelectorAll<HTMLElement>(
      'canvas, svg:not([class*="lucide"]):not([class*="lucide-"])'
    );

    targets.forEach((el) => {
      // Don't transform elements inside modals, walkthrough overlays, or bottom sheets
      if (
        el.closest('.bottom-sheet-container') ||
        el.closest('.simulator-hud-overlay') ||
        el.closest('.simulator-walkthrough-panel') ||
        el.closest('.simulator-instruction-banner') ||
        el.closest('aside') ||
        el.closest('header') ||
        el.closest('nav')
      ) {
        return;
      }

      el.style.transformOrigin = 'center center';
      el.style.transition = dragging ? 'none' : 'transform 0.15s cubic-bezier(0.2, 0.8, 0.2, 1)';
      el.style.transform = `translate3d(${x}px, ${y}px, 0px) scale(${z})`;
    });
  }, [containerRef]);

  // Synchronize CSS transforms on pan or zoom change
  useEffect(() => {
    applyTransform(pan.x, pan.y, zoom, isDragging);
  }, [pan, zoom, isDragging, applyTransform]);

  // Clean up transforms on unmount
  useEffect(() => {
    const container = containerRef.current;
    return () => {
      if (!container) return;
      const targets = container.querySelectorAll<HTMLElement>(
        'canvas, svg:not([class*="lucide"]):not([class*="lucide-"])'
      );
      targets.forEach((el) => {
        el.style.transform = '';
        el.style.transformOrigin = '';
        el.style.transition = '';
      });
    };
  }, [containerRef]);

  // Global Spacebar detector for quick pan shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing inside input/textarea/editable
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }
      if (e.code === 'Space' && !e.repeat) {
        setIsSpacePressed(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsSpacePressed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Pan Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    // Only drag with primary mouse button if in grip mode or space pressed, or with middle mouse button
    const isPrimaryDrag = e.button === 0 && (isGripMode || isSpacePressed);
    const isMiddleDrag = e.button === 1;
    const isSecondaryDrag = e.button === 2 && isGripMode;

    if (!isPrimaryDrag && !isMiddleDrag && !isSecondaryDrag) return;

    e.preventDefault();
    e.stopPropagation();
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}

    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      startPanX: pan.x,
      startPanY: pan.y,
    };
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !dragStartRef.current) return;
    e.preventDefault();
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;

    const newX = Math.round(dragStartRef.current.startPanX + dx);
    const newY = Math.round(dragStartRef.current.startPanY + dy);

    setPan({ x: newX, y: newY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      dragStartRef.current = null;
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  // Touch pinch-to-zoom support
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      pinchStartDistRef.current = dist;
      pinchStartZoomRef.current = zoom;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinchStartDistRef.current !== null) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      const scaleFactor = dist / pinchStartDistRef.current;
      const nextZoom = Math.max(0.4, Math.min(3.0, Number((pinchStartZoomRef.current * scaleFactor).toFixed(2))));
      setZoom(nextZoom);
    }
  };

  const handleTouchEnd = () => {
    pinchStartDistRef.current = null;
  };

  // Wheel zoom support
  const handleWheel = (e: React.WheelEvent) => {
    if (isGripMode || isSpacePressed || e.ctrlKey || e.metaKey) {
      e.preventDefault();
      e.stopPropagation();
      const delta = e.deltaY < 0 ? 0.1 : -0.1;
      setZoom((prev) => Math.max(0.4, Math.min(3.0, Number((prev + delta).toFixed(2)))));
    }
  };

  // Controls Actions
  const handleZoomIn = () => {
    lightTap();
    playClick(1.2);
    setZoom((prev) => Math.min(3.0, Number((prev + 0.15).toFixed(2))));
  };

  const handleZoomOut = () => {
    lightTap();
    playClick(0.9);
    setZoom((prev) => Math.max(0.4, Number((prev - 0.15).toFixed(2))));
  };

  const handleReset = () => {
    lightTap();
    playClick(1.0);
    setPan({ x: 0, y: 0 });
    setZoom(1.0);
  };

  const toggleGrip = () => {
    lightTap();
    playClick(isGripMode ? 0.8 : 1.3);
    setIsGripMode(!isGripMode);
  };

  const hasTransformed = pan.x !== 0 || pan.y !== 0 || zoom !== 1.0;
  const isActivelyGripping = isGripMode || isSpacePressed;

  return (
    <>
      {/* Invisible Interactive Grip Overlay: Active when Grip Mode or Spacebar is engaged */}
      {isActivelyGripping && (
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onWheel={handleWheel}
          onContextMenu={(e) => e.preventDefault()}
          className={`absolute inset-0 z-15 select-none touch-none ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          style={{
            // Give subtle highlight border when in Grip Mode
            boxShadow: isGripMode ? 'inset 0 0 0 2px rgba(6, 182, 212, 0.4)' : 'none',
          }}
          title="Drag anywhere to move the image. Scroll wheel to zoom."
        />
      )}

      {/* Camera Pan Active Floating Indicator & Exit Button */}
      {isGripMode && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-25 flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/95 border border-cyan-400 text-cyan-200 text-xs shadow-2xl backdrop-blur-md animate-fade-in pointer-events-auto">
          <span className="flex items-center gap-1 font-semibold">
            <Move className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
            <span>Camera Pan Active</span>
          </span>
          <span className="text-cyan-400/60">|</span>
          <button
            type="button"
            onClick={toggleGrip}
            className="px-2 py-0.5 rounded-md bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold transition-all cursor-pointer shadow-sm text-[11px]"
          >
            Exit Pan & Move Figure Points
          </button>
        </div>
      )}

      {/* Floating Grip & Move Mission Control HUD */}
      <div 
        className="simulator-hud-overlay absolute top-12 sm:top-14 left-3 sm:left-4 z-20 flex flex-col gap-1.5 select-none pointer-events-auto"
      >
        {isCollapsed ? (
          /* Mini Collapsed Launcher Pill */
          <button
            type="button"
            onClick={() => setIsCollapsed(false)}
            className={`p-2 rounded-xl backdrop-blur-md shadow-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
              isGripMode || hasTransformed
                ? 'bg-cyan-500/25 border-cyan-400 text-cyan-300 ring-2 ring-cyan-400/40'
                : 'bg-slate-900/90 border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
            title="Expand Grip & Move Image controls"
          >
            <Hand className="w-4 h-4" />
            <span className="text-[11px] font-bold">
              {Math.round(zoom * 100)}%
            </span>
          </button>
        ) : (
          /* Full Expanded Ergonomic Pill */
          <div className="flex items-center gap-1 sm:gap-1.5 p-1 sm:p-1.5 rounded-2xl bg-slate-900/95 border border-slate-700/90 shadow-2xl backdrop-blur-xl">
            {/* Grip / Pan Stage Toggle Button */}
            <button
              type="button"
              onClick={toggleGrip}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isGripMode
                  ? 'bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 shadow-lg shadow-cyan-500/25 ring-2 ring-cyan-300'
                  : 'bg-slate-800/90 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700'
              }`}
              title={isGripMode ? 'Click to exit Pan mode and manipulate diagram points' : 'Click to pan the whole camera/viewport (or hold Space to pan anytime)'}
            >
              <Move className={`w-3.5 h-3.5 ${isGripMode ? 'stroke-[2.5]' : ''}`} />
              <span className="hidden sm:inline">
                {isGripMode ? 'Pan Camera ON' : 'Pan Camera'}
              </span>
              <span className="sm:hidden">
                {isGripMode ? 'Pan ON' : 'Pan'}
              </span>
            </button>

            {/* Zoom Out Button */}
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={zoom <= 0.45}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-800 hover:bg-slate-750 active:bg-cyan-500/20 disabled:opacity-30 disabled:pointer-events-none text-slate-300 hover:text-white flex items-center justify-center border border-slate-700 transition-colors cursor-pointer"
              title="Zoom Out Image (-)"
            >
              <ZoomOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {/* Zoom Percentage Readout */}
            <button
              type="button"
              onClick={() => setZoom(1.0)}
              className="text-[11px] sm:text-xs font-mono font-bold text-cyan-300 px-1.5 py-1 rounded-md hover:bg-slate-800 transition-colors cursor-pointer"
              title="Click to reset zoom to 100%"
            >
              {Math.round(zoom * 100)}%
            </button>

            {/* Zoom In Button */}
            <button
              type="button"
              onClick={handleZoomIn}
              disabled={zoom >= 2.95}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-800 hover:bg-slate-750 active:bg-cyan-500/20 disabled:opacity-30 disabled:pointer-events-none text-slate-300 hover:text-white flex items-center justify-center border border-slate-700 transition-colors cursor-pointer"
              title="Zoom In Image (+)"
            >
              <ZoomIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {/* Reset View Button (if moved or zoomed) */}
            {hasTransformed && (
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 hover:text-white border border-rose-500/40 text-xs font-semibold transition-all cursor-pointer animate-fade-in"
                title="Reset Image to center position and 100% zoom"
              >
                <RotateCcw className="w-3 h-3" />
                <span className="text-[11px] hidden sm:inline">Reset</span>
              </button>
            )}

            {/* Help / Hint Button */}
            <button
              type="button"
              onClick={() => setShowHelpHint(!showHelpHint)}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
              title="How to grip & move image"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>

            {/* Collapse HUD Button */}
            <button
              type="button"
              onClick={() => setIsCollapsed(true)}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
              title="Collapse Grip HUD"
            >
              <Minimize2 className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Dynamic Help Hint Popup */}
        {showHelpHint && !isCollapsed && (
          <div className="p-2.5 rounded-xl bg-slate-900/98 border border-slate-700 text-slate-200 text-xs max-w-xs shadow-2xl backdrop-blur-md animate-fade-in">
            <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-800 font-bold text-cyan-300">
              <span className="flex items-center gap-1">
                <Move className="w-3.5 h-3.5" />
                <span>Grip & Move Shortcuts</span>
              </span>
              <button 
                onClick={() => setShowHelpHint(false)} 
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <ul className="space-y-1 text-[11px] text-slate-300">
              <li>• Click <strong className="text-white">Grip Active</strong> then drag anywhere on the image.</li>
              <li>• Hold <kbd className="px-1 py-0.5 rounded bg-slate-800 border border-slate-700 text-amber-300 font-mono text-[10px]">Spacebar</kbd> and drag to pan anytime.</li>
              <li>• Drag with <strong className="text-white">Middle Mouse Button</strong> (Wheel) to pan.</li>
              <li>• Use <kbd className="px-1 py-0.5 rounded bg-slate-800 border border-slate-700 text-cyan-300 font-mono text-[10px]">+</kbd> and <kbd className="px-1 py-0.5 rounded bg-slate-800 border border-slate-700 text-cyan-300 font-mono text-[10px]">-</kbd> or pinch on touch to zoom in/out.</li>
            </ul>
          </div>
        )}
      </div>
    </>
  );
};
