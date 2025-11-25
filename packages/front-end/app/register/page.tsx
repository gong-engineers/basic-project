'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// name: 사용자 이름
// email, password: 로그인에 사용될 계정 정보
// phone: 전화번호 (선택사항)
// loading: 전송 중 버튼 비활성화/스피너 대체 텍스트에 사용
// error: 에러 메시지 표시
export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 회원가입 폼 제출 시 실행되는 함수
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // 클라이언트 측 유효성 검사
    // - 이메일은 @ 포함
    // - 비밀번호 8자 이상
    if (!email.includes('@')) return setError('유효한 이메일을 입력하세요.');
    if (password.length < 8)
      return setError('비밀번호는 8자 이상이어야 합니다.');

    // 서버로 회원가입 요청 전송
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, phone }),
      });

      // 서버 응답 처리
      const data = await res.json();
      if (!res.ok) {
        setError(data?.message || '회원가입에 실패했습니다.');
        return;
      }

      // 회원가입 성공 시 로그인 페이지로 자동 이동
      router.push('/login');
    } catch (err) {
      setError('서버와 통신 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex m-32 items-center justify-center">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-bold text-slate-700">
          회원가입
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              이름
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="홍길동"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              전화번호
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="01012345678"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              이메일
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="이메일을 입력해주세요."
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              비밀번호
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="8자 이상의 비밀번호를 입력해주세요."
              required
            />
          </div>

          <button
            type="submit"
            className={`w-full rounded-md px-4 py-2 text-white shadow ${
              loading
                ? 'bg-blue-300 cursor-wait'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
            disabled={loading}
          >
            {loading ? '가입 중...' : '회원가입'}
          </button>
        </form>
        {error && (
          <p className="mt-4 text-center text-sm text-red-600">{error}</p>
        )}
        <div className="mt-4 text-center text-sm text-gray-600">
          이미 계정이 있으신가요?{' '}
          <button
            type="button"
            onClick={() => router.push('/login')}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            로그인
          </button>
        </div>
      </div>
    </div>
  );
}
