import { makeAutoObservable, toJS } from "mobx";
import { makePersistable } from "mobx-persist-store";

const isWeb =
  typeof window !== "undefined" && window.navigator?.product !== "ReactNative";
const REMEMBER_ME_KEY = "tera_remember_me";

const resolveAuthStorage = (): Storage | null => {
  if (!isWeb) return null;
  return window.localStorage.getItem(REMEMBER_ME_KEY) === "0"
    ? window.sessionStorage
    : window.localStorage;
};

export class GlobalStore {
  token = "";

  refresh_token = "";

  access_id = "";

  business_id = "";

  user = {} as any;

  device = "";

  role = "user";

  permissions: string[] = [];

  modules: string[] = [];

  epics: string[] = [];

  general = {};

  user_info = {};

  logo = "";

  auth_url = "";

  // Dữ liệu enum dùng chung từ API metadata, dạng { group: { list_name: IMetaOption[] } }
  metadata: Record<string, Record<string, IMetaOption[]>> = {};

  // Cờ báo store đã nạp xong từ localStorage (token/business_id/device...).
  // Render app/query phải đợi cờ này = true để tránh bắn request thiếu header (404/401).
  isHydrated = false;

  constructor() {
    makeAutoObservable(this);
    makePersistable(this, {
      name: "GlobalStore",
      properties: [
        "token",
        "refresh_token",
        "access_id",
        "business_id",
        "user",
        "permissions",
        "epics",
        "modules",
        "role",
        "device",
        "metadata",
      ],
      storage: resolveAuthStorage(),
    }).then((persistable) => {
      this.setHydrated(persistable.isHydrated);
    });
  }

  setHydrated = (value: boolean) => {
    this.isHydrated = value;
  };

  /**
   * Records the "remember me" choice for the *next* app boot to read. Takes
   * effect on the following full load/restart, not the current tab session,
   * since this store's storage binding is fixed at construction.
   */
  setRememberMe = (remember: boolean) => {
    window.localStorage.setItem(REMEMBER_ME_KEY, remember ? "1" : "0");
  };

  pushEvent() {
    const event = new CustomEvent("GlobalStore", {
      detail: toJS(this),
    });
    window.dispatchEvent(event);
  }

  get authenticated() {
    // TODO: This logic can be changed on demand
    return !!this.token;
  }

  clear = () => {
    this.token = "";
    this.refresh_token = "";
    this.user = null;
  };

  setInitData = (data: any) => {
    this.device = data?.device_code;
    const general = data?.general || [];
    this.user_info = data?.user_info || this.user_info;
    this.logo = data?.logo_url;
    this.auth_url = data?.auth_url;

    const newsValue: any = {};

    general.forEach((item: any) => {
      newsValue[item.name] = item.value;
      if (item.value === "0") {
        newsValue[item.name] = false;
      }
    });

    this.general = newsValue;
  };

  updateToken = (token: string) => {
    this.token = token || this.token;
  };

  updateRefreshToken = (refreshToken: string) => {
    this.refresh_token = refreshToken || this.refresh_token;
  };

  updateAccessId = (access_id: string) => {
    this.access_id = access_id || this.access_id;
  };

  updateModules = (modules: string[]) => {
    this.modules = modules || [];
  };

  updatePermissions = (permissions: string[]) => {
    this.permissions = permissions || [];
  };

  updateEpic = (epics: string[]) => {
    this.epics = epics || [];
  };

  updateUser = (user: any) => {
    this.user = user?.user;
    this.role = "tera_admin"; //user?.user?.role || this.role;
    this.token = user?.token || this.token;
    this.refresh_token = user?.refresh_token || this.refresh_token;
    this.access_id = user?.access_id || this.access_id;
    this.pushEvent();
  };

  updateBusiness = (business: any) => {
    this.user = { ...(this.user ?? {}), business };
    this.business_id = business?.id || this.business_id;
  };

  setMetadata = (data: any) => {
    this.metadata = data || {};
  };

  // Gộp tất cả list của mọi group lại theo tên (các tên list là unique trên toàn metadata)
  // -> getOptions("teacher_status") không cần biết nó thuộc group "hr".
  get metaOptionsMap(): Record<string, IMetaOption[]> {
    const map: Record<string, IMetaOption[]> = {};
    Object.values(this.metadata || {}).forEach((group) => {
      Object.entries(group || {}).forEach(([name, list]) => {
        map[name] = list as IMetaOption[];
      });
    });
    return map;
  }

  getOptions = (name: string): IMetaOption[] => this.metaOptionsMap[name] ?? [];

  getMetaItem = (
    name: string,
    value?: string | null,
  ): IMetaOption | undefined =>
    value == null
      ? undefined
      : this.getOptions(name).find((o) => o.value === value);

  getMetaLabel = (name: string, value?: string | null): string =>
    this.getMetaItem(name, value)?.label ?? value ?? "";
}

export interface IMetaOption {
  key: string;
  value: string;
  label: string;
  color?: string;
  backgroundColor?: string;
}
