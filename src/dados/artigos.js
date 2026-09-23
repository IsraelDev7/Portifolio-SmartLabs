/**
 * artigos.js — o conteúdo do caderno.
 *
 * Os textos moram aqui, separados do componente que os desenha. O
 * motivo é prático: a página do artigo tem layout fixo — colunas
 * independentes, imagem em 3:4, abertura em corpo grande — e o
 * conteúdo muda toda semana. Misturar os dois faria cada texto novo
 * exigir mexer em JSX.
 *
 * ── o que este caderno é, e o que ele não é ──
 * Aqui mora o PENSAMENTO, não o portfólio. A seção Work mostra as
 * obras; esta mostra o raciocínio que as gera. Por isso nenhum cliente
 * é nomeado: os casos entram por SETOR, porque o que se aprende num
 * projeto só serve a outro quando vira critério — e critério é do
 * nicho, não da pessoa.
 *
 * ── a forma de um artigo ──
 * Medida na referência (vertical.framer.media), viewport de 1597:
 *
 *   abertura   parágrafos em 40px, caixa alta, largura total
 *   blocos     duas colunas que fluem INDEPENDENTES, sem se esperar
 *   imagem     631x858 — razão 3:4, a largura exata da coluna
 *
 * ── por que só UMA imagem no corpo ──
 * A referência usa uma. Quatro imagens num texto de três minutos
 * empurram o argumento para baixo da dobra e transformam leitura em
 * rolagem. A imagem que ficou abre a coluna direita e alinha com o
 * topo do texto da esquerda: ela existe para dar ritmo à diagramação,
 * não para ilustrar o que a frase já disse.
 *
 * `imagemPrimeiro` inverte a ordem dentro do bloco. `setores` rende
 * uma lista compacta — é o formato que o leitor varre em dois
 * segundos e encontra o próprio negócio.
 */

export const ARTIGOS = [
  {
    slug: 'a-estrutura-vem-antes-da-estetica',
    indice: '01',
    area: 'Engenharia',
    data: '22 de setembro de 2026',
    dataCurta: 'SET 2026',
    leitura: '3 minutos',
    autor: 'Israel Passos',
    titulo: 'A estrutura vem antes da estética.',
    subtitulo:
      'Um site pode estar no ar, bonito e rápido — e não entregar um único contato.',
    resumo:
      'O que sustenta uma experiência premium é justamente a parte que ninguém vê. E cada setor cobra isso de um jeito diferente.',
    capa: '/images/ideia-estrutura.jpg',
    capaAlt: 'Estrutura de concreto armado com a ferragem exposta antes da concretagem',

    abertura: [
      'Todo mundo elogia a fachada. Quase ninguém pergunta se o prédio fica de pé.',
      'E fachada não avisa quando a estrutura cede. O site continua abrindo, continua bonito. O que parou de funcionar é a parte que ninguém olha.',
    ],

    blocos: [
      {
        lado: 'esq',
        titulo: 'Sistema que falha calado.',
        paragrafos: [
          'Site que cai, alguém liga no mesmo dia. Site que falha calado acumula prejuízo em silêncio — e ninguém sabe desde quando.',
          'A falha mais cara que eu encontro não derruba nada. O formulário responde **"enviado"**, a animação roda bonita, e nenhum registro existe do outro lado.',
        ],
        codigo: 'POST /api/leads   →   200 OK\nregistros gravados:   0',
      },
      {
        lado: 'dir',
        /* A única imagem do corpo. Abre a coluna direita e alinha com o
           topo do texto da esquerda — é o que tira o ritmo de tabela. */
        imagemPrimeiro: true,
        imagem: '/images/camada-estrutura.jpg',
        imagemAlt: 'Camadas de concreto aparente com a estrutura metálica à mostra',
        titulo: 'Três regras, antes de desenhar qualquer tela.',
        paragrafos: [
          '**A entrega espera confirmação.** A tela só diz "enviado" depois que o registro existe. Se não existe, mostra o erro e oferece o WhatsApp como saída.',
          '**Todo endpoint tem pulso.** Um endereço que responde se o serviço subiu e se as credenciais estão no lugar — sem gravar nada.',
          '**Falha vira registro.** Canal que cai aparece no log com nome e motivo. É assim que se descobre antes do cliente descobrir pela ausência de resultado.',
        ],
      },
      {
        lado: 'esq',
        titulo: 'Cada setor cobra isso de um jeito.',
        paragrafos: [
          'Estrutura não significa a mesma coisa em todo nicho. O que muda é **onde a decisão de compra trava** — e é exatamente ali que a engenharia precisa estar.',
        ],
        setores: [
          ['Saúde e estética',
           'A decisão é íntima e demora. Excelência aqui é anamnese antes do orçamento: o lead chega ao WhatsApp já respondido, e a equipe já sabe o que ele tem.'],
          ['Consultoria',
           'Ninguém compra hora de reunião — compra a certeza de ter sido entendido. A página precisa provar entendimento antes de pedir o contato.'],
          ['Serviço de campo e paisagismo',
           'Orçamento cego queima a agenda. Um punhado de perguntas certas filtra quem ainda não tem projeto e entrega o resto já diagnosticado.'],
          ['E-commerce',
           'O gargalo nunca é a vitrine, é o caminho do carrinho ao webhook. Pagamento que confirma sem mudar o estado do pedido não é venda: é reclamação.'],
        ],
      },
      {
        /* Fecha à ESQUERDA, e não na direita. A coluna direita carrega a
           única imagem (832px de altura contra 301 do bloco de texto
           equivalente): mandar o fecho para lá deixava 641px de branco
           no pé da esquerda. Com ele aqui a diferença cai para ~200.

           E o corte cai bem no sentido: a esquerda passa a ser o
           ARGUMENTO de ponta a ponta, a direita o MÉTODO. */
        lado: 'esq',
        titulo: 'Estética não é o oposto de estrutura.',
        paragrafos: [
          'Nada disso é argumento contra design. É ele que faz a pessoa ficar tempo suficiente para virar contato.',
          'O ponto é de ordem. Estética traz a pessoa até o formulário. Estrutura garante que o preenchimento chegue a algum lugar. Investir só na primeira é pagar tráfego para um balde furado.',
          'Fachada bonita num prédio que funciona é arquitetura. Num prédio que não funciona, é cenário.',
        ],
      },
    ],

    fecho: 'Obrigado por ler',
  },
  {
    slug: 'automacao-nao-e-economizar-tempo',
    indice: '02',
    area: 'Automação',
    data: '29 de setembro de 2026',
    dataCurta: 'SET 2026',
    leitura: '3 minutos',
    autor: 'Israel Passos',
    titulo: 'Automação não é economizar tempo.',
    subtitulo:
      'É remover dependência. O ganho não está nos minutos poupados — está no processo continuar sem a pessoa que sempre fazia aquela etapa.',
    resumo:
      'Todo negócio tem uma pessoa que é o gargalo, e quase sempre é a melhor do time. Automatizar é parar de precisar dela para o que é repetição.',
    capa: '/images/ideia-dependencia.jpg',
    capaAlt: 'Vigas de sustentação encaixadas umas nas outras',

    abertura: [
      'Todo negócio tem uma pessoa que é o gargalo. Quase sempre é a melhor pessoa do time.',
      'E o problema nunca aparece enquanto ela está lá. Aparece na semana de férias, no feriado, no dia do médico.',
    ],

    blocos: [
      {
        lado: 'esq',
        titulo: 'A conta que ninguém faz.',
        paragrafos: [
          'Quando alguém calcula automação, calcula minutos: "são vinte por dia, sete horas por mês". É a métrica errada — ela some no dia em que o processo simplesmente não roda.',
          'O custo real não é o tempo gasto. É o orçamento que esperou até segunda porque quem responde estava de folga. Esse lead não aparece em relatório nenhum: ele não vira número, vira silêncio.',
        ],
        codigo: 'tempo economizado:   7 h/mês\nlead perdido no feriado:   1',
      },
      {
        lado: 'dir',
        imagemPrimeiro: true,
        imagem: '/images/work-automacao.jpg',
        imagemAlt: 'Esteira industrial com peças em sequência',
        titulo: 'Onde eu procuro a dependência.',
        paragrafos: [
          '**Etapa que só uma pessoa sabe fazer.** Se a resposta para "e se ela faltar?" for um nome, ali tem ponto único de falha.',
          '**Informação que mora na cabeça de alguém.** Preço que varia por caso, critério de desconto, qual fornecedor chamar. Isso é regra — e regra escrita é regra que executa sozinha.',
          '**Passo que depende de alguém lembrar.** Lembrar não escala. Agendamento, sim.',
        ],
      },
      {
        lado: 'esq',
        titulo: 'Cada setor esconde a dependência num lugar.',
        paragrafos: [
          'A pergunta é sempre a mesma — **o que para se essa pessoa sumir por uma semana?** O que muda é onde a resposta se esconde.',
        ],
        setores: [
          ['Saúde e estética',
           'A recepção é a memória do negócio: quem retorna, quem faltou, quem ficou de pensar. Sem registro próprio, a agenda do mês depende de quem atendeu no mês passado.'],
          ['Consultoria',
           'A proposta sai do zero toda vez porque o critério nunca saiu da cabeça do sócio. Escrever a régua rende mais que trocar de ferramenta.'],
          ['Serviço de campo e paisagismo',
           'O orçamento depende da visita, e a visita depende da agenda de uma pessoa só. Qualificar antes da visita é o que devolve a semana.'],
          ['E-commerce',
           'O estoque real mora numa planilha que alguém atualiza à noite. No primeiro pico de venda ela atrasa — e a loja vende o que não tem.'],
        ],
      },
      {
        lado: 'esq',
        titulo: 'Automatizar não é dispensar a pessoa.',
        paragrafos: [
          'É parar de precisar dela para o que é repetição. Quem trata automação como corte costuma automatizar a parte errada: a que exige julgamento.',
          'O teste cabe numa frase. **Tire qualquer pessoa do processo por uma semana.** O que parar é dependência — e dependência custa sempre mais caro que a ferramenta que a resolve.',
          'Tempo economizado é consequência. O que se compra de verdade é um processo que não tem refém.',
        ],
      },
    ],

    fecho: 'Obrigado por ler',
  },
  {
    slug: 'ia-nao-e-o-produto-e-a-camada',
    indice: '03',
    area: 'Inteligência',
    data: '6 de outubro de 2026',
    dataCurta: 'OUT 2026',
    leitura: '3 minutos',
    autor: 'Israel Passos',
    titulo: 'IA não é o produto. É a camada.',
    subtitulo:
      'Quando a inteligência chega como produto separado, alguém precisa aprender a operá-la. E esse alguém já tem um trabalho.',
    resumo:
      'A pergunta não é se usar IA. É onde ela entra — e onde ela não deve entrar. A régua calcula; o modelo redige.',
    capa: '/images/ideia-camada.jpg',
    capaAlt: 'Camadas de material sobrepostas, com a junção aparente',

    abertura: [
      'Todo mundo quer "colocar IA" no negócio. Quase ninguém pergunta onde ela entra.',
      'E é essa resposta que decide se a ferramenta vai estar em uso em março ou abandonada em fevereiro.',
    ],

    blocos: [
      {
        lado: 'esq',
        titulo: 'Produto separado é mais uma coisa para aprender.',
        paragrafos: [
          'Painel novo, aba à parte, mais um login. Toda vez que a inteligência chega assim, ela cobra um pedágio: alguém precisa lembrar de abrir, colar o dado, copiar a saída e voltar para onde o trabalho realmente acontece.',
          'Camada é o contrário. Ela some dentro do fluxo que já existia — a pessoa continua respondendo o WhatsApp, só que a resposta já chega escrita.',
        ],
        codigo: 'produto:  abrir → colar → copiar → voltar\ncamada:   a saída já está onde o trabalho acontece',
      },
      {
        lado: 'dir',
        imagemPrimeiro: true,
        imagem: '/images/camada-interface.jpg',
        imagemAlt: 'Interface técnica sobreposta a uma superfície de metal',
        titulo: 'Onde a IA não deve entrar.',
        paragrafos: [
          '**Onde a resposta precisa ser sempre a mesma.** Preço, elegibilidade, diagnóstico técnico. Isso é régua, não conversa: um motor de regras com pontuação dá o mesmo resultado para a mesma entrada, é auditável linha a linha por quem entende do assunto, responde na hora e custa zero.',
          '**Onde errar tem consequência.** Um modelo que inventa uma recomendação técnica para quem está decidindo uma contratação não é um erro engraçado.',
          '**Onde ninguém vai conferir.** Saída que ninguém lê é saída que ninguém corrige — e que vai errar por meses sem ninguém saber.',
        ],
      },
      {
        lado: 'esq',
        titulo: 'Cada setor tem uma camada diferente.',
        paragrafos: [
          'A pergunta certa não é "onde cabe IA aqui". É **em que ponto do fluxo a pessoa hoje escreve do zero algo que já poderia estar escrito.**',
        ],
        setores: [
          ['Saúde e estética',
           'A camada é a triagem. O formulário vira anamnese estruturada e a equipe recebe o caso já classificado, em vez de um "oi, quanto custa?" para responder do zero.'],
          ['Consultoria',
           'A camada é a leitura. O que o lead escreveu vira resumo com contexto e objeção provável antes da primeira reunião acontecer.'],
          ['Serviço de campo e paisagismo',
           'A camada é o diagnóstico. Algumas perguntas respondidas na página viram um laudo com prioridade e faixa de investimento — calculado pela régua, redigido pelo modelo.'],
          ['E-commerce',
           'A camada é o pós-venda. Pergunta repetida sobre prazo e troca respondida na hora, com o dado real do pedido, e não com texto genérico.'],
        ],
      },
      {
        lado: 'esq',
        titulo: 'A régua calcula. O modelo redige.',
        paragrafos: [
          'É a divisão que eu uso em tudo: decisão determinística, linguagem natural só na apresentação. Os números saem de uma régua que o especialista escreveu e consegue conferir; o modelo pega o resultado e escreve o texto que a pessoa vai ler.',
          'A vantagem aparece quando dá errado. Se o laudo saiu torto, dá para apontar **qual regra** errou e corrigir a regra. Com o modelo decidindo, resta torcer por um palpite melhor na próxima.',
          'IA que aparece no organograma é produto. IA que some dentro do trabalho é camada. Só a segunda continua em uso em março.',
        ],
      },
    ],

    fecho: 'Obrigado por ler',
  },
  {
    slug: 'trafego-sem-estrutura-vaza',
    indice: '04',
    area: 'Aquisição',
    data: '13 de outubro de 2026',
    dataCurta: 'OUT 2026',
    leitura: '3 minutos',
    autor: 'Israel Passos',
    titulo: 'Tráfego sem estrutura vaza.',
    subtitulo:
      'Verba em campanha antes de a operação aguentar o volume não é investimento. É pagar para descobrir onde o sistema quebra.',
    resumo:
      'A plataforma diz 40 cliques, o dono diz 3 contatos, e ninguém sabe onde foram os outros 37. Aquisição e tecnologia são o mesmo projeto.',
    capa: '/images/ideia-vazamento.jpg',
    capaAlt: 'Junta de concreto com infiltração visível',

    abertura: [
      'Antes de programar, eu comprava tráfego. Aprendi cedo que anúncio bom para página ruim é a forma mais rápida de perder dinheiro com competência.',
      'O que eu não sabia na época é que o problema quase nunca está no anúncio.',
    ],

    blocos: [
      {
        lado: 'esq',
        titulo: 'A conta que não fecha.',
        paragrafos: [
          'A plataforma diz quarenta cliques. O dono diz que recebeu três contatos. Ninguém consegue dizer onde foram os outros trinta e sete — e a reunião termina culpando o criativo.',
          'Não era o criativo. Entre o clique e o contato existem cinco ou seis passos, e na maioria dos sites nenhum deles deixa registro. Isso não é otimizar campanha. É **adivinhar com orçamento**.',
        ],
        codigo: 'plataforma:              40 cliques\nplanilha do cliente:      3 contatos\nregistro do que houve:    nenhum',
      },
      {
        lado: 'dir',
        imagemPrimeiro: true,
        imagem: '/images/work-performance.jpg',
        imagemAlt: 'Painel de medição com leitura em tempo real',
        titulo: 'O mínimo para o tráfego não vazar.',
        paragrafos: [
          '**Cada clique guarda de onde veio.** Seção, rótulo e origem. Sem isso não dá para cruzar *qual bloco gerou interesse* com *qual lead entrou* — e é esse cruzamento que corta criativo que traz clique sem contato.',
          '**O dado é seu, não da plataforma.** Registro próprio, no seu banco. Marcador que some quando o navegador bloqueia não é medição, é esperança.',
          '**A entrega confirma antes de dizer que entregou.** Formulário que responde "enviado" sem conferir transforma verba em silêncio — e o silêncio demora meses para ser notado.',
        ],
      },
      {
        lado: 'esq',
        titulo: 'Cada setor vaza num lugar diferente.',
        paragrafos: [
          'A pergunta não é "como trazer mais gente". É **onde o interesse morre depois do clique** — porque é sempre no mesmo ponto, e é sempre um ponto que a campanha não alcança.',
        ],
        setores: [
          ['Saúde e estética',
           'Vaza na demora. O anúncio roda 24 horas, a recepção atende das 9 às 18. O lead da meia-noite já falou com outra clínica antes de alguém abrir o WhatsApp.'],
          ['Consultoria',
           'Vaza na indefinição. A pessoa clica, lê, concorda — e não encontra o que perguntar. Sem uma próxima ação óbvia, interesse vira aba fechada.'],
          ['Serviço de campo e paisagismo',
           'Vaza na agenda. Todo lead vira visita, visita consome a semana, e metade não tinha projeto. Filtrar antes da visita é o que devolve capacidade.'],
          ['E-commerce',
           'Vaza no checkout. O tráfego chega, o carrinho enche, e um passo a mais que o necessário derruba justamente a conversão que a campanha pagou para conseguir.'],
        ],
      },
      {
        lado: 'esq',
        titulo: 'Aquisição e tecnologia são o mesmo projeto.',
        paragrafos: [
          'A separação entre os dois é herança de organograma, não de realidade. Quem faz o anúncio não fala com quem faz o site; o site entrega o formulário e considera o trabalho feito; e alguém otimiza no escuro, com o número que a plataforma quis mostrar.',
          'Quando os dois lados são o mesmo projeto, a pergunta muda. Deixa de ser *quanto custa o clique* e passa a ser **quanto custa o contato que virou cliente** — que é a única métrica que o dono do negócio sente no fim do mês.',
          'O resto é tráfego caro para um balde furado.',
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

/**
 * O SEGUINTE na sequência, dando a volta no fim.
 *
 * A primeira versão do botão Próximo usava `outrosArtigos(slug)[0]`, que
 * é sempre o primeiro do array menos o atual — ou seja, o 01 para todos
 * os outros. Quem entrasse pelo 02 voltava ao 01 e nunca alcançava o 03
 * nem o 04 por ali, que é exatamente o trabalho desse botão.
 *
 * Devolve `null` com menos de dois artigos: com um só, `(0+1) % 1` é 0 e
 * o artigo apontaria para si mesmo.
 */
export function proximoArtigo(slug) {
  if (ARTIGOS.length < 2) return null;
  const i = ARTIGOS.findIndex((a) => a.slug === slug);
  if (i < 0) return null;
  return ARTIGOS[(i + 1) % ARTIGOS.length];
}

/** Os outros, para a faixa "mais ideias" no pé do artigo. */
export function outrosArtigos(slug) {
  return ARTIGOS.filter((a) => a.slug !== slug);
}
