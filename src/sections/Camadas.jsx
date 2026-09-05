import React from 'react';
import Fichario, { Ficha, Legenda } from '../components/Fichario';

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
      {/* ── 1 · DEVELOPMENT — grade dispersa vira fileira ── */}
      <Fichario variante="dev">
        <Legenda
          rotulo="Development"
          fecho={
            <>
              Não existe experiência premium quando a tecnologia por trás dela não
              acompanha. Por isso, o desenvolvimento faz parte da arquitetura desde o começo.
              <span className="fichario__sequencia">Interface → Código → Sistema → Operação</span>
            </>
          }
        >
          A fachada é bonita.<br />A estrutura precisa funcionar.
        </Legenda>

        <Ficha rotulo="01" titulo="Front-end">Experiência e interface.</Ficha>
        <Ficha rotulo="02" titulo="Back-end">Lógica e funcionamento.</Ficha>
        <Ficha rotulo="03" titulo="APIs">Conexão entre sistemas.</Ficha>
        <Ficha rotulo="04" titulo="Banco de dados">Informação organizada.</Ficha>
        <Ficha rotulo="05" titulo="Integrações">Ferramentas trabalhando juntas.</Ficha>
        <Ficha rotulo="06" titulo="Sistemas personalizados">Tecnologia construída para o problema.</Ficha>
      </Fichario>

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
