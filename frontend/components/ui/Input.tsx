"use client";

import { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-text-secondary mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`
              w-full bg-white/[0.03] border border-glass-border rounded-xl
              px-4 py-3 text-sm text-text-primary placeholder:text-text-muted
              focus:outline-none focus:border-accent-blue/50 focus:ring-1 focus:ring-accent-blue/30
              focus:bg-white/[0.05]
              transition-all duration-200
              ${icon ? "pl-11" : ""}
              ${error ? "border-error/50 focus:border-error/50 focus:ring-error/30" : ""}
              ${className}
            `}
            {...props}
          />
        </div>
        {error && <p className="mt-1.5 text-xs text-error">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
