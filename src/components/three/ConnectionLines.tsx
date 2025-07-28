
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

type ConnectionLinesProps = {
  reduced?: boolean;
};

const ConnectionLines = ({ reduced = false }: ConnectionLinesProps) => {
  const lineRef = useRef<THREE.LineSegments>(null);
  
  const points = useMemo(() => {
    const count = reduced ? 8 : 12;
    const vertices = [];
    const radius = reduced ? 8 : 12;
    
    // Create a series of connected points in a circular pattern
    for (let i = 0; i < count; i++) {
      const angle1 = (i / count) * Math.PI * 2;
      const angle2 = ((i + 1) / count) * Math.PI * 2;
      
      vertices.push(
        Math.cos(angle1) * radius, Math.sin(angle1) * radius, -7,
        Math.cos(angle2) * radius, Math.sin(angle2) * radius, -7
      );
    }
    
    return new Float32Array(vertices);
  }, [reduced]);
  
  useFrame(({ clock }) => {
    if (!lineRef.current) {return;}
    
    const time = clock.getElapsedTime();
    lineRef.current.rotation.z = time * (reduced ? 0.03 : 0.05);
  });
  
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(points, 3));
    return geo;
  }, [points]);
  
  return (
    <lineSegments ref={lineRef}>
      <primitive object={geometry} />
      <lineBasicMaterial color="#FF2D95" transparent opacity={reduced ? 0.15 : 0.2} />
    </lineSegments>
  );
};

export default ConnectionLines;
