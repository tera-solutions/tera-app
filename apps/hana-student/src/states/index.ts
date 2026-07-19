import { createContext } from 'react';

import { IAuthStore, IGeneralStore } from './_interface';
import { AuthStore } from './authStore';
import { GeneralStore } from './generalStore';

export class RootStore {
  generalStore: IGeneralStore;
  authStore: IAuthStore;

  constructor() {
    this.generalStore = new GeneralStore();
    this.authStore = new AuthStore();
  }

  clearAllStores() {
    this.authStore.clear();
    this.generalStore.clear();
  }
}

export const rootStore = new RootStore();
export const rootStoreContext = createContext(rootStore);
