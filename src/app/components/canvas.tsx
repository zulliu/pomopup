import React, { useEffect, useRef, useState } from 'react';
import {
  Canvas, useFrame, useLoader,
} from '@react-three/fiber';
import { Html, Stats } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { ACTIONS } from './stateManage';
import { useGlobalDispatch, useSetSceneHandlers, useGlobalState } from '../globalContext';
import ItemsScene from './ItemsScene';
import RenderStatic from './static';
import Corgi from './Corgi';

const tomatoPosition = {
  corgi: [0, 1.5, 8.5],
  collie: [0.5, 3, 11.5],
};

const Scene = function () {
  const {
    leaving,
    layingDown,
    standingUp,
    position,
    rotation,
    hasReset,
    isJumping,
    comingBack,
    showTomato,
    showTooltip,
  } = useGlobalState();
  const dispatch = useGlobalDispatch();
  const { dogMesh } = useGlobalState();
  const frameCountRef = useRef(0);
  const [tooltipText, setTooltipText] = useState('zzZZ');

  const gltf = useLoader(GLTFLoader, `${dogMesh}.gltf`);
  const tomato = useLoader(GLTFLoader, '/tomato.gltf');
  const setSceneHandlers = useSetSceneHandlers();
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

  const resetFrameCount = () => {
    frameCountRef.current = 0;
  };

  const upDown = (frameCount, speedRate = 1) => {
    const frameForJump = frameCount % 30;
    const newVelocity = JUMP_VELOCITY - GRAVITY * frameForJump;
    let newYPosition = gltf.scene.position.y + newVelocity / 4;
    if (newYPosition <= 0) {
      newYPosition = 0;
    }
    gltf.scene.position.y = newYPosition;
  };
  useFrame(() => {
    if (gltf && gltf.scene) {
      // Jumping Logic

      if (isJumping) {
        if (frameCountRef.current < 120) {
          upDown(frameCountRef.current, 2);
          frameCountRef.current += 1;
        } else if (frameCountRef.current === 120) {
          dispatch({ type: ACTIONS.RESET_MESH_STATE });
          resetFrameCount();
        }
      }

      // Leaving Logic
      if (leaving) {
        if (frameCountRef.current < 30) {
          gltf.scene.rotation.y += (Math.PI / 2) / 30;
          upDown(frameCountRef.current);
        } else if (frameCountRef.current < 180) {
          gltf.scene.position.x += 5 / 120;
          upDown(frameCountRef.current);
        } else if (frameCountRef.current === 180) {
          resetFrameCount();
          dispatch({ type: ACTIONS.RESET_LEAVE });
        }
        frameCountRef.current += 1;
      }

      // Coming Back Logic
      if (comingBack) {
        gltf.scene.position.z = 0;
        if (frameCountRef.current <= 120) {
          gltf.scene.position.x -= 6.2 / 120;
          gltf.scene.rotation.y = -Math.PI / 2;
          upDown(frameCountRef.current);
        } else if (frameCountRef.current < 150) {
          gltf.scene.rotation.y += (Math.PI / 2) / 30;
          upDown(frameCountRef.current);
        } else if (frameCountRef.current === 240) {
          resetFrameCount();
          dispatch({ type: ACTIONS.RESET_BACK });
        }
        frameCountRef.current += 1;
      }
      if (tomato && tomato.scene) {
        tomato.scene.visible = showTomato;
      }

      // Laying Down Logic
      if (layingDown && frameCountRef.current <= 540) {
        if (frameCountRef.current < 360) {
          // Jumping logic repeated every 30 frames
          upDown(frameCountRef.current);
          gltf.scene.rotation.y -= (Math.PI / 2) / 120;
        } else if (frameCountRef.current > 450) {
          gltf.scene.position.y += 0.005;

          gltf.scene.rotation.x += (Math.PI / 2) / 90; // Reset the rotation to original state
        }
        if (frameCountRef.current === 540) {
          resetFrameCount();

          dispatch({ type: ACTIONS.TOGGLE_TOOLTIP, payload: { showTooltip: true } });
          dispatch({ type: ACTIONS.LAY_DOWN, payload: { layingDown: false } });
        }
        frameCountRef.current += 1;
        // dispatch({ type: 'INCREMENT_FRAME' });
      }

      // Standing Up Logic
      if (standingUp && frameCountRef.current < 120) {
        if (frameCountRef.current === 1) {
          dispatch({ type: ACTIONS.TOGGLE_TOOLTIP, payload: { showTooltip: false } });
        }
        if (frameCountRef.current < 90) {
          gltf.scene.rotation.x -= Math.PI / 180;
          gltf.scene.position.y -= 0.005;
        } else if (frameCountRef.current < 120) {
          const newVelocity = JUMP_VELOCITY - GRAVITY * frameCountRef.current;
          let newYPosition = gltf.scene.position.y + newVelocity;
          if (newYPosition <= 0) {
            newYPosition = 0;
          }
          gltf.scene.rotation.y -= (Math.PI / 2) / 30;
          gltf.scene.position.y = newYPosition;
        }
        frameCountRef.current += 1;
        // dispatch({ type: 'INCREMENT_FRAME' });
        if (frameCountRef.current === 120) {
          resetFrameCount();
          dispatch({ type: ACTIONS.RESET_MESH_STATE });
        }
      }

      // Reset Logic
      if (hasReset) {
        gltf.scene.position.x = position.x;
        gltf.scene.position.y = position.y;
        gltf.scene.position.z = position.z;
        gltf.scene.rotation.x = rotation.x;
        gltf.scene.rotation.y = rotation.y;
        dispatch({ type: 'RESET_APPLIED' });
      }
    }
  });

  // texture and shadow
  useEffect(() => {
    if (gltf && gltf.scene && tomato && tomato.scene) {
      tomato.scene.scale.set(0.7, 0.7, 0.7);
      console.log(tomatoPosition, tomatoPosition[dogMesh]);
      tomato.scene.position.set(...tomatoPosition[dogMesh]);
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

  useEffect(() => {
    let interval;

    if (showTooltip) {
      // Start interval only when the tooltip is visible
      interval = setInterval(() => {
        setTooltipText((prevText) => (prevText === 'zzZZ' ? 'ZZzz' : 'zzZZ'));
      }, 1000);
    } else {
      // Clear interval when the tooltip is not visible
      clearInterval(interval);
    }

    // Clean up the interval when the component unmounts or showTooltip changes
    return () => clearInterval(interval);
  }, [showTooltip]);

  return (
    <group position={[position.x, position.y, position.z]}>
      <primitive
        object={gltf.scene}
        scale={0.1}
        rotation={[0, rotation.y, 0]}
      >
        <Html position={[15, 15, 0]} distanceFactor={15}>
          {showTooltip && <div>{tooltipText}</div>}
        </Html>

      </primitive>
    </group>
  );
};

function RenderMain() {
  const globalState = useGlobalState();
  const { userItems } = globalState;
  return (
    <Canvas
      // frameloop="demand"
      id="main-canvas"
      dpr={[1, 2]}
      camera={{ position: [0, 2, 6] }}
      shadows="soft"
    >
      <RenderStatic />
      {/* <Scene /> */}
      <Corgi scale={0.1} />
      <ItemsScene items={userItems} />
    </Canvas>
  );
}

export default RenderMain;
