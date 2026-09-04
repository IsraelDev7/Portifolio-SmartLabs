import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

/**
 * useScrubWords (P4)
 * Animates opacity of individual words mapped to scroll position.
 */
export function useScrubWords() {
  const containerRef = useRef(null);

  useGSAP(() => {
    if (!containerRef.current) return;
    
    const words = containerRef.current.querySelectorAll('.scrub-word');
    
    if (words.length > 0) {
      gsap.fromTo(
        words,
        { opacity: 0.2 },
        {
          opacity: 1,
          stagger: 0.05,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            end: 'bottom 50%',
            scrub: true,
          }
        }
      );
    }
  }, { scope: containerRef });

  // Helper to split text into words for scrubbing
  const renderScrubText = (text) => {
    return text.split(' ').map((word, i) => (
      <span key={i} className="scrub-word" style={{ display: 'inline-block', marginRight: '0.3em' }}>
        {word}
      </span>
    ));
  };

  return { containerRef, renderScrubText };
}
