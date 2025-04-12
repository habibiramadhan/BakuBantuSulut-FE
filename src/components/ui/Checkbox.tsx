// src/components/ui/Checkbox.tsx
import { InputHTMLAttributes, forwardRef } from 'react';
// Helper function yang akan selalu mengembalikan string
const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(cls => typeof cls === 'string' && cls).join(' ');
};

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <div className="flex items-center">
        <input
          ref={ref}
          type="checkbox"
          className={cn(
            "h-4 w-4 rounded border-gray-300 text-babyBlue focus:ring-babyBlue",
            className || ""
          )}
          {...props}
        />
        {label && (
          <label 
            htmlFor={props.id} 
            className="ml-2 block text-sm text-gray-700"
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export { Checkbox };