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
 * Nas FAIXAS so x anima — nunca largura nem posicao. Transform vai para
 * a GPU; largura e posicao obrigam o navegador a refazer o layout a cada
 * quadro, o que num loop continuo custaria caro sem aparecer.
 *
 * O filtro anima em outro lugar: e o negativo, aplicado na peca INTEIRA
 * em dois toques secos a cada ~3s. Um filtro por faixa, sessenta vezes
 * por segundo, seria caro; um filtro na peca, duas vezes a cada tres
 * segundos, nao e.
 */

const SANGRIA = 0.35;   // % de sobreposicao entre faixas vizinhas

/* Ritmo do defeito. Mais curto e mais denso que a primeira versao: a
   pausa caiu de 0.9-2.6s para 0.35-1.1s, quase metade das faixas
   escorrega por vez, e o deslocamento subiu. Continua sendo um PISCAR —
   a faixa volta em 130ms — porque defeito que fica ligado deixa de ser
   defeito e vira textura. */
const PARADA = [0.35, 1.1];
const DESLOC = [8, 34];   // px
const CHANCE = 0.45;      // fracao das faixas que escorrega por vez

/* O negativo. A cada ~3s a peca inteira inverte em dois toques curtos e
   volta. `set` no lugar de `to`: inversao interpolada passa por cinza e
   le como fade; o que se ve num sinal com defeito e um corte seco. */
const NEGATIVO_A_CADA = 3;

export default function Falha({ imagem, faixas = 20, className = '', posicao = 'center 18%' }) {
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

    /* Timeline separada, nao um passo da primeira: o negativo tem
       periodo proprio (~3s) e nao deve ficar preso ao sorteio da pausa
       das faixas. Sendo dois relogios independentes, as vezes coincidem
       — e e justamente a coincidencia ocasional que parece falha real. */
    const neg = gsap.timeline({ repeat: -1, repeatDelay: NEGATIVO_A_CADA });
    neg.set(alvo.current, { filter: 'invert(1)' })
      .to({}, { duration: 0.07 })
      .set(alvo.current, { filter: 'none' })
      .to({}, { duration: 0.05 })
      .set(alvo.current, { filter: 'invert(1)' })
      .to({}, { duration: 0.05 })
      .set(alvo.current, { filter: 'none' });

    return () => { tl.kill(); neg.kill(); };
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
