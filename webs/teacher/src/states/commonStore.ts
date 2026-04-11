import { makeAutoObservable, toJS } from "mobx";
import { makePersistable } from "mobx-persist-store";
import { BusinessType } from "./_interface";

export class CommonStore {
  activeMenu = "";

  openMenuMore = false;

  business: BusinessType = {
    id: null,
    name: "",
    ownerName: "",
  };
  module = "crm";
  location_id = null;
  stock_id = null;
  openModalLocationId = false;

  constructor() {
    makeAutoObservable(this);
    makePersistable(this, {
      name: "CommonStore",
      properties: ["business", "location_id", "stock_id"],
      storage: window.localStorage,
    });
  }
  pushEvent() {
    const event = new CustomEvent("CommonStore", {
      detail: toJS(this),
    });
    window.dispatchEvent(event);
  }

  setActiveMenu = (key: string) => {
    this.activeMenu = key;
  };

  setOpenMenuMore = (open: boolean) => {
    this.openMenuMore = open;
  };

  setBusiness = (params: BusinessType) => {
    this.business = params;
  };
  setLocationId = (id: number) => {
    this.location_id = id;
  };
  setStockId = (id: number) => {
    this.stock_id = id;
  };

  setOpenModalLocationId = (open: boolean) => {
    this.openModalLocationId = open;
    this.pushEvent();
  };

  clear = () => {
    this.business = {
      id: null,
      name: "",
      ownerName: "",
    };
    this.location_id = null;
    this.stock_id = 6;
  };
}
