import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import PlateButton from '../components/PlateButton';
import { useDeriva } from '../hooks/useDeriva';
import Letras from '../components/Letras';
import './Hero.css';
import { useCorpoJusto } from '../hooks/useCorpoJusto';
import { aposCortina } from '../lib/cortina';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const container = useRef(null);

  /* O corpo das linhas do heroi e MEDIDO, nao fixado: ver useCorpoJusto.
     So no telefone — em tela larga a headline tem o desenho de sempre,
     com quebra natural. */
  const [ehTelefone, setEhTelefone] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 560px)').matches
  );
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 560px)');
    const ao = (e) => setEhTelefone(e.matches);
    mq.addEventListener('change', ao);
    return () => mq.removeEventListener('change', ao);
  }, []);

  useCorpoJusto(container, '.hh, .marca-movel__linha', { ativo: ehTelefone });

  /* ── SMART desce, LABS sobe ──
     As duas palavras nascem das bordas das proprias janelas e se
     encontram no meio. O gesto e reversivel de proposito: a mesma
     timeline que monta a marca a desmonta quando o leitor deixa o heroi,
     e a remonta quando ele volta — entao o efeito nao e um enfeite de
     carregamento, e o estado da secao.

     `y` em px por funcao, e nao `yPercent`: o corpo da fonte e escrito
     pelo useCorpoJusto no mesmo ciclo, e o yPercent seria convertido
     usando a altura que o GSAP tinha em cache ANTES do ajuste — o mesmo
     defeito que ja apareceu na deriva da galeria, onde a conta dava zero
     e o transform saia `translate3d(0,0,0)`. Lendo a altura na hora, o
     valor acompanha qualquer corpo. */
  useGSAP(() => {
    if (!ehTelefone) return;

    const raiz = container.current;
    const smart = raiz.querySelector('.marca-movel__linha--a');
    const labs = raiz.querySelector('.marca-movel__linha--b');
    if (!smart || !labs) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set([smart, labs], { y: 0 });
      return;
    }

    const tl = gsap.timeline({ paused: true });
    tl.fromTo(smart,
      { y: () => -smart.offsetHeight },
      { y: 0, duration: 1.05, ease: 'expo.out' }, 0)
      .fromTo(labs,
        { y: () => labs.offsetHeight },
        { y: 0, duration: 1.05, ease: 'expo.out' }, 0);

    /* Espera a cortina do preloader sair: a marca e a primeira coisa que
       o heroi entrega, e entregar isso atras da cortina e nao entregar. */
    const cancelar = aposCortina(() => tl.play());

    /* `end: 'bottom 60%'` e nao 'bottom top': o reverso precisa comecar
       enquanto a marca ainda esta na tela, senao o leitor rola, nao ve
       nada acontecer, e ao voltar encontra a animacao ja pela metade. */
    const st = ScrollTrigger.create({
      trigger: raiz,
      start: 'top top',
      end: 'bottom 60%',
      onLeave: () => tl.reverse(),
      onEnterBack: () => tl.play(),
      /* SEM `invalidateOnRefresh`: os `y: () => ...` leem offsetHeight, e
         reavaliar isso a cada refresh realimentava o ciclo — o GSAP
         escreve, o layout muda, o ScrollTrigger refaz o refresh, e o
         navegador travava ao abrir o menu. As funcoes ja sao avaliadas na
         criacao, e o corpo so muda quando a largura da tela muda, caso em
         que o efeito inteiro e recriado. */
    });

    return () => { cancelar(); st.kill(); tl.kill(); };
  }, { dependencies: [ehTelefone], scope: container });

  /* Deriva: cada peca anda uma fracao do scroll, e a divergencia entre
     elas — nao a velocidade — e o que da a sensacao de camadas.

     O TIPO GRANDE E A ANCORA (sem atributo, fator 0). Isso e o oposto do
     que parece intuitivo, e veio da medicao da referencia: la o display
     do heroi fica cravado em 0 no scroll inteiro enquanto o texto miudo
     do canto corre a -0.40. A peca pesada segura a composicao; sao as
     leves que se deslocam em volta dela. */
  useDeriva(container);

  useGSAP(() => {
    /* Distancia ate a linha imaginaria do meio da pagina.
       offsetLeft, nao getBoundingClientRect: o rect ja vem somado dos
       transforms e mediria a posicao animada em vez da de layout. */
    const esquerdaDeLayout = (el) => {
      let x = 0, n = el;
      while (n) { x += n.offsetLeft; n = n.offsetParent; }
      return x;
    };

    /* A margem imaginaria do meio da pagina. Nao basta levar o bloco ate
       o centro: ele tem que ficar INTEIRO do lado de la para se esconder
       dentro dela — SMA encosta a borda ESQUERDA na linha, ABS encosta a
       DIREITA. Se parassem com o centro na linha, metade continuaria
       aparecendo do outro lado. */
    const encostaEsquerda = (i, el) => window.innerWidth / 2 - esquerdaDeLayout(el);
    const encostaDireita = (i, el) =>
      window.innerWidth / 2 - el.offsetWidth - esquerdaDeLayout(el);

    /* A margem do meio recorta em coordenada de PAGINA, nao do elemento,
       entao o clip nao pode ser um tween: ele tem que ser recalculado a
       partir do x atual, a cada quadro. Assim vale para as duas
       timelines — a de entrada e a de scroll — sem precisar duplicar
       nada, e continua certo se as duas se sobrepuserem. */
    const l1 = container.current.querySelector('.line-1');
    const l3 = container.current.querySelector('.line-3');

    const mascararNaMargem = () => {
      const meio = window.innerWidth / 2;

      // SMA: so existe o que ja passou para a ESQUERDA da linha
      const e1 = esquerdaDeLayout(l1) + (Number(gsap.getProperty(l1, 'x')) || 0);
      const w1 = l1.offsetWidth;
      const cortaDir = Math.min(Math.max(e1 + w1 - meio, 0), w1);
      l1.style.clipPath = `inset(0px ${cortaDir}px 0px 0px)`;

      // ABS: so existe o que ja passou para a DIREITA
      const e3 = esquerdaDeLayout(l3) + (Number(gsap.getProperty(l3, 'x')) || 0);
      const w3 = l3.offsetWidth;
      const cortaEsq = Math.min(Math.max(meio - e3, 0), w3);
      l3.style.clipPath = `inset(0px 0px 0px ${cortaEsq}px)`;
    };

    const reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduz) gsap.ticker.add(mascararNaMargem);

    // ============ ENTRADA ============
    const tl = gsap.timeline({ delay: 0.2 });

    // SMA e ABS nascem na linha do meio e correm para os lados opostos.
    // Como `x` e funcao, cada um calcula o proprio deslocamento: o de fora
    // esta mais longe do centro e por isso percorre mais caminho no mesmo
    // tempo — os dois chegam juntos vindo de distancias diferentes.
    tl.from('.line-1', { x: encostaEsquerda, duration: 1.4, ease: 'expo.out' }, 0);
    tl.from('.line-3', { x: encostaDireita, duration: 1.4, ease: 'expo.out' }, 0);

    /* RTL vem de muito longe e cresce ate chegar. Nada de giro: e um
       objeto se aproximando no eixo de profundidade, e so.

       Escala UNIFORME e ate 0, nao ate um minimo: parando em 0.12 ele
       continuaria la, pequeno mas presente. Sumir por inteiro e a escala
       chegar a zero.

       Sem opacidade no tween de proposito. Objeto que se afasta fica
       menor, nao transparente — o fade roubaria a leitura de distancia e
       ele desapareceria antes de ter encolhido. */
    tl.from('.line-2', {
      scale: 0,
      z: -1400,
      transformOrigin: '50% 50%',
      duration: 1.7,
      ease: 'expo.out',
    }, 0.06);

    // As letras so carregam o fade, escalonado. O gesto de cada palavra e
    // do bloco; a letra da textura sem disputar com ele.
    tl.from('.massive-line .letra', {
      opacity: 0,
      duration: 0.7,
      stagger: { each: 0.04, from: 'start' },
      ease: 'power2.out',
    }, 0.15);

    // Bloco direito: empilhamento de cima para baixo.
    tl.from('.empilha', {
      y: -34,
      opacity: 0,
      duration: 0.85,
      stagger: 0.13,
      ease: 'power3.out',
    }, 0.45);

    // A barra do autor cresce, e o nome sai de tras dela — pela margem
    // esquerda, nao de cima como o resto do bloco.
    tl.from('.author-border', {
      scaleY: 0,
      transformOrigin: 'top',
      duration: 0.8,
      ease: 'power2.out',
    }, 0.75);

    tl.from('.hero-author-text', {
      xPercent: -100,
      duration: 0.9,
      ease: 'expo.out',
    }, 0.9);

    // Bloco esquerdo: a borda primeiro, depois cada linha saindo de tras
    // dela. O overflow:hidden da lista e o que faz a linha "existir"
    // apenas depois de passar a borda.
    tl.from('.services-border', {
      scaleY: 0,
      transformOrigin: 'top',
      duration: 0.8,
      ease: 'power2.out',
    }, 0.6);

    /* Distancia curta como a do bloco do autor, nao a largura inteira da
       linha: o texto e largo e viajar 105% dele deixaria a entrada
       arrastada e diferente do resto. Quem esconde e o clip; o x so da o
       empurrao. */
    tl.from('.services-text p', {
      x: -190,
      clipPath: 'inset(0px 100% 0px 0px)',
      opacity: 0,
      duration: 0.9,
      stagger: 0.09,
      ease: 'expo.out',
    }, 0.72);

    tl.from('.hero-services-index, .hero-ctas', {
      x: -30,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: 'power2.out'
    }, 0.9);

    // ============ SCROLL: o caminho de volta ============
    // Tudo desfaz o proprio gesto de entrada, e o EXPLORE ocupa o vazio.
    // Como e scrub, subir de novo remonta a cena sozinho — a timeline nao
    // guarda estado, ela e lida na posicao do scroll.
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        // recalcula o `x` da linha do meio quando a largura muda
        invalidateOnRefresh: true,
      }
    });

    // SMA e ABS se recolhem para dentro da margem do meio de onde
    // nasceram. Nao ha fade: quem os faz sumir e a propria margem.
    scrollTl.to('.line-1', { x: encostaEsquerda, ease: 'none' }, 0);
    scrollTl.to('.line-3', { x: encostaDireita, ease: 'none' }, 0);

    // RTL se afasta ate sumir por inteiro. Mesma posicao e mesma duracao
    // dos tweens de SMA e ABS, entao os tres terminam no mesmo quadro:
    // os dois entram na margem no exato momento em que este chega a zero.
    scrollTl.to('.line-2', {
      scale: 0,
      z: -1400,
      transformOrigin: '50% 50%',
      ease: 'none',
    }, 0);

    // Bloco esquerdo: as linhas se recolhem para tras da borda...
    scrollTl.to('.services-text p', { x: -190, clipPath: 'inset(0px 100% 0px 0px)', opacity: 0, stagger: 0.05, ease: 'none' }, 0);
    scrollTl.to('.hero-services-index, .hero-ctas', { x: -60, opacity: 0, ease: 'none' }, 0.05);
    // ...e so entao a borda recolhe, ficando por ultimo. Ela e a ultima
    // coisa a sair porque foi a primeira a entrar.
    scrollTl.to('.services-border', { scaleY: 0, transformOrigin: 'top', ease: 'none' }, 0.3);

    // Bloco direito: desempilha para cima, na ordem inversa da entrada.
    scrollTl.to('.empilha', { y: -34, opacity: 0, stagger: { each: 0.06, from: 'end' }, ease: 'none' }, 0);
    // O autor volta por onde veio: para tras da propria margem.
    scrollTl.to('.hero-author-text', { xPercent: -100, opacity: 0, ease: 'none' }, 0.05);
    scrollTl.to('.author-border', { scaleY: 0, transformOrigin: 'top', ease: 'none' }, 0.3);

    scrollTl.to('.grid-num', { opacity: 0, ease: 'none' }, 0);

    // EXPLORE toma o lugar deixado — cinza translucido, marca d'agua e
    // nao manchete. Em Solda ele competiria com o tipo que acabou de sair.
    scrollTl.fromTo('.hero-explore-text',
      { y: '18vh', opacity: 0, scale: 0.86 },
      { y: '0vh', opacity: 0.45, scale: 1, ease: 'none' },
      0.12
    );

    return () => {
      gsap.ticker.remove(mascararNaMargem);
    };
  }, { scope: container });

  return (
    <section className="hero-section" ref={container}>
      {/* Background Image */}
      <div className="hero-bg-image" data-deriva="0.20"></div>

      {/* Grid Lines */}
      <div className="hero-grid">
        {[
          { num: '001', title: 'DISCOVERY' },
          { num: '002', title: 'DESIGN' },
          { num: '003', title: 'BUILD' },
          { num: '004', title: 'SCALE' }
        ].map((item) => (
          <div className="grid-line" key={item.num}>
            <span className="grid-num">{item.num}</span>
            <div className="grid-phase-container">
              <span className="grid-phase">
                <span className="text-cal">FASE</span>
                <span className="text-solda">/{item.title}</span>
              </span>
              <div className="grid-level">
                <div className="level-dot active blink"></div>
                <div className="level-dot"></div>
                <div className="level-dot"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Massive Typography */}
      <div className="hero-massive-text">
        <div className="massive-line line-1" aria-label="SMA"><Letras texto="SMA" /></div>
        <div className="massive-line line-2" aria-label="RTL"><Letras texto="RTL" /></div>
        <div className="massive-line line-3" aria-label="ABS"><Letras texto="ABS" /></div>
      </div>

      {/* ── a marca em corpo maximo, so no telefone ──
          O `.hero-massive-text` acima parte "SMARTLABS" em SMA/RTL/ABS e
          espalha os tres por 905px em recuos diferentes: e um desenho de
          tela larga, e no telefone vira tres pedacos atravessando o
          conteudo todo (foi o defeito do print).

          Aqui a palavra volta a ser palavra, em duas linhas que enchem a
          largura — 121px e 167px, medidos para dar exatamente os 374px
          uteis. Fica atras da grade de fases, como "VERTICAL" fica na
          referencia. */}
      {/* Cada palavra mora numa JANELA de `overflow:hidden`. A borda da
          janela e a "linha imaginaria": SMART entra descendo pela borda
          de cima da sua, LABS subindo pela de baixo da dele. Sem a
          janela o texto apareceria vindo de fora do bloco, atravessando
          o que estiver no caminho, em vez de nascer da linha. */}
      <div className="marca-movel" aria-hidden="true">
        <span className="marca-movel__jan">
          <span className="marca-movel__linha marca-movel__linha--a">SMART</span>
        </span>
        <span className="marca-movel__jan">
          <span className="marca-movel__linha marca-movel__linha--b">LABS</span>
        </span>
      </div>

      {/* EXPLORE Text Sequence */}
      <div className="hero-explore-container">
        <div className="hero-explore-text font-display">
          EXPLORE
        </div>
      </div>

      {/* Content Blocks */}
      <div className="hero-content">
        
        {/* Top Right Block */}
        <div className="hero-block-top">
          {/* Tres linhas, nao duas. Em telas largas a 1 e a 2 correm
              juntas e o desenho continua o de sempre; abaixo de 560px
              cada uma vira bloco com CORPO PROPRIO, calibrado para
              preencher a largura util — o mesmo principio tipografico da
              referencia, onde as tres linhas tem 62, 72 e 50px
              justamente para todas medirem o mesmo. */}
          <h2 className="hero-headline font-display" data-deriva="-0.40">
            <span className="empilha text-solda hh hh--1">A FORMA DO</span>
            <span className="empilha text-cal hh hh--2">SEU NEGÓCIO</span>
            <span className="empilha text-cal hh hh--3">NO MUNDO DIGITAL.</span>
          </h2>
          <p className="hero-subheadline empilha" data-deriva="-0.30">
            Seu negócio pode ser excelente.<br/>
            Mas se a sua presença digital não transmite isso,<br/>
            você está deixando valor na mesa.
          </p>
          <div className="hero-author-container" data-deriva="-0.15" style={{ position: 'relative', display: 'flex' }}>
            <div className="author-border" style={{ width: '7px', backgroundColor: 'var(--solda)', marginRight: '10px' }}></div>
            <div style={{ overflow: 'hidden' }}>
              <div className="hero-author hero-author-text" style={{ paddingLeft: 0 }}>
                <span className="author-name">ISRAEL PASSOS</span>
                <span className="author-role">ARQUITETO DE AI</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Left Block */}
        <div className="hero-block-bottom" data-deriva="-0.18">
          <div className="hero-services-layout">
            <div className="hero-services-index">
              <span className="index-label">SML/IP</span>
              <span className="index-year">2026</span>
            </div>
            
            <div className="hero-services-list font-mono" style={{ position: 'relative', paddingLeft: 'var(--space-2)' }}>
              <div className="services-border" style={{ position: 'absolute', top: 0, left: 0, width: '7px', height: '100%', backgroundColor: '#333333' }}></div>
              <div className="services-text">
                <p>Da identidade visual à arquitetura do site.</p>
                <p>Da experiência do usuário à segurança.</p>
                <p>Da captação de tráfego ao atendimento.</p>
                <p>Da apresentação da sua marca à automação<br/>dos processos que acontecem por trás dela.</p>
                <p className="hero-highlight">Eu dou forma ao seu negócio digital.</p>
              </div>
            </div>
          </div>
          
          <div className="hero-ctas">
            {/* Some no telefone: numa tela onde o heroi ja ocupa a
                altura inteira, dois pedidos de acao competem entre si e
                nenhum ganha. Fica o que leva ao contato. */}
            <span className="so-desktop"><PlateButton href="#projetos">CONHECER A SMARTLABS</PlateButton></span>
            <PlateButton href="#contato" variant="secondary">FALAR SOBRE MEU PROJETO</PlateButton>
          </div>
        </div>

      </div>
    </section>
  );
}
