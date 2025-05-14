import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '20mb',
    },
  },
  images: {
    remotePatterns: [new URL('http://localhost:9000/**')],
  },
  output: "standalone"
};

export default nextConfig;
