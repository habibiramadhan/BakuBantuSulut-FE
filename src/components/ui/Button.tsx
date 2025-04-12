// src/components/ui/Button.tsx
import { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant = 'default' | 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'link' | 'social';
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon' | 'full';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
}

// Helper function to combine class names
const classNames = (...classes: (string | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

const Button = ({
  className,
  variant = 'default',
  size = 'default',
  children,
  leftIcon,
  rightIcon,
  ...props
}: ButtonProps) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  const variantClasses = {
    default: 'bg-babyBlue text-white hover:bg-babyBlue-dark',
    primary: 'bg-babyBlue text-white hover:bg-babyBlue-dark',
    secondary: 'bg-lavender text-white hover:bg-lavender-dark',
    accent: 'bg-poppy text-white hover:bg-poppy-dark',
    outline: 'border border-gray-300 bg-white hover:bg-gray-50 text-gray-700',
    ghost: 'hover:bg-gray-100 text-gray-700',
    link: 'text-babyBlue underline-offset-4 hover:underline',
    social: 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50',
  };
  
  const sizeClasses = {
    default: 'h-10 py-2 px-4',
    sm: 'h-9 px-3',
    lg: 'h-12 px-8',
    icon: 'h-10 w-10',
    full: 'w-full h-12',
  };

  return (
    <button
      className={classNames(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};

export { Button };