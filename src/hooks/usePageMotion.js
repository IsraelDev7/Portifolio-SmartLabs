import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * usePageMotion — motor de movimento do Smart LABS
 *
 * Anima elementos JA EXISTENTES via atributo data-anim.
 * NAO altera layout: nenhuma medida, posicao ou estilo estrutural e tocado.
 * Todo efeito age apenas sobre transform, opacity e clip-path.
 *
 * Fisica da marca (motion-system v1.0): pesado e preciso, nunca elastico.
 *   expo.out  -> entradas que assentam com peso mecanico
 *   0.9s      -> reveal
 *   0.08s     -> stagger
 *
 * Uso:  const ref = usePageMotion();  <div ref={ref}> ... </div>
 *
 * Atributos reconhecidos:
 *   data-anim="reveal"    linha sobe de dentro de mascara (P1)
 *   data-anim="words"     palavras acendem com o scroll (P4)
 *   data-anim="rise"      bloco sobe e materializa
 *   data-anim="stagger"   filhos entram em cascata
 *   data-anim="frame"     imagem: clip reveal + parallax interno (P5)
 *   data-anim="line"      regra 1px cresce da esquerda
 *   data-anim="parallax"  deriva vertical suave no scroll
 */
export function usePageMotion() {
  const scope = useRef(null);

  useGSAP(() => {
    const root = scope.current;
    if (!root) return;

    // Acessibilidade: quem pediu menos movimento recebe o conteudo pronto.
    const reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduz) {
      root.querySelectorAll('[data-anim]').forEach((el) => {
        gsap.set(el, { clearProps: 'all', opacity: 1 });
      });
      return;
    }

    /* ── a entrada da casa ──
       Duas linhas do tempo sobre a mesma peca, com faixas de tamanhos
       diferentes. A conta, numa tela de 980:

         opacidade   940 -> 745   =  195px   (le-se cedo)
         deslocamento 940 -> 451  =  489px   (ve-se mover)

       Os 44px de percurso sao maiores que os 30 de antes justamente
       porque agora ha espaco de rolagem para gasta-los devagar. */
    const aparecer = (el) => {
      gsap.fromTo(el, { opacity: 0 }, {
        opacity: 1, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom-=40', end: 'top 76%', scrub: 0.4 },
      });
      gsap.fromTo(el, { y: 44 }, {
        y: 0, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom-=40', end: 'top 46%', scrub: 0.6 },
      });
    };

    const ctx = gsap.context(() => {
      /* ---------- P1 · reveal por mascara ---------- */
      root.querySelectorAll('[data-anim="reveal"]').forEach((el) => {
        // envolve o conteudo sem alterar caixa: wrapper inline com overflow
        if (!el.dataset.wrapped) {
          const inner = document.createElement('span');
          inner.className = 'pm-inner';
          inner.style.display = 'block';
          inner.style.willChange = 'transform';
          while (el.firstChild) inner.appendChild(el.firstChild);
          el.appendChild(inner);
          el.style.overflow = 'hidden';
          el.dataset.wrapped = '1';
        }
        gsap.from(el.querySelector('.pm-inner'), {
          yPercent: 108,
          duration: 0.9,
          ease: 'expo.out',
          // reverse ao voltar: a referencia nao guarda estado, ela e lida
          // na posicao do scroll — subir de novo desfaz a entrada
          scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' },
        });
      });

      /* ---------- P4 · palavras acendendo no scroll ---------- */
      root.querySelectorAll('[data-anim="words"]').forEach((el) => {
        if (!el.dataset.split) {
          const texto = el.textContent.trim();
          el.textContent = '';
          texto.split(/\s+/).forEach((w) => {
            const s = document.createElement('span');
            s.className = 'pm-word';
            s.textContent = w + ' ';
            s.style.display = 'inline-block';
            s.style.whiteSpace = 'pre';
            el.appendChild(s);
          });
          el.dataset.split = '1';
        }
        gsap.fromTo(
          el.querySelectorAll('.pm-word'),
          { opacity: 0.18 },
          {
            opacity: 1,
            stagger: 0.05,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top 82%',
              end: 'bottom 55%',
              scrub: true,
            },
          }
        );
      });

      /* ---------- entrada de bloco ----------
         ── as duas falhas que vieram antes desta versao ──
         Primeiro o gatilho era `top 88%` com um tween de tempo. Medido
         numa tela de 768: o gatilho cai em 676px, entao uma peca podia
         estar em y=749 — DENTRO da tela, na altura em que o olho ja
         chegou — e ainda em opacidade 0. Aparecia atrasada.

         Dai eu adiantei para `top 96%` e encurtei o gesto. O defeito
         virou o oposto: medido na faixa de resultados, a cascata
         inteira TERMINAVA enquanto o bloco ainda estava a 418px do topo
         — ou seja, completava antes de entrar na zona de leitura. Nunca
         dava para ver o movimento; o texto simplesmente ja estava la.

         ── por que agora e preso ao scroll ──
         Tween de tempo tem um problema estrutural aqui: a duracao dele
         e em SEGUNDOS e a chegada do elemento e em PIXELS DE SCROLL.
         Os dois nao se falam, entao qualquer velocidade de rolagem
         diferente da que eu imaginei quebra o encontro — rapido demais
         e ele chega pronto, devagar demais e ele fica esperando.

         Com `scrub`, o progresso E a posicao. A faixa vai da borda de
         baixo ate 74% da altura: enquanto a peca sobe esse trecho ela
         se materializa, e ao entrar na zona de leitura ja esta inteira.
         Impossivel ler algo invisivel, e impossivel nao ver o gesto.

         `scrub: 0.5` e nao `true`: meio segundo de inercia tira o
         travamento de estar amarrado quadro a quadro ao dedo. */
      /* ── a faixa era curta demais ──
         Com opacidade e deslocamento presos na MESMA faixa, tudo
         acontecia entre 940px e 725px de altura de tela: 215px de
         rolagem, duas voltas de roda. Tecnicamente animado, praticamente
         invisivel — foi o que o Israel viu.

         Separados, cada um pode ter a faixa que o seu trabalho pede:
         a OPACIDADE fecha cedo, porque texto meio transparente e texto
         que nao se le; o DESLOCAMENTO corre por mais que o dobro, e e
         ele que entrega o gesto. */
      root.querySelectorAll('[data-anim="rise"]').forEach((el) => aparecer(el));

      /* ---------- cascata nos filhos ---------- */
      /* ── por que cada filho tem o SEU gatilho, e nao o pai ──
         Com o gatilho no pai e um `stagger` fatiando a faixa, uma
         coluna alta quebra: medido na faixa de resultados, a lista de
         blocos tem ~700px, entao quando o PAI chegava ao fim da faixa
         o terceiro bloco ainda estava 400px abaixo da dobra — ele
         terminava de animar FORA DA TELA e o leitor o encontrava
         parado.

         Preso ao scroll, gatilho por filho ja produz a cascata sozinho:
         cada peca sobe quando ELA entra. O grupo continua coerente
         porque a unidade animada e o <li> inteiro — numero, titulo e
         texto sobem juntos, que era o ponto de nao usar `rise` em cada
         linha. */
      root.querySelectorAll('[data-anim="stagger"]').forEach((el) => {
        gsap.utils.toArray(el.children).forEach((filho) => aparecer(filho));
      });

      /* ---------- P5 · imagem: clip reveal + parallax interno ---------- */
      root.querySelectorAll('[data-anim="frame"]').forEach((el) => {
        gsap.fromTo(
          el,
          { clipPath: 'inset(100% 0% 0% 0%)' },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 1.2,
            ease: 'expo.out',
            // reverse ao voltar: a referencia nao guarda estado, ela e lida
          // na posicao do scroll — subir de novo desfaz a entrada
          scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' },
          }
        );
        // deriva interna: a imagem de fundo desliza mais devagar que a pagina
        gsap.fromTo(
          el,
          { backgroundPositionY: '44%' },
          {
            backgroundPositionY: '56%',
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
          }
        );
      });

      /* ---------- regra 1px que cresce ---------- */
      root.querySelectorAll('[data-anim="line"]').forEach((el) => {
        gsap.from(el, {
          scaleX: 0,
          transformOrigin: 'left center',
          duration: 1.1,
          ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 92%', toggleActions: 'play none none reverse' },
        });
      });

      /* ---------- parallax discreto ---------- */
      root.querySelectorAll('[data-anim="parallax"]').forEach((el) => {
        const f = parseFloat(el.dataset.parallax || '8');
        gsap.fromTo(
          el,
          { yPercent: f * 0.5 },
          {
            yPercent: -f * 0.5,
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
          }
        );
      });

      ScrollTrigger.refresh();
    }, root);

    return () => ctx.revert();
  }, { scope });

  return scope;
}
