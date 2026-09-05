import React, { useRef } from 'react';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(Flip, ScrollTrigger);

/**
 * Fichario — as fichas se rearranjam de um layout para outro com o scroll.
 *
 * Portado do ScrollBasedLayoutAnimations (Codrops), acervo Vance
 * "Scroll Animation #21". A mecanica nao e uma animacao no sentido
 * comum: sao DOIS layouts declarados em CSS e o scroll interpolando
 * entre eles. Em quatro passos:
 *
 *   1. poe a classe --troca no container, o CSS re-diagrama tudo
 *   2. Flip.getState() fotografa esse estado final
 *   3. tira a classe, volta ao layout inicial
 *   4. Flip.to(...) com scrub percorre a distancia entre os dois
 *
 * O que isso compra: nenhuma coordenada em JavaScript. A variacao toda
 * vive no CSS — cada bloco muda de comportamento trocando duas regras de
 * grid, sem tocar aqui.
 *
 * scale:false de proposito. Com scale:true o Flip morfa o tamanho por
 * scaleX/scaleY, o que estica a tipografia — serve para foto, nao para
 * ficha de texto. Em false ele anima largura e altura de verdade e as
 * letras mantem o corpo certo.
 *
 * Em tela estreita nao ha pin nem Flip: pin em celular briga com a barra
 * de endereco que aparece e some, e ela recalcula a altura no meio da
 * animacao. Abaixo de 820px as fichas so entram, sem rearranjo.
 */
export default function Fichario({
  variante,
  curso = '+=300%',
  stagger = 0,
  absoluto = false,
  children,
}) {
  const alvo = useRef(null);

  useGSAP(() => {
    const el = alvo.current;
    if (!el) return;

    const reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const estreito = window.matchMedia('(max-width: 820px)').matches;
    if (reduz || estreito) return;

    const fichas = el.querySelectorAll('.fichario__ficha');
    const legenda = el.querySelector('.fichario__legenda');
    if (!fichas.length) return;

    let vivo = true;
    let gatilho = null;

    /* Monta so quando o layout parou de mudar.
       O demo original faz isso esperando o preload das imagens; aqui o
       que move o chao sao as fontes e os OUTROS pins da pagina, que
       nascem no mesmo quadro e mudam a altura total. Montar junto fazia
       o ScrollTrigger fixar start/end sobre um layout que morreu logo em
       seguida — e o gatilho ja nascia com progresso 1, cravando as
       fichas no estado final. */
    const montar = () => {
      if (!vivo) return;

      // 1-2-3: mede o destino, volta para a origem
      el.classList.add('fichario--troca');
      const estado = Flip.getState([fichas, legenda].filter(Boolean), {
        props: 'filter,opacity,borderColor',
      });
      el.classList.remove('fichario--troca');

      // 4: o scroll percorre a distancia entre os dois layouts
      const tl = Flip.to(estado, {
        ease: 'none',
        absolute: absoluto,
        scale: false,
        simple: true,
        stagger,
        scrollTrigger: {
          trigger: el,
          start: 'center center',
          end: curso,
          pin: el.parentNode,
          scrub: true,
          anticipatePin: 1,
        },
      });
      gatilho = tl.scrollTrigger;
      ScrollTrigger.refresh();
    };

    const pronto = document.fonts ? document.fonts.ready : Promise.resolve();
    pronto.then(() => requestAnimationFrame(() => requestAnimationFrame(montar)));

    return () => { vivo = false; if (gatilho) gatilho.kill(); };
  }, { scope: alvo });

  return (
    <div className="fichario-caixa">
      <div ref={alvo} className={`fichario fichario--${variante}`}>
        {children}
      </div>
    </div>
  );
}

/** Uma ficha: rotulo mono em cima, titulo em display, corpo opcional. */
export function Ficha({ rotulo, titulo, children }) {
  return (
    <div className="fichario__ficha">
      {rotulo && <span className="fichario__rotulo">{rotulo}</span>}
      <span className="fichario__titulo">{titulo}</span>
      {children && <span className="fichario__corpo">{children}</span>}
    </div>
  );
}

/** A legenda viaja junto com as fichas — ela tambem entra no Flip. */
export function Legenda({ rotulo, children, fecho }) {
  return (
    <div className="fichario__legenda">
      <span className="fichario__rotulo">{rotulo}</span>
      <h2 className="fichario__manchete">{children}</h2>
      {fecho && <p className="fichario__fecho">{fecho}</p>}
    </div>
  );
}
