import React from 'react';

/**
 * Nivel — indicador de tres barras que pulsa, como um medidor.
 *
 * A barra acesa e sempre a de cima e sempre em Solda: e a mesma regra do
 * monograma da marca, onde o degrau mais alto e o acento. Aqui ela ganha
 * o pulso — o que esta em curso, nao o que ja passou.
 *
 * `aria-hidden` porque e ornamento: quem carrega a informacao e o numero
 * do modulo ao lado, que o leitor de tela anuncia normalmente.
 */
export default function Nivel({ className = '' }) {
  return (
    <span className={`nivel ${className}`} aria-hidden="true">
      <i className="nivel__barra nivel__barra--ativa" />
      <i className="nivel__barra" />
      <i className="nivel__barra" />
    </span>
  );
}
