import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { aposCortina } from '../lib/cortina';

gsap.registerPlugin(ScrollTrigger);

/**
 * Persiana — a imagem se monta em ripas verticais, banda a banda.
 *
 * Mecanica do "Page Transitions #17" do acervo Vance (o infinite slider
 * do CodeGrid). No preview a imagem nao aparece de uma vez nem por fade:
 * ela e coberta por uma grade de ripas VERTICAIS distribuidas em bandas
 * horizontais, e cada ripa recolhe sozinha. Extrai os quadros do video e
 * o que se ve e isso — colunas finas virando blocos, em ordem espalhada,
 * ate a foto estar inteira.
 *
 * Aqui a cobertura e de Aco, do mesmo tom do fundo: enquanto a ripa nao
 * recolheu, o lugar dela le como pagina, nao como buraco na foto.
 *
 * So `scaleY` anima — nunca altura. Transform vai para a GPU; altura
 * obriga o navegador a refazer o layout da grade a cada quadro, com 48
 * celulas por peca e varias pecas na mesma pagina.
 *
 * `transform-origin` alterna por coluna: as impares recolhem para cima,
 * as pares para baixo. Recolhendo todas para o mesmo lado a leitura vira
 * uma cortina subindo, e o que o preview mostra e dispersao.
 */

const COLUNAS = 12;
const BANDAS = 4;


/** A grade de ripas, para quem ja tem a propria foto montada. */
export function GradeRipas() {
  return (
    <div className="persiana__grade" aria-hidden="true">
      {Array.from({ length: BANDAS * COLUNAS }, (_, i) => (
        <i
          key={i}
          className="persiana__ripa"
          style={{ transformOrigin: i % 2 ? 'center bottom' : 'center top' }}
        />
      ))}
    </div>
  );
}

/**
 * Liga a persiana numa grade que ja existe no DOM. Exportada para a
 * Thoughts usar a MESMA mecanica em vez de uma copia: dois lugares com a
 * mesma animacao escrita duas vezes divergem na primeira correcao feita
 * so em um deles.
 *
 * Devolve a funcao de limpeza.
 */
export function animarRipas(raiz, gatilho = raiz) {
  const ripas = gsap.utils.toArray(raiz.querySelectorAll('.persiana__ripa'));
  if (!ripas.length) return () => {};

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.set(ripas, { scaleY: 0 });
    return () => {};
  }

  let st = null;
  let vivo = true;

  const montar = () => {
    if (!vivo) return;
    st = gsap.fromTo(ripas,
      { scaleY: 1 },
      {
        scaleY: 0,
        duration: 0.62,
        ease: 'power2.inOut',
        stagger: { each: 0.014, grid: [BANDAS, COLUNAS], from: 'random' },
        scrollTrigger: {
          trigger: gatilho,
          start: 'top 85%',
          toggleActions: 'restart none none reverse',
        },
      }).scrollTrigger;
  };

  const cancelar = aposCortina(montar);

  return () => {
    vivo = false;
    cancelar();
    if (st) st.kill();
  };
}

export default function Persiana({ imagem, className = '', posicao = 'center' }) {
  const alvo = useRef(null);

  useGSAP(() => animarRipas(alvo.current), { scope: alvo });

  return (
    <div ref={alvo} className={`persiana ${className}`}>
      <div
        className="persiana__foto"
        style={{ backgroundImage: `url(${imagem})`, backgroundPosition: posicao }}
        role="presentation"
      />

      <GradeRipas />
    </div>
  );
}
