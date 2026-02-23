'use client';

const baseClasses =
  'inline-flex items-center justify-center font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 btn-interactive';

const variantClasses = {
  primary:
    'bg-gradient-to-r from-purple-600 to-violet-600 text-white hover:from-purple-500 hover:to-violet-500 focus:ring-purple-500 shadow-lg shadow-purple-500/25',
  secondary:
    'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-400 hover:to-blue-400 focus:ring-cyan-500 shadow-lg shadow-cyan-500/25',
  outline:
    'border-2 border-purple-500 text-purple-400 bg-transparent hover:bg-purple-600/20 hover:text-white focus:ring-purple-500',
};

const sizeClasses = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

export interface ButtonProps {
  text: string;
  href?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export function Button({
  text,
  href = '',
  variant = 'primary',
  size = 'md',
  onClick,
}: ButtonProps) {
  const className = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`;
  if (href) {
    return (
      <a href={href} className={className}>
        {text}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={className}>
      {text}
    </button>
  );
}
