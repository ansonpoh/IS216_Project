import React from 'react';

/**
 * Reusable page title with the project's gradient style.
 * Props:
 * - text: string (required)
 * - size: CSS font-size string or number (optional, default '56px')
 * - align: text alignment for the wrapper ('left' | 'center' | 'right'), default 'center'
 * - className: extra classes to apply to the wrapper
 * - mb: wrapper bottom margin (string or number), default '20px'
 * - subtitle: optional subtitle text shown under the title
 */
export default function Title({ text, size = '56px', align = 'center', className = '', mb = '20px', subtitle }) {
  const fontSize = typeof size === 'number' ? `${size}px` : size;
  const marginBottom = typeof mb === 'number' ? `${mb}px` : mb;

  return (
    <div className={className} style={{ textAlign: align, marginBottom }}>
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
          marginLeft: align === 'center' ? 'auto' : undefined,
          marginRight: align === 'center' ? 'auto' : undefined
        }}>{subtitle}</p>
      )}
    </div>
  );
}
