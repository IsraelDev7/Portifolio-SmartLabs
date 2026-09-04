import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Lightformer, Float, ContactShadows } from '@react-three/drei';
import { EffectComposer, Bloom, Noise } from '@react-three/postprocessing';
import { Monolith } from '../three/Monolith';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function SceneSection() {
  const containerRef = useRef(null);

  useGSAP(() => {
    // Pin the 3D scene while scrolling past it
    gsap.to('.canvas-container', {
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        pin: '.canvas-container',
        scrub: true,
      }
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} style={{ position: 'relative', height: '200vh', backgroundColor: 'var(--aco)' }}>
      
      <div className="canvas-container" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100vh' }}>
        <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 10], fov: 35 }}>
          <color attach="background" args={['#0A0A0A']} />
          
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
          
          <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
            <Monolith />
          </Float>

          <ContactShadows position={[0, -3.5, 0]} opacity={0.4} scale={20} blur={2} far={4} />

          <Environment preset="city" blur={0.8}>
            <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[20, 0.1, 1]} />
          </Environment>

          <EffectComposer disableNormalPass>
            <Bloom luminanceThreshold={0.5} mipmapBlur intensity={0.5} />
            <Noise opacity={0.05} />
          </EffectComposer>
        </Canvas>
      </div>

      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '10vh 0' }}>
        <div className="container" style={{ alignSelf: 'flex-start' }}>
          <h2 style={{ fontSize: 'var(--text-3xl)' }}>Forma &<br/>Função</h2>
        </div>
        
        <div className="container" style={{ alignSelf: 'flex-end', textAlign: 'right' }}>
          <p className="font-mono text-fumaca" style={{ maxWidth: '30ch', marginLeft: 'auto' }}>
            A arquitetura digital deve ser tão sólida quanto a operação que ela sustenta. Sem fricções, sem falhas.
          </p>
        </div>
      </div>

    </section>
  );
}
