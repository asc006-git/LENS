import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

const Card = ({ hover = false, padding = 'md', children, className = '', onClick }: CardProps) => {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={`bg-white rounded-[20px] shadow-[0_1px_3px_rgb(0_0_0/0.06)] ${hover ? 'hover:-translate-y-0.5 hover:shadow-[0_10px_15px_-3px_rgb(0_0_0/0.06)] transition-all duration-200 cursor-pointer' : ''} ${paddings[padding]} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
