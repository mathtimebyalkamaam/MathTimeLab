/**
 * usePerformanceMode: Auto-detects device hardware capabilities and dynamically adapts
 * 3D WebGL / 2D Canvas rendering fidelity to preserve 60fps on mobile & low-end devices.
 */
import { useState, useEffect, useMemo } from 'react';

export interface PerformanceProfile {
  isLowEnd: boolean;
  dpr: number;
  enableShadows: boolean;
  enableAntialias: boolean;
  maxParticles: number;
  physicsSubSteps: number;
  tier: 'low' | 'medium' | 'high';
  hardwareConcurrency: number;
  deviceMemoryGb: number | null;
}

export const usePerformanceMode = (): PerformanceProfile => {
  const [profile, setProfile] = useState<PerformanceProfile>(() => {
    if (typeof window === 'undefined') {
      return {
        isLowEnd: false,
        dpr: 1.5,
        enableShadows: true,
        enableAntialias: true,
        maxParticles: 60,
        physicsSubSteps: 2,
        tier: 'high',
        hardwareConcurrency: 4,
        deviceMemoryGb: 4,
      };
    }

    // Hardware Concurrency (CPU logical cores)
    const cores = navigator.hardwareConcurrency || 4;

    // Device Memory in GB (Chrome / Android feature)
    const memory = (navigator as unknown as { deviceMemory?: number }).deviceMemory ?? null;

    // Battery / Save-data mode detection
    const connection = (navigator as unknown as { connection?: { saveData?: boolean } }).connection;
    const saveData = connection?.saveData === true;

    // Screen / Mobile heuristics
    const isMobile = window.innerWidth < 768;
    const systemDpr = window.devicePixelRatio || 1;

    // Check low-end conditions:
    // <= 4 cores or <= 3GB memory or Save-Data mode enabled
    const isWeakCpu = cores <= 4;
    const isLowMemory = memory !== null && memory <= 3;
    const isLowEnd = isLowMemory || (isWeakCpu && isMobile) || saveData;

    let tier: 'low' | 'medium' | 'high' = 'high';
    let dpr = Math.min(systemDpr, 2);
    let enableShadows = true;
    let enableAntialias = true;
    let maxParticles = 60;
    let physicsSubSteps = 2;

    if (isLowEnd) {
      tier = 'low';
      dpr = Math.min(systemDpr, 1.0); // Clamp to 1x to avoid 3x/4x mobile GPU fillrate choke
      enableShadows = false;
      enableAntialias = false;
      maxParticles = 20;
      physicsSubSteps = 1;
    } else if (cores <= 6 || isMobile) {
      tier = 'medium';
      dpr = Math.min(systemDpr, 1.5);
      enableShadows = false;
      enableAntialias = true;
      maxParticles = 40;
      physicsSubSteps = 2;
    }

    return {
      isLowEnd,
      dpr,
      enableShadows,
      enableAntialias,
      maxParticles,
      physicsSubSteps,
      tier,
      hardwareConcurrency: cores,
      deviceMemoryGb: memory,
    };
  });

  return profile;
};
