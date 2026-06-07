'use client';

const baseClasses =
  'inline-flex items-center justify-center font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 btn-interactive';

const variantClasses = {
  primary:
    'bg-gray-700 text-white hover:bg-gray-600 focus:ring-gray-500',
  secondary:
    'bg-gray-800 text-white hover:bg-gray-700 focus:ring-gray-500',
  outline:
    'border-2 border-gray-600 text-gray-300 bg-transparent hover:bg-gray-800 hover:text-white focus:ring-gray-500',
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
