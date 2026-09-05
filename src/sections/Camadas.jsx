import React from 'react';
import Fichario, { Ficha, Legenda } from '../components/Fichario';
import Cisao, { Item, Cartao } from '../components/Cisao';
import Assinatura from './Assinatura';
import Faixa, { Coluna } from '../components/Faixa';

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

      {/* ── 2 · AUTOMATION — espalhadas viram a cadeia do fluxo ── */}
      <Fichario variante="auto" stagger={0.03}>
        <Legenda
          rotulo="Automation"
          fecho="Automação não existe para tornar o negócio mais complicado. Existe para tornar a operação mais simples, rápida e consistente."
        >
          Se uma tarefa se repete,<br />ela pode ser repensada.
        </Legenda>

        <Ficha rotulo="01" titulo="Lead" />
        <Ficha rotulo="02" titulo="Formulário" />
        <Ficha rotulo="03" titulo="Captura" />
        <Ficha rotulo="04" titulo="Dados" />
        <Ficha rotulo="05" titulo="Automação" />
        <Ficha rotulo="06" titulo="Mensagem" />
        <Ficha rotulo="07" titulo="Follow-up" />
        <Ficha rotulo="08" titulo="Venda" />
      </Fichario>

      {/* ── fecho do bloco Automation: a marca em corpo maximo, o
             simbolo dos Degraus, a regua desenhada e o nome ── */}
      <Assinatura />

      {/* Tira de tres colunas com o mesmo tratamento da referencia —
          glifo, rotulo, regua e prosa em mono. Os topicos sao os da
          marca: VISUAL/FORM/MOTION descreve portfolio de arte em
          movimento, seria conteudo errado aqui. */}
      <Faixa
        kicker="Estrutura"
        titulo={<>Três camadas sustentam<br />qualquer operação digital.</>}
        colunas={3}
      >
        <Coluna rotulo="Sistema">
          Estrutura, integrações e banco de dados. O que sustenta a operação
          quando o volume cresce e nada pode cair.
        </Coluna>
        <Coluna rotulo="Operação">
          Processos conectados para que a informação avance sozinha. Menos
          etapa manual, menos espera, menos erro de repasse.
        </Coluna>
        <Coluna rotulo="Inteligência">
          Agentes e sistemas atuando dentro de fluxos reais. Tecnologia
          aplicada ao problema, não ao discurso.
        </Coluna>
      </Faixa>

      {/* ── 3 · ACQUISITION / DATA — das bordas para o nucleo ── */}
      <Fichario variante="acq" stagger={0.04}>
        <Legenda
          rotulo="Acquisition / Data"
          fecho="Tráfego sem estrutura vaza. Por isso, pensamos aquisição e tecnologia como partes do mesmo sistema."
        >
          Se o tráfego chega,<br />o sistema precisa estar pronto.
        </Legenda>

        <Ficha rotulo="ADS" titulo="Meta Ads" />
        <Ficha rotulo="ADS" titulo="Google Ads" />
        <Ficha rotulo="ADS" titulo="LLM Ads" />
        <Ficha rotulo="WEB" titulo="Landing pages" />
        <Ficha rotulo="DATA" titulo="Tracking" />
        <Ficha rotulo="DATA" titulo="Lead capture" />
        <Ficha rotulo="DATA" titulo="Database" />
        <Ficha rotulo="CRM" titulo="Follow-up" />
      </Fichario>

      {/* ── 4 · AI — pilha sobreposta abre em leque ── */}
      <Fichario variante="ai" absoluto>
        <Legenda
          rotulo="Artificial Intelligence"
          fecho="A tecnologia deve se adaptar ao negócio. Não o contrário."
        >
          IA não é o produto.<br />É parte da infraestrutura.
        </Legenda>

        <Ficha rotulo="01" titulo="Atendimento">Respostas e interação com clientes.</Ficha>
        <Ficha rotulo="02" titulo="Processos">Execução inteligente de tarefas.</Ficha>
        <Ficha rotulo="03" titulo="Informação">Organização e processamento de dados.</Ficha>
        <Ficha rotulo="04" titulo="Agentes">Sistemas capazes de atuar dentro de fluxos definidos.</Ficha>
        <Ficha rotulo="05" titulo="Integrações">IA conectada às ferramentas que o negócio já utiliza.</Ficha>
      </Fichario>

      {/* ── 5 · SECURITY — leque desalinhado encaixa em bloco ── */}
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
