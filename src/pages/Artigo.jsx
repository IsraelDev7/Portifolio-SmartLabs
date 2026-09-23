import React, { useRef } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePageMotion } from '../hooks/usePageMotion';
import TransitionLink from '../components/TransitionLink';
import { GradeRipas, animarRipas } from '../components/Persiana';
import Partilha from '../components/Partilha';
import { useCorpoJusto } from '../hooks/useCorpoJusto';
import { acharArtigo, outrosArtigos, proximoArtigo } from '../dados/artigos';

gsap.registerPlugin(ScrollTrigger);

/**
 * Artigo — a leitura completa de uma ideia.
 *
 * Reconstruída sobre a referência (vertical.framer.media), medida no
 * DOM em viewport de 1597. O que foi copiado é a ESTRUTURA; a
 * tipografia e a cor são as da marca.
 *
 *   trilho     autor à esquerda, fora da coluna de leitura
 *   titulo     90px, entrelinha 1.0, tracking -0.06em
 *   regua      8px de altura, a largura inteira da coluna
 *   subtitulo  40px, -0.04em, revelado palavra a palavra
 *   capa       razao 1.39, sangrando ate as margens da pagina
 *   abertura   40px em caixa alta, largura total
 *   blocos     colunas de 631px alternando lado, vao de 160px
 *   imagens    3:4 — a largura exata da coluna
 *
 * ── as duas divergencias, e o porque ──
 *
 * 1. A referencia usa entrelinha 1.1 no corpo, com peso 600. Funciona
 *    em ingles, em bloco curto. Em portugues as palavras sao mais
 *    longas e ha acento acima da altura-x: com 1.1, o til da linha de
 *    baixo encosta na perna da linha de cima. Aqui o corpo vai em 1.6.
 *
 * 2. La o artigo e claro sobre um site escuro. Mantemos a inversao —
 *    ela marca a mudanca de modo, de vitrine para leitura — mas com Cal
 *    e Aco no lugar de branco e preto puros.
 */
export default function Artigo() {
  const { slug } = useParams();
  const artigo = acharArtigo(slug);
  const motionRef = usePageMotion();
  const alvo = useRef(null);

  /* ── por que o titulo NAO usa o corpo justo ──
     A tentacao era medir, como no heroi. Mas medir para encher a
     largura so funciona quando as linhas tem peso parecido: a
     referencia tem oito palavras em tres linhas e chega a 90px.
     "A estrutura vem antes da estetica." tem seis — em tres linhas,
     cada uma precisaria de 186px para encher, e o titulo passaria a
     depender do numero de palavras em vez do desenho da pagina.

     A referencia usa corpo fixo e deixa a frase quebrar sozinha. E o
     que faz o titulo ter o mesmo tamanho em todos os artigos. */

  /* "MAIS IDEIAS" e a UNICA linha desta pagina com corpo medido.
     Ver a nota no JSX: uma linha, peso uniforme, trabalho de ocupar a
     largura inteira. Fora desse caso a medicao faz o corpo depender do
     numero de palavras em vez do desenho da pagina.

     ── por que desligar no telefone, e nao sobrescrever no CSS ──
     O hook grava `font-size` INLINE e com prioridade. Estilo inline
     marcado vence qualquer regra da folha, inclusive outra marcada:
     a media query do telefone perdia, o titulo ficava em 285px numa
     tela de 375 e era cortado pelo `overflow-x: clip` da pagina — sem
     rolagem horizontal para denunciar.

     Desligar e a correcao certa porque o hook limpa o que escreveu ao
     ser desativado, e ai o CSS volta a mandar. Enquadrar "MAIS IDEIAS"
     na largura de um telefone daria letra de 14px de altura: a linha
     quebra em duas, que e o desenho certo para essa largura. */
  /* A condicao vai como FUNCAO: o hook a reavalia a cada ajuste, junto
     com o ResizeObserver que ele ja mantem. Espelhar a faixa num estado
     do React alimentado por `matchMedia('change')` nao funcionou — o
     evento nao chegava ao mudar a largura da janela, e o corpo da faixa
     anterior ficava preso num estilo inline marcado, que nenhuma regra
     da folha consegue corrigir. */
  useCorpoJusto(alvo, '.art__mais-titulo', {
    ativo: () => !window.matchMedia('(max-width: 820px)').matches,
  });

  useGSAP(() => {
    const r = alvo.current;
    if (!r || !artigo) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    /* ── a regua sob o titulo ──
       Ela é traçada da esquerda para a direita. É o primeiro
       movimento da página: risca a linha e só então o subtítulo
       aparece por baixo dela. */
    const regua = r.querySelector('.art__regua');
    if (regua) {
      gsap.from(regua, {
        scaleX: 0, transformOrigin: 'left center',
        duration: 1.1, ease: 'expo.out', delay: 0.15,
      });
    }

    /* ── o subtitulo, palavra a palavra ──
       A referencia quebra o subtitulo num span por palavra e revela em
       cascata. Nao e fade do bloco: e cada palavra saindo de baixo de
       uma mascara, o que faz a frase parecer sendo dita. */
    const palavras = gsap.utils.toArray(r.querySelectorAll('.art__palavra i'));
    if (palavras.length) {
      gsap.from(palavras, {
        yPercent: 110, duration: 0.8, ease: 'expo.out',
        stagger: 0.035, delay: 0.3,
      });
    }

    /* ── as imagens: a mesma persiana da secao Work ──
       Nao e um efeito parecido: e a MESMA funcao. `animarRipas` vive
       em components/Persiana e ja serve a Work e a Cisao. Escrever
       uma copia aqui criaria dois lugares para corrigir quando o
       timing mudar — e eles divergem na primeira correcao feita so
       em um deles.

       Cada figura e seu proprio gatilho: as imagens estao espalhadas
       pela leitura, e um gatilho unico faria todas abrirem quando a
       primeira cruzasse a borda. */
    const limpezas = gsap.utils.toArray(r.querySelectorAll('.art__foto'))
      .map((fig) => animarRipas(fig, fig));

    /* A capa ganha, alem da persiana, uma deriva interna: sem ela a
       foto e um retangulo parado no meio da leitura. */
    const capa = r.querySelector('.art__capa');
    if (capa) {
      gsap.fromTo(capa.querySelector('.art__foto'),
        { backgroundPositionY: '44%' },
        { backgroundPositionY: '56%', ease: 'none',
          scrollTrigger: { trigger: capa, start: 'top bottom', end: 'bottom top', scrub: true } });
    }

    return () => limpezas.forEach((f) => f && f());
  }, { scope: alvo, dependencies: [slug] });

  if (!artigo) return <Navigate to="/404" replace />;

  const outros = outrosArtigos(slug);
  const proximo = proximoArtigo(slug);

  /* Divide em palavras para a revelação em cascata. Cada palavra ganha
     uma janela com `overflow: hidden` e um <i> que sobe de dentro. */
  const emPalavras = (texto) =>
    texto.split(' ').map((p, i) => (
      <span className="art__palavra" key={i}>
        <i>{p}</i>{' '}
      </span>
    ));

  /* Negrito por marcação simples: o conteúdo é texto, não JSX, para o
     arquivo de dados não virar código. */
  const comEnfase = (texto) =>
    texto.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((parte, i) => {
      if (parte.startsWith('**')) return <b key={i}>{parte.slice(2, -2)}</b>;
      if (parte.startsWith('`')) return <code key={i}>{parte.slice(1, -1)}</code>;
      return <React.Fragment key={i}>{parte}</React.Fragment>;
    });

  return (
    <main className="art" ref={(n) => { alvo.current = n; motionRef.current = n; }}>

      {/* ══════ CABEÇALHO ══════ */}
      <header className="art__topo">
        {/* trilho: fica fora da coluna de leitura, como na referência */}
        <aside className="art__trilho">
          <div className="art__autor">
            <span className="art__rotulo">Escrito por</span>
            <span className="art__autor-nome">{artigo.autor}</span>
          </div>
          {/* As pautas do trilho: na referência é um bloco de linhas que
              não carrega informação — marca a coluna como margem, e não
              como espaço esquecido. */}
          <div className="art__pautas" aria-hidden="true">
            {Array.from({ length: 9 }, (_, i) => <i key={i} />)}
          </div>
        </aside>

        <div className="art__cabeca">
          <p className="art__data">{artigo.data}</p>

          <h1 className="art__titulo">{artigo.titulo}</h1>

          <i className="art__regua" aria-hidden="true" />

          <h2 className="art__subtitulo">{emPalavras(artigo.subtitulo)}</h2>

          <dl className="art__meta">
            <div>
              <dt className="art__rotulo">Tempo de leitura</dt>
              <dd className="art__meta-valor">{artigo.leitura}</dd>
            </div>
            <div>
              <dt className="art__rotulo">Área</dt>
              <dd className="art__meta-valor">{artigo.area}</dd>
            </div>
          </dl>
        </div>
      </header>

      {/* ══════ CAPA ══════ */}
      <figure className="art__capa">
        <div
          className="art__foto"
          style={{ backgroundImage: `url(${artigo.capa})` }}
          role="img"
          aria-label={artigo.capaAlt}
        >
          <GradeRipas />
        </div>
      </figure>

      {/* ══════ ABERTURA ══════ */}
      <section className="art__abertura">
        {artigo.abertura.map((p, i) => (
          <p className="art__abertura-linha" data-anim="rise" key={i}>{comEnfase(p)}</p>
        ))}
      </section>

      {/* ══════ CORPO ══════ */}
      {/* Duas colunas que fluem de forma INDEPENDENTE. A primeira
          versao usava uma grade unica com `grid-column`, e cada bloco
          ocupava uma linha inteira: a celula oposta ficava vazia e a
          pagina enchia de buraco. Empilhando por coluna, cada lado
          desce sem intervalo. */}
      <div className="art__corpo">
        {['esq', 'dir'].map((lado) => (
          <div className={`art__coluna art__coluna--${lado}`} key={lado}>
            {artigo.blocos
              .map((b, i) => ({ b, i }))          /* guarda o indice do array */
              .filter(({ b }) => b.lado === lado)
              .map(({ b, i }) => {
              return (
                /* `--ordem` so e usada no telefone. La as colunas viram
                   `display: contents` e todos os blocos caem na mesma
                   pilha — em ordem de DOM, que e "tudo da esquerda,
                   depois tudo da direita". Isso jogaria o fecho para o
                   meio da leitura. Com `order`, o telefone le na ordem
                   em que os blocos foram escritos no arquivo de dados. */
                <section className="art__bloco" style={{ '--ordem': i }} key={i}>
                  {b.imagemPrimeiro && b.imagem && (
                    <figure className="art__figura">
                      <div className="art__foto" style={{ backgroundImage: `url(${b.imagem})` }}
                           role="img" aria-label={b.imagemAlt || ''}>
                        <GradeRipas />
                      </div>
                    </figure>
                  )}

                  <h3 className="art__bloco-titulo" data-anim="rise">{b.titulo}</h3>

                  {b.paragrafos.map((t, j) => (
                    <p className="art__p" data-anim="rise" key={j}>{comEnfase(t)}</p>
                  ))}

                  {b.codigo && (
                    <pre className="art__codigo" data-anim="rise"><code>{b.codigo}</code></pre>
                  )}

                  {/* Os setores: lista de definição, não parágrafo. O
                      leitor não lê isto — ele VARRE procurando o
                      próprio negócio. Rótulo curto em mono à esquerda
                      do olho, uma frase inteira de resposta abaixo. */}
                  {b.setores && (
                    <dl className="art__setores" data-anim="rise">
                      {b.setores.map(([nome, texto], k) => (
                        <div key={k}>
                          <dt>{nome}</dt>
                          <dd>{comEnfase(texto)}</dd>
                        </div>
                      ))}
                    </dl>
                  )}

                  {!b.imagemPrimeiro && b.imagem && (
                    <figure className="art__figura">
                      <div className="art__foto" style={{ backgroundImage: `url(${b.imagem})` }}
                           role="img" aria-label={b.imagemAlt || ''}>
                        <GradeRipas />
                      </div>
                    </figure>
                  )}
                </section>
              );
            })}
          </div>
        ))}
      </div>

      {/* ══════ FECHO ══════ */}
      {/* A referencia encaixa o rotulo de compartilhar DENTRO da coluna
          de texto da assinatura, e nao abaixo do bloco inteiro: o selo
          quadrado a esquerda abre uma coluna, e tudo que e sobre o
          artigo — data, titulo, autor, partilha — desce alinhado nela.
          Fora dela, a linha de icones voltava para a margem da pagina e
          o bloco perdia o eixo. */}
      <section className="art__fecho">
        <h2 className="art__fecho-titulo">{artigo.fecho}</h2>

        <div className="art__assinatura">
          {/* O retrato, e nao o monograma. A referencia usa a foto do
              autor; a marca ja assina a pagina inteira no topo, entao
              repeti-la aqui nao acrescenta nada — e um rosto, sim. E a
              MESMA imagem da secao Sobre, no padrao da casa: fundo Aco,
              luz de recorte em Solda.

              Vai como `.art__foto` para a persiana desta pagina cobri-la
              junto com as outras — uma classe nova exigiria lembrar de
              registra-la la em cima, e e assim que uma imagem nasce sem
              animacao. */}
          <figure className="art__assinatura-marca">
            <div
              className="art__foto"
              style={{ backgroundImage: 'url(/images/retrato.jpg)' }}
              role="img"
              aria-label={`Retrato de ${artigo.autor}`}
            >
              <GradeRipas />
            </div>
          </figure>

          <div className="art__assinatura-corpo">
            <p className="art__data">{artigo.dataCurta}</p>
            <h3 className="art__assinatura-titulo">{artigo.titulo}</h3>
            <p className="art__rotulo">Por {artigo.autor}</p>

            <p className="art__rotulo art__partilha-rotulo">Compartilhar</p>
            <Partilha
              url={`https://smartlabs.ai/thoughts/${artigo.slug}`}
              titulo={artigo.titulo}
            />
          </div>
        </div>

        {/* O filete separa a assinatura do que vem A SEGUIR. Na
            referencia ele e a fronteira entre "este artigo acabou" e
            "o proximo comeca aqui" — sem ele o bloco Proximo le como
            rodape da assinatura. */}
        {proximo && (
          <>
            <i className="art__filete" aria-hidden="true" />
            <TransitionLink className="art__proximo" to={`/thoughts/${proximo.slug}`}>
              {/* A chapa e um BOTAO, entao o movimento tem que ler como
                  acao, e nao como defeito: aqui nada de `steps` nem de
                  falha — a chapa inverte de Solda para Cal subindo, e a
                  palavra rola, que e a gramatica de hover ja usada nos
                  links do site (RollLink).

                  Duas copias da palavra: a de cima sai por cima da
                  janela enquanto a de baixo entra no lugar dela. A
                  segunda e `aria-hidden` para o leitor de tela nao
                  anunciar "proximo proximo". */}
              <span className="art__proximo-selo">
                <span className="art__proximo-rolo">
                  <i>Próximo</i>
                  <i aria-hidden="true">Próximo</i>
                </span>
              </span>
              <span className="art__proximo-titulo">{proximo.titulo}</span>
              <span className="art__rotulo">Por {proximo.autor}</span>
            </TransitionLink>
          </>
        )}
      </section>

      {/* ══════ MAIS IDEIAS ══════ */}
      <section className="art__mais">
        {/* Corpo MEDIDO, nao fixado. Aqui a medicao cabe — e uma linha
            so, de peso uniforme, cujo trabalho e ocupar a largura
            inteira (na referencia "MORE THOUGHTS" vai de borda a
            borda). E o caso oposto ao do titulo do artigo, que tem tres
            linhas de pesos diferentes e por isso usa corpo fixo. */}
        <h2 className="art__mais-titulo" aria-label="Mais ideias">Mais ideias</h2>
        <div className="art__pente" aria-hidden="true">
          {Array.from({ length: 64 }, (_, i) => <i key={i} />)}
        </div>

        <ul className="art__lista">
          {outros.map((o) => (
            <li key={o.slug}>
              <TransitionLink className="art__linha" to={`/thoughts/${o.slug}`}>
                {/* A imagem entra como `.art__foto`: e essa a classe que
                    o `animarRipas` la em cima varre. Um seletor novo
                    aqui exigiria lembrar de registra-lo la — e e assim
                    que uma imagem nasce sem animacao. */}
                <span className="art__linha-foto">
                  <span className="art__foto" style={{ backgroundImage: `url(${o.capa})` }}
                        role="img" aria-label={o.capaAlt || ''}>
                    <GradeRipas />
                  </span>
                </span>

                <span className="art__linha-corpo">
                  <span className="art__data">{o.dataCurta} — {o.area}</span>
                  <span className="art__linha-titulo" data-anim="rise">{o.titulo}</span>
                  <span className="art__linha-resumo" data-anim="rise">{o.resumo}</span>
                  <span className="art__rotulo">{o.leitura} de leitura</span>
                </span>

                <span className="art__linha-seta" aria-hidden="true">→</span>
              </TransitionLink>
            </li>
          ))}
          {!outros.length && (
            <li className="art__vazio">
              <Link to="/thoughts">Voltar para o caderno</Link>
            </li>
          )}
        </ul>
      </section>
    </main>
  );
}
