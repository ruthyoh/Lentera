/**
 * buatPDFDenganTeks — Membuat PDF minimal dengan teks nyata yang bisa diekstrak oleh pdf-parse.
 * Format: PDF 1.4 dengan Content Stream BT/ET yang mengandung teks ASCII.
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

  const streamBytes = Buffer.from(streamIsi, 'latin1');
  const streamLen = streamBytes.length;

  // Susun struktur objek PDF
  const headerStr =
    `%PDF-1.4\n` +
    `1 0 obj\n<</Type /Catalog /Pages 2 0 R>>\nendobj\n` +
    `2 0 obj\n<</Type /Pages /Kids [3 0 R] /Count 1>>\nendobj\n` +
    `3 0 obj\n<</Type /Page /Parent 2 0 R /MediaBox [0 0 612 792]\n  /Contents 4 0 R /Resources <</Font <</F1 5 0 R>>>>>>\nendobj\n` +
    `4 0 obj\n<</Length ${streamLen}>>\nstream\n`;

  const trailerStr =
    `\nendstream\nendobj\n` +
    `5 0 obj\n<</Type /Font /Subtype /Type1 /BaseFont /Helvetica>>\nendobj\n` +
    `xref\n0 6\n0000000000 65535 f \n`;

  // Hitung offset sederhana
  const headerBuf = Buffer.from(headerStr, 'latin1');
  const trailerBuf = Buffer.from(trailerStr, 'latin1');

  const startXref = headerBuf.length + streamBytes.length + Buffer.from('\nendstream\nendobj\n5 0 obj\n<</Type /Font /Subtype /Type1 /BaseFont /Helvetica>>\nendobj\n', 'latin1').length;
  const trailerFull =
    trailerStr +
    `0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000266 00000 n \n` +
    `trailer\n<</Size 6 /Root 1 0 R>>\nstartxref\n${startXref}\n%%EOF\n`;

  const parts = [
    Buffer.from(headerStr, 'latin1'),
    streamBytes,
    Buffer.from(trailerFull.replace(trailerStr, ''), 'latin1'),
  ];

  // Gabung semua bagian
  const fullStr = `%PDF-1.4\n` +
    `1 0 obj\n<</Type /Catalog /Pages 2 0 R>>\nendobj\n` +
    `2 0 obj\n<</Type /Pages /Kids [3 0 R] /Count 1>>\nendobj\n` +
    `3 0 obj\n<</Type /Page /Parent 2 0 R /MediaBox [0 0 612 792]\n  /Contents 4 0 R /Resources <</Font <</F1 5 0 R>>>>>>\nendobj\n` +
    `4 0 obj\n<</Length ${streamLen}>>\nstream\n` +
    streamIsi +
    `\nendstream\nendobj\n` +
    `5 0 obj\n<</Type /Font /Subtype /Type1 /BaseFont /Helvetica>>\nendobj\n` +
    `trailer\n<</Size 6 /Root 1 0 R>>\nstartxref\n1\n%%EOF\n`;

  return Buffer.from(fullStr, 'latin1');
}
