import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '20mb',
    },
  },
  images: {
    remotePatterns: [new URL('http://localhost:9000/**'), new URL("https://minio.srv.bonnefont.com.br/**")],
  },
  output: "standalone"
};

export default nextConfig;
