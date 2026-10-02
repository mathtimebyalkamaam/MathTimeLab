/**
 * SecretShortcutsModal.tsx: Class 8 Topper's Secret Cheat-Sheet & Mental Math Shortcuts.
 * High-yield mental shortcuts, visual mnemonics, and instant calculation tricks
 * that CBSE & ICSE Class 8 toppers use to ace exams in half the time!
 */
import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Zap, 
  Lightbulb, 
  Check, 
  Copy, 
  Calculator, 
  ArrowRight,
  BookOpen,
  BrainCircuit,
  Award
} from 'lucide-react';
import { useSimulatorStore } from '../../store/useSimulatorStore';
import { useSound } from '../common/SoundManager';
import { useHaptics } from '../../hooks/useHaptics';
import { BlockMath, InlineMath, MathText } from '../common/MathFormula';
import confetti from 'canvas-confetti';

interface ShortcutItem {
  id: string;
  title: string;
  topic: string;
  formulaLatex: string;
  mnemonic: string;
  explanation: string;
  exampleProblem: string;
  stepByStep: string[];
  finalResult: string;
  interactiveCalc?: {
    label: string;
    defaultValue: number;
    calc: (val: number) => { display: string; explanation: string };
  };
}

const SHORTCUTS: ShortcutItem[] = [
  {
    id: 'square-ending-5',
    title: 'The 3-Second Square Trick for Numbers Ending in 5',
    topic: 'Squares & Square Roots',
    formulaLatex: '(10a + 5)^2 = [a(a + 1)] \\times 100 + 25',
    mnemonic: 'Multiply the tens digit by its next best friend, then glue "25" at the end!',
    explanation: 'Whenever a number ends in 5, multiply the digit(s) before 5 by (digit + 1). Append 25 right after it. Instant mental calculation!',
    exampleProblem: 'Calculate 35² mentally without pen and paper:',
    stepByStep: [
      'Take the tens digit: a = 3.',
      'Multiply by its next number: 3 × (3 + 1) = 3 × 4 = 12.',
      'Simply glue 25 to the end: 12 glued with 25 = 1225.',
    ],
    finalResult: '35² = 1,225 (Done in 2 seconds!)',
    interactiveCalc: {
      label: 'Enter any number ending in 5 (e.g. 15, 25, 45, 65, 85, 95):',
      defaultValue: 65,
      calc: (val) => {
        const tens = Math.floor(val / 10);
        const prod = tens * (tens + 1);
        return {
          display: `${val}² = ${prod}25`,
          explanation: `Tens digit = ${tens} → ${tens} × (${tens}+1) = ${prod}, append 25 → ${prod}25`,
        };
      },
    },
  },
  {
    id: 'pythagorean-triplet-forge',
    title: 'The Pythagorean Triplet Machine: (2m, m² - 1, m² + 1)',
    topic: 'Squares & Triangles',
    formulaLatex: '(2m)^2 + (m^2 - 1)^2 = (m^2 + 1)^2 \\quad (\\text{for } m > 1)',
    mnemonic: 'Double m, square minus 1, square plus 1 — right triangle always won!',
    explanation: 'Any integer m > 1 automatically spawns a valid right-angled triangle with sides (2m, m² - 1, m² + 1). Guaranteed in CBSE 3-mark questions!',
    exampleProblem: 'Find a Pythagorean triplet whose smallest member is 6:',
    stepByStep: [
      'Set 2m = 6 → m = 3.',
      'Second side: m² - 1 = 3² - 1 = 9 - 1 = 8.',
      'Hypotenuse: m² + 1 = 3² + 1 = 9 + 1 = 10.',
      'Check: 6² + 8² = 36 + 64 = 100 = 10² ✓',
    ],
    finalResult: 'Triplet: (6, 8, 10)',
    interactiveCalc: {
      label: 'Set seed integer m (m ≥ 2):',
      defaultValue: 4,
      calc: (m) => {
        const a = 2 * m;
        const b = m * m - 1;
        const c = m * m + 1;
        return {
          display: `Triplet for m = ${m}: (${a}, ${b}, ${c})`,
          explanation: `${a}² + ${b}² = ${a * a} + ${b * b} = ${a * a + b * b} = ${c}² (${c * c})`,
        };
      },
    },
  },
  {
    id: 'euler-polyhedra-rule',
    title: 'Euler\'s Formula Mnemonic: Forever Victorious Eagles + 2',
    topic: 'Visualising 3D Solids',
    formulaLatex: 'F + V = E + 2 \\iff F + V - E = 2',
    mnemonic: '"Forever Victorious Eagles + 2" (Faces + Vertices = Edges + 2)',
    explanation: 'For any convex polyhedron with flat polygonal faces, add the number of Faces and Vertices, and it is ALWAYS exactly 2 more than the number of Edges!',
    exampleProblem: 'A polyhedron has 12 faces and 20 vertices. How many edges does it have?',
    stepByStep: [
      'State Euler\'s formula: F + V = E + 2.',
      'Substitute known values: 12 + 20 = E + 2.',
      '32 = E + 2 → E = 32 - 2 = 30.',
    ],
    finalResult: 'E = 30 edges (This is a Dodecahedron!)',
  },
  {
    id: 'rule-of-72',
    title: 'The Rule of 72: Doubling Time for Compound Interest',
    topic: 'Comparing Quantities',
    formulaLatex: 'T_{\\text{double}} \\approx \\frac{72}{r}',
    mnemonic: 'Divide 72 by the annual interest rate to find years to double your cash!',
    explanation: 'Class 8 compound interest formula A = P(1 + r/100)ⁿ can take several minutes to compute by hand. The secret Rule of 72 gives the doubling period in 1 second!',
    exampleProblem: 'How many years does it take for ₹10,000 to double to ₹20,000 at 8% p.a. compounded annually?',
    stepByStep: [
      'Apply Rule of 72: Years = 72 / rate.',
      'Substitute r = 8%: Years ≈ 72 / 8 = 9 years.',
      'Exact compound calculation: 1.08⁹ = 1.999 ≈ 2.0x (Matches perfectly!).',
    ],
    finalResult: '≈ 9 years to double your money!',
  },
  {
    id: 'polygon-interior-angles',
    title: 'The Triangle Subdivision Secret for Any n-gon',
    topic: 'Understanding Quadrilaterals',
    formulaLatex: 'S_n = (n - 2) \\times 180^\\circ',
    mnemonic: 'Count sides n, subtract 2, multiply by 180° — because exactly (n - 2) triangles hide inside!',
    explanation: 'From any single vertex of an n-sided polygon, you can draw diagonals dividing it into exactly (n - 2) triangles. Since each triangle sums to 180°, the total angle sum is (n - 2) × 180°!',
    exampleProblem: 'Find the sum of interior angles of an Octagon (8 sides):',
    stepByStep: [
      'Number of sides: n = 8.',
      'Triangles inside: n - 2 = 8 - 2 = 6 triangles.',
      'Total angle sum: 6 × 180° = 1080°.',
    ],
    finalResult: 'Angle sum = 1,080°',
  },
  {
    id: 'direct-inverse-constant-test',
    title: 'The 1-Second Direct vs Inverse Finger Test',
    topic: 'Direct & Inverse Proportions',
    formulaLatex: '\\text{Direct: } \\frac{y}{x} = k \\quad \\text{vs} \\quad \\text{Inverse: } x \\cdot y = k',
    mnemonic: 'Direct divides to a constant; Inverse multiplies to a constant!',
    explanation: 'Confused if a word problem is direct or inverse? Just ask: "If x doubles, does y double (Direct), or does y get cut in half (Inverse)?"',
    exampleProblem: 'If 12 workers build a wall in 8 days, how many days will 6 workers take?',
    stepByStep: [
      'Test relationship: Fewer workers mean MORE days needed → Inverse Proportion!',
      'In inverse proportion, Product is constant: x₁ · y₁ = x₂ · y₂.',
      '12 × 8 = 6 × y₂ → 96 = 6 × y₂ → y₂ = 96 / 6 = 16 days.',
    ],
    finalResult: '16 days (Halving workers doubles the time!)',
  },
];

export const SecretShortcutsModal: React.FC = () => {
  const { isSecretShortcutsOpen, setSecretShortcutsOpen, addXp } = useSimulatorStore();
  const { playClick, playChime } = useSound();
  const { lightTap, successBuzz } = useHaptics();

  const [activeShortcutId, setActiveShortcutId] = useState<string>(SHORTCUTS[0].id);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [calcInput, setCalcInput] = useState<number>(65);

  if (!isSecretShortcutsOpen) return null;

  const currentShortcut = SHORTCUTS.find((s) => s.id === activeShortcutId) || SHORTCUTS[0];

  const handleCopy = (text: string, id: string) => {
    lightTap();
    playClick();
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCelebrate = () => {
    successBuzz();
    playChime();
    addXp(15);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 overflow-y-auto">
      <div 
        className="w-full max-w-4xl bg-slate-900 border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-900 border-b border-amber-500/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 shadow-md">
              <Zap className="w-5 h-5 fill-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/60">
                  Topper's Secret Vault
                </span>
                <span className="text-xs text-slate-400">Class 8 Quick Hacks</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white mt-0.5">
                Mental Math Shortcuts &amp; Memory Mnemonics
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              lightTap();
              setSecretShortcutsOpen(false);
            }}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body: Two column desktop, tabbed mobile */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-800">
          {/* Left Column: Shortcut Picker List */}
          <div className="md:col-span-4 p-3 sm:p-4 space-y-2 bg-slate-950/60 overflow-y-auto">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
              Select A Topper Hack
            </div>
            <div className="space-y-1.5">
              {SHORTCUTS.map((item, idx) => {
                const isActive = item.id === activeShortcutId;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      lightTap();
                      playClick();
                      setActiveShortcutId(item.id);
                      if (item.interactiveCalc) {
                        setCalcInput(item.interactiveCalc.defaultValue);
                      }
                    }}
                    className={`w-full text-left p-3 rounded-2xl transition-all border cursor-pointer ${
                      isActive
                        ? 'bg-amber-500/15 border-amber-500/50 text-white shadow-md'
                        : 'bg-slate-900/60 hover:bg-slate-900 border-slate-800/80 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-mono text-amber-400 font-bold">Hack #{idx + 1}</span>
                      <span className="text-[10px] text-slate-400">{item.topic}</span>
                    </div>
                    <div className="text-xs font-semibold text-white mt-1 line-clamp-1">
                      {item.title}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Detailed Breakdown of Selected Shortcut */}
          <div className="md:col-span-8 p-4 sm:p-6 space-y-5 overflow-y-auto">
            {/* Title & Badge */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-cyan-400">
                  {currentShortcut.topic}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(currentShortcut.formulaLatex, currentShortcut.id)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedId === currentShortcut.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy LaTeX</span>
                    </>
                  )}
                </button>
              </div>

              <h3 className="text-lg sm:text-xl font-extrabold text-white">
                {currentShortcut.title}
              </h3>
            </div>

            {/* Formula Block */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center shadow-inner">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono block mb-1">
                Mathematical Rule
              </span>
              <BlockMath math={currentShortcut.formulaLatex} className="my-1 text-amber-300 text-sm sm:text-base font-bold" />
            </div>

            {/* Mnemonic Callout */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-amber-600/10 to-transparent border border-amber-500/30 flex items-start gap-3">
              <BrainCircuit className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block">
                  Memory Mnemonic
                </span>
                <p className="text-xs sm:text-sm text-slate-200 font-medium italic mt-0.5">
                  "{currentShortcut.mnemonic}"
                </p>
              </div>
            </div>

            {/* Core Explanation */}
            <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-1">
              <span className="font-bold text-white block">Why it works:</span>
              <div>
                <MathText text={currentShortcut.explanation} />
              </div>
            </div>

            {/* Worked Example */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <BookOpen className="w-4 h-4" />
                <span>Board Exam Classic Example</span>
              </div>

              <div className="text-xs sm:text-sm font-semibold text-slate-200">
                <MathText text={currentShortcut.exampleProblem} />
              </div>

              <div className="space-y-1.5 pl-2 border-l-2 border-emerald-500/40">
                {currentShortcut.stepByStep.map((step, sIdx) => (
                  <div key={sIdx} className="text-xs sm:text-sm text-slate-300 flex items-start gap-2">
                    <span className="font-mono text-emerald-400 shrink-0">{sIdx + 1}.</span>
                    <div>
                      <MathText text={step} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-xs sm:text-sm font-bold text-emerald-300 flex items-center justify-between">
                <span>Result:</span>
                <div>
                  <MathText text={currentShortcut.finalResult} />
                </div>
              </div>
            </div>

            {/* Optional Interactive Mini Calculator */}
            {currentShortcut.interactiveCalc && (
              <div className="p-4 rounded-2xl bg-slate-900 border border-amber-500/30 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                  <Calculator className="w-4 h-4" />
                  <span>Try It Yourself (Live Generator)</span>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-300 block">
                    {currentShortcut.interactiveCalc.label}
                  </label>
                  <input
                    type="range"
                    min={currentShortcut.id === 'pythagorean-triplet-forge' ? 2 : 15}
                    max={currentShortcut.id === 'pythagorean-triplet-forge' ? 12 : 95}
                    step={currentShortcut.id === 'pythagorean-triplet-forge' ? 1 : 10}
                    value={calcInput}
                    onChange={(e) => {
                      lightTap();
                      setCalcInput(Number(e.target.value));
                    }}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                    <span>Input: {calcInput}</span>
                  </div>
                </div>

                {(() => {
                  const res = currentShortcut.interactiveCalc.calc(calcInput);
                  return (
                    <div className="p-3 rounded-xl bg-slate-950 border border-amber-500/20 text-xs">
                      <div className="text-sm font-bold text-amber-400 font-mono">
                        {res.display}
                      </div>
                      <div className="text-slate-400 text-[11px] mt-1 font-mono">
                        {res.explanation}
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Mastered this hack? Claim XP below!</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCelebrate}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-transform cursor-pointer"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Claim +15 XP</span>
            </button>

            <button
              type="button"
              onClick={() => setSecretShortcutsOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
