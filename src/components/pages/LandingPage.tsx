/**
 * LandingPage: Modern, visually striking landing page for Math Time Lab.
 * Communicates: "Don't Memorize Math. Experience It."
 * Features:
 * 1. Hero Section: Catchy copy, CTA "Start Playing for Free", looping rollercoaster animation canvas
 * 2. Problem/Solution Section: "Textbooks show you the formula. We show you the universe." (3 benefit cards)
 * 3. Simulator Showcase: Swipeable horizontal carousel (mobile-first) showing initial simulators
 * 4. Social Proof: Real-world teacher quote & metrics
 * 5. Footer: Grade links (Class 9-12), "For Teachers" portal link
 */
import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  Play, 
  ArrowRight, 
  Sparkles, 
  Zap, 
  Flame, 
  TrendingUp, 
  Compass, 
  Target, 
  Orbit, 
  Activity, 
  Boxes, 
  GraduationCap, 
  CheckCircle2, 
  Layers, 
  ChevronRight, 
  ChevronLeft,
  Quote,
  Star,
  ShieldCheck,
  Smartphone,
  Cpu
} from 'lucide-react';
import { useSimulatorStore } from '../../store/useSimulatorStore';
import { useClassStore } from '../../store/useClassStore';
import { SIMULATORS } from '../../data/simulators';
import { GradeLevel, SimulatorId } from '../../types/simulators';
import { useHaptics } from '../../hooks/useHaptics';
import { useSound } from '../common/SoundManager';
import { AuthorSpotlightSection } from '../common/AuthorSpotlightSection';

export const LandingPage: React.FC = () => {
  const { navigateTo, setGradeFilter } = useSimulatorStore();
  const { activeTeacherCode } = useClassStore();
  const { lightTap } = useHaptics();
  const { playClick } = useSound();

  const carouselRef = useRef<HTMLDivElement>(null);
  const coasterCanvasRef = useRef<HTMLCanvasElement>(null);

  // Initial 4 core simulators for showcase carousel
  const initialSimulators = SIMULATORS.slice(0, 4);

  // Looping background interactive physics animation of the Rollercoaster Simulator
  useEffect(() => {
    const canvas = coasterCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number = 0;
    let t = 0;

    const render = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, w, h);

      // Deep dark space background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
      bgGrad.addColorStop(0, '#020617');
      bgGrad.addColorStop(1, '#090d16');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Subtle grid coordinate grid lines
      ctx.strokeStyle = 'rgba(51, 65, 85, 0.2)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Sine & Spline Rollercoaster Path: y = f(x)
      const points: { x: number; y: number }[] = [];
      const numSteps = 120;
      for (let i = 0; i <= numSteps; i++) {
        const x = (i / numSteps) * w;
        // Mathematical curve: combination of harmonics
        const normX = (x / w) * Math.PI * 3.5;
        const wave1 = Math.sin(normX - 0.4) * (h * 0.22);
        const wave2 = Math.cos(normX * 0.6) * (h * 0.12);
        const y = h * 0.52 + wave1 + wave2;
        points.push({ x, y });
      }

      // Integral Area fill below curve: ∫f(x)dx
      ctx.beginPath();
      ctx.moveTo(0, h);
      points.forEach((p, idx) => {
        if (idx === 0) ctx.lineTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.lineTo(w, h);
      ctx.closePath();

      const areaGrad = ctx.createLinearGradient(0, h * 0.3, 0, h);
      areaGrad.addColorStop(0, 'rgba(56, 189, 248, 0.25)');
      areaGrad.addColorStop(0.7, 'rgba(16, 185, 129, 0.1)');
      areaGrad.addColorStop(1, 'rgba(2, 6, 23, 0.8)');
      ctx.fillStyle = areaGrad;
      ctx.fill();

      // Support pillars
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.7)';
      ctx.lineWidth = 2;
      for (let i = 10; i < points.length; i += 12) {
        const pt = points[i];
        ctx.beginPath();
        ctx.moveTo(pt.x, pt.y);
        ctx.lineTo(pt.x, h);
        ctx.stroke();
      }

      // Rollercoaster glowing neon track
      ctx.beginPath();
      points.forEach((p, idx) => {
        if (idx === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3.5;
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 12;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Rollercoaster cart kinematic motion along curve
      t += 0.007;
      const cartPos = (t % 1);
      const cartIndex = Math.min(points.length - 2, Math.floor(cartPos * (points.length - 1)));
      const p1 = points[cartIndex];
      const p2 = points[cartIndex + 1] || p1;

      // Derivative slope angle θ = arctan(dy/dx)
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const angle = Math.atan2(dy, dx);
      const cartX = p1.x;
      const cartY = p1.y;

      // Tangent vector f'(x)
      ctx.save();
      ctx.translate(cartX, cartY);
      ctx.rotate(angle);

      // Tangent velocity ray
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.moveTo(-25, 0);
      ctx.lineTo(45, 0);
      ctx.stroke();
      ctx.setLineDash([]);

      // Cart chassis
      ctx.fillStyle = '#10b981';
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 10;
      ctx.fillRect(-12, -8, 24, 10);
      ctx.shadowBlur = 0;

      // Wheels
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.arc(-8, 3, 3, 0, Math.PI * 2);
      ctx.arc(8, 3, 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // Floating live math HUD annotation in canvas
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = 1;
      const hudW = 160;
      const hudH = 34;
      const hudX = Math.min(w - hudW - 16, Math.max(16, cartX - hudW / 2));
      const hudY = Math.max(16, cartY - 50);

      ctx.beginPath();
      ctx.roundRect(hudX, hudY, hudW, hudH, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.font = '10px monospace';
      ctx.fillText(`v = ${(18 + Math.sin(t * 4) * 6).toFixed(1)} m/s`, hudX + 10, hudY + 14);
      ctx.fillStyle = '#f59e0b';
      ctx.fillText(`f'(x) = ${(Math.tan(angle)).toFixed(2)} slope`, hudX + 10, hudY + 27);

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, []);

  const handleStartPlaying = () => {
    lightTap();
    playClick();
    navigateTo('home');
  };

  const handleScrollCarousel = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;
    const scrollAmount = 300;
    carouselRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <div className="w-full flex-1 flex flex-col bg-slate-950 text-slate-100 overflow-y-auto selection:bg-cyan-500 selection:text-slate-950">
      {/* 1. HERO SECTION */}
      <section className="relative w-full min-h-[85vh] sm:min-h-[88vh] flex flex-col justify-center items-center px-4 sm:px-6 py-12 sm:py-20 overflow-hidden border-b border-slate-900">
        {/* Background Looping Physics Simulation of Rollercoaster Architect */}
        <div className="absolute inset-0 pointer-events-none opacity-60">
          <canvas
            ref={coasterCanvasRef}
            className="w-full h-full object-cover"
          />
          {/* Radial mask vignette */}
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-slate-950/60 to-slate-950 pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          {/* Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-semibold backdrop-blur-md shadow-lg shadow-cyan-950/40"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Interactive Mathematics for Classes 9–12</span>
            <span className="hidden sm:inline">• 60fps Real-Time WebGL</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-[1.08] text-balance"
          >
            Don't Memorize Math.{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent">
              Experience It.
            </span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed text-balance"
          >
            Interactive physics and math simulators for Class 9–12. Play with Calculus, Trigonometry, and Geometry in real-time.
          </motion.p>

          {/* Large Mobile-Friendly CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto w-full"
          >
            <button
              type="button"
              onClick={handleStartPlaying}
              className="w-full sm:w-auto py-4 px-8 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 text-slate-950 font-black text-base flex items-center justify-center gap-2.5 shadow-2xl shadow-cyan-500/30 hover:brightness-110 active:scale-98 transition-all touch-manipulation cursor-pointer"
            >
              <span>Start Playing for Free</span>
              <ArrowRight className="w-5 h-5 stroke-[2.5]" />
            </button>

            <button
              type="button"
              onClick={() => {
                lightTap();
                navigateTo('rollercoaster-architect');
              }}
              className="w-full sm:w-auto py-4 px-6 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-bold text-sm flex items-center justify-center gap-2 backdrop-blur-sm transition-colors touch-manipulation cursor-pointer"
            >
              <Play className="w-4 h-4 text-cyan-400 fill-cyan-400" />
              <span>Launch Rollercoaster Demo</span>
            </button>
          </motion.div>

          {/* Quick Credibility Tags */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              No signup required
            </span>
            <span className="text-slate-700 hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-cyan-400" />
              Mobile Touch-First
            </span>
            <span className="text-slate-700 hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-purple-400" />
              Real Rigid-Body Physics
            </span>
          </div>
        </div>
      </section>

      {/* 2. THE PROBLEM / SOLUTION SECTION */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 space-y-12">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/60">
            A New Way of Learning
          </span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Textbooks show you the formula.{' '}
            <span className="text-cyan-400">We show you the universe.</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed text-balance">
            Static chalkboards and dry PDF questions leave students frustrated with abstract symbols. 
            Math Time Lab transforms every equation into an interactive tactile sandbox.
          </p>
        </div>

        {/* 3 Benefit Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {/* Benefit 1 */}
          <div className="relative rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 p-6 sm:p-7 space-y-4 shadow-xl hover:border-cyan-500/50 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
              <Smartphone className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-white tracking-tight group-hover:text-cyan-300 transition-colors">
                Touch &amp; Feel the Math
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Drag tangents with your thumbs to inspect instantaneous slope $dy/dx$, rotate 3D conics with multi-touch gestures, and feel haptic feedback when you hit the exact trajectory.
              </p>
            </div>
            <div className="pt-2 font-mono text-[11px] text-cyan-400 flex items-center gap-1">
              <span>Zero abstract mystery</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Benefit 2 */}
          <div className="relative rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 p-6 sm:p-7 space-y-4 shadow-xl hover:border-emerald-500/50 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <Cpu className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-white tracking-tight group-hover:text-emerald-300 transition-colors">
                Real Physics Engines
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Powered by Matter.js rigid-body dynamics and Three.js 3D WebGL. When you launch a projectile at 45°, gravity, elevation, and tension actually compute kinematics in real time.
              </p>
            </div>
            <div className="pt-2 font-mono text-[11px] text-emerald-400 flex items-center gap-1">
              <span>Authentic physical laws</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Benefit 3 */}
          <div className="relative rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 p-6 sm:p-7 space-y-4 shadow-xl hover:border-amber-500/50 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <Flame className="w-6 h-6 stroke-[2.2] fill-amber-400/20" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-white tracking-tight group-hover:text-amber-300 transition-colors">
                Zero Boring Theory
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Step straight into arcade missions: deliver urgent medical cargo with drone trigonometry, breach castle fortress walls, and earn XP badges like "Pythagoras Pro".
              </p>
            </div>
            <div className="pt-2 font-mono text-[11px] text-amber-400 flex items-center gap-1">
              <span>Gamified masteries</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. SIMULATOR SHOWCASE CAROUSEL (Mobile-First) */}
      <section className="w-full bg-slate-900/40 border-y border-slate-900 py-16 sm:py-20 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                Interactive Laboratories
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Explore the Four Core Simulators
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Swipe horizontally on mobile or tap cards to launch directly into the physics lab.
              </p>
            </div>

            {/* Desktop Navigation Arrows */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleScrollCarousel('left')}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
                aria-label="Previous Simulator"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => handleScrollCarousel('right')}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
                aria-label="Next Simulator"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Swipeable Horizontal Carousel */}
          <div
            ref={carouselRef}
            className="flex items-stretch gap-4 sm:gap-6 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scrollbar-none scroll-smooth touch-pan-x"
          >
            {initialSimulators.map((sim, index) => {
              const getIcon = () => {
                switch (sim.id) {
                  case 'drone-navigator':
                    return Compass;
                  case 'catapult-siege':
                    return Target;
                  case 'conic-sections':
                    return Orbit;
                  case 'unit-circle':
                    return Activity;
                  default:
                    return Sparkles;
                }
              };
              const IconComp = getIcon();

              return (
                <div
                  key={sim.id}
                  onClick={() => {
                    lightTap();
                    playClick();
                    navigateTo(sim.id);
                  }}
                  className="min-w-[280px] sm:min-w-[340px] max-w-[360px] snap-start rounded-3xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 p-5 sm:p-6 flex flex-col justify-between space-y-4 shadow-xl cursor-pointer group transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-950 text-cyan-400 border border-slate-800 text-[10px] font-mono font-bold">
                        {sim.grade}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {sim.category}
                      </span>
                    </div>

                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
                      <IconComp className="w-6 h-6 stroke-[2.2]" />
                    </div>

                    <h3 className="text-base sm:text-lg font-black text-white group-hover:text-cyan-300 transition-colors">
                      {sim.title}
                    </h3>

                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                      {sim.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <div className="font-mono text-[10px] text-amber-300 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/40">
                      Formula: {sim.formulaPreview.split('·')[0]}
                    </div>

                    <span className="text-xs font-bold text-cyan-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>Launch</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. SOCIAL PROOF / TEACHER QUOTE */}
      <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="relative rounded-3xl bg-gradient-to-br from-cyan-950/40 via-slate-900 to-slate-950 border border-cyan-500/30 p-6 sm:p-10 shadow-2xl overflow-hidden">
          <div className="absolute top-4 right-6 text-cyan-500/10 pointer-events-none">
            <Quote className="w-24 h-24" />
          </div>

          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
              <span className="text-xs font-mono font-bold text-amber-300 ml-2">Verified Educator</span>
            </div>

            <blockquote className="text-lg sm:text-2xl font-bold text-white leading-snug">
              &ldquo;My students finally understand derivatives because they built a rollercoaster.&rdquo;
            </blockquote>

            <div className="flex items-center gap-3 pt-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-sky-600 flex items-center justify-center text-slate-950 font-black text-sm">
                ER
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Dr. Evelyn Reed</h4>
                <p className="text-xs text-slate-400">AP Mathematics &amp; Physics Instructor, West Coast STEM Academy</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Educator: Alka Sharma (Alka Ma'am) */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full">
        <AuthorSpotlightSection />
      </div>

      {/* 5. FOOTER */}
      <footer className="w-full bg-slate-950 border-t border-slate-900 py-12 px-4 sm:px-6 text-slate-400 text-xs">
        <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Brand */}
          <div className="col-span-2 sm:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-cyan-500 flex items-center justify-center text-slate-950 font-black text-xs">
                MT
              </div>
              <span className="font-extrabold text-sm text-white tracking-tight">Math Time Lab</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Real-time interactive physics &amp; mathematics laboratory for High School classes 9–12.
            </p>
          </div>

          {/* Col 2: Curriculum Grades */}
          <div className="space-y-2">
            <h5 className="font-mono uppercase font-bold text-white text-[11px] tracking-wider">Curriculum Grades</h5>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setGradeFilter('class-9');
                    navigateTo('home');
                  }}
                  className="hover:text-cyan-300 transition-colors"
                >
                  Class 9: Coordinate Geometry
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setGradeFilter('class-10');
                    navigateTo('home');
                  }}
                  className="hover:text-cyan-300 transition-colors"
                >
                  Class 10: Trigonometry &amp; Waves
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setGradeFilter('class-11');
                    navigateTo('home');
                  }}
                  className="hover:text-cyan-300 transition-colors"
                >
                  Class 11: 3D Conic Sections
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setGradeFilter('class-12');
                    navigateTo('home');
                  }}
                  className="hover:text-cyan-300 transition-colors"
                >
                  Class 12: Calculus &amp; 3D Vectors
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Teachers */}
          <div className="space-y-2">
            <h5 className="font-mono uppercase font-bold text-white text-[11px] tracking-wider">Educators</h5>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo('teacher')}
                  className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 transition-colors"
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Teacher Portal &amp; Analytics</span>
                </button>
              </li>
              <li>
                <span className="text-slate-400">Class Code System (e.g. {activeTeacherCode})</span>
              </li>
              <li>
                <span className="text-slate-400">Struggling Concept Diagnosis</span>
              </li>
              <li>
                <span className="text-slate-400">Export Class Gradebook JSON</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform */}
          <div className="space-y-2">
            <h5 className="font-mono uppercase font-bold text-white text-[11px] tracking-wider">Features</h5>
            <ul className="space-y-1.5 text-[11px] text-slate-400">
              <li>60fps WebGL / Three.js</li>
              <li>Matter.js 2D Physics Engine</li>
              <li>Zustand Gamification &amp; XP</li>
              <li>Mathematical Singularity Guard</li>
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <span>&copy; {new Date().getFullYear()} Math Time Lab. All mathematics and physical models verified.</span>
          <span className="font-mono text-cyan-400">Live Interactive Science</span>
        </div>
        <p className="max-w-6xl mx-auto pt-3 text-[10px] text-slate-500 leading-normal border-t border-slate-900/60 mt-4">
          Disclaimer: Math Time Lab is an independent open educational laboratory. CBSE, ICSE, Cambridge Assessment International Education, NCERT, and other educational boards/institutions are trademarks or registered trademarks of their respective authorities. Reference to them is made solely to indicate curriculum syllabus alignment for educational reference purposes only and does not imply any affiliation, sponsorship, or endorsement.
        </p>
      </footer>
    </div>
  );
};
