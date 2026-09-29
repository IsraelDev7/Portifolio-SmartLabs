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

  /* ══════════════════════════════════════════════════════════════
     DANILA SOUZA

     ── por que esta página não é a do Bruno com outro nome ──
     Nos outros trabalhos a entrega para no código. Aqui ela atravessa:
     o mesmo profissional escreveu a página E o livro, e traduziu as
     duas outras edições. É o único projeto do portfólio em que a
     palavra entregue é tão produto quanto a página.

     ── o cuidado que o assunto exige ──
     O tema é violência psicológica. Isso impõe um limite à copy desta
     página: ela fala do que foi CONSTRUÍDO — páginas, idiomas,
     formulário, registro —, nunca de desfecho para quem procurou
     ajuda. Prometer resultado clínico ou segurança a vítima é claim
     que não me cabe fazer, e num assunto destes o exagero não é só
     impreciso: é cruel. A mesma régua que me impediu de inventar
     depoimento na obra do Bruno vale aqui, mais apertada.

     ── de onde vêm as imagens ──
     Das páginas dela e da capa do livro, em resolução original. O
     herói repete o enquadramento da obra anterior — eixo do rosto na
     borda direita — e desce para quase monocromático, porque as duas
     páginas precisam ler como a mesma obra.
     ══════════════════════════════════════════════════════════════ */
  {
    slug: 'danila-souza',
    indice: '02',
    ano: '2026',

    /* ── herói ── */
    chamada: 'Três idiomas, um assunto que não admite descuido.',
    titulo: ['DANILA', 'SOUZA'],
    heroImagem: '/images/obra-danila-heroi.jpg',
    heroAlt: 'Retrato de Danila Souza, da página dela',
    lateralEsq: 'Psicanálise · Editorial',
    lateralDir: 'Set 2026',
    heroTexto:
      'Uma psicanalista que atende mulheres saindo de relações abusivas, e um livro sobre isso. Escrevi o código das duas páginas e também o texto das edições em inglês e espanhol — é o único trabalho aqui em que a entrega atravessou do navegador para a página impressa.',

    /* ── ficha ── */
    nome: 'DANILA SOUZA',
    subtitulo: 'DO CÓDIGO À TRADUÇÃO, A MESMA MÃO NAS DUAS PONTAS.',
    declaracao:
      'UM SITE, UM LINK NA BIO E UM LIVRO QUE PASSOU A FALAR TRÊS IDIOMAS.',
    linkVivo: { rotulo: 'PROJETO NO AR', texto: 'DUAS PÁGINAS E UM LIVRO', url: null },
    ficha: [
      { valor: ['Site institucional', 'Link na bio', 'Redação e tradução', 'Gestão de tráfego'], rotulo: 'TIPO DE TRABALHO' },
      { valor: ['Psicanálise', 'Editorial'], rotulo: 'SETOR' },
      { valor: ['Brasil', 'PT · EN · ES'], rotulo: 'PRAÇA' },
      { valor: ['Set 2026'], rotulo: 'ENTREGUE' },
    ],

    /* ── a nota do fecho ── */
    introducao: {
      destaque: 'Três idiomas, um só livro',
      resto: 'Quando quem traduz é quem construiu a página, a promessa não se perde no caminho entre duas mãos. As três edições saíram com a mesma voz.',
    },

    /* ── capítulos ── */
    capitulos: [
      {
        rotulo: '(O assunto)',
        declaracao: 'QUEM CHEGA AQUI ESTÁ ADMITINDO UMA COISA DIFÍCIL.',
        sub: 'UM SITE SOBRE VIOLÊNCIA PSICOLÓGICA TEM UM REQUISITO QUE NENHUMA LANDING COMUM TEM.',
        corpo:
          'O formulário da página não se chama "fale conosco" e não pede assunto: chama-se Mapa de Clareza e pede onde a pessoa está. Texto assim se escreve uma vez só — quem contou o que está vivendo não reescreve porque a tela engoliu. Então a confirmação só aparece depois que o registro existe de verdade, e quando falha, mostra o erro em vez de fingir que recebeu.',
        listaTitulo: 'O QUE O TEMA IMPÔS AO DESENHO',
        lista: [
          'Os depoimentos da página dizem, em letra visível, que nomes e detalhes foram alterados. Sigilo declarado vale mais que sigilo presumido — e é o que separa prova social de exposição de paciente.',
          'A primeira dobra nomeia a dor antes de oferecer qualquer coisa. Quem se reconhece na descrição continua; quem não se reconhece sai sem ter dado nada.',
          'Nenhum contador de urgência, nenhuma escassez. Pressa é a gramática de quem vende curso — no assunto dela, é a gramática do agressor.',
        ],
        imagem: '/images/obra-danila-silencio.jpg',
        legenda: 'O retrato que abre a página dela: a identidade que se desfaz é o próprio assunto.',
      },
      {
        rotulo: '(A palavra)',
        declaracao: 'ESCREVI O CÓDIGO. TAMBÉM ESCREVI O LIVRO.',
        sub: 'CHEGA DE ME DEIXAR POR ÚLTIMO SAIU EM PORTUGUÊS, INGLÊS E ESPANHOL — AS TRÊS EDIÇÕES PRONTAS.',
        corpo:
          'O título não tem equivalente literal em inglês nem em espanhol. "Chega de me deixar por último" é uma frase que alguém diz para si mesma depois de anos se colocando no fim da fila — traduzir isso é reescrever a decisão, não procurar as palavras numa lista. Cada edição precisou achar a frase que faz uma leitora daquele idioma reconhecer a própria vida na capa.',
        corpoExtra:
          'A vantagem de o tradutor ser o mesmo que construiu a página é a única que interessa aqui: o vocabulário não diverge. O que a landing chama de reconstrução, o livro chama de reconstrução, e a edição em espanhol não inventa um terceiro termo. Em texto que trata de identidade, sinônimo solto custa confiança.',
        imagem: '/images/obra-danila-livro.jpg',
        legenda: 'A capa da edição brasileira. As outras duas estão prontas, aguardando publicação na Amazon e nas bibliotecas.',
      },
      {
        rotulo: '(A operação)',
        declaracao: 'O ANÚNCIO TRAZ. O REGISTRO GUARDA.',
        sub: 'O CLIQUE CHEGA ETIQUETADO, E O QUE ACONTECE DEPOIS NÃO MORA NO PAINEL DE UM TERCEIRO.',
        corpo:
          'O link da bio carrega a origem no próprio endereço — rede, meio e qual peça trouxe a pessoa. Isso não é enfeite de URL: é o que permite saber, no fim do mês, se o público veio do anúncio ou do perfil, e qual argumento estava na peça que funcionou. Com tráfego pago rodando, um canal que não registra a origem é dinheiro gasto sem leitura.',
        listaTitulo: 'POR QUE BANCO PRÓPRIO, E NÃO SÓ O PAINEL DO ANÚNCIO',
        lista: [
          'O painel da plataforma mostra o clique. Ele não mostra o que a pessoa escreveu depois, e é esse texto que diz se a campanha atraiu quem devia.',
          'Registro próprio não some quando a conta de anúncio é pausada, trocada ou bloqueada — e conta de anúncio é a peça mais frágil do arranjo.',
          'Num assunto sensível, o que a pessoa escreveu fica em base controlada por ela, e não espalhado em ferramenta de terceiro que ninguém auditou.',
        ],
        imagem: '/images/obra-danila-metodo.jpg',
        legenda: 'Mente e corpo: a imagem que a própria página usa para falar do método.',
      },
    ],

    /* ── resultados ── */
    resultados: {
      rotulo: '(Resultados)',
      declaracao: 'O QUE A OBRA PRONTA ENTREGA.',
      sub: 'DUAS PÁGINAS NO AR, UM LIVRO EM TRÊS IDIOMAS E UM CANAL QUE SABE DE ONDE VEIO CADA PESSOA.',
      imagens: [
        '/images/obra-danila-livro.jpg',
        '/images/obra-danila-metodo.jpg',
        '/images/obra-danila-silencio.jpg',
        '/images/obra-danila-retrato.jpg',
      ],
      imagemAlt: 'Peças da obra, em sequência',

      /* Mesma regra da obra anterior: o lugar do depoimento existe, o
         depoimento inventado não. O texto é um fato em terceira
         pessoa, que não dá para ler como fala dela. */
      registro: {
        rotulo: 'Registro',
        frase: 'O trabalho saiu do navegador.',
        texto:
          'Começou como site e link na bio. Terminou com três edições de um livro — duas delas escritas por quem tinha sido contratado para programar. Escopo não cresce assim por acaso.',
        cartao: {
          foto: '/images/obra-danila-retrato.jpg',
          texto: 'Do site ao livro: as edições em inglês e espanhol foram escritas pelo mesmo profissional que construiu as páginas.',
          assina: 'Danila Souza',
          org: 'Psicanálise · Autora',
        },
      },

      blocos: [
        {
          titulo: 'O TEXTO CHEGA INTEIRO',
          texto:
            'O Mapa de Clareza não pede nome e e-mail: pede o que está acontecendo. A tela só confirma depois que o registro existe — e quando falha, mostra o erro em vez de engolir uma confissão.',
        },
        {
          titulo: 'A PORTA POR ONDE ELA ENTROU',
          texto:
            'São duas: o site e o link da bio. Cada visita carrega rede, meio e peça de origem, então dá para separar quem veio do anúncio de quem veio do perfil — e saber qual argumento trouxe qual pessoa.',
        },
        {
          titulo: 'O LIVRO NÃO DEPENDE DE MIM PARA EXISTIR',
          texto:
            'As três edições estão prontas e entregues. Publicar na Amazon e nas bibliotecas é passo dela, no tempo dela — a tradução não fica presa a uma agenda minha.',
        },
      ],
    },

    /* ── fecho ── */
    fecho: {
      texto:
        'COMEÇOU COMO SITE E TERMINOU COM UM LIVRO EM TRÊS IDIOMAS. O TEXTO É DELA E O MANUSCRITO NÃO É MEU PARA PUBLICAR — MAS CONTO COMO FOI FEITO NUMA CONVERSA.',
      esteira: 'Projeto no ar',
      /* O endereço limpo, sem os parâmetros de campanha do link que o
         Israel mandou: `utm_*` e `fbclid` são rastro de UM clique num
         anúncio dele. Republicar isso aqui sujaria a medição dela e
         ainda contaria a estranho por onde aquele clique passou. */
      url: 'https://danila-souza-link-bio.vercel.app/',
    },
  },

  /* ══════════════════════════════════════════════════════════════
     TIAGO — TL GARDEN SOLUTION

     ── o que distingue esta obra ──
     Nas outras duas o formulário pergunta e alguém lê depois. Aqui o
     site DIAGNOSTICA: sete perguntas, um índice de saúde calculado na
     hora, e o lead chega com o problema já nomeado. A conversa começa
     no segundo assunto.

     ── de quem é esta página ──
     Ela mostra o QUE FOI CONSTRUÍDO, não o jardim do cliente. Por isso
     as peças dos capítulos são imagens feitas para cada afirmação —
     uma por ponto de coleta, uma por etapa da triagem, uma por decisão
     de alcance —, na linguagem da casa: macro industrial em Aço, Cal e
     Solda, sem texto e sem gente.

     As fotos reais de Surrey ficaram no único lugar em que o assunto é
     o resultado do cliente: a TV do bloco de resultados, passando em
     laço. E o retrato do Tiago no herói, porque a obra tem dono.

     O TRÍPTICO alinha três por capítulo numa escada horizontal, cada
     peça derivando num ritmo próprio.
     ══════════════════════════════════════════════════════════════ */
  {
    slug: 'tl-garden',
    indice: '03',
    ano: '2026',

    /* ── herói ── */
    chamada: 'O lead chega com o diagnóstico na mão.',
    titulo: ['TL', 'GARDEN'],
    heroImagem: '/images/obra-tiago-heroi.jpg',
    heroAlt: 'Retrato de Tiago, da página da TL Garden Solution',
    lateralEsq: 'Paisagismo · Surrey, UK',
    lateralDir: 'Set 2026',
    heroTexto:
      'Sete anos cuidando de jardins em Surrey, e um orçamento que sempre começava do zero: qual é o tamanho, qual é o problema, manda foto. O site passou a fazer essas perguntas antes — e a devolver um índice de saúde em vez de um "entraremos em contato".',

    /* ── ficha ── */
    nome: 'TL GARDEN SOLUTION',
    subtitulo: 'SETE PERGUNTAS ANTES DA PRIMEIRA CONVERSA.',
    declaracao:
      'UM SITE QUE DIAGNOSTICA O JARDIM ANTES DE ALGUÉM PEDIR ORÇAMENTO.',
    linkVivo: { rotulo: 'PROJETO NO AR', texto: 'EM INGLÊS, PARA SURREY', url: null },
    ficha: [
      { valor: ['Site institucional', 'Motor de diagnóstico', 'Upload de fotos', 'SEO'], rotulo: 'TIPO DE TRABALHO' },
      { valor: ['Paisagismo', 'Manutenção de jardim'], rotulo: 'SETOR' },
      { valor: ['Surrey e arredores', 'Reino Unido'], rotulo: 'PRAÇA' },
      { valor: ['Set 2026'], rotulo: 'ENTREGUE' },
    ],

    /* ── a nota do fecho ── */
    introducao: {
      destaque: 'Sete perguntas, um índice',
      resto: 'O formulário deixou de ser uma caixa de entrada e virou uma triagem. Quem responde já sabe o que tem; quem atende já sabe o que vai encontrar.',
    },

    /* ── capítulos ──
       Cada um traz TRÊS fotos em vez de uma: ver `triptico`. */
    capitulos: [
      {
        rotulo: '(O sinal)',
        declaracao: 'O DONO SÓ VÊ O PROBLEMA QUANDO ELE JÁ CUSTA CARO.',
        sub: 'JARDIM MAL CUIDADO NÃO DÁ AVISO. ELE DEGRADA DEVAGAR, E O OLHO SE ACOSTUMA.',
        corpo:
          'A página abre nomeando isso antes de vender qualquer coisa: os sinais passam despercebidos até virarem conserto. Solo compactado, irrigação desregulada, espécie errada para a incidência de sol — nada disso aparece numa foto até estar avançado. Quem mora ali vê o jardim todo dia e é exatamente por isso que não percebe.',
        listaTitulo: 'O QUE O DIAGNÓSTICO PERGUNTA, E POR QUÊ',
        lista: [
          'Tipo de propriedade — residência, condomínio, empresa e hotel têm exigências diferentes de acabamento e de frequência. A mesma resposta técnica não serve aos quatro.',
          'Condição do solo, incidência de sol e irrigação. São as três causas de quase todo sintoma visível, e nenhuma delas aparece numa foto de jardim.',
          'Objetivo do dono. Manter, recuperar ou transformar são orçamentos de ordens de grandeza diferentes — perguntar antes evita a proposta que ninguém pediu.',
        ],
        /* Uma peça por ponto de coleta, na ordem da lista acima. Não são
           fotos do jardim: são a MECÂNICA do que foi construído, que é o
           que esta página tem para mostrar. */
        triptico: [
          { src: '/images/obra-tiago-coleta-a.jpg', legenda: 'Tipo de propriedade: quatro caminhos, um escolhido.' },
          { src: '/images/obra-tiago-coleta-b.jpg', legenda: 'Solo, sol e irrigação: as três causas que a foto não mostra.' },
          { src: '/images/obra-tiago-coleta-c.jpg', legenda: 'Objetivo do dono: manter, recuperar ou transformar.' },
        ],
      },
      {
        rotulo: '(A triagem)',
        declaracao: 'SETE PERGUNTAS, E UM ÍNDICE NO FIM.',
        sub: 'O VISITANTE NÃO PREENCHE UM FORMULÁRIO. ELE FAZ UM EXAME.',
        corpo:
          'A diferença entre os dois é quem recebe valor primeiro. Formulário comum pede dado e devolve uma promessa de retorno; o diagnóstico devolve na hora um índice de saúde e os pontos de atenção da área verde. Quem respondeu sai com alguma coisa mesmo que nunca contrate — e quem contrata já chegou sabendo o que tem.',
        corpoExtra:
          'O formulário de orçamento aceita foto da área: até 5MB, JPG ou PNG. Num serviço em que o preço depende do estado do terreno, a imagem economiza uma visita inteira de avaliação. É também a parte que mais exige cuidado — upload aberto é porta aberta, e por isso as regras de acesso do armazenamento são parte da entrega, não um detalhe de configuração.',
        triptico: [
          { src: '/images/obra-tiago-exame-a.jpg', legenda: 'Sete perguntas, uma de cada vez, com o avanço à vista.' },
          { src: '/images/obra-tiago-exame-b.jpg', legenda: 'O índice de saúde, calculado e devolvido na tela.' },
          { src: '/images/obra-tiago-exame-c.jpg', legenda: 'O envio de foto: abertura estreita e com regra de acesso.' },
        ],
      },
      {
        rotulo: '(A praça)',
        declaracao: 'EM INGLÊS, PARA QUEM PROCURA EM SURREY.',
        sub: 'JARDINAGEM É BUSCA LOCAL. QUEM NÃO APARECE NO RAIO CERTO NÃO EXISTE.',
        corpo:
          'A página inteira é escrita em inglês britânico — "maintained", "neighbourhood", "personalised" — porque o público é local e ortografia americana num serviço de Surrey lê como empresa de fora. A praça aparece declarada no rodapé, no formulário e no texto: Surrey e arredores, sete anos de estrada.',
        corpoExtra:
          'Os planos são três, e a régua é o nível de cuidado, não o desconto: Essential mantém, Performance acompanha, Signature gere. Em serviço recorrente, quem escolhe está decidindo com que frequência quer pensar no assunto — e essa é a pergunta que a tabela precisa responder.',
        triptico: [
          { src: '/images/obra-tiago-alcance-a.jpg', legenda: 'Busca local: um raio, não o mundo inteiro.' },
          { src: '/images/obra-tiago-alcance-b.jpg', legenda: 'Três planos, e a régua é o nível de cuidado.' },
          { src: '/images/obra-tiago-alcance-c.jpg', legenda: 'A linha entre o bruto e o acabado — que é o que se vende.' },
        ],
      },
    ],

    /* ── resultados ── */
    resultados: {
      rotulo: '(Resultados)',
      declaracao: 'O QUE A OBRA PRONTA ENTREGA.',
      sub: 'NÃO É UM SITE BONITO DE JARDINAGEM. É UMA TRIAGEM QUE CHEGA ANTES DA PRIMEIRA CONVERSA.',
      /* As NOVE fotos reais de Surrey, todas aqui. Este é o único ponto
         da página em que o assunto é o jardim do cliente, e não o que
         foi construído — então é aqui que elas vivem, passando em laço. */
      imagens: [
        '/images/obra-tiago-praca-a.jpg',
        '/images/obra-tiago-sinal-b.jpg',
        '/images/obra-tiago-obra-a.jpg',
        '/images/obra-tiago-praca-c.jpg',
        '/images/obra-tiago-sinal-c.jpg',
        '/images/obra-tiago-obra-c.jpg',
        '/images/obra-tiago-sinal-a.jpg',
        '/images/obra-tiago-obra-b.jpg',
        '/images/obra-tiago-praca-b.jpg',
      ],
      imagemAlt: 'Jardins da TL Garden, em sequência',

      registro: {
        rotulo: 'Registro',
        frase: 'A conversa começa no segundo assunto.',
        texto:
          'Antes, todo orçamento abria com as mesmas cinco perguntas. Agora elas já estão respondidas quando o telefone toca — e o que sobra de tempo é o que decide se o serviço é vendido.',
        cartao: {
          foto: '/images/obra-tiago-retrato.jpg',
          texto: 'Sete anos cuidando de áreas verdes em Surrey. O site passou a fazer a triagem que antes consumia a primeira visita.',
          assina: 'Tiago',
          org: 'TL Garden Solution · Surrey, UK',
        },
      },

      blocos: [
        {
          titulo: 'O ORÇAMENTO CHEGA COM FOTO',
          texto:
            'O formulário aceita imagem da área — JPG ou PNG, até 5MB. Em serviço cujo preço depende do estado do terreno, isso é uma visita de avaliação que não precisou acontecer.',
        },
        {
          titulo: 'O ÍNDICE É DO VISITANTE, NÃO MEU',
          texto:
            'O diagnóstico devolve o resultado na tela, na hora. Quem responde sai com alguma coisa mesmo que nunca contrate — e é isso que faz as sete perguntas serem respondidas até o fim.',
        },
        {
          titulo: 'ESCRITO PARA O RAIO CERTO',
          texto:
            'Inglês britânico, praça declarada em três lugares da página e estrutura preparada para busca local. Jardinagem não se procura por marca, se procura por bairro.',
        },
      ],
    },

    /* ── fecho ── */
    fecho: {
      texto:
        'SETE PERGUNTAS ANTES DA PRIMEIRA CONVERSA, E UM ÍNDICE DE SAÚDE NA TELA. O MOTOR DE REGRAS NÃO É MEU PARA PUBLICAR — MAS EXPLICO COMO ELE PONTUA NUMA CONVERSA.',
      esteira: 'Projeto no ar',
      url: 'https://tl-garden.vercel.app/',
    },
  },
];

/**
 * As obras que ainda não têm página própria.
 *
 * Elas aparecem na faixa "Mais obras" com o mesmo desenho das outras,
 * mas SEM link: card que não leva ao projeto é pior que card que não
 * clica, porque o primeiro quebra a confiança no resto da navegação.
 * À medida que cada página nascer, a entrada sai daqui e entra em
 * PROJETOS — o desenho da linha não muda.
 */
export const OUTRAS_OBRAS = [
  {
    nome: 'PORTFÓLIO SMARTLABS',
    subtitulo: 'O MÉTODO É O PRODUTO.',
    tags: ['React 19', 'GSAP', 'Three.js'],
    data: 'Set 2026',
    heroImagem: '/images/work-performance.jpg',
    heroAlt: 'Obra própria',
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
