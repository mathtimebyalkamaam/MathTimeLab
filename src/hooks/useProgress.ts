import { useState, useEffect, useCallback } from 'react';
import { SimulatorId } from '../types/simulators';

export interface LevelProgress {
  levelId: string;
  levelNumber: number; // 1, 2, 3
  completed: boolean;
  score?: number;
  completedAt?: string;
}

export interface StudentProgressRecord {
  simulatorId: SimulatorId;
  title: string;
  grade: string;
  levelsCompleted: number[]; // e.g. [1, 2, 3]
  isMastered: boolean;
  attemptsCount: number;
  lastPlayedAt: string;
  xpEarned: number;
}

export interface OverallStudentProgress {
  studentName: string;
  totalXp: number;
  streakDays: number;
  simulators: Record<SimulatorId, StudentProgressRecord>;
  completedCount: number;
  lastActive: string;
}

export const PROGRESS_STORAGE_KEY = 'livesimulators_student_progress_v2';

const DEFAULT_SIMULATORS: Record<SimulatorId, StudentProgressRecord> = {
  'drone-navigator': {
    simulatorId: 'drone-navigator',
    title: 'Drone Navigator',
    grade: 'Class 9',
    levelsCompleted: [1],
    isMastered: false,
    attemptsCount: 3,
    lastPlayedAt: new Date().toISOString(),
    xpEarned: 50,
  },
  'catapult-siege': {
    simulatorId: 'catapult-siege',
    title: 'The Catapult Siege',
    grade: 'Class 10',
    levelsCompleted: [1, 2],
    isMastered: false,
    attemptsCount: 5,
    lastPlayedAt: new Date().toISOString(),
    xpEarned: 90,
  },
  'conic-sections': {
    simulatorId: 'conic-sections',
    title: 'Flashlight & Cone Slicer',
    grade: 'Class 11',
    levelsCompleted: [1],
    isMastered: false,
    attemptsCount: 2,
    lastPlayedAt: new Date().toISOString(),
    xpEarned: 50,
  },
  'rollercoaster-architect': {
    simulatorId: 'rollercoaster-architect',
    title: 'Rollercoaster Architect',
    grade: 'Class 12',
    levelsCompleted: [1, 2],
    isMastered: false,
    attemptsCount: 4,
    lastPlayedAt: new Date().toISOString(),
    xpEarned: 110,
  },
  'unit-circle': {
    simulatorId: 'unit-circle',
    title: 'Unit Circle & Waves',
    grade: 'Class 10',
    levelsCompleted: [1, 2, 3],
    isMastered: true,
    attemptsCount: 6,
    lastPlayedAt: new Date().toISOString(),
    xpEarned: 150,
  },
  'calculus-sandbox': {
    simulatorId: 'calculus-sandbox',
    title: 'Calculus Sandbox',
    grade: 'Class 12',
    levelsCompleted: [1],
    isMastered: false,
    attemptsCount: 2,
    lastPlayedAt: new Date().toISOString(),
    xpEarned: 40,
  },
  'vector-flight-lab': {
    simulatorId: 'vector-flight-lab',
    title: '3D Vector Flight Lab',
    grade: 'Class 12',
    levelsCompleted: [],
    isMastered: false,
    attemptsCount: 1,
    lastPlayedAt: new Date().toISOString(),
    xpEarned: 0,
  },
  'argand-plane': {
    simulatorId: 'argand-plane',
    title: 'The Argand Plane Playground',
    grade: 'Class 11',
    levelsCompleted: [1],
    isMastered: false,
    attemptsCount: 2,
    lastPlayedAt: new Date().toISOString(),
    xpEarned: 40,
  },
  'matrix-meme': {
    simulatorId: 'matrix-meme',
    title: 'The Matrix Meme Machine',
    grade: 'Class 12',
    levelsCompleted: [1],
    isMastered: false,
    attemptsCount: 3,
    lastPlayedAt: new Date().toISOString(),
    xpEarned: 40,
  },
  'monty-hall': {
    simulatorId: 'monty-hall',
    title: 'The Monty Hall Probability Casino',
    grade: 'Class 10',
    levelsCompleted: [1, 2],
    isMastered: false,
    attemptsCount: 4,
    lastPlayedAt: new Date().toISOString(),
    xpEarned: 80,
  },
  'quadratic-roots': {
    simulatorId: 'quadratic-roots',
    title: 'The Parabola Root Hunter',
    grade: 'Class 10',
    levelsCompleted: [1],
    isMastered: false,
    attemptsCount: 2,
    lastPlayedAt: new Date().toISOString(),
    xpEarned: 40,
  },
  'circle-theorems': {
    simulatorId: 'circle-theorems',
    title: 'The Tangent Guardian',
    grade: 'Class 9',
    levelsCompleted: [1],
    isMastered: false,
    attemptsCount: 3,
    lastPlayedAt: new Date().toISOString(),
    xpEarned: 40,
  },
  'linear-systems': {
    simulatorId: 'linear-systems',
    title: 'The Linear Crossroads',
    grade: 'Class 10',
    levelsCompleted: [1],
    isMastered: false,
    attemptsCount: 2,
    lastPlayedAt: new Date().toISOString(),
    xpEarned: 40,
  },
  'trig-heights': {
    simulatorId: 'trig-heights',
    title: 'The Lighthouse Clinometer',
    grade: 'Class 10',
    levelsCompleted: [1],
    isMastered: false,
    attemptsCount: 2,
    lastPlayedAt: new Date().toISOString(),
    xpEarned: 40,
  },
  'heron-triangles': {
    simulatorId: 'heron-triangles',
    title: "Heron's Formula & Triangle Surveyor",
    grade: 'Class 9',
    levelsCompleted: [1],
    isMastered: false,
    attemptsCount: 2,
    lastPlayedAt: new Date().toISOString(),
    xpEarned: 40,
  },
  'polynomial-factorizer': {
    simulatorId: 'polynomial-factorizer',
    title: 'Geometric Polynomial Factorizer',
    grade: 'Class 9',
    levelsCompleted: [1],
    isMastered: false,
    attemptsCount: 2,
    lastPlayedAt: new Date().toISOString(),
    xpEarned: 40,
  },
  'lines-angles': {
    simulatorId: 'lines-angles',
    title: 'Parallel Lines & Transversal Detective',
    grade: 'Class 9',
    levelsCompleted: [1],
    isMastered: false,
    attemptsCount: 3,
    lastPlayedAt: new Date().toISOString(),
    xpEarned: 40,
  },
  'binomial-galton': {
    simulatorId: 'binomial-galton',
    title: "Binomial Galton Board & Pascal's Triangle",
    grade: 'Class 11',
    levelsCompleted: [1],
    isMastered: false,
    attemptsCount: 3,
    lastPlayedAt: new Date().toISOString(),
    xpEarned: 40,
  },
  'arithmetic-geometric-explorer': {
    simulatorId: 'arithmetic-geometric-explorer',
    title: 'Sequences & Series: AP, GP & Infinite Sums',
    grade: 'Class 11',
    levelsCompleted: [1],
    isMastered: false,
    attemptsCount: 2,
    lastPlayedAt: new Date().toISOString(),
    xpEarned: 40,
  },
  'hyperbola-ellipse-orbits': {
    simulatorId: 'hyperbola-ellipse-orbits',
    title: "Kepler's Orbits & Focal Conic Properties",
    grade: 'Class 11',
    levelsCompleted: [1],
    isMastered: false,
    attemptsCount: 2,
    lastPlayedAt: new Date().toISOString(),
    xpEarned: 40,
  },
  'surface-area-volumes': {
    simulatorId: 'surface-area-volumes',
    title: '3D Solid Unfolder & Liquid Pourer',
    grade: 'Class 9',
    levelsCompleted: [1],
    isMastered: false,
    attemptsCount: 2,
    lastPlayedAt: new Date().toISOString(),
    xpEarned: 40,
  },
  'circle-chords-cyclic': {
    simulatorId: 'circle-chords-cyclic',
    title: 'Chords & Cyclic Quadrilateral Lab',
    grade: 'Class 9',
    levelsCompleted: [1],
    isMastered: false,
    attemptsCount: 2,
    lastPlayedAt: new Date().toISOString(),
    xpEarned: 40,
  },
  'statistics-visualizer': {
    simulatorId: 'statistics-visualizer',
    title: 'The Data Fulcrum & Outlier Tug-of-War',
    grade: 'Class 9',
    levelsCompleted: [1],
    isMastered: false,
    attemptsCount: 2,
    lastPlayedAt: new Date().toISOString(),
    xpEarned: 40,
  },
  'limits-derivatives-lab': {
    simulatorId: 'limits-derivatives-lab',
    title: 'The Tangent Secant Zoom Lab',
    grade: 'Class 11',
    levelsCompleted: [1],
    isMastered: false,
    attemptsCount: 2,
    lastPlayedAt: new Date().toISOString(),
    xpEarned: 40,
  },
  'linear-inequalities': {
    simulatorId: 'linear-inequalities',
    title: 'Linear Inequalities & Feasible Region',
    grade: 'Class 11',
    levelsCompleted: [1],
    isMastered: false,
    attemptsCount: 2,
    lastPlayedAt: new Date().toISOString(),
    xpEarned: 40,
  },
  'permutations-combinations': {
    simulatorId: 'permutations-combinations',
    title: 'Permutations vs Combinations Lock',
    grade: 'Class 11',
    levelsCompleted: [1],
    isMastered: false,
    attemptsCount: 2,
    lastPlayedAt: new Date().toISOString(),
    xpEarned: 40,
  },
  'similar-triangles': {
    simulatorId: 'similar-triangles',
    title: 'Similar Triangles & Thales BPT',
    grade: 'Class 10',
    levelsCompleted: [1],
    isMastered: false,
    attemptsCount: 2,
    lastPlayedAt: new Date().toISOString(),
    xpEarned: 40,
  },
  'ftc-integral-accumulator': {
    simulatorId: 'ftc-integral-accumulator',
    title: 'Fundamental Theorem of Calculus',
    grade: 'Class 12',
    levelsCompleted: [1],
    isMastered: false,
    attemptsCount: 2,
    lastPlayedAt: new Date().toISOString(),
    xpEarned: 40,
  },
  'bayes-probability-lab': {
    simulatorId: 'bayes-probability-lab',
    title: "Bayes' Theorem Detective",
    grade: 'Class 12',
    levelsCompleted: [1],
    isMastered: false,
    attemptsCount: 2,
    lastPlayedAt: new Date().toISOString(),
    xpEarned: 40,
  },
  'euclidean-geometry-sandbox': {
    simulatorId: 'euclidean-geometry-sandbox',
    title: "Euclid's Axioms Sandbox",
    grade: 'Class 9',
    levelsCompleted: [1],
    isMastered: false,
    attemptsCount: 2,
    lastPlayedAt: new Date().toISOString(),
    xpEarned: 40,
  },
  'three-d-geometry-lab': {
    simulatorId: 'three-d-geometry-lab',
    title: '3D Skew Lines & Planes',
    grade: 'Class 12',
    levelsCompleted: [1],
    isMastered: false,
    attemptsCount: 2,
    lastPlayedAt: new Date().toISOString(),
    xpEarned: 40,
  },
  'differential-equations-lab': {
    simulatorId: 'differential-equations-lab',
    title: 'Differential Equations & Slope Fields',
    grade: 'Class 12',
    levelsCompleted: [1],
    isMastered: false,
    attemptsCount: 2,
    lastPlayedAt: new Date().toISOString(),
    xpEarned: 40,
  },
  'balance-scale-equations': {
    simulatorId: 'balance-scale-equations',
    title: 'Balance Scale Linear Equations',
    grade: 'Class 8',
    levelsCompleted: [1],
    isMastered: false,
    attemptsCount: 2,
    lastPlayedAt: new Date().toISOString(),
    xpEarned: 40,
  },
  'algebraic-identities-tiles': {
    simulatorId: 'algebraic-identities-tiles',
    title: 'Algebraic Identities Tiles',
    grade: 'Class 8',
    levelsCompleted: [1],
    isMastered: false,
    attemptsCount: 2,
    lastPlayedAt: new Date().toISOString(),
    xpEarned: 40,
  },
  'compound-interest-engine': {
    simulatorId: 'compound-interest-engine',
    title: 'Compound Interest Engine',
    grade: 'Class 8',
    levelsCompleted: [1],
    isMastered: false,
    attemptsCount: 2,
    lastPlayedAt: new Date().toISOString(),
    xpEarned: 40,
  },
  'quadrilateral-morpher': {
    simulatorId: 'quadrilateral-morpher',
    title: 'Quadrilateral Transformer',
    grade: 'Class 8',
    levelsCompleted: [1],
    isMastered: false,
    attemptsCount: 2,
    lastPlayedAt: new Date().toISOString(),
    xpEarned: 40,
  },
  'euler-polyhedra-3d': {
    simulatorId: 'euler-polyhedra-3d',
    title: 'Euler 3D Polyhedra Workshop',
    grade: 'Class 8',
    levelsCompleted: [1],
    isMastered: false,
    attemptsCount: 2,
    lastPlayedAt: new Date().toISOString(),
    xpEarned: 40,
  },
  'direct-inverse-proportions': {
    simulatorId: 'direct-inverse-proportions',
    title: 'Direct vs. Inverse Proportions',
    grade: 'Class 8',
    levelsCompleted: [1],
    isMastered: false,
    attemptsCount: 2,
    lastPlayedAt: new Date().toISOString(),
    xpEarned: 40,
  },
  'dynamic-pie-chart': {
    simulatorId: 'dynamic-pie-chart',
    title: 'Dynamic Pie Chart & Angles',
    grade: 'Class 8',
    levelsCompleted: [1],
    isMastered: false,
    attemptsCount: 2,
    lastPlayedAt: new Date().toISOString(),
    xpEarned: 40,
  },
  'square-roots-triplets': {
    simulatorId: 'square-roots-triplets',
    title: 'Square Roots & Triplet Forge',
    grade: 'Class 8',
    levelsCompleted: [1],
    isMastered: false,
    attemptsCount: 2,
    lastPlayedAt: new Date().toISOString(),
    xpEarned: 40,
  },
  'exponents-powers-lab': {
    simulatorId: 'exponents-powers-lab',
    title: 'Exponents & Powers Lab',
    grade: 'Class 8',
    levelsCompleted: [1],
    isMastered: false,
    attemptsCount: 2,
    lastPlayedAt: new Date().toISOString(),
    xpEarned: 40,
  },
  'rational-numbers-density': {
    simulatorId: 'rational-numbers-density',
    title: 'Rational Numbers Density',
    grade: 'Class 8',
    levelsCompleted: [1],
    isMastered: false,
    attemptsCount: 2,
    lastPlayedAt: new Date().toISOString(),
    xpEarned: 40,
  },
  'triangle-congruence-forge': {
    simulatorId: 'triangle-congruence-forge',
    title: 'Triangle Congruence Forge',
    grade: 'Class 9',
    levelsCompleted: [1],
    isMastered: false,
    attemptsCount: 2,
    lastPlayedAt: new Date().toISOString(),
    xpEarned: 40,
  },
  'arithmetic-progression-lab': {
    simulatorId: 'arithmetic-progression-lab',
    title: 'Arithmetic Progression Lab',
    grade: 'Class 10',
    levelsCompleted: [1],
    isMastered: false,
    attemptsCount: 2,
    lastPlayedAt: new Date().toISOString(),
    xpEarned: 40,
  },
  'coordinate-section-formula': {
    simulatorId: 'coordinate-section-formula',
    title: 'Section Formula & Centroid',
    grade: 'Class 10',
    levelsCompleted: [1],
    isMastered: false,
    attemptsCount: 2,
    lastPlayedAt: new Date().toISOString(),
    xpEarned: 40,
  },
  'circle-tangents-lab': {
    simulatorId: 'circle-tangents-lab',
    title: 'Circle Tangents Lab',
    grade: 'Class 10',
    levelsCompleted: [1],
    isMastered: false,
    attemptsCount: 2,
    lastPlayedAt: new Date().toISOString(),
    xpEarned: 40,
  },
  'mathematical-induction-dominos': {
    simulatorId: 'mathematical-induction-dominos',
    title: 'Mathematical Induction',
    grade: 'Class 11',
    levelsCompleted: [1],
    isMastered: false,
    attemptsCount: 2,
    lastPlayedAt: new Date().toISOString(),
    xpEarned: 40,
  },
  'trig-equations-radial': {
    simulatorId: 'trig-equations-radial',
    title: 'Trig Equations Radial Radar',
    grade: 'Class 11',
    levelsCompleted: [1],
    isMastered: false,
    attemptsCount: 2,
    lastPlayedAt: new Date().toISOString(),
    xpEarned: 40,
  },
  'linear-programming-lab': {
    simulatorId: 'linear-programming-lab',
    title: 'Linear Programming Lab',
    grade: 'Class 12',
    levelsCompleted: [1],
    isMastered: false,
    attemptsCount: 2,
    lastPlayedAt: new Date().toISOString(),
    xpEarned: 40,
  },
  'probability-distribution-lab': {
    simulatorId: 'probability-distribution-lab',
    title: 'Probability Distributions',
    grade: 'Class 12',
    levelsCompleted: [1],
    isMastered: false,
    attemptsCount: 2,
    lastPlayedAt: new Date().toISOString(),
    xpEarned: 40,
  },
};

const getInitialProgress = (): OverallStudentProgress => {
  if (typeof window === 'undefined') {
    return {
      studentName: 'Alex Mercer (Student)',
      totalXp: 490,
      streakDays: 4,
      simulators: DEFAULT_SIMULATORS,
      completedCount: 1,
      lastActive: new Date().toISOString(),
    };
  }

  try {
    const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Merge with default keys to ensure integrity
      return {
        ...parsed,
        simulators: {
          ...DEFAULT_SIMULATORS,
          ...(parsed.simulators || {}),
        },
      };
    }
  } catch (err) {
    console.warn('Failed to parse student progress from localStorage:', err);
  }

  const initial: OverallStudentProgress = {
    studentName: 'Alex Mercer (Student)',
    totalXp: 490,
    streakDays: 4,
    simulators: DEFAULT_SIMULATORS,
    completedCount: 1,
    lastActive: new Date().toISOString(),
  };

  try {
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(initial));
  } catch {
    // Ignore storage quota errors
  }

  return initial;
};

export const useProgress = () => {
  const [progress, setProgress] = useState<OverallStudentProgress>(getInitialProgress);

  // Sync to localStorage
  const saveProgress = useCallback((newProgress: OverallStudentProgress) => {
    setProgress(newProgress);
    try {
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(newProgress));
      // Dispatch storage event for multi-tab or dashboard reactivity
      window.dispatchEvent(new Event('livesimulators_progress_updated'));
    } catch (err) {
      console.warn('Error saving progress:', err);
    }
  }, []);

  // Listen for external updates (e.g. from Teacher Dashboard reset or other tabs)
  useEffect(() => {
    const handleUpdate = () => {
      setProgress(getInitialProgress());
    };
    window.addEventListener('livesimulators_progress_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('livesimulators_progress_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const markLevelComplete = useCallback(
    (simulatorId: SimulatorId, levelNumber: number, xpBonus = 50) => {
      setProgress((prev) => {
        const simRecord = prev.simulators[simulatorId] || {
          simulatorId,
          title: simulatorId,
          grade: 'All',
          levelsCompleted: [],
          isMastered: false,
          attemptsCount: 0,
          lastPlayedAt: new Date().toISOString(),
          xpEarned: 0,
        };

        const alreadyCompleted = simRecord.levelsCompleted.includes(levelNumber);
        const updatedLevels = alreadyCompleted
          ? simRecord.levelsCompleted
          : [...simRecord.levelsCompleted, levelNumber].sort();

        const isMastered = updatedLevels.length >= 3;
        const addedXp = alreadyCompleted ? 0 : xpBonus;

        const updatedSimRecord: StudentProgressRecord = {
          ...simRecord,
          levelsCompleted: updatedLevels,
          isMastered,
          attemptsCount: simRecord.attemptsCount + 1,
          lastPlayedAt: new Date().toISOString(),
          xpEarned: simRecord.xpEarned + addedXp,
        };

        const updatedSimulators = {
          ...prev.simulators,
          [simulatorId]: updatedSimRecord,
        };

        const completedCount = Object.values(updatedSimulators).filter(
          (s) => s.isMastered
        ).length;

        const newOverall: OverallStudentProgress = {
          ...prev,
          totalXp: prev.totalXp + addedXp,
          simulators: updatedSimulators,
          completedCount,
          lastActive: new Date().toISOString(),
        };

        try {
          localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(newOverall));
          window.dispatchEvent(new Event('livesimulators_progress_updated'));
        } catch {
          // ignore
        }

        return newOverall;
      });
    },
    []
  );

  const resetProgress = useCallback(() => {
    const blank: OverallStudentProgress = {
      studentName: 'Alex Mercer (Student)',
      totalXp: 0,
      streakDays: 1,
      simulators: Object.keys(DEFAULT_SIMULATORS).reduce((acc, key) => {
        const simId = key as SimulatorId;
        acc[simId] = {
          ...DEFAULT_SIMULATORS[simId],
          levelsCompleted: [],
          isMastered: false,
          attemptsCount: 0,
          xpEarned: 0,
          lastPlayedAt: new Date().toISOString(),
        };
        return acc;
      }, {} as Record<SimulatorId, StudentProgressRecord>),
      completedCount: 0,
      lastActive: new Date().toISOString(),
    };
    saveProgress(blank);
  }, [saveProgress]);

  const isLevelCompleted = useCallback(
    (simulatorId: SimulatorId, levelNumber: number) => {
      return progress.simulators[simulatorId]?.levelsCompleted?.includes(levelNumber) ?? false;
    },
    [progress]
  );

  return {
    progress,
    markLevelComplete,
    resetProgress,
    isLevelCompleted,
  };
};
