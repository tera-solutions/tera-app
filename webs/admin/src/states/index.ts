import { createContext } from 'react';
import { CommonStore } from './commonStore';

export class RootStore {
  commonStore: CommonStore;

  constructor() {
    this.commonStore = new CommonStore();
  }
}
export const rootStore = new RootStore();
export const rootStoreContext = createContext(rootStore);
