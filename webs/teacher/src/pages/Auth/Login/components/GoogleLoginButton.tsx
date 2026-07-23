import { useEffect, useRef } from "react";
import classNames from "classnames";

import { loadScript } from "_common/utils/loadScript";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: { type: string; theme: string; size: string; width?: number },
          ) => void;
        };
      };
    };
  }
}

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
    <path
      fill="#FFC107"
      d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35 24 35c-6.1 0-11-4.9-11-11s4.9-11 11-11c2.8 0 5.4 1 7.4 2.8l5.7-5.7C33.6 6.5 29.1 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5 43.5 34.8 43.5 24c0-1.2-.1-2.3-.3-3.5z"
    />
    <path
      fill="#FF3D00"
      d="m6.3 14.7 6.6 4.8C14.7 16 19 13 24 13c2.8 0 5.4 1 7.4 2.8l5.7-5.7C33.6 6.5 29.1 4.5 24 4.5 16.3 4.5 9.7 8.9 6.3 14.7z"
    />
    <path
      fill="#4CAF50"
      d="M24 43.5c5.2 0 9.6-2 13-5.2l-6-5.1C29 35 26.6 35.9 24 35.9c-5.3 0-9.7-3.6-11.3-8.4l-6.6 5.1C9.6 39 16.2 43.5 24 43.5z"
    />
    <path
      fill="#1976D2"
      d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.4l6 5.1c-.4.4 6.3-4.6 6.3-14.5 0-1.2-.1-2.3-.3-3.5z"
    />
  </svg>
);

interface GoogleLoginButtonProps {
  onSuccess: (idToken: string) => void;
  onError: (message: string) => void;
  disabled?: boolean;
}

/** Renders Google's own "Sign in with Google" button — Google's branding
 * guidelines require using their rendered button rather than a re-styled
 * custom one. The callback delivers a verified-signature id_token (JWT). */
const GoogleLoginButton = ({ onSuccess, onError, disabled }: GoogleLoginButtonProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const clientId = (import.meta as any).env.VITE_GOOGLE_OAUTH_CLIENT_ID as string | undefined;

  useEffect(() => {
    if (!clientId || !containerRef.current) return;

    let cancelled = false;

    loadScript("https://accounts.google.com/gsi/client")
      .then(() => {
        if (cancelled || !window.google || !containerRef.current) return;

        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => onSuccess(response.credential),
        });
        window.google.accounts.id.renderButton(containerRef.current, {
          type: "standard",
          theme: "outline",
          size: "large",
          width: Math.round(containerRef.current.getBoundingClientRect().width) || undefined,
        });
      })
      .catch(() => onError("Không thể tải Google Sign-In."));

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId]);

  if (!clientId) {
    return (
      <button
        type="button"
        disabled
        title="Đăng nhập Google chưa được cấu hình"
        className="flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-400"
      >
        <GoogleIcon />
        Google
      </button>
    );
  }

  return (
    <div
      ref={containerRef}
      className={classNames(
        "flex h-11 w-full items-center justify-center overflow-hidden [&>div]:w-full",
        disabled && "pointer-events-none opacity-50",
      )}
      aria-disabled={disabled}
    />
  );
};

export default GoogleLoginButton;
