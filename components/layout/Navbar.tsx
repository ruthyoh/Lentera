'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  BookOpen, Award, Trophy, User, Menu, X,
  ChevronRight, Sparkles, LogOut, Star, ChevronDown,
  Settings,
} from 'lucide-react';
import Logo from '@/components/ui/Logo';
import Tombol from '@/components/ui/Button';
import { keluarAkun } from '@/lib/actions/auth';
import type { ProfilRingkas } from '@/types';

interface NavLinkItem {
  label: string;
  href: string;
  ikon: React.ReactNode;
  modul?: 'belajar' | 'beasiswa';
}

const navLinks: NavLinkItem[] = [
  { label: 'Jelajah Materi', href: '/jelajah', ikon: <BookOpen size={16} />, modul: 'belajar' },
  { label: 'Beasiswa', href: '/beasiswa', ikon: <Award size={16} />, modul: 'beasiswa' },
  { label: 'Papan Peringkat', href: '/papan-peringkat', ikon: <Trophy size={16} /> },
];

interface NavbarProps {
  profil?: ProfilRingkas | null;
}

/** Inisial nama pengguna dari 2 kata pertama */
function inisialNama(nama: string): string {
  return nama
    .split(' ')
    .slice(0, 2)
    .map((kata) => kata[0])
    .join('')
    .toUpperCase();
}

export default function Navbar({ profil }: NavbarProps) {
  const [menuTerbuka, setMenuTerbuka] = useState(false);
  const [dropdownTerbuka, setDropdownTerbuka] = useState(false);
  const [terscroll, setTerscroll] = useState(false);
  const [sedangKeluar, setSedangKeluar] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setTerscroll(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Tutup menu & dropdown saat navigasi
  useEffect(() => {
    setMenuTerbuka(false);
    setDropdownTerbuka(false);
  }, [pathname]);

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownTerbuka(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isAktif = (href: string) =>
    pathname === href || pathname.startsWith(href + '/');

  async function handleKeluar() {
    setSedangKeluar(true);
    await keluarAkun();
  }

  return (
    <>
      <header
        className={[
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          terscroll
            ? 'bg-white/95 backdrop-blur-md shadow-[var(--shadow-navbar)] border-b border-[var(--color-cream-300)]'
            : 'bg-transparent',
        ].join(' ')}
        role="banner"
      >
        <div className="container-lentera">
          <nav
            className="flex items-center justify-between h-16"
            aria-label="Navigasi utama"
          >
            {/* Logo */}
            <Logo ukuran="sedang" />

            {/* Link Navigasi Desktop */}
            <div className="hidden md:flex items-center gap-1" role="menubar">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  role="menuitem"
                  className={[
                    'flex items-center gap-2 px-4 py-2 rounded-[var(--radius-sm)] text-sm font-medium transition-all duration-200',
                    isAktif(link.href)
                      ? link.modul === 'beasiswa'
                        ? 'bg-[var(--color-terracotta-100)] text-[var(--color-terracotta-700)]'
                        : 'bg-[var(--color-forest-100)] text-[var(--color-forest-700)]'
                      : 'text-[var(--color-charcoal-700)] hover:bg-[var(--color-cream-300)] hover:text-[var(--color-charcoal-900)]',
                  ].join(' ')}
                  aria-current={isAktif(link.href) ? 'page' : undefined}
                >
                  {link.ikon}
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Area Kanan: Logo TCC + Auth */}
            <div className="hidden md:flex items-center gap-3">
              {/* Logo TCC */}
              <Image
                src="/logo-tcc.svg"
                alt="Logo TCC Triple-C Vibe Code 2026"
                width={110}
                height={32}
                className="opacity-90"
              />

              <div
                className="w-px h-6 bg-[var(--color-cream-400)]"
                aria-hidden="true"
              />

              {/* ============================================
                  STATUS LOGIN: Tampil kondisional
                  ============================================ */}
              {profil ? (
                /* ---- User sudah login: Avatar + Dropdown ---- */
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownTerbuka(!dropdownTerbuka)}
                    className={[
                      'flex items-center gap-2.5 px-3 py-2 rounded-[var(--radius-md)] transition-all duration-200',
                      dropdownTerbuka
                        ? 'bg-[var(--color-forest-100)]'
                        : 'hover:bg-[var(--color-cream-300)]',
                    ].join(' ')}
                    aria-haspopup="true"
                    aria-expanded={dropdownTerbuka}
                    aria-label={`Menu pengguna: ${profil.nama_lengkap}`}
                    id="tombol-menu-pengguna"
                  >
                    {/* Avatar */}
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{
                        background: 'var(--color-forest-100)',
                        color: 'var(--color-forest-700)',
                      }}
                      aria-hidden="true"
                    >
                      {profil.avatar_url ? (
                        <Image
                          src={profil.avatar_url}
                          alt={profil.nama_lengkap}
                          width={32}
                          height={32}
                          className="rounded-full object-cover"
                        />
                      ) : (
                        inisialNama(profil.nama_lengkap)
                      )}
                    </div>
                    {/* Nama singkat */}
                    <div className="text-left">
                      <p
                        className="text-xs font-semibold leading-tight"
                        style={{ color: 'var(--color-charcoal-900)' }}
                      >
                        {profil.nama_lengkap.split(' ')[0]}
                      </p>
                      <p
                        className="text-xs flex items-center gap-0.5"
                        style={{ color: 'var(--color-forest-600)' }}
                      >
                        <Star size={9} fill="currentColor" />
                        {profil.poin_kontribusi.toLocaleString('id-ID')} poin
                      </p>
                    </div>
                    <ChevronDown
                      size={14}
                      style={{ color: 'var(--color-charcoal-400)' }}
                      className={`transition-transform duration-200 ${dropdownTerbuka ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownTerbuka && (
                    <div
                      className="absolute right-0 top-full mt-2 w-56 rounded-[var(--radius-md)] shadow-lg border py-1 z-50"
                      style={{
                        background: 'white',
                        borderColor: 'var(--color-cream-300)',
                        boxShadow: 'var(--shadow-card-hover)',
                      }}
                      role="menu"
                      aria-label="Menu pengguna"
                    >
                      {/* Info pengguna */}
                      <div
                        className="px-4 py-3 border-b"
                        style={{ borderColor: 'var(--color-cream-200)' }}
                      >
                        <p
                          className="text-sm font-semibold"
                          style={{ color: 'var(--color-charcoal-900)', fontFamily: 'var(--font-display)' }}
                        >
                          {profil.nama_lengkap}
                        </p>
                        <p
                          className="text-xs"
                          style={{ color: 'var(--color-charcoal-400)' }}
                        >
                          {profil.poin_kontribusi.toLocaleString('id-ID')} poin kontribusi
                        </p>
                      </div>

                      {/* Menu items */}
                      <Link
                        href="/profil"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-[var(--color-cream-100)]"
                        style={{ color: 'var(--color-charcoal-700)' }}
                        role="menuitem"
                      >
                        <User size={15} style={{ color: 'var(--color-forest-600)' }} />
                        Profil Saya
                      </Link>
                      <Link
                        href="/profil/pengaturan"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-[var(--color-cream-100)]"
                        style={{ color: 'var(--color-charcoal-700)' }}
                        role="menuitem"
                      >
                        <Settings size={15} style={{ color: 'var(--color-forest-600)' }} />
                        Pengaturan
                      </Link>

                      <div
                        className="my-1 border-t"
                        style={{ borderColor: 'var(--color-cream-200)' }}
                      />

                      {/* Tombol Keluar */}
                      <button
                        onClick={handleKeluar}
                        disabled={sedangKeluar}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ color: '#dc2626' }}
                        role="menuitem"
                        id="tombol-keluar-dropdown"
                      >
                        <LogOut size={15} />
                        {sedangKeluar ? 'Sedang keluar...' : 'Keluar dari Akun'}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* ---- User belum login: Tombol Masuk & Daftar ---- */
                <>
                  <Link href="/login">
                    <Tombol varian="hantu" ukuran="sedang">
                      Masuk
                    </Tombol>
                  </Link>
                  <Link href="/register">
                    <Tombol
                      varian="primer"
                      ukuran="sedang"
                      ikonKanan={<Sparkles size={14} />}
                    >
                      Daftar Gratis
                    </Tombol>
                  </Link>
                </>
              )}
            </div>

            {/* Tombol Menu Mobile */}
            <button
              className="md:hidden p-2 rounded-[var(--radius-sm)] text-[var(--color-charcoal-700)] hover:bg-[var(--color-cream-300)] transition-colors"
              onClick={() => setMenuTerbuka(!menuTerbuka)}
              aria-expanded={menuTerbuka}
              aria-label={menuTerbuka ? 'Tutup menu' : 'Buka menu'}
              aria-controls="menu-mobile"
            >
              {menuTerbuka ? <X size={22} /> : <Menu size={22} />}
            </button>
          </nav>
        </div>
      </header>

      {/* ==================== Menu Mobile ==================== */}
      <div
        id="menu-mobile"
        role="dialog"
        aria-modal="true"
        aria-label="Menu navigasi mobile"
        className={[
          'fixed inset-0 z-40 md:hidden transition-all duration-300',
          menuTerbuka ? 'visible opacity-100' : 'invisible opacity-0',
        ].join(' ')}
      >
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={() => setMenuTerbuka(false)}
          aria-hidden="true"
        />

        {/* Panel Menu */}
        <div
          className={[
            'absolute top-0 right-0 h-full w-4/5 max-w-xs bg-white shadow-2xl flex flex-col transition-transform duration-300',
            menuTerbuka ? 'translate-x-0' : 'translate-x-full',
          ].join(' ')}
        >
          {/* Header panel */}
          <div
            className="flex items-center justify-between p-5 border-b"
            style={{ borderColor: 'var(--color-cream-300)' }}
          >
            <Logo ukuran="kecil" />
            <button
              onClick={() => setMenuTerbuka(false)}
              className="p-1.5 rounded-md hover:bg-[var(--color-cream-200)] transition-colors"
              aria-label="Tutup menu"
            >
              <X size={20} />
            </button>
          </div>

          {/* Info user mobile (jika login) */}
          {profil && (
            <div
              className="px-5 py-4 flex items-center gap-3 border-b"
              style={{
                background: 'var(--color-forest-50)',
                borderColor: 'var(--color-cream-300)',
              }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                style={{ background: 'var(--color-forest-100)', color: 'var(--color-forest-700)' }}
                aria-hidden="true"
              >
                {inisialNama(profil.nama_lengkap)}
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--color-charcoal-900)' }}>
                  {profil.nama_lengkap}
                </p>
                <p className="text-xs flex items-center gap-1" style={{ color: 'var(--color-forest-600)' }}>
                  <Star size={10} fill="currentColor" />
                  {profil.poin_kontribusi.toLocaleString('id-ID')} poin
                </p>
              </div>
            </div>
          )}

          {/* Links navigasi */}
          <nav className="flex-1 p-5 flex flex-col gap-1" aria-label="Navigasi mobile">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={[
                  'flex items-center justify-between px-4 py-3 rounded-[var(--radius-md)] text-sm font-medium transition-all',
                  isAktif(link.href)
                    ? link.modul === 'beasiswa'
                      ? 'bg-[var(--color-terracotta-100)] text-[var(--color-terracotta-700)]'
                      : 'bg-[var(--color-forest-100)] text-[var(--color-forest-700)]'
                    : 'text-[var(--color-charcoal-700)] hover:bg-[var(--color-cream-200)]',
                ].join(' ')}
                aria-current={isAktif(link.href) ? 'page' : undefined}
              >
                <span className="flex items-center gap-3">
                  {link.ikon}
                  {link.label}
                </span>
                <ChevronRight size={14} className="opacity-40" />
              </Link>
            ))}

            {profil && (
              <Link
                href="/profil"
                className="flex items-center justify-between px-4 py-3 rounded-[var(--radius-md)] text-sm font-medium text-[var(--color-charcoal-700)] hover:bg-[var(--color-cream-200)] transition-all"
              >
                <span className="flex items-center gap-3">
                  <User size={16} />
                  Profil Saya
                </span>
                <ChevronRight size={14} className="opacity-40" />
              </Link>
            )}
          </nav>

          {/* Area bawah: auth buttons */}
          <div
            className="p-5 border-t flex flex-col gap-3"
            style={{ borderColor: 'var(--color-cream-300)' }}
          >
            <Image
              src="/logo-tcc.svg"
              alt="TCC Triple-C Vibe Code 2026"
              width={110}
              height={32}
              className="mx-auto opacity-80"
            />

            {profil ? (
              <button
                onClick={handleKeluar}
                disabled={sedangKeluar}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-[var(--radius-sm)] text-sm font-semibold transition-all hover:bg-red-50 disabled:opacity-50 border-2 border-red-200 text-red-600"
                id="tombol-keluar-mobile"
              >
                <LogOut size={15} />
                {sedangKeluar ? 'Sedang keluar...' : 'Keluar dari Akun'}
              </button>
            ) : (
              <>
                <Link href="/login" className="w-full">
                  <Tombol varian="outline" ukuran="sedang" lebarPenuh>
                    Masuk ke Akun
                  </Tombol>
                </Link>
                <Link href="/register" className="w-full">
                  <Tombol
                    varian="primer"
                    ukuran="sedang"
                    lebarPenuh
                    ikonKanan={<Sparkles size={14} />}
                  >
                    Daftar Gratis
                  </Tombol>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
