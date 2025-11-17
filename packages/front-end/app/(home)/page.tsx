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
    if (typeof window !== 'undefined') { // Check if running on the client side
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
    <div className="min-h-screen bg-white">
      <div className="border border-gray-500 h-30 w-full flex flex-row justify-between items-center">
        <div>TODO: Header 추가</div>
        <div>
          {isLoggedIn ? (
            <div className="flex flex-row gap-4">
              <Link href="/carts">
                <div className="cursor-pointer border border-blue-500 rounded-md p-2 bg-blue-500 text-white">
                  장바구니
                </div>
              </Link>
              <Link href="#">
                <div className="cursor-pointer border border-green-500 rounded-md p-2 bg-green-500 text-white">
                  주문 이력
                </div>
              </Link>
              <button
                onClick={handleLogout}
                className="cursor-pointer rounded-md p-2 bg-red-500 text-white"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <Link href="/login">
              <div className="cursor-pointer rounded-md p-2 bg-blue-600 text-white">
                로그인
              </div>
            </Link>
          )}
        </div>
      </div>
      {/* TODO: 반응형에 맞춰 아이템 사이즈와 여백 조정 필요 & 다른 화면과 통일 */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 flex flex-wrap gap-4">
        <div className="border border-gray-500 h-30 w-full">
          TODO: 검색 영역 추가
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center w-full py-20">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500" />
          </div>
        ) : (
          <>
            {productList.map((product) => (
              <ItemCard key={product.id} item={product} />
            ))}
            {/* TODO: 개발 완료 후 Link 제거 필요 */}
            <Link href="/carts">
              <div className="cursor-pointer border border-blue-500 rounded-md p-2 bg-blue-500 text-white">
                장바구니
              </div>
            </Link>
          </>
        )}
      </div>
      <div className="border border-gray-500 h-30 w-full mt-5">
        TODO: Footer 추가
      </div>
    </div>
  );
}
