import React from 'react';
import { Molde, Secao } from './Legal';

/**
 * Politica de Privacidade — escrita para a LGPD (Lei 13.709/2018), que e
 * a lei que se aplica a uma empresa brasileira tratando dados aqui.
 *
 * Escrita em portugues porque o site inteiro e em portugues. O texto que
 * o Israel passou vinha de um modelo em ingles; os identificadores
 * legais (CNPJ, endereco) foram mantidos ao pe da letra.
 *
 * NAO E PARECER JURIDICO. E uma base honesta e especifica para o que
 * este site realmente faz — um portfolio com formulario de contato e
 * medicao de audiencia. Se entrar cobranca, login ou tratamento de dado
 * sensivel, precisa passar por advogado antes de valer.
 */
export default function Privacidade() {
  return (
    <Molde kicker="Legal" titulo="Política de Privacidade" vigencia="8 de setembro de 2026">
      <Secao titulo="Quem trata os seus dados">
        <p>
          A <b>Smart LABS</b>, inscrita no CNPJ 53.243.609/0001-58, com sede na
          Avenida Portugal, 1148, Sala 409 — Órion Business &amp; Health
          Complex, Goiânia, Goiás 74150-340, Brasil, é a <b>controladora</b> dos
          dados pessoais tratados neste site, nos termos da Lei Geral de
          Proteção de Dados (Lei 13.709/2018).
        </p>
        <p>
          Para qualquer assunto relativo a dados pessoais, o contato é{' '}
          <a href="mailto:israel.devpf@gmail.com">israel.devpf@gmail.com</a>.
        </p>
      </Secao>

      <Secao titulo="Quais dados coletamos">
        <p>Este site coleta pouca coisa, e sempre com uma razão:</p>
        <ul>
          <li>
            <b>Dados que você envia</b> — nome, e-mail, telefone e a mensagem
            que você escrever no formulário de contato ou nos enviar por
            e-mail.
          </li>
          <li>
            <b>Dados de navegação</b> — páginas visitadas, tempo de permanência,
            origem do acesso, tipo de dispositivo e navegador, endereço IP
            aproximado. São coletados de forma agregada, para entender o que
            funciona no site.
          </li>
        </ul>
        <p>
          Não coletamos dados sensíveis, não pedimos documentos e não há
          cadastro nem área logada.
        </p>
      </Secao>

      <Secao titulo="Por que tratamos esses dados">
        <ul>
          <li>
            <b>Responder você</b> — base legal: execução de procedimentos
            preliminares a contrato, a seu pedido (art. 7º, V).
          </li>
          <li>
            <b>Entender e melhorar o site</b> — base legal: legítimo interesse
            (art. 7º, IX), limitado a medição de audiência.
          </li>
          <li>
            <b>Cumprir obrigação legal</b> quando houver (art. 7º, II).
          </li>
        </ul>
      </Secao>

      <Secao titulo="Com quem compartilhamos">
        <p>
          Não vendemos e não cedemos dados pessoais. Eles podem passar por
          prestadores que sustentam a operação do site — hospedagem, envio de
          e-mail e medição de audiência — sempre limitados ao necessário e
          obrigados contratualmente a proteger a informação.
        </p>
        <p>
          Alguns desses prestadores operam fora do Brasil. Nesses casos, a
          transferência internacional segue o art. 33 da LGPD.
        </p>
      </Secao>

      <Secao titulo="Por quanto tempo guardamos">
        <p>
          Mensagens de contato ficam guardadas enquanto durar a conversa e por
          até <b>2 anos</b> depois, para histórico de relacionamento. Dados de
          navegação agregados ficam por até <b>26 meses</b>. Passado o prazo, os
          dados são eliminados ou anonimizados.
        </p>
      </Secao>

      <Secao titulo="Cookies">
        <p>
          Usamos cookies necessários ao funcionamento do site e, se você
          consentir, cookies de medição de audiência. Você pode bloquear
          cookies nas configurações do seu navegador — o site continua
          funcionando, mas a medição deixa de existir.
        </p>
      </Secao>

      <Secao titulo="Seus direitos">
        <p>
          A LGPD garante a você, a qualquer momento e sem custo, o direito de
          pedir: confirmação de que tratamos seus dados; acesso a eles;
          correção de dado incompleto ou desatualizado; anonimização, bloqueio
          ou eliminação de dado desnecessário ou tratado em desconformidade;
          portabilidade; informação sobre com quem compartilhamos; e revogação
          do consentimento.
        </p>
        <p>
          Para exercer qualquer um deles, escreva para{' '}
          <a href="mailto:israel.devpf@gmail.com">israel.devpf@gmail.com</a>.
          Respondemos em até <b>15 dias</b>.
        </p>
      </Secao>

      <Secao titulo="Segurança">
        <p>
          Adotamos medidas técnicas e administrativas para proteger os dados —
          conexão cifrada (HTTPS), acesso restrito a quem precisa e credenciais
          guardadas fora do código. Nenhum sistema é infalível: se ocorrer
          incidente com risco relevante, comunicaremos você e a Autoridade
          Nacional de Proteção de Dados.
        </p>
      </Secao>

      <Secao titulo="Mudanças nesta política">
        <p>
          Quando esta política mudar, a data de vigência no topo muda junto.
          Alterações relevantes serão avisadas no próprio site.
        </p>
      </Secao>
    </Molde>
  );
}
