'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import {
  Mail, Lock, User, GraduationCap, BookMarked, Calculator,
  ArrowRight, AlertCircle, CheckCircle, Building2
} from 'lucide-react';
import { daftarAkun } from '@/lib/actions/auth';
import Input from '@/components/ui/Input';
import Tombol from '@/components/ui/Button';
import type { AuthState } from '@/types';

const initialState: AuthState = {};

const pilihanSemester = Array.from({ length: 8 }, (_, i) => ({
  value: String(i + 1),
  label: `Semester ${i + 1}`,
}));

const pilihanJurusan = [
  'Teknik Informatika',
  'Sistem Informasi',
  'Teknik Elektro',
  'Teknik Sipil',
  'Teknik Mesin',
  'Teknik Kimia',
  'Manajemen',
  'Akuntansi',
  'Ekonomi',
  'Hukum',
  'Kedokteran',
  'Psikologi',
  'Pendidikan',
  'Sastra Indonesia',
  'Ilmu Komunikasi',
  'Lainnya',
];

const pilihanKategoriKhusus = [
  { value: '', label: 'Tidak ada (umum)' },
  { value: 'Penerima KIP-K', label: 'Penerima KIP-K' },
  { value: 'Mahasiswa Berprestasi', label: 'Mahasiswa Berprestasi' },
  { value: 'Atlet', label: 'Atlet' },
  { value: 'Disabilitas', label: 'Penyandang Disabilitas' },
];

export default function FormDaftar() {
  const [state, formAction, pending] = useActionState(daftarAkun, initialState);

  return (
    <form
      action={formAction}
      className="space-y-5"
      aria-label="Form pendaftaran akun Lentera"
      noValidate
    >
      {/* Error global */}
      {state.error && (
        <div
          role="alert"
          className="flex items-start gap-3 p-4 rounded-[var(--radius-sm)] text-sm"
          style={{
            background: 'rgba(220, 38, 38, 0.08)',
            border: '1px solid rgba(220, 38, 38, 0.25)',
            color: '#b91c1c',
          }}
        >
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
          <span>{state.error}</span>
        </div>
      )}

      {/* Pesan sukses */}
      {state.sukses && state.pesan && (
        <div
          role="status"
          className="flex items-start gap-3 p-4 rounded-[var(--radius-sm)] text-sm font-medium"
          style={{
            background: 'var(--color-gold-50)',
            border: '1px solid var(--color-gold-200)',
            color: 'var(--color-gold-900)',
          }}
        >
          <CheckCircle size={16} className="flex-shrink-0 mt-0.5 text-[var(--color-gold-600)]" />
          <span>{state.pesan}</span>
        </div>
      )}

      {/* Nama Lengkap */}
      <Input
        id="nama-lengkap"
        name="nama_lengkap"
        label="Nama Lengkap"
        type="text"
        placeholder="contoh: Budi Santoso"
        autoComplete="name"
        required
        ikonKiri={<User size={16} />}
        error={state.fieldErrors?.nama_lengkap}
        defaultValue=""
      />

      {/* Asal Institusi */}
      <Input
        id="asal-institusi"
        name="asal_institusi"
        label="Asal Perguruan Tinggi"
        type="text"
        placeholder="contoh: Universitas Indonesia"
        autoComplete="organization"
        ikonKiri={<Building2 size={16} />}
        error={state.fieldErrors?.asal_institusi}
        petunjuk="Nama lengkap perguruan tinggi Anda"
        defaultValue=""
      />

      {/* Email */}
      <Input
        id="email-daftar"
        name="email"
        label="Alamat Email"
        type="email"
        placeholder="mahasiswa@email.com"
        autoComplete="email"
        required
        ikonKiri={<Mail size={16} />}
        error={state.fieldErrors?.email}
        defaultValue=""
      />

      {/* Kata Sandi */}
      <Input
        id="kata-sandi-daftar"
        name="kata_sandi"
        label="Kata Sandi"
        type="password"
        placeholder="Minimal 8 karakter"
        autoComplete="new-password"
        required
        ikonKiri={<Lock size={16} />}
        error={state.fieldErrors?.kata_sandi}
        petunjuk="Gunakan minimal 8 karakter"
        defaultValue=""
      />

      {/* Divider data akademik */}
      <div
        className="divider-teks text-xs py-2"
        style={{ color: 'var(--text-muted-on-dark)' }}
      >
        Data Akademik (opsional — untuk pencocokan beasiswa)
      </div>

      {/* Jurusan */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="jurusan"
          className="text-sm font-semibold flex items-center gap-1.5"
          style={{ color: 'var(--text-on-dark)' }}
        >
          <GraduationCap size={14} />
          Jurusan / Program Studi
        </label>
        <select
          id="jurusan"
          name="jurusan"
          className="w-full rounded-[var(--radius-sm)] border px-4 py-3 text-sm bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-500)] focus:border-transparent"
          style={{
            borderColor: state.fieldErrors?.jurusan
              ? '#f87171'
              : 'rgba(255, 255, 255, 0.2)',
            color: '#0f172a',
          }}
          defaultValue=""
        >
          <option value="" style={{ color: '#0f172a' }}>Pilih jurusan Anda</option>
          {pilihanJurusan.map((j) => (
            <option key={j} value={j} style={{ color: '#0f172a' }}>{j}</option>
          ))}
        </select>
        {state.fieldErrors?.jurusan && (
          <p className="text-xs text-red-400 font-medium">{state.fieldErrors.jurusan}</p>
        )}
      </div>

      {/* Semester & IPK */}
      <div className="grid grid-cols-2 gap-4">
        {/* Semester */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="semester"
            className="text-sm font-semibold flex items-center gap-1.5"
            style={{ color: 'var(--text-on-dark)' }}
          >
            <BookMarked size={14} />
            Semester
          </label>
          <select
            id="semester"
            name="semester"
            className="w-full rounded-[var(--radius-sm)] border px-4 py-3 text-sm bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-500)] focus:border-transparent"
            style={{
              borderColor: state.fieldErrors?.semester
                ? '#f87171'
                : 'rgba(255, 255, 255, 0.2)',
              color: '#0f172a',
            }}
            defaultValue=""
          >
            <option value="" style={{ color: '#0f172a' }}>Pilih</option>
            {pilihanSemester.map((s) => (
              <option key={s.value} value={s.value} style={{ color: '#0f172a' }}>{s.label}</option>
            ))}
          </select>
          {state.fieldErrors?.semester && (
            <p className="text-xs text-red-400 font-medium">{state.fieldErrors.semester}</p>
          )}
        </div>

        {/* IPK */}
        <Input
          id="ipk"
          name="ipk"
          label="IPK (opsional)"
          type="number"
          placeholder="contoh: 3.75"
          min="0"
          max="4"
          step="0.01"
          ikonKiri={<Calculator size={14} />}
          error={state.fieldErrors?.ipk}
          petunjuk="Skala 0.00–4.00"
          defaultValue=""
        />
      </div>

      {/* Kategori Khusus */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="kategori-khusus"
          className="text-sm font-semibold"
          style={{ color: 'var(--text-on-dark)' }}
        >
          Kategori Khusus (opsional)
        </label>
        <select
          id="kategori-khusus"
          name="kategori_khusus"
          className="w-full rounded-[var(--radius-sm)] border px-4 py-3 text-sm bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-500)] focus:border-transparent"
          style={{ borderColor: 'rgba(255, 255, 255, 0.2)', color: '#0f172a' }}
          defaultValue=""
        >
          {pilihanKategoriKhusus.map((k) => (
            <option key={k.value} value={k.value} style={{ color: '#0f172a' }}>{k.label}</option>
          ))}
        </select>
        <p className="text-xs" style={{ color: 'var(--text-muted-on-dark)' }}>
          Digunakan untuk pencocokan beasiswa yang lebih akurat
        </p>
      </div>

      {/* Persetujuan */}
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id="setuju-syarat"
          name="setuju_syarat"
          required
          className="mt-0.5 w-4 h-4 rounded border-slate-400 accent-[var(--color-gold-600)]"
        />
        <label
          htmlFor="setuju-syarat"
          className="text-sm leading-relaxed"
          style={{ color: 'var(--text-muted-on-dark)' }}
        >
          Saya menyetujui{' '}
          <Link
            href="/syarat-ketentuan"
            className="font-semibold underline text-[var(--color-gold-400)] hover:text-amber-300"
            target="_blank"
          >
            Syarat &amp; Ketentuan
          </Link>{' '}
          dan{' '}
          <Link
            href="/kebijakan-privasi"
            className="font-semibold underline text-[var(--color-gold-400)] hover:text-amber-300"
            target="_blank"
          >
            Kebijakan Privasi
          </Link>{' '}
          Lentera.
        </label>
      </div>

      <Tombol
        type="submit"
        varian="primer"
        ukuran="besar"
        lebarPenuh
        sedangMemuat={pending}
        ikonKanan={!pending ? <ArrowRight size={16} /> : undefined}
        id="tombol-daftar"
      >
        {pending ? 'Membuat Akun...' : 'Buat Akun Gratis'}
      </Tombol>

      <p className="text-center text-sm" style={{ color: 'var(--text-muted-on-dark)' }}>
        Sudah punya akun?{' '}
        <Link
          href="/login"
          className="font-semibold transition-colors hover:underline text-[var(--color-gold-400)]"
        >
          Masuk sekarang
        </Link>
      </p>
    </form>
  );
}
