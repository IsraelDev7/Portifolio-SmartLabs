import React from 'react';
import { usePageMotion } from '../hooks/usePageMotion';
import Firma from '../components/Firma';
import Letras from '../components/Letras';

/**
 * About — reconstrucao do bloco "I'AM" da referencia (vertical.framer.
 * media), medido no DOM em viewport de 1280x800.
 *
 * A ordem de leitura da referencia, que e a mesma aqui:
 *   1. identidade em corpo maximo, cinza + acento
 *   2. regua, e uma linha em mono dizendo o que a pessoa faz
 *   3. assinatura de punho + cargo
 *   4. uma frase grande entre aspas, com atribuicao
 *   5. retrato a esquerda | manifesto, notas e redes a direita
 *   6. prosa longa a esquerda | lista do que se faz a direita
 *
 * O sexto bloco fecha com a narrativa em cadeia, que nao existe na
 * referencia: e a espinha desta secao — pessoas, negocios, tecnologia,
 * sistemas, SmartLABS — e merece a ultima palavra.
 */
export default function About() {
  const motionRef = usePageMotion();

  return (
    <div ref={motionRef} className="sobre">
      {/* ── 1 · identidade ── */}
      <header className="sobre__topo">
        <h1 className="sobre__eu" aria-label="Eu sou Israel Passos">
          <span className="sobre__eu-cinza" aria-hidden="true">
            <Letras texto="EU SOU" />
          </span>
          <span className="sobre__eu-nome" aria-hidden="true">
            <Letras texto="ISRAEL PASSOS" />
          </span>
        </h1>

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
        <figure className="sobre__retrato" data-anim="frame">
          <div
            className="sobre__retrato-foto"
            style={{ backgroundImage: 'url(/images/retrato.jpg)' }}
            role="presentation"
          />
          <div className="sobre__linhas" aria-hidden="true" />
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
