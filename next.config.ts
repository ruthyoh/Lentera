import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '15mb',
    },
  },
  // Pastikan pdf-parse hanya berjalan di server-side (tidak di-bundle ke client)
  serverExternalPackages: ['pdf-parse'],
};

export default nextConfig;
