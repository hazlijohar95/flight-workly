
import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

type FlowingGridProps = {
  count?: number;
  color?: string;
  size?: number;
};

const FlowingGrid = ({ count = 30, color = '#FF2D95', size = 0.05 }: FlowingGridProps) => {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const { viewport } = useThree();
  
  // Create grid points with initial positions
  const points = useMemo(() => {
    const temp = [];
    const step = 2; // Grid spacing
    
    for (let x = -count/2; x < count/2; x++) {
      for (let y = -count/2; y < count/2; y++) {
        temp.push({
          position: [x * step, y * step, 0] as [number, number, number],
          speed: 0.2 + Math.random() * 0.3,
          offset: Math.random() * Math.PI * 2,
          scale: 0.5 + Math.random() * 0.5,
          opacity: 0.2 + Math.random() * 0.3
        });
      }
    }
    return temp;
  }, [count]);
  
  // Animation loop
  useFrame(({ clock }) => {
    if (!mesh.current) return;
    
    const dummy = new THREE.Object3D();
    const time = clock.getElapsedTime();
    
    // Update each grid point
    points.forEach((point, i) => {
      const { position, speed, offset, scale } = point;
      
      // Calculate wave effect
      const z = Math.sin(time * speed + offset) * 0.5;
      
      // Set matrix for instanced mesh
      dummy.position.set(position[0], position[1], z);
      dummy.scale.set(scale * size, scale * size, 1);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    
    // Update the instance matrix
    mesh.current.instanceMatrix.needsUpdate = true;
  });
  
  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, points.length]}>
      <circleGeometry args={[1, 6]} />
      <meshBasicMaterial color={color} transparent opacity={0.8} />
    </instancedMesh>
  );
};

export default FlowingGrid;
