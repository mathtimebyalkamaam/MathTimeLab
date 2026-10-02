import React, { useRef, useState, useCallback } from 'react';
import { useHaptics } from '../../hooks/useHaptics';
import { useSound } from './SoundManager';

interface FloatingJoystickProps {
  angleDeg: number;
  heightOffset: number;
  onAngleChange: (angle: number) => void;
  onHeightChange: (height: number) => void;
  onReset?: () => void;
}

export const FloatingJoystick: React.FC<FloatingJoystickProps> = ({
  angleDeg,
  heightOffset,
  onAngleChange,
  onHeightChange,
}) => {
  const padRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [knobPos, setKnobPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const { lightTap } = useHaptics();
  const { playClick } = useSound();
  const lastTickTime = useRef(0);

  // Slim 36px radius (72px total width) so it does not block the 3D double cone
  const padRadius = 36;

  const handlePointerCalc = useCallback(
    (clientX: number, clientY: number) => {
      const pad = padRef.current;
      if (!pad) return;
      const rect = pad.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      let dx = clientX - cx;
      let dy = clientY - cy;

      const dist = Math.hypot(dx, dy);
      if (dist > padRadius) {
        dx = (dx / dist) * padRadius;
        dy = (dy / dist) * padRadius;
      }

      setKnobPos({ x: dx, y: dy });

      const normX = dx / padRadius; // -1 to +1
      const normY = -dy / padRadius; // -1 to +1

      const targetAngle = Math.max(0, Math.min(85, Math.round(40 + normX * 45)));
      const targetHeight = Number((normY * 1.8).toFixed(1));

      const now = performance.now();
      if (now - lastTickTime.current > 70) {
        lastTickTime.current = now;
        lightTap();
        playClick(0.7 + (targetAngle / 85) * 0.8);
      }

      onAngleChange(targetAngle);
      onHeightChange(targetHeight);
    },
    [padRadius, lightTap, playClick, onAngleChange, onHeightChange]
  );

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    handlePointerCalc(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    handlePointerCalc(e.clientX, e.clientY);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    setKnobPos({ x: 0, y: 0 });
  };

  return (
    <div className="flex flex-col items-center select-none bg-slate-900/80 backdrop-blur-md p-1.5 sm:p-2 rounded-2xl border border-slate-700/80 shadow-lg">
      <div className="flex items-center justify-between w-full mb-1 px-0.5">
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
          Pad
        </span>
        <span className="font-mono text-[9px] text-cyan-400 font-bold bg-cyan-950/60 px-1 py-0.2 rounded border border-cyan-800/40">
          θ={angleDeg}° h={heightOffset > 0 ? `+${heightOffset}` : heightOffset}
        </span>
      </div>

      <div
        ref={padRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{ width: `${padRadius * 2}px`, height: `${padRadius * 2}px` }}
        className="relative rounded-full bg-slate-950 border border-slate-700 cursor-grab active:cursor-grabbing flex items-center justify-center touch-none shadow-inner"
      >
        {/* Direction Crosshair */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
          <div className="w-full h-px bg-slate-700" />
          <div className="h-full w-px bg-slate-700 absolute" />
        </div>

        {/* Joystick Thumb Knob */}
        <div
          style={{
            transform: `translate(${knobPos.x}px, ${knobPos.y}px)`,
          }}
          className={`w-6 h-6 rounded-full border transition-shadow flex items-center justify-center pointer-events-none shadow-md ${
            isDragging
              ? 'bg-cyan-400 border-white shadow-cyan-400/50 scale-105'
              : 'bg-cyan-500/80 border-cyan-300 shadow-cyan-500/30'
          }`}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />
        </div>
      </div>
    </div>
  );
};
