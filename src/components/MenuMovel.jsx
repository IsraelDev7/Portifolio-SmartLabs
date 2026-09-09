import React, { useRef, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import TransitionLink from './TransitionLink';

/**
 * MenuMovel — o painel de navegacao, sobre a leitura da referencia.
 *
 * Medido no DOM da vertical.framer.media em 414x896: os itens ficam em
 * lista vertical ALINHADA A DIREITA (todos terminando no mesmo x), em
 * 42px, com 54px entre linhas; abaixo de uma regua, os secundarios em
 * 24px. O fundo e a propria pagina, desfocada.
 *
 * ── o gatilho ──
 * Um circulo. Ao abrir, ele se PARTE em dois circulos menores que saem
 * de dentro dele e sobem/descem para as suas posicoes — o mesmo sinal de
 * dois pontos que a referencia usa como estado aberto. Fechar refaz o
 * caminho: os dois voltam ao centro e se fundem num so.
 *
 * A divisao e feita com dois elementos, nao com um pseudo-elemento
 * animado: sao duas pecas com trajetorias proprias, e uma delas precisa
 * poder passar por cima da outra durante a fusao.
 *
 * ── o texto em persiana ──
 * Cada item e revelado por uma mascara que abre de baixo para cima
 * (`clip-path: inset()`), com atraso entre linhas — a mesma mecanica das
 * ripas da <Persiana> que ja abre as imagens do site, aplicada a
 * tipografia. Nao e fade: o fade faz o texto "aparecer", a mascara faz
 * ele ser DESCOBERTO, que e o gesto do resto da pagina.
 */

const ITENS = [
  { to: '/', label: 'HOME' },
  { to: '/work', label: 'WORK' },
  { to: '/about', label: 'ABOUT' },
  { to: '/thoughts', label: 'THOUGHTS' },
  { to: '/contact', label: 'CONTACT' },
];

const SECUNDARIOS = [
  { to: '/privacidade', label: 'PRIVACIDADE' },
  { to: '/termos', label: 'TERMOS DE USO' },
  { to: '/404', label: '404' },
];

/* Quanto cada metade do circulo anda ao se separar. 9px: o bastante para
   os dois lerem como dois pontos distintos, pouco o bastante para
   continuarem sendo o mesmo objeto que se dividiu. */
const SEPARACAO = 9;

/* O gatilho e um circulo GRANDE no repouso e dois pequenos quando aberto:
   26px x 0.34 = ~9px cada, que e o tamanho dos dois pontos da referencia. */
const ESCALA_ABERTO = 0.34;

const PASSO_TEXTO = 0.055;

export default function MenuMovel() {
  const [aberto, setAberto] = useState(false);
  const raiz = useRef(null);
  const veu = useRef(null);
  const painel = useRef(null);
  const location = useLocation();

  /* Ver a nota no efeito: na montagem `aberto` ja vale false, e sem esta
     marca o ramo de fechamento rodaria na carga de toda pagina. */
  const jaAbriu = useRef(false);

  useEffect(() => { setAberto(false); }, [location.pathname]);

  useEffect(() => {
    if (!aberto) return;
    const aoTeclar = (e) => { if (e.key === 'Escape') setAberto(false); };
    window.addEventListener('keydown', aoTeclar);
    /* Trava a pagina por tras: sem isto o dedo que arrasta sobre o painel
       rola o conteudo escondido, e ao fechar a pagina esta noutro lugar. */
    document.documentElement.classList.add('mmv-travado');
    return () => {
      window.removeEventListener('keydown', aoTeclar);
      document.documentElement.classList.remove('mmv-travado');
    };
  }, [aberto]);

  useGSAP(() => {
    const r = raiz.current;
    const pontos = gsap.utils.toArray(r.querySelectorAll('.mmv__ponto'));
    const linhas = gsap.utils.toArray(r.querySelectorAll('.mmv__linha'));
    const regua = r.querySelector('.mmv__regua');

    const reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* A cortina parte da base da barra: `inset(0 0 calc(100% - Hpx) 0)`
       deixa visivel so a faixa do topo. Animar ate `inset(0)` e a
       cortina descendo. Em px, nao em %, para a barra ter sempre a mesma
       altura independente do tamanho da tela. */
    const ALTURA_BARRA = 64;
    const fechada = `inset(0px 0px calc(100% - ${ALTURA_BARRA}px) 0px)`;
    const abertaTotal = 'inset(0px 0px 0px 0px)';

    const abrirDireto = () => {
      gsap.set(veu.current, { autoAlpha: 1, clipPath: abertaTotal });
      gsap.set(painel.current, { autoAlpha: 1 });
      gsap.set(linhas, { clipPath: 'inset(0% 0% 0% 0%)', y: 0 });
      gsap.set(regua, { scaleX: 1 });
      gsap.set(pontos[0], { y: -SEPARACAO, scale: ESCALA_ABERTO });
      gsap.set(pontos[1], { y: SEPARACAO, scale: ESCALA_ABERTO });
    };

    const fecharDireto = () => {
      gsap.set(veu.current, { autoAlpha: 1, clipPath: fechada });
      gsap.set(painel.current, { autoAlpha: 0 });
      gsap.set(linhas, { clipPath: 'inset(0% 0% 100% 0%)', y: 0 });
      gsap.set(regua, { scaleX: 0 });
      gsap.set(pontos, { y: 0, scale: 1 });
    };

    if (reduz) { aberto ? abrirDireto() : fecharDireto(); return; }

    if (aberto) {
      jaAbriu.current = true;

      const tl = gsap.timeline();

      /* 1 · o circulo GRANDE se parte em dois pequenos. Encolher junto
         com a separacao e o que faz um virar dois: mantendo o tamanho,
         seriam duas bolas se afastando; encolhendo, e o mesmo objeto se
         dividindo. */
      tl.to(pontos[0], { y: -SEPARACAO, scale: ESCALA_ABERTO, duration: 0.36, ease: 'back.out(2.2)' }, 0)
        .to(pontos[1], { y: SEPARACAO, scale: ESCALA_ABERTO, duration: 0.36, ease: 'back.out(2.2)' }, 0);

      /* 2 · a cortina desce a partir da barra */
      tl.set(veu.current, { autoAlpha: 1 }, 0)
        .fromTo(veu.current, { clipPath: fechada }, { clipPath: abertaTotal, duration: 0.62, ease: 'power3.inOut' }, 0.02)
        .set(painel.current, { autoAlpha: 1 }, 0.2);

      /* 3 · a persiana: cada linha e DESCOBERTA de baixo para cima. O `y`
         acompanha a mascara para a linha parecer subir para o lugar em
         vez de crescer parada. */
      tl.fromTo(linhas,
        { clipPath: 'inset(0% 0% 100% 0%)', y: 26 },
        { clipPath: 'inset(0% 0% 0% 0%)', y: 0,
          duration: 0.6, ease: 'power3.out', stagger: PASSO_TEXTO },
        0.12);

      tl.fromTo(regua, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'power2.inOut' }, 0.3);
      return;
    }

    if (!jaAbriu.current) { fecharDireto(); return; }

    /* Fechamento: a persiana desce na ordem inversa, e so depois os dois
       pontos se fundem. Fundir primeiro entregaria o fim antes do meio. */
    const tl = gsap.timeline();

    tl.to([...linhas].reverse(),
      { clipPath: 'inset(0% 0% 100% 0%)', y: 18, duration: 0.26,
        ease: 'power2.in', stagger: PASSO_TEXTO * 0.5 }, 0);

    tl.to(regua, { scaleX: 0, duration: 0.2, ease: 'power2.in' }, 0);

    tl.set(painel.current, { autoAlpha: 0 }, 0.18);

    /* A cortina sobe de volta ate a barra — nao some. A barra continua
       la depois, que e o estado de repouso. */
    tl.to(veu.current, { clipPath: fechada, duration: 0.5, ease: 'power3.inOut' }, 0.16);

    tl.to(pontos, { y: 0, scale: 1, duration: 0.32, ease: 'back.in(1.8)' }, 0.3);
  }, { dependencies: [aberto], scope: raiz });

  const item = (it, i, classe) => (
    <TransitionLink
      key={it.to + i}
      to={it.to}
      className={`${classe}${location.pathname === it.to ? ' mmv__item--ativo' : ''}`}
      tabIndex={aberto ? 0 : -1}
      aria-hidden={!aberto}
      onClick={() => setAberto(false)}
    >
      {/* O span interno recebe a mascara; o <a> continua sendo o alvo de
          toque com a altura inteira da linha. */}
      <span className="mmv__linha">{it.label}</span>
    </TransitionLink>
  );

  return (
    <div className="mmv" ref={raiz}>
      {/* A barra vive no topo o tempo todo, translucida. Ao abrir o menu
          ela DESCE como cortina ate cobrir a tela — e ela que vira o
          fundo do painel, em vez de um veu aparecendo por fade. Fechar
          recolhe a cortina de volta a altura da barra. */}
      <div
        className="mmv__veu"
        ref={veu}
        onClick={() => setAberto(false)}
        aria-hidden="true"
      />

      <nav className="mmv__painel" ref={painel} aria-label="Navegação">
        <div className="mmv__principais">
          {ITENS.map((it, i) => item(it, i, 'mmv__item'))}
        </div>

        <i className="mmv__regua" aria-hidden="true" />

        <div className="mmv__secundarios">
          {SECUNDARIOS.map((it, i) => item(it, i, 'mmv__item mmv__item--menor'))}
        </div>
      </nav>

      <button
        type="button"
        className="mmv__botao"
        onClick={() => setAberto((v) => !v)}
        aria-expanded={aberto}
        aria-label={aberto ? 'Fechar menu' : 'Abrir menu'}
      >
        {/* Dois circulos sobrepostos no repouso: juntos leem como um so.
            Ao abrir, cada um vai para o seu lado. */}
        <span className="mmv__ponto" aria-hidden="true" />
        <span className="mmv__ponto" aria-hidden="true" />
      </button>
    </div>
  );
}
