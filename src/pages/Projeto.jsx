import React, { useRef } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePageMotion } from '../hooks/usePageMotion';
import TransitionLink from '../components/TransitionLink';
import { GradeRipas, animarRipas } from '../components/Persiana';
import Partilha from '../components/Partilha';
import { useCorpoJusto } from '../hooks/useCorpoJusto';
import { acharProjeto, proximoProjeto, outrosProjetos } from '../dados/projetos';

gsap.registerPlugin(ScrollTrigger);

/**
 * Projeto — a obra apresentada por inteiro.
 *
 * Reconstruída sobre vertical.framer.media/work/unstable-sequence,
 * percorrida e medida no navegador. O que foi copiado é a ESTRUTURA e
 * a coreografia; a cor e a tipografia são as da marca.
 *
 * ── o herói, que é onde mora a ideia da página ──
 * Na referência, as duas linhas do título NASCEM FORA DA TELA, em
 * lados opostos, e convergem conforme o scroll desce. Medido com
 * scroll de roda real (por script o valor não se move — ele está preso
 * a um spring que só responde a scroll de verdade):
 *
 *   scroll 0    linha 1 -1200px   ·  linha 2 +1200px
 *   scroll 200          -64                    +64
 *   scroll 400           +1                     -1
 *
 * A convergência inteira acontece nos primeiros ~400px de um herói de
 * 1246 — ou seja, em menos de um terço da primeira tela. É rápido de
 * propósito: quem chega e não rola nada fica sem o título, e o
 * movimento é justamente o convite para descer.
 *
 * Os textos menores ficam PARA TRÁS do scroll, em ritmos diferentes:
 * 0.1x no bloco de cima, 0.2x no parágrafo de baixo. Como o parágrafo
 * atrasa o dobro, os dois se AFASTAM um do outro na descida e voltam a
 * se juntar na subida — que é exatamente o par de setas opostas que o
 * Israel desenhou no print.
 */
export default function Projeto() {
  const { slug } = useParams();
  const projeto = acharProjeto(slug);
  const motionRef = usePageMotion();
  const alvo = useRef(null);

  /* "MAIS OBRAS" de borda a borda, como o "MORE PROJECTS" de 200px da
     referência. Mesma regra do caderno: medir só vale para uma linha de
     peso uniforme cujo trabalho é ocupar a largura. Desligado no
     telefone, onde o hook escreveria um corpo inline com prioridade que
     nenhuma regra da folha conseguiria corrigir. */
  useCorpoJusto(alvo, '.prj__mais-titulo', {
    ativo: () => !window.matchMedia('(max-width: 820px)').matches,
  });

  useGSAP(() => {
    const r = alvo.current;
    if (!r || !projeto) return;

    const parado = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const heroi = r.querySelector('.prj__heroi');
    const linhaA = r.querySelector('.prj__ln--a');
    const linhaB = r.querySelector('.prj__ln--b');
    const topo = r.querySelector('.prj__heroi-topo');
    const base = r.querySelector('.prj__heroi-base');
    const fundo = r.querySelector('.prj__fundo');

    /* ── o caminho estático de verdade ──
       Sem movimento o título PRECISA nascer no lugar. Deixá-lo fora da
       tela com a animação desligada esconderia o nome da obra de quem
       pediu menos movimento — que é o oposto de acessibilidade. */
    if (parado) {
      gsap.set([linhaA, linhaB], { x: 0 });
    } else if (heroi && linhaA && linhaB) {
      /* As duas linhas: uma entra pela esquerda, a outra pela direita.
         `100vw` e não um valor em px porque a distância tem que ser a
         largura da tela em qualquer viewport — em px, num monitor
         largo, a linha começaria já dentro do quadro. */
      gsap.fromTo([linhaA, linhaB],
        { xPercent: (i) => (i === 0 ? -1 : 1) * 100, x: (i) => (i === 0 ? -1 : 1) * 200 },
        {
          xPercent: 0, x: 0,
          /* ── por que `power3.out` e não linear ──
             Medido na referência: com 210px de scroll as duas linhas já
             estão a 64px do lugar, e os 340 restantes só assentam o
             resto. A curva é quase toda no começo.

             Linear dava -754 no mesmo ponto — metade do caminho —, e o
             título só ficava legível bem depois de a pessoa ter passado
             pela primeira tela. `power3.out` devolve a frente de
             movimento para onde ela pertence: o convite para descer tem
             que acontecer no primeiro gesto de scroll, não no quarto. */
          ease: 'power3.out',
          scrollTrigger: { trigger: heroi, start: 'top top', end: '+=420', scrub: 0.6 },
        });

      /* O atraso dos textos menores. O de baixo atrasa o DOBRO do de
         cima: é a diferença entre os dois ritmos que faz o par se
         afastar na descida, não o deslocamento em si. */
      [[topo, 0.1], [base, 0.2]].forEach(([el, taxa]) => {
        if (!el) return;
        gsap.fromTo(el, { y: 0 }, {
          y: () => heroi.offsetHeight * taxa, ease: 'none',
          scrollTrigger: { trigger: heroi, start: 'top top', end: 'bottom top', scrub: true },
        });
      });

      /* O fundo anda mais devagar que a página: é o que separa a
         imagem do conteúdo em vez de os dois subirem colados. */
      if (fundo) {
        gsap.fromTo(fundo, { yPercent: -6 }, {
          yPercent: 6, ease: 'none',
          scrollTrigger: { trigger: heroi, start: 'top top', end: 'bottom top', scrub: true },
        });
      }
    }

    /* As fotos usam a MESMA persiana do resto do site. */
    const limpezas = parado ? [] : gsap.utils.toArray(r.querySelectorAll('.prj__foto'))
      .map((fig) => animarRipas(fig, fig));

    return () => limpezas.forEach((f) => f && f());
  }, { scope: alvo, dependencies: [slug] });

  if (!projeto) return <Navigate to="/404" replace />;

  const proximo = proximoProjeto(slug);
  const outros = outrosProjetos(slug);

  const Foto = ({ src, alt }) => (
    <span className="prj__foto" style={{ backgroundImage: `url(${src})` }} role="img" aria-label={alt || ''}>
      <GradeRipas />
    </span>
  );

  return (
    <main className="prj" ref={(n) => { alvo.current = n; motionRef.current = n; }}>

      {/* ══════ HERÓI ══════ */}
      <header className="prj__heroi">
        <div className="prj__fundo" style={{ backgroundImage: `url(${projeto.heroImagem})` }}
             role="img" aria-label={projeto.heroAlt} />
        <div className="prj__veu" aria-hidden="true" />

        <div className="prj__heroi-corpo">
          <div className="prj__heroi-topo">
            <p className="prj__indice">
              <span>{projeto.indice}</span>
              <i aria-hidden="true" />
            </p>
            <p className="prj__chamada">{projeto.chamada}</p>
          </div>

          {/* Cada linha numa janela própria: é a janela que recorta o
              que ainda está fora, para o título deslizar sem abrir
              rolagem horizontal na página. */}
          <h1 className="prj__titulo">
            <span className="prj__janela"><span className="prj__ln prj__ln--a">{projeto.titulo[0]}</span></span>
            <span className="prj__janela"><span className="prj__ln prj__ln--b">{projeto.titulo[1]}</span></span>
          </h1>

          <div className="prj__heroi-base">
            <span className="prj__lateral">{projeto.lateralEsq}</span>
            <p className="prj__heroi-texto">{projeto.heroTexto}</p>
            <span className="prj__lateral prj__lateral--dir">{projeto.lateralDir}</span>
          </div>
        </div>

        <span className="prj__ano" aria-hidden="true">{projeto.ano}</span>
      </header>

      {/* ══════ FICHA ══════ */}
      <section className="prj__ficha">
        <p className="prj__rotulo">(Projeto)</p>
        <h2 className="prj__nome">{projeto.nome}</h2>
        <p className="prj__sub">{projeto.subtitulo}</p>

        <div className="prj__declara">
          <h3 className="prj__declaracao">{projeto.declaracao}</h3>
          <div className="prj__vivo">
            <span className="prj__vivo-selo">
              {projeto.linkVivo.rotulo}
              <i aria-hidden="true">▶▶</i>
            </span>
            <span className="prj__rotulo">{projeto.linkVivo.texto}</span>
          </div>
        </div>

        <dl className="prj__dados">
          {projeto.ficha.map((c) => (
            <div key={c.rotulo}>
              <dd>{c.valor.map((v) => <span key={v}>{v}</span>)}</dd>
              <dt className="prj__rotulo">{c.rotulo}</dt>
            </div>
          ))}
        </dl>
      </section>

      {/* ══════ INTRODUÇÃO ══════ */}
      <section className="prj__intro">
        <p className="prj__rotulo">(Introdução)</p>
        <p className="prj__intro-texto" data-anim="rise">{projeto.introducao}</p>
      </section>

      {/* ══════ CAPÍTULOS ══════ */}
      {projeto.capitulos.map((c, i) => (
        <section className="prj__cap" key={i}>
          <p className="prj__rotulo">{c.rotulo}</p>
          <h3 className="prj__cap-titulo" data-anim="rise">{c.declaracao}</h3>
          <p className="prj__cap-sub" data-anim="rise">{c.sub}</p>

          <div className="prj__cap-corpo">
            <div className="prj__cap-texto">
              <p data-anim="rise">{c.corpo}</p>

              {c.codigo && (
                <pre className="prj__codigo" data-anim="rise"><code>{c.codigo}</code></pre>
              )}

              {c.lista && (
                <div className="prj__lista" data-anim="rise">
                  <p className="prj__rotulo">{c.listaTitulo}</p>
                  <ul>{c.lista.map((l, j) => <li key={j}>{l}</li>)}</ul>
                </div>
              )}
            </div>

            {c.imagem && (
              <figure className="prj__figura">
                <Foto src={c.imagem} alt={c.legenda} />
                <figcaption className="prj__rotulo">{c.legenda}</figcaption>
              </figure>
            )}
          </div>
        </section>
      ))}

      {/* ══════ RESULTADOS ══════ */}
      <section className="prj__result">
        <p className="prj__rotulo">{projeto.resultados.rotulo}</p>
        <h3 className="prj__cap-titulo" data-anim="rise">{projeto.resultados.declaracao}</h3>
        <p className="prj__cap-sub" data-anim="rise">{projeto.resultados.sub}</p>

        <ol className="prj__blocos">
          {projeto.resultados.blocos.map((b, i) => (
            <li key={i}>
              <span className="prj__bloco-n">{String(i + 1).padStart(2, '0')}</span>
              <h4 className="prj__bloco-titulo" data-anim="rise">{b.titulo}</h4>
              <p data-anim="rise">{b.texto}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ══════ FECHO ══════ */}
      <section className="prj__fecho">
        <h2 className="prj__fecho-titulo">
          <span>{projeto.titulo[0]}</span>
          <span className="prj__fecho-linha2">{projeto.titulo[1]}</span>
        </h2>
        <p className="prj__fecho-texto" data-anim="rise">{projeto.fecho.texto}</p>

        {/* A esteira: a mesma gramática do Marquee do resto do site. */}
        <div className="prj__esteira" aria-hidden="true">
          <div className="prj__esteira-trilho">
            {Array.from({ length: 8 }, (_, i) => (
              <span key={i}>{projeto.fecho.esteira}<i>◆</i></span>
            ))}
          </div>
        </div>

        <div className="prj__partilha">
          <p className="prj__rotulo">Compartilhar este projeto</p>
          <Partilha url={`https://smartlabs.ai/work/${projeto.slug}`} titulo={projeto.nome} />
        </div>
      </section>

      {/* ══════ MAIS OBRAS ══════ */}
      <section className="prj__mais">
        <h2 className="prj__mais-titulo" aria-label="Mais obras">Mais obras</h2>

        <ul className="prj__lista-obras">
          {outros.map((o) => (
            <li key={o.slug}>
              <TransitionLink className="prj__obra" to={`/work/${o.slug}`}>
                <span className="prj__obra-foto"><Foto src={o.heroImagem} alt={o.heroAlt} /></span>
                <span className="prj__obra-corpo">
                  <span className="prj__obra-titulo">{o.nome}</span>
                  <span className="prj__obra-sub">{o.subtitulo}</span>
                  <span className="prj__rotulo">{o.ficha[3]?.valor[0]}</span>
                </span>
                <span className="prj__obra-seta" aria-hidden="true">→</span>
              </TransitionLink>
            </li>
          ))}
          {!outros.length && proximo === null && (
            <li className="prj__vazio">
              <TransitionLink to="/work">Voltar para as obras</TransitionLink>
            </li>
          )}
        </ul>
      </section>
    </main>
  );
}
