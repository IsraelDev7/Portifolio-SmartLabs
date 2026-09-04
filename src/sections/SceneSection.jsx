import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Lightformer, ContactShadows } from '@react-three/drei';
import { EffectComposer, Bloom, Noise } from '@react-three/postprocessing';
import { Monolith } from '../three/Monolith';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * SceneSection — o Monolito construido pelo scroll (motion-system S02).
 *
 * A secao tem 150vh: a cena fica presa por 1 tela e o excedente e o
 * curso do scrub. Antes eram 200vh, espaco morto demais para o efeito.
 *
 * O progresso vai para a cena por um ref mutavel — nunca por state,
 * que re-renderizaria o Canvas a cada quadro.
 */
export default function SceneSection() {
  const secao = useRef(null);
  const progresso = useRef(0);
  const rotulo = useRef(null);

  useGSAP(() => {
    const reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduz) {
      // movimento reduzido: entrega a torre montada, sem scrub
      progresso.current = 0.62;
      return;
    }

    // Sem pin do GSAP: o container usa position:sticky (CSS nativo).
    // Pinar um elemento absolute solta no meio do percurso e a cena some.
    // O ScrollTrigger aqui so LE o progresso, nao move nada.
    const st = ScrollTrigger.create({
      trigger: secao.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.6,
      onUpdate: (self) => {
        progresso.current = self.progress;
        if (rotulo.current) {
          const nivel = Math.min(3, Math.floor(self.progress / 0.22) + 1);
          const txt = self.progress > 0.66 ? 'DISPERSÃO' : `NÍVEL ${String(nivel).padStart(2, '0')} / 03`;
          if (rotulo.current.textContent !== txt) rotulo.current.textContent = txt;
        }
      },
    });

    return () => st.kill();
  }, { scope: secao });

  return (
    <section
      ref={secao}
      style={{ position: 'relative', height: '150vh', backgroundColor: 'var(--aco)' }}
    >
      {/* sticky: gruda no topo durante todo o curso da secao, sem pin do GSAP */}
      <div
        className="canvas-container"
        style={{ position: 'sticky', top: 0, left: 0, width: '100%', height: '100vh' }}
      >
        <Canvas
          shadows
          dpr={[1, 1.75]}
          camera={{ position: [0.6, 1.2, 13], fov: 32 }}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
        >
          <color attach="background" args={['#0A0A0A']} />

          <ambientLight intensity={0.45} />
          <spotLight position={[8, 12, 8]} angle={0.2} penumbra={1} intensity={1.2} castShadow />

          <Monolith progress={progresso} />

          <ContactShadows position={[0, -1.62, 0]} opacity={0.45} scale={16} blur={2.4} far={5} />

          <Environment preset="city" blur={0.8}>
            <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[20, 0.1, 1]} />
          </Environment>

          <EffectComposer disableNormalPass>
            <Bloom luminanceThreshold={0.55} mipmapBlur intensity={0.7} />
            <Noise opacity={0.05} />
          </EffectComposer>
        </Canvas>
      </div>

      {/* Camada de texto — nao intercepta o ponteiro, o scroll passa direto */}
      {/* texto acompanha a cena grudada: sticky tambem, e sobe -100vh
          para ocupar a mesma faixa do canvas sem alterar a altura total */}
      <div
        style={{
          position: 'sticky', top: 0, marginTop: '-100vh', width: '100%', height: '100vh',
          pointerEvents: 'none', display: 'flex', flexDirection: 'column',
          justifyContent: 'space-between', padding: '12vh 0', zIndex: 2,
        }}
      >
        <div className="container" style={{ alignSelf: 'flex-start' }}>
          <h2 style={{ fontSize: 'var(--text-3xl)' }}>Forma &amp;<br />Função</h2>
          <span
            ref={rotulo}
            className="font-mono text-fumaca"
            style={{ display: 'block', marginTop: '1rem', fontSize: '0.8rem', letterSpacing: '0.12em' }}
          >
            NÍVEL 01 / 03
          </span>
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
