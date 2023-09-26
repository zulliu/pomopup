import { useLoader, useThree } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import React, { useState, useRef, useEffect } from 'react';
import { Html } from '@react-three/drei';
import Cookies from 'js-cookie';
import ToolTip from './tooltip';

function ItemModel({
  item, setSelectedItem, selectedItem, visible,
}) {
  const gltf = useLoader(GLTFLoader, `/items/${item.name}.gltf`);
  const [showTooltip, setShowTooltip] = useState(false);

  // ref for raycaster
  const meshRef = useRef();
  const prevSelectedItemRef = useRef();
  useEffect(() => {
    prevSelectedItemRef.current = selectedItem;
  }, [selectedItem]);

  useEffect(() => {
    if (gltf && gltf.scene) {
      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          if (child.material.map) {
            child.material.metalness = 0;
            child.material.roughness = 1;
          }
        }
      });
    }
  }, [gltf]);

  return (
    <mesh
      visible={visible}
      ref={meshRef}
      onClick={() => {
        if (selectedItem?.item_id === item.item_id ) {
          setSelectedItem(null); 
        } else {
          setSelectedItem(item); 
        }
      }}
    >
      <primitive
        object={gltf.scene}
        scale={item.scale}
        position={item.position}
        rotation={[0, -Math.PI * 0.75, 0]}
      />
      <Html
        position={[item.position[0], item.position[1], item.position[2]]}
        distanceFactor={10}
      >
        {selectedItem?.item_id === item.item_id && (
        <ToolTip
          item={item.name}
          text={item.description}
        />
        )}
      </Html>

    </mesh>
  );
}

function ItemsScene({ items }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const itemsList = Cookies.get('items') ? JSON.parse(Cookies.get('items')) : [];
  return (
    <>
      {itemsList.map((item, index) => {
        const isVisible = items.some((i) => i.item_id === item.item_id);
        return (
          <ItemModel
            key={index}
            item={item}
            setSelectedItem={setSelectedItem}
            selectedItem={selectedItem}
            visible={isVisible}
          />
        );
      })}
    </>
  );
}

export default ItemsScene;
