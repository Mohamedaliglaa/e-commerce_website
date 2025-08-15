import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['raw.githubusercontent.com', 'firebasestorage.googleapis.com'],
  },
  // ...other config options if any
};

export default nextConfig;
