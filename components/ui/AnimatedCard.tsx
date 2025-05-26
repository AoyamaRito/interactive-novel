'use client';

import { ReactNode } from 'react';

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function AnimatedCard({ 
  children, 
  className = '',
  hover = true 
}: AnimatedCardProps) {
  const baseStyles = 'bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-orange-100/30';
  const hoverStyles = hover ? 'hover:shadow-2xl hover:-translate-y-1 transition-all duration-300' : '';
  
  return (
    <div className={`${baseStyles} ${hoverStyles} ${className}`}>
      {children}
    </div>
  );
}