type VarianBadge =
  | 'forest'
  | 'terracotta'
  | 'cream'
  | 'aktif'
  | 'peringatan'
  | 'bahaya'
  | 'info';

interface BadgeProps {
  varian?: VarianBadge;
  children: React.ReactNode;
  className?: string;
}

const varianStyle: Record<VarianBadge, string> = {
  forest: 'bg-[var(--color-forest-100)] text-[var(--color-forest-800)]',
  terracotta: 'bg-[var(--color-terracotta-100)] text-[var(--color-terracotta-800)]',
  cream: 'bg-[var(--color-cream-400)] text-[var(--color-charcoal-700)]',
  aktif: 'bg-emerald-100 text-emerald-800',
  peringatan: 'bg-amber-100 text-amber-800',
  bahaya: 'bg-red-100 text-red-800',
  info: 'bg-blue-100 text-blue-800',
};

export default function Badge({ varian = 'forest', children, className = '' }: BadgeProps) {
  return (
    <span className={['badge', varianStyle[varian], className].filter(Boolean).join(' ')}>
      {children}
    </span>
  );
}
