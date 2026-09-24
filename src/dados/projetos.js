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
 *   resultados   depoimento a esquerda, blocos de numero a direita
 *   fecho        o titulo de novo, esteira e partilha
 *   mais         as outras obras
 *
 * ── a animação que o herói carrega ──
 * Medida na referência com scroll de RODA REAL — `scrollTo` por script
 * não move o valor, porque ele está preso a um spring que só responde a
 * scroll de verdade. Quatro estados:
 *
 *   scroll     linha 1     linha 2     rotulo/chamada   paragrafo
 *     0        -1200px     +1200px          0               0
 *   200          -64         +64          +20             +40
 *   400           +1          -1          +40             +80
 *   600          -75         +75          +60            +120
 *
 * Ou seja: as duas linhas do titulo NASCEM FORA DA TELA, em lados
 * opostos, e convergem conforme o scroll desce — a de cima entra pela
 * esquerda, a de baixo pela direita. Os textos menores ficam para trás
 * do scroll em ritmos diferentes (0.1x e 0.2x), o que faz o bloco de
 * cima e o paragrafo de baixo se AFASTAREM um do outro na descida e
 * voltarem a se juntar na subida.
 *
 * ── tipografia medida ──
 *   titulo do heroi   140px / 800 / entrelinha 0.8 / tracking -0.07em
 *   linha 2 recuada   +80px em relacao a linha 1
 *   nome da ficha      90px / 700
 *   declaracao         52px / 700   ·  introducao  64px / 700
 *   sub                16px / 700   ·  rotulo      12px / 600
 */

export const PROJETOS = [
  {
    slug: 'bruno-consultoria',
    indice: '01',
    ano: '2026',

    /* ── herói ── */
    chamada: 'Três entregas que falam com a mesma planilha.',
    titulo: ['CONSULTORIA', 'BRUNO'],
    heroImagem: '/images/work-automacao.jpg',
    heroAlt: 'A página do cliente no ar',
    lateralEsq: 'Setor',
    lateralDir: 'Entregue',
    heroTexto:
      'Consultoria no Reino Unido, três projetos em cinco meses. O cliente voltou duas vezes — e essa é a única métrica de satisfação que não dá para fabricar.',

    /* ── ficha ── */
    nome: 'CONSULTORIA BRUNO',
    subtitulo: 'TRÊS ENTREGAS QUE FALAM COM A MESMA PLANILHA.',
    declaracao:
      'UMA LANDING, UM LINK NA BIO E UM SITE INSTITUCIONAL. TRÊS PORTAS, UM REGISTRO SÓ.',
    linkVivo: { rotulo: 'PROJETO NO AR', texto: 'VER A EXPERIÊNCIA COMPLETA', url: null },
    ficha: [
      { valor: ['Landing page', 'Link na bio', 'Site institucional'], rotulo: 'TIPO DE TRABALHO' },
      { valor: ['Consultoria', 'Reino Unido'], rotulo: 'SETOR' },
      { valor: ['5 meses'], rotulo: 'PRAZO' },
      { valor: ['Set 2026'], rotulo: 'ENTREGUE' },
    ],

    /* ── introdução ── */
    introducao:
      'O PEDIDO ERA UMA PÁGINA. O QUE FALTAVA ERA UM SISTEMA. TRÊS CANAIS DIFERENTES TRAZIAM CONTATO E NENHUM DELES DEIXAVA REGISTRO — O CLIENTE SABIA QUE CHEGAVA GENTE, MAS NUNCA DE ONDE.',

    /* ── capítulos ── */
    capitulos: [
      {
        rotulo: '(Diagnóstico)',
        declaracao: 'O SITE RESPONDIA. A CAPTAÇÃO ESTAVA MORTA.',
        sub: 'TRÊS ENDEREÇOS DE API QUEBRAVAM EM TODA CHAMADA, DESDE O PRIMEIRO DIA — E NADA NA TELA DENUNCIAVA.',
        corpo:
          'A página abria em menos de dois segundos e o formulário respondia "enviado" com uma animação bem-feita. Rodei uma verificação de rotina nos endereços e as três funções morriam antes da primeira linha útil. Nenhum clique registrado, nenhum contato na planilha, nenhum e-mail disparado.',
        codigo: 'GET /api/clicks\n\nFUNCTION_INVOCATION_FAILED\nem 100% das chamadas',
        imagem: '/images/ideia-estrutura.jpg',
        legenda: 'A verificação que ninguém tinha rodado.',
      },
      {
        rotulo: '(Automação)',
        declaracao: 'MEDIR, RESPONDER, REPORTAR.',
        sub: 'TRÊS ROTINAS, E NENHUMA DELAS PEDE QUE O CLIENTE ABRA UM PAINEL.',
        corpo:
          'Cada clique passou a guardar seção, rótulo e origem — dá para cruzar qual bloco gerou interesse com qual contato entrou. O lead recebe resposta em segundos, porque velocidade de primeira resposta é o fator isolado que mais move conversão. E às 23h um resumo do dia chega no WhatsApp do dono, gerado sozinho.',
        listaTitulo: 'POR QUE NO WHATSAPP, E NÃO NUM PAINEL',
        lista: [
          'Painel exige lembrar de abrir. Relatório que chega sozinho continua sendo lido no terceiro mês.',
          'A rotina roda no servidor, não no navegador de ninguém — não depende de aba aberta nem de máquina ligada.',
          'Se um canal cai, aparece no log com nome e motivo. O erro vira registro, e não silêncio.',
        ],
        imagem: '/images/work-automacao.jpg',
        legenda: 'O relatório das 23h, entregue onde o dono já olha.',
      },
      {
        rotulo: '(Design)',
        declaracao: 'O DESENHO SERVE AO ARGUMENTO, NUNCA O CONTRÁRIO.',
        sub: 'CONSULTORIA NÃO VENDE HORA DE REUNIÃO. VENDE A CERTEZA DE TER SIDO ENTENDIDO.',
        corpo:
          'A página foi montada para provar entendimento antes de pedir o contato: o problema aparece escrito com as palavras do cliente antes de qualquer proposta. Tipografia sóbria, nenhuma ilustração genérica, e uma única decisão por dobra — em serviço de alto valor, ambiguidade lê como insegurança.',
        imagem: '/images/camada-interface.jpg',
        legenda: 'Uma decisão por dobra, e nenhuma concorrendo com a outra.',
      },
    ],

    /* ── resultados ── */
    resultados: {
      rotulo: '(Resultados)',
      declaracao: 'O QUE A OBRA PRONTA ENTREGA.',
      sub: 'NÃO É UMA PÁGINA BONITA. É UM CANAL QUE REGISTRA, RESPONDE E PRESTA CONTAS SOZINHO.',
      blocos: [
        {
          titulo: 'CAPTAÇÃO QUE CHEGA',
          texto:
            'A tela só confirma o envio depois que o registro existe. Se não existe, mostra o erro e oferece o WhatsApp como saída — verba de tráfego deixa de virar silêncio.',
        },
        {
          titulo: 'ORIGEM RASTREADA',
          texto:
            'Cada contato carrega a seção e o rótulo que geraram o clique. Dá para cortar criativo que traz clique sem contato, em vez de adivinhar no escuro.',
        },
        {
          titulo: 'ZERO CURVA DE APRENDIZADO',
          texto:
            'O dono não abre painel, não aprende ferramenta e não muda rotina. O resumo chega às 23h no aplicativo que ele já usa o dia inteiro.',
        },
      ],
    },

    /* ── fecho ── */
    fecho: {
      texto:
        'TRÊS ENTREGAS EM CINCO MESES, E O CLIENTE VOLTOU DUAS VEZES. CÓDIGO DE CLIENTE NÃO É MEU PARA PUBLICAR — MAS APRESENTO QUALQUER PARTE DELE NUMA CONVERSA.',
      esteira: 'Projeto no ar',
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
