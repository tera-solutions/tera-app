import { useRef, useState } from "react";
import { PublicClientApplication } from "@azure/msal-browser";

const MicrosoftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 23 23" aria-hidden="true">
    <path fill="#F25022" d="M0 0h11v11H0z" />
    <path fill="#7FBA00" d="M12 0h11v11H12z" />
    <path fill="#00A4EF" d="M0 12h11v11H0z" />
    <path fill="#FFB900" d="M12 12h11v11H12z" />
  </svg>
);

interface MicrosoftLoginButtonProps {
  onSuccess: (idToken: string) => void;
  onError: (message: string) => void;
  disabled?: boolean;
}

const MicrosoftLoginButton = ({ onSuccess, onError, disabled }: MicrosoftLoginButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const msalRef = useRef<PublicClientApplication | null>(null);

  const env = (import.meta as any).env;
  const clientId = env.VITE_MICROSOFT_OAUTH_CLIENT_ID as string | undefined;
  const tenant = (env.VITE_MICROSOFT_OAUTH_TENANT as string | undefined) || "common";

  const handleClick = async () => {
    if (!clientId || isLoading) return;
    setIsLoading(true);
    try {
      if (!msalRef.current) {
        msalRef.current = new PublicClientApplication({
          auth: {
            clientId,
            authority: `https://login.microsoftonline.com/${tenant}`,
            redirectUri: window.location.origin,
          },
        });
        await msalRef.current.initialize();
      }

      const result = await msalRef.current.loginPopup({ scopes: ["openid", "profile", "email"] });
      onSuccess(result.idToken);
    } catch (err: any) {
      if (err?.errorCode !== "user_cancelled") {
        onError(err?.message ?? "Không thể đăng nhập bằng Microsoft.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!clientId || disabled || isLoading}
      title={!clientId ? "Đăng nhập Microsoft chưa được cấu hình" : undefined}
      className="flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-400 disabled:hover:bg-transparent"
    >
      <MicrosoftIcon />
      Microsoft
    </button>
  );
};

export default MicrosoftLoginButton;
