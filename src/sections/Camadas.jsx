import React from 'react';
import Cisao, { Item, Cartao } from '../components/Cisao';
import Assinatura from './Assinatura';
import Faixa, { Coluna } from '../components/Faixa';
import Vitrine from '../components/Vitrine';
import Sobre from './Sobre';

/**
 * Camadas — os cinco blocos que abrem os modulos, cada um com o seu
 * proprio par de layouts (acervo Vance, Scroll Animation #21).
 *
 * Os rotulos vao sem numero de proposito: a copy original numerava dois
 * dos cinco e deixava tres sem, e a lista de modulos logo acima ja
 * carrega a numeracao 01-06. Repetir uma segunda contagem, desalinhada
 * com a primeira, so criaria duvida sobre qual e qual.
 */
export default function Camadas() {
  return (
    <>
      {/* ── 1 · DEVELOPMENT — cisao 52/48
             O mapa de cores do print: o cabecalho vai para o painel da
             direita, Front-end/Back-end viram a declaracao sobre a
             imagem, Banco de dados/Integracoes viram o selo, e
             APIs/Sistemas viram a nota do rodape. ── */}
      <Cisao
        imagem="/images/estrutura-primeiro.jpg"

        /* A coluna de palavras sobre a imagem, no telefone. Sao os
           mesmos rotulos que ja aparecem no selo e no rodape — nenhuma
           copy nova; o que muda e a forma de apresenta-los. */
        palavras={['Banco de dados', 'Integrações', 'APIs', 'Sistemas']}

        /* verde — selo emoldurado no topo-esquerda */
        selo={<>
          <Item rotulo="Banco de dados">Informação organizada.</Item>
          <Item rotulo="Integrações">Ferramentas trabalhando juntas.</Item>
        </>}

        /* amarelo — a declaracao grande sobre a imagem */
        /* Em spans, nao com <br/>: no telefone cada linha recebe o seu
           proprio corpo para encher a largura, e isso exige que cada uma
           seja um elemento. Em tela larga eles voltam a ser inline e o
           desenho e o de sempre. */
        /* Quatro linhas, nao duas: e assim que a referencia enche o
           bloco — cinco linhas de corpos diferentes, cada uma medindo a
           largura toda. Com duas linhas longas os corpos ficavam
           pequenos e o texto nao ocupava o espaco. */
        declaracao={<>
          <span className="cisao__ln">Experiência</span>
          <span className="cisao__ln">e interface.</span>
          <span className="cisao__ln">Lógica e</span>
          <span className="cisao__ln">funcionamento.</span>
        </>}

        /* vermelho — o cabecalho no painel da direita */
        kicker="Development"
        linhaMenor="A fachada é bonita."
        /* O par da referencia: uma linha media e uma palavra em corpo
           maximo. "funcionar." sozinha pede 72px para encher a largura —
           e ela que faz o papel do UNKNOWN de la. */
        linhaMaior={<><span className="cisao__ln-a">A estrutura precisa</span>{' '}<span className="cisao__ln-b">funcionar.</span></>}
        prosa="Não existe experiência premium quando a tecnologia por trás dela não acompanha. Por isso, o desenvolvimento faz parte da arquitetura desde o começo."

        /* azul — a nota mono no pe do painel */
        rodape={<>
          <Item rotulo="APIs">Conexão entre sistemas.</Item>
          <Item rotulo="Sistemas personalizados">Tecnologia construída para o problema.</Item>
          <Item rotulo="Sequência">Interface → Código → Sistema → Operação</Item>
        </>}

        /* segundo ato: a declaracao troca por fade enquanto a imagem
           continua parada, e o cartao sobe do lado direito */
        declaracaoDois={<>
          <span className="cisao__ln">Front-end.</span>
          <span className="cisao__ln">Back-end.</span>
          <span className="cisao__ln">APIs. Sistemas.</span>
        </>}

        cartao={
          <Cartao
            imagem="/images/funcao-em-tudo.jpg"
            kicker="Development"
            titulo={<>Por trás de uma boa experiência existe uma estrutura sólida.</>}
          >
            <span>Desenvolvemos aplicações e sistemas com arquitetura full-stack, integrações e tecnologia adequada ao problema.</span>
            <span>Front-end. Back-end. APIs. Sistemas.</span>
          </Cartao>
        }
      />

      {/* ── 2 · AUTOMATION — a marca em corpo maximo, o simbolo dos
             Degraus, a regua desenhada e o nome.

             O fichario da cadeia Lead->Venda que ficava aqui saiu: a
             Assinatura ja carrega a copy de Automation inteira, entao os
             dois diziam a mesma coisa em sequencia. E ele custava caro —
             o pin de +=300% empilhava tres alturas de tela de scroll
             travado logo acima, e recarregar dentro dessa faixa devolvia
             o leitor para dentro do pin, onde os gatilhos de baixo ja
             nascem ultrapassados. ── */}
      <Assinatura />

      {/* Tira de tres colunas com o mesmo tratamento da referencia —
          glifo, rotulo, regua e prosa em mono. Os topicos sao os da
          marca: VISUAL/FORM/MOTION descreve portfolio de arte em
          movimento, seria conteudo errado aqui.

          `colada`: sem cabecalho e sem padding de topo. A regua da
          Assinatura, logo acima, ja e o titulo desta tira — um segundo
          titulo entre as duas so abria um vao. */}
      <Faixa colada colunas={3}>
        <Coluna rotulo="Sistema" icone="sistema">
          Estrutura, integrações e banco de dados. O que sustenta a operação
          quando o volume cresce e nada pode cair.
        </Coluna>
        <Coluna rotulo="Operação" icone="operacao">
          Processos conectados para que a informação avance sozinha. Menos
          etapa manual, menos espera, menos erro de repasse.
        </Coluna>
        <Coluna rotulo="Inteligência" icone="inteligencia">
          Agentes e sistemas atuando dentro de fluxos reais. Tecnologia
          aplicada ao problema, não ao discurso.
        </Coluna>
      </Faixa>

      {/* ── 3 · ACQUISITION / DATA + AI — duas secoes encaixadas
             Reconstrucao do bloco "Modus Vivendi" da referencia: o ato 1
             trava na tela e o ato 2 sobe por cima com veu semitransparente,
             deixando a foto vazar. Substituiu os dois ficharios de Flip,
             que animavam bem mas nao conversavam com o resto da pagina.

             As linhas marcadas com PROVISORIO sao completacoes minhas —
             a copy original nao cobria esses campos. ── */}
      <Vitrine
        /* ─── ato 1 · a copy circulada, no lugar circulado ─── */
        foto="/images/faixa-luz.jpg"
        fotoMarca="Estudo — 03.05"          /* PROVISORIO */
        fotoSecao="Aquisicao"               /* PROVISORIO */
        kicker="Acquisition / Data"
        titulo={<>Se o tráfego chega,<br />o sistema precisa estar pronto.</>}
        descricao="Tráfego sem estrutura vaza. Por isso, pensamos aquisição e tecnologia como partes do mesmo sistema."
        fichaNota="Camada de aquisição"     /* PROVISORIO */
        fichaTitulo="Meta Ads · Google Ads · LLM Ads"
        fichaMono="Landing pages · Tracking · Lead capture · Database · Follow-up"
        botao="Ver o fluxo"                 /* PROVISORIO */

        /* ─── ato 2 · a secao de IA, que era o fichario seguinte ─── */
        kickerDois={<>Inteligência <span style={{ color: 'var(--fumaca)' }}>/ Infraestrutura</span></>}
        mancheteUm="IA não é o produto."
        mancheteCinza="É parte da"
        mancheteDois="infraestrutura."
        prosa="A tecnologia deve se adaptar ao negócio. Não o contrário. Por isso a IA entra como camada dentro de fluxos que já existem — atendimento, processos, informação — e não como um produto separado que alguém precisa aprender a operar."   /* segunda metade PROVISORIA */
        periodoDe="2024"
        periodoAte="2026"
        thumb="/images/nucleo.jpg"
        projetoNome="Agentes em fluxo"      /* PROVISORIO */
        codigo="IA 05"                     /* PROVISORIO */
        disciplinas={[
          'Atendimento',
          'Processos',
          'Informação',
          'Agentes',
          'Integrações',
        ]}
        marcaEsq="||| SMLB 05.14.A.002"     /* PROVISORIO */
        marcaDir="IDX — 05"                 /* PROVISORIO */
      />

      {/* ── 4 · SOBRE — o mesmo bloco da rota /about, aqui como fecho.
             O MESMO componente, nao uma copia: duplicar a marcacao seria
             garantir que as duas divergissem na primeira correcao feita
             so em um dos lados. `variante="secao"` troca o respiro de
             topo de pagina pelo de secao e o <h1> por <h2>: aqui o
             bloco e o fecho da home, nao o assunto dela.

             Saiu daqui o fichario de Security. A copy nao se perdeu: o
             modulo 06 da lista, logo acima nesta mesma pagina, ja diz
             tudo o que ele dizia — os dois eram a mesma coisa contada
             duas vezes. ── */}
      <Sobre variante="secao" />
    </>
  );
}
