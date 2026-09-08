import React from 'react';
import { usePageMotion } from '../hooks/usePageMotion';

/**
 * Legal — o molde das paginas de texto corrido (privacidade e termos).
 *
 * Uma so casca para as duas: elas tem exatamente a mesma forma — titulo,
 * data de vigencia, e uma pilha de secoes numeradas — e o unico jeito de
 * garantir que continuem iguais e nao existirem duas vezes.
 *
 * Medida de linha em 68ch, nao a largura da pagina. Texto juridico e
 * lido de ponta a ponta; linha longa demais faz o olho perder a volta.
 */
export function Molde({ kicker, titulo, vigencia, children }) {
  const motionRef = usePageMotion();

  return (
    <div ref={motionRef} className="legal">
      <header className="legal__topo">
        <span className="legal__kicker">{kicker}</span>
        <h1 className="legal__titulo">{titulo}</h1>
        <p className="legal__vigencia">Em vigor desde {vigencia}</p>
      </header>

      <div className="legal__corpo">{children}</div>

      <footer className="legal__pe">
        <p>
          Smart LABS · CNPJ 53.243.609/0001-58 · Avenida Portugal, 1148,
          Sala 409 — Órion Business &amp; Health Complex, Goiânia, Goiás
          74150-340, Brasil.
        </p>
        <p>
          Encarregado de dados e contato:{' '}
          <a href="mailto:israel.devpf@gmail.com">israel.devpf@gmail.com</a> ·
          (62) 99287-9300
        </p>
      </footer>
    </div>
  );
}

/** Uma seção numerada. O número vem do CSS, por contador. */
export function Secao({ titulo, children }) {
  return (
    <section className="legal__secao">
      <h2>{titulo}</h2>
      {children}
    </section>
  );
}
