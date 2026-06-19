/** @type {import('next').NextConfig} */
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // For Next.js 13 and later, you can use the `images` configuration to allow loading images from external domains
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'localhost',
        port: process.env.NEXT_PUBLIC_API_BASE_URL?.includes('https://localhost:7134') ? '7134' : '80',
        pathname: '/**',    
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
    ],
  },
  modularizeImports: {
    '@mui/icons-material': {
      transform: '@mui/icons-material/{{member}}'
    }
  },
  // async headers() {
  //   return [
  //     {
  //       source: '/(.*)',
  //       headers: [
  //         {
  //           key: 'X-Content-Type-Options',
  //           value: 'nosniff',
  //         },
  //         {
  //           key: 'X-Frame-Options',
  //           value: 'DENY',
  //         },
  //         // {
  //         //   key: 'Content-Security-Policy',
  //         //   value: "default-src 'self'; style-src 'self' 'unsafe-inline'"
  //         // },
  //       ],
  //     },
  //     {
  //       source: '/sw.js',
  //       headers: [
  //         {
  //           key: 'Content-Type',
  //           value: 'application/javascript; charset=utf-8',
  //         },
  //         {
  //           key: 'Cache-Control',
  //           value: 'no-cache, no-store, must-revalidate',
  //         },
  //         // {
  //         //   key: 'Content-Security-Policy',
  //         //   value: "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; connect-src 'self' https://localhost:7134;"
  //         // },
  //       ],
  //     },
  //   ];
  // },
};

export default withNextIntl(nextConfig);
