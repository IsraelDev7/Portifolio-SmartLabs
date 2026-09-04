import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import { useGSAP } from '@gsap/react';
import './Sobre.css';

gsap.registerPlugin(ScrollTrigger, Flip);

export default function Sobre() {
  const container = useRef(null);
  const galleryRef = useRef(null);

  const images = [
    '/images/sobre_identidade_ux.jpg',
    '/images/sobre_website_perf.jpg',
    '/images/sobre_ai_automation.jpg',
    '/images/sobre_security_infra.jpg'
  ];

  useGSAP(() => {
    const topics = gsap.utils.toArray('.sobre-topic');
    const galleryEl = galleryRef.current;
    let currentLayout = 0;

    topics.forEach((topic, i) => {
      ScrollTrigger.create({
        trigger: topic,
        start: 'center center',
        onEnter: () => changeLayout(i),
        onEnterBack: () => changeLayout(i),
      });
    });

    function changeLayout(newLayoutIndex) {
      if (newLayoutIndex === currentLayout) return;
      
      const items = galleryEl.querySelectorAll('.gallery__item');
      
      // 1. Capture current state before changing classes
      const state = Flip.getState(items, { props: 'filter, opacity' });
      
      // 2. Apply new layout class
      galleryEl.classList.remove(`layout-${currentLayout}`);
      galleryEl.classList.add(`layout-${newLayoutIndex}`);
      
      // 3. Animate using Flip
      Flip.from(state, {
        duration: 1.2,
        ease: 'power3.inOut',
        scale: true,
        absolute: true,
        stagger: 0.05, // Slight stagger for a more organic feel
      });
      
      currentLayout = newLayoutIndex;
    }
  }, { scope: container });

  return (
    <section className="sobre-section" id="sobre" ref={container}>
      
      {/* INTRO COPY */}
      <div className="sobre-intro-text">
        <h2 className="sobre-intro-title">
          Não é apenas um site.<br/>
          <span className="highlight">É a sede digital da sua empresa.</span>
        </h2>
        <div style={{ maxWidth: '800px' }}>
          <p className="sobre-intro-p">
            Imagine alguém chegando pela primeira vez ao seu negócio.<br/>
            Essa pessoa não conhece você. Ela não sabe quanto você investiu para construir sua empresa. Ela não conhece sua experiência.
          </p>
          <p className="sobre-intro-p">
            Ela só consegue julgar aquilo que consegue ver.<br/>
            <strong>Seu site é uma dessas primeiras impressões.</strong>
          </p>
          <p className="sobre-intro-p">
            Por isso, ele não deveria ser apenas uma página bonita.<br/>
            Ele deveria representar o nível do negócio que existe por trás dela.
          </p>
          <p className="sobre-intro-p">
            Na SmartLabs, eu penso o digital como um arquiteto pensa um projeto:<br/>
            <strong>estrutura primeiro. estética depois. função em tudo.</strong>
          </p>
          <p className="sobre-intro-p" style={{ color: 'var(--text-color)' }}>
            O resultado é uma presença digital sofisticada, estratégica e preparada para crescer.
          </p>
        </div>
      </div>

      {/* SCROLLING SECTIONS WITH GALLERY */}
      <div className="sobre-scroll-container">
        
        {/* Left Column: Text (Scrolls) */}
        <div className="sobre-text-column">
          <div style={{ marginBottom: '20vh' }}>
            <h2 className="sobre-intro-title" style={{ fontSize: 'clamp(2rem, 4vw, 4rem)' }}>
              O QUE EU CONSTRUO
            </h2>
            <p className="sobre-intro-p">
              Uma experiência de alto padrão por fora.<br/>
              Uma operação inteligente por dentro.
            </p>
          </div>

          <div className="sobre-topic">
            <div className="sobre-topic-number">01</div>
            <h3 className="sobre-topic-title">Identidade & Experiência</h3>
            <p className="sobre-topic-desc">
              Sua marca precisa ser percebida antes mesmo de ser explicada.
              Construo e organizo a identidade visual e a experiência digital para transmitir posicionamento, confiança e valor.
            </p>
            <ul className="sobre-topic-list">
              <li>Identidade visual</li>
              <li>Direção estética</li>
              <li>UI/UX</li>
              <li>Design de interfaces</li>
              <li>Experiência do usuário</li>
              <li>Design de alto padrão</li>
            </ul>
          </div>

          <div className="sobre-topic">
            <div className="sobre-topic-number">02</div>
            <h3 className="sobre-topic-title">Websites de Alto Padrão</h3>
            <p className="sobre-topic-desc">
              Não trabalho para simplesmente colocar sua empresa na internet.
              Construo uma presença digital pensada para apresentar seu negócio, conduzir o visitante e transformar atenção em ação.
            </p>
            <ul className="sobre-topic-list">
              <li>Websites personalizados</li>
              <li>Landing pages</li>
              <li>Arquitetura de informação</li>
              <li>Desenvolvimento Full Stack</li>
              <li>Performance</li>
              <li>Responsividade</li>
              <li>Experiência premium</li>
            </ul>
            <p className="sobre-topic-desc" style={{ marginTop: '1rem', color: 'var(--text-color)' }}>
              Seu site deixa de ser um cartão de visitas. <strong>Ele passa a trabalhar pelo seu negócio.</strong>
            </p>
          </div>

          <div className="sobre-topic">
            <div className="sobre-topic-number">03</div>
            <h3 className="sobre-topic-title">Automação & Inteligência Artificial</h3>
            <p className="sobre-topic-desc">
              A parte que o cliente vê é apenas metade do projeto. Por trás dela podem existir processos inteligentes trabalhando continuamente.
              Automatizo operações para reduzir tarefas manuais, acelerar respostas e criar processos mais eficientes.
            </p>
            <ul className="sobre-topic-list">
              <li>Atendimento e Follow-up</li>
              <li>Captação e qualificação de leads</li>
              <li>CRM e Processos internos</li>
              <li>Gestão, Marketing e Vendas</li>
              <li>Integrações</li>
              <li>Agentes e sistemas com IA</li>
            </ul>
            <p className="sobre-topic-desc" style={{ marginTop: '1rem', color: 'var(--text-color)' }}>
              A tecnologia deixa de ser apenas uma ferramenta. <strong>Ela passa a fazer parte da operação.</strong>
            </p>
          </div>

          <div className="sobre-topic">
            <div className="sobre-topic-number">04</div>
            <h3 className="sobre-topic-title">Segurança & Infraestrutura</h3>
            <p className="sobre-topic-desc">
              Um negócio de alto nível precisa de uma fundação à altura. Por isso, segurança não é um detalhe colocado no final do projeto. É considerada desde a arquitetura.
            </p>
            <ul className="sobre-topic-list">
              <li>Segurança da aplicação</li>
              <li>Boas práticas de desenvolvimento</li>
              <li>Proteção de dados</li>
              <li>Controle de acessos</li>
              <li>Estrutura técnica</li>
              <li>Monitoramento e manutenção</li>
            </ul>
            <p className="sobre-topic-desc" style={{ marginTop: '1rem', color: 'var(--text-color)' }}>
              Porque não adianta construir uma casa bonita se a porta da frente fica aberta.
            </p>
          </div>

          {/* Spacer to allow scrolling past the last item comfortably */}
          <div style={{ height: '30vh' }}></div>
        </div>

        {/* Right Column: Gallery (Pinned/Sticky) */}
        <div className="sobre-gallery-column">
          {/* Initial layout is layout-0 */}
          <div className="gallery layout-0" ref={galleryRef}>
            {images.map((src, index) => (
              <div 
                key={index} 
                className={`gallery__item item-${index}`} 
                style={{ backgroundImage: `url(${src})` }}
              ></div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
