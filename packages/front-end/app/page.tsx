'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { client, handleAPI, APIError } from '../lib/api';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // 로그인 기능 합치기 이전까지의 데스트 로그인 api 호출
  //   const response = client.post('http://localhost:3001/auth/login', {
  //     email: 'test@gmasil.com',
  //     password: 'testtest',
  //   },
  //   {
  //     mode: "cors",                // CORS 요청 허용
  // credentials: "include",      // 쿠키 포함
  // headers: {
  //   "Content-Type": "application/json",
  // },
  //   });
  //   console.log(response);
    // router.push('/carts');
  }, []);

  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div>Basic Project</div>
      </div>
    </>
  );
}
