import Link from 'next/link';
import {
  BookOpen,
  Award,
  Brain,
  FileText,
  HelpCircle,
  Search,
  PenTool,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';

interface FiturItem {
  ikon: React.ReactNode;
  judul: string;
  deskripsi: string;
}

interface ModulCardProps {
  modul: 'belajar' | 'beasiswa';
}

const dataModul = {
  belajar: {
    judul: 'Modul Belajar',
    subjudul: 'Repositori Materi Akademik',
    deskripsi:
      'Akses dan bagikan catatan kuliah, rangkuman materi, serta bank soal dari ribuan mahasiswa se-Indonesia. Diperkuat oleh Asisten Belajar AI yang siap membantu kapan saja.',
    href: '/jelajah',
    labelTombol: 'Jelajah Materi',
    ikonUtama: <BookOpen size={28} className="text-white" />,
    warna: {
      latar: 'bg-gradient-card-belajar',
      badge: 'bg-white/15 text-white',
      tombol: 'bg-white text-[var(--color-dark-900)] hover:bg-[var(--color-cream-200)]',
      latarIcon: 'bg-white/20',
      fiturBg: 'bg-white/10',
    },
    fitur: [
      {
        ikon: <FileText size={18} />,
        judul: 'Catatan & Rangkuman',
        deskripsi: 'Unduh dan bagikan catatan kuliah serta rangkuman materi berkualitas',
      },
      {
        ikon: <HelpCircle size={18} />,
        judul: 'Bank Soal',
        deskripsi: 'Latihan soal ujian dari berbagai mata kuliah dan semester',
      },
      {
        ikon: <Brain size={18} />,
        judul: 'Asisten Belajar AI',
        deskripsi: 'Ringkas materi, buat kuis, dan tanya jawab dengan AI secara instan',
      },
    ] as FiturItem[],
    keunggulan: ['Gratis selamanya', 'Terverifikasi mahasiswa', 'Diperbarui setiap hari'],
  },
  beasiswa: {
    judul: 'Modul Beasiswa',
    subjudul: 'Basis Data Bantuan Pendidikan',
    deskripsi:
      'Temukan ratusan beasiswa dari pemerintah, lembaga swasta, dan internasional. AI kami mencocokkan profilmu dengan beasiswa yang paling relevan dan membantu menyusun esai motivasi.',
    href: '/beasiswa',
    labelTombol: 'Cari Beasiswa',
    ikonUtama: <Award size={28} className="text-white" />,
    warna: {
      latar: 'bg-gradient-card-beasiswa',
      badge: 'bg-white/15 text-white',
      tombol: 'bg-white text-[var(--color-terracotta-700)] hover:bg-[var(--color-cream-200)]',
      latarIcon: 'bg-white/20',
      fiturBg: 'bg-white/10',
    },
    fitur: [
      {
        ikon: <Search size={18} />,
        judul: 'Basis Data Lengkap',
        deskripsi: 'Ratusan beasiswa diperbarui rutin dengan filter jurusan, IPK, dan semester',
      },
      {
        ikon: <Brain size={18} />,
        judul: 'Pencocokan AI',
        deskripsi: 'AI menganalisis profilmu dan merekomendasikan beasiswa paling relevan',
      },
      {
        ikon: <PenTool size={18} />,
        judul: 'Draf Esai Motivasi',
        deskripsi: 'Bantu menyusun esai motivasi yang kuat dengan panduan AI',
      },
    ] as FiturItem[],
    keunggulan: ['Diperbarui berkala', 'Filter cerdas', 'Pengingat tenggat'],
  },
};

export default function ModulCard({ modul }: ModulCardProps) {
  const data = dataModul[modul];

  return (
    <div
      className={`${data.warna.latar} rounded-[var(--radius-xl)] p-8 flex flex-col text-white shadow-2xl h-full`}
      role="article"
      aria-label={`Kartu ${data.judul}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-3 ${data.warna.badge}`}
          >
            {data.ikonUtama}
            {data.subjudul}
          </div>
          <h3
            className="text-2xl md:text-3xl font-bold"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {data.judul}
          </h3>
        </div>
      </div>

      {/* Deskripsi */}
      <p className="text-white/85 leading-relaxed mb-8 text-sm md:text-base">
        {data.deskripsi}
      </p>

      {/* Fitur */}
      <div className="grid gap-3 mb-8 flex-1">
        {data.fitur.map((fitur) => (
          <div
            key={fitur.judul}
            className={`flex items-start gap-3 p-4 rounded-[var(--radius-md)] ${data.warna.fiturBg}`}
          >
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${data.warna.latarIcon}`}>
              {fitur.ikon}
            </div>
            <div>
              <p className="font-semibold text-sm mb-0.5">{fitur.judul}</p>
              <p className="text-xs text-white/70 leading-relaxed">{fitur.deskripsi}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Keunggulan */}
      <div className="flex flex-wrap gap-3 mb-6">
        {data.keunggulan.map((item) => (
          <span key={item} className="flex items-center gap-1.5 text-xs text-white/80">
            <CheckCircle size={12} className="text-white/60" />
            {item}
          </span>
        ))}
      </div>

      {/* CTA */}
      <Link
        href={data.href}
        className={`flex items-center justify-center gap-2 py-3.5 px-6 rounded-[var(--radius-sm)] font-semibold text-sm transition-all duration-200 ${data.warna.tombol} shadow-sm hover:shadow-md`}
      >
        {data.labelTombol}
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}
