import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '20mb',
    },
  },
  images: {
    remotePatterns: [new URL('http://localhost:9000/**'),
    new URL("https://minio-tsk4sos4g4g848w0wgkswk0s.31.97.18.31.sslip.io/**")],
  },
  output: "standalone"
};

export default nextConfig;
