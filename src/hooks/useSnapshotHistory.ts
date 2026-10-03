/**
 * useSnapshotHistory.ts: Time-Travel Parameter History (Undo / Redo / Bookmarks).
 * Recommendation 14: Allows students and teachers to record parameter checkpoints,
 * step backward and forward through visual mathematical states, and inspect delta changes.
 */
import { useState, useCallback, useRef } from 'react';
import { useHaptics } from './useHaptics';
import { useSound } from '../components/common/SoundManager';

export interface SnapshotItem<T> {
  id: string;
  timestamp: number;
  label: string;
  state: T;
}

export function useSnapshotHistory<T>(
  initialState: T,
  onRestoreOrMaxHistory?: ((state: T) => void) | number,
  maxHistory = 20
) {
  const onRestoreCallback = typeof onRestoreOrMaxHistory === 'function' ? onRestoreOrMaxHistory : undefined;
  const historyLimit = typeof onRestoreOrMaxHistory === 'number' ? onRestoreOrMaxHistory : maxHistory;

  const [history, setHistory] = useState<SnapshotItem<T>[]>([
    {
      id: 'initial',
      timestamp: Date.now(),
      label: 'Initial State',
      state: initialState,
    },
  ]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const { lightTap, successBuzz } = useHaptics();
  const { playClick, playWhoosh } = useSound();

  const takeSnapshot = useCallback((newState: T, label = 'Parameter Snapshot') => {
    setHistory((prev) => {
      const trimmed = prev.slice(0, currentIndex + 1);
      const newItem: SnapshotItem<T> = {
        id: `snap_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        timestamp: Date.now(),
        label,
        state: newState,
      };
      const updated = [...trimmed, newItem];
      if (updated.length > historyLimit) {
        return updated.slice(updated.length - historyLimit);
      }
      return updated;
    });
    setCurrentIndex((prev) => Math.min(prev + 1, historyLimit - 1));
    lightTap();
  }, [currentIndex, historyLimit, lightTap]);

  const undo = useCallback((applyStateOrEvent?: ((state: T) => void) | unknown) => {
    if (currentIndex > 0) {
      const targetIndex = currentIndex - 1;
      const targetSnapshot = history[targetIndex];
      setCurrentIndex(targetIndex);
      const applyFn = typeof applyStateOrEvent === 'function' ? applyStateOrEvent : onRestoreCallback;
      if (applyFn) applyFn(targetSnapshot.state);
      playWhoosh();
      lightTap();
      return targetSnapshot;
    }
    return null;
  }, [currentIndex, history, onRestoreCallback, playWhoosh, lightTap]);

  const redo = useCallback((applyStateOrEvent?: ((state: T) => void) | unknown) => {
    if (currentIndex < history.length - 1) {
      const targetIndex = currentIndex + 1;
      const targetSnapshot = history[targetIndex];
      setCurrentIndex(targetIndex);
      const applyFn = typeof applyStateOrEvent === 'function' ? applyStateOrEvent : onRestoreCallback;
      if (applyFn) applyFn(targetSnapshot.state);
      playClick();
      lightTap();
      return targetSnapshot;
    }
    return null;
  }, [currentIndex, history, onRestoreCallback, playClick, lightTap]);

  const resetHistory = useCallback((state: T) => {
    setHistory([
      {
        id: 'reset',
        timestamp: Date.now(),
        label: 'Reset State',
        state,
      },
    ]);
    setCurrentIndex(0);
  }, []);

  return {
    takeSnapshot,
    undo,
    redo,
    resetHistory,
    canUndo: currentIndex > 0,
    canRedo: currentIndex < history.length - 1,
    currentSnapshot: history[currentIndex],
    historyCount: history.length,
    historyIndex: currentIndex,
  };
}
