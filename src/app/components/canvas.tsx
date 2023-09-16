import React, { useEffect } from 'react';
import {
  Canvas, useFrame, useLoader,
} from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { ACTIONS, reducer, initialState } from './stateManage';
import { useGlobalDispatch, useSetSceneHandlers, useGlobalState } from '../globalContext';
import RenderStatic from './static';

const Scene = function () {
  const gltf = useLoader(GLTFLoader, '/corgi.gltf');
  const tomato = useLoader(GLTFLoader, '/tomato.gltf');
  const setSceneHandlers = useSetSceneHandlers();
  const globalState = useGlobalState();
  const { showTomato, showTooltip } = globalState;
  const dispatch = useGlobalDispatch();

  const JUMP_VELOCITY = 0.1;
  const GRAVITY = 0.01;
  useEffect(() => {
    const handlers = {
      jump: () => {
        dispatch({ type: ACTIONS.JUMP });
        dispatch({ type: ACTIONS.SET_TOMATO_VISIBILITY, payload: false });
      },
      leave: () => {
        dispatch({ type: ACTIONS.LEAVE });
        dispatch({ type: ACTIONS.SET_TOMATO_VISIBILITY, payload: false });
      },
      back: () => {
        dispatch({ type: ACTIONS.BACK });
        dispatch({ type: ACTIONS.SET_TOMATO_VISIBILITY, payload: false });
      },
      reset: () => {
        dispatch({ type: ACTIONS.RESET });
        dispatch({ type: ACTIONS.SET_TOMATO_VISIBILITY, payload: false });
      },
      layDown: () => {
        dispatch({ type: ACTIONS.LAY_DOWN });
        dispatch({ type: ACTIONS.SET_TOMATO_VISIBILITY, payload: false });
      },
      standUp: () => {
        dispatch({ type: ACTIONS.STAND_UP });
        dispatch({ type: ACTIONS.SET_TOMATO_VISIBILITY, payload: false });
      },
      resetState: () => {
        dispatch({ type: ACTIONS.RESET_MESH_STATE });
      },
    };

    setSceneHandlers(handlers);
  }, [setSceneHandlers]);
  useFrame(() => {
    if (gltf && gltf.scene) {
      // Jumping Logic
      if (!globalState.leaving && !globalState.layingDown && !globalState.standingUp) {
        if (globalState.velocity && globalState.jumpCount < 3) {
          let newVelocity = globalState.velocity - GRAVITY;
          let newYPosition = globalState.yPosition + newVelocity;

          if (newYPosition <= 0) {
            newVelocity = JUMP_VELOCITY;
            newYPosition = 0;
            dispatch({ type: 'INCREMENT_JUMP_COUNT' });
          }
          gltf.scene.position.y = newYPosition / 2;
          dispatch({ type: 'UPDATE_JUMP', velocity: newVelocity, yPosition: newYPosition });
        }
      }

      // Leaving Logic
      if (globalState.leaving) {
        if (globalState.frameCount < 30) {
          gltf.scene.rotation.y += (Math.PI / 2) / 30;
          const newVelocity = JUMP_VELOCITY - GRAVITY * globalState.frameCount;
          let newYPosition = gltf.scene.position.y + newVelocity;
          if (newYPosition <= 0) {
            newYPosition = 0;
          }
          gltf.scene.position.y = newYPosition;
        } else if (globalState.frameCount < 180) {
          gltf.scene.position.x += 5 / 120;
          let newVelocity = globalState.velocity - GRAVITY;
          let newYPosition = globalState.yPosition + newVelocity / 2;
          if (newYPosition <= 0) {
            newVelocity = JUMP_VELOCITY;
            newYPosition = 0;
          }
          gltf.scene.position.y = newYPosition;
          dispatch({ type: 'UPDATE_JUMP', velocity: newVelocity, yPosition: newYPosition });
        }
        dispatch({ type: 'INCREMENT_FRAME' });
      }

      // Coming Back Logic
      if (globalState.comingBack) {
        gltf.scene.position.z = 0;
        if (globalState.frameCount <= 120) {
          gltf.scene.position.x -= 6.2 / 120;
          gltf.scene.rotation.y = -Math.PI / 2;
          let newVelocity = globalState.velocity - GRAVITY;
          let newYPosition = globalState.yPosition + newVelocity / 2;
          if (newYPosition <= 0) {
            newVelocity = JUMP_VELOCITY;
            newYPosition = 0;
          }
          gltf.scene.position.y = newYPosition;
          dispatch({ type: 'UPDATE_JUMP', velocity: newVelocity, yPosition: newYPosition });
        } else if (globalState.frameCount < 150) {
          gltf.scene.rotation.y += (Math.PI / 2) / 30;
          gltf.scene.position.y = 0;
        } else if (globalState.frameCount === 240) {
          // dispatch({ type: ACTIONS.RESET_MESH_STATE });
        }
        dispatch({ type: 'INCREMENT_FRAME' });
      }
      if (tomato && tomato.scene) {
        tomato.scene.visible = showTomato;
      }
      // Laying Down Logic
      if (globalState.layingDown && globalState.frameCount <= 540) {
        if (globalState.frameCount < 360) {
          // Jumping logic repeated every 30 frames
          const frameForJump = globalState.frameCount % 30;
          const newVelocity = JUMP_VELOCITY - GRAVITY * frameForJump;
          let newYPosition = gltf.scene.position.y + newVelocity / 4;
          if (newYPosition <= 0) {
            newYPosition = 0;
          }
          gltf.scene.rotation.y -= (Math.PI / 2) / 120;
          gltf.scene.position.y = newYPosition;
        } else if (globalState.frameCount > 450) {
          gltf.scene.position.y += 0.005;

          gltf.scene.rotation.x += (Math.PI / 2) / 90; // Reset the rotation to original state
        }
        if (globalState.frameCount === 540) {
          dispatch({ type: ACTIONS.TOGGLE_TOOLTIP, payload: { showTooltip: true } });
          dispatch({ type: ACTIONS.LAY_DOWN, payload: { layingDown: false } });
        }

        dispatch({ type: 'INCREMENT_FRAME' });
      }

      // Standing Up Logic
      if (globalState.standingUp && globalState.frameCount <= 120) {
        if (globalState.frameCount === 1) {
          dispatch({ type: ACTIONS.TOGGLE_TOOLTIP, payload: { showTooltip: false } });
        }
        if (globalState.frameCount < 90) {
          gltf.scene.rotation.x -= Math.PI / 180;
          gltf.scene.position.y -= 0.005;
        } else if (globalState.frameCount < 120) {
          const newVelocity = JUMP_VELOCITY - GRAVITY * globalState.frameCount;
          let newYPosition = gltf.scene.position.y + newVelocity;
          if (newYPosition <= 0) {
            newYPosition = 0;
          }
          gltf.scene.rotation.y -= (Math.PI / 2) / 30;
          gltf.scene.position.y = newYPosition;
        }
        dispatch({ type: 'INCREMENT_FRAME' });
        if (globalState.frameCount === 120) {
          // dispatch({ type: ACTIONS.RESET_MESH_STATE });
        }
      }

      // Reset Logic
      if (globalState.hasReset) {
        gltf.scene.position.x = globalState.position.x;
        gltf.scene.position.y = globalState.position.y;
        gltf.scene.position.z = globalState.position.z;
        gltf.scene.rotation.x = globalState.rotation.x;
        gltf.scene.rotation.y = globalState.rotation.y;
        dispatch({ type: 'RESET_APPLIED' });
      }
    }
  });

  // texture and shadow
  useEffect(() => {
    if (gltf && gltf.scene && tomato && tomato.scene) {
      tomato.scene.scale.set(0.7, 0.7, 0.7);
      tomato.scene.position.set(0, 1.5, 8.5);
      gltf.scene.add(tomato.scene);
      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          child.receiveShadow = true;
          child.castShadow = true;
          if (child.material) {
            child.material.metalness = 0; // 0 means non-metallic
            child.material.roughness = 0.9; // 0.5 is mid-way between rough and smooth
          }
        }
      });
    }
  }, [gltf]);

  return (
    <group position={[globalState.position.x, globalState.position.y, globalState.position.z]}>
      <primitive
        object={gltf.scene}
        scale={0.1}
        rotation={[0, globalState.rotation.y, 0]}
      >
        <Html
          position={[15, 15, 0]}
          distanceFactor={15}
        >
          {showTooltip
          && (
          <div>
            zzZZ
          </div>
          )}
        </Html>
      </primitive>
    </group>
  );
};

function RenderMain() {
  return (
    <Canvas
      id="main-canvas"
      dpr={[1, 2]}
      camera={{ position: [0, 2, 6] }}
      shadows="soft"
    >
      <Scene />
      <RenderStatic />
    </Canvas>
  );
}

export default RenderMain;
