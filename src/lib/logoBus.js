/**
 * logoBus — canal minimo entre o link e o logo da barra.
 *
 * O TransitionLink precisa esperar o logo se desfazer antes de navegar,
 * e o Navbar precisa remonta-lo quando a pagina nova aparece. Um contexto
 * do React resolveria, mas obrigaria a re-renderizar a arvore inteira a
 * cada troca de rota so para carregar duas funcoes. Um singleton de
 * modulo faz o mesmo custando nada.
 *
 * Se ninguem se registrou ainda (SSR, teste, logo desmontado), as duas
 * funcoes viram no-ops resolvidas — quem chama nunca precisa checar.
 */

let alvo = null;

/** O Navbar chama isto ao montar. Devolve a funcao de baixa. */
export function registrarLogo(api) {
  alvo = api;
  return () => {
    if (alvo === api) alvo = null;
  };
}

/** Desfaz o logo em celulas. Aguardavel. */
export function logoDesmontar() {
  return Promise.resolve(alvo?.desmontar?.());
}

/** Remonta o logo, nivel a nivel. Aguardavel. */
export function logoMontar() {
  return Promise.resolve(alvo?.montar?.());
}
