import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Letras from '../components/Letras';
import { Monogram } from '../components/Logo';
import { useCorpoJusto } from '../hooks/useCorpoJusto';

gsap.registerPlugin(ScrollTrigger);

/**
 * Assinatura — a marca em corpo maximo, o simbolo, a regua e o nome.
 *
 * Reconstrucao do bloco de fecho da referencia: duas colunas de texto
 * ladeando um selo circular, a marca em tipo gigante, e uma regua que se
 * desenha da esquerda ate o nome no fim.
 *
 * O simbolo no lugar do deles e o monograma dos Degraus — o Nivel. Nao
 * ha razao para inventar um simbolo aqui: a marca ja tem o seu, e e ele
 * que fecha a pagina.
 *
 * A COREOGRAFIA DO RODAPE tem tres tempos, nessa ordem:
 *   1. o Nivel se levanta bloco a bloco (degrau curto -> degrau alto)
 *   2. a regua e desenhada da esquerda para a direita
 *   3. o nome e digitalizado — cada letra passa por ruido antes de fixar
 *
 * A regua e um traco unico crescendo da esquerda, nao uma borda que
 * aparece pronta. Borda de CSS existe inteira ou nao existe; para
 * desenhar e preciso escalar a partir de uma origem.
 */

/* Alfabeto do ruido. So caixa alta, digitos e sinais de terminal: o nome
   e mono e caixa alta, e glifo de largura diferente faria a linha tremer
   enquanto embaralha. */
const CAOS = '01<>[]{}#*+=/\\ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export default function Assinatura() {
  const alvo = useRef(null);

  /* A marca em corpo medido, ANTES do useGSAP: a animacao de entrada das
     letras usa `yPercent`, que o GSAP converte com a altura que tem em
     cache quando o tween nasce. Se o corpo mudasse depois, a conta seria
     feita sobre a altura pequena e as letras subiriam menos do que a
     propria altura. */
  const [ehTelefone, setEhTelefone] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 820px)').matches
  );
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 820px)');
    const ao = (e) => setEhTelefone(e.matches);
    mq.addEventListener('change', ao);
    return () => mq.removeEventListener('change', ao);
  }, []);

  useCorpoJusto(alvo, '.assinatura__marca', { ativo: ehTelefone });

  useGSAP(() => {
    const raiz = alvo.current;
    const nomeSpans = gsap.utils.toArray(raiz.querySelectorAll('.assinatura__nome .letra'));

    /* O texto final vive no dataset, nao na leitura do DOM: se o efeito
       remontar no meio de um embaralho, ler textContent congelaria o
       ruido como se fosse o nome. */
    nomeSpans.forEach((el) => {
      if (el.dataset.fim === undefined) el.dataset.fim = el.textContent;
    });
    const restaurar = () => nomeSpans.forEach((el) => { el.textContent = el.dataset.fim; });

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // as letras da marca sobem uma a uma, no gatilho da propria marca
    gsap.from(raiz.querySelectorAll('.assinatura__marca .letra'), {
      yPercent: 108,
      opacity: 0,
      duration: 1.1,
      stagger: 0.045,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: raiz.querySelector('.assinatura__marca'),
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    });

    /* O rodape tem GATILHO PROPRIO. Pendurado no da marca, a coreografia
       inteira acontecia enquanto o rodape ainda estava fora da tela: ao
       chegar nele o leitor so via o estado final. O que precisa entrar na
       viewport para a animacao comecar e a linha que anima. */
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: raiz.querySelector('.assinatura__rodape'),
        /* 80%, nao 88%: a 88% a linha esta encostada na borda de baixo e
           o Nivel — que e o PRIMEIRO tempo, e dura menos de um segundo —
           terminava de subir antes de entrar de fato no campo de visao.
           So a regua, que vem depois, sobrava para ser vista. */
        start: 'top 80%',
        /* restart, nao play: `play` num tempo ja completo nao faz nada, e
           a coreografia so voltava a acontecer quando o leitor subisse
           acima do gatilho. Com `restart` toda passagem para baixo
           recomeca do zero. */
        toggleActions: 'restart none none reverse',
      },
    });

    // 1 · o Nivel sobe bloco a bloco, do degrau curto ao alto
    tl.from(raiz.querySelectorAll('.assinatura__nivel rect'), {
      scaleY: 0,
      duration: 0.5,
      stagger: 0.16,
      ease: 'power3.out',
    });

    // 2 · a regua e desenhada da esquerda
    tl.from(raiz.querySelector('.assinatura__regua'), {
      scaleX: 0,
      duration: 1.0,
      ease: 'power2.inOut',
    }, '>-0.05');

    // 3 · o nome e digitalizado, letra a letra
    const abre = tl.duration() - 0.2;
    tl.to(raiz.querySelector('.assinatura__nome'), { opacity: 1, duration: 0.2 }, abre);

    nomeSpans.forEach((el, i) => {
      const fim = el.dataset.fim;
      if (!fim.trim()) return;  // o espaco nao embaralha
      const passo = { p: 0 };
      tl.to(passo, {
        p: 1,
        duration: 0.4,
        ease: 'none',
        onUpdate() { el.textContent = CAOS[(Math.random() * CAOS.length) | 0]; },
        onComplete() { el.textContent = fim; },
        onReverseComplete() { el.textContent = fim; },
      }, abre + i * 0.045);
    });

    return restaurar;
  }, { scope: alvo });

  return (
    <section className="assinatura" ref={alvo}>
      <div className="assinatura__topo">
        <p className="assinatura__coluna" data-anim="rise">
          Imagine um novo lead entrando no negócio. Ele preenche um formulário.
          A informação é capturada. Os dados são registrados. Uma mensagem é
          enviada. O atendimento é iniciado. O processo continua.
          <b>Sem depender de alguém lembrar de fazer cada etapa.</b>
        </p>

        {/* selo circular: texto correndo na borda, Nivel no centro */}
        <div className="assinatura__selo" data-anim="rise" aria-hidden="true">
          <svg viewBox="0 0 200 200" className="assinatura__giro">
            <defs>
              <path
                id="trilha-selo"
                d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0"
                fill="none"
              />
            </defs>
            {/* Uma volta so. A circunferencia e 2*pi*74 = 465 unidades e, a
                11 unidades com 0.24em de espacejamento, cabem ~50
                caracteres. Duas repeticoes transbordavam e o texto colidia
                consigo mesmo na emenda. O selo cresce por CSS, e o texto
                cresce junto: a conta continua valendo em qualquer tamanho. */}
            <text className="assinatura__trilha">
              <textPath href="#trilha-selo" startOffset="0%">
                SMARTLABS ✳ ARQUITETURA DIGITAL DE ALTO PADRÃO ✳
              </textPath>
            </text>
          </svg>
          <Monogram className="assinatura__monograma" color="var(--cal)" size={76} />
        </div>

        <p className="assinatura__coluna assinatura__coluna--dir" data-anim="rise">
          <span className="assinatura__kicker" data-anim="rise">Automation</span>
          Tudo que depende de trabalho manual repetitivo merece ser questionado.
          Conectamos processos para que informações avancem pelo sistema sem
          depender de alguém movimentando cada etapa.
          <b>Menos tarefas manuais. Mais velocidade.</b>
        </p>
      </div>

      {/* a marca em corpo maximo */}
      <h2 className="assinatura__marca" aria-label="Smart Labs">
        <Letras texto="SMART LABS" />
      </h2>

      {/* simbolo, regua desenhada, nome digitalizado */}
      <div className="assinatura__rodape">
        <Monogram className="assinatura__nivel" color="var(--cal)" size={56} />
        <i className="assinatura__regua" aria-hidden="true" />
        <span className="assinatura__nome" aria-label="Israel Passos">
          <Letras texto="Israel Passos" />
        </span>
      </div>
    </section>
  );
}
