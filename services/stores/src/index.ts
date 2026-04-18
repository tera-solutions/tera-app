import { createContext } from "react";
import { IGlobalStore } from "./_interface";
import { GlobalStore } from "./globalStore";
import { ConfirmStore } from "./confirmStore";

export class RootStore {
  globalStore: IGlobalStore;
  confirmStore: ConfirmStore;

  constructor() {
    this.globalStore = new GlobalStore();
    this.confirmStore = new ConfirmStore();
  }
}
export const rootStore = new RootStore();
export const rootStoreContext = createContext(rootStore);
