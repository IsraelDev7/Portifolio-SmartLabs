import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
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

/* Quatro depoimentos. Nomes, fotos e falas ficam como PLACEHOLDER de
   proposito: depoimento de cliente e declaracao de terceiro, e inventar
   um — nome, rosto ou frase — e propaganda enganosa (CDC art. 37, e o
   CONAR trata review fabricada como publicidade ilicita). A estrutura
   fica pronta; o conteudo entra quando o Israel mandar o real. */
const CASOS = [
  { area: 'Psicanálise', cliente: '[ nome do cliente ]', foto: null,
    titulo: '[ o que o cliente disse sobre o trabalho ]',
    resumo: '[ duas ou tres linhas contando o problema que existia antes e o que mudou depois. ]',
    imagem: '/images/estrutura-primeiro.jpg', para: '/work' },
  { area: 'Fitness', cliente: '[ nome do cliente ]', foto: null,
    titulo: '[ o que o cliente disse sobre o trabalho ]',
    resumo: '[ duas ou tres linhas contando o problema que existia antes e o que mudou depois. ]',
    imagem: '/images/funcao-em-tudo.jpg', para: '/work' },
  { area: 'Arquitetura', cliente: '[ nome do cliente ]', foto: null,
    titulo: '[ o que o cliente disse sobre o trabalho ]',
    resumo: '[ duas ou tres linhas contando o problema que existia antes e o que mudou depois. ]',
    imagem: '/images/o-que-construo.jpg', para: '/work' },
  { area: '[ quarto segmento ]', cliente: '[ nome do cliente ]', foto: null,
    titulo: '[ o que o cliente disse sobre o trabalho ]',
    resumo: '[ duas ou tres linhas contando o problema que existia antes e o que mudou depois. ]',
    imagem: '/images/nucleo.jpg', para: '/work' },
];

export default function Thoughts() {
  const motionRef = usePageMotion();
  const alvo = useRef(null);

  useGSAP(() => {
    const raiz = alvo.current;
    const reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduz) {
      gsap.set(raiz.querySelectorAll('[data-regua]'), { scaleX: 1 });
      gsap.set(raiz.querySelectorAll('[data-sobe]'), { y: 0, opacity: 1 });
      return;
    }

    /* Cada peca tem o SEU gatilho, nao um comum: elas estao espalhadas
       por milhares de pixels, e um gatilho unico dispararia todas quando
       a primeira entrasse — as de baixo ja chegariam prontas. */
    gsap.utils.toArray(raiz.querySelectorAll('[data-regua]')).forEach((r) => {
      gsap.fromTo(r,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.1,
          ease: 'power2.inOut',
          scrollTrigger: { trigger: r, start: 'top 92%', toggleActions: 'restart none none reverse' },
        });
    });

    /* 75px de subida com desvanecimento — o valor medido no DOM da
       referencia, onde o titulo do cartao espera fora da tela em
       translateY(75) e opacidade 0. */
    gsap.utils.toArray(raiz.querySelectorAll('[data-sobe]')).forEach((el, i) => {
      gsap.fromTo(el,
        { y: 75, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'expo.out',
          delay: (i % 4) * 0.06,
          scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'restart none none reverse' },
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
            O que dizem sobre
            <br />
            o meu trabalho.
          </h2>
        </section>

        {/* ── faixa 3 · a lista ── */}
        {/* Cada post e a sua imagem sao uma LINHA de duas celulas, nao
            duas colunas paralelas. Em colunas separadas os dois lados
            tem alturas proprias e desandam: a primeira foto atravessava
            dois posts. Na linha, quem for mais alto define a altura e o
            par nunca se separa. */}
        <section className="ideias__lista">
          {CASOS.map((c) => (
            <div className="ideias__linha" key={c.area}>
              <article className="ideias__post">
                <p className="ideias__data">{c.area}</p>
                <h3 className="ideias__post-titulo" data-sobe>{c.titulo}</h3>
                <i className="ideias__barra" data-regua aria-hidden="true" />
                <p className="ideias__resumo" data-sobe>{c.resumo}</p>

                {/* a assinatura e do CLIENTE: rosto e nome de quem falou */}
                <div className="ideias__autor" data-sobe>
                  {c.foto
                    ? <img src={c.foto} alt="" width="44" height="44" />
                    : <span className="ideias__sem-foto" aria-hidden="true">
                        <Monogram color="var(--fumaca)" size={18} />
                      </span>}
                  <span>{c.cliente}</span>
                </div>
              </article>

              {/* A imagem e o BOTAO. <Link> em volta da figura inteira:
                  a area de clique tem que ser a peca que o olho ja le
                  como clicavel, nao um botaozinho ao lado dela. */}
              <Link className="ideias__peca" to={c.para} aria-label={`Ver o projeto — ${c.area}`}>
                <figure className="ideias__figura">
                  <div
                    className="ideias__foto"
                    style={{ backgroundImage: `url(${c.imagem})` }}
                    role="presentation"
                  />
                  <div className="ideias__riscos" aria-hidden="true">
                    <i /><i /><i />
                  </div>
                  <span className="ideias__chamada">
                    Ver o projeto
                    <i aria-hidden="true">▶▶</i>
                  </span>
                </figure>
              </Link>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
