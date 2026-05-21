import { createContext } from "react";
import { IAuthStore } from "./_interface";
import { AuthStore } from "./authStore";
import { CommonStore } from "./commonStore";
import { ConfirmStore } from "./confirmStore";

export class RootStore {
  authStore: IAuthStore;
  commonStore: CommonStore;
  confirmStore: ConfirmStore;

  constructor() {
    this.authStore = new AuthStore();
    this.commonStore = new CommonStore();
    this.confirmStore = new ConfirmStore();
  }
}
export const rootStore = new RootStore();
export const rootStoreContext = createContext(rootStore);
