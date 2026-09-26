import React, { useRef } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePageMotion } from '../hooks/usePageMotion';
import TransitionLink from '../components/TransitionLink';
import { GradeRipas, animarRipas } from '../components/Persiana';
import { aposCortina } from '../lib/cortina';
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
    let cancelarEntrada = null;

    const heroi = r.querySelector('.prj__heroi');
    const linhas = gsap.utils.toArray(r.querySelectorAll('.prj__ln'));
    const saidas = gsap.utils.toArray(r.querySelectorAll('.prj__saida'));
    const topo = r.querySelector('.prj__heroi-topo');
    const texto = r.querySelector('.prj__heroi-texto');
    const latEsq = r.querySelector('.prj__lateral:not(.prj__lateral--dir)');
    const latDir = r.querySelector('.prj__lateral--dir');
    const fundo = r.querySelector('.prj__fundo');

    /* ── o caminho estático de verdade ──
       Sem movimento o título PRECISA nascer no lugar. Deixá-lo fora da
       janela com a animação desligada esconderia o nome da obra de quem
       pediu menos movimento — que é o oposto de acessibilidade. */
    if (parado) {
      gsap.set([...linhas, ...saidas], { xPercent: 0 });
      gsap.set(r.querySelectorAll('.prj__lateral'), { xPercent: 0, autoAlpha: 1 });
    } else if (heroi && linhas.length) {
      /* ── a SAÍDA é criada ANTES da entrada ──
         Um `fromTo` sob ScrollTrigger grava o estado inicial no ato da
         CRIAÇÃO, não quando dispara. Criada depois, a saída plantaria
         `xPercent: 0` por cima da entrada que já estava correndo, e o
         título apareceria de estalo. `immediateRender: false` impede
         que ela escreva antes de o scroll pedir. */
      gsap.fromTo(saidas,
        { xPercent: 0 },
        {
          xPercent: (i) => (i === 0 ? -100 : 100),
          ease: 'power2.in',
          immediateRender: false,
          scrollTrigger: {
            trigger: heroi,
            start: 'top top',
            /* 75% do herói: a saída tem que ser VISTA. Terminando junto
               com o herói, ela aconteceria quase toda fora do quadro. */
            end: () => '+=' + heroi.offsetHeight * 0.75,
            scrub: 0.6,
          },
        });

      /* ── a ENTRADA, no carregamento ──
         A referência abre com o título JÁ no lugar — ele chega, e só
         sai quando o scroll desce. Eu tinha lido ao contrário na
         primeira leitura porque o navegador estava com o rAF congelado
         e a animação de entrada nunca rodava: o que eu media era o
         estado inicial parado, não o repouso.

         `xPercent` e não px: a distância é a largura da JANELA, que é a
         largura da linha mais longa. Em px, um título curto sairia da
         janela antes da hora e um longo não sairia inteiro. */
      /* `paused` + `aposCortina`: o `fromTo` planta o estado inicial na
         hora — o título já nasce fora da janela, atrás da cortina do
         preloader —, mas o movimento só começa quando a cortina sai.
         Sem isso a entrada roda escondida e quem chega encontra só o
         estado final, que é justamente o que esta página não pode ter:
         o título CHEGANDO é a primeira coisa que ela diz.

         É o mesmo instante que a persiana das imagens já usa; mora em
         lib/cortina para o número não existir em três lugares. */
      const entrada = gsap.fromTo(linhas,
        { xPercent: (i) => (i === 0 ? -100 : 100) },
        { xPercent: 0, ease: 'expo.out', duration: 1.2, stagger: 0.09, paused: true });

      cancelarEntrada = aposCortina(() => entrada.play());

      /* ── os dois blocos se AFASTAM ──
         A referência atrasa os dois para baixo em ritmos diferentes, o
         que os separa. Aqui a separação é explícita: o bloco de cima
         SOBE e o parágrafo DESCE, cada um saindo pela sua borda.

         Ler melhor do que o atraso puro: com os dois indo para baixo,
         quem rola rápido vê os dois perseguindo o rodapé. Em direções
         opostas, o herói se abre no meio e o olho entende que aquela
         tela acabou. */
      const faixa = { trigger: heroi, start: 'top top', end: 'bottom top', scrub: true };
      [[topo, -0.16], [texto, 0.18]].forEach(([el, taxa]) => {
        if (!el) return;
        gsap.fromTo(el, { y: 0 }, {
          y: () => heroi.offsetHeight * taxa, ease: 'none',
          scrollTrigger: faixa,
        });
      });

      /* ── os rótulos laterais saem PELO LADO ──
         Mesma gramática do título: cada um se recolhe para a borda mais
         próxima. São os dois textos que já nascem colados nas margens,
         então sair pelo lado é o caminho mais curto — e o que repete o
         gesto que a página inteira já faz. */
      [[latEsq, -1], [latDir, 1]].forEach(([el, lado]) => {
        if (!el) return;
        gsap.fromTo(el, { xPercent: 0, autoAlpha: 1 }, {
          xPercent: lado * 130, autoAlpha: 0, ease: 'power2.in',
          scrollTrigger: {
            trigger: heroi, start: 'top top',
            end: () => '+=' + heroi.offsetHeight * 0.6, scrub: 0.6,
          },
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

    /* ── o texto que acende por palavra ──
       Medido na referência: 35 <div> `inline-block`, um por palavra,
       todos em rgb(242,242,242) no fim. O que parecia corte no meio de
       "INTERRUPTI|ON" era so a linha quebrando — nao ha efeito por
       letra.

       `scrub: true` sem numero: o preenchimento fica preso ao scroll
       nos DOIS sentidos, e desfaz subindo exatamente como fez
       descendo. Com duracao propria, a volta ficaria fora de sincronia
       com o dedo. */
    const palavras = gsap.utils.toArray(r.querySelectorAll('.prj__palavra'));
    if (palavras.length && !parado) {
      gsap.fromTo(palavras,
        { opacity: 0.22 },
        {
          opacity: 1, ease: 'none', stagger: 1,
          scrollTrigger: {
            trigger: r.querySelector('.prj__intro'),
            start: 'top 85%',
            end: 'bottom 90%',
            scrub: true,
          },
        });
    } else if (parado) {
      gsap.set(palavras, { opacity: 1 });
    }

    /* ── os painéis: deslize no scroll e resposta ao cursor ──
       Duas coisas diferentes na mesma peça. O DESLIZE é do scroll: cada
       coluna anda num ritmo próprio e as três passam umas pelas outras,
       que e o "nivel reverso" da referência. O CURSOR move só a foto
       dentro da moldura, nunca a moldura — mover a caixa inteira
       arrastaria o vizinho e a fileira perderia o alinhamento.

       `quickTo` e não `to`: num mousemove o `to` cria uma tween nova a
       cada evento, dezenas por segundo. O `quickTo` reaproveita a mesma
       e só troca o destino. */
    const limpezasPainel = [];
    const itens = gsap.utils.toArray(r.querySelectorAll('.prj__painel-item'));
    if (itens.length && !parado) {
      itens.forEach((item, i) => {
        /* o do meio anda ao contrário dos outros dois: é o cruzamento
           que faz o conjunto respirar em vez de subir em bloco */
        const taxa = [-0.10, 0.12, -0.06][i % 3];
        gsap.fromTo(item, { yPercent: 0 }, {
          yPercent: taxa * 100, ease: 'none',
          scrollTrigger: { trigger: r.querySelector('.prj__painel'), start: 'top bottom', end: 'bottom top', scrub: true },
        });

        const fig = item.querySelector('.prj__painel-fig');
        const foto = item.querySelector('.prj__painel-foto');
        if (!fig || !foto) return;

        const px = gsap.quickTo(foto, 'x', { duration: 0.7, ease: 'power3' });
        const py = gsap.quickTo(foto, 'y', { duration: 0.7, ease: 'power3' });

        const mover = (e) => {
          const b = fig.getBoundingClientRect();
          px((e.clientX - b.left - b.width / 2) * 0.09);
          py((e.clientY - b.top - b.height / 2) * 0.09);
        };
        const entrar = () => gsap.to(fig, { y: -14, scale: 1.02, duration: 0.5, ease: 'power3.out' });
        const sair = () => { px(0); py(0); gsap.to(fig, { y: 0, scale: 1, duration: 0.5, ease: 'power3.out' }); };

        fig.addEventListener('mousemove', mover);
        fig.addEventListener('mouseenter', entrar);
        fig.addEventListener('mouseleave', sair);
        limpezasPainel.push(() => {
          fig.removeEventListener('mousemove', mover);
          fig.removeEventListener('mouseenter', entrar);
          fig.removeEventListener('mouseleave', sair);
        });
      });
    }

    /* As fotos usam a MESMA persiana do resto do site. */
    const limpezas = parado ? [] : gsap.utils.toArray(r.querySelectorAll('.prj__foto'))
      .map((fig) => animarRipas(fig, fig));

    return () => {
      if (cancelarEntrada) cancelarEntrada();
      limpezasPainel.forEach((f) => f());
      limpezas.forEach((f) => f && f());
    };
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

          {/* ── a linha imaginária ──
              A JANELA tem `overflow: clip` e a largura da linha mais
              longa. É a borda dela que o texto atravessa ao entrar e ao
              sair — não a borda da tela. Medido na referência: máscara
              de 773px, exatamente a largura de "UNSTABLE", com clip.

              Duas camadas de transform, e não uma: a SAÍDA é presa ao
              scroll e a ENTRADA é presa ao tempo. Na mesma peça, o
              ScrollTrigger reescreveria `xPercent` a cada atualização e
              engoliria a entrada antes de ela terminar. Separadas, cada
              uma escreve na sua própria caixa e nenhuma pisa na outra. */}
          <h1 className="prj__titulo">
            {projeto.titulo.map((linha, i) => (
              <span className="prj__janela" key={i}>
                <span className={`prj__saida prj__saida--${i === 0 ? 'a' : 'b'}`}>
                  <span className={`prj__ln prj__ln--${i === 0 ? 'a' : 'b'}`}>{linha}</span>
                </span>
              </span>
            ))}
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
      {/* Esta faixa é a CORTINA: fica pregada no topo e o capítulo
          seguinte sobe por cima dela. Mesmo mecanismo da referência —
          a seção (Introduction) lá é `sticky; top: 0` com fundo opaco.

          O texto vem quebrado em palavras porque o preenchimento é por
          palavra: 35 <div> inline-block na referência, uma por palavra,
          acendendo conforme o scroll passa. */}
      <section className="prj__intro">
        <p className="prj__rotulo">(Introdução)</p>
        <p className="prj__intro-texto">
          {projeto.introducao.split(' ').map((palavra, i) => (
            <span className="prj__palavra" key={i}>{palavra}</span>
          ))}
        </p>
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
              {c.corpoExtra && <p data-anim="rise">{c.corpoExtra}</p>}

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
                <figcaption className="prj__legenda">{c.legenda}</figcaption>
              </figure>
            )}
          </div>

          {/* ── a fileira de painéis ──
              Medida na referência: três peças de 45.7% da largura,
              sobrepostas (espaçadas 477 numa largura de 656), com
              alturas decrescentes e 25px de degrau vertical entre elas.
              É o "nível reverso" — cada coluna anda num ritmo e as três
              deslizam umas sobre as outras.

              A legenda aparece no hover; lá ela é 32px/700 branca,
              absoluta sobre a foto. */}
          {c.galeria && (
            <ul className="prj__painel">
              {c.galeria.map((g, j) => (
                <li className="prj__painel-item" key={j}>
                  <figure className="prj__painel-fig">
                    <span className="prj__painel-foto" style={{ backgroundImage: `url(${g.src})` }}
                          role="img" aria-label={g.titulo} />
                    <figcaption className="prj__painel-legenda">
                      <span>{g.titulo}</span>
                      <i>{g.sub}</i>
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}

      {/* ══════ RESULTADOS ══════ */}
      {/* Duas colunas, medidas na referência: a direita começa em 66.5%
          e tem 30.8% de largura — e é a MESMA coluna para a imagem em
          cima e para os blocos embaixo, por isso eles alinham. */}
      <section className="prj__result">
        <div className="prj__result-topo">
          <div>
            <p className="prj__rotulo">{projeto.resultados.rotulo}</p>
            <h3 className="prj__cap-titulo" data-anim="rise">{projeto.resultados.declaracao}</h3>
            <p className="prj__cap-sub prj__result-sub" data-anim="rise">{projeto.resultados.sub}</p>
          </div>

          {projeto.resultados.imagem && (
            <figure className="prj__result-figura">
              <span className="prj__foto prj__foto--quadrada"
                    style={{ backgroundImage: `url(${projeto.resultados.imagem})` }}
                    role="img" aria-label={projeto.resultados.imagemAlt}>
                <GradeRipas />
              </span>
            </figure>
          )}
        </div>

        {/* O pente: a mesma faixa de riscos finos que o caderno usa.
            Na referência ela separa a declaração do bloco de baixo. */}
        <div className="prj__pente" aria-hidden="true">
          {Array.from({ length: 64 }, (_, i) => <i key={i} />)}
        </div>

        <div className="prj__result-base">
          <aside className="prj__registro">
            <span className="prj__aspas" aria-hidden="true">&ldquo;</span>
            <p className="prj__rotulo">{projeto.resultados.registro.rotulo}</p>
            <p className="prj__registro-frase" data-anim="rise">{projeto.resultados.registro.frase}</p>
            <p className="prj__registro-texto" data-anim="rise">{projeto.resultados.registro.texto}</p>
            <p className="prj__registro-assina">
              <b>{projeto.resultados.registro.assina}</b>
              <span>{projeto.resultados.registro.org}</span>
            </p>
          </aside>

          <ol className="prj__blocos">
            {projeto.resultados.blocos.map((b, i) => (
              <li key={i}>
                <span className="prj__bloco-n">{String(i + 1).padStart(2, '0')}</span>
                <h4 className="prj__bloco-titulo" data-anim="rise">{b.titulo}</h4>
                <p data-anim="rise">{b.texto}</p>
              </li>
            ))}
          </ol>
        </div>
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
