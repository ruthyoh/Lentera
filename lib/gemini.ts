import { GoogleGenAI } from '@google/genai';

/**
 * Gemini Client — Server-Side Only
 *
 * Model resmi SDK @google/genai v2:
 * 1. gemini-2.0-flash        — model utama
 * 2. gemini-2.0-flash-lite   — model fallback ringan
 */
const DAFTAR_MODEL = [
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
] as const;

export const GEMINI_MODEL = DAFTAR_MODEL[0];

export class GeminiKuotaHabisError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GeminiKuotaHabisError';
  }
}

function adalahErrorKuota(err: unknown): boolean {
  if (err instanceof Error) {
    const msg = err.message.toLowerCase();
    return (
      msg.includes('429') ||
      msg.includes('resource_exhausted') ||
      msg.includes('quota') ||
      msg.includes('rate limit') ||
      msg.includes('rate_limit') ||
      msg.includes('404') ||
      msg.includes('not_found')
    );
  }
  return false;
}

function buatGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    throw new Error(
      '[Gemini] GEMINI_API_KEY belum diatur di .env.local.'
    );
  }
  return new GoogleGenAI({ apiKey: apiKey.trim() });
}

export async function tanyaGemini(prompt: string): Promise<{
  teks: string;
  tokenDigunakan: number;
  modelDigunakan: string;
}> {
  const ai = buatGeminiClient();
  let terakhirError: unknown;

  for (const model of DAFTAR_MODEL) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
      });

      const teks = response.text?.trim() ?? '';
      const tokenDigunakan = response.usageMetadata?.totalTokenCount ?? 0;

      return { teks, tokenDigunakan, modelDigunakan: model };
    } catch (err) {
      terakhirError = err;
      if (adalahErrorKuota(err)) {
        continue;
      }
      throw err;
    }
  }

  throw new GeminiKuotaHabisError(
    terakhirError instanceof Error ? terakhirError.message : 'Kuota harian Gemini API habis.'
  );
}
