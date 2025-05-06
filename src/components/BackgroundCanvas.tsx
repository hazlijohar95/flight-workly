
import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useResponsive } from '../hooks/use-responsive';

// Flowing grid component
const FlowingGrid = ({ count = 30, color = '#FF2D95', size = 0.05 }) => {
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

// Minimalist pulse effect
const PulseEffect = ({ color = '#ffffff', pulseRadius = 12 }) => {
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

// Floating dot component
const FloatingDots = ({ count = 20 }) => {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const { viewport } = useThree();
  
  // Create dots with random positions
  const dots = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const radius = 8 + Math.random() * 10;
      const angle = Math.random() * Math.PI * 2;
      temp.push({
        position: [
          Math.cos(angle) * radius, 
          Math.sin(angle) * radius, 
          -5 - Math.random() * 5
        ] as [number, number, number],
        speed: 0.2 + Math.random() * 0.3,
        size: 0.05 + Math.random() * 0.1,
        opacity: 0.3 + Math.random() * 0.5
      });
    }
    return temp;
  }, [count]);
  
  useFrame(({ clock }) => {
    if (!mesh.current) return;
    
    const dummy = new THREE.Object3D();
    const time = clock.getElapsedTime();
    
    // Update each dot position with subtle floating animation
    dots.forEach((dot, i) => {
      const { position, speed, size } = dot;
      
      // Calculate new position with small movement
      const x = position[0] + Math.sin(time * speed * 0.3) * 0.2;
      const y = position[1] + Math.cos(time * speed * 0.5) * 0.2;
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
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color="#FFFFFF" transparent opacity={0.6} />
    </instancedMesh>
  );
};

// Connection lines between dots
const ConnectionLines = () => {
  const lineRef = useRef<THREE.LineSegments>(null);
  
  const points = useMemo(() => {
    const count = 12;
    const vertices = [];
    const radius = 12;
    
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
  }, []);
  
  useFrame(({ clock }) => {
    if (!lineRef.current) return;
    
    const time = clock.getElapsedTime();
    lineRef.current.rotation.z = time * 0.05;
  });
  
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(points, 3));
    return geo;
  }, [points]);
  
  return (
    <lineSegments ref={lineRef}>
      <primitive object={geometry} />
      <lineBasicMaterial color="#FF2D95" transparent opacity={0.2} />
    </lineSegments>
  );
};

const BackgroundCanvas = () => {
  const { isMobile } = useResponsive();
  
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas 
        camera={{ position: [0, 0, 15], fov: 50 }}
        style={{ pointerEvents: 'none' }}
        dpr={[1, 1.5]} 
        frameloop="demand"
        performance={{ min: 0.1, max: 0.5 }}
      >
        {/* Flowing grid points */}
        <FlowingGrid 
          count={isMobile ? 10 : 20}
          color="#FF2D95"
          size={0.04}
        />
        
        {/* Pulse effect */}
        <PulseEffect color="#ffffff" pulseRadius={15} />
        <PulseEffect color="#FF2D95" pulseRadius={12} />
        
        {/* Floating dots */}
        <FloatingDots count={isMobile ? 15 : 30} />
        
        {/* Connection lines */}
        <ConnectionLines />
      </Canvas>
    </div>
  );
};

export default BackgroundCanvas;
