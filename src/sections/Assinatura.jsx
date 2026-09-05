import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Letras from '../components/Letras';
import { Monogram } from '../components/Logo';

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
 * A regua e um traco unico crescendo da esquerda, nao uma borda que
 * aparece pronta. Borda de CSS existe inteira ou nao existe; para
 * desenhar e preciso escalar a partir de uma origem.
 */
export default function Assinatura() {
  const alvo = useRef(null);

  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const gatilho = {
      trigger: alvo.current.querySelector('.assinatura__marca'),
      start: 'top 80%',
      toggleActions: 'play none none reverse',
    };

    // as letras da marca sobem uma a uma
    gsap.from(alvo.current.querySelectorAll('.assinatura__marca .letra'), {
      yPercent: 108,
      opacity: 0,
      duration: 1.1,
      stagger: 0.045,
      ease: 'expo.out',
      scrollTrigger: gatilho,
    });

    // a regua se desenha da esquerda, depois das letras
    gsap.from(alvo.current.querySelector('.assinatura__regua'), {
      scaleX: 0,
      transformOrigin: 'left center',
      duration: 1.1,
      ease: 'power2.inOut',
      delay: 0.45,
      scrollTrigger: gatilho,
    });

    gsap.from(alvo.current.querySelector('.assinatura__nome'), {
      opacity: 0,
      duration: 0.6,
      delay: 1.3,
      scrollTrigger: gatilho,
    });
  }, { scope: alvo });

  return (
    <section className="assinatura" ref={alvo}>
      <div className="assinatura__topo">
        <p className="assinatura__coluna">
          Imagine um novo lead entrando no negócio. Ele preenche um formulário.
          A informação é capturada. Os dados são registrados. Uma mensagem é
          enviada. O atendimento é iniciado. O processo continua.
          <b>Sem depender de alguém lembrar de fazer cada etapa.</b>
        </p>

        {/* selo circular: texto correndo na borda, Nivel no centro */}
        <div className="assinatura__selo" aria-hidden="true">
          <svg viewBox="0 0 200 200" className="assinatura__giro">
            <defs>
              <path
                id="trilha-selo"
                d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0"
                fill="none"
              />
            </defs>
            {/* Uma volta so. A circunferencia e 2*pi*74 = 465px e, a 11px
                com 0.24em de espacejamento, cabem ~50 caracteres. Duas
                repeticoes transbordavam e o texto colidia consigo mesmo
                na emenda. */}
            <text className="assinatura__trilha">
              <textPath href="#trilha-selo" startOffset="0%">
                SMARTLABS ✳ ARQUITETURA DIGITAL DE ALTO PADRÃO ✳
              </textPath>
            </text>
          </svg>
          <Monogram className="assinatura__monograma" color="var(--cal)" size={54} />
        </div>

        <p className="assinatura__coluna assinatura__coluna--dir">
          <span className="assinatura__kicker">Automation</span>
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

      {/* simbolo, regua desenhada, nome */}
      <div className="assinatura__rodape">
        <Monogram className="assinatura__nivel" color="var(--cal)" size={38} />
        <i className="assinatura__regua" aria-hidden="true" />
        <span className="assinatura__nome">Israel Passos</span>
      </div>
    </section>
  );
}
