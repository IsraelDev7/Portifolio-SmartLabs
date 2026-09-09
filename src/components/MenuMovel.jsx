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

    const abrirDireto = () => {
      gsap.set(veu.current, { autoAlpha: 1 });
      gsap.set(painel.current, { autoAlpha: 1 });
      gsap.set(linhas, { clipPath: 'inset(0% 0% 0% 0%)', y: 0 });
      gsap.set(regua, { scaleX: 1 });
      gsap.set(pontos[0], { y: -SEPARACAO });
      gsap.set(pontos[1], { y: SEPARACAO });
    };

    const fecharDireto = () => {
      gsap.set(veu.current, { autoAlpha: 0 });
      gsap.set(painel.current, { autoAlpha: 0 });
      gsap.set(linhas, { clipPath: 'inset(0% 0% 100% 0%)', y: 0 });
      gsap.set(regua, { scaleX: 0 });
      gsap.set(pontos, { y: 0 });
    };

    if (reduz) { aberto ? abrirDireto() : fecharDireto(); return; }

    if (aberto) {
      jaAbriu.current = true;

      const tl = gsap.timeline();

      /* 1 · o circulo se parte. As duas metades saem de dentro do mesmo
         ponto, entao a separacao e o primeiro sinal de que algo abriu —
         antes mesmo de o painel existir. */
      tl.to(pontos[0], { y: -SEPARACAO, duration: 0.34, ease: 'back.out(2.2)' }, 0)
        .to(pontos[1], { y: SEPARACAO, duration: 0.34, ease: 'back.out(2.2)' }, 0);

      /* 2 · o vidro entra por tras */
      tl.to(veu.current, { autoAlpha: 1, duration: 0.32, ease: 'power2.out' }, 0.04)
        .set(painel.current, { autoAlpha: 1 }, 0.04);

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

    tl.to(veu.current, { autoAlpha: 0, duration: 0.3, ease: 'power2.in' }, 0.16)
      .set(painel.current, { autoAlpha: 0 });

    tl.to(pontos, { y: 0, duration: 0.3, ease: 'back.in(1.8)' }, 0.2);
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
