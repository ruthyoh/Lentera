import Link from 'next/link';
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
      role="contentinfo"
      style={{ background: 'var(--color-dark-800)', color: 'var(--text-on-dark)' }}
    >
      {/* ── CTA Banner — latar: dark→gold gradient (latar GELAP) ── */}
      <div className="bg-gradient-card-belajar py-12">
        <div className="container-lentera text-center">
          {/* Label kecil di atas heading — latar gelap → text-muted-on-dark */}
          <p
            className="text-sm font-semibold tracking-widest uppercase mb-3"
            style={{ color: 'var(--text-muted-on-dark)' }}
          >
            Mulai Perjalanan Belajarmu
          </p>
          {/* Heading di atas latar gelap → text-on-dark */}
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-on-dark)' }}
          >
            Akses Ribuan Materi &amp; Beasiswa
          </h2>
          {/* Deskripsi di atas latar gelap → text-muted-on-dark */}
          <p
            className="max-w-xl mx-auto mb-8"
            style={{ color: 'var(--text-muted-on-dark)' }}
          >
            Bergabung bersama ribuan mahasiswa yang sudah memanfaatkan Lentera untuk meraih prestasi akademik dan finansial terbaik.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            {/* Tombol putih di atas latar gelap — teks pakai text-on-light */}
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-[var(--text-on-dark)] px-6 py-3 rounded-[var(--radius-sm)] font-semibold text-sm hover:bg-[var(--color-cream-300)] transition-colors shadow-sm"
              style={{ color: 'var(--text-on-light)' }}
            >
              <BookOpen size={16} />
              Mulai Belajar Gratis
            </Link>
            {/* Tombol outline di atas latar gelap — teks pakai text-on-dark */}
            <Link
              href="/beasiswa"
              className="inline-flex items-center gap-2 border-2 px-6 py-3 rounded-[var(--radius-sm)] font-semibold text-sm hover:bg-white/10 transition-colors"
              style={{ borderColor: 'var(--text-on-dark)', color: 'var(--text-on-dark)' }}
            >
              <Award size={16} />
              Cari Beasiswa
            </Link>
          </div>
        </div>
      </div>

      {/* ── Main Footer — latar: dark-800 (latar GELAP) ── */}
      <div className="py-12 border-b border-white/10">
        <div className="container-lentera">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

            {/* Brand Column */}
            <div className="lg:col-span-1">
              <div className="mb-4">
                {/* Logo dengan teks warna krem untuk latar gelap */}
                <Logo ukuran="sedang" tampilkanTeks className="[&>a>span]:!text-[var(--text-on-dark)]" />
              </div>
              {/* Deskripsi brand: text-muted-on-dark */}
              <p
                className="text-sm leading-relaxed mb-5"
                style={{ color: 'var(--text-muted-on-dark)' }}
              >
                Platform terintegrasi mendukung keberlanjutan akses pendidikan mahasiswa melalui berbagi pengetahuan dan informasi beasiswa.
              </p>
              {/* Badge TCC — teks fallback (bukan gambar) agar tidak pernah kosong */}
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[var(--radius-sm)] text-xs font-semibold"
                style={{
                  background: 'rgba(201,151,30,0.18)',
                  border: '1px solid rgba(201,151,30,0.3)',
                  color: 'var(--color-gold-300)',
                }}
              >
                ★ TCC Vibe Code 2026
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
