import React from 'react';

/**
 * Faixa — cabecalho editorial + tira de colunas sobre painel Grafite.
 *
 * Reconstrucao do layout medido na referencia: coluna com glifo, rotulo
 * em caixa alta, regua de 1px e paragrafo em mono. La o painel e branco;
 * aqui e Grafite sobre o Aco da pagina — mesmo salto de valor, dentro do
 * territorio da marca.
 *
 * O glifo e um quadrado de 8px em Solda, nao um icone: o vocabulario da
 * marca e o degrau, e um quadradinho aceso e a menor peca desse
 * vocabulario. Icone generico apareceria como enfeite emprestado.
 */
export default function Faixa({ kicker, titulo, intro, sequencia, colunas = 3, children }) {
  return (
    <section className="faixa">
      <header className="faixa__topo">
        <span className="faixa__kicker">{kicker}</span>
        <h2 className="faixa__titulo">{titulo}</h2>
        {intro && <p className="faixa__intro">{intro}</p>}
        {sequencia && <p className="faixa__sequencia">{sequencia}</p>}
      </header>

      <div
        className="faixa__tira"
        style={{ '--faixa-cols': colunas }}
        data-bloco
      >
        {children}
      </div>
    </section>
  );
}

/** Uma coluna da tira: glifo, rotulo, regua, prosa. */
export function Coluna({ rotulo, children }) {
  return (
    <article className="faixa__coluna">
      <span className="faixa__cabeca">
        <i className="faixa__glifo" aria-hidden="true" />
        {rotulo}
      </span>
      <p className="faixa__prosa">{children}</p>
    </article>
  );
}
