import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // 테스트 이미지 전용
    domains: [
      'picsum.photos',
      'hebbkx1anhila5yf.public.blob.vercel-storage.com',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'basic-project-images.s3.us-east-1.amazonaws.com',
        port: '',
        pathname: '/*',
      },
    ],
  },
};

export default nextConfig;
