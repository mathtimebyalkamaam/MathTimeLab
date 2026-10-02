/**
 * SoundManager: Procedural Web Audio API sound synthesis.
 * Zero external audio assets, works instantly offline, 0ms latency, mobile-friendly.
 * Includes auto-unlock for mobile audio context policies.
 */
import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export interface SoundContextType {
  isMuted: boolean;
  toggleMute: () => void;
  playClick: (pitchMultiplier?: number) => void;
  playWhoosh: () => void;
  playChime: () => void;
  playError: () => void;
  playThud: () => void;
  playLaserSweep: () => void;
  playResonance: (pitchMultiplier?: number) => void;
  playHarmonicSnap: () => void;
}

const SoundContext = createContext<SoundContextType | null>(null);

class WebAudioSynthesizer {
  private ctx: AudioContext | null = null;
  private isUnlocked = false;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended' && this.isUnlocked) {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public unlock() {
    if (this.isUnlocked) return;
    const ctx = this.getContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume().then(() => {
        this.isUnlocked = true;
      }).catch(() => {});
    } else {
      this.isUnlocked = true;
    }
  }

  // Soft high-frequency UI tick when a slider or dial moves
  public click(pitchMultiplier = 1) {
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    const baseFreq = 950 * Math.max(0.4, Math.min(2.5, pitchMultiplier));
    osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.4, ctx.currentTime + 0.025);

    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.025);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.025);
  }

  // Smooth airy "whoosh" when catapult launches or cart takes off
  public whoosh() {
    const ctx = this.getContext();
    if (!ctx) return;

    // Filtered noise synthesis
    const bufferSize = ctx.sampleRate * 0.35;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.value = 3.5;
    filter.frequency.setValueAtTime(220, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.18);
    filter.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.35);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.14);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start();
    noise.stop(ctx.currentTime + 0.35);
  }

  // Rewarding crystalline major pentatonic chime (C6, E6, G6, C7)
  public chime() {
    const ctx = this.getContext();
    if (!ctx) return;

    const notes = [1046.5, 1318.5, 1567.98, 2093.0]; // C6, E6, G6, C7
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

      const startTime = ctx.currentTime + idx * 0.08;
      const duration = 0.55;

      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(0.08, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    });
  }

  // Gentle muted "error" or boundary alert chord (minor second downward pitch)
  public error() {
    const ctx = this.getContext();
    if (!ctx) return;

    const notes = [311.13, 293.66]; // Eb4 -> D4
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      const startTime = ctx.currentTime + idx * 0.09;
      osc.frequency.setValueAtTime(freq, startTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.85, startTime + 0.14);

      // Low pass filter to make it gentle, not grating
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, startTime);

      gain.gain.setValueAtTime(0.05, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.15);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.16);
    });
  }

  // Low thud on projectile hit or wall collision
  public thud() {
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(35, ctx.currentTime + 0.18);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.18);
  }

  // Sci-fi resonant laser sweep for 3D Cone Slicer & Laser cutting plane
  public laserSweep() {
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1100, ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.035, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.14);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.14);
  }

  // Harmonic resonance tone when an invariant balance or golden ratio point is reached
  public resonance(pitchMultiplier = 1) {
    const ctx = this.getContext();
    if (!ctx) return;

    const fundamental = 528 * Math.max(0.5, Math.min(2.5, pitchMultiplier));
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(fundamental, ctx.currentTime);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(fundamental * 1.5, ctx.currentTime); // perfect fifth harmonic

    gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.45);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(ctx.currentTime + 0.45);
    osc2.stop(ctx.currentTime + 0.45);
  }

  // Crisp multi-tone chime snap when aligning to an exact geometric landmark (angle/root/symmetry)
  public harmonicSnap() {
    const ctx = this.getContext();
    if (!ctx) return;

    const freqs = [659.25, 880, 1318.51]; // E5, A5, E6 triad
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.015);
      gain.gain.setValueAtTime(0.04 / (idx + 1), ctx.currentTime + idx * 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.015);
      osc.stop(ctx.currentTime + 0.18);
    });
  }
}

const synthInstance = new WebAudioSynthesizer();

export const SoundManager: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('livesimulators_muted') === 'true';
  });

  // Attach touch/click listener to unlock audio on first user gesture
  useEffect(() => {
    const unlock = () => {
      synthInstance.unlock();
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
    window.addEventListener('pointerdown', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });
    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('livesimulators_muted', String(next));
      } catch {}
      return next;
    });
  }, []);

  const playClick = useCallback((pitch = 1) => {
    if (isMuted) return;
    synthInstance.click(pitch);
  }, [isMuted]);

  const playWhoosh = useCallback(() => {
    if (isMuted) return;
    synthInstance.whoosh();
  }, [isMuted]);

  const playChime = useCallback(() => {
    if (isMuted) return;
    synthInstance.chime();
  }, [isMuted]);

  const playError = useCallback(() => {
    if (isMuted) return;
    synthInstance.error();
  }, [isMuted]);

  const playThud = useCallback(() => {
    if (isMuted) return;
    synthInstance.thud();
  }, [isMuted]);

  const playLaserSweep = useCallback(() => {
    if (isMuted) return;
    synthInstance.laserSweep();
  }, [isMuted]);

  const playResonance = useCallback((pitch = 1) => {
    if (isMuted) return;
    synthInstance.resonance(pitch);
  }, [isMuted]);

  const playHarmonicSnap = useCallback(() => {
    if (isMuted) return;
    synthInstance.harmonicSnap();
  }, [isMuted]);

  return (
    <SoundContext.Provider
      value={{
        isMuted,
        toggleMute,
        playClick,
        playWhoosh,
        playChime,
        playError,
        playThud,
        playLaserSweep,
        playResonance,
        playHarmonicSnap,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = (): SoundContextType => {
  const ctx = useContext(SoundContext);
  if (!ctx) {
    // Fallback safe dummy context if used outside provider
    return {
      isMuted: false,
      toggleMute: () => {},
      playClick: () => {},
      playWhoosh: () => {},
      playChime: () => {},
      playError: () => {},
      playThud: () => {},
      playLaserSweep: () => {},
      playResonance: () => {},
      playHarmonicSnap: () => {},
    };
  }
  return ctx;
};

// Global direct playback utility
export const soundEffects = {
  click: (pitch?: number) => {
    if (localStorage.getItem('livesimulators_muted') !== 'true') synthInstance.click(pitch);
  },
  whoosh: () => {
    if (localStorage.getItem('livesimulators_muted') !== 'true') synthInstance.whoosh();
  },
  chime: () => {
    if (localStorage.getItem('livesimulators_muted') !== 'true') synthInstance.chime();
  },
  error: () => {
    if (localStorage.getItem('livesimulators_muted') !== 'true') synthInstance.error();
  },
  thud: () => {
    if (localStorage.getItem('livesimulators_muted') !== 'true') synthInstance.thud();
  },
  laserSweep: () => {
    if (localStorage.getItem('livesimulators_muted') !== 'true') synthInstance.laserSweep();
  },
  resonance: (pitch?: number) => {
    if (localStorage.getItem('livesimulators_muted') !== 'true') synthInstance.resonance(pitch);
  },
  harmonicSnap: () => {
    if (localStorage.getItem('livesimulators_muted') !== 'true') synthInstance.harmonicSnap();
  },
};
