import React, { useRef, useState } from 'react';

/**
 * Partilha — os icones de compartilhar o artigo.
 *
 * ── por que nao reusar o RedesPixel ──
 * Parecem a mesma coisa e nao sao. O RedesPixel aponta para os PERFIS
 * da marca e e um destino: o visitante sai daqui e vai para la. Este
 * aponta para o ARTIGO e e uma acao: a pessoa leva a pagina para outro
 * lugar. Os alvos mudam a cada artigo, um deles nem e link (copiar), e
 * a entrada la e por scroll enquanto aqui e por hover.
 *
 * Fundi-los criaria um componente com dois modos que divergem na
 * primeira mudanca feita so em um deles. O que eles compartilham de
 * verdade — a caixa de 44px, o glifo em traco de 1.5, a cor de acento
 * no hover — e CSS, e isso esta no mesmo lugar.
 *
 * ── as redes que estao aqui, e as que nao estao ──
 * A referencia mostra seis, com Facebook e Reddit. Nenhum dos dois faz
 * sentido para um portfolio B2B que atende Brasil e Reino Unido:
 * artigo tecnico circula no LinkedIn e no WhatsApp, e no Reddit sem
 * comunidade so entra quem ja tem karma para postar.
 *
 * No lugar deles entra COPIAR LINK, que e o gesto de compartilhamento
 * mais usado que existe e nao aparece em nenhuma estatistica — porque
 * acontece fora de qualquer plataforma.
 *
 * ── a falha no hover ──
 * A animacao esta no CSS, e nao aqui. E uma decisao de custo: cinco
 * icones com timeline propria significam cinco timelines vivas numa
 * pagina de leitura, e o efeito e curto, ciclico e identico em todos.
 * Keyframes com `steps()` entregam o mesmo corte seco sem ocupar o
 * ticker do GSAP — que nesta pagina ja carrega a persiana das imagens.
 *
 * A gramatica e a da Falha: nada interpola. O glifo salta de um estado
 * a outro, e as duas copias fantasma (Solda e Fumaca) se separam do
 * original como canal de cor que perdeu o registro.
 */

const CAIXA = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

const GLIFOS = {
  linkedin: (
    <svg {...CAIXA}>
      <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="2.2" />
      <path d="M7.4 10.4v6.2M11.2 16.6v-6.2M11.2 13.1c0-1.5 1-2.7 2.4-2.7s2.4 1.2 2.4 2.7v3.5" />
      <circle cx="7.4" cy="7.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  whatsapp: (
    <svg {...CAIXA}>
      <path d="M20.2 11.7a8.2 8.2 0 0 1-12.2 7.2L3.8 20.2l1.3-4.1A8.2 8.2 0 1 1 20.2 11.7Z" />
      <path d="M9 9.1c.2-.5.5-.5.8-.5h.5c.2 0 .4 0 .6.5l.7 1.6c.1.3 0 .5-.1.7l-.4.5c-.1.2-.2.4 0 .7a6 6 0 0 0 2.6 2.2c.3.1.5.1.7-.1l.5-.6c.2-.2.4-.2.6-.1l1.5.8c.3.2.4.4.4.6a1.9 1.9 0 0 1-1.9 1.7c-.8 0-2.6-.5-4.3-2.2S8.7 11.4 8.7 10.3c0-.5.2-.9.3-1.2Z" />
    </svg>
  ),
  x: (
    <svg {...CAIXA}>
      <path d="M4 4l7.4 9.1L4.6 20M20 20l-7.4-9.1L19.4 4" />
    </svg>
  ),
  telegram: (
    <svg {...CAIXA}>
      <path d="M21 4.6 2.9 11.4c-.6.2-.6.8 0 1l4.5 1.4 1.7 5c.2.5.6.6 1 .2l2.4-2.2 4.5 3.3c.5.3 1 .1 1.1-.5L21.9 5.3c.1-.6-.3-.9-.9-.7Z" />
      <path d="m7.4 13.8 10.4-6.5-8.1 7.4-.3 3.7" />
    </svg>
  ),
  link: (
    <svg {...CAIXA}>
      <path d="M10.2 13.8a3.6 3.6 0 0 0 5.1 0l3-3a3.6 3.6 0 0 0-5.1-5.1l-1.4 1.4" />
      <path d="M13.8 10.2a3.6 3.6 0 0 0-5.1 0l-3 3a3.6 3.6 0 0 0 5.1 5.1l1.4-1.4" />
    </svg>
  ),
  ok: (
    <svg {...CAIXA}>
      <path d="M4.5 12.6 9.4 17.5 19.5 6.9" />
    </svg>
  ),
};

/**
 * Peca: envolve o glifo em tres camadas identicas. A de baixo e a
 * legivel; as duas de cima sao os fantasmas coloridos que so existem
 * durante o hover. `aria-hidden` nelas para o leitor de tela nao
 * anunciar o mesmo icone tres vezes.
 */
function Glifo({ nome }) {
  return (
    <span className="pt__pilha">
      <span className="pt__glifo">{GLIFOS[nome]}</span>
      <span className="pt__glifo pt__glifo--a" aria-hidden="true">{GLIFOS[nome]}</span>
      <span className="pt__glifo pt__glifo--b" aria-hidden="true">{GLIFOS[nome]}</span>
    </span>
  );
}

export default function Partilha({ url, titulo, className = '' }) {
  const [copiado, setCopiado] = useState(false);
  const relogio = useRef(null);

  const u = encodeURIComponent(url);
  const t = encodeURIComponent(titulo);

  const REDES = [
    ['LinkedIn', 'linkedin', `https://www.linkedin.com/sharing/share-offsite/?url=${u}`],
    ['WhatsApp', 'whatsapp', `https://api.whatsapp.com/send?text=${t}%20${u}`],
    ['X', 'x', `https://twitter.com/intent/tweet?url=${u}&text=${t}`],
    ['Telegram', 'telegram', `https://t.me/share/url?url=${u}&text=${t}`],
  ];

  /* A area de transferencia falha sem HTTPS e sem gesto do usuario. O
     `catch` nao marca sucesso de consolacao: se nao copiou, o rotulo
     continua "copiar link" e a pessoa ve que nao aconteceu. E a mesma
     regra que o artigo defende — nao dizer "pronto" sem confirmacao. */
  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiado(true);
      clearTimeout(relogio.current);
      relogio.current = setTimeout(() => setCopiado(false), 2200);
    } catch {
      setCopiado(false);
    }
  };

  return (
    <ul className={`pt ${className}`}>
      {REDES.map(([nome, glifo, href]) => (
        <li key={nome}>
          <a
            className="pt__peca"
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Compartilhar no ${nome}`}
          >
            <Glifo nome={glifo} />
          </a>
        </li>
      ))}

      <li>
        <button
          type="button"
          className={`pt__peca pt__peca--copiar${copiado ? ' e-copiado' : ''}`}
          onClick={copiar}
          aria-label={copiado ? 'Link copiado' : 'Copiar link do artigo'}
        >
          <Glifo nome={copiado ? 'ok' : 'link'} />
        </button>
      </li>
    </ul>
  );
}
