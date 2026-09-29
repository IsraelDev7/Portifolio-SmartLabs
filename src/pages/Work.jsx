import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePageMotion } from '../hooks/usePageMotion';
import Letras from '../components/Letras';
import Persiana from '../components/Persiana';
import Canteiro from '../components/Canteiro';

gsap.registerPlugin(ScrollTrigger);

/**
 * Work — reconstruida sobre a /work da referencia, medida no DOM em
 * 1280x800:
 *
 *   bloco de projeto a cada 640px · rotulo "(Project)" 12px em x=24
 *   titulo 90px em duas linhas (entrelinha 1.0) · ficha indentada 20px
 *   com barra a esquerda · data 12px · legenda sobre a imagem em x=581
 *
 * Entre o texto e a imagem corre a COLUNA DE FIOS: hairlines verticais
 * que se abrem a partir do lado da imagem quando o bloco entra. Nao e
 * enfeite — e ela que costura as duas metades, que de outro jeito seriam
 * duas colunas soltas lado a lado.
 *
 * A imagem se monta em ripas (ver <Persiana>), e a legenda so aparece sob
 * o cursor: e a informacao de apoio, nao concorrente da foto.
 *
 * As quatro obras sao reais e as quatro tem pagina: cada card leva a
 * /work/<slug>. Nao ha mais placeholder aqui — se entrar uma obra nova
 * sem pagina, ela vai para OUTRAS_OBRAS e aparece SEM link, que e a
 * regra de nao prometer destino que nao existe.
 */

const OBRAS = [
  { n: '01', titulo: ['BRUNO', 'GUTIERRES'], sub: 'Três portas, dois públicos, um registro só.',
    cliente: 'Aconselhamento · Property care', tipo: 'Landing · Link na bio · Site institucional',
    data: 'Set 2026',
    legenda: 'Três endereços no ar e nenhum deles registrava de onde vinha um contato. Hoje cada clique guarda a porta por onde entrou, e o resumo do dia chega às 23h no WhatsApp do dono.',
    imagem: '/images/obra-bruno-heroi.jpg', para: '/work/bruno-gutierres' },
  { n: '02', titulo: ['DANILA', 'SOUZA'], sub: 'Três idiomas, um assunto que não admite descuido.',
    cliente: 'Psicanálise · Editorial', tipo: 'Site · Link na bio · Redação e tradução',
    data: 'Set 2026',
    legenda: 'Começou como site e link na bio para uma psicanalista que atende mulheres saindo de relações abusivas. Terminou com o livro dela saindo também em inglês e espanhol, escrito por quem tinha sido contratado para programar.',
    imagem: '/images/obra-danila-heroi.jpg', para: '/work/danila-souza' },
  { n: '03', titulo: ['TL', 'GARDEN'], sub: 'O lead chega com o diagnóstico na mão.',
    cliente: 'Paisagismo · Surrey, UK', tipo: 'Site · Motor de diagnóstico · SEO',
    data: 'Set 2026',
    legenda: 'Sete anos cuidando de jardins em Surrey, e todo orçamento começando do zero. O site passou a fazer sete perguntas antes e a devolver um índice de saúde na tela — a conversa agora começa no segundo assunto.',
    imagem: '/images/obra-tiago-heroi.jpg', para: '/work/tl-garden' },
  { n: '04', titulo: ['SMART', 'LABS'], sub: 'A prova desta obra é a página em que você está.',
    cliente: 'Obra própria · Método', tipo: 'Identidade · Site · Motor de movimento',
    data: 'Set 2026',
    legenda: 'As outras três você precisa acreditar que ficaram boas. Esta você está usando agora: 9.337 linhas de JavaScript e 6.315 de CSS escritas à mão, medidas em três larguras antes de subir.',
    imagem: '/images/obra-smartlabs-heroi.jpg', para: '/work/portfolio-smartlabs' },

  /* ── as duas em obra ──
     `emObra: true` e um terceiro estado, entre o card com destino e o
     card morto. Sem pagina para levar, mas COM trabalho acontecendo —
     e o clique conta isso em vez de nao fazer nada.

     Cliente, tipo e legenda ficam propositalmente curtos: o que eu sei
     destas duas hoje e o nome. Inventar setor, problema e resultado
     para preencher a ficha seria a mesma mentira que os placeholders
     das outras quatro eram, e que ja custou uma correcao aqui. */
  { n: '05', titulo: ['STS', ''], sub: 'Em construção.',
    cliente: 'Rodrigo', tipo: 'Escopo em definição', data: '2026',
    legenda: 'A página desta obra está sendo montada. O trabalho está em andamento — clique para ver o canteiro.',
    imagem: '/images/obra-smartlabs-sistema.jpg', para: null, emObra: true },
  { n: '06', titulo: ['NAILS', 'DESIGN'], sub: 'Em construção.',
    cliente: 'Rayssa', tipo: 'Nail design', data: '2026',
    legenda: 'A página desta obra está sendo montada. O trabalho está em andamento — clique para ver o canteiro.',
    imagem: '/images/obra-smartlabs-acabamento.jpg', para: null, emObra: true },
];

/**
 * PecaEmObra — o card que nao leva a lugar nenhum porque o lugar ainda
 * esta sendo feito.
 *
 * E um <button> e nao um <div>: ele FAZ alguma coisa quando clicado,
 * entao precisa do foco de teclado, do Enter e do Espaco de graca. E
 * `aria-pressed` conta o estado a quem nao ve a engrenagem girando.
 *
 * O aviso vai num `role="status"` separado porque o conteudo do botao
 * muda: leitor de tela anuncia a mudanca sem a pessoa ter que sair e
 * voltar ao elemento para descobrir o que aconteceu.
 */
function PecaEmObra({ obra }) {
  const [aberto, setAberto] = useState(false);

  return (
    <>
      <button
        type="button"
        className={`obra__peca obra__peca--obra${aberto ? ' e-aberto' : ''}`}
        aria-pressed={aberto}
        aria-label={`${obra.titulo.join(' ').trim()} — obra em construção`}
        onClick={() => setAberto((v) => !v)}
      >
        <Persiana imagem={obra.imagem} className="obra__persiana" />
        <Canteiro aberto={aberto} />
        <span className="obra__legenda">
          {obra.legenda}
          <b>{aberto ? 'Fechar o canteiro' : 'Ver o canteiro'}</b>
        </span>
      </button>
      <p className="visualmente-oculto" role="status">
        {aberto ? `${obra.titulo.join(' ').trim()}: obra em construção, página sendo montada.` : ''}
      </p>
    </>
  );
}

export default function Work() {
  const motionRef = usePageMotion();
  const alvo = useRef(null);

  useGSAP(() => {
    const raiz = alvo.current;
    const reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduz) {
      gsap.set(raiz.querySelectorAll('.obra__fios i'), { scaleY: 1 });
      return;
    }

    /* Os fios se abrem A PARTIR DO LADO DA IMAGEM: o stagger vem de
       'end', entao o ultimo fio — o encostado na foto — sai primeiro e a
       leva se propaga em direcao ao texto. */
    gsap.utils.toArray(raiz.querySelectorAll('.obra__fios')).forEach((col) => {
      gsap.fromTo(col.querySelectorAll('i'),
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 0.7,
          ease: 'power3.out',
          stagger: { each: 0.028, from: 'end' },
          scrollTrigger: { trigger: col, start: 'top 88%', toggleActions: 'restart none none reverse' },
        });
    });

    /* A legenda segue o cursor. quickSetter no lugar de gsap.to a cada
       pointermove: escrita direta, sem criar um tween por evento — sao
       dezenas por segundo. */
    gsap.utils.toArray(raiz.querySelectorAll('.obra__peca')).forEach((peca) => {
      const leg = peca.querySelector('.obra__legenda');
      if (!leg) return;
      const porX = gsap.quickSetter(leg, 'x', 'px');
      const porY = gsap.quickSetter(leg, 'y', 'px');

      const mover = (e) => {
        const r = peca.getBoundingClientRect();
        porX(e.clientX - r.left);
        porY(e.clientY - r.top);
      };
      peca.addEventListener('pointermove', mover);
      return () => peca.removeEventListener('pointermove', mover);
    });
  }, { scope: alvo });

  return (
    <div ref={motionRef}>
      <div className="obras" ref={alvo}>
        <header className="obras__capa">
          <h1 className="obras__titulo" aria-label="Selected Work">
            <Letras texto="SELECTED WORK" />
          </h1>
          <p className="obras__intro">
            Projetos não são apenas o que eu construí. São problemas que eu resolvi.
          </p>
        </header>

        {OBRAS.map((o) => (
          <article className="obra" key={o.n}>
            <div className="obra__texto">
              <span className="obra__rotulo">(Projeto {o.n})</span>
              <h2 className="obra__nome">
                {o.titulo[0]}
                <br />
                {o.titulo[1]}
              </h2>
              <p className="obra__sub">{o.sub}</p>

              <div className="obra__ficha">
                <p className="obra__cliente">
                  {o.cliente}
                  <br />
                  {o.tipo}
                </p>
                <p className="obra__data">{o.data}</p>
              </div>
            </div>

            {/* a coluna de fios que costura as duas metades */}
            <div className="obra__fios" aria-hidden="true">
              {Array.from({ length: 9 }, (_, i) => <i key={i} />)}
            </div>

            {/* ── por que a peca deixa de ser link quando `para` e null ──
                Os quatro cards apontavam para /contact enquanto nao
                tinham pagina. Quem clicava no projeto caía no
                formulario de contato sem entender por que — e um card
                que nao leva ao projeto e pior que um card que nao
                clica, porque o primeiro quebra a confianca no resto da
                navegacao.

                Sem destino, a peca vira <div>: sem cursor de mao, sem
                foco de teclado, sem promessa. */}
            {o.para ? (
              <Link className="obra__peca" to={o.para} aria-label={`Ver o projeto — ${o.titulo.join(' ')}`}>
                <Persiana imagem={o.imagem} className="obra__persiana" />
                <span className="obra__legenda">
                  {o.legenda}
                  <b>Ver o projeto</b>
                </span>
              </Link>
            ) : o.emObra ? (
              <PecaEmObra obra={o} />
            ) : (
              <div className="obra__peca obra__peca--sem-destino">
                <Persiana imagem={o.imagem} className="obra__persiana" />
                <span className="obra__legenda">
                  {o.legenda}
                  <b>Em breve</b>
                </span>
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
