import React from 'react';

/**
 * Vitrine — duas secoes encaixadas uma na outra, com a tela travada.
 *
 * Reconstrucao do bloco "Modus Vivendi" da referencia (vertical.framer.
 * media), medido no DOM em viewport de 1280x720:
 *
 *   ATO 1  sticky top:0 · 1265x648 (90vh) · foto 657 | painel 609
 *          o painel da referencia e #F2F2F2; aqui e Grafite
 *   ATO 2  1265x720 (100vh) · fundo rgba(255,255,255,0.6) · z-index 2
 *
 * A MECANICA INTEIRA E CSS, sem uma linha de JavaScript. O ato 1 gruda no
 * topo; o ato 2, que vem depois no fluxo e tem z-index maior, sobe por
 * cima dele. Como o veu do ato 2 e SEMITRANSPARENTE, a foto continua
 * visivel por tras enquanto o texto novo passa — e isso que da a leitura
 * de duas secoes integradas, e nao de uma substituindo a outra.
 *
 * Por que sticky e nao pin do GSAP: pin cria um pin-spacer, que muda a
 * altura do documento e obriga todo gatilho abaixo a remedir. Sticky nao
 * cria nada — quem define a duracao da trava e a altura do ato 2.
 *
 * O veu e um gradiente, nao uma cor chapada: entra a 72% para a foto
 * vazar com forca no comeco, fecha em Aco solido na metade. Cor chapada
 * criaria uma borda dura no encontro dos dois atos.
 */
export default function Vitrine({
  /* ── ato 1 ── */
  foto,
  fotoMarca,
  fotoSecao,
  kicker,
  titulo,
  descricao,
  fichaNota,
  fichaTitulo,
  fichaMono,
  botao,

  /* ── ato 2 ── */
  kickerDois,
  mancheteUm,
  mancheteCinza,
  mancheteDois,
  prosa,
  periodoDe,
  periodoAte,
  thumb,
  projetoNome,
  codigo,
  disciplinas = [],
  marcaEsq,
  marcaDir,
}) {
  return (
    <section className="vitrine">
      {/* ── ATO 1 — trava na tela ── */}
      <div className="vitrine__trava">
        <div
          className="vitrine__foto"
          style={{ backgroundImage: `url(${foto})` }}
          role="presentation"
        >
          <div className="vitrine__selo-foto">
            <span>{fotoMarca}</span>
            <span>{fotoSecao}</span>
          </div>
        </div>

        <div className="vitrine__painel">
          <header className="vitrine__cabeca">
            {kicker && <span className="vitrine__kicker">{kicker}</span>}
            <h2 className="vitrine__titulo">{titulo}</h2>
            <p className="vitrine__descricao">{descricao}</p>
          </header>

          {/* o bloco de ficha do pe: nota, titulo, endereco, acao */}
          <div className="vitrine__ficha">
            <p className="vitrine__ficha-nota">{fichaNota}</p>
            <p className="vitrine__ficha-titulo">{fichaTitulo}</p>
            <p className="vitrine__ficha-mono">{fichaMono}</p>
            {botao && (
              <span className="vitrine__botao">
                {botao}
                <i aria-hidden="true">▶▶</i>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── ATO 2 — sobe por cima, deixando a foto vazar ── */}
      <div className="vitrine__veu">
        <div className="vitrine__conceito">
          <div className="vitrine__fios" aria-hidden="true">
            {Array.from({ length: 16 }, (_, i) => <i key={i} />)}
          </div>

          <div className="vitrine__conceito-texto">
            <span className="vitrine__kicker-dois">{kickerDois}</span>
            <h3 className="vitrine__manchete">
              {mancheteUm}
              <br />
              <em>{mancheteCinza}</em> {mancheteDois}
            </h3>
            <p className="vitrine__prosa">{prosa}</p>
            <div className="vitrine__periodo">
              <span>{periodoDe}</span>
              <i aria-hidden="true" />
              <span>{periodoAte}</span>
            </div>
          </div>
        </div>

        {/* a ficha do projeto: miniatura, nome, codigo em corpo maximo */}
        <div className="vitrine__projeto">
          <div
            className="vitrine__thumb"
            style={{ backgroundImage: `url(${thumb})` }}
            role="presentation"
          />
          <div className="vitrine__projeto-dir">
            <span className="vitrine__projeto-nome">{projetoNome}</span>
            <p className="vitrine__codigo">{codigo}</p>
            <ul className="vitrine__disciplinas">
              {disciplinas.map((d) => <li key={d}>{d}</li>)}
            </ul>
          </div>
        </div>

        <div className="vitrine__marcas">
          <span>{marcaEsq}</span>
          <span>{marcaDir}</span>
        </div>
      </div>
    </section>
  );
}
