import React from 'react';
import MaskReveal from '../components/MaskReveal';
import AccordionList from '../components/AccordionList';

export default function ProcessoServicos() {
  const servicos = [
    {
      title: "Websites de Alto Padrão",
      content: "Arquitetura digital projetada para performance, estética e conversão. Não fazemos apenas sites, construímos plataformas que representam a magnitude do seu negócio.",
      list: ["React & Next.js", "GSAP & WebGL", "SEO Estrutural", "Performance Vercel"]
    },
    {
      title: "Automação & Inteligência Artificial",
      content: "Implementação de sistemas de IA para escalar atendimento, qualificar leads e integrar processos complexos sem aumentar o custo operacional.",
      list: ["Chatbots Customizados", "Integrações N8N", "Agentes Autônomos", "Scraping & Dados"]
    },
    {
      title: "UX/UI & Identidade Visual",
      content: "Criamos interfaces que transmitem autoridade e guiam o usuário de forma intuitiva, conectando a essência da sua marca com a funcionalidade da interface.",
      list: ["Design Systems", "Prototipagem Figma", "Auditoria de Experiência"]
    }
  ];

  return (
    <section className="section">
      <div className="container">
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-8)' }}>
          <div>
            <MaskReveal tag="h2" style={{ marginBottom: 'var(--space-4)' }}>
              Arquitetura<br/>
              Completa.
            </MaskReveal>
            <p className="text-fumaca" style={{ maxWidth: '40ch' }}>
              Nossa abordagem une design obcecado por detalhes, engenharia de software robusta e inteligência artificial para entregar resultados mensuráveis.
            </p>
          </div>

          <div>
            <span className="plate" style={{ marginBottom: 'var(--space-6)' }}>Serviços & Processo</span>
            <AccordionList items={servicos} />
          </div>
        </div>

      </div>
      
      <style>{`
        @media (max-width: 800px) {
          .container > div { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
