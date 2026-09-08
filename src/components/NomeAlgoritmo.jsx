import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * NomeAlgoritmo — o nome que se resolve a partir de ruido.
 *
 * Dois comportamentos, escolhidos pelo APARELHO e nao pela largura:
 *
 *   (hover: hover)  o cursor entra e o nome embaralha em onda, da
 *                   esquerda para a direita, resolvendo letra a letra
 *   (hover: none)   nao ha cursor para passar; entao ele se DIGITA
 *                   quando entra na tela, uma letra por vez
 *
 * `(hover: hover)` no lugar de `max-width`: tablet com caneta e monitor
 * pequeno sao coisas diferentes, e quem decide se existe um cursor para
 * passar por cima e o ponteiro, nao o tamanho da tela.
 *
 * O texto final vive no dataset, nunca na leitura do DOM. Sem isso, um
 * segundo hover disparado no meio do primeiro leria o ruido corrente
 * como se fosse o nome e o congelaria ali.
 */

const CAOS = '01<>[]{}#*+=/\\ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const EMBARALHO = 0.34;   // s que cada letra passa em ruido
const ONDA = 0.035;       // s entre uma letra e a vizinha
const TECLA = 0.055;      // s por caractere na digitacao

export default function NomeAlgoritmo({ texto, className = '' }) {
  const alvo = useRef(null);

  useGSAP(() => {
    const raiz = alvo.current;
    const letras = gsap.utils.toArray(raiz.querySelectorAll('.nalg__letra'));

    letras.forEach((el) => {
      if (el.dataset.fim === undefined) el.dataset.fim = el.textContent;
    });
    const repor = () => letras.forEach((el) => {
      el.textContent = el.dataset.fim;
      el.style.visibility = '';
    });

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const temCursor = window.matchMedia('(hover: hover)').matches;

    /* ── com cursor: embaralha em onda a cada entrada ── */
    if (temCursor) {
      let tl = null;
      const rodar = () => {
        if (tl) tl.kill();
        tl = gsap.timeline();
        letras.forEach((el, i) => {
          const fim = el.dataset.fim;
          if (!fim.trim()) return;
          const passo = { p: 0 };
          tl.to(passo, {
            p: 1,
            duration: EMBARALHO,
            ease: 'none',
            onUpdate() { el.textContent = CAOS[(Math.random() * CAOS.length) | 0]; },
            onComplete() { el.textContent = fim; },
          }, i * ONDA);
        });
      };
      raiz.addEventListener('pointerenter', rodar);
      return () => { if (tl) tl.kill(); raiz.removeEventListener('pointerenter', rodar); repor(); };
    }

    /* ── sem cursor: digita ao entrar na tela ──
       visibility, nao display: a letra oculta continua ocupando o espaco
       dela, entao a linha nao remonta a cada caractere e o texto nao
       "pula" enquanto e digitado. */
    letras.forEach((el) => { el.style.visibility = 'hidden'; });

    const st = ScrollTrigger.create({
      trigger: raiz,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        letras.forEach((el, i) => {
          gsap.delayedCall(i * TECLA, () => { el.style.visibility = 'visible'; });
        });
      },
    });

    return () => { st.kill(); repor(); };
  }, { scope: alvo });

  return (
    <span ref={alvo} className={`nalg ${className}`} aria-label={texto}>
      {[...texto].map((c, i) => (
        <span key={i} className="nalg__letra" aria-hidden="true">
          {c === ' ' ? String.fromCharCode(160) : c}
        </span>
      ))}
    </span>
  );
}
