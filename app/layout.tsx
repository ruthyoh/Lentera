import type { Metadata } from 'next';
import './globals.css';
import ClientLayoutWrapper from '@/components/layout/ClientLayoutWrapper';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { ProfilRingkas } from '@/types';


export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: {
    default: 'Lentera — Platform Belajar & Beasiswa Mahasiswa Indonesia',
    template: '%s | Lentera',
  },
  description:
    'Lentera adalah platform terintegrasi yang mendukung keberlanjutan akses pendidikan mahasiswa melalui repositori materi belajar dan basis data beasiswa dengan bantuan kecerdasan buatan.',
  keywords: [
    'beasiswa mahasiswa',
    'materi kuliah',
    'catatan kuliah',
    'bank soal',
    'beasiswa indonesia',
    'asisten belajar AI',
    'platform pendidikan',
    'lentera',
  ],
  authors: [{ name: 'Tim Lentera — TCC Vibe Code 2026' }],
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://lentera.vercel.app',
    siteName: 'Lentera',
    title: 'Lentera — Platform Belajar & Beasiswa Mahasiswa Indonesia',
    description:
      'Akses ribuan materi kuliah dan temukan beasiswa yang tepat untukmu dengan bantuan AI.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lentera',
    description: 'Platform belajar dan beasiswa mahasiswa Indonesia',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let profil: ProfilRingkas | null = null;

  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('id, nama_lengkap, poin_kontribusi, avatar_url')
        .eq('id', user.id)
        .single();

      if (data) {
        profil = data;
      } else {
        // Fallback jika profile belum terbuat
        profil = {
          id: user.id,
          nama_lengkap: user.user_metadata?.nama_lengkap || user.email?.split('@')[0] || 'Pengguna',
          poin_kontribusi: 0,
          avatar_url: null,
        };
      }
    }
  } catch (error) {
    // Abaikan error pada build/SSR tanpa env Supabase
    console.error('Gagal mengambil profil di RootLayout:', error);
  }

  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
        <meta name="theme-color" content="#081B3A" />
      </head>
      <body>
        <ClientLayoutWrapper profil={profil}>
          {children}
        </ClientLayoutWrapper>
      </body>
    </html>
  );
}


