import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGlobalState } from '../globalContext';
import ItemsScene from './ItemsScene';
import RenderStatic from './static';
import Corgi from './Corgi';

interface RenderMainProps {
  layoutInfo?: {
    mode: 'landscape' | 'portrait' | 'mobile';
    aspectRatio: number;
    isMobile: boolean;
    canvasHeightPercent: number;
  };
}

function RenderMain({ layoutInfo }: RenderMainProps) {
  const globalState = useGlobalState();
  const { userItems } = globalState;

  // Use layout info from parent, with fallback
  const isMobile = layoutInfo?.isMobile ?? false;
  const isPortrait = layoutInfo?.mode === 'portrait' || layoutInfo?.mode === 'mobile';

  return (
    <Canvas
      key={isMobile ? 'mobile' : 'desktop'} // Force re-mount on mode change
      id="main-canvas"
      dpr={[1, 2]}
      camera={{
        position: isPortrait ? [0, 1, 4.5] : [0, 2, 6],
        fov: isPortrait ? 55 : 75,
      }}
      shadows="soft"
      gl={{ antialias: true, alpha: true }}
    >
      <RenderStatic isMobile={isPortrait} />
      <Corgi scale={0.1} />
      <ItemsScene items={userItems} />
    </Canvas>
  );
}

export default RenderMain;
