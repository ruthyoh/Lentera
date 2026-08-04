import { ButtonHTMLAttributes, forwardRef } from 'react';

type VarianTombol = 'primer' | 'sekunder' | 'outline' | 'hantu' | 'bahaya';
type UkuranTombol = 'kecil' | 'sedang' | 'besar';

interface TombolProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  varian?: VarianTombol;
  ukuran?: UkuranTombol;
  sedangMemuat?: boolean;
  ikonKiri?: React.ReactNode;
  ikonKanan?: React.ReactNode;
  lebarPenuh?: boolean;
}

const varianStyle: Record<VarianTombol, string> = {
  primer: 'bg-[var(--color-forest-700)] text-[var(--color-cream-100)] hover:bg-[var(--color-forest-600)] active:bg-[var(--color-forest-800)] shadow-sm hover:shadow-md',
  sekunder: 'bg-[var(--color-terracotta-500)] text-white hover:bg-[var(--color-terracotta-600)] active:bg-[var(--color-terracotta-700)] shadow-sm hover:shadow-md',
  outline: 'border-2 border-[var(--color-forest-700)] text-[var(--color-forest-700)] hover:bg-[var(--color-forest-700)] hover:text-[var(--color-cream-100)] bg-transparent',
  hantu: 'text-[var(--color-forest-700)] hover:bg-[var(--color-forest-50)] active:bg-[var(--color-forest-100)] bg-transparent',
  bahaya: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm',
};

const ukuranStyle: Record<UkuranTombol, string> = {
  kecil: 'px-3 py-1.5 text-sm gap-1.5',
  sedang: 'px-5 py-2.5 text-sm gap-2',
  besar: 'px-7 py-3.5 text-base gap-2.5',
};

const Tombol = forwardRef<HTMLButtonElement, TombolProps>(
  (
    {
      varian = 'primer',
      ukuran = 'sedang',
      sedangMemuat = false,
      ikonKiri,
      ikonKanan,
      lebarPenuh = false,
      children,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || sedangMemuat;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={[
          'inline-flex items-center justify-center font-semibold rounded-[var(--radius-sm)] transition-all duration-200 cursor-pointer select-none',
          'focus-visible:outline-2 focus-visible:outline-[var(--color-forest-500)] focus-visible:outline-offset-2',
          varianStyle[varian],
          ukuranStyle[ukuran],
          lebarPenuh ? 'w-full' : '',
          isDisabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      >
        {sedangMemuat ? (
          <>
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            <span>Memuat...</span>
          </>
        ) : (
          <>
            {ikonKiri}
            {children}
            {ikonKanan}
          </>
        )}
      </button>
    );
  }
);

Tombol.displayName = 'Tombol';
export default Tombol;
