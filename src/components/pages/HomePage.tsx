import React, { useState } from 'react';
import { 
  Sparkles, 
  Play, 
  CheckCircle2, 
  BookOpen, 
  Clock, 
  Navigation,
  Target,
  Orbit, 
  Activity, 
  TrendingUp, 
  Boxes,
  Zap,
  GraduationCap,
  Lightbulb,
  Compass,
  Layers,
  Trophy,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  ChevronRight,
  Globe,
  Scale,
  PieChart,
  Search,
  Filter,
  X,
  LayoutGrid,
  List,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { SIMULATORS } from '../../data/simulators';
import { getNcertMapping } from '../../data/ncertMappings';
import { useSimulatorStore } from '../../store/useSimulatorStore';
import { GradeLevel, SimulatorId } from '../../types/simulators';
import { DailyChallenge } from '../common/DailyChallenge';
import { BlockMath, InlineMath } from '../common/MathFormula';
import { useHaptics } from '../../hooks/useHaptics';
import { LiveHomeSimulatorSampler } from '../common/LiveHomeSimulatorSampler';
import { AudienceValueProposition } from '../common/AudienceValueProposition';
import { TeacherSmartboardToolkit } from '../common/TeacherSmartboardToolkit';
import { AuthorSpotlightSection } from '../common/AuthorSpotlightSection';
import { HowToLearnGuideRibbon } from '../common/HowToLearnGuideRibbon';
import { ClassGatewaysSection } from '../common/ClassGatewaysSection';

export const HomePage: React.FC = () => {
  const { 
    navigateTo, 
    gradeFilter, 
    setGradeFilter, 
    completedSimulators,
    xp,
    setActiveSheetTab,
    setBottomSheetSnap,
    setClass8OdysseyOpen,
    setSecretShortcutsOpen,
    openConceptQuizModal,
    setIsAuthorModalOpen
  } = useSimulatorStore();

  const { lightTap } = useHaptics();

  // Selected student doubt for the Coach's Desk
  const [selectedDoubtTopic, setSelectedDoubtTopic] = useState<SimulatorId>('drone-navigator');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [desktopViewMode, setDesktopViewMode] = useState<'grid' | 'compact'>('grid');
  const [mobileViewMode, setMobileViewMode] = useState<'cards' | 'list'>('list');
  const [isMobileCoachDeskOpen, setIsMobileCoachDeskOpen] = useState(false);

  const filteredSimulators = SIMULATORS.filter((sim) => {
    // Grade filter
    if (gradeFilter === 'class-8' && sim.gradeNumber !== 8) return false;
    if (gradeFilter === 'class-9' && sim.gradeNumber !== 9) return false;
    if (gradeFilter === 'class-10' && sim.gradeNumber !== 10) return false;
    if (gradeFilter === 'class-11' && sim.gradeNumber !== 11) return false;
    if (gradeFilter === 'class-12' && sim.gradeNumber !== 12) return false;

    // Category filter
    if (categoryFilter !== 'all' && sim.category !== categoryFilter) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = sim.title.toLowerCase().includes(q) || sim.shortTitle.toLowerCase().includes(q);
      const matchDesc = sim.description.toLowerCase().includes(q);
      const matchCategory = sim.category.toLowerCase().includes(q);
      const matchGrade = sim.grade.toLowerCase().includes(q);
      const matchConcepts = sim.keyConcepts.some((c) => c.toLowerCase().includes(q));

      // Multi-Board Curriculum mapping query match
      const ncert = getNcertMapping(sim.id);
      const matchCurriculum = ncert && (
        ncert.chapterName.toLowerCase().includes(q) ||
        `ch ${ncert.chapterNumber}`.includes(q) ||
        `chapter ${ncert.chapterNumber}`.includes(q) ||
        `ch${ncert.chapterNumber}`.includes(q) ||
        ncert.exerciseReference.toLowerCase().includes(q) ||
        ncert.curriculumTopics.some((t) => t.toLowerCase().includes(q))
      );
      const matchBoards = q === 'cbse' || q === 'icse' || q === 'state board' || q === 'ncert' || q === 'boards';

      if (!matchTitle && !matchDesc && !matchCategory && !matchGrade && !matchConcepts && !matchCurriculum && !matchBoards) {
        return false;
      }
    }

    return true;
  });

  // Group simulators by grade for fast access and curated mobile shelves
  const class8Sims = SIMULATORS.filter((s) => s.gradeNumber === 8);
  const class9Sims = SIMULATORS.filter((s) => s.gradeNumber === 9);
  const class10Sims = SIMULATORS.filter((s) => s.gradeNumber === 10);
  const class11Sims = SIMULATORS.filter((s) => s.gradeNumber === 11);
  const class12Sims = SIMULATORS.filter((s) => s.gradeNumber === 12);

  const CLASS_SHELVES = [
    {
      gradeId: 'class-8' as GradeLevel,
      gradeNumber: 8,
      name: 'Class 8',
      title: 'Foundations of Algebra & Geometry',
      emoji: '📐',
      desc: 'Linear balances, algebra tiles, Euler 3D solids & interest',
      simulators: class8Sims,
    },
    {
      gradeId: 'class-9' as GradeLevel,
      gradeNumber: 9,
      name: 'Class 9',
      title: 'Cartesian Planes, Triangles & Chords',
      emoji: '🎯',
      desc: 'Drone coordinates, catapult trajectory, circle chords & Heron',
      simulators: class9Sims,
    },
    {
      gradeId: 'class-10' as GradeLevel,
      gradeNumber: 10,
      name: 'Class 10',
      title: 'Board Exam Masterclass & Trigonometry',
      emoji: '🏹',
      desc: 'Circle tangents, clinometer trig, quadratic parabolas & AP',
      simulators: class10Sims,
    },
    {
      gradeId: 'class-11' as GradeLevel,
      gradeNumber: 11,
      name: 'Class 11',
      title: 'Vectors, Conics & Limits',
      emoji: '🪐',
      desc: 'Unit circle waves, 3D vectors, conic sections & derivatives',
      simulators: class11Sims,
    },
    {
      gradeId: 'class-12' as GradeLevel,
      gradeNumber: 12,
      name: 'Class 12',
      title: 'Calculus, 3D Geometry & Probability',
      emoji: '📦',
      desc: 'Riemann integrals, 3D planes, Bayes theorem & diff equations',
      simulators: class12Sims,
    },
  ];

  const featuredSim = SIMULATORS.find((s) => s.id === 'circle-tangents-lab') || SIMULATORS[0];

  const getSimulatorIcon = (id: SimulatorId) => {
    switch (id) {
      case 'drone-navigator':
        return Navigation;
      case 'catapult-siege':
        return Target;
      case 'conic-sections':
        return Orbit;
      case 'unit-circle':
        return Activity;
      case 'calculus-sandbox':
      case 'rollercoaster-architect':
        return TrendingUp;
      case 'vector-flight-lab':
        return Boxes;
      case 'argand-plane':
        return Compass;
      case 'matrix-meme':
        return Layers;
      case 'monty-hall':
        return Trophy;
      case 'similar-triangles':
        return Compass;
      case 'ftc-integral-accumulator':
        return TrendingUp;
      case 'bayes-probability-lab':
        return HelpCircle;
      case 'euclidean-geometry-sandbox':
        return Globe;
      case 'three-d-geometry-lab':
        return Boxes;
      case 'differential-equations-lab':
        return Activity;
      case 'balance-scale-equations':
        return Scale;
      case 'algebraic-identities-tiles':
        return Layers;
      case 'compound-interest-engine':
        return TrendingUp;
      case 'quadrilateral-morpher':
        return Compass;
      case 'euler-polyhedra-3d':
        return Boxes;
      case 'direct-inverse-proportions':
        return Activity;
      case 'dynamic-pie-chart':
        return PieChart;
      case 'square-roots-triplets':
        return Target;
      case 'exponents-powers-lab':
        return Zap;
      case 'rational-numbers-density':
        return Scale;
      case 'triangle-congruence-forge':
        return Target;
      case 'arithmetic-progression-lab':
        return TrendingUp;
      case 'coordinate-section-formula':
        return Navigation;
      case 'circle-tangents-lab':
        return Orbit;
      case 'mathematical-induction-dominos':
        return Layers;
      case 'trig-equations-radial':
        return Activity;
      case 'linear-programming-lab':
        return Target;
      case 'probability-distribution-lab':
        return HelpCircle;
      default:
        return GraduationCap;
    }
  };

  const getSimulatorPreviewGraphic = (id: SimulatorId) => {
    switch (id) {
      case 'drone-navigator':
        return (
          <div className="w-full h-32 sm:h-36 bg-gradient-to-br from-slate-900 via-sky-950/40 to-slate-900 rounded-xl relative overflow-hidden flex items-center justify-center border border-sky-900/30">
            <svg viewBox="0 0 220 120" className="w-52 h-28 stroke-cyan-400 fill-none">
              <line x1="20" y1="100" x2="200" y2="100" stroke="#334155" strokeWidth="1" />
              <line x1="40" y1="20" x2="40" y2="100" stroke="#334155" strokeWidth="1" />
              <circle cx="105" cy="65" r="22" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3 3" fill="rgba(239, 68, 68, 0.12)" />
              <text x="92" y="68" fill="#f87171" fontSize="8" fontFamily="monospace">⊘ NFZ</text>
              <line x1="40" y1="100" x2="160" y2="100" stroke="#38bdf8" strokeWidth="2.5" />
              <line x1="160" y1="100" x2="160" y2="35" stroke="#10b981" strokeWidth="2.5" />
              <polyline points="150,100 150,90 160,90" stroke="#64748b" strokeWidth="1" />
              <line x1="40" y1="100" x2="160" y2="35" stroke="#f43f5e" strokeWidth="2.5" />
              <circle cx="40" cy="100" r="4" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
              <circle cx="160" cy="35" r="6" stroke="#f59e0b" strokeWidth="1.5" />
            </svg>
            <div className="absolute bottom-2 left-2 text-[10px] font-mono text-cyan-300 bg-slate-950/80 px-2 py-0.5 rounded">
              Δx = 6 · Δy = 8 · d = 10.0 u
            </div>
          </div>
        );
      case 'catapult-siege':
        return (
          <div className="w-full h-32 sm:h-36 bg-gradient-to-br from-slate-900 via-amber-950/30 to-slate-900 rounded-xl relative overflow-hidden flex items-center justify-center border border-amber-900/30">
            <svg viewBox="0 0 220 120" className="w-52 h-28 stroke-cyan-400 fill-none">
              <line x1="10" y1="100" x2="210" y2="100" stroke="#475569" strokeWidth="2" />
              <polygon points="30,100 40,75 50,100" stroke="#b45309" strokeWidth="2" fill="rgba(180,83,9,0.2)" />
              <line x1="40" y1="75" x2="62" y2="55" stroke="#f59e0b" strokeWidth="2.5" />
              <path d="M 62 55 Q 110 15, 150 40 T 190 100" stroke="#34d399" strokeWidth="2" strokeDasharray="3 3" />
              <rect x="145" y="45" width="12" height="55" fill="#475569" stroke="#64748b" strokeWidth="1.5" />
              <circle cx="165" cy="50" r="5" fill="#34d399" stroke="#ffffff" strokeWidth="1.5" />
            </svg>
            <div className="absolute bottom-2 left-2 text-[10px] font-mono text-amber-300 bg-slate-950/80 px-2 py-0.5 rounded">
              θ = 45° · Opp = 18.4 · Adj = 18.4
            </div>
          </div>
        );
      case 'conic-sections':
        return (
          <div className="w-full h-32 sm:h-36 bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 rounded-xl relative overflow-hidden flex items-center justify-center border border-indigo-900/30">
            <svg viewBox="0 0 200 120" className="w-44 h-28 stroke-cyan-400 fill-none">
              <polygon points="100,60 40,10 160,10" stroke="#334155" strokeWidth="1.5" strokeDasharray="3 3" />
              <polygon points="100,60 40,110 160,110" stroke="#334155" strokeWidth="1.5" />
              <line x1="30" y1="35" x2="170" y2="75" stroke="#f43f5e" strokeWidth="2.5" />
              <ellipse cx="100" cy="55" rx="35" ry="14" transform="rotate(16 100 55)" stroke="#38bdf8" strokeWidth="2.5" fill="rgba(56, 189, 248, 0.15)" />
            </svg>
            <div className="absolute bottom-2 left-2 text-[10px] font-mono text-cyan-300 bg-slate-950/80 px-2 py-0.5 rounded">
              θ = 35° · Ellipse e = 0.57
            </div>
          </div>
        );
      case 'unit-circle':
        return (
          <div className="w-full h-32 sm:h-36 bg-gradient-to-br from-slate-900 via-sky-950/40 to-slate-900 rounded-xl relative overflow-hidden flex items-center justify-center border border-sky-900/30">
            <svg viewBox="0 0 240 120" className="w-56 h-28 stroke-cyan-400 fill-none">
              <circle cx="60" cy="60" r="42" stroke="#475569" strokeWidth="1.5" />
              <line x1="12" y1="60" x2="108" y2="60" stroke="#334155" strokeWidth="1" />
              <line x1="60" y1="12" x2="60" y2="108" stroke="#334155" strokeWidth="1" />
              <line x1="60" y1="60" x2="89.7" y2="30.3" stroke="#f59e0b" strokeWidth="2" />
              <line x1="89.7" y1="60" x2="89.7" y2="30.3" stroke="#38bdf8" strokeWidth="2.5" />
              <line x1="60" y1="60" x2="89.7" y2="60" stroke="#10b981" strokeWidth="2" />
              <path d="M 120 60 Q 140 25, 160 60 T 200 60 T 240 60" stroke="#38bdf8" strokeWidth="2.5" />
            </svg>
            <div className="absolute bottom-2 left-2 text-[10px] font-mono text-amber-300 bg-slate-950/80 px-2 py-0.5 rounded">
              θ = 45° · sin(45°) = 0.707
            </div>
          </div>
        );
      case 'calculus-sandbox':
        return (
          <div className="w-full h-32 sm:h-36 bg-gradient-to-br from-slate-900 via-emerald-950/30 to-slate-900 rounded-xl relative overflow-hidden flex items-center justify-center border border-emerald-900/30">
            <svg viewBox="0 0 220 120" className="w-48 h-28 stroke-cyan-400 fill-none">
              <line x1="20" y1="100" x2="200" y2="100" stroke="#334155" strokeWidth="1" />
              <line x1="70" y1="15" x2="70" y2="105" stroke="#334155" strokeWidth="1" />
              <rect x="70" y="85" width="22" height="15" fill="rgba(16, 185, 129, 0.25)" stroke="#10b981" strokeWidth="1" />
              <rect x="92" y="65" width="22" height="35" fill="rgba(16, 185, 129, 0.25)" stroke="#10b981" strokeWidth="1" />
              <rect x="114" y="38" width="22" height="62" fill="rgba(16, 185, 129, 0.25)" stroke="#10b981" strokeWidth="1" />
              <rect x="136" y="20" width="22" height="80" fill="rgba(16, 185, 129, 0.25)" stroke="#10b981" strokeWidth="1" />
              <path d="M 30 95 Q 85 90, 160 15" stroke="#38bdf8" strokeWidth="2.5" />
              <line x1="80" y1="90" x2="150" y2="25" stroke="#f43f5e" strokeWidth="2" strokeDasharray="3 2" />
            </svg>
            <div className="absolute bottom-2 left-2 text-[10px] font-mono text-emerald-300 bg-slate-950/80 px-2 py-0.5 rounded">
              f'(1) = 2.00 · ∫[0,2] = 2.67
            </div>
          </div>
        );
      case 'rollercoaster-architect':
        return (
          <div className="w-full h-32 sm:h-36 bg-gradient-to-br from-slate-900 via-sky-950/30 to-slate-900 rounded-xl relative overflow-hidden flex items-center justify-center border border-sky-900/30">
            <svg viewBox="0 0 220 120" className="w-48 h-28 stroke-cyan-400 fill-none">
              <line x1="10" y1="105" x2="210" y2="105" stroke="#334155" strokeWidth="2" />
              <path d="M 20 105 L 20 30 Q 55 95, 85 85 T 140 45 T 200 65 L 200 105 Z" fill="rgba(56, 189, 248, 0.15)" stroke="none" />
              <path d="M 20 30 Q 55 95, 85 85 T 140 45 T 200 65" stroke="#38bdf8" strokeWidth="2.5" />
              <line x1="65" y1="75" x2="105" y2="95" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 2" />
              <rect x="80" y="80" width="12" height="7" rx="2" fill="#10b981" stroke="#ffffff" strokeWidth="1" />
            </svg>
            <div className="absolute bottom-2 left-2 text-[10px] font-mono text-cyan-300 bg-slate-950/80 px-2 py-0.5 rounded">
              v = 20 m/s · f'(x) · Area = 480 u²
            </div>
          </div>
        );
      case 'vector-flight-lab':
        return (
          <div className="w-full h-32 sm:h-36 bg-gradient-to-br from-slate-900 via-purple-950/30 to-slate-900 rounded-xl relative overflow-hidden flex items-center justify-center border border-purple-900/30">
            <svg viewBox="0 0 200 120" className="w-44 h-28 stroke-cyan-400 fill-none">
              <line x1="100" y1="70" x2="170" y2="90" stroke="#334155" strokeWidth="1" />
              <line x1="100" y1="70" x2="30" y2="90" stroke="#334155" strokeWidth="1" />
              <line x1="100" y1="70" x2="100" y2="15" stroke="#334155" strokeWidth="1" />
              <polygon points="100,70 155,50 125,25 70,45" fill="rgba(168, 85, 247, 0.2)" stroke="#a855f7" strokeWidth="1.5" />
              <line x1="100" y1="70" x2="155" y2="50" stroke="#38bdf8" strokeWidth="2.5" />
              <line x1="100" y1="70" x2="70" y2="45" stroke="#f59e0b" strokeWidth="2.5" />
              <line x1="100" y1="70" x2="100" y2="20" stroke="#ec4899" strokeWidth="3" />
            </svg>
            <div className="absolute bottom-2 left-2 text-[10px] font-mono text-purple-300 bg-slate-950/80 px-2 py-0.5 rounded">
              |u × v| = 5.24 · u · v = 3.82
            </div>
          </div>
        );
      case 'argand-plane':
        return (
          <div className="w-full h-32 sm:h-36 bg-gradient-to-br from-slate-900 via-cyan-950/30 to-slate-900 rounded-xl relative overflow-hidden flex items-center justify-center border border-cyan-900/30">
            <svg viewBox="0 0 220 120" className="w-48 h-28 stroke-cyan-400 fill-none">
              <line x1="20" y1="60" x2="200" y2="60" stroke="#334155" strokeWidth="1" />
              <line x1="110" y1="10" x2="110" y2="110" stroke="#334155" strokeWidth="1" />
              <text x="190" y="55" fill="#64748b" fontSize="8" fontFamily="monospace">Re</text>
              <text x="114" y="20" fill="#64748b" fontSize="8" fontFamily="monospace">Im</text>
              <line x1="110" y1="60" x2="160" y2="35" stroke="#38bdf8" strokeWidth="2.5" />
              <circle cx="160" cy="35" r="4" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
              <line x1="110" y1="60" x2="85" y2="10" stroke="#c084fc" strokeWidth="2.5" />
              <circle cx="85" cy="10" r="4" fill="#c084fc" stroke="#ffffff" strokeWidth="1.5" />
              <path d="M 135 48 A 28 28 0 0 0 98 35" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 2" />
            </svg>
            <div className="absolute bottom-2 left-2 text-[10px] font-mono text-cyan-300 bg-slate-950/80 px-2 py-0.5 rounded">
              z = 3+2i · i·z = -2+3i (+90°)
            </div>
          </div>
        );
      case 'matrix-meme':
        return (
          <div className="w-full h-32 sm:h-36 bg-gradient-to-br from-slate-900 via-pink-950/30 to-slate-900 rounded-xl relative overflow-hidden flex items-center justify-center border border-pink-900/30">
            <svg viewBox="0 0 220 120" className="w-48 h-28 stroke-cyan-400 fill-none">
              <line x1="20" y1="60" x2="200" y2="60" stroke="#334155" strokeWidth="1" />
              <line x1="110" y1="10" x2="110" y2="110" stroke="#334155" strokeWidth="1" />
              <rect x="110" y="30" width="30" height="30" fill="none" stroke="#475569" strokeWidth="1" strokeDasharray="2 2" />
              <polygon points="110,60 150,45 130,15 90,30" fill="rgba(244, 63, 94, 0.2)" stroke="#f43f5e" strokeWidth="2" />
              <line x1="110" y1="60" x2="150" y2="45" stroke="#38bdf8" strokeWidth="2.5" />
              <line x1="110" y1="60" x2="90" y2="30" stroke="#34d399" strokeWidth="2.5" />
            </svg>
            <div className="absolute bottom-2 left-2 text-[10px] font-mono text-pink-300 bg-slate-950/80 px-2 py-0.5 rounded">
              [a,b;c,d] · det(A) = ad - bc
            </div>
          </div>
        );
      case 'monty-hall':
        return (
          <div className="w-full h-32 sm:h-36 bg-gradient-to-br from-slate-900 via-amber-950/30 to-slate-900 rounded-xl relative overflow-hidden flex items-center justify-center border border-amber-900/30">
            <svg viewBox="0 0 220 120" className="w-52 h-28 stroke-cyan-400 fill-none">
              <rect x="25" y="25" width="45" height="70" rx="4" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
              <text x="40" y="65" fill="#38bdf8" fontSize="14" fontWeight="bold">#1</text>
              <rect x="85" y="25" width="45" height="70" rx="4" fill="rgba(16, 185, 129, 0.25)" stroke="#10b981" strokeWidth="2.5" />
              <text x="96" y="55" fill="#10b981" fontSize="12" fontWeight="bold">🏎️</text>
              <text x="94" y="80" fill="#34d399" fontSize="8" fontWeight="bold">2/3</text>
              <rect x="145" y="25" width="45" height="70" rx="4" fill="#0f172a" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 3" />
              <text x="156" y="65" fill="#94a3b8" fontSize="12">🐐</text>
            </svg>
            <div className="absolute bottom-2 left-2 text-[10px] font-mono text-emerald-300 bg-slate-950/80 px-2 py-0.5 rounded">
              Switch: 66.7% vs Stay: 33.3%
            </div>
          </div>
        );
      case 'quadratic-roots':
        return (
          <div className="w-full h-32 sm:h-36 bg-gradient-to-br from-slate-900 via-emerald-950/30 to-slate-900 rounded-xl relative overflow-hidden flex items-center justify-center border border-emerald-900/30">
            <svg viewBox="0 0 220 120" className="w-48 h-28 stroke-cyan-400 fill-none">
              <line x1="20" y1="75" x2="200" y2="75" stroke="#334155" strokeWidth="1.5" />
              <line x1="110" y1="15" x2="110" y2="105" stroke="#334155" strokeWidth="1" />
              <line x1="110" y1="15" x2="110" y2="105" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="3 2" />
              {/* Parabola y = x^2 - 2x - 3 */}
              <path d="M 40 15 Q 110 135, 180 15" stroke="#38bdf8" strokeWidth="2.5" />
              {/* Roots markers */}
              <circle cx="65" cy="75" r="4.5" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
              <circle cx="155" cy="75" r="4.5" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
              {/* Vertex */}
              <circle cx="110" cy="98" r="3.5" fill="#c084fc" />
            </svg>
            <div className="absolute bottom-2 left-2 text-[10px] font-mono text-emerald-300 bg-slate-950/80 px-2 py-0.5 rounded">
              D = b² - 4ac &gt; 0 · Roots α, β
            </div>
          </div>
        );
      case 'circle-theorems':
        return (
          <div className="w-full h-32 sm:h-36 bg-gradient-to-br from-slate-900 via-sky-950/30 to-slate-900 rounded-xl relative overflow-hidden flex items-center justify-center border border-sky-900/30">
            <svg viewBox="0 0 220 120" className="w-48 h-28 stroke-cyan-400 fill-none">
              {/* Circle */}
              <circle cx="85" cy="60" r="38" stroke="#38bdf8" strokeWidth="2.5" />
              {/* Radii OA, OB */}
              <line x1="85" y1="60" x2="105" y2="28" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="3 2" />
              <line x1="85" y1="60" x2="105" y2="92" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 2" />
              {/* Line OP */}
              <line x1="85" y1="60" x2="185" y2="60" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 3" />
              {/* Tangents PA and PB */}
              <line x1="185" y1="60" x2="105" y2="28" stroke="#22d3ee" strokeWidth="2.5" />
              <line x1="185" y1="60" x2="105" y2="92" stroke="#fbbf24" strokeWidth="2.5" />
              {/* Points */}
              <circle cx="85" cy="60" r="3.5" fill="#ffffff" />
              <circle cx="105" cy="28" r="4" fill="#06b6d4" />
              <circle cx="105" cy="92" r="4" fill="#f59e0b" />
              <circle cx="185" cy="60" r="5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
            </svg>
            <div className="absolute bottom-2 left-2 text-[10px] font-mono text-cyan-300 bg-slate-950/80 px-2 py-0.5 rounded">
              PA = PB = √(d² - R²) · 90°
            </div>
          </div>
        );
      case 'linear-systems':
        return (
          <div className="w-full h-32 sm:h-36 bg-gradient-to-br from-slate-900 via-amber-950/30 to-slate-900 rounded-xl relative overflow-hidden flex items-center justify-center border border-amber-900/30">
            <svg viewBox="0 0 220 120" className="w-48 h-28 stroke-cyan-400 fill-none">
              {/* Axes */}
              <line x1="20" y1="60" x2="200" y2="60" stroke="#334155" strokeWidth="1" />
              <line x1="110" y1="15" x2="110" y2="105" stroke="#334155" strokeWidth="1" />
              {/* Line 1 (Cyan) */}
              <line x1="30" y1="95" x2="190" y2="25" stroke="#38bdf8" strokeWidth="2.5" />
              {/* Line 2 (Amber) */}
              <line x1="40" y1="20" x2="180" y2="100" stroke="#f59e0b" strokeWidth="2.5" />
              {/* Intersection crosshair */}
              <circle cx="118" cy="56" r="6" stroke="#ec4899" strokeWidth="2" />
              <circle cx="118" cy="56" r="2.5" fill="#ec4899" />
            </svg>
            <div className="absolute bottom-2 left-2 text-[10px] font-mono text-amber-300 bg-slate-950/80 px-2 py-0.5 rounded">
              Crossroads: (x*, y*) · a₁/a₂ ≠ b₁/b₂
            </div>
          </div>
        );
      case 'trig-heights':
        return (
          <div className="w-full h-32 sm:h-36 bg-gradient-to-br from-slate-900 via-cyan-950/30 to-slate-900 rounded-xl relative overflow-hidden flex items-center justify-center border border-cyan-900/30">
            <svg viewBox="0 0 220 120" className="w-48 h-28 stroke-cyan-400 fill-none">
              {/* Ground */}
              <line x1="10" y1="100" x2="210" y2="100" stroke="#334155" strokeWidth="1.5" />
              {/* Tower / Lighthouse */}
              <polygon points="180,100 176,35 184,35 188,100" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
              <circle cx="180" cy="30" r="4.5" fill="#f59e0b" />
              {/* Observer */}
              <circle cx="45" cy="94" r="3.5" fill="#38bdf8" />
              <line x1="45" cy="94" x2="40" y2="100" stroke="#64748b" strokeWidth="1.5" />
              <line x1="45" cy="94" x2="50" y2="100" stroke="#64748b" strokeWidth="1.5" />
              {/* Sightline */}
              <line x1="45" cy="94" x2="180" y2="30" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 2" />
              {/* Angle arc */}
              <path d="M 68 94 A 23 23 0 0 0 62 82" stroke="#f59e0b" strokeWidth="1.5" />
            </svg>
            <div className="absolute bottom-2 left-2 text-[10px] font-mono text-cyan-300 bg-slate-950/80 px-2 py-0.5 rounded">
              h = d · tan(θ) · 30° / 60°
            </div>
          </div>
        );
      case 'heron-triangles':
        return (
          <div className="w-full h-32 sm:h-36 bg-gradient-to-br from-slate-900 via-emerald-950/30 to-slate-900 rounded-xl relative overflow-hidden flex items-center justify-center border border-emerald-900/30">
            <svg viewBox="0 0 220 120" className="w-48 h-28 stroke-cyan-400 fill-none">
              {/* Triangle ABC */}
              <polygon points="40,95 180,95 110,25" fill="rgba(56, 189, 248, 0.15)" stroke="#38bdf8" strokeWidth="2.5" />
              {/* Incircle */}
              <circle cx="110" cy="72" r="23" stroke="#34d399" strokeWidth="2" fill="rgba(52, 211, 153, 0.15)" />
              <circle cx="110" cy="72" r="3" fill="#34d399" />
              {/* Altitude dashed */}
              <line x1="110" y1="25" x2="110" y2="95" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 3" />
              {/* Vertices */}
              <circle cx="40" cy="95" r="3.5" fill="#38bdf8" />
              <circle cx="180" cy="95" r="3.5" fill="#fbbf24" />
              <circle cx="110" cy="25" r="3.5" fill="#c084fc" />
            </svg>
            <div className="absolute bottom-2 left-2 text-[10px] font-mono text-emerald-300 bg-slate-950/80 px-2 py-0.5 rounded">
              Δ = √[s(s-a)(s-b)(s-c)] · r = Δ/s
            </div>
          </div>
        );
      case 'polynomial-factorizer':
        return (
          <div className="w-full h-32 sm:h-36 bg-gradient-to-br from-slate-900 via-sky-950/30 to-slate-900 rounded-xl relative overflow-hidden flex items-center justify-center border border-sky-900/30">
            <svg viewBox="0 0 220 120" className="w-48 h-28 stroke-cyan-400 fill-none">
              {/* Composite rectangle */}
              <rect x="50" y="25" width="60" height="60" fill="rgba(6, 182, 212, 0.25)" stroke="#06b6d4" strokeWidth="2" />
              <rect x="110" y="25" width="45" height="60" fill="rgba(56, 189, 248, 0.25)" stroke="#38bdf8" strokeWidth="1.5" />
              <rect x="50" y="85" width="60" height="25" fill="rgba(245, 158, 11, 0.25)" stroke="#f59e0b" strokeWidth="1.5" />
              <rect x="110" y="85" width="45" height="25" fill="rgba(16, 185, 129, 0.3)" stroke="#10b981" strokeWidth="1.5" />
              <text x="75" y="60" fill="#22d3ee" fontSize="12" fontWeight="bold">x²</text>
              <text x="125" y="60" fill="#38bdf8" fontSize="10">px</text>
              <text x="75" y="102" fill="#fbbf24" fontSize="10">qx</text>
              <text x="125" y="102" fill="#34d399" fontSize="10" fontWeight="bold">pq</text>
            </svg>
            <div className="absolute bottom-2 left-2 text-[10px] font-mono text-cyan-300 bg-slate-950/80 px-2 py-0.5 rounded">
              (x+p)(x+q) = x² + (p+q)x + pq
            </div>
          </div>
        );
      case 'lines-angles':
        return (
          <div className="w-full h-32 sm:h-36 bg-gradient-to-br from-slate-900 via-amber-950/30 to-slate-900 rounded-xl relative overflow-hidden flex items-center justify-center border border-amber-900/30">
            <svg viewBox="0 0 220 120" className="w-48 h-28 stroke-cyan-400 fill-none">
              {/* Parallel lines */}
              <line x1="20" y1="40" x2="200" y2="40" stroke="#38bdf8" strokeWidth="2.5" />
              <line x1="20" y1="85" x2="200" y2="85" stroke="#38bdf8" strokeWidth="2.5" />
              {/* Transversal */}
              <line x1="60" y1="110" x2="160" y2="15" stroke="#f59e0b" strokeWidth="2.5" />
              {/* Z-shape dashed */}
              <path d="M 60 40 L 135 40 L 85 85 L 160 85" stroke="#c084fc" strokeWidth="1.5" strokeDasharray="3 2" />
              {/* Angle arcs */}
              <circle cx="135" cy="40" r="4" fill="#38bdf8" />
              <circle cx="85" cy="85" r="4" fill="#f59e0b" />
            </svg>
            <div className="absolute bottom-2 left-2 text-[10px] font-mono text-amber-300 bg-slate-950/80 px-2 py-0.5 rounded">
              Z-Shape: Alt. Interior · θ = θ
            </div>
          </div>
        );
      case 'binomial-galton':
        return (
          <div className="w-full h-32 sm:h-36 bg-gradient-to-br from-slate-900 via-purple-950/30 to-slate-900 rounded-xl relative overflow-hidden flex items-center justify-center border border-purple-900/30">
            <svg viewBox="0 0 220 120" className="w-48 h-28 stroke-cyan-400 fill-none">
              {/* Pegs */}
              <circle cx="110" cy="20" r="3.5" fill="#38bdf8" />
              <circle cx="95" cy="40" r="3.5" fill="#38bdf8" />
              <circle cx="125" cy="40" r="3.5" fill="#38bdf8" />
              <circle cx="80" cy="60" r="3.5" fill="#38bdf8" />
              <circle cx="110" cy="60" r="3.5" fill="#38bdf8" />
              <circle cx="140" cy="60" r="3.5" fill="#38bdf8" />
              {/* Bins bars */}
              <rect x="65" y="90" width="18" height="15" fill="rgba(168, 85, 247, 0.4)" stroke="#c084fc" strokeWidth="1" />
              <rect x="87" y="78" width="18" height="27" fill="rgba(168, 85, 247, 0.5)" stroke="#c084fc" strokeWidth="1" />
              <rect x="109" y="65" width="18" height="40" fill="rgba(168, 85, 247, 0.7)" stroke="#c084fc" strokeWidth="1" />
              <rect x="131" y="78" width="18" height="27" fill="rgba(168, 85, 247, 0.5)" stroke="#c084fc" strokeWidth="1" />
              <rect x="153" y="90" width="18" height="15" fill="rgba(168, 85, 247, 0.4)" stroke="#c084fc" strokeWidth="1" />
            </svg>
            <div className="absolute bottom-2 left-2 text-[10px] font-mono text-purple-300 bg-slate-950/80 px-2 py-0.5 rounded">
              ⁿCᵣ Galton Board · (x+y)ⁿ Bell
            </div>
          </div>
        );
      case 'arithmetic-geometric-explorer':
        return (
          <div className="w-full h-32 sm:h-36 bg-gradient-to-br from-slate-900 via-pink-950/30 to-slate-900 rounded-xl relative overflow-hidden flex items-center justify-center border border-pink-900/30">
            <svg viewBox="0 0 220 120" className="w-48 h-28 stroke-cyan-400 fill-none">
              {/* Staircase bars */}
              <rect x="35" y="85" width="22" height="20" fill="rgba(56, 189, 248, 0.3)" stroke="#38bdf8" strokeWidth="1" />
              <rect x="62" y="70" width="22" height="35" fill="rgba(56, 189, 248, 0.4)" stroke="#38bdf8" strokeWidth="1" />
              <rect x="89" y="55" width="22" height="50" fill="rgba(56, 189, 248, 0.5)" stroke="#38bdf8" strokeWidth="1" />
              <rect x="116" y="40" width="22" height="65" fill="rgba(56, 189, 248, 0.6)" stroke="#38bdf8" strokeWidth="1" />
              <rect x="143" y="25" width="22" height="80" fill="rgba(56, 189, 248, 0.7)" stroke="#38bdf8" strokeWidth="1" />
              {/* Inverted Gauss pairing tops */}
              <line x1="35" y1="20" x2="165" y2="20" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 2" />
            </svg>
            <div className="absolute bottom-2 left-2 text-[10px] font-mono text-pink-300 bg-slate-950/80 px-2 py-0.5 rounded">
              Sₙ = n/2(a+l) · S_∞ = a/(1-r)
            </div>
          </div>
        );
      case 'hyperbola-ellipse-orbits':
        return (
          <div className="w-full h-32 sm:h-36 bg-gradient-to-br from-slate-900 via-cyan-950/30 to-slate-900 rounded-xl relative overflow-hidden flex items-center justify-center border border-cyan-900/30">
            <svg viewBox="0 0 220 120" className="w-48 h-28 stroke-cyan-400 fill-none">
              {/* Ellipse */}
              <ellipse cx="110" cy="60" rx="65" ry="38" stroke="#38bdf8" strokeWidth="2.5" fill="rgba(56, 189, 248, 0.08)" />
              {/* Foci */}
              <circle cx="70" cy="60" r="5" fill="#f59e0b" />
              <circle cx="150" cy="60" r="3.5" fill="#06b6d4" />
              {/* Point P on curve and string rays */}
              <line x1="70" y1="60" x2="140" y2="27" stroke="#06b6d4" strokeWidth="1.5" />
              <line x1="150" y1="60" x2="140" y2="27" stroke="#f59e0b" strokeWidth="1.5" />
              <circle cx="140" cy="27" r="4.5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
            </svg>
            <div className="absolute bottom-2 left-2 text-[10px] font-mono text-cyan-300 bg-slate-950/80 px-2 py-0.5 rounded">
              d₁ + d₂ = 2a · Kepler Orbit
            </div>
          </div>
        );
      case 'surface-area-volumes':
        return (
          <div className="w-full h-32 sm:h-36 bg-gradient-to-br from-slate-900 via-blue-950/30 to-slate-900 rounded-xl relative overflow-hidden flex items-center justify-center border border-blue-900/30">
            <svg viewBox="0 0 220 120" className="w-48 h-28 stroke-cyan-400 fill-none">
              {/* Unfolded cylinder net rectangle */}
              <rect x="50" y="40" width="120" height="40" fill="rgba(14, 165, 233, 0.2)" stroke="#38bdf8" strokeWidth="2" />
              {/* Top and bottom circular flaps */}
              <circle cx="110" cy="22" r="14" fill="rgba(56, 189, 248, 0.3)" stroke="#38bdf8" strokeWidth="1.5" />
              <circle cx="110" cy="98" r="14" fill="rgba(56, 189, 248, 0.3)" stroke="#38bdf8" strokeWidth="1.5" />
            </svg>
            <div className="absolute bottom-2 left-2 text-[10px] font-mono text-cyan-300 bg-slate-950/80 px-2 py-0.5 rounded">
              2D Net: 2πrh · Vol = ⅓πr²h
            </div>
          </div>
        );
      case 'circle-chords-cyclic':
        return (
          <div className="w-full h-32 sm:h-36 bg-gradient-to-br from-slate-900 via-emerald-950/30 to-slate-900 rounded-xl relative overflow-hidden flex items-center justify-center border border-emerald-900/30">
            <svg viewBox="0 0 220 120" className="w-48 h-28 stroke-cyan-400 fill-none">
              <circle cx="110" cy="60" r="42" stroke="#38bdf8" strokeWidth="2" />
              {/* Chord */}
              <line x1="75" y1="85" x2="145" y2="85" stroke="#34d399" strokeWidth="2.5" />
              {/* Perpendicular OM */}
              <line x1="110" y1="60" x2="110" y2="85" stroke="#f59e0b" strokeWidth="2" />
              <circle cx="110" cy="60" r="3.5" fill="#38bdf8" />
              <circle cx="110" cy="85" r="3" fill="#f59e0b" />
            </svg>
            <div className="absolute bottom-2 left-2 text-[10px] font-mono text-emerald-300 bg-slate-950/80 px-2 py-0.5 rounded">
              OM ⊥ AB ⟹ AM = MB · 180°
            </div>
          </div>
        );
      case 'statistics-visualizer':
        return (
          <div className="w-full h-32 sm:h-36 bg-gradient-to-br from-slate-900 via-amber-950/30 to-slate-900 rounded-xl relative overflow-hidden flex items-center justify-center border border-amber-900/30">
            <svg viewBox="0 0 220 120" className="w-48 h-28 stroke-cyan-400 fill-none">
              {/* Seesaw beam */}
              <line x1="30" y1="75" x2="190" y2="75" stroke="#64748b" strokeWidth="3" />
              {/* Fulcrum triangle */}
              <polygon points="105,75 97,95 113,95" fill="#f59e0b" stroke="#fbbf24" strokeWidth="1.5" />
              {/* Stacked weights */}
              <rect x="50" y="55" width="16" height="18" fill="rgba(56, 189, 248, 0.4)" stroke="#38bdf8" strokeWidth="1" />
              <rect x="80" y="40" width="16" height="33" fill="rgba(56, 189, 248, 0.4)" stroke="#38bdf8" strokeWidth="1" />
              <rect x="160" y="55" width="16" height="18" fill="rgba(239, 68, 68, 0.4)" stroke="#f87171" strokeWidth="1" />
            </svg>
            <div className="absolute bottom-2 left-2 text-[10px] font-mono text-amber-300 bg-slate-950/80 px-2 py-0.5 rounded">
              Fulcrum at Mean · Outlier Tug
            </div>
          </div>
        );
      case 'limits-derivatives-lab':
        return (
          <div className="w-full h-32 sm:h-36 bg-gradient-to-br from-slate-900 via-purple-950/30 to-slate-900 rounded-xl relative overflow-hidden flex items-center justify-center border border-purple-900/30">
            <svg viewBox="0 0 220 120" className="w-48 h-28 stroke-cyan-400 fill-none">
              {/* Curve f(x) = x² */}
              <path d="M 40 95 Q 110 95 170 20" stroke="#38bdf8" strokeWidth="2.5" fill="none" />
              {/* Tangent line */}
              <line x1="60" y1="90" x2="160" y2="30" stroke="#34d399" strokeWidth="2" strokeDasharray="4 2" />
              {/* Secant line */}
              <line x1="75" y1="100" x2="175" y2="15" stroke="#f59e0b" strokeWidth="2" />
              <circle cx="120" cy="58" r="4.5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
            </svg>
            <div className="absolute bottom-2 left-2 text-[10px] font-mono text-purple-300 bg-slate-950/80 px-2 py-0.5 rounded">
              h ➔ 0 · Secant snaps to Tangent
            </div>
          </div>
        );
      case 'linear-inequalities':
        return (
          <div className="w-full h-32 sm:h-36 bg-gradient-to-br from-slate-900 via-emerald-950/30 to-slate-900 rounded-xl relative overflow-hidden flex items-center justify-center border border-emerald-900/30">
            <svg viewBox="0 0 220 120" className="w-48 h-28 stroke-cyan-400 fill-none">
              {/* Axes */}
              <line x1="30" y1="95" x2="190" y2="95" stroke="#475569" strokeWidth="1.5" />
              <line x1="30" y1="15" x2="30" y2="95" stroke="#475569" strokeWidth="1.5" />
              {/* Feasible polygon fill */}
              <polygon points="30,95 110,95 80,45 30,30" fill="rgba(16, 185, 129, 0.3)" stroke="#10b981" strokeWidth="2" />
              {/* Boundary lines */}
              <line x1="20" y1="25" x2="150" y2="105" stroke="#38bdf8" strokeWidth="1.5" />
              <line x1="20" y1="110" x2="100" y2="20" stroke="#f59e0b" strokeWidth="1.5" />
            </svg>
            <div className="absolute bottom-2 left-2 text-[10px] font-mono text-emerald-300 bg-slate-950/80 px-2 py-0.5 rounded">
              Half-Planes · Feasible Polygon
            </div>
          </div>
        );
      case 'permutations-combinations':
        return (
          <div className="w-full h-32 sm:h-36 bg-gradient-to-br from-slate-900 via-pink-950/30 to-slate-900 rounded-xl relative overflow-hidden flex items-center justify-center border border-pink-900/30">
            <svg viewBox="0 0 220 120" className="w-48 h-28 stroke-cyan-400 fill-none">
              {/* Round table */}
              <circle cx="110" cy="60" r="32" fill="#451a03" stroke="#f59e0b" strokeWidth="2" />
              {/* Seating tokens */}
              <circle cx="110" cy="20" r="7" fill="#ef4444" />
              <circle cx="145" cy="45" r="7" fill="#3b82f6" />
              <circle cx="135" cy="85" r="7" fill="#10b981" />
              <circle cx="85" cy="85" r="7" fill="#f59e0b" />
              <circle cx="75" cy="45" r="7" fill="#a855f7" />
            </svg>
            <div className="absolute bottom-2 left-2 text-[10px] font-mono text-pink-300 bg-slate-950/80 px-2 py-0.5 rounded">
              ⁿPᵣ vs ⁿCᵣ · Circular (n-1)!
            </div>
          </div>
        );
      case 'similar-triangles':
        return (
          <div className="w-full h-32 sm:h-36 bg-gradient-to-br from-slate-900 via-emerald-950/30 to-slate-900 rounded-xl relative overflow-hidden flex items-center justify-center border border-emerald-900/30">
            <svg viewBox="0 0 220 120" className="w-48 h-28 stroke-cyan-400 fill-none">
              {/* Triangle ABC */}
              <polygon points="110,20 40,105 180,105" stroke="#38bdf8" strokeWidth="2" fill="rgba(56, 189, 248, 0.1)" />
              {/* Transversal DE */}
              <line x1="75" y1="62" x2="145" y2="62" stroke="#10b981" strokeWidth="2.5" />
              <polygon points="110,20 75,62 145,62" fill="rgba(16, 185, 129, 0.25)" />
              <circle cx="75" cy="62" r="3" fill="#10b981" />
              <circle cx="145" cy="62" r="3" fill="#10b981" />
            </svg>
            <div className="absolute bottom-2 left-2 text-[10px] font-mono text-emerald-300 bg-slate-950/80 px-2 py-0.5 rounded">
              Thales BPT: AD/DB = AE/EC
            </div>
          </div>
        );
      case 'ftc-integral-accumulator':
        return (
          <div className="w-full h-32 sm:h-36 bg-gradient-to-br from-slate-900 via-purple-950/30 to-slate-900 rounded-xl relative overflow-hidden flex items-center justify-center border border-purple-900/30">
            <svg viewBox="0 0 220 120" className="w-48 h-28 stroke-cyan-400 fill-none">
              {/* Curve f(t) */}
              <path d="M 30 100 Q 110 95 180 25" stroke="#38bdf8" strokeWidth="2" fill="none" />
              {/* Shaded Riemann rectangles */}
              <rect x="40" y="85" width="20" height="20" fill="rgba(168, 85, 247, 0.3)" stroke="#a855f7" strokeWidth="1" />
              <rect x="60" y="75" width="20" height="30" fill="rgba(168, 85, 247, 0.3)" stroke="#a855f7" strokeWidth="1" />
              <rect x="80" y="60" width="20" height="45" fill="rgba(168, 85, 247, 0.3)" stroke="#a855f7" strokeWidth="1" />
              <rect x="100" y="42" width="20" height="63" fill="rgba(168, 85, 247, 0.3)" stroke="#a855f7" strokeWidth="1" />
              {/* Tangent */}
              <line x1="100" y1="65" x2="160" y2="15" stroke="#10b981" strokeWidth="2" strokeDasharray="3 2" />
            </svg>
            <div className="absolute bottom-2 left-2 text-[10px] font-mono text-purple-300 bg-slate-950/80 px-2 py-0.5 rounded">
              d/dx[∫ f] = f(x) · Dynamic Area
            </div>
          </div>
        );
      case 'bayes-probability-lab':
        return (
          <div className="w-full h-32 sm:h-36 bg-gradient-to-br from-slate-900 via-amber-950/30 to-slate-900 rounded-xl relative overflow-hidden flex items-center justify-center border border-amber-900/30">
            <svg viewBox="0 0 220 120" className="w-48 h-28 stroke-cyan-400 fill-none">
              {/* Tree branching */}
              <line x1="30" y1="60" x2="90" y2="35" stroke="#a855f7" strokeWidth="2" />
              <line x1="30" y1="60" x2="90" y2="85" stroke="#64748b" strokeWidth="2" />
              <line x1="90" y1="35" x2="160" y2="20" stroke="#10b981" strokeWidth="2" />
              <line x1="90" y1="85" x2="160" y2="70" stroke="#f59e0b" strokeWidth="2" />
              <circle cx="160" cy="20" r="5" fill="#10b981" />
              <circle cx="160" cy="70" r="5" fill="#f59e0b" />
            </svg>
            <div className="absolute bottom-2 left-2 text-[10px] font-mono text-amber-300 bg-slate-950/80 px-2 py-0.5 rounded">
              Bayes' Theorem · Base Rate Proof
            </div>
          </div>
        );
      case 'euclidean-geometry-sandbox':
        return (
          <div className="w-full h-32 sm:h-36 bg-gradient-to-br from-slate-900 via-teal-950/30 to-slate-900 rounded-xl relative overflow-hidden flex items-center justify-center border border-teal-900/30">
            <svg viewBox="0 0 220 120" className="w-48 h-28 stroke-cyan-400 fill-none">
              {/* Globe circle */}
              <circle cx="110" cy="60" r="42" stroke="#0d9488" strokeWidth="1.5" strokeDasharray="3 3" />
              {/* Equator & Meridian */}
              <ellipse cx="110" cy="60" rx="42" ry="14" stroke="#14b8a6" strokeWidth="1" strokeDasharray="2 2" />
              <ellipse cx="110" cy="60" rx="16" ry="42" stroke="#14b8a6" strokeWidth="1" strokeDasharray="2 2" />
              {/* Spherical Triangle: North pole to 2 equator points */}
              <path d="M 110 18 Q 128 42 145 60 Q 110 70 75 60 Q 92 42 110 18 Z" fill="rgba(20, 184, 166, 0.25)" stroke="#2dd4bf" strokeWidth="2" />
              <circle cx="110" cy="18" r="3" fill="#2dd4bf" />
              <circle cx="145" cy="60" r="3" fill="#2dd4bf" />
              <circle cx="75" cy="60" r="3" fill="#2dd4bf" />
            </svg>
            <div className="absolute bottom-2 left-2 text-[10px] font-mono text-teal-300 bg-slate-950/80 px-2 py-0.5 rounded">
              Sphere Δ = 270° · Postulate 5
            </div>
          </div>
        );
      case 'three-d-geometry-lab':
        return (
          <div className="w-full h-32 sm:h-36 bg-gradient-to-br from-slate-900 via-indigo-950/30 to-slate-900 rounded-xl relative overflow-hidden flex items-center justify-center border border-indigo-900/30">
            <svg viewBox="0 0 220 120" className="w-48 h-28 stroke-cyan-400 fill-none">
              {/* Top plane representation */}
              <polygon points="50,25 170,15 190,45 70,55" fill="rgba(99, 102, 241, 0.12)" stroke="#6366f1" strokeWidth="1" strokeDasharray="2 2" />
              {/* Bottom plane representation */}
              <polygon points="30,75 150,65 170,95 50,105" fill="rgba(99, 102, 241, 0.08)" stroke="#4338ca" strokeWidth="1" strokeDasharray="2 2" />
              {/* Line 1 in top plane */}
              <line x1="60" y1="45" x2="180" y2="25" stroke="#38bdf8" strokeWidth="2" />
              {/* Line 2 in bottom plane */}
              <line x1="45" y1="80" x2="155" y2="92" stroke="#ec4899" strokeWidth="2" />
              {/* Shortest distance connector (common perpendicular) */}
              <line x1="115" y1="35" x2="105" y2="86" stroke="#10b981" strokeWidth="2.5" />
              <circle cx="115" cy="35" r="3" fill="#10b981" />
              <circle cx="105" cy="86" r="3" fill="#10b981" />
            </svg>
            <div className="absolute bottom-2 left-2 text-[10px] font-mono text-indigo-300 bg-slate-950/80 px-2 py-0.5 rounded">
              Skew Lines d = |(a₂-a₁)·(b₁×b₂)|/|b₁×b₂|
            </div>
          </div>
        );
      case 'differential-equations-lab':
        return (
          <div className="w-full h-32 sm:h-36 bg-gradient-to-br from-slate-900 via-rose-950/30 to-slate-900 rounded-xl relative overflow-hidden flex items-center justify-center border border-rose-900/30">
            <svg viewBox="0 0 220 120" className="w-48 h-28 stroke-cyan-400 fill-none">
              {/* Slope field needles */}
              {[30, 60, 90, 120, 150, 180].map((x) =>
                [25, 45, 65, 85].map((y) => {
                  const slope = (y - 55) * 0.02;
                  const dx = 6;
                  const dy = slope * 10;
                  return (
                    <line
                      key={`${x}-${y}`}
                      x1={x - dx}
                      y1={y - dy}
                      x2={x + dx}
                      y2={y + dy}
                      stroke="#475569"
                      strokeWidth="1.2"
                    />
                  );
                })
              )}
              {/* Dynamic trajectory curve */}
              <path d="M 30 100 Q 80 85 120 50 T 190 20" stroke="#f43f5e" strokeWidth="2.5" fill="none" />
              {/* Initial condition point */}
              <circle cx="30" cy="100" r="4" fill="#fb7185" stroke="#fff" strokeWidth="1" />
            </svg>
            <div className="absolute bottom-2 left-2 text-[10px] font-mono text-rose-300 bg-slate-950/80 px-2 py-0.5 rounded">
              Slope Field dy/dx + P(x)y = Q(x)
            </div>
          </div>
        );
      case 'balance-scale-equations':
        return (
          <div className="w-full h-32 sm:h-36 bg-gradient-to-br from-slate-900 via-amber-950/20 to-slate-900 rounded-xl relative overflow-hidden flex items-center justify-center border border-amber-900/30">
            <svg viewBox="0 0 220 120" className="w-48 h-28 stroke-cyan-400 fill-none">
              {/* Fulcrum stand */}
              <polygon points="110,40 100,105 120,105" fill="#334155" stroke="#64748b" strokeWidth="1" />
              {/* Pivot */}
              <circle cx="110" cy="40" r="4" fill="#f59e0b" />
              {/* Balance Beam */}
              <line x1="40" y1="40" x2="180" y2="40" stroke="#f59e0b" strokeWidth="3" />
              {/* Left Pan Strings & Pan */}
              <line x1="45" y1="40" x2="25" y2="75" stroke="#94a3b8" strokeWidth="1" />
              <line x1="45" y1="40" x2="65" y2="75" stroke="#94a3b8" strokeWidth="1" />
              <ellipse cx="45" cy="75" rx="22" ry="5" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
              {/* Left Weights (x box and grams) */}
              <rect x="32" y="60" width="14" height="13" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" rx="2" />
              <text x="36" y="70" fill="#fff" fontSize="8" fontWeight="bold">x</text>
              <circle cx="55" cy="68" r="4" fill="#f59e0b" />
              {/* Right Pan Strings & Pan */}
              <line x1="175" y1="40" x2="155" y2="75" stroke="#94a3b8" strokeWidth="1" />
              <line x1="175" y1="40" x2="195" y2="75" stroke="#94a3b8" strokeWidth="1" />
              <ellipse cx="175" cy="75" rx="22" ry="5" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
              {/* Right Weights */}
              <circle cx="168" cy="68" r="4" fill="#f59e0b" />
              <circle cx="178" cy="68" r="4" fill="#f59e0b" />
              <circle cx="173" cy="60" r="4" fill="#f59e0b" />
            </svg>
            <div className="absolute bottom-2 left-2 text-[10px] font-mono text-amber-300 bg-slate-950/80 px-2 py-0.5 rounded">
              Balance Scale · 3x + 4 = x + 12
            </div>
          </div>
        );
      case 'algebraic-identities-tiles':
        return (
          <div className="w-full h-32 sm:h-36 bg-gradient-to-br from-slate-900 via-sky-950/30 to-slate-900 rounded-xl relative overflow-hidden flex items-center justify-center border border-sky-900/30">
            <svg viewBox="0 0 220 120" className="w-48 h-28 stroke-cyan-400 fill-none">
              {/* Outer Square (a + b) */}
              <g transform="translate(65, 15)">
                {/* a^2 blue */}
                <rect x="0" y="0" width="55" height="55" fill="rgba(56, 189, 248, 0.25)" stroke="#38bdf8" strokeWidth="1.5" />
                <text x="22" y="32" fill="#38bdf8" fontSize="12" fontWeight="bold">a²</text>
                {/* ab top right */}
                <rect x="55" y="0" width="28" height="55" fill="rgba(245, 158, 11, 0.25)" stroke="#f59e0b" strokeWidth="1.5" />
                <text x="63" y="32" fill="#f59e0b" fontSize="10" fontWeight="bold">ab</text>
                {/* ab bottom left */}
                <rect x="0" y="55" width="55" height="28" fill="rgba(245, 158, 11, 0.25)" stroke="#f59e0b" strokeWidth="1.5" />
                <text x="22" y="73" fill="#f59e0b" fontSize="10" fontWeight="bold">ab</text>
                {/* b^2 green */}
                <rect x="55" y="55" width="28" height="28" fill="rgba(16, 185, 129, 0.25)" stroke="#10b981" strokeWidth="1.5" />
                <text x="64" y="73" fill="#10b981" fontSize="10" fontWeight="bold">b²</text>
              </g>
            </svg>
            <div className="absolute bottom-2 left-2 text-[10px] font-mono text-sky-300 bg-slate-950/80 px-2 py-0.5 rounded">
              (a + b)² = a² + 2ab + b²
            </div>
          </div>
        );
      case 'compound-interest-engine':
        return (
          <div className="w-full h-32 sm:h-36 bg-gradient-to-br from-slate-900 via-emerald-950/30 to-slate-900 rounded-xl relative overflow-hidden flex items-center justify-center border border-emerald-900/30">
            <svg viewBox="0 0 220 120" className="w-48 h-28 stroke-cyan-400 fill-none">
              {/* Axes */}
              <line x1="30" y1="100" x2="195" y2="100" stroke="#475569" strokeWidth="1" />
              <line x1="30" y1="20" x2="30" y2="100" stroke="#475569" strokeWidth="1" />
              {/* Year 1, 2, 3, 4 bars */}
              {/* Year 1 */}
              <rect x="50" y="75" width="18" height="25" fill="#334155" />
              <rect x="50" y="65" width="18" height="10" fill="#0284c7" />
              {/* Year 2 */}
              <rect x="85" y="75" width="18" height="25" fill="#334155" />
              <rect x="85" y="55" width="18" height="20" fill="#0284c7" />
              <rect x="85" y="52" width="18" height="3" fill="#a855f7" />
              {/* Year 3 */}
              <rect x="120" y="75" width="18" height="25" fill="#334155" />
              <rect x="120" y="45" width="18" height="30" fill="#0284c7" />
              <rect x="120" y="38" width="18" height="7" fill="#a855f7" />
              {/* Year 4 */}
              <rect x="155" y="75" width="18" height="25" fill="#334155" />
              <rect x="155" y="35" width="18" height="40" fill="#0284c7" />
              <rect x="155" y="24" width="18" height="11" fill="#a855f7" />
              {/* Exponential glow curve */}
              <path d="M 59 65 Q 120 50 164 24" stroke="#a855f7" strokeWidth="2" fill="none" />
            </svg>
            <div className="absolute bottom-2 left-2 text-[10px] font-mono text-emerald-300 bg-slate-950/80 px-2 py-0.5 rounded">
              A = P(1 + r/100)ⁿ · CI vs SI
            </div>
          </div>
        );
      case 'quadrilateral-morpher':
        return (
          <div className="w-full h-32 sm:h-36 bg-gradient-to-br from-slate-900 via-indigo-950/30 to-slate-900 rounded-xl relative overflow-hidden flex items-center justify-center border border-indigo-900/30">
            <svg viewBox="0 0 220 120" className="w-48 h-28 stroke-cyan-400 fill-none">
              {/* Parallelogram ABCD */}
              <polygon points="50,85 140,85 170,35 80,35" fill="rgba(99, 102, 241, 0.15)" stroke="#6366f1" strokeWidth="2" />
              {/* Diagonals AC and BD */}
              <line x1="50" y1="85" x2="170" y2="35" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 2" />
              <line x1="140" y1="85" x2="80" y2="35" stroke="#ec4899" strokeWidth="1.5" strokeDasharray="3 2" />
              {/* Midpoint / Intersection */}
              <circle cx="110" cy="60" r="3" fill="#10b981" />
              {/* Angle arc */}
              <circle cx="50" cy="85" r="3" fill="#6366f1" />
              <circle cx="140" cy="85" r="3" fill="#6366f1" />
              <circle cx="170" cy="35" r="3" fill="#6366f1" />
              <circle cx="80" cy="35" r="3" fill="#6366f1" />
            </svg>
            <div className="absolute bottom-2 left-2 text-[10px] font-mono text-indigo-300 bg-slate-950/80 px-2 py-0.5 rounded">
              Parallelogram · Diagonals Bisect
            </div>
          </div>
        );
      case 'euler-polyhedra-3d':
        return (
          <div className="w-full h-32 sm:h-36 bg-gradient-to-br from-slate-900 via-violet-950/30 to-slate-900 rounded-xl relative overflow-hidden flex items-center justify-center border border-violet-900/30">
            <svg viewBox="0 0 220 120" className="w-48 h-28 stroke-cyan-400 fill-none">
              {/* 3D Cube Isometric */}
              <g transform="translate(110, 60)">
                {/* Front face */}
                <polygon points="-30,-10 0,6 0,42 -30,26" fill="rgba(167, 139, 250, 0.2)" stroke="#a78bfa" strokeWidth="1.5" />
                {/* Right face */}
                <polygon points="0,6 30,-10 30,26 0,42" fill="rgba(139, 92, 246, 0.2)" stroke="#8b5cf6" strokeWidth="1.5" />
                {/* Top face */}
                <polygon points="0,-26 30,-10 0,6 -30,-10" fill="rgba(196, 181, 253, 0.2)" stroke="#c4b5fd" strokeWidth="1.5" />
                {/* Vertices */}
                <circle cx="0" cy="-26" r="3" fill="#38bdf8" />
                <circle cx="30" cy="-10" r="3" fill="#38bdf8" />
                <circle cx="-30" cy="-10" r="3" fill="#38bdf8" />
                <circle cx="0" cy="6" r="3" fill="#38bdf8" />
                <circle cx="0" cy="42" r="3" fill="#38bdf8" />
                <circle cx="30" cy="26" r="3" fill="#38bdf8" />
                <circle cx="-30" cy="26" r="3" fill="#38bdf8" />
              </g>
            </svg>
            <div className="absolute bottom-2 left-2 text-[10px] font-mono text-violet-300 bg-slate-950/80 px-2 py-0.5 rounded">
              Euler: F + V - E = 2 (6 + 8 - 12 = 2)
            </div>
          </div>
        );
      case 'direct-inverse-proportions':
        return (
          <div className="w-full h-32 sm:h-36 bg-gradient-to-br from-slate-900 via-cyan-950/30 to-slate-900 rounded-xl relative overflow-hidden flex items-center justify-center border border-cyan-900/30">
            <svg viewBox="0 0 220 120" className="w-48 h-28 stroke-cyan-400 fill-none">
              {/* Axes */}
              <line x1="30" y1="100" x2="195" y2="100" stroke="#475569" strokeWidth="1" />
              <line x1="30" y1="20" x2="30" y2="100" stroke="#475569" strokeWidth="1" />
              {/* Direct Ray: y = kx */}
              <line x1="30" y1="100" x2="185" y2="35" stroke="#38bdf8" strokeWidth="2" />
              <text x="145" y="35" fill="#38bdf8" fontSize="8" fontFamily="monospace">y = kx</text>
              {/* Inverse Hyperbola: xy = k */}
              <path d="M 45 35 Q 60 75 185 92" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 2" fill="none" />
              <text x="145" y="85" fill="#f59e0b" fontSize="8" fontFamily="monospace">x · y = k</text>
            </svg>
            <div className="absolute bottom-2 left-2 text-[10px] font-mono text-cyan-300 bg-slate-950/80 px-2 py-0.5 rounded">
              Direct (y/x = k) vs Inverse (xy = k)
            </div>
          </div>
        );
      case 'dynamic-pie-chart':
        return (
          <div className="w-full h-32 sm:h-36 bg-gradient-to-br from-slate-900 via-pink-950/30 to-slate-900 rounded-xl relative overflow-hidden flex items-center justify-center border border-pink-900/30">
            <svg viewBox="0 0 220 120" className="w-48 h-28 stroke-cyan-400 fill-none">
              {/* Pie sectors */}
              <g transform="translate(110, 60)">
                {/* Sector 1: 36% = 130 deg */}
                <path d="M 0 0 L 0 -40 A 40 40 0 0 1 38 12 Z" fill="rgba(56, 189, 248, 0.4)" stroke="#38bdf8" strokeWidth="1.5" />
                {/* Sector 2: 24% = 86 deg */}
                <path d="M 0 0 L 38 12 A 40 40 0 0 1 -10 39 Z" fill="rgba(16, 185, 129, 0.4)" stroke="#10b981" strokeWidth="1.5" />
                {/* Sector 3: 18% = 65 deg */}
                <path d="M 0 0 L -10 39 A 40 40 0 0 1 -39 7 Z" fill="rgba(245, 158, 11, 0.4)" stroke="#f59e0b" strokeWidth="1.5" />
                {/* Sector 4: 22% = 79 deg */}
                <path d="M 0 0 L -39 7 A 40 40 0 0 1 0 -40 Z" fill="rgba(168, 85, 247, 0.4)" stroke="#a855f7" strokeWidth="1.5" />
                {/* Center dot */}
                <circle cx="0" cy="0" r="3" fill="#fff" />
              </g>
            </svg>
            <div className="absolute bottom-2 left-2 text-[10px] font-mono text-pink-300 bg-slate-950/80 px-2 py-0.5 rounded">
              Pie Chart · Sector θ = (val/tot)×360°
            </div>
          </div>
        );
      case 'square-roots-triplets':
        return (
          <div className="w-full h-32 sm:h-36 bg-gradient-to-br from-slate-900 via-teal-950/30 to-slate-900 rounded-xl relative overflow-hidden flex items-center justify-center border border-teal-900/30">
            <svg viewBox="0 0 220 120" className="w-48 h-28 stroke-cyan-400 fill-none">
              {/* Packed Grid 5x5 */}
              <g transform="translate(45, 30)">
                {[0, 1, 2, 3, 4].map((r) =>
                  [0, 1, 2, 3, 4].map((c) => (
                    <rect
                      key={`${r}-${c}`}
                      x={c * 11}
                      y={r * 11}
                      width="9"
                      height="9"
                      fill="#14b8a6"
                      stroke="#0d9488"
                      strokeWidth="1"
                      rx="1"
                    />
                  ))
                )}
              </g>
              {/* Triplet right triangle */}
              <polygon points="125,85 175,85 175,45" fill="rgba(20, 184, 166, 0.2)" stroke="#2dd4bf" strokeWidth="1.5" />
              <text x="145" y="95" fill="#2dd4bf" fontSize="8">2m</text>
              <text x="180" y="68" fill="#2dd4bf" fontSize="8">m²-1</text>
              <text x="135" y="60" fill="#f59e0b" fontSize="8">m²+1</text>
            </svg>
            <div className="absolute bottom-2 left-2 text-[10px] font-mono text-teal-300 bg-slate-950/80 px-2 py-0.5 rounded">
              Square 5² = 25 · Triplet (2m, m²-1, m²+1)
            </div>
          </div>
        );
      case 'exponents-powers-lab':
        return (
          <div className="w-full h-32 sm:h-36 bg-gradient-to-br from-slate-900 via-amber-950/30 to-slate-900 rounded-xl relative overflow-hidden flex items-center justify-center border border-amber-900/30">
            <svg viewBox="0 0 220 120" className="w-48 h-28 stroke-cyan-400 fill-none">
              <line x1="110" y1="15" x2="110" y2="105" stroke="#475569" strokeWidth="2" strokeDasharray="3 3" />
              <rect x="70" y="20" width="80" height="20" fill="rgba(245, 158, 11, 0.25)" stroke="#f59e0b" strokeWidth="1.5" rx="4" />
              <text x="110" y="34" fill="#fbbf24" fontSize="10" fontWeight="bold" textAnchor="middle">2⁴ = 16</text>
              <rect x="75" y="45" width="70" height="18" fill="rgba(56, 189, 248, 0.25)" stroke="#38bdf8" strokeWidth="1.5" rx="4" />
              <text x="110" y="58" fill="#38bdf8" fontSize="9" textAnchor="middle">2² = 4</text>
              <rect x="80" y="68" width="60" height="16" fill="rgba(52, 211, 153, 0.25)" stroke="#34d399" strokeWidth="1.5" rx="4" />
              <text x="110" y="80" fill="#34d399" fontSize="9" textAnchor="middle">2⁰ = 1</text>
              <rect x="75" y="88" width="70" height="18" fill="rgba(239, 68, 68, 0.25)" stroke="#f87171" strokeWidth="1.5" rx="4" />
              <text x="110" y="101" fill="#f87171" fontSize="9" textAnchor="middle">2⁻² = ¼</text>
            </svg>
            <div className="absolute bottom-2 left-2 text-[10px] font-mono text-amber-300 bg-slate-950/80 px-2 py-0.5 rounded">
              aᵐ × aⁿ = aᵐ⁺ⁿ · a⁻ⁿ = 1/aⁿ
            </div>
          </div>
        );
      case 'rational-numbers-density':
        return (
          <div className="w-full h-32 sm:h-36 bg-gradient-to-br from-slate-900 via-sky-950/30 to-slate-900 rounded-xl relative overflow-hidden flex items-center justify-center border border-sky-900/30">
            <svg viewBox="0 0 220 120" className="w-48 h-28 stroke-cyan-400 fill-none">
              <line x1="20" y1="65" x2="200" y2="65" stroke="#38bdf8" strokeWidth="2.5" />
              <circle cx="50" cy="65" r="4.5" fill="#38bdf8" />
              <text x="50" y="85" fill="#38bdf8" fontSize="9" textAnchor="middle" fontWeight="bold">½</text>
              <circle cx="170" cy="65" r="4.5" fill="#38bdf8" />
              <text x="170" y="85" fill="#38bdf8" fontSize="9" textAnchor="middle" fontWeight="bold">⅔</text>
              <circle cx="110" cy="65" r="5" fill="#f59e0b" />
              <text x="110" y="50" fill="#fbbf24" fontSize="9" textAnchor="middle" fontWeight="bold">7/12</text>
              <path d="M 50 60 Q 80 40 110 60" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 2" />
              <path d="M 110 60 Q 140 40 170 60" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 2" />
            </svg>
            <div className="absolute bottom-2 left-2 text-[10px] font-mono text-sky-300 bg-slate-950/80 px-2 py-0.5 rounded">
              Mean = (a+b)/2 · Infinite Density
            </div>
          </div>
        );
      case 'triangle-congruence-forge':
        return (
          <div className="w-full h-32 sm:h-36 bg-gradient-to-br from-slate-900 via-teal-950/30 to-slate-900 rounded-xl relative overflow-hidden flex items-center justify-center border border-teal-900/30">
            <svg viewBox="0 0 220 120" className="w-48 h-28 stroke-cyan-400 fill-none">
              <polygon points="35,90 90,90 60,35" fill="rgba(20, 184, 166, 0.2)" stroke="#2dd4bf" strokeWidth="2" />
              <circle cx="60" cy="35" r="3" fill="#2dd4bf" />
              <text x="110" y="65" fill="#f59e0b" fontSize="16" fontWeight="bold" textAnchor="middle">≅</text>
              <polygon points="130,90 185,90 155,35" fill="rgba(20, 184, 166, 0.2)" stroke="#2dd4bf" strokeWidth="2" />
              <circle cx="155" cy="35" r="3" fill="#2dd4bf" />
              <text x="110" y="85" fill="#38bdf8" fontSize="8" textAnchor="middle">SAS / SSS / RHS</text>
            </svg>
            <div className="absolute bottom-2 left-2 text-[10px] font-mono text-teal-300 bg-slate-950/80 px-2 py-0.5 rounded">
              Congruence Forge: SAS · SSS · RHS
            </div>
          </div>
        );
      case 'arithmetic-progression-lab':
        return (
          <div className="w-full h-32 sm:h-36 bg-gradient-to-br from-slate-900 via-amber-950/30 to-slate-900 rounded-xl relative overflow-hidden flex items-center justify-center border border-amber-900/30">
            <svg viewBox="0 0 220 120" className="w-48 h-28 stroke-cyan-400 fill-none">
              <rect x="35" y="80" width="22" height="20" fill="rgba(245, 158, 11, 0.4)" stroke="#f59e0b" strokeWidth="1.5" rx="2" />
              <rect x="62" y="65" width="22" height="35" fill="rgba(245, 158, 11, 0.5)" stroke="#f59e0b" strokeWidth="1.5" rx="2" />
              <rect x="89" y="50" width="22" height="50" fill="rgba(245, 158, 11, 0.6)" stroke="#f59e0b" strokeWidth="1.5" rx="2" />
              <rect x="116" y="35" width="22" height="65" fill="rgba(245, 158, 11, 0.7)" stroke="#f59e0b" strokeWidth="1.5" rx="2" />
              <rect x="143" y="20" width="22" height="80" fill="rgba(245, 158, 11, 0.8)" stroke="#f59e0b" strokeWidth="1.5" rx="2" />
              <line x1="35" y1="80" x2="165" y2="20" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 2" />
            </svg>
            <div className="absolute bottom-2 left-2 text-[10px] font-mono text-amber-300 bg-slate-950/80 px-2 py-0.5 rounded">
              aₙ = a + (n-1)d · Sₙ = n/2(a+l)
            </div>
          </div>
        );
      case 'coordinate-section-formula':
        return (
          <div className="w-full h-32 sm:h-36 bg-gradient-to-br from-slate-900 via-indigo-950/30 to-slate-900 rounded-xl relative overflow-hidden flex items-center justify-center border border-indigo-900/30">
            <svg viewBox="0 0 220 120" className="w-48 h-28 stroke-cyan-400 fill-none">
              <line x1="35" y1="90" x2="185" y2="30" stroke="#6366f1" strokeWidth="3" />
              <circle cx="35" cy="90" r="4.5" fill="#38bdf8" />
              <text x="35" y="105" fill="#38bdf8" fontSize="8" textAnchor="middle">A(x₁,y₁)</text>
              <circle cx="185" cy="30" r="4.5" fill="#38bdf8" />
              <text x="185" y="20" fill="#38bdf8" fontSize="8" textAnchor="middle">B(x₂,y₂)</text>
              <circle cx="95" cy="66" r="6" fill="#f59e0b" />
              <text x="95" y="85" fill="#fbbf24" fontSize="9" fontWeight="bold" textAnchor="middle">P(x,y)</text>
              <text x="60" y="60" fill="#a5b4fc" fontSize="8">m₁</text>
              <text x="145" y="40" fill="#a5b4fc" fontSize="8">m₂</text>
            </svg>
            <div className="absolute bottom-2 left-2 text-[10px] font-mono text-indigo-300 bg-slate-950/80 px-2 py-0.5 rounded">
              x = (m₁x₂ + m₂x₁)/(m₁+m₂)
            </div>
          </div>
        );
      case 'circle-tangents-lab':
        return (
          <div className="w-full h-32 sm:h-36 bg-gradient-to-br from-slate-900 via-emerald-950/30 to-slate-900 rounded-xl relative overflow-hidden flex items-center justify-center border border-emerald-900/30">
            <svg viewBox="0 0 220 120" className="w-48 h-28 stroke-cyan-400 fill-none">
              <circle cx="80" cy="60" r="35" stroke="#38bdf8" strokeWidth="2" fill="rgba(56, 189, 248, 0.08)" />
              <circle cx="80" cy="60" r="3" fill="#38bdf8" />
              <circle cx="180" cy="60" r="5" fill="#f59e0b" />
              <text x="190" y="64" fill="#fbbf24" fontSize="9" fontWeight="bold">P</text>
              <line x1="180" y1="60" x2="98" y2="29" stroke="#34d399" strokeWidth="2.5" />
              <line x1="180" y1="60" x2="98" y2="91" stroke="#34d399" strokeWidth="2.5" />
              <circle cx="98" cy="29" r="3.5" fill="#34d399" />
              <circle cx="98" cy="91" r="3.5" fill="#34d399" />
              <line x1="80" y1="60" x2="98" y2="29" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 2" />
              <line x1="80" y1="60" x2="98" y2="91" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 2" />
            </svg>
            <div className="absolute bottom-2 left-2 text-[10px] font-mono text-emerald-300 bg-slate-950/80 px-2 py-0.5 rounded">
              Theorem: PA = PB · Radius ⟂ Tangent
            </div>
          </div>
        );
      case 'mathematical-induction-dominos':
        return (
          <div className="w-full h-32 sm:h-36 bg-gradient-to-br from-slate-900 via-purple-950/30 to-slate-900 rounded-xl relative overflow-hidden flex items-center justify-center border border-purple-900/30">
            <svg viewBox="0 0 220 120" className="w-48 h-28 stroke-cyan-400 fill-none">
              <line x1="20" y1="95" x2="200" y2="95" stroke="#475569" strokeWidth="2" />
              <rect x="40" y="35" width="10" height="60" fill="#a855f7" stroke="#c084fc" rx="2" transform="rotate(35 45 95)" />
              <rect x="75" y="35" width="10" height="60" fill="#a855f7" stroke="#c084fc" rx="2" transform="rotate(25 80 95)" />
              <rect x="110" y="35" width="10" height="60" fill="#f59e0b" stroke="#fbbf24" rx="2" transform="rotate(15 115 95)" />
              <rect x="145" y="35" width="10" height="60" fill="#38bdf8" stroke="#0ea5e9" rx="2" />
              <rect x="175" y="35" width="10" height="60" fill="#38bdf8" stroke="#0ea5e9" rx="2" />
              <text x="45" y="25" fill="#c084fc" fontSize="8">P(1)</text>
              <text x="115" y="25" fill="#fbbf24" fontSize="8">P(k)</text>
              <text x="150" y="25" fill="#38bdf8" fontSize="8">P(k+1)</text>
            </svg>
            <div className="absolute bottom-2 left-2 text-[10px] font-mono text-purple-300 bg-slate-950/80 px-2 py-0.5 rounded">
              P(1) True ∧ [P(k) ⟹ P(k+1)]
            </div>
          </div>
        );
      case 'trig-equations-radial':
        return (
          <div className="w-full h-32 sm:h-36 bg-gradient-to-br from-slate-900 via-rose-950/30 to-slate-900 rounded-xl relative overflow-hidden flex items-center justify-center border border-rose-900/30">
            <svg viewBox="0 0 220 120" className="w-48 h-28 stroke-cyan-400 fill-none">
              <circle cx="110" cy="60" r="42" stroke="#475569" strokeWidth="1.5" />
              <line x1="50" y1="60" x2="170" y2="60" stroke="#334155" strokeWidth="1" />
              <line x1="110" y1="15" x2="110" y2="105" stroke="#334155" strokeWidth="1" />
              <line x1="110" y1="60" x2="146" y2="38" stroke="#f43f5e" strokeWidth="2.5" />
              <circle cx="146" cy="38" r="4" fill="#f43f5e" />
              <line x1="110" y1="60" x2="74" y2="38" stroke="#38bdf8" strokeWidth="2.5" />
              <circle cx="74" cy="38" r="4" fill="#38bdf8" />
              <line x1="74" y1="38" x2="146" y2="38" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3 2" />
            </svg>
            <div className="absolute bottom-2 left-2 text-[10px] font-mono text-rose-300 bg-slate-950/80 px-2 py-0.5 rounded">
              sin θ = k ⟹ θ = nπ + (-1)ⁿα
            </div>
          </div>
        );
      case 'linear-programming-lab':
        return (
          <div className="w-full h-32 sm:h-36 bg-gradient-to-br from-slate-900 via-cyan-950/30 to-slate-900 rounded-xl relative overflow-hidden flex items-center justify-center border border-cyan-900/30">
            <svg viewBox="0 0 220 120" className="w-48 h-28 stroke-cyan-400 fill-none">
              <line x1="30" y1="100" x2="190" y2="100" stroke="#475569" strokeWidth="1.5" />
              <line x1="30" y1="15" x2="30" y2="100" stroke="#475569" strokeWidth="1.5" />
              <polygon points="30,100 130,100 100,45 30,30" fill="rgba(6, 182, 212, 0.25)" stroke="#06b6d4" strokeWidth="2" />
              <circle cx="100" cy="45" r="5" fill="#f59e0b" />
              <text x="110" y="42" fill="#fbbf24" fontSize="8" fontWeight="bold">Z_max</text>
              <line x1="20" y1="20" x2="160" y2="105" stroke="#ec4899" strokeWidth="1.5" strokeDasharray="3 2" />
            </svg>
            <div className="absolute bottom-2 left-2 text-[10px] font-mono text-cyan-300 bg-slate-950/80 px-2 py-0.5 rounded">
              Corner Point Method · Optimal Z
            </div>
          </div>
        );
      case 'probability-distribution-lab':
        return (
          <div className="w-full h-32 sm:h-36 bg-gradient-to-br from-slate-900 via-emerald-950/30 to-slate-900 rounded-xl relative overflow-hidden flex items-center justify-center border border-emerald-900/30">
            <svg viewBox="0 0 220 120" className="w-48 h-28 stroke-cyan-400 fill-none">
              <rect x="40" y="85" width="20" height="20" fill="rgba(16, 185, 129, 0.4)" stroke="#10b981" rx="2" />
              <rect x="68" y="60" width="20" height="45" fill="rgba(16, 185, 129, 0.6)" stroke="#10b981" rx="2" />
              <rect x="96" y="30" width="20" height="75" fill="rgba(16, 185, 129, 0.8)" stroke="#10b981" rx="2" />
              <rect x="124" y="55" width="20" height="50" fill="rgba(16, 185, 129, 0.6)" stroke="#10b981" rx="2" />
              <rect x="152" y="80" width="20" height="25" fill="rgba(16, 185, 129, 0.4)" stroke="#10b981" rx="2" />
              <polygon points="106,105 98,118 114,118" fill="#f59e0b" />
              <text x="106" y="22" fill="#fbbf24" fontSize="9" fontWeight="bold" textAnchor="middle">μ = E(X)</text>
            </svg>
            <div className="absolute bottom-2 left-2 text-[10px] font-mono text-emerald-300 bg-slate-950/80 px-2 py-0.5 rounded">
              Σ P(X=xᵢ) = 1 · E(X) = Σ xᵢ P(xᵢ)
            </div>
          </div>
        );
      default:
        return (
          <div className="w-full h-32 sm:h-36 bg-gradient-to-br from-slate-900 via-cyan-950/20 to-slate-900 rounded-xl relative overflow-hidden flex items-center justify-center border border-slate-800">
            <div className="text-center p-3 space-y-1">
              <GraduationCap className="w-8 h-8 text-cyan-400 mx-auto" />
              <div className="text-xs font-mono text-slate-300">Visual Math Simulator</div>
            </div>
          </div>
        );
    }
  };

  const activeDoubtSim = SIMULATORS.find((s) => s.id === selectedDoubtTopic) || SIMULATORS[0];

  const renderMobileCompactCard = (sim: typeof SIMULATORS[0]) => {
    const Icon = getSimulatorIcon(sim.id);
    const isDone = completedSimulators.includes(sim.id);
    const ncert = getNcertMapping(sim.id);

    return (
      <div
        key={sim.id}
        onClick={() => {
          lightTap();
          navigateTo(sim.id);
        }}
        className="p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/60 flex flex-col gap-2 shadow-md active:border-cyan-500/50 transition-all cursor-pointer group hover:shadow-cyan-950/20"
      >
        <div className="flex items-start justify-between gap-2.5">
          <div className="flex items-start gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
              <Icon className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[9px] font-mono font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-1.5 py-0.5 rounded">
                  {sim.grade}
                </span>
                <span className="text-[9px] text-slate-400 font-medium">
                  {sim.category}
                </span>
                {ncert && (
                  <span className="text-[9px] font-semibold text-emerald-300 bg-emerald-950/70 border border-emerald-800/70 px-1.5 py-0.5 rounded flex items-center gap-1">
                    <span>📚 Ch {ncert.chapterNumber}</span>
                  </span>
                )}
              </div>
              <h3 className="font-bold text-xs text-white mt-0.5 leading-snug group-hover:text-cyan-300 transition-colors">
                {sim.title}
              </h3>
              {ncert && (
                <div className="text-[10px] text-emerald-400/90 font-medium truncate mt-0.5">
                  Syllabus: Ch {ncert.chapterNumber} • {ncert.chapterName} (CBSE / ICSE / State Boards)
                </div>
              )}
            </div>
          </div>

          {isDone && (
            <span className="text-[9px] font-semibold text-emerald-400 flex items-center gap-0.5 shrink-0 bg-emerald-950/40 border border-emerald-800/50 px-1.5 py-0.5 rounded-full">
              <CheckCircle2 className="w-2.5 h-2.5" />
              Done
            </span>
          )}
        </div>

        {/* Pure KaTeX Math Formula Presentation */}
        <div className="py-1 px-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-center overflow-hidden flex items-center justify-center min-h-[38px]">
          <div className="w-full overflow-x-auto no-scrollbar text-center">
            <BlockMath 
              math={sim.formulaPreview || sim.latexFormula} 
              className="!my-0 text-cyan-300 text-xs" 
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-1.5 pt-1.5 border-t border-slate-800/60">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              lightTap();
              navigateTo(sim.id);
              setActiveSheetTab('theory');
              setBottomSheetSnap('half');
            }}
            className="min-h-[38px] px-3 py-1.5 rounded-xl bg-slate-800 text-slate-200 font-semibold text-xs flex items-center gap-1 border border-slate-700 active:scale-95 transition-all cursor-pointer hover:text-white"
          >
            <BookOpen className="w-3 h-3 text-cyan-400" />
            <span>Theory</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              lightTap();
              navigateTo(sim.id);
            }}
            className="min-h-[38px] flex-1 px-3.5 py-1.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-cyan-500/20 active:scale-95 transition-all cursor-pointer group-hover:bg-cyan-400"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Launch Lab</span>
          </button>
        </div>
      </div>
    );
  };

  const renderMobileVisualCard = (sim: typeof SIMULATORS[0]) => {
    const isDone = completedSimulators.includes(sim.id);
    const ncert = getNcertMapping(sim.id);

    return (
      <div
        key={sim.id}
        onClick={() => {
          lightTap();
          navigateTo(sim.id);
        }}
        className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/60 space-y-2.5 shadow-md active:border-cyan-500/50 transition-all cursor-pointer group hover:shadow-cyan-950/20"
      >
        {/* Preview Graphic */}
        {getSimulatorPreviewGraphic(sim.id)}

        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold text-cyan-400 text-[11px]">
            {sim.grade} · {sim.category}
          </span>
          {isDone ? (
            <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold bg-emerald-950/40 border border-emerald-800/50 px-1.5 py-0.5 rounded-full">
              <CheckCircle2 className="w-3 h-3" /> Mastered
            </span>
          ) : (
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-500" />
              <span>{sim.estimatedMinutes} min</span>
            </span>
          )}
        </div>

        {ncert && (
          <div className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-emerald-300 bg-emerald-950/70 border border-emerald-800/70 px-2 py-0.5 rounded-md flex-wrap">
            <span>📚 Curriculum Ch {ncert.chapterNumber}: {ncert.chapterName}</span>
            <span className="text-[9px] font-mono text-emerald-400/90 bg-emerald-900/40 px-1 rounded">CBSE • ICSE • State Boards</span>
          </div>
        )}

        <div>
          <h3 className="font-bold text-sm text-white leading-snug group-hover:text-cyan-300 transition-colors">{sim.title}</h3>
          <p className="text-xs text-slate-300 line-clamp-2 mt-1 leading-relaxed">
            {sim.description}
          </p>
        </div>

        {/* Pure KaTeX Math Formula Presentation */}
        <div className="py-1 px-2 rounded-xl bg-slate-950/80 border border-slate-800 text-center overflow-hidden flex items-center justify-center min-h-[38px]">
          <div className="w-full overflow-x-auto no-scrollbar text-center">
            <BlockMath 
              math={sim.formulaPreview || sim.latexFormula} 
              className="!my-0 text-cyan-300 text-xs" 
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-800/60">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              lightTap();
              navigateTo(sim.id);
              setActiveSheetTab('theory');
              setBottomSheetSnap('half');
            }}
            className="min-h-[40px] px-3.5 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-700 active:scale-95 transition-all cursor-pointer hover:text-white"
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400 inline mr-1" />
            <span>Theory</span>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              lightTap();
              navigateTo(sim.id);
            }}
            className="min-h-[40px] flex-1 px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-cyan-500/20 active:scale-95 transition-all cursor-pointer group-hover:bg-cyan-400"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Launch Lab</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-4 sm:py-8 space-y-6 sm:space-y-8 overflow-x-hidden">
      {/* ======================================================== */}
      {/* OFFICIAL PARENT SITE AFFILIATION & WELCOME BANNER        */}
      {/* ======================================================== */}
      <div className="w-full rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-cyan-950/80 border border-emerald-500/30 p-3 sm:p-4 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-80 h-full bg-emerald-500/5 blur-3xl rounded-full pointer-events-none" />
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-300 shrink-0 shadow-md">
            <Sparkles className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-emerald-300 bg-emerald-950/90 border border-emerald-700/70 px-2.5 py-0.5 rounded-full shadow-xs">
                Official Interactive Division of itsmathtime.co.in
              </span>
              <span className="text-xs font-bold text-white">
                By Alka Ma&apos;am
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5">
              Welcome from <strong className="text-emerald-300 font-semibold">itsmathtime.co.in</strong>! You are inside the 50+ Virtual Laboratories for Classes 8–12. Touch, slide, and explore every concept in real time.
            </p>
          </div>
        </div>
        <a
          href="https://itsmathtime.co.in"
          className="shrink-0 px-3.5 py-2 rounded-xl bg-slate-900/95 hover:bg-slate-800 border border-slate-700/90 hover:border-emerald-400 text-xs font-bold text-slate-200 hover:text-white flex items-center gap-2 transition-all shadow-md active:scale-95 group/btn"
          title="Return to parent website: itsmathtime.co.in"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-emerald-400 group-hover/btn:-translate-x-0.5 transition-transform" />
          <span>Back to itsmathtime.co.in</span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </a>
      </div>

      {/* ======================================================== */}
      {/* DESKTOP Cockpit Experience (>= 768px): 100% UNTOUCHED!    */}
      {/* ======================================================== */}
      <div className="hidden md:block space-y-6 sm:space-y-8">
        {/* Hero Presentation: Math Time Lab Zero-Click Interactive Playground (Split Stage) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column: Messaging & High-Converting Action Triggers (Prominent, Big & Inspiring) */}
          <div className="lg:col-span-7 xl:col-span-7 space-y-5">
            {/* Official Brand Logo & Accreditation Badges */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <img 
                src="/math-time-logo.png" 
                alt="Math Time BY ALKA MA'AM" 
                className="h-10 sm:h-12 w-auto object-contain select-none"
              />
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/80 text-xs text-emerald-300 font-semibold shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Classes 8–12 Visual Labs</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-950/60 border border-amber-800/60 text-[11px] text-amber-300 font-semibold">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  Curated by Alka Ma'am
                </span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[42px] xl:text-[46px] font-black tracking-tight text-white leading-[1.12]">
              Deep Concept Clarity. <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300">
                Math You Can Touch, Explore &amp; Master.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal max-w-xl">
              Experience mathematical laws as living, interactive systems. Touch, slide, and watch geometric theorems, calculus rates, and algebraic relationships reveal themselves naturally across 50 visual laboratories.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => {
                  lightTap();
                  const el = document.getElementById('curriculum-directory-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-sky-400 hover:from-cyan-400 hover:to-sky-300 text-slate-950 font-black text-sm flex items-center gap-2 shadow-xl shadow-cyan-500/25 active:scale-95 transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>Explore 50+ Simulators</span>
              </button>

              <a
                href="https://itsmathtime.co.in"
                className="px-4 py-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-400 text-slate-200 hover:text-white font-bold text-sm flex items-center gap-2 transition-all cursor-pointer shadow-md group"
                title="Return to parent website itsmathtime.co.in"
              >
                <ArrowLeft className="w-4 h-4 text-emerald-400 group-hover:-translate-x-0.5 transition-transform" />
                <span>Back to itsmathtime.co.in</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>

              <button
                type="button"
                onClick={() => {
                  lightTap();
                  setIsAuthorModalOpen(true);
                }}
                className="px-4 py-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500/50 text-slate-200 hover:text-white font-bold text-sm flex items-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Meet Alka Ma'am &amp; Pedagogy</span>
              </button>
            </div>

            {/* Quick Proof Badges */}
            <div className="pt-2 grid grid-cols-3 gap-2 text-[11px] text-slate-400 border-t border-slate-800/80">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>100% Free &amp; Zero Sign-up</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Pure KaTeX Formulas</span>
              </div>
              <div className="flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span>Classes 8–12 Aligned</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Zero-Click Tactile Playground Stage (Sleek & Compact) */}
          <div className="lg:col-span-5 xl:col-span-5">
            <LiveHomeSimulatorSampler />
          </div>
        </section>

        {/* ======================================================== */}
        {/* SELF-STUDY GUIDE: HOW TO LEARN WITHOUT A TEACHER         */}
        {/* ======================================================== */}
        <section>
          <HowToLearnGuideRibbon 
            onChooseClassClick={() => {
              const el = document.getElementById('choose-your-class-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        </section>

        {/* ======================================================== */}
        {/* CHOOSE YOUR CLASS TO START (CLASSES 8–12 GATEWAYS)        */}
        {/* ======================================================== */}
        <ClassGatewaysSection />

        {/* Smartboard-Ready Teaching Toolkit for Educators */}
        <section>
          <TeacherSmartboardToolkit />
        </section>

        {/* Audience Value Proposition for Students & Teachers (Desktop) */}
        <section>
          <AudienceValueProposition />
        </section>

        {/* Meet the Educator: Alka Sharma (Alka Ma'am - itsmathtime.co.in) */}
        <AuthorSpotlightSection />



        {/* Daily Challenge Card for High Retention */}
        <section>
          <DailyChallenge />
        </section>

        {/* Desktop Coach's Desk: High-Impact Conceptual Intuition Studio */}
        <section className="relative rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-slate-800/90 p-5 sm:p-7 shadow-xl space-y-5 overflow-hidden">
          {/* Subtle background ambient glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10 border-b border-amber-500/20 pb-3.5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-md">
                <Lightbulb className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
                  <span>Coach&apos;s Desk: Clear Your Biggest Math Roadblocks</span>
                  <span className="hidden md:inline text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-800 px-2 py-0.5 rounded-full">
                    By Alka Ma&apos;am
                  </span>
                </h2>
                <p className="text-xs text-slate-300 font-normal">
                  Tap any core concept below to understand what textbooks never explained:
                </p>
              </div>
            </div>
          </div>

          {/* Topic Quick Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 relative z-10">
            {SIMULATORS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  lightTap();
                  setSelectedDoubtTopic(s.id);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${
                  selectedDoubtTopic === s.id
                    ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 border-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.4)] font-black scale-[1.03]'
                    : 'bg-slate-950/80 text-slate-300 border-slate-700/80 hover:text-white hover:border-amber-500/40'
                }`}
              >
                {s.shortTitle}
              </button>
            ))}
          </div>

          {/* Active Coach Roadblock Card */}
          <div className="p-5 rounded-2xl bg-slate-950/90 border border-amber-500/25 space-y-4 relative z-10 shadow-inner">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-mono font-black text-amber-300 bg-amber-950 border border-amber-800 px-2.5 py-0.5 rounded-lg shadow-xs">
                  {activeDoubtSim.grade}
                </span>
                <h3 className="font-black text-sm sm:text-base text-white tracking-tight">{activeDoubtSim.title}</h3>
              </div>

              <button
                type="button"
                onClick={() => {
                  lightTap();
                  navigateTo(activeDoubtSim.id);
                }}
                className="self-start sm:self-auto px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-md hover:brightness-110 transition-all cursor-pointer active:scale-95"
              >
                <span>Test on Live Simulator</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>

            {/* Textbook Trap vs Coach Secret (High-Contrast Split Cards) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-rose-950/25 border border-rose-800/40 space-y-1.5 shadow-sm">
                <span className="font-bold text-rose-400 block text-[11px] uppercase tracking-wider font-mono">
                  ❌ What Textbooks Say (The Confusion)
                </span>
                <p className="text-slate-200 leading-relaxed font-sans text-xs sm:text-[13px]">
                  {activeDoubtSim.textbookTrap}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-950/25 border border-emerald-800/40 space-y-1.5 shadow-sm">
                <span className="font-bold text-emerald-400 block text-[11px] uppercase tracking-wider font-mono">
                  💡 Coach Intuition (What Actually Happens)
                </span>
                <p className="text-slate-200 leading-relaxed font-sans text-xs sm:text-[13px]">
                  {activeDoubtSim.coachSecret}
                </p>
              </div>
            </div>

            {/* Pure KaTeX Math Display */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-center shadow-inner">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono font-bold block mb-1">
                Exact Mathematical Formulation (KaTeX)
              </span>
              <BlockMath math={activeDoubtSim.latexFormula} className="my-1 text-cyan-300" />
            </div>
          </div>
        </section>

        {/* DESKTOP Filter & Discovery Cockpit (>= 768px) */}
        <section id="curriculum-directory-section" className="space-y-3.5 scroll-mt-14">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
                <span>Interactive Math Laboratories</span>
                <span className="text-xs font-mono font-normal text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-800/60">
                  {filteredSimulators.length} of {SIMULATORS.length} Active
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Explore by curriculum grade or topic domain:
              </p>
            </div>

            {/* Quick in-line Search + View Toggle */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter topics..."
                  className="pl-8 pr-7 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-44 sm:w-56 transition-colors"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center p-0.5 bg-slate-900 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    lightTap();
                    setDesktopViewMode('grid');
                  }}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    desktopViewMode === 'grid'
                      ? 'bg-cyan-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Visual Grid View (3 Columns)"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    lightTap();
                    setDesktopViewMode('compact');
                  }}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    desktopViewMode === 'compact'
                      ? 'bg-cyan-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Compact List View"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Tier 1: Class Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: 'All Classes' },
              { id: 'class-8', label: 'Class 8' },
              { id: 'class-9', label: 'Class 9' },
              { id: 'class-10', label: 'Class 10' },
              { id: 'class-11', label: 'Class 11' },
              { id: 'class-12', label: 'Class 12' },
            ].map((grade) => (
              <button
                key={grade.id}
                onClick={() => {
                  lightTap();
                  setGradeFilter(grade.id as GradeLevel);
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap touch-manipulation cursor-pointer ${
                  gradeFilter === grade.id
                    ? 'bg-cyan-500 text-slate-950 shadow-sm font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {grade.label}
              </button>
            ))}
          </div>

          {/* Tier 2: Topic Domain Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs">
            <span className="text-[10px] uppercase font-bold text-slate-500 shrink-0 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3 text-cyan-400" />
              <span>Topic:</span>
            </span>
            {[
              { id: 'all', label: 'All Topics' },
              { id: 'Algebra', label: '⚖️ Algebra' },
              { id: 'Geometry', label: '📐 Geometry' },
              { id: 'Coordinate Geometry', label: '🎯 Coordinate' },
              { id: 'Trigonometry', label: '🏹 Trigonometry' },
              { id: 'Calculus', label: '📈 Calculus' },
              { id: 'Conics & 3D', label: '🪐 Conics & 3D' },
              { id: 'Linear Algebra', label: '🧮 Matrices' },
              { id: 'Probability', label: '🎲 Probability' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  lightTap();
                  setCategoryFilter(cat.id);
                }}
                className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all cursor-pointer ${
                  categoryFilter === cat.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-bold'
                    : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </section>

        {/* DESKTOP Simulators Grid (Responsive 3/4 Columns for Laptops & Desktops) */}
        <section className={`grid ${desktopViewMode === 'compact' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6'}`}>
          {filteredSimulators.map((sim) => {
            const Icon = getSimulatorIcon(sim.id);
            const isDone = completedSimulators.includes(sim.id);
            const ncert = getNcertMapping(sim.id);

            if (desktopViewMode === 'compact') {
              return (
                <div
                  key={sim.id}
                  onClick={() => {
                    lightTap();
                    navigateTo(sim.id);
                  }}
                  className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-xl p-3 flex items-center justify-between gap-3 transition-all duration-200 shadow-sm group cursor-pointer"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-1.5 text-[11px] flex-wrap">
                      <span className="font-bold text-cyan-400">{sim.grade}</span>
                      <span className="text-slate-600">·</span>
                      <span className="text-slate-400 font-mono text-[10px]">{sim.category}</span>
                      {ncert && (
                        <>
                          <span className="text-slate-600">·</span>
                          <span className="text-emerald-300 font-semibold text-[10px] bg-emerald-950/60 border border-emerald-800/60 px-1.5 py-0.5 rounded">
                            Ch {ncert.chapterNumber}
                          </span>
                        </>
                      )}
                      <span className="text-slate-600">·</span>
                      <span className="text-slate-400 text-[10px] flex items-center gap-0.5">
                        <Clock className="w-2.5 h-2.5 text-slate-500" />
                        <span>{sim.estimatedMinutes}m</span>
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-white truncate group-hover:text-cyan-300 transition-colors">
                      {sim.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 line-clamp-1">
                      {ncert ? `Syllabus: Ch ${ncert.chapterNumber} ${ncert.chapterName} (CBSE • ICSE • State Boards) — ${sim.description}` : sim.description}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      lightTap();
                      navigateTo(sim.id);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1 shrink-0 active:scale-95 transition-all shadow-sm cursor-pointer"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Launch</span>
                  </button>
                </div>
              );
            }

            return (
              <div
                key={sim.id}
                onClick={() => {
                  lightTap();
                  navigateTo(sim.id);
                }}
                className="group bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all duration-200 shadow-lg shadow-black/20 cursor-pointer hover:shadow-cyan-950/30"
              >
                <div className="space-y-3">
                  {/* Visual Preview Graphic */}
                  {getSimulatorPreviewGraphic(sim.id)}

                  {/* Metadata */}
                  <div className="flex items-center gap-2 text-xs text-slate-400 flex-wrap">
                    <span className="font-semibold text-cyan-400">{sim.grade}</span>
                    <span aria-hidden="true">·</span>
                    <span>{sim.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>{sim.estimatedMinutes} min</span>
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{sim.difficulty}</span>
                  </div>

                  {/* Multi-Board Syllabus Anchor Badge */}
                  {ncert && (
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300 bg-emerald-950/70 border border-emerald-800/70 px-2.5 py-1 rounded-lg flex-wrap">
                      <span>📚 Class {ncert.gradeNumber} • Ch {ncert.chapterNumber}: {ncert.chapterName}</span>
                      <span className="text-[10px] font-mono text-emerald-400/90 bg-emerald-900/40 px-1.5 py-0.5 rounded">
                        CBSE • ICSE • State Boards • NCERT Aligned
                      </span>
                    </div>
                  )}

                  {/* Simulator Title & Description */}
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                      {sim.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
                      {sim.description}
                    </p>
                  </div>

                  {/* Pure KaTeX Math Formula Presentation */}
                  <div className="py-2 px-3 rounded-xl bg-slate-950/80 border border-slate-800/80 overflow-hidden shadow-inner flex items-center justify-center min-h-[46px]">
                    <div className="w-full overflow-x-auto no-scrollbar text-center flex items-center justify-center">
                      <BlockMath 
                        math={sim.formulaPreview || sim.latexFormula} 
                        className="!my-0 text-cyan-300 text-xs sm:text-[13px] tracking-wide" 
                      />
                    </div>
                  </div>

                  {/* Coach's Secret Callout */}
                  <div className="p-2.5 rounded-xl bg-cyan-950/20 border border-cyan-800/30 text-[11px] text-cyan-200 flex items-start gap-2">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <p className="line-clamp-2 leading-relaxed">
                      <strong className="text-amber-300">{"Coach Note: "}</strong>
                      {sim.coachSecret}
                    </p>
                  </div>

                  {/* Key Concept Chips */}
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-400">
                    {sim.keyConcepts.map((concept) => (
                      <span key={concept} className="flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-slate-600" />
                        {concept}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="pt-4 mt-3 border-t border-slate-800/70 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {isDone ? (
                      <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Mastered
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        Ready to Learn
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        lightTap();
                        navigateTo(sim.id);
                        setActiveSheetTab('theory');
                        setBottomSheetSnap('half');
                      }}
                      className="min-h-[40px] px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-semibold text-xs flex items-center gap-1.5 transition-colors border border-slate-700 cursor-pointer"
                      title="View Theory & Doubts"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Theory</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        lightTap();
                        navigateTo(sim.id);
                      }}
                      className="min-h-[40px] px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 active:scale-95 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-transform touch-manipulation shadow-md shadow-cyan-500/20 cursor-pointer group-hover:bg-cyan-400"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Launch</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {/* Educational Standards & Nominative Fair-Use Trademark Notice */}
        <section className="p-4 sm:p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 space-y-2 text-xs text-slate-400">
          <h4 className="font-bold text-slate-200 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Curriculum Alignment &amp; Visual Intuition Standards</span>
          </h4>
          <p className="leading-relaxed">
            Every laboratory is mapped to foundational concepts across secondary and senior secondary mathematics (Classes 8–12), designed to supplement standard school curricula (such as CBSE, ICSE, Cambridge IGCSE/A-Levels, State Boards, and competitive entrance patterns). Pure mathematical derivations and formulas are rendered via KaTeX.
          </p>
          <p className="text-[10px] text-slate-500 pt-1.5 border-t border-slate-800/60 leading-normal">
            <strong>Disclaimer:</strong> Math Time Lab is an independent open educational laboratory. CBSE, ICSE, Cambridge Assessment International Education, NCERT, and State Boards are trademarks or registered trademarks of their respective authorities. Reference to them is made solely to indicate curriculum syllabus alignment for educational reference purposes only and does not imply official endorsement, affiliation, or sponsorship.
          </p>
        </section>
      </div>

      {/* ======================================================== */}
      {/* MOBILE Experience (< 768px): World-Class & Touch-First    */}
      {/* ======================================================== */}
      <div className="md:hidden space-y-5">
        {/* 1. Compelling High-Converting Hero Section */}
        <section className="p-4 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-cyan-500/30 shadow-2xl space-y-3">
          {/* Mobile Brand Logo & Live XP Header */}
          <div className="flex items-center justify-between gap-2">
            <img 
              src="/math-time-logo.png" 
              alt="Math Time BY ALKA MA'AM" 
              className="h-8 w-auto object-contain select-none"
            />
            <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-800/40 shrink-0">
              <Zap className="w-3 h-3 text-amber-400" />
              <span>{xp} XP</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-950/80 border border-emerald-800/60 px-2 py-0.5 rounded-full">
                itsmathtime.co.in Labs
              </span>
              <span className="text-[10px] text-slate-400 font-mono">By Alka Ma'am</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white leading-tight tracking-tight">
              Deep Concept Clarity. <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-300">Math You Can Touch &amp; Master.</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Experience 50 curriculum-aligned 2D &amp; 3D interactive laboratories built for deep visual intuition and conceptual confidence across Classes 8–12.
            </p>
          </div>

          {/* 3 Core Value Pillars */}
          <div className="grid grid-cols-3 gap-1.5 pt-1 text-center">
            <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-base block mb-0.5">⚡</span>
              <span className="text-[10px] font-bold text-white block">Zero Rote</span>
              <span className="text-[8px] text-slate-400">Visual Intuition</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-base block mb-0.5">🎯</span>
              <span className="text-[10px] font-bold text-white block">Classes 8–12</span>
              <span className="text-[8px] text-slate-400">Curriculum Aligned</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-base block mb-0.5">💡</span>
              <span className="text-[10px] font-bold text-white block">60s Doubts</span>
              <span className="text-[8px] text-slate-400">Coach Notes</span>
            </div>
          </div>

          {/* Quick CTA Actions */}
          <div className="flex flex-col gap-2 pt-1 border-t border-slate-800/70">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  lightTap();
                  const el = document.getElementById('mobile-live-sampler');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-400 text-slate-950 text-xs font-black flex items-center justify-center gap-1.5 shadow-md shadow-cyan-500/20 active:scale-95 transition-all cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Test Live Simulators</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  lightTap();
                  setClass8OdysseyOpen(true);
                }}
                className="py-2.5 px-3 rounded-xl bg-slate-800 text-slate-200 text-xs font-bold border border-slate-700 active:scale-95 transition-all cursor-pointer"
              >
                Odyssey
              </button>
            </div>

            <a
              href="https://itsmathtime.co.in"
              className="w-full py-2 px-3 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/50 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
              title="Return to parent website itsmathtime.co.in"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-emerald-400" />
              <span>Back to itsmathtime.co.in (Main Portal)</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          </div>
        </section>

        {/* ======================================================== */}
        {/* MOBILE SELF-STUDY GUIDE: HOW TO LEARN WITHOUT A TEACHER  */}
        {/* ======================================================== */}
        <section>
          <HowToLearnGuideRibbon 
            onChooseClassClick={() => {
              const el = document.getElementById('mobile-curriculum-section') || document.getElementById('choose-your-class-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        </section>

        {/* ======================================================== */}
        {/* MOBILE CHOOSE YOUR CLASS (CLASSES 8–12 GATEWAYS)          */}
        {/* ======================================================== */}
        <section>
          <ClassGatewaysSection />
        </section>

        {/* 2. Interactive Value Proposition: Why Students and Teachers Rely On It */}
        <section>
          <AudienceValueProposition />
        </section>

        {/* 3. Live Working Interactive Simulator Sampler */}
        <section id="mobile-live-sampler">
          <LiveHomeSimulatorSampler />
        </section>

        {/* 3.5. Smartboard & Classroom Teaching Toolkit (Mobile) */}
        <section>
          <TeacherSmartboardToolkit />
        </section>

        {/* Meet the Educator: Alka Sharma (Mobile) */}
        <AuthorSpotlightSection />

        {/* 4. Interactive Class Navigator (3x2 Grid) */}
        <section id="mobile-curriculum-section" className="space-y-1.5 pt-1 scroll-mt-14">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-cyan-400" />
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                Explore Curriculum by Class
              </span>
            </div>
            {gradeFilter !== 'all' && (
              <button
                type="button"
                onClick={() => {
                  lightTap();
                  setGradeFilter('all');
                  setCategoryFilter('all');
                }}
                className="text-[11px] font-bold text-cyan-400 active:text-cyan-300 flex items-center gap-0.5 cursor-pointer"
              >
                <span>View All</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            {[
              { id: 'all', label: 'All Classes', badge: '50 Labs', emoji: '🏫' },
              { id: 'class-8', label: 'Class 8', badge: '10 Labs', emoji: '📐' },
              { id: 'class-9', label: 'Class 9', badge: '10 Labs', emoji: '🎯' },
              { id: 'class-10', label: 'Class 10', badge: '10 Labs', emoji: '🏹' },
              { id: 'class-11', label: 'Class 11', badge: '10 Labs', emoji: '🪐' },
              { id: 'class-12', label: 'Class 12', badge: '10 Labs', emoji: '📦' },
            ].map((c) => {
              const isActive = gradeFilter === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    lightTap();
                    setGradeFilter(c.id as GradeLevel);
                    setCategoryFilter('all');
                  }}
                  className={`py-2 px-1 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer active:scale-95 ${
                    isActive
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md font-bold ring-2 ring-cyan-400/40'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="text-base leading-none mb-1">{c.emoji}</span>
                  <span className="text-[11px] font-bold tracking-tight">{c.label}</span>
                  <span className={`text-[9px] font-mono ${isActive ? 'text-slate-950 font-bold' : 'text-cyan-400'}`}>
                    {c.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* 5. Mobile Search Bar */}
        <section className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search topics (e.g. Pythagoras, Tangent, AP)..."
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </section>

        {/* ======================================================== */}
        {/* SUB-VIEW 1: Search Active                                 */}
        {/* ======================================================== */}
        {searchQuery.trim() !== '' && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-slate-300">
                Found {filteredSimulators.length} {filteredSimulators.length === 1 ? 'lab' : 'labs'} matching "{searchQuery}"
              </span>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 cursor-pointer"
              >
                Clear
              </button>
            </div>

            {filteredSimulators.length === 0 ? (
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-2">
                <HelpCircle className="w-8 h-8 text-cyan-400 mx-auto" />
                <h3 className="text-sm font-bold text-white">No math labs found</h3>
                <p className="text-xs text-slate-400">
                  Try searching for Pythagoras, Tangent, Vector, Quadratic, or AP.
                </p>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="px-3.5 py-1.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs cursor-pointer shadow-md"
                >
                  Reset Search
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredSimulators.map((sim) => renderMobileCompactCard(sim))}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* SUB-VIEW 2: Specific Class Selected (e.g. Class 10)       */}
        {/* ======================================================== */}
        {searchQuery.trim() === '' && gradeFilter !== 'all' && (() => {
          const currentShelf = CLASS_SHELVES.find((s) => s.gradeId === gradeFilter) || CLASS_SHELVES[0];
          const completedInGrade = currentShelf.simulators.filter((s) => completedSimulators.includes(s.id)).length;
          const classCategories = Array.from(new Set(currentShelf.simulators.map((s) => s.category)));

          return (
            <div className="space-y-3">
              {/* Focused Class Header */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-cyan-500/40 space-y-2 shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{currentShelf.emoji}</span>
                    <div>
                      <h2 className="text-sm font-black text-white">{currentShelf.name}: {currentShelf.title}</h2>
                      <p className="text-[11px] text-slate-400">{currentShelf.desc}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 shrink-0">
                    {completedInGrade}/{currentShelf.simulators.length} Done
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${(completedInGrade / currentShelf.simulators.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Subject topic filter chips & View toggle */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5 flex-1">
                  <button
                    type="button"
                    onClick={() => {
                      lightTap();
                      setCategoryFilter('all');
                    }}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap border transition-colors cursor-pointer ${
                      categoryFilter === 'all'
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    All Topics ({currentShelf.simulators.length})
                  </button>
                  {classCategories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        lightTap();
                        setCategoryFilter(cat);
                      }}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap border transition-colors cursor-pointer ${
                        categoryFilter === cat
                          ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* View toggle */}
                <div className="flex items-center p-0.5 bg-slate-900 border border-slate-800 rounded-lg shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      lightTap();
                      setMobileViewMode('list');
                    }}
                    className={`p-1.5 rounded-md transition-colors ${
                      mobileViewMode === 'list' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400'
                    }`}
                    title="Compact List"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      lightTap();
                      setMobileViewMode('cards');
                    }}
                    className={`p-1.5 rounded-md transition-colors ${
                      mobileViewMode === 'cards' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400'
                    }`}
                    title="Visual Cards"
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Simulators List for this class (100% Vertical, ZERO Horizontal Scroll) */}
              <div className="space-y-2">
                {filteredSimulators.map((sim) => {
                  if (mobileViewMode === 'cards') {
                    return renderMobileVisualCard(sim);
                  }
                  return renderMobileCompactCard(sim);
                })}
              </div>

              {/* Bottom Quick Switch */}
              <div className="pt-2 flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    lightTap();
                    setGradeFilter('all');
                    setCategoryFilter('all');
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                >
                  <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                  <span>View All Classes Overview</span>
                </button>
              </div>
            </div>
          );
        })()}

        {/* ======================================================== */}
        {/* SUB-VIEW 3: "All Classes" Overview (100% Vertical, No Side Scroll) */}
        {/* ======================================================== */}
        {searchQuery.trim() === '' && gradeFilter === 'all' && (
          <div className="space-y-4">
            {/* Daily Challenge Interactive Mission */}
            <DailyChallenge compact={true} />

            {/* Vertical Class Curriculum Cards (ZERO Horizontal Scrolling) */}
            <div className="space-y-3">
              <div className="px-1">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Classes 8 to 12 Curriculum Modules
                </h3>
                <p className="text-[11px] text-slate-400">
                  Tap any class to explore all 10 visual labs:
                </p>
              </div>

              {CLASS_SHELVES.map((shelf) => {
                const sampleSim1 = shelf.simulators[0];
                const sampleSim2 = shelf.simulators[1];

                return (
                  <div
                    key={shelf.gradeId}
                    className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-md"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{shelf.emoji}</span>
                        <div>
                          <h4 className="text-sm font-extrabold text-white leading-tight">
                            {shelf.name}: {shelf.title}
                          </h4>
                          <p className="text-[11px] text-slate-400 line-clamp-1">{shelf.desc}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 shrink-0">
                        10 Labs
                      </span>
                    </div>

                    {/* Quick Preview Rows */}
                    <div className="space-y-1.5 pt-0.5">
                      {sampleSim1 && (
                        <div 
                          onClick={() => {
                            lightTap();
                            navigateTo(sampleSim1.id);
                          }}
                          className="flex items-center justify-between p-2 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-cyan-500/50 gap-2 cursor-pointer group transition-all"
                        >
                          <div className="min-w-0">
                            <span className="text-[9px] font-mono text-cyan-400 block">{sampleSim1.category}</span>
                            <span className="text-xs font-semibold text-white truncate block group-hover:text-cyan-300 transition-colors">{sampleSim1.shortTitle || sampleSim1.title}</span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              lightTap();
                              navigateTo(sampleSim1.id);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-cyan-500/20 group-hover:bg-cyan-500 group-hover:text-slate-950 text-cyan-300 border border-cyan-500/40 text-[11px] font-bold shrink-0 flex items-center gap-1 active:scale-95 cursor-pointer transition-colors"
                          >
                            <Play className="w-2.5 h-2.5 fill-current" />
                            <span>Play</span>
                          </button>
                        </div>
                      )}

                      {sampleSim2 && (
                        <div 
                          onClick={() => {
                            lightTap();
                            navigateTo(sampleSim2.id);
                          }}
                          className="flex items-center justify-between p-2 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-cyan-500/50 gap-2 cursor-pointer group transition-all"
                        >
                          <div className="min-w-0">
                            <span className="text-[9px] font-mono text-cyan-400 block">{sampleSim2.category}</span>
                            <span className="text-xs font-semibold text-white truncate block group-hover:text-cyan-300 transition-colors">{sampleSim2.shortTitle || sampleSim2.title}</span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              lightTap();
                              navigateTo(sampleSim2.id);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-cyan-500/20 group-hover:bg-cyan-500 group-hover:text-slate-950 text-cyan-300 border border-cyan-500/40 text-[11px] font-bold shrink-0 flex items-center gap-1 active:scale-95 cursor-pointer transition-colors"
                          >
                            <Play className="w-2.5 h-2.5 fill-current" />
                            <span>Play</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Full Class Action Button */}
                    <button
                      type="button"
                      onClick={() => {
                        lightTap();
                        setGradeFilter(shelf.gradeId);
                        setCategoryFilter('all');
                      }}
                      className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-slate-800 to-slate-850 hover:from-cyan-950/40 hover:to-slate-800 text-cyan-300 border border-cyan-500/30 text-xs font-bold flex items-center justify-center gap-1.5 active:scale-98 transition-all cursor-pointer shadow-sm"
                    >
                      <span>Explore All 10 {shelf.name} Labs</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Collapsible Mobile Coach's Desk */}
            <div className="rounded-2xl bg-slate-900/95 border border-slate-800 p-3 shadow-xl space-y-2.5">
              <button
                type="button"
                onClick={() => {
                  lightTap();
                  setIsMobileCoachDeskOpen(!isMobileCoachDeskOpen);
                }}
                className="w-full flex items-center justify-between text-left cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                    <Lightbulb className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white leading-tight">
                      Coach's Desk: Concept Roadblock Clearer
                    </h3>
                    <p className="text-[10px] text-slate-400">
                      {isMobileCoachDeskOpen ? "Tap to collapse" : "Tap to reveal textbook misconceptions"}
                    </p>
                  </div>
                </div>
                {isMobileCoachDeskOpen ? (
                  <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-cyan-400 shrink-0" />
                )}
              </button>

              {isMobileCoachDeskOpen && (
                <div className="space-y-3 pt-2 border-t border-slate-800">
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                    {SIMULATORS.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          lightTap();
                          setSelectedDoubtTopic(s.id);
                        }}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap border cursor-pointer ${
                          selectedDoubtTopic === s.id
                            ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold'
                            : 'bg-slate-950/80 text-slate-400 border-slate-800'
                        }`}
                      >
                        {s.shortTitle}
                      </button>
                    ))}
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-950/50 border border-amber-800/50 px-1.5 py-0.5 rounded">
                        {activeDoubtSim.grade}
                      </span>
                      <button
                        type="button"
                        onClick={() => navigateTo(activeDoubtSim.id)}
                        className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <span>Test Lab</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                    <h4 className="font-bold text-white text-xs">{activeDoubtSim.title}</h4>
                    <div className="p-2 rounded-lg bg-rose-950/20 border border-rose-900/40 text-[11px] text-slate-300">
                      <strong className="text-rose-400 block mb-0.5">❌ Textbook Trap:</strong>
                      {activeDoubtSim.textbookTrap}
                    </div>
                    <div className="p-2 rounded-lg bg-emerald-950/20 border border-emerald-900/40 text-[11px] text-slate-300">
                      <strong className="text-emerald-400 block mb-0.5">💡 Coach Intuition:</strong>
                      {activeDoubtSim.coachSecret}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Class 8 Odyssey Spotlight Banner */}
            <div className="p-3 rounded-2xl bg-gradient-to-r from-sky-950/80 via-indigo-950/60 to-slate-900 border border-sky-500/40 flex items-center justify-between gap-3 shadow-md">
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="text-xs font-bold text-white truncate">Class 8 Math Odyssey</span>
                </div>
                <p className="text-[10px] text-slate-300 line-clamp-1">
                  10 foundational labs: balance scales, algebra tiles &amp; 3D solids.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  lightTap();
                  setClass8OdysseyOpen(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs shrink-0 active:scale-95 shadow-sm cursor-pointer"
              >
                Explore
              </button>
            </div>

            {/* Educational Standards & Trademark Disclaimer (Mobile) */}
            <div className="p-3 rounded-2xl bg-slate-900/50 border border-slate-800/80 space-y-1.5 text-xs text-slate-400">
              <h4 className="font-bold text-slate-200 flex items-center gap-1.5 text-xs">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>The Visual Intuition Guarantee</span>
              </h4>
              <p className="text-[11px] leading-relaxed">
                Every simulator includes interactive math models, derivation steps, and pure formulas rendered with KaTeX. Built to supplement secondary and higher secondary math standards (Classes 8–12, covering CBSE, ICSE, Cambridge &amp; State Boards).
              </p>
              <p className="text-[9px] text-slate-500 pt-1 border-t border-slate-800/60 leading-normal">
                Disclaimer: Math Time Lab is an independent open educational laboratory. CBSE, ICSE, Cambridge, NCERT, and State Boards are trademarks of their respective authorities; mention denotes curriculum alignment for educational reference only without endorsement.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
