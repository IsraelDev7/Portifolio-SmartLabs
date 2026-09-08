import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * RedesPixel — os icones de rede montando em pixel.
 *
 * Mesma gramatica da marca na barra: cada peca guarda o SEU lado de
 * abertura e o SEU deslocamento, sorteados uma vez so, e o ease e
 * `steps`. Interpolacao continua faria o icone deslizar; em degraus ele
 * salta de um estado a outro, que e como bloco de imagem se resolve.
 *
 * So as redes que existem de verdade. Icone de perfil que nao existe e
 * link quebrado esperando para acontecer.
 */

const LADOS = [
  'inset(0% 0% 100% 0%)',
  'inset(100% 0% 0% 0%)',
  'inset(0% 100% 0% 0%)',
  'inset(0% 0% 0% 100%)',
];

const CAIXA = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

const REDES = [
  {
    nome: 'Instagram',
    url: 'https://www.instagram.com/israelp.fernandes/',
    glifo: (
      <svg {...CAIXA}>
        <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5" />
        <circle cx="12" cy="12" r="4.1" />
        <circle cx="17.2" cy="6.8" r="1.05" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    nome: 'X',
    url: 'https://x.com/home',
    glifo: (
      <svg {...CAIXA}>
        <path d="M4 4l7.4 9.1L4.6 20M20 20l-7.4-9.1L19.4 4" />
      </svg>
    ),
  },
  {
    nome: 'LinkedIn',
    url: 'https://www.linkedin.com/in/israel-passos-281374336/',
    glifo: (
      <svg {...CAIXA}>
        <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="2.2" />
        <path d="M7.4 10.4v6.2M11.2 16.6v-6.2M11.2 13.1c0-1.5 1-2.7 2.4-2.7s2.4 1.2 2.4 2.7v3.5" />
        <circle cx="7.4" cy="7.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    nome: 'E-mail',
    url: 'mailto:israel.devpf@gmail.com',
    glifo: (
      <svg {...CAIXA}>
        <rect x="2.8" y="5" width="18.4" height="14" rx="1.8" />
        <path d="M3.4 6.6L12 12.8l8.6-6.2" />
      </svg>
    ),
  },
];

export default function RedesPixel({ className = '' }) {
  const alvo = useRef(null);

  useGSAP(() => {
    const pecas = gsap.utils.toArray(alvo.current.querySelectorAll('.rp__peca'));
    if (!pecas.length) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(pecas, { clearProps: 'all', opacity: 1 });
      return;
    }

    pecas.forEach((el) => {
      el._caos = {
        x: gsap.utils.random(-8, 8),
        y: gsap.utils.random(-10, 10),
        lado: gsap.utils.random(LADOS),
      };
    });

    const fechada = {
      x: (i, el) => el._caos.x,
      y: (i, el) => el._caos.y,
      clipPath: (i, el) => el._caos.lado,
      opacity: 0,
      scale: 0.55,
    };

    gsap.fromTo(pecas, fechada, {
      x: 0, y: 0, scale: 1, opacity: 1,
      clipPath: 'inset(0% 0% 0% 0%)',
      duration: 0.4,
      ease: 'steps(5)',
      stagger: { each: 0.07, from: 'random' },
      scrollTrigger: {
        trigger: alvo.current,
        start: 'top 90%',
        toggleActions: 'restart none none reverse',
      },
    });
  }, { scope: alvo });

  return (
    <ul ref={alvo} className={`rp ${className}`}>
      {REDES.map((r) => (
        <li key={r.nome}>
          <a
            className="rp__peca"
            href={r.url}
            target={r.url.startsWith('mailto:') ? undefined : '_blank'}
            rel="noreferrer"
            aria-label={r.nome}
          >
            {r.glifo}
          </a>
        </li>
      ))}
    </ul>
  );
}
