import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // pdf-parse hanya berjalan di Node.js server-side, jangan di-bundle oleh webpack
  serverExternalPackages: ['pdf-parse'],
  experimental: {
    serverActions: {
      bodySizeLimit: '15mb',
    },
  },
};

export default nextConfig;
