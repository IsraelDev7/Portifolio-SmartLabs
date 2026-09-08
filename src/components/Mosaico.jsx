import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Mosaico — a foto se constroi em ladrilhos conforme o scroll rola.
 *
 * O canvas nao desenha a imagem: ele e uma COBERTURA opaca por cima
 * dela, e o scroll vai apagando ladrilho a ladrilho. Isso importa por
 * tres motivos:
 *
 *   1. A <img> continua sendo uma <img> de verdade — alt, SEO,
 *      lazy-load e cache do navegador intactos.
 *   2. Nao ha decode nem desenho de bitmap por quadro; so fillRect de
 *      cor solida, que e a operacao mais barata do canvas 2D.
 *   3. Nada de CORS: a imagem nunca entra no contexto do canvas.
 *
 * Um canvas no lugar de uma grade de divs: 100 ladrilhos seriam 100
 * elementos por foto, 300 na galeria inteira, cada um com o seu proprio
 * background-position. Aqui sao 3 canvas.
 *
 * A frente de construcao — os proximos ladrilhos a cair — e pintada em
 * Solda translucida. E o mesmo gesto do degrau mais alto da marca: o
 * proximo passo, ainda quente.
 */

const COR_COBERTURA = '#0A0A0A';   // --aco
const COR_FRENTE = 'rgba(209, 77, 41, 0.38)';   // --solda translucida
const LADRILHO_ALVO = 52;          // px — tamanho de mira; o real ajusta a caixa
const FRENTE = 5;                  // quantos ladrilhos formam a frente quente

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
    let ladrilhos = [];
    let ordem = [];
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

      const cols = Math.max(4, Math.round(l / LADRILHO_ALVO));
      const linhas = Math.max(4, Math.round(a / LADRILHO_ALVO));
      const cw = l / cols;
      const ch = a / linhas;

      ladrilhos = [];
      for (let y = 0; y < linhas; y++) {
        for (let x = 0; x < cols; x++) {
          // +1 no tamanho fecha o fio de subpixel entre ladrilhos
          ladrilhos.push({ x: x * cw, y: y * ch, w: cw + 1, h: ch + 1 });
        }
      }
      ordem = embaralharCom(semente, ladrilhos.length);
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

      // os que ainda nao cairam continuam cobrindo
      ctx.fillStyle = COR_COBERTURA;
      for (let i = n + FRENTE; i < total; i++) {
        const t = ladrilhos[ordem[i]];
        ctx.fillRect(t.x, t.y, t.w, t.h);
      }

      // a frente de construcao, ainda quente
      ctx.fillStyle = COR_FRENTE;
      for (let i = n; i < Math.min(n + FRENTE, total); i++) {
        const t = ladrilhos[ordem[i]];
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

    /* O ResizeObserver sozinho NAO bastou. Medido: os tres mosaicos cujo
       filho e uma <img> ficavam com o canvas em 300x150 — o padrao do
       HTML, ou seja, `medir()` nunca rodou com caixa util — e um
       ScrollTrigger.refresh() manual no console corrigia os tres de uma
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
