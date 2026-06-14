import { createContext } from 'react';
import { IAuthStore, IGeneralStore, IPrintStore, IUIStore } from './_interface';
import { AuthStore } from './authStore';
import { GeneralStore } from './generalStore';
import { PrintStore } from './printStore';
import { UIStore } from './uiStore';

export class RootStore {
  generalStore: IGeneralStore;
  authStore: IAuthStore;
  uiStore: IUIStore;
  printStore: IPrintStore;

  constructor() {
    this.generalStore = new GeneralStore();
    this.authStore = new AuthStore();
    this.uiStore = new UIStore();
    this.printStore = new PrintStore();
  }

  clearAllStores() {
    this.authStore.clear();
    this.uiStore.clear();
    this.printStore.clear();
  }
}
export const rootStore = new RootStore();
export const rootStoreContext = createContext(rootStore);
