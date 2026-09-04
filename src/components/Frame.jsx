import React from 'react';
import './Frame.css';

/**
 * Frame (P5)
 * 1px umbra outline around media.
 */
export default function Frame({ children, className = '' }) {
  return (
    <div className={`media-frame ${className}`}>
      {children}
    </div>
  );
}
