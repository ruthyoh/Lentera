import Image from 'next/image';
import Link from 'next/link';
import { Trophy, User, Mail, Github, Heart, BookOpen, Award } from 'lucide-react';
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
      role="contentinfo"
      style={{ background: 'var(--color-dark-800)', color: 'var(--text-on-dark)' }}
    >

      {/* ── Main Footer — latar: dark-800 (latar GELAP) ── */}
      <div className="py-12 border-b border-white/10">
        <div className="container-lentera">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

            {/* Brand Column */}
            <div className="lg:col-span-1">
              <div className="mb-4">
                <Logo ukuran="sedang" tampilkanTeks warnaTeks="#FFFFFF" />
              </div>
              {/* Deskripsi brand: text-muted-on-dark */}
              <p
                className="text-sm leading-relaxed mb-5"
                style={{ color: 'var(--text-muted-on-dark)' }}
              >
                Platform terintegrasi mendukung keberlanjutan akses pendidikan mahasiswa melalui berbagi pengetahuan dan informasi beasiswa.
              </p>
              {/* Badge TCC */}
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{
                  background: 'rgba(201,151,30,0.18)',
                  border: '1px solid rgba(201,151,30,0.3)',
                  color: 'var(--color-gold-300)',
                }}
              >
                <Image
                  src="/logo-tcc.png"
                  alt="Logo TCC 2026"
                  width={14}
                  height={22}
                  className="object-contain"
                />
                <span>TCC Vibe Code 2026</span>
              </div>
            </div>

            {/* Modul Belajar */}
            <div>
              {/* Heading kolom: text-on-dark */}
              <h3
                className="font-semibold text-sm mb-4 flex items-center gap-2"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--text-on-dark)' }}
              >
                <BookOpen size={14} style={{ color: 'var(--color-gold-400)' }} />
                Modul Belajar
              </h3>
              <ul className="space-y-2.5">
                {linkBelajar.map((link) => (
                  <li key={link.href}>
                    {/* Link footer: text-muted-on-dark, hover → text-on-dark */}
                    <Link
                      href={link.href}
                      className="text-sm transition-colors hover:underline text-[var(--text-muted-on-dark)] hover:text-[var(--text-on-dark)]"
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
                className="font-semibold text-sm mb-4 flex items-center gap-2"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--text-on-dark)' }}
              >
                <Award size={14} style={{ color: 'var(--color-terracotta-400)' }} />
                Modul Beasiswa
              </h3>
              <ul className="space-y-2.5">
                {linkBeasiswa.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors hover:underline text-[var(--text-muted-on-dark)] hover:text-[var(--text-on-dark)]"
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
                className="font-semibold text-sm mb-4"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--text-on-dark)' }}
              >
                Platform
              </h3>
              <ul className="space-y-2.5 mb-6">
                {linkPlatform.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors flex items-center gap-2 hover:underline text-[var(--text-muted-on-dark)] hover:text-[var(--text-on-dark)]"
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
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/15 transition-all text-[var(--text-muted-on-dark)] hover:text-[var(--text-on-dark)]"
                  aria-label="Email Lentera"
                >
                  <Mail size={16} />
                </a>
                <a
                  href="https://github.com/tcc-lentera"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/15 transition-all text-[var(--text-muted-on-dark)] hover:text-[var(--text-on-dark)]"
                  aria-label="GitHub Lentera"
                >
                  <Github size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Bar — latar: dark-800 (latar GELAP) ── */}
      <div className="py-5">
        <div
          className="container-lentera flex flex-col md:flex-row items-center justify-between gap-3 text-xs"
          style={{ color: 'var(--text-muted-on-dark)' }}
        >
          <p>
            © {tahun} Lentera — Dibuat dengan{' '}
            <Heart size={11} className="inline text-[var(--color-terracotta-400)]" fill="currentColor" />{' '}
            untuk mahasiswa Indonesia
          </p>
          <p className="text-center">
            Diikutsertakan dalam{' '}
            <span style={{ color: 'var(--text-on-dark)', fontWeight: 500 }}>TCC Vibe Code 2026</span>
            {' '}— Tema: Shaping Tomorrow
          </p>
          <div className="flex gap-4">
            <Link
              href="/kebijakan-privasi"
              className="hover:underline transition-colors text-[var(--text-muted-on-dark)] hover:text-[var(--text-on-dark)]"
            >
              Kebijakan Privasi
            </Link>
            <Link
              href="/syarat-ketentuan"
              className="hover:underline transition-colors text-[var(--text-muted-on-dark)] hover:text-[var(--text-on-dark)]"
            >
              Syarat &amp; Ketentuan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
