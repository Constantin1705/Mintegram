'use client';

import { HTMLAttributes, forwardRef } from 'react';
import { motion } from 'framer-motion';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  gradient?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', hover = true, gradient = false, children, ...props }, ref) => {
    const baseClasses = 'bg-white rounded-2xl shadow-lg p-6 transition-all duration-300';
    const hoverClasses = hover ? 'hover:shadow-2xl hover:-translate-y-1' : '';
    const gradientClasses = gradient ? 'bg-gradient-to-br from-white to-blue-50' : '';
    
    const classes = `${baseClasses} ${hoverClasses} ${gradientClasses} ${className}`;
    
    return (
      <motion.div
        ref={ref}
        className={classes}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
