import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import './Marquee.css';

/**
 * Marquee (P3)
 * Infinite horizontal scrolling text.
 */
export default function Marquee({ text, speed = 1, direction = 1, className = '' }) {
  const marqueeRef = useRef(null);
  
  useGSAP(() => {
    const track = marqueeRef.current.querySelector('.marquee-track');
    
    // Animate infinitely
    gsap.to(track, {
      xPercent: -50,
      ease: 'none',
      duration: 10 / speed,
      repeat: -1,
    });
  }, { scope: marqueeRef });

  return (
    <div ref={marqueeRef} className={`marquee-container ${className}`}>
      <div className="marquee-track">
        {/* Duplicate content to create seamless loop */}
        <span className="marquee-content">{text}</span>
        <span className="marquee-content">{text}</span>
      </div>
    </div>
  );
}
