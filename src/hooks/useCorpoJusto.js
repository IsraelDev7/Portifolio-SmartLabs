import { useEffect } from 'react';

/**
 * useCorpoJusto — ajusta o CORPO da fonte para a linha preencher a
 * largura disponivel, em vez de fixar o corpo e torcer para caber.
 *
 * E o principio tipografico da referencia: la, "I break things",
 * "to see WHAT" e "THEY ARE MADE OF" tem 62, 72 e 50px justamente para
 * as tres medirem o mesmo. O corpo e consequencia da largura, nao o
 * contrario.
 *
 * ── por que medir em vez de calcular uma vez ──
 * A primeira versao fixava os corpos em vw, calculados na metrica da
 * Space Grotesk. Funciona enquanto a fonte esta carregada — e falha no
 * primeiro quadro, quando o navegador ainda desenha com o fallback, que
 * e mais largo. Com `white-space: nowrap` o texto nao quebra: vaza pela
 * borda. Era o corte que aparecia nas letras finais.
 *
 * Medindo, o corpo se acerta sozinho para qualquer fonte, qualquer
 * largura de tela e qualquer ajuste de tamanho de letra do sistema.
 *
 * ── por que scrollWidth e nao getBoundingClientRect ──
 * O rect ja vem somado dos transforms que as timelines de entrada
 * aplicam no heroi; mediriamos a largura ANIMADA. O scrollWidth ignora
 * transform e devolve a largura de layout, que e a que interessa.
 */

/* Corpo de prova. Alto o bastante para a razao largura/corpo ser
   precisa, e nao tao alto que o navegador precise sintetizar metricas. */
const BASE = 200;

export function useCorpoJusto(escopo, seletor, { folga = 0, ativo = true } = {}) {
  useEffect(() => {
    const raiz = escopo.current;
    if (!raiz || !ativo) return;

    const ajustar = () => {
      raiz.querySelectorAll(seletor).forEach((el) => {
        const pai = el.parentElement;
        if (!pai) return;

        /* `clientWidth` INCLUI o padding — o espaco onde o texto cabe e
           o que sobra depois de descontar os dois lados. Usar clientWidth
           cru dava um alvo 40px maior que o real, e a linha vazava pela
           borda: era o corte que aparecia nas ultimas letras. */
        const cs = getComputedStyle(pai);
        const alvo = pai.clientWidth
          - parseFloat(cs.paddingLeft || 0)
          - parseFloat(cs.paddingRight || 0)
          - folga;
        if (alvo <= 0) return;

        /* `scrollWidth` com o corpo de prova: com `white-space: nowrap` a
           linha nao quebra, entao o scrollWidth e a largura REAL do texto
           — inclusive a parte que transborda a caixa. E o unico dos tres
           (offsetWidth, rect, scrollWidth) que mede o texto e nao o bloco:
           os outros dois devolvem a largura da caixa, que e fixa, e
           compara-los com o alvo faz o corpo crescer a cada passada. */
        el.style.fontSize = BASE + 'px';
        const largura = el.scrollWidth;
        if (!largura) return;

        el.style.fontSize = ((alvo / largura) * BASE) + 'px';
      });
    };

    ajustar();

    /* Tres gatilhos, e os tres sao necessarios:
       - `fonts.ready` porque a medida do primeiro quadro e do fallback;
       - ResizeObserver para giro de tela e mudanca de layout;
       - o proprio `load` da janela para o caso de a fonte vir do cache e
         `fonts.ready` ja ter resolvido antes deste efeito rodar. */
    let vivo = true;
    document.fonts.ready.then(() => { if (vivo) ajustar(); });

    /* ── o guarda de largura ──
       Sem ele isto e um laco infinito, e travou o navegador: o hook
       escreve `font-size`, a linha muda de altura, o container muda de
       tamanho, o ResizeObserver dispara, o hook escreve de novo.

       So a LARGURA interessa — e ela vem do layout, nao do conteudo,
       entao mudar o corpo nao a altera. Comparando com a ultima medida,
       a realimentacao morre no primeiro ciclo. */
    let ultimaLargura = raiz.clientWidth;

    const obs = new ResizeObserver(() => {
      const agora = raiz.clientWidth;
      if (agora === ultimaLargura) return;
      ultimaLargura = agora;
      ajustar();
    });
    obs.observe(raiz);

    window.addEventListener('load', ajustar);

    return () => {
      vivo = false;
      obs.disconnect();
      window.removeEventListener('load', ajustar);
      /* Devolve o controle ao CSS: sem isto, o corpo calculado para o
         telefone ficaria grudado no elemento ao voltar para o desktop. */
      raiz.querySelectorAll(seletor).forEach((el) => { el.style.fontSize = ''; });
    };
  }, [escopo, seletor, folga, ativo]);
}
