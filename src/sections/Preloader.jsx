import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { LogoHorizontal } from '../components/Logo';

export default function Preloader() {
  const container = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline();

    // Fade in text
    tl.from('.preloader-text', {
      opacity: 0,
      y: 10,
      duration: 1,
      ease: 'power2.out',
    });

    // Hold for a moment, then slide up and fade out
    tl.to(container.current, {
      yPercent: -100,
      duration: 1.2,
      ease: 'expo.inOut',
      delay: 0.5,
    });
  }, { scope: container });

  return (
    <div 
      ref={container} 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'var(--aco)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div className="preloader-text" style={{ opacity: 1 }}>
        <LogoHorizontal color="var(--cal)" size={200} />
      </div>
    </div>
  );
}
