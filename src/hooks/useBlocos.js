import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * useBlocos — entrada de cartoes em blocos, colunas em sentidos opostos.
 *
 * Marque o CONTAINER com `data-bloco`; quem anima sao os filhos diretos.
 * Coluna par sobe, coluna impar desce, e cada uma e revelada por uma
 * mascara que abre do lado de onde ela veio: quem sobe aparece de baixo
 * para cima, quem desce aparece de cima para baixo.
 *
 * Sao esses dois detalhes juntos que fazem ler como BLOCO e nao como
 * caixa flutuando:
 *
 *   1. A mascara acompanha o sentido. Se ela abrisse sempre do mesmo
 *      lado, metade dos cartoes pareceria entrar de re.
 *   2. O deslocamento e curto (40px). Cartao que vem de longe vira
 *      objeto voando; o que interessa e a materia surgindo no lugar.
 *
 * O sentido alternado veio da medicao da referencia, onde imagem e texto
 * do heroi correm em sinais opostos (+0.20 contra -0.40) — e a
 * divergencia, nao a velocidade, que da a sensacao de camadas.
 *
 * Reversivel: `toggleActions` com reverse no fim, entao subir de volta
 * desmonta os blocos na ordem inversa.
 */

const DESLOC = 40;        // px — curto de proposito
const DUR = 1.0;
const PASSO = 0.09;       // atraso entre cartoes vizinhos

export function useBlocos(escopo) {
  useGSAP(() => {
    const raiz = escopo.current;
    if (!raiz) return;

    const reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    raiz.querySelectorAll('[data-bloco]').forEach((grupo) => {
      const cartoes = gsap.utils.toArray(grupo.children);
      if (!cartoes.length) return;

      // Movimento reduzido: os blocos ja nascem montados.
      if (reduz) {
        gsap.set(cartoes, { clearProps: 'all', opacity: 1 });
        return;
      }

      cartoes.forEach((card, i) => {
        const desce = i % 2 === 1;

        gsap.fromTo(
          card,
          {
            y: desce ? -DESLOC : DESLOC,
            // a mascara abre do lado de onde o cartao vem
            clipPath: desce ? 'inset(0% 0% 100% 0%)' : 'inset(100% 0% 0% 0%)',
            opacity: 0,
          },
          {
            y: 0,
            clipPath: 'inset(0% 0% 0% 0%)',
            opacity: 1,
            duration: DUR,
            ease: 'expo.out',
            delay: i * PASSO,
            scrollTrigger: {
              trigger: grupo,
              start: 'top 82%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    });
  }, { scope: escopo });
}
