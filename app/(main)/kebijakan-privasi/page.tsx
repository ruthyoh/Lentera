import type { Metadata } from 'next';
import Link from 'next/link';
import { Shield, Lock, FileText, ArrowLeft, Printer } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Kebijakan Privasi | Lentera',
  description: 'Kebijakan Privasi dan Perlindungan Data Pribadi Pengguna Platform Lentera.',
};

export default function KebijakanPrivasiPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 bg-slate-100 text-slate-900">
      <div className="container-lentera max-w-4xl mx-auto px-4">
        
        {/* Tombol Navigasi */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 font-semibold transition-colors bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm"
          >
            <ArrowLeft size={16} />
            Kembali ke Beranda
          </Link>
          <div className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-medium bg-white px-3 py-1.5 rounded-md border border-slate-200">
            <Printer size={14} />
            Dokumen Resmi Lentera
          </div>
        </div>

        {/* Paper Document Container (Background Putih Formal) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-8 md:p-14 text-slate-800 space-y-8">
          
          {/* Header Dokumen Formal */}
          <div className="border-b-2 border-slate-900 pb-8 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase px-3 py-1 bg-slate-100 text-slate-800 rounded border border-slate-300">
                <Shield size={14} className="text-slate-700" />
                Dokumen Kerahasiaan &amp; Kebijakan Data
              </span>
              <span className="text-xs text-slate-500 font-medium">Ref: LNT-PRV-2026/V2</span>
            </div>

            <h1
              className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              KEBIJAKAN PRIVASI DAN PERLINDUNGAN DATA PRIBADI
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs text-slate-600 bg-slate-50 p-4 rounded-lg border border-slate-200 font-mono">
              <div><strong>Tanggal Berlaku:</strong> 24 Agustus 2026</div>
              <div><strong>Versi Dokumen:</strong> 2.0 (Revisi Terbaru)</div>
              <div><strong>Status:</strong> Resmi &amp; Mengikat</div>
            </div>
          </div>

          {/* Pernyataan Pembuka */}
          <div className="p-5 rounded-lg bg-slate-50 border-l-4 border-slate-900 text-slate-700 text-sm leading-relaxed font-medium">
            Selamat datang di Platform <strong>Lentera</strong> (&quot;Kami&quot;). Kebijakan Privasi ini disusun untuk memberikan penjelasan secara terbuka, transparan, dan rinci mengenai bagaimana kami mengumpulkan, mengelola, menyimpan, serta melindungi data pribadi seluruh pengguna platform (&quot;Pengguna&quot; atau &quot;Anda&quot;).
          </div>

          {/* Bab 1: Informasi yang Dikumpulkan */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wide border-b border-slate-200 pb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-slate-900 text-white text-xs flex items-center justify-center font-mono">1</span>
              Jenis Informasi yang Dikumpulkan
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              Kami mengumpulkan beberapa kategori data pribadi yang diberikan secara langsung saat pendaftaran akun maupun penggunaan layanan:
            </p>
            <div className="space-y-3 pl-2 text-sm text-slate-700">
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <strong className="text-slate-900 block mb-1 font-semibold">1.1 Data Identifikasi Pribadi</strong>
                Nama lengkap, alamat surat elektronik (email), dan kata sandi tersandi (*encrypted password*).
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <strong className="text-slate-900 block mb-1 font-semibold">1.2 Data Profil Akademik</strong>
                Asal perguruan tinggi, program studi/jurusan, tingkat semester, Indeks Prestasi Kumulatif (IPK), serta data kriteria khusus beasiswa.
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <strong className="text-slate-900 block mb-1 font-semibold">1.3 Berkas Dokumen &amp; Konten Pembelajaran</strong>
                File catatan kuliah, modul, rangkuman, dan dokumen soal yang diunggah secara sukarela oleh Pengguna ke dalam platform.
              </div>
            </div>
          </section>

          {/* Bab 2: Tujuan Pengolahan Data */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wide border-b border-slate-200 pb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-slate-900 text-white text-xs flex items-center justify-center font-mono">2</span>
              Tujuan Pengolahan &amp; Pemanfaatan Data
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              Seluruh data pribadi yang dikumpulkan digunakan semata-mata untuk kepentingan operasional dan peningkatan kualitas akademik Pengguna:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-slate-700 pl-2">
              <li>Memverifikasi identitas dan memelihara keamanan akun Pengguna.</li>
              <li>Memberikan rekomendasi beasiswa yang tepat sasaran berdasarkan kriteria IPK, jurusan, dan profil Pengguna melalui algoritma pencocokan AI.</li>
              <li>Membangkitkan draf esai motivasi beasiswa dan kuis otomatis melalui teknologi pemrosesan bahasa alami.</li>
              <li>Mengakumulasi poin kontribusi dan menampilkan peringkat Pengguna pada Papan Peringkat resmi Lentera.</li>
            </ul>
          </section>

          {/* Bab 3: Kerahasiaan & Keamanan Data */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wide border-b border-slate-200 pb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-slate-900 text-white text-xs flex items-center justify-center font-mono">3</span>
              Jaminan Kerahasiaan &amp; Keamanan Data
            </h2>
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-950 text-sm leading-relaxed space-y-2">
              <div className="flex items-center gap-2 font-bold text-emerald-900">
                <Lock size={16} />
                Komitmen Penjualan Data Nol (Zero Data Commercialization)
              </div>
              <p>
                Platform Lentera <strong>TIDAK PERNAH SEKALIPUN SEWA ATAU MENJUAL DATA PRIBADI PENGGUNA</strong> kepada pihak ketiga maupun agen periklanan komersial manapun.
              </p>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              Data disimpan menggunakan infrastruktur basis data aman dengan mekanisme proteksi <em>Row Level Security</em> (RLS) serta standar enkripsi SSL/TLS 256-bit selama transmisi data berlangsung.
            </p>
          </section>

          {/* Bab 4: Pemrosesan Data Fitur AI */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wide border-b border-slate-200 pb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-slate-900 text-white text-xs flex items-center justify-center font-mono">4</span>
              Pemrosesan Data Fitur Kecerdasan Buatan (AI)
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              Dalam pengoperasian fitur Asisten AI (Ringkasan Materi, Draf Esai Beasiswa, Kuis Otomatis):
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-slate-700 pl-2">
              <li>Data teks masukan hanya diproses secara temporer (*in-memory*) untuk menghasilkan keluaran instruksi yang relevan.</li>
              <li>Data teks Pengguna tidak digunakan untuk melatih (*training*) model AI publik.</li>
            </ul>
          </section>

          {/* Bab 5: Hak-Hak Pengguna */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wide border-b border-slate-200 pb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-slate-900 text-white text-xs flex items-center justify-center font-mono">5</span>
              Hak-Hak Pengguna Terhadap Data
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              Pengguna memiliki hak penuh sesuai perundang-undangan perlindungan data pribadi yang berlaku:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-sm text-slate-700 pl-2">
              <li><strong>Hak Akses &amp; Perbaikan:</strong> Memperbarui informasi nama, jurusan, semester, dan IPK di menu Pengaturan.</li>
              <li><strong>Hak Penghapusan Conten:</strong> Menghapus berkas materi pembelajaran yang telah diunggah sebelumnya.</li>
              <li><strong>Hak Penutupan Akun:</strong> Mengajukan permohonan penonaktifan akun dan penghapusan data secara menyeluruh.</li>
            </ol>
          </section>

          {/* Footer Dokumen / Kontak */}
          <div className="pt-8 border-t border-slate-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-slate-600 bg-slate-50 p-6 rounded-xl border border-slate-200">
            <div className="space-y-1">
              <p className="font-bold text-slate-900 text-sm">Tim Perlindungan Data Lentera</p>
              <p>Email Resmi: <span className="font-mono text-slate-900 underline">privasi@lentera.tcc.id</span></p>
              <p>Diikutsertakan dalam kompetisi <strong>TCC Vibe Code 2026</strong></p>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1.5 font-bold text-slate-800 bg-white px-3 py-1.5 rounded border border-slate-300 shadow-sm">
                <FileText size={14} /> Dokumen Hukum Sah
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
