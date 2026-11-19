import React from 'react';

export const Card = ({ children, className = '', hover = true, padding = 'p-6 sm:p-8', ...props }) => {
  return (
    <div
      className={`bg-white rounded-2xl border border-plum/8 shadow-soft ${
        hover ? 'transition-all duration-200 hover:shadow-medium hover:border-plum/15' : ''
      } ${padding} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
