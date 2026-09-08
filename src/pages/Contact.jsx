import React from 'react';
import { usePageMotion } from '../hooks/usePageMotion';
import RedesPixel from '../components/RedesPixel';

/**
 * Contact — reconstruida sobre a pagina de contato da referencia
 * (vertical.framer.media/contact), medida no DOM em 1280x800:
 *
 *   secao   ~720px de altura — cabe numa tela
 *   coluna esquerda   x=24,  largura 591
 *   coluna direita    x=781, largura 444
 *   titulo 70px · prosa da direita 20px · rotulo de papel 14px
 *
 * A caixa da direita saiu da esquerda: la e onde a referencia poe o
 * bloco de apresentacao, logo acima do formulario, e e onde ele funciona
 * — o convite fica junto do campo que responde a ele.
 *
 * O espaco que sobrou na esquerda recebe a regua e as redes. Ficar vazio
 * seria desperdicio; encher de texto seria repetir o que ja esta dito
 * dois palmos acima.
 *
 * O fundo e uma imagem com sombra descendo ate o Aco solido. Sem a
 * sombra o formulario disputaria leitura com a foto justamente onde ele
 * precisa ser lido.
 */
export default function Contact() {
  const motionRef = usePageMotion();

  return (
    <div ref={motionRef} className="contato">
      <div className="contato__fundo" aria-hidden="true">
        <div
          className="contato__foto"
          style={{ backgroundImage: 'url(/images/contato-fundo.jpg)' }}
        />
        <div className="contato__sombra" />
      </div>

      <div className="contato__grade">
        {/* ── esquerda: a chamada, a regua e as redes ── */}
        <div className="contato__esq">
          <div className="contato__caixa" data-anim="rise">
            <h1 className="contato__titulo">
              Vamos construir algo que mereça ser visto.
            </h1>
            <p className="contato__prosa">
              Se você está construindo uma empresa, reposicionando uma marca ou
              simplesmente percebeu que sua estrutura digital já não representa o
              nível do seu negócio, talvez seja hora de reconstruí-la.
            </p>
          </div>

          <div className="contato__pe">
            <i className="contato__regua" aria-hidden="true" />
            <span className="contato__rotulo">Redes</span>
            <RedesPixel className="contato__redes" />
          </div>
        </div>

        {/* ── direita: o convite e o formulario ── */}
        <div className="contato__dir">
          <div className="contato__caixa contato__caixa--dir" data-anim="rise">
            <p className="contato__convite">
              <b>Conte-me sobre o projeto.</b>
            </p>
            <ul className="contato__perguntas">
              <li>O que você está construindo?</li>
              <li>Onde está o problema?</li>
              <li>E onde você quer chegar?</li>
            </ul>
            <p className="contato__fecho">
              Eu vou analisar o cenário e entender se existe uma solução que faça
              sentido.
            </p>
          </div>

          <form className="contato__forma" data-anim="stagger">
            <div className="contato__par">
              <label>
                <span>Nome</span>
                <input type="text" name="nome" placeholder="Seu nome" autoComplete="name" />
              </label>
              <label>
                <span>Empresa</span>
                <input type="text" name="empresa" placeholder="Nome da empresa" autoComplete="organization" />
              </label>
            </div>

            <div className="contato__par">
              <label>
                <span>E-mail</span>
                <input type="email" name="email" placeholder="Seu e-mail" autoComplete="email" />
              </label>
              <label>
                <span>WhatsApp</span>
                <input type="tel" name="whatsapp" placeholder="Seu WhatsApp" autoComplete="tel" />
              </label>
            </div>

            <label className="contato__campo-largo">
              <span>Sobre o projeto</span>
              <textarea
                name="mensagem"
                rows="3"
                placeholder="Descreva brevemente o que você precisa construir, melhorar ou automatizar."
              />
            </label>

            <button type="submit" className="contato__enviar">
              Enviar
              <i aria-hidden="true">▶▶</i>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
