import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Monogram } from '../components/Logo';

export default function Navbar() {
  const location = useLocation();

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
      
      <Link to="/" aria-label="SmartLabs Home" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Monogram color="var(--cal)" size={24} />
        <span style={{ color: 'var(--cal)', fontFamily: 'var(--font-display)', fontWeight: '800', letterSpacing: '1px' }}>SMARTLABS</span>
      </Link>

      <div style={{ display: 'flex', gap: 'var(--space-6)', alignItems: 'center' }}>
        {[
          { to: '/work', label: 'Work' },
          { to: '/about', label: 'About' },
          { to: '/thoughts', label: 'Thoughts' },
          { to: '/contact', label: 'Contact' },
        ].map(({ to, label }) => (
          // P2 — roll no hover: duas copias empilhadas, a de baixo em Solda.
          // Altura travada em 1em para o menu nao mudar de tamanho.
          <Link key={to} to={to} style={{ ...getLinkStyle(to), overflow: 'hidden', display: 'inline-block', height: '1em', lineHeight: '1em' }} className="nav-roll">
            <span className="nav-roll-stack" style={{ display: 'block', transition: 'transform .3s cubic-bezier(0.16,1,0.3,1)' }}>
              <span style={{ display: 'block' }}>{label}</span>
              <span style={{ display: 'block', color: 'var(--solda)' }}>{label}</span>
            </span>
          </Link>
        ))}
      </div>

    </nav>
  );
}
