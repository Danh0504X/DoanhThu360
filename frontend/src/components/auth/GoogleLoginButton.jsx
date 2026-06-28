import { useEffect, useRef } from 'react';

const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  '328581863407-bg0nctpm7slrtog8rdlura9osb310du5.apps.googleusercontent.com';

const SCRIPT_SRC = 'https://accounts.google.com/gsi/client';

// Load the Google Identity Services script once and resolve when it's ready.
const loadGsiScript = () =>
  new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) {
      resolve();
      return;
    }

    const existing = document.querySelector(`script[src="${SCRIPT_SRC}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Failed to load Google script')));
      return;
    }

    const script = document.createElement('script');
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google script'));
    document.head.appendChild(script);
  });

/**
 * Renders the official Google Sign-In button. On success it hands the returned
 * ID token (a JWT) to `onCredential`, which the backend verifies at /auth/google.
 */
export const GoogleLoginButton = ({ onCredential, onError }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    loadGsiScript()
      .then(() => {
        if (cancelled || !window.google?.accounts?.id || !containerRef.current) return;

        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (response) => {
            if (response?.credential) {
              onCredential(response.credential);
            }
          },
        });

        const width = Math.min(containerRef.current.offsetWidth || 360, 400);
        window.google.accounts.id.renderButton(containerRef.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text: 'continue_with',
          shape: 'rectangular',
          logo_alignment: 'center',
          width,
        });
      })
      .catch(() => {
        if (!cancelled) {
          onError?.('Không thể tải Google Sign-In. Vui lòng thử lại.');
        }
      });

    return () => {
      cancelled = true;
    };
  }, [onCredential, onError]);

  return <div ref={containerRef} className="flex w-full justify-center" />;
};
