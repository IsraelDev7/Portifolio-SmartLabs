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
 * A prosa tem tres niveis, e a hierarquia esta no TAMANHO, nao na cor:
 *
 *   destaque  a frase que carrega o argumento, em corpo maior
 *   corpo     a explicacao, em corpo normal
 *   tags      as palavras-chave, em mono e menor
 *
 * A barra em Solda a esquerda do texto amarra a coluna: sem ela a prosa
 * flutua longe da ficha e as duas metades da linha parecem dois
 * assuntos. E o mesmo recurso da barra do autor no heroi.
 *
 * A seta nao e link: e sinal de leitura, apontando da ficha para o
 * texto. Por isso fica aria-hidden.
 */
export default function Modulo({ codigo, titulo, indice, destaque, tags, children }) {
  return (
    <article className="modulo">
      <div className="modulo__ficha">
        <span className="modulo__codigo">MOD —— {codigo}</span>
        <h3 className="modulo__titulo">{titulo}</h3>
        <Nivel />
        <span className="modulo__indice">//{indice}</span>
      </div>

      <span className="modulo__seta" aria-hidden="true">→</span>

      <div className="modulo__texto">
        <p className="modulo__destaque">{destaque}</p>
        <p className="modulo__corpo">{children}</p>
        {tags && <p className="modulo__tags">{tags}</p>}
      </div>
    </article>
  );
}
