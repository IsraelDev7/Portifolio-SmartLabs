import React from 'react';
import { flushSync } from 'react-dom';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logoDesmontar } from '../lib/logoBus';

/**
 * TransitionLink — o Link do router com a coreografia da casa.
 *
 * Segura a navegacao ate o logo terminar de se desfazer e so entao troca
 * de rota, pedindo a cortina diagonal ao navegador.
 *
 * Por que chamar startViewTransition na mao, e nao usar a prop
 * `viewTransition` do react-router: aquela prop so funciona no data
 * router (createBrowserRouter + RouterProvider). O App usa o
 * <BrowserRouter> classico, onde ela e um no-op SILENCIOSO — nao avisa,
 * nao quebra, so nao anima. Migrar o roteamento inteiro para arrumar uma
 * transicao seria caro; chamar a API direto custa quatro linhas.
 *
 * O flushSync e obrigatorio: a API tira a foto do "depois" assim que o
 * callback retorna, e sem ele o React ainda nao teria comitado a rota
 * nova — a transicao animaria a pagina antiga contra ela mesma.
 *
 * Continua sendo um <a href> de verdade: ctrl/cmd/meio abrem em nova aba,
 * o crawler ve o link, e navegador sem a API navega direto.
 */
export default function TransitionLink({ to, children, ...props }) {
  const navegar = useNavigate();
  const { pathname } = useLocation();

  const aoClicar = async (e) => {
    // deixa o navegador cuidar de nova aba / nova janela
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;

    e.preventDefault();
    if (to === pathname) return;

    await logoDesmontar();

    if (!document.startViewTransition) {
      navegar(to);
      return;
    }

    document.startViewTransition(() => {
      flushSync(() => navegar(to));
    });
  };

  return (
    <Link to={to} onClick={aoClicar} {...props}>
      {children}
    </Link>
  );
}
