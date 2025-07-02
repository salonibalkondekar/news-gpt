import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: '/news-gpt',
  assetPrefix: '/news-gpt',
  trailingSlash: true,
  output: 'standalone',
  outputFileTracingRoot: process.cwd(),
};

export default nextConfig;
