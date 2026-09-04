import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * SliceCurtain — a cortina de ripas das trocas de pagina.
 *
 * Portado do SliceRevealer (Codrops, 2018), do acervo Vance
 * "Page Transitions #6". O original revela IMAGENS com ripas
 * escalonadas; aqui a mesma mecanica cobre e descobre a pagina inteira.
 *
 * Sem anime.js: os quatro padroes de delay do original (sequencial,
 * reverso, centro-para-fora e aleatorio) sao o `stagger` do GSAP, e os
 * easings mapeiam um a um — easeInOutQuart e o power4.inOut. O GSAP ja
 * esta no bundle; anime.js seriam 17 KB para repetir o que ja existe.
 *
 * O que veio intacto do original: a ideia de `slicesOrigin` ter valores
 * DIFERENTES para entrar e sair. As ripas sobem de baixo para cobrir e
 * continuam subindo para descobrir — a cortina atravessa a tela em vez
 * de recuar por onde veio. E o box-shadow de 1px que tapa o vao de
 * subpixel entre ripas; aqui ele ganhou a cor Solda e virou tambem o que
 * torna o movimento legivel num site inteiramente off-black.
 */

const RIPAS = 7;
const RIPAS_COMPACTO = 5;

const DUR_COBRE = 0.5;
const DUR_DESCOBRE = 0.55;
const PASSO = 0.045;   // atraso entre ripas vizinhas

let api = null;

/** Cobre a tela. Aguardavel. */
export const cobrir = () => Promise.resolve(api?.cobrir());

/** Descobre a tela. Aguardavel. */
export const descobrir = () => Promise.resolve(api?.descobrir());

/** Se a cortina existe e o movimento nao esta reduzido. */
export const temCortina = () => !!api;

export default function SliceCurtain() {
  const raiz = useRef(null);

  useEffect(() => {
    const el = raiz.current;
    if (!el) return;

    // Movimento reduzido: sem cortina. O TransitionLink ve temCortina()
    // falso e navega direto, sem espera nenhuma.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ripas = gsap.utils.toArray(el.querySelectorAll('.cortina__ripa'));

    // Posicao de repouso: uma tela abaixo, prontas para subir.
    const rearmar = () => gsap.set(ripas, { yPercent: 100 });
    rearmar();

    const meu = {
      cobrir: () => {
        el.classList.add('cortina--ativa');
        return gsap.to(
          ripas,
          { yPercent: 0, duration: DUR_COBRE, ease: 'power4.inOut', stagger: PASSO }
        );
      },
      descobrir: () => {
        // Continua para CIMA: a cortina atravessa, nao volta.
        return gsap.to(ripas, {
          yPercent: -100,
          duration: DUR_DESCOBRE,
          ease: 'power4.inOut',
          stagger: PASSO,
          onComplete: () => {
            el.classList.remove('cortina--ativa');
            rearmar();
          },
        });
      },
    };

    api = meu;
    return () => {
      if (api === meu) api = null;
      gsap.killTweensOf(ripas);
    };
  }, []);

  const total = typeof window !== 'undefined'
    && window.matchMedia('(max-width: 820px)').matches
    ? RIPAS_COMPACTO
    : RIPAS;

  return (
    <div ref={raiz} className="cortina" aria-hidden="true">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className="cortina__ripa" />
      ))}
    </div>
  );
}
