import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

/**
 * Falha — a imagem em faixas que escorregam, como um defeito de sinal.
 *
 * A imagem NAO existe como peca inteira: sao `faixas` copias empilhadas,
 * cada uma recortada por clip-path numa fatia horizontal diferente e
 * todas com o mesmo background-position. Juntas elas remontam a foto
 * exatamente; separadas, cada uma pode escorregar sozinha.
 *
 * Nao ha camada de base por baixo de proposito. Quando uma faixa desliza,
 * o que aparece na borda e o fundo escuro do container — e o bloco preto
 * que da o aspecto de dado corrompido. Com uma foto intacta por baixo o
 * efeito viraria um borrao, nao uma falha.
 *
 * As faixas se sobrepoem em SANGRIA: clip-path corta no subpixel e duas
 * fatias vizinhas exatas deixam um fio do fundo aparecendo o tempo todo.
 *
 * So x anima — nunca largura, posicao ou filtro. Transform vai para a
 * GPU e o resto obriga o navegador a redesenhar a imagem inteira a cada
 * quadro, o que num loop continuo custaria caro sem aparecer.
 */

const SANGRIA = 0.35;   // % de sobreposicao entre faixas vizinhas

/* Ritmo: o defeito precisa ser raro. Um piscar a cada 0.9-2.6s le como
   bug; a cada 200ms le como animacao, e ai vira enfeite. */
const PARADA = [0.9, 2.6];
const DESLOC = [6, 26];   // px
const CHANCE = 0.3;       // fracao das faixas que escorrega por vez

export default function Falha({ imagem, faixas = 14, className = '', posicao = 'center 18%' }) {
  const alvo = useRef(null);

  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const tiras = gsap.utils.toArray(alvo.current.querySelectorAll('.falha__tira'));
    if (!tiras.length) return;

    /* repeatRefresh: sem ele o GSAP sorteia os valores UMA vez e o
       "defeito" repete identico para sempre — o olho pega o padrao em
       dois ciclos e o efeito morre. */
    const tl = gsap.timeline({ repeat: -1, repeatRefresh: true });

    tl.to(tiras, {
      x: () => (Math.random() < CHANCE
        ? gsap.utils.random([-1, 1]) * gsap.utils.random(...DESLOC)
        : 0),
      duration: 0.07,
      ease: 'none',
      stagger: { each: 0.015, from: 'random' },
    })
      .to(tiras, { x: 0, duration: 0.06, ease: 'none' }, '+=0.07')
      .to({}, { duration: () => gsap.utils.random(...PARADA) });

    return () => tl.kill();
  }, { scope: alvo });

  const fundo = { backgroundImage: `url(${imagem})`, backgroundPosition: posicao };

  return (
    <div ref={alvo} className={`falha ${className}`} role="presentation">
      {Array.from({ length: faixas }, (_, i) => {
        const topo = Math.max(0, (i / faixas) * 100 - SANGRIA);
        const base = Math.max(0, 100 - ((i + 1) / faixas) * 100 - SANGRIA);
        return (
          <div
            key={i}
            className="falha__tira"
            style={{ ...fundo, clipPath: `inset(${topo}% 0% ${base}% 0%)` }}
          />
        );
      })}
      <div className="falha__linhas" aria-hidden="true" />
    </div>
  );
}
