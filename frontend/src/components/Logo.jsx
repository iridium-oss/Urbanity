import React from 'react';

export default function Logo({
  size = 48,
  className = '',
  hideText = false,
  textClassName = '',
  imageClassName = '',
}) {
  const imageSize = typeof size === 'number' ? `${size}px` : size;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img
        src="/assets/urbanivity-logo.png"
        alt="Urbanivity logo"
        className={`block object-contain ${imageClassName}`}
        style={{ width: imageSize, height: imageSize }}
      />
      {!hideText && (
        <span className={`font-heading font-bold text-lg tracking-tight ${textClassName}`}>Urbanivity</span>
      )}
    </div>
  );
}
