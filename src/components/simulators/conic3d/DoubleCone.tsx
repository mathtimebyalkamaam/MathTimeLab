import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface DoubleConeProps {
  apertureRad: number; // semi-vertical angle in radians
  height?: number;
  wireframe?: boolean;
}

export const DoubleCone: React.FC<DoubleConeProps> = ({
  apertureRad,
  height = 2.4,
  wireframe = false,
}) => {
  const radius = Math.tan(apertureRad) * height;

  // Custom Double Cone geometry (Upper nappe pointing up from origin, Lower nappe pointing down from origin)
  const coneGeometry = useMemo(() => {
    // Upper cone: base at y = height, apex at y = 0
    const upperGeo = new THREE.ConeGeometry(radius, height, 48, 16, true);
    // Lower cone: base at y = -height, apex at y = 0
    const lowerGeo = new THREE.ConeGeometry(radius, height, 48, 16, true);

    // In Three.js, default ConeGeometry is centered at y = 0 with height h, apex at y = h/2, base at y = -h/2
    // For upper cone: apex at origin (y = 0), base at y = +height
    upperGeo.rotateX(Math.PI); // invert so apex is at bottom
    upperGeo.translate(0, height / 2, 0);

    // For lower cone: apex at origin (y = 0), base at y = -height
    lowerGeo.translate(0, -height / 2, 0);

    return { upperGeo, lowerGeo };
  }, [radius, height]);

  return (
    <group>
      {/* Upper Nappe */}
      <mesh geometry={coneGeometry.upperGeo}>
        <meshPhysicalMaterial
          color="#38bdf8"
          transmission={0.88}
          opacity={0.85}
          transparent={true}
          roughness={0.15}
          ior={1.3}
          thickness={0.5}
          side={THREE.DoubleSide}
          wireframe={wireframe}
          emissive="#0284c7"
          emissiveIntensity={0.25}
        />
      </mesh>

      {/* Lower Nappe */}
      <mesh geometry={coneGeometry.lowerGeo}>
        <meshPhysicalMaterial
          color="#818cf8"
          transmission={0.88}
          opacity={0.85}
          transparent={true}
          roughness={0.15}
          ior={1.3}
          thickness={0.5}
          side={THREE.DoubleSide}
          wireframe={wireframe}
          emissive="#4338ca"
          emissiveIntensity={0.25}
        />
      </mesh>

      {/* Central Apex Glow Marker */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Rim Rings for visual clarity */}
      <mesh position={[0, height, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.015, 16, 48]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.8} />
      </mesh>
      <mesh position={[0, -height, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.015, 16, 48]} />
        <meshBasicMaterial color="#818cf8" transparent opacity={0.8} />
      </mesh>

      {/* Central Axis Line (Z/Y Axis) */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array([0, -height * 1.25, 0, 0, height * 1.25, 0]), 3]}
          />
        </bufferGeometry>
        <lineDashedMaterial color="#64748b" dashSize={0.1} gapSize={0.05} />
      </line>
    </group>
  );
};
