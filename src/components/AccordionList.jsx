import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import './AccordionList.css';

/**
 * AccordionList (P6)
 * Expandable rows with GSAP height animation.
 */
export default function AccordionList({ items }) {
  const [openIndex, setOpenIndex] = useState(0); // first item open by default

  const toggleItem = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <div className="accordion-list">
      {items.map((item, i) => (
        <AccordionItem 
          key={i} 
          item={item} 
          isOpen={openIndex === i} 
          onClick={() => toggleItem(i)} 
        />
      ))}
    </div>
  );
}

function AccordionItem({ item, isOpen, onClick }) {
  const contentRef = useRef(null);

  useGSAP(() => {
    if (isOpen) {
      gsap.to(contentRef.current, { height: 'auto', opacity: 1, duration: 0.5, ease: 'expo.out' });
    } else {
      gsap.to(contentRef.current, { height: 0, opacity: 0, duration: 0.4, ease: 'expo.out' });
    }
  }, [isOpen]);

  return (
    <div className={`accordion-item ${isOpen ? 'is-open' : ''}`}>
      <button className="accordion-header" onClick={onClick}>
        <h4 className="accordion-title">{item.title}</h4>
        <div className="accordion-icon">
          <div className="accordion-icon-line-h"></div>
          <div className="accordion-icon-line-v"></div>
        </div>
      </button>
      <div className="accordion-content-wrapper" ref={contentRef} style={{ height: 0, overflow: 'hidden', opacity: 0 }}>
        <div className="accordion-content">
          <p>{item.content}</p>
          {item.list && (
            <ul className="accordion-details">
              {item.list.map((li, idx) => (
                <li key={idx}>— {li}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
