import React, { useRef, useState, useEffect } from 'react';
import { useCorpoJusto } from '../hooks/useCorpoJusto';
import Ondas from './Ondas';

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

  useCorpoJusto(raiz, '.cisao__ln, .cisao__ln-a, .cisao__ln-b', { ativo: ehTelefone });

  return (
    <section className="cisao" ref={raiz}>
      <div className="cisao__esq">
        {/* a unica peca que gruda */}
        <div
          className="cisao__imagem"
          style={{ backgroundImage: `url(${imagem})` }}
          role="presentation"
        />

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
            <ul className="cisao__palavras">
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
            {declaracao && <p className="cisao__declaracao">{declaracao}</p>}
          </div>

          {/* As ondas sobem sobre a imagem PRESA e sao elas que
              descobrem a segunda declaracao. Ficam entre as duas
              camadas: saem de baixo da primeira e param quando a
              segunda ja esta no lugar. */}
          <Ondas className="cisao__ondas" gatilho={raiz.current} />

          <div className="cisao__camada cisao__camada--dois">
            {declaracaoDois && <p className="cisao__declaracao">{declaracaoDois}</p>}
          </div>
        </div>
      </div>

      <div className="cisao__dir">
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
