import { useState } from 'react';
import { User } from '../api/users';
import { getSocialAuthSuccessHtml } from '../components/ui/SocialAuthSuccessHtml';

interface SocialAuthResponse {
  result: {
    token: {
      accessToken: string;
      refreshToken?: string;
    };
    userId: string;
  };
}

export const useSocialAuth = (onSuccess: (user: User) => void, onAuthModalClose: () => void) => {
  const [isLoading, setIsLoading] = useState(false);

  const login = (provider: 'google' | 'linkedin') => {
    setIsLoading(true);
    
    const w = 500, h = 600;
    const left = window.screenX + (window.innerWidth - w) / 2;
    const top = window.screenY + (window.innerHeight - h) / 2;
    
    const authUrl = `/api/auth/${provider}`;
    const popup = window.open(authUrl, `${provider}-auth`, `width=${w},height=${h},left=${left},top=${top}`);

    const poll = setInterval(async () => {
      try {
        if (!popup || popup.closed) {
          clearInterval(poll);
          setIsLoading(false);
          return;
        }

        const text = popup.document?.body?.innerText;
        if (!text) return;

        // Aggressively hide the JSON body as soon as it's detected
        if (text.includes('"result"') || text.includes('"token"')) {
          try { popup.document.body.style.display = 'none'; } catch (e) {}
        }

        let data: SocialAuthResponse;
        try {
          data = JSON.parse(text);
        } catch (e) {
          return;
        }

        if (data?.result?.token?.accessToken || (data?.result as any)?.id) {
          clearInterval(poll);

          // Beautify the popup before closing using the reusable helper
          try {
            if (popup.document) {
              const providerName = provider.charAt(0).toUpperCase() + provider.slice(1);
              popup.document.title = `Sign-in via ${providerName} Successful`;
              popup.document.body.innerHTML = getSocialAuthSuccessHtml(providerName);
            }
          } catch (e) {
            console.error('Failed to beautify popup:', e);
          }

          setTimeout(() => {
            if (popup && !popup.closed) popup.close();
          }, 1500);

          const { accessToken, refreshToken } = data.result.token || {};
          const userId = data.result.userId || (data.result as any).id;

          if (accessToken) localStorage.setItem('token', accessToken);
          if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
          if (userId) localStorage.setItem('userId', userId);

          let userName = '', userEmail = '';
          try {
            const res = await fetch(`/api/users/${userId}`, {
              headers: { Authorization: accessToken }
            });
            if (res.ok) {
              const u = await res.json();
              userName = u.name || '';
              userEmail = u.email || '';
            }
          } catch (error) {}

          onSuccess({ id: userId, name: userName, email: userEmail });
          onAuthModalClose();
          setIsLoading(false);
        }
      } catch (error) {}
    }, 200);
  };

  return {
    login,
    isLoading
  };
};
