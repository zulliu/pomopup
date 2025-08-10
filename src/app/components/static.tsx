'use client';

import React, {
  useRef, useState, useEffect, forwardRef,
} from 'react';
import { RepeatWrapping } from 'three';
import {
  useLoader,
} from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import {
  OrbitControls, SoftShadows, pointLight, useTexture,
} from '@react-three/drei';
import { useGlobalState } from '../globalContext';

function Box(props) {
  // Load the required textures.
  const [colorMap, bumpMap, roughnessMap] = useTexture([
    '/hardwood2_diffuse2.jpg',
    // '/carpet.jpg',
    '/hardwood2_bump.jpg',
    '/hardwood2_roughness.jpg',
  ]);

  // Set wrapping and repeat for colorMap
  colorMap.wrapS = colorMap.wrapT = RepeatWrapping;
  colorMap.anisotropy = 4;
  colorMap.repeat.set(3, 5);
  colorMap.needsUpdate = true;

  // Set wrapping and repeat for bumpMap
  bumpMap.wrapS = bumpMap.wrapT = RepeatWrapping;
  bumpMap.anisotropy = 4;
  bumpMap.repeat.set(3, 5);
  bumpMap.needsUpdate = true;

  // Set wrapping and repeat for roughnessMap
  roughnessMap.wrapS = roughnessMap.wrapT = RepeatWrapping;
  roughnessMap.repeat.set(3, 5);
  roughnessMap.anisotropy = 4;

  const ref = useRef();
  return (
    <mesh
      {...props}
      ref={ref}
    >
      <boxGeometry args={[30, 0.1, 15]} />
      <meshStandardMaterial
        metalness={0}
        bumpScale={0.0002}
        map={colorMap}
        bumpMap={bumpMap}
        roughnessMap={roughnessMap}
      />
    </mesh>
  );
}

function Rug(props) {
  const { environmentSettings } = useGlobalState();

  const [colorMap] = useTexture([environmentSettings.rugTexture]);

  // Set wrapping and repeat for colorMap
  colorMap.wrapS = colorMap.wrapT = RepeatWrapping;
  colorMap.repeat.set(3, 1);

  // Hold state for hovered and clicked events
  return (
    <mesh
      {...props}
    >
      <boxGeometry args={[6.4, 0.1, 5]} />
      <meshStandardMaterial
        roughness={0.8}
        metalness={0}
        map={colorMap}
      />
    </mesh>
  );
}

function Lamp(props) {
  // Hold state for hovered and clicked events
  return (
    <mesh
      {...props}
    >
      <boxGeometry args={[0.8, 0.6, 0.8]} />
      <meshStandardMaterial
        roughness={0.8}
        metalness={0}
        color="#f9f1c0"
        emissive="#f9f1c0"
        emissiveIntensity={0.8}
      />
    </mesh>
  );
}

const Stand = function () {
  const gltf = useLoader(GLTFLoader, '/stand.gltf');

  useEffect(() => {
    if (gltf && gltf.scene) {
      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          child.receiveShadow = true;
          child.castShadow = true;
          if (child.material.map) {
            child.material.metalness = 0; // 0 means non-metallic
            child.material.roughness = 1; // 0.5 is mid-way between rough and smooth
          }
        }
      });
    }
  }, [gltf]);

  return <primitive object={gltf.scene} scale={0.1} position={[3.6, 0, -3]} rotation={[0, -Math.PI / 2, 0]} />;
};

function Wall(props) {
  const { environmentSettings } = useGlobalState();

  const [colorMap] = useTexture([environmentSettings.wallTexture]);

  colorMap.wrapS = colorMap.wrapT = RepeatWrapping;
  colorMap.anisotropy = 4;
  colorMap.repeat.set(1, 1);
  colorMap.needsUpdate = true;
  return (
    <mesh
      {...props}
    >
      <boxGeometry args={[25, 8, 0.1]} />
      <meshStandardMaterial
        map={colorMap}
        roughness={1}
        metalness={0}
      />
    </mesh>
  );
}

const Sofa = function () {
  const gltf = useLoader(GLTFLoader, '/sofa3.glb');
  const [colorMap] = useTexture(['/DisplacementMap.png']);

  // Set wrapping and repeat for colorMap
  colorMap.wrapS = colorMap.wrapT = RepeatWrapping;
  colorMap.repeat.set(40, 40);

  useEffect(() => {
    if (gltf && gltf.scene) {
      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          child.receiveShadow = true;
          child.castShadow = true;
          if (child.material.map) {
            child.material.metalness = 0; // non-metallic
            child.material.roughness = 1;
          }
        }
      });
    }
  }, [gltf, colorMap]);

  return <primitive object={gltf.scene} scale={0.1} position={[-0.2, 0, -3.5]} rotation={[0, Math.PI, 0]} />;
};

function RenderStatic({ isMobile = false }) {
  return (
    <>
      {/* Reduce shadow quality on mobile to prevent shader conflicts */}
      <SoftShadows size={isMobile ? 10 : 15} samples={isMobile ? 10 : 20} />

      <Box position={[1.2, -0.05, 0]} receiveShadow />
      <Rug position={[-0.1, 0, -4]} receiveShadow />
      <Wall position={[0, 4, -6]} />
      <Sofa />
      <Stand />
      <Lamp position={[3.6, 2.2, -3.1]} />

      <pointLight
        castShadow
        position={[4, 2.2, -3.1]}
        intensity={8}
        color="#ffeecc"
      />
      <ambientLight intensity={0.6} />
      <directionalLight
        color="#ffffff"
        castShadow
        position={[-0.5, 3, 1.5]}
        intensity={1.5}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight
        color="#ffffff"
        castShadow
        position={[0.5, 3, 1.5]}
        intensity={1.5}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <OrbitControls
        // makeDefault
        enablePan={false}
        enableZoom={false}
        target={isMobile ? [0, 1, 0] : [0, 0, 0]}  // Look at a higher point on mobile
        maxAzimuthAngle={isMobile ? Math.PI / 24 : Math.PI / 12}  // More restricted on mobile
        minAzimuthAngle={isMobile ? -Math.PI / 16 : -Math.PI / 8}  // More restricted on mobile
        minPolarAngle={isMobile ? Math.PI / 2.8 : Math.PI / 3}  // Slightly higher minimum angle
        maxPolarAngle={Math.PI / 2.5}
        rotateSpeed={0.2}
      />
    </>
  );
}
export default RenderStatic;
