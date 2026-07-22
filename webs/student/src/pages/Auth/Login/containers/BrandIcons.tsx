/** Logo Google/Microsoft vẽ inline để không phải thêm file ảnh */

export const GoogleIcon = ({
  className = "h-5 w-5",
}: {
  className?: string;
}) => (
  <svg viewBox="0 0 48 48" className={className} aria-hidden>
    <path
      fill="#EA4335"
      d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.6 2.6 30.2.5 24 .5 14.6.5 6.5 5.9 2.6 13.7l7.8 6c1.9-5.7 7.2-10.2 13.6-10.2z"
    />
    <path
      fill="#4285F4"
      d="M46.5 24.5c0-1.6-.1-3.2-.4-4.7H24v9h12.7c-.6 3-2.3 5.6-4.9 7.3l7.6 5.9c4.4-4.1 7.1-10.2 7.1-17.5z"
    />
    <path
      fill="#FBBC05"
      d="M10.4 28.3a14.5 14.5 0 0 1 0-8.6l-7.8-6a24 24 0 0 0 0 20.6l7.8-6z"
    />
    <path
      fill="#34A853"
      d="M24 47.5c6.2 0 11.5-2 15.4-5.6l-7.6-5.9c-2.1 1.4-4.8 2.3-7.8 2.3-6.4 0-11.7-4.5-13.6-10.2l-7.8 6C6.5 42.1 14.6 47.5 24 47.5z"
    />
  </svg>
);

export const MicrosoftIcon = ({
  className = "h-5 w-5",
}: {
  className?: string;
}) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden>
    <rect x="1" y="1" width="10" height="10" fill="#F25022" />
    <rect x="13" y="1" width="10" height="10" fill="#7FBA00" />
    <rect x="1" y="13" width="10" height="10" fill="#00A4EF" />
    <rect x="13" y="13" width="10" height="10" fill="#FFB900" />
  </svg>
);
