import React from 'react';
import Nivel from './Nivel';

/**
 * Modulo — uma linha da lista de modulos.
 *
 * Duas colunas com pesos muito diferentes de proposito: a esquerda e
 * catalogo (codigo, titulo, nivel, indice) e a direita e prosa. E a
 * mesma divisao das paginas de um manual tecnico, que e o territorio da
 * marca — nao decoracao editorial.
 *
 * A seta nao e link: e um sinal de leitura, apontando da ficha para o
 * texto. Fica aria-hidden por isso.
 */
export default function Modulo({ codigo, titulo, indice, children }) {
  return (
    <article className="modulo">
      <div className="modulo__ficha">
        <span className="modulo__codigo">MOD —— {codigo}</span>
        <h3 className="modulo__titulo">{titulo}</h3>
        <Nivel />
        <span className="modulo__indice">//{indice}</span>
      </div>

      <span className="modulo__seta" aria-hidden="true">→</span>

      <div className="modulo__texto">{children}</div>
    </article>
  );
}
