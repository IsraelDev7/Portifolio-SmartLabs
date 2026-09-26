import { useLayoutEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * useTopoNaRota — toda troca de pagina comeca do comeco.
 *
 * ── o que estava acontecendo ──
 * O `useLenis` rola para o topo, mas com dependencia `[]`: isso roda uma
 * vez, na montagem. Numa aplicacao de pagina unica a montagem acontece
 * no primeiro carregamento e nunca mais — trocar de rota so troca o que
 * o <Routes> devolve, e o scroll fica exatamente onde estava. Quem saia
 * do pe de uma obra de 13.000px e clicava em outra caia no MEIO da
 * pagina nova.
 *
 * ── por que `useLayoutEffect` e nao `useEffect` ──
 * Para o salto nao aparecer. Efeito de layout roda antes da pintura,
 * entao o navegador nunca chega a desenhar a pagina nova na altura
 * velha. Com `useEffect` daria um quadro de conteudo errado.
 *
 * ── por que ele mora no PAI e nao ao lado do <Routes> ──
 * Ordem de efeitos: os filhos rodam antes do pai. Os ScrollTriggers da
 * pagina nova nascem nos efeitos dela (o `useGSAP` tambem e efeito de
 * layout), entao quando este hook roda eles JA EXISTEM — e existem
 * medidos contra a altura velha. E por isso que o `refresh()` no fim
 * nao e opcional: sem ele, cada gatilho da pagina nova guarda um ponto
 * de partida calculado sobre um scroll que nao existe mais, e as
 * animacoes disparam na hora errada ou ja nascem no estado final.
 *
 * ── por que mexer no Lenis, e nao so no scroll nativo ──
 * O Lenis mantem a POSICAO DELE por fora. Zerar so o elemento deixaria
 * os dois em desacordo, e no primeiro quadro seguinte ele devolveria a
 * pagina para onde achava que estava.
 */
export function useTopoNaRota() {
  const { pathname } = useLocation();
  const primeira = useRef(true);

  useLayoutEffect(() => {
    /* A montagem ja e tratada no useLenis, com o cuidado extra do
       `scrollRestoration`. Repetir aqui so duplicaria trabalho. */
    if (primeira.current) {
      primeira.current = false;
      return;
    }

    const lenis = window.__lenis;
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true });

    /* Cinto e suspensorio: se o Lenis ainda nao subiu (movimento
       reduzido, ou o efeito dele desmontado), o scroll nativo responde. */
    const alvo = document.scrollingElement || document.documentElement;
    alvo.scrollTop = 0;
    window.scrollTo(0, 0);

    ScrollTrigger.refresh();

    /* Um segundo refresh no quadro seguinte. As imagens da pagina nova
       ainda nao tem altura no momento do efeito de layout, e cada uma
       que chega depois empurra tudo que vem abaixo — sem esta segunda
       medida, os gatilhos do pe da pagina ficam deslocados pela soma das
       alturas que faltavam. */
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [pathname]);
}

/* gsap importado para registrar o plugin no mesmo lugar em que ele e
   usado — o registro e idempotente. */
gsap.registerPlugin(ScrollTrigger);
