import { useEffect, useRef } from 'react';

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

/**
 * `ativo` aceita booleano OU funcao.
 *
 * Com funcao, a condicao e reavaliada a CADA ajuste — inclusive nos
 * disparos do ResizeObserver aqui dentro. Foi o que resolveu o titulo
 * "MAIS IDEIAS": a versao anterior guardava a faixa num estado do React
 * alimentado por `matchMedia('change')`, e ao mudar a largura da janela
 * sem recarregar o evento nao chegava ao listener. O corpo calculado
 * para a faixa antiga ficava grudado, e como o hook escreve inline com
 * prioridade, nenhuma regra da folha conseguia corrigir.
 *
 * O ResizeObserver abaixo ja observa exatamente a mudanca que importa.
 * Perguntar a ele e mais curto e mais confiavel que espelhar a mesma
 * informacao num estado paralelo.
 *
 * Quando a funcao devolve falso, o corpo inline e REMOVIDO — o controle
 * volta para o CSS em vez de congelar no ultimo valor calculado.
 */
export function useCorpoJusto(escopo, seletor, { folga = 0, ativo = true } = {}) {
  /* ── por que a funcao vai por ref ──
     `ativo` entra nas dependencias do efeito. Uma funcao declarada no
     JSX do chamador tem identidade nova a cada render, entao ela
     derrubaria e remontaria o efeito — com o ResizeObserver — em todo
     render. A ref guarda sempre a versao mais recente sem participar da
     comparacao de dependencias.

     Booleano continua na lista: ali a identidade E o valor, e mudar de
     faixa PRECISA reconstruir o efeito. */
  const ativoRef = useRef(ativo);
  ativoRef.current = ativo;

  const ehFuncao = typeof ativo === 'function';

  useEffect(() => {
    const raiz = escopo.current;
    const ligado = () => {
      const a = ativoRef.current;
      return typeof a === 'function' ? a() : a;
    };
    if (!raiz || (!ehFuncao && !ativo)) return;

    const ajustar = () => {
      const on = ligado();
      raiz.querySelectorAll(seletor).forEach((el) => {
        if (!on) { el.style.removeProperty('font-size'); return; }
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
        /* `setProperty` com prioridade, e nao `style.fontSize`: a folha
           tem regras marcadas para titulos no telefone
           (`.page-home section h2 { font-size: ... !important }`), e uma
           declaracao marcada vence o estilo inline sem prioridade. Sem o
           terceiro argumento a medicao acontecia e era descartada — o
           corpo voltava para o valor da folha. */
        el.style.setProperty('font-size', BASE + 'px', 'important');
        const largura = el.scrollWidth;
        if (!largura) return;

        el.style.setProperty('font-size', ((alvo / largura) * BASE) + 'px', 'important');
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
      raiz.querySelectorAll(seletor).forEach((el) => { el.style.removeProperty('font-size'); });
    };
    /* `ehFuncao` no lugar de `ativo` quando ele e funcao: ver a nota
     da ref acima. */
  }, [escopo, seletor, folga, ehFuncao ? true : ativo, ehFuncao]);
}
