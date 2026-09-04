import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * usePageMotion — motor de movimento do Smart LABS
 *
 * Anima elementos JA EXISTENTES via atributo data-anim.
 * NAO altera layout: nenhuma medida, posicao ou estilo estrutural e tocado.
 * Todo efeito age apenas sobre transform, opacity e clip-path.
 *
 * Fisica da marca (motion-system v1.0): pesado e preciso, nunca elastico.
 *   expo.out  -> entradas que assentam com peso mecanico
 *   0.9s      -> reveal
 *   0.08s     -> stagger
 *
 * Uso:  const ref = usePageMotion();  <div ref={ref}> ... </div>
 *
 * Atributos reconhecidos:
 *   data-anim="reveal"    linha sobe de dentro de mascara (P1)
 *   data-anim="words"     palavras acendem com o scroll (P4)
 *   data-anim="rise"      bloco sobe e materializa
 *   data-anim="stagger"   filhos entram em cascata
 *   data-anim="frame"     imagem: clip reveal + parallax interno (P5)
 *   data-anim="line"      regra 1px cresce da esquerda
 *   data-anim="parallax"  deriva vertical suave no scroll
 */
export function usePageMotion() {
  const scope = useRef(null);

  useGSAP(() => {
    const root = scope.current;
    if (!root) return;

    // Acessibilidade: quem pediu menos movimento recebe o conteudo pronto.
    const reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduz) {
      root.querySelectorAll('[data-anim]').forEach((el) => {
        gsap.set(el, { clearProps: 'all', opacity: 1 });
      });
      return;
    }

    const ctx = gsap.context(() => {
      /* ---------- P1 · reveal por mascara ---------- */
      root.querySelectorAll('[data-anim="reveal"]').forEach((el) => {
        // envolve o conteudo sem alterar caixa: wrapper inline com overflow
        if (!el.dataset.wrapped) {
          const inner = document.createElement('span');
          inner.className = 'pm-inner';
          inner.style.display = 'block';
          inner.style.willChange = 'transform';
          while (el.firstChild) inner.appendChild(el.firstChild);
          el.appendChild(inner);
          el.style.overflow = 'hidden';
          el.dataset.wrapped = '1';
        }
        gsap.from(el.querySelector('.pm-inner'), {
          yPercent: 108,
          duration: 0.9,
          ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        });
      });

      /* ---------- P4 · palavras acendendo no scroll ---------- */
      root.querySelectorAll('[data-anim="words"]').forEach((el) => {
        if (!el.dataset.split) {
          const texto = el.textContent.trim();
          el.textContent = '';
          texto.split(/\s+/).forEach((w) => {
            const s = document.createElement('span');
            s.className = 'pm-word';
            s.textContent = w + ' ';
            s.style.display = 'inline-block';
            s.style.whiteSpace = 'pre';
            el.appendChild(s);
          });
          el.dataset.split = '1';
        }
        gsap.fromTo(
          el.querySelectorAll('.pm-word'),
          { opacity: 0.18 },
          {
            opacity: 1,
            stagger: 0.05,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top 82%',
              end: 'bottom 55%',
              scrub: true,
            },
          }
        );
      });

      /* ---------- entrada de bloco ---------- */
      root.querySelectorAll('[data-anim="rise"]').forEach((el) => {
        gsap.from(el, {
          y: 40,
          opacity: 0,
          duration: 0.9,
          ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        });
      });

      /* ---------- cascata nos filhos ---------- */
      root.querySelectorAll('[data-anim="stagger"]').forEach((el) => {
        gsap.from(el.children, {
          y: 32,
          opacity: 0,
          duration: 0.8,
          ease: 'expo.out',
          stagger: 0.08,
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        });
      });

      /* ---------- P5 · imagem: clip reveal + parallax interno ---------- */
      root.querySelectorAll('[data-anim="frame"]').forEach((el) => {
        gsap.fromTo(
          el,
          { clipPath: 'inset(100% 0% 0% 0%)' },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 1.2,
            ease: 'expo.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          }
        );
        // deriva interna: a imagem de fundo desliza mais devagar que a pagina
        gsap.fromTo(
          el,
          { backgroundPositionY: '44%' },
          {
            backgroundPositionY: '56%',
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
          }
        );
      });

      /* ---------- regra 1px que cresce ---------- */
      root.querySelectorAll('[data-anim="line"]').forEach((el) => {
        gsap.from(el, {
          scaleX: 0,
          transformOrigin: 'left center',
          duration: 1.1,
          ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 92%', once: true },
        });
      });

      /* ---------- parallax discreto ---------- */
      root.querySelectorAll('[data-anim="parallax"]').forEach((el) => {
        const f = parseFloat(el.dataset.parallax || '8');
        gsap.fromTo(
          el,
          { yPercent: f * 0.5 },
          {
            yPercent: -f * 0.5,
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
          }
        );
      });

      ScrollTrigger.refresh();
    }, root);

    return () => ctx.revert();
  }, { scope });

  return scope;
}
