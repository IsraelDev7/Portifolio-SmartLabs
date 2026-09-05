import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Moldura — a borda se desenha em traco continuo com o scroll.
 *
 * Quatro linhas em vez de um `border`, porque borda de CSS nao tem como
 * ser desenhada: ela existe inteira ou nao existe. Aqui cada lado e um
 * elemento proprio que cresce a partir da ponta onde o traco anterior
 * parou — topo da esquerda para a direita, direita de cima para baixo,
 * base da direita para a esquerda, esquerda de baixo para cima.
 *
 * E por isso que a origem de cada uma e diferente. Se as quatro
 * crescessem do mesmo canto, seriam quatro riscos aparecendo juntos, nao
 * um contorno sendo tracado.
 *
 * Preferi isto a um <rect> SVG com stroke-dashoffset: o SVG precisaria
 * de viewBox fixo e a espessura distorceria junto com a caixa, que aqui
 * e fluida.
 */
export default function Moldura({ children, className = '', style }) {
  const caixa = useRef(null);

  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lados = caixa.current.querySelectorAll('.moldura__lado');

    gsap.from(lados, {
      // topo e base crescem na horizontal, laterais na vertical
      scaleX: (i) => (i % 2 === 0 ? 0 : 1),
      scaleY: (i) => (i % 2 === 0 ? 1 : 0),
      duration: 0.55,
      ease: 'power2.inOut',
      stagger: 0.16,
      scrollTrigger: {
        trigger: caixa.current,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    });
  }, { scope: caixa });

  return (
    <div ref={caixa} className={`moldura ${className}`} style={style}>
      <i className="moldura__lado moldura__lado--topo" />
      <i className="moldura__lado moldura__lado--dir" />
      <i className="moldura__lado moldura__lado--base" />
      <i className="moldura__lado moldura__lado--esq" />
      {children}
    </div>
  );
}
