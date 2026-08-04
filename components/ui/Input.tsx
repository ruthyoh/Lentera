import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  petunjuk?: string;
  ikonKiri?: React.ReactNode;
  ikonKanan?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, petunjuk, ikonKiri, ikonKanan, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-semibold text-[var(--color-charcoal-700)]"
          >
            {label}
            {props.required && (
              <span className="text-[var(--color-terracotta-500)] ml-0.5">*</span>
            )}
          </label>
        )}
        <div className="relative">
          {ikonKiri && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-charcoal-400)]">
              {ikonKiri}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={[
              'w-full rounded-[var(--radius-sm)] border px-4 py-3 text-sm',
              'bg-white text-[var(--color-charcoal-900)]',
              'placeholder:text-[var(--color-charcoal-300)]',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-[var(--color-forest-500)] focus:border-transparent',
              error
                ? 'border-red-400 focus:ring-red-400'
                : 'border-[var(--color-cream-400)] hover:border-[var(--color-forest-400)]',
              ikonKiri ? 'pl-10' : '',
              ikonKanan ? 'pr-10' : '',
              className,
            ]
              .filter(Boolean)
              .join(' ')}
            {...props}
          />
          {ikonKanan && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-charcoal-400)]">
              {ikonKanan}
            </div>
          )}
        </div>
        {error && (
          <p className="text-xs text-red-600 flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
              <path d="M6 1a5 5 0 100 10A5 5 0 006 1zm-.5 2.5h1v3h-1v-3zm0 4h1v1h-1v-1z" />
            </svg>
            {error}
          </p>
        )}
        {petunjuk && !error && (
          <p className="text-xs text-[var(--color-charcoal-400)]">{petunjuk}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
