import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

/**
 * Counter (P7)
 * Counts from 0 to target on reveal.
 */
export default function Counter({ value, prefix = '', suffix = '', duration = 1.5 }) {
  const [count, setCount] = useState(0);
  const triggerRef = useRef(null);

  useGSAP(() => {
    const obj = { val: 0 };
    
    gsap.to(obj, {
      val: value,
      duration: duration,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: triggerRef.current,
        start: 'top 90%',
      },
      onUpdate: () => {
        setCount(Math.ceil(obj.val));
      }
    });
  }, { scope: triggerRef });

  return (
    <span ref={triggerRef} className="metric" style={{ fontVariantNumeric: 'tabular-nums' }}>
      {prefix}{count}{suffix}
    </span>
  );
}
