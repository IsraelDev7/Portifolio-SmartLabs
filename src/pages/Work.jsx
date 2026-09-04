import React from 'react';
import { usePageMotion } from '../hooks/usePageMotion';

export default function Work() {
  const motionRef = usePageMotion();
  const projects = [
    {
      id: '01',
      name: '[ NOME DO PROJETO ]',
      challenge: '[Qual era o problema do negócio?]',
      approach: '[Como a estratégia, design e tecnologia foram utilizados.]',
      system: '[Site + automações + integrações + IA + dados.]',
      result: '[Resultado mensurável ou transformação percebida.]'
    },
    {
      id: '02',
      name: '[ NOME DO PROJETO ]',
      challenge: '[Problema.]',
      approach: '[Solução.]',
      system: '[Arquitetura.]',
      result: '[Resultado.]'
    },
    {
      id: '03',
      name: '[ NOME DO PROJETO ]',
      challenge: '[Problema.]',
      approach: '[Solução.]',
      system: '[Arquitetura.]',
      result: '[Resultado.]'
    }
  ];

  return (
    <div ref={motionRef} style={{ paddingTop: '15vh', backgroundColor: '#000', minHeight: '100vh', color: '#fff' }}>
      <div style={{ padding: '5vw' }}>
        <h1 data-anim="rise" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(4rem, 8vw, 10rem)', lineHeight: '0.9', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
          SELECTED WORK
        </h1>
        <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', color: 'var(--cal)', marginTop: '2rem', maxWidth: '600px', lineHeight: '1.5', textTransform: 'uppercase' }}>
          PROJETOS NÃO SÃO APENAS O QUE EU CONSTRUÍ. SÃO PROBLEMAS QUE EU RESOLVI.
        </h2>
      </div>

      <div data-anim="stagger" style={{ padding: '5vw', display: 'flex', flexDirection: 'column', gap: '10vw' }}>
        {projects.map((proj) => (
          <div key={proj.id} style={{ display: 'flex', flexWrap: 'wrap', borderTop: '1px solid #333', paddingTop: '3vw' }}>
            {/* Left: Metadata */}
            <div style={{ flex: '1 1 30%', marginBottom: '2rem' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', color: 'var(--cal)', marginBottom: '1rem' }}>
                [ PROJECT {proj.id} ]
              </div>
              <h3 data-anim="rise" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 4rem)', lineHeight: '1', textTransform: 'uppercase' }}>
                {proj.name}
              </h3>
            </div>
            
            {/* Right: Details */}
            <div data-anim="stagger" style={{ flex: '1 1 70%', display: 'flex', flexWrap: 'wrap', gap: '3rem', fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: '#aaa', textTransform: 'uppercase', lineHeight: '1.6' }}>
              <div style={{ flex: '1 1 45%' }}>
                <strong style={{ color: '#fff', display: 'block', marginBottom: '0.5rem' }}>THE CHALLENGE</strong>
                {proj.challenge}
              </div>
              <div style={{ flex: '1 1 45%' }}>
                <strong style={{ color: '#fff', display: 'block', marginBottom: '0.5rem' }}>THE APPROACH</strong>
                {proj.approach}
              </div>
              <div style={{ flex: '1 1 45%' }}>
                <strong style={{ color: '#fff', display: 'block', marginBottom: '0.5rem' }}>THE SYSTEM</strong>
                {proj.system}
              </div>
              <div style={{ flex: '1 1 45%' }}>
                <strong style={{ color: '#fff', display: 'block', marginBottom: '0.5rem' }}>THE RESULT</strong>
                {proj.result}
              </div>
              
              <div style={{ width: '100%', marginTop: '2rem' }}>
                <button style={{ background: 'transparent', border: '1px solid var(--cal)', color: 'var(--cal)', padding: '1rem 2rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.3s' }}>
                  [ VIEW CASE ]
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
