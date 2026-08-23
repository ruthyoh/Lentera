/**
 * buatPDFDenganTeks — Membuat PDF minimal dengan teks nyata yang bisa diekstrak oleh pdf-parse.
 * Format: PDF 1.4 dengan Content Stream BT/ET yang mengandung teks ASCII.
 *
 * FIX: Sebelumnya startxref di-hardcode ke nilai 1 yang tidak valid.
 * Sekarang offset xref dihitung secara akurat dari ukuran aktual setiap bagian.
 *
 * @param teksKonten - Teks konten yang akan ditanamkan dalam PDF (ASCII, setiap baris dipisah \n)
 * @returns Buffer PDF yang valid
 */
export function buatPDFDenganTeks(teksKonten: string): Buffer {
  // Encode teks untuk operator Tj (ganti karakter non-ASCII, escape parentheses)
  const barisTeks = teksKonten.split('\n').filter((b) => b.trim());

  // Susun instruksi BT stream per baris
  let streamIsi = 'BT\n/F1 12 Tf\n';
  let y = 720; // Mulai dari atas halaman (koordinat PDF: 0,0 di bawah kiri)

  for (const baris of barisTeks) {
    if (y < 50) break; // Halaman penuh
    // Escape karakter ( dan ) dalam teks Tj
    const teksSafe = baris.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
    streamIsi += `50 ${y} Td\n(${teksSafe}) Tj\n`;
    y -= 16; // Geser ke bawah 16pt tiap baris
  }

  streamIsi += 'ET';

  const streamLen = Buffer.byteLength(streamIsi, 'latin1');

  // ─── Susun struktur objek PDF ──────────────────────────────────────────
  // Object offsets untuk xref table yang akurat
  const obj1 = `1 0 obj\n<</Type /Catalog /Pages 2 0 R>>\nendobj\n`;
  const obj2 = `2 0 obj\n<</Type /Pages /Kids [3 0 R] /Count 1>>\nendobj\n`;
  const obj3 = `3 0 obj\n<</Type /Page /Parent 2 0 R /MediaBox [0 0 612 792]\n  /Contents 4 0 R /Resources <</Font <</F1 5 0 R>>>>>>\nendobj\n`;
  const obj4 = `4 0 obj\n<</Length ${streamLen}>>\nstream\n${streamIsi}\nendstream\nendobj\n`;
  const obj5 = `5 0 obj\n<</Type /Font /Subtype /Type1 /BaseFont /Helvetica>>\nendobj\n`;

  const header = `%PDF-1.4\n`;

  // Hitung offset tiap objek secara akurat
  const off1 = Buffer.byteLength(header, 'latin1');
  const off2 = off1 + Buffer.byteLength(obj1, 'latin1');
  const off3 = off2 + Buffer.byteLength(obj2, 'latin1');
  const off4 = off3 + Buffer.byteLength(obj3, 'latin1');
  const off5 = off4 + Buffer.byteLength(obj4, 'latin1');
  const startXref = off5 + Buffer.byteLength(obj5, 'latin1');

  // Format offset xref (10 digit, padded with zeros)
  function fmt(n: number): string {
    return n.toString().padStart(10, '0');
  }

  const xref =
    `xref\n0 6\n` +
    `0000000000 65535 f \n` +
    `${fmt(off1)} 00000 n \n` +
    `${fmt(off2)} 00000 n \n` +
    `${fmt(off3)} 00000 n \n` +
    `${fmt(off4)} 00000 n \n` +
    `${fmt(off5)} 00000 n \n`;

  const trailer = `trailer\n<</Size 6 /Root 1 0 R>>\nstartxref\n${startXref}\n%%EOF\n`;

  const fullPdf = header + obj1 + obj2 + obj3 + obj4 + obj5 + xref + trailer;

  return Buffer.from(fullPdf, 'latin1');
}
