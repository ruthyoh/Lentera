type VarianBadge =
  | 'gold'
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
  gold: 'bg-[var(--color-gold-100)] text-[var(--color-gold-900)] font-semibold',
  forest: 'bg-[var(--color-gold-100)] text-[var(--color-gold-900)] font-semibold',
  terracotta: 'bg-[var(--color-terracotta-100)] text-[var(--color-terracotta-800)] font-semibold',
  cream: 'bg-[var(--color-cream-300)] text-[var(--text-on-light)]',
  aktif: 'bg-amber-100 text-amber-900 font-semibold',
  peringatan: 'bg-amber-100 text-amber-800 font-semibold',
  bahaya: 'bg-red-100 text-red-800 font-semibold',
  info: 'bg-blue-100 text-blue-800 font-semibold',
};

export default function Badge({ varian = 'gold', children, className = '' }: BadgeProps) {
  return (
    <span className={['badge', varianStyle[varian], className].filter(Boolean).join(' ')}>
      {children}
    </span>
  );
}
