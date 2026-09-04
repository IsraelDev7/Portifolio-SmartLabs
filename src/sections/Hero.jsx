import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import PlateButton from '../components/PlateButton';
import { useDeriva } from '../hooks/useDeriva';
import Letras from '../components/Letras';
import './Hero.css';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const container = useRef(null);

  /* Deriva: cada peca anda uma fracao do scroll, e a divergencia entre
     elas — nao a velocidade — e o que da a sensacao de camadas.

     O TIPO GRANDE E A ANCORA (sem atributo, fator 0). Isso e o oposto do
     que parece intuitivo, e veio da medicao da referencia: la o display
     do heroi fica cravado em 0 no scroll inteiro enquanto o texto miudo
     do canto corre a -0.40. A peca pesada segura a composicao; sao as
     leves que se deslocam em volta dela. */
  useDeriva(container);

  useGSAP(() => {
    /* Distancia ate a linha imaginaria do meio da pagina.
       offsetLeft, nao getBoundingClientRect: o rect ja vem somado dos
       transforms e mediria a posicao animada em vez da de layout. */
    const centroDeLayout = (el) => {
      let x = 0, n = el;
      while (n) { x += n.offsetLeft; n = n.offsetParent; }
      return x + el.offsetWidth / 2;
    };
    const daLinhaDoMeio = (i, el) => window.innerWidth / 2 - centroDeLayout(el);

    // ============ ENTRADA ============
    const tl = gsap.timeline({ delay: 0.2 });

    // SMA e ABS nascem na linha do meio e correm para os lados opostos.
    // Como `x` e funcao, cada um calcula o proprio deslocamento: o de fora
    // esta mais longe do centro e por isso percorre mais caminho no mesmo
    // tempo — os dois chegam juntos vindo de distancias diferentes.
    tl.from('.line-1, .line-3', {
      x: daLinhaDoMeio,
      duration: 1.4,
      ease: 'expo.out',
    }, 0);

    // RTL nao corre para lado nenhum: vem do fundo para a frente.
    tl.from('.line-2', {
      scale: 0.18,
      opacity: 0,
      transformOrigin: '50% 50%',
      duration: 1.5,
      ease: 'expo.out',
    }, 0.08);

    // As letras so carregam o fade, escalonado. O gesto de cada palavra e
    // do bloco; a letra da textura sem disputar com ele.
    tl.from('.massive-line .letra', {
      opacity: 0,
      duration: 0.7,
      stagger: { each: 0.04, from: 'start' },
      ease: 'power2.out',
    }, 0.15);

    // Bloco direito: empilhamento de cima para baixo.
    tl.from('.empilha', {
      y: -34,
      opacity: 0,
      duration: 0.85,
      stagger: 0.13,
      ease: 'power3.out',
    }, 0.45);

    // A barra do autor cresce, e o nome sai de tras dela — pela margem
    // esquerda, nao de cima como o resto do bloco.
    tl.from('.author-border', {
      scaleY: 0,
      transformOrigin: 'top',
      duration: 0.8,
      ease: 'power2.out',
    }, 0.75);

    tl.from('.hero-author-text', {
      xPercent: -100,
      duration: 0.9,
      ease: 'expo.out',
    }, 0.9);

    // Bloco esquerdo: a borda primeiro, depois cada linha saindo de tras
    // dela. O overflow:hidden da lista e o que faz a linha "existir"
    // apenas depois de passar a borda.
    tl.from('.services-border', {
      scaleY: 0,
      transformOrigin: 'top',
      duration: 0.8,
      ease: 'power2.out',
    }, 0.6);

    tl.from('.services-text p', {
      xPercent: -105,
      opacity: 0,
      duration: 0.9,
      stagger: 0.09,
      ease: 'expo.out',
    }, 0.72);

    tl.from('.hero-services-index, .hero-ctas', {
      x: -30,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: 'power2.out'
    }, 0.9);

    // ============ SCROLL: o caminho de volta ============
    // Tudo desfaz o proprio gesto de entrada, e o EXPLORE ocupa o vazio.
    // Como e scrub, subir de novo remonta a cena sozinho — a timeline nao
    // guarda estado, ela e lida na posicao do scroll.
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        // recalcula o `x` da linha do meio quando a largura muda
        invalidateOnRefresh: true,
      }
    });

    // SMA e ABS voltam para a linha do meio de onde nasceram.
    scrollTl.to('.line-1, .line-3', { x: daLinhaDoMeio, opacity: 0, ease: 'none' }, 0);

    // RTL recua para o fundo.
    scrollTl.to('.line-2', { scale: 0.18, opacity: 0, ease: 'none' }, 0);

    // Bloco esquerdo: as linhas se recolhem para tras da borda...
    scrollTl.to('.services-text p', { xPercent: -105, opacity: 0, stagger: 0.05, ease: 'none' }, 0);
    scrollTl.to('.hero-services-index, .hero-ctas', { x: -60, opacity: 0, ease: 'none' }, 0.05);
    // ...e so entao a borda recolhe, ficando por ultimo. Ela e a ultima
    // coisa a sair porque foi a primeira a entrar.
    scrollTl.to('.services-border', { scaleY: 0, transformOrigin: 'top', ease: 'none' }, 0.3);

    // Bloco direito: desempilha para cima, na ordem inversa da entrada.
    scrollTl.to('.empilha', { y: -34, opacity: 0, stagger: { each: 0.06, from: 'end' }, ease: 'none' }, 0);
    // O autor volta por onde veio: para tras da propria margem.
    scrollTl.to('.hero-author-text', { xPercent: -100, opacity: 0, ease: 'none' }, 0.05);
    scrollTl.to('.author-border', { scaleY: 0, transformOrigin: 'top', ease: 'none' }, 0.3);

    scrollTl.to('.grid-num', { opacity: 0, ease: 'none' }, 0);

    // EXPLORE toma o lugar deixado — cinza translucido, marca d'agua e
    // nao manchete. Em Solda ele competiria com o tipo que acabou de sair.
    scrollTl.fromTo('.hero-explore-text',
      { y: '18vh', opacity: 0, scale: 0.86 },
      { y: '0vh', opacity: 0.45, scale: 1, ease: 'none' },
      0.12
    );

  }, { scope: container });

  return (
    <section className="hero-section" ref={container}>
      {/* Background Image */}
      <div className="hero-bg-image" data-deriva="0.20"></div>

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
        <div className="massive-line line-1" aria-label="SMA"><Letras texto="SMA" /></div>
        <div className="massive-line line-2" aria-label="RTL"><Letras texto="RTL" /></div>
        <div className="massive-line line-3" aria-label="ABS"><Letras texto="ABS" /></div>
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
        <div className="hero-block-top">
          <h2 className="hero-headline font-display" data-deriva="-0.40">
            <span className="empilha text-solda">A FORMA DO SEU NEGÓCIO</span>
            <span className="empilha text-cal">NO MUNDO DIGITAL.</span>
          </h2>
          <p className="hero-subheadline empilha" data-deriva="-0.30">
            Seu negócio pode ser excelente.<br/>
            Mas se a sua presença digital não transmite isso,<br/>
            você está deixando valor na mesa.
          </p>
          <div className="hero-author-container" data-deriva="-0.15" style={{ position: 'relative', display: 'flex' }}>
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
        <div className="hero-block-bottom" data-deriva="-0.18">
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
