import { NextResponse } from 'next/server';

export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export class APIError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.data = data;
  }
}

// api 실제 요청 Request 함수
async function request<T>(
  url: string,
  options: RequestInit = {},
  retry = false,
): Promise<T> {
  // GET, HEAD일 경우 body 제거
  const { method = 'GET', ...rest } = options;
  const safeOptions: RequestInit =
    method === 'GET' || method === 'HEAD'
      ? { ...rest, method } // body 제거
      : options;

  // AccessToken 자동 삽입
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  // api 실제 요청 후 반환 데이터 저장
  const response = await fetch(url, {
    ...safeOptions, // 요청 옵션 적용
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: token } : {}),
      ...options.headers,
    },
    credentials: 'include', // Cookie 포함 요청(RefreshToken 포함 요청)
  });

  // api 요청에 실패했다면 에러 처리
  if (!response.ok) {
    // 에러 데이터 가져오기
    const errorData = await response.json().catch(() => ({}));

    // 401 Unauthorized 에러가 발생하고 리프레싱 처리되지 않았다면 토큰 재발급하기 위해 진입
    if (response.status === 401 && !retry) {
      // 토큰을 재발급 받지 않았다면 진입
      if (!isRefreshing) {
        isRefreshing = true;
        return reTakeToken(url, options, true) as Promise<T>; // 토큰 재발급
      } else {
        // 토큰 재발급 처리 중이면 이전에 Unauthirized 에러로 인해 수행되지 않았던 작업들을 task 관리 Queue에 저장
        return new Promise<T>((resolve, reject) => {
          retryQueue.push({
            resolve: resolve as (value: unknown) => void,
            reject: reject as (reason?: unknown) => void,
            url,
            options,
          });
        });
      }
    }

    // 에러 데이터를 APIError 핸들러로 던지기
    throw new APIError(errorData.message, response.status, errorData);
  }

  return response.json().catch(() => ({})) as Promise<T>;
}

export const client = {
  get: <T, U>(url: string, body?: T, options: RequestInit = {}) =>
    request<U>(url, {
      method: 'GET',
      cache: 'no-store',
      ...options,
    }),
  post: <T, U>(url: string, body: T, options: RequestInit = {}) =>
    request<U>(url, { method: 'POST', ...options, body: JSON.stringify(body) }),
  put: <T, U>(url: string, body: T, options: RequestInit = {}) =>
    request<U>(url, { method: 'PUT', ...options, body: JSON.stringify(body) }),
  patch: <T, U>(url: string, body: T, options: RequestInit = {}) =>
    request<U>(url, {
      method: 'PATCH',
      ...options,
      body: JSON.stringify(body),
    }),
  delete: <T, U>(url: string, body?: T, options: RequestInit = {}) =>
    request<U>(url, {
      method: 'DELETE',
      ...options,
      body: JSON.stringify(body),
    }),
};

export async function handleAPI(
  apiCall: () => Promise<NextResponse>,
): Promise<NextResponse> {
  try {
    return await apiCall();
  } catch (error) {
    if (error instanceof APIError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    }
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

// 리프레싱 처리되었는지 확인하기 위한 변수
let isRefreshing = false;

// 대기중인 요청들 저장하기 위한 배열
let retryQueue: {
  resolve: (value: unknown) => void; // 요청 성공 시 데이터 반환
  reject: (reason?: unknown) => void; // 요청 실패 시 에러 처리
  url: string; // 요청 URL
  options: RequestInit; // 요청 옵션
}[] = [];

// 토큰 재발급 함수
async function reTakeToken(url: string, options: RequestInit, retry: boolean) {
  try {
    // RefreshToken 재발급 요청
    const refreshResponse = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
      mode: 'cors',
    });

    // RefreshToken 재발급 요청에 실패했다면 에러 처리
    if (!refreshResponse.ok) {
      throw new Error('Refresh Token expired');
    }

    // RefreshToken 재발급 요청 후 반환 데이터 저장
    const refreshData = await refreshResponse.json();

    // 새로운 AccessToken 저장
    const newToken = 'Bearer ' + refreshData.data.accessToken;
    localStorage.setItem('accessToken', newToken);

    // 대기중인 요청들 재시도
    retryQueue.forEach((job) => {
      job.resolve(request(job.url, job.options, true));
    });

    // 대기 요청들 전부 처리 후 Queue 초기화
    retryQueue = [];
    return request(url, options, true);
  } catch (err) {
    retryQueue.forEach((job) => job.reject(err));
    retryQueue = [];

    // 로그인 페이지로 리다이렉트
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    throw err;
  } finally {
    isRefreshing = false;
  }
}
