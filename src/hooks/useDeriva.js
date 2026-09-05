import { useEffect } from 'react';
import gsap from 'gsap';

/**
 * useDeriva — translacao diferencial ligada ao scroll.
 *
 * Cada elemento com `data-deriva="<fator>"` anda no eixo Y a uma fracao
 * do scroll. Fator negativo sobe mais rapido que a pagina; positivo fica
 * para tras. Um elemento SEM o atributo e ancora: e a peca parada que
 * faz o olho perceber que as outras se movem.
 *
 * O que faz isso parecer fluido nao e suavizacao — e a ausencia dela. O
 * transform e funcao pura da posicao do scroll, escrito no mesmo quadro,
 * entao o movimento e 1:1 com a roda e nunca briga com o dedo do
 * usuario. Por ser funcao pura, tambem reverte sozinho: rolar de volta
 * nao desfaz nada, recalcula.
 *
 * Um unico ticker escreve todos os alvos. Trinta ScrollTriggers fariam o
 * mesmo trabalho pagando trinta vezes o overhead.
 *
 * Escreve so `y` — layout, largura e altura ficam intocados.
 */

/* Deslocamento grande em tela pequena come a viewport inteira e embrulha
   o estomago. Mesma coreografia, amplitude menor. */
function escalaDaTela() {
  const w = window.innerWidth;
  if (w <= 480) return 0.40;
  if (w <= 820) return 0.70;
  return 1;
}

export function useDeriva(escopo) {
  /* useEffect, nao useGSAP: este hook nao cria tween nenhum — so um
     quickSetter e um ticker, e os dois sao desfeitos a mao no cleanup.
     O useGSAP embrulha o callback num gsap.context() que, ao reverter,
     zera o cache de transform dos elementos por baixo dos setters. */
  useEffect(() => {
    const raiz = escopo.current;
    if (!raiz) return;

    // Movimento reduzido: nem registra o ticker. Tudo fica no lugar.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const escala = escalaDaTela();

    const alvos = gsap.utils
      .toArray(raiz.querySelectorAll('[data-deriva]'))
      .map((el) => ({
        el,
        fator: parseFloat(el.dataset.deriva) * escala,
        // quickSetter escreve pelo cache de transform do GSAP, entao a
        // deriva COMPOE com o x/xPercent que outras timelines ja aplicam
        // no mesmo elemento em vez de sobrescrever.
        por: gsap.quickSetter(el, 'y', 'px'),
        inicio: 0,
        curso: 1,
      }))
      .filter((a) => Number.isFinite(a.fator) && a.fator !== 0);

    if (!alvos.length) return;

    /* offsetTop, nao getBoundingClientRect: o rect ja vem somado dos
       transforms que outras timelines aplicaram (a entrada do hero, por
       exemplo), e mediriamos a posicao ANIMADA em vez da de layout. */
    const topoDeLayout = (el) => {
      let y = 0, n = el;
      while (n) { y += n.offsetTop; n = n.offsetParent; }
      return y;
    };

    const medir = () => {
      const vh = window.innerHeight;
      alvos.forEach((a) => {
        const topo = topoDeLayout(a.el);
        // Comeca a contar quando o elemento entra pela base. O max(0, ...)
        // e para quem ja nasce visivel: sem ele o hero comecaria a pagina
        // com uma tela inteira de deriva ja acumulada.
        a.inicio = Math.max(0, topo - vh);
        a.curso = Math.max(1, a.el.offsetHeight + vh);
      });
    };

    const escrever = () => {
      const s = window.scrollY;
      for (const a of alvos) {
        // trava nas pontas: fora da faixa o elemento nao continua vagando
        const rel = Math.min(Math.max(s - a.inicio, 0), a.curso);
        a.por(rel * a.fator);
      }
    };

    medir();
    escrever();

    /* Um unico ticker compartilhado com o resto do GSAP, em vez de um
       requestAnimationFrame por instancia do hook: o loop ja existe e
       ja roda para o Lenis, entao entrar nele custa uma entrada de
       array por quadro. */
    gsap.ticker.add(escrever);

    const aoRedimensionar = () => { medir(); escrever(); };
    window.addEventListener('resize', aoRedimensionar);

    return () => {
      gsap.ticker.remove(escrever);
      window.removeEventListener('resize', aoRedimensionar);
      alvos.forEach((a) => a.por(0));
    };
  }, [escopo]);
}
