import React from 'react';
import MaskReveal from '../components/MaskReveal';
import PlateButton from '../components/PlateButton';
import { LogoHorizontal } from '../components/Logo';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: 'var(--chapa)', paddingTop: 'var(--space-20)', paddingBottom: 'var(--space-6)' }}>
      <div className="container">
        
        {/* S10 - CTA */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-20)' }}>
          <span className="plate" style={{ marginBottom: 'var(--space-6)' }}>Inicie seu projeto</span>
          <MaskReveal tag="h2" style={{ marginBottom: 'var(--space-8)', fontSize: 'clamp(32px, 6vw, 80px)' }}>
            Pronto para elevar<br/>
            sua operação?
          </MaskReveal>
          
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <PlateButton href="mailto:contato@smartlabs.ai">Falar com a SmartLabs</PlateButton>
          </div>
        </div>

        <div className="section-divider" style={{ marginBottom: 'var(--space-8)' }}></div>

        {/* S11 - Footer */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 'var(--space-8)', alignItems: 'end' }}>
          
          <div>
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <LogoHorizontal color="var(--cal)" size={200} />
            </div>
            <div className="label">
              Goiânia, BR · Londres, UK
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <ul className="label" style={{ display: 'flex', gap: 'var(--space-4)' }}>
              <li><a href="#" style={{ color: 'var(--cal)' }}>LinkedIn</a></li>
              <li><a href="#" style={{ color: 'var(--cal)' }}>Instagram</a></li>
              <li><a href="#" style={{ color: 'var(--cal)' }}>GitHub</a></li>
            </ul>
            <div className="label" style={{ marginTop: 'var(--space-2)' }}>
              © {new Date().getFullYear()} SmartLabs AI. Todos os direitos reservados.
            </div>
          </div>

        </div>

      </div>

      <style>{`
        @media (max-width: 800px) {
          .container > div:last-child { grid-template-columns: 1fr !important; gap: var(--space-8); }
          .container > div:last-child > div { text-align: left !important; }
        }
      `}</style>
    </footer>
  );
}
