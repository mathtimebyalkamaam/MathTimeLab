import React, { useMemo } from 'react';
import * as THREE from 'three';

interface LaserCuttingPlaneProps {
  tiltDeg: number;       // Elevation tilt angle θ (0° = horizontal, 90° = vertical)
  rollDeg: number;       // Roll tilt angle
  heightOffset: number;  // Vertical shift along Y axis (-2 to +2)
  size?: number;
}

export const LaserCuttingPlane: React.FC<LaserCuttingPlaneProps> = ({
  tiltDeg,
  rollDeg,
  heightOffset,
  size = 4.2,
}) => {
  const tiltRad = (tiltDeg * Math.PI) / 180;
  const rollRad = (rollDeg * Math.PI) / 180;

  // The plane in Three.js default orientation lies in XY plane (normal Z).
  // A horizontal cutting plane (tilt = 0) corresponds to normal along Y, so rotationX = Math.PI / 2.
  // When tilt changes, we rotate around X axis.
  const rotation: [number, number, number] = useMemo(() => {
    return [Math.PI / 2 + tiltRad, rollRad, 0];
  }, [tiltRad, rollRad]);

  const position: [number, number, number] = useMemo(() => {
    return [0, heightOffset, 0];
  }, [heightOffset]);

  return (
    <group position={position} rotation={rotation}>
      {/* Translucent Laser Plane Surface */}
      <mesh>
        <planeGeometry args={[size, size]} />
        <meshPhysicalMaterial
          color="#f43f5e"
          transmission={0.75}
          opacity={0.35}
          transparent={true}
          roughness={0.1}
          side={THREE.DoubleSide}
          emissive="#e11d48"
          emissiveIntensity={0.35}
        />
      </mesh>

      {/* Luminous Glowing Edge Frame */}
      <lineSegments>
        <edgesGeometry args={[new THREE.PlaneGeometry(size, size)]} />
        <lineBasicMaterial color="#f43f5e" linewidth={2} />
      </lineSegments>

      {/* Subtle Laser Grid Surface Lines */}
      <gridHelper
        args={[size, 10, '#f43f5e', '#fda4af']}
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0, 0.002]}
      />

      {/* Normal Vector Indicator Arrow */}
      <arrowHelper
        args={[new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0), 0.8, 0xf43f5e, 0.15, 0.1]}
      />
    </group>
  );
};
