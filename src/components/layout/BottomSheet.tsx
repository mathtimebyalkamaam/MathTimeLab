import React, { useRef, useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Sliders, 
  BookOpen, 
  Trophy, 
  RotateCcw, 
  Sparkles, 
  GitFork, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  PanelLeftClose, 
  PanelLeftOpen, 
  PanelRightClose, 
  PanelRightOpen, 
  GraduationCap, 
  Maximize2,
  Minimize2,
  Columns,
  Layers,
  Pin,
  Award
} from 'lucide-react';
import { BottomSheetSnap, SheetTab, useSimulatorStore } from '../../store/useSimulatorStore';
import { InlineMath } from '../common/MathFormula';
import { useHaptics } from '../../hooks/useHaptics';
import { useSound } from '../common/SoundManager';

interface BottomSheetProps {
  title: string;
  onReset?: () => void;
  children: React.ReactNode;
  theoryContent: React.ReactNode;
  challengeContent: React.ReactNode;
  quickEquation?: string;
  badgeLabel?: string;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  title,
  onReset,
  children,
  theoryContent,
  challengeContent,
  quickEquation,
  badgeLabel,
}) => {
  const {
    isBottomSheetOpen,
    bottomSheetSnap,
    activeSheetTab,
    isZenMode,
    isLeftSidebarOpen,
    isRightSidebarOpen,
    isLeftSidebarWide,
    toggleLeftSidebarWide,
    isCompactControlsMode,
    toggleCompactControlsMode,
    isCanvasHudPinned,
    toggleCanvasHudPinned,
    setIsAuthorModalOpen,
    setBottomSheetOpen,
    setBottomSheetSnap,
    setActiveSheetTab,
    toggleLeftSidebar,
    toggleRightSidebar,
    openDerivationLadderModal,
    openPOEModal,
  } = useSimulatorStore();

  const { lightTap, selectionTick } = useHaptics();
  const { playClick, playResonance } = useSound();

  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  // Desktop active tab inside the left sidebar ('controls' vs 'mission')
  const [desktopLeftTab, setDesktopLeftTab] = useState<'controls' | 'mission'>('controls');

  // Touch drag gesture handling for the mobile grab handle
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY === null) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - touchStartY;

    if (diff > 45) {
      if (bottomSheetSnap === 'full') {
        setBottomSheetSnap('half');
        setTouchStartY(currentY);
      } else if (bottomSheetSnap === 'half') {
        setBottomSheetSnap('peek');
        setTouchStartY(currentY);
      }
    } else if (diff < -45) {
      if (bottomSheetSnap === 'peek') {
        setBottomSheetSnap('half');
        setTouchStartY(currentY);
      } else if (bottomSheetSnap === 'half') {
        setBottomSheetSnap('full');
        setTouchStartY(currentY);
      }
    }
  };

  const handleTouchEnd = () => {
    setTouchStartY(null);
  };

  const toggleSnap = () => {
    lightTap();
    if (bottomSheetSnap === 'peek') setBottomSheetSnap('half');
    else if (bottomSheetSnap === 'half') setBottomSheetSnap('full');
    else setBottomSheetSnap('peek');
  };

  const openMobileTab = (tab: SheetTab) => {
    lightTap();
    setActiveSheetTab(tab);
    if (bottomSheetSnap === 'peek') {
      setBottomSheetSnap('half');
    }
  };

  // Mobile ergonomic heights: half height is capped at 34vh so 66% of viewport is always visible canvas!
  const getMobileHeightClass = () => {
    if (!isBottomSheetOpen || isZenMode) return 'translate-y-full';
    switch (bottomSheetSnap) {
      case 'peek':
        return 'h-10 sm:h-11';
      case 'half':
        return 'h-[34vh] sm:h-[38vh]';
      case 'full':
        return 'h-[80vh] sm:h-[75vh]';
      default:
        return 'h-[34vh]';
    }
  };

  const cleanTitle = title.split(':')[0].replace(/Mission Control/i, '').trim();

  return (
    <>
      {/* ========================================================================= */}
      {/* DESKTOP & LAPTOP 3-COLUMN COCKPIT (Visible on screens >= 1024px)          */}
      {/* ========================================================================= */}

      {/* Floating Smart Canvas HUD Overlay (Desktop & Mobile) */}
      {isCanvasHudPinned && !isZenMode && (badgeLabel || quickEquation) && (
        <div className="fixed top-13 sm:top-15 right-3 lg:right-[350px] xl:right-[430px] z-20 pointer-events-auto transition-all animate-fade-in select-none max-w-[92vw]">
          <div className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-cyan-400/60 shadow-2xl flex items-center gap-2.5 text-xs sm:text-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0 shadow-sm shadow-emerald-400" />
            <div className="flex items-center gap-2 truncate">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider hidden xs:inline shrink-0">Live:</span>
              {badgeLabel && (
                <span className="font-mono font-bold text-cyan-200 text-xs sm:text-sm truncate">
                  <InlineMath math={badgeLabel} />
                </span>
              )}
              {quickEquation && (
                <span className="font-mono text-slate-200 text-xs sm:text-sm border-l border-slate-700 pl-2 hidden md:inline truncate">
                  <InlineMath math={quickEquation} />
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                lightTap();
                toggleCanvasHudPinned();
              }}
              className="p-0.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white shrink-0 cursor-pointer"
              title="Dismiss floating HUD"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Restore Pill for Left Inputs Sidebar (When collapsed) */}
      {!isLeftSidebarOpen && !isZenMode && (
        <button
          type="button"
          onClick={() => {
            lightTap();
            toggleLeftSidebar();
          }}
          className="hidden lg:flex fixed top-14 left-4 z-40 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/90 hover:border-cyan-500/60 text-cyan-300 text-xs font-semibold shadow-2xl items-center gap-2 backdrop-blur-md active:scale-95 transition-all cursor-pointer group"
          title="Open Inputs & Controls Panel"
        >
          <Sliders className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-12 transition-transform" />
          <span>Inputs</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        </button>
      )}

      {/* Floating Restore Pill for Right Theory & Results Sidebar (When collapsed) */}
      {!isRightSidebarOpen && !isZenMode && (
        <button
          type="button"
          onClick={() => {
            lightTap();
            toggleRightSidebar();
          }}
          className="hidden lg:flex fixed top-14 right-4 z-40 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/90 hover:border-purple-500/60 text-purple-300 text-xs font-semibold shadow-2xl items-center gap-2 backdrop-blur-md active:scale-95 transition-all cursor-pointer group"
          title="Open Results & Theory Panel"
        >
          <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
          <BookOpen className="w-3.5 h-3.5 text-purple-400 group-hover:scale-110 transition-transform" />
          <span>Theory & Results</span>
        </button>
      )}

      {/* LEFT SIDEBAR: All Inputs, Sliders, Dials, Scrubbables, and Missions */}
      <aside
        className={`hidden lg:flex fixed top-11 sm:top-13 left-0 bottom-0 z-30 ${
          isLeftSidebarWide ? 'w-[440px] xl:w-[500px]' : 'w-80 xl:w-92'
        } flex-col bg-slate-900/95 border-r border-slate-800/90 backdrop-blur-xl shadow-2xl transition-[width,transform] duration-300 ease-in-out select-none ${
          isLeftSidebarOpen && !isZenMode ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Laboratory Inputs & Controls"
      >
        {/* Left Sidebar Header */}
        <div className="p-2.5 sm:p-3 border-b border-slate-800/90 flex items-center justify-between shrink-0 bg-slate-950/40">
          <div className="flex items-center gap-2 truncate">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <Sliders className="w-4 h-4" />
            </div>
            <div className="truncate">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block leading-tight">
                Smart Cockpit
              </span>
              <h2 className="text-xs font-bold text-white truncate leading-tight">
                {cleanTitle}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {/* 2-Column Wide Grid Toggle (Guaranteed 0-scroll on laptops) */}
            <button
              type="button"
              onClick={() => {
                lightTap();
                toggleLeftSidebarWide();
              }}
              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                isLeftSidebarWide 
                  ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-sm' 
                  : 'bg-slate-800/80 border-slate-700/60 text-slate-400 hover:text-white'
              }`}
              title={isLeftSidebarWide ? 'Switch to single-column inputs' : 'Expand to 2-column inputs (Guaranteed 0-scroll on laptops)'}
              aria-label="Toggle 2-column wide layout"
            >
              <Columns className="w-3.5 h-3.5" />
            </button>

            {/* Ultra-compact Density Toggle */}
            <button
              type="button"
              onClick={() => {
                lightTap();
                toggleCompactControlsMode();
              }}
              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                isCompactControlsMode 
                  ? 'bg-purple-500/20 border-purple-500/50 text-purple-300 shadow-sm' 
                  : 'bg-slate-800/80 border-slate-700/60 text-slate-400 hover:text-white'
              }`}
              title={isCompactControlsMode ? 'Switch to standard spacing' : 'Ultra-compact density mode (Zero scroll)'}
              aria-label="Toggle ultra-compact density"
            >
              <Layers className="w-3.5 h-3.5" />
            </button>

            {onReset && (
              <button
                type="button"
                onClick={() => {
                  lightTap();
                  playResonance();
                  onReset();
                }}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
                title="Reset simulator parameters"
                aria-label="Reset parameters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                lightTap();
                toggleLeftSidebar();
              }}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Collapse inputs sidebar"
              aria-label="Collapse inputs sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Left Sidebar Segmented Mode Switcher */}
        <div className="px-3 pt-2 pb-1 shrink-0 bg-slate-950/20">
          <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-950/90 border border-slate-800/80 text-xs">
            <button
              type="button"
              onClick={() => {
                selectionTick();
                playClick(1.0);
                setDesktopLeftTab('controls');
              }}
              className={`py-1.5 px-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                desktopLeftTab === 'controls'
                  ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Sliders</span>
            </button>

            <button
              type="button"
              onClick={() => {
                selectionTick();
                playClick(1.1);
                setDesktopLeftTab('mission');
              }}
              className={`py-1.5 px-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                desktopLeftTab === 'mission'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Missions</span>
            </button>
          </div>
        </div>

        {/* Left Sidebar Body: Smart zero-scroll auto-fitted container */}
        <div className={`flex-1 overflow-y-auto no-scrollbar p-2.5 sm:p-3 space-y-2 ${
          isCompactControlsMode ? 'text-xs [&_.TouchSlider]:py-0 [&_label]:mb-0.5' : ''
        } ${
          isLeftSidebarWide ? '[&_.cockpit-slider-grid]:grid [&_.cockpit-slider-grid]:grid-cols-2 [&_.cockpit-slider-grid]:gap-2' : ''
        }`}>
          {desktopLeftTab === 'controls' && (
            <div className="animate-fade-in space-y-2">
              {children}
            </div>
          )}

          {desktopLeftTab === 'mission' && (
            <div className="space-y-2.5 animate-fade-in">
              {challengeContent}
            </div>
          )}
        </div>

        {/* Left Sidebar Footer: Quick Proof & POE Predict Triggers */}
        <div className="p-2.5 border-t border-slate-800/90 shrink-0 bg-slate-950/60 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => {
              lightTap();
              openPOEModal();
            }}
            className="py-2 px-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/10 hover:from-amber-500/30 hover:to-amber-600/20 border border-amber-500/40 text-amber-300 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-sm truncate"
            title="Formulate a hypothesis before simulating"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">Predict (P-O-E)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              lightTap();
              openDerivationLadderModal();
            }}
            className="py-2 px-2 rounded-xl bg-purple-950/40 hover:bg-purple-900/50 border border-purple-500/40 text-purple-300 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-sm truncate"
            title="Interactive First-Principles Derivation"
          >
            <GitFork className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span className="truncate">Proof Ladder</span>
          </button>
        </div>
      </aside>

      {/* RIGHT SIDEBAR: Live Results, Theory, Formulas, Derivations, Doubts */}
      <aside
        className={`hidden lg:flex fixed top-11 sm:top-13 right-0 bottom-0 z-30 w-84 xl:w-[410px] flex-col bg-slate-900/95 border-l border-slate-800/90 backdrop-blur-xl shadow-2xl transition-transform duration-300 ease-in-out select-none ${
          isRightSidebarOpen && !isZenMode ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="Mathematical Theory & Real-Time Results"
      >
        {/* Right Sidebar Header */}
        <div className="p-2.5 sm:p-3 border-b border-slate-800/90 flex items-center justify-between shrink-0 bg-slate-950/40">
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => {
                lightTap();
                toggleRightSidebar();
              }}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Collapse theory sidebar"
              aria-label="Collapse theory sidebar"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Pin Floating HUD Button */}
            <button
              type="button"
              onClick={() => {
                lightTap();
                toggleCanvasHudPinned();
              }}
              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                isCanvasHudPinned 
                  ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-sm' 
                  : 'bg-slate-800/80 border-slate-700/60 text-slate-400 hover:text-white'
              }`}
              title={isCanvasHudPinned ? 'Hide Floating Canvas HUD' : 'Pin Live Math Readout onto Canvas HUD'}
              aria-label="Toggle canvas HUD overlay"
            >
              <Pin className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2 truncate text-right">
            <div className="truncate">
              <div className="flex items-center justify-end gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    lightTap();
                    setIsAuthorModalOpen(true);
                  }}
                  className="px-1.5 py-0.5 rounded-md bg-amber-950/50 hover:bg-amber-900/60 border border-amber-500/40 text-amber-300 text-[9px] font-semibold flex items-center gap-1 transition-all cursor-pointer"
                  title="Curated by Alka Sharma (Alka Ma'am) · 15+ Yrs Experience · itsmathtime.co.in"
                >
                  <Award className="w-2.5 h-2.5 text-amber-400" />
                  <span>Alka Ma'am</span>
                </button>
                <span className="text-[10px] text-purple-400 uppercase tracking-wider font-semibold">
                  Theory & Results
                </span>
              </div>
              <h3 className="text-xs font-bold text-white truncate leading-tight">
                Coach Intuition & Proofs
              </h3>
            </div>
            <div className="w-7 h-7 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Right Sidebar 0-Scroll Body */}
        <div className="flex-1 overflow-hidden p-2.5 flex flex-col justify-between">
          {theoryContent}
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* MOBILE COLLAPSIBLE BOTTOM SHEET (Visible on screens < 1024px)             */}
      {/* ========================================================================= */}
      <div
        ref={sheetRef}
        className={`lg:hidden fixed inset-x-0 bottom-0 z-30 bg-slate-900/95 backdrop-blur-xl border-t border-slate-700/80 rounded-t-2xl shadow-2xl flex flex-col transition-all duration-300 ease-out ${getMobileHeightClass()} safe-bottom select-none`}
      >
        {/* Drag Handle & Compact Bar Header */}
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={toggleSnap}
          className="pt-1 pb-1 px-3 flex flex-col items-center cursor-pointer select-none border-b border-slate-800/80 shrink-0"
        >
          {/* Centered Pill Drag Affordance */}
          <div className="w-8 h-1 bg-slate-600 rounded-full mb-1 active:bg-cyan-400 transition-colors" />

          <div className="w-full flex items-center justify-between">
            {/* Title / Tab indicators */}
            <div className="flex items-center gap-2 truncate">
              <span className="text-xs sm:text-sm font-bold text-white tracking-tight truncate">
                {title.split(':')[0]}
              </span>
              {badgeLabel ? (
                <span className="text-xs font-mono font-bold text-cyan-200 bg-cyan-950/95 px-2 py-0.5 rounded-md border border-cyan-500/70 shrink-0 shadow-sm">
                  <InlineMath math={badgeLabel} />
                </span>
              ) : quickEquation ? (
                <span className="text-xs font-mono text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded-md border border-cyan-700/60 shrink-0 truncate max-w-[150px]">
                  <InlineMath math={quickEquation} />
                </span>
              ) : null}
            </div>

            {/* Quick-action buttons directly visible in peek mode */}
            {bottomSheetSnap === 'peek' && (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    lightTap();
                    openPOEModal();
                  }}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold hover:bg-amber-500/30 transition-colors"
                  title="Predict & Prove"
                >
                  <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                  <span>Predict</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    openMobileTab('controls');
                  }}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-semibold hover:bg-cyan-500/30 transition-colors"
                >
                  <Sliders className="w-2.5 h-2.5 text-cyan-400" />
                  <span>Sliders</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    openMobileTab('mission');
                  }}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-semibold hover:bg-amber-500/30 transition-colors"
                >
                  <Trophy className="w-2.5 h-2.5 text-amber-400" />
                  <span>Missions</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    openMobileTab('theory');
                  }}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-semibold hover:bg-slate-750 transition-colors"
                >
                  <BookOpen className="w-2.5 h-2.5 text-slate-400" />
                  <span>Theory</span>
                </button>
              </div>
            )}

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  lightTap();
                  setIsAuthorModalOpen(true);
                }}
                className="p-1 rounded-md text-amber-400 hover:text-amber-300 active:bg-amber-950/40 transition-colors cursor-pointer"
                title="Curated by Alka Ma'am (M.Sc, B.Ed)"
                aria-label="Curated by Alka Ma'am"
              >
                <Award className="w-3.5 h-3.5" />
              </button>
              {onReset && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    lightTap();
                    playResonance();
                    onReset();
                  }}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-200 active:bg-slate-800 transition-colors cursor-pointer"
                  title="Reset parameters"
                  aria-label="Reset parameters"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSnap();
                }}
                className="p-1 rounded-md text-slate-400 hover:text-slate-200 active:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Toggle bottom sheet height"
              >
                {bottomSheetSnap === 'peek' ? (
                  <ChevronUp className="w-3.5 h-3.5 text-cyan-400" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Tab Selection Bar */}
        {bottomSheetSnap !== 'peek' && (
          <div className="px-3 py-1 border-b border-slate-800/80 flex items-center justify-between gap-1 shrink-0 bg-slate-950/40">
            <div className="flex items-center gap-1 p-0.5 bg-slate-900 rounded-lg border border-slate-800 w-full">
              <button
                type="button"
                onClick={() => openMobileTab('controls')}
                className={`flex-1 py-1 px-2 rounded-md text-[10px] sm:text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                  activeSheetTab === 'controls'
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sliders className="w-3 h-3" />
                <span>Sliders</span>
              </button>

              <button
                type="button"
                onClick={() => openMobileTab('theory')}
                className={`flex-1 py-1 px-2 rounded-md text-[10px] sm:text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                  activeSheetTab === 'theory'
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <BookOpen className="w-3 h-3" />
                <span>Theory</span>
              </button>

              <button
                type="button"
                onClick={() => openMobileTab('mission')}
                className={`flex-1 py-1 px-2 rounded-md text-[10px] sm:text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                  activeSheetTab === 'mission'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Trophy className="w-3 h-3" />
                <span>Missions</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  lightTap();
                  openDerivationLadderModal();
                }}
                className="py-1 px-2 rounded-md text-[10px] sm:text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer text-purple-400 hover:text-purple-300 hover:bg-purple-950/40 border border-purple-800/40"
                title="Interactive Step-by-Step Proof Ladder"
              >
                <GitFork className="w-3 h-3 text-purple-400" />
                <span className="hidden xs:inline">Proof</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setBottomSheetSnap('peek')}
              className="p-1 rounded-md text-slate-400 hover:text-slate-200 active:bg-slate-800 transition-colors shrink-0"
              title="Minimize to peek"
              aria-label="Minimize"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Mobile Scrollable Content Body */}
        {bottomSheetSnap !== 'peek' && (
          <div className="flex-1 overflow-y-auto px-3 py-1.5 space-y-1.5 no-scrollbar">
            {activeSheetTab === 'controls' && children}
            {activeSheetTab === 'theory' && theoryContent}
            {activeSheetTab === 'mission' && challengeContent}
          </div>
        )}
      </div>
    </>
  );
};
