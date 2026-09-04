import React from 'react';

/**
 * Letras — quebra um texto em uma <span> por caractere, para animacao
 * letra a letra.
 *
 * E o mesmo recurso da referencia (vertical.framer.media): la o tipo do
 * heroi tambem vive quebrado em spans individuais, cada uma com o seu
 * proprio transform.
 *
 * Acessibilidade: texto picado em spans faz o leitor de tela soletrar.
 * Por isso as pecas sao aria-hidden e quem carrega o texto de verdade e
 * o aria-label do container. Copiar e colar continua funcionando: as
 * spans sao inline e nao ha separador entre elas.
 */

/* Espaco nao-quebravel (U+00A0), montado por codigo de proposito: o
   caractere literal e invisivel no fonte e some no primeiro editor que
   "limpar" espacos. Espaco comum entre spans inline-block colapsa e as
   palavras se fundem. */
const ESPACO = String.fromCharCode(160);

export default function Letras({ texto, className = 'letra' }) {
  return [...texto].map((c, i) => (
    <span key={i} className={className} aria-hidden="true">
      {c === ' ' ? ESPACO : c}
    </span>
  ));
}
