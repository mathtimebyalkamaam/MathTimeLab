/**
 * TeacherDashboard: Educator Command Center accessible via `/teacher`.
 * Features:
 * - Generated Live Class Code (e.g., "MATH-42") with single-tap copy and code regenerate
 * - Top Struggling Concepts diagnostic widget with error insights and pedagogical recommendations
 * - Interactive Student Roster Grid with mastery badges, struggle alerts, and live XP
 * - Curriculum module completion matrix with per-level drilldowns
 * - JSON Export and classroom reset utilities
 */
import React, { useState } from 'react';
import { 
  Users, 
  GraduationCap, 
  Award, 
  Trophy,
  CheckCircle2, 
  RotateCcw, 
  Download, 
  Search, 
  Filter, 
  BarChart3, 
  Sparkles, 
  Clock, 
  Layers, 
  ArrowLeft,
  ChevronRight,
  TrendingUp,
  Flame,
  ShieldCheck,
  AlertCircle,
  Copy,
  Check,
  Share2,
  AlertTriangle,
  Lightbulb,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { useProgress } from '../../hooks/useProgress';
import { useProgressStore, ALL_BADGES } from '../../store/useProgressStore';
import { TeacherSmartboardToolkit } from '../common/TeacherSmartboardToolkit';
import { useClassStore } from '../../store/useClassStore';
import { useSimulatorStore } from '../../store/useSimulatorStore';
import { SIMULATORS } from '../../data/simulators';
import { SimulatorId } from '../../types/simulators';
import { useHaptics } from '../../hooks/useHaptics';
import { useSound } from '../common/SoundManager';

export const TeacherDashboard: React.FC = () => {
  const { progress, resetProgress, markLevelComplete } = useProgress();
  const { totalXp, streakDays, unlockedBadges, resetProgressStore } = useProgressStore();
  const { 
    activeTeacherCode, 
    teacherName, 
    className, 
    roster, 
    strugglingInsights,
    regenerateClassCode 
  } = useClassStore();
  const { navigateTo } = useSimulatorStore();
  const { lightTap, successBuzz } = useHaptics();
  const { playClick, playChime } = useSound();

  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [confirmReset, setConfirmReset] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'roster' | 'struggling' | 'curriculum'>('roster');

  const simulatorList = SIMULATORS;

  // Filtered simulators
  const filteredSimulators = simulatorList.filter((sim) => {
    const matchesGrade = selectedGrade === 'all' || sim.grade.toLowerCase().includes(selectedGrade.toLowerCase());
    const matchesSearch = sim.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sim.keyConcepts.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesGrade && matchesSearch;
  });

  // Filtered students
  const filteredRoster = roster.filter((student) => {
    return student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (student.strugglingConcept && student.strugglingConcept.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  // Analytics computation
  const totalLevelsPossible = simulatorList.length * 3;
  const totalLevelsCompleted = Object.values(progress.simulators).reduce(
    (acc, s) => acc + (s.levelsCompleted?.length || 0),
    0
  );
  const masteryPercentage = Math.round((totalLevelsCompleted / totalLevelsPossible) * 100);
  const fullyMasteredSimulators = Object.values(progress.simulators).filter(
    (s) => (s.levelsCompleted?.length || 0) >= 3
  ).length;

  const handleCopyCode = async () => {
    lightTap();
    playClick();
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(activeTeacherCode);
      }
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    } catch {
      setCopiedCode(true);
    }
  };

  const handleExportJSON = () => {
    const exportData = {
      classroom: {
        code: activeTeacherCode,
        teacher: teacherName,
        className,
        exportedAt: new Date().toISOString(),
      },
      roster,
      strugglingInsights,
      individualStudentProgress: progress,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `livesimulators_classroom_${activeTeacherCode}_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="w-full flex-1 bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 select-text overflow-y-auto">
      {/* Top Banner & Navigation */}
      <div className="w-full max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigateTo('home')}
              className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
              title="Return to Student View"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/80 font-mono text-[10px] font-bold uppercase tracking-wider">
                  Teacher Portal · /teacher
                </span>
                <span className="text-xs text-slate-500 font-mono">{className}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2 mt-0.5">
                <GraduationCap className="w-6 h-6 text-cyan-400" />
                <span>Instructor Command &amp; Classroom Analytics</span>
              </h1>
            </div>
          </div>

          {/* Quick Actions (Export, Reset, Back) */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleExportJSON}
              className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center justify-center gap-1.5 transition-colors touch-manipulation shadow-md"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>Export Class Gradebook</span>
            </button>

            {confirmReset ? (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    resetProgress();
                    resetProgressStore();
                    setConfirmReset(false);
                  }}
                  className="px-3 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs"
                >
                  Confirm Reset
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="px-2 py-2 rounded-xl bg-slate-800 text-slate-400 text-xs"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-rose-950/40 hover:border-rose-900 text-xs font-semibold text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
                title="Reset student test progress"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset Data</span>
              </button>
            )}
          </div>
        </div>

        {/* Feature 1: Generated Class Code Join Card */}
        <div className="w-full relative overflow-hidden rounded-3xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-sky-950/60 border border-cyan-500/40 p-4 sm:p-6 shadow-2xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase font-black tracking-widest px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  Student Join Code
                </span>
                <span className="text-xs text-slate-400">Share with students on your board</span>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <span className="text-3xl sm:text-4xl font-mono font-black text-white tracking-widest bg-slate-950/80 px-4 py-1.5 rounded-2xl border border-cyan-500/50 shadow-inner">
                  {activeTeacherCode}
                </span>

                <button
                  type="button"
                  onClick={handleCopyCode}
                  className={`py-2 px-3.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all touch-manipulation ${
                    copiedCode
                      ? 'bg-emerald-600 border-emerald-500 text-white'
                      : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 border-cyan-400'
                  }`}
                >
                  {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const newCode = regenerateClassCode();
                    playClick();
                  }}
                  className="text-xs text-slate-400 hover:text-white p-2 rounded-xl bg-slate-900 border border-slate-800 transition-colors"
                  title="Generate a new code"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Quick Student Invite Link Preview */}
            <div className="bg-slate-950/80 p-3 sm:p-4 rounded-2xl border border-slate-800 space-y-1.5 max-w-sm">
              <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>How students connect:</span>
              </span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Students open <strong className="text-cyan-300 font-mono">Math Time Lab</strong> &rarr; Click <strong className="text-white">Join Class</strong> &rarr; Enter <strong className="text-cyan-400 font-mono">{activeTeacherCode}</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Feature 2.5: Smartboard & 1-Click Lesson Sharing Toolkit */}
        <TeacherSmartboardToolkit />

        {/* Feature 3: Top Struggling Concept Diagnostic Widget */}
        <div className="w-full rounded-3xl bg-slate-900/90 border border-amber-500/30 p-4 sm:p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-white tracking-tight flex items-center gap-2">
                  <span>Top Struggling Concepts in Class</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    Live Diagnostic
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Real-time pattern analysis pinpointing where students fail challenges
                </p>
              </div>
            </div>

            <span className="text-xs text-slate-500 font-mono">
              Sample size: {roster.length} active students
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {strugglingInsights.map((insight) => (
              <div
                key={insight.conceptKey}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 hover:border-amber-500/50 transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">
                      {insight.simulatorId}
                    </span>
                    <span className="text-xs font-mono font-black text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-800/60">
                      {insight.failPercentage}% struggled
                    </span>
                  </div>

                  <h4 className="text-xs sm:text-sm font-bold text-white leading-snug">
                    {insight.title}
                  </h4>

                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {insight.diagnosis}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-900 space-y-2">
                  <div className="flex items-start gap-1.5 text-[11px] text-cyan-300 bg-cyan-950/30 p-2 rounded-xl border border-cyan-900/40">
                    <Lightbulb className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{insight.recommendedAction}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigateTo(insight.simulatorId)}
                    className="w-full py-1.5 px-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-[11px] font-semibold flex items-center justify-center gap-1 border border-slate-800 transition-colors"
                  >
                    <span>Launch Demonstrator</span>
                    <ExternalLink className="w-3 h-3 text-cyan-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* High-Level Class KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Overall Completion</span>
              <BarChart3 className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-black text-white font-mono">
              {masteryPercentage}%
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                style={{ width: `${masteryPercentage}%` }}
                className="bg-cyan-400 h-full rounded-full transition-all duration-500"
              />
            </div>
            <span className="text-[11px] text-slate-500 block pt-0.5">
              {totalLevelsCompleted} of {totalLevelsPossible} levels cleared
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Classroom XP Total</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-300 font-mono">
              {totalXp} XP
            </div>
            <span className="text-[11px] text-slate-500 block pt-1">
              Active Streak: <strong className="text-amber-400">{streakDays} Days</strong>
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Active Students</span>
              <Users className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-300 font-mono">
              {roster.length}
            </div>
            <span className="text-[11px] text-slate-500 block pt-1">
              Enrolled under code: <strong className="text-cyan-400 font-mono">{activeTeacherCode}</strong>
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Badges Earned</span>
              <Trophy className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-black text-purple-300 font-mono">
              {Object.keys(unlockedBadges).length} / {Object.keys(ALL_BADGES).length}
            </div>
            <span className="text-[11px] text-slate-500 block pt-1 truncate">
              Gamified achievements unlocked
            </span>
          </div>
        </div>

        {/* View Switcher Tabs: Student Roster vs. Curriculum Labs */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('roster')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                activeTab === 'roster'
                  ? 'bg-cyan-500 text-slate-950 font-black'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Student Roster &amp; Progress ({roster.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('curriculum')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                activeTab === 'curriculum'
                  ? 'bg-cyan-500 text-slate-950 font-black'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Curriculum Labs Matrix ({simulatorList.length})</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative w-48 sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search students or concepts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Feature 2: Student Progress Grid */}
        {activeTab === 'roster' ? (
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredRoster.map((student) => (
                <div
                  key={student.id}
                  className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500 to-sky-600 flex items-center justify-center font-bold text-slate-950 text-xs">
                          {student.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-white">
                            {student.name}
                          </h4>
                          <span className="text-[10px] text-slate-400 font-mono">
                            Active {student.lastActive}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-mono text-xs font-black text-amber-300">
                          {student.totalXp} XP
                        </span>
                        <div className="text-[10px] text-emerald-400 font-mono font-bold">
                          {student.accuracyRate}% acc
                        </div>
                      </div>
                    </div>

                    {/* Completed Modules Pill */}
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 uppercase font-mono block">
                        Completed Modules ({student.completedModules.length}):
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {student.completedModules.map((modId) => (
                          <span
                            key={modId}
                            className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-[10px] text-cyan-300 font-mono"
                          >
                            {modId}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Struggling Concept Alert */}
                    {student.strugglingConcept ? (
                      <div className="p-2 rounded-xl bg-amber-950/30 border border-amber-800/40 text-[11px] text-amber-300 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="truncate">Struggled: {student.strugglingConcept}</span>
                      </div>
                    ) : (
                      <div className="p-2 rounded-xl bg-emerald-950/20 border border-emerald-900/30 text-[11px] text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>All current competencies verified</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Curriculum Labs Matrix View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSimulators.map((sim) => {
              const record = progress.simulators[sim.id] || {
                levelsCompleted: [],
                attemptsCount: 0,
                isMastered: false,
                xpEarned: 0,
              };

              const completedLvls = record.levelsCompleted || [];

              return (
                <div
                  key={sim.id}
                  onClick={() => navigateTo(sim.id)}
                  className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col justify-between space-y-3 cursor-pointer group hover:shadow-cyan-950/20"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-full bg-slate-950 text-cyan-400 border border-slate-800 font-mono text-[10px] font-bold">
                        {sim.grade}
                      </span>

                      {record.isMastered ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono text-[10px] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>Mastered</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-slate-500">
                          {completedLvls.length} of 3 Levels
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {sim.title}
                    </h4>

                    {/* 3-Level Checklist */}
                    <div className="grid grid-cols-3 gap-1.5 pt-1">
                      {[1, 2, 3].map((lvlNum) => {
                        const done = completedLvls.includes(lvlNum);
                        return (
                          <div
                            key={lvlNum}
                            className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-0.5 ${
                              done
                                ? 'bg-emerald-950/40 border-emerald-700/60 text-emerald-300'
                                : 'bg-slate-900 border-slate-800 text-slate-500'
                            }`}
                          >
                            <div className="flex items-center gap-1">
                              {done ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <div className="w-3.5 h-3.5 rounded-full border border-slate-600" />
                              )}
                              <span className="text-[10px] font-mono font-bold">L{lvlNum}</span>
                            </div>
                            <span className="text-[8px] font-mono uppercase">
                              {done ? 'Pass' : 'Pending'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Footer Metadata & Direct Simulation Launch */}
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                    <div className="font-mono text-slate-400 text-[11px]">
                      XP: <strong className="text-amber-400">{record.xpEarned}</strong> · Attempts: {record.attemptsCount}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateTo(sim.id);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 group-hover:bg-cyan-500 group-hover:text-slate-950 text-cyan-300 font-bold text-xs flex items-center gap-1 transition-all touch-manipulation cursor-pointer"
                    >
                      <span>Launch</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
