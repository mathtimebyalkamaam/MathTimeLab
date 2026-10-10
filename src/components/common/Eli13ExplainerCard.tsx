/**
 * Eli13ExplainerCard.tsx: "Explain Like I'm 13" (ELI-13 Mode) & Real-World Wonder Card.
 * Replaces academic textbook jargon with funny, unforgettable real-world metaphors,
 * relatable gaming / superhero analogies, and "Why Do I Care?" applications!
 */
import React from 'react';
import { 
  Sparkles, 
  Lightbulb, 
  HelpCircle, 
  Flame, 
  ShieldAlert, 
  Rocket, 
  BrainCircuit,
  Eye,
  CheckCircle2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { SimulatorId } from '../../types/simulators';
import { useSimulatorStore } from '../../store/useSimulatorStore';
import { useSound } from './SoundManager';
import { useHaptics } from '../../hooks/useHaptics';
import { MathText } from './MathFormula';

interface Eli13Story {
  analogyTitle: string;
  emoji: string;
  story: string;
  realWorldWonder: string;
  trapAlert: string;
  goldenRule: string;
}

const ELI13_STORIES: Record<string, Eli13Story> = {
  'balance-scale-equations': {
    analogyTitle: 'Mystery Loot Boxes & Golden Chocolate Bars',
    emoji: '🎁',
    story: 'Imagine you have 3 identical wrapped Christmas loot boxes (each holding $x$ diamonds) plus 4 gold chocolate coins on the left plate, balancing 19 chocolate coins on the right plate: $3x + 4 = 19$. You cannot open the boxes yet! What do you do? You eat 4 chocolate coins from BOTH plates: $3x = 15$. Split 15 coins into 3 piles: each box has $x = 5$ diamonds! That is all algebra is!',
    realWorldWonder: 'Rocket scientists at NASA and ISRO use this exact balance equation to adjust rocket payload weights so space probes don\'t flip over during launch.',
    trapAlert: 'The One-Sided Greed Trap! If you eat 4 chocolates from the left plate but forget the right plate, the scale violently flips over! Whatever you do to the Left, you MUST do to the Right!',
    goldenRule: 'The "=" sign is a sacred fulcrum. Do unto the right side what you do unto the left!',
  },
  'algebraic-identities-tiles': {
    analogyTitle: 'Minecraft Chunk Building & The Missing Garden Corner',
    emoji: '🧱',
    story: 'Suppose you have a square Minecraft fortress of size $a \\times a$. Now you expand your base by $b$ blocks on both sides. Your new fortress has side $(a + b)$. If you only build $a^2$ (old base) + $b^2$ (small corner watchtower), you leave two giant rectangular walls wide open for creepers to sneak in! Those two missing walls have area $2(ab)$. That is why $(a+b)^2 = a^2 + 2ab + b^2$!',
    realWorldWonder: 'NVIDIA engineers use this exact identity to partition GPU microchips into cores and memory cache blocks without wasting a single nanometer of silicon.',
    trapAlert: 'The "Lazy Math" Trap: Writing $(a+b)^2 = a^2 + b^2$! Textbooks call this the "Freshman\'s Dream", but in reality you just lost 2 whole rooms of your house!',
    goldenRule: '$(a+b)^2$ is a complete square quilt: 1 big square + 2 identical rectangles + 1 baby square!',
  },
  'compound-interest-engine': {
    analogyTitle: 'The Snowball Rolling Down the Himalayan Slopes',
    emoji: '⛄',
    story: 'Simple interest is like your grandma giving you ₹100 pocket money every birthday — it stays ₹100 forever. Compound interest $A = P\\left(1 + \\frac{r}{100}\\right)^n$ is like a baby snowball rolling down a snow mountain: as it rolls, the snow that sticks to it ALSO starts collecting more snow! In Year 1, you earn interest on your money. In Year 2, you earn interest on your money PLUS interest on last year\'s interest!',
    realWorldWonder: 'Warren Buffett started investing with just a few dollars as a teenager. Over 99% of his entire $100+ billion net worth was created AFTER his 50th birthday purely because of compounding!',
    trapAlert: 'The "Time Impatience" Trap: In Year 1 and 2, Simple Interest and Compound Interest look almost identical. Weak investors quit early. True fortunes explode in years 7, 8, and 9!',
    goldenRule: 'Time is the secret engine of compounding. Start early and let interest earn interest!',
  },
  'quadrilateral-morpher': {
    analogyTitle: 'The Wobbly Cardboard Box vs The Unbreakable Triangle Truss',
    emoji: '📦',
    story: 'Take 4 wooden sticks and nail them into a square. Push one corner gently with your finger: the square immediately collapses into a slanted rhombus! 4-sided shapes are wobbly. Now nail a single diagonal stick across opposite corners: BAM! It freezes rock-solid. That diagonal divides the wobbly quadrilateral into two rigid triangles!',
    realWorldWonder: 'Look at any steel railway bridge, crane, or the Eiffel Tower in Paris. You will never see open 4-sided squares; every single square has diagonal cross-beams!',
    trapAlert: 'Assuming all 4-sided shapes have right angles! A parallelogram has opposite angles equal, but only becomes a rectangle when adjacent sides meet at $90^\\circ$.',
    goldenRule: 'Triangles are nature\'s ultimate rigidity; quadrilaterals only become rigid when braced by diagonals!',
  },
  'euler-polyhedra-3d': {
    analogyTitle: 'The Soccer Ball Mystery & 3D Video Game Polygons',
    emoji: '⚽',
    story: 'Why does every classic football (soccer ball) have exactly 12 black pentagons and 20 white hexagons? Why can\'t you make a ball with just hexagons? Because Leonhard Euler proved in 1752 that any 3D closed solid must obey $F + V - E = 2$! If you only had flat hexagons, the shape would stay completely flat like bathroom floor tiles and could never curve into a 3D sphere!',
    realWorldWonder: 'Every 3D video game from Fortnite to GTA renders 3D character models by wrapping thousands of tiny polygonal faces around vertices using Euler\'s mesh mathematics.',
    trapAlert: 'Trying to apply Euler\'s formula to a basketball or cylinder! Euler\'s rule strictly requires flat polygonal faces and straight edges, not smooth curves.',
    goldenRule: 'Forever Victorious Eagles + 2 ($F + V = E + 2$)!',
  },
  'direct-inverse-proportions': {
    analogyTitle: 'The Road Trip Speedometer vs The Pizza Party Slices',
    emoji: '🍕',
    story: 'Direct proportion: You buy 1 comic book for ₹100, 2 comic books cost ₹200, 5 comic books cost ₹500 (both numbers go UP together). Inverse proportion: You order 1 giant pizza with 8 slices. If 1 person eats, they get 8 slices. If 2 people eat, each gets 4 slices. If 8 friends come over, each gets only 1 slice! As people go UP, pizza per person goes DOWN!',
    realWorldWonder: 'Formula 1 racing pit crews calculate tire change time vs lap advantage using inverse proportion: spending 2.1 seconds in the pit saves 15 seconds on fresh rubber.',
    trapAlert: 'The "Doubling Reflex" Trap: Thinking that if 4 workers take 6 hours, 8 workers will take 12 hours! More workers mean LESS time!',
    goldenRule: 'Direct means quotient is constant ($\\frac{y}{x} = k$). Inverse means product is constant ($x \\cdot y = k$)!',
  },
  'dynamic-pie-chart': {
    analogyTitle: 'The 360° Birthday Cake Slicing Protocol',
    emoji: '🎂',
    story: 'A circle is like a round birthday cake with exactly $360^\\circ$ of frosting around its rim. If you spend $50\\%$ of your pocket money on gaming, your gaming slice must take half of the entire cake: $50\\% \\text{ of } 360^\\circ = 180^\\circ$ (a straight diameter line!). If your friend spent $25\\%$, their angle is $25\\% \\text{ of } 360^\\circ = 90^\\circ$ (a neat right angle!).',
    realWorldWonder: 'Your smartphone\'s battery settings page uses pie charts to show whether YouTube, Instagram, or games drained your battery today.',
    trapAlert: 'The "100 Degree" Blunder: Forgetting to multiply by $360^\\circ$! A sector of $30\\%$ is NOT 30 degrees; it is $\\left(\\frac{30}{100}\\right) \\times 360^\\circ = 108^\\circ$!',
    goldenRule: 'Central Angle $\\theta = \\left(\\frac{\\text{Value}}{\\text{Total}}\\right) \\times 360^\\circ$!',
  },
  'square-roots-triplets': {
    analogyTitle: 'The Egyptian Rope Stretcher Secret (3-4-5)',
    emoji: '📐',
    story: '4,000 years ago, Egyptian builders had no metal rulers or protractors. How did they build the Great Pyramids with perfectly square $90^\\circ$ corners? They took a long rope, tied 12 equally-spaced knots, and pulled it into a triangle with sides of 3 knots, 4 knots, and 5 knots. Because $3^2 + 4^2 = 9 + 16 = 25 = 5^2$, the corner opposite the 5-side is GUARANTEED to be a flawless $90^\\circ$ right angle!',
    realWorldWonder: 'Carpenters and construction masons still use this exact 3-4-5 rule today when laying house foundations!',
    trapAlert: 'Thinking any 3 numbers can make a right triangle! Only special triplets where $a^2 + b^2 = c^2$ work. Use $(2m, m^2-1, m^2+1)$ to forge endless triplets.',
    goldenRule: 'Pythagorean Triplet formula: $(2m, m^2-1, m^2+1)$ always satisfies $a^2 + b^2 = c^2$!',
  },
};

interface Eli13ExplainerCardProps {
  simulatorId: SimulatorId;
  defaultExpanded?: boolean;
}

export const Eli13ExplainerCard: React.FC<Eli13ExplainerCardProps> = ({
  simulatorId,
  defaultExpanded = false,
}) => {
  const story = ELI13_STORIES[simulatorId];
  const { isEli13Mode, toggleEli13Mode } = useSimulatorStore();
  const { playClick, playChime } = useSound();
  const { lightTap } = useHaptics();
  const [isExpanded, setIsExpanded] = React.useState<boolean>(defaultExpanded);

  if (!story) return null;

  // Compact Collapsed Pill Mode (Zero Scroll on Laptops & Desktops)
  if (!isExpanded) {
    return (
      <div className="rounded-xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/30 p-2 sm:p-2.5 shadow-sm transition-all">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 truncate">
            <span className="text-base sm:text-lg shrink-0">{story.emoji}</span>
            <div className="truncate">
              <span className="text-[9px] sm:text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider block leading-tight">
                ELI-13 Wonder Analogy
              </span>
              <span className="text-xs font-bold text-slate-200 truncate block leading-tight">
                {story.analogyTitle}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              lightTap();
              setIsExpanded(true);
            }}
            className="px-2 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-[10px] sm:text-[11px] font-semibold flex items-center gap-1 shrink-0 transition-all cursor-pointer shadow-sm"
            title="Expand to read intuitive real-world story"
          >
            <Lightbulb className="w-3 h-3 text-amber-400" />
            <span>Story</span>
            <ChevronDown className="w-3 h-3 text-amber-400" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-gradient-to-br from-amber-950/30 via-slate-900 to-slate-900 border border-amber-500/40 p-3 sm:p-4 shadow-lg space-y-2.5 sm:space-y-3 animate-fade-in">
      {/* Header bar with collapse and mode toggles */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 truncate">
          <span className="text-xl shrink-0">{story.emoji}</span>
          <div className="truncate">
            <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider">
              <span>ELI-13 Metaphor</span>
            </div>
            <h3 className="text-xs sm:text-sm font-extrabold text-white truncate">
              {story.analogyTitle}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => {
              lightTap();
              playClick();
              toggleEli13Mode();
            }}
            className={`px-2 py-1 rounded-full text-[10px] font-semibold border transition-all cursor-pointer ${
              isEli13Mode 
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
            }`}
            title="Toggle between Academic Board Mode and ELI-13 Student Mode"
          >
            {isEli13Mode ? '🎓 Academic' : '🕶️ ELI-13'}
          </button>

          <button
            type="button"
            onClick={() => {
              lightTap();
              setIsExpanded(false);
            }}
            className="p-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition cursor-pointer"
            title="Collapse story"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Relatable Story Analogy */}
      <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
        <MathText text={story.story} />
      </div>

      {/* Grid of Wonder & Trap Alert */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
        {/* Real World Wonder */}
        <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-800/30 space-y-1.5">
          <span className="font-bold text-cyan-300 flex items-center gap-1.5 text-xs uppercase tracking-wider">
            <Rocket className="w-4 h-4 text-cyan-400" />
            <span>Why Do I Care in Real Life?</span>
          </span>
          <div className="text-slate-300 leading-relaxed">
            <MathText text={story.realWorldWonder} />
          </div>
        </div>

        {/* Trap Alert */}
        <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-800/30 space-y-1.5">
          <span className="font-bold text-rose-400 flex items-center gap-1.5 text-xs uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>Trap Alert (Common Mistake)</span>
          </span>
          <div className="text-slate-300 leading-relaxed">
            <MathText text={story.trapAlert} />
          </div>
        </div>
      </div>

      {/* Golden Rule Footer */}
      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs sm:text-sm text-amber-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <div>
            <strong className="text-amber-300">Golden Rule: </strong>
            <MathText text={story.goldenRule} />
          </div>
        </div>
      </div>
    </div>
  );
};
