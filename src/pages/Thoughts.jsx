import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePageMotion } from '../hooks/usePageMotion';
import Letras from '../components/Letras';
import { Monogram } from '../components/Logo';

gsap.registerPlugin(ScrollTrigger);

/**
 * Thoughts — reconstruida sobre a pagina de artigos da referencia
 * (vertical.framer.media/thoughts), medida no DOM em 1280x800:
 *
 *   faixa 1  titulo em 241px, tracking -0.08em, e a linha em mono de
 *            12px com a regua longa correndo para a direita
 *   faixa 2  painel de 300px de altura, declaracao em 90px (-0.06em)
 *   faixa 3  lista 657 | imagens 609 — os mesmos 52/48 do resto do site
 *            data 16px · titulo 64px com entrelinha 1.0 · regua grossa
 *            sob o titulo · resumo · avatar + assinatura
 *
 * La as faixas alternam claro/escuro/claro. Aqui alternam Aco / Grafite /
 * Aco: o mesmo ritmo de bandas, dentro do territorio da marca.
 *
 * Os RISCOS sobre cada imagem sao fios de 1px em Cal a 8%, tres por
 * peca, em posicoes diferentes. Vem da referencia e servem para a foto
 * nao ficar como um retangulo colado — sao a mesma familia dos fios da
 * Cisao e do pente do rodape.
 */

const POSTS = [
  {
    data: '12 de agosto de 2026',
    titulo: 'A estrutura vem antes da estética.',
    resumo:
      'Interface bonita sobre arquitetura frágil não sobrevive ao primeiro pico de volume. O que sustenta a experiência premium é o que ninguém vê.',
    imagem: '/images/estrutura-primeiro.jpg',
  },
  {
    data: '03 de julho de 2026',
    titulo: 'Automação não é economizar tempo. É remover dependência.',
    resumo:
      'O ganho real não está nos minutos poupados. Está em o processo continuar quando a pessoa que sempre fazia aquela etapa não está.',
    imagem: '/images/funcao-em-tudo.jpg',
  },
  {
    data: '21 de maio de 2026',
    titulo: 'IA não é o produto. É a camada.',
    resumo:
      'Quando a inteligência entra como produto separado, alguém precisa aprender a operá-la. Quando entra como camada, ela some dentro do fluxo que já existia.',
    imagem: '/images/nucleo.jpg',
  },
];

export default function Thoughts() {
  const motionRef = usePageMotion();
  const alvo = useRef(null);

  useGSAP(() => {
    const reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const reguas = gsap.utils.toArray(alvo.current.querySelectorAll('[data-regua]'));

    if (reduz) {
      gsap.set(reguas, { scaleX: 1 });
      return;
    }

    /* Cada regua tem o SEU gatilho, nao um comum: elas estao espalhadas
       por 3000px de pagina, e um gatilho unico dispararia todas quando a
       primeira entrasse — as de baixo ja chegariam desenhadas. */
    reguas.forEach((r) => {
      gsap.fromTo(r,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.1,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: r,
            start: 'top 92%',
            toggleActions: 'restart none none reverse',
          },
        });
    });
  }, { scope: alvo });

  return (
    <div ref={motionRef}>
      <div className="ideias" ref={alvo}>
        {/* ── faixa 1 · o titulo em corpo maximo ── */}
        <header className="ideias__capa">
          <h1 className="ideias__titulo" aria-label="Thoughts">
            <Letras texto="THOUGHTS" />
          </h1>

          <div className="ideias__selo">
            <Monogram className="ideias__marca" color="var(--cal)" size={16} />
            <span>O caderno da SmartLABS</span>
            <i data-regua aria-hidden="true" />
          </div>
        </header>

        {/* ── faixa 2 · a declaracao ── */}
        <section className="ideias__faixa">
          <h2 className="ideias__declaracao">
            O arquivo do que eu penso
            <br />
            enquanto construo.
          </h2>
        </section>

        {/* ── faixa 3 · a lista ── */}
        {/* Cada post e a sua imagem sao uma LINHA de duas celulas, nao
            duas colunas paralelas. Em colunas separadas os dois lados
            tem alturas proprias e desandam: a primeira foto atravessava
            dois posts. Na linha, quem for mais alto define a altura e o
            par nunca se separa. */}
        <section className="ideias__lista">
          {POSTS.map((p) => (
            <div className="ideias__linha" key={p.titulo}>
              <article className="ideias__post">
                <p className="ideias__data">{p.data}</p>
                <h3 className="ideias__post-titulo">{p.titulo}</h3>
                <i className="ideias__barra" data-regua aria-hidden="true" />
                <p className="ideias__resumo">{p.resumo}</p>
                <div className="ideias__autor">
                  <img src="/images/avatar.jpg" alt="" width="44" height="44" />
                  <span>Por Israel Passos</span>
                </div>
              </article>

              <figure className="ideias__figura">
                <div
                  className="ideias__foto"
                  style={{ backgroundImage: `url(${p.imagem})` }}
                  role="presentation"
                />
                {/* os riscos: tres fios em posicoes diferentes por peca */}
                <div className="ideias__riscos" aria-hidden="true">
                  <i /><i /><i />
                </div>
              </figure>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
