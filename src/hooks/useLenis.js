import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useLenis() {
  useEffect(() => {
    /* Recarregar no meio da pagina devolvia o leitor a um ponto medido
       sobre um layout que ainda nao existe: as fontes nao chegaram, os
       pins nao mediram e o Lenis nasce achando que esta em zero. Pior:
       todo gatilho de scroll dessa altura ja nasce ULTRAPASSADO, entao a
       animacao da secao dispara sozinha no primeiro quadro, antes de
       alguem estar olhando — e ao chegar la so resta o estado final.
       Recomecar do topo e o unico estado em que as medidas batem. */
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);

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

    /* lagSmoothing(0) — o conselho padrao para Lenis — desliga a defesa
       do GSAP contra quadro longo. Sem ela, um unico intervalo grande
       (aba em segundo plano, carregamento engasgado, DevTools abrindo) e
       lido como tempo real decorrido, e QUALQUER linha do tempo salta
       direto para o fim: a animacao nao roda, ela ja aconteceu.
       1000ms e alto demais para o scroll normal alcancar, e baixo o
       bastante para pegar exatamente esses casos patologicos. */
    gsap.ticker.lagSmoothing(1000, 16);

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
