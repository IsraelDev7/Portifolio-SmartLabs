import React from 'react';

/**
 * Faixa — cabecalho editorial + tira de colunas sobre painel Grafite.
 *
 * Reconstrucao do layout medido na referencia: coluna com glifo, rotulo
 * em caixa alta, regua de 1px e paragrafo em mono. La o painel e branco;
 * aqui e Grafite sobre o Aco da pagina — mesmo salto de valor, dentro do
 * territorio da marca.
 *
 * `colada` cola a tira no que vem acima: sem padding de topo e sem
 * cabecalho. E o modo usado logo abaixo da Assinatura, onde a regua da
 * marca ja serve de titulo e qualquer respiro extra vira buraco.
 */
export default function Faixa({
  kicker,
  titulo,
  intro,
  sequencia,
  colunas = 3,
  colada = false,
  children,
}) {
  const temTopo = kicker || titulo || intro || sequencia;

  return (
    <section className={`faixa${colada ? ' faixa--colada' : ''}`}>
      {temTopo && (
        <header className="faixa__topo">
          {kicker && <span className="faixa__kicker">{kicker}</span>}
          {titulo && <h2 className="faixa__titulo">{titulo}</h2>}
          {intro && <p className="faixa__intro">{intro}</p>}
          {sequencia && <p className="faixa__sequencia">{sequencia}</p>}
        </header>
      )}

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

/* ── Glifos ──────────────────────────────────────────────────────────
   Marcas de traco, nao os arquivos de referencia: os originais sao
   silhuetas cheias em preto, com marca d'agua de banco de imagem, e
   preto chapado ao lado de tipografia em hairline briga com a pagina.
   Redesenhados em contorno de 1.4, mesma caixa de 24, mesmo assunto —
   engrenagem, ciclo, cerebro-chip. Em Solda, que e o papel de acento
   que o quadradinho anterior ocupava.
   ─────────────────────────────────────────────────────────────────── */

const CAIXA = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.4,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

/** Sistema — meia engrenagem e o no distribuindo para tres pontos. */
function Sistema() {
  return (
    <svg {...CAIXA} aria-hidden="true">
      <circle cx="7.2" cy="12" r="4.6" />
      {/* dentes so no semicirculo esquerdo: a direita e a saida */}
      <path d="M7.2 16.6v1.4M3.95 15.25l-.99.99M2.6 12H1.2M3.95 8.75l-.99-.99M7.2 7.4V6" />
      <circle cx="12.6" cy="12" r="1.5" fill="currentColor" stroke="none" />
      <path d="M13.6 10.8l3-3.6h1.6M14.1 12h4.5M13.6 13.2l3 3.6h1.6" />
      <circle cx="19.6" cy="7.2" r="1.4" />
      <circle cx="20" cy="12" r="1.4" />
      <circle cx="19.6" cy="16.8" r="1.4" />
    </svg>
  );
}

/** Operacao — a engrenagem dentro do ciclo que se fecha. */
function Operacao() {
  return (
    <svg {...CAIXA} aria-hidden="true">
      <circle cx="12" cy="12" r="3.2" />
      <path d="M15.2 12h1.4M14.26 14.26l.99.99M12 15.2v1.4M9.74 14.26l-.99.99M8.8 12H7.4M9.74 9.74l-.99-.99M12 8.8V7.4M14.26 9.74l.99-.99" />
      {/* as duas metades do ciclo, cada uma com a sua ponta */}
      <path d="M4.64 7.75A8.5 8.5 0 0 1 19.36 7.75" />
      <path d="M17.1 6.3l2.4 1.5-1 2.5" />
      <path d="M19.36 16.25A8.5 8.5 0 0 1 4.64 16.25" />
      <path d="M6.9 17.7l-2.4-1.5 1-2.5" />
    </svg>
  );
}

/** Inteligencia — o cerebro, o chip e as trilhas saindo dele. */
function Inteligencia() {
  return (
    <svg {...CAIXA} aria-hidden="true">
      <path d="M10.8 4.8c-2.6 0-4.6 1.5-4.9 3.4-1.6.5-2.5 2-2.5 3.8s.9 3.3 2.5 3.8c.3 1.9 2.3 3.4 4.9 3.4" />
      <path d="M7.2 8.6c1 .5 1.5 1.3 1.4 2.2M7.2 15.4c1-.5 1.6-1.3 1.5-2.2" />
      <rect x="10.4" y="9.6" width="4.6" height="4.8" rx="0.6" />
      <path d="M15 11h1.6l1.6-2.6M15 12h3.6M15 13h1.6l1.6 2.6" />
      <circle cx="19.6" cy="8.4" r="1.4" />
      <circle cx="20" cy="12" r="1.4" />
      <circle cx="19.6" cy="15.6" r="1.4" />
    </svg>
  );
}

const GLIFOS = { sistema: Sistema, operacao: Operacao, inteligencia: Inteligencia };

/** Uma coluna da tira: glifo, rotulo, regua, prosa. */
export function Coluna({ rotulo, icone, children }) {
  const Glifo = GLIFOS[icone];

  return (
    <article className="faixa__coluna">
      <span className="faixa__cabeca">
        <span className="faixa__glifo" aria-hidden="true">
          {Glifo ? <Glifo /> : null}
        </span>
        {rotulo}
      </span>
      <p className="faixa__prosa">{children}</p>
    </article>
  );
}
