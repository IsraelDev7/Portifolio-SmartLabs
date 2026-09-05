import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Cisao — a secao dividida 52/48, em dois atos com a imagem travada.
 *
 * Proporcao medida no original: 657px contra 609px numa viewport de
 * 1265. Nao e meio a meio, e essa diferenca importa — a metade da
 * imagem manda, e o painel de texto entra como resposta.
 *
 * A TRAVA DA TELA e position:sticky puro, sem pin do GSAP. A metade
 * esquerda gruda por 100vh enquanto a direita, que tem dois atos de
 * 100vh cada, rola por baixo. Quem define a duracao da trava e a altura
 * da coluna direita — nao um `end` em porcentagem que eu teria que
 * calibrar. Sticky tambem nao cria pin-spacer, entao nao ha altura
 * fantasma nem refresh encadeado com os outros gatilhos da pagina.
 *
 * A imagem NUNCA se move. O que se move e o que esta na frente dela: as
 * declaracoes trocam por fade cruzado no meio do percurso.
 *
 * O painel da direita e Grafite, nao branco. Sobre o Aco da pagina, dez
 * pontos de luminancia ja separam os planos sem sair do territorio.
 */
export default function Cisao({
  imagem,
  selo,
  declaracao,
  declaracaoDois,
  kicker,
  linhaMenor,
  linhaMaior,
  prosa,
  rodape,
  cartao,
}) {
  const alvo = useRef(null);

  useGSAP(() => {
    const el = alvo.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const um = el.querySelector('.cisao__declaracao--um');
    const dois = el.querySelector('.cisao__declaracao--dois');
    if (!um || !dois) return;

    // A troca acontece no meio do curso: enquanto o primeiro ato sai da
    // tela, a declaracao dele cede lugar a do segundo.
    gsap.fromTo([um, dois],
      { opacity: (i) => (i === 0 ? 1 : 0) },
      {
        opacity: (i) => (i === 0 ? 0 : 1),
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top top-=40%',
          end: 'top top-=90%',
          scrub: true,
        },
      }
    );
  }, { scope: alvo });

  return (
    <section className="cisao" ref={alvo}>
      <div className="cisao__esq">
        <div
          className="cisao__imagem"
          style={{ backgroundImage: `url(${imagem})` }}
          role="presentation"
        />

        {/* Fios verticais colados na emenda — no original sao uma coluna
            de 100px que costura as duas metades. */}
        <div className="cisao__fios" aria-hidden="true">
          {Array.from({ length: 7 }, (_, i) => <i key={i} />)}
        </div>

        {selo && (
          <div className="cisao__selo">
            {selo}
            <i className="cisao__ponto" aria-hidden="true" />
          </div>
        )}

        {declaracao && (
          <p className="cisao__declaracao cisao__declaracao--um">{declaracao}</p>
        )}
        {declaracaoDois && (
          <p className="cisao__declaracao cisao__declaracao--dois">{declaracaoDois}</p>
        )}
      </div>

      <div className="cisao__dir">
        {/* ── ato 1 ── */}
        <div className="cisao__ato">
          <header>
            {kicker && <span className="cisao__kicker">{kicker}</span>}
            {linhaMenor && <p className="cisao__menor">{linhaMenor}</p>}
            {linhaMaior && <h2 className="cisao__maior">{linhaMaior}</h2>}
            <i className="cisao__regua" aria-hidden="true" />
            {prosa && <p className="cisao__prosa">{prosa}</p>}
          </header>

          {rodape && <div className="cisao__rodape">{rodape}</div>}
        </div>

        {/* ── ato 2 — o cartao que aparece com a tela travada ── */}
        {cartao && <div className="cisao__ato cisao__ato--dois">{cartao}</div>}
      </div>
    </section>
  );
}

/** Uma linha do selo ou do rodape: rotulo em Solda + descricao. */
export function Item({ rotulo, children }) {
  return (
    <span className="cisao__item">
      <b>{rotulo}</b>
      {children}
    </span>
  );
}

/** O cartao do segundo ato: imagem no topo, declaracao, notas em mono. */
export function Cartao({ imagem, kicker, titulo, children }) {
  return (
    <article className="cartao">
      {imagem && (
        <div
          className="cartao__imagem"
          style={{ backgroundImage: `url(${imagem})` }}
          role="presentation"
        />
      )}
      {kicker && <span className="cisao__kicker">{kicker}</span>}
      <h3 className="cartao__titulo">{titulo}</h3>
      <i className="cisao__regua" aria-hidden="true" />
      <div className="cartao__notas">{children}</div>
    </article>
  );
}
