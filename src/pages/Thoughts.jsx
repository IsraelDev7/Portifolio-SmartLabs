import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { usePageMotion } from '../hooks/usePageMotion';
import Letras from '../components/Letras';
import { Monogram } from '../components/Logo';
import { GradeRipas, animarRipas } from '../components/Persiana';

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
  {
    area: 'Psicanálise',
    cliente: '[ nome do cliente ]',
    foto: null,
    slug: 'a-estrutura-vem-antes-da-estetica',
    titulo: 'A estrutura vem antes da estética.',
    resumo:
      'Interface bonita sobre arquitetura frágil não sobrevive ao primeiro pico de volume. O que sustenta a experiência premium é o que ninguém vê.',
    imagem: '/images/ideia-estrutura.jpg',
    para: '/thoughts/a-estrutura-vem-antes-da-estetica',
  },
  {
    area: 'Fitness',
    cliente: '[ nome do cliente ]',
    foto: null,
    titulo: 'Automação não é economizar tempo. É remover dependência.',
    resumo:
      'O ganho real não está nos minutos poupados. Está em o processo continuar quando a pessoa que sempre fazia aquela etapa não está.',
    imagem: '/images/ideia-dependencia.jpg',
    para: '/work',
  },
  {
    area: 'Arquitetura',
    cliente: '[ nome do cliente ]',
    foto: null,
    titulo: 'IA não é o produto. É a camada.',
    resumo:
      'Quando a inteligência entra como produto separado, alguém precisa aprender a operá-la. Quando entra como camada, ela some dentro do fluxo que já existia.',
    imagem: '/images/ideia-camada.jpg',
    para: '/work',
  },
  {
    area: '[ quarto segmento ]',
    cliente: '[ nome do cliente ]',
    foto: null,
    titulo: 'Tráfego sem estrutura vaza.',
    resumo:
      'Investir em aquisição antes de a operação aguentar o volume é pagar para descobrir onde o sistema quebra. Aquisição e tecnologia são o mesmo projeto.',
    imagem: '/images/ideia-vazamento.jpg',
    para: '/work',
  },
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
      gsap.set(raiz.querySelectorAll('.ideias__post, .ideias__peca'), {
        y: 0, opacity: 1, clipPath: 'inset(0% 0% 0% 0%)',
      });
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
          delay: (i % 3) * 0.06,
          scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'restart none none reverse' },
        });
    });

    /* ── a entrada do cartao ──
       Os dois lados chegam em SENTIDOS OPOSTOS: o texto desce de cima, a
       imagem sobe de baixo. Cada um e revelado por uma mascara que abre
       do lado de onde veio — sem isso metade do cartao pareceria entrar
       de re. E a divergencia, nao a velocidade, que da a sensacao de
       duas camadas se encaixando. */
    gsap.utils.toArray(raiz.querySelectorAll('.ideias__linha')).forEach((linha) => {
      const lados = [
        { el: linha.querySelector('.ideias__post'), de: -1 },
        { el: linha.querySelector('.ideias__peca'), de: 1 },
      ].filter((l) => l.el);

      lados.forEach(({ el, de }) => {
        gsap.fromTo(el,
          {
            y: de * 90,
            clipPath: de < 0 ? 'inset(0% 0% 100% 0%)' : 'inset(100% 0% 0% 0%)',
            opacity: 0,
          },
          {
            y: 0,
            clipPath: 'inset(0% 0% 0% 0%)',
            opacity: 1,
            duration: 1.15,
            ease: 'power3.out',
            scrollTrigger: { trigger: linha, start: 'top 82%', toggleActions: 'restart none none reverse' },
          });
      });
    });

    /* ── a deriva dentro da janela ──
       Na referencia a foto tem 791x1040 dentro de uma janela de 609x800,
       com scale(1.3): a sobra existe para ela poder correr. Aqui a foto
       sangra 12% para fora em cima e embaixo e desliza no scroll — o que
       o olho le e a imagem indo por dentro enquanto a moldura sobe. */
    /* A mesma persiana da Work, IMPORTADA — nao copiada. Duas copias da
       mesma animacao divergem na primeira correcao feita so em uma. */
    const limpezas = gsap.utils.toArray(raiz.querySelectorAll('.ideias__figura'))
      .map((fig) => animarRipas(fig));

    gsap.utils.toArray(raiz.querySelectorAll('.ideias__figura')).forEach((fig) => {
      /* y em px medido na hora, nao yPercent. yPercent converte usando a
         altura que o GSAP tinha em cache quando o tween nasceu — e aqui
         ele nasce antes de a fonte e o layout assentarem, entao a conta
         dava 7% de zero e o transform saia `translate3d(0,0,0)`. Com
         funcao + invalidateOnRefresh o valor e relido a cada refresh,
         inclusive depois de redimensionar. */
      const curso = () => fig.offsetHeight * 0.07;

      gsap.fromTo(fig.querySelector('.ideias__foto'),
        { y: () => -curso() },
        {
          y: () => curso(),
          ease: 'none',
          scrollTrigger: {
            trigger: fig,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
    });

    return () => limpezas.forEach((f) => f());
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
                  {/* Duas camadas de proposito: a LENTE recebe a lupa do
                      hover (CSS) e a FOTO recebe a deriva do scroll
                      (GSAP). Na mesma peca, a `transition: transform` do
                      hover engolia cada escrita do GSAP e a deriva
                      nunca saia do lugar. */}
                  <div className="ideias__lente">
                    <div
                      className="ideias__foto"
                      style={{ backgroundImage: `url(${c.imagem})` }}
                      role="presentation"
                    />
                  </div>
                  <GradeRipas />
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
