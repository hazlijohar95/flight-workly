
import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useResponsive } from '../../hooks/use-responsive';

type FloatingDotsProps = {
  count?: number;
};

const FloatingDots = ({ count = 20 }: FloatingDotsProps) => {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const { viewport } = useThree();
  const { isMobile } = useResponsive();
  
  // Create dots with random positions
  const dots = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      // Smaller radius for mobile
      const radius = isMobile ? (6 + Math.random() * 6) : (8 + Math.random() * 10);
      const angle = Math.random() * Math.PI * 2;
      temp.push({
        position: [
          Math.cos(angle) * radius, 
          Math.sin(angle) * radius, 
          -5 - Math.random() * 5
        ] as [number, number, number],
        // Slower animation speed on mobile for better performance
        speed: isMobile ? 0.1 + Math.random() * 0.2 : 0.2 + Math.random() * 0.3,
        size: isMobile ? 0.04 + Math.random() * 0.08 : 0.05 + Math.random() * 0.1,
        opacity: 0.3 + Math.random() * 0.5
      });
    }
    return temp;
  }, [count, isMobile]);
  
  useFrame(({ clock }) => {
    if (!mesh.current) return;
    
    const dummy = new THREE.Object3D();
    const time = clock.getElapsedTime();
    
    // Update each dot position with subtle floating animation
    dots.forEach((dot, i) => {
      const { position, speed, size } = dot;
      
      // Calculate new position with small movement - reduced movement on mobile
      const amplitude = isMobile ? 0.1 : 0.2;
      const x = position[0] + Math.sin(time * speed * 0.3) * amplitude;
      const y = position[1] + Math.cos(time * speed * 0.5) * amplitude;
      const z = position[2];
      
      // Set matrix for instanced mesh
      dummy.position.set(x, y, z);
      dummy.scale.set(size, size, size);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    
    // Update the instance matrix
    mesh.current.instanceMatrix.needsUpdate = true;
  });
  
  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, isMobile ? 6 : 8, isMobile ? 6 : 8]} />
      <meshBasicMaterial color="#FFFFFF" transparent opacity={0.6} />
    </instancedMesh>
  );
};

export default FloatingDots;
