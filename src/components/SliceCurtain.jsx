import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * SliceCurtain — a cortina de ripas das trocas de pagina.
 *
 * Portado do SliceRevealer (Codrops, 2018), do acervo Vance
 * "Page Transitions #6", reproduzindo a coreografia do preview oficial.
 *
 * A referencia troca de EIXO no meio do caminho, e isso nao e detalhe:
 *
 *   FECHANDO  4 ripas VERTICAIS sobem de baixo, a da ESQUERDA na frente
 *   ABRINDO   7 ripas HORIZONTAIS saem pela direita, a de CIMA na frente
 *
 * No demo original isso acontece porque cada slide carrega a sua propria
 * configuracao: o video e a transicao do slide 0 para o slide 1, entao o
 * `hide` vem de um (4 verticais, hide:'bottom') e o `show` vem do outro
 * (7 horizontais, show:'right'). E acidente de slideshow — mas o efeito
 * e bom demais para descartar: a pagina se fecha em colunas e se abre em
 * linhas, e a virada de eixo e o que impede a saida de parecer o replay
 * invertido da entrada.
 *
 * Como confirmei que sao eixos diferentes: no fechamento as bordas da
 * escada ficam PARADAS em 25/50/75% da largura; na abertura elas ANDAM
 * (2,3% -> 8,5% -> 24,4% ao longo dos quadros). Borda que se desloca nao
 * pode ser coluna vertical — sao linhas saindo de lado.
 *
 * Sem anime.js: os padroes de delay do original sao o `stagger` do GSAP,
 * e os easings mapeiam um a um (easeInOutQuart e o power4.inOut). O GSAP
 * ja esta no bundle; anime.js seriam 17 KB para repetir o que ja existe.
 */

const RIPAS_FECHA = 4;             // colunas, como na referencia
const RIPAS_ABRE = 7;              // linhas, como na referencia
const RIPAS_FECHA_COMPACTO = 3;
const RIPAS_ABRE_COMPACTO = 5;

const DUR_FECHA = 0.60;
const PASSO_FECHA = 0.075;
const DUR_ABRE = 0.52;
const PASSO_ABRE = 0.065;

let api = null;

/** Cobre a tela com as colunas. Aguardavel. */
export const cobrir = () => Promise.resolve(api?.cobrir());

/** Descobre a tela com as linhas. Aguardavel. */
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

    const colunas = gsap.utils.toArray(el.querySelectorAll('.cortina__colunas .cortina__ripa'));
    const linhas = gsap.utils.toArray(el.querySelectorAll('.cortina__linhas .cortina__ripa'));
    if (!colunas.length || !linhas.length) return;

    // Repouso: colunas uma tela abaixo, linhas uma tela a direita.
    const rearmar = () => {
      gsap.set(colunas, { yPercent: 100, xPercent: 0 });
      gsap.set(linhas, { xPercent: 100, yPercent: 0 });
    };
    rearmar();

    const meu = {
      cobrir: () => {
        el.classList.add('cortina--ativa');
        return gsap.to(colunas, {
          yPercent: 0,
          duration: DUR_FECHA,
          ease: 'power4.inOut',
          stagger: { each: PASSO_FECHA, from: 'start' },   // esquerda na frente
          onComplete: () => {
            // Passagem de bastao, no quadro em que a tela esta coberta:
            // as linhas assumem a cobertura e as colunas voltam ao
            // repouso por tras delas. Sendo as duas camadas da mesma cor,
            // a troca de eixo nao aparece — o que se ve e uma cortina so.
            gsap.set(linhas, { xPercent: 0 });
            gsap.set(colunas, { yPercent: 100 });
          },
        });
      },

      descobrir: () => {
        return gsap.to(linhas, {
          xPercent: 100,
          duration: DUR_ABRE,
          ease: 'power4.inOut',
          stagger: { each: PASSO_ABRE, from: 'start' },    // de cima para baixo
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
      gsap.killTweensOf([...colunas, ...linhas]);
    };
  }, []);

  const compacto = typeof window !== 'undefined'
    && window.matchMedia('(max-width: 820px)').matches;
  const nColunas = compacto ? RIPAS_FECHA_COMPACTO : RIPAS_FECHA;
  const nLinhas = compacto ? RIPAS_ABRE_COMPACTO : RIPAS_ABRE;

  return (
    <div ref={raiz} className="cortina" aria-hidden="true">
      <div className="cortina__colunas">
        {Array.from({ length: nColunas }, (_, i) => (
          <div key={`c${i}`} className="cortina__ripa" />
        ))}
      </div>
      <div className="cortina__linhas">
        {Array.from({ length: nLinhas }, (_, i) => (
          <div key={`l${i}`} className="cortina__ripa" />
        ))}
      </div>
    </div>
  );
}
