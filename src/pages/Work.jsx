import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePageMotion } from '../hooks/usePageMotion';
import Letras from '../components/Letras';
import Persiana from '../components/Persiana';

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
 * Nomes, clientes e datas ficam como PLACEHOLDER ate o portfolio chegar.
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
  { n: '04', titulo: ['[ nome do', 'projeto ]'], sub: '[ uma linha dizendo o que o projeto e ]',
    cliente: '[ cliente ]', tipo: '[ tipo de projeto ]', data: '[ mês e ano ]',
    legenda: '[ o problema que existia, e o que a estrutura nova resolveu. duas ou tres linhas. ]',
    imagem: '/images/work-infra.jpg', para: null },
];

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
