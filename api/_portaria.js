/**
 * A portaria de /api/contato.
 *
 * ── o risco que isto existe para conter ──
 * A função dispara e-mail, WhatsApp, nota de voz e ligação. Um laço de
 * requisições não custa dinheiro primeiro: custa o NÚMERO. Z-API é API não
 * oficial do WhatsApp, e volume anômalo é exatamente o que a Meta pune com
 * banimento. Perder o número é perder o canal inteiro, e ele não volta
 * pedindo com jeitinho.
 *
 * Por isso a ordem das barreiras é da mais barata para a mais cara: as que
 * não custam nada rodam primeiro, e só o que passa por todas chega a gastar
 * uma chamada de rede.
 *
 * O arquivo começa com `_` de propósito: a Vercel não publica como rota.
 */
import crypto from 'node:crypto';

/* ──────────────────────────────────────────────────────────────
   1. ORIGEM — barra o script que posta de fora do site
   ────────────────────────────────────────────────────────────── */

/**
 * Só aceita requisição cuja origem é o próprio site.
 *
 * A regra compara o host do cabeçalho `Origin` com o host que atendeu a
 * requisição. Isso cobre produção e qualquer prévia da Vercel sem lista
 * fixa de domínio — e domínio novo não quebra nada.
 *
 * Requisição sem `Origin` nem `Referer` é recusada. Navegador sempre manda
 * um dos dois num POST de formulário; quem não manda é script, e script é
 * o que estamos barrando. Nenhum serviço legítimo chama esta rota.
 */
export function origemConfere(req) {
  const host = String(req.headers['host'] || '').toLowerCase();
  if (!host) return false;

  const cru = req.headers['origin'] || req.headers['referer'] || '';
  if (!cru) return false;

  try {
    return new URL(cru).host.toLowerCase() === host;
  } catch {
    return false;
  }
}

/* ──────────────────────────────────────────────────────────────
   2. TEMPO DE PREENCHIMENTO — barra quem não leu nada
   ────────────────────────────────────────────────────────────── */

const PREENCHIMENTO_MINIMO_MS = 2500;

/**
 * Formulário enviado em menos de 2,5s não foi preenchido por pessoa: não dá
 * tempo de ler o rótulo, muito menos de escrever a mensagem.
 *
 * ── por que o relógio do cliente não derruba ninguém ──
 * O horário vem do navegador, e relógio de usuário erra. Então só o caso
 * inequívoco é recusado: tempo positivo e pequeno demais. Valor ausente,
 * negativo ou absurdo apenas DESLIGA esta checagem para aquela requisição,
 * em vez de recusar — relógio torto é problema de quem visita, e cobrar
 * isso dele custaria um lead de verdade.
 *
 * É quebra-molas, não cadeado: um robô dedicado forja o campo. Quem segura
 * volume é o limite por IP; este aqui elimina o tráfego automatizado burro,
 * que é a maior parte.
 */
export function rapidoDemais(corpo) {
  const t = Number(corpo?.carregadoEm);
  if (!Number.isFinite(t) || t <= 0) return false;

  const decorrido = Date.now() - t;
  if (decorrido < 0 || decorrido > 12 * 60 * 60 * 1000) return false;

  return decorrido < PREENCHIMENTO_MINIMO_MS;
}

/* ──────────────────────────────────────────────────────────────
   3. IDENTIDADE DE QUEM CHAMA — sem guardar quem é
   ────────────────────────────────────────────────────────────── */

export function ipDaRequisicao(req) {
  const encadeado = String(req.headers['x-forwarded-for'] || '');
  /* O primeiro da lista é o cliente; os seguintes são os proxies. */
  const primeiro = encadeado.split(',')[0].trim();
  return primeiro || req.socket?.remoteAddress || '';
}

/**
 * Transforma o IP num identificador que serve para CONTAR e não para
 * IDENTIFICAR.
 *
 * ── por que não guardar o IP ──
 * IP é dado pessoal. Montar a lista de todo mundo que acessou, para conter
 * quem abusa, criaria um problema de privacidade maior que o resolvido.
 *
 * ── por que com chave secreta ──
 * SHA-256 puro de um IP não protege nada: existem só ~4 bilhões de IPv4, e
 * testar todos é trivial. Com HMAC e uma chave que não sai do servidor, o
 * hash deixa de ser reversível.
 *
 * A chave sai de `RATE_LIMIT_SALT` quando existe. Sem ela, deriva do
 * segredo do webhook — que já é obrigatório aqui e já é de alta entropia.
 * Rotacionar o webhook só reinicia as contagens, o que é inofensivo.
 */
export function identificar(ip, segredoDeReserva) {
  const chave = process.env.RATE_LIMIT_SALT || segredoDeReserva || '';
  if (!ip || !chave) return '';
  return crypto.createHmac('sha256', chave).update(ip).digest('hex').slice(0, 32);
}

/* ──────────────────────────────────────────────────────────────
   4. LIMITE POR IP — o que realmente segura um laço
   ────────────────────────────────────────────────────────────── */

/* Primeira linha, de graça: um Map no processo. Instância morna da Vercel
   atende várias requisições seguidas, então uma rajada do mesmo lugar morre
   aqui sem gastar uma ida ao banco. Não substitui o limite durável — some a
   cada instância nova —, mas é o filtro mais barato que existe. */
const memoria = new Map();
const JANELA_MEMORIA_MS = 10 * 60 * 1000;
const TETO_MEMORIA = 3;

function limiteNaMemoria(id) {
  const agora = Date.now();
  const marcas = (memoria.get(id) || []).filter((t) => agora - t < JANELA_MEMORIA_MS);

  /* O Map não pode crescer para sempre num processo de vida longa. */
  if (memoria.size > 5000) memoria.clear();

  if (marcas.length >= TETO_MEMORIA) return true;
  marcas.push(agora);
  memoria.set(id, marcas);
  return false;
}

/**
 * Limite durável, no Postgres.
 *
 * Função serverless não tem memória entre instâncias: um contador local
 * zera junto com a instância, e um laço distribuído passa direto. A conta
 * precisa de um lugar que sobreviva.
 *
 * ── quando o banco não está configurado ──
 * Devolve `{ indisponivel: true }` e NÃO bloqueia. Recusar lead porque a
 * variável de ambiente falta seria trocar um risco por um prejuízo certo.
 * Mas registra erro no log do servidor: degradar em silêncio é o defeito
 * que este projeto passa a vida acusando.
 */
async function limiteNoBanco(id) {
  const url = process.env.SUPABASE_URL;
  const chave = process.env.SUPABASE_ANON_KEY;

  if (!url || !chave) {
    console.error('[contato] limite durável DESLIGADO: faltam SUPABASE_URL/SUPABASE_ANON_KEY ' +
                  'no ambiente da Vercel. Só o limite em memória está ativo.');
    return { indisponivel: true };
  }

  try {
    const r = await fetch(`${url}/rest/v1/rpc/registrar_tentativa`, {
      method: 'POST',
      signal: AbortSignal.timeout(3000),
      headers: { apikey: chave, Authorization: `Bearer ${chave}`, 'content-type': 'application/json' },
      body: JSON.stringify({ ip_hash: id }),
    });
    if (!r.ok) {
      console.error('[contato] limite durável respondeu', r.status);
      return { indisponivel: true };
    }
    return await r.json();
  } catch (e) {
    console.error('[contato] limite durável inacessível:', e?.name || e);
    return { indisponivel: true };
  }
}

/**
 * Decide se esta requisição passa.
 *
 * Memória primeiro porque é instantânea; banco depois porque é o que
 * resiste. Sem identificador (IP ausente, chave ausente) o limite não tem
 * como operar — e aí ele libera em vez de barrar todo mundo, porque uma
 * portaria quebrada não pode fechar a porta da rua.
 */
export async function excedeuOLimite(id) {
  if (!id) {
    console.error('[contato] sem identificador para o limite — requisição liberada');
    return { excedeu: false, camada: 'nenhuma' };
  }

  if (limiteNaMemoria(id)) return { excedeu: true, camada: 'memoria', espere_s: 600 };

  const r = await limiteNoBanco(id);
  if (r?.permitido === false) {
    return { excedeu: true, camada: 'banco', espere_s: r.espere_s || 600 };
  }
  return { excedeu: false, camada: r?.indisponivel ? 'memoria' : 'banco' };
}
