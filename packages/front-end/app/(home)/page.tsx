'use client';

import { client } from '@/lib/api';
import { item } from '@basic-project/shared-types';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import ItemCard from './components/ItemCard';

// 임시로 만든 로그인 응답 타입
interface LoginResponse {
  accessToken: string;
}

export default function Home() {
  const [productList, setProductList] = useState<item.Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    if (typeof window !== 'undefined') {
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

  // 로그인 기능이 합쳐지기 전까지 임의 로그인 핸들러 추가
  const handleLogin = async () => {
    try {
      const loginResponse = await client.post<
        { email: string; password: string },
        LoginResponse
      >(
        'http://localhost:3001/auth/login',
        { email: 'test@gmail.com', password: 'testtest' },
        {
          mode: 'cors',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        },
      );

      // 로그인 후 AccessToken을 localstorage에 저장
      localStorage.setItem(
        'accessToken',
        'Bearer ' + loginResponse.accessToken,
      );

      setIsLoggedIn(true);
    } catch (err) {
      console.error('로그인 실패:', err);
    }
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
