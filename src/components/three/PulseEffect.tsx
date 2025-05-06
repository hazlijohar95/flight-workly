
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

type PulseEffectProps = {
  color?: string;
  pulseRadius?: number;
};

const PulseEffect = ({ color = '#ffffff', pulseRadius = 12 }: PulseEffectProps) => {
  const mesh = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const t = clock.getElapsedTime() * 0.4;
    
    // Create multiple pulse waves
    const scale = ((t % 2) < 1) ? (t % 1) * pulseRadius : pulseRadius - (t % 1) * pulseRadius;
    mesh.current.scale.set(scale, scale, 1);
    
    // Fade opacity as it expands
    if (mesh.current.material instanceof THREE.Material) {
      mesh.current.material.opacity = 0.2 - (scale / pulseRadius) * 0.15;
    }
  });
  
  return (
    <mesh ref={mesh} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -6]}>
      <ringGeometry args={[0.95, 1, 32]} />
      <meshBasicMaterial color={color} transparent opacity={0.2} />
    </mesh>
  );
};

export default PulseEffect;
