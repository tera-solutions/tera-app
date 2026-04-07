export interface IAuthStore {
  device: string;
  authenticated: boolean;
  user: any;
  token: string;
  general: any;
  logo: string;
  auth_url: string;
  access_id: string;
  role: string;
  permissions: string[];
  modules: any[];
  epics: string[];
  user_info?: any;
  clear: () => void;
  setInitData: (data: any) => void;
  updateToken: (token: string) => void;
  updateUser: (user: any) => void;
  updatePermissions: (permissions: string[]) => void;
  updateModules: (modules: string[]) => void;
  updateAccessId: (access_id: string) => void;
  updateEpic: (epics: string[]) => void;
  updateBusiness: (business: any) => void;
}