import React, { useEffect, useRef } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import { useGlobalState } from '../globalContext';

const Corgi = React.memo((props) => {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF('/corgi.gltf');
  const { actions } = useAnimations(animations, group);
  const { currentAnimation } = useGlobalState();

  console.log('Corgi component rendered.', currentAnimation); // This will log when the component renders

  useEffect(() => {
    const action = actions[currentAnimation];

    if (action) {
      action.reset();
      action.setLoop(THREE.LoopOnce, 1); // The animation will only play once
      action.clampWhenFinished = true; // The animation will hold on the last frame
      action.play();
    }
    return () => {
      if (action) {
        action.stop();
      }
    };
  }, [currentAnimation, actions]);

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <mesh
          name="corgi"
          geometry={nodes.corgi.geometry}
          material={materials.Material_0}
          castShadow
          receiveShadow
        />
      </group>
    </group>
  );
});

export default Corgi;

useGLTF.preload('/corgi.gltf');
