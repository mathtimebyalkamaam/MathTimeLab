/**
 * SurfaceAreaVolumesSimulator.tsx: Interactive 3D Solid Unfolder & Archimedes Liquid Pourer (Class 9 Mensuration).
 * Features:
 * - 3D Isometric/Perspective rendering of Cylinder, Cone, Sphere, and Cuboid
 * - Real-time Unfold Net slider (0% to 100%): watch a 3D cylinder unroll into an ordinary 2D rectangle (2πr × h) plus 2 base circles!
 * - Archimedes Liquid Pour experiment: pour water from a cone into a cylinder of equal radius & height, showing it fills EXACTLY 1/3!
 * - Slanted height live visualizer for cone: l = √(r² + h²)
 * - Interactive sliders for radius r, height h, and cuboid dimensions
 * - 3 Progressive board exam challenges with instant verification
 */
import React, { useEffect, useRef, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { 
  Box, 
  RotateCcw, 
  CheckCircle2, 
  Layers, 
  Sliders, 
  Droplets, 
  Eye, 
  Sparkles,
  Maximize2
} from 'lucide-react';
import { useSimulatorStore } from '../../store/useSimulatorStore';
import { BottomSheet } from '../layout/BottomSheet';
import { TouchSlider } from '../common/TouchSlider';
import { CoachTheoryModule } from '../common/CoachTheoryModule';
import { ChallengeManager, ChallengeLevel } from '../common/ChallengeManager';
import { useHaptics } from '../../hooks/useHaptics';
import { useSound } from '../common/SoundManager';
import { useAnalytics } from '../../hooks/useAnalytics';
import { ConceptInsightBanner } from '../common/ConceptInsightBanner';

export const SurfaceAreaVolumesSimulator: React.FC = () => {
  const {
    surfaceAreaParams,
    updateSurfaceAreaParams,
    resetParams,
    completeChallenge,
    challengeCompleted,
    isZenMode,
  } = useSimulatorStore();

  const {
    solidType,
    radius,
    height,
    length,
    width,
    unfoldPercent,
    liquidPourProgress,
    isPouring,
    showDimensions,
    showFormulaDerivation,
  } = surfaceAreaParams;

  const { lightTap, successBuzz } = useHaptics();
  const { playClick, playChime } = useSound();
  const { trackEvent } = useAnalytics();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotationAngle, setRotationAngle] = useState(0.4);
  const isDraggingRef = useRef(false);
  const lastMouseXRef = useRef(0);

  // Derived mathematical values
  const slantHeight = Math.hypot(radius, height);
  const cylinderBaseArea = Math.PI * radius * radius;
  const cylinderCSA = 2 * Math.PI * radius * height;
  const cylinderTSA = 2 * Math.PI * radius * (radius + height);
  const cylinderVolume = Math.PI * radius * radius * height;

  const coneCSA = Math.PI * radius * slantHeight;
  const coneTSA = Math.PI * radius * (radius + slantHeight);
  const coneVolume = (1 / 3) * Math.PI * radius * radius * height;

  const sphereSurfaceArea = 4 * Math.PI * radius * radius;
  const sphereVolume = (4 / 3) * Math.PI * radius * radius * radius;

  const cuboidTSA = 2 * (length * width + width * height + height * length);
  const cuboidVolume = length * width * height;

  // Liquid pour animation loop
  useEffect(() => {
    let animId: number;
    if (isPouring) {
      animId = requestAnimationFrame(() => {
        if (liquidPourProgress < 100) {
          updateSurfaceAreaParams({ liquidPourProgress: Math.min(100, liquidPourProgress + 1.2) });
        } else {
          updateSurfaceAreaParams({ isPouring: false });
          playChime();
          lightTap();
        }
      });
    }
    return () => cancelAnimationFrame(animId);
  }, [isPouring, liquidPourProgress, updateSurfaceAreaParams, playChime, lightTap]);

  // Board Exam Challenge Evaluation
  useEffect(() => {
    // Challenge 1: Cylinder Net Unfold Master (Unfold cylinder to 100%)
    if (solidType === 'cylinder' && unfoldPercent >= 95 && !challengeCompleted['sa_cylinder_net']) {
      completeChallenge('sa_cylinder_net', 40);
      successBuzz();
      playChime();
      confetti({ particleCount: 35, spread: 60 });
      trackEvent('challenge_completed', { challengeId: 'sa_cylinder_net' });
    }

    // Challenge 2: Archimedes 1/3 Pour Discovery
    if (liquidPourProgress >= 99 && !challengeCompleted['sa_archimedes_pour']) {
      completeChallenge('sa_archimedes_pour', 45);
      successBuzz();
      playChime();
      confetti({ particleCount: 50, spread: 70 });
      trackEvent('challenge_completed', { challengeId: 'sa_archimedes_pour' });
    }

    // Challenge 3: Pythagorean Slant Height 5-12-13
    if (
      solidType === 'cone' &&
      Math.abs(radius - 5) < 0.2 &&
      Math.abs(height - 12) < 0.2 &&
      !challengeCompleted['sa_cone_triplet']
    ) {
      completeChallenge('sa_cone_triplet', 50);
      successBuzz();
      playChime();
      confetti({ particleCount: 40, spread: 60 });
      trackEvent('challenge_completed', { challengeId: 'sa_cone_triplet' });
    }
  }, [
    solidType,
    unfoldPercent,
    liquidPourProgress,
    radius,
    height,
    challengeCompleted,
    completeChallenge,
    successBuzz,
    playChime,
    trackEvent,
  ]);

  // Canvas 2D/3D Renderer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;

    const render = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.clientWidth;
      const heightPx = canvas.clientHeight;

      if (canvas.width !== width * dpr || canvas.height !== heightPx * dpr) {
        canvas.width = width * dpr;
        canvas.height = heightPx * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, heightPx);

      // Deep space grid backdrop
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, width, heightPx);

      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      const gridSize = 24;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, heightPx);
        ctx.stroke();
      }
      for (let y = 0; y < heightPx; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      const centerX = width / 2;
      const centerY = heightPx / 2 - 10;
      const scale = Math.min(width, heightPx) / 22;

      // Draw based on solid type and unfold percent
      const unfold = unfoldPercent / 100;

      if (solidType === 'cylinder') {
        if (unfold > 0.05) {
          // Unfolding Net View
          const rectWidth = (2 * Math.PI * radius) * scale * unfold;
          const rectHeight = height * scale;
          const rPx = radius * scale;

          // Main unrolled rectangle (cyan glow)
          const rx = centerX - rectWidth / 2;
          const ry = centerY - rectHeight / 2;

          ctx.fillStyle = 'rgba(14, 165, 233, 0.2)';
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.rect(rx, ry, rectWidth, rectHeight);
          ctx.fill();
          ctx.stroke();

          // Top base circle flap
          const topCircleY = ry - rPx - (1 - unfold) * 10;
          ctx.fillStyle = 'rgba(56, 189, 248, 0.3)';
          ctx.beginPath();
          ctx.arc(centerX, topCircleY, rPx, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Bottom base circle flap
          const botCircleY = ry + rectHeight + rPx + (1 - unfold) * 10;
          ctx.fillStyle = 'rgba(56, 189, 248, 0.3)';
          ctx.beginPath();
          ctx.arc(centerX, botCircleY, rPx, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Net Labels
          ctx.fillStyle = '#f8fafc';
          ctx.font = 'bold 12px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(`Curved Surface Rectangle: 2πr × h = ${(2 * Math.PI * radius).toFixed(1)} × ${height}`, centerX, ry + rectHeight / 2);
          ctx.fillStyle = '#38bdf8';
          ctx.fillText(`Base: πr² = ${(Math.PI * radius * radius).toFixed(1)}`, centerX, topCircleY);
          ctx.fillText(`Base: πr² = ${(Math.PI * radius * radius).toFixed(1)}`, centerX, botCircleY);
        } else {
          // 3D Cylinder View
          const rPx = radius * scale * 1.8;
          const hPx = height * scale * 1.8;
          const rx = rPx;
          const ry = rPx * 0.35; // perspective flattening

          const topY = centerY - hPx / 2;
          const botY = centerY + hPx / 2;

          // Body gradient
          const grad = ctx.createLinearGradient(centerX - rx, 0, centerX + rx, 0);
          grad.addColorStop(0, '#0369a1');
          grad.addColorStop(0.3, '#38bdf8');
          grad.addColorStop(0.7, '#0284c7');
          grad.addColorStop(1, '#0c4a6e');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.moveTo(centerX - rx, topY);
          ctx.lineTo(centerX - rx, botY);
          ctx.ellipse(centerX, botY, rx, ry, 0, 0, Math.PI);
          ctx.lineTo(centerX + rx, topY);
          ctx.ellipse(centerX, topY, rx, ry, 0, 0, Math.PI, true);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 2.5;
          ctx.stroke();

          // Liquid pour fill if active
          if (liquidPourProgress > 0) {
            const liquidLevel = (liquidPourProgress / 100) * (1 / 3); // Max fills 1/3
            const liquidHPx = hPx * liquidLevel;
            const liquidTopY = botY - liquidHPx;

            ctx.fillStyle = 'rgba(52, 211, 153, 0.45)';
            ctx.beginPath();
            ctx.moveTo(centerX - rx, liquidTopY);
            ctx.lineTo(centerX - rx, botY);
            ctx.ellipse(centerX, botY, rx, ry, 0, 0, Math.PI);
            ctx.lineTo(centerX + rx, liquidTopY);
            ctx.ellipse(centerX, liquidTopY, rx, ry, 0, 0, Math.PI, true);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = '#34d399';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Water surface ellipse
            ctx.fillStyle = 'rgba(16, 185, 129, 0.7)';
            ctx.beginPath();
            ctx.ellipse(centerX, liquidTopY, rx, ry, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // 1/3 Height Indicator
            ctx.fillStyle = '#34d399';
            ctx.font = 'bold 11px monospace';
            ctx.textAlign = 'left';
            ctx.fillText(`Water: ${(liquidLevel * 100).toFixed(1)}% (Limit: 33.3% = 1/3 Vol)`, centerX + rx + 12, liquidTopY + 4);
          }

          // Top Lid ellipse
          ctx.fillStyle = '#0284c7';
          ctx.beginPath();
          ctx.ellipse(centerX, topY, rx, ry, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#7dd3fc';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Dimensions
          if (showDimensions) {
            ctx.strokeStyle = '#f59e0b';
            ctx.lineWidth = 1.5;
            ctx.setLineDash([4, 3]);
            // Height dimension
            ctx.beginPath();
            ctx.moveTo(centerX - rx - 18, topY);
            ctx.lineTo(centerX - rx - 18, botY);
            ctx.stroke();
            // Radius dimension
            ctx.beginPath();
            ctx.moveTo(centerX, topY);
            ctx.lineTo(centerX + rx, topY);
            ctx.stroke();
            ctx.setLineDash([]);

            ctx.fillStyle = '#f59e0b';
            ctx.font = 'bold 11px monospace';
            ctx.textAlign = 'right';
            ctx.fillText(`h = ${height}`, centerX - rx - 24, centerY);
            ctx.textAlign = 'center';
            ctx.fillText(`r = ${radius}`, centerX + rx / 2, topY - 8);
          }
        }
      } else if (solidType === 'cone') {
        const rPx = radius * scale * 1.8;
        const hPx = height * scale * 1.8;
        const rx = rPx;
        const ry = rPx * 0.35;
        const apexY = centerY - hPx / 2;
        const botY = centerY + hPx / 2;

        if (unfold > 0.05) {
          // Cone Unfolded Sector
          const sectorRadius = slantHeight * scale * 1.5;
          const sectorAngle = (2 * Math.PI * radius) / slantHeight; // θ = 2πr / l

          ctx.fillStyle = 'rgba(245, 158, 11, 0.2)';
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(centerX, centerY - 20);
          ctx.arc(centerX, centerY - 20, sectorRadius * unfold, -Math.PI / 2 - sectorAngle / 2, -Math.PI / 2 + sectorAngle / 2);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Base circle net flap
          const circleY = centerY + sectorRadius * 0.5 * unfold;
          ctx.fillStyle = 'rgba(56, 189, 248, 0.3)';
          ctx.strokeStyle = '#38bdf8';
          ctx.beginPath();
          ctx.arc(centerX, circleY, rPx, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#f8fafc';
          ctx.font = 'bold 12px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(`Curved Sector: CSA = πrl = ${(Math.PI * radius * slantHeight).toFixed(1)}`, centerX, centerY - 35);
          ctx.fillStyle = '#38bdf8';
          ctx.fillText(`Base: πr² = ${(Math.PI * radius * radius).toFixed(1)}`, centerX, circleY + 4);
        } else {
          // 3D Cone View
          const coneGrad = ctx.createLinearGradient(centerX - rx, 0, centerX + rx, 0);
          coneGrad.addColorStop(0, '#b45309');
          coneGrad.addColorStop(0.3, '#f59e0b');
          coneGrad.addColorStop(0.7, '#d97706');
          coneGrad.addColorStop(1, '#78350f');

          ctx.fillStyle = coneGrad;
          ctx.beginPath();
          ctx.moveTo(centerX, apexY);
          ctx.lineTo(centerX - rx, botY);
          ctx.ellipse(centerX, botY, rx, ry, 0, 0, Math.PI);
          ctx.lineTo(centerX + rx, botY);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = '#fbbf24';
          ctx.lineWidth = 2.5;
          ctx.stroke();

          // Base ellipse
          ctx.fillStyle = 'rgba(180, 83, 9, 0.8)';
          ctx.beginPath();
          ctx.ellipse(centerX, botY, rx, ry, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Right-angle triangle inside (r, h, l)
          ctx.strokeStyle = '#a855f7';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(centerX, apexY);
          ctx.lineTo(centerX, botY); // height h
          ctx.lineTo(centerX + rx, botY); // radius r
          ctx.lineTo(centerX, apexY); // slant height l
          ctx.stroke();

          // Labels
          ctx.fillStyle = '#c084fc';
          ctx.font = 'bold 11px monospace';
          ctx.textAlign = 'right';
          ctx.fillText(`h = ${height}`, centerX - 8, centerY);
          ctx.textAlign = 'center';
          ctx.fillText(`r = ${radius}`, centerX + rx / 2, botY + 14);
          ctx.fillStyle = '#f59e0b';
          ctx.textAlign = 'left';
          ctx.fillText(`l = ${slantHeight.toFixed(1)}`, centerX + rx / 2 + 10, centerY);
        }
      } else if (solidType === 'sphere') {
        const rPx = radius * scale * 2.2;
        const sphereGrad = ctx.createRadialGradient(
          centerX - rPx * 0.3,
          centerY - rPx * 0.3,
          rPx * 0.1,
          centerX,
          centerY,
          rPx
        );
        sphereGrad.addColorStop(0, '#a78bfa');
        sphereGrad.addColorStop(0.5, '#7c3aed');
        sphereGrad.addColorStop(0.9, '#4c1d95');
        sphereGrad.addColorStop(1, '#2e1065');

        ctx.fillStyle = sphereGrad;
        ctx.beginPath();
        ctx.arc(centerX, centerY, rPx, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#c084fc';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Equator ellipse
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 3]);
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, rPx, rPx * 0.3, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Great circle radius line
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX + rPx, centerY);
        ctx.stroke();
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(centerX, centerY, 3.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`r = ${radius}`, centerX + rPx / 2, centerY - 6);
        ctx.fillStyle = '#e2e8f0';
        ctx.fillText(`4 Great Circles: 4 × πr² = ${(4 * Math.PI * radius * radius).toFixed(1)}`, centerX, centerY + rPx + 24);
      } else if (solidType === 'cuboid') {
        const lPx = length * scale * 1.5;
        const wPx = width * scale * 1.0;
        const hPx = height * scale * 1.5;

        if (unfold > 0.05) {
          // Cross Net for Cuboid
          const u = unfold;
          ctx.fillStyle = 'rgba(52, 211, 153, 0.2)';
          ctx.strokeStyle = '#34d399';
          ctx.lineWidth = 2;

          // Center face
          ctx.fillRect(centerX - lPx / 2, centerY - hPx / 2, lPx, hPx);
          ctx.strokeRect(centerX - lPx / 2, centerY - hPx / 2, lPx, hPx);

          // Top face
          ctx.fillRect(centerX - lPx / 2, centerY - hPx / 2 - wPx * u, lPx, wPx * u);
          ctx.strokeRect(centerX - lPx / 2, centerY - hPx / 2 - wPx * u, lPx, wPx * u);

          // Bottom face
          ctx.fillRect(centerX - lPx / 2, centerY + hPx / 2, lPx, wPx * u);
          ctx.strokeRect(centerX - lPx / 2, centerY + hPx / 2, lPx, wPx * u);

          // Left face
          ctx.fillRect(centerX - lPx / 2 - wPx * u, centerY - hPx / 2, wPx * u, hPx);
          ctx.strokeRect(centerX - lPx / 2 - wPx * u, centerY - hPx / 2, wPx * u, hPx);

          // Right face
          ctx.fillRect(centerX + lPx / 2, centerY - hPx / 2, wPx * u, hPx);
          ctx.strokeRect(centerX + lPx / 2, centerY - hPx / 2, wPx * u, hPx);

          ctx.fillStyle = '#f8fafc';
          ctx.font = 'bold 12px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(`Cuboid 6-Face Net: TSA = 2(lw + wh + hl) = ${cuboidTSA.toFixed(1)}`, centerX, centerY + hPx / 2 + wPx + 24);
        } else {
          // Isometric 3D Cuboid
          const x0 = centerX - lPx / 2;
          const y0 = centerY + hPx / 4;
          const isoX = wPx * 0.7;
          const isoY = wPx * 0.4;

          // Front face
          ctx.fillStyle = '#059669';
          ctx.fillRect(x0, y0 - hPx, lPx, hPx);
          ctx.strokeStyle = '#34d399';
          ctx.lineWidth = 2;
          ctx.strokeRect(x0, y0 - hPx, lPx, hPx);

          // Top face
          ctx.fillStyle = '#10b981';
          ctx.beginPath();
          ctx.moveTo(x0, y0 - hPx);
          ctx.lineTo(x0 + isoX, y0 - hPx - isoY);
          ctx.lineTo(x0 + lPx + isoX, y0 - hPx - isoY);
          ctx.lineTo(x0 + lPx, y0 - hPx);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Right face
          ctx.fillStyle = '#047857';
          ctx.beginPath();
          ctx.moveTo(x0 + lPx, y0 - hPx);
          ctx.lineTo(x0 + lPx + isoX, y0 - hPx - isoY);
          ctx.lineTo(x0 + lPx + isoX, y0 - isoY);
          ctx.lineTo(x0 + lPx, y0);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Labels
          ctx.fillStyle = '#f8fafc';
          ctx.font = 'bold 11px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(`L = ${length}`, x0 + lPx / 2, y0 + 16);
          ctx.textAlign = 'right';
          ctx.fillText(`H = ${height}`, x0 - 8, y0 - hPx / 2);
          ctx.textAlign = 'left';
          ctx.fillText(`W = ${width}`, x0 + lPx + isoX / 2 + 6, y0 - isoY / 2);
        }
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    window.addEventListener('resize', render);
    return () => {
      window.removeEventListener('resize', render);
      cancelAnimationFrame(animId);
    };
  }, [
    solidType,
    radius,
    height,
    length,
    width,
    unfoldPercent,
    liquidPourProgress,
    showDimensions,
    slantHeight,
    cuboidTSA,
  ]);

  const challengeLevels: ChallengeLevel[] = [
    {
      levelNumber: 1,
      title: 'Cylinder Net Unfold Master',
      badge: 'Unroll Net',
      description: 'Slide the 2D Net Unfolder to 100%. Observe why the curved surface area is simply an ordinary rectangle of dimensions 2πr × h!',
      requirementFormula: '\\text{CSA} = (2\\pi r) \\times h',
      targetCriteria: 'Unfold cylinder to ≥ 95%',
      xpReward: 40,
      autoPreset: () => updateSurfaceAreaParams({ solidType: 'cylinder', unfoldPercent: 100 }),
    },
    {
      levelNumber: 2,
      title: 'Archimedes 1/3 Liquid Pour',
      badge: '1/3 Cone Volume',
      description: 'Tap "Pour Cone into Cylinder". Watch the water level fill exactly one third (33.3%) of the cylinder volume!',
      requirementFormula: '\\text{Vol}_{\\text{cone}} = \\frac{1}{3}\\pi r^2 h',
      targetCriteria: 'Run liquid pour to 100%',
      xpReward: 45,
      autoPreset: () => updateSurfaceAreaParams({ solidType: 'cylinder', unfoldPercent: 0, liquidPourProgress: 0, isPouring: true }),
    },
    {
      levelNumber: 3,
      title: 'The 5-12-13 Cone Triplet',
      badge: 'Slant Height Master',
      description: 'Select Cone mode. Set radius r = 5 and height h = 12. Observe why the slant height l equals exactly 13 by Pythagoras!',
      requirementFormula: 'l = \\sqrt{r^2 + h^2} = \\sqrt{5^2 + 12^2} = 13',
      targetCriteria: 'Cone with r = 5 and h = 12',
      xpReward: 50,
      autoPreset: () => updateSurfaceAreaParams({ solidType: 'cone', radius: 5, height: 12, unfoldPercent: 0 }),
    },
  ];

  return (
    <div className="relative w-full h-full flex flex-col bg-slate-950 text-slate-100 overflow-hidden select-none">
      {/* HUD Header Bar */}
      <div className="flex-none px-4 py-2 bg-slate-900/90 border-b border-slate-800 backdrop-blur-md flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <Box className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold text-slate-200">
            {solidType.toUpperCase()} MENSURATION
          </span>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/40">
            {solidType === 'cylinder' && `Vol = ${(cylinderVolume).toFixed(1)} · CSA = ${(cylinderCSA).toFixed(1)}`}
            {solidType === 'cone' && `Vol = ${(coneVolume).toFixed(1)} · Slant l = ${slantHeight.toFixed(1)}`}
            {solidType === 'sphere' && `Vol = ${(sphereVolume).toFixed(1)} · Area = ${(sphereSurfaceArea).toFixed(1)}`}
            {solidType === 'cuboid' && `Vol = ${(cuboidVolume).toFixed(1)} · TSA = ${(cuboidTSA).toFixed(1)}`}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              playClick();
              lightTap();
              updateSurfaceAreaParams({
                liquidPourProgress: 0,
                isPouring: true,
              });
            }}
            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-600/40 active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
            title="Archimedes 1/3 volume test"
          >
            <Droplets className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Pour Water</span>
          </button>

          <button
            onClick={() => {
              resetParams('surface-area-volumes');
              playClick();
              lightTap();
            }}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-all cursor-pointer"
            title="Reset Parameters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Interactive Canvas */}
      <div className="relative flex-1 w-full h-full min-h-[300px] overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full h-full block cursor-grab active:cursor-grabbing"
        />

        {/* Real-time Pedagogical Concept Insight Banner */}
        <ConceptInsightBanner
          conceptTitle={
            solidType === 'cylinder'
              ? 'Cylinder: Rolled Rectangle + 2 Circle Lids'
              : solidType === 'cone'
              ? 'Cone: Slant Hypotenuse & Archimedes 1/3 Law'
              : solidType === 'sphere'
              ? 'Sphere: 4-Circle Orange Peel Geometry'
              : 'Cuboid: 3 Pairs of Identical Rectangles'
          }
          mathInsight={
            solidType === 'cylinder'
              ? `CSA = 2πrh = 2 × π × ${radius} × ${height} = ${cylinderCSA.toFixed(1)} m². Unrolled Rectangle: 2πr (${(2 * Math.PI * radius).toFixed(1)}m) × ${height}m. Vol = πr²h = ${cylinderVolume.toFixed(1)} m³.`
              : solidType === 'cone'
              ? `Slant height l = √(r² + h²) = √(${radius}² + ${height}²) = ${slantHeight.toFixed(2)}m. CSA = πrl = ${coneCSA.toFixed(1)} m². Vol = (1/3)πr²h = ${coneVolume.toFixed(1)} m³ (1/3 of cylinder!).`
              : solidType === 'sphere'
              ? `Surface Area = 4πr² = 4 × ${(Math.PI * radius * radius).toFixed(1)} = ${sphereSurfaceArea.toFixed(1)} m². Vol = (4/3)πr³ = ${sphereVolume.toFixed(1)} m³.`
              : `TSA = 2(lw + wh + hl) = 2(${length * width} + ${width * height} + ${height * length}) = ${cuboidTSA} m². Volume = ${length} × ${width} × ${height} = ${cuboidVolume} m³.`
          }
          eli10Analogy={
            solidType === 'cylinder'
              ? "Take a rectangular paper sheet and roll it into a tube: the sheet's width wraps into the circular rim (2πr), and its height is h! That is why CSA is literally just the area of that flat paper sheet: (2πr) × h!"
              : solidType === 'cone'
              ? "If you fill a cone with water and pour it into a cylinder of equal radius & height, it takes EXACTLY 3 full cones to fill it! That is why the volume formula is simply 1/3 × cylinder volume!"
              : solidType === 'sphere'
              ? "Imagine peeling an orange into 4 equal quarters and flattening them. Each piece covers a flat circle of area πr²! Four flat circles cover the whole sphere: 4πr²."
              : "A cardboard box has 6 faces: top and bottom match (2lw), front and back match (2lh), and sides match (2wh). Add all 3 pairs to find the total paper needed to wrap the gift!"
          }
          liveFeedback={
            solidType === 'cylinder'
              ? unfoldPercent > 0
                ? `Net Unrolled ${unfoldPercent}%: curved face revealed as flat rectangle of width 2πr = ${(2 * Math.PI * radius).toFixed(1)}m.`
                : `Solid Cylinder: Base circle area = ${(Math.PI * radius * radius).toFixed(1)} m². Volume = ${cylinderVolume.toFixed(1)} m³.`
              : solidType === 'cone'
              ? isPouring
                ? `Pouring liquid: ${liquidPourProgress.toFixed(0)}% transferred. Proves cone volume is 1/3 of cylinder!`
                : `Pythagorean slant height l = √(r² + h²) = ${slantHeight.toFixed(1)}m.`
              : solidType === 'sphere'
              ? `Sphere radius r = ${radius}m. Volume = ${sphereVolume.toFixed(1)} m³.`
              : `Cuboid dimensions: ${length}m × ${width}m × ${height}m. Total volume = ${cuboidVolume} m³.`
          }
          quickAction={
            solidType === 'cylinder'
              ? {
                  label: 'Unroll 2D Rectangle Net (100%)',
                  onApply: () => updateSurfaceAreaParams({ unfoldPercent: 100 }),
                }
              : solidType === 'cone'
              ? {
                  label: 'Pour Water (Archimedes 1/3 Test)',
                  onApply: () => updateSurfaceAreaParams({ liquidPourProgress: 0, isPouring: true }),
                }
              : undefined
          }
        />
      </div>

      {/* Collapsible Bottom Sheet */}
      <BottomSheet
        title="3D Solid Unfolder & Liquid Pourer"
        badgeLabel={`Solid: ${solidType.toUpperCase()}`}
        quickEquation={solidType === 'cone' ? 'Vol = \\frac{1}{3}\\pi r^2 h' : 'CSA = 2\\pi r h'}
        onReset={() => resetParams('surface-area-volumes')}
        theoryContent={<CoachTheoryModule simulatorId="surface-area-volumes" />}
        challengeContent={
          <div className="space-y-4">
            <ChallengeManager
              simulatorId="surface-area-volumes"
              simulatorTitle="The 3D Solid Unfolder"
              levels={challengeLevels}
              onTriggerPreset={(lvl: number) => {
                const targetLvl = challengeLevels.find((l) => l.levelNumber === lvl);
                targetLvl?.autoPreset?.();
              }}
              isOpenDefault={true}
            />
          </div>
        }
      >
        <div className="space-y-4 text-xs">
          {/* Solid Type Switcher */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Choose 3D Solid
            </label>
            <div className="grid grid-cols-4 gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
              {(['cylinder', 'cone', 'sphere', 'cuboid'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    updateSurfaceAreaParams({ solidType: type, unfoldPercent: 0 });
                    playClick();
                    lightTap();
                  }}
                  className={`py-1.5 text-xs font-semibold rounded-lg capitalize transition-all cursor-pointer ${
                    solidType === type
                      ? 'bg-cyan-500 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Unfold Net Slider */}
          {solidType !== 'sphere' && (
            <TouchSlider
              label="Unfold Solid into Flat Net"
              value={unfoldPercent}
              min={0}
              max={100}
              step={1}
              unit="%"
              formulaTerm="Net"
              causeEffectHint={(val) =>
                val === 0
                  ? '3D closed shape. Drag to peel and lay flat!'
                  : `Unrolled ${val}%: curved face flattens into rectangle of width 2πr = ${(2 * Math.PI * radius).toFixed(1)}m`
              }
              onChange={(val) => updateSurfaceAreaParams({ unfoldPercent: val })}
            />
          )}

          {/* Radius and Height Controls */}
          {solidType !== 'cuboid' ? (
            <>
              <TouchSlider
                label="Base Radius (r)"
                value={radius}
                min={1}
                max={8}
                step={0.5}
                unit="m"
                formulaTerm="r²"
                causeEffectHint={(val) =>
                  `Cross-section area πr² = ${(Math.PI * val * val).toFixed(1)}m². Doubling r multiplies volume by 4!`
                }
                onChange={(val) => updateSurfaceAreaParams({ radius: val })}
              />
              {solidType !== 'sphere' && (
                <TouchSlider
                  label="Vertical Height (h)"
                  value={height}
                  min={2}
                  max={14}
                  step={0.5}
                  unit="m"
                  formulaTerm="h"
                  causeEffectHint={(val) =>
                    `Linear multiplier: volume scales 1:1 directly proportional with height.`
                  }
                  onChange={(val) => updateSurfaceAreaParams({ height: val })}
                />
              )}
            </>
          ) : (
            <>
              <TouchSlider
                label="Length (L)"
                value={length}
                min={2}
                max={10}
                step={0.5}
                unit="m"
                formulaTerm="l"
                causeEffectHint={(val) =>
                  `Contributes to floor area (lw = ${val * width}m²) and front face (lh = ${val * height}m²).`
                }
                onChange={(val) => updateSurfaceAreaParams({ length: val })}
              />
              <TouchSlider
                label="Width (W)"
                value={width}
                min={2}
                max={8}
                step={0.5}
                unit="m"
                formulaTerm="w"
                causeEffectHint={(val) =>
                  `Contributes to floor area (lw = ${length * val}m²) and side face (wh = ${val * height}m²).`
                }
                onChange={(val) => updateSurfaceAreaParams({ width: val })}
              />
              <TouchSlider
                label="Height (H)"
                value={height}
                min={2}
                max={10}
                step={0.5}
                unit="m"
                formulaTerm="h"
                causeEffectHint={(val) =>
                  `Contributes to front face (lh = ${length * val}m²) and side face (wh = ${width * val}m²).`
                }
                onChange={(val) => updateSurfaceAreaParams({ height: val })}
              />
            </>
          )}

          {/* Archimedes Test Button */}
          <div className="pt-2">
            <button
              onClick={() => {
                updateSurfaceAreaParams({
                  solidType: 'cylinder',
                  liquidPourProgress: 0,
                  isPouring: true,
                  unfoldPercent: 0,
                });
                playClick();
                lightTap();
              }}
              className="w-full py-2.5 rounded-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-950/40 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Droplets className="w-4 h-4 text-emerald-200" />
              <span>Run Archimedes Liquid Pour (1/3 Test)</span>
            </button>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
};
