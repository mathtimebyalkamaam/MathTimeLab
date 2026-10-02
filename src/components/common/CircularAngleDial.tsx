import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useHaptics } from '../../hooks/useHaptics';
import { useSound } from './SoundManager';

interface CircularAngleDialProps {
  angleDeg: number;
  onChange: (angle: number) => void;
  min?: number;
  max?: number;
  label?: string;
  size?: number;
}

export const CircularAngleDial: React.FC<CircularAngleDialProps> = ({
  angleDeg,
  onChange,
  min = 0,
  max = 90,
  label = 'Angle of Elevation (θ)',
  size = 170,
}) => {
  const dialRef = useRef<SVGSVGElement>(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const { lightTap } = useHaptics();
  const { playClick } = useSound();
  const lastDegRef = useRef(angleDeg);

  const radius = size * 0.38;
  const cx = size / 2;
  const cy = size / 2 + 10; // offset slightly downward to emphasize quadrant 1 (0 to 90°)

  // Math angle in radians (0 is East/horizontal right, 90 is North/vertical up)
  const angleRad = (angleDeg * Math.PI) / 180;
  // SVG coordinates: 0 rad -> (cx + r, cy), 90 rad -> (cx, cy - r)
  const knobX = cx + Math.cos(angleRad) * radius;
  const knobY = cy - Math.sin(angleRad) * radius;

  // Arc path from 0 to angleDeg
  const arcStartX = cx + radius;
  const arcStartY = cy;
  const largeArcFlag = angleDeg > 180 ? 1 : 0;
  const arcPath = `M ${cx} ${cy} L ${arcStartX} ${arcStartY} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${knobX} ${knobY} Z`;

  const handlePointerCalc = useCallback(
    (clientX: number, clientY: number) => {
      const dial = dialRef.current;
      if (!dial) return;
      const rect = dial.getBoundingClientRect();
      const dialScaleX = size / rect.width;
      const dialScaleY = size / rect.height;

      const px = (clientX - rect.left) * dialScaleX;
      const py = (clientY - rect.top) * dialScaleY;

      const dx = px - cx;
      const dy = cy - py; // math Cartesian y inverted

      let rad = Math.atan2(dy, dx);
      let deg = (rad * 180) / Math.PI;

      if (deg < 0) {
        if (deg < -90) deg = 90;
        else deg = 0;
      }

      const clamped = Math.max(min, Math.min(max, Math.round(deg)));
      if (clamped !== lastDegRef.current) {
        lastDegRef.current = clamped;
        lightTap();
        playClick(0.8 + (clamped / max) * 0.7);
      }
      onChange(clamped);
    },
    [cx, cy, min, max, onChange, size, lightTap, playClick]
  );

  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    setIsInteracting(true);
    (e.target as Element).setPointerCapture(e.pointerId);
    handlePointerCalc(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!isInteracting) return;
    handlePointerCalc(e.clientX, e.clientY);
  };

  const handlePointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    setIsInteracting(false);
  };

  return (
    <div className="flex flex-col items-center select-none">
      <div className="flex items-center justify-between w-full max-w-[200px] mb-1">
        <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wide">
          {label}
        </span>
        <span className="font-mono text-sm font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40 tabular-nums">
          θ = {angleDeg}°
        </span>
      </div>

      <div className="relative touch-none">
        <svg
          ref={dialRef}
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="cursor-pointer touch-none"
        >
          {/* Subtle outer bezel */}
          <circle cx={cx} cy={cy} r={radius + 16} fill="#0f172a" stroke="#1e293b" strokeWidth="2" />
          <circle cx={cx} cy={cy} r={radius + 8} fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />

          {/* Quadrant 1 baseline axis (0°) */}
          <line x1={cx} y1={cy} x2={cx + radius + 12} y2={cy} stroke="#64748b" strokeWidth="2" />
          {/* Vertical axis (90°) */}
          <line x1={cx} y1={cy} x2={cx} y2={cy - radius - 12} stroke="#64748b" strokeWidth="2" />

          {/* Tick marks for 0°, 15°, 30°, 45°, 60°, 75°, 90° */}
          {[0, 15, 30, 45, 60, 75, 90].map((deg) => {
            const rad = (deg * Math.PI) / 180;
            const isMajor = deg % 30 === 0 || deg === 45;
            const innerR = radius - (isMajor ? 8 : 4);
            const outerR = radius + 4;
            const x1 = cx + Math.cos(rad) * innerR;
            const y1 = cy - Math.sin(rad) * innerR;
            const x2 = cx + Math.cos(rad) * outerR;
            const y2 = cy - Math.sin(rad) * outerR;

            return (
              <g key={deg}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={isMajor ? '#94a3b8' : '#475569'} strokeWidth={isMajor ? 1.5 : 1} />
                {isMajor && (
                  <text
                    x={cx + Math.cos(rad) * (radius + 20)}
                    y={cy - Math.sin(rad) * (radius + 20) + 3}
                    textAnchor="middle"
                    fill="#64748b"
                    fontSize="9"
                    fontFamily="monospace"
                  >
                    {deg}°
                  </text>
                )}
              </g>
            );
          })}

          {/* Shaded Angle Wedge */}
          <path d={arcPath} fill="rgba(245, 158, 11, 0.22)" stroke="#f59e0b" strokeWidth="1.5" />

          {/* Elevation arm vector line */}
          <line x1={cx} y1={cy} x2={knobX} y2={knobY} stroke="#f59e0b" strokeWidth="3" />

          {/* Center Pivot Point */}
          <circle cx={cx} cy={cy} r="5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />

          {/* Dial Grab Knob Handle (with glowing shadow) */}
          <circle
            cx={knobX}
            cy={knobY}
            r="14"
            fill="#f59e0b"
            stroke="#ffffff"
            strokeWidth="3"
            filter="drop-shadow(0 0 6px rgba(245, 158, 11, 0.8))"
          />
          <circle cx={knobX} cy={knobY} r="5" fill="#0f172a" />
        </svg>

        {/* Small Touch Gesture Helper */}
        <span className="text-[10px] text-slate-500 font-sans text-center block mt-0.5">
          Drag knob to adjust elevation θ
        </span>
      </div>
    </div>
  );
};
