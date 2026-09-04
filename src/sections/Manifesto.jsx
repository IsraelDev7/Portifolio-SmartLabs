import React from 'react';
import { useScrubWords } from '../hooks/useScrubWords';

export default function Manifesto() {
  const { containerRef, renderScrubText } = useScrubWords();

  const manifestoText = "A internet está cheia de ruído. Sites genéricos, templates descartáveis e experiências frustrantes. Nós construímos o oposto. Desenvolvemos presenças digitais que transmitem autoridade imediata, com design obsessivo e tecnologia que funciona.";

  return (
    <section className="section" style={{ backgroundColor: 'var(--aco)' }}>
      <div className="container" ref={containerRef}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 48px)', lineHeight: '1.2', fontWeight: '400', fontFamily: 'var(--font-body)' }}>
            {renderScrubText(manifestoText)}
          </h2>
          
          <div style={{ marginTop: 'var(--space-8)' }}>
            <span className="plate">A Filosofia SmartLabs</span>
          </div>
        </div>
      </div>
    </section>
  );
}
