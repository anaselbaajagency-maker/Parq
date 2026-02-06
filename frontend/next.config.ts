import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

const nextConfig: NextConfig = {
  // output: 'export', // Disabled to allow Middleware
  images: {
    unoptimized: true,
  },
};

export default withNextIntl(nextConfig);
