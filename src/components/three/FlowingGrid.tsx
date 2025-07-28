
import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useResponsive } from '../../hooks/use-responsive';

type FlowingGridProps = {
  count?: number;
  color?: string;
  size?: number;
};

const FlowingGrid = ({ count = 30, color = '#FF2D95', size = 0.05 }: FlowingGridProps): JSX.Element => {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const { viewport: _viewport } = useThree();
  const { isMobile } = useResponsive();
  
  // Create grid points with initial positions
  const points = useMemo(() => {
    const temp = [];
    const step = isMobile ? 1.5 : 2; // Tighter grid spacing on mobile
    
    for (let x = -count/2; x < count/2; x++) {
      for (let y = -count/2; y < count/2; y++) {
        temp.push({
          position: [x * step, y * step, 0] as [number, number, number],
          // Slower animation speed on mobile for better performance
          speed: isMobile ? 0.1 + Math.random() * 0.2 : 0.2 + Math.random() * 0.3,
          offset: Math.random() * Math.PI * 2,
          scale: 0.5 + Math.random() * 0.5,
          opacity: 0.2 + Math.random() * 0.3
        });
      }
    }
    return temp;
  }, [count, isMobile]);
  
  // Animation loop
  useFrame(({ clock }) => {
    if (!mesh.current) {
      return;
    }
    
    const dummy = new THREE.Object3D();
    const time = clock.getElapsedTime();
    
    // Update each grid point
    points.forEach((point, i) => {
      const { position, speed, offset, scale } = point;
      
      // Calculate wave effect - smaller amplitude on mobile
      const amplitude = isMobile ? 0.3 : 0.5;
      const z = Math.sin(time * speed + offset) * amplitude;
      
      // Set matrix for instanced mesh
      dummy.position.set(position[0], position[1], z);
      dummy.scale.set(scale * size, scale * size, 1);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    
    // Update the instance matrix
    mesh.current.instanceMatrix.needsUpdate = true;
  });
  
  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, points.length]}>
      <circleGeometry args={[1, isMobile ? 5 : 6]} />
      <meshBasicMaterial color={color} transparent opacity={isMobile ? 0.7 : 0.8} />
    </instancedMesh>
  );
};

export default FlowingGrid;
