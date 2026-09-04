import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * MaskReveal (P1)
 * Splits text lines and reveals them from the bottom up, 
 * masked by an overflow-hidden wrapper.
 */
export default function MaskReveal({ children, tag: Tag = 'h2', className = '', delay = 0 }) {
  const container = useRef(null);

  useGSAP(() => {
    const lines = container.current.querySelectorAll('.line-inner');
    
    gsap.from(lines, {
      yPercent: 110,
      duration: 0.9,
      ease: 'expo.out',
      stagger: 0.08,
      delay: delay,
      scrollTrigger: {
        trigger: container.current,
        start: 'top 85%',
      }
    });
  }, { scope: container });

  // Helper to split text by <br/> or \n and wrap in mask divs
  const renderLines = () => {
    if (typeof children !== 'string') {
      // If it's complex elements, assume user already passed properly wrapped markup
      return children;
    }

    const lines = children.split(/\n|<br\s*\/?>/i).filter(l => l.trim() !== '');
    return lines.map((line, i) => (
      <span key={i} className="line">
        <span className="line-inner">{line.trim()}</span>
      </span>
    ));
  };

  return (
    <Tag ref={container} className={className}>
      {renderLines()}
    </Tag>
  );
}
