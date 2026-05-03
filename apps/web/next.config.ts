import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@repo/api-client', '@repo/store', '@repo/types'],
};

export default nextConfig;
