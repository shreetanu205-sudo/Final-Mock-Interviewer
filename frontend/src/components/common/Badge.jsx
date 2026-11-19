import React from 'react';

export const Badge = ({ children, variant = 'lavender', className = '', size = 'md' }) => {
  const variants = {
    lavender: 'bg-orbit-lavender text-plum border-orbit-lavender/40',
    mint: 'bg-orbit-mint text-[#123E24] border-orbit-mint/40',
    peach: 'bg-orbit-peach text-[#4A1D0E] border-orbit-peach/40',
    purple: 'bg-orbit-purple/10 text-orbit-purple border-orbit-purple/20',
    plum: 'bg-plum text-white border-plum',
    neutral: 'bg-plum/5 text-plum/80 border-plum/10',
  };

  const sizes = {
    sm: 'text-[11px] px-2.5 py-0.5',
    md: 'text-xs px-3 py-1',
    lg: 'text-sm px-3.5 py-1.5',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold rounded-full border tracking-wide uppercase ${
        variants[variant] || variants.lavender
      } ${sizes[size]} ${className}`}
    >
      {children}
    </span>
  );
};
