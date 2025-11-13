import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // 테스트 이미지 전용
    domains: ['picsum.photos'],
  },
};

export default nextConfig;
