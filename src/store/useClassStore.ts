/**
 * useClassStore: State management connecting Students and Educators via Class Codes (e.g., "MATH-42").
 * Tracks:
 * - Active Class Code joined by the student
 * - Teacher Roster / Roster of Students in the class
 * - Aggregated class submission records (mock and live submissions saved under the class code key)
 * - Struggling concepts analysis
 * Persists to localStorage under `livesimulators_classroom_data_v1`.
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { SimulatorId } from '../types/simulators';
import { triggerHaptic } from '../hooks/useHaptics';
import { soundEffects } from '../components/common/SoundManager';

export interface StudentSubmission {
  id: string;
  studentName: string;
  studentId: string;
  classCode: string;
  simulatorId: SimulatorId;
  simulatorTitle: string;
  levelNumber: number;
  score: number;
  timeSpentSeconds: number;
  passed: boolean;
  struggledAttempts: number;
  errorPattern?: string;
  completedAt: string;
}

export interface StudentRosterRecord {
  id: string;
  name: string;
  avatarSeed: string;
  totalXp: number;
  completedModules: SimulatorId[];
  strugglingConcept: string | null;
  lastActive: string;
  status: 'active' | 'idle' | 'struggling';
  accuracyRate: number; // percentage
}

export interface StrugglingConceptInsight {
  conceptKey: string;
  simulatorId: SimulatorId;
  title: string;
  failPercentage: number;
  affectedStudentsCount: number;
  diagnosis: string;
  recommendedAction: string;
}

export interface ClassStoreState {
  // Student side
  studentClassCode: string | null;
  studentName: string;
  joinedAt: string | null;

  // Teacher side
  activeTeacherCode: string;
  teacherName: string;
  className: string;
  roster: StudentRosterRecord[];
  submissions: StudentSubmission[];
  strugglingInsights: StrugglingConceptInsight[];

  // Actions
  joinClassWithCode: (code: string, name?: string) => { success: boolean; message: string };
  leaveClass: () => void;
  recordStudentSubmission: (submission: Omit<StudentSubmission, 'id' | 'completedAt'>) => void;
  regenerateClassCode: () => string;
  generateShareSummary: (simulatorTitle: string, levelNumber: number, xpEarned: number) => string;
}

const DEFAULT_TEACHER_CODE = 'MATH-42';

const MOCK_INITIAL_ROSTER: StudentRosterRecord[] = [
  {
    id: 'std-1',
    name: 'Aarav Sharma',
    avatarSeed: 'Aarav',
    totalXp: 720,
    completedModules: ['drone-navigator', 'catapult-siege', 'unit-circle'],
    strugglingConcept: null,
    lastActive: '10 mins ago',
    status: 'active',
    accuracyRate: 94,
  },
  {
    id: 'std-2',
    name: 'Sophia Chen',
    avatarSeed: 'Sophia',
    totalXp: 480,
    completedModules: ['drone-navigator', 'catapult-siege'],
    strugglingConcept: '3D Vector Cross Products',
    lastActive: '25 mins ago',
    status: 'struggling',
    accuracyRate: 68,
  },
  {
    id: 'std-3',
    name: 'Lucas Dupont',
    avatarSeed: 'Lucas',
    totalXp: 850,
    completedModules: ['drone-navigator', 'catapult-siege', 'conic-sections', 'rollercoaster-architect'],
    strugglingConcept: null,
    lastActive: '5 mins ago',
    status: 'active',
    accuracyRate: 98,
  },
  {
    id: 'std-4',
    name: 'Maya Patel',
    avatarSeed: 'Maya',
    totalXp: 340,
    completedModules: ['drone-navigator'],
    strugglingConcept: 'Quadratic Parabolic Focus & Directrix',
    lastActive: '1 hour ago',
    status: 'struggling',
    accuracyRate: 58,
  },
  {
    id: 'std-5',
    name: 'Ethan Miller',
    avatarSeed: 'Ethan',
    totalXp: 610,
    completedModules: ['drone-navigator', 'unit-circle', 'calculus-sandbox'],
    strugglingConcept: null,
    lastActive: '2 hours ago',
    status: 'idle',
    accuracyRate: 88,
  },
  {
    id: 'std-6',
    name: 'Zara Al-Mansoor',
    avatarSeed: 'Zara',
    totalXp: 390,
    completedModules: ['drone-navigator', 'catapult-siege'],
    strugglingConcept: 'Trig Wave Phase Shifting (sin vs cos)',
    lastActive: 'Just now',
    status: 'struggling',
    accuracyRate: 64,
  },
  {
    id: 'std-7',
    name: 'Noah Williams',
    avatarSeed: 'Noah',
    totalXp: 520,
    completedModules: ['drone-navigator', 'catapult-siege', 'rollercoaster-architect'],
    strugglingConcept: null,
    lastActive: 'Yesterday',
    status: 'idle',
    accuracyRate: 85,
  },
];

const INITIAL_INSIGHTS: StrugglingConceptInsight[] = [
  {
    conceptKey: 'vector-cross-product',
    simulatorId: 'vector-flight-lab',
    title: '3D Vector Cross Product & Orthogonality',
    failPercentage: 62,
    affectedStudentsCount: 14,
    diagnosis: 'Students frequently mix up the right-hand rule direction and parallel vector zero determinant.',
    recommendedAction: 'Project 3D Vector Flight Lab on the projector and demonstrate the torque plane normal vector.',
  },
  {
    conceptKey: 'conic-eccentricity',
    simulatorId: 'conic-sections',
    title: 'Eccentricity Thresholds (e = 1 vs e > 1)',
    failPercentage: 48,
    affectedStudentsCount: 11,
    diagnosis: 'Confusion between parabola boundary condition (e = 1) and unbounded two-nappe hyperbolas.',
    recommendedAction: 'Have students tilt the laser plane to match the cone generator angle α = θ.',
  },
  {
    conceptKey: 'calculus-inflection',
    simulatorId: 'calculus-sandbox',
    title: 'Zero Slope Extrema vs Saddle Points',
    failPercentage: 41,
    affectedStudentsCount: 9,
    diagnosis: 'Equating f\'(x) = 0 strictly to maximums without verifying the second derivative sign test.',
    recommendedAction: 'Demonstrate cubic inflection at the origin x = 0 with the tangent scrubber.',
  },
];

export const useClassStore = create<ClassStoreState>()(
  persist(
    (set, get) => ({
      studentClassCode: 'MATH-42',
      studentName: 'Alex Mercer',
      joinedAt: new Date().toISOString(),

      activeTeacherCode: DEFAULT_TEACHER_CODE,
      teacherName: 'Dr. Evelyn Reed',
      className: 'AP Mathematics & Physics — Period 3',
      roster: MOCK_INITIAL_ROSTER,
      submissions: [],
      strugglingInsights: INITIAL_INSIGHTS,

      joinClassWithCode: (rawCode: string, name?: string) => {
        const cleanCode = rawCode.trim().toUpperCase();
        if (!cleanCode || cleanCode.length < 4) {
          triggerHaptic.error();
          soundEffects.error();
          return { success: false, message: 'Please enter a valid class code (e.g. MATH-42)' };
        }

        const studentDisplayName = name?.trim() || get().studentName || 'Student';

        triggerHaptic.success();
        soundEffects.chime();

        set((state) => {
          // Check if student already in roster
          const existing = state.roster.find((r) => r.name.toLowerCase() === studentDisplayName.toLowerCase());
          let updatedRoster = state.roster;
          if (!existing) {
            updatedRoster = [
              {
                id: `std-${Date.now()}`,
                name: studentDisplayName,
                avatarSeed: studentDisplayName,
                totalXp: 490,
                completedModules: ['drone-navigator', 'catapult-siege'],
                strugglingConcept: null,
                lastActive: 'Just joined',
                status: 'active',
                accuracyRate: 90,
              },
              ...state.roster,
            ];
          }

          return {
            studentClassCode: cleanCode,
            studentName: studentDisplayName,
            joinedAt: new Date().toISOString(),
            roster: updatedRoster,
          };
        });

        return { 
          success: true, 
          message: `Successfully connected to class ${cleanCode}! Your simulation scores are now visible to your instructor.` 
        };
      },

      leaveClass: () => {
        set({ studentClassCode: null, joinedAt: null });
        triggerHaptic.selection();
      },

      recordStudentSubmission: (submissionData) => {
        const code = submissionData.classCode || get().studentClassCode || DEFAULT_TEACHER_CODE;
        const newSubmission: StudentSubmission = {
          ...submissionData,
          id: `sub-${Date.now()}`,
          classCode: code,
          completedAt: new Date().toISOString(),
        };

        set((state) => {
          const updatedSubmissions = [newSubmission, ...state.submissions];

          // Update student in roster
          const updatedRoster = state.roster.map((student) => {
            if (student.name.toLowerCase() === submissionData.studentName.toLowerCase()) {
              const currentMods = student.completedModules;
              const hasMod = currentMods.includes(submissionData.simulatorId);
              return {
                ...student,
                totalXp: student.totalXp + submissionData.score,
                completedModules: hasMod ? currentMods : [...currentMods, submissionData.simulatorId],
                lastActive: 'Just now',
                status: (submissionData.struggledAttempts > 2 ? 'struggling' : 'active') as StudentRosterRecord['status'],
              };
            }
            return student;
          });

          return {
            submissions: updatedSubmissions,
            roster: updatedRoster,
          };
        });
      },

      regenerateClassCode: () => {
        const prefixes = ['MATH', 'PHYS', 'CALC', 'TRIG', 'STEM'];
        const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const randomNum = Math.floor(10 + Math.random() * 89);
        const newCode = `${randomPrefix}-${randomNum}`;

        triggerHaptic.impact();
        set({ activeTeacherCode: newCode });
        return newCode;
      },

      generateShareSummary: (simulatorTitle: string, levelNumber: number, xpEarned: number) => {
        const state = get();
        const code = state.studentClassCode ? `[Class: ${state.studentClassCode}]` : '';
        const name = state.studentName || 'Student';

        return `🎯 Math Time Lab Achievement Unlocked!\n` +
          `Student: ${name} ${code}\n` +
          `Module: ${simulatorTitle} (Level ${levelNumber})\n` +
          `Score: +${xpEarned} XP · 100% Passed\n` +
          `Verified on Math Time Lab at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}\n` +
          `Interactive Math Simulation Labs: Math Time Lab`;
      },
    }),
    {
      name: 'livesimulators_classroom_data_v1',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
