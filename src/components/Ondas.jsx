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

/* Semente fixa: a faixa tem sempre o mesmo espectro. Com Math.random o
   desenho mudaria a cada remedicao e o olho pega isso como cintilacao. */
function alturas(n, semente = 1337) {
  let s = semente;
  const rnd = () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };

  /* ── 1 · ruido bruto ──
     Ponto de partida. Sozinho ele e chuvisco: cada barra ignora a
     vizinha e a faixa vira uma escova de altura uniforme, sem desenho. */
  const bruto = Array.from({ length: n }, () => rnd());

  /* ── 2 · suavizacao ──
     Media movel de tres. E ela que da CONTINUIDADE — cada barra passa a
     saber onde a vizinha esta, e o topo da faixa vira uma linha que se
     pode seguir com o olho, em vez de pontos soltos. Sem este passo nao
     ha contorno de sinal, so ruido. */
  const suave = bruto.map((_, i) => {
    const a = bruto[(i - 1 + n) % n];
    const b = bruto[i];
    const c = bruto[(i + 1) % n];
    return (a + b * 2 + c) / 4;
  });

  const fora = [];
  for (let i = 0; i < n; i++) {
    const t = i / n;

    /* ── 3 · o envelope ──
       Duas ondas de periodos primos entre si: elas nunca repetem o mesmo
       par de fases dentro da faixa, entao a forma geral nao parece um
       padrao ciclico.

       O peso delas e BAIXO de proposito. Com 0.20 e 0.13 o envelope
       mandava no desenho e a faixa ganhava platos longos — quinze barras
       altas seguidas, depois quinze baixas. Um sinal nao tem platos:
       tem eventos. Reduzido, o envelope so inclina o terreno e quem
       desenha o contorno e o ruido. */
    const env = 0.22
      + 0.11 * Math.sin(t * Math.PI * 4.3)
      + 0.09 * Math.sin(t * Math.PI * 9.7 + 1.7);

    /* ── 4 · os picos ──
       O que faz o desenho ler como SINAL e a excecao: uma barra em cada
       nove sobe muito acima das vizinhas. Sem eles o contorno e apenas
       ondulado; com eles, tem eventos.

       O pico e estreito de proposito — uma barra, nao tres. Alargado,
       viraria outro morro do envelope em vez de um transiente. */
    const sorte = rnd();
    const pico = sorte > 0.86 ? 0.26 + rnd() * 0.32 : 0;

    /* ── 5 · o vale ──
       O oposto: barras que quase encostam no chao. Sao elas que dao a
       AMPLITUDE — um sinal que so varia entre 40% e 90% le como textura,
       nao como leitura. Medido: com -0.20 o vale mais fundo parava em
       30% da altura e o desenho ficava achatado no terco de baixo. */
    const vale = sorte < 0.18 ? -0.28 : 0;

    /* 0.72 contra os 0.46 de antes: e o ruido suavizado que passa a
       mandar na altura de cada barra. E ele que tem a frequencia certa —
       muda a cada barra ou duas, como o contorno desenhado. */
    const h = env + suave[i] * 0.72 + pico + vale;
    fora.push(Math.max(0.04, Math.min(1, h)));
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
      /* Sobe ATE a posicao ancorada, nao a partir dela. O CSS prende a
         faixa na base da coluna; a animacao a traz de 30% mais baixo ate
         esse lugar.

         O sentido importa e estava invertido: indo de 0 para -30, ela
         SAIA da base — subia para fora e deixava justamente a faixa do
         rodape descoberta, com o texto de fecho pousando no vazio. Agora
         a base so ganha cobertura conforme se rola, e no fim do percurso
         a faixa esta exatamente onde o CSS a ancorou. */
      animation: gsap.fromTo(el,
        { yPercent: 30 },
        { yPercent: 0, ease: 'none' }),
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
