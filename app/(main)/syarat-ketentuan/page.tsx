import type { Metadata } from 'next';
import Link from 'next/link';
import { Scale, FileText, ArrowLeft, Printer, AlertOctagon } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Syarat & Ketentuan | Lentera',
  description: 'Syarat dan Ketentuan Penggunaan Layanan Platform Akademik Lentera.',
};

export default function SyaratKetentuanPage() {
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
            Dokumen Hukum Resmi
          </div>
        </div>

        {/* Paper Document Container (Background Putih Formal) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-8 md:p-14 text-slate-800 space-y-8">
          
          {/* Header Dokumen Formal */}
          <div className="border-b-2 border-slate-900 pb-8 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase px-3 py-1 bg-slate-100 text-slate-800 rounded border border-slate-300">
                <Scale size={14} className="text-slate-700" />
                Ketentuan Penggunaan Platform (Terms of Service)
              </span>
              <span className="text-xs text-slate-500 font-medium">Ref: LNT-TOS-2026/V2</span>
            </div>

            <h1
              className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              SYARAT DAN KETENTUAN PENGGUNAAN PLATFORM LENTERA
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs text-slate-600 bg-slate-50 p-4 rounded-lg border border-slate-200 font-mono">
              <div><strong>Tanggal Efektif:</strong> 24 Agustus 2026</div>
              <div><strong>Versi Dokumen:</strong> 2.0 (Resmi)</div>
              <div><strong>Sifat:</strong> Mengikat Seluruh Pengguna</div>
            </div>
          </div>

          {/* Pernyataan Pembuka */}
          <div className="p-5 rounded-lg bg-slate-50 border-l-4 border-slate-900 text-slate-700 text-sm leading-relaxed font-medium">
            Dokumen Syarat dan Ketentuan ini mengatur hak, kewajiban, serta batasan hukum antara pengelola Platform <strong>Lentera</strong> (&quot;Pengelola&quot;) dan setiap individu yang mendaftar atau memanfaatkan fasilitas layanan platform (&quot;Pengguna&quot;).
          </div>

          {/* Pasal 1: Ketentuan Umum */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wide border-b border-slate-200 pb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-slate-900 text-white text-xs flex items-center justify-center font-mono">1</span>
              Ketentuan Umum &amp; Penerimaan Ketentuan
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              Dengan membuat akun atau mengakses fitur di Platform Lentera, Pengguna secara sadar menyatakan telah membaca, memahami, dan menyetujui seluruh klausul dalam syarat dan ketentuan ini tanpa pengecualian.
            </p>
          </section>

          {/* Pasal 2: Ketentuan Akun & Pendaftaran */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wide border-b border-slate-200 pb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-slate-900 text-white text-xs flex items-center justify-center font-mono">2</span>
              Ketentuan Pendaftaran &amp; Keamanan Akun
            </h2>
            <div className="space-y-3 pl-2 text-sm text-slate-700">
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <strong className="text-slate-900 block mb-1 font-semibold">2.1 Keabsahan Data Pendaftaran</strong>
                Pengguna wajib memberikan data identitas akademik yang valid dan benar (nama lengkap, asal universitas, jurusan, dan email aktif).
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <strong className="text-slate-900 block mb-1 font-semibold">2.2 Kerahasiaan Kredensial</strong>
                Pengguna bertanggung jawab menjaga kerahasiaan kata sandi akun pribadi. Pengelola tidak bertanggung jawab atas kerugian yang timbul akibat kelalaian Pengguna menjaga kredensial akun.
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <strong className="text-slate-900 block mb-1 font-semibold">2.3 Larangan Akun Ganda</strong>
                Satu Pengguna hanya berhak memiliki 1 (satu) akun terverifikasi. Penggunaan akun tiruan atau ganda (*multi-account*) untuk memanipulasi perolehan poin kontribusi dikategorikan sebagai pelanggaran berat.
              </div>
            </div>
          </section>

          {/* Pasal 3: Hak Cipta & Pengunggahan Materi */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wide border-b border-slate-200 pb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-slate-900 text-white text-xs flex items-center justify-center font-mono">3</span>
              Aturan Pengunggahan Materi &amp; Hak Kekayaan Intelektual
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              Lentera memfasilitasi pertukaran materi akademik antar mahasiswa dengan ketentuan hak cipta sebagai berikut:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-xs space-y-1.5">
                <span className="font-bold text-emerald-900 text-sm block">✓ Materi Diperbolehkan:</span>
                <p className="text-emerald-950">Catatan pribadi hasil olahan sendiri, ringkasan perkuliahan buatan mandiri, serta soal dan pembahasan buatan Pengguna.</p>
              </div>
              <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 text-xs space-y-1.5">
                <span className="font-bold text-rose-900 text-sm block">✕ Materi Dilarang:</span>
                <p className="text-rose-950">Buku teks utuh berhak cipta komersial, dokumen rahasia universitas tanpa wewenang publikasi, berkas plagiat, atau materi yang mengandung unsur SARA dan pornografi.</p>
              </div>
            </div>
          </section>

          {/* Pasal 4: Fitur Kecerdasan Buatan (AI) & Beasiswa */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wide border-b border-slate-200 pb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-slate-900 text-white text-xs flex items-center justify-center font-mono">4</span>
              Penggunaan Fitur AI &amp; Informasi Beasiswa
            </h2>
            <ul className="list-disc list-inside space-y-2 text-sm text-slate-700 pl-2">
              <li>Informasi beasiswa yang ditampilkan merupakan hasil kompilasi publik. Pengguna dianjurkan memverifikasi ulang jadwal dan syarat pada situs resmi penyelenggara beasiswa terkait.</li>
              <li>Fitur Asisten AI (Draf Esai Motivasi, Pencocokan Beasiswa) berfungsi sebagai alat pembantu (*academic assistant tool*). Pengelola tidak menjamin kepastian kelulusan penerimaan beasiswa.</li>
            </ul>
          </section>

          {/* Pasal 5: Poin Kontribusi & Papan Peringkat */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wide border-b border-slate-200 pb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-slate-900 text-white text-xs flex items-center justify-center font-mono">5</span>
              Sistem Poin Kontribusi &amp; Papan Peringkat
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              Pengguna yang mengunggah materi pelajaran yang valid akan mendapatkan tambahan poin kontribusi. Pengelola berhak mengoreksi, menghapus, atau membatalkan perolehan poin apabila terbukti ada tindakan manipulatif atau pengunggahan materi palsu.
            </p>
          </section>

          {/* Pasal 6: Sanksi & Pemblokiran Akun */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wide border-b border-slate-200 pb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-slate-900 text-white text-xs flex items-center justify-center font-mono">6</span>
              Sanksi Pelanggaran &amp; Penangguhan Akun
            </h2>
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-950 text-sm leading-relaxed flex items-start gap-3">
              <AlertOctagon size={20} className="text-amber-700 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-900 mb-1">Hak Tindakan Tegas Pengelola</p>
                <p className="text-xs">
                  Pengelola berhak melakukan penghapusan materi, pembekuan sementara, atau penutupan akun secara permanen (*permanent ban*) atas pelanggaran Syarat dan Ketentuan ini demi menjaga keamanan ekosistem pengguna lain.
                </p>
              </div>
            </div>
          </section>

          {/* Pasal 7: Hukum & Perubahan Ketentuan */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wide border-b border-slate-200 pb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-slate-900 text-white text-xs flex items-center justify-center font-mono">7</span>
              Hukum yang Berlaku &amp; Amandemen
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              Syarat dan Ketentuan ini diatur dan ditafsirkan sesuai dengan hukum yang berlaku di Republik Indonesia. Pengelola berhak mengubah dokumen ini sewaktu-waktu dengan pembaruan tanggal revisi pada bagian atas dokumen.
            </p>
          </section>

          {/* Footer Dokumen / Kontak */}
          <div className="pt-8 border-t border-slate-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-slate-600 bg-slate-50 p-6 rounded-xl border border-slate-200">
            <div className="space-y-1">
              <p className="font-bold text-slate-900 text-sm">Pengelola Legal Lentera Indonesia</p>
              <p>Dukungan Pengguna: <span className="font-mono text-slate-900 underline">bantuan@lentera.tcc.id</span></p>
              <p>Platform Terintegrasi TCC Vibe Code 2026</p>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1.5 font-bold text-slate-800 bg-white px-3 py-1.5 rounded border border-slate-300 shadow-sm">
                <FileText size={14} /> Legitimasi Hukum Sah
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
