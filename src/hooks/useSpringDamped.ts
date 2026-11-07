import { useState, useEffect, useRef } from 'react';
import { SpringOscillator } from '../utils/canvasFx';

export interface SpringConfig {
  stiffness?: number; // Spring tension k (default: 150)
  damping?: number;   // Viscous friction c (default: 14)
  mass?: number;      // Inertial mass m (default: 1)
}

/**
 * useSpringDamped:
 * Animates a target numerical value using true damped harmonic spring physics:
 * Provides physical momentum, natural overshoot, and elastic settlement.
 */
export function useSpringDamped(
  targetValue: number,
  config: SpringConfig = {}
): number {
  const [currentVal, setCurrentVal] = useState(targetValue);
  const springRef = useRef<SpringOscillator | null>(null);

  if (!springRef.current) {
    springRef.current = new SpringOscillator(
      targetValue,
      config.stiffness ?? 150,
      config.damping ?? 14,
      config.mass ?? 1
    );
  }

  // Update target whenever prop changes
  useEffect(() => {
    springRef.current?.setTarget(targetValue);
  }, [targetValue]);

  // RequestAnimationFrame physics simulation loop
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;

      if (springRef.current) {
        const val = springRef.current.step(dt);
        setCurrentVal(val);

        if (!springRef.current.isSettled()) {
          animId = requestAnimationFrame(loop);
        }
      }
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [targetValue]);

  return currentVal;
}

