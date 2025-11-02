import React from 'react';

/**
 * Reusable page title with the project's gradient style.
 * Props:
 * - text: string (required)
 * - size: CSS font-size string or number (optional, default '56px')
 * - className: extra classes to apply to the wrapper
 * - subtitle: optional subtitle text shown under the title
 */
export default function Title({ text, size = '56px', className = '', subtitle }) {
  const fontSize = typeof size === 'number' ? `${size}px` : size;

  return (
    <div className={className} style={{ textAlign: 'center', marginBottom: '16px' }}>
      <div style={{
        display: 'inline-block',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        fontSize: fontSize,
        fontWeight: '800',
        lineHeight: 1.2,
      }}>
        {text}
      </div>

      {subtitle && (
        <p style={{
          margin: '12px 0 0',
          fontSize: '18px',
          color: '#6b7280',
          maxWidth: '720px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>{subtitle}</p>
      )}
    </div>
  );
}
