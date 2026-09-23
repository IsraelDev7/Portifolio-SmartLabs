/**
 * artigos.js — o conteúdo do caderno.
 *
 * Os textos moram aqui, separados do componente que os desenha. O
 * motivo é prático: a página do artigo tem layout fixo — colunas
 * alternadas, imagens em 3:4, abertura em corpo grande — e o conteúdo
 * muda toda semana. Misturar os dois faria cada texto novo exigir
 * mexer em JSX.
 *
 * ── a forma de um artigo ──
 * Medida na referência (vertical.framer.media), em viewport de 1597:
 *
 *   abertura   parágrafos em 40px, caixa alta, largura total
 *   blocos     alternam lado: coluna esquerda, depois direita
 *   imagem     631x858 — razão 3:4, a largura exata da coluna
 *
 * Cada bloco declara `lado` — e as duas colunas fluem de forma
 * INDEPENDENTE, empilhando o que lhes cabe sem deixar buraco. Foi o
 * erro da primeira versão: com `grid-column` numa grade única, cada
 * bloco ocupava uma linha inteira e a célula oposta ficava vazia.
 *
 * `imagemPrimeiro` inverte a ordem dentro do bloco. Na referência a
 * coluna esquerda abre com texto e fecha com imagem; a direita faz o
 * contrário. É essa alternância cruzada que tira o ritmo de tabela e
 * faz a página parecer diagramada.
 */

export const ARTIGOS = [
  {
    slug: 'a-estrutura-vem-antes-da-estetica',
    indice: '01',
    area: 'Development',
    data: '22 de setembro de 2026',
    dataCurta: 'SET 2026',
    leitura: '5 minutos',
    autor: 'Israel Passos',
    titulo: 'A estrutura vem antes da estética.',
    subtitulo:
      'Um site pode estar no ar, bonito e rápido — e não entregar um único contato. Descobri isso auditando o meu próprio trabalho.',
    resumo:
      'Interface bonita sobre arquitetura frágil não sobrevive ao primeiro pico de volume. O que sustenta a experiência premium é justamente o que ninguém vê.',
    capa: '/images/ideia-estrutura.jpg',
    capaAlt: 'Estrutura de concreto armado com a ferragem exposta antes da concretagem',

    abertura: [
      'Todo mundo elogia a fachada. Quase ninguém pergunta se o prédio fica de pé.',
      'E o problema com fachada é que ela não avisa quando a estrutura cede. O site continua abrindo, continua bonito, continua rápido. O que parou de funcionar foi a parte que ninguém olha.',
      'Eu descobri isso do jeito mais desconfortável possível: auditando um site que eu mesmo tinha entregue.',
    ],

    blocos: [
      {
        lado: 'esq',
        titulo: 'O site respondia 200. A captura estava morta.',
        paragrafos: [
          'Uma landing page de consultoria, no ar havia meses. Abria em menos de dois segundos, desenho impecável, formulário respondendo "enviado" com uma animação bem-feita.',
          'Rodei uma verificação de rotina no endereço da API. Voltou isto:',
          'A função sem servidor estava quebrando em toda invocação. Não em alguns casos, não sob carga — em todas. Desde o primeiro dia.',
          'Na prática: nenhum clique foi registrado, nenhum contato do formulário chegou à planilha, nenhum e-mail de boas-vindas saiu. E o relatório diário que deveria chegar no WhatsApp do cliente às 23h nunca chegou, porque o agendamento também morria na mesma linha.',
        ],
        codigo: 'GET /api/clicks\n\nA server error has occurred\nFUNCTION_INVOCATION_FAILED',
        imagem: '/images/ideia-estrutura.jpg',
        imagemAlt: 'Detalhe da ferragem de uma laje antes da concretagem',
      },
      {
        lado: 'dir',
        /* Abre com imagem: na referência a coluna direita começa com a
           foto, alinhada ao topo do texto da coluna esquerda. */
        imagemPrimeiro: true,
        imagem: '/images/camada-estrutura.jpg',
        imagemAlt: 'Camadas de concreto aparente com a estrutura metálica à mostra',
        titulo: 'A causa era uma linha de configuração.',
        paragrafos: [
          'O `package.json` declarava `"type": "module"`. Isso faz o Node tratar todo arquivo `.js` como módulo ES. Os três endpoints, porém, usavam `require` e `module.exports` — a sintaxe do sistema antigo.',
          'Em módulo ES, `require` simplesmente não existe. A função morre antes da primeira linha útil.',
          'Não é um erro difícil. É um erro **invisível**: o site é estático e continua sendo servido normalmente; só a camada de API quebra. E como o formulário respondia sucesso sem conferir a resposta, nada na tela denunciava o problema.',
          'Uma linha de configuração contra meses de contatos perdidos.',
        ],
      },
      {
        lado: 'esq',
        titulo: 'Por que a fachada não avisou.',
        paragrafos: [
          'A pergunta que importa não é "como isso aconteceu". É "por que ninguém percebeu".',
          'Porque não havia nada configurado para perceber. Nenhuma verificação de saúde, nenhum alerta, nenhum teste. O único sinal possível seria o cliente estranhar a ausência de contatos — e, num negócio que também recebe por telefone e indicação, isso demora.',
          'Sistema que falha calado é pior que sistema que cai. Quando cai, alguém liga no mesmo dia. Quando falha calado, o prejuízo se acumula em silêncio e ninguém sabe desde quando.',
        ],
        imagem: '/images/ideia-vazamento.jpg',
        imagemAlt: 'Junta de concreto com infiltração visível',
      },
      {
        lado: 'dir',
        titulo: 'O que passou a ser obrigatório aqui.',
        imagem: '/images/ideia-dependencia.jpg',
        imagemAlt: 'Vigas de sustentação encaixadas umas nas outras',
        paragrafos: [
          'Três coisas, e nenhuma é cara:',
          '**Toda entrega espera confirmação antes de responder.** O formulário só diz "enviado" depois que o registro existe. Se não existe, a tela mostra o erro e oferece o WhatsApp como saída.',
          '**Todo endpoint tem uma verificação de saúde.** Um `GET` que devolve se o serviço subiu e se as credenciais estão configuradas — sem gravar nada. Foi exatamente esse endereço que, depois do conserto, revelou o segundo problema: as variáveis de ambiente nunca tinham sido preenchidas em produção.',
          '**Falha vira registro estruturado.** Se um canal cai, aparece no log com nome e motivo. É assim que se descobre um serviço quebrado antes do cliente descobrir pela ausência de resultado.',
        ],
      },
      {
        lado: 'esq',
        titulo: 'Estética não é o oposto de estrutura.',
        imagem: '/images/camada-arquiteto.jpg',
        imagemAlt: 'Fachada concluída, com a estrutura já invisível por dentro',
        paragrafos: [
          'Nada disso é argumento contra design. O site continua tendo que ser bonito — é ele que faz a pessoa ficar tempo suficiente para virar contato.',
          'O ponto é de ordem. Estética é o que traz a pessoa até o formulário. Estrutura é o que garante que o preenchimento chegue a algum lugar. Investir só na primeira é pagar tráfego para um balde furado.',
          'Fachada bonita num prédio que funciona é arquitetura.',
          'Fachada bonita num prédio que não funciona é cenário.',
        ],
      },
    ],

    fecho: 'Obrigado por ler',
  },
];

/** Busca por slug — usado pela rota /thoughts/:slug. */
export function acharArtigo(slug) {
  return ARTIGOS.find((a) => a.slug === slug) || null;
}

/** Os outros, para a faixa "mais ideias" no pé do artigo. */
export function outrosArtigos(slug) {
  return ARTIGOS.filter((a) => a.slug !== slug);
}
