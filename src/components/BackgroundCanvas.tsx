
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { useResponsive } from '../hooks/use-responsive';
import FlowingGrid from './three/FlowingGrid';
import PulseEffect from './three/PulseEffect';
import FloatingDots from './three/FloatingDots';
import ConnectionLines from './three/ConnectionLines';

const BackgroundCanvas = () => {
  const { isMobile } = useResponsive();
  
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas 
        camera={{ position: [0, 0, 15], fov: isMobile ? 60 : 50 }}
        style={{ pointerEvents: 'none' }}
        dpr={isMobile ? [1, 1.2] : [1, 1.5]} 
        frameloop="demand"
        performance={{ min: 0.1, max: isMobile ? 0.3 : 0.5 }}
      >
        {/* Flowing grid points */}
        <FlowingGrid 
          count={isMobile ? 10 : 20}
          color="#FF2D95"
          size={isMobile ? 0.05 : 0.04}
        />
        
        {/* Pulse effect */}
        <PulseEffect color="#ffffff" pulseRadius={isMobile ? 10 : 15} />
        <PulseEffect color="#FF2D95" pulseRadius={isMobile ? 8 : 12} />
        
        {/* Floating dots */}
        <FloatingDots count={isMobile ? 15 : 30} />
        
        {/* Connection lines */}
        <ConnectionLines reduced={isMobile} />
      </Canvas>
    </div>
  );
};

export default BackgroundCanvas;
