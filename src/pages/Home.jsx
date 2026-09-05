import React, { useRef } from 'react';
import Hero from '../sections/Hero';
import SceneSection from '../sections/SceneSection';
import { usePageMotion } from '../hooks/usePageMotion';
import { useDeriva } from '../hooks/useDeriva';
import { useBlocos } from '../hooks/useBlocos';
import Mosaico from '../components/Mosaico';

export default function Home() {
  const motionRef = usePageMotion();

  /* Escopo proprio para a deriva, comecando DEPOIS do heroi: o Hero ja
     tem o dele, e um escopo que englobasse os dois faria dois tickers
     escreverem o mesmo `y` nos mesmos elementos. */
  const derivaRef = useRef(null);
  useDeriva(derivaRef);
  useBlocos(derivaRef);

  return (
    <div ref={motionRef} className="page-home" style={{ backgroundColor: '#000' }}>
      <Hero />

      <div ref={derivaRef}>
      
      {/* SECTION 2: EDITORIAL BLOCK */}
      <section style={{ backgroundColor: '#000', color: 'var(--text-color)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', flex: 1 }}>
          <div style={{ flex: '1 1 50%', minHeight: '50vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Image Placeholder */}
            {/* Contramao na deriva (+0.14) e revelacao em ladrilhos pelo
                scroll. Saiu o data-anim="frame": o clip e o mosaico
                seriam duas revelacoes disputando a mesma imagem. */}
            <Mosaico deriva="0.14" semente={3} style={{ width: '70%', height: '80%' }}>
              <div style={{ width: '100%', height: '100%', backgroundColor: '#111', backgroundImage: 'url(/images/imagine-alguem.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'grayscale(100%) brightness(0.8)' }}></div>
            </Mosaico>
          </div>
          <div style={{ flex: '1 1 50%', display: 'flex', alignItems: 'center', padding: '5vw' }}>
            <h2 data-anim="words" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 5vw, 6rem)', lineHeight: '0.9', textTransform: 'uppercase', color: 'var(--text-color)', letterSpacing: '-0.02em' }}>
              Imagine alguém chegando pela primeira vez ao seu negócio. Essa pessoa não conhece você. Ela só consegue julgar aquilo que vê.
            </h2>
          </div>
        </div>
        {/* A deriva vai no container, nao no h3: o data-anim="words" ja
            mexe nas palavras dele. */}
        <div data-deriva="-0.12" style={{ padding: '5vw', paddingBottom: '10vw' }}>
          <h3 data-anim="words" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 4.5vw, 5rem)', lineHeight: '0.9', textTransform: 'uppercase', color: 'var(--fumaca)', letterSpacing: '-0.02em' }}>
            SEU SITE É UMA DESSAS PRIMEIRAS IMPRESSÕES. ELE NÃO DEVERIA SER APENAS UMA PÁGINA BONITA. DEVERIA REPRESENTAR O NÍVEL DO NEGÓCIO POR TRÁS.
          </h3>
        </div>
      </section>

      {/* SECTION 3: GREEN TEXT + MASONRY GALLERY */}
      <section style={{ backgroundColor: '#000', padding: '15vw 5vw' }}>
        <h2 data-anim="rise" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(4rem, 8vw, 10rem)', lineHeight: '0.85', color: 'var(--cal)', textTransform: 'uppercase', marginBottom: '2rem', letterSpacing: '-0.03em' }}>
          NÃO É APENAS<br/>UM SITE.
        </h2>
        <p data-anim="rise" style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(1rem, 1.5vw, 1.25rem)', color: '#fff', maxWidth: '800px', lineHeight: '1.5', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          É A SEDE DIGITAL DA SUA EMPRESA. O RESULTADO É UMA PRESENÇA DIGITAL SOFISTICADA, ESTRATÉGICA E PREPARADA PARA CRESCER.
        </p>
        
        {/* Editorial Masonry Gallery */}
        {/* data-bloco no lugar do stagger: a cascata subia todas as
            colunas do mesmo jeito. Agora a do meio desce enquanto as
            vizinhas sobem, e cada uma e revelada pelo lado de onde vem. */}
        <div data-bloco style={{ marginTop: '10vw', display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
          <div style={{ flex: '1 1 40%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Ancora do bloco: e a peca parada que faz o olho perceber
                que as outras duas se movem. Sem atributo, de proposito. */}
            <Mosaico semente={11}>
              <img src="/images/estrutura-primeiro.jpg" alt="Maquete de concreto com malha estrutural" style={{ width: '100%', height: 'auto', filter: 'grayscale(100%)' }} />
            </Mosaico>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#666', textTransform: 'uppercase' }}>ESTRUTURA PRIMEIRO (2026)</span>
          </div>
          <div style={{ flex: '1 1 30%', display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '15vw' }}>
            {/* A deriva vai no MOSAICO, nao na coluna: o data-bloco do pai
                anima os filhos com `y` e os dois brigariam. Assim a foto e
                a cobertura deslizam juntas e a legenda fica ancorada. */}
            <Mosaico deriva="-0.14" semente={23}>
              <img src="/images/estetica-depois.jpg" alt="Silhueta dissolvendo em cubos" style={{ width: '100%', height: 'auto', filter: 'grayscale(100%)' }} />
            </Mosaico>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#666', textTransform: 'uppercase' }}>ESTÉTICA DEPOIS (2026)</span>
          </div>
          <div style={{ flex: '1 1 20%', display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '5vw' }}>
            <Mosaico deriva="-0.26" semente={41}>
              <img src="/images/funcao-em-tudo.jpg" alt="Paineis de vidro sobrepostos com luz ambar" style={{ width: '100%', height: 'auto', filter: 'grayscale(100%)' }} />
            </Mosaico>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#666', textTransform: 'uppercase' }}>FUNÇÃO EM TUDO (2026)</span>
          </div>
        </div>
      </section>

      {/* SECTION 3.5: CENA 3D — O Monolito dos Degraus (motion-system S02) */}
      <SceneSection />

      {/* SECTION 4: SPLIT HERO (O QUE EU CONSTRUO) */}
      <section style={{ display: 'flex', flexWrap: 'wrap', backgroundColor: '#000', borderTop: '1px solid #222' }}>
        {/* Left Half */}
        <div style={{ flex: '1 1 50%', padding: '5vw', position: 'relative', borderRight: '1px solid #222' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#888', marginBottom: '2rem' }}>
            <span>SMARTLABS —— // BUILD</span>
            <span>REVISION —— NEUE 1.0</span>
          </div>
          <h2 data-anim="rise" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(5rem, 8vw, 10rem)', lineHeight: '0.85', color: '#fff', textTransform: 'uppercase', marginBottom: '5vw' }}>
            O QUE EU<br/>CONSTRUO
          </h2>
          <Mosaico semente={17} style={{ width: '100%', height: '60vh' }}>
            <div style={{ width: '100%', height: '100%', backgroundImage: 'url(/images/o-que-construo.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'grayscale(100%) brightness(0.9)' }}></div>
          </Mosaico>
        </div>
        
        {/* Right Half */}
        <div style={{ flex: '1 1 50%', display: 'flex', flexDirection: 'column' }}>
          {/* Top Grey Box */}
          <div style={{ backgroundColor: '#111', padding: '5vw', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h3 data-anim="rise" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 5vw, 6rem)', lineHeight: '0.9', color: '#fff', textTransform: 'uppercase' }}>EXPERIÊNCIA</h3>
            <h4 data-anim="rise" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 3vw, 4rem)', lineHeight: '0.9', color: '#555', textTransform: 'uppercase', marginBottom: '3rem' }}>DE ALTO PADRÃO</h4>
            
            <div data-bloco style={{ display: 'flex', gap: '2rem', fontFamily: 'var(--font-mono)', fontSize: '0.9rem', lineHeight: '1.5', color: '#aaa', textTransform: 'uppercase' }}>
              <div style={{ flex: 1 }}>
                <div style={{ color: 'var(--cal)', marginBottom: '1rem' }}>01 — IDENTIDADE & UX</div>
                Sua marca precisa ser percebida antes mesmo de ser explicada. Construo e organizo a identidade visual e a experiência digital para transmitir posicionamento, confiança e valor.
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: 'var(--cal)', marginBottom: '1rem' }}>02 — WEBSITES</div>
                Não trabalho para simplesmente colocar sua empresa na internet. Construo uma presença digital pensada para conduzir o visitante e transformar atenção em ação.
              </div>
            </div>
          </div>
          
          {/* Bottom Black Box */}
          <div style={{ backgroundColor: '#050505', padding: '5vw', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', borderTop: '1px solid #222' }}>
            <h3 data-anim="rise" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 5vw, 6rem)', lineHeight: '0.9', color: '#fff', textTransform: 'uppercase' }}>OPERAÇÃO</h3>
            <h4 data-anim="rise" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 3vw, 4rem)', lineHeight: '0.9', color: '#555', textTransform: 'uppercase', marginBottom: '3rem' }}>INTELIGENTE</h4>
            
            <div data-bloco style={{ display: 'flex', gap: '2rem', fontFamily: 'var(--font-mono)', fontSize: '0.9rem', lineHeight: '1.5', color: '#aaa', textTransform: 'uppercase' }}>
              <div style={{ flex: 1 }}>
                <div style={{ color: 'var(--cal)', marginBottom: '1rem' }}>03 — AUTOMAÇÃO & IA</div>
                A parte que o cliente vê é apenas metade do projeto. Automatizo operações para reduzir tarefas manuais, acelerar respostas e criar processos mais eficientes.
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: 'var(--cal)', marginBottom: '1rem' }}>04 — SEGURANÇA</div>
                Um negócio de alto nível precisa de uma fundação à altura. Por isso, segurança não é um detalhe colocado no final do projeto. É considerada desde a arquitetura.
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* SECTION 5: MODULES ROW (THE SYSTEM) */}
      <section style={{ backgroundColor: '#000', color: '#fff', padding: '10vw 5vw', borderTop: '1px solid #222' }}>
        <div style={{ textAlign: 'center', marginBottom: '5vw' }}>
          <h2 data-anim="rise" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 6vw, 8rem)', lineHeight: '0.9', textTransform: 'uppercase', color: '#fff' }}>
            O SISTEMA ESTÁ CONECTADO.
          </h2>
          <p style={{ fontFamily: 'var(--font-mono)', color: '#888', marginTop: '2rem', textTransform: 'uppercase' }}>SOURCE —— THE SYSTEM</p>
        </div>
        
        <div data-bloco style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', lineHeight: '1.6', color: '#aaa', textTransform: 'uppercase' }}>
          <div>
            <div data-anim="line" style={{ color: '#fff', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #333' }}>MODULE —— DESIGN</div>
            Cria percepção. Transformando a identidade em uma experiência tátil no digital.
          </div>
          <div>
            <div data-anim="line" style={{ color: '#fff', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #333' }}>MODULE —— WEBSITE</div>
            Transforma percepção em experiência. Onde o usuário interage e consome a narrativa.
          </div>
          <div>
            <div data-anim="line" style={{ color: '#fff', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #333' }}>MODULE —— TRACKING</div>
            Transforma comportamento em informação. Registrando cada passo de forma silenciosa.
          </div>
          <div>
            <div data-anim="line" style={{ color: '#fff', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #333' }}>MODULE —— AUTOMAÇÃO & AI</div>
            Transforma informação em ação. Aumentando a capacidade da operação sem esforço braçal.
          </div>
        </div>
      </section>
      </div>
    </div>
  );
}
