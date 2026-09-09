import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Ondas — a faixa de barras verticais que sobe sobre a imagem travada.
 *
 * Vem da base da imagem da referencia: dezenas de barras finas de
 * alturas irregulares, como o espectro de um sinal de radio. Ali elas
 * sao decoracao estatica; aqui elas trabalham — sobem enquanto a foto
 * fica presa e sao ELAS que descobrem o texto do segundo ato.
 *
 * ── por que barras e nao uma imagem ──
 * Uma faixa dessas em PNG pesaria mais que a foto que ela cobre, e nao
 * poderia mudar de altura com a tela. Sendo elementos, a mesma peca
 * serve a qualquer largura e a cor vem do tema.
 *
 * ── por que a altura de cada barra e deterministica ──
 * Com Math.random o desenho mudaria a cada montagem e a cada remedicao,
 * e o olho pega isso como cintilacao. O gerador abaixo e o mesmo LCG do
 * Mosaico e da Persiana: sempre o mesmo espectro, para a faixa ter uma
 * identidade estavel.
 *
 * ── o gradiente na base ──
 * As barras nascem opacas embaixo e desbotam para cima, por mascara.
 * Sem isso a faixa termina num corte reto que denuncia o retangulo; com
 * ela, o sinal parece se dissolver no ar.
 */

const BARRAS = 96;

/* Semente fixa: a faixa tem sempre o mesmo espectro. */
function alturas(n, semente = 1337) {
  const fora = [];
  let s = semente;
  for (let i = 0; i < n; i++) {
    s = (s * 1664525 + 1013904223) % 4294967296;
    const base = (s % 1000) / 1000;

    /* Duas ondas lentas somadas ao sorteio: sozinho, o aleatorio vira
       ruido uniforme e a faixa fica sem desenho. As senoides dao os
       agrupamentos altos e baixos que fazem parecer um sinal. */
    const env = 0.42
      + 0.30 * Math.sin((i / n) * Math.PI * 3.1)
      + 0.16 * Math.sin((i / n) * Math.PI * 7.7);

    fora.push(Math.max(0.06, Math.min(1, env * (0.55 + base * 0.8))));
  }
  return fora;
}

export default function Ondas({ className = '', gatilho }) {
  const raiz = useRef(null);
  const alt = alturas(BARRAS);

  useGSAP(() => {
    const el = raiz.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(el, { yPercent: 0 });
      return;
    }

    /* Sobe uma altura inteira de si mesma ao longo do trecho travado. O
       `scrub` amarra o movimento ao dedo: a faixa nao "toca", ela
       obedece — que e o que faz a imagem parecer presa por tras dela. */
    const st = ScrollTrigger.create({
      trigger: gatilho || el.parentElement,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.4,
      animation: gsap.fromTo(el,
        { yPercent: 12 },
        { yPercent: -104, ease: 'none' }),
      invalidateOnRefresh: false,
    });

    return () => st.kill();
  }, { scope: raiz });

  return (
    <div className={`ondas ${className}`} ref={raiz} aria-hidden="true">
      {alt.map((a, i) => (
        <i key={i} style={{ height: (a * 100).toFixed(1) + '%' }} />
      ))}
    </div>
  );
}
