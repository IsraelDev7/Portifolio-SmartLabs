import React from 'react';
import MaskReveal from '../components/MaskReveal';
import Frame from '../components/Frame';
import RollLink from '../components/RollLink';

export default function Projetos() {
  const cases = [
    {
      title: "Plataforma de IA Generativa",
      client: "TechCorp",
      year: "2026",
      role: "Full Stack & UI",
      image: "/images/galeria.jpg" // using the placeholder image provided
    },
    {
      title: "Dashboard Analítico",
      client: "FinData",
      year: "2025",
      role: "UX/UI Design",
      image: "/images/galeria.jpg"
    }
  ];

  return (
    <section id="cases" className="section" style={{ backgroundColor: 'var(--grafite)' }}>
      <div className="container">
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--space-12)' }}>
          <MaskReveal tag="h2">
            Trabalho<br/>
            Selecionado
          </MaskReveal>
          
          <div className="label">
            [ 2024 — 2026 ]
          </div>
        </div>

        <div className="cases-grid" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
          {cases.map((c, i) => (
            <div key={i} className="case-card" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-8)', alignItems: 'center' }}>
              <div className="case-info" style={{ order: i % 2 === 0 ? 1 : 2 }}>
                <span className="plate" style={{ marginBottom: 'var(--space-4)' }}>{c.year}</span>
                <h3 style={{ marginBottom: 'var(--space-4)' }}>{c.title}</h3>
                
                <ul className="label" style={{ marginBottom: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  <li>Cliente: {c.client}</li>
                  <li>Papel: {c.role}</li>
                </ul>

                <RollLink href="#" className="font-mono text-solda" style={{ fontSize: 'var(--text-xs)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  Ver Estudo de Caso
                </RollLink>
              </div>
              
              <div className="case-image" style={{ order: i % 2 === 0 ? 2 : 1 }}>
                <Frame>
                  <img src={c.image} alt={c.title} style={{ width: '100%', height: 'auto', display: 'block', aspectRatio: '4/3', objectFit: 'cover' }} />
                </Frame>
              </div>
            </div>
          ))}
        </div>

      </div>

      <style>{`
        @media (max-width: 800px) {
          .case-card { grid-template-columns: 1fr !important; }
          .case-info { order: 2 !important; }
          .case-image { order: 1 !important; }
        }
      `}</style>
    </section>
  );
}
