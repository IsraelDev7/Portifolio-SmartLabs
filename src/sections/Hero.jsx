import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import PlateButton from '../components/PlateButton';
import { useDeriva } from '../hooks/useDeriva';
import './Hero.css';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const container = useRef(null);

  /* Deriva: cada peca anda uma fracao do scroll. Os tres blocos de tipo
     sobem em velocidades diferentes e a imagem DESCE — nao e a
     velocidade que da a sensacao de camadas, e a divergencia entre elas.
     A grade 001-004 fica de fora de proposito: e a ancora parada que faz
     o olho perceber que o resto se move. */
  useDeriva(container);

  useGSAP(() => {
    // Initial Load Animations (Entry)
    const tl = gsap.timeline({ delay: 0.2 });
    
    // 1. Massive text entry
    tl.from('.massive-line', {
      yPercent: 100,
      opacity: 0,
      duration: 1.2,
      stagger: 0.15,
      ease: 'expo.out',
    });

    // 2. Right block entry (Slides right to left)
    tl.from('.hero-headline, .hero-subheadline', {
      x: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.1,
      ease: 'power2.out',
    }, "-=0.8");

    // Right block Author entry (Margin grows top-down, text slides top-down)
    tl.from('.author-border', {
      scaleY: 0,
      transformOrigin: 'top',
      duration: 0.8,
      ease: 'power2.out',
    }, "-=0.6");
    
    tl.from('.hero-author-text', {
      yPercent: -100,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
    }, "-=0.6");

    // 3. Left block entry (Text left-to-right, border top-to-bottom)
    tl.from('.hero-services-index, .hero-ctas', {
      x: -30,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: 'power2.out'
    }, "-=0.8");
    
    tl.from('.services-border', {
      scaleY: 0,
      transformOrigin: 'top',
      duration: 0.8,
      ease: 'power2.out'
    }, "-=0.6");
    
    tl.from('.services-text', {
      x: -30,
      opacity: 0,
      duration: 1,
      ease: 'power2.out'
    }, "-=0.6");


    // SCROLL ANIMATIONS (Non-pinned, fluid scrub)
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: "top top",
        end: "bottom top", // As the hero section scrolls out of view
        scrub: true,
      }
    });

    // Fade out Left Block (Moves into the left margin)
    scrollTl.to('.hero-block-bottom', { x: -150, opacity: 0 }, 0);
    
    // Fade out Right Block (Moves to the right margin)
    scrollTl.to('.hero-block-top', { x: 150, opacity: 0 }, 0);
    
    // Fade out Grid numbers
    scrollTl.to('.grid-num', { opacity: 0 }, 0);

    // Massive Text Divides in the middle (SMARTLABS split)
    // line-1 (SMA) and line-3 (ABS) go left, line-2 (RTL) goes right
    scrollTl.to('.line-1, .line-3', { xPercent: -50, opacity: 0 }, 0);
    scrollTl.to('.line-2', { xPercent: 50, opacity: 0 }, 0);

    // EXPLORE text emerges as you scroll down
    scrollTl.fromTo('.hero-explore-text', {
      y: '20vh',
      opacity: 0,
      scale: 0.8
    }, {
      y: '0vh',
      opacity: 1,
      scale: 1
    }, 0);
    
  }, { scope: container });

  return (
    <section className="hero-section" ref={container}>
      {/* Background Image */}
      <div className="hero-bg-image" data-deriva="0.18"></div>

      {/* Grid Lines */}
      <div className="hero-grid">
        {[
          { num: '001', title: 'DISCOVERY' },
          { num: '002', title: 'DESIGN' },
          { num: '003', title: 'BUILD' },
          { num: '004', title: 'SCALE' }
        ].map((item) => (
          <div className="grid-line" key={item.num}>
            <span className="grid-num">{item.num}</span>
            <div className="grid-phase-container">
              <span className="grid-phase">
                <span className="text-cal">FASE</span>
                <span className="text-solda">/{item.title}</span>
              </span>
              <div className="grid-level">
                <div className="level-dot active blink"></div>
                <div className="level-dot"></div>
                <div className="level-dot"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Massive Typography */}
      <div className="hero-massive-text">
        <div className="massive-line line-1" data-deriva="-0.40">SMA</div>
        <div className="massive-line line-2" data-deriva="-0.30">RTL</div>
        <div className="massive-line line-3" data-deriva="-0.20">ABS</div>
      </div>

      {/* EXPLORE Text Sequence */}
      <div className="hero-explore-container">
        <div className="hero-explore-text font-display">
          EXPLORE
        </div>
      </div>

      {/* Content Blocks */}
      <div className="hero-content">
        
        {/* Top Right Block */}
        <div className="hero-block-top" data-deriva="-0.10">
          <h2 className="hero-headline font-display">
            <span className="text-solda">A FORMA DO SEU NEGÓCIO</span><br/>
            <span className="text-cal">NO MUNDO DIGITAL.</span>
          </h2>
          <p className="hero-subheadline">
            Seu negócio pode ser excelente.<br/>
            Mas se a sua presença digital não transmite isso,<br/>
            você está deixando valor na mesa.
          </p>
          <div className="hero-author-container" style={{ position: 'relative', display: 'flex' }}>
            <div className="author-border" style={{ width: '7px', backgroundColor: 'var(--solda)', marginRight: '10px' }}></div>
            <div style={{ overflow: 'hidden' }}>
              <div className="hero-author hero-author-text" style={{ paddingLeft: 0 }}>
                <span className="author-name">ISRAEL PASSOS</span>
                <span className="author-role">ARQUITETO DE AI</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Left Block */}
        <div className="hero-block-bottom">
          <div className="hero-services-layout">
            <div className="hero-services-index">
              <span className="index-label">SML/IP</span>
              <span className="index-year">2026</span>
            </div>
            
            <div className="hero-services-list font-mono" style={{ position: 'relative', paddingLeft: 'var(--space-2)' }}>
              <div className="services-border" style={{ position: 'absolute', top: 0, left: 0, width: '7px', height: '100%', backgroundColor: '#333333' }}></div>
              <div className="services-text">
                <p>Da identidade visual à arquitetura do site.</p>
                <p>Da experiência do usuário à segurança.</p>
                <p>Da captação de tráfego ao atendimento.</p>
                <p>Da apresentação da sua marca à automação<br/>dos processos que acontecem por trás dela.</p>
                <p className="hero-highlight">Eu dou forma ao seu negócio digital.</p>
              </div>
            </div>
          </div>
          
          <div className="hero-ctas">
            <PlateButton href="#projetos">CONHECER A SMARTLABS</PlateButton>
            <PlateButton href="#contato" variant="secondary">FALAR SOBRE MEU PROJETO</PlateButton>
          </div>
        </div>

      </div>
    </section>
  );
}
