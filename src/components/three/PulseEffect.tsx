
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useResponsive } from '../../hooks/use-responsive';

type PulseEffectProps = {
  color?: string;
  pulseRadius?: number;
};

const PulseEffect = ({ color = '#ffffff', pulseRadius = 12 }: PulseEffectProps) => {
  const mesh = useRef<THREE.Mesh>(null);
  const { isMobile } = useResponsive();
  
  useFrame(({ clock }) => {
    if (!mesh.current) {return;}
    // Use a slower animation speed on mobile for better performance
    const speed = isMobile ? 0.3 : 0.4;
    const t = clock.getElapsedTime() * speed;
    
    // Create multiple pulse waves
    const scale = ((t % 2) < 1) ? (t % 1) * pulseRadius : pulseRadius - (t % 1) * pulseRadius;
    mesh.current.scale.set(scale, scale, 1);
    
    // Fade opacity as it expands
    if (mesh.current.material instanceof THREE.Material) {
      mesh.current.material.opacity = 0.2 - (scale / pulseRadius) * (isMobile ? 0.1 : 0.15);
    }
  });
  
  return (
    <mesh ref={mesh} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -6]}>
      <ringGeometry args={[0.95, 1, isMobile ? 16 : 32]} />
      <meshBasicMaterial color={color} transparent opacity={0.2} />
    </mesh>
  );
};

export default PulseEffect;
