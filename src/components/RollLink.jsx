import React from 'react';
import './RollLink.css';

/**
 * RollLink (P2)
 * Link with a duplicated text hover effect (rolls up).
 */
export default function RollLink({ href = '#', children, className = '' }) {
  return (
    <a href={href} className={`roll-link ${className}`}>
      <span className="roll-stack">
        <span className="roll-text">{children}</span>
        <span className="roll-text hover-text">{children}</span>
      </span>
    </a>
  );
}
