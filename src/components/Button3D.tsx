'use client';

import Link from 'next/link';
import { useState } from 'react';

const sizeConfig = {
  sm: { padding: 'px-4 py-2', fontSize: 'text-sm' },
  md: { padding: 'px-6 py-3', fontSize: 'text-base' },
  lg: { padding: 'px-8 py-4', fontSize: 'text-lg' },
};

const colorConfig = {
  primary: {
    bg: 'from-purple-600 to-violet-700',
    shadow: 'shadow-purple-500/50',
    border: 'border-purple-400/30',
    glow: 'hover:shadow-purple-500/60',
  },
  secondary: {
    bg: 'from-cyan-500 to-blue-600',
    shadow: 'shadow-cyan-500/50',
    border: 'border-cyan-400/30',
    glow: 'hover:shadow-cyan-500/60',
  },
  outline: {
    bg: 'from-gray-700 to-gray-800',
    shadow: 'shadow-gray-500/30',
    border: 'border-purple-400/50',
    glow: 'hover:shadow-purple-500/40',
  },
};

export interface Button3DProps {
  text: string;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export function Button3D({
  text,
  href = '',
  onClick,
  variant = 'primary',
  size = 'md',
}: Button3DProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const config = sizeConfig[size];
  const colors = colorConfig[variant];

  const handleClick = () => {
    onClick?.();
    if (href) {
      if (href.startsWith('http')) {
        window.open(href, '_blank');
      } else {
        window.location.href = href;
      }
    }
  };

  const className = [
    'button-3d relative inline-flex items-center justify-center cursor-pointer font-semibold text-white rounded-xl border transform-style-3d transition-all duration-200',
    config.padding,
    config.fontSize,
    `bg-gradient-to-br ${colors.bg} ${colors.glow} ${colors.border}`,
    isHovered && 'button-3d-hovered',
    isPressed && 'button-3d-pressed',
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      <span className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/15 to-transparent pointer-events-none" />
      <span className="relative z-[2] drop-shadow-md select-none">{text}</span>
    </>
  );

  if (href && !href.startsWith('http')) {
    return (
      <Link
        href={href}
        className={className}
        style={{
          transform: 'perspective(500px) rotateX(-5deg) translateY(0)',
          boxShadow:
            '0 8px 20px -4px rgba(0,0,0,0.4), 0 4px 8px -2px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -2px 0 rgba(0,0,0,0.2)',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setIsPressed(false);
        }}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={className}
      style={{
        transform: isPressed
          ? 'perspective(500px) rotateX(-3deg) translateY(2px)'
          : isHovered
            ? 'perspective(500px) rotateX(-8deg) translateY(-3px)'
            : 'perspective(500px) rotateX(-5deg) translateY(0)',
        boxShadow: isPressed
          ? '0 4px 10px -2px rgba(0,0,0,0.4), 0 2px 4px -1px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.2)'
          : isHovered
            ? '0 12px 30px -4px rgba(0,0,0,0.5), 0 8px 16px -4px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.3), inset 0 -2px 0 rgba(0,0,0,0.2)'
            : '0 8px 20px -4px rgba(0,0,0,0.4), 0 4px 8px -2px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -2px 0 rgba(0,0,0,0.2)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onClick={handleClick}
    >
      {content}
    </button>
  );
}
