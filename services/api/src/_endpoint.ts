const getApiUrl = (): string => {
  if (typeof window !== 'undefined' && typeof import.meta !== 'undefined' && (import.meta as any).env) {
    return (import.meta as any).env.VITE_TERA_API || '';
  }
  
  return process.env.EXPO_PUBLIC_API_URL || process.env.VITE_TERA_API || '';
};

const BASE_API = getApiUrl();

export const endpoint = `${BASE_API}/v1`;

export const portalEndpoint = `${BASE_API}/api/portal`;

export const authEndpoint = `${BASE_API}/api/auth`;

export const auth2Endpoint = `${BASE_API}/api/auth`;

export const adminEndpoint = `${BASE_API}/api/admin`;
