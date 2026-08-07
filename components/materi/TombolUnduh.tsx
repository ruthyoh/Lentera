'use client';

import { useState } from 'react';
import { Download } from 'lucide-react';
import Tombol from '@/components/ui/Button';
import { incrementUnduhan } from '@/lib/actions/materi';

interface TombolUnduhProps {
  materiId: string;
  fileUrl: string | null;
  jumlahUnduhanAwal: number;
}

export default function TombolUnduh({
  materiId,
  fileUrl,
  jumlahUnduhanAwal,
}: TombolUnduhProps) {
  const [jumlahUnduhan, setJumlahUnduhan] = useState(jumlahUnduhanAwal);
  const [sedangMengunduh, setSedangMengunduh] = useState(false);

  async function handleUnduh() {
    if (!fileUrl) {
      alert('File materi tidak tersedia.');
      return;
    }

    setSedangMengunduh(true);

    // Call Server Action to increment count in DB
    const res = await incrementUnduhan(materiId);
    if (res.sukses && res.jumlahUnduhan !== undefined) {
      setJumlahUnduhan(res.jumlahUnduhan);
    } else {
      setJumlahUnduhan((prev) => prev + 1);
    }

    setSedangMengunduh(false);

    // Buka file di tab baru / trigger browser download
    window.open(fileUrl, '_blank', 'noopener,noreferrer');
  }

  return (
    <div className="flex flex-col gap-1">
      <Tombol
        varian="primer"
        ukuran="besar"
        sedangMemuat={sedangMengunduh}
        ikonKiri={<Download size={18} />}
        onClick={handleUnduh}
        id="tombol-unduh-materi"
      >
        {sedangMengunduh ? 'Mempersiapkan Unduhan...' : 'Unduh Berkas Materi'}
      </Tombol>
      <p className="text-xs text-center text-[var(--text-muted-on-light)] font-medium">
        Diunduh sebanyak <strong>{jumlahUnduhan.toLocaleString('id-ID')}</strong> kali
      </p>
    </div>
  );
}
