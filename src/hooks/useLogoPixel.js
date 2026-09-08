import { useEffect } from 'react';
import gsap from 'gsap';
import { registrarLogo } from '../lib/logoBus';

/**
 * useLogoPixel — monta e desmonta o monograma nivel a nivel.
 *
 * MONTAGEM  ~0,95s  degrau 1 -> degrau 2 -> degrau 3 (Solda pousa por
 *                   ultimo), e as letras do nome pousam em pixel logo
 *                   depois — cada uma abrindo do seu proprio lado.
 * DESMONTE  ~0,48s  a ordem inversa: o degrau mais alto cai primeiro.
 *
 * As letras usam ease em `steps`: interpolacao continua faria a letra
 * deslizar, e deslizar nao le como pixel. Em degraus ela SALTA de um
 * estado a outro, que e como bloco de imagem se resolve.
 *
 * Cada celula guarda o SEU proprio caos (deslocamento, giro), sorteado
 * uma unica vez. Assim a peca sempre sai e volta pelo mesmo caminho — o
 * efeito ganha memoria em vez de parecer ruido diferente a cada troca.
 */
export function useLogoPixel(svgRef, nomeRef) {
  useEffect(() => {
    const svg = svgRef.current;
    const nome = nomeRef.current;
    if (!svg || !nome) return;

    const reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const celulas = gsap.utils.toArray(svg.querySelectorAll('.pm-cell'));
    if (!celulas.length) return;

    // Movimento reduzido: o logo ja nasce pronto e as duas acoes viram
    // no-ops. Caminho estatico de verdade, nao animacao pela metade.
    const letras = gsap.utils.toArray(nome.querySelectorAll('.pxl'));

    if (reduz) {
      gsap.set(celulas, { clearProps: 'all', opacity: 1 });
      gsap.set([nome, ...letras], { clearProps: 'all', opacity: 1 });
      return registrarLogo({ montar: () => {}, desmontar: () => {} });
    }

    // Em tela pequena a sequencia longa cansa: mesma coreografia, 26% mais rapida.
    const compacto = window.matchMedia('(max-width: 820px)').matches;
    const esc = compacto ? 0.74 : 1;

    celulas.forEach((el) => {
      el._caos = {
        x: gsap.utils.random(-14, 14),
        y: gsap.utils.random(-14, 14),
        rot: gsap.utils.random(-35, 35),
      };
    });

    const porNivel = [0, 1, 2].map((n) =>
      celulas.filter((el) => Number(el.dataset.nivel) === n)
    );

    const doCaos = {
      x: (i, el) => el._caos.x,
      y: (i, el) => el._caos.y,
      rotation: (i, el) => el._caos.rot,
    };

    /* Cada letra guarda o seu proprio caos e o SEU LADO de abertura,
       sorteados uma vez so. E o que faz a peca sair e voltar sempre pelo
       mesmo caminho, em vez de virar ruido novo a cada troca de rota. */
    const LADOS = [
      'inset(0% 0% 100% 0%)',
      'inset(100% 0% 0% 0%)',
      'inset(0% 100% 0% 0%)',
      'inset(0% 0% 0% 100%)',
    ];

    letras.forEach((el) => {
      el._caos = {
        x: gsap.utils.random(-9, 9),
        y: gsap.utils.random(-11, 11),
        lado: gsap.utils.random(LADOS),
      };
    });

    const letraFechada = {
      x: (i, el) => el._caos.x,
      y: (i, el) => el._caos.y,
      clipPath: (i, el) => el._caos.lado,
      opacity: 0,
      scale: 0.55,
    };

    const letraAberta = {
      x: 0, y: 0, scale: 1, opacity: 1,
      clipPath: 'inset(0% 0% 0% 0%)',
    };

    const limpar = () => {
      gsap.killTweensOf(celulas);
      gsap.killTweensOf(letras);
    };

    // Estado inicial: desfeito. O logo so aparece quando mandarem montar.
    gsap.set(celulas, { ...doCaos, opacity: 0, scale: 0.4, transformOrigin: '50% 50%' });
    // Todos os quatro valores em % de proposito: o GSAP interpola
    // clip-path numero a numero e nao converte px<->%, entao misturar
    // unidades faz o tween ser engolido em silencio.
    gsap.set(letras, { ...letraFechada, transformOrigin: '50% 50%' });

    const montar = () => {
      limpar();
      const tl = gsap.timeline();

      porNivel.forEach((grupo, n) => {
        tl.to(
          grupo,
          {
            opacity: 1, scale: 1, x: 0, y: 0, rotation: 0,
            duration: 0.62 * esc,
            ease: 'expo.out',
            stagger: { each: 0.008 * esc, from: 'random' },
          },
          n * 0.18 * esc
        );
      });

      // As letras entram com o degrau 3 ja subindo — parecem empurradas
      // pelo monograma. fromTo, nao to: cada uma volta pelo mesmo lado
      // por onde saiu, venha de onde vier.
      tl.fromTo(
        letras,
        letraFechada,
        {
          ...letraAberta,
          duration: 0.42 * esc,
          ease: 'steps(5)',
          stagger: { each: 0.035 * esc, from: 'random' },
        },
        0.5 * esc
      );

      return tl;
    };

    const desmontar = () => {
      limpar();
      const tl = gsap.timeline();

      tl.to(letras, {
        ...letraFechada,
        duration: 0.24,
        ease: 'steps(4)',
        stagger: { each: 0.02, from: 'random' },
      }, 0);

      // Ordem inversa da montagem: o degrau alto e o primeiro a se soltar.
      [2, 1, 0].forEach((n, ordem) => {
        tl.to(
          porNivel[n],
          {
            ...doCaos,
            opacity: 0, scale: 0.35,
            duration: 0.34,
            ease: 'power2.in',
            stagger: { each: 0.006, from: 'random' },
          },
          ordem * 0.07
        );
      });

      return tl;
    };

    const baixa = registrarLogo({ montar, desmontar });
    return () => { limpar(); baixa(); };
  }, [svgRef, nomeRef]);
}
