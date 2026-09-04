import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    lenis.on('scroll', ScrollTrigger.update);

    // A referencia precisa ser a MESMA na entrada e na saida. Antes aqui
    // havia duas arrow functions distintas, entao o remove nao removia
    // nada: com o <StrictMode> invocando o efeito duas vezes, o callback
    // do primeiro Lenis seguia rodando a cada quadro sobre uma instancia
    // ja destruida, e as duas disputavam o scroll ate ele travar.
    const aoQuadro = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(aoQuadro);

    gsap.ticker.lagSmoothing(0);

    // Exposto para inspecao e para rolagem programatica coerente com o
    // scroll suavizado (window.scrollTo desincroniza o Lenis).
    window.__lenis = lenis;

    return () => {
      gsap.ticker.remove(aoQuadro);
      lenis.destroy();
      if (window.__lenis === lenis) delete window.__lenis;
    };
  }, []);
}
