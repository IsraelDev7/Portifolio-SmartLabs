import React from 'react';
import Marquee from '../components/Marquee';

export default function MarqueeSection() {
  return (
    <section style={{ padding: 'var(--space-8) 0', borderTop: '1px solid var(--linha)', borderBottom: '1px solid var(--linha)' }}>
      <Marquee 
        text="Desenvolvimento Web · Inteligência Artificial · Identidade Visual · Automação · " 
        speed={1.5} 
        className="font-mono text-solda uppercase" 
        style={{ fontSize: 'var(--text-lg)', letterSpacing: '0.1em' }}
      />
    </section>
  );
}
