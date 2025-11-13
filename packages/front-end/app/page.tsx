'use client';

import Link from 'next/link';
import { useState } from 'react';
import { client } from '../lib/api';

// 임시로 만든 로그인 응답 타입
interface LoginResponse {
  accessToken: string;
}

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken') !== null;
    }
    return false;
  });

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
    <>
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Basic Project</h1>
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
          </div>
        ) : (
          <button
            onClick={handleLogin}
            className="cursor-pointer rounded-md p-2 bg-gray-400 text-white"
          >
            로그인
          </button>
        )}
      </div>
    </>
  );
}
