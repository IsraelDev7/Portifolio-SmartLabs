/**
 * /api/contato — a porta de entrada do formulário.
 *
 * ── por que existe uma função no meio do caminho ──
 * O formulário podia chamar o n8n direto do navegador. Não chama por
 * duas razões:
 *
 *   1. a URL do webhook ficaria no pacote que vai para o cliente, e
 *      qualquer um poderia despejar lixo nela a partir de um script;
 *   2. o navegador não consegue guardar segredo nenhum — se amanhã o
 *      webhook precisar de um cabeçalho de autenticação, não haveria
 *      onde pôr.
 *
 * Aqui a URL vive em variável de ambiente e nunca sai do servidor.
 *
 * ── a regra que a própria página defende ──
 * A obra do Bruno afirma, em letra grande, que "a tela só confirma
 * depois que o registro existe — e quando falha, mostra o erro em vez de
 * engolir uma confissão". Um portfólio que escreve isso e tem um
 * formulário que perde mensagem em silêncio não é descuido: é
 * desmentido. Por isso esta função só devolve 200 quando o n8n
 * confirmou; qualquer outra coisa vira erro na cara de quem escreveu.
 */

/* Limites de tamanho por campo. Não é validação de conteúdo — é teto
   para o corpo da requisição não virar vetor de abuso. */
const TETO = { nome: 120, empresa: 140, email: 160, whatsapp: 40, mensagem: 4000 };

const limpar = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

/* E-mail: só o suficiente para barrar erro de digitação óbvio. Validar
   e-mail por regex a sério é folclore — quem decide se existe é o envio. */
const pareceEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ erro: 'metodo_nao_permitido' });
  }

  const destino = process.env.N8N_CONTATO_WEBHOOK;
  if (!destino) {
    /* Falta de configuração é problema NOSSO, não de quem escreveu.
       Registra do lado do servidor e devolve uma mensagem que admite a
       falha em vez de fingir que a mensagem chegou. */
    console.error('[contato] N8N_CONTATO_WEBHOOK nao configurada');
    return res.status(503).json({ erro: 'canal_indisponivel' });
  }

  const corpo = typeof req.body === 'string' ? safeJson(req.body) : (req.body || {});

  /* ── a armadilha para robô ──
     Um campo que pessoa nenhuma vê e portanto nunca preenche. Quem
     preencheu é script. Devolve 200 de propósito: robô que recebe erro
     tenta de novo, robô que recebe sucesso vai embora. */
  if (limpar(corpo.site, 200)) return res.status(200).json({ ok: true });

  const dados = {
    nome: limpar(corpo.nome, TETO.nome),
    empresa: limpar(corpo.empresa, TETO.empresa),
    email: limpar(corpo.email, TETO.email),
    whatsapp: limpar(corpo.whatsapp, TETO.whatsapp),
    mensagem: limpar(corpo.mensagem, TETO.mensagem),
    /* Booleano de verdade, e nao a string "sim" que o formulario manda:
       quem decide se liga e uma condicao la no n8n, e condicao sobre
       string e onde nascem os bugs que ninguem acha. */
    podeLigar: corpo.podeLigar === 'sim' || corpo.podeLigar === true,
  };

  const faltando = [];
  if (!dados.nome) faltando.push('nome');
  if (!dados.email) faltando.push('email');
  else if (!pareceEmail(dados.email)) faltando.push('email');
  if (!dados.mensagem) faltando.push('mensagem');
  if (faltando.length) return res.status(422).json({ erro: 'campos_invalidos', campos: faltando });

  /* Timeout explícito: sem ele, um n8n fora do ar deixaria a pessoa
     olhando para um botão girando até o limite da plataforma. */
  const relogio = AbortSignal.timeout(9000);

  try {
    const r = await fetch(destino, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      signal: relogio,
      body: JSON.stringify({
        ...dados,
        origem: 'portfolio/contato',
        recebidoEm: new Date().toISOString(),
        /* Contexto que ajuda a triar e não identifica ninguém. */
        referencia: limpar(req.headers['referer'], 300),
      }),
    });

    if (!r.ok) {
      console.error('[contato] webhook respondeu', r.status);
      return res.status(502).json({ erro: 'canal_recusou' });
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    /* O motivo vai para o log do servidor; para fora vai só o fato de
       que não deu. Detalhe de infraestrutura na resposta é mapa para
       quem estiver sondando. */
    console.error('[contato] falha ao entregar:', e?.name || e);
    return res.status(502).json({ erro: 'canal_indisponivel' });
  }
}

function safeJson(s) {
  try { return JSON.parse(s); } catch { return {}; }
}
