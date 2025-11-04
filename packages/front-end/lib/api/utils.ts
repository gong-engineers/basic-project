import { NextResponse } from 'next/server';

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

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
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
      body: JSON.stringify(body),
    }),
  post: <T, U>(url: string, body: T, options: RequestInit = {}) =>
    request<U>(url, { method: 'POST', ...options, body: JSON.stringify(body) }),
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
