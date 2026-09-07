import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Firma — a assinatura de punho, desenhada traco a traco.
 *
 * Nao e fonte cursiva com mascara passando por cima: sao caminhos de
 * verdade, e a animacao percorre CADA TRACO com stroke-dashoffset. E a
 * diferenca entre escrever e revelar — a mascara varre em linha reta e
 * atravessa o meio das letras, enquanto o traco segue o caminho da caneta,
 * sobe nas hastes e volta nos lacos.
 *
 * Os caminhos foram desenhados a mao e conferidos rasterizados em 200,
 * 280 e 360px, que sao os tamanhos de uso. Assinatura nao se soletra: em
 * corpo grande cada letra fica ambigua, e em corpo de uso ela le como
 * gesto — que e o que uma assinatura e.
 *
 * A ordem dos <path> e a ordem da caneta. Trocar a ordem no JSX troca a
 * ordem da escrita.
 */

/* 0.34s por traco com 0.13 de intervalo: os tracos se sobrepoem, entao a
   caneta nunca "para" entre um e outro. Sem sobreposicao a escrita fica
   picotada. */
const DUR = 0.34;
const PASSO = 0.13;

export default function Firma({ className = '', largura = 260 }) {
  const alvo = useRef(null);

  useGSAP(() => {
    const tracos = gsap.utils.toArray(alvo.current.querySelectorAll('path'));

    /* getTotalLength no lugar de um numero fixo: o comprimento depende do
       caminho, e chutar um valor deixa traco cortado ou com espera morta
       no fim. */
    tracos.forEach((p) => {
      const L = p.getTotalLength();
      gsap.set(p, { strokeDasharray: L, strokeDashoffset: L });
    });

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(tracos, { strokeDashoffset: 0 });
      return;
    }

    gsap.to(tracos, {
      strokeDashoffset: 0,
      duration: DUR,
      stagger: PASSO,
      ease: 'power1.inOut',
      scrollTrigger: {
        trigger: alvo.current,
        start: 'top 85%',
        toggleActions: 'restart none none reverse',
      },
    });
  }, { scope: alvo });

  return (
    <svg
      ref={alvo}
      className={`firma ${className}`}
      viewBox="0 0 640 170"
      width={largura}
      height={Math.round((largura * 170) / 640)}
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label="Assinatura de Israel Passos"
    >
      {/* I — laco alto */}
      <path d="M46 126 C42 96 54 46 74 40 C86 37 86 54 74 70 C62 86 54 104 60 118 C65 129 78 128 88 116" />
      {/* s */}
      <path d="M90 120 C96 104 108 94 118 98 C126 101 120 110 110 116 C100 122 98 130 108 131 C118 132 126 124 132 112" />
      {/* r */}
      <path d="M132 126 C136 112 140 100 143 96 C145 108 150 100 159 94" />
      {/* a */}
      <path d="M194 100 C184 91 170 99 168 113 C166 126 178 132 188 122 C196 114 198 102 198 94 C198 106 196 121 202 127 C207 132 216 127 222 117" />
      {/* e */}
      <path d="M226 112 C238 108 248 106 254 106 C252 96 240 94 232 102 C224 110 226 126 238 130 C248 133 258 126 266 114" />
      {/* l */}
      <path d="M268 122 C278 100 290 66 298 44 C303 30 298 26 292 38 C286 50 282 92 290 118 C295 133 308 132 318 120" />

      {/* P — haste com barriga */}
      <path d="M348 152 C352 112 358 66 364 44 C368 30 380 30 386 40 C393 52 384 72 366 78 C356 81 348 80 344 78" />
      {/* a */}
      <path d="M424 100 C414 91 400 99 398 113 C396 126 408 132 418 122 C426 114 428 102 428 94 C428 106 426 121 432 127 C437 132 446 127 452 117" />
      {/* s */}
      <path d="M454 120 C460 104 472 94 482 98 C490 101 484 110 474 116 C464 122 462 130 472 131 C482 132 490 124 496 112" />
      {/* s */}
      <path d="M498 120 C504 104 516 94 526 98 C534 101 528 110 518 116 C508 122 506 130 516 131 C526 132 534 124 540 112" />
      {/* o */}
      <path d="M570 104 C562 96 548 100 546 114 C544 128 558 134 568 124 C577 115 576 102 566 98 C574 100 580 108 584 116" />
      {/* s final */}
      <path d="M586 120 C592 104 604 94 614 98 C622 101 616 110 606 116 C596 122 594 130 604 131" />
      {/* floreio — o ultimo traco, mais fino */}
      <path
        d="M50 146 C146 158 302 160 422 150 C482 145 522 138 548 130"
        strokeWidth="2.4"
        opacity="0.75"
      />
    </svg>
  );
}
