/**
 * canvasFx.ts: High-Performance Canvas & Interaction Physics Utilities
 * Implements:
 * 1. Synchronized Equation Term Highlighting
 * 2. Transient Ghost Trails (Motion History)
 * 3. Magnetic Landmark Snapping with Haptic Ticks
 * 4. Direct On-Canvas Hover Rings & Pulsing Affordances
 */

import confetti from 'canvas-confetti';

export interface Landmark {
  value: number;
  label?: string;
  tolerance?: number;
}

export interface GhostPoint {
  x: number;
  y: number;
  time: number;
  data?: any;
}

/**
 * 3. Magnetic Landmark Snapper:
 * Snaps continuous floating-point drag values to canonical mathematical landmarks
 * (e.g. 0, integers, 30°, 45°, 60°, 90°, D=0, etc.) with haptic and audio callback.
 */
export function checkMagneticSnap(
  val: number,
  landmarks: (number | Landmark)[],
  defaultThreshold: number = 0.15,
  onSnap?: (snappedValue: number, label?: string) => void
): { value: number; didSnap: boolean; label?: string } {
  for (const item of landmarks) {
    const targetVal = typeof item === 'number' ? item : item.value;
    const threshold = typeof item === 'number' ? defaultThreshold : (item.tolerance ?? defaultThreshold);
    const label = typeof item === 'number' ? undefined : item.label;

    if (Math.abs(val - targetVal) <= threshold) {
      if (onSnap) {
        onSnap(targetVal, label);
      }
      return { value: targetVal, didSnap: true, label };
    }
  }
  return { value: val, didSnap: false };
}

/**
 * 4. Direct On-Canvas Hover Ring & Pulsing Affordance Renderer:
 * Paints unmistakable, high-contrast touch/mouse affordances:
 * - Concentric beacon ripples
 * - Dynamic radius expansion on hover
 * - Center pivot core
 * - Optional floating label badge
 */
export function drawGripAffordance(
  ctx: CanvasRenderingContext2D,
  sx: number,
  sy: number,
  options: {
    color?: string;
    label?: string;
    sublabel?: string;
    isHovered?: boolean;
    isDragging?: boolean;
    radius?: number;
    showPulse?: boolean;
  } = {}
) {
  const {
    color = '#38bdf8', // Cyan default
    label,
    sublabel,
    isHovered = false,
    isDragging = false,
    radius = isDragging ? 14 : isHovered ? 12 : 9,
    showPulse = true,
  } = options;

  const now = performance.now();
  const pulseFactor = showPulse && !isDragging ? (Math.sin(now / 350) + 1) / 2 : 0;

  ctx.save();

  // 1. Concentric breathing ripple for idle discovery
  if (showPulse && !isDragging) {
    const rippleRadius = radius + 6 + pulseFactor * 8;
    const rippleAlpha = 0.25 * (1 - pulseFactor);
    ctx.beginPath();
    ctx.arc(sx, sy, rippleRadius, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = rippleAlpha;
    ctx.stroke();
  }

  // 2. Soft Outer Aura / Drop-shadow
  ctx.globalAlpha = isDragging ? 0.9 : isHovered ? 0.8 : 0.45;
  ctx.beginPath();
  ctx.arc(sx, sy, radius + 4, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();

  // 3. Crisp High-Contrast Ring
  ctx.globalAlpha = 1;
  ctx.beginPath();
  ctx.arc(sx, sy, radius, 0, Math.PI * 2);
  ctx.fillStyle = isDragging ? '#0284c7' : isHovered ? '#0f172a' : '#090d16';
  ctx.fill();
  ctx.strokeStyle = isDragging ? '#ffffff' : color;
  ctx.lineWidth = isDragging ? 3 : 2.5;
  ctx.stroke();

  // 4. Central Solid Pivot Dot
  ctx.beginPath();
  ctx.arc(sx, sy, isDragging ? 5 : isHovered ? 4.5 : 3.5, 0, Math.PI * 2);
  ctx.fillStyle = isDragging ? '#ffffff' : color;
  ctx.fill();

  // 5. High-Contrast Floating Label Pill
  if (label) {
    ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
    const textWidth = ctx.measureText(label).width;
    const pillPaddingX = 6;
    const pillHeight = 18;
    const pillX = sx - (textWidth + pillPaddingX * 2) / 2;
    const pillY = sy - radius - 22;

    // Pill background
    ctx.fillStyle = 'rgba(2, 6, 23, 0.9)';
    ctx.strokeStyle = isHovered || isDragging ? color : 'rgba(71, 85, 105, 0.6)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(pillX, pillY, textWidth + pillPaddingX * 2, pillHeight, 6);
    ctx.fill();
    ctx.stroke();

    // Label text
    ctx.fillStyle = isHovered || isDragging ? '#38bdf8' : '#f8fafc';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, sx, pillY + pillHeight / 2);

    if (sublabel && (isHovered || isDragging)) {
      ctx.font = '9px monospace';
      ctx.fillStyle = '#fbbf24';
      ctx.fillText(sublabel, sx, pillY - 8);
    }
  }

  ctx.restore();
}

/**
 * 2. Transient Ghost Motion History Tracker:
 * Manages an ephemeral buffer of past coordinates and paints fading motion history.
 */
export class GhostTrailBuffer {
  private buffer: GhostPoint[] = [];
  private maxAgeMs: number;
  private maxPoints: number;

  constructor(maxAgeMs: number = 800, maxPoints: number = 10) {
    this.maxAgeMs = maxAgeMs;
    this.maxPoints = maxPoints;
  }

  push(x: number, y: number, data?: any) {
    const now = performance.now();
    // Only push if position changed noticeably
    const last = this.buffer[this.buffer.length - 1];
    if (last && Math.hypot(last.x - x, last.y - y) < 1.5) {
      return;
    }
    this.buffer.push({ x, y, time: now, data });
    if (this.buffer.length > this.maxPoints) {
      this.buffer.shift();
    }
  }

  draw(
    ctx: CanvasRenderingContext2D,
    renderGhost: (pt: GhostPoint, alpha: number, index: number) => void
  ) {
    const now = performance.now();
    // Filter out expired points
    this.buffer = this.buffer.filter((pt) => now - pt.time <= this.maxAgeMs);

    for (let i = 0; i < this.buffer.length; i++) {
      const pt = this.buffer[i];
      const ageRatio = (now - pt.time) / this.maxAgeMs; // 0 (new) to 1 (expired)
      const alpha = Math.max(0.04, (1 - ageRatio) * 0.35);
      renderGhost(pt, alpha, i);
    }
  }

}

/**
 * 6. Component Shadow Drops (Cartesian Decomposition):
 * Renders dashed projection lines from a 2D point (sx, sy) to the axes (originX, originY)
 * with high-contrast coordinate chips.
 */
export function drawShadowDrops(
  ctx: CanvasRenderingContext2D,
  sx: number,
  sy: number,
  originX: number,
  originY: number,
  options: {
    valX?: number | string;
    valY?: number | string;
    colorX?: string;
    colorY?: string;
    dash?: number[];
  } = {}
) {
  const {
    valX,
    valY,
    colorX = '#38bdf8', // Cyan
    colorY = '#f43f5e', // Rose
    dash = [3, 3],
  } = options;

  ctx.save();
  ctx.setLineDash(dash);
  ctx.lineWidth = 1.2;

  // Drop to X-Axis: vertical line from (sx, sy) down to (sx, originY)
  ctx.strokeStyle = colorX;
  ctx.beginPath();
  ctx.moveTo(sx, sy);
  ctx.lineTo(sx, originY);
  ctx.stroke();

  // Drop to Y-Axis: horizontal line from (sx, sy) across to (originX, sy)
  ctx.strokeStyle = colorY;
  ctx.beginPath();
  ctx.moveTo(sx, sy);
  ctx.lineTo(originX, sy);
  ctx.stroke();

  ctx.setLineDash([]);

  // Axis Footprint Marks
  ctx.fillStyle = colorX;
  ctx.beginPath();
  ctx.arc(sx, originY, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = colorY;
  ctx.beginPath();
  ctx.arc(originX, sy, 3, 0, Math.PI * 2);
  ctx.fill();

  // Coordinate Callout Tags on the axes
  if (valX !== undefined) {
    ctx.font = 'bold 9px monospace';
    ctx.fillStyle = colorX;
    ctx.textAlign = 'center';
    ctx.fillText(typeof valX === 'number' ? valX.toFixed(2) : valX, sx, originY + (sy < originY ? 12 : -6));
  }

  if (valY !== undefined) {
    ctx.font = 'bold 9px monospace';
    ctx.fillStyle = colorY;
    ctx.textAlign = sx < originX ? 'left' : 'right';
    ctx.fillText(typeof valY === 'number' ? valY.toFixed(2) : valY, originX + (sx < originX ? 6 : -6), sy + 3);
  }

  ctx.restore();
}

/**
 * 7. Critical Event Flare Manager:
 * Creates expanding, glowing harmonic discovery ripples when critical mathematical conditions
 * (e.g. D = 0, angle = 90°, limit h -> 0, target match) are triggered.
 */
export interface EventFlare {
  x: number;
  y: number;
  startTime: number;
  durationMs: number;
  color: string;
  maxRadius: number;
  label?: string;
}

export class CriticalEventFlareManager {
  private flares: EventFlare[] = [];

  trigger(x: number, y: number, options: { color?: string; maxRadius?: number; durationMs?: number; label?: string } = {}) {
    const { color = '#10b981', maxRadius = 45, durationMs = 450, label } = options;
    this.flares.push({
      x,
      y,
      startTime: performance.now(),
      durationMs,
      color,
      maxRadius,
      label,
    });
  }

  draw(ctx: CanvasRenderingContext2D) {
    const now = performance.now();
    this.flares = this.flares.filter((f) => now - f.startTime <= f.durationMs);

    for (const flare of this.flares) {
      const progress = (now - flare.startTime) / flare.durationMs; // 0 to 1
      const radius = progress * flare.maxRadius;
      const alpha = Math.max(0, (1 - progress) * 0.85);

      ctx.save();
      // Outer expanding ring
      ctx.strokeStyle = flare.color;
      ctx.lineWidth = 2.5 * (1 - progress * 0.5);
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(flare.x, flare.y, radius, 0, Math.PI * 2);
      ctx.stroke();

      // Soft glowing aura
      ctx.fillStyle = flare.color;
      ctx.globalAlpha = alpha * 0.25;
      ctx.beginPath();
      ctx.arc(flare.x, flare.y, radius * 0.65, 0, Math.PI * 2);
      ctx.fill();

      // Floating discovery label
      if (flare.label && progress < 0.8) {
        ctx.globalAlpha = Math.min(1, (1 - progress) * 1.5);
        ctx.font = 'bold 11px system-ui, sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(flare.label, flare.x, flare.y - radius - 6);
      }

      ctx.restore();
    }
  }

  clear() {
    this.flares = [];
  }
}

/**
 * 9. Kinetic Linear Interpolation & Smooth Damping Helpers:
 */
export function lerp(start: number, end: number, factor: number = 0.15): number {
  return start + (end - start) * factor;
}

export function smoothDamp(
  current: number,
  target: number,
  smoothing: number = 0.18,
  snapThreshold: number = 0.001
): number {
  if (Math.abs(target - current) < snapThreshold) return target;
  return current + (target - current) * smoothing;
}

/**
 * 11. Interactive Microscope Loupe / Precision Magnifier Lens:
 * Renders a high-resolution circular magnified viewport focused on a target coordinate (targetX, targetY),
 * with reticle crosshairs, scale indicator, and glassmorphic bezel.
 */
export function drawMagnifierLoupe(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  targetX: number,
  targetY: number,
  lensX: number,
  lensY: number,
  options: {
    zoomFactor?: number;
    radius?: number;
    borderColor?: string;
    label?: string;
    renderContent?: (clipCtx: CanvasRenderingContext2D, cx: number, cy: number, r: number) => void;
  } = {}
) {
  const {
    zoomFactor = 2.5,
    radius = 56,
    borderColor = '#38bdf8',
    label = '2.5x ZOOM',
    renderContent,
  } = options;

  const dpr = window.devicePixelRatio || 1;
  const sourceWidth = (radius * 2) / zoomFactor;
  const sourceHeight = (radius * 2) / zoomFactor;
  const sourceX = targetX * dpr - (sourceWidth * dpr) / 2;
  const sourceY = targetY * dpr - (sourceHeight * dpr) / 2;

  ctx.save();

  // 1. Shadow for depth
  ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
  ctx.shadowBlur = 18;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 6;

  // 2. Circular clip region for lens
  ctx.beginPath();
  ctx.arc(lensX, lensY, radius, 0, Math.PI * 2);
  ctx.fillStyle = '#020617';
  ctx.fill();
  ctx.shadowBlur = 0; // reset shadow for contents

  ctx.save();
  ctx.clip();

  // 3. Draw contents (either custom vector renderer or magnified canvas slice)
  if (renderContent) {
    renderContent(ctx, lensX, lensY, radius);
  } else {
    try {
      ctx.drawImage(
        canvas,
        Math.max(0, sourceX),
        Math.max(0, sourceY),
        sourceWidth * dpr,
        sourceHeight * dpr,
        lensX - radius,
        lensY - radius,
        radius * 2,
        radius * 2
      );
    } catch {}
  }

  // Subtle glass optical sheen
  const glassGrad = ctx.createRadialGradient(
    lensX - radius * 0.35,
    lensY - radius * 0.35,
    radius * 0.1,
    lensX,
    lensY,
    radius
  );
  glassGrad.addColorStop(0, 'rgba(255, 255, 255, 0.12)');
  glassGrad.addColorStop(0.6, 'rgba(255, 255, 255, 0.01)');
  glassGrad.addColorStop(1, 'rgba(56, 189, 248, 0.15)');
  ctx.fillStyle = glassGrad;
  ctx.fillRect(lensX - radius, lensY - radius, radius * 2, radius * 2);

  // 4. Reticle Crosshair inside the lens
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
  ctx.lineWidth = 1;
  ctx.setLineDash([3, 3]);
  ctx.beginPath();
  ctx.moveTo(lensX - radius, lensY);
  ctx.lineTo(lensX + radius, lensY);
  ctx.moveTo(lensX, lensY - radius);
  ctx.lineTo(lensX, lensY + radius);
  ctx.stroke();
  ctx.setLineDash([]);

  // Center crosshair ring
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(lensX, lensY, 8, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore(); // end clip

  // 5. High-contrast metallic & neon bezel
  ctx.strokeStyle = borderColor;
  ctx.shadowColor = borderColor;
  ctx.shadowBlur = 10;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(lensX, lensY, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.shadowBlur = 0;

  // 6. Connecting dotted guide line from target to lens
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
  ctx.lineWidth = 1.2;
  ctx.setLineDash([3, 3]);
  ctx.beginPath();
  ctx.moveTo(targetX, targetY);
  ctx.lineTo(lensX, lensY);
  ctx.stroke();
  ctx.setLineDash([]);

  // Target anchor dot
  ctx.fillStyle = borderColor;
  ctx.beginPath();
  ctx.arc(targetX, targetY, 3.5, 0, Math.PI * 2);
  ctx.fill();

  // 7. Zoom label badge at bottom of lens
  if (label) {
    ctx.font = 'bold 9px monospace';
    const tw = ctx.measureText(label).width;
    const badgeW = tw + 10;
    const badgeH = 16;
    ctx.fillStyle = 'rgba(2, 6, 23, 0.9)';
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(lensX - badgeW / 2, lensY + radius - 8, badgeW, badgeH, 4);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(label, lensX, lensY + radius + 4);
  }

  ctx.restore();
}

// ============================================================================
// 8. PRIORITY 1: PREMIUM NEON GLOW & MULTI-LAYER CANVAS BLOOM ENGINE
// ============================================================================

export interface NeonStyleOptions {
  color: string;           // Base hex or rgb color (e.g. '#38bdf8', '#10b981', '#f59e0b')
  glowColor?: string;      // Optional outer aura color, defaults to color
  width?: number;          // Base stroke width (default: 3)
  glowBlur?: number;       // Shadow blur radius (default: 16)
  glowLayers?: number;     // Number of bloom passes (1, 2, or 3, default: 2)
  coreIntensity?: number;  // 0 to 1, strength of white-hot laser core (default: 0.8)
  dash?: number[];         // Optional line dash
}

/**
 * Draws a high-intensity neon laser line with multi-layer bloom and white core.
 */
export function drawNeonLine(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  options: NeonStyleOptions
) {
  const {
    color,
    glowColor = color,
    width = 3,
    glowBlur = 18,
    coreIntensity = 0.8,
    dash = [],
  } = options;

  ctx.save();
  if (dash.length > 0) ctx.setLineDash(dash);

  // 1. Broad Outer Bloom Halo
  ctx.save();
  ctx.shadowBlur = glowBlur * 1.5;
  ctx.shadowColor = glowColor;
  ctx.strokeStyle = glowColor;
  ctx.lineWidth = width * 2.2;
  ctx.globalAlpha = 0.28;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.restore();

  // 2. Focused Neon Core Glow
  ctx.save();
  ctx.shadowBlur = glowBlur;
  ctx.shadowColor = glowColor;
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.globalAlpha = 0.95;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.restore();

  // 3. White-Hot Energy Filament Core (Laser look)
  if (coreIntensity > 0 && width >= 2) {
    ctx.save();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = Math.max(1, width * 0.35);
    ctx.globalAlpha = coreIntensity;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.restore();
  }

  ctx.restore();
}

/**
 * Draws a glowing neon circle / ring with optional subtle radial atmospheric fill.
 */
export function drawNeonCircle(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  options: NeonStyleOptions & { withRadialAura?: boolean; fillOpacity?: number }
) {
  const {
    color,
    glowColor = color,
    width = 2.5,
    glowBlur = 16,
    coreIntensity = 0.7,
    withRadialAura = true,
    fillOpacity = 0.07,
  } = options;

  ctx.save();

  // 1. Atmospheric Ambient Radial Glow inside circle
  if (withRadialAura && radius > 10) {
    const grad = ctx.createRadialGradient(cx, cy, radius * 0.2, cx, cy, radius);
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(0.85, color.replace(')', `, ${fillOpacity})`).replace('rgb', 'rgba').replace('#', 'rgba('));
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  // 2. Wide Outer Bloom Rim
  ctx.save();
  ctx.shadowBlur = glowBlur * 1.4;
  ctx.shadowColor = glowColor;
  ctx.strokeStyle = glowColor;
  ctx.lineWidth = width * 2;
  ctx.globalAlpha = 0.35;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // 3. Primary Luminous Rim
  ctx.save();
  ctx.shadowBlur = glowBlur;
  ctx.shadowColor = glowColor;
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.globalAlpha = 1.0;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // 4. White-Hot Accent Edge
  if (coreIntensity > 0 && width >= 2) {
    ctx.save();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = Math.max(1, width * 0.3);
    ctx.globalAlpha = coreIntensity * 0.75;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  ctx.restore();
}

/**
 * Draws a glowing neon circular arc (e.g. for dynamic angle arcs θ).
 */
export function drawNeonArc(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number,
  anticlockwise: boolean,
  options: NeonStyleOptions
) {
  const {
    color,
    glowColor = color,
    width = 2.5,
    glowBlur = 14,
    coreIntensity = 0.75,
  } = options;

  ctx.save();

  // Outer Bloom
  ctx.save();
  ctx.shadowBlur = glowBlur * 1.3;
  ctx.shadowColor = glowColor;
  ctx.strokeStyle = glowColor;
  ctx.lineWidth = width * 2;
  ctx.globalAlpha = 0.35;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, startAngle, endAngle, anticlockwise);
  ctx.stroke();
  ctx.restore();

  // Core Glow
  ctx.save();
  ctx.shadowBlur = glowBlur;
  ctx.shadowColor = glowColor;
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.globalAlpha = 1;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, startAngle, endAngle, anticlockwise);
  ctx.stroke();
  ctx.restore();

  // Filament Core
  if (coreIntensity > 0) {
    ctx.save();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = Math.max(1, width * 0.35);
    ctx.globalAlpha = coreIntensity;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, startAngle, endAngle, anticlockwise);
    ctx.stroke();
    ctx.restore();
  }

  ctx.restore();
}

/**
 * Draws a flowing neon curve/path (e.g. harmonic sine/cosine wave or parabola)
 * with an optional animated traveling energy photon pulse.
 */
export function drawNeonWave(
  ctx: CanvasRenderingContext2D,
  points: { x: number; y: number }[],
  options: NeonStyleOptions & { progressFraction?: number }
) {
  if (points.length < 2) return;
  const {
    color,
    glowColor = color,
    width = 2.5,
    glowBlur = 16,
    coreIntensity = 0.8,
    progressFraction = 1,
  } = options;

  const count = Math.max(2, Math.floor(points.length * Math.min(1, Math.max(0, progressFraction))));

  ctx.save();

  const tracePath = () => {
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < count; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
  };

  // 1. Ambient Bloom Wave
  ctx.save();
  ctx.shadowBlur = glowBlur * 1.5;
  ctx.shadowColor = glowColor;
  ctx.strokeStyle = glowColor;
  ctx.lineWidth = width * 2.2;
  ctx.globalAlpha = 0.3;
  tracePath();
  ctx.stroke();
  ctx.restore();

  // 2. Focused Neon Wave
  ctx.save();
  ctx.shadowBlur = glowBlur;
  ctx.shadowColor = glowColor;
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.globalAlpha = 0.95;
  tracePath();
  ctx.stroke();
  ctx.restore();

  // 3. Crisp White Core Filament
  if (coreIntensity > 0) {
    ctx.save();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = Math.max(1, width * 0.32);
    ctx.globalAlpha = coreIntensity * 0.85;
    tracePath();
    ctx.stroke();
    ctx.restore();
  }

  // 4. Leading Photon Flare Head (Pulse where wave meets the current angle)
  if (count > 0 && count < points.length) {
    const head = points[count - 1];
    ctx.save();
    ctx.shadowBlur = 24;
    ctx.shadowColor = '#ffffff';
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(head.x, head.y, width * 1.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  ctx.restore();
}

// ============================================================================
// 9. PRIORITY 3: DAMPED HARMONIC SPRING OSCILLATOR (PHYSICAL INERTIAL DYNAMICS)
// ============================================================================

/**
 * Solves damped harmonic spring dynamics for natural physical follow-through:
 * m * a + c * v + k * (x - x_target) = 0
 */
export class SpringOscillator {
  current: number;
  target: number;
  velocity: number;
  stiffness: number; // k (spring constant)
  damping: number;   // c (viscous damping ratio)
  mass: number;      // m (inertia)

  constructor(initialValue: number = 0, stiffness = 150, damping = 14, mass = 1) {
    this.current = initialValue;
    this.target = initialValue;
    this.velocity = 0;
    this.stiffness = stiffness;
    this.damping = damping;
    this.mass = mass;
  }

  setTarget(target: number) {
    this.target = target;
  }

  snapTo(val: number) {
    this.current = val;
    this.target = val;
    this.velocity = 0;
  }

  addImpulse(impulseVelocity: number) {
    this.velocity += impulseVelocity;
  }

  step(dt: number = 0.016): number {
    // Clamp dt to avoid explosion on background tab throttling
    const safeDt = Math.min(dt, 0.05);
    const displacement = this.current - this.target;
    const springForce = -this.stiffness * displacement;
    const dampingForce = -this.damping * this.velocity;
    const acceleration = (springForce + dampingForce) / this.mass;

    this.velocity += acceleration * safeDt;
    this.current += this.velocity * safeDt;

    if (Math.abs(this.velocity) < 0.0005 && Math.abs(displacement) < 0.0005) {
      this.current = this.target;
      this.velocity = 0;
    }

    return this.current;
  }

  isSettled(tolerance: number = 0.008): boolean {
    return (
      Math.abs(this.current - this.target) < tolerance &&
      Math.abs(this.velocity) < tolerance
    );
  }
}

// ============================================================================
// 10. PRIORITY 8: CALCULUS FLUX PARTICLE ENGINE (RIEMANN ACCUMULATION PARTICLES)
// ============================================================================

export interface FluxParticle {
  progressT: number; // 0 to 1 along [lowerBound, upperBound]
  yRatio: number;    // 0 (axis) to 1 (curve)
  speed: number;     // advancement rate
  size: number;      // particle radius
  alpha: number;     // transparency
}

/**
 * Simulates micro-flux particles streaming beneath the curve f(t) into the
 * accumulated area reservoir, providing an intuitive visualization of
 * infinitesimal Riemann accumulation (f(t) dt).
 */
export class CalculusFluxEngine {
  private particles: FluxParticle[] = [];
  private readonly maxParticles: number;

  constructor(count = 50) {
    this.maxParticles = count;
    this.init();
  }

  private init() {
    this.particles = [];
    for (let i = 0; i < this.maxParticles; i++) {
      this.particles.push({
        progressT: Math.random(),
        yRatio: Math.random(),
        speed: 0.003 + Math.random() * 0.006,
        size: 1.2 + Math.random() * 2.0,
        alpha: 0.35 + Math.random() * 0.55,
      });
    }
  }

  public updateAndDraw(
    ctx: CanvasRenderingContext2D,
    lowerBoundA: number,
    upperBoundX: number,
    f: (t: number) => number,
    toScreen: (t: number, y: number) => { x: number; y: number },
    options: {
      isSweeping?: boolean;
      particleColor?: string;
    } = {}
  ) {
    if (upperBoundX <= lowerBoundA) return;
    const { isSweeping = false, particleColor = '#38bdf8' } = options;
    const speedMult = isSweeping ? 2.8 : 1.0;
    const span = upperBoundX - lowerBoundA;

    ctx.save();
    for (const p of this.particles) {
      // Advance particle position
      p.progressT += p.speed * speedMult;
      if (p.progressT > 1) {
        p.progressT = 0;
        p.yRatio = Math.random();
      }

      const t = lowerBoundA + p.progressT * span;
      const ft = f(t);
      const yVal = ft * p.yRatio;

      const pt = toScreen(t, yVal);
      const intensity = isSweeping ? 1.0 : p.alpha;

      // Glow halo
      ctx.shadowBlur = isSweeping ? 8 : 4;
      ctx.shadowColor = particleColor;
      ctx.fillStyle = particleColor;
      ctx.globalAlpha = intensity;

      ctx.beginPath();
      ctx.arc(pt.x, pt.y, isSweeping ? p.size * 1.3 : p.size, 0, Math.PI * 2);
      ctx.fill();

      // Velocity trail toward the curve
      ctx.strokeStyle = particleColor;
      ctx.lineWidth = 0.8;
      ctx.globalAlpha = intensity * 0.5;
      ctx.beginPath();
      ctx.moveTo(pt.x, pt.y);
      ctx.lineTo(pt.x, pt.y + (ft >= 0 ? 3 : -3));
      ctx.stroke();
    }
    ctx.restore();
  }
}

// ============================================================================
// 11. PRIORITY 9: CANVAS-ORIGIN EUREKA CELEBRATION DISPATCHER
// ============================================================================

export interface EurekaCelebrationOptions {
  origin?: { x: number; y: number }; // Normalized 0..1 viewport coordinates
  particleCount?: number;
  spread?: number;
  colors?: string[];
}

/**
 * Triggers a dual-stage micro-celebration burst anchored to the exact location of mathematical discovery.
 */
export function triggerEurekaCelebration(options: EurekaCelebrationOptions = {}) {
  const {
    origin = { x: 0.5, y: 0.5 },
    particleCount = 55,
    spread = 70,
    colors = ['#38bdf8', '#34d399', '#f59e0b', '#ec4899', '#a855f7', '#ffffff'],
  } = options;

  try {
    // Stage 1: Concentrated epicenter pop
    confetti({
      particleCount,
      spread,
      startVelocity: 36,
      origin,
      colors,
      scalar: 1.1,
      ticks: 180,
    });

    // Stage 2: Flanking fireworks
    setTimeout(() => {
      confetti({
        particleCount: Math.round(particleCount * 0.5),
        angle: 60,
        spread: 50,
        origin: { x: Math.max(0.1, origin.x - 0.18), y: origin.y },
        colors,
      });
      confetti({
        particleCount: Math.round(particleCount * 0.5),
        angle: 120,
        spread: 50,
        origin: { x: Math.min(0.9, origin.x + 0.18), y: origin.y },
        colors,
      });
    }, 180);
  } catch {}
}

