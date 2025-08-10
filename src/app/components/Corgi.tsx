import React, { useEffect, useRef } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import { useFrame, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useGlobalState, useGlobalDispatch } from '../globalContext';
import { ACTIONS } from './stateManage';

// Separate Tomato component that follows the dog
function Tomato({ parent, visible }) {
  const tomato = useLoader(GLTFLoader, '/tomato.gltf');
  const ref = useRef();

  useFrame(() => {
    if (ref.current && parent) {
      // Get world position and rotation of parent
      const worldPos = new THREE.Vector3();
      const worldQuat = new THREE.Quaternion();
      const worldScale = new THREE.Vector3();

      parent.getWorldPosition(worldPos);
      parent.getWorldQuaternion(worldQuat);
      parent.getWorldScale(worldScale);

      // Apply parent's rotation to tomato
      ref.current.quaternion.copy(worldQuat);

      // Calculate offset position relative to dog's rotation
      const offset = new THREE.Vector3(0, 0.15, 0.85);
      offset.applyQuaternion(worldQuat);

      // Set final position
      ref.current.position.copy(worldPos).add(offset);
    }
  });

  if (!tomato) return null;

  return (
    <primitive
      ref={ref}
      object={tomato.scene.clone()}
      scale={[0.07, 0.07, 0.07]} // Original 0.7 * parent scale 0.1 = 0.07
      visible={visible}
    />
  );
}

const Corgi = React.memo((props) => {
  const group = useRef();
  const corgiRef = useRef();
  const { nodes, materials, animations } = useGLTF('/corgi.gltf');
  const { actions, mixer } = useAnimations(animations, group);
  const { currentAnimation, showTomato } = useGlobalState();
  const dispatch = useGlobalDispatch();

  // Setup animation playback
  useEffect(() => {
    const action = actions[currentAnimation];

    if (action) {
      // Reset and play the animation
      action.reset();
      action.fadeIn(0.5);

      // Configure based on animation type
      if (currentAnimation === 'idle') {
        action.setLoop(THREE.LoopRepeat, Infinity);
      } else {
        action.setLoop(THREE.LoopOnce, 1);
        action.clampWhenFinished = true;
      }

      action.play();

      // Return cleanup
      return () => {
        action.fadeOut(0.5);
      };
    }
  }, [currentAnimation, actions]);

  // Listen for animation finished events
  useEffect(() => {
    if (!mixer) return;

    const handleFinished = (e) => {
      // Only auto-return to idle for back and up animations
      // leave and lay should stay at their final frame
      if (currentAnimation === 'back' || currentAnimation === 'up') {
        dispatch({ type: ACTIONS.SET_ANIMATION, payload: 'idle' });
      }
    };

    mixer.addEventListener('finished', handleFinished);
    return () => {
      mixer.removeEventListener('finished', handleFinished);
    };
  }, [mixer, currentAnimation, dispatch]);

  return (
    <>
      <group ref={group} {...props} dispose={null}>
        <group name="Scene">
          <mesh
            ref={corgiRef}
            name="corgi"
            geometry={nodes.corgi.geometry}
            material={materials.Material_0}
            castShadow
            receiveShadow
          />
        </group>
      </group>
      {/* Render tomato as separate object that tracks the dog */}
      <Tomato parent={corgiRef.current} visible={showTomato} />
    </>
  );
});

export default Corgi;

useGLTF.preload('/corgi.gltf');
