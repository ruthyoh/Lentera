import _pdfParse from 'pdf-parse';

/**
 * Ekstrak teks dari buffer berkas PDF di server.
 * Menggunakan library pdf-parse dengan resolusi fungsi aman untuk Turbopack/Next.js.
 *
 * @param buffer - Buffer file PDF dari Supabase Storage
 * @returns Teks bersih isi materi (atau string kosong jika gagal)
 */
export async function ekstrakTeksPDF(buffer: Buffer): Promise<string> {
  try {
    // Resolusi fungsi pdfParse secara fleksibel (menangani kompatibilitas CJS/ESM Turbopack)
    const fn = typeof _pdfParse === 'function' ? _pdfParse : (_pdfParse as any)?.default || _pdfParse;

    if (typeof fn !== 'function') {
      console.warn('[Extractor] pdf-parse bukan merupakan fungsi yang valid.');
      throw new Error('pdf-parse function not found');
    }

    const data = await fn(buffer);
    let teks = (data.text || '').trim();

    // Bersihkan format whitespace berlebih
    teks = teks.replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n');

    // Ambil maksimal 6000 karakter pertama untuk optimasi token Gemini
    if (teks.length > 6000) {
      teks = teks.slice(0, 6000) + '\n...[teks materi dipotong untuk optimasi token]';
    }

    return teks;
  } catch (err) {
    console.warn('[Extractor] Error saat mengekstrak teks PDF dengan pdf-parse:', err);

    // Fallback ekstraksi regex sederhana untuk PDF stream
    try {
      const pdfString = buffer.toString('latin1');
      const matches = pdfString.match(/BT[\s\S]*?ET/g) || [];
      const extractedLines: string[] = [];

      for (const stream of matches) {
        const tjMatches = stream.match(/\((.*?)\)\s*Tj/g) || [];
        for (const tj of tjMatches) {
          const contentMatch = tj.match(/\((.*?)\)\s*Tj/);
          if (contentMatch && contentMatch[1]) {
            const cleanText = contentMatch[1]
              .replace(/\\\( /g, '(')
              .replace(/\\\)/g, ')')
              .replace(/\\\\/g, '\\')
              .trim();
            if (cleanText.length > 0) {
              extractedLines.push(cleanText);
            }
          }
        }
      }

      if (extractedLines.length > 0) {
        return extractedLines.join('\n');
      }
    } catch (fallbackErr) {
      console.error('[Extractor] Fallback regex extraction gagal:', fallbackErr);
    }

    return '';
  }
}
