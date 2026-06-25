export const ACCESS_TOKEN_KEY = "access_token";
export const REFRESH_TOKEN_KEY = "refresh_token";

interface SaveTokensArgs {
  accessToken?: string | null;
  refreshToken?: string | null;
  remember: boolean;
}

const removeFrom = (storage: Storage) => {
  storage.removeItem(ACCESS_TOKEN_KEY);
  storage.removeItem(REFRESH_TOKEN_KEY);
};

export const tokenStorage = {
  saveTokens({ accessToken, refreshToken, remember }: SaveTokensArgs): void {
    const target = remember ? window.localStorage : window.sessionStorage;

    removeFrom(remember ? window.sessionStorage : window.localStorage);

    if (accessToken) target.setItem(ACCESS_TOKEN_KEY, accessToken);
    if (refreshToken) target.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },

  getAccessToken(): string | null {
    return (
      window.localStorage.getItem(ACCESS_TOKEN_KEY) ??
      window.sessionStorage.getItem(ACCESS_TOKEN_KEY)
    );
  },

  clearTokens(): void {
    removeFrom(window.localStorage);
    removeFrom(window.sessionStorage);
  },
};
