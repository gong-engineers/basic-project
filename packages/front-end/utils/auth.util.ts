import { NormalizedError } from './error.util';

export function isAuthError(error: NormalizedError) {
  return (
    error.message.includes('Refresh Token expired') ||
    error.message.includes('Unauthorized')
  );
}
