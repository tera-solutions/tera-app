const getApiUrl = (): string => {
  if (
    typeof window !== "undefined" &&
    typeof import.meta !== "undefined" &&
    (import.meta as any).env
  ) {
    return (import.meta as any).env.VITE_TERA_API || "";
  }
  return process.env.EXPO_PUBLIC_API_URL || process.env.VITE_TERA_API || "";
};

const getAIApiUrl = (): string => {
  if (
    typeof window !== "undefined" &&
    typeof import.meta !== "undefined" &&
    (import.meta as any).env
  ) {
    return (import.meta as any).env.VITE_TERA_AI_API || "";
  }
  return process.env.EXPO_PUBLIC_AI_API_URL || process.env.VITE_TERA_AI_API || "";
};


const BASE_API = getApiUrl();
const BASE_AI_API = getAIApiUrl();

export const endpoint = `${BASE_API}/v1`;

export const aiEndpoint = `${BASE_AI_API}/v1`;

/** AI-generate storage host (image/audio/video assets are served flat, not under `/v1`). */
export const aiStorageOrigin = BASE_AI_API;

export const portalEndpoint = `${BASE_API}/api/portal`;

export const authEndpoint = `${BASE_API}/api/auth`;

export const auth2Endpoint = `${BASE_API}/api/auth`;

export const adminEndpoint = `${BASE_API}/api/admin`;

export const fileEndpoint = `${BASE_API}/api/file`;
