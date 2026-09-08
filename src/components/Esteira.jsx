import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

/**
 * Esteira — a faixa de termos que corre sem comeco nem fim.
 *
 * A lista de itens e renderizada DUAS vezes, lado a lado, e a tira
 * inteira e arrastada para a esquerda exatamente a largura de uma copia.
 * Quando chega la, volta a zero — e como a segunda copia esta no lugar
 * exato onde a primeira estava, o salto e invisivel. E o unico jeito de
 * um loop parecer continuo sem calcular posicao item a item.
 *
 * A duplicata leva `aria-hidden`: para quem le a tela, a cadeia e dita
 * uma vez. Um leitor anunciando "Pessoas Negocios Tecnologia Sistemas
 * SmartLABS Pessoas Negocios Tecnologia..." transformaria um recurso
 * visual em ruido.
 *
 * ── por que a velocidade e por PIXEL, e nao por duracao ──
 * Uma duracao fixa faria a faixa correr mais rapido em tela larga (mais
 * pixels no mesmo tempo) e mais devagar em tela estreita. Aqui a
 * duracao e derivada da largura medida, entao a velocidade aparente e a
 * mesma em qualquer tela — que e o que faz a esteira parecer um
 * mecanismo, e nao uma animacao que se adapta.
 */

/* px por segundo. Devagar de proposito: a esteira e leitura, nao
   efeito. Acima de ~60 o olho perde a palavra antes de termina-la. */
const VELOCIDADE = 38;

export default function Esteira({ itens, separador = '/', className = '' }) {
  const raiz = useRef(null);
  const tira = useRef(null);

  useGSAP(() => {
    const t = tira.current;
    if (!t) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let tween = null;

    const montar = () => {
      if (tween) tween.kill();
      gsap.set(t, { x: 0 });

      /* Metade da largura total = a largura de UMA copia. Medir a copia
         diretamente daria o mesmo numero, mas quebraria no dia em que a
         margem entre as copias mudasse: aqui a conta inclui, por
         construcao, tudo que separa uma da outra. */
      const percurso = t.scrollWidth / 2;
      if (percurso < 1) return;

      tween = gsap.to(t, {
        x: -percurso,
        duration: percurso / VELOCIDADE,
        ease: 'none',
        repeat: -1,
      });
    };

    montar();

    /* Remede quando a fonte assenta ou a tela gira: a largura da copia
       muda, e um percurso desatualizado deixa um buraco visivel no
       ponto de retorno. */
    const obs = new ResizeObserver(montar);
    obs.observe(t);

    return () => { obs.disconnect(); if (tween) tween.kill(); };
  }, { scope: raiz });

  const copia = (chave, oculta) => (
    <span className="esteira__copia" key={chave} aria-hidden={oculta || undefined}>
      {itens.map((it, i) => (
        <span className="esteira__item" key={i}>
          <span className="esteira__termo">{it}</span>
          <i className="esteira__sep" aria-hidden="true">{separador}</i>
        </span>
      ))}
    </span>
  );

  return (
    <div className={`esteira ${className}`} ref={raiz}>
      <div className="esteira__tira" ref={tira}>
        {copia('a', false)}
        {copia('b', true)}
      </div>
    </div>
  );
}
