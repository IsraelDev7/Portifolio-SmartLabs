import React from 'react';
import { Link } from 'react-router-dom';
import Firma from '../components/Firma';
import Letras from '../components/Letras';
import Falha from '../components/Falha';

/**
 * Sobre — o bloco "quem eu sou", reconstruido sobre o "I'AM" da
 * referencia (vertical.framer.media), medido no DOM em 1280x800.
 *
 * Ordem de leitura: identidade em corpo maximo (cinza + acento), regua,
 * linha em mono, assinatura de punho, citacao grande, retrato |
 * manifesto, prosa | oficio. Fecha com a narrativa em cadeia — pessoas,
 * negocios, tecnologia, sistemas, SmartLABS — que nao existe na
 * referencia e e a espinha desta secao.
 *
 * Um componente para os DOIS lugares: a rota /about e o corpo da home.
 * Duplicar a marcacao seria garantir que as duas versoes divergissem na
 * primeira correcao feita so em uma delas.
 *
 * `variante`:
 *   pagina  — a rota /about, com respiro de topo de pagina e <h1>
 *   secao   — dentro da home, respiro de secao e <h2>: este bloco nao e
 *             o assunto da home, e sim o fecho dela
 *
 * Quem anima e o usePageMotion da PAGINA, pelos atributos data-anim: as
 * duas paginas ja o chamam, entao o bloco nao carrega hook proprio.
 */
export default function Sobre({ variante = 'pagina' }) {
  const Cabeca = variante === 'pagina' ? 'h1' : 'h2';

  return (
    <div className={`sobre sobre--${variante}`}>
      {/* ── 1 · identidade ── */}
      <header className="sobre__topo">
        <Cabeca className="sobre__eu" aria-label="Eu sou Israel Passos">
          <span className="sobre__eu-cinza" aria-hidden="true">
            <Letras texto="EU SOU" />
          </span>
          <span className="sobre__eu-nome" aria-hidden="true">
            <Letras texto="ISRAEL PASSOS" />
          </span>
        </Cabeca>

        <i className="sobre__regua" data-anim="line" aria-hidden="true" />

        <p className="sobre__linha-mono">
          Construindo sistemas na fronteira entre pessoas e tecnologia.
        </p>

        {/* ── 2 · a assinatura, escrita traco a traco ── */}
        <div className="sobre__firma">
          <Firma largura={260} />
          <span className="sobre__cargo">Arquiteto digital · SmartLABS</span>
        </div>

        {/* ── 3 · a frase que abre a secao ── */}
        <blockquote className="sobre__citacao">
          <p>Eu não cheguei à tecnologia por um único caminho.</p>
          <cite>— Israel Passos</cite>
        </blockquote>
      </header>

      {/* ── 4 · retrato | manifesto ── */}
      <section className="sobre__par">
        <figure className="sobre__retrato">
          <Falha imagem="/images/retrato.jpg" faixas={20} posicao="center 18%" />
        </figure>

        <div className="sobre__manifesto">
          <p className="sobre__manifesto-frase" data-anim="rise">
            Eu trabalho entre <b>pessoas</b>, <b>negócios</b>, <b>tecnologia</b> e{' '}
            <b>sistemas</b>.
          </p>

          <p className="sobre__manifesto-nota">
            Todo projeto começa por uma pergunta.
            <br />
            A experiência decide o passo seguinte.
          </p>

          <i className="sobre__regua sobre__regua--fina" aria-hidden="true" />

          <div className="sobre__redes">
            <span className="sobre__rotulo">Redes</span>
            <ul>
              <li><a href="https://github.com/IsraelDev7" target="_blank" rel="noreferrer">GitHub</a></li>
              <li><a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">LinkedIn</a></li>
              <li><a href="https://www.instagram.com/" target="_blank" rel="noreferrer">Instagram</a></li>
              <li><a href="/contact">E-mail</a></li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── 5 · a trajetoria | o que eu faco ── */}
      <section className="sobre__par sobre__par--baixo">
        <div className="sobre__prosa">
          <h2 className="sobre__prosa-manchete" data-anim="rise">
            Minha formação é técnica.
            <br />
            <em>Minha experiência é humana.</em>
          </h2>

          <div className="sobre__prosa-corpo" data-anim="stagger">
            <p>
              Antes da SmartLABS, minha trajetória passou por ambientes que não
              se parecem entre si — gestão de equipes, consultoria de tecnologia
              no mercado de investimentos, palestras e projetos de impacto
              social.
            </p>
            <p>
              Experiências diferentes, com uma coisa em comum: <b>pessoas</b>.
            </p>
            <p>
              Estar perto delas me ensinou algo que nenhum software ensina. Por
              trás de cada decisão existe uma motivação. Por trás de cada compra
              existe uma emoção. Por trás de cada negócio existe alguém tentando
              resolver alguma coisa.
            </p>
            <p className="sobre__prosa-fecho">
              A SmartLABS existe porque entender isso mudou a forma como eu
              construo tecnologia.
            </p>
          </div>
        </div>

        <div className="sobre__oficio">
          <span className="sobre__rotulo">O que eu faço</span>
          <ul className="sobre__lista" data-anim="stagger">
            <li>Gestão de equipes</li>
            <li>Consultoria de tecnologia em investimentos</li>
            <li>Palestras</li>
            <li>Projetos sociais</li>
            <li>Desenvolvimento full-stack</li>
            <li>Prompt engineering</li>
            <li>Inteligência artificial</li>
            <li>Tráfego pago</li>
            <li>Automação de processos</li>
            <li>Agentes de atendimento</li>
          </ul>

          {/* O pedido de acao fecha a lista, como no modelo: o leitor
              acabou de ler o que eu faco, e o botao vem na sequencia.
              Antes ele morava no rodape, uma tela inteira depois. */}
          <Link className="sobre__acao" to="/contact" data-anim="rise">
            <span>Falar com a SmartLABS</span>
            <i aria-hidden="true">▶▶</i>
          </Link>
        </div>
      </section>

      {/* ── 6 · a narrativa em cadeia ── */}
      <section className="sobre__cadeia" data-anim="stagger">
        <span>Pessoas</span>
        <i aria-hidden="true">→</i>
        <span>Negócios</span>
        <i aria-hidden="true">→</i>
        <span>Tecnologia</span>
        <i aria-hidden="true">→</i>
        <span>Sistemas</span>
        <i aria-hidden="true">→</i>
        <span className="sobre__cadeia-fim">SmartLABS</span>
      </section>
    </div>
  );
}
