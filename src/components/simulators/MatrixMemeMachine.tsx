/**
 * MatrixMemeMachine.tsx: Interactive 2x2 Matrix Transformation & Determinant Simulator for Class 12.
 * Features:
 * - 2x2 matrix sliders [a, b; c, d]
 * - Canvas transforms meme/graphic: [x'; y'] = [a, b; c, d] * [x; y]
 * - Dynamic determinant calculation det(A) = ad - bc
 * - Visual Singularity & Rank Collapse: When det(A) hits 0, the 2D image collapses into a 1D line
 * - Presets: Identity, Pure Rotation, Shear, Reflection, Zero Singular Collapse
 * - Image selector: Default Meme ("Doge Math"), Cartesian Grid, or Custom image upload
 */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Sliders, 
  RotateCw, 
  Maximize2, 
  Minimize2, 
  Sparkles, 
  Upload, 
  AlertTriangle, 
  Layers, 
  RefreshCw, 
  HelpCircle,
  TrendingDown,
  Info,
  CheckCircle2,
  Image as ImageIcon
} from 'lucide-react';
import { BottomSheet } from '../layout/BottomSheet';
import { TouchSlider } from '../common/TouchSlider';
import { MathFormula } from '../common/MathFormula';
import { CoachTheoryModule } from '../common/CoachTheoryModule';
import { ChallengeManager, ChallengeLevel } from '../common/ChallengeManager';
import { useHaptics } from '../../hooks/useHaptics';
import { useSound } from '../common/SoundManager';
import { useAnalytics } from '../../hooks/useAnalytics';

interface Matrix2x2 {
  a: number; // Row 1, Col 1 (Scale X / Cos)
  b: number; // Row 1, Col 2 (Shear X / -Sin)
  c: number; // Row 2, Col 1 (Shear Y / Sin)
  d: number; // Row 2, Col 2 (Scale Y / Cos)
}

export const MatrixMemeMachine: React.FC = () => {
  const { lightTap, successBuzz, errorBuzz } = useHaptics();
  const { playClick, playChime, playError, playWhoosh } = useSound();
  const { trackEvent, trackStruggle } = useAnalytics();

  // 2x2 Matrix Coefficients [a, b; c, d]
  const [matrix, setMatrix] = useState<Matrix2x2>({
    a: 1,
    b: 0,
    c: 0,
    d: 1,
  });

  const [selectedGraphic, setSelectedGraphic] = useState<'meme' | 'grid' | 'cat'>('meme');
  const [customImageSrc, setCustomImageSrc] = useState<string | null>(null);
  const [showBasisVectors, setShowBasisVectors] = useState<boolean>(true);
  const [showOriginalGhost, setShowOriginalGhost] = useState<boolean>(true);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const memeImgRef = useRef<HTMLImageElement | null>(null);

  // Direct on-canvas dragging state for basis vectors
  const [dragTarget, setDragTarget] = useState<'i' | 'j' | null>(null);
  const [hoveredTarget, setHoveredTarget] = useState<'i' | 'j' | null>(null);

  // Determinant calculation: det(A) = ad - bc
  const determinant = matrix.a * matrix.d - matrix.b * matrix.c;
  const isSingular = Math.abs(determinant) < 0.05;

  // Track singularity event
  const singularityTriggeredRef = useRef(false);
  useEffect(() => {
    if (isSingular && !singularityTriggeredRef.current) {
      singularityTriggeredRef.current = true;
      errorBuzz();
      playError();
      trackEvent('matrix_singularity_collapsed', {
        matrix: `[${matrix.a}, ${matrix.b}; ${matrix.c}, ${matrix.d}]`,
        det: determinant,
      });
    } else if (!isSingular) {
      singularityTriggeredRef.current = false;
    }
  }, [isSingular, determinant, errorBuzz, playError, matrix, trackEvent]);

  // Generate procedurally rendered funny meme graphic if no custom upload
  useEffect(() => {
    const offCanvas = document.createElement('canvas');
    offCanvas.width = 180;
    offCanvas.height = 180;
    const ctx = offCanvas.getContext('2d');
    if (!ctx) return;

    // Draw funny math meme badge
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 180, 180);

    // Glowing border
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 6;
    ctx.strokeRect(3, 3, 174, 174);

    // Doge / Math Cat face placeholder graphic
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(90, 85, 55, 0, Math.PI * 2);
    ctx.fill();

    // Ears
    ctx.fillStyle = '#d97706';
    ctx.beginPath();
    ctx.moveTo(50, 45);
    ctx.lineTo(70, 75);
    ctx.lineTo(40, 75);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(130, 45);
    ctx.lineTo(140, 75);
    ctx.lineTo(110, 75);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(75, 80, 12, 0, Math.PI * 2);
    ctx.arc(105, 80, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(77, 80, 6, 0, Math.PI * 2);
    ctx.arc(107, 80, 6, 0, Math.PI * 2);
    ctx.fill();

    // Snout
    ctx.fillStyle = '#fef3c7';
    ctx.beginPath();
    ctx.ellipse(90, 102, 18, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#451a03';
    ctx.beginPath();
    ctx.arc(90, 98, 5, 0, Math.PI * 2);
    ctx.fill();

    // Text: "MUCH MATRIX"
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SUCH TRANSFORM', 90, 25);
    ctx.fillStyle = '#10b981';
    ctx.fillText('VERY DET = 0', 90, 165);

    const img = new Image();
    img.src = offCanvas.toDataURL();
    memeImgRef.current = img;
  }, []);

  // Handle custom image upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      setCustomImageSrc(src);
      const img = new Image();
      img.src = src;
      memeImgRef.current = img;
      lightTap();
      playChime();
    };
    reader.readAsDataURL(file);
  };

  // Preset Transformation matrix shortcuts
  const applyPreset = (presetName: string) => {
    playWhoosh();
    lightTap();
    switch (presetName) {
      case 'identity':
        setMatrix({ a: 1, b: 0, c: 0, d: 1 });
        break;
      case 'rotate45': {
        const theta = Math.PI / 4;
        setMatrix({
          a: Number(Math.cos(theta).toFixed(2)),
          b: Number(-Math.sin(theta).toFixed(2)),
          c: Number(Math.sin(theta).toFixed(2)),
          d: Number(Math.cos(theta).toFixed(2)),
        });
        break;
      }
      case 'shearX':
        setMatrix({ a: 1, b: 1.2, c: 0, d: 1 });
        break;
      case 'reflectY':
        setMatrix({ a: -1, b: 0, c: 0, d: 1 });
        break;
      case 'singular':
        // Proportional rows => det(A) = 0
        setMatrix({ a: 1, b: 2, c: 0.5, d: 1 });
        break;
      case 'collapseHorizontal':
        setMatrix({ a: 1, b: 0, c: 0, d: 0 });
        break;
      default:
        break;
    }
  };

  // Render loop applying linear transform [a, b; c, d]
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

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

    // Deep grid background
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2;
    const scale = Math.min(w, h) / 10;

    // Draw background Cartesian coordinate grid
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.25)';
    ctx.lineWidth = 1;
    for (let x = -8; x <= 8; x++) {
      ctx.beginPath();
      ctx.moveTo(cx + x * scale, 0);
      ctx.lineTo(cx + x * scale, h);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, cy + x * scale);
      ctx.lineTo(w, cy + x * scale);
      ctx.stroke();
    }

    // Axes
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(100, 116, 139, 0.6)';
    ctx.beginPath();
    ctx.moveTo(0, cy);
    ctx.lineTo(w, cy);
    ctx.moveTo(cx, 0);
    ctx.lineTo(cx, h);
    ctx.stroke();

    // Original untransformed bounding ghost box (1x1 square or image preview)
    if (showOriginalGhost) {
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1.5;
      const ghostSize = scale * 2;
      ctx.strokeRect(cx - ghostSize / 2, cy - ghostSize / 2, ghostSize, ghostSize);
      ctx.setLineDash([]);
    }

    // Transform Canvas with Matrix [a, c, b, d, 0, 0]
    // Note: Canvas transform arguments are (a, c, b, d, e, f) where
    // x' = ax + by + e
    // y' = cx + dy + f
    ctx.save();
    ctx.translate(cx, cy);

    // If singular matrix, apply slight jitter or flat collapse line
    ctx.transform(matrix.a, matrix.c, matrix.b, matrix.d, 0, 0);

    const imgSize = scale * 2;

    if (memeImgRef.current && memeImgRef.current.complete) {
      // Draw transformed meme image
      try {
        ctx.drawImage(memeImgRef.current, -imgSize / 2, -imgSize / 2, imgSize, imgSize);
      } catch {}
    } else {
      // Fallback geometric card
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(-imgSize / 2, -imgSize / 2, imgSize, imgSize);
    }

    // Transformed boundary stroke
    ctx.strokeStyle = isSingular ? '#ef4444' : '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(-imgSize / 2, -imgSize / 2, imgSize, imgSize);

    ctx.restore();

    // Draw Basis Vectors i_hat [1, 0] -> [a, c] and j_hat [0, 1] -> [b, d]
    if (showBasisVectors) {
      // Transformed i-hat [a, c] in Red/Amber
      const ix = cx + matrix.a * scale;
      const iy = cy - matrix.c * scale; // invert y for math coords
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(ix, iy);
      ctx.stroke();

      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 11px monospace';
      ctx.fillText(`î' [${matrix.a}, ${matrix.c}]`, ix + 6, iy - 6);

      // Draggable glowing handle on i-hat
      const isIHovered = hoveredTarget === 'i' || dragTarget === 'i';
      ctx.fillStyle = isIHovered ? '#fca5a5' : '#ef4444';
      ctx.beginPath();
      ctx.arc(ix, iy, isIHovered ? 11 : 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Outer animated pulse ring on i-hat
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.45)';
      ctx.lineWidth = isIHovered ? 6 : 3;
      ctx.beginPath();
      ctx.arc(ix, iy, isIHovered ? 18 : 14, 0, Math.PI * 2);
      ctx.stroke();

      // Transformed j-hat [b, d] in Green/Emerald
      const jx = cx + matrix.b * scale;
      const jy = cy - matrix.d * scale;
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(jx, jy);
      ctx.stroke();

      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 11px monospace';
      ctx.fillText(`ĵ' [${matrix.b}, ${matrix.d}]`, jx + 6, jy - 6);

      // Draggable glowing handle on j-hat
      const isJHovered = hoveredTarget === 'j' || dragTarget === 'j';
      ctx.fillStyle = isJHovered ? '#6ee7b7' : '#10b981';
      ctx.beginPath();
      ctx.arc(jx, jy, isJHovered ? 11 : 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Outer animated pulse ring on j-hat
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.45)';
      ctx.lineWidth = isJHovered ? 6 : 3;
      ctx.beginPath();
      ctx.arc(jx, jy, isJHovered ? 18 : 14, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Singular Collapse Line Overlay
    if (isSingular) {
      ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 14px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('⚠️ SINGULAR MATRIX: det(A) ≈ 0', w / 2, 40);
      ctx.font = '11px sans-serif';
      ctx.fillStyle = '#fca5a5';
      ctx.fillText('Dimension collapsed! 2D area squished to 0 (No Inverse Exists)', w / 2, 60);
      ctx.textAlign = 'left';
    }

    ctx.restore();
  }, [matrix, isSingular, showBasisVectors, showOriginalGhost, hoveredTarget, dragTarget]);

  // Direct On-Canvas Pointer Handlers to Grip & Move Basis Vectors
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const scale = Math.min(rect.width, rect.height) / 10;

    const ix = cx + matrix.a * scale;
    const iy = cy - matrix.c * scale;
    const jx = cx + matrix.b * scale;
    const jy = cy - matrix.d * scale;

    const distI = Math.hypot(sx - ix, sy - iy);
    const distJ = Math.hypot(sx - jx, sy - jy);

    if (distI < 32) {
      e.currentTarget.setPointerCapture(e.pointerId);
      setDragTarget('i');
      lightTap();
      playClick(1.2);
    } else if (distJ < 32) {
      e.currentTarget.setPointerCapture(e.pointerId);
      setDragTarget('j');
      lightTap();
      playClick(1.2);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const scale = Math.min(rect.width, rect.height) / 10;

    if (dragTarget === 'i') {
      const mathX = Number(((sx - cx) / scale).toFixed(1));
      const mathY = Number(((cy - sy) / scale).toFixed(1));
      const boundedX = Math.max(-3, Math.min(3, mathX));
      const boundedY = Math.max(-3, Math.min(3, mathY));
      setMatrix((prev) => ({ ...prev, a: boundedX, c: boundedY }));
      return;
    }

    if (dragTarget === 'j') {
      const mathX = Number(((sx - cx) / scale).toFixed(1));
      const mathY = Number(((cy - sy) / scale).toFixed(1));
      const boundedX = Math.max(-3, Math.min(3, mathX));
      const boundedY = Math.max(-3, Math.min(3, mathY));
      setMatrix((prev) => ({ ...prev, b: boundedX, d: boundedY }));
      return;
    }

    const ix = cx + matrix.a * scale;
    const iy = cy - matrix.c * scale;
    const jx = cx + matrix.b * scale;
    const jy = cy - matrix.d * scale;

    const distI = Math.hypot(sx - ix, sy - iy);
    const distJ = Math.hypot(sx - jx, sy - jy);

    if (distI < 32) {
      setHoveredTarget('i');
    } else if (distJ < 32) {
      setHoveredTarget('j');
    } else {
      setHoveredTarget(null);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (dragTarget) {
      setDragTarget(null);
      try {
        canvasRef.current?.releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  // Challenge Levels
  const challengeLevels: ChallengeLevel[] = [
    {
      levelNumber: 1,
      title: 'Pure 90° Orthogonal Rotation',
      badge: 'Rotator',
      description: 'Set matrix [a, b; c, d] to rotate the image 90° counter-clockwise without scaling: [0, -1; 1, 0].',
      requirementFormula: '[cos(90°), -sin(90°); sin(90°), cos(90°)] = [0, -1; 1, 0]',
      targetCriteria: 'a=0, b=-1, c=1, d=0',
      xpReward: 40,
      autoPreset: () => setMatrix({ a: 0, b: -1, c: 1, d: 0 }),
    },
    {
      levelNumber: 2,
      title: 'Horizontal Shear (Leaning Tower)',
      badge: 'Shear Master',
      description: 'Keep the base stationary while shearing the top horizontally: set b = 1.5, leaving a=1, c=0, d=1.',
      requirementFormula: '[1, k; 0, 1] with det(A) = 1 (area preserved!)',
      targetCriteria: 'b=1.5, det=1',
      xpReward: 50,
      autoPreset: () => setMatrix({ a: 1, b: 1.5, c: 0, d: 1 }),
    },
    {
      levelNumber: 3,
      title: 'The Great Singular Collapse',
      badge: 'Dimension Slicer',
      description: 'Adjust the sliders so that det(A) = ad - bc = 0, collapsing the 2D meme into a 1D straight line.',
      requirementFormula: 'det(A) = ad - bc = 0',
      targetCriteria: 'det(A) = 0',
      xpReward: 60,
      autoPreset: () => setMatrix({ a: 1, b: 2, c: 0.5, d: 1 }),
    },
  ];

  return (
    <div className="relative w-full flex-1 min-h-0 h-full flex flex-col bg-slate-950 text-slate-100 overflow-hidden select-none">
      {/* Top HUD with Real-Time Matrix & Determinant Display */}
      <div className="z-10 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-3 sm:px-6 py-2 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {/* Matrix preview bracket */}
          <div className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2 font-mono text-xs">
            <span className="text-slate-400 font-bold">A =</span>
            <span className="text-cyan-400 font-bold">
              [{matrix.a}, {matrix.b}; {matrix.c}, {matrix.d}]
            </span>
          </div>

          {/* Dynamic Determinant Pill */}
          <div
            className={`px-3 py-1 rounded-xl border flex items-center gap-1.5 font-mono text-xs font-bold transition-colors ${
              isSingular
                ? 'bg-rose-950/80 border-rose-500 text-rose-300 animate-pulse'
                : 'bg-emerald-950/60 border-emerald-800/60 text-emerald-300'
            }`}
          >
            <span>det(A):</span>
            <span>{determinant.toFixed(2)}</span>
            {isSingular && <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />}
          </div>
        </div>

        {/* Custom Image Upload Button */}
        <div className="flex items-center gap-2 shrink-0">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-1.5 px-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Upload Custom Image"
          >
            <Upload className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Upload Image</span>
          </button>
        </div>
      </div>

      {/* Main Canvas Stage */}
      <div className="relative flex-1 w-full bg-slate-950 touch-none">
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className={`w-full h-full touch-none ${
            dragTarget
              ? 'cursor-grabbing'
              : hoveredTarget
              ? 'cursor-grab'
              : 'cursor-crosshair'
          }`}
        />

        {/* Direct on-canvas grip guide banner */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 pointer-events-none flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 shadow-xl backdrop-blur-md text-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shrink-0" />
          <span className="text-slate-300 font-sans">
            Catch and drag <strong className="text-red-400">î'</strong> or <strong className="text-emerald-400">ĵ'</strong> handles directly on the canvas!
          </span>
        </div>

        {/* Quick Floating Presets Bar */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 flex flex-wrap gap-1.5 max-w-xs sm:max-w-sm">
          <button
            type="button"
            onClick={() => applyPreset('identity')}
            className="py-1 px-2.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-[11px] font-mono font-bold text-slate-300"
          >
            Identity (I)
          </button>
          <button
            type="button"
            onClick={() => applyPreset('rotate45')}
            className="py-1 px-2.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-[11px] font-mono font-bold text-cyan-300"
          >
            Rotate 45°
          </button>
          <button
            type="button"
            onClick={() => applyPreset('shearX')}
            className="py-1 px-2.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-[11px] font-mono font-bold text-amber-300"
          >
            Shear X
          </button>
          <button
            type="button"
            onClick={() => applyPreset('reflectY')}
            className="py-1 px-2.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-[11px] font-mono font-bold text-purple-300"
          >
            Reflect Y
          </button>
          <button
            type="button"
            onClick={() => applyPreset('singular')}
            className="py-1 px-2.5 rounded-lg bg-rose-950/80 hover:bg-rose-900/80 border border-rose-600 text-[11px] font-mono font-bold text-rose-300"
          >
            Collapse (det=0)
          </button>
        </div>
      </div>

      {/* Bottom Sheet Controls & Formulas */}
      <BottomSheet
        title="2x2 Matrix Transformation Controls"
        badgeLabel="Class 12 · Matrices & Determinants"
        quickEquation={`det(A) = ${determinant.toFixed(2)} · [${matrix.a}, ${matrix.b}; ${matrix.c}, ${matrix.d}]`}
        onReset={() => setMatrix({ a: 1, b: 0, c: 0, d: 1 })}
        theoryContent={
          <CoachTheoryModule
            simulatorId="matrix-meme"
            extraLiveDetails={
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-xl bg-cyan-950/30 border border-cyan-800/40">
                    <span className="text-[10px] text-cyan-300 block font-semibold">Active Matrix A:</span>
                    <span className="font-mono text-white font-bold">[{matrix.a}, {matrix.b}; {matrix.c}, {matrix.d}]</span>
                  </div>
                  <div className="p-2 rounded-xl bg-amber-950/30 border border-amber-800/40">
                    <span className="text-[10px] text-amber-300 block font-semibold">Determinant ad - bc:</span>
                    <span className={`font-mono font-bold ${isSingular ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {determinant.toFixed(3)} {isSingular ? '(Singular!)' : '(Invertible)'}
                    </span>
                  </div>
                </div>
              </div>
            }
          />
        }
        challengeContent={
          <div className="space-y-4">
            <ChallengeManager
              simulatorId="matrix-meme"
              simulatorTitle="The Matrix Meme Machine"
              levels={challengeLevels}
              onTriggerPreset={(lvl) => {
                const targetLvl = challengeLevels.find((l) => l.levelNumber === lvl);
                targetLvl?.autoPreset?.();
              }}
              isOpenDefault={true}
            />
          </div>
        }
      >
        {/* Sliders for [a, b; c, d] */}
        <div className="space-y-3">
          <div className="flex flex-col gap-3">
            {/* Row 1 Controls */}
            <div className="space-y-2 p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs font-bold text-cyan-400 block font-mono">Row 1: [a, b] (Basis Vector î')</span>
              <TouchSlider
                label="a (Scale X)"
                value={matrix.a}
                min={-3}
                max={3}
                step={0.1}
                formulaTerm="a"
                onChange={(val) => setMatrix((prev) => ({ ...prev, a: val }))}
              />
              <TouchSlider
                label="b (Shear X)"
                value={matrix.b}
                min={-3}
                max={3}
                step={0.1}
                formulaTerm="b"
                onChange={(val) => setMatrix((prev) => ({ ...prev, b: val }))}
              />
            </div>

            {/* Row 2 Controls */}
            <div className="space-y-2 p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs font-bold text-emerald-400 block font-mono">Row 2: [c, d] (Basis Vector ĵ')</span>
              <TouchSlider
                label="c (Shear Y)"
                value={matrix.c}
                min={-3}
                max={3}
                step={0.1}
                formulaTerm="c"
                onChange={(val) => setMatrix((prev) => ({ ...prev, c: val }))}
              />
              <TouchSlider
                label="d (Scale Y)"
                value={matrix.d}
                min={-3}
                max={3}
                step={0.1}
                formulaTerm="d"
                onChange={(val) => setMatrix((prev) => ({ ...prev, d: val }))}
              />
            </div>
          </div>

          {/* Visual Toggles */}
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowBasisVectors(!showBasisVectors)}
              className={`py-2 px-3 rounded-xl border text-xs font-bold transition-colors ${
                showBasisVectors
                  ? 'bg-cyan-950/60 border-cyan-500 text-cyan-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              <span>{showBasisVectors ? "Basis Vectors (î', ĵ') ON" : "Basis Vectors OFF"}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowOriginalGhost(!showOriginalGhost)}
              className={`py-2 px-3 rounded-xl border text-xs font-bold transition-colors ${
                showOriginalGhost
                  ? 'bg-slate-800 border-slate-600 text-slate-200'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              <span>{showOriginalGhost ? 'Original Ghost Box ON' : 'Original Ghost Box OFF'}</span>
            </button>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
};
