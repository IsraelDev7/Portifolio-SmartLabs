import React, { useRef, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import TransitionLink from './TransitionLink';

/**
 * MenuMovel — a navegacao em arco, para o polegar.
 *
 * Vive no canto INFERIOR direito, nao no topo. A barra de cima e onde a
 * convencao poe o menu e onde o polegar nao alcanca numa tela de 6
 * polegadas segurada com uma mao so; no rodape a distancia ate o botao e
 * a menor da tela inteira.
 *
 * A mecanica vem do "circle menu": os itens partem de dentro do botao e
 * se abrem num arco, com atraso entre eles, e no fechamento voltam em
 * ordem inversa enquanto o botao PULSA a cada chegada — como se
 * engolisse um por um. E o pulso que faz o fechamento parecer causado
 * pelo botao em vez de ser a abertura tocada de tras para frente.
 *
 * A forma e quadrada porque o resto do site e: a Persiana, o Mosaico, as
 * reguas e o proprio monograma sao todos de canto reto. Um menu de
 * bolinhas seria a unica curva da pagina.
 *
 * ── por que um arco de 90 graus, e nao o circulo inteiro ──
 * O componente de referencia distribui os itens em 360, o que exige o
 * gatilho no meio da tela. Ancorado num canto, tres quartos do circulo
 * cairiam fora da viewport. Noventa graus — de oeste a norte — e o setor
 * que sobra quando o botao esta no canto inferior direito.
 */

const ITENS = [
  { to: '/work', label: 'WORK' },
  { to: '/about', label: 'ABOUT' },
  { to: '/thoughts', label: 'THOUGHTS' },
  { to: '/contact', label: 'CONTACT' },
];

/* Raio conferido contra a tela mais estreita que importa (360px): com o
   botao a 24px da borda, o item mais a oeste para em 165px do lado
   esquerdo. Um raio maior comecaria a empurrar o rotulo para fora. */
const RAIO = 132;
const GRAU_INI = 180;   // oeste
const GRAU_FIM = 270;   // norte

const PASSO_ABRE = 0.045;
const PASSO_FECHA = 0.06;

/** Posicao do item i no arco, em pixels relativos ao centro do botao. */
function pontoNoArco(i, total) {
  /* total-1 no divisor, nao total: com 4 itens queremos um em cada ponta
     do arco e dois no meio. Dividindo por `total` o ultimo item pararia
     antes do norte e o arco ficaria torto. */
  const t = total === 1 ? 0 : i / (total - 1);
  const g = GRAU_INI + (GRAU_FIM - GRAU_INI) * t;
  const rad = (g * Math.PI) / 180;
  return { x: RAIO * Math.cos(rad), y: RAIO * Math.sin(rad) };
}

export default function MenuMovel() {
  const [aberto, setAberto] = useState(false);
  const raiz = useRef(null);
  const botao = useRef(null);
  const veu = useRef(null);
  const location = useLocation();

  /* O efeito abaixo roda com `aberto` na lista de dependencias, e na
     MONTAGEM `aberto` ja vale false — sem esta marca, o ramo de
     fechamento executava na carga de toda pagina, com o menu nunca
     tendo sido aberto: o botao pulsava e tremia sozinho, e os itens
     ficavam parados em scale 0.6 (medido: alvo de 31px no lugar de 52,
     abaixo do minimo da WCAG, caso alguem os abrisse em seguida). */
  const jaAbriu = useRef(false);

  /* Fecha ao trocar de rota. Sem isto o menu continuaria aberto por cima
     da pagina nova — o clique navega, mas nada mandou o painel sair. */
  useEffect(() => { setAberto(false); }, [location.pathname]);

  /* Escape fecha. Um menu que so fecha pelo proprio botao prende quem
     usa teclado — e no navegador do celular o teclado externo existe. */
  useEffect(() => {
    if (!aberto) return;
    const aoTeclar = (e) => { if (e.key === 'Escape') setAberto(false); };
    window.addEventListener('keydown', aoTeclar);
    return () => window.removeEventListener('keydown', aoTeclar);
  }, [aberto]);

  useGSAP(() => {
    const itens = gsap.utils.toArray(raiz.current.querySelectorAll('.mmv__item'));
    if (!itens.length) return;

    const reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduz) {
      /* Caminho estatico de verdade: os itens vao direto para o lugar,
         sem arco e sem atraso. Nao e o mesmo que animar rapido. */
      itens.forEach((el, i) => {
        const { x, y } = pontoNoArco(i, itens.length);
        gsap.set(el, { x: aberto ? x : 0, y: aberto ? y : 0, autoAlpha: aberto ? 1 : 0, scale: 1 });
      });
      gsap.set(veu.current, { autoAlpha: aberto ? 1 : 0 });
      return;
    }

    gsap.to(veu.current, { autoAlpha: aberto ? 1 : 0, duration: 0.3, ease: 'power2.out' });

    if (aberto) {
      jaAbriu.current = true;
      itens.forEach((el, i) => {
        const { x, y } = pontoNoArco(i, itens.length);
        gsap.to(el, {
          x, y, autoAlpha: 1, scale: 1,
          duration: 0.5,
          delay: i * PASSO_ABRE,
          ease: 'back.out(1.6)',
        });
      });
      return;
    }

    /* Primeira passada: so ARRUMA o estado de repouso, sem tocar a
       coreografia. Fechar o que nunca abriu nao e uma animacao — e um
       botao se sacudindo sozinho na frente de quem acabou de chegar. */
    if (!jaAbriu.current) {
      gsap.set(itens, { x: 0, y: 0, autoAlpha: 0, scale: 1 });
      return;
    }

    /* ── o fechamento ──
       Ordem inversa: o item mais distante recolhe primeiro. Fechar na
       mesma ordem da abertura le como "rebobinar"; na ordem inversa, o
       ultimo a sair e o primeiro a voltar, que e o que a mao espera.

       O pulso do botao e disparado no `onComplete` de cada item, nao por
       uma timeline paralela: assim ele acontece no instante exato em que
       a peca chega, mesmo que a duracao mude depois. */
    const total = itens.length;
    [...itens].reverse().forEach((el, k) => {
      gsap.to(el, {
        x: 0, y: 0, autoAlpha: 0, scale: 0.6,
        duration: 0.32,
        delay: k * PASSO_FECHA,
        ease: 'power3.in',
        onComplete: () => {
          if (!botao.current) return;
          /* O pulso cresce conforme os itens chegam — o ultimo e o mais
             forte. Um pulso de tamanho fixo soaria mecanico. */
          const forca = 1 + ((k + 1) / total) * 0.22;
          gsap.timeline()
            .to(botao.current, { scale: forca, duration: 0.09, ease: 'power2.out' })
            .to(botao.current, { scale: 1, duration: 0.16, ease: 'elastic.out(1, 0.5)' });
        },
      });
    });

    /* A trepidacao dura o tempo do recolhimento inteiro e para sozinha.
       Vem do componente de referencia e e o que da a impressao de
       esforco — o botao aguentando os itens voltando. */
    const dur = (total - 1) * PASSO_FECHA + 0.32;
    gsap.fromTo(raiz.current,
      { x: 0 },
      { x: 1.5, duration: 0.05, repeat: Math.round(dur / 0.05), yoyo: true, ease: 'none',
        onComplete: () => gsap.set(raiz.current, { x: 0 }) });
  }, { dependencies: [aberto], scope: raiz });

  return (
    <div className="mmv" ref={raiz}>
      {/* O veu escurece a pagina E intercepta o toque: sem ele, tocar
          "fora" acertaria o conteudo por baixo em vez de fechar. */}
      <div
        className="mmv__veu"
        ref={veu}
        onClick={() => setAberto(false)}
        aria-hidden="true"
      />

      <div className="mmv__orbita">
        {ITENS.map((it, i) => {
          const ativo = location.pathname === it.to;
          return (
            <TransitionLink
              key={it.to}
              to={it.to}
              className={`mmv__item${ativo ? ' mmv__item--ativo' : ''}`}
              tabIndex={aberto ? 0 : -1}
              aria-hidden={!aberto}
              onClick={() => setAberto(false)}
            >
              {/* O quadrado e o alvo; o rotulo mora fora dele para o
                  alvo nao precisar crescer ate caber "THOUGHTS". */}
              <span className="mmv__marca" aria-hidden="true">
                <i /><i /><i />
              </span>
              <span className="mmv__rotulo">{it.label}</span>
            </TransitionLink>
          );
        })}
      </div>

      <button
        type="button"
        ref={botao}
        className={`mmv__botao${aberto ? ' mmv__botao--aberto' : ''}`}
        onClick={() => setAberto((v) => !v)}
        aria-expanded={aberto}
        aria-label={aberto ? 'Fechar menu' : 'Abrir menu'}
      >
        {/* Tres barras que viram X. As mesmas tres do monograma da marca,
            entao o gatilho do menu ja e um sinal conhecido da pagina. */}
        <span className="mmv__glifo" aria-hidden="true">
          <i /><i /><i />
        </span>
      </button>
    </div>
  );
}
