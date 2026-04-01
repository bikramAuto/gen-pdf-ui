import { dpopManager, createDpopProof } from '../utils/dpop';

const API_URL = import.meta.env.VITE_API_URL || '';
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

export interface RequestOptions extends RequestInit {
  skipGlobalError?: boolean;
}

export const apiClient = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  let tokenUsed = '';

  const executeRequest = async (): Promise<Response> => {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    const cleanApiUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
    const url = cleanApiUrl.startsWith('http') ? `${cleanApiUrl}${cleanPath}` : `${cleanApiUrl}${cleanPath}`;

    const requestHeaders = new Headers();
    requestHeaders.set('Content-Type', 'application/json');

    // 1. Get Authentication Token (raw JWT, no prefix)
    const token = localStorage.getItem('token');
    tokenUsed = token || '';
    if (token) {
      requestHeaders.set('Authorization', token);
    }

    // 2. Add DPoP Proof (x-auth-token only)
    const keyPair = dpopManager.getKeyPair();
    let generatedHtu = '';

    if (keyPair) {
      try {
        const fullUrl = `${BASE_URL}${cleanPath}`;
        generatedHtu = fullUrl;

        const proof = await createDpopProof(keyPair.privateKey, generatedHtu, options.method || 'GET', token || '');
        requestHeaders.set('x-auth-token', proof);
      } catch (err) {
        console.error('[DPoP] Proof generation failed:', err);
      }
    }

    // 4. Apply Custom Headers from Options (can override defaults if provided)
    if (options.headers) {
      Object.entries(options.headers as Record<string, string>).forEach(([key, value]) => {
        requestHeaders.set(key, value);
      });
    }

    // 🔬 DEBUG: Log precisely what's being sent
    console.group(`[API Client] -> Sending Request: ${options.method || 'GET'} ${url}`);
    const loggedHeaders: Record<string, string> = {};
    requestHeaders.forEach((value, key) => { loggedHeaders[key] = value; });
    console.log('Headers:', loggedHeaders);
    if (generatedHtu) console.log('DPoP HTU Claim:', generatedHtu);
    console.log('Authorization:', token ? 'SET (JWT)' : 'NOT SET (no token yet)');
    console.log('x-auth-token:', loggedHeaders['x-auth-token'] ? 'SET (DPoP proof)' : 'NOT SET (no key pair)');
    console.groupEnd();

    return await fetch(url, {
      ...options,
      headers: requestHeaders,
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
    const currentStoredToken = localStorage.getItem('token') || '';

    if (tokenUsed && tokenUsed !== currentStoredToken) {
      response = await executeRequest();
    } else {
      const userId = localStorage.getItem('userId');
      const refreshToken = localStorage.getItem('refreshToken');

      if (userId && refreshToken && !path.includes('/login') && !path.includes('/users/create') && !path.includes('/refresh-token')) {
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
          response = await executeRequest();
        } catch (e) {
          // Failure handled by returning original error response
        }
      } else if (!path.includes('/login') && !path.includes('/users/create') && !path.includes('/refresh-token')) {
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
