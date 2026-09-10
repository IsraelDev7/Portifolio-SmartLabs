import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Nivel from './Nivel';

gsap.registerPlugin(ScrollTrigger);

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
 *
 * ── a coreografia ──
 * Cada modulo tem a SUA linha do tempo e o SEU gatilho. Um gatilho unico
 * para a lista faria os seis entrarem quando o primeiro cruzasse a
 * borda, e os cinco de baixo chegariam prontos.
 *
 * A ordem le como uma ficha sendo preenchida: primeiro o codigo e o
 * titulo, depois o Nivel medindo degrau a degrau, o indice, a barra
 * sendo tracada de cima para baixo, e so entao a prosa.
 */

const PASSO = 0.06;

export default function Modulo({ codigo, titulo, indice, destaque, tags, children }) {
  const raiz = useRef(null);

  useGSAP(() => {
    const r = raiz.current;
    const q = (sel) => r.querySelector(sel);
    const todos = (sel) => gsap.utils.toArray(r.querySelectorAll(sel));

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(r.querySelectorAll('.modulo__codigo, .modulo__titulo, .modulo__indice, .modulo__destaque, .modulo__corpo, .modulo__tags, .modulo__seta'), { opacity: 1, y: 0 });
      gsap.set(r.querySelectorAll('.nivel__barra'), { scaleX: 1 });
      gsap.set(q('.modulo__barra'), { scaleY: 1 });
      return;
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: r,
        start: 'top 84%',
        /* `restart`, e nao `play`: play num tempo ja completo nao faz
           nada, e a linha so voltaria a animar se o leitor subisse acima
           do gatilho. Com restart, toda descida refaz a entrada — que e
           o "sempre que passar por ela". */
        toggleActions: 'restart none none reverse',
      },
    });

    tl.from([q('.modulo__codigo'), q('.modulo__titulo')], {
      y: 22, opacity: 0, duration: 0.55, stagger: PASSO, ease: 'expo.out',
    }, 0);

    /* O Nivel mede degrau a degrau, do curto ao alto — a mesma leitura
       do simbolo da marca no rodape da Assinatura.

       `scaleX` e nao scaleY: as barras sao horizontais (14x2px, a acesa
       com 24). Em scaleY elas nao teriam para onde crescer.

       `from: 'end'` porque a acesa e a PRIMEIRA no DOM: comecando pelo
       fim, a medicao sobe do degrau curto ao alto em vez de descer. */
    tl.from(todos('.nivel__barra'), {
      scaleX: 0, duration: 0.34, ease: 'power3.out',
      stagger: { each: 0.09, from: 'end' },
    }, PASSO * 2);

    tl.from([q('.modulo__indice'), q('.modulo__seta')], {
      opacity: 0, duration: 0.4, stagger: PASSO, ease: 'none',
    }, PASSO * 3);

    /* A barra e tracada de cima para baixo, e por isso deixou de ser
       `border-left`: borda de CSS existe inteira ou nao existe, e para
       desenhar e preciso escalar a partir de uma origem. */
    tl.from(q('.modulo__barra'), {
      scaleY: 0, duration: 0.6, ease: 'power2.inOut',
    }, PASSO * 2.5);

    tl.from([q('.modulo__destaque'), q('.modulo__corpo'), q('.modulo__tags')].filter(Boolean), {
      y: 18, opacity: 0, duration: 0.6, stagger: PASSO * 1.4, ease: 'expo.out',
    }, PASSO * 4);
  }, { scope: raiz });

  return (
    <article className="modulo" ref={raiz}>
      <div className="modulo__ficha">
        <span className="modulo__codigo">MOD —— {codigo}</span>
        <h3 className="modulo__titulo">{titulo}</h3>
        <Nivel />
        <span className="modulo__indice">//{indice}</span>
      </div>

      <span className="modulo__seta" aria-hidden="true">→</span>

      <div className="modulo__texto">
        {/* A barra virou elemento para poder ser tracada. Como o
            `border-left` que ela substitui, ela nao entra na leitura. */}
        <i className="modulo__barra" aria-hidden="true" />
        <p className="modulo__destaque">{destaque}</p>
        <p className="modulo__corpo">{children}</p>
        {tags && <p className="modulo__tags">{tags}</p>}
      </div>
    </article>
  );
}
