import { ModalProps } from "tera-dls";
import * as CSS from "csstype";
import { IMetaOption } from "./globalStore";

export interface IGlobalStore {
  metadata: Record<string, Record<string, IMetaOption[]>>;
  isHydrated: boolean;
  setHydrated: (value: boolean) => void;
  setMetadata: (data: any) => void;
  getOptions: (name: string) => IMetaOption[];
  getMetaItem: (name: string, value?: string | null) => IMetaOption | undefined;
  getMetaLabel: (name: string, value?: string | null) => string;
  device: string;
  authenticated: boolean;
  user: any;
  token: string;
  refresh_token: string;
  business_id: string;
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
  updateRefreshToken: (refreshToken: string) => void;
  updateUser: (user: any) => void;
  updatePermissions: (permissions: string[]) => void;
  updateModules: (modules: string[]) => void;
  updateAccessId: (access_id: string) => void;
  updateEpic: (epics: string[]) => void;
  updateBusiness: (business: any) => void;
  setRememberMe: (remember: boolean) => void;
}

export interface IConfirmStore extends ModalProps {
  type?: "success" | "warning" | "error";
  align?: CSS.Property.TextAlign;
  [props: string]: any;
}
