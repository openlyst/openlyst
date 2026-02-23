import type { NextConfig } from 'next';

const config: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      // Proxy /icons/* to production so images work on localhost (same-origin, no CORS)
      { source: '/icons/:path*', destination: 'https://openlyst.ink/icons/:path*' },
    ];
  },
};

export default config;
