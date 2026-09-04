import React from 'react';
import './PlateButton.css';

/**
 * PlateButton (P8)
 * CTA com estética técnica e preenchimento expansivo no hover.
 */
export default function PlateButton({ href, children, variant = 'primary', className = '', ...props }) {
  const Component = href ? 'a' : 'button';
  
  return (
    <Component 
      href={href} 
      className={`plate-button plate-button-${variant} ${className}`} 
      {...props}
    >
      <span className="plate-button-text">{children}</span>
      <span className="plate-button-fill"></span>
      <svg className="plate-button-arrow" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 11L11 1M11 1H3M11 1V9" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    </Component>
  );
}
