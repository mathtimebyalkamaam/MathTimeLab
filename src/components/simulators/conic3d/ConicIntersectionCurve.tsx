import React, { useMemo } from 'react';
import * as THREE from 'three';

interface ConicIntersectionCurveProps {
  tiltDeg: number;       // theta
  heightOffset: number;  // h
  apertureDeg: number;   // alpha
}

export const ConicIntersectionCurve: React.FC<ConicIntersectionCurveProps> = ({
  tiltDeg,
  heightOffset,
  apertureDeg,
}) => {
  const theta = (tiltDeg * Math.PI) / 180;
  const alpha = (apertureDeg * Math.PI) / 180;
  const h = heightOffset;

  // Generate 3D curve vertices by finding intersection of double cone and plane
  // Cone equation: x^2 + z^2 = (y * tan(alpha))^2
  // Cutting plane: normal n = (0, cos(theta), -sin(theta)), passing through (0, h, 0)
  // Equation of plane: (y - h) * cos(theta) - z * sin(theta) = 0
  // When theta = 0: y = h. Then x^2 + z^2 = (h * tan(alpha))^2 (Circle of radius |h| * tan(alpha))
  const linePoints = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const segments = 120;
    const tanAlpha = Math.tan(alpha);
    const cosTheta = Math.cos(theta);
    const sinTheta = Math.sin(theta);

    // Eccentricity e = sin(theta) / cos(alpha)
    // If cutting plane is horizontal (theta = 0)
    if (Math.abs(theta) < 0.02) {
      const r = Math.abs(h) * tanAlpha;
      if (r > 0.01) {
        for (let i = 0; i <= segments; i++) {
          const phi = (i / segments) * Math.PI * 2;
          points.push(new THREE.Vector3(Math.cos(phi) * r, h, Math.sin(phi) * r));
        }
      }
      return points;
    }

    // Parametric evaluation on cutting plane:
    // Let plane coordinate u be horizontal (along X), v along tilt
    // In 3D:
    // X = u
    // Y = h + v * sin(theta)
    // Z = -v * cos(theta)
    // Intersection with cone: X^2 + Z^2 = Y^2 * tan^2(alpha)
    // u^2 + v^2 * cos^2(theta) = (h + v * sin(theta))^2 * tan^2(alpha)
    // u^2 + v^2 * (cos^2(theta) - sin^2(theta) * tan^2(alpha)) - 2 * h * v * sin(theta) * tan^2(alpha) = h^2 * tan^2(alpha)
    // Let A = cos^2(theta) - sin^2(theta) * tan^2(alpha)
    // B = -2 * h * sin(theta) * tan^2(alpha)
    // C = -h^2 * tan^2(alpha)
    // Then for any v, u = +/- sqrt( - A*v^2 - B*v - C )
    const k = tanAlpha;
    const k2 = k * k;
    const cos2 = cosTheta * cosTheta;
    const sin2 = sinTheta * sinTheta;
    const A = cos2 - sin2 * k2;
    const B = -2 * h * sinTheta * k2;
    const C = -h * h * k2;

    // Determine range of v based on discriminant or curve type
    // If A > 0 (Ellipse/Circle): A*v^2 + B*v + C <= 0
    // Root bounds for v:
    const disc = B * B - 4 * A * C;

    if (A > 0.03 && disc >= 0) {
      // Ellipse closed loop
      const sqrtDisc = Math.sqrt(disc);
      const vMin = (-B - sqrtDisc) / (2 * A);
      const vMax = (-B + sqrtDisc) / (2 * A);

      // Upper half of loop
      for (let i = 0; i <= segments / 2; i++) {
        const t = i / (segments / 2);
        const v = vMin + t * (vMax - vMin);
        const u2 = -(A * v * v + B * v + C);
        const u = u2 > 0 ? Math.sqrt(u2) : 0;
        const worldX = u;
        const worldY = h + v * sinTheta;
        const worldZ = -v * cosTheta;
        points.push(new THREE.Vector3(worldX, worldY, worldZ));
      }
      // Lower half of loop
      for (let i = segments / 2; i >= 0; i--) {
        const t = i / (segments / 2);
        const v = vMin + t * (vMax - vMin);
        const u2 = -(A * v * v + B * v + C);
        const u = u2 > 0 ? -Math.sqrt(u2) : 0;
        const worldX = u;
        const worldY = h + v * sinTheta;
        const worldZ = -v * cosTheta;
        points.push(new THREE.Vector3(worldX, worldY, worldZ));
      }
    } else if (Math.abs(A) <= 0.03) {
      // Parabola (single open curve)
      // v = -(u^2 + C) / B
      const uMax = 1.6;
      for (let i = -segments / 2; i <= segments / 2; i++) {
        const u = (i / (segments / 2)) * uMax;
        if (Math.abs(B) > 0.001) {
          const v = -(u * u + C) / B;
          const worldX = u;
          const worldY = h + v * sinTheta;
          const worldZ = -v * cosTheta;
          if (Math.abs(worldY) < 2.5) {
            points.push(new THREE.Vector3(worldX, worldY, worldZ));
          }
        }
      }
    } else {
      // Hyperbola (A < 0) - two open branches
      // Trace branch within bounding box
      const vLimit = 2.0;
      for (let i = -segments / 2; i <= segments / 2; i++) {
        const v = (i / (segments / 2)) * vLimit;
        const u2 = -(A * v * v + B * v + C);
        if (u2 >= 0) {
          const u = Math.sqrt(u2);
          const worldX = u;
          const worldY = h + v * sinTheta;
          const worldZ = -v * cosTheta;
          if (Math.abs(worldY) < 2.5) {
            points.push(new THREE.Vector3(worldX, worldY, worldZ));
          }
        }
      }
      for (let i = segments / 2; i >= -segments / 2; i--) {
        const v = (i / (segments / 2)) * vLimit;
        const u2 = -(A * v * v + B * v + C);
        if (u2 >= 0) {
          const u = -Math.sqrt(u2);
          const worldX = u;
          const worldY = h + v * sinTheta;
          const worldZ = -v * cosTheta;
          if (Math.abs(worldY) < 2.5) {
            points.push(new THREE.Vector3(worldX, worldY, worldZ));
          }
        }
      }
    }

    return points;
  }, [theta, alpha, h]);

  const curveGeometry = useMemo(() => {
    if (linePoints.length < 2) return null;
    const curve = new THREE.CatmullRomCurve3(linePoints);
    return new THREE.TubeGeometry(curve, 64, 0.025, 8, false);
  }, [linePoints]);

  if (!curveGeometry) return null;

  return (
    <mesh geometry={curveGeometry}>
      <meshBasicMaterial color="#38bdf8" />
    </mesh>
  );
};
