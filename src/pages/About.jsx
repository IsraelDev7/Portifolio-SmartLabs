import React from 'react';
import { usePageMotion } from '../hooks/usePageMotion';

export default function About() {
  const motionRef = usePageMotion();
  return (
    <div ref={motionRef} style={{ paddingTop: '15vh', backgroundColor: '#000', minHeight: '100vh', color: '#fff' }}>
      
      {/* HEADER */}
      <div style={{ padding: '5vw' }}>
        <h1 data-anim="rise" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(4rem, 8vw, 10rem)', lineHeight: '0.9', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
          ABOUT ME
        </h1>
        <h2 data-anim="rise" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 5rem)', color: 'var(--cal)', marginTop: '2rem', lineHeight: '0.9', textTransform: 'uppercase' }}>
          EU NÃO CHEGUEI À TECNOLOGIA POR UM ÚNICO CAMINHO.
        </h2>
      </div>

      {/* STORY SECTION */}
      <div data-anim="stagger" style={{ padding: '5vw', display: 'flex', flexWrap: 'wrap', gap: '5vw', borderTop: '1px solid #333' }}>
        <div style={{ flex: '1 1 40%', fontFamily: 'var(--font-mono)', fontSize: '1.2rem', lineHeight: '1.6', textTransform: 'uppercase', color: '#aaa' }}>
          <p style={{ marginBottom: '2rem' }}>Minha formação é técnica.</p>
          <p style={{ marginBottom: '2rem' }}>Minha experiência é humana.</p>
          <p style={{ marginBottom: '2rem' }}>E meu trabalho acontece no encontro entre as duas.</p>
        </div>
        <div style={{ flex: '1 1 50%', fontFamily: 'var(--font-mono)', fontSize: '1rem', lineHeight: '1.6', textTransform: 'uppercase', color: '#888' }}>
          <p style={{ marginBottom: '2rem' }}>Antes de criar a SmartLabs, minha trajetória passou por diferentes ambientes profissionais — gestão de equipes, consultoria tecnológica no mercado de investimentos, palestras e projetos de impacto social.</p>
          <p style={{ marginBottom: '2rem' }}>Experiências diferentes. Mas uma coisa em comum: <strong>pessoas.</strong></p>
          <p style={{ marginBottom: '2rem' }}>Estar próximo de pessoas me ensinou algo que nenhum software ensina. Por trás de cada decisão existe uma motivação. Por trás de cada compra existe uma emoção. Por trás de cada negócio existe um ser humano tentando resolver alguma coisa.</p>
          <p style={{ color: '#fff' }}>E entender isso mudou a forma como eu construo tecnologia.</p>
        </div>
      </div>

      {/* SKILLS & CERTS SECTION */}
      <div style={{ padding: '10vw 5vw', backgroundColor: '#050505', borderTop: '1px solid #333' }}>
        <h2 data-anim="rise" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 6vw, 8rem)', lineHeight: '0.9', textTransform: 'uppercase', marginBottom: '2rem' }}>
          TECHNOLOGY IS THE TOOL.<br/><span style={{ color: 'var(--cal)' }}>PEOPLE ARE THE REASON.</span>
        </h2>
        
        <div data-anim="stagger" style={{ display: 'flex', flexWrap: 'wrap', gap: '5vw', marginTop: '5vw' }}>
          <div style={{ flex: '1 1 30%', fontFamily: 'var(--font-mono)', fontSize: '1rem', color: '#fff', textTransform: 'uppercase', lineHeight: '2' }}>
            <div style={{ color: '#555', marginBottom: '1rem' }}>INTERSEÇÃO</div>
            DESIGN<br/>
            DEVELOPMENT<br/>
            AI<br/>
            AUTOMATION<br/>
            BUSINESS<br/>
            HUMAN BEHAVIOR
          </div>
          <div style={{ flex: '1 1 60%', fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: '#aaa', textTransform: 'uppercase', lineHeight: '1.8' }}>
            <p style={{ marginBottom: '2rem' }}>Sou formado em <strong>Desenvolvimento Full Stack pela DevClub</strong>, com formação em <strong>Engenharia de Prompt e Inteligência Artificial Aplicada pela Academia Lendária</strong>, <strong>Tráfego Pago pela Comunidade Sobral de Tráfego</strong> e especialização em <strong>Automação de Processos e desenvolvimento de agentes de atendimento pela AutomatikLabs, de Rafael Melgaço.</strong></p>
            <p style={{ color: '#fff' }}>Mas certificados são apenas parte da história. O que realmente importa é o que acontece quando todo esse conhecimento é colocado dentro de um problema real.</p>
          </div>
        </div>
      </div>

      {/* WHY SMARTLABS */}
      <div style={{ padding: '10vw 5vw', backgroundColor: '#000', borderTop: '1px solid #333' }}>
        <div data-anim="stagger" style={{ display: 'flex', flexWrap: 'wrap', gap: '5vw' }}>
          <div style={{ flex: '1 1 40%' }}>
            <h3 style={{ fontFamily: 'var(--font-mono)', color: 'var(--cal)', marginBottom: '1rem', textTransform: 'uppercase' }}>WHY SMARTLABS?</h3>
            <h2 data-anim="rise" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 6rem)', lineHeight: '0.9', textTransform: 'uppercase' }}>
              PORQUE EU NÃO QUERO TE ENTREGAR MAIS UMA FERRAMENTA.
            </h2>
          </div>
          <div style={{ flex: '1 1 50%', fontFamily: 'var(--font-mono)', fontSize: '1rem', color: '#aaa', textTransform: 'uppercase', lineHeight: '1.6' }}>
            <p style={{ marginBottom: '1rem' }}>Você não precisa aprender a usar mais um software. Não precisa juntar cinco plataformas diferentes. Não precisa contratar uma pessoa para cada pequena etapa.</p>
            <p style={{ marginBottom: '2rem' }}>Você precisa de uma solução que faça sentido para o seu negócio.</p>
            <p style={{ marginBottom: '2rem', color: '#fff' }}>É por isso que a SmartLabs trabalha de forma diferente. Eu junto diferentes tecnologias e disciplinas para construir <strong>uma solução pronta para operar.</strong></p>
            <p style={{ color: 'var(--cal)' }}>VOCÊ TRAZ O PROBLEMA.<br/>EU DESENHO A ARQUITETURA.<br/>E ENTREGO A ESTRUTURA FUNCIONANDO.</p>
          </div>
        </div>
      </div>

      {/* THE PHILOSOPHY */}
      <div style={{ padding: '15vw 5vw', backgroundColor: '#111', textAlign: 'center' }}>
        <h3 style={{ fontFamily: 'var(--font-mono)', color: '#666', marginBottom: '2rem', textTransform: 'uppercase' }}>THE PHILOSOPHY</h3>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(4rem, 10vw, 12rem)', lineHeight: '0.8', textTransform: 'uppercase', color: '#fff' }}>
          BUILD LESS.<br/>THINK MORE.
        </h2>
        <div style={{ marginTop: '5vw', fontFamily: 'var(--font-mono)', fontSize: '1.2rem', color: '#aaa', textTransform: 'uppercase', lineHeight: '1.6', maxWidth: '800px', margin: '5vw auto 0' }}>
          <p style={{ marginBottom: '2rem' }}>Não acredito em tecnologia por tecnologia. Nem em automação porque "todo mundo está usando IA".</p>
          <p style={{ color: '#555', marginBottom: '1rem' }}>A pergunta nunca deveria ser:</p>
          <p style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '3rem' }}>"Onde podemos colocar IA?"</p>
          <p style={{ color: '#555', marginBottom: '1rem' }}>A pergunta deveria ser:</p>
          <p style={{ color: 'var(--cal)', fontSize: '1.5rem', marginBottom: '3rem' }}>"Onde podemos melhorar o negócio?"</p>
          <p>A tecnologia vem depois.</p>
        </div>
      </div>

    </div>
  );
}
