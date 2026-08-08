import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Gabungkan class Tailwind dengan aman
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format angka Rupiah
export function formatRupiah(angka: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(angka);
}

// Format tanggal ke Bahasa Indonesia
export function formatTanggal(tanggal: string | Date): string {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(tanggal));
}

// Format tanggal relatif (misal: "3 hari yang lalu")
export function formatTanggalRelatif(tanggal: string | Date): string {
  const rtf = new Intl.RelativeTimeFormat('id-ID', { numeric: 'auto' });
  const selisih = (new Date(tanggal).getTime() - Date.now()) / 1000;

  if (Math.abs(selisih) < 60) return rtf.format(Math.round(selisih), 'second');
  if (Math.abs(selisih) < 3600) return rtf.format(Math.round(selisih / 60), 'minute');
  if (Math.abs(selisih) < 86400) return rtf.format(Math.round(selisih / 3600), 'hour');
  if (Math.abs(selisih) < 2592000) return rtf.format(Math.round(selisih / 86400), 'day');
  return rtf.format(Math.round(selisih / 2592000), 'month');
}

// Potong teks panjang
export function potongTeks(teks: string, maks: number): string {
  if (teks.length <= maks) return teks;
  return teks.slice(0, maks) + '...';
}

// Inisial nama pengguna
export function inisialNama(nama: string): string {
  return nama
    .split(' ')
    .slice(0, 2)
    .map((kata) => kata[0])
    .join('')
    .toUpperCase();
}
