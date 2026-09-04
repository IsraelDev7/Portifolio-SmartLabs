import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logoDesmontar } from '../lib/logoBus';
import { cobrir, descobrir, temCortina } from './SliceCurtain';

/**
 * TransitionLink — o Link do router com a coreografia da casa.
 *
 * Sequencia do clique:
 *   0,00s  o logo comeca a se desfazer E as ripas comecam a subir.
 *          Os dois JUNTOS, nao em fila: o desmonte do logo dura 0,48s e
 *          cabe inteiro dentro dos 0,77s da cobertura, entao enfileirar
 *          so somaria meio segundo de espera sem mostrar nada a mais.
 *   0,77s  tela coberta -> troca de rota, invisivel por tras da cortina
 *   0,77s  as ripas seguem subindo e descobrem a pagina nova
 *   1,03s  o logo se remonta (a barra fica acima da cortina, entao da
 *          para ver) — quem dispara e o efeito de rota do Navbar
 *
 * Continua sendo um <a href> de verdade: ctrl/cmd/meio abrem em nova
 * aba, o crawler ve o link, e com movimento reduzido nao ha cortina
 * nenhuma — navega direto.
 */
export default function TransitionLink({ to, children, ...props }) {
  const navegar = useNavigate();
  const { pathname } = useLocation();

  const aoClicar = async (e) => {
    // deixa o navegador cuidar de nova aba / nova janela
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;

    e.preventDefault();
    if (to === pathname) return;

    if (!temCortina()) {
      navegar(to);
      return;
    }

    logoDesmontar();      // de proposito sem await: roda por baixo da cortina
    await cobrir();
    navegar(to);
    await descobrir();
  };

  return (
    <Link to={to} onClick={aoClicar} {...props}>
      {children}
    </Link>
  );
}
