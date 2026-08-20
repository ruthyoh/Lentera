import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  ukuran?: 'kecil' | 'sedang' | 'besar';
  tampilkanTeks?: boolean;
  className?: string;
  warnaTeks?: string;
}

const ukuranMap = {
  kecil: { gambar: 28, teks: 'text-lg' },
  sedang: { gambar: 48, teks: 'text-xl' },
  besar: { gambar: 64, teks: 'text-2xl' },
};

export default function Logo({ ukuran = 'sedang', tampilkanTeks = true, className = '', warnaTeks }: LogoProps) {
  const config = ukuranMap[ukuran];

  return (
    <Link href="/" className={`flex items-center gap-2.5 group ${className}`} aria-label="Lentera — Beranda">
      <div className="relative transition-transform duration-300 group-hover:scale-110">
        <Image
          src="/iconlentera.png"
          alt="Logo Lentera"
          width={64}
          height={64}
          className="object-contain translate-y-1.4"
          priority
        />
      </div>
      {tampilkanTeks && (
        <span
          className={`${config.teks} font-bold tracking-tight`}
          style={{
            fontFamily: 'var(--font-display)',
            color: warnaTeks ?? 'var(--text-on-light)',
          }}
        >
          Lentera
        </span>
      )}
    </Link>
  );
}
