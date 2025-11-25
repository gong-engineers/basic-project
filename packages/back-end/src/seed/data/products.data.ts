import { item } from '@basic-project/shared-types';

export const PRODUCTS_DATA = [
  {
    id: 101,
    name: '프리미어리그 축구공',
    price: 35000,
    images: [
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/premium-soccer-ball-sports-L0HWO95IaAh1l445rk4iruhv3TQk4w.jpg',
    ],
    description: '프리미어리그 공식 사용구입니다. 최고급 재질을 자랑합니다.',
    discountPrice: 30000,
    discountStartDate: new Date('2024-01-01'),
    discountEndDate: new Date('2025-12-31'),
    category: 'SOCCER' as item.Category,
  },
  {
    id: 102,
    name: 'KBO 공식 야구배트',
    price: 89000,
    images: [
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/baseball-bat-aluminum-alloy-r9zVRzvmcZlCSFSZukzCChHhZhtj8v.jpg',
    ],
    description: '알루미늄 합금으로 만들어져 가볍고 튼튼합니다.',
    discountPrice: 0,
    discountStartDate: null,
    discountEndDate: null,
    category: 'BASEBALL' as item.Category,
  },
  {
    id: 103,
    name: '프로 농구화',
    price: 150000,
    images: [
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/basketball-shoes-professional-NermU48yVfCNjoaJMG8qwD65EGccNR.jpg',
    ],
    description: '최신 기술이 적용된 쿠셔닝으로 발목을 보호합니다.',
    discountPrice: 135000,
    discountStartDate: new Date('2024-05-01'),
    discountEndDate: new Date('2024-05-31'),
    category: 'BASKETBALL' as item.Category,
  },
];
