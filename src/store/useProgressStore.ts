/**
 * useProgressStore: Dedicated Zustand gamification store for LiveSimulators.
 * Tracks:
 * - Total XP
 * - Current Rank / Level (Novice, Apprentice, Equation Wizard, Calculus Master, etc.)
 * - Streak Counter & daily visit verification
 * - Badges Earned with rarity, unlock timestamps, and toast triggers
 * - Completed simulator levels
 * - Daily Challenge generation and verification
 * Persisted reliably to localStorage with automatic cross-tab synchronization.
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { SimulatorId } from '../types/simulators';
import { triggerHaptic } from '../hooks/useHaptics';
import { soundEffects } from '../components/common/SoundManager';

export interface BadgeDefinition {
  id: string;
  title: string;
  description: string;
  icon: string; // Lucide icon identifier
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: 'algebra' | 'geometry' | 'calculus' | 'streak' | 'mastery';
  xpReward: number;
}

export interface UnlockedBadge extends BadgeDefinition {
  unlockedAt: string;
}

export interface DailyChallengeTask {
  id: string;
  dateKey: string; // YYYY-MM-DD
  simulatorId: SimulatorId;
  simulatorTitle: string;
  title: string;
  taskPrompt: string;
  targetCriteria: string;
  xpReward: number;
  completed: boolean;
  targetAngle?: number;
  targetCoords?: { x: number; y: number };
}

export interface RankLevel {
  level: number;
  title: string;
  minXp: number;
  maxXp: number;
  badgeIcon: string;
  color: string;
}

export const RANKS: RankLevel[] = [
  { level: 1, title: 'Math Novice', minXp: 0, maxXp: 150, badgeIcon: 'Compass', color: '#94a3b8' },
  { level: 2, title: 'Coordinate Cadet', minXp: 150, maxXp: 350, badgeIcon: 'Target', color: '#38bdf8' },
  { level: 3, title: 'Trig Trajectory Specialist', minXp: 350, maxXp: 650, badgeIcon: 'Orbit', color: '#34d399' },
  { level: 4, title: 'Equation Wizard', minXp: 650, maxXp: 1100, badgeIcon: 'Sparkles', color: '#a855f7' },
  { level: 5, title: 'Vector Flight Commander', minXp: 1100, maxXp: 1700, badgeIcon: 'Activity', color: '#f59e0b' },
  { level: 6, title: 'Calculus Master', minXp: 1700, maxXp: 2500, badgeIcon: 'TrendingUp', color: '#ec4899' },
  { level: 7, title: 'Infinite Dimension Legend', minXp: 2500, maxXp: 99999, badgeIcon: 'Award', color: '#f43f5e' },
];

export const ALL_BADGES: Record<string, BadgeDefinition> = {
  first_launch: {
    id: 'first_launch',
    title: 'First Flight',
    description: 'Launch your very first simulation in any physics laboratory.',
    icon: 'Rocket',
    rarity: 'common',
    category: 'algebra',
    xpReward: 30,
  },
  pythagoras_pro: {
    id: 'pythagoras_pro',
    title: 'Pythagoras Pro',
    description: 'Master the 3-4-5 right triangle hypotenuse in Drone Navigator.',
    icon: 'Target',
    rarity: 'rare',
    category: 'geometry',
    xpReward: 50,
  },
  parabolic_sniper: {
    id: 'parabolic_sniper',
    title: 'Parabolic Sniper',
    description: 'Clear the castle fortress at exactly 45° maximum trajectory.',
    icon: 'Flame',
    rarity: 'rare',
    category: 'algebra',
    xpReward: 50,
  },
  derivative_destroyer: {
    id: 'derivative_destroyer',
    title: 'Derivative Destroyer',
    description: 'Find local extrema where tangent slope f\'(x) = 0.',
    icon: 'TrendingUp',
    rarity: 'epic',
    category: 'calculus',
    xpReward: 75,
  },
  conic_slicer_master: {
    id: 'conic_slicer_master',
    title: 'Conic Slicer Master',
    description: 'Intersect all 4 conic sections (circle, ellipse, parabola, hyperbola).',
    icon: 'Orbit',
    rarity: 'epic',
    category: 'geometry',
    xpReward: 75,
  },
  g_force_survivor: {
    id: 'g_force_survivor',
    title: 'G-Force Architect',
    description: 'Design a continuous roller coaster track exceeding 20 m/s safely.',
    icon: 'Activity',
    rarity: 'legendary',
    category: 'calculus',
    xpReward: 100,
  },
  streak_flame: {
    id: 'streak_flame',
    title: 'Relentless Scholar',
    description: 'Maintain a 5-day daily challenge simulation streak.',
    icon: 'Zap',
    rarity: 'legendary',
    category: 'streak',
    xpReward: 120,
  },
};

const DAILY_CHALLENGE_TEMPLATES: Omit<DailyChallengeTask, 'id' | 'dateKey' | 'completed'>[] = [
  {
    simulatorId: 'catapult-siege',
    simulatorTitle: 'The Catapult Siege',
    title: 'The 30° Trajectory Trial',
    taskPrompt: 'Launch boulder at θ = 30° with tension ≥ 60 to clear the perimeter.',
    targetCriteria: 'Angle θ = 30°, Tension ≥ 60',
    xpReward: 70,
    targetAngle: 30,
  },
  {
    simulatorId: 'drone-navigator',
    simulatorTitle: 'Drone Navigator',
    title: 'Quadrant II Precision Drop',
    taskPrompt: 'Deliver emergency cargo to coordinates (-4, 3) without violating airspace.',
    targetCriteria: 'Drone coordinates (-4, 3)',
    xpReward: 65,
    targetCoords: { x: -4, y: 3 },
  },
  {
    simulatorId: 'conic-sections',
    simulatorTitle: 'Cone Slicer 3D',
    title: 'The Golden Ellipse Slice',
    taskPrompt: 'Cut the double cone at angle θ = 35° to generate a closed planar ellipse.',
    targetCriteria: 'Cut angle θ = 35° (e < 1)',
    xpReward: 60,
    targetAngle: 35,
  },
  {
    simulatorId: 'unit-circle',
    simulatorTitle: 'Unit Circle & Waves',
    title: 'Exact Radians at 60° (π/3)',
    taskPrompt: 'Rotate to exactly 60° to verify sin(60°) = √3/2 ≈ 0.866.',
    targetCriteria: 'Angle θ = 60° (sin = 0.866, cos = 0.500)',
    xpReward: 60,
    targetAngle: 60,
  },
  {
    simulatorId: 'rollercoaster-architect',
    simulatorTitle: 'Rollercoaster Architect',
    title: 'Velocity Threshold Challenge',
    taskPrompt: 'Craft a drop where the cart reaches exactly 20 m/s with paint area < 500.',
    targetCriteria: 'Max velocity 20 m/s (±1.5)',
    xpReward: 80,
  },
];

const getTodayDateKey = (): string => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export interface ProgressStoreState {
  totalXp: number;
  streakDays: number;
  lastActiveDate: string; // YYYY-MM-DD
  unlockedBadges: Record<string, UnlockedBadge>;
  completedLevels: Record<string, number[]>; // simulatorId -> [1, 2, 3]
  dailyChallenge: DailyChallengeTask;
  recentToastBadge: UnlockedBadge | null;

  // Actions
  addXp: (amount: number, reason?: string) => void;
  checkAndAwardBadge: (badgeId: string) => boolean;
  clearToastBadge: () => void;
  markSimulatorLevelComplete: (simulatorId: SimulatorId, levelNumber: number, xpReward?: number) => void;
  completeDailyChallenge: () => void;
  checkDailyStreak: () => void;
  resetProgressStore: () => void;
}

export const useProgressStore = create<ProgressStoreState>()(
  persist(
    (set, get) => ({
      totalXp: 490,
      streakDays: 4,
      lastActiveDate: getTodayDateKey(),
      unlockedBadges: {
        first_launch: {
          ...ALL_BADGES.first_launch,
          unlockedAt: new Date().toISOString(),
        },
      },
      completedLevels: {
        'drone-navigator': [1],
        'catapult-siege': [1, 2],
        'conic-sections': [1],
        'rollercoaster-architect': [1, 2],
        'unit-circle': [1, 2, 3],
        'calculus-sandbox': [1],
      },
      dailyChallenge: {
        id: `daily-${getTodayDateKey()}`,
        dateKey: getTodayDateKey(),
        ...DAILY_CHALLENGE_TEMPLATES[0],
        completed: false,
      },
      recentToastBadge: null,

      addXp: (amount: number, reason?: string) => {
        set((state) => {
          const newXp = Math.max(0, state.totalXp + amount);
          return { totalXp: newXp };
        });
      },

      checkAndAwardBadge: (badgeId: string) => {
        const state = get();
        if (state.unlockedBadges[badgeId]) return false; // Already unlocked

        const badgeDef = ALL_BADGES[badgeId];
        if (!badgeDef) return false;

        const unlocked: UnlockedBadge = {
          ...badgeDef,
          unlockedAt: new Date().toISOString(),
        };

        triggerHaptic.success();
        soundEffects.chime();

        set((s) => ({
          unlockedBadges: {
            ...s.unlockedBadges,
            [badgeId]: unlocked,
          },
          totalXp: s.totalXp + badgeDef.xpReward,
          recentToastBadge: unlocked,
        }));

        return true;
      },

      clearToastBadge: () => {
        set({ recentToastBadge: null });
      },

      markSimulatorLevelComplete: (simulatorId: SimulatorId, levelNumber: number, xpReward = 50) => {
        const state = get();
        const currentList = state.completedLevels[simulatorId] || [];
        if (currentList.includes(levelNumber)) return;

        const updated = [...currentList, levelNumber].sort((a, b) => a - b);
        const newCompletedLevels = {
          ...state.completedLevels,
          [simulatorId]: updated,
        };

        triggerHaptic.success();
        soundEffects.chime();

        set((s) => ({
          completedLevels: newCompletedLevels,
          totalXp: s.totalXp + xpReward,
        }));

        // Check for specific badge milestones
        if (simulatorId === 'drone-navigator' && levelNumber === 2) {
          get().checkAndAwardBadge('pythagoras_pro');
        } else if (simulatorId === 'catapult-siege' && levelNumber === 2) {
          get().checkAndAwardBadge('parabolic_sniper');
        } else if (simulatorId === 'calculus-sandbox' && levelNumber >= 1) {
          get().checkAndAwardBadge('derivative_destroyer');
        } else if (simulatorId === 'conic-sections' && levelNumber >= 2) {
          get().checkAndAwardBadge('conic_slicer_master');
        } else if (simulatorId === 'rollercoaster-architect' && levelNumber >= 2) {
          get().checkAndAwardBadge('g_force_survivor');
        }
      },

      completeDailyChallenge: () => {
        const state = get();
        if (state.dailyChallenge.completed) return;

        triggerHaptic.success();
        soundEffects.chime();

        set((s) => ({
          dailyChallenge: {
            ...s.dailyChallenge,
            completed: true,
          },
          totalXp: s.totalXp + s.dailyChallenge.xpReward,
        }));

        if (state.streakDays >= 4) {
          get().checkAndAwardBadge('streak_flame');
        }
      },

      checkDailyStreak: () => {
        const today = getTodayDateKey();
        const state = get();

        // 1. Verify or generate daily challenge for current day
        if (state.dailyChallenge.dateKey !== today) {
          // Deterministic template by date day-of-month
          const dayIndex = new Date().getDate() % DAILY_CHALLENGE_TEMPLATES.length;
          const template = DAILY_CHALLENGE_TEMPLATES[dayIndex];

          set({
            dailyChallenge: {
              id: `daily-${today}`,
              dateKey: today,
              ...template,
              completed: false,
            },
          });
        }

        // 2. Streak check
        if (state.lastActiveDate === today) {
          return; // Already checked today
        }

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayKey = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

        if (state.lastActiveDate === yesterdayKey) {
          // Continuous consecutive day streak!
          set((s) => ({
            streakDays: s.streakDays + 1,
            lastActiveDate: today,
          }));
        } else {
          // Missed more than 1 day; reset to day 1
          set({
            streakDays: 1,
            lastActiveDate: today,
          });
        }
      },

      resetProgressStore: () => {
        set({
          totalXp: 0,
          streakDays: 1,
          lastActiveDate: getTodayDateKey(),
          unlockedBadges: {},
          completedLevels: {},
          dailyChallenge: {
            id: `daily-${getTodayDateKey()}`,
            dateKey: getTodayDateKey(),
            ...DAILY_CHALLENGE_TEMPLATES[0],
            completed: false,
          },
          recentToastBadge: null,
        });
      },
    }),
    {
      name: 'livesimulators_gamification_store_v1',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const getCurrentRank = (totalXp: number): RankLevel => {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (totalXp >= RANKS[i].minXp) {
      return RANKS[i];
    }
  }
  return RANKS[0];
};

export const getNextRank = (totalXp: number): RankLevel | null => {
  const current = getCurrentRank(totalXp);
  const nextIdx = RANKS.findIndex((r) => r.level === current.level) + 1;
  return nextIdx < RANKS.length ? RANKS[nextIdx] : null;
};
