import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll } from '@react-three/drei';
import * as THREE from 'three';

export function Monolith({ color = '#0A0A0A', accent = '#D14D29' }) {
  const groupRef = useRef(null);
  
  // The scroll hook from drei returns an object { offset: number (0-1), range: fn, curve: fn }
  // but since we will sync this scene to the actual page scroll via HTML overlay,
  // we can use standard R3F hooks or GSAP to manipulate the ref directly.
  
  // For simplicity and high-performance, we'll let useFrame read the scroll.
  useFrame(() => {
    if (!groupRef.current) return;
    
    // Smooth rotation based on time
    groupRef.current.rotation.y += 0.002;
    
    // We can also tie rotation.x to scroll if wrapped in a ScrollControls,
    // but since we are doing a standard HTML layout, we'll just add ambient animation here
    // and let GSAP handle the canvas pinning/scrubbing from the outside if needed.
    groupRef.current.rotation.x = Math.sin(Date.now() * 0.001) * 0.1;
  });

  const materialConfig = {
    color: '#1D1C1A',
    roughness: 0.2,
    metalness: 0.8,
    clearcoat: 0.1,
  };

  const accentMaterialConfig = {
    color: accent,
    roughness: 0.3,
    metalness: 0.6,
    emissive: accent,
    emissiveIntensity: 0.2,
  };

  return (
    <group ref={groupRef} scale={1.5}>
      {/* Step 1 (Bottom) */}
      <mesh position={[-1, -1, 0]} castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshPhysicalMaterial {...materialConfig} />
      </mesh>
      
      {/* Step 2 (Middle) */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[1, 3, 1]} />
        <meshPhysicalMaterial {...materialConfig} />
      </mesh>
      
      {/* Step 3 (Top) */}
      <mesh position={[1, 1, 0]} castShadow receiveShadow>
        <boxGeometry args={[1, 5, 1]} />
        <meshPhysicalMaterial {...accentMaterialConfig} />
      </mesh>
    </group>
  );
}
