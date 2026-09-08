import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Mosaico — a foto e GERADA a partir do fundo, pixel a pixel.
 *
 * O canvas nao desenha a imagem: ele e uma COBERTURA opaca por cima
 * dela, e o scroll vai apagando pixel a pixel. Isso importa por tres
 * motivos:
 *
 *   1. A <img> continua sendo uma <img> de verdade — alt, SEO,
 *      lazy-load e cache do navegador intactos.
 *   2. Nao ha decode nem desenho de bitmap por quadro; so fillRect de
 *      cor solida, que e a operacao mais barata do canvas 2D.
 *   3. Nada de CORS: a imagem nunca entra no contexto do canvas.
 *
 * Um canvas no lugar de uma grade de divs: com ladrilho de 14px um
 * cartao grande passa de MIL celulas, e mil elementos por foto — cinco
 * mil na galeria — nao e uma opcao. Aqui sao cinco canvas.
 *
 * ── por que a cobertura tem ruido ──
 * Uma cobertura de cor chapada le como "retangulo preto que some". Com
 * cada pixel variando de luminancia em torno do Aco, a area le como
 * TEXTURA DO PROPRIO FUNDO se organizando — e a imagem parece nascer da
 * pagina em vez de ser desvendada por tras de uma cortina. E a diferenca
 * entre apagar uma cobertura e gerar um cartao.
 *
 * A frente de construcao — os proximos pixels a cair — e pintada em
 * Solda, mais forte na borda que esta caindo e desbotando para tras. E o
 * mesmo gesto do degrau mais alto da marca: o proximo passo, ainda quente.
 */

/* 14px: abaixo disso o custo por quadro dobra sem o olho ganhar nada —
   a 60fps e a essa distancia de leitura, 14 e 10 sao indistinguiveis.
   Em tela pequena sobe para 18: 14px num cartao de 340px vira granulado
   sem leitura, e o mesmo card teria densidade de pixel maior que o de
   desktop, que e o contrario do esperado. */
const LADRILHO_ALVO = 14;
const LADRILHO_ALVO_MOBILE = 18;

const ACO = { r: 10, g: 10, b: 10 };            // --aco #0A0A0A
const SOLDA = { r: 209, g: 77, b: 41 };         // --solda #D14D29

/* Amplitude do ruido, em pontos de luminancia sobre o Aco. Medido na
   tela: abaixo de 6 o ruido some no gamma do monitor, acima de 14 a
   cobertura vira chuvisco de TV e disputa atencao com a foto. */
const RUIDO = 10;
const NIVEIS = 5;   // tons distintos de cobertura — ver a nota de custo abaixo

/* A frente quente e uma FRACAO do total, nunca um numero fixo: cinco
   celulas numa grade de 1.800 sao invisiveis, e as mesmas cinco numa de
   140 sao um terco do cartao. */
const FRACAO_FRENTE = 0.05;
const FRENTE_MIN = 12;

/* Embaralhamento deterministico: a mesma foto revela sempre na mesma
   ordem. Com Math.random a ordem mudaria a cada remedicao e o mosaico
   piscaria ao redimensionar a janela. */
function embaralharCom(semente, n) {
  const ordem = Array.from({ length: n }, (_, i) => i);
  let s = semente;
  for (let i = n - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) % 4294967296;   // LCG
    const j = s % (i + 1);
    [ordem[i], ordem[j]] = [ordem[j], ordem[i]];
  }
  return ordem;
}

/* Os tons da cobertura, pre-calculados: NIVEIS variacoes do Aco
   distribuidas em torno dele. Sao strings prontas porque montar
   `rgb(...)` por celula, mil vezes por quadro, aparece no profiler. */
function tonsDoFundo() {
  const t = [];
  for (let i = 0; i < NIVEIS; i++) {
    const d = Math.round(((i / (NIVEIS - 1)) * 2 - 1) * RUIDO);   // -RUIDO .. +RUIDO
    t.push(`rgb(${ACO.r + d},${ACO.g + d},${ACO.b + d})`);
  }
  return t;
}

export default function Mosaico({ children, deriva, className = '', style, semente = 7 }) {
  const caixa = useRef(null);
  const tela = useRef(null);

  useEffect(() => {
    const box = caixa.current;
    const cv = tela.current;
    if (!box || !cv) return;

    // Movimento reduzido: sem cobertura, a foto ja nasce inteira.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      cv.style.display = 'none';
      return;
    }

    const ctx = cv.getContext('2d');
    const TONS = tonsDoFundo();

    let ladrilhos = [];      // {x, y, w, h, nivel}
    let ordem = [];
    let porNivel = [];       // NIVEIS baldes com indices — ver nota de custo
    let frente = FRENTE_MIN;
    let ultimoN = -1;

    const medir = () => {
      const l = box.clientWidth;
      const a = box.clientHeight;
      if (!l || !a) return false;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.round(l * dpr);
      cv.height = Math.round(a * dpr);
      cv.style.width = l + 'px';
      cv.style.height = a + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const alvo = window.innerWidth <= 768 ? LADRILHO_ALVO_MOBILE : LADRILHO_ALVO;
      const cols = Math.max(6, Math.round(l / alvo));
      const linhas = Math.max(6, Math.round(a / alvo));
      const cw = l / cols;
      const ch = a / linhas;

      /* O nivel de cada celula sai do MESMO gerador da ordem, com outra
         semente. Deterministico pelo mesmo motivo: ruido sorteado de
         novo a cada remedicao faria a cobertura cintilar ao
         redimensionar. */
      let s = semente * 2654435761 % 4294967296;
      ladrilhos = [];
      for (let y = 0; y < linhas; y++) {
        for (let x = 0; x < cols; x++) {
          s = (s * 1664525 + 1013904223) % 4294967296;
          ladrilhos.push({
            // +1 no tamanho fecha o fio de subpixel entre ladrilhos
            x: x * cw, y: y * ch, w: cw + 1, h: ch + 1,
            nivel: s % NIVEIS,
          });
        }
      }

      ordem = embaralharCom(semente, ladrilhos.length);
      frente = Math.max(FRENTE_MIN, Math.round(ladrilhos.length * FRACAO_FRENTE));

      /* Indices agrupados por tom, UMA vez por medicao. O gargalo deste
         canvas nunca foi o fillRect — sao as trocas de fillStyle: com
         ruido por celula seriam ~1.800 trocas por quadro por cartao.
         Desenhando balde a balde sao NIVEIS trocas, e o resto vira uma
         sequencia de fillRect da mesma cor, que e o caminho rapido do
         canvas 2D. */
      porNivel = Array.from({ length: NIVEIS }, () => []);
      for (let i = 0; i < ladrilhos.length; i++) {
        porNivel[ladrilhos[ordem[i]].nivel].push(i);
      }

      ultimoN = -1;
      return true;
    };

    const desenhar = (progresso) => {
      const total = ladrilhos.length;
      if (!total) return;
      const n = Math.round(progresso * total);   // quantos ja cairam
      if (n === ultimoN) return;                 // guarda: so redesenha se mudou
      ultimoN = n;

      ctx.clearRect(0, 0, cv.width, cv.height);

      /* Os que ainda nao cairam continuam cobrindo. Uma passada por tom:
         `porNivel[k]` ja esta em ordem crescente de posicao na fila, e
         so interessa o trecho depois da frente quente. */
      const inicioFrio = n + frente;
      for (let k = 0; k < NIVEIS; k++) {
        const balde = porNivel[k];
        ctx.fillStyle = TONS[k];
        for (let b = 0; b < balde.length; b++) {
          const i = balde[b];
          if (i < inicioFrio) continue;
          const t = ladrilhos[ordem[i]];
          ctx.fillRect(t.x, t.y, t.w, t.h);
        }
      }

      /* A frente de construcao. O alfa cai do inicio da faixa para o
         fim: o pixel prestes a virar foto e o mais quente, e o calor se
         dissipa para tras. Uma banda de energia varrendo, nao uma borda
         de cor constante.

         Aqui a troca de fillStyle por celula e inevitavel — mas sao
         ~5% do total, nao os 100%. */
      const fim = Math.min(n + frente, total);
      for (let i = n; i < fim; i++) {
        const t = ladrilhos[ordem[i]];
        const d = (i - n) / frente;                    // 0 na borda quente, 1 no fim
        const alfa = 0.55 * (1 - d) * (1 - d);         // queda quadratica
        ctx.fillStyle = `rgba(${SOLDA.r},${SOLDA.g},${SOLDA.b},${alfa.toFixed(3)})`;
        ctx.fillRect(t.x, t.y, t.w, t.h);
      }
    };

    medir();
    desenhar(0);

    /* A <img> tem height:auto — quando este efeito roda ela ainda nao
       carregou e a caixa mede zero. O ResizeObserver pega o momento em
       que a altura real aparece, e de quebra cobre qualquer mudanca de
       layout depois disso. */
    /* `let` declarado ANTES do create, nao `const` depois: o onRefresh
       abaixo referencia `st` e pode disparar durante o proprio
       ScrollTrigger.create(). Com const, so LER a variavel na zona morta
       ja lanca ReferenceError — o guarda `st ? ...` nao salvaria. */
    let st = null;

    const remedir = () => {
      if (medir()) { ultimoN = -1; desenhar(st ? st.progress : 0); ScrollTrigger.refresh(); }
    };

    const observador = new ResizeObserver(remedir);
    observador.observe(box);

    /* O ResizeObserver sozinho NAO bastou. Medido: os mosaicos cujo
       filho e uma <img> ficavam com o canvas em 300x150 — o padrao do
       HTML, ou seja, `medir()` nunca rodou com caixa util — e um
       ScrollTrigger.refresh() manual no console corrigia todos de uma
       vez. Os que tem <div> com tamanho no CSS sempre funcionaram.
       A diferenca e a <img> de height:auto: no primeiro quadro a caixa
       tem largura mas altura zero, e a entrega do crescimento nao chega
       — provavelmente engolida pelo proprio refresh disparado de dentro
       do callback.

       Entao nao dependemos so dele. O `load` de cada imagem e um sinal
       direto, e o par de rAF cobre a imagem que ja veio do cache e cujo
       `load` nunca vai disparar. */
    const imgs = Array.from(box.querySelectorAll('img'));
    imgs.forEach((im) => { if (!im.complete) im.addEventListener('load', remedir); });

    const quadro = requestAnimationFrame(() => requestAnimationFrame(remedir));

    st = ScrollTrigger.create({
      trigger: box,
      start: 'top 92%',
      end: 'top 32%',
      scrub: 0.6,
      onUpdate: (self) => desenhar(self.progress),
      onRefresh: () => { if (medir()) { ultimoN = -1; desenhar(st ? st.progress : 0); } },
    });

    return () => {
      observador.disconnect();
      cancelAnimationFrame(quadro);
      imgs.forEach((im) => im.removeEventListener('load', remedir));
      st.kill();
    };
  }, [semente]);

  return (
    <div
      ref={caixa}
      className={`mosaico ${className}`}
      data-deriva={deriva}
      style={style}
    >
      {children}
      <canvas ref={tela} className="mosaico__cobertura" aria-hidden="true" />
    </div>
  );
}
