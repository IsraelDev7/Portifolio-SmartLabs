import React from 'react';
import { Link } from 'react-router-dom';
import { usePageMotion } from '../hooks/usePageMotion';
import NomeAlgoritmo from '../components/NomeAlgoritmo';

/**
 * 404 — reconstrucao da pagina da referencia, medida no DOM em 1280x800:
 *
 *   fundo  "4 0 4 0" ladrilhado em 409px, na cor do fundo escurecida
 *   cartao "Wannabe 200" 64px · "Eternally" 64px + "404" em cinza claro
 *          frase de 24px com 462px de medida · botao "Take me home"
 *
 * O papel de parede e o mesmo caractere repetido em corpo absurdo, quase
 * fundido ao fundo: e ele que faz a pagina de erro parecer proposital, e
 * nao um vazio. Aqui os digitos sao Grafite sobre Aco — dez pontos de
 * luminancia, o bastante para existir sem competir com o cartao.
 *
 * A grade e gerada, nao escrita a mao: 4 linhas de 8 digitos e o que
 * cobre 1280x800 com folga para a deriva.
 */

const LINHAS = 4;
const POR_LINHA = 8;

export default function NaoEncontrado() {
  const motionRef = usePageMotion();

  return (
    <div ref={motionRef} className="erro">
      <div className="erro__parede" aria-hidden="true">
        {Array.from({ length: LINHAS }, (_, l) => (
          <div className="erro__fila" key={l} data-deriva={l % 2 ? '-0.05' : '0.05'}>
            {Array.from({ length: POR_LINHA }, (_, i) => (
              <span key={i}>{i % 2 ? '0' : '4'}</span>
            ))}
          </div>
        ))}
      </div>

      <div className="erro__cartao">
        <p className="erro__linha-um">Queria ser 200.</p>
        <p className="erro__linha-dois">
          Eternamente <em><NomeAlgoritmo texto="404" /></em>
        </p>
        <p className="erro__prosa">
          Você chegou a uma página que nunca aprendeu a existir.
        </p>
        <Link className="erro__botao" to="/">
          Me leva pra casa
          <i aria-hidden="true">▶▶</i>
        </Link>
      </div>
    </div>
  );
}
