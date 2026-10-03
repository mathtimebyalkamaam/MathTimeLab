/**
 * canvasFx.ts: High-Performance Canvas & Interaction Physics Utilities
 * Implements:
 * 1. Synchronized Equation Term Highlighting
 * 2. Transient Ghost Trails (Motion History)
 * 3. Magnetic Landmark Snapping with Haptic Ticks
 * 4. Direct On-Canvas Hover Rings & Pulsing Affordances
 */

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
  } = {}
) {
  const {
    zoomFactor = 2.5,
    radius = 56,
    borderColor = '#38bdf8',
    label = '2.5x ZOOM',
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

  // 3. Draw magnified section of canvas
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

  // 5. High-contrast metallic bezel
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(lensX, lensY, radius, 0, Math.PI * 2);
  ctx.stroke();

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
