import { createContext } from 'react';
import { IGlobalStore } from './_interface';
import { GlobalStore } from './globalStore';

export class RootStore {
  globalStore: IGlobalStore;

  constructor() {
    this.globalStore = new GlobalStore();
  }
}
export const rootStore = new RootStore();
export const rootStoreContext = createContext(rootStore);
