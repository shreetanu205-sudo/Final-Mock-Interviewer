import React from 'react';

export const Button = ({
  children,
  variant = 'primary', // primary, secondary, outline, ghost, danger, mint, peach
  size = 'md', // sm, md, lg
  className = '',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  icon: Icon,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-orbit-purple text-white hover:bg-plum hover:shadow-medium focus:ring-orbit-purple',
    secondary: 'bg-plum text-white hover:bg-plum-light hover:shadow-medium focus:ring-plum',
    lavender: 'bg-orbit-lavender text-plum hover:bg-orbit-lavender/80 focus:ring-orbit-purple',
    peach: 'bg-orbit-peach text-plum hover:bg-orbit-peach/80 focus:ring-orbit-peach',
    mint: 'bg-orbit-mint text-plum hover:bg-orbit-mint/80 focus:ring-orbit-mint',
    outline: 'border border-plum/20 text-plum hover:bg-plum/5 focus:ring-plum',
    ghost: 'text-plum/80 hover:text-plum hover:bg-plum/5 focus:ring-plum',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };

  const sizes = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : Icon ? (
        <Icon className={size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />
      ) : null}
      <span>{children}</span>
    </button>
  );
};
