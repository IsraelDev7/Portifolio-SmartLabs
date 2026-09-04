import React, { useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Lightformer, ContactShadows } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Monolith } from '../three/Monolith';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * SceneSection — o Monolito construido pelo scroll (motion-system S02).
 *
 * A secao tem 180vh: a cena fica presa por 1 tela e o excedente e o
 * curso do scrub — ou seja, 80vh de rolagem para os quatro estagios.
 *
 * Esse numero e o que governa a VELOCIDADE percebida, nao o easing.
 * A 150vh sobravam 50vh (~450px) para construir tres degraus e dispersar
 * 240 cubos: menos de um giro de scroll para a sequencia inteira, e por
 * isso parecia atropelada. 180vh da 60% mais curso e ainda e 20vh mais
 * enxuto que as 200vh originais.
 *
 * O progresso vai para a cena por um ref mutavel — nunca por state,
 * que re-renderizaria o Canvas a cada quadro.
 */

const COMPACTO = typeof window !== 'undefined'
  && window.matchMedia('(max-width: 820px)').matches;

export default function SceneSection() {
  const secao = useRef(null);
  const progresso = useRef(0);
  const rotulo = useRef(null);

  // O canvas so gasta GPU enquanto a secao esta na tela. Antes ele
  // renderizava a 60fps o site inteiro — inclusive com voce lendo o rodape.
  const [ativo, setAtivo] = useState(false);

  useEffect(() => {
    const alvo = secao.current;
    if (!alvo) return;
    const obs = new IntersectionObserver(
      ([e]) => setAtivo(e.isIntersecting),
      { rootMargin: '20% 0px' }   // liga um pouco antes de entrar
    );
    obs.observe(alvo);
    return () => obs.disconnect();
  }, []);

  useGSAP(() => {
    const reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduz) {
      // movimento reduzido: entrega a torre montada, sem scrub
      progresso.current = 0.66;
      return;
    }

    // Sem pin do GSAP: o container usa position:sticky (CSS nativo).
    // Pinar um elemento absolute solta no meio do percurso e a cena some.
    // O ScrollTrigger aqui so LE o progresso, nao move nada.
    const st = ScrollTrigger.create({
      trigger: secao.current,
      start: 'top top',
      end: 'bottom bottom',
      // O numero e o tempo de recuperacao, nao a velocidade: a cena passa
      // a filtrar o ruido do trackpad em vez de colar em cada microssalto.
      scrub: 1.35,
      onUpdate: (self) => {
        progresso.current = self.progress;
        if (rotulo.current) {
          const p = self.progress;
          const nivel = p < 0.26 ? 1 : p < 0.50 ? 2 : 3;
          const txt = p > 0.72 ? 'DISPERSÃO' : `NÍVEL ${String(nivel).padStart(2, '0')} / 03`;
          if (rotulo.current.textContent !== txt) rotulo.current.textContent = txt;
        }
      },
    });

    return () => st.kill();
  }, { scope: secao });

  return (
    <section
      ref={secao}
      style={{ position: 'relative', height: '180vh', backgroundColor: 'var(--aco)' }}
    >
      {/* sticky: gruda no topo durante todo o curso da secao, sem pin do GSAP */}
      <div
        className="canvas-container"
        style={{ position: 'sticky', top: 0, left: 0, width: '100%', height: '100vh' }}
      >
        <Canvas
          frameloop={ativo ? 'always' : 'never'}
          dpr={[1, COMPACTO ? 1.25 : 1.5]}
          camera={{ position: [0.6, 1.2, 13], fov: 32 }}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
          performance={{ min: 0.5 }}
        >
          <color attach="background" args={['#0A0A0A']} />

          {/* Sem castShadow: o shadow map e um render inteiro por quadro
              e o ContactShadows ja resolve o apoio dos blocos no chao. */}
          <ambientLight intensity={0.5} />
          <spotLight position={[8, 12, 8]} angle={0.2} penumbra={1} intensity={1.3} />

          <Monolith progress={progresso} />

          {!COMPACTO && (
            <ContactShadows position={[0, -1.62, 0]} opacity={0.45} scale={16} blur={2.4} far={5} />
          )}

          {/* Sem preset: o "city" baixa um HDRI de 1-2 MB so para refletir
              em tres caixas. Os Lightformer sao gerados na GPU, custam rede zero. */}
          <Environment resolution={64}>
            <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[20, 0.1, 1]} />
            <Lightformer intensity={1.2} rotation-y={-Math.PI / 2} position={[6, 2, 1]} scale={[20, 0.1, 1]} />
            <Lightformer intensity={0.8} rotation-x={Math.PI / 2} position={[0, 6, 0]} scale={[12, 12, 1]} />
          </Environment>

          {/* O passe Noise saiu: fazia grao de tela cheia por quadro, e o
              .grain-overlay do site ja faz o mesmo em CSS, de graca. */}
          <EffectComposer disableNormalPass>
            <Bloom luminanceThreshold={0.55} mipmapBlur intensity={0.7} />
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
