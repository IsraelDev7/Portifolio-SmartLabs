import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import NomeAlgoritmo from '../components/NomeAlgoritmo';

/**
 * Footer — reconstrucao do rodape da referencia (vertical.framer.media),
 * medido no DOM em viewport de 1280x800:
 *
 *   nome em corpo maximo · telefone 24px / e-mail 16px em x=48
 *   endereco em x=286 (rotulo 20px, linhas 16px)
 *   colunas de links em x=681, 16px · marca em corpo maximo no pe
 *
 * O painel deles e verde-limao; aqui e ACO — a chapa escura da marca. A
 * troca nao e so de cor: sobre verde o texto e preto e o contraste vem
 * do fundo; sobre Aco quem carrega o contraste e o Cal, e as reguas
 * precisam ser de Linha e nao de preto para nao sumirem.
 *
 * O PENTE no topo do painel — os tracos verticais — vem da referencia e
 * e o que costura o rodape ao corpo da pagina, evitando que o painel
 * pareca uma caixa colada no fim.
 *
 * Telefone e e-mail copiam ao clique, com aviso no lugar do proprio
 * texto, tambem como na referencia.
 */

const NAV = [
  { rotulo: 'Home', para: '/' },
  { rotulo: 'Work', para: '/work' },
  { rotulo: 'About', para: '/about' },
  { rotulo: 'Thoughts', para: '/thoughts' },
  { rotulo: 'Contact', para: '/contact' },
  { rotulo: 'Privacidade', para: '/privacidade' },
  { rotulo: 'Termos de uso', para: '/termos' },
];

const REDES = [
  { rotulo: 'Instagram', url: 'https://www.instagram.com/israelp.fernandes/' },
  { rotulo: 'X (Twitter)', url: 'https://x.com/home' },
  { rotulo: 'LinkedIn', url: 'https://www.linkedin.com/in/israel-passos-281374336/' },
];

const EMAIL = 'israel.devpf@gmail.com';
const TELEFONE = '(62) 99287-9300';

export default function Footer() {
  const [copiado, setCopiado] = useState(null);

  const copiar = useCallback((chave, valor) => {
    /* clipboard.writeText nao existe fora de https/localhost e rejeita
       quando a aba nao esta em foco. Falhar em silencio deixaria o
       usuario achando que copiou. */
    const feito = () => {
      setCopiado(chave);
      window.setTimeout(() => setCopiado((c) => (c === chave ? null : c)), 1600);
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(valor).then(feito, () => setCopiado(`${chave}-erro`));
    } else {
      setCopiado(`${chave}-erro`);
    }
  }, []);

  const aoTopo = () => {
    if (window.__lenis) window.__lenis.scrollTo(0, { duration: 1.1 });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="pe">
      {/* A faixa de chamada saiu daqui: o pedido de acao agora fica no
          bloco Sobre, logo abaixo da lista do oficio, onde o leitor
          acabou de ler o que eu faco. Aqui embaixo ela abria um vao de
          uma tela inteira antes do painel. */}
      <div className="pe__painel">
        {/* o pente costura o painel ao corpo da pagina */}
        <div className="pe__pente" aria-hidden="true">
          {Array.from({ length: 64 }, (_, i) => <i key={i} />)}
        </div>

        <h2 className="pe__nome">
          <NomeAlgoritmo texto="Israel Passos" />
        </h2>

        <div className="pe__grade">
          {/* contato: barra vertical, telefone, e-mail */}
          <div className="pe__contato">
            <button
              type="button"
              className="pe__tel"
              onClick={() => copiar('tel', TELEFONE)}
              aria-label={`Copiar telefone ${TELEFONE}`}
            >
              {copiado === 'tel' ? 'Telefone copiado!' : TELEFONE}
            </button>
            <button
              type="button"
              className="pe__email"
              onClick={() => copiar('mail', EMAIL)}
              aria-label={`Copiar e-mail ${EMAIL}`}
            >
              {copiado === 'mail' ? 'E-mail copiado!' : EMAIL}
            </button>
            {copiado?.endsWith('-erro') && (
              <span className="pe__aviso" role="status">
                Não consegui copiar — selecione e copie à mão.
              </span>
            )}
          </div>

          {/* escritorio */}
          <address className="pe__escritorio">
            <span className="pe__rotulo-end">Escritório</span>
            Avenida Portugal, 1148, Sala 409<br />
            Órion Business &amp; Health Complex<br />
            Goiânia, Goiás 74150-340<br />
            Brasil
            <span className="pe__cnpj">Smart LABS · CNPJ 53.243.609/0001-58</span>
          </address>

          <nav className="pe__nav" aria-label="Navegação do rodapé">
            {NAV.map((l) => (
              <Link key={l.para} to={l.para}>{l.rotulo}</Link>
            ))}
          </nav>

          <nav className="pe__redes" aria-label="Redes sociais">
            {REDES.map((l) => (
              <a key={l.url} href={l.url} target="_blank" rel="noreferrer">{l.rotulo}</a>
            ))}
            <Link to="/404">404</Link>
          </nav>
        </div>

        {/* a marca em corpo maximo, fechando */}
        <div className="pe__marca" aria-hidden="true">SMART LABS</div>

        <div className="pe__base">
          <span>© {new Date().getFullYear()} SmartLABS · Israel Passos. Todos os direitos reservados.</span>
          <button type="button" className="pe__subir" onClick={aoTopo} aria-label="Voltar ao topo">
            ↑
          </button>
          <span className="pe__lugar">Goiânia, BR</span>
        </div>
      </div>
    </footer>
  );
}
