
import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useResponsive } from '../hooks/use-responsive';

// Flowing particle stream component
const ParticleStream = ({ count = 100, color = '#FF4081', speed = 0.02, spread = 20, streamWidth = 4 }) => {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const { viewport } = useThree();
  
  // Create particles with initial positions
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 5 + Math.random() * spread;
      const offsetX = Math.cos(angle) * radius;
      const offsetY = Math.sin(angle) * radius;
      const offsetZ = (Math.random() - 0.5) * streamWidth;
      
      temp.push({
        position: [offsetX, offsetY, offsetZ] as [number, number, number],
        angle,
        radius,
        speed: speed * (0.7 + Math.random() * 0.6),
        size: 0.05 + Math.random() * 0.05,
        alpha: 0.3 + Math.random() * 0.5
      });
    }
    return temp;
  }, [count, spread, streamWidth, speed]);
  
  // Animation loop
  useFrame(({ clock }) => {
    if (!mesh.current) return;
    
    const dummy = new THREE.Object3D();
    const time = clock.getElapsedTime();
    
    // Update each particle position
    particles.forEach((particle, i) => {
      // Calculate wave-like motion
      const waveFactor = Math.sin(time * 0.2 + particle.angle * 2) * 0.3;
      
      // Update angle for circular motion
      particle.angle += particle.speed * 0.01;
      
      // Calculate new position with wave effect
      const x = Math.cos(particle.angle) * (particle.radius + waveFactor);
      const y = Math.sin(particle.angle) * (particle.radius + waveFactor);
      const z = particle.position[2];
      
      // Set matrix for instanced mesh
      dummy.position.set(x, y, z);
      dummy.scale.set(particle.size, particle.size, particle.size);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    
    // Update the instance matrix
    mesh.current.instanceMatrix.needsUpdate = true;
  });
  
  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 10, 10]} />
      <meshBasicMaterial color={color} transparent opacity={0.8} />
    </instancedMesh>
  );
};

// Floating avatar component with fade-in/fade-out
const FloatingAvatars = ({ count = 8 }) => {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const { viewport } = useThree();
  
  // Create a texture loader
  const textureLoader = useMemo(() => new THREE.TextureLoader(), []);
  
  // Pre-load avatar textures (using stored avatar paths or default)
  const avatarTextures = useMemo(() => {
    const textures = [];
    const avatarPaths = [
      '/lovable-uploads/1a6757c6-c20c-4f80-bf34-4d028160d6c8.png',
      '/lovable-uploads/350a6f2c-d389-4d7a-8d7a-32a341c540e4.png',
      '/lovable-uploads/6c8afcf7-37e4-4e23-8fe6-9198336e06bd.png',
      '/lovable-uploads/7974a8f3-eafe-4a53-9f87-454268c85953.png'
    ];
    
    for (let i = 0; i < count; i++) {
      const texturePath = avatarPaths[i % avatarPaths.length];
      const texture = textureLoader.load(texturePath);
      textures.push(texture);
    }
    return textures;
  }, [count, textureLoader]);
  
  // Create avatar animation data
  const avatarData = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      // Random starting position off-screen
      const entryAngle = Math.random() * Math.PI * 2;
      const exitAngle = entryAngle + Math.PI * (0.75 + Math.random() * 0.5);
      
      temp.push({
        textureIndex: i % avatarTextures.length,
        entryAngle,
        exitAngle,
        radius: 12 + Math.random() * 5,
        speed: 0.2 + Math.random() * 0.3,
        progress: Math.random(), // Random starting progress
        size: 0.7 + Math.random() * 0.5,
        rotationSpeed: (Math.random() - 0.5) * 0.01
      });
    }
    return temp;
  }, [count, avatarTextures.length]);
  
  // Create materials for each avatar
  const materials = useMemo(() => 
    avatarTextures.map(texture => {
      const material = new THREE.MeshBasicMaterial({ 
        map: texture,
        transparent: true,
        side: THREE.DoubleSide
      });
      return material;
    }), 
  [avatarTextures]);
  
  // Update animation
  useFrame(({ clock }) => {
    if (!mesh.current) return;
    
    const dummy = new THREE.Object3D();
    const time = clock.getElapsedTime();
    
    // Update each avatar
    avatarData.forEach((avatar, i) => {
      // Update progress
      avatar.progress += avatar.speed * 0.005;
      if (avatar.progress >= 1) avatar.progress = 0;
      
      // Calculate position based on progress
      const progressAngle = THREE.MathUtils.lerp(
        avatar.entryAngle, 
        avatar.exitAngle, 
        avatar.progress
      );
      
      // Calculate fade (visible in middle of journey)
      const opacity = Math.sin(avatar.progress * Math.PI);
      materials[avatar.textureIndex].opacity = opacity;
      
      // Position on circle path
      const x = Math.cos(progressAngle) * avatar.radius;
      const y = Math.sin(progressAngle) * avatar.radius;
      const z = -5 - Math.random() * 3;
      
      // Update instance matrix
      dummy.position.set(x, y, z);
      dummy.rotation.z = time * avatar.rotationSpeed;
      dummy.scale.set(avatar.size * opacity, avatar.size * opacity, 1);
      dummy.updateMatrix();
      
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  // Create avatar instances
  return (
    <group>
      {materials.map((material, index) => (
        <instancedMesh 
          key={index}
          args={[undefined, undefined, count]}
          ref={index === 0 ? mesh : undefined}
        >
          <planeGeometry args={[1, 1]} />
          <primitive object={material} attach="material" />
        </instancedMesh>
      ))}
    </group>
  );
};

// Radial pulse effect
const RadialPulse = ({ color = '#FF4081', pulseSpeed = 0.5 }) => {
  const mesh = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const t = clock.getElapsedTime();
    
    // Pulse scale based on sin wave
    const pulseScale = 1 + Math.sin(t * pulseSpeed) * 0.2;
    mesh.current.scale.set(pulseScale, pulseScale, 1);
    
    // Opacity fades in and out
    if (mesh.current.material instanceof THREE.Material) {
      mesh.current.material.opacity = 0.1 + Math.sin(t * pulseSpeed) * 0.05;
    }
  });
  
  return (
    <mesh ref={mesh} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -10]}>
      <ringGeometry args={[5, 5.1, 64]} />
      <meshBasicMaterial color={color} transparent opacity={0.15} />
    </mesh>
  );
};

// Shader wave effect
const ShaderWave = () => {
  const mesh = useRef<THREE.Mesh>(null);
  
  // Simple wave shader
  const waveShader = {
    uniforms: {
      time: { value: 0 },
      color: { value: new THREE.Color('#FF2D95') }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform vec3 color;
      varying vec2 vUv;
      
      void main() {
        float distance = length(vUv - 0.5);
        float wave = sin(distance * 20.0 - time * 2.0) * 0.5 + 0.5;
        float alpha = smoothstep(0.0, 0.5, wave) * 0.15 * smoothstep(1.0, 0.0, distance * 2.0);
        gl_FragColor = vec4(color, alpha);
      }
    `
  };
  
  // Update shader time uniform
  useFrame(({ clock }) => {
    if (!mesh.current || !(mesh.current.material instanceof THREE.ShaderMaterial)) return;
    mesh.current.material.uniforms.time.value = clock.getElapsedTime();
  });
  
  return (
    <mesh ref={mesh} position={[0, 0, -8]}>
      <planeGeometry args={[30, 30, 1, 1]} />
      <shaderMaterial 
        args={[waveShader]}
        transparent={true}
      />
    </mesh>
  );
};

const BackgroundCanvas = () => {
  const { isMobile } = useResponsive();
  
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas 
        camera={{ position: [0, 0, 15], fov: 50 }}
        style={{ pointerEvents: 'none' }}
        dpr={[1, 2]}
        frameloop="demand"
        performance={{ min: 0.1 }}
      >
        <ambientLight intensity={0.5} />
        
        {/* Main particle streams */}
        <ParticleStream 
          count={isMobile ? 50 : 120} 
          color="#FF2D95" 
          speed={0.03}
          spread={15}
        />
        <ParticleStream 
          count={isMobile ? 30 : 80} 
          color="#ffffff" 
          speed={0.01}
          spread={12}
          streamWidth={5}
        />
        
        {/* Floating avatars */}
        <FloatingAvatars count={isMobile ? 5 : 8} />
        
        {/* Radar pulse effect */}
        <RadialPulse color="#FF2D95" pulseSpeed={0.3} />
        <RadialPulse color="#ffffff" pulseSpeed={0.2} />
        
        {/* Shader wave effect for background */}
        <ShaderWave />
      </Canvas>
    </div>
  );
};

export default BackgroundCanvas;
