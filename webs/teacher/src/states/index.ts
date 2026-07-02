import { createContext } from "react";
import { IAuthStore } from "./_interface";
import { AuthStore } from "./authStore";
import { CommonStore } from "./commonStore";

export class RootStore {
  authStore: IAuthStore;
  commonStore: CommonStore;

  constructor() {
    this.authStore = new AuthStore();
    this.commonStore = new CommonStore();
  }
}
export const rootStore = new RootStore();
export const rootStoreContext = createContext(rootStore);
