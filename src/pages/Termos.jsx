import React from 'react';
import { Molde, Secao } from './Legal';

/**
 * Termos de Uso.
 *
 * NAO E PARECER JURIDICO. Cobre o que este site de fato e: um portfolio
 * com formulario de contato. Contrato de prestacao de servico, prazo,
 * escopo e pagamento sao tratados em documento proprio, por projeto — e
 * este texto diz isso em vez de fingir que os substitui.
 */
export default function Termos() {
  return (
    <Molde kicker="Legal" titulo="Termos de Uso" vigencia="8 de setembro de 2026">
      <Secao titulo="O que é este site">
        <p>
          Este é o site institucional e portfólio da <b>Smart LABS</b> (CNPJ
          53.243.609/0001-58) e de Israel Passos. Ele existe para apresentar
          trabalhos, explicar como trabalhamos e permitir contato.
        </p>
        <p>
          Ao navegar aqui, você concorda com estes termos. Se não concordar,
          basta não usar o site.
        </p>
      </Secao>

      <Secao titulo="O que este site não é">
        <p>
          Nada nesta página constitui proposta comercial vinculante, contrato,
          garantia de resultado ou consultoria técnica aplicada ao seu caso.
          Projetos são contratados por documento próprio, com escopo, prazo e
          valores definidos caso a caso.
        </p>
      </Secao>

      <Secao titulo="Uso permitido">
        <p>Você pode navegar, ler, compartilhar links e entrar em contato. Você não pode:</p>
        <ul>
          <li>copiar, reproduzir ou redistribuir o conteúdo como se fosse seu;</li>
          <li>usar textos, imagens ou código deste site em material comercial sem autorização por escrito;</li>
          <li>tentar acessar áreas restritas, sondar vulnerabilidades ou sobrecarregar a infraestrutura;</li>
          <li>usar robôs para extração em massa do conteúdo.</li>
        </ul>
      </Secao>

      <Secao titulo="Propriedade intelectual">
        <p>
          Textos, identidade visual, fotografias, código e demais elementos
          deste site pertencem à Smart LABS ou a Israel Passos, salvo onde
          indicado de outra forma. Os trabalhos apresentados no portfólio podem
          conter marcas de terceiros, exibidas apenas para identificar o projeto
          e pertencentes aos seus respectivos titulares.
        </p>
      </Secao>

      <Secao titulo="Links para outros sites">
        <p>
          Este site aponta para perfis e serviços de terceiros. Não temos
          controle sobre o conteúdo, a disponibilidade ou as práticas de
          privacidade deles, e não respondemos por isso.
        </p>
      </Secao>

      <Secao titulo="Disponibilidade">
        <p>
          O site é oferecido no estado em que se encontra. Podemos alterar,
          suspender ou descontinuar qualquer parte dele a qualquer momento, sem
          aviso prévio, e não garantimos funcionamento ininterrupto ou livre de
          erros.
        </p>
      </Secao>

      <Secao titulo="Limitação de responsabilidade">
        <p>
          Na medida permitida pela lei brasileira, não respondemos por danos
          indiretos, lucros cessantes ou perda de dados decorrentes do uso ou da
          impossibilidade de uso deste site. Esta limitação não afasta direitos
          do consumidor previstos em lei.
        </p>
      </Secao>

      <Secao titulo="Privacidade">
        <p>
          O tratamento de dados pessoais é descrito na{' '}
          <a href="/privacidade">Política de Privacidade</a>, que faz parte
          destes termos.
        </p>
      </Secao>

      <Secao titulo="Lei aplicável e foro">
        <p>
          Estes termos são regidos pela lei brasileira. Fica eleito o foro da
          comarca de Goiânia, Goiás, para dirimir controvérsias, ressalvado o
          direito do consumidor de escolher o foro do seu domicílio.
        </p>
      </Secao>

      <Secao titulo="Mudanças nestes termos">
        <p>
          Podemos revisar este texto. Quando isso acontecer, a data de vigência
          no topo muda junto, e o uso continuado do site significa concordância
          com a versão vigente.
        </p>
      </Secao>
    </Molde>
  );
}
