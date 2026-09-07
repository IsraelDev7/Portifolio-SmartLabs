import React from 'react';
import Fichario, { Ficha, Legenda } from '../components/Fichario';
import Cisao, { Item, Cartao } from '../components/Cisao';
import Assinatura from './Assinatura';
import Faixa, { Coluna } from '../components/Faixa';
import Vitrine from '../components/Vitrine';

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

        /* verde — selo emoldurado no topo-esquerda */
        selo={<>
          <Item rotulo="Banco de dados">Informação organizada.</Item>
          <Item rotulo="Integrações">Ferramentas trabalhando juntas.</Item>
        </>}

        /* amarelo — a declaracao grande sobre a imagem */
        declaracao={<>Experiência e interface.<br />Lógica e funcionamento.</>}

        /* vermelho — o cabecalho no painel da direita */
        kicker="Development"
        linhaMenor="A fachada é bonita."
        linhaMaior={<>A estrutura precisa funcionar.</>}
        prosa="Não existe experiência premium quando a tecnologia por trás dela não acompanha. Por isso, o desenvolvimento faz parte da arquitetura desde o começo."

        /* azul — a nota mono no pe do painel */
        rodape={<>
          <Item rotulo="APIs">Conexão entre sistemas.</Item>
          <Item rotulo="Sistemas personalizados">Tecnologia construída para o problema.</Item>
          <Item rotulo="Sequência">Interface → Código → Sistema → Operação</Item>
        </>}

        /* segundo ato: a declaracao troca por fade enquanto a imagem
           continua parada, e o cartao sobe do lado direito */
        declaracaoDois={<>Front-end. Back-end.<br />APIs. Sistemas.</>}

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

      {/* ── 4 · SECURITY — leque desalinhado encaixa em bloco ── */}
      <Fichario variante="sec">
        <Legenda
          rotulo="Security"
          fecho="Construir bem também é saber o que proteger."
        >
          Tecnologia sem segurança<br />não é estrutura.
        </Legenda>

        <Ficha rotulo="01" titulo="Proteção de dados" />
        <Ficha rotulo="02" titulo="Controle de acesso" />
        <Ficha rotulo="03" titulo="Arquitetura segura" />
        <Ficha rotulo="04" titulo="Boas práticas" />
        <Ficha rotulo="05" titulo="Proteção das integrações" />
      </Fichario>
    </>
  );
}
