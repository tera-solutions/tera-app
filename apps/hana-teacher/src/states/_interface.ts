import { IAuthStore } from '@tera/store';

export type IndustryKey =
  | 'general'
  | 'fnb'
  | 'ecommerce'
  | 'online'
  | 'retail'
  | 'spa'
  | 'logistic'
  | 'agent'
  | 'import_export';

export interface IUIStore {
  industry: IndustryKey;
  business_info: any;
  limit_location: number;
  fetchBusinessFromLocal: () => void;
  clear: () => void;
  setIndustry: (key: IndustryKey) => void;
  setStore: (data: any) => void;
}

export type PrintConnectionType = 'TCP' | 'BT' | 'USB';
export type PrintPageSizeType = 'k57' | 'k58' | 'k80';
export type PrintStatusType = 'connecting' | 'connected' | 'disconnected';

export interface PrintDeviceType {
  device_name?: string;
  inner_mac_address?: string | number;
}

export interface IPrintStore {
  connection: PrintConnectionType;
  status: PrintStatusType;
  device: PrintDeviceType;
  page_size: PrintPageSizeType;
  allow_bluetooth: boolean;
  clear: () => void;
  setConnection: (key: PrintConnectionType) => void;
  setPageSize: (page_size: PrintPageSizeType) => void;
  setDevice: (device: PrintDeviceType) => void;
  setPermissionBluetooth: (value: boolean) => void;
}

export interface IRootStore {
  authStore: IAuthStore;
  uiStore: IUIStore;
  printStore: IPrintStore;
}

export interface IGeneralStore {
  isDbReady: boolean;
  isOffline: boolean;
  isSuper: boolean;
  device: string;
  general: any;
  logo?: string;
  version: number;
  clear: () => void;
  fetchSettingsFromLocal: () => void;
  setGeneral: (data: any) => void;
  setIsDbReady: (status: boolean) => void;
  setIsOffline: (status: boolean) => void;
  setDevice: (device_code: string) => void;
  setVersion: (ver: number) => void;
}
