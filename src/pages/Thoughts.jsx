import React from 'react';
import { usePageMotion } from '../hooks/usePageMotion';

export default function Thoughts() {
  const motionRef = usePageMotion();
  const testimonials = [
    {
      text: "[ DEPOIMENTO DO CLIENTE ]",
      author: "[ NOME ]",
      role: "[ CARGO / EMPRESA ]"
    },
    {
      text: "[ DEPOIMENTO DO CLIENTE ]",
      author: "[ NOME ]",
      role: "[ CARGO / EMPRESA ]"
    },
    {
      text: "[ DEPOIMENTO DO CLIENTE ]",
      author: "[ NOME ]",
      role: "[ CARGO / EMPRESA ]"
    }
  ];

  return (
    <div ref={motionRef} style={{ paddingTop: '15vh', backgroundColor: '#000', minHeight: '100vh', color: '#fff' }}>
      
      {/* HEADER */}
      <div style={{ padding: '5vw' }}>
        <h1 data-anim="rise" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(4rem, 8vw, 10rem)', lineHeight: '0.9', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
          THOUGHTS
        </h1>
        <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', color: '#888', marginTop: '2rem', textTransform: 'uppercase', maxWidth: '600px', lineHeight: '1.6' }}>
          O QUE DIZEM SOBRE O MEU TRABALHO.<br/>UMA BOA EXPERIÊNCIA NÃO PRECISA SER EXPLICADA. ELA É PERCEBIDA. E AS MELHORES PROVAS DO MEU TRABALHO VÊM DE QUEM ESTEVE DO OUTRO LADO DO PROJETO.
        </h2>
      </div>

      {/* TESTIMONIALS */}
      <div data-anim="stagger" style={{ padding: '5vw', display: 'flex', flexDirection: 'column', gap: '10vw', borderTop: '1px solid #333' }}>
        {testimonials.map((t, idx) => (
          <div key={idx} style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem' }}>
            <div style={{ flex: '1 1 20%', fontFamily: 'var(--font-mono)', color: 'var(--cal)', textTransform: 'uppercase', fontSize: '0.9rem' }}>
              0{idx + 1} // THOUGHT
            </div>
            <div style={{ flex: '1 1 70%' }}>
              <h3 data-anim="rise" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 5rem)', lineHeight: '1.1', textTransform: 'uppercase', marginBottom: '2rem' }}>
                "{t.text}"
              </h3>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: '#aaa', textTransform: 'uppercase' }}>
                <strong style={{ color: '#fff', display: 'block' }}>{t.author}</strong>
                {t.role}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CLOSING STATEMENT */}
      <div style={{ padding: '15vw 5vw', backgroundColor: 'var(--cal)', color: '#000', textAlign: 'center' }}>
        <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', marginBottom: '2rem', textTransform: 'uppercase' }}>
          NÃO É SOBRE O QUE EU DIGO QUE FAÇO.
        </h3>
        <h2 data-anim="rise" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 6vw, 8rem)', lineHeight: '0.9', textTransform: 'uppercase' }}>
          É SOBRE O QUE O MEU TRABALHO FAZ PELO NEGÓCIO.
        </h2>
      </div>

    </div>
  );
}
