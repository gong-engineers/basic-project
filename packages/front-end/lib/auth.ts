// API 요청시 인증 토큰을 자동으로 처리하는 유틸리티
export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  // Access Token 가져오기
  const accessToken = sessionStorage.getItem('accessToken');

  // 기본 헤더에 Authorization 추가
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${accessToken}`,
  };

  try {
    const response = await fetch(url, { ...options, headers });

    // 401 에러(인증 실패)가 발생하면 토큰 갱신 시도
    if (response.status === 401) {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('인증이 필요합니다.');
      }

      // Refresh Token으로 새 Access Token 요청
      const refreshResponse = await fetch(
        'http://localhost:3001/auth/refresh',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${refreshToken}`,
          },
        },
      );

      if (!refreshResponse.ok) {
        // Refresh Token도 만료된 경우 로그아웃 처리
        sessionStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userName');
        window.location.href = '/login';
        throw new Error('세션이 만료되었습니다. 다시 로그인해주세요.');
      }

      const { accessToken: newAccessToken } = await refreshResponse.json();
      sessionStorage.setItem('accessToken', newAccessToken);

      // 새 토큰으로 원래 요청 재시도
      headers['Authorization'] = `Bearer ${newAccessToken}`;
      return fetch(url, { ...options, headers });
    }

    return response;
  } catch (error) {
    console.error('API 요청 실패:', error);
    throw error;
  }
}

// 로그아웃 함수
export async function logout() {
  try {
    const response = await fetchWithAuth('http://localhost:3001/auth/logout', {
      method: 'POST',
    });

    if (response.ok) {
      // 모든 인증 관련 데이터 삭제
      sessionStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userName');
      window.location.href = '/login';
    }
  } catch (error) {
    console.error('로그아웃 실패:', error);
  }
}
