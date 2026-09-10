import React, { useRef, useState, useEffect } from 'react';
import { useCorpoJusto } from '../hooks/useCorpoJusto';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Ondas from './Ondas';
import { GradeRipas, animarRipas } from './Persiana';

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
 * A imagem NUNCA se move — ela e a unica peca sticky. Tudo o que esta na
 * frente dela ROLA: o selo, as duas declaracoes, e a coluna da direita.
 * Nao ha fade cruzado nenhum; os textos sobem e saem, que e o que
 * acontece na referencia. A camada de texto sobe -100vh para ocupar a
 * mesma faixa da imagem sem somar altura.
 *
 * O painel da direita e Grafite, nao branco. Sobre o Aco da pagina, dez
 * pontos de luminancia ja separam os planos sem sair do territorio.
 */
export default function Cisao({
  imagem,
  palavras,
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
  const raiz = useRef(null);

  /* As linhas em corpo maximo sao MEDIDAS, nao fixadas. O calculo
     estatico que eu tinha feito errava por arredondamento — "funcionar."
     rendia 389px onde a conta dava 360, e vazava 29px pela borda. O hook
     mede o texto de verdade e acerta o corpo. E o mesmo principio da
     referencia: a linha enche a largura, e o numero e consequencia. */
  const [ehTelefone, setEhTelefone] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 820px)').matches
  );
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 820px)');
    const ao = (e) => setEhTelefone(e.matches);
    mq.addEventListener('change', ao);
    return () => mq.removeEventListener('change', ao);
  }, []);

    /* So a PRIMEIRA camada entra no corpo justo. A segunda e o fecho do
     ato e tem corpo fixo — medida no corpo maximo, ela competia com a
     declaracao de cima em vez de fechar embaixo dela. */
  useCorpoJusto(raiz, '.cisao__camada:first-child .cisao__ln, .cisao__ln-a, .cisao__ln-b', { ativo: ehTelefone });

  /* A persiana da imagem. O gatilho e a propria secao, e nao a peca
     sticky: grudada no topo, ela entra na tela junto com a secao e um
     gatilho nela dispararia cedo demais. */
  useGSAP(() => {
    const img = raiz.current && raiz.current.querySelector('.cisao__imagem');
    if (!img) return;
    return animarRipas(img, raiz.current);
  }, { scope: raiz });

  /* ── a declaracao em tela larga: entra em persiana, sai desbotando ──
     So no desktop. No telefone a cascata generica do data-anim ja da
     conta, e as duas ligadas juntas poriam dois tweens disputando `y` e
     `opacity` nos mesmos spans.
     
     Sao dois gestos com naturezas diferentes, e essa diferenca e o
     ponto:

     ENTRADA por toggleActions — acontece de uma vez, no tempo dela,
     quando a linha cruza a borda. E uma frase sendo dita.

     SAIDA por scrub — nao tem tempo proprio: obedece ao dedo. E o que
     amarra o desvanecer a subida das ondas e da segunda declaracao,
     em vez de deixar os tres correndo em relogios separados. Rolando
     de volta, o scrub refaz o caminho sozinho. */
  useGSAP(() => {
    const r = raiz.current;
    if (!r || ehTelefone) return;

    const p = r.querySelector('.cisao__camada:first-child .cisao__declaracao');
    const doisEl = r.querySelector('.cisao__camada--dois');
    if (!p || !doisEl) return;

    const linhas = gsap.utils.toArray(p.querySelectorAll('.cisao__ln'));
    if (!linhas.length) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(linhas, { clearProps: 'all' });
      gsap.set(p, { opacity: 1 });
      return;
    }

    /* Os -25% em cima e embaixo NAO sao folga decorativa. Com
       `line-height: 1.02` num corpo de 121px, o desenho da letra
       transborda a caixa da linha: medido, o texto ocupa 154px onde a
       caixa tem 123. Um `inset(0 ...)` cortaria acentos em cima e a
       perna do "g" embaixo — o "Lógica e" perderia os dois. */
    const OCULTO = 'inset(-25% 0% 100% 0%)';
    const ABERTO = 'inset(-25% 0% -25% 0%)';

    gsap.fromTo(linhas,
      { clipPath: OCULTO, y: 46 },
      {
        clipPath: ABERTO, y: 0,
        duration: 0.9, ease: 'expo.out', stagger: 0.09,
        scrollTrigger: {
          /* O gatilho e o proprio bloco, nao a secao: a declaracao mora
             no PE da primeira camada, e um gatilho na secao a faria
             animar cerca de 900px antes de aparecer. */
          trigger: p,
          start: 'top 88%',
          toggleActions: 'restart none none reverse',
        },
      });

    gsap.to(p, {
      opacity: 0, ease: 'none',
      scrollTrigger: {
        /* A segunda camada e o relogio: o desvanecer comeca quando ela
           encosta na borda de baixo da tela e termina quando chega a
           45% da altura — que e o trecho em que as ondas sobem e a
           segunda declaracao aparece. Uma faixa fixa em pixels
           descasaria disso na primeira janela de outra altura. */
        trigger: doisEl,
        start: 'top bottom',
        end: 'top 45%',
        scrub: 0.4,
      },
    });
  }, { dependencies: [ehTelefone], scope: raiz });

  return (
    <section className="cisao" ref={raiz}>
      <div className="cisao__esq">
        {/* a unica peca que gruda */}
        {/* A mesma persiana das obras da Work: a foto se monta em ripas
            que recolhem em ordem espalhada. Aqui a grade mora DENTRO da
            peca sticky, senao ela ficaria parada enquanto a imagem
            desliza por baixo. */}
        <div
          className="cisao__imagem"
          style={{ backgroundImage: `url(${imagem})` }}
          role="presentation"
        >
          <GradeRipas />
        </div>

        <div className="cisao__fios" aria-hidden="true">
          {Array.from({ length: 7 }, (_, i) => <i key={i} />)}
        </div>

        {/* ── a camada que sobe sobre a imagem, so no telefone ──
            Medida na referencia em 414px: uma coluna de palavras em 18px
            a 20px da borda, com passo de 20px, e logo abaixo dela um
            circulo de 43px que pisca como a luz de uma camera gravando.

            As duas pecas cobrem so o canto superior esquerdo — a imagem
            continua sendo o assunto, e elas leem como marcacao tecnica
            por cima dela, nao como um painel que a substitui. */}
        {palavras && (
          <div className="cisao__marcacao" aria-hidden="true">
            <ul className="cisao__palavras" data-anim="stagger">
              {palavras.map((p) => <li key={p}>{p}</li>)}
            </ul>
            <i className="cisao__rec" />
          </div>
        )}

        {/* camadas de texto: rolam por cima da imagem parada */}
        <div className="cisao__textos">
          <div className="cisao__camada">
            {selo && (
              <div className="cisao__selo">
                {selo}
                <i className="cisao__ponto" aria-hidden="true" />
              </div>
            )}
            {/* O data-anim so no telefone: em tela larga esta linha tem
                coreografia propria, logo acima, e as duas ligadas
                disputariam `y` e `opacity` nos mesmos spans. */}
            {declaracao && (
              <p
                className="cisao__declaracao"
                {...(ehTelefone ? { 'data-anim': 'stagger' } : {})}
              >{declaracao}</p>
            )}
          </div>

          {/* As ondas sobem sobre a imagem PRESA e sao elas que
              descobrem a segunda declaracao. Ficam entre as duas
              camadas: saem de baixo da primeira e param quando a
              segunda ja esta no lugar. */}
          <Ondas className="cisao__ondas" gatilho={raiz.current} />

          <div className="cisao__camada cisao__camada--dois">
            {declaracaoDois && <p className="cisao__declaracao" data-anim="stagger">{declaracaoDois}</p>}
          </div>
        </div>
      </div>

      <div className="cisao__dir">
        <div className="cisao__ato">
          <header>
            {kicker && <span className="cisao__kicker" data-anim="rise">{kicker}</span>}
            {linhaMenor && <p className="cisao__menor" data-anim="rise">{linhaMenor}</p>}
            {linhaMaior && <h2 className="cisao__maior" data-anim="stagger">{linhaMaior}</h2>}
            <i className="cisao__regua" data-anim="line" aria-hidden="true" />
            {prosa && <p className="cisao__prosa" data-anim="rise">{prosa}</p>}
          </header>

          {rodape && <div className="cisao__rodape" data-anim="stagger">{rodape}</div>}
        </div>

        {/* O cartao para no topo do segundo ato. Abaixo dele fica vazio
            de proposito: e o fecho limpo da secao. */}
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
  const raiz = useRef(null);

  /* A mesma persiana da imagem grande. O gatilho e o cartao inteiro e
     nao a foto: o cartao entra na tela pela borda de baixo, e quando a
     foto sozinha cruza o gatilho o texto abaixo dela ja esta lido. */
  useGSAP(() => {
    const img = raiz.current && raiz.current.querySelector('.cartao__imagem');
    if (!img) return;
    return animarRipas(img, raiz.current);
  }, { scope: raiz });

  return (
    <article className="cartao" ref={raiz}>
      {imagem && (
        <div
          className="cartao__imagem"
          style={{ backgroundImage: `url(${imagem})` }}
          role="presentation"
        >
          <GradeRipas />
        </div>
      )}
      {kicker && <span className="cisao__kicker" data-anim="rise">{kicker}</span>}
      <h3 className="cartao__titulo" data-anim="rise">{titulo}</h3>
      <i className="cisao__regua" data-anim="line" aria-hidden="true" />
      <div className="cartao__notas" data-anim="stagger">{children}</div>
    </article>
  );
}
