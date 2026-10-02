/**
 * GlobalSearchModal.tsx: Instant Command Palette (⌘K / Ctrl+K) for Math Time Lab.
 * Redesigned with the clean, high-contrast, executive header scheme:
 * - Prominent close button (X)
 * - Crisp, clearly visible card borders
 * - Vivid typography and sharp grade tags
 * - Header-matching slide-down animation and gradient accent stripe
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  X, 
  ArrowRight, 
  Clock, 
  CornerDownLeft, 
  Layers,
  Compass,
  Sparkles
} from 'lucide-react';
import { useSimulatorStore } from '../../store/useSimulatorStore';
import { SIMULATORS } from '../../data/simulators';
import { SimulatorId } from '../../types/simulators';
import { useHaptics } from '../../hooks/useHaptics';
import { useSound } from './SoundManager';

export const GlobalSearchModal: React.FC = () => {
  const { isSearchModalOpen, setIsSearchModalOpen, navigateTo } = useSimulatorStore();
  const [query, setQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const { lightTap, selectionTick } = useHaptics();
  const { playChime } = useSound();

  // Listen for global Cmd+K / Ctrl+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(!isSearchModalOpen);
      } else if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        setIsSearchModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchModalOpen, setIsSearchModalOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isSearchModalOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [isSearchModalOpen]);

  // Filter simulators
  const filteredSimulators = SIMULATORS.filter((sim) => {
    const matchesGrade = selectedGrade === 'all' || sim.grade === selectedGrade;
    if (!matchesGrade) return false;

    if (!query.trim()) return true;

    const q = query.toLowerCase();
    return (
      sim.title.toLowerCase().includes(q) ||
      sim.shortTitle.toLowerCase().includes(q) ||
      sim.category.toLowerCase().includes(q) ||
      sim.description.toLowerCase().includes(q) ||
      sim.grade.toLowerCase().includes(q) ||
      sim.tags?.some((t) => t.toLowerCase().includes(q)) ||
      sim.keyConcepts?.some((c) => c.toLowerCase().includes(q)) ||
      sim.latexFormula?.toLowerCase().includes(q)
    );
  });

  // Handle keyboard navigation inside the list
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectionTick();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredSimulators.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectionTick();
      setSelectedIndex((prev) => (prev - 1 + filteredSimulators.length) % Math.max(1, filteredSimulators.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredSimulators[selectedIndex]) {
        handleSelectSimulator(filteredSimulators[selectedIndex].id);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsSearchModalOpen(false);
    }
  };

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.children[selectedIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  const handleSelectSimulator = (id: SimulatorId) => {
    lightTap();
    playChime();
    setIsSearchModalOpen(false);
    navigateTo(id);
  };

  if (!isSearchModalOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 sm:pt-16 bg-black/60 transition-opacity animate-in fade-in duration-150"
      onClick={() => setIsSearchModalOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Search simulators command palette"
    >
      <div 
        className="w-full max-w-2xl bg-white text-slate-900 border-2 border-slate-300 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in slide-in-from-top-4 duration-200 ease-out"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Signature Header Accent Stripe (matching header mega-menu scheme) */}
        <div className="h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 shrink-0" />

        {/* Search Input Bar with Clear and Dedicated Close Button */}
        <div className="relative flex items-center gap-2 px-4 py-3.5 border-b border-slate-200 bg-white">
          <Search className="w-5 h-5 text-emerald-600 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search 50 math labs, topics, or formulas (e.g. Pythagoras, Tangent, AP)..."
            className="w-full bg-transparent text-sm sm:text-base text-slate-900 placeholder-slate-400 font-medium focus:outline-none"
          />

          {/* Action buttons: Clear Search + Visible Close Button */}
          <div className="flex items-center gap-1.5 shrink-0">
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  inputRef.current?.focus();
                }}
                className="px-2 py-1 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 text-xs font-semibold cursor-pointer transition-colors"
                title="Clear input"
              >
                Clear
              </button>
            )}

            {/* Dedicated High-Contrast Close Button */}
            <button
              type="button"
              onClick={() => {
                lightTap();
                setIsSearchModalOpen(false);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-300 font-bold text-xs transition-all cursor-pointer shadow-xs active:scale-95"
              aria-label="Close search"
              title="Close search (Esc)"
            >
              <X className="w-4 h-4 text-slate-700" />
              <span className="hidden xs:inline">Close</span>
              <kbd className="hidden sm:inline-block ml-0.5 px-1.5 py-0.5 rounded bg-white border border-slate-300 text-[10px] font-mono text-slate-500">
                ESC
              </kbd>
            </button>
          </div>
        </div>

        {/* Grade Quick Filter Bar with High-Contrast Pills */}
        <div className="px-4 py-2.5 border-b border-slate-200 bg-slate-50/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
          <span className="text-[11px] uppercase font-extrabold text-slate-600 mr-1 flex items-center gap-1 shrink-0">
            <Layers className="w-3.5 h-3.5 text-emerald-600" />
            <span>Class:</span>
          </span>
          {[
            { id: 'all', label: 'All 50 Labs' },
            { id: 'Class 8', label: 'Class 8' },
            { id: 'Class 9', label: 'Class 9' },
            { id: 'Class 10', label: 'Class 10' },
            { id: 'Class 11', label: 'Class 11' },
            { id: 'Class 12', label: 'Class 12' },
          ].map((grade) => {
            const isSelected = selectedGrade === grade.id;
            return (
              <button
                key={grade.id}
                type="button"
                onClick={() => {
                  lightTap();
                  setSelectedGrade(grade.id);
                  setSelectedIndex(0);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-2 border-emerald-700 shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-300'
                }`}
              >
                {grade.label}
              </button>
            );
          })}
        </div>

        {/* Search Results List with Sharp Visible Borders */}
        <div 
          ref={listRef}
          className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 no-scrollbar max-h-[52vh] bg-slate-100/50"
        >
          {filteredSimulators.length === 0 ? (
            <div className="py-12 px-4 text-center space-y-2 bg-white rounded-2xl border-2 border-dashed border-slate-300 my-2">
              <Compass className="w-9 h-9 text-emerald-600 mx-auto animate-pulse" />
              <p className="text-base font-bold text-slate-900">No math laboratories match "{query}"</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Try searching by topic keyword like "quadratic", "conics", "tangent", "balance scale", or "pythagoras".
              </p>
            </div>
          ) : (
            filteredSimulators.map((sim, index) => {
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={sim.id}
                  onClick={() => handleSelectSimulator(sim.id)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 shadow-xs group ${
                    isSelected
                      ? 'bg-emerald-50/95 border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                      : 'bg-white hover:bg-emerald-50/50 border-slate-200 hover:border-emerald-400 hover:shadow-sm'
                  }`}
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded border shrink-0 ${
                        sim.gradeNumber === 8 ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                        sim.gradeNumber === 9 ? 'bg-cyan-100 text-cyan-800 border-cyan-300' :
                        sim.gradeNumber === 10 ? 'bg-amber-100 text-amber-800 border-amber-300' :
                        sim.gradeNumber === 11 ? 'bg-purple-100 text-purple-800 border-purple-300' :
                        'bg-blue-100 text-blue-800 border-blue-300'
                      }`}>
                        {sim.grade}
                      </span>
                      <span className="text-xs font-semibold text-slate-600">
                        {sim.category}
                      </span>
                      <span className="text-xs text-slate-300">·</span>
                      <span className="text-xs text-slate-500 flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{sim.estimatedMinutes}m</span>
                      </span>
                    </div>

                    <h4 className={`text-sm sm:text-base font-extrabold truncate transition-colors ${
                      isSelected ? 'text-emerald-950 font-black' : 'text-slate-900 group-hover:text-emerald-900'
                    }`}>
                      {sim.title}
                    </h4>

                    <p className="text-xs text-slate-600 line-clamp-1 leading-relaxed">
                      {sim.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isSelected && (
                      <span className="hidden sm:inline-flex items-center gap-1 text-xs font-mono text-emerald-700 font-bold bg-emerald-100/80 px-2 py-0.5 rounded border border-emerald-300">
                        <span>Press Enter</span>
                        <CornerDownLeft className="w-3.5 h-3.5" />
                      </span>
                    )}
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                      isSelected 
                        ? 'bg-emerald-600 text-white font-bold shadow-md scale-105' 
                        : 'bg-slate-100 text-slate-600 group-hover:bg-emerald-600 group-hover:text-white border border-slate-200'
                    }`}>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Navigation Hints with High-Contrast Badges */}
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 font-medium">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-300 text-slate-700 font-mono text-[10px] font-bold shadow-2xs">↑</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-300 text-slate-700 font-mono text-[10px] font-bold shadow-2xs">↓</kbd>
              <span>to navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-300 text-slate-700 font-mono text-[10px] font-bold shadow-2xs">↵</kbd>
              <span>to launch</span>
            </span>
          </div>
          <span className="font-mono text-emerald-800 font-bold text-xs bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
            {filteredSimulators.length} of {SIMULATORS.length} Labs Available
          </span>
        </div>
      </div>
    </div>
  );
};
