'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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

function inisialNama(nama: string): string {
  return nama.split(' ').slice(0, 2).map((k) => k[0]).join('').toUpperCase();
}

export default function Navbar({ profil }: NavbarProps) {
  const [menuTerbuka, setMenuTerbuka] = useState(false);
  const [dropdownTerbuka, setDropdownTerbuka] = useState(false);
  const [terscroll, setTerscroll] = useState(false);
  const [sedangKeluar, setSedangKeluar] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setTerscroll(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuTerbuka(false);
    setDropdownTerbuka(false);
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownTerbuka(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isAktif = (href: string) => pathname === href || pathname.startsWith(href + '/');

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
            ? 'bg-[var(--color-cream-100)]/95 backdrop-blur-md shadow-[var(--shadow-navbar)] border-b border-[var(--color-cream-300)]'
            : 'bg-transparent',
        ].join(' ')}
        role="banner"
      >
        <div className="container-lentera">
          <nav className="flex items-center justify-between h-16" aria-label="Navigasi utama">

            {/* Logo */}
            <Logo ukuran="sedang" warnaTeks={terscroll ? 'var(--text-on-light)' : 'var(--text-on-dark)'} />

            {/* Link Navigasi Desktop */}
            <div className="hidden md:flex items-center gap-1" role="menubar">
              {navLinks.map((link) => {
                const aktif = isAktif(link.href);
                // Semua link: teks solid sesuai state scroll
                // Tidak scrolled (hero bg gelap): --text-on-dark
                // Scrolled (navbar terang): --text-on-light
                // Aktif: highlight berbeda per modul tapi TETAP terbaca
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    role="menuitem"
                    className="flex items-center gap-2 px-4 py-2 rounded-[var(--radius-sm)] text-sm font-semibold transition-all duration-200"
                    style={
                      aktif
                        ? {
                          background: link.modul === 'beasiswa'
                            ? 'rgba(196,98,45,0.15)'
                            : 'rgba(201,151,30,0.18)',
                          color: terscroll
                            ? (link.modul === 'beasiswa' ? 'var(--color-terracotta-600)' : 'var(--color-gold-600)')
                            : 'var(--text-on-dark)',
                        }
                        : {
                          color: terscroll ? 'var(--text-on-light)' : 'var(--text-on-dark)',
                        }
                    }
                    aria-current={aktif ? 'page' : undefined}
                  >
                    {link.ikon}
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Area Kanan: Badge TCC + Auth */}
            <div className="hidden md:flex items-center gap-3">
              {/* Badge TCC — teks, bukan gambar, agar tidak pernah kosong */}
              <div
                className="text-xs font-semibold px-3 py-1.5 rounded-full"
                style={{
                  background: terscroll ? 'rgba(201,151,30,0.12)' : 'rgba(201,151,30,0.18)',
                  border: '1px solid rgba(201,151,30,0.35)',
                  color: terscroll ? 'var(--color-gold-600)' : '#FFFFFF',
                }}
              >
                ★ TCC 2026
              </div>

              <div
                className="w-px h-6 transition-colors duration-300"
                style={{ background: terscroll ? 'var(--color-cream-400)' : 'rgba(242, 239, 239, 0.2)' }}
                aria-hidden="true"
              />

              {profil ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownTerbuka(!dropdownTerbuka)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-[var(--radius-md)] transition-all duration-200"
                    style={{
                      background: dropdownTerbuka
                        ? (terscroll ? 'var(--color-gold-50)' : 'rgba(255,255,255,0.15)')
                        : 'transparent',
                    }}
                    aria-haspopup="true"
                    aria-expanded={dropdownTerbuka}
                    aria-label={`Menu pengguna: ${profil.nama_lengkap}`}
                    id="tombol-menu-pengguna"
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{
                        background: 'var(--color-gold-100)',
                        color: 'var(--color-gold-800)',
                      }}
                      aria-hidden="true"
                    >
                      {profil.avatar_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={profil.avatar_url}
                          alt={profil.nama_lengkap}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        inisialNama(profil.nama_lengkap)
                      )}
                    </div>
                    <div className="text-left">
                      <p
                        className="text-xs font-semibold leading-tight"
                        style={{ color: terscroll ? 'var(--text-on-light)' : 'var(--text-on-dark)' }}
                      >
                        {profil.nama_lengkap.split(' ')[0]}
                      </p>
                      <p
                        className="text-xs flex items-center gap-0.5"
                        style={{ color: terscroll ? 'var(--color-gold-600)' : 'var(--color-gold-300)' }}
                      >
                        <Star size={9} fill="currentColor" />
                        {profil.poin_kontribusi.toLocaleString('id-ID')} poin
                      </p>
                    </div>
                    <ChevronDown
                      size={14}
                      style={{ color: terscroll ? 'var(--text-muted-on-light)' : 'var(--text-muted-on-dark)' }}
                      className={`transition-transform duration-200 ${dropdownTerbuka ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {dropdownTerbuka && (
                    <div
                      className="absolute right-0 top-full mt-2 w-56 rounded-[var(--radius-md)] shadow-lg border py-1 z-50"
                      style={{
                        background: 'var(--color-cream-50)',
                        borderColor: 'var(--color-cream-400)',
                        boxShadow: 'var(--shadow-card-hover)',
                      }}
                      role="menu"
                      aria-label="Menu pengguna"
                    >
                      <div
                        className="px-4 py-3 border-b"
                        style={{ borderColor: 'var(--color-cream-300)' }}
                      >
                        <p
                          className="text-sm font-semibold"
                          style={{ color: 'var(--text-on-light)', fontFamily: 'var(--font-display)' }}
                        >
                          {profil.nama_lengkap}
                        </p>
                        <p className="text-xs" style={{ color: 'var(--text-muted-on-light)' }}>
                          {profil.poin_kontribusi.toLocaleString('id-ID')} poin kontribusi
                        </p>
                      </div>
                      <Link
                        href="/profil"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-[var(--color-cream-200)]"
                        style={{ color: 'var(--text-on-light)' }}
                        role="menuitem"
                      >
                        <User size={15} style={{ color: 'var(--color-gold-600)' }} />
                        Profil Saya
                      </Link>
                      <Link
                        href="/profil/pengaturan"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-[var(--color-cream-200)]"
                        style={{ color: 'var(--text-on-light)' }}
                        role="menuitem"
                      >
                        <Settings size={15} style={{ color: 'var(--color-gold-600)' }} />
                        Pengaturan
                      </Link>
                      <div className="my-1 border-t" style={{ borderColor: 'var(--color-cream-300)' }} />
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
                <>
                  <Link href="/login">
                    <Tombol
                      varian="hantu"
                      ukuran="sedang"
                      className={!terscroll
                        ? 'text-[var(--text-on-dark)]! hover:bg-white/15!'
                        : 'text-[var(--text-on-light)]! hover:bg-[var(--color-cream-300)]!'}
                    >
                      Masuk
                    </Tombol>
                  </Link>
                  <Link href="/register">
                    {/* Di atas hero gelap: tombol gold. Scrolled: default gold primer */}
                    <Tombol
                      varian="primer"
                      ukuran="sedang"
                      ikonKanan={<Sparkles size={14} />}
                      className={!terscroll
                        ? 'bg-[var(--color-gold-500)]! text-[#FFFFFF]! hover:bg-[var(--color-gold-400)]!'
                        : ''}
                    >
                      Daftar Gratis
                    </Tombol>
                  </Link>
                </>
              )}
            </div>

            {/* Tombol Menu Mobile */}
            <button
              className="md:hidden p-2 rounded-[var(--radius-sm)] transition-colors"
              style={{ color: terscroll ? 'var(--text-on-light)' : 'var(--text-on-dark)' }}
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
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={() => setMenuTerbuka(false)}
          aria-hidden="true"
        />

        <div
          className={[
            'absolute top-0 right-0 h-full w-4/5 max-w-xs shadow-2xl flex flex-col transition-transform duration-300',
            menuTerbuka ? 'translate-x-0' : 'translate-x-full',
          ].join(' ')}
          style={{ background: 'var(--color-cream-100)' }}
        >
          {/* Header panel */}
          <div
            className="flex items-center justify-between p-5 border-b"
            style={{ borderColor: 'var(--color-cream-400)' }}
          >
            <Logo ukuran="kecil" />
            <button
              onClick={() => setMenuTerbuka(false)}
              className="p-1.5 rounded-md transition-colors hover:bg-[var(--color-cream-300)]"
              style={{ color: 'var(--text-on-light)' }}
              aria-label="Tutup menu"
            >
              <X size={20} />
            </button>
          </div>

          {/* Info user mobile */}
          {profil && (
            <div
              className="px-5 py-4 flex items-center gap-3 border-b"
              style={{
                background: 'var(--color-gold-50)',
                borderColor: 'var(--color-cream-400)',
              }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                style={{ background: 'var(--color-gold-100)', color: 'var(--color-gold-800)' }}
                aria-hidden="true"
              >
                {inisialNama(profil.nama_lengkap)}
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--text-on-light)' }}>
                  {profil.nama_lengkap}
                </p>
                <p className="text-xs flex items-center gap-1" style={{ color: 'var(--color-gold-600)' }}>
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
                className="flex items-center justify-between px-4 py-3 rounded-[var(--radius-md)] text-sm font-medium transition-all"
                style={
                  isAktif(link.href)
                    ? {
                      background: link.modul === 'beasiswa'
                        ? 'var(--color-terracotta-100)'
                        : 'var(--color-gold-100)',
                      color: link.modul === 'beasiswa'
                        ? 'var(--color-terracotta-700)'
                        : 'var(--color-gold-700)',
                    }
                    : { color: 'var(--text-on-light)' }
                }
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
                className="flex items-center justify-between px-4 py-3 rounded-[var(--radius-md)] text-sm font-medium transition-all"
                style={{ color: 'var(--text-on-light)' }}
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
            style={{ borderColor: 'var(--color-cream-400)' }}
          >
            {/* Badge TCC teks — bukan gambar */}
            <div
              className="text-center text-xs font-semibold py-1.5 rounded-full"
              style={{
                background: 'rgba(201,151,30,0.12)',
                border: '1px solid rgba(201,151,30,0.3)',
                color: 'var(--color-gold-600)',
              }}
            >
              ★ TCC Vibe Code 2026
            </div>

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
                  <Tombol varian="primer" ukuran="sedang" lebarPenuh ikonKanan={<Sparkles size={14} />}>
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
