import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { PixelMonogram } from '../components/Logo/PixelMonogram';
import TransitionLink from './TransitionLink';
import { useLogoPixel } from '../hooks/useLogoPixel';
import { logoMontar } from '../lib/logoBus';

/* Quando o logo se monta.
   No primeiro carregamento ele entra junto com a cortina do preloader
   subindo; nas trocas de rota, no meio da varredura diagonal — assim ja
   esta se remontando quando a cortina passa, em vez de esperar ela sair.

   ALVO_PRIMEIRA e medido desde o carregamento da pagina, nao desde a
   execucao do efeito. Um contador de "primeira vez" seria consumido pela
   dupla-invocacao do <StrictMode>: a segunda passada ja acharia que era
   troca de rota e montaria o logo cedo demais, atras do preloader.

   O numero vem da linha do tempo do Preloader: 1s de texto + 0,5s de
   pausa + 1,2s de cortina = 2,7s. E a cortina SOBE, entao o topo da tela
   — onde mora a barra — e a ultima parte a ser liberada. Disparar antes
   de 2,6s gasta a montagem atras dela. */
const ALVO_PRIMEIRA = 2600;
const ESPERA_ROTA = 260;

export default function Navbar() {
  const location = useLocation();
  const svgRef = useRef(null);
  const nomeRef = useRef(null);

  useLogoPixel(svgRef, nomeRef);

  useEffect(() => {
    const agora = performance.now();
    const carregandoAinda = agora < ALVO_PRIMEIRA;
    const espera = carregandoAinda ? ALVO_PRIMEIRA - agora : ESPERA_ROTA;
    const t = setTimeout(logoMontar, espera);
    return () => clearTimeout(t);
  }, [location.pathname]);

  const getLinkStyle = (path) => {
    const isActive = location.pathname === path;
    return {
      textDecoration: 'none',
      color: isActive ? 'var(--solda)' : 'var(--cal)',
      fontFamily: 'var(--font-mono)',
      fontSize: '0.8rem',
      fontWeight: '600',
      letterSpacing: '1px',
      textTransform: 'uppercase',
      transition: 'color 0.3s ease',
      borderBottom: isActive ? '1px solid var(--solda)' : '1px solid transparent',
      paddingBottom: '2px'
    };
  };

  return (
    <nav style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      padding: 'var(--space-4) var(--content-padding)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 100,
      mixBlendMode: 'difference' // helps it stand out on light/dark backgrounds
    }}>

      <TransitionLink to="/" aria-label="SmartLabs Home" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <PixelMonogram ref={svgRef} color="var(--cal)" size={24} />
        {/* Letra a letra: e o que permite cada uma se montar e se
            desfazer sozinha, em pixel. Como <span> unico so dava para
            varrer o conjunto com uma cortina. */}
        <span ref={nomeRef} className="marca-nome" aria-label="SmartLabs">
          {[...'SMARTLABS'].map((c, i) => (
            <span key={i} className="pxl" aria-hidden="true">{c}</span>
          ))}
        </span>
      </TransitionLink>

      <div style={{ display: 'flex', gap: 'var(--space-6)', alignItems: 'center' }}>
        {[
          { to: '/work', label: 'Work' },
          { to: '/about', label: 'About' },
          { to: '/thoughts', label: 'Thoughts' },
          { to: '/contact', label: 'Contact' },
        ].map(({ to, label }) => (
          // P2 — roll no hover: duas copias empilhadas, a de baixo em Solda.
          // Altura travada em 1em para o menu nao mudar de tamanho.
          <TransitionLink key={to} to={to} style={{ ...getLinkStyle(to), overflow: 'hidden', display: 'inline-block', height: '1em', lineHeight: '1em' }} className="nav-roll">
            <span className="nav-roll-stack" style={{ display: 'block', transition: 'transform .3s cubic-bezier(0.16,1,0.3,1)' }}>
              <span style={{ display: 'block' }}>{label}</span>
              <span style={{ display: 'block', color: 'var(--solda)' }}>{label}</span>
            </span>
          </TransitionLink>
        ))}
      </div>

    </nav>
  );
}
