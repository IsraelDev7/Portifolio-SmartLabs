import React from 'react';
import { usePageMotion } from '../hooks/usePageMotion';
import Sobre from '../sections/Sobre';

/**
 * About — a rota. O conteudo vive em <Sobre>, que a home tambem usa.
 * Aqui so entram o escopo de animacao e a variante de pagina.
 */
export default function About() {
  const motionRef = usePageMotion();

  return (
    <div ref={motionRef}>
      <Sobre variante="pagina" />
    </div>
  );
}
