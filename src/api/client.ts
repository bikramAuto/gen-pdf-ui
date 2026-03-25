const API_URL = import.meta.env.VITE_API_URL || '';

let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

export interface RequestOptions extends RequestInit {
  skipGlobalError?: boolean;
}

export const apiClient = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  let tokenUsed = '';

  const executeRequest = async () => {
    const url = `${API_URL}${path}`;
    const token = localStorage.getItem('token');
    tokenUsed = token || '';
    
    return await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: token } : {}),
        ...options.headers,
      },
    });
  };

  let response: Response;
  try {
    response = await executeRequest();
  } catch (err) {
    const message = 'Network connection failed. Please check your internet.';
    if (!options.skipGlobalError) {
      window.dispatchEvent(new CustomEvent('api-error', { detail: { message } }));
    }
    throw err;
  }

  if (!response.ok && (response.status === 401 || response.status === 403)) {
    // ... (rest of the retry logic remains the same)
    const currentStoredToken = localStorage.getItem('token') || '';
    
    if (tokenUsed && tokenUsed !== currentStoredToken) {
      // Another request already refreshed the token while this one was in flight. Retry immediately.
      response = await executeRequest();
    } else {
      const userId = localStorage.getItem('userId');
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (userId && refreshToken && !path.includes('/login') && !path.includes('/create') && !path.includes('/refresh-token')) {
        if (!isRefreshing) {
          isRefreshing = true;
          refreshPromise = (async () => {
            try {
              const refreshRes = await fetch(`${API_URL}/users/refresh-token/${userId}?token=${encodeURIComponent(refreshToken)}`);
              if (!refreshRes.ok) throw new Error(`Refresh failed with status ${refreshRes.status}`);
              const data = await refreshRes.json();
              
              const newAccessToken = data?.token?.accessToken || data?.token?.token || data?.token || data?.accessToken || data?.data?.token?.accessToken || data?.data?.token || data?.data?.accessToken;
              const newRefreshToken = data?.token?.refreshToken || data?.token?.rToken || data?.rToken || data?.refreshToken || data?.data?.token?.refreshToken || data?.data?.rToken || data?.data?.refreshToken;
              
              if (newAccessToken) localStorage.setItem('token', newAccessToken);
              if (newRefreshToken) localStorage.setItem('refreshToken', newRefreshToken);

              if (!newAccessToken) {
                 throw new Error('Token payload missing from refresh response');
              }
            } catch (e) {
              console.error('[JWT Interceptor] Refresh process aborted:', e);
              localStorage.removeItem('token');
              localStorage.removeItem('refreshToken');
              localStorage.removeItem('userId');
              window.dispatchEvent(new Event('auth-expired'));
              throw e;
            } finally {
              isRefreshing = false;
              refreshPromise = null;
            }
          })();
        }
        
        try {
          if (refreshPromise) await refreshPromise;
          // Retry original request with new tokens
          response = await executeRequest();
        } catch (e) {
          // exception forwarded if needed, auth-expired handled
        }
      } else if (!path.includes('/login') && !path.includes('/create') && !path.includes('/refresh-token')) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userId');
        window.dispatchEvent(new Event('auth-expired'));
      }
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.message || `Request failed with status ${response.status}`;
    
    if (!options.skipGlobalError) {
      window.dispatchEvent(new CustomEvent('api-error', { detail: { message } }));
    }
    
    throw new Error(message);
  }

  return response.json();
};
