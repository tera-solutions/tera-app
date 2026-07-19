export interface IAuthStore {
  authenticated: boolean;
  isHydrated: boolean;
  user: any;
  token: string;
  role: string;
  clear: () => void;
  updateToken: (token: string) => void;
  updateUser: (user: any) => void;
}

export interface IGeneralStore {
  device: string;
  general: any;
  logo?: string;
  version: number;
  clear: () => void;
  setGeneral: (data: any) => void;
  setDevice: (device_code: string) => void;
  setInitData: (data: any) => void;
  setVersion: (ver: number) => void;
}

export interface IRootStore {
  authStore: IAuthStore;
  generalStore: IGeneralStore;
}
