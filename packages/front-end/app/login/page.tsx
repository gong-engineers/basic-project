"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// email, password: 폼 필드 값
// loading: 전송 중 버튼 비활성화/스피너 대체 텍스트에 사용
// error: 에러 메시지 표시
// showPassword: 비밀번호 표시/숨기기 토글
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // 이메일 유효성 검사 함수
  const validateEmail = () => {
    if (!email) {
      setEmailError("이메일을 입력하세요.");
      return false;
    }
    if (!email.includes("@") || email.length < 4) {
      setEmailError("올바른 이메일 형식이 아닙니다.");
      return false;
    }
    return true;
  };

  // 로그인 버튼을 눌렀을 때 실행될 함수
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // 각 필드의 유효성을 개별적으로 검사합니다.
    const isEmailValid = validateEmail();
    const isPasswordValid = password.length >= 8;

    if (!isPasswordValid) {
      setPasswordError("비밀번호는 8자 이상이어야 합니다.");
    }

    // 유효성 검사를 하나라도 통과하지 못하면 API 요청을 중단합니다.
    if (!isEmailValid || !isPasswordValid) {
      return; 
    }

    // email, password를 백엔드로 전송
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      // 서버 응답 받기
      const data = await res.json();
      if (!res.ok) {
        // Invalid credentials 메시지를 한글로 변환
        if (data?.message === "Invalid credentials") {
          // 양식은 통과했지만 인증 실패한 경우, 버튼 아래에 공통 메시지 표시
          setSubmitError("이메일 또는 비밀번호가 올바르지 않습니다.");
        } else {
          setEmailError(data?.message || "로그인에 실패했습니다.");
        }
        return;
      }

      // JWT 토큰 저장 (Access Token & Refresh Token)
      if (data?.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
        // Refresh Token도 저장 (있는 경우)
        if (data.refreshToken) {
          localStorage.setItem("refreshToken", data.refreshToken);
        }
        // 사용자 정보 저장
        if (data.user?.name) {
          localStorage.setItem("userName", data.user.name);
        }
      }

      // 리다이렉트
      router.push("/");
    } catch (err) {
      setEmailError("서버와 통신 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">  
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-3xl font-bold text-slate-700">Login</h1>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError(null);
                setSubmitError(null);
              }}
              onBlur={validateEmail}
              className={`w-full rounded-md border ${
                emailError ? 'border-red-500' : 'border-gray-200'
              } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300`}
              placeholder="abc@example.com"
              required
            />
            {emailError && <p className="mt-1 text-sm text-red-600">{emailError}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">비밀번호</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError(null);
                  setSubmitError(null);
                }}
                onBlur={() => {
                  if (password && password.length < 8) {
                    setPasswordError("비밀번호는 8자 이상이어야 합니다.");
                  }
                }}
                aria-invalid={passwordError ? true : undefined}
                className={`w-full rounded-md border ${
                  passwordError ? 'border-red-500' : 'border-gray-200'
                } px-3 py-2 pr-20 focus:outline-none focus:ring-2 focus:ring-blue-300`}
                placeholder="최소 8자 이상 입력하세요."
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-3 py-1 text-sm text-gray-600 hover:bg-gray-100"
                aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
              >
                {showPassword ? "숨기기" : "보기"}
              </button>
            </div>
            {passwordError && <p className="mt-1 text-sm text-red-600">{passwordError}</p>}
          </div>

          <button
            type="submit"
            className={`w-full rounded-md px-4 py-2 text-white shadow ${
              loading ? "bg-blue-300 cursor-wait" : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={loading}
          >
            {loading ? "로딩 중..." : "로그인"}
          </button>
          {submitError && <p className="mt-4 text-center text-sm text-red-600">{submitError}</p>}
        </form>

        
        <p className="mt-6 text-center text-sm text-gray-600">
          계정이 없으신가요? <a href="/register" className="text-blue-600 hover:underline">회원가입</a>
        </p>
      </div>
    </div>
  );
}
