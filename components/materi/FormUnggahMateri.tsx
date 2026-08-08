'use client';

import { useActionState, useState } from 'react';
import Link from 'next/link';
import {
  Upload, FileText, BookOpen, Layers, AlignLeft,
  ArrowRight, AlertCircle, CheckCircle, ArrowLeft, Sparkles, FileCheck,
} from 'lucide-react';
import { unggahMateri, type MateriState } from '@/lib/actions/materi';
import Input from '@/components/ui/Input';
import Tombol from '@/components/ui/Button';

const initialState: MateriState = {};

const pilihanKategori = [
  { value: 'catatan', label: 'Catatan Kuliah' },
  { value: 'rangkuman', label: 'Rangkuman Materi' },
  { value: 'bank_soal', label: 'Bank Soal & Pembahasan' },
  { value: 'modul', label: 'Modul / Handout' },
  { value: 'presentasi', label: 'Slide Presentasi' },
  { value: 'lainnya', label: 'Lainnya' },
];

export default function FormUnggahMateri() {
  const [state, formAction, pending] = useActionState(unggahMateri, initialState);
  const [namaFile, setNamaFile] = useState<string | null>(null);
  const [ukuranFile, setUkuranFile] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setNamaFile(file.name);
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
      setUkuranFile(`${sizeMb} MB`);
    } else {
      setNamaFile(null);
      setUkuranFile(null);
    }
  }

  return (
    <form action={formAction} className="space-y-6" noValidate>
      {/* Alert Error Global */}
      {state.error && (
        <div
          role="alert"
          className="flex items-start gap-3 p-4 rounded-[var(--radius-sm)] text-sm font-medium"
          style={{
            background: 'rgba(220, 38, 38, 0.08)',
            border: '1px solid rgba(220, 38, 38, 0.25)',
            color: '#b91c1c',
          }}
        >
          <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
          <span>{state.error}</span>
        </div>
      )}

      {/* Alert Sukses */}
      {state.sukses && state.pesan && (
        <div
          role="status"
          className="p-6 rounded-[var(--radius-md)] text-center space-y-4"
          style={{
            background: 'var(--color-gold-50)',
            border: '1px solid var(--color-gold-300)',
          }}
        >
          <div
            className="w-12 h-12 rounded-full mx-auto flex items-center justify-center"
            style={{ background: 'var(--color-gold-100)', color: 'var(--color-gold-700)' }}
          >
            <CheckCircle size={24} />
          </div>
          <div>
            <h3
              className="text-lg font-bold"
              style={{ color: 'var(--color-gold-900)', fontFamily: 'var(--font-display)' }}
            >
              Materi Berhasil Diunggah!
            </h3>
            <p className="text-sm mt-1 text-[var(--text-on-light)]">{state.pesan}</p>
          </div>
          <div className="flex justify-center gap-3 pt-2">
            <Link href="/jelajah">
              <Tombol varian="outline" ukuran="sedang">
                Lihat di Jelajah
              </Tombol>
            </Link>
            {state.materiId && (
              <Link href={`/materi/${state.materiId}`}>
                <Tombol varian="primer" ukuran="sedang" ikonKanan={<ArrowRight size={14} />}>
                  Lihat Detail Materi
                </Tombol>
              </Link>
            )}
          </div>
        </div>
      )}

      {!state.sukses && (
        <>
          {/* Section 1: Upload File */}
          <div className="space-y-2">
            <label
              className="block text-sm font-semibold text-[var(--text-on-light)]"
              htmlFor="file-materi"
            >
              Berkas Materi <span className="text-red-500">*</span>
            </label>
            <div
              className="border-2 border-dashed rounded-[var(--radius-md)] p-8 text-center transition-all duration-200 hover:border-[var(--color-gold-500)] bg-white relative"
              style={{
                borderColor: state.fieldErrors?.file
                  ? '#f87171'
                  : 'var(--color-cream-400)',
              }}
            >
              <input
                id="file-materi"
                name="file"
                type="file"
                accept=".pdf,.docx,.doc,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                required
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="flex flex-col items-center gap-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ background: 'var(--color-gold-100)', color: 'var(--color-gold-700)' }}
                >
                  {namaFile ? <FileCheck size={24} /> : <Upload size={24} />}
                </div>
                {namaFile ? (
                  <div>
                    <p className="font-semibold text-sm text-[var(--text-on-light)]">{namaFile}</p>
                    <p className="text-xs text-[var(--color-gold-600)] mt-0.5 font-medium">
                      Ukuran: {ukuranFile} — Klik atau tarik file lain untuk mengganti
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="font-semibold text-sm text-[var(--text-on-light)]">
                      Klik atau tarik file ke area ini
                    </p>
                    <p className="text-xs text-[var(--text-muted-on-light)] mt-1">
                      Format diizinkan: <strong>PDF</strong> atau <strong>DOCX</strong> (Maksimal 10 MB)
                    </p>
                  </div>
                )}
              </div>
            </div>
            {state.fieldErrors?.file && (
              <p className="text-xs text-red-600 font-medium">{state.fieldErrors.file}</p>
            )}
          </div>

          {/* Section 2: Informasi Materi */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Judul Materi */}
            <Input
              id="judul-materi"
              name="judul"
              label="Judul Materi"
              placeholder="contoh: Catatan Lengkap Kalkulus 1 Semester 1"
              required
              ikonKiri={<FileText size={16} />}
              error={state.fieldErrors?.judul}
            />

            {/* Mata Kuliah */}
            <Input
              id="mata-kuliah"
              name="mata_kuliah"
              label="Mata Kuliah"
              placeholder="contoh: Kalkulus 1 / Algoritma Pemrograman"
              required
              ikonKiri={<BookOpen size={16} />}
              error={state.fieldErrors?.mata_kuliah}
            />
          </div>

          {/* Kategori */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="kategori"
              className="text-sm font-semibold flex items-center gap-1.5 text-[var(--text-on-light)]"
            >
              <Layers size={15} />
              Kategori Materi <span className="text-red-500">*</span>
            </label>
            <select
              id="kategori"
              name="kategori"
              required
              className="w-full rounded-[var(--radius-sm)] border px-4 py-3 text-sm bg-white transition-all focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-500)]"
              style={{
                borderColor: state.fieldErrors?.kategori
                  ? '#f87171'
                  : 'var(--color-cream-400)',
                color: 'var(--text-on-light)',
              }}
              defaultValue="catatan"
            >
              {pilihanKategori.map((k) => (
                <option key={k.value} value={k.value}>
                  {k.label}
                </option>
              ))}
            </select>
            {state.fieldErrors?.kategori && (
              <p className="text-xs text-red-600 font-medium">{state.fieldErrors.kategori}</p>
            )}
          </div>

          {/* Deskripsi */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="deskripsi"
              className="text-sm font-semibold flex items-center gap-1.5 text-[var(--text-on-light)]"
            >
              <AlignLeft size={15} />
              Deskripsi Singkat (opsional)
            </label>
            <textarea
              id="deskripsi"
              name="deskripsi"
              rows={4}
              placeholder="Jelaskan secara singkat topik apa saja yang dibahas dalam materi ini..."
              className="w-full rounded-[var(--radius-sm)] border p-4 text-sm bg-white transition-all focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-500)]"
              style={{ borderColor: 'var(--color-cream-400)', color: 'var(--text-on-light)' }}
            />
          </div>

          {/* Tombol Submit */}
          <div className="pt-4 flex items-center justify-between border-t border-[var(--color-cream-300)]">
            <Link href="/jelajah">
              <Tombol varian="hantu" ukuran="sedang" ikonKiri={<ArrowLeft size={15} />}>
                Batal
              </Tombol>
            </Link>
            <Tombol
              type="submit"
              varian="primer"
              ukuran="besar"
              sedangMemuat={pending}
              ikonKanan={!pending ? <Sparkles size={16} /> : undefined}
              id="tombol-submit-unggah"
            >
              {pending ? 'Sedang Mengunggah & Memproses...' : 'Unggah & Dapatkan +10 Poin'}
            </Tombol>
          </div>
        </>
      )}
    </form>
  );
}
