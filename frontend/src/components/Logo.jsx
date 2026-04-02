import React from 'react';
import { useApp } from '@/context/AppContext';

export default function Logo({
  size = 48,
  className = '',
  hideText = false,
  textClassName = '',
  imageClassName = '',
  dark,
}) {
  const { theme } = useApp();
  const isDark = dark !== undefined ? dark : theme === 'dark';
  const logoSrc = isDark ? '/assets/darklogo.png' : '/assets/urbanivity-logo.png';
  const imageSize = typeof size === 'number' ? `${size}px` : size;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img
        src={logoSrc}
        alt="Urbanivity logo"
        className={`block object-contain ${imageClassName}`}
        style={{ height: imageSize, width: 'auto' }}
      />
      {!hideText && (
        <span className={`font-heading font-bold text-lg tracking-tight ${textClassName}`}>Urbanivity</span>
      )}
    </div>
  );
}
