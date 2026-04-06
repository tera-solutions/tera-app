export interface IAuthStore {
  authenticated: boolean;
  user: any;
  token: string;
  role: string;
  clear: () => void;
  updateToken: (token: string) => void;
  updateUser: (user: any) => void;
}