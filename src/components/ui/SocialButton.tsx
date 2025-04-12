// src/components/ui/SocialButton.tsx
import { ButtonHTMLAttributes, ReactNode } from 'react';
// Helper function yang akan selalu mengembalikan string
const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(cls => typeof cls === 'string' && cls).join(' ');
};

export interface SocialButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  provider: 'facebook' | 'google' | 'apple';
}

const SocialButton = ({
  className,
  icon,
  provider,
  ...props
}: SocialButtonProps) => {
  return (
    <button
      className={cn(
        "flex h-12 items-center justify-center rounded-md border border-gray-300 bg-white px-6 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2",
        provider === 'facebook' ? "focus:ring-blue-500" : "",
        provider === 'google' ? "focus:ring-red-500" : "",
        provider === 'apple' ? "focus:ring-gray-500" : "",
        className || ""
      )}
      {...props}
    >
      <span className="flex items-center justify-center">{icon}</span>
    </button>
  );
};

export { SocialButton };