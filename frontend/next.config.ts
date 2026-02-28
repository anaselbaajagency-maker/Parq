import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

const nextConfig: NextConfig = {
  turbopack: {
    // Avoid monorepo root inference warnings when multiple lockfiles exist.
    root: process.cwd(),
  },
  output: 'standalone', // Optimized for Node.js hosting (cPanel Node.js App)
  images: {
    unoptimized: true,
  },
};

export default withNextIntl(nextConfig);
