import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  webpack(config) {
    config.experiments = { asyncWebAssembly: true, ...config.experiments };
    return config;
  },
};

export default nextConfig;
