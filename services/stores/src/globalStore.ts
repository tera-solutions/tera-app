import { makeAutoObservable, toJS } from "mobx";
import { makePersistable } from "mobx-persist-store";

export class GlobalStore {
  token = "";

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

  constructor() {
    makeAutoObservable(this);
    makePersistable(this, {
      name: "GlobalStore",
      properties: [
        "token",
        "access_id",
        "user",
        "permissions",
        "epics",
        "modules",
        "role",
        "device",
      ],
      storage: window.localStorage,
    });
  }

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
    this.access_id = user?.access_id || this.access_id;
    this.pushEvent();
  };

  updateBusiness = (business: any) => {
    this.user = { ...(this.user ?? {}), business };
    this.business_id = business?.id || this.business_id;
  };
}
