
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useResponsive } from '../hooks/use-responsive';

// Floating particles component
const Particles = ({ count = 100, color = '#FF4081' }) => {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const particles = useRef<{ position: [number, number, number], speed: number }[]>([]);
  
  // Initialize particles with random positions
  if (particles.current.length === 0) {
    for (let i = 0; i < count; i++) {
      particles.current.push({
        position: [
          Math.random() * 20 - 10,
          Math.random() * 20 - 10,
          Math.random() * 10 - 15
        ],
        speed: Math.random() * 0.02 + 0.01
      });
    }
  }
  
  // Animation loop
  useFrame(() => {
    if (!mesh.current) return;
    
    const dummy = new THREE.Object3D();
    
    // Update each particle position
    particles.current.forEach((particle, i) => {
      // Move particle slightly based on its speed
      particle.position[1] += particle.speed;
      
      // Reset position if particle goes too far
      if (particle.position[1] > 10) {
        particle.position[1] = -10;
        particle.position[0] = Math.random() * 20 - 10;
      }
      
      // Set matrix for instanced mesh
      dummy.position.set(...particle.position);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    
    mesh.current.instanceMatrix.needsUpdate = true;
  });
  
  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.05, 10, 10]} />
      <meshBasicMaterial color={color} transparent opacity={0.6} />
    </instancedMesh>
  );
};

// Floating orbit ring
const OrbitRing = () => {
  const mesh = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (!mesh.current) return;
    // Gentle rotation animation
    mesh.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.3) * 0.2;
    mesh.current.rotation.y = Math.cos(clock.getElapsedTime() * 0.2) * 0.3;
  });
  
  return (
    <mesh ref={mesh} position={[0, 0, -5]} rotation={[0, 0, 0]}>
      <torusGeometry args={[5, 0.1, 16, 100]} />
      <meshBasicMaterial color="#121212" transparent opacity={0.3} />
    </mesh>
  );
};

const BackgroundCanvas = () => {
  const { isMobile } = useResponsive();
  
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ pointerEvents: 'none' }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.5} />
        <Particles count={isMobile ? 50 : 100} />
        <OrbitRing />
      </Canvas>
    </div>
  );
};

export default BackgroundCanvas;
