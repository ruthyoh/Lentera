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
            className="text-sm font-semibold"
            style={{ color: 'var(--text-on-dark)' }}
          >
            {label}
            {props.required && (
              <span className="text-red-400 ml-0.5">*</span>
            )}
          </label>
        )}
        <div className="relative">
          {ikonKiri && (
            <div
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            >
              {ikonKiri}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={[
              'w-full rounded-[var(--radius-sm)] border px-4 py-3 text-sm',
              'bg-white text-slate-900',
              'placeholder:text-slate-400',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-500)] focus:border-transparent',
              error
                ? 'border-red-400 focus:ring-red-400'
                : 'border-slate-300 hover:border-slate-400',
              ikonKiri ? 'pl-10' : '',
              ikonKanan ? 'pr-10' : '',
              className,
            ]
              .filter(Boolean)
              .join(' ')}
            style={{ color: '#0f172a' }}
            {...props}
          />
          {ikonKanan && (
            <div
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
            >
              {ikonKanan}
            </div>
          )}
        </div>
        {error && (
          <p className="text-xs text-red-400 flex items-center gap-1 font-medium">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
              <path d="M6 1a5 5 0 100 10A5 5 0 006 1zm-.5 2.5h1v3h-1v-3zm0 4h1v1h-1v-1z" />
            </svg>
            {error}
          </p>
        )}
        {petunjuk && !error && (
          <p className="text-xs text-slate-400">{petunjuk}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
