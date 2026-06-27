import AsyncStorage from '@react-native-async-storage/async-storage';
import { makeAutoObservable, runInAction } from 'mobx';
import { makePersistable, stopPersisting } from 'mobx-persist-store';
import { IndustryKey } from './_interface';

export class UIStore {
  industry: IndustryKey = 'general';

  business_info = {};

  limit_location = 1;

  constructor() {
    makeAutoObservable(this);
    makePersistable(this, {
      storage: AsyncStorage,
      name: 'UIStore',
      properties: ['industry'],
    });
  }

  clear = () => {
    this.business_info = {};
    stopPersisting(this);
  };

  setIndustry = (key: IndustryKey) => {
    runInAction(() => {
      this.industry = key;
    });
  };

  setStore = (data: any) => {
    runInAction(() => {
      this.business_info = data || this.business_info || {};
      this.limit_location = data?.limit_location || this.limit_location || 1;
    });
  };
}
