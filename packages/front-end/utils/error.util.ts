export interface NormalizedError {
  status: number | null;
  message: string;
}

function isApiError(
  obj: unknown,
): obj is { status?: number; message?: string } {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    ('status' in obj || 'message' in obj)
  );
}

export function normalizeError(err: unknown): NormalizedError {
  // Error instance
  if (err instanceof Error) {
    return { status: null, message: err.message };
  }

  // 서버에서 던지는 JSON 형태
  if (isApiError(err)) {
    const status = typeof err.status === 'number' ? err.status : null;
    const message =
      typeof err.message === 'string' ? err.message : 'Unknown error';
    return { status, message };
  }

  // fallback
  return { status: null, message: String(err ?? 'Unknown error') };
}
