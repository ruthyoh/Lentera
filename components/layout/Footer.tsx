import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, Award, Trophy, User, Mail, Github, Heart } from 'lucide-react';
import Logo from '@/components/ui/Logo';

const linkBelajar = [
  { label: 'Jelajah Materi', href: '/jelajah' },
  { label: 'Unggah Materi', href: '/jelajah/unggah' },
  { label: 'Asisten Belajar AI', href: '/jelajah?fitur=ai' },
  { label: 'Bank Soal', href: '/jelajah?kategori=bank_soal' },
];

const linkBeasiswa = [
  { label: 'Cari Beasiswa', href: '/beasiswa' },
  { label: 'Pencocokan AI', href: '/beasiswa?fitur=ai' },
  { label: 'Draf Esai Motivasi', href: '/beasiswa?fitur=esai' },
  { label: 'Tenggat Waktu', href: '/beasiswa?sort=tenggat' },
];

const linkPlatform = [
  { label: 'Papan Peringkat', href: '/papan-peringkat', ikon: <Trophy size={14} /> },
  { label: 'Profil Saya', href: '/profil', ikon: <User size={14} /> },
  { label: 'Masuk', href: '/login', ikon: null },
  { label: 'Daftar', href: '/register', ikon: null },
];

export default function Footer() {
  const tahun = new Date().getFullYear();

  return (
    <footer
      className="bg-[var(--color-forest-800)] text-[var(--color-cream-200)]"
      role="contentinfo"
    >
      {/* CTA Banner */}
      <div className="bg-gradient-card-belajar py-12">
        <div className="container-lentera text-center">
          <p className="text-[var(--color-cream-100)] text-sm font-semibold tracking-widest uppercase mb-3 opacity-80">
            Mulai Perjalanan Belajarmu
          </p>
          <h2 className="text-white text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
            Akses Ribuan Materi &amp; Beasiswa
          </h2>
          <p className="text-[var(--color-cream-200)] max-w-xl mx-auto mb-8 opacity-90">
            Bergabung bersama ribuan mahasiswa yang sudah memanfaatkan Lentera untuk meraih prestasi akademik dan finansial terbaik.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-white text-[var(--color-forest-700)] px-6 py-3 rounded-[var(--radius-sm)] font-semibold text-sm hover:bg-[var(--color-cream-200)] transition-colors shadow-sm"
            >
              <BookOpen size={16} />
              Mulai Belajar Gratis
            </Link>
            <Link
              href="/beasiswa"
              className="inline-flex items-center gap-2 border-2 border-white text-white px-6 py-3 rounded-[var(--radius-sm)] font-semibold text-sm hover:bg-white/10 transition-colors"
            >
              <Award size={16} />
              Cari Beasiswa
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-12 border-b border-white/10">
        <div className="container-lentera">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Brand Column */}
            <div className="lg:col-span-1">
              <div className="mb-4">
                <Logo ukuran="sedang" tampilkanTeks className="[&>a>span]:text-[var(--color-cream-100)]" />
              </div>
              <p className="text-sm text-[var(--color-cream-400)] leading-relaxed mb-5">
                Platform terintegrasi mendukung keberlanjutan akses pendidikan mahasiswa melalui berbagi pengetahuan dan informasi beasiswa.
              </p>
              {/* TCC Logo */}
              <Image
                src="/logo-tcc.svg"
                alt="TCC Triple-C Vibe Code 2026"
                width={120}
                height={36}
                className="opacity-70 hover:opacity-100 transition-opacity"
              />
            </div>

            {/* Modul Belajar */}
            <div>
              <h3
                className="text-[var(--color-cream-100)] font-semibold text-sm mb-4 flex items-center gap-2"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                <BookOpen size={14} className="text-[var(--color-forest-300)]" />
                Modul Belajar
              </h3>
              <ul className="space-y-2.5">
                {linkBelajar.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--color-cream-400)] hover:text-[var(--color-cream-100)] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Modul Beasiswa */}
            <div>
              <h3
                className="text-[var(--color-cream-100)] font-semibold text-sm mb-4 flex items-center gap-2"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                <Award size={14} className="text-[var(--color-terracotta-400)]" />
                Modul Beasiswa
              </h3>
              <ul className="space-y-2.5">
                {linkBeasiswa.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--color-cream-400)] hover:text-[var(--color-cream-100)] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Platform */}
            <div>
              <h3
                className="text-[var(--color-cream-100)] font-semibold text-sm mb-4"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Platform
              </h3>
              <ul className="space-y-2.5 mb-6">
                {linkPlatform.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--color-cream-400)] hover:text-[var(--color-cream-100)] transition-colors flex items-center gap-2"
                    >
                      {link.ikon}
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Kontak */}
              <div className="flex gap-3">
                <a
                  href="mailto:lentera@tcc.id"
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-[var(--color-cream-400)] hover:text-white transition-all"
                  aria-label="Email Lentera"
                >
                  <Mail size={16} />
                </a>
                <a
                  href="https://github.com/tcc-lentera"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-[var(--color-cream-400)] hover:text-white transition-all"
                  aria-label="GitHub Lentera"
                >
                  <Github size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="py-5">
        <div className="container-lentera flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-[var(--color-cream-500)]">
          <p>
            © {tahun} Lentera — Dibuat dengan{' '}
            <Heart size={11} className="inline text-[var(--color-terracotta-400)]" fill="currentColor" />{' '}
            untuk mahasiswa Indonesia
          </p>
          <p className="text-center">
            Diikutsertakan dalam{' '}
            <span className="text-[var(--color-cream-300)] font-medium">TCC Vibe Code 2026</span>
            {' '}— Tema: Shaping Tomorrow
          </p>
          <div className="flex gap-4">
            <Link href="/kebijakan-privasi" className="hover:text-[var(--color-cream-300)] transition-colors">
              Kebijakan Privasi
            </Link>
            <Link href="/syarat-ketentuan" className="hover:text-[var(--color-cream-300)] transition-colors">
              Syarat &amp; Ketentuan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
