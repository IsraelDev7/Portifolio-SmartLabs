import React from 'react';
import { usePageMotion } from '../hooks/usePageMotion';

export default function Contact() {
  const motionRef = usePageMotion();
  return (
    <div ref={motionRef} style={{ paddingTop: '15vh', backgroundColor: '#000', minHeight: '100vh', color: '#fff' }}>
      
      {/* HEADER & SPLIT */}
      <div style={{ display: 'flex', flexWrap: 'wrap', minHeight: '85vh' }}>
        
        {/* Left Side: Statement */}
        <div style={{ flex: '1 1 50%', padding: '5vw', borderRight: '1px solid #333', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h1 data-anim="rise" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 6vw, 8rem)', lineHeight: '0.9', textTransform: 'uppercase', letterSpacing: '-0.02em', marginBottom: '2rem' }}>
            VAMOS CONSTRUIR ALGO QUE MEREÇA SER VISTO.
          </h1>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', color: '#aaa', textTransform: 'uppercase', lineHeight: '1.6', maxWidth: '500px' }}>
            <p style={{ marginBottom: '2rem' }}>Se você está construindo uma empresa, reposicionando uma marca ou simplesmente percebeu que sua estrutura digital já não representa o nível do seu negócio, talvez seja hora de reconstruí-la.</p>
            <p style={{ color: '#fff', marginBottom: '1rem' }}>Conte-me sobre o projeto.</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: 'var(--cal)' }}>
              <li>— O que você está construindo?</li>
              <li>— Onde está o problema?</li>
              <li>— E onde você quer chegar?</li>
            </ul>
            <p style={{ marginTop: '2rem' }}>Eu vou analisar o cenário e entender se existe uma solução que faça sentido.</p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div style={{ flex: '1 1 50%', padding: '5vw', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', color: '#fff', marginBottom: '3rem', textTransform: 'uppercase', borderBottom: '1px solid #333', paddingBottom: '1rem' }}>
            START A PROJECT
          </h2>
          
          <form style={{ display: 'flex', flexDirection: 'column', gap: '2rem', fontFamily: 'var(--font-mono)' }}>
            
            <div data-anim="stagger" style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 45%' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#666', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Nome</label>
                <input type="text" placeholder="Seu nome" style={{ width: '100%', padding: '1rem 0', background: 'transparent', border: 'none', borderBottom: '1px solid #333', color: '#fff', outline: 'none' }} />
              </div>
              <div style={{ flex: '1 1 45%' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#666', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Empresa</label>
                <input type="text" placeholder="Nome da empresa" style={{ width: '100%', padding: '1rem 0', background: 'transparent', border: 'none', borderBottom: '1px solid #333', color: '#fff', outline: 'none' }} />
              </div>
            </div>

            <div data-anim="stagger" style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 45%' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#666', marginBottom: '0.5rem', textTransform: 'uppercase' }}>E-mail</label>
                <input type="email" placeholder="Seu e-mail" style={{ width: '100%', padding: '1rem 0', background: 'transparent', border: 'none', borderBottom: '1px solid #333', color: '#fff', outline: 'none' }} />
              </div>
              <div style={{ flex: '1 1 45%' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#666', marginBottom: '0.5rem', textTransform: 'uppercase' }}>WhatsApp</label>
                <input type="text" placeholder="Seu WhatsApp" style={{ width: '100%', padding: '1rem 0', background: 'transparent', border: 'none', borderBottom: '1px solid #333', color: '#fff', outline: 'none' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#666', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Conte-me sobre o projeto</label>
              <textarea placeholder="Descreva brevemente o que você precisa construir, melhorar ou automatizar." rows="4" style={{ width: '100%', padding: '1rem 0', background: 'transparent', border: 'none', borderBottom: '1px solid #333', color: '#fff', outline: 'none', resize: 'vertical' }}></textarea>
            </div>

            <button type="submit" style={{ marginTop: '2rem', alignSelf: 'flex-start', background: 'var(--cal)', color: '#000', border: 'none', padding: '1rem 3rem', fontFamily: 'var(--font-mono)', fontSize: '1rem', fontWeight: 'bold', textTransform: 'uppercase', cursor: 'pointer' }}>
              [ SEND INQUIRY ]
            </button>
            
          </form>
        </div>

      </div>
    </div>
  );
}
