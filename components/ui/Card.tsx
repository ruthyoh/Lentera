import { HTMLAttributes } from 'react';

type VarianKartu = 'default' | 'melayang' | 'garis' | 'belajar' | 'beasiswa';

interface KartuProps extends HTMLAttributes<HTMLDivElement> {
  varian?: VarianKartu;
  padding?: 'kecil' | 'sedang' | 'besar';
  className?: string;
}

const varianStyle: Record<VarianKartu, string> = {
  default: 'card-glass',
  melayang: 'card-glass animate-float',
  garis: 'bg-white border-2 border-[var(--color-cream-400)] rounded-[var(--radius-lg)] shadow-sm hover:shadow-md transition-shadow duration-200',
  belajar: 'bg-gradient-card-belajar text-white rounded-[var(--radius-lg)] shadow-lg',
  beasiswa: 'bg-gradient-card-beasiswa text-white rounded-[var(--radius-lg)] shadow-lg',
};

const paddingStyle = {
  kecil: 'p-4',
  sedang: 'p-6',
  besar: 'p-8',
};

export default function Kartu({
  varian = 'default',
  padding = 'sedang',
  children,
  className = '',
  ...props
}: KartuProps) {
  return (
    <div
      className={[varianStyle[varian], paddingStyle[padding], className].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
    </div>
  );
}
