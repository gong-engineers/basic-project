'use client';

import { client } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { item } from '@basic-project/shared-types';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import ItemCard from './components/ItemCard';

export default function Home() {
  const router = useRouter();
  const [productList, setProductList] = useState<item.Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    if (typeof window !== 'undefined') {
      // Check if running on the client side
      return localStorage.getItem('accessToken') !== null;
    }
    return false;
  });

  // TODO: 서버 패칭하도록 수정 필요
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const data = await client.get<null, item.Product[]>(
          'http://localhost:3001/api/v1/products',
        );

        setProductList(data);
      } catch (error) {
        console.error('리스트 조회 실패', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // 로그아웃 핸들러
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userName');
    setIsLoggedIn(false);
    router.push('/'); // 홈으로 이동하여 UI 갱신
  };

  return (
    <div>
      {/* TODO: 반응형에 맞춰 아이템 사이즈와 여백 조정 필요 & 다른 화면과 통일 */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 flex flex-wrap gap-4">
        {isLoading ? (
          <div className="flex justify-center items-center w-full py-20">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500" />
          </div>
        ) : (
          <>
            {productList.map((product) => (
              <ItemCard key={product.id} item={product} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
