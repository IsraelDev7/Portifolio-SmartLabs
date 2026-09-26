/**
 * projetos.js — o conteúdo das páginas de obra.
 *
 * Mesma separação do artigos.js: o texto mora aqui, o desenho mora no
 * componente. A página de projeto tem estrutura fixa e conteúdo que
 * muda a cada obra.
 *
 * ── a forma, medida na referência ──
 * vertical.framer.media/work/unstable-sequence, viewport 1597x1246,
 * página de 14.905px. As faixas, na ordem:
 *
 *   heroi        imagem sangrando, titulo em duas linhas de 140px
 *   ficha        nome 90px, declaracao 40px, e 4 colunas de dados
 *   introducao   um paragrafo unico em 64px, caixa alta
 *   capitulos    (rotulo) + declaracao 52px + sub 16px + corpo + foto
 *   resultados   tres blocos numerados
 *   fecho        o titulo de novo, esteira e partilha
 *   mais         as outras obras
 *
 * ── a animação que o herói carrega ──
 * Medida com scroll de RODA REAL — `scrollTo` por script não move o
 * valor na referência, porque ele está preso a um spring que só
 * responde a scroll de verdade. Quatro estados:
 *
 *   scroll     linha 1     linha 2     rotulo/chamada   paragrafo
 *     0        -1200px     +1200px          0               0
 *   200          -64         +64          +20             +40
 *   400           +1          -1          +40             +80
 *   600          -75         +75          +60            +120
 *
 * As duas linhas do titulo NASCEM FORA DA TELA, em lados opostos, e
 * convergem conforme o scroll desce. Os textos menores ficam para trás
 * em ritmos diferentes (0.1x e 0.2x), e é a diferença entre os dois
 * ritmos que faz o par se afastar na descida e voltar na subida.
 *
 * ── de onde vêm as imagens ──
 * Dos próprios sites entregues, baixadas em resolução original e
 * reduzidas aqui (9,7 MB → 1,1 MB). O herói é o retrato que o cliente
 * usa na página dele, recomposto em 16:9 com a pessoa à direita e o
 * campo livre à esquerda para o título — é a composição da referência,
 * e o retrato já vinha sobre fundo preto, então estender a tela para a
 * esquerda não aparece como montagem.
 */

export const PROJETOS = [
  {
    slug: 'bruno-gutierres',
    indice: '01',
    ano: '2026',

    /* ── herói ── */
    chamada: 'Três portas, dois públicos, um registro só.',
    titulo: ['BRUNO', 'GUTIERRES'],
    heroImagem: '/images/obra-bruno-heroi.jpg',
    heroAlt: 'Retrato de Bruno Gutierres, da página dele',
    lateralEsq: 'Aconselhamento · Property care',
    lateralDir: 'Set 2026',
    heroTexto:
      'Uma marca pessoal em português, para homens em reconstrução. E uma empresa de property care em Londres, em inglês. O mesmo dono, dois públicos que não se cruzam — e nenhuma das duas sabia de onde vinha um contato.',

    /* ── ficha ── */
    nome: 'BRUNO GUTIERRES',
    subtitulo: 'TRÊS ENTREGAS EM CINCO MESES. O CLIENTE VOLTOU DUAS VEZES.',
    declaracao:
      'UMA LANDING, UM LINK NA BIO E UM SITE INSTITUCIONAL FALANDO COM O MESMO REGISTRO.',
    linkVivo: { rotulo: 'PROJETOS NO AR', texto: 'TRÊS ENDEREÇOS, TODOS PÚBLICOS', url: null },
    ficha: [
      { valor: ['Landing page', 'Link na bio', 'Site institucional'], rotulo: 'TIPO DE TRABALHO' },
      { valor: ['Aconselhamento', 'Property care'], rotulo: 'SETOR' },
      { valor: ['Brasil', 'Londres e Surrey'], rotulo: 'PRAÇA' },
      { valor: ['Set 2026'], rotulo: 'ENTREGUE' },
    ],

    /* ── introdução ──
       Quebrada em duas: a chave em destaque e o resto como subtítulo.
       Num bloco único de caixa alta a frase inteira tinha o mesmo peso,
       e a informação que importa — quantos endereços, em quantos
       idiomas — se diluía nas outras vinte palavras. */
    introducao: {
      destaque: 'Três endereços no ar',
      resto: 'Dois idiomas, dois públicos que não se cruzam. O pedido era uma página; o que faltava era saber, no fim do mês, qual das três portas trouxe quem.',
    },

    /* ── capítulos ── */
    capitulos: [
      {
        rotulo: '(Diagnóstico)',
        declaracao: 'O SITE RESPONDIA. A CAPTAÇÃO ESTAVA MORTA.',
        sub: 'TRÊS ENDEREÇOS DE API QUEBRAVAM EM TODA CHAMADA, DESDE O PRIMEIRO DIA — E NADA NA TELA DENUNCIAVA.',
        corpo:
          'A página abria em menos de dois segundos e o formulário respondia "enviado" com uma animação bem-feita. Rodei uma verificação de rotina nos endereços e as três funções morriam antes da primeira linha útil: o projeto declarava módulo ES e os endpoints usavam a sintaxe do sistema antigo. Em módulo ES, `require` simplesmente não existe.',
        codigo: 'GET /api/clicks\n\nFUNCTION_INVOCATION_FAILED\nem 100% das chamadas, desde o dia um',
        listaTitulo: 'O QUE ISSO CUSTAVA, EM SILÊNCIO',
        lista: [
          'Nenhum clique registrado — nem na landing, nem no link da bio, nem no site da empresa.',
          'Nenhum contato do formulário chegando à planilha, com a tela dizendo que tinha chegado.',
          'O relatório diário que deveria sair às 23h nunca saiu, porque o agendamento morria na mesma linha.',
        ],
        imagem: '/images/obra-bruno-depois.jpg',
        legenda: 'A entrega da BLGM: o resultado que a primeira dobra promete.',
      },
      {
        rotulo: '(Automação)',
        declaracao: 'MEDIR, RESPONDER, REPORTAR.',
        sub: 'TRÊS ROTINAS, E NENHUMA DELAS PEDE QUE O CLIENTE ABRA UM PAINEL.',
        corpo:
          'Cada clique passou a guardar seção, rótulo e origem, gravados em registro próprio e não só no painel de anúncio — dá para cruzar qual bloco gerou interesse com qual contato entrou. O lead recebe resposta em segundos. E às 23h um resumo do dia chega no WhatsApp do dono, gerado sozinho.',
        listaTitulo: 'POR QUE NO WHATSAPP, E NÃO NUM PAINEL',
        lista: [
          'Painel exige lembrar de abrir. O relatório que chega sozinho continua sendo lido no terceiro mês, e é aí que ele começa a valer.',
          'A rotina roda no servidor, não no navegador de ninguém — não depende de aba aberta, de máquina ligada nem de o dono estar no país certo.',
          'No link da bio a marcação sai por `sendBeacon`: o clique é registrado mesmo quando a pessoa já está saindo da página, que é exatamente quando ele acontece.',
          'Se um canal cai, aparece no log com nome e motivo. O erro vira registro, e não silêncio de quatro meses.',
        ],
        imagem: '/images/work-automacao.jpg',
        legenda: 'O resumo das 23h, entregue onde o dono já olha.',
        /* Três painéis, um por rotina. As imagens foram geradas na
           linguagem da marca — Aço, Cal e Solda, macro industrial, sem
           texto e sem gente — porque aqui não há tela para mostrar: o
           que a automação faz acontece fora do navegador. */
        galeria: [
          { src: '/images/obra-bruno-medir.jpg', titulo: 'Cada clique com endereço',
            sub: 'Seção, rótulo e origem' },
          { src: '/images/obra-bruno-responder.jpg', titulo: 'Resposta em segundos',
            sub: 'Antes de o lead procurar outro' },
          { src: '/images/obra-bruno-reportar.jpg', titulo: 'O dia fechado às 23h',
            sub: 'No WhatsApp, sem abrir painel' },
        ],
      },
      {
        rotulo: '(Design)',
        declaracao: 'DUAS IDENTIDADES, PORQUE SÃO DUAS DECISÕES DE COMPRA.',
        sub: 'NA EMPRESA, A PROVA É A FOTO. NA MARCA PESSOAL, A PROVA É A PESSOA.',
        corpo:
          'A BLGM abre com um comparador de antes e depois arrastável, ocupando a primeira dobra inteira. Em serviço de transformação de imóvel ninguém compra pela descrição — compra pelo salto entre duas fotos, e esse salto tinha que ser a primeira coisa na tela, não uma galeria lá embaixo.',
        corpoExtra:
          'A landing do conselheiro faz o oposto: retrato em tela cheia e uma frase que nomeia a dor antes de qualquer oferta. Em aconselhamento a pessoa é o produto, e o rosto precisa chegar antes do método. Fundo escuro com um único acento quente, tipografia com serifa no título e uma decisão por dobra — em decisão íntima, ambiguidade lê como insegurança.',
        imagem: '/images/obra-bruno-empresa.jpg',
        legenda: 'Depois: a prova que a primeira dobra da BLGM entrega.',
      },
    ],

    /* ── resultados ── */
    resultados: {
      rotulo: '(Resultados)',
      declaracao: 'O QUE A OBRA PRONTA ENTREGA.',
      sub: 'NÃO SÃO TRÊS PÁGINAS BONITAS. É UM CANAL QUE REGISTRA, RESPONDE E PRESTA CONTAS SOZINHO.',
      /* ── a TV ──
         Em vez de uma foto parada, o quadro passa TODAS as imagens da
         obra em ordem sorteada e em laço. O bloco de resultados é o
         resumo da página: faz sentido que ele mostre o conjunto, e não
         mais uma peça isolada. */
      imagens: [
        '/images/obra-bruno-resultado.jpg',
        '/images/obra-bruno-medir.jpg',
        '/images/obra-bruno-responder.jpg',
        '/images/obra-bruno-reportar.jpg',
        '/images/obra-bruno-depois.jpg',
        '/images/obra-bruno-empresa.jpg',
      ],
      imagemAlt: 'Peças da obra, em sequência',

      /* ── por que REGISTRO e não depoimento ──
         A referência põe uma citação de cliente nesta caixa. Aqui não
         há citação: inventar depoimento é propaganda enganosa (CDC
         art. 37; o CONAR trata review fabricada como publicidade
         ilícita), e o Bruno não mandou nenhuma.
         O lugar e o peso visual continuam os mesmos — o cartão de baixo
         inclusive repete o desenho da referência —, só que o texto é um
         FATO em terceira pessoa, que não dá para ler como fala dele. */
      registro: {
        rotulo: 'Registro',
        frase: 'Depoimento se escreve. Voltar, não.',
        texto:
          'Na página dele a promessa é privacidade absoluta. Num trabalho assim, o que mede confiança não é uma frase elogiosa — é o cliente entregar o segundo projeto, e depois o terceiro.',
        cartao: {
          foto: '/images/obra-bruno-retrato.jpg',
          texto: 'Três projetos em cinco meses. O segundo e o terceiro foram pedidos depois de o primeiro já estar no ar.',
          assina: 'Bruno Gutierres',
          org: 'Aconselhamento · BLGM Solutions',
        },
      },

      /* ── a copy saiu da página do cliente ──
         Li a landing antes de escrever: o formulário do Código do
         Alicerce não pede nome e e-mail, pede o que está acontecendo, e
         a promessa central da página é PRIVACIDADE ABSOLUTA. Isso muda
         o que cada bloco precisa afirmar — não é captação de lead, é
         alguém admitindo uma coisa difícil de escrever. */
      blocos: [
        {
          titulo: 'O QUE ELE ESCREVEU CHEGA INTEIRO',
          texto:
            'O formulário não pede nome e e-mail: pede o que está acontecendo. Texto assim se escreve uma vez só. A tela só confirma depois que o registro existe — e quando falha, mostra o erro em vez de engolir uma confissão.',
        },
        {
          titulo: 'A PORTA POR ONDE ELE ENTROU',
          texto:
            'São três: a landing do Código do Alicerce, o link da bio e o site da BLGM. Cada contato carrega qual delas trouxe a pessoa e qual bloco gerou o clique — dá para saber onde o argumento funciona.',
        },
        {
          titulo: 'PRIVACIDADE COMO ARQUITETURA',
          texto:
            'A página promete privacidade absoluta. Aqui isso é estrutura: o dado fica em registro próprio, não espalhado em plataforma de terceiro, e o resumo do dia chega às 23h no WhatsApp que ele já usa.',
        },
      ],
    },

    /* ── fecho ── */
    fecho: {
      texto:
        'TRÊS ENTREGAS EM CINCO MESES, E O CLIENTE VOLTOU DUAS VEZES. CÓDIGO DE CLIENTE NÃO É MEU PARA PUBLICAR — MAS APRESENTO QUALQUER PARTE DELE NUMA CONVERSA.',
      /* O marca-texto leva ao link da bio: é a porta que reúne as três
         entregas num endereço só, então é por ela que alguém de fora
         conhece o projeto inteiro sem escolher por onde começar. */
      esteira: 'Projeto no ar',
      url: 'https://bruno-conselheiro-bio.vercel.app/',
    },
  },
];

export function acharProjeto(slug) {
  return PROJETOS.find((p) => p.slug === slug) || null;
}

/** O SEGUINTE na sequência, dando a volta — a mesma regra do caderno. */
export function proximoProjeto(slug) {
  if (PROJETOS.length < 2) return null;
  const i = PROJETOS.findIndex((p) => p.slug === slug);
  if (i < 0) return null;
  return PROJETOS[(i + 1) % PROJETOS.length];
}

export function outrosProjetos(slug) {
  return PROJETOS.filter((p) => p.slug !== slug);
}
